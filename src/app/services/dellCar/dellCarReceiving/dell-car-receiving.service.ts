import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';
import { ComponentService } from '../../commonServices/componentService/component.service';

@Injectable({
  providedIn: 'root'
})
export class DellCarReceivingService {

  constructor(private contextService: ContextService, private componentService: ComponentService,) { }

    handleDellCarReceivingActions(action: any, instance: any, actionService: any) {
    switch (action.methodType) {
      case 'deleteDellCarAccessory':
        this.deleteDellCarAccessory(action, instance);
        break;
      case 'deleteParticularAccessory':
        this.deleteParticularAccessory(action, instance);
        break;
      case 'modulateMultiSelectDropDownValue':
        this.modulateMultiSelectDropDownValue(action);
        break;
      case 'flexFieldDataFormation':
        this.flexFieldDataFormation(action);
        break;
      case 'setAccessoryIndex':
        this.setAccessoryIndex(action);
        break;
      case 'receiveButtonDisable':
        this.receiveButtonDisable();
        break;
    }
  }

  handleAccessoriesAction(action, instance) {
    const accessoriesArray: any[] = this.contextService.getDataByString(action.config.source);

    // If the user clicked on other accessory
    if (instance.tileValue === 'Other') {
      // Check if max count has reached
      const otherAccessoryIndex  = accessoriesArray.findIndex((ele) => ele.Name === 'Number of accessories');
      if (accessoriesArray[otherAccessoryIndex].Value  >= instance.maxCount) {
        // user cannot add any more "other" accessories
        return false;
      } else {
        // increase the count by 1
        accessoriesArray[otherAccessoryIndex].Value++;
        return true;
      }
    } else {
      const accessoryIndex = accessoriesArray.findIndex((ele) => ele.Name.toLowerCase()
       === instance.accessoryName.toLowerCase());
      if (accessoriesArray[accessoryIndex].Value.toLowerCase() === 'no') {
        // That means its not clicked before
        accessoriesArray[accessoryIndex].Value = instance.tileValue;
        return true;
      } else {
        return false;
      }
    }
  }

  deleteDellCarAccessory(action, instance){
    const accessoriesArray: any[] = this.contextService.getDataByString(action.config.source);
    if (instance.indicator.toLowerCase() === 'other'){
      const otherAccessoryIndex  = accessoriesArray.findIndex((ele) => ele.Name === 'Number of accessories');
      accessoriesArray[otherAccessoryIndex].Value--;
    } else {
      const accessoryIndex = accessoriesArray.findIndex((ele) => ele.Name.toLowerCase()
      === instance.indicator.toLowerCase());
      accessoriesArray[accessoryIndex].Value = instance.defaultValue;
    }
  }

  deleteParticularAccessory(action, instance){
    const accessoryToBeDeleted = action.config.accessoryName;
    const accessoriesArray: any[] = this.contextService.getDataByString(action.config.source);
    const accessoryIndex = accessoriesArray.findIndex((ele) => ele.Name.toLowerCase()
    === accessoryToBeDeleted.toLowerCase());
    accessoriesArray[accessoryIndex].Value = 'No';
  }

  modulateMultiSelectDropDownValue(action){
    let data = this.contextService.getDataByString(action.config.data);
    data.map((obj)=>{
      if(obj.Name == "Unit Cosmetic Condition"){
        let c = obj.Value
        c = c.map((x) => x.dellCarUnitConditionValue).toString()
        obj.Value = c
      }
    })
  }

