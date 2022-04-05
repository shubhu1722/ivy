import { Injectable } from '@angular/core';
import { ContextService } from '../contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class ButtonActionsService {
  constructor(
    private contextService: ContextService
  ) { }
  triggerClick(action, instance) {
    if(action && action.config && action.config.id) {
      let element:HTMLElement = document.getElementById(action.config.id) as HTMLElement;

      element.click();
    } else {
      const refData = this.contextService.getDataByKey(action.config.key + 'ref');
      refData.instance[refData.instance.ctype].nativeElement.click();
    }    
  }
  
  triggerReqClick(action: any, instance: any, actionService: any) {
    const refData = this.contextService.getDataByKey(action.config.key + 'ref');
    if(refData.instance.actions.length > 0){
      refData.instance.actions.forEach((element) => {
        actionService.handleAction(element, instance)
      });
    }
  }
}
