import { data } from '../../../data';
import { startWith } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ContextService } from '../contextService/context.service';
import { FormGroup } from '@angular/forms';
import { UtilityService } from '../../../utilities/utility.service';

@Injectable({
  providedIn: 'root',
})
export class CustomeService {
  constructor(
    private contextService: ContextService,
    private utilityService: UtilityService
  ) { }
  handleAccessoriesAction(action, instance) {
    const flexarray: any[] = this.contextService.getDataByString(
      action.config.source
    );
    let displayAccessory: boolean = false;
    let isPresent: boolean = false;
    for (var i = 0, len = flexarray.length; i < len; i++) {
      if (flexarray[i].Value == instance.tileValue) {
        isPresent = true;
        break;
      }
    }
    /// We need to allow multiple accessories of same type - CR #26
    if (true) {
      for (var i = 0, len = flexarray.length; i < len; i++) {
        if (instance.tileValue !== 'Other' || (instance.dellReceiving != undefined && instance.dellReceiving)) {
          if (flexarray[i].Value == 'NONE' && flexarray[i].Name !== 'Other') {
            displayAccessory = true;
            flexarray[i].Value = instance.tileValue;
            break;
          }
        }
      }
    }

    if (instance.tileValue === 'Other' && instance.dellReceiving == undefined) {
      let isOtherAccessoryClicked = this.contextService.getDataByKey(
        'otherAccessoryClicked'
      );
      /// check if 'Other Accessory' has been clicked before
      if (isOtherAccessoryClicked) {
        displayAccessory = false;
      } else {
        displayAccessory = true;
        this.contextService.addToContext('otherAccessoryClicked', true);
      }
    }

    return displayAccessory;
  }

  /**
   * @param action to be perfomed
   * @param instance is component instance
   */
  handleflexarray(action, instance) {
    let contextKey: any = this.contextService.getDataByString(
      action.config.source
    );
    if (contextKey === '') {
      const splitArray = action.config.source.split('.');
      const contextvalue = splitArray.shift().split('#')[1];
      this.contextService.addToContext(contextvalue, []);
      const contextitem: any[] = this.contextService.getDataByString(
        action.config.source
      );
      let obj = {
        PCB_IN: '',
        SN_IN: '',
        CONDITION: '',
        TAN_IN: '',
        MAC_IN: '',
      };
      let returnobj = this.checkindex(obj, instance);
      contextitem.push(returnobj);
    } else {
      let isMatchFound: boolean = false;

      // looping the
      for (let i = 0; i < contextKey.length; i++) {
        if (i == instance.parentuuid) {
          let entryobj = contextKey[i];
          Object.keys(entryobj).forEach((key) => {
            // console.log(entryobj[key]);
            if (instance.name === key) {
              entryobj[key] = instance.group.value[instance.name];
            } else if (key === 'CONDITION') {
              if (
                instance.name === 'normalCondition' &&
                instance.group.value[instance.name] !== ''
              ) {
                entryobj[key] = instance.group.value[instance.name];
              } else if (
                instance.name === 'missingCondition' &&
                instance.group.value[instance.name] !== '-Select-'
              ) {
                entryobj[key] = instance.group.value[instance.name];
              } else if (
                instance.name === 'condition' &&
                instance.group.value[instance.name] !== ''
              ) {
                entryobj[key] = instance.group.value[instance.name];
              }
            }
          });
          isMatchFound = true;
        }
      }
      if (action.config.key === undefined) {
        if (!isMatchFound) {
          let obj = {
            PCB_IN: '',
            SN_IN: '',
            CONDITION: '',
            TAN_IN: '',
            MAC_IN: '',
          };
          let returnobj = this.checkindex(obj, instance);
          contextKey.push(returnobj);
        }
      }
    }
    for (let k = 0; k < contextKey.length; k++) {
      if (action.config.key != undefined) {
        if (contextKey[k].hasOwnProperty(action.config.key)) {
          contextKey[k][action.config.key] =
            instance.group.value[instance.name];
        }
      }
    }
  }

  checkindex(obj, instance) {
    Object.keys(obj).forEach((key) => {
      if (instance.name === key) {
        obj[key] = instance.group.value[instance.name];
      }
    });
    return obj;
  }

  handlecombineArray(action) {
    let leftarray: any[] = this.contextService.getDataByString(
      action.config.leftarray
    );
    /// filter out array where condition is empty or missing
    leftarray = leftarray.filter(
      (x) =>
        x.CONDITION !== undefined && x.CONDITION && x.CONDITION !== 'Missing'
    );
    const rightarray: any[] = this.contextService.getDataByString(
      action.config.rightarray
    ); //bomarray
    let splitArray = action.config.source.split('.');
    let contextvalue = splitArray.shift().split('#')[1];
    let tempcontextarray = [];
    for (let i = 0; i < leftarray.length; i++) {
      // for (let j = 0; j < rightarray.length; j++) {
      let flexobj = leftarray[i];
      let obj = {
        assemblyCode: rightarray[i].assemblyCode,
        operation: 'Add',
        flexFieldList: { flexField: [] },
      };
      var result = Object.entries(flexobj).map(([name, value]) => ({
        name,
        value,
      }));
      result && result.forEach((x) => {
        /// check if MAC_IN is empty
        if (x.name === 'MAC_IN' && x.value === '') {
          x.value = 'NOMAC';
        }
      });
      obj.flexFieldList.flexField = result;
      tempcontextarray.push(obj);
      // }
    }

    var uniquearray = tempcontextarray.reduce((unique, o) => {
      if (!unique.some((obj) => obj.assemblyCode === o.assemblyCode)) {
        unique.push(o);
      }
      return unique;
    }, []);
    this.contextService.addToContext(contextvalue, uniquearray);

  }

  handleMissing(action) {
    var arrayOfMissing: any[] = [];
    var restOptions: any[] = [];
    let contaxtArray: any[];

    if (action.startsWith('#')) {
      contaxtArray = this.contextService.getDataByString(action);
    }
    // function to handle the missing option from iqa prescreen.
    contaxtArray && contaxtArray.forEach((element) => {
      if (element.flextFieldValue === 'Missing') {
        arrayOfMissing.push(element);
      } else {
        restOptions.push(element);
      }
    });
    // add arrays to context to handle the missing situation.
    this.contextService.addToContext('arrayOfMissing', arrayOfMissing);
    this.contextService.addToContext('restOptions', restOptions);
  }

  /**
   * Method to handle string methods
   * @param action: what type of action we need to perform on strings.
   * @param instance: instance of particular component to which we perform action.
   */
  handleStringData(action, instance) {
    // if we have to handle any string methods in future we can handle here.
    if (action.config.type === 'concat') {
      if (action.config.data === 'formData') {
        let contextData = this.contextService.getDataByString(
          action.config.key
        );
        contextData = action.config.value
          ? contextData.concat(instance.group.value[action.config.value])
          : contextData.concat(instance.group.value);
        this.contextService.addToContext(
          action.config.key.split('#')[1],
          contextData
        );
      }
    } else if (action.config.type === 'add') {
      if (action.config.data === 'formData') {
        let contextData = this.contextService.getDataByString(
          action.config.key
        );
        contextData = action.config.value
          ? instance.group.value[action.config.value]
          : instance.group.value;
        this.contextService.addToContext(
          action.config.key.split('#')[1],
          contextData
        );
      }
    }
  }

