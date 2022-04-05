import { ComponentRef, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UtilityService } from 'src/app/utilities/utility.service';
import { ContextService } from '../contextService/context.service';
import { contextKeysEnum } from '../../../utilities/constants';

@Injectable({
  providedIn: 'root'
})
export class ContextActionService {

  constructor(
    private contextService: ContextService,
    private utilityService: UtilityService,
  ) { }

  handleContextService(action, instance, responseData, actionService) {
    /// call the context service
    switch (action.config.requestMethod) {

      case 'add':
        actionService.addContext(action, instance, responseData);
        break;
      case 'get':
        break;
      case 'delete':
        this.contextService.deleteDataByKey(action.config.key, action?.config?.nestedKey);
        break;
      case 'deleteNestedScreenData':
        this.contextService.deleteNestedScreenData(action.config.key, action?.config?.nestedKey);
        break;
      case 'deleteContext':
        this.contextService.deleteContext();
        break;
      case 'addToExistingContext':
        this.contextService.addToExistingContext(
          action,
          instance,
          responseData, this.utilityService
        );
        break;
      case 'updateToExistingContext':
        this.contextService.updateToExistingContext(
          action,
          instance,
          responseData
        );
        break;
      case 'popContext':
        this.contextService.popContext(action.config.key);
        break;
      case 'addRivision':
        actionService.addRivision(action, instance, responseData);
        break;
      case 'addToGlobalContext':
        this.contextService.contextSubjectData(action.config.key, action.config.data);
        break;
      case 'restoreSavedData':
        this.restoreSavedData();
        break;
      case 'populateMBRScreenWithStoredData':
        this.populateMBRScreenWithStoredData();
        break;
    }
  }

  handlefindMatchingElement(action, instance) {
    if (this.utilityService.isString(action.config.data) && action.config.data.startsWith('#')) {
      const contextArray = this.contextService.getDataByString(action.config.data);
      if (Array.isArray(contextArray)) {
        let compareWith;
        if (action.config.compareWith !== undefined) {
          compareWith = this.contextService.getDataByString(action.config.compareWith);
        } else {
          /// default it
          compareWith = instance.group.controls[instance.name].value;
        }
        const foundElement = contextArray.find((x) => x[action.config.searchProperty] ===
          compareWith)?.[action.config.returnProperty];
        if (foundElement) {
          this.contextService.addToContext(action.config.key, foundElement);
        }
      }
    }
  }

  handlecreateArrayFromContext(action, instance) {
    let sourceContextData = [];
    let targetContextData = [];
    if (action.config.sourceContext.startsWith('#')) {
      sourceContextData = this.contextService.getDataByString(action.config.sourceContext);
    }
    if (action.config.targetContext.startsWith('#')) {
      targetContextData = this.contextService.getDataByString(action.config.targetContext);
      if (Array.isArray(targetContextData) && targetContextData.length) {
        /// No need to do anything!
      } else {
        targetContextData = [];
      }
    }
    sourceContextData.forEach((x) => targetContextData.push(x[action.config.arrayKey]));
    this.contextService.addToContext(action.config.targetContext, targetContextData);
  }

