import { ActionService } from 'src/app/services/action/action.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Input,
  ComponentFactoryResolver,
  ChangeDetectorRef
} from '@angular/core';
import { CustomeService } from 'src/app/services/commonServices/customeService/custome.service';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { UtilityService } from 'src/app/utilities/utility.service';
import { ComponentService } from 'src/app/services/commonServices/componentService/component.service';

@Component({
  selector: 'app-flex-fields',
  templateUrl: './flex-fields.component.html',
  styleUrls: ['./flex-fields.component.sass']
})
export class FlexFieldsComponent implements OnInit {
  @ViewChild('fieldData', { static: true, read: ViewContainerRef })
  fieldData: ViewContainerRef;

  @Input() tileActions: any[];
  @Input() targetuuid: any;
  @Input() parentuuid: any;
  @Input() componentUUID: any;
  @Input() uuid: any;
  @Input() items: any[];
  @Input() rowData: any;
  @Input() disableFields: boolean;
  @Input() flexClass: string;
  @Input() footerButtonUUID: any;
  @Input() group: FormGroup;
  @Input() indexData: any;
  @Input() recursiveItemDisabled: boolean;
  @Input() visibility: boolean;

  constructor(
    private contextService: ContextService,
    private componentLoaderService: ComponentLoaderService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private actionService: ActionService,
    private customeService: CustomeService,
    private _changeDetectionRef: ChangeDetectorRef,
    private componentService: ComponentService,
    private utiliyService: UtilityService
  ) { }

