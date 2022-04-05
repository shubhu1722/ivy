import { Injectable } from '@angular/core';
import { ActionService } from '../../action/action.service';

@Injectable({
  providedIn: 'root'
})
export class HookService {

  constructor(private actionService: ActionService) { }

  handleHook(hooksData: any[], instance) {
    if (hooksData && hooksData.length > 0) {
      hooksData.forEach((hookData) => {
        this.actionService.handleAction(hookData, instance);
      });
    }
  }
}
