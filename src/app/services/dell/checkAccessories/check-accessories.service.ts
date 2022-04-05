import { Injectable } from '@angular/core';
import { CHECK_ACC_PANEL_CONTAINERS } from '../../../utilities/constants';
import { UtilityService } from '../../../utilities/utility.service';
import { ContextService } from '../../commonServices/contextService/context.service';
import { ComponentService } from '../../commonServices/componentService/component.service';

@Injectable({
  providedIn: 'root'
})
export class CheckAccessoriesService {

  constructor(
    private contextService: ContextService,
    private utilityService: UtilityService,
    private componentService: ComponentService
  ) { }

  handleCheckAccActions(action: any, instance: any, actionService: any) {
    switch (action.methodType) {
      case 'handleCheckAccessoriesPanel':
        this.handleCheckAccessoriesPanel(action, instance, actionService)
        break;
      case 'checkIfValidAccessory':
        this.checkIfValidAccessory(action, instance, actionService)
        break;
      case 'handleCheckAccCompleteButton':
        this.handleCheckAccCompleteButton(action, instance, actionService)
        break;
      case 'checkForIssuedParts':
        this.checkForIssuedParts(action, instance, actionService)
        break;
      case 'resetCheckAccPanelData':
        this.resetCheckAccPanelData(action, instance, actionService)
        break;
      case 'handleDellpackoutCheckAccCompleteButton':
        this.handleDellpackoutCheckAccCompleteButton(action, instance, actionService)
        break;

      default:
        //statements; 
        break;
    }
  }

  executeActions(actions, instance, actionService) {
    actions.forEach((currentAction) => {
      actionService.handleAction(currentAction, instance);
    });
  }

