import { Injectable } from '@angular/core';
import { ContextService } from '../contextService/context.service';
import { FormControl, Validators } from '@angular/forms';
import { ComponentLoaderService } from '../component-loader/component-loader.service';
import { HttpClient } from '@angular/common/http';
import { serviceUrls } from '../../../../environments/serviceUrls';
import { ActionService } from '../../action/action.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(
    private contextService: ContextService,
    private componentLoaderService: ComponentLoaderService,
    private http: HttpClient
  ) { }
  handledisplayComponent(action, instance) {
    let refData;
    if (action.config.key !== undefined) {
      refData = this.contextService.getDataByKey(action.config.key + 'ref');
    } else {
      refData = this.contextService.getDataByKey(instance.uuid + 'ref');
    }

    refData.instance.hidden = false;
    refData.instance._changeDetectionRef.detectChanges();
  }
  handleDisableComponent(action, instance) {
    var refData;
    var key;

    if (action.config.incriment == 0) {
      key = instance.parentuuid + action.config.key;
    } else {
      key = action.config.key;
    }

    if (key != undefined) {
      refData = this.contextService.getDataByKey(key + 'ref');
    } else {
      refData = this.contextService.getDataByKey(instance.uuid + 'ref');
    }
    if (action.config.property != undefined) {
      if (action.config.isNotReset !== undefined && action.config.isNotReset) {
      } else {
        refData.instance.group.controls[action.config.property].reset();
      }
      if (refData) {
        refData.instance.group.controls[action.config.property].disable();
        refData.instance.disabled = true;
        refData.instance._changeDetectionRef.detectChanges();
      }

    }
  }
  handleEnabledComponent(action, instance) {
    let refData;
    let key;

    if (action.config.incriment === 0) {
      key = instance.parentuuid + action.config.key;
    } else {
      key = action.config.key;
    }

    if (key !== undefined) {
      refData = this.contextService.getDataByKey(key + 'ref');
    } else {
      refData = this.contextService.getDataByKey(instance.uuid + 'ref');
    }
    if (action.config.property !== undefined && refData && refData.instance && refData.instance.group && refData.instance.group.controls && refData.instance.group.controls[action.config.property]) {
      refData.instance.group.controls[action.config.property].enable();
      refData.instance.disabled = false;
      refData.instance._changeDetectionRef.detectChanges();
    }
  }

  handleUpdateComponent(action, instance, respData, utilityService) {
    let refData;
    let key;
    const properties = {};

    //Added this condition as from Java side ECO json preparation we have added this as Caps (K)
    if (action.config.key == undefined || action.config.key == null) {
      key = action.config.Key;
    } else {
      key = action.config.key;
    }

    if (key !== undefined && key !== null && key.startsWith('#')) {
      key = this.contextService.getDataByString(key);
    }

    if (action.config.incriment !== undefined) {
      key = instance.parentuuid + key;
    }

    if (key !== undefined) {
      refData = this.contextService.getDataByKey(key + 'ref');
    } else {
      refData = this.contextService.getDataByKey(instance.uuid + 'ref');
    }
    // to get data from context.
    let currentTaskStatus = this.contextService.getDataByKey(action.config.key);
    if (currentTaskStatus && currentTaskStatus.header && currentTaskStatus.header.statusClass == "complete-status"
      && action.config.properties && action.config.properties.expanded && currentTaskStatus.isTaskCompleted) {
      //nothing
      action.config.properties = currentTaskStatus;
      let currenttaskpanel = this.contextService.getDataByKey("currentTaskPanelUUID");
      if (currenttaskpanel) {
        let currenttaskpanelref = this.contextService.getDataByKey(currenttaskpanel + "ref");
        if (currenttaskpanelref) {
          if (currenttaskpanelref.instance && currenttaskpanelref.instance.header && currenttaskpanelref.instance.header.statusClass && currenttaskpanelref.instance.header.statusClass != "complete-status") {
            currenttaskpanelref.instance.expanded = true;
          }
          currenttaskpanelref.instance._changeDetectionRef.detectChanges();
        }
      }

    }
    if (action.config.properties !== undefined) {
      const parentRefData = this.contextService.getDataByKey(key + 'ref');
      for (const property in action.config.properties) {
        if (property == "expanded" && action.config.properties[property]) {
          this.contextService.addToContext('currentTaskPanelUUID', key);
          //isOneTaskPanelAtTime use this property to not to achive one taskpanel open at a time
          if (action.config.properties.isOneTaskPanelAtTime == undefined) {
            this.contextService.collapseTaskPanel();
          }
          this.contextService.addToContext('currentTaskPanelPropertiesUUID', action.config.properties);
          this.contextService.addToContext(key, action.config.properties);
        } else if (property == "expanded" && action.config.properties[property] == false) {
          if (action.config.properties && action.config.properties.header && action.config.properties.header.statusClass == "complete-status") {
            if (action.config.properties.hasOwnProperty('isTaskCompleted')) {

            } else {
              action.config.properties["isTaskCompleted"] = true;
            }
            this.contextService.addToContext(key, action.config.properties);
          } else {
            this.contextService.addToContext(key, action.config.properties);
          }
        }
        if (property == "hidden" && action.config.properties[property]) {
          // this.contextService.addToContext('currentTaskPanelUUID', key);
          // this.contextService.addToContext('currentTaskPanelPropertiesUUID', action.config.properties);
          if (action.config.properties.saveProperty) {

          } else {
            this.contextService.addToContext(key, action.config.properties);
          }
        }
        else if (property == "hidden" && action.config.properties[property] == false) {
          if (action.config && action.config.isFromHookobj == undefined) {
            if (action.config.properties.saveProperty) {

            } else {
              this.contextService.addToContext(key, action.config.properties);
            }
          }
        }
        if (typeof action.config.properties[property] === 'string' && action.config.properties[property].startsWith('#')) {
          properties[property] = this.contextService.getDataByString(action.config.properties[property]);
        } else {
          let objectTypeUpdateSource = action.config.properties[property];
          if (action.config.properties[property] !== undefined && action.config.properties[property] !== null) {
            Object.keys(objectTypeUpdateSource).forEach((key) => {
              let objValue = objectTypeUpdateSource[key];
              if (typeof objValue === 'string' && objValue.includes('#')) {
                if (objValue.includes('{')) {
                  let contextValue = objValue.substring(objValue.indexOf("{") + 1, objValue.indexOf("}"));
                  let resultValue = this.contextService.getDataByString(contextValue);
                  objValue = objValue.replace("{" + contextValue + "}", resultValue);
                } else {
                  objValue = this.contextService.getDataByString(objValue);
                }
                objectTypeUpdateSource[key] = objValue;
              }
            });
            //condition used to update the status of controls to ENABLE
            if (property == "disabled" && objectTypeUpdateSource == false && refData &&
              refData != undefined &&
              refData.instance &&
              refData.instance != undefined && refData.instance.name != null && refData.instance.name != undefined && refData.instance.group &&
              refData.instance.group != undefined && refData.instance.group.controls &&
              refData.instance.group.controls != undefined && refData.instance.group.controls[refData.instance.name]) {
              refData.instance.group.controls[refData.instance.name].enable();
            }
            //condition used to update the status of controls to DISABLE
            if (property == "disabled" && objectTypeUpdateSource == true && refData &&
              refData != undefined &&
              refData.instance &&
              refData.instance != undefined && refData.instance.name != null && refData.instance.name != undefined && refData.instance.group &&
              refData.instance.group != undefined && refData.instance.group.controls &&
              refData.instance.group.controls != undefined && refData.instance.group.controls[refData.instance.name]) {
              refData.instance.group.controls[refData.instance.name].disable();
              //actionToggle button diabled base on other Task Panel complete Button // DellAssembly Screen BER or SBU Task Panel
              if (refData.instance.ctype == "actionToggle" || refData.instance.ctype == "actionToggleFQA") {
                let actionFieldprop = {};
                actionFieldprop = {
                  "name": refData.instance.name,
                  "ctype": refData.instance.ctype,
                  "uuid": refData.instance.uuid,
                  "value": refData.instance.group.controls[refData.instance.name].value,
                  "disabled": refData.instance.group.controls[refData.instance.name].disabled
                }
                this.contextService.addToContext(key, actionFieldprop);
              }
            }
            properties[property] = objectTypeUpdateSource;
          }
          properties[property] = objectTypeUpdateSource;
        }
        // if (refData && (refData.instance.ctype === "iconText" || refData.instance.ctype === "button")) {
        //   this.contextService.addToContext(key, action.config.properties);
        // }
      }
    }


    if (
      refData &&
      refData != undefined &&
      refData.instance &&
      refData.instance != undefined
    ) {
      Object.assign(refData.instance, properties);

      if (action.config.updateParent !== undefined && action.config.updateParent) {
        const parentRefData = this.contextService.getDataByKey(refData.instance.parentUUID + 'ref');
        parentRefData.instance._changeDetectionRef.detectChanges();
      }
      if (action.config.fieldProperties != undefined) {
        var fieldProperties = this.contextService.getParsedObject(
          action.config.fieldProperties, utilityService
        );

        if (fieldProperties !== undefined) {
          Object.keys(fieldProperties).forEach((key) => {
            const fieldValue = fieldProperties[key];
            /// check if field value of type array
            if (fieldValue instanceof Array) {
              let responseArray = [];
              if (
                refData.instance.code &&
                refData.instance.code !== undefined
              ) {
                responseArray = responseArray.map((s) => ({
                  code: s[0],
                  displayValue: s[1],
                }));
              } else {
                responseArray = responseArray.map((s) => ({
                  code: s,
                  displayValue: s,
                }));
              }
            }
            if (refData && refData.instance.ctype === "checkbox") {
              refData.instance.checked = fieldValue;
              refData.instance.group.controls[key].setValue(fieldValue);
            }
            if (refData && refData.instance.ctype === "dynamicTaskRender" && action.config.isDynamicUpdate) {
              let componentDeletionArr = [];
              action.config.fieldProperties.previousData.map((item, i) => {
                componentDeletionArr.push({
                  "type": "deleteComponent",
                  "eventSource": "click",
                  "config": {
                    "key": "addpredictionPopupTableUUID" + i
                  }
                })
              })
              let PredictionResponseDate = action.config.fieldProperties.currentData
              componentDeletionArr.forEach((currentAction) => {
                this.handleDeleteComponent(currentAction, instance);
              });
              let actions = {
                "type": "createComponent",
                "config": {
                  "targetId": "dynamicTaskUUID",
                  "containerId": "dynamictask",
                  "data": {
                    "ctype": "dynamicTaskRender",
                    "uuid": "dynamicTaskdataUUID",
                    "config": {
                      "thresholdValue": 0.5,
                      "ctype": "acceptPopUpTaskPanel",
                      "uuid": "addpredictionUUID#@",
                      "tableClass": "mat-elevation-z8 tableSize-Changes yellow-border-left tabStyle",
                      "dropdownClass": "dropdown-select form-select",
                      "checkBoxClass": "check-box-position",
                      "svgIcon": "replace",
                      "index": "#@",
                      "name": "dellPredictivePF"
                    },
                    "data": PredictionResponseDate
                  }
                }
              }
              this.contextService.addToContext("commonClassPredictionData", PredictionResponseDate)
              this.handleCreateComponent(actions, this)
            }
            if (refData && refData.instance.ctype === "tableWithSearchAndSort") {
              let tempData = action.config.fieldProperties.dataSource;
              let data = [];
              tempData !== "" && tempData.map((item) => {
                let obj = {};
                if (refData.instance.displayValues) {
                  item && Object.keys(item).map((key) => {
                    obj[refData.instance.displayValues[key]] = item[key];
                  })
                  data.push(obj);
                } else {
                  data.push(item);
                }
              });
              if (refData.instance.selection) {
                refData.instance.selection = new SelectionModel(true);
                refData.instance.selection.select(...data);
              }
              refData.instance.datasource = data;
              refData.instance.dataForFiltering = data;
              refData.instance.datasource = new MatTableDataSource(data);
            }
            if (refData && refData.instance.ctype === "wikiTableWithSearchAndSort") {
              refData.instance.isApproveIcon.splice(0,refData.instance.isApproveIcon.length)
              refData.instance.isProcessIcon.splice(0,refData.instance.isProcessIcon.length)
              refData.instance.isGlassIcon.splice(0,refData.instance.isGlassIcon.length)
              refData.instance.isCommentIcon.splice(0,refData.instance.isCommentIcon.length)
              refData.instance.isLockIcon.splice(0,refData.instance.isLockIcon.length)
              refData.instance.isRejectIcon.splice(0,refData.instance.isRejectIcon.length)
              let tempData = action.config.fieldProperties.dataSource;
              let data = [];
              tempData !== "" && tempData.map((item) => {
                let obj = {};
                if (refData.instance.displayValues) {
                  item && Object.keys(item).map((key) => {
                    obj[refData.instance.displayValues[key]] = item[key];
                  })
                  data.push(obj);
                } else {
                  data.push(item);
                }
              });
              if (refData.instance.selection) {
                refData.instance.selection = new SelectionModel(true);
                refData.instance.selection.select(...data);
              }
              refData.instance.datasource = data;
              refData.instance.dataForFiltering = data;
              refData.instance.datasource = new MatTableDataSource(data);
            }
            if (refData && refData.instance.ctype === "primaryFaultTableWithCheckBox" ) {
              let tempData = action.config.fieldProperties.datasource;
              let data = [];
              tempData !== "" && tempData.map((item) => {
                let obj = {};
                if(refData.instance.displayValues) {
                  item && Object.keys(item).map((key) => {
                    obj[refData.instance.displayValues[key]] = item[key];
                  })
                  data.push(obj);
                }else {
                  data.push(item);
                }
              });
              if(refData.instance.selection) {
                refData.instance.selection = new SelectionModel(true);
                refData.instance.selection.select(...data);
              }
              refData.instance.datasource = data;
              refData.instance.dataForFiltering = data;
              refData.instance.datasource = new MatTableDataSource(data);
            }
            if (refData && refData.instance.ctype === "radioButtonGroup") {
              let radioButtonOptions = [];
              if (refData.instance.radioButtonOptions !== undefined) {
                for (let i = 0; i < refData.instance.radioButtonOptions.length; i++) {
                  if (refData.instance.radioButtonOptions[i].value === fieldValue) {
                    refData.instance.radioButtonOptions[i].checked = true;
                    refData.instance.group.controls[key].setValue(fieldValue);
                  } else {
                    refData.instance.radioButtonOptions[i].checked = false;
                  }
                  radioButtonOptions.push(refData.instance.radioButtonOptions[i]);
                }
              }
              refData.instance.radioButtonOptions = radioButtonOptions;
              this.contextService.addToContext("radioButtonOptions", radioButtonOptions);
              let name = refData.instance.name;
              if (refData.instance.group.controls[name]) {
                if (fieldValue) {
                  refData.instance.group.controls[name].setValue(fieldValue);
                }
              }
            }
            if (refData.instance.uuid.controls && refData.instance.uuid.controls[key] !== undefined) {
              refData.instance.uuid.controls[key].patchValue(fieldValue);
            }
            else if (refData.instance.group != undefined && refData.instance.group.controls[key] !== undefined) {
              refData.instance.group.controls[key].patchValue(fieldValue);
              // refData.instance._changeDetectionRef.detectChanges();
            }
          });
        }
      }
    }

    if (refData && refData.instance.ctype === "radioButtonGroup") {
      let name = refData.instance.name;
      let radioValue = refData.instance.group.controls[name].value;
      let tempArr = this.contextService.getDataByKey("radioButtonOptions");
      if (radioValue) {
        if (tempArr instanceof Array) {
          tempArr.forEach(ele => {
            if (ele.value == radioValue) {
              ele.checked = true;
            } else {
              ele.checked = false;
            }
          });
        }
      }
      this.contextService.addToContext("radioButtonOptions", tempArr);
    }
    //update method for actionToggle component
    if (refData && refData.instance.ctype === "actionToggle") {
      let radioValue;
      if(action.config && action.config.properties && action.config.properties.selectedVal){
        radioValue = action.config.properties.selectedVal;
      } else {
        radioValue = refData.instance.group.controls[refData.instance.name].value;
      }
      if (radioValue) {
        refData.instance.selectedVal = radioValue;
        refData.instance.group.controls[refData.instance.name].patchValue(radioValue);
      }
    }
    if (refData !== undefined && action.config.clearValidators !== undefined) {
      const fieldProperties = action.config.clearValidators;
      if (fieldProperties !== undefined) {
        Object.keys(fieldProperties).forEach((key) => {
          if (refData.instance.group.controls[key] !== undefined) {
            refData.instance.group.controls[key].clearValidators();
            refData.instance.group.controls[key].updateValueAndValidity();
          }
        });
      }
    }

    if (action.config.setRequiredValidators !== undefined) {
      const fieldProperties = action.config.setRequiredValidators;
      if (fieldProperties !== undefined) {
        Object.keys(fieldProperties).forEach((key) => {
          if (refData.instance.uuid.controls[key] !== undefined) {
            refData.instance.uuid.controls[key].setValidators(
              Validators.required
            );
            refData.instance.uuid.controls[key].updateValueAndValidity();
          }
        });
      }
    }

    if (action.config.setPatternValidators !== undefined) {
      const fieldProperties = action.config.setPatternValidators;
      if (fieldProperties !== undefined) {
        Object.keys(fieldProperties).forEach((key) => {
          if (refData.instance.uuid.controls[key] !== undefined) {
            refData.instance.uuid.controls[key].setValidators([
              Validators.required,
              Validators.pattern(fieldProperties[key]),
            ]);
            refData.instance.uuid.controls[key].updateValueAndValidity();
          }
        });
      }
    }

    if (action.config.disableForm !== undefined) {
      if (action.config.disableForm) {
        refData.instance.uuid.disable();
      } else {
        refData.instance.uuid.enable();
      }
    }

    if (action.config.dropDownProperties !== undefined) {
      let dropDownProperties = action.config.dropDownProperties;
      let inputDropdownDisplayValue;
      let inputDropdownCode;
      let inputDropdownDisplayConcatValue;
      let inputDropdownConcatCharacter;
      dropDownProperties = this.contextService.getParsedObject(
        dropDownProperties, utilityService
      );
      if (dropDownProperties !== undefined) {
        Object.keys(dropDownProperties).forEach((key) => {
          if (key === "isMultiSelect") {
            refData.instance.toppingList = refData.instance.options;
          } else {
            const dropDownInstance = refData && refData.instance;

            /// if we are getting displayValue and code from config, use that
            if (action.config.displayValue !== undefined) {
              inputDropdownDisplayValue = action.config.displayValue;
              inputDropdownCode = action.config.code;
              if (action.config.concat == true) {
                inputDropdownDisplayConcatValue = action.config.displayConcatValue;
              }
            } else {
              inputDropdownDisplayValue = dropDownInstance && dropDownInstance.displayValue;
              inputDropdownCode = dropDownInstance && dropDownInstance.code;
              if (action.config.concat === true) {
                if(action.config.displayConcatValue){
                  inputDropdownDisplayConcatValue = action.config.displayConcatValue;
                } else {
                  inputDropdownDisplayConcatValue = dropDownInstance && dropDownInstance.displayConcatValue;
                }
                if(action.config.concatCharacter){
                  inputDropdownConcatCharacter = action.config.concatCharacter;
                } else {
                  inputDropdownConcatCharacter = "-";
                }
              }
            }
            let fieldValue = dropDownProperties[key];
            if (dropDownProperties[key] !== undefined) {
              if (dropDownInstance !== undefined && dropDownInstance) {
                if (
                  inputDropdownCode &&
                  inputDropdownCode !== undefined
                ) {
                  if (fieldValue !== undefined && fieldValue !== "") {
                    if (action.config.concat === true) {
                      fieldValue = fieldValue.map((s) => ({
                        code: s[inputDropdownCode],
                        displayValue: s[inputDropdownDisplayValue].concat(inputDropdownConcatCharacter + s[inputDropdownDisplayConcatValue])
                      }));
                    } else {
                      fieldValue = fieldValue.map((s) => ({
                        code: s[inputDropdownCode],
                        displayValue: s[inputDropdownDisplayValue],
                      }));
                    }
                  }
                }
                else {
                  if (fieldValue !== undefined && fieldValue !== "") {
                    fieldValue = fieldValue.map((s) => ({
                      code: s,
                      displayValue: s,
                    }));
                  }
                }

                if (!dropDownInstance.isDropdownNotSelected) {
                  if (!action.config.disableSort) {
                    if (fieldValue !== undefined && fieldValue !== "") {
                      fieldValue && fieldValue.length && fieldValue.sort((a, b) =>
                        a?.displayValue?.localeCompare(b?.displayValue)
                      );
                    }
                  }
                }
                if (dropDownInstance.selectDisabled !== undefined && dropDownInstance.selectDisabled !== true) {
                  fieldValue.unshift({
                    code: "",
                    displayValue: "-Select-",
                  })
                }
                if (action.config.isAutoComplete !== undefined) {
                  fieldValue = fieldValue && fieldValue.map((r) => r.displayValue);
                }

                refData.instance.options = fieldValue;
                // refData.instance.group.controls[refData.instance.name].setValue(
                //   null
                // );
              }
            }
          }
        });


      }
    }

    if (action.config.isDropDownWithSearch !== undefined && action.config.isDropDownWithSearch) {
      let defaultValue = action.config.properties.defaultValue;
      if (defaultValue !== undefined && defaultValue.startsWith('#')) {
        defaultValue = this.contextService.getDataByString(defaultValue);
      }
      refData.instance.group.controls[action.config.name].setValue(
        defaultValue
      );
    }




    if (refData && refData.instance._changeDetectionRef !== undefined) {
      if (action.config.isTaskPanel !== undefined && action.config.isTaskPanel) {
        refData.instance.matPanel.close();
      }
    }

    if (refData && refData.instance._changeDetectionRef !== undefined) {
      try {
        if (action.isFromHook == undefined || action.isFromHook == null) {
          refData.instance._changeDetectionRef.detectChanges();
        }
      } catch (e) {
        // console.log("Component Change Detection Failed:" + refData.instance.uuid + " Because of Hidden Property Configurations");
      }
    }

    if (action.config.properties) {

      if (refData && action.config.properties.isReset) {
        refData.instance.group.controls[action.config.properties.name].setValue(null);

        /// Only for dropdown with multi select component
        if (refData.instance.ctype === "dropdownWithMultiSelect") {
          refData.instance.toppingsControl.reset();
          refData.instance.searchTextboxControl.reset();
        }
      }

      if (action.config.properties.expanded) {
        setTimeout(() => {
          if (action.config.properties.expanded && refData && refData.instance && (refData.instance.items !== undefined)) {
            let textFieldItem = refData.instance.items.find((x) => x.ctype === 'textField');
            if (textFieldItem && textFieldItem !== undefined) {
              if (textFieldItem.filter) {
                textFieldItem = textFieldItem.filter(ele => ele.focus === undefined)
              }
            }
            if (textFieldItem && textFieldItem !== undefined && textFieldItem.focus == undefined) {
              let textFieldItemRefData = this.contextService.getDataByKey(textFieldItem.uuid + 'ref');
              textFieldItemRefData.instance.textFieldRef.nativeElement.focus();
              textFieldItemRefData.instance.textFieldRef.nativeElement.autofocus = true;
              textFieldItemRefData.instance._changeDetectionRef.detectChanges();
            }
          }
        }, 500)
      }
    }

    if (action.config.methodCall !== undefined) {

      if (action.config.methodCall && refData.instance[action.config.methodCall]) {
        let ShippingRecording = null;
        if (action.config.shippingVideoRecording != undefined && action.config.shippingVideoRecording) {
          ShippingRecording = action.config.shippingVideoRecording
        }
        refData.instance[action.config.methodCall](ShippingRecording);
      }
    }
    //scrolling the screen whenever the errortitle occured
    if (Object.keys(properties) &&
      Object.keys(properties).length &&
      Object.keys(properties).includes("isShown") && properties["isShown"] &&
      action.config.key == "errorTitleUUID") {
      if (refData &&
        refData != undefined && refData.instance &&
        refData.instance != undefined && refData.instance.oElementRef != undefined) {
        refData.instance.oElementRef.nativeElement.scrollIntoView();
      }
    }
  }


  handleCreateComponent(action, instance) {
    let viewContainerRef;
    if (action.config.data.uniqueUUID !== undefined && action.config.data.uniqueUUID) {
      action.config.data.uuid = action.config.data.uuid + Math.floor(Math.random() * (999 - 100 + 1) + 100);
      this.contextService.addToContext('createdComponentUUID', action.config.data.uuid);
      if (action.config.data.dellReceiving !== undefined && action.config.data.dellReceiving) {
        const flexarray: any[] = this.contextService.getDataByString(
          action.config.data.source);
        for (var i = 0, len = flexarray.length; i < len; i++) {
          if (flexarray[i].Value == 'NONEVALUE' && flexarray[i].identifier != undefined &&
            flexarray[i].identifier == "") {
            flexarray[i].identifier = action.config.data.uuid;
            flexarray[i].Value = "";
            flexarray[i - 1].accessoryIdentifier = action.config.data.uuid
            break;
          }
        }
      }
    }
    if (action.config.data.updateUUID !== undefined && action.config.data.updateUUID) {
      let config: any = action.config;
      //@obj -> string convertion
      config = JSON.stringify(config);
      config = config.replace(/#@/g, (action.config.data.uuid));
      config = JSON.parse(config);
      action.config = config;

      /// Adding unique ids for all the uuids and
      /// updateComponent actions in hooks and actions
      // if (action.config.data.items !== undefined && action.config.data.items.length > 0) {
      //   this.changeUUIDOfComponent(action.config.data.items, action.config.data.uuid);
      // }
      // if (action.config.data.footer !== undefined && action.config.data.footer.length > 0) {
      //   this.changeUUIDOfComponent(action.config.data.footer, action.config.data.uuid);
      // }
    }
    const refData = this.contextService.getDataByKey(
      action.config.targetId + 'ref'
    );
    const isComponentThere = this.contextService.getDataByKey(
      action.config.data.uuid + 'ref'
    );

    if (action.config.containerId !== undefined) {
      viewContainerRef = refData.instance[action.config.containerId];
    } else {
      viewContainerRef = refData.instance.expansionpanelcontent;
    }
    if (isComponentThere === undefined) {
      if (action.config.index !== undefined) {
        let index = action.config.index;
        if (typeof index === 'string' && index.startsWith('#')) {
          index = this.contextService.getDataByString(index);
        }
        /// index must be a positive integer
        if (index && index !== undefined && Number.isInteger(index)) {
          this.componentLoaderService.parseData(action.config.data, viewContainerRef, index);
        } else {
          this.componentLoaderService.parseData(action.config.data, viewContainerRef);
        }
        let comp = this.contextService.getDataByKey(action.config.data.uuid + 'ref');
        if (comp != undefined && comp.changeDetectorRef != undefined) {
          comp.changeDetectorRef.detectChanges();
        }
      } else {
        this.componentLoaderService.parseData(action.config.data, viewContainerRef);
        if (refData.instance._changeDetectionRef !== undefined) {
          refData.instance._changeDetectionRef.detectChanges();
        }
      }
    }
  }

  handleDeleteComponent(action, instance) {
    let onlyKeydelete = false;

    if(action.config != undefined && action.config.onlyKeydelete){
      onlyKeydelete = action.config.onlyKeydelete;
    }

    //Below condition is restricting current instance task panel removal if only specified key uuid
    //needs to be deleted.
    if(!onlyKeydelete){
      if (instance && instance.parentuuid !== undefined) {
        const refData = this.contextService.getDataByKey(instance.parentuuid + 'ref');
        if (refData !== undefined) {
          refData.destroy();
        }
        this.contextService.deleteDataByKey(instance.parentuuid + 'ref');
      }
    }

    if (action.config !== undefined && action.config.source !== undefined) {
      var flexarray: any[] = this.contextService.getDataByString(
        action.config.source
      );
      if (instance.dellReceiving != undefined && instance.dellReceiving) {
        this.deleteDellReceivingobjKey(flexarray, instance);
        this.contextService.addToContext(action.config.accessorydata, "");
      } else {
        this.deleteobjKey(flexarray, instance);
      }
    }

    if (action.config !== undefined && action.config.key !== undefined && action.config.key) {
      if (action.config.key.startsWith('#')) {
        action.config.key = this.contextService.getDataByString(action.config.key);
      }
      const refData = this.contextService.getDataByKey(action.config.key + 'ref');
      if (refData !== undefined) {
        refData.destroy();
        this.contextService.deleteDataByKey(action.config.key + 'ref');
      }
    }
  }
  deleteDellReceivingobjKey(flexarray, instance) {
    let keys = ["identifier", "accessoryIdentifier"];

    flexarray.forEach(objectData => {
      if (objectData[keys[0]] && objectData[keys[0]] == instance.parentuuid) {
        objectData.Value = 'NONEVALUE';
        objectData.identifier = '';
      } else if (objectData[keys[1]] && objectData[keys[1]] == instance.parentuuid) {
        objectData.Value = 'NONE';
        objectData.accessoryIdentifier = '';
      }
    });
    let validAccessories = flexarray.filter((x) => x.Value !== "NONE" && x.Value !== "NONEVALUE");
    let inValidAccessories = flexarray.filter((x) => x.Value == "NONE" || x.Value == "NONEVALUE");
    let newAccessoryData = JSON.parse(JSON.stringify(flexarray));;
    newAccessoryData.forEach((objectData, index) => {
      if (validAccessories[index]) {
        if (validAccessories[index].hasOwnProperty('accessoryIdentifier')) {
          objectData.Value = validAccessories[index].Value;
          objectData.accessoryIdentifier = validAccessories[index].accessoryIdentifier;
        } else {
          objectData.Value = validAccessories[index].Value;
          objectData.identifier = validAccessories[index].identifier;
        }
      } else {
        if (objectData.hasOwnProperty('accessoryIdentifier')) {
          objectData.Value = "NONE";
          objectData.accessoryIdentifier = "";
        } else {
          objectData.Value = "NONEVALUE";
          objectData.identifier = "";
        }
      }
    });
    this.contextService.addToContext('Accessories', newAccessoryData);

  }

  deleteobjKey(flexarray, instance) {
    var indicator = instance.indicator;
    for (var i = 0, len = flexarray.length; i < len; i++) {
      if (indicator != null && indicator != undefined && indicator != '') {
        if (flexarray[i].Value == indicator || flexarray[i].Name == indicator) {
          flexarray[i].Value = 'NONE';
          break;
        }
      }
    }
    // console.log('accessories', flexarray);
  }
  performToggel(action, instance, actionService) {
    let currentWC = this.contextService.getDataByKey('currentWC');
    let discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
    let isHpDebug = false;
    if (discrepancyUnitInfo && discrepancyUnitInfo.CLIENTNAME === "HP" && currentWC === "DEBUG") {
      isHpDebug = true;
    }
    if (action.actionType) {
      let name = this.contextService.getDataByKey(action.name);
      if (name) {
        if (action.actionType == "close") {
          name.instance.rightsidenav.close()
        } else {
          name.instance.rightsidenav.open()
        }
      }
    }
    else {
      if (action.name === undefined) {
        instance.rightsidenav.toggle();
      } else {
        let name = this.contextService.getDataByKey(action.name);
        if (name) {
          name.instance.rightsidenav.toggle();
        }
      }
    }
  }
  handleUpdateStage(action, instance) {
    // to mark current stage as completed and next stage as active.
    let subprocessMenuData: any[] = [];
    if (action.config.processId.startsWith('#')) {
      subprocessMenuData = this.contextService.getDataByString(
        action.config.processId
      );
    }
    if (subprocessMenuData && subprocessMenuData.length > 0) {
      subprocessMenuData.forEach((parent) => {
        if (
          parent.name.toLowerCase() ===
          action.config.currentSubProcess.toLowerCase()
        ) {
          parent.children.forEach((child) => {
            if (
              child.name.toLowerCase() ===
              action.config.currentStage.toLowerCase()
            ) {
              child['isCompleted'] = true;
            }
            if (
              child.name.toLowerCase() === action.config.nextStage.toLowerCase()
            ) {
              child.isActive = true;
              child['isCompleted'] = false;
            } else {
              child.isActive = false;
            }
          });
        }
      });
    }

    // for performing change detection on menu tree.
    const refData = this.contextService.getDataByKey(
      action.config.targetId + 'ref'
    );
    if (refData != undefined) {
      refData.instance.dataSource.data = subprocessMenuData;
      refData.instance._changeDetectionRef.detectChanges();
    }
  }

  //Below action will update work instruction data for passed ID.
  handleWorkInstructionData(action, instance, utilityService) {
    let wiInfo = this.contextService.getDataByString("#getProcess.workInstructionInfo");
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
                    if (screenName == "HPReceiving") {
                      paramlist["firstSource"] = "CONFIRM";
                    }
                  }
                }
              }
            }

            if (paramlist) {
              let paramList = this.contextService.getParsedObject(paramlist, utilityService);
              this.getWorkInstructions(paramList, utilityService);
            }
          }
        }
      }
    }
  }

  getWorkInstructions(params, utilityService) {
    let data: any = [];
    let url = serviceUrls['getWorkInstructions'] + "?";
    for (const param in params) {
      url = url.concat(`${param}`, "=", params[param], "&");
    }
    url = url.substring(0, url.length - 1);
    this.http.get(url).subscribe(res => {
      data = res;
      this.contextService.addToContext("workInstructions", data.data);
      let workInstructionsUpdateAction = {
        type: 'updateComponent',
        "config": {
          "key": "workinstructionUUID",
          "properties": {
            "titleValue": "#workInstructions"
          }
        }
      };
      this.handleUpdateComponent(workInstructionsUpdateAction, null, null, utilityService);
    });
  }

  isCurrentComponentSelected(action, instance){
    let isComponentSelected = this.contextService.getDataByKey(instance.uuid + 'selected');
    if(isComponentSelected) {
       this.contextService.addToContext('currentComponentSelected', true);
    } else {
      this.contextService.addToContext('currentComponentSelected', false);
    }
  }

}
