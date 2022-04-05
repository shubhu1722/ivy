import { Injectable } from '@angular/core';
//import { UtilityService } from 'src/app/utilities/utility.service';
import { ContextService } from '../contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class FormOperService {

  constructor(
    private contextService: ContextService,
    // private utilityService: UtilityService
  ) { }
  handleReset(action, instance) {
    if (action.config != undefined && action.config.key != undefined) {
      let compRef = this.contextService.getDataByKey(action.config.key + 'ref');
      if (compRef && compRef.instance && compRef.instance.group) {
        compRef.instance.group.reset();
      }
    }
    else {
      instance.group.reset();
    }
  }

  resetControl(action, instance) {
    const key = action.config.key;
    if (action.config?.group) {
      const refData = this.contextService.getDataByKey(action.config.group + 'ref');
      refData.instance.group.controls[key].reset();
    } else {
      instance.group.controls[key].reset();
    }
  }

  resetForm(action, instance, actionService){
    let compref = this.contextService.getDataByKey(action.config.uuid + 'ref');
    if(compref !== undefined){
      compref.instance.uuid.reset();
    }
  }
  setDefaultValue(action: any, instance: any, utilityService) {
    //Template should have ctypes so check for that if no fail and if there success.
    let defaultValue = action.config.defaultValue;
    if (utilityService.isString(defaultValue) && defaultValue.startsWith('#')) {
      defaultValue = this.contextService.getDataByString(defaultValue);
    }

    var key = action.config.key;
    var refData;
    if (key !== undefined) {
      refData = this.contextService.getDataByKey(key + 'ref');
    } else {
      refData = this.contextService.getDataByKey(instance.uuid + 'ref');
    }
    if (refData) {
      refData.instance.group.controls[refData.instance.name].setValue(defaultValue);
      refData.instance._changeDetectionRef.detectChanges();
    } else {
      instance.group.controls[instance.name].setValue(defaultValue);
      instance._changeDetectionRef.detectChanges();
    }

  }
  validateLength(action, instance) {
    if (action && action.config) {
      if (action.config.type === "min") {
        if (action.config && action.config.value && action.config.length) {
          if (instance.group.controls[instance.name].value.length <= action.config.length) {
            if (instance.group.controls[instance.name].invalid == false) {
              instance.group.controls[instance.name].setErrors(null);
            }
          }
          else {
            instance.group.controls[instance.name].setErrors({ 'incorrect': true });
            if (action.config.buttonUUID && action.config.buttonUUID != undefined) {
              let refData = this.contextService.getDataByKey(action.config.buttonUUID + 'ref');
              if (refData) {
                refData.instance.disabled = true;
                refData.instance._changeDetectionRef.detectChanges();
              }
            }
          }
        }
      }
    }
  }

  handleSetFocus(action) {
      if(this.contextService.getDataByKey(`${action.config.targetId}ref`) !== undefined ){ 
      setTimeout(() => {
        this.contextService.getDataByKey(`${action.config.targetId}ref`).instance.textFieldRef.nativeElement.focus();
        this.contextService.getDataByKey(`${action.config.targetId}ref`).instance.textFieldRef.nativeElement.autofocus = true;
      }, 1000)
    }
  }

  resetCurrentControl(action, instance) {
    instance.group.controls[instance.name].reset();
    instance.group.controls[instance.name].setValue(null);
  }

  selectedCurrentControl(action, instance) {
    this.contextService.addToContext(instance.uuid + 'selected' , true);
  }

  /// This will update the control value based on the control name sent.
  setDefaultValueBasedOnName(action: any, instance: any, utilityService) {
    //Template should have ctypes so check for that if no fail and if there success.
    let defaultValue = action.config.defaultValue;
    let name = action.config.name;
    if (utilityService.isString(defaultValue) && defaultValue.startsWith('#')) {
      defaultValue = this.contextService.getDataByString(defaultValue);
    }

    var key = action.config.key;
    var refData;
    if (key !== undefined) {
      refData = this.contextService.getDataByKey(key + 'ref');
    } else {
      refData = this.contextService.getDataByKey(instance.uuid + 'ref');
    }
    if (refData) {
      refData.instance.group.controls[name].setValue(defaultValue);
      refData.instance._changeDetectionRef.detectChanges();
    } else {
      instance.group.controls[name].setValue(defaultValue);
      instance._changeDetectionRef.detectChanges();
    }

  }
}
