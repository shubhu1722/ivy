import { Injectable } from '@angular/core';
import { HookService } from '../hook-service/hook.service';
import { ValidationService } from '../validation/validation.service';
import { ActionService } from '../../action/action.service';

@Injectable({
  providedIn: 'root',
})
export class EventServiceService {
  constructor(private hookService: HookService,private actionservice: ActionService, private validationService:ValidationService ) {}

  filteredactions: any = [];
  handleEvent(instance, event, isEnterKeyPressed?: boolean) {
    const actions = isEnterKeyPressed !== undefined && isEnterKeyPressed
    ? instance.footerActions : instance.actions;
    this.filteredactions = [];
    if(actions){
      actions.forEach((action) => {
        if (action.eventSource === event.type) {
          this.filteredactions.push(action);
        }
      });
    }
    this.filteredactions.forEach((ele) => {
      this.actionservice.handleAction(ele, instance);
      this.hookService.handleHook(instance.afterActionHooks, instance);
    });

    this.validationEvent(instance, event);

  }

//validation service
  filteredValidations : any = [];

  validationEvent(instance, event){
    if(instance.validations != undefined){
      instance.validations.forEach((ele)=>{
        if(ele.eventSource === event.type){
          this.filteredValidations.push(ele);
        }
     });
    }
    // this.validationService.validateMethod(this.filteredValidations());

  }


}
