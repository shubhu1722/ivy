import { Injectable } from '@angular/core';
import { ContextService } from '../contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class OccurenceService {

  constructor(
    private contextService: ContextService,
  ) { }

  addOccurenceToContext(action: any, instance: any, actionService) {
    let taskUuid;
    let currentDefectCode = action.config.currentDefectCode;
    let currentAssemblyCode = action.config.currentAssemblyCode;
    let replaceDefectCodesList = this.contextService.getDataByString("#defectCodeList");
    let replaceAssemblyCodesList = this.contextService.getDataByString("#assemblyCodeList");


    if (action.config.taskUuid !== undefined) {
      taskUuid = action.config.taskUuid;
      if (taskUuid.startsWith('#')) {
        taskUuid = this.contextService.getDataByString(taskUuid);
      } else {
        taskUuid = action.config.taskUuid;
      }
    } else {
      if (instance.parentuuid !== undefined) {
        if (instance.parentuuid != null && instance.parentuuid.startsWith('#')) {
          taskUuid = this.contextService.getDataByString(
            instance.parentuuid
          );
        } else {
          taskUuid = instance.parentuuid;
        }
      }
    }

    if (currentDefectCode !== undefined && (currentDefectCode && currentDefectCode.startsWith('#'))) {
      currentDefectCode = this.contextService.getDataByString(currentDefectCode);
    }
    if (currentAssemblyCode && currentAssemblyCode !== undefined && currentAssemblyCode.startsWith('#')) {
      currentAssemblyCode = this.contextService.getDataByString(currentAssemblyCode);
    }
    let occurenceList = {
      "type": "context",
      "config": {
        "requestMethod": "addToExistingContext",
        "target": "occurenceList",
        "sourceData": {
          "taskUuid": taskUuid,
          "defectCodeOccurence": replaceDefectCodesList !== undefined && replaceDefectCodesList !== "" ? replaceDefectCodesList.filter((element) => {
            return element.defectCode === currentDefectCode;
          }).length : "",
          "assemblycodeOccurence": replaceAssemblyCodesList !== undefined && replaceAssemblyCodesList !== "" ? replaceAssemblyCodesList.filter((element) => {
            return element.assemblyCode === currentAssemblyCode;
          }).length : "",
          "currentDefectCode": currentDefectCode,
          "currentAssemblyCode": currentAssemblyCode
        }
      },
      "eventSource": "click"
    }

    actionService.handleAction(occurenceList, instance);

    // let currentItemOccurence = {
    //   "type": "getFilteredFromContext",
    //   "config": {
    //     "target": "#occurenceList",
    //     "key": "currentOccurenceData",
    //     "properties": {
    //       "key": taskUuid
    //     }
    //   },
    //   "eventSource": "click"
    // };

    // this.handleAction(currentItemOccurence, instance);

    // let currentOccurenceData = this.contextService.getDataByString("#currentOccurenceData");

    // console.log(this.contextService);
  }
  getFilteredFromContext(action: any, instance: any) {
    let targetData = action.config.target;
    let key = action.config.properties.key;
    let dataToBeSavedIn = [];
    if (targetData !== undefined && targetData.startsWith('#')) {
      targetData = this.contextService.getDataByString(targetData);
    }
    if (key !== undefined && key.startsWith('#')) {
      key = this.contextService.getDataByString(key);
    } else {
      if (key === "parentUUID" && instance.parentuuid !== undefined) {
        if (instance.parentuuid != null && instance.parentuuid.startsWith('#')) {
          key = this.contextService.getDataByString(
            instance.parentuuid
          );
        } else {
          key = instance.parentuuid;
        }
      }
    }
    dataToBeSavedIn = targetData.filter((element) => {
      return element.taskUuid === key;
    });
    if (dataToBeSavedIn != undefined && dataToBeSavedIn.length > 0) {
      this.contextService.addToContext(action.config.key, dataToBeSavedIn[0]);
    }
  }

  deleteAndUpdateOccurence(action: any, instance: any, actionService) {
    let targetData = action.config.target;
    let key = action.config.key;
    let currentTaskData = action.config.currentTaskData;
    let replaceDefectCodesList = this.contextService.getDataByString("#defectCodeList");
    let replaceAssemblyCodesList = this.contextService.getDataByString("#assemblyCodeList");
    if (targetData !== undefined && targetData.startsWith('#')) {
      targetData = this.contextService.getDataByString(targetData);
    }
    if (key !== undefined && key.startsWith('#')) {
      key = this.contextService.getDataByString(key);
    }
    if (currentTaskData !== undefined && typeof (currentTaskData) == "string" && currentTaskData.startsWith('#')) {
      currentTaskData = this.contextService.getDataByString(currentTaskData);
    }
    // console.log("occureneclist before delete", targetData)
    if (currentTaskData != undefined && currentTaskData !== null && currentTaskData.taskUuid === key) {
      let index = targetData.indexOf(currentTaskData);
      targetData.splice(index, 1);
      if (replaceDefectCodesList && replaceDefectCodesList !== "")
       { replaceDefectCodesList.splice(index, 1); }
      if (replaceAssemblyCodesList && replaceAssemblyCodesList !== "")
       { replaceAssemblyCodesList.splice(index, 1); }
    }

    let clearArrays = [{
      "type": "context",
      "config": {
        "requestMethod": "add",
        "key": "occurenceList",
        "data": []
      },
      "eventSource": "click"
    }];

    clearArrays.forEach((element) => {
      actionService.handleAction(element, instance);
    });
    replaceDefectCodesList = [];
    replaceAssemblyCodesList = [];
    targetData.forEach((currentTargetItem) => {
      replaceDefectCodesList.push({
        "defectCode": currentTargetItem.currentDefectCode
      });
      replaceAssemblyCodesList.push({
        "assemblyCode": currentTargetItem.currentAssemblyCode
      });
      let addDefAndAssToList = [{
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "defectCodeList",
          "data": replaceDefectCodesList
        },
        "eventSource": "click"
      }, {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "assemblyCodeList",
          "data": replaceAssemblyCodesList
        },
        "eventSource": "click"
      }, {
        "type": "addOccurenceToContext",
        "config": {
          "target": "occurenceList",
          "taskUuid": currentTargetItem.taskUuid,
          "currentDefectCode": currentTargetItem.currentDefectCode,
          "currentAssemblyCode": currentTargetItem.currentAssemblyCode
        },
        "eventSource": "click"
      }];

      addDefAndAssToList.forEach((item) => {
        actionService.handleAction(item, instance);
      });

    });

    let occurenceData = this.contextService.getDataByString("#occurenceList");
    // console.log("occureneclist after delete", occurenceData)
  }
}
