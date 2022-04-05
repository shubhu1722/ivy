import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { UtilityService } from '../../../utilities/utility.service';
import { ContextService } from '../contextService/context.service';
import { WikiService } from './wiki.service';

@Injectable({
  providedIn: 'root'
})
export class WikiAdminService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private contextService: ContextService, private wikiService: WikiService, private utilityService: UtilityService, private _snackBar: MatSnackBar) { }

  handleAllAdminWikiActions(action: any, instance: any, actionService: any) {
    switch (action.methodType) {
      case 'renderDraftTemplate':
        this.renderDraftTemplate(action, instance, this);
        break;
      case 'handleDellPendingWikiProcessActions':
        this.handleDellPendingWikiProcessActions(action, instance, this);
        break;
      case 'handleDellSubmittedWikiProcessActions':
        this.handleDellSubmittedWikiProcessActions(action, instance, this);
        break;
      case 'handleDellInstructionWikiProcessActions':
        this.getAdminWikiInstructionsData(action, instance, this);
        break;
      case 'clearDataInRightTab':
        this.clearDataInRightTab(action, instance, this);
        break;
      case 'deleteRowFromDraftList':
        this.deleteRowFromDraftList(instance);
        break;
      case 'handleDellInstructionWikiGetStatusActions':
        this.handleDellInstructionWikiGetStatusActions(action, instance, this);
        break;
      case 'handleRoleBaseTaspanel':
        this.handleRoleBaseTaspanel(action, instance, this);
        break;
      case 'handleDellWikiInstructionFilter':
        this.handleDellWikiInstructionFilter(action, instance, this);
        break;
      case 'handleToggleTaspanel':
        this.handleToggleTaspanel(action, instance, this);
        break;
      case 'handleDellWikiEditButtonActions':
        this.handleDellWikiEditButtonActions(action, instance, this);
        break;
      case 'Update_QTY':
        this.updateTaskQty(action, instance, this);
        break;
        case 'updateTaskLableQty':
        this.updateTaskLableQty(action, instance, this);
        break;
        case 'updatePendingList':
        this.updatePendingList(action, instance, this);
        break;
      default:
        //statements; 
        break;
    }
  }

  handleDellPendingWikiProcessActions(action: any, instance: any, actionService: any) {
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    let data = this.contextService.getDataByKey("dellWikiSearchedRecord");
    data['panelType'] = "PENDING";
    data['author'] = data.Author;
    data['modelPart'] = data['Model Name/PN'];
    data['workCenterId'] = data['Work Center'];
    data['assignTo'] = data['Assign To'];
    console.log("pendingData",data);
    console.log("assignTo",data.assignTo);
    console.log("username",userName);
    
    if(data.status == 'PROCESS' && data.assignTo.toLowerCase() !== userName.toLowerCase()){ 
      this._snackBar.open('You Can Not Process This Instruction', 'OK', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000,
        panelClass: ['red-snackbar']
      });
      return;
    }

    let titleValue = "Wiki Instructions" + ">" + data.Title
    let processActions = [];
    if (this.wikiService.pendingWiki.length) {
      this.wikiService.pendingWiki.splice(0, this.wikiService.pendingWiki.length)
    }
    this.wikiService.pendingMyWiki.next(data);

    if (data.wikiVersion !== "1.0" && data.status !== "PROCESS") {
      let wikiStatus = "Wiki Status" + "-" + data.Title
      processActions = [
        {
          "type": "updateComponent",
          "config": {
            "key": "adminWikiInstructionUUID",
            "properties": {
              "isWikiAdmin": true,
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "wikiSubProcessTitleUUID",
            "properties": {
              "titleValue": titleValue,
              "titleClass": "section-title"
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiPendingApprovalUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarDraftWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarSubmittedWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiInstructionUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "toggle",
          "eventSource": "rowClick",
          "name": "subProcessRightNavref",
          "actionType":"open"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "openWikiUUID",
            "properties": {
              "hidden": false
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "pageopenWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "deleteComponent",
          "eventSource": "click",
          "config": {
            "key": "SMEStatusUUID"
          }
        },
        {
          "type": "deleteComponent",
          "eventSource": "click",
          "config": {
            "key": "similarInstructionUUID"
          }
        },
        {
          "type": "deleteComponent",
          "eventSource": "click",
          "config": {
            "key": "wikiStatusUUID"
          }
        },
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data":
            {
              "ctype": "taskPanel",
              "uuid": "SMEStatusUUID",
              "isblueBorder": true,
              "columnWiseTitle": true,
              "header": {
                "icon": "description",
                "iconClass": "active-header",
                "class": "mat-expansion-panel-header-title heading2"
              },
              "headerTitleLabels": [
                "SME Status",
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
                "CiscoTCparent1",
                ""
              ],
              "expanded": true,
              "hidden": false,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "taskpanelfooterclass": "d-flex justify-content-between",
              "panelClass": "",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAferAPQtyUUID#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoTCaddaprtqtyincriment"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAfterAPStockQty#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#getAddPartAvaliablequantitiesdata"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "stringOperation",
                  "config": {
                    "key": "ciscoAfterAPStockQtyAvail#@",
                    "updateParent": true,
                    "lstr": "#getAddPartAvaliablequantitiesdata",
                    "rstr": "Available",
                    "operation": "concat",
                    "concatSymbol": " "
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAfterAPStockQty#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoAfterAPStockQtyAvail#@"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoTCrenewInstrUUID#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoTCrenewInstrValue"
                    }
                  },
                  "hookType": "afterInit"
                }
              ],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "title",
                  "title": "Wiki currently not assigned to SME",
                  "uuid": "dellCarWikiPendingApprovalTextUUID",
                  "titleValueClass": "rework-font",
                  "titleClass": "mt-3 mb-4 text-secondary rework-font"
                },
                {
                  "ctype": "title",
                  "uuid": "dellPackoutHddHeaderUUID",
                  "titleClass": "sidenav-title body2 font-bold",
                  "title": "SME Status",
                  "titleValue": ""
                },
                {
                  "formGroupClass": "wiki-buttoon-toggle-cls body2",
                  "ctype": "actionToggle",
                  "labelPosition": "before",
                  "name": "returnHddToggle",
                  "selectedVal": "Available",
                  "options": [
                    {
                      "bgcolor": "light-blue",
                      "color": "white",
                      "text": "Available",
                      "value": "Available"
                    },
                    {
                      "bgcolor": "light-blue",
                      "color": "white",
                      "text": "PROCESS",
                      "value": "PROCESS"
                    }
                  ],
                  "validations": [],
                  "label": "Would you like to Process this Wiki instruction / Make it available?",
                  "labelClass": "l-class",
                  "toggleClass": "t-class",
                  "uuid": "dellInitialToggleValues",
                  "hooks": [],
                  "actions": [
                    {
                      "eventSource": "change",
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "smeToggleValue",
                        "data": "elementControlValue"
                      }
                    }
                  ],
                  "submitable": true
                },
                {
                  "ctype": "divider",
                  "dividerClass": "spacer-borderFQACosmetic"
                }
              ],
              "footer": [
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Complete",
                  "uuid": "softwareCompleteSMEUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "updateWikiStatus",
                        "requestMethod": "post",
                        "body": {
                          "wikiDocId": "#dellWikiSearchedRecord.wikiDocId",
                          "wikiDocCRId": "#dellWikiSearchedRecord.wikiDocCRId",
                          "wikiStatus": "#smeToggleValue",
                          "userName": "#loginUUID.username"
                        },
                        "toBeStringified": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "condition",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": "#smeToggleValue",
                                "rhs": "Available"
                              },
                              "eventSource": "click",
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "softwareCompleteInsFlagUUID#@",
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "SMEStatusUUID",
                                        "properties": {
                                          "expanded": false,
                                          "diabled":true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "similarInstructionUUID",
                                        "properties": {
                                          "expanded": true,
                                          "disabled": false
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "softwareCompleteSMEUUID#@",
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
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "softwareCompleteInsFlagUUID#@",
                                        "properties": {
                                          "disabled": false
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "SMEStatusUUID",
                                        "properties": {
                                          "expanded": false,
                                          "disabled":true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "similarInstructionUUID",
                                        "properties": {
                                          "expanded": true,
                                          "disabled":false
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "softwareCompleteSMEUUID#@",
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "handleAllAdminWikiActions",
                                      "methodType": "handleDellWikiEditButtonActions",
                                      "parent": "Instructions Pending Approval",
                                      "eventSource": "rowClick",
                                      "rowData": "dellWikiSearchedRecord"
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
                }
              ]
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data":
            {
              "ctype": "taskPanel",
              "uuid": "similarInstructionUUID",
              "isblueBorder": true,
              "columnWiseTitle": true,
              "disabled":true,
              "header": {
                "icon": "description",
                "iconClass": "active-header",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              },
              "headerTitleLabels": [
                "Similar Instructions Flag",
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
                "CiscoTCparent1",
                ""
              ],
              "expanded": false,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "taskpanelfooterclass": "d-flex justify-content-between",
              "panelClass": "",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [
                {
                  "type": "microservice",
                  "hookType": "afterInit",
                  "config": {
                    "microserviceId": "getWikiItems",
                    "requestMethod": "post",
                    "body": {
                      "locationId": "#dellWikiSearchedRecord.locationId",
                      "clientId": "#dellWikiSearchedRecord.clientId",
                      "contractId": "#dellWikiSearchedRecord.contractId",
                      "workCenterId": "#dellWikiSearchedRecord.workCenterId",
                      "family": "#dellWikiSearchedRecord.Family",
                      "platform": "#dellWikiSearchedRecord.Platform",
                      "modelPart": "#dellWikiSearchedRecord.ModelPart",
                      "commodity": "#dellWikiSearchedRecord.commodity",
                      "defect": "#dellWikiSearchedRecord.defect",
                      "userName": userName,
                      "wikiStatus": "#dellWikiSearchedRecord.defect"
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
                            "key": "getWikiItems",
                            "data": "responseData"
                          }
                        },
                        {
                          "methodType": "updateTaskLableQty",
                          "type": "handleAllAdminWikiActions",
                          "dataArray":"#getWikiItems",
                          "uuid":"dellCarWikiPendingApprovalTextUUID"
                        },
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "dellCarSimilarInstructionWikiTableUUID",
                            "fieldProperties": {
                              "dataSource": "#getWikiItems"
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
                            "key": "dellCarWikiSearchAndSortData",
                            "data": []
                          }
                        },
                        {
                          "type": "handleAllAdminWikiActions",
                          "methodType": "Update_QTY",
                          "hookType": "afterInit",
                          "taskPanelUUID": "dellCarWikiPendingApprovalUUID",
                          "dataArray": "#dellCarWikiSearchAndSortData",
                          "header": {
                            "title": "Instructions Pending Approval",
                            "icon": "description",
                            "iconClass": "active-header",
                            "status": "",
                            "statusIcon": "hourglass_empty",
                            "statusClass": "incomplete-status"
                          }
                        },
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "dellCarWikiTableUUID",
                            "fieldProperties": {
                              "dataSource": "#dellCarWikiSearchAndSortData"
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
                        }
                      ]
                    }
                  }
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAferAPQtyUUID#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoTCaddaprtqtyincriment"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAfterAPStockQty#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#getAddPartAvaliablequantitiesdata"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "stringOperation",
                  "config": {
                    "key": "ciscoAfterAPStockQtyAvail#@",
                    "updateParent": true,
                    "lstr": "#getAddPartAvaliablequantitiesdata",
                    "rstr": "Available",
                    "operation": "concat",
                    "concatSymbol": " "
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAfterAPStockQty#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoAfterAPStockQtyAvail#@"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoTCrenewInstrUUID#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoTCrenewInstrValue"
                    }
                  },
                  "hookType": "afterInit"
                }
              ],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "title",
                  "title": "",
                  "uuid": "dellCarWikiPendingApprovalTextUUID",
                  "titleValueClass": "rework-font",
                  "titleClass": "text-secondary rework-font"
                },
                {
                  "ctype": "wikiTableWithSearchAndSort",
                  "uuid": "dellCarSimilarInstructionWikiTableUUID",
                  "tableClass": "replaceTaskTableclass",
                  "tableDivCalss": "wiki-tableDivCalss",
                  "tableHeaderClass": "requisitionList-table-header subtitle1 wiki-custom-header",
                  "tableContainerClass": "requisitionList-table",
                  "tableDataClass": "wiki-tableData",
                  "tableSearchClass": "tableSearchClass",
                  "serachVariable": "#dellKDSearchID",
                  "searchBox": true,
                  "hooks": [],
                  "displayedColumns": [
                    "icon",
                    "Date",
                    "Title",
                    "Author",
                    "EXP",
                    "Family",
                    "Platform",
                    "ModelName/PN",
                    "Work Center",
                    "Language"
                  ],
                  "displayValues": {
                    "icon": "icon",
                    "date": "Date",
                    "wikiTitle": "Title",
                    "author": "Author",
                    "experience": "EXP",
                    "family": "Family",
                    "platform": "Platform",
                    "modelPart": "ModelName/PN",
                    "workCenterId": "Work Center",
                    "instructionLanguage": "Language"
                  },
                  "datasource": "#dellCarWikiInstructionFlagData",
                  "iconList": {
                    "icon": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": false
                    },
                    "Date": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "Title": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "Author": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "EXP": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "Family": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "Platform": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "ModelName/PN": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "Work Center": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "Language": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    }
                  },
                  "action": [
                    {
                      "type": "addRowData",
                      "keyToSave": "dellKDSearchedRecord",
                      "eventSource": "rowClick"
                    }
                  ]

                }

              ],
              "footer": [
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Complete",
                  "uuid": "softwareCompleteInsFlagUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": true,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "wikiStatusUUID",
                        "properties": {
                          "expanded": true,
                          "disabled":false
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "similarInstructionUUID",
                        "properties": {
                          "expanded": false,
                          "disabled":false,
                          "header": {
                            "icon": "description",
                            "iconClass": "complete-task",
                            "statusIcon": "check_circle",
                            "statusClass": "complete-status"
                        }
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "softwareRejectWikiStatusUUID#@",
                        "properties": {
                          "disabled": false
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "softwareApproveWikiStatusUUID#@",
                        "properties": {
                          "disabled": false
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "softwareCompleteInsFlagUUID#@",
                        "properties": {
                          "disabled": true
                        }
                      },
                      "eventSource": "click"
                    }
                  ]
                }
              ]
            }


          },
          "eventSource": "rowClick"
        },
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data":
            {
              "ctype": "taskPanel",
              "uuid": "wikiStatusUUID",
              "isblueBorder": true,
              "columnWiseTitle": true,
              "disabled":true,
              "header": {
                "icon": "description",
                "iconClass": "active-header",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              },
              "headerTitleLabels": [
                wikiStatus,
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
                "CiscoTCparent1",
                ""
              ],
              "expanded": false,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "taskpanelfooterclass": "d-flex justify-content-between",
              "panelClass": "",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [
              ],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "label",
                  "text": "Author",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.Author,
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Level Of Experience",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Tech",
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Type of Instruction",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Wiki",
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Assigned SME",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.assignTo,
                  "inline": true,
                  "labelClass": "col-6"
                }
              ],
              "footer": [
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Cancel",
                  "uuid": "softwareCancelWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "hidden": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "adminWikiInstructionUUID",
                        "properties": {
                          "isWikiAdmin": false,

                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "handleAllAdminWikiActions",
                      "hookType": "afterInit",
                      "methodType": "handleRoleBaseTaspanel",
                      "featuresToBeFilterd": [1, 2, 3, 4],
                      "taskPanelsNeedToBeToggled": [
                        "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                      ],
                      "eventSource": "click"
                    },
                    {
                      "type": "toggle",
                      "eventSource": "click",
                      "name": "subProcessRightNavref",
                      "actionType":"close"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "openWikiUUID",
                        "properties": {
                          "hidden": true
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "pageopenWikiUUID",
                        "properties": {
                          "hidden": false
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "wikiSubProcessTitleUUID",
                        "properties": {
                          "titleValue": "Wiki Instruction",
                          "titleClass": "section-title"
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "SMEStatusUUID"
                      }
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "newCommentUUID"
                      }
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "wikiStatusNewUUID"
                      }
                    }
                  ]
                },
                {
                  "ctype": "button",
                  "color": "warn",
                  "text": "Reject",
                  "uuid": "softwareRejectWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
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
                        "microserviceId": "updateWikiStatus",
                        "requestMethod": "post",
                        "body": {
                          "wikiDocId": "#dellWikiSearchedRecord.wikiDocId",
                          "wikiDocCRId": "#dellWikiSearchedRecord.wikiDocCRId",
                          "wikiStatus": "REJECT",
                          "userName": "#loginUUID.username"
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
                                "key": "dellCarWikiApproveUUID",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "toast",
                              "message": "WIKI data save successfully"
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "hookType": "afterInit",
                              "methodType": "handleRoleBaseTaspanel",
                              "featuresToBeFilterd": [1, 2, 3, 4],
                              "taskPanelsNeedToBeToggled": [
                                "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                              ]
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "wikiSubProcessTitleUUID",
                                "properties": {
                                  "titleValue": "Wiki Instruction",
                                  "titleClass": "section-title"
                                }
                              },
                              "eventSource": "rowClick"
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "SMEStatusUUID"
                              }
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "similarInstructionUUID"
                              }
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "wikiStatusUUID"
                              }
                            },
                            {
                              "type": "toggle",
                              "eventSource": "rowClick",
                              "name": "subProcessRightNavref",
                              "actionType":"close"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "openWikiUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "pageopenWikiUUID",
                                "properties": {
                                  "hidden": false
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "methodType": "updatePendingList",
                              "parent": "Instructions Pending Approval",
                              "rowData": "dellWikiSearchedRecord"
                            }
                          ]
                        },
                        "onFailure": {
                          "actions": [

                          ]
                        }
                      }
                    }
                  ]
                },
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Approve",
                  "uuid": "softwareApproveWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "updateWikiStatus",
                        "requestMethod": "post",
                        "body": {
                          "wikiDocId": "#dellWikiSearchedRecord.wikiDocId",
                          "wikiDocCRId": "#dellWikiSearchedRecord.wikiDocCRId",
                          "wikiStatus": "APPROVED",
                          "userName": "#loginUUID.username"
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
                                "microserviceId": "getAllWikiItems",
                                "isLocal": false,
                                "LocalService": "assets/Responses/wikiMockupResponse.json",
                                "requestMethod": "get",
                                "params": {
                                  "status": "PROCESS,PENDING FOR APPROVAL"
                                }
                              },
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "context",
                                      "config": {
                                        "requestMethod": "add",
                                        "key": "dellCarWikiSearchAndSortData",
                                        "data": "responseData"
                                      }
                                    },
                                    {
                                      "type": "handleAllAdminWikiActions",
                                      "methodType": "Update_QTY",
                                      "hookType": "afterInit",
                                      "taskPanelUUID": "dellCarWikiPendingApprovalUUID",
                                      "dataArray": "#dellCarWikiSearchAndSortData",
                                      "header": {
                                        "title": "Instructions Pending Approval",
                                        "icon": "description",
                                        "iconClass": "active-header",
                                        "status": "",
                                        "statusIcon": "hourglass_empty",
                                        "statusClass": "incomplete-status"
                                      }
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "dellCarWikiTableUUID",
                                        "fieldProperties": {
                                          "dataSource": "#dellCarWikiSearchAndSortData"
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
                                        "key": "dellCarWikiSearchAndSortData",
                                        "data": []
                                      }
                                    },
                                    {
                                      "type": "handleAllAdminWikiActions",
                                      "methodType": "Update_QTY",
                                      "hookType": "afterInit",
                                      "taskPanelUUID": "dellCarWikiPendingApprovalUUID",
                                      "dataArray": "#dellCarWikiSearchAndSortData",
                                      "header": {
                                        "title": "Instructions Pending Approval",
                                        "icon": "description",
                                        "iconClass": "active-header",
                                        "status": "",
                                        "statusIcon": "hourglass_empty",
                                        "statusClass": "incomplete-status"
                                      }
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "dellCarWikiTableUUID",
                                        "fieldProperties": {
                                          "dataSource": "#dellCarWikiSearchAndSortData"
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
                                    }
                                  ]
                                }
                              }
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "adminWikiInstructionUUID",
                                "properties": {
                                  "isWikiAdmin": false,

                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "context",
                              "config": {
                                "requestMethod": "add",
                                "key": "dellCarWikiApproveUUID",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "toast",
                              "message": "WIKI data save successfully"
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "hookType": "afterInit",
                              "methodType": "handleRoleBaseTaspanel",
                              "featuresToBeFilterd": [1, 2, 3, 4],
                              "taskPanelsNeedToBeToggled": [
                                "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                              ]
                            },
                            {
                              "type": "toggle",
                              "eventSource": "click",
                              "name": "subProcessRightNavref",
                              "actionType":"close"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "openWikiUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "pageopenWikiUUID",
                                "properties": {
                                  "hidden": false
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "wikiSubProcessTitleUUID",
                                "properties": {
                                  "titleValue": "Wiki Instruction",
                                  "titleClass": "section-title"
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "SMEStatusUUID"
                              }
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "similarInstructionUUID"
                              }
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "wikiStatusUUID"
                              }
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "methodType": "updatePendingList",
                              "parent": "Instructions Pending Approval",
                              "rowData": "dellWikiSearchedRecord"
                            }
                          ]
                        },
                        "onFailure": {
                          "actions": [

                          ]
                        }
                      }
                    }
                    
                  ]
                }
              ]
            }
          },
          "eventSource": "rowClick"
        }
      ];

    } else if (data.wikiVersion == "1.0" && data.status !== "PROCESS") {
      processActions = [
        {
          "type": "updateComponent",
          "config": {
            "key": "adminWikiInstructionUUID",
            "properties": {
              "isWikiAdmin": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "wikiSubProcessTitleUUID",
            "properties": {
              "titleValue": titleValue,
              "titleClass": "section-title"
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiPendingApprovalUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarDraftWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarSubmittedWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiInstructionUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "toggle",
          "eventSource": "rowClick",
          "name": "subProcessRightNavref",
          "actionType":"open"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "openWikiUUID",
            "properties": {
              "hidden": false
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "pageopenWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "deleteComponent",
          "eventSource": "click",
          "config": {
            "key": "SMEStatusUUID"
          }
        },
        {
          "type": "deleteComponent",
          "eventSource": "click",
          "config": {
            "key": "newCommentUUID"
          }
        },
        {
          "type": "deleteComponent",
          "eventSource": "click",
          "config": {
            "key": "wikiStatusNewUUID"
          }
        },
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data":
            {
              "ctype": "taskPanel",
              "uuid": "SMEStatusUUID",
              "isblueBorder": true,
              "columnWiseTitle": true,
              "header": {
                "icon": "description",
                "iconClass": "active-header",
                "class": "mat-expansion-panel-header-title heading2"
              },
              "headerTitleLabels": [
                "SME Status",
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
                "CiscoTCparent1",
                ""
              ],
              "expanded": true,
              "hidden": false,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "taskpanelfooterclass": "d-flex justify-content-between",
              "panelClass": "",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [
              ],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "title",
                  "title": "Wiki currently not assigned to SME",
                  "uuid": "dellCarWikiPendingApprovalTextUUID",
                  "titleValueClass": "rework-font",
                  "titleClass": "mt-3 mb-4 text-secondary rework-font"
                },
                {
                  "ctype": "title",
                  "uuid": "dellPackoutHddHeaderUUID",
                  "titleClass": "sidenav-title body2 font-bold",
                  "title": "SME Status",
                  "titleValue": ""
                },
                {
                  "formGroupClass": "wiki-buttoon-toggle-cls body2",
                  "ctype": "actionToggle",
                  "labelPosition": "before",
                  "name": "returnHddToggle",
                  "selectedVal": "Available",
                  "options": [
                    {
                      "bgcolor": "light-blue",
                      "color": "white",
                      "text": "Available",
                      "value": "Available"
                    },
                    {
                      "bgcolor": "light-blue",
                      "color": "white",
                      "text": "PROCESS",
                      "value": "PROCESS"
                    }
                  ],
                  "validations": [],
                  "label": "Would you like to Process this Wiki instruction / Make it available?",
                  "labelClass": "l-class",
                  "toggleClass": "t-class",
                  "uuid": "dellInitialToggleValues",
                  "hooks": [],
                  "actions": [
                    {

                      "eventSource": "change",
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "smeToggleValue",
                        "data": "elementControlValue"
                      }
                    }


                  ],
                  "submitable": true
                },
                {
                  "ctype": "divider",
                  "dividerClass": "spacer-borderFQACosmetic"
                }
              ],
              "footer": [
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Complete",
                  "uuid": "softwareCompleteSMEUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "updateWikiStatus",
                        "requestMethod": "post",
                        "body": {
                          "wikiDocId": "#dellWikiSearchedRecord.wikiDocId",
                          "wikiDocCRId": "#dellWikiSearchedRecord.wikiDocCRId",
                          "wikiStatus": "#smeToggleValue",
                          "userName": "#loginUUID.username"
                        },
                        "toBeStringified": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "condition",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": "#smeToggleValue",
                                "rhs": "Available"
                              },
                              "eventSource": "click",
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "softwareCompleteNewCommentUUID#@",
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "SMEStatusUUID",
                                        "properties": {
                                          "expanded": false,
                                          "diasbled":true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "newCommentUUID",
                                        "properties": {
                                          "expanded": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "softwareCompleteSMEUUID#@",
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
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "softwareCompleteNewCommentUUID#@",
                                        "properties": {
                                          "disabled": false
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "SMEStatusUUID",
                                        "properties": {
                                          "expanded": false,
                                          "disabled":true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "newCommentUUID",
                                        "properties": {
                                          "expanded": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "softwareCompleteSMEUUID#@",
                                        "properties": {
                                          "disabled": true
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
                          "actions": []
                        }
                      }
                    }
                  ]
                }
              ]
            }


          },
          "eventSource": "rowClick"
        },
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data":
            {
              "ctype": "taskPanel",
              "uuid": "newCommentUUID",
              "isblueBorder": true,
              "columnWiseTitle": true,
              "disabled":true,
              "header": {
                "icon": "description",
                "iconClass": "active-header",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              },
              "headerTitleLabels": [
                "New Comment  ",
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
                "CiscoTCparent1",
                ""
              ],
              "expanded": false,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "taskpanelfooterclass": "d-flex justify-content-between",
              "panelClass": "",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [
              ],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "label",
                  "text": "Author",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.Author,
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Level Of Experience",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Tech",
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "TimeStamp",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.Author,
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Comment",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.Author,
                  "inline": true,
                  "labelClass": "col-6"
                }
              ],
              "footer": [
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Complete",
                  "uuid": "softwareCompleteNewCommentUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": true,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "wikiStatusNewUUID",
                        "properties": {
                          "expanded": true,
                          "disabled": false
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "softwareRejectWikiStatusUUID#@",
                        "properties": {
                          "disabled": false
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "newCommentUUID",
                        "properties": {
                          "expanded": false,
                          "disabled": false
                        }
                      },
                      "eventSource": "click"
                    }
                  ]
                }
              ]
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data":
            {
              "ctype": "taskPanel",
              "uuid": "wikiStatusNewUUID",
              "isblueBorder": true,
              "columnWiseTitle": true,
              "disabled":true,
              "header": {
                "icon": "description",
                "iconClass": "active-header",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              },
              "headerTitleLabels": [
                data.Title,
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
                "CiscoTCparent1",
                ""
              ],
              "expanded": false,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "taskpanelfooterclass": "d-flex justify-content-between",
              "panelClass": "",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [
              ],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "label",
                  "text": "Author",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.Author,
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Level Of Experience",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Tech",
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Type of Instruction",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Wiki",
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Assigned SME",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.assignTo,
                  "inline": true,
                  "labelClass": "col-6"
                }
              ],
              "footer": [
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Cancel",
                  "uuid": "softwareCancelWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "adminWikiInstructionUUID",
                        "properties": {
                          "isWikiAdmin": false,

                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "handleAllAdminWikiActions",
                      "hookType": "afterInit",
                      "methodType": "handleRoleBaseTaspanel",
                      "featuresToBeFilterd": [1, 2, 3, 4],
                      "taskPanelsNeedToBeToggled": [
                        "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                      ],
                      "eventSource": "click"
                    },
                    {
                      "type": "toggle",
                      "eventSource": "click",
                      "name": "subProcessRightNavref",
                      "actionType":"close"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "openWikiUUID",
                        "properties": {
                          "hidden": true
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "pageopenWikiUUID",
                        "properties": {
                          "hidden": false
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "wikiSubProcessTitleUUID",
                        "properties": {
                          "titleValue": "Wiki Instruction",
                          "titleClass": "section-title"
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "SMEStatusUUID"
                      }
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "newCommentUUID"
                      }
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "wikiStatusNewUUID"
                      }
                    }
                  ]
                },
                {
                  "ctype": "button",
                  "color": "warn",
                  "text": "Reject",
                  "uuid": "softwareRejectWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
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
                        "microserviceId": "updateWikiStatus",
                        "requestMethod": "post",
                        "body": {
                          "wikiDocId": "#dellWikiSearchedRecord.wikiDocId",
                          "wikiDocCRId": "#dellWikiSearchedRecord.wikiDocCRId",
                          "wikiStatus": "REJECT",
                          "userName": "#loginUUID.username"
                        },
                        "toBeStringified": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "adminWikiInstructionUUID",
                                "properties": {
                                  "isWikiAdmin": false,

                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "context",
                              "config": {
                                "requestMethod": "add",
                                "key": "dellCarWikiApproveUUID",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "toast",
                              "message": "WIKI data save successfully"
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "hookType": "afterInit",
                              "methodType": "handleRoleBaseTaspanel",
                              "featuresToBeFilterd": [1, 2, 3, 4],
                              "taskPanelsNeedToBeToggled": [
                                "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                              ]
                            },
                            {
                              "type": "toggle",
                              "eventSource": "rowClick",
                              "name": "subProcessRightNavref",
                              "actionType":"close"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "openWikiUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "pageopenWikiUUID",
                                "properties": {
                                  "hidden": false
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "wikiSubProcessTitleUUID",
                                "properties": {
                                  "titleValue": "Wiki Instruction",
                                  "titleClass": "section-title"
                                }
                              },
                              "eventSource": "rowClick"
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "SMEStatusUUID"
                              }
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "newCommentUUID"
                              }
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "wikiStatusNewUUID"
                              }
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "methodType": "updatePendingList",
                              "parent": "Instructions Pending Approval",
                              "rowData": "dellWikiSearchedRecord"
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
                  "ctype": "button",
                  "color": "primary",
                  "text": "Approve",
                  "uuid": "softwareApproveWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "updateWikiStatus",
                        "requestMethod": "post",
                        "body": {
                          "wikiDocId": "#dellWikiSearchedRecord.wikiDocId",
                          "wikiDocCRId": "#dellWikiSearchedRecord.wikiDocCRId",
                          "wikiStatus": "APPROVED",
                          "userName": "#loginUUID.username"
                        },
                        "toBeStringified": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "adminWikiInstructionUUID",
                                "properties": {
                                  "isWikiAdmin": false,

                                }
                              }
                            },
                            {
                              "type": "context",
                              "config": {
                                "requestMethod": "add",
                                "key": "dellCarWikiApproveUUID",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "toast",
                              "message": "WIKI data save successfully"
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "hookType": "afterInit",
                              "methodType": "handleRoleBaseTaspanel",
                              "featuresToBeFilterd": [1, 2, 3, 4],
                              "taskPanelsNeedToBeToggled": [
                                "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                              ]
                            },
                            {
                              "type": "toggle",
                              "eventSource": "rowClick",
                              "name": "subProcessRightNavref",
                              "actionType":"close"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "openWikiUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "pageopenWikiUUID",
                                "properties": {
                                  "hidden": false
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "wikiSubProcessTitleUUID",
                                "properties": {
                                  "titleValue": "Wiki Instruction",
                                  "titleClass": "section-title"
                                }
                              },
                              "eventSource": "rowClick"
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "SMEStatusUUID"
                              }
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "newCommentUUID"
                              }
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "wikiStatusNewUUID"
                              }
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "methodType": "updatePendingList",
                              "parent": "Instructions Pending Approval",
                              "rowData": "dellWikiSearchedRecord"
                            }
                          ]
                        },
                        "onFailure": {
                          "actions": [

                          ]
                        }
                      }
                    }
                  ]
                }
              ]
            }
          },
          "eventSource": "rowClick"
        }
      ];

    } else if (data.status === "PROCESS") {
      let wikiStatus = "Wiki Status" + "-" + data.Title
      processActions = [
        {
          "type": "handleAllAdminWikiActions",
          "methodType": "handleDellWikiEditButtonActions",
          "parent": "Instructions Pending Approval",
          "eventSource": "rowClick",
          "rowData": "dellWikiSearchedRecord"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "adminWikiInstructionUUID",
            "properties": {
              "isWikiAdmin": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "wikiSubProcessTitleUUID",
            "properties": {
              "titleValue": titleValue,
              "titleClass": "section-title"
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiPendingApprovalUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarDraftWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarSubmittedWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiInstructionUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "toggle",
          "eventSource": "rowClick",
          "name": "subProcessRightNavref",
          "actionType":"open"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "openWikiUUID",
            "properties": {
              "hidden": false
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "pageopenWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "deleteComponent",
          "eventSource": "click",
          "config": {
            "key": "wikiStatusUUID"
          }
        },
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data":
            {
              "ctype": "taskPanel",
              "uuid": "wikiStatusUUID",
              "isblueBorder": true,
              "columnWiseTitle": true,
              "header": {
                "icon": "description",
                "iconClass": "active-header",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              },
              "headerTitleLabels": [
                wikiStatus,
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
                "CiscoTCparent1",
                ""
              ],
              "expanded": true,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "taskpanelfooterclass": "d-flex justify-content-between",
              "panelClass": "",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [
              ],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "label",
                  "text": "Author",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.Author,
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Level Of Experience",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Tech",
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Type of Instruction",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Wiki",
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Assigned SME",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.assignTo,
                  "inline": true,
                  "labelClass": "col-6"
                }
              ],
              "footer": [
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Cancel",
                  "uuid": "softwareCancelWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "adminWikiInstructionUUID",
                        "properties": {
                          "isWikiAdmin": false,

                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "handleAllAdminWikiActions",
                      "hookType": "afterInit",
                      "methodType": "handleRoleBaseTaspanel",
                      "featuresToBeFilterd": [1, 2, 3, 4],
                      "taskPanelsNeedToBeToggled": [
                        "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                      ],
                      "eventSource": "click"
                    },
                    {
                      "type": "toggle",
                      "eventSource": "click",
                      "name": "subProcessRightNavref",
                      "actionType":"close"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "openWikiUUID",
                        "properties": {
                          "hidden": true
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "pageopenWikiUUID",
                        "properties": {
                          "hidden": false
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "wikiSubProcessTitleUUID",
                        "properties": {
                          "titleValue": "Wiki Instruction",
                          "titleClass": "section-title"
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "SMEStatusUUID"
                      }
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "newCommentUUID"
                      }
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "wikiStatusNewUUID"
                      }
                    }
                  ]
                },
                {
                  "ctype": "button",
                  "color": "warn",
                  "text": "Reject",
                  "uuid": "softwareRejectWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "updateWikiStatus",
                        "requestMethod": "post",
                        "body": {
                          "wikiDocId": "#dellWikiSearchedRecord.wikiDocId",
                          "wikiDocCRId": "#dellWikiSearchedRecord.wikiDocCRId",
                          "wikiStatus": "REJECT",
                          "userName": "#loginUUID.username"
                        },
                        "toBeStringified": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "adminWikiInstructionUUID",
                                "properties": {
                                  "isWikiAdmin": false,

                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "context",
                              "config": {
                                "requestMethod": "add",
                                "key": "dellCarWikiRejectUUID",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "toast",
                              "message": "WIKI data save successfully"
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "hookType": "afterInit",
                              "methodType": "handleRoleBaseTaspanel",
                              "featuresToBeFilterd": [1, 2, 3, 4],
                              "taskPanelsNeedToBeToggled": [
                                "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                              ]
                            },
                            {
                              "type": "toggle",
                              "eventSource": "rowClick",
                              "name": "subProcessRightNavref",
                              "actionType":"close"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "openWikiUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "pageopenWikiUUID",
                                "properties": {
                                  "hidden": false
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "wikiSubProcessTitleUUID",
                                "properties": {
                                  "titleValue": "Wiki Instruction",
                                  "titleClass": "section-title"
                                }
                              },
                              "eventSource": "rowClick"
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "wikiStatusUUID"
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
                  ]
                },
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Approve",
                  "uuid": "softwareApproveWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "updateWikiStatus",
                        "requestMethod": "post",
                        "body": {
                          "wikiDocId": "#dellWikiSearchedRecord.wikiDocId",
                          "wikiDocCRId": "#dellWikiSearchedRecord.wikiDocCRId",
                          "wikiStatus": "APPROVED",
                          "userName": "#loginUUID.username"
                        },
                        "toBeStringified": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "adminWikiInstructionUUID",
                                "properties": {
                                  "isWikiAdmin": false,

                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "context",
                              "config": {
                                "requestMethod": "add",
                                "key": "dellCarWikiApproveUUID",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "toast",
                              "message": "WIKI data save successfully"
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "hookType": "afterInit",
                              "methodType": "handleRoleBaseTaspanel",
                              "featuresToBeFilterd": [1, 2, 3, 4],
                              "taskPanelsNeedToBeToggled": [
                                "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                              ]
                            },
                            {
                              "type": "toggle",
                              "eventSource": "rowClick",
                              "name": "subProcessRightNavref",
                              "actionType":"close"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "openWikiUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "pageopenWikiUUID",
                                "properties": {
                                  "hidden": false
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "wikiSubProcessTitleUUID",
                                "properties": {
                                  "titleValue": "Wiki Instruction",
                                  "titleClass": "section-title"
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "wikiStatusUUID"
                              }
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "methodType": "updatePendingList",
                              "parent": "Instructions Pending Approval",
                              "rowData": "dellWikiSearchedRecord"
                            }
                          ]
                        },
                        "onFailure": {
                          "actions": [

                          ]
                        }
                      }
                    }
                  ]
                }
              ]
            }
          },
          "eventSource": "rowClick"
        }
      ];
    }
    processActions.forEach((currentAction) => {
      instance.actionService.handleAction(currentAction, instance);
    });
  }

  handleDellSubmittedWikiProcessActions(action: any, instance: any, actionService: any) {
    let data = this.contextService.getDataByKey("dellWikiSubmittedSearchedRecord");
    data['panelType'] = "SUBMIT";
    data['author'] = data.Author;
    let titleValue = "Wiki Instructions" + ">" + data.Title
    let wikiStatus = "Wiki Status" + "-" + data.Title
    let processActions = [];

    if (this.wikiService.pendingWiki.length) {
      this.wikiService.pendingWiki.splice(0, this.wikiService.pendingWiki.length)
    }
    this.wikiService.pendingMyWiki.next(data);

    processActions = [
      {
        "type": "updateComponent",
        "config": {
          "key": "adminWikiInstructionUUID",
          "properties": {
            "isWikiAdmin": true
          }
        },
        "eventSource": "click"
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "wikiSubProcessTitleUUID",
          "properties": {
            "titleValue": titleValue,
            "titleClass": "section-title"
          }
        },
        "eventSource": "rowClick"
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "dellCarWikiPendingApprovalUUID",
          "properties": {
            "hidden": true,
            "expanded":false
          }
        },
        "eventSource": "rowClick"
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "dellCarDraftWikiUUID",
          "properties": {
            "hidden": true
          }
        },
        "eventSource": "rowClick"
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "dellCarSubmittedWikiUUID",
          "properties": {
            "hidden": true
          }
        },
        "eventSource": "rowClick"
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "dellCarWikiInstructionUUID",
          "properties": {
            "hidden": true
          }
        },
        "eventSource": "rowClick"
      },
      {
        "type": "toggle",
        "eventSource": "rowClick",
        "name": "subProcessRightNavref",
        "actionType":"open"
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "openWikiUUID",
          "properties": {
            "hidden": false
          }
        },
        "eventSource": "click"
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "pageopenWikiUUID",
          "properties": {
            "hidden": true
          }
        },
        "eventSource": "click"
      },
      {
        "type": "deleteComponent",
        "eventSource": "click",
        "config": {
          "key": "SubmittedWikiStatusUUID"
        }
      },
      {
        "type": "createComponent",
        "config": {
          "targetId": "pageUUID",
          "containerId": "prebodysectiontwo",
          "data":
          {
            "ctype": "taskPanel",
            "uuid": "SubmittedWikiStatusUUID",
            "isblueBorder": true,
            "columnWiseTitle": true,
            "header": {
              "icon": "description",
              "iconClass": "active-header",
              "statusIcon": "hourglass_empty",
              "statusClass": "incomplete-status"
            },
            "headerTitleLabels": [
              data.Title,
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
              "CiscoTCparent1",
              ""
            ],
            "expanded": true,
            "hideToggle": true,
            "collapsedHeight": "40px",
            "expandedHeight": "40px",
            "taskpanelfooterclass": "d-flex justify-content-between",
            "panelClass": "",
            "taskPanelHeaderClass": "task-panel-header-color-light-grey",
            "visibility": false,
            "hooks": [
              {
                "type": "updateComponent",
                "config": {
                  "key": "ciscoAferAPQtyUUID#@",
                  "updateParent": true,
                  "properties": {
                    "text": "#ciscoTCaddaprtqtyincriment"
                  }
                },
                "hookType": "afterInit"
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "ciscoAfterAPStockQty#@",
                  "updateParent": true,
                  "properties": {
                    "text": "#getAddPartAvaliablequantitiesdata"
                  }
                },
                "hookType": "afterInit"
              },
              {
                "type": "stringOperation",
                "config": {
                  "key": "ciscoAfterAPStockQtyAvail#@",
                  "updateParent": true,
                  "lstr": "#getAddPartAvaliablequantitiesdata",
                  "rstr": "Available",
                  "operation": "concat",
                  "concatSymbol": " "
                },
                "hookType": "afterInit"
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "ciscoAfterAPStockQty#@",
                  "updateParent": true,
                  "properties": {
                    "text": "#ciscoAfterAPStockQtyAvail#@"
                  }
                },
                "hookType": "afterInit"
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "ciscoTCrenewInstrUUID#@",
                  "updateParent": true,
                  "properties": {
                    "text": "#ciscoTCrenewInstrValue"
                  }
                },
                "hookType": "afterInit"
              }
            ],
            "validations": [],
            "actions": [],
            "items": [
              {
                "ctype": "label",
                "text": "SME",
                "labelClass": "col-6"
              },
              {
                "ctype": "label",
                "text": data.Author,
                "inline": true,
                "labelClass": "col-6"
              },
              {
                "ctype": "label",
                "text": "Type of Instruction",
                "labelClass": "col-6"
              },
              {
                "ctype": "label",
                "text": "Wiki",
                "inline": true,
                "labelClass": "col-6"
              },
              {
                "ctype": "label",
                "text": "Status",
                "labelClass": "col-6"
              },
              {
                "ctype": "label",
                "text": data.status,
                "inline": true,
                "labelClass": "col-6"
              }
            ],
            "footer": []
          }
        },
        "eventSource": "rowClick"
      }
    ];

    processActions.forEach((currentAction) => {
      instance.actionService.handleAction(currentAction, instance);
    });
  }

  getAdminWikiInstructionsData(action: any, instance: any, actionService: any) {
    let wikiContext;
    let wikiUnitData;
    let workCenterList = []
    let familyList = []
    let myFamilyList = []
    let platFormList = []
    let modelList = []
    let commodityList = []
    let defectCodeData = []
    let defectCodeData2 = [];
    let defectCodeData3 = [];
    let instrLangData = [
      { value: "English - EN", viewValue: 'English - EN' },
      { value: "Hungarian - HU", viewValue: 'Hungarian - HU' },
      { value: "Ukrainian - UK", viewValue: 'Ukrainian - UK' },
      { value: "Polish - PL", viewValue: 'Polish - PL' },
      { value: "Russian - RU", viewValue: 'Russian - RU' },
      { value: "Malay - MS", viewValue: 'Malay - MS' },
      { value: "Chinese - ZH", viewValue: 'Chinese - ZH' },
      { value: "French - FR", viewValue: 'French - FR' },
      { value: "German - DE", viewValue: 'German - DE' }
    ];
    let statusData = [
      { value: "PENDING FOR APPROVAL", viewValue: 'PENDING FOR APPROVAL' },
      { value: "APPROVED", viewValue: 'APPROVED' },
      { value: "REJECT", viewValue: 'REJECT' },
      { value: "PROCESS", viewValue: 'PROCESS' }
    ]

    this.wikiService.getWikiContextData().subscribe((data: any) => {
      wikiContext = data.data;
      this.wikiService.getUnitDetailsData().subscribe((dataa: any) => {
        wikiUnitData = dataa.data;

        // this.wikiService.getUserData().subscribe((data: any) => {
        // });
        this.wikiService.getAdminWikiDefectCodeData().subscribe((data: any) => {
          defectCodeData = data.data;
          defectCodeData2 = data.data;
          defectCodeData3 = data.data;

          const loginDetails = this.contextService.getDataByString("#userAccountInfo");
          workCenterList = loginDetails.WorkCenterDetails.filter(item => loginDetails.PersonalDetails.DEFAULT_LOCATION_ID === item.LOCATION_ID)

          wikiContext.O_FAMILY_CURSOR.map(item1 => {
            const familyData = wikiUnitData.O_FAMILY_CURSOR.filter(item2 => item1.componentName === item2.partNo);
            familyList = familyData.map((family: any) => {
              return { ...family, name: family.platformName };
            })
            myFamilyList.push(...familyList);

          })
          wikiContext.O_PLATFORM_CURSOR.map(item1 => {
            const platformData = wikiUnitData.O_PLATFORM_CURSOR.filter(item2 => item1.componentName === item2.partNo);
            platFormList = platformData.map((platform: any) => {
              return { ...platform, name: platform.platformName };
            })

          })

          wikiContext.O_COMMODITY_CURSOR.map(item1 => {
            const commodityData = wikiUnitData.O_COMMODITY_CURSOR.filter(item2 => item1.componentName === item2.partNo);

            commodityList = commodityData.map((commodity: any) => {

              return { ...commodity, name: commodity.platformName };
            })

          });

          this.contextService.addToContext("workCenterData", workCenterList);
          this.contextService.addToContext("familyContextData", myFamilyList);
          this.contextService.addToContext("platformContextData", platFormList);
          this.contextService.addToContext("commodityContextData", commodityList);
          this.contextService.addToContext("instructionLangData", instrLangData);
          this.contextService.addToContext("wikiStatusData", statusData);
          this.contextService.addToContext("wikiDefectCodeData", defectCodeData);
          this.contextService.addToContext("wikiDefectCodeData2", defectCodeData);
          this.contextService.addToContext("wikiDefectCodeData3", defectCodeData);
          let updateFamily = [
            {
              "type": "updateComponent",
              "hookType": "afterInit",
              "config": {
                "key": "dellCarWikiFamilyUUID",
                "dropDownProperties": {
                  "options": "#familyContextData",
                  "isMultiSelect": true
                }
              }
            },
            {
              "type": "updateComponent",
              "hookType": "afterInit",
              "config": {
                "key": "dellCarWikiWorkCenterUUID",
                "dropDownProperties": {
                  "options": "#workCenterData",
                  "isMultiSelect": true
                }
              }
            },
            {
              "type": "updateComponent",
              "hookType": "afterInit",
              "config": {
                "key": "dellCarWikiPlatformUUID",
                "dropDownProperties": {
                  "options": "#platformContextData",
                  "isMultiSelect": true
                }
              }
            },
            {
              "type": "updateComponent",
              "hookType": "afterInit",
              "config": {
                "key": "dellCarWikiCommodityUUID",
                "dropDownProperties": {
                  "options": "#commodityContextData",
                  "isMultiSelect": true
                }
              }
            },
            {
              "type": "updateComponent",
              "hookType": "afterInit",
              "config": {
                "key": "dellCarWikiInstructionLangUUID",
                "dropDownProperties": {
                  "options": "#instructionLangData",
                  "isMultiSelect": true
                }
              }
            },
            {
              "type": "updateComponent",
              "hookType": "afterInit",
              "config": {
                "key": "dellCarWikiStatusUUID",
                "dropDownProperties": {
                  "options": "#wikiStatusData",
                  "isMultiSelect": true
                }
              }
            },
            {
              "type": "updateComponent",
              "hookType": "afterInit",
              "config": {
                "key": "dellCarWikiDefectLevel1UUID",
                "dropDownProperties": {
                  "options": "#wikiDefectCodeData",
                  "isMultiSelect": true
                }
              }
            },
            {
              "type": "updateComponent",
              "hookType": "afterInit",
              "config": {
                "key": "dellCarWikiDefectLevel2UUID",
                "dropDownProperties": {
                  "options": "#wikiDefectCodeData2",
                  "isMultiSelect": true
                }
              }
            },
            {
              "type": "updateComponent",
              "hookType": "afterInit",
              "config": {
                "key": "dellCarWikiDefectLevel3UUID",
                "dropDownProperties": {
                  "options": "#wikiDefectCodeData3",
                  "isMultiSelect": true
                }
              }
            }
          ];
          updateFamily.forEach((currentAction) => {
            instance.actionService.handleAction(currentAction, instance);
          });
        })
      });
    })
  }

  handleDellInstructionWikiGetStatusActions(action: any, instance: any, actionService: any) {
    let selectedWorkCenterValue = this.contextService.getDataByKey("dellCarWikiWorkCenterMultiSelectDropdownVal");
    let selectedFamilyValue = this.contextService.getDataByKey("dellCarWikiFamilyMultiSelectDropdownVal");
    let selectedPlatformValue = this.contextService.getDataByKey("dellCarWikiPlatformMultiSelectDropdownVal");
    let selectedCommodityValue = this.contextService.getDataByKey("dellCarWikiCommodityMultiSelectDropdownVal");
    let selectedDefect1Value = this.contextService.getDataByKey("dellCarWikiDefect1MultiSelectDropdownVal");
    let selectedDefect2Value = this.contextService.getDataByKey("dellCarWikiDefect2MultiSelectDropdownVal");
    let selectedDefect3Value = this.contextService.getDataByKey("dellCarWikiDefect3MultiSelectDropdownVal");
    let selectedInstLangValue = this.contextService.getDataByKey("dellCarWikiInstLangMultiSelectDropdownVal");
    let selectedStatusValue = this.contextService.getDataByKey("dellCarWikiStatusMultiSelectDropdownVal");

// this.wikiService.getAdminFilterWikiData()
this.wikiService.getAdminFilterWikiData().subscribe((data: any) => {
  // let filterData = data.data;
  // let filterData = data.data.filter(function (item) {
  //   for (const [key, value] of Object.entries(obj)) {
  //     if (value == undefined) delete obj[key];
  //     if (item[key] === undefined || item[key] != obj[key])
  //       return false;
  //   }
  //   return true;
  // });
  // this.contextService.addToContext("getFilteredData", filterData);
  console.log(data.data);
  
  let processAction = [
    {
      "type": "updateComponent",
      "config": {
        "key": "dellCarWikiStatusTableUUID",
        "fieldProperties": {
          "dataSource": data.data
        }
      },
      "eventSource": "click"
    }
  ];
  processAction.forEach((currentAction) => {
    instance.actionService.handleAction(currentAction, instance);
  });
})
    let obj = {};

    selectedWorkCenterValue ? obj['workCenterId'] = selectedWorkCenterValue[0] : '',
      selectedFamilyValue ? obj['family'] = selectedFamilyValue[0] : '',
      selectedPlatformValue ? obj['platform'] = selectedPlatformValue[0] : '',
      selectedCommodityValue ? obj['commodity'] = selectedCommodityValue[0] : '',
      selectedInstLangValue ? obj['instructionLanguage'] = selectedInstLangValue[0] : '',
      selectedStatusValue ? obj['status'] = selectedStatusValue[0] : ''

    if (obj) {
      // this.wikiService.getPendingWikiData(obj).subscribe((data: any) => {
      //   // let filterData = data.data;
      //   let filterData = data.data.filter(function (item) {
      //     for (const [key, value] of Object.entries(obj)) {
      //       if (value == undefined) delete obj[key];
      //       if (item[key] === undefined || item[key] != obj[key])
      //         return false;
      //     }
      //     return true;
      //   });
      //   this.contextService.addToContext("getFilteredData", filterData);
      //   let processAction = [
      //     {
      //       "type": "updateComponent",
      //       "config": {
      //         "key": "dellCarWikiStatusTableUUID",
      //         "fieldProperties": {
      //           "dataSource": "#getFilteredData"
      //         }
      //       },
      //       "eventSource": "click"
      //     }
      //   ];
      //   processAction.forEach((currentAction) => {
      //     instance.actionService.handleAction(currentAction, instance);
      //   });
      // })



    }


  }

  handleDellWikiInstructionFilter(action: any, instance: any, actionService: any) {
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    let data = this.contextService.getDataByKey("dellWikiSearchedRecord");
    data['author'] = data.Author;
    let titleValue = "Wiki Instructions" + ">" + data.Title
    let processActions = [];
    if (this.wikiService.pendingWiki.length) {
      this.wikiService.pendingWiki.splice(0, this.wikiService.pendingWiki.length)
    }
    this.wikiService.pendingMyWiki.next(data);


    if (data.status == "PENDING FOR APPROVAL") {
      let wikiStatus = "Wiki Status" + "-" + data.Title
      processActions = [
        {
          "type": "updateComponent",
          "config": {
            "key": "adminWikiInstructionUUID",
            "properties": {
              "isWikiAdmin": true,

            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "wikiSubProcessTitleUUID",
            "properties": {
              "titleValue": titleValue,
              "titleClass": "section-title"
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiPendingApprovalUUID",
            "properties": {
              "hidden": true,
              "expanded":false
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarDraftWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarSubmittedWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiInstructionUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "toggle",
          "eventSource": "rowClick",
          "name": "subProcessRightNavref",
          "actionType":"open"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "openWikiUUID",
            "properties": {
              "hidden": false
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "pageopenWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "deleteComponent",
          "eventSource": "click",
          "config": {
            "key": "SMEStatusUUID"
          }
        },
        {
          "type": "deleteComponent",
          "eventSource": "click",
          "config": {
            "key": "similarInstructionUUID"
          }
        },
        {
          "type": "deleteComponent",
          "eventSource": "click",
          "config": {
            "key": "wikiStatusUUID"
          }
        },
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data":
            {
              "ctype": "taskPanel",
              "uuid": "SMEStatusUUID",
              "isblueBorder": true,
              "columnWiseTitle": true,
              "header": {
                "icon": "description",
                "iconClass": "active-header",
                "class": "mat-expansion-panel-header-title heading2"
              },
              "headerTitleLabels": [
                "SME Status",
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
                "CiscoTCparent1",
                ""
              ],
              "expanded": true,
              "hidden": false,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "taskpanelfooterclass": "d-flex justify-content-between",
              "panelClass": "",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAferAPQtyUUID#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoTCaddaprtqtyincriment"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAfterAPStockQty#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#getAddPartAvaliablequantitiesdata"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "stringOperation",
                  "config": {
                    "key": "ciscoAfterAPStockQtyAvail#@",
                    "updateParent": true,
                    "lstr": "#getAddPartAvaliablequantitiesdata",
                    "rstr": "Available",
                    "operation": "concat",
                    "concatSymbol": " "
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAfterAPStockQty#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoAfterAPStockQtyAvail#@"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoTCrenewInstrUUID#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoTCrenewInstrValue"
                    }
                  },
                  "hookType": "afterInit"
                }
              ],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "title",
                  "title": "Wiki currently not assigned to SME",
                  "uuid": "dellCarWikiPendingApprovalTextUUID",
                  "titleValueClass": "rework-font",
                  "titleClass": "mt-3 mb-4 text-secondary rework-font"
                },
                {
                  "ctype": "title",
                  "uuid": "dellPackoutHddHeaderUUID",
                  "titleClass": "sidenav-title body2 font-bold",
                  "title": "SME Status",
                  "titleValue": ""
                },
                {
                  "formGroupClass": "wiki-buttoon-toggle-cls body2",
                  "ctype": "actionToggle",
                  "labelPosition": "before",
                  "name": "returnHddToggle",
                  "selectedVal": "Available",
                  "options": [
                    {
                      "bgcolor": "light-blue",
                      "color": "white",
                      "text": "Available",
                      "value": "Available"
                    },
                    {
                      "bgcolor": "light-blue",
                      "color": "white",
                      "text": "PROCESS",
                      "value": "PROCESS"
                    }
                  ],
                  "validations": [],
                  "label": "Would you like to Process this Wiki instruction / Make it available?",
                  "labelClass": "l-class",
                  "toggleClass": "t-class",
                  "uuid": "dellInitialToggleValues",
                  "hooks": [],
                  "actions": [
                    {
                      "eventSource": "change",
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "smeToggleValue",
                        "data": "elementControlValue"
                      }
                    }
                  ],
                  "submitable": true
                },
                {
                  "ctype": "divider",
                  "dividerClass": "spacer-borderFQACosmetic"
                }
              ],
              "footer": [
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Complete",
                  "uuid": "softwareCompleteSMEUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "updateWikiStatus",
                        "requestMethod": "post",
                        "body": {
                          "wikiDocId": "#dellWikiSearchedRecord.wikiDocId",
                          "wikiDocCRId": "#dellWikiSearchedRecord.wikiDocCRId",
                          "wikiStatus": "#smeToggleValue",
                          "userName": "#loginUUID.username"
                        },
                        "toBeStringified": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "condition",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": "#smeToggleValue",
                                "rhs": "Available"
                              },
                              "eventSource": "click",
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "softwareCompleteInsFlagUUID#@",
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "SMEStatusUUID",
                                        "properties": {
                                          "expanded": false,
                                          "disabled":true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "similarInstructionUUID",
                                        "properties": {
                                          "expanded": true,
                                          "disabled": false
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "softwareCompleteSMEUUID#@",
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
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "softwareCompleteInsFlagUUID#@",
                                        "properties": {
                                          "disabled": false
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "SMEStatusUUID",
                                        "properties": {
                                          "expanded": false,
                                          "disabled":true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "similarInstructionUUID",
                                        "properties": {
                                          "expanded": true,
                                          "disabled": false
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "softwareCompleteSMEUUID#@",
                                        "properties": {
                                          "disabled": true
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
                          "actions": []
                        }
                      }
                    }
                  ]
                }
              ]
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data":
            {
              "ctype": "taskPanel",
              "uuid": "similarInstructionUUID",
              "isblueBorder": true,
              "columnWiseTitle": true,
              "disabled":true,
              "header": {
                "icon": "description",
                "iconClass": "active-header",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              },
              "headerTitleLabels": [
                "Similar Instructions Flag",
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
                "CiscoTCparent1",
                ""
              ],
              "expanded": false,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "taskpanelfooterclass": "d-flex justify-content-between",
              "panelClass": "",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [
                {
                  "type": "microservice",
                  "hookType": "afterInit",
                  "config": {
                    "microserviceId": "getWikiItems",
                    "requestMethod": "post",
                    "body": {
                      "locationId": "#dellWikiSearchedRecord.locationId",
                      "clientId": "#dellWikiSearchedRecord.clientId",
                      "contractId": "#dellWikiSearchedRecord.contractId",
                      "workCenterId": "#dellWikiSearchedRecord.workCenterId",
                      "family": "#dellWikiSearchedRecord.Family",
                      "platform": "#dellWikiSearchedRecord.Platform",
                      "modelPart": "#dellWikiSearchedRecord.ModelPart",
                      "commodity": "#dellWikiSearchedRecord.commodity",
                      "defect": "#dellWikiSearchedRecord.defect",
                      "userName": userName,
                      "wikiStatus": "#dellWikiSearchedRecord.defect"
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
                            "key": "getWikiItems",
                            "data": "responseData"
                          }
                        },
                        {
                          "methodType": "updateTaskLableQty",
                          "type": "handleAllAdminWikiActions",
                          "dataArray":"#getWikiItems",
                          "uuid":"dellCarWikiPendingApprovalTextUUID"
                        },
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "dellCarSimilarInstructionWikiTableUUID",
                            "fieldProperties": {
                              "dataSource": "#getWikiItems"
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
                            "key": "dellCarWikiSearchAndSortData",
                            "data": []
                          }
                        },
                        {
                          "type": "handleAllAdminWikiActions",
                          "methodType": "Update_QTY",
                          "hookType": "afterInit",
                          "taskPanelUUID": "dellCarWikiPendingApprovalUUID",
                          "dataArray": "#dellCarWikiSearchAndSortData",
                          "header": {
                            "title": "Instructions Pending Approval",
                            "icon": "description",
                            "iconClass": "active-header",
                            "status": "",
                            "statusIcon": "hourglass_empty",
                            "statusClass": "incomplete-status"
                          }
                        },
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "dellCarWikiTableUUID",
                            "fieldProperties": {
                              "dataSource": "#dellCarWikiSearchAndSortData"
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
                        }
                      ]
                    }
                  }
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAferAPQtyUUID#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoTCaddaprtqtyincriment"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAfterAPStockQty#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#getAddPartAvaliablequantitiesdata"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "stringOperation",
                  "config": {
                    "key": "ciscoAfterAPStockQtyAvail#@",
                    "updateParent": true,
                    "lstr": "#getAddPartAvaliablequantitiesdata",
                    "rstr": "Available",
                    "operation": "concat",
                    "concatSymbol": " "
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAfterAPStockQty#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoAfterAPStockQtyAvail#@"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoTCrenewInstrUUID#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoTCrenewInstrValue"
                    }
                  },
                  "hookType": "afterInit"
                }
              ],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "title",
                  "title": "",
                  "uuid": "dellCarWikiPendingApprovalTextUUID",
                  "titleValueClass": "rework-font",
                  "titleClass": "mt-3 mb-4 text-secondary rework-font"
                },
                {
                  "ctype": "wikiTableWithSearchAndSort",
                  "uuid": "dellCarSimilarInstructionWikiTableUUID",
                  "tableClass": "replaceTaskTableclass",
                  "tableDivCalss": "wiki-tableDivCalss",
                  "tableHeaderClass": "requisitionList-table-header subtitle1 wiki-custom-header",
                  "tableContainerClass": "requisitionList-table",
                  "tableDataClass": "wiki-tableData",
                  "tableSearchClass": "tableSearchClass",
                  "serachVariable": "#dellKDSearchID",
                  "searchBox": true,
                  "hooks": [],
                  "displayedColumns": [
                    "icon",
                    "Date",
                    "Title",
                    "Author",
                    "EXP",
                    "Family",
                    "Platform",
                    "ModelName/PN",
                    "Work Center",
                    "Language"
                  ],
                  "displayValues": {
                    "icon": "icon",
                    "date": "Date",
                    "wikiTitle": "Title",
                    "author": "Author",
                    "experience": "EXP",
                    "family": "Family",
                    "platform": "Platform",
                    "modelPart": "ModelName/PN",
                    "workCenterId": "Work Center",
                    "instructionLanguage": "Language"
                  },
                  "datasource": "#dellCarWikiInstructionFlagData",
                  "iconList": {
                    "icon": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": false
                    },
                    "Date": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "Title": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "Author": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "EXP": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "Family": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "Platform": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "ModelName/PN": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "Work Center": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    },
                    "Language": {
                      "iconBeforeText": false,
                      "iconAfterText": false,
                      "showText": true,
                      "enableSort": true
                    }
                  },
                  "action": [
                    {
                      "type": "addRowData",
                      "keyToSave": "dellKDSearchedRecord",
                      "eventSource": "rowClick"
                    }
                  ]

                }

              ],
              "footer": [
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Complete",
                  "uuid": "softwareCompleteInsFlagUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": true,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "wikiStatusUUID",
                        "properties": {
                          "expanded": true,
                          "disabled": false
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "similarInstructionUUID",
                        "properties": {
                          "expanded": false,
                          "disabled":false,
                          "header": {
                            "icon": "description",
                            "iconClass": "complete-task",
                            "statusIcon": "check_circle",
                            "statusClass": "complete-status"
                        }
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "softwareRejectWikiStatusUUID#@",
                        "properties": {
                          "disabled": false
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "softwareApproveWikiStatusUUID#@",
                        "properties": {
                          "disabled": false
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "softwareCompleteInsFlagUUID#@",
                        "properties": {
                          "disabled": true
                        }
                      },
                      "eventSource": "click"
                    }
                  ]
                }
              ]
            }


          },
          "eventSource": "rowClick"
        },
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data":
            {
              "ctype": "taskPanel",
              "uuid": "wikiStatusUUID",
              "isblueBorder": true,
              "columnWiseTitle": true,
              "disabled":true,
              "header": {
                "icon": "description",
                "iconClass": "active-header",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              },
              "headerTitleLabels": [
                wikiStatus,
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
                "CiscoTCparent1",
                ""
              ],
              "expanded": false,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "taskpanelfooterclass": "d-flex justify-content-between",
              "panelClass": "",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAferAPQtyUUID#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoTCaddaprtqtyincriment"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAfterAPStockQty#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#getAddPartAvaliablequantitiesdata"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "stringOperation",
                  "config": {
                    "key": "ciscoAfterAPStockQtyAvail#@",
                    "updateParent": true,
                    "lstr": "#getAddPartAvaliablequantitiesdata",
                    "rstr": "Available",
                    "operation": "concat",
                    "concatSymbol": " "
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAfterAPStockQty#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoAfterAPStockQtyAvail#@"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoTCrenewInstrUUID#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoTCrenewInstrValue"
                    }
                  },
                  "hookType": "afterInit"
                }
              ],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "label",
                  "text": "Author",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.Author,
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Level Of Experience",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Tech",
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Type of Instruction",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Wiki",
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Assigned SME",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.assignTo,
                  "inline": true,
                  "labelClass": "col-6"
                }
              ],
              "footer": [
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Cancel",
                  "uuid": "softwareCancelWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "adminWikiInstructionUUID",
                        "properties": {
                          "isWikiAdmin": false,

                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "handleAllAdminWikiActions",
                      "hookType": "afterInit",
                      "methodType": "handleRoleBaseTaspanel",
                      "featuresToBeFilterd": [1, 2, 3, 4],
                      "taskPanelsNeedToBeToggled": [
                        "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                      ],
                      "eventSource": "click"
                    },
                    {
                      "type": "toggle",
                      "eventSource": "click",
                      "name": "subProcessRightNavref",
                      "actionType":"close"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "openWikiUUID",
                        "properties": {
                          "hidden": true
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "pageopenWikiUUID",
                        "properties": {
                          "hidden": false
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "wikiSubProcessTitleUUID",
                        "properties": {
                          "titleValue": "Wiki Instruction",
                          "titleClass": "section-title"
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "SMEStatusUUID"
                      }
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "newCommentUUID"
                      }
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "wikiStatusNewUUID"
                      }
                    }
                  ]
                },
                {
                  "ctype": "button",
                  "color": "warn",
                  "text": "Reject",
                  "uuid": "softwareRejectWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
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
                        "microserviceId": "updateWikiStatus",
                        "requestMethod": "post",
                        "body": {
                          "wikiDocId": "#dellWikiSearchedRecord.wikiDocId",
                          "wikiDocCRId": "#dellWikiSearchedRecord.wikiDocCRId",
                          "wikiStatus": "REJECT",
                          "userName": "#loginUUID.username"
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
                                "key": "dellCarWikiApproveUUID",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "toast",
                              "message": "WIKI data save successfully"
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "hookType": "afterInit",
                              "methodType": "handleRoleBaseTaspanel",
                              "featuresToBeFilterd": [1, 2, 3, 4],
                              "taskPanelsNeedToBeToggled": [
                                "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                              ]
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "wikiSubProcessTitleUUID",
                                "properties": {
                                  "titleValue": "Wiki Instruction",
                                  "titleClass": "section-title"
                                }
                              },
                              "eventSource": "rowClick"
                            },
                            {
                              "type": "toggle",
                              "eventSource": "click",
                              "name": "subProcessRightNavref",
                              "actionType":"close"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "openWikiUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "pageopenWikiUUID",
                                "properties": {
                                  "hidden": false
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "SMEStatusUUID"
                              }
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "similarInstructionUUID"
                              }
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "wikiStatusUUID"
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
                  ]
                },
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Approve",
                  "uuid": "softwareApproveWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "updateWikiStatus",
                        "requestMethod": "post",
                        "body": {
                          "wikiDocId": "#dellWikiSearchedRecord.wikiDocId",
                          "wikiDocCRId": "#dellWikiSearchedRecord.wikiDocCRId",
                          "wikiStatus": "APPROVED",
                          "userName": "#loginUUID.username"
                        },
                        "toBeStringified": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "adminWikiInstructionUUID",
                                "properties": {
                                  "isWikiAdmin": false,

                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "context",
                              "config": {
                                "requestMethod": "add",
                                "key": "dellCarWikiApproveUUID",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "toast",
                              "message": "WIKI data save successfully"
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "hookType": "afterInit",
                              "methodType": "handleRoleBaseTaspanel",
                              "featuresToBeFilterd": [1, 2, 3, 4],
                              "taskPanelsNeedToBeToggled": [
                                "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                              ]
                            },
                            {
                              "type": "toggle",
                              "eventSource": "rowClick",
                              "name": "subProcessRightNavref",
                              "actionType":"close"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "openWikiUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "pageopenWikiUUID",
                                "properties": {
                                  "hidden": false
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "wikiSubProcessTitleUUID",
                                "properties": {
                                  "titleValue": "Wiki Instruction",
                                  "titleClass": "section-title"
                                }
                              },
                              "eventSource": "rowClick"
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "SMEStatusUUID"
                              }
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "similarInstructionUUID"
                              }
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "wikiStatusUUID"
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
                  ]
                }
              ]
            }
          },
          "eventSource": "rowClick"
        }
      ];
    } else if (data.status == "PROCESS") {
      let wikiStatus = "Wiki Status" + "-" + data.Title
      processActions = [
        {
          "type": "updateComponent",
          "config": {
            "key": "adminWikiInstructionUUID",
            "properties": {
              "isWikiAdmin": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "wikiSubProcessTitleUUID",
            "properties": {
              "titleValue": titleValue,
              "titleClass": "section-title"
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiPendingApprovalUUID",
            "properties": {
              "hidden": true,
              "expanded":false
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarDraftWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarSubmittedWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiInstructionUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "toggle",
          "eventSource": "rowClick",
          "name": "subProcessRightNavref",
          "actionType":"open"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "openWikiUUID",
            "properties": {
              "hidden": false
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "pageopenWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "deleteComponent",
          "eventSource": "click",
          "config": {
            "key": "wikiStatusUUID"
          }
        },
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data":
            {
              "ctype": "taskPanel",
              "uuid": "wikiStatusUUID",
              "isblueBorder": true,
              "columnWiseTitle": true,
              "header": {
                "icon": "description",
                "iconClass": "active-header",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              },
              "headerTitleLabels": [
                wikiStatus,
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
                "CiscoTCparent1",
                ""
              ],
              "expanded": true,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "taskpanelfooterclass": "d-flex justify-content-between",
              "panelClass": "",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [
              ],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "label",
                  "text": "Author",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.Author,
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Level Of Experience",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Tech",
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Type of Instruction",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Wiki",
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Assigned SME",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.assignTo,
                  "inline": true,
                  "labelClass": "col-6"
                }
              ],
              "footer": [
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Cancel",
                  "uuid": "softwareCancelWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "adminWikiInstructionUUID",
                        "properties": {
                          "isWikiAdmin": false,

                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "handleAllAdminWikiActions",
                      "hookType": "afterInit",
                      "methodType": "handleRoleBaseTaspanel",
                      "featuresToBeFilterd": [1, 2, 3, 4],
                      "taskPanelsNeedToBeToggled": [
                        "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                      ],
                      "eventSource": "click"
                    },
                    {
                      "type": "toggle",
                      "eventSource": "click",
                      "name": "subProcessRightNavref",
                      "actionType":"close"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "openWikiUUID",
                        "properties": {
                          "hidden": true
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "pageopenWikiUUID",
                        "properties": {
                          "hidden": false
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "wikiSubProcessTitleUUID",
                        "properties": {
                          "titleValue": "Wiki Instruction",
                          "titleClass": "section-title"
                        }
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "SMEStatusUUID"
                      }
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "newCommentUUID"
                      }
                    },
                    {
                      "type": "deleteComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "wikiStatusNewUUID"
                      }
                    }
                  ]
                },
                {
                  "ctype": "button",
                  "color": "warn",
                  "text": "Reject",
                  "uuid": "softwareRejectWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "updateWikiStatus",
                        "requestMethod": "post",
                        "body": {
                          "wikiDocId": "#dellWikiSearchedRecord.wikiDocId",
                          "wikiDocCRId": "#dellWikiSearchedRecord.wikiDocCRId",
                          "wikiStatus": "REJECT",
                          "userName": "#loginUUID.username"
                        },
                        "toBeStringified": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "adminWikiInstructionUUID",
                                "properties": {
                                  "isWikiAdmin": false,

                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "context",
                              "config": {
                                "requestMethod": "add",
                                "key": "dellCarWikiApproveUUID",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "hookType": "afterInit",
                              "methodType": "handleRoleBaseTaspanel",
                              "featuresToBeFilterd": [1, 2, 3, 4],
                              "taskPanelsNeedToBeToggled": [
                                "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                              ]
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "SMEStatusUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "rowClick"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "similarInstructionUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "rowClick"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "wikiStatusUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "rowClick"
                            },
                            {
                              "type": "toggle",
                              "eventSource": "click",
                              "name": "subProcessRightNavref",
                              "actionType":"close"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "openWikiUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "pageopenWikiUUID",
                                "properties": {
                                  "hidden": false
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "toast",
                              "message": "WIKI IS REJECTED SUCCESFULLY"
                            }
                          ]
                        },
                        "onFailure": {
                          "actions": [

                          ]
                        }
                      }
                    }
                  ]
                },
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Approve",
                  "uuid": "softwareApproveWikiStatusUUID#@",
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": [
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "updateWikiStatus",
                        "requestMethod": "post",
                        "body": {
                          "wikiDocId": "#dellWikiSearchedRecord.wikiDocId",
                          "wikiDocCRId": "#dellWikiSearchedRecord.wikiDocCRId",
                          "wikiStatus": "APPROVED",
                          "userName": "#loginUUID.username"
                        },
                        "toBeStringified": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "adminWikiInstructionUUID",
                                "properties": {
                                  "isWikiAdmin": false,

                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "context",
                              "config": {
                                "requestMethod": "add",
                                "key": "dellCarWikiApproveUUID",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "handleAllAdminWikiActions",
                              "hookType": "afterInit",
                              "methodType": "handleRoleBaseTaspanel",
                              "featuresToBeFilterd": [1, 2, 3, 4],
                              "taskPanelsNeedToBeToggled": [
                                "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                              ]
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "SMEStatusUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "rowClick"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "similarInstructionUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "rowClick"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "wikiStatusUUID",
                                "properties": {
                                  "hidden": true
                                }
                              },
                              "eventSource": "rowClick"
                            },
                            {
                              "type": "toast",
                              "message": "WIKI data save successfully"
                            }
                          ]
                        },
                        "onFailure": {
                          "actions": [

                          ]
                        }
                      }
                    }
                  ]
                }
              ]
            }
          },
          "eventSource": "rowClick"
        }
      ];

    } else if (data.status === "APPROVED") {
      let wikiStatus = "Wiki Status" + "-" + data.Title
      processActions = [
        {
          "type": "updateComponent",
          "config": {
            "key": "adminWikiInstructionUUID",
            "properties": {
              "isWikiAdmin": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "wikiSubProcessTitleUUID",
            "properties": {
              "titleValue": titleValue,
              "titleClass": "section-title"
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiPendingApprovalUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarDraftWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarSubmittedWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiInstructionUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "toggle",
          "eventSource": "rowClick",
          "name": "subProcessRightNavref",
          "actionType":"open"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "openWikiUUID",
            "properties": {
              "hidden": false
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "pageopenWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "deleteComponent",
          "eventSource": "click",
          "config": {
            "key": "SubmittedWikiStatusUUID"
          }
        },
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data":
            {
              "ctype": "taskPanel",
              "uuid": "SubmittedWikiStatusUUID",
              "isblueBorder": true,
              "columnWiseTitle": true,
              "header": {
                "icon": "description",
                "iconClass": "active-header",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              },
              "headerTitleLabels": [
                data.Title,
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
                "CiscoTCparent1",
                ""
              ],
              "expanded": true,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "taskpanelfooterclass": "d-flex justify-content-between",
              "panelClass": "",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAferAPQtyUUID#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoTCaddaprtqtyincriment"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAfterAPStockQty#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#getAddPartAvaliablequantitiesdata"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "stringOperation",
                  "config": {
                    "key": "ciscoAfterAPStockQtyAvail#@",
                    "updateParent": true,
                    "lstr": "#getAddPartAvaliablequantitiesdata",
                    "rstr": "Available",
                    "operation": "concat",
                    "concatSymbol": " "
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAfterAPStockQty#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoAfterAPStockQtyAvail#@"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoTCrenewInstrUUID#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoTCrenewInstrValue"
                    }
                  },
                  "hookType": "afterInit"
                }
              ],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "label",
                  "text": "SME",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.Author,
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Type of Instruction",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Wiki",
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Status",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.status,
                  "inline": true,
                  "labelClass": "col-6"
                }
              ],
              "footer": []
            }
          },
          "eventSource": "rowClick"
        }
      ];
    } else if (data.status === "REJECT") {
      let wikiStatus = "Wiki Status" + "-" + data.Title
      processActions = [
        {
          "type": "updateComponent",
          "config": {
            "key": "adminWikiInstructionUUID",
            "properties": {
              "isWikiAdmin": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "wikiSubProcessTitleUUID",
            "properties": {
              "titleValue": titleValue,
              "titleClass": "section-title"
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiPendingApprovalUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarDraftWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarSubmittedWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiInstructionUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "rowClick"
        },
        {
          "type": "toggle",
          "eventSource": "rowClick",
          "name": "subProcessRightNavref"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "openWikiUUID",
            "properties": {
              "hidden": false
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "pageopenWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "deleteComponent",
          "eventSource": "click",
          "config": {
            "key": "SubmittedWikiStatusUUID"
          }
        },
        {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data":
            {
              "ctype": "taskPanel",
              "uuid": "SubmittedWikiStatusUUID",
              "isblueBorder": true,
              "columnWiseTitle": true,
              "header": {
                "icon": "description",
                "iconClass": "active-header",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              },
              "headerTitleLabels": [
                data.Title,
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
                "CiscoTCparent1",
                ""
              ],
              "expanded": true,
              "hideToggle": true,
              "collapsedHeight": "40px",
              "expandedHeight": "40px",
              "taskpanelfooterclass": "d-flex justify-content-between",
              "panelClass": "",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "visibility": false,
              "hooks": [
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAferAPQtyUUID#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoTCaddaprtqtyincriment"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAfterAPStockQty#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#getAddPartAvaliablequantitiesdata"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "stringOperation",
                  "config": {
                    "key": "ciscoAfterAPStockQtyAvail#@",
                    "updateParent": true,
                    "lstr": "#getAddPartAvaliablequantitiesdata",
                    "rstr": "Available",
                    "operation": "concat",
                    "concatSymbol": " "
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoAfterAPStockQty#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoAfterAPStockQtyAvail#@"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "ciscoTCrenewInstrUUID#@",
                    "updateParent": true,
                    "properties": {
                      "text": "#ciscoTCrenewInstrValue"
                    }
                  },
                  "hookType": "afterInit"
                }
              ],
              "validations": [],
              "actions": [],
              "items": [
                {
                  "ctype": "label",
                  "text": "SME",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.Author,
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Type of Instruction",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Wiki",
                  "inline": true,
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": "Status",
                  "labelClass": "col-6"
                },
                {
                  "ctype": "label",
                  "text": data.status,
                  "inline": true,
                  "labelClass": "col-6"
                }
              ],
              "footer": []
            }
          },
          "eventSource": "rowClick"
        }
      ];
    }
    processActions.forEach((currentAction) => {
      instance.actionService.handleAction(currentAction, instance);
    });
  }

  handleDellWikiEditButtonActions(action: any, instance: any, actionService: any) {
    this.wikiService.pendingMyWikiEditBtn.next(false);

  }
  

  renderDraftTemplate(action: any, instance: any, actionService: any) {
    let data = this.contextService.getDataByKey("dellCarWikiDraftClickedRecord");
    let titleValue = "Wiki Instructions" + ">" + data.Title;

    let processActions = [
      {
        "type": "updateComponent",
        "config": {
          "key": "wikiSubProcessTitleUUID",
          "properties": {
            "titleValue": titleValue,
            "titleClass": "section-title "
          }
        },
        "eventSource": "rowClick"
      },


      {
        "type": "updateComponent",
        "config": {
          "key": "draftTaskPanelUUID",
          "properties": {
            "hidden": false
          }
        },
        "eventSource": "rowClick"
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "dellCarWikiPendingApprovalUUID",
          "properties": {
            "hidden": true,
            "expanded":false
          }
        },
        "eventSource": "rowClick"
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "dellCarDraftWikiUUID",
          "properties": {
            "hidden": true
          }
        },
        "eventSource": "rowClick"
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "dellCarSubmittedWikiUUID",
          "properties": {
            "hidden": true
          }
        },
        "eventSource": "rowClick"
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "dellCarWikiInstructionUUID",
          "properties": {
            "hidden": true
          }
        },
        "eventSource": "rowClick"
      },
      {
        "type": "toggle",
        "eventSource": "rowClick",
        "name": "subProcessRightNavref",
        "actionType":"open"
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "openWikiUUID",
          "properties": {
            "hidden": false
          }
        },
        "eventSource": "click"
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "pageopenWikiUUID",
          "properties": {
            "hidden": true
          }
        },
        "eventSource": "click"
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "adminWikiInstructionUUID",
          "properties": {
            "isWikiDraft": true
          }
        },
        "eventSource": "click"
      },
      {
        "type": "deleteComponent",
        "eventSource": "click",
        "config": {
          "key": "draftTaskPanelUUID"
        }
      },
      {
        "type": "createComponent",
        "config": {
          "targetId": "pageUUID",
          "containerId": "prebodysectiontwo",
          "data":
          {
            "ctype": "taskPanel",
            "uuid": "draftTaskPanelUUID",
            "isblueBorder": true,
            "header": {
              "title": data.Title,
              "icon": "description",
              "iconClass": "active-header",
              "class": "mat-expansion-panel-header-title heading2"
            },
            "expanded": true,
            "hidden": false,
            "hideToggle": true,
            "collapsedHeight": "40px",
            "expandedHeight": "40px",
            "taskpanelfooterclass": "d-flex justify-content-between",
            "panelClass": "",
            "taskPanelHeaderClass": "task-panel-header-color-light-grey",

            "hooks": [],
            "validations": [],
            "actions": [],
            "items": [
              {
                "ctype": "title",
                "title": data.Author,
                "uuid": "dellCarWikiPendingApprovalTextUUID",
                "titleValueClass": "",
                "titleClass": "sidenav-title body2 draftTitleValue",
                "titleValue": "-"
              },
              {
                "ctype": "title",
                "uuid": "dellPackoutHddHeaderUUID",
                "titleClass": "sidenav-title body2 draftTitleValue",
                "title": "Type of Instruction",
                "titleValueClass": "",
                "titleValue": "Wiki"
              },
              {
                "ctype": "title",
                "uuid": "dellPackoutHddHeaderUUID",
                "titleClass": "sidenav-title body2 draftTitleValue",
                "title": "Status",
                "titleValueClass": "",
                "titleValue": "Draft"
              }
            ],
            "footer": [
              {
                "ctype": "iconbutton",
                "iconButtonClass": "footer-save body2 primary-btn saveDraftCancelCls",
                "color": "primary",
                "text": "Cancel",
                "icon": "",
                "uuid": "confirmSerialNumberCompleteUUID#@",
                "class": "primary-btn",
                "visibility": true,
                "disabled": false,
                "type": "submit",
                "inputStyles": "color: #DE5252;",
                "iconcss": "color: #DE5252;",
                "css": "",
                "hooks": [],
                "validations": [],
                "actions": [

                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "wikiSubProcessTitleUUID",
                      "properties": {
                        "titleValue": "Wiki Instructions",
                        "titleClass": "section-title"
                      }
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "handleAllAdminWikiActions",
                    "eventSource": "click",
                    "methodType": "handleRoleBaseTaspanel",
                    "featuresToBeFilterd": [1, 2, 3, 4],
                    "taskPanelsNeedToBeToggled": [
                      "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
                    ]
                  },

                  {
                    "methodType": "clearDataInRightTab",
                    "type": "handleAllAdminWikiActions",
                    "eventSource": "click",
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "adminWikiInstructionUUID",
                      "properties": {
                        "isWikiDraft": false,
                      }
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "draftTaskPanelUUID",
                      "properties": {
                        "hidden": true
                      }
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "toggle",
                    "eventSource": "click",
                    "name": "subProcessRightNavref",
                    "actionType":"close"
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "openWikiUUID",
                      "properties": {
                        "hidden": true
                      }
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "pageopenWikiUUID",
                      "properties": {
                        "hidden": false
                      }
                    },
                    "eventSource": "click"
                  }
                ]
              },
              {
                "ctype": "iconbutton",
                "iconButtonClass": "footer-save body2 primary-btn saveDraftDeleteCls",
                "color": "primary",
                "text": "Delete",
                "icon": "",
                "uuid": "confirmSerialNumberCompleteUUID#@",
                "class": "primary-btn",
                "visibility": true,
                "disabled": false,
                "type": "submit",
                "inputStyles": "color: #DE5252;",
                "iconcss": "color: #DE5252;",
                "css": "",
                "hooks": [],
                "validations": [],
                "actions": [
                  {
                    "methodType": "deleteRowFromDraftList",
                    "type": "handleAllAdminWikiActions",
                    "eventSource": "click"
                  }

                ]
              }
            ]
          }


        },
        "eventSource": "rowClick"
      }
    ];
    processActions.forEach((currentAction) => {
      instance.actionService.handleAction(currentAction, instance);
    });
  }

  clearDataInRightTab(actions, instance, actionService) {
    this.wikiService.pendingWiki.push([]);
  }

  deleteRowFromDraftList(instance: any) {
    let index = this.contextService.getDataByKey("clickedRowIndex");
    let DraftData = this.contextService.getDataByKey("getMyDraftJsonReponse");
    let processID = DraftData[index].jsonResponseId;
    this.wikiService.deleteMyDraftJsonReponse(processID).subscribe((saveDraftdata: any) => {
      this.handleDraftActions(instance)
      this._snackBar.open('Wiki Deleted Successfully', 'OK', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 1000,
        panelClass: ['custom-success']
      });
    })
  }

  handleDraftActions(instance: any) {
    this.wikiService.getMyDraftJsonReponseData().subscribe((Draftdata: any) => {
      this.contextService.addToContext("getMyDraftJsonReponse", Draftdata.data)
      let processActions = [
        {
          "type": "handleAllAdminWikiActions",
          "hookType": "afterInit",
          "methodType": "handleRoleBaseTaspanel",
          "featuresToBeFilterd": [1, 2, 3, 4],
          "taskPanelsNeedToBeToggled": [
            "dellCarWikiPendingApprovalUUID", "dellCarSubmittedWikiUUID", "dellCarDraftWikiUUID", "dellCarWikiInstructionUUID"
          ]
        },
        {
          "type": "toggle",
          "eventSource": "rowClick",
          "name": "subProcessRightNavref",
          "actionType":"close"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "openWikiUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "pageopenWikiUUID",
            "properties": {
              "hidden": false
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "wikiSubProcessTitleUUID",
            "properties": {
              "titleValue": "Wiki Instructions",
              "titleClass": "section-title"
            }
          },
          "eventSource": "rowClick"
        },
        {
          "methodType": "clearDataInRightTab",
          "type": "handleAllAdminWikiActions"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "draftTaskPanelUUID",
            "properties": {
              "hidden": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "handleDataFormationForDraft",
          "data": Draftdata.data,
          "uuid": "dellCarDraftWikiTableUUID"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "adminWikiInstructionUUID",
            "properties": {
              "isWikiDraft": false
            }
          },
          "eventSource": "click"
        }
      ];
      processActions.forEach((currentAction) => {
        instance.actionService.handleAction(currentAction, instance);
      });
    })
  }

  executeActions(actions, instance, actionService) {
    actions.forEach((currentAction) => {
      actionService.handleAction(currentAction, instance);
    });
  }

  


  handleRoleBaseTaspanel(actions, instance, actionService) {
    let Actions = [];
    let count = 0;
    actions.featuresToBeFilterd.map((eachFeature, index) => {
      Actions.push({
        "type": "updateComponent",
        "config": {
          "key": actions.taskPanelsNeedToBeToggled[index],
          "properties": {
            "hidden": !this.utilityService.decidingMethodTodisplay(eachFeature)
          }
        },
        "eventSource": "click"
      })
      if (this.utilityService.decidingMethodTodisplay(eachFeature) && count == 0) {
        count++;
        let ref = this.contextService.getDataByKey(actions.taskPanelsNeedToBeToggled[index] + "ref");
        ref.instance.expanded = true;
        ref.instance._changeDetectionRef.detectChanges()
      }
    })
    Actions.forEach((currentAction) => {
      instance.actionService.handleAction(currentAction, instance);
    });
  }

  handleToggleTaspanel(actions, instance, actionService) {

    let Actions = [];
    actions.featuresToBeFilterd.map((eachFeature, index) => {
      Actions = [{
        "type": "updateComponent",
        "config": {
          "key": actions.taskPanelsNeedToBeToggled[index],
          "properties": {
            "hidden": false
          }
        },
        "eventSource": "click"
      }
      ]
    })
    Actions.forEach((currentAction) => {
      instance.actionService.handleAction(currentAction, instance);
    });
  }

  /**
   * Header Object
   * task panel UUID
   * data array
  */
  updateTaskQty(action: any, instance: any, actionService) {
    let header: any, taskUUID: any, dataArray: any, qty;

    header = action.header ? action.header : {};
    taskUUID = action.taskPanelUUID ? action.taskPanelUUID : {};

    if (action.dataArray && action.dataArray.startsWith("#")) {
      dataArray = this.contextService.getDataByString(action.dataArray);
      qty = "Qty " + dataArray.length;
      header.status = qty;
    } else if (action.dataArray) {
      dataArray = action.dataArray;
      qty = "Qty " + dataArray.length;
      header.status = qty;
    }
    console.log(qty);

    action = [{
      "type": "updateComponent",
      "config": {
        "key": taskUUID,
        "properties": {
          "header": header
        }
      }
    }]

    action.forEach((currentAction) => {
      instance.actionService.handleAction(currentAction, instance);
    });
  }

  /**
   * Header Object
   * task panel UUID
   * data array
  */
   updateTaskLableQty(action: any, instance: any, actionService) {
    let header: any, taskUUID: any, dataArray: any, concatText;
    if (action.dataArray && action.dataArray.startsWith("#")) {
      dataArray = this.contextService.getDataByString(action.dataArray);
      concatText= "Based on the context and content of this repair tip we have found (" + dataArray.length+ ") similar repair tips. Please confirm that this tip is unique to those flagged";
    } 
    action = [{
      "type": "updateComponent",
      "config": {
        "key": action.uuid,
        "properties": {
          "title":concatText
        }
      }
    }]

    action.forEach((currentAction) => {
      instance.actionService.handleAction(currentAction, instance);
    });
  }

  updatePendingList(action: any, instance: any, actionService: any){
    this.wikiService.getUpdatedPendingList().subscribe((data:any)=>{
      console.log("dataaaaa",data.data);
      
      let processList = [
        {
          "type": "context",
          "config": {
            "requestMethod": "add",
            "key": "dellCarWikiSearchAndSortData",
            "data": data.data
          }
        },
        {
          "type": "handleAllAdminWikiActions",
          "methodType": "Update_QTY",
          "hookType": "afterInit",
          "taskPanelUUID": "dellCarWikiPendingApprovalUUID",
          "dataArray": "#dellCarWikiSearchAndSortData",
          "header": {
            "title": "Instructions Pending Approval",
            "icon": "description",
            "iconClass": "active-header",
            "status": "",
            "statusIcon": "hourglass_empty",
            "statusClass": "incomplete-status"
          }
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCarWikiTableUUID",
            "fieldProperties": {
              "dataSource": "#dellCarWikiSearchAndSortData"
            }
          }
        }
      ]

      processList.forEach((currentAction) => {
        instance.actionService.handleAction(currentAction, instance);
      });
    })
    
  }
}