  ngOnInit(): void {
    if (this.visibility !== undefined) {
      this.flexClass = this.visibility ? this.flexClass : 'hide';
    }
    // console.log(this.indexData);
    let ScreenMenuObj = this.contextService.getDataByKey("ScreenMenuObj");
    this.componentUUID = this.uuid;
    let formGroupArray = [];
    this.uuid = new FormGroup({});
    // tslint:disable-next-line: prefer-for-of
    this.contextService.addToContext('flexfieldsitems', this.items);
    for (let i = 0; i < this.items.length; i++) {
      var controlName = this.items[i].name;
      if (this.items[i].uuid != undefined) {
        if (this.items[i].uuid.charAt(0) >= 0) {
          controlName = controlName.replace(this.parentuuid - 1, this.parentuuid);
        } else {
          if (this.parentuuid !== undefined) {
            controlName = this.componentUUID + controlName;
          }
        }
      }
      this.uuid.addControl(
        controlName,
        new FormControl(this.items[i].value)
      );
    }

    // if (this.group !== undefined) {
    //   this.group.addControl(
    //     this.componentUUID,
    //     new FormControl(this.uuid)
    //   );
    // }

    /// Keep add groups to array
    if (
      this.contextService.getDataByKey('flexFieldsFormGroup') &&
      this.contextService.getDataByKey('flexFieldsFormGroup') !== undefined
    ) {
      const contextflexFieldsFormGroup = this.contextService.getDataByKey(
        'flexFieldsFormGroup'
      );
      contextflexFieldsFormGroup.push(this.uuid);
      this.contextService.addToContext(
        'flexFieldsFormGroup',
        contextflexFieldsFormGroup
      );
    } else {
      formGroupArray.push(this.uuid);
      this.contextService.addToContext('flexFieldsFormGroup', formGroupArray);
    }

    this.uuid.valueChanges.subscribe(() => {
      const refData = this.contextService.getDataByKey(
        this.footerButtonUUID + 'ref'
      );
      if (this.items[0].recursiveItemDisabled === true) {
        let missingAccessoriesList = this.contextService.getDataByKey('missingAccessoriesList');
        if (!missingAccessoriesList) {
          if (this.contextService.getDataByKey('confirmAccessoriesFlexFieldsData')) {
            missingAccessoriesList = [...this.contextService.getDataByKey('confirmAccessoriesFlexFieldsData')];
            this.contextService.addToContext('missingAccessoriesList', missingAccessoriesList);
          }
        }

        const partIndex = this.componentUUID + "partNumber";

        const userSelectedClientName = this.contextService.getDataByKey('userSelectedClientName').toLowerCase();
        const userSelectedContractName = this.contextService.getDataByKey('userSelectedContractName').toLowerCase();
        if (userSelectedClientName === "dell" && userSelectedContractName === "car") {

          let rightLabel = '';
          // Dell Packout Check Accessories Task
          const accValue = this.uuid.value[partIndex];
     
          if (!!missingAccessoriesList && missingAccessoriesList.length > 0) {
            missingAccessoriesList.forEach(accessory => {
              let index = this.componentUUID;
              let nextIndex = index + 1;
              
              if (accValue && accValue != undefined && accValue != "") {
                if (accValue.includes("$") || accValue.includes("#") || accValue.includes("^") || accValue.includes("%")) {

                  if (accessory.QR_CODE === this.uuid.value[partIndex]) {

                    const disableCurrentTextFieldAction = {
                      type: 'updateComponent',
                      config: {
                        key: this.componentUUID + "newNoUUID",
                        properties: {
                          readonly: true
                        }
                      }
                    };
                    this.componentService.handleUpdateComponent(disableCurrentTextFieldAction, null, null, this.utiliyService);
                   
                    const enabledNextTextFieldAction = {
                      type: 'updateComponent',
                      config: {
                        key: nextIndex + "newNoUUID",
                        properties: {
                          disabled: false
                        }
                      }
                    };
                    this.componentService.handleUpdateComponent(enabledNextTextFieldAction, null, null, this.utiliyService);

                    const disabledNextTextFieldAction = {
                      "type": "updateComponent",
                      "config": {
                        "key": nextIndex + "missingAccessoryUUID",
                        "properties": {
                          "iconTextClass": "body change-position",
                          "disabled": false
                        }
                      }
                    };
                    this.componentService.handleUpdateComponent(disabledNextTextFieldAction, null, null, this.utiliyService);

                    this.enableFocusOnNextField(true);

                    if (accessory.FF_NAME === "AC Adapter SN" || accessory.FF_NAME === "Battery SN")
                      rightLabel = accessory.FF_NAME;
                    else
                      rightLabel = accessory.FF_NAME;
          

                    const enableAccessoryNameAction = {
                      type: 'updateComponent',
                      config: {
                        key: this.componentUUID + "newNoUUID",
                        properties: {
                          rightLabel: rightLabel
                        }
                      }
                    };

                    let textFieldData = {
                      "ctype": "textField",
                      "uuid": this.componentUUID + "newNoUUID",
                      "value": this.uuid.value[partIndex],
                      "readonly": true,
                      "rightLabel": rightLabel,
                      "name": this.componentUUID + "partNumber"
                    }
                    this.contextService.addToContext(this.componentUUID + "newNoUUID", textFieldData);
                    this.componentService.handleUpdateComponent(enableAccessoryNameAction, null, null, this.utiliyService);

                    let removeMissingAccessoryAction = {
                      type: 'updateComponent',
                      config: {
                        key: this.componentUUID + "missingAccessoryUUID",
                        properties: {
                          hidden: true
                        }
                      }
                    };
                    let missingAccrs = {
                      "ctype": "iconText",
                      "uuid": this.componentUUID + "missingAccessoryUUID",
                      "hidden": true,
                      "name": this.componentUUID + "Missing Accessory ?"
                    }
                    this.contextService.addToContext(this.componentUUID + "accessoryTitleUUID", missingAccrs);
                    this.componentService.handleUpdateComponent(removeMissingAccessoryAction, null, null, this.utiliyService);

                    const noOfValidatedInCA = this.contextService.getDataByKey('numOfValidatedFieldsInCA');
                    if (!noOfValidatedInCA)
                      this.contextService.addToContext('numOfValidatedFieldsInCA', 1);
                    else
                      this.contextService.addToContext('numOfValidatedFieldsInCA', noOfValidatedInCA + 1);

                    const index = missingAccessoriesList.indexOf(accessory);
                    if (index > -1) {
                      missingAccessoriesList.splice(index, 1);
                    }
                    this.contextService.addToContext('missingAccessoriesList', missingAccessoriesList);
                  }
                }
              }
            });
          }

        }
        else {
          if (!!missingAccessoriesList && missingAccessoriesList.length > 0) {
            missingAccessoriesList.forEach(accessory => {
              let prefix = "";
              switch (accessory.FF_NAME) {
                case "AC Adapter SN":
                  prefix = "AC_";
                  break;
                case "Battery SN":
                  prefix = "BT_";
                  break;
                case "Accessory1":
                  prefix = "A1_";
                  break;
                case "Accessory2":
                  prefix = "A2_";
                  break;
                case "Accessory3":
                  prefix = "A3_";
                  break;
                case "Accessory4":
                  prefix = "A4_";
                  break;
                case "Accessory5":
                  prefix = "A5_";
                  break;
                case "Other":
                  prefix = "OT_";
                  break;
                default:
                  break;
              }

              if ((prefix + accessory.HASHCODE + "#") === this.uuid.value[partIndex]) {

                let disableCurrentTextFieldAction = {
                  type: 'updateComponent',
                  config: {
                    key: this.componentUUID + "newNoUUID",
                    properties: {
                      readonly: true
                    }
                  }
                };
                this.componentService.handleUpdateComponent(disableCurrentTextFieldAction, null, null, this.utiliyService);

                this.enableFocusOnNextField(false);

                let rightLabel = '';
                if (accessory.FF_NAME === "AC Adapter SN" || accessory.FF_NAME === "Battery SN")
                  rightLabel = accessory.FF_NAME;
                else
                  rightLabel = accessory.FF_VALUE;
                let enableAccessoryNameAction = {
                  type: 'updateComponent',
                  config: {
                    key: this.componentUUID + "newNoUUID",
                    properties: {
                      rightLabel: rightLabel
                    }
                  }
                };
                let textFieldData = {
                  "ctype": "textField",
                  "uuid": this.componentUUID + "newNoUUID",
                  "value": this.uuid.value[partIndex],
                  "readonly": true,
                  "rightLabel": rightLabel,
                  "name": this.componentUUID + "partNumber"
                }
                this.contextService.addToContext(this.componentUUID + "newNoUUID", textFieldData);
                this.componentService.handleUpdateComponent(enableAccessoryNameAction, null, null, this.utiliyService);

                let removeMissingAccessoryAction = {
                  type: 'updateComponent',
                  config: {
                    key: this.componentUUID + "missingAccessoryUUID",
                    properties: {
                      hidden: true
                    }
                  }
                };
                let missingAccrs = {
                  "ctype": "iconText",
                  "uuid": this.componentUUID + "missingAccessoryUUID",
                  "hidden": true,
                  "name": this.componentUUID + "Missing Accessory ?"
                }
                this.contextService.addToContext(this.componentUUID + "missingAccessoryUUID", missingAccrs);
                this.componentService.handleUpdateComponent(removeMissingAccessoryAction, null, null, this.utiliyService);

                const noOfValidatedInCA = this.contextService.getDataByKey('numOfValidatedFieldsInCA');
                if (!noOfValidatedInCA)
                  this.contextService.addToContext('numOfValidatedFieldsInCA', 1);
                else
                  this.contextService.addToContext('numOfValidatedFieldsInCA', noOfValidatedInCA + 1);

                const index = missingAccessoriesList.indexOf(accessory);
                if (index > -1) {
                  missingAccessoriesList.splice(index, 1);
                }

                this.contextService.addToContext('missingAccessoriesList', missingAccessoriesList);

              }
            });
          }
        }


      }
      if (this.uuid.status === 'INVALID') {
        /// disable the button
        refData.instance.disabled = true;
        refData.instance._changeDetectionRef.detectChanges();
      } else {
        if (this.items[0].recursiveItemDisabled === true) {
          const noOfValidatedInCA = this.contextService.getDataByKey('numOfValidatedFieldsInCA');
          const confAccessArrData = this.contextService.getDataByKey('confirmAccessoriesFlexFieldsData');
          if (confAccessArrData) {
            if (noOfValidatedInCA === confAccessArrData.length) {
              refData.instance.disabled = false;
              refData.instance._changeDetectionRef.detectChanges();
            }
          }

        } /// enable the button only if all groups are valid
        // else if (this.uuid.touched || this.uuid.dirty) {
        //   setTimeout(() => {
        //     const isGroupsValid = this.customeService.checkIfGroupsValid();
        //     if (isGroupsValid) {
        //       /// enable the button
        //       refData.instance.disabled = false;
        //       refData.instance._changeDetectionRef.detectChanges();
        //     } else {
        //       /// enable the button
        //       refData.instance.disabled = true;
        //       refData.instance._changeDetectionRef.detectChanges();
        //     }
        //   }, 300);
        // }
      }
    });

    this.items.forEach(item => {
      item.group = this.uuid;
      item.parentuuid = this.parentuuid;
      item.targetuuid = this.targetuuid;
      if (item.uuid != undefined) {
        if (item.uuid.charAt(0) >= 0) {
          item.uuid = item.uuid.replace(this.parentuuid - 1, this.parentuuid);
          item.id = item.uuid.replace(this.parentuuid - 1, this.parentuuid);
          item.name = item.name.replace(this.parentuuid - 1, this.parentuuid);
        } else {
          if (this.parentuuid !== undefined) {
            item.uuid = this.parentuuid + item.uuid;
            item.id = this.parentuuid + item.uuid;
            item.name = this.componentUUID + item.name;
          }
        }
      }
      if (this.tileActions && this.tileActions !== undefined) {
        this.tileActions.forEach(ele => {
          if (ele.uuid === item.uuid) {
            if (ele.lableText !== undefined) {
              item.text = ele.lableText;
            }
            if (ele.hidden !== undefined) {
              item.visibility = ele.hidden;
            }
          }
        });
      }
      if (this.rowData) {
        if (this.rowData[item.value]) {
          item.defaultValue = this.rowData[item.value];
        }
        if (item.bindLabel) {
          let labelName = this.rowData[item.labelKey];
          if (!labelName)
            item.label = "";
          else
            item.label = this.rowData[item.labelKey];
        }
      }
      if (ScreenMenuObj && ScreenMenuObj.completed) {
        item.disabled = true;
        if (item.ctype == "iconText") {
          item["linkClass"] = "icon-disabled";
        }
      }
      this.componentLoaderService.parseData(item, this.fieldData);
    });
  }

