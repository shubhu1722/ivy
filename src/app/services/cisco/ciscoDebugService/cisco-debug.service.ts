import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class CiscoDebugService {
  checkIsWCLooping(action: any, instance: any, actionService: any) {
    let isWCLooping = this.contextService.getDataByString(action.config.data);
    let actions = [];
    actions = [
      {
        "type": "condition",
        "config": {
          "operation": "isEqualTo",
          "lhs": isWCLooping[0].isLooping,
          "rhs": "true"
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "microservice",
                "hookType": "afterInit",
                "config": {
                  "microserviceId": "getCiscoDebugValidateTasks",
                  "isLocal": false,
                  "LocalService": "assets/validateTasksSample.json",
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
                          "key": "ciscoDebugValidateTaskRes",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "ciscoDebugValidateTaskPanels",
                        "config": {
                          "data": "#getCiscoDebugValidateTasks"
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
          "onFailure": {
            "actions": [
              {
                "type": "microservice",
                "hookType": "afterInit",
                "config": {
                  "microserviceId": "getCiscoDebugFailCodeTask",
                  "isLocal": false,
                  "LocalService": "assets/Responses/ciscoTaskPanelDataResponse.json",
                  "requestMethod": "get",
                  "params": {
                    "itemId": "#UnitInfo.ITEM_ID"
                  }
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "ciscoDebugFailCodeRes",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "ciscoDebugCreateFailCode",
                        "config": {
                          "data": "#ciscoDebugFailCodeRes"
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
          }
        }
      }
    ];

    actions && actions.forEach((eachAction) => {
      actionService.handleAction(eachAction, instance);
    })

  }

  constructor(
    private contextService: ContextService
  ) { }

  handleProcessActions(action, instance, actionService) {
    let selectedProcess = this.contextService.getDataByString("#ciscoDebugSelectedProcess");
    // console.log("ciscoDebugSelectedProcess : ", selectedProcess);

    let processActions = [
      {
        "type": "deleteComponent",
        "eventSource": "click",
        "config": {
          "key": "ciscoDebugTaskPanelUUID"
        }
      },
      {
        "type": "context",
        "eventSource": "click",
        "config": {
          "requestMethod": "add",
          "key": "ciscoDebugSelectedProcess",
          "data": action.config.processType
        }
      },
      {
        "type": "disableOrEnableAllIcons",
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
            "uuid": "ciscoDebugTaskPanelUUID",
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
                  "key": "ciscoDebugTaskPanelUUID"
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
                "type": "disableOrEnableAllIcons",
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
                    "eventSource": "click",
                    "config": {
                      "key": "CiscoDebugLocationUUID",
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
                      "key": "ciscoDebugDesLabelUUID#@",
                      "properties": {
                        "text": ""
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "CiscoDebugRewINSTRUUID",
                      "properties": {
                        "isReset": true,
                        "name": "ciscoDebug" + action.config.processType + "RewINSTR"
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "ciscoDebugDesLabelUUID",
                      "properties": {
                        "text": ""
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": 'ciscoQtyUUID',
                      "properties": {
                        "text": "0"
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "ciscoDebugStockQty",
                      "properties": {
                        "text": ""
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "CiscoDebugFlexFieldRewINSTRUUID",
                      "properties": {
                        "flexClass": "hide"
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "ciscoDebugDesFlexUUID",
                      "properties": {
                        "flexClass": "hide"
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
                    "type": "ciscoDebugCompleteButton",
                    "eventSource": "click",
                    "config": {
                      "action": action,
                      "isLooperControlTask": false
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
  onClickOfCompleteButton(action: any, instance: any, actionService: any) {
    let completeButtonActions = [];
    let taskPanelData;
    if (!action.config.isLooperControlTask) {
      action = action.config.action;
      taskPanelData = {
        "subAssm": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "SubAssmName"),
        "description": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "Description"),
        "location": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "Location"),
        "defect": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "Defect"),
        "qty": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "AvailableQuantity"),
        "part": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "PartName"),
        "scrap": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "Scrap"),
        "notes": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "RewINSTR"),
        "FA": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "FA"),
        "assemblyCode": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "SubAssm"),
        "componentPartno": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "Part"),
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
          "key": "ciscoDebugTaskPanelUUID"
        }
      },
      {
        "type": "disableOrEnableAllIcons",
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
            "uuid": "ciscoDebugCreatedTaskPanelUUID",
            "uniqueUUID": true,
            "updateUUID": true,
            "title": "",
            "columnWiseTitle": true,
            "header": {
              "svgIcon": action.config.processType === "resolder" ? "manual" : action.config.processType,
              "iconClass": "active-header",
              "headerclass": "replaceheaderclass",
              "status": "",
              "statusIcon": action.config.isWishList ? "check_circle" : action.config.isLooperControlTask ? "info_outline" : "check_circle",
              "statusClass": action.config.isWishList ? "complete-status" : action.config.isLooperControlTask ? "eco-icon" : "complete-status"
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
              "parent2"
            ],
            "expanded": false,
            "hideToggle": true,
            "splitView": true,
            "collapsedHeight": "40px",
            "expandedHeight": "40px",
            "bodyclass": "splitView",
            "panelClass": "overflow-show top-margin",
            "leftDivclass": "width:50%",
            "rightDivclass": "width:50%",
            "taskPanelHeaderClass": "task-panel-header-color-light-grey",
            "visibility": false,
            "hooks": this.completedTaskHooks(action),
            "validations": [],
            "actions": [
              {
                "type": "disableOrEnableAllIcons",
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
    console.log(this.contextService);
  }

  /**
  * This will generate the validate tasks
  */
  ciscoDebugValidateTaskPanels(action: any, instance: any, actionService: any) {
    let validateTasksRes = this.contextService.getDataByString(action.config.data);
    validateTasksRes && validateTasksRes.forEach((task) => {
      let actions = [
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectionone",
            "data": {
              "ctype": "taskPanel",
              "uuid": "ciscoDebugCreatedTaskPanelUUID",
              "containerId": "prebodysectionone",
              "uniqueUUID": true,
              "updateUUID": true,
              "title": "",
              "columnWiseTitle": true,
              "header": {
                "svgIcon": "description",
                "iconClass": "active-header",
                "headerclass": "replaceheaderclass",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              },
              "headerTitleLabels": [
                "Confirm Repair -" + task.componentPartNo + ", " + task.description + ", " + task.location,
                "",
                "",
                ""
              ],
              "headerTitleValues": [
                "",
                "",
                "",
                ""
              ],
              "inputClasses": [
                "parent1-width",
                "parent2"
              ],
              "expanded": false,
              "hideToggle": true,
              "splitView": false,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "bodyclass": "splitView",
              "panelClass": "overflow-show",
              "leftDivclass": "width:50%",
              "rightDivclass": "width:50%",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [
                {
                  "type": "microservice",
                  "hookType": "afterInit",
                  "config": {
                    "microserviceId": "getReworkMasterList",
                    "isLocal": false,
                    "LocalService": "assets/Responses/mockBGA.json",
                    "requestMethod": "get",
                    "params": {
                      "componentPartNo": task.componentPartNo,
                      "locationId": "#userSelectedLocation",
                      "clientId": "#userSelectedClient",
                      "contractId": "#userSelectedContract",
                      "pidNo": "#UnitInfo.PART_NO"
                    }
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "filterMasterName",
                          "config": {
                            "key": "getMasterList",
                            "data": "#getReworkMasterList",
                            "taskData": task
                          }
                        },
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
              "validations": [],
              "actions": [
              ],
              "items": [
                {
                  "ctype": "label",
                  "text": task.taskType + " - " + task.subAssm + " - " + task.location + " - " + task.defect,
                  "labelClass": "rework-font"
                },
                {
                  "ctype": "flexFields",
                  "uuid": "listTitleUUID",
                  "flexClass": "",
                  "items": [
                    {
                      "ctype": "label",
                      "text": "Is the issue resolved",
                      "labelClass": "bypasslabelConfigrework"
                    },
                    {
                      "formGroupClass": "buttoon-toggle-cls body2 configrework-YesNo-Button",
                      "ctype": "actionToggle",
                      "labelPosition": "before",
                      "name": "ciscoDebugIsIssueResolved",
                      "selectedVal": "",
                      "subProcess": "CiscoDebug",
                      "options": [
                        {
                          "bgcolor": "light-blue",
                          "color": "white",
                          "text": "NO",
                          "value": "Fail"
                        },
                        {
                          "bgcolor": "light-blue",
                          "color": "white",
                          "text": "YES",
                          "value": "Pass"
                        }
                      ],
                      "validations": [],
                      "label": "",
                      "uuid": "ciscoDebugIsIssueResolvedUUID#@",
                      "hooks": [],
                      "actions": [{
                        "eventSource": "change",
                        "type": "context",
                        "config": {
                          "data": "elementControlValue",
                          "requestMethod": "add",
                          "key": "ciscoDebugIsIssueResolved#@"
                        }
                      },
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "ciscoDebugValidateComplete#@",
                          "properties": {
                            "disabled": false
                          }
                        },
                        "eventSource": "change"
                      }
                      ],
                      "submitable": true
                    }
                  ]
                }
              ],
              "rightItems": [],
              "footerclass": "footer-with-space-between",
              "footer": [
                {
                  "ctype": "spacer",
                  "uuid": "emptySpaceUUID",
                  "class": "empty-space"
                },
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Complete",
                  "class": "primary-btn",
                  "uuid": "ciscoDebugValidateComplete#@",
                  "parentuuid": "#@",
                  "visibility": true,
                  "disabled": true,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "getReworkMasterList",
                        "isLocal": false,
                        "LocalService": "assets/Responses/mockBGA.json",
                        "requestMethod": "get",
                        "params": {
                          "componentPartNo": task.componentPartNo,
                          "locationId": "#userSelectedLocation",
                          "clientId": "#userSelectedClient",
                          "contractId": "#userSelectedContract",
                          "pidNo": "#UnitInfo.PART_NO"
                        }
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "filterMasterName",
                              "config": {
                                "key": "getMasterList",
                                "data": "#getReworkMasterList",
                                "taskData": task,
                                "afterActions": this.onClickOfValidateComplete(task)
                              }
                            },
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

  /**
   * 
   * @param action 
   * @param instance 
   * @param actionService 
   * 
   * This method is called whenever a validate task panels
   * complete button is clicked.
   */
  onClickOfValidateComplete(taskPanelData) {
    let processType = taskPanelData.taskType.split(" ")[0];
    let actions = [];
    let debugFlexFieldsData = [];
    let reworkDetails = this.contextService.getDataByString("#getReworkDetails");

    debugFlexFieldsData = [
      {
        "name": "PCB_PN",
        "value": taskPanelData.subAssm
      },
      {
        "name": "REFURB",
        "value": "False"
      }
    ];

    if (taskPanelData.activityType && taskPanelData.activityType === "ECO") {
      let reworkEcoDetails = reworkDetails.eco;
      reworkEcoDetails = reworkEcoDetails.filter(ele => ele.readonlyTask == "true" && ele.pcbPn == taskPanelData.subAssm && ele.location == taskPanelData.location);

      reworkEcoDetails.forEach(element => {
        let ecoDetails = element;

        if (ecoDetails.analysis) {
          debugFlexFieldsData.push(
            {
              "name": "ANALYSIS",
              "value": ecoDetails.analysis
            }
          )
        }
        if (ecoDetails.dateCode) {
          debugFlexFieldsData.push(
            {
              "name": "DATE_CODE",
              "value": ecoDetails.dateCode
            }
          )
        }
        if (ecoDetails.rewInstr) {
          debugFlexFieldsData.push(
            {
              "name": "REW_INSTR",
              "value": ecoDetails.rewInstr
            }
          )
        }
        if (ecoDetails.pcbSn) {
          debugFlexFieldsData.push(
            {
              "name": "PCB_SN",
              "value": ecoDetails.pcbSn
            }
          )
        }
      });
    } else if (processType === "Replace") {
      let reworkReplaceDetails = reworkDetails.replace;
      reworkReplaceDetails = reworkReplaceDetails.filter(ele => ele.readonlyTask == "true" && ele.pcbPn == taskPanelData.subAssm && ele.location == taskPanelData.location);

      reworkReplaceDetails.forEach(element => {
        let replaceDetails = element;

        if (replaceDetails.analysis) {
          debugFlexFieldsData.push(
            {
              "name": "ANALYSIS",
              "value": replaceDetails.analysis
            }
          )
        }

        if (replaceDetails.dateCode) {
          debugFlexFieldsData.push(
            {
              "name": "DATE_CODE",
              "value": replaceDetails.dateCode
            }
          )
        }

        if (replaceDetails.rewInstr) {
          debugFlexFieldsData.push(
            {
              "name": "REW_INSTR",
              "value": replaceDetails.rewInstr
            }
          )
        }
        if (replaceDetails.pcbSn) {
          debugFlexFieldsData.push(
            {
              "name": "PCB_SN",
              "value": replaceDetails.pcbSn
            }
          )
        }
      });

    } else if (processType === "Fit") {
      let reworkFitDetails = reworkDetails.fit;
      reworkFitDetails = reworkFitDetails.filter(ele => ele.readonlyTask == "true" && ele.pcbPn == taskPanelData.subAssm && ele.location == taskPanelData.location);

      reworkFitDetails.forEach(element => {
        let fitDetails = element;

        if (fitDetails.analysis) {
          debugFlexFieldsData.push(
            {
              "name": "ANALYSIS",
              "value": fitDetails.analysis
            }
          )
        }
        if (fitDetails.dateCode) {
          debugFlexFieldsData.push(
            {
              "name": "DATE_CODE",
              "value": fitDetails.dateCode
            }
          )
        }
        if (fitDetails.rewInstr) {
          debugFlexFieldsData.push(
            {
              "name": "REW_INSTR",
              "value": fitDetails.rewInstr
            }
          )
        }
        if (fitDetails.pcbSn) {
          debugFlexFieldsData.push(
            {
              "name": "PCB_SN",
              "value": fitDetails.pcbSn
            }
          )
        }
      });
    } if (processType === "Resolder") {
      let reworkResolderDetails = reworkDetails.resolder;
      reworkResolderDetails = reworkResolderDetails.filter(ele => ele.readonlyTask == "true" && ele.pcbPn == taskPanelData.subAssm && ele.location == taskPanelData.location);

      reworkResolderDetails.forEach(element => {
        let resolderDetails = element;

        if (resolderDetails.analysis) {
          debugFlexFieldsData.push(
            {
              "name": "ANALYSIS",
              "value": resolderDetails.analysis
            }
          )
        }
        if (resolderDetails.dateCode) {
          debugFlexFieldsData.push(
            {
              "name": "DATE_CODE",
              "value": resolderDetails.dateCode
            }
          )
        }
        if (resolderDetails.rewInstr) {
          debugFlexFieldsData.push(
            {
              "name": "REW_INSTR",
              "value": resolderDetails.rewInstr
            }
          )
        }
        if (resolderDetails.pcbSn) {
          debugFlexFieldsData.push(
            {
              "name": "PCB_SN",
              "value": resolderDetails.pcbSn
            }
          )
        }
      });
    } else {
      // For Remove Task
      let reworkRemoveDetails = reworkDetails.remove;
      reworkRemoveDetails = reworkRemoveDetails.filter(ele => ele.readonlyTask == "true" && ele.pcbPn == taskPanelData.subAssm && ele.location == taskPanelData.location);

      reworkRemoveDetails.forEach(element => {
        let removeDetails = element;

        if (removeDetails.analysis) {
          debugFlexFieldsData.push(
            {
              "name": "ANALYSIS",
              "value": removeDetails.analysis
            }
          )
        }
        if (removeDetails.dateCode) {
          debugFlexFieldsData.push(
            {
              "name": "DATE_CODE",
              "value": removeDetails.dateCode
            }
          )
        }
        if (removeDetails.rewInstr) {
          debugFlexFieldsData.push(
            {
              "name": "REW_INSTR",
              "value": removeDetails.rewInstr
            }
          )
        }
        if (removeDetails.pcbSn) {
          debugFlexFieldsData.push(
            {
              "name": "PCB_SN",
              "value": removeDetails.pcbSn
            }
          )
        }
      });
    }

    if (taskPanelData.reworkInstruction) {
      debugFlexFieldsData.push({
        "name": "REW_INSTR",
        "value": taskPanelData.reworkInstruction
      })
    }

    if (taskPanelData.analysis) {
      debugFlexFieldsData.push({
        "name": "ANALYSIS",
        "value": taskPanelData.analysis
      })
    }

    debugFlexFieldsData.push({
      "name": "RWK_VAL_RES",
      "value": "#ciscoDebugIsIssueResolved#@"
    })

    taskPanelData["componentPartno"] = taskPanelData.componentPartNo;

    if (taskPanelData.activityType && taskPanelData.activityType === "ECO") {
      /*performRemoveParts
       *performIssueParts
       */
      let pid = this.contextService.getDataByString("#UnitInfo.PART_NO");
      actions = [
        {
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
                  "operation": "Delete",
                  "actionCode": "CLOSE-REPLACE",
                  "ecoCode": {
                    "value": pid + "--" + taskPanelData.defect
                  }
                },
                "nonInventoryPartList": {
                  "nonInventoryPart": this._returnNonInventoryList({
                    "config": {
                      "taskPanelData": taskPanelData,
                      "manufacturerPartNumber": "#getMasterList.defectiveMaster"
                    }
                  },
                    this.filterReplaceDataCode(debugFlexFieldsData, "remove"))
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
              "actions": [
                {
                  "type": "microservice",
                  "config": {
                    "microserviceId": "performUnissueParts",
                    "requestMethod": "post",
                    "isLocal": false,
                    "LocalService": "assets/Responses/getPreselectedResultCode.json",
                    "body": {
                      "unissuePartsRequest": {
                        "bcn": "#UnitInfo.ITEM_BCN",
                        "actionCodeChange": {
                          "actionCode": "CLOSE-REPLACE",
                          "operation": "Add",
                          "ecoCode": {
                            "value": pid + "--" + taskPanelData.defect
                          }
                        },
                        "nonInventoryPartList": {
                          "nonInventoryPart": this._returnNonInventoryList({
                            "config": {
                              "taskPanelData": taskPanelData,
                              "manufacturerPartNumber": "#getMasterList.newMaster"
                            }
                          },
                            this.filterReplaceDataCode(debugFlexFieldsData, "issue"))
                        }
                      },
                      "userPwd": {
                        "username": "#userAccountInfo.PersonalDetails.USERID",
                        "password": "#loginUUID.password"
                      }
                    },
                    "toBeStringified": true
                  },
                  "eventSource": "click",
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
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
                                  "operation": "Update",
                                  "actionCode": "CLOSE-" + processType.toUpperCase(),
                                  "ecoCode": {
                                    "value": pid + "--" + taskPanelData.defect
                                  }
                                },
                                "nonInventoryPartList": {
                                  "nonInventoryPart": this._returnNonInventoryList({
                                    "config": {
                                      "taskPanelData": taskPanelData,
                                      "manufacturerPartNumber": "#getMasterList.defectiveMaster"
                                    }
                                  },
                                    this.filterReplaceDataCode(debugFlexFieldsData, "remove"))
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
                                          "operation": "Update",
                                          "actionCode": "CLOSE-" + processType.toUpperCase(),
                                          "ecoCode": {
                                            "value": pid + "--" + taskPanelData.defect
                                          }
                                        },
                                        "nonInventoryPartList": {
                                          "nonInventoryPart": this._returnNonInventoryList({
                                            "config": {
                                              "taskPanelData": taskPanelData,
                                              "manufacturerPartNumber": "#getMasterList.newMaster"
                                            }
                                          },
                                            this.filterReplaceDataCode(debugFlexFieldsData, "issue"))
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
                                      "actions": [
                                        {
                                          "type": "updateComponent",
                                          "config": {
                                            "key": "#@",
                                            "properties": {
                                              "expanded": false,
                                              "disabled": false,
                                              "header": {
                                                "svgIcon": "description",
                                                "statusIcon": "check_circle",
                                                "statusClass": "complete-status",
                                                "class": "complete-task",
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
                                            "key": "ciscoDebugValidateComplete#@",
                                            "properties": {
                                              "disabled": true,

                                            }
                                          },
                                          "eventSource": "click"
                                        }
                                      ]
                                    },
                                    "onFailure": {
                                      "actions": [
                                        {
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
                                }
                              ]
                            },
                            "onFailure": {
                              "actions": [
                                {
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
    } else {
      if (processType === "Replace") {
        /*performRemoveParts
         *performIssueParts
         */
        actions = [
          //Delete New & Defective component
          {
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
                    "operation": "Delete",
                    "actionCode": "CLOSE-" + processType.toUpperCase(),
                    "defectCode": {
                      "value": taskPanelData.defect
                    }
                  },
                  "nonInventoryPartList": {
                    "nonInventoryPart": this._returnNonInventoryList({
                      "config": {
                        "taskPanelData": taskPanelData,
                        "manufacturerPartNumber": "#getMasterList.defectiveMaster"
                      }
                    },
                      this.filterReplaceDataCode(debugFlexFieldsData, "remove"))
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
                "actions": [
                  {
                    "type": "microservice",
                    "config": {
                      "microserviceId": "performUnissueParts",
                      "requestMethod": "post",
                      "isLocal": false,
                      "LocalService": "assets/Responses/getPreselectedResultCode.json",
                      "body": {
                        "unissuePartsRequest": {
                          "bcn": "#UnitInfo.ITEM_BCN",
                          "actionCodeChange": {
                            "actionCode": "CLOSE-" + processType.toUpperCase(),
                            "operation": "Add",
                            "defectCode": {
                              "value": taskPanelData.defect
                            }
                          },
                          "nonInventoryPartList": {
                            "nonInventoryPart": this._returnNonInventoryList({
                              "config": {
                                "taskPanelData": taskPanelData,
                                "manufacturerPartNumber": "#getMasterList.newMaster"
                              }
                            },
                              this.filterReplaceDataCode(debugFlexFieldsData, "issue"))
                          }
                        },
                        "userPwd": {
                          "username": "#userAccountInfo.PersonalDetails.USERID",
                          "password": "#loginUUID.password"
                        }
                      },
                      "toBeStringified": true
                    },
                    "eventSource": "click",
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          // update New & Defective component
                          {
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
                                    "operation": "Update",
                                    "actionCode": "CLOSE-" + processType.toUpperCase(),
                                    "defectCode": {
                                      "value": taskPanelData.defect
                                    }
                                  },
                                  "nonInventoryPartList": {
                                    "nonInventoryPart": this._returnNonInventoryList({
                                      "config": {
                                        "taskPanelData": taskPanelData,
                                        "manufacturerPartNumber": "#getMasterList.defectiveMaster"
                                      }
                                    },
                                      this.filterReplaceDataCode(debugFlexFieldsData, "remove"))
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
                                            "operation": "Update",
                                            "actionCode": "CLOSE-" + processType.toUpperCase(),
                                            "defectCode": {
                                              "value": taskPanelData.defect
                                            }
                                          },
                                          "nonInventoryPartList": {
                                            "nonInventoryPart": this._returnNonInventoryList({
                                              "config": {
                                                "taskPanelData": taskPanelData,
                                                "manufacturerPartNumber": "#getMasterList.newMaster"
                                              }
                                            },
                                              this.filterReplaceDataCode(debugFlexFieldsData, "issue"))
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
                                        "actions": [
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "#@",
                                              "properties": {
                                                "expanded": false,
                                                "disabled": false,
                                                "header": {
                                                  "svgIcon": "description",
                                                  "statusIcon": "check_circle",
                                                  "statusClass": "complete-status",
                                                  "class": "complete-task",
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
                                              "key": "ciscoDebugValidateComplete#@",
                                              "properties": {
                                                "disabled": true,

                                              }
                                            },
                                            "eventSource": "click"
                                          }
                                        ]
                                      },
                                      "onFailure": {
                                        "actions": [
                                          {
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
                                  }
                                ]
                              },
                              "onFailure": {
                                "actions": [
                                  {
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
      } else if (processType === "Fit" || processType === "Resolder") {
        /***performIssueParts*/
        actions = [
          //Delete New component
          {
            "type": "microservice",
            "config": {
              "microserviceId": "performUnissueParts",
              "requestMethod": "post",
              "isLocal": false,
              "LocalService": "assets/Responses/getPreselectedResultCode.json",
              "body": {
                "unissuePartsRequest": {
                  "bcn": "#UnitInfo.ITEM_BCN",
                  "actionCodeChange": {
                    "actionCode": "CLOSE-" + processType.toUpperCase(),
                    "operation": "Add",
                    "defectCode": {
                      "value": taskPanelData.defect
                    }
                  },
                  "nonInventoryPartList": {
                    "nonInventoryPart": this._returnNonInventoryList({
                      "config": {
                        "taskPanelData": taskPanelData,
                        "manufacturerPartNumber": "#getMasterList.master"
                      }
                    },
                      debugFlexFieldsData)
                  }
                },
                "userPwd": {
                  "username": "#userAccountInfo.PersonalDetails.USERID",
                  "password": "#loginUUID.password"
                }
              },
              "toBeStringified": true
            },
            "eventSource": "click",
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  // update New component
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
                            "operation": "Update",
                            "actionCode": "CLOSE-" + processType.toUpperCase(),
                            "defectCode": {
                              "value": taskPanelData.defect
                            }
                          },
                          "nonInventoryPartList": {
                            "nonInventoryPart": this._returnNonInventoryList({
                              "config": {
                                "taskPanelData": taskPanelData,
                                "manufacturerPartNumber": "#getMasterList.master"
                              }
                            },
                              debugFlexFieldsData)
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
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "#@",
                              "properties": {
                                "expanded": false,
                                "disabled": false,
                                "header": {
                                  "svgIcon": "description",
                                  "statusIcon": "check_circle",
                                  "statusClass": "complete-status",
                                  "class": "complete-task",
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
                              "key": "ciscoDebugValidateComplete#@",
                              "properties": {
                                "disabled": true,

                              }
                            },
                            "eventSource": "click"
                          }
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
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
      } else {
        /***performRemoveParts*/
        actions = [
          {
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
                    "operation": "Delete",
                    "actionCode": "CLOSE-" + processType.toUpperCase(),
                    "defectCode": {
                      "value": taskPanelData.defect
                    }
                  },
                  "nonInventoryPartList": {
                    "nonInventoryPart": this._returnNonInventoryList({
                      "config": {
                        "taskPanelData": taskPanelData,
                        "manufacturerPartNumber": "#getMasterList.master"
                      }
                    },
                      debugFlexFieldsData)
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
                "actions": [
                  // update Defective component
                  {
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
                            "operation": "Update",
                            "actionCode": "CLOSE-" + processType.toUpperCase(),
                            "defectCode": {
                              "value": taskPanelData.defect
                            }
                          },
                          "nonInventoryPartList": {
                            "nonInventoryPart": this._returnNonInventoryList({
                              "config": {
                                "taskPanelData": taskPanelData,
                                "manufacturerPartNumber": "#getMasterList.master"
                              }
                            },
                              debugFlexFieldsData)
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
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "#@",
                              "properties": {
                                "expanded": false,
                                "disabled": false,
                                "header": {
                                  "svgIcon": "description",
                                  "statusIcon": "check_circle",
                                  "statusClass": "complete-status",
                                  "class": "complete-task",
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
                              "key": "ciscoDebugValidateComplete#@",
                              "properties": {
                                "disabled": true,
                              }
                            },
                            "eventSource": "click"
                          }
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
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
      }
    }

    return actions;
  }

  completedTaskHooks(action: any) {
    let hooks = [];
    if (action.config.processType !== "scrap" && action.config.isLooperControlTask) {
      let locText = action.config.taskPanelData.part + " , " + action.config.taskPanelData.location
      hooks = [
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "ciscoDebugWishList",
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
                  "uuid": "ciscoDebugWishlistQtyUUID",
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
            "key": "ciscoDebugWishListLength",
            "data": "contextLength",
            "sourceContext": "ciscoDebugWishList"
          }
        },
        {
          "type": "errorPrepareAndRender",
          "hookType": "afterInit",
          "config": {
            "key": "ciscoDebugWishListButtonUUID",
            "properties": {
              "titleValue": "WishList ({0})",
              "isShown": true
            },
            "valueArray": [
              "#ciscoDebugWishListLength"
            ]
          }
        },
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "ciscoDebugTableData",
            "sourceData": {
              "parentUUID": "#@",
              "flexFields": this._getTableFlexData(action)
            }
          },
          "hookType": "afterInit"
        },
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "dltRecRefArray",
            "sourceData": {
              "uuid": "#@",
              "defect": action.config.taskPanelData.defect
            }
          },
          "hookType": "afterInit"
        }
      ];
    } else if (action.config.processType === "scrap") {
      hooks.push({
        "type": "context",
        "hookType": "afterInit",
        "config": {
          "requestMethod": "add",
          "key": "isScrapSelected",
          "data": true
        }
      });
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
                  "key": "ciscoDebugAvailQtyRes#@",
                  "data": "responseData"
                }
              },
              {
                "type": "stringOperation",
                "config": {
                  "key": "ciscoDebugAvailQtyRes#@",
                  "lstr": "#ciscoDebugAvailQtyRes#@",
                  "rstr": "Available",
                  "operation": "concat",
                  "concatSymbol": " "
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "ciscoDebugStockQty#@",
                  "properties": {
                    "text": this.concatTheAvlQty("#ciscoDebugAvailQtyRes#@")
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
    } else {
      hooks.push(
        {
          "type": "updateComponent",
          "hookType": "afterInit",
          "config": {
            "key": "ciscoDebugStockQty#@",
            "properties": {
              "text": this.concatTheAvlQty("#ciscoDebugAvailQtyRes")
            }
          }
        }
      );
    }

    if (!action.config.isLooperControlTask && action.config.processType !== "scrap") {
      hooks.push(

      );
    }

    return hooks;
  }

  _getTableFlexData(action: any) {
    let flexData = [];
    flexData = action.config.taskPanelData;
    return flexData;
  }

  _getHeader(action) {
    return action.config.processType === "replace" ? "Replace Part - " :
      action.config.processType === "remove" ? "Remove Part - " :
        action.config.processType === "fit" ? "Fit Part - " :
          action.config.processType === "resolder" ? "Resolder Part - " : "Scrap Part - "
  }

  _getFooter(action: any, instance: any, actionService: any) {
    let footerItems = [];
    if (action.config.isLooperControlTask && action.config.isEco) {
      footerItems.push({
        "ctype": "checkbox",
        "uuid": "ciscoDebugReplaceCloseEco#@",
        "name": "ciscoDebugReplaceCloseEco",
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
              "key": "ciscoDebugReplaceCloseEcocheck#@",
              "data": "formData"
            },
            "eventSource": "click"
          },
          {
            "type": "condition",
            "config": {
              "operation": "isEqualTo",
              "lhs": "#ciscoDebugReplaceCloseEcocheck#@.ciscoDebugReplaceCloseEco",
              "rhs": true
            },
            "eventSource": "click",
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "replaceCompleteButtonUUID#@",
                      "properties": {
                        "disabled": false
                      }
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
              },
              "onFailure": {
                "actions": [
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "replaceCompleteButtonUUID#@",
                      "properties": {
                        "disabled": true
                      }
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "createdTaskCompleteButtonUUID#@",
                      "properties": {
                        "text": "Keep In Wishlist"
                      }
                    },
                    "eventSource": "click"
                  }
                ]
              }
            }
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
        "text": action.config.isWishList ? "Keep In Wishlist" : "Complete",
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

    return actions;
  }

  createdTaskCompleteButtonActions(action: any, instance: any, actionService: any) {
    let actions = [];
    let debugFlexFieldsData = [];
    let taskPanelData;
    if (!action.config.isLooperControlTask) {
      action = action.config.action;
      taskPanelData = {
        "subAssm": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "SubAssmName"),
        "description": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "Description"),
        "location": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "Location"),
        "defect": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "Defect"),
        "qty": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "AvailableQuantity"),
        "part": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "PartName"),
        "scrap": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "Scrap"),
        "notes": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "RewINSTR"),
        "FA": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "FA"),
        "assemblyCode": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "SubAssm"),
        "componentPartno": this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "Part"),
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
        "type": "onClickOfCompleteButton",
        "eventSource": "click",
        "config": {
          "action": action,
          "isLooperControlTask": false
        }
      }
    ];
    return actions;
  }

  addFlexFieldsData(action: any): any[] {
    let debugFlexFieldsData = [];
    debugFlexFieldsData = [
      {
        "name": "PCB_PN",
        "value": action.config.taskPanelData.subAssm
      },
      {
        "name": "REFURB",
        "value": "False"
      }
    ];

    if (action.config.taskPanelData.notes) {
      debugFlexFieldsData.push({
        "name": "REW_INSTR",
        "value": action.config.taskPanelData.notes
      });
    }
    if (action.config.taskPanelData.FA) {
      debugFlexFieldsData.push({
        "name": "ANALYSIS",
        "value": action.config.taskPanelData.FA
      });
    }
    return debugFlexFieldsData;
  }

  /**
* ECO and Repair tasks
* Complete button actions for eco and repair tasks
* coming from wishlist.
*/
  _onClickOfWLTaskComplete(action: any, debugFlexFieldsData) {
    let actions = [];
    let pid = this.contextService.getDataByString("#UnitInfo.PART_NO");
    if (action.config.isEco) {
      actions.push(
        {
          "type": "condition",
          "config": {
            "operation": "isEqualTo",
            "lhs": "#ciscoDebugReplaceCloseEcocheck#@.ciscoDebugReplaceCloseEco",
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
                    "currentActionCode": this.isTncEcoDetails(action.config.taskPanelData.defect) ? "OPEN-FIT" : "OPEN-REPLACE",
                    "wishlist": "#ciscoDebugWLTasksRes",
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
                            "actions": this.actionsAfterTransactions(action, true)
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
                },

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
                }
              ]
            }
          }
        }
      );
    } else {
      actions = this.actionsAfterTransactions(action);
    }

    return actions;
  }

  /**
   * @param action 
   * This method will be called after the transactions happened for
   * wishlist items, Created repair tasks and ECo tasks also
   */
  actionsAfterTransactions(action: any, isDeleteEco?: boolean) {
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
      ];

      // if (isDeleteEco) {
      actions.push({
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
                  "key": "ciscoDebugWLTasksRes",
                  "data": "responseData"
                }
              },
              {
                "type": "addOrRemoveItemFromWL",
                "config": {
                  "taskPanelData": action.config.taskPanelData,
                  "data": "#ciscoDebugWLTasksRes",
                  "isDeleteEco": isDeleteEco ? isDeleteEco : false
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
    } else {
      actions = [
        {
          "type": "executetcDefectOperation",
          "config": {
            "defectCurrentCode": action.config.taskPanelData.defect,
            "currentActionCode": "OPEN-" + action.config.processType.toUpperCase(),
            "operation": "#defectOperation.defectCode",
            "configDebugWLData": "#ciscoDebugWLTasksRes",
            "defectRecords": "#getCiscoDebugDefectRecords",
            "defectList": "getCiscoDebugDefectRecords",
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
          "type": "onClickOfCompleteButton",
          "eventSource": "click",
          "config": {
            "action": action,
            "isLooperControlTask": false
          }
        }
      ];

      actions.push({
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
                  "key": "ciscoDebugWLTasksRes",
                  "data": "responseData"
                }
              },
              {
                "type": "addOrRemoveItemFromWL",
                "config": {
                  "taskPanelData": action.config.taskPanelData,
                  "data": "#ciscoDebugWLTasksRes",
                  "isDeleteEco": isDeleteEco ? isDeleteEco : false
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
    return actions;
  }
  addOrRemoveItemFromWL(action: any, instance, actionService: any): any {
    let wishListData = this.contextService.getDataByString(action.config.data);
    this.contextService.addToContext("ciscoDebugWishList", []);
    this.contextService.addToContext("ciscoDebugWishListLength", 0);
    actionService.handleAction({
      "type": "errorPrepareAndRender",
      "eventSource": "click",
      "config": {
        "key": "ciscoDebugWishListButtonUUID",
        "properties": {
          "titleValue": "WishList ({0})",
          "isShown": true
        },
        "valueArray": [
          "#ciscoDebugWishListLength"
        ]
      }
    });

    wishListData && wishListData.forEach((element) => {
      let actions = [];
      let locText = element.part + " , " + element.location
      actions = [
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "ciscoDebugWishList",
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
                  "uuid": "ciscoDebugWishlistQtyUUID",
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
            "key": "ciscoDebugWishListLength",
            "data": "contextLength",
            "sourceContext": "ciscoDebugWishList"
          }
        },
        {
          "type": "errorPrepareAndRender",
          "eventSource": "click",
          "config": {
            "key": "ciscoDebugWishListButtonUUID",
            "properties": {
              "titleValue": "WishList ({0})",
              "isShown": true
            },
            "valueArray": [
              "#ciscoDebugWishListLength"
            ]
          }
        }
      ]

      actions && actions.forEach((currentAction) => {
        actionService.handleAction(currentAction, instance);
      })
    });


    if (action.config.taskPanelData.activityType && action.config.taskPanelData.activityType.toLowerCase() === "eco" && action.config.isDeleteEco) {
      let dltRecRefArray = this.contextService.getDataByString("#dltRecRefArray");
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

    // actionService.handleAction({
    //   "type": "triggerClick",
    //   "eventSource": "click",
    //   "config": {
    //     "key": "ciscoDebugWishListButtonUUID"
    //   }
    // });
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
        "defectRecords": "#getCiscoDebugDefectRecords",
        "defectList": "getCiscoDebugDefectRecords",
        "configDebugWLData": "#ciscoDebugWLTasksRes",
        "key": "defectOperation"
      },
      "eventSource": "click"
    };
    actions.push(existDefectCode);
    /**
     * Replace Part - FA,ISSUEPARTS,REMOVE PARTS
     */
    if (action.config.processType === "replace") {
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
                        "actions": this.actionsAfterTransactions(action)
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
    } else if (action.config.processType === "fit" || action.config.processType === "resolder") {
      /**
     *FIT Part - FA,ISSUEPARTS
     *RESOLDER Part - FA,ISSUEPARTS
     */
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
                  "actions": this.actionsAfterTransactions(action)
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
    } else {
      /**
      *REMOVE Part - FA,REMOVE PARTS
      */
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
                  "actions": this.actionsAfterTransactions(action)
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
    if (typeof (action.config.taskPanelData.location) === "string" &&
      action.config.taskPanelData.location.includes(",")) {
      action.config.taskPanelData.location = action.config.taskPanelData.location.split(",");
    }
    if (Array.isArray(action.config.taskPanelData.location)) {
      action.config.taskPanelData.location && action.config.taskPanelData.location.forEach((currentLocation) => {
        if (action.config.manufacturerPartNumber) {
          nonInventoryList.push({
            "part": action.config.taskPanelData.componentPartno,
            "quantity": 1,
            "componentLocationDescription": currentLocation,
            "flexFieldList": {
              "flexField": debugFlexFieldsData
            },
            "manufacturerPartNumber": action.config.manufacturerPartNumber
          });
        } else {
          nonInventoryList.push({
            "part": action.config.taskPanelData.componentPartno,
            "quantity": 1,
            "componentLocationDescription": currentLocation,
            "flexFieldList": {
              "flexField": debugFlexFieldsData
            }
          });
        }
      })
    } else {
      if (action.config.manufacturerPartNumber) {
        nonInventoryList.push({
          "part": action.config.taskPanelData.componentPartno,
          "quantity": 1,
          "componentLocationDescription": action.config.taskPanelData.location,
          "flexFieldList": {
            "flexField": debugFlexFieldsData
          },
          "manufacturerPartNumber": action.config.manufacturerPartNumber
        });
      } else {
        nonInventoryList.push({
          "part": action.config.taskPanelData.componentPartno,
          "quantity": 1,
          "componentLocationDescription": action.config.taskPanelData.location,
          "flexFieldList": {
            "flexField": debugFlexFieldsData
          }
        });
      }
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
          "uuid": "CiscoDebugScrapUUID",
          "hooks": [
            {
              "type": "microservice",
              "hookType": "afterInit",
              "config": {
                "microserviceId": "getCiscoDebugPartOrOutComes",
                "requestMethod": "get",
                "isLocal": false,
                "LocalService": "assets/partOutComes.json",
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
                        "key": "ciscoDebugScrapRes",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "CiscoDebugScrapUUID",
                        "dropDownProperties": {
                          "options": "#ciscoDebugScrapRes"
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
          "dataSource": "#ciscoDebugScrapRes",
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
                "key": "ciscoDebug" + action.config.processType + "Scrap",
                "data": "elementControlValue"
              },
              "eventSource": "change"
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "ciscoDebug" + action.config.processType + "ScrapName",
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
          "uuid": "CiscoDebugSubAssmUUID",
          "hooks": [
            {
              "hookType": "afterInit",
              "type": "updateComponent",
              "config": {
                "key": "CiscoDebugSubAssmUUID",
                "dropDownProperties": {
                  "options": "#ciscoDebugRecAssemRes"
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
          "dataSource": "#ciscoDebugSubAssmRes",
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
                "key": "ciscoDebug" + action.config.processType + "SubAssm",
                "data": "elementControlValue"
              },
              "eventSource": "change"
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "ciscoDebug" + action.config.processType + "SubAssmName",
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
                "LocalService": "assets/locationAndPartDetails.json",
                "requestMethod": "get",
                "params": {
                  "locationId": "#userSelectedLocation",
                  "clientId": "#userSelectedClient",
                  "contractId": "#userSelectedContract",
                  "orderProcessTypeCode": "WRP",
                  "selectedSubassm": "#ciscoDebug" + action.config.processType + "SubAssmName",
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
                        "key": "ciscoDebugCompLocationsAndPartsRes",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "CiscoDebugLocationUUID",
                        "dropDownProperties": {
                          "options": "#ciscoDebugCompLocationsAndPartsRes",
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
          "uuid": "CiscoDebugLocationUUID",
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
          "dataSource": "#ciscoDebugCompLocationsAndPartsRes",
          "actions": [
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "ciscoDebug" + action.config.processType + "Location",
                "data": "elementControlValue"
              },
              "eventSource": "change"
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "ciscoDebug" + action.config.processType + "LocationName",
                "data": "elementControlName"
              },
              "eventSource": "change"
            },
            {
              "type": "filterPartsBasedOnLocations",
              "eventSource": "change",
              "config": {
                "processType": action.config.processType
              }
            },
            {
              "eventSource": "change",
              "type": "updateComponent",
              "config": {
                "key": "CiscoDebugPartUUID",
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
                        "key": "CiscoDebugPartUUID",
                        "fieldProperties": {
                          "replacePart": "#filteredParts.0.compPartNo"
                        }
                      }
                    },
                    {
                      "type": "selectedPartActions",
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
                                "key": "CiscoDebugPartUUID",
                                "fieldProperties": {
                                  "removePart": "#filteredParts.0.compPartNo"
                                }
                              }
                            },
                            {
                              "type": "selectedPartActions",
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
                                        "key": "CiscoDebugPartUUID",
                                        "fieldProperties": {
                                          "fitPart": "#filteredParts.0.compPartNo"
                                        }
                                      }
                                    },
                                    {
                                      "type": "selectedPartActions",
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
                                        "key": "CiscoDebugPartUUID",
                                        "fieldProperties": {
                                          "resolderPart": "#filteredParts.0.compPartNo"
                                        }
                                      }
                                    },
                                    {
                                      "type": "selectedPartActions",
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
              "type": "checkLength",
              "config": {
                "processType": action.config.processType,
                "key": "#ciscoDebug" + action.config.processType + "Location"
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
                        "key": 'ciscoQtyUUID',
                        "properties": {
                          "text": "#ciscoDebug" + action.config.processType + "AvailableQuantity"
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
          "uuid": "CiscoDebugPartUUID",
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
                "key": "ciscoDebug" + action.config.processType + "Part",
                "data": "elementControlValue"
              },
              "eventSource": "change"
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "ciscoDebug" + action.config.processType + "PartName",
                "data": "elementControlName"
              },
              "eventSource": "change"
            },
            {
              "type": "selectedPartActions",
              "config": {
                "processType": action.config.processType,
                "value": "#ciscoDebug" + action.config.processType + "Part",
                "controlName": "#ciscoDebug" + action.config.processType + "PartName"
              },
              "eventSource": "change"
            }
          ]
        },
        {
          "ctype": "nativeDropdown",
          "uuid": "CiscoDebugDefectUUID",
          "hooks": [
            {
              "hookType": "afterInit",
              "type": "updateComponent",
              "config": {
                "key": "CiscoDebugDefectUUID",
                "dropDownProperties": {
                  "options": "#ciscoDebugDefectCodesRes"
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
          "dataSource": "#ciscoDebugDefectCodesRes",
          "actions": this._defectActions(action)
        },
        {
          "ctype": "nativeDropdown",
          "uuid": "CiscoDebugFAUUID",
          "hooks": [
            {
              "hookType": "afterInit",
              "type": "updateComponent",
              "config": {
                "key": "CiscoDebugFAUUID",
                "dropDownProperties": {
                  "options": "#ciscoDebugFaFlexFieldsRes"
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
          "dataSource": "#ciscoDebugFaFlexFieldsRes",
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
                "key": "ciscoDebug" + action.config.processType + "FA",
                "data": "elementControlValue"
              },
              "eventSource": "change"
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "ciscoDebug" + action.config.processType + "FAName",
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

  selectedPartActions(action: any, instance, actionService) {
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
          "key": "ciscoDebug" + action.config.processType + "Part",
          "data": action.config.value
        },
        "eventSource": "change"
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "ciscoDebug" + action.config.processType + "PartName",
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
                  "key": 'ciscoQtyUUID',
                  "properties": {
                    "text": "#ciscoDebug" + action.config.processType + "AvailableQuantity"
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
            "componentPartNo": "#ciscoDebug" + action.config.processType + "PartName",
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
                  "key": "ciscoDebugAvailQtyRes",
                  "data": "responseData"
                }
              },
              {
                "type": "stringOperation",
                "config": {
                  "key": "ciscoDebugAvailQtyRes",
                  "lstr": "#ciscoDebugAvailQtyRes",
                  "rstr": "Available",
                  "operation": "concat",
                  "concatSymbol": " "
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "ciscoDebugStockQty",
                  "properties": {
                    "text": this.concatTheAvlQty("#ciscoDebugAvailQtyRes")
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

    let selectedPart = this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "PartName");
    if (selectedPart) {
      selectedPart = selectedPart.split("- ");
    } else {
      selectedPart = "";
    }
    this.contextService.addToContext("ciscoDebug" + action.config.processType + "Description", selectedPart[selectedPart.length - 1]);

    actionService.handleAction({
      "type": "updateComponent",
      "eventSource": "change",
      "config": {
        "key": "ciscoDebugDesLabelUUID",
        "properties": {
          "text": "#ciscoDebug" + action.config.processType + "Description"
        }
      }
    }, instance);
    if (action.config.processType === "remove") {
      let removeActions = [{
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "ciscoDebug" + action.config.processType + "AvailableQuantity",
          "data": "1"
        },
        "eventSource": "change"
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "ciscoDebug" + action.config.processType + "AvailableQuantityName",
          "data": "elementControlName"
        },
        "eventSource": "change"
      },
      {
        "type": "setDefaultValue",
        "config": {
          "key": "CiscoDebugQtyUUID",
          "defaultValue": "1"
        }
      }
      ]
      removeActions && removeActions.forEach(currentAction => {
        actionService.handleAction(currentAction, instance);
      })
    }

  }

  filterPartsBasedOnLocations(action, instance, actionService) {
    let selectedLocation = this.contextService.getDataByString("#ciscoDebug" + action.config.processType + "Location");
    let locationsRes = this.contextService.getDataByString("#ciscoDebugCompLocationsAndPartsRes");
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
            console.log(list);
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
          "key": "ciscoDebug" + action.config.processType + "Defect",
          "data": "elementControlValue"
        },
        "eventSource": "change"
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "ciscoDebug" + action.config.processType + "DefectName",
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
          "key": "CiscoDebugFlexFieldRewINSTRUUID",
          "properties": {
            "flexClass": "show"
          }
        }
      },
        {
          "type": "updateComponent",
          "eventSource": "change",
          "config": {
            "key": "ciscoDebugDesFlexUUID",
            "properties": {
              "flexClass": "show"
            }
          }
        }
      );
    }

    return actions;
  }

  checkLength(action) {
    let locations = this.contextService.getDataByString(action.config.key);
    this.contextService.addToContext("ciscoDebug" + action.config.processType + "AvailableQuantity", action.config.processType === "replace" ? locations.length : "1");
  }

  _returnRightSideItems(action: any, instance: any, actionService: any, isNewPanel) {
    let rightSideItems = [];
    if (action.config.processType !== undefined &&
      (action.config.processType == "replace" ||
        action.config.processType == "remove" ||
        action.config.processType == "fit")) {

      if (action.config.processType == "replace" ||
        action.config.processType == "fit") {
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

          "ctype": "flexFields",
          "uuid": "ciscoFailCodeTitleUUID",
          "flexClass": "label-container-radio-group-parent",
          "items": this._getDataForTable(action, actionService, qty, isNewPanel)

        });
      }

      if (action.config.processType === "remove") {
        let quantityDropDown = this._quantityDropdwon(action, instance, isNewPanel);
        rightSideItems.push(quantityDropDown);
      }

    }
    return rightSideItems;
  }

  _quantityDropdwon(action: any, instance: any, isNewPanel: any) {
    let quantityDropDown;
    if (isNewPanel) {
      quantityDropDown = {
        "ctype": "nativeDropdown",
        "uuid": "CiscoDebugQtyUUID",
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
            "uuid": "ciscoFailCodeTitleUUID",
            "flexClass": "cisco-debug-label-container-30-50",
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
        "uuid": "CiscoDebugFlexFieldRewINSTRUUID",
        "visibility": false,
        "flexClass": "cisco-debug-label-container-30-50 hide",
        "items": [
          {
            "ctype": "label",
            "text": "REW_INSTR",
            "labelClass": "greyish-black subtitle1-align-self"
          },
          {
            "ctype": "textField",
            "uuid": "CiscoDebugRewINSTRUUID",
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
                  "key": "ciscoDebug" + action.config.processType + "RewINSTR"
                }
              }
            ],
            "name": "ciscoDebug" + action.config.processType + "RewINSTR",
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
          rewINSTR = {
            "ctype": "flexFields",
            "uuid": "ciscoFailCodeTitleUUID",
            "flexClass": "cisco-debug-label-container-30-50",
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
    let currentData = action.config.taskPanelData;
    let data;
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
      "uuid": isNewPanel ? "ciscoDebugDesFlexUUID" : "ciscoDebugDesFlexUUID#@",
      "flexClass": isNewPanel ? "cisco-debug-label-container-30-50 hide" : "cisco-debug-label-container-30-50",
      "items": [
        {
          "ctype": "label",
          "text": "Description",
          "labelClass": "greyish-black subtitle1-align-self"
        },
        {
          "ctype": "label",
          "uuid": isNewPanel ? "ciscoDebugDesLabelUUID" : "ciscoDebugDesLabelUUID#@",
          "text": isNewPanel ? "" : data,
          "labelClass": "greyish-black"
        }
      ]
    };


    // }
    return description;
  }

  disableOrEnableAllIcons(action, instance, actionService) {
    let iconsList = [
      "ciscoDebugReplaceIconUUID",
      "ciscoDebugRemoveIconUUID",
      "ciscoDebugFitIconUUID",
      "ciscoDebugResolderIconUUID",
      "ciscoDebugScrapIconUUID"
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
            "uuid": isNewPanel ? "ciscoQtyUUID" : "ciscoQtyUUID#@",
            "text": qty != null ? qty.toString() : "0",
            "labelClass": "greyish-black"
          },
          {
            "ctype": "label",
            "uuid": isNewPanel ? "ciscoDebugStockQty" : "ciscoDebugStockQty#@",
            "text": "",
            "labelClass": "greyish-black cisco-stock"
          }
        ]
      });
    });

    return tableSourceList;
  }

  ciscoDebugCreateFailCode(action: any, instance: any, actionService: any) {
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
              "uuid": "CiscoDebugFailCodeUUID",
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
              "panelClass": "overflow-show top-margin",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "flexFields",
                  "uuid": "ciscoNotesTitleUUID",
                  "flexClass": "cisco-debug-label-container-30-50",
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

  ciscoDebugWishListPanels(action: any, instance: any, actionService: any) {
    let ecoTasksRes = this.contextService.getDataByString(action.config.data);
    ecoTasksRes = ecoTasksRes instanceof Array ? ecoTasksRes : [];
    ecoTasksRes && ecoTasksRes.forEach((item) => {
      item["FA"] = item.analysis;
      if (item.reworkInstruction) {
        item["notes"] = item.reworkInstruction;
      }
      let action = {
        "config": {
          "svgIcon": item.taskType.split(" ")[0].toLowerCase(),
          "text": item.taskType.split(" ")[0],
          "processType": item.taskType.split(" ")[0].toLowerCase(),
          "taskPanelData": item,
          "isLooperControlTask": true,
          "isEco": item.activityType !== undefined && item.activityType === "ECO" ? true : false,
          "isWishList": true
        }
      };
      this.onClickOfCompleteButton(action, instance, actionService);
    })
  }

  ciscoDebugCreateRepairPanels(action: any, instance: any, actionService: any) {
    let repairTasksRes = this.contextService.getDataByString(action.config.data);
    let repairTask = Object.keys(repairTasksRes);
    repairTask && repairTask.forEach((key) => {
      repairTasksRes && repairTasksRes[key].forEach((item) => {
        item.taskType = item.taskType.split(" ")[0].toLowerCase();
        item["qty"] = item.quantity;
        item["subAssm"] = item.subassm;
        let action = {
          "config": {
            "svgIcon": key,
            "text": item.taskType,
            "processType": key,
            "taskPanelData": item,
            "isLooperControlTask": true,
            "isEco": false
          }
        };
        this.onClickOfCompleteButton(action, instance, actionService);
      })
    })
  }

  _getItems(currentItem: any) {
    let currentData = currentItem.config.taskPanelData;
    let activityType = currentData.activityType != undefined ? currentData.activityType : "Repair ";
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
                : currentKey === "part" ? "Part" : "FA";
          if (activityType.toLowerCase() === "eco" && currentKey === "FA") { }
          else {
            items.push(this._addItem(label, currentData[currentKey]));
          }
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
      "flexClass": "cisco-debug-label-container-30-50",
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


  concatTheAvlQty(context) {
    let qty
    if (context.startsWith('#')) {
      qty = this.contextService.getDataByString(context);
    } else {
      qty = context;
    }

    return (qty > 0) ? qty + " Available" : "0 Available"
  }

  getSerialNuberByAssemblyCode(assemblyCode) {
    let configDebugPCBs = this.contextService.getDataByString("#ciscoDebugPCBRes");
    let index = configDebugPCBs.filter(e => e.assemblyCode == assemblyCode);
    // console.log(index[0].serialNumber);
    return index[0].serialNumber;
  }

  filterMasterName(action, instance, actionService) {
    let masterdata = action.config.data;
    let taskdata = action.config.taskData;
    let processType = taskdata.taskType.split(" ")[0];
    let activityType = taskdata.activityType;
    masterdata = this.contextService.getDataByString(masterdata);
    let reworkDetails = this.contextService.getDataByString("#getReworkDetails");

    if (activityType == "ECO") {
      let taskMasterData = {
        defectiveMaster: {},
        newMaster: {}
      };

      let task = reworkDetails.eco.filter(e => e.readonlyTask == "true" && e.defectCode == taskdata.defect && e.location == taskdata.location && e.pcbPn == taskdata.subAssm)
      task = task[0];
      if (task.vpn && task.vpn !== null && task.vpn !== undefined) {
        let defectiveDetailsName = task.vpn.split(",")[0];
        let newDetailsName = task.vpn.split(",")[1];

        let defectiveDetails = masterdata.vpnDetials.filter(e => e.manufacturerPartNo == defectiveDetailsName);
        let newDetails = masterdata.vpnDetials.filter(e => e.manufacturerPartNo == newDetailsName);

        taskMasterData.defectiveMaster = {
          "manufacturer": defectiveDetails[0].manufacturerName,
          "value": defectiveDetailsName
        };
        taskMasterData.newMaster = {
          "manufacturer": newDetails[0].manufacturerName,
          "value": newDetailsName
        };
        this.contextService.addToContext(action.config.key, taskMasterData);
      }


    } else if (processType == "Replace") {
      let taskMasterData = {
        defectiveMaster: {},
        newMaster: {}
      };

      let task = reworkDetails.replace.filter(e => e.readonlyTask == "true" && e.defectCode == taskdata.defect && e.location == taskdata.location && e.pcbPn == taskdata.subAssm)
      task = task[0];
      if (task.vpn && task.vpn !== null && task.vpn !== undefined) {
        let defectiveDetailsName = task.vpn.split(",")[0];
        let newDetailsName = task.vpn.split(",")[1];

        let defectiveDetails = masterdata.vpnDetials.filter(e => e.manufacturerPartNo == defectiveDetailsName);
        let newDetails = masterdata.vpnDetials.filter(e => e.manufacturerPartNo == newDetailsName);

        taskMasterData.defectiveMaster = {
          "manufacturer": defectiveDetails[0].manufacturerName,
          "value": defectiveDetailsName
        };
        taskMasterData.newMaster = {
          "manufacturer": newDetails[0].manufacturerName,
          "value": newDetailsName
        };
        this.contextService.addToContext(action.config.key, taskMasterData);
      }
    } else if (processType == "Remove" || processType == "Fit" || processType == "Resolder") {
      let taskMasterData = {
        master: {}
      };

      let task;

      if (processType == "Remove") {
        task = reworkDetails.remove.filter(e => e.readonlyTask == "true" && e.defectCode == taskdata.defect && e.pcbPn == taskdata.subAssm)
        task = task[0];
      }
      if (processType == "Fit") {
        task = reworkDetails.fit.filter(e => e.readonlyTask == "true" && e.defectCode == taskdata.defect && e.pcbPn == taskdata.subAssm)
        task = task[0];
      }
      if (processType == "Resolder") {
        task = reworkDetails.resolder.filter(e => e.readonlyTask == "true" && e.defectCode == taskdata.defect && e.pcbPn == taskdata.subAssm)
        task = task[0];
      }
      if (task.vpn) {
        let newDetails = task.vpn;
        newDetails = masterdata.vpnDetials.filter(e => e.manufacturerPartNo == newDetails);

        taskMasterData.master = {
          "manufacturer": newDetails[0].manufacturerName,
          "value": task.vpn
        };
        this.contextService.addToContext(action.config.key, taskMasterData);
      }
    }
    if (action.config.afterActions) {
      let actions = action.config.afterActions;
      actions && actions.forEach(element => {
        actionService.handleAction(element);
      });
    }

  }

  filterReplaceDataCode(flexField, apiType) {
    let data = flexField;
    let arr = [];
    data && data.forEach(element => {
      if (element.name == "DATE_CODE" || element["name"] == "DATE_CODE") {
        let dataVal = element.value;
        if (apiType == "issue") {
          let filterDateCode = {
            "name": "DATE_CODE",
            "value": dataVal.split(",")[1]
          }
          arr.push(filterDateCode);
        } else if (apiType == "remove") {
          let filterDateCode = {
            "name": "DATE_CODE",
            "value": dataVal.split(",")[0]
          }
          arr.push(filterDateCode);
        }
      } else {
        arr.push(element);
      }
    });
    return arr;
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
}