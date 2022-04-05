import { Injectable } from '@angular/core';
// import { ActionService } from '../../action/action.service';
// import { ActionService } from '../action/action.service';
import { ContextService } from '../contextService/context.service';


@Injectable({
  providedIn: 'root'
})
export class ArrayOperService {

  constructor(
    private contextService: ContextService,
    //  private actionService: ActionService,

  ) { }


  handleArrayData(action, instance) {
    let contextData = this.contextService.getDataByString(action.config.value);
    if (contextData instanceof Array && action.config.type == 'join') {
      contextData = contextData.join();
      this.contextService.addToContext(action.config.contextKey, contextData);
    }
  }

  handlearrayFilter(action, instance, actionService){
    let data = [];
    let filteredValue = []
    let keyName
    let keyDataValue = action.config.filterRefValue;
    let unitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
    // let refData = this.contextService.getDataByKey(
    //   action.config.targetUUID
    // );
    if (action.config.data.startsWith('#')) {
      data = this.contextService.getDataByString(action.config.data);
    }
    if (action.config.keyName.startsWith('#')) {
      keyName = this.contextService.getDataByString(action.config.keyName);
    }
    data.map((x) => {
      if(x[keyDataValue] == keyName){
        filteredValue.push(x);
      }
    })

    // refData.instance.dataSource = filteredValue;

    this.contextService.addToContext(action.config.targetContextKey, filteredValue);
    if(unitInfo && unitInfo.CONTRACTNAME == 'DELL AIO' && unitInfo.CLIENTNAME == 'DELL' && unitInfo.LOCATION_ID == "1244"){
      actionService.handleAction(
        {
          "type": "updateComponent",
          "config": {
            "key": action.config.targetUUID,
            "concat": true,
            "displayConcatValue": "storageHoldSubCodeDesc",
            "concatCharacter": "_",
            "dropDownProperties": {
              "options": filteredValue
            },
            "properties": {
              "isReset": true,
              "name": (action.config && action.config.name) ? action.config.name : 'holdCodes'
            }
          }
        },instance
      )
    } else {
      actionService.handleAction(
        {
          "type": "updateComponent",
          "config": {
            "key": action.config.targetUUID,
            "dropDownProperties": {
              "options": filteredValue
            },
            "properties": {
              "isReset": true,
              "name": (action.config && action.config.name) ? action.config.name : 'holdCodes'
            }
          }
        },instance
      )
    }

  }

  getConditionalDestinationLocationData(action, instance, actionService) {

    let data = [];
    let filteredValue = ""

    if (action.config.data.startsWith('#')) {
      data = this.contextService.getDataByString(action.config.data);
    }
    data = data[0];
    filteredValue = data[action.config.filterRefValue];
    this.contextService.addToContext(action.config.filterRefValue, filteredValue);
  }

  setData(action){
    let chars = this.contextService.getDataByString(action.config.data);
    let boxCode;
    if(action.config.referencevariable){
      boxCode=action.config.referencevariable;
    }
    else{
      boxCode="storageHoldCode";
    }
    let uniqueChars = [...new Map(chars && chars.map(item => [item[boxCode], item])).values()]
    this.contextService.addToContext(action.config.contextKey, uniqueChars);
  }

