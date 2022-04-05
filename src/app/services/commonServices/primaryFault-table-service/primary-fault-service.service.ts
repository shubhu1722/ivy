import { Injectable, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { OleTableComponent } from '../../../common/ole-table/ole-table.component';
import { ActionService } from '../../action/action.service';
import { ContextService } from '../contextService/context.service';

@Injectable({
    providedIn: 'root'
})
export class PrimaryFaultService {
    dataSource: any;
    activeUnitTableDataUpdate = new Subject();

    constructor(private contextService: ContextService) { }

    updatePrimaryFault(action, instance) {
        let dataSource = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");
        if(!dataSource){
            dataSource = [];
        }
        this.activeUnitTableDataUpdate.next(dataSource);
    }
}
