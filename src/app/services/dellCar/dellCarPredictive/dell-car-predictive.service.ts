import { Injectable } from '@angular/core';
import { UtilityService } from '../../../utilities/utility.service';
import { ContextService } from '../../commonServices/contextService/context.service';
// import { predictionData, PredictionResponseDate } from '../../../utilities/constants';
import { TransactionService } from '../../commonServices/transaction/transaction.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DellCarDebugService } from '../dellCarDebug/dell-car-debug.service';
import { Observable } from 'rxjs/internal/Observable';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { serviceUrls } from '../../../../environments/serviceUrls';

@Injectable({
    providedIn: 'root'
})


export class DellCarPredictiveService {

    constructor(
        private contextService: ContextService,
        private utilityService: UtilityService,
        private transactionService: TransactionService,
        private dellDebugService: DellCarDebugService,
        private http: HttpClient
    ) { }
    itemCount = 0;
    counter = 0;
    manulPrediction = [];
    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    handleCarDellDebugPredictionActions(action: any, instance: any, actionService: any) {
        switch (action.methodType) {
            case 'handlePredictionProcessActions':
                this.handlePredictionProcessActions(action, instance, actionService)
                break;
            case 'handleDebugAcceptActions':
                this.handleDebugAcceptActions(action, instance, actionService)
                break;
            case 'handleFilterService':
                this.handleFilterService(action, instance, actionService)
                break;
            case 'handlePopupCompleteButActions':
                this.handlePopupCompleteButActions(action, instance, actionService)
                break;
            case 'handleFilteringOfSelectedData':
                this.handleFilteringOfSelectedData(action, instance, actionService)
                break;
            case 'createPredictiveLooperTasks':
                this.createPredictiveLooperTasks(action, instance, actionService)
                break;
            case 'handleLooperControlPrediction':
                this.handleLooperControlPrediction(action, instance, actionService)
                break;
            case 'addPredictiveItem':
                this.addPredictiveItem(action, instance, actionService)
                break;
          
            case 'transactionsOnClickOfComplete':
                this.transactionsOnClickOfComplete(action, instance, actionService)
                break;
            case 'getAllActionCodes':
                this.getAllActionCodes(action, instance, actionService)
                break;

            default:
                //statements; 
                break;
        }
    }

    async handleLooperControlPrediction(action, instance, actionService) {
        let PredictionTaskData ;
        // this.contextService.addToContext("predictionData", predictionData);
        let looperData = this.contextService.getDataByString("#getDellDebugHPFAHistory");
        let getDefectGroupList = this.contextService.getDataByKey("getDefectGroupList");
        let predictionData = this.contextService.getDataByString("#predictionData");
        let uniqueDefectArray = [];
        let defectCodesObj = {};
        let defectAndDes = [];
        this.dellDebugService.resetData(action, instance, actionService);
        action.data = this.contextService.getDataByString(action.data);
        if(action.data === undefined || action.data === null || action.data === ""){
            action.data = [];
        }
        if(!!predictionData && looperData){
            action.data = predictionData;
        }
        if (!!getDefectGroupList) {
            looperData && looperData.map((item) => {
                if (!uniqueDefectArray.includes(item.defectCode)) {
                    uniqueDefectArray.push(item.defectCode);
                    let filteredDefects = looperData.filter((x) => x.defectCode === item.defectCode);
                    defectCodesObj[item.defectCode] = filteredDefects;
                }
            })
            let allActionCodeObjects = this.contextService.getDataByKey('allActionCodeObjects');
            let keys = Object.keys(defectCodesObj);
            for (let i = 0; i < keys.length; i++) {
                let currentKey = keys[i];
                let itemsForCurrentDefect = defectCodesObj[currentKey];
                let childList = [];
                for (let j = 0; j < itemsForCurrentDefect.length; j++) {
                    let currentObj = itemsForCurrentDefect[j];
                    let filteredActionCodeObj = allActionCodeObjects.filter((x) => x.actonCodesAbbreviation === currentObj.actionCode);
                    let sturcturedChildObj = await this.returnStructuredChildObj(currentObj, filteredActionCodeObj);
                    childList.push(sturcturedChildObj);
                }
                let currentPredictiveTask = this.getCurrentPrediction(itemsForCurrentDefect[0], childList, getDefectGroupList);
                let isExistingPredictive = false;
                action.data && action.data.map((currentPrediction) => {
                    if (currentPrediction.predidcted_class.toLowerCase() === currentPredictiveTask.predidcted_class.toLowerCase() && currentPrediction.defectCode === currentPredictiveTask.defectCode) {
                        currentPrediction["childList"]=childList;
                        isExistingPredictive = true;
                    }
                })
                if (!isExistingPredictive) {
                    action.data.push(currentPredictiveTask);
                }
            }
        }
        this.contextService.addToContext("predictionData", action.data);
        let Action = {
            "type": "handleCarDellDebugPredictionActions",
            "methodType": "handlePredictionProcessActions",
            "data": action.data,
            "key": "looperPredctionUUID",
        }
        actionService.handleAction(Action, instance);
    }

    /// Filter outs the defect group and defects under group and form
    /// prediction obj
    getCurrentPrediction(taskPanelData, childList, getDefectGroupList) {
        let currentDefectGroup = {};
        !!getDefectGroupList && getDefectGroupList.map((item) => {
            !!item.possible_defect_child && item.possible_defect_child.map((defectChildOBj) => {
                if(defectChildOBj.defectCode === taskPanelData.defectCode){
                    currentDefectGroup = item;
                }
            })
        });
        let currentPrediction = {
            "predidcted_class": currentDefectGroup["predidcted_class"],
            "isNewPredctiveAdded": true,
            "isAcceptButDisable":true,
            "actionCode": taskPanelData.actionCode,
            "actionCodeName": taskPanelData.actionCodeDesc,
            "possible_defect_child": currentDefectGroup["possible_defect_child"],
            "childList": childList,
            "defectCode": taskPanelData.defectCode,
            "defectDescription": taskPanelData.defectCodeDesc,
            "isNonPredictiveTask": true,
            "isNewPredictiveTask": false
        };
        return currentPrediction;
    }

