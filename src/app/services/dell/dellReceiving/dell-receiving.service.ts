import { Injectable } from '@angular/core';
import { UtilityService } from '../../../utilities/utility.service';
import { ComponentService } from '../../commonServices/componentService/component.service';
import { ContextService } from '../../commonServices/contextService/context.service';
import { dellReceivingToteColorMessage } from '../../../utilities/constants';

@Injectable({
  providedIn: 'root'
})
export class DellReceivingService {

  constructor(
    private contextService: ContextService,
    private componentService: ComponentService,
    private utiliyService: UtilityService
  ) { }
  disableAccessoriesComplete(action, instance, actionService) {
    this.ReceiveButtonDisable();
    var flexarray: any[] = this.contextService.getDataByString(
      action.config.source);

    const accessorydata: any[] = this.contextService.getDataByString(
      action.config.accessorydata);
    let isCompleteButtonEnable = false;
    if (accessorydata != undefined && accessorydata) {
      for (var i = 0, len = flexarray.length; i < len; i++) {
        if (flexarray[i].identifier != undefined && flexarray[i].identifier) {
          let accessoryValue = flexarray[i].Value;
          if ((instance.parentuuid != flexarray[i].identifier)
            && (accessoryValue == "NONEVALUE" || accessoryValue == "")) {
            isCompleteButtonEnable = true;
            break;
          }
          else {
            isCompleteButtonEnable = false;
          }

        }
      }
      let replacedAccessoryData = action.config.accessorydata.replace("#", "")
      this.contextService.addToContext(replacedAccessoryData, "");
    }
    else {
      isCompleteButtonEnable = true;

    }
    const accessoryCompleteButnTempelate = [{
      "type": "updateComponent",
      "eventSource": "click",
      "config": {
        "key": "dellReceivingcompleteAccessoriesButtonUUID",
        "properties": {
          "disabled": isCompleteButtonEnable
        }
      }
    }];
    if (accessoryCompleteButnTempelate) {
      accessoryCompleteButnTempelate.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }

  }
  handleAccessoriesActionValues(action, instance, actionService) {
    const flexarray: any[] = this.contextService.getDataByString(
      action.config.source);
    const accessorydata: any[] = this.contextService.getDataByString(
      action.config.accessorydata
    );
    if (true) {
      for (var i = 0, len = flexarray.length; i < len; i++) {
        if (flexarray[i].identifier == instance.parentuuid) {
          flexarray[i].Value = accessorydata;


          break;
        }
      }
    }


  }
  dellReceivingAccessoriesPresent(action, instance, actionService) {
    this.ReceiveButtonDisable();
    let errorMsg = {
      type: 'updateComponent',
      config: {
        key: 'errorTitleUUID',
        properties: {
          titleValue: '',
          isShown: true,
        },
      },
    }
    this.componentService.handleUpdateComponent(errorMsg,null,null,this.utiliyService);
    var flexarray: any[] = this.contextService.getDataByString(
      action.config.source);
    let isAccessoriesPresent = false;
    for (var i = 0, len = flexarray.length; i < len; i++) {
      if (flexarray[i].identifier != undefined && flexarray[i].identifier) {
        let accessoryValue = flexarray[i].Value;
        if ((accessoryValue == "NONEVALUE" || accessoryValue == "")) {
          isAccessoriesPresent = true;
          break;
        }
        else {
          isAccessoriesPresent = false;
        }
      }
    }
    // if(!isAccessoriesPresent) {
    const accessoryCompleteButnTempelate = [{
      "type": "updateComponent",
      "eventSource": "click",
      "config": {
        "key": "dellReceivingcompleteAccessoriesButtonUUID",
        "properties": {
          "disabled": isAccessoriesPresent
        }
      }
    }];
    if (accessoryCompleteButnTempelate) {
      accessoryCompleteButnTempelate.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }
  }
  reOrderdellReceivingAccessories(action, instance, actionService) {
    let dellReceivingAccessories = this.contextService.getDataByKey('Accessories');
    let dellReceivingDuplicatedAccessories = JSON.parse(JSON.stringify(dellReceivingAccessories))
    /// Filter out accessories which do not have "NONE"
    let accessoriesWithoutNone = dellReceivingDuplicatedAccessories.filter((x) => x.Value !== "NONE");
    accessoriesWithoutNone = accessoriesWithoutNone.filter((x) => x.Value !== "NONEVALUE");
    dellReceivingDuplicatedAccessories = this.removeInvalidAccessory(dellReceivingDuplicatedAccessories);
    if (accessoriesWithoutNone.length > 0) {
      /// reorder the accessories array
      dellReceivingDuplicatedAccessories.forEach(function (element, index) {
        if (element.hasOwnProperty('accessoryIdentifier')) {
          delete dellReceivingDuplicatedAccessories[index].accessoryIdentifier;
        }
        else if (element.hasOwnProperty('identifier')) {
          delete dellReceivingDuplicatedAccessories[index].identifier;
        }
      });

    }
    this.deleteEmptyAccessories(dellReceivingDuplicatedAccessories);
    this.contextService.addToContext('dellReceivingAccessories', dellReceivingDuplicatedAccessories);
    let resultCodeData: any = this.contextService.getDataByString(
      action.config.ResultCodeData);
    if (resultCodeData != undefined && resultCodeData != "") {
      this.addingResultCodeDataToAccessories(action, instance, actionService)
    }
  }
  addingResultCodeDataToAccessories(action, instance, actionService) {
    let resultCodeData: any = this.contextService.getDataByString(
      action.config.ResultCodeData);
    let accessories: any[] = this.contextService.getDataByString(
      action.config.source);

    Object.keys(resultCodeData).forEach((key) => {
      if(key != "swollenBatteryCheckbox"){
      let accessriesResultDataPresent = accessories.filter((x) => x.Name == key);
      if (resultCodeData[key] && accessriesResultDataPresent.length) {
        accessories.forEach((element) => {
          if (element.Name == key) {
            element.Value = resultCodeData[key];
          }
        });
      }
      else if (key !== "undefined" && key !== "FAT") {
        accessories.push({ "Name": key, "Value": resultCodeData[key] });
      }
    }
    });
  }
  deleteEmptyAccessories(dellReceivingAccessories) {
    for (let i = dellReceivingAccessories.length - 1; i >= 0; i--) {
      if (dellReceivingAccessories[i].Value == "NONE" || dellReceivingAccessories[i].Value == "NONEVALUE") {
        dellReceivingAccessories.splice(i, 1);
      }
    }
  }

