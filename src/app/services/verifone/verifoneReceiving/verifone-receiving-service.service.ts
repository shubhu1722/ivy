import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { ContextService } from '../../commonServices/contextService/context.service';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class VerifoneReceivingServiceService {

  currentDate:any;
  renderRMAList = new Subject();
  quickReceivingSubject = new Subject();
  constructor(private contextService: ContextService) { 

  }

  getCurrentDateForVerifonePackingList(action, instance, actionService) {
    this.currentDate = formatDate(new Date(), 'yyyyMMdd', 'en');
    console.log("this.currentDate", this.currentDate);
    this.contextService.addToContext("currentPackingDate", this.currentDate);
  }

  getVerifoneReceivingRMAData(action, instance, actionService) {
    let rmaListData = this.contextService.getDataByKey("rmaListData");
    let rmaListDataCopy = this.contextService.getDataByKey("rmaListData");
    rmaListDataCopy.sort(function(a,b){ 
      return new Date(a.createdTimestamp).getTime() - new Date(b.createdTimestamp).getTime();
     });
    let rmaReceivedCounter = 0;
    for(let i=0; i<rmaListData.length;i++) {
      if(rmaListData[i]['inboundOrderStatus'] && rmaListData[i]['inboundOrderStatus'].toLowerCase() == "complete") {
        rmaReceivedCounter++;
      }
    }
    let serialNumber = this.contextService.getDataByKey("receivingUserSearchCriteria")["receivingOrderIdValue"];
    let processJson = [
      {
        "type": "updateComponent",
        "config": {
            "key": "rmaListTaskPanelUUID",
            "properties": {                                                                                
                "expanded": true,
                "header": {
                  "title": "RMA: "+serialNumber+ (rmaListDataCopy && rmaListDataCopy[0] && rmaListDataCopy[0]['createdTimestamp'] ? " - "+rmaListDataCopy[0]['createdTimestamp'].split(" ")[0] : ''),
                  "status": rmaReceivedCounter+"/"+rmaListData.length+" Received",
                  "svgIcon": "description_icon",
                  "iconClass": "active-header",
                  "class": "po-specific"
                }
            }
        }
      }
    ];
    
    this.renderRMAList.next(rmaListData);
    this.executeActions(processJson, instance, actionService);
  }

  goToReceivingScreen(action, instance, actionService) {
    
    let selectedRmaSerialNo = this.contextService.getDataByKey("selectedRMASerialNumer");
    this.contextService.addToContext("isFromRMAList", true);
    
    let processJson = [      
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
            "microserviceId": "getOrders",
            "requestMethod": "get",
            "params": {
                "searchCriteriaValue": selectedRmaSerialNo,
                "searchCriteriaName": "SerialNumber",
                "username": "#loginUUID.username"
            }
        },
        "responseDependents": {
            "onSuccess": {
                "actions": [
                    {
                        "type": "context",
                        "config": {
                            "requestMethod": "add",
                            "key": "verifoneReceivingOrderDetails",
                            "data": "responseData"
                        }
                    },
                    {
                        "type": "condition",
                        "config": {
                          "operation": "isEqualTo",
                          "lhs": "#verifoneReceivingOrderDetails.LOCATION_ID",
                          "rhs": "#userSelectedLocation"
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "condition",
                                "config": {
                                  "operation": "isEqualTo",
                                  "lhs": "#verifoneReceivingOrderDetails.CLIENT_ID",
                                  "rhs": "#userSelectedClient"
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "condition",
                                        "config": {
                                          "operation": "isEqualTo",
                                          "lhs": "#verifoneReceivingOrderDetails.CONTRACT_ID",
                                          "rhs": "#userSelectedContract"
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "microservice",
                                                "eventSource": "click",
                                                "config": {
                                                  "microserviceId": "getSubProcessMenu",
                                                  "isLocal": false,
                                                  "LocalService": "assets/Responses/getSubProcessMenu.json",
                                                  "requestMethod": "get",
                                                  "params": {
                                                    "userId": "#loginUUID.username",
                                                    "locationId": "#userSelectedLocation",
                                                    "clientId": "#userSelectedClient",
                                                    "contractId": "#userSelectedContract",
                                                    "wcId": 1,
                                                    "optId": 1,
                                                    "btt": 1,
                                                    "whId": "1",
                                                    "operationType": "#userSelectedSubProcessType",
                                                    "workCenterName": ""
                                                  }
                                                },
                                                "responseDependents": {
                                                  "onSuccess": {
                                                    "actions": [
                                                      {
                                                        "type": "context",
                                                        "config": {
                                                          "requestMethod": "add",
                                                          "key": "SubprocessMenu",
                                                          "data": ""
                                                        }
                                                      },
                                                      {
                                                        "type": "microservice",
                                                        "config": {
                                                          "microserviceId": "getProcess",
                                                          "requestMethod": "get",
                                                          "parseJson": true,
                                                          "params": {
                                                            "locationId": "#userSelectedLocation",
                                                            "clientId": "#userSelectedClient",
                                                            "contractId": "#userSelectedContract",
                                                            "btt": 1,
                                                            "optId": 1,
                                                            "whId": 1,
                                                            "userId": "#userAccountInfo.PersonalDetails.USERID",
                                                            "wcId": 1,
                                                            "operationType": "#userSelectedSubProcessType",
                                                            "workCenterName": ""
                                                          }
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "context",
                                                                "config": {
                                                                  "requestMethod": "add",
                                                                  "key": "getProcessData",
                                                                  "data": "responseData"
                                                                }
                                                              },
                                                              {
                                                                "type": "microservice",
                                                                "config": {
                                                                    "microserviceId": "validateSerialScan",
                                                                    "requestMethod": "post",
                                                                    "body": {
                                                                        "LOCATIONID": "#verifoneReceivingOrderDetails.LOCATION_ID",
                                                                        "CLIENTID": "#verifoneReceivingOrderDetails.CLIENT_ID",
                                                                        "FAT": "#verifoneReceivingOrderDetails.TP_ORDER_NO",
                                                                        "CLIEREF1": "#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO1",
                                                                        "CLIEREF2": "#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO2",
                                                                        "P_USERNAME": "#userAccountInfo.PersonalDetails.USERID",
                                                                        "QRCode": "#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO2",
                                                                        "RefOrderID": "#verifoneReceivingOrderDetails.REFERENCE_ORDER_ID",
                                                                        "CONTRACT": "#verifoneReceivingOrderDetails.CONTRACT_ID",
                                                                        "InboundOrderId": "#verifoneReceivingOrderDetails.INBOUND_ORDER_ID",
                                                                        "isCSOCheck": "true"
                                                                    },
                                                                    "toBeStringified": true
                                                                },
                                                                "hookType": "afterInit",
                                                                "responseDependents": {
                                                                    "onSuccess": {
                                                                        "actions": [
                                                                            {
                                                                                "type": "context",
                                                                                "config": {
                                                                                    "requestMethod": "add",
                                                                                    "key": "verifoneReceivingScanSerialNumberResp",
                                                                                    "data": "responseData"
                                                                                }
                                                                            },
                                                                            {
                                                                              "type": "getVerifoneRmaNumber"
                                                                            },                                                                            
                                                                            {
                                                                              "hookType":"afterInit",
                                                                              "type":"microservice",
                                                                              "config": {
                                                                                  "microserviceId": "getReceivingLPanelDetails",
                                                                                  "requestMethod": "get",
                                                                                  "params": {
                                                                                      "locationId": "#verifoneReceivingOrderDetails.LOCATION_ID",
                                                                                      "clientId": "#verifoneReceivingOrderDetails.CLIENT_ID",
                                                                                      "contractId":"#verifoneReceivingOrderDetails.CONTRACT_ID",
                                                                                      "bttId":"1",
                                                                                      "referenceOrderId":"#verifoneReceivingOrderDetails.REFERENCE_ORDER_ID",
                                                                                      "identificatorType":"SN",
                                                                                      "identificatorValue":"#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO2",
                                                                                      "serialNo": "#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO2",
                                                                                      "pr": "#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO1",
                                                                                      "rma": "#orderRMANumber",
                                                                                      "login": "#loginUUID.username"
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
                                                                                            "type": "renderTemplate",
                                                                                            "config": {
                                                                                                "templateId": "verifone/verifone-receiving-sn-pr.json",
                                                                                                "mode": "local"
                                                                                            },
                                                                                            "eventSource": "click"
                                                                                          }
                                                                                      ]
                                                                                  },
                                                                                  "onFailure": {
                                                                                      "actions": [
                                                                                        {
                                                                                          "type": "renderTemplate",
                                                                                          "config": {
                                                                                              "templateId": "verifone/verifone-receiving-sn-pr.json",
                                                                                              "mode": "local"
                                                                                          },
                                                                                          "eventSource": "click"
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
                                                                                    "key": "verifoneReceivingScanSerialNumberErrorResp",
                                                                                    "data": "responseData"
                                                                                }
                                                                            },
                                                                            {
                                                                                "type": "updateComponent",
                                                                                "config": {
                                                                                    "key": "errorTitleUUID",
                                                                                    "properties": {
                                                                                        "titleValue": "#verifoneReceivingScanSerialNumberErrorResp",
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
                                                                  "key": "getProcessData",
                                                                  "data": "responseData"
                                                                }
                                                              },
                                                              {
                                                                "type": "updateComponent",
                                                                "config": {
                                                                  "key": "receivingErrorTitleUUID",
                                                                  "properties": {
                                                                    "titleValue": "#getProcessData",
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
                                                        "type": "updateComponent",
                                                        "config": {
                                                          "key": "receivingErrorTitleUUID",
                                                          "properties": {
                                                            "titleValue": "Failed to fetch getSubprocess Menu.",
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
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "receivingErrorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "This unit doesn't belong to selected Location/Client/Contract. Please scan the correct unit.",
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
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "receivingErrorTitleUUID",
                                          "properties": {
                                            "titleValue": "This unit doesn't belong to selected Location/Client/Contract. Please scan the correct unit.",
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
                                "type": "updateComponent",
                                "config": {
                                  "key": "receivingErrorTitleUUID",
                                  "properties": {
                                    "titleValue": "This unit doesn't belong to selected Location/Client/Contract. Please scan the correct unit.",
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
                        "type": "updateComponent",
                        "config": {
                            "key": "errorTitleUUID",
                            "properties": {
                                "titleValue": "No Order Found",
                                "isShown": true
                            }
                        }
                    }
                ]
            }
        }
      }
    ];
    this.executeActions(processJson, instance, actionService);
  }

  setVerifoneReceivingSearchOptions(action, instance, actionService) {
    let processJson = [
      {
        "type": "condition",
        "hookType": "afterInit",                               
        "config": {
            "operation": "isEqualTo",
            "lhs": "#userSelectedContractName",
            "rhs": "Repair Hungary"
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type":"context",
                "config": {
                  "key": "receiptId",
                  "data": "",
                  "requestMethod": "add"
                },
                "hookType": "afterInit",
              },
              {
                "type":"context",
                "config": {
                  "key": "verifoneReceivingreceiptId",
                  "data": "",
                  "requestMethod": "add"
                },
                "hookType": "afterInit",
               },
               {
                 "type": "updateComponent",
                 "hookType": "afterInit",
                 "config": {
                    "key": "receivingTypeUUID",
                    "dropDownProperties": {
                      "options": [
                        {
                          "code": "SN",
                          "displayValue": "SN"
                        },
                        {
                            "code": "SN - Quick",
                            "displayValue": "SN - Quick"
                        },
                        {
                            "code": "RMA",
                            "displayValue": "RMA"
                        },
                        {
                            "code": "PR",
                            "displayValue": "PR"
                        }
                      ]
                    }
                  }
               },
               {
                "type": "setDefaultValue",
                "config": {
                  "key": "receivingTypeUUID",
                  "defaultValue": "SN - Quick"
                },
                "hookType": "afterInit"
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
                    "lhs": "#userSelectedContractName",
                    "rhs": "Problem Shelf"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions" : [
                      {
                        "type":"context",
                        "config": {
                          "key": "receiptId",
                          "data": "",
                          "requestMethod": "add"
                        },
                        "hookType": "afterInit",
                      },
                      {
                        "type":"context",
                        "config": {
                          "key": "verifoneReceivingreceiptId",
                          "data": "",
                          "requestMethod": "add"
                        },
                        "hookType": "afterInit",
                       },
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "receivingTypeUUID",
                          "dropDownProperties": {
                            "options": [
                             {
                                 "code": "Homeless",
                                 "displayValue": "Homeless"
                             }
                           ]
                          }
                        },                        
                        "hookType": "afterInit"
                      }
                    ]
                  },
                  "onFailure": {
                    "actions": [
                      {
                        "type":"context",
                        "config": {
                          "key": "receiptId",
                          "data": "",
                          "requestMethod": "add"
                        },
                        "hookType": "afterInit",
                      },
                      {
                        "type":"context",
                        "config": {
                          "key": "verifoneReceivingreceiptId",
                          "data": "",
                          "requestMethod": "add"
                        },
                        "hookType": "afterInit",
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
    this.executeActions(processJson, instance, actionService);
  }

  executeActions(actions, instance, actionService) {
    actions && actions.forEach((currentAction) => {
      actionService.handleAction(currentAction, instance);
    });
  }

  getVerifoneBlindReceivingFlexField(action: any, instance: any, actionService:any) {
    // PCB_PN,PCB_SN,REW_INSTR,DATE_CODE,ANALYSIS,REFURB
    let flexdata = action.config.flexdata;
    let verifoneBlindReceivingFlexFieldArray = [];
    if (flexdata.Serial_Number && flexdata.Serial_Number.startsWith('#'))
      flexdata.Serial_Number = this.contextService.getDataByString(
        flexdata.Serial_Number
      );
    if (flexdata.Bin_location && flexdata.Bin_location.startsWith('#'))
      flexdata.Bin_location = this.contextService.getDataByString(
        flexdata.Bin_location
      );
    if (flexdata.Ship_to_site_id && flexdata.Ship_to_site_id.startsWith('#'))
      flexdata.Ship_to_site_id = this.contextService.getDataByString(
        flexdata.Ship_to_site_id
      );
    if (flexdata.Ship_to_site_Name && flexdata.Ship_to_site_Name.startsWith('#'))
      flexdata.Ship_to_site_Name = this.contextService.getDataByString(
        flexdata.Ship_to_site_Name
      );
    if (flexdata.Country && flexdata.Country.startsWith('#'))
      flexdata.Country = this.contextService.getDataByString(
        flexdata.Country
      );
    if (flexdata.Part_Number && flexdata.Part_Number.startsWith('#'))
      flexdata.Part_Number = this.contextService.getDataByString(
        flexdata.Part_Number
      );
    if (flexdata.PTID_Number && flexdata.PTID_Number.startsWith('#'))
      flexdata.PTID_Number = this.contextService.getDataByString(
        flexdata.PTID_Number
    );
    if (flexdata.RMA_Number && flexdata.RMA_Number.startsWith('#'))
      flexdata.RMA_Number = this.contextService.getDataByString(
        flexdata.RMA_Number
    );
    if (flexdata.Problem_Description && flexdata.Problem_Description.startsWith('#'))
      flexdata.Problem_Description = this.contextService.getDataByString(
        flexdata.Problem_Description
    );
    if (flexdata.BT_MAC && flexdata.BT_MAC.startsWith('#'))
      flexdata.BT_MAC = this.contextService.getDataByString(
        flexdata.BT_MAC
    );
    if (flexdata.WIFI_MAC && flexdata.WIFI_MAC.startsWith('#'))
      flexdata.WIFI_MAC = this.contextService.getDataByString(
        flexdata.WIFI_MAC
    );

    if (flexdata.Serial_Number && flexdata.Serial_Number !== '') {
      let SerialNumber = {
        Name: 'Serial Number',
        Value: flexdata.Serial_Number,
      };
      verifoneBlindReceivingFlexFieldArray.push(SerialNumber);
    }

    if (flexdata.Bin_location && flexdata.Bin_location !== '') {
      let Binlocation = {
        Name: 'Bin location',
        Value: flexdata.Bin_location,
      };
      verifoneBlindReceivingFlexFieldArray.push(Binlocation);
    }

    if (flexdata.Ship_to_site_id && flexdata.Ship_to_site_id !== '') {
      let Ship_to_site_id = {
        Name: 'Ship_to_site_id',
        Value: flexdata.Ship_to_site_id,
      };
      verifoneBlindReceivingFlexFieldArray.push(Ship_to_site_id);
    }
    if (flexdata.Ship_to_site_Name && flexdata.Ship_to_site_Name !== '') {
      let Ship_to_site_Name = {
        Name: 'Ship_to_site_Name',
        Value: flexdata.Ship_to_site_Name,
      };
      verifoneBlindReceivingFlexFieldArray.push(Ship_to_site_Name);
    }

    if (flexdata.RMA_Number && flexdata.RMA_Number !== '') {
      let RMA_Numberobj = {
        Name: 'RMA Number',
        Value: flexdata.RMA_Number,
      };
      verifoneBlindReceivingFlexFieldArray.push(RMA_Numberobj);
    }

    if (flexdata.Part_Number && flexdata.Part_Number !== '') {
      let Part_Numberobj = {
        Name: 'Part Number',
        Value: flexdata.Part_Number,
      };
      verifoneBlindReceivingFlexFieldArray.push(Part_Numberobj);
    }
    if (flexdata.PTID_Number && flexdata.PTID_Number !== '') {
      let PTID_Numberobj = {
        Name: 'PTID Number',
        Value: flexdata.PTID_Number,
      };
      verifoneBlindReceivingFlexFieldArray.push(PTID_Numberobj);
    }
    if (flexdata.Problem_Description && flexdata.Problem_Description !== '') {
      let Problem_Descriptionobj = {
        Name: 'Problem Description',
        Value: flexdata.Problem_Description,
      };
      verifoneBlindReceivingFlexFieldArray.push(Problem_Descriptionobj);
    }
    if (flexdata.Country && flexdata.Country !== '') {
      let Countryobj = {
        Name: 'Country',
        Value: flexdata.Country,
      };
      verifoneBlindReceivingFlexFieldArray.push(Countryobj);
    }
    if (flexdata.BT_MAC && flexdata.BT_MAC !== '') {
      let BT_MACobj = {
        Name: 'BT MAC',
        Value: flexdata.BT_MAC,
      };
      verifoneBlindReceivingFlexFieldArray.push(BT_MACobj);
    }
    if (flexdata.WIFI_MAC && flexdata.WIFI_MAC !== '') {
      let WIFI_MACobj = {
        Name: 'WIFI MAC',
        Value: flexdata.WIFI_MAC,
      };
      verifoneBlindReceivingFlexFieldArray.push(WIFI_MACobj);
    }
    this.contextService.addToContext(action.config.key, verifoneBlindReceivingFlexFieldArray);
  }

  quickReceivingSuccessData(action, instance, actionService) {
    this.quickReceivingSubject.next({"success": action});
  }

  quickReceivingErrorData(action, instance, actionService) {
    this.quickReceivingSubject.next({"error": action});
  }

  renderQuickReceivingTableData(action, instance, actionService) {
    let quickReceivingSerialFormData = this.contextService.getDataByKey("quickReceivingSerialFormData");
    if (quickReceivingSerialFormData) {
      let serialNo = this.contextService.getDataByKey("quickReceivingSerialFormData")["quickReceivingserialNumberTextUUID"];
      let packingListNo = this.contextService.getDataByKey("quickReceivingSerialFormData")["packingListNumberTextUUID"];
      console.log("serialNo-->", serialNo, packingListNo);
      if (serialNo && packingListNo) {
        let processJson = [
          {
            "type": "microservice",
            "hookType": "afterInit",
            "config": {
                "microserviceId": "getOrders",
                "requestMethod": "get",
                "params": {
                    "searchCriteriaValue": "#quickReceivingSerialFormData.quickReceivingserialNumberTextUUID",
                    "searchCriteriaName": "SerialNumber",
                    "username": "#loginUUID.username"
                }
            },
            "responseDependents": {
                "onSuccess": {
                    "actions": [
                        {
                            "type": "context",
                            "config": {
                                "requestMethod": "add",
                                "key": "verifoneReceivingOrderDetails",
                                "data": "responseData"
                            }
                        },                       
                        {
                            "type": "condition",
                            "config": {
                              "operation": "isEqualTo",
                              "lhs": "#verifoneReceivingOrderDetails.LOCATION_ID",
                              "rhs": "#userSelectedLocation"
                            },
                            "responseDependents": {
                              "onSuccess": {
                                "actions": [
                                  {
                                    "type": "condition",
                                    "config": {
                                      "operation": "isEqualTo",
                                      "lhs": "#verifoneReceivingOrderDetails.CLIENT_ID",
                                      "rhs": "#userSelectedClient"
                                    },
                                    "responseDependents": {
                                      "onSuccess": {
                                        "actions": [
                                          {
                                            "type": "condition",
                                            "config": {
                                              "operation": "isEqualTo",
                                              "lhs": "#verifoneReceivingOrderDetails.CONTRACT_ID",
                                              "rhs": "#userSelectedContract"
                                            },
                                            "responseDependents": {
                                              "onSuccess": {
                                                "actions": [
                                                    {
                                                        "type": "microservice",
                                                        "config": {
                                                            "microserviceId": "validateSerialScan",
                                                            "requestMethod": "post",
                                                            "body": {
                                                                "LOCATIONID": "#verifoneReceivingOrderDetails.LOCATION_ID",
                                                                "CLIENTID": "#verifoneReceivingOrderDetails.CLIENT_ID",
                                                                "FAT": "#verifoneReceivingOrderDetails.TP_ORDER_NO",
                                                                "CLIEREF1": "#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO1",
                                                                "CLIEREF2": "#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO2",
                                                                "P_USERNAME": "#userAccountInfo.PersonalDetails.USERID",
                                                                "QRCode": "#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO2",
                                                                "RefOrderID": "#verifoneReceivingOrderDetails.REFERENCE_ORDER_ID",
                                                                "CONTRACT": "#verifoneReceivingOrderDetails.CONTRACT_ID",
                                                                "InboundOrderId": "#verifoneReceivingOrderDetails.INBOUND_ORDER_ID",
                                                                "isCSOCheck": "true"
                                                            },
                                                            "toBeStringified": true
                                                        },
                                                        "hookType": "afterInit",
                                                        "responseDependents": {
                                                            "onSuccess": {
                                                                "actions": [
                                                                    {
                                                                        "type": "context",
                                                                        "config": {
                                                                            "requestMethod": "add",
                                                                            "key": "verifoneReceivingScanSerialNumberResp",
                                                                            "data": "responseData"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "microservice",
                                                                        "eventSource":"click",
                                                                        "config": {
                                                                            "microserviceId": "verifoneReceivingTrigger",
                                                                            "requestMethod": "post",
                                                                            "body": {
                                                                                "actionType": "proDetail",
                                                                                "subActionType": "validatePartDataBySerial",
                                                                                "geography": "#userSelectedLocationName",
                                                                                "client": "#userSelectedClientName",
                                                                                "contract": "#userSelectedContractName",
                                                                                "orderProcessType": "#verifoneReceivingOrderDetails.ORDER_PROCESS_TYPE_CODE",
                                                                                "clientId": "#verifoneReceivingOrderDetails.CLIENT_ID",
                                                                                "contractId": "#verifoneReceivingOrderDetails.CONTRACT_ID",
                                                                                "refOrderId": "#verifoneReceivingOrderDetails.REFERENCE_ORDER_ID",
                                                                                "partNO": "#verifoneReceivingScanSerialNumberResp.OrderPartNumber",
                                                                                "refOrderLineId": "1",
                                                                                "serialNo": "#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO2",
                                                                                "revisionLevel": "",
                                                                                "serialNumber": "#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO2",
                                                                                "roNote": "",
                                                                                "clientReferenceNumber1": "#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO1"
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
                                                                                          "key": "verifoneReceivingTriggerData",
                                                                                          "data": "responseData"
                                                                                      }
                                                                                    },
                                                                                    {
                                                                                      "type": "getVerifoneRmaNumber"
                                                                                    },
                                                                                    {
                                                                                      "type":"microservice",
                                                                                      "config": {
                                                                                          "microserviceId": "getReceivingLPanelDetails",
                                                                                          "requestMethod": "get",
                                                                                          "params": {
                                                                                              "locationId": "#verifoneReceivingOrderDetails.LOCATION_ID",
                                                                                              "clientId": "#verifoneReceivingOrderDetails.CLIENT_ID",
                                                                                              "contractId":"#verifoneReceivingOrderDetails.CONTRACT_ID",
                                                                                              "bttId":"1",
                                                                                              "referenceOrderId":"#verifoneReceivingOrderDetails.REFERENCE_ORDER_ID",
                                                                                              "identificatorType":"SN",
                                                                                              "identificatorValue":"#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO2",
                                                                                              "serialNo": "#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO2",
                                                                                              "pr": "#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO1",
                                                                                              "rma": "#orderRMANumber",
                                                                                              "login": "#loginUUID.username"
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
                                                                                              "type": "microservice",
                                                                                              "config": {
                                                                                                  "microserviceId": "receiptV2",
                                                                                                  "requestMethod": "post",
                                                                                                  "body": {
                                                                                                      "Receipt": {
                                                                                                          "ReceiptInfo": {
                                                                                                              "User": "#userAccountInfo.PersonalDetails.USERID",
                                                                                                              "Pwd": "#loginUUID.password",
                                                                                                              "PackingListNo":"#quickReceivingSerialFormData.packingListNumberTextUUID",
                                                                                                              "Lines": {
                                                                                                                  "Line": {
                                                                                                                      "LineNo": "1",
                                                                                                                      "Items": {
                                                                                                                          "Item": {
                                                                                                                              "PartNum": "#verifoneReceivingScanSerialNumberResp.OrderPartNumber",
                                                                                                                              "Quantity": "1",
                                                                                                                              "SerialNum": "#verifoneReceivingScanSerialNumberResp.SerialNumber",
                                                                                                                              "FixedAssetTag": "#verifoneReceivingOrderDetails.CLIENT_REFERENCE_NO1",
                                                                                                                              "ReasonCode": "",
                                                                                                                              "ReasonNotes": "",
                                                                                                                              "ResultCode": "#verifoneReceivingScanSerialNumberResp.ResultCode",
                                                                                                                              "Warranty": true,
                                                                                                                              "FlexFields": {
                                                                                                                                "FlexField": [
                                                                                                                                    {
                                                                                                                                        "Name": "HUB_Cust_Cons_No",
                                                                                                                                        "Value": "#verifoneReceivingTriggerData.hubConsNoFfName"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "Name": "HUB_UPS_Cons_No",
                                                                                                                                        "Value": "#verifoneReceivingTriggerData.upsConsFfName"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "Name": "B2B_FFS_INITIAL",
                                                                                                                                        "Value": "#verifoneReceivingTriggerData.b2bFfsInitialFfName"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "Name": "Looper",
                                                                                                                                        "Value": "#verifoneReceivingTriggerData.looperFfName"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "Name": "KeyType",
                                                                                                                                        "Value": "#verifoneReceivingTriggerData.keyTypeFfName"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "Name": "SW/KEY METHOD",
                                                                                                                                        "Value": "#verifoneReceivingTriggerData.swMethodFfName"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "Name": "ADDRESS_NAME",
                                                                                                                                      "Value": "#verifoneUnitHeaderData.ReceivingLPanelDetails.0.customer"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "Name": "P2PE_label_SN",
                                                                                                                                        "Value": "."
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "Name": "UNIT_BATCH_ID",
                                                                                                                                        "Value": "NA"
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                          }
                                                                                                                      }
                                                                                                                  }
                                                                                                              },
                                                                                                              "ExternalReceiptData": {
                                                                                                                  "ReceiptNumber": "",
                                                                                                                  "Application": "",
                                                                                                                  "Warehouse": ""
                                                                                                              },
                                                                                                              "IP": ":1",
                                                                                                              "CallSource": "FrontEnd",
                                                                                                              "APIUsage_LocationName": "#userSelectedLocationName",
                                                                                                              "APIUsage_ClientName": "#userSelectedClientName"
                                                                                                          },
                                                                                                          "RefOrder": "#verifoneReceivingOrderDetails.REFERENCE_ORDER_ID",
                                                                                                          "InboundOrderID": "#verifoneReceivingOrderDetails.INBOUND_ORDER_ID"
                                                                                                      },
                                                                                                      "justReturnXML": "false"
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
                                                                                                                  "key": "verifoneReceivingData",
                                                                                                                  "data": "responseData"
                                                                                                              }
                                                                                                          },
                                                                                                          {
                                                                                                              "type": "setDefaultValue",
                                                                                                              "config": {
                                                                                                                "key": "serialNumberScanUUID",
                                                                                                                "defaultValue": ""
                                                                                                              }                                                                                                                            
                                                                                                          },
                                                                                                          {
                                                                                                              "type": "quickReceivingSuccessData"
                                                                                                          }
                                                                                                      ]
                                                                                                  },
                                                                                                  "onFailure": {
                                                                                                      "actions": [                                                                                                                                        
                                                                                                          {
                                                                                                              "type": "quickReceivingErrorData",
                                                                                                              "sNo": "#quickReceivingSerialFormData.quickReceivingserialNumberTextUUID"
                                                                                                          }
                                                                                                      ]
                                                                                                  }
                                                                                              },
                                                                                              "eventSource": "click"
                                                                                          }
                                                                                          ]
                                                                                        },
                                                                                        "onFailure": {

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
                                                                                            "key": "errorResp",
                                                                                            "data": "responseData"
                                                                                        },
                                                                                        "eventSource": "click"
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
                                                                                    },
                                                                                    {
                                                                                        "type": "quickReceivingErrorData",
                                                                                        "sNo": "#quickReceivingSerialFormData.quickReceivingserialNumberTextUUID"
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
                                                                            "key": "verifoneReceivingScanSerialNumberErrorResp",
                                                                            "data": "responseData"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                            "key": "errorTitleUUID",
                                                                            "properties": {
                                                                                "titleValue": "#verifoneReceivingScanSerialNumberErrorResp",
                                                                                "isShown": true
                                                                            }
                                                                        }
                                                                    },
                                                                    {
                                                                      "type": "quickReceivingErrorData"
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
                                                    "type": "quickReceivingErrorData"
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
                                            "type": "quickReceivingErrorData"
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
                                    "type": "quickReceivingErrorData"
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
                                    "titleValue": "No Order Found",
                                    "isShown": true
                                }
                            }
                        }, 
                        {
                          "type": "context",
                          "config": {
                              "requestMethod": "add",
                              "key": "errorResp",
                              "data": "No Order Found"
                          },
                          "eventSource": "click"
                        },                                                                               
                        {
                            "type": "quickReceivingErrorData",
                            "sNo": "#quickReceivingSerialFormData.quickReceivingserialNumberTextUUID"
                        }
                    ]
                }
            }
        }
        ];
        this.executeActions(processJson, instance, actionService);
      }
    }

  }
}
