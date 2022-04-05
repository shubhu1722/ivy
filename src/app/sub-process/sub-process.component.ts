import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewChild,
  ViewContainerRef,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ContextService } from '../services/commonServices/contextService/context.service';
import { ComponentLoaderService } from '../services/commonServices/component-loader/component-loader.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventServiceService } from '../services/commonServices/eventService/event-service.service';
import { ActionService } from '../services/action/action.service';
import { MetadataService } from '../services/commonServices/metadataService/metadata.service';
import { Router } from '@angular/router';
import { ContextActionService } from '../services/commonServices/contextActionService/context-action.service';
import { MatDrawer } from '@angular/material/sidenav';
import { serviceUrls } from '../../environments/serviceUrls';
import leftMenu from '../../assets/dell-motherboard_json/leftSideMenu/leftMenu.json';
import { HookService } from '../services/commonServices/hook-service/hook.service';
import { ComponentService } from '../services/commonServices/componentService/component.service';
import { UtilityService } from '../utilities/utility.service';
import { contextKeysEnum } from '../../app/utilities/constants';
import { BatchprocessService } from '../services/verifone/batchProcess/batchprocess.service';

@Component({
  selector: 'app-sub-process',
  templateUrl: './sub-process.component.html',
  styleUrls: ['./sub-process.component.scss']
})
export class SubProcessComponent implements OnInit {

