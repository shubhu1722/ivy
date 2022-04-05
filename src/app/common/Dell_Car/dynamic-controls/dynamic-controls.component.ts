import { Component, OnInit, Input } from '@angular/core';
import { ActionService } from '../../../services/action/action.service';
import { UtilityService } from '../../../utilities/utility.service';
import { ContextService } from '../../../services/commonServices/contextService/context.service';

@Component({
  selector: 'app-dynamic-controls',
  templateUrl: './dynamic-controls.component.html',
  styleUrls: ['./dynamic-controls.component.scss']
})
export class DynamicControlsComponent implements OnInit {
  @Input() templateType: any;
  @Input() splitDatabyOperator: any;
  private template;
  private looperControlData;
  private previousWCData;
  private ramCapacityLooperControlData: any;
  private ramCapacityPreviousWCData:any;
  private ramCapacityData: any;
  private hddSerialNumberLooperControlData: any;
  private hddSerialNumberPreviousWCData:any;
  private hddCapacityLooperControlData: any;
  private hddCapacityPreviousWCData:any;
  private hddSerialNumberData: any;
  private hddCapacityData: any;
  private isRamGetFFByWCData:any;
  private isLooperControl: boolean = false;
  constructor(private actionService: ActionService,
    private utilityService: UtilityService,
    private contextService: ContextService) { }

