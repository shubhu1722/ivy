import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import * as $ from 'jquery';
import { ActionService } from '../../services/action/action.service';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { CustomeService } from '../../services/commonServices/customeService/custome.service';
import { EventServiceService } from '../../services/commonServices/eventService/event-service.service';
import { BatchprocessService } from '../../services/verifone/batchProcess/batchprocess.service';

@Component({
  selector: 'app-batch-table',
  templateUrl: './batch-table.component.html',
  styleUrls: ['./batch-table.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BatchTableComponent implements OnInit {
  a: any;

  eventMap = ['change', 'keyup','dblclick'];
  hookMap = ['beforeInit', 'afterInit', 'beforeAction', 'afterAction'];
  @Input() disabled: boolean;
  @Input() name: string;
  @Input() selectedVal: any;
  @Input() value: any;
  @Input() text: any;
  @Input() color: string;
  @Input() vertical: boolean;
  @Input() checked: boolean;
  @Input() id: string;
  @Input() visibilty: boolean;
  @Input() hooks: string[] = [];
  @Input() actions: string[];
  @Input() validations: string[];
  @Input() labelstyles: string;
  @Input() inputStyles: string;
  @Input() label: string;
  @Input() labelPosition: string;
  @Input() css: string;
  @Input() group: FormGroup;
  @Input() labelClass: string;
  @Input() formGroupClass: string;
  @Input() toggleClass: string;
  @Input() formGroupStyles: string;
  @Input() required: boolean;
  @Input() options: any;
  @Input() subProcess: any;
  @Input() batchData: any;
  @Input() conditionEvent:string;//event tobe apply.

  activeItemBGColor;
  activeItemColor;
  testVal = 'test';
  sortOrder = 'asc';
  currentBatchTakeoverStatus = false;
  isKeyingWC=false;
  toggleChanged: boolean;
  // selectedDDValue: any = '--select--'

  names = [
    "text1",
    "text2",
    "buttongroup1",
    "text3",
    "batchItem"
  ]

  items = []

  modelStyle = "display:none";
  selectedInstruction = "";
  workInstructionOpenedFlag = false;
  completeDisabled = true;
  @ViewChild('afterButtonToggle', { static: true, read: ViewContainerRef }) afterButtonToggle: ViewContainerRef;
  @ViewChildren("pcbno") public pcbno: QueryList<ElementRef>;
  @ViewChild('batchModal') el: ElementRef;

  constructor(
    private eventprocessor: EventServiceService,
    private contextService: ContextService,
    private customService: CustomeService,
    private batchprocessService: BatchprocessService,
    private actionService: ActionService,
    private ref: ChangeDetectorRef,
    private batchProcessService:BatchprocessService

  ) { }

  ngOnInit(): void {
    // if (this.selectedVal != null && this.selectedVal != undefined && this.selectedVal.startsWith('#')) {
    //   this.selectedVal = this.contextService.getDataByString(this.selectedVal);
    // }

    if (this.options != null && this.options != undefined && !(this.options instanceof Array) && this.options.startsWith('#')) {
      this.options = this.contextService.getDataByString(this.options);
      this.options = this.customService.getDataForActionToggle(this.options, this.text, this.value)
    }
    this.activeItemColor = "";
    this.activeItemBGColor = "";
    if (this.required !== undefined && this.required) {
      this.group.controls[this.name].setValidators(Validators.required);
    }

    this.contextService.addToContext('afterButtonToggle', this.afterButtonToggle);

    this.batchprocessService.unitTableDataUpdate.subscribe((data: any) => {
      this.getBatchItems();
    });

    this.batchprocessService.workInstructionOpened.subscribe((data: any) => {
      if (data && data.opened) {
        this.workInstructionOpenedFlag = true;
        this.ref.detach();
        this.ref.detectChanges();

      } else {
        this.workInstructionOpenedFlag = false;
        this.ref.detach();
        this.ref.detectChanges();

      }
    });

    this.getBatchItems();
  }

  toggle(event, i, item) {
    this.toggleChanged = true;
    this.contextService.addToContext("toggleSelect", event.value);
    if (event.value == "Fail") {
      this.contextService.addToContext("failUnit", item);
      if (this.batchData && this.batchData.batchUnits) {
        let finResultCodeArr = [];
        this.contextService.addToContext("currentFailUnitResultCodes", finResultCodeArr);
        for (let i = 0; i < this.batchData.batchUnits.length; i++) {
          if (this.batchData.batchUnits[i]['batchDetailsReponse']['serialNo'] === item['batchDetailsReponse']['serialNo'] && this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList']) {
            for (let j = 0; j < this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'].length; j++) {
              if (this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['sourceTaskAction'] && this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['sourceTaskAction'].toLowerCase() == "fail") {
                finResultCodeArr.push({
                  destinationWc: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['destinationWc'],
                  instruction: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['instruction'],
                  modelNo: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['modelNo'],
                  outcomeCodeId: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['outcomeCodeId'],
                  serialNo: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['serialNo'],
                  sourceTaskAction: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['sourceTaskAction'],
                  outcomeCodeValue: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['outcomeCodeId']
                });
              }
            }
            this.contextService.addToContext("currentFailUnitResultCodes", finResultCodeArr);
            break;
          }
        }
      }
    } else {
      this.contextService.addToContext("failUnit", {});
    }

    if (this.options != null && this.options != undefined) {
      this.options.forEach(optionItem => {
        if (optionItem.value == event.value) {
          if (!this.currentBatchTakeoverStatus) {
            this.activeItemBGColor = optionItem.bgcolor;
            this.activeItemColor = optionItem.color;
          }
        }
      });
    }

    this.eventMap.forEach((ele) => {
      if (ele === "change") {
        this.eventprocessor.handleEvent(this, { "type": ele });        
      }
    });
    this.batchData.batchUnits[i].condition = event.value;
    if (event.value !== "" && event.value.toLowerCase() === "pass") {
     let isKeyingWC= this.batchProcessService.checkKeyingWC();
     let passResultCodeList;
      if(isKeyingWC){
        passResultCodeList= this.getKeyingResultCode(item,i);
      }else{
       passResultCodeList = this.getResultcodeArray(item, i);
      }
      if (passResultCodeList && passResultCodeList.length > 1) {
        this.items[i]['batchDetailsReponse']["selectedDestinationWC"] = "";
      } else {
        this.items[i]['batchDetailsReponse']["selectedDestinationWC"] = passResultCodeList && passResultCodeList[0] ? passResultCodeList[0]['destinationWc'] : "";
      }
      //changes related issue no 1693.
      let rC = item.resultCodeList ? item.resultCodeList : item.batchDetailsReponse.outcomeCodeList;
      let selectOnPassIndex = rC.findIndex(e => (e.outcomeCodeId.includes("SND_HERD")  ||  e.outcomeCodeId.includes("SND_TMS")) && e.sourceTaskAction == "Pass");
      if (selectOnPassIndex > -1) {
        let selectOnPass = rC[selectOnPassIndex];
        // this.selectedDDValue = selectOnPass.outcomeCodeId;
        this.batchData.batchUnits[i].instruction = selectOnPass.instruction;
        this.batchData.batchUnits[i].selectedRc = selectOnPass.outcomeCodeId;
      } 
    } else {
      this.items[i]['batchDetailsReponse']["selectedDestinationWC"] = "";
      this.batchData.batchUnits[i].instruction = "";
      this.batchData.batchUnits[i].selectedRc = "";
    }
    if (this.currentBatchTakeoverStatus) {
      this.activeItemBGColor = "";
      this.activeItemColor = "";
    }
    this.enableButton();
  }

  onClick(group: MatButtonToggleGroup, event, i, item) {
    if (!this.toggleChanged) {
      group.value = null;
    }
    if (group && group.value === undefined) {
      this.batchData.batchUnits[i].condition = "";
      this.batchData.batchUnits[i]['batchDetailsReponse']["selectedDestinationWC"] = "";
      this.batchData.batchUnits[i].instruction = "";
      this.batchData.batchUnits[i].selectedRc = ""; 
    }
    if (this.currentBatchTakeoverStatus) {
      this.activeItemBGColor = "";
      this.activeItemColor = "";
    }
    this.toggleChanged = false;
  }

  ngAfterViewInit() {
    // if (this.selectedVal != null && this.selectedVal != undefined && this.selectedVal.startsWith('#')) {
    //   this.selectedVal = this.contextService.getDataByString(this.selectedVal);
    // }
  }

  getName(name, i) {
    return name + i;
  }

  addUnitToBatch(event) {
    this.contextService.addToContext("unitItem", "");
    this.contextService.addToContext("unitItem", {
      index: this.batchData.batchIndex,
      value: event.target.value
    });
    event.target.value = "";

    // this.group.controls[this.name].setValue(event.target.value);
    // if (this.options != null && this.options != undefined) {
    //   this.options.forEach(optionItem => {
    //     if (optionItem.value == event.value) {
    //       this.activeItemBGColor = optionItem.bgcolor;
    //       this.activeItemColor = optionItem.color;
    //     }
    //   });
    // }

    // this.testVal = 'hi';

    // this.eventMap.forEach((ele) => {
    //   if (ele === event.type) {
    //     this.eventprocessor.handleEvent(this, { "type": ele });
    //   }
    // });
    let unitName = this.genrateBatchId()
    let actionData = {
      type: 'getBatchUnitDetail',
      config: {
        batchName: unitName
      }
    };
    this.actionService.handleAction(actionData, '', '');
    this.enableButton();

  }

  getBatchItems() {
    let allBatch = [];
    allBatch = this.contextService.getDataByString("#allBatchData");
    let currentBatch = allBatch[this.batchData.batchIndex];
    this.currentBatchTakeoverStatus = currentBatch ? currentBatch["takeOverBatchStatus"] : false;
    this.batchData.batchUnits = currentBatch ? currentBatch.batchUnits : [];
    this.items = currentBatch ? currentBatch.batchUnits : [];
    // this.ref.detectChanges();

    this.ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
      this.enableButton();
      // this.closePopup();
    }, 500);

  }

  //function to Show the Item History
  showItemHistory(itemId) {
    let actionData = { type: 'openEtraveller' };
    this.contextService.addToContext('VerfoneUnitItemID', itemId);
    this.actionService.handleAction(actionData, '', '');
  }

  sortUnitTable(columnname, items, sortOrder) {
    this.items.sort((a, b) => {
      const obj1 = a['batchDetailsReponse'][columnname];
      const obj2 = b['batchDetailsReponse'][columnname];
      if (sortOrder === 'asc') {
        this.sortOrder = 'desc';
        return (obj1).localeCompare(obj2);
      } if (sortOrder === 'desc') {
        this.sortOrder = 'asc';
        return (obj2).localeCompare(obj1);
      }
    });
  }

  openPopup() {
    // this.modelStyle = "display:block";
    this.batchprocessService.batchPopup = "display:block"
  }

  closePopup() {
    // this.modelStyle = "display:none";
    this.batchprocessService.batchPopup = "display:none";
  }

  getResultcodeArray(item, i) {
    let rC = item.resultCodeList ? item.resultCodeList : item.batchDetailsReponse.outcomeCodeList;
    if (item.condition == "Pass") {
      rC = rC.filter(e => e.sourceTaskAction == "Pass");
      // let selectOnPassIndex = rC.findIndex(e => e.outcomeCodeId.includes("HERD"));
      // let selectOnPass = rC[selectOnPassIndex];
      // this.selectedDDValue = selectOnPass.outcomeCodeId;
      // this.batchData.batchUnits[i].instruction = selectOnPass.instruction;
      // this.batchData.batchUnits[i].selectedRc = selectOnPass.outcomeCodeId;

    } else if (item.condition == "Hold") {
      rC = rC.filter(e => e.sourceTaskAction == "Hold");
    } else if (item.condition == "Fail") {
      rC = rC.filter(e => e.sourceTaskAction == "Fail");
    }
    return rC;
  }

  getKeyingResultCode(item, i) {
    let CodeData = this.contextService.getDataByString("#getSysOutComeCodeData");
    console.log(CodeData);
    this.batchProcessService.checkKeyingWC();
    if (this.batchProcessService.checkKeyingWC()) {
      this.isKeyingWC = true;
    }

  }

  onChange(value, item, i) {
    // let selectedIndex = item.resultCodeList.filter(e => e.outcomeCodeId == value);
    // this.selectedInstruction = selectedIndex[0].instruction;
    // this.selectedDDValue = value;
    let selectedIndex;
    if (item.resultCodeList) {
      selectedIndex = item.resultCodeList.filter(e => e.outcomeCodeId == value);
    } else {
      selectedIndex = item.batchDetailsReponse.outcomeCodeList.filter(e => e.outcomeCodeId == value);
    }
    this.batchData.batchUnits[i].instruction = selectedIndex[0].instruction;
    this.batchData.batchUnits[i].selectedRc = value;
  }

  enableButton() {
    let data = this.batchData.batchUnits.filter(e => e.condition == "Pass" || e.condition == "Hold" || e.condition == "Fail");
    if (data.length > 0) {
      this.completeDisabled = false;
    } else {
      this.completeDisabled = true;
    }
  }

  getPopupData(items) {
    let data = items.filter(e => e.condition == "Hold" || e.condition == "Pass");
    return data;
  }

  checkCondition(item, i) {
    if (item.condition == "Pass" || item.condition == "Hold" || item.condition == "Fail") {
      return i;
    }
  }

  getSelectedInstruction(item, i) {
    let data = this.batchData.batchUnits[i].instruction;
    return data;
  }

  completePopup() {
    this.batchprocessService.getProcessActionOnBatch(this.batchData, this, this.actionService);
  }

  genrateBatchId() {
    let allBatch = [];
    allBatch = this.contextService.getDataByString("#allBatchData");
    let currentBatch = allBatch[this.batchData.batchIndex];
    // this.batchData.batchUnits = currentBatch.batchUnits;
    // this.items = currentBatch.batchUnits;
    let batchName = "";

    if (this.items && this.items.length > 0) {
      let max = this.items.reduce((prev, current) => (prev.batchDetailsReponse.unitOrder > current.batchDetailsReponse.unitOrder) ? prev : current)
      let maxOrderId = parseInt(max.batchDetailsReponse.unitOrder);
      maxOrderId = maxOrderId + 1;

      if (maxOrderId && maxOrderId < 10) {
        batchName = this.batchData.batchName + "0" + maxOrderId;
      } else {
        batchName = this.batchData.batchName + maxOrderId;
      }
    } else {
      batchName = this.batchData.batchName ? (this.batchData.batchName + "01") : '';
    }
    return batchName;
  }

  takeoverBatch() {
    if (this.batchData && this.batchData["holdStatus"]) {
      this.batchprocessService.releaseBatchFromTakeOver(this.batchData, this, this.actionService);
    } else {
      this.batchprocessService.createNewBatchFromTakeOver(this.batchData, this, this.actionService);
    }

  }

  addNotesForTheUnit(event, item, i) {
    this.batchData.batchUnits[i].notes = event.target.value;
  }

  getPopupStyle() {
    return this.batchprocessService.batchPopup;
  }

  getOrderId(text) {
    let order = text.slice(text.length - 2, text.length);
    return order
  }

  onDblClick(group: MatButtonToggleGroup, event, i, item){
    if (!this.currentBatchTakeoverStatus) {
    this.toggleChanged = true;
    this.contextService.addToContext("toggleSelect", event.target.innerText);
    if (event.target.innerText == "Fail" || event.target.innerText == "Pass") {
      this.contextService.addToContext("failUnit", item);
      if (this.batchData && this.batchData.batchUnits) {
        let finResultCodeArr = [];
        this.contextService.addToContext("currentFailUnitResultCodes", finResultCodeArr);
        for (let i = 0; i < this.batchData.batchUnits.length; i++) {
          if (this.batchData.batchUnits[i]['batchDetailsReponse']['serialNo'] === item['batchDetailsReponse']['serialNo'] && this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList']) {
            for (let j = 0; j < this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'].length; j++) {
              if (event.target.innerText=="Fail" && this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['sourceTaskAction'] && this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['sourceTaskAction'].toLowerCase() == "fail") {
                finResultCodeArr.push({
                  destinationWc: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['destinationWc'],
                  instruction: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['instruction'],
                  modelNo: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['modelNo'],
                  outcomeCodeId: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['outcomeCodeId'],
                  serialNo: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['serialNo'],
                  sourceTaskAction: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['sourceTaskAction'],
                  outcomeCodeValue: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['outcomeCodeId']
                });
              } else if(event.target.innerText=="Pass" && this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['sourceTaskAction'] && this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['sourceTaskAction'].toLowerCase() == "pass") {
                finResultCodeArr.push({
                  destinationWc: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['destinationWc'],
                  instruction: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['instruction'],
                  modelNo: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['modelNo'],
                  outcomeCodeId: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['outcomeCodeId'],
                  serialNo: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['serialNo'],
                  sourceTaskAction: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['sourceTaskAction'],
                  outcomeCodeValue: this.batchData.batchUnits[i]['batchDetailsReponse']['outcomeCodeList'][j]['outcomeCodeId']
                });
              }
            }
            this.contextService.addToContext("currentFailUnitResultCodes", finResultCodeArr);
            break;
          }
        }
      }
    } else {
      this.contextService.addToContext("failUnit", {});
    }

    if (this.options != null && this.options != undefined) {
      this.options.forEach(optionItem => {
        if (optionItem.value == event.value) {
          if (!this.currentBatchTakeoverStatus) {
            this.activeItemBGColor = optionItem.bgcolor;
            this.activeItemColor = optionItem.color;
          }          
        }
      });
    }

    

    this.eventMap.forEach((ele) => {
      if (ele === "dblclick") {
        this.eventprocessor.handleEvent(this, { "type": ele });       
      }
    });
    this.batchData.batchUnits[i].condition = event.target.innerText;
    if (event.target.innerText !== "" && event.target.innerText.toLowerCase() === "pass") {
      let isKeyingWC= this.batchProcessService.checkKeyingWC();
     let passResultCodeList;
      if(isKeyingWC){
        passResultCodeList= this.getKeyingResultCode(item,i);
      }else{
       passResultCodeList = this.getResultcodeArray(item, i);
      }
      if (passResultCodeList && passResultCodeList.length > 1) {
        this.items[i]['batchDetailsReponse']["selectedDestinationWC"] = "";
      } else {
        this.items[i]['batchDetailsReponse']["selectedDestinationWC"] = passResultCodeList && passResultCodeList[0] ? passResultCodeList[0]['destinationWc'] : "";
      }
      //changes related issue no 1693.
      let rC = item.resultCodeList ? item.resultCodeList : item.batchDetailsReponse.outcomeCodeList;
      let selectOnPassIndex = rC.findIndex(e => (e.outcomeCodeId.includes("SND_HERD") ||  e.outcomeCodeId.includes("SND_TMS"))&& e.sourceTaskAction == "Pass");
      if (selectOnPassIndex > -1) {
        let selectOnPass = rC[selectOnPassIndex];
        // this.selectedDDValue = selectOnPass.outcomeCodeId;
        this.batchData.batchUnits[i].instruction = selectOnPass.instruction;
        this.batchData.batchUnits[i].selectedRc = selectOnPass.outcomeCodeId;
      }
    } else {
      this.items[i]['batchDetailsReponse']["selectedDestinationWC"] = "";
      this.batchData.batchUnits[i].instruction = "";
      this.batchData.batchUnits[i].selectedRc = "";
    }
    }
    if (this.currentBatchTakeoverStatus) {
      this.activeItemBGColor = "";
      this.activeItemColor = "";
      setTimeout(()=>{
        $(".mat-button-toggle-checked").css({"background-color":"white","color":"lightgray","pointer-events": "none"})
      },500);
      
    }
    // this.enableButton();
  }
}
