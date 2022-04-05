import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { WikiService } from '../../services/commonServices/wikiService/wiki.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { WikiRichtextComponent } from '../wiki-richtext/wiki-richtext.component';
import { WikiAdminService } from '../../services/commonServices/wikiService/wiki-admin.service';
import { ActionService } from '../../services/action/action.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wiki-admin',
  templateUrl: './wiki-admin.component.html',
  styleUrls: ['./wiki-admin.component.scss']
})
export class WikiAdminComponent implements OnInit, OnDestroy {

  @Input() labelClass: string;
  @Input() label: string;
  @Input() hidden: boolean;
  @ViewChild('tinyEditorData') myChild: WikiRichtextComponent;

  locationData = [];
  clientData = [];
  contractData = [];
  workCenterData = [];
  selectedLocation = [];
  selectedClient = [];
  selectedContract = [];
  selectedWCenter = [];


  spData: any;
  wcData = [];
  familyData = [];
  platformData = [];
  modelNumberData = [];
  commodityData = [];
  timeInData = [];
  wikidata: any;
  defectCodeByGruopData: [];
  defectCodeData = [];
  defectLevelData = [];
  defectCodeData2 = [];
  defectLevelData2 = [];
  defectCodeData3 = [];
  defectLevelData3 = [];
  wikiUserData = [];
  expLevel = [];
  wikiContextData = [];
  wikiUnitDetailsData = [];
  context = true;
  matchingInstructions = false;
  similarInstrLabel = false;
  textEditor = false;
  addWikiFormData: any;
  loadFromData = [
    { value: "Manual", viewValue: 'Manual' },
    { value: "API", viewValue: 'API' }
  ];
  typeOfInstData = [
    { value: "Repair Tip", viewValue: 'Repair Tip' },
    { value: "Work Instruction", viewValue: 'Work Instruction' },
    { value: "ECO", viewValue: 'ECO' }
  ];
  instrLangData = [
    { value: "English - EN", viewValue: 'English - EN' },
    { value: "Hungarian - HU", viewValue: 'Hungarian - HU' },
    { value: "Ukrainian - UK", viewValue: 'Ukrainian - UK' },
    { value: "Polish - PL", viewValue: 'Polish - PL' },
    { value: "Russian - RU", viewValue: 'Russian - RU' },
    { value: "Malay - MS", viewValue: 'Malay - MS' },
    { value: "Chinese - ZH", viewValue: 'Chinese - ZH' },
    { value: "French - FR", viewValue: 'French - FR' },
    { value: "German - DE", viewValue: 'German - DE' }
  ];
  isEditWiki: boolean;
  editingWikiId: any;
  wikiSubscribe: Subscription;
  wikiUserSubscribe: Subscription;
  editWikiSubscribe: Subscription;
  wikiContextSubscribe: Subscription;
  loginUserName: any;
  workCenterDisplayKey: string;
  userloginLocationId: any;

  discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
  currentUserName = this.contextService.getDataByKey("userAccountInfo")

  unitFamilyData: any[];
  unitPlatformData: any[];
  unitModelNameData: any[];
  unitCommodityData: any[];
  step = 0;
  duplicateWikisList: any[] = [];
  breadCrumbData: { 
    location: string; 
    client: string; 
    contract: string; 
    workCenter: string; 
    family: string; 
    platform: string; 
    modelPart: string; 
    commodity: string; 
    defect: string; 
  };
  instrSelected: boolean;
  langSelected: boolean;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;

  confirm: boolean = true;
  changeCheck(event) {
    this.confirm = !event.checked;
  }

  constructor(
    private wikiService: WikiService, 
    private contextService: ContextService,
    private wikiadminService:WikiAdminService,
    private actionService:ActionService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.wikiSubscribe = this.wikiService.getUserData().subscribe((data: any) => {
      this.wikidata = data;
      this.getUserAccountInfo(data.data);
    });
    this.wikiUserSubscribe = this.wikiService.getWikiUserDetailsData().subscribe((data: any) => {
      this.expLevel = [data.data];
    });
    

    this.getTimeInDetails();
  }

