import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionService } from '../transaction/transaction.service';
import { serviceUrls } from 'src/environments/serviceUrls';
import { ContextService } from '../contextService/context.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ETravellerComponent } from 'src/app/common/etraveller/etraveller.component';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';
import { element } from 'protractor';
import { eventNames } from 'process';
@Injectable({
  providedIn: 'root'
})
export class ETravellerService {
  keyData = new Subject();
  repositorySelectedData:any;
  constructor(protected http: HttpClient, private transactionService: TransactionService,
    private contextService: ContextService, public dialog: MatDialog) { }

  handlEtravellerServices(action, instance, scope) {
    //clones into new const variable
    const config = cloneDeep(action.config);

    switch (config.type) {
      case 'openDialogComponent':
        this.openDialogComponent(config.config);
        break;
      case 'filteringissuedRemovedParts':
        this.filteringissuedRemovedParts(action, instance, scope)
        break;
      case 'filteringDuplicateRequisitionHistory':
        this.filteringDuplicateRequisitionHistory(action, instance, scope);
        break;
      case 'addIndextoArray':
        this.addIndextoArray(action, instance, scope)
        break;
      case 'trimDateTime':
        this.trimDateTime(action, instance,scope)
        break;
      case 'addValueAction':
        this.addValueAction(action,instance,scope)
        break;  
      default:
        break;
    }
  }
  geteTravellerDetails(actionData: any): Observable<any> {
    if (actionData && actionData !== null && actionData != undefined) {
      let itemId = actionData[0].config.itemId;
      let microserviceId = actionData[0].config.microserviceId;
      let userName = actionData[0].config.userName;

      itemId = this.contextService.getDataByString(itemId);
      userName = this.contextService.getDataByString(userName);

      let params = {
        itemId: itemId,
        userName: userName
      };

      return this.transactionService.get(microserviceId, params, false);
    }
  }

  getKeyDataServiceCall(microServiceId, apiParams): Observable<any> {
    Object.keys(apiParams).forEach((key) => {
      if (apiParams[key] && apiParams[key].startsWith('#')) {
        apiParams[key] = this.contextService.getDataByString(apiParams[key]);
      }
    });
    return this.transactionService.get(microServiceId, apiParams, false);
  }

  openEtraveller(actions, scope, actionService) {
    let shippingFromDashboard = this.contextService.getDataByKey('shippingFromDashboard');
    let clientname = this.contextService.getDataByString("#UnitInfo.CLIENTNAME");
    let itemId = "#discrepancyUnitInfo.ITEM_ID";
    let verifoneClientName = this.contextService.getDataByKey("userSelectedClientName");
    if (clientname && clientname != undefined) {
      if (clientname == "CISCO") {
        itemId = "#UnitInfo.ITEM_ID";
      }
    }
    if (shippingFromDashboard !== undefined && shippingFromDashboard) {
      itemId = "#shippingRoOoResponse.itemId";
    }
    if (verifoneClientName && verifoneClientName.toLowerCase() == "verifone") {
      let unitItemId = this.contextService.getDataByKey("UnitInfo");
      if (unitItemId) {
        itemId = "#UnitInfo.ITEM_ID";
      } else {
        itemId = "#VerfoneUnitItemID";
      }

    }

    let actionData = [];
    if (clientname == "CISCO") {
      actionData = [{
        config: {
          "itemId": itemId,
          "userName": "#loginUUID.username",
          "microserviceId": "getAllItemHistoryCISCO"
          // "microserviceId": "getAllItemHistory"
        }
      }];
    } else {
      actionData = [{
        config: {
          "itemId": itemId,
          "userName": "#loginUUID.username",
          "microserviceId": "getAllItemHistory"
        }
      }];
    }
    this.geteTravellerDetails(actionData).subscribe((res) => {
      if (res && res !== null && res != undefined) {
        let itemHistory = res.data;
        let data;
        if (itemHistory && itemHistory != null && itemHistory != undefined) {
          //itemHistory = itemHistory.table;
          if (itemHistory && itemHistory != null && itemHistory != undefined) {
            this.contextService.addToContext("finalGetAllItemHistoryData", itemHistory[0]);
            let itemHistoryConsolidated = [];
            for (let i = 0; i < itemHistory.length; i++) {

              let historyEntry = itemHistory[i];
              let historyListItem = {};

              if (clientname == "CISCO") {
                historyListItem = {
                  timestamp: historyEntry.timestamp ? historyEntry.timestamp : historyEntry.timeStamp,
                  workcentername: historyEntry.workCenterName,
                  orderitemopername: historyEntry.orderItemOperName,
                  note: historyEntry.note,
                  details: "",
                  conditionname: "na",
                  login: historyEntry.login,
                  orderprocesstypecode: "na",
                  referenceorderid: "na",
                  orderid: "na",
                  itemtrxlogid: historyEntry.itemTrxLogId,
                  replacedAddedPN: historyEntry.partNo,
                  location: historyEntry.location
                };
              } else {
                historyListItem = {
                  timestamp: historyEntry.timestamp ? historyEntry.timestamp : historyEntry.timeStamp,
                  workcentername: historyEntry.workCenterName,
                  orderitemopername: historyEntry.orderItemOperName,
                  note: historyEntry.note,
                  details: "",
                  conditionname: historyEntry.conditionName,
                  login: historyEntry.login,
                  orderprocesstypecode: historyEntry.orderProcessTypeCode,
                  referenceorderid: historyEntry.referenceOrderId,
                  orderid: historyEntry.orderId,
                  itemtrxlogid: historyEntry.itemTrxLogId
                };
              }

              itemHistoryConsolidated.push(historyListItem);
            }
            if (clientname = "HP" && actions.config &&
              actions.config.keyDataVisible != undefined &&
              actions.config.keyDataVisible) {

              this.handleHpKeyDataMicorserviceAPI(itemHistoryConsolidated, actions, scope, actionService);
            }if(clientname = "HP" && actions.config &&
            actions.config.flexFieldVisible != undefined &&
            actions.config.flexFieldVisible){
              this.handleHpFlexFieldMicorserviceAPI(scope,actionService);
            }
            if (clientname = "HP" && actions.config &&
              actions.config.partsVisible != undefined &&
              actions.config.partsVisible) {
              this.handleHpPartsMicorserviceAPI(scope, actionService);
            }if (clientname = "HP" && actions.config &&
            actions.config.repositoryVisible != undefined &&
            actions.config.repositoryVisible) {
            this.handleHpRepositoryMicorserviceAPI(scope, actionService);
          }
            else {
              data = {
                itemHistoryConsolidated: itemHistoryConsolidated,
                actions: actions
              }
              this.openDialogComponent(data);
            }
            //   /// Open the dialog now
            //   const dialogConfig = new MatDialogConfig();

            //   dialogConfig.disableClose = false;
            //   dialogConfig.hasBackdrop = true;
            //  // dialogConfig.minimumWidth = false;
            //   // dialogConfig.width = "100%";
            //   dialogConfig.data = itemHistoryConsolidated;
            //   dialogConfig.data = {
            //     itemHistoryConsolidated : itemHistoryConsolidated,
            //     actions : actions
            //   }
            //   const dialogRef = this.dialog.open(ETravellerComponent, dialogConfig);
            //   dialogRef.afterClosed().subscribe(result => {
            //     if (result == 'success') {
            //       //this.getBeneficiaryDate();
            //       debugger;
            //     }
            //   });

          }
        }
      }
    });
  }

