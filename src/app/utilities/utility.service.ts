import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ContextService } from '../services/commonServices/contextService/context.service';
import { FormControl, Validators } from '@angular/forms';
import { ComponentService } from '../services/commonServices/componentService/component.service';
import { FormOperService } from '../services/commonServices/formOperService/formOper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

//@Imported idle external package
import { BnNgIdleService } from 'bn-ng-idle';

//@external components
import { cloneDeep } from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable } from 'rxjs';
import { TransactionService } from '../services/commonServices/transaction/transaction.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { serviceUrls } from '../../environments/serviceUrls';
import { ComponentLoaderService } from '../services/commonServices/component-loader/component-loader.service';
@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private contextService: ContextService,
    private formOperService: FormOperService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private componentService: ComponentService,
    private bnIdle: BnNgIdleService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private componentLoaderService: ComponentLoaderService
  ) { }
  isCheckAccPanelvisible;
  handleCommonServices(action, instance, responseData, scope) {
    //clones into new const variable
    const config = cloneDeep(action.config);

    switch (config.type) {
      case 'errorRenderTemplate':
        this.errorRenderTemplate(config, instance, responseData, scope);
        break;

      case 'onePrintService':
        this.onePrintService(config, instance, scope);
        break;

      case 'filterWith':
        this.onFilterWith(config);
        break;

      case 'idleInitiative':
        this.onIdleInitiative();
        break;

      case 'onePrintAPICallLoop':
        this.onePrintAPICallLoop(config, instance, scope);
        break;
      case 'handleOnePrintApi':
        this.handleOnePrintApi(config, instance, scope);
        break;
        case 'handleDataFormationFor':
        this.handleDataFormationFor(config, instance, scope);
        break;
      default:
        break;
    }
  }

  errorRenderTemplate(config, instance, responseData, scope) {
    const templates = [{
      "type": "context",
      "config": {
        "requestMethod": "add",
        "key": (config.contextKey || "errorMsg"),
        "data": responseData
      }
    },
    {
      "type": "updateComponent",
      "config": {
        "key": (config.updateKey || "errorTitleUUID"),
        "properties": {
          "titleValue": (config.contextKey) ? `#${config.contextKey}` : "#errorMsg",
          "isShown": true
        }
      }
    }];

    templates.forEach((element) => {
      scope.handleAction(element, instance);
    });
  }

  onePrintService(config, instance, scope) {
    const templates = [{
      "type": "microservice",
      "config": {
        "microserviceId": "onePrint",
        "requestMethod": "post",
        "body": {
          "locationId": "#repairUnitInfo.LOCATION_ID",
          "clientId": "#repairUnitInfo.CLIENT_ID",
          "contractId": "#repairUnitInfo.CONTRACT_ID",
          "warehouseId": "#repairUnitInfo.WAREHOUSE_ID",
          "routeCode": "#repairUnitInfo.ROUTE",
          "workCenterId": "#repairUnitInfo.WORKCENTER_ID",
          "eventName": config.eventName,
          "hostName": "#getHostNameResponse.hostName",
          "ip": "#getHostNameResponse.ip",
          "userName": "#userAccountInfo.PersonalDetails.USERID",
          "params": config.params || {
            "ITEM_ID": "#repairUnitInfo.ITEM_ID"
          }
        },
        "toBeStringified": true
      },
      "responseDependents": {
        "onSuccess": {
          "actions": config.onSuccessActions
        },
        "onFailure": {
          "actions": config.onFailureActions
        }
      }
    }];

    templates.forEach((element) => {
      scope.handleAction(element, instance);
    });
  }

  getFilteredCodes(array, key, value) {
    return array.filter(function (e) {
      return e[key] == value;
    });
  }

  isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
  }

  isObjectNotEmpty(obj: Object) {
    return Object.keys(obj).length > 0;
  }

  getElementBykeyName(inputArray, keyName: string, keyValue: string, lhsSecondKeyName?: string) {
    if (keyValue.startsWith('#')) {
      keyValue = this.contextService.getDataByString(keyValue);
    }
    for (let i = 0; i < inputArray.length; i++) {
      if (inputArray[i][keyName].toLocaleLowerCase() === keyValue.toLocaleLowerCase()) {
        return inputArray[i][lhsSecondKeyName];
      }
    }
  }

  removeKeys(obj, keys) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        switch (typeof (obj[prop])) {
          case 'object':
            if (keys.indexOf(prop) > -1) {
              delete obj[prop];
            } else {
              this.removeKeys(obj[prop], keys);
            }
            break;
          default:
            if (keys.indexOf(prop) > -1) {
              delete obj[prop];
            }
            break;
        }
      }
    }
  }

  removeEmptyArrayObjects(obj, key, valueField, originalBodyObj, keyToBeRemoved) {
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (typeof obj[i] == 'object') {
          if (i == key) {
            let objArray = obj[i];
            if (objArray.length == 0) {
              delete obj[key];
              if (keyToBeRemoved !== null && keyToBeRemoved) {
                this.removeKeys(originalBodyObj, keyToBeRemoved);
              }
            } else {
              for (let j = 0; j < objArray.length; j++) {
                let objValues = objArray[j];
                if (objValues[valueField] === "" || objValues[valueField] === undefined || objValues[valueField] === null) {
                  if (keyToBeRemoved === null || keyToBeRemoved === undefined) {
                    delete objArray[j][valueField];
                    // j--;
                  } else {
                    objArray.splice(j, 1);
                    j--;
                  }
                }
              }
              if (objArray.length == 0) {
                delete obj[key];
                if (keyToBeRemoved !== null && keyToBeRemoved) {
                  this.removeKeys(originalBodyObj, keyToBeRemoved);
                }
              }
            }
          } else {
            this.removeEmptyArrayObjects(obj[i], key, valueField, originalBodyObj, keyToBeRemoved);
          }
        }
      }
    }
  }

  registerSvgIcons() {
    const listofSVGIcons = ['replace', 'software', 'manual', 'reset',
      'delete', 'calender', 'description', 'fit', 'remove', 'scrap', 'info', 'description_icon', 'primary_fault', 'cube','predictive','arrow-hexa','print'];
    listofSVGIcons.forEach((svgIcon) => {
      this.iconRegistry.addSvgIcon(
        svgIcon,
        this.sanitizer.bypassSecurityTrustResourceUrl(`assets/Images/${svgIcon}.svg`));
    });
  }

  splitByHyphenAndRemoveSpace(inputString: string): string {
    const splitInputString = inputString.split('-');
    const returnString = splitInputString[2].replace(/ +/g, '');
    return returnString.replace(/~/g, '');
  }

  clearFlexFieldAccessories(action, instance, contextService) {
    const accessoriesFlexFieldRef = contextService.getDataByKey('confirmAccessoriesListUUID' + 'ref');
    if (accessoriesFlexFieldRef !== undefined) {
      const accessoriesFlexCount = accessoriesFlexFieldRef.instance.flexCount.length;
      if (accessoriesFlexCount !== undefined && accessoriesFlexCount > 0) {
        for (let i = 0; i < accessoriesFlexCount; i++) {
          const clearFlexFieldAction = {
            ///
            type: 'updateComponent',
            config: {
              key: i + "newNoUUID",
              properties: {
                readonly: false,
                value: '',
                rightLabel: '',
                placeholder: "Scan Value"
              }
            }
          };
          let textFieldData = {
            "ctype": "textField",
            "uuid": i + "newNoUUID",
            "value": "",
            "readonly": false,
            "rightLabel": "",
            "name": i + "partNumber"
          }
          this.contextService.addToContext(i + "newNoUUID", textFieldData);
          this.componentService.handleUpdateComponent(clearFlexFieldAction, null, null, this);

          const clearGroup = {
            type: "resetData",
            config: {
              key: i + "newNoUUID"
            }
          }

          this.formOperService.handleReset(clearGroup, contextService.getDataByKey(i + "newNoUUID" + 'ref').instance);

          const resetMissingAccessory = {
            type: 'updateComponent',
            config: {
              key: i + "missingAccessoryUUID",
              properties: {
                hidden: false
              }
            }
          };
          let missingAccrs = {
            "ctype": "iconText",
            "uuid": i + "missingAccessoryUUID",
            "hidden": false,
            "name": i + "Missing Accessory ?"
          }
          this.contextService.addToContext(i + "missingAccessoryUUID", missingAccrs);
          this.componentService.handleUpdateComponent(resetMissingAccessory, null, null, this);
        }
      }
    }
  }

  handleToastMessage(action, instance, actionService) {
    // Default configurations
    let toastDuration = action.duration !== undefined ? action.duration : 1000;
    let horizontalPosition = action.horizontalPosition !== undefined ? action.horizontalPosition : "center";
    let verticalPosition = action.verticalPosition !== undefined ? action.verticalPosition : "bottom";
    let buttonText = action.buttonText !== undefined ? action.buttonText : '';
    let buttonActions = action.buttonActions !== undefined ? action.buttonActions : [];
    if (action.message.startsWith('#')) {
      action.message = this.contextService.getDataByString(action.message)
    }
    let snackBarRef = this._snackBar.open(action.message, buttonText, {
      duration: toastDuration,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
    });
    snackBarRef.onAction().subscribe(() => {
      /// snackbar action clicked
      if (buttonActions.length > 0) {
        buttonActions.forEach((ele) => {
          actionService.handleAction(ele, instance);
        });
      }
    });
  }

  handleSessionStorageOperation(action) {
    const { config, mode } = action;
    if (config) {
      const { localKey, contextNameKey, contextKey, localData } = config;
      if (mode === "read") {
        let localValue;
        let localValueName;
        const userNameData = this.contextService.getDataByString("#userAccountInfo.PersonalDetails.USERID");

        if (userNameData) {
          localValue = localStorage.getItem(userNameData + localKey);
          localValueName = localStorage.getItem(userNameData + contextNameKey);
        }
        if (localValue) {
          this.contextService.addToContext(contextKey, localValue);
        }
        if (localValueName) {
          this.contextService.addToContext(contextNameKey, localValueName);
        }
      } else if (mode === "write") {
        const data = localData.startsWith('#')
          ? this.contextService.getDataByString(config.localData)
          : localData;
        if (data) {
          const userNameData = this.contextService.getDataByString("#userAccountInfo.PersonalDetails.USERID");
          if (userNameData) {
            console.log(config.localKey)
            localStorage.setItem(userNameData + config.localKey, data);
          }
        }
      }
    }

  }

  populateMissingAccessoriesNamesInTextFields() {
    const missingAccessoriesList = this.contextService.getDataByKey('missingAccessoriesList');
    let accessoriesListString = '';
    let noOfValidatedAccessories = this.contextService.getDataByKey('numOfValidatedFieldsInCA');
    noOfValidatedAccessories = noOfValidatedAccessories === undefined || noOfValidatedAccessories === "" ? 0 : noOfValidatedAccessories;
    for (let i = 0; i < missingAccessoriesList.length; i++) {

      let accessoryName = this.getProperAccessoryName(missingAccessoriesList[i]);

      let enableAccessoryNameAction = {
        type: 'updateComponent',
        config: {
          key: (noOfValidatedAccessories + i) + "newNoUUID",
          properties: {
            placeholder: accessoryName
          }
        }
      };
      this.componentService.handleUpdateComponent(enableAccessoryNameAction, null, null, this);

    }
  }
  getProperAccessoryName(accessoryObject: any) {
    if (accessoryObject.FF_NAME === "AC Adapter SN" || accessoryObject.FF_NAME === "Battery SN")
      return accessoryObject.FF_NAME;
    else
      return accessoryObject.FF_VALUE;
  }
  getProperHASHCODE(accessoryObject: any) {
    // if (accessoryObject.HASHCODE === "AC Adapter SN" || accessoryObject.FF_NAME === "Battery SN")
    //   return accessoryObject.HASHCODE;
    // else
    return accessoryObject.HASHCODE;
  }

  getProcessValue(accessoryObject: any) {
    return accessoryObject.FF_VALUE;
  }

  // code for  dell check accessories panel 
  dellPackoutAccessoryDisable(action, instance, actionService) {
    this.dellPackoutResultCodeAndTimeout();
    const missingAccessoriesList = this.contextService.getDataByKey('checkAccesorysdata');
    let scannedValues = this.contextService.getDataByKey("scannedValues");
    let scannedValuesWithIndex = this.contextService.getDataByKey("scannedValuesWithIndex");
    let accessoriesListString = '';
    this.contextService.addToContext("qrcodeScanValue", "Replaced AC Adapter");
    let currentFieldRefIndex = instance.uuid.charAt(0);
    let currentFieldRef = this.contextService.getDataByKey(currentFieldRefIndex + "newNoUUIDref");
    let isErrorMsg = true;
    let titleValue = "";

    let noOfValidatedAccessories = this.contextService.getDataByKey('numOfValidatedFieldsInCA');
    noOfValidatedAccessories = noOfValidatedAccessories === undefined || noOfValidatedAccessories === "" ? 0 : noOfValidatedAccessories;
    let isAlreadyScannedValue = true;
    let completeBtnStatus = true;

    let indexMatching;
    let scannedIndex;

    /// Checking if already filled text field is being edited
    if (scannedValuesWithIndex !== undefined && scannedValuesWithIndex.length > 0) {
      scannedValuesWithIndex.forEach((eachitem, scannedValueIndex) => {
        if (eachitem.index === currentFieldRefIndex) {
          scannedValues.forEach((scannedItem, index) => {
            if (scannedItem.HASHCODE.toLowerCase() === eachitem.HASHCODE.toLowerCase()) {
              scannedIndex = scannedValueIndex;
              indexMatching = index;
            }
          });
        }
      });
    } else {
      scannedValuesWithIndex = [];
    }

    if (scannedIndex !== undefined) {
      scannedValues.splice(indexMatching, 1);
      scannedValuesWithIndex.splice(scannedIndex, 1);
      this.contextService.addToContext('scannedValuesWithIndex', scannedValuesWithIndex);
      this.contextService.addToContext('scannedValues', scannedValues);
    }

    /// Checking if the current scanned values is already
    /// Added in any text field
    let currentRecord = [];
    missingAccessoriesList.forEach((element) => {
      if (element.FF_VALUE.toLowerCase() === "adapter" || element.FF_VALUE.toLowerCase() === "adaptor") {
        currentRecord.push(element);
      }
    });
    if (scannedValues !== undefined && scannedValues.length > 0) {
      let arr = [];
      if (currentRecord.length > 0) {
        currentRecord.forEach((item) => {
          scannedValues.forEach((element) => {
            if (currentRecord && element.HASHCODE.toLowerCase() === item.HASHCODE.toLowerCase()) {
              item["isUsed"] = currentRecord.length === 1 ? false : true;
              if (currentRecord.length === 1) {
                scannedValues.forEach((eachItem) => {
                  if (eachItem.FF_VALUE.toLowerCase() === "adapter" || eachItem.FF_VALUE.toLowerCase() === "adaptor") {
                    scannedValues.splice(scannedValues.indexOf(eachItem), 1);
                  }
                });
              }
            } else {
              item["isUsed"] = false;
            }
            arr.push(item);
          });
        })
      }

      currentRecord = arr;
    } else {
      scannedValues = [];
    }

    currentRecord.forEach((eachRec) => {
      if (eachRec.isused === undefined || eachRec.isUsed === false) {
        isAlreadyScannedValue = false;
      }
    })

    let allowOnlyOnce = 0;
    let value;
    let flag;
    for (let i = 0; i < missingAccessoriesList.length; i++) {
      let accessoryName = this.getProperAccessoryName(missingAccessoriesList[i]);
      let hashCode = this.getProperHASHCODE(missingAccessoriesList[i]);
      let MissingValue = this.getProcessValue(missingAccessoriesList[i]);
      if (i === 0 && !isAlreadyScannedValue) {
        currentRecord.forEach((element) => {
          flag = element.FF_VALUE.toLowerCase() === "adapter" || element.FF_VALUE.toLowerCase() === "adaptor" ? true : false;
          if (flag && allowOnlyOnce === 0 && (element.isUsed === undefined || element.isUsed === false)) {
            isErrorMsg = false;
            value = element;
            allowOnlyOnce = allowOnlyOnce + 1;
            scannedValues.unshift(element);
            this.contextService.addToContext("scannedValues", scannedValues);
            let currentObj = element;
            currentObj["index"] = currentFieldRefIndex;
            scannedValuesWithIndex.unshift(currentObj);
            this.contextService.addToContext("scannedValuesWithIndex", scannedValuesWithIndex);
            currentFieldRef && currentFieldRef.instance.group.controls[currentFieldRefIndex + "partNumber"].setValue("Replaced AC Adapter");
            if (flag == true && i > 0) {
              let enableAccessoryNameAction = [
                {
                  type: 'updateComponent',
                  config: {
                    key: "0newNoUUID",
                    properties: {
                      value: "Replaced AC Adapter",
                      disabled: true
                    }
                  }
                },
                {
                  type: "context",
                  config: {
                    requestMethod: "add",
                    key: "0newNoUUID",
                    value: currentFieldRef.instance.group.controls[currentFieldRefIndex + "partNumber"]
                  }
                },
                {
                  type: 'updateComponent',
                  config: {
                    key: "0accessoryTitleUUID",
                    properties: {
                      titleValue: "",
                    }
                  }
                },
                {
                  type: 'enableComponent',
                  config: {
                    key: "1newNoUUID",
                    property: "1partNumber"
                  }
                }]
              let accesTypeData = {
                "ctype": "textField",
                "uuid": "0newNoUUID",
                "value": currentFieldRef.instance.group.controls["0partNumber"].value,
                "name": "0partNumber",
                "disabled": false
              }
              this.contextService.addToContext("0newNoUUID", accesTypeData);
              if (enableAccessoryNameAction) {
                enableAccessoryNameAction.forEach((ele) => {
                  actionService.handleAction(ele, instance);
                });
              }
            } else {
              let enableAccessoryNameAction = [
                {
                  type: 'updateComponent',
                  config: {
                    key: "0newNoUUID",
                    properties: {
                      value: "Replaced AC Adapter",
                      disabled: true
                    }
                  }
                },

                {
                  type: 'updateComponent',
                  config: {
                    key: "0accessoryTitleUUID",
                    properties: {
                      titleValue: "",
                    }
                  }
                },
                {
                  type: 'updateComponent',
                  config: {
                    key: "dellPackoutCheckAccessCompleteUUID",
                    properties: {
                      disabled: false,
                    }
                  }
                }]
              let accesTypeData = {
                "ctype": "textField",
                "uuid": "0newNoUUID",
                "value": currentFieldRef.instance.group.controls["0partNumber"].value,
                "name": "0partNumber",
                "disabled": true
              }
              this.contextService.addToContext("0newNoUUID", accesTypeData);
              if (enableAccessoryNameAction) {
                enableAccessoryNameAction.forEach((ele) => {
                  actionService.handleAction(ele, instance);
                });
              }
            }
          }
        });
        // this.qrCodeScancheck(action, instance, actionService);
      } else {
        scannedValuesWithIndex.forEach((item, index) => {
          let nextField = this.contextService.getDataByKey(index + 'newNoUUIDref');
          let nextFieldValue = nextField && nextField.instance.group.controls[nextField.instance.name].value;
          if (value && index !== 0 && value.HASHCODE.toLowerCase() === item.HASHCODE.toLowerCase()) {
            isErrorMsg = true;
          }
        });
        console.log("error message", isErrorMsg);
        titleValue = "Accessory Does Not Match";
      }
    }
    if (!isErrorMsg) {
      completeBtnStatus = this.getStatusOfCompleteButton(missingAccessoriesList);
    }
    if (flag == true && currentRecord.length === 1 && missingAccessoriesList.length === 1) {
      actionService.handleAction({
        type: 'updateComponent',
        config: {
          key: "dellPackoutCheckAccessCompleteUUID",
          properties: {
            disabled: false
          }
        }
      }, instance)
    } else {
      actionService.handleAction({
        type: 'updateComponent',
        config: {
          key: "dellPackoutCheckAccessCompleteUUID",
          properties: {
            disabled: completeBtnStatus
          }
        }
      }, instance)
    }

    actionService.handleAction(
      {
        "type": "updateComponent",
        "config": {
          "key": "errorTitleUUID",
          "properties": {
            "titleValue": titleValue,
            "isShown": isErrorMsg
          }
        }
      },
      instance
    )
    if (isErrorMsg) {
      actionService.handleAction(
        {
          type: 'updateComponent',
          config: {
            key: currentFieldRefIndex + "accessoryTitleUUID",
            properties: {
              titleValue: "",
              hidden: true
            }
          }
        },
        instance
      )
    }
  }
  getStatusOfCompleteButton(missingAccessoriesList) {
    let arr = [];
    let completeBtnStatus = true;
    missingAccessoriesList.forEach((eachItem, itemIndex) => {
      let flag = false;
      let currentField = this.contextService.getDataByKey(itemIndex + 'newNoUUIDref');
      let currentfieldValue = currentField && currentField.instance.group.controls[currentField.instance.name].value;
      missingAccessoriesList.forEach((indexItem, currentIndex) => {
        if (indexItem.FF_VALUE.toLowerCase() === "adapter" || indexItem.FF_VALUE.toLowerCase() === "adaptor") {
          if (currentfieldValue !== undefined && currentfieldValue === "Replaced AC Adapter") {
            flag = true;
          }
        }
        if (currentfieldValue && currentfieldValue !== undefined && indexItem.HASHCODE.toLowerCase() === currentfieldValue.toLowerCase()) {
          flag = true;
        }
      });
      if (flag) {
        arr.push(currentfieldValue);
      }
    });
    if (arr.length === missingAccessoriesList.length) {
      completeBtnStatus = false;
    }
    return completeBtnStatus;
  }
  dellPackoutAccessoryEnable(action, instance, actionService) {
    const accessoryEnableFlexFieldRef = this.contextService.getDataByKey('confirmAccessoriesListUUID' + 'ref');
    this.contextService.addToContext('scannedValuesWithIndex', []);
    this.contextService.addToContext('scannedValues', []);
    this.contextService.addToContext("accesoryMatchCount", 0);
    let clearEnableFlexFieldAction;
    let emptyErrorMsgonReset = {
      "type": "updateComponent",
      "config": {
        "key": "errorTitleUUID",
        "properties": {
          "titleValue": "",
          "isShown": false
        }
      }
    }
    this.componentService.handleUpdateComponent(emptyErrorMsgonReset, null, null, this);
    if (accessoryEnableFlexFieldRef !== undefined) {
      const accessoryEnableFlexCount = accessoryEnableFlexFieldRef.instance.flexCount.length;
      if (accessoryEnableFlexCount !== undefined && accessoryEnableFlexCount > 0) {
        for (let i = 0; i < accessoryEnableFlexCount; i++) {
          if (i == 0) {
            clearEnableFlexFieldAction = [
              {
                "type": 'enableComponent',
                "config": {
                  "key": "0newNoUUID",
                  "property": "0partNumber"
                }
              },
              {
                "type": 'updateComponent',
                "config": {
                  "key": "0newNoUUID",
                  "properties": {
                    "placeholder": "QR Code",
                  }
                }
              },
              {
                "type": 'updateComponent',
                "config": {
                  "key": "0accessoryTitleUUID",
                  "properties": {
                    "hidden": true
                  }
                }
              },
              {
                "type": 'updateComponent',
                "config": {
                  "key": "0missingAccessoryUUID",
                  "properties": {
                    "text": "Replaced AC Adapter",
                    "iconTextClass": "body2 changeMissing assessment-alert change-position",
                    "hidden": false
                  }
                }
              }];
          } else {
            clearEnableFlexFieldAction = [
              {
                "type": 'updateComponent',
                "config": {
                  "key": i + "newNoUUID",
                  "properties": {
                    "placeholder": "QR Code",
                  }
                }
              },
              {
                "type": 'updateComponent',
                "config": {
                  "key": i + "accessoryTitleUUID",
                  "properties": {
                    "hidden": true
                  }
                }
              },
              {
                type: 'updateComponent',
                config: {
                  key: i + "missingAccessoryUUID",
                  properties: {
                    hidden: true
                  }
                }
              },
              {
                type: 'updateComponent',
                config: {
                  key: "dellPackoutCheckAccessCompleteUUID",
                  properties: {
                    disabled: true
                  }
                }
              }];
          }
          if (clearEnableFlexFieldAction) {
            clearEnableFlexFieldAction.forEach((ele) => {
              actionService.handleAction(ele, instance);
            });
          }
        }
      }
    }
  }
  toDisplaycheckAccesoriespanel(action, instance, actionService) {
    let getdefectcodedatafordefectHDD = this.contextService.getDataByKey('getPreviousWCFAHistorydata');
    let getffBYWCdata = this.contextService.getDataByKey("getffnamevalue");
    let moreInforesponse = this.contextService.getDataByString("#specialMessageData.moreInfo");
    let isCheckreturnDefectPanelvisible;
    let returnDefectpanel = false;
    let checkAccPanel = false;
    let enableResultCode = false;
    if (getdefectcodedatafordefectHDD && getdefectcodedatafordefectHDD !== undefined && getdefectcodedatafordefectHDD !== null) {
      for (let i = 0; i < getdefectcodedatafordefectHDD.length; i++) {
        let defectCodevalue = getdefectcodedatafordefectHDD[i].defectCode;
        if (defectCodevalue == "HDD05") {
          returnDefectpanel = true;
        }
      }
    }
    if (getffBYWCdata && getffBYWCdata != "") {
      let ffdatavalue = getffBYWCdata[0];
      if (ffdatavalue.ffName == "Condition" && ffdatavalue.ffValue != "BER") {
        checkAccPanel = true;
      }
    }

    if (returnDefectpanel) {
      if (checkAccPanel) {
        if (action.config.uuid == 'dellPackoutSubmittedUUID') {
          enableResultCode = false;
        } else {
          enableResultCode = (action.config.uuid == "dellPackoutIssueBoxSubmittedUUID");
        }
      } else {
        enableResultCode = (action.config.uuid == 'dellPackoutIssueBoxSubmittedUUID');
      }

    } else {
      if (checkAccPanel) {
        enableResultCode = (action.config.uuid == 'dellPackoutIssueBoxSubmittedUUID');
      }
    }
    actionService.handleAction(
      {
        "type": "updateComponent",
        "config": {
          "key": "dellPackOutResultCodesUUID",
          "properties": {
            "disabled": !enableResultCode
          }
        }
      }
    )
  }
  tocheckReturnHDDPPIDofpackout(action, instance, actionService) {
    let getDefectCodeDetailsdata = this.contextService.getDataByKey("getDefectCodeDetails");
    let HddPidtextvalue = this.contextService.getDataByKey("repairHdd");
    let isTimeoutBtnBasedOnWC = this.contextService.getDataByKey("isTimeoutBtnBasedOnWC");
    let tocheckHDDPPID;
    let ppidValueToCompare = "";
    let isBerSelected = false;
    if (isTimeoutBtnBasedOnWC.ffValue == "BER") {
      isBerSelected = true;
    }
    if (getDefectCodeDetailsdata) {
      if (isBerSelected) {
        ppidValueToCompare = getDefectCodeDetailsdata[0].componentSerialNo;
      } else {
        ppidValueToCompare = getDefectCodeDetailsdata[0].componentLocation;
      }
    }
    if (getDefectCodeDetailsdata && getDefectCodeDetailsdata[0].defect == "HDD05" && HddPidtextvalue == ppidValueToCompare) {
      tocheckHDDPPID = {
        type: 'updateComponent',
        config: {
          key: "dellPackoutSubmittedUUID",
          properties: {
            disabled: false,
          }
        }
      }
      this.componentService.handleUpdateComponent(tocheckHDDPPID, null, null, this);
    } else {
      tocheckHDDPPID = [{
        type: 'updateComponent',
        config: {
          key: "dellPackoutSubmittedUUID",
          properties: {
            disabled: true,
          }
        }
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "errorTitleUUID",
          "properties": {
            "titleValue": "Returning Customer HardDrive Does Not Match",
            "isShown": true
          }
        }
      }]
      if (tocheckHDDPPID) {
        tocheckHDDPPID.forEach((ele) => {
          actionService.handleAction(ele, instance);
        });
      }
    }

  }
  viewAllCheckAccesories(action, instance, actionService) {
    let dellAIOTriggerflexdata = []
    let accesoryflexfeildsItems = [];
    let flexFieldValueListArr = [];
    let checkAccessories = this.contextService.getDataByKey("confirmAccessoriesFlexFieldsData");
    this.contextService.addToContext("dellAIOTriggerflexValues", []);
    if (checkAccessories && checkAccessories != null && checkAccessories != undefined) {
      for (let AccData = 0; AccData < checkAccessories.length; AccData++) {
        let accesory = checkAccessories[AccData].FF_NAME.toUpperCase();
        if (accesory.includes("ACCESORY")) {
          dellAIOTriggerflexdata.push(checkAccessories[AccData]);
          this.contextService.addToContext("dellAIOTriggerflexValues", dellAIOTriggerflexdata);
        } else {
          let obj = {};
          let flexFieldValueList = {};
          obj["id"] = checkAccessories[AccData].FF_NAME;
          obj["value"] = checkAccessories[AccData].FF_VALUE;
          flexFieldValueList["id"] = checkAccessories[AccData].FF_VALUE;
          flexFieldValueList["value"] = checkAccessories[AccData].FF_VALUE;
          flexFieldValueListArr.push(flexFieldValueList);
          accesoryflexfeildsItems.push(obj);
          this.contextService.addToContext("accesoryflexfeildsItems", accesoryflexfeildsItems);
          this.contextService.addToContext("flexFieldValueListArr", flexFieldValueListArr);
        }
      }
      this.togetAccesorydatafromResponse(checkAccessories);
    }
    let checkAccessoriesPanelItems = this.contextService.getDataByKey("dellAIOTriggerflexValues");
    if (checkAccessoriesPanelItems && checkAccessoriesPanelItems.length > 0 && checkAccessoriesPanelItems != null && checkAccessoriesPanelItems != undefined) {
      let viewAllCheckAccesories = {
        type: 'updateComponent',
        config: {
          key: 'confirmAccessoriesListUUID',
          properties: {
            flexCount: '#dellAIOTriggerflexValues',
            label: ''
          }
        }
      }
      this.componentService.handleUpdateComponent(viewAllCheckAccesories, null, null, this);
      let checkAccflexfileds = this.contextService.getDataByKey("confirmAccessoriesFlexFieldsData");
      for (let i = 0; i < checkAccflexfileds.length; i++) {
        if (i > 0) {
          let hidemisssingAcc = [
            {
              type: 'updateComponent',
              config: {
                key: i + "missingAccessoryUUID",
                properties: {
                  hidden: true
                }
              }
            }]
          if (hidemisssingAcc) {
            hidemisssingAcc.forEach((ele) => {
              actionService.handleAction(ele, instance);
            });
          }
        }
      }
    } else {
      let hidecheckAccpanelItems = [
        {
          type: 'updateComponent',
          config: {
            key: "dellPackoutAccessTitleUUID",
            properties: {
              title: "No accessory received to validate.",
              titleClass: "body2"
            }
          }
        }, {
          type: 'updateComponent',
          config: {
            key: "dellPackoutAccessHeaderUUID",
            properties: {
              hidden: true
            }
          }
        }, {
          type: 'updateComponent',
          config: {
            key: "dellPackoutCheckAccessResetUUID",
            properties: {
              hidden: true
            }
          }
        }, {
          type: 'updateComponent',
          config: {
            key: "dellPackoutCheckAccessCompleteUUID",
            properties: {
              disabled: false
            }
          }
        }]
      if (hidecheckAccpanelItems) {
        hidecheckAccpanelItems.forEach((ele) => {
          actionService.handleAction(ele, instance);
        });
      }
    }
  }

  togetAccesorydatafromResponse(checkAccessories: any) {
    let checkAccesorysdata = [];
    let halfLength = checkAccessories.length / 2;
    for (var i = 1; i <= halfLength; i++) {
      let obj = this.getValue(i, checkAccessories);
      checkAccesorysdata.push(obj);
    }
    console.log("newdata", checkAccesorysdata);
    this.contextService.addToContext("checkAccesorysdata", checkAccesorysdata);
  }
  getValue(i, checkAccessories) {
    let obj = {};
    checkAccessories.forEach((item) => {
      // Object.keys(item).forEach((key)=>{
      if (item.FF_NAME.includes(i.toString())) {
        if (item.FF_NAME.includes("PPID")) {
          obj["HASHCODE"] = item.FF_VALUE;
        }
        if (item.FF_NAME.includes("Accesory")) {
          obj["FF_VALUE"] = item.FF_VALUE;
        }
        obj[item.FF_NAME] = item.FF_VALUE;
      }
      // })
    })
    return obj;
  }

  toviewReturnDefectHddpanel(action, instance, actionService) {
    let getdefectcodedatafordefectHDD = this.contextService.getDataByKey('getPreviousWCFAHistorydata');
    let getffBYWCdata = this.contextService.getDataByKey("getffnamevalue");
    let moreInforesponse = this.contextService.getDataByString("#specialMessageData.moreInfo");
    //let checkAccessoriespaneldata = this.contextService.getDataByKey("dellAIOTriggerflexValues");
    let isCheckreturnDefectPanelvisible;
    let returnDefectpanel = false;
    let checkAccPanel = false;
    let frstDisabled = false;
    let secondDisabled = false;
    let firstHidden = false;
    let secondHidden = false;
    let firststExpanded = false;
    let secondExpanded = false;
    let expandSplMsg = false;
    this.contextService.addToContext("isConfirmAccessories", false);
    let isConfirmAccessoriesCompleted = this.contextService.getDataByKey("isConfirmAccessoriesCompleted");
    let isDefectivePartExistsCompleted = this.contextService.getDataByKey("isDefectivePartExistsCompleted");

    this.contextService.addToContext("isDefectivePartExists", false);
    if (getdefectcodedatafordefectHDD && getdefectcodedatafordefectHDD !== undefined && getdefectcodedatafordefectHDD !== null) {
      for (let i = 0; i < getdefectcodedatafordefectHDD.length; i++) {
        let defectCodevalue = getdefectcodedatafordefectHDD[i].defectCode;
        if (defectCodevalue == "HDD05") {
          returnDefectpanel = true;
          if (isDefectivePartExistsCompleted == undefined) {
            this.contextService.addToContext("isDefectivePartExists", true);
          }
        }
      }
    }
    if (getffBYWCdata && getffBYWCdata != "") {
      getffBYWCdata.forEach((item) => {
        if (item.ffName.toLowerCase() === "condition" && item.ffValue != "BER") {
          checkAccPanel = true;
          if (isConfirmAccessoriesCompleted == undefined) {
            this.contextService.addToContext("isConfirmAccessories", true);
          }
        }
      })
    }
    if (moreInforesponse === null || moreInforesponse === "" || moreInforesponse === undefined) {
      expandSplMsg = false;
      if (returnDefectpanel) {
        frstDisabled = false;
        firstHidden = false;
        firststExpanded = true;

        if (checkAccPanel) {
          secondDisabled = true;
          secondHidden = false;
        } else {
          secondHidden = true;
        }

      } else {
        firstHidden = true;

        if (checkAccPanel) {
          secondDisabled = false;
          secondHidden = false;
          secondExpanded = true;
        } else {
          secondHidden = true;
          actionService.handleAction(
            {
              "type": "updateComponent",
              "config": {
                "key": "dellPackOutResultCodesUUID",
                "properties": {
                  "disabled": false
                }
              }
            }
          )
        }
      }
    } else {
      expandSplMsg = true;
      if (returnDefectpanel) {
        frstDisabled = true;
        firstHidden = false;
        firststExpanded = false;

        if (checkAccPanel) {
          secondDisabled = true;
          secondHidden = false;
          secondExpanded = false;
        } else {
          secondHidden = true;
        }

      } else {
        firstHidden = true;
        if (checkAccPanel) {
          secondDisabled = true;
          secondHidden = false;
          secondExpanded = false;
        } else {
          secondHidden = true;
        }
      }
      firststExpanded = false;
      secondExpanded = false;
    }

    let actions = [
      {
        type: 'updateComponent',
        config: {
          key: "dellPackoutDefectiveUUID",
          properties: {
            hidden: firstHidden,
            disabled: frstDisabled,
            expanded: firststExpanded
          }
        }
      },
      {
        type: 'updateComponent',
        config: {
          key: "dellPackoutCheckAccessUUID",
          properties: {
            hidden: secondHidden,
            disabled: secondDisabled,
            expanded: secondExpanded
          }
        }
      },
      {
        type: 'updateComponent',
        config: {
          key: "dellPackoutRepairInfoUUID",
          properties: {
            expanded: expandSplMsg
          }
        }
      }
    ]

    actions.forEach((eachAction) => {
      actionService.handleAction(eachAction, instance);
    })

    // break;
    // }
    // else
    // {
    //   isCheckreturnDefectPanelvisible = {
    //     type: 'updateComponent',
    //     config: {
    //       key: "dellPackoutDefectiveUUID",
    //       properties: {
    //        hidden:true,
    //       }
    //     }
    //   }
    // this.componentService.handleUpdateComponent(isCheckreturnDefectPanelvisible, null, null, this);
    // let ffdatavalue = getffBYWCdata[0];
    // if(getffBYWCdata && getffBYWCdata != "" && getdefectcodedatafordefectHDD && getdefectcodedatafordefectHDD != ""){
    //   if(ffdatavalue.ffName == "Condition" && ffdatavalue.ffValue != "BER"){
    //     let viewCheckAccesoryPanel={
    //       type: 'updateComponent',
    //       config: {
    //         key: "dellPackoutCheckAccessUUID",
    //         properties: {
    //          hidden:false,
    //         }
    //       }
    //     }
    //     this.componentService.handleUpdateComponent(viewCheckAccesoryPanel, null, null, this);
    //     if(moreInforesponse =="" || moreInforesponse == undefined || moreInforesponse == null){
    //       let  returnDefectHDDpanelShow = {
    //          type: 'updateComponent',
    //          config: {
    //            key: "dellPackoutCheckAccessUUID",
    //            properties: {
    //             expanded:true,
    //             disabled:false
    //            }
    //          }
    //        }
    //        this.componentService.handleUpdateComponent(returnDefectHDDpanelShow, null, null, this);
    //     }
    //   }else{
    //     let viewCheckAccesoryPanel={
    //       type: 'updateComponent',
    //       config: {
    //         key: "dellPackoutCheckAccessUUID",
    //         properties: {
    //          hidden:true,
    //         }
    //       }
    //     }
    //   this.componentService.handleUpdateComponent(viewCheckAccesoryPanel, null, null, this);
    //   }
    // }

    //     }
    // }



    //for defect Hdd Return panel

    // let getdefectcodedatafordefectHDD = this.contextService.getDataByKey('getPreviousWCFAHistorydata');
    // let moreInforesponse = this.contextService.getDataByKey("#specialMessageData.moreInfo");
    // let isCheckreturnDefectPanelvisible; 
    // if(!moreInforesponse){
    //   if(getdefectcodedatafordefectHDD){
    //     for(let i =0 ;i<getdefectcodedatafordefectHDD.length;i++){
    //       let defectCodevalue = getdefectcodedatafordefectHDD[i].defectCode;
    //       if(defectCodevalue == "HDD05"){
    //         isCheckreturnDefectPanelvisible = {
    //           type: 'updateComponent',
    //           config: {
    //             key: "dellPackoutDefectiveUUID",
    //             properties: {
    //              hidden:false,
    //             }
    //           }
    //         }
    //   this.componentService.handleUpdateComponent(isCheckreturnDefectPanelvisible, null, null, this);
    //   let disableCheckAccTask ={
    //     "type": "updateComponent",
    //     "config": {
    //         "key": "dellPackoutCheckAccessUUID",
    //         "properties": {
    //             "expanded": true,
    //             "disabled": false,
    //             "hidden":false,
    //             "header": {
    //                 "title": "Check Accessories",
    //                 "icon": "description",
    //                 "iconClass": "active-header",
    //                 "svgIcon": "description_icon",
    //                 "statusIcon": "hourglass_empty",
    //                 "statusClass": "incomplete-status"
    //             }
    //         }
    //     }
    //   }
    //   this.componentService.handleUpdateComponent(disableCheckAccTask, null, null, this);
    //   break;
    //       }else{
    //         isCheckreturnDefectPanelvisible = {
    //           type: 'updateComponent',
    //           config: {
    //             key: "dellPackoutDefectiveUUID",
    //             properties: {
    //              hidden:true,
    //             }
    //           }
    //         }
    //        this.componentService.handleUpdateComponent(isCheckreturnDefectPanelvisible, null, null, this);
    //       }
    //     }
    //   }else{
    //     isCheckreturnDefectPanelvisible = {
    //       type: 'updateComponent',
    //       config: {
    //         key: "dellPackoutDefectiveUUID",
    //         properties: {
    //          hidden:true,
    //         }
    //       }
    //     }
    //    this.componentService.handleUpdateComponent(isCheckreturnDefectPanelvisible, null, null, this);
    //   }
    // }

  }
  qrCodeScancheck(action, instance, actionService) {
    this.dellPackoutResultCodeAndTimeout();
    const missingAccessoriesList = this.contextService.getDataByKey('checkAccesorysdata');
    let scannedValues = this.contextService.getDataByKey("scannedValues");
    let scannedValuesWithIndex = this.contextService.getDataByKey("scannedValuesWithIndex");
    let scanQR_CodeValue = this.contextService.getDataByKey("qrcodeScanValue");
    let currentfeildInstanceValue = instance.group.value[instance.name]
    let currentfeildInstanceuuid = instance.uuid;
    let isErrorMsg = true;
    let titleValue = "";
    let currentfeildIndex = currentfeildInstanceuuid.charAt(0);
    console.log("curent value", currentfeildInstanceValue, "cuurent uuid", currentfeildInstanceuuid);
    let qrCodeValue;
    let completeBtnStatus = true;
    let nextfield = 0;
    let isAlreadyScannedValue = false;
    let accesoryMatchCount = this.contextService.getDataByKey("accesoryMatchCount") ? this.contextService.getDataByKey("accesoryMatchCount") : 0;

    let indexMatching;
    let scannedIndex;

    /// Checking if already filled text field is being edited
    if (scannedValuesWithIndex !== undefined && scannedValuesWithIndex.length > 0) {
      scannedValuesWithIndex.forEach((eachitem, scannedValueIndex) => {
        if (eachitem.index === currentfeildIndex) {
          scannedValues.forEach((scannedItem, index) => {
            if (scannedItem.HASHCODE.toLowerCase() === eachitem.HASHCODE.toLowerCase()) {
              scannedIndex = scannedValueIndex;
              indexMatching = index;
            }
          });
        }
      });
    } else {
      scannedValuesWithIndex = [];
    }

    if (indexMatching != undefined) {
      scannedValues.splice(indexMatching, 1);
      scannedValuesWithIndex.splice(scannedIndex, 1);
      this.contextService.addToContext('scannedValuesWithIndex', scannedValuesWithIndex);
      this.contextService.addToContext('scannedValues', scannedValues);
    }

    /// Checking if the current scanned values is already
    /// Added in any text field
    if (scannedValues !== undefined && scannedValues.length > 0) {
      scannedValues.forEach((element) => {
        if (element.HASHCODE.toLowerCase() === currentfeildInstanceValue.toLowerCase()) {
          isAlreadyScannedValue = true;
        }
      });
    } else {
      scannedValues = [];
    }
    for (let i = 0; i < missingAccessoriesList.length; i++) {
      let currentFieldRef = this.contextService.getDataByKey(i + "newNoUUIDref");
      let currentfieldValue = currentFieldRef ? currentFieldRef.instance.group.controls[currentFieldRef.instance.name].value : "";
      qrCodeValue = this.getProperHASHCODE(missingAccessoriesList[i]);
      let accessoryName = this.getProperAccessoryName(missingAccessoriesList[i]);

      if ((currentfeildInstanceValue.toLowerCase() === qrCodeValue.toLowerCase() && !isAlreadyScannedValue) || (currentfeildInstanceValue === "Replaced AC Adapter")) {
        scannedValues.push(missingAccessoriesList[i]);
        this.contextService.addToContext("scannedValues", scannedValues);
        let currentObj = missingAccessoriesList[i];
        currentObj["index"] = currentfeildIndex;
        scannedValuesWithIndex.push(currentObj);
        this.contextService.addToContext("scannedValuesWithIndex", scannedValuesWithIndex);
        isErrorMsg = false;
        let disableCurrentfeild = [
          {
            "type": "updateComponent",
            "config": {
              "key": "errorTitleUUID",
              "properties": {
                "titleValue": "",
                "isShown": true
              }
            }
          },
          {
            type: 'updateComponent',
            config: {
              key: currentfeildIndex + "newNoUUID",
              properties: {
                value: currentfeildInstanceValue
              }
            }
          },
          {
            type: 'updateComponent',
            config: {
              key: currentfeildIndex + "accessoryTitleUUID",
              properties: {
                titleValue: currentfeildInstanceValue === "Replaced AC Adapter" ? "" : accessoryName,
                hidden: false
              }
            }
          }
        ]
        let textFieldData = {
          "ctype": "textField",
          "uuid": currentfeildIndex + "newNoUUID",
          "value": currentfeildInstanceValue,
          "name": currentfeildIndex + "partNumber"
        }
        this.contextService.addToContext(currentfeildIndex + "newNoUUID", textFieldData);

        let accessoryTitleData = {
          "ctype": "title",
          "uuid": currentfeildIndex + "accessoryTitleUUID",
          "titleValue": currentfeildInstanceValue,
          "name": currentfeildIndex + "accessoryType"
        }
        this.contextService.addToContext(currentfeildIndex + "accessoryTitleUUID", accessoryTitleData);

        let missingAccrs = {
          "ctype": "iconText",
          "titleValue": currentfeildInstanceValue === "#getProcessWCData.dellReplacedACAdapter" ? "" : accessoryName,
          "hidden": false,
          "uuid": currentfeildIndex + "missingAccessoryUUID",
          "name": currentfeildIndex + "Missing Accessory ?"
        }
        this.contextService.addToContext(currentfeildIndex + "missingAccessoryUUID", missingAccrs);

        if ((currentfeildIndex++) < missingAccessoriesList.length - 1) {
          let arr = [
            {
              "type": "updateComponent",
              "config": {
                "key": (currentfeildIndex) + "newNoUUID",
                "properties": {
                  "disabled": false
                }
              }
            },
            {
              "type": "setFocus",
              "config": {
                "targetId": (currentfeildIndex) + "newNoUUID",
              }
            }
          ]
          arr.forEach((eachitem: any) => {
            disableCurrentfeild.push(
              eachitem
            )
          })

        }
        if (disableCurrentfeild) {
          disableCurrentfeild.forEach((ele) => {
            actionService.handleAction(ele, instance);
          });
        }

        accesoryMatchCount++;
        this.contextService.addToContext("accesoryMatchCount", accesoryMatchCount);
      } else {
        console.log("touched", instance);
        if (currentFieldRef.instance.group.controls[currentFieldRef.instance.name].dirty && currentFieldRef.instance.group.controls[currentFieldRef.instance.name].value != "") {
          // isErrorMsg = true;
          titleValue = "Accessory Does Not Match";
          console.log("error message", isErrorMsg);
        }
        if (currentfeildInstanceValue == "") {
          let textFieldData = {
            "ctype": "textField",
            "uuid": currentfeildIndex + "newNoUUID",
            "value": currentfeildInstanceValue,
            "name": currentfeildIndex + "partNumber"
          }
          this.contextService.addToContext(currentfeildIndex + "newNoUUID", textFieldData);
        }

        //  let displayError= {
        //     "type": "updateComponent",
        //     "config": {
        //         "key": "errorTitleUUID",
        //         "properties": {
        //             "titleValue": "Accessory Does Not Match",
        //             "isShown": true
        //         }
        //     }
        //   }
        // this.componentService.handleUpdateComponent(displayError, null, null, this);
      }
    }

    if (!isErrorMsg) {
      completeBtnStatus = this.getStatusOfCompleteButton(missingAccessoriesList);
    }
    let enablecompletebtn = {
      type: 'updateComponent',
      config: {
        key: "dellPackoutCheckAccessCompleteUUID",
        properties: {
          disabled: completeBtnStatus
        }
      }
    }
    actionService.handleAction(
      {
        "type": "updateComponent",
        "config": {
          "key": "errorTitleUUID",
          "properties": {
            "titleValue": titleValue,
            "isShown": isErrorMsg
          }
        }
      },
      instance
    )
    if (isErrorMsg) {
      actionService.handleAction(
        {
          type: 'updateComponent',
          config: {
            key: currentfeildIndex + "accessoryTitleUUID",
            properties: {
              titleValue: "",
              hidden: true
            }
          }
        },
        instance
      )
    }

    this.componentService.handleUpdateComponent(enablecompletebtn, instance, null, this);
  }
  //end

  //Edit Functionality
  dellPackoutResultCodeAndTimeout() {
    let parentuuid = this.contextService.getDataByKey("dellPackoutCheckAccessUUID" + "ref"); //current taskpanel uuid
    let currentWC = this.contextService.getDataByKey("currentWC");
    if (parentuuid != undefined) {
      let MendatoryFlag = parentuuid.instance.isMandatory; // for isMandatory Task only we need to disable
      if (MendatoryFlag === true) {

        let validatetaskpanelstatus = this.contextService.getDataByKey(currentWC + "validatetaskpanelstatus"); // used some flag so that after completing all the task panels this flag will be true
        if (validatetaskpanelstatus == true) {
          let ResultCodes = {
            "type": "updateComponent",
            "config": {
              "key": "dellPackOutResultCodesUUID",
              "properties": {
                "disabled": true
              }
            },
            "eventSource": "click"
          }
          this.componentService.handleUpdateComponent(ResultCodes, null, null, this);
          let Timeout = {
            "type": "updateComponent",
            "config": {
              "key": "dellPackoutResponseTimeoutUUID",
              "properties": {
                "disabled": true
              }
            },
            "eventSource": "click"
          }
          this.componentService.handleUpdateComponent(Timeout, null, null, this);
        }
      }
    }
  }

  handledateFormat(action, instance) {
    let contextData;
    if (action.config.source.startsWith('#')) {
      contextData = this.contextService.getDataByString(action.config.source);
    }

    if (contextData) {
      if (contextData[action.config.dateKey]) {
        contextData[action.config.dateKey] = this.datePipe.transform(
          contextData[action.config.dateKey],
          action.config.format
        );
      }

      if (contextData[action.config.targetKey]) {
        let text = '';
        if (+contextData[action.config.targetKey] === 0) {
          text = 'day';
          this.contextService.addToContext(
            'receiptDateTitle',
            'sidenav-due body2 date-green'
          );
          this.contextService.addToContext(
            'receiptDateborder',
            'sidenav-header heading1 border-green'
          );
        } else if (+contextData[action.config.targetKey] === 1) {
          text = 'day';
          this.contextService.addToContext(
            'receiptDateTitle',
            'sidenav-due body2 date-yellow'
          );
          this.contextService.addToContext(
            'receiptDateborder',
            'sidenav-header heading1 border-yellow'
          );
        } else if (+contextData[action.config.targetKey] >= 2) {
          this.contextService.addToContext(
            'receiptDateTitle',
            'sidenav-due body2 date-red'
          );
          this.contextService.addToContext(
            'receiptDateborder',
            'sidenav-header heading1 border-red'
          );
          text = 'days';
        }
        contextData[action.config.dateKey] = `${contextData[action.config.dateKey]
          } (${contextData[action.config.targetKey]}${text})`;
      } else {
        this.contextService.addToContext(
          'receiptDateTitle',
          'sidenav-due body2'
        );
        this.contextService.addToContext(
          'receiptDateborder',
          'sidenav-header heading1'
        );
      }
    }
  }
  populateEmailSubject(action: any) {
    let accessoriesListString = '';
    if (action.config.isNotaccessories) {
      accessoriesListString = action.config.accessory;
      const repairUnitInfoObj = this.contextService.getDataByKey(action.config.bcnValue);
      const bodyvalue = this.contextService.getDataByString(action.config.personDetails)

      const emailSubjectString = " Problem z wymieniana czescia <" + accessoriesListString + "> w <" + repairUnitInfoObj.ITEM_BCN + ">";
      const bodyString = "Czesc, znalazlem problem z czescia z tematu: " + bodyvalue;

      this.contextService.addToContext(action.config.key, emailSubjectString);
      this.contextService.addToContext(action.config.bodyKey, bodyString);

    } else {
      let missingAccessoriesList = this.contextService.getDataByKey('missingAccessoriesList');
      if (!missingAccessoriesList) {
        missingAccessoriesList = [...this.contextService.getDataByKey('confirmAccessoriesFlexFieldsData')];
        this.contextService.addToContext('missingAccessoriesList', missingAccessoriesList);
      }
      for (let i = 0; i < missingAccessoriesList.length; i++) {

        let accessoryName = this.getProperAccessoryName(missingAccessoriesList[i]);
        if (accessoriesListString === '') {
          accessoriesListString = accessoryName;
        } else {
          accessoriesListString = accessoriesListString + ", " + accessoryName;

        }
      }
      const repairUnitInfoObj = this.contextService.getDataByKey('repairUnitInfo');
      const emailSubjectString = "Problem z akcesorium <" + accessoriesListString + "> w <" + repairUnitInfoObj.ITEM_BCN + ">";
      this.contextService.addToContext('emailSubjectString', emailSubjectString);
    }

  }
  handleMultipleConditionalFilter(action, instance, actionService) {
    if (action && action.config) {
      let condition;

      if (action.config.multi === true) {
        let bools = [];

        const triggerConditionFn = (conds, operator, index) => {
          conds && conds.forEach((rec, ind) => {
            let cond, boolIndex = ((index === 0) || index) ? index : ind;
            bools[boolIndex] = (bools[boolIndex] || []);

            const applyCondition = (bool) => {
              let subCond;

              if ((rec.operator === "OR") && (rec.subconditions)) {
                subCond = triggerConditionFn(rec.subconditions, rec.operator, ind);
              } else if ((rec.operator === "AND") && (rec.subconditions)) {
                subCond = triggerConditionFn(rec.subconditions, rec.operator, ind);
              } else if (bools[boolIndex] !== bool) {
                subCond = actionService.isConditionValid(rec, instance);
              } else {
                //do nothing
              }

              return subCond;
            };

            if (operator === "OR") {
              cond = applyCondition(true);
            } else {
              cond = applyCondition(false);
            }

            if (cond !== undefined) {
              bools[boolIndex].push(cond);
            }
          });
        };

        triggerConditionFn(action.config.conditions, action.config.operator, undefined);

        const isBoolCond = (operator, rec) => {
          let subCond;

          if (operator === "OR") {
            rec.forEach((v) => {
              if (v) { subCond = "true"; }
            });
          } else {
            rec.forEach((v) => {
              if (v === false) { subCond = "false"; }
            });

            if (subCond !== "false") {
              subCond = "true";
            }
          }

          return subCond;
        };

        bools && bools.forEach((r, i) => {
          if (action.config.conditions && action.config.conditions[i]) {
            bools[i] = (isBoolCond(action.config.conditions[i].operator, r) === "true") ? true : false;
          }
        });

        condition = (isBoolCond(action.config.operator, bools) === "true" ? true : false);
      } else {
        condition = actionService.isConditionValid(action.config, instance);
      }

      if (action && action.responseDependents) {
        if (condition) {
          action.responseDependents.onSuccess && action.responseDependents.onSuccess.actions.forEach((ele) => {
            actionService.handleAction(ele, instance);
          });
        } else if (action.responseDependents.onFailure != undefined) {
          action.responseDependents.onFailure && action.responseDependents.onFailure.actions.forEach((ele) => {
            actionService.handleAction(ele, instance);
          });
        } else {
          //do nothing
        }
      }
    }
  }

  addValuesToRadioGroup(action, instance) {
    let key = action.config.key;
    let radioButtonOption = [];
    let dataSource;
    let dataSourceName = "";
    if (action.config.properties.dataSource !== undefined && action.config.properties.dataSource.startsWith('#')) {
      dataSourceName = action.config.properties.dataSource;
      dataSource = this.contextService.getDataByString(action.config.properties.dataSource);
    }
    else {
      dataSource = action.config.properties.dataSource;
    }
    if (dataSource && dataSource.length > 0) {
      dataSource.forEach(optionVal => {
        let obj = {};
        if (typeof optionVal === "string") {
          obj["value"] = optionVal;
          obj["checked"] = false;
        } else if (typeof optionVal === "object") {
          obj = optionVal;
          obj["checked"] = false;
        }
        // console.log(optionVal.value);
        radioButtonOption.push(obj);
        // console.log(radioButtonOption);
      })

    }
    if (key !== undefined && key.startsWith('#')) {
      key = this.contextService.getDataByString(key);
    }
    this.contextService.addToContext(key, radioButtonOption);
    dataSourceName = dataSourceName.replace(/#/gi, "");
    this.contextService.addToContext(dataSourceName, radioButtonOption);
  }

  updateDynamicAllPanels(action, instance, actionService) {
    if (action && action.config) {
      const actionConfig = action.config;
      const data = actionService.getContextorNormalData(actionConfig.data, []);

      //@loop through each item to create the given component
      data.length && data.forEach((rec, i) => {
        let config: any = actionConfig.actions;

        //@obj -> string convertion
        config = JSON.stringify(config);

        for (let k = 0; k <= data.length; k++) {
          let regex = `#@${k}`;

          config = config.replace(new RegExp(regex, "g"), (i + k));
        }

        //@index automation
        config = config.replace(/#@/g, i);

        rec && Object.keys(rec).forEach((key) => {
          const regex: any = `#_${key}`;

          config = config.replace(new RegExp(regex, "g"), (rec[key] || ""));
        });

        config = JSON.parse(config);

        actionService.handleAction(config, instance);
      });
    }
  }

  onFilterWith(config) {
    let contextData = [], filterData = [];

    if (config.data != undefined && config.data.startsWith('#')) {
      contextData = this.contextService.getDataByString(config.data);
    } else {
      contextData = config.data;
    }

    filterData = contextData.filter((val) => val !== config.filterValue);

    this.contextService.addToContext(config.updateContextKey, filterData);
  }

  onIdleInitiative() {
    this.contextService.addToContext("idleTimeStarted", true);

    this.bnIdle.startWatching(600).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {

        this.bnIdle.stopTimer();
      }
    });
  }

  handleFindIdentificatorType(action, instance, actionService) {
    let unitIdentificationValue = action.config.unitIdentificationValue;
    let charRegex = /^[A-Za-z]+$/;
    let numberRegex = /^[0-9]+$/;
    let unitIdentificationType = "SerialNumber";  //Setting default value
    let firstThreeChar
    let firstFourChar

    if (unitIdentificationValue && unitIdentificationValue != undefined) {
      unitIdentificationValue = this.contextService.getDataByString(unitIdentificationValue);
      firstThreeChar = unitIdentificationValue.substring(0, 3);
      firstFourChar = unitIdentificationValue.substring(0, 4);
    }

    if (unitIdentificationValue.length >= 4) {
      if (!action.config.wc || action.config.wc == undefined) {
        if (firstThreeChar == "BCN") {
          unitIdentificationType = "BCN";
        } else if (charRegex.test(firstFourChar)) {
          unitIdentificationType = "FixedAssetTag";
        } else if (numberRegex.test(unitIdentificationValue[3])) {
          unitIdentificationType = "SerialNumber";
        }
        this.contextService.addToContext(action.config.key, unitIdentificationType);

      } else if (action.config.wc && action.config.wc == "CISCO") {
        if (firstThreeChar == "BCN") {
          unitIdentificationType = "BCN";
        } else {
          unitIdentificationType = "SerialNumber";
        }
        unitIdentificationValue = this.contextService.getDataByString("#" + action.config.key);
        unitIdentificationValue[action.config.objectKey] = unitIdentificationType;
        this.contextService.addToContext(action.config.key, unitIdentificationValue);
      } else if (action.config.wc && action.config.wc == "DELL CAR") {

        if (firstThreeChar == "BCN") {
          unitIdentificationType = "BCN";
        } else if (unitIdentificationValue.length == 7 && numberRegex.test(unitIdentificationValue) && charRegex.test(unitIdentificationValue)) {
          unitIdentificationType = "SerialNumber";
        } else if (unitIdentificationValue.length == 11 && numberRegex.test(unitIdentificationValue)) {
          unitIdentificationType = "FixedAssetTag";
        }
        unitIdentificationValue = this.contextService.getDataByString("#" + action.config.key);
        unitIdentificationValue[action.config.objectKey] = unitIdentificationType;
        this.contextService.addToContext(action.config.key, unitIdentificationValue);
      }
    }
  }

  _saveAndExitApiCall(actionService, contextDataKey = '#screenNameData') {
    const data = this.contextService.getDataByString(contextDataKey);
    if (data) {
      const saveAndExitApi = {
        type: 'microservice',
        config: {
          microserviceId: 'saveJsonResponse',
          isLocal: false,
          LocalService: 'assets/Responses/getSearchCriteria.json',
          requestMethod: 'post',
          body: {
            itemId: '#repairUnitInfo.ITEM_ID',
            TrackingNo: '#userSearchCriteria.scan',
            userName: '#userAccountInfo.PersonalDetails.USERID',
            pagePayload: contextDataKey,
          },
          toBeStringified: true,
        },
        eventSource: 'click',
        responseDependents: {
          onSuccess: {
            actions: [
              {
                type: 'context',
                config: {
                  key: 'screenArrData',
                  requestMethod: 'delete',
                },
              },
              {
                type: 'context',
                config: {
                  key: 'screenNameData',
                  requestMethod: 'delete',
                },
              },
              {
                type: 'context',
                config: {
                  key: 'getJsonReponse',
                  requestMethod: 'delete',
                },
              },
            ],
          },
          onFailure: {
            actions: [
              {
                type: 'updateComponent',
                config: {
                  key: 'errorTitleUUID',
                  properties: {
                    titleValue: 'Search Criteria is not Configured',
                    isShown: true,
                  },
                },
              },
            ],
          },
        },
      };
      actionService.handleAction(saveAndExitApi, this);
    }
  }

  onePrintAPICallLoop(config, instance, actionService) {
    let data = this.contextService.getDataByKey(config.data);

    if (data && data.length > 0) {
      data.forEach((item, index) => {
        const templates = [
          {
            "type": "microservice",
            "config": {
              "microserviceId": "onePrint",
              "requestMethod": "post",
              "body": {
                "locationId": "#userSelectedLocation",
                "clientId": "#userSelectedClient",
                "contractId": "#userSelectedContract",
                "warehouseId": "0",
                "routeCode": "WRP",
                "workCenterId": "0",
                "eventName": item.printTemplate,
                "hostName": "#getHostNameResponse.hostName",
                "ip": "#getHostNameResponse.ip",
                "userName": "#userAccountInfo.PersonalDetails.USERID",
                "params": {
                  "kirus-shipmentId": "#shippingShipmentID"
                }
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
              "onFailure": {
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
                  },
                  {
                    "type": "clearScreenData"
                  }
                ]
              }
            }
          }];

        templates.forEach((ele) => {
          actionService.handleAction(ele, instance);
        });
      });
    }
  }
  handleOnePrintApi(config, instance, actionService) {
    let onePrintApi;
    this.contextService.addToContext("shippingOneprintApiSuccessLength", 0);
    const printTempelateNames = this.contextService.getDataByKey(config.data);
    printTempelateNames && printTempelateNames.forEach((item, index) => {
      onePrintApi = {
        "type": "microservice",
        "config": {
          "microserviceId": "onePrint",
          "requestMethod": "post",
          "body": {
            "locationId": "#userSelectedLocation",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "warehouseId": "0",
            "routeCode": "WRP",
            "workCenterId": "0",
            "eventName": item.printTemplate,
            "hostName": "#getHostNameResponse.hostName",
            "ip": "#getHostNameResponse.ip",
            "userName": "#userAccountInfo.PersonalDetails.USERID",
            "params": {
              "kirus-shipmentId": "#shippingShipmentID"
            }
          },
          "toBeStringified": true
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "countDetetection",
                "config": {
                  "source": "#shippingOneprintApiSuccessLength",
                  "key": "shippingOneprintApiSuccessLength",
                  "type": "inc"
                },
                "eventSource": "click"
              }, {
                "type": "condition",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": printTempelateNames.length,
                  "rhs": "#shippingOneprintApiSuccessLength"
                },
                "eventSource": "click",
                "responseDependents": {
                  "onSuccess": {
                    "actions": [{
                      "type": "microservice",
                      "config": {
                        "microserviceId": "getStAbbrevCode",
                        "requestMethod": "get",
                        "params": {
                          "outBoundOrderId": "#shippingOutBoundOrderId",
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
                              "key": "shippingAbbrevCodeData",
                              "data": "responseData"
                            }
                          }, {
                            "type": "microservice",
                            "config": {
                              "microserviceId": "getShippingTermsDetails",
                              "requestMethod": "get",
                              "params": {
                                "outBoundOrderId": "#shippingOutBoundOrderId",
                                "tradingPartnerId": "#shippingTradingPartnerId",
                                "abbrevCode": "#shippingAbbrevCodeData.abbrevCode",
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
                                    "data": "responseArray"
                                  }
                                }, {
                                  "type": "microservice",
                                  "eventSource": "click",
                                  "config": {
                                    "microserviceId": "getDestinationPallet",
                                    "requestMethod": "get",
                                    "params": {
                                      "outBoundOrderId": "#shippingOutBoundOrderId",
                                      "tradingPartnerId": "#shippingTradingPartnerId",
                                      "abbrevCode": "#shippingAbbrevCodeData.abbrevCode",
                                      "userName": "#loginUUID.username"
                                    }
                                  },
                                  "responseDependents": {
                                    "onSuccess": {
                                      "actions": [{
                                        "type": "context",
                                        "eventSource": "click",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": "shippingDestinationPalletData",
                                          "data": "responseData"
                                        }
                                      }]
                                    },
                                    "onFailure": {
                                      "actions": [{
                                        "type": "context",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": "errorMsg",
                                          "data": "responseData"
                                        }
                                      }, {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "errorTitleUUID",
                                          "properties": {
                                            "titleValue": "#errorMsg",
                                            "isShown": true
                                          }
                                        }
                                      }]
                                    }
                                  }
                                }, {
                                  "type": "microservice",
                                  "config": {
                                    "microserviceId": "getManifestFfValues",
                                    "requestMethod": "get",
                                    "params": {
                                      "shipmentId": "#shippingShipmentID",
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
                                          "key": "shippingManifestFfValues",
                                          "data": "responseData"
                                        }
                                      }, {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "shippingPanelUUID",
                                          "properties": {
                                            "expanded": false,
                                            "disabled": false,
                                            "header": {
                                              "title": "Ship",
                                              "icon": "description",
                                              "statusIcon": "check_circle",
                                              "statusClass": "complete-status",
                                              "class": "complete-task",
                                              "iconClass": "complete-task"
                                            }
                                          }
                                        },
                                        "eventSource": "click"
                                      }, {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "manifestPanelUUID",
                                          "properties": {
                                            "expanded": true,
                                            "disabled": false,
                                            "header": {
                                              "title": "Manifest",
                                              "icon": "description",
                                              "iconClass": "active-header",
                                              "class": "active-header "
                                            }
                                          }
                                        },
                                        "eventSource": "click"
                                      }, {
                                        "type": "updateComponent",
                                        "eventSource": "click",
                                        "config": {
                                          "key": "shipCompleteUUID",
                                          "properties": {
                                            "disabled": true
                                          }
                                        }
                                      }]
                                    },
                                    "onFailure": {
                                      "actions": [{
                                        "type": "context",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": "errorMsg",
                                          "data": "responseData"
                                        }
                                      }, {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "errorTitleUUID",
                                          "properties": {
                                            "titleValue": "#errorMsg",
                                            "isShown": true
                                          }
                                        }
                                      }]
                                    }
                                  }
                                }]
                              },
                              "onFailure": {
                                "actions": [{
                                  "type": "context",
                                  "config": {
                                    "requestMethod": "add",
                                    "key": "errorMsg",
                                    "data": "responseData"
                                  }
                                }, {
                                  "type": "updateComponent",
                                  "config": {
                                    "key": "errorTitleUUID",
                                    "properties": {
                                      "titleValue": "#errorMsg",
                                      "isShown": true
                                    }
                                  }
                                }]
                              }
                            }
                          }]
                        },
                        "onFailure": {
                          "actions": [{
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "errorMsg",
                              "data": "responseData"
                            }
                          }, {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorMsg",
                                "isShown": true
                              }
                            }
                          }]
                        }
                      }
                    }]
                  },
                  "onFailure": {
                    "actions": []
                  }
                }
              }]
          },
          "onFailure": {
            "actions": [{
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "onePrintResponse",
                "data": "responseData"
              }
            }, {
              "type": "updateComponent",
              "config": {
                "key": "errorTitleUUID",
                "properties": {
                  "titleValue": "#onePrintResponse",
                  "isShown": true
                }
              }
            },
            {
              "type": "clearScreenData"
            }]
          }
        }
      };
      actionService.handleAction(onePrintApi, instance);
    });
  }

  checkForReceivingBatch(action, instance, actionService) {
    let config = action.config;
    if (config && config != undefined) {
      if (config.data) {
        let data = this.contextService.getDataByKey(config.data);
        if (data.length > 0) {
          if (data[0].customerResponse && data[0].customerResponse != undefined) {
            let addFlexfieldsAction = [
              {
                "type": "context",
                "config": {
                  "requestMethod": "addToExistingContext",
                  "target": config.addToKey,
                  "sourceData": {
                    "Name": "BATCH",
                    "Value": data[0].customerResponse
                  }
                }
              }
            ];

            addFlexfieldsAction.forEach((ele) => {
              actionService.handleAction(ele, instance);
            });
          }
        }
      }
    }

  }

  modifyTheDellBinNotes(action, actionService, instance) {
    let discrepancyUnitInfo = this.contextService.getDataByString("#discrepancyUnitInfo");
    this.contextService.dellBinNotes = this.contextService.getDataByString("#dell" + discrepancyUnitInfo.WORKCENTER + "BinNotes");
    let dellBinUUIDRef = this.contextService.getDataByKey("dellBinUUIDref");
    if (dellBinUUIDRef && dellBinUUIDRef.instance && dellBinUUIDRef.instance.group) {
      dellBinUUIDRef.instance.group.controls["binNote"].setValue(this.contextService.dellBinNotes["binNote"]);
      dellBinUUIDRef.instance._changeDetectionRef.detectChanges();
    }
  }

  /**
 * This method will iterate the footer of page component and
 * pushes the bin button just befor the spacer.
 *  */
  addBinButton(footer: any, discrepancyUnitInfo): any {
    footer.forEach((element, index) => {
      let isItemAdded = false;
      let indexToBepushed = 0;
      element.items && element.items.map((eachItem, i) => {
        if (eachItem.ctype === "spacer" && !isItemAdded) {
          indexToBepushed = i;
          isItemAdded = true;
        }
      });

      element.items.splice(indexToBepushed, 0, this._binButton(discrepancyUnitInfo));
      footer[index] = element;
    });
    return footer;
  }


  /// Returns the button component
  private _binButton(discrepancyUnitInfo): any {
    return {
      "ctype": "iconText",
      "uuid": "dellBinUUID",
      "icon": "delete",
      "disabled": false,
      "text": "",
      "textCss": "",
      "iconPosition": "Before",
      "iconTextClass": "footer-bin body",
      "actions": [
        {
          "type": "dialog",
          "uuid": "dellBinDialogUUID",
          "config": {
            "title": "Bin",
            "items": [
              {
                "ctype": "textarea",
                "name": "binNote",
                "textareaClass": "note-class",
                "uuid": "dellBinUUID",
                "required": true,
                "disabled": false,
                "value": this.contextService.dellBinNotes["binNote"],
                "hooks": [
                  {
                    "type": "modifyTheDellBinNotes",
                    "dellBinUUID": "dellBinUUID",
                    "hookType": "afterInit"
                  }
                ],
                "actions": [
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "binNote",
                      "data": "elementControlValue"
                    },
                    "eventSource": "input"
                  }
                ]
              }
            ],
            "footer": [
              {
                "ctype": "button",
                "color": "primary",
                "text": "Cancel",
                "uuid": "dellBinCancelUUID",
                "closeType": "close",
                "disableClose": true,
                "visibility": true,
                "disabled": false,
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
                "uuid": "dellBinDoneButtonUUID",
                "dialogButton": true,
                "visibility": true,
                "disabled": true,
                "type": "submit",
                "closeType": "success",
                "hooks": [],
                "validations": [],
                "actions": []
              }
            ]
          },
          "eventSource": "click",
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "key": "dell" + discrepancyUnitInfo.WORKCENTER + "BinNotes",
                    "data": "formData",
                    "requestMethod": "add"
                  }
                },
                {
                  "type": "modifyTheDellBinNotes",
                  "dellBinUUID": "dellBinUUID",
                },
                {
                  "type": "microservice",
                  "eventSource": "click",
                  "config": {
                    "microserviceId": "performRemovePartsPageComp",
                    "requestMethod": "post",
                    "body": {
                      "changeSerialNumberRequest": {
                        "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                        "mustBeOnHoldInd": 0,
                        "releaseIfHoldInd": 0,
                        "mustBeTimedInInd": 1,
                        "timedInWorkCenter": "#discrepancyUnitInfo.WORKCENTER",
                        "inventoryAttributes": {
                          "flexField": [
                            {
                              "name": "BIN",
                              "value": "#dell" + discrepancyUnitInfo.WORKCENTER + "BinNotes.binNote"
                            }
                          ]
                        }
                      },
                      "userName": "#loginUUID.username",
                      "password": "#loginUUID.password",
                      "ip": "::1",
                      "callSource": "FrontEnd",
                      "apiUsage_LocationName": "#UnitInfo.GEONAME",
                      "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                    },
                    "toBeStringified": true
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": []
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
            },
            "onFailure": {
              "actions": []
            }
          }
        }
      ]
    };
  }

  updateValues(action) {
    let discrepancyUnitInfo = action.discrepancyUnitInfo;
    let wcFF = this.contextService.getDataByKey("getFFByWcPageComponent");
    wcFF && wcFF.forEach((item) => {
      if (item.ffName.toLowerCase() === "bin") {
        let notes = {
          "binNote": item.ffValue != null && item.ffValue != undefined ? item.ffValue : ""
        }
        this.contextService.dellBinNotes = notes;
        this.contextService.addToContext("dell" + discrepancyUnitInfo.WORKCENTER + "BinNotes", notes);
      }
    });
  }

  /// This method will filter the records only for table with search and
  /// sort component, it will search based on the param on which we need filter
  updateSearchValues(action) {
    let searchValue = this.contextService.getDataByString(action.config.data);
    let ref = this.contextService.getDataByKey(action.config.key + "ref");
    if (ref && ref.instance && ref.instance.datasource) {
      if (searchValue !== undefined) {
        let data = ref.instance.dataForFiltering.filter(item =>
          item[action.config.searchBy].toLocaleLowerCase().includes(searchValue.trim().toLocaleLowerCase()));
        ref.instance.datasource = new MatTableDataSource(data);
        ref.instance._changeDetectionRef.detectChanges();
        if (data && data.length === 1 && action.config.isEnterClicked) {
          this.contextService.addToContext(action.config.keyToSave, data[0]);
        }
      }
    }
  }

  /// Method used to update the menu list in dashboard
  updateMenuList(action: any, instance: any, actionService) {
    let homeMenuData = this.contextService.getDataByKey(action.config.data);
    let menuListRef = this.contextService.getDataByKey(action.config.updateUUID + 'ref');
    let userSelectedClient = this.contextService.getDataByKey("userSelectedClient");
    let userSelectedClientName = this.contextService.getDataByKey("userSelectedClientName");
    let userSelectedContract = this.contextService.getDataByKey("userSelectedContract");
    let userSelectedContractName = this.contextService.getDataByKey("userSelectedContractName");
    let userSelectedSubProcessType = this.contextService.getDataByKey("userSelectedSubProcessType");
    let userSelectedLocation = this.contextService.getDataByKey("userSelectedLocationName");
    let menuList = [];

    if (userSelectedClient === "75867" && userSelectedContract === "12528" && userSelectedSubProcessType === "WC OPERATION") {
      // menuList = homeMenuData !== null ? homeMenuData : [];
      homeMenuData && homeMenuData.map((item) => {
        if (item.name.toLowerCase() == "batch processes" || item.name.toLowerCase() == "home") {
          if (item.name.toLowerCase() === "batch processes") {
            item.options = "#getBatchWC";
          }
          menuList.push(item);
        }
      })
    } else if (userSelectedClient === "75867" && (userSelectedContract === "12528" || userSelectedContract === "12987") && userSelectedSubProcessType.toLowerCase() === "receiving") {
      // menuList = homeMenuData !== null ? homeMenuData : [];
      homeMenuData && homeMenuData.map((item) => {
        if (item.name.toLowerCase() == "home") {
          menuList.push(item);
        }
      })
    } else if ((userSelectedLocation == "Szombathely" || userSelectedLocation == "Louisville") && userSelectedClientName === "CISCO" && (userSelectedContractName === "REPAIR HUNGARY" || userSelectedContractName === "REPAIR LOUISVILLE") && userSelectedSubProcessType === "WC OPERATION") {
      menuList = homeMenuData !== null ? homeMenuData : [];
    } else if ((userSelectedLocation == "Szombathely" || userSelectedLocation == "Louisville") && userSelectedClientName === "CISCO" && (userSelectedContractName === "REPAIR HUNGARY" || userSelectedContractName === "REPAIR LOUISVILLE")) {
      menuList = homeMenuData !== null ? homeMenuData : [];
    } else if (userSelectedLocation == "Bydgoszcz" && userSelectedClient == 17302 && userSelectedContract == 10375 && userSelectedSubProcessType == 'SHIPPING') {
      menuList = homeMenuData !== null ? homeMenuData : [];
    } else {
      homeMenuData && homeMenuData.map((item) => {
        if (item.name.toLowerCase().includes("kardex")) {
          menuList.push(item);
        }
        if (item.name.toLowerCase().includes("wiki")) {
          menuList.push(item);
        }
      })
    }
    let isObjectPresentHome = menuList.find((o) => o.name.toLowerCase() === "home");
    if (!isObjectPresentHome) {
      menuList.splice(0, 0, { name: "Home", id: "0", desc: "Home", url: "Home", isActive: "true", children: null, displayOrder: null, processJsonString: null, icon: "home" });
    }
    let isObjectPresent = menuList.find((o) => o.name === "View eTraveller");
    if (!isObjectPresent) {
      menuList.splice(1, 0, { name: "View eTraveller", id: "999999", desc: "E-Traveller", url: "E-Traveller", isActive: "true", children: null, displayOrder: null, processJsonString: null, icon: "description" });
    }
    this.contextService.addToContext(action.config.keyToSave, menuList);
    if (menuListRef && menuListRef.instance) {
      menuListRef.instance.items = menuList;
      menuListRef.instance.iconList = ["description"];
      menuListRef.instance._changeDetectionRef.detectChanges();
      let arr = [
        {
          "type": "updateComponent",
          "hookType": "afterInit",
          "config": {
            "key": "menuListItemUUID",
            "properties": {
              "isVisible": true,
              "items": menuList,
              "defaultMenu": "Home"
            }
          }
        }
      ];

      actionService.handleAction(arr);
    }
  }

  /// This will render the kardex screen
  handleKardexPageRendering(action: any, actionService, instance: any) {
    let data = this.contextService.getDataByKey('HomeMenu');
    let selectedHomeMenuId = this.contextService.getDataByKey('selectedHomeMenuId');
    data && data.map((item) => {
      if (selectedHomeMenuId && item.id && item.id === selectedHomeMenuId) {
        let DellDesktopKardexJSON = JSON.parse(item.processJsonString);
        this.contextService.addToContext("kardexProcessJson", DellDesktopKardexJSON.dellDesktop);
        this.contextService.addToContext("LoadKardexdesktop", DellDesktopKardexJSON.LoadKardex);
        this.contextService.addToContext("UnLoadKardexdesktop", DellDesktopKardexJSON.UnLoadkardex);
        actionService.handleAction({
          "type": "renderTemplate",
          "config": {
            "mode": "remote",
            "targetId": "mainPageContentBody",
            "templateId": "kardexProcessJson"
          }
        }, instance);
      }
    })
  }

  handleDataFormationForDraft(action: any, actionService: any, instance: any) {
    let wholeData = []
    if (Array.isArray(action.data)) {
      wholeData = action.data || [];
    } else if (typeof (action.data) == "string") {
      wholeData = this.contextService.getDataByKey(action.data);
    } else {
      wholeData = [];
    }
const arrData=wholeData;
    let ArrToBeFormate = [{ "key": "wikiLocation", "value": "LOCATION_NAME" }, { "key": "wikiContract", "value": "CONTRACT_NAME" }, { "key": "wikiClient", "value": "CLIENT_NAME" }, { "key": "wikiWorkCenter", "value": "WORKCENTER" }, { "key": "instrLangData", "value": "viewValue" }, { "key": "levelOfExpData", "value": "employee_level" }, { "key": "typeOfInstData", "value": "viewValue" }, { "key": "wikiAdminWorkCenter", "value": "WORKCENTER_NAME" }]
    let Arr = []
    arrData && arrData.length && arrData.map((eachSubArr) => {
      let obj = {}
      eachSubArr.jsonResponseData.map((eachobj) => {
        const loginLocation = ArrToBeFormate.find(item => item.key === eachobj.name);
        if (loginLocation) {
          eachobj.value && eachobj.value.length && eachobj.value.map((data) => {
            let obj = {};
            if (data[loginLocation.value]) {
              data["name"] = data[loginLocation.value]
            } else {
              obj["name"] = data;
              eachobj["value"] = [obj]
            }
          })
        }
        if (eachobj.value) {
          Array.isArray(eachobj.value)
          let str = ""
          Array.isArray(eachobj.value) && eachobj.value && eachobj.value.length && eachobj.value.map((data) => {
            if (data['name']) {
              str = str ? str + data['name'] + "," : data['name'] + ",";
            }
          });
          if (str) {
            str = str.slice(0, str.length - 1)
            obj[eachobj.name] = str
          } else {
            obj[eachobj.name] = eachobj.value
          }
        }
      })
      if (obj["wikiAdminWorkCenter"]) {
        obj["wikiWorkCenter"] = obj["wikiAdminWorkCenter"]
      }
      obj["UserName"] = this.contextService.getDataByString("#userAccountInfo.PersonalDetails.USERID")
      Arr.push(obj)
    })
    // this.contextService.addToContext("DraftData",Arr)
    actionService.handleAction({
      "type": "updateComponent",
      "config": {
        "key": action.uuid,
        "fieldProperties": {
          "dataSource": Arr
        }
      }
    }, instance);
  }
  

  getLogedinUseRoles(action, instance, contextService) {
    const getHomeMenuObj = this.contextService.getDataByString("#HomeMenu");
    const rbacConfig = getHomeMenuObj.find(item => item.name == 'WIKI');
    if (rbacConfig) {
      const rbacConfigObj = JSON.parse(rbacConfig.processJsonString);
      this.contextService.addToContext("wikiRolesMockData", rbacConfigObj);
      let Roles = [];
      let getSLUserRole = this.contextService.getDataByKey("getSLUserRole");
      rbacConfigObj.rbacList.map((roleList) => {
        let roleToBeMatched = Object.keys(roleList)
        let filteredRole = getSLUserRole.find((x) => x.roleName.toLowerCase() === roleToBeMatched[0].toLowerCase());
        if (filteredRole) {
          Roles.push(filteredRole.roleName);
        }
      })
      Roles.map((data) => {
        if (data.includes("Wiki")) {
          this.contextService.addToContext("rolesConfiguredForUser", data);
        }
      })
      this.contextService.addToContext("Roles", Roles);
    }
  }
    
    
  

  decidingMethodTodisplay(addWikiButton) {
    const Roles = this.contextService.getDataByKey("Roles");
    const rbacConfigObj = this.contextService.getDataByKey("wikiRolesMockData");
    let verifiedRole = false
    Roles && Roles.length && Roles.map((eachRole) => {
      rbacConfigObj.rbacList.map((roleList) => {
        let roleToBeMatched = Object.keys(roleList)
        if (roleToBeMatched[0].toLowerCase() == eachRole.toLowerCase()) {
          if (roleList[roleToBeMatched[0]].find((x) => x === addWikiButton)) {
            verifiedRole = true
          }
        }
      })
    })
    return verifiedRole;
  }

  handleDataFormationFor(action, instance, contextService){
    let instanse
    if ( this.contextService.getDataByKey("menuListItemUUIDref") && this.contextService.getDataByKey("menuListItemUUIDref").instance && this.contextService.getDataByKey("menuListItemUUIDref").instance.rightsidenav) {
      instanse = this.contextService.getDataByKey("menuListItemUUIDref").instance.rightsidenav
    }
    this.contextService.addToContext("dashboardWC", "WIKI");
    let DellDesktopKardexJSON=this.contextService.getDataByKey("wikiPageContentBodyData");
    // let DellDesktopKardexJSON = JSON.parse(wikiPageContentBodyData);
    DellDesktopKardexJSON.header.push({
      "ctype": "title",
      "uuid": "subProcessRightNav"
    })
    // DellDesktopKardexJSON.header.forEach((item) => {
      DellDesktopKardexJSON.rightsidenav = instanse;
    // })
    this.contextService.addToContext("wikiPageContentBodyData", DellDesktopKardexJSON);
    let rightsidenav = {
      "ctype": "adminWikiPanel",
      "isAdmin": true,
      "titleValue": "",
      "title": "Work Instructions",
      "titleClass": "workinstrTitle",
      "uuid": "adminWikiInstructionUUID",
      "name": "workInstructionSearch"
    }
    this.contextService.addToContext("rightPanel", rightsidenav);
    contextService.handleAction({
      "type": "renderTemplate",
      "config": {
        "mode": "remote",
        "targetId": "mainPageContentBody",
        "templateId": "wikiPageContentBodyData"
      }
    }, instance);
    contextService.handleAction({
      "type": "renderTemplate",
      "config": {
        "mode": "remote",
        "targetId": "mainPageRightContent",
        "templateId": "rightPanel"
      }
    }, instance);
    // JSON.stringify(DellDesktopKardexJSON)
    console.log(DellDesktopKardexJSON)
  }
  
  // /// This will render the Wiki screen
  handleWikiPageRendering(action: any, actionService, instance: any) {

    let deleteActions = [
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "repairUnitInfo",
          "data": {}
        },
        "eventSource": "click"
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "discrepancyUnitInfo",
          "data": {}
        },
        "eventSource": "click"
      },
      {
        "type": "microservice",
        "hookType": "beforeInit",
        "config": {
          "microserviceId": "getDellCARCustomDetails",
          "requestMethod": "get",
          "params": {
            "subProcessId": "#wcSubprocess.REWORK.subProcessID",
            "userName": "#userAccountInfo.PersonalDetails.USERID"
          },
          "isLocal": true,
          "LocalService": "assets/dellCar_wikiAdmin.json"
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
             
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "wikiPageContentBodyData",
                  "data": "responseData"
                },
                "eventSource": "click"
              },
              {
                "type": "handleCommonServices",
                "config": {
                  "type": "handleDataFormationFor"
                }
              }
            ]
          },
          "onFailure": {
            "actions": [
              {
                "type": "toast",
                "message": "Failed to fetch rework JSON"
              }
            ]
          }
        }
      }
    ]
    deleteActions.forEach(element => {
      actionService.handleAction(element);
    });
  }

  /// This method will execute the apis in sequence and after the execution of all the APIs
  /// Then only it will proceeed for next step
  combinelatestApirequest(apiList, callBack, callBackParams, actionService) {
    let microServiceList: Array<Observable<any>> = [];
    let apiIds = [], componentActionList = [];

    if (apiList && apiList.length > 0) {
      apiList.map(
        (n: any) => {
          const paramsObj = Object.assign({}, n.config.params);
          let bodyObj = this.contextService.getParsedObject(paramsObj, this);
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
        response.map((result: any) => {
          if (result.status) {
            this.contextService.addToContext(apiIds[count] + count, result.data);
            console.log(apiIds[count] + count)
            if (count === apiList.length - 1) {
              callBack && callBack(callBackParams, this.contextService, actionService);
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
    } else {
      callBack && callBack(callBackParams, this.contextService, actionService);
    }
  }


  EditFuncDrawbackSol(action, instance, actionService) {
    let repairUnitInfo = this.contextService.getDataByString("#discrepancyUnitInfo");
    let currentWC = this.contextService.getDataByKey("currentWC");
    if (repairUnitInfo.CLIENTNAME === "DELL" && (repairUnitInfo.CONTRACTNAME === "DELL AIO" || repairUnitInfo.CONTRACTNAME === "CAR")) {
      let refData = this.contextService.getDataByKey("pageUUIDref");
      const pageFooterTaskpanels = refData.instance && refData.instance.footer[0] && refData.instance.footer[0].items.find(eachItem => eachItem.ctype == "nativeDropdown");
      let myData = this.contextService.getDataByKey("getSaveAndExitData");
      let menuItems = this.contextService.getDataByKey("menuItems");
      let wc = menuItems && menuItems.filter(({ name }) => name == currentWC);
      if (wc && wc.length > 0) {
        for (let i = 0; i < wc.length; i++) {
          if (!wc[i].is2ndVisit && wc[i].name == currentWC) {
            let ValidationData;
            if (myData) {
              myData && myData.find(function (element) {
                Object.keys(element).forEach((key) => {
                  if (key == currentWC) {
                    return ValidationData = element[key];
                  }
                })
              });
              if (ValidationData) {
                let data = JSON.parse(ValidationData);
                let finalData = data && data.filter(({ key }) => key == action.config.resultcodeUUID || key == action.config.timeoutUUID);
                if (finalData && finalData.length > 0) {
                  for (let i = 0; i < finalData.length; i++) {
                    if (finalData[i].key == action.config.resultcodeUUID) {
                      let compref = this.contextService.getDataByKey(action.config.resultcodeUUID + "ref");
                      let ResultCode = {
                        "type": "updateComponent",
                        "config": {
                          "key": action.config.resultcodeUUID,
                          "properties": {
                            "disabled": finalData[i].value.disabled
                          }
                        }
                      }
                      this.componentService.handleUpdateComponent(ResultCode, null, null, this);
                    }
                    else {
                      let timeoutref = this.contextService.getDataByKey(action.config.timeoutUUID + "ref");
                      timeoutref.instance.disabled = finalData[i].value.disabled;
                      timeoutref.instance._changeDetectionRef.detectChanges();
                    }
                  }
                }
              }
            }
          }
        }

      }


    }

  }

  /// For get requests
  async getApiCallUsingPromise(body, microserviceId) {
    let valueString = "";
    Object.keys(body).map((x, i) => {
      let currentString = "";
      if (body[x].startsWith("#")) {
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
              properties['titleValue'] = response.body ? response.body['message'] : response['message'];
              properties['isShown'] = microserviceId == "getAlternetPart" ? false : true;
              Object.assign(compRef.instance, properties);
              compRef.instance._changeDetectionRef.detectChanges();
              // reject(response);
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

  checkForIssuedParts(action: any, instance: any, actionService: any) {
    let actions = [];
    let getPreviousWCFAHistoryData = this.contextService.getDataByKey("getPreviousWCFAHistorydata");
    let location = this.contextService.getDataByKey("userSelectedLocation");
    let callBackParams = {};
    getPreviousWCFAHistoryData && getPreviousWCFAHistoryData.map((item, index) => {
      item["index"] = index;
      item["length"] = getPreviousWCFAHistoryData.length;
      actions.push({
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getCompByAction",
          "requestMethod": "get",
          "isDisplayErrorMessage": false,
          "params": {
            "actionId": item.actionId,
            "userName": "#userAccountInfo.PersonalDetails.USERID"
          },
          "isLocal": false,
          "LocalService": "assets/Responses/getCompByActionRes.json"
        },
        "responseDependents": {
          "onSuccess": {
            "actions": []
          },
          "onFailure": {
            "actions": []
          }
        }
      });
    })
    callBackParams["itemList"] = actions;
    //callBackParams["action"] = action;
    callBackParams["location"] = location;
    this.combinelatestApirequest(actions, this.filterPPIDForIssuedParts, callBackParams, actionService);
  }

  filterPPIDForIssuedParts(callBackParams, contextService, actionService) {
    let issuedPartsData = [];
    let itemList = callBackParams["itemList"];
    let action = callBackParams["action"];
    let location = callBackParams["location"];
    itemList && itemList.map((x, index) => {
      let getCompByActionData = contextService.getDataByKey(x.config.microserviceId + index);
      getCompByActionData && getCompByActionData.map((data) => {
        if (data.TRX_TYPE.toLowerCase() === "issued") {
          if (location === "1244" && data.COMPONENT_LOCATION && data.COMPONENT_LOCATION != "") {
            issuedPartsData.push(data.COMPONENT_LOCATION);
          } else if (data.COMPONENT_SN && data.COMPONENT_SN != "") {
            issuedPartsData.push(data.COMPONENT_SN);
          }
        }
      })
    })
    console.log(issuedPartsData)
    let missingAccessoriesList = contextService.getDataByKey('checkAccesorysdata');
    let PPIDComments = missingAccessoriesList && missingAccessoriesList.find(element => element.FF_VALUE.toLowerCase() == "adapter" || element.FF_VALUE.includes("Adapter"));
    //let keys = PPIDComments && Object.keys(PPIDComments);
    let PPIDKey = PPIDComments.PPID_Comments
    issuedPartsData && issuedPartsData.map((issuedItem) => {
      let obj = {};
      obj["HASHCODE"] = issuedItem;
      obj["FF_VALUE"] = "Ac Adaptor";
      obj["PPID_Comments"] = PPIDKey;
      missingAccessoriesList.push(obj)
    })
    contextService.addToContext("issuedPartsDataforDellPackout", issuedPartsData);
    contextService.addToContext('checkAccesorysdata', missingAccessoriesList);
  }

  checkIfValidAccessory(action: any, instance: any, actionService: any) {
    this.dellPackoutResultCodeAndTimeout();
    let currentfeildInstanceValue = instance.group.value[instance.name]
    let currentfeildInstanceuuid = instance.uuid;
    let index = parseInt(currentfeildInstanceuuid.charAt(0));
    let currentTextFieldRef = this.contextService.getDataByKey(index + "newNoUUID" + "ref");
    let enteredHashCode = "";
    if (currentTextFieldRef && currentTextFieldRef.instance.group) {
      enteredHashCode = currentTextFieldRef.instance.group.controls[currentTextFieldRef.instance.name].value;
    }
    enteredHashCode = enteredHashCode ? enteredHashCode : "";
    this.contextService.addToContext("enteredHashCode" + index, enteredHashCode);
    let Acclist = this.contextService.getDataByKey("dellAIOTriggerflexValues");
    let count = Acclist.length;
    //let item = action.config.item;
    let filteredData = this.contextService.getDataByKey('checkAccesorysdata');
    let isMatched = false;
    let isValueRepeated = false;
    let actions = [];
    let arr = [];
    if (enteredHashCode && enteredHashCode != "") {
      for (let i = 0; i < count; i++) {
        let textBoxRef = this.contextService.getDataByKey(i + "newNoUUID" + "ref");
        let textBoxValue = "";
        if (textBoxRef && textBoxRef.instance.group) {
          textBoxValue = textBoxRef.instance.group.controls[textBoxRef.instance.name].value;
        }
        if (index != i && textBoxValue && enteredHashCode.toLowerCase() === textBoxValue.toLowerCase()) {
          isValueRepeated = true;
        }
      }
      !isValueRepeated && filteredData && filteredData.map((currentItem) => {
        if (currentItem["HASHCODE"].toLowerCase() === enteredHashCode.toLowerCase()) {
          isMatched = true;
          // let obj = {};
          // obj["id"] = currentItem["PPID_Comments"];
          // obj["value"] = currentItem["HASHCODE"];
          // arr.push(obj);
          // this.contextService.addToContext("abcd",arr);
          if (index < count) {
            actions.push(
              {
                "type": "setFocus",
                "config": {
                  "targetId": (index + 1) + "newNoUUID"
                }
              }
            );
          }
          let textFieldData = {
            "ctype": "textField",
            "uuid": index + "newNoUUID",
            "value": enteredHashCode,
            "name": index + "partNumber"
          }
          this.contextService.addToContext(index + "newNoUUID", textFieldData);

          let accessoryTitleData = {
            "ctype": "title",
            "uuid": index + "accessoryTitleUUID",
            "titleValue": currentItem["FF_VALUE"],
            "name": index + "accessoryType"
          }
          this.contextService.addToContext(index + "accessoryTitleUUID", accessoryTitleData);
          actions.push(
            {
              "type": "updateComponent",
              "config": {
                "key": index + "accessoryTitleUUID",
                "properties": {
                  "titleValue": currentItem["FF_VALUE"]
                }
              }
            },
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
          )
        }
      });

      if (!isMatched || isValueRepeated) {
        actions.push({
          "type": "updateComponent",
          "config": {
            "key": "errorTitleUUID",
            "properties": {
              "titleValue": "Accessory Doesn't Match",
              "isShown": true
            }
          }
        });
        actions.push({
          "type": "updateComponent",
          "config": {
            "key": index + "accessoryTitleUUID",
            "properties": {
              "titleValue": ""
            }
          }
        });
        instance.group.controls[instance.name].value = "";
        //if(currentfeildInstanceValue==""){
        let textFieldData = {
          "ctype": "textField",
          "uuid": index + "newNoUUID",
          "value": enteredHashCode,
          "name": index + "partNumber"
        }
        this.contextService.addToContext(index + "newNoUUID", textFieldData);
        let accessoryTitleData = {
          "ctype": "title",
          "uuid": index + "accessoryTitleUUID",
          "titleValue": "",
          "name": index + "accessoryType"
        }
        this.contextService.addToContext(index + "accessoryTitleUUID", accessoryTitleData);
        //}
      }
      actions.push({
        "type": "handleCheckAccActions",
        "methodType": "handleDellpackoutCheckAccCompleteButton",
        "config": {
          "count": count,
          "isValueRepeated": isValueRepeated,
          "isMatched": isMatched,
          "taskPanelUUID": "dellPackoutCheckAccessUUID",
          "textFieldUUID": "newNoUUID",
          // "accessoryNameUUID": action.config.accessoryNameUUID,
          // "resultCodeUUID": action.config.resultCodeUUID,
          // "timeOutUUID": action.config.timeOutUUID,
          "completeUUID": "dellPackoutCheckAccessCompleteUUID"
          // "resetUUID": action.config.resetUUID,
          // "rightLabel": action.config.item['FF_VALUE']
        }
      })
    } else {
      actions.push({
        "type": "updateComponent",
        "config": {
          "key": "errorTitleUUID",
          "properties": {
            "titleValue": "Accessory Doesn't Match",
            "isShown": true
          }
        }
      });
      actions.push({
        "type": "updateComponent",
        "config": {
          "key": index + "accessoryTitleUUID",
          "properties": {
            "titleValue": ""
          }
        }
      },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellPackoutCheckAccessCompleteUUID",
            "properties": {
              "disabled": true
            }
          }
        });
      instance.group.controls[instance.name].value = "";
      let textFieldData = {
        "ctype": "textField",
        "uuid": index + "newNoUUID",
        "value": enteredHashCode,
        "name": index + "partNumber"
      }
      this.contextService.addToContext(index + "newNoUUID", textFieldData);
      let accessoryTitleData = {
        "ctype": "title",
        "uuid": index + "accessoryTitleUUID",
        "titleValue": "",
        "name": index + "accessoryType"
      }
      this.contextService.addToContext(index + "accessoryTitleUUID", "");
    }
    //this.executeActions(actions, instance, actionService);
    actions.forEach((currentAction) => {
      actionService.handleAction(currentAction, instance);
    });
  }

  /// Adding the last note panel dynamically in page component
  addLastNotePanel(items: any, contractName, wc) {
    let index = 2;
    let containerId;
    if (!!items) {
      for (let i = 0; i < items.length; i++) {
        let currentItem = items[i];
        if (currentItem?.header?.title?.toLowerCase() === "last note" || currentItem?.header?.title?.toLowerCase() === "last repair notes") {
          currentItem.header.title = "Last Repair Notes";
          containerId = currentItem.containerId;
        }
      }
    }

    let lastNoteForBCN = this.contextService.getDataByKey("lastNoteForBCN");
    if (!!lastNoteForBCN && lastNoteForBCN != "" && !!contractName && contractName.toLowerCase() === "dell aio") {
      let obj = {
        "ctype": "taskPanel",
        "isblueBorder": true,
        "containerId": !!containerId ? containerId : "bodypage",
        "uuid": "delllastNoteTask" + wc + "BCNUUID",
        "title": "",
        "header": {
          "title": "Last Note",
          "svgIcon": "description_icon",
          "iconClass": "active-header",
          "class": "greyish-black"
        },
        "isMandatory": false,
        "expanded": false,
        "disabled": false,
        "hideToggle": true,
        "panelClass": "margin-top-10",
        "hidden": false,
        "hooks": [],
        "validations": [],
        "actions": [],
        "items": [
          {
            "ctype": "title",
            "uuid": "lastNoteTextBCN" + wc + "UUID",
            "titleClass": "greyish-black body-italic assessment-alert",
            "titleValue": lastNoteForBCN,
            "isShown": true
          }
        ],
        "footer": []
      };
      items.splice(index, 0, obj);
    }

    return items;
  }


  hideLastNoteInDashboard(action: any, instance: any, actionService: any) {
    let discrepancyUnitInfo = this.contextService.getDataByString("#discrepancyUnitInfo");
    let lastNoteRef = this.contextService.getDataByKey("delllastNoteTask" + discrepancyUnitInfo.WORKCENTER + "BCNUUIDref");

    if (!!lastNoteRef && lastNoteRef?.instance) {
      this.contextService.addToContext("lastNoteForBCN", "");
      lastNoteRef.instance.hidden = true;
      lastNoteRef.instance._changeDetectionRef.detectChanges();
      actionService.handleAction({
        "type": "deleteComponent",
        "eventSource": "click",
        "config": {
          "key": "delllastNoteTask" + discrepancyUnitInfo.WORKCENTER + "BCNUUID"
        }
      }, instance)
    }
  }

  splitString(action, instance, actionService) {
    let data;
    if (action.config.data.startsWith('#')) {
      data = this.contextService.getDataByString(action.config.data);
    } else {
      data = action.config.data;
    }
    let splitkey = action.config.splitkey;
    let arrayPosition = action.config.position;
    let contextKey = action.config.contextKey;
    let splitArray = data.split(splitkey);

    this.contextService.addToContext(contextKey, splitArray[arrayPosition]);
  }

  /// Adds the exit button in all dell wur screens
  addExitButton(footer: any, discrepancyUnitInfo: any): any {
    footer.forEach((element, index) => {
      let isItemAdded = false;
      let indexToBepushed = 1;

      let exitButton = {
        "ctype": "iconbutton",
        "iconButtonClass": "footer-save ml-1 body",
        "text": " Exit",
        "uuid": "exit" + discrepancyUnitInfo.WORKCENTER + "UUID",
        "visibility": true,
        "disabled": false,
        "type": "submit",
        "icon": "close",
        "actions": [
          {
            "type": "clearScreenData",
            "eventSource": "click"
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "delete",
              "key": "currentWC"
            },
            "eventSource": "click"
          },
          {
            "type": "renderTemplate",
            "config": {
              "templateId": "dashboard.json",
              "mode": "local"
            },
            "eventSource": "click"
          }
        ]
      };

      element.items.splice(indexToBepushed, 0, exitButton);
      footer[index] = element;
    });
    return footer;
  }

  /// Common method for a post api call with promise
  async postApiCallUsingPromise(body, microserviceId) {
    let bodyObj = this.contextService.getParsedObject(body, this);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    bodyObj = JSON.stringify(bodyObj);

    let promise = new Promise((resolve, reject) => {
      this.http.post(serviceUrls[microserviceId], bodyObj, { headers: headers, observe: 'response' })
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

  /// Packout screen issue box methods starts here
  /// This is the API call for get packaging part number
  async _getPackagingPartNum(action, actionService) {
    let body = {
      "partNo": "#repairUnitInfo.PART_NO",
      "userName": "#userAccountInfo.PersonalDetails.USERID"
    };
    let compRef = this.contextService.getDataByKey(action.config.uuid + 'ref');
    if (!!compRef && compRef.instance) {
      let res = await this.getApiCallUsingPromise(body, "getPart");
      if (res && res['status']) {
        let data = res['data'];
        data.map(async (x) => {
          if (x["packingMaterialPartNo"]) {
            compRef.instance.boxPartNumOptions.unshift(x["packingMaterialPartNo"]);
            if (!!action.config.defaultValue) {
              this.setDefaultValueForBoxPartNumber(action, compRef.instance);
            }
            await this._getAlternatePartIdFromPackagingNum(compRef.instance, action, x["packingMaterialPartNo"], actionService);
            return x["packingMaterialPartNo"];
            this.handleErrorMessage(res['message'], actionService);
          }
        })
      } else {
        this.handleErrorMessage(res['message'], actionService, true);
      }
    }
  }

  /// This will set value for issue box part number fropdown
  setDefaultValueForBoxPartNumber(action, instance: any) {
    let defaultValue = action.config.defaultValue;
    defaultValue = this.contextService.getDataByString(defaultValue);
    if (instance.boxPartNumOptions.includes(defaultValue)) {
      instance.group.controls[action.config.name].setValue(defaultValue);
      instance._changeDetectionRef.detectChanges();
      let completeBtnRef = this.contextService.getDataByKey(instance.completeBtnUuid + 'ref');
      if (!!completeBtnRef) {
        completeBtnRef.instance.disabled = true;
        completeBtnRef.instance._changeDetectionRef.detectChanges();
      }
    }
  }

  /// This is the API call to get the alterate part id based on packaging part number
  async _getAlternatePartIdFromPackagingNum(instance, action, packagingPartNum, actionService) {
    let body = {
      "partNumber": packagingPartNum,
      "userName": "#userAccountInfo.PersonalDetails.USERID"
    };
    let res = await this.postApiCallUsingPromise(body, "getAltPartIdFromAltPackagingNum");
    if (res && res['status']) {
      let data = res['body']['data'];
      await this._getAlternatePartNum(instance, action, data[0].partId, actionService);
    } else {
      this.handleErrorMessage(res['message'], actionService, true);
    }
  }

  /// This is the API call for get alternate part number
  async _getAlternatePartNum(instance, action, packagingPartNum, actionService) {
    let discrepancyUnitInfo = this.contextService.getDataByString("#discrepancyUnitInfo");
    let body = {
      "locationId": "#userSelectedLocation",
      "clientId": "#userSelectedClient",
      "contractId": discrepancyUnitInfo.GEONAME.toLowerCase() === "louiville" ? "37061" : "#userSelectedContract",
      "username": "#userAccountInfo.PersonalDetails.USERID",
      "conditionName": "#dellPackoutBoxCondValue",
      "ownerName": "DELL",
      "partId": packagingPartNum
    };
    if (!!instance) {
      let res = await this.getApiCallUsingPromise(body, "getAlternetPart");
      if (res && res['status']) {
        let data = res['data'];
        data.map((x) => {
          //instance.boxPartNumOptions.push(x.alternatePartNo);
          instance.boxPartNumOptions.splice((instance.boxPartNumOptions.length - 1),0,x.alternatePartNo);
          this.handleErrorMessage(res['message'], actionService);
        })
        if (!!action.config.defaultValue) {
          this.setDefaultValueForBoxPartNumber(action, instance);
        }
      } else {
        this.handleErrorMessage(res['message'], actionService, false);
      }
    }
  }


  /// This will handle the errors on page component
  handleErrorMessage(err: any, actionService, showError?) {
    actionService.handleAction({
      "type": "updateComponent",
      "config": {
        "key": "errorTitleUUID",
        "properties": {
          "titleValue": err,
          "isShown": !!showError ? showError : false
        }
      }
    }, this);
  }
/// Packout screen issue box changes ends here
  setDefaultMenuToHome(action,instance, actionService) {
    let menuListRef = this.contextService.getDataByKey('menuListItemUUIDref');
    let arr = [
      {
        "type": "updateComponent",
        "eventSource": "change",
        "config": {
          "key": "menuListItemUUID",
          "properties": {            
            "defaultMenu": "Home"
          }
        }
      }
    ];
    menuListRef.instance._changeDetectionRef.detectChanges();
    actionService.handleAction(arr);
  }

  updateEtravellerDiscrepancyUnitInfo(action, instance, actionService) {
    let discrepancyUnitInfoTemp;
    let discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
    discrepancyUnitInfoTemp = discrepancyUnitInfo;
    discrepancyUnitInfoTemp["ITEM_BCN"] = discrepancyUnitInfo["itemBcn"];
    discrepancyUnitInfoTemp["referenceOrderId"] = discrepancyUnitInfo["referenceOrderId"];
    discrepancyUnitInfoTemp["SERIAL_NO"] = discrepancyUnitInfo["serialNumber"];
    discrepancyUnitInfoTemp["ITEM_ID"] = discrepancyUnitInfo["itemId"];
    discrepancyUnitInfoTemp["PART_NO"] = discrepancyUnitInfo["partNo"];
    

    this.contextService.addToContext("discrepancyUnitInfo", discrepancyUnitInfoTemp);
    this.contextService.addToContext("shippingSerialNo", discrepancyUnitInfo["serialNumber"]);
    this.contextService.addToContext("repairUnitInfo", discrepancyUnitInfoTemp);
    
  }
}
