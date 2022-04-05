import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/utilities/utility.service';
import { ComponentService } from '../../commonServices/componentService/component.service';
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class CiscoIqaPreScreenService {

  constructor(
    private contextService: ContextService,
    private componentService: ComponentService,
    private utiliyService: UtilityService
  ) { }
  handleInLoop(action, instance, actionService) {
    //have to change the part no.
    // and loop the service.
    let parnoArray: string[] = [];
    let contaxtArray: any[];
    let customAction;

    if (action.config.arrayName.startsWith('#')) {
      contaxtArray = this.contextService.getDataByString(
        action.config.arrayName
      );
    }

    contaxtArray && contaxtArray.forEach((element) => {
      if (element.partNo != '') {
        let str = element.partNo.PCB_IN.split('-');
        let str1 = str[0] + '-' + str[1];
        parnoArray.push(str1);
      }
    });

    for (let i = 0; i < parnoArray.length; i++) {
      customAction = {
        type: 'microservice',
        config: {
          microserviceId: 'getCheckRevisionWithAutoScrap',
          requestMethod: 'get',
          params: {
            revision: parnoArray[i],
            workCenter: '#UnitInfo.WORKCENTER',
            resultCode: '#SelectedResultcode',
          },
        },
        responseDependents: {
          onSuccess: {
            actions: [
              {
                type: 'condition',
                config: {
                  operation: 'isGreaterThan',
                  lhs: '#BomCount',
                  rhs: '0',
                },
                eventSource: 'change',
                responseDependents: {
                  onSuccess: {
                    actions: [
                      {
                        type: 'updateComponent',
                        config: {
                          key: 'IQATimeoutUUID',
                          properties: {
                            disabled: false,
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
          onFailure: {
            actions: [
              {
                type: 'context',
                config: {
                  requestMethod: 'add',
                  key: 'CheckRevisionWithAutoScrap',
                  data: 'responseData',
                },
              },
              {
                type: 'updateComponent',
                config: {
                  key: 'errorTitleUUID',
                  properties: {
                    titleValue: '#CheckRevisionWithAutoScrap',
                    isShown: true,
                  },
                },
              }
            ],
          },
        },
      };
      actionService.handleAction(customAction, instance);
    }
  }
  handleEnabledByParent(action, instance) {
    var refData;
    var key;

    if (action.config.incriment === 0) {
      key = instance.parentuuid + action.config.key;
    } else {
      let count = instance.parentuuid + action.config.incriment;
      key = count + action.config.key;
    }
    if (action.config.action == undefined) {
      if (key != undefined) {
        refData = this.contextService.getDataByKey(key + 'ref');
      }
      if (action.config.property != undefined && refData != undefined) {
        refData.instance.group.controls[action.config.property].enable();
        refData.instance._changeDetectionRef.detectChanges();
      }
    } else if (action.config.action === 'enableAllDropdown') {
      // 1.current index.
      // 2.added data.
      // 3.complete array.

      // 1.enable all dropdown.
      // 2.disabled all part no with data.
      // 3.add pcb values for each part no.

      var allBomsArray = this.contextService.getDataByString(
        action.config.bomList
      );
      var addedBoms = this.contextService.getDataByString(
        action.config.selectedBomList
      );
      var currentIndex = instance.parentuuid;
      var notSelectedBomArray = [];
      var keyList = action.config.keyList;
      var propertyList = action.config.propertyList;
      var trueConfig;

      // check data is added or not.
      allBomsArray && allBomsArray.forEach((element) => {
        let flag = false;
        addedBoms && addedBoms.forEach((ele) => {
          if (ele.assemblyCode === element.assemblyCode) {
            // console.log(ele);
            // added part no to display in the field
            notSelectedBomArray.unshift(element);
            flag = true;
          }
        });
        if (!flag) {
          notSelectedBomArray.push(element);
        }
      });

      for (let index = currentIndex; index < allBomsArray.length; index++) {
        for (let i = 0; i < keyList.length; i++) {
          // To enable the fields.
          refData = this.contextService.getDataByKey(
            index + keyList[i] + 'ref'
          );
          if (keyList[i] === 'PCB_INUUID' || keyList[i] === 'serialNoUUID') {
            refData.instance.group.controls[propertyList[i]].disable();
            refData.instance._changeDetectionRef.detectChanges();
          } else {
            refData.instance.group.controls[propertyList[i]].enable();
            refData.instance._changeDetectionRef.detectChanges();
          }
          // to update condition dropdown and show proper values
          if (keyList[i] === 'allConditionUUID') {
            trueConfig = {
              config: {
                key: index + keyList[i],
                properties: {
                  hidden: false,
                  defaultValue: 'Missing',
                },
              },
            };

            refData.instance.group.controls[refData.instance.name].setValue(
              'Missing'
            );
            refData.instance._changeDetectionRef.detectChanges();
          } else if (
            keyList[i] === 'missingConditionUUID' ||
            keyList[i] === 'normalConditionUUID'
          ) {
            trueConfig = {
              config: {
                key: index + keyList[i],
                properties: {
                  hidden: true,
                },
              },
            };
          } else if (keyList[i] === 'PCB_INUUID') {
            trueConfig = {
              config: {
                key: index + keyList[i],
                properties: {
                  value: notSelectedBomArray[index].pcbPartNo,
                },
              },
            };
          } else if (keyList[i] === 'pcbUUID') {
            trueConfig = {
              config: {
                key: index + keyList[i],
                properties: {
                  text: notSelectedBomArray[index].compPartNo,
                },
              },
            };
          } else if (keyList[i] === 'serialNoUUID') {
            trueConfig = {
              config: {
                key: index + keyList[i],
                properties: {
                  placeholder: 'xxxxxxxxxxxx',
                },
              },
            };
          }
          this.componentService.handleUpdateComponent(trueConfig, instance, '', this.utiliyService);
        }
      }
    }
  }
  handleTruncket(action, instance) {
    // "position": "end",
    // "count": 4,
    // "key": "pcbOutBoundValue",
    // "data": "#partno.PCB_IN"
    let contextData: string;

    if (action.config !== undefined) {
      if (action.config.position === 'end') {
        if (
          action.config.data != undefined &&
          action.config.data.startsWith('#')
        ) {
          contextData = this.contextService.getDataByString(action.config.data);
        }
        // Sushnat
        let substr = contextData.substring(
          contextData.length - action.config.count,
          contextData.length
        );
        this.contextService.addToContext(action.config.key, substr);
      }
    }
  }
}
