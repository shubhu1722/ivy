import { Injectable } from '@angular/core';
import { UtilityService } from '../../../utilities/utility.service';
import { ComponentService } from '../../commonServices/componentService/component.service';
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class DellCarAssessmentService {
  ramIndex = 2;
  hddIndex = 2;
  constructor(private contextService: ContextService,
    private componentService: ComponentService,
    private utiliyService: UtilityService) { }
  handelDellCarAssessmentAction(action: any, instance: any, actionService: any) {
    switch (action.methodType) {
      case 'createRamdropdown':
        this.createRamdropdown(action, instance, actionService);
        break;
      case 'createHDDFields':
        this.createHDDFields(action, instance, actionService);
        break;
      case 'hddFieldsFormDataOperation':
        this.hddFieldsFormDataOperation(action, instance);
        break;
      case 'ramCapacityFormDataOperation':
        this.ramCapacityFormDataOperation(action, instance);
        break;
      case 'getLeftSideDetailsForDellCar':
        this.getLeftSideDetailsForDellCar(action, instance, actionService);
        break;
      case 'disableTaskPanels':
        this.disableTaskPanels();
        break;
      case 'enableTaskPanels':
        this.enableTaskPanels();
        break;
      case 'clearRamHddIndex':
        this.clearRamHddIndex();
        break;
      case 'addNotePrepopulatedData':
        this.addNotePrepopulatedData();
        break;
    }
  }

  createRamdropdown(action, instance, actionService) {
    this.ramIndex = action.config !== undefined ? action.config.index + 1 : this.ramIndex;
    if(this.ramIndex < 33){
    actionService.handleAction(
      {
        "type": "updateTaskPanelRightSide",
        "config": {
          "key": "dellCarRecordRamTaskPanelUUID",
          "properties": {
            "rightItems": [
              {
                "ctype": "dropdownWithSearch",
                "containerId": "expansionpanelcontent",
                "uuid": `dellCarRamCapacityslot${this.ramIndex}UUID`,
                "name": `dellCarRamCapacityDropdown${this.ramIndex}`,
                "label": `Slot ${this.ramIndex} RAM Capacity`,
                "hooks": [],
                "dropdownClass": "col-4 dropdown-container textfield-container",
                "labelClass": "pl-0 align-left rework-lable-width subtitle1-align-self greyish-black",
                "formGroupClass": "drop-down-select-full-width form-group-margin",
                "labelPosition": "left",
                "required": false,
                "selectDisabled": false,
                "disableSort": true,
                "focus": true,
                "submitable": true,
                "code": "ramcode",
                "displayValue": "ramValue",
                "dataSource": "#getProcessWCData.recordram",
                "isDisableNotReq": true,
                "actions": [
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "userSelectedRam" + this.ramIndex,
                      "data": "elementControlValue"
                    },
                    "eventSource": "change"
                  },
                  {
                    "type": "isCurrentComponentSelected",
                    "eventSource": "change",
                  },
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isEqualTo",
                      "lhs": "#userSelectedRam" + this.ramIndex,
                      "rhs": "-Select-"
                    },
                    "eventSource": "change",
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "resetCurrentControl",
                            "eventSource": "click"
                          }
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "condition",
                            "config": {
                              "operation": "isEqualTo",
                              "lhs": "#currentComponentSelected",
                              "rhs": true,
                            },
                            "responseDependents": {
                              "onSuccess": {
                                "actions": []
                              },
                              "onFailure": {
                                "actions": [
                                  {
                                    "type": "selectedCurrentControl",
                                    "eventSource": "click"
                                  },
                                  {
                                    "type": "handelDellCarAssessmentAction",
                                    "methodType": "createRamdropdown",
                                    "eventSource": "change"
                                  }
                                ]
                              }
                            }
                          }
                        ]
                      }
                    }
                  },
                ]
              }
            ]
          }
        },
        "eventSource": "change"
      }, instance);
    this.ramIndex++;
    }
  }

  createHDDFields(action, instance, actionService) {
    this.hddIndex = action.config !== undefined ? action.config.index + 1 : this.hddIndex;
    if(this.hddIndex < 33){
    actionService.handleAction(
      {
        "type": "updateTaskPanelRightSide",
        "config": {
          "key": "dellCarRecordHDDTaskPanelUUID",
          "properties": {
            "rightItems": [
              {
                "ctype": "dropdownWithSearch",
                "containerId": "expansionpanelcontent",
                "uuid": `dellCarHDD${this.hddIndex}CapacityUUID`,
                "name": `dellCarHDDCapacityDropdown${this.hddIndex}`,
                "label": `HDD ${this.hddIndex} Capacity`,
                "dropdownClass": "col-4 dropdown-container textfield-container",
                "labelClass": "pl-0 align-left rework-lable-width subtitle1-align-self greyish-black",
                "formGroupClass": "drop-down-select-full-width form-group-margin",
                "labelPosition": "left",
                "disableSort": true,
                "focus": true,
                "required": false,
                "code": "recordHDDcode",
                "isDisableNotReq": true,
                "displayValue": "recordHDDValue",
                "dataSource": "#getProcessWCData.recordHDD",
                "hooks": [],
                "actions": []
              },
              {
                "ctype": "textField",
                "containerId": "expansionpanelcontent",
                "uuid": `dellCarHDDSerial${this.hddIndex}UUID`,
                "hooks": [],
                "type": "text",
                "placeholder": "Scan #",
                "submitable": true,
                "visibility": true,
                "disabled": false,
                "isUpperCase": true,
                "onlyEnterKeyPress": true,
                "focusOut": true,
                "disableCompleteButtonEnterActions": true,
                "focus": false,
                "label": `HDD ${this.hddIndex} Serial Number`,
                "labelPosition": "left",
                "textfieldClass": "col-4 dropdown-container textfield-container",
                "name": `dellCarHDDSerialNumber${this.hddIndex}`,
                "required": false,
                "labelClass": "pl-0 align-left rework-lable-width subtitle1-align-self greyish-black",
                "validations": [
                  {
                      "type": "regex",
                      "script": "[0-9a-zA-Z]{0,32}"
                  }
                 ],
                "actions": [
                  {
                    "type": "isCurrentComponentSelected",
                    "eventSource": "keydown"
                  },
                  {
                    "type": "condition",
                    "eventSource": "keydown",
                    "config": {
                      "operation": "isEqualTo",
                      "lhs": "#currentComponentSelected",
                      "rhs": true
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": []
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "selectedCurrentControl",
                            "eventSource": "click"
                          },
                          {
                            "type": "handelDellCarAssessmentAction",
                            "methodType": "createHDDFields",
                            "eventSource": "change"
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
        "eventSource": "change"
      }, instance);
    this.hddIndex++;
    }
  }


  hddFieldsFormDataOperation(action, instance) {
    const hddFormData = this.contextService.getDataByKey(action.config.key);
    let hddCapacityFormData = [];
    let hddSerialNumberFormData = [];
    let submittableHddCapacityFormData = [];
    let submittableHddSerialNumberFormData = [];
    let hddFormDataKeysLength = Object.keys(hddFormData).length;
    let hddFormDataKeys = Object.keys(hddFormData);
    /// Push all even index elements to hddCapacityFormData
    for (let i = 0; i < hddFormDataKeysLength; i++) {
      let key = hddFormDataKeys[i];
      let value = hddFormData[hddFormDataKeys[i]];
      if (key && this.utiliyService.isString(key) && key.includes('dellCarHDDCapacityDropdown')) { // index is even
        if (value && value.code) {
          hddCapacityFormData.push(value.code);
          submittableHddCapacityFormData.push(value.code);
        } else if (value && this.utiliyService.isString(value)) {
          hddCapacityFormData.push(value);
          submittableHddCapacityFormData.push(value);
        } else {
          hddCapacityFormData.push("");
        }
      } else if (key && this.utiliyService.isString(key) && key.includes('dellCarHDDSerialNumber')) {
        if (value) {
          hddSerialNumberFormData.push(value);
          submittableHddSerialNumberFormData.push(value);
        } else {
          hddSerialNumberFormData.push("");
        }
      }
    }
    /// Add them to contexts
    this.contextService.addToContext('hddCapacityFormData', hddCapacityFormData.join(';'));
    this.contextService.addToContext('hddSerialNumberFormData', hddSerialNumberFormData.join(';'));
    this.contextService.addToContext('submittableHddCapacityFormData', submittableHddCapacityFormData.join(';'));
    this.contextService.addToContext('submittableHddSerialNumberFormData', submittableHddSerialNumberFormData.join(';'));
  }

  ramCapacityFormDataOperation(action, instance) {
    const dellCarRecordRamFormData = this.contextService.getDataByKey(action.config.key);
    let ramCapacityFormData = [];
    let submittableRamCapacityFormData = [];
    /// Push all even index elements to hddCapacityFormData
    for (const key in dellCarRecordRamFormData) {
      let value = dellCarRecordRamFormData[key];
      if (key && this.utiliyService.isString(key) && key.includes('dellCarRamCapacityDropdown')) {
        if (value && value.code) {
          ramCapacityFormData.push(value.code);
          submittableRamCapacityFormData.push(value.code);
        } else if (value && this.utiliyService.isString(value)) {
          ramCapacityFormData.push(value);
          submittableRamCapacityFormData.push(value);
        } else {
          ramCapacityFormData.push("");
        }
      }
    }
    /// Add them to contexts
    this.contextService.addToContext('ramCapacityFormData', ramCapacityFormData.join(';'));
    this.contextService.addToContext('submittableRamCapacityFormData', submittableRamCapacityFormData.join(';'));
  }

  getLeftSideDetailsForDellCar(action, instance, actionService) {
    let actions = [
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getROHFFValueByRODetails",
          "LocalService": "assets/Responses/performFA.json",
          "isLocal": false,
          "requestMethod": "get",
          "params": {
            "referanceOrderId": "#getCurrPrevRODetailsBySN.referenceOrderId",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "businessTransactionType": "#getCurrPrevRODetailsBySN.bussinessTrxTypeId",
            "ffName": "QR Required",
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
                  "key": "getROHFFValueByRODetailsQRRequired",
                  "data": "responseData"
                },
                "eventSource": "click"
              },
              {
                "type": "condition",
                "eventSource": "click",
                "config": {
                  "operation": "isValid",
                  "lhs": "#getROHFFValueByRODetailsQRRequired"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "dellCarQrRequiredUUID",
                          "properties": {
                            "titleValue": "#getROHFFValueByRODetailsQRRequired"
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
                "type": "handleCommonServices",
                "config": {
                  "type": "errorRenderTemplate"
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
          "microserviceId": "getROHFFValueByRODetails",
          "LocalService": "assets/Responses/performFA.json",
          "isLocal": false,
          "requestMethod": "get",
          "params": {
            "referanceOrderId": "#getCurrPrevRODetailsBySN.referenceOrderId",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "businessTransactionType": "#getCurrPrevRODetailsBySN.bussinessTrxTypeId",
            "ffName": "QR Status",
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
                  "key": "getROHFFValueByRODetailsQRStatus",
                  "data": "responseData"
                }
              },
              {
                "type": "condition",
                "eventSource": "click",
                "config": {
                  "operation": "isValid",
                  "lhs": "#getROHFFValueByRODetailsQRStatus"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "dellCarQrStatusUUID",
                          "properties": {
                            "titleValue": "#getROHFFValueByRODetailsQRStatus"
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
                "type": "handleCommonServices",
                "config": {
                  "type": "errorRenderTemplate"
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
          "microserviceId": "getROHFFValueByRODetails",
          "LocalService": "assets/Responses/performFA.json",
          "isLocal": false,
          "requestMethod": "get",
          "params": {
            "referanceOrderId": "#getCurrPrevRODetailsBySN.referenceOrderId",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "businessTransactionType": "#getCurrPrevRODetailsBySN.bussinessTrxTypeId",
            "ffName": "Password",
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
                  "key": "getROHFFValueByRODetailsPassword",
                  "data": "responseData"
                },
                "eventSource": "click"
              },
              {
                "type": "condition",
                "eventSource": "click",
                "config": {
                  "operation": "isValid",
                  "lhs": "#getROHFFValueByRODetailsPassword"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "dellCarOSPasswordUUID",
                          "properties": {
                            "titleValue": "#getROHFFValueByRODetailsPassword"
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
                "type": "handleCommonServices",
                "config": {
                  "type": "errorRenderTemplate"
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
          "microserviceId": "getROHFFValueByRODetails",
          "LocalService": "assets/Responses/performFA.json",
          "isLocal": false,
          "requestMethod": "get",
          "params": {
            "referanceOrderId": "#getCurrPrevRODetailsBySN.referenceOrderId",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "businessTransactionType": "#getCurrPrevRODetailsBySN.bussinessTrxTypeId",
            "ffName": "WI Disposition",
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
                  "key": "getROHFFValueByRODetailsWIDisposition",
                  "data": "responseData"
                }
              },
              {
                "type": "condition",
                "eventSource": "click",
                "config": {
                  "operation": "isValid",
                  "lhs": "#getROHFFValueByRODetailsWIDisposition"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "dellCarWiDispositionUUID",
                          "properties": {
                            "titleValue": "#getROHFFValueByRODetailsWIDisposition"
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
                "type": "handleCommonServices",
                "config": {
                  "type": "errorRenderTemplate"
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
          "microserviceId": "getWorkInstDellEducateURLLink",
          "requestMethod": "post",
          "body": {
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "loaderName": "DELL_CAR_DIFFICULTY",
            "modelNumber": "#discrepancyPartAndWarrantyDetails.PART_NO",
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
                  "key": "getWorkInstDellEducateURLLinkData",
                  "data": "responseData"
                },
                "eventSource": "click"
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarPlatformUUID",
                  "properties": {
                    "titleValue": "#getWorkInstDellEducateURLLinkData.notes3"
                  }
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarUnitLevelUUID",
                  "properties": {
                    "titleValue": "#getWorkInstDellEducateURLLinkData.notes"
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
                  "type": "errorRenderTemplate"
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
          "microserviceId": "getPartsFromDellBoms",
          "isLocal": false,
          "requestMethod": "get",
          "params": {
            "locationName": "#userSelectedLocationName",
            "serialNumber": "#discrepancyUnitInfo.SERIAL_NO",
            "commodityName": "",
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
                  "key": "getPartsFromDellBomsData",
                  "data": "responseArray"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarWindowsVersionUUID",
                  "properties": {
                    "titleValue": "#getPartsFromDellBomsData.systemVer"
                  }
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarlanguageUUID",
                  "properties": {
                    "titleValue": "#getPartsFromDellBomsData.keyboard"
                  }
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarRaidUUID",
                  "properties": {
                    "titleValue": "#getPartsFromDellBomsData.raid"
                  }
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarFingerprintUUID",
                  "properties": {
                    "titleValue": "#getPartsFromDellBomsData.fingerprint"
                  }
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarNfcUUID",
                  "properties": {
                    "titleValue": "#getPartsFromDellBomsData.nfc"
                  }
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarAcAdapterUUID",
                  "properties": {
                    "titleValue": "#getPartsFromDellBomsData.acAdapter"
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
    actions.forEach((ele) => {
      actionService.handleAction(ele, null);
    });
  }

  disableTaskPanels() {
    let taskPanelsUUID = ["dellCarCustomerPswUUID", "dellCarRecordRamTaskPanelUUID",
      "dellCarRecordHDDTaskPanelUUID", "dellCarKeyBoardLightTaskPanelUUID"];

    taskPanelsUUID.forEach((taskPanelUUID, index) => {
      let taskPanelRef = this.contextService.getDataByKey(taskPanelUUID + "ref");
      let taskPanelStatus = this.contextService.getDataByKey(taskPanelUUID);

      /// Check if the task panel is completed
      if (taskPanelStatus && taskPanelStatus.header && taskPanelStatus.header.statusClass == "complete-status") {
        let updateTaskPanelAction = {
          "type": "updateComponent",
          "config": {
            "key": taskPanelUUID,
            "properties": {
              "isEditable": false,
              "isMandatory": false,
              "forceDisabled": true,
              "disabled": true,
              "expanded": false,
              "header": {
                "title": taskPanelRef.instance.header.title,
                "svgIcon": "description_icon",
                "statusIcon": "check_circle",
                "statusClass": "complete-status",
                "class": "greyish-black subtitle1 font-weight-700",
                "iconClass": "complete-task"
              }
            }
          },
          "eventSource": "click"
        }
        this.componentService.handleUpdateComponent(updateTaskPanelAction, null, null, this);
      } else {
        let updateTaskPanelAction = {
          "type": "updateComponent",
          "config": {
            "key": taskPanelUUID,
            "properties": {
              "isEditable": false,
              "isMandatory": false,
              "forceDisabled": true,
              "disabled": true,
              "expanded": false,
              "header": {
                "title": taskPanelRef.instance.header.title,
                "svgIcon": "description_icon",
                "iconClass": "active-header",
                "class": "greyish-black subtitle1 font-weight-700",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              }
            }
          },
          "eventSource": "click"
        };
        this.componentService.handleUpdateComponent(updateTaskPanelAction, null, null, this);
      }
    })
  }

  enableTaskPanels() {
    let oneTaskPanelExpanded = false;
    let taskPanelsUUID = ["dellCarCustomerPswUUID", "dellCarRecordRamTaskPanelUUID",
      "dellCarRecordHDDTaskPanelUUID", "dellCarKeyBoardLightTaskPanelUUID"];

    taskPanelsUUID.forEach((taskPanelUUID, index) => {
      let taskPanelRef = this.contextService.getDataByKey(taskPanelUUID + "ref");
      let taskPanelStatus = this.contextService.getDataByKey(taskPanelUUID);

      /// Check if the task panel is completed
      if (taskPanelStatus && taskPanelStatus.header && taskPanelStatus.header.statusClass == "complete-status") {
        let updateTaskPanelAction = {
          "type": "updateComponent",
          "config": {
            "key": taskPanelUUID,
            "properties": {
              "isEditable": true,
              "isMandatory": true,
              "forceDisabled": false,
              "disabled": false,
              "expanded": false,
              "header": {
                "title": taskPanelRef.instance.header.title,
                "svgIcon": "description_icon",
                "statusIcon": "check_circle",
                "statusClass": "complete-status",
                "class": "greyish-black subtitle1 font-weight-700",
                "iconClass": "complete-task"
              }
            }
          },
          "eventSource": "click"
        }
        this.componentService.handleUpdateComponent(updateTaskPanelAction, null, null, this);
      } else if (!oneTaskPanelExpanded) {

        let updateTaskPanelAction = {
          "type": "updateComponent",
          "config": {
            "key": taskPanelUUID,
            "properties": {
              "isEditable": true,
              "isMandatory": true,
              "forceDisabled": false,
              "disabled": false,
              "expanded": true,
              "header": {
                "title": taskPanelRef.instance.header.title,
                "svgIcon": "description_icon",
                "iconClass": "active-header",
                "class": "greyish-black subtitle1 font-weight-700",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              }
            }
          },
          "eventSource": "click"
        };
        this.componentService.handleUpdateComponent(updateTaskPanelAction, null, null, this);
        oneTaskPanelExpanded = true;
      } else {
        let updateTaskPanelAction = {
          "type": "updateComponent",
          "config": {
            "key": taskPanelUUID,
            "properties": {
              "isEditable": true,
              "isMandatory": true,
              "forceDisabled": false,
              "disabled": true,
              "expanded": false,
              "header": {
                "title": taskPanelRef.instance.header.title,
                "svgIcon": "description_icon",
                "iconClass": "active-header",
                "class": "greyish-black subtitle1 font-weight-700",
                "statusIcon": "hourglass_empty",
                "statusClass": "incomplete-status"
              }
            }
          },
          "eventSource": "click"
        };
        this.componentService.handleUpdateComponent(updateTaskPanelAction, null, null, this);
      }
    });
  }

  clearRamHddIndex() {
    this.ramIndex = 2;
    this.hddIndex = 2;
  }

  addNotePrepopulatedData() {
    let getAllTextFieldData;
    let getSpareData = "";
    let problemDescription = this.contextService.getDataByString("#StoreDataProblemDescription");
    let biosVersion = this.contextService.getDataByString("#StoreDataBiosVersion");
    let epsaErrorCode = this.contextService.getDataByString("#StoreDataEpsaErrorCode");
    let ledCode = this.contextService.getDataByString("#StoreDataLedCode");
    let sparePartUsed = this.contextService.getDataByString("#StoreDataSparePartUsed");
    getAllTextFieldData = getSpareData.concat("notes:" + " "+ problemDescription+ " " + "/ bios:" + " " + biosVersion + " " + "/ epsa:" + " "+ epsaErrorCode + " " + "/ led:"+ " " + ledCode+ " " + "/ tools:"+ " " + sparePartUsed);
    this.contextService.addToContext("dellCarAssessAddHoldNoteData", getAllTextFieldData)
    // let addnoteDoneBUttton = {
    //   "type": "updateComponent",
    //   "config": {
    //     "key": "doneHoldUUID",
    //     "properties": {
    //       "disabled": false
    //     },
    //     "eventSource": "change"
    //   }
    // }
    // this.componentService.handleUpdateComponent(addnoteDoneBUttton, null, null, this.utiliyService);

    // this.group = new FormGroup({});
    // this.group.controls["holdAddNote"].setValue(this.getAllTextFieldData);
  }
}
