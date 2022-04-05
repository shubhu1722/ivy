import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ContextService } from '../contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class PaPopupService {
  dataSource: any;
  activePaPopupDataUpdate = new Subject();

  constructor(private contextService: ContextService) { }

  updatePaPopup(action, instance) {
      let dataSource = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");
      if(dataSource)
      this.activePaPopupDataUpdate.next(dataSource);
  }
}
