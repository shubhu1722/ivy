import { Component, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { hpEtravellerFlexFieldData } from "../../utilities/constants";
import { ETravellerService } from 'src/app/services/commonServices/eTraveller/etraveller.service';
import { ComponentLoaderService } from '../../services/commonServices/component-loader/component-loader.service';
import { ContextService } from '../../services/commonServices/contextService/context.service';

@Component({
  selector: 'app-etraveller',
  templateUrl: './etraveller.component.html',
  styleUrls: ['./etraveller.component.scss']
})
export class ETravellerComponent implements OnInit {
  @ViewChild('keyDataCustomerComplaint', { read: ViewContainerRef }) keyDataCustomerComplaint: ViewContainerRef;
  @ViewChild('keyDataUnitDetails', { read: ViewContainerRef }) keyDataUnitDetails: ViewContainerRef;
  
  dataSource:any;
  displayedColumns: string[] = [];
  keyDataVisible = false;
  itemHistoryVisible = true;
  flexFieldVisible=false;
  partsVisible=false;
  repositoryVisible=false;
  title: any;
  properties: any;
  actionsItems: any;
  hpEtravellerFlexFieldData:any;
  constructor(private eTravellerService: ETravellerService, 
    private componentLoaderService: ComponentLoaderService,
    private contextService: ContextService,
    @Inject(MAT_DIALOG_DATA) dialogData) {
    this.dataSource = dialogData.itemHistoryConsolidated;
    let test = this.dataSource.filter(e => e['referenceorderid'] == "na" && e['orderid'] == "na" && e['conditionname'] == "na" && e['orderprocesstypecode'] == "na")
    console.log(test);

    if (test.length > 0) {
      this.displayedColumns = [
        'timestamp',
        'workcentername',
        'note',
        'login',
        'orderitemopername',
        'replacedAddedPN',
        'location',
      ];
    } else {
      this.displayedColumns = [
        'timestamp',
        'workcentername',
        'note',
        'login',
        'orderitemopername',
        'referenceorderid',
        'orderid',
        'conditionname',
        'orderprocesstypecode'
      ];
      this.properties = dialogData.actions
        && dialogData.actions.config != undefined
        && dialogData.actions.config;
      if (this.properties) {
        this.title = this.properties.title != undefined
          && this.properties.title
        this.actionsItems = dialogData.actions &&
          dialogData.actions.items != undefined
          && dialogData.actions.items;
        this.keyDataVisible = this.properties.keyDataVisible != undefined
          ? this.properties.keyDataVisible : false;
        this.itemHistoryVisible = this.properties.itemHistoryVisible != undefined
          ? this.properties.itemHistoryVisible : true;
          this.flexFieldVisible = this.properties.flexFieldVisible != undefined
          ? this.properties.flexFieldVisible : false;
        this.partsVisible = this.properties.partsVisible != undefined
          ? this.properties.partsVisible : false;
          this.repositoryVisible = this.properties.repositoryVisible != undefined
          ? this.properties.repositoryVisible : false;
      }
    }
  }

  ngOnInit(): void {
    this.hpEtravellerFlexFieldData = hpEtravellerFlexFieldData;
    let Data = this.contextService.getDataByKey("getFFDetailsByItemId");
    let discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
    "#discrepancyUnitInfo.ITEM_BCN"
    if (Data) {
      this.hpEtravellerFlexFieldData.map((data) => {
        if (data.fileterValue == "Unit Details") {
          data["subParts"] = [
            {
              "ffName": "BCN",
              "ffValue": discrepancyUnitInfo.ITEM_BCN
            },
            {
              "ffName": "Serial Number",
              "ffValue": discrepancyUnitInfo.SERIAL_NO
            }
          ]
        } else {
          let parts = Data.filter((x: any) => x.workcenterName == data.fileterValue);
          data["subParts"] = parts.map((item) => {
            //let item =parts.find((i) => i.ffName === data)
             if(item.ffName=="ARCToolPicture" && item.ffValue == "''"){
               item['ffValue']=null
             }
              return item;
          })
        }
      })
    }
  }

  ngAfterViewInit(): void {
    if (this.actionsItems && this.actionsItems.length > 0) {
      this.actionsItems.forEach((item) => {
        if (item.hasOwnProperty("ctype")) {
          if (item.ctype == "keyData") {
            this.componentLoaderService.parseData(item, this.keyDataUnitDetails);
          } else if (false) {
            //flow continues as many tab panels containes
          }
        }
      });
    }
  }
}
