import { Injectable } from '@angular/core';
import { Console } from 'console';
import { ContextService } from '../../commonServices/contextService/context.service';


@Injectable({
  providedIn: 'root'
})
export class VerifoneService {

  constructor(private contextService: ContextService) { }

  enablingKittingTile(action, instance, actionService) {
    let kitting = action.config.uuid;
    const x = this.contextService.getDataByKey(action.config.parentUUID + "ref");
    const t = x.instance.tiles;
    t.map((item) => {
        if (item.uuid === kitting) {
          item.gridContainer = 'verifone-vmi-tile-container';
          item.isDefault = "false"
        } else {
          item.gridContainer = 'disabled-pointer rounded dell-car-tile-packout-container flex-space-around';
          item.isDefault = "true"
        }
    });
    x.instance._changeDetectionRef.detectChanges();
  }

  getRecievingPanelDetail(action, instance, actionService) {
    let leftHeaderData = this.contextService.getDataByKey("verifoneLeftHeaderData");
    if (leftHeaderData && leftHeaderData["blockDetails"]) {
      let data = leftHeaderData["blockDetails"];
      if (data && data !== undefined && data !== []) {
        let routeId = [];
        let recevingDetail;
        let timeStampArray = [];
        let timestampdataArray = [];
        let maxdate;
        data.forEach(ele => {
          routeId.push(ele.unitRouteId);
        })
        let i;
        let max = routeId[0];
        for (i = 1; i < routeId.length; i++) {
          if (routeId[i] > max)
            max = routeId[i];
        }
        console.log(max);
        let dataArray = [];
        data.forEach(elem => {
          if (elem.unitRouteId == max)
            dataArray.push(elem);
        })
        if (dataArray.length > 1) {
          dataArray.forEach(timestamp => {
            timeStampArray.push(timestamp.createdTimestamp);
          })
          maxdate = this.max_date(timeStampArray);
          dataArray.forEach(eleme => {
            if (eleme.createdTimestamp == maxdate) {
              timestampdataArray.push(eleme);
            }
          })
          recevingDetail = timestampdataArray[0]
        } else {
          recevingDetail = dataArray[0]
        }
        //console.log(recevingDetail);
        if (recevingDetail && recevingDetail["note"]) {
          this.contextService.addToContext("unitBlockData", recevingDetail["note"]);
        }
      }
    }
  }

  max_date(all_dates) {
    var max_dt = all_dates[0],
      max_dtObj = new Date(all_dates[0]);
    all_dates.forEach(function (dt, index) {
      if (new Date(dt) > max_dtObj) {
        max_dt = dt;
        max_dtObj = new Date(dt);
      }
    });
    return max_dt;
  }