  ngAfterViewInit() {
    if (this.disableFields) {
      this.items.forEach(item => {
        this.disabledFields(item);
        if (item.uuid && item.uuid.includes('PCB_INUUID')) {
          this.updatePlaceholder(item);
        }
      });
    }
  }

  disabledFields(item) {
    // if (item.uuid == "serialNoUUID" || item.uuid == "partNumberUUID" || item.uuid == "conditionUUID") {
    let refData = this.contextService.getDataByKey(item.uuid + 'ref');
    if (item.parentuuid === 0) {
      if (item.uuid.search('serialNoUUID') >= 1) {
        refData.instance.group.controls[item.name].disable();
        refData.instance._changeDetectionRef.detectChanges();
      }
    } else {
      if (item.name != undefined && item.name != 'pcbName') {
        refData.instance.group.controls[item.name].disable();
        refData.instance._changeDetectionRef.detectChanges();
      }
    }
    // }
  }

  updatePlaceholder(item) {
    let text = this.indexData.pcbPartNo;
    // let placeholder = text.split('-')[0] + '-' + text.split('-')[1];
    let action = {
      type: 'updateComponent',
      config: {
        key: item.uuid,
        properties: {
          placeholder: text
        }
      }
    };
    this.componentService.handleUpdateComponent(action, null, null, this.utiliyService);
  }

  enableFocusOnNextField(filterfalse:boolean){
    //enable focus on the next textfeild of Confirm Accessories once filled previous
    if (this.componentUUID == 0 || this.componentUUID > 0) {
      this.componentUUID++;
      let data = this.items.filter(ele => ele.ctype === "textField");
      data = filterfalse ? data.filter(ele => ele.focus === false || undefined):data.filter(ele => ele.focus === undefined);
      let txtcomponentUUID = data[0].uuid
      let parentUUID = data[0].parentuuid
      txtcomponentUUID = this.componentUUID + "newNoUUID",
        data[0].uuid = txtcomponentUUID
      parentUUID = 1;
      data[0].parentuuid = parentUUID;
      if (data.length > 0) {
        let txtfield = this.contextService.getDataByKey(data[0].uuid + "ref")

        if (txtfield == undefined) {
          this.componentUUID--;
        }
        else {
          txtfield.instance.textFieldRef.nativeElement.focus()
          txtfield.instance.textFieldRef.nativeElement.autofocus = true;
          this.componentUUID++
          txtcomponentUUID = this.componentUUID + "newNoUUID",
            parentUUID++
          this.componentUUID--;
          this.componentUUID--;
        }
      }
    }
  }

}