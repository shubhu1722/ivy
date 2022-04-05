import { Component, Input, OnInit,ChangeDetectorRef } from '@angular/core';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { ActionService } from '../../services/action/action.service';
import { VerifoneReceivingServiceService } from '../../services/verifone/verifoneReceiving/verifone-receiving-service.service';
@Component({
  selector: 'app-verifone-rma-receiving-table',
  templateUrl: './verifone-rma-receiving-table.component.html',
  styleUrls: ['./verifone-rma-receiving-table.component.scss']
})
export class VerifoneRmaReceivingTableComponent implements OnInit {
  @Input() visibility: false;
  rmaListData:any=[];
  sortOrder = 'asc';
  constructor(private contextService: ContextService,
              private verifoneReceivingService: VerifoneReceivingServiceService,
              private ref: ChangeDetectorRef,
              private actionService: ActionService) { }

  ngOnInit(): void {
    this.verifoneReceivingService.renderRMAList.subscribe((data: any) => {
      console.log("rma list data", data);
      this.rmaListData = data ? data : [];
      this.ref.detach();
      this.ref.detectChanges();
    });
  }

  sortUnitTable(columnname, rmaListData, sortOrder) {
    this.rmaListData.sort((a, b) => {
      const obj1 = a[columnname];
      const obj2 = b[columnname];
      if (sortOrder === 'asc') {
        this.sortOrder = 'desc';
        return (obj1).localeCompare(obj2);
      } if (sortOrder === 'desc') {
        this.sortOrder = 'asc';
        return (obj2).localeCompare(obj1);
      }
    });
    this.ref.detach();
    this.ref.detectChanges();
    console.log("this.rmaList", this.rmaListData);
  }

  goToReceiving(item) {
    if (item && item.inboundOrderStatus && item.inboundOrderStatus.toLowerCase() !== "complete" && item.serialNo) {
      this.contextService.addToContext('selectedRMASerialNumer', item.serialNo);
      let actionData = {type: 'rmaToVerifoneReceiving'};
      this.actionService.handleAction(actionData, '','');
    }    
      
  }


}
