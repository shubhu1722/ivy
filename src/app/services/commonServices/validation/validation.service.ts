import { element } from 'protractor';
import { Injectable, Input } from '@angular/core';
import { ContextService } from '../contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private contextService: ContextService) { }
  filteredValidations: any = [];

  validateMethod(instance) {

    instance.validations.forEach((validation: any) => {
      this.handleValidation(instance, validation);
    });
  }
  handleValidation(instance, validation) {
    switch (validation.type) {
      case 'regex':
        this.handleRegexValidation(instance, validation);
        break;
    }
  }

  handleRegexValidation(instance, validation) {
    if (validation.script !== undefined && validation.script.startsWith('#')) {
      validation.script = this.contextService.getDataByString(validation.script);
    }
    if (instance.group) {
      instance.group.get(instance.name).setValidators([instance.validators.pattern(validation.script)]);
    }
  }
  
  handleRegexValidationOnArray(instance, sourceArray){
    let validatorsArray = [];
    if(sourceArray != null && sourceArray != undefined){
      for(let k=0;k<sourceArray.length;k++){
        let validObj = sourceArray[k];
        if (validObj.script !== undefined && validObj.script.startsWith('#')) {
          validObj.script = this.contextService.getDataByString(validObj.script);
        }
        validatorsArray.push(instance.validators.pattern(validObj.script));
      }
    }
    
    if (instance.group) {
      instance.group.get(instance.name).setValidators(validatorsArray);
      instance.group.controls[instance.name].updateValueAndValidity();
    }
  }
}