    /// Returns the structured child
    async returnStructuredChildObj(item: any, filteredActionCodeObj: any) {
        let processType = filteredActionCodeObj[0].processType;
        if (processType == "replace") {
            let body = {
                "pCompPartNo": item.partNo,
                "pLocationId": "#userSelectedLocation",
                "pClientId": "#userSelectedClient",
                "pContractId": "#userSelectedContract",
                "pWarehouseId": "#discrepancyUnitInfo.WAREHOUSE_ID",
                "pZoneId": "55345",
                "pWorkcenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                "pOrderProcessTypeCode": "#discrepancyUnitInfo.ROUTE",
                "pUserName": "#userAccountInfo.PersonalDetails.USERID"
            };
            let res = await this.getApiCallUsingPromise(body, "getDellDebugStockQty");
            if (res && res['status']) {
                item["getDellDebugStockQty"] = res['data'];
                item["partDetails"] = res['data'];
            } else {
                item["getDellDebugStockQty"] = [];
                item["partDetails"] = [{ "partDescription": item?.partDesc }];
            }

            /// Compby action api in case of looper control
            let compByActBody = {
                "actionId": item.actionId,
                "userName": "#loginUUID.username"
            };
            let compByActRes = await this.getApiCallUsingPromise(compByActBody, "getCompByAction");
            if (compByActRes && compByActRes['status']) {
                item["taskStatus"] = compByActRes['data'];
            } else {
                item["taskStatus"] = [];
            }
        }
        item["processType"] = processType;
        item["svgIcon"] = processType && processType === "reseat" ? "manual" :
            processType === "other" ? "description_icon" : processType;
        item["isPrediction"] = !!item?.predictionUsed && item?.predictionUsed === "Yes" ? true : false;
        item["childUUID"] = "dellDebugCreatedTaskPanelUUID" + Math.floor(Math.random() * (999 - 100 + 1) + 100);

        return item;
    }
   