  ngOnDestroy() {
    this.wikiSubscribe && this.wikiSubscribe.unsubscribe();
    this.wikiUserSubscribe && this.wikiUserSubscribe.unsubscribe();
    this.editWikiSubscribe && this.editWikiSubscribe.unsubscribe();
    this.wikiService.editWikiData.next(null);
  }


  setUnitDetails() {
    forkJoin([this.wikiService.getWikiContextData(), this.wikiService.getUnitDetailsData()]).subscribe((responseList: any) => {
      const ContextData = responseList[0]['data'];
      const UnitDetailsData = responseList[1]['data'];
      const loginDetail: any = this.getLoginUserDetails();
      let locationData=this.wikiContextForm.value.wikiLocation[0].LOCATION_NAME;
      if(this.wikiContextForm.value.wikiLocation[0].LOCATION_NAME === "Bydgoszcz") {
        locationData = "BYD";
      }
      ContextData.O_FAMILY_CURSOR = ContextData.O_FAMILY_CURSOR.filter(item => (item.locationCode === locationData && item.clientCode === this.wikiContextForm.value.wikiClient[0].CLIENT_NAME && item.contractCode === this.wikiContextForm.value.wikiContract[0].CONTRACT_NAME));
      ContextData.O_PLATFORM_CURSOR = ContextData.O_PLATFORM_CURSOR.filter(item => (item.locationCode === locationData && item.clientCode === this.wikiContextForm.value.wikiClient[0].CLIENT_NAME && item.contractCode === this.wikiContextForm.value.wikiContract[0].CONTRACT_NAME));
      ContextData.O_MODEL_CURSOR = ContextData.O_MODEL_CURSOR.filter(item => (item.locationCode === locationData && item.clientCode === this.wikiContextForm.value.wikiClient[0].CLIENT_NAME && item.contractCode === this.wikiContextForm.value.wikiContract[0].CONTRACT_NAME));
      ContextData.O_COMMODITY_CURSOR = ContextData.O_COMMODITY_CURSOR.filter(item => (item.locationCode === locationData && item.clientCode === this.wikiContextForm.value.wikiClient[0].CLIENT_NAME && item.contractCode === this.wikiContextForm.value.wikiContract[0].CONTRACT_NAME));
      let familyList = [];
      let platformList = [];
      let modelNameList = [];
      let commodityList = [];
      ContextData.O_FAMILY_CURSOR.map(item => {
        const findData = UnitDetailsData.O_FAMILY_CURSOR.filter(item2 => item.componentName === item2.partNo);
        familyList = findData.map((subItem: any) => {
          return { ...subItem, name: subItem.platformName };
        });
      });
      this.unitFamilyData = familyList;
      ContextData.O_PLATFORM_CURSOR.map(item => {
        const findData = UnitDetailsData.O_PLATFORM_CURSOR.filter(item2 => item.componentName === item2.partNo);
        platformList = findData.map((subItem) => {
          return { ...subItem, name: subItem.platformName }
        });
      });
      this.unitPlatformData = platformList;
      ContextData.O_MODEL_CURSOR.map(item => {
        const findData = UnitDetailsData.O_MODEL_CURSOR.filter(item2 => item.componentName === item2.partNo);
        modelNameList = findData.map((subItem) => {
          return { ...subItem, name: subItem.platformName }
        });
      });
      this.unitModelNameData = modelNameList;
      ContextData.O_COMMODITY_CURSOR.map(item => {
        const findData = UnitDetailsData.O_COMMODITY_CURSOR.filter(item2 => item.componentName === item2.partNo);
        commodityList = findData.map((subItem) => {
          return { ...subItem, name: subItem.platformName }
        });
      });
      this.unitCommodityData = commodityList;
    });
  }
  getSettings(label = 'viewValue', id = 'value') {
    return {
      singleSelection: false,
      idField: id,
      textField: label,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      allowSearchFilter: true
    }
  }
  wcSettings(label = 'viewValue', id = 'value') {
    return {
      singleSelection: true,
      idField: id,
      textField: label,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      allowSearchFilter: true
    }
  }
  aboutGetSettings(label = 'viewValue', id = 'value') {
    return {
      singleSelection: true,
      idField: id,
      textField: label,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      allowSearchFilter: false
    }
  }
  getUserAccountInfo(data: any) {
    const loginDetail: any = this.getLoginUserDetails();
    let discrepancyUnitInfo = this.discrepancyUnitInfo;
    this.locationData = data.LocationDetails;
    const loginLocation = this.locationData.find(item => item.LOCATION_NAME === loginDetail.userSelectedLocationName);
    this.loginUserName = data.PersonalDetails.USERID;
  }
  locationSelect(data) {
    this.clientData = this.wikidata.data.ClientDetails.filter(item => (item.LOCATION_ID === data.LOCATION_ID));
    this.selectedClient = [];
    this.selectedContract = [];
    this.selectedWCenter = [];
  }
  clientSelect(data) {
    this.contractData = this.wikidata.data.ContractDetails.filter(item => (item.CLIENT_ID === data.CLIENT_ID) && (item.LOCATION_ID === this.selectedLocation[0].LOCATION_ID));
    this.selectedContract = [];
  }
  contractSelect(data) {
    this.workCenterData = this.wikidata.data.WorkCenterDetails.filter(item => (item.LOCATION_ID === this.selectedLocation[0].LOCATION_ID));
    this.selectedWCenter = [];

    this.setUnitDetails();
    let detailsWC = {
      LOCATION_ID: this.wikiContextForm.value.wikiLocation[0].LOCATION_ID,
      CLIENT_ID: this.wikiContextForm.value.wikiClient[0].CLIENT_ID,
      CONTRACT_ID : this.wikiContextForm.value.wikiContract[0].CONTRACT_ID
    }
    this.wikiService.getAdminDefectCodeData(detailsWC).subscribe((data: any) => {
      this.defectCodeData = data.data;
      this.defectCodeData2 = data.data;
      this.defectCodeData3 = data.data;
    });
  }