  handlefilterAndGetIndex(action, instance, actionService) {
    let onSuccessActions = [];
    let onFailureActions = [];
    let contextData = [];
    let filterDuplicate: any[];
    let result = null;
    let filterKey;
    if (instance.group) {
      filterKey = instance.group.controls[instance.name].value;
    }
    // get the array from context
    if (action.config.data.startsWith('#')) {
      contextData = this.contextService.getDataByString(action.config.data);
    }

    if (contextData instanceof Array && action.config.operation === undefined) {
      // updated
      filterDuplicate = contextData.filter(
        (item) => item.pcbPartNo === filterKey
      );

      if (actionService.customTempArray.length <= 0) {
        contextData.forEach((element) => {
          actionService.customTempArray.push(element);
        });
      }

      if (filterDuplicate.length <= 1) {
        // for check the data by source key
        contextData.forEach((element) => {
          if (action.config.sourceKey === 'compRegexp') {
            let re = new RegExp(element[action.config.sourceKey]);
            if (re.test(filterKey)) {
              result = element;
            } else if (element[action.config.sourceKey] == filterKey) {
              result = element;
            }
          }
        });
      } else {
        actionService.customTempArray.forEach((element) => {
          if (action.config.sourceKey === 'compRegexp') {
            let re = new RegExp(element[action.config.sourceKey]);
            if (re.test(filterKey)) {
              result = element;
            } else if (element[action.config.sourceKey] == filterKey) {
              result = element;
            }
          }
        });
        let index = actionService.customTempArray.findIndex(
          (item) => item.compPartNo === result.compPartNo
        );
        actionService.customTempArray.splice(index, 1);
        actionService.customTempArray.unshift(result);
      }

    } else if (contextData instanceof Array && action.config.operation === "getIndex") {
      let getValueBy

      if (action.config.getValueBy.startsWith('#')) {
        getValueBy = this.contextService.getDataByString(action.config.getValueBy);
      } else {
        getValueBy = action.config.getValueBy;
      }
      if (contextData instanceof Array && contextData !== undefined && contextData.length > 0) {
        let test = contextData.filter(a => a[action.config.objectKey] == getValueBy);
        result = test[0];
        if (result && result.name && result.name.toLowerCase() === "home" && result.id) {
          this.contextService.addToContext("selectedHomeMenuId", result.id);
        }
      } else {
        result = {};
      }
    }


    this.contextService.addToContext(action.config.contextKey, result);
    // console.log('data from action per index=' + result);

    if (action.responseDependents && action.responseDependents.onSuccess != undefined) {
      if (result != undefined && result != null) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((element) => {
          actionService.handleAction(element, instance);
        });
      } else {
        if (action.responseDependents.onFailure != undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((element) => {
            actionService.handleAction(element, instance);
          });
        }
      }
    }
  }
  handlecheckAndApply(action, instance) {
    var flexarray: any[] = this.contextService.getDataByString(
      action.config.source
    );
    for (var i = 0, len = flexarray.length; i < len; i++) {
      if (flexarray[i].Name === instance.name) {
        flexarray[i].Value = instance.currentTextFieldValue.trim();
      }
    }
  }
  handlePushDataToArray(action, instance) {
    // 1.data for add into to array
    // 2.Array where we have to add the data.
    // 3.push data on index.
    // 4.unique key.
    let data = {};
    let filterKey;
    let contaxtArray;
    let objectKeys = action.config.objectKeys;
    let objectValues = action.config.objectValues;
    if (instance.group != undefined) {
      filterKey = instance.group.controls[instance.name].value;
    }

    if (objectKeys.length === objectValues.length) {
      for (let index = 0; index < objectKeys.length; index++) {
        let value = objectValues[index];
        if (value.startsWith('#')) {
          value = this.contextService.getDataByString(value);
        }
        data[objectKeys[index]] = value;
        if (action.config.arrayName === '#pcbByMainPartParams' && value) {
          data = '';
          data = filterKey;
        }
      }
    }
    // console.log('data from arr handle=' + data);

    if (action.config.arrayName.startsWith('#')) {
      contaxtArray = this.contextService.getDataByString(
        action.config.arrayName
      );
    }

    if (contaxtArray != undefined && contaxtArray instanceof Array) {
      if (action.config.action == 'pushIndex') {
        if (action.config.uniqueKey != undefined && contaxtArray.length > 0) {
          // check for unique object value
          let availabel = false;
          contaxtArray.forEach((element) => {
            if (data instanceof Object) {
              if (
                element[action.config.uniqueKey] ==
                data[action.config.uniqueKey]
              ) {
                availabel = true;
              }
            } else {
              if (element == data) {
                availabel = true;
              }
            }
          });
          if (!availabel) {
            contaxtArray.push(data);
          }
        } else {
          // push directly.
          contaxtArray.push(data);
        }
      }
      else if (action.config.action == 'filterByProperty') {
        // data array
        // filter by index name
        // push data into context (key)
        // condition value
        if (contaxtArray != undefined && contaxtArray.length > 0) {
          // contaxtArray
          let resultData = contaxtArray.filter(el => el[objectKeys] === objectValues);
          this.contextService.addToContext(action.config.contextKey, resultData);

        }

      }
    } else if (action.config.action == 'updateIndex') {
      // function to update the index
    } else if (action.config.action == 'addIndexByCount') {
      // function to update the index
    }

  }
  handlecheckAndPush(action, instance, actionService) {
    var config = action.config;
    var refData = this.contextService.getDataByString(config.source);
    config.flag = instance.uuid;
    let onSuccessActions = [];
    let onFailureActions = [];
    var hasMatch: boolean = false;
    var compRegexp;

    if (config.requestMethod === "add") {
      if (config.compRegexp != undefined) {
        compRegexp = this.contextService.getDataByString(config.compRegexp);
      }
      if (refData === '' || refData.length === 0) {
        var splitArray = config.source.split('.');
        var contextKey = splitArray.shift().split('#')[1];
        this.contextService.addToContext(contextKey, []);
        var flexarray: any[] = this.contextService.getDataByString(config.source);
        config.key =
          config.accessoryName !== undefined && config.accessoryName !== ''
            ? config.accessoryName
            : config.key;
        var obj = new Object();

        if (config.value === undefined) {
          obj = {
            name: config.key,
            value: instance.group.controls[instance.name].value,
            flag: config.flag,
            compRegexp: compRegexp !== undefined ? compRegexp.compRegexp : '',
            pcb: compRegexp !== undefined ? compRegexp.compPartNo : '',
          };
        } else {
          obj = { name: config.key, value: config.value };
        }

        if (flexarray[instance.parentuuid] !== undefined) {
          flexarray.splice(instance.parentuuid, 1, obj);
        } else {
          flexarray.push(obj);
        }
      } else {
        config.key =
          config.accessoryName !== undefined && config.accessoryName !== ''
            ? config.accessoryName
            : config.key;
        var flexarray: any[] = this.contextService.getDataByString(config.source);
        // this.insertIntoAccessoryObjKey(flexarray, action, instance);

        for (var i = 0, len = flexarray.length; i < len; i++) {
          if (flexarray[i].Value == 'NONE') {
            flexarray[i].Value = config.value;
            break;
          }
          if (flexarray[i].flag) {
            if (flexarray[i].flag === config.flag) {
              flexarray[i].Value = instance.group.controls[instance.name].value;
            } else if (flexarray[i].compRegexp === compRegexp.compRegexp) {
              if (flexarray[i].pcb === compRegexp.compPartNo) {
                // instance.group.controls[instance.name].value = '';
                instance.group.reset();
                hasMatch = true;
              }
            } else if (
              flexarray[i].Value === instance.group.controls[instance.name].value
            ) {
              instance.group.controls[instance.name].value = '';
              hasMatch = true;
            }
          }
        }
        if (config.value === undefined) {
          var obj = new Object();
          if (!hasMatch) {
            obj = {
              name: config.key,
              value: instance.group.controls[instance.name].value,
              flag: config.flag,
              compRegexp: compRegexp !== undefined ? compRegexp.compRegexp : '',
              pcb: compRegexp !== undefined ? compRegexp.compPartNo : '',
            };
            if (flexarray[instance.parentuuid] !== undefined) {
              flexarray.splice(instance.parentuuid, 1, obj);
            } else {
              flexarray.push(obj);
            }
          }
        }
      }
    }

    if (config.requestMethod === "addTan") {
      var flexarray: any[] = [];
      var tanValue = this.contextService.getDataByString("#tanValue");
      var tan = this.contextService.getDataByString("#tan");
      config.key =
        config.accessoryName !== undefined && config.accessoryName !== ''
          ? config.accessoryName
          : config.key;
      var obj = new Object();

      if (config.value === undefined) {
        obj = {
          name: config.key,
          value: tan,
          // flag: config.flag,
          compRegexp: tanValue !== undefined ? tanValue.compRegexp : '',
          pcb: tanValue.compPartNo !== null ? compRegexp.compPartNo : '',
        };
      } else {
        obj = { name: config.key, value: config.value };
      }

      if (flexarray[instance.parentuuid] !== undefined) {
        flexarray.splice(instance.parentuuid, 1, obj);
      } else {
        flexarray.push(obj);
      }
      this.contextService.addToContext(config.source, flexarray);
    }

    // console.log(this.contextService.getDataByString(config.source));
    // handle the response dependents
    if (
      !hasMatch &&
      action.responseDependents !== undefined &&
      action.responseDependents.onSuccess !== undefined
    ) {
      onSuccessActions = action.responseDependents.onSuccess.actions;
      onSuccessActions.forEach((element) => {
        actionService.handleAction(element, instance);
      });
    } else {
      if (
        hasMatch &&
        action.responseDependents !== undefined &&
        action.responseDependents.onFailure != undefined
      ) {
        onFailureActions = action.responseDependents.onFailure.actions;
        onFailureActions.forEach((element) => {
          actionService.handleAction(element, instance);
        });
      }
    }
  }
  handleGetValueFromArray(action, instance) {
    let getvaluefromArray;
    let indexOfArray;
    let parentuuidName;

    if (instance.parentuuid !== undefined && instance.parentuuid != null && instance.parentuuid.startsWith('#')) {
      parentuuidName = this.contextService.getDataByString(
        instance.parentuuid
      );
    } else {
      parentuuidName = instance.parentuuid;
    }


    if (action.config.arrayData.startsWith('#')) {
      let contextArray = this.contextService.getDataByString(
        action.config.arrayData
      );

      if (action.config.key !== undefined) {
        getvaluefromArray = contextArray.find((x) => x[action.config.key] === parentuuidName)[action.config.property][0];

        if (action.config.splice !== undefined && action.config.splice) {
          indexOfArray = contextArray.findIndex((x) => x[action.config.key] == parentuuidName);
          // getvaluefromArray = contextArray.splice(indexOfArray, 1);
          /// To Do : make this generic
          /// Delete from linelist context too
          contextArray.splice(indexOfArray, 1);
          this.contextService.addToContext(action.config.arrayData, contextArray);

          /// Delete from requistionList context
          let requisitionList = [];
          requisitionList = this.contextService.getDataByKey('requisitionList');
          const reqListIndex = requisitionList.findIndex((x) => x[action.config.key] === parentuuidName);
          requisitionList.splice(reqListIndex, 1);
          this.contextService.addToContext('requisitionList', requisitionList);

          /// splice the same index as above from linelist too
          let lineList = [];
          lineList = this.contextService.getDataByKey('lineList');
          lineList.splice(reqListIndex, 1);
          this.contextService.addToContext('lineList', lineList);

          /// splice the same index as above from linelist too
          let kardexLineList = [];
          kardexLineList = this.contextService.getDataByKey('kardexLineList');
          kardexLineList.splice(reqListIndex, 1);
          this.contextService.addToContext('kardexLineList', kardexLineList);

          let averageAmountList = [];
          averageAmountList = this.contextService.getDataByKey('averageAmountList');
          averageAmountList && averageAmountList.splice(reqListIndex, 1);
          averageAmountList && this.contextService.addToContext('averageAmountList', averageAmountList);

          let requisitionLength;
          requisitionLength = requisitionList.length;
          this.contextService.addToContext('requisitionListLength', requisitionLength);

          if (action.config.deleteTableData !== undefined) {
            /// Update mat table -- This will be moved to seperate action later
            const matTableRef = this.contextService.getDataByKey('ReplacerequisitiontasktableUUID' + 'ref');
            matTableRef.instance.matTableDataSource.data = requisitionList;
            matTableRef.instance.matTableDataSource._updateChangeSubscription();
            matTableRef.instance._changeDetectionRef.detectChanges();
          }
        }
      }
      else {
        contextArray.forEach((ele) => {
          if (
            ele.storageHoldSubCode == instance.group.controls[instance.name].value
          ) {
            getvaluefromArray = ele[action.config.PullValue];
            return;
          }
        });
      }
    }
    this.contextService.addToContext(
      action.config.PullValue,
      getvaluefromArray
    );
  }
  getArrayRecordByIndex(action: any, actionService) {
    if (action && action.config) {
      const config = action.config;
      let data: any = actionService.getContextorNormalData(config.data, []);

      this.contextService.addToContext(config.contextKey, data[config.index]);

      //logic for saving specific property data to context from selected array
      if(config.propertyName && config.propertyContextKey){
        if(data.length > 0){
          let propertyData = "";
          propertyData = data[config.index][config.propertyName];
          if(propertyData){
            this.contextService.addToContext(config.propertyContextKey, propertyData);
          }
        }
      }
    }
  }

  reorderAccessories(action, instance) {
    let accessoriesContextData = this.contextService.getDataByKey('Accessories');

    /// Pull out the accessories 1-5 data
    let accessories = accessoriesContextData.slice(2, 7);

    /// Filter out accessories which do not have "NONE"
    let accessoriesWithoutNone = accessories.filter((x) => x.Value !== "NONE");

    if (accessoriesWithoutNone.length > 0) {
      /// reorder the accessories array
      accessories.forEach(function (element, index) {
        if (index < accessoriesWithoutNone.length) {
          accessories[index].Value = accessoriesWithoutNone[index].Value;
        } else {
          accessories[index].Value = "NONE";
        }
      });

      for (let i = 2; i < 7; i++) {
        accessoriesContextData[i] = accessories[i-2];
      }

      this.contextService.addToContext('Accessories', accessoriesContextData);
    }
  }

  generatetoogleArray(action, instance, actionService) {
  let bersbuData =  this.contextService.getDataByKey(action.config.key);
    let title = "";
    let optionsArr = [];
    let optionsObj = {};
    bersbuData.forEach((element)=>{
      title +=  element.value + " or "; 
      optionsObj = {
        "bgcolor": "light-blue",
        "color": "white",
        "text": element.value,
        "value": element.value
      };
      optionsArr.push(optionsObj);
    });
    var n = title.lastIndexOf("or");
    title = title.slice(0, n) + title.slice(n).replace("or", "");
    let unitTitle = "Is the Unit "+ title+ "?"
    let initialValue =  bersbuData[bersbuData.length-1]['value']
    this.contextService.addToContext("bersbuTitle",title);
    this.contextService.addToContext("bersbuOptions",optionsArr);
    this.contextService.addToContext("unitTitle",unitTitle);
    this.contextService.addToContext("berSbuToggle",initialValue);
  }

  findObjectInArray(action, instance, actionService){
    let arr = this.contextService.getDataByKey(action.config.data);
    let reqValue = this.contextService.getDataByKey(action.config.reqValue);
    reqValue = reqValue ? reqValue : this.contextService.getDataByKey("berSbuToggle");
    let index = arr.findIndex(x => x.value === reqValue);
  }

  // returns particlar element in an array based on input index.
  extractValueBasedOnIndex (action) {
    let arr = this.contextService.getDataByKey(action.config.data);
    let obj = arr[action.config.reqIndex];
    this.contextService.addToContext(action.config.key,obj);
  }

  // returns particlar element in an array based on input key.
  extractValueBasedOnKey(action) {
    let arr = this.contextService.getDataByKey(action.config.data);
    if (action.config.reqValue && action.config.reqValue.startsWith('#')) {
      action.config.reqValue = this.contextService.getDataByString(action.config.reqValue);
    }
    arr && arr.map(item => {
      if (item[action.config.reqKey].toString().toLowerCase() === action.config.reqValue.toString().toLowerCase()) {
        this.contextService.addToContext(action.config.key, item);
      }
    })
  }

  handleFilterArrayData(action, instance, actionService){
    let data = [];
    let filterData;
    let filterKey = action.config.filterKey || "";
    let filterVal = action.config.filterValue;
    if (action.config.data && action.config.data.startsWith('#')) {
      data = this.contextService.getDataByString(action.config.data);
    } else {
      data = action.config.data;
    }
    
    if (filterVal && filterVal.startsWith('#')) {
      filterVal = this.contextService.getDataByString(filterVal);
    }

    if(data){
      if(action.config.filterMode == "remove"){
        filterData = data.filter(ele => {
          return ele[filterKey] != filterVal;
        });
      } else {
        //default equal to filter Value
        filterData = data.filter(ele => {
          return ele[filterKey] == filterVal;
        });
      }
    }

    if(action.config.contextKey){
      this.contextService.addToContext(action.config.contextKey, filterData);
    }
  }
}
  

