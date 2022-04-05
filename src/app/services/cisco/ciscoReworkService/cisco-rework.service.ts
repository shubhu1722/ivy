import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class CiscoReworkService {

  constructor(private contextService: ContextService) { }

  getCiscoReworkWishList(action: any, instance: any, actionService, responseData?: any) {
    this.contextService.addToContext("ciscoReworkWLTasksRes1", [])
    let reworkWishList
    var wishListData = this.contextService.getDataByString(action.config.key);
    wishListData = wishListData instanceof Array ? wishListData : [];
    this.contextService.addToContext(action.config.key, [])
    wishListData && wishListData.forEach(element => {
      let str = element.part + ', ' + element.location;
      reworkWishList = [
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "ciscoReworkWLTasksRes1",
            "sourceData": {
              "Part Details": [
                {
                  "ctype": "block-text",
                  "uuid": "StockUUID",
                  "text": "Part:",
                  "textValue": str,
                  "class": "greyish-black overflow-wrap width-273"
                },
                {
                  "ctype": "block-text",
                  "uuid": "StockUUID",
                  "textValue": element.defect,
                  "class": "greyish-black overflow-wrap width-273"
                }
              ],
              "Qty": [
                {
                  "ctype": "block-text",
                  "uuid": "ciscoDebugWishlistQtyUUID",
                  "text": element.qty
                }
              ],
              "parentUUID": "#createdComponentUUID"
            }
          }
        },
        {
          "type": "context",
          "hookType": "afterInit",
          "config": {
            "requestMethod": "add",
            "key": "ciscoDebugWishListLength",
            "data": "contextLength",
            "sourceContext": "ciscoReworkWLTasksRes1"
          }
        },
        {
          "type": "errorPrepareAndRender",
          "hookType": "afterInit",
          "config": {
            "key": "wishListButtonUUID",
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
      reworkWishList && reworkWishList.forEach(item => {
        actionService.handleAction(item, instance);
      })
    });
    // reworkWishList.forEach(item => {
    //   actionService.handleAction(item, instance);
    // })

  }

  splitEcoFru(action: any, instance: any) {
    let EcoFru = this.contextService.getDataByString(action.config.dataArray);
    let ecodata = []
    let frudata = []
    EcoFru && EcoFru.forEach(element => {
      if (element.activityType == "ECO") {
        ecodata.push(element)
        console.log(ecodata);
      } else if (element.activityType == "FRU") {
        frudata.push(element);
      }
    });
    this.contextService.addToContext(action.config.ecoKey, ecodata);
    this.contextService.addToContext(action.config.fruKey, frudata);
    console.log(ecodata);
    console.log(frudata);
  }

  deleteEcoFromUI(action: any, instance: any, actionService) {
    let defect = action.config.defect;
    let dltRecRefArray = this.contextService.getDataByString("#dltRecRefArray");
    dltRecRefArray && dltRecRefArray.forEach((element) => {
      if (defect === element.defect) {
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

  filterTandCEco(action: any, instance: any, actionService) {
    let tcEco = this.contextService.getDataByString(action.config.tcEco);
    let taskPanelData = this.contextService.getDataByString(action.config.taskPanelData);
    let test = [];
    let normalEco = []
    let element
    if (tcEco instanceof Array) {
      element = tcEco.filter(ele => ele.isTncEco == "true")
    }
    if (taskPanelData.eco) {
      // taskPanelData.eco && taskPanelData.eco.forEach((taskData, index) => {
      //   if (element && element.length > 0 && element.filter(ele => taskData.defectCode === ele.ecoNumber)) {
      //     test.push(taskData);
      //   } else {
      //     normalEco.push(taskData);
      //   }
      // });

      taskPanelData.eco && taskPanelData.eco.forEach((taskData, index) => {
        if (element && element.length > 0) {
          let tcArray = element.filter(ele => taskData.defectCode === ele.ecoNumber);
          if (tcArray && tcArray.length > 0) {
            test.push(taskData);
          } else {
            normalEco.push(taskData);
          }
        } else {
          normalEco.push(taskData);
        }
      });

    }
    taskPanelData.eco = normalEco;
    this.contextService.addToContext(action.config.dataKey, taskPanelData);
    this.contextService.addToContext(action.config.key, test);

    if (action.config.afterAction) {
      let actions = action.config.afterAction;
      actions && actions.forEach(element => {
        actionService.handleAction(element);
      });
    }
  }

  getSerialNoFromAssemblyCode(action: any, instance: any, arg2: any) {
    let key, pcbList, assemblyCode, serialNo;

    key = action.config.key;
    if (action.config.pcbList && action.config.pcbList.startsWith("#")) {
      pcbList = this.contextService.getDataByString(action.config.pcbList);
    } else {
      pcbList = action.config.pcbList;
    }
    if (action.config.assemblyCode && action.config.assemblyCode.startsWith("#")) {
      assemblyCode = this.contextService.getDataByString(action.config.assemblyCode);
    } else {
      assemblyCode = action.config.assemblyCode;
    }

    if (pcbList && pcbList instanceof Array) {
      serialNo = pcbList.filter(e => e.assemblyCode == assemblyCode);
      console.log(serialNo[0].serialNumber);
      serialNo = serialNo[0].serialNumber;
      this.contextService.addToContext(key, serialNo);
    } else {
      // To avoide fail call.
      serialNo = ".";
      this.contextService.addToContext(key, serialNo);
    }
  }

  unissueDefectiveNewComponent(action: any, instance: any, actionService) {
    if (action.config.processType === "replace") {
      let unissueReplaceParts = [
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
                  "actionCode": "OPEN-REPLACE",
                  "operation": "Add",
                  "defectCode": {
                    "value": action.config.data.DefectCode
                  }
                },

                "nonInventoryPartList": {
                  "nonInventoryPart": [
                    {
                      "part": action.config.data.PartNo,
                      "quantity": action.config.data.Quantity,
                      "componentLocationDescription": action.config.data.Location
                    }]
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
                          "operation": "Delete",
                          "actionCode": "OPEN-REPLACE",
                          "defectCode": {
                            "value": action.config.data.DefectCode
                          }
                        },
                        "nonInventoryPartList": {
                          "nonInventoryPart": [
                            {
                              "part": action.config.data.PartNo,
                              "quantity": action.config.data.Quantity,
                              "componentLocationDescription": action.config.data.Location
                            }
                          ]
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
                      "actions": this.getFilterFA(action, instance, actionService)
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
      unissueReplaceParts.forEach((element) => {
        actionService.handleAction(element, instance)
      })
    } else if (action.config.processType === "fit" || action.config.processType === "resolder") {
      let unissueFitResolderParts = [
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
                  "actionCode": "OPEN-" + action.config.processType.toUpperCase(),
                  "operation": "Add",
                  "defectCode": {
                    "value": action.config.data.DefectCode
                  }
                },

                "nonInventoryPartList": {
                  "nonInventoryPart": [
                    {
                      "part": action.config.data.PartNo,
                      "quantity": action.config.data.Quantity,
                      "componentLocationDescription": action.config.data.Location
                    }]
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
              "actions": this.getFilterFA(action, instance, actionService)
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
      unissueFitResolderParts.forEach((element) => {
        actionService.handleAction(element, instance)
      })
    } else {
      let unissueRemoveParts = [
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
                  "actionCode": "OPEN-REMOVE",
                  "defectCode": {
                    "value": action.config.data.DefectCode
                  }
                },
                "nonInventoryPartList": {
                  "nonInventoryPart": [
                    {
                      "part": action.config.data.PartNo,
                      "quantity": action.config.data.Quantity,
                      "componentLocationDescription": action.config.data.Location
                    }
                  ]
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
              "actions": this.getFilterFA(action, instance, actionService)
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
      unissueRemoveParts.forEach((element) => {
        actionService.handleAction(element, instance)
      })
    }
  }

  getFilterFA(action: any, instance: any, actionService) {
    let currentActionCode;
    let filterData;
    let filterFA;
    let fa;

    currentActionCode = this.contextService.getDataByString(action.config.taskPanelData);
    filterData = currentActionCode.filter(ele => ele.readonlyTask == "false");
    filterFA = filterData.filter(ele => ele.defectCode == action.config.data.DefectCode);

    if (filterFA.length == 1) {
      fa = this.undoFA(action, instance, actionService);
    } else {
      fa = action.config.afterExecuteActions;
    }
    return fa;
  }

  undoFA(action: any, instance: any, actionService) {
    let responseData = this.contextService.getDataByString(action.config.data.Occurrence);
    responseData = responseData[0];
    let removeActionCode = [
      {
        "type": "microservice",
        "eventSource": "click",
        "config": {
          "microserviceId": "performFA",
          "requestMethod": "post",
          "body": {
            "updateFailureAnalysisRequest": {
              "actionCodeChangeList": {
                "actionCodeChange": [
                  {
                    "actionCode": "OPEN-" + action.config.processType.toUpperCase(),
                    "operation": "Delete",
                    "defectCode": {
                      "value": action.config.data.DefectCode,
                      "occurrence": responseData.occurrence
                    }
                  }
                ]
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
            "actions": action.config.afterExecuteActions
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
    return removeActionCode;
  }

  // For ECOs
  unissueEcoDefectiveNewComponent(action: any, instance: any, actionService) {
    let currentActionCode;
    let filterData;
    if (action.config.processType === "replace") {
      let unissueReplaceParts = [
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
                  "actionCode": "OPEN-REPLACE",
                  "operation": "Add",
                  "ecoCode": {
                    "value": action.config.data.DefectCode
                  }
                },

                "nonInventoryPartList": {
                  "nonInventoryPart": [
                    {
                      "part": action.config.data.PartNo,
                      "quantity": action.config.data.Quantity,
                      "componentLocationDescription": action.config.data.Location
                    }]
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
                          "operation": "Delete",
                          "actionCode": "OPEN-REPLACE",
                          "ecoCode": {
                            "value": action.config.data.DefectCode
                          }
                        },
                        "nonInventoryPartList": {
                          "nonInventoryPart": [
                            {
                              "part": action.config.data.PartNo,
                              "quantity": action.config.data.Quantity,
                              "componentLocationDescription": action.config.data.Location
                            }
                          ]
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
                      "actions": this.getFilterEcoFA(action, instance, actionService)
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
      unissueReplaceParts.forEach((element) => {
        actionService.handleAction(element, instance)
      })
    } else if (action.config.processType === "fit") {
      let unissueFitParts = [
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
                  "actionCode": "OPEN-" + action.config.processType.toUpperCase(),
                  "operation": "Add",
                  "ecoCode": {
                    "value": action.config.data.DefectCode
                  }
                },

                "nonInventoryPartList": {
                  "nonInventoryPart": [
                    {
                      "part": action.config.data.PartNo,
                      "quantity": action.config.data.Quantity,
                      "componentLocationDescription": action.config.data.Location
                    }]
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
              "actions": this.getFilterEcoFA(action, instance, actionService)
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
      unissueFitParts.forEach((element) => {
        actionService.handleAction(element, instance)
      })
    }
    // currentActionCode = this.contextService.getDataByString(action.config.taskPanelData);
    // filterData = currentActionCode.filter(ele => ele.readonlyTask == "false");
    // if (filterData.length == 0) {
    //   this.undoEcoFA(action, instance, actionService);
    // }
  }
  getFilterEcoFA(action: any, instance: any, actionService) {
    let currentActionCode;
    let filterData;
    let filterFA;
    let fa;
    let currentDefectCode;
    let splitDefectCode;
    currentActionCode = this.contextService.getDataByString(action.config.taskPanelData);
    currentDefectCode = this.contextService.getDataByString(action.config.data.DefectCode);
    splitDefectCode = currentDefectCode.split("--")[1];

    filterData = currentActionCode.filter(ele => ele.readonlyTask == "false");
    filterFA = filterData.filter(ele => ele.defectCode == splitDefectCode);

    if (filterFA.length == 1) {
      fa = this.undoEcoFA(action, instance, actionService);
    } else {
      fa = action.config.afterExecuteActions;
    }
    return fa;
  }
  // For T&C Rework ECO
  unissueTCFruandEco(action: any, instance: any, actionService) {
    let currentTaskPanelData;
    let filterECOTask;
    let filterFRUTask;
    let fa;
    let currentDefectCode;

    currentTaskPanelData = this.contextService.getDataByString(action.config.taskPanelData);
    currentDefectCode = action.config.data.DefectCode;

    if (action.config.currentTaskType == "ECO") {
      filterECOTask = currentTaskPanelData.filter(ele => ele.activityType == "ECO");
    }
    if (action.config.currentTaskType == "FRU") {
      filterFRUTask = currentTaskPanelData.filter(ele => ele.activityType == "FRU");
      if (filterFRUTask && filterFRUTask.length > 0) {
        filterFRUTask = filterFRUTask.filter(ele => ele.defect == currentDefectCode);
      }
    }

    if (filterECOTask && filterECOTask.length == 1) {
      fa = this.undoEcoFA(action, instance, actionService);
    } else if (filterFRUTask && filterFRUTask.length == 1) {
      fa = this.undoFruFA(action, instance, actionService);
    } else {
      fa = action.config.afterExecuteActions;
    }
    fa && fa.forEach((element) => {
      // console.log(element);
      actionService.handleAction(element)
    })
  }
  //For Rework,BGA-rework,Config-rework, T&C rework Undo Eco task panel
  undoEcoFA(action: any, instance: any, actionService) {
    let responseEcoData = this.contextService.getDataByString(action.config.data.Occurrence);
    responseEcoData = responseEcoData[0];
    let removeActionCode = [
      {
        "type": "microservice",
        "eventSource": "click",
        "config": {
          "microserviceId": "performFA",
          "requestMethod": "post",
          "body": {
            "updateFailureAnalysisRequest": {
              "actionCodeChangeList": {
                "actionCodeChange": [
                  {
                    "actionCode": "OPEN-" + action.config.processType.toUpperCase(),
                    "operation": "Delete",
                    "ecoCode": {
                      "value": action.config.data.DefectCode,
                      "occurrence": responseEcoData.occurrence
                    }
                  }
                ]
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
                "eventSource": "click",
                "config": {
                  "microserviceId": "performFA",
                  "requestMethod": "post",
                  "body": {
                    "updateFailureAnalysisRequest": {
                      "actionCodeChangeList": {
                        "actionCodeChange": [
                          {
                            "actionCode": "OPEN",
                            "operation": "Delete",
                            "ecoCode": {
                              "value": action.config.data.DefectCode
                            }
                          }
                        ]
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
                    "actions": action.config.afterExecuteActions
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
    return removeActionCode;
  }
  //For T&C rework Fru Task Panel
  undoFruFA(action: any, instance: any, actionService) {
    let responseFruData = this.contextService.getDataByString(action.config.data.Occurrence);
    responseFruData = responseFruData[0];
    let removeActionCode = [
      {
        "type": "microservice",
        "eventSource": "click",
        "config": {
          "microserviceId": "performFA",
          "requestMethod": "post",
          "body": {
            "updateFailureAnalysisRequest": {
              "actionCodeChangeList": {
                "actionCodeChange": [
                  {
                    "actionCode": "OPEN-" + action.config.processType.toUpperCase(),
                    "operation": "Delete",
                    "defectCode": {
                      "value": action.config.data.DefectCode,
                      "occurrence": responseFruData.occurrence
                    }
                  }
                ]
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
            "actions": action.config.afterExecuteActions
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
    return removeActionCode;
  }
}