  getTimeInDetails() {
    let today = new Date();
    let date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes();
    let dateTime = date + ' - ' + time;
    return dateTime;
  }
  wikiDateTime = this.getTimeInDetails();



  getLoginUserDetails() {
    let username = this.contextService.getDataByKey('userAccountInfo')['PersonalDetails']['USERID'];
    const keys = ['userSelectedLocationName', 'userSelectedSubProcessType', 'userSelectedClientName', 'userSelectedContractName', 'userSelectedLocation'];
    const loginDetail = {};
    keys.map(key => {
      loginDetail[key] = this.contextService.getDataByKey(key);
    });
    return loginDetail;
  }

  wikiContextForm = new FormGroup({
    wikiTitle: new FormControl('', Validators.required),
    wikiLocation: new FormControl('', Validators.required),
    wikiClient: new FormControl('', Validators.required),
    wikiContract: new FormControl('', Validators.required),
    wikiAdminWorkCenter: new FormControl('', Validators.required),
    wikiFamily: new FormControl(''),
    wikiPlatform: new FormControl(''),
    wikiModelNumber: new FormControl(''),
    wikiCommodity: new FormControl(''),
    defectLevelData: new FormControl(''),
    defectLevelData2: new FormControl(''),
    defectLevelData3: new FormControl(''),
  })

  wikiTextEditorForm = new FormGroup({
    loadFromData: new FormControl(''),
    levelOfExpData: new FormControl(''),
    typeOfInstData: new FormControl('', Validators.required),
    instrLangData: new FormControl('', Validators.required)
  })

