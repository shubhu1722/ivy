import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';
import { cloneDeep } from 'lodash';
import holdPopup from '@assets/dell-motherboard_json/footer-hold/holdPopup.json';
import dellMBRtimeInMicroServices from '@assets/dell-motherboard_json/common/dell-mbr-jsons/dellMBRtimeInMicroServices.json';
import dellMBRcommonActions from '@assets/dell-motherboard_json/common/dell-mbr-jsons/dellMBRcommonActions.json';
import dellMBRreleaseActions from '@assets/dell-motherboard_json/common/dell-mbr-jsons/dellMBRreleaseActions.json';
import dellMBRscreenOperations from '@assets/dell-motherboard_json/common/dell-mbr-jsons/dellMBRscreenOperations.json';
import { contextKeysEnum, errorTitleAction } from '../../../utilities/constants';

export enum DellWorkCenters {
  'DELL_MBR_BURN-IN' = 'burn-in',
  DELL_MBR_OBA = 'oba',
  // DELL_MBR_BGA = 'bga',
  // DELL_MBR_CPU = 'cpu',
  // DELL_MBR_DEBUG = 'debug',
  // DELL_MBR_DEBUG_L2 = 'debug-l2',
  // DELL_MBR_ECO = '',
  // DELL_MBR_FTEST = '',
  // DELL_MBR_PA = 'pa',
  // 'DELL_MBR_PACK-CPU' = 'pack-cpu',
  // 'DELL_MBR_PACK-CPU-REP' = 'cpu-rep',
  // 'DELL_MBR_PACK-CPU-SCR' = 'cpu-scr',
  // 'DELL_MBR_PACK-RTV' = 'pack-rtv',
  // 'DELL_MBR_PACK-SCR' = 'pack-scr',
  // DELL_MBR_PACKOUT = 'packout',
  // DELL_MBR_QVT = 'qvt',
  // DELL_MBR_REWORK = 'rework',
  // DELL_MBR_VMI = 'vmi',
}

@Injectable({
  providedIn: 'root',
})
export class DellMBRService {
  constructor(private contextService: ContextService) {}
  handleDellMBRTimeInActions(actionData, instance, actionService, responseData?: any) {
    /// Deep cloning so that old values are cleared
    const action = cloneDeep(actionData);

    this.timeInMicroServiceMBR(action, instance, actionService);
  }

  timeInMicroServiceMBR(action, instance, actionService) {
    actionService.handleAction(dellMBRtimeInMicroServices, instance);
  }

  dellMBRcommonAction(action, instance, actionService) {
    const commonActions = [dellMBRcommonActions];

    commonActions.forEach((element) => {
      actionService.handleAction(element, instance);
    });
  }

  dellMBRReleaseActions(action, instance, actionService) {
    const releaseActions = [dellMBRreleaseActions];

    releaseActions.forEach((element) => {
      actionService.handleAction(element, instance);
    });
  }

  dellMBRScreenOperation(action, instance, actionService) {
    const dellScreenLevelOperation = [dellMBRscreenOperations];

    dellScreenLevelOperation.forEach((element) => {
      actionService.handleAction(element, instance);
    });
  }

  handleHoldPopup(instance, actionService) {
    // we can use specific config for different request
    // in file where we implemented popup we should write in action section below "ctype": "iconbutton":
    //   for example: {
    //   "type": "openHoldPopup",
    //   "config": {
    //     "key": "holdDialogData",
    //       "data": "formData",
    //       "requestMethod": "add"
    //   },
    //   "eventSource": "click"
    // }
    // and here we can get it:
    // instance.actions[0].config

    [holdPopup].forEach((element) => {
      this.insertDynamicValues(
        element.responseDependents.onSuccess.actions,
        { body: { flexFields: this.getFlexFields } },
        'microservice',
        'addInfoCodes'
      );
      actionService.handleAction(element, instance);
    });
  }

  get getFlexFields() {
    const flexFieldKeys = this.contextService.getDataByString('#getFFByWc')?.map((ff) => ff.ffName);
    const currentWC = this.contextService.getDataByString('#currentWC');
    const screenData = this.contextService.getDataByString('#' + currentWC)?.get(contextKeysEnum.currentScreenData);
    return flexFieldKeys.map((ff) => ({
      name: ff,
      value: screenData ? screenData[ff] : null,
    }));
  }

  insertDynamicValues(array: Array<any>, value: Object, type: string, microserviceId?: string) {
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (element.type === type && element.config?.microserviceId === microserviceId) {
        const key = Object.keys(value)[0];
        Object.assign(element.config[key], value[key]);
        break;
      }
      if (element.hasOwnProperty('responseDependents')) {
        this.insertDynamicValues(element.responseDependents.onSuccess.actions, value, type, microserviceId);
      }
    }
  }

  handleGetTestPlatformValue(action): void {
    const processData: any[] = this.contextService.getDataByString(action.config.data);
    const testPlatformValue = processData.find((x) => x.universalFfName === 'Test Platform').universalFfValue;
    this.contextService.addToContext(action.config.key, testPlatformValue);
  }

  handleGetPlatformNameValue(action): void {
    const processData: any[] = this.contextService.getDataByString(action.config.data);
    const platformNameValue = processData.find((x) => x.universalFfName === 'Platform name').universalFfValue;
    this.contextService.addToContext(action.config.key, platformNameValue);
  }

  handleWcMBRRenderActions(action, instance, actionService) {
    let templateId = '';
    let wc = '';

    if (action?.config?.wc) {
      wc = this.contextService.getDataByString(action.config.wc);
    }

    const template = DellWorkCenters[wc];
    if (template) {
      templateId = `dell-motherboard_json/${template}/${template}_response.json`;
    }

    if (templateId) {
      actionService.handleAction(
        {
          type: 'renderTemplate',
          config: {
            templateId,
            mode: 'local',
          },
        },
        instance
      );
    } else {
      actionService.handleAction(
        errorTitleAction(`${wc} is not configured yet, for the front end`, 'searchCriteriaErrorTitleUUID'),
        actionService
      );
    }
  }
}
