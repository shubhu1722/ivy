import { Injectable } from '@angular/core';
import { ComponentService } from '../../commonServices/componentService/component.service';
import { ContextService } from '../../commonServices/contextService/context.service';
import { UtilityService } from '../../../utilities/utility.service';

@Injectable({
  providedIn: 'root'
})
export class DellReworkService {
  seedarr = [];
  seedarrforDOA = [];
  //CompleteFlag: boolean = true;
  constructor(private contextService: ContextService,
    private componentService: ComponentService,
    private utiliyService: UtilityService) { }


  handleDellReworkActions(action: any, instance: any, actionService: any) {
    switch (action.methodType) {
      // case 'handleDellReworkAction':
      //   //this.handleDellReworkTimeOutAction(action, instance, actionService)
      //   break;
      case 'createDynamicTaskPanels':
        this.createDynamicTaskPanels(action, instance, actionService)
        break;
      case 'requisitionOrderStatus':
        this.requisitionStatus(action, instance, actionService)
        break;
      case 'handlePerformRemoveParts':
        this.handlePerformRemoveParts(action, instance, actionService)
        break;
      case 'handlePerformIssuePart':
        this.handlePerformIssuePart(action, instance, actionService)
        break;
      case 'handlePerformFA':
        this.handlePerformFA(action, instance, actionService)
        break;
      case 'componentDisabled':
        this.componentDisabled(action, instance, actionService)
        break;
      case 'disableComponents':
        this.disableComponents(action, instance, actionService)
        break;
      case 'handleAIORemovePart':
        this.handleAIORemovePart(action, instance, actionService)
        break;
      case 'handleDellAIOGlobalTrigger':
        this.handleDellAIOGlobalTrigger(action, instance, actionService)
        break;
      case "conditionalIssuePartParam":
        this.conditionalIssuePartParam(action, actionService, instance)
        break;
      case "handlegetBCNinfoForRemove":
        this.handlegetBCNinfoForRemove(action, instance, actionService)
        break;
      case "handlegetBCNinfoForIssue":
        this.handlegetBCNinfoForIssue(action, instance, actionService)
        break;
      case "handlegetBCNinfoForIssueforRTS":
        this.handlegetBCNinfoForIssueforRTS(action, instance, actionService)
        break;
      case "HDDPart":
        this.HDDPart(action, instance, actionService)
        break;
      case "handleUnIssuePart":
        this.handleUnIssuePart(action, instance, actionService)
        break;
      case "handleMoveInventory":
        this.handleMoveInventory(action, instance, actionService)
        break;
      case "handleCompleteActions":
        this.handleCompleteActions(action, instance, actionService)
        break;
      case "NextItemBCN":
        this.NextItemBCN(action, actionService, instance);
        break;
      case "seedValue":
        this.seedValue(action, actionService, instance);
        break;
      case "objcreat":
        this.objcreat(action, instance, actionService);
        break;
      case "taskPanelOpen":
        this.taskPanelOpen(action, instance, actionService);
        break;
      case "CompleteStatusCheck":
        this.CompleteStatusCheck(action, instance, actionService);
        break;
        case "DataFormationforSaveandExit":
          this.DataFormationforSaveandExit(action, instance, actionService);
          break;
      case "DeleteButtonCheck":
          this.DeleteButtonCheck(action, instance, actionService);
          break;
      case "IrisCallTriggerValues":
          this.IrisCallTriggerValues(action, instance, actionService);
          break;           
      default:
        //statements; 
        break;

    }
  }

  handleDellReworkHDDfieldComparitives(action, instance, actionService) {
    let result;
    let arr1 = [];
    let arr2 = [];
    let hddArr = ["HDD1", "HDD2", "HDD3", "HDD4"];
    let hddFormDataArr = ["hdd1ppid", "hdd2ppid", "hdd3ppid", "hdd4ppid"];
    let responseArray = this.contextService.getDataByString(action.config.arr1);
    let formData = this.contextService.getDataByString(action.config.arr2);
    for (var i = 0; i < formData.length; i++) {
      for (var j = 0; j < hddArr.length; j++) {
        if (formData[i].ffName == hddArr[j]) {
          if (formData[i].ffValue) {
            arr1.push(formData[i].ffValue);
          }
        }
      }
    }
    hddFormDataArr.map((y) => {
      if (responseArray[y]) {
        arr2.push(responseArray[y]);
      }
    })
    arr1.sort();
    arr2.sort();
    console.log(arr1);
    console.log(arr2);
    if (arr1 && arr2 && arr1.length == arr2.length) {
      for (let i = 0; i < arr1.length; i++)
        if (arr1[i] == arr2[i]) {
          result = "true";
        }
        else {
          result = "false";
          break;
        }
    }
    else {
      result = "false";
    }
    this.contextService.addToContext("hddDataMatched", result);
  }

  componentDisabled(action, instance, actionService) {
    action.config.items.forEach((x) => {
      actionService.handleAction(
        {
          "type": "updateComponent",
          "config": {
            "key": x,
            "properties": {
              "disabled": true
            }
          }
        }, instance
      )
    })
  }

  disableComponents(action, instance, actionService) {
    action.config.items.forEach((x) => {
      actionService.handleAction(
        {
          "type": "disableComponent",
          "config": {
            "key": x.key,
            "property": x.property
          }
        }, instance
      )
    })
  }

  defaultSetDeleteFlagValue(data, action, instance) {
    for (let i = 0; i < data.length; i++) {
      this.contextService.addToContext("DeleteFlag" + i, false);
    }
  }