  /// This will check for check accessories panel and based on the condition
  /// It will show and hide the panel
  handleCheckAccessoriesPanel(action: any, instance: any, actionService: any) {
    let checkAccFFData = this.contextService.getDataByKey(action.config.checkAccData);
    checkAccFFData = checkAccFFData ? checkAccFFData : [];
    let unitInfo = this.contextService.getDataByKey('repairUnitInfo');
    let issuedPartsData = action.config.issuedPartsData;
    let getTaskCompleteBtnStatus = this.getcompleteTaskButtonStatus(action, checkAccFFData)
    let headerStatus = getTaskCompleteBtnStatus["taskpanleStatus"]?.header;
    let currentStatusTaskP = getTaskCompleteBtnStatus["taskpanleStatus"];
    let actions = [
      {
        "type": "createComponent",
        "config": {
          "targetId": "pageUUID",
          "containerId": CHECK_ACC_PANEL_CONTAINERS[unitInfo.WORKCENTER],
          "data": {
            "ctype": "taskPanel",
            "title": "",            
            "disabled": currentStatusTaskP == undefined ? action.config.disabled :currentStatusTaskP.disabled,
            "header": {
              "title": "Check Accessories",
              "icon": "description",
              "iconClass": headerStatus == undefined ? "active-header" :currentStatusTaskP.header.iconClass,
              "svgIcon": "description_icon",
              "statusIcon": headerStatus == undefined ? "hourglass_empty" :currentStatusTaskP.header.statusIcon,
              "statusClass": headerStatus == undefined ? "incomplete-status" :currentStatusTaskP.header.statusClass,
            },
            "expanded": currentStatusTaskP == undefined ? action.config.expanded :currentStatusTaskP.expanded,
            "hideToggle": true,
            "isEditable": true,
            "isMandatory": true,
            "intialTaskpanel": true,
            "uuid": action.config.taskPanelUUID,
            "visibility": true,
            "hidden": false,
            "hooks": [
              {
                "type": "multipleCondition",
                "hookType": "afterInit",
                "config": {
                  "multi": true,
                  "operator": "AND",
                  "conditions": [
                    {
                      "operation": "isEqualTo",
                      "lhs": action.config.expanded,
                      "rhs": true
                    },
                    {
                      "operation": "isValid",
                      "lhs": checkAccFFData
                    }
                  ]
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "setFocus",
                        "config": {
                          "targetId": action.config.textFieldUUID + "0"
                        }
                      }
                    ]
                  },
                  "onFailure": {
                    "actions": []
                  }
                }
              }
            ],
            "validations": [],
            "actions": [],
            "items": this.getAccessories(action, checkAccFFData, issuedPartsData),
            "footer": [
              {
                "ctype": "iconbutton",
                "text": "Reset Form",
                "name": action.config.resetUUID + "Name",
                "uuid": action.config.resetUUID,
                "visibility": true,
                "checkGroupValidity": false,
                "disabled": checkAccFFData.length > 0 ? false : true,
                "hidden": checkAccFFData.length > 0 ? false : true,
                "hooks": [],
                "validations": [],
                "icon": "not_interested",
                "iconClass": "resetIcon",
                "actions": [
                  {
                    "eventSource": "click",
                    "type": "handleCheckAccActions",
                    "methodType": "resetCheckAccPanelData",
                    "config": {
                      "checkAccFFData": checkAccFFData,
                      "textFieldUUID": action.config.textFieldUUID,
                      "taskPanelUUID": action.config.taskPanelUUID,
                      "accessoryNameUUID": action.config.accessoryNameUUID,
                      "resultCodeUUID": action.config.resultCodeUUID,
                      "timeOutUUID": action.config.timeOutUUID,
                      "errorTitleUUID": action.config.errorTitleUUID,
                    }
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": action.config.completeUUID,
                      "properties": {
                        "disabled": true
                      }
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "disableComponent",
                    "config": {
                      "key": action.config.resultCodeUUID,
                      "property": "ResultCodes",
                      "isNotReset": false
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": action.config.timeOutUUID,
                      "properties": {
                        "disabled": true
                      }
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": action.config.taskPanelUUID,
                      "properties": {
                        "disabled": false,
                        "hidden": false,
                        "header": {
                          "title": "Check Accessories",
                          "icon": "description",
                          "statusIcon": "hourglass_empty",
                          "statusClass": "incomplete-status",
                          "svgIcon": "description_icon",
                          "iconClass": "active-header"
                        }
                      }
                    },
                    "eventSource": "click"
                  }
                ]
              },
              {
                "ctype": "button",
                "color": "primary",
                "text": "Complete",
                "uuid": action.config.completeUUID,
                "name": action.config.completeUUID + "Name",
                "class": "primary-btn",
                "visibility": true,
                "hidden": false,
                "isDisableNotReq": true,
                "disabled": getTaskCompleteBtnStatus["buttonStatus"],
                "type": "submit",
                "hooks": [],
                "validations": [],
                "actions": [
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "checkAccdataPackout",
                      "data": "formData"
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "isCompleteButClicked",
                      "data": true
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": action.config.taskPanelUUID,
                      "properties": {
                        "expanded": false,
                        "disabled": false,
                        "header": {
                          "title": "Check Accessories",
                          "icon": "description",
                          "statusIcon": "check_circle",
                          "statusClass": "complete-status",
                          "svgIcon": "description_icon",
                          "class": "complete-task ",
                          "iconClass": "complete-task"
                        }
                      }
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": action.config.completeUUID,
                      "properties": {
                        "disabled": true
                      }
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": action.config.nextTaskPanelUUID,
                      "properties": {
                        "expanded": true,
                        "disabled": false,
                        "header": {
                          "title": action.config.nextTaskPanelTitle,
                          "svgIcon": "description_icon",
                          "iconClass": "active-header",
                          "class": "greyish-black",
                          "statusIcon": "hourglass_empty",
                          "statusClass": "incomplete-status"
                        }
                      }
                    },
                    "eventSource": "click"
                  },
                  // {
                  //   "type": "multipleCondition",
                  //   "eventSource": "click",
                  //   "config": {
                  //       "multi": true,
                  //       "operator": "AND",
                  //       "conditions": [
                  //           {
                  //               "operation": "isEqualTo",
                  //               "lhs": "#userSelectedLocation",
                  //               "rhs": 1244
                  //           },
                  //           {
                  //               "operation": "isEqualTo",
                  //               "lhs": "#repairUnitInfo.WORKCENTER",
                  //               "rhs": "DELL_AIO_VALIDATION"
                  //           }
                  //       ]
                  //   },                      
                  //   "responseDependents": {
                  //       "onSuccess": {
                  //           "actions": [
                  //             {
                  //               "type": "updateComponent",
                  //               "config": {
                  //                   "key": "dellValidationTestResultPanelUUID",
                  //                   "properties": {
                  //                       "expanded": true,
                  //                       "disabled": false,
                  //                       "header": {
                  //                         "title": "Test Results",
                  //                         "svgIcon": "description_icon",
                  //                         "iconClass": "active-header",
                  //                         "statusIcon": "hourglass_empty",
                  //                         "statusClass": "incomplete-status"
                  //                     },
                  //                   }
                  //               },
                  //               "eventSource": "click"
                  //           },
                  //         ]
                  //       },
                  //       "onFailure": {
                  //           "actions": [
                  //             {
                  //               "type": "enableComponent",
                  //               "config": {
                  //                 "key": action.config.resultCodeUUID,
                  //                 "property": "ResultCodes"
                  //               },
                  //               "eventSource": "click"
                  //             }
                  //           ]
                  //       }
                  //   }
                  // }
                ]
              }
            ]
          }
        },
        "eventSource": "click"
      }
    ];

    this.executeActions(actions, instance, actionService);
  }
  getcompleteTaskButtonStatus(action, checkAccFFData: any){
    let completeInfo = {};
    let buttonStatus; 
    let taskpanleStatus= this.contextService.getDataByKey(action.config.taskPanelUUID);
    let buttoninfo = this.contextService.getDataByKey(action.config.completeUUID);
    if(buttoninfo == undefined){
      buttonStatus = (checkAccFFData.length > 0 ? true : false)
    }else{
      buttonStatus = buttoninfo.disabled;
    }
    if(taskpanleStatus?.isTaskCompleted !== undefined){      
      taskpanleStatus.expanded = (buttonStatus==false) ? true : taskpanleStatus.expanded;
      completeInfo["taskpanleStatus"]= taskpanleStatus;      
      completeInfo["buttonStatus"]= buttonStatus;      
    }else{
      completeInfo["taskpanleStatus"]= taskpanleStatus;
      completeInfo["buttonStatus"]= buttonStatus;
    }
    return completeInfo
  }

  /// Generates the items for checck accessory panel
  getAccessories(action, checkAccFFData: any, issuedPartsData) {
    let filteredData = [];
    let items = [];
    let flexFieldValueListArr = [];
    let accesoryflexfeildsItems = [];
    let compList = [];
    if (checkAccFFData && checkAccFFData.length > 0) {
      compList.push({
        "ctype": "title",
        "uuid": action.config.accessoryNameUUID,
        "titleClass": "font-bold packoutFlexTittleclas",
        "title": "Accessory QR Code",
        "hidden": false,
        "titleValue": ""
      });
      compList.push({
        "ctype": "title",
        "uuid": action.config.accessoryNameUUID,
        "titleClass": "font-bold packoutFlexTittleclas set-margin-oba",
        "title": "Accessory Type",
        "hidden": false,
        "titleValue": ""
      });

      let flexFieldComponent = {
        "ctype": "flexFields",
        "uuid": "checkAccFFHeaderUUID",
        "flexClass": "oba-check-accessories",
        "items": compList
      };
      items.push(flexFieldComponent);
    } else {
      let noAccessory = {
        "ctype": "title",
        "uuid": "NoAccUUID",
        "title": "No accessory received to validate.",
        "titleClass": "body2",
        "hidden": false,
        "titleValue": ""
      }
      items.push(noAccessory);
    }
    if (checkAccFFData) {
      let halfLength = checkAccFFData.length / 2;
      if (halfLength) {
        for (let i = 1; i <= halfLength; i++) {
          filteredData.push(this.utilityService.getValue(i, checkAccFFData));
        }

        for(let i =0; i< filteredData.length; i++){
          let obj = {};
          let obj1 = {};
          obj["id"] = filteredData[i].PPID_Comments;
          obj["value"] = filteredData[i].HASHCODE;
          obj1["id"] = filteredData[i].HASHCODE;
          obj1["value"] = filteredData[i].HASHCODE;
          accesoryflexfeildsItems.push(obj);
          flexFieldValueListArr.push(obj1);
        }

        filteredData && filteredData.map((item, index) => {  
          items.push({
            "ctype": "textField",
            "readonly": false,
            "uuid": action.config.textFieldUUID + index,
            "hooks": [
             
              {
                "type": "condition",
                "hookType": "afterInit",
                "config": {
                  "operation": "isValid",
                  "lhs": "#enteredHashCode"+action.config.accessoryNameUUID+index
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "eventSource": "input",
                        "type": "handleCheckAccActions",
                        "methodType": "checkIfValidAccessory",
                        "config": {
                          "count": halfLength,
                          "item": item,
                          "index": index,
                          "filteredData": filteredData,
                          "taskPanelUUID": action.config.taskPanelUUID,
                          "textFieldUUID": action.config.textFieldUUID,
                          "accessoryNameUUID": action.config.accessoryNameUUID,
                          "resultCodeUUID": action.config.resultCodeUUID,
                          "timeOutUUID": action.config.timeOutUUID,
                          "completeUUID": action.config.completeUUID,
                          "resetUUID": action.config.resetUUID,
                          "errorTitleUUID": action.config.errorTitleUUID,
                          "rightLabel": filteredData[index].FF_VALUE
                        }
                      }
                    ]
                  },
                  "onFailure": {
                    "actions": []
                  }
                }
              },
              {
                "type": "condition",
                "hookType": "afterInit",
                "config": {
                  "operation": "isValid",
                  "lhs": "#isCompleteButClicked"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": action.config.completeUUID,
                          "properties": {
                            "disabled": true
                          }
                        }
                      },
                      {
                        "type": "EditFuncDrawbackSol",
                        "config":{
                          "resultcodeUUID": action.config.resultCodeUUID,
                          "timeoutUUID": action.config.timeOutUUID
                        }
                      },
                    ]
                  },
                  "onFailure": {
                    "actions": []
                  }
                }
              }
            ],
            "validations": [],
            "isAccessoryFlexFiled": true,
            "type": "text",
            "placeholder": "QR Code",
            "hidden": false,
            "focus": index === 0 ? true : false,
            "disabled": false,
            "formGroupClass": "check-acc-flex-container context-textField",
            "textfieldClass": "width-200 body2",
            "name": "partNumber" + index,
            "label": "",
            "rightLabel":"",
            "rightLabelClass": "body2 check-acc-right-label bold-font",
            "disableCompleteButtonEnterActions": true,
            "actions": [
              {
                "type": "updateComponent",
                "eventSource": "input",
                "config": {
                  "key": action.config.errorTitleUUID,
                  "properties": {
                    "titleValue": "",
                    "isShown": true
                  }
                }
              },
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "isCompleteButClicked",
                  "data": false
                },
                "eventSource": "input",
              },
              {
                "eventSource": "input",
                "type": "handleCheckAccActions",
                "methodType": "checkIfValidAccessory",
                "config": {
                  "count": halfLength,
                  "item": item,
                  "index": index,
                  "filteredData": filteredData,
                  "taskPanelUUID": action.config.taskPanelUUID,
                  "textFieldUUID": action.config.textFieldUUID,
                  "accessoryNameUUID": action.config.accessoryNameUUID,
                  "resultCodeUUID": action.config.resultCodeUUID,
                  "timeOutUUID": action.config.timeOutUUID,
                  "completeUUID": action.config.completeUUID,
                  "resetUUID": action.config.resetUUID,
                  "errorTitleUUID": action.config.errorTitleUUID,
                  "rightLabel": filteredData[index].FF_VALUE
                }
              }
            ]
          });

        });
      }
    }

    issuedPartsData && issuedPartsData.map((issuedItem) => {
      let obj = {};
      obj["HASHCODE"] = issuedItem;
      obj["FF_VALUE"] = "Ac Adaptor";
      filteredData.push(obj)
    })

    this.contextService.addToContext("checkAccflexfeildsItems", accesoryflexfeildsItems);
    this.contextService.addToContext("checkAccFFdValueListArr", flexFieldValueListArr);

    return items;
  }

  /// Checks whether the entered accessory is valid or not and 
  /// Enables the complete button based if all the accessories are
  /// Filled
  checkIfValidAccessory(action: any, instance: any, actionService: any) {
    this.dellCheckAccessoriesEditFunctionality(action);
    let index = action.config.index;
    let currentTextFieldRef = this.contextService.getDataByKey(action.config.textFieldUUID + index + "ref");
    let enteredHashCode = "";
    if (currentTextFieldRef && currentTextFieldRef.instance.group) {
      enteredHashCode = currentTextFieldRef.instance.group.controls[currentTextFieldRef.instance.name].value;
    }
    enteredHashCode = enteredHashCode ? enteredHashCode : "";
    this.contextService.addToContext("enteredHashCode" + action.config.accessoryNameUUID + index, enteredHashCode);
    // this.contextService.addToContext("enteredrightLable" + index, action.config.item['FF_VALUE'] );
    let accesTypeData = {
      "ctype": "textField",
      "uuid":  action.config.textFieldUUID+index,
      "value": currentTextFieldRef.instance.group.controls[currentTextFieldRef.instance.name].value,
      "name":  currentTextFieldRef.instance.name,
      "hii":"hello",
      "disabled": false
    }                
    this.contextService.addToContext(action.config.textFieldUUID + index, accesTypeData);
    let count = action.config.count;
    let item = action.config.item;
    let filteredData = action.config.filteredData;
    let isMatched = false;
    let isValueRepeated = false;
    let actions = [];
    if (enteredHashCode && enteredHashCode != "") {
      for (let i = 0; i < count; i++) {
        let textBoxRef = this.contextService.getDataByKey(action.config.textFieldUUID + i + "ref");
        let textBoxValue = "";
        if (textBoxRef && textBoxRef.instance.group) {
          textBoxValue = textBoxRef.instance.group.controls[textBoxRef.instance.name].value;
        }
        if (index != i && textBoxValue && enteredHashCode.toLowerCase() === textBoxValue.toLowerCase()) {
          isValueRepeated = true;
        }
      }
      !isValueRepeated && filteredData && filteredData.map((currentItem) => {
        if (currentItem["HASHCODE"].toLowerCase() === enteredHashCode.toLowerCase()) {
          isMatched = true;
          if (index < count) {
            actions.push(
              {
                "type": "setFocus",
                "config": {
                  "targetId": action.config.textFieldUUID + (index + 1)
                }
              }
            );
          }
          actions.push(
            {
              "type": "updateComponent",
              "config": {
                "key": action.config.textFieldUUID + index,
                "properties": {
                  "rightLabel": currentItem["FF_VALUE"]
                }
              }
            }
          )
        }
      });

      if (!isMatched || isValueRepeated) {
        actions.push({
          "type": "updateComponent",
          "config": {
            "key": action.config.errorTitleUUID,
            "properties": {
              "titleValue": "Accessory Doesn't Match",
              "isShown": true
            }
          }
        });
        actions.push({
          "type": "updateComponent",
          "config": {
            "key": action.config.textFieldUUID + index,
            "properties": {
              "rightLabel": ""
            }
          }
        });
        instance.group.controls[instance.name].value = "";
      }
    
    } else {
      actions.push({
        "type": "updateComponent",
        "config": {
          "key": action.config.errorTitleUUID,
          "properties": {
            "titleValue": "Accessory Doesn't Match",
            "isShown": true
          }
        }
      });
      actions.push({
        "type": "updateComponent",
        "config": {
          "key": action.config.textFieldUUID + index,
          "properties": {
            "rightLabel": ""
          }
        }
      });
      instance.group.controls[instance.name].value = "";  
    }
    actions.push({
      "type": "handleCheckAccActions",
      "methodType": "handleCheckAccCompleteButton",
      "config": {
        "count": count,
        "isValueRepeated": isValueRepeated,
        "isMatched": isMatched,
        "taskPanelUUID": action.config.taskPanelUUID,
        "textFieldUUID": action.config.textFieldUUID,
        "accessoryNameUUID": action.config.accessoryNameUUID,
        "resultCodeUUID": action.config.resultCodeUUID,
        "timeOutUUID": action.config.timeOutUUID,
        "completeUUID": action.config.completeUUID,
        "resetUUID": action.config.resetUUID,
        "errorTitleUUID": action.config.errorTitleUUID,
        "rightLabel": action.config.item['FF_VALUE']
      }
    })

    this.executeActions(actions, instance, actionService);
  }

  /// Checks whether all the text fields are filled with valid data or not
  /// and enables / disableds the comlete button
  handleCheckAccCompleteButton(action: any, instance: any, actionService: any) {
    let isValid = true;
    let actions = [];
    let isValueRepeated = action.config.isValueRepeated;
    let isMatched = action.config.isMatched;
    let count = action.config.count;
    for (let i = 0; i < count; i++) {
      let textBoxRef = this.contextService.getDataByKey(action.config.textFieldUUID + i + "ref");
      let textBoxValue = "";
      if (textBoxRef && textBoxRef.instance.group) {
        textBoxValue = textBoxRef.instance.group.controls[textBoxRef.instance.name].value;
        textBoxRef.instance.group.controls[textBoxRef.instance.name]["rightLabel"] = textBoxRef.instance.rightLabel;
      }
      if (textBoxValue === null || textBoxValue === undefined || textBoxValue === "") {
        isValid = false;
      }
    }
    

    if (isValid && !isValueRepeated && isMatched) {
      actions.push({
        "type": "updateComponent",
        "config": {
          "key": action.config.completeUUID,
          "properties": {
            "disabled": false
          }
        }
      })
    } else {
      actions.push({
        "type": "updateComponent",
        "config": {
          "key": action.config.completeUUID,
          "properties": {
            "disabled": true
          }
        }
      })
    }

    this.executeActions(actions, instance, actionService);
  }

  checkForIssuedParts(action: any, instance: any, actionService: any) {
    let actions = [];
    let getPreviousWCFAHistoryData = this.contextService.getDataByKey(action.config.data);
    let location = this.contextService.getDataByKey("userSelectedLocation");
    let callBackParams = {};
    getPreviousWCFAHistoryData && getPreviousWCFAHistoryData.map((item, index) => {
      item["index"] = index;
      item["length"] = getPreviousWCFAHistoryData.length;
      actions.push({
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getCompByAction",
          "requestMethod": "get",
          "isDisplayErrorMessage": false,
          "params": {
            "actionId": item.actionId,
            "userName": "#userAccountInfo.PersonalDetails.USERID"
          },
          "isLocal": false,
          "LocalService": "assets/Responses/getCompByActionRes.json"
        },
        "responseDependents": {
          "onSuccess": {
            "actions": []
          },
          "onFailure": {
            "actions": []
          }
        }
      });
    })
    callBackParams["itemList"] = actions;
    callBackParams["action"] = action;
    callBackParams["location"] = location;
    this.utilityService.combinelatestApirequest(actions, this.filterPPIDForIssuedParts, callBackParams, actionService);
  }

  filterPPIDForIssuedParts(callBackParams, contextService, actionService) {
    let issuedPartsData = [];
    let itemList = callBackParams["itemList"];
    let action = callBackParams["action"];
    let location = callBackParams["location"];
    itemList && itemList.map((x, index) => {
      let getCompByActionData = contextService.getDataByKey(x.config.microserviceId + index);
      getCompByActionData && getCompByActionData.map((data) => {
        if (data.TRX_TYPE.toLowerCase() === "issued") {
          if (location === "1244" && data.COMPONENT_LOCATION && data.COMPONENT_LOCATION != "") {
            issuedPartsData.push(data.COMPONENT_LOCATION);
          } else if (data.COMPONENT_SN && data.COMPONENT_SN != "") {
            issuedPartsData.push(data.COMPONENT_SN);
          }
        }
      })
    })
    console.log(issuedPartsData)
    actionService.handleAction({
      "type": "handleCheckAccActions",
      "methodType": "handleCheckAccessoriesPanel",
      "config": {
        "checkAccData": "checkAccFFData",
        "issuedPartsData": issuedPartsData,
        "taskPanelUUID": action.config.taskPanelUUID,
        "textFieldUUID": action.config.textFieldUUID,
        "accessoryNameUUID": action.config.accessoryNameUUID,
        "completeUUID": action.config.completeUUID,
        "resultCodeUUID": action.config.resultCodeUUID,
        "timeOutUUID": action.config.timeOutUUID,
        "resetUUID": action.config.resetUUID,
        "nextTaskPanelUUID": action.config.nextTaskPanelUUID,
        "nextTaskPanelTitle": action.config.nextTaskPanelTitle,
        "errorTitleUUID": action.config.errorTitleUUID,
        "expanded": action.config.expanded ? true : false,
        "disabled": action.config.disabled ? true : false,
      }
    });
  }

  /// Resets the check accessories panel
  resetCheckAccPanelData(action: any, instance: any, actionService: any) {
    let checkAccFFData = action.config.checkAccFFData;
    if (checkAccFFData) {
      let halfLength = checkAccFFData.length / 2;
      for (let i = 0; i < halfLength; i++) {
        let textBoxRef = this.contextService.getDataByKey(action.config.textFieldUUID + i + "ref");
        if (textBoxRef && textBoxRef.instance) {
          textBoxRef.instance.group.controls[textBoxRef.instance.name].setValue(null);
        }
        this.contextService.addToContext("enteredHashCode" + i, "");
        let accesTypeData = {
          "ctype": "textField",
          "uuid":  action.config.textFieldUUID+i,
          "value": "",
          "name": textBoxRef.instance.name,
          "disabled": false
        }                
        this.contextService.addToContext(action.config.textFieldUUID + i, accesTypeData);
        let actions = [
          {
            "type": "updateComponent",
            "config": {
              "key": action.config.textFieldUUID + i,
              "properties": {
                "rightLabel": ""
              }
            }
          }
        ]
        this.executeActions(actions, instance, actionService);
      }
    }
  }

  //Edit Functionality
  dellCheckAccessoriesEditFunctionality(action) {
    let parentuuid = this.contextService.getDataByKey(action.config.taskPanelUUID + "ref"); //current taskpanel uuid
    let currentWC = this.contextService.getDataByKey("currentWC");
    if (parentuuid != undefined) {
      let MendatoryFlag = parentuuid.instance.isMandatory; // for isMandatory Task only we need to disable
      if (MendatoryFlag === true) {

        let validatetaskpanelstatus = this.contextService.getDataByKey(currentWC+"validatetaskpanelstatus"); // used some flag so that after completing all the task panels this flag will be true
        if (validatetaskpanelstatus == true) {
          let ResultCodes = {
            "type": "updateComponent",
            "config": {
              "key": action.config.resultCodeUUID,
              "properties": {
                "disabled": true
              }
            },
            "eventSource": "click"
          }
          this.componentService.handleUpdateComponent(ResultCodes, null, null, this.utilityService);
          let Timeout = {
            "type": "updateComponent",
            "config": {
              "key": action.config.timeOutUUID,
              "properties": {
                "disabled": true
              }
            },
            "eventSource": "click"
          }
          this.componentService.handleUpdateComponent(Timeout, null, null, this.utilityService);
        }
      }
    }
  }

  /// Handles the functionality of complete button, for packout
  handleDellpackoutCheckAccCompleteButton(action: any, instance: any, actionService: any) {
    let isValid = true;
    let actions = [];
    let isValueRepeated = action.config.isValueRepeated;
    let isMatched = action.config.isMatched;
    let count = action.config.count;
    for (let i = 0; i < count; i++) {
      let textBoxRef = this.contextService.getDataByKey(i + action.config.textFieldUUID + "ref");
      let textBoxValue = "";
      if (textBoxRef && textBoxRef.instance.group) {
        textBoxValue = textBoxRef.instance.group.controls[textBoxRef.instance.name].value;
        textBoxRef.instance.group.controls[textBoxRef.instance.name]["rightLabel"] = textBoxRef.instance.rightLabel;
      }
      if (textBoxValue === null || textBoxValue === undefined || textBoxValue === "") {
        isValid = false;
      }
    }

    if (isValid && !isValueRepeated && isMatched) {
      actions.push({
        "type": "updateComponent",
        "config": {
          "key": action.config.completeUUID,
          "properties": {
            "disabled": false
          }
        }
      })
    } else {
      actions.push({
        "type": "updateComponent",
        "config": {
          "key": action.config.completeUUID,
          "properties": {
            "disabled": true
          }
        }
      })
    }

    this.executeActions(actions, instance, actionService);
    // actions.forEach((currentAction) => {
    //   this.actionService.handleAction(currentAction, instance);
    // });
  }
}