  /// It removes the accessory which is not having ppid comments
  removeInvalidAccessory(dellReceivingDuplicatedAccessories: any): any {
    for (let i = dellReceivingDuplicatedAccessories.length - 1; i >= 0; i--) {
      let element = dellReceivingDuplicatedAccessories[i];
      if ((!!element.accessoryIdentifier && element.accessoryIdentifier != "") || (!!element.identifier && element.identifier != "")) {
        let currRef;
        if(!!element.identifier && element.identifier != ""){
          currRef = this.contextService.getDataByKey(element.identifier + 'ref');
        } else {
          currRef = this.contextService.getDataByKey(element.accessoryIdentifier + 'ref');
        }
        if(currRef?.instance?.items){
          let items = currRef.instance.items;
          items.forEach((item) => {
            // if(element.Name.includes("Accesory") && item.ctype === "label" && item.text.toLowerCase() !== "power cable"){
            //   element.Value = item.text;
            // }
            if(element.Name.includes("PPID-Comments") && item.ctype === "textField"){
              if(!!item?.group?.controls){
                element.Value = item.group.controls[item.name].value;
                if(element.Value === ""){
                  dellReceivingDuplicatedAccessories.splice(i, 1);
                }
              }
            }
          });
        }
      } else {
        dellReceivingDuplicatedAccessories.splice(i, 1);
      }
    }

    let length = dellReceivingDuplicatedAccessories.length / 2;
    length = Math.ceil(length);
    for (let i = length; i > 0; i--) {
      let filteredRecords = dellReceivingDuplicatedAccessories.filter((x) => x.Name.includes(i));
      if (filteredRecords.length === 1) {
        let index = dellReceivingDuplicatedAccessories.indexOf(filteredRecords[0]);
        dellReceivingDuplicatedAccessories.splice(index, 1);
      }
    }
    return dellReceivingDuplicatedAccessories;
  }
  