  createDynamicTaskPanels(action, instance, actionService) {
    //console.log(this.contextService.getDataByString(action.config.data));
    let data = this.contextService.getDataByString(action.config.data);
    let filteredData = data.map((item) => {
      if(item.gnomeSubsPart && item.partNo != item.gnomeSubsPart){
        item.partNo = item.gnomeSubsPart;
      }
      return item;
    });
    let filteredAction = {
      "config": {
        "data": filteredData
      }
    }
    //let a = this.contextService.getDataByKey("moveInventoryConfig");
    //let data = [];
    // for(let i=0; i< fahistorydata.length; i++){
    //   if(fahistorydata[i].partNo){
    //     if(fahistorydata[i].actionCode == "RPL"){
    //       data.push(fahistorydata[i]);
    //     }
    //   }
    // }
    let taskPanelsLength = filteredData.length;
    this.contextService.addToContext("DellReworkTaskPanelsLength", taskPanelsLength);
    let requisitionFlag = this.contextService.getDataByKey("requisitionFlag");
    this.seedValue(filteredAction, actionService, instance);
    //this.seeedValueforDOA(action, actionService, instance);
    //this.defaultSetDeleteFlagValue(data, action, instance);


    filteredData  && filteredData.forEach((element, index) => {
      let arr = [];

      arr.push(
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data": {
              "ctype": "taskPanel",
              "columnWiseTitle": true,
              "header": {
                "svgIcon": "description_icon",
                "iconClass": "active-header",
                "class": "greyish-black",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              },
              "headerTitleLabels": [
                "Replace Part-",
                "",
                "",
                "",
                "",
              ],
              "headerTitleValues": [
                (element.partNo ? element.partNo : "") + "-" + (element.partDesc ? element.partDesc : ""),
                "",
                "",
                "",
                "Qty 1"
              ],
              "inputClasses": [
                "parent1"
              ],
              "headerClasses": [
                "#headerClass"
              ],
              "expanded": false,
              "disabled": requisitionFlag === true ? true : false,
              "isblueBorder": true,
              "hideToggle": "true",
              "hidden": false,
              "visibility": false,
              "validations": [],
              "actions": [],
              "disableTaskPanel": true,
              "uuid": "dellReworkReplaceUUID" + index,
              "hooks": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "addToExistingContext",
                    "target": "defectCodeList",
                    "sourceData": {
                      "defectCode": element.defectCode
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "addOccurenceToContext",
                  "hookType": "afterInit",
                  "config": {
                    "target": "occurenceList",
                    "taskUuid": "dellReworkReplaceUUID" + index,
                    "currentDefectCode": element.defectCode,
                  }
                },
                {
                  "type": "microservice",
                  "hookType": "afterInit",
                  "config": {
                    "microserviceId": "getCompByAction",
                    "isLocal": false,
                    "LocalService": "assets/Responses/performFA.json",
                    "requestMethod": "get",
                    "params": {
                      "actionId": element.actionId,
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
                            "key": "getCompByAction" + index,
                            "data": "responseData"
                          }
                        },
                        {
                          "type": "condition",
                          "config": {
                            "operation": "isValid",
                            "lhs": "#getCompByAction" + index,
                            "lhsKeyName": "TRX_TYPE",
                            "lhsKeyValue": "Removed",
                            "lhsSecondKeyName": "COMPONENT_SN"
                          },
                          "responseDependents": {
                            "onSuccess": {
                              "actions": [
                                {
                                  "type": "condition",
                                  "config": {
                                    "operation": "isValid",
                                    "lhs": "#getCompByAction" + index,
                                    "lhsKeyName": "TRX_TYPE",
                                    "lhsKeyValue": "Issued",
                                    "lhsSecondKeyName": "ACTIONID"
                                  },
                                  "responseDependents": {
                                    "onSuccess": {
                                      "actions": [
                                        {
                                          "type": "condition",
                                          "config": {
                                            "operation": "isValid",
                                            "lhs": "#isFromSave&Exit" + index
                                          },
                                          "eventSource": "click",
                                          "responseDependents": {
                                            "onSuccess": {
                                              "actions": [
                                                {
                                                  "type": "condition",
                                                  "eventSource": "click",
                                                  "config": {
                                                    "operation": "isEqualTo",
                                                    "lhs": "#newPartSelection" + index,
                                                    "rhs": true
                                                  },
                                                  "responseDependents": {
                                                    "onSuccess": {
                                                      "actions": [
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "doaLinkUUID" + index,
                                                            "properties": {
                                                              "hoverClass": "cursor-default",
                                                              "iconTextClass": "body text-dark",
                                                              "disabled": true
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
                                                            "key": "doaLinkUUID" + index,
                                                            "properties": {
                                                              "hoverClass": "cursor-pointer",
                                                              "iconTextClass": "body text-primary",
                                                              "disabled": false
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        }
                                                      ]
                                                    }
                                                  }
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "RTSUUID" + index,
                                                    "properties": {
                                                      "hoverClass": "cursor-default",
                                                      "iconTextClass": "body text-dark",
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "deleteUUID" + index,
                                                    "properties": {
                                                      "disabled": false,
                                                      "class": "primary-btn dell-debug-delete-button"
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "completeDynamicTaskUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                              ]
                                            },
                                            "onFailure": {
                                              "actions": [
                                                {
                                                  "type": "condition",
                                                  "config": {
                                                    "operation": "isValid",
                                                    "lhs": "#getCompByAction" + index,
                                                    "lhsKeyName": "TRX_TYPE",
                                                    "lhsKeyValue": "Removed",
                                                    "lhsSecondKeyName": "COMPONENT_SN"
                                                  },
                                                  "responseDependents": {
                                                    "onSuccess": {
                                                      "actions": [
                                                        {
                                                          "type": "condition",
                                                          "config": {
                                                            "operation": "isContains",
                                                            "lhs": "#lhsValue",
                                                            "rhs": "#getCurrPrevRODetailsBySN.clientReferenceNo1"
                                                          },
                                                          "eventSource": "click",
                                                          "responseDependents": {
                                                            "onSuccess": {
                                                              "actions": [
                                                                {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                    "key": "defectivePartNoPPIDUUID" + index,
                                                                    "properties": {
                                                                      "checked": true
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
                                                                    "key": "dellReworkReplaceUUID" + index,
                                                                    "fieldProperties": {
                                                                      ["defectivePart"+ index]: "#lhsValue"
                                                                    }
                                                                  }
                                                                }
                                                              ]
                                                            }
                                                          }
                                                        }
                                                    ],
                                                    },
                                                    "onFailure" : {
                                                      "actions": []
                                                    }
                                                  }
                                                },
                                                {
                                                  "type": "condition",
                                                  "config": {
                                                    "operation": "isValid",
                                                    "lhs": "#getCompByAction" + index,
                                                    "lhsKeyName": "TRX_TYPE",
                                                    "lhsKeyValue": "Removed",
                                                    "lhsSecondKeyName": "COMPONENT_LOCATION"
                                                  },
                                                  "responseDependents": {
                                                    "onSuccess": {
                                                      "actions": [
                                                      {
                                                        "type": "updateComponent",
                                                        "config": {
                                                          "key": "dellReworkReplaceUUID" + index,
                                                          "fieldProperties": {
                                                            ["DefectiveNote"+ index]: "#lhsValue"
                                                          }
                                                        }
                                                      }
                                                    ],
                                                    },
                                                    "onFailure" : {
                                                      "actions": []
                                                    }
                                                  }
                                                },
                                                {
                                                  "type": "condition",
                                                  "config": {
                                                    "operation": "isValid",
                                                    "lhs": "#getCompByAction" + index,
                                                    "lhsKeyName": "TRX_TYPE",
                                                    "lhsKeyValue": "Issued",
                                                    "lhsSecondKeyName": "COMPONENT_PN"
                                                  },
                                                  "responseDependents": {
                                                    "onSuccess": {
                                                      "actions": [
                                                      {
                                                        "type": "updateComponent",
                                                        "config": {
                                                          "key": "dellReworkReplaceUUID" + index,
                                                          "fieldProperties": {
                                                            ["newPart" + index]: "#lhsValue"
                                                          }
                                                        }
                                                      }
                                                    ],
                                                    },
                                                    "onFailure" : {
                                                      "actions": []
                                                    }
                                                  }
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "defectivePartUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "defectivePartNoPPIDUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "noPartToRemoveUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "defectiveNoteUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "newPartUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "newPartNoPPIDUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "doaLinkUUID" + index,
                                                    "properties": {
                                                      "hoverClass": "cursor-default",
                                                      "iconTextClass": "body text-dark",
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "RTSUUID" + index,
                                                    "properties": {
                                                      "hoverClass": "cursor-default",
                                                      "iconTextClass": "body text-dark",
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "deleteUUID" + index,
                                                    "properties": {
                                                      "disabled": true,
                                                      "class": "primary-btn dell-debug-delete-button-disable"
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "completeDynamicTaskUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "dellReworkReplaceUUID" + index,
                                                    "properties": {
                                                      "expanded": false,
                                                      "disabled": false,
                                                      "header": {
                                                        "svgIcon": "description_icon",
                                                        "statusIcon": "check_circle",
                                                        "statusClass": "complete-status",
                                                        "class": "complete-task ",
                                                        "iconClass": "complete-task"
                                                      }
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "condition",
                                                  "hookType": "afterInit",
                                                  "config": {
                                                    "operation": "isValid",
                                                    "lhs": "#specialMessageData.moreInfo"
                                                  },
                                                  "responseDependents": {
                                                    "onSuccess": {
                                                      "actions": [
                                                      ]
                                                    },
                                                    "onFailure": {
                                                      "actions": [
                                                        {
                                                          "type": "handleDellReworkActions",
                                                          "methodType": "taskPanelOpen",
                                                          "eventSource": "click",
                                                          "config": {
                                                            "index": index
                                                          }
                                                        },
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
                                          "type": "updateComponent",
                                          "config": {
                                            "key": "RTSUUID" + index,
                                            "properties": {
                                              "hoverClass": "cursor-default",
                                              "iconTextClass": "body text-dark",
                                              "disabled": true
                                            }
                                          },
                                          "eventSource": "click"
                                        },
                                        {
                                          "type": "handleDellReworkActions",
                                          "methodType": "DeleteButtonCheck",
                                          "config": {
                                            "index": index
                                          }
                                        },
                                        // {
                                        //   "type": "updateComponent",
                                        //   "config": {
                                        //     "key": "newPartNoPPIDUUID" + index,
                                        //     "properties": {
                                        //       "disabled": false
                                        //     }
                                        //   },
                                        //   "eventSource": "click"
                                        // },
                                        // {
                                        //   "type": "updateComponent",
                                        //   "config": {
                                        //     "key": "newPartUUID" + index,
                                        //     "properties": {
                                        //     "disabled": false
                                        //     }
                                        //   }
                                        // },
                                        // {
                                        //   "type": "updateComponent",
                                        //   "config": {
                                        //     "key": "deleteUUID" + index,
                                        //     "properties": {
                                        //       "disabled": true,
                                        //       "class": "primary-btn dell-debug-delete-button-disable"
                                        //     }
                                        //   },
                                        //   "eventSource": "click"
                                        // },
                                        // {
                                        //   "type": "updateComponent",
                                        //   "config": {
                                        //     "key": "completeDynamicTaskUUID" + index,
                                        //     "properties": {
                                        //       "disabled": false
                                        //     }
                                        //   },
                                        //   "eventSource": "click"
                                        // }
                                      ]
                                    }
                                  }
                                },
                                {
                                  "type": "condition",
                                  "config": {
                                    "operation": "isEqualTo",
                                    "lhs": "#DOALink" + index,
                                    "rhs": true
                                  },
                                  "responseDependents": {
                                    "onSuccess": {
                                      "actions": [
                                        {
                                          "type": "updateComponent",
                                          "config": {
                                            "key": "doaLinkUUID" + index,
                                            "properties": {
                                              "hoverClass": "cursor-default",
                                              "iconTextClass": "body text-dark",
                                              "disabled": true
                                            }
                                          },
                                        },
                                        {
                                          "type": "updateComponent",
                                          "config": {
                                            "key": "deleteUUID" + index,
                                            "properties": {
                                              "disabled": true,
                                              "class": "primary-btn dell-debug-delete-button-disable"
                                            }
                                          }
                                        },
                                        {
                                          "type": "updateComponent",
                                          "config": {
                                            "key": "completeDynamicTaskUUID" + index,
                                            "properties": {
                                              "disabled": true
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
                                  "type": "condition",
                                  "config": {
                                    "operation": "isValid",
                                    "lhs": "#getCompByAction" + index,
                                    "lhsKeyName": "TRX_TYPE",
                                    "lhsKeyValue": "Issued",
                                    "lhsSecondKeyName": "ACTIONID"
                                  },
                                  "responseDependents": {
                                    "onSuccess": {
                                      "actions": [
                                        {
                                          "type": "condition",
                                          "config": {
                                            "operation": "isValid",
                                            "lhs": "#isFromSave&Exit" + index
                                          },
                                          "eventSource": "click",
                                          "responseDependents": {
                                            "onSuccess": {
                                              "actions": [
                                                {
                                                  "type": "condition",
                                                  "eventSource": "click",
                                                  "config": {
                                                    "operation": "isEqualTo",
                                                    "lhs": "#newPartSelection" + index,
                                                    "rhs": true
                                                  },
                                                  "responseDependents": {
                                                    "onSuccess": {
                                                      "actions": [
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "doaLinkUUID" + index,
                                                            "properties": {
                                                              "hoverClass": "cursor-default",
                                                              "iconTextClass": "body text-dark",
                                                              "disabled": true
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
                                                            "key": "doaLinkUUID" + index,
                                                            "properties": {
                                                              "hoverClass": "cursor-pointer",
                                                              "iconTextClass": "body text-primary",
                                                              "disabled": false
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        }
                                                      ]
                                                    }
                                                  }
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "RTSUUID" + index,
                                                    "properties": {
                                                      "hoverClass": "cursor-default",
                                                      "iconTextClass": "body text-dark",
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "deleteUUID" + index,
                                                    "properties": {
                                                      "disabled": false,
                                                      "class": "primary-btn dell-debug-delete-button"
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "completeDynamicTaskUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "condition",
                                                  "config": {
                                                    "operation": "isEqualTo",
                                                    "lhs": "#DOALink" + index,
                                                    "rhs": true
                                                  },
                                                  "responseDependents": {
                                                    "onSuccess": {
                                                      "actions": [
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "doaLinkUUID" + index,
                                                            "properties": {
                                                              "hoverClass": "cursor-default",
                                                              "iconTextClass": "body text-dark",
                                                              "disabled": true
                                                            }
                                                          },
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "deleteUUID" + index,
                                                            "properties": {
                                                              "disabled": true,
                                                              "class": "primary-btn dell-debug-delete-button-disable"
                                                            }
                                                          }
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "completeDynamicTaskUUID" + index,
                                                            "properties": {
                                                              "disabled": true
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
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "noPartToRemoveUUID" + index,
                                                    "properties": {
                                                      "checked": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "condition",
                                                  "config": {
                                                    "operation": "isValid",
                                                    "lhs": "#getCompByAction" + index,
                                                    "lhsKeyName": "TRX_TYPE",
                                                    "lhsKeyValue": "Issued",
                                                    "lhsSecondKeyName": "COMPONENT_PN"
                                                  },
                                                  "responseDependents": {
                                                    "onSuccess": {
                                                      "actions": [
                                                      {
                                                        "type": "updateComponent",
                                                        "config": {
                                                          "key": "dellReworkReplaceUUID" + index,
                                                          "fieldProperties": {
                                                            ["newPart" + index]: "#lhsValue"
                                                          }
                                                        }
                                                      }
                                                    ],
                                                    },
                                                    "onFailure" : {
                                                      "actions": []
                                                    }
                                                  }
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "defectivePartUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "defectivePartNoPPIDUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "noPartToRemoveUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "defectiveNoteUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "newPartUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "newPartNoPPIDUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "doaLinkUUID" + index,
                                                    "properties": {
                                                      "hoverClass": "cursor-default",
                                                      "iconTextClass": "body text-dark",
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "RTSUUID" + index,
                                                    "properties": {
                                                      "hoverClass": "cursor-default",
                                                      "iconTextClass": "body text-dark",
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "deleteUUID" + index,
                                                    "properties": {
                                                      "disabled": true,
                                                      "class": "primary-btn dell-debug-delete-button-disable"
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "completeDynamicTaskUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "dellReworkReplaceUUID" + index,
                                                    "properties": {
                                                      "expanded": false,
                                                      "disabled": false,
                                                      "header": {
                                                        "svgIcon": "description_icon",
                                                        "statusIcon": "check_circle",
                                                        "statusClass": "complete-status",
                                                        "class": "complete-task ",
                                                        "iconClass": "complete-task"
                                                      }
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "condition",
                                                  "hookType": "afterInit",
                                                  "config": {
                                                    "operation": "isValid",
                                                    "lhs": "#specialMessageData.moreInfo"
                                                  },
                                                  "responseDependents": {
                                                    "onSuccess": {
                                                      "actions": [
                                                      ]
                                                    },
                                                    "onFailure": {
                                                      "actions": [
                                                        {
                                                          "type": "handleDellReworkActions",
                                                          "methodType": "taskPanelOpen",
                                                          "eventSource": "click",
                                                          "config": {
                                                            "index": index
                                                          }
                                                        },
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
                                          "type": "condition",
                                          "hookType": "afterInit",
                                          "config": {
                                            "operation": "isEqualTo",
                                            "lhs": "#requisitionFlag",
                                            "rhs": true
                                          },
                                          "responseDependents": {
                                            "onSuccess": {
                                              "actions": [
                                                {
                                                  "type": "condition",
                                                  "eventSource": "click",
                                                  "config": {
                                                    "operation": "isEqualTo",
                                                    "lhs": "#DeleteFlag" + index,
                                                    "rhs": true
                                                  },
                                                  "responseDependents": {
                                                    "onSuccess": {
                                                      "actions": [
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "RTSUUID" + index,
                                                            "properties": {
                                                              "hoverClass": "cursor-default",
                                                              "iconTextClass": "body text-dark",
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "dellReworkReplaceUUID" + index,
                                                            "properties": {
                                                              "expanded": true,
                                                              "disabled": false,
                                                              "header": {
                                                                "svgIcon": "description_icon",
                                                                "iconClass": "active-header",
                                                                "class": "greyish-black",
                                                                "statusIcon": "hourglass_empty",
                                                                "statusClass": "incomplete-status"
                                                              }
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
                                                            "key": "RTSUUID" + index,
                                                            "properties": {
                                                              "hoverClass": "cursor-default",
                                                              "iconTextClass": "body text-primary",
                                                              "disabled": false
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                      ]
                                                    }
                                                  }
                                                }
                                              ]
                                            },
                                            "onFailure": {
                                              "actions": [
                                              ]
                                            }
                                          }
                                        }
                                        // {
                                        //   "type": "condition",
                                        //   "eventSource": "click",
                                        //   "config": {
                                        //     "operation": "isEqualTo",
                                        //     "lhs": "#noPartSelection" + index,
                                        //     "rhs": true
                                        //   },
                                        //   "responseDependents": {
                                        //     "onSuccess": {
                                        //       "actions": [
                                        //         {
                                        //           "type": "updateComponent",
                                        //           "config": {
                                        //             "key": "RTSUUID" + index,
                                        //             "properties": {
                                        //               "hoverClass": "cursor-default",
                                        //               "iconTextClass": "body text-dark",
                                        //               "disabled": true
                                        //             }
                                        //           },
                                        //           "eventSource": "click"
                                        //         },
                                        //         {
                                        //           "type": "updateComponent",
                                        //           "config": {
                                        //             "key": "dellReworkReplaceUUID" + index,
                                        //             "properties": {
                                        //               "expanded": true,
                                        //               "disabled": false,
                                        //               "header": {
                                        //                 "svgIcon": "description_icon",
                                        //                 "iconClass": "active-header",
                                        //                 "class": "greyish-black",
                                        //                 "statusIcon": "hourglass_empty",
                                        //                 "statusClass": "incomplete-status"
                                        //               }
                                        //             }
                                        //           },
                                        //           "eventSource": "click"
                                        //         }
                                        //        ]
                                        //     },
                                        //     "onFailure": {
                                        //       "actions": [
                                        //       ]
                                        //     }
                                        //   }
                                        // }
                                      ]
                                    }
                                  }
                                },
                              ]
                            }
                          }
                        },
                                {
                                  "type": "condition",
                                  "config": {
                                    "operation": "isValid",
                                    "lhs": "#specialMessageData.moreInfo"
                                  },
                                  "hookType": "afterInit",
                                  "responseDependents": {
                                    "onSuccess": {
                                      "actions": []
                                    },
                                    "onFailure": {
                                      "actions": [
                                        {
                                          "type": "condition",
                                          "eventSource": "click",
                                          "config": {
                                            "operation": "isEqualTo",
                                            "lhs": "#Completeflag",
                                            "rhs": false
                                          },
                                          "responseDependents": {
                                            "onSuccess": {
                                              "actions": [
                                                {
                                                  "type": "handleDellReworkActions",
                                                  "methodType": "CompleteStatusCheck",
                                                  "config": {
                                                    "index": index,
                                                    "CompleteFlag": false
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
                                     }
                                   }
                                 }
                        //       ]
                        //     }
                        //   }
                        // }
                      ]
                    },
                    "onFailure": {
                      "actions": [
                        {
                          "type": "handleCommonServices",
                          "config": {
                            "type": "errorRenderTemplate",
                            "contextKey": "errorMsg",
                            "updateKey": "errorTitleUUID"
                          }
                        }
                      ]
                    }
                  }
                }
              ],
              "items": [
                {
                  "ctype": "disabled",
                  "uuid": "reworkPartTaskUUID#@",
                  "disabledClass": "disabledFalse"
                },
                {
                  "ctype": "title",
                  "uuid": "dynamicTaskPanelUUID" + index,
                  "titleClass": "sidenav-title body2 assessment-alert body-italic",
                  "title": "RPL Defective Part Replaced" + "-" + element.actionCode + "-" + element.defectCode,
                  "titleValue": ""
                },
                {
                  "ctype": "textField",
                  "uuid": "defectivePartUUID" + index,
                  "submitable": false,
                  "disabled": requisitionFlag === true ? false : true,
                  "validations": [
                    {
                      "type": "regex",
                      "script": "^[a-zA-Z0-9]{5,32}$"
                    }
                  ],
                  "inLine": true,
                  "hidden": false,
                  "formGroupClass": "ppid-flexfield",
                  "textfieldClass": "ppid-textfield",
                  "hooks": [],
                  "name": "defectivePart" + index,
                  "label": "Defective Part PPID",
                  "labelClass": "body2 dell-greyish-black ppid-label",
                  "labelPosition": "",
                  "tooltip": "",
                  "TooltipPosition": "",
                  "defaultValue": "",
                  "type": "text",
                  "validateGroup": false,
                  "required": true,
                  "placeholder": "Scan #",
                  "value": "",
                  "prefix": false,
                  "prefixIcon": "",
                  "suffix": false,
                  "suffixIcon": "",
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "defectivePartPPIDText" + index,
                        "data": "elementControlValue"
                      },
                      "eventSource": "input"
                    }
                  ]
                },
                {
                  "ctype": "checkbox",
                  "name": "DefectivePartCheckbox" + index,
                  "uuid": "defectivePartNoPPIDUUID" + index,
                  "hooks": [
                    // {
                    //   "type": "condition",
                    //   "eventSource": "click",
                    //   "config": {
                    //     "operation": "isEqualTo",
                    //     "lhs": "#defectivePartSelection" + index,
                    //     "rhs": true
                    //   },
                    //   "hookType": "afterInit",
                    //   "responseDependents": {
                    //     "onSuccess": {
                    //       "actions": [
                    //         {
                    //           "type": "updateComponent",
                    //           "config": {
                    //             "key": "defectivePartNoPPIDUUID" + index,
                    //             "properties": {
                    //               "checked": true
                    //             }
                    //           }
                    //         }
                    //       ]
                    //     },
                    //     "onFailure": {
                    //       "actions": [
                    //       ]
                    //     }
                    //   }
                    // }
                  ],
                  "validations": [],
                  "required": false,
                  "submittable": true,
                  "checkVisibility": true,
                  "isDisableNotReq": true,
                  "inLine": true,
                  "label": "No PPID",
                  "disabled": requisitionFlag === true ? false : true,
                  "labelPosition": "after",
                  "code": "value",
                  "checked": false,
                  "displayValue": "value",
                  "checkboxContainer": "noppid1st-checkbox",
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "defectivePartSelection" + index,
                        "data": "elementControlValue"
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "condition",
                      "eventSource": "click",
                      "config": {
                        "operation": "isEqualTo",
                        "lhs": "#defectivePartSelection" + index,
                        "rhs": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "defectivePartUUID" + index,
                                "properties": {
                                  "disabled": true,
                                  "value": ""
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
                                "key": "defectivePartUUID" + index,
                                "properties": {
                                  "disabled": false
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
                  "ctype": "checkbox",
                  "name": "NoPartToRemove" + index,
                  "uuid": "noPartToRemoveUUID" + index,
                  "hooks": [],
                  "validations": [],
                  "required": false,
                  "submittable": true,
                  "checkVisibility": true,
                  "isDisableNotReq": true,
                  "inLine": true,
                  "label": "No Part To Remove",
                  "disabled": requisitionFlag === true ? false : true,
                  "labelPosition": "after",
                  "code": "value",
                  "checked": false,
                  "displayValue": "value",
                  "checkboxContainer": "nopart",
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "noPartSelection" + index,
                        "data": "elementControlValue"
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "condition",
                      "eventSource": "click",
                      "config": {
                        "operation": "isEqualTo",
                        "lhs": "#noPartSelection" + index,
                        "rhs": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "defectivePartUUID" + index,
                                "properties": {
                                  "disabled": true,
                                  "value": ""
                                }
                              }
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "defectivePartNoPPIDUUID" + index,
                                "properties": {
                                  "checked": false
                                }
                              }
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "defectivePartNoPPIDUUID" + index,
                                "properties": {
                                  "disabled": true
                                }
                              }
                            },
                           ]
                        },
                        "onFailure": {
                          "actions": [
                            {
                              "type": "condition",
                              "eventSource": "click",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": "#defectivePartSelection" + index,
                                "rhs": true
                              },
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "defectivePartNoPPIDUUID" + index,
                                        "properties": {
                                          "disabled": false
                                        }
                                      }
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "defectivePartUUID" + index,
                                        "properties": {
                                          "disabled": true
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
                                        "key": "defectivePartUUID" + index,
                                        "properties": {
                                          "disabled": false
                                        }
                                      }
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "defectivePartNoPPIDUUID" + index,
                                        "properties": {
                                          "disabled": false
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
                  "ctype": "textField",
                  "uuid": "defectiveNoteUUID" + index,
                  "submitable": false,
                  "disabled": requisitionFlag === true ? false : true,
                  "validations": [],
                  "inLine": true,
                  "hidden": false,
                  "formGroupClass": "ppid-flexfield",
                  "textfieldClass": "ppid-flexfield",
                  "hooks": [],
                  "actions": [],
                  "name": "DefectiveNote" + index,
                  "label": "Defective Note",
                  "labelClass": "body2 dell-greyish-black ppid-label",
                  "labelPosition": "",
                  "tooltip": "",
                  "TooltipPosition": "",
                  "defaultValue": "",
                  "type": "text",
                  "required": false,
                  "placeholder": "Scan #",
                  "value": "",
                  "prefix": false,
                  "prefixIcon": "",
                  "suffix": false,
                  "suffixIcon": ""
                },   
                {
                  "ctype":"title",
                  "titleClass": "ppid-flexfield"
                },
                {
                  "ctype": "textField",
                  "uuid": "newPartUUID" + index,
                  "submitable": false,
                  "disabled": requisitionFlag === true ? false : true,
                  "validations": [
                    {
                      "type": "regex",
                      "script": "^[a-zA-Z0-9]{5,32}$"
                    }
                  ],
                  "inLine": true,
                  "hidden": false,
                  "formGroupClass": "ppid-flexfield",
                  "textfieldClass": "ppid-flexfield",
                  "hooks": [],
                  "name": "newPart" + index,
                  "label": "New Part PPID/BCN",
                  "labelClass": "body2 dell-greyish-black ppid-label",
                  "labelPosition": "",
                  "tooltip": "",
                  "TooltipPosition": "",
                  "defaultValue": "",
                  "type": "text",
                  "required": true,
                  "placeholder": "Scan #",
                  "validateGroup": false,
                  "value": "",
                  "prefix": false,
                  "prefixIcon": "",
                  "suffix": false,
                  "suffixIcon": "",
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "NewPartPPIDText" + index,
                        "data": "elementControlValue"
                      },
                      "eventSource": "input"
                    }
                  ]
                },
                {
                  "ctype": "checkbox",
                  "name": "NewPartCheckbox" + index,
                  "uuid": "newPartNoPPIDUUID" + index,
                  "hooks": [],
                  "validations": [],
                  "inLine": true,
                  "required": false,
                  "submittable": true,
                  "checkVisibility": true,
                  "label": "No PPID",
                  "isDisableNotReq": true,
                  "labelPosition": "after",
                  "disabled": requisitionFlag === true ? false : true,
                  "code": "value",
                  "checked": false,
                  "displayValue": "value",
                  "checkboxContainer": "noppid2nd-checkbox",
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "newPartSelection" + index,
                        "data": "elementControlValue"
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "condition",
                      "eventSource": "click",
                      "config": {
                        "operation": "isEqualTo",
                        "lhs": "#newPartSelection" + index,
                        "rhs": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "newPartUUID" + index,
                                "properties": {
                                  "disabled": true
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
                                "key": "newPartUUID" + index,
                                "properties": {
                                  "disabled": false
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  ]
                }            
                
                  
              ],
              "footer": [
                {
                  "ctype": "iconText",
                  "icon": "",
                  "text": "Dead On Arrival (DOA)",
                  "textCss": "",
                  "css": "position: absolute; left: 0px; margin-left: 0px",
                  "iconPosition": "Before",
                  "hoverClass": "cursor-default",
                  "iconTextClass": "body text-dark",
                  "uuid": "doaLinkUUID" + index,
                  "name": "DOAName" + index,
                  "inLine": true,
                  "hidden": false,
                  "disabled": true,
                  "actions": [
                    {
                      "type": "dialog",
                      "uuid": "DOADialogUUID" + index,
                      "config": {
                        "title": "Dead on Arrival (DOA)",
                        "items": [
                          {
                            "ctype": "textarea",
                            "label": "Add note",
                            "name": "Add Note DOA",
                            "value": "",
                            "textareaContainer": "timeout-class required-note",
                            "uuid": "addNoteDOAUUID" + index,
                            "required": true,
                            "submitable": true,
                            "actions": []
                          }
                        ],
                        "footer": [
                          {
                            "ctype": "button",
                            "color": "primary",
                            "text": "Close",
                            "uuid": "doaCancelUUID" + index,
                            "closeType": "close",
                            "disableClose": true,
                            "visibility": true,
                            "dialogButton": true,
                            "type": "",
                            "hooks": [],
                            "validations": [],
                            "actions": []
                          },
                          {
                            "ctype": "button",
                            "color": "primary",
                            "text": "Done",
                            "uuid": "doaDoneUUID" + index,
                            "dialogButton": true,
                            "visibility": true,
                            "disabled": true,
                            "type": "submit",
                            "closeType": "success",
                            "hooks": [],
                            "validations": [],
                            "actions": []
                          }
                        ]
                      },
                      "eventSource": "click",
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "errorTitleUUID",
                                "properties": {
                                  "titleValue": "",
                                  "isShown": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "context",
                              "config": {
                                "requestMethod": "add",
                                "key": "DOA" + index,
                                "data": "formData"
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "context",
                              "config": {
                                "requestMethod": "add",
                                "key": "PerformRemovePartsFlag" + index,
                                "data": "DOA"
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "getFilteredFromContext",
                              "config": {
                                "target": "#occurenceList",
                                "key": "currentOccurenceData",
                                "properties": {
                                  "key": "dellReworkReplaceUUID" + index
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "condition",
                              "eventSource": "click",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": "#userSelectedLocation",
                                "rhs": "1244"
                              },
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "handleDellReworkActions",
                                      "methodType": "handlegetBCNinfoForIssue",
                                      "eventSource": "click",
                                      "config": {
                                        "element": element,
                                        "index": index,
                                        "successActions": [
                                          {
                                            "type": "context",
                                            "config": {
                                              "requestMethod": "add",
                                              "key": "IssuePartReference" + index,
                                              "data": "responseArray"
                                            }
                                          },
                                          {
                                            "type": "handleDellReworkActions",
                                            "methodType": "handlePerformFA",
                                            "config": {
                                              "element": element,
                                              "index": index,
                                              "successActions": [
                                                {
                                                  "type": "handleDellReworkActions",
                                                  "methodType": "handleAIORemovePart",
                                                  "config": {
                                                    "element": element,
                                                    "index": index,
                                                    "conditionType": "#getSLRXConfigForRemove.condition",
                                                    "successActions": [
                                                      {
                                                        "type": "condition",
                                                        "eventSource": "click",
                                                        "config": {
                                                          "operation": "isEqualTo",
                                                          "lhs": "#repairUnitInfo.GEONAME",
                                                          "rhs": "AMERICAS NETWORK"
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "handleDellReworkActions",
                                                                "methodType": "handleDellAIOGlobalTrigger",
                                                                "config": {
                                                                  "element": element,
                                                                  "index": index,
                                                                  "zone": "#getSLRXConfigForRemove.destinationZone",
                                                                  "bin": "#getSLRXConfigForRemove.destinationBin",
                                                                  "successActions": [
                                                                    {
                                                                      "type": "handleDellReworkActions",
                                                                      "methodType": "handlePerformRemoveParts",
                                                                      "config": {
                                                                        "element": element,
                                                                        "index": index,
                                                                        "conditionType": "#getSLRXConfigForRemove.condition",
                                                                        "zone": "#getSLRXConfigForRemove.destinationZone",
                                                                        "bin": "#getSLRXConfigForRemove.destinationBin",
                                                                        "successActions": [
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "doaLinkUUID" + index,
                                                                              "properties": {
                                                                                "hoverClass": "cursor-default",
                                                                                "iconTextClass": "body text-dark",
                                                                                "disabled": true
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "deleteUUID" + index,
                                                                              "properties": {
                                                                                "disabled": true,
                                                                                "class": "primary-btn dell-debug-delete-button-disable"
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "completeDynamicTaskUUID" + index,
                                                                              "properties": {
                                                                                "disabled": true
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "context",
                                                                            "config": {
                                                                              "requestMethod": "add",
                                                                              "key": "isFromSave&Exit" + index,
                                                                              "data": true
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "context",
                                                                            "config": {
                                                                              "requestMethod": "add",
                                                                              "key": "DOALink" + index,
                                                                              "data": true
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "dellReworkReplaceUUID" + index,
                                                                              "properties": {
                                                                                "expanded": false,
                                                                                "disabled": false,
                                                                                "header": {
                                                                                  "svgIcon": "description_icon",
                                                                                  "statusIcon": "check_circle",
                                                                                  "statusClass": "complete-status",
                                                                                  "class": "complete-task ",
                                                                                  "iconClass": "complete-task"
                                                                                }
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "handleDellReworkActions",
                                                                            "methodType": "taskPanelOpen",
                                                                            "eventSource": "click",
                                                                            "config": {
                                                                              "index": index
                                                                            }
                                                                          }
                                                                        ],
                                                                        "failureActions": [
                                                                          {
                                                                            "type": "handleCommonServices",
                                                                            "config": {
                                                                              "type": "errorRenderTemplate",
                                                                              "contextKey": "errorMsg",
                                                                              "updateKey": "errorTitleUUID"
                                                                            }
                                                                          }
                                                                        ]
                                                                      }
                                                                    }
                                                                  ],
                                                                  "failureActions": [
                                                                    // {
                                                                    //   "type": "handleCommonServices",
                                                                    //   "config": {
                                                                    //     "type": "errorRenderTemplate",
                                                                    //     "contextKey": "errorMsg",
                                                                    //     "updateKey": "errorTitleUUID"
                                                                    //   }
                                                                    // }
                                                                    {
                                                                      "type": "context",
                                                                      "config": {
                                                                        "requestMethod": "add",
                                                                        "key": "IrisCallTriggerMessageforDOA" + index,
                                                                        "data": "responseData"
                                                                      }
                                                                    },
                                                                    {
                                                                      "type": "handleDellReworkActions",
                                                                      "methodType": "IrisCallTriggerValues",
                                                                      "config": {
                                                                        "Message": "IrisCallTriggerMessageDOA" + index,
                                                                        "index": index
                                                                      }
                                                                    },
                                                                    {
                                                                      "type": "handleDellReworkActions",
                                                                      "methodType": "handleDellAIOGlobalTrigger",
                                                                      "config": {
                                                                        "element": element,
                                                                        "index": index,
                                                                        "zone": "#Zone" + index,
                                                                        "bin": "#Bin" + index,
                                                                        "successActions": [
                                                                          {
                                                                            "type": "handleDellReworkActions",
                                                                            "methodType": "handlePerformRemoveParts",
                                                                            "config": {
                                                                              "element": element,
                                                                              "index": index,
                                                                              "conditionType": "#getSLRXConfigForRemove.condition",
                                                                              "zone": "#Zone" + index,
                                                                              "bin": "#Bin" + index,
                                                                              "successActions": [
                                                                                {
                                                                                  "type": "updateComponent",
                                                                                  "config": {
                                                                                    "key": "doaLinkUUID" + index,
                                                                                    "properties": {
                                                                                      "hoverClass": "cursor-default",
                                                                                      "iconTextClass": "body text-dark",
                                                                                      "disabled": true
                                                                                    }
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "updateComponent",
                                                                                  "config": {
                                                                                    "key": "deleteUUID" + index,
                                                                                    "properties": {
                                                                                      "disabled": true,
                                                                                      "class": "primary-btn dell-debug-delete-button-disable"
                                                                                    }
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "updateComponent",
                                                                                  "config": {
                                                                                    "key": "completeDynamicTaskUUID" + index,
                                                                                    "properties": {
                                                                                      "disabled": true
                                                                                    }
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "context",
                                                                                  "config": {
                                                                                    "requestMethod": "add",
                                                                                    "key": "isFromSave&Exit" + index,
                                                                                    "data": true
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "context",
                                                                                  "config": {
                                                                                    "requestMethod": "add",
                                                                                    "key": "DOALink" + index,
                                                                                    "data": true
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "updateComponent",
                                                                                  "config": {
                                                                                    "key": "dellReworkReplaceUUID" + index,
                                                                                    "properties": {
                                                                                      "expanded": false,
                                                                                      "disabled": false,
                                                                                      "header": {
                                                                                        "svgIcon": "description_icon",
                                                                                        "statusIcon": "check_circle",
                                                                                        "statusClass": "complete-status",
                                                                                        "class": "complete-task ",
                                                                                        "iconClass": "complete-task"
                                                                                      }
                                                                                    }
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "handleDellReworkActions",
                                                                                  "methodType": "taskPanelOpen",
                                                                                  "eventSource": "click",
                                                                                  "config": {
                                                                                    "index": index
                                                                                  }
                                                                                }
                                                                              ],
                                                                              "failureActions": [
                                                                                {
                                                                                  "type": "handleCommonServices",
                                                                                  "config": {
                                                                                    "type": "errorRenderTemplate",
                                                                                    "contextKey": "errorMsg",
                                                                                    "updateKey": "errorTitleUUID"
                                                                                  }
                                                                                }
                                                                              ]
                                                                            }
                                                                          }
                                                                        ],
                                                                        "failureActions": [
                                                                          // {
                                                                          //   "type": "handleCommonServices",
                                                                          //   "config": {
                                                                          //     "type": "errorRenderTemplate",
                                                                          //     "contextKey": "errorMsg",
                                                                          //     "updateKey": "errorTitleUUID"
                                                                          //   }
                                                                          // }
                                                                        ]
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
                                                                "type": "handleDellReworkActions",
                                                                "methodType": "handlePerformRemoveParts",
                                                                "config": {
                                                                  "element": element,
                                                                  "index": index,
                                                                  "conditionType": "#getSLRXConfigForRemove.condition",
                                                                  "zone": "#getSLRXConfigForRemove.destinationZone",
                                                                  "bin": "#getSLRXConfigForRemove.destinationBin",
                                                                  "successActions": [
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "doaLinkUUID" + index,
                                                                        "properties": {
                                                                          "hoverClass": "cursor-default",
                                                                          "iconTextClass": "body text-dark",
                                                                          "disabled": true
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "deleteUUID" + index,
                                                                        "properties": {
                                                                          "disabled": true,
                                                                          "class": "primary-btn dell-debug-delete-button-disable"
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "completeDynamicTaskUUID" + index,
                                                                        "properties": {
                                                                          "disabled": true
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "context",
                                                                      "config": {
                                                                        "requestMethod": "add",
                                                                        "key": "isFromSave&Exit" + index,
                                                                        "data": true
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "context",
                                                                      "config": {
                                                                        "requestMethod": "add",
                                                                        "key": "DOALink" + index,
                                                                        "data": true
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "dellReworkReplaceUUID" + index,
                                                                        "properties": {
                                                                          "expanded": false,
                                                                          "disabled": false,
                                                                          "header": {
                                                                            "svgIcon": "description_icon",
                                                                            "statusIcon": "check_circle",
                                                                            "statusClass": "complete-status",
                                                                            "class": "complete-task ",
                                                                            "iconClass": "complete-task"
                                                                          }
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "handleDellReworkActions",
                                                                      "methodType": "taskPanelOpen",
                                                                      "eventSource": "click",
                                                                      "config": {
                                                                        "index": index
                                                                      }
                                                                    }
                                                                  ],
                                                                  "failureActions": [
                                                                    {
                                                                      "type": "handleCommonServices",
                                                                      "config": {
                                                                        "type": "errorRenderTemplate",
                                                                        "contextKey": "errorMsg",
                                                                        "updateKey": "errorTitleUUID"
                                                                      }
                                                                    }
                                                                  ]
                                                                }
                                                              }
                                                            ]
                                                          }
                                                        }
                                                      }
                                                    ],
                                                    "failureActions": [
                                                      // {
                                                      //   "type": "handleCommonServices",
                                                      //   "config": {
                                                      //     "type": "errorRenderTemplate",
                                                      //     "contextKey": "errorMsg",
                                                      //     "updateKey": "errorTitleUUID"
                                                      //   }
                                                      // }
                                                      {
                                                        "type": "context",
                                                        "config": {
                                                          "requestMethod": "add",
                                                          "key": "RemoveTriggerMessageDOA" + index,
                                                          "data": "responseData"
                                                        }
                                                      },
                                                      {
                                                        "type": "splitString",
                                                        "config": {
                                                          "data": "#RemoveTriggerMessageDOA" + index,
                                                          "splitkey": "-",
                                                          "position": 1,
                                                          "contextKey": "conditionDOA" + index
                                                        }
                                                      },
                                                      {
                                                        "type": "handleDellReworkActions",
                                                        "methodType": "handleAIORemovePart",
                                                        "config": {
                                                          "element": element,
                                                          "index": index,
                                                          "conditionType": "#conditionDOA" + index,
                                                          "successActions": [
                                                            {
                                                              "type": "condition",
                                                              "eventSource": "click",
                                                              "config": {
                                                                "operation": "isEqualTo",
                                                                "lhs": "#repairUnitInfo.GEONAME",
                                                                "rhs": "AMERICAS NETWORK"
                                                              },
                                                              "responseDependents": {
                                                                "onSuccess": {
                                                                  "actions": [
                                                                    {
                                                                      "type": "handleDellReworkActions",
                                                                      "methodType": "handleDellAIOGlobalTrigger",
                                                                      "config": {
                                                                        "element": element,
                                                                        "index": index,
                                                                        "zone": "#getSLRXConfigForRemove.destinationZone",
                                                                        "bin": "#getSLRXConfigForRemove.destinationBin",
                                                                        "successActions": [
                                                                          {
                                                                            "type": "handleDellReworkActions",
                                                                            "methodType": "handlePerformRemoveParts",
                                                                            "config": {
                                                                              "element": element,
                                                                              "index": index,
                                                                              "conditionType": "#conditionDOA" + index,
                                                                              "zone": "#getSLRXConfigForRemove.destinationZone",
                                                                              "bin": "#getSLRXConfigForRemove.destinationBin",
                                                                              "successActions": [
                                                                                {
                                                                                  "type": "updateComponent",
                                                                                  "config": {
                                                                                    "key": "doaLinkUUID" + index,
                                                                                    "properties": {
                                                                                      "hoverClass": "cursor-default",
                                                                                      "iconTextClass": "body text-dark",
                                                                                      "disabled": true
                                                                                    }
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "updateComponent",
                                                                                  "config": {
                                                                                    "key": "deleteUUID" + index,
                                                                                    "properties": {
                                                                                      "disabled": true,
                                                                                      "class": "primary-btn dell-debug-delete-button-disable"
                                                                                    }
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "updateComponent",
                                                                                  "config": {
                                                                                    "key": "completeDynamicTaskUUID" + index,
                                                                                    "properties": {
                                                                                      "disabled": true
                                                                                    }
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "context",
                                                                                  "config": {
                                                                                    "requestMethod": "add",
                                                                                    "key": "isFromSave&Exit" + index,
                                                                                    "data": true
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "context",
                                                                                  "config": {
                                                                                    "requestMethod": "add",
                                                                                    "key": "DOALink" + index,
                                                                                    "data": true
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "updateComponent",
                                                                                  "config": {
                                                                                    "key": "dellReworkReplaceUUID" + index,
                                                                                    "properties": {
                                                                                      "expanded": false,
                                                                                      "disabled": false,
                                                                                      "header": {
                                                                                        "svgIcon": "description_icon",
                                                                                        "statusIcon": "check_circle",
                                                                                        "statusClass": "complete-status",
                                                                                        "class": "complete-task ",
                                                                                        "iconClass": "complete-task"
                                                                                      }
                                                                                    }
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "handleDellReworkActions",
                                                                                  "methodType": "taskPanelOpen",
                                                                                  "eventSource": "click",
                                                                                  "config": {
                                                                                    "index": index
                                                                                  }
                                                                                }
                                                                              ],
                                                                              "failureActions": [
                                                                                {
                                                                                  "type": "handleCommonServices",
                                                                                  "config": {
                                                                                    "type": "errorRenderTemplate",
                                                                                    "contextKey": "errorMsg",
                                                                                    "updateKey": "errorTitleUUID"
                                                                                  }
                                                                                }
                                                                              ]
                                                                            }
                                                                          }
                                                                        ],
                                                                        "failureActions": [
                                                                          // {
                                                                          //   "type": "handleCommonServices",
                                                                          //   "config": {
                                                                          //     "type": "errorRenderTemplate",
                                                                          //     "contextKey": "errorMsg",
                                                                          //     "updateKey": "errorTitleUUID"
                                                                          //   }
                                                                          // }
                                                                          {
                                                                            "type": "context",
                                                                            "config": {
                                                                              "requestMethod": "add",
                                                                              "key": "IrisCallTriggerMessageforDOA" + index,
                                                                              "data": "responseData"
                                                                            }
                                                                          },
                                                                          {
                                                                            "type": "handleDellReworkActions",
                                                                            "methodType": "IrisCallTriggerValues",
                                                                            "config": {
                                                                              "Message": "IrisCallTriggerMessageDOA" + index,
                                                                              "index": index
                                                                            }
                                                                          },
                                                                          {
                                                                            "type": "handleDellReworkActions",
                                                                            "methodType": "handleDellAIOGlobalTrigger",
                                                                            "config": {
                                                                              "element": element,
                                                                              "index": index,
                                                                              "zone": "#Zone" + index,
                                                                              "bin": "#Bin" + index,
                                                                              "successActions": [
                                                                                {
                                                                                  "type": "handleDellReworkActions",
                                                                                  "methodType": "handlePerformRemoveParts",
                                                                                  "config": {
                                                                                    "element": element,
                                                                                    "index": index,
                                                                                    "conditionType": "#conditionDOA" + index,
                                                                                    "zone": "#Zone" + index,
                                                                                    "bin": "#Bin" + index,
                                                                                    "successActions": [
                                                                                      {
                                                                                        "type": "updateComponent",
                                                                                        "config": {
                                                                                          "key": "doaLinkUUID" + index,
                                                                                          "properties": {
                                                                                            "hoverClass": "cursor-default",
                                                                                            "iconTextClass": "body text-dark",
                                                                                            "disabled": true
                                                                                          }
                                                                                        },
                                                                                        "eventSource": "click"
                                                                                      },
                                                                                      {
                                                                                        "type": "updateComponent",
                                                                                        "config": {
                                                                                          "key": "deleteUUID" + index,
                                                                                          "properties": {
                                                                                            "disabled": true,
                                                                                            "class": "primary-btn dell-debug-delete-button-disable"
                                                                                          }
                                                                                        },
                                                                                        "eventSource": "click"
                                                                                      },
                                                                                      {
                                                                                        "type": "updateComponent",
                                                                                        "config": {
                                                                                          "key": "completeDynamicTaskUUID" + index,
                                                                                          "properties": {
                                                                                            "disabled": true
                                                                                          }
                                                                                        },
                                                                                        "eventSource": "click"
                                                                                      },
                                                                                      {
                                                                                        "type": "context",
                                                                                        "config": {
                                                                                          "requestMethod": "add",
                                                                                          "key": "isFromSave&Exit" + index,
                                                                                          "data": true
                                                                                        },
                                                                                        "eventSource": "click"
                                                                                      },
                                                                                      {
                                                                                        "type": "context",
                                                                                        "config": {
                                                                                          "requestMethod": "add",
                                                                                          "key": "DOALink" + index,
                                                                                          "data": true
                                                                                        },
                                                                                        "eventSource": "click"
                                                                                      },
                                                                                      {
                                                                                        "type": "updateComponent",
                                                                                        "config": {
                                                                                          "key": "dellReworkReplaceUUID" + index,
                                                                                          "properties": {
                                                                                            "expanded": false,
                                                                                            "disabled": false,
                                                                                            "header": {
                                                                                              "svgIcon": "description_icon",
                                                                                              "statusIcon": "check_circle",
                                                                                              "statusClass": "complete-status",
                                                                                              "class": "complete-task ",
                                                                                              "iconClass": "complete-task"
                                                                                            }
                                                                                          }
                                                                                        },
                                                                                        "eventSource": "click"
                                                                                      },
                                                                                      {
                                                                                        "type": "handleDellReworkActions",
                                                                                        "methodType": "taskPanelOpen",
                                                                                        "eventSource": "click",
                                                                                        "config": {
                                                                                          "index": index
                                                                                        }
                                                                                      }
                                                                                    ],
                                                                                    "failureActions": [
                                                                                      {
                                                                                        "type": "handleCommonServices",
                                                                                        "config": {
                                                                                          "type": "errorRenderTemplate",
                                                                                          "contextKey": "errorMsg",
                                                                                          "updateKey": "errorTitleUUID"
                                                                                        }
                                                                                      }
                                                                                    ]
                                                                                  }
                                                                                }
                                                                              ],
                                                                              "failureActions": [
                                                                                // {
                                                                                //   "type": "handleCommonServices",
                                                                                //   "config": {
                                                                                //     "type": "errorRenderTemplate",
                                                                                //     "contextKey": "errorMsg",
                                                                                //     "updateKey": "errorTitleUUID"
                                                                                //   }
                                                                                // }
                                                                              ]
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
                                                                      "type": "handleDellReworkActions",
                                                                      "methodType": "handlePerformRemoveParts",
                                                                      "config": {
                                                                        "element": element,
                                                                        "index": index,
                                                                        "conditionType": "#conditionDOA" + index,
                                                                        "zone": "#getSLRXConfigForRemove.destinationZone",
                                                                        "bin": "#getSLRXConfigForRemove.destinationBin",
                                                                        "successActions": [
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "doaLinkUUID" + index,
                                                                              "properties": {
                                                                                "hoverClass": "cursor-default",
                                                                                "iconTextClass": "body text-dark",
                                                                                "disabled": true
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "deleteUUID" + index,
                                                                              "properties": {
                                                                                "disabled": true,
                                                                                "class": "primary-btn dell-debug-delete-button-disable"
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "completeDynamicTaskUUID" + index,
                                                                              "properties": {
                                                                                "disabled": true
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "context",
                                                                            "config": {
                                                                              "requestMethod": "add",
                                                                              "key": "isFromSave&Exit" + index,
                                                                              "data": true
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "context",
                                                                            "config": {
                                                                              "requestMethod": "add",
                                                                              "key": "DOALink" + index,
                                                                              "data": true
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "dellReworkReplaceUUID" + index,
                                                                              "properties": {
                                                                                "expanded": false,
                                                                                "disabled": false,
                                                                                "header": {
                                                                                  "svgIcon": "description_icon",
                                                                                  "statusIcon": "check_circle",
                                                                                  "statusClass": "complete-status",
                                                                                  "class": "complete-task ",
                                                                                  "iconClass": "complete-task"
                                                                                }
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "handleDellReworkActions",
                                                                            "methodType": "taskPanelOpen",
                                                                            "eventSource": "click",
                                                                            "config": {
                                                                              "index": index
                                                                            }
                                                                          }
                                                                        ],
                                                                        "failureActions": [
                                                                          {
                                                                            "type": "handleCommonServices",
                                                                            "config": {
                                                                              "type": "errorRenderTemplate",
                                                                              "contextKey": "errorMsg",
                                                                              "updateKey": "errorTitleUUID"
                                                                            }
                                                                          }
                                                                        ]
                                                                      }
                                                                    }
                                                                  ]
                                                                }
                                                              }
                                                            }
                                                          ],
                                                          "failureActions": [
                                                            {
                                                              "type": "handleCommonServices",
                                                              "config": {
                                                                "type": "errorRenderTemplate",
                                                                "contextKey": "errorMsg",
                                                                "updateKey": "errorTitleUUID"
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ],
                                              "failureActions": [
                                                {
                                                  "type": "handleCommonServices",
                                                  "config": {
                                                    "type": "errorRenderTemplate",
                                                    "contextKey": "errorMsg",
                                                    "updateKey": "errorTitleUUID"
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        ],
                                        "failureActions": [
                                          {
                                            "type": "handleCommonServices",
                                            "config": {
                                              "type": "errorRenderTemplate",
                                              "contextKey": "errorMsg",
                                              "updateKey": "errorTitleUUID"
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
                                      "type": "handleDellReworkActions",
                                      "methodType": "handlePerformFA",
                                      "config": {
                                        "element": element,
                                        "index": index,
                                        "successActions": [
                                          {
                                            "type": "handleDellReworkActions",
                                            "methodType": "handleAIORemovePart",
                                            "config": {
                                              "element": element,
                                              "index": index,
                                              "conditionType": "#getSLRXConfigForRemove.condition",
                                              "successActions": [
                                                {
                                                  "type": "condition",
                                                  "eventSource": "click",
                                                  "config": {
                                                    "operation": "isEqualTo",
                                                    "lhs": "#repairUnitInfo.GEONAME",
                                                    "rhs": "AMERICAS NETWORK"
                                                  },
                                                  "responseDependents": {
                                                    "onSuccess": {
                                                      "actions": [
                                                        {
                                                          "type": "handleDellReworkActions",
                                                          "methodType": "handleDellAIOGlobalTrigger",
                                                          "config": {
                                                            "element": element,
                                                            "index": index,
                                                            "zone": "#getSLRXConfigForRemove.destinationZone",
                                                            "bin": "#getSLRXConfigForRemove.destinationBin",
                                                            "successActions": [
                                                              {
                                                                "type": "handleDellReworkActions",
                                                                "methodType": "handlePerformRemoveParts",
                                                                "config": {
                                                                  "element": element,
                                                                  "index": index,
                                                                  "conditionType": "#getSLRXConfigForRemove.condition",
                                                                  "zone": "#getSLRXConfigForRemove.destinationZone",
                                                                  "bin": "#getSLRXConfigForRemove.destinationBin",
                                                                  "successActions": [
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "doaLinkUUID" + index,
                                                                        "properties": {
                                                                          "hoverClass": "cursor-default",
                                                                          "iconTextClass": "body text-dark",
                                                                          "disabled": true
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "deleteUUID" + index,
                                                                        "properties": {
                                                                          "disabled": true,
                                                                          "class": "primary-btn dell-debug-delete-button-disable"
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "completeDynamicTaskUUID" + index,
                                                                        "properties": {
                                                                          "disabled": true
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "context",
                                                                      "config": {
                                                                        "requestMethod": "add",
                                                                        "key": "isFromSave&Exit" + index,
                                                                        "data": true
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "context",
                                                                      "config": {
                                                                        "requestMethod": "add",
                                                                        "key": "DOALink" + index,
                                                                        "data": true
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "dellReworkReplaceUUID" + index,
                                                                        "properties": {
                                                                          "expanded": false,
                                                                          "disabled": false,
                                                                          "header": {
                                                                            "svgIcon": "description_icon",
                                                                            "statusIcon": "check_circle",
                                                                            "statusClass": "complete-status",
                                                                            "class": "complete-task ",
                                                                            "iconClass": "complete-task"
                                                                          }
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "handleDellReworkActions",
                                                                      "methodType": "taskPanelOpen",
                                                                      "eventSource": "click",
                                                                      "config": {
                                                                        "index": index
                                                                      }
                                                                    }
                                                                  ],
                                                                  "failureActions": [
                                                                    {
                                                                      "type": "handleCommonServices",
                                                                      "config": {
                                                                        "type": "errorRenderTemplate",
                                                                        "contextKey": "errorMsg",
                                                                        "updateKey": "errorTitleUUID"
                                                                      }
                                                                    }
                                                                  ]
                                                                }
                                                              }
                                                            ],
                                                            "failureActions": [
                                                              // {
                                                              //   "type": "handleCommonServices",
                                                              //   "config": {
                                                              //     "type": "errorRenderTemplate",
                                                              //     "contextKey": "errorMsg",
                                                              //     "updateKey": "errorTitleUUID"
                                                              //   }
                                                              // }
                                                              {
                                                                "type": "context",
                                                                "config": {
                                                                  "requestMethod": "add",
                                                                  "key": "IrisCallTriggerMessageforDOA" + index,
                                                                  "data": "responseData"
                                                                }
                                                              },
                                                              {
                                                                "type": "handleDellReworkActions",
                                                                "methodType": "IrisCallTriggerValues",
                                                                "config": {
                                                                  "Message": "IrisCallTriggerMessageDOA" + index,
                                                                  "index": index
                                                                }
                                                              },
                                                              {
                                                                "type": "handleDellReworkActions",
                                                                "methodType": "handleDellAIOGlobalTrigger",
                                                                "config": {
                                                                  "element": element,
                                                                  "index": index,
                                                                  "zone": "#Zone" + index,
                                                                  "bin": "#Bin" + index,
                                                                  "successActions": [
                                                                    {
                                                                      "type": "handleDellReworkActions",
                                                                      "methodType": "handlePerformRemoveParts",
                                                                      "config": {
                                                                        "element": element,
                                                                        "index": index,
                                                                        "conditionType": "#getSLRXConfigForRemove.condition",
                                                                        "zone": "#Zone" + index,
                                                                        "bin": "#Bin" + index,
                                                                        "successActions": [
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "doaLinkUUID" + index,
                                                                              "properties": {
                                                                                "hoverClass": "cursor-default",
                                                                                "iconTextClass": "body text-dark",
                                                                                "disabled": true
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "deleteUUID" + index,
                                                                              "properties": {
                                                                                "disabled": true,
                                                                                "class": "primary-btn dell-debug-delete-button-disable"
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "completeDynamicTaskUUID" + index,
                                                                              "properties": {
                                                                                "disabled": true
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "context",
                                                                            "config": {
                                                                              "requestMethod": "add",
                                                                              "key": "isFromSave&Exit" + index,
                                                                              "data": true
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "context",
                                                                            "config": {
                                                                              "requestMethod": "add",
                                                                              "key": "DOALink" + index,
                                                                              "data": true
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "dellReworkReplaceUUID" + index,
                                                                              "properties": {
                                                                                "expanded": false,
                                                                                "disabled": false,
                                                                                "header": {
                                                                                  "svgIcon": "description_icon",
                                                                                  "statusIcon": "check_circle",
                                                                                  "statusClass": "complete-status",
                                                                                  "class": "complete-task ",
                                                                                  "iconClass": "complete-task"
                                                                                }
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "handleDellReworkActions",
                                                                            "methodType": "taskPanelOpen",
                                                                            "eventSource": "click",
                                                                            "config": {
                                                                              "index": index
                                                                            }
                                                                          }
                                                                        ],
                                                                        "failureActions": [
                                                                          {
                                                                            "type": "handleCommonServices",
                                                                            "config": {
                                                                              "type": "errorRenderTemplate",
                                                                              "contextKey": "errorMsg",
                                                                              "updateKey": "errorTitleUUID"
                                                                            }
                                                                          }
                                                                        ]
                                                                      }
                                                                    }
                                                                  ],
                                                                  "failureActions": [
                                                                    // {
                                                                    //   "type": "handleCommonServices",
                                                                    //   "config": {
                                                                    //     "type": "errorRenderTemplate",
                                                                    //     "contextKey": "errorMsg",
                                                                    //     "updateKey": "errorTitleUUID"
                                                                    //   }
                                                                    // }
                                                                  ]
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
                                                          "type": "handleDellReworkActions",
                                                          "methodType": "handlePerformRemoveParts",
                                                          "config": {
                                                            "element": element,
                                                            "index": index,
                                                            "conditionType": "#getSLRXConfigForRemove.condition",
                                                            "zone": "#getSLRXConfigForRemove.destinationZone",
                                                            "bin": "#getSLRXConfigForRemove.destinationBin",
                                                            "successActions": [
                                                              {
                                                                "type": "updateComponent",
                                                                "config": {
                                                                  "key": "doaLinkUUID" + index,
                                                                  "properties": {
                                                                    "hoverClass": "cursor-default",
                                                                    "iconTextClass": "body text-dark",
                                                                    "disabled": true
                                                                  }
                                                                },
                                                                "eventSource": "click"
                                                              },
                                                              {
                                                                "type": "updateComponent",
                                                                "config": {
                                                                  "key": "deleteUUID" + index,
                                                                  "properties": {
                                                                    "disabled": true,
                                                                    "class": "primary-btn dell-debug-delete-button-disable"
                                                                  }
                                                                },
                                                                "eventSource": "click"
                                                              },
                                                              {
                                                                "type": "updateComponent",
                                                                "config": {
                                                                  "key": "completeDynamicTaskUUID" + index,
                                                                  "properties": {
                                                                    "disabled": true
                                                                  }
                                                                },
                                                                "eventSource": "click"
                                                              },
                                                              {
                                                                "type": "context",
                                                                "config": {
                                                                  "requestMethod": "add",
                                                                  "key": "isFromSave&Exit" + index,
                                                                  "data": true
                                                                },
                                                                "eventSource": "click"
                                                              },
                                                              {
                                                                "type": "context",
                                                                "config": {
                                                                  "requestMethod": "add",
                                                                  "key": "DOALink" + index,
                                                                  "data": true
                                                                },
                                                                "eventSource": "click"
                                                              },
                                                              {
                                                                "type": "updateComponent",
                                                                "config": {
                                                                  "key": "dellReworkReplaceUUID" + index,
                                                                  "properties": {
                                                                    "expanded": false,
                                                                    "disabled": false,
                                                                    "header": {
                                                                      "svgIcon": "description_icon",
                                                                      "statusIcon": "check_circle",
                                                                      "statusClass": "complete-status",
                                                                      "class": "complete-task ",
                                                                      "iconClass": "complete-task"
                                                                    }
                                                                  }
                                                                },
                                                                "eventSource": "click"
                                                              },
                                                              {
                                                                "type": "handleDellReworkActions",
                                                                "methodType": "taskPanelOpen",
                                                                "eventSource": "click",
                                                                "config": {
                                                                  "index": index
                                                                }
                                                              }
                                                            ],
                                                            "failureActions": [
                                                              {
                                                                "type": "handleCommonServices",
                                                                "config": {
                                                                  "type": "errorRenderTemplate",
                                                                  "contextKey": "errorMsg",
                                                                  "updateKey": "errorTitleUUID"
                                                                }
                                                              }
                                                            ]
                                                          }
                                                        }
                                                      ]
                                                    }
                                                  }
                                                }
                                              ],
                                              "failureActions": [
                                                // {
                                                //   "type": "handleCommonServices",
                                                //   "config": {
                                                //     "type": "errorRenderTemplate",
                                                //     "contextKey": "errorMsg",
                                                //     "updateKey": "errorTitleUUID"
                                                //   }
                                                // }
                                                {
                                                  "type": "context",
                                                  "config": {
                                                    "requestMethod": "add",
                                                    "key": "RemoveTriggerMessageDOA" + index,
                                                    "data": "responseData"
                                                  }
                                                },
                                                {
                                                  "type": "splitString",
                                                  "config": {
                                                    "data": "#RemoveTriggerMessageDOA" + index,
                                                    "splitkey": "-",
                                                    "position": 1,
                                                    "contextKey": "conditionDOA" + index
                                                  }
                                                },
                                                {
                                                  "type": "handleDellReworkActions",
                                                  "methodType": "handleAIORemovePart",
                                                  "config": {
                                                    "element": element,
                                                    "index": index,
                                                    "conditionType": "#conditionDOA" + index,
                                                    "successActions": [
                                                      {
                                                        "type": "condition",
                                                        "eventSource": "click",
                                                        "config": {
                                                          "operation": "isEqualTo",
                                                          "lhs": "#repairUnitInfo.GEONAME",
                                                          "rhs": "AMERICAS NETWORK"
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "handleDellReworkActions",
                                                                "methodType": "handleDellAIOGlobalTrigger",
                                                                "config": {
                                                                  "element": element,
                                                                  "index": index,
                                                                  "zone": "#getSLRXConfigForRemove.destinationZone",
                                                                  "bin": "#getSLRXConfigForRemove.destinationBin",
                                                                  "successActions": [
                                                                    {
                                                                      "type": "handleDellReworkActions",
                                                                      "methodType": "handlePerformRemoveParts",
                                                                      "config": {
                                                                        "element": element,
                                                                        "index": index,
                                                                        "conditionType": "#conditionDOA" + index,
                                                                        "zone": "#getSLRXConfigForRemove.destinationZone",
                                                                        "bin": "#getSLRXConfigForRemove.destinationBin",
                                                                        "successActions": [
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "doaLinkUUID" + index,
                                                                              "properties": {
                                                                                "hoverClass": "cursor-default",
                                                                                "iconTextClass": "body text-dark",
                                                                                "disabled": true
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "deleteUUID" + index,
                                                                              "properties": {
                                                                                "disabled": true,
                                                                                "class": "primary-btn dell-debug-delete-button-disable"
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "completeDynamicTaskUUID" + index,
                                                                              "properties": {
                                                                                "disabled": true
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "context",
                                                                            "config": {
                                                                              "requestMethod": "add",
                                                                              "key": "isFromSave&Exit" + index,
                                                                              "data": true
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "context",
                                                                            "config": {
                                                                              "requestMethod": "add",
                                                                              "key": "DOALink" + index,
                                                                              "data": true
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                              "key": "dellReworkReplaceUUID" + index,
                                                                              "properties": {
                                                                                "expanded": false,
                                                                                "disabled": false,
                                                                                "header": {
                                                                                  "svgIcon": "description_icon",
                                                                                  "statusIcon": "check_circle",
                                                                                  "statusClass": "complete-status",
                                                                                  "class": "complete-task ",
                                                                                  "iconClass": "complete-task"
                                                                                }
                                                                              }
                                                                            },
                                                                            "eventSource": "click"
                                                                          },
                                                                          {
                                                                            "type": "handleDellReworkActions",
                                                                            "methodType": "taskPanelOpen",
                                                                            "eventSource": "click",
                                                                            "config": {
                                                                              "index": index
                                                                            }
                                                                          }
                                                                        ],
                                                                        "failureActions": [
                                                                          {
                                                                            "type": "handleCommonServices",
                                                                            "config": {
                                                                              "type": "errorRenderTemplate",
                                                                              "contextKey": "errorMsg",
                                                                              "updateKey": "errorTitleUUID"
                                                                            }
                                                                          }
                                                                        ]
                                                                      }
                                                                    }
                                                                  ],
                                                                  "failureActions": [
                                                                    // {
                                                                    //   "type": "handleCommonServices",
                                                                    //   "config": {
                                                                    //     "type": "errorRenderTemplate",
                                                                    //     "contextKey": "errorMsg",
                                                                    //     "updateKey": "errorTitleUUID"
                                                                    //   }
                                                                    // }
                                                                    {
                                                                      "type": "context",
                                                                      "config": {
                                                                        "requestMethod": "add",
                                                                        "key": "IrisCallTriggerMessageforDOA" + index,
                                                                        "data": "responseData"
                                                                      }
                                                                    },
                                                                    {
                                                                      "type": "handleDellReworkActions",
                                                                      "methodType": "IrisCallTriggerValues",
                                                                      "config": {
                                                                        "Message": "IrisCallTriggerMessageDOA" + index,
                                                                        "index": index
                                                                      }
                                                                    },
                                                                    {
                                                                      "type": "handleDellReworkActions",
                                                                      "methodType": "handleDellAIOGlobalTrigger",
                                                                      "config": {
                                                                        "element": element,
                                                                        "index": index,
                                                                        "zone": "#Zone" + index,
                                                                        "bin": "#Bin" + index,
                                                                        "successActions": [
                                                                          {
                                                                            "type": "handleDellReworkActions",
                                                                            "methodType": "handlePerformRemoveParts",
                                                                            "config": {
                                                                              "element": element,
                                                                              "index": index,
                                                                              "conditionType": "#conditionDOA" + index,
                                                                              "zone": "#Zone" + index,
                                                                              "bin": "#Bin" + index,
                                                                              "successActions": [
                                                                                {
                                                                                  "type": "updateComponent",
                                                                                  "config": {
                                                                                    "key": "doaLinkUUID" + index,
                                                                                    "properties": {
                                                                                      "hoverClass": "cursor-default",
                                                                                      "iconTextClass": "body text-dark",
                                                                                      "disabled": true
                                                                                    }
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "updateComponent",
                                                                                  "config": {
                                                                                    "key": "deleteUUID" + index,
                                                                                    "properties": {
                                                                                      "disabled": true,
                                                                                      "class": "primary-btn dell-debug-delete-button-disable"
                                                                                    }
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "updateComponent",
                                                                                  "config": {
                                                                                    "key": "completeDynamicTaskUUID" + index,
                                                                                    "properties": {
                                                                                      "disabled": true
                                                                                    }
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "context",
                                                                                  "config": {
                                                                                    "requestMethod": "add",
                                                                                    "key": "isFromSave&Exit" + index,
                                                                                    "data": true
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "context",
                                                                                  "config": {
                                                                                    "requestMethod": "add",
                                                                                    "key": "DOALink" + index,
                                                                                    "data": true
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "updateComponent",
                                                                                  "config": {
                                                                                    "key": "dellReworkReplaceUUID" + index,
                                                                                    "properties": {
                                                                                      "expanded": false,
                                                                                      "disabled": false,
                                                                                      "header": {
                                                                                        "svgIcon": "description_icon",
                                                                                        "statusIcon": "check_circle",
                                                                                        "statusClass": "complete-status",
                                                                                        "class": "complete-task ",
                                                                                        "iconClass": "complete-task"
                                                                                      }
                                                                                    }
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                },
                                                                                {
                                                                                  "type": "handleDellReworkActions",
                                                                                  "methodType": "taskPanelOpen",
                                                                                  "eventSource": "click",
                                                                                  "config": {
                                                                                    "index": index
                                                                                  }
                                                                                }
                                                                              ],
                                                                              "failureActions": [
                                                                                {
                                                                                  "type": "handleCommonServices",
                                                                                  "config": {
                                                                                    "type": "errorRenderTemplate",
                                                                                    "contextKey": "errorMsg",
                                                                                    "updateKey": "errorTitleUUID"
                                                                                  }
                                                                                }
                                                                              ]
                                                                            }
                                                                          }
                                                                        ],
                                                                        "failureActions": [
                                                                          // {
                                                                          //   "type": "handleCommonServices",
                                                                          //   "config": {
                                                                          //     "type": "errorRenderTemplate",
                                                                          //     "contextKey": "errorMsg",
                                                                          //     "updateKey": "errorTitleUUID"
                                                                          //   }
                                                                          // }
                                                                        ]
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
                                                                "type": "handleDellReworkActions",
                                                                "methodType": "handlePerformRemoveParts",
                                                                "config": {
                                                                  "element": element,
                                                                  "index": index,
                                                                  "conditionType": "#conditionDOA" + index,
                                                                  "zone": "#getSLRXConfigForRemove.destinationZone",
                                                                  "bin": "#getSLRXConfigForRemove.destinationBin",
                                                                  "successActions": [
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "doaLinkUUID" + index,
                                                                        "properties": {
                                                                          "hoverClass": "cursor-default",
                                                                          "iconTextClass": "body text-dark",
                                                                          "disabled": true
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "deleteUUID" + index,
                                                                        "properties": {
                                                                          "disabled": true,
                                                                          "class": "primary-btn dell-debug-delete-button-disable"
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "completeDynamicTaskUUID" + index,
                                                                        "properties": {
                                                                          "disabled": true
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "context",
                                                                      "config": {
                                                                        "requestMethod": "add",
                                                                        "key": "isFromSave&Exit" + index,
                                                                        "data": true
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "context",
                                                                      "config": {
                                                                        "requestMethod": "add",
                                                                        "key": "DOALink" + index,
                                                                        "data": true
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "dellReworkReplaceUUID" + index,
                                                                        "properties": {
                                                                          "expanded": false,
                                                                          "disabled": false,
                                                                          "header": {
                                                                            "svgIcon": "description_icon",
                                                                            "statusIcon": "check_circle",
                                                                            "statusClass": "complete-status",
                                                                            "class": "complete-task ",
                                                                            "iconClass": "complete-task"
                                                                          }
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "handleDellReworkActions",
                                                                      "methodType": "taskPanelOpen",
                                                                      "eventSource": "click",
                                                                      "config": {
                                                                        "index": index
                                                                      }
                                                                    }
                                                                  ],
                                                                  "failureActions": [
                                                                    {
                                                                      "type": "handleCommonServices",
                                                                      "config": {
                                                                        "type": "errorRenderTemplate",
                                                                        "contextKey": "errorMsg",
                                                                        "updateKey": "errorTitleUUID"
                                                                      }
                                                                    }
                                                                  ]
                                                                }
                                                              }
                                                            ]
                                                          }
                                                        }
                                                      }
                                                    ],
                                                    "failureActions": [
                                                      {
                                                        "type": "handleCommonServices",
                                                        "config": {
                                                          "type": "errorRenderTemplate",
                                                          "contextKey": "errorMsg",
                                                          "updateKey": "errorTitleUUID"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        ],
                                        "failureActions": [
                                          {
                                            "type": "handleCommonServices",
                                            "config": {
                                              "type": "errorRenderTemplate",
                                              "contextKey": "errorMsg",
                                              "updateKey": "errorTitleUUID"
                                            }
                                          }
                                        ]
                                      }
                                    }
                                  ]
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
                {
                  "ctype": "iconText",
                  "icon": "",
                  "text": "Return To Stock (RTS)",
                  "textCss": "",
                  "hoverClass": requisitionFlag === true ? "cursor-pointer" : "cursor-default",
                  "css": "position: absolute; left: 0px; bottom: 1px",
                  "iconPosition": "Before",
                  "iconTextClass": requisitionFlag === true ? "body text-primary" : "body text-dark",
                  "uuid": "RTSUUID" + index,
                  "inLine": true,
                  "name": "RTSName" + index,
                  "disabled": requisitionFlag === true ? false : true,
                  "hidden": false,
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "RTSformdata" + index,
                        "data": "rawFormData"
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "getFilteredFromContext",
                      "config": {
                        "target": "#occurenceList",
                        "key": "currentOccurenceData",
                        "properties": {
                          "key": "dellReworkReplaceUUID" + index
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "dialog",
                      "uuid": "RTSDialogUUID" + index,
                      "config": {
                        "title": "Are you sure you want to RTS this part?",
                        "items": [],
                        "height": "192px",
                        "width": "356px",
                        "minimumWidth": false,
                        "disableClose": false,
                        "closeIcon": "A",
                        "footer": [
                          {
                            "ctype": "button",
                            "color": "primary",
                            "buttonClass": "rtsyes",
                            "text": "Yes",
                            "uuid": "rtsYesUUID" + index,
                            "closeType": "success",
                            "disableClose": true,
                            "visibility": true,
                            "dialogButton": true,
                            "type": "submit",
                            "hooks": [],
                            "validations": [],
                            "actions": []
                          },
                          {
                            "ctype": "button",
                            "color": "primary",
                            "buttonClass": "rtsno",
                            "text": "No",
                            "uuid": "rtsNoUUID" + index,
                            "dialogButton": true,
                            "visibility": true,
                            "disabled": false,
                            "type": "",
                            "closeType": "close",
                            "hooks": [],
                            "validations": [],
                            "actions": []
                          }
                        ]
                      },
                      "eventSource": "click",
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "errorTitleUUID",
                                "properties": {
                                  "titleValue": "",
                                  "isShown": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "context",
                              "config": {
                                "requestMethod": "add",
                                "key": "PerformRemovePartsFlag" + index,
                                "data": "RTS"
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "condition",
                              "eventSource": "click",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": "#repairUnitInfo.LOCATION_ID",
                                "rhs": "1244"
                              },
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "microservice",
                                      "eventSource": "click",
                                      "config": {
                                        "microserviceId": "undoFA",
                                        "requestMethod": "post",
                                        "body": {
                                          "updateFailureAnalysisRequest": {
                                            "bcn": "#repairUnitInfo.ITEM_BCN",
                                            "actionCodeChangeList": {
                                              "actionCodeChange": [{
                                                "defectCode": {
                                                  "occurrence": "#currentOccurenceData.defectCodeOccurence",
                                                  "value": element.defectCode
                                                },
                                                "actionCode": "RPL",
                                                "operation": "Delete"
                                              }]
                                            }
                                          },
                                          "userPwd": {
                                            "username": "#loginUUID.username",
                                            "password": "#loginUUID.password"
                                          },
                                          "operationTypes": "ProcessImmediate",
                                          "ip": "::1",
                                          "callSource": "FrontEnd",
                                          "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
                                          "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
                                        }
                                      },
                                      "responseDependents": {
                                        "onSuccess": {
                                          "actions": [
                                            {
                                              "type": "handleDellReworkActions",
                                              "methodType": "handlePerformFA",
                                              "config": {
                                                "element": element,
                                                "index": index,
                                                "successActions": [
                                                  {
                                                    "type": "handleDellReworkActions",
                                                    "methodType": "handleMoveInventory",
                                                    "config": {
                                                      "element": element,
                                                      "index": index,
                                                      "successActions": [
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "defectivePartUUID" + index,
                                                            "properties": {
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "defectivePartNoPPIDUUID" + index,
                                                            "properties": {
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "noPartToRemoveUUID" + index,
                                                            "properties": {
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "defectiveNoteUUID" + index,
                                                            "properties": {
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "newPartUUID" + index,
                                                            "properties": {
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "newPartNoPPIDUUID" + index,
                                                            "properties": {
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "RTSUUID" + index,
                                                            "properties": {
                                                              "hoverClass": "cursor-default",
                                                              "iconTextClass": "body text-dark",
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "deleteUUID" + index,
                                                            "properties": {
                                                              "disabled": true,
                                                              "class": "primary-btn dell-debug-delete-button-disable"
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "completeDynamicTaskUUID" + index,
                                                            "properties": {
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "dellReworkReplaceUUID" + index,
                                                            "properties": {
                                                              "expanded": false,
                                                              "disabled": false,
                                                              "header": {
                                                                "svgIcon": "description_icon",
                                                                "statusIcon": "check_circle",
                                                                "statusClass": "complete-status",
                                                                "class": "complete-task ",
                                                                "iconClass": "complete-task"
                                                              }
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "handleDellReworkActions",
                                                          "methodType": "taskPanelOpen",
                                                          "eventSource": "click",
                                                          "config": {
                                                            "index": index
                                                          }
                                                        }
                                                      ],
                                                      "failureActions": [
                                                        {
                                                          "type": "handleCommonServices",
                                                          "config": {
                                                            "type": "errorRenderTemplate",
                                                            "contextKey": "errorMsg",
                                                            "updateKey": "errorTitleUUID"
                                                          }
                                                        }
                                                      ]
                                                    }
                                                  }
                                                ],
                                                "failureActions": [
                                                  {
                                                    "type": "handleCommonServices",
                                                    "config": {
                                                      "type": "errorRenderTemplate",
                                                      "contextKey": "errorMsg",
                                                      "updateKey": "errorTitleUUID"
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
                                              "type": "handleCommonServices",
                                              "config": {
                                                "type": "errorRenderTemplate",
                                                "contextKey": "errorMsg",
                                                "updateKey": "errorTitleUUID"
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
                                      "type": "condition",
                                      "config": {
                                        "operation": "isValid",
                                        "lhs": "#RTSformdata" + index + ".newPart" + index,
                                      },
                                      "responseDependents": {
                                        "onSuccess": {
                                          "actions": [
                                            {
                                              "type": "handleDellReworkActions",
                                              "methodType": "handlegetBCNinfoForIssueforRTS",
                                              "config": {
                                                "element": element,
                                                "index": index,
                                                "successActions": [
                                                  {
                                                    "type": "context",
                                                    "config": {
                                                      "requestMethod": "add",
                                                      "key": "IssuePartReferenceforRTS" + index,
                                                      "data": "responseArray"
                                                    }
                                                  },
                                                  {
                                                    "type": "microservice",
                                                    "eventSource": "click",
                                                    "config": {
                                                      "microserviceId": "undoFA",
                                                      "requestMethod": "post",
                                                      "body": {
                                                        "updateFailureAnalysisRequest": {
                                                          "bcn": "#repairUnitInfo.ITEM_BCN",
                                                          "actionCodeChangeList": {
                                                            "actionCodeChange": [{
                                                              "defectCode": {
                                                                "occurrence": "#currentOccurenceData.defectCodeOccurence",
                                                                "value": element.defectCode
                                                              },
                                                              "actionCode": "RPL",
                                                              "operation": "Delete"
                                                            }]
                                                          }
                                                        },
                                                        "userPwd": {
                                                          "username": "#loginUUID.username",
                                                          "password": "#loginUUID.password"
                                                        },
                                                        "operationTypes": "ProcessImmediate",
                                                        "ip": "::1",
                                                        "callSource": "FrontEnd",
                                                        "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
                                                        "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
                                                      }
                                                    },
                                                    "responseDependents": {
                                                      "onSuccess": {
                                                        "actions": [
                                                          {
                                                            "type": "handleDellReworkActions",
                                                            "methodType": "handlePerformFA",
                                                            "config": {
                                                              "element": element,
                                                              "index": index,
                                                              "successActions": [
                                                                {
                                                                  "type": "handleDellReworkActions",
                                                                  "methodType": "handleMoveInventory",
                                                                  "config": {
                                                                    "element": element,
                                                                    "index": index,
                                                                    "successActions": [
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "defectivePartUUID" + index,
                                                                          "properties": {
                                                                            "disabled": true
                                                                          }
                                                                        },
                                                                        "eventSource": "click"
                                                                      },
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "defectivePartNoPPIDUUID" + index,
                                                                          "properties": {
                                                                            "disabled": true
                                                                          }
                                                                        },
                                                                        "eventSource": "click"
                                                                      },
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "noPartToRemoveUUID" + index,
                                                                          "properties": {
                                                                            "disabled": true
                                                                          }
                                                                        },
                                                                        "eventSource": "click"
                                                                      },
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "defectiveNoteUUID" + index,
                                                                          "properties": {
                                                                            "disabled": true
                                                                          }
                                                                        },
                                                                        "eventSource": "click"
                                                                      },
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "newPartUUID" + index,
                                                                          "properties": {
                                                                            "disabled": true
                                                                          }
                                                                        },
                                                                        "eventSource": "click"
                                                                      },
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "newPartNoPPIDUUID" + index,
                                                                          "properties": {
                                                                            "disabled": true
                                                                          }
                                                                        },
                                                                        "eventSource": "click"
                                                                      },
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "RTSUUID" + index,
                                                                          "properties": {
                                                                            "hoverClass": "cursor-default",
                                                                            "iconTextClass": "body text-dark",
                                                                            "disabled": true
                                                                          }
                                                                        },
                                                                        "eventSource": "click"
                                                                      },
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "deleteUUID" + index,
                                                                          "properties": {
                                                                            "disabled": true,
                                                                            "class": "primary-btn dell-debug-delete-button-disable"
                                                                          }
                                                                        },
                                                                        "eventSource": "click"
                                                                      },
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "completeDynamicTaskUUID" + index,
                                                                          "properties": {
                                                                            "disabled": true
                                                                          }
                                                                        },
                                                                        "eventSource": "click"
                                                                      },
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "dellReworkReplaceUUID" + index,
                                                                          "properties": {
                                                                            "expanded": false,
                                                                            "disabled": false,
                                                                            "header": {
                                                                              "svgIcon": "description_icon",
                                                                              "statusIcon": "check_circle",
                                                                              "statusClass": "complete-status",
                                                                              "class": "complete-task ",
                                                                              "iconClass": "complete-task"
                                                                            }
                                                                          }
                                                                        },
                                                                        "eventSource": "click"
                                                                      },
                                                                      {
                                                                        "type": "handleDellReworkActions",
                                                                        "methodType": "taskPanelOpen",
                                                                        "eventSource": "click",
                                                                        "config": {
                                                                          "index": index
                                                                        }
                                                                      }
                                                                    ],
                                                                    "failureActions": [
                                                                      {
                                                                        "type": "handleCommonServices",
                                                                        "config": {
                                                                          "type": "errorRenderTemplate",
                                                                          "contextKey": "errorMsg",
                                                                          "updateKey": "errorTitleUUID"
                                                                        }
                                                                      }
                                                                    ]
                                                                  }
                                                                }
                                                              ],
                                                              "failureActions": [
                                                                {
                                                                  "type": "handleCommonServices",
                                                                  "config": {
                                                                    "type": "errorRenderTemplate",
                                                                    "contextKey": "errorMsg",
                                                                    "updateKey": "errorTitleUUID"
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
                                                            "type": "handleCommonServices",
                                                            "config": {
                                                              "type": "errorRenderTemplate",
                                                              "contextKey": "errorMsg",
                                                              "updateKey": "errorTitleUUID"
                                                            }
                                                          }
                                                        ]
                                                      }
                                                    }
                                                  }
                                                ],
                                                "failureActions": [
                                                  {
                                                    "type": "handleCommonServices",
                                                    "config": {
                                                      "type": "errorRenderTemplate",
                                                      "contextKey": "errorMsg",
                                                      "updateKey": "errorTitleUUID"
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
                                                "key": "errorTitleUUID",
                                                "properties": {
                                                  "titleValue": "Enter New Part PPID/BCN",
                                                  "isShown": true
                                                }
                                              },
                                              "eventSource": "click"
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
                        "onFailure": [
                          {
                            "type": "handleCommonServices",
                            "config": {
                              "type": "errorRenderTemplate",
                              "contextKey": "errorMsg",
                              "updateKey": "errorTitleUUID"
                            }
                          }
                        ]
                      }
                    }
                  ]
                },
                {
                  "ctype": "button",
                  "text": "Delete",
                  "class": "primary-btn dell-debug-delete-button-disable",
                  "icon": "delete",
                  "iconClass": "iconbtn",
                  "checkGroupValidity": false,
                  "textClass": "body2",
                  "uuid": "deleteUUID" + index,
                  //"parentuuid": "#@",
                  "name": "DeleteButton" + index,
                  "visibility": true,
                  "disabled": true,
                  "isIcon": true,
                  "type": "submit",
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "errorTitleUUID",
                        "properties": {
                          "titleValue": "",
                          "isShown": true
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "getFilteredFromContext",
                      "config": {
                        "target": "#occurenceList",
                        "key": "currentOccurenceData",
                        "properties": {
                          "key": "dellReworkReplaceUUID" + index
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "handleDellReworkActions",
                      "methodType": "handleUnIssuePart",
                      "eventSource": "click",
                      "config": {
                        "element": element,
                        "index": index,
                        "successActions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "dellReworkReplaceUUID" + index,
                              "properties": {
                                "disabled": false,
                                "header": {
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
                          {
                            "type": "condition",
                            "eventSource": "click",
                            "config": {
                              "operation": "isEqualTo",
                              "lhs": "#newPartSelection" + index,
                              "rhs": true
                            },
                            "responseDependents": {
                              "onSuccess": {
                                "actions": [
                                  {
                                    "type": "updateComponent",
                                    "config": {
                                      "key": "newPartNoPPIDUUID" + index,
                                      "properties": {
                                        "disabled": false
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
                                      "key": "newPartUUID" + index,
                                      "properties": {
                                        "disabled": false
                                      }
                                    },
                                    "eventSource": "click"
                                  },
                                  {
                                    "type": "updateComponent",
                                    "config": {
                                      "key": "newPartNoPPIDUUID" + index,
                                      "properties": {
                                        "disabled": false
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
                              "key": "doaLinkUUID" + index,
                              "properties": {
                                "hoverClass": "cursor-default",
                                "iconTextClass": "body text-dark",
                                "disabled": true
                              }
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "deleteUUID" + index,
                              "properties": {
                                "disabled": true,
                                "class": "primary-btn dell-debug-delete-button-disable"
                              }
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "completeDynamicTaskUUID" + index,
                              "properties": {
                                "disabled": false
                              }
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "isFromSave&Exit" + index,
                              "data": true
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "DeleteFlag" + index,
                              "data": true
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "handleDellReworkActions",
                            "methodType": "DataFormationforSaveandExit",
                            "config": {
                              "taskUUID":"deleteUUID" + index
                            }
                          }
                        ],
                        "failureActions": [
                          {
                            "type": "handleCommonServices",
                            "config": {
                              "type": "errorRenderTemplate",
                              "contextKey": "errorMsg",
                              "updateKey": "errorTitleUUID"
                            }
                          }
                        ]
                      }
                    }
                  ]
                },
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Complete",
                  "class": "primary-btn",
                  "uuid": "completeDynamicTaskUUID" + index,
                  "visibility": true,
                  "name": "dynamicTaskComplete" + index,
                  "disabled": true,
                  //"isDisableNotReq": true,
                  "type": "submit",
                  "hooks": [],
                  "comment": "task panel submit btton rework screen",
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "errorTitleUUID",
                        "properties": {
                          "titleValue": "",
                          "isShown": true
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "getFilteredFromContext",
                      "config": {
                        "target": "#occurenceList",
                        "key": "currentOccurenceData",
                        "properties": {
                          "key": "dellReworkReplaceUUID" + index
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "dynamicTaskData" + index,
                        "data": "rawFormData"
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "PerformRemovePartsFlag" + index,
                        "data": "Complete"
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "condition",
                      "eventSource": "click",
                      "config": {
                        "operation": "isEqualTo",
                        "lhs": "#noPartSelection" + index,
                        "rhs": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "condition",
                              "eventSource": "click",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": "#newPartSelection" + index,
                                "rhs": true
                              },
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "handleDellReworkActions",
                                      "methodType": "handlePerformIssuePart",
                                      "eventSource": "click",
                                      "config": {
                                        "element": element,
                                        "index": index,
                                        "successActions": [
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "defectivePartUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "defectivePartNoPPIDUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "noPartToRemoveUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "defectiveNoteUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "newPartUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "newPartNoPPIDUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "doaLinkUUID" + index,
                                              "properties": {
                                                "hoverClass": "cursor-default",
                                                "iconTextClass": "body text-dark",
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "RTSUUID" + index,
                                              "properties": {
                                                "hoverClass": "cursor-default",
                                                "iconTextClass": "body text-dark",
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "deleteUUID" + index,
                                              "properties": {
                                                "disabled": false,
                                                "class": "primary-btn dell-debug-delete-button"
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "context",
                                            "config": {
                                              "requestMethod": "add",
                                              "key": "isFromSave&Exit" + index,
                                              "data": true
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "completeDynamicTaskUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "dellReworkReplaceUUID" + index,
                                              "properties": {
                                                "expanded": false,
                                                "disabled": false,
                                                "header": {
                                                  "svgIcon": "description_icon",
                                                  "statusIcon": "check_circle",
                                                  "statusClass": "complete-status",
                                                  "class": "complete-task ",
                                                  "iconClass": "complete-task"
                                                }
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "handleDellReworkActions",
                                            "methodType": "taskPanelOpen",
                                            "eventSource": "click",
                                            "config": {
                                              "index": index
                                            }
                                          },
                                          {
                                            "type": "handleDellReworkActions",
                                            "methodType": "DataFormationforSaveandExit",
                                            "config": {
                                              "taskUUID":"completeDynamicTaskUUID"+index
                                            }
                                          }
                                        ],
                                        "failureActions": [
                                          {
                                            "type": "handleCommonServices",
                                            "config": {
                                              "type": "errorRenderTemplate",
                                              "contextKey": "errorMsg",
                                              "updateKey": "errorTitleUUID"
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
                                      "eventSource": "click",
                                      "config": {
                                        "operation": "isEqualTo",
                                        "lhs": "#userSelectedLocation",
                                        "rhs": "1244"
                                      },
                                      "responseDependents": {
                                        "onSuccess": {
                                          "actions": [
                                            {
                                              "type": "handleDellReworkActions",
                                              "methodType": "handlePerformIssuePart",
                                              "eventSource": "click",
                                              "config": {
                                                "element": element,
                                                "index": index,
                                                "successActions": [
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "defectivePartUUID" + index,
                                                      "properties": {
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "defectivePartNoPPIDUUID" + index,
                                                      "properties": {
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "noPartToRemoveUUID" + index,
                                                      "properties": {
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "defectiveNoteUUID" + index,
                                                      "properties": {
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "newPartUUID" + index,
                                                      "properties": {
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "newPartNoPPIDUUID" + index,
                                                      "properties": {
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "doaLinkUUID" + index,
                                                      "properties": {
                                                        "hoverClass": "cursor-pointer",
                                                        "iconTextClass": "body text-primary",
                                                        "disabled": false
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "RTSUUID" + index,
                                                      "properties": {
                                                        "hoverClass": "cursor-default",
                                                        "iconTextClass": "body text-dark",
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "deleteUUID" + index,
                                                      "properties": {
                                                        "disabled": false,
                                                        "class": "primary-btn dell-debug-delete-button"
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "context",
                                                    "config": {
                                                      "requestMethod": "add",
                                                      "key": "isFromSave&Exit" + index,
                                                      "data": true
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "completeDynamicTaskUUID" + index,
                                                      "properties": {
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "dellReworkReplaceUUID" + index,
                                                      "properties": {
                                                        "expanded": false,
                                                        "disabled": false,
                                                        "header": {
                                                          "svgIcon": "description_icon",
                                                          "statusIcon": "check_circle",
                                                          "statusClass": "complete-status",
                                                          "class": "complete-task ",
                                                          "iconClass": "complete-task"
                                                        }
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "handleDellReworkActions",
                                                    "methodType": "taskPanelOpen",
                                                    "eventSource": "click",
                                                    "config": {
                                                      "index": index
                                                    }
                                                  },
                                                  {
                                                    "type": "handleDellReworkActions",
                                                    "methodType": "DataFormationforSaveandExit",
                                                    "config": {
                                                      "taskUUID": "completeDynamicTaskUUID" + index
                                                    }
                                                  }
                                                ],
                                                "failureActions": [
                                                  {
                                                    "type": "handleCommonServices",
                                                    "config": {
                                                      "type": "errorRenderTemplate",
                                                      "contextKey": "errorMsg",
                                                      "updateKey": "errorTitleUUID"
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
                                              "type": "handleDellReworkActions",
                                              "methodType": "handlegetBCNinfoForIssue",
                                              "eventSource": "click",
                                              "config": {
                                                "element": element,
                                                "index": index,
                                                "successActions": [
                                                  {
                                                    "type": "context",
                                                    "config": {
                                                      "requestMethod": "add",
                                                      "key": "IssuePartReference" + index,
                                                      "data": "responseArray"
                                                    }
                                                  },
                                                  {
                                                    "type": "handleDellReworkActions",
                                                    "methodType": "handlePerformIssuePart",
                                                    "eventSource": "click",
                                                    "config": {
                                                      "element": element,
                                                      "index": index,
                                                      "successActions": [
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "defectivePartUUID" + index,
                                                            "properties": {
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "defectivePartNoPPIDUUID" + index,
                                                            "properties": {
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "noPartToRemoveUUID" + index,
                                                            "properties": {
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "defectiveNoteUUID" + index,
                                                            "properties": {
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "newPartUUID" + index,
                                                            "properties": {
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "newPartNoPPIDUUID" + index,
                                                            "properties": {
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "doaLinkUUID" + index,
                                                            "properties": {
                                                              "hoverClass": "cursor-pointer",
                                                              "iconTextClass": "body text-primary",
                                                              "disabled": false
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "RTSUUID" + index,
                                                            "properties": {
                                                              "hoverClass": "cursor-default",
                                                              "iconTextClass": "body text-dark",
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "deleteUUID" + index,
                                                            "properties": {
                                                              "disabled": false,
                                                              "class": "primary-btn dell-debug-delete-button"
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "context",
                                                          "config": {
                                                            "requestMethod": "add",
                                                            "key": "isFromSave&Exit" + index,
                                                            "data": true
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "completeDynamicTaskUUID" + index,
                                                            "properties": {
                                                              "disabled": true
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "dellReworkReplaceUUID" + index,
                                                            "properties": {
                                                              "expanded": false,
                                                              "disabled": false,
                                                              "header": {
                                                                "svgIcon": "description_icon",
                                                                "statusIcon": "check_circle",
                                                                "statusClass": "complete-status",
                                                                "class": "complete-task ",
                                                                "iconClass": "complete-task"
                                                              }
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        },
                                                        {
                                                          "type": "handleDellReworkActions",
                                                          "methodType": "taskPanelOpen",
                                                          "eventSource": "click",
                                                          "config": {
                                                            "index": index
                                                          }
                                                        },
                                                        {
                                                          "type": "handleDellReworkActions",
                                                          "methodType": "DataFormationforSaveandExit",
                                                          "config": {
                                                            "taskUUID": "completeDynamicTaskUUID" + index
                                                          }
                                                        }
                                                      ],
                                                      "failureActions": [
                                                        {
                                                          "type": "handleCommonServices",
                                                          "config": {
                                                            "type": "errorRenderTemplate",
                                                            "contextKey": "errorMsg",
                                                            "updateKey": "errorTitleUUID"
                                                          }
                                                        }
                                                      ]
                                                    }
                                                  }
                                                ],
                                                "failureActions": [
                                                  {
                                                    "type": "handleCommonServices",
                                                    "config": {
                                                      "type": "errorRenderTemplate",
                                                      "contextKey": "errorMsg",
                                                      "updateKey": "errorTitleUUID"
                                                    }
                                                  }
                                                ]
                                              }
                                            }
                                          ]
                                        }
                                      }
                                    }
                                  ],
                                  "failureActions": []
                                }
                              }
                            }
                          ]
                        },
                        "onFailure": {
                          "actions": [
                            {
                              "type": "condition",
                              "eventSource": "click",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": "#DeleteFlag" + index,
                                "rhs": true
                              },
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "condition",
                                      "eventSource": "click",
                                      "config": {
                                        "operation": "isEqualTo",
                                        "lhs": "#newPartSelection" + index,
                                        "rhs": true
                                      },
                                      "responseDependents": {
                                        "onSuccess": {
                                          "actions": [
                                            {
                                              "type": "handleDellReworkActions",
                                              "methodType": "handlePerformIssuePart",
                                              "eventSource": "click",
                                              "config": {
                                                "element": element,
                                                "index": index,
                                                "successActions": [
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "defectivePartUUID" + index,
                                                      "properties": {
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "defectivePartNoPPIDUUID" + index,
                                                      "properties": {
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "noPartToRemoveUUID" + index,
                                                      "properties": {
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "defectiveNoteUUID" + index,
                                                      "properties": {
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "newPartUUID" + index,
                                                      "properties": {
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "newPartNoPPIDUUID" + index,
                                                      "properties": {
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "doaLinkUUID" + index,
                                                      "properties": {
                                                        "hoverClass": "cursor-default",
                                                        "iconTextClass": "body text-dark",
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "RTSUUID" + index,
                                                      "properties": {
                                                        "hoverClass": "cursor-default",
                                                        "iconTextClass": "body text-dark",
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "deleteUUID" + index,
                                                      "properties": {
                                                        "disabled": false,
                                                        "class": "primary-btn dell-debug-delete-button"
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "completeDynamicTaskUUID" + index,
                                                      "properties": {
                                                        "disabled": true
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "context",
                                                    "config": {
                                                      "requestMethod": "add",
                                                      "key": "isFromSave&Exit" + index,
                                                      "data": true
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "dellReworkReplaceUUID" + index,
                                                      "properties": {
                                                        "expanded": false,
                                                        "disabled": false,
                                                        "header": {
                                                          "svgIcon": "description_icon",
                                                          "statusIcon": "check_circle",
                                                          "statusClass": "complete-status",
                                                          "class": "complete-task ",
                                                          "iconClass": "complete-task"
                                                        }
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "handleDellReworkActions",
                                                    "methodType": "taskPanelOpen",
                                                    "eventSource": "click",
                                                    "config": {
                                                      "index": index
                                                    }
                                                  },
                                                  {
                                                    "type": "handleDellReworkActions",
                                                    "methodType": "DataFormationforSaveandExit",
                                                    "config": {
                                                      "taskUUID":"completeDynamicTaskUUID"+index
                                                    }
                                                  }
                                                ],
                                                "failureActions": [
                                                  {
                                                    "type": "handleCommonServices",
                                                    "config": {
                                                      "type": "errorRenderTemplate",
                                                      "contextKey": "errorMsg",
                                                      "updateKey": "errorTitleUUID"
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
                                              "eventSource": "click",
                                              "config": {
                                                "operation": "isEqualTo",
                                                "lhs": "#userSelectedLocation",
                                                "rhs": "1244"
                                              },
                                              "responseDependents": {
                                                "onSuccess": {
                                                  "actions": [
                                                    {
                                                      "type": "handleDellReworkActions",
                                                      "methodType": "handlePerformIssuePart",
                                                      "eventSource": "click",
                                                      "config": {
                                                        "element": element,
                                                        "index": index,
                                                        "successActions": [
                                                          {
                                                            "type": "updateComponent",
                                                            "config": {
                                                              "key": "defectivePartUUID" + index,
                                                              "properties": {
                                                                "disabled": true
                                                              }
                                                            },
                                                            "eventSource": "click"
                                                          },
                                                          {
                                                            "type": "updateComponent",
                                                            "config": {
                                                              "key": "defectivePartNoPPIDUUID" + index,
                                                              "properties": {
                                                                "disabled": true
                                                              }
                                                            },
                                                            "eventSource": "click"
                                                          },
                                                          {
                                                            "type": "updateComponent",
                                                            "config": {
                                                              "key": "noPartToRemoveUUID" + index,
                                                              "properties": {
                                                                "disabled": true
                                                              }
                                                            },
                                                            "eventSource": "click"
                                                          },
                                                          {
                                                            "type": "updateComponent",
                                                            "config": {
                                                              "key": "defectiveNoteUUID" + index,
                                                              "properties": {
                                                                "disabled": true
                                                              }
                                                            },
                                                            "eventSource": "click"
                                                          },
                                                          {
                                                            "type": "updateComponent",
                                                            "config": {
                                                              "key": "newPartUUID" + index,
                                                              "properties": {
                                                                "disabled": true
                                                              }
                                                            },
                                                            "eventSource": "click"
                                                          },
                                                          {
                                                            "type": "updateComponent",
                                                            "config": {
                                                              "key": "newPartNoPPIDUUID" + index,
                                                              "properties": {
                                                                "disabled": true
                                                              }
                                                            },
                                                            "eventSource": "click"
                                                          },
                                                          {
                                                            "type": "updateComponent",
                                                            "config": {
                                                              "key": "doaLinkUUID" + index,
                                                              "properties": {
                                                                "hoverClass": "cursor-pointer",
                                                                "iconTextClass": "body text-primary",
                                                                "disabled": false
                                                              }
                                                            },
                                                            "eventSource": "click"
                                                          },
                                                          {
                                                            "type": "updateComponent",
                                                            "config": {
                                                              "key": "RTSUUID" + index,
                                                              "properties": {
                                                                "hoverClass": "cursor-default",
                                                                "iconTextClass": "body text-dark",
                                                                "disabled": true
                                                              }
                                                            },
                                                            "eventSource": "click"
                                                          },
                                                          {
                                                            "type": "updateComponent",
                                                            "config": {
                                                              "key": "deleteUUID" + index,
                                                              "properties": {
                                                                "disabled": false,
                                                                "class": "primary-btn dell-debug-delete-button"
                                                              }
                                                            },
                                                            "eventSource": "click"
                                                          },
                                                          {
                                                            "type": "updateComponent",
                                                            "config": {
                                                              "key": "completeDynamicTaskUUID" + index,
                                                              "properties": {
                                                                "disabled": true
                                                              }
                                                            },
                                                            "eventSource": "click"
                                                          },
                                                          {
                                                            "type": "context",
                                                            "config": {
                                                              "requestMethod": "add",
                                                              "key": "isFromSave&Exit" + index,
                                                              "data": true
                                                            },
                                                            "eventSource": "click"
                                                          },
                                                          {
                                                            "type": "updateComponent",
                                                            "config": {
                                                              "key": "dellReworkReplaceUUID" + index,
                                                              "properties": {
                                                                "expanded": false,
                                                                "disabled": false,
                                                                "header": {
                                                                  "svgIcon": "description_icon",
                                                                  "statusIcon": "check_circle",
                                                                  "statusClass": "complete-status",
                                                                  "class": "complete-task ",
                                                                  "iconClass": "complete-task"
                                                                }
                                                              }
                                                            },
                                                            "eventSource": "click"
                                                          },
                                                          {
                                                            "type": "handleDellReworkActions",
                                                            "methodType": "taskPanelOpen",
                                                            "eventSource": "click",
                                                            "config": {
                                                              "index": index
                                                            }
                                                          },
                                                          {
                                                            "type": "handleDellReworkActions",
                                                            "methodType": "DataFormationforSaveandExit",
                                                            "config": {
                                                              "taskUUID": "completeDynamicTaskUUID" + index
                                                            }
                                                          }
                                                        ],
                                                        "failureActions": [
                                                          {
                                                            "type": "handleCommonServices",
                                                            "config": {
                                                              "type": "errorRenderTemplate",
                                                              "contextKey": "errorMsg",
                                                              "updateKey": "errorTitleUUID"
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
                                                      "type": "handleDellReworkActions",
                                                      "methodType": "handlegetBCNinfoForIssue",
                                                      "eventSource": "click",
                                                      "config": {
                                                        "element": element,
                                                        "index": index,
                                                        "successActions": [
                                                          {
                                                            "type": "context",
                                                            "config": {
                                                              "requestMethod": "add",
                                                              "key": "IssuePartReference" + index,
                                                              "data": "responseArray"
                                                            }
                                                          },
                                                          {
                                                            "type": "handleDellReworkActions",
                                                            "methodType": "handlePerformIssuePart",
                                                            "eventSource": "click",
                                                            "config": {
                                                              "element": element,
                                                              "index": index,
                                                              "successActions": [
                                                                {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                    "key": "defectivePartUUID" + index,
                                                                    "properties": {
                                                                      "disabled": true
                                                                    }
                                                                  },
                                                                  "eventSource": "click"
                                                                },
                                                                {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                    "key": "defectivePartNoPPIDUUID" + index,
                                                                    "properties": {
                                                                      "disabled": true
                                                                    }
                                                                  },
                                                                  "eventSource": "click"
                                                                },
                                                                {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                    "key": "noPartToRemoveUUID" + index,
                                                                    "properties": {
                                                                      "disabled": true
                                                                    }
                                                                  },
                                                                  "eventSource": "click"
                                                                },
                                                                {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                    "key": "defectiveNoteUUID" + index,
                                                                    "properties": {
                                                                      "disabled": true
                                                                    }
                                                                  },
                                                                  "eventSource": "click"
                                                                },
                                                                {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                    "key": "newPartUUID" + index,
                                                                    "properties": {
                                                                      "disabled": true
                                                                    }
                                                                  },
                                                                  "eventSource": "click"
                                                                },
                                                                {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                    "key": "newPartNoPPIDUUID" + index,
                                                                    "properties": {
                                                                      "disabled": true
                                                                    }
                                                                  },
                                                                  "eventSource": "click"
                                                                },
                                                                {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                    "key": "doaLinkUUID" + index,
                                                                    "properties": {
                                                                      "hoverClass": "cursor-pointer",
                                                                      "iconTextClass": "body text-primary",
                                                                      "disabled": false
                                                                    }
                                                                  },
                                                                  "eventSource": "click"
                                                                },
                                                                {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                    "key": "RTSUUID" + index,
                                                                    "properties": {
                                                                      "hoverClass": "cursor-default",
                                                                      "iconTextClass": "body text-dark",
                                                                      "disabled": true
                                                                    }
                                                                  },
                                                                  "eventSource": "click"
                                                                },
                                                                {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                    "key": "deleteUUID" + index,
                                                                    "properties": {
                                                                      "disabled": false,
                                                                      "class": "primary-btn dell-debug-delete-button"
                                                                    }
                                                                  },
                                                                  "eventSource": "click"
                                                                },
                                                                {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                    "key": "completeDynamicTaskUUID" + index,
                                                                    "properties": {
                                                                      "disabled": true
                                                                    }
                                                                  },
                                                                  "eventSource": "click"
                                                                },
                                                                {
                                                                  "type": "context",
                                                                  "config": {
                                                                    "requestMethod": "add",
                                                                    "key": "isFromSave&Exit" + index,
                                                                    "data": true
                                                                  },
                                                                  "eventSource": "click"
                                                                },
                                                                {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                    "key": "dellReworkReplaceUUID" + index,
                                                                    "properties": {
                                                                      "expanded": false,
                                                                      "disabled": false,
                                                                      "header": {
                                                                        "svgIcon": "description_icon",
                                                                        "statusIcon": "check_circle",
                                                                        "statusClass": "complete-status",
                                                                        "class": "complete-task ",
                                                                        "iconClass": "complete-task"
                                                                      }
                                                                    }
                                                                  },
                                                                  "eventSource": "click"
                                                                },
                                                                {
                                                                  "type": "handleDellReworkActions",
                                                                  "methodType": "taskPanelOpen",
                                                                  "eventSource": "click",
                                                                  "config": {
                                                                    "index": index
                                                                  }
                                                                },
                                                                {
                                                                  "type": "handleDellReworkActions",
                                                                  "methodType": "DataFormationforSaveandExit",
                                                                  "config": {
                                                                    "taskUUID": "completeDynamicTaskUUID" + index
                                                                  }
                                                                }
                                                              ],
                                                              "failureActions": [
                                                                {
                                                                  "type": "handleCommonServices",
                                                                  "config": {
                                                                    "type": "errorRenderTemplate",
                                                                    "contextKey": "errorMsg",
                                                                    "updateKey": "errorTitleUUID"
                                                                  }
                                                                }
                                                              ]
                                                            }
                                                          }
                                                        ],
                                                        "failureActions": [
                                                          {
                                                            "type": "handleCommonServices",
                                                            "config": {
                                                              "type": "errorRenderTemplate",
                                                              "contextKey": "errorMsg",
                                                              "updateKey": "errorTitleUUID"
                                                            }
                                                          }
                                                        ]
                                                      }
                                                    }
                                                  ]
                                                }
                                              }
                                            }
                                          ],
                                          "failureActions": []
                                        }
                                      }
                                    }
                                  ]
                                },
                                "onFailure": {
                                  "actions": [
                                    {
                                      "type": "condition",
                                      "eventSource": "click",
                                      "config": {
                                        "operation": "isEqualTo",
                                        "lhs": "#defectivePartSelection" + index,
                                        "rhs": true
                                      },
                                      "responseDependents": {
                                        "onSuccess": {
                                          "actions": [
                                            {
                                              "type": "handleDellReworkActions",
                                              "methodType": "NextItemBCN",
                                              "eventSource": "click",
                                              "config": {
                                                "element": element,
                                                "index": index,
                                                "successActions": [
                                                  {
                                                    "type": "context",
                                                    "config": {
                                                      "requestMethod": "add",
                                                      "key": "NextItemBCN" + index,
                                                      "data": "responseData"
                                                    }
                                                  },
                                                  {
                                                    "type": "condition",
                                                    "eventSource": "click",
                                                    "config": {
                                                      "operation": "isEqualTo",
                                                      "lhs": "#newPartSelection" + index,
                                                      "rhs": true
                                                    },
                                                    "responseDependents": {
                                                      "onSuccess": {
                                                        "actions": [
                                                          {
                                                            "type": "handleDellReworkActions",
                                                            "methodType": "handleCompleteActions",
                                                            "eventSource": "click",
                                                            "config": {
                                                              "element": element,
                                                              "index": index,
                                                            }
                                                          }
                                                        ]
                                                      },
                                                      "onFailure": {
                                                        "actions": [
                                                          {
                                                            "type": "condition",
                                                            "eventSource": "click",
                                                            "config": {
                                                              "operation": "isEqualTo",
                                                              "lhs": "#userSelectedLocation",
                                                              "rhs": "1244"
                                                            },
                                                            "responseDependents": {
                                                              "onSuccess": {
                                                                "actions": [
                                                                  {
                                                                    "type": "handleDellReworkActions",
                                                                    "methodType": "handleCompleteActions",
                                                                    "eventSource": "click",
                                                                    "config": {
                                                                      "element": element,
                                                                      "index": index,
                                                                    }
                                                                  }
                                                                ]
                                                              },
                                                              "onFailure": {
                                                                "actions": [
                                                                  {
                                                                    "type": "handleDellReworkActions",
                                                                    "methodType": "handlegetBCNinfoForIssue",
                                                                    "eventSource": "click",
                                                                    "config": {
                                                                      "element": element,
                                                                      "index": index,
                                                                      "successActions": [
                                                                        {
                                                                          "type": "context",
                                                                          "config": {
                                                                            "requestMethod": "add",
                                                                            "key": "IssuePartReference" + index,
                                                                            "data": "responseArray"
                                                                          }
                                                                        },
                                                                        {
                                                                          "type": "handleDellReworkActions",
                                                                          "methodType": "handleCompleteActions",
                                                                          "eventSource": "click",
                                                                          "config": {
                                                                            "element": element,
                                                                            "index": index,
                                                                          }
                                                                        }
                                                                      ],
                                                                      "failureActions": [
                                                                        {
                                                                          "type": "handleCommonServices",
                                                                          "config": {
                                                                            "type": "errorRenderTemplate",
                                                                            "contextKey": "errorMsg",
                                                                            "updateKey": "errorTitleUUID"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          }
                                                        ],
                                                        "failureActions": []
                                                      }
                                                    }
                                                  }
                                                ],
                                                "failureActions": [
                                                  {
                                                    "type": "handleCommonServices",
                                                    "config": {
                                                      "type": "errorRenderTemplate",
                                                      "contextKey": "errorMsg",
                                                      "updateKey": "errorTitleUUID"
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
                                              "eventSource": "click",
                                              "config": {
                                                "operation": "isEqualTo",
                                                "lhs": "#newPartSelection" + index,
                                                "rhs": true
                                              },
                                              "responseDependents": {
                                                "onSuccess": {
                                                  "actions": [
                                                    {
                                                      "type": "handleDellReworkActions",
                                                      "methodType": "NextItemBCN",
                                                      "eventSource": "click",
                                                      "config": {
                                                        "element": element,
                                                        "index": index,
                                                        "successActions": [
                                                          {
                                                            "type": "context",
                                                            "config": {
                                                              "requestMethod": "add",
                                                              "key": "NextItemBCN" + index,
                                                              "data": "responseData"
                                                            }
                                                          },
                                                          {
                                                            "type": "handleDellReworkActions",
                                                            "methodType": "handleCompleteActions",
                                                            "eventSource": "click",
                                                            "config": {
                                                              "element": element,
                                                              "index": index,
                                                            }
                                                          }
                                                        ],
                                                        "failureActions": [
                                                          {
                                                            "type": "handleCommonServices",
                                                            "config": {
                                                              "type": "errorRenderTemplate",
                                                              "contextKey": "errorMsg",
                                                              "updateKey": "errorTitleUUID"
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
                                                      "type": "handleDellReworkActions",
                                                      "methodType": "NextItemBCN",
                                                      "eventSource": "click",
                                                      "config": {
                                                        "element": element,
                                                        "index": index,
                                                        "successActions": [
                                                          {
                                                            "type": "context",
                                                            "config": {
                                                              "requestMethod": "add",
                                                              "key": "NextItemBCN" + index,
                                                              "data": "responseData"
                                                            }
                                                          },
                                                          {
                                                            "type": "condition",
                                                            "eventSource": "click",
                                                            "config": {
                                                              "operation": "isEqualTo",
                                                              "lhs": "#userSelectedLocation",
                                                              "rhs": "1244"
                                                            },
                                                            "responseDependents": {
                                                              "onSuccess": {
                                                                "actions": [
                                                                  {
                                                                    "type": "handleDellReworkActions",
                                                                    "methodType": "handleCompleteActions",
                                                                    "eventSource": "click",
                                                                    "config": {
                                                                      "element": element,
                                                                      "index": index,
                                                                    }
                                                                  }
                                                                ]
                                                              },
                                                              "onFailure": {
                                                                "actions": [
                                                                  {
                                                                    "type": "handleDellReworkActions",
                                                                    "methodType": "handlegetBCNinfoForIssue",
                                                                    "eventSource": "click",
                                                                    "config": {
                                                                      "element": element,
                                                                      "index": index,
                                                                      "successActions": [
                                                                        {
                                                                          "type": "context",
                                                                          "config": {
                                                                            "requestMethod": "add",
                                                                            "key": "IssuePartReference" + index,
                                                                            "data": "responseArray"
                                                                          }
                                                                        },
                                                                        {
                                                                          "type": "handleDellReworkActions",
                                                                          "methodType": "handleCompleteActions",
                                                                          "eventSource": "click",
                                                                          "config": {
                                                                            "element": element,
                                                                            "index": index,
                                                                          }
                                                                        }
                                                                      ],
                                                                      "failureActions": [
                                                                        {
                                                                          "type": "handleCommonServices",
                                                                          "config": {
                                                                            "type": "errorRenderTemplate",
                                                                            "contextKey": "errorMsg",
                                                                            "updateKey": "errorTitleUUID"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          }
                                                        ],
                                                        "failureActions": [
                                                          {
                                                            "type": "handleCommonServices",
                                                            "config": {
                                                              "type": "errorRenderTemplate",
                                                              "contextKey": "errorMsg",
                                                              "updateKey": "errorTitleUUID"
                                                            }
                                                          }
                                                        ]
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
                  ]
                }
              ]
            },
            "eventSource": "click"
          }
        }
      );





      arr.forEach(item => {
        actionService.handleAction(item, instance);
      });

    });



  }



  handlePerformIssuePart(action, instance, actionService) {
    let repairUnitInfo = this.contextService.getDataByKey("repairUnitInfo");
    let clientName = repairUnitInfo.GEONAME;
    let element = action.config.element;
    let index = action.config.index;
    let performRemoveAPIflag = this.contextService.getDataByKey("PerformRemovePartsFlag" + index);
    this.IssuePartParams(element, index, actionService, instance);
    let IssuePartSN = this.contextService.getDataByKey("IssuePartSN" + index);
    //let IssuePart = this.contextService.getDataByKey("IssuePart" + index);
    let IssuePartBCN = this.contextService.getDataByKey("IssuePartBCN" + index);
    let newPartCheckbox = this.contextService.getDataByKey("newPartSelection" + index);
    let newPartPPIDText = this.contextService.getDataByKey("NewPartPPIDText" + index);

    if (newPartCheckbox == true) {
      let body = {
        "issuePartsRequest": {
          "bcn": "#repairUnitInfo.ITEM_BCN",
          "actionCodeChange": {
            "actionCode": performRemoveAPIflag == "Complete" ? element.actionCode : performRemoveAPIflag == "DOA" ? "DFS" : "RTS",
            "operation": "Add",
            "defectCode": {
              "value": element.defectCode,
              "occurrence": "#currentOccurenceData.defectCodeOccurence"
            }
          },
          "itemList": {
            "item": [
              {
                "part": element.partNo,
                "owner": "#getSLRXConfigForIssue.owner",
                "condition": "#getSLRXConfigForIssue.condition",
                "quantity": "1",
                "bin": {
                  "location": "#getSLRXConfigForIssue.destinationLocation",
                  "warehouse": "#getSLRXConfigForIssue.destinationWarehouse",
                  "zone": "#getSLRXConfigForIssue.destinationZone",
                  "binName": "#getSLRXConfigForIssue.destinationBin",
                }

              }
            ]
          }
        },
        "userPwd": {
          "username": "#loginUUID.username",
          "password": "#loginUUID.password"
        },
        "ip": "::1",
        "callSource": "FrontEnd",
        "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
        "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
      }

      let performIP = {
        "type": "microservice",
        "eventSource": "click",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "performIssuePart",
          "requestMethod": "post",
          "body": body
        },
        "responseDependents": {
          "onSuccess": {
            "actions": action.config.successActions,
          },
          "onFailure": {
            "actions": action.config.failureActions
          }
        }
      }
      actionService.handleAction(performIP, instance);
    }
    else {
      if (clientName == "Louisville") {

        let body = {
          "issuePartsRequest": {
            "bcn": "#repairUnitInfo.ITEM_BCN",
            "actionCodeChange": {
              "actionCode": performRemoveAPIflag == "Complete" ? element.actionCode : performRemoveAPIflag == "DOA" ? "DFS" : "RTS",
              "operation": "Add",
              "defectCode": {
                "value": element.defectCode,
                "occurrence": "#currentOccurenceData.defectCodeOccurence"
              }
            },
            "itemList": {
              "item": [
                {
                  //"part": element.serializedBulkInd != "3" ? IssuePart : element.partNo,
                  "part": element.partNo,
                  "owner": "#getSLRXConfigForIssue.owner",
                  "condition": "#getSLRXConfigForIssue.condition",
                  //"serialNumber": element.serializedBulkInd !== null ? IssuePartSN : "NOPPID_CLIENT_REF1",
                  "quantity": "1",
                  "bin": {
                    "location": "#getSLRXConfigForIssue.destinationLocation",
                    "warehouse": "#getSLRXConfigForIssue.destinationWarehouse",
                    "zone": "#getSLRXConfigForIssue.destinationZone",
                    "binName": "#getSLRXConfigForIssue.destinationBin",
                  },
                "componentLocationDescription": newPartPPIDText

                }
              ]
            }
          },
          "userPwd": {
            "username": "#loginUUID.username",
            "password": "#loginUUID.password"
          },
          "ip": "::1",
          "callSource": "FrontEnd",
          "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
          "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
        }
        let performIP = {
          "type": "microservice",
          "eventSource": "click",
          "hookType": "afterInit",
          "config": {
            "microserviceId": "performIssuePart",
            "requestMethod": "post",
            "body": body
          },
          "responseDependents": {
            "onSuccess": {
              "actions": action.config.successActions,
            },
            "onFailure": {
              "actions": action.config.failureActions
            }
          }
        }
        actionService.handleAction(performIP, instance);


        //return body;
      }
      else {
        let body = {
          "issuePartsRequest": {
            "bcn": "#repairUnitInfo.ITEM_BCN",
            "actionCodeChange": {
              "actionCode": performRemoveAPIflag == "Complete" ? element.actionCode : performRemoveAPIflag == "DOA" ? "DFS" : "RTS",
              "operation": "Add",
              "defectCode": {
                "value": element.defectCode,
                "occurrence": "#currentOccurenceData.defectCodeOccurence"
              }
            },
            "bcnPartList": {
              "bcnPart": [
                {
                  //"part": element.serializedBulkInd != "3" ? IssuePart : element.partNo,
                  "part": element.partNo,
                  "bcn": IssuePartBCN,
                  "serialNumber": IssuePartSN
                }
              ]
            }
          },
          "userPwd": {
            "username": "#loginUUID.username",
            "password": "#loginUUID.password"
          },
          "ip": "::1",
          "callSource": "FrontEnd",
          "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
          "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
        }
        let performIP = {
          "type": "microservice",
          "eventSource": "click",
          "hookType": "afterInit",
          "config": {
            "microserviceId": "performIssuePart",
            "requestMethod": "post",
            "body": body
          },
          "responseDependents": {
            "onSuccess": {
              "actions": action.config.successActions,
            },
            "onFailure": {
              "actions": action.config.failureActions
            }
          }
        }
        actionService.handleAction(performIP, instance);
        //return body;
      }
    }


  }

  handlePerformRemoveParts(action, instance, actionService) {
    let element = action.config.element;
    let index = action.config.index;
    let zone = action.config.zone;
    let bin = action.config.bin;
    let condition = action.config.conditionType;
    if(condition && condition.startsWith("#")){
      condition = this.contextService.getDataByString(condition);
    }
    let performRemoveAPIflag = this.contextService.getDataByKey("PerformRemovePartsFlag" + index);
    let formData = this.contextService.getDataByKey("dynamicTaskData" + index);
    //this.conditionalRemovePartParam(element, index, performRemoveAPIflag);
    let RemoveSN = this.contextService.getDataByKey("RemoveSN" + index);
    let componentDisc = this.contextService.getDataByKey("RemoveCD" + index);
    if(componentDisc == ""){
      componentDisc = null
    }
    //let RemovePart = this.contextService.getDataByKey("part" + index);
    let RemoveBCN = this.contextService.getDataByKey("RemoveBCN" + index);
    let newPartName = "newPart" + index;
    if(performRemoveAPIflag == "DOA"){
      if(formData[newPartName] && formData[newPartName].substring(0, 3) == "BCN"){
            let IssuePartReference = this.contextService.getDataByKey("IssuePartReference" + index);
            let part = element.partNo
            RemoveSN = IssuePartReference.serialNo
            RemoveBCN = formData[newPartName]
          }
          // else if(formData.NewPartCheckbox == true){
          //   RemoveSN = this.contextService.getDataByKey("IssuePartSN" + index);
          //   RemoveBCN = this.contextService.getDataByKey("NextItemBCN" + index);
          // }
          else {
            let IssuePartReference = this.contextService.getDataByKey("IssuePartReference" + index);
            let part = element.partNo
            RemoveBCN = IssuePartReference.itemBcn
            RemoveSN = formData[newPartName]
          }
        }

    let body = {
      "removePartsRequest": {
        "bcn": "#repairUnitInfo.ITEM_BCN",
        "actionCodeChange": {
          "actionCode": performRemoveAPIflag == "Complete" ? element.actionCode : performRemoveAPIflag == "DOA" ? "DFS" : "RTS",
          "operation": "Add",
          "defectCode": {
            "value": element.defectCode,
            "occurrence": "#currentOccurenceData.defectCodeOccurence"
          }
        },
        "bcnItemList": {
          "item": [
            {
              "part": element.partNo,
              "owner": "#getSLRXConfigForRemove.owner",
              "condition": condition,
              "serialNumber": RemoveSN,
              "quantity": "1",
              "bin": {
                "location": "#getSLRXConfigForRemove.destinationLocation",
                "warehouse": "#getSLRXConfigForRemove.destinationWarehouse",
                "zone": zone,
                "binName": bin,
              },
              "componentLocationDescription" : performRemoveAPIflag == "DOA" ? "#DOA" + index + ".Add Note DOA" : componentDisc
            }
          ]
        }
      },
      "userPwd": {
        "username": "#loginUUID.username",
        "password": "#loginUUID.password"
      },
      "ip": "::1",
      "callSource": "FrontEnd",
      "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
      "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
    }

    let performRP = {
      "type": "microservice",
      "eventSource": "click",
      "hookType": "afterInit",
      "config": {
        "microserviceId": "performRemovePartsRework",
        "requestMethod": "post",
        "body": body
      },
      "responseDependents": {
        "onSuccess": {
          "actions": action.config.successActions,
        },
        "onFailure": {
          "actions": action.config.failureActions
        }
      }
    }
    actionService.handleAction(performRP, instance);
  }

  handlePerformFA(action, instance, actionService) {
    let element = action.config.element;
    let index = action.config.index;
    let performRemoveAPIflag = this.contextService.getDataByKey("PerformRemovePartsFlag" + index);
    let microservice = {
      "type": "microservice",
      "eventSource": "click",
      "config": {
        "microserviceId": "performFARework",
        "requestMethod": "post",
        "body": {
          "updateFailureAnalysisRequest": {
            "bcn": "#repairUnitInfo.ITEM_BCN",
            "actionCodeChangeList": {
              "actionCodeChange": [{
                "defectCode": {
                  "occurrence": "#currentOccurenceData.defectCodeOccurence",
                  "value": element.defectCode
                },
                "notes": "#DOA" + index + ".Add Note DOA",
                "actionCode": performRemoveAPIflag == "RTS" ? "RTS" : performRemoveAPIflag == "DOA" ? "DFS" : element.actionCode,
                "operation": "Add"
              }]
            }
          },
          "userPwd": {
            "username": "#loginUUID.username",
            "password": "#loginUUID.password"
          },
          "operationTypes": "ProcessImmediate",
          "ip": "::1",
          "callSource": "FrontEnd",
          "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
          "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
        }
      },
      "responseDependents": {
        "onSuccess": {
          "actions": action.config.successActions
        },
        "onFailure": {
          "actions": action.config.failureActions
        }
      }



    }
    actionService.handleAction(microservice, instance);

  }

  handleUnIssuePart(action, instance, actionService) {
    let repairUnitInfo = this.contextService.getDataByKey("repairUnitInfo");
    let clientName = repairUnitInfo.GEONAME;
    let element = action.config.element;
    let index = action.config.index;
    //this.conditionalIssuePartParam(element, index, actionService, instance);
    let IssuePartSN = this.contextService.getDataByKey("IssuePartSN" + index);
    //let IssuePart = this.contextService.getDataByKey("IssuePart" + index);
    let IssuePartBCN = this.contextService.getDataByKey("IssuePartBCN" + index);
    let newPartCheckbox = this.contextService.getDataByKey("newPartSelection" + index);

    if (newPartCheckbox == true) {

      let body = {
        "unissuePartsRequest": {
          "bcn": "#repairUnitInfo.ITEM_BCN",
          "actionCodeChange": {
            "actionCode": element.actionCode,
            "operation": "Add",
            "defectCode": {
              "value": element.defectCode,
              "occurrence": "#currentOccurenceData.defectCodeOccurence"
            }
          },
          "nonBcnItemList": {
            "item": [
              {
                "part": element.partNo,
                "owner": "#getSLRXConfigForIssue.owner",
                "condition": "#getSLRXConfigForIssue.condition",
                "quantity": "1",
                "bin": {
                  "location": "#getSLRXConfigForIssue.destinationLocation",
                  "warehouse": "#getSLRXConfigForIssue.destinationWarehouse",
                  "zone": "#getSLRXConfigForIssue.destinationZone",
                  "binName": "#getSLRXConfigForIssue.destinationBin",
                }

              }
            ]
          }
        },
        "userPwd": {
          "username": "#loginUUID.username",
          "password": "#loginUUID.password"
        },
        "ip": "::1",
        "callSource": "FrontEnd",
        "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
        "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
      }

      let performIP = {
        "type": "microservice",
        "eventSource": "click",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "performUnIssuePartLou",
          "requestMethod": "post",
          "body": body
        },
        "responseDependents": {
          "onSuccess": {
            "actions": action.config.successActions,
          },
          "onFailure": {
            "actions": action.config.failureActions
          }
        }
      }
      actionService.handleAction(performIP, instance);

    }
    else {
      if (clientName == "Louisville") {

        let body = {
          "unissuePartsRequest": {
            "bcn": "#repairUnitInfo.ITEM_BCN",
            "actionCodeChange": {
              "actionCode": element.actionCode,
              "operation": "Add",
              "defectCode": {
                "value": element.defectCode,
                "occurrence": "#currentOccurenceData.defectCodeOccurence"
              }
            },
            "nonBcnItemList": {
              "item": [
                {
                  //"part": IssuePart,element.partNo
                  "part": element.partNo,
                  "owner": "#getSLRXConfigForIssue.owner",
                  "condition": "#getSLRXConfigForIssue.condition",
                  "quantity": "1",
                  "bin": {
                    "location": "#getSLRXConfigForIssue.destinationLocation",
                    "warehouse": "#getSLRXConfigForIssue.destinationWarehouse",
                    "zone": "#getSLRXConfigForIssue.destinationZone",
                    "binName": "#getSLRXConfigForIssue.destinationBin"
                  }
                }
              ]
            }
          },
          "userPwd": {
            "username": "#loginUUID.username",
            "password": "#loginUUID.password"
          }
        }

        let performUnIP = {
          "type": "microservice",
          "eventSource": "click",
          "hookType": "afterInit",
          "config": {
            "microserviceId": "performUnIssuePartLou",
            "requestMethod": "post",
            "body": body
          },
          "responseDependents": {
            "onSuccess": {
              "actions": action.config.successActions,
            },
            "onFailure": {
              "actions": action.config.failureActions
            }
          }
        }
        actionService.handleAction(performUnIP, instance);


        //return body;
      }
      else {
        let body = {
          "issuePartsRequest": {
            "bcn": "#repairUnitInfo.ITEM_BCN",
            "actionCodeChange": {
              "actionCode": element.actionCode,
              "operation": "Delete",
              "defectCode": {
                "value": element.defectCode,
                "occurrence": "#currentOccurenceData.defectCodeOccurence"
              }
            },
            "bcnPartList": {
              "bcnPart": [
                {
                  //"part": IssuePart,element.partNo
                  "part": element.partNo,
                  "bcn": IssuePartBCN,
                  "serialNumber": IssuePartSN
                }
              ]
            }
          },
          "userPwd": {
            "username": "#loginUUID.username",
            "password": "#loginUUID.password"
          },
          "ip": "::1",
          "callSource": "FrontEnd",
          "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
          "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
        }

        let performUnIP = {
          "type": "microservice",
          "eventSource": "click",
          "hookType": "afterInit",
          "config": {
            "microserviceId": "performUnIssuePartAN",
            "requestMethod": "post",
            "body": body
          },
          "responseDependents": {
            "onSuccess": {
              "actions": action.config.successActions,
            },
            "onFailure": {
              "actions": action.config.failureActions
            }
          }
        }
        actionService.handleAction(performUnIP, instance);
        //return body;
      }
    }


  }

  handleAIORemovePart(action, instance, actionService) {
    let element = action.config.element;
    let index = action.config.index;
    let condition = action.config.conditionType;
    if(condition && condition.startsWith("#")){
      condition = this.contextService.getDataByString(condition);
    }
    let performRemoveAPIflag = this.contextService.getDataByKey("PerformRemovePartsFlag" + index);
    let formData = this.contextService.getDataByKey("dynamicTaskData" + index);
    this.conditionalRemovePartParam(element, index, performRemoveAPIflag);
    let RemoveSN;
    let RemoveBCN;
    //this.handlegetBCNinfo(action, instance, actionService)
    RemoveSN = this.contextService.getDataByKey("RemoveSN" + index)
    let componentDisc = this.contextService.getDataByKey("RemoveCD" + index);
    //let RemovePart = this.contextService.getDataByKey("RemovePart" + index)
    RemoveBCN = this.contextService.getDataByKey("RemoveBCN" + index);
    let newPartName = "newPart" + index;
    if(performRemoveAPIflag == "DOA"){
      if(formData[newPartName] && formData[newPartName].substring(0, 3) == "BCN"){
            let IssuePartReference = this.contextService.getDataByKey("IssuePartReference" + index);
            let part = element.partNo
            RemoveSN = IssuePartReference.serialNo
            RemoveBCN = formData[newPartName]
          }
          // else if(formData.NewPartCheckbox == true){
          //   RemoveSN = this.contextService.getDataByKey("IssuePartSN" + index);
          //   RemoveBCN = this.contextService.getDataByKey("NextItemBCN" + index);
          // }
          else {
            let IssuePartReference = this.contextService.getDataByKey("IssuePartReference" + index);
            let part = element.partNo
            RemoveBCN = IssuePartReference.itemBcn
            RemoveSN = formData[newPartName]
          }
        }
     
    let microservice = {
      "type": "microservice",
      "eventSource": "click",
      "config": {
        "microserviceId": "dellAIORemove",
        "requestMethod": "post",
        "body": {
          "actionType": "PwcPerformRemoveParts",
          "subActionType": "PwcRemoveParts",
          "pwcXmls": {
            "bcnDetail": {
              "bcn": "#repairUnitInfo.ITEM_BCN",
              "geography": "#repairUnitInfo.GEONAME",
              "contract": "#repairUnitInfo.CONTRACTNAME",
              "workCenter": "#repairUnitInfo.WORKCENTER",
              "client": "#repairUnitInfo.CLIENTNAME"
            },
            "removeBcnPartTab": {
              "bcn": RemoveBCN,
              //"partNumber": RemovePart,element.partNo
              "partNumber": element.partNo,
              "serialNumber": RemoveSN,
              "condition": condition
            }
          },
          "removeUnitType": "BCN",
          "usrPwd": {
            "userName": "#loginUUID.username",
            "password": "#loginUUID.password"
          },
          "userName": "#loginUUID.username",
          "apiUsageLocationName": "#repairUnitInfo.GEONAME",
          "apiUsageClientName": "#repairUnitInfo.CLIENTNAME"

        },
        "toBeStringified": true
      },
      "responseDependents": {
        "onSuccess": {
          "actions": action.config.successActions
        },
        "onFailure": {
          "actions": action.config.failureActions
        }
      }



    }
    actionService.handleAction(microservice, instance);

  }

  handleDellAIOGlobalTrigger(action, instance, actionService) {
    let element = action.config.element;
    let index = action.config.index;
    let zone = action.config.zone;
    let bin = action.config.bin;
    let performRemoveAPIflag = this.contextService.getDataByKey("PerformRemovePartsFlag" + index);
    let formData = this.contextService.getDataByKey("dynamicTaskData" + index);
    //this.conditionalRemovePartParam(element, index, performRemoveAPIflag);
    //this.handlegetBCNinfo(action, instance, actionService)
    let RemoveSN = this.contextService.getDataByKey("RemoveSN" + index)
    let componentDisc = this.contextService.getDataByKey("RemoveCD" + index);
    //let RemovePart = this.contextService.getDataByKey("RemovePart" + index)
    let RemoveBCN = this.contextService.getDataByKey("RemoveBCN" + index);
    //let RemoveBCN = RemoveBcnData.itemBcn;
    let newPartName = "newPart" + index;
    if(performRemoveAPIflag == "DOA"){
      if(formData[newPartName] && formData[newPartName].substring(0, 3) == "BCN"){
            let IssuePartReference = this.contextService.getDataByKey("IssuePartReference" + index);
            let part = element.partNo
            RemoveSN = IssuePartReference.serialNo
            RemoveBCN = formData[newPartName]
          }
          // else if(formData.NewPartCheckbox == true){
          //   RemoveSN = this.contextService.getDataByKey("IssuePartSN" + index);
          //   RemoveBCN = this.contextService.getDataByKey("NextItemBCN" + index);
          // }
          else {
            let IssuePartReference = this.contextService.getDataByKey("IssuePartReference" + index);
            let part = element.partNo
            RemoveBCN = IssuePartReference.itemBcn
            RemoveSN = formData[newPartName]
          }
        }

    let microservice = {
      "type": "microservice",
      "eventSource": "click",
      "config": {
        "microserviceId": "dellGlobalTrigger",
        "requestMethod": "post",
        "isLocal": false,
        "LocalService": "assets/dellGlobalTriggerMock.json",
        "body": {
          "serialNoRemoved": RemoveSN,
          "removeCompBCN": RemoveBCN,
          //"removePN": RemovePart,element.partNo
          "removePN": element.partNo,
          "stkLocation": zone,
          "bin": bin,
          "unitBCN": "#repairUnitInfo.ITEM_BCN",
          "userName": "#loginUUID.username"
        },
        "toBeStringified": true
      },
      "responseDependents": {
        "onSuccess": {
          "actions": action.config.successActions
        },
        "onFailure": {
          "actions": action.config.failureActions
        }
      }



    }
    actionService.handleAction(microservice, instance);

  }

  handleMoveInventory(action, instance, actionService) {
    let repairUnitInfo = this.contextService.getDataByKey("repairUnitInfo");
    let clientName = repairUnitInfo.GEONAME;
    let element = action.config.element;
    let index = action.config.index;
    //let newPartPPID = this.contextService.getDataByKey("NewPartPPIDText" + index)
    let newPartCheckbox = this.contextService.getDataByKey("newPartSelection" + index)
    let IssuePartReferenceforRTS = this.contextService.getDataByKey("IssuePartReferenceforRTS" + index)
    let RTSFormData = this.contextService.getDataByKey("RTSformdata" + index)
    let BCN;
    let serialNo;
    let newPartName = "newPart" + index;
    if(RTSFormData[newPartName]){
    if (RTSFormData[newPartName].substring(0, 3) == "BCN") {
      BCN = RTSFormData[newPartName]
      serialNo = IssuePartReferenceforRTS.serialNo
    }
    else if (newPartCheckbox == true) {
      BCN = IssuePartReferenceforRTS.itemBcn
    }
    else {
      BCN = IssuePartReferenceforRTS.itemBcn
      serialNo = RTSFormData[newPartName]
    }
  }


    if (clientName == "Louisville") {

      let body = {
        "apiUsageClientName": "#discrepancyUnitInfo.CLIENTNAME",
        "apiUsageLocationName": "#discrepancyUnitInfo.GEONAME",
        "callSource": "FrontEnd",
        "ip": "::1",
        "items": {
          "addtionalDetails": {
          },
          "destinationLocation": {
            "bin": "#moveInventoryConfig.bin",
            "geography": "#discrepancyUnitInfo.GEONAME",
            "stockingLocation": "#moveInventoryConfig.destStkLocationName",
            "warehouse": "#moveInventoryConfig.wareHouseName"
          },
          "item": [
            {
              "owner": "#discrepancyUnitInfo.CLIENTNAME",
              "partNo": element.partNo,
              "quantity": "1"
            }
          ],
          "sourceLocation": {
            "bin": "DELL_AIO_FGI_PARTS-DFLT",
            "geography": "#discrepancyUnitInfo.GEONAME",
            "stockingLocation": "#moveInventoryConfig.srcStkLocationName",
            "warehouse": "#moveInventoryConfig.wareHouseName"
          }
        },
        "usrPwd": {
          "userName": "#loginUUID.username",
          "password": "#loginUUID.password"
        }
      }


      let performMoveInventory = {
        "type": "microservice",
        "eventSource": "click",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "moveinventory",
          "requestMethod": "post",
          "body": body,
          "toBeStringified": true
        },
        "responseDependents": {
          "onSuccess": {
            "actions": action.config.successActions,
          },
          "onFailure": {
            "actions": action.config.failureActions
          }
        }
      }
      actionService.handleAction(performMoveInventory, instance);


      //return body;
    }
    else {
      let body = {
        "apiUsageClientName": "#discrepancyUnitInfo.CLIENTNAME",
        "apiUsageLocationName": "#discrepancyUnitInfo.GEONAME",
        "callSource": "FrontEnd",
        "ip": "::1",
        "items": {
          "addtionalDetails": {
          },
          "destinationLocation": {
            "bin": "#moveInventoryConfig.bin",
            "geography": "#discrepancyUnitInfo.GEONAME",
            "stockingLocation": "#moveInventoryConfig.destStkLocationName",
            "warehouse": "#moveInventoryConfig.wareHouseName"
          },
          "item": [
            {
              "bcn": BCN,
              "owner": "#discrepancyUnitInfo.CLIENTNAME",
              "partNo": element.partNo,
              "quantity": "1",
              "serialNo": serialNo,
              "condition": "Defective"
            }
          ],
          "notes": "",
          "sourceLocation": {
            "bin": "DELL_AIO_FGI_PARTS-DFLT",
            "geography": "#discrepancyUnitInfo.GEONAME",
            "stockingLocation": "#moveInventoryConfig.srcStkLocationName",
            "warehouse": "#moveInventoryConfig.wareHouseName"
          }
        },
        "usrPwd": {
          "userName": "#loginUUID.username",
          "password": "#loginUUID.password"
        }
      }


      let performMoveInventory = {
        "type": "microservice",
        "eventSource": "click",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "moveinventory",
          "requestMethod": "post",
          "body": body,
          "toBeStringified": true
        },
        "responseDependents": {
          "onSuccess": {
            "actions": action.config.successActions,
          },
          "onFailure": {
            "actions": action.config.failureActions
          }
        }
      }
      actionService.handleAction(performMoveInventory, instance);
      //return body;
    }

  }



  handlegetBCNinfoForRemove(action, instance, actionService) {
    let element = action.config.element;
    let index = action.config.index;
    let repairUnitInfo = this.contextService.getDataByKey("repairUnitInfo");
    let clientName = repairUnitInfo.GEONAME;
    let performRemoveAPIflag = this.contextService.getDataByKey("PerformRemovePartsFlag" + index);
    let formData = this.contextService.getDataByKey("dynamicTaskData" + index);
    let defectivePartName = "defectivePart"+ index
    let defectivePart = formData[defectivePartName]
    let defectivePartCheckbox = this.contextService.getDataByKey("defectivePartSelection" + index);
    let indicatorValue
    let indicatorType
    if (defectivePart.substring(0, 3) == "BCN") {
      indicatorValue = defectivePart
      indicatorType = "BCN"
    }
    else {
      indicatorValue = defectivePart
      indicatorType = "SerialNumber"
    }


    let microservice = {
      "type": "microservice",
      "hookType": "afterInit",
      "config": {
        "microserviceId": "getBCNinfo",
        "requestMethod": "get",
        "LocalService": "assets/Responses/getRequisitionStatus.json",
        "isLocal": false,
        "params": {
          "indicatorValue": indicatorValue,
          "indicatorType": indicatorType,
          "userName": "#loginUUID.username"
        }
      },
      "responseDependents": {
        "onSuccess": {
          "actions": action.config.successActions
        },
        "onFailure": {
          "actions": action.config.failureActions
        }
      }

    }
    actionService.handleAction(microservice, instance);

  }

  handlegetBCNinfoForIssue(action, instance, actionService) {
    let element = action.config.element;
    let index = action.config.index;
    let performRemoveAPIflag = this.contextService.getDataByKey("PerformRemovePartsFlag" + index);
    let formData = this.contextService.getDataByKey("dynamicTaskData" + index);
    let newPartName = "newPart" + index;
    let newPart = formData[newPartName]
    let newPartCheckbox = this.contextService.getDataByKey("newPartSelection" + index);
    let indicatorValue
    let indicatorType
    if (newPart.substring(0, 3) == "BCN") {
      indicatorValue = newPart
      indicatorType = "BCN"
    }
    else {
      indicatorValue = newPart
      indicatorType = "SerialNumber"
    }


    let microservice = {
      "type": "microservice",
      "hookType": "afterInit",
      "config": {
        "microserviceId": "getBCNinfo",
        "requestMethod": "get",
        "LocalService": "assets/Responses/getRequisitionStatus.json",
        "isLocal": false,
        "params": {
          "indicatorValue": indicatorValue,
          "indicatorType": indicatorType,
          "userName": "#loginUUID.username"
        }
      },
      "responseDependents": {
        "onSuccess": {
          "actions": action.config.successActions
        },
        "onFailure": {
          "actions": action.config.failureActions
        }
      }

    }
    actionService.handleAction(microservice, instance);

  }

  handlegetBCNinfoForIssueforRTS(action, instance, actionService) {
    let element = action.config.element;
    let index = action.config.index;
    let newPartCheckbox = this.contextService.getDataByKey("newPartSelection" + index);
    let RTSFormData = this.contextService.getDataByKey("RTSformdata" + index)
    let indicatorValue
    let indicatorType
    let newPartName = "newPart" + index;
    // if (newPartCheckbox == true) {
    //   indicatorValue = "NOPPID_CLIENT_REF1"
    //   indicatorType = "SerialNumber"
    // }
    //else {
    if (RTSFormData[newPartName].substring(0, 3) == "BCN") {
      indicatorValue = RTSFormData[newPartName]
      indicatorType = "BCN"
    }
    else {
      indicatorValue = RTSFormData[newPartName]
      indicatorType = "SerialNumber"
    }
    //}


    let microservice = {
      "type": "microservice",
      "hookType": "afterInit",
      "config": {
        "microserviceId": "getBCNinfo",
        "requestMethod": "get",
        "LocalService": "assets/Responses/getRequisitionStatus.json",
        "isLocal": false,
        "params": {
          "indicatorValue": indicatorValue,
          "indicatorType": indicatorType,
          "userName": "#loginUUID.username"
        }
      },
      "responseDependents": {
        "onSuccess": {
          "actions": action.config.successActions
        },
        "onFailure": {
          "actions": action.config.failureActions
        }
      }

    }
    actionService.handleAction(microservice, instance);

  }



  requisitionStatus(action, instance, actionService) {
    let data = this.contextService.getDataByString(action.config.data);
    //let responseData = data[0];
    for (let i = 0; i < data.length; i++) {
      let orderStatus = data[i].orderStatusName.toLowerCase();
      if (orderStatus == "complete") {
        this.contextService.addToContext("requisitionFlag", true)
      } else {
        this.contextService.addToContext("requisitionFlag", false)
        break;
      }
    }
    //let orderStatus = responseData.orderStatusName.toLowerCase();
    // if (orderStatus == "complete") {
    //   this.contextService.addToContext("requisitionFlag", true)
    // } else {
    //   this.contextService.addToContext("requisitionFlag", false)
    // }

  }

  conditionalRemovePartParam(element, index, performRemoveAPIflag) {
    let newPartCheckbox = this.contextService.getDataByKey("newPartSelection" + index);
    //let defectivePart = PPID.defectivePart
    let defectivePartCheckbox = this.contextService.getDataByKey("defectivePartSelection" + index);
    let formData = this.contextService.getDataByKey("dynamicTaskData" + index);
    if (performRemoveAPIflag == "DOA") {
      this.RemovePartParams(element, index, defectivePartCheckbox)
    } else if (performRemoveAPIflag == "RTS") {
      let serialNo = "";
      let componentDiscription = "";
      let part = element.partNo;
      this.contextService.addToContext("RemoveSN" + index, serialNo)
      this.contextService.addToContext("RemoveCD" + index, componentDiscription)
      this.contextService.addToContext("RemovePart" + index, part)
    } else if (performRemoveAPIflag == "Complete") {

      this.RemovePartParams(element, index, defectivePartCheckbox)

    }
  }

  conditionalIssuePartParam(action, actionService, instance) {
    let element = action.config.element;
    let index = action.config.index;
    let performRemoveAPIflag = this.contextService.getDataByKey("PerformRemovePartsFlag" + index);
    let formData = this.contextService.getDataByKey("dynamicTaskData" + index);
    let newPartName = "newPart" + index;
    let newPartPPID = formData[newPartName]
    let newPartCheckbox = this.contextService.getDataByKey("newPartSelection" + index);
    let defectivePartName = "defectivePart"+ index
    let defectivePart = formData[defectivePartName]
    let defectivePartCheckbox = this.contextService.getDataByKey("defectivePartSelection" + index);
    let repairUnitInfo = this.contextService.getDataByKey("repairUnitInfo");
    let clientName = repairUnitInfo.GEONAME;
    if (clientName == "AMERICAS NETWORK") {
      if (defectivePart.substring(0, 3) == "BCN") {
      }
      else if (newPartPPID.substring(0, 3) == "BCN") {
      }
      else if (newPartPPID.substring(0, 3) !== "BCN" && defectivePart.substring(0, 3) !== "BCN") {
      }
    }
    else {
      if (defectivePartCheckbox == true) {
        let part = element.partNo
        let BCN = ""
        let serialNo = "NOPPID_CLIENT_REF1"
        this.contextService.addToContext("IssuePartSN" + index, serialNo)
        this.contextService.addToContext("IssuePart" + index, part)
        this.contextService.addToContext("IssuePartBCN" + index, BCN)
      } else {
        if (defectivePart.substring(0, 2) == "BCN") {
          let BCNdata = this.contextService.getDataByKey("BCNData");
          let part = BCNdata.serialNo.substring(3, 8);
          let BCN = defectivePart
          if (newPartPPID.substring(0, 2) == "BCN") {
            let serialNo = BCNdata.serialNo
            this.contextService.addToContext("IssuePartSN" + index, serialNo)
          } else {
            let serialNo = newPartPPID
            this.contextService.addToContext("IssuePartSN" + index, serialNo)
          }
          this.contextService.addToContext("IssuePart" + index, part)
          this.contextService.addToContext("IssuePartBCN" + index, BCN)
        }
        else {
          let part = defectivePart.substring(3, 8);
          let BCNdata = this.contextService.getDataByKey("BCNData");
          let BCN = BCNdata.itemBcn
          if (newPartPPID.substring(0, 2) == "BCN") {
            let serialNo = BCNdata.serialNo
            this.contextService.addToContext("IssuePartSN" + index, serialNo)
          } else {
            let serialNo = newPartPPID
            this.contextService.addToContext("IssuePartSN" + index, serialNo)
          }
          this.contextService.addToContext("IssuePartBCN" + index, BCN)
          this.contextService.addToContext("IssuePart" + index, part)
        }
      }
    }
  }


  RemovePartParams(element, index, defectivePartCheckbox) {
    let formData = this.contextService.getDataByKey("dynamicTaskData" + index);
    let RemovePartReference = this.contextService.getDataByKey("RemovePartReference" + index);
    let repairUnitInfo = this.contextService.getDataByKey("repairUnitInfo");
    let performRemoveAPIflag = this.contextService.getDataByKey("PerformRemovePartsFlag" + index);
    let clientName = repairUnitInfo.GEONAME;
    let seedValue = this.contextService.getDataByKey("SeedValue" + index);
    let DPS = this.contextService.getDataByKey("getCurrPrevRODetailsBySN");
    let defectiveNoteName = "DefectiveNote" + index;
    let defectivePartName = "defectivePart" + index;
    let elementSeedValue;
    // if(performRemoveAPIflag == "DOA"){
    //   if(formData.newPart && formData.newPart.substring(0, 3) == "BCN"){
    //     let IssuePartReference = this.contextService.getDataByKey("IssuePartReference" + index);
    //     let part = element.partNo
    //     let BCN = formData.newPart
    //     let serialNo = IssuePartReference.serialNo
    //     this.contextService.addToContext("RemoveSN" + index, serialNo)
    //     this.contextService.addToContext("RemovePart" + index, part)
    //     this.contextService.addToContext("RemoveBCN" + index, BCN)
    //   }
    //   else if(formData.NewPartCheckbox == true){

    //   }
    //   else {
    //     let IssuePartReference = this.contextService.getDataByKey("IssuePartReference" + index);
    //     let part = element.partNo
    //     let BCN = IssuePartReference.itemBcn
    //     let serialNo = formData.newPart
    //     this.contextService.addToContext("RemoveSN" + index, serialNo)
    //     this.contextService.addToContext("RemovePart" + index, part)
    //     this.contextService.addToContext("RemoveBCN" + index, BCN)
    //   }
    // }
    //else{
    if (defectivePartCheckbox == true) {
      //if (clientName == "Louisville") {
      //for(let i=0; this.seedarr.length; i++){
      this.seedarr.filter((seedObj) => {
        if (seedObj.partNo == element.partNo) {
          seedObj.seedValue = parseInt(seedObj.seedValue, 10) + 1
          elementSeedValue = parseInt(seedObj.seedValue, 10);
          return false;
        }
      })

      let serialNo = "CN0" + element.partNo + DPS.clientReferenceNo1 + "A" + String(elementSeedValue).padStart(2, '0')
      let componentDiscription = formData[defectiveNoteName];
      let part = element.partNo
      let BCN = this.contextService.getDataByKey("NextItemBCN" + index);
      this.contextService.addToContext("RemoveSN" + index, serialNo)
      this.contextService.addToContext("RemoveCD" + index, componentDiscription)
      this.contextService.addToContext("RemovePart" + index, part)
      this.contextService.addToContext("RemoveBCN" + index, BCN)

    }
    else {
      // if (formData.defectivePart.substring(0, 3) == "BCN") {
      //   let BCN = formData.defectivePart
      //   let serialNo = RemovePartReference.serialNo
      //   let componentDiscription = formData.DefectiveNote;
      //   this.contextService.addToContext("RemoveSN" + index, serialNo)
      //   this.contextService.addToContext("RemoveCD" + index, componentDiscription)
      //   //this.contextService.addToContext("RemovePart" + index, part)
      //   this.contextService.addToContext("RemoveBCN" + index, BCN)
      // }
      //else {
        let serialNo = formData[defectivePartName];
        let componentDiscription = formData[defectiveNoteName];
        let BCN = this.contextService.getDataByKey("NextItemBCN" + index);
        this.contextService.addToContext("RemoveSN" + index, serialNo)
        this.contextService.addToContext("RemoveCD" + index, componentDiscription)
        //this.contextService.addToContext("RemovePart" + index, part)
        this.contextService.addToContext("RemoveBCN" + index, BCN)
      //}

    }
  //}
  }



  HDDPart(action, instance, actionService) {
    let data = this.contextService.getDataByString(action.config.data);
    let HDDPart = data.substring(3, 8);
    this.contextService.addToContext("HDDPart", HDDPart);
  }

  NextItemBCN(action, actionService, instance) {
    let element = action.config.element;
    let index = action.config.index;
    let performRemoveAPIflag = this.contextService.getDataByKey("PerformRemovePartsFlag" + index);
    let microservice = {
      "type": "microservice",
      "hookType": "afterInit",
      "config": {
        "microserviceId": "getNextItemBCNforRework",
        "requestMethod": "get",
        "LocalService": "assets/Responses/getRequisitionStatus.json",
        "isLocal": false,
      },
      "responseDependents": {
        "onSuccess": {
          "actions": action.config.successActions
        },
        "onFailure": {
          "actions": action.config.failureActions
        }
      }

    }
    actionService.handleAction(microservice, instance);
  }

  IssuePartParams(element, index, actionService, instance) {
    let performRemoveAPIflag = this.contextService.getDataByKey("PerformRemovePartsFlag" + index);
    let formData = this.contextService.getDataByKey("dynamicTaskData" + index);
    let newPartName = "newPart" + index;
    let newPartPPID = formData[newPartName]
    let newPartCheckbox = this.contextService.getDataByKey("newPartSelection" + index);
    let defective = "defectivePart" + index;
    let defectivePart = formData[defective]
    let defectivePartCheckbox = this.contextService.getDataByKey("defectivePartSelection" + index);
    let repairUnitInfo = this.contextService.getDataByKey("repairUnitInfo");
    let clientName = repairUnitInfo.GEONAME;
    let DPS = this.contextService.getDataByKey("getCurrPrevRODetailsBySN");
    let elementSeedValue;
    if (newPartCheckbox == true) {
      this.seedarr.filter((seedObj) => {
        if (seedObj.partNo == element.partNo) {
          seedObj.seedValue = parseInt(seedObj.seedValue, 10) + 1
          elementSeedValue = parseInt(seedObj.seedValue, 10);
          return false;
        }
      })
      let serialNo = "CN0" + element.partNo + DPS.clientReferenceNo1 + "A" + String(elementSeedValue).padStart(2, '0')
      //let componentDiscription = formData.DefectiveNote;
      let part = element.partNo
      let BCN = this.contextService.getDataByKey("NextItemBCN" + index);
      this.contextService.addToContext("IssuePartSN" + index, serialNo)
      //this.contextService.addToContext("RemoveCD" + index, componentDiscription)
      //this.contextService.addToContext("RemovePart" + index, part)
      this.contextService.addToContext("IssuePartBCN" + index, BCN)
    }
    else {
      if (newPartPPID.substring(0, 3) == "BCN") {
        let IssuePartReference = this.contextService.getDataByKey("IssuePartReference" + index);
        let BCN = newPartPPID
        let serialNo = IssuePartReference.serialNo
        this.contextService.addToContext("IssuePartSN" + index, serialNo)
        this.contextService.addToContext("IssuePartBCN" + index, BCN)
      }
      else {
        let IssuePartReference = this.contextService.getDataByKey("IssuePartReference" + index);
        if (IssuePartReference && IssuePartReference !== undefined) {
          let BCN = IssuePartReference.itemBcn
          let serialNo = newPartPPID
          this.contextService.addToContext("IssuePartSN" + index, serialNo)
          this.contextService.addToContext("IssuePartBCN" + index, BCN)
        }
      }
    }

  }

  handleCompleteActions(action, instance, actionService) {
    let element = action.config.element;
    let index = action.config.index;
    //let seedValue = action.config.seedValue
    let taskPanelsLength = this.contextService.getDataByKey("DellReworkTaskPanelsLength")
    let CompleteActions = {
      "type": "handleDellReworkActions",
      "methodType": "handlePerformIssuePart",
      "eventSource": "click",
      "config": {
        "element": element,
        "index": index,
        "successActions": [
          {
            "type": "handleDellReworkActions",
            "methodType": "handleAIORemovePart",
            "config": {
              "element": element,
              "index": index,
              "conditionType": "#getSLRXConfigForRemove.condition",
              "successActions": [
                {
                  "type": "condition",
                  "eventSource": "click",
                  "config": {
                    "operation": "isEqualTo",
                    "lhs": "#repairUnitInfo.GEONAME",
                    "rhs": "AMERICAS NETWORK"
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "handleDellReworkActions",
                          "methodType": "handleDellAIOGlobalTrigger",
                          "config": {
                            "element": element,
                            "index": index,
                            "zone": "#getSLRXConfigForRemove.destinationZone",
                            "bin": "#getSLRXConfigForRemove.destinationBin",
                            "successActions": [
                              {
                                "type": "handleDellReworkActions",
                                "methodType": "handlePerformRemoveParts",
                                "config": {
                                  "element": element,
                                  "index": index,
                                  "conditionType": "#getSLRXConfigForRemove.condition",
                                  "zone": "#getSLRXConfigForRemove.destinationZone",
                                  "bin": "#getSLRXConfigForRemove.destinationBin",
                                  "successActions": [
                                    {
                                      "type": "context",
                                      "config": {
                                        "requestMethod": "add",
                                        "key": "DeleteFlag" + index,
                                        "data": false
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "context",
                                      "config": {
                                        "requestMethod": "add",
                                        "key": "isFromSave&Exit" + index,
                                        "data": true
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "defectivePartUUID" + index,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "defectivePartNoPPIDUUID" + index,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "noPartToRemoveUUID" + index,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "defectiveNoteUUID" + index,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "newPartUUID" + index,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "newPartNoPPIDUUID" + index,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "condition",
                                      "eventSource": "click",
                                      "config": {
                                        "operation": "isEqualTo",
                                        "lhs": "#newPartSelection" + index,
                                        "rhs": true
                                      },
                                      "responseDependents": {
                                        "onSuccess": {
                                          "actions": [
                                            {
                                              "type": "updateComponent",
                                              "config": {
                                                "key": "doaLinkUUID" + index,
                                                "properties": {
                                                  "hoverClass": "cursor-default",
                                                  "iconTextClass": "body text-dark",
                                                  "disabled": true
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
                                                "key": "doaLinkUUID" + index,
                                                "properties": {
                                                  "hoverClass": "cursor-pointer",
                                                  "iconTextClass": "body text-primary",
                                                  "disabled": false
                                                }
                                              },
                                              "eventSource": "click"
                                            }
                                          ]
                                        }
                                      }
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "RTSUUID" + index,
                                        "properties": {
                                          "hoverClass": "cursor-default",
                                          "iconTextClass": "body text-dark",
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "deleteUUID" + index,
                                        "properties": {
                                          "disabled": false,
                                          "class": "primary-btn dell-debug-delete-button"
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "completeDynamicTaskUUID" + index,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "dellReworkReplaceUUID" + index,
                                        "properties": {
                                          "expanded": false,
                                          "disabled": false,
                                          "header": {
                                            "svgIcon": "description_icon",
                                            "statusIcon": "check_circle",
                                            "statusClass": "complete-status",
                                            "class": "complete-task ",
                                            "iconClass": "complete-task"
                                          }
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "handleDellReworkActions",
                                      "methodType": "taskPanelOpen",
                                      "eventSource": "click",
                                      "config": {
                                        "index": index
                                      }
                                    },
                                    {
                                      "type": "handleDellReworkActions",
                                      "methodType": "DataFormationforSaveandExit",
                                      "config": {
                                        "taskUUID":"completeDynamicTaskUUID"+index
                                      }
                                    }
                                  ],
                                  "failureActions": [
                                    {
                                      "type": "handleDellReworkActions",
                                      "methodType": "handleUnIssuePart",
                                      "eventSource": "click",
                                      "config": {
                                        "element": element,
                                        "index": index,
                                        "successActions": [
                                        ],
                                        "failureActions": [
                                          {
                                            "type": "handleCommonServices",
                                            "config": {
                                              "type": "errorRenderTemplate",
                                              "contextKey": "errorMsg",
                                              "updateKey": "errorTitleUUID"
                                            }
                                          }
                                        ]
                                      }
                                    },
                                    {
                                      "type": "handleCommonServices",
                                      "config": {
                                        "type": "errorRenderTemplate",
                                        "contextKey": "errorMsg",
                                        "updateKey": "errorTitleUUID"
                                      }
                                    }
                                  ]
                                }
                              }
                            ],
                            "failureActions": [
                              // {
                              //   "type": "handleCommonServices",
                              //   "config": {
                              //     "type": "errorRenderTemplate",
                              //     "contextKey": "errorMsg",
                              //     "updateKey": "errorTitleUUID"
                              //   }
                              // }
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "IrisCallTriggerMessage" + index,
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "handleDellReworkActions",
                                "methodType": "IrisCallTriggerValues",
                                "config": {
                                  "Message": "IrisCallTriggerMessage" + index,
                                  "index": index
                                }
                              },
                              {
                                "type": "handleDellReworkActions",
                                "methodType": "handleDellAIOGlobalTrigger",
                                "config": {
                                  "element": element,
                                  "index": index,
                                  "zone": "#Zone"+ index,
                                  "bin": "#Bin"+ index,
                                  "successActions": [
                                    {
                                      "type": "handleDellReworkActions",
                                      "methodType": "handlePerformRemoveParts",
                                      "config": {
                                        "element": element,
                                        "index": index,
                                        "conditionType": "#getSLRXConfigForRemove.condition",
                                        "zone": "#Zone"+ index,
                                        "bin": "#Bin"+ index,
                                        "successActions": [
                                          {
                                            "type": "context",
                                            "config": {
                                              "requestMethod": "add",
                                              "key": "DeleteFlag" + index,
                                              "data": false
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "context",
                                            "config": {
                                              "requestMethod": "add",
                                              "key": "isFromSave&Exit" + index,
                                              "data": true
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "defectivePartUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "defectivePartNoPPIDUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "noPartToRemoveUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "defectiveNoteUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "newPartUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "newPartNoPPIDUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "condition",
                                            "eventSource": "click",
                                            "config": {
                                              "operation": "isEqualTo",
                                              "lhs": "#newPartSelection" + index,
                                              "rhs": true
                                            },
                                            "responseDependents": {
                                              "onSuccess": {
                                                "actions": [
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "doaLinkUUID" + index,
                                                      "properties": {
                                                        "hoverClass": "cursor-default",
                                                        "iconTextClass": "body text-dark",
                                                        "disabled": true
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
                                                      "key": "doaLinkUUID" + index,
                                                      "properties": {
                                                        "hoverClass": "cursor-pointer",
                                                        "iconTextClass": "body text-primary",
                                                        "disabled": false
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  }
                                                ]
                                              }
                                            }
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "RTSUUID" + index,
                                              "properties": {
                                                "hoverClass": "cursor-default",
                                                "iconTextClass": "body text-dark",
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "deleteUUID" + index,
                                              "properties": {
                                                "disabled": false,
                                                "class": "primary-btn dell-debug-delete-button"
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "completeDynamicTaskUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "dellReworkReplaceUUID" + index,
                                              "properties": {
                                                "expanded": false,
                                                "disabled": false,
                                                "header": {
                                                  "svgIcon": "description_icon",
                                                  "statusIcon": "check_circle",
                                                  "statusClass": "complete-status",
                                                  "class": "complete-task ",
                                                  "iconClass": "complete-task"
                                                }
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "handleDellReworkActions",
                                            "methodType": "taskPanelOpen",
                                            "eventSource": "click",
                                            "config": {
                                              "index": index
                                            }
                                          },
                                          {
                                            "type": "handleDellReworkActions",
                                            "methodType": "DataFormationforSaveandExit",
                                            "config": {
                                              "taskUUID":"completeDynamicTaskUUID"+index
                                            }
                                          }
                                        ],
                                        "failureActions": [
                                          {
                                            "type": "handleDellReworkActions",
                                            "methodType": "handleUnIssuePart",
                                            "eventSource": "click",
                                            "config": {
                                              "element": element,
                                              "index": index,
                                              "successActions": [
                                              ],
                                              "failureActions": [
                                                {
                                                  "type": "handleCommonServices",
                                                  "config": {
                                                    "type": "errorRenderTemplate",
                                                    "contextKey": "errorMsg",
                                                    "updateKey": "errorTitleUUID"
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "type": "handleCommonServices",
                                            "config": {
                                              "type": "errorRenderTemplate",
                                              "contextKey": "errorMsg",
                                              "updateKey": "errorTitleUUID"
                                            }
                                          }
                                        ]
                                      }
                                    }
                                  ],
                                  "failureActions": [
                                    // {
                                    //   "type": "handleCommonServices",
                                    //   "config": {
                                    //     "type": "errorRenderTemplate",
                                    //     "contextKey": "errorMsg",
                                    //     "updateKey": "errorTitleUUID"
                                    //   }
                                    // }
                                   ]
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
                          "type": "handleDellReworkActions",
                          "methodType": "handlePerformRemoveParts",
                          "config": {
                            "element": element,
                            "index": index,
                            "conditionType": "#getSLRXConfigForRemove.condition",
                            "zone": "#getSLRXConfigForRemove.destinationZone",
                            "bin": "#getSLRXConfigForRemove.destinationBin",
                            "successActions": [
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "DeleteFlag" + index,
                                  "data": false
                                },
                                "eventSource": "click"
                              },
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "isFromSave&Exit" + index,
                                  "data": true
                                },
                                "eventSource": "click"
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "defectivePartUUID" + index,
                                  "properties": {
                                    "disabled": true
                                  }
                                },
                                "eventSource": "click"
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "defectivePartNoPPIDUUID" + index,
                                  "properties": {
                                    "disabled": true
                                  }
                                },
                                "eventSource": "click"
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "noPartToRemoveUUID" + index,
                                  "properties": {
                                    "disabled": true
                                  }
                                },
                                "eventSource": "click"
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "defectiveNoteUUID" + index,
                                  "properties": {
                                    "disabled": true
                                  }
                                },
                                "eventSource": "click"
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "newPartUUID" + index,
                                  "properties": {
                                    "disabled": true
                                  }
                                },
                                "eventSource": "click"
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "newPartNoPPIDUUID" + index,
                                  "properties": {
                                    "disabled": true
                                  }
                                },
                                "eventSource": "click"
                              },
                              {
                                "type": "condition",
                                "eventSource": "click",
                                "config": {
                                  "operation": "isEqualTo",
                                  "lhs": "#newPartSelection" + index,
                                  "rhs": true
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "doaLinkUUID" + index,
                                          "properties": {
                                            "hoverClass": "cursor-default",
                                            "iconTextClass": "body text-dark",
                                            "disabled": true
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
                                          "key": "doaLinkUUID" + index,
                                          "properties": {
                                            "hoverClass": "cursor-pointer",
                                            "iconTextClass": "body text-primary",
                                            "disabled": false
                                          }
                                        },
                                        "eventSource": "click"
                                      }
                                    ]
                                  }
                                }
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "RTSUUID" + index,
                                  "properties": {
                                    "hoverClass": "cursor-default",
                                    "iconTextClass": "body text-dark",
                                    "disabled": true
                                  }
                                },
                                "eventSource": "click"
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "deleteUUID" + index,
                                  "properties": {
                                    "disabled": false,
                                    "class": "primary-btn dell-debug-delete-button"
                                  }
                                },
                                "eventSource": "click"
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "completeDynamicTaskUUID" + index,
                                  "properties": {
                                    "disabled": true
                                  }
                                },
                                "eventSource": "click"
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "dellReworkReplaceUUID" + index,
                                  "properties": {
                                    "expanded": false,
                                    "disabled": false,
                                    "header": {
                                      "svgIcon": "description_icon",
                                      "statusIcon": "check_circle",
                                      "statusClass": "complete-status",
                                      "class": "complete-task ",
                                      "iconClass": "complete-task"
                                    }
                                  }
                                },
                                "eventSource": "click"
                              },
                              {
                                "type": "handleDellReworkActions",
                                "methodType": "taskPanelOpen",
                                "eventSource": "click",
                                "config": {
                                  "index": index
                                }
                              },
                              // {
                              //   "type": "context",
                              //   "config": {
                              //     "requestMethod": "add",
                              //     "key": "CompleteButtonLink" + index,
                              //     "data": true
                              //   },
                              //   "eventSource": "click"
                              // },
                              {
                                "type": "handleDellReworkActions",
                                "methodType": "DataFormationforSaveandExit",
                                "config": {
                                  "taskUUID":"completeDynamicTaskUUID"+index
                                }
                              }
                            ],
                            "failureActions": [
                              {
                                "type": "handleDellReworkActions",
                                "methodType": "handleUnIssuePart",
                                "eventSource": "click",
                                "config": {
                                  "element": element,
                                  "index": index,
                                  "successActions": [
                                  ],
                                  "failureActions": [
                                    {
                                      "type": "handleCommonServices",
                                      "config": {
                                        "type": "errorRenderTemplate",
                                        "contextKey": "errorMsg",
                                        "updateKey": "errorTitleUUID"
                                      }
                                    }
                                  ]
                                }
                              },
                              {
                                "type": "handleCommonServices",
                                "config": {
                                  "type": "errorRenderTemplate",
                                  "contextKey": "errorMsg",
                                  "updateKey": "errorTitleUUID"
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                }
              ],
              "failureActions": [
                // {
                //   "type": "handleCommonServices",
                //   "config": {
                //     "type": "errorRenderTemplate",
                //     "contextKey": "errorMsg",
                //     "updateKey": "errorTitleUUID"
                //   }
                // }
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "RemoveTriggerMessage" + index,
                    "data": "responseData"
                  }
                },
                {
                  "type": "splitString",
                  "config": {
                    "data": "#RemoveTriggerMessage" + index,
                    "splitkey": "-",
                    "position": 1,
                    "contextKey": "condition" + index
                  }
                },	  
                {
                  "type": "handleDellReworkActions",
                  "methodType": "handleAIORemovePart",
                  "config": {
                    "element": element,
                    "index": index,
                    "conditionType": "#condition" + index,
                    "successActions": [
                      {
                        "type": "condition",
                        "eventSource": "click",
                        "config": {
                          "operation": "isEqualTo",
                          "lhs": "#repairUnitInfo.GEONAME",
                          "rhs": "AMERICAS NETWORK"
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "handleDellReworkActions",
                                "methodType": "handleDellAIOGlobalTrigger",
                                "zone": "#getSLRXConfigForRemove.destinationZone",
                                "bin": "#getSLRXConfigForRemove.destinationBin",
                                "config": {
                                  "element": element,
                                  "index": index,
                                  "successActions": [
                                    {
                                      "type": "handleDellReworkActions",
                                      "methodType": "handlePerformRemoveParts",
                                      "config": {
                                        "element": element,
                                        "index": index,
                                        "conditionType": "#condition" + index,
                                        "zone": "#getSLRXConfigForRemove.destinationZone",
                                        "bin": "#getSLRXConfigForRemove.destinationBin",
                                        "successActions": [
                                          {
                                            "type": "context",
                                            "config": {
                                              "requestMethod": "add",
                                              "key": "DeleteFlag" + index,
                                              "data": false
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "context",
                                            "config": {
                                              "requestMethod": "add",
                                              "key": "isFromSave&Exit" + index,
                                              "data": true
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "defectivePartUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "defectivePartNoPPIDUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "noPartToRemoveUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "defectiveNoteUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "newPartUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "newPartNoPPIDUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "condition",
                                            "eventSource": "click",
                                            "config": {
                                              "operation": "isEqualTo",
                                              "lhs": "#newPartSelection" + index,
                                              "rhs": true
                                            },
                                            "responseDependents": {
                                              "onSuccess": {
                                                "actions": [
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "doaLinkUUID" + index,
                                                      "properties": {
                                                        "hoverClass": "cursor-default",
                                                        "iconTextClass": "body text-dark",
                                                        "disabled": true
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
                                                      "key": "doaLinkUUID" + index,
                                                      "properties": {
                                                        "hoverClass": "cursor-pointer",
                                                        "iconTextClass": "body text-primary",
                                                        "disabled": false
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  }
                                                ]
                                              }
                                            }
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "RTSUUID" + index,
                                              "properties": {
                                                "hoverClass": "cursor-default",
                                                "iconTextClass": "body text-dark",
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "deleteUUID" + index,
                                              "properties": {
                                                "disabled": false,
                                                "class": "primary-btn dell-debug-delete-button"
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "completeDynamicTaskUUID" + index,
                                              "properties": {
                                                "disabled": true
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "dellReworkReplaceUUID" + index,
                                              "properties": {
                                                "expanded": false,
                                                "disabled": false,
                                                "header": {
                                                  "svgIcon": "description_icon",
                                                  "statusIcon": "check_circle",
                                                  "statusClass": "complete-status",
                                                  "class": "complete-task ",
                                                  "iconClass": "complete-task"
                                                }
                                              }
                                            },
                                            "eventSource": "click"
                                          },
                                          {
                                            "type": "handleDellReworkActions",
                                            "methodType": "taskPanelOpen",
                                            "eventSource": "click",
                                            "config": {
                                              "index": index
                                            }
                                          },
                                          {
                                            "type": "handleDellReworkActions",
                                            "methodType": "DataFormationforSaveandExit",
                                            "config": {
                                              "taskUUID":"completeDynamicTaskUUID"+index
                                            }
                                          }
                                        ],
                                        "failureActions": [
                                          {
                                            "type": "handleDellReworkActions",
                                            "methodType": "handleUnIssuePart",
                                            "eventSource": "click",
                                            "config": {
                                              "element": element,
                                              "index": index,
                                              "successActions": [
                                              ],
                                              "failureActions": [
                                                {
                                                  "type": "handleCommonServices",
                                                  "config": {
                                                    "type": "errorRenderTemplate",
                                                    "contextKey": "errorMsg",
                                                    "updateKey": "errorTitleUUID"
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "type": "handleCommonServices",
                                            "config": {
                                              "type": "errorRenderTemplate",
                                              "contextKey": "errorMsg",
                                              "updateKey": "errorTitleUUID"
                                            }
                                          }
                                        ]
                                      }
                                    }
                                  ],
                                  "failureActions": [
                                    // {
                                    //   "type": "handleCommonServices",
                                    //   "config": {
                                    //     "type": "errorRenderTemplate",
                                    //     "contextKey": "errorMsg",
                                    //     "updateKey": "errorTitleUUID"
                                    //   }
                                    // }
                                    {
                                      "type": "context",
                                      "config": {
                                        "requestMethod": "add",
                                        "key": "IrisCallTriggerMessage" + index,
                                        "data": "responseData"
                                      }
                                    },
                                    {
                                      "type": "handleDellReworkActions",
                                      "methodType": "IrisCallTriggerValues",
                                      "config": {
                                        "Message": "IrisCallTriggerMessage" + index,
                                        "index": index
                                      }
                                    },
                                    {
                                      "type": "handleDellReworkActions",
                                      "methodType": "handleDellAIOGlobalTrigger",
                                      "config": {
                                        "element": element,
                                        "index": index,
                                        "zone": "#Zone"+ index,
                                        "bin": "#Bin"+ index,
                                        "successActions": [
                                          {
                                            "type": "handleDellReworkActions",
                                            "methodType": "handlePerformRemoveParts",
                                            "config": {
                                              "element": element,
                                              "index": index,
                                              "conditionType": "#condition" + index,
                                              "zone": "#Zone"+ index,
                                              "bin": "#Bin"+ index,
                                              "successActions": [
                                                {
                                                  "type": "context",
                                                  "config": {
                                                    "requestMethod": "add",
                                                    "key": "DeleteFlag" + index,
                                                    "data": false
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "context",
                                                  "config": {
                                                    "requestMethod": "add",
                                                    "key": "isFromSave&Exit" + index,
                                                    "data": true
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "defectivePartUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "defectivePartNoPPIDUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "noPartToRemoveUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "defectiveNoteUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "newPartUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "newPartNoPPIDUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "condition",
                                                  "eventSource": "click",
                                                  "config": {
                                                    "operation": "isEqualTo",
                                                    "lhs": "#newPartSelection" + index,
                                                    "rhs": true
                                                  },
                                                  "responseDependents": {
                                                    "onSuccess": {
                                                      "actions": [
                                                        {
                                                          "type": "updateComponent",
                                                          "config": {
                                                            "key": "doaLinkUUID" + index,
                                                            "properties": {
                                                              "hoverClass": "cursor-default",
                                                              "iconTextClass": "body text-dark",
                                                              "disabled": true
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
                                                            "key": "doaLinkUUID" + index,
                                                            "properties": {
                                                              "hoverClass": "cursor-pointer",
                                                              "iconTextClass": "body text-primary",
                                                              "disabled": false
                                                            }
                                                          },
                                                          "eventSource": "click"
                                                        }
                                                      ]
                                                    }
                                                  }
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "RTSUUID" + index,
                                                    "properties": {
                                                      "hoverClass": "cursor-default",
                                                      "iconTextClass": "body text-dark",
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "deleteUUID" + index,
                                                    "properties": {
                                                      "disabled": false,
                                                      "class": "primary-btn dell-debug-delete-button"
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "completeDynamicTaskUUID" + index,
                                                    "properties": {
                                                      "disabled": true
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "dellReworkReplaceUUID" + index,
                                                    "properties": {
                                                      "expanded": false,
                                                      "disabled": false,
                                                      "header": {
                                                        "svgIcon": "description_icon",
                                                        "statusIcon": "check_circle",
                                                        "statusClass": "complete-status",
                                                        "class": "complete-task ",
                                                        "iconClass": "complete-task"
                                                      }
                                                    }
                                                  },
                                                  "eventSource": "click"
                                                },
                                                {
                                                  "type": "handleDellReworkActions",
                                                  "methodType": "taskPanelOpen",
                                                  "eventSource": "click",
                                                  "config": {
                                                    "index": index
                                                  }
                                                },
                                                {
                                                  "type": "handleDellReworkActions",
                                                  "methodType": "DataFormationforSaveandExit",
                                                  "config": {
                                                    "taskUUID":"completeDynamicTaskUUID"+index
                                                  }
                                                }
                                              ],
                                              "failureActions": [
                                                {
                                                  "type": "handleDellReworkActions",
                                                  "methodType": "handleUnIssuePart",
                                                  "eventSource": "click",
                                                  "config": {
                                                    "element": element,
                                                    "index": index,
                                                    "successActions": [
                                                    ],
                                                    "failureActions": [
                                                      {
                                                        "type": "handleCommonServices",
                                                        "config": {
                                                          "type": "errorRenderTemplate",
                                                          "contextKey": "errorMsg",
                                                          "updateKey": "errorTitleUUID"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "type": "handleCommonServices",
                                                  "config": {
                                                    "type": "errorRenderTemplate",
                                                    "contextKey": "errorMsg",
                                                    "updateKey": "errorTitleUUID"
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        ],
                                        "failureActions": [
                                          // {
                                          //   "type": "handleCommonServices",
                                          //   "config": {
                                          //     "type": "errorRenderTemplate",
                                          //     "contextKey": "errorMsg",
                                          //     "updateKey": "errorTitleUUID"
                                          //   }
                                          // }
                                         ]
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
                                "type": "handleDellReworkActions",
                                "methodType": "handlePerformRemoveParts",
                                "config": {
                                  "element": element,
                                  "index": index,
                                  "conditionType": "#condition" + index,
                                  "zone": "#getSLRXConfigForRemove.destinationZone",
                                  "bin": "#getSLRXConfigForRemove.destinationBin",
                                  "successActions": [
                                    {
                                      "type": "context",
                                      "config": {
                                        "requestMethod": "add",
                                        "key": "DeleteFlag" + index,
                                        "data": false
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "context",
                                      "config": {
                                        "requestMethod": "add",
                                        "key": "isFromSave&Exit" + index,
                                        "data": true
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "defectivePartUUID" + index,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "defectivePartNoPPIDUUID" + index,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "noPartToRemoveUUID" + index,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "defectiveNoteUUID" + index,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "newPartUUID" + index,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "newPartNoPPIDUUID" + index,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "condition",
                                      "eventSource": "click",
                                      "config": {
                                        "operation": "isEqualTo",
                                        "lhs": "#newPartSelection" + index,
                                        "rhs": true
                                      },
                                      "responseDependents": {
                                        "onSuccess": {
                                          "actions": [
                                            {
                                              "type": "updateComponent",
                                              "config": {
                                                "key": "doaLinkUUID" + index,
                                                "properties": {
                                                  "hoverClass": "cursor-default",
                                                  "iconTextClass": "body text-dark",
                                                  "disabled": true
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
                                                "key": "doaLinkUUID" + index,
                                                "properties": {
                                                  "hoverClass": "cursor-pointer",
                                                  "iconTextClass": "body text-primary",
                                                  "disabled": false
                                                }
                                              },
                                              "eventSource": "click"
                                            }
                                          ]
                                        }
                                      }
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "RTSUUID" + index,
                                        "properties": {
                                          "hoverClass": "cursor-default",
                                          "iconTextClass": "body text-dark",
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "deleteUUID" + index,
                                        "properties": {
                                          "disabled": false,
                                          "class": "primary-btn dell-debug-delete-button"
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "completeDynamicTaskUUID" + index,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "dellReworkReplaceUUID" + index,
                                        "properties": {
                                          "expanded": false,
                                          "disabled": false,
                                          "header": {
                                            "svgIcon": "description_icon",
                                            "statusIcon": "check_circle",
                                            "statusClass": "complete-status",
                                            "class": "complete-task ",
                                            "iconClass": "complete-task"
                                          }
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "handleDellReworkActions",
                                      "methodType": "taskPanelOpen",
                                      "eventSource": "click",
                                      "config": {
                                        "index": index
                                      }
                                    },
                                    // {
                                    //   "type": "context",
                                    //   "config": {
                                    //     "requestMethod": "add",
                                    //     "key": "CompleteButtonLink" + index,
                                    //     "data": true
                                    //   },
                                    //   "eventSource": "click"
                                    // },
                                    {
                                      "type": "handleDellReworkActions",
                                      "methodType": "DataFormationforSaveandExit",
                                      "config": {
                                        "taskUUID":"completeDynamicTaskUUID"+index
                                      }
                                    }
                                  ],
                                  "failureActions": [
                                    {
                                      "type": "handleDellReworkActions",
                                      "methodType": "handleUnIssuePart",
                                      "eventSource": "click",
                                      "config": {
                                        "element": element,
                                        "index": index,
                                        "successActions": [
                                        ],
                                        "failureActions": [
                                          {
                                            "type": "handleCommonServices",
                                            "config": {
                                              "type": "errorRenderTemplate",
                                              "contextKey": "errorMsg",
                                              "updateKey": "errorTitleUUID"
                                            }
                                          }
                                        ]
                                      }
                                    },
                                    {
                                      "type": "handleCommonServices",
                                      "config": {
                                        "type": "errorRenderTemplate",
                                        "contextKey": "errorMsg",
                                        "updateKey": "errorTitleUUID"
                                      }
                                    }
                                  ]
                                }
                              }
                            ]
                          }
                        }
                      }
                    ],
                    "failureActions": [
                      // {
                      //   "type": "handleCommonServices",
                      //   "config": {
                      //     "type": "errorRenderTemplate",
                      //     "contextKey": "errorMsg",
                      //     "updateKey": "errorTitleUUID"
                      //   }
                      // }
                    ]
                  }
                }
              ]
            }
          }
        ],
        "failureActions": [
          {
            "type": "handleCommonServices",
            "config": {
              "type": "errorRenderTemplate",
              "contextKey": "errorMsg",
              "updateKey": "errorTitleUUID"
            }
          }
        ]
      }
    }
    actionService.handleAction(CompleteActions, instance);

  }

  IrisCallTriggerValues(action, instance, actionService){

    let errorString = action.config.Message;
    let message = this.contextService.getDataByKey(errorString);
    let index = action.config.index;
    let firstsplit = message.split(",");
    let secondsplit = firstsplit[0].split(":");
    let thirdsplit = firstsplit[1].split(":");
    let zone = secondsplit[2];
    let bin = thirdsplit[1];

    this.contextService.addToContext("Zone" + index,zone);
    this.contextService.addToContext("Bin" + index,bin);


  }

  DeleteButtonCheck(action, instance, actionService){
    let index = action.config.index;
    let NewpartCheckBox = this.contextService.getDataByKey("newPartSelection"+ index);
    let formData = this.contextService.getDataByKey("dynamicTaskData" + index);
    let newPartName = "newPart" + index;
    let newPartPPID = formData[newPartName];
    if(NewpartCheckBox && NewpartCheckBox == true){
      // let taskPanel = {
      //   "type": "updateComponent",
      //   "config": {
      //     "key": "dellReworkReplaceUUID" + index,
      //     "properties": {
      //       "disabled": false,
      //       "expanded": true,
      //       "header": {
      //         "svgIcon": "description_icon",
      //         "iconClass": "active-header",
      //         "class": "greyish-black",
      //         "statusIcon": "hourglass_empty",
      //         "statusClass": "incomplete-status"
      //       }
      //     }
      //   }
      // }
      // this.componentService.handleUpdateComponent(taskPanel, null, null, this.utiliyService);
      let newPartTextField = {
        "type": "updateComponent",
        "config": {
          "key": "newPartUUID" + index,
          "properties": {
            "disabled": true
          }
        }
      }
      this.componentService.handleUpdateComponent(newPartTextField, null, null, this.utiliyService);
      let nePartCheckbox = {
        "type": "updateComponent",
        "config": {
          "key": "newPartNoPPIDUUID" + index,
          "properties": {
            "disabled": false
          }
        }
      }
      this.componentService.handleUpdateComponent(nePartCheckbox, null, null, this.utiliyService);
      let CompleteButton = {
        "type": "updateComponent",
        "config": {
          "key": "completeDynamicTaskUUID" + index,
          "properties": {
            "disabled": false
          }
        }
      }
      this.componentService.handleUpdateComponent(CompleteButton, null, null, this.utiliyService);
    }
    else if (NewpartCheckBox == false || NewpartCheckBox == null){
      // let taskPanel = {
      //   "type": "updateComponent",
      //   "config": {
      //     "key": "dellReworkReplaceUUID" + index,
      //     "properties": {
      //       "disabled": false,
      //       "expanded": true,
      //       "header": {
      //         "svgIcon": "description_icon",
      //         "iconClass": "active-header",
      //         "class": "greyish-black",
      //         "statusIcon": "hourglass_empty",
      //         "statusClass": "incomplete-status"
      //       }
      //     }
      //   }
      // }
      // this.componentService.handleUpdateComponent(taskPanel, null, null, this.utiliyService);
      let newPartTextField = {
        "type": "updateComponent",
        "config": {
          "key": "newPartUUID" + index,
          "properties": {
            "disabled": false
          }
        }
      }
      this.componentService.handleUpdateComponent(newPartTextField, null, null, this.utiliyService);
      let nePartCheckbox = {
        "type": "updateComponent",
        "config": {
          "key": "newPartNoPPIDUUID" + index,
          "properties": {
            "disabled": false
          }
        }
      }
      this.componentService.handleUpdateComponent(nePartCheckbox, null, null, this.utiliyService);
      if(newPartName.length >= 5){
        let CompleteButton = {
          "type": "updateComponent",
          "config": {
            "key": "completeDynamicTaskUUID" + index,
            "properties": {
              "disabled": false
            }
          }
        }
        this.componentService.handleUpdateComponent(CompleteButton, null, null, this.utiliyService);
      }
      else {
        let CompleteButton = {
          "type": "updateComponent",
          "config": {
            "key": "completeDynamicTaskUUID" + index,
            "properties": {
              "disabled": true
            }
          }
        }
        this.componentService.handleUpdateComponent(CompleteButton, null, null, this.utiliyService);
      }
    }
  }

  DataFormationforSaveandExit(action, instance, actionService) {
    let taskRef = this.contextService.getDataByKey(action.config.taskUUID + "ref");
    if (taskRef && taskRef.instance && taskRef.instance.group && taskRef.instance.group.controls) {
      let groupData = taskRef.instance.group.controls
      if (groupData) {
        Object.keys(groupData).forEach((key) => {
          let data = this.contextService.getDataByKey(key);
          if (data && key != "undefined") {
            let text = {
              "name": key,
              "ctype": data.ctype,
              "uuid": data.uuid,
              "isTaskDone": true,
              "value": groupData[key].value,
              "disabled": groupData[key].disabled
            }
            this.contextService.addToContext(data.uuid, text);
          }
        })
      }
    }
  }

  CompleteStatusCheck(action, instance, actionService) {
    let index = action.config.index;
    let CompleteFlag = action.config.CompleteFlag
    let totaltaskPanelLength = this.contextService.getDataByKey("DellReworkTaskPanelsLength");
    let dynamicTaskPanelUUID = this.contextService.getDataByKey("dellReworkReplaceUUID" + index + "ref")
    let specialMessage = this.contextService.getDataByKey("specialMessageData");
    if (CompleteFlag == false) {
      let action = {
        "type": "updateComponent",
        "config": {
          "key": "dellReworkReplaceUUID" + index,
          "properties": {
            "expanded": true,
            "disabled": false
          }
        },
        "eventSource": "click"
      }
      this.componentService.handleUpdateComponent(action, null, null, this.utiliyService)
      this.contextService.addToContext("Completeflag", true);
    }
  }

  taskPanelOpen(action, instance, actionService) {
    let index = action.config.index
    let totaltaskPanelLength = this.contextService.getDataByKey("DellReworkTaskPanelsLength");
    let dynamicTaskPanelUUID = this.contextService.getDataByKey("dellReworkReplaceUUID" + index + "ref")
    if(dynamicTaskPanelUUID && dynamicTaskPanelUUID.instance && dynamicTaskPanelUUID.instance.header && dynamicTaskPanelUUID.instance.header.statusClass ){
    if (dynamicTaskPanelUUID.instance.header.statusClass == "complete-status") {
      if (index == totaltaskPanelLength - 1) {
        let action = {
          "type": "updateComponent",
          "config": {
            "key": "dellReworkHDDUUID",
            "properties": {
              "expanded": true,
              "disabled": false,
              "header": {
                "title": "Record HDD Details",
                "svgIcon": "description_icon",
                "iconClass": "active-header",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              }
            }
          },
          "eventSource": "click"
        }
        this.componentService.handleUpdateComponent(action, null, null, this.utiliyService)
      }
      else {
        index = index + 1;
        let action = {
          "config": {
            "index": index
          }
        }
        this.taskPanelOpen(action, instance, actionService)
      }
    }
    else if (dynamicTaskPanelUUID.instance.header.statusClass == "incomplete-status") {
      let action = {
        "type": "updateComponent",
        "config": {
          "key": "dellReworkReplaceUUID" + index,
          "properties": {
            "expanded": true,
            "disabled": false
          }
        },
        "eventSource": "click"
      }
      this.componentService.handleUpdateComponent(action, null, null, this.utiliyService)
    }
  }
  }

  // seeedValueforDOA(action, actionService, instance){
  //   let data = this.contextService.getDataByString(action.config.data);
  //   let taskPanelsLength = data.length;
  //   let previousWCFahistory = data;
  //   this.seedarrforDOA = [];
  //   let DPS = this.contextService.getDataByKey("getCurrPrevRODetailsBySN");
  //   let DPSValue = DPS.clientReferenceNo1
  //   let uniqueParts = [...new Set(previousWCFahistory.map(item => item.partNo))];
  //   for (let j = 0; j < uniqueParts.length; j++) {
  //     let obj = {
  //       partNo: uniqueParts[j],
  //       //actionId: previousWCFahistory[i].actionId,
  //       seedValue: -1,
  //     }
  //     this.seedarrforDOA.push(obj);
  //   }
  //   for(let i=0; i<previousWCFahistory.length; i++){
  //     let seedSplitNumberValue;
  //     let seedValue;
  //     let IssuePartSN = this.contextService.getDataByKey("IssuePartSN" + i)
  //     if(IssuePartSN && IssuePartSN.search(DPSValue) != -1){
  //       seedSplitNumberValue = parseInt(IssuePartSN.split("A")[1], 10);
  //       seedValue = String(seedSplitNumberValue).padStart(2, '0');
  //     } else {
  //       seedValue = -1
  //     }

  //     if (parseInt(seedValue) > -1) {
  //       this.seedarrforDOA.filter((o) => {
  //         if (o.partNo == previousWCFahistory[i].partNo) {
  //           if (parseInt(seedValue) > parseInt(o.seedValue)) {
  //             o.seedValue = seedValue
  //           }
  
  //         }
  //       });
  //     }
  //   }
  // }


  seedValue(action, actionService, instance) {
    let data = action.config.data;
    let taskPanelsLength = data.length;
    this.contextService.addToContext("DellReworkTaskPanelsLength", taskPanelsLength);
    //let requisitionFlag = this.contextService.getDataByKey("requisitionFlag");
    let previousWCFahistory = data;
    this.seedarr = [];
    let uniqueParts = [...new Set(previousWCFahistory.map(item => item.partNo))];
    //console.log(uniqueParts);
    //let obj;
    for (let j = 0; j < uniqueParts.length; j++) {
      let obj = {
        partNo: uniqueParts[j],
        //actionId: previousWCFahistory[i].actionId,
        seedValue: -1,
      }
      this.seedarr.push(obj);
    }
    for (let i = 0; i < data.length; i++) {
      let actionId = data[i].actionId
      this.getCompByAction1(action, instance, actionService, actionId, i, data)

    }
    //this.Cd(action, instance, actionService,data)
    console.log(this.seedarr);
    //this.createDynamicTaskPanels(instance,actionService,data,data[i],i)
  }

  objcreat(action, instance, actionService) {
    let i = action.config.i
    let data = action.config.data
    let ActionData = this.contextService.getDataByKey("getCompByAction1" + i);
    let SNobj = this.getcompByActionData(ActionData);
    let DPS = this.contextService.getDataByKey("getCurrPrevRODetailsBySN");
    let DPSValue = DPS.clientReferenceNo1
    //let seedValue = SNobj.removeSN ? parseInt(SNobj.removeSN.charAt(SNobj.removeSN.length - 1), 10) : -1;
    // let seedSplitValue = SNobj.removeSN?  SNobj.removeSN.split("A") : -1
    // let seedValue = SNobj.removeSN ? SNobj.removeSN.padStart(2, '0') : -1;
    let seedSplitNumberValue;
    let seedUpdatedValue;
    let seedValue;
    if (SNobj && SNobj.removeSN && SNobj.removeSN.search(DPSValue) != -1) {
      //if(SNobj.removeSN.search(DPSValue) != -1) {
      seedSplitNumberValue = parseInt(SNobj.removeSN.split("A")[1], 10);
      seedValue = String(seedSplitNumberValue).padStart(2, '0');
      //seedValue = SNobj.removeSN.split("A")[0]+'A'+seedUpdatedValue;
      //}
    } else {
      seedValue = -1
    }


    if (parseInt(seedValue) > -1) {
      this.seedarr.filter((o) => {
        if (o.partNo == data[i].partNo) {
          if (parseInt(seedValue) > parseInt(o.seedValue)) {
            o.seedValue = seedValue
          }

        }
      });
    }
  }



  getCompByAction1(action, instance, actionService, actionId, i, data) {
    let microservice = {
      "type": "microservice",
      "hookType": "afterInit",
      "config": {
        "microserviceId": "getCompByAction",
        "isLocal": false,
        "LocalService": "assets/Responses/performFA.json",
        "requestMethod": "get",
        "params": {
          "actionId": actionId,
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
                "key": "getCompByAction1" + i,
                "data": "responseData"
              }
            },
            {
              "type": "handleDellReworkActions",
              "methodType": "objcreat",
              "config": {
                "i": i,
                "data": data
              }
            }
          ]
        },
        "onFailure": {
          "actions": [
            {
              "type": "handleCommonServices",
              "config": {
                "type": "errorRenderTemplate",
                "contextKey": "errorMsg",
                "updateKey": "errorTitleUUID"
              }
            }
          ]
        }
      }
    }
    actionService.handleAction(microservice, instance);
  }

  //   getCompByAction(action, instance, actionService,actionId,obj){
  //   let microservice = {
  //     "type": "microservice",
  //     "hookType": "afterInit",
  //     "config": {
  //       "microserviceId": "getCompByAction",
  //       "isLocal": false,
  //       "LocalService": "assets/Responses/performFA.json",
  //       "requestMethod": "get",
  //       "params": {
  //         "actionId": actionId,
  //         "userName": "#loginUUID.username"
  //       }
  //     },
  //     "responseDependents": {
  //       "onSuccess": {
  //         "actions": [
  //           {
  //             "type": "context",
  //             "config": {
  //               "requestMethod": "add",
  //               "key": "getCompByAction",
  //               "data": "responseData"
  //             }
  //           },
  //           {
  //             "type": "handleDellReworkActions",
  //             "methodType": "def",
  //             "config": {
  //               "obj": obj
  //             }
  //           }
  //         ]
  //       },
  //       "onFailure": {
  //         "actions": [
  //           {
  //             "type": "handleCommonServices",
  //             "config": {
  //               "type": "errorRenderTemplate",
  //               "contextKey": "errorMsg",
  //               "updateKey": "errorTitleUUID"
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   }
  //   actionService.handleAction(microservice, instance);
  //  }

  getcompByActionData(getCompByActionData) {
    let obj = {
      issueSN: "",
      removeSN: ""
    }
    for (let i = 0; i < getCompByActionData.length; i++) {
      if (getCompByActionData[i].TRX_TYPE.toLowerCase() == "issued") {
        obj.issueSN = getCompByActionData[i].COMPONENT_SN;
      }
      else {
        obj.removeSN = getCompByActionData[i].COMPONENT_SN;
      }
    }
    return obj;
  }

  //  seedFunction(part){
  //   let obj1 = this.seedarr.find((o,j) => {
  //     if (o.partNo === previousWCFahistory[i].partNo) {
  //         //arr[i] = { name: 'new string', value: 'this', other: 'that' };
  //         obj.seedValue = o.seedValue + 1;

  //         //return true; // stop searching
  //     }
  //   })
  //  }

  //  abcd(){

  //  let calcSeed = (function() {
  //   //arrObj = [
  //      {"partNo":123, "seedVal":4},
  //      {"partNo":786, "seedVal":3},
  //    ]

  //    return {
  //      getNextSeed : function(part){

  //      let actualValue;
  //      //let parObj = arrObj.filter(function(pr){      
  //        if(pr.partNo == part){
  //          actualValue = pr.seedVal;
  //          pr.seedVal = pr.seedVal + 1;

  //        }
  //      })
  //      return actualValue;
  //    },

  //     showdata : function showdata(){
  //      //console.log(arrObj)
  //    }
  //    };
  //  })();




  //  console.log(calcSeed.getNextSeed(123));
  //  console.log(calcSeed.getNextSeed(123));
  //  console.log(calcSeed.getNextSeed(786));
  //  console.log(calcSeed.getNextSeed(786));
  //  calcSeed.showdata();

  // }
}