  openDialogComponent(dialogSourceData) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.width = '85vw';
    dialogConfig.height = '90vh';
    dialogConfig.panelClass = 'etraveller-dialog';
    // dialogConfig.minimumWidth = false;
    // dialogConfig.width = "100%";
    dialogConfig.data = dialogSourceData;
    if (this.dialog.openDialogs.length == 0) {
      const dialogRef = this.dialog.open(ETravellerComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'success') {
        }
      });
    }
  }

  // Handle HP-KeyData Micorservices

  handleHpKeyDataMicorserviceAPI(itemHistoryConsolidated, actions, instance, actionService) {
    let keyDataMicorservices = [
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getkeyDataCustomerResponse",
          "isLocal": false,
          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
          "requestMethod": "get",
          "params": {
            "itemBcn": "#discrepancyUnitInfo.ITEM_BCN",
            "UserName": "#userAccountInfo.PersonalDetails.USERID"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "microservice",
                "hookType": "afterInit",
                "config": {
                  "microserviceId": "getRERepairCSOIDByRODetails",
                  "isLocal": false,
                  "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                  "requestMethod": "get",
                  "statusNullIgnore": true,
                  "params": {
                    "referanceOrderId": "#finalGetAllItemHistoryData.referenceOrderId",
                    "clientId": "#userSelectedClient",
                    "contractId": "#userSelectedContract",
                    "businessTransactionType": "1",
                    "ffName": "RERepairCSOID",
                    "userName": "#loginUUID.username"
                  }
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "microservice",
                        "hookType": "afterInit",
                        "config": {
                          "microserviceId": "getRRERepairDaysByRODetails",
                          "isLocal": false,
                          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                          "requestMethod": "get",
                          "statusNullIgnore": true,
                          "params": {
                            "referanceOrderId": "#finalGetAllItemHistoryData.referenceOrderId",
                            "clientId": "#userSelectedClient",
                            "contractId": "#userSelectedContract",
                            "businessTransactionType": "1",
                            "ffName": "RERepairDays",
                            "userName": "#loginUUID.username"
                          }
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "microservice",
                                "hookType": "afterInit",
                                "config": {
                                  "microserviceId": "getServiceTypeCodeByRODetails",
                                  "isLocal": false,
                                  "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                                  "requestMethod": "get",
                                  "statusNullIgnore": true,
                                  "params": {
                                    "referanceOrderId": "#finalGetAllItemHistoryData.referenceOrderId",
                                    "clientId": "#userSelectedClient",
                                    "contractId": "#userSelectedContract",
                                    "businessTransactionType": "1",
                                    "ffName": "ServiceTypeCode",
                                    "userName": "#loginUUID.username"
                                  }
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "microservice",
                                        "config": {
                                          "microserviceId": "getEtravellerHoldReleaseDetailService",
                                          "requestMethod": "get",
                                          "params": {
                                            "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                            "operationType": "RELEASE",
                                            "userName": "#loginUUID.username"
                                          }
                                        },
                                        "eventSource": "click",
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "microservice",
                                                "hookType": "afterInit",
                                                "config": {
                                                  "microserviceId": "getReceiptIdByItem",
                                                  "isLocal": false,
                                                  "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                                                  "requestMethod": "get",
                                                  "params": {
                                                    "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                                    "userName": "#userAccountInfo.PersonalDetails.USERID"
                                                  }
                                                },
                                                "responseDependents": {
                                                  "onSuccess": {
                                                    "actions": [
                                                      {
                                                        "type": "microservice",
                                                        "hookType": "afterInit",
                                                        "config": {
                                                          "microserviceId": "getETravellerCurrPrevRODetailsBySN",
                                                          "isLocal": false,
                                                          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                                                          "requestMethod": "get",
                                                          "params": {
                                                            "serialNo": "#discrepancyUnitInfo.SERIAL_NO",
                                                            "locationId": "#userSelectedLocation",
                                                            "contractId": "#userSelectedContract",
                                                            "userName": "#loginUUID.username",
                                                            "clientId": "#userSelectedClient"
                                                          }
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "microservice",
                                                                "hookType": "afterInit",
                                                                "config": {
                                                                  "microserviceId": "getInboundAWBByRODetails",
                                                                  "isLocal": false,
                                                                  "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                                                                  "requestMethod": "get",
                                                                  "statusNullIgnore": true,
                                                                  "params": {
                                                                    "referanceOrderId": "#finalGetAllItemHistoryData.referenceOrderId",
                                                                    "clientId": "#userSelectedClient",
                                                                    "contractId": "#userSelectedContract",
                                                                    "businessTransactionType": "1",
                                                                    "ffName": "Inbound AWB",
                                                                    "userName": "#loginUUID.username"
                                                                  }
                                                                },
                                                                "responseDependents": {
                                                                  "onSuccess": {
                                                                    "actions": [
                                                                      {
                                                                        "type": "microservice",
                                                                        "hookType": "afterInit",
                                                                        "config": {
                                                                          "microserviceId": "getRepairTypeCodeByRODetails",
                                                                          "isLocal": false,
                                                                          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                                                                          "requestMethod": "get",
                                                                          "statusNullIgnore": true,
                                                                          "params": {
                                                                            "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                                                            "clientId": "#userSelectedClient",
                                                                            "contractId": "#userSelectedContract",
                                                                            "businessTransactionType": "1",
                                                                            "ffName": "RepairTypeCode",
                                                                            "userName": "#loginUUID.username"
                                                                          }
                                                                        },
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "microservice",
                                                                                "hookType": "afterInit",
                                                                                "config": {
                                                                                  "microserviceId": "getETravellerShipmentDetails",
                                                                                  "requestMethod": "get",
                                                                                  "ifDataNullIgnore": true,
                                                                                  "params": {
                                                                                    "locationId": "#userSelectedLocation",
                                                                                    "login": "#loginUUID.username",
                                                                                    "serialNo": "#shippingSerialNo",
                                                                                    "userName": "#loginUUID.username"
                                                                                  }
                                                                                },
                                                                                "responseDependents": {
                                                                                  "onSuccess": {
                                                                                    "actions": [
                                                                                      {
                                                                                        "type": "handlEtravellerServices",
                                                                                        "config": {
                                                                                          "type": "openDialogComponent",
                                                                                          "config": {
                                                                                            itemHistoryConsolidated: itemHistoryConsolidated,
                                                                                            actions: actions
                                                                                          }
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
                                                                                      },
                                                                                      {
                                                                                        "type": "handlEtravellerServices",
                                                                                        "config": {
                                                                                          "type": "openDialogComponent",
                                                                                          "config": {
                                                                                            itemHistoryConsolidated: itemHistoryConsolidated,
                                                                                            actions: actions
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
                                                                                "type": "handleCommonServices",
                                                                                "config": {
                                                                                  "type": "errorRenderTemplate",
                                                                                  "contextKey": "errorMsg",
                                                                                  "updateKey": "errorTitleUUID"
                                                                                }
                                                                              },
                                                                              {
                                                                                "type": "handlEtravellerServices",
                                                                                "config": {
                                                                                  "type": "openDialogComponent",
                                                                                  "config": {
                                                                                    itemHistoryConsolidated: itemHistoryConsolidated,
                                                                                    actions: actions
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
                                                                        "type": "handleCommonServices",
                                                                        "config": {
                                                                          "type": "errorRenderTemplate",
                                                                          "contextKey": "errorMsg",
                                                                          "updateKey": "errorTitleUUID"
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "handlEtravellerServices",
                                                                        "config": {
                                                                          "type": "openDialogComponent",
                                                                          "config": {
                                                                            itemHistoryConsolidated: itemHistoryConsolidated,
                                                                            actions: actions
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
                                                                "type": "handleCommonServices",
                                                                "config": {
                                                                  "type": "errorRenderTemplate",
                                                                  "contextKey": "errorMsg",
                                                                  "updateKey": "errorTitleUUID"
                                                                }
                                                              },
                                                              {
                                                                "type": "handlEtravellerServices",
                                                                "config": {
                                                                  "type": "openDialogComponent",
                                                                  "config": {
                                                                    itemHistoryConsolidated: itemHistoryConsolidated,
                                                                    actions: actions
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
                                                        "type": "handleCommonServices",
                                                        "config": {
                                                          "type": "errorRenderTemplate",
                                                          "contextKey": "errorMsg",
                                                          "updateKey": "errorTitleUUID"
                                                        }
                                                      },
                                                      {
                                                        "type": "handlEtravellerServices",
                                                        "config": {
                                                          "type": "openDialogComponent",
                                                          "config": {
                                                            itemHistoryConsolidated: itemHistoryConsolidated,
                                                            actions: actions
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
                                                "type": "handleCommonServices",
                                                "config": {
                                                  "type": "errorRenderTemplate",
                                                  "contextKey": "errorMsg",
                                                  "updateKey": "errorTitleUUID"
                                                }
                                              },
                                              {
                                                "type": "handlEtravellerServices",
                                                "config": {
                                                  "type": "openDialogComponent",
                                                  "config": {
                                                    itemHistoryConsolidated: itemHistoryConsolidated,
                                                    actions: actions
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
                                        "type": "handleCommonServices",
                                        "config": {
                                          "type": "errorRenderTemplate",
                                          "contextKey": "errorMsg",
                                          "updateKey": "errorTitleUUID"
                                        }
                                      },
                                      {
                                        "type": "handlEtravellerServices",
                                        "config": {
                                          "type": "openDialogComponent",
                                          "config": {
                                            itemHistoryConsolidated: itemHistoryConsolidated,
                                            actions: actions
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
                                "type": "handleCommonServices",
                                "config": {
                                  "type": "errorRenderTemplate",
                                  "contextKey": "errorMsg",
                                  "updateKey": "errorTitleUUID"
                                }
                              },
                              {
                                "type": "handlEtravellerServices",
                                "config": {
                                  "type": "openDialogComponent",
                                  "config": {
                                    itemHistoryConsolidated: itemHistoryConsolidated,
                                    actions: actions
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
                        "type": "handleCommonServices",
                        "config": {
                          "type": "errorRenderTemplate",
                          "contextKey": "errorMsg",
                          "updateKey": "errorTitleUUID"
                        }
                      },
                      {
                        "type": "handlEtravellerServices",
                        "config": {
                          "type": "openDialogComponent",
                          "config": {
                            itemHistoryConsolidated: itemHistoryConsolidated,
                            actions: actions
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
                "type": "handleCommonServices",
                "config": {
                  "type": "errorRenderTemplate",
                  "contextKey": "errorMsg",
                  "updateKey": "errorTitleUUID"
                }
              },
              {
                "type": "handlEtravellerServices",
                "config": {
                  "type": "openDialogComponent",
                  "config": {
                    itemHistoryConsolidated: itemHistoryConsolidated,
                    actions: actions
                  }
                }
              }
            ]
          }
        }
      }
    ];

    if (keyDataMicorservices) {
      keyDataMicorservices.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }
  }
  
  handleHpKeyDataMicorserviceAPIFromDashboard(itemHistoryConsolidated, actions, instance, actionService) {
    let keyDataMicorservices = [
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getkeyDataCustomerResponse",
          "isLocal": false,
          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
          "requestMethod": "get",
          "params": {
            "itemBcn": "#discrepancyUnitInfo.ITEM_BCN",
            "UserName": "#userAccountInfo.PersonalDetails.USERID"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "getkeyDataCustomerResponse",
                  "data": "responseData"
                }            
              },       
              {
                "type": "microservice",
                "hookType": "afterInit",
                "config": {
                  "microserviceId": "getCurrPrevRODetailsBySN",
                  "isLocal": false,
                  "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                  "requestMethod": "get",
                  "statusNullIgnore": true,
                  "params": {
                    "serialNo":"#discrepancyUnitInfo.SERIAL_NO",
                    "locationId":"#userSelectedLocation",
                    "contractId":"#userSelectedContract",
                    "userName":"#loginUUID.username",
                    "clientId":"#userSelectedClient"
                  }
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "context",
                        "config": {
                            "requestMethod": "add",
                            "key": "currPrevInfo",
                            "data": "responseData"
                        }
                      },
                      {
                        "type": "microservice",
                        "hookType": "afterInit",
                        "config": {
                          "microserviceId": "getRERepairCSOIDByRODetails",
                          "isLocal": false,
                          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                          "requestMethod": "get",
                          "statusNullIgnore": true,
                          "params": {
                            "referanceOrderId": "#finalGetAllItemHistoryData.referenceOrderId",
                            "clientId": "#userSelectedClient",
                            "contractId": "#userSelectedContract",
                            "businessTransactionType": "#currPrevInfo.bussinessTrxTypeId",
                            "ffName": "RERepairCSOID",
                            "userName": "#loginUUID.username"
                          }
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "microservice",
                                "hookType": "afterInit",
                                "config": {
                                  "microserviceId": "getRRERepairDaysByRODetails",
                                  "isLocal": false,
                                  "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                                  "requestMethod": "get",
                                  "statusNullIgnore": true,
                                  "params": {
                                    "referanceOrderId": "#finalGetAllItemHistoryData.referenceOrderId",
                                    "clientId": "#userSelectedClient",
                                    "contractId": "#userSelectedContract",
                                    "businessTransactionType": "#currPrevInfo.bussinessTrxTypeId",
                                    "ffName": "RERepairDays",
                                    "userName": "#loginUUID.username"
                                  }
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "microservice",
                                        "hookType": "afterInit",
                                        "config": {
                                          "microserviceId": "getServiceTypeCodeByRODetails",
                                          "isLocal": false,
                                          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                                          "requestMethod": "get",
                                          "statusNullIgnore": true,
                                          "params": {
                                            "referanceOrderId": "#finalGetAllItemHistoryData.referenceOrderId",
                                            "clientId": "#userSelectedClient",
                                            "contractId": "#userSelectedContract",
                                            "businessTransactionType": "#currPrevInfo.bussinessTrxTypeId",
                                            "ffName": "ServiceTypeCode",
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
                                                  "key": "shippingAbbrevCodeData",
                                                  "data": "responseData"
                                                }
                                              },
                                              {
                                                "type": "microservice",
                                                "config": {
                                                  "microserviceId": "getEtravellerHoldReleaseDetailService",
                                                  "requestMethod": "get",
                                                  "params": {
                                                    "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                                    "operationType": "RELEASE",
                                                    "userName": "#loginUUID.username"
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
                                                          "key": "getEtravellerHoldReleaseDetailService",
                                                          "data": "responseData"
                                                        }
                                                      },
                                                      {
                                                        "type": "microservice",
                                                        "hookType": "afterInit",
                                                        "config": {
                                                          "microserviceId": "getReceiptIdByItem",
                                                          "isLocal": false,
                                                          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                                                          "requestMethod": "get",
                                                          "params": {
                                                            "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                                            "userName": "#userAccountInfo.PersonalDetails.USERID"
                                                          }
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "microservice",
                                                                "hookType": "afterInit",
                                                                "config": {
                                                                  "microserviceId": "getETravellerCurrPrevRODetailsBySN",
                                                                  "isLocal": false,
                                                                  "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                                                                  "requestMethod": "get",
                                                                  "params": {
                                                                    "serialNo": "#discrepancyUnitInfo.SERIAL_NO",
                                                                    "locationId": "#userSelectedLocation",
                                                                    "contractId": "#userSelectedContract",
                                                                    "userName": "#loginUUID.username",
                                                                    "clientId": "#userSelectedClient"
                                                                  }
                                                                },
                                                                "responseDependents": {
                                                                  "onSuccess": {
                                                                    "actions": [
                                                                      {
                                                                        "type": "context",
                                                                        "config": {
                                                                          "requestMethod": "add",
                                                                          "key": "currentPrevData",
                                                                          "data": "responseData"
                                                                        }
                                                                      },
                                                                      {
                                                                          "type": "microservice",
                                                                          "config": {
                                                                              "microserviceId": "getPartModelAndWarrentyDetails",
                                                                              "requestMethod": "get",
                                                                              "params": {
                                                                                  "locationId": "#currentPrevData.0.locationId",
                                                                                  "clientId": "#currentPrevData.0.clientId",
                                                                                  "contractId": "#currentPrevData.0.contractId",
                                                                                  "reforderId": "#shippingRoOoResponse.referenceOrderId",
                                                                                  "partNumber": "#shippingRoOoResponse.partNo",
                                                                                  "userName": "#userAccountInfo.PersonalDetails.USERID"
                                                                          },                                                                  
                                                                        },
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "context",
                                                                                "config": {
                                                                                  "requestMethod": "add",
                                                                                  "key": "discrepancyPartAndWarrantyDetails",
                                                                                  "data": "responseData"
                                                                                }
                                                                              },
                                                                              {
                                                                                "type": "microservice",
                                                                                "hookType": "afterInit",
                                                                                "config": {
                                                                                  "microserviceId": "getBiosAlertDetailsAssessment",
                                                                                  "isLocal": false,
                                                                                  "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                                                                                  "requestMethod": "get",
                                                                                  "params": {
                                                                                    "customInstructionType": "BIOS",
                                                                                    "sourceType": "#getReferenceDataKeys.sourceType",
                                                                                    "serialNumber": "",
                                                                                    "partNumber": "",
                                                                                    "productPlatform": "#discrepancyPartAndWarrantyDetails.PRODUCT_PLATFORM",
                                                                                    "secondSource": "",
                                                                                    "username": "#userAccountInfo.PersonalDetails.USERID",
                                                                                    "locationId": "#userSelectedLocation",
                                                                                    "clientId": "#userSelectedClient",
                                                                                    "contractId": "#userSelectedContract"
                                                                                  }
                                                                                },
                                                                                "responseDependents": {
                                                                                  "onSuccess": {
                                                                                    "actions": [
                                                                                      {
                                                                                        "type": "context",
                                                                                        "config": {
                                                                                          "requestMethod": "add",
                                                                                          "key": "biosAlert",
                                                                                          "data": "responseData"
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
                                                                                "type": "microservice",
                                                                                "hookType": "afterInit",
                                                                                "config": {
                                                                                  "microserviceId": "getSoftwareAlertDetailsAssessment",
                                                                                  "isLocal": false,
                                                                                  "LocalService": "assets/Responses/repairMockEcoResponse.json",
                                                                                  "requestMethod": "get",
                                                                                  "params": {
                                                                                    "customInstructionType": "SOFTWARE",
                                                                                    "sourceType": "PARTNO",
                                                                                    "serialNumber": "",
                                                                                    "partNumber": "#shippingRoOoResponse.partNo",
                                                                                    "productPlatform": "",
                                                                                    "secondSource": "",
                                                                                    "username": "#userAccountInfo.PersonalDetails.USERID",
                                                                                    "locationId": "#userSelectedLocation",
                                                                                    "clientId": "#userSelectedClient",
                                                                                    "contractId": "#userSelectedContract"
                                                                                  }
                                                                                },
                                                                                "responseDependents": {
                                                                                  "onSuccess": {
                                                                                    "actions": [
                                                                                      {
                                                                                        "type": "context",
                                                                                        "config": {
                                                                                          "requestMethod": "add",
                                                                                          "key": "softwareAlert",
                                                                                          "data": "responseData"
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
        
                                                                            ]
                                                                          }
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "microservice",
                                                                        "config": {
                                                                          "microserviceId": "getInitialDetailsAssessment",
                                                                          "requestMethod": "get",
                                                                          "LocalService": "assets/Responses/repairAssessementResponse.json",
                                                                          "isLocal": false,
                                                                          "params": {
                                                                            "itemBcn": "#discrepancyUnitInfo.ITEM_BCN",
                                                                            "roHeaderFFIds": "#getReferenceDataKeys.roheaderffIds",
                                                                            "roLineFFIds": "#getReferenceDataKeys.rolineffIds",
                                                                            "workCenterFFIds": "#getReferenceDataKeys.workcenterffIds",
                                                                            "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                                                            "userName": "#userAccountInfo.PersonalDetails.USERID"
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
                                                                                  "key": "customeDesc",
                                                                                  "data": "responseData"
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
                                                                        "type": "microservice",
                                                                        "hookType": "afterInit",
                                                                        "config": {
                                                                          "microserviceId": "getInboundAWBByRODetails",
                                                                          "isLocal": false,
                                                                          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                                                                          "requestMethod": "get",
                                                                          "statusNullIgnore": true,
                                                                          "params": {
                                                                            "referanceOrderId": "#finalGetAllItemHistoryData.referenceOrderId",
                                                                            "clientId": "#userSelectedClient",
                                                                            "contractId": "#userSelectedContract",
                                                                            "businessTransactionType": "#currPrevInfo.bussinessTrxTypeId",
                                                                            "ffName": "Inbound AWB",
                                                                            "userName": "#loginUUID.username"
                                                                          }
                                                                        },
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "microservice",
                                                                                "hookType": "afterInit",
                                                                                "config": {
                                                                                  "microserviceId": "getRepairTypeCodeByRODetails",
                                                                                  "isLocal": false,
                                                                                  "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                                                                                  "requestMethod": "get",
                                                                                  "statusNullIgnore": true,
                                                                                  "params": {
                                                                                    "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                                                                    "clientId": "#userSelectedClient",
                                                                                    "contractId": "#userSelectedContract",
                                                                                    "businessTransactionType": "#currPrevInfo.bussinessTrxTypeId",
                                                                                    "ffName": "RepairTypeCode",
                                                                                    "userName": "#loginUUID.username"
                                                                                  }
                                                                                },
                                                                                "responseDependents": {
                                                                                  "onSuccess": {
                                                                                    "actions": [
                                                                                      
                                                                                      {
                                                                                        "type": "microservice",
                                                                                        "hookType": "afterInit",
                                                                                        "config": {
                                                                                          "microserviceId": "getETravellerShipmentDetails",
                                                                                          "requestMethod": "get",
                                                                                          "ifDataNullIgnore": true,
                                                                                          "params": {
                                                                                            "locationId": "#userSelectedLocation",
                                                                                            "login": "#loginUUID.username",
                                                                                            "serialNo": "#shippingSerialNo",
                                                                                            "userName": "#loginUUID.username"
                                                                                          }
                                                                                        },
                                                                                        "responseDependents": {
                                                                                          "onSuccess": {
                                                                                            "actions": [
                                                                                              {
                                                                                                "type": "renderKeyDataTwice"
                                                                                              },
                                                                                              {
                                                                                                "type": "handlEtravellerServices",
                                                                                                "config": {
                                                                                                  "type": "openDialogComponent",
                                                                                                  "config": {
                                                                                                    itemHistoryConsolidated: itemHistoryConsolidated,
                                                                                                    actions: actions
                                                                                                  }
                                                                                                }
                                                                                              }                                                                                      
                                                                                            ]
                                                                                          },
                                                                                          "onFailure": {
                                                                                            "actions": [
                                                                                              {
                                                                                                "type": "handlEtravellerServices",
                                                                                                "config": {
                                                                                                  "type": "openDialogComponent",
                                                                                                  "config": {
                                                                                                    itemHistoryConsolidated: itemHistoryConsolidated,
                                                                                                    actions: actions
                                                                                                  }
                                                                                                }
                                                                                              },
                                                                                              {
                                                                                                "type": "renderKeyDataTwice"
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
                                                                                      }
                                                                                    ]
                                                                                  },
                                                                                  "onFailure": {
                                                                                    "actions": [
                                                                                      {
                                                                                        "type": "handlEtravellerServices",
                                                                                        "config": {
                                                                                          "type": "openDialogComponent",
                                                                                          "config": {
                                                                                            itemHistoryConsolidated: itemHistoryConsolidated,
                                                                                            actions: actions
                                                                                          }
                                                                                        }
                                                                                      },
                                                                                      {
                                                                                        "type": "renderKeyDataTwice"
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
                                                                              }
        
                                                                            ]
                                                                          },
                                                                          "onFailure": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "microservice",
                                                                                "hookType": "afterInit",
                                                                                "config": {
                                                                                  "microserviceId": "getRepairTypeCodeByRODetails",
                                                                                  "isLocal": false,
                                                                                  "LocalService": "assets/Responses/repairMockBIOSResponse.json",
                                                                                  "requestMethod": "get",
                                                                                  "statusNullIgnore": true,
                                                                                  "params": {
                                                                                    "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                                                                    "clientId": "#userSelectedClient",
                                                                                    "contractId": "#userSelectedContract",
                                                                                    "businessTransactionType": "1",
                                                                                    "ffName": "RepairTypeCode",
                                                                                    "userName": "#loginUUID.username"
                                                                                  }
                                                                                },
                                                                                "responseDependents": {
                                                                                  "onSuccess": {
                                                                                    "actions": [
                                                                                      {
                                                                                        "type": "microservice",
                                                                                        "hookType": "afterInit",
                                                                                        "config": {
                                                                                          "microserviceId": "getETravellerShipmentDetails",
                                                                                          "requestMethod": "get",
                                                                                          "ifDataNullIgnore": true,
                                                                                          "params": {
                                                                                            "locationId": "#userSelectedLocation",
                                                                                            "login": "#loginUUID.username",
                                                                                            "serialNo": "#shippingSerialNo",
                                                                                            "userName": "#loginUUID.username"
                                                                                          }
                                                                                        },
                                                                                        "responseDependents": {
                                                                                          "onSuccess": {
                                                                                            "actions": [
                                                                                              {
                                                                                                "type": "renderKeyDataTwice"
                                                                                              },
                                                                                              {
                                                                                                "type": "handlEtravellerServices",
                                                                                                "config": {
                                                                                                  "type": "openDialogComponent",
                                                                                                  "config": {
                                                                                                    itemHistoryConsolidated: itemHistoryConsolidated,
                                                                                                    actions: actions
                                                                                                  }
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
                                                                                              },
                                                                                              {
                                                                                                "type": "renderKeyDataTwice"
                                                                                              },
                                                                                              {
                                                                                                "type": "handlEtravellerServices",
                                                                                                "config": {
                                                                                                  "type": "openDialogComponent",
                                                                                                  "config": {
                                                                                                    itemHistoryConsolidated: itemHistoryConsolidated,
                                                                                                    actions: actions
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
                                                                                        "type": "handleCommonServices",
                                                                                        "config": {
                                                                                          "type": "errorRenderTemplate",
                                                                                          "contextKey": "errorMsg",
                                                                                          "updateKey": "errorTitleUUID"
                                                                                        }
                                                                                      },
                                                                                      {
                                                                                        "type": "renderKeyDataTwice"
                                                                                      },
                                                                                      {
                                                                                        "type": "handlEtravellerServices",
                                                                                        "config": {
                                                                                          "type": "openDialogComponent",
                                                                                          "config": {
                                                                                            itemHistoryConsolidated: itemHistoryConsolidated,
                                                                                            actions: actions
                                                                                          }
                                                                                        }
                                                                                      } 
                                                                                    ]
                                                                                  }
                                                                                }
                                                                              },
                                                                              {
                                                                                "type": "handleCommonServices",
                                                                                "config": {
                                                                                  "type": "errorRenderTemplate",
                                                                                  "contextKey": "errorMsg",
                                                                                  "updateKey": "errorTitleUUID"
                                                                                }
                                                                              },
                                                                              {
                                                                                "type": "renderKeyDataTwice"
                                                                              },
                                                                              {
                                                                                "type": "handlEtravellerServices",
                                                                                "config": {
                                                                                  "type": "openDialogComponent",
                                                                                  "config": {
                                                                                    itemHistoryConsolidated: itemHistoryConsolidated,
                                                                                    actions: actions
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
                                                                        "type": "handleCommonServices",
                                                                        "config": {
                                                                          "type": "errorRenderTemplate",
                                                                          "contextKey": "errorMsg",
                                                                          "updateKey": "errorTitleUUID"
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "renderKeyDataTwice"
                                                                      },
                                                                      {
                                                                        "type": "handlEtravellerServices",
                                                                        "config": {
                                                                          "type": "openDialogComponent",
                                                                          "config": {
                                                                            itemHistoryConsolidated: itemHistoryConsolidated,
                                                                            actions: actions
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
                                                                "type": "handleCommonServices",
                                                                "config": {
                                                                  "type": "errorRenderTemplate",
                                                                  "contextKey": "errorMsg",
                                                                  "updateKey": "errorTitleUUID"
                                                                }
                                                              },
                                                              {
                                                                "type": "renderKeyDataTwice"
                                                              },
                                                              {
                                                                "type": "handlEtravellerServices",
                                                                "config": {
                                                                  "type": "openDialogComponent",
                                                                  "config": {
                                                                    itemHistoryConsolidated: itemHistoryConsolidated,
                                                                    actions: actions
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
                                                        "type": "handleCommonServices",
                                                        "config": {
                                                          "type": "errorRenderTemplate",
                                                          "contextKey": "errorMsg",
                                                          "updateKey": "errorTitleUUID"
                                                        }
                                                      },
                                                      {
                                                        "type": "renderKeyDataTwice"
                                                      },
                                                      {
                                                        "type": "handlEtravellerServices",
                                                        "config": {
                                                          "type": "openDialogComponent",
                                                          "config": {
                                                            itemHistoryConsolidated: itemHistoryConsolidated,
                                                            actions: actions
                                                          }
                                                        }
                                                      } 
                                                    ]
                                                  }
                                                }
                                              },
                                              {
                                                "type": "microservice",
                                                "config": {
                                                  "microserviceId": "getShippingTermsDetails",
                                                  "requestMethod": "get",
                                                  "params": {
                                                    "outBoundOrderId": "#shippingRoOoResponse.outboundOrderId",
                                                    "tradingPartnerId": "#shippingRoOoResponse.tradingPartnerId",
                                                    "abbrevCode": "#shippingAbbrevCodeData",
                                                    "userName": "#userAccountInfo.PersonalDetails.USERID"
                                                  }
                                                },
                                                "eventSource": "click",
                                                "responseDependents": {
                                                  "onSuccess": {
                                                    "actions": [{
                                                      "type": "context",
                                                      "config": {
                                                        "requestMethod": "add",
                                                        "key": "shippingTermsDetails",
                                                        "data": "responseData"
                                                      }
                                                    }]
                                                  },
                                                  "onFailure": {
                                                    "actions": [
        
                                                    ]
                                                  }
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
                                              },
                                              {
                                                "type": "renderKeyDataTwice"
                                              },
                                              {
                                                "type": "handlEtravellerServices",
                                                "config": {
                                                  "type": "openDialogComponent",
                                                  "config": {
                                                    itemHistoryConsolidated: itemHistoryConsolidated,
                                                    actions: actions
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
                                        "type": "handleCommonServices",
                                        "config": {
                                          "type": "errorRenderTemplate",
                                          "contextKey": "errorMsg",
                                          "updateKey": "errorTitleUUID"
                                        }
                                      },
                                      {
                                        "type": "renderKeyDataTwice"
                                      },
                                      {
                                        "type": "handlEtravellerServices",
                                        "config": {
                                          "type": "openDialogComponent",
                                          "config": {
                                            itemHistoryConsolidated: itemHistoryConsolidated,
                                            actions: actions
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
                                "type": "handleCommonServices",
                                "config": {
                                  "type": "errorRenderTemplate",
                                  "contextKey": "errorMsg",
                                  "updateKey": "errorTitleUUID"
                                }
                              },
                              {
                                "type": "renderKeyDataTwice"
                              },
                              {
                                "type": "handlEtravellerServices",
                                "config": {
                                  "type": "openDialogComponent",
                                  "config": {
                                    itemHistoryConsolidated: itemHistoryConsolidated,
                                    actions: actions
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
                        "type": "renderKeyDataTwice"
                      },
                      {
                        "type": "handlEtravellerServices",
                        "config": {
                          "type": "openDialogComponent",
                          "config": {
                            itemHistoryConsolidated: itemHistoryConsolidated,
                            actions: actions
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
                "type": "handleCommonServices",
                "config": {
                  "type": "errorRenderTemplate",
                  "contextKey": "errorMsg",
                  "updateKey": "errorTitleUUID"
                }
              },
              {
                "type": "renderKeyDataTwice"
              },
              {
                "type": "handlEtravellerServices",
                "config": {
                  "type": "openDialogComponent",
                  "config": {
                    itemHistoryConsolidated: itemHistoryConsolidated,
                    actions: actions
                  }
                }
              } 
            ]
          }
        }
      }
    ];

    if (keyDataMicorservices) {
      keyDataMicorservices.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }
  }

  handleHpFlexFieldMicorserviceAPI( instance,actionService) {
    let flexFieldMicorservices = [
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getFFDetailsByItemId",
          "isLocal": false,
          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
          "requestMethod": "get",
          "params": {
            "itemId": "#discrepancyUnitInfo.ITEM_ID",
            "locationName": "#userSelectedLocationName",
            "ownerName": "#userSelectedClientName",
            "userName": "#loginUUID.username"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
             
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
    ];

    if (flexFieldMicorservices) {
      flexFieldMicorservices.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }
  }

  // Handle HP-Parts Micorservices
  handleHpPartsMicorserviceAPI(instance, actionService) {
    let partsMicorservices = [
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getETravellerIssuedPartsDetailsRequest",
          "requestMethod": "get",
          "isLocal": false,
          "LocalService": "assets/verifoneBlankPage.json",
          "params": {
            "locationId": "#userSelectedLocation",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "partNo": "#repairUnitInfo.PART_NO",
            "itemId": "#repairUnitInfo.ITEM_ID",
            "userName": "#userAccountInfo.PersonalDetails.USERID"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "handlEtravellerServices",
                "config": {
                  "type": "filteringissuedRemovedParts",
                  "filterkey": "getETravellerIssuedPartsDetailsRequest",
                  "contextKey": "getETravellerRemovedPartsDetails"
                }
              },
              {
                "type": "handlEtravellerServices",
                "config": {
                  "type": "addIndextoArray",
                  "data": "getETravellerIssuedPartsDetailsRequest"
                }
              },
              {
                "type": "handlEtravellerServices",
                "config": {
                  "type": "addIndextoArray",
                  "data": "getETravellerRemovedPartsDetails"
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
                  "key": "errorResp",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "errorTitleUUID",
                  "properties": {
                    "titleValue": "#errorResp",
                    "isShown": true
                  }
                }
              }
            ]
          }
        }
      },
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getETravellerPartsReturnedToStock",
          "isLocal": false,
          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
          "requestMethod": "get",
          "params": {
            "itemBCN": "#discrepancyUnitInfo.ITEM_BCN",
            "userName": "#loginUUID.username",
            "locationId": "#userSelectedLocation",
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "handlEtravellerServices",
                "config": {
                  "type": "addIndextoArray",
                  "data": "getETravellerPartsReturnedToStock"
                }
              },
              {
                "type": "handlEtravellerServices",
                "config": {
                  "type": "trimDateTime",
                  "data": "getETravellerPartsReturnedToStock"
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
      },
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getETravellerAllRequisitionHistory",
          "isLocal": false,
          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
          "requestMethod": "get",
          "params": {
            "itemBCN": "#discrepancyUnitInfo.ITEM_BCN",
            "userName": "#loginUUID.username",
            "locationId": "#userSelectedLocation",
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "handlEtravellerServices",
                "config": {
                  "type": "filteringDuplicateRequisitionHistory",
                  "filterkey": "getETravellerAllRequisitionHistory",
                  "contextKey": "getETravellerUniqueRequisitionHistory"
                }
              },
              {
                "type": "handlEtravellerServices",
                "config": {
                  "type": "addStaticDataToArray",
                  "data": "getETravellerUniqueRequisitionHistory",
                  "staticData": "#loginUUID.username"
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
      },
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getETravellerAllUndoissueHistory",
          "isLocal": false,
          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
          "requestMethod": "get",
          "params": {
            "itemBCN": "#discrepancyUnitInfo.ITEM_BCN",
            "userName": "#loginUUID.username",
            "locationId": "#userSelectedLocation",
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "handlEtravellerServices",
                "config": {
                  "type": "addIndextoArray",
                  "data": "getETravellerAllUndoissueHistory"
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
    ];

    if (partsMicorservices) {
      partsMicorservices.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }
  }

  handleHpRepositoryMicorserviceAPI(instance, actionService){
    let location=this.contextService.getDataByString('#userSelectedLocationName');
    let locationName=location.toUpperCase();
    let repositoryMicorservices = [
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getPrintTemplateDetails",
          "requestMethod": "get",
          "isLocal": false,
          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
          "params": {
           "userName": "#userAccountInfo.PersonalDetails.USERID",
           "locationName":locationName,
           "clientName": "#discrepancyUnitInfo.CLIENTNAME",
           "contractName": "#discrepancyUnitInfo.CONTRACTNAME"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "getetravellerRepositaryPrintsdata",
                  "data": "responseData"
                }
              },
              {
                "type": "handlEtravellerServices",
                "config": {
                  "type": "addValueAction",
                  "data": "getetravellerRepositaryPrintsdata"
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
                  "key": "errorResp",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "errorTitleUUID",
                  "properties": {
                    "titleValue": "#errorResp",
                    "isShown": true
                  }
                }
              }
            ]
          }
        }
      },
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getETravellerPrints",
          "requestMethod": "get",
          "isLocal": true,
          "LocalService": "assets/Responses/mockBGA.json",
          "params": {
            "locationId": "#userSelectedLocation",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "partNo": "#repairUnitInfo.PART_NO",
            "itemId": "#repairUnitInfo.ITEM_ID",
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
                  "key": "getetravellerRepositaryImagesdata",
                  "data": "responseData"
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
                  "key": "errorResp",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "errorTitleUUID",
                  "properties": {
                    "titleValue": "#errorResp",
                    "isShown": true
                  }
                }
              }
            ]
          }
        }
      },
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getETravellerPrints",
          "requestMethod": "get",
          "isLocal": true,
          "LocalService": "assets/Responses/mockTCStop.json",
          "params": {
            "locationId": "#userSelectedLocation",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "partNo": "#repairUnitInfo.PART_NO",
            "itemId": "#repairUnitInfo.ITEM_ID",
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
                  "key": "getetravellerRepositaryVideosdata",
                  "data": "responseData"
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
                  "key": "errorResp",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "errorTitleUUID",
                  "properties": {
                    "titleValue": "#errorResp",
                    "isShown": true
                  }
                }
              }
            ]
          }
        }
      }
    ];

    if (repositoryMicorservices) {
      repositoryMicorservices.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }
  }
  //Method related to the HP - Parts
  //Filtering issued and removed parts from the requsitions list
  filteringissuedRemovedParts(action, instance, scope) {
    let partDetails = this.contextService.getDataByKey(action.config.filterkey)
    let filteredData = partDetails.filter((ele, index) => {
      if (ele.transactionType == "Removed") {
        partDetails.splice(index, 1);
        return ele;
      }
      return (ele.transactionType == "Removed");
    });
    this.contextService.addToContext(action.config.contextKey, filteredData)
  }
  //Method related to the HP - Parts
  //Removing the duplicate requisitions from the requsitions list
  filteringDuplicateRequisitionHistory(action, instance, scope) {
    let requisitions = this.contextService.getDataByKey(action.config.filterkey);
    let filteredData = [];
    requisitions.forEach(obj => {
      let data = filteredData.length > 0 &&
        filteredData.find((i) => i.requisitionId === obj.requisitionId);
      if (data) {
        return;
      }
      else {
        filteredData.push(obj);
      }
      this.contextService.addToContext(action.config.contextKey, filteredData)
    });
  }

  openEtravellerFromDashboard(actions, scope, actionService) {
    let shippingFromDashboard = this.contextService.getDataByKey('shippingFromDashboard');
    let clientname = this.contextService.getDataByString("#UnitInfo.CLIENTNAME");
    let itemId = "#discrepancyUnitInfo.ITEM_ID";
    let verifoneClientName = this.contextService.getDataByKey("userSelectedClientName");
    if (clientname && clientname != undefined) {
      if (clientname == "CISCO") {
        itemId = "#UnitInfo.ITEM_ID";
      }
    }
    if (shippingFromDashboard !== undefined && shippingFromDashboard) {
      itemId = "#shippingRoOoResponse.itemId";
    }
    if (verifoneClientName && verifoneClientName.toLowerCase() == "verifone") {
      let unitItemId = this.contextService.getDataByKey("UnitInfo");
      if (unitItemId) {
        itemId = "#UnitInfo.ITEM_ID";
      } else {
        itemId = "#VerfoneUnitItemID";
      }

    }

    let actionData = [];
    if (clientname == "CISCO") {
      actionData = [{
        config: {
          "itemId": itemId,
          "userName": "#loginUUID.username",
          "microserviceId": "getAllItemHistoryCISCO"
          // "microserviceId": "getAllItemHistory"
        }
      }];
    } else {
      actionData = [{
        config: {
          "itemId": itemId,
          "userName": "#loginUUID.username",
          "microserviceId": "getAllItemHistory"
        }
      }];
    }
    this.geteTravellerDetails(actionData).subscribe((res) => {
      if (res && res !== null && res != undefined) {
        let itemHistory = res.data;
        let data;
        if (itemHistory && itemHistory != null && itemHistory != undefined) {
          //itemHistory = itemHistory.table;
          if (itemHistory && itemHistory != null && itemHistory != undefined) {
            this.contextService.addToContext("finalGetAllItemHistoryData", itemHistory[0]);
            let itemHistoryConsolidated = [];
            for (let i = 0; i < itemHistory.length; i++) {

              let historyEntry = itemHistory[i];
              let historyListItem = {};

              if (clientname == "CISCO") {
                historyListItem = {
                  timestamp: historyEntry.timestamp ? historyEntry.timestamp : historyEntry.timeStamp,
                  workcentername: historyEntry.workCenterName,
                  orderitemopername: historyEntry.orderItemOperName,
                  note: historyEntry.note,
                  details: "",
                  conditionname: "na",
                  login: historyEntry.login,
                  orderprocesstypecode: "na",
                  referenceorderid: "na",
                  orderid: "na",
                  itemtrxlogid: historyEntry.itemTrxLogId,
                  replacedAddedPN: historyEntry.partNo,
                  location: historyEntry.location
                };
              } else {
                historyListItem = {
                  timestamp: historyEntry.timestamp ? historyEntry.timestamp : historyEntry.timeStamp,
                  workcentername: historyEntry.workCenterName,
                  orderitemopername: historyEntry.orderItemOperName,
                  note: historyEntry.note,
                  details: "",
                  conditionname: historyEntry.conditionName,
                  login: historyEntry.login,
                  orderprocesstypecode: historyEntry.orderProcessTypeCode,
                  referenceorderid: historyEntry.referenceOrderId,
                  orderid: historyEntry.orderId,
                  itemtrxlogid: historyEntry.itemTrxLogId
                };
              }

              itemHistoryConsolidated.push(historyListItem);
            }
            if (clientname = "HP" && actions.config &&
              actions.config.keyDataVisible != undefined &&
              actions.config.keyDataVisible) {

              this.handleHpKeyDataMicorserviceAPIFromDashboard(itemHistoryConsolidated, actions, scope, actionService);
            }if(clientname = "HP" && actions.config &&
            actions.config.flexFieldVisible != undefined &&
            actions.config.flexFieldVisible){
              this.handleHpFlexFieldMicorserviceAPI(scope,actionService);
            }
            if (clientname = "HP" && actions.config &&
              actions.config.partsVisible != undefined &&
              actions.config.partsVisible) {
              this.handleHpPartsMicorserviceAPI(scope, actionService);
            }if (clientname = "HP" && actions.config &&
            actions.config.repositoryVisible != undefined &&
            actions.config.repositoryVisible) {
            this.handleHpRepositoryMicorserviceAPI(scope, actionService);
          }
            else {
              data = {
                itemHistoryConsolidated: itemHistoryConsolidated,
                actions: actions
              }
              this.openDialogComponent(data);
            }
          }
        }
      }
    });
  }

  renderKeyDataTwice(action, instance, actionService) {
    
    let processJson = [
      {
        "unitDetailTitle": "Unit Details",
        "ctype": "keyDataUnitDetails",
        "UUID": "unitDetailsUUID",
        "unitDetailItems": [
          {
            "leftColumnData": [
              {
                "label": "Unit BCN",
                "value": "#discrepancyUnitInfo.ITEM_BCN"
              },
              {
                "label": "Serial number",
                "value": "#discrepancyUnitInfo.SERIAL_NO"
              },
              {
                "label": "FAT",
                "value": "#discrepancyUnitInfo.FAT"
              }, {
                "label": "Model number",
                "value": "#shippingRoOoResponse.partNo"
              },{
                "label": "Description",
                "value": "#discrepancyPartAndWarrantyDetails.PART_DESC"
              },
              {
                "label": "Platform",
                "value": "#discrepancyPartAndWarrantyDetails.PRODUCT_PLATFORM"
              }, {
                "label": "RepairTypeCode",
                "value": "#getRepairTypeCodeByRODetails"
              }, {
                "label": "RERepairCSOID",
                "value": "#getRERepairCSOIDByRODetails"
              },
              {
                "label": "RERepairDays",
                "value": "#getRRERepairDaysByRODetails"
              }
            ]
          },
          {
            "rightColumnData": [
              {
                "label": "Hold Status",
                "value": "1"
              },
              {
                "label": "Storage Hold code",
                "value": "#getEtravellerHoldReleaseDetailService.storateHoldCode"
              },
              {
                "label": "Storage Hold Code Desc",
                "value": "#getEtravellerHoldReleaseDetailService.storateHoldSubCode"
              },
              {
                "label": "Location",
                "value": "#userSelectedLocationName"
              },
              {
                "label": "Warehouse",
                "value": "#getEtravellerHoldReleaseDetailService.wareHouseName"
              },
              {
                "label": "Zone",
                "value": "#getEtravellerHoldReleaseDetailService.destStkLocationName"
              },
              {
                "label": "Bin",
                "value": "#getEtravellerHoldReleaseDetailService.bin"
              }, {
                "label": "Client",
                "value": "#userSelectedClientName"
              },
              {
                "label": "Contract",
                "value": "#shippingRoOoResponse.contractName"
              },
              {
                "label": "Workcenter",
                "value": "#getEtravellerHoldReleaseDetailService.workcenterName"
              }
            ]
          }
        ]
      },
      {
        "label": "Customer Complaint",
        "UUID": "customerComplainUUID",
        "customerComplainTitle": "Customer Complaint",
        "customerComplainItems": [
          {
            "ctype": "title",
            "uuid": "customerComplaintHeaderUUID",
            "titleClass": "sidenav-title body2",
            "title": "Customer Complaint",
            "titleValue": ""
          },
          {
            "ctype": "showMore",
            "uuid": "customerComplaintTitleUUID",
            "titleClass": "sidenav-title body2",
            "text": "#customeDesc.customerComplaints",
            "isShown": true
          },
          {
            "ctype": "title",
            "uuid": "failCodeUUID",
            "titleClass": "sidenav-title body2 os-field",
            "title": "Fail Code:",
            "titleValue": "#customeDesc.failCode"
          },
          {
            "ctype": "title",
            "uuid": "osReinstallUUID",
            "titleClass": "sidenav-title body2",
            "title": "OS reinstall allowed:",
            "titleValue": "#customeDesc.osReinstallAllowed"
          },
          {
            "ctype": "title",
            "uuid": "bsodFieldUUID",
            "titleClass": "sidenav-title body2",
            "title": "BSOD Problem:",
            "titleValue": "#customeDesc.bsod"
          },
          {
            "ctype": "title",
            "uuid": "winPasswordUUID",
            "titleClass": "sidenav-title body2",
            "title": "Windows password:",
            "titleValue": "#customeDesc.windowsPassword"
          },
          {
            "ctype": "title",
            "uuid": "biosVersionTitleUUID",
            "titleClass": "sidenav-title body2",
            "title": "Expected Bios Version:",
            "titleValue": "#biosAlert.0.bios"
          },
          {
            "ctype": "title",
            "uuid": "osLanguageUUID",
            "titleClass": "sidenav-title body2",
            "title": "OS Language:",
            "titleValue": "#customeDesc.osLanguage"
          },
          {
            "ctype": "title",
            "uuid": "softwareVersionTitleUUID",
            "titleClass": "sidenav-title body2 os-field",
            "title": "OS Version:",
            "titleValue": "#softwareAlert.0.software"
          }
        ]
      },
      {
        "UUID": "orderDetailsUUID",
        "orderDetailsTitle": "Order Details",
        "orderDetailsItems": [
          {
            "label": "Reference Order",
            "value": "#getETravellerCurrPrevRODetailsBySN.0.referenceOrderId"
          },
          {
            "label": "Create Date",
            "value": "#getETravellerCurrPrevRODetailsBySN.0.roCreatedDate"
          }, {
            "label": "ServiceTypeCode",
            "value": "#shippingTermsDetails.0.serviceTypeCode"
          },
          {
            "space": true,
            "spaceStyle": "padding:5%"
          },
          {
            "label": "Receipt Date",
            "value": "#getReceiptIdByItem.0.receiptTimeStamp"
          },
          {
            "label": "Inbound AWB",
            "value": "#getInboundAWBByRODetails"
          },
          {
            "label": "Tracking No",
            "value": "#getReceiptIdByItem.0.trackingNo"
          },
          {
            "space": true,
            "spaceStyle": "padding:3%"
          },
          {
            "label": "Work Order No",
            "value": "#discrepancyUnitInfo.WORKORDER_ID"
          },
          {
            "label": "TransactionCommentText",
            "value": "#getkeyDataCustomerResponse.tranCmntText"
          },
          {
            "space": true,
            "spaceStyle": "padding:3%"
          },
          {
            "label": "Outbound order No",
            "value": "#shippingRoOoResponse.outboundOrderId"
          },
          {
            "label": "Packing List No",
            "value": "#finalGetAllItemHistoryData.shipmentId"
          },
          {
            "label": "Service Type",
            "value": "#shippingTermsDetails.0.serviceTypeCode"
          }, {
            "label": "Tracking No",
            "value": "#finalGetAllItemHistoryData.trackingNumber"
          }

        ]
      }
    ];
    this.keyData.next(processJson);
  }

  addIndextoArray(action, instance, scope) {
    let data = [];
    data = this.contextService.getDataByKey(action.config.data);
    let index = 0;
    data && data.forEach(element => {
      element.No = index + 1;
      index = index + 1;
    });
    this.contextService.addToContext(action.config.data, data)
  }
  addValueAction(action,instance,scope){
    let data = [];
    data = this.contextService.getDataByKey(action.config.data);
   
    data && data.forEach(element=>{
      element.Action="Reprint";
    });
    this.contextService.addToContext(action.config.data,data);
  }

  handleHPRepositoryserviceAPI(elementdata,instance,actionService){
    this.repositorySelectedData=elementdata
    let switchValue=elementdata[0].PartLabel
    switch (switchValue) {
      case "Prints":
      this.repositoryReprintActions();
      let printEventName=this.contextService.getDataByKey('eventName');
      let paramsId=this.contextService.getDataByKey('paramsId');
      let print={
        "type": "microservice",
        "eventSource":"click",
        "config": {
            "microserviceId": "onePrint",
            "requestMethod": "post",
            "body": {
                "locationId": "#userSelectedLocation",
                "clientId": "#userSelectedClient",
                "contractId": "#userSelectedContract",
                "warehouseId": "0",
                "routeCode": "#repairUnitInfo.ROUTE",
                "workCenterId": "#repairUnitInfo.WORKCENTER_ID",
                "eventName": printEventName,
                "hostName": "#getHostNameResponse.hostName",
                "ip": "#getHostNameResponse.ip",
                "userName": "#userAccountInfo.PersonalDetails.USERID",
                paramsId
                
            },
            "toBeStringified": true
        },
        "responseDependents": {
          "onSuccess": {
              "actions": [
                {
                  "type": "context",
                  "config": {
                      "requestMethod": "add",
                      "key": "onePrintResponse",
                      "data": "responseData"
                  }
              }
            ]
          },
          "onFailure":{
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "onePrintResponse",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "errorTitleUUID",
                  "properties": {
                    "titleValue": "#onePrintResponse",
                    "isShown": true
                  }
                }
              }
            ]
          }
        }
      };
      actionService.handleAction(print,instance);
        break;
      case "Images":
        //this.handleHPRepositoryImages(elementdata,instance,actionService);
        break;
      case "Videos":
        break;
      default:
        break;
    }
  }

  // handleHPRepositoryImages(elementData, instance, actionService){
  //   let repository = [
  //   {
  //     "type": "createComponent",
  //     "config": {
  //       "targetId": "pageUUID",
  //       "containerId": "bodypage",
  //       "data":{
  //         "ctype": "imageGrid",
  //         "eventSource":"click",
  //         "name": "viewImage",
  //         "uuid": "viewImageUUID",
  //         "imgUrlParam": "#viewImageUrlObject.ffValue",
  //         "text": "View Images",
  //         "class": "body text-primary display-inline view-image-cls p-l-1",
  //         "modelTitle": "#discrepancyUnitInfo.SERIAL_NO",
  //         "actions": []
  //     } 
  //     },
  //     "eventSource": "click"
  //   }
  //   ];

    
  //     repository.forEach((ele) => {
  //       actionService.handleAction(ele, instance);
  //     });
   
  // }
  repositoryReprintActions(){
    let paramsId;
    let eventName={
      "eventName":this.repositorySelectedData[0].data.printEventName
    }
    this.contextService.addToContext('eventName',eventName.eventName);
    let item_id=this.contextService.getDataByString("#discrepancyUnitInfo.ITEM_ID");
    let receiptid=this.contextService.getDataByString("#getReceiptIdByItem.0.receiptId");
    let id=this.repositorySelectedData[0].data.dbParameter;
    if(id==="ITEM_ID"|| id==="item_id"){
     paramsId={
      "ITEM_ID":item_id
    }
  }
  if(id==="KIRUS-SHIPMENTID"){
  
    let kirus_shipmentId=this.contextService.getDataByString("#getETravellerShipmentDetails");
    console.log(kirus_shipmentId);
    paramsId={
      "kirus-shipmentId":kirus_shipmentId && kirus_shipmentId.shipmentId ? kirus_shipmentId.shipmentId : ''
    }
  }
  if(id==="receiptid"){
    paramsId
    = {
      "receiptId":receiptid
    }
  }
  this.contextService.addToContext('paramsId',paramsId);
  }
  trimDateTime(action, instance, scope){
    let data=[];
    data=this.contextService.getDataByKey(action.config.data);
    data && data.forEach(element=>{

      let trimDate=element.createdTimeStamp.slice(0,19);
      element.createdTimeStamp=trimDate;
    });
    this.contextService.addToContext(action.config.data, data);
  }

}