import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class VerifoneMegalabelService {
  constructor(
    private contextService: ContextService
  ) {}

  vfcheckIsWCLooping(action: any, instance: any, actionService: any) {
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
                  "microserviceId": "getverifoneMegaLabelValidateTasks",
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
                          "key": "verifoneMegaLabelValidateTaskRes",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "verifone-verifoneMegaLabelValidateTaskPanels",
                        "config": {
                          "data": "#getverifoneMegaLabelValidateTasks"
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
                  "microserviceId": "getverifoneMegaLabelFailCodeTask",
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
                          "key": "verifoneMegaLabelFailCodeRes",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "verifone-verifoneMegaLabelCreateFailCode",
                        "config": {
                          "data": "#verifoneMegaLabelFailCodeRes"
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

  vfhandleProcessActions(action, instance, actionService) {
    let selectedProcess = this.contextService.getDataByString("#verifoneMegaLabelSelectedProcess");
    // console.log("verifoneMegaLabelSelectedProcess : ", selectedProcess);

    let processActions = [
      {
        "type": "condition",
        "config": {
          "operation": "isEqualTo",
          "lhs": "#currentTaskUUID",
          "rhs": "verifoneMegaLabelTaskPanelUUID"
        },
        "eventSource": "click",
        "responseDependents": {
          "onSuccess": {
            "actions": []
          },
          "onFailure": {
            "actions": [
              {
                "type": "deleteComponent",
                "eventSource": "click",
                "config": {
                  "key": "verifoneMegaLabelTaskPanelUUID"
                }
              },
              {
                "type": "createComponent",
                "config": {
                  "targetId": "pageUUID",
                  "containerId": "bodypage",
                  "data": {
                    "ctype": "taskPanel",
                    "uuid": "verifoneMegaLabelTaskPanelUUID",
                    "title": "",
                    "header": {
                      "title": 'Add Print',
                      "svgIcon": 'print',
                      "iconClass": "active-header",
                      "status": "",
                      "statusIcon": "close",
                      "statusClass": "header-icon"
                    },
                    "expanded": true,
                    "hideToggle": true,
                    "splitView": false,
                    "verticalsplitView": true,
                    "bodyclass": "splitView",
                    "collapsedHeight": "40px",
                    "expandedHeight": "40px",
                    "panelClass": "top-margin",
                    "topItemsClass": "mt-4 pb-3 border-bottom",
                    "taskPanelHeaderClass": "task-panel-header-color-light-grey",
                    "visibility": true,
                    "hooks": [],
                    "validations": [],
                    "actions": [
                      {
                        "type": "deleteComponent",
                        "eventSource": "click",
                        "config": {
                          "key": "verifoneMegaLabelTaskPanelUUID"
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
                        "type": "verifone-disableOrEnableAllIcons",
                        "eventSource": "click",
                        "config": {
                          "currentProcess": action.config.processType,
                          "isDisable": false
                        }
                      },
                    ],
                    "topItems": [
                      {
                        "ctype": "iconText",
                        "imgtext": "LBL 159 -300-02-C_UX300_ID",
                        "uuid": "lblIdUUID",
                        "textClass": "ciscoTCFlexTxt",
                        "iconTextClass": "verifoneMegaLabelFlexImg  show",
                        "label": "LBL 159 -300-02-C_UX300_ID",
                        "imageSrc": "../../../assets/Images/bezel.png",
                        "pClass": "normal",
                        "actions": [
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblIdUUID",
                              "properties": {
                                "pClass": "active"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblEthImgUUID",
                              "properties": {
                                "pClass": "normal"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblPtidUUID",
                              "properties": {
                                "pClass": "normal"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblSnImgUUID",
                              "properties": {
                                "pClass": "normal"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "verifoneMegaLabelTaskPanelUUID",
                              "properties": {
                                "splitView": true,
                                "bodyClass": "pb-0",
                                "ItemsClass": "megaLabelitemClass",
                              }
                            }
                          },
                          {
                            "type": "context",
                            "eventSource": "click",
                            "config": {
                              "requestMethod": "add",
                              "key": "isPrintedOption",
                              "data": "bezel"
                            }
                          },
                          {
                            "type": "verifone-displayTextOnSelect",
                            "eventSource": "click"
                          }
                        ]
                      },
                      {
                        "ctype": "iconText",
                        "uuid": "lblEthImgUUID",
                        "imgtext": "LBL000 -019-01-A_UX300_ETH",
                        "textClass": "ciscoTCFlexTxt",
                        "iconTextClass": "verifoneMegaLabelFlexImg  show",
                        "label": "LBL000 -019-01-A_UX300_ETH",
                        "imageSrc": "../../../assets/Images/bumper.png",
                        "pClass": "normal",
                        "actions": [
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblIdUUID",
                              "properties": {
                                "pClass": "normal"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblEthImgUUID",
                              "properties": {
                                "pClass": "active"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblPtidUUID",
                              "properties": {
                                "pClass": "normal"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblSnImgUUID",
                              "properties": {
                                "pClass": "normal"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "verifoneMegaLabelTaskPanelUUID",
                              "properties": {
                                "splitView": true,
                                "bodyClass": "pb-0",
                                "ItemsClass": "megaLabelitemClass",
                              }
                            }
                          },
                          {
                            "type": "context",
                            "eventSource": "click",
                            "config": {
                              "requestMethod": "add",
                              "key": "isPrintedOption",
                              "data": "bumper"
                            }
                          },
                          {
                            "type": "verifone-displayTextOnSelect",
                            "eventSource": "click"
                          }
                        ]
                      },
                      {
                        "ctype": "iconText",
                        "uuid": "lblPtidUUID",
                        "imgtext": "LBL000-003-01-A_UX300_PTID",
                        "textClass": "ciscoTCFlexTxt",
                        "iconTextClass": "verifoneMegaLabelFlexImg  show",
                        "label": "LBL000-003-01-A_UX300_PTID",
                        "imageSrc": "../../../assets/Images/cover.png",
                        "pClass": "normal",
                        "actions": [
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblIdUUID",
                              "properties": {
                                "pClass": "normal"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblEthImgUUID",
                              "properties": {
                                "pClass": "normal"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblPtidUUID",
                              "properties": {
                                "pClass": "active"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblSnImgUUID",
                              "properties": {
                                "pClass": "normal"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "verifoneMegaLabelTaskPanelUUID",
                              "properties": {
                                "splitView": true,
                                "bodyClass": "pb-0",
                                "ItemsClass": "megaLabelitemClass",
                              }
                            }
                          },
                          {
                            "type": "context",
                            "eventSource": "click",
                            "config": {
                              "requestMethod": "add",
                              "key": "isPrintedOption",
                              "data": "coverone"
                            }
                          },
                          {
                            "type": "verifone-displayTextOnSelect",
                            "eventSource": "click"
                          }
                        ]
                      },
                      {
                        "ctype": "iconText",
                        "uuid": "lblSnImgUUID",
                        "imgtext": "LBL000-015-04-A_UX300_SN",
                        "textClass": "ciscoTCFlexTxt",
                        "iconTextClass": "verifoneMegaLabelFlexImg  show",
                        "label": "LBL000-015-04-A_UX300_SN",
                        "imageSrc": "../../../assets/Images/cover.png",
                        "pClass": "normal",
                        "actions": [
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblIdUUID",
                              "properties": {
                                "pClass": "normal"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblEthImgUUID",
                              "properties": {
                                "pClass": "normal"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblPtidUUID",
                              "properties": {
                                "pClass": "normal"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "lblSnImgUUID",
                              "properties": {
                                "pClass": "active"
                              }
                            }
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "verifoneMegaLabelTaskPanelUUID",
                              "properties": {
                                "splitView": true,
                                "bodyClass": "pb-0",
                                "ItemsClass": "megaLabelitemClass",
                              }
                            }
                          },
                          {
                            "type": "context",
                            "eventSource": "click",
                            "config": {
                              "requestMethod": "add",
                              "key": "isPrintedOption",
                              "data": "covertwo"
                            }
                          },
                          {
                            "type": "verifone-displayTextOnSelect",
                            "eventSource": "click"
                          }
                        ]
                      }
                    ],
                    "items": this._getLeftSideItemsforAddPrint(action, instance, actionService),
                    "rightItems": this._getRightSideItemsforAddPrint(action, instance, actionService),
                    "footer": [
                      {
                        "ctype": "button",
                        "color": "primary",
                        "text": "Print",
                        "class": "primary-btn",
                        "uuid": "CompleteButtonUUID",
                        "parentuuid": "replaceTaskUUID",
                        "visibility": true,
                        "checkGroupValidity": false,
                        "disabled": false,
                        "type": "submit",
                        "tooltip": "",
                        "hooks": [],
                        "validations": [],
                        "actions": [
                          {
                            "type": "verifone-verifoneMegaLabelCompleteButton",
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
            ]
          }
        }
      }
    ];

    this.executeActions(processActions, instance, actionService);
  }

  /*
   * This method is being called when the 
   * 1) complete button of task panel from tool bar is clicked and 
   * 2) for looper control tasks coming from API.  
  */
  vfonClickOfCompleteButton(action: any, instance: any, actionService: any) {
    let completeButtonActions = [];
    let taskPanelData;
    if (!action.config.isLooperControlTask) {
      action = action.config.action;
      taskPanelData = {
        "subAssm": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "SubAssmName"),
        "description": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "Description"),
        "location": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "Location"),
        "defect": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "Defect"),
        "qty": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "AvailableQuantity"),
        "part": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "PartName"),
        "scrap": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "Scrap"),
        "notes": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "RewINSTR"),
        "FA": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "FA"),
        "assemblyCode": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "SubAssm"),
        "componentPartno": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "Part"),
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
          "key": "verifoneMegaLabelTaskPanelUUID"
        }
      },
      {
        "type": "createComponent",
        "config": {
          "targetId": "pageUUID",
          "containerId": "prebodysectiontwo",
          "data": {
            "ctype": "taskPanel",
            "uuid": "verifoneMegaLabelCreatedTaskPanelUUID",
            "uniqueUUID": true,
            "updateUUID": true,
            "title": "",
            "columnWiseTitle": true,
            "header": {
              "svgIcon": "description_icon",
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
              ""
            ],
            "inputClasses": [
              "parent1-width",
              "parent2"
            ],
            "expanded": false,
            "hideToggle": true,
            "splitView": true,
            "bodyClass": "pb-0",
            "ItemsClass": "megaLabelitemClass",
            "collapsedHeight": "40px",
            "expandedHeight": "40px",
            "bodyclass": "splitView",
            "panelClass": "top-margin",
            "leftDivclass": "width:50%",
            "rightDivclass": "width:50%",
            "taskPanelHeaderClass": "task-panel-header-color-light-grey",
            "visibility": false,
            "hooks": this.completedTaskHooks(action),
            "validations": [],
            "actions": [
              {
                "type": "verifone-disableOrEnableAllIcons",
                "eventSource": "click",
                "config": {
                  "currentProcess": action.config.processType,
                  "isDisable": false
                }
              },
            ],
            "items": this._getItems(action, instance, actionService),
            "rightItems": this._getRightSideItems(action, instance, actionService),
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
  vfValidateTaskPanels(action: any, instance: any, actionService: any) {
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
              "uuid": "verifoneMegaLabelCreatedTaskPanelUUID",
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
                          "type": "verifone-filterMasterName",
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
                      "name": "verifoneMegaLabelIsIssueResolved",
                      "selectedVal": "",
                      "subProcess": "verifoneMegaLabel",
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
                      "uuid": "verifoneMegaLabelIsIssueResolvedUUID#@",
                      "hooks": [],
                      "actions": [{
                        "eventSource": "change",
                        "type": "context",
                        "config": {
                          "data": "elementControlValue",
                          "requestMethod": "add",
                          "key": "verifoneMegaLabelIsIssueResolved#@"
                        }
                      },
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "verifoneMegaLabelValidateComplete#@",
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
                  "uuid": "verifoneMegaLabelValidateComplete#@",
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
                              "type": "verifone-filterMasterName",
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
      "value": "#verifoneMegaLabelIsIssueResolved#@"
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
                                            "key": "verifoneMegaLabelValidateComplete#@",
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
                                              "key": "verifoneMegaLabelValidateComplete#@",
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
                              "key": "verifoneMegaLabelValidateComplete#@",
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
                              "key": "verifoneMegaLabelValidateComplete#@",
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
            "target": "verifoneMegaLabelWishList",
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
                  "uuid": "verifoneMegaLabelWishlistQtyUUID",
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
            "key": "verifoneMegaLabelWishListLength",
            "data": "contextLength",
            "sourceContext": "verifoneMegaLabelWishList"
          }
        },
        {
          "type": "errorPrepareAndRender",
          "hookType": "afterInit",
          "config": {
            "key": "verifoneMegaLabelWishListButtonUUID",
            "properties": {
              "titleValue": "WishList ({0})",
              "isShown": true
            },
            "valueArray": [
              "#verifoneMegaLabelWishListLength"
            ]
          }
        },
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "verifoneMegaLabelTableData",
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
          "microserviceId": "getverifoneMegaLabelAvailQty",
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
                  "key": "verifoneMegaLabelAvailQtyRes#@",
                  "data": "responseData"
                }
              },
              {
                "type": "stringOperation",
                "config": {
                  "key": "verifoneMegaLabelAvailQtyRes#@",
                  "lstr": "#verifoneMegaLabelAvailQtyRes#@",
                  "rstr": "Available",
                  "operation": "concat",
                  "concatSymbol": " "
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "verifoneMegaLabelStockQty#@",
                  "properties": {
                    "text": this.concatTheAvlQty("#verifoneMegaLabelAvailQtyRes#@")
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
            "key": "verifoneMegaLabelStockQty#@",
            "properties": {
              "text": this.concatTheAvlQty("#verifoneMegaLabelAvailQtyRes")
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
    return "Print - "
  }

  _getFooter(action: any, instance: any, actionService: any) {
    let footerItems = [];


    footerItems.push({
      "ctype": "button",
      "color": "primary",
      "text": "Print",
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

  vfcreatedTaskCompleteButtonActions(action: any, instance: any, actionService: any) {
    let actions = [];
    let debugFlexFieldsData = [];
    let taskPanelData;
    if (!action.config.isLooperControlTask) {
      action = action.config.action;
      taskPanelData = {
        "subAssm": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "SubAssmName"),
        "description": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "Description"),
        "location": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "Location"),
        "defect": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "Defect"),
        "qty": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "AvailableQuantity"),
        "part": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "PartName"),
        "scrap": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "Scrap"),
        "notes": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "RewINSTR"),
        "FA": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "FA"),
        "assemblyCode": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "SubAssm"),
        "componentPartno": this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "Part"),
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
        "type": "verifone-onClickOfCompleteButton",
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
            "lhs": "#verifoneMegaLabelReplaceCloseEcocheck#@.verifoneMegaLabelReplaceCloseEco",
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
                    "wishlist": "#verifoneMegaLabelWLTasksRes",
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
      // actions.push({
      //   "type": "microservice",
      //   "hookType": "afterInit",
      //   "config": {
      //     "microserviceId": "getverifoneMegaLabelWishlistItems",
      //     "isLocal": true,
      //     "LocalService": "assets/Responses/ciscoTaskPanelDataResponse.json",
      //     "requestMethod": "get",
      //     "params": {
      //       "itemId": "#UnitInfo.ITEM_ID",
      //       "workCenterId": "#UnitInfo.WORKCENTER_ID"
      //     }
      //   },
      //   "responseDependents": {
      //     "onSuccess": {
      //       "actions": [
      //         {
      //           "type": "context",
      //           "config": {
      //             "requestMethod": "add",
      //             "key": "verifoneMegaLabelWLTasksRes",
      //             "data": "responseData"
      //           }
      //         },
      //         {
      //           "type": "verifone-addOrRemoveItemFromWL",
      //           "config": {
      //             "taskPanelData": action.config.taskPanelData,
      //             "data": "#verifoneMegaLabelWLTasksRes",
      //             "isDeleteEco": isDeleteEco ? isDeleteEco : false
      //           }
      //         }
      //       ]
      //     },
      //     "onFailure": {
      //       "actions": [
      //         {
      //           "type": "context",
      //           "config": {
      //             "requestMethod": "add",
      //             "key": "errorDisp",
      //             "data": "responseData"
      //           }
      //         },
      //         {
      //           "type": "condition",
      //           "config": {
      //             "operation": "isEqualTo",
      //             "lhs": "#errorDisp",
      //             "rhs": "No Record Found"
      //           },
      //           "responseDependents": {
      //             "onSuccess": {
      //               "actions": [
      //                 {
      //                   "type": "updateComponent",
      //                   "config": {
      //                     "key": "errorTitleUUID",
      //                     "properties": {
      //                       "titleValue": "#errorDisp",
      //                       "isShown": false
      //                     }
      //                   }
      //                 }
      //               ]
      //             },
      //             "onFailure": {
      //               "actions": [
      //                 {
      //                   "type": "updateComponent",
      //                   "config": {
      //                     "key": "errorTitleUUID",
      //                     "properties": {
      //                       "titleValue": "#errorDisp",
      //                       "isShown": true
      //                     }
      //                   }
      //                 }
      //               ]
      //             }
      //           }
      //         }
      //       ]
      //     }
      //   }
      // });
    } else {
      actions = [
        {
          "type": "executetcDefectOperation",
          "config": {
            "defectCurrentCode": action.config.taskPanelData.defect,
            "currentActionCode": "OPEN-" + action.config.processType.toUpperCase(),
            "operation": "#defectOperation.defectCode",
            "configDebugWLData": "#verifoneMegaLabelWLTasksRes",
            "defectRecords": "#getverifoneMegaLabelDefectRecords",
            "defectList": "getverifoneMegaLabelDefectRecords",
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
          "type": "verifone-onClickOfCompleteButton",
          "eventSource": "click",
          "config": {
            "action": action,
            "isLooperControlTask": false
          }
        }
      ];

      // actions.push({
      //   "type": "microservice",
      //   "hookType": "afterInit",
      //   "config": {
      //     "microserviceId": "getverifoneMegaLabelWishlistItems",
      //     "isLocal": false,
      //     "LocalService": "assets/Responses/ciscoTaskPanelDataResponse.json",
      //     "requestMethod": "get",
      //     "params": {
      //       "itemId": "#UnitInfo.ITEM_ID",
      //       "workCenterId": "#UnitInfo.WORKCENTER_ID"
      //     }
      //   },
      //   "responseDependents": {
      //     "onSuccess": {
      //       "actions": [
      //         {
      //           "type": "context",
      //           "config": {
      //             "requestMethod": "add",
      //             "key": "verifoneMegaLabelWLTasksRes",
      //             "data": "responseData"
      //           }
      //         },
      //         {
      //           "type": "verifone-addOrRemoveItemFromWL",
      //           "config": {
      //             "taskPanelData": action.config.taskPanelData,
      //             "data": "#verifoneMegaLabelWLTasksRes",
      //             "isDeleteEco": isDeleteEco ? isDeleteEco : false
      //           }
      //         }
      //       ]
      //     },
      //     "onFailure": {
      //       "actions": [
      //         {
      //           "type": "context",
      //           "config": {
      //             "requestMethod": "add",
      //             "key": "errorDisp",
      //             "data": "responseData"
      //           }
      //         },
      //         {
      //           "type": "condition",
      //           "config": {
      //             "operation": "isEqualTo",
      //             "lhs": "#errorDisp",
      //             "rhs": "No Record Found"
      //           },
      //           "responseDependents": {
      //             "onSuccess": {
      //               "actions": [
      //                 {
      //                   "type": "updateComponent",
      //                   "config": {
      //                     "key": "errorTitleUUID",
      //                     "properties": {
      //                       "titleValue": "#errorDisp",
      //                       "isShown": false
      //                     }
      //                   }
      //                 }
      //               ]
      //             },
      //             "onFailure": {
      //               "actions": [
      //                 {
      //                   "type": "updateComponent",
      //                   "config": {
      //                     "key": "errorTitleUUID",
      //                     "properties": {
      //                       "titleValue": "#errorDisp",
      //                       "isShown": true
      //                     }
      //                   }
      //                 }
      //               ]
      //             }
      //           }
      //         }
      //       ]
      //     }
      //   }
      // });
    }
    return actions;
  }
  vfaddOrRemoveItemFromWL(action: any, instance, actionService: any): any {
    let wishListData = this.contextService.getDataByString(action.config.data);
    this.contextService.addToContext("verifoneMegaLabelWishList", []);
    this.contextService.addToContext("verifoneMegaLabelWishListLength", 0);
    actionService.handleAction({
      "type": "errorPrepareAndRender",
      "eventSource": "click",
      "config": {
        "key": "verifoneMegaLabelWishListButtonUUID",
        "properties": {
          "titleValue": "WishList ({0})",
          "isShown": true
        },
        "valueArray": [
          "#verifoneMegaLabelWishListLength"
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
            "target": "verifoneMegaLabelWishList",
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
                  "uuid": "verifoneMegaLabelWishlistQtyUUID",
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
            "key": "verifoneMegaLabelWishListLength",
            "data": "contextLength",
            "sourceContext": "verifoneMegaLabelWishList"
          }
        },
        {
          "type": "errorPrepareAndRender",
          "eventSource": "click",
          "config": {
            "key": "verifoneMegaLabelWishListButtonUUID",
            "properties": {
              "titleValue": "WishList ({0})",
              "isShown": true
            },
            "valueArray": [
              "#verifoneMegaLabelWishListLength"
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
    //     "key": "verifoneMegaLabelWishListButtonUUID"
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
        "defectRecords": "#getverifoneMegaLabelDefectRecords",
        "defectList": "getverifoneMegaLabelDefectRecords",
        "configDebugWLData": "#verifoneMegaLabelWLTasksRes",
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
          "requestMethod": "get",
          "isLocal": true,
          "LocalService": "assets/Responses/mockBGA.json",
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
                  // "serialNumber": this.getSerialNuberByAssemblyCode(action.config.taskPanelData.assemblyCode)
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
                "requestMethod": "get",
                "isLocal": true,
                "LocalService": "assets/Responses/mockBGA.json",
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
                      "requestMethod": "get",
                      "isLocal": true,
                      "LocalService": "assets/Responses/mockBGA.json",
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
                  // "serialNumber": this.getSerialNuberByAssemblyCode(action.config.taskPanelData.assemblyCode)
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
                  // "serialNumber": this.getSerialNuberByAssemblyCode(action.config.taskPanelData.assemblyCode)
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

  _getLeftSideItemsforAddPrint(action: any, instance: any, actionService: any) {
    let items = [];
    items = [
      {
        "ctype": "textField",
        "uuid": "leftpartNumberUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "required": true,
        "label": "Part Number",
        "defaultValue": "123456",
        "labelPosition": "left",
        "name": "leftPartNumber",
        "value": "",
        "disabled": true,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "leftDescriptionUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "required": true,
        "label": "Description",
        "labelPosition": "left",
        "name": "leftDescription",
        "defaultValue": "123456",
        "value": "",
        "disabled": false,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "leftIOEthernetMACUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "required": true,
        "label": "I/O Ethernet MAC",
        "labelPosition": "left",
        "name": "leftIOEthernetMAC",
        "value": "",
        "disabled": false,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "leftmodelUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "required": true,
        "label": "Model",
        "defaultValue": "ENGAGE",
        "labelPosition": "left",
        "name": "leftModel",
        "value": "",
        "disabled": true,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "leftPTIDUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "required": true,
        "label": "PTID",
        "defaultValue": "0987654321",
        "labelPosition": "left",
        "name": "leftPTID",
        "value": "",
        "disabled": false,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "leftBTMacUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "defaultValue": "0987654321",
        "required": true,
        "label": "BT MAC",
        "labelPosition": "left",
        "name": "leftBTMac",
        "value": "",
        "disabled": false,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "leftwifiMacUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "required": true,
        "label": "WIFI MAC",
        "labelPosition": "left",
        "name": "leftwifiMac",
        "value": "",
        "disabled": false,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "leftsubPartNoUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "defaultValue": "6543217890",
        "required": true,
        "label": "SUB Part Number",
        "labelPosition": "left",
        "name": "leftsubPartNo",
        "value": "",
        "disabled": true,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "leftrevisionUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "defaultValue": "01",
        "required": true,
        "label": "Revision",
        "labelPosition": "left",
        "name": "leftrevision",
        "value": "",
        "disabled": false,
        "hidden": true
      },
      {
        "ctype": "title",
        "uuid": "PrinterTextUUID",
        "title": "Printer",
        "titleClass": "col-6 subtitle1",
        "titleValue": "Printer 2 - 300DPI",
        "titleValueClass": "body font-normal verifoneProblemDescLayout",
        "hidden": true
      },
    ];
    return items;
  }

  vfselectedPartActions(action: any, instance, actionService) {
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
          "key": "verifoneMegaLabel" + action.config.processType + "Part",
          "data": action.config.value
        },
        "eventSource": "change"
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "verifoneMegaLabel" + action.config.processType + "PartName",
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
                    "text": "#verifoneMegaLabel" + action.config.processType + "AvailableQuantity"
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
          "microserviceId": "getverifoneMegaLabelAvailQty",
          "isLocal": false,
          "LocalService": "assets/Responses/ciscoTaskPanelDataResponse.json",
          "requestMethod": "get",
          "params": {
            "componentPartNo": "#verifoneMegaLabel" + action.config.processType + "PartName",
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
                  "key": "verifoneMegaLabelAvailQtyRes",
                  "data": "responseData"
                }
              },
              {
                "type": "stringOperation",
                "config": {
                  "key": "verifoneMegaLabelAvailQtyRes",
                  "lstr": "#verifoneMegaLabelAvailQtyRes",
                  "rstr": "Available",
                  "operation": "concat",
                  "concatSymbol": " "
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "verifoneMegaLabelStockQty",
                  "properties": {
                    "text": this.concatTheAvlQty("#verifoneMegaLabelAvailQtyRes")
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

    let selectedPart = this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "PartName");
    if (selectedPart) {
      selectedPart = selectedPart.split("- ");
    } else {
      selectedPart = "";
    }
    this.contextService.addToContext("verifoneMegaLabel" + action.config.processType + "Description", selectedPart[selectedPart.length - 1]);

    actionService.handleAction({
      "type": "updateComponent",
      "eventSource": "change",
      "config": {
        "key": "verifoneMegaLabelDesLabelUUID",
        "properties": {
          "text": "#verifoneMegaLabel" + action.config.processType + "Description"
        }
      }
    }, instance);
    if (action.config.processType === "remove") {
      let removeActions = [{
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "verifoneMegaLabel" + action.config.processType + "AvailableQuantity",
          "data": "1"
        },
        "eventSource": "change"
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "verifoneMegaLabel" + action.config.processType + "AvailableQuantityName",
          "data": "elementControlName"
        },
        "eventSource": "change"
      },
      {
        "type": "setDefaultValue",
        "config": {
          "key": "verifoneMegaLabelQtyUUID",
          "defaultValue": "1"
        }
      }
      ]
      removeActions && removeActions.forEach(currentAction => {
        actionService.handleAction(currentAction, instance);
      })
    }

  }

  vfFilterPartsBasedOnLocations(action, instance, actionService) {
    let selectedLocation = this.contextService.getDataByString("#verifoneMegaLabel" + action.config.processType + "Location");
    let locationsRes = this.contextService.getDataByString("#verifoneMegaLabelCompLocationsAndPartsRes");
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
          "key": "verifoneMegaLabel" + action.config.processType + "Defect",
          "data": "elementControlValue"
        },
        "eventSource": "change"
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "verifoneMegaLabel" + action.config.processType + "DefectName",
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
          "key": "verifoneMegaLabelFlexFieldRewINSTRUUID",
          "properties": {
            "flexClass": "show"
          }
        }
      },
        {
          "type": "updateComponent",
          "eventSource": "change",
          "config": {
            "key": "verifoneMegaLabelDesFlexUUID",
            "properties": {
              "flexClass": "show"
            }
          }
        }
      );
    }

    return actions;
  }

  vfcheckLength(action) {
    let locations = this.contextService.getDataByString(action.config.key);
    this.contextService.addToContext("verifoneMegaLabel" + action.config.processType + "AvailableQuantity", action.config.processType === "replace" ? locations.length : "1");
  }

  _getRightSideItemsforAddPrint(action: any, instance: any, actionService: any) {
    let rightSideItems = [];
    rightSideItems = [
      {
        "ctype": "textField",
        "uuid": "rightethernetMacUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "required": true,
        "label": "Ethernet MAC",
        "labelPosition": "left",
        "name": "rightethernetMac",
        "value": "",
        "disabled": false,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "rightmodelUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "required": true,
        "defaultValue": "ENGAGE",
        "label": "Model",
        "labelPosition": "left",
        "name": "rightmodel",
        "value": "",
        "disabled": true,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "rightwifiMacUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "",
        "defaultValue": "1234",
        "required": true,
        "label": "WIFI MAC",
        "labelPosition": "left",
        "name": "rightwifiMac",
        "value": "",
        "disabled": true,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "rightHWUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "",
        "defaultValue": "Lorem Ipsum",
        "required": true,
        "label": "HW",
        "labelPosition": "left",
        "name": "rightHW",
        "value": "",
        "disabled": true,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "rightDescriptionUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "required": true,
        "label": "Description",
        "labelPosition": "left",
        "name": "rightDescription",
        "value": "",
        "disabled": false,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "rightIMEIUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "",
        "defaultValue": "1234",
        "required": true,
        "label": "IMEI",
        "labelPosition": "left",
        "name": "rightIMEI",
        "value": "",
        "disabled": false,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "rightPTIDUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "defaultValue": "0987654321",
        "required": true,
        "label": "PTID",
        "labelPosition": "left",
        "name": "rightPTID",
        "value": "",
        "disabled": false,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "rightrevisionUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "required": true,
        "label": "Revision",
        "labelPosition": "left",
        "name": "rightrevision",
        "value": "",
        "disabled": false,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "rightDateCodeUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "text",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "required": true,
        "label": "Date Code",
        "labelPosition": "left",
        "name": "rightDateCode",
        "value": "",
        "disabled": false,
        "hidden": true
      },
      {
        "ctype": "textField",
        "uuid": "rightQtyUUID",
        "hooks": [],
        "validations": [],
        "actions": [],
        "type": "number",
        "textfieldClass": "textfield-container p-0 dropdown-container",
        "formGroupClass": "flex-container-full-width qty1 form-group-margin",
        "labelClass": "subtitle1",
        "placeholder": "Enter Value",
        "required": true,
        "defaultValue": "23",
        "label": "Qty",
        "labelPosition": "left",
        "name": "rightQty",
        "value": "",
        "disabled": false,
        "hidden": true
      },
    ]
    return rightSideItems;
  }

  _quantityDropdwon(action: any, instance: any) {
    let quantityDropDown;
    let isNewPanel;
    if (isNewPanel) {
      quantityDropDown = {
        "ctype": "nativeDropdown",
        "uuid": "verifoneMegaLabelQtyUUID",
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

  _getREW_INSTR(action: any, instance: any) {
    let rewINSTR;
    let isNewPanel;
    if (isNewPanel) {
      rewINSTR = {
        "ctype": "flexFields",
        "uuid": "verifoneMegaLabelFlexFieldRewINSTRUUID",
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
            "uuid": "verifoneMegaLabelRewINSTRUUID",
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
                  "key": "verifoneMegaLabel" + action.config.processType + "RewINSTR"
                }
              }
            ],
            "name": "verifoneMegaLabel" + action.config.processType + "RewINSTR",
            "label": "",
            "labelPosition": "",
            "tooltip": "",
            "TooltipPosition": "",
            "defaultValue": "",
            "readonly": false,
            "type": "text",
            "required": true,
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



  vfdisableOrEnableAllIcons(action, instance, actionService) {
    let iconsList = [
      "verifoneMegaLabelReplaceIconUUID",
      "verifoneMegaLabelRemoveIconUUID",
      "verifoneMegaLabelFitIconUUID",
      "verifoneMegaLabelResolderIconUUID",
      "verifoneMegaLabelScrapIconUUID"
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

  _getDataForTable(action, actionService, qty) {
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
            "uuid": "ciscoQtyUUID" + "ciscoQtyUUID#@",
            // "uuid": isNewPanel ? "ciscoQtyUUID" : "ciscoQtyUUID#@",
            "text": qty != null ? qty.toString() : "0",
            "labelClass": "greyish-black"
          },
          {
            "ctype": "label",
            "uuid": "verifoneMegaLabelStockQty" + "verifoneMegaLabelStockQty#@",
            // "uuid": isNewPanel ? "verifoneMegaLabelStockQty" : "verifoneMegaLabelStockQty#@",
            "text": "",
            "labelClass": "greyish-black cisco-stock"
          }
        ]
      });
    });

    return tableSourceList;
  }

  vfCreateFailCode(action: any, instance: any, actionService: any) {
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
              "uuid": "verifoneMegaLabelFailCodeUUID",
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

  vfWishListPanels(action: any, instance: any, actionService: any) {
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
      this.vfonClickOfCompleteButton(action, instance, actionService);
    })
  }

  verifoneMegaLabelCreateRepairPanels(action: any, instance: any, actionService: any) {
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
        this.vfonClickOfCompleteButton(action, instance, actionService);
      })
    })
  }

  _getItems(action, instance, actionService) {
    let items = [];
    let printedOption = this.contextService.getDataByString("#isPrintedOption")
    if (printedOption == "bezel") {
      items = [
        {
          "ctype": "textField",
          "uuid": "bezelleftLabelUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "123",
          "label": "Label",
          "labelPosition": "left",
          "name": "bezelleftLabelUUID",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "bezelleftEthernnetMacUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "33333333",
          "label": "Ethernnet MAC",
          "labelPosition": "left",
          "name": "bezelleftEthernnetMacUUID",
          "value": "",
          "disabled": false,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "bezelleftwifiMacUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "1234",
          "label": "WIFI MAC",
          "labelPosition": "left",
          "name": "bezelleftwifiMacUUID",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "bezelleftIMEIUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "1234",
          "label": "IMEI",
          "labelPosition": "left",
          "name": "bezelleftIMEIUUID",
          "value": "",
          "disabled": false,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "bezelleftDateCodeUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "444444444",
          "label": "Date Code",
          "labelPosition": "left",
          "name": "bezelleftDateCodeUUID",
          "value": "",
          "disabled": false,
          "hidden": false
        },
        {
          "ctype": "title",
          "uuid": "bezelleftPrinterTextUUID",
          "title": "Printer",
          "titleClass": "col-6 subtitle1 printer-text",
          "titleValue": "Printer 2 - 300DPI",
          "titleValueClass": "body font-normal verifoneProblemDescLayout",
          "hidden": false
        },
      ]
    } else if (printedOption == "bumper") {
      items = [
        {
          "ctype": "textField",
          "uuid": "bumperleftLabelUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "123",
          "label": "Label",
          "labelPosition": "left",
          "name": "bumperleftLabelUUID",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "bumperleftHWUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "Lorem Ipsum",
          "label": "HW",
          "labelPosition": "left",
          "name": "bumperleftHW",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "bumperleftPTIDUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "0987654321",
          "label": "PTID",
          "labelPosition": "left",
          "name": "bumperleftPTID",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "title",
          "uuid": "bumperleftPrinterTextUUID",
          "title": "Printer",
          "titleClass": "col-6 subtitle1 printer-text",
          "titleValue": "Printer 3 - 300 DPI",
          "titleValueClass": "body font-normal verifoneProblemDescLayout",
          "hidden": false
        },
      ]
    } else if (printedOption == "coverone") {
      items = [
        {
          "ctype": "textField",
          "uuid": "coveroneleftLabelUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "123",
          "label": "Label",
          "labelPosition": "left",
          "name": "coveroneleftLabelUUID",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "coveroneleftPTIDUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "0987654321",
          "label": "PTID",
          "labelPosition": "left",
          "name": "coveroneleftPTID",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "title",
          "uuid": "coveroneleftPrinterTextUUID",
          "title": "Printer",
          "titleClass": "col-6 subtitle1 printer-text",
          "titleValue": "Printer 4 - 300 DPI",
          "titleValueClass": "body font-normal verifoneProblemDescLayout",
          "hidden": false
        },
      ]
    } else if (printedOption == "covertwo") {
      items = [
        {
          "ctype": "textField",
          "uuid": "covertwoleftLabelUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "123",
          "label": "Label",
          "labelPosition": "left",
          "name": "covertwoleftLabel",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "covertwoleftModelUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "ENGAGE",
          "label": "Model",
          "labelPosition": "left",
          "name": "covertwoleftModel",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "title",
          "uuid": "covertwoleftPrinterTextUUID",
          "title": "Printer",
          "titleClass": "col-6 subtitle1 printer-text",
          "titleValue": "Printer 4 - 300 DPI",
          "titleValueClass": "body font-normal verifoneProblemDescLayout",
          "hidden": false
        },
      ]
    }
    return items;
  }

  _getRightSideItems(action, instance, actionService) {
    let rightItems = [];
    let printedOption = this.contextService.getDataByString("#isPrintedOption")
    if (printedOption == "bezel") {
      rightItems = [
        {
          "ctype": "textField",
          "uuid": "bezelrightPartNumberUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "1234567890",
          "label": "Part Number",
          "labelPosition": "left",
          "name": "bezelrightPartNumber",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "bezelrightDescriptionUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "2222222222",
          "label": "Description",
          "labelPosition": "left",
          "name": "bezelrightDescription",
          "value": "",
          "disabled": false,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "bezelrightPTIDUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "0987654321",
          "label": "PTID",
          "labelPosition": "left",
          "name": "bezelrightPTID",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "bezelrightSubPartNumberUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "6543217890",
          "label": "SUB Part Number",
          "labelPosition": "left",
          "name": "bezelrightSubPartNumber",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "bezelrightRevisionUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "01",
          "label": "Revision",
          "labelPosition": "left",
          "name": "bezelrightRevision",
          "value": "",
          "disabled": false,
          "hidden": false
        }
      ]
    } else if (printedOption == "bumper") {
      rightItems = [
        {
          "ctype": "textField",
          "uuid": "bumperrightPartNumberUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "1234567890",
          "label": "Part Number",
          "labelPosition": "left",
          "name": "bumperrightPartNumber",
          "value": "",
          "disabled": true,
          "hidden": false
        },

      ]
    } else if (printedOption == "coverone") {
      rightItems = [
        {
          "ctype": "textField",
          "uuid": "coveronerightPartNumberUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "1234567890",
          "label": "Part Number",
          "labelPosition": "left",
          "name": "coveronerightPartNumber",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "coveronerightModelUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "ENGAGE",
          "label": "Model",
          "labelPosition": "left",
          "name": "coveronerightModel",
          "value": "",
          "disabled": true,
          "hidden": false
        },

      ]
    } else if (printedOption == "covertwo") {
      rightItems = [
        {
          "ctype": "textField",
          "uuid": "covertworightPartNumberUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "1234567890",
          "label": "Part Number",
          "labelPosition": "left",
          "name": "covertworightPartNumber",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "covertworightPTIDUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "text",
          "textfieldClass": "textfield-container p-0 dropdown-container",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "0987654321",
          "label": "PTID",
          "labelPosition": "left",
          "name": "coveronerightPTID",
          "value": "",
          "disabled": true,
          "hidden": false
        },
        {
          "ctype": "textField",
          "uuid": "covertworightQtyUUID",
          "hooks": [],
          "validations": [],
          "actions": [],
          "type": "number",
          "textfieldClass": "textfield-container body2",
          "formGroupClass": "tan-flexContainer qty1",
          "labelClass": "col-6 subtitle1",
          "placeholder": "Enter Value",
          "required": true,
          "defaultValue": "23",
          "label": "Qty",
          "labelPosition": "left",
          "name": "covertworightQty",
          "value": "",
          "disabled": false,
          "hidden": false
        },
      ]
    }
    return rightItems;
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


  vffilterMasterName(action, instance, actionService) {
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

  displayTextOnSelect(action, instance, actionService) {
    let lblId = [
      "leftDescriptionUUID",
      "leftsubPartNoUUID",
      "leftrevisionUUID",
      "rightwifiMacUUID",
      "rightDateCodeUUID"
    ];
    let lblEth = [
      "leftIOEthernetMACUUID",
      "leftBTMacUUID",
      "rightHWUUID"
    ];
    let lblPtid = [
      "leftmodelUUID",
      "leftwifiMacUUID",
      "rightDescriptionUUID"
    ];
    let lblSn = [
      "rightmodelUUID",
      "dateCodeUUID",
      "rightrevisionUUID"
    ];
    let printedOption = this.contextService.getDataByString("#isPrintedOption")
    if (printedOption !== undefined && printedOption !== "") {
      let updatepartNO = [
        {
          "type": "updateComponent",
          "config": {
            "key": "leftpartNumberUUID",
            "properties": {
              "hidden": false
            }
          }
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "PrinterTextUUID",
            "properties": {
              "hidden": false,
              "titleClass": "col-6 subtitle1 printer-text",
            }
          }
        }
      ]
      updatepartNO && updatepartNO.forEach(element => {
        actionService.handleAction(element);
      });

      let updateEthernetMAC
      if (printedOption == "covertwo") {
        updateEthernetMAC = [
          {
            "type": "updateComponent",
            "config": {
              "key": "rightethernetMacUUID",
              "properties": {
                "hidden": true
              }
            }
          },
          {
            "type": "updateComponent",
            "config": {
              "key": "rightQtyUUID",
              "properties": {
                "hidden": false,
                "textfieldClass": "textfield-container body2",
                "formGroupClass": "tan-flexContainer qty1",
                "labelClass": "col-6 subtitle1",
              }
            }
          }
        ]
      } else {
        updateEthernetMAC = [
          {
            "type": "updateComponent",
            "config": {
              "key": "rightethernetMacUUID",
              "properties": {
                "hidden": false
              }
            }
          },
          {
            "type": "updateComponent",
            "config": {
              "key": "rightQtyUUID",
              "properties": {
                "hidden": true
              }
            }
          }
        ]
      }
      updateEthernetMAC && updateEthernetMAC.forEach(update => {
        actionService.handleAction(update);
      });

      let updatePTID;
      if (printedOption == "bezel" || printedOption == "covertwo") {
        updatePTID = [
          {
            "type": "updateComponent",
            "config": {
              "key": "leftPTIDUUID",
              "properties": {
                "hidden": false
              }
            }
          },
          {
            "type": "updateComponent",
            "config": {
              "key": "rightIMEIUUID",
              "properties": {
                "hidden": false
              }
            }
          },
          {
            "type": "updateComponent",
            "config": {
              "key": "rightPTIDUUID",
              "properties": {
                "hidden": true
              }
            }
          }
        ]
      } else {
        updatePTID = [{
          "type": "updateComponent",
          "config": {
            "key": "leftPTIDUUID",
            "properties": {
              "hidden": true
            }
          }
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "rightIMEIUUID",
            "properties": {
              "hidden": true
            }
          }
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "rightPTIDUUID",
            "properties": {
              "hidden": false
            }
          }
        }
        ]
      }
      updatePTID && updatePTID.forEach(element => {
        actionService.handleAction(element);
      });

      if (printedOption == "bezel") {
        lblId.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": false
              }
            }
          }

          actionService.handleAction(updateComponent);
        });
        lblEth.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": true
              }
            }
          }

          actionService.handleAction(updateComponent);
        });
        lblPtid.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": true
              }
            }
          }

          actionService.handleAction(updateComponent);
        });
        lblSn.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": true
              }
            }
          }

          actionService.handleAction(updateComponent);
        });
      } else if (printedOption == "bumper") {
        lblId.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": true
              }
            }
          }
          actionService.handleAction(updateComponent);
        });
        lblEth.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": false
              }
            }
          }
          actionService.handleAction(updateComponent);
        });
        lblPtid.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": true
              }
            }
          }
          actionService.handleAction(updateComponent);
        });
        lblSn.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": true
              }
            }
          }
          actionService.handleAction(updateComponent);
        });
      } else if (printedOption == "coverone") {
        lblId.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": true
              }
            }
          }
          actionService.handleAction(updateComponent);
        });
        lblEth.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": true
              }
            }
          }
          actionService.handleAction(updateComponent);
        });
        lblPtid.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": false
              }
            }
          }
          actionService.handleAction(updateComponent);
        });
        lblSn.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": true
              }
            }
          }
          actionService.handleAction(updateComponent);
        });
      } else if (printedOption == "covertwo") {
        lblId.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": true
              }
            }
          }
          actionService.handleAction(updateComponent);
        });
        lblEth.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": true
              }
            }
          }
          actionService.handleAction(updateComponent);
        });
        lblPtid.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": true
              }
            }
          }
          actionService.handleAction(updateComponent);
        });
        lblSn.forEach(element => {
          let updateComponent = {
            "type": "updateComponent",
            "config": {
              "key": element,
              "properties": {
                "hidden": false
              }
            }
          }
          actionService.handleAction(updateComponent);
        });
      }
    }

  }
}