  checkIfChildGroupsValid(): boolean {
    let finalFormGroup: FormGroup;
    finalFormGroup = this.contextService.getDataByKey('flexFieldsFormGroup');
    const controls = finalFormGroup.controls;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        if (controls[key].status === 'INVALID') {
          return false;
        }
        // else {
        //   /// check if children are valid
        //   if (controls[key].value && typeof controls[key].value === 'object') {
        //     const childFormControls = controls[key].value;
        //     for (const key in childFormControls) {
        //       if (childFormControls[key].status === 'INVALID') {
        //         return false;
        //       }
        //     }
        //   }
        // }
      }
    }
    return true;
  }

  checkIfGroupsValid(): boolean {
    let isValid = false;
    let formGroupArray: any[];
    formGroupArray = this.contextService.getDataByKey('flexFieldsFormGroup');
    if (formGroupArray !== undefined) {
      for (let i = 0; i < formGroupArray.length; i++) {
        const controls = formGroupArray[i].controls;
        if (formGroupArray[i].status === 'INVALID') {
          isValid = false;
          return false;
        } else {
          if (
            controls['PCB_IN'] !== undefined &&
            controls['PCB_IN'].status === 'VALID' &&
            controls['PCB_IN'].value !== undefined &&
            controls['PCB_IN'].value !== '' &&
            controls['PCB_IN'].value !== null
          ) {
            isValid = true;
          } else {
            if (
              controls['PCB_IN'] !== undefined &&
              controls['PCB_IN'].status !== 'DISABLED'
            ) {
              isValid = false;
              return false;
            }
          }

          if (
            controls['SN_IN'] !== undefined &&
            controls['SN_IN'].status === 'VALID' &&
            controls['SN_IN'].value !== undefined &&
            controls['SN_IN'].value !== '' &&
            controls['SN_IN'].value !== null
          ) {
            isValid = true;
          } else {
            if (
              controls['SN_IN'] !== undefined &&
              controls['SN_IN'].status !== 'DISABLED'
            ) {
              isValid = false;
              return false;
            }
          }

          if (
            controls['condition'] !== undefined &&
            controls['condition'].status === 'VALID' &&
            controls['condition'].value !== undefined &&
            controls['condition'].value !== '' &&
            controls['condition'].value !== null &&
            controls['condition'].value
          ) {
            isValid = true;
          } else if (
            controls['normalCondition'] !== undefined &&
            controls['normalCondition'].status === 'VALID' &&
            controls['normalCondition'].value !== undefined &&
            controls['normalCondition'].value !== '' &&
            controls['normalCondition'].value !== null &&
            controls['normalCondition'].value &&
            controls['normalCondition'].status !== 'DISABLED'
          ) {
            isValid = true;
          } else {
            if (
              controls['condition'] !== undefined &&
              controls['normalCondition'] !== undefined &&
              controls['condition'].status !== 'DISABLED'
            ) {
              isValid = false;
              return false;
            }
          }

          // if (controls['normalCondition'] !== undefined && controls['normalCondition'].status === 'VALID' && controls['normalCondition'].value !== undefined &&
          //   controls['normalCondition'].value !== '' && controls['normalCondition'].value !== 'null' && controls['normalCondition'].value) {
          //   isValid = true;
          // } else {
          //   if (controls['normalCondition'] !== undefined && controls['normalCondition'].status !== 'DISABLED') {
          //     isValid = false;
          //     return false;
          //   }
          // }
        }
      }
    }
    return isValid;
  }

  iterateEachControl(controls) {
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        if (controls[key].status !== 'DISABLED') {
          if (
            controls[key].status === 'VALID' &&
            (controls[key].value !== undefined || controls[key].value !== '')
          ) {
            /// control is valid
          } else {
            /// control is invalid
            return false;
          }
        }
      }
    }
  }

  handelRupiFunction(action, instance) {
    setTimeout(() => {
      let index = instance.actionIndex;
      let names = instance.names;
      let components = instance.group.controls;
      let array = instance.dataArray[index];
      let fieldValue = action.config.partNo;
      let pcbValue;

      if (components[names[0] + index].status === 'VALID') {
        if (fieldValue.startsWith('#')) {
          fieldValue = this.contextService.getDataByString(fieldValue);
        }
        let result = array.map((a) =>
          a.assemblyCode.charAt(a.assemblyCode.length - 1)
        );
        array && array.forEach((element) => {
          let re = new RegExp('^' + element.compRegexp);
          if (re.test(fieldValue)) {
            pcbValue =
              element.compPartNo +
              ' ' +
              element.assemblyCode.charAt(element.assemblyCode.length - 1);
          }
        });

        components[names[1] + index].setValue(pcbValue);
        if (instance.conditionDD[index] !== 'all') {
          //if(instance.conditionDD[index] !== 'missing'){
          components[names[2] + index].enable();
          //}
          instance.conditionDD.splice(index, 1, 'normal');
        }
      }
    }, 500);
  }

  handleRevisedLabelsFAData(action, instance) {
    let pcbyMainPartData = [];
    let assemblyCodeChange = [];
    let workCenterFlexfield = [];

    /// For printing
    let printParamsObj = {};
    let printInputKeys = [
      'KIRUS-WCFF_14300',
      'KIRUS-WCFF_14301',
      'KIRUS-WCFF_14302',
      'KIRUS-WCFF_14303',
      'KIRUS-WCFF_14304',
      'KIRUS-WCFF_14305',
      'KIRUS-WCFF_14306',
      'KIRUS-WCFF_14307',
      'KIRUS-WCFF_14308',
      'KIRUS-WCFF_14309',
      'KIRUS-WCFF_14310',
      'KIRUS-WCFF_14469',
      'KIRUS-OUTCOMECODEID',
      'KIRUS-UNITBCN',
    ];
    let unitBcnKey = printInputKeys.pop();
    let outcomeCodeKey = printInputKeys.pop();
    let unitInfo = this.contextService.getDataByKey('UnitInfo');
    let macInfo = this.contextService.getDataByKey('macAddress');
    let macAddress = '';
    if (macInfo != null && macInfo != undefined) {
      macAddress = macInfo.macAddress;
    }

    if (macAddress == 'NOMAC') {
      macAddress = '';
    }
    printParamsObj[printInputKeys[0]] = macAddress;

    pcbyMainPartData = this.contextService.getDataByKey('getPCBByMainPart');

    /// Find out the TAN_IN data
    let tanInDataArray = pcbyMainPartData.filter((x) => x.ffType === 'TAN_IN');

    tanInDataArray && tanInDataArray.forEach((tanInData, index) => {
      let count = index + 1;
      let tanRevisionLevelInbound;
      let tanRevisionLevelOutbound;
      let tanAssemblyCode;
      if (tanInData != undefined && tanInData.revisionLevelInbound != undefined) {
        tanRevisionLevelInbound = tanInData.revisionLevelInbound;
      }
      if (tanInData != undefined && tanInData.revisionLeveloutbound != undefined) {
        tanRevisionLevelOutbound = tanInData.revisionLeveloutbound;
      }
      if (tanInData != undefined && tanInData.assemblyCode != undefined) {
        tanAssemblyCode = tanInData.assemblyCode;
      }

      let tanSerialNumber = '';
      if (
        tanInData &&
        tanInData.serialNumber != '' &&
        tanInData.serialNumber != undefined &&
        tanInData.serialNumber != null
      ) {
        tanSerialNumber = tanInData.serialNumber;
        if (tanInData && tanInData.serialNumber == '' || tanInData.serialNumber == undefined) {
          tanSerialNumber = '.';
        }
      } else {
        if (tanInData && tanInData != undefined) {
          if (
            tanInData.serialNumber == '' ||
            tanInData.serialNumber == undefined ||
            tanInData.serialNumber == null
          ) {
            tanSerialNumber = '.';
          }
        } else {
          tanSerialNumber = '.';
        }

      }
      let tanPartNumber
      if (tanRevisionLevelInbound && tanRevisionLevelInbound != undefined) {
        tanPartNumber = tanRevisionLevelInbound.slice(
          0,
          tanRevisionLevelInbound.lastIndexOf('-')
        );
      }
      let tanRevInbound
      if (tanRevisionLevelInbound && tanRevisionLevelInbound != undefined) {
        tanRevInbound = this.utilityService.splitByHyphenAndRemoveSpace(
          tanRevisionLevelInbound
        );
      }
      let tanRevOutbound
      if (tanRevisionLevelOutbound && tanRevisionLevelOutbound != undefined) {
        tanRevOutbound = this.utilityService.splitByHyphenAndRemoveSpace(
          tanRevisionLevelOutbound
        );
      }


      /// Lets create the assemblyCodeChange data
      assemblyCodeChange.push({
        assemblyCode: tanAssemblyCode,
        operation: 'Update',
        serialNumber: tanSerialNumber,
        flexFieldList: {
          flexField: [
            {
              name: 'TAN_OUT',
              value: tanRevisionLevelOutbound,
            },
          ],
        },
      });

      /// Lets create the workcenteflexfield data
      if (count == 1) {
        workCenterFlexfield.push(
          {
            name: 'MAC Address',
            value: macAddress ? macAddress : 'NO MAC',
          },
          {
            name: 'TAN Part Number',
            value: tanPartNumber,
          },
          {
            name: 'TAN Revision Level Inbound',
            value: tanRevInbound,
          },
          {
            name: 'TAN Revision Level Outbound',
            value: tanRevOutbound,
          }
        );
      }
      /// Lets create printing data
      printParamsObj[printInputKeys[1]] = tanPartNumber;
      printParamsObj[printInputKeys[2]] = tanRevInbound;
      printParamsObj[printInputKeys[3]] = tanRevOutbound;
    })
    /// Find out the PCB_IN data
    let pcbDataArray = pcbyMainPartData.filter((x) => x.ffType === 'PCB_IN');

    let firstpcbRevOutboundValue;

    /// Lets create the PCB_IN data
    pcbDataArray && pcbDataArray.forEach((pcbData, index) => {
      let count = index + 1;
      let pcbRevisionLevelInbound = pcbData.revisionLevelInbound;
      let pcbRevisionLevelOutbound = pcbData.revisionLeveloutbound;
      let pcbAssemblyCode = pcbData.assemblyCode;
      let serialNumber = '.';
      let printSerialNumber = '';
      if (
        pcbData.serialNumber != '' &&
        pcbData.serialNumber != undefined &&
        pcbData.serialNumber != null
      ) {
        serialNumber = pcbData.serialNumber;
        if (
          pcbData.serialNumber == '' ||
          pcbData.serialNumber == undefined ||
          pcbData.serialNumber == null
        ) {
          serialNumber = '.';
        }
        if (serialNumber == '.') {
          printSerialNumber = '';
        } else {
          printSerialNumber = serialNumber;
        }
      }

      let pcbPartNumber = pcbRevisionLevelInbound.slice(
        0,
        pcbRevisionLevelInbound.lastIndexOf('-')
      );
      let pcbRevInbound = this.utilityService.splitByHyphenAndRemoveSpace(
        pcbRevisionLevelInbound
      );
      let pcbRevOutbound = this.utilityService.splitByHyphenAndRemoveSpace(
        pcbRevisionLevelOutbound
      );
      assemblyCodeChange.push({
        assemblyCode: pcbAssemblyCode,
        operation: 'Update',
        serialNumber: serialNumber,
        flexFieldList: {
          flexField: [
            {
              name: 'PCB_OUT',
              value: pcbRevisionLevelOutbound,
            },
          ],
        },
      });

      /// min - 1 and max -2 for PCB entries
      if (count < 3) {
        workCenterFlexfield.push(
          {
            name: `PCB ${count} Part Number`,
            value: pcbPartNumber,
          },
          {
            name: `PCB ${count} Serial Number`,
            value: serialNumber,
          },
          {
            name: `PCB ${count} Revision Level Inbound`,
            value: pcbRevInbound,
          },
          {
            name: `PCB ${count} Revision Level Outbound`,
            value: pcbRevOutbound,
          }
        );

        if (count === 1) {
          /// Lets create printing data
          printParamsObj[printInputKeys[4]] = pcbPartNumber;
          printParamsObj[printInputKeys[5]] = printSerialNumber;
          printParamsObj[printInputKeys[6]] = pcbRevInbound;

          firstpcbRevOutboundValue = pcbRevOutbound;

          /// If total number of PCB is one
          if (pcbDataArray.length === 1) {
            printParamsObj[printInputKeys[7]] = '';
            printParamsObj[printInputKeys[8]] = '';
            printParamsObj[printInputKeys[9]] = '';
            printParamsObj[printInputKeys[10]] = '';
            printParamsObj[printInputKeys[11]] = firstpcbRevOutboundValue;
          }
        }

        if (count === 2) {
          /// Lets create printing data
          printParamsObj[printInputKeys[7]] = pcbPartNumber;
          printParamsObj[printInputKeys[8]] = printSerialNumber;
          printParamsObj[printInputKeys[9]] = pcbRevInbound;
          printParamsObj[printInputKeys[10]] = pcbRevOutbound;
          printParamsObj[printInputKeys[11]] = firstpcbRevOutboundValue;
        }
      }
    });

    if (pcbDataArray.length == 0) {
      /// Lets create printing data
      printParamsObj[printInputKeys[4]] = '';
      printParamsObj[printInputKeys[5]] = '';
      printParamsObj[printInputKeys[6]] = '';
      printParamsObj[printInputKeys[7]] = '';
      printParamsObj[printInputKeys[8]] = '';
      printParamsObj[printInputKeys[9]] = '';
      printParamsObj[printInputKeys[10]] = '';
      printParamsObj[printInputKeys[11]] = '';
    }

    let outComeCode = this.contextService.getDataByString(
      '#SelectedResultcode'
    );
    if (outComeCode == undefined || outComeCode == null) {
      outComeCode = '';
    }
    printParamsObj[outcomeCodeKey] = outComeCode;
    printParamsObj[unitBcnKey] =
      unitInfo !== undefined ? unitInfo.ITEM_BCN : '';

    this.contextService.addToContext('oneprintParams', printParamsObj);
    this.contextService.addToContext('assemblyCodeChange', assemblyCodeChange);
    this.contextService.addToContext(
      'workcenterFlexFieldData',
      workCenterFlexfield
    );
  }

  manageData(action, instance) {
    let fieldFormatData = [];
    let sortedData = [];
    let pcbData;
    this.contextService.addToContext('actionCodeChange', []);
    this.contextService.addToContext('defectCodeChange', []);

    if (action.config.taskPanel && action.config.taskPanel == 'rupi') {
      let previousAssembly = this.contextService.getDataByString(
        action.config.previousAssembly
      );
      let previosData = '';
      let names = ['pcb_in', 'pcbName', 'serialNo', 'condition', 'tan_in'];
      pcbData = this.contextService.getDataByString(action.config.data);
      let margedData = pcbData.TAN_IN.concat(pcbData.BOMLIST);
      margedData = margedData.sort(function (a, b) {
        var nameA = a.assemblyCode;
        var nameB = b.assemblyCode;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      });
      margedData && margedData.forEach((element) => {
        let compairStr = element.assemblyCode.substring(
          0,
          element.assemblyCode.length - 1
        );
        if (compairStr !== previosData) {
          previosData = compairStr;
          let temp = margedData.filter((ele) =>
            ele.assemblyCode.includes(compairStr)
          );
          sortedData.push(temp);
        }
      });

      sortedData && sortedData.forEach((element, i) => {
        let pcbValue = instance.group.controls[names[0] + i].value;
        let conditionVal = instance.group.controls[names[3] + i].value;
        let tanValue = instance.group.controls[names[4] + i].value;

        let obj = [
          {
            name: 'PCB_IN',
            value: instance.group.controls[names[0] + i].value
              ? instance.group.controls[names[0] + i].value
              : '.',
          },
          {
            name: 'SN_IN',
            value: '.',
          },
          {
            name: 'CONDITION',
            value: instance.group.controls[names[3] + i].value
              ? instance.group.controls[names[3] + i].value
              : '.',
          },
          {
            name: 'TAN_IN',
            value: instance.group.controls[names[4] + i].value
              ? instance.group.controls[names[4] + i].value
              : '.',
          },
          {
            name: 'MAC_IN',
            value: '.',
          },
        ];

        if (pcbValue !== null || tanValue !== null) {
          let filteredValue = element.filter((a) => {
            let re = new RegExp(a.compRegexp);
            if (re.test(pcbValue)) {
              return true;
            } else if (pcbValue === null) {
              if (re.test(tanValue)) {
                return true;
              }
            }
          });

          // Update the operation and push the value into FA assembly.
          // const avilabel = previousAssembly.findIndex(previousAssembly => previousAssembly.assemblyCode === filteredValue[0].assemblyCode);
          let currentAssembly = filteredValue[0].assemblyCode.substring(
            0,
            filteredValue[0].assemblyCode.length - 1
          );
          let avilabel = -1;

          if (previousAssembly) {
            avilabel = previousAssembly.findIndex((previousAssembly) =>
              previousAssembly.assemblyCode.includes(currentAssembly)
            );
          }

          let preAssembly =
            avilabel > -1 ? previousAssembly[avilabel].assemblyCode : '';
          let curAssembly = filteredValue[0].assemblyCode;

          if (preAssembly !== curAssembly) {
            let assemblyCodeChange = {
              assemblyCode: filteredValue[0].assemblyCode,
              operation: 'Add',
              serialNumber:
                instance.group.controls[names[2] + i].value === ''
                  ? '.'
                  : instance.group.controls[names[2] + i].value,
              flexFieldList: {
                flexField: obj,
              },
            };

            if (conditionVal !== 'Missing') {
              fieldFormatData.push(assemblyCodeChange);
            }

            if (avilabel > -1) {
              let assemblyCodeChange = {
                assemblyCode: preAssembly,
                operation: 'Delete',
                serialNumber:
                  instance.group.controls[names[2] + i].value === ''
                    ? '.'
                    : instance.group.controls[names[2] + i].value,
                flexFieldList: {
                  flexField: obj,
                },
              };
              fieldFormatData.push(assemblyCodeChange);
            }
          } else if (preAssembly === curAssembly) {
            // if valueis there and condition is missing then operation will be delete.
            // if its not missing then operation will be Update.
            if (conditionVal === 'Missing') {
              let assemblyCodeChange = {
                assemblyCode: filteredValue[0].assemblyCode,
                operation: 'Delete',
                serialNumber:
                  instance.group.controls[names[2] + i].value === ''
                    ? '.'
                    : instance.group.controls[names[2] + i].value,
                flexFieldList: {
                  flexField: obj,
                },
              };
              fieldFormatData.push(assemblyCodeChange);
            } else {
              let assemblyCodeChange = {
                assemblyCode: filteredValue[0].assemblyCode,
                operation: 'Update',
                serialNumber:
                  instance.group.controls[names[2] + i].value === ''
                    ? '.'
                    : instance.group.controls[names[2] + i].value,
                flexFieldList: {
                  flexField: obj,
                },
              };
              fieldFormatData.push(assemblyCodeChange);
            }
          }
        }
      });
      this.contextService.addToContext('fieldFormatData', fieldFormatData);
    } else if (action.config.taskPanel && action.config.taskPanel == 'tan') {
      let previousAssembly = this.contextService.getDataByString(
        action.config.previousAssembly
      );
      let tanValue = instance.group.controls['PartNumber'].value;
      pcbData = this.contextService.getDataByString(action.config.data);
      let contextData = this.contextService.getDataByString('#fieldFormatData');
      let additionalInfo = (action.config.additionalInfo = [
        { ParentSerial: '#UnitInfo.SERIAL_NO' },
      ]);
      let serialNumber = '.';
      let assemblyCodeChange;
      if (additionalInfo != null && additionalInfo != undefined) {
        additionalInfo && additionalInfo.forEach((additionalItem) => {
          if (
            additionalItem.ParentSerial != null &&
            additionalItem.ParentSerial != undefined
          ) {
            serialNumber = additionalItem.ParentSerial;
          }
        });
      }

      if (
        this.utilityService.isString(serialNumber) &&
        serialNumber.startsWith('#')
      ) {
        serialNumber = this.contextService.getDataByString(serialNumber);
      }
      let obj = [
        {
          name: 'PCB_IN',
          value: '.',
        },
        {
          name: 'SN_IN',
          value: '.',
        },
        {
          name: 'CONDITION',
          value: '.',
        },
        {
          name: 'TAN_IN',
          value: tanValue,
        },
        {
          name: 'MAC_IN',
          value: '.',
        },
      ];
      // let filteredValue = pcbData.filter(a => a.compRegexp.test(tanValue));
      let filteredValue;
      pcbData && pcbData.forEach((element) => {
        let re = new RegExp(element.compRegexp);
        if (re.test(tanValue)) {
          filteredValue = element.assemblyCode;
        }
      });

      if (
        contextData == undefined ||
        contextData == null ||
        contextData == ''
      ) {
        this.contextService.addToContext('fieldFormatData', fieldFormatData);
        contextData = this.contextService.getDataByString('#fieldFormatData');
      }

      let currentAssembly = filteredValue.substring(
        0,
        filteredValue.length - 1
      );
      let avilabel = -1;
      if (previousAssembly) {
        avilabel = previousAssembly.findIndex((previousAssembly) =>
          previousAssembly.assemblyCode.includes(currentAssembly)
        );
      }
      let preAssembly =
        avilabel > -1 ? previousAssembly[avilabel].assemblyCode : '';
      let curAssembly = filteredValue;

      // if (avilabel !== -1) {
      if (preAssembly === curAssembly) {
        assemblyCodeChange = {
          assemblyCode: filteredValue,
          operation: 'Update',
          serialNumber: serialNumber,
          flexFieldList: {
            flexField: obj,
          },
        };
        contextData.push(assemblyCodeChange);
      } else {
        assemblyCodeChange = {
          assemblyCode: filteredValue,
          operation: 'Add',
          serialNumber: serialNumber,
          flexFieldList: {
            flexField: obj,
          },
        };
        contextData.push(assemblyCodeChange);

        if (avilabel > -1) {
          assemblyCodeChange = {
            assemblyCode: preAssembly,
            operation: 'Delete',
            serialNumber: serialNumber,
            flexFieldList: {
              flexField: obj,
            },
          };
          contextData.push(assemblyCodeChange);
        }
      }
    } else if (action.config.taskPanel && action.config.taskPanel == 'mac') {
      let macValue = instance.group.controls['MacDetails'].value;
      // let faOpration = action.config.faOpration;
      if (macValue === '' || macValue === undefined || macValue === null) {
        macValue = 'NOMAC';
      }
      let contextData = this.contextService.getDataByString('#fieldFormatData');
      contextData && contextData.forEach((element, index) => {
        if (element.flexFieldList.flexField[0].value == '.') {
          if (element.flexFieldList.flexField[4].name === 'MAC_IN') {
            element.flexFieldList.flexField[4].value = macValue;
          }
        } else if (
          index == 0 &&
          element.flexFieldList.flexField[3].value != '.' &&
          element.flexFieldList.flexField[0].value != '.'
        ) {
          if (element.flexFieldList.flexField[4].name === 'MAC_IN') {
            element.flexFieldList.flexField[4].value = macValue;
          }
        }
      });
    } else if (
      action.config.taskPanel &&
      action.config.taskPanel == 'actionCode'
    ) {
      let defectCode;
      let actionCode;
      let actionCodeChange;
      let defectCodeChange;
      let actiondata = [];
      let defectdata = [];
      let oldFaData = action.config.oldFaData;

      if (action.config.defectCode && action.config.defectCode !== undefined) {
        defectCode = this.contextService.getDataByString(
          action.config.defectCode
        );
      }

      if (action.config.actionCode && action.config.actionCode !== undefined) {
        actionCode = this.contextService.getDataByString(
          action.config.actionCode
        );
      }

      if (oldFaData && oldFaData !== undefined) {
        oldFaData = this.contextService.getDataByString(oldFaData);
      }


      if (
        defectCode &&
        actionCode &&
        defectCode !== undefined &&
        actionCode !== undefined
      ) {
        if (oldFaData && oldFaData !== '') {
          //check action code is matching or not.
          let checkDefect = oldFaData.findIndex(
            (ele) => ele.DEFECT_CODE === defectCode
          );
          let checkAction = oldFaData.findIndex(
            (ele) => ele.ACTION_CODE === actionCode
          );

          if (checkDefect > -1) {
            // if old defect data is match with new.
            defectCodeChange = {
              defectCode: defectCode,
              operation: 'Update',
            };
            defectdata.push(defectCodeChange);

            if (checkAction > -1) {
              // if old action data is match with new.
              actionCodeChange = {
                actionCode: actionCode,
                operation: 'Update',
                defectCode: {
                  value: defectCode,
                },
              };
              actiondata.push(actionCodeChange);
            } else {
              // if old action data is not match with new.
              oldFaData && oldFaData.forEach((element) => {
                let oldActiondata = {
                  actionCode: element.ACTION_CODE,
                  operation: 'Delete',
                  defectCode: {
                    value: element.DEFECT_CODE,
                  },
                };
                actiondata.push(oldActiondata);
              });

              actionCodeChange = {
                actionCode: actionCode,
                operation: 'Add',
                defectCode: {
                  value: defectCode,
                },
              };

              actiondata.push(actionCodeChange);
            }
          } else {
            // if old defect data is not match with new.
            oldFaData && oldFaData.forEach((element) => {
              let oldDefectdata = {
                defectCode: element.DEFECT_CODE,
                operation: 'Delete',
              };
              defectdata.push(oldDefectdata);
            });

            defectCodeChange = {
              defectCode: defectCode,
              operation: 'Add',
            };
            defectdata.push(defectCodeChange);

            actionCodeChange = {
              actionCode: actionCode,
              operation: 'Add',
              defectCode: {
                value: defectCode,
              },
            };
            actiondata.push(actionCodeChange);
          }
        } else {
          actionCodeChange = {
            actionCode: actionCode,
            operation: 'Add',
            defectCode: {
              value: defectCode,
            },
          };

          defectCodeChange = {
            defectCode: defectCode,
            operation: 'Add',
          };
          defectdata.push(defectCodeChange);
          actiondata.push(actionCodeChange);
        }

        this.contextService.addToContext('actionCodeChange', actiondata);
        this.contextService.addToContext('defectCodeChange', defectdata);
        // console.log(data);
      } else {
        this.contextService.addToContext('actionCodeChange', []);
        this.contextService.addToContext('defectCodeChange', []);
      }
    }
  }

  setPrintResultCode(action: any, instance: any) {
    let sprintObj = this.contextService.getDataByKey(action.config.key);
    if (sprintObj != null && sprintObj != undefined) {
      let outComeCode = this.contextService.getDataByString(
        '#SelectedResultcode'
      );
      if (outComeCode == undefined || outComeCode == null) {
        outComeCode = '';
      }
      sprintObj['KIRUS-OUTCOMECODEID'] = outComeCode;
    }
  }

  getSplitStringForInOutBound(action: any, instance: any) {
    let dataList = this.contextService.getDataByString('#getPCBByMainPart');
    let paratuuid;
    let str;
    let test;

    if (instance.parentuuid !== undefined) {
      paratuuid = instance.parentuuid;
      str = dataList[paratuuid].revisionLevelInbound;
      test = str.split('-')[0] + '-' + str.split('-')[1];
    }

    if (action.config.operation === 'SplitString') {
      this.contextService.addToContext(action.config.key, test);
      this.contextService.addToContext('orignalValue', str);
    } else if (action.config.operation === 'UpdateData') {
      let updatePartNo = this.contextService.getDataByString(action.config.value);
      // let updatePartNo = instance.group.value.partNumber;
      dataList[paratuuid].revisionLeveloutbound = updatePartNo;
      // console.log(dataList);
      // let List = this.contextService.getDataByString(action.config.data);
      // console.log(List);
    } else if (action.config.operation === 'validateFields') {
      let result = true;
      dataList && dataList.forEach((element) => {
        let lhs = element.revisionLeveloutbound.split('-')[0] + '-' + element.revisionLeveloutbound.split('-')[1];
        let rhs = element.revisionLevelInbound.split('-')[0] + '-' + element.revisionLevelInbound.split('-')[1];
        if (lhs !== rhs) {
          result = false;
        }
      });
      this.contextService.addToContext('validateFields', result);
      // console.log(result);
    }
  }

  getFilterActionCode(action: any, instance: any) {
    // Filter the defect code.
    let data = this.contextService.getDataByString(action.config.data); // orignal data.
    let filterBy = action.config.filterBy;
    let test = [];
    if (data && data !== undefined) {
      test = data.filter(
        (ele, index) =>
          data.findIndex((obj) => obj[filterBy] === ele[filterBy]) === index
      );
    }
    // console.log("DATA DATA DATA DATA" + test);
    this.contextService.addToContext(action.config.key, test);
  }
  getDataForActionToggle(arrayData, text, value) {
    // {
    //   "bgcolor": "light-blue",
    //   "color": "white",
    //   "text": "Fail",
    //   "value": "FAIL"
    // }
    let resultArray = [];
    if (arrayData instanceof Array) {
      arrayData.forEach((element) => {
        let obj = {
          bgcolor: 'light-blue',
          color: 'white',
          text: element[text],
          value: element[value],
        };
        resultArray.push(obj);
      });
    }
    return resultArray;
  }

  getFqaFlexFields(action: any, instance: any) {
    //FF object
    //context array
    let contextArray = [];
    if (
      action.config.contextArray &&
      action.config.contextArray.startsWith('#')
    ) {
      contextArray = this.contextService.getDataByString('#fqaFlexFields');

      if (
        contextArray &&
        contextArray instanceof Array &&
        contextArray.length > 0
      ) {
        let obj = action.config.ffObject;
        if (obj.value && obj.value.startsWith('#')) {
          obj.value = this.contextService.getDataByString(obj.value);
        }
        contextArray.push(obj);

        this.contextService.addToContext("fqaFlexFields", contextArray);
      } else {
        let obj = action.config.ffObject;
        if (obj.value && obj.value.startsWith('#')) {
          obj.value = this.contextService.getDataByString(obj.value);
        }
        contextArray = [];
        contextArray.push(obj);

        this.contextService.addToContext("fqaFlexFields", contextArray);
      }
    }
  }

  getReworkConcatString(action: any, instance: any) {
    // partNo - uniteInfoPartNo
    // _defectCode getReworkTaskDetails
    // key
    let partNo = this.contextService.getDataByString(action.config.partNo);
    let defectCode = action.config.defectCode;
    if (partNo && defectCode) {
      let str = partNo + '--' + defectCode;
      this.contextService.addToContext(action.config.key, str);
    }
  }

  getreworkFlexField(action: any, instance: any) {
    // PCB_PN,PCB_SN,REW_INSTR,DATE_CODE,ANALYSIS,REFURB
    let flexdata = action.config.flexdata;
    let reworkFlexFieldArray = [];
    if (flexdata.DATE_CODE && flexdata.DATE_CODE.startsWith('#'))
      flexdata.DATE_CODE = this.contextService.getDataByString(
        flexdata.DATE_CODE
      );

    if (flexdata.REFURB && flexdata.REFURB.startsWith('#'))
      flexdata.REFURB = this.contextService.getDataByString(
        flexdata.REFURB
      );

    if (flexdata.ANALYSIS && flexdata.ANALYSIS.startsWith('#'))
      flexdata.ANALYSIS = this.contextService.getDataByString(
        flexdata.ANALYSIS
      );
    if (flexdata.REW_INSTR && flexdata.REW_INSTR.startsWith('#'))
      flexdata.REW_INSTR = this.contextService.getDataByString(
        flexdata.REW_INSTR
      );

    if (flexdata.PCB_PN && flexdata.PCB_PN.startsWith('#'))
      flexdata.PCB_PN = this.contextService.getDataByString(
        flexdata.PCB_PN
      );

    if (flexdata.PCB_SN && flexdata.PCB_SN.startsWith('#'))
      flexdata.PCB_SN = this.contextService.getDataByString(
        flexdata.PCB_SN
      );

    if (flexdata.ANALYSIS && flexdata.ANALYSIS !== '') {
      let analysis = {
        name: 'ANALYSIS',
        value: flexdata.ANALYSIS,
      };
      reworkFlexFieldArray.push(analysis);
    }

    if (flexdata.REFURB && flexdata.REFURB !== '') {
      let refurb = {
        name: 'REFURB',
        value: flexdata.REFURB,
      };
      reworkFlexFieldArray.push(refurb);
    }

    if (flexdata.DATE_CODE && flexdata.DATE_CODE !== '') {
      let dateCode = {
        name: 'DATE_CODE',
        value: flexdata.DATE_CODE,
      };
      reworkFlexFieldArray.push(dateCode);
    }

    if (flexdata.PCB_PN && flexdata.PCB_PN !== '') {
      let pcbPn = {
        name: 'PCB_PN',
        value: flexdata.PCB_PN,
      };
      reworkFlexFieldArray.push(pcbPn);
    }
    if (flexdata.PCB_SN && flexdata.PCB_SN !== '') {
      let pcbSn = {
        name: 'PCB_SN',
        value: flexdata.PCB_SN,
      };
      reworkFlexFieldArray.push(pcbSn);
    }

    if (flexdata.REW_INSTR && flexdata.REW_INSTR !== '') {
      let rewInstr = {
        name: 'REW_INSTR',
        value: flexdata.REW_INSTR,
      };
      reworkFlexFieldArray.push(rewInstr);
    }
    this.contextService.addToContext(action.config.key, reworkFlexFieldArray);
  }

  //regarding T&C and T&C-Rework 
  executetcDefectOperations(action: any, instance: any, actionService) {
    // this.contextService.addToContext(action.config.key, "");
    let defectCurrentCode
    let defectRecords = [];
    let str;
    var available = [];
    let filterData
    let configDebugWLData;
    let currentActionCode;
    let actionInit;

    if (!action.config.configDebugWLData) {
      if (action.config.defectCurrentCode && action.config.defectCurrentCode.startsWith('#')) {
        defectCurrentCode = this.contextService.getDataByString(action.config.defectCurrentCode);
      } else {
        defectCurrentCode = action.config.defectCurrentCode;
      }
      if (action.config.defectRecords && action.config.defectRecords.startsWith('#')) {
        defectRecords = this.contextService.getDataByString(action.config.defectRecords);
        if (defectRecords instanceof Array) {
        } else {
          defectRecords = [];
        }
      } else {
        defectRecords = action.config.defectRecords;
      }
      available = defectRecords.filter(ele => ele.defect === defectCurrentCode);

      if (action.config.operation) {
        let operation = this.contextService.getDataByString(action.config.operation);

        if (operation == "Add") {
          var addDefect = {
            id: "",
            defect: defectCurrentCode
          }
          defectRecords.push(addDefect);
          this.contextService.addToContext(action.config.defectList, defectRecords);
        }
      } else {
        if (available.length > 0) {
          str = "Update"
        } else if (available.length <= 0) {
          str = "Add";
        }
        this.contextService.addToContext(action.config.key, str);
      }
    } else {
      //FOR DEBUG AND CONFIG DEBUG PAGES AND REWORK, CONFIG REWORK AND BGA REWORK ALSO.
      let operations = {
        defectCode: "Add",
        actionCode: "Add"
      }
      currentActionCode = action.config.currentActionCode;
      actionInit = currentActionCode.split("-")[0];
      currentActionCode = currentActionCode.split("-")[1];

      // if (actionInit == "CLOSE") {
      //   operations.defectCode = "Update";
      // } else {

      // }
      if (action.config.defectCurrentCode && action.config.defectCurrentCode.startsWith('#')) {
        defectCurrentCode = this.contextService.getDataByString(action.config.defectCurrentCode);
      } else {
        defectCurrentCode = action.config.defectCurrentCode;
      }

      if (action.config.taskType && action.config.taskType == "ECO") {
        if (action.config.defectRecords && action.config.defectRecords.startsWith('#')) {
          defectRecords = this.contextService.getDataByString(action.config.configDebugWLData);
          defectRecords = defectRecords && defectRecords instanceof Array ? defectRecords : [];
        } else {
          defectRecords = action.config.defectRecords;
        }
        available = defectRecords.filter(ele => ele.defect === defectCurrentCode || ele.defectCode === defectCurrentCode);
        if (available.length > 0) {
          available = available.filter(ele => ele.readonlyTask == "true");
        }

      } else if (actionInit !== "CLOSE") {
        if (action.config.defectRecords && action.config.defectRecords.startsWith('#')) {
          defectRecords = this.contextService.getDataByString(action.config.defectRecords);
          defectRecords = defectRecords && defectRecords instanceof Array ? defectRecords : [];
        } else {
          defectRecords = action.config.defectRecords;
        }
        available = defectRecords.filter(ele => ele.defect === defectCurrentCode);
      } else {
        operations.defectCode = "Update";
      }

      if (action.config.operation) {
        let operation = this.contextService.getDataByString(action.config.operation);
        if (operation == "Add") {
          var addDefect = {
            id: "",
            defect: defectCurrentCode
          }
          defectRecords.push(addDefect);
          this.contextService.addToContext(action.config.defectList, defectRecords);
        }
      } else {
        if (available.length > 0) {
          operations.defectCode = "Update"
        } else if (available.length <= 0 && actionInit !== "CLOSE") {
          operations.defectCode = "Add";
        }

        if (operations.defectCode === "Update") {
          configDebugWLData = this.contextService.getDataByString(action.config.configDebugWLData);
          configDebugWLData = configDebugWLData && configDebugWLData instanceof Array ? configDebugWLData : [];
          currentActionCode = action.config.currentActionCode;
          actionInit = currentActionCode.split("-")[0];
          currentActionCode = currentActionCode.split("-")[1];

          if (configDebugWLData) {
            filterData = configDebugWLData.filter(ele => ele.defect === defectCurrentCode || ele.defectCode === defectCurrentCode);
          } else {
            filterData = configDebugWLData;
          }

          if (actionInit == "OPEN") {
            if (currentActionCode == "REPLACE") {
              filterData = filterData.filter(ele => ele.taskType == "Replace Part-");
            }
            if (currentActionCode == "REMOVE") {
              filterData = filterData.filter(ele => ele.taskType == "Remove Part-");
            }
            if (currentActionCode == "FIT") {
              filterData = filterData.filter(ele => ele.taskType == "Fit Part-" || ele.taskType == "Replace Part-" || ele.taskType == "Add Part-");
              filterData = filterData.filter(ele => ele.activityType != "ACC");
            }
            if (currentActionCode == "RESOLDER") {
              filterData = filterData.filter(ele => ele.taskType == "Resolder Part-");
            }
          } else if (actionInit == "CLOSE") {

            if (currentActionCode == "REPLACE") {
              filterData = filterData.filter(ele => ele.taskType == "Replace Part- " || ele.taskType.includes("Replace Part-"));
              filterData = filterData.filter(ele => ele.readonlyTask == "true");
            }
            if (currentActionCode == "REMOVE") {
              filterData = filterData.filter(ele => ele.taskType == "Remove Part- ");
              filterData = filterData.filter(ele => ele.readonlyTask == "true");
            }
            if (currentActionCode == "FIT") {
              filterData = filterData.filter(ele => ele.taskType == "Fit Part- " || ele.taskType == "FIT Part-");
              filterData = filterData.filter(ele => ele.readonlyTask == "true" || ele.activityType == "FRU");
            }
            if (currentActionCode == "RESOLDER") {
              filterData = filterData.filter(ele => ele.taskType == "Resolder Part- ");
              filterData = filterData.filter(ele => ele.readonlyTask == "true");
            }
          }

          if (filterData.length > 0) {
            operations.actionCode = "Update"
          }
        }
        this.contextService.addToContext(action.config.key, operations);
      }
    }

    if (action.config.afterAction) {
      let act = action.config.afterAction;
      act && act.forEach(element => {
        actionService.handleAction(element);
      });
    }
  }

  //regarding Cisco Houston ECO booking screen disable.
  disabeAllEcopanles(action: any, instance: any, actionService) {
    let ecopanels;
    let eco;
    let pannelUUID
    let tittle;
    let togglevalue = this.contextService.getDataByString("#defectsOrActions.cosmeticCheckToggle");
    let wrpvalue = this.contextService.getDataByString("#UnitInfo.ROUTE");
    ecopanels = this.contextService.getDataByKey("ecoBookingData");
    let ecotaks = ecopanels.items
    if (ecotaks instanceof Array && (wrpvalue == "WRP1" || togglevalue == "NOK")) {
      for (eco = 2; eco <= ecotaks.length; eco++) {
        let paneldata = ecotaks[eco];
        if (paneldata && paneldata != undefined && paneldata.ctype && paneldata.ctype != undefined && paneldata.ctype == "taskPanel") {
          pannelUUID = paneldata.uuid;
          tittle = paneldata.header.title;
          let targetActiondisablepanel = {
            "type": "updateComponent",
            "config": {
              "key": pannelUUID,
              "properties": {
                "disabled": true,
                "expanded": false
              }
            }
          }
          actionService.handleAction(targetActiondisablepanel, instance);
        }
      }
    }
  }

  ciscoUnissueAndUndoFAForEcoTask(action: any, instance: any, actionService) {
    /**
     * Below Changes are for CISCO Rework And debug Screens for the below scenario
     * if user click the checkbox for ECO`s task record the Operation as close and 
     * delete the OPEN and OPEN-XXXX resultcode from SL.
     */

    let wishlist;
    let currentActionCode;
    let ecoCode;
    let afterAction;
    let actionInit;
    let defectCurrentCode
    var available = [];
    var uniteInfoPid;
    var flag = 0;

    uniteInfoPid = this.contextService.getDataByString("#UnitInfo.PART_NO");
    if (action.config.wishlist) {
      wishlist = this.contextService.getDataByString(action.config.wishlist);
      wishlist = wishlist && wishlist instanceof Array ? wishlist : [];
    }

    if (action.config.currentActionCode) {
      currentActionCode = action.config.currentActionCode;
      actionInit = currentActionCode.split("-")[0];
      currentActionCode = currentActionCode.split("-")[1];
    }

    if (action.config.defectCurrentCode && action.config.defectCurrentCode.startsWith('#')) {
      defectCurrentCode = this.contextService.getDataByString(action.config.defectCurrentCode);
    } else {
      defectCurrentCode = action.config.defectCurrentCode;
    }

    available = wishlist.filter(ele => ele.defect === defectCurrentCode || ele.defectCode === defectCurrentCode);

    if (wishlist && wishlist.length > 0 && available && available.length > 0) {
      afterAction = action.config.afterAction;
      for (let index = 0; index < available.length; index++) {
        const element = available[index];
        let actionCode;

        if (element.readonlyTask && element.readonlyTask == "true") {
          actionCode = "CLOSE-" + currentActionCode;
          flag = flag + 1;
        } else {
          actionCode = "OPEN-" + currentActionCode
        }

        let faForDeleteOpen = [
          {
            "type": "microservice",
            "eventSource": "click",
            "config": {
              "microserviceId": "performFA",
              "requestMethod": "post",
              "body": {
                "updateFailureAnalysisRequest": {
                  "actionCodeChangeList": {
                    "actionCodeChange": [
                      {
                        "actionCode": "OPEN",
                        "operation": "Delete",
                        "ecoCode": {
                          "value": element.defect ? uniteInfoPid + "--" + element.defect : uniteInfoPid + "--" + element.defectCode
                        }
                      }
                    ]
                  },
                  "bcn": "#UnitInfo.ITEM_BCN"
                },
                "userPwd": {
                  "username": "#loginUUID.username",
                  "password": "#loginUUID.password"
                },
                "operationTypes": "ProcessImmediate",
                "ip": "::1",
                "callSource": "FrontEnd",
                "apiUsage_LocationName": "#UnitInfo.GEONAME",
                "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
              },
              "toBeStringified": true
            },
            "responseDependents": {
              "onSuccess": {
                "actions": afterAction
              },
              "onFailure": {
                "actions": [
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "errorDisp",
                      "data": "responseData"
                    }
                  },
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isEqualTo",
                      "lhs": "#errorDisp",
                      "rhs": "No Record Found"
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorDisp",
                                "isShown": false
                              }
                            }
                          }
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorDisp",
                                "isShown": true
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            }
          }
        ];

        let faForClose = [
          {
            "type": "microservice",
            "eventSource": "click",
            "config": {
              "microserviceId": "performFA",
              "requestMethod": "post",
              "body": {
                "updateFailureAnalysisRequest": {
                  "actionCodeChangeList": {
                    "actionCodeChange": [
                      {
                        "actionCode": "CLOSE-" + currentActionCode,
                        "operation": "Delete",
                        "ecoCode": {
                          "value": element.defect ? uniteInfoPid + "--" + element.defect : uniteInfoPid + "--" + element.defectCode,
                        }
                      }
                    ]
                  },
                  "bcn": "#UnitInfo.ITEM_BCN"
                },
                "userPwd": {
                  "username": "#loginUUID.username",
                  "password": "#loginUUID.password"
                },
                "operationTypes": "ProcessImmediate",
                "ip": "::1",
                "callSource": "FrontEnd",
                "apiUsage_LocationName": "#UnitInfo.GEONAME",
                "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
              },
              "toBeStringified": true
            },
            "responseDependents": {
              "onSuccess": {
                "actions": faForDeleteOpen
              },
              "onFailure": {
                "actions": [
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "errorDisp",
                      "data": "responseData"
                    }
                  },
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isEqualTo",
                      "lhs": "#errorDisp",
                      "rhs": "No Record Found"
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorDisp",
                                "isShown": false
                              }
                            }
                          }
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorDisp",
                                "isShown": true
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            }
          }
        ]

        let fAPerform = [
          {
            "type": "microservice",
            "eventSource": "click",
            "config": {
              "microserviceId": "performFA",
              "requestMethod": "post",
              "body": {
                "updateFailureAnalysisRequest": {
                  "actionCodeChangeList": {
                    "actionCodeChange": [
                      {
                        "actionCode": "OPEN-" + currentActionCode,
                        "operation": "Delete",
                        "ecoCode": {
                          "value": element.defect ? uniteInfoPid + "--" + element.defect : uniteInfoPid + "--" + element.defectCode,
                        }
                      }
                    ]
                  },
                  "bcn": "#UnitInfo.ITEM_BCN"
                },
                "userPwd": {
                  "username": "#loginUUID.username",
                  "password": "#loginUUID.password"
                },
                "operationTypes": "ProcessImmediate",
                "ip": "::1",
                "callSource": "FrontEnd",
                "apiUsage_LocationName": "#UnitInfo.GEONAME",
                "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
              },
              "toBeStringified": true
            },
            "responseDependents": {
              "onSuccess": {
                "actions": flag > 0 ? faForClose : faForDeleteOpen
              },
              "onFailure": {
                "actions": [
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "errorDisp",
                      "data": "responseData"
                    }
                  },
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isEqualTo",
                      "lhs": "#errorDisp",
                      "rhs": "No Record Found"
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorDisp",
                                "isShown": false
                              }
                            }
                          }
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorDisp",
                                "isShown": true
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            }
          }
        ];

        let removeObj = [
          {
            "type": "microservice",
            "config": {
              "microserviceId": "performRemoveParts",
              "requestMethod": "post",
              "isLocal": false,
              "LocalService": "assets/Responses/getHPFAHistory.json",
              "body": {
                "removePartsRequest": {
                  "bcn": "#UnitInfo.ITEM_BCN",
                  "actionCodeChange": {
                    "operation": "Delete",
                    "actionCode": actionCode,
                    "ecoCode": {
                      "value": element.defect ? uniteInfoPid + "--" + element.defect : uniteInfoPid + "--" + element.defectCode
                    }
                  },
                  "nonInventoryPartList": {
                    "nonInventoryPart": [
                      {
                        "part": element.componentPartNo ? element.componentPartNo : element.partNo,
                        "quantity": element.qty ? element.qty : element.quantity,
                        "componentLocationDescription": element.location
                      }
                    ]
                  }
                },
                "userPwd": {
                  "username": "#userAccountInfo.PersonalDetails.USERID",
                  "password": "#loginUUID.password"
                },
                "ip": "::1",
                "callSource": "FrontEnd",
                "apiUsage_LocationName": "#UnitInfo.GEONAME",
                "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
              },
              "toBeStringified": true
            },
            "eventSource": "click",
            "responseDependents": {
              "onSuccess": {
                "actions": index === available.length - 1 ? fAPerform : []
              },
              "onFailure": {
                "actions": [
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "errorDisp",
                      "data": "responseData"
                    }
                  },
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isEqualTo",
                      "lhs": "#errorDisp",
                      "rhs": "No Record Found"
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorDisp",
                                "isShown": false
                              }
                            }
                          }
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorDisp",
                                "isShown": true
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            }
          }
        ];

        let issueobj = {
          "type": "microservice",
          "config": {
            "microserviceId": "performUnissueParts",
            "requestMethod": "post",
            "isLocal": false,
            "LocalService": "assets/Responses/getPreselectedResultCode.json",
            "body": {
              "unissuePartsRequest": {
                "bcn": "#UnitInfo.ITEM_BCN",
                "actionCodeChange": {
                  "actionCode": actionCode,
                  "operation": "Add",
                  "ecoCode": {
                    "value": element.defect ? uniteInfoPid + "--" + element.defect : uniteInfoPid + "--" + element.defectCode
                  }
                },
                "nonInventoryPartList": {
                  "nonInventoryPart": [
                    {
                      "part": element.componentPartNo ? element.componentPartNo : element.partNo,
                      "quantity": element.qty ? element.qty : element.quantity,
                      "componentLocationDescription": element.location
                    }]
                }
              },
              "userPwd": {
                "username": "#userAccountInfo.PersonalDetails.USERID",
                "password": "#loginUUID.password"
              }
            },
            "toBeStringified": true
          },
          "eventSource": "click",
          "responseDependents": {
            "onSuccess": {
              "actions": currentActionCode !== "FIT" ? removeObj : index === available.length - 1 ? fAPerform : []
            },
            "onFailure": {
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "errorDisp",
                    "data": "responseData"
                  }
                },
                {
                  "type": "condition",
                  "config": {
                    "operation": "isEqualTo",
                    "lhs": "#errorDisp",
                    "rhs": "No Record Found"
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "errorTitleUUID",
                            "properties": {
                              "titleValue": "#errorDisp",
                              "isShown": false
                            }
                          }
                        }
                      ]
                    },
                    "onFailure": {
                      "actions": [
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "errorTitleUUID",
                            "properties": {
                              "titleValue": "#errorDisp",
                              "isShown": true
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        };

        actionService.handleAction(issueobj);
      }
    } else {
      afterAction = action.config.afterAction;
      let faForDeleteOpen = [
        {
          "type": "microservice",
          "eventSource": "click",
          "config": {
            "microserviceId": "performFA",
            "requestMethod": "post",
            "body": {
              "updateFailureAnalysisRequest": {
                "actionCodeChangeList": {
                  "actionCodeChange": [
                    {
                      "actionCode": "OPEN",
                      "operation": "Delete",
                      "ecoCode": {
                        "value": uniteInfoPid + "--" + defectCurrentCode
                      }
                    }
                  ]
                },
                "bcn": "#UnitInfo.ITEM_BCN"
              },
              "userPwd": {
                "username": "#loginUUID.username",
                "password": "#loginUUID.password"
              },
              "operationTypes": "ProcessImmediate",
              "ip": "::1",
              "callSource": "FrontEnd",
              "apiUsage_LocationName": "#UnitInfo.GEONAME",
              "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
            },
            "toBeStringified": true
          },
          "responseDependents": {
            "onSuccess": {
              "actions": afterAction
            },
            "onFailure": {
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "errorDisp",
                    "data": "responseData"
                  }
                },
                {
                  "type": "condition",
                  "config": {
                    "operation": "isEqualTo",
                    "lhs": "#errorDisp",
                    "rhs": "No Record Found"
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "errorTitleUUID",
                            "properties": {
                              "titleValue": "#errorDisp",
                              "isShown": false
                            }
                          }
                        }
                      ]
                    },
                    "onFailure": {
                      "actions": [
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "errorTitleUUID",
                            "properties": {
                              "titleValue": "#errorDisp",
                              "isShown": true
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      ];
      for (let index = 0; index < faForDeleteOpen.length; index++) {
        const element = faForDeleteOpen[index];
        actionService.handleAction(element);
      }
    }
  }

  populateFqaText(action: any, instance: any) {
    let partNo;
    let newPartNo;
    if (action.config.partNo && action.config.partNo.startsWith("#")) {
      partNo = this.contextService.getDataByString(action.config.partNo);
    } else {
      partNo = action.config.partNo;
    }
    if (action.config.newPartNo && action.config.newPartNo.startsWith("#")) {
      newPartNo = this.contextService.getDataByString(action.config.newPartNo);
    } else {
      newPartNo = action.config.newPartNo;
    }
    let populatedFqaText = "The changed part is replaced from " + partNo + " to " + newPartNo + ". Please Exit and Rescan the BCN";
    this.contextService.addToContext(action.config.key, populatedFqaText);
  }

  getNextTaskPannel(ItemsList) {
    let cosmeticData = this.contextService.getDataByString("#UnitInfo.ROUTE");
    let itmList = ItemsList;
    let arr = [];
    let validateList = itmList.filter(eachitem => eachitem.header);
    validateList && validateList.forEach(element => {
      if (element.header.status) {
      } else if (element.header.title != "Preliminary Cosmetic Check") {
        arr.push(element);
      }
    });

    if (arr instanceof Array && arr.length > 0) {
      let ecopanelUUID = arr[0].uuid;
      return ecopanelUUID;
    } else {
      let uuid = "revisedBarcodeUUID";
      return uuid;
    }
  }

  //regarding T&C and T&C-Rework 
  executeTnCDefectOperations(action: any, instance: any, actionService) {
    // this.contextService.addToContext(action.config.key, "");
    let defectCurrentCode
    let defectRecords = [];
    let str;
    var available = [];
    let filterData
    let configDebugWLData;
    let currentActionCode;
    let actionInit;

    console.log("Accessory task")
    let operations = {
      defectCode: "Add",
      actionCode: "Add"
    }
    currentActionCode = action.config.currentActionCode;
    actionInit = currentActionCode.split("-")[0];
    currentActionCode = currentActionCode.split("-")[1];

    if (action.config.defectCurrentCode && action.config.defectCurrentCode.startsWith('#')) {
      defectCurrentCode = this.contextService.getDataByString(action.config.defectCurrentCode);
    } else {
      defectCurrentCode = action.config.defectCurrentCode;
    }

    if (actionInit !== "CLOSE") {
      if (action.config.defectRecords && action.config.defectRecords.startsWith('#')) {
        defectRecords = this.contextService.getDataByString(action.config.defectRecords);
        defectRecords = defectRecords && defectRecords instanceof Array ? defectRecords : [];
      } else {
        defectRecords = action.config.defectRecords;
      }
      available = defectRecords.filter(ele => ele.defect === defectCurrentCode);
    } else {
      operations.defectCode = "Update";
    }

    if (action.config.operation) {
      let operation = this.contextService.getDataByString(action.config.operation);
      if (operation == "Add") {
        var addDefect = {
          id: "",
          defect: defectCurrentCode
        }
        defectRecords.push(addDefect);
        this.contextService.addToContext(action.config.defectList, defectRecords);
      }
    } else {
      if (available.length > 0) {
        operations.defectCode = "Update"
      } else if (available.length <= 0 && actionInit !== "CLOSE") {
        operations.defectCode = "Add";
      }

      if (operations.defectCode === "Update") {
        configDebugWLData = this.contextService.getDataByString(action.config.configDebugWLData);
        configDebugWLData = configDebugWLData && configDebugWLData instanceof Array ? configDebugWLData : [];
        currentActionCode = action.config.currentActionCode;
        actionInit = currentActionCode.split("-")[0];
        currentActionCode = currentActionCode.split("-")[1];

        if (configDebugWLData) {
          filterData = configDebugWLData.filter(ele => ele.defect === defectCurrentCode || ele.defectCode === defectCurrentCode);
        } else {
          filterData = configDebugWLData;
        }

        if (actionInit == "OPEN") {
          if (currentActionCode == "FIT") {
            filterData = filterData.filter(ele => ele.taskType == "Add Part-" && ele.activityType == "ACC");
          }
        }

        if (filterData.length > 0) {
          operations.actionCode = "Update"
        }
      }
      this.contextService.addToContext(action.config.key, operations);
    }

    if (action.config.afterAction) {
      let act = action.config.afterAction;
      act && act.forEach(element => {
        actionService.handleAction(element);
      });
    }
  }

  //regarding cisco QR code Api call for all the test screens.
  qrCodeApicallforAllCiscoTestScreen(action: any, instance: any, actionService) {
    let getQRCodeApiCall = {
      "type": "microservice",
      "hookType": "afterInit",
      "config": {
        "microserviceId": "getQRCodeDetail",
        "isLocal": false,
        "requestMethod": "post",
        "body": {
          "serialNo": "#UnitInfo.SERIAL_NO",
          "partNo": "#UnitInfo.PART_NO",
          "locationId": "#userSelectedLocation",
          "clientId": "#userSelectedClient",
          "contractId": "#userSelectedContract",
          "pidNo": "#UnitInfo.PART_NO",
          "itemId": "#UnitInfo.ITEM_ID",
          "height": "250",
          "width": "250"
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
                "key": "getQRCodeDetail",
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
                "key": "errorMsg",
                "data": "responseData"
              }
            },
            {
              "type": "condition",
              "config": {
                "operation": "isEqualTo",
                "lhs": "#errorMsg",
                "rhs": "No Record Found"
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "errorTitleUUID",
                        "properties": {
                          "titleValue": "#errorMsg",
                          "isShown": false
                        }
                      }
                    }
                  ]
                },
                "onFailure": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "errorTitleUUID",
                        "properties": {
                          "titleValue": "#errorMsg",
                          "isShown": true
                        }
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    }
    actionService.handleAction(getQRCodeApiCall);
  }

  // cisco SZO/OLE 
  getOleFlexFields(action: any, instance: any) {
    let rowData = this.contextService.getDataByString(action.config.rowData);
    let selectedLocation = this.contextService.getDataByString(action.config.locationName);
    let selectedClient = this.contextService.getDataByString(action.config.clientId);
    let holdType = this.contextService.getDataByString(action.config.holdType);

    let oleFlexFieldArray = [];
    rowData.forEach(element => {

      let selectedData = {
        location: selectedLocation,
        clientId: selectedClient,
        workcenter: element.workCenterName,
        holdCode: holdType,
        unitBcn: element.bcn,
        note: ""
      };
      oleFlexFieldArray.push(selectedData);
    });
    this.contextService.addToContext(action.config.key, oleFlexFieldArray);
  }

  addinfoCodesFF(action: any, instance: any, actionService) {
    let getHandsOnTakeOverdata = this.contextService.getDataByKey("getHandsOnTakeOverCodedata");
    let addinfoCodesFF = [];
    if (getHandsOnTakeOverdata && getHandsOnTakeOverdata != undefined) {
      console.log("Take over data", getHandsOnTakeOverdata)
      getHandsOnTakeOverdata.forEach(element => {
        let obejct = {
          "type": element.outComeCodeType,
          "name": element.outComeCodeId
        }
        addinfoCodesFF.push(obejct)
      });
      this.contextService.addToContext("infoCodesFFData", addinfoCodesFF)
    }
  }
  olehandsOnapiprocess(action: any, instance: any, actionService) {
    let itemId = this.contextService.getDataByString(action.config.itemId);
    let oleRole = this.contextService.getDataByString("#oleHomeMenuData.id");
    let wcId = this.contextService.getDataByString("#UnitInfo.WORKCENTER_ID");
    if(wcId == null) {
      wcId = 0;
    }
    let getUnitHandsOnDetailsAPI

    if (oleRole) {
      getUnitHandsOnDetailsAPI = {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getUnitHandsOnDetails",
          "isLocal": false,
          "LocalService": "assets/Responses/mockHoldSubCode.json",
          "requestMethod": "get",
          "params": {
            "itemId": itemId,
            "locationId": "#userSelectedLocation",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "processId": "#oleHomeMenuData.id",
            "workCenterId": wcId,
            "appId": "#oleHomeMenuData.id",
            "userName": "#loginUUID.username"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "getUnitHandsOnDetails",
                  "data": "responseData"
                }
              },
              {
                "type": "condition",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": "#getUnitHandsOnDetails.0.action",
                  "rhs": "takeover"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "microservice",
                        "hookType": "afterInit",
                        "config": {
                          "microserviceId": "getHandsOnTakeOverCode",
                          "isLocal": false,
                          "LocalService": "assets/Responses/mockHoldSubCode.json",
                          "requestMethod": "get",
                          "params": {
                            "locationId": "#userSelectedLocation",
                            "clientId": "#userSelectedClient",
                            "contractId": "#userSelectedContract",
                            "processId": "#oleHomeMenuData.id",
                            "workCenterId": "#UnitInfo.WORKCENTER_ID",
                            "appId": "#oleHomeMenuData.id",
                            "userName": "#loginUUID.username"
                          }
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "getHandsOnTakeOverCodedata",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "addinfoCodesFF"
                              },
                              {
                                "type": "microservice",
                                "hookType": "afterInit",
                                "config": {
                                  "microserviceId": "addInfoCodes",
                                  "isLocal": false,
                                  "LocalService": "assets/Responses/mockHoldSubCode.json",
                                  "requestMethod": "post",
                                  "body": {
                                    "workCenter": "#UnitInfo.WORKCENTER",
                                    "geography": "#UnitInfo.GEONAME",
                                    "bcn": "#UnitInfo.ITEM_BCN",
                                    "part": "#UnitInfo.PART_NO",
                                    "notes": "FE",
                                    "infoCodes": "#infoCodesFFData",
                                    "userName": "#loginUUID.username",
                                    "password": "#loginUUID.password"
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
                                          "key": "addInfoCodes",
                                          "data": "responseData"
                                        }
                                      },
                                      {
                                        "type": "afterhandsOncallfunctiomality"
                                      }
                                    ]
                                  },
                                  "onFailure": {
                                    "actions": [
                                      {
                                        "type": "context",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": "errorMsg",
                                          "data": "responseData"
                                        }
                                      },
                                      {
                                        "type": "condition",
                                        "config": {
                                          "operation": "isEqualTo",
                                          "lhs": "#errorMsg",
                                          "rhs": "No Record Found"
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "searchCriteriaErrorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "#errorMsg",
                                                    "isShown": false
                                                  }
                                                }
                                              }
                                            ]
                                          },
                                          "onFailure": {
                                            "actions": [
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "searchCriteriaErrorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "#errorMsg",
                                                    "isShown": true
                                                  }
                                                }
                                              }
                                            ]
                                          }
                                        }
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
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "errorMsg",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "condition",
                                "config": {
                                  "operation": "isEqualTo",
                                  "lhs": "#errorMsg",
                                  "rhs": "No Record Found"
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "searchCriteriaErrorTitleUUID",
                                          "properties": {
                                            "titleValue": "#errorMsg",
                                            "isShown": false
                                          }
                                        }
                                      }
                                    ]
                                  },
                                  "onFailure": {
                                    "actions": [
                                      {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "searchCriteriaErrorTitleUUID",
                                          "properties": {
                                            "titleValue": "#errorMsg",
                                            "isShown": true
                                          }
                                        }
                                      }
                                    ]
                                  }
                                }
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
                        "type": "condition",
                        "config": {
                          "operation": "isEqualTo",
                          "lhs": "#getUnitHandsOnDetails.0.action",
                          "rhs": "release"
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "microservice",
                                "hookType": "afterInit",
                                "config": {
                                  "microserviceId": "releaseBCN",
                                  "isLocal": false,
                                  "LocalService": "assets/Responses/mockHoldSubCode.json",
                                  "requestMethod": "post",
                                  "body": {
                                    "location": "#UnitInfo.GEONAME",
                                    "workcenter": "#UnitInfo.WORKCENTER",
                                    "bcn": "#UnitInfo.ITEM_BCN",
                                    "userName": "#loginUUID.username",
                                    "password": "#loginUUID.password"
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
                                          "key": "releaseBCN",
                                          "data": "responseData"
                                        }
                                      },
                                      {
                                        "type": "afterhandsOncallfunctiomality"
                                      }
                                    ]
                                  },
                                  "onFailure": {
                                    "actions": [
                                      {
                                        "type": "context",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": "errorMsg",
                                          "data": "responseData"
                                        }
                                      },
                                      {
                                        "type": "condition",
                                        "config": {
                                          "operation": "isEqualTo",
                                          "lhs": "#errorMsg",
                                          "rhs": "No Record Found"
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "searchCriteriaErrorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "#errorMsg",
                                                    "isShown": false
                                                  }
                                                }
                                              }
                                            ]
                                          },
                                          "onFailure": {
                                            "actions": [
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "searchCriteriaErrorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "#errorMsg",
                                                    "isShown": true
                                                  }
                                                }
                                              }
                                            ]
                                          }
                                        }
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
                                "type": "condition",
                                "config": {
                                  "operation": "isEqualTo",
                                  "lhs": "#getUnitHandsOnDetails.0.action",
                                  "rhs": "time-in"
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "microservice",
                                        "config": {
                                          "microserviceId": "performTimeIn",
                                          "requestMethod": "post",
                                          "body": {
                                            "timeInRequest": {
                                              "workCenter": "#UnitInfo.DESTINATIONWC",
                                              "location": "#UnitInfo.GEONAME",
                                              "part": "#UnitInfo.PART_NO",
                                              "bcn": "#UnitInfo.ITEM_BCN",
                                              "serialNumber": "#UnitInfo.SERIAL_NO",
                                              "password": "#loginUUID.password"
                                            },
                                            "SesCustomer": 1,
                                            "userName": "#loginUUID.username",
                                            "userPass": "#loginUUID.password",
                                            "ip": "::1",
                                            "callSource": "FrontEnd",
                                            "apiUsage_LocationName": "#UnitInfo.GEONAME",
                                            "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                                          },
                                          "toBeStringified": true
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "afterhandsOncallfunctiomality"
                                              }
                                            ]
                                          },
                                          "onFailure": {
                                            "actions": [
                                              {
                                                "type": "context",
                                                "config": {
                                                  "requestMethod": "add",
                                                  "key": "errorMsg",
                                                  "data": "responseData"
                                                }
                                              },
                                              {
                                                "type": "condition",
                                                "config": {
                                                  "operation": "isEqualTo",
                                                  "lhs": "#errorMsg",
                                                  "rhs": "No Record Found"
                                                },
                                                "responseDependents": {
                                                  "onSuccess": {
                                                    "actions": [
                                                      {
                                                        "type": "updateComponent",
                                                        "config": {
                                                          "key": "searchCriteriaErrorTitleUUID",
                                                          "properties": {
                                                            "titleValue": "#errorMsg",
                                                            "isShown": false
                                                          }
                                                        }
                                                      }
                                                    ]
                                                  },
                                                  "onFailure": {
                                                    "actions": [
                                                      {
                                                        "type": "updateComponent",
                                                        "config": {
                                                          "key": "searchCriteriaErrorTitleUUID",
                                                          "properties": {
                                                            "titleValue": "#errorMsg",
                                                            "isShown": true
                                                          }
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
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
                                        "type": "condition",
                                        "config": {
                                          "operation": "isEqualTo",
                                          "lhs": "#getUnitHandsOnDetails.0.action",
                                          "rhs": "release + time-in"
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "microservice",
                                                "hookType": "afterInit",
                                                "config": {
                                                  "microserviceId": "releaseBCN",
                                                  "isLocal": false,
                                                  "LocalService": "assets/Responses/mockHoldSubCode.json",
                                                  "requestMethod": "post",
                                                  "params": {
                                                    "location": "#UnitInfo.GEONAME",
                                                    "workcenter": "#UnitInfo.WORKCENTER",
                                                    "bcn": "#UnitInfo.ITEM_BCN",
                                                    "userName": "#loginUUID.username",
                                                    "password": "#loginUUID.password"
                                                  }
                                                },
                                                "responseDependents": {
                                                  "onSuccess": {
                                                    "actions": [
                                                      {
                                                        "type": "context",
                                                        "config": {
                                                          "requestMethod": "add",
                                                          "key": "releaseBCN",
                                                          "data": "responseData"
                                                        }
                                                      },
                                                      {
                                                        "type": "microservice",
                                                        "config": {
                                                          "microserviceId": "performTimeIn",
                                                          "requestMethod": "post",
                                                          "body": {
                                                            "timeInRequest": {
                                                              "workCenter": "#UnitInfo.DESTINATIONWC",
                                                              "location": "#UnitInfo.GEONAME",
                                                              "part": "#UnitInfo.PART_NO",
                                                              "bcn": "#UnitInfo.ITEM_BCN",
                                                              "serialNumber": "#UnitInfo.SERIAL_NO",
                                                              "password": "#loginUUID.password"
                                                            },
                                                            "SesCustomer": 1,
                                                            "userName": "#loginUUID.username",
                                                            "userPass": "#loginUUID.password",
                                                            "ip": "::1",
                                                            "callSource": "FrontEnd",
                                                            "apiUsage_LocationName": "#UnitInfo.GEONAME",
                                                            "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                                                          },
                                                          "toBeStringified": true
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "afterhandsOncallfunctiomality"
                                                              }
                                                            ]
                                                          },
                                                          "onFailure": {
                                                            "actions": [
                                                              {
                                                                "type": "context",
                                                                "config": {
                                                                  "requestMethod": "add",
                                                                  "key": "errorMsg",
                                                                  "data": "responseData"
                                                                }
                                                              },
                                                              {
                                                                "type": "condition",
                                                                "config": {
                                                                  "operation": "isEqualTo",
                                                                  "lhs": "#errorMsg",
                                                                  "rhs": "No Record Found"
                                                                },
                                                                "responseDependents": {
                                                                  "onSuccess": {
                                                                    "actions": [
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "searchCriteriaErrorTitleUUID",
                                                                          "properties": {
                                                                            "titleValue": "#errorMsg",
                                                                            "isShown": false
                                                                          }
                                                                        }
                                                                      }
                                                                    ]
                                                                  },
                                                                  "onFailure": {
                                                                    "actions": [
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "searchCriteriaErrorTitleUUID",
                                                                          "properties": {
                                                                            "titleValue": "#errorMsg",
                                                                            "isShown": true
                                                                          }
                                                                        }
                                                                      }
                                                                    ]
                                                                  }
                                                                }
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
                                                        "type": "context",
                                                        "config": {
                                                          "requestMethod": "add",
                                                          "key": "errorMsg",
                                                          "data": "responseData"
                                                        }
                                                      },
                                                      {
                                                        "type": "condition",
                                                        "config": {
                                                          "operation": "isEqualTo",
                                                          "lhs": "#errorMsg",
                                                          "rhs": "No Record Found"
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "updateComponent",
                                                                "config": {
                                                                  "key": "searchCriteriaErrorTitleUUID",
                                                                  "properties": {
                                                                    "titleValue": "#errorMsg",
                                                                    "isShown": false
                                                                  }
                                                                }
                                                              }
                                                            ]
                                                          },
                                                          "onFailure": {
                                                            "actions": [
                                                              {
                                                                "type": "updateComponent",
                                                                "config": {
                                                                  "key": "searchCriteriaErrorTitleUUID",
                                                                  "properties": {
                                                                    "titleValue": "#errorMsg",
                                                                    "isShown": true
                                                                  }
                                                                }
                                                              }
                                                            ]
                                                          }
                                                        }
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
                                                "type": "condition",
                                                "config": {
                                                  "operation": "isEqualToIgnoreCase",
                                                  "lhs": "#getUnitHandsOnDetails.0.action",
                                                  "rhs": "none"
                                                },
                                                "responseDependents": {
                                                  "onSuccess": {
                                                    "actions": [
                                                      {
                                                        "type": "afterhandsOncallfunctiomality"
                                                      }
                                                    ]
                                                  },
                                                  "onFailure": {
                                                    "actions": [
                                                      {
                                                        "type": "condition",
                                                        "config": {
                                                          "operation": "isEqualTo",
                                                          "lhs": "#getUnitHandsOnDetails.0.action",
                                                          "rhs": "storage-release + time-in"
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "microservice",
                                                                "eventSource": "click",
                                                                "config": {
                                                                  "microserviceId": "releasefromhold",
                                                                  "requestMethod": "post",
                                                                  "body": {
                                                                    "unitBCN": "#UnitInfo.ITEM_BCN",
                                                                    "releaseNotes": "RELEASE",
                                                                    "userPwd": {
                                                                      "userName": "#userAccountInfo.PersonalDetails.USERID",
                                                                      "password": "#loginUUID.password"
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
                                                                          "key": "releasefromhold",
                                                                          "data": "responseData"
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "microservice",
                                                                        "config": {
                                                                          "microserviceId": "performTimeIn",
                                                                          "requestMethod": "post",
                                                                          "body": {
                                                                            "timeInRequest": {
                                                                              "workCenter": "#UnitInfo.DESTINATIONWC",
                                                                              "location": "#UnitInfo.GEONAME",
                                                                              "part": "#UnitInfo.PART_NO",
                                                                              "bcn": "#UnitInfo.ITEM_BCN",
                                                                              "serialNumber": "#UnitInfo.SERIAL_NO",
                                                                              "password": "#loginUUID.password"
                                                                            },
                                                                            "SesCustomer": 1,
                                                                            "userName": "#loginUUID.username",
                                                                            "userPass": "#loginUUID.password",
                                                                            "ip": "::1",
                                                                            "callSource": "FrontEnd",
                                                                            "apiUsage_LocationName": "#UnitInfo.GEONAME",
                                                                            "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                                                                          },
                                                                          "toBeStringified": true
                                                                        },
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "afterhandsOncallfunctiomality"
                                                                              }
                                                                            ]
                                                                          },
                                                                          "onFailure": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "context",
                                                                                "config": {
                                                                                  "requestMethod": "add",
                                                                                  "key": "errorMsg",
                                                                                  "data": "responseData"
                                                                                }
                                                                              },
                                                                              {
                                                                                "type": "condition",
                                                                                "config": {
                                                                                  "operation": "isEqualTo",
                                                                                  "lhs": "#errorMsg",
                                                                                  "rhs": "No Record Found"
                                                                                },
                                                                                "responseDependents": {
                                                                                  "onSuccess": {
                                                                                    "actions": [
                                                                                      {
                                                                                        "type": "updateComponent",
                                                                                        "config": {
                                                                                          "key": "searchCriteriaErrorTitleUUID",
                                                                                          "properties": {
                                                                                            "titleValue": "#errorMsg",
                                                                                            "isShown": false
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    ]
                                                                                  },
                                                                                  "onFailure": {
                                                                                    "actions": [
                                                                                      {
                                                                                        "type": "updateComponent",
                                                                                        "config": {
                                                                                          "key": "searchCriteriaErrorTitleUUID",
                                                                                          "properties": {
                                                                                            "titleValue": "#errorMsg",
                                                                                            "isShown": true
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    ]
                                                                                  }
                                                                                }
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
                                                                        "type": "context",
                                                                        "config": {
                                                                          "requestMethod": "add",
                                                                          "key": "errorDisp",
                                                                          "data": "responseData"
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "condition",
                                                                        "config": {
                                                                          "operation": "isEqualTo",
                                                                          "lhs": "#errorDisp",
                                                                          "rhs": "No Record Found"
                                                                        },
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "updateComponent",
                                                                                "config": {
                                                                                  "key": "searchCriteriaErrorTitleUUID",
                                                                                  "properties": {
                                                                                    "titleValue": "#errorDisp",
                                                                                    "isShown": false
                                                                                  }
                                                                                }
                                                                              }
                                                                            ]
                                                                          },
                                                                          "onFailure": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "updateComponent",
                                                                                "config": {
                                                                                  "key": "searchCriteriaErrorTitleUUID",
                                                                                  "properties": {
                                                                                    "titleValue": "#errorDisp",
                                                                                    "isShown": true
                                                                                  }
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
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
                                                                "type": "condition",
                                                                "config": {
                                                                  "operation": "isEqualToIgnoreCase",
                                                                  "lhs": "#getUnitHandsOnDetails.0.action",
                                                                  "rhs": "storage-release"
                                                                },
                                                                "responseDependents": {
                                                                  "onSuccess": {
                                                                    "actions": [
                                                                      {
                                                                        "type": "microservice",
                                                                        "eventSource": "click",
                                                                        "config": {
                                                                          "microserviceId": "releasefromhold",
                                                                          "requestMethod": "post",
                                                                          "body": {
                                                                            "unitBCN": "#UnitInfo.ITEM_BCN",
                                                                            "releaseNotes": "RELEASE",
                                                                            "userPwd": {
                                                                              "userName": "#userAccountInfo.PersonalDetails.USERID",
                                                                              "password": "#loginUUID.password"
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
                                                                                  "key": "releasefromhold",
                                                                                  "data": "responseData"
                                                                                }
                                                                              },
                                                                              {
                                                                                "type": "afterhandsOncallfunctiomality"
                                                                              }
                                                                            ]
                                                                          },
                                                                          "onFailure": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "context",
                                                                                "config": {
                                                                                  "requestMethod": "add",
                                                                                  "key": "errorDisp",
                                                                                  "data": "responseData"
                                                                                }
                                                                              },
                                                                              {
                                                                                "type": "condition",
                                                                                "config": {
                                                                                  "operation": "isEqualTo",
                                                                                  "lhs": "#errorDisp",
                                                                                  "rhs": "No Record Found"
                                                                                },
                                                                                "responseDependents": {
                                                                                  "onSuccess": {
                                                                                    "actions": [
                                                                                      {
                                                                                        "type": "updateComponent",
                                                                                        "config": {
                                                                                          "key": "searchCriteriaErrorTitleUUID",
                                                                                          "properties": {
                                                                                            "titleValue": "#errorDisp",
                                                                                            "isShown": false
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    ]
                                                                                  },
                                                                                  "onFailure": {
                                                                                    "actions": [
                                                                                      {
                                                                                        "type": "updateComponent",
                                                                                        "config": {
                                                                                          "key": "searchCriteriaErrorTitleUUID",
                                                                                          "properties": {
                                                                                            "titleValue": "#errorDisp",
                                                                                            "isShown": true
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    ]
                                                                                  }
                                                                                }
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
                                                                        "type": "context",
                                                                        "config": {
                                                                          "requestMethod": "add",
                                                                          "key": "errorMsg",
                                                                          "data": "responseData"
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "condition",
                                                                        "config": {
                                                                          "operation": "isEqualTo",
                                                                          "lhs": "#errorMsg",
                                                                          "rhs": "No Record Found"
                                                                        },
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "updateComponent",
                                                                                "config": {
                                                                                  "key": "searchCriteriaErrorTitleUUID",
                                                                                  "properties": {
                                                                                    "titleValue": "#errorMsg",
                                                                                    "isShown": false
                                                                                  }
                                                                                }
                                                                              }
                                                                            ]
                                                                          },
                                                                          "onFailure": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "updateComponent",
                                                                                "config": {
                                                                                  "key": "searchCriteriaErrorTitleUUID",
                                                                                  "properties": {
                                                                                    "titleValue": "Invalid transaction,set error details Return with Fail",
                                                                                    "isShown": true
                                                                                  }
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      }
                                                                    ]
                                                                  }
                                                                }
                                                              }
                                                            ]
                                                          }
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              }
                                            ]
                                          }
                                        }
                                      }
                                    ]
                                  }
                                }
                              }
                            ]
                          }
                        }
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
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "errorMsg",
                  "data": "responseData"
                }
              },
              {
                "type": "condition",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": "#errorMsg",
                  "rhs": "No Record Found"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "searchCriteriaErrorTitleUUID",
                          "properties": {
                            "titleValue": "#errorMsg",
                            "isShown": false
                          }
                        }
                      }
                    ]
                  },
                  "onFailure": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "searchCriteriaErrorTitleUUID",
                          "properties": {
                            "titleValue": "#errorMsg",
                            "isShown": true
                          }
                        }
                      }
                    ]
                  }
                }
              }
            ]
          }
        }
      }
    } else {
      getUnitHandsOnDetailsAPI = {
        "type": "updateComponent",
        "config": {
          "key": "searchCriteriaErrorTitleUUID",
          "properties": {
            "titleValue": "You don't have access to GLB_MYUNIT role. In order to proceed please ask IT Administrator to assign this role to you.",
            "isShown": true
          }
        }
      }
    }

    actionService.handleAction(getUnitHandsOnDetailsAPI);
  }

  showOLEPausebuttonInScreen(action: any, instance: any, actionService) {
    let olepausebutton = [
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getHandsOffHoldCode",
          "isLocal": false,
          "LocalService": "assets/Responses/getPreselectedResultCode.json",
          "requestMethod": "get",
          "params": {
            "locationId": "#userSelectedLocation",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "processId": "#oleHomeMenuData.id",
            "workCenterId": "#UnitInfo.WORKCENTER_ID",
            "appId": "#oleHomeMenuData.id",
            "userName": "#loginUUID.username"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "getHandsOffHoldCode",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "unitPauseHoldtypedropdownUUID",
                  "dropDownProperties": {
                    "options": "#getHandsOffHoldCode"
                  }
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
                  "key": "errorMsg",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "errorTitleUUID",
                  "properties": {
                    "titleValue": "#errorMsg",
                    "isShown": true
                  }
                }
              }
            ]
          }
        }
      },
      {
        "type": "dialogwithmessage",
        "uuid": "unitPausebtnDialogUUID",
        "config": {
          "title": "Move to Hold",
          "disableClose": true,
          "minimumWidth": false,
          "width": "700px",
          "items": [
            {
              "ctype": "title",
              "uuid": "unitPausebtnDialogtittleUUID",
              "titleClass": "error-title-holdbin",
              "isShown": false
            },
            {
              "ctype": "nativeDropdown",
              "dropdownClass": " body2 reworkCommon",
              "formGroupClass": "olepausedailogdisplayinline",
              "inputStyles": "width:175px",
              "uuid": "unitPauseScopedropdownUUID",
              "name": "unitPauseScopedropdown",
              "label": "Scope",
              "labelClass": "scopelabel  pr-2",
              "dataSource": "#getCiscoBGAReworkMasterListReplace#@.vpnDetials",
              "code": "",
              "displayValue": "",
              "required": true,
              "options": [
                {
                  "code": "Current Unit",
                  "displayValue": "Current Unit"
                },
                {
                  "code": "All Active Units",
                  "displayValue": "All Active Units"
                }
              ],
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "unitPauseScopeName",
                    "data": "elementControlName"
                  },
                  "eventSource": "change"
                },
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "unitPauseScopeValue",
                    "data": "elementControlValue"
                  },
                  "eventSource": "change"
                }
              ]
            },
            {
              "ctype": "nativeDropdown",
              "dropdownClass": "body2 reworkCommon",
              "formGroupClass": "olepauseholdtypedailogdropdown",
              "uuid": "unitPauseHoldtypedropdownUUID",
              "inputStyles": "width:175px",
              "name": "unitPauseHoldtypedropdown",
              "label": "Hold Type",
              "labelClass": "scopelabel pr-2",
              "dataSource": "#getHandsOffHoldCode",
              "code": "outComeCodeId",
              "displayValue": "outComeCodeId",
              "required": true,
              "hooks": [],
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "unitPauseHoldtypeName",
                    "data": "elementControlName"
                  },
                  "eventSource": "change"
                },
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "unitPauseHoldtypeValue",
                    "data": "elementControlValue"
                  },
                  "eventSource": "change"
                }
              ]
            }
          ],
          "footer": [
            {
              "ctype": "button",
              "color": "primary",
              "text": "Cancel",
              "uuid": "unitPauseCancelUUID",
              "closeType": "close",
              "disableClose": true,
              "visibility": true,
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
              "uuid": "unitPauseDoneUUID",
              "dialogBoxHoldBinErrorMessage": true,
              "dialogButton": true,
              "visibility": true,
              "disabled": true,
              "type": "submit",
              "closeType": "success",
              "hooks": [],
              "validations": [],
              "actions": [
                {
                  "eventSource": "click",
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "condition",
                          "config": {
                            "operation": "isEqualTo",
                            "lhs": "#unitPauseScopeName",
                            "rhs": "Current Unit"
                          },
                          "eventSource": "click",
                          "responseDependents": {
                            "onSuccess": {
                              "actions": [
                                {
                                  "type": "microservice",
                                  "hookType": "afterInit",
                                  "config": {
                                    "microserviceId": "holdSelectedAndCurrentUnit",
                                    "isLocal": false,
                                    "LocalService": "assets/Responses/mockHoldSubCode.json",
                                    "requestMethod": "post",
                                    "body": {
                                      "currentUnitOnHoldList": [{
                                        "location": "#UnitInfo.GEONAME",
                                        "clientId": "#UnitInfo.CLIENT_ID",
                                        "workcenter": "#UnitInfo.WORKCENTER",
                                        "holdCode": "#unitPauseHoldtypeName",
                                        "unitBcn": "#UnitInfo.ITEM_BCN",
                                        "note": ""
                                      }],
                                      "userName": "#loginUUID.username",
                                      "password": "#loginUUID.password"
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
                                            "key": "holdSelectedAndCurrentUnit",
                                            "data": "responseData"
                                          }
                                        },
                                        {
                                          "type": "closeAllDialogs"
                                        },
                                        {
                                          "type": "dialog",
                                          "uuid": "olePauseSucesssDailogUUID",
                                          "config": {
                                            "minimumWidth": false,
                                            "width": "300px",
                                            "title": "",
                                            "isheader": false,
                                            "items": [
                                              {
                                                "ctype": "title",
                                                "uuid": "errorTitleECOUUID",
                                                "titleClass": "font-weight-bold",
                                                "titleValue": "Transaction summary"
                                              },
                                              {
                                                "ctype": "label",
                                                "text": "#holdSelectedAndCurrentUnit",
                                                "labelClass": "font-weight-bold"
                                              }
                                            ]
                                          },
                                          "eventSource": "click",
                                          "responseDependents": {
                                            "onSuccess": {
                                              "actions": []
                                            }
                                          }
                                        },
                                        {
                                          "type": "renderTemplate",
                                          "config": {
                                            "templateId": "dashboard.json",
                                            "mode": "local"
                                          }
                                        }
                                      ]
                                    },
                                    "onFailure": {
                                      "actions": [
                                        {
                                          "type": "condition",
                                          "config": {
                                            "operation": "isEqualTo",
                                            "lhs": "#errorDisp",
                                            "rhs": "No Record Found"
                                          },
                                          "responseDependents": {
                                            "onSuccess": {
                                              "actions": [
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "errorTitleUUID",
                                                    "properties": {
                                                      "titleValue": "#errorDisp",
                                                      "isShown": false
                                                    }
                                                  }
                                                }
                                              ]
                                            },
                                            "onFailure": {
                                              "actions": [
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "errorTitleUUID",
                                                    "properties": {
                                                      "titleValue": "#errorDisp",
                                                      "isShown": true
                                                    }
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        },
                                        {
                                          "type": "closeAllDialogs"
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
                                  "type": "microservice",
                                  "hookType": "afterInit",
                                  "config": {
                                    "microserviceId": "holdAllActiveUnits",
                                    "isLocal": false,
                                    "LocalService": "assets/Responses/mockHoldSubCode.json",
                                    "requestMethod": "post",
                                    "body": {
                                      "locationId": "#UnitInfo.LOCATION_ID",
                                      "clientId": "#UnitInfo.CLIENT_ID",
                                      "location": "#UnitInfo.GEONAME",
                                      "holdcode": "#unitPauseHoldtypeName",
                                      "notes": "",
                                      "userName": "#loginUUID.username",
                                      "password": "#loginUUID.password"
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
                                            "key": "allActiveunitsresponseData",
                                            "data": "responseData"
                                          }
                                        },
                                        {
                                          "type": "closeAllDialogs"
                                        },
                                        {
                                          "type": "dialog",
                                          "uuid": "olePauseSucesssDailogUUID",
                                          "config": {
                                            "minimumWidth": false,
                                            "width": "300px",
                                            "title": "",
                                            "isheader": false,
                                            "items": [
                                              {
                                                "ctype": "title",
                                                "uuid": "errorTitleECOUUID",
                                                "titleClass": "font-weight-bold",
                                                "titleValue": "Transaction summary"
                                              },
                                              {
                                                "ctype": "label",
                                                "text": "#allActiveunitsresponseData",
                                                "labelClass": "font-weight-bold"
                                              }
                                            ]
                                          },
                                          "eventSource": "click",
                                          "responseDependents": {
                                            "onSuccess": {
                                              "actions": []
                                            }
                                          }
                                        },
                                        {
                                          "type": "renderTemplate",
                                          "config": {
                                            "templateId": "dashboard.json",
                                            "mode": "local"
                                          }
                                        }
                                      ]
                                    },
                                    "onFailure": {
                                      "actions": [
                                        {
                                          "type": "condition",
                                          "config": {
                                            "operation": "isEqualTo",
                                            "lhs": "#errorDisp",
                                            "rhs": "No Record Found"
                                          },
                                          "responseDependents": {
                                            "onSuccess": {
                                              "actions": [
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "errorTitleUUID",
                                                    "properties": {
                                                      "titleValue": "#errorDisp",
                                                      "isShown": false
                                                    }
                                                  }
                                                }
                                              ]
                                            },
                                            "onFailure": {
                                              "actions": [
                                                {
                                                  "type": "updateComponent",
                                                  "config": {
                                                    "key": "errorTitleUUID",
                                                    "properties": {
                                                      "titleValue": "#errorDisp",
                                                      "isShown": true
                                                    }
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        }, {
                                          "type": "closeAllDialogs"
                                        }

                                      ]
                                    }
                                  }
                                }
                              ]
                            }
                          }
                        }
                      ]
                    },
                    "onFailure": {}
                  }
                }
              ]
            }
          ]
        },
        "eventSource": "click"
      }
    ]
    olepausebutton && olepausebutton.forEach(element => {
      actionService.handleAction(element);
    });
  }

  vmiValiadtion(action, instance, actionService) {
    let valiadte = {
      custparno: false,
      custSerialno: false
    }
    let customerPartNumber = this.contextService.getDataByString(action.config.customerPartNumber);
    let customerSerialNumber = this.contextService.getDataByString(action.config.customerSerialNumber);
    let billingId = action.config.billingId.startsWith('#') ? this.contextService.getDataByString(action.config.billingId) : action.config.billingId;
    let modelNumber = action.config.modelNumber.startsWith('#') ? this.contextService.getDataByString(action.config.modelNumber) : action.config.modelNumber;
    let extOrderNo = action.config.extOrderNo.startsWith('#') ? this.contextService.getDataByString(action.config.extOrderNo) : action.config.extOrderNo;
    let assetNo = action.config.assetNo.startsWith('#') ? this.contextService.getDataByString(action.config.assetNo) : action.config.assetNo;
    let customerDetails = {
      CustomerPartNumber: customerPartNumber,
      CustomerSerialNumber: customerSerialNumber
    }
    console.log(customerDetails);

    if (action.name == "fromHook" || action.name.includes("fromHook")) {
      let custParNoError = {
        "type": "updateComponent",
        "config": {
          "key": "CustomerPartNumberUUID",
          "properties": {
            "textfieldClass": "col-2 p-0 text-padding"
          }
        },
        "eventSource": "click"
      };
      let custParNoSuccess = {
        "type": "updateComponent",
        "config": {
          "key": "CustomerPartNumberUUID",
          "properties": {
            "textfieldClass": "col-2 p-0 text-padding"
          }
        },
        "eventSource": "click"
      };

      if ((billingId == "82918874" && (!modelNumber.includes("PP1000") || !modelNumber.includes("BASE"))) || billingId == "82176163") {
        if (extOrderNo && extOrderNo !== null) {
          valiadte.custparno = true;
          let action = [
            {
              "type": "updateComponent",
              "config": {
                "key": "CustomerPartNumberUUID",
                "properties": {
                  "textfieldClass": "col-2 p-0 text-padding mat-focused",
                  "required": true,
                  "value": extOrderNo,
                  "disabled": false
                }
              }
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "customerPartNumber",
                "data": extOrderNo
              }
            }
          ];
          customerDetails.CustomerPartNumber = extOrderNo;
          customerPartNumber = extOrderNo;
          action.forEach(element => {
            actionService.handleAction(element);
          });

        } else if (billingId == "82918874" && customerDetails.CustomerPartNumber && customerDetails.CustomerPartNumber !== null && customerDetails.CustomerPartNumber.length == 6) {
          valiadte.custparno = true;
          actionService.handleAction(custParNoSuccess);
        } else if (billingId == "82176163" && customerDetails.CustomerPartNumber && customerDetails.CustomerPartNumber !== null && customerDetails.CustomerPartNumber.length == 10) {
          valiadte.custparno = true;
          actionService.handleAction(custParNoSuccess);
        } else {
          valiadte.custparno = false;
          actionService.handleAction(custParNoError);
        }
      } else if (customerDetails.CustomerPartNumber && customerDetails.CustomerPartNumber !== null && customerDetails.CustomerPartNumber.length > 0) {
        valiadte.custparno = true;
        actionService.handleAction(custParNoSuccess);
      } else {
        valiadte.custparno = false;
        actionService.handleAction(custParNoError);
      }
    }


    if (action.name == "fromHook" || action.name.includes("fromHook")) {
      let custSNoError = {
        "type": "updateComponent",
        "config": {
          "key": "CustomerSerialNumberUUID",
          "properties": {
            "textfieldClass": "col-2 p-0 text-padding mat-form-field-invalid"
          }
        },
        "eventSource": "click"
      };
      let custSNoSuccess = {
        "type": "updateComponent",
        "config": {
          "key": "CustomerSerialNumberUUID",
          "properties": {
            "textfieldClass": "col-2 p-0 text-padding"
          }
        },
        "eventSource": "click"
      };
      // console.log(customerDetails);

      if (billingId == "89730084") {
        if (assetNo != undefined || assetNo != null || assetNo != "" || assetNo.length == 10) {
          valiadte.custSerialno = true;
          let action = [
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "customerSerialNumber",
                "data": assetNo ? assetNo : ""
              }
            },
            {
              "type": "updateComponent",
              "config": {
                "key": "CustomerSerialNumberUUID",
                "properties": {
                  "textfieldClass": "col-2 p-0 text-padding mat-focused",
                  "required": true,
                  "value": assetNo,
                  "disabled": false
                }
              }
            }
          ];
          action.forEach(element => {
            actionService.handleAction(element);
          });
          customerDetails.CustomerSerialNumber = assetNo;
          customerSerialNumber = assetNo;
        } else {
          if (customerSerialNumber) {
            valiadte.custSerialno = true;
            actionService.handleAction(custSNoSuccess);
          } else {
            valiadte.custSerialno = false;
            actionService.handleAction(custSNoError);
          }
        }
      } else {
        valiadte.custSerialno = true;
        let action = [
          {
            "type": "updateComponent",
            "config": {
              "key": "CustomerSerialNumberUUID",
              "properties": {
                "textfieldClass": "col-2 p-0 text-padding",
                "required": true,
                "disabled": false,
                "value": ""
              }
            }
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "customerSerialNumber",
              "data": ""
            }
          }
        ];
        action.forEach(element => {
          actionService.handleAction(element);
        });
      }
    }

    let enablebtn = {
      "type": "updateComponent",
      "config": {
        "key": "CustomerDetailsSubmittedUUID",
        "properties": {
          "disabled": false
        }
      },
      "eventSource": "click"
    }
    actionService.handleAction(enablebtn);

    // if (valiadte.custparno || valiadte.custSerialno) {
    //   let enablebtn = {
    //     "type": "updateComponent",
    //     "config": {
    //       "key": "CustomerDetailsSubmittedUUID",
    //       "properties": {
    //         "disabled": false
    //       }
    //     },
    //     "eventSource": "click"
    //   }
    //   actionService.handleAction(enablebtn);
    // } else {
    //   let disablebtn = {
    //     "type": "updateComponent",
    //     "config": {
    //       "key": "CustomerDetailsSubmittedUUID",
    //       "properties": {
    //         "disabled": false
    //       }
    //     },
    //     "eventSource": "click"
    //   }
    //   actionService.handleAction(disablebtn);
    // }
  }

  setTestNameDefaultDataHP(action: any, instance: any, actionService){
    let testDonedata;
    let testDonevalueArr=[];
    if(action.data && action.data.startsWith("#")){
     testDonedata= this.contextService.getDataByString(action.data);
    }
    let data = testDonedata.split(';');
    data.forEach(element => {
      if(element){
        let obj = {value:element}
        testDonevalueArr.push(obj);
      }
    }); 
    this.contextService.addToContext(action.key,testDonevalueArr)
    
  const dropdownInstance = this.contextService.getDataByKey(action.uuid + "ref");
  dropdownInstance.instance.defaultValue;
    if (dropdownInstance.instance.defaultValue == "") {
      dropdownInstance.instance.defaultValue = testDonevalueArr;
    }
    dropdownInstance.instance._changeDetectionRef.detectChanges();
  }
}
