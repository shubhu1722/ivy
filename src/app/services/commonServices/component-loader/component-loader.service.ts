import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { combineLatest, of } from 'rxjs'
import { TransactionService } from 'src/app/services/commonServices/transaction/transaction.service';
// import { ActionService } from '../../action/action.service';
import { ComponentHelperService } from '../component-helper/component-helper.service';
import { ContextService } from '../contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class ComponentLoaderService {
  public customTempArray = [];
  public currentPanel = [];
  public errorUpdates = [];
  public componentAction = [];
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private componentHelper: ComponentHelperService,
    private transactionService: TransactionService,
    // private actionService: ActionService,
    private contextService: ContextService,
  ) { }

  createComponent(matchedComponent, containerName: ViewContainerRef, componentData, index?: number) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(matchedComponent);
    const componentRef = containerName.createComponent(componentFactory, index);
    Object.assign(componentRef.instance, componentData);
    this.contextService.addToContext(componentData.uuid + 'ref', componentRef);
  }

  parseData(jsonData: Object, specificContainerName: ViewContainerRef, index?: number) {
    if (jsonData.hasOwnProperty('ctype')) {
      let matchedComponent = this.componentHelper.determineComponent(jsonData['ctype']);
      if (jsonData["ctype"] == "page") {
        if (jsonData.hasOwnProperty('onLoadActions') && jsonData['onLoadActions'].length) {
          let microServiceList: Array<Observable<any>> = [];
          let apiIds = [], componentActionList = [];
          let displayErrorMessageList = [];
          jsonData['onLoadActions'].map(
            n => {
              const paramsObj = Object.assign({}, n.config.params);
              let bodyObj = this.getParsedObject(paramsObj);
              if(n.config.microserviceId){
                apiIds.push(n.config.microserviceId)
              }
              let displayErrorMessage = n.config.isDisplayErrorMessage !== undefined ? n.config.isDisplayErrorMessage
              : true;
              displayErrorMessageList.push(displayErrorMessage);
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
          combineLatest(microServiceList).subscribe(response => {
            response.map((result, index) => {
              if (result.status) {
                if(result.body){
                  this.contextService.addToContext(apiIds[index], result.body.data);
                }
                else{
                  this.contextService.addToContext(apiIds[index], result.data);
                }
              } else {
                if(displayErrorMessageList[index]){
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
                }
                jsonData['hooks'].push(errorMsg)
              }
            }
            })
            if (response) {
              jsonData["componentActionList"] = componentActionList
              this.createComponent(matchedComponent, specificContainerName, jsonData, index);
              this.updateMethod(jsonData);
            }
          });
          if(componentActionList.length > 0 && microServiceList.length <= 0){
            jsonData["componentActionList"] = componentActionList
              this.createComponent(matchedComponent, specificContainerName, jsonData, index);
          }
        } else {
          this.createComponent(matchedComponent, specificContainerName, jsonData, index);
        }
      } else {
        this.createComponent(matchedComponent, specificContainerName, jsonData, index);
      }
    }
    this.updateMethod(jsonData);
  }

  getParsedObject(jsonObject) {
    if (jsonObject != undefined && Object.keys(jsonObject).length > 0) {
      Object.keys(jsonObject).forEach(key => {

        // check if nested object
        if (jsonObject[key] != null && typeof jsonObject[key] === 'object') {
          this.getParsedObject(jsonObject[key]);
          return;
        }
        const keyValue = jsonObject[key];
        const keyIndex = key;
        if (this.isString(keyValue) && keyValue.startsWith('#')) {
          let reqValue = this.contextService.getDataByString(keyValue);
          if (this.isString(reqValue)) {
            reqValue = reqValue.trim();
          }
          jsonObject[key] = reqValue;
        }

        /// check if key contains #
        if (this.isString(keyIndex) && keyIndex.startsWith('#')) {
          let reqValue = this.contextService.getDataByString(keyIndex);
          if (this.isString(reqValue)) {
            reqValue = reqValue.trim();
          }
          jsonObject[reqValue] = jsonObject[key];
          delete jsonObject[keyIndex];
        }
      });
    }
    return jsonObject;
  }

  isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
  }

  updateMethod(jsonData) {
    let refData = this.contextService.getDataByKey("pageUUIDref");
    let saveddata = this.contextService.getDataByKey("getJsonReponse");
    let WC = this.contextService.getDataByKey("currentWC");
    let menuList = this.contextService.getDataByKey("menuItems");
    let ScreenMenuObj = this.contextService.getDataByKey("ScreenMenuObj");
    let discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
    Array.isArray(saveddata) && saveddata.map((currentData) => {
      // let key=currentData.name;
      let keys = Object.keys(currentData);
      keys.map((key) => {
        let isClientAndScreenValid = this.contextService.handleClientAndScreenValidation();
        if(isClientAndScreenValid){
          if (ScreenMenuObj && ScreenMenuObj.name.toLowerCase() === key.toLowerCase() && ScreenMenuObj.isVisited == false) {
            let currentWcDataList;
            if (typeof (currentData[key]) == "string") {
              currentWcDataList = JSON.parse(currentData[key]);
            } else {
              currentWcDataList = currentData[key]
            }
            if (currentWcDataList && currentWcDataList.length) {
              if (jsonData['uuid'] == "pageUUID" && currentWcDataList) {
                let hookObjs = [];
                hookObjs = this.getRefactoredHooks(refData.instance.hooks, currentWcDataList, hookObjs, "isFromPageHooks");
                refData.instance.hooks = hookObjs;
              } else {
                if (jsonData['uuid']) {
                  this.getUpdateComponentData(jsonData['uuid'], refData, ScreenMenuObj, jsonData, currentWcDataList);
                }
              }
            }
          }
        }
      })
    });
  }

  //method used to update page refs with saved data
  getUpdateComponentData(uuid, refData, ScreenMenuObj, jsonData, currentWcDataList) {
    let currentUUIDData = this.contextService.getDataByKey(uuid);
    let disableCurrentTextFieldAction;
    let pageFooterData = [], pageItemData = [], taskPanelIndex, buttonCompleteActons = [], onTaskBased = [];
    if (refData.instance && refData.instance.footer[0] && refData.instance.footer[0].items) {
      pageFooterData = refData.instance.footer[0].items;
    }
    pageItemData = refData.instance.items.filter(eachItem => eachItem.ctype == "taskPanel" && eachItem.isBasedOnResultCode == undefined);
    onTaskBased = refData.instance.items.filter(eachItem => eachItem.ctype == "taskPanel" && eachItem.isBasedOnResultCode);
    const pageFooterTaskpanels = refData.instance && refData.instance.footer[0] && refData.instance.footer[0].items.find(eachItem => eachItem.ctype == "nativeDropdown");
    let currenttaskref = this.contextService.getDataByKey("currentTaskPanelUUID");
    let currenttaskrefData = this.contextService.getDataByKey("currentTaskPanelPropertiesUUID");
    taskPanelIndex = pageItemData.findIndex(x => x.uuid === currenttaskref)
    let compref = this.contextService.getDataByKey(uuid + "ref");
    //For actionToggle component check the null value and set selectedVal value
    if(currentUUIDData&&currentUUIDData.ctype == "actionToggle") {      
      let currentcompref = this.contextService.getDataByKey(uuid);
      let currentcomprefValue= (currentcompref.value == null) ? jsonData["selectedVal"] : currentcompref.value;
      compref.instance.group.controls[jsonData['name']].patchValue(currentcomprefValue);
    }
    if(currentUUIDData&&currentUUIDData.ctype !== "textarea"){
    if (currentUUIDData && currentUUIDData.name && currentUUIDData.ctype !== "button" ) {
      if (currentUUIDData.ctype === "radioButtonGroup") {
        let currentcompref = this.contextService.getDataByKey(currentUUIDData.name);
        if(currentcompref && currentcompref != undefined){
          disableCurrentTextFieldAction = {
            type: 'updateComponent',
            config: {
              key: uuid,
              fieldProperties: {},
              properties: {}
            },
            hookType: "afterInit"
          }
          disableCurrentTextFieldAction.config.fieldProperties[currentcompref.name] = currentcompref.value;
        }
      } else {
        disableCurrentTextFieldAction = {
          type: 'updateComponent',
          config: {
            key: uuid,
            fieldProperties: {},
            properties: {}
          },
          hookType: "afterInit"
        }
        disableCurrentTextFieldAction.config.fieldProperties[currentUUIDData.name] = currentUUIDData.value;
      }    
      // Not Disabled Component 
        if (currentUUIDData && currentUUIDData.ctype && currentUUIDData.isTaskDone && currentUUIDData.ctype !== "actionToggle" && currentUUIDData.ctype !== "textField" && currentUUIDData.ctype !== "iconText" && currentUUIDData.name !="dellWurPackoutResetName") {
          if (compref.instance.group.controls[currentUUIDData.name] != undefined){
            compref.instance.group.controls[currentUUIDData.name].disable();
          }
          disableCurrentTextFieldAction.config.properties["disabled"] = true;
      } else if (compref && compref.instance && compref.instance.group && compref.instance.group.controls) {
        if (currentUUIDData && currentUUIDData.ctype && currentUUIDData.hasOwnProperty('disabled') && compref && compref.instance && compref.instance.group && compref.instance.group.controls &&compref.instance.group.controls[currentUUIDData.name]) {
          if (currentUUIDData.disabled) {
            compref.instance.group.controls[currentUUIDData.name].disable();
          } else {
            compref.instance.group.controls[currentUUIDData.name]&&compref.instance.group.controls[currentUUIDData.name].enable();
          }
          if(disableCurrentTextFieldAction != undefined){

            disableCurrentTextFieldAction.config.properties["disabled"] = currentUUIDData.disabled;
          }
        } else {
          compref.instance.group.controls[currentUUIDData.name]&&compref.instance.group.controls[currentUUIDData.name].enable();
        }
      }
      else {
        disableCurrentTextFieldAction.config.properties["disabled"] = currentUUIDData.disabled;
      }
      if (currentUUIDData && currentUUIDData.ctype == "checkbox" && currentUUIDData.isTaskDone) {
        disableCurrentTextFieldAction.config.properties["disabled"] = true;
      }
    }
 
    else if (currentUUIDData && currentUUIDData.ctype == "button") {
      disableCurrentTextFieldAction = {
        type: 'updateComponent',
        config: {
          key: uuid,
          properties: {}
        },
        hookType: "afterInit"
      }
      disableCurrentTextFieldAction.config.properties["disabled"] = currentUUIDData.disabled;
    } else {
      if (currentUUIDData && currentUUIDData.header && currentUUIDData.header.title && currentUUIDData.header.title.startsWith('#')) {
        const contextKey = currentUUIDData.header.title.substr(1)
        let currentref = this.contextService.getDataByKey(contextKey);
        currentUUIDData.header.title = currentref
        disableCurrentTextFieldAction = {
          type: 'updateComponent',
          config: {
            key: uuid,
            properties: currentUUIDData
          },
          hookType: "afterInit"
        }
      } else if (currentUUIDData) {
        disableCurrentTextFieldAction = {
          type: 'updateComponent',
          config: {
            key: uuid,
            properties: currentUUIDData
          },
          hookType: "afterInit"
        }
      }
    }
      if (currentUUIDData && (currentUUIDData.ctype == "nativeDropdown" || currentUUIDData.ctype == "textField")) {
        if (currentUUIDData.hasOwnProperty('hidden')) {
          disableCurrentTextFieldAction.config.properties["hidden"] = currentUUIDData.hidden;
          disableCurrentTextFieldAction.config.properties["visibility"] = !currentUUIDData.hidden;
          disableCurrentTextFieldAction.config.properties["saveProperty"] = true;
        }
        if(currentUUIDData.hasOwnProperty('enableWithValue')){
          disableCurrentTextFieldAction.config.properties["enableWithValue"] = currentUUIDData.enableWithValue;
        }
      }
  }
    if (currenttaskref && currenttaskref == uuid) {
      let currentTaskData = this.contextService.getDataByKey(uuid + "ref")
      if (currentTaskData && currentTaskData.instance && currentTaskData.instance.header && currentTaskData.instance.header.title && currentTaskData.instance.header.title.startsWith('#') && currenttaskrefData && currenttaskrefData.header && currenttaskrefData.header.title) {
        let currentref = this.contextService.getDataByString(currentTaskData.instance.header.title);
        currenttaskrefData.header.title = currentref;
      }
      let currenttask = this.contextService.getDataByKey(currenttaskref);
      if (currenttask == undefined) {
        disableCurrentTextFieldAction = {
          type: 'updateComponent',
          config: {
            key: currenttaskref,
            properties: currenttaskrefData
          },
          hookType: "afterInit"
        }
      }
    }

    if (pageFooterTaskpanels && pageFooterTaskpanels.uuid == uuid) {
      let Taskpanels = refData.instance&&refData.instance.items&&refData.instance.items.filter((eachItem) => {
        if (eachItem.ctype == "taskPanel" && eachItem.isBasedOnResultCode) {
          return eachItem;
        } else if (eachItem.ctype == "dynamicTaskRender" && eachItem.config.isBasedOnResultCode && eachItem.config.ctype == "taskPanel") {
          eachItem["uuid"] = currenttaskref;
          return eachItem;
        }
      })
      let currentTask = Taskpanels.find(x => x.uuid === currenttaskref);
      let currentTaskData = this.contextService.getDataByKey(currenttaskref);
      if (currentTask || currentTaskData && currentTaskData && currentTaskData.header && currentTaskData.header.statusClass == "complete-status") {
        let compref = this.contextService.getDataByKey(pageFooterTaskpanels.uuid + "ref");
        if (currenttaskrefData&&currenttaskrefData.hidden) {
          compref.instance.disabled = false
        } else {
          compref.instance.disabled = false
        }
      }
    }

    if (jsonData['isAccessoryFlexFiled'] && jsonData['ctype'] == "textField" || jsonData['ctype'] == "title") {
      let compref = this.contextService.getDataByKey(uuid + "ref");
      let currentcompref = this.contextService.getDataByKey(uuid);
      if (currentcompref) {
        compref.instance.defaultValue = currentcompref.value;
        compref.instance.readonly = currentcompref.readonly;
        compref.instance.rightLabel = ((currentcompref.value !==null) && (currentcompref.value !=="")) ? currentcompref.rightLabel : null;
        compref.instance.group.controls[jsonData['name']].patchValue(currentcompref.value)
        let currentcomprefValue= (currentcompref.value !==undefined) ? currentcompref.value : currentcompref.titleValue;
        let currentcompoGetStatus = jsonData.group.controls[Object.keys(jsonData.group.controls)[0]].status;
        compref.instance.group.controls[jsonData['name']].patchValue(currentcomprefValue);
        compref.instance.titleValue = (compref.instance.titleValue === "" &&  currentcompoGetStatus ==="VALID") ? currentcomprefValue : compref.instance.titleValue;
      }
    } else if (jsonData['isAccessoryFlexFiled'] && jsonData['ctype'] == "iconText") {
      let compref = this.contextService.getDataByKey(uuid + "ref");
      let currentcompref = this.contextService.getDataByKey(uuid);
      if (currentcompref) {
        compref.instance.hidden = currentUUIDData.hidden
      }
    }

    if (uuid && jsonData.ctype == "taskPanel") {
      pageItemData && pageItemData.map((eachItem, index) => {
        if (eachItem.uuid == uuid && currentUUIDData && currentUUIDData.header && currentUUIDData.header.statusClass == "complete-status") {
          let completeButton = compref.instance.footer.filter(eachItem => eachItem.ctype == "button");
          let hookObjs = [];
          if(completeButton && completeButton.length !== 0 && completeButton !== null && completeButton !== undefined) {
            hookObjs = this.getRefactoredHooks(completeButton[0].actions, currentWcDataList, hookObjs, "isFromCompleteButton");
            hookObjs.map((each) => {
              refData.instance.hooks.push(each);
            })
          }
        }
      })
      onTaskBased&&onTaskBased.length&&onTaskBased.map((data,index)=>{
        if(data.uuid == uuid && currentUUIDData && currentUUIDData.header && currentUUIDData.header.statusClass == "complete-status") {
          let completeButton = compref.instance.footer.filter(eachItem => eachItem.ctype == "button");
          let hookObjs = [];
          hookObjs = this.getRefactoredHooks(completeButton[0].actions, currentWcDataList, hookObjs,"isFromCompleteButton");
          hookObjs.map((each) => {
            refData.instance.hooks.push(each);
          })
        }
      })
    }
    if(uuid=="damageDescUUID" && currentUUIDData){
      let disableCurrentTextFieldAction = {
        type: 'updateComponent',
        config: {
          key: uuid,
          fieldProperties:{ "damageDesc": currentUUIDData.value,"disabled":currentUUIDData.disabled}
        },
        hookType: "afterInit"
      }
      refData.instance.hooks.push(disableCurrentTextFieldAction)
    }else{
    if (disableCurrentTextFieldAction) {
      refData.instance.hooks.push(disableCurrentTextFieldAction)
    }
  }
  }

  //Method used to get the update configs inside micro service
  getRefactoredHooks(hooks, currentWcDataList, hookObjs, toggle) {
    hooks.map((currentHook) => {
      if (currentHook.type !== "context") {
        if (currentHook.type === "microservice") {
          let currenttaskref = currentWcDataList.find(o => o.key == currentHook.config.microserviceId);
          if (currenttaskref && currenttaskref.key == currentHook.config.microserviceId) {
            this.executeAction(currentHook.responseDependents.onSuccess.actions, currentWcDataList, hookObjs, toggle);
          } else {
            this.executeAction(currentHook.responseDependents.onFailure.actions, currentWcDataList, hookObjs, toggle);
          }
        }
        else if (currentHook.type === "condition") {
          // ** noApplyService true flag useing in Dell Rework Screen for performFARework, performRemovePartsRework, not call each time also stop SL multitimes entry  ** //
            if (currentHook.config.noApplyService!==true) {          
              let onSuccess = currentHook.responseDependents.onSuccess.actions.find(o => o.type === "microservice");
              let onFailure = currentHook&&currentHook.responseDependents&&currentHook.responseDependents.onFailure&&currentHook.responseDependents.onFailure.actions.find(o => o.type === "microservice");
              if (onSuccess) {
                this.executeAction(currentHook.responseDependents.onSuccess.actions, currentWcDataList, hookObjs, toggle);
              } else if (onFailure) {
                this.executeAction(currentHook.responseDependents.onFailure.actions, currentWcDataList, hookObjs, toggle);
              } else {
                hookObjs.push(currentHook);
                currentHook["hookType"] = "afterInit";
              }
            }
        } else {
          currentHook["hookType"] = "afterInit";
          hookObjs.push(currentHook);
        }
      }
    })
    return hookObjs;
  }

  //Method used to get the inner update configs inside nested micro service
  executeAction(actions, currentWcDataList, hookObjs, toggle) {
    actions.map((eachSuccess) => {
      if (eachSuccess.type !== "context") {
        if (eachSuccess.type == "microservice") {
          let currenttaskref = currentWcDataList.find(o => o.key == eachSuccess.config.microserviceId);
          if (currenttaskref && currenttaskref.key == eachSuccess.config.microserviceId) {
            this.getRefactoredHooks(eachSuccess.responseDependents.onSuccess.actions, currentWcDataList, hookObjs, toggle)
          } else {
            this.getRefactoredHooks(eachSuccess.responseDependents.onFailure.actions, currentWcDataList, hookObjs, toggle)
          }
        } else {
          eachSuccess["hookType"] = "afterInit";
          hookObjs.push(eachSuccess)
        }
      }
    })
  }

}