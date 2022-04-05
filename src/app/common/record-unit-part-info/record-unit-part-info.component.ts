import { EventServiceService } from '../../services/commonServices/eventService/event-service.service';
import { FormGroup } from '@angular/forms';
// import { CustomeService } from './../../services/customeService/custome.service';
import { ActionService } from './../../services/action/action.service';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, ComponentFactoryResolver, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { element } from 'protractor';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-record-unit-part-info',
  templateUrl: './record-unit-part-info.component.html',
  styleUrls: ['./record-unit-part-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class RecordUnitPartInfoComponent implements OnInit {

  @Input() group: FormGroup;
  @Input() css: string;
  @Input() names: any[];
  @Input() bomCount: any;
  @Input() bomList: any;
  @Input() tanList: any;
  @Input() boms: any;
  @Input() value: any;
  @Input() conditionFlexField: any;

  @ViewChildren("pcbno") public pcbno: QueryList<ElementRef>;

  disableFields = true;
  dataArray: any[] = [];
  options: any[];
  conditionDD: any[] = [];
  eventMap = ['input', 'keyup'];
  actionIndex;

  constructor(
    private contextService: ContextService,
    private actionService: ActionService,
    private eventService: EventServiceService,
    translate: TranslateService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {
    if (this.bomList && this.bomList != undefined) {
      if (this.bomList.startsWith('#')) {
        this.bomList = this.contextService.getDataByString(this.bomList);
      }
    }

    if (this.tanList && this.tanList != undefined) {
      if (this.tanList.startsWith('#')) {
        this.tanList = this.contextService.getDataByString(this.tanList);
      }
    }

    if (this.boms && this.boms != undefined) {
      if (this.boms.startsWith('#')) {
        this.boms = this.contextService.getDataByString(this.boms);
      }
    }

    this.sortArry(this.boms);
    this.bomCount = this.dataArray.length

    if (this.conditionFlexField && this.conditionFlexField != undefined) {
      if (this.conditionFlexField.startsWith('#')) {
        this.conditionFlexField = this.contextService.getDataByString(this.conditionFlexField);
        this.conditionFlexField = this.conditionFlexField.map(s => ({
          code: s.flextFieldValue,
          displayValue: s.flextFieldValue
        }));
      }
    }

    if (this.disableFields) {
      let count = 0;
      for (var i = 0; i < this.dataArray.length; i++) {
        let array = this.dataArray[i].filter(a => a.compPartNo);
        if (array.length > 0) {
          this.names.forEach(item => {
            if (item !== "tan_in") {
              let itmName = item + i;
              if (itmName.includes('serialNo')) {
                this.disabledFields(itmName);
              } else {
                if (!itmName.includes(count)) {
                  if (itmName != undefined && !itmName.includes("pcbName")) {
                    this.disabledFields(itmName);
                  }
                }
              }
            }
          });
        } else {
          count = count + 1;
          this.disabledFields("serialNo" + i);
        }
        //to update the condition fields.
        this.conditionDD.push("missing");
      }
    }
  }

  ngAfterViewInit() {
    if (this.group.status !== "VALID") {
      setTimeout(() => {
        this.pcbno.first.nativeElement.focus();
        this.pcbno.first.nativeElement.autoFocus = true;
      }, 300)
    }
  }

  counter(bomCount) {
    return new Array(bomCount);
  }

  getName(name, i) {
    return name + i;
  }

  getValueFromGroup(name) {
    if (this.group.controls[name].status !== "DISABLED") {
      return this.group.controls[name].value;
    } else {
      return undefined;
    }
  }

  enableFields(item) {
    this.group.controls[item].enable();
  }

  disabledFields(item) {
    this.group.controls[item].disable();
  }

  getPlaceholder(index) {
    let dValue = this.getValueFromGroup(this.names[3] + index);
    if (dValue === "Missing") {
      this.addValuesToField("", this.names[2] + index);
      return 'xxxxxxxxxxxx';
    } else {
      return 'Scan Serial Number';
    }
  }

  onInput(event, i) {
    this.actionIndex = i;
    let array = this.dataArray[i];
    let fieldValue = this.getValueFromGroup(event.target.id);
    let conditionValue = this.getValueFromGroup(this.names[3] + i);
    let fieldName = this.names[1] + i;
    if (fieldValue == undefined && fieldValue == null) {
      fieldValue = "";
    }
    array = array.filter(a => a.compPartNo);
    array.forEach(element => {
      let re = new RegExp("^" + element.compRegexp);
      if (re.test(fieldValue.trim())) {
        fieldValue = fieldValue.trim();
        this.addValuesToField(fieldValue, this.names[0] + i);
        this.contextService.addToContext("partNumber", fieldValue);
        this.eventMap.forEach((ele) => {
          if (ele === event.type) {
            this.eventService.handleEvent(this, event);
          }
        });
      } else {
        this.disabledFields(this.names[2] + i);
        this.addValuesToField("", fieldName);
        if (conditionValue !== "Missing") {
          this.conditionDD.splice(i, 1, "missing");
          this.changeDropdown(event, i);
        }
      }
    });
  }

  onScanNoInput(event, i) {
    let scanNoValue = this.getValueFromGroup(event.target.id);
    let regx = new RegExp("^[a-zA-Z0-9]{6,20}$");
    let nextIndex = i + 1;

    if (this.conditionDD[i] === "normal") {
      if (regx.test(scanNoValue)) {
        if (this.bomCount > nextIndex) {
          this.checkNextRow(i, "enable")
        }
      } else {
        if (this.bomCount > nextIndex) {
          this.checkNextRow(i, "disable")
        }
      }
    } else if (this.conditionDD[i] === "missing" && i !== 0) {
      let pcbValue = this.getValueFromGroup(this.names[0] + i);
      let tanValue = this.getValueFromGroup(this.names[4] + i);

      if (pcbValue === null && tanValue !== null) {
        if (regx.test(scanNoValue)) {
          if (this.bomCount > nextIndex) {
            this.checkNextRow(i, "enable")
          }
        } else {
          if (this.bomCount > nextIndex) {
            this.checkNextRow(i, "disable")
          }
        }
      }

    }
  }

  checkNextRow(index, value) {
    let array = this.dataArray;
    for (let i = index + 1; i < array.length; i++) {
      let data = array[i];
      if (value === "enable") {
        if (data[0].mandatory === "N") {
          this.enableFields(this.names[0] + i);
          this.enableFields(this.names[3] + i);
          this.enableFields(this.names[4] + i);
        } else if (data[0].mandatory === "Y") {
          this.enableFields(this.names[0] + i);
          this.enableFields(this.names[3] + i);
          this.enableFields(this.names[4] + i);
          break;
        }
      } else if (value === "disable") {
        if (data[0].mandatory === "N") {
          this.disabledFields(this.names[0] + i);
          this.disabledFields(this.names[3] + i);
          this.disabledFields(this.names[4] + i);
        } else if (data[0].mandatory === "Y") {
          this.disabledFields(this.names[0] + i);
          this.disabledFields(this.names[3] + i);
          this.disabledFields(this.names[4] + i);
          break;
        }
      }
    }
  }

  addValuesToField(value, fieldName) {
    if (value == undefined && value == null) {
      value = "";
    }
    this.group.controls[fieldName].setValue(value.trim());
  }

  changeDropdown(event, index) {
    let dValue = this.getValueFromGroup(this.names[3] + index);
    if (dValue === "Missing") {
      if (this.conditionDD[index] === "all") {
        let data = this.dataArray[index];
        let partno = "", pcb = "";
        let result = data.map(a => {
          if (a.compPartNo && a.compPartNo !== "" && a.compPartNo !== undefined && a.compPartNo !== null) {
            return a.assemblyCode.charAt(a.assemblyCode.length - 1)
          }
        });
        // to remove undefined values.
        result = result.filter(a => a !== undefined);
        result = result.toString();
        data = data.filter(a => a.compPartNo);
        if (data.length > 1) {
          data.forEach((element, i) => {
            partno += element.pcbPartNo + ",";
            // pcb += element.compPartNo + ",";
          });
          partno = partno.substring(0, partno.length - 1);
          // pcb = pcb.substring(0, pcb.length - 1);
        } else {
          partno = data[0].pcbPartNo;
        }
        pcb = data[0].compPartNo + " " + result;
        // this.addValuesToField(partno, this.names[0] + index);
        this.addValuesToField(pcb, this.names[1] + index);
        // this.disabledFields(this.names[0] + index);
        this.disabledFields(this.names[2] + index);
      }
      // missing functionality;
      if (this.conditionDD[index] === "missing") {
        this.addValuesToField("", this.names[2] + index);
        // this.disabledFields(this.names[0] + index);
        this.disabledFields(this.names[2] + index);

        for (let i = index; i < this.bomCount; i++) {
          let data = this.dataArray[i];
          let partno = "", pcb = "";
          let result = data.map(a => {
            if (a.compPartNo && a.compPartNo !== "" && a.compPartNo !== undefined && a.compPartNo !== null) {
              return a.assemblyCode.charAt(a.assemblyCode.length - 1)
            }
          });
          // to remove undefined values.
          result = result.filter(a => a !== undefined);
          data = data.filter(a => a.compPartNo);

          if (data.length > 1) {
            data.forEach((element) => {
              partno += element.pcbPartNo + ",";
            });
            partno = partno.substring(0, partno.length - 1);
          } else {
            partno = data[0].pcbPartNo;
          }
          pcb = data[0].compPartNo + " " + result;

          this.addValuesToField(pcb, this.names[1] + i);
          this.addValuesToField("Missing", this.names[3] + i);
          this.enableFields(this.names[0] + i);
          this.enableFields(this.names[3] + i);
          this.enableFields(this.names[4] + i);
          this.conditionDD.splice(i, 1, "all");
        }
      }
    } else if (dValue !== "Missing" && dValue !== null) {
      if (this.conditionDD[index] === "all") {
        // this.enableFields(this.names[0] + index);
        this.enableFields(this.names[2] + index);
        //this.addValuesToField("", this.names[0] + index);
        //this.addValuesToField("", this.names[1] + index);
      }
    }
  }

  sortArry(item) {
    let previosData = "";
    let margedData = item.TAN_IN.concat(item.BOMLIST);
    margedData = margedData.sort(function (a, b) {
      var nameA = a.assemblyCode;
      var nameB = b.assemblyCode;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    });
    margedData.forEach(element => {
      let compairStr = element.assemblyCode.substring(0, element.assemblyCode.length - 1);
      if (compairStr !== previosData) {
        previosData = compairStr;
        let temp = margedData.filter((ele) => ele.assemblyCode.includes(compairStr));
        this.dataArray.push(temp);
      }
    });
  }

  // function to get the part no from array
  getLabelData(index) {
    let data = this.dataArray[index];
    if (data.length > 1) {
      let placeholder = ""
      data.forEach((element, i) => {
        if (element.compPartNo && element.compPartNo !== "" && element.compPartNo !== undefined && element.compPartNo !== null) {
          placeholder += element.pcbPartNo.split('-')[0] + '-' + element.pcbPartNo.split('-')[1] + ",";
        }
      });
      return placeholder.substring(0, placeholder.length - 1);
    } else {
      if (data[0].compPartNo && data[0].compPartNo !== "" && data[0].compPartNo !== undefined && data[0].compPartNo !== null) {
        return data[0].pcbPartNo.split('-')[0] + '-' + data[0].pcbPartNo.split('-')[1];
      }
    }
  }

  // function to set the dropdown values in array.
  getOptions(index) {
    let result;
    if (this.conditionDD[index] === "missing") {
      result = this.conditionFlexField.filter(ele => ele.code === "Missing");
    } else if (this.conditionDD[index] === "all") {
      result = this.conditionFlexField;
    } else if (this.conditionDD[index] === "normal") {
      result = this.conditionFlexField.filter(ele => ele.code !== "Missing");
    }
    return result;
  }

  // need to execute once all small fixes are done.
  public validateThePartNo() {
    // console.log("test data");
  }

  getRequiredStatus(index) {
    let result;
    this.dataArray[index].forEach((element, i) => {
      if (element.mandatory === "N") {
        result = false;
      } else {
        result = true;
      }
    })
    return result;
  }

  // TAN Related code.
  getTanLabelData(index) {
    let data = this.dataArray[index];
    if (data.length > 1) {
      let placeholder = ""
      data.forEach((element, i) => {
        if (!element.compPartNo || element.compPartNo === "" || element.compPartNo === undefined || element.compPartNo === null) {
          placeholder += element.compRegexp.split('-')[0] + '-' + element.compRegexp.split('-')[1] + ",";
        }
      });
      return placeholder.substring(0, placeholder.length - 1);
    } else {
      if (!data[0].compPartNo || data[0].compPartNo === "" || data[0].compPartNo === undefined || data[0].compPartNo === null) {
        return data[0].compRegexp.split('-')[0] + '-' + data[0].compRegexp.split('-')[1];
      }
    }
  }

  onTanInput(event, i) {
    this.actionIndex = i;
    let array = this.dataArray[i];
    let flag = false;
    let enableField = false;
    let fieldValue = this.getValueFromGroup(event.target.id);
    if (fieldValue == undefined && fieldValue == null) {
      fieldValue = "";
    }

    if (array.filter(a => a.compPartNo).length === 0) {
      // console.log("No PCB with Tan.");
      flag = true;
    }
    this.onKeyUpEvent(event, i)
    array = array.filter(a => !a.compPartNo);
    array.forEach(element => {
      let re = new RegExp("^" + element.compRegexp);
      if (re.test(fieldValue.trim())) {
        fieldValue = fieldValue.trim();
        this.addValuesToField(fieldValue, this.names[4] + i);
        if (i === 0) {
          this.contextService.addToContext("tanValue", element);
          this.contextService.addToContext("tan", fieldValue);
        }
        this.contextService.addToContext("checkPartNumber", fieldValue);
        this.eventMap.forEach((ele) => {
          if (ele === event.type) {
            this.eventService.handleEvent(this, event);
          }
        });
        enableField = true;
      }
      // changes to enable the serial no field if main tan is present.
      if (flag === true) {
        let validate = new RegExp(this.getRequiredForTan(i));
        if (validate.test(fieldValue.trim())) {
          this.enableFields("serialNo" + i);
        } else {
          this.disabledFields("serialNo" + i);
        }
      }
    });
  }

  getRequiredForTan(i) {
    let array = this.dataArray[i];
    array = array.filter(a => !a.compPartNo);
    let temp = array.map(a => a.compRegexp.replace("$", ""));
    temp = temp.toString();
    array.forEach(element => {
      temp = temp.replace(",", "|");
    });
    return "^(" + temp + ")$";
  }

  getRequiredForPCB(i) {
    let array = this.dataArray[i];
    array = array.filter(a => a.compPartNo);
    let temp = array.map(a => a.compRegexp.replace("$", ""));
    temp = temp.toString();
    array.forEach(element => {
      temp = temp.replace(",", "|");
    });
    return "^(" + temp + ")$";
  }

  // changes related focus on textbox.
  onKeyUpEvent(event, i) {
    let keyCode = event.keyCode;
    let index = i + 1;
    if (keyCode === 13 || keyCode === "13") {
      if (this.group.controls[event.target.id].status === "VALID") {
        if (event.target.id.includes("pcb_in")) {
          if (this.getInstance("tan_in", i) !== null) {
            this.setFocus("tan_in", i);
          } else if (this.getInstance("serialNo", i) !== null && this.group.controls["serialNo" + i].status !== "DISABLED") {
            this.setFocus("serialNo", i);
          } else if (this.getInstance("pcb_in", index) !== null && this.group.controls["pcb_in" + index].status !== "DISABLED") {
            this.setFocus("pcb_in", index);
          }
        } else if (event.target.id.includes("tan_in")) {
          if (this.getInstance("serialNo", i) !== null && this.group.controls["serialNo" + i].status !== "DISABLED") {
            this.setFocus("serialNo", i);
          } else if (this.getInstance("pcb_in", index) !== null && this.group.controls["pcb_in" + index].status !== "DISABLED") {
            this.setFocus("pcb_in", index);
          } else if (this.getInstance("tan_in", index) !== null) {
            this.setFocus("tan_in", index);
          }
        } else if (event.target.id.includes("serialNo")) {
          if (this.getInstance("pcb_in", index) !== null) {
            this.setFocus("pcb_in", index);
          } else if (this.getInstance("tan_in", index) !== null) {
            this.setFocus("tan_in", index);
          }
        }
      }
    }
  }

  getInstance(name, index) {
    return document.getElementById(name + index);
  }

  setFocus(name, index) {
    document.getElementById(name + index).focus();
  }
}