  ngOnInit(): void {
    this.looperControlData = this.contextService.getDataByKey("getFFByWc");
    this.previousWCData=this.contextService.getDataByKey("getPreviouseWc");

    if (this.templateType == "ramFields") {

      this.ramCapacityLooperControlData = this.looperControlData && this.looperControlData.find((x) => x.ffName === "RAM No.1").ffValue;
      this.ramCapacityPreviousWCData = this.previousWCData && this.previousWCData.find((x) => x.ffName === "RAM No.1").ffValue;
      /// Looper control data takes first priority
      if (this.ramCapacityLooperControlData && this.ramCapacityLooperControlData.length > 0) {
        if(this.ramCapacityLooperControlData!=="CID" && this.ramCapacityLooperControlData!=="HOLD"){
        this.ramCapacityData = this.ramCapacityLooperControlData;
        this.isLooperControl = true;
        }else{
          this.ramCapacityData = this.deserializeData('ramCapacityFormData');
          if(this.ramCapacityData.length==0){
            for (let i=1; i<=32;i++){
              let clearRamContextKey=`dellCarRamCapacityslot${i}UUIDselected`
              this.contextService.deleteDataByKey(clearRamContextKey);
            }
            }
        }
      }else if(this.ramCapacityPreviousWCData && this.ramCapacityPreviousWCData.length > 0){
        this.ramCapacityData = this.ramCapacityPreviousWCData;
        this.isLooperControl = false;
        for (let i=0; i<=this.ramCapacityData.length;i++){
          let clearRamContextKey=`dellCarRamCapacityslot${i}UUIDselected`
          this.contextService.addToContext(clearRamContextKey , true);
         }
      }
      else {
        this.ramCapacityData = this.deserializeData('ramCapacityFormData');
      if(this.ramCapacityData.length==0){
        for (let i=1; i<=32;i++){
          let clearRamContextKey=`dellCarRamCapacityslot${i}UUIDselected`
          this.contextService.deleteDataByKey(clearRamContextKey);
        }
        }
       
      }

      if (this.splitDatabyOperator) {
        this.ramCapacityData = typeof this.ramCapacityData === 'string' ? this.ramCapacityData.split(";") : this.ramCapacityData;
      }

      if (this.ramCapacityData && this.ramCapacityData.length > 0) {

        // Remove the first element of the array
        // this.ramCapacityData = this.ramCapacityData.shift();

        let dataLength = this.ramCapacityData.length;

        //@loop through each item to create the given component
        this.ramCapacityData.forEach((rec, index) => {
          if (index === 0) {
            // Update RamCapacityDropdown 1
          if(rec!=="CID" && rec!=="HOLD"){
            let actions = [
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarRecordRamTaskPanelUUID",
                  "fieldProperties": {
                    "dellCarRamCapacityDropdown1": rec
                  }
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarRamCapacityslot1UUID",
                  "properties": {
                    "disabled":  this.isLooperControl ? true : false,
                  }
                }
              }
            ]
            actions.forEach((ele) => {
              this.actionService.handleAction(ele, null);
            });
          }

            return;
          }
          this.template = {
            "type": "updateTaskPanelRightSide",
            "config": {
              "key": "dellCarRecordRamTaskPanelUUID",
              "properties": {
                "rightItems": [
                  {
                    "ctype": "dropdownWithSearch",
                    "containerId": "expansionpanelcontent",
                    "uuid": `dellCarRamCapacityslot${index + 1}UUID`,
                    "name": `dellCarRamCapacityDropdown${index + 1}`,
                    "label": `Slot ${index + 1} RAM Capacity`,
                    "hooks": [],
                    "dropdownClass": "col-4 dropdown-container textfield-container",
                    "labelClass": "pl-0 align-left rework-lable-width subtitle1-align-self greyish-black",
                    "formGroupClass": "drop-down-select-full-width form-group-margin",
                    "labelPosition": "left",
                    "required": false,
                    "selectDisabled": false,
                    "disableSort": true,
                    "focus": true,
                    "submitable": true,
                    "code": "ramcode",
                    "displayValue": "ramValue",
                    "dataSource": "#getProcessWCData.recordram",
                    "defaultValue": rec,
                    "isDisableNotReq": true,
                    "disabled": this.isLooperControl ? true : false,
                    "actions": [
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "userSelectedRam" + index + 1,
                          "data": "elementControlValue"
                        },
                        "eventSource": "change"
                      },
                      {
                        "type": "isCurrentComponentSelected",
                        "eventSource": "change",
                      },
                      {
                        "type": "condition",
                        "config": {
                          "operation": "isEqualTo",
                          "lhs": "#userSelectedRam" + index + 1,
                          "rhs": "-Select-"
                        },
                        "eventSource": "change",
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "resetCurrentControl",
                                "eventSource": "click"
                              }
                            ]
                          },
                          "onFailure": {
                            "actions": [
                              {
                                "type": "condition",
                                "config": {
                                  "operation": "isEqualTo",
                                  "lhs": "#currentComponentSelected",
                                  "rhs": true,
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": []
                                  },
                                  "onFailure": {
                                    "actions": [
                                      {
                                        "type": "selectedCurrentControl",
                                        "eventSource": "click"
                                      },
                                      {
                                        "type": "handelDellCarAssessmentAction",
                                        "methodType": "createRamdropdown",
                                        "config": {
                                          "index": dataLength
                                        },
                                        "eventSource": "change"
                                      }
                                    ]
                                  }
                                }
                              }
                            ]
                          }
                        }
                      },
                    ]
                  }
                ]
              }
            },
            "eventSource": "change"
          }
          this.actionService.handleAction(this.template, this);
        });
      }
    }

    if (this.templateType == "HddFields") {
      this.hddCapacityLooperControlData = this.looperControlData && this.looperControlData.find((x) => x.ffName === "HDD No.1 CAP").ffValue;

      this.hddCapacityPreviousWCData = this.previousWCData && this.previousWCData.find((x) => x.ffName === "HDD No.1 CAP").ffValue;
      
      this.hddSerialNumberLooperControlData = this.looperControlData && this.looperControlData.find((x) => x.ffName === "HDD SN No.1").ffValue;

      this.hddSerialNumberPreviousWCData = this.previousWCData && this.previousWCData.find((x) => x.ffName === "HDD SN No.1").ffValue;

      this.isRamGetFFByWCData = this.looperControlData && this.looperControlData.find((x) => x.ffName === "RAM No.1").ffValue;
      /// Looper control data takes first priority
      if (this.isRamGetFFByWCData && this.isRamGetFFByWCData.length > 0) {
        if (this.hddCapacityLooperControlData && this.hddCapacityLooperControlData.length > 0) {
          if(this.hddCapacityLooperControlData!=="CID" && this.hddCapacityLooperControlData!=="HOLD"){
          this.hddCapacityData = this.hddCapacityLooperControlData;
          this.hddSerialNumberData = this.hddSerialNumberLooperControlData;
          this.isLooperControl = true;
          }else{
            this.hddCapacityData = this.deserializeData('hddCapacityFormData');
            this.hddSerialNumberData = this.deserializeData('hddSerialNumberFormData');
            if (this.hddSerialNumberData.length == 0) {
              for (let i = 1; i <= 32; i++) {
                let clearHddContextKey = `dellCarHDDSerial${i}UUIDselected`
                this.contextService.deleteDataByKey(clearHddContextKey);
              }
            }
          }
        } else {
          this.hddCapacityData = this.deserializeData('hddCapacityFormData');
          this.hddSerialNumberData = this.deserializeData('hddSerialNumberFormData');
          if (this.hddSerialNumberData.length == 0) {
            for (let i = 1; i <= 32; i++) {
              let clearHddContextKey = `dellCarHDDSerial${i}UUIDselected`
              this.contextService.deleteDataByKey(clearHddContextKey);
            }
          }
        }
      } else {
        if (this.hddSerialNumberPreviousWCData && this.hddSerialNumberPreviousWCData.length > 0) {
          this.hddCapacityData = this.hddCapacityPreviousWCData;
          this.hddSerialNumberData = this.hddSerialNumberPreviousWCData;
          this.isLooperControl = false;
          for (let i = 0; i <= this.hddSerialNumberData.length; i++) {
            let clearHddContextKey = `dellCarHDDSerial${i}UUIDselected`
            this.contextService.addToContext(clearHddContextKey, true);
          }
        } else {
          this.hddCapacityData = this.deserializeData('hddCapacityFormData');
          this.hddSerialNumberData = this.deserializeData('hddSerialNumberFormData');
          if (this.hddSerialNumberData.length == 0) {
            for (let i = 1; i <= 32; i++) {
              let clearHddContextKey = `dellCarHDDSerial${i}UUIDselected`
              this.contextService.deleteDataByKey(clearHddContextKey);
            }
          }
        }
      }
     
    
      if (this.splitDatabyOperator) {
        this.hddCapacityData = typeof this.hddCapacityData === 'string' ? this.hddCapacityData.split(";") : this.hddCapacityData;
        this.hddSerialNumberData = typeof this.hddSerialNumberData === 'string' ? this.hddSerialNumberData.split(";") : this.hddSerialNumberData;
      }

      if (this.hddCapacityData && this.hddCapacityData.length > 0) {

        let dataLength = this.hddCapacityData.length;

        //@loop through each item to create the given component
        this.hddCapacityData.forEach((rec, index) => {
          if (index === 0) {
            if(rec!=="CID" && rec!=="HOLD"){
            let actions = [
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarRecordHDDTaskPanelUUID",
                  "fieldProperties": {
                    "dellCarHDDCapacityDropdown1": this.hddCapacityData[index]
                  }
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarHDD1CapacityUUID",
                  "properties": {
                    "disabled": this.isLooperControl ? true : false
                  }
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarRecordHDDTaskPanelUUID",
                  "fieldProperties": {
                    "dellCarHDDSerialNumber1": this.hddSerialNumberData[index],
                  }
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarHDDSerial1UUID",
                  "properties": {
                    "disabled": this.isLooperControl ? true : false
                  }
                }
              }
            ]
            actions.forEach((ele) => {
              this.actionService.handleAction(ele, null);
            });
          }
            return;
          }
          this.template = {
            "type": "updateTaskPanelRightSide",
            "config": {
              "key": "dellCarRecordHDDTaskPanelUUID",
              "properties": {
                "rightItems": [
                  {
                    "ctype": "dropdownWithSearch",
                    "containerId": "expansionpanelcontent",
                    "disableSort": true,
                    "uuid": `dellCarHDD${index + 1}CapacityUUID`,
                    "name": `dellCarHDDCapacityDropdown${index + 1}`,
                    "label": `HDD ${index + 1} Capacity`,
                    "dropdownClass": "col-4 dropdown-container textfield-container",
                    "labelClass": "pl-0 align-left rework-lable-width subtitle1-align-self greyish-black",
                    "formGroupClass": "drop-down-select-full-width form-group-margin",
                    "labelPosition": "left",
                    "focus": true,
                    "required": false,
                    "code": "recordHDDcode",
                    "displayValue": "recordHDDValue",
                    "dataSource": "#getProcessWCData.recordHDD",
                    "defaultValue": this.hddCapacityData[index],
                    "disabled": this.isLooperControl ? true : false,
                    "hooks": [],
                    "actions": [],
                    "isDisableNotReq": true
                  },
                  {
                    "ctype": "textField",
                    "containerId": "expansionpanelcontent",
                    "uuid": `dellCarHDDSerial${index + 1}UUID`,
                    "hooks": [],
                    "type": "text",
                    "isUpperCase": true,
                    "placeholder": "Scan #",
                    "submitable": true,
                    "visibility": true,
                    "onlyEnterKeyPress": true,
                    "focusOut": true,
                    "disableCompleteButtonEnterActions": true,
                    "focus": false,
                    "label": `HDD ${index + 1} Serial Number`,
                    "labelPosition": "left",
                    "textfieldClass": "col-4 dropdown-container textfield-container",
                    "name": `dellCarHDDSerialNumber${index + 1}`,
                    "required": false,
                    "defaultValue": this.hddSerialNumberData[index],
                    "labelClass": "pl-0 align-left rework-lable-width subtitle1-align-self greyish-black",
                    "validations": [
                      {
                          "type": "regex",
                          "script": "[0-9a-zA-Z]{0,32}"
                      }
                     ],
                    "disabled": this.isLooperControl ? true : false,
                    "actions": [
                      {
                        "type": "isCurrentComponentSelected",
                        "eventSource": "keydown"
                      },
                      {
                        "type": "condition",
                        "eventSource": "keydown",
                        "config": {
                          "operation": "isEqualTo",
                          "lhs": "#currentComponentSelected",
                          "rhs": true,
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": []
                          },
                          "onFailure": {
                            "actions": [
                              {
                                "type": "selectedCurrentControl",
                                "eventSource": "click"
                              },
                              {
                                "type": "handelDellCarAssessmentAction",
                                "methodType": "createHDDFields",
                                "config": {
                                  "index": dataLength
                                },
                                "eventSource": "change"
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            },
            "eventSource": "change"
          }

          this.actionService.handleAction(this.template, this)
        });
      }
    }
  }



  deserializeData(data) {
    return this.contextService.getDataByKey(data) || [];
  }
}