    handlePredictionProcessActions(action: any, instance: any, actionService: any) {
        console.log("jsdcj")
        let PredictionTaskData = action.data;
        if(typeof PredictionTaskData === "string" && PredictionTaskData.startsWith("#")){
            PredictionTaskData = this.contextService.getDataByString(PredictionTaskData);
        }
        let dellDebugNewAddDefectGroupName = this.contextService.getDataByString("#dellDebugNewAddDefectGroupName");
        let dellDebugAddPredictiveUnqNumber = this.contextService.getDataByString("#dellDebugAddPredictiveUnqNumber");
        let title = dellDebugNewAddDefectGroupName + "-" + dellDebugAddPredictiveUnqNumber
        let actions = {
            "type": "createComponent", 
            "config": {
                "targetId": "pageUUID",
                "containerId": "prebodysectiontwo",
                "data": {
                    "ctype": "addDefectTaskPanel",
                    "parentUUID": "PredictionTaskPanelUUID#@",
                    "uuid": "PredictionTaskPanelUUID#@",
                    "actions": [
                        {
                            "eventSource": "prDelete",
                            "config": {
                                "parentUUID": "PredictionTaskPanelUUID#@",
                                "defectGroup": "#_predidcted_class",
                                "defect": "#_defectCode"
                            }
                        }
                    ],
                    "hooks": [],
                    "header": {
                        "title": title
                    },
                    "expanded": true,
                    "hideToggle": "true",
                    "isKeepExpanded": true,
                    "containerId": "prebodysection",
                    "isBasedOnApiData": true,
                    "visibility": true,
                    "Togglehidden": false,
                    "validations": [],
                    "predictiveClass": "change-position-toolbar",
                    "toolBarItems": [
                        {
                            "ctype": "toolbar",
                            "toolbarClass": "prediction-Toolbar",
                            "hoverClass": "background-white",
                            "items": [
                                {
                                    "ctype": "iconText",
                                    "hoverClass": "blue-icon",
                                    "svgIcon": "replace",
                                    "text": "Replace",
                                    "iconTextClass": "creatorTask-Icontext",
                                    "uuid": "dellDebugReplaceIconUUID",
                                    "textClass": "heading3-regular greyish-black",
                                    "iconPosition": "top",
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
                                            "type": "handleDellDebugActions",
                                            "methodType": "handleDellProcessActions",
                                            "eventSource": "click",
                                            "isNewPredictiveTask": true,
                                            "config": {
                                                "svgIcon": "replace",
                                                "text": "Replace Part",
                                                "processType": "replace",
                                                "isPagePosition": true,
                                                "targetId": "AddDefectTaskPanelUUID"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "ctype": "iconText",
                                    "hoverClass": "blue-icon",
                                    "svgIcon": "software",
                                    "text": "Software",
                                    "iconTextClass": "creatorTask-Icontext",
                                    "uuid": "dellDebugSoftwareIconUUID",
                                    "textClass": "heading3-regular greyish-black",
                                    "iconPosition": "top",
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
                                            "type": "handleDellDebugActions",
                                            "methodType": "handleDellProcessActions",
                                            "eventSource": "click",
                                            "isNewPredictiveTask": true,
                                            "config": {
                                                "svgIcon": "software",
                                                "text": "Software",
                                                "isPagePosition": true,
                                                "targetId": "AddDefectTaskPanelUUID",
                                                "processType": "software"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "ctype": "iconText",
                                    "hoverClass": "blue-icon",
                                    "svgIcon": "manual",
                                    "text": "Reseat",
                                    "iconTextClass": "creatorTask-Icontext",
                                    "uuid": "dellDebugReseatIconUUID",
                                    "textClass": "heading3-regular greyish-black",
                                    "iconPosition": "top",
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
                                            "type": "handleDellDebugActions",
                                            "methodType": "handleDellProcessActions",
                                            "eventSource": "click",
                                            "isNewPredictiveTask": true,
                                            "config": {
                                                "svgIcon": "manual",
                                                "isPagePosition": true,
                                                "targetId": "AddDefectTaskPanelUUID",
                                                "text": "Reseat",
                                                "processType": "reseat"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "ctype": "iconText",
                                    "hoverClass": "blue-icon",
                                    "svgIcon": "description",
                                    "text": "Other",
                                    "iconTextClass": "creatorTask-Icontext",
                                    "uuid": "dellDebugOtherIconUUID",
                                    "textClass": "heading3-regular greyish-black",
                                    "iconPosition": "top",
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
                                            "type": "handleDellDebugActions",
                                            "methodType": "handleDellProcessActions",
                                            "isNewPredictiveTask": true,
                                            "eventSource": "click",
                                            "config": {
                                                "svgIcon": "description",
                                                "isPagePosition": true,
                                                "targetId": "AddDefectTaskPanelUUID",
                                                "text": "Other",
                                                "processType": "other"
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "items": [
                        {
                            "ctype": "nativeDropdown",
                            "uuid": "dellwurdebugdefectGroupUUID#@",
                            "name": "defectGroupName#@",
                            "label": "Defect Group",
                            "formGroupClass": "flex-container flex-container-half-width form-group",
                            "dropdownClass": "dropdown-container condition-dropdwn body2",
                            "labelClass": "body2 dell-greyish-black",
                            "required": true,
                            "code": "predidcted_class",
                            "displayValue": "predidcted_class",
                            "dataSource": "#getDefectGroupList",
                            "disabled": false,
                            "actions": [
                                {
                                    "type": "context",
                                    "config": {
                                        "requestMethod": "add",
                                        "key": "selectedDefectGroup#@",
                                        "data": "elementControlValue"
                                    },
                                    "eventSource": "change"
                                },
                                {
                                    "type": "extractValueBasedOnKey",
                                    "eventSource": "change",
                                    "config": {
                                        "data": "getDefectGroupList",
                                        "reqKey": "predidcted_class",
                                        "reqValue": "#selectedDefectGroup#@",
                                        "key": "filteredDefectsBasedOnDefectGroup#@"
                                    }
                                },
                                {
                                    "type": "updateComponent",
                                    "eventSource": "change",
                                    "config": {
                                        "key": "dellwurdebugdefectUUID#@",
                                        "dropDownProperties": {
                                            "options": "#filteredDefectsBasedOnDefectGroup#@.possible_defect_child"
                                        }
                                    }
                                },
                                {
                                    "type": "resetControl",
                                    "config": {
                                        "key": "defectName#@"
                                    },
                                    "eventSource": "change"
                                },
                                {

                                    "type": "updateComponent",
                                    "config": {
                                        "key": "dellwurdebugAcceptButtonUUID#@",
                                        "properties": {
                                            "disabled": true
                                        }
                                    },
                                    "eventSource": "change"
                                }
                            ]
                        },
                        {
                            "ctype": "nativeDropdown",
                            "uuid": "dellwurdebugdefectUUID#@",
                            "name": "defectName#@",
                            "label": "Defect",
                            "formGroupClass": "flex-container flex-container-half-width form-group",
                            "dropdownClass": "dropdown-container condition-dropdwn body2",
                            "labelClass": "body2 dell-greyish-black",
                            "required": true,
                            "code": "defectCode",
                            "displayValue": "description",
                            "isDisableNotReq": true,
                            "disabled": action.isDefectCodeDisable ? action.isDefectCodeDisable : false,
                            "actions": [
                                {
                                    "type": "context",
                                    "config": {
                                        "requestMethod": "add",
                                        "key": "dellDebugLooperPredictiveUnqNumber#@",
                                        "data": "elementControlValue"
                                    },
                                    "eventSource": "change"
                                },

                                {
                                    "type": "context",
                                    "config": {
                                        "requestMethod": "add",
                                        "key": "dellDebugPredictionDefectName#@",
                                        "data": "elementControlName"
                                    },
                                    "eventSource": "change"
                                },
                                {
                                    "type": "context",
                                    "eventSource": "change",
                                    "config": {
                                        "requestMethod": "add",
                                        "key": "#dellDebugLooperPredictiveUnqNumber#@",
                                        "data": "PredictionTaskPanelUUID#@"
                                    }
                                },
                                {

                                    "type": "updateComponent",
                                    "config": {
                                        "key": "dellwurdebugAcceptButtonUUID#@",
                                        "properties": {
                                            "disabled": false
                                        }
                                    },
                                    "eventSource": "change"
                                },
                                {
                                    "type": "microservice",
                                    "eventSource": "change",
                                    "config": {
                                        "microserviceId": "commonClassPredictionData",
                                        "requestMethod": "post",
                                        "isLocal": false,
                                        "LocalService": "assets/Responses/getHPFAHistory.json",
                                        "body":{
                                            "item_num": "#getPartModelAndWarrentyDetails.MODEL_NUMBER",
                                            "defect_parent": "#_predidcted_class",
                                            "defect_child": "#dellDebugLooperPredictiveUnqNumber#@"
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
                                                        "key": "commonClassPredictionData",
                                                        "data": "responseData"
                                                    },
                                                    "eventSource": "change"
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
                    ],
                    "footer": [
                        {
                            "ctype": "button",
                            "color": "primary",
                            "text": "Save",
                            "name": "dellwurdebugSaveName#@",
                            "class": "primary-btn",
                            "uuid": "dellwurdebugSaveButtonUUID#@",
                            "visibility": true,
                            "isDisableNotReq": true,
                            "checkGroupValidity": false,
                            "disabled": false,
                            "type": "submit",
                            "tooltip": "",
                            "hooks": [],
                            "validations": [],
                            "actions": [
                                {
                                    "type": "context",
                                    "config": {
                                        "key": "LooperPredictiveTaskData#@",
                                        "data": "rawFormData",
                                        "requestMethod": "add"
                                    },
                                    "eventSource": "click"
                                },
                                {
                                    "type": "updateComponent",
                                    "config": {
                                        "key": "dellwurdebugRejectButtonUUID#@",
                                        "properties": {
                                            "disabled": false
                                        }
                                    },
                                    "eventSource": "click"
                                },
                                {
                                    "type": "context",
                                    "config": {
                                        "key": "isNewPredictiveTask",
                                        "data": false,
                                        "requestMethod": "add"
                                    },
                                    "eventSource": "click"
                                },
                                {
                                    "type": "context",
                                    "config": {
                                        "key": "createNewPredictiveTask",
                                        "data": false,
                                        "requestMethod": "add"
                                    },
                                    "eventSource": "click"
                                }
                            ]
                        }
                    ],
                    "data": PredictionTaskData
                },
            }
        };
        actionService.handleAction(actions, instance);
        PredictionTaskData && PredictionTaskData.length && PredictionTaskData.forEach((rec, i) => {
            let config: any = actions;
            config = JSON.stringify(config);
            for (let k = 0; k <= PredictionTaskData.length; k++) {
                let regex = `#@${k}`;
                config = config.replace(new RegExp(regex, "g"), (i + k));
            }
            config = config.replace(/#@/g, action.key + "" + i);
            rec && Object.keys(rec).forEach((key) => {
                const regex: any = `#_${key}`;
                if (Array.isArray(rec[key])) {
                    config = config.replace(new RegExp(regex, "g"), (`#%${JSON.stringify(rec[key])}#%` || ""));
                    config = config.replace(new RegExp('"#%', "g"), (""));
                    config = config.replace(new RegExp('#%"', "g"), (""));
                } else {
                    config = config.replace(new RegExp(regex, "g"), (rec[key] || ""));
                }
            });
            config = JSON.parse(config);
            actionService.handleAction(config, instance);
        })
    }

    handlePopupCompleteButActions(action: any, instance: any, actionService: any) {
        let PredictionTaskData = this.contextService.getDataByKey("AcceptedPredictionTaskPanels");
        let newPredictionData = this.contextService.getDataByKey("newPredictionData");
        let data = [];
        if (action.isNewPredictiveTask) {
            // this.manulPrediction.push(newPredictionData)
            this.contextService.addToContext("isNewPredictive", true);
            // this.contextService.addToContext("newPredictionData", this.manulPrediction);
            actionService.handleAction({
                "type": "handleCarDellDebugPredictionActions",
                "methodType": "handlePredictionProcessActions",
                "svgIcon": "delete",
                "isNewPredictive": true,
                "isDefectCodeDisable": true,
                "isAcceptButDisable": true,
                "isNonPredictiveTask": false,
                "data": "#newPredictionData",
                "taskStatus": [],
                "key": newPredictionData[0].defectCode
            }, instance)
        } else {
            actionService.handleAction({
                "type": "handleDellDebugActions",
                "methodType": "getAllActionCodes",
                "isNonPredictiveTask": false,
            }, instance)

        }
    }

    handleFilterService(action: any, instance: any, actionService: any) {
        if (action && action.config && action.config.filterValue) {
            let defectCodes = this.contextService.getDataByKey(action.config.data)
            let DefectObj = defectCodes.find(e => e.actonCodesAbbreviation == action.config.filterValue);
            this.contextService.addToContext(action.config.key + "" + action.config.index, DefectObj.id);
            actionService.handleAction({
                "type": "setDefaultValue",
                "config": {
                    "key": action.config.uuid,
                    "defaultValue": DefectObj.id
                }
            }, instance)
        }
    }

    handleDebugAcceptActions(action: any, instance: any, actionService: any) {
        console.log("sdjicjd")
        let PredictionTableData=this.contextService.getDataByKey("commonClassPredictionData")
        actionService.handleAction({
            "type": "handleCarDellDebugPredictionActions",
            "methodType": "handlePredictionProcessActions",
            "svgIcon": "delete",
            "isNewPredictive": true,
            "isDefectCodeDisable": true,
            "isAcceptButDisable": true,
            "isNonPredictiveTask": false,
            "data": "#newPredictionData",
            "taskStatus": [],
            "key": "new"
        }, instance)
    }

    handleFilteringOfSelectedData(action: any, instance: any, actionService: any) {
        console.log(action, instance, actionService);
        // let tableCompleteData = this.contextService.getDataByKey("tableCompleteData");
        // let SortedData = []
        // this.contextService.deleteDataByKey("AcceptedPredictionTaskPanels" + action.index);
        // tableCompleteData.map((eachTableData, index) => {
        //     let getData = this.contextService.getDataByKey("AcceptedPredictionTaskPanels" + index)
        //     getData && getData.length && getData.map((eachData) => {
        //         eachData["isPrediction"]=true;
        //         eachData["actionCodeName"]= "RPL",
        //         eachData["actionCode"]= "85641- RPL",
        //         eachData["processType"]= "replace",
        //         eachData["repairActionName"]= "Reinstall OS",
        //         eachData["svgIcon"]= "replace",
        //         SortedData.push(eachData)
        //     })
        // });
        // this.contextService.addToContext("AcceptedPredictionTaskPanels" + action.index, SortedData);

        this.transactionsOnClickOfComplete(action, instance, actionService)
    }

   async transactionsOnClickOfComplete(action: any, instance: any, actionService: any) {
       let Defect = "", DefectGroup, tableCompleteData, primaryFaultStatus, taskPanelData;
       let Defects = this.contextService.getDataByKey("getDellDebugPredictiveDefects");
       if (action?.config?.action?.config?.isPredictionLoop) {
           let actions = action.config.action.config;
           let arr = {};
           DefectGroup = actions.DefectGroup,
               Defects = {
                   "defectCode": actions.taskPanelData.defect,
                   "description": actions.taskPanelData.defectName
               }
           arr["isPrediction"] = false;
           
           arr["actionCodeName"] = actions.taskPanelData.actionCodeName,
               arr["actionCode"] = actions.taskPanelData.actionCode,
               arr["PART_NUMBER"] = actions.taskPanelData?.part,
               arr["PART_DESCRIPTION"] = actions?.taskPanelData?.partDetails[0]?.partDescription,
               arr["processType"] = actions.processType,
               arr["svgIcon"] = actions.svgIcon,
               arr["repairActionName"] = actions.taskPanelData.repairAction
               arr["targetId"] = actions.targetId
               arr["index"] = actions.index
           tableCompleteData = [arr]
       } else {
           Defect = instance?.group?.controls["DefectCodeName"]?.value;
           DefectGroup = instance?.group?.controls["DefectGroupName"]?.value;
           Defects = Defects.find(eachItem => eachItem.defectCode == Defect)
           tableCompleteData = this.contextService.getDataByKey("AcceptedPredictionTaskPanels" + action.index);
       }
        this.contextService.addToContext("isNewPredictiveTask", action.isNewPredictiveTask);
        this.contextService.addToContext("childListForPredictivePanel", []);
        this.counter = 0;
        for( let i = 0; i < tableCompleteData.length; i++){
            let actionCodeObj={
                "defectCode": {
                    "value": Defects.defectCode
                },
                "actionCode": tableCompleteData[i].actionCodeName,
                "operation": "Add",
                "flexFieldList": {
                    "flexField": [
                        {
                            "name": "Repair_Action",
                            "value":tableCompleteData[i].repairActionName
                        }
                    ]
                }
            };
            let defectCodeObj= {
                "defectCode": Defects.defectCode,
                "operation": "Add",
                "flexFieldCodeList": {
                    "flexFieldCode": [
                        {
                            "name": "Main Issue2",
                            "codePath": "/-1/-1/",
                            "value": "No"
                        },
                        {
                            "name": "Prediction Used?",
                            "codePath": "/-1/-1/",
                            "value":tableCompleteData[i]?.isPrediction ? "Yes" : "No"
                          }
                    ]
                }
            };
            if(tableCompleteData[i].processType=="replace"){
                actionCodeObj["notes"]=tableCompleteData[i].PART_NUMBER;
                defectCodeObj["notes"]=tableCompleteData[i].PART_NUMBER;
            }
            let body = {
                "updateFailureAnalysisRequest": {
                    "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                    "actionCodeChangeList": {
                        "actionCodeChange": [actionCodeObj],
                    },
                    "defectCodeChangeList": {
                        "defectCodeChange": [defectCodeObj],
                    }
                },
                "userPwd": {
                    "username": "#userAccountInfo.PersonalDetails.USERID",
                    "password": "#loginUUID.password"
                },
                "operationTypes": "ProcessImmediate",
                "ip": "::1",
                "callSource": "FrontEnd",
                "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
                "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
            };
            let res = await this.postApiCallUsingPromise(body, "performFA");
            if (res["body"] && res["body"]['status']) {
                this.afterPerformFa(action, taskPanelData, Defects, DefectGroup, tableCompleteData, i, tableCompleteData[i], actionService, instance) 
            }
        }
    }

    afterPerformFa(action, taskPanelData, Defects, DefectGroup, tableCompleteData, index, data, actionService, instance) {
        let transactions = [];
        taskPanelData = {
            "actionCode":tableCompleteData[index].actionCode,
            "actionCodeName": tableCompleteData[index].actionCodeName,
            "defect": Defects.defectCode,
            "defectGroup": DefectGroup,
            "defectName": Defects.description,
            "partDetails": this.contextService.getDataByString("#getDellDebugStockQty"),
            "qty": 1,
            "part": data.PART_NUMBER
        };
        taskPanelData["index"] = index;
        taskPanelData["tableCompleteData"] = tableCompleteData;
        action.config["taskPanelData"] = taskPanelData;
        if (tableCompleteData[index].processType === "replace") {

            let commonTransaction = [
                {
                    "type": "microservice",
                    "hookType": "afterInit",
                    "config": {
                        "microserviceId": "getDellDebugStockQty",
                        "requestMethod": "get",
                        "params": {
                            "pCompPartNo": taskPanelData.part,
                            "pLocationId": "#userSelectedLocation",
                            "pClientId": "#userSelectedClient",
                            "pContractId": "#userSelectedContract",
                            "pWarehouseId": "#discrepancyUnitInfo.WAREHOUSE_ID",
                            "pZoneId": "55345",
                            "pWorkcenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                            "pOrderProcessTypeCode": "#discrepancyUnitInfo.ROUTE",
                            "pUserName": "#userAccountInfo.PersonalDetails.USERID"
                        },
                        "isLocal": false,
                        "LocalService": "assets/Responses/availableQuantity.json"
                    },
                    "responseDependents": {
                        "onSuccess": {
                            "actions": []
                        },

                        "onFailure": {
                            "actions": []
                        }
                    }
                },
                {
                    "type": "microservice",
                    "config": {
                        "microserviceId": "getDellDebugHPFAHistory",
                        "requestMethod": "get",
                        "params": {
                            "itemId": "#discrepancyUnitInfo.ITEM_ID",
                            "workCenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                            "userName": "#userAccountInfo.PersonalDetails.USERID"
                        },
                        "toBeStringified": true,
                        "isLocal": false,
                        "LocalService": "assets/Responses/mockHoldSubCode.json"
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
            ]
            this.combinelatestApirequest(commonTransaction, this.afterCombineLatest, action, actionService, instance);
        } else {
            transactions = [
                {
                    "type": "microservice",
                    "config": {
                        "microserviceId": "getDellDebugHPFAHistory",
                        "requestMethod": "get",
                        "params": {
                            "itemId": "#discrepancyUnitInfo.ITEM_ID",
                            "workCenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                            "userName": "#userAccountInfo.PersonalDetails.USERID"
                        },
                        "toBeStringified": true,
                        "isLocal": false,
                        "LocalService": "assets/Responses/mockHoldSubCode.json"
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
                },
                {
                    "type": "handleDellDebugActions",
                    "methodType": "checkForNewlyAddedItem",
                    "config": {
                        "data": "getDellDebugHPFAHistory",
                        "action": action,
                        "isLooperControlTask": false
                    }
                }
            ]
            this.combinelatestApirequest(transactions, this.afterCombineLatest, action, actionService, instance);
        }
    }

    afterCombineLatest(action, actionService, instance, isExistingPredictive) {
        console.log(action, actionService, instance)
        let Actions = {
            "type": "condition",
            "hookType": "afterInit",
            "config": {
                "operation": "isEqualTo",
                "lhs": isExistingPredictive,
                "rhs": true
            },
            "responseDependents": {
                "onSuccess": {
                    "actions": [
                        {
                            "type": "handleCarDellDebugPredictionActions",
                            "methodType": "handlePopupCompleteButActions",
                            "isNewPredictiveTask": false,
                            "isNonPredictiveTask": true
                        }
                    ]
                },
                "onFailure": {
                    "actions": [
                        {
                            "type": "handleCarDellDebugPredictionActions",
                            "methodType": "handlePopupCompleteButActions",
                            "isNewPredictiveTask": true,
                            "isNonPredictiveTask": false
                        }
                    ]
                }
            }
        }
        actionService.handleAction(Actions, instance)

    }

    combinelatestApirequest(apiList, callback?, data?, actionService?, instance?) {
        let microServiceList: Array<Observable<any>> = [];
        let apiIds = [], componentActionList = [];

        apiList.map(
            (n: any) => {
                const paramsObj = Object.assign({}, n.config.params);
                let bodyObj = this.contextService.getParsedObject(paramsObj, this.utilityService);
                apiIds.push(n.config.microserviceId)
                if (n.config.requestMethod == "get") {
                    microServiceList.push(
                        this.transactionService.get(n.config.microserviceId, bodyObj, n.config.isLocal)
                    );
                } else if (n.config.requestMethod == "post") {
                    microServiceList.push(
                        this.transactionService.post(n.config.microserviceId, bodyObj)
                    );
                } else {
                    componentActionList.push(n)
                }
            });

        let count = 0;
        combineLatest(microServiceList).subscribe((response) => {
            response.map((result: any, index) => {
                if (result.status) {

                    this.contextService.addToContext(apiIds[count] + this.counter, result.data);
                    if (apiIds[count] == "getDellDebugStockQty") {
                        data.config["taskPanelData"]["partDetails"] = result.data;
                    }
                    let isNewPredictiveTask = this.contextService.getDataByKey("isNewPredictiveTask");
                    if (count === microServiceList.length - 1) {
                        this.itemCount = this.itemCount + 1;
                        data.itemCount = this.itemCount;
                        if (apiIds[count] == "getDellDebugHPFAHistory") {
                            data.config["taskPanelData"]["tableCompleteData"][this.counter]["actionId"] = this.returnNewActionId(result);
                        }
                        if (data.config["taskPanelData"]["tableCompleteData"].length - 1 === this.counter) {
                            actionService.handleAction({
                                "type": "handleCarDellDebugPredictionActions",
                                "methodType": "addPredictiveItem",
                                "taskPanelData": data.config["taskPanelData"],
                                "data": data,
                                "childList": "#childListForPredictivePanel",
                                "isNewPredictiveTask": isNewPredictiveTask,
                                "isNonPredictiveTask": true
                            }, instance);
                            this.counter = 0;
                        }
                        this.counter = this.counter + 1;
                    }
                    count = count + 1;
                } else {
                    let errorMsg = {
                        "type": "updateComponent",
                        "hookType": "afterInit",
                        "config": {
                            "key": "errorTitleUUID",
                            "properties": {
                                "titleValue": result.message,
                                "isShown": true
                            }
                        }
                    };
                    count = count + 1;
                }
            })
        });
    }

    returnNewActionId(result): any {
        if (result && result["status"]) {
            let getDellDebugHPFAHistory = result["data"];
            this.contextService.addToContext("getDellDebugHPFAHistory", getDellDebugHPFAHistory);
            let newlyCreatedItemActionId = "";
            let newHPFAHistory = this.contextService.getDataByKey("newHPFAHistory");
            let actionIdList = this.contextService.getDataByKey("actionIdList");
            if (newHPFAHistory === undefined) {
                newHPFAHistory = [];
            }
            if (actionIdList === undefined) {
                actionIdList = [];
            }
            let isNewItem = false;
            let newItem;
            if (getDellDebugHPFAHistory && getDellDebugHPFAHistory.length > 0) {
                getDellDebugHPFAHistory.forEach((item) => {
                    if (!actionIdList.includes(item.actionId)) {
                        isNewItem = true;
                        newItem = item;
                    }
                });
            }
            if (isNewItem) {
                newHPFAHistory.push(newItem);
                this.dellDebugService.addItemToActionIdList(newItem);
                newlyCreatedItemActionId = newItem.actionId;
            }
            this.contextService.addToContext("newHPFAHistory", newHPFAHistory);
           return newlyCreatedItemActionId;
        }
    }

    createPredictiveLooperTasks(action, instance, actionService) {
        let childList = action.config.childList;
        let predictiveData = this.contextService.getDataByKey("predictionData");
        let isLastPrediction = false;
        isLastPrediction = action.config.index.includes(action.config.PredictionTaskData.length - 1);
        if (!!childList && childList.length > 0) {
            let items = childList;
            items && items.map((item, index) => {
                let taskPanelData = {
                    "actionCode": item.actionCode,
                    "actionCodeName": item.actionCodeName,
                    "defect": item.defectCode,
                    "childUUID": item.childUUID,
                    "defectName": item.defectCodeDesc,
                    "isPrediction":item.isPrediction ? item.isPrediction : false,
                    "qty": "1",
                    "part": item.partNo,
                    "partDetails": item.partDetails ?  item.partDetails : this.contextService.getDataByString("#getDellDebugStockQty" + index),
                    "repairAction": item.repairAction,
                    "repairActionName": item.repairAction,
                    "primaryFaultStatus": item.mainIssue2 === "Yes" ? true : false,
                    "actionId": item.actionId,
                    "mainIssue2": item.mainIssue2
                };

                actionService.handleAction(
                    {
                        "type": "handleDellDebugActions",
                        "methodType": "onClickOfCompleteButton",
                        "isNonPredictiveTask": action.config.isNonPredictiveTask,
                        "config": {
                            "svgIcon": item.svgIcon ? item.svgIcon : "replace",
                            "processType": item.processType ? item.processType : "replace",
                            "getDellDebugStockQty": item.getDellDebugStockQty,
                            "taskPanelData": taskPanelData,
                            "isLooperControlTask": true,
                            "isLastItem": index === childList.length - 1 && isLastPrediction ? true : false,
                            "parentUUID": "PredictionTaskPanelUUID#@",
                            "targetId": "PredictionTaskPanelUUID#@",
                            "taskStatus": !!item?.taskStatus ? item?.taskStatus : []
                        }
                    }, instance)
            })

        }
    }

    /// Adds the childs for each predictive task
    addPredictiveItem(action: any, instance: any, actionService: any) {
        let tableCompleteData = this.contextService.getDataByKey("AcceptedPredictionTaskPanels" + action?.data?.index) || [];
        let isNewPredictiveTask = action.isNewPredictiveTask;
        if (action?.taskPanelData?.tableCompleteData[0]?.isPrediction==false) {
            tableCompleteData=action.taskPanelData.tableCompleteData;
            let actions = [{
                "type": "deleteComponent",
                "eventSource": "click",
                "config": {
                    "key": "dellDebugTaskPanelUUID" + action.taskPanelData.tableCompleteData[0].index
                }
            }, {
                "type": "handleDellDebugActions",
                "methodType": "disableOrEnableAllIcons",
                "eventSource": "click",
                "config": {
                    "currentProcess": action.taskPanelData.tableCompleteData[0].processType,
                    "isDisable": false,
                    "targetId":action.taskPanelData.tableCompleteData[0].targetId
                }
            }]
            actions.map((currentAction) => {
                actionService.handleAction(currentAction, instance);
            })
        }
        let taskPanelData = action.taskPanelData;
        let isExistingPredictive = false;
        let isNonPredictiveTask = action.isNonPredictiveTask;
        let childList = [];
        let matchedDefect = "";
        let addToExistingObj = {}
        let predictiveData = this.contextService.getDataByKey("predictionData") || [];
        let getDefectGroupList = this.contextService.getDataByKey("getDefectGroupList");
        let filteredGroupList = [];
        if (!!getDefectGroupList && getDefectGroupList.length > 0) {
            filteredGroupList = getDefectGroupList.filter((x) => x.predidcted_class.toLowerCase() === taskPanelData.defectGroup.toLowerCase());
        }
        filteredGroupList = !!filteredGroupList ? filteredGroupList : [];
        let createNewPredictiveTask = this.contextService.getDataByKey("createNewPredictiveTask");
        tableCompleteData && tableCompleteData.map((item, index) => {
            if (action.processType == undefined) {
                action["processType"] = "replace";
            }
            let partDetails = this.contextService.getDataByString("#getDellDebugStockQty" + index);
            childList.push({
                "bcn": "",
                "defectCode": taskPanelData.defect,
                "defectCodeDesc": taskPanelData.defectName,
                "childUUID": "dellDebugCreatedTaskPanelUUID" + Math.floor(Math.random() * (999 - 100 + 1) + 100),
                "actionCode": item.actionCode,
                "actionCodeName": item.actionCodeName,
                "assemblyCode": null,
                "assemblyCodeDesc": null,
                "actionId": taskPanelData["tableCompleteData"][index].actionId,
                // "partNo": item.PART_NUMBER,
                "repairAction": item.repairActionName ,
                "repairActionName": item.repairActionName ,
                "addItemToReqList":item.processType=="replace"? true :false,
                "partNo": item.PART_NUMBER ,
                "partDesc": item.PART_DESCRIPTION,
                "isPrediction":item.isPrediction ,
                "svgIcon": item.svgIcon ,
                "processType": item.processType ,
                "partDetails":item.partDetails ,
                "mainIssue2": "No",
                "getDellDebugStockQty": "#getDellDebugStockQty" + index,
                "damageType": null
            })
            action["config"] = {
                "taskPanelData": item,
                "getDellDebugStockQty": "#getDellDebugStockQty" + index
            }
        })
        let filterData = predictiveData.find(e => e.predidcted_class.toLowerCase() == taskPanelData.defectGroup.toLowerCase() && e.defectCode == taskPanelData.defect);
        if (filterData) {
            createNewPredictiveTask = false;
        }
        let flag = false;

        predictiveData && predictiveData.map((currentPrediction) => {
            if (!flag) {
                if (currentPrediction.predidcted_class.toLowerCase() === taskPanelData.defectGroup.toLowerCase() && currentPrediction.defectCode === taskPanelData.defect) {
                    isExistingPredictive = true;
                    if (!!currentPrediction?.childList) {
                        currentPrediction.childList = currentPrediction.childList.concat(childList);
                    } else {
                        currentPrediction["childList"] = childList;
                    }
                    flag = true;
                } else if (createNewPredictiveTask) {
                    this.contextService.addToContext("isNewPredictiveTask", true);
                    isExistingPredictive = false;
                    flag = true;
                } else if (currentPrediction.defectCode == undefined && currentPrediction.predidcted_class.toLowerCase() === taskPanelData.defectGroup.toLowerCase()) {
                    isExistingPredictive = true;
                    currentPrediction["childList"] = childList;
                    currentPrediction["defectCode"] = taskPanelData.defect,
                        currentPrediction["defectDescription"] = taskPanelData.defectName,
                        currentPrediction["isNonPredictiveTask"] = isNonPredictiveTask,
                        currentPrediction["isNewPredictiveTask"] = isNewPredictiveTask
                    flag = true;

                }
            }
        })
        let currentPredictiveTask = {
            "predidcted_class": taskPanelData.defectGroup,
            "isNewPredctiveAdded": true,
            "actionCode": "RPL",
            "actionCodeName": "Defective part replaced",
            "possible_defect_child": filteredGroupList[0].possible_defect_child,
            "childList": childList,
            "defectCode": taskPanelData.defect,
            "defectDescription": taskPanelData.defectName,
            "isNonPredictiveTask": isNonPredictiveTask,
            "isNewPredictiveTask": isNewPredictiveTask
        }

        if (isExistingPredictive) {
            childList.map((item, index) => {
                let matchedParentInstance = this.contextService.getDataByKey(taskPanelData.defect)
                let matchedRefData = this.contextService.getDataByKey(matchedParentInstance + "ref");
                let currentTaskData = taskPanelData = {
                    "actionCode": item.actionCode,
                    "actionCodeName": item.actionCodeName,
                    "defect": taskPanelData.defect,
                    "defectGroup": taskPanelData.defectGroup,
                    "childUUID": item.childUUID,
                    "defectName": taskPanelData.defectName,
                    "actionId": taskPanelData["tableCompleteData"][index].actionId,
                    "repairAction": item.repairActionName ,
                    "repairActionName": item.repairActionName ,
                    "partDetails": this.contextService.getDataByString("#getDellDebugStockQty" + index),
                    "qty": 1,
                    "part":item.partNo,
                    "isPrediction":item.isPrediction,
                };
                currentTaskData["index"] = index;
                currentTaskData["tableCompleteData"] = tableCompleteData;
                actionService.handleAction(
                    {
                        "type": "handleDellDebugActions",
                        "methodType": "onClickOfCompleteButton",
                        "isNonPredictiveTask": false,
                        "config": {
                            "getDellDebugStockQty": "#getDellDebugStockQty" + index,
                            "svgIcon": item.svgIcon,
                            "processType": item.processType,
                            "taskPanelData": currentTaskData,
                            "isLooperControlTask": true,
                            "isLastItem": index === childList.length - 1 ? true : false,
                            "parentUUID": "PredictionTaskPanelUUID#@",
                            "targetId": "PredictionTaskPanelUUID#@"
                        }
                    }, matchedRefData.instance)

            })
            this.contextService.addToContext("predictionData", predictiveData);
        } else {
            if (!!predictiveData) {
                predictiveData.push(currentPredictiveTask);
            } else {
                predictiveData = [];
                predictiveData.push(currentPredictiveTask);
            }
            this.contextService.addToContext("newPredictionData", [currentPredictiveTask]);
            this.contextService.addToContext("predictionData", predictiveData);
            this.afterCombineLatest(action.data, actionService, instance, isExistingPredictive);
        }


    }

    async postApiCallUsingPromise(body, microserviceId) {
        let bodyObj = this.contextService.getParsedObject(body, this.utilityService);
        bodyObj = JSON.stringify(bodyObj);

        let promise = new Promise((resolve, reject) => {
            this.http.post(serviceUrls[microserviceId], bodyObj, { headers: this.headers, observe: 'response' })
                .toPromise()
                .then((response: HttpResponse<any>) => {
                    if (response.body && response.body['status']) {
                        resolve(response);
                    } else {
                        let compRef = this.contextService.getDataByKey('errorTitleUUID' + 'ref');
                        let properties = {};
                        properties['titleValue'] = response.body['message'];
                        properties['isShown'] = true;
                        Object.assign(compRef.instance, properties);
                        compRef.instance._changeDetectionRef.detectChanges();
                        reject(response);
                    }
                }, msg => {
                    let compRef = this.contextService.getDataByKey('errorTitleUUID' + 'ref');
                    let properties = {};
                    properties['titleValue'] = "The server encountered an error processing the request. Please try again.";
                    properties['isShown'] = true;
                    Object.assign(compRef.instance, properties);
                    compRef.instance._changeDetectionRef.detectChanges();
                    reject(msg);
                });
        });

        return promise;
    }
    
    /// This get all the action codes and stores in respective contexts
    async getAllActionCodes(action: any, instance: any, actionService: any) {
        let actionCodes = [];
        let isNonPredictiveTask = true;
        if (action.isNonPredictiveTask !== undefined && !action.isNonPredictiveTask) {
            isNonPredictiveTask = false;
        }
        let processTypes = [
            "replace",
            "software",
            "reseat",
            "other"
        ];
        for (let i = 0; i < processTypes.length; i++) {
            let item = processTypes[i];
            let camelCaseProcessType = item.substring(0, 1).toUpperCase() + item.substring(1);

            let body = {
                "locationId": "#userSelectedLocation",
                "clientId": "#userSelectedClient",
                "contractId": "#userSelectedContract",
                "orderProcessTypeCode": "#discrepancyUnitInfo.ROUTE",
                "workcenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                "actionTypes": camelCaseProcessType,
                "userName": "#userAccountInfo.PersonalDetails.USERID"
            };

            let res = await this.getApiCallUsingPromise(body, "getDellDebugActionCode");
            if (res && res['status']) {
                let actionCodes = res['data'];
                let allActionCodeObjects = this.contextService.getDataByKey('allActionCodeObjects');
                if(allActionCodeObjects === undefined || allActionCodeObjects === null){
                    allActionCodeObjects = [];
                }
                actionCodes && actionCodes.map((currentActionCode) => {
                    currentActionCode["processType"] = item;
                    allActionCodeObjects.push(currentActionCode)
                })
                this.contextService.addToContext("allActionCodeObjects", allActionCodeObjects);
                this.contextService.addToContext("getDellDebug" + item + "ActionCodes", res['data']);
            }

            if(i === processTypes.length - 1){
                actionService.handleAction(this.getPredictions(), instance);
            }
        }

    }

    /// This will return predictions
    getPredictions() {
        return {
            "type": "condition",
            "hookType": "afterInit",
            "config": {
                "operation": "isValid",
                "lhs": "#specialMessageData.moreInfo"
            },
            "eventSource": "click",
            "responseDependents": {
                "onSuccess": {
                    "actions": [
                        {
                            "type": "microservice",
                            "config": {
                                "microserviceId": "defectParentPredictionData",
                                "requestMethod": "post",
                                "isLocal": false,
                                "LocalService": "assets/Responses/getHPFAHistory.json",
                                "body": {
                                    "note": "#specialMessageData.moreInfo"
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
                                                "key": "predictionDataFromApi",
                                                "data": "responseData"
                                            }
                                        },
                                        {
                                            "type": "handleCarDellDebugPredictionActions",
                                            "methodType": "handleLooperControlPrediction",
                                            "data": "#predictionDataFromApi",
                                            "key": "looperPredctionUUID"
                                        }
                                    ]
                                },
                                "onFailure": {
                                    "actions": [
                                        {
                                            "type": "handleCarDellDebugPredictionActions",
                                            "methodType": "handleLooperControlPrediction",
                                            "data": "#predictionData",
                                            "key": "looperPredctionUUID",
                                            "hookType": "afterInit"
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
                            "type": "handleCarDellDebugPredictionActions",
                            "methodType": "handleLooperControlPrediction",
                            "data": "#predictionDataFromApi",
                            "key": "looperPredctionUUID"
                        }
                    ]
                }
            }
        };
      
    }

    /// For get requests
    async getApiCallUsingPromise(body, microserviceId) {
        let valueString = "";
        Object.keys(body).map((x, i) => {
            let currentString = "";
            if(body[x].startsWith("#")){
                body[x] = this.contextService.getDataByString(body[x]);
            }
            if (i < Object.keys(body).length) {
                currentString = x + "=" + body[x] + "&";
            } else {
                currentString = x + "=" + body[x];
            }
            valueString = valueString + currentString
        })
        let promise = new Promise((resolve, reject) => {
            let apiURL = serviceUrls[microserviceId] + "?" + valueString;
            this.http.get(apiURL)
                .toPromise()
                .then(
                    (response: HttpResponse<any>) => {
                        if (response && response['status']) {
                            resolve(response);
                        } else {
                            let compRef = this.contextService.getDataByKey('errorTitleUUID' + 'ref');
                            let properties = {};
                            properties['titleValue'] = response.body['message'];
                            properties['isShown'] = true;
                            Object.assign(compRef.instance, properties);
                            compRef.instance._changeDetectionRef.detectChanges();
                            reject(response);
                        }
                    }, msg => {
                        let compRef = this.contextService.getDataByKey('errorTitleUUID' + 'ref');
                        let properties = {};
                        properties['titleValue'] = "The server encountered an error processing the request. Please try again.";
                        properties['isShown'] = true;
                        Object.assign(compRef.instance, properties);
                        compRef.instance._changeDetectionRef.detectChanges();
                        reject(msg);
                    }
                );
        });
        return promise;
    }
}