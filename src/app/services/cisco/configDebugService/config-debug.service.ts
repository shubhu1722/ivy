import { Injectable } from '@angular/core';
import { element } from 'protractor';
import { ContextService } from '../../commonServices/contextService/context.service';
import { CustomeService } from '../../commonServices/customeService/custome.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigDebugService {

  constructor(
    private contextService: ContextService,
    private customeService: CustomeService
  ) { }

  handleConfigProcessActions(action, instance, actionService) {
    let selectedProcess = this.contextService.getDataByString("#configDebugSelectedProcess");
    // console.log("configDebugSelectedProcess : ", selectedProcess);

    let processActions = [
      {
        "type": "deleteComponent",
        "eventSource": "click",
        "config": {
          "key": "configDebugTaskPanelUUID"
        }
      },
      {
        "type": "context",
        "eventSource": "click",
        "config": {
          "requestMethod": "add",
          "key": "configDebugSelectedProcess",
          "data": action.config.processType
        }
      },
      {
        "type": "configdisableOrEnableAllIcons",
        "eventSource": "click",
        "config": {
          "currentProcess": action.config.processType,
          "isDisable": true
        }
      },
      {
        "type": "createComponent",
        "config": {
          "targetId": "pageUUID",
          "containerId": "bodypage",
          "data": {
            "ctype": "taskPanel",
            "uuid": "configDebugTaskPanelUUID",
            "title": "",
            "header": {
              "title": action.config.text,
              "svgIcon": action.config.svgIcon,
              "iconClass": "active-header",
              "status": "",
              "statusIcon": "close",
              "statusClass": "header-icon"
            },
            "expanded": true,
            "hideToggle": true,
            "splitView": true,
            "collapsedHeight": "40px",
            "expandedHeight": "40px",
            "bodyclass": "splitView",
            "panelClass": "top-margin",
            "leftDivclass": "width:50%",
            "rightDivclass": "width:50%",
            "taskPanelHeaderClass": "task-panel-header-color-light-grey",
            "visibility": false,
            "hooks": [],
            "validations": [],
            "actions": [
              {
                "type": "deleteComponent",
                "eventSource": "click",
                "config": {
                  "key": "configDebugTaskPanelUUID"
                }
              },
              {
                "type": "context",
                "eventSource": "click",
                "config": {
                  "requestMethod": "add",
                  "key": "currentTaskUUID",
                  "data": ""
                }
              },
              {
                "type": "configdisableOrEnableAllIcons",
                "eventSource": "click",
                "config": {
                  "currentProcess": action.config.processType,
                  "isDisable": false
                }
              },
            ],
            "items": this._getItemsBasedOnProcess(action, instance, actionService, false),
            "rightItems": this._returnRightSideItems(action, instance, actionService, true),
            "footer": [
              {
                "ctype": "iconbutton",
                "text": "Reset Form",
                "parentuuid": "replaceTaskUUID",
                "uuid": "ReplaceresetUUID",
                "visibility": true,
                "disabled": false,
                "type": "submit",
                "hooks": [],
                "validations": [],
                "icon": "not_interested",
                "iconClass": "resetIcon",
                "actions": [
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "errorTitleUUID",
                      "properties": {
                        "titleValue": "",
                        "isShown": false
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "stockQuantityUUID",
                      "updateParent": true,
                      "properties": {
                        "hidden": true,
                        "text": ""
                      }
                    }
                  },
                  {
                    "type": "resetData",
                    "eventSource": "click"
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "change",
                    "config": {
                      "key": "ConfigDebugFlexFieldRewINSTRUUID",
                      "properties": {
                        "flexClass": "hide"
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "change",
                    "config": {
                      "key": "configDebugDesFlexUUID",
                      "properties": {
                        "flexClass": "hide"
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "configDebugDesLabelUUID#@",
                      "properties": {
                        "text": ""
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "ConfigDebugLocationUUID",
                      "properties": {
                        "isReset": true,
                        "name": action.config.processType + "Location",
                        "selectedList": []
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "ConfigDebugRewINSTRUUID",
                      "properties": {
                        "isReset": true,
                        "name": "configDebug" + action.config.processType + "RewINSTR",
                        "value": ""
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": 'configQtyUUID',
                      "properties": {
                        "text": "0"
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "configDebugStockQty",
                      "properties": {
                        "text": ""
                      }
                    }
                  }
                ]
              },
              {
                "ctype": "button",
                "color": "primary",
                "text": "Complete",
                "class": "primary-btn",
                "uuid": "CompleteButtonUUID",
                "parentuuid": "replaceTaskUUID",
                "visibility": true,
                "disabled": true,
                "type": "submit",
                "tooltip": "",
                "hooks": [],
                "validations": [],
                "actions": [
                  {
                    "type": "configDebugCompleteButton",
                    "eventSource": "click",
                    "config": {
                      "action": action,
                      "isLooperControlTask": false,
                      "addConfigTask": true
                    }
                  }
                ]
              }
            ]
          }
        },
        "eventSource": "click"
      }
    ];

    this.executeActions(processActions, instance, actionService);
  }

  /*
   * This method is being called when the
   * 1) complete button of task panel from tool bar is clicked and
   * 2) for looper control tasks coming from API.
  */
  onClickOfConfigCompleteButton(action: any, instance: any, actionService: any) {
    let completeButtonActions = [];
    let taskPanelData;
    if (!action.config.isLooperControlTask) {
      action = action.config.action;
      taskPanelData = {
        "subAssm": this.contextService.getDataByString("#configDebug" + action.config.processType + "SubAssmName"),
        "description": this.contextService.getDataByString("#configDebug" + action.config.processType + "Description"),
        "location": this.contextService.getDataByString("#configDebug" + action.config.processType + "Location"),
        "defect": this.contextService.getDataByString("#configDebug" + action.config.processType + "Defect"),
        "qty": this.contextService.getDataByString("#configDebug" + action.config.processType + "AvailableQuantity"),
        "part": this.contextService.getDataByString("#configDebug" + action.config.processType + "PartName"),
        "scrap": this.contextService.getDataByString("#configDebug" + action.config.processType + "Scrap"),
        "notes": this.contextService.getDataByString("#configDebug" + action.config.processType + "RewINSTR"),
        "FA": this.contextService.getDataByString("#configDebug" + action.config.processType + "FA"),
        "assemblyCode": this.contextService.getDataByString("#configDebug" + action.config.processType + "SubAssm"),
        "compPartno": this.contextService.getDataByString("#configDebug" + action.config.processType + "Part")
      };
      action.config["taskPanelData"] = taskPanelData;
    }

    completeButtonActions = [
      {
        "type": "updateComponent",
        "eventSource": "click",
        "config": {
          "key": "errorTitleUUID",
          "properties": {
            "titleValue": "",
            "isShown": false
          }
        }
      },
      {
        "type": "deleteComponent",
        "eventSource": "click",
        "config": {
          "key": "configDebugTaskPanelUUID"
        }
      },
      {
        "type": "configdisableOrEnableAllIcons",
        "eventSource": "click",
        "config": {
          "currentProcess": action.config.processType,
          "isDisable": false
        }
      },
      {
        "type": "createComponent",
        "config": {
          "targetId": "pageUUID",
          "containerId": "prebodysectiontwo",
          "data": {
            "ctype": "taskPanel",
            "uuid": "configDebugCreatedTaskPanelUUID",
            "uniqueUUID": true,
            "updateUUID": true,
            "title": "",
            "columnWiseTitle": true,
            "header": {
              "svgIcon": action.config.processType === "resolder" ? "manual" : action.config.processType,
              "iconClass": "active-header",
              "headerclass": "replaceheaderclass",
              "status": "",
              "statusIcon": action.config.addToWL ? "check_circle" : action.config.isLooperControlTask ? "info_outline" : "check_circle",
              "statusClass": action.config.addToWL ? "complete-status" : action.config.isLooperControlTask ? "eco-icon" : "complete-status"
            },
            "headerTitleLabels": [
              this._getHeader(action),
              "",
              "",
              ""
            ],
            "headerTitleValues": [
              action.config.processType !== "scrap" ? action.config.taskPanelData.part : action.config.taskPanelData.scrap,
              "",
              "",
              "",
              action.config.isEco != undefined && action.config.isEco ? "ECO" :
                action.config.isEco != undefined && !action.config.isEco ? "Diagnosis" :
                  "Diagnosis"
            ],
            "inputClasses": [
              "parent1-width",
              "parent1"
            ],
            "expanded": false,
            "hideToggle": true,
            "splitView": true,
            "collapsedHeight": "40px",
            "expandedHeight": "40px",
            "bodyclass": "splitView",
            "panelClass": "top-margin",
            "leftDivclass": "width:50%",
            "rightDivclass": "width:50%",
            "taskPanelHeaderClass": "task-panel-header-color-light-grey",
            "visibility": false,
            "hooks": action.config.taskPanelData.mandatory == "0" || action.config.taskPanelData.mandatory == undefined ? this.completedTaskHooks(action) : this.mandatorytask(action),
            "validations": [],
            "actions": [
              {
                "type": "configdisableOrEnableAllIcons",
                "eventSource": "click",
                "config": {
                  "currentProcess": action.config.processType,
                  "isDisable": false
                }
              },
            ],
            "items": this._getItems(action),
            "rightItems": this._returnRightSideItems(action, instance, actionService, false),
            "footer": this._getFooter(action, instance, actionService)
          }
        },
        "eventSource": "click"
      }
    ];

    this.executeActions(completeButtonActions, instance, actionService);
    // console.log(this.contextService);
  }

  completedTaskHooks(action: any) {
    let hooks = [];
    if (action.config.processType !== "scrap" && action.config.addToWL !== undefined && action.config.addToWL) {
      let locText = action.config.taskPanelData.part + " , " + action.config.taskPanelData.location
      hooks = [
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "configDebugWishList",
            "sourceData": {
              "Part Details": [
                {
                  "ctype": "block-text",
                  "uuid": "StockUUID",
                  "text": "Part:",
                  "textValue": locText,
                  "class": "subtitle1-align-self greyish-black width-200"
                },
                {
                  "ctype": "block-text",
                  "uuid": "StockUUID",
                  "textValue": action.config.taskPanelData.defect,
                  "class": "subtitle1-align-self greyish-black overflow-wrap width-200"
                }
              ],
              "Qty": [
                {
                  "ctype": "block-text",
                  "uuid": "configDebugWishlistQtyUUID",
                  "text": action.config.taskPanelData.qty
                },
                {
                  "ctype": "block-text",
                  "uuid": "displayQuantityUUID",
                  "class": "light-red body margin-top-10",
                  "text": "#displayQuantity"
                }
              ],
              "parentUUID": "#createdComponentUUID"
            }
          },
          "hookType": "afterInit"
        },
        {
          "type": "context",
          "hookType": "afterInit",
          "config": {
            "requestMethod": "add",
            "key": "configDebugWishListLength",
            "data": "contextLength",
            "sourceContext": "configDebugWishList"
          }
        },
        {
          "type": "errorPrepareAndRender",
          "hookType": "afterInit",
          "config": {
            "key": "configDebugWishListButtonUUID",
            "properties": {
              "titleValue": "WishList ({0})",
              "isShown": true
            },
            "valueArray": [
              "#configDebugWishListLength"
            ]
          }
        },
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "configDebugTableData",
            "sourceData": {
              "parentUUID": "#@",
              "flexFields": this._getTableFlexData(action)
            }
          },
          "hookType": "afterInit"
        }
      ];
    }
    if (action.config.addConfigTask) {
      let locText = action.config.taskPanelData.part + " , " + action.config.taskPanelData.location
      hooks = [
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "configDebugWishList",
            "sourceData": {
              "Part Details": [
                {
                  "ctype": "block-text",
                  "uuid": "StockUUID",
                  "text": "Part:",
                  "textValue": locText,
                  "class": "subtitle1-align-self greyish-black width-200"
                },
                {
                  "ctype": "block-text",
                  "uuid": "StockUUID",
                  "textValue": action.config.taskPanelData.defect,
                  "class": "subtitle1-align-self greyish-black overflow-wrap width-200"
                }
              ],
              "Qty": [
                {
                  "ctype": "block-text",
                  "uuid": "configDebugWishlistQtyUUID",
                  "text": action.config.taskPanelData.qty
                },
                {
                  "ctype": "block-text",
                  "uuid": "displayQuantityUUID",
                  "class": "light-red body margin-top-10",
                  "text": "#displayQuantity"
                }
              ],
              "parentUUID": "#createdComponentUUID"
            }
          },
          "hookType": "afterInit"
        },
        {
          "type": "context",
          "hookType": "afterInit",
          "config": {
            "requestMethod": "add",
            "key": "configDebugWishListLength",
            "data": "contextLength",
            "sourceContext": "configDebugWishList"
          }
        },
        {
          "type": "errorPrepareAndRender",
          "hookType": "afterInit",
          "config": {
            "key": "configDebugWishListButtonUUID",
            "properties": {
              "titleValue": "WishList ({0})",
              "isShown": true
            },
            "valueArray": [
              "#configDebugWishListLength"
            ]
          }
        },
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "configDebugTableData",
            "sourceData": {
              "parentUUID": "#@",
              "flexFields": this._getTableFlexData(action)
            }
          },
          "hookType": "afterInit"
        }
      ];
    }
    if (action.config.isLooperControlTask) {
      hooks.push({
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getCiscoDebugAvailQty",
          "isLocal": false,
          "LocalService": "assets/Responses/ciscoTaskPanelDataResponse.json",
          "requestMethod": "get",
          "params": {
            "componentPartNo": action.config.taskPanelData.part.toString(),
            "conditionId": "1,3",
            "locationId": "#userSelectedLocation",
            "wharehouseId": "#UnitInfo.WAREHOUSE_ID"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "configDebugAvailQtyRes#@",
                  "data": "responseData"
                }
              },
              {
                "type": "concatinateString",
                "config": {
                  "key": "configDebugAvailQtyRes#@",
                  "text1": "#configDebugAvailQtyRes#@",
                  "text2": "Available"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "configDebugStockQty#@",
                  "properties": {
                    "text": "#configDebugAvailQtyRes#@"
                  }
                }
              }
            ]
          },
          "onFailure": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "errorDisp",
                  "data": "responseData"
                }
              },
              {
                "type": "condition",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": "#errorDisp",
                  "rhs": "No Record Found"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "errorTitleUUID",
                          "properties": {
                            "titleValue": "#errorDisp",
                            "isShown": false
                          }
                        }
                      }
                    ]
                  },
                  "onFailure": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "errorTitleUUID",
                          "properties": {
                            "titleValue": "#errorDisp",
                            "isShown": true
                          }
                        }
                      }
                    ]
                  }
                }
              }
            ]
          }
        }
      });
    }
    else {
      hooks.push(
        {
          "type": "updateComponent",
          "hookType": "afterInit",
          "config": {
            "key": "configDebugStockQty#@",
            "properties": {
              "text": "#configDebugAvailQtyRes"
            }
          }
        }
      );
    }

    hooks.push(
      {
        "type": "context",
        "config": {
          "requestMethod": "addToExistingContext",
          "target": "dummyArray",
          "sourceData": {
            "uuid": "#@",
            "defect": action.config.taskPanelData.defect
          }
        },
        "hookType": "afterInit"
      }
    )

    // if (!action.config.isLooperControlTask && action.config.processType !== "scrap") {
    //   hooks.push(
    //     {
    //       "type": "triggerClick",
    //       "hookType": "afterInit",
    //       "config": {
    //         "key": "configDebugWishListButtonUUID"
    //       }
    //     }
    //   );
    // }

    return hooks;
  }

  _getTableFlexData(action: any) {
    let flexData = [];
    flexData = action.config.taskPanelData;
    return flexData;
  }

  // removeValueFromConfigTable(action: any, instance: any, actionService: any) {
  //   let getvaluefromArray;
  //   let indexOfArray;
  //   let parentuuidName;

  //   if (instance.parentuuid !== undefined && instance.parentuuid != null && instance.parentuuid.startsWith('#')) {
  //     parentuuidName = this.contextService.getDataByString(
  //       instance.parentuuid
  //     );
  //   } else {
  //     parentuuidName = instance.parentuuid;
  //   }

  //   if (action.config.arrayData.startsWith('#')) {
  //     let contextArray = this.contextService.getDataByString(
  //       action.config.arrayData
  //     );

  //     if (action.config.key !== undefined) {
  //       getvaluefromArray = contextArray.find((x) => x[action.config.key] === parentuuidName)[action.config.property][0];

  //       if (action.config.splice !== undefined && action.config.splice) {
  //         indexOfArray = contextArray.findIndex((x) => x[action.config.key] == parentuuidName);
  //         // getvaluefromArray = contextArray.splice(indexOfArray, 1);
  //         /// To Do : make this generic
  //         /// Delete from linelist context too
  //         contextArray.splice(indexOfArray, 1);
  //         this.contextService.addToContext(action.config.arrayData, contextArray);

  //         /// Delete from requistionList context
  //         let requisitionList = [];
  //         requisitionList = this.contextService.getDataByKey(action.config.keyToFind);
  //         const reqListIndex = requisitionList.findIndex((x) => x[action.config.key] === parentuuidName);
  //         requisitionList.splice(reqListIndex, 1);
  //         this.contextService.addToContext(action.config.keyToFind, requisitionList);

  //         let requisitionLength;
  //         requisitionLength = requisitionList.length;
  //         this.contextService.addToContext(action.config.keyToFind + 'Length', requisitionLength);

  //         if (action.config.deleteTableData !== undefined) {
  //           /// Update mat table -- This will be moved to seperate action later
  //           const matTableRef = this.contextService.getDataByKey(action.config.tableUUID + 'ref');
  //           matTableRef.instance.matTableDataSource.data = requisitionList;
  //           matTableRef.instance.matTableDataSource._updateChangeSubscription();
  //           matTableRef.instance._changeDetectionRef.detectChanges();
  //         }
  //       }
  //     }
  //     else {
  //       contextArray.forEach((ele) => {
  //         if (
  //           ele.storageHoldSubCode == instance.group.controls[instance.name].value
  //         ) {
  //           getvaluefromArray = ele[action.config.PullValue];
  //           return;
  //         }
  //       });
  //     }
  //   }
  //   this.contextService.addToContext(
  //     action.config.PullValue,
  //     getvaluefromArray
  //   );
  // }

  _getHeader(action) {
    let tcEco = this.contextService.getDataByString("#getConfigDebugValidateEcodata");
    // let taskPanelData = this.contextService.getDataByString("#configDebugWishListRes");
    let taskPanelData = action.config.taskPanelData
    let test = [];
    let normalEco = []
    tcEco && tcEco.forEach(element => {
      if (element.isTncEco == "true") {
        // taskPanelData.forEach((taskData) => {
        if (taskPanelData.defect === element.ecoNumber) {
          test.push(taskPanelData);
        } else {
          normalEco.push(taskPanelData);
        }
        // });
        taskPanelData = normalEco;
      }
    });

    if (test.length > 0) {
      return action.config.processType === "replace" ? "Add Part - " : "Scrap - "
    } else {
      return action.config.processType === "replace" ? "Replace Part - " :
        action.config.processType === "remove" ? "Remove Part - " :
          action.config.processType === "fit" ? "Fit Part- " :
            action.config.processType === "resolder" ? "Resolder Part- " : "Scrap - "
    }
  }

  _getFooter(action: any, instance: any, actionService: any) {
    let footerItems = [];

    if (action.config.isLooperControlTask && action.config.isEco) {
      footerItems.push({
        "ctype": "checkbox",
        "uuid": "configDebugReplaceCloseEco#@",
        "name": "configDebugReplaceCloseEco",
        "hooks": [],
        "validations": [],
        "submitable": true,
        "label": "Not required to Close ECO",
        "labelPosition": "after",
        "checkboxContainer": "mac-checkbox",
        "actions": [
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "configDebugReplaceCloseEcocheck#@",
              "data": "formData"
            },
            "eventSource": "click"
          },
          {
            "type": "updateComponent",
            "config": {
              "key": "createdTaskCompleteButtonUUID#@",
              "properties": {
                "text": "Complete"
              }
            },
            "eventSource": "click"
          }
        ]
      });
      footerItems.push({
        "ctype": "spacer",
        "uuid": "emptySpaceUUID",
        "class": "empty-space"
      });
    }
    if (action.config.isLooperControlTask) {
      footerItems.push({
        "ctype": "button",
        "color": "primary",
        "text": action.config.addToWL ? "Keep in Wishlist" : "Complete",
        "class": "primary-primary-btn-full-width",
        "uuid": "createdTaskCompleteButtonUUID#@",
        "parentuuid": "#@",
        "visibility": true,
        "disabled": false,
        "type": "submit",
        "tooltip": "",
        "hooks": [],
        "validations": [],
        "actions": this.createdTaskCompleteButtonActions(action, instance, actionService)
      });
    } else {
      footerItems.push({
        "ctype": "button",
        "color": "primary",
        "text": "Complete",
        "class": "primary-primary-btn-full-width",
        "uuid": "createdTaskCompleteButtonUUID#@",
        "parentuuid": "#@",
        "visibility": true,
        "disabled": true,
        "type": "submit",
        "tooltip": "",
        "hooks": [],
        "validations": [],
        "actions": []
      });
    }
    return footerItems;
  }
  _deleteButtonActions(action: any) {
    let actions = [];
    actions = [
      {
        "type": "deleteComponent",
        "eventSource": "click",
        "config": {
          "key": "#@"
        }
      }
    ];

    if (action.config.processType !== "scrap") {
      actions.push({
        "type": "removeValueFromTable",
        "config": {
          "arrayData": "#configDebugTableData",
          "PullValue": "#@",
          "key": "parentUUID",
          "property": "flexFields",
          "splice": true,
          "deleteTableData": true,
          "keyToFind": "configDebugWishList",
          "tableUUID": "configWishListTableUUID"
        },
        "eventSource": "click"
      });

      actions.push(
        {
          "type": "errorPrepareAndRender",
          "eventSource": "click",
          "config": {
            "key": "configDebugWishListButtonUUID",
            "properties": {
              "titleValue": "WishList ({0})",
              "isShown": true
            },
            "valueArray": [
              "#configDebugWishListLength"
            ]
          }
        });
    }

    return actions;
  }

  createdTaskCompleteButtonActions(action: any, instance: any, actionService: any) {
    let actions = [];
    let debugFlexFieldsData = [];
    let taskPanelData;
    if (!action.config.isLooperControlTask) {
      action = action.config.action;
      taskPanelData = {
        "subAssm": this.contextService.getDataByString("#configDebug" + action.config.processType + "SubAssmName"),
        "description": this.contextService.getDataByString("#configDebug" + action.config.processType + "Description"),
        "location": this.contextService.getDataByString("#configDebug" + action.config.processType + "Location"),
        "defect": this.contextService.getDataByString("#configDebug" + action.config.processType + "Defect"),
        "qty": this.contextService.getDataByString("#configDebug" + action.config.processType + "AvailableQuantity"),
        "part": this.contextService.getDataByString("#configDebug" + action.config.processType + "PartName"),
        "scrap": this.contextService.getDataByString("#configDebug" + action.config.processType + "Scrap"),
        "notes": this.contextService.getDataByString("#configDebug" + action.config.processType + "RewINSTR"),
        "FA": this.contextService.getDataByString("#configDebug" + action.config.processType + "FA"),
        "assemblyCode": this.contextService.getDataByString("#configDebug" + action.config.processType + "SubAssm"),
        "compPartno": this.contextService.getDataByString("#configDebug" + action.config.processType + "Part")
      };
      action.config["taskPanelData"] = taskPanelData;
    }
    debugFlexFieldsData = this.addFlexFieldsData(action);

    if (action.config.isLooperControlTask) {
      actions = this._onClickOfWLTaskComplete(action, debugFlexFieldsData);
    } else {
      if (action.config.processType === "scrap") {
        actions = this._onClickOfTaskCompleteForScrap(action, debugFlexFieldsData);
      } else {
        actions = this._onClickOfTaskComplete(action, debugFlexFieldsData);
      }
    }
    if (action.config.isLooperControlTask) {
      return actions;
    } else {
      this.executeActions(actions, instance, actionService);
    }
  }
  /**
   * Complete button actions for created Scrap task
   * @param action
   * @param debugFlexFieldsData
   */
  _onClickOfTaskCompleteForScrap(action: any, debugFlexFieldsData: any[]): any[] {
    let actions = [
      {
        "type": "onClickOfConfigCompleteButton",
        "eventSource": "click",
        "config": {
          "action": action,
          "isLooperControlTask": false,
          "addConfigTask": true
        }
      }
    ];
    return actions;
  }

  addFlexFieldsData(action: any): any[] {
    let debugFlexFieldsData = [];
    let tcEco = this.contextService.getDataByString("#getConfigDebugValidateEcodata");
    let taskPanelData = action.config.taskPanelData;
    if (tcEco instanceof Array) {
      tcEco && tcEco.forEach(element => {
        if (element.isTncEco == "true" && taskPanelData.defect === element.ecoNumber) {
          debugFlexFieldsData = [
            {
              "name": "PCB_PN",
              "value": action.config.taskPanelData.subAssm
            },
            {
              "name": "PCB_SN",
              "value": "#UnitInfo.SERIAL_NO",
            }
          ];
        } else {
          debugFlexFieldsData = [
            {
              "name": "PCB_PN",
              "value": action.config.taskPanelData.subAssm
            },
            {
              "name": "REFURB",
              "value": "False"
            },
            {
              "name": "PCB_SN",
              "value": "#UnitInfo.SERIAL_NO",
            }
          ];
        }
      });
    } else {
      if (taskPanelData.isTncEco && taskPanelData.isTncEco == "true") {
        debugFlexFieldsData = [
          {
            "name": "PCB_PN",
            "value": action.config.taskPanelData.subAssm
          },
          {
            "name": "PCB_SN",
            "value": "#UnitInfo.SERIAL_NO",
          }
        ];
      } else {
        debugFlexFieldsData = [
          {
            "name": "PCB_PN",
            "value": action.config.taskPanelData.subAssm
          },
          {
            "name": "REFURB",
            "value": "False"
          },
          {
            "name": "PCB_SN",
            "value": "#UnitInfo.SERIAL_NO",
          }
        ];
      }
    }

    if (action.config.taskPanelData.FA) {
      debugFlexFieldsData.push(
        {
          "name": "ANALYSIS",
          "value": action.config.taskPanelData.FA
        });
    }

    if (action.config.taskPanelData.notes) {
      debugFlexFieldsData.push({
        "name": "REW_INSTR",
        "value": action.config.taskPanelData.notes
      });
    }
    // console.log("FlexField",debugFlexFieldsData)
    return debugFlexFieldsData;

  }

  configDebugWishListPanels(action: any, instance: any, actionService: any) {
    let ecoTasksRes = this.contextService.getDataByString(action.config.data);
    ecoTasksRes = ecoTasksRes && ecoTasksRes instanceof Array ? ecoTasksRes : [];
    ecoTasksRes && ecoTasksRes.forEach((item) => {
      item['FA'] = item.analysis;
      let action = {
        "config": {
          "svgIcon": item.taskType.split(" ")[0].toLowerCase(),
          "text": item.taskType.split(" ")[0],
          "processType": item.taskType.split(" ")[0].toLowerCase(),
          "taskPanelData": item,
          "isLooperControlTask": true,
          "addToWL": true,
          "isEco": item.activityType !== undefined && item.activityType === "ECO" ? true : false
        }
      };
      this.onClickOfConfigCompleteButton(action, instance, actionService);
    })
  }

  /**
* ECO and Repair tasks
* Complete button actions for eco and repair tasks
* coming from wishlist.
*/
  _onClickOfWLTaskComplete(action: any, debugFlexFieldsData) {
    let actions = [];
    let pid = this.contextService.getDataByString("#UnitInfo.PART_NO");
    let existDefectCode = {
      "type": "executetcDefectOperation",
      "config": {
        "defectCurrentCode": action.config.taskPanelData.defect,
        "currentActionCode": action.config.taskPanelData.isTncECO == "true" ? "OPEN-FIT" : "OPEN-REPLACE",
        "defectRecords": "#configDebugEcoTasksRes",
        "defectList": "getConfigDebugDefectRecords",
        "configDebugWLData": "#configDebugWLTasksRes",
        "key": "defectOperation"
      },
      "eventSource": "click"
    };
    actions.push(existDefectCode);
    if (action.config.isEco) {
      if (action.config && action.config.addToWL) {
        actions.push(
          {
            "type": "condition",
            "config": {
              "operation": "isEqualTo",
              "lhs": "#configDebugReplaceCloseEcocheck#@.configDebugReplaceCloseEco",
              "rhs": true
            },
            "eventSource": "click",
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "ciscoUnissueAndUndoFAForEcoTask",
                    "eventSource": "click",
                    "config": {
                      "defectCurrentCode": action.config.taskPanelData.defect,
                      "currentActionCode": this.isTncEcoDetails(action.config.taskPanelData.defect) == true ? "OPEN-FIT" : "OPEN-REPLACE",
                      "wishlist": "#configDebugWLTasksRes",
                      "afterAction": [
                        {
                          "type": "microservice",
                          "eventSource": "click",
                          "config": {
                            "microserviceId": "performFA",
                            "requestMethod": "post",
                            "body": {
                              "updateFailureAnalysisRequest": {
                                "actionCodeChangeList": {
                                  "actionCodeChange": [{
                                    "actionCode": "CLOSE",
                                    "operation": "Add",
                                    "ecoCode": {
                                      "value": pid + "--" + action.config.taskPanelData.defect
                                    }
                                  }]
                                },
                                "ecoCodeChangeList": {
                                  "ecoCodeChange": [{
                                    "ecoCode": pid + "--" + action.config.taskPanelData.defect,
                                    "operation": "Update"
                                  }]
                                },
                                "bcn": "#UnitInfo.ITEM_BCN"
                              },
                              "userPwd": {
                                "username": "#loginUUID.username",
                                "password": "#loginUUID.password"
                              },
                              "operationTypes": "ProcessImmediate",
                              "ip": "::1",
                              "callSource": "FrontEnd",
                              "apiUsage_LocationName": "#UnitInfo.GEONAME",
                              "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                            },
                            "toBeStringified": true
                          },
                          "responseDependents": {
                            "onSuccess": {
                              "actions": this.configActionsAfterTransactions(action, true)
                            },
                            "onFailure": {
                              "actions": [{
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "performFAError",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "condition",
                                "config": {
                                  "operation": "isEqualTo",
                                  "lhs": "#performFAError",
                                  "rhs": "No Record Found"
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "errorTitleUUID",
                                          "properties": {
                                            "titleValue": "#performFAError",
                                            "isShown": false
                                          }
                                        }
                                      }
                                    ]
                                  },
                                  "onFailure": {
                                    "actions": [
                                      {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "errorTitleUUID",
                                          "properties": {
                                            "titleValue": "#performFAError",
                                            "isShown": true
                                          }
                                        }
                                      }
                                    ]
                                  }
                                }
                              }
                              ]
                            }
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              "onFailure": {
                "actions": [
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "#@",
                      "properties": {
                        "expanded": false,
                        "disabled": false,
                        "header": {
                          "title": "Check Damage",
                          "svgIcon": "description",
                          "statusIcon": "check_circle",
                          "statusClass": "complete-status",
                          "iconClass": "complete-task",
                          "headerclass": "replaceheaderclass"
                        }
                      }
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "createdTaskCompleteButtonUUID#@",
                      "properties": {
                        "disabled": true,
                      }
                    },
                    "eventSource": "click"
                  },
                ]
              }
            }
          }
        );
        actions.push(
          {
            "type": "updateComponent",
            "config": {
              "key": "#@",
              "properties": {
                "expanded": false,
                "disabled": false,
                "header": {
                  "title": "Check Damage",
                  "svgIcon": "description",
                  "statusIcon": "check_circle",
                  "statusClass": "complete-status",
                  "iconClass": "complete-task",
                  "headerclass": "replaceheaderclass"
                }
              }
            },
            "eventSource": "click"
          },
          {
            "type": "updateComponent",
            "config": {
              "key": "createdTaskCompleteButtonUUID#@",
              "properties": {
                "disabled": true,
              }
            },
            "eventSource": "click"
          },
          {
            "type": "updateComponent",
            "config": {
              "key": "createdTaskDeleteButtonUUID#@",
              "properties": {
                "disabled": true,
              }
            },
            "eventSource": "click"
          }
        )
      }
      else {
        let locText = action.config.taskPanelData.part + " , " + action.config.taskPanelData.location
        actions.push(
          {
            "type": "condition",
            "config": {
              "operation": "isEqualTo",
              "lhs": "#configDebugReplaceCloseEcocheck#@.configDebugReplaceCloseEco",
              "rhs": true
            },
            "eventSource": "click",
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "ciscoUnissueAndUndoFAForEcoTask",
                    "eventSource": "click",
                    "config": {
                      "defectCurrentCode": action.config.taskPanelData.defect,
                      "currentActionCode": this.isTncEcoDetails(action.config.taskPanelData.defect) == true ? "OPEN-FIT" : "OPEN-REPLACE",
                      "wishlist": "#configDebugWLTasksRes",
                      "afterAction": [
                        {
                          "type": "microservice",
                          "eventSource": "click",
                          "config": {
                            "microserviceId": "performFA",
                            "requestMethod": "post",
                            "body": {
                              "updateFailureAnalysisRequest": {
                                "actionCodeChangeList": {
                                  "actionCodeChange": [{
                                    "actionCode": "CLOSE",
                                    "operation": "Add",
                                    "ecoCode": {
                                      "value": pid + "--" + action.config.taskPanelData.defect
                                    }
                                  }]
                                },
                                "ecoCodeChangeList": {
                                  "ecoCodeChange": [{
                                    "ecoCode": pid + "--" + action.config.taskPanelData.defect,
                                    "operation": "Update"
                                  }]
                                },
                                "bcn": "#UnitInfo.ITEM_BCN"
                              },
                              "userPwd": {
                                "username": "#loginUUID.username",
                                "password": "#loginUUID.password"
                              },
                              "operationTypes": "ProcessImmediate",
                              "ip": "::1",
                              "callSource": "FrontEnd",
                              "apiUsage_LocationName": "#UnitInfo.GEONAME",
                              "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                            },
                            "toBeStringified": true
                          },
                          "responseDependents": {
                            "onSuccess": {
                              "actions": this.configActionsAfterTransactions(action, true)
                            },
                            "onFailure": {
                              "actions": [{
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "performFAError",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "condition",
                                "config": {
                                  "operation": "isEqualTo",
                                  "lhs": "#performFAError",
                                  "rhs": "No Record Found"
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "errorTitleUUID",
                                          "properties": {
                                            "titleValue": "#performFAError",
                                            "isShown": false
                                          }
                                        }
                                      }
                                    ]
                                  },
                                  "onFailure": {
                                    "actions": [
                                      {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "errorTitleUUID",
                                          "properties": {
                                            "titleValue": "#performFAError",
                                            "isShown": true
                                          }
                                        }
                                      }
                                    ]
                                  }
                                }
                              }
                              ]
                            }
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              "onFailure": {
                "actions": [
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isEqualTo",
                      "lhs": action.config.taskPanelData.isTncECO,
                      "rhs": "true"
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "microservice",
                            "eventSource": "click",
                            "config": {
                              "microserviceId": "performFA",
                              "requestMethod": "post",
                              "body": {
                                "updateFailureAnalysisRequest": {
                                  "actionCodeChangeList": {
                                    "actionCodeChange": [{
                                      "actionCode": action.config.taskPanelData.isTncECO == "true" ? "OPEN-FIT" : "OPEN-REPLACE",
                                      "operation": "#defectOperation.actionCode",
                                      "assemblyCode": {
                                        "value": action.config.taskPanelData.assemblyCode
                                      },
                                      "ecoCode": {
                                        "value": pid + "--" + action.config.taskPanelData.defect
                                      }
                                    }]
                                  },
                                  "assemblyCodeChangeList": {
                                    "assemblyCodeChange": [{
                                      "assemblyCode": action.config.taskPanelData.assemblyCode,
                                      "operation": "Update",
                                      "serialNumber": this.getSerialNuberByAssemblyCode(action.config.taskPanelData.assemblyCode)
                                    }]
                                  },
                                  "ecoCodeChangeList": {
                                    "ecoCodeChange": [{
                                      "ecoCode": pid + "--" + action.config.taskPanelData.defect,
                                      "operation": "Update"
                                    }]
                                  },
                                  "bcn": "#UnitInfo.ITEM_BCN"
                                },
                                "userPwd": {
                                  "username": "#loginUUID.username",
                                  "password": "#loginUUID.password"
                                },
                                "operationTypes": "ProcessImmediate",
                                "ip": "::1",
                                "callSource": "FrontEnd",
                                "apiUsage_LocationName": "#UnitInfo.GEONAME",
                                "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                              },
                              "toBeStringified": true
                            },
                            "responseDependents": {
                              "onSuccess": {
                                "actions": [{
                                  "type": "microservice",
                                  "config": {
                                    "microserviceId": "performIssueParts",
                                    "requestMethod": "post",
                                    "isLocal": false,
                                    "LocalService": "assets/Responses/getHPFAHistory.json",
                                    "body": {
                                      "issuePartsRequest": {
                                        "bcn": "#UnitInfo.ITEM_BCN",
                                        "actionCodeChange": {
                                          "operation": "Add",
                                          "actionCode": action.config.taskPanelData.isTncECO == "true" ? "OPEN-FIT" : "OPEN-REPLACE",
                                          "ecoCode": {
                                            "value": pid + "--" + action.config.taskPanelData.defect
                                          }
                                        },
                                        "nonInventoryPartList": {
                                          "nonInventoryPart": this._returnNonInventoryList(action, debugFlexFieldsData)
                                        }
                                      },
                                      "userPwd": {
                                        "username": "#userAccountInfo.PersonalDetails.USERID",
                                        "password": "#loginUUID.password"
                                      },
                                      "ip": "::1",
                                      "callSource": "FrontEnd",
                                      "apiUsage_LocationName": "#UnitInfo.GEONAME",
                                      "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                                    },
                                    "toBeStringified": true
                                  },
                                  "eventSource": "click",
                                  "responseDependents": {
                                    "onSuccess": {
                                      "actions": this.configActionsAfterTransactions(action)
                                    },
                                    "onFailure": {
                                      "actions": [{
                                        "type": "context",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": "errorissuePart",
                                          "data": "responseData"
                                        }
                                      },
                                      {
                                        "type": "condition",
                                        "config": {
                                          "operation": "isEqualTo",
                                          "lhs": "#errorissuePart",
                                          "rhs": "No Record Found"
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "errorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "#errorissuePart",
                                                    "isShown": false
                                                  }
                                                }
                                              }
                                            ]
                                          },
                                          "onFailure": {
                                            "actions": [
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "errorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "#errorissuePart",
                                                    "isShown": true
                                                  }
                                                }
                                              }
                                            ]
                                          }
                                        }
                                      }
                                      ]
                                    }
                                  }
                                }]
                              },
                              "onFailure": {
                                "actions": [{
                                  "type": "context",
                                  "config": {
                                    "requestMethod": "add",
                                    "key": "performFAError",
                                    "data": "responseData"
                                  }
                                },
                                {
                                  "type": "condition",
                                  "config": {
                                    "operation": "isEqualTo",
                                    "lhs": "#performFAError",
                                    "rhs": "No Record Found"
                                  },
                                  "responseDependents": {
                                    "onSuccess": {
                                      "actions": [
                                        {
                                          "type": "updateComponent",
                                          "config": {
                                            "key": "errorTitleUUID",
                                            "properties": {
                                              "titleValue": "#performFAError",
                                              "isShown": false
                                            }
                                          }
                                        }
                                      ]
                                    },
                                    "onFailure": {
                                      "actions": [
                                        {
                                          "type": "updateComponent",
                                          "config": {
                                            "key": "errorTitleUUID",
                                            "properties": {
                                              "titleValue": "#performFAError",
                                              "isShown": true
                                            }
                                          }
                                        }
                                      ]
                                    }
                                  }
                                }
                                ]
                              }
                            }
                          }
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "microservice",
                            "eventSource": "click",
                            "config": {
                              "microserviceId": "performFA",
                              "requestMethod": "post",
                              "body": {
                                "updateFailureAnalysisRequest": {
                                  "actionCodeChangeList": {
                                    "actionCodeChange": [{
                                      "actionCode": action.config.taskPanelData.isTncECO == "true" ? "OPEN-FIT" : "OPEN-REPLACE",
                                      "operation": "#defectOperation.actionCode",
                                      "assemblyCode": {
                                        "value": action.config.taskPanelData.assemblyCode
                                      },
                                      "ecoCode": {
                                        "value": pid + "--" + action.config.taskPanelData.defect
                                      }
                                    }]
                                  },
                                  "assemblyCodeChangeList": {
                                    "assemblyCodeChange": [{
                                      "assemblyCode": action.config.taskPanelData.assemblyCode,
                                      "operation": "Update",
                                      "serialNumber": this.getSerialNuberByAssemblyCode(action.config.taskPanelData.assemblyCode)
                                    }]
                                  },
                                  "ecoCodeChangeList": {
                                    "ecoCodeChange": [{
                                      "ecoCode": pid + "--" + action.config.taskPanelData.defect,
                                      "operation": "Update"
                                    }]
                                  },
                                  "bcn": "#UnitInfo.ITEM_BCN"
                                },
                                "userPwd": {
                                  "username": "#loginUUID.username",
                                  "password": "#loginUUID.password"
                                },
                                "operationTypes": "ProcessImmediate",
                                "ip": "::1",
                                "callSource": "FrontEnd",
                                "apiUsage_LocationName": "#UnitInfo.GEONAME",
                                "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                              },
                              "toBeStringified": true
                            },
                            "responseDependents": {
                              "onSuccess": {
                                "actions": [{
                                  "type": "microservice",
                                  "config": {
                                    "microserviceId": "performRemoveParts",
                                    "requestMethod": "post",
                                    "isLocal": false,
                                    "LocalService": "assets/Responses/getHPFAHistory.json",
                                    "body": {
                                      "removePartsRequest": {
                                        "bcn": "#UnitInfo.ITEM_BCN",
                                        "actionCodeChange": {
                                          "operation": "Add",
                                          "actionCode": action.config.taskPanelData.isTncECO == "true" ? "OPEN-FIT" : "OPEN-REPLACE",
                                          "ecoCode": {
                                            "value": pid + "--" + action.config.taskPanelData.defect
                                          }
                                        },
                                        "nonInventoryPartList": {
                                          "nonInventoryPart": this._returnNonInventoryList(action, debugFlexFieldsData)
                                        }
                                      },
                                      "userPwd": {
                                        "username": "#userAccountInfo.PersonalDetails.USERID",
                                        "password": "#loginUUID.password"
                                      },
                                      "ip": "::1",
                                      "callSource": "FrontEnd",
                                      "apiUsage_LocationName": "#UnitInfo.GEONAME",
                                      "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                                    },
                                    "toBeStringified": true
                                  },
                                  "eventSource": "click",
                                  "responseDependents": {
                                    "onSuccess": {
                                      "actions": [{
                                        "type": "microservice",
                                        "config": {
                                          "microserviceId": "performIssueParts",
                                          "requestMethod": "post",
                                          "isLocal": false,
                                          "LocalService": "assets/Responses/getHPFAHistory.json",
                                          "body": {
                                            "issuePartsRequest": {
                                              "bcn": "#UnitInfo.ITEM_BCN",
                                              "actionCodeChange": {
                                                "operation": "Add",
                                                "actionCode": action.config.taskPanelData.isTncECO == "true" ? "OPEN-FIT" : "OPEN-REPLACE",
                                                "ecoCode": {
                                                  "value": pid + "--" + action.config.taskPanelData.defect
                                                }
                                              },
                                              "nonInventoryPartList": {
                                                "nonInventoryPart": this._returnNonInventoryList(action, debugFlexFieldsData)
                                              }
                                            },
                                            "userPwd": {
                                              "username": "#userAccountInfo.PersonalDetails.USERID",
                                              "password": "#loginUUID.password"
                                            },
                                            "ip": "::1",
                                            "callSource": "FrontEnd",
                                            "apiUsage_LocationName": "#UnitInfo.GEONAME",
                                            "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                                          },
                                          "toBeStringified": true
                                        },
                                        "eventSource": "click",
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": this.configActionsAfterTransactions(action)
                                          },
                                          "onFailure": {
                                            "actions": [{
                                              "type": "context",
                                              "config": {
                                                "requestMethod": "add",
                                                "key": "errorissuePart",
                                                "data": "responseData"
                                              }
                                            },
                                            {
                                              "type": "condition",
                                              "config": {
                                                "operation": "isEqualTo",
                                                "lhs": "#errorissuePart",
                                                "rhs": "No Record Found"
                                              },
                                              "responseDependents": {
                                                "onSuccess": {
                                                  "actions": [
                                                    {
                                                      "type": "updateComponent",
                                                      "config": {
                                                        "key": "errorTitleUUID",
                                                        "properties": {
                                                          "titleValue": "#errorissuePart",
                                                          "isShown": false
                                                        }
                                                      }
                                                    }
                                                  ]
                                                },
                                                "onFailure": {
                                                  "actions": [
                                                    {
                                                      "type": "updateComponent",
                                                      "config": {
                                                        "key": "errorTitleUUID",
                                                        "properties": {
                                                          "titleValue": "#errorissuePart",
                                                          "isShown": true
                                                        }
                                                      }
                                                    }
                                                  ]
                                                }
                                              }
                                            }
                                            ]
                                          }
                                        }
                                      }]
                                    },
                                    "onFailure": {
                                      "actions": [{
                                        "type": "context",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": "errorissuePart",
                                          "data": "responseData"
                                        }
                                      },
                                      {
                                        "type": "condition",
                                        "config": {
                                          "operation": "isEqualTo",
                                          "lhs": "#errorissuePart",
                                          "rhs": "No Record Found"
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "errorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "#errorissuePart",
                                                    "isShown": false
                                                  }
                                                }
                                              }
                                            ]
                                          },
                                          "onFailure": {
                                            "actions": [
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "errorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "#errorissuePart",
                                                    "isShown": true
                                                  }
                                                }
                                              }
                                            ]
                                          }
                                        }
                                      }
                                      ]
                                    }
                                  }
                                }]
                              },
                              "onFailure": {
                                "actions": [{
                                  "type": "context",
                                  "config": {
                                    "requestMethod": "add",
                                    "key": "performFAError",
                                    "data": "responseData"
                                  }
                                },
                                {
                                  "type": "condition",
                                  "config": {
                                    "operation": "isEqualTo",
                                    "lhs": "#performFAError",
                                    "rhs": "No Record Found"
                                  },
                                  "responseDependents": {
                                    "onSuccess": {
                                      "actions": [
                                        {
                                          "type": "updateComponent",
                                          "config": {
                                            "key": "errorTitleUUID",
                                            "properties": {
                                              "titleValue": "#performFAError",
                                              "isShown": false
                                            }
                                          }
                                        }
                                      ]
                                    },
                                    "onFailure": {
                                      "actions": [
                                        {
                                          "type": "updateComponent",
                                          "config": {
                                            "key": "errorTitleUUID",
                                            "properties": {
                                              "titleValue": "#performFAError",
                                              "isShown": true
                                            }
                                          }
                                        }
                                      ]
                                    }
                                  }
                                }
                                ]
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            }
          }
        );
      }
    }
    else {
      actions.push(
        {
          "type": "updateComponent",
          "config": {
            "key": "#@",
            "properties": {
              "expanded": false,
              "disabled": false,
              "header": {
                "title": "Check Damage",
                "svgIcon": "description",
                "statusIcon": "check_circle",
                "statusClass": "complete-status",
                "iconClass": "complete-task",
                "headerclass": "replaceheaderclass"
              }
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "createdTaskCompleteButtonUUID#@",
            "properties": {
              "disabled": true,
            }
          },
          "eventSource": "click"
        }
      )
    }
    return actions;
  }

  /**
   * Non ECO and Non Repair tasks
   * When the task panel is created initially, these actions will
   * be added to the complete button actions if it is not ECO type
   * or sytem repair types tasks coming from previous WC.
   */
  _onClickOfTaskComplete(action: any, debugFlexFieldsData) {
    let actions = [];
    let existDefectCode = {
      "type": "executetcDefectOperation",
      "config": {
        "defectCurrentCode": action.config.taskPanelData.defect,
        "currentActionCode": "OPEN-" + action.config.processType.toUpperCase(),
        "defectRecords": "#getConfigDebugDefectRecords",
        "defectList": "getConfigDebugDefectRecords",
        "configDebugWLData": "#configDebugWLTasksRes",
        "key": "defectOperation"
      },
      "eventSource": "click"
    };
    actions.push(existDefectCode);
    console.log("aa", action.config.processType)
    if (action.config.processType.toUpperCase() === "FIT" || action.config.processType.toUpperCase() === "RESOLDER") {
      let locText = action.config.taskPanelData.part + " , " + action.config.taskPanelData.location
      actions.push({
        "type": "microservice",
        "eventSource": "click",
        "config": {
          "microserviceId": "performFA",
          "requestMethod": "post",
          "body": {
            "updateFailureAnalysisRequest": {
              "actionCodeChangeList": {
                "actionCodeChange": [{
                  "actionCode": "OPEN-" + action.config.processType.toUpperCase(),
                  "operation": "#defectOperation.actionCode",
                  "assemblyCode": {
                    "value": action.config.taskPanelData.assemblyCode
                  },
                  "defectCode": {
                    "value": action.config.taskPanelData.defect
                  }
                }]
              },
              "assemblyCodeChangeList": {
                "assemblyCodeChange": [{
                  "assemblyCode": action.config.taskPanelData.assemblyCode,
                  "operation": "Update",
                  "serialNumber": this.getSerialNuberByAssemblyCode(action.config.taskPanelData.assemblyCode)
                }]
              },
              "defectCodeChangeList": {
                "defectCodeChange": [{
                  "defectCode": action.config.taskPanelData.defect,
                  "operation": "#defectOperation.defectCode"
                }]
              },
              "bcn": "#UnitInfo.ITEM_BCN"
            },
            "userPwd": {
              "username": "#loginUUID.username",
              "password": "#loginUUID.password"
            },
            "operationTypes": "ProcessImmediate",
            "ip": "::1",
            "callSource": "FrontEnd",
            "apiUsage_LocationName": "#UnitInfo.GEONAME",
            "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
          },
          "toBeStringified": true
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "microservice",
                "config": {
                  "microserviceId": "performIssueParts",
                  "requestMethod": "post",
                  "isLocal": false,
                  "LocalService": "assets/Responses/getHPFAHistory.json",
                  "body": {
                    "issuePartsRequest": {
                      "bcn": "#UnitInfo.ITEM_BCN",
                      "actionCodeChange": {
                        "operation": "Add",
                        "actionCode": "OPEN-" + action.config.processType.toUpperCase(),
                        "defectCode": {
                          "value": action.config.taskPanelData.defect
                        }
                      },
                      "nonInventoryPartList": {
                        "nonInventoryPart": this._returnNonInventoryList(action, debugFlexFieldsData)
                      }
                    },
                    "userPwd": {
                      "username": "#userAccountInfo.PersonalDetails.USERID",
                      "password": "#loginUUID.password"
                    },
                    "ip": "::1",
                    "callSource": "FrontEnd",
                    "apiUsage_LocationName": "#UnitInfo.GEONAME",
                    "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                  },
                  "toBeStringified": true
                },
                "eventSource": "click",
                "responseDependents": {
                  "onSuccess": {
                    "actions": this.configActionsAfterTransactions(action)
                  },
                  "onFailure": {
                    "actions": [{
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "errorissuePart",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "condition",
                      "config": {
                        "operation": "isEqualTo",
                        "lhs": "#errorissuePart",
                        "rhs": "No Record Found"
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "errorTitleUUID",
                                "properties": {
                                  "titleValue": "#errorissuePart",
                                  "isShown": false
                                }
                              }
                            }
                          ]
                        },
                        "onFailure": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "errorTitleUUID",
                                "properties": {
                                  "titleValue": "#errorissuePart",
                                  "isShown": true
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                    ]
                  }
                }
              }]
          },
          "onFailure": {
            "actions": [{
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "errorissuePart",
                "data": "responseData"
              }
            },
            {
              "type": "condition",
              "config": {
                "operation": "isEqualTo",
                "lhs": "#errorissuePart",
                "rhs": "No Record Found"
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "errorTitleUUID",
                        "properties": {
                          "titleValue": "#errorissuePart",
                          "isShown": false
                        }
                      }
                    }
                  ]
                },
                "onFailure": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "errorTitleUUID",
                        "properties": {
                          "titleValue": "#errorissuePart",
                          "isShown": true
                        }
                      }
                    }
                  ]
                }
              }
            }
            ]
          }
        }
      });
    }
    else if (action.config.processType.toUpperCase() === "REMOVE") {
      let locText = action.config.taskPanelData.part + " , " + action.config.taskPanelData.location
      actions.push({
        "type": "microservice",
        "eventSource": "click",
        "config": {
          "microserviceId": "performFA",
          "requestMethod": "post",
          "body": {
            "updateFailureAnalysisRequest": {
              "actionCodeChangeList": {
                "actionCodeChange": [{
                  "actionCode": "OPEN-" + action.config.processType.toUpperCase(),
                  "operation": "#defectOperation.actionCode",
                  "assemblyCode": {
                    "value": action.config.taskPanelData.assemblyCode
                  },
                  "defectCode": {
                    "value": action.config.taskPanelData.defect
                  }
                }]
              },
              "assemblyCodeChangeList": {
                "assemblyCodeChange": [{
                  "assemblyCode": action.config.taskPanelData.assemblyCode,
                  "operation": "Update",
                  "serialNumber": this.getSerialNuberByAssemblyCode(action.config.taskPanelData.assemblyCode)
                }]
              },
              "defectCodeChangeList": {
                "defectCodeChange": [{
                  "defectCode": action.config.taskPanelData.defect,
                  "operation": "#defectOperation.defectCode"
                }]
              },
              "bcn": "#UnitInfo.ITEM_BCN"
            },
            "userPwd": {
              "username": "#loginUUID.username",
              "password": "#loginUUID.password"
            },
            "operationTypes": "ProcessImmediate",
            "ip": "::1",
            "callSource": "FrontEnd",
            "apiUsage_LocationName": "#UnitInfo.GEONAME",
            "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
          },
          "toBeStringified": true
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [{
              "type": "microservice",
              "config": {
                "microserviceId": "performRemoveParts",
                "requestMethod": "post",
                "isLocal": false,
                "LocalService": "assets/Responses/getHPFAHistory.json",
                "body": {
                  "removePartsRequest": {
                    "bcn": "#UnitInfo.ITEM_BCN",
                    "actionCodeChange": {
                      "operation": "Add",
                      "actionCode": "OPEN-" + action.config.processType.toUpperCase(),
                      "defectCode": {
                        "value": action.config.taskPanelData.defect
                      }
                    },
                    "nonInventoryPartList": {
                      "nonInventoryPart": this._returnNonInventoryList(action, debugFlexFieldsData)
                    }
                  },
                  "userPwd": {
                    "username": "#userAccountInfo.PersonalDetails.USERID",
                    "password": "#loginUUID.password"
                  },
                  "ip": "::1",
                  "callSource": "FrontEnd",
                  "apiUsage_LocationName": "#UnitInfo.GEONAME",
                  "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                },
                "toBeStringified": true
              },
              "eventSource": "click",
              "responseDependents": {
                "onSuccess": {
                  "actions": this.configActionsAfterTransactions(action)
                },
                "onFailure": {
                  "actions": [{
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "errorissuePart",
                      "data": "responseData"
                    }
                  },
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isEqualTo",
                      "lhs": "#errorissuePart",
                      "rhs": "No Record Found"
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorissuePart",
                                "isShown": false
                              }
                            }
                          }
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorissuePart",
                                "isShown": true
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                  ]
                }
              }
            }]
          },
          "onFailure": {
            "actions": [{
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "performFAError",
                "data": "responseData"
              }
            },
            {
              "type": "condition",
              "config": {
                "operation": "isEqualTo",
                "lhs": "#performFAError",
                "rhs": "No Record Found"
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "errorTitleUUID",
                        "properties": {
                          "titleValue": "#performFAError",
                          "isShown": false
                        }
                      }
                    }
                  ]
                },
                "onFailure": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "errorTitleUUID",
                        "properties": {
                          "titleValue": "#performFAError",
                          "isShown": true
                        }
                      }
                    }
                  ]
                }
              }
            }
            ]
          }
        }
      });
    }
    else {
      let locText = action.config.taskPanelData.part + " , " + action.config.taskPanelData.location
      actions.push({
        "type": "microservice",
        "eventSource": "click",
        "config": {
          "microserviceId": "performFA",
          "requestMethod": "post",
          "body": {
            "updateFailureAnalysisRequest": {
              "actionCodeChangeList": {
                "actionCodeChange": [{
                  "actionCode": "OPEN-" + action.config.processType.toUpperCase(),
                  "operation": "#defectOperation.actionCode",
                  "assemblyCode": {
                    "value": action.config.taskPanelData.assemblyCode
                  },
                  "defectCode": {
                    "value": action.config.taskPanelData.defect
                  }
                }]
              },
              "assemblyCodeChangeList": {
                "assemblyCodeChange": [{
                  "assemblyCode": action.config.taskPanelData.assemblyCode,
                  "operation": "Update",
                  "serialNumber": this.getSerialNuberByAssemblyCode(action.config.taskPanelData.assemblyCode)
                }]
              },
              "defectCodeChangeList": {
                "defectCodeChange": [{
                  "defectCode": action.config.taskPanelData.defect,
                  "operation": "#defectOperation.defectCode"
                }]
              },
              "bcn": "#UnitInfo.ITEM_BCN"
            },
            "userPwd": {
              "username": "#loginUUID.username",
              "password": "#loginUUID.password"
            },
            "operationTypes": "ProcessImmediate",
            "ip": "::1",
            "callSource": "FrontEnd",
            "apiUsage_LocationName": "#UnitInfo.GEONAME",
            "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
          },
          "toBeStringified": true
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [{
              "type": "microservice",
              "config": {
                "microserviceId": "performRemoveParts",
                "requestMethod": "post",
                "isLocal": false,
                "LocalService": "assets/Responses/getHPFAHistory.json",
                "body": {
                  "removePartsRequest": {
                    "bcn": "#UnitInfo.ITEM_BCN",
                    "actionCodeChange": {
                      "operation": "Add",
                      "actionCode": "OPEN-" + action.config.processType.toUpperCase(),
                      "defectCode": {
                        "value": action.config.taskPanelData.defect
                      }
                    },
                    "nonInventoryPartList": {
                      "nonInventoryPart": this._returnNonInventoryList(action, debugFlexFieldsData)
                    }
                  },
                  "userPwd": {
                    "username": "#userAccountInfo.PersonalDetails.USERID",
                    "password": "#loginUUID.password"
                  },
                  "ip": "::1",
                  "callSource": "FrontEnd",
                  "apiUsage_LocationName": "#UnitInfo.GEONAME",
                  "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                },
                "toBeStringified": true
              },
              "eventSource": "click",
              "responseDependents": {
                "onSuccess": {
                  "actions": [{
                    "type": "microservice",
                    "config": {
                      "microserviceId": "performIssueParts",
                      "requestMethod": "post",
                      "isLocal": false,
                      "LocalService": "assets/Responses/getHPFAHistory.json",
                      "body": {
                        "issuePartsRequest": {
                          "bcn": "#UnitInfo.ITEM_BCN",
                          "actionCodeChange": {
                            "operation": "Add",
                            "actionCode": "OPEN-" + action.config.processType.toUpperCase(),
                            "defectCode": {
                              "value": action.config.taskPanelData.defect
                            }
                          },
                          "nonInventoryPartList": {
                            "nonInventoryPart": this._returnNonInventoryList(action, debugFlexFieldsData)
                          }
                        },
                        "userPwd": {
                          "username": "#userAccountInfo.PersonalDetails.USERID",
                          "password": "#loginUUID.password"
                        },
                        "ip": "::1",
                        "callSource": "FrontEnd",
                        "apiUsage_LocationName": "#UnitInfo.GEONAME",
                        "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                      },
                      "toBeStringified": true
                    },
                    "eventSource": "click",
                    "responseDependents": {
                      "onSuccess": {
                        "actions": this.configActionsAfterTransactions(action)
                      },
                      "onFailure": {
                        "actions": [{
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "errorissuePart",
                            "data": "responseData"
                          }
                        },
                        {
                          "type": "condition",
                          "config": {
                            "operation": "isEqualTo",
                            "lhs": "#errorissuePart",
                            "rhs": "No Record Found"
                          },
                          "responseDependents": {
                            "onSuccess": {
                              "actions": [
                                {
                                  "type": "updateComponent",
                                  "config": {
                                    "key": "errorTitleUUID",
                                    "properties": {
                                      "titleValue": "#errorissuePart",
                                      "isShown": false
                                    }
                                  }
                                }
                              ]
                            },
                            "onFailure": {
                              "actions": [
                                {
                                  "type": "updateComponent",
                                  "config": {
                                    "key": "errorTitleUUID",
                                    "properties": {
                                      "titleValue": "#errorissuePart",
                                      "isShown": true
                                    }
                                  }
                                }
                              ]
                            }
                          }
                        }
                        ]
                      }
                    }
                  }]
                },
                "onFailure": {
                  "actions": [{
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "errorissuePart",
                      "data": "responseData"
                    }
                  },
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isEqualTo",
                      "lhs": "#errorissuePart",
                      "rhs": "No Record Found"
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorissuePart",
                                "isShown": false
                              }
                            }
                          }
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorissuePart",
                                "isShown": true
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                  ]
                }
              }
            }]
          },
          "onFailure": {
            "actions": [{
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "performFAError",
                "data": "responseData"
              }
            },
            {
              "type": "condition",
              "config": {
                "operation": "isEqualTo",
                "lhs": "#performFAError",
                "rhs": "No Record Found"
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "errorTitleUUID",
                        "properties": {
                          "titleValue": "#performFAError",
                          "isShown": false
                        }
                      }
                    }
                  ]
                },
                "onFailure": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "errorTitleUUID",
                        "properties": {
                          "titleValue": "#performFAError",
                          "isShown": true
                        }
                      }
                    }
                  ]
                }
              }
            }
            ]
          }
        }
      });
    }

    return actions;
  }

  _returnNonInventoryList(action: any, debugFlexFieldsData: any) {
    let nonInventoryList = [];
    if (typeof (action.config.taskPanelData.location) == "string" && action.config.taskPanelData.location.includes(",")) {
      action.config.taskPanelData.location = action.config.taskPanelData.location.split(",")
    }
    if (Array.isArray(action.config.taskPanelData.location)) {
      action.config.taskPanelData.location && action.config.taskPanelData.location.forEach((currentLocation) => {
        nonInventoryList.push({
          "part": action.config.taskPanelData.compPartno,
          "quantity": 1,
          "componentLocationDescription": currentLocation,
          "flexFieldList": {
            "flexField": debugFlexFieldsData
          }
        });
      })
    }
    else {
      nonInventoryList.push({
        "part": action.config.taskPanelData.compPartno,
        "quantity": 1,
        "componentLocationDescription": action.config.taskPanelData.location,
        "flexFieldList": {
          "flexField": debugFlexFieldsData
        }
      });
    }

    return nonInventoryList
  }

  _getItemsBasedOnProcess(action: any, instance: any, actionService: any, isDisable) {
    let items = [];

    if (isDisable !== undefined) {
      isDisable = isDisable;
    } else {
      isDisable = false;
    }

    if (action.config.processType !== undefined && action.config.processType === "scrap") {
      items = [
        {
          "ctype": "nativeDropdown",
          "uuid": "ConfigDebugScrapUUID",
          "hooks": [
            {
              "type": "microservice",
              "hookType": "afterInit",
              "config": {
                "microserviceId": "getCiscoDebugPartOrOutComes",
                "requestMethod": "get",
                "params": {
                  "itemId": "#UnitInfo.ITEM_ID",
                  "outComeCodeType": "FLR",
                  "userName": "#loginUUID.username"
                }
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "configDebugScrapRes",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "ConfigDebugScrapUUID",
                        "dropDownProperties": {
                          "options": "#configDebugScrapRes"
                        }
                      }
                    }
                  ]
                },
                "onFailure": {
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "errorDisp",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "condition",
                      "config": {
                        "operation": "isEqualTo",
                        "lhs": "#errorDisp",
                        "rhs": "No Record Found"
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "errorTitleUUID",
                                "properties": {
                                  "titleValue": "#errorDisp",
                                  "isShown": false
                                }
                              }
                            }
                          ]
                        },
                        "onFailure": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "errorTitleUUID",
                                "properties": {
                                  "titleValue": "#errorDisp",
                                  "isShown": true
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          ],
          "submitable": true,
          "visibility": true,
          "required": true,
          "label": "Scrap",
          "disabled": isDisable,
          "labelPosition": "left",
          "name": action.config.processType + "Scrap",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "dropdownClass": "dropdown-container textfield-container",
          "labelClass": "subtitle1-align-self greyish-black",
          "code": "outComeCodeId",
          "displayValue": "outComeCodeId_Desc",
          "dataSource": "#configDebugScrapRes",
          "actions": [
            {
              "type": "updateComponent",
              "eventSource": "change",
              "config": {
                "key": "errorTitleUUID",
                "properties": {
                  "titleValue": "",
                  "isShown": false
                }
              }
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "configDebug" + action.config.processType + "Scrap",
                "data": "elementControlValue"
              },
              "eventSource": "change"
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "configDebug" + action.config.processType + "ScrapName",
                "data": "elementControlName"
              },
              "eventSource": "change"
            }
          ]
        }
      ];
    } else {
      items = [
        {
          "ctype": "nativeDropdown",
          "uuid": "ConfigDebugSubAssmUUID",
          "hooks": [
            {
              "hookType": "afterInit",
              "type": "updateComponent",
              "config": {
                "key": "ConfigDebugSubAssmUUID",
                "dropDownProperties": {
                  "options": "#configDebugRecAssemRes"
                }
              }
            }
          ],
          "submitable": true,
          "visibility": true,
          "required": true,
          "disabled": isDisable,
          "label": "Sub Assm",
          "labelPosition": "left",
          "name": action.config.processType + "SubAssem",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "dropdownClass": "dropdown-container textfield-container",
          "labelClass": "subtitle1-align-self greyish-black",
          "code": "assemblyCode",
          "displayValue": "compPartNo",
          "dataSource": "#configDebugSubAssmRes",
          "actions": [
            {
              "type": "updateComponent",
              "eventSource": "change",
              "config": {
                "key": "errorTitleUUID",
                "properties": {
                  "titleValue": "",
                  "isShown": false
                }
              }
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "configDebug" + action.config.processType + "SubAssm",
                "data": "elementControlValue"
              },
              "eventSource": "change"
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "configDebug" + action.config.processType + "SubAssmName",
                "data": "elementControlName"
              },
              "eventSource": "change"
            },
            {
              "type": "microservice",
              "eventSource": "change",
              "config": {
                "microserviceId": "getCompLocationsAndParts",
                "isLocal": false,
                "LocalService": "assets/Responses/ciscoTaskPanelDataResponse.json",
                "requestMethod": "get",
                "params": {
                  "locationId": "#userSelectedLocation",
                  "clientId": "#userSelectedClient",
                  "contractId": "#userSelectedContract",
                  "orderProcessTypeCode": "WRP",
                  "selectedSubassm": "#configDebug" + action.config.processType + "SubAssmName",
                  "workCenterId": "#UnitInfo.WORKCENTER_ID"
                }
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "configDebugCompLocationsAndPartsRes",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "ConfigDebugLocationUUID",
                        "dropDownProperties": {
                          "options": "#configDebugCompLocationsAndPartsRes",
                          "isMultiSelect": true
                        }
                      }
                    }
                  ]
                },
                "onFailure": {
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "errorDisp",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "condition",
                      "config": {
                        "operation": "isEqualTo",
                        "lhs": "#errorDisp",
                        "rhs": "No Record Found"
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "errorTitleUUID",
                                "properties": {
                                  "titleValue": "#errorDisp",
                                  "isShown": false
                                }
                              }
                            }
                          ]
                        },
                        "onFailure": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "errorTitleUUID",
                                "properties": {
                                  "titleValue": "#errorDisp",
                                  "isShown": true
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          "ctype": action.config.processType === "replace" ? "dropdownWithMultiSelect" : "nativeDropdown",
          "uuid": "ConfigDebugLocationUUID",
          "hooks": [],
          "submitable": true,
          "visibility": true,
          "required": true,
          "disabled": isDisable,
          "label": "Location",
          "labelPosition": "left",
          "name": action.config.processType + "Location",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "dropdownClass": "dropdown-container textfield-container",
          "labelClass": "subtitle1-align-self greyish-black",
          "chipClasses": "bg-dark text-white rounded",
          "optGrpFormFieldClass": "dropdownwithsearchselect mt-2 w-100",
          "chipCancelClasses": "text-white",
          "searchIconStyles": "font-size:18px",
          "code": "compLocation",
          "displayValue": "compLocation",
          "dataSource": "#configDebugCompLocationsAndPartsRes",
          "actions": [
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "configDebug" + action.config.processType + "Location",
                "data": "elementControlValue"
              },
              "eventSource": "change"
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "configDebug" + action.config.processType + "LocationName",
                "data": "elementControlName"
              },
              "eventSource": "change"
            },
            {
              "type": "configFilterPartsBasedOnLocations",
              "eventSource": "change",
              "config": {
                "processType": action.config.processType
              }
            },
            {
              "eventSource": "change",
              "type": "updateComponent",
              "config": {
                "key": "ConfigDebugPartUUID",
                "dropDownProperties": {
                  "options": "#filteredParts"
                }
              }
            },
            {
              "type": "condition",
              "eventSource": "change",
              "config": {
                "operation": "isEqualTo",
                "lhs": action.config.processType + "Part",
                "rhs": "replacePart"
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "eventSource": "change",
                      "config": {
                        "key": "ConfigDebugPartUUID",
                        "fieldProperties": {
                          "replacePart": "#filteredParts.0.compPartNo"
                        }
                      }
                    },
                    {
                      "type": "configSelectedPartActions",
                      "config": {
                        "processType": action.config.processType,
                        "value": "#filteredParts.0.compPartNo",
                        "controlName": "#filteredParts.0.compPartDesc" 
                      },
                      "eventSource": "change"
                    }
                  ]
                },
                "onFailure": {
                  "actions": [
                    {
                      "type": "condition",
                      "config": {
                        "operation": "isEqualTo",
                        "lhs": action.config.processType + "Part",
                        "rhs": "removePart"
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "eventSource": "change",
                              "config": {
                                "key": "ConfigDebugPartUUID",
                                "fieldProperties": {
                                  "removePart": "#filteredParts.0.compPartNo"
                                }
                              }
                            },
                            {
                              "type": "configSelectedPartActions",
                              "config": {
                                "processType": action.config.processType,
                                "value": "#filteredParts.0.compPartNo",
                                "controlName": "#filteredParts.0.compPartDesc" 
                              },
                              "eventSource": "change"
                            }
                          ]
                        },
                        "onFailure": {
                          "actions": [
                            {
                              "type": "condition",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": action.config.processType + "Part",
                                "rhs": "fitPart"
                              },
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "updateComponent",
                                      "eventSource": "change",
                                      "config": {
                                        "key": "ConfigDebugPartUUID",
                                        "fieldProperties": {
                                          "fitPart": "#filteredParts.0.compPartNo"
                                        }
                                      }
                                    },
                                    {
                                      "type": "configSelectedPartActions",
                                      "config": {
                                        "processType": action.config.processType,
                                        "value": "#filteredParts.0.compPartNo",
                                        "controlName": "#filteredParts.0.compPartDesc" 
                                      },
                                      "eventSource": "change"
                                    }
                                  ]
                                },
                                "onFailure": {
                                  "actions": [
                                    {
                                      "type": "updateComponent",
                                      "eventSource": "change",
                                      "config": {
                                        "key": "ConfigDebugPartUUID",
                                        "fieldProperties": {
                                          "resolderPart": "#filteredParts.0.compPartNo"
                                        }
                                      }
                                    },
                                    {
                                      "type": "configSelectedPartActions",
                                      "config": {
                                        "processType": action.config.processType,
                                        "value": "#filteredParts.0.compPartNo",
                                        "controlName": "#filteredParts.0.compPartDesc" 
                                      },
                                      "eventSource": "change"
                                    }
                                  ]
                                }
                              }
                            },
                          ]
                        }
                      }
                    },
                  ]
                }
              }
            },
            {
              "type": "configCheckLength",
              "config": {
                "processType": action.config.processType,
                "key": "#configDebug" + action.config.processType + "Location"
              },
              "eventSource": "change"
            },
            {
              "type": "condition",
              "config": {
                "operation": "isEqualTo",
                "lhs": action.config.processType,
                "rhs": "fit"
              },
              "eventSource": "click",
              "responseDependents": {
                "onSuccess": {
                  "actions": []
                },
                "onFailure": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": 'configQtyUUID',
                        "properties": {
                          "text": "#configDebug" + action.config.processType + "AvailableQuantity"
                        }
                      },
                      "eventSource": "change"
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          "ctype": "nativeDropdown",
          "uuid": "ConfigDebugPartUUID",
          "hooks": [
          ],
          "submitable": true,
          "visibility": true,
          "required": true,
          "disabled": isDisable,
          "label": "Part",
          "labelPosition": "left",
          "name": action.config.processType + "Part",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "dropdownClass": "dropdown-container textfield-container",
          "labelClass": "subtitle1-align-self greyish-black",
          "code": "compPartNo",
          "displayValue": "compPartDesc",
          "dataSource": "#filteredParts",
          "actions": [
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "configDebug" + action.config.processType + "Part",
                "data": "elementControlValue"
              },
              "eventSource": "change"
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "configDebug" + action.config.processType + "PartName",
                "data": "elementControlName"
              },
              "eventSource": "change"
            },
            {
              "type": "configSelectedPartActions",
              "config": {
                "processType": action.config.processType,
                "value": "#configDebug" + action.config.processType + "Part",
                "controlName": "#configDebug" + action.config.processType + "PartName" 
              },
              "eventSource": "change"
            }
          ]
        },
        {
          "ctype": "nativeDropdown",
          "uuid": "ConfigDebugDefectUUID",
          "hooks": [
            {
              "hookType": "afterInit",
              "type": "updateComponent",
              "config": {
                "key": "ConfigDebugDefectUUID",
                "dropDownProperties": {
                  "options": "#configDebugDefectCodesRes"
                }
              }
            }
          ],
          "submitable": true,
          "visibility": true,
          "required": true,
          "disabled": isDisable,
          "label": "Defect",
          "labelPosition": "left",
          "name": action.config.processType + "Defect",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "dropdownClass": "dropdown-container textfield-container",
          "labelClass": "subtitle1-align-self greyish-black",
          "code": "name",
          "displayValue": "name",
          "dataSource": "#configDebugDefectCodesRes",
          "actions": this._defectActions(action)
        },
        {
          "ctype": "nativeDropdown",
          "uuid": "ConfigDebugFAUUID",
          "hooks": [
            {
              "hookType": "afterInit",
              "type": "updateComponent",
              "config": {
                "key": "ConfigDebugFAUUID",
                "dropDownProperties": {
                  "options": "#configDebugFaFlexFieldsRes"
                }
              }
            }
          ],
          "submitable": true,
          "visibility": true,
          "required": true,
          "disabled": isDisable,
          "label": "FA",
          "labelPosition": "left",
          "name": action.config.processType + "FA",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "dropdownClass": "dropdown-container textfield-container",
          "labelClass": "subtitle1-align-self greyish-black",
          "code": "value",
          "displayValue": "value",
          "dataSource": "#configDebugFaFlexFieldsRes",
          "actions": [
            {
              "type": "updateComponent",
              "eventSource": "change",
              "config": {
                "key": "errorTitleUUID",
                "properties": {
                  "titleValue": "",
                  "isShown": false
                }
              }
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "configDebug" + action.config.processType + "FA",
                "data": "elementControlValue"
              },
              "eventSource": "change"
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "configDebug" + action.config.processType + "FAName",
                "data": "elementControlName"
              },
              "eventSource": "change"
            }
          ]
        }
      ];
    }
    return items;
  }

  configFilterPartsBasedOnLocations(action, instance, actionService) {
    let selectedLocation = this.contextService.getDataByString("#configDebug" + action.config.processType + "Location");
    let locationsRes = this.contextService.getDataByString("#configDebugCompLocationsAndPartsRes");
    let filteredParts = [];
    if (selectedLocation && Array.isArray(selectedLocation)) {
      selectedLocation && selectedLocation.forEach((item) => {
        locationsRes && locationsRes.forEach((currLocation) => {
          if (currLocation.compLocation === item) {
            filteredParts.push(currLocation);
          }
        })
      })
    } else {
      locationsRes && locationsRes.forEach((currLocation) => {
        if (currLocation.compLocation === selectedLocation) {
          filteredParts.push(currLocation);
        }
      })
    }

    let newArr = [];

    filteredParts && filteredParts.forEach((currentFileterItem, index) => {
      if (newArr.length > 0) {
        let list = [];
        for (let i = 0; i < newArr.length; i++) {
          if (newArr[i].compPartNo === currentFileterItem.compPartNo) {
            list.push(currentFileterItem);
            // console.log(list);
          }
        }
        if (list.length === 0) {
          newArr.push(currentFileterItem);
        }
      } else {
        newArr.push(currentFileterItem);
      }
    })

    this.contextService.addToContext('filteredParts', newArr);
  }

  _defectActions(action: any) {
    let actions = [];
    actions = [
      {
        "type": "updateComponent",
        "eventSource": "change",
        "config": {
          "key": "errorTitleUUID",
          "properties": {
            "titleValue": "",
            "isShown": false
          }
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "configDebug" + action.config.processType + "Defect",
          "data": "elementControlValue"
        },
        "eventSource": "change"
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "configDebug" + action.config.processType + "DefectName",
          "data": "elementControlName"
        },
        "eventSource": "change"
      }
    ];

    if (action.config.processType === "replace" || action.config.processType === "fit") {
      actions.push({
        "type": "updateComponent",
        "eventSource": "change",
        "config": {
          "key": "ConfigDebugFlexFieldRewINSTRUUID",
          "properties": {
            "flexClass": "show"
          }
        }
      },
        {
          "type": "updateComponent",
          "eventSource": "change",
          "config": {
            "key": "configDebugDesFlexUUID",
            "properties": {
              "flexClass": "show"
            }
          }
        }
      );
    }

    return actions;
  }
  configSelectedPartActions(action: any, instance, actionService) {
    let actions = [];
    actions = [
      {
        "type": "updateComponent",
        "eventSource": "change",
        "config": {
          "key": "errorTitleUUID",
          "properties": {
            "titleValue": "",
            "isShown": false
          }
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "configDebug" + action.config.processType + "Part",
          "data": action.config.value
        },
        "eventSource": "change"
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "configDebug" + action.config.processType + "PartName",
          "data": action.config.controlName
        },
        "eventSource": "change"
      },
      {
        "type": "condition",
        "config": {
          "operation": "isEqualTo",
          "lhs": action.config.processType,
          "rhs": "fit"
        },
        "eventSource": "click",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "updateComponent",
                "config": {
                  "key": 'configQtyUUID',
                  "properties": {
                    "text": "#configDebug" + action.config.processType + "AvailableQuantity"
                  }
                },
                "eventSource": "change"
              }
            ]
          },
          "onFailure": {
            "actions": []
          }
        }
      },
      {
        "type": "microservice",
        "eventSource": "change",
        "config": {
          "microserviceId": "getCiscoDebugAvailQty",
          "isLocal": false,
          "LocalService": "assets/Responses/ciscoTaskPanelDataResponse.json",
          "requestMethod": "get",
          "params": {
            "componentPartNo": "#configDebug" + action.config.processType + "PartName",
            "conditionId": "1,3",
            "locationId": "#userSelectedLocation",
            "wharehouseId": "#UnitInfo.WAREHOUSE_ID"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "configDebugAvailQtyRes",
                  "data": "responseData"
                }
              },
              {
                "type": "concatinateString",
                "config": {
                  "key": "configDebugAvailQtyRes",
                  "text1": "#configDebugAvailQtyRes",
                  "text2": "Available"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "configDebugStockQty",
                  "properties": {
                    "text": "#configDebugAvailQtyRes"
                  }
                }
              }
            ]
          },
          "onFailure": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "errorDisp",
                  "data": "responseData"
                }
              },
              {
                "type": "condition",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": "#errorDisp",
                  "rhs": "No Record Found"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "errorTitleUUID",
                          "properties": {
                            "titleValue": "#errorDisp",
                            "isShown": false
                          }
                        }
                      }
                    ]
                  },
                  "onFailure": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "errorTitleUUID",
                          "properties": {
                            "titleValue": "#errorDisp",
                            "isShown": true
                          }
                        }
                      }
                    ]
                  }
                }
              }
            ]
          }
        }
      }
    ];

    actions && actions.forEach((item) => {
      actionService.handleAction(item, instance);
    })

    let selectedPart = this.contextService.getDataByString("#configDebug" + action.config.processType + "PartName");
    // console.log(selectedP)
    if (selectedPart) {
      selectedPart = selectedPart.split("- ");
    } else {
      selectedPart = "";
    }
    this.contextService.addToContext("configDebug" + action.config.processType + "Description", selectedPart[selectedPart.length - 1]);

    actionService.handleAction({
      "type": "updateComponent",
      "eventSource": "change",
      "config": {
        "key": "configDebugDesLabelUUID#@",
        "properties": {
          "text": "#configDebug" + action.config.processType + "Description"
        }
      }
    }, instance);
    if (action.config.processType === "remove") {
      let removeActions = [{
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "configDebug" + action.config.processType + "AvailableQuantity",
          "data": "1"
        },
        "eventSource": "change"
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "configDebug" + action.config.processType + "AvailableQuantityName",
          "data": "elementControlName"
        },
        "eventSource": "change"
      },
      {
        "type": "setDefaultValue",
        "config": {
          "key": "ConfigDebugQtyUUID",
          "defaultValue": "1"
        }
      }
      ]
      removeActions && removeActions.forEach(currentAction => {
        actionService.handleAction(currentAction, instance);
      })
    }

  }
  configCheckLength(action) {
    let locations = this.contextService.getDataByString(action.config.key);
    this.contextService.addToContext("configDebug" + action.config.processType + "AvailableQuantity", action.config.processType === "replace" ? locations.length : 1);
  }

  _returnRightSideItems(action: any, instance: any, actionService: any, isNewPanel) {
    let rightSideItems = [];
    if (action.config.processType !== undefined &&
      (action.config.processType == "replace" ||
        action.config.processType == "remove" ||
        action.config.processType == "fit")) {

      if (action.config.processType === "replace" || action.config.processType === "fit") {
        let description = this._getDecription(action, instance, isNewPanel);
        let REW_INSTR = this._getREW_INSTR(action, instance, isNewPanel);
        rightSideItems.push(description);
        for (let currentKey in action.config.taskPanelData) {
          if (currentKey === "notes") {
            rightSideItems.push(REW_INSTR);
          }
        }
        if (isNewPanel) {
          rightSideItems.push(REW_INSTR);
        }
      }

      let qty;
      if (!isNewPanel) {
        qty = action.config.taskPanelData.qty;
      }



      if (action.config.processType === "replace" ||
        action.config.processType == "fit") {
        rightSideItems.push({
          // "ctype": "flexFields",
          // "uuid": "ciscoFailCodeTitleUUID",
          // "flexClass": "label-container-30-50",
          // "items": [
          //   {
          //     "ctype": "flexFields",
          //     "uuid": "ciscoFailCodeTitleUUID",
          //     "flexClass": "label-container-radio-group",

          //   },

          //   // ,
          //  {
          "ctype": "flexFields",
          "uuid": "configFailCodeTitleUUID",
          "flexClass": "label-container-radio-group-parent",
          "items": this._getDataForTable(action, actionService, qty, isNewPanel)
          // }
          // ],
          //   "items": [
          //   {
          //     "ctype": "label",
          //     "text": "Qty",
          //     "labelClass": "greyish-black subtitle1-align-self"
          //   },
          //   {
          //     "ctype": "label",
          //     "uuid": "ciscoQtyUUID",
          //     "text": quantity != null ? quantity.toString() : "0",
          //     "labelClass": "greyish-black"
          //   }
          // ]
        });
        // rightSideItems.push({
        //   "ctype": "flexFields",
        //   "uuid": "ciscoFailCodeTitleUUID",
        //   "flexClass": "label-container-30-50",
        //   "items": [
        //     {
        //       "ctype": "label",
        //       "text": "Available Qty",
        //       "labelClass": "greyish-black subtitle1-align-self"
        //     },
        //     {
        //       "ctype": "label",
        //       "uuid": "ciscoAvailQtyUUID",
        //       "text": "0",
        //       "labelClass": "greyish-black"
        //     }
        //   ]
        // });
      }

      if (action.config.processType === "remove") {
        let quantityDropDown = this._quantityDropdwon(action, instance, isNewPanel);
        rightSideItems.push(quantityDropDown);
      }

    }
    return rightSideItems;
  }

  concatinateString(action: any) {
    // console.log(action);
    let text = this.contextService.getDataByString(action.config.text1);
    text = text + " " + action.config.text2
    this.contextService.addToContext(action.config.key, text);
  }

  _quantityDropdwon(action: any, instance: any, isNewPanel: any) {
    let quantityDropDown;
    if (isNewPanel) {
      quantityDropDown = {
        "ctype": "nativeDropdown",
        "uuid": "ConfigDebugQtyUUID",
        "hooks": [
        ],
        "submitable": true,
        "visibility": true,
        "required": true,
        "disabled": true,
        "label": "Qty",
        "labelPosition": "left",
        "name": action.config.processType + "Qty",
        "formGroupClass": "form-group-margin",
        "dropdownClass": "dropdown-container textfield-container",
        "labelClass": "subtitle1-with-padding-50 greyish-black",
        "code": "qty",
        "displayValue": "qtyName",
        "dataSource": ["1"],
        "actions": [
          {
            "type": "updateComponent",
            "eventSource": "change",
            "config": {
              "key": "errorTitleUUID",
              "properties": {
                "titleValue": "",
                "isShown": false
              }
            }
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "configDebug" + action.config.processType + "AvailableQuantity",
              "data": "elementControlValue"
            },
            "eventSource": "change"
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "configDebug" + action.config.processType + "AvailableQuantityName",
              "data": "elementControlName"
            },
            "eventSource": "change"
          }
        ]
      };
    } else {
      let currentData = action.config.taskPanelData;
      for (let currentKey in currentData) {
        if (currentKey === "qty") {
          let data = currentData[currentKey];
          // if (data !== null &&
          //   data !== undefined &&
          //   data.startsWith('#')) {
          //   data = this.contextService.getDataByString(data);
          // }
          quantityDropDown = {
            "ctype": "flexFields",
            "uuid": "configFailCodeTitleUUID",
            "flexClass": "label-container-30-50",
            "items": [
              {
                "ctype": "label",
                "text": "Qty",
                "labelClass": "greyish-black subtitle1-align-self"
              },
              {
                "ctype": "label",
                "text": data,
                "labelClass": "greyish-black"
              }
            ]
          };
        }
      }

    }
    return quantityDropDown;
  }

  _getREW_INSTR(action: any, instance: any, isNewPanel: any) {
    let rewINSTR;
    if (isNewPanel) {
      rewINSTR = {
        "ctype": "flexFields",
        "uuid": "ConfigDebugFlexFieldRewINSTRUUID",
        "visibility": false,
        "flexClass": "label-container-30-50 hide",
        "items": [
          {
            "ctype": "label",
            "text": "REW_INSTR",
            "labelClass": "greyish-black subtitle1-align-self"
          },
          {
            "ctype": "textField",
            "uuid": "ConfigDebugRewINSTRUUID",
            "submitable": false,
            "disabled": false,
            "validations": [],
            "formGroupClass": "search-container",
            "textfieldClass": "rightside-search",
            "hooks": [],
            "actions": [
              {
                "eventSource": "blur",
                "type": "context",
                "config": {
                  "data": "elementControlValue",
                  "requestMethod": "add",
                  "key": "configDebug" + action.config.processType + "RewINSTR"
                }
              }
            ],
            "name": "configDebug" + action.config.processType + "RewINSTR",
            "label": "",
            "labelPosition": "",
            "tooltip": "",
            "TooltipPosition": "",
            "defaultValue": "",
            "readonly": false,
            "type": "text",
            "required": false,
            "placeholder": "",
            "value": "",
            "prefix": false,
            "prefixIcon": "",
            "suffix": false,
            "suffixIcon": ""
          }
        ]
      };
    } else {
      let currentData = action.config.taskPanelData;
      for (let currentKey in currentData) {
        if (currentKey === "notes") {
          let data = currentData[currentKey];
          // if (data !== null &&
          //   data !== undefined &&
          //   data.startsWith('#')) {
          //   data = this.contextService.getDataByString(data);
          // }
          rewINSTR = {
            "ctype": "flexFields",
            "uuid": "ciscoFailCodeTitleUUID",
            "flexClass": "label-container-30-50",
            "items": [
              {
                "ctype": "label",
                "text": "REW_INSTR",
                "labelClass": "greyish-black subtitle1-align-self"
              },
              {
                "ctype": "label",
                "text": data,
                "labelClass": "greyish-black"
              }
            ]
          };
        }
      }

    }
    return rewINSTR;
  }

  _getDecription(action: any, instance: any, isNewPanel: boolean) {
    let description;
    // if (isNewPanel) {
    //   description = {
    //     "ctype": "flexFields",
    //     "uuid": "ciscoDebugDesFlexUUID",
    //     "flexClass": "cisco-debug-label-container-30-50 hide",
    //     "hidden": false,
    //     "items": [
    //       {
    //         "ctype": "label",
    //         "text": "Description",
    //         "labelClass": "greyish-black subtitle1-align-self"
    //       },
    //       {
    //         "ctype": "textField",
    //         "uuid": "CiscoDebugDescriptionUUID",
    //         "submitable": false,
    //         "disabled": false,
    //         "visibility": true,
    //         "validations": [],
    //         "formGroupClass": "search-container",
    //         "textfieldClass": "rightside-search",
    //         "hooks": [],
    //         "actions": [
    //           {
    //             "eventSource": "input",
    //             "type": "context",
    //             "config": {
    //               "data": "elementControlValue",
    //               "requestMethod": "add",
    //               "key": "ciscoDebug" + action.config.processType + "Description"
    //             }
    //           }
    //         ],
    //         "name": "ciscoDebug" + action.config.processType + "Description",
    //         "label": "",
    //         "labelPosition": "",
    //         "tooltip": "",
    //         "TooltipPosition": "",
    //         "defaultValue": "",
    //         "readonly": false,
    //         "type": "text",
    //         "required": false,
    //         "placeholder": "",
    //         "value": "",
    //         "prefix": false,
    //         "prefixIcon": "",
    //         "suffix": false,
    //         "suffixIcon": ""
    //       }
    //     ]
    //   };
    // } else {
    let currentData = action.config.taskPanelData;
    let data;
    // console.log(currentData, action.config)
    if (currentData !== undefined) {
      for (let currentKey in currentData) {
        if (currentKey === "description") {
          data = currentData[currentKey];
        }
      }
    } else {
      data = "";
    }

    description = {
      "ctype": "flexFields",
      "uuid": isNewPanel ? "configDebugDesFlexUUID" : "configDebugDesFlexUUID#@",
      "flexClass": isNewPanel ? "cisco-debug-label-container-30-50 hide" : "cisco-debug-label-container-30-50",
      "items": [
        {
          "ctype": "label",
          "text": "Description",
          "labelClass": "greyish-black subtitle1-align-self"
        },
        {
          "ctype": "label",
          "uuid": "configDebugDesLabelUUID#@",
          "text": isNewPanel ? "" : data,
          "labelClass": "greyish-black"
        }
      ]
    };


    // }
    return description;
  }

  configdisableOrEnableAllIcons(action, instance, actionService) {
    let iconsList = [
      "configDebugReplaceIconUUID",
      "configDebugRemoveIconUUID",
      "configDebugFitIconUUID",
      "configDebugResolderIconUUID",
      "configDebugScrapIconUUID"
    ];

    iconsList && iconsList.forEach((currentIcon) => {
      if (action.config.currentProcess !== undefined &&
        !currentIcon.includes(action.config.currentProcess)) {
        if (action.config.isDisable !== undefined) {
          actionService.handleAction({
            "type": "updateComponent",
            "config": {
              "key": currentIcon,
              "properties": {
                "disabled": action.config.isDisable
              }
            }
          });
        }
      }
    });
  }

  _getDataForTable(action, actionService, qty, isNewPanel) {
    let tableSourceList = [];

    let items = [
      {
        "value": "Desk",
        "icon": "shopping_cart",
        "text": "Desk",
        "stock": "3"
      }
    ];

    items && items.forEach((item) => {
      tableSourceList.push({
        "ctype": "flexFields",
        "uuid": "ciscoQtyTableUUID#@",
        "flexClass": "label-container-radio-group-grid-3",
        "items": [
          {
            "ctype": "label",
            "text": "Source",
            "labelClass": "greyish-black"
          },
          {
            "ctype": "label",
            "text": "Qty",
            "labelClass": "greyish-black"
          },
          {
            "ctype": "label",
            "text": "Stock",
            "uuid": "stockUUID",
            "labelClass": "greyish-black"
          },
          {
            "ctype": "iconText",
            "uuid": "sourceIconUUID#@",
            "icon": item.icon,
            "text": item.text,
            "iconPosition": "after",
            "textClass": "body greyish-black",
            "inLine": true,
            "iconClass": "incomplete-status margin-bottom-5 header-icon"
          },
          {
            "ctype": "label",
            "uuid": isNewPanel ? "configQtyUUID" : "configQtyUUID#@",
            "text": qty != null ? qty.toString() : "0",
            "labelClass": "greyish-black"
          },
          {
            "ctype": "label",
            "uuid": isNewPanel ? "configDebugStockQty" : "configDebugStockQty#@",
            "text": "",
            "labelClass": "greyish-black cisco-stock"
          }
        ]
      });
    });

    return tableSourceList;
  }

  configActionsAfterTransactions(action: any, deleteEco?: boolean) {
    let actions = [];
    if (action.config.isLooperControlTask) {
      actions = [
        {
          "type": "updateComponent",
          "config": {
            "key": "#@",
            "properties": {
              "expanded": false,
              "disabled": false,
              "header": {
                "svgIcon": action.config.processType,
                "statusIcon": "check_circle",
                "statusClass": "complete-status",
                "iconClass": "complete-task",
                "headerclass": "replaceheaderclass"
              }
            }
          },
          "eventSource": "click"
        },
        {
          "type": "condition",
          "eventSource": "click",
          "config": {
            "operation": "isEqualTo",
            "lhs": action.config.taskPanelData.mandatory,
            "rhs": 1
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "createdTaskCompleteButtonUUID#@",
                    "properties": {
                      "disabled": false,
                    }
                  },
                  "eventSource": "click"
                },
              ]
            },
            "onFailure": {
              "actions": [
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "createdTaskCompleteButtonUUID#@",
                    "properties": {
                      "disabled": true,
                    }
                  },
                  "eventSource": "click"
                },
              ]
            }
          }
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "createdTaskDeleteButtonUUID#@",
            "properties": {
              "disabled": true,
            }
          },
          "eventSource": "click"
        },
        {
          "type": "microservice",
          "hookType": "afterInit",
          "config": {
            "microserviceId": "getCiscoDebugWishlistItems",
            "isLocal": false,
            "LocalService": "assets/Responses/ciscoTaskPanelDataResponse.json",
            "requestMethod": "get",
            "params": {
              "itemId": "#UnitInfo.ITEM_ID",
              "workCenterId": "#UnitInfo.WORKCENTER_ID"
            }
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "configDebugWLTasksRes",
                    "data": "responseData"
                  }
                },
                {
                  "type": "configAddOrRemoveItemFromWL",
                  "config": {
                    "taskPanelData": action.config.taskPanelData,
                    "data": "#configDebugWLTasksRes",
                    "deleteEco": deleteEco ? deleteEco : false
                  }
                },
                {
                  "type": "condition",
                  "config": {
                    "operation": "isEqualTo",
                    "lhs": "#configDebugWLTasksRes",
                    "rhs": null
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "errorTitleUUID",
                            "properties": {
                              "titleValue": "#errorDisp",
                              "isShown": false
                            }
                          }
                        },
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "configDebugWishListButtonUUID",
                            "properties": {
                              "text": "Wish List (0)"
                            }
                          }
                        }
                      ]
                    },
                    "onFailure": {
                      "actions": []
                    }
                  }
                }
              ]
            },
            "onFailure": {
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "errorDisp",
                    "data": "responseData"
                  }
                },
                {
                  "type": "condition",
                  "config": {
                    "operation": "isEqualTo",
                    "lhs": "#errorDisp",
                    "rhs": "No Record Found"
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "errorTitleUUID",
                            "properties": {
                              "titleValue": "#errorDisp",
                              "isShown": false
                            }
                          }
                        }
                      ]
                    },
                    "onFailure": {
                      "actions": [
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "errorTitleUUID",
                            "properties": {
                              "titleValue": "#errorDisp",
                              "isShown": true
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      ];
    } else {
      actions = [
        {
          "type": "executetcDefectOperation",
          "config": {
            "defectCurrentCode": action.config.taskPanelData.defect,
            "currentActionCode": "OPEN-" + action.config.processType.toUpperCase(),
            "operation": "#defectOperation.defectCode",
            "configDebugWLData": "#configDebugWLTasksRes",
            "defectRecords": "#getConfigDebugDefectRecords",
            "defectList": "getConfigDebugDefectRecords",
            "key": "defectOperation"
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "#@",
            "properties": {
              "expanded": false,
              "disabled": false,
              "header": {
                "svgIcon": action.config.processType,
                "statusIcon": "check_circle",
                "statusClass": "complete-status",
                "iconClass": "complete-task",
                "headerclass": "replaceheaderclass"
              }
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "createdTaskCompleteButtonUUID#@",
            "properties": {
              "disabled": true,
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "createdTaskDeleteButtonUUID#@",
            "properties": {
              "disabled": true,
            }
          },
          "eventSource": "click"
        },
        {
          "type": "onClickOfConfigCompleteButton",
          "eventSource": "click",
          "config": {
            "action": action,
            "isLooperControlTask": false,
            "addConfigTask": true
          }
        },
        {
          "type": "microservice",
          "hookType": "afterInit",
          "config": {
            "microserviceId": "getCiscoDebugWishlistItems",
            "isLocal": false,
            "LocalService": "assets/Responses/ciscoTaskPanelDataResponse.json",
            "requestMethod": "get",
            "params": {
              "itemId": "#UnitInfo.ITEM_ID",
              "workCenterId": "#UnitInfo.WORKCENTER_ID"
            }
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "configDebugWLTasksRes",
                    "data": "responseData"
                  }
                },
                {
                  "type": "configAddOrRemoveItemFromWL",
                  "config": {
                    "taskPanelData": action.config.taskPanelData,
                    "data": "#configDebugWLTasksRes",
                    "deleteEco": deleteEco ? deleteEco : false
                  }
                },
                {
                  "type": "condition",
                  "config": {
                    "operation": "isEqualTo",
                    "lhs": "#configDebugWLTasksRes",
                    "rhs": null
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "errorTitleUUID",
                            "properties": {
                              "titleValue": "#errorDisp",
                              "isShown": false
                            }
                          }
                        },
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "configDebugWishListButtonUUID",
                            "properties": {
                              "text": "Wish List (0)"
                            }
                          }
                        }
                      ]
                    },
                    "onFailure": {
                      "actions": []
                    }
                  }
                }
              ]
            },
            "onFailure": {
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "errorDisp",
                    "data": "responseData"
                  }
                },
                {
                  "type": "condition",
                  "config": {
                    "operation": "isEqualTo",
                    "lhs": "#errorDisp",
                    "rhs": "No Record Found"
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "errorTitleUUID",
                            "properties": {
                              "titleValue": "#errorDisp",
                              "isShown": false
                            }
                          }
                        }
                      ]
                    },
                    "onFailure": {
                      "actions": [
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "errorTitleUUID",
                            "properties": {
                              "titleValue": "#errorDisp",
                              "isShown": true
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      ];
    }
    return actions;
  }

  configAddOrRemoveItemFromWL(action: any, instance, actionService: any): any {
    let wishListData = this.contextService.getDataByString(action.config.data);
    wishListData = wishListData && wishListData instanceof Array ? wishListData : [];
    this.contextService.addToContext("configDebugWishList", []);
    wishListData && wishListData.forEach((element) => {
      // console.log(element);
      console.log("ted")
      let actions = [];
      let locText = element.part + " , " + element.location
      actions = [
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "configDebugWishList",
            "sourceData": {
              "Part Details": [
                {
                  "ctype": "block-text",
                  "uuid": "StockUUID",
                  "text": "Part:",
                  "textValue": locText,
                  "class": "subtitle1-align-self greyish-black width-200"
                },
                {
                  "ctype": "block-text",
                  "uuid": "StockUUID",
                  "textValue": element.defect,
                  "class": "subtitle1-align-self greyish-black overflow-wrap width-200"
                }
              ],
              "Qty": [
                {
                  "ctype": "block-text",
                  "uuid": "configDebugWishlistQtyUUID",
                  "text": element.qty
                },
                {
                  "ctype": "block-text",
                  "uuid": "displayQuantityUUID",
                  "class": "light-red body margin-top-10",
                  "text": "#displayQuantity"
                }
              ],
              "parentUUID": "#createdComponentUUID"
            }
          },
          "eventSource": "click",
        },
        {
          "type": "context",
          "eventSource": "click",
          "config": {
            "requestMethod": "add",
            "key": "configDebugWishListLength",
            "data": "contextLength",
            "sourceContext": "configDebugWishList"
          }
        },
        {
          "type": "errorPrepareAndRender",
          "eventSource": "click",
          "config": {
            "key": "configDebugWishListButtonUUID",
            "properties": {
              "titleValue": "WishList ({0})",
              "isShown": true
            },
            "valueArray": [
              "#configDebugWishListLength"
            ]
          }
        }
      ]

      actions && actions.forEach((currentAction) => {
        actionService.handleAction(currentAction, instance);
      })
    });

    // actionService.handleAction({
    //   "type": "triggerClick",
    //   "eventSource": "click",
    //   "config": {
    //     "key": "configDebugWishListButtonUUID"
    //   }
    // });

    if (action.config.taskPanelData.taskType && action.config.taskPanelData.taskType.toLowerCase() === "eco" && action.config.deleteEco) {
      let dltRecRefArray = this.contextService.getDataByString("#dummyArray");
      dltRecRefArray && dltRecRefArray.forEach((element) => {
        if (action.config.taskPanelData.defect === element.defect) {

          actionService.handleAction({
            "type": "deleteComponent",
            "eventSource": "click",
            "config": {
              "key": element.uuid
            }
          }, instance)
        }
      });
    } else if (action.config.taskPanelData.activityType && action.config.taskPanelData.activityType.toLowerCase() === "eco" && action.config.deleteEco) {
      let dltRecRefArray = this.contextService.getDataByString("#dummyArray");
      dltRecRefArray && dltRecRefArray.forEach((element) => {
        if (action.config.taskPanelData.defect === element.defect) {
          actionService.handleAction({
            "type": "deleteComponent",
            "eventSource": "click",
            "config": {
              "key": element.uuid
            }
          }, instance)
        }
      });
    }

  }


  // ciscoDebugLooperControl(action: any, instance: any, actionService: any) {
  //   let data;
  //   if (action.config.data != undefined) {
  //     data = action.config.data;
  //     if (data.startsWith('#')) {
  //       data = this.contextService.getDataByString(data);
  //     }
  //   }
  //   for (let currentItem in data) {
  //     let currentdata = data[currentItem];
  //     if (currentItem === "ecoParts") {
  //       this._createLCReplacePanels(currentItem, data, instance, actionService, true)
  //     }
  //     if (currentItem === "rework") {
  //       this._createLCReplacePanels(currentItem, data, instance, actionService, false)
  //     }
  //   }

  // }

  configDebugCreateFailCode(action: any, instance: any, actionService: any) {
    let failCodeRes = this.contextService.getDataByString(action.config.data);
    failCodeRes && failCodeRes.forEach((item) => {
      let actions = [
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectionone",
            "data": {
              "ctype": "taskPanel",
              "uuid": "ConfigDebugFailCodeUUID",
              "containerId": "prebodysectionone",
              "title": "",
              "header": {
                "title": item.header,
                "svgIcon": "description",
                "iconClass": "active-header",
                "status": "",
                "statusClass": "header-icon"
              },
              "expanded": true,
              // "isKeepExpanded": true,
              "disabled": false,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "bodyclass": "splitView",
              "panelClass": "top-margin",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "flexFields",
                  "uuid": "ciscoNotesTitleUUID",
                  "flexClass": "label-container-30-50",
                  "items": [
                    {
                      "ctype": "label",
                      "text": "Fail Code",
                      "labelClass": "subtitle1-align-self"
                    },
                    {
                      "ctype": "label",
                      "text": item.body,
                      "labelClass": "greyish-black"
                    }
                  ]
                }
              ]
            }
          },
          "eventSource": "click"
        }
      ];
      this.executeActions(actions, instance, actionService);

    })
  }

  configDebugCreateEcoPanels(action: any, instance: any, actionService: any) {
    let ecoTasksRes = this.contextService.getDataByString(action.config.data);
    ecoTasksRes = ecoTasksRes instanceof Array ? ecoTasksRes : [];
    ecoTasksRes.forEach((item) => {
      if (item.reworkInstruction) {
        item["notes"] = item.reworkInstruction;
      }
      let action = {
        "config": {
          "icon": 'replace',
          "text": 'Replace',
          "processType": 'replace',
          "taskPanelData": item,
          "isLooperControlTask": true,
          "addToWL": item.mandatory == "1" ? true : false,
          "isEco": item.taskType !== undefined && item.taskType === "ECO" ? true : false
        }
      };
      this.onClickOfConfigCompleteButton(action, instance, actionService);
    })
  }

  ciscoDebugCreateRepairPanels(action: any, instance: any, actionService: any) {
    let repairTasksRes = this.contextService.getDataByString(action.config.data);
    Object.keys(repairTasksRes).forEach((key) => {
      repairTasksRes[key] && repairTasksRes[key].forEach((item) => {
        item.taskType = item.taskType.split(" ")[0].toLowerCase();
        item["qty"] = item.quantity;
        item["subAssm"] = item.subassm;
        let action = {
          "config": {
            "icon": key,
            "text": item.taskType,
            "processType": key,
            "taskPanelData": item,
            "isLooperControlTask": true,
            "isEco": false
          }
        };
        this.onClickOfConfigCompleteButton(action, instance, actionService);
      })
    })
  }

  /// Looper control replace tasks
  _createLCReplacePanels(currentKey, data, instance, actionService, isEco) {
    let currentData = data[currentKey];
    let notes = data['notes'];
    if (notes !== undefined && notes.length > 0) {
      if (notes[0].notes !== null) {
        notes = notes[0].notes;
      } else {
        notes = "";
      }
    }

    currentData && currentData.forEach((item) => {
      // let taskPanelData = {
      //   "subAssm": item.subAssm,
      //   "description": item.subAssm,
      //   "location": item.subAssm,
      //   "defect": item.subAssm,
      //   "quantity": item.subAssm,
      //   "part": item.subAssm,
      //   "scrap": item.subAssm,
      //   "notes": item.subAssm,
      //   "FA": item.subAssm
      // };
      // action.config["taskPanelData"] = taskPanelData;


      item["notes"] = notes;
      let action = {
        "config": {
          "icon": item.processType,
          "text": "Replace",
          "processType": item.processType,
          "taskPanelData": item,
          "isLooperControlTask": true,
          "isEco": isEco
        }
      };
      this.onClickOfConfigCompleteButton(action, instance, actionService);
      // let actions = [{
      //   "type": "createComponent",
      //   "config": {
      //     "targetId": "pageUUID",
      //     "containerId": "prebodysectiontwo",
      //     "data": {
      //       "ctype": "taskPanel",
      //       "uuid": "ciscoDebugCreatedTaskPanelUUID",
      //       "uniqueUUID": true,
      //       "updateUUID": true,
      //       "title": "",
      //       "columnWiseTitle": true,
      //       "header": {
      //         "svgIcon": "replace",
      //         "iconClass": "active-header",
      //         "headerclass": "replaceheaderclass",
      //         "status": "",
      //         "statusIcon": "info_outline",
      //         "statusClass": "eco-icon"
      //       },
      //       "headerTitleLabels": [
      //         "Replace Part",
      //         "",
      //         "",
      //         ""
      //       ],
      //       "headerTitleValues": [
      //         " - " + item.part,
      //         "",
      //         "",
      //         "",
      //         isEco ? "ECO" : "REWORK"
      //       ],
      //       "inputClasses": [
      //         "parent1",
      //         "parent2"
      //       ],
      //       "expanded": false,
      //       "hideToggle": true,
      //       "splitView": true,
      //       "collapsedHeight": "40px",
      //       "expandedHeight": "40px",
      //       "bodyclass": "splitView",
      //       "panelClass": "overflow-show",
      //       "leftDivclass": "width:50%",
      //       "rightDivclass": "width:50%",
      //       "taskPanelHeaderClass": "task-panel-header-color-light-grey",
      //       "visibility": false,
      //       "hooks": [],
      //       "validations": [],
      //       "actions": [
      //       ],
      //       "items": this._getItems(action),
      //       "rightItems": this._returnRightSideItems(action, instance, actionService, false),
      //       "footerclass": "footer-with-space-between",
      //       "footer": [
      //         {
      //           "ctype": "checkbox",
      //           "uuid": "ciscoDebugReplaceCloseEco#@",
      //           "name": "ciscoDebugReplaceCloseEco",

      //           "hooks": [],
      //           "validations": [],

      //           "submitable": true,
      //           "label": "Not required to Close ECO",
      //           "labelPosition": "after",
      //           "checkboxContainer": "mac-checkbox",
      //           "actions": [
      //             {
      //               "type": "context",
      //               "config": {
      //                 "requestMethod": "add",
      //                 "key": "ciscoDebugReplaceCloseEcocheck#@",
      //                 "data": "formData"
      //               },
      //               "eventSource": "click"
      //             },
      //             {
      //               "type": "condition",
      //               "config": {
      //                 "operation": "isEqualTo",
      //                 "lhs": "#ciscoDebugReplaceCloseEcocheck#@.ciscoDebugReplaceCloseEco",
      //                 "rhs": true
      //               },
      //               "eventSource": "click",
      //               "responseDependents": {
      //                 "onSuccess": {
      //                   "actions": [
      //                     {
      //                       "type": "updateComponent",
      //                       "config": {
      //                         "key": "replaceCompleteButtonUUID#@",
      //                         "properties": {
      //                           "disabled": false
      //                         }
      //                       },
      //                       "eventSource": "click"
      //                     }
      //                   ]
      //                 },
      //                 "onFailure": {
      //                   "actions": [
      //                     {
      //                       "type": "updateComponent",
      //                       "config": {
      //                         "key": "replaceCompleteButtonUUID#@",
      //                         "properties": {
      //                           "disabled": true
      //                         }
      //                       },
      //                       "eventSource": "click"
      //                     }
      //                   ]
      //                 }
      //               }
      //             }
      //           ]
      //         },
      //         {
      //           "ctype": "spacer",
      //           "uuid": "emptySpaceUUID",
      //           "class": "empty-space"
      //         },
      //         {
      //           "ctype": "button",
      //           "color": "primary",
      //           "text": "Complete",
      //           "class": "primary-btn",
      //           "uuid": "replaceCompleteButtonUUID#@",
      //           "parentuuid": "replaceTaskUUID",
      //           "visibility": true,
      //           "disabled": true,
      //           "type": "submit",
      //           "tooltip": "",
      //           "hooks": [],
      //           "validations": [],
      //           "actions": []
      //         }
      //       ]
      //     }
      //   },
      //   "eventSource": "click"
      // }];

      // this.executeActions(actions, instance, actionService);
      // this.onClickOfConfigCompleteButton(action, instance, actionService);
    })
  }

  _getItems(currentItem: any) {
    let currentData = currentItem.config.taskPanelData;
    let items = [];
    let data = {
      "subAssm": "",
      "location": "",
      "part": "",
      "defect": "",
      "FA": "",
      "scrap": ""
    };
    for (let currentKey in data) {
      if (currentData[currentKey] !== undefined && currentData[currentKey] !== null) {
        data[currentKey] = currentData[currentKey];
      }
    }
    currentData = data;
    if (currentItem.config.processType === "scrap") {
      items.push(this._addItem("Scrap", currentData['scrap']));
    } else {
      for (let currentKey in currentData) {
        if (currentKey === "subAssm" ||
          currentKey === "location" ||
          currentKey === "defect" ||
          currentKey === "part" ||
          currentKey === "FA") {

          let label = currentKey === "subAssm" ? "Sub Assm"
            : currentKey === "location" ? "Location"
              : currentKey === "defect" ? "Defect"
                : currentKey === "part" ? "Part" : currentData["FA"] ? "FA" : "";
          items.push(this._addItem(label, currentData[currentKey]));
        }
      }
    }

    return items;
  }

  _addItem(label: string, currentData: any): any {
    let data = currentData;
    // if (data !== null &&
    //   data !== undefined &&
    //   data.startsWith('#')) {
    //   data = this.contextService.getDataByString(data);
    // }
    return {
      "ctype": "flexFields",
      "uuid": "ciscoFailCodeTitleUUID",
      "flexClass": "label-container-30-50",
      "items": [
        {
          "ctype": "label",
          "text": label,
          "labelClass": "greyish-black subtitle1-align-self"
        },
        {
          "ctype": "label",
          "text": data,
          "labelClass": "greyish-black"
        }
      ]
    };
  }

  executeActions(actions, instance, actionService) {
    actions && actions.forEach((currentAction) => {
      actionService.handleAction(currentAction, instance);
    });
  }

  getSerialNuberByAssemblyCode(assemblyCode) {
    let configDebugPCBs = this.contextService.getDataByString("#configDebugPCBRes");
    let index = configDebugPCBs.filter(e => e.assemblyCode == assemblyCode);
    // console.log(index[0].serialNumber);
    return index[0].serialNumber;
  }

  isTncEcoDetails(defect) {
    let tcEco = this.contextService.getDataByString("#getConfigDebugValidateEcodata");
    let flag = false;
    tcEco = tcEco && tcEco instanceof Array ? tcEco : [];
    tcEco && tcEco.forEach(element => {
      if (element.ecoNumber === defect && element.isTncEco === "true") {
        flag = true;
      }
    });
    return flag;
  }

  mandatorytask(action: any) {
    let hooks = [];
    let pid = this.contextService.getDataByString("#UnitInfo.PART_NO");
    let debugFlexFieldsData;
    debugFlexFieldsData = this.addFlexFieldsData(action);
    if (action.config.taskPanelData.mandatory && action.config.taskPanelData.mandatory == "1") {
      hooks = [
        {
          "type": "executetcDefectOperation",
          "config": {
            "defectCurrentCode": action.config.taskPanelData.defect,
            "currentActionCode": "OPEN-" + action.config.processType.toUpperCase(),
            "configDebugWLData": "#configDebugWLTasksRes",
            "defectRecords": "#getConfigDebugDefectRecords",
            "defectList": "getConfigDebugDefectRecords",
            "key": "defectOperation"
          },
          "hookType": "afterInit",
        },
        {
          "type": "condition",
          "hookType": "afterInit",
          "config": {
            "operation": "isEqualTo",
            "lhs": action.config.taskPanelData.isTncECO,
            "rhs": "true"
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "microservice",
                  "eventSource": "click",
                  "hookType": "afterInit",
                  "config": {
                    "microserviceId": "performFA",
                    "requestMethod": "post",
                    "body": {
                      "updateFailureAnalysisRequest": {
                        "actionCodeChangeList": {
                          "actionCodeChange": [{
                            "actionCode": action.config.taskPanelData.isTncECO == "true" ? "OPEN-FIT" : "OPEN-REPLACE",
                            "operation": "#defectOperation.actionCode",
                            "assemblyCode": {
                              "value": action.config.taskPanelData.assemblyCode
                            },
                            "ecoCode": {
                              "value": pid + "--" + action.config.taskPanelData.defect
                            }
                          }]
                        },
                        "assemblyCodeChangeList": {
                          "assemblyCodeChange": [{
                            "assemblyCode": action.config.taskPanelData.assemblyCode,
                            "operation": "Update",
                            "serialNumber": this.getSerialNuberByAssemblyCode(action.config.taskPanelData.assemblyCode)
                          }]
                        },
                        "ecoCodeChangeList": {
                          "ecoCodeChange": [{
                            "ecoCode": pid + "--" + action.config.taskPanelData.defect,
                            "operation": "Update"
                          }]
                        },
                        "bcn": "#UnitInfo.ITEM_BCN"
                      },
                      "userPwd": {
                        "username": "#loginUUID.username",
                        "password": "#loginUUID.password"
                      },
                      "operationTypes": "ProcessImmediate",
                      "ip": "::1",
                      "callSource": "FrontEnd",
                      "apiUsage_LocationName": "#UnitInfo.GEONAME",
                      "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                    },
                    "toBeStringified": true
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [{
                        "type": "microservice",
                        "config": {
                          "microserviceId": "performIssueParts",
                          "requestMethod": "post",
                          "isLocal": false,
                          "LocalService": "assets/Responses/getHPFAHistory.json",
                          "body": {
                            "issuePartsRequest": {
                              "bcn": "#UnitInfo.ITEM_BCN",
                              "actionCodeChange": {
                                "operation": "Add",
                                "actionCode": action.config.taskPanelData.isTncECO == "true" ? "OPEN-FIT" : "OPEN-REPLACE",
                                "ecoCode": {
                                  "value": pid + "--" + action.config.taskPanelData.defect
                                }
                              },
                              "nonInventoryPartList": {
                                "nonInventoryPart": this._returnNonInventoryList(action, debugFlexFieldsData)
                              }
                            },
                            "userPwd": {
                              "username": "#userAccountInfo.PersonalDetails.USERID",
                              "password": "#loginUUID.password"
                            },
                            "ip": "::1",
                            "callSource": "FrontEnd",
                            "apiUsage_LocationName": "#UnitInfo.GEONAME",
                            "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                          },
                          "toBeStringified": true
                        },
                        "hookType": "afterInit",
                        "responseDependents": {
                          "onSuccess": {
                            "actions": this.configActionsAfterTransactions(action)
                          },
                          "onFailure": {
                            "actions": [{
                              "type": "context",
                              "config": {
                                "requestMethod": "add",
                                "key": "errorissuePart",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "condition",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": "#errorissuePart",
                                "rhs": "No Record Found"
                              },
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "errorTitleUUID",
                                        "properties": {
                                          "titleValue": "#errorissuePart",
                                          "isShown": false
                                        }
                                      }
                                    }
                                  ]
                                },
                                "onFailure": {
                                  "actions": [
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "errorTitleUUID",
                                        "properties": {
                                          "titleValue": "#errorissuePart",
                                          "isShown": true
                                        }
                                      }
                                    }
                                  ]
                                }
                              }
                            }
                            ]
                          }
                        }
                      }]
                    },
                    "onFailure": {
                      "actions": [{
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "performFAError",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "condition",
                        "config": {
                          "operation": "isEqualTo",
                          "lhs": "#performFAError",
                          "rhs": "No Record Found"
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "errorTitleUUID",
                                  "properties": {
                                    "titleValue": "#performFAError",
                                    "isShown": false
                                  }
                                }
                              }
                            ]
                          },
                          "onFailure": {
                            "actions": [
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "errorTitleUUID",
                                  "properties": {
                                    "titleValue": "#performFAError",
                                    "isShown": true
                                  }
                                }
                              }
                            ]
                          }
                        }
                      }
                      ]
                    }
                  }
                }
              ]
            },
            "onFailure": {
              "actions": [
                {
                  "type": "microservice",
                  "eventSource": "click",
                  "config": {
                    "microserviceId": "performFA",
                    "requestMethod": "post",
                    "body": {
                      "updateFailureAnalysisRequest": {
                        "actionCodeChangeList": {
                          "actionCodeChange": [{
                            "actionCode": action.config.taskPanelData.isTncECO == "true" ? "OPEN-FIT" : "OPEN-REPLACE",
                            "operation": "#defectOperation.actionCode",
                            "assemblyCode": {
                              "value": action.config.taskPanelData.assemblyCode
                            },
                            "ecoCode": {
                              "value": pid + "--" + action.config.taskPanelData.defect
                            }
                          }]
                        },
                        "assemblyCodeChangeList": {
                          "assemblyCodeChange": [{
                            "assemblyCode": action.config.taskPanelData.assemblyCode,
                            "operation": "Update",
                            "serialNumber": this.getSerialNuberByAssemblyCode(action.config.taskPanelData.assemblyCode)
                          }]
                        },
                        "ecoCodeChangeList": {
                          "ecoCodeChange": [{
                            "ecoCode": pid + "--" + action.config.taskPanelData.defect,
                            "operation": "Update"
                          }]
                        },
                        "bcn": "#UnitInfo.ITEM_BCN"
                      },
                      "userPwd": {
                        "username": "#loginUUID.username",
                        "password": "#loginUUID.password"
                      },
                      "operationTypes": "ProcessImmediate",
                      "ip": "::1",
                      "callSource": "FrontEnd",
                      "apiUsage_LocationName": "#UnitInfo.GEONAME",
                      "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                    },
                    "toBeStringified": true
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [{
                        "type": "microservice",
                        "config": {
                          "microserviceId": "performRemoveParts",
                          "requestMethod": "post",
                          "isLocal": false,
                          "LocalService": "assets/Responses/getHPFAHistory.json",
                          "body": {
                            "removePartsRequest": {
                              "bcn": "#UnitInfo.ITEM_BCN",
                              "actionCodeChange": {
                                "operation": "Add",
                                "actionCode": action.config.taskPanelData.isTncECO == "true" ? "OPEN-FIT" : "OPEN-REPLACE",
                                "ecoCode": {
                                  "value": pid + "--" + action.config.taskPanelData.defect
                                }
                              },
                              "nonInventoryPartList": {
                                "nonInventoryPart": this._returnNonInventoryList(action, debugFlexFieldsData)
                              }
                            },
                            "userPwd": {
                              "username": "#userAccountInfo.PersonalDetails.USERID",
                              "password": "#loginUUID.password"
                            },
                            "ip": "::1",
                            "callSource": "FrontEnd",
                            "apiUsage_LocationName": "#UnitInfo.GEONAME",
                            "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                          },
                          "toBeStringified": true
                        },
                        "eventSource": "click",
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [{
                              "type": "microservice",
                              "config": {
                                "microserviceId": "performIssueParts",
                                "requestMethod": "post",
                                "isLocal": false,
                                "LocalService": "assets/Responses/getHPFAHistory.json",
                                "body": {
                                  "issuePartsRequest": {
                                    "bcn": "#UnitInfo.ITEM_BCN",
                                    "actionCodeChange": {
                                      "operation": "Add",
                                      "actionCode": action.config.taskPanelData.isTncECO == "true" ? "OPEN-FIT" : "OPEN-REPLACE",
                                      "ecoCode": {
                                        "value": pid + "--" + action.config.taskPanelData.defect
                                      }
                                    },
                                    "nonInventoryPartList": {
                                      "nonInventoryPart": this._returnNonInventoryList(action, debugFlexFieldsData)
                                    }
                                  },
                                  "userPwd": {
                                    "username": "#userAccountInfo.PersonalDetails.USERID",
                                    "password": "#loginUUID.password"
                                  },
                                  "ip": "::1",
                                  "callSource": "FrontEnd",
                                  "apiUsage_LocationName": "#UnitInfo.GEONAME",
                                  "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                                },
                                "toBeStringified": true
                              },
                              "eventSource": "click",
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": this.configActionsAfterTransactions(action)
                                },
                                "onFailure": {
                                  "actions": [{
                                    "type": "context",
                                    "config": {
                                      "requestMethod": "add",
                                      "key": "errorissuePart",
                                      "data": "responseData"
                                    }
                                  },
                                  {
                                    "type": "condition",
                                    "config": {
                                      "operation": "isEqualTo",
                                      "lhs": "#errorissuePart",
                                      "rhs": "No Record Found"
                                    },
                                    "responseDependents": {
                                      "onSuccess": {
                                        "actions": [
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "errorTitleUUID",
                                              "properties": {
                                                "titleValue": "#errorissuePart",
                                                "isShown": false
                                              }
                                            }
                                          }
                                        ]
                                      },
                                      "onFailure": {
                                        "actions": [
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "errorTitleUUID",
                                              "properties": {
                                                "titleValue": "#errorissuePart",
                                                "isShown": true
                                              }
                                            }
                                          }
                                        ]
                                      }
                                    }
                                  }
                                  ]
                                }
                              }
                            }]
                          },
                          "onFailure": {
                            "actions": [{
                              "type": "context",
                              "config": {
                                "requestMethod": "add",
                                "key": "errorissuePart",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "condition",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": "#errorissuePart",
                                "rhs": "No Record Found"
                              },
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "errorTitleUUID",
                                        "properties": {
                                          "titleValue": "#errorissuePart",
                                          "isShown": false
                                        }
                                      }
                                    }
                                  ]
                                },
                                "onFailure": {
                                  "actions": [
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "errorTitleUUID",
                                        "properties": {
                                          "titleValue": "#errorissuePart",
                                          "isShown": true
                                        }
                                      }
                                    }
                                  ]
                                }
                              }
                            }
                            ]
                          }
                        }
                      }]
                    },
                    "onFailure": {
                      "actions": [{
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "performFAError",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "condition",
                        "config": {
                          "operation": "isEqualTo",
                          "lhs": "#performFAError",
                          "rhs": "No Record Found"
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "errorTitleUUID",
                                  "properties": {
                                    "titleValue": "#performFAError",
                                    "isShown": false
                                  }
                                }
                              }
                            ]
                          },
                          "onFailure": {
                            "actions": [
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "errorTitleUUID",
                                  "properties": {
                                    "titleValue": "#performFAError",
                                    "isShown": true
                                  }
                                }
                              }
                            ]
                          }
                        }
                      }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      ]
      hooks.push(
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "dummyArray",
            "sourceData": {
              "uuid": "#@",
              "defect": action.config.taskPanelData.defect
            }
          },
          "hookType": "afterInit"
        }
      )
    }
    return hooks;
  }
}