  clearAllContext(action: any, actionService) {
    if (action && action.config) {
      const config = action.config;
      const clearContextFn = (data) => {
        data.forEach((r) => {
          if (r) {
            if (config.clearType === "delete") {
              this.contextService.deleteDataByKey(r);
            } else {
              this.contextService.addToContext(r, "");
            }
          }
        });
      };

      if (config && config.dynamicContexts && (config.dynamicContexts.length > 0)) {
        const dynContxs = [];
        let length: any = actionService.getContextorNormalData(config.clearDataLength, 0);

        config.dynamicContexts.forEach((r) => {
          for (let i = 0; i < length; i++) {
            if (r) {
              dynContxs.push(r.replace(/#@/g, i));
            }
          }
        });

        if (dynContxs.length > 0) {
          clearContextFn(dynContxs);
        }
      }

      if (config && config.contexts && (config.contexts.length > 0)) {
        clearContextFn(config.contexts);
      }
    }
  }

  prepareDataForSaving() {
    const currentWC = this.contextService.getDataByKey(contextKeysEnum.currentWC);
    const screenContext: Map<string, any> | undefined = this.contextService.getDataByKey(currentWC);
    const { ITEM_ID, ITEM_BCN } = this.contextService.getDataByKey(contextKeysEnum.repairUnitInfo);
    const TrackingNo = this.contextService.getDataByKey(contextKeysEnum.trackingNumber);
    if (screenContext) {
      const data = [];
      const currentScreenData = screenContext.get(contextKeysEnum.currentScreenData);
      // Skip saving data if BCN's mismatch
      if (currentScreenData?.ITEM_BCN && currentScreenData.ITEM_BCN !== ITEM_BCN) { return; }
      data.push({ SCREEN_DATA: { ...currentScreenData, ITEM_BCN } });
      const UI_STATE = screenContext.get(contextKeysEnum.currentUIState) ?? {};
      screenContext.forEach((item) => {
        const id = item?.instance?.UUID || item?.instance?.uuid;
        if (id && item?.instance?.ctype === 'taskPanel') {
          UI_STATE[id] = { expanded: item.instance?.expanded, header: item.instance?.header };
        }
        if (id && item?.instance?.ctype === 'checkbox') {
          const { name, group } = item.instance;
          const formValue = (group as FormGroup)?.controls[name]?.value;
          const value = formValue || UI_STATE[id]?.checked || UI_STATE[id] || false;
          UI_STATE[id] = { checked: value };
        }
        if (id && item?.instance?.ctype === 'nativeDropdown') {
          const { name, group } = item.instance;
          const control = (group as FormGroup)?.controls[name];
          const formValue = control?.value;
          const disabled = control?.disabled;
          const value = formValue ?? undefined;
          if (control) {
            UI_STATE[id] = { value, disabled };
          }
        }
        if (id && item?.instance?.ctype === 'button') {
          const { disabled } = item.instance;
          UI_STATE[id] = { disabled };
        }
      });
      data.push({ UI_STATE });
      data.push({ itemId: ITEM_ID, TrackingNo });
      // console.log('Saving:', data);
      this.contextService.contextSubjectData('screenNameData', data);
    } else {
      // Saving empty data to reset previous records
      const data = [{ itemId: ITEM_ID, TrackingNo }];
      // console.log('resetting previously saved data');
      this.contextService.contextSubjectData('screenNameData', data);
    }
  }

  restoreSavedData() {
    const savedData = this.contextService.getDataByKey(contextKeysEnum.getJsonResponse);
    const { ITEM_BCN } = this.contextService.getDataByKey(contextKeysEnum.repairUnitInfo);
    if (savedData?.length) {
      for (const data of savedData) {
        const { SCREEN_DATA, UI_STATE } = data;
        // Prevent data restoring for wrong BCN
        if (SCREEN_DATA && SCREEN_DATA.ITEM_BCN !== ITEM_BCN) {
          break;
        }
        if (SCREEN_DATA) { this.contextService.addToContext(contextKeysEnum.currentScreenData, SCREEN_DATA); }
        if (UI_STATE) { this.contextService.addToContext(contextKeysEnum.currentUIState, UI_STATE); }
      }
    }
  }

  togglePageVisibility(ref: ComponentRef<any>, visibility: boolean) {
    if (ref?.instance) {
      ref.instance.visibility = visibility;
      ref.instance?._changeDetectionRef?.detectChanges();
    }
  }

  populateMBRScreenWithStoredData() {
    const currentWC = this.contextService.getDataByKey(contextKeysEnum.currentWC);
    const screenContext: Map<string, any> | undefined = this.contextService.getDataByKey(currentWC);
    const pageRef: ComponentRef<any> = screenContext.get(contextKeysEnum.dellMBRPageUUID + 'ref');
    this.togglePageVisibility(pageRef, false);
    const uiState = screenContext.get(contextKeysEnum.currentUIState) ?? {};
    const newUIState = {};
    Object.keys(uiState).forEach(uuid => {
      const prevState = uiState[uuid];
      const componentRef: ComponentRef<any> = screenContext.get(uuid + 'ref');
      if (componentRef?.instance) {
        componentRef.instance?._changeDetectionRef.detectChanges();
        if (componentRef.instance?.ctype === 'taskPanel') {
          if (componentRef.instance.expanded !== prevState.expanded) {
            componentRef.instance.expanded = prevState.expanded;
          }
          if (prevState.header) {
            componentRef.instance.header = prevState.header;
          }
        }
        if (componentRef.instance?.ctype === 'nativeDropdown') {
          if (componentRef.instance.disabled !== prevState.disabled) {
            componentRef.instance.disabled = prevState.disabled;
          }
          if (prevState.value && componentRef.instance.defaultValue !== prevState.value) {
            const { name, group } = componentRef.instance;
            const control = (group as FormGroup)?.controls[name];
            control.setValue(prevState.value);
          }
        }
        if (componentRef.instance?.ctype === 'checkbox' && componentRef.instance.checked !== prevState.checked) {
          componentRef.instance.checked = prevState.checked;
        }
        if (componentRef.instance?.ctype === 'button' && componentRef.instance.disabled !== prevState.disabled) {
          componentRef.instance.disabled = prevState.disabled;
        }
        // Transform form fields from objects to values
        if (prevState.checked) {
          newUIState[uuid] = prevState.checked;
        } else if (prevState.value) {
          newUIState[uuid] = prevState.value;
        } else {
          newUIState[uuid] = prevState;
        }
        componentRef.instance?._changeDetectionRef?.detectChanges();
      } else {
        newUIState[uuid] = prevState;
      }
    });
    screenContext.set(contextKeysEnum.currentUIState, newUIState);
    setTimeout(() => this.togglePageVisibility(pageRef, true), 400);
  }

  //method used to gather data provided by the operator in current screen
  getSavedData() {
    let discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
    var currentWC = this.contextService.getDataByKey("currentWC");
    let currenttaskref = this.contextService.getDataByKey("currentTaskPanelUUID")
    let pageUUIDref = this.contextService.getDataByKey("pageUUIDref")
    const pageFooterDropDownTaskpanels = pageUUIDref && pageUUIDref.instance && pageUUIDref.instance.footer[0] && pageUUIDref.instance.footer[0].items && pageUUIDref.instance.footer[0].items.filter(eachItem => eachItem.ctype == "nativeDropdown" || eachItem.ctype == "button");
    const pageTaskpanels = pageUUIDref && pageUUIDref.instance && pageUUIDref.instance.items && pageUUIDref.instance.items.filter(eachItem => eachItem.ctype == "taskPanel" && eachItem.isBasedOnApiData == undefined);
    if (pageFooterDropDownTaskpanels && pageFooterDropDownTaskpanels != undefined) {

      pageFooterDropDownTaskpanels.map((eachItem) => {
        let dropdownRef = this.contextService.getDataByKey(eachItem.uuid + "ref");
        let fieldValue = "";
        if (dropdownRef && dropdownRef.instance.group.controls[eachItem.name] !== undefined) {
          fieldValue = dropdownRef.instance.group.controls[eachItem.name].value
        }
        let dataToBeUpdated = {}
        if (dropdownRef) {
          if (eachItem.ctype !== "button") {
            dataToBeUpdated = {
              "name": eachItem.name,
              "ctype": eachItem.ctype,
              "uuid": eachItem.uuid,
              "value": fieldValue,
              "disabled": dropdownRef.instance.group.controls[eachItem.name].disabled,
              "enableWithValue": dropdownRef.instance.enableWithValue
            }
          } else {
            dataToBeUpdated = {
              "ctype": eachItem.ctype,
              "disabled": dropdownRef.instance.disabled
            }
          }
        }
        this.contextService.addToContext(eachItem.uuid, dataToBeUpdated);
      })
    }

    let currentRefData = this.contextService.getDataByKey(currenttaskref + "ref");
    if (currenttaskref !== undefined && currentRefData && currentRefData.instance && currentRefData.instance.uuid && currentRefData.instance.uuid.controls) {
      Object.keys(currentRefData.instance.uuid.controls).map((key) => {
        let currentFieldData = this.contextService.getDataByKey(key);
        let isCurrentFieldData = this.contextService.getDataByKey(currenttaskref);
        let currentField;
        if (currentFieldData && currentFieldData != null && currentFieldData != undefined) {
          currentField = this.contextService.getDataByKey(currentFieldData.uuid);
        }
        if (currentField && currentField.uuid && currentField.ctype === 'radioButtonGroup') {
          if (currentField.ctype !== 'radioButtonGroup') {
            currentField['value'] = currentFieldData.value;
          }
          currentField['disabled'] = currentField.isTaskDone;
          this.contextService.addToContext(currentField.uuid, currentField);
        } else {
          if (
            currentRefData.instance.uuid.controls[key] &&
            currentFieldData &&
            currentFieldData.ctype !== undefined
          ) {
            if (currentFieldData.ctype !== 'radioButtonGroup') {
              currentFieldData['value'] = currentRefData.instance.uuid.controls[key].value;
              if(currentFieldData.ctype == "nativeDropdown" || currentFieldData.ctype == "textField"){
                let getHiddenState=this.contextService.getDataByKey(currentFieldData.uuid + "ref")
              if(getHiddenState&&getHiddenState.instance && getHiddenState.instance.hasOwnProperty('hidden')){
                currentFieldData['hidden']= getHiddenState.instance.hidden
              }
              }
              // currentFieldData["disabled"] = currentRefData.instance.disabled;
            }

            // if (currentFieldData.ctype === "radioButtonGroup") {
            //   // currentFieldData["value"] = currentRefData.instance.uuid.controls[key].value;
            //   currentFieldData["disabled"] = currentRefData.instance.disabled;
            // }

            if (currentFieldData.ctype == 'button') {
              let itemref = this.contextService.getDataByKey(currentFieldData.uuid + 'ref');
              currentFieldData['disabled'] = itemref.instance.disabled;
            } else {
              currentFieldData['disabled'] = currentRefData.instance.uuid.controls[key].disabled;
            }
            this.contextService.addToContext(currentFieldData.uuid, currentFieldData);
          }
        }
        // else if (currentField && currentField.uuid) {
        //   if (currentField.ctype !== "radioButtonGroup") {
        //     currentField["value"] = currentRefData.instance.uuid.controls[key].value;
        //   }
        //   currentField["disabled"] = currentField.isTaskDone;
        //   this.contextService.addToContext(currentField.uuid, currentField)
        // }
      });

      if(currentRefData.instance && currentRefData.instance.header){
        if (currentRefData.instance.header.title && (currentRefData.instance.header.title).includes("Accessories")) {
          if(currentRefData.instance.footer){
            let compBtn = currentRefData.instance.footer.filter(eachItem => eachItem.ctype == "button");
            if(compBtn && compBtn.length > 0){
              let cmpBtnInstance = this.contextService.getDataByKey(compBtn[0].uuid+"ref");
              let itemData = {
                "ctype": cmpBtnInstance.instance.ctype,
                "disabled": cmpBtnInstance.instance.disabled
              };
              this.contextService.addToContext(cmpBtnInstance.instance.uuid, itemData);
            }
          }
        }
      }
    }
    if (currenttaskref == undefined) {
      if (pageTaskpanels[0] != undefined) {
        pageTaskpanels[0].items.forEach((item) => {
          if (item.name) {
            let itemData = {
              "name": item.name,
              "ctype": item.ctype,
              "uuid": item.uuid,
              "value": item.group.controls[item.name].value,
              "disabled": item.group.controls[item.name].disabled
            }
            this.contextService.addToContext(item.uuid, itemData);
          }
        })
      }
      pageTaskpanels[0] && pageTaskpanels[0] != undefined && pageTaskpanels[0].footer !== undefined && pageTaskpanels[0].footer.length && pageTaskpanels[0].footer.forEach((item) => {
        let itemref = this.contextService.getDataByKey(item.uuid + "ref");
        if (item.name) {
          let itemData = {
            "name": item.name,
            "ctype": item.ctype,
            "disabled": itemref.instance.disabled
          }
          this.contextService.addToContext(item.uuid, itemData);
        }
      })
    }

    let screenData = this.contextService.getDataByKey("menuItems");
    let screenWiseData = [];

    screenData && screenData.length && screenData.map((eachData) => {
      let data = this.contextService.getDataByKey(eachData.name);
      let refData = [];
      let screenobj = {};
      data = data && new Map(
        [...data]
          .filter(([key, value]) => {
            if (key) {
              //this condition is used to avoid storing of context values in save and exit data while clicking on save and exit button,hold,timeout and next button
              if (Array.isArray(key) ||key.endsWith("ref") || key == "obaData" || key.endsWith("Ref") || key == "flexFieldsFormGroup" || key == "getSubProcessPageBody" || key == "repairReworkData" || key == "expansionpanelcontent" || key == "compTemplate" || key == "expansionPanelContentFirstHalf" || key == "hpEcoData" || key == "mainPageContentBodysp" || key == "getSearchCriteria1" || key == "mainPageContentBody" || key == "getSearchCriteria" || key == "getSearchCriteriaData" || key == "repairDebugData" || key == "repairAssmentData" || key == "quoteMessageData" || key == "burnInData" || key == "mbRepairData" || key == "getADVISORYLOGAlertDetailsAssessment" || key == "receivingSearchData" || key == "afterButtonToggle" || key == "requisitionList" || key == "expansionPanelContentTopHalf" || key == "initiateOBAImageLoadReq" || key == "workInstructions" || key == "decodedwcData" || key == "dellDebugReqList" || key == "occurenceList" || key == "defectCodeList" || key == "assemblyCodeList" || key == "getDellEcoDetails" || key == "dellLeftSideDpsType" || key == "dellLeftSideLob" || key == "dellLeftSideWarranty" || key == "dellLeftSideEntitlement" || key == "dellLeftSideSla" || key=="expansionPanelContenttaskpanel" || key=="expansionPanelContenttoolbar" || key=="getDellDebugPredictiveDefects" || key=="getDellDebugDefect" || key=="getDellDebugaddDefectPredictiveDefects" || key == "expansionpanelfooter" || key=="childList" || key=="tableCompleteData"|| key == "flexfieldsitems" || key == "trigger4thSeq" ) {
                //do nothing
              }
              else {
                return JSON.stringify(value && refData.push({ key, value }));
                // if ((discrepancyUnitInfo && discrepancyUnitInfo.CLIENTNAME !== "DELL" && key !== "timeoutNotes") || (discrepancyUnitInfo && discrepancyUnitInfo.CLIENTNAME == "HP" && key == "timeoutNotes")) {
                //   return JSON.stringify(value && refData.push({ key, value }))
                // } else {
                //   let WC = this.contextService.getDataByKey("currentWC");
                //   //if (discrepancyUnitInfo && discrepancyUnitInfo.CLIENTNAME === "DELL" && (eachData.name == "ASSESSMENT" || eachData.name == "ECN" || eachData.name == "DEBUG" || eachData.name == "DEBUG_ARC" || eachData.name == "L2_DEBUG")) {
                //     return JSON.stringify(value && refData.push({ key, value }));
                //   //}
                // }
              }
            }
          }));
      screenobj[eachData.name] = JSON.stringify(refData);
      screenWiseData.push(screenobj)
    })

    screenWiseData.push({
      "menuItems": screenData
    });
  
    let parentChildrenMenuitems = this.contextService.getDataByKey("parentChildrenMenuitems");
    screenWiseData.push({
      "parentChildrenMenuitems": parentChildrenMenuitems
    });
    let itemId = this.contextService.getDataByString("#repairUnitInfo");
    let trackingNuber = this.contextService.getDataByString("#trackingNo");
    screenWiseData.push({
      "itemId": itemId.ITEM_ID,
      "TrackingNo": trackingNuber
    });
    this.contextService.contextSubjectData("screenNameData", screenWiseData);
  }

  /// Deletes and adds new data which is being saved during exit
  replacePreviousData(screenWiseData: any, itemToDelete) {
    for (let i = 0; i < screenWiseData.length; i++) {
      let keys = Object.keys(screenWiseData[i]);
      for (let j = 0; j < keys.length; j++) {
        if (keys[j] === itemToDelete) {
          screenWiseData.splice(screenWiseData.indexOf(screenWiseData[i]), 1);
        }
      }
    }
  }

  //Method called for save and exit in Timeout and Next button
  clearScreenData(action, buttonText) {
    let WC = this.contextService.getDataByKey("currentWC");
    let discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
    //client and screen validation for save and exit data formation and api call else it will execute prodution code
    let isClientAndScreenValid = this.contextService.handleClientAndScreenValidation();
    if (isClientAndScreenValid) {
      let data = this.contextService.getDataByKey("ScreenMenuObj");
      let menu = this.contextService.getDataByKey("menuItems");
      let parentChildrenMenuitems =  this.contextService.getDataByKey("parentChildrenMenuitems");
      menu && menu.forEach((element: any) => {
        if (element.name == data?.name) {
          element["completed"] = true;
          element["isVisited"] = false;
        }
      });
      parentChildrenMenuitems && parentChildrenMenuitems.forEach((element: any) => {
        if (element.children && element.children.length > 0) {
          element.children && element.children.forEach((childrenElement: any) => {
            if (childrenElement.name == data?.name) {
              childrenElement["completed"] = true;
              childrenElement["isVisited"] = true;
              childrenElement["isActive"] = false;
            }
          });
        }
        else if (element.name == data?.name) {
          element["completed"] = true;
          element["isVisited"] = true;
          element["isActive"] = false;       
        }
      });
      // if(discrepancyUnitInfo && discrepancyUnitInfo.CLIENTNAME === "DELL" && discrepancyUnitInfo.CONTRACTNAME === "DELL AIO"){
      //   this.contextService.deleteDataByKey("validatetaskpanelstatus");
      // }
      this.getSavedData();
      this.utilityService._saveAndExitApiCall(action);
      this.contextService.contextSubjectData("menuItems", menu);
      this.contextService.deleteDataByKey("currentWC");
      this.contextService.deleteDataByKey("fetchDataFromPrevWC");
      if (buttonText !== "Next") {
        if (menu != undefined && menu.length >= 1) {
          menu.forEach((ele) => {
            this.contextService.deleteDataByKey(ele.name);
          });
        }
        this.contextService.deleteDataByKey("menuItems");
       // this.contextService.deleteDataByKey("parentChildrenMenuitems");
        this.contextService.deleteDataByKey("ScreenMenuObj");
      }
      this.contextService.deleteScreenContext();
    } else if (discrepancyUnitInfo && discrepancyUnitInfo.WORKCENTER.includes('DELL_MBR') && buttonText === 'Timeout') {
      let data = this.contextService.getDataByKey("ScreenMenuObj");
      let menu = this.contextService.getDataByKey("menuItems");
      menu && menu.forEach((element: any) => {
        if (element.name == data?.name) {
          element["completed"] = true;
          element["isVisited"] = false;
        }
      });
      this.prepareDataForSaving();
      this.utilityService._saveAndExitApiCall(action);
      this.contextService.contextSubjectData("menuItems", menu);
      this.contextService.deleteDataByKey("currentWC");
      this.contextService.deleteDataByKey("fetchDataFromPrevWC");
      if (buttonText !== "Next") {
        if (menu != undefined && menu.length >= 1) {
          menu.forEach((ele) => {
            this.contextService.deleteDataByKey(ele.name);
          });
        }
        this.contextService.deleteDataByKey("menuItems");

        this.contextService.deleteDataByKey("parentChildrenMenuitems");

        this.contextService.deleteDataByKey(WC);

        this.contextService.deleteDataByKey("ScreenMenuObj");
      }
    }else {
      this.nonSaveAndExitData();
    }
  }
 
  //Method called to clear data for the screens which is routed to dashboard i.e non save and exit screens
  nonSaveAndExitData(){
    this.contextService.deleteScreenContext();
    let WC = this.contextService.getContextSubjectData("currentWC");
    this.contextService.deleteDataByKey(WC);
    this.contextService.deleteDataByKey("currentWC");
    let menuItems = this.contextService.getDataByKey("menuItems");
    if (menuItems != undefined && menuItems.length >= 1) {
      menuItems.forEach((ele) => {
        this.contextService.deleteDataByKey(ele.name);
      });
    }
    this.contextService.deleteDataByKey("menuItems");
    this.contextService.deleteDataByKey("parentChildrenMenuitems");
    this.contextService.deleteDataByKey("getJsonReponse");
  }

  //Method called for save and exit button in Hold 
  pauseScreenData(action) {
    let WC = this.contextService.getDataByKey("currentWC");
    //client and screen validation for save and exit data formation and api call else it will execute prodution code
    let isClientAndScreenValid = this.contextService.handleClientAndScreenValidation();
    if (isClientAndScreenValid) {
      let OnPrintAPIConfig = this.contextService.getDataByKey("isOnePrintAPIFailed");
      if (OnPrintAPIConfig == undefined) {
        let data = this.contextService.getDataByKey("ScreenMenuObj");
        let menu = this.contextService.getDataByKey("menuItems");
        menu && menu.length && menu.forEach((element: any) => {
          if (element.name == data.name) {
            element["completed"] = false;
            element["isVisited"] = false;
            if(!!element["is2ndVisit"]){
            element["is2ndVisit"] = false;
            }
          }
        })
        this.contextService.contextSubjectData("menuItems", menu);
        this.getSavedData();
        this.utilityService._saveAndExitApiCall(action);
      }
      this.contextService.deleteDataByKey("currentWC");
      this.contextService.deleteDataByKey("fetchDataFromPrevWC");
      this.contextService.deleteDataByKey(WC);
      this.contextService.deleteScreenContext();
      this.contextService.deleteDataByKey("ScreenMenuObj");
      let menuItems = this.contextService.getDataByKey("menuItems");
      if (menuItems != undefined && menuItems.length >= 1) {
        menuItems.forEach((ele) => {
          this.contextService.deleteDataByKey(ele.name);
        });
      }
      this.contextService.deleteDataByKey("menuItems");
      this.contextService.deleteDataByKey("parentChildrenMenuitems");
      this.contextService.deleteDataByKey("isOnePrintAPIFailed");
    } else {
      this.nonSaveAndExitData()
    }
  }

  concatContexts(action) {
    if (action && action.config) {
      const config = action.config;
      let concatText = [];
      config.contexts && config.contexts.forEach((r) => {
        if (this.utilityService.isString(r) && (r.startsWith('#'))) {
          concatText.push(this.contextService.getDataByString(r));
        } else {
          concatText.push(r);
        }
      });
      this.contextService.addToContext(config.contextKey, concatText.join(" "));
    }
  }

  //method used to store the saved which is getting from api
  getDataFromSaveAndExit(action: any, actionService: any) {
    let saveddata = this.contextService.getDataByKey("getJsonReponse");
    let routeWC = this.contextService.getDataByKey("routeWC");
    saveddata && saveddata.length && saveddata.map((data) => {
      var found;
      saveddata.find(function (element) {
        Object.keys(element).forEach((key) => {
          if (key === "menuItems" && routeWC == undefined) {
            return found = element[key];
          }
        })
      });

      Object.keys(data).forEach((key) => {
        if (key == "menuItems" || key === "TrackingNo" || key === "itemId" 
             || key == "parentChildrenMenuitems" ) {
          if (routeWC == undefined) {
            this.contextService.contextSubjectData(key, data[key])
          }
        } else {
          let currenttaskref;
          if (typeof (data[key]) == "string") {
            currenttaskref = JSON.parse(data[key]);
          } else {
            currenttaskref = data[key]
          }
          let map1 = new Map();
          currenttaskref && currenttaskref.length && currenttaskref.map((eachItem) => {
            map1.set(eachItem.key, eachItem.value);
          })
          this.contextService.contextSubjectData(key, map1)
        }
      })
    })
  }

  //method used to save menu data
  screenMenus() {
    let savedMenuItems = this.contextService.getDataByKey("menuItems") || [];
    let screenName1 = this.contextService.getDataByKey("currentWC");
    let parent = this.contextService.getDataByKey("SubprocessMenu");
    if (parent && parent !== undefined) {
      let arr = [];
      if (parent[0].children) {
        arr = parent[0].children;
      } else {
        arr = parent;
      }

      arr && arr.map((item, i) => {
        if (item.name.toLowerCase() == screenName1.toLowerCase()) {
          this.contextService.contextSubjectData("currentWC", item.name);
          this.contextService.addToContext("currentWC", item.name);
          let slWcName =  this.contextService.getDataByKey("slWcName")
          item["completed"] = false;
          item["isVisited"] = false;
          slWcName != null ?  item["slWcName"] =  slWcName : null ;
          this.contextService.contextSubjectData("ScreenMenuObj", item);
          if (savedMenuItems.find(x => x.name === screenName1 && x.id === item.id)) {
            ///do nothing
          } else {
            savedMenuItems.push(item);
          }
        }
      })
      if (savedMenuItems && savedMenuItems.length) {
        let subProcessMenuArr = arr.find(x => x.name === screenName1);
        let menuItem = savedMenuItems.find(x => x.name === screenName1 && x.id === subProcessMenuArr.id && x.completed);
        if (menuItem) {
          this.contextService.deleteDataByKey(screenName1);
          savedMenuItems.map((data) => {
            if (data.name == menuItem.name) {
              data["completed"] = false;
              data["isVisited"] = true;
              data["is2ndVisit"] = true;
              this.contextService.contextSubjectData("ScreenMenuObj", data);
            }
          })
        }
      }
     let structredMenuData = this.updatingParentChildrenMenuitems(savedMenuItems);
      this.contextService.contextSubjectData("menuItems", savedMenuItems);
      this.contextService.contextSubjectData("parentChildrenMenuitems",structredMenuData )
    }
  }

  //Method for adding the screen parentChildren menuItem
  updatingParentChildrenMenuitems(screenData) {
    let menuData = this.contextService.getDataByKey("SubprocessMenu");
    let parentChildrenMenuitems = this.contextService.getDataByKey("parentChildrenMenuitems") || [];
    let currentWC = this.contextService.getDataByKey("currentWC");
    let structredMenuData = JSON.parse(JSON.stringify(menuData));
    // saving the menu items when it comes the first time(Intially)
    if (parentChildrenMenuitems.length <= 0) {
      if (currentWC == "DISCREPANCY" || currentWC == "ASSESSMENT"
       || currentWC == "FA-ASSESSMENT") {
        parentChildrenMenuitems = this.insertingReceivingVmiObjToMenuItems(parentChildrenMenuitems);
      }
      if (structredMenuData[0].children) {
        // retrieving the current screen array which is active 
        structredMenuData[0].children = [];
        structredMenuData[0].children = menuData[0].children.filter(function (children) {
          return children.name == currentWC;
        });
        parentChildrenMenuitems.push(structredMenuData[0]);
        // parentChildrenMenuitems = structredMenuData
      }
      else {
        parentChildrenMenuitems.push(structredMenuData[0]);
      }
    }
    else {
      //Method for updating the menuitem status which are having active status true of other WC
    this.updatingActiveStatusparentChildrenMenuitems(parentChildrenMenuitems);

      let parentaIndexlreadyExists;
      let childrenIndexlreadyExists;
      //  retrieving the current screen array from the API response of the SubprocessMenu
      if (menuData[0].children) {
        parentaIndexlreadyExists = parentChildrenMenuitems.findIndex((x) => x.name == menuData[0].name);
        if (parentaIndexlreadyExists >= 0) {

          childrenIndexlreadyExists = parentChildrenMenuitems[parentaIndexlreadyExists].children.findIndex((children) => children.name == currentWC);
          if (childrenIndexlreadyExists >= 0) {
            //updating the children to exisitng parent
            let childrenUpdate = menuData[0].children.filter(function (children) {
              return children.name == currentWC;
            });
            parentChildrenMenuitems[parentaIndexlreadyExists].children[childrenIndexlreadyExists] = childrenUpdate[0]
          }
          else {
            let addNewChildrenExistingParent;
            //adding the children to existing parent
            addNewChildrenExistingParent = menuData[0].children.filter(function (children) {
              return children.name == currentWC;
            });
            parentChildrenMenuitems[parentaIndexlreadyExists].children.push(addNewChildrenExistingParent[0]);
          }
        } else {

          //adding the parent and current screen children
          structredMenuData[0].children = menuData[0].children.filter(function (children) {
            return children.name == currentWC;
          });
          //   parentChildrenMenuitems = [];
          parentChildrenMenuitems.push(structredMenuData[0]);
          // parentChildrenMenuitems.slice(0, 1)
        }
      }
      else {
        let singleParentIndexlreadyExists
        singleParentIndexlreadyExists = parentChildrenMenuitems.findIndex((x) => x.name == menuData[0].name);
        if (singleParentIndexlreadyExists >= 0) {
          //  updatng the parent only
          let parentUpdate = menuData[0]
          parentChildrenMenuitems[singleParentIndexlreadyExists] = parentUpdate
        }
        else {
          parentChildrenMenuitems.push(menuData[0])
        }
      }
    }
    return parentChildrenMenuitems;
  }

  //Method for updating the menuitem status which are having active status true of other WC
  updatingActiveStatusparentChildrenMenuitems(parentChildrenMenuitems) {
    let currentWC = this.contextService.getDataByKey("currentWC");
    parentChildrenMenuitems && parentChildrenMenuitems.forEach((element: any) => {
      if (element.children && element.children.length > 0) {
        element.children && element.children.forEach((childrenElement: any) => {
          if (childrenElement.name != currentWC && !childrenElement.completed) {
            childrenElement["completed"] = true;
            childrenElement["isVisited"] = true;
            childrenElement["isActive"] = false;
          }
        });
      }
      else if (element.name != currentWC && !element.completed) {
        element["completed"] = true;
        element["isVisited"] = true;
        element["isActive"] = false;
      }
    });
  }
  
   //Method for adding the  Receiving and Vmi Obj to menuItem
  insertingReceivingVmiObjToMenuItems(parentChildrenMenuitems) {
    let receivingMenuObj =
    {
      "name": "RECEIVING",
      "id": "1893",
      "desc": " ",
      "url": " ",
      "isActive": false,
      "isVisited": "true",
      "completed": "true",
      "displayOrder": "0",
      "children": [
        {
          "name": "SEARCH",
          "id": "1897",
          "desc": " ",
          "url": "~",
          "parentid": "1893",
          "isActive": false,
          "isVisited": "true",
          "completed": "true",
          "displayOrder": "1"
        },
        {
          "name": "CONFIRM",
          "id": "1901",
          "desc": " ",
          "url": "~",
          "parentid": "1893",
          "isActive": false,
          "isVisited": "true",
          "completed": "true",
          "displayOrder": "2"
        }
      ]
    };
    let vmiMenuObj =
    {
      "name": "VMI",
      "id": "1899",
      "desc": " ",
      "url": " ",
      "isActive": false,
      "isVisited": "true",
      "completed": "true",
      "displayOrder": "1",
      "children": null
    }
    parentChildrenMenuitems.push(receivingMenuObj);
    parentChildrenMenuitems.push(vmiMenuObj);
    return parentChildrenMenuitems;
  }
 
  }
