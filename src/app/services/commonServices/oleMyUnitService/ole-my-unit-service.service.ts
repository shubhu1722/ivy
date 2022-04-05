import { Injectable, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { OleTableComponent } from '../../../common/ole-table/ole-table.component';
import { ActionService } from '../../action/action.service';
import { ContextService } from '../contextService/context.service';

@Injectable({
    providedIn: 'root'
})
export class OleMyUnitServiceService {
    dataSource: any;
    activeUnitTableDataUpdate = new Subject();

    constructor(private contextService: ContextService) { }

    updateMyUnitsData(action, instance) {
        let dataSource = this.contextService.getDataByString("#getMyUnitsData");
        this.activeUnitTableDataUpdate.next(dataSource);
    }
}
