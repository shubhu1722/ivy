import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActionService } from '../../../services/action/action.service';
import { ContextService } from '../../../services/commonServices/contextService/context.service';
import { PaPopupService } from '../../../services/commonServices/pa-popup-service/pa-popup.service';

export interface PeriodicElement {
  commodity: string;
  position: string;
  stockQty: number;
}

@Component({
  selector: 'app-pa-popup-table',
  templateUrl: './pa-popup-table.component.html',
  styleUrls: ['./pa-popup-table.component.scss']
})
export class PaPopupTableComponent implements OnInit {
  dataSource: any;
  
  constructor(private actionService: ActionService, private contextService: ContextService, private paPopupService: PaPopupService, private ref: ChangeDetectorRef)
  { }

  ngOnInit(): void {
    this.getPATableData();
    this.paPopupService.activePaPopupDataUpdate.subscribe((data: any) => {
      this.updatePaPopupService();
    });
  
 
  }

  displayedColumns: string[] = ['commodity', 'partNo', 'stockQty'];
  selection = new SelectionModel<PeriodicElement>(true, []);

  getPATableData() {
    let flag;
    let localText;
    let textClass;
    let unitHpFaData = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");
    let partNumberData=[];
    let unitData = unitHpFaData && unitHpFaData.filter(ele => ele.partNo);
    unitData.forEach((element) => {
      if(element.partNo){
      partNumberData.push(element.partNo);
      }
  });
  this.contextService.addToContext('submittablePartNumberData', partNumberData.join(';'));

    unitData.forEach(element => {
      if (element.stockQty > 0) {
        element.status = "Available",
        element.statusClass = "body-italic text-success ml-2"
      } else {
        element.status = "Unavailable",
        element.statusClass = "body-italic text-danger ml-2"
      }
    });
    this.dataSource = unitData;

    unitData.forEach(element => {
      let qty = element.stockQty;
      if (qty > 0) {
      } else {
        flag = true;
      }
    });
    if (flag == true) {
      localText = "Parts Not Available",
      textClass = "pb-3 body-italic text-danger ml-1"
    } else {
      localText = "Parts Available",
      textClass = "pb-3 body-italic text-success ml-1"
    }
    let data = {
      text: localText,
      class: textClass
    }
    this.contextService.addToContext("dellMsg", data);
  }

  updatePaPopupService(){
     this.selection = new SelectionModel<PeriodicElement>(true, []);
     this.dataSource = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");
     this.ref.detach();
     setInterval(() => {
       this.ref.detectChanges();
     }, 500);
 }
}
