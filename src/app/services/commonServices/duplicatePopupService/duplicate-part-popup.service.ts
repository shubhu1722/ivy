import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ContextService } from '../contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class DuplicatePartPopupService {
  dataSource: any;
  activeDuplicatePartDataUpdate = new Subject();

  constructor(private contextService: ContextService) { }

  updateDuplicatePartPopup(action, instance) {
      let dataSource = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");
      if(dataSource)
      this.activeDuplicatePartDataUpdate.next(dataSource);
  }
}