  events: string[] = [];
  data: any = [];
  opened: boolean = true;
  leftsideNav: any = { sideNavHeader: [], sideNavBody: [], sideNavFooter: [] };
  rightsidenav: any = {};
  screenWidth: number;
  mode: "side";
  position: string;
  beforeInitHooks: any[];
  contractName: string = "";
  @Input() subMenuIndex: number;
  @Input() openRightNav: boolean;
  @Input() pcBodyClass: string;
  @Input() title: string;
  @Input() slWcName: string;
  @Input() clientName: string = "";
  @Input() pageContentHeader: any = {};
  @Input() pagecontentFooter: any = {};
  @Input() pageContentBody: any[] = [];
  @Input() hooks: any[];
  @Input() class: string;
  @Input() isAdmin:boolean=false;
  @Input() fetchDataFromPrevWC: boolean;
  hookMap = ['beforeInit', 'afterInit', 'beforeAction', 'afterAction'];

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('spleftnavheader', { static: true, read: ViewContainerRef }) spleftnavheader: ViewContainerRef;
  @ViewChild('spleftnavheader2', { static: true, read: ViewContainerRef }) spleftnavheader2: ViewContainerRef;
  @ViewChild('spleftnavbody', { static: true, read: ViewContainerRef }) spleftnavbody: ViewContainerRef;
  @ViewChild('spleftnavfooter', { static: true, read: ViewContainerRef }) spleftnavfooter: ViewContainerRef;
  @ViewChild('sprightnavheader', { static: true, read: ViewContainerRef }) sprightnavheader: ViewContainerRef;
  @ViewChild('sprightnavbody', { static: true, read: ViewContainerRef }) sprightnavbody: ViewContainerRef;
  @ViewChild('sprightnavfooter', { static: true, read: ViewContainerRef }) sprightnavfooter: ViewContainerRef;
  @ViewChild('sppageContent', { static: true, read: ViewContainerRef }) sppageContent: ViewContainerRef;
  @ViewChild('spheader', { static: true, read: ViewContainerRef }) spheader: ViewContainerRef;
  @ViewChild('spfooter', { static: true, read: ViewContainerRef }) spfooter: ViewContainerRef;
  @ViewChild('drawerright', { static: true }) public drawerright: MatDrawer;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });


  constructor(private componentLoaderService: ComponentLoaderService,
    private eventService: EventServiceService,
    private metadataService: MetadataService,
    private actionService: ActionService,
    private contextActionSevice: ContextActionService,
    private contextService: ContextService,
    private hookService: HookService,
    private _changeDetectionRef: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient, private componentService: ComponentService, private utiliyService: UtilityService, private batchProcessService: BatchprocessService) {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    };
  }

  ngOnInit(): void {
    this.contractName = this.contextService.getDataByKey("userSelectedContractName")
    this.fetchDataFromPrevWC = this.fetchDataFromPrevWC == undefined ? false : true;
    this.contextService.addToContext("fetchDataFromPrevWC", this.fetchDataFromPrevWC);
    this.contextService.addToContext("currentWC", this.title);
    this.slWcName != undefined ? this.contextService.addToContext("slWcName", this.slWcName) :
      this.contextService.addToContext("slWcName", null);
    this.contextService.addToContext('subBaseContainerRef', this.container);
    this.contextService.contextSubjectData('mainPageContentBodysp', this.sppageContent);
    let isClientAndScreenValid = this.contextService.handleClientAndScreenValidation();
    if (isClientAndScreenValid) {
      this.contextActionSevice.screenMenus()
    }
    //initializing leftsideNav
    this.initLeftNav();

    //initializing rightsideNav
    this.initRightNav();

    //component creation for left side nav Header
    this.leftsideNav.sideNavHeader.forEach((item) => {
      this.componentLoaderService.parseData(item, this.spleftnavheader);
    });

    this.leftsideNav.sideNavHeader2 && this.leftsideNav.sideNavHeader2.forEach((item) => {
      this.componentLoaderService.parseData(item, this.spleftnavheader2);
    });


    //component creation for left side nav Body
    this.leftsideNav.sideNavBody.forEach((item) => {
      this.componentLoaderService.parseData(item, this.spleftnavbody);
    });

    //component creation for left side Footer
    this.leftsideNav.sideNavFooter.forEach((item) => {
      this.componentLoaderService.parseData(item, this.spleftnavfooter);
    });
    if (this.rightsidenav && this.rightsidenav != undefined && this.rightsidenav.hasOwnProperty('position')) {
      //component creation for right side nav Header
      if (this.rightsidenav.sideNavHeader != undefined) {
        this.rightsidenav.sideNavHeader.forEach((item) => {
          item.rightsidenav = this.drawerright;
          this.componentLoaderService.parseData(item, this.sprightnavheader);
        });
      }

      //component creation for right side nav Body
      if (this.rightsidenav.sideNavBody != undefined) {
        this.rightsidenav.sideNavBody.forEach((item) => {
          this.componentLoaderService.parseData(item, this.sprightnavbody);
        });
      }
    }
    //component creation for Page Content Header
    if (this.pageContentHeader && this.pageContentHeader != undefined && this.pageContentHeader.hasOwnProperty('ctype')) {
      this.componentLoaderService.parseData(this.pageContentHeader, this.spheader);
    }

    //component creation for Page Content Footer
    if (this.pagecontentFooter && this.pagecontentFooter != undefined && this.pagecontentFooter.hasOwnProperty('ctype')) {
      this.componentLoaderService.parseData(this.pagecontentFooter, this.spfooter);
    }

    //component creation for Page Content Body
    if (this.pageContentBody && this.pageContentBody.length > 0) {
      this.pageContentBody.forEach((item) => {
        item.rightsidenav = this.drawerright;
        this.componentLoaderService.parseData(item, this.sppageContent);
      });
    } else {
      // nothing
    }

    if (this.hooks !== undefined) {
      this.beforeInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[0]);
      if (this.beforeInitHooks !== undefined && this.beforeInitHooks.length > 0) {
        this.hookService.handleHook(this.beforeInitHooks, this);
      }
    }

    let wiInfo = this.contextService.getDataByString("#getProcess.workInstructionInfo");
    let screenInfo = this.contextService.getDataByString("#getProcess.workInstructionsScreenInfo");
    if (wiInfo) {
      let permissionObj = wiInfo.permissions;
      if (permissionObj) {
        let screenName = this.contextService.getDataByKey("currentWC");
        let screenPermission = permissionObj[screenName];
        if (screenPermission != undefined && screenPermission == "true") {
          let level = wiInfo.Level;
          if (level) {
            let modelLevel = level.ModelLevel;
            let screenLevel = level.ScreenLevel;
            let isScreenFound = false;
            let paramlist = false;
            if (modelLevel) {
              let screens = modelLevel['Screens'];
              if (screens) {
                for (let i = 0; i < screens.length; i++) {
                  if (screenName == screens[i]) {
                    isScreenFound = true;
                    break;
                  }
                }
                if (isScreenFound) {
                  paramlist = modelLevel['params'];
                }
              }
            }

            if (!isScreenFound) {
              if (screenLevel) {
                let screens = screenLevel['Screens'];
                if (screens) {
                  for (let i = 0; i < screens.length; i++) {
                    if (screenName == screens[i]) {
                      isScreenFound = true;
                      break;
                    }
                  }
                  if (isScreenFound) {
                    paramlist = screenLevel['params'];
                    if (screenInfo) {
                      if (screenInfo[screenName]) {
                        paramlist["firstSource"] = screenInfo[screenName];
                      }
                    }
                  }
                }
              }
            }

            if (paramlist) {
              let paramList = this.contextService.getParsedObject(paramlist, this.utiliyService);
              this.getWorkInstructions(paramList);
            } else {
              this.getEmptyDataForWrkIns();
            }
          }
        }
      } else {
        this.getEmptyDataForWrkIns();
      }
    }
  }

  getWorkInstructions(params) {
    let repairUnitInfo = this.contextService.getDataByKey("repairUnitInfo");
    let url = serviceUrls['getWorkInstructions'] + "?";
    for (const param in params) {
      url = url.concat(`${param}`, "=", params[param], "&");
    }
    url = url.substring(0, url.length - 1);
    this.http.get(url).subscribe(res => {
      this.data = res;
      this.contextService.addToContext("workInstructions", this.data.data);
      let workInstructionsUpdateAction;
      if (this.data.message === null && this.data.status === false && this.data.data && this.data &&
        repairUnitInfo && repairUnitInfo.CLIENTNAME === "DELL" && repairUnitInfo.CONTRACTNAME === "DELL AIO") {
        workInstructionsUpdateAction = {
          type: 'updateComponent',
          "config": {
            "key": "workinstructionUUID",
            "properties": {
              "titleValue": "#workInstructions",
              "titleValueClass": "erroMsgWI",
              "errorMsg": true
            }
          }
        };
      }
      else if (this.data.status === false && repairUnitInfo && repairUnitInfo.CLIENTNAME === "DELL" && repairUnitInfo.CONTRACTNAME === "DELL AIO") {
        workInstructionsUpdateAction = {
          type: 'updateComponent',
          "config": {
            "key": "workinstructionUUID",
            "properties": {
              "noDataFound": true
            }
          }
        };
      } else {
        workInstructionsUpdateAction = {
          type: 'updateComponent',
          "config": {
            "key": "workinstructionUUID",
            "properties": {
              "titleValue": "#workInstructions"
            }
          }
        };
      }
      this.componentService.handleUpdateComponent(workInstructionsUpdateAction, null, null, this.utiliyService);
    });
  }
  getEmptyDataForWrkIns() {
    let workInstructionsUpdateAction = {
      type: 'updateComponent',
      "config": {
        "key": "workinstructionUUID",
        "properties": {
          "titleValue": ""
        }
      }
    };
    this.componentService.handleUpdateComponent(workInstructionsUpdateAction, null, null, this.utiliyService);
  }

  initLeftNav() {
    this.subMenuIndex ? this.subMenuIndex : 0;
    if (this.clientName && this.clientName == "HP") {
      this.leftsideNav = {
        "position": "start",
        "opened": "true",
        "menuItemscroll": "menu_scrollable",
        "sideNavHeader": [
          {
            "ctype": "title",
            "uuid": "BCNTitle",
            "titleValue": "#discrepancyUnitInfo.ITEM_BCN",
            "titleClass": "#receiptDateborder"
          },
          {
            "ctype": "title",
            "title": "Due: ",
            "titleValue": "#receiptDateForDiscrepancy.localDateTime",
            "uuid": "DueUUID",
            "titleClass": "#receiptDateTitle"
          },
          {
            "ctype": "title",
            "title": "Serial Number:",
            "titleValue": "#discrepancyUnitInfo.SERIAL_NO",
            "uuid": "SerialUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "title",
            "title": "Platform:",
            "titleValue": "#discrepancyPartAndWarrantyDetails.PRODUCT_PLATFORM",
            "uuid": "EliteUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "title",
            "title": "Description:",
            "titleValue": "#discrepancyPartAndWarrantyDetails.PART_DESC",
            "uuid": "FamilyUUID",
            "titleClass": "sidenav-title height-scrol body2"
          },
          {
            "ctype": "title",
            "title": "Warranty:",
            "titleValue": "#discrepancyPartAndWarrantyDetails.WARRANTY_STATUS",
            "uuid": "WarrantyUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "divider",
            "dividerClass": "divider_cls"
          },
          {
            "ctype": "iconText",
            "iconTextClass": "sidenav-text body cursor",
            "uuid": "IconUUID",
            "icon": "description",
            "text": "E-Traveller",
            "textCss": "",
            "iconPosition": "Before",
            "actions": [
              {
                "type": "openEtraveller",
                "config": {
                  "title": "eTraveller",
                  "keyDataVisible": true,
                  "itemHistoryVisible": true,
                  "flexFieldVisible": true,
                  "partsVisible" : true,
                  "repositoryVisible":true
                },
                "items": [
                  {
                    "ctype": "keyData",
                    "label": "key Data",
                    "items": [
                      {
                        "unitDetailTitle": "Unit Details",
                        "ctype": "keyDataUnitDetails",
                        "UUID": "unitDetailsUUID",
                        "unitDetailItems": [
                          {
                            "leftColumnData": [
                              {
                                "label": "Unit BCN",
                                "value": "#discrepancyUnitInfo.ITEM_BCN"
                              },
                              {
                                "label": "Serial number",
                                "value": "#discrepancyUnitInfo.SERIAL_NO"
                              },
                              {
                                "label": "FAT",
                                "value": "#discrepancyUnitInfo.FAT"
                              }, {
                                "label": "Model number",
                                "value": "#discrepancyUnitInfo.PART_NO"
                              },{
                                "label": "Description",
                                "value": "#discrepancyPartAndWarrantyDetails.PART_DESC"
                              },
                              {
                                "label": "Platform",
                                "value": "#discrepancyPartAndWarrantyDetails.PRODUCT_PLATFORM"
                              }, {
                                "label": "RepairTypeCode",
                                "value": "#getRepairTypeCodeByRODetails"
                              }, {
                                "label": "RERepairCSOID",
                                "value": "#getRERepairCSOIDByRODetails"
                              },
                              {
                                "label": "RERepairDays",
                                "value": "#getRRERepairDaysByRODetails"
                              }
                            ]
                          },
                          {
                            "rightColumnData": [
                              {
                                "label": "Hold Status",
                                "value": "#discrepancyUnitInfo.STATUS"
                              },
                              {
                                "label": "Storage Hold code",
                                "value": "#getEtravellerHoldReleaseDetailService.storateHoldCode"
                              },
                              {
                                "label": "Storage Hold Code Desc",
                                "value": "#getEtravellerHoldReleaseDetailService.storateHoldSubCode"
                              },
                              {
                                "label": "Location",
                                "value": "#discrepancyUnitInfo.GEONAME"
                              },
                              {
                                "label": "Warehouse",
                                "value": "#discrepancyUnitInfo.WAREHOUSE_NAME"
                              },
                              {
                                "label": "Zone",
                                "value": "#getEtravellerHoldReleaseDetailService.destStkLocationName"
                              },
                              {
                                "label": "Bin",
                                "value": "#getEtravellerHoldReleaseDetailService.bin"
                              }, {
                                "label": "Client",
                                "value": "#discrepancyUnitInfo.CLIENTNAME"
                              },
                              {
                                "label": "Contract",
                                "value": "#discrepancyUnitInfo.CONTRACTNAME"
                              },
                              {
                                "label": "Workcenter",
                                "value": "#discrepancyUnitInfo.WORKCENTER"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "label": "Customer Complaint",
                        "UUID": "customerComplainUUID",
                        "customerComplainTitle": "Customer Complaint",
                        "customerComplainItems": [
                          {
                            "ctype": "title",
                            "uuid": "customerComplaintHeaderUUID",
                            "titleClass": "sidenav-title body2",
                            "title": "Customer Complaint",
                            "titleValue": ""
                          },
                          {
                            "ctype": "showMore",
                            "uuid": "customerComplaintTitleUUID",
                            "titleClass": "sidenav-title body2",
                            "text": "#getInitialDetailsAssessment.customerComplaints",
                            "isShown": true
                          },
                          {
                            "ctype": "title",
                            "uuid": "failCodeUUID",
                            "titleClass": "sidenav-title body2 os-field",
                            "title": "Fail Code:",
                            "titleValue": "#getInitialDetailsAssessment.failCode"
                          },
                          {
                            "ctype": "title",
                            "uuid": "osReinstallUUID",
                            "titleClass": "sidenav-title body2",
                            "title": "OS reinstall allowed:",
                            "titleValue": "#getInitialDetailsAssessment.osReinstallAllowed"
                          },
                          {
                            "ctype": "title",
                            "uuid": "bsodFieldUUID",
                            "titleClass": "sidenav-title body2",
                            "title": "BSOD Problem:",
                            "titleValue": "#getInitialDetailsAssessment.bsod"
                          },
                          {
                            "ctype": "title",
                            "uuid": "winPasswordUUID",
                            "titleClass": "sidenav-title body2",
                            "title": "Windows password:",
                            "titleValue": "#getInitialDetailsAssessment.windowsPassword"
                          },
                          {
                            "ctype": "title",
                            "uuid": "biosVersionTitleUUID",
                            "titleClass": "sidenav-title body2",
                            "title": "Expected Bios Version:",
                            "titleValue": "#getBiosAlertDetailsAssessment.0.bios"
                          },
                          {
                            "ctype": "title",
                            "uuid": "osLanguageUUID",
                            "titleClass": "sidenav-title body2",
                            "title": "OS Language:",
                            "titleValue": "#getInitialDetailsAssessment.osLanguage"
                          },
                          {
                            "ctype": "title",
                            "uuid": "softwareVersionTitleUUID",
                            "titleClass": "sidenav-title body2 os-field",
                            "title": "OS Version:",
                            "titleValue": "#getSoftwareAlertDetailsAssessment.0.software"
                          }
                        ]
                      },
                      {
                        "UUID": "orderDetailsUUID",
                        "orderDetailsTitle": "Order Details",
                        "orderDetailsItems": [
                          {
                            "label": "Reference Order",
                            "value": "#getETravellerCurrPrevRODetailsBySN.0.referenceOrderId"
                          },
                          {
                            "label": "Create Date",
                            "value": "#getETravellerCurrPrevRODetailsBySN.0.roCreatedDate"
                          }, {
                            "label": "ServiceTypeCode",
                            "value": "#getServiceTypeCodeByRODetails"
                          },
                          {
                            "space": true,
                            "spaceStyle": "padding:5%"
                          },
                          {
                            "label": "Receipt Date",
                            "value": "#getReceiptIdByItem.0.receiptTimeStamp"
                          },
                          {
                            "label": "Inbound AWB",
                            "value": "#getInboundAWBByRODetails"
                          },
                          {
                            "label": "Tracking No",
                            "value": "#getReceiptIdByItem.0.trackingNo"
                          },
                          {
                            "space": true,
                            "spaceStyle": "padding:3%"
                          },
                          {
                            "label": "Work Order No",
                            "value": "#discrepancyUnitInfo.WORKORDER_ID"
                          },
                          {
                            "label": "TransactionCommentText",
                            "value": "#getkeyDataCustomerResponse.tranCmntText"
                          },
                          {
                            "space": true,
                            "spaceStyle": "padding:3%"
                          },
                          {
                            "label": "Outbound order No",
                            "value": "#getETravellerShipmentDetails.0.outBoundOrderId"
                          },
                          {
                            "label": "Packing List No",
                            "value": "#finalGetAllItemHistoryData.shipmentId"
                          },
                          {
                            "label": "Service Type",
                            "value": "#shippingTermsDetails.serviceTypeCode"
                          }, {
                            "label": "Tracking No",
                            "value": "#finalGetAllItemHistoryData.trackingNumber"
                          },

                        ]
                      }
                    ]

                  }
                ],

                "eventSource": "click"
              }
            ]
          }
        ],
        "sideNavBody": [
          {
            "ctype": "menutree",
            "uuid": "menuTreeUUID",
            "menuListClass": "body2",
            "menuData": "#SubprocessMenu",
            "childIndex": this.subMenuIndex
          }
        ],
        "sideNavFooter": [
          {
            "ctype": "iconText",
            "text": "#userAccountInfo.PersonalDetails.USERID",
            "iconTextClass": "user-cls",
            "textClass": "body",
            "icon": "account_circle"
          },
          {
            "ctype": "iconText",
            "text": "Logout",
            "iconTextClass": "logout-cls",
            "icon": "power_settings_new",
            "textClass": "body",
            "actions": [
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "login.json",
                  "mode": "local",
                  "clearContext": true
                },
                "eventSource": "click"
              }
            ]
          }
        ]
      };
    } else if (this.clientName && this.clientName == "HP_Receving") {
      this.leftsideNav = {
        "position": "start",
        "opened": "true",
        "menuItemscroll": "menu_scrollable",
        "sideNavHeader": [
          {
            "ctype": "title",
            "title": "",
            "uuid": "titleUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "title",
            "title": "Platform:",
            "uuid": "platformTitleUUID",
            "titleClass": "sidenav-title body2",
            "visibility": false
          },
          {
            "ctype": "title",
            "title": "Description:",
            "uuid": "descriptionTitleUUID",
            "titleClass": "sidenav-title body2",
            "visibility": false
          },
          {
            "ctype": "title",
            "title": "Serial Number:",
            "uuid": "serialNumberTitleUUID",
            "titleClass": "sidenav-title body2",
            "visibility": false
          },
          {
            "ctype": "title",
            "title": "Warranty:",
            "uuid": "warrantyTitleUUID",
            "titleClass": "sidenav-title body2",
            "visibility": false
          }
        ],
        "sideNavBody": [
          {
            "ctype": "menutree",
            "uuid": "menuTreeUUID",
            "menuListClass": "body2",
            "menuData": "#SubprocessMenu"
          }
        ],
        "sideNavFooter": [
          {
            "ctype": "iconText",
            "text": "#userAccountInfo.PersonalDetails.USERID",
            "iconTextClass": "user-cls",
            "textClass": "body",
            "icon": "account_circle"
          },
          {
            "ctype": "iconText",
            "text": "Logout",
            "iconTextClass": "logout-cls",
            "icon": "power_settings_new",
            "textClass": "body",
            "actions": [
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "login.json",
                  "mode": "local",
                  "clearContext": true
                },
                "eventSource": "click"
              }
            ]
          }
        ]
      };
    } else if (this.clientName && this.clientName == "CISCO") {
      if (this.title == "MyUnits") {
        this.leftsideNav = {
          "position": "start",
          "opened": "true",
          "sideNavHeader": [

          ],
          "sideNavBody": [

          ],
          "sideNavFooter": [
            {
              "ctype": "iconText",
              "text": "#userAccountInfo.PersonalDetails.USERID",
              "iconTextClass": "user-cls",
              "textClass": "body2",
              "icon": "account_circle"
            },
            {
              "ctype": "iconText",
              "text": "Logout",
              "iconTextClass": "logout-cls",
              "icon": "power_settings_new",
              "textClass": "body2",
              "actions": [
                {
                  "type": "renderTemplate",
                  "config": {
                    "templateId": "login.json",
                    "mode": "local",
                    "clearContext": true
                  },
                  "eventSource": "click"
                }
              ]
            }
          ]
        };
      } else {
        this.leftsideNav = {
          "position": "start",
          "opened": "true",
          "sideNavHeader": [
            {
              "ctype": "title",
              "title": "SN: ",
              "titleValue": "#UnitInfo.SERIAL_NO",
              "uuid": "SNUUID",
              "titleClass": "sidenav-header heading1"
            },
            {
              "ctype": "title",
              "title": "PID-",
              "titleValue": "#UnitInfo.PART_NO",
              "uuid": "PIDUUID",
              "titleClass": "sidenav-title body2"
            },
            {
              "ctype": "title",
              "title": "BCN-",
              "titleValue": "#UnitInfo.ITEM_BCN",
              "uuid": "titleUUID",
              "titleClass": "sidenav-title body2"
            },
            {
              "ctype": "divider",
              "dividerClass": "divider_cls"
            },
            {
              "ctype": "iconText",
              "iconTextClass": "sidenav-text body cursor",
              "uuid": "IconUUID",
              "icon": "description",
              "text": "E-Traveller",
              "textCss": "",
              "iconPosition": "Before",
              "actions": [
                {
                  "type": "openEtraveller",
                  "config": {
                    "title": "Item history",
                  },
                  "eventSource": "click"
                }
              ]
            }
          ],
          "sideNavBody": [
            {
              "ctype": "menutree",
              "uuid": "menuTreeUUID",
              "menuListClass": "body2",
              "menuData": "#SubprocessMenu",
              "childIndex": this.subMenuIndex
            }
          ],
          "sideNavFooter": [
            {
              "ctype": "iconText",
              "text": "#userAccountInfo.PersonalDetails.USERID",
              "iconTextClass": "user-cls",
              "textClass": "body2",
              "icon": "account_circle"
            },
            {
              "ctype": "iconText",
              "text": "Logout",
              "iconTextClass": "logout-cls",
              "icon": "power_settings_new",
              "textClass": "body2",
              "actions": [
                {
                  "type": "renderTemplate",
                  "config": {
                    "templateId": "login.json",
                    "mode": "local",
                    "clearContext": true
                  },
                  "eventSource": "click"
                }
              ]
            }
          ]
        };
      }
    } else if (this.title && this.clientName && this.clientName == "VeriFone" && (this.title == "LOAD STATION (H5000)")) {
      // let verifoneHeaderData = this.contextService.getDataByKey("verifoneUnitHeaderData");
      // console.log("verfoneHeaderData", verifoneHeaderData);
      this.leftsideNav = {
        "position": "start",
        "opened": "true",
        "sideNavHeader": [
          {
            "ctype": "title",
            "title": "SN: ",
            "titleValue": "#verifoneUnitHeaderData.serialNo",
            "uuid": "SNUUID",
            "titleClass": "sidenav-header heading1"
          },
          {
            "ctype": "title",
            "title": "Model Name:",
            "titleValue": "#verifoneUnitHeaderData.modelName",
            "uuid": "",
            "titleClass": "date-text mb-0 mt-2"
          },
          {
            "ctype": "title",
            "title": "Customer:",
            "titleValue": "#verifoneUnitHeaderData.customer",
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "RMA:",
            "titleValue": "#verifoneUnitHeaderData.rma",
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "MRA:",
            "titleValue": "#verifoneUnitHeaderData.mra",
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "Country:",
            "titleValue": "#verifoneUnitHeaderData.country",
            "uuid": "",
            "titleClass": "date-text"
          },
          {
            "ctype": "divider",
            "dividerClass": "divider_cls"
          },
          {
            "ctype": "iconText",
            "iconTextClass": "sidenav-text body cursor",
            "uuid": "IconUUID",
            "icon": "description",
            "text": "E-Traveller",
            "textCss": "",
            "iconPosition": "Before",
            "actions": [
              {
                "type": "openEtraveller",
                "config": {
                  "title": "Item history",
                },
                "eventSource": "click"
              }
            ]
          },
          {
            "ctype": "iconText",
            "iconTextClass": "sidenav-text body cursor",
            "uuid": "VewNotesIconUUID",
            "icon": "chat",
            "text": "View Notes (0)",
            "textCss": "",
            "iconPosition": "Before",
            "actions": [
              {
                "type": "openEtraveller",
                "eventSource": "click"
              }
            ]
          },
        ],
        "sideNavBody": [
          {
            "ctype": "menutree",
            "uuid": "menuTreeUUID",
            "menuListClass": "body2",
            "menuData": "#SubprocessMenu",
            "childIndex": this.subMenuIndex
          }
        ],
        "sideNavFooter": [
          {
            "ctype": "iconText",
            "text": "#userAccountInfo.PersonalDetails.USERID",
            "iconTextClass": "user-cls",
            "textClass": "body2",
            "icon": "account_circle"
          },
          {
            "ctype": "iconText",
            "text": "Logout",
            "iconTextClass": "logout-cls",
            "icon": "power_settings_new",
            "textClass": "body2",
            "actions": [
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "login.json",
                  "mode": "local",
                  "clearContext": true
                },
                "eventSource": "click"
              }
            ]
          }
        ]
      };
    } else if (this.title && this.clientName && this.clientName == "VeriFone" && (this.title == "Receiving")) {
      //let verifoneHeaderData = this.contextService.getDataByKey("verifoneUnitHeaderData");
      // console.log("verfoneHeaderData", verifoneHeaderData);
      let verifoneHeaderData = this.contextService.getDataByKey("verifoneUnitHeaderData");
      let verifoneUnitHeaderData = { "modelNumber": "", "customer": "", "rma": "", "mra": "", "country": "" };
      if (verifoneHeaderData && verifoneHeaderData["ReceivingLPanelDetails"][0]) {
        verifoneUnitHeaderData = verifoneHeaderData["ReceivingLPanelDetails"][0];
      }

      this.leftsideNav = {
        "position": "start",
        "opened": "true",
        "sideNavHeader": [
          {
            "ctype": "title",
            "title": "SN: ",
            "titleValue": "#verifoneReceivingScanSerialNumberResp.OrderSerialNumber",
            "uuid": "SNUUID",
            "titleClass": "sidenav-header heading1"
          },
          {
            "ctype": "title",
            "title": "Model Name:",
            "titleValue": verifoneUnitHeaderData["modelNumber"],
            "uuid": "",
            "titleClass": "date-text mb-0 mt-2"
          },
          {
            "ctype": "title",
            "title": "Customer:",
            "titleValue": verifoneUnitHeaderData["customer"],
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "RMA:",
            "titleValue": verifoneUnitHeaderData["rma"],
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "MRA:",
            "titleValue": verifoneUnitHeaderData["mra"],
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "Country:",
            "titleValue": verifoneUnitHeaderData["country"],
            "uuid": "",
            "titleClass": "date-text"
          }
        ],
        "sideNavBody": [
          {
            "ctype": "menutree",
            "uuid": "menuTreeUUID",
            "menuListClass": "body2",
            "menuData": "#SubprocessMenu",
            "childIndex": this.subMenuIndex
          }
        ],
        "sideNavFooter": [
          {
            "ctype": "iconText",
            "text": "#userAccountInfo.PersonalDetails.USERID",
            "iconTextClass": "user-cls",
            "textClass": "body2",
            "icon": "account_circle"
          },
          {
            "ctype": "iconText",
            "text": "Logout",
            "iconTextClass": "logout-cls",
            "icon": "power_settings_new",
            "textClass": "body2",
            "actions": [
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "login.json",
                  "mode": "local",
                  "clearContext": true
                },
                "eventSource": "click"
              }
            ]
          }
        ]
      };
    } else if (this.title && this.clientName && this.clientName == "VeriFone" && (this.title == "Blind Receiving")) {
      //let verifoneHeaderData = this.contextService.getDataByKey("verifoneUnitHeaderData");
      // console.log("verfoneHeaderData", verifoneHeaderData);
      let verifoneHeaderData = this.contextService.getDataByKey("verifoneUnitHeaderData");
      let verifoneUnitHeaderData = { "modelNumber": "", "customer": "", "rma": "", "mra": "", "country": "" };
      if (verifoneHeaderData && verifoneHeaderData["ReceivingLPanelDetails"][0]) {
        verifoneUnitHeaderData = verifoneHeaderData["ReceivingLPanelDetails"][0];
      }

      this.leftsideNav = {
        "position": "start",
        "opened": "true",
        "sideNavHeader": [
          {
            "ctype": "title",
            "title": "",
            "titleValue": "#verifoneReceivingScanSerialNumberResp.OrderSerialNumber",
            "uuid": "SNUUID",
            "titleClass": "sidenav-header heading1"
          },
          {
            "ctype": "title",
            "title": "",
            "titleValue": "",
            "uuid": "",
            "titleClass": "date-text mb-0 mt-2"
          },
          {
            "ctype": "title",
            "title": "",
            "titleValue": "",
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "",
            "titleValue": "",
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "",
            "titleValue": "",
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "",
            "titleValue": "",
            "uuid": "",
            "titleClass": "date-text"
          }
        ],
        "sideNavBody": [
          {
            "ctype": "menutree",
            "uuid": "menuTreeUUID",
            "menuListClass": "body2",
            "menuData": "#SubprocessMenu",
            "childIndex": this.subMenuIndex
          }
        ],
        "sideNavFooter": [
          {
            "ctype": "iconText",
            "text": "#userAccountInfo.PersonalDetails.USERID",
            "iconTextClass": "user-cls",
            "textClass": "body2",
            "icon": "account_circle"
          },
          {
            "ctype": "iconText",
            "text": "Logout",
            "iconTextClass": "logout-cls",
            "icon": "power_settings_new",
            "textClass": "body2",
            "actions": [
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "login.json",
                  "mode": "local",
                  "clearContext": true
                },
                "eventSource": "click"
              }
            ]
          }
        ]
      };
    } else if (this.clientName && this.clientName == "VeriFone" && this.title == "VMI" || this.title == "Soldering" || this.title == "Reassembly" || this.title == "SW LOADING" || this.title == "Accessory Test" || this.title == "Hold" || this.title == "OBE" || this.title == "VERI SCRAP") {

      let dueDate;
      let dueColor;
      let rmaNumber;
      let dueDays;
      let leftHeaderReceivingObj;
      let leftHeaderBlockObj;
      let problemObj = { "externalValueOrderValue": "-", "problemSummaryValue": "-", "problemFoundValue": "-", "problemReportedValue": "-", "assetNoValue": "-" };
      console.log(this.contextService.getDataByKey("verifoneLeftHeaderData"));
      if (this.contextService.getDataByKey("verifoneLeftHeaderData") && this.contextService.getDataByKey("verifoneLeftHeaderData")["ReceivingLPanelDetails"] && this.contextService.getDataByKey("verifoneLeftHeaderData")["ReceivingLPanelDetails"][0]) {
        leftHeaderReceivingObj = this.contextService.getDataByKey("verifoneLeftHeaderData")["ReceivingLPanelDetails"][0];
      }
      if (this.contextService.getDataByKey("verifoneLeftHeaderData") && this.contextService.getDataByKey("verifoneLeftHeaderData")["blockDetails"]) {
        leftHeaderBlockObj = this.contextService.getDataByKey("verifoneLeftHeaderData")["blockDetails"];
      }

      var datePipe = new DatePipe('en-us');

      if (this.contextService.getDataByKey("wcDueDateData") && this.contextService.getDataByKey("wcDueDateData")[0]) {
        dueDate = this.contextService.getDataByKey("wcDueDateData")[0]['operationsDueDate'].split(" ")[0];
        dueDate = datePipe.transform(dueDate, 'dd-MMM-yyyy');
        dueColor = this.contextService.getDataByKey("wcDueDateData")[0]['color'].toLowerCase();
        rmaNumber = this.contextService.getDataByKey("wcDueDateData")[0]['rmaNumber'];
        dueDays = this.contextService.getDataByKey("wcDueDateData")[0]['dueDays'];
      }
      if (this.contextService.getDataByKey("ROFFData")) {
        let roffData = this.contextService.getDataByKey("ROFFData");
        for (let i = 0; i < roffData.length; i++) {
          if (roffData[i]['flexFieldName'] === "External_Order_Number") {
            problemObj.externalValueOrderValue = roffData[i]['flexFieldValue'] ? roffData[i]['flexFieldValue'] : '-';
          } else if (roffData[i]['flexFieldName'] === "Problem_Summary") {
            problemObj.problemSummaryValue = roffData[i]['flexFieldValue'] ? roffData[i]['flexFieldValue'] : '-';
          } else if (roffData[i]['flexFieldName'] === "Problem_Found") {
            problemObj.problemFoundValue = roffData[i]['flexFieldValue'] ? roffData[i]['flexFieldValue'] : '-';
          } else if (roffData[i]['flexFieldName'] === "Problem_Reported") {
            problemObj.problemReportedValue = roffData[i]['flexFieldValue'] ? roffData[i]['flexFieldValue'] : '-';
          } else if (roffData[i]['flexFieldName'] === "Asset_No") {
            problemObj.assetNoValue = roffData[i]['flexFieldValue'] ? roffData[i]['flexFieldValue'] : '-';
          }
        }
      }

      let PART_DESC = this.contextService.getDataByString("#UnitInfo.PART_DESC");
      this.leftsideNav = {
        "position": "start",
        "opened": "true",
        "sideNavHeader": [
          {
            "ctype": "title",
            "title": "",
            "titleValue": "#UnitInfo.SERIAL_NO",
            "uuid": "SNUUID",
            "titleClass": "sidenav-header heading1 " + dueColor
          },
          {
            "ctype": "title",
            "title": "",
            "titleValue": "Due : " + (dueDate ? dueDate : "") + (dueDays ? " (" + dueDays + " days)" : ''),
            "uuid": "verifoneWCDueDateUUID",
            "titleClass": "sidenav-header " + dueColor
          },
          {
            "ctype": "divider",
            "dividerClass": "divider_cls"
          },
          // {
          //   "ctype": "title",
          //   "title": "",
          //   "titleValue": leftHeaderReceivingObj["modelNumber"],
          //   "uuid": "",
          //   "titleClass": "date-text mb-1 mt-2"
          // },
          // {
          //   "ctype": "title",
          //   "title": "",
          //   "titleValue": leftHeaderReceivingObj["partNo"],
          //   "uuid": "",
          //   "titleClass": "date-text mb-1"
          // },
          // {
          //   "ctype": "title",
          //   "title": "",
          //   "titleValue": PART_DESC,
          //   "uuid": "",
          //   "titleClass": "date-text mb-1 elipses-text",
          //   "verifoneLeftSidetooltip": PART_DESC
          // },
          // {
          //   "ctype": "title",
          //   "title": "",
          //   "titleValue": leftHeaderReceivingObj["customer"],
          //   "uuid": "",
          //   "titleClass": "date-text mb-1 elipses-text",
          //   "verifoneLeftSidetooltip": leftHeaderReceivingObj["customer"],
          // },
          // {
          //   "ctype": "title",
          //   "title": "Country:",
          //   "titleValue": leftHeaderReceivingObj["country"],
          //   "uuid": "",
          //   "titleClass": "date-text mb-1"
          // },
          // {
          //   "ctype": "title",
          //   "title": "MRA: ",
          //   "titleValue": leftHeaderReceivingObj["mra"],
          //   "uuid": "",
          //   "titleClass": "date-text mb-1"
          // },
          {
            "ctype": "divider",
            "dividerClass": "divider_cls"
          },
          // {
          //   "ctype": "title",
          //   "title": "RMA: ",
          //   "titleValue": rmaNumber,
          //   "uuid": "",
          //   "titleClass": "date-text mb-1 mt-2"
          // },
          // {
          //   "ctype": "title",
          //   "title": "P.Found: ",
          //   "titleValue": problemObj.problemFoundValue,
          //   "uuid": "",
          //   "titleClass": "date-text mb-1"
          // },
          // {
          //   "ctype": "title",
          //   "title": "P.Reported: ",
          //   "titleValue": problemObj.problemReportedValue,
          //   "uuid": "",
          //   "titleClass": "date-text mb-1"
          // },
          // {
          //   "ctype": "title",
          //   "title": "P.Summary: ",
          //   "titleValue": problemObj.problemSummaryValue,
          //   "uuid": "",
          //   "titleClass": "date-text mb-2"
          // },
          {
            "ctype": "divider",
            "dividerClass": "divider_cls"
          },
          {
            "ctype": "title",
            "title": "Block:",
            "titleValue": "#unitBlockData",
            "uuid": "blockUnitUUID",
            "titleClass": "date-text mb-2 mt-2 text-white"
          },
          {
            "ctype": "divider",
            "dividerClass": "divider_cls"
          },
          {
            "ctype": "iconText",
            "iconTextClass": "sidenav-text body cursor",
            "uuid": "IconUUID",
            "icon": "description",
            "text": "E-Traveller",
            "textCss": "",
            "iconPosition": "Before",
            "actions": [
              {
                "type": "openEtraveller",
                "config": {
                  "title": "Item history",
                },
                "eventSource": "click"
              }
            ]
          },
          {
            "ctype": "iconText",
            "iconTextClass": "sidenav-text body cursor",
            "uuid": "IconUUID",
            "icon": "description",
            "text": "View Notes (0)",
            "textCss": "",
            "iconPosition": "Before",
            "actions": [
            ]
          }
        ],
        "sideNavBody": [
        ],
        "sideNavFooter": [
          {
            "ctype": "iconText",
            "text": "#userAccountInfo.PersonalDetails.USERID",
            "iconTextClass": "user-cls",
            "textClass": "body2",
            "icon": "account_circle"
          },
          {
            "ctype": "iconText",
            "text": "Logout",
            "iconTextClass": "logout-cls",
            "icon": "power_settings_new",
            "textClass": "body2",
            "actions": [
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "login.json",
                  "mode": "local",
                  "clearContext": true
                },
                "eventSource": "click"
              }
            ]
          }
        ]
      };
    } else if (
      this.clientName && this.clientName == "VeriFone" && this.title == "LOAD STATION PROCESS"
      || this.title == "RMA List"
      || this.title == "Quick Receiving"
      || this.title == "CA-Keying"
      || this.title == "ITALY-Keying"
      || this.title == "L2RKL-Keying"
      || this.title == "P2PE-Keying"
      || this.title == "TMS-Keying"
      || this.title == "TOTAL-Keying"
      || this.title == "VERIINIT"
      || this.title == "HERD-Keying"
      || this.title == "IDS-Keying"
      || this.title == "ITALYPARA-Keying"
      || this.title == "OSLOADING-Keying"
      || this.title == "PARA-Keying"
      || this.title == "PERSO-Keying"
      || this.title == "UXPARA-Keying"
      || this.title == "VHQ-Keying"
    ) {


      this.leftsideNav = {
        "position": "start",
        "opened": "true",
        "sideNavHeader": [
          {
            "ctype": "title",
            "title": "",
            "titleValue": "",
            "uuid": "SNUUID",
            "titleClass": "sidenav-header heading1 "
          },
          {
            "ctype": "title",
            "title": "",
            "titleValue": "",
            "uuid": "verifoneWCDueDateUUID",
            "titleClass": "sidenav-header "
          },
          {
            "ctype": "divider",
            "dividerClass": "divider_cls"
          },
          {
            "ctype": "title",
            "title": "-",
            "titleValue": "",
            "uuid": "",
            "titleClass": "date-text mb-0 mt-2"
          },
          {
            "ctype": "title",
            "title": "-",
            "titleValue": "",
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "",
            "titleValue": "",
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "",
            "titleValue": "",
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "",
            "titleValue": "",
            "uuid": "",
            "titleClass": "date-text mb-0 mt-2"
          },
          {
            "ctype": "title",
            "title": "",
            "titleValue": "",
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "",
            "titleValue": "",
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "",
            "titleValue": "",
            "uuid": "",
            "titleClass": "date-text mb-0"
          },
          {
            "ctype": "title",
            "title": "",
            "titleValue": "",
            "uuid": "",
            "titleClass": "date-text mb-0"
          }
        ],
        "sideNavBody": [
          {
            "ctype": "menutree",
            "uuid": "menuTreeUUID",
            "menuListClass": "body2",
            "menuData": "#SubprocessMenu",
            "childIndex": this.subMenuIndex
          }
        ],
        "sideNavFooter": [
          {
            "ctype": "iconText",
            "text": "#userAccountInfo.PersonalDetails.USERID",
            "iconTextClass": "user-cls",
            "textClass": "body2",
            "icon": "account_circle"
          },
          {
            "ctype": "iconText",
            "text": "Logout",
            "iconTextClass": "logout-cls",
            "icon": "power_settings_new",
            "textClass": "body2",
            "actions": [
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "login.json",
                  "mode": "local",
                  "clearContext": true
                },
                "eventSource": "click"
              }
            ]
          }
        ]
      };
    } else if (this.clientName && this.clientName == "DELL_Receving" && this.contractName && this.contractName.toLowerCase() == "dell aio") {
      this.getTopLeftHeaderData();
      if (this.contextService.getDataByKey("userSelectedLocation") == "1244") {
        this.leftsideNav = {
          "position": "start",
          "opened": "true",
          "sideNavHeader": [
            {
              "ctype": "title",
              "title": "SN:",
              "uuid": "dellSNUUID",
              "titleValue": "#userSearchCriteria.unitIdentificationValue",
              "titleClass": "sidenav-title body2",
              "visibility": true
            },
            {
              "ctype": "title",
              "title": "DPS Type:",
              "uuid": "dellDpsTitleUUID",
              "titleClass": "sidenav-title body2",
              "titleValue": "#dellLeftSideDpsType",
              "visibility": "#topLeftHeaderDataVisibity"
            },
            {
              "ctype": "title",
              "title": "DRR:",
              "uuid": "dellDRRTitleUUID",
              "titleClass": "sidenav-title body2",
              "titleValue": "#dellLeftSideDrr",
              "visibility": "#topLeftHeaderDataVisibity"
            },
            {
              "ctype": "title",
              "title": "LOB:",
              "uuid": "dellLobUUID",
              "titleClass": "sidenav-title body2",
              "titleValue": "#dellLeftSideLob",
              "visibility": "#topLeftHeaderDataVisibity"
            },
            {
              "ctype": "title",
              "title": "SLA:",
              "uuid": "dellSlaUUID",
              "titleClass": "sidenav-title body2",
              "titleValue": "#dellLeftSideSla",
              "visibility": "#topLeftHeaderDataVisibity"
            },
            {
              "ctype": "title",
              "title": "Warranty:",
              "uuid": "dellWarrentyUUID",
              "titleClass": "sidenav-title body2",
              "titleValue": "#dellLeftSideWarranty",
              "visibility": "#topLeftHeaderDataVisibity"
            }
          ],
          "sideNavBody": [
            {
              "ctype": "menutree",
              "uuid": "menuTreeUUID",
              "menuListClass": "body2",
              "menuData": "#SubprocessMenu"
            }
          ],
          "sideNavFooter": [
            {
              "ctype": "iconText",
              "text": "#userAccountInfo.PersonalDetails.USERID",
              "iconTextClass": "user-cls",
              "textClass": "body",
              "icon": "account_circle"
            },
            {
              "ctype": "iconText",
              "text": "Logout",
              "iconTextClass": "logout-cls",
              "icon": "power_settings_new",
              "textClass": "body",
              "actions": [
                {
                  "type": "renderTemplate",
                  "config": {
                    "templateId": "login.json",
                    "mode": "local",
                    "clearContext": true
                  },
                  "eventSource": "click"
                }
              ]
            }
          ]
        };
      } else {
        this.leftsideNav = {
          "position": "start",
          "opened": "true",
          "sideNavHeader": [
            {
              "ctype": "title",
              "title": "SN:",
              "uuid": "dellSNUUID",
              "titleValue": "#userSearchCriteria.unitIdentificationValue",
              "titleClass": "sidenav-title body2",
              "visibility": true
            },
            {
              "ctype": "title",
              "title": "ENTITLEMENT:",
              "uuid": "dellEntitlementUUID",
              "titleClass": "sidenav-title body2",
              "titleValue": "#dellLeftSideEntitlement",
              "visibility": "#topLeftHeaderDataVisibity"
            },
            {
              "ctype": "title",
              "title": "DPS Type:",
              "uuid": "dellDpsTitleUUID",
              "titleClass": "sidenav-title body2",
              "titleValue": "#dellLeftSideDpsType",
              "visibility": "#topLeftHeaderDataVisibity"
            },
            {
              "ctype": "title",
              "title": "LOB:",
              "uuid": "dellLobUUID",
              "titleClass": "sidenav-title body2",
              "titleValue": "#dellLeftSideLob",
              "visibility": "#topLeftHeaderDataVisibity"
            },
            {
              "ctype": "title",
              "title": "SLA:",
              "uuid": "dellSlaUUID",
              "titleClass": "sidenav-title body2",
              "titleValue": "#dellLeftSideSla",
              "visibility": "#topLeftHeaderDataVisibity"
            },
            {
              "ctype": "title",
              "title": "Warranty:",
              "uuid": "dellWarrentyUUID",
              "titleClass": "sidenav-title body2",
              "titleValue": "#dellLeftSideWarranty",
              "visibility": "#topLeftHeaderDataVisibity"
            }
          ],
          "sideNavBody": [
            {
              "ctype": "menutree",
              "uuid": "menuTreeUUID",
              "menuListClass": "body2",
              "menuData": "#SubprocessMenu"
            }
          ],
          "sideNavFooter": [
            {
              "ctype": "iconText",
              "text": "#userAccountInfo.PersonalDetails.USERID",
              "iconTextClass": "user-cls",
              "textClass": "body",
              "icon": "account_circle"
            },
            {
              "ctype": "iconText",
              "text": "Logout",
              "iconTextClass": "logout-cls",
              "icon": "power_settings_new",
              "textClass": "body",
              "actions": [
                {
                  "type": "renderTemplate",
                  "config": {
                    "templateId": "login.json",
                    "mode": "local",
                    "clearContext": true
                  },
                  "eventSource": "click"
                }
              ]
            }
          ]
        };
      }
    } else if (this.clientName && this.clientName == "DELL_CAR") {
      this.getTopLeftHeaderData();
      this.leftsideNav = {
        "position": "start",
        "opened": "true",
        "menuItemscroll": "menu_scrollable",
        "headerScroll": "menu_scrollable",
        "sideNavHeader": [
          {
            "ctype": "title",
            "uuid": "BCNTitle",
            "titleValue": "#discrepancyUnitInfo.ITEM_BCN",
            "titleClass": "#receiptDateborder"
          },
          {
            "ctype": "title",
            "title": "Due: ",
            "titleValue": "#receiptDateForDiscrepancy.localDateTime",
            "uuid": "DueUUID",
            "titleClass": "#receiptDateTitle"
          },
          {
            "ctype": "title",
            "title": "Service Tag:",
            "titleValue": "#repairUnitInfo.SERIAL_NO",
            "uuid": "dellCarServiceTagUUID",
            "titleClass": "body leftNav-title"
          },
          {
            "ctype": "title",
            "title": "BCN:",
            "uuid": "dellCarBCNUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#repairUnitInfo.ITEM_BCN"
          },
          {
            "ctype": "title",
            "title": "DPS:",
            "uuid": "dellCarDpsNumberUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#getCurrPrevRODetailsBySN.clientReferenceNo1"
          },
          {
            "ctype": "title",
            "title": "Model Number:",
            "uuid": "dellCarModelNumberUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#repairUnitInfo.PART_NO"
          },
          {
            "ctype": "title",
            "title": "Unit Level:",
            "uuid": "dellCarUnitLevelUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#getWorkInstDellEducateURLLinkData.notes"
          },
          {
            "ctype": "title",
            "title": "Platform:",
            "uuid": "dellCarPlatformUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#getWorkInstDellEducateURLLinkData.notes3"
          },
          {
            "ctype": "title",
            "title": "Warranty:",
            "uuid": "dellCarwarrantyUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#dellLeftSideWarranty"
          },
          {
            "ctype": "title",
            "title": "QR Required:",
            "uuid": "dellCarQrRequiredUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#getROHFFValueByRODetailsQRRequired"
          },
          {
            "ctype": "title",
            "title": "QR Status:",
            "uuid": "dellCarQrStatusUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#getROHFFValueByRODetailsQRStatus"
          },
          {
            "ctype": "title",
            "title": "Windows Version:",
            "uuid": "dellCarWindowsVersionUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#getPartsFromDellBomsData.systemVer"
          },
          {
            "ctype": "title",
            "title": "Language:",
            "uuid": "dellCarlanguageUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#getPartsFromDellBomsData.keyboard"
          },
          {
            "ctype": "title",
            "title": "OS Password:",
            "uuid": "dellCarOSPasswordUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#getROHFFValueByRODetailsPassword"
          },
          {
            "ctype": "title",
            "title": "RAID:",
            "uuid": "dellCarRaidUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#getPartsFromDellBomsData.raid"
          },
          {
            "ctype": "title",
            "title": "FINGERPRINT:",
            "uuid": "dellCarFingerprintUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#getPartsFromDellBomsData.fingerprint"
          },
          {
            "ctype": "title",
            "title": "NFC:",
            "uuid": "dellCarNfcUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#getPartsFromDellBomsData.nfc"
          },
          {
            "ctype": "title",
            "title": "Ac Adapter:",
            "uuid": "dellCarAcAdapterUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#getPartsFromDellBomsData.acAdapter"
          },
          {
            "ctype": "title",
            "title": "WI Disposition:",
            "uuid": "dellCarWiDispositionUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#getROHFFValueByRODetailsWIDisposition"
          }
        ],
        "sideNavHeader2": [
          {
            "ctype": "divider",
            "dividerClass": "divider_cls"
          },
          {
            "ctype": "iconText",
            "iconTextClass": "sidenav-text body cursor",
            "uuid": "IconUUID",
            "icon": "description",
            "text": "E-Traveller",
            "textCss": "",
            "iconPosition": "Before",
            "actions": [
              {
                "type": "openEtraveller",
                "config" : {
                  "title" : "Item history",
                  "flexFieldVisible":false
                },
                "eventSource": "click"
              }
            ]
          }
        ],
        "sideNavBody": [
          {
            "ctype": "menutree",
            "uuid": "menuTreeUUID",
            "menuListClass": "body2",
            "menuData": "#SubprocessMenu",
            "childIndex": this.subMenuIndex
          }
        ],
        "sideNavFooter": [
          {
            "ctype": "iconText",
            "text": "#userAccountInfo.PersonalDetails.USERID",
            "iconTextClass": "user-cls",
            "textClass": "body",
            "icon": "account_circle"
          },
          {
            "ctype": "iconText",
            "text": "Logout",
            "iconTextClass": "logout-cls",
            "icon": "power_settings_new",
            "textClass": "body",
            "actions": [
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "login.json",
                  "mode": "local",
                  "clearContext": true
                },
                "eventSource": "click"
              }
            ]
          }
        ]
      };
    } else if (this.clientName && this.clientName == "DELL_Car_Receving") {
      this.leftsideNav = {
        "position": "start",
        "opened": "true",
        "sideNavHeader": [
          {
            "ctype": "title",
            "title": "SN:",
            "uuid": "dellCarSNUUID",
            "titleValue": "#getSerialScanResp.SerialNumber",
            "titleClass": "body leftNav-title",
            "visibility": false
          },
          {
            "ctype": "title",
            "title": "PN:",
            "uuid": "dellCarPNUUID",
            "titleValue": "#dellCarSNPNTopLeftHeaderData.PartNumber",
            "titleClass": "body leftNav-title",
            "visibility": false
          },
          {
            "ctype": "title",
            "title": "ENTITLEMENT:",
            "uuid": "dellCarEntitlementUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#dellCarTopLeftHeaderData.0.ffValue",
            "visibility": false
          },
          {
            "ctype": "title",
            "title": "DPS Type:",
            "uuid": "dellCarDpsTitleUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#dellCarTopLeftHeaderData.1.ffValue",
            "visibility": false
          },
          {
            "ctype": "title",
            "title": "DPS Number:",
            "uuid": "dellCarDpsNumberUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#dcReceivingOrderDetails.CLIENT_REFERENCE_NO1",
            "visibility": false
          },
          {
            "ctype": "title",
            "title": "Warranty:",
            "uuid": "dellCarWarrentyUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#dellCarTopLeftHeaderData.2.ffValue",
            "visibility": false
          }
        ],
        "sideNavBody": [
          {
            "ctype": "menutree",
            "uuid": "menuTreeUUID",
            "menuListClass": "body2",
            "menuData": "#SubprocessMenu"
          }
        ],
        "sideNavFooter": [
          {
            "ctype": "iconText",
            "text": "#userAccountInfo.PersonalDetails.USERID",
            "iconTextClass": "user-cls",
            "textClass": "body",
            "icon": "account_circle"
          },
          {
            "ctype": "iconText",
            "text": "Logout",
            "iconTextClass": "logout-cls",
            "icon": "power_settings_new",
            "textClass": "body",
            "actions": [
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "login.json",
                  "mode": "local",
                  "clearContext": true
                },
                "eventSource": "click"
              }
            ]
          }
        ]
      };
    } else if (this.clientName && this.clientName == "HP_Shipping") {
      this.leftsideNav = {
        "position": "start",
        "opened": "true",
        "menuItemscroll": "menu_scrollable",
        "sideNavHeader": [
          {
            "ctype": "title",
            "uuid": "BCNTitle",
            "titleValue": "#discrepancyUnitInfo.ITEM_BCN",
            "titleClass": "#receiptDateborder"
          },
          {
            "ctype": "title",
            "title": "Due: ",
            "titleValue": "#receiptDateForDiscrepancy.localDateTime",
            "uuid": "DueUUID",
            "titleClass": "#receiptDateTitle"
          },
          {
            "ctype": "title",
            "title": "Serial Number:",
            "titleValue": "#discrepancyUnitInfo.SERIAL_NO",
            "uuid": "SerialUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "title",
            "title": "Platform:",
            "titleValue": "#discrepancyPartAndWarrantyDetails.PRODUCT_PLATFORM",
            "uuid": "EliteUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "title",
            "title": "Description:",
            "titleValue": "#discrepancyPartAndWarrantyDetails.PART_DESC",
            "uuid": "FamilyUUID",
            "titleClass": "sidenav-title height-scrol body2"
          },
          {
            "ctype": "title",
            "title": "Warranty:",
            "titleValue": "#discrepancyPartAndWarrantyDetails.WARRANTY_STATUS",
            "uuid": "WarrantyUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "title",
            "title": "Country Name:",
            "uuid": "countryNameUUID",
            "titleClass": "sidenav-title body2",
            "visibility": false
          },
          {
            "ctype": "title",
            "title": "City Name:",
            "uuid": "cityNameUUID",
            "titleClass": "sidenav-title body2",
            "visibility": false
          },
          {
            "ctype": "title",
            "title": "Postal Code:",
            "uuid": "postalCodeUUID",
            "titleClass": "sidenav-title body2",
            "visibility": false
          },
          {
            "ctype": "divider",
            "dividerClass": "divider_cls"
          },
          {
            "ctype": "iconText",
            "iconTextClass": "sidenav-text body cursor",
            "uuid": "etravellerShippingUUID",
            "icon": "description",
            "text": "E-Traveller",
            "textCss": "",
            "iconPosition": "Before",
            "actions": [
              {
                "type": "openEtraveller",
                "config": {
                  "title": "Item history",
                },
                "eventSource": "click"
              }
            ]
          }
        ],
        "sideNavBody": [
          {
            "ctype": "menutree",
            "uuid": "menuTreeUUID",
            "menuListClass": "body2",
            "menuData": "#SubprocessMenu",
            "childIndex": this.subMenuIndex
          }
        ],
        "sideNavFooter": [
          {
            "ctype": "iconText",
            "text": "#userAccountInfo.PersonalDetails.USERID",
            "iconTextClass": "user-cls",
            "textClass": "body",
            "icon": "account_circle"
          },
          {
            "ctype": "iconText",
            "text": "Logout",
            "iconTextClass": "logout-cls",
            "icon": "power_settings_new",
            "textClass": "body",
            "actions": [
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "login.json",
                  "mode": "local",
                  "clearContext": true
                },
                "eventSource": "click"
              }
            ]
          }
        ]
      };
    } else if (this.clientName && this.clientName == "DELL_Shipping") {
      this.leftsideNav = {
        "position": "start",
        "opened": "true",
        "sideNavHeader": [
          {
            "ctype": "title",
            "uuid": "BCNTitle",
            "titleValue": "#shippingShipManifestStatus.itemBcn",
            "titleClass": "#receiptDateborder"
          },
          {
            "ctype": "title",
            "title": "Due: ",
            "titleValue": "#receiptDateForDiscrepancy.localDateTime",
            "uuid": "DueUUID",
            "titleClass": "#receiptDateTitle"
          },
          {
            "ctype": "title",
            "title": "Serial Number:",
            "titleValue": "#shippingShipManifestStatus.serialNo",
            "uuid": "SerialUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "title",
            "title": "Part Number:",
            "titleValue": "#discrepancyPartAndWarrantyDetails.PRODUCT_PLATFORM",
            "uuid": "EliteUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "title",
            "title": "Description:",
            "titleValue": "#discrepancyPartAndWarrantyDetails.PART_DESC",
            "uuid": "FamilyUUID",
            "titleClass": "sidenav-title height-scrol body2"
          },
          {
            "ctype": "title",
            "title": "Warranty:",
            "titleValue": "#discrepancyPartAndWarrantyDetails.WARRANTY_STATUS",
            "uuid": "WarrantyUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "title",
            "title": "City Name:",
            "uuid": "cityNameUUID",
            "titleClass": "sidenav-title body2",
            "visibility": false
          },
          {
            "ctype": "title",
            "title": "State/Province:",
            "uuid": "stateCodeUUID",
            "titleClass": "sidenav-title body2",
            "visibility": false
          },
          {
            "ctype": "title",
            "title": "Country Name:",
            "uuid": "countryNameUUID",
            "titleClass": "sidenav-title body2",
            "visibility": false
          },
          {
            "ctype": "title",
            "title": "Postal Code:",
            "uuid": "postalCodeUUID",
            "titleClass": "sidenav-title body2",
            "visibility": false
          },
          {
            "ctype": "divider",
            "dividerClass": "divider_cls"
          },
          {
            "ctype": "iconText",
            "iconTextClass": "sidenav-text body cursor",
            "uuid": "etravellerShippingUUID",
            "icon": "description",
            "text": "E-Traveller",
            "textCss": "",
            "iconPosition": "Before",
            "actions": [
              {
                "type": "openEtraveller",
                "config": {
                  "title": "Item history",
                },
                "eventSource": "click"
              }
            ]
          }
        ],
        "sideNavBody": [
          {
            "ctype": "menutree",
            "uuid": "menuTreeUUID",
            "menuListClass": "body2",
            "menuData": "#SubprocessMenu",
            "childIndex": this.subMenuIndex
          }
        ],
        "sideNavFooter": [
          {
            "ctype": "iconText",
            "text": "#userAccountInfo.PersonalDetails.USERID",
            "iconTextClass": "user-cls",
            "textClass": "body",
            "icon": "account_circle"
          },
          {
            "ctype": "iconText",
            "text": "Logout",
            "iconTextClass": "logout-cls",
            "icon": "power_settings_new",
            "textClass": "body",
            "actions": [
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "login.json",
                  "mode": "local",
                  "clearContext": true
                },
                "eventSource": "click"
              }
            ]
          }
        ]
      };
    } else if (this.clientName && this.clientName == "DELL_Car_Shipping") {
      this.getTopLeftHeaderData();
      this.leftsideNav = {
        "position": "start",
        "opened": "true",
        "menuItemscroll": "menu_scrollable",
        "sideNavHeader": [
          {
            "ctype": "title",
            "uuid": "BCNTitle",
            "titleValue": "#discrepancyUnitInfo.ITEM_BCN",
            "titleClass": "#receiptDateborder"
          },
          {
            "ctype": "title",
            "title": "Due: ",
            "titleValue": "#receiptDateForDiscrepancy.localDateTime",
            "uuid": "DueUUID",
            "titleClass": "#receiptDateTitle"
          },
          {
            "ctype": "title",
            "title": "Serial Number:",
            "titleValue": "#shippingSerialNo",
            "uuid": "SerialUUID",
            "titleClass": "body leftNav-title",
          },
          {
            "ctype": "title",
            "title": "Part Number:",
            "titleValue": "#shippingPartNo",
            "uuid": "partNumberUUID",
            "titleClass": "body leftNav-title",
          },
          {
            "ctype": "title",
            "title": "DPS Number:",
            "uuid": "dellCarDpsNumberUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#getCurrPrevRODetailsBySNData.clientReferenceNo1",
          },
          {
            "ctype": "title",
            "title": "Entitlement:",
            "uuid": "dellCarEntitlementUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#dellLeftSideEntitlement"
          },
          {
            "ctype": "title",
            "title": "DPS Type:",
            "uuid": "dellCarDpsTypeUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#dellLeftSideDpsType"
          },
          {
            "ctype": "title",
            "title": "Waranty:",
            "uuid": "dellCarWarrentyUUID",
            "titleClass": "body leftNav-title",
            "titleValue": "#dellLeftSideWarranty"
          },
          {
            "ctype": "divider",
            "dividerClass": "divider_cls"
          },
          {
            "ctype": "iconText",
            "iconTextClass": "sidenav-text body cursor",
            "uuid": "etravellerShippingUUID",
            "icon": "description",
            "text": "E-Traveller",
            "textCss": "",
            "iconPosition": "Before",
            "actions": [
              {
                "type": "openEtraveller",
                "config": {
                  "title": "Item history",
                },
                "eventSource": "click"
              }
            ]
          }
        ],
        "sideNavBody": [
          {
            "ctype": "menutree",
            "uuid": "menuTreeUUID",
            "menuListClass": "body2",
            "menuData": "#SubprocessMenu",
            "childIndex": this.subMenuIndex
          }
        ],
        "sideNavFooter": [
          {
            "ctype": "iconText",
            "text": "#userAccountInfo.PersonalDetails.USERID",
            "iconTextClass": "user-cls",
            "textClass": "body",
            "icon": "account_circle"
          },
          {
            "ctype": "iconText",
            "text": "Logout",
            "iconTextClass": "logout-cls",
            "icon": "power_settings_new",
            "textClass": "body",
            "actions": [
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "login.json",
                  "mode": "local",
                  "clearContext": true
                },
                "eventSource": "click"
              }
            ]
          }
        ]
      };
    } else if (this.clientName && this.clientName == "HOUSTON") {
      this.leftsideNav = {
        "position": "start",
        "opened": "true",
        "sideNavHeader": [
          {
            "ctype": "title",
            "title": "SN: ",
            "titleValue": "#UnitInfo.SERIAL_NO",
            "uuid": "SNUUID",
            "titleClass": "sidenav-header heading1"
          },
          {
            "ctype": "title",
            "title": "PID-",
            "titleValue": "#UnitInfo.PART_NO",
            "uuid": "PIDUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "title",
            "title": "BCN-",
            "titleValue": "#UnitInfo.ITEM_BCN",
            "uuid": "titleUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "title",
            "title": "Classification : ",
            "titleValue": "#houClassification.0.flexFieldValue",
            "uuid": "titleUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "title",
            "title": "MasterGrade : ",
            "titleValue": "#houMasterGrade.0.flexFieldValue",
            "uuid": "titleUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "title",
            "title": "InboundSource : ",
            "titleValue": "#houInboundSource.0.flexFieldValue",
            "uuid": "titleUUID",
            "titleClass": "sidenav-title body2"
          },
          {
            "ctype": "divider",
            "dividerClass": "divider_cls"
          },
          {
            "ctype": "iconText",
            "iconTextClass": "sidenav-text body cursor",
            "uuid": "IconUUID",
            "icon": "description",
            "text": "E-Traveller",
            "textCss": "",
            "iconPosition": "Before",
            "actions": [
              {
                "type": "openEtraveller",
                "config": {
                  "title": "Item history",
                },
                "eventSource": "click"
              }
            ]
          }
        ],
        "sideNavBody": [
          {
            "ctype": "menutree",
            "uuid": "menuTreeUUID",
            "menuListClass": "body2",
            "menuData": "#SubprocessMenu",
            "childIndex": this.subMenuIndex
          }
        ],
        "sideNavFooter": [
          {
            "ctype": "iconText",
            "text": "#userAccountInfo.PersonalDetails.USERID",
            "iconTextClass": "user-cls",
            "textClass": "body2",
            "icon": "account_circle"
          },
          {
            "ctype": "iconText",
            "text": "Logout",
            "iconTextClass": "logout-cls",
            "icon": "power_settings_new",
            "textClass": "body2",
            "actions": [
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "login.json",
                  "mode": "local",
                  "clearContext": true
                },
                "eventSource": "click"
              }
            ]
          }
        ]
      };
    }
    if (this.clientName && this.clientName == "DELL") {

      if (this.contextService.getDataByKey('discrepancyUnitInfo').WORKCENTER.includes('MBR')) {
        this.leftsideNav = leftMenu;
        this.leftsideNav['sideNavBody'].forEach(element => {
          element.childIndex = this.subMenuIndex;
        });
      } else if (this.contractName && (this.contractName.toLowerCase() == "dell aio") || (this.contractName.toLowerCase() == "grief")) {
        this.getTopLeftHeaderData();
        if (this.contextService.getDataByKey('discrepancyUnitInfo').LOCATION_ID == 1244) {
          this.leftsideNav = {
            "position": "start",
            "opened": "true",
            "sideNavHeader": [
              {
                "ctype": "title",
                "uuid": "BCNTitle",
                "titleValue": "#discrepancyUnitInfo.ITEM_BCN",
                "titleClass": "#receiptDateborder"
              },
              {
                "ctype": "title",
                "title": "Due: ",
                "titleValue": "#receiptDateForDiscrepancy.localDateTime",
                "uuid": "DueUUID",
                "titleClass": "#receiptDateTitle"
              },
              {
                "ctype": "title",
                "title": "Serial Number:",
                "titleValue": "#discrepancyUnitInfo.SERIAL_NO",
                "uuid": "SerialUUID",
                "titleClass": "sidenav-title body2"
              },
              {
                "ctype": "title",
                "title": "Model:",
                "titleValue": "#discrepancyPartAndWarrantyDetails.MODEL_NUMBER",
                "uuid": "modelUUID",
                "titleClass": "sidenav-title body2"
              },
              {
                "ctype": "title",
                "title": "Description:",
                "titleValue": "#discrepancyPartAndWarrantyDetails.PART_DESC",
                "uuid": "FamilyUUID",
                "titleClass": "sidenav-title height-scrol body2"
              },
              {
                "ctype": "title",
                "title": "LOB:",
                "uuid": "dellLobUUID",
                "titleClass": "sidenav-title body2",
                "titleValue": "#dellLeftSideLob",
                "visibility": "#topLeftHeaderDataVisibity"
              },
              {
                "ctype": "title",
                "title": "SLA:",
                "uuid": "dellSlaUUID",
                "titleClass": "sidenav-title body2",
                "titleValue": "#dellLeftSideSla",
                "visibility": "#topLeftHeaderDataVisibity"
              },
              {
                "ctype": "title",
                "title": "DPS Type:",
                "uuid": "dellDpsTitleUUID",
                "titleClass": "sidenav-title body2",
                "titleValue": "#dellLeftSideDpsType",
                "visibility": "#topLeftHeaderDataVisibity"
              },
              {
                "ctype": "title",
                "title": "Warranty:",
                "uuid": "dellWarrentyUUID",
                "titleClass": "sidenav-title body2",
                "titleValue": "#dellLeftSideWarranty",
                "visibility": "#topLeftHeaderDataVisibity"
              },
              {
                "ctype": "divider",
                "dividerClass": "divider_cls"
              },
              {
                "ctype": "iconText",
                "iconTextClass": "sidenav-text body cursor",
                "uuid": "IconUUID",
                "icon": "description",
                "text": "E-Traveller",
                "textCss": "",
                "iconPosition": "Before",
                "actions": [
                  {
                    "type": "openEtraveller",
                    "config": {
                      "title": "Item history",
                    },
                    "eventSource": "click"
                  }
                ]
              }
            ],
            "sideNavBody": [
              {
                "ctype": "menutree",
                "uuid": "menuTreeUUID",
                "menuListClass": "body2",
                "menuData": "#SubprocessMenu",
                "childIndex": this.subMenuIndex
              }
            ],
            "sideNavFooter": [
              {
                "ctype": "iconText",
                "text": "#userAccountInfo.PersonalDetails.USERID",
                "iconTextClass": "user-cls",
                "textClass": "body",
                "icon": "account_circle"
              },
              {
                "ctype": "iconText",
                "text": "Logout",
                "iconTextClass": "logout-cls",
                "icon": "power_settings_new",
                "textClass": "body",
                "actions": [
                  {
                    "type": "renderTemplate",
                    "config": {
                      "templateId": "login.json",
                      "mode": "local",
                      "clearContext": true
                    },
                    "eventSource": "click"
                  }
                ]
              }
            ]
          };
        } else {
          this.leftsideNav = {
            "position": "start",
            "opened": "true",
            "sideNavHeader": [
              {
                "ctype": "title",
                "uuid": "BCNTitle",
                "titleValue": "#discrepancyUnitInfo.ITEM_BCN",
                "titleClass": "#receiptDateborder"
              },
              {
                "ctype": "title",
                "title": "Due: ",
                "titleValue": "#receiptDateForDiscrepancy.localDateTime",
                "uuid": "DueUUID",
                "titleClass": "#receiptDateTitle"
              },
              {
                "ctype": "title",
                "title": "Serial Number:",
                "titleValue": "#discrepancyUnitInfo.SERIAL_NO",
                "uuid": "SerialUUID",
                "titleClass": "sidenav-title body2"
              },
              {
                "ctype": "title",
                "title": "Model:",
                "titleValue": "#discrepancyPartAndWarrantyDetails.MODEL_NUMBER",
                "uuid": "modelUUID",
                "titleClass": "sidenav-title body2"
              },
              {
                "ctype": "title",
                "title": "Description:",
                "titleValue": "#discrepancyPartAndWarrantyDetails.PART_DESC",
                "uuid": "FamilyUUID",
                "titleClass": "sidenav-title height-scrol body2"
              },
              {
                "ctype": "title",
                "title": "Entitlement:",
                "uuid": "dellEntitlementUUID",
                "titleClass": "sidenav-title body2",
                "titleValue": "#dellLeftSideEntitlement",
                "visibility": "#topLeftHeaderDataVisibity",
              },
              {
                "ctype": "title",
                "title": "LOB:",
                "uuid": "dellLobUUID",
                "titleClass": "sidenav-title body2",
                "titleValue": "#dellLeftSideLob",
                "visibility": "#topLeftHeaderDataVisibity"
              },
              {
                "ctype": "title",
                "title": "SLA:",
                "uuid": "dellSlaUUID",
                "titleClass": "sidenav-title body2",
                "titleValue": "#dellLeftSideSla",
                "visibility": "#topLeftHeaderDataVisibity"
              },
              {
                "ctype": "title",
                "title": "DPS Type:",
                "uuid": "dellDpsTitleUUID",
                "titleClass": "sidenav-title body2",
                "titleValue": "#dellLeftSideDpsType",
                "visibility": "#topLeftHeaderDataVisibity"
              },
              {
                "ctype": "title",
                "title": "Warranty:",
                "uuid": "dellWarrentyUUID",
                "titleClass": "sidenav-title body2",
                "titleValue": "#dellLeftSideWarranty",
                "visibility": "#topLeftHeaderDataVisibity"
              },
              {
                "ctype": "divider",
                "dividerClass": "divider_cls"
              },
              {
                "ctype": "iconText",
                "iconTextClass": "sidenav-text body cursor",
                "uuid": "IconUUID",
                "icon": "description",
                "text": "E-Traveller",
                "textCss": "",
                "iconPosition": "Before",
                "actions": [
                  {
                    "type": "openEtraveller",
                    "config": {
                      "title": "Item history"
                    },
                    "eventSource": "click"
                  }
                ]
              }
            ],
            "sideNavBody": [
              {
                "ctype": "menutree",
                "uuid": "menuTreeUUID",
                "menuListClass": "body2",
                "menuData": "#SubprocessMenu",
                "childIndex": this.subMenuIndex
              }
            ],
            "sideNavFooter": [
              {
                "ctype": "iconText",
                "text": "#userAccountInfo.PersonalDetails.USERID",
                "iconTextClass": "user-cls",
                "textClass": "body",
                "icon": "account_circle"
              },
              {
                "ctype": "iconText",
                "text": "Logout",
                "iconTextClass": "logout-cls",
                "icon": "power_settings_new",
                "textClass": "body",
                "actions": [
                  {
                    "type": "renderTemplate",
                    "config": {
                      "templateId": "login.json",
                      "mode": "local",
                      "clearContext": true
                    },
                    "eventSource": "click"
                  }
                ]
              }
            ]
          };
        }
      }
    }
  }

  initRightNav() {
    //to check weather it is same for HP or Cisco
    this.subMenuIndex ? this.subMenuIndex : 0;
    var wIData = this.contextService.getDataByString("#pageopenUUID");
    if (wIData && wIData.hasOwnProperty('hidden')) {
      this.opened = wIData.hidden;
    } else {
      this.opened = this.openRightNav;
    }
    this.contextService.addToContext("isWorkInstructionOpen", this.opened);
    {
      this.rightsidenav = {
        "position": "end",
        "opened": this.opened,
        "sideNavHeader": [
          {
            "ctype": "title",
            "uuid": "subProcessRightNav"
          }
        ],
        "sideNavBody": [
          {
            "ctype": "pdfSearch",
            "isAdmin":this.isAdmin,
            "titleValue": "",
            "title": "Work Instructions",
            "titleClass": "workinstrTitle",
            "uuid": "workinstructionUUID",
            "name": "workInstructionSearch"
          }

        ],
        "sideNavFooter": []
      };
    }

  }

  getTopLeftHeaderData() {
    let leftHeaderData = this.contextService.getDataByKey('topLeftHeaderData');
    let keyConfig = {
      ['dps type']: 'dellLeftSideDpsType',
      entitlement: 'dellLeftSideEntitlement',
      warranty: 'dellLeftSideWarranty',
      lob: 'dellLeftSideLob',
      sla: 'dellLeftSideSla',
      drr: 'dellLeftSideDrr'

    };

    if (Array.isArray(leftHeaderData) && leftHeaderData?.length > 0) {
      leftHeaderData
        .filter(({ ffName }) => !!ffName)
        .forEach((item) => {
          let ffName = item?.ffName.toLowerCase();
          let key = keyConfig[ffName] || null;
          if (!!keyConfig) {
            this.contextService.addToContext(key, item?.ffValue);
          }
        });
    }
  }

  sideNavClosed() {
    if (this.clientName && this.clientName.toLowerCase() === "verifone") {
      this.batchProcessService.workInstructionCloseStatus();
    }
  }
}
