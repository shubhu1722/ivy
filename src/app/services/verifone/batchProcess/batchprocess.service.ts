import { identifierModuleUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ActionService } from '../../action/action.service';
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class BatchprocessService {
  Data = 1;

  messageSubject = new Subject();
  unitTableDataUpdate = new Subject();
  workInstructionOpened = new Subject();
  allBatch = [];
  batchPopup = "display:none"

  //data to decide the screen event should be click or dbl click.
  click = [
    //"CA_KEYING",
    //"COBRA_KEYING",
    // "HERD",
    // "IDS",
    //"ITALY_KEYING",
    // "ITALY_PARA",
    //"L2_RKL_KEYING",
    "LOAD STATION",
    // "OS_LOADING",
    //"P2PE_RKL_KEYING",
    // "PARA",
    // "PERSO",
    // "TMS",
     //"TOTAL_KEYING",
    // "UX_PARA",
    // "VERIINIT",
    // "VHQ"
  ]

  dblclick = [
     //"CA_KEYING",
     //"COBRA_KEYING",
    // "HERD",
    // "IDS",
     //"ITALY_KEYING",
    // "ITALY_PARA",
     //"L2_RKL_KEYING",
    "LOAD STATION",
    // "OS_LOADING",
    // "P2PE_RKL_KEYING",
    // "PARA",
    // "PERSO",
    // "TMS",
    // "TOTAL_KEYING",
    // "UX_PARA",
    // "VERIINIT",
    // "VHQ"
  ]

  dblClickPass = [
    "LOAD STATION",
    //"CA_KEYING",
    // "COBRA_KEYING",
    // "ITALY_KEYING",
    // "L2_RKL_KEYING",
    // "P2PE_RKL_KEYING",
    // "TMS",
    // "TOTAL_KEYING",
    // "VERIINIT",
  ]

  noRoute = [
    // "LOAD STATION",
    "CA_KEYING",
    "CA_KEYING",
    "COBRA_KEYING",
    "ITALY_KEYING",
    "L2_RKL_KEYING",
    "P2PE_RKL_KEYING",
    "TMS",
    "TOTAL_KEYING",
    "VERIINIT"
  ]

  constructor(
    private contextService: ContextService,
  ) { }

  //Method to execute the action that needs to perform from action service.
  executeActions(actions, instance, actionService) {
    actions && actions.forEach((currentAction) => {
      actionService.handleAction(currentAction, instance);
    });
  }

  getOrderId(text) {
    let order = text.slice(text.length - 2, text.length);
    return order
  }

  getActiveBatchProcess(action, instance, actionService) {
    // this.allBatch = [];
    this.contextService.addToContext("allBatchData", []);
    let activeBatchesData = this.contextService.getDataByKey("activeBatchesData");
    let uniqueBatchArr = [];
    var newBatchId = {};
    let uniqueBatchIdArr = [...new Set(activeBatchesData.map(item => item.batchId))];
    uniqueBatchIdArr.sort();
    for (let i = 0; i < uniqueBatchIdArr.length; i++) {
      uniqueBatchArr[i] = { "batchDetail": [] };
      let sameBatch = [];
      if (this.allBatch.length > 0) {
        sameBatch = this.allBatch.filter(e => e.batchName == uniqueBatchIdArr[i]);
      }
      for (let j = 0; j < activeBatchesData.length; j++) {
        let indexUnitData = activeBatchesData[j]['batchItem'];

        //Remove if api send orderId.
        // indexUnitData["unitOrder"] = this.getOrderId(indexUnitData.unitBatchId);

        let unitCondition = ""
        if (sameBatch.length > 0) {
          unitCondition = sameBatch[0].batchUnits.filter(e => e.batchDetailsReponse.itemBcn === indexUnitData.itemBcn);
        }
        if (uniqueBatchIdArr[i] === activeBatchesData[j]['batchId']) {
          newBatchId = {};
          newBatchId = {
            "batchId": activeBatchesData[j]['batchId'],
            "batchDetailsReponse": indexUnitData,
            "condition": unitCondition.length > 0 && unitCondition[0]["condition"] && unitCondition[0]["condition"] !== "Fail" ? unitCondition[0]["condition"] : "",
            "selectedRc": this.getRCcode(unitCondition),
            "notes": "",
            "instruction": this.getInstruction(unitCondition)
          };

          uniqueBatchArr[i]['batchDetail'].push(newBatchId);
        }
      }
    }
    this.allBatch = [];
    for (let i = 0; i < uniqueBatchArr.length; i++) {
      let unitBatchData = uniqueBatchArr[i]['batchDetail'][0]['batchId'];
      let takeOverBatchStatus = this.checkUserLoginBatch(unitBatchData, uniqueBatchArr[i]['batchDetail']);
      let holdStatus = takeOverBatchStatus["holdFlag"];
      let loginSameStatus = takeOverBatchStatus["loginSame"];

      let newBatch = {
        batchIndex: i,
        batchUnits: uniqueBatchArr[i]['batchDetail'],
        batchName: unitBatchData,
        "headerColor": (holdStatus || loginSameStatus) ? "takeover-header" : "",
        "takeOverBatchStatus": (holdStatus || loginSameStatus),
        "holdStatus": holdStatus
      };

      this.allBatch.push(newBatch);
      this.renderBatchTemplates(unitBatchData, newBatch, instance, actionService, false);
    }


  }

  handleBatchProcessActions(action, instance, actionService) {
    let userName = this.contextService.getDataByString("#loginUUID.username");
    let availableFlag = true;
    let newBatchItem = '';
    this.allBatch = this.contextService.getDataByString("#allBatchData") ? this.contextService.getDataByString("#allBatchData") : [];
    // let newBatchId ;
    let newBatchItemDetails = this.contextService.getDataByKey("newBatchItemDetails");
    let holdStatus = undefined;
    let loginSameStatus = undefined;

    if (newBatchItemDetails) {
      let checkKeyingBatch = this.contextService.getDataByKey("keyingTaskData");
      if (checkKeyingBatch) {
        newBatchItem = newBatchItemDetails['newBatchIdKey'];
      } else {
        newBatchItem = newBatchItemDetails['newBatchId'];
      }
      
      let takeOverBatchStatus = this.checkUserLoginBatch(newBatchItem, newBatchItemDetails);
      holdStatus = takeOverBatchStatus["holdFlag"];
      loginSameStatus = takeOverBatchStatus["loginSame"];
    }

    let newBatch = {
      batchIndex: this.allBatch.length,
      batchName: newBatchItem,
      batchUnits: []
    }

    newBatch["headerColor"] = (holdStatus || loginSameStatus) ? "takeover-header" : "";
    newBatch["takeOverBatchStatus"] = (holdStatus || loginSameStatus);
    newBatch["holdStatus"] = holdStatus;

    if (this.allBatch.length === 0) {
      this.allBatch.push(newBatch);
    } else {
      availableFlag = this.checkItemAvailableInBatch(this.allBatch);
    }


    if (availableFlag) {
      this.allBatch.push(newBatch);
      this.clearErrorMessage(action, instance, actionService);
      this.renderBatchTemplates(newBatchItem, newBatch, instance, actionService, true);
    } else {
      let processAction = [
        {
          "type": "updateComponent",
          "config": {
            "key": "errorTitleUUID",
            "properties": {
              "titleValue": "Previous Batch Don't have any unit, Please add atleast one unit",
              "isShown": true
            }
          }
        }
      ]
      this.executeActions(processAction, instance, actionService)
    }


  }

  addUnitToBatch(action, instance, arg2) {
    let data = this.contextService.getDataByString(action.config.data);
    let index = this.contextService.getDataByString(action.config.index);

    let allBatch = [];
    allBatch = this.contextService.getDataByString("#allBatchData");
    if (data && data !== null) {
      let filteredIndex;
      filteredIndex = allBatch[index];

      //format data as per getActiveBatch.
      let unit = {
        batchId: filteredIndex.batchName,
        batchDetailsReponse: data.batchItem,
        condition: "",
        selectedRc: "",
        notes: ""
      }

      filteredIndex.batchUnits.push(unit)

      // Update Old data in array of batches
      allBatch.splice(index, 1, filteredIndex);
      // filteredIndex.batchUnits.push(data[0])
      // this.messageSubject.next(data);
      this.unitTableDataUpdate.next(allBatch);
      this.clearErrorMessage(action, instance, arg2);
    }
  }

  getBatchUnitDetail(action, instance, actionService) {
    let unitName = action.config.batchName;
    let wcId = this.contextService.getDataByString("#verifoneWCResultData");
    if(wcId == null) {
      wcId = 0;
    }
    let processActions = [
      {
        "type": "microservice",
        "config": {
          "microserviceId": "validateBatchItem",
          "requestMethod": "get",
          "params": {
            "locationId": "#userSelectedLocation",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "processId": "#selectedHomeMenuId",
            "appId": "#selectedHomeMenuId",
            "userName": "#loginUUID.username",
            "serialNo": "#unitItem.value",
            "workCenterId": "#verifoneWCResultData"
          },
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "validateBatchItem",
                  "data": "responseData"
                }
              },
              {
                "type": "condition",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": "#validateBatchItem.isValid",
                  "rhs": "1"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "microservice",
                        "config": {
                          "microserviceId": "getUnitHandsOnDetails",
                          "requestMethod": "get",
                          "params": {
                            "itemId": "#validateBatchItem.itemId",
                            "locationId": "#userSelectedLocation",
                            "contractId": "#userSelectedContract",
                            "processId": "#selectedHomeMenuId",
                            "workCenterId": wcId,
                            "appId": "#selectedHomeMenuId",
                            "userName": "#loginUUID.username",
                            "clientId": "#userSelectedClient"
                          }
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "condition",
                                "config": {
                                  "operation": "isEqualTo",
                                  "lhs": "#getUnitHandsOnDetails.0.action",
                                  "rhs": "takeover"
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    // "action":[]
                                    "actions": this.getAddInfoCodeApiJson("", this.getChangePartApiJson(unitName))
                                  },
                                  "onFailure": {
                                    "actions": [
                                      {
                                        "type": "condition",
                                        "config": {
                                          "operation": "isEqualTo",
                                          "lhs": "#getUnitHandsOnDetails.0.action",
                                          "rhs": "release"
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            // "action":[]
                                            "actions": this.getReleaseApiJson("", this.getChangePartApiJson(unitName))
                                          },
                                          "onFailure": {
                                            "actions": [
                                              {
                                                "type": "condition",
                                                "config": {
                                                  "operation": "isEqualTo",
                                                  "lhs": "#getUnitHandsOnDetails.0.action",
                                                  "rhs": "time-in"
                                                },
                                                "responseDependents": {
                                                  "onSuccess": {
                                                    // "action":[]
                                                    "actions": this.getTimeinApiJson("", this.getChangePartApiJson(unitName))
                                                  },
                                                  "onFailure": {
                                                    "actions": [
                                                      {
                                                        "type": "condition",
                                                        "config": {
                                                          "operation": "isEqualTo",
                                                          "lhs": "#getUnitHandsOnDetails.0.action",
                                                          "rhs": "release + time-in"
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            // "action":[]
                                                            "actions": this.getReleaseApiJson("", this.getTimeinApiJson("", this.getChangePartApiJson(unitName)))
                                                          },
                                                          "onFailure": {
                                                            "actions": [
                                                              {
                                                                "type": "condition",
                                                                "config": {
                                                                  "operation": "isEqualTo",
                                                                  "lhs": "#getUnitHandsOnDetails.0.action",
                                                                  "rhs": "none"
                                                                },
                                                                "responseDependents": {
                                                                  "onSuccess": {
                                                                    "actions": this.getChangePartApiJson(unitName)
                                                                  },
                                                                  "onFailure": {
                                                                    "actions": [
                                                                      {
                                                                        "type": "condition",
                                                                        "config": {
                                                                          "operation": "isEqualTo",
                                                                          "lhs": "#getUnitHandsOnDetails.0.action",
                                                                          "rhs": "storage-release"
                                                                        },
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": this.getStroageRelease("", this.getChangePartApiJson(unitName))
                                                                          },
                                                                          "onFailure": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "condition",
                                                                                "config": {
                                                                                  "operation": "isEqualTo",
                                                                                  "lhs": "#getUnitHandsOnDetails.0.action",
                                                                                  "rhs": "storage-release + time-in"
                                                                                },
                                                                                "responseDependents": {
                                                                                  "onSuccess": {
                                                                                    "actions": this.getStroageRelease("", this.getTimeinApiJson("", this.getChangePartApiJson(unitName)))
                                                                                  },
                                                                                  "onFailure": {
                                                                                    "actions": [
                                                                                      {
                                                                                        "type": "context",
                                                                                        "config": {
                                                                                          "requestMethod": "add",
                                                                                          "key": "errorNoHandsonaction",
                                                                                          "data": "No Hand on Action Found"
                                                                                        }
                                                                                      },
                                                                                      {
                                                                                        "type": "updateComponent",
                                                                                        "config": {
                                                                                          "key": "errorTitleUUID",
                                                                                          "properties": {
                                                                                            "titleValue": "#errorNoHandsonaction",
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
                        "type": "updateComponent",
                        "config": {
                          "key": "errorTitleUUID",
                          "properties": {
                            "titleValue": "#validateBatchItem.statusMsg",
                            "isShown": true
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
    ];
    setTimeout(() => {
      this.executeActions(processActions, instance, actionService);
    }, 200)
  }

  setVerifoneFailureFlexFieldForDropdown(action, instance, actionService) {

    let FlexFieldData = this.contextService.getDataByKey("verifoneFailureFlexFieldData");
    let temperDescriptionFFID = this.contextService.getDataByKey("getReferenceDataKeys")['subProcess']['VERIFONE']['temperDescriptionCodeId'];
    let commonFailureFFID = this.contextService.getDataByKey("getReferenceDataKeys")['subProcess']['VERIFONE']['commonFailureFFID'];


    let temperDescriptionDropDownData = [];
    let commonFailureDropDownData = [];
    for (let i = 0; i < FlexFieldData.length; i++) {
      if (FlexFieldData[i]['flexFieldId'] === temperDescriptionFFID) {
        temperDescriptionDropDownData.push({ code: FlexFieldData[i]['flexFieldValue'], value: FlexFieldData[i]['flexFieldValue'] });
      }
      if (FlexFieldData[i]['flexFieldId'] === commonFailureFFID) {
        commonFailureDropDownData.push({ code: FlexFieldData[i]['flexFieldValue'], value: FlexFieldData[i]['flexFieldValue'] });
      }
    }

    this.contextService.addToContext("verifoneRecordFaultsDescUUID", temperDescriptionDropDownData);
    this.contextService.addToContext("CommonFailureDropdownUUID", commonFailureDropDownData);

    let processActions = [
      {
        "type": "updateComponent",
        "config": {
          "key": "CommonFailureDropdownUUID",
          "dropDownProperties": {
            "options": commonFailureDropDownData
          }
        }
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "verifoneRecordFaultsDescUUID",
          "dropDownProperties": {
            "options": temperDescriptionDropDownData
          }
        }
      }
    ]

    this.executeActions(processActions, instance, actionService);
  }

  checkItemAvailableInBatch(allBatch) {
    let flag = true;
    for (let i = 0; i < allBatch.length; i++) {
      if (allBatch[i]['batchUnits'] && allBatch[i]['batchUnits'].length == 0) {
        flag = false;
        break;
      }
    }
    return flag;
  }

  clearErrorMessage(action, instance, actionService) {
    let processAction = [
      {
        "type": "updateComponent",
        "config": {
          "key": "errorTitleUUID",
          "properties": {
            "titleValue": "",
            "isShown": true
          }
        }
      }
    ]
    this.executeActions(processAction, instance, actionService)
  }

  workInstructionOpenStatus() {
    this.workInstructionOpened.next({ "opened": true });
  }

  workInstructionCloseStatus() {
    this.workInstructionOpened.next({ "opened": false });
  }

  getCurrentBatch() {
    let wcData = this.contextService.getDataByKey("getBatchWC");
    let currentWcId = this.contextService.getDataByKey("verifoneWCResultData");
    let wcName = "";
    for (let i = 0; i < wcData.length; i++) {
      if (wcData[i]['workcenterId'] == currentWcId) {
        wcName = wcData[i]['workcenterName'];
        break;
      }
    }
    this.contextService.addToContext("currentWCName", wcName);
  }

  renderBatchTemplates(unitBatchData, newBatch, instance, actionService, expand) {
    let expandStatus = expand;
    let selectedBatchName = this.contextService.getDataByString("#verifoneWCResultValue");
    console.log(selectedBatchName)
    let username = this.contextService.getDataByKey('userAccountInfo')['PersonalDetails']['USERID'];
    let failPanelExpandId = localStorage.getItem(username + 'failPanelExpandId');
    if (failPanelExpandId == "batch-panel-" + newBatch['batchName']) {
      expandStatus = true;
    }
    if (document.querySelectorAll(".batch-panel-" + newBatch['batchIndex']).length < 1) {
      let processActions = [
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data": {
              "ctype": "taskPanel",
              "uuid": "softwareProcessUUID",
              "updateUUID": true,
              "isblueBorder": true,
              "uniqueUUID": true,
              "columnWiseTitle": true,
              "header": {
                "svgIcon": "description",
                "css": "color:black",
                "status": "",
                "statusIcon": "",
                "statusClass": "",
                "class": "mat-expansion-panel-header-title heading2 "
              },
              "headerTitleLabels": [
                unitBatchData,
                "",
                "",
                ""
              ],
              "headerTitleValues": [
                "#userSelectedPartName",
                "",
                "",
                ""
              ],
              "inputClasses": [
                "",
                ""
              ],
              "expanded": expandStatus,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "taskpanelfooterclass": "d-flex justify-content-between",
              "panelClass": "batch-panel-" + newBatch['batchIndex'],
              "taskPanelHeaderClass": newBatch["headerColor"],
              "visibility": false,
              "hooks": [
                {
                  "type": "microservice",
                  "config": {
                    "microserviceId": "getTimeOutResultCodes",
                    "isLocal": false,
                    "LocalService": "assets/Responses/repairMockRamResponse.json",
                    "requestMethod": "post",
                    "body": {
                      "opResult": "PASS",
                      "serialNumber": "#unitItem.value",
                      "customerDamagePresent": "false",
                      "workCenter": "#verifoneWCResultValue",
                      "sdmUserName": "#loginUUID.username",
                      "sdmPassword": "#loginUUID.password",
                      "debugTest": "false",
                      "customerDamageResult": "present"
                    }
                  },
                  "hookType": "afterInit",
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "getTimeOutPassResultCodes",
                            "data": "responseData"
                          },
                          "hookType": "afterInit"
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
                  "config": {
                    "microserviceId": "getTimeOutResultCodes",
                    "isLocal": false,
                    "LocalService": "assets/Responses/repairMockRamResponse.json",
                    "requestMethod": "post",
                    "body": {
                      "opResult": "FAIL",
                      "serialNumber": "#unitItem.value",
                      "customerDamagePresent": "false",
                      "workCenter": "#verifoneWCResultValue",
                      "sdmUserName": "#loginUUID.username",
                      "sdmPassword": "#loginUUID.password",
                      "debugTest": "false",
                      "customerDamageResult": "present"
                    }
                  },
                  "hookType": "afterInit",
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "getTimeOutFailResultCodes",
                            "data": "responseData"
                          },
                          "hookType": "afterInit"
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
                  "config": {
                    "microserviceId": "getTimeOutResultCodes",
                    "isLocal": false,
                    "LocalService": "assets/Responses/repairMockRamResponse.json",
                    "requestMethod": "post",
                    "body": {
                      "opResult": "HOLD",
                      "serialNumber": "#unitItem.value",
                      "customerDamagePresent": "false",
                      "workCenter": "#verifoneWCResultValue",
                      "sdmUserName": "#loginUUID.username",
                      "sdmPassword": "#loginUUID.password",
                      "debugTest": "false",
                      "customerDamageResult": "present"
                    }
                  },
                  "hookType": "afterInit",
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "getTimeOutHoldResultCodes",
                            "data": "responseData"
                          },
                          "hookType": "afterInit"
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
              "items": [
                {
                  "ctype": "label",
                  "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pulvinar condimentum vehicula.",
                  "labelClass": "body-italic"
                },
                {
                  "ctype": "batchProcessTable",
                  "uuid": "batchProcessUUID",
                  "formGroupClass": "batch-action-buttons body2 ",
                  "labelPosition": "before",
                  "name": "moroccanCEMark",
                  "batchData": newBatch,
                  "conditionEvent": this.returnEvent(selectedBatchName),
                  "names": [
                    "text1",
                    "text2",
                    "text3"
                  ],
                  "options": [
                    {
                      "bgcolor": "background-red",
                      "color": "white",
                      "text": "Fail",
                      "value": "Fail"
                    },
                    {
                      "bgcolor": "background-blue",
                      "color": "white",
                      "text": "Hold",
                      "value": "Hold"
                    },
                    {
                      "bgcolor": "background-blue",
                      "color": "white",
                      "text": "Pass",
                      "value": "Pass"
                    }
                  ],
                  "validations": [],
                  "label": "",
                  "hooks": [
                  ],
                  "actions": this.returnActionForFailClick(selectedBatchName, newBatch),
                  "required": true,
                  "submitable": true
                }

              ],
              "footer": []
            }
          },
          "eventSource": "click"
        }
      ];
      // console.log("this.allBatch--", this.allBatch);
      this.contextService.addToContext("allBatchData", this.allBatch);
      this.executeActions(processActions, instance, actionService);
    }
    if (failPanelExpandId == "batch-panel-" + newBatch['batchName']) {
      let elementList = document.getElementsByClassName("batch-panel-" + newBatch['batchName']);
      if (elementList && elementList[0]) {
        const element = elementList[0] as HTMLElement;
        element.scrollIntoView({ behavior: 'smooth' });
        localStorage.setItem(username + 'failPanelExpandId', "");
      }
    }
  }

  getloadStationUnitFlexField(action: any, instance: any) {
    // PCB_PN,PCB_SN,REW_INSTR,DATE_CODE,ANALYSIS,REFURB
    let flexdata = action.config.flexdata;
    let loadStationUnitFlexFieldArray = [];
    if (flexdata.Common_Failure && flexdata.Common_Failure.startsWith('#'))
      flexdata.Common_Failure = this.contextService.getDataByString(
        flexdata.Common_Failure
      );
    if (flexdata.Tamper_Description && flexdata.Tamper_Description.startsWith('#'))
      flexdata.Tamper_Description = this.contextService.getDataByString(
        flexdata.Tamper_Description
      );
    if (flexdata.FW_Power_Problem && flexdata.FW_Power_Problem.startsWith('#'))
      flexdata.FW_Power_Problem = this.contextService.getDataByString(
        flexdata.FW_Power_Problem
      );
    if (flexdata.Contactless_Failure && flexdata.Contactless_Failure.startsWith('#'))
      flexdata.Contactless_Failure = this.contextService.getDataByString(
        flexdata.Contactless_Failure
      );
    if (flexdata.Tampered && flexdata.Tampered.startsWith('#'))
      flexdata.Tampered = this.contextService.getDataByString(
        flexdata.Tampered
      );

    if (flexdata.Common_Failure && flexdata.Common_Failure !== '') {
      let CommonFailure = {
        name: 'Common Failure',
        value: flexdata.Common_Failure,
      };
      loadStationUnitFlexFieldArray.push(CommonFailure);
    }

    if (flexdata.Tamper_Description && flexdata.Tamper_Description !== '') {
      let TamperDescription = {
        name: 'Tamper Description',
        value: flexdata.Tamper_Description,
      };
      loadStationUnitFlexFieldArray.push(TamperDescription);
    }

    if (flexdata.FW_Power_Problem && flexdata.FW_Power_Problem !== '') {
      let FWPowerProblem = {
        name: 'FW Power Problem',
        value: flexdata.FW_Power_Problem,
      };
      loadStationUnitFlexFieldArray.push(FWPowerProblem);
    }
    if (flexdata.Contactless_Failure && flexdata.Contactless_Failure !== '') {
      let ContactlessFailure = {
        name: 'Contactless Failure',
        value: flexdata.Contactless_Failure,
      };
      loadStationUnitFlexFieldArray.push(ContactlessFailure);
    }

    if (flexdata.Tampered && flexdata.Tampered !== '') {
      let Tamperedobj = {
        name: 'Tampered',
        value: flexdata.Tampered,
      };
      loadStationUnitFlexFieldArray.push(Tamperedobj);
    }
    this.contextService.addToContext(action.config.key, loadStationUnitFlexFieldArray);
  }

  getProcessActionOnBatch(batchData, instance, actionService) {
    let allBatch = [];
    let filteredBatch;
    let filterBatchData = [];
    let flexFieldObj;
    let splitFlexFieldValue;
    allBatch = this.contextService.getDataByString("#allBatchData");
    let selectedBatchName = this.contextService.getDataByString("#verifoneWCResultValue");

    // filteredBatch = allBatch[batchData.batchIndex];
    if (this.noRoute.length > 0 && this.noRoute.indexOf(selectedBatchName) > -1) {
      filterBatchData = batchData.batchUnits.filter(e => (e.condition == "Hold" || e.condition == "Pass" || e.condition == "Fail") && e.selectedRc != "");
    } else {
      filterBatchData = batchData.batchUnits.filter(e => (e.condition == "Hold" || e.condition == "Pass") && e.selectedRc != "");
    }
    console.log(filterBatchData);

    let checkKeyingBatch = this.contextService.getDataByKey("currentWC");
    if (filterBatchData) {
      filterBatchData && filterBatchData.forEach((element) => {
        splitFlexFieldValue = element.batchId.split(":")[2];
      })
      this.checkKeyingWC();
      if (this.checkKeyingWC()) {
        flexFieldObj =
        {
          "flexField": [
            {
              "name": "KLD_HSM_PINPAD_SN",
              "value": splitFlexFieldValue
            }
          ]
        }
      }
    }
   
     //let currentScreen = this.contextService.getDataByKey("currentWC");
    filterBatchData && filterBatchData.forEach((element, index) => {
      let allActiveBatch = [
        {
          "type": "microservice",
          "hookType": "afterInit",
          "config": {
            "microserviceId": "getActiveBatch",
            "requestMethod": "get",
            "params": {
              "locationId": "#userSelectedLocation",
              "clientId": "#userSelectedClient",
              "contractId": "#userSelectedContract",
              "processId": "#selectedHomeMenuId",
              "appId": "#selectedHomeMenuId",
              "userName": "#loginUUID.username",
              "workCenterId": "#verifoneWCResultData"
            }
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "newActiveBatchesData",
                    "data": "responseData"
                  },
                  "eventSource": "click"
                },
                {
                  "type": "updateBatchArray",
                  "config": {
                    "batchData": batchData,
                    "response": "#newActiveBatchesData",
                    "actionToPerform": "Success",
                    "bcn": element.batchDetailsReponse.itemBcn,
                    "allBatch": "#allBatchData"
                  }
                },
                {
                  "type": "keyingRenderTemplate",
                  "hookType": "afterInit", 
                }               
              ]
            },
            "onFailure": {
              "actions": [
                {
                  "type": "keyingRenderTemplate",
                  "hookType": "afterInit",
                }
              ]
            }
          }
        }
      ]
      if (element.condition == "Hold" && element.selectedRc != "") {
        let changePart = [
          {
            "type": "microservice",
            "config": {
              "microserviceId": "performChangePart",
              "requestMethod": "post",
              "body": {
                "changeSerialNumberRequest": {
                  "bcn": element.batchDetailsReponse.itemBcn,
                  "mustBeOnHoldInd": 0,
                  "releaseIfHoldInd": 0,
                  "mustBeTimedInInd": 1,
                  "notes": element.notes == "" ? "test123" : element.notes,
                  "inventoryAttributes": {
                    "flexField": [
                      {
                        "name": "UNIT_BATCH_ID",
                        "value": "NA"
                      }
                    ]
                  }
                },
                "userName": "#loginUUID.username",
                "password": "#loginUUID.password",
                "ip": "::1",
                "callSource": "FrontEnd",
                "apiUsageLocationName": "#userSelectedLocationName",
                "apiUsageClientName": "#userSelectedClientName"
              },
              "toBeStringified": true
            },
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "microservice",
                    "config": {
                      "microserviceId": "holdBCN",
                      "requestMethod": "post",
                      "body": {
                        "location": "#userSelectedLocationName",
                        "workcenter": "#verifoneWCResultValue",
                        "bcn": element.batchDetailsReponse.itemBcn,
                        "holdcode": element.selectedRc,
                        "notes": element.notes == "" ? "test123" : element.notes,
                        "userName": "#loginUUID.username",
                        "password": "#loginUUID.password"

                      },
                      "toBeStringified": true
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": index + 1 == filterBatchData.length ? allActiveBatch : []
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
                            "type": "updateBatchArray",
                            "config": {
                              "batchData": batchData,
                              "response": "#errorDisp",
                              "actionToPerform": "Fail",
                              "bcn": element.batchDetailsReponse.itemBcn,
                              "allBatch": "#allBatchData"
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
                    "type": "updateBatchArray",
                    "config": {
                      "batchData": batchData,
                      "response": "#errorDisp",
                      "actionToPerform": "Fail",
                      "bcn": element.batchDetailsReponse.itemBcn,
                      "allBatch": "#allBatchData"
                    }
                  }
                ]
              }
            }
          }
        ]
        this.executeActions(changePart, instance, actionService);
      }

      if (element.condition == "Pass" && element.selectedRc != "") {
        let timeout = [
          {
            "type": "microservice",
            "config": {
              "microserviceId": "performChangePart",
              "requestMethod": "post",
              "body": {
                "changeSerialNumberRequest": {
                  "bcn": element.batchDetailsReponse.itemBcn,
                  "mustBeOnHoldInd": 0,
                  "releaseIfHoldInd": 0,
                  "mustBeTimedInInd": 1,
                  "notes": element.notes == "" ? "test123" : element.notes,
                  "inventoryAttributes": {
                    "flexField": [
                      {
                        "name": "UNIT_BATCH_ID",
                        "value": "NA"
                      }
                    ]
                  }
                },
                "userName": "#loginUUID.username",
                "password": "#loginUUID.password",
                "ip": "::1",
                "callSource": "FrontEnd",
                "apiUsageLocationName": "#userSelectedLocationName",
                "apiUsageClientName": "#userSelectedClientName"
              },
              "toBeStringified": true
            },
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "microservice",
                    "config": {
                      "microserviceId": "performTimeOut",
                      "requestMethod": "post",
                      "body": {
                        "timeOutRequest": {
                          "location": "#userSelectedLocationName",
                          "bcn": element.batchDetailsReponse.itemBcn,
                          "workCenter": "#verifoneWCResultValue",
                          "password": "#loginUUID.password",
                          "warrantyInd": "false",
                          "notes": element.notes == "" ? "." : element.notes,
                          "resultCode": element.selectedRc,
                          "workCenterFlexFieldList":flexFieldObj
                        },
                        "modifyWarranty": 0,
                        "timeOutType": "ProcessImmediate",
                        "clientName": "#userSelectedClientName",
                        "contractName": "#userSelectedContractName",
                        "userName": "#loginUUID.username",
                        "userPass": "#loginUUID.password",
                        "ip": "::1",
                        "callSource": "FrontEnd",
                        "apiUsage_LocationName": "#userSelectedLocationName",
                        "apiUsage_ClientName": "#userSelectedClientName"
                      },
                      "toBeStringified": true,
                      "removeUndefinedFields": [
                        {
                          "KeyName": "notes",
                          "KeyValue": element.notes == "" ? "." : element.notes
                        }
                      ]
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": index + 1 == filterBatchData.length ? allActiveBatch : []
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
                            "type": "updateBatchArray",
                            "config": {
                              "batchData": batchData,
                              "response": "#errorDisp",
                              "actionToPerform": "Fail",
                              "bcn": element.batchDetailsReponse.itemBcn,
                              "allBatch": "#allBatchData"
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
                    "type": "updateBatchArray",
                    "config": {
                      "batchData": batchData,
                      "response": "#errorDisp",
                      "actionToPerform": "Fail",
                      "bcn": element.batchDetailsReponse.itemBcn,
                      "allBatch": "#allBatchData"
                    }
                  }
                ]
              }
            }
          }
        ]
        this.executeActions(timeout, instance, actionService);
      }

      if (element.condition == "Fail" && element.selectedRc != "") {
        let failTimeout = [
          {
            "type": "microservice",
            "config": {
              "microserviceId": "performChangePart",
              "requestMethod": "post",
              "body": {
                "changeSerialNumberRequest": {
                  "bcn": element.batchDetailsReponse.itemBcn,
                  "mustBeOnHoldInd": 0,
                  "releaseIfHoldInd": 0,
                  "mustBeTimedInInd": 1,
                  "notes": element.notes == "" ? "NA" : element.notes,
                  "inventoryAttributes": {
                    "flexField": [
                      {
                        "name": "UNIT_BATCH_ID",
                        "value": "NA"
                      }
                    ]
                  }
                },
                "userName": "#loginUUID.username",
                "password": "#loginUUID.password",
                "ip": "::1",
                "callSource": "FrontEnd",
                "apiUsageLocationName": "#userSelectedLocationName",
                "apiUsageClientName": "#userSelectedClientName"
              },
              "toBeStringified": true
            },
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "microservice",
                    "config": {
                      "microserviceId": "performTimeOut",
                      "requestMethod": "post",
                      "body": {
                        "timeOutRequest": {
                          "location": "#userSelectedLocationName",
                          "bcn": element.batchDetailsReponse.itemBcn,
                          "workCenter": "#verifoneWCResultValue",
                          "password": "#loginUUID.password",
                          "warrantyInd": "false",
                          "notes": element.notes == "" ? "." : element.notes,
                          "resultCode": element.selectedRc,
                          "workCenterFlexFieldList":flexFieldObj
                        },
                        "modifyWarranty": 0,
                        "timeOutType": "ProcessImmediate",
                        "clientName": "#userSelectedClientName",
                        "contractName": "#userSelectedContractName",
                        "userName": "#loginUUID.username",
                        "userPass": "#loginUUID.password",
                        "ip": "::1",
                        "callSource": "FrontEnd",
                        "apiUsage_LocationName": "#userSelectedLocationName",
                        "apiUsage_ClientName": "#userSelectedClientName"
                      },
                      "toBeStringified": true,
                      "removeUndefinedFields": [
                        {
                          "KeyName": "notes",
                          "KeyValue": element.notes == "" ? "." : element.notes
                        }
                      ]
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": index + 1 == filterBatchData.length ? allActiveBatch : []
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
                            "type": "updateBatchArray",
                            "config": {
                              "batchData": batchData,
                              "response": "#errorDisp",
                              "actionToPerform": "Fail",
                              "bcn": element.batchDetailsReponse.itemBcn,
                              "allBatch": "#allBatchData"
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
                    "type": "updateBatchArray",
                    "config": {
                      "batchData": batchData,
                      "response": "#errorDisp",
                      "actionToPerform": "Fail",
                      "bcn": element.batchDetailsReponse.itemBcn,
                      "allBatch": "#allBatchData"
                    }
                  }
                ]
              }
            }
          }
        ]
        this.executeActions(failTimeout, instance, actionService);
      }
    });
  }

  updateBatchArray(action, instance, actionService) {
    let batchData;
    let allBatch;
    let message;
    let actionToPerform;
    let bcn;

    if (action.config.batchData && !(action.config.batchData instanceof Object) && action.config.batchData.startsWith('#')) {
      batchData = this.contextService.getDataByString(action.config.batchData);
    } else {
      batchData = action.config.batchData;
    }

    if (action.config.allBatch && action.config.allBatch.startsWith('#')) {
      allBatch = this.contextService.getDataByString(action.config.allBatch);
    } else {
      allBatch = action.config.allBatch;
    }

    if (action.config.response && action.config.response.startsWith('#')) {
      message = this.contextService.getDataByString(action.config.response);
    } else {
      message = action.config.response;
    }

    if (action.config.actionToPerform && action.config.actionToPerform instanceof String && action.config.actionToPerform.startsWith('#')) {
      actionToPerform = this.contextService.getDataByString(action.config.actionToPerform);
    } else {
      actionToPerform = action.config.actionToPerform;
    }

    if (action.config.bcn && action.config.bcn instanceof String && action.config.bcn.startsWith('#')) {
      bcn = this.contextService.getDataByString(action.config.bcn);
    } else {
      bcn = action.config.bcn;
    }

    if (batchData) {
      let index = batchData.batchIndex;
      let item = allBatch[index];

      if (actionToPerform == "Fail") {
        item.batchUnits.forEach(element => {
          if (element.batchDetailsReponse.itemBcn === bcn) {
            element.message = message;
          }
        });

        //may be batch need to change and update the context veriable for allbatch.
      } else if (actionToPerform == "Success") {
        let allActiveBatch = allBatch;
        let newAllActiveBatch: any = this.formatActiveBatchData(message);
        newAllActiveBatch.forEach((element, i) => {
          let title = element.batchName;
          let batch = allActiveBatch.filter(e => e.batchName == title);
          element.batchUnits.forEach(item => {
            if (batch && batch[0]) {
              let unit = batch[0].batchUnits.filter(e => e.batchDetailsReponse.itemBcn === item.batchDetailsReponse.itemBcn);
              item.condition = unit[0].condition;
            }
          });
        });
      }
    }
    this.contextService.addToContext("allBatchData", this.allBatch);
    this.batchPopup = "display:none";
    this.unitTableDataUpdate.next(allBatch);
  }

  checkUserLoginBatch(batchId, batchUnits) {
    let flag = { "holdFlag": false, "loginSame": false };
    let holdFlag = false;
    let currentUserName = this.contextService.getDataByKey("userAccountInfo")["PersonalDetails"]["USERID"];
    let batchUserName = batchId.split(":")[0];
    for (let i = 0; i < batchUnits.length; i++) {
      if (batchUnits[i] && batchUnits[i]['batchDetailsReponse'] && batchUnits[i]['batchDetailsReponse']["onHold"] && batchUnits[i]['batchDetailsReponse']["onHold"] !== "0") {
        holdFlag = true;
        break;
      }
    }

    if (currentUserName.toLowerCase() !== batchUserName.toLowerCase()) {
      flag["loginSame"] = true;
    }
    if (holdFlag) {
      flag["holdFlag"] = true;
    }
    return flag;
    //userAccountInfo.PersonalDetails.USERID
  }

  createNewBatchFromTakeOver(batchData, instance, actionService) {
    console.log("batchData==", batchData);    
    let batchKey = '';
    if (batchData) {
      let batchUnits = batchData['batchUnits'];
      if (batchUnits && batchUnits.length > 0) {
        let batchId = batchUnits[0]['batchId'];
        let checkKeyingBatch = this.contextService.getDataByKey("currentWC");
        if(checkKeyingBatch && checkKeyingBatch == 'CA-Keying') {
          batchKey = batchId.split(":")[2];
        }else if(checkKeyingBatch && checkKeyingBatch == 'ITALY-Keying') {
          batchKey = batchId.split(":")[2];
        }else if(checkKeyingBatch && checkKeyingBatch == 'L2RKL-Keying') {
          batchKey = batchId.split(":")[2];
        }else if(checkKeyingBatch && checkKeyingBatch == 'P2PE-Keying') {
          batchKey = batchId.split(":")[2];
        }else if(checkKeyingBatch && checkKeyingBatch == 'TMS-Keying') {
          batchKey = batchId.split(":")[2];
        }else if(checkKeyingBatch && checkKeyingBatch == 'TOTAL-Keying') {
          batchKey = batchId.split(":")[2];
        }else if(checkKeyingBatch && checkKeyingBatch == 'VERIINIT') {
          batchKey = batchId.split(":")[2];
        }else if(checkKeyingBatch && checkKeyingBatch == 'HERD-Keying') {
          batchKey = batchId.split(":")[2];
        }else if(checkKeyingBatch && checkKeyingBatch == 'IDS-Keying') {
          batchKey = batchId.split(":")[2];
        }else if(checkKeyingBatch && checkKeyingBatch == 'ITALYPARA-Keying') {
          batchKey = batchId.split(":")[2];
        }else if(checkKeyingBatch && checkKeyingBatch == 'OSLOADING-Keying') {
          batchKey = batchId.split(":")[2];
        }else if(checkKeyingBatch && checkKeyingBatch == 'PERSO-Keying') {
          batchKey = batchId.split(":")[2];
        }else if(checkKeyingBatch && checkKeyingBatch == 'PARA-Keying') {
          batchKey = batchId.split(":")[2];
        }else if(checkKeyingBatch && checkKeyingBatch == 'UXPARA-Keying') {
          batchKey = batchId.split(":")[2];
        }else if(checkKeyingBatch && checkKeyingBatch == 'VHQ-Keying') {
          batchKey = batchId.split(":")[2];
        }
      }
    }
    let newBatchIdProcess = [
      {
        "type": "microservice",
        "config": {
          "microserviceId": "getActiveBatchIds",
          "requestMethod": "get",
          "params": {
            "locationId": "#userSelectedLocation",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "processId": "#selectedHomeMenuId",
            "appId": "#selectedHomeMenuId",
            "userName": "#loginUUID.username",
            "workCenterId": "#verifoneWCResultData",
            "key": batchKey,
            "keyWc": "",
            "workCenterName": "#verifoneWCResultValue"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "newBatchItemDetails",
                  "data": "responseData"
                }
              },
              {
                "type": "handleTakeoverBatchData",
                "config": {
                  "data": batchData
                }
              }
            ]
          },
          "onFailure": {
            "actions": []
          }
        }
      }
    ];
    this.executeActions(newBatchIdProcess, instance, actionService);
  }

  releaseBatchFromTakeOver(batchData, instance, actionService) {
    if (batchData && batchData["holdStatus"]) {
      for (let i = 0; i < batchData['batchUnits'].length; i++) {
        let unitBCN = batchData['batchUnits'][i]['batchDetailsReponse']['itemBcn'];
        let holdBatchProcess = [
          {
            "type": "microservice",
            "config": {
              "microserviceId": "releaseBCN",
              "requestMethod": "post",
              "body": {
                "location": "#userSelectedLocationName",
                "bcn": unitBCN,
                "userName": "#loginUUID.username",
                "workcenter": "#verifoneWCResultValue",
                "password": "#loginUUID.password"
              }
            },
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "microservice",
                    "hookType": "afterInit",
                    "config": {
                      "microserviceId": "getActiveBatch",
                      "requestMethod": "get",
                      "params": {
                        "locationId": "#userSelectedLocation",
                        "clientId": "#userSelectedClient",
                        "contractId": "#userSelectedContract",
                        "processId": "#selectedHomeMenuId",
                        "appId": "#selectedHomeMenuId",
                        "userName": "#loginUUID.username",
                        "workCenterId": "#verifoneWCResultData"
                      }
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "context",
                            "hookType": "afterInit",
                            "config": {
                              "requestMethod": "add",
                              "key": "allBatchData",
                              "data": []
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "activeBatchesData",
                              "data": "responseData"
                            },
                            "hookType": "afterInit"
                          },
                          {
                            "type": "getActiveBatchProcess",
                            "hookType": "afterInit",
                            "config": {
                              "svgIcon": "replace",
                              "text": "Replace",
                              "processType": "replace"
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
                              "key": "errorPart",
                              "data": "responseData"
                            }
                          },
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorPart",
                                "isShown": true
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
                      "key": "errorPart",
                      "data": "responseData"
                    }
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "errorTitleUUID",
                      "properties": {
                        "titleValue": "#errorPart",
                        "isShown": true
                      }
                    }
                  }
                ]
              }
            }
          }
        ];
        this.executeActions(holdBatchProcess, instance, actionService);
      }

    }
  }

  handleTakeoverBatchData(action, instance, actionService) {    
    let newBatchId = '';
    let checkKeyingBatch = this.contextService.getDataByKey("currentWC");
    if(checkKeyingBatch && checkKeyingBatch == 'CA-Keying') {
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    }else if(checkKeyingBatch && checkKeyingBatch == 'ITALY-Keying'){
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    }else if(checkKeyingBatch && checkKeyingBatch == 'L2RKL-Keying'){
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    }else if(checkKeyingBatch && checkKeyingBatch == 'P2PE-Keying'){
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    } else if(checkKeyingBatch && checkKeyingBatch == 'TMS-Keying'){
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    }else if(checkKeyingBatch && checkKeyingBatch == 'TOTAL-Keying'){
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    }else if(checkKeyingBatch && checkKeyingBatch == 'VERIINIT'){
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    }else if(checkKeyingBatch && checkKeyingBatch == 'HERD-Keying'){
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    }else if(checkKeyingBatch && checkKeyingBatch == 'IDS-Keying'){
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    }else if(checkKeyingBatch && checkKeyingBatch == 'ITALYPARA-Keying'){
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    }else if(checkKeyingBatch && checkKeyingBatch == 'OSLOADING-Keying'){
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    }else if(checkKeyingBatch && checkKeyingBatch == 'PARA-Keying'){
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    }else if(checkKeyingBatch && checkKeyingBatch == 'PERSO-Keying'){
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    }else if(checkKeyingBatch && checkKeyingBatch == 'UXPARA-Keying'){
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    }else if(checkKeyingBatch && checkKeyingBatch == 'VHQ-Keying'){
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchIdKey"];
    }else {
      newBatchId = this.contextService.getDataByKey("newBatchItemDetails")["newBatchId"];
    }
    let batchKey = '';
    if(checkKeyingBatch && checkKeyingBatch == 'CA-Keying') {
      batchKey = newBatchId.split(":")[2];
    }else if(checkKeyingBatch && checkKeyingBatch == 'ITALY-Keying') {
      batchKey = newBatchId.split(":")[2];
    }else if(checkKeyingBatch && checkKeyingBatch == 'L2RKL-Keying') {
      batchKey = newBatchId.split(":")[2];
    }else if(checkKeyingBatch && checkKeyingBatch == 'P2PE-Keying') {
      batchKey = newBatchId.split(":")[2];
    }else if(checkKeyingBatch && checkKeyingBatch == 'TMS-Keying') {
      batchKey = newBatchId.split(":")[2];
    }else if(checkKeyingBatch && checkKeyingBatch == 'TOTAL-Keying') {
      batchKey = newBatchId.split(":")[2];
    }else if(checkKeyingBatch && checkKeyingBatch == 'VERIINIT') {
      batchKey = newBatchId.split(":")[2];
    }else if(checkKeyingBatch && checkKeyingBatch == 'HERD-Keying') {
      batchKey = newBatchId.split(":")[2];
    }else if(checkKeyingBatch && checkKeyingBatch == 'IDS-Keying') {
      batchKey = newBatchId.split(":")[2];
    }else if(checkKeyingBatch && checkKeyingBatch == 'ITALYPARA-Keying') {
      batchKey = newBatchId.split(":")[2];
    }else if(checkKeyingBatch && checkKeyingBatch == 'OSLOADING-Keying') {
      batchKey = newBatchId.split(":")[2];
    }else if(checkKeyingBatch && checkKeyingBatch == 'PARA-Keying') {
      batchKey = newBatchId.split(":")[2];
    }else if(checkKeyingBatch && checkKeyingBatch == 'PERSO-Keying') {
      batchKey = newBatchId.split(":")[2];
    }else if(checkKeyingBatch && checkKeyingBatch == 'UXPARA-Keying') {
      batchKey = newBatchId.split(":")[2];
    }else if(checkKeyingBatch && checkKeyingBatch == 'VHQ-Keying') {
      batchKey = newBatchId.split(":")[2];
    }
    let batchData = action.config.data;
    batchData.batchUnits && batchData.batchUnits.forEach(element => {
      let unitBatchId = element["batchDetailsReponse"]["unitBatchId"];
      let unitOrder = element["batchDetailsReponse"]["unitOrder"];
      let changePart = [
        {
          "type": "microservice",
          "config": {
            "microserviceId": "performChangePart",
            "requestMethod": "post",
            "body": {
              "changeSerialNumberRequest": {
                "bcn": element.batchDetailsReponse.itemBcn,
                "mustBeOnHoldInd": 0,
                "releaseIfHoldInd": 0,
                "mustBeTimedInInd": 1,
                "notes": element.notes == "" ? "test123" : element.notes,
                "inventoryAttributes": {
                  "flexField": [
                    {
                      "name": "UNIT_BATCH_ID",
                      "value": newBatchId + unitOrder
                    }
                  ]
                }
              },
              "userName": "#loginUUID.username",
              "password": "#loginUUID.password",
              "ip": "::1",
              "callSource": "FrontEnd",
              "apiUsageLocationName": "#userSelectedLocationName",
              "apiUsageClientName": "#userSelectedClientName"
            },
            "toBeStringified": true
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "microservice",
                  "config": {
                    "microserviceId": "getActiveBatch",
                    "requestMethod": "get",
                    "params": {
                      "locationId": "#userSelectedLocation",
                      "clientId": "#userSelectedClient",
                      "contractId": "#userSelectedContract",
                      "processId": "#selectedHomeMenuId",
                      "appId": "#selectedHomeMenuId",
                      "userName": "#loginUUID.username",
                      "key": batchKey,
                      "keyWc": "",
                      "workCenterId": "#verifoneWCResultData"
                    }
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "allBatchData",
                            "data": []
                          },
                          "eventSource": "click"
                        },
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "takeoveractiveBatchesData",
                            "data": "responseData"
                          },
                          "eventSource": "click"
                        },
                        {
                          "type": "keyingRenderTemplate",
                          "hookType": "afterInit", 
                        }
                      ]
                    },
                    "onFailure": {
                      "actions": [
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "errorPart",
                            "data": "responseData"
                          }
                        },
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "errorTitleUUID",
                            "properties": {
                              "titleValue": "#errorPart",
                              "isShown": true
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

              ]
            }
          }
        }
      ]
      this.executeActions(changePart, instance, actionService);

    });


    // let activeBatchCallData = [
    //   {
    //       "type": "getActiveBatchProcess",
    //       "config": {
    //         "svgIcon": "replace",
    //         "text": "Replace",
    //         "processType": "replace"
    //     }
    //   }
    // ];
    // this.executeActions(activeBatchCallData, instance, actionService);
    // {
    //   "type": "getActiveBatchProcess",
    //   "config": {
    //     "svgIcon": "replace",
    //     "text": "Replace",
    //     "processType": "replace"
    //   }
  }

  getReleaseApiJson(unitInfo, onSuccess) {
    let release = [{
      "type": "microservice",
      "config": {
        "microserviceId": "releaseBCN",
        "requestMethod": "post",
        "body": {
          "location": "#userSelectedLocationName",
          "workcenter": "#verifoneWCResultValue",
          "bcn": "#getUnitHandsOnDetails.0.itemBcn",
          "userName": "#loginUUID.username",
          "password": "#loginUUID.password"
        },
        "toBeStringified": true
      },
      "responseDependents": {
        "onSuccess": {
          "actions": onSuccess
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
    }]

    return release;
  }

  getTimeinApiJson(unitInfo, onSuccess) {
    let timeIn = [{
      "type": "microservice",
      "config": {
        "microserviceId": "performTimeIn",
        "requestMethod": "post",
        "body": {
          "timeInRequest": {
            "workCenter": "#verifoneWCResultValue",
            "location": "#userSelectedLocationName",
            "part": "#getUnitHandsOnDetails.0.partNo",
            "bcn": "#getUnitHandsOnDetails.0.itemBcn",
            "serialNumber": "#getUnitHandsOnDetails.0.serialNo",
            "password": "#loginUUID.password"
          },
          "userName": "#loginUUID.username",
          "userPass": "#loginUUID.password",
          "ip": "::1",
          "callSource": "FrontEnd",
          "apiUsage_LocationName": "#userSelectedLocationName",
          "apiUsage_ClientName": "#userSelectedClientName"
        },
        "toBeStringified": true
      },
      "responseDependents": {
        "onSuccess": {
          "actions": onSuccess
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
    }]
    return timeIn
  }

  getAddInfoCodeApiJson(unitInfo, onSuccess) {
    let addInfoCode = [
      {
        "type": "microservice",
        "config": {
          "microserviceId": "getHandsOnTakeOverCode",
          "requestMethod": "get",
          "params": {
            "locationId": "#userSelectedLocation",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "processId": "#selectedHomeMenuId",
            "workCenterId": "#verifoneWCResultData",
            "appId": "#selectedHomeMenuId",
            "userName": "#userAccountInfo.PersonalDetails.USERID"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "microservice",
                "config": {
                  "microserviceId": "addInfoCodes",
                  "requestMethod": "post",
                  "body": {
                    "workCenter": "#verifoneWCResultValue",
                    "geography": "#userSelectedLocationName",
                    "bcn": "#getUnitHandsOnDetails.0.itemBcn",
                    "part": "#getUnitHandsOnDetails.0.partNo",
                    "notes": "Perform addinfocodes",
                    "infoCodes": [{
                      "type": "#getHandsOnTakeOverCode.0.outComeCodeType",
                      "name": "#getHandsOnTakeOverCode.0.outComeCodeId"
                      // "type": "Diagnostic",
                      // "name": "START"
                    }],
                    "userName": "#loginUUID.username",
                    "password": "#loginUUID.password"

                  },
                  "toBeStringified": true
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": onSuccess
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
    return addInfoCode;
  }

  getChangePartApiJson(unitInfo) {
    let changePart = [{
      "type": "microservice",
      "config": {
        "microserviceId": "performChangePart",
        "requestMethod": "post",
        "body": {
          "changeSerialNumberRequest": {
            "bcn": "#getUnitHandsOnDetails.0.itemBcn",
            "mustBeOnHoldInd": 0,
            "releaseIfHoldInd": 0,
            "mustBeTimedInInd": 1,
            "notes": "Perform ChangePart",
            "inventoryAttributes": {
              "flexField": [
                {
                  "name": "UNIT_BATCH_ID",
                  "value": unitInfo
                }
              ]
            }
          },
          "userName": "#loginUUID.username",
          "password": "#loginUUID.password",
          "ip": "::1",
          "callSource": "FrontEnd",
          "apiUsageLocationName": "#userSelectedLocationName",
          "apiUsageClientName": "#userSelectedClientName"
        },
        "toBeStringified": true
      },
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "microservice",
              "config": {
                "microserviceId": "getBatchItemDetails",
                "requestMethod": "get",
                "params": {
                  "locationId": "#userSelectedLocation",
                  "clientId": "#userSelectedClient",
                  "contractId": "#userSelectedContract",
                  "processId": "#selectedHomeMenuId",
                  "appId": "#selectedHomeMenuId",
                  "userName": "#loginUUID.username",
                  "serialNo": "#unitItem.value",
                  "workCenterId": "#verifoneWCResultData"
                }
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "getBatchItemDetails",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "addUnitToBatch",
                      "config": {
                        "data": "#getBatchItemDetails",
                        "index": "#unitItem.index"
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
    }]

    return changePart;
  }

  formatActiveBatchData(data) {
    this.allBatch = []
    let activeBatchesData = data;
    let uniqueBatchArr = [];
    var newBatchId = {};
    let uniqueBatchIdArr = [...new Set(activeBatchesData.map(item => item.batchId))];
    for (let i = 0; i < uniqueBatchIdArr.length; i++) {
      uniqueBatchArr[i] = { "batchDetail": [] };
      for (let j = 0; j < activeBatchesData.length; j++) {
        if (uniqueBatchIdArr[i] === activeBatchesData[j]['batchId']) {
          newBatchId = {};
          newBatchId = {
            "batchId": activeBatchesData[j]['batchId'],
            "batchDetailsReponse": activeBatchesData[j]['batchItem'],
            "condition": "",
            "selectedRc": "",
            "notes": ""
          };
          uniqueBatchArr[i]['batchDetail'].push(newBatchId);
        }
      }
    }
    for (let i = 0; i < uniqueBatchArr.length; i++) {
      let unitBatchData = uniqueBatchArr[i]['batchDetail'][0]['batchId'];
      let takeOverBatchStatus = this.checkUserLoginBatch(unitBatchData, uniqueBatchArr[i]['batchDetail']);
      let holdStatus = takeOverBatchStatus["holdFlag"];
      let loginSameStatus = takeOverBatchStatus["loginSame"];

      let newBatch = {
        batchIndex: i,
        batchUnits: uniqueBatchArr[i]['batchDetail'],
        batchName: unitBatchData,
        "headerColor": (holdStatus || loginSameStatus) ? "takeover-header" : "",
        "takeOverBatchStatus": (holdStatus || loginSameStatus),
        "holdStatus": holdStatus
      };
      this.allBatch.push(newBatch);
    }
    return this.allBatch;
  }

  clearContextOfLoadBatch(action, instance, actionService) {
    this.contextService.addToContext("allBatchData", []);
    this.allBatch = [];
  }

  getStroageRelease(unitInfo, onSuccess) {
    let timeIn = [
      {
        "type": "microservice",
        "config": {
          "microserviceId": "releasefromhold",
          "requestMethod": "post",
          "body": {
            "unitBCN": "#getUnitHandsOnDetails.0.itemBcn",
            "releaseNotes": "RELEASE",
            "userPwd": {
              "userName": "#loginUUID.username",
              "password": "#loginUUID.password",
            }
          },
          "toBeStringified": true
        },
        "responseDependents": {
          "onSuccess": {
            "actions": onSuccess
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
    return timeIn
  }

  getRCcode(unitCondition) {
    if (
      unitCondition.length > 0
      && unitCondition[0]["condition"]
      && unitCondition[0]["selectedRc"]
      && unitCondition[0]["selectedRc"] !== ""
      && unitCondition[0]["condition"] !== "Fail"
    ) {
      return unitCondition[0]["selectedRc"]
    } else {
      return ""
    }
  }

  getInstruction(unitCondition) {
    if (
      unitCondition.length > 0
      && unitCondition[0]["condition"]
      && unitCondition[0]["instruction"]
      && unitCondition[0]["instruction"] !== ""
      && unitCondition[0]["condition"] !== "Fail"
    ) {
      return unitCondition[0]["instruction"]
    } else {
      return ""
    }
  }

  returnActionForFailClick(selectedBatchName, newBatch) {//method to handle the events and actions.
    let action = [];
    let username = this.contextService.getDataByKey('userAccountInfo')['PersonalDetails']['USERID'];
    if(newBatch['batchName'] ) {
      let batchA = newBatch['batchName'].split(':')[0];
      if (batchA.toLowerCase() == username.toLowerCase())
        localStorage.setItem(username+"failPanelExpandId","batch-panel-" + newBatch['batchName']);
    }
    
    if (this.click.length > 0 && this.click.indexOf(selectedBatchName) > -1) {  //condition for Click event.
      action = [
        {
          "type": "condition",
          "eventSource": "change",
          "config": {
            "operation": "isEqualTo",
            "lhs": "#toggleSelect",
            "rhs": "Fail"
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "microservice",
                  "config": {
                    "microserviceId": "getUnitInfo",
                    "requestMethod": "get",
                    "params": {
                      "unitIdentificationValue": "#failUnit.batchDetailsReponse.itemBcn",
                      "identificatorType": "BCN",
                      "locationId": "#userSelectedLocation",
                      "clientId": "#userSelectedClient",
                      "contractId": "#userSelectedContract"
                    }
                  },
                  "eventSource": "click",
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "UnitInfo",
                            "data": "responseData"
                          }
                        },
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "discrepancyUnitInfo",
                            "data": "responseData"
                          }
                        },
                        {
                          "type": "microservice",
                          "hookType": "afterInit",
                          "config": {
                            "microserviceId": "getVerifoneUnitHeader",
                            "requestMethod": "get",
                            "params": {
                              "itemId": "#UnitInfo.ITEM_ID",
                              "locationId": "#userSelectedLocation",
                              "clientId": "#userSelectedClient",
                              "contractId": "#userSelectedContract",
                              "userName": "#userAccountInfo.PersonalDetails.USERID"
                            }
                          },
                          "responseDependents": {
                            "onSuccess": {
                              "actions": [
                                {
                                  "type": "context",
                                  "config": {
                                    "requestMethod": "add",
                                    "key": "verifoneUnitHeaderData",
                                    "data": "responseData"
                                  }
                                },
                                {
                                  "type": "sessionStorageOperation",
                                  "mode": "write",
                                  "config": {
                                    "localKey": "failPanelExpandId",
                                    "localData": "batch-panel-" + newBatch['batchName']
                                  }
                                },
                                {
                                  "type": "renderTemplate",
                                  "config": {
                                    "templateId": "verifone/verifone-LoadStation(H5000).json",
                                    "mode": "local"
                                  }
                                }
                              ]
                            },
                            "onFailure": {
                              "actions": [
                                {
                                  "type": "renderTemplate",
                                  "config": {
                                    "templateId": "verifone/verifone-LoadStation(H5000).json",
                                    "mode": "local"
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
                          "type": "updateComponent",
                          "config": {
                            "key": "searchCriteriaErrorTitleUUID",
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
            },
            "onFailure": {
              "actions": [
                {
                  "type": "sessionStorageOperation",
                  "eventSource": "change",
                  "mode": "write",
                  "config": {
                    "localKey": "failPanelExpandId",
                    "localData": "batch-panel-" + newBatch['batchName']
                  }
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "errorTitleUUID",
                    "properties": {
                      "titleValue": "",
                      "isShown": false
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    } else if (this.dblclick.length > 0 && this.dblclick.indexOf(selectedBatchName) > -1) { //condition for dblclick event.
      action = [
        {
          "type": "condition",
          "eventSource": "dblclick",
          "config": {
            "operation": "isEqualTo",
            "lhs": "#toggleSelect",
            "rhs": "Fail"
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "microservice",
                  "config": {
                    "microserviceId": "getUnitInfo",
                    "requestMethod": "get",
                    "params": {
                      "unitIdentificationValue": "#failUnit.batchDetailsReponse.itemBcn",
                      "identificatorType": "BCN",
                      "locationId": "#userSelectedLocation",
                      "clientId": "#userSelectedClient",
                      "contractId": "#userSelectedContract"
                    }
                  },
                  "eventSource": "click",
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "UnitInfo",
                            "data": "responseData"
                          }
                        },
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "discrepancyUnitInfo",
                            "data": "responseData"
                          }
                        },
                        {
                          "type": "microservice",
                          "hookType": "afterInit",
                          "config": {
                            "microserviceId": "getVerifoneUnitHeader",
                            "requestMethod": "get",
                            "params": {
                              "itemId": "#UnitInfo.ITEM_ID",
                              "locationId": "#userSelectedLocation",
                              "clientId": "#userSelectedClient",
                              "contractId": "#userSelectedContract",
                              "userName": "#userAccountInfo.PersonalDetails.USERID"
                            }
                          },
                          "responseDependents": {
                            "onSuccess": {
                              "actions": [
                                {
                                  "type": "context",
                                  "config": {
                                    "requestMethod": "add",
                                    "key": "verifoneUnitHeaderData",
                                    "data": "responseData"
                                  }
                                },
                                {
                                  "type": "sessionStorageOperation",
                                  "mode": "write",
                                  "config": {
                                    "localKey": "failPanelExpandId",
                                    "localData": "batch-panel-" + newBatch['batchName']
                                  }
                                },
                                {
                                  "type": "renderTemplate",
                                  "config": {
                                    "templateId": "verifone/verifone-LoadStation(H5000).json",
                                    "mode": "local"
                                  }
                                }
                              ]
                            },
                            "onFailure": {
                              "actions": [
                                {
                                  "type": "renderTemplate",
                                  "config": {
                                    "templateId": "verifone/verifone-LoadStation(H5000).json",
                                    "mode": "local"
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
                          "type": "updateComponent",
                          "config": {
                            "key": "searchCriteriaErrorTitleUUID",
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
            },
            "onFailure": {
              "actions": [
                {
                  "type": "sessionStorageOperation",
                  "mode": "write",
                  "config": {
                    "localKey": "failPanelExpandId",
                    "localData": "batch-panel-" + newBatch['batchName']
                  }
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "errorTitleUUID",
                    "properties": {
                      "titleValue": "",
                      "isShown": false
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    } else {
      action = []
    }

    if (this.dblClickPass.length > 0 && this.dblClickPass.indexOf(selectedBatchName) > -1) {
      let passCode = {
        "type": "condition",
        "eventSource": "dblclick",
        "config": {
          "operation": "isEqualTo",
          "lhs": "#toggleSelect",
          "rhs": "Pass"
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "microservice",
                "config": {
                  "microserviceId": "getUnitInfo",
                  "requestMethod": "get",
                  "params": {
                    "unitIdentificationValue": "#failUnit.batchDetailsReponse.itemBcn",
                    "identificatorType": "BCN",
                    "locationId": "#userSelectedLocation",
                    "clientId": "#userSelectedClient",
                    "contractId": "#userSelectedContract"
                  }
                },
                "eventSource": "click",
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "UnitInfo",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "discrepancyUnitInfo",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "microservice",
                        "hookType": "afterInit",
                        "config": {
                          "microserviceId": "getVerifoneUnitHeader",
                          "requestMethod": "get",
                          "params": {
                            "itemId": "#UnitInfo.ITEM_ID",
                            "locationId": "#userSelectedLocation",
                            "clientId": "#userSelectedClient",
                            "contractId": "#userSelectedContract",
                            "userName": "#userAccountInfo.PersonalDetails.USERID"
                          }
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "verifoneUnitHeaderData",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "sessionStorageOperation",
                                "mode": "write",
                                "config": {
                                  "localKey": "failPanelExpandId",
                                  "localData": "batch-panel-" + newBatch['batchName']
                                }
                              },
                              {
                                "type": "renderTemplate",
                                "config": {
                                  "templateId": "verifone/verifone-LoadStation(H5000).json",
                                  "mode": "local"
                                }
                              }
                            ]
                          },
                          "onFailure": {
                            "actions": [
                              {
                                "type": "renderTemplate",
                                "config": {
                                  "templateId": "verifone/verifone-LoadStation(H5000).json",
                                  "mode": "local"
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
                        "type": "updateComponent",
                        "config": {
                          "key": "searchCriteriaErrorTitleUUID",
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
          },
          "onFailure": {
            "actions": [
              {
                "type": "sessionStorageOperation",
                "mode": "write",
                "config": {
                  "localKey": "failPanelExpandId",
                  "localData": "batch-panel-" + newBatch['batchName']
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "errorTitleUUID",
                  "properties": {
                    "titleValue": "",
                    "isShown": false
                  }
                }
              }
            ]
          }
        }
      }
      action.push(passCode);
    }

    return action;
  }

  returnEvent(selectedBatchName) {
    if (this.click.length > 0 && this.click.indexOf(selectedBatchName) > -1)
      return "click"
    else if (this.dblclick.length > 0 && this.dblclick.indexOf(selectedBatchName) > -1)
      return "dblclick"
    else
      return "no-event"
  }

 
  keyingRenderTemplate(action, instance, actionService) {
    let currentWC= this.contextService.getDataByKey("currentWC");
    let renderTemplate="";
    switch (currentWC) {
      case 'CA-Keying':
        renderTemplate="verifone/verifone-CAKeying.json"
        break;
      case 'ITALY-Keying':
        renderTemplate="verifone/verifone-ITALYKeying.json"
        break;
      case 'L2RKL-Keying':
        renderTemplate="verifone/verifone-L2RKLKeying.json"
        break;
      case 'P2PE-Keying':
        renderTemplate="verifone/verifone-P2PEKeying.json"
        break;
      case 'TMS-Keying':
        renderTemplate="verifone/verifone-TMSKeying.json"
        break;
      case 'TOTAL-Keying':
        renderTemplate="verifone/verifone-TOTALKeying.json"
        break;
      case 'VERIINIT':
        renderTemplate = "verifone/verifone-veriinist.json"
        break;
      case 'HERD-Keying':
        renderTemplate = "verifone/verifone-HERDKeying.json"
        break;
      case 'IDS-Keying':
        renderTemplate = "verifone/verifone-IDSKeying.json"
        break;
      case 'ITALYPARA-Keying':
        renderTemplate = "verifone/verifone-ITALYPARAKeying.json"
        break;
      case 'OSLOADING-Keying':
        renderTemplate = "verifone/verifone-OSLOADINGKeying.json"
        break;
      case 'PARA-Keying':
        renderTemplate = "verifone/verifone-PARAKeying.json"
        break;
      case 'PERSO-Keying':
        renderTemplate = "verifone/verifone-PERSOKeying.json"
        break;
      case 'UXPARA-Keying':
        renderTemplate = "verifone/verifone-PERSOKeying.json"
        break;
      case 'VHQ-Keying':
        renderTemplate = "verifone/verifoneVHQKeying.json"
        break;
      case 'LOAD STATION PROCESS':
        renderTemplate = "verifone/verifone-batchProcess.json"
        break;
    }
    let withKeyingActions=[{
      "type": "renderTemplate",
      "config": {
        "templateId": renderTemplate,
        "mode": "local"
      }
    }];
    this.executeActions(withKeyingActions, instance, actionService);
    
    
  }

  checkKeyingWC(){
    let checkKeyingBatch= this.contextService.getDataByKey("currentWC");
    switch (checkKeyingBatch) {
      case 'CA-Keying':
       return true
      case 'ITALY-Keying':
        return true
      case 'L2RKL-Keying':
        return true
      case 'P2PE-Keying':
        return true
      case 'TMS-Keying':
        return true
      case 'TOTAL-Keying':
        return true
      case 'VERIINIT':
        return true
      case 'HERD-Keying':
        return true
      case 'IDS-Keying':
        return true
      case 'ITALYPARA-Keying':
        return true
      case 'OSLOADING-Keying':
        return true
      case 'PARA-Keying':
        return true
      case 'PERSO-Keying':
        return true
      case 'UXPARA-Keying':
        return true
      case 'VHQ-Keying':
        return true
    }
  }
}