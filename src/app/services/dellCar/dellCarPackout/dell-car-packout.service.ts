

import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';
import { ComponentService } from '../../commonServices/componentService/component.service';
import { MdbBreadcrumbItemComponent } from 'angular-bootstrap-md';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DellCarPackoutService {

  constructor(private contextService: ContextService, private componentService: ComponentService, ) { }
  private items;
  handleDellCarPackoutActions(action: any, instance: any, actionService: any) {
    if (action.config) {
      switch (action.config.methodType) {
        case 'boxDataFormation':
          this.boxDataFormation(action, instance, actionService);
          break;
        case 'enablingActiveElement':
          this.enablingActiveElement();
          break;
        case 'disablingActiveElement':
          this.disablingActiveElement();
      }
    }
    else {
      switch (action.methodType) {
        case 'removeToBeDisplayed':
          this.removeToBeDisplayed(action);
          break;
        case 'disableAccessoriesTextFields':
          this.disableAccessoriesTextFields(action, instance, actionService);
          break;
        case 'enableAccessoriesTextFields':
          this.enableAccessoriesTextFields(actionService);
          break;
        case 'generateffString':
          this.generateffString();
          break;
        case 'dellCARPackoutResultCodeAndTimeout':
          this.dellCARPackoutResultCodeAndTimeout();
          break;
        case 'disabledQRCode':
          this.disabledQRCode(action, instance, actionService);
          break; 
      }
    }
  }

  removeToBeDisplayed(action) {
    let confirmAccessoriesFlexFieldsData = this.contextService.getDataByKey('confirmAccessoriesFlexFieldsData');
    confirmAccessoriesFlexFieldsData = confirmAccessoriesFlexFieldsData.filter(ele => ele.TO_BE_DISPLAYED === true);
    this.contextService.addToContext('confirmAccessoriesFlexFieldsData', confirmAccessoriesFlexFieldsData);
  }

  disableAccessoriesTextFields(action, instance, actionService) {
    const confirmAccessoriesData = this.contextService.getDataByKey('confirmAccessoriesFlexFieldsData');
    const confirmAccessoriesFlexFieldsData = cloneDeep(confirmAccessoriesData);
    let removeItemCount = 0;
    for(let i = 0, k = 0; i < confirmAccessoriesFlexFieldsData.length, k < confirmAccessoriesFlexFieldsData.length + removeItemCount; k++){

      const currentField = this.contextService.getDataByKey(k + 'newNoUUIDref');
      const currentFieldReadOnlyValue = currentField?.instance.readOnly;

      /// For all text feilds which are not read-only, disable fields and show missing
    
      if (!currentFieldReadOnlyValue) {
        if(currentField && currentField.instance && (!(currentField.instance.currentTextFieldValue) || !(currentField.instance.rightLabel))){
          
          const disableFieldAction = {
            type: 'updateComponent',
            config: {
              key: k + 'newNoUUID',
              properties: {
                disabled: true,
                rightLabel: confirmAccessoriesFlexFieldsData[i].FF_NAME
              }
            }
          };
          this.componentService.handleUpdateComponent(disableFieldAction, null, null, this);

          const qrFieldPrefillAction = {
            type: 'setDefaultValue',
            config: {
              key: k + 'newNoUUID',
              defaultValue: confirmAccessoriesFlexFieldsData[i].QR_CODE
            }
          };

          actionService.handleAction(qrFieldPrefillAction, instance);
          
          const showMissing = {
            type: 'updateComponent',
            config: {
              key: k + 'missingAccessoryUUID',
              properties: {
                text: 'Missing',
                iconTextClass: 'body dell-car-missing-accessories'
              }
            }
          };
          this.contextService.addToContext(k + 'accessoryTitleUUID', showMissing);
          this.componentService.handleUpdateComponent(showMissing, null, null, this);
          i++;
        } else {
          if(currentField && currentField.instance){
            let recIndex = -1;
          
            for(let j = 0; j < confirmAccessoriesFlexFieldsData.length; j++){
              if(confirmAccessoriesFlexFieldsData[j].FF_NAME == currentField.instance.rightLabel && confirmAccessoriesFlexFieldsData[j].QR_CODE == currentField.instance.currentTextFieldValue){
                recIndex = j;
              }
            }

            if(recIndex != -1){
              confirmAccessoriesFlexFieldsData.splice(recIndex, 1);
              removeItemCount++;
            } else {
              i++;
            }
          }
          
        }
      }
    }
    // });
  }

  enableAccessoriesTextFields(actionService) {
    const missingAccessoriesList = this.contextService.getDataByKey('missingAccessoriesList');
    for (let i = 0; i < missingAccessoriesList.length; i++) {
      let index = i;
      if(index == 0){
        let qrCode = {
          "type": "updateComponent",
          "config": {
            "key": index + "newNoUUID",
            "properties": {
              "disabled": false,
              "placeholder": 'QR Code'
            }
          }
        }
        actionService.handleAction(qrCode, this);

        let missingAccessoryUUID = {
          "type": "updateComponent",
          "config": {
            "key": index + "missingAccessoryUUID",
            "properties": {
              "text": 'Missing Accessory?',
              "iconTextClass": "body change-position",
              "disabled": false
            }
          }
        }
        actionService.handleAction(missingAccessoryUUID, this);
      } else {
        let qrCode = {
          "type": "updateComponent",
          "config": {
            "key": index + "newNoUUID",
            "properties": {
              "disabled": true,
              "placeholder": 'QR Code'
            }
          }
        }
        actionService.handleAction(qrCode, this);

        let missingAccessoryUUID = {
          "type": "updateComponent",
          "config": {
            "key": index + "missingAccessoryUUID",
            "properties": {
              "text": 'Missing Accessory?',
              "iconTextClass": "body change-position missing-Color",
              "disabled": true
            }
          }
        }
        actionService.handleAction(missingAccessoryUUID, this);
      }

      const missingAccrs = {
        ctype: 'iconText',
        uuid: i + 'missingAccessoryUUID',
        text : 'Missing Accessory ?',
        name: i + 'Missing Accessory ?',
        iconTextClass: 'body change-position'
      };
      this.contextService.addToContext(i + 'accessoryTitleUUID', missingAccrs);
    }
  }

  generateffString() {
    const missingAccessoriesList = this.contextService.getDataByKey('confirmAccessoriesFlexFieldsData');
    let accff;

    // tslint:disable-next-line: no-unused-expression
    missingAccessoriesList && missingAccessoriesList.map((item) => {
      if (accff) {
        accff = accff + item.QR_CODE;
      }
      else {
        accff = item.QR_CODE;
      }
    });
    this.contextService.addToContext('accff', accff);
  }

  enablingActiveElement() {
    const activeElement = this.contextService.getDataByKey('activeElement');
    const x = this.contextService.getDataByKey('boxAccessoriesUUIDref');
    const t = x.instance.tiles;
    t.map((item) => {
      if (item.uuid === activeElement) {
        item.gridContainer = 'dell-car-tile-packout-container flex-space-around active-tile';
      }
    });
    x.instance._changeDetectionRef.detectChanges();
  }

  disablingActiveElement() {
    const activeElement = this.contextService.getDataByKey('activeElement');
    const x = this.contextService.getDataByKey('boxAccessoriesUUIDref');
    const t = x.instance.tiles;
    t.map((item) => {
      if (item.uuid === activeElement) {
        item.gridContainer = 'dell-car-tile-packout-container flex-space-around';
      }
    });
    x.instance._changeDetectionRef.detectChanges();
  }
  boxDataFormation(action, instance, actionService) {
    const boxData = this.contextService.getDataByKey('getBoxNumber');
    boxData.sort((a, b) => {
      return Number(a.displayOrder) - Number(b.displayOrder);
    });
    const boxes = [];
    boxData.map((x) => {
      const obj = {
        cols: 1,
        rows: 1,
        dellCarReceiving: true,
        class:  x.boxName === 'REUSED' ? 'subtitle1 greyish-black dell-receiving-title' : 'dell-receiving-title',
        imageSrc: '../../../assets/Images/Dell_Other.png',
        gridContainer: x.disabled === true ? 'disabled-pointer dell-car-tile-packout-container flex-space-around' : 'dell-car-tile-packout-container flex-space-around',
        text: x.boxName,
        tileValue: 'Yes',
        uuid: x.boxName + 'UUID',
        parentUUID: 'boxAccessoriesUUID',
        accessoryName: x.boxName,
        isDefault: 'false',
        targetuuid: x.boxName + 'UUID',
        disabled: x.disabled,
        executePlainActions: true,
        precondition: {
          type: 'checkDisabled',
          config: {
            source: '#Accessories'
          }
        },
        template: [],
        actions: x.boxName === 'REUSED' ? [
          {
            type: 'handleDellCarPackoutActions',
            config: {
              methodType: 'disablingActiveElement'
            },
            eventSource: 'click'
          },
          {
            type: 'updateComponent',
            config: {
              key: 'boxPnUUID',
              properties: {
                disabled: true
              }
            },
            eventSource: 'click'
          },
          {
            type: 'updateComponent',
            config: {
              key: 'dellCarPackoutBoxTaskPanelUUID',
              fieldProperties: {
                boxPN: x.boxNumber
              }
            },
            eventSource: 'click'
          },
          {
            type: 'context',
            config: {
              requestMethod: 'add',
              key: 'activeElement',
              data: x.boxName + 'UUID'
            },
            eventSource: 'click'
          },
          {
            type: 'handleDellCarPackoutActions',
            config: {
              methodType: 'enablingActiveElement'
            },
            eventSource: 'click'
          }
        ] : [
            {
              type: 'handleDellCarPackoutActions',
              config: {
                methodType: 'disablingActiveElement'
              },
              eventSource: 'click'
            },
            {
              type: 'updateComponent',
              config: {
                key: 'boxPnUUID',
                properties: {
                  disabled: false
                }
              },
              eventSource: 'click'
            },
            {
              type: 'updateComponent',
              config: {
                key: 'dellCarPackoutBoxTaskPanelUUID',
                fieldProperties: {
                  boxPN: x.boxNumber
                }
              },
              eventSource: 'click'
            },
            {
              type: 'context',
              config: {
                requestMethod: 'add',
                key: 'activeElement',
                data: x.boxName + 'UUID'
              },
              eventSource: 'click'
            },
            {
              type: 'handleDellCarPackoutActions',
              config: {
                methodType: 'enablingActiveElement'
              },
              eventSource: 'click'
            }
          ]
      };
      boxes.push(obj);
    });
    this.contextService.addToContext('boxes', boxes);
  }

  // for edit Functionality
  dellCARPackoutResultCodeAndTimeout() {
    const parentuuid = this.contextService.getDataByKey('PackingcheckAccessoriesTaskPanelUUID' + 'ref'); // current taskpanel uuid
    let currentWC = this.contextService.getDataByKey("currentWC");
    if (parentuuid !== undefined) {
      const MendatoryFlag = parentuuid.instance.isMandatory; // for isMandatory Task only we need to disable
      if (MendatoryFlag === true) {

        // used some flag so that after completing all the task panels this flag will be true
        const validatetaskpanelstatus = this.contextService.getDataByKey
        (currentWC+'validatetaskpanelstatus');
        if (validatetaskpanelstatus === true) {
          const ResultCodes = {
            type: 'updateComponent',
            config: {
              key: 'dellCarPackingResultCodesUUID',
              properties: {
                disabled: true
              }
            },
            eventSource: 'click'
          };
          this.componentService.handleUpdateComponent(ResultCodes, null, null, this);
          const Timeout = {
            type: 'updateComponent',
            config: {
              key: 'dellCarPackingTimeoutUUID',
              properties: {
                disabled: true
              }
            },
            eventSource: 'click'
          };
          this.componentService.handleUpdateComponent(Timeout, null, null, this);
        }
      }
    }
  }

  disabledQRCode(action, instance, actionService){
    let missingAccessoriesList = this.contextService.getDataByKey('missingAccessoriesList');

    missingAccessoriesList.forEach((element , i) => {
      let index = i;
      if(index == 0){

      } else {
        let qrCode = {
          "type": "updateComponent",
          "config": {
            "key": index + "newNoUUID",
            "properties": {
              "disabled": true
            }
          }
        }
        actionService.handleAction(qrCode, this);

        let missingAccessoryUUID = {
          "type": "updateComponent",
          "config": {
            "key": index + "missingAccessoryUUID",
            "properties": {
              "iconTextClass": "body change-position missing-Color",
              "disabled": true
            }
          }
        }
        actionService.handleAction(missingAccessoryUUID, this);
      }
    });
  }
}