  duplicateAccessoriesCheck(action, instance, actionService) {
    let filteredData = [];
    let totalAccessories = this.contextService.getDataByKey('Accessories');
    let totalDuplicateAccessories = JSON.parse(JSON.stringify(totalAccessories))
    /// Filter out accessories which do not have "NONE"
    let accessoriesWithoutNone = totalDuplicateAccessories.filter((x) => x.Value !== "NONE");
    accessoriesWithoutNone = accessoriesWithoutNone.filter((x) => x.Value !== "NONEVALUE");
    if (accessoriesWithoutNone.length > 0) {
      totalDuplicateAccessories.forEach(function (element, index) {
        if (element.hasOwnProperty('accessoryIdentifier')) {
          delete totalDuplicateAccessories[index].accessoryIdentifier;
        }
        else if (element.hasOwnProperty('identifier')) {
          delete totalDuplicateAccessories[index].identifier;
        }
      });
      for (let i = totalDuplicateAccessories.length - 1; i >= 0; i--) {
        if (totalDuplicateAccessories[i].Value == "NONE" || totalDuplicateAccessories[i].Value == "NONEVALUE") {
          totalDuplicateAccessories.splice(i, 1);
        }
      }
      if (totalDuplicateAccessories && totalDuplicateAccessories.length > 0) {
        for (let i = 0; i < totalDuplicateAccessories.length; i++) {
          if (totalDuplicateAccessories[i].Name.includes("PPID")) {
            filteredData.push(totalDuplicateAccessories[i].Value)
          }
        }
      }
      //console.log(filteredData);
      let valuesAlreadySeen = []

      for (let i = 0; i < filteredData.length; i++) {
        let value = filteredData[i].toLowerCase();
        if (valuesAlreadySeen.indexOf(value) !== -1) {
          this.contextService.addToContext("duplicateAccessoriesExist",true);
          break;
        } else {
          this.contextService.addToContext("duplicateAccessoriesExist",false);
        }
        valuesAlreadySeen.push(value)
      }

    } else {
      this.contextService.addToContext("duplicateAccessoriesExist",false);
    }
  }

  ReceiveButtonDisable() {
    let parentuuid = this.contextService.getDataByKey("confirmAccessoriesTaskPanelUUID" + "ref"); //current taskpanel uuid
    let currentScreenName = this.contextService.getDataByKey("currentWC");
    if (parentuuid != undefined) {
      let MendatoryFlag = parentuuid.instance.isMandatory; // for isMandatory Task only we need to disable
      if (MendatoryFlag === true) {

        let validatetaskpanelstatus = this.contextService.getDataByKey(currentScreenName+"validatetaskpanelstatus"); // used some flag so that after completing all the task panels this flag will be true
        if (validatetaskpanelstatus == true) {
          let ReceiveButton = {
            "type": "updateComponent",
            "config": {
              "key": "dellReceivingreceiptButtonUUID",
              "properties": {
                "disabled": true
              }
            },
            "eventSource": "click"
          }
          this.componentService.handleUpdateComponent(ReceiveButton, null, null, this.utiliyService);
        }
      }
    }
  }