  flexFieldDataFormation(action) {
    const accessories = this.contextService.getDataByString(action.config.source)
    let accessoriesCopy = []
    accessories.forEach((v, i) => {
      const val = (typeof v === 'object') ? Object.assign({}, v) : v;
      accessoriesCopy.push(val);
    });
    accessoriesCopy.map((item) => {
      if (item.Name == "Number of accessories") {
        if (item.Value == 0) {
          item.Value = "NO"
        }
        else{
          item.Value = item.Value.toString();
        }
      }
    })
    if(action.config.isBlind){
      accessoriesCopy.splice(accessoriesCopy.findIndex(a => a.Name === "dellCarDpsSN") , 1);
      accessoriesCopy.splice(accessoriesCopy.findIndex(a => a.Name === "Resellers") , 1);
    }
    else{
      accessoriesCopy.splice(accessoriesCopy.findIndex(a => a.Name === "PPID") , 1)
    }
    action.config.arr.map((item) => {
      if (item === "userSearchCriteria") {
        let value = this.contextService.getDataByKey(item)
        if(value && value.unitIdentificationValue)
        accessoriesCopy.push({ Name: "AWB Received", Value: value.unitIdentificationValue })
      }
      else if (item === "getWorkInstDellEducateURLLink") {
        let value = this.contextService.getDataByKey(item)
        if(value && value.notes)
        accessoriesCopy.push({ Name: "Difficulty Level", Value: value.notes })
      }
      else if(item === "predictiveTrigger"){
        let value = this.contextService.getDataByKey(item)
        if(value)
        {
          accessoriesCopy.push({ Name: "PREDICTIVE", Value: value })
        }
      }
      else if(item === "getStopProcessReceivingResp"){
        let value = this.contextService.getDataByKey(item)
        if (value) {
          accessoriesCopy.push({ Name: "msgRead", Value: value.msgRead })
        }
      }
      else if(item === "acceptanceAndKardexSpace"){
        accessoriesCopy.push({ Name: "Acceptance", Value: "." });
        accessoriesCopy.push({ Name: "Kardex Space", Value: "1" });
      }
      else if(item === "blind"){
        // let getNextItemBCN = this.contextService.getDataByKey("getNextItemBCN");
        accessoriesCopy.push({ Name: "ADMIN NOTE", Value: "." });
        accessoriesCopy.push({ Name: "Disposition", Value: "." });
        accessoriesCopy.push({ Name: "StatusPS", Value: "NEW" });
        accessoriesCopy.push({ Name: "Manifest_TR", Value: "47HHDX2" });
        accessoriesCopy.push({ Name: "DPS_RO", Value: "6415592759" });
        accessoriesCopy.push({ Name: "Service_Tag_RO", Value: "47HHDX2" });
        accessoriesCopy.push({ Name: "ProcesType", Value: "STANDARD PROCESS" });
      }
    })
    this.contextService.addToContext("accessoriesCopy", accessoriesCopy);
  }

  setAccessoryIndex(action) {
    const refData = this.contextService.getDataByKey(action.config.key + 'ref');
    const accessoriesRefData = this.contextService.getDataByKey('confirmAccessoriesTaskPanelUUIDref');
    if (refData !== undefined) {
      const index = accessoriesRefData.instance.expansionpanelcontent.indexOf(refData.hostView);
      if (index !== -1) {
        this.contextService.addToContext('accessoryIndex', index);
      }
    } else {
      this.contextService.addToContext('accessoryIndex', null);
    }
  }

  receiveButtonDisable() {
    const parentuuid = this.contextService.getDataByKey("confirmAccessoriesTaskPanelUUID" + "ref"); //current taskpanel uuid
    let currentScreenName = this.contextService.getDataByKey("currentWC");
    if (parentuuid !== undefined) {
      const MendatoryFlag = parentuuid.instance.isMandatory; // for isMandatory Task only we need to disable
      if (MendatoryFlag === true) {

        const validatetaskpanelstatus = this.contextService.getDataByKey(currentScreenName+'validatetaskpanelstatus');
         // used some flag so that after completing all the task panels this flag will be true
        if (validatetaskpanelstatus === true) {
          const receiveButtonDisableAction = {
            "type": "updateComponent",
            "config": {
              "key": "dellReceivingreceiptButtonUUID",
              "properties": {
                "disabled": true
              }
            },
            "eventSource": "click"
          }
          const blindReceiveButtonDisableAction = {
            "type": "updateComponent",
            "config": {
              "key": "dellReceivingBlindreceiptButtonUUID",
              "properties": {
                "disabled": true
              }
            },
            "eventSource": "click"
          }
          this.componentService.handleUpdateComponent(receiveButtonDisableAction, null, null, null);
          this.componentService.handleUpdateComponent(blindReceiveButtonDisableAction, null, null, null);
        }
      }
    }
  }
}