  showVerifoneOLEPausebuttonInScreen(action: any, instance: any, actionService) {
    let olepausebutton = [
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getHandsOffHoldCode",
          "isLocal": false,
          "LocalService": "assets/Responses/getPreselectedResultCode.json",
          "requestMethod": "get",
          "params": {
            "locationId": "#userSelectedLocation",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "processId": "#selectedHomeMenuId",
            "workCenterId": "#UnitInfo.WORKCENTER_ID",
            "appId": "#selectedHomeMenuId",
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
                  "key": "getHandsOffHoldCode",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "unitPauseHoldtypedropdownUUID",
                  "dropDownProperties": {
                    "options": "#getHandsOffHoldCode"
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
                  "key": "errorMsg",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "errorTitleUUID",
                  "properties": {
                    "titleValue": "#errorMsg",
                    "isShown": true
                  }
                }
              }
            ]
          }
        }
      },
      {
        "type": "dialogwithmessage",
        "uuid": "unitPausebtnDialogUUID",
        "config": {
          "title": "Move to Hold",
          "disableClose": true,
          "minimumWidth": false,
          "width": "700px",
          "items": [
            {
              "ctype": "title",
              "uuid": "unitPausebtnDialogtittleUUID",
              "titleClass": "error-title-holdbin",
              "isShown": false
            },
            {
              "ctype": "nativeDropdown",
              "dropdownClass": " body2 reworkCommon",
              "formGroupClass": "olepausedailogdisplayinline",
              "inputStyles": "width:175px",
              "uuid": "unitPauseScopedropdownUUID",
              "name": "unitPauseScopedropdown",
              "label": "Scope",
              "labelClass": "scopelabel  pr-2",
              "dataSource": "#getCiscoBGAReworkMasterListReplace#@.vpnDetials",
              "code": "",
              "displayValue": "",
              "required": true,
              "options": [
                {
                  "code": "Current Unit",
                  "displayValue": "Current Unit"
                },
                {
                  "code": "All Active Units",
                  "displayValue": "All Active Units"
                }
              ],
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "unitPauseScopeName",
                    "data": "elementControlName"
                  },
                  "eventSource": "change"
                },
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "unitPauseScopeValue",
                    "data": "elementControlValue"
                  },
                  "eventSource": "change"
                }
              ]
            },
            {
              "ctype": "nativeDropdown",
              "dropdownClass": "body2 reworkCommon",
              "formGroupClass": "olepauseholdtypedailogdropdown",
              "uuid": "unitPauseHoldtypedropdownUUID",
              "inputStyles": "width:175px",
              "name": "unitPauseHoldtypedropdown",
              "label": "Hold Type",
              "labelClass": "scopelabel pr-2",
              "dataSource": "#getHandsOffHoldCode",
              "code": "outComeCodeId",
              "displayValue": "outComeCodeId",
              "required": true,
              "hooks": [],
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "unitPauseHoldtypeName",
                    "data": "elementControlName"
                  },
                  "eventSource": "change"
                },
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "unitPauseHoldtypeValue",
                    "data": "elementControlValue"
                  },
                  "eventSource": "change"
                }
              ]
            }
          ],
          "footer": [
            {
              "ctype": "button",
              "color": "primary",
              "text": "Cancel",
              "uuid": "unitPauseCancelUUID",
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
              "uuid": "unitPauseDoneUUID",
              "dialogBoxHoldBinErrorMessage": true,
              "dialogButton": true,
              "visibility": true,
              "disabled": true,
              "type": "submit",
              "closeType": "success",
              "hooks": [],
              "validations": [],
              "actions": [
                {
                  "eventSource": "click",
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "condition",
                          "config": {
                            "operation": "isEqualTo",
                            "lhs": "#unitPauseScopeName",
                            "rhs": "Current Unit"
                          },
                          "eventSource": "click",
                          "responseDependents": {
                            "onSuccess": {
                              "actions": [
                                {
                                  "type": "microservice",
                                  "hookType": "afterInit",
                                  "config": {
                                    "microserviceId": "holdSelectedAndCurrentUnit",
                                    "isLocal": false,
                                    "LocalService": "assets/Responses/mockHoldSubCode.json",
                                    "requestMethod": "post",
                                    "body": {
                                      "currentUnitOnHoldList": [{
                                        "location": "#UnitInfo.GEONAME",
                                        "clientId": "#UnitInfo.CLIENT_ID",
                                        "workcenter": "#UnitInfo.WORKCENTER",
                                        "holdCode": "#unitPauseHoldtypeName",
                                        "unitBcn": "#UnitInfo.ITEM_BCN",
                                        "note": ""
                                      }],
                                      "userName": "#loginUUID.username",
                                      "password": "#loginUUID.password"
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
                                            "key": "holdSelectedAndCurrentUnit",
                                            "data": "responseData"
                                          }
                                        },
                                        {
                                          "type": "closeAllDialogs"
                                        },
                                        {
                                          "type": "dialog",
                                          "uuid": "olePauseSucesssDailogUUID",
                                          "config": {
                                            "minimumWidth": false,
                                            "width": "300px",
                                            "title": "",
                                            "isheader": false,
                                            "items": [
                                              {
                                                "ctype": "title",
                                                "uuid": "errorTitleECOUUID",
                                                "titleClass": "font-weight-bold",
                                                "titleValue": "Transaction summary"
                                              },
                                              {
                                                "ctype": "label",
                                                "text": "#holdSelectedAndCurrentUnit",
                                                "labelClass": "font-weight-bold"
                                              }
                                            ]
                                          },
                                          "eventSource": "click",
                                          "responseDependents": {
                                            "onSuccess": {
                                              "actions": []
                                            }
                                          }
                                        },
                                        {
                                          "type": "renderTemplate",
                                          "config": {
                                            "templateId": "dashboard.json",
                                            "mode": "local"
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
                                        },
                                        {
                                          "type": "closeAllDialogs"
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
                                    "microserviceId": "holdAllActiveUnits",
                                    "isLocal": false,
                                    "LocalService": "assets/Responses/mockHoldSubCode.json",
                                    "requestMethod": "post",
                                    "body": {
                                      "locationId": "#UnitInfo.LOCATION_ID",
                                      "clientId": "#UnitInfo.CLIENT_ID",
                                      "location": "#UnitInfo.GEONAME",
                                      "holdcode": "#unitPauseHoldtypeName",
                                      "notes": "",
                                      "userName": "#loginUUID.username",
                                      "password": "#loginUUID.password"
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
                                            "key": "allActiveunitsresponseData",
                                            "data": "responseData"
                                          }
                                        },
                                        {
                                          "type": "closeAllDialogs"
                                        },
                                        {
                                          "type": "dialog",
                                          "uuid": "olePauseSucesssDailogUUID",
                                          "config": {
                                            "minimumWidth": false,
                                            "width": "300px",
                                            "title": "",
                                            "isheader": false,
                                            "items": [
                                              {
                                                "ctype": "title",
                                                "uuid": "errorTitleECOUUID",
                                                "titleClass": "font-weight-bold",
                                                "titleValue": "Transaction summary"
                                              },
                                              {
                                                "ctype": "label",
                                                "text": "#allActiveunitsresponseData",
                                                "labelClass": "font-weight-bold"
                                              }
                                            ]
                                          },
                                          "eventSource": "click",
                                          "responseDependents": {
                                            "onSuccess": {
                                              "actions": []
                                            }
                                          }
                                        },
                                        {
                                          "type": "renderTemplate",
                                          "config": {
                                            "templateId": "dashboard.json",
                                            "mode": "local"
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
                                        },
                                        {
                                          "type": "closeAllDialogs"
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
                    "onFailure": {}
                  }
                }
              ]
            }
          ]
        },
        "eventSource": "click"
      }
    ]
    olepausebutton && olepausebutton.forEach(element => {
      actionService.handleAction(element);
    });
  }

  getStringyfiedJsonData(action: any, instance: any, actionService) {
    let data = {
      "rows": [],
      "dataShape": {
        "fieldDefinitions": {
          "Value": {
            "name": "Value",
            "aspects": {},
            "description": "",
            "baseType": "STRING",
            "ordinal": 2
          },
          "Name": {
            "name": "Name",
            "aspects": {},
            "description": "",
            "baseType": "STRING",
            "ordinal": 1
          }
        }
      }
    }
    let arraydata = [];
    arraydata = this.contextService.getDataByString("#checkInputNeededData.rows")
    if (arraydata && arraydata.length > 0) {
      if (arraydata[0] && arraydata[0].Sub_Email) {
        let valueOne = this.contextService.getDataByString(action.config.toggleValueOne)
        let nameOne = arraydata[0].Sub_Email;
        if (valueOne && nameOne && valueOne !== '' && nameOne !== '') {
          let objOne = {
            "Value": valueOne,
            "Name": nameOne
          }
          data.rows.push(objOne);
        }
      }
      if (arraydata[1] && arraydata[1].Sub_Email) {
        let valueTwo = this.contextService.getDataByString(action.config.toggleValueTwo)
        let nameTwo = arraydata[1].Sub_Email;
        if (valueTwo && nameTwo && valueTwo !== '' && nameTwo !== '') {
          let objOne = {
            "Value": valueTwo,
            "Name": nameTwo
          }
          data.rows.push(objOne);
        }
      }
    }
    let mainData = JSON.stringify(data);
    this.contextService.addToContext(action.config.key, mainData)
  }

  enablingdisablingtextfield(action: any, instance: any, actionService) {
    let data = [];
    let keyArray = [];
    let flexfield;
    keyArray = ["btAdapter1", "battery2", "BT/Modem3", "PrivacyShield4", "CommsCable5", "PSU6", "MainLead7", "Other8", "CD10", "UnitwithBaseA", "Kitti","None9"]
    let updateComponent = []
    keyArray.forEach(element => {
      let value = this.contextService.getDataByKey(element);
      if (value && value !== "") {
        data.push(value);
      }
    });
    if (data.length > 0) {
      updateComponent = [
        {
          "type": "updateComponent",
          "config": {
            "key": "removeSNUUID",
            "properties": {
              "disabled": false
            }
          },
          "eventSource": "click"
        }
      ]
    } else {
      updateComponent = [
        {
          "type": "updateComponent",
          "config": {
            "key": "removeSNUUID",
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
            "key": "AddAccessoriesSubmittedData.removedSN",
            "data": ""
          },
          "eventSource": "click"
        },
        {
          "type": "resetData",
          "config": {
            "key": "removeSNUUID"
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "accessoriesCompleteButtonUUID",
            "properties": {
              "disabled": true
            }
          },
          "eventSource": "click"
        },
      ]
    }
    let iskitting = this.contextService.getDataByKey("Kitti");
    if(iskitting == "" || iskitting == undefined){
     flexfield = data.toString()
    }

    updateComponent.forEach(element => {
      actionService.handleAction(element);
    });    
    this.contextService.addToContext(action.key,flexfield)
  }

  getVerifoneWCFlexField(action: any, instance: any) {
    // PCB_PN,PCB_SN,REW_INSTR,DATE_CODE,ANALYSIS,REFURB
    let flexdata = action.config.flexdata;
    let verifonWCFlexFieldArray = [];
    if (flexdata.BoardPN1 && flexdata.BoardPN1.startsWith('#'))
      flexdata.BoardPN1 = this.contextService.getDataByString(
        flexdata.BoardPN1
      );
    if (flexdata.BoardPN2 && flexdata.BoardPN2.startsWith('#'))
    flexdata.BoardPN2 = this.contextService.getDataByString(
      flexdata.BoardPN2
    );
    if (flexdata.BoardPN1 && flexdata.BoardPN1 !== '') {
      let boardPn1 = {
        name: 'Board PN1',
        value: flexdata.BoardPN1,
      };
      verifonWCFlexFieldArray.push(boardPn1);
    }
    if (flexdata.BoardPN2 && flexdata.BoardPN2 !== '') {
      let boardPn2 = {
        name: 'Board PN2',
        value: flexdata.BoardPN2,
      };
      verifonWCFlexFieldArray.push(boardPn2);
    }

    this.contextService.addToContext(action.config.key, verifonWCFlexFieldArray);
  }

  renderVerifoneHoldRequiredParts(action:any, instance:any, actionService: any) {
    let missingPartData = this.contextService.getDataByKey("getVerioneHoldMissingPartData");
    let storageHoldSubCode = [];
    let storageHoldSubCodeString = '';
    let subHoldCode: any;
    let processJson1:any;
    let processJson2:any;

    missingPartData.sort((a, b) => {
      const obj1 = a['flexFieldValue'];
      const obj2 = b['flexFieldValue'];
        return obj1 > obj2 ? -1 : 1
    });

    let processJson:any = [
      {
        "type": "createComponent",
        "config": {
          "targetId": "pageUUID",
          "containerId": "prebodysectiontwo",
          "data": {
            "ctype": "taskPanel",
            "containerId": "prebodysectionone",
            "header": {
                "title": "Required Parts",
                "svgIcon": "description_icon",
                "iconClass": "active-header",
                "class": "po-specific"
            },
            "expanded": true,
            "hideToggle": true,
            "uuid": "RequiredPartsUUID",
            "visibility": false,
            "disabled": false,
            "hooks": [],
            "validations": [],
            "actions": [],
            "items": [
                {
                    "ctype": "disabled",
                    "uuid": "RequiredPartsDisabledTaskUUID",
                    "disabledClass": "disabledFalse"
                },
                {
                    "ctype": "title",
                    "uuid": "RequiredPartsTextUUID",
                    "titleValue": "",
                    "titleValueClass": "body-italic"
                }
                
            ],
            "footer": [                
            ]
        }
        }
      }
    ];

    if (missingPartData && missingPartData.length > 0) {      
      for (let i=0; i< missingPartData.length; i++) {
        if (missingPartData[i]['flexFieldType'] && missingPartData[i]['flexFieldType'].toLowerCase() === "character" && missingPartData[i]['flexFieldValue'] && missingPartData[i]['flexFieldValue'] != "NA") {
          let missingPartJson = {};
          missingPartJson = {
            "ctype": "title",
            "uuid": "MissingPart1TextUUID_"+missingPartData[i]['flexFieldId'],
            "titleValue": missingPartData[i]['flexFieldValue'],
            "titleClass": "d-flex",
            "leftTitleValueClass": "body font-bold col-3 p-0",
            "leftTitleValue": missingPartData[i]['flexFieldName'],
            "isLeftSpan": true,
            "titleValueClass": "body font-normal uppercase"
          };
          processJson[0]["config"]["data"].items.push(missingPartJson);
          if (missingPartData[i]['flexFieldValue'] && missingPartData[i]['flexFieldValue'] !== "NA") {
            storageHoldSubCode.push(missingPartData[i]['flexFieldValue']);
          }
        }         
      }
      storageHoldSubCodeString = storageHoldSubCode.join(";");
    }
    if (storageHoldSubCodeString !== "") {
      subHoldCode = {
        "storageHoldCode": "Awaiting Part",
        "storageHoldSubCode": storageHoldSubCodeString ? storageHoldSubCodeString : null
      };
      this.contextService.addToContext("storageHoldSubCode", storageHoldSubCode);
    } else {
      subHoldCode = {
        "storageHoldCode": "Awaiting Part"
      };
      this.contextService.addToContext("storageHoldSubCode", "");
    }
    
    processJson[0]["config"]["data"].items.push(
      {
      "ctype": "textField",
      "uuid": "BINLocationUUID",
      "submitable": "false",
      "disabled": storageHoldSubCodeString ? false : true,
      "focus": false,
      "visibility": true,
      "formGroupClass": "d-flex form-group-margin align-items-center",
      "textfieldClass": "col-2 p-0 body2 reworkCommon",
      "inputStyles": "height: 19px;",
      "name": "BINLocation",
      "label": "BIN Location",
      "labelClass": "col-3 p-0 align-left body font-bold mt-2",
      "type": "text",
      "required": true,
      "placeholder": "Scan BIN",
      "value": "",
      "actions": [
        {
          "type": "context",
          "config": {
              "requestMethod": "add",
              "key": "binValue",
              "data": "elementControlValue"
          },
          "eventSource": "input"
        }
      ]
      },                    
      {
          "ctype": "title",
          "uuid": "DestinationZoneTextUUID",
          "titleValue": "VERIFONE-SPARE_HOLD",
          "titleClass": "d-flex",
          "leftTitleValueClass": "body font-bold col-3 p-0",
          "leftTitleValue": "Destination Zone",
          "isLeftSpan": true,
          "titleValueClass": "body font-normal"
      },
      {
          "ctype": "checkbox",
          "uuid": "ProblemHoldUUID",
          "name": "ProblemHold",
          "hooks": [],
          "validations": [],
          "submitable": true,
          "iconClass": "",
          "checkdifferent": true,
          "label": "Problem Hold",
          "labelClass": "body font-bold col-3 p-0",
          "disabled": false,
          "checkboxContainer": "",
          "labelPosition": "before-label",
          "actions": [
              {
                  "type": "context",
                  "config": {
                      "requestMethod": "add",
                      "key": "ProblemHoldData",
                      "data": "formData"
                  },
                  "eventSource": "click"
              },
              {
                  "type": "condition",
                  "eventSource": "click",                               
                  "config": {
                      "operation": "isEqualTo",
                      "lhs": "#ProblemHoldData.ProblemHold",
                      "rhs": true
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                              "type": "setDefaultValue",
                              "config": {
                                "key": "storageHoldCodeDescriptionUUID",
                                "defaultValue": ""
                              },
                              "eventSource": "click"
                          },
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "storageHoldCodeDescriptionUUID",
                              "properties": {
                                "disabled": false
                              }
                            }
                          },
                          {
                              "type": "updateComponent",
                              "config": {
                                  "key": "DestinationZoneTextUUID",
                                  "properties": {
                                      "titleValue": "VERIFONE-CUSTOMER_HOLD"
                                  }
                              }
                          },
                          {
                            "type": "setVerifoneHoldTimeout",
                            "eventSource": "click"
                          }
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "setDefaultValue",
                            "config": {
                              "key": "storageHoldCodeDescriptionUUID",
                              "defaultValue": ""
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "storageHoldCodeDescriptionUUID",
                              "properties": {
                                "disabled": true
                              }
                            }
                          },
                          {
                              "type": "updateComponent",
                              "config": {
                                  "key": "DestinationZoneTextUUID",
                                  "properties": {
                                      "titleValue": "VERIFONE-SPARE_HOLD"
                                  }
                              }
                          },
                          {
                            "type": "setVerifoneHoldTimeout",
                            "eventSource": "click"
                          }
                        ]
                      }
                  }
              }
          ]
      },
      {
          "ctype": "textField",
          "uuid": "storageHoldCodeDescriptionUUID",
          "submitable": false,
          "disabled": true,
          "focus": false,
          "visibility": true,
          "isMandatory": true,
          "textfieldClass": "col-3 p-0 text-padding",
          "inputStyles": "height: 19px;",
          "name": "storageHoldCodeDescription",
          "label": "Storage Hold Code Description",
          "labelClass": "body font-bold col-3 p-0",
          "type": "text",
          "required": true,
          "placeholder": "Enter Description",
          "value": "",
          "actions": []
      }
    );
    processJson[0]["config"]["data"].footer.push(
      {
        "ctype": "button",
        "color": "primary",
        "text": "Complete",
        "uuid": "RequiredPartsSubmittedUUID",
        "name": "RequiredPartsSubmitted",
        "visibility": true,
        "disabled": true,
        "checkGroupValidity": true,
        "type": "submit",
        "class": "primary-btn",
        "hooks": [],
        "validations": [],
        "actions": [
          {
            "type": "context",
            "config": {
                "requestMethod": "add",
                "key": "holdFormData",
                "data": "formData"
            },
            "eventSource": "click"
          },
          {
            "type": "verifoneHoldMissingPartString"
          },
          {
            "type": "condition",
            "eventSource": "click",
            "config": {
              "operation": "isEqualTo",
              "lhs": "#ProblemHoldData.ProblemHold",
              "rhs": true
            },
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "microservice",
                    "config": {
                      "microserviceId": "moveinventory",
                      "requestMethod": "post",
                      "body": {
                        "apiUsageClientName": "#discrepancyUnitInfo.CLIENTNAME",
                        "apiUsageLocationName": "#discrepancyUnitInfo.GEONAME",
                        "callSource": "FrontEnd",
                        "ip": "::1",
                        "items": {
                          "addtionalDetails": {
                            "storageHoldCode": "Unknown Material"
                          },
                          "destinationLocation": {
                            "bin": "#holdFormData.BINLocation",
                            "geography": "#UnitInfo.GEONAME",
                            "stockingLocation": "VERIFONE-CUSTOMER_HOLD",
                            "warehouse": "SZO-BUILDING1"
                          },
                          "item": [
                            {
                              "bcn": "#UnitInfo.ITEM_BCN",
                              "owner": "#UnitInfo.CLIENTNAME",
                              "partNo": "#UnitInfo.PART_NO",
                              "quantity": "1",
                              "serialNo": "#UnitInfo.SERIAL_NO",
                              "condition": "Defective"
                            }
                          ],
                          "sourceLocation": {
                            "bin": "Default",
                            "geography": "#UnitInfo.GEONAME",
                            "stockingLocation": "VERIFONE-WIP",
                            "warehouse": "SZO-BUILDING1"
                          }
                        },
                        "usrPwd": {
                          "userName": "#loginUUID.username",
                          "password": "#loginUUID.password"
                        }
                      },
                      "toBeStringified": true
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "RequiredPartsUUID",
                              "properties": {
                                "expanded": false,
                                "disabled": false,
                                "header": {
                                  "title": "Required Parts",
                                  "svgIcon": "description_icon",
                                  "css": "color:black",
                                  "statusIcon": "check_circle",
                                  "statusClass": "complete-status",
                                  "class": "complete-task",
                                  "iconClass": "complete-task"
                                }
                              }
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "RequiredPartsSubmittedUUID",
                              "properties": {
                                "disabled": true
                              }
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "RequiredPartsDisabledTaskUUID",
                              "properties": {
                                "disabledClass": "disabledTrue"
                              }
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "ResultCodeVerifoneHoldUUID",
                              "properties": {
                                "disabled": false
                              }
                            }
                          },
                          {
                            "type": "renderTemplate",
                            "config": {
                              "templateId": "dashboard.json",
                              "mode": "local"
                            },
                            "eventSource": "click"
                          },
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "errorMsg",
                              "data": "responseData"
                            }
                          },
                          {
                            "type": "condition",
                            "config": {
                              "operation": "isEqualTo",
                              "lhs": "#errorMsg",
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
                                        "titleValue": "#errorMsg",
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
                                        "titleValue": "#errorMsg",
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
                    "config": {
                      "microserviceId": "moveinventory",
                      "requestMethod": "post",
                      "body": {
                        "apiUsageClientName": "#discrepancyUnitInfo.CLIENTNAME",
                        "apiUsageLocationName": "#discrepancyUnitInfo.GEONAME",
                        "callSource": "FrontEnd",
                        "ip": "::1",
                        "items": {
                          "addtionalDetails": subHoldCode,
                          "destinationLocation": {
                            "bin": "#holdFormData.BINLocation",
                            "geography": "#UnitInfo.GEONAME",
                            "stockingLocation": "VERIFONE-SPARE_HOLD",
                            "warehouse": "SZO-BUILDING1"
                          },
                          "item": [
                            {
                              "bcn": "#UnitInfo.ITEM_BCN",
                              "owner": "#UnitInfo.CLIENTNAME",
                              "partNo": "#UnitInfo.PART_NO",
                              "quantity": "1",
                              "serialNo": "#UnitInfo.SERIAL_NO",
                              "condition": "Defective"
                            }
                          ],
                          "sourceLocation": {
                            "bin": "Default",
                            "geography": "#UnitInfo.GEONAME",
                            "stockingLocation": "VERIFONE-WIP",
                            "warehouse": "SZO-BUILDING1"
                          }
                        },
                        "usrPwd": {
                          "userName": "#loginUUID.username",
                          "password": "#loginUUID.password"
                        }
                      },
                      "toBeStringified": true
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "RequiredPartsUUID",
                              "properties": {
                                "expanded": false,
                                "disabled": false,
                                "header": {
                                  "title": "Required Parts",
                                  "svgIcon": "description_icon",
                                  "css": "color:black",
                                  "statusIcon": "check_circle",
                                  "statusClass": "complete-status",
                                  "class": "complete-task",
                                  "iconClass": "complete-task"
                                }
                              }
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "RequiredPartsSubmittedUUID",
                              "properties": {
                                "disabled": true
                              }
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "RequiredPartsDisabledTaskUUID",
                              "properties": {
                                "disabledClass": "disabledTrue"
                              }
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "updateComponent",
                            "eventSource": "click",
                            "config": {
                              "key": "ResultCodeVerifoneHoldUUID",
                              "properties": {
                                "disabled": false
                              }
                            }
                          },
                          {
                            "type": "renderTemplate",
                            "config": {
                              "templateId": "dashboard.json",
                              "mode": "local"
                            },
                            "eventSource": "click"
                          },
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "errorMsg",
                              "data": "responseData"
                            }
                          },
                          {
                            "type": "condition",
                            "config": {
                              "operation": "isEqualTo",
                              "lhs": "#errorMsg",
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
                                        "titleValue": "#errorMsg",
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
                                        "titleValue": "#errorMsg",
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
    )

    

    processJson && processJson.forEach(element => {
      actionService.handleAction(element);
    });  
    
    
    
    if (this.contextService.getDataByKey("isReleased")) {
      processJson1 = [
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data": {
              "ctype": "taskPanel",
              "containerId": "prebodysectionone",
              "header": {
                "title": "Required Parts",
                "svgIcon": "description_icon",
                "statusIcon": "check_circle",
                "statusClass": "complete-status",
                "class": "complete-task",
                "iconClass": "complete-task"
              },
              "expanded": false,
              "hideToggle": true,
              "uuid": "RequiredPartsReleased1UUID",
              "visibility": false,
              "disabled": false,
              "hooks": [],
              "validations": [],
              "actions": [],
              "items": [
                  {
                      "ctype": "disabled",
                      "uuid": "RequiredPartsDisabledTaskUUID",
                      "disabledClass": "disabledFalse"
                  },
                  {
                      "ctype": "title",
                      "uuid": "RequiredPartsTextUUID",
                      "titleValue": "",
                      "titleValueClass": "body-italic"
                  }
                  
              ],
              "footer": [                
              ]
          }
          }
        }
      ];
  
      if (missingPartData && missingPartData.length > 0) {      
        for (let i=0; i< missingPartData.length; i++) {
          if (missingPartData[i]['flexFieldType'] && missingPartData[i]['flexFieldType'].toLowerCase() === "character" && missingPartData[i]['flexFieldValue']) {
            let missingPartJson = {};
            missingPartJson = {
              "ctype": "title",
              "uuid": "MissingPart"+i+"TextUUID_"+missingPartData[i]['flexFieldId'],
              "titleValue": missingPartData[i]['flexFieldValue'],
              "titleClass": "d-flex",
              "leftTitleValueClass": "body font-bold col-3 p-0",
              "leftTitleValue": missingPartData[i]['flexFieldName'],
              "isLeftSpan": true,
              "titleValueClass": "body font-normal uppercase"
            };
            processJson1[0]["config"]["data"].items.push(missingPartJson);
            if (missingPartData[i]['flexFieldValue']) {
              storageHoldSubCode.push(missingPartData[i]['flexFieldValue']);
            }
          }         
        }
        storageHoldSubCodeString = storageHoldSubCode.join(";");
      }
      
      processJson1[0]["config"]["data"].items.push(
        {
        "ctype": "textField",
        "uuid": "BINLocationUUID",
        "submitable": "false",
        "disabled": true,
        "focus": false,
        "visibility": true,
        "formGroupClass": "d-flex form-group-margin align-items-center",
        "textfieldClass": "col-2 p-0 body2 reworkCommon",
        "inputStyles": "height: 19px;",
        "name": "BINLocation",
        "label": "BIN Location",
        "labelClass": "col-3 p-0 align-left body font-bold mt-2",
        "type": "text",
        "required": true,
        "placeholder": "Scan BIN",
        "value": "",
        "actions": [
          {
            "type": "context",
            "config": {
                "requestMethod": "add",
                "key": "binValue",
                "data": "elementControlValue"
            },
            "eventSource": "input"
          }
        ]
        },                    
        {
            "ctype": "title",
            "uuid": "DestinationZoneTextUUID",
            "titleValue": "VERIFONE-SPARE_HOLD",
            "titleClass": "d-flex",
            "leftTitleValueClass": "body font-bold col-3 p-0",
            "leftTitleValue": "Destination Zone",
            "isLeftSpan": true,
            "titleValueClass": "body font-normal"
        },
        {
            "ctype": "checkbox",
            "uuid": "ProblemHoldUUID",
            "name": "ProblemHold",
            "hooks": [],
            "validations": [],
            "submitable": true,
            "iconClass": "",
            "checkdifferent": true,
            "disabled":true,
            "label": "Problem Hold",
            "labelClass": "body font-bold col-3 p-0",
            "checkboxContainer": "",
            "labelPosition": "before-label",
            "actions": [
                {
                    "type": "context",
                    "config": {
                        "requestMethod": "add",
                        "key": "ProblemHoldData",
                        "data": "formData"
                    },
                    "eventSource": "click"
                },
                {
                    "type": "condition",
                    "eventSource": "click",                               
                    "config": {
                        "operation": "isEqualTo",
                        "lhs": "#ProblemHoldData.ProblemHold",
                        "rhs": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                                "type": "setDefaultValue",
                                "config": {
                                  "key": "storageHoldCodeDescriptionUUID",
                                  "defaultValue": ""
                                },
                                "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "storageHoldCodeDescriptionUUID",
                                "properties": {
                                  "disabled": false
                                }
                              }
                            },
                            {
                                "type": "updateComponent",
                                "config": {
                                    "key": "DestinationZoneTextUUID",
                                    "properties": {
                                        "titleValue": "VERIFONE-CUSTOMER_HOLD"
                                    }
                                }
                            }
                          ]
                        },
                        "onFailure": {
                          "actions": [
                            {
                              "type": "setDefaultValue",
                              "config": {
                                "key": "storageHoldCodeDescriptionUUID",
                                "defaultValue": ""
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "storageHoldCodeDescriptionUUID",
                                "properties": {
                                  "disabled": true
                                }
                              }
                            },
                            {
                                "type": "updateComponent",
                                "config": {
                                    "key": "DestinationZoneTextUUID",
                                    "properties": {
                                        "titleValue": "VERIFONE-SPARE_HOLD"
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
            "uuid": "storageHoldCodeDescriptionUUID",
            "submitable": false,
            "disabled": true,
            "focus": false,
            "isMandatory": true,
            "visibility": true,
            "textfieldClass": "col-3 p-0 text-padding",
            "inputStyles": "height: 19px;",
            "name": "storageHoldCodeDescription",
            "label": "Storage Hold Code Description",
            "labelClass": "body font-bold col-3 p-0",
            "type": "text",
            "required": true,
            "placeholder": "Enter Description",
            "value": "",
            "actions": []
        }
      );
      processJson1[0]["config"]["data"].footer.push(
        {
          "ctype": "button",
          "color": "primary",
          "text": "Complete",
          "uuid": "RequiredPartsSubmittedUUID",
          "name": "RequiredPartsSubmitted",
          "visibility": true,
          "disabled": true,
          "checkGroupValidity": true,
          "type": "submit",
          "class": "primary-btn",
          "hooks": [],
          "validations": [],
          "actions": [
          ]
        }
      )
  
      processJson2 = [
        {
          "type": "updateComponent",
          "config": {
              "key": "verifoneHoldtimeoutUUID",
              "properties": {
                  "text":"Time Out"
              }
          }
      },
      {
          "type": "updateComponent",
          "config": {
              "key": "verifoneHoldtimeoutUUID",
              "properties": {
                  "disabled": false
              }
          }
      },
      {
          "type": "updateComponent",
          "config": {
              "key": "ResultCodeVerifoneHoldUUID",
              "properties": {
                  "hidden": false
              }
          }
      },
      {
          "type": "updateComponent",
          "config": {
              "key": "ResultCodeVerifoneHoldUUID",
              "properties": {
                  "disabled": false
              }
          }
      },
      {
          "type": "setDefaultValue",
          "config": {
              "key": "ResultCodeVerifoneHoldUUID",
              "defaultValue": "#lastNoteData.previousWorkCenterResultCode"
          }
      },
      {
        "type": "context",
        "config": {
            "requestMethod": "add",
            "key": "SelectedResultcode",
            "data": "#lastNoteData.previousWorkCenterResultCode"
        }
      },
      {
          "type": "updateComponent",
          "config": {
              "key": "verifoneHoldtimeoutUUID",
              "properties": {
                  "hidden": false
              }
          }
      },
      {
          "type": "updateComponent",
          "config": {
              "key": "IconUUID",
              "properties": {
                  "hidden": false
              }
          }
      },
      {
          "type": "updateComponent",
          "config": {
              "key": "RequiredPartsUUID",
              "properties": {
                  "expanded": false,
                  "disabled": true,
                  "hidden": true,
                  "header": {
                      "title": "Required Parts",
                      "svgIcon": "description_icon",
                      "statusIcon": "check_circle",
                      "statusClass": "complete-status",
                      "class": "complete-task",
                      "iconClass": "complete-task"
                  }
              }
          }
      }
      ];

    } else {
      processJson1 = [
        {
          "type": "updateComponent",
          "config": {
              "key": "verifoneHoldtimeoutUUID",
              "properties": {
                  "text":"Next"
              }
          }
        },
        {
            "type": "context",
            "config": {
                "requestMethod": "add",
                "key": "performTimeOutStatus",
                "data": false
            }
        },
        {
            "type": "updateComponent",
            "config": {
                "key": "ResultCodeVerifoneHoldUUID",
                "properties": {
                    "hidden": true
                }
            }
        },
        {
            "type": "updateComponent",
            "config": {
                "key": "verifoneHoldtimeoutUUID",
                "properties": {
                    "hidden": true
                }
            }
        },
        {
            "type": "updateComponent",
            "config": {
                "key": "IconUUID",
                "properties": {
                    "hidden": true
                }
            }
        }
      ]
      this.setVerifoneHoldTimeout(action, instance, actionService);
    }

    processJson1 && processJson1.forEach(element => {
      actionService.handleAction(element);
    });

    processJson2 && processJson2.forEach(element => {
      actionService.handleAction(element);
    });

    

  }

  getVerifoneHoldResultCode(action:any, instance:any, actionService:any) {
    let resultCodeArr = [];
    let resultCodeData = this.contextService.getDataByKey("getVerifoneHoldResultcodes");    
    let lastNoteData = this.contextService.getDataByKey("lastNoteData");
    let processJson:any;
    if (resultCodeData) {
        resultCodeArr= resultCodeData;
    }
    if (lastNoteData && lastNoteData["previousWorkCenterResultCode"]) {
      if (resultCodeArr.filter(item=> item.resultCode == lastNoteData["previousWorkCenterResultCode"]).length == 0){
        let obj = {
          description: null,
          f1ClickInd: "0",
          priority: "1",
          resultCode: lastNoteData["previousWorkCenterResultCode"].trim().length == 0 ? lastNoteData["previousWorkcenterName"] : lastNoteData["previousWorkCenterResultCode"] ,
        }
        resultCodeArr.splice(0,0,obj);
        this.contextService.addToContext("getVerifoneHoldResultcodes", resultCodeArr);
        processJson = [
          {
            "type": "updateComponent",
            "config": {
                "key": "ResultCodeVerifoneHoldUUID",
                "dropDownProperties": {
                    "options": "#getVerifoneHoldResultcodes"
                }
            }
          },
          {
            "type": "setDefaultValue",
            "config": {
                "key": "ResultCodeVerifoneHoldUUID",
                "defaultValue": lastNoteData["previousWorkCenterResultCode"].trim().length == 0 ? lastNoteData["previousWorkcenterName"] : lastNoteData["previousWorkCenterResultCode"]
            }
          },                                            
          {
              "type": "context",
              "config": {
                  "requestMethod": "add",
                  "key": "SelectedResultcode",
                  "data": lastNoteData["previousWorkCenterResultCode"].trim().length == 0 ? lastNoteData["previousWorkcenterName"] : lastNoteData["previousWorkCenterResultCode"]
              }
          }
        ]
        
      } else {
        processJson = [
          {
            "type": "setDefaultValue",
            "config": {
                "key": "ResultCodeVerifoneHoldUUID",
                "defaultValue": "#lastNoteData.previousWorkCenterResultCode"
            }
          },                                            
          {
              "type": "context",
              "config": {
                  "requestMethod": "add",
                  "key": "SelectedResultcode",
                  "data": "#lastNoteData.previousWorkCenterResultCode"
              }
          }
        ]
      }

      processJson && processJson.forEach(element => {
        actionService.handleAction(element);
      });
    }

  }
  
  getVerifoneVMIFlexField(action: any, instance: any) {
    // PCB_PN,PCB_SN,REW_INSTR,DATE_CODE,ANALYSIS,REFURB
    let flexdata = action.config.flexdata;
    let verifonVMIFlexFieldArray = [];
    if (flexdata.HLPF_Code_VMI && flexdata.HLPF_Code_VMI.startsWith('#'))
      flexdata.HLPF_Code_VMI = this.contextService.getDataByString(
        flexdata.HLPF_Code_VMI
      );
    if (flexdata.Accessories && flexdata.Accessories.startsWith('#'))
      flexdata.Accessories = this.contextService.getDataByString(
        flexdata.Accessories
      );
      if (flexdata.Accessory_Bag_No && flexdata.Accessory_Bag_No.startsWith('#'))
      flexdata.Accessory_Bag_No = this.contextService.getDataByString(
        flexdata.Accessory_Bag_No
      );
    if (flexdata.Battery_SN && flexdata.Battery_SN.startsWith('#'))
      flexdata.Battery_SN = this.contextService.getDataByString(
        flexdata.Battery_SN
      );
    if (flexdata.HLPF_Code_VMI && flexdata.HLPF_Code_VMI !== '') {
      let HLPF_Code_VMI = {
        name: 'HLPF_Code_VMI',
        value: flexdata.HLPF_Code_VMI,
      };
      verifonVMIFlexFieldArray.push(HLPF_Code_VMI);
    }
    if (flexdata.Accessories && flexdata.Accessories !== '') {
      let accessory = {
        name: 'Accessories',
        value: flexdata.Accessories,
      };
      verifonVMIFlexFieldArray.push(accessory);
    }
    if (flexdata.Accessory_Bag_No && flexdata.Accessory_Bag_No !== '') {
      let Accessory_Bag_Number = {
        name: 'ACC Bag Nr',
        value: flexdata.Accessory_Bag_No,
      };
      verifonVMIFlexFieldArray.push(Accessory_Bag_Number);
    }
    if (flexdata.Battery_SN && flexdata.Battery_SN !== '') {
      let Battery_sn = {
        name: 'Battery SN',
        value: flexdata.Battery_SN,
      };
      verifonVMIFlexFieldArray.push(Battery_sn);
    }

    this.contextService.addToContext(action.config.key, verifonVMIFlexFieldArray);
  }

  deleteAllComponent(action: any, instance: any, actionService:any) {
    let uuidArray = [];
    uuidArray = action.config.uuidList;
    uuidArray.forEach(element => {
      let object = {
        "type": "deleteComponent",
        "eventSource": "click",
        "config": {
          "key": element
        }
      }
      actionService.handleAction(object);
    });
  }

  deleteNoneTile(action: any, instance: any, actionService: any) {
    let deleteActions;
    deleteActions = [{
      "type": "deleteComponent",
      "config": {
        "key": "verifoneVMINoneUUID"
      },
      "eventSource": "click"
    },
    {
      "type": "context",
      "config": {
        "requestMethod": "add",
        "key": "None9",
        "data": ""
      },
      "eventSource": "click"
    },
    {
      "type": "enablingdisablingtextfield",
      "eventSource": "click"
    }
    ]
    let nonetext = this.contextService.getDataByString("#None9")
    if(nonetext && nonetext !== ""){
      deleteActions.forEach(element => {
        actionService.handleAction(element);
      }); 
    }
  }

  getAccTestDefectandActionCode(action: any, instance: any, actionService: any) {
    let flexFieldArray = [];
    let DefectCodeList = [];
    let ActionCodeList = [];
    let toggleDatatoAdd = '';
    let actionToggleData = this.contextService.getDataByString(action.config.data);
    if (actionToggleData == "pass") {
      toggleDatatoAdd = "Pass";
    } else if (actionToggleData == "fail") {
      toggleDatatoAdd = "Failure";
    } if (actionToggleData == "missing") {
      toggleDatatoAdd = "Missing";
    }
    flexFieldArray = this.contextService.getDataByString("#defectactionFlexField");
    flexFieldArray.push(toggleDatatoAdd);
    this.contextService.addToContext("defectactionFlexField", flexFieldArray);

    flexFieldArray.forEach(element => {
      let actionCode = {
        "actionCode": "ADD",
        "operation": "Add",
        "defectCode": {
          "value": "Accessory" + " " + element,
        }
      }
      ActionCodeList.push(actionCode);

      let defectCode = {
        "defectCode": "Accessory" + " " + element,
        "operation": "Add"
      }
      DefectCodeList.push(defectCode);
    });
    this.contextService.addToContext(action.config.actionList, ActionCodeList);
    this.contextService.addToContext(action.config.defectList, DefectCodeList);
  }

  getAllFormApiData(action: any, instance: any, actionService: any) {
    let index = action.config.index.startsWith('#') ? this.contextService.getDataByString(action.config.index) : action.config.index;
    let PartOwner = action.config.PartOwner.startsWith('#') ? this.contextService.getDataByString(action.config.PartOwner) : action.config.PartOwner;
    let PartNumber = action.config.PartNumber.startsWith('#') ? this.contextService.getDataByString(action.config.PartNumber) : action.config.PartNumber;
    let toggledata = action.config.toggledata.startsWith('#') ? this.contextService.getDataByString(action.config.toggledata) : action.config.toggledata;
    
    let taskpanelData = [];
    let AllData = [];
    let MainArray = [];
    MainArray = this.contextService.getDataByString("#alldataarray");
    taskpanelData = this.contextService.getDataByString("#dynamic");
    AllData["PartOwner"] = PartOwner;
    AllData["PartNumber"] = PartNumber;
    AllData["index"] = index;
    AllData["taskPanelData"] = taskpanelData[index];
    AllData["toggledata"] = toggledata;
    console.log(AllData);
    if (MainArray.length == 0) {
      MainArray.push(AllData);
    } else {
      MainArray && MainArray.forEach(element => {
        if (AllData["index"] == element.index) {
          element.PartOwner = AllData["PartOwner"];
          element.PartNumber = AllData["PartNumber"];
          element.taskPanelData = AllData["taskPanelData"];
          element.toggledata = AllData["toggledata"];
        } else {
         let  dt = MainArray.find(x => x.index == AllData["index"] )
          if(dt == undefined){
          MainArray.push(AllData);
        }
        }
      });
    }
    this.contextService.addToContext("alldataarray",MainArray)
  }

  performIssuepartloop(action: any, instance: any, actionService: any) {
    let data = [];
    let passData = [];
    let failData = [];
    let missingData = [];
    let passDataFlexFieldArray = [];
    let failDataFlexFieldArray = [];
    let missingDataFlexFieldArray = [];
    let AllDataArray = [];
    data = this.contextService.getDataByString(action.config.data);
    data.forEach(element => {
      if (element.toggledata === "pass") {
        passData.push(element);
      } else if (element.toggledata === "fail") {
        failData.push(element);
      } else if (element.toggledata === "missing") {
        missingData.push(element);
      }
    });
    if (passData && passData.length > 0) {
      passData && passData.forEach(element => {
        let passDataFlexField =
        {
          "part": "ANT420-003-01-B",
          "quantity": "1",
          "componentLocationDescription": "BEZELSASD",
          "flexFieldList": {
            "flexField": [
              {
                "name": "OwnerCondition",
                "value": "KEK-VERIFONE-NEW"
              }
            ]
          }
        }
        passDataFlexFieldArray.push(passDataFlexField);
      });
    }

    if (failData && failData.length > 0) {
      failData && failData.forEach(element => {
        let failDataFlexField =
        {
          "part": "ANT420-003-01-B",
          "quantity": "1",
          "componentLocationDescription": "BEZELSASD",
          "flexFieldList": {
            "flexField": [
              {
                "name": "OwnerCondition",
                "value": "KEK-VERIFONE-NEW"
              }
            ]
          }
        }
        failDataFlexFieldArray.push(failDataFlexField);
      });
    }

    if (missingData && missingData.length > 0) {
      missingData && missingData.forEach(element => {
        let missingDataFlexField =
        {
          "part": "ANT420-003-01-B",
          "quantity": "1",
          "componentLocationDescription": "BEZELSASD",
          "flexFieldList": {
            "flexField": [
              {
                "name": "OwnerCondition",
                "value": "KEK-VERIFONE-NEW"
              }
            ]
          }
        }
        missingDataFlexFieldArray.push(missingDataFlexField);
      });
    }

    if (passData && passData.length > 0) {
      passData["defectCode"] = "Accessory Pass";
      AllDataArray.push(passData);
    }
    if (failData && failData.length > 0) {
      failData["defectCode"] = "Accessory Failure"
      AllDataArray.push(failData)
    }
    if (missingData && missingData.length > 0) {
      missingData["defectCode"] = "Accessory Missing"
      AllDataArray.push(missingData)
    }

    AllDataArray && AllDataArray.forEach(typeDataArray => {
      let issuepartMicroservice = {
          "type": "microservice",
          "config": {
            "microserviceId": "performIssueParts",
            "requestMethod": "post",
            "isLocal": false,
            "LocalService": "assets/Responses/getHPFAHistory.json",
            "body": {
              "issuePartsRequest": {
                  "bcn": "BCN402997898",
                  "actionCodeChange": {
                      "operation": "Add",
                      "actionCode": "ADD",
                      "defectCode": {
                          "value": typeDataArray.defectCode
                      }
                  },
                  "nonInventoryPartList": {
                      "nonInventoryPart": typeDataArray.defectCode === "Accessory Pass" ? passDataFlexFieldArray : typeDataArray.defectCode === "Accessory Failure" ? failDataFlexFieldArray :   typeDataArray.defectCode === "Accessory Missing" ? missingDataFlexFieldArray : ""
                  }
              },
              "userPwd": {
                  "username": "SAURABH.MISHRA",
                  "password": "nXM%2F8%2BLyj9JxkQbdQnBxXIdvqXuKV58SwSAjWkx8eBd4b2h9aXHAhjW2r3gOa3366msxmnogxafq%2BCS2aA1tzGaE2eirXaIwmeYaXTlAyQjsVeTTYj3WJkxb1lxaXPL3G6neaLM1Qb6ttrrp8G5V1w86aOq%2F3TqvC7BeNF8sEDd81QhMJKhulvpb8SiyqJ4wjP1aa0zzMJ3hdd3KoygZz56WYTICbXuV0oAGEUGd1s%2FCC%2FSFhI04a9CCrgV7sKzi%2FsTFlqt7EdmwTS4tEYb6SpNpRzzGZ6wU6cce7g9zrW4j9oCQPoEmo2u3oxMux8WZu8TyXIcOkyOlM7gI3%2FLvYA%3D%3D"
              },
              "ip": "::1",
              "callSource": "FrontEnd",
              "apiUsage_LocationName": "Szombathely",
              "apiUsage_ClientName": "VeriFone"
          },
            "toBeStringified": true,
            "removeUndefinedFields": [
              {
                "KeyName": "serialNumber",
                "KeyValue": "#ciscoReworkReplaceDefectiveSN.newReplaceSN"
              }
            ]
          },
          "eventSource": "click",
          "responseDependents": {
            "onSuccess": {
              "actions": [
                
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
      console.log(issuepartMicroservice);
      //add microdervicr for issue part


    });
  }

  enableSubmitFA(action: any, instance: any, actionService: any) {
    let parentUUID = action.uuid.startsWith('#') ? this.contextService.getDataByString(action.uuid) : action.uuid;
    let taskpanelData = this.contextService.getDataByString("#dynamic");
    let indexdata;
    let dt;
    let getUUIDdata;
    let uuidref = [];
    let enableTaskPanel;
    let index = 0;
    taskpanelData.forEach(element => {
      dt = index.toString();
      indexdata = "#" + parentUUID + dt + "ref";
      getUUIDdata = this.contextService.getDataByString(indexdata);
      uuidref.push(getUUIDdata);
      index = index + 1
    });
    uuidref && uuidref.forEach(element => {
      if (element.instance.header.statusClass === "incomplete-status") {
        enableTaskPanel = false
      }
    });
    if (enableTaskPanel == undefined) {
      let updateComponent = {
        "type": "updateComponent",
        "config": {
          "key": "SubmitFATaskPanelUUID",
          "properties": {
            "disabled": false,
            "expanded": true
          }
        },
        "eventSource": "click"
      }
      actionService.handleAction(updateComponent);
    }
  }

  setVerifoneHoldTimeout(action:any, instance:any, actionService:any) {
    let storageHoldSubCodeString = this.contextService.getDataByKey("storageHoldSubCode");
    if (storageHoldSubCodeString == '' && !this.contextService.getDataByKey("isReleased")) {
      let checkProblemHoldCheckbox = this.contextService.getDataByKey("ProblemHoldData")["ProblemHold"];
      if (checkProblemHoldCheckbox) {
        let processJson3 = [
          {
            "type": "updateComponent",
            "config": {
                "key": "verifoneHoldtimeoutUUID",
                "properties": {
                    "text":"Time Out"
                }
            }
        },
        {
          "type": "updateComponent",
          "config": {
              "key": "RequiredPartsSubmittedUUID",
              "properties": {
                  "disabled":false
              }
          }
        },
        {
            "type": "updateComponent",
            "config": {
                "key": "verifoneHoldtimeoutUUID",
                "properties": {
                    "disabled": false
                }
            }
        },
        {
            "type": "updateComponent",
            "config": {
                "key": "ResultCodeVerifoneHoldUUID",
                "properties": {
                    "hidden": true
                }
            }
        },
        {
            "type": "updateComponent",
            "config": {
                "key": "ResultCodeVerifoneHoldUUID",
                "properties": {
                    "disabled": true
                }
            }
        },
        {
            "type": "setDefaultValue",
            "config": {
                "key": "ResultCodeVerifoneHoldUUID",
                "defaultValue": "#lastNoteData.previousWorkCenterResultCode"
            }
        },
        {
          "type": "context",
          "config": {
              "requestMethod": "add",
              "key": "SelectedResultcode",
              "data": "#lastNoteData.previousWorkCenterResultCode"
          }
        },
        {
            "type": "updateComponent",
            "config": {
                "key": "verifoneHoldtimeoutUUID",
                "properties": {
                    "hidden": true
                }
            }
        }
        ];
        processJson3 && processJson3.forEach(element => {
          actionService.handleAction(element);
        }); 
      } else {
        let processJson3 = [
          {
            "type": "updateComponent",
            "config": {
                "key": "verifoneHoldtimeoutUUID",
                "properties": {
                    "text":"Time Out"
                }
            }
        },
        {
          "type": "updateComponent",
          "config": {
              "key": "RequiredPartsSubmittedUUID",
              "properties": {
                  "disabled":true
              }
          }
        },
        {
            "type": "updateComponent",
            "config": {
                "key": "verifoneHoldtimeoutUUID",
                "properties": {
                    "disabled": false
                }
            }
        },
        {
            "type": "updateComponent",
            "config": {
                "key": "ResultCodeVerifoneHoldUUID",
                "properties": {
                    "hidden": false
                }
            }
        },
        {
            "type": "updateComponent",
            "config": {
                "key": "ResultCodeVerifoneHoldUUID",
                "properties": {
                    "disabled": true
                }
            }
        },
        {
            "type": "setDefaultValue",
            "config": {
                "key": "ResultCodeVerifoneHoldUUID",
                "defaultValue": "#lastNoteData.previousWorkCenterResultCode"
            }
        },
        {
          "type": "context",
          "config": {
              "requestMethod": "add",
              "key": "SelectedResultcode",
              "data": "#lastNoteData.previousWorkCenterResultCode"
          }
        },
        {
            "type": "updateComponent",
            "config": {
                "key": "verifoneHoldtimeoutUUID",
                "properties": {
                    "hidden": false
                }
            }
        }
        ];
        processJson3 && processJson3.forEach(element => {
          actionService.handleAction(element);
        }); 
      }
      
    }
  }
}