  fixedAssetTagSlaCondition(action, instance, actionService) {
    let SLAvalue = this.contextService.getDataByKey("dellLeftSideSla");
    let LOBvalue = this.contextService.getDataByKey("dellLeftSideLob");
    let DRRvalue = this.contextService.getDataByKey("dellLeftSideDrr");
    let formData = this.contextService.getDataByKey("dellReceivingrecordConditionResultCodeDataData");
    let FixedAssetTagValue = formData.FAT.toLowerCase();
    let checkcirle = {
      "type": "updateComponent",
      "config": {
        "key": "dellReceivingrecordConditionTaskUUID",
        "properties": {
          "expanded": false,
          "disabled": true,
          "taskPanelHeaderClass": "background-white",
          "header": {
            "title": "Record Condition",
            "icon": "description",
            "statusIcon": "check_circle",
            "statusClass": "complete-status",
            "class": "complete-task ",
            "iconClass": "complete-task"
          }
        }
      },
      "eventSource": "click"
    }
    let completeButton = {
      "type": "updateComponent",
      "eventSource": "click",
      "config": {
        "key": "dellReceivingRecordConditionCompleteUUID",
        "properties": {
          "disabled": true
        }
      }
    }
    let ResultCode = {
      "type": "updateComponent",
      "eventSource": "click",
      "config": {
        "key": "dellReceivingreceiptButtonUUID",
        "properties": {
          "disabled": false
        }
      }
    }
    let footerEnableHappentrue = {
      "type": "updateComponent",
      "config": {
        "key": "dellReceivingRecordConditionCompleteUUID",
        "properties": {
          "footerEnableHappen": true
        }
      }
    }
    let footerEnableHappenfalse = {
      "type": "updateComponent",
      "config": {
        "key": "dellReceivingRecordConditionCompleteUUID",
        "properties": {
          "footerEnableHappen": false
        }
      }
    }
    let errorMsg = {
      type: 'updateComponent',
      config: {
        key: 'errorTitleUUID',
        properties: {
          titleValue: 'Incorrect Tote Name',
          isShown: true,
        },
      },
    }
    if(DRRvalue && parseInt(DRRvalue) > 1){
      if(FixedAssetTagValue && FixedAssetTagValue.includes("drr")){
        this.componentService.handleUpdateComponent(checkcirle, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(completeButton, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(ResultCode, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(footerEnableHappentrue, null, null, this.utiliyService);
      } else {
        this.componentService.handleUpdateComponent(errorMsg, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(footerEnableHappenfalse, null, null, this.utiliyService);
      }
    } else if(LOBvalue && LOBvalue.toLowerCase() == "pon"){
      if(FixedAssetTagValue && FixedAssetTagValue.includes("pon")){
        this.componentService.handleUpdateComponent(checkcirle, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(completeButton, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(ResultCode, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(footerEnableHappentrue, null, null, this.utiliyService);
      } else {
        this.componentService.handleUpdateComponent(errorMsg, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(footerEnableHappenfalse, null, null, this.utiliyService);
      }
    } else if(SLAvalue && parseInt(SLAvalue) == 0){
      if(FixedAssetTagValue && FixedAssetTagValue.includes("sbd")){
        this.componentService.handleUpdateComponent(checkcirle, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(completeButton, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(ResultCode, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(footerEnableHappentrue, null, null, this.utiliyService);
      } else {
        this.componentService.handleUpdateComponent(errorMsg, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(footerEnableHappenfalse, null, null, this.utiliyService);
      }
    } else if(SLAvalue && parseInt(SLAvalue) == 1){
      if(FixedAssetTagValue && FixedAssetTagValue.includes("nbd")){
        this.componentService.handleUpdateComponent(checkcirle, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(completeButton, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(ResultCode, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(footerEnableHappentrue, null, null, this.utiliyService);
      } else {
        this.componentService.handleUpdateComponent(errorMsg, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(footerEnableHappenfalse, null, null, this.utiliyService);
      }
    } else if (SLAvalue && (parseInt(SLAvalue) == 2 || parseInt(SLAvalue) == 5)) {
      if(FixedAssetTagValue && FixedAssetTagValue.includes("2bd")){
        this.componentService.handleUpdateComponent(checkcirle, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(completeButton, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(ResultCode, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(footerEnableHappentrue, null, null, this.utiliyService);
      } else {
        this.componentService.handleUpdateComponent(errorMsg, null, null, this.utiliyService);
        this.componentService.handleUpdateComponent(footerEnableHappenfalse, null, null, this.utiliyService);
      }
    } // else if (!SLAvalue || !LOBvalue || !DRRvalue || (parseInt(SLAvalue) != 2 && parseInt(SLAvalue) != 5 && parseInt(DRRvalue) < 1 
    //   && LOBvalue.toLowerCase() != "pon")){
    //   let checkcirle = {
    //     "type": "updateComponent",
    //     "config": {
    //       "key": "dellReceivingrecordConditionTaskUUID",
    //       "properties": {
    //         "expanded": false,
    //         "disabled": true,
    //         "taskPanelHeaderClass": "background-white",
    //         "header": {
    //           "title": "Record Condition",
    //           "icon": "description",
    //           "statusIcon": "check_circle",
    //           "statusClass": "complete-status",
    //           "class": "complete-task ",
    //           "iconClass": "complete-task"
    //         }
    //       }
    //     },
    //     "eventSource": "click"
    //   }
    //   let completeButton = {
    //     "type": "updateComponent",
    //     "eventSource": "click",
    //     "config": {
    //       "key": "dellReceivingRecordConditionCompleteUUID",
    //       "properties": {
    //         "disabled": true
    //       }
    //     }
    //   }
    //   let ResultCode = {
    //     "type": "updateComponent",
    //     "eventSource": "click",
    //     "config": {
    //       "key": "dellReceivingreceiptButtonUUID",
    //       "properties": {
    //         "disabled": false
    //       }
    //     }
    //   }
    //   this.componentService.handleUpdateComponent(checkcirle, null, null, this.utiliyService);
    //   this.componentService.handleUpdateComponent(completeButton, null, null, this.utiliyService);
    //   this.componentService.handleUpdateComponent(ResultCode, null, null, this.utiliyService);
    // }
    else {
      this.componentService.handleUpdateComponent(errorMsg, null, null, this.utiliyService);
      this.componentService.handleUpdateComponent(footerEnableHappenfalse, null, null, this.utiliyService);
    }
  }

  toteMessageColor(action, instance, actionService) {
    let SLAvalue = this.contextService.getDataByKey("dellLeftSideSla");
    let LOBvalue = this.contextService.getDataByKey("dellLeftSideLob");
    let DRRvalue = this.contextService.getDataByKey("dellLeftSideDrr");
    let toteMsg;
    if(DRRvalue && parseInt(DRRvalue) > 1){
        toteMsg = dellReceivingToteColorMessage.DRRMessage;
    } else if(LOBvalue && LOBvalue.toLowerCase() == "pon"){
        toteMsg = dellReceivingToteColorMessage.LOBMessage;
    } else if(SLAvalue && parseInt(SLAvalue) == 0){
        toteMsg = dellReceivingToteColorMessage.SLAMessageSBD;
    } else if(SLAvalue && parseInt(SLAvalue) == 1){
        toteMsg = dellReceivingToteColorMessage.SLAMessageNBD;
    } else if (SLAvalue && (parseInt(SLAvalue) == 2 || parseInt(SLAvalue) == 5)) {
        toteMsg = dellReceivingToteColorMessage.SLAMessage2BD;
    } else {
      toteMsg = ""
    }
    let toteMessageUpdate = {
      "type": "updateComponent",
      "config": {
        "key": "toteMessageUUID",
        "properties": {
          "title": toteMsg
        }
      }
    }
    this.componentService.handleUpdateComponent(toteMessageUpdate, null, null, this.utiliyService);
  }
}