  setWikiFormData() {
    this.editWikiSubscribe = this.wikiService.editWikiData.subscribe(data => {
      if (data && data.data) {
        const editWikiData = data.data;
        this.editingWikiId = data.editId;
        this.isEditWiki = true;
        this.wikiContextForm = new FormGroup({
          wikiTitle: new FormControl(editWikiData.wikiTitle),
          wikiLocation: new FormControl(editWikiData.wikiLocation),
          wikiClient: new FormControl(editWikiData.wikiClient),
          wikiContract: new FormControl(editWikiData.wikiContract),
          wikiAdminWorkCenter: new FormControl(editWikiData.wikiAdminWorkCenter),
          wikiFamily: new FormControl(editWikiData.wikiFamily),
          wikiPlatform: new FormControl(editWikiData.wikiPlatform),
          wikiModelNumber: new FormControl(editWikiData.wikiModelNumber),
          wikiCommodity: new FormControl(editWikiData.wikiCommodity),
          defectLevelData: new FormControl(editWikiData.defectLevelData),
          defectLevelData2: new FormControl(editWikiData.defectLevelData),
          defectLevelData3: new FormControl(editWikiData.defectLevelData),
        })
        this.wikiTextEditorForm = new FormGroup({
          loadFromData: new FormControl(editWikiData.loadFromData),
          levelOfExpData: new FormControl(editWikiData.levelOfExpData),
          typeOfInstData: new FormControl(editWikiData.typeOfInstData),
          instrLangData: new FormControl(editWikiData.instrLangData)
        })
      }
    })
  }
  saveData() {
    let locationStr = "";
    let clientStr = "";
    let contractStr = "";
    let workCenterStr = "";
    let platformStr = "";
    let familyStr = "";
    let modelNameStr = "";
    let commodityStr = "";
    let defectStr = "";
    let defect2Str = "";
    let defect3Str = "";
    let experienceStr = "";
    let instrLangStr = "";
    let instructTypeStr = "";
    if(this.wikiContextForm.value.wikiLocation && this.wikiContextForm.value.wikiLocation.length) {
      this.wikiContextForm.value.wikiLocation.map(item => {
        locationStr =  item.LOCATION_NAME;
        return locationStr;
      })
    }
    if(this.wikiContextForm.value.wikiClient && this.wikiContextForm.value.wikiClient.length) {
      this.wikiContextForm.value.wikiClient.map(item => {
        clientStr =  item.CLIENT_NAME;
        return clientStr;
      })
    }
    if(this.wikiContextForm.value.wikiContract && this.wikiContextForm.value.wikiContract.length) {
      this.wikiContextForm.value.wikiContract.map(item => {
        contractStr =  item.CONTRACT_NAME;
        return contractStr;
      })
    }
    if(this.wikiContextForm.value.wikiAdminWorkCenter && this.wikiContextForm.value.wikiAdminWorkCenter.length) {
      this.wikiContextForm.value.wikiAdminWorkCenter.map(item => {
        workCenterStr = (workCenterStr == "") ? item.WORKCENTER_NAME : workCenterStr + "|" + item.WORKCENTER_NAME;
        return workCenterStr;
      })
    }
    if(this.wikiContextForm.value.wikiPlatform && this.wikiContextForm.value.wikiPlatform.length) {
      this.wikiContextForm.value.wikiPlatform.map(item => {
        platformStr = (platformStr == "") ? item.name : platformStr + "|" + item.name;
        return platformStr;
      })
    }
    if(this.wikiContextForm.value.wikiFamily && this.wikiContextForm.value.wikiFamily.length) {
      this.wikiContextForm.value.wikiFamily.map(item => {
        familyStr = (familyStr == "") ? item.name : familyStr + "|" + item.name;
        return familyStr;
      })
    }
    if(this.wikiContextForm.value.wikiModelNumber && this.wikiContextForm.value.wikiModelNumber.length) {
      this.wikiContextForm.value.wikiModelNumber.map(item => {
        modelNameStr = (modelNameStr == "") ? item.name : modelNameStr + "|" + item.name;
        return modelNameStr;
      })
    }
    if(this.wikiContextForm.value.wikiCommodity && this.wikiContextForm.value.wikiCommodity.length) {
      this.wikiContextForm.value.wikiCommodity.map(item => {
        commodityStr = (commodityStr == "") ? item.name : commodityStr + "|" + item.name;
        return commodityStr;
      })
    }
    if(this.wikiContextForm.value.defectLevelData && this.wikiContextForm.value.defectLevelData.length) {
      this.wikiContextForm.value.defectLevelData.map(item => {
        defectStr = (defectStr == "") ? "L1-" + item.description : defectStr + ";" + item.description;
        return defectStr;
      })
    };
    if(this.wikiContextForm.value.defectLevelData2 && this.wikiContextForm.value.defectLevelData2.length) {
      this.wikiContextForm.value.defectLevelData2.map(item => {
        defect2Str = (defect2Str == "") ? "L2-" + item.description : defect2Str + ";" + item.description;
        return defect2Str;
      })
    };
    if(this.wikiContextForm.value.defectLevelData3 && this.wikiContextForm.value.defectLevelData3.length) {
      this.wikiContextForm.value.defectLevelData3.map(item => {
        defect3Str = (defect3Str == "") ? "L3-" + item.description : defect3Str + ";" + item.description;
        return defect3Str;
      })
    }
    if(this.wikiTextEditorForm.value.levelOfExpData && this.wikiTextEditorForm.value.levelOfExpData.length) {
      this.wikiTextEditorForm.value.levelOfExpData.map(item => {
        experienceStr = item.employee_level;
        return experienceStr;
      })
    }
    if(this.wikiTextEditorForm.value.instrLangData && this.wikiTextEditorForm.value.instrLangData.length) {
      this.wikiTextEditorForm.value.instrLangData.map(item => {
        instrLangStr = item.value;
        return instrLangStr;
      })
    }
    if(this.wikiTextEditorForm.value.typeOfInstData && this.wikiTextEditorForm.value.typeOfInstData.length) {
      this.wikiTextEditorForm.value.typeOfInstData.map(item => {
        instructTypeStr = item.value;
        return instructTypeStr;
      })
    }
    
    let combineDefectStr = defectStr;
    if (defect2Str) {
      combineDefectStr = combineDefectStr + "|" + defect2Str
    }
    if (defect3Str) {
      combineDefectStr = combineDefectStr + "|" + defect3Str
    }

    let customInstruction = Object.keys(this.wikiContextForm.value).reduce((object, key) => {
      if (key !== "wikiTinymce") {
        object[key] = this.wikiContextForm.value[key]
      }
      return object
    }, {})
    let customInstruction2 = Object.keys(this.wikiTextEditorForm.value).reduce((object, key) => {
      if (key !== "wikiTinymce") {
        object[key] = this.wikiTextEditorForm.value[key]
      }
      return object
    }, {})
    customInstruction = {...customInstruction, ...customInstruction2}
    const customInstObjStr = JSON.stringify(customInstruction);

    if (this.isEditWiki) {
      const body = {
        data: this.wikiContextForm.value,
        editId: this.editingWikiId,
        isEditing: true
      }
      this.wikiService.updateWikiData(this.wikiContextForm.value).subscribe((wikiResult) => {

      })
      this.wikiService.newWiki.next(body);
    } else {
      const addwiki = {
        "wikiTitle": this.wikiContextForm.value.wikiTitle,
        "wikiData": this.myChild.wikiTinyEditorForm.controls.wikiTinymce.value,
        "locationId": locationStr,
        "clientId": clientStr,
        "contractId": contractStr,
        "workCenterId": workCenterStr,
        "family": familyStr,
        "platform": platformStr,
        "modelPart": modelNameStr,
        "commodity": commodityStr,
        "defect": combineDefectStr,
        "experience": experienceStr,
        "instructionType": instructTypeStr,
        "instructionLanguage": instrLangStr,
        "userName": this.currentUserName.PersonalDetails.USERID,
        "customInstruction": customInstObjStr,
        "imageSource": "imageSource",
        "imageAlternateText": "imageAlternateText",
        "imageWidth": "imageWidth",
        "imageHeight": "imageHeight",
        "attachmentUrl": "attachmentUrl",
        "attachmentTitle": "attachmentTitle",
        "attachmentDisplayText": "attachmentDisplayText",
        "attachmentOpen": "attachmentOpen",
        "wikiVersion": "1.1",
        "userRoles":this.contextService.getDataByKey("rolesConfiguredForUser")
      }
      this.wikiService.saveWikiData(addwiki).subscribe((wikiResult: any) => {
        if (wikiResult && wikiResult.status) {
          this._snackBar.open('Wiki Created Successfully', 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 3000,
            panelClass: ['custom-success']
          });
          this.cancel();
        }
      })
    }
  }

  cancel() {
    this.wikiService.newWiki.next(null);
  }
  
  contextNext() {
    this.context = false;
    let locationStr = "";
    let clientStr = "";
    let contractStr = "";
    let workCenterStr = "";
    let platformStr = "";
    let familyStr = "";
    let modelNameStr = "";
    let commodityStr = "";
    let defectStr = "";
    let defect2Str = "";
    let defect3Str = "";
    if(this.wikiContextForm.value.wikiLocation && this.wikiContextForm.value.wikiLocation.length) {
      this.wikiContextForm.value.wikiLocation.map(item => {
        locationStr =  item.LOCATION_NAME;
        return locationStr;
      })
    }
    if(this.wikiContextForm.value.wikiClient && this.wikiContextForm.value.wikiClient.length) {
      this.wikiContextForm.value.wikiClient.map(item => {
        clientStr =  item.CLIENT_NAME;
        return clientStr;
      })
    }
    if(this.wikiContextForm.value.wikiContract && this.wikiContextForm.value.wikiContract.length) {
      this.wikiContextForm.value.wikiContract.map(item => {
        contractStr =  item.CONTRACT_NAME;
        return contractStr;
      })
    }
    if(this.wikiContextForm.value.wikiAdminWorkCenter && this.wikiContextForm.value.wikiAdminWorkCenter.length) {
      this.wikiContextForm.value.wikiAdminWorkCenter.map(item => {
        workCenterStr = (workCenterStr == "") ? item.WORKCENTER_NAME : workCenterStr + "|" + item.WORKCENTER_NAME;
        return workCenterStr;
      })
    }
    if(this.wikiContextForm.value.wikiPlatform && this.wikiContextForm.value.wikiPlatform.length) {
      this.wikiContextForm.value.wikiPlatform.map(item => {
        platformStr = (platformStr == "") ? item.name : platformStr + "|" + item.name;
        return platformStr;
      })
    }
    if(this.wikiContextForm.value.wikiFamily && this.wikiContextForm.value.wikiFamily.length) {
      this.wikiContextForm.value.wikiFamily.map(item => {
        familyStr = (familyStr == "") ? item.name : familyStr + "|" + item.name;
        return familyStr;
      })
    }
    if(this.wikiContextForm.value.wikiModelNumber && this.wikiContextForm.value.wikiModelNumber.length) {
      this.wikiContextForm.value.wikiModelNumber.map(item => {
        modelNameStr = (modelNameStr == "") ? item.name : modelNameStr + "|" + item.name;
        return modelNameStr;
      })
    }  
    if(this.wikiContextForm.value.wikiCommodity && this.wikiContextForm.value.wikiCommodity.length) {
      this.wikiContextForm.value.wikiCommodity.map(item => {
        commodityStr = (commodityStr == "") ? item.name : commodityStr + "|" + item.name;
        return commodityStr;
      })
    }  
    if(this.wikiContextForm.value.defectLevelData && this.wikiContextForm.value.defectLevelData.length) {
      this.wikiContextForm.value.defectLevelData.map(item => {
        defectStr = (defectStr == "") ? "L1-" + item.description : defectStr + ";" + item.description;
        return defectStr;
      })
    }
    if(this.wikiContextForm.value.defectLevelData2 && this.wikiContextForm.value.defectLevelData2.length) {
      this.wikiContextForm.value.defectLevelData2.map(item => {
        defect2Str = (defect2Str == "") ? "L2-" + item.description : defect2Str + ";" + item.description;
        return defect2Str;
      })
    }
    if(this.wikiContextForm.value.defectLevelData3 && this.wikiContextForm.value.defectLevelData3.length) {
      this.wikiContextForm.value.defectLevelData3.map(item => {
        defect3Str = (defect3Str == "") ? "L3-" + item.description : defect3Str + ";" + item.description;
        return defect3Str;
      })
    }  
    let combineDefectStr = defectStr;
    if (defect2Str) {
      combineDefectStr = combineDefectStr + "|" + defect2Str
    }
    if (defect3Str) {
      combineDefectStr = combineDefectStr + "|" + defect3Str
    }
    const addwiki = {
      "location": locationStr,
      "client": clientStr,
      "contract": contractStr,
      "workCenter": workCenterStr,
      "family": familyStr,
      "platform": platformStr,
      "modelPart": modelNameStr,
      "commodity": commodityStr,
      "defect": combineDefectStr
    }
    this.breadCrumbData = addwiki;

    this.wikiService.getAdminWikiData(addwiki).subscribe((res: any) => {
      if (res && res.status && res.data) {
        if (res && res.status && res.data.length === 0) {
          this.matchingInstructions = false;
          this.similarInstrLabel = false;
          this.textEditor = true;
        } else {
          this.duplicateWikisList = res.data;
          this.matchingInstructions = true;
          this.similarInstrLabel = true;
        }
      }
    });

  }
  unitDeailsMandatoryCheck() {
    return !(this.wikiContextForm.value.wikiFamily.length || this.wikiContextForm.value.wikiPlatform.length || this.wikiContextForm.value.wikiModelNumber.length || this.wikiContextForm.value.wikiCommodity.length);
  }
  defectMandatoryCheck() {
    return !(this.wikiContextForm.value.defectLevelData.length || this.wikiContextForm.value.defectLevelData2.length || this.wikiContextForm.value.defectLevelData.length);
  }
  matchingNext() {
    this.matchingInstructions = false;
    this.textEditor = true;
  }
  matchingInstructLink() {
    this.textEditor = false;
    this.matchingInstructions = true;
  }
  contextLink() {
    this.textEditor = false;
    this.matchingInstructions = false;
    this.context = true;
  }
  typeInstrSelect() {
    this.instrSelected = true;
  }
  typeInstrDeSelect() {
    this.instrSelected = false;
  }
  langSelect() {
    this.langSelected = true;
  }
  langDeSelect() {
    this.langSelected = false;
  }

  saveDraft() {
    var arr = [];
    Object.keys(this.wikiContextForm.controls).forEach((key) => {
      let obj = { "name": key, "value": this.wikiContextForm.controls[key].value }
      arr.push(obj)
    })
    Object.keys(this.wikiTextEditorForm.controls).forEach((key) => {
      let obj = { "name": key, "value": this.wikiTextEditorForm.controls[key].value }
      arr.push(obj)
    })

    if(this?.myChild?.wikiTinyEditorForm?.controls?.wikiTinymce?.value !=""){
      let obj = { "name": "wikiTinymce", "value": this?.myChild?.wikiTinyEditorForm?.controls?.wikiTinymce?.value }
      arr.push(obj)
    }

    let partNo = this.contextService.getDataByString("#repairUnitInfo.PART_NO");
    const UNitInfo = this.contextService.getDataByString("#repairUnitInfo");
    const workCenterData = this.workCenterData;
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    let saveDraftState = "";
    if (this.textEditor) {
      saveDraftState = "textEditor"
    } else if (this.matchingInstructions) {
      saveDraftState = "matchingInstructions"
    } else if (this.context) {
      saveDraftState = "context"
    }
    if (partNo == undefined) {
      let unitDetails = ["wikiModelNumber", "wikiPlatform", "wikiModelNumber", "wikiCommodity"];
      let modelNameStr = "";
      unitDetails.map(data => {
        this.wikiContextForm.value[data] && this.wikiContextForm.value[data].map(item => {
          modelNameStr = (modelNameStr == "") ? item.name : modelNameStr + "|" + item.name;
          return modelNameStr;
        })
      })
      partNo = modelNameStr
    }
    arr.push({ "partNo": partNo }, { "name": "partNo", "value": partNo }, { "name": "saveDraftState", "value": saveDraftState }, { "saveDraftState": saveDraftState }, { "name": "wikiDateTime", "value": this.wikiDateTime }, { "name": "userName", "value": userName }, { "UnitInfo": UNitInfo }, { "workCenterData": this.workCenterData }, { "name": "isWikiDraftAdmin", "value": true })

    this.wikiService.saveWikiSaveDraft(arr).subscribe((response: any) => {
      if(response && response.status) {
        this.wikiadminService.handleDraftActions(this);
        this._snackBar.open('Wiki Drafted Successfully', 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000,
          panelClass: ['custom-success']
        });
       this.cancel();
      } 
    })
    
  }

}
