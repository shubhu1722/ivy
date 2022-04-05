import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class CiscoECObookingService {

  constructor(
    private contextService: ContextService,
  ) { }
  changeResultCode(action, instance, actionService) {
    let data: any;
    let sortedValue = [];
    if (!action.operation && action.operation === undefined) {
      if (action.config.data && action.config.data.startsWith("#")) {
        data = this.contextService.getDataByString(action.config.data);
      }
      if (data && data instanceof Object && data.items.length > 0) {
        data.items && data.items.forEach(element => {
          if (element.ctype == "taskPanel") {
            element.items && element.items.forEach(item => {
              if (item.ctype == "actionToggle") {
                let obj;
                let type;
                let title;
                let status = "";
                title = element.header.title;
                title = this.removeHTML(title);
                if (element.header.status) {
                  status = element.header.status;
                }
                type = title.split(" ")[0];
                obj = {
                  title: element.header.title,
                  actionToggelUUID: item.uuid,
                  type: type,
                  selection: status,
                };
                sortedValue.push(obj);
              }
            })
          }
        });
      }
      this.contextService.addToContext("ecoSortedData", sortedValue);

      let completed = sortedValue.filter(e => e.selection == "")
      if (sortedValue && sortedValue.length > 0) {
        if (completed.length === 0) {
          let ele = {
            "type": "updateComponent",
            "config": {
              "key": "revisedBarcodeUUID",
              "properties": {
                "expanded": true,
                "disabled": false
              }
            }
          }
          actionService.handleAction(ele, instance);
        }
      }

    } else if (action.operation && action.operation === "pushAction") {
      this.pushEcoAction(action, instance, actionService);
    }
  }

  pushEcoAction(action, instance, actionService) {
    let data = this.contextService.getDataByString("#ecoSortedData");
    let resultCode = "";
    let rework = 0;
    let bga = 0;
    let tAndC = 0;
    let test = 0;
    let debug = 0;
    let config = 0;
    let rClist;
    let temp;

    if (data instanceof Array && data.length > 0) {
      data && data.forEach(element => {
        if (instance.uuid === element.actionToggelUUID) {
          element.selection = action.selectedValue;
        }
      })
    }

    data && data.forEach(element => {
      if (element.type === "Rework" && element.selection === "OPEN") {
        rework = rework + 1
      } else if (element.type === "BGA" && element.selection === "OPEN") {
        bga = bga + 1
      } else if (element.type === "T&C" && element.selection === "OPEN") {
        tAndC = tAndC + 1
      } else if (element.type === "Test" && element.selection === "OPEN") {
        test = test + 1
      } else if (element.type.toUpperCase() === "DEBUG" && element.selection === "OPEN") {
        debug = debug + 1
      } else if (element.type === "Config" && element.selection === "OPEN") {
        config = config + 1
      }
    });

    rClist = this.contextService.getDataByString("#ResultCodes");
    let minValue = rClist[0];
    rClist && rClist.forEach(element => {
      if (element.priority < minValue.priority) {
        minValue = element;
      }
    });

    if (rework > 0 && bga === 0) {
      temp = rClist.filter(el => el.resultCode.includes("REW"));
      if (temp.length > 0) {
        resultCode = temp[0].resultCode;
      }
    } else if (rework === 0 && bga > 0) {
      temp = rClist.filter(el => el.resultCode.includes("BGA"));
      if (temp.length > 0) {
        resultCode = temp[0].resultCode;
      } else {
        temp = rClist.filter(el => el.resultCode.includes("REW"));
        if (temp.length > 0) {
          resultCode = temp[0].resultCode;
        }
      }
    } else if (rework > 0 && bga > 0) {
      temp = rClist.filter(el => el.resultCode.includes("BGA"));
      if (temp.length > 0) {
        resultCode = temp[0].resultCode;
      } else {
        temp = rClist.filter(el => el.resultCode.includes("REW"));
        if (temp.length > 0) {
          resultCode = temp[0].resultCode;
        }
      }
    } else if (rework === 0 && bga === 0 && tAndC > 0) {
      temp = rClist.filter(el => el.priority == minValue.priority);
      resultCode = temp[0].resultCode;

    } else if (rework === 0 && bga === 0 && test > 0) {
      temp = rClist.filter(el => el.priority == minValue.priority);
      resultCode = temp[0].resultCode;

    } else if (rework === 0 && bga === 0 && debug > 0) {
      temp = rClist.filter(el => el.priority == minValue.priority);
      resultCode = temp[0].resultCode;

    } else if (rework === 0 && bga === 0 && config > 0) {
      temp = rClist.filter(el => el.priority == minValue.priority);
      resultCode = temp[0].resultCode;
    }

    let enableComponent = [
      {
        "type": "enableComponent",
        "config": {
          "key": "ResultCodes",
          "property": "ResultCodes"
        }
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "ResultCodes",
          "fieldProperties": {
            "ResultCodes": resultCode
          }
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "SelectedResultcode",
          "data": resultCode
        }
      }
    ]

    let disabledComponent = [
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "SelectedResultcode",
          "data": ""
        }
      }
    ]

    // if (resultCode && resultCode !== "") {
    //   enableComponent.forEach((ele) => {
    //     actionService.handleAction(ele, instance);
    //   });
    // } else {
    //   disabledComponent.forEach((ele) => {
    //     actionService.handleAction(ele, instance);
    //   });
    //   let resCode = this.contextService.getDataByKey('ResultCodesref');
    //   if (resCode !== undefined)
    //     resCode.instance.group.reset()
    // }
  }

  removeHTML(str) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = str;
    return tmp.textContent || tmp.innerText || "";
  }
}
