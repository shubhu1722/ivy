// import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { data } from '../../../data';
import { ActionService } from '../../../services/action/action.service';
import { ContextService } from '../../../services/commonServices/contextService/context.service';
import { DellCarDebugService } from '../../../services/dellCar/dellCarDebug/dell-car-debug.service';
import { UtilityService } from '../../../utilities/utility.service';
import { SelectionModel } from '@angular/cdk/collections';
import { DuplicatePartPopupService } from '../../../services/commonServices/duplicatePopupService/duplicate-part-popup.service';

export interface PeriodicElement {
  commodity: any;
  partNumber: any;
  
}

@Component({
  selector: 'app-duplicate-partnumber',
  templateUrl: './duplicate-partnumber.component.html',
  styleUrls: ['./duplicate-partnumber.component.scss']
})
export class DuplicatePartnumberComponent implements OnInit {

  index;
  @Input() dataSource: any;
  @Input() uuid: any;

  displayedColumns: string[] = ['commodity', 'partNumber'];
  selection = new SelectionModel<PeriodicElement>(true, []);
  matTabledatasource = new MatTableDataSource<any>();
  constructor(private action: ActionService,
    private utilityService: UtilityService,
    private contextService: ContextService,
    private actionService: ActionService,
    private ref: ChangeDetectorRef,
    private DuplicatePartPopupService : DuplicatePartPopupService
  ) { }

  ngOnInit(): void {
    this.duplicateparNumbers();
    this.DuplicatePartPopupService.activeDuplicatePartDataUpdate.subscribe((data: any) => {
      this.updatedellCarDebugservice();
    });
  }
  
  duplicateparNumbers() {
    let partNumber = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");
    partNumber && partNumber.forEach((ele, index) => {
      let dupCount = partNumber.filter((ele1) => ele1.partNo === ele.partNo).length;
      ele["status"] = (!ele.partNo || dupCount < 2) ? false : true;
    });
    let dupData = partNumber.filter((ele1) => ele1.status == true);
    this.dataSource = dupData;
  }

  updatedellCarDebugservice(){
    this.selection = new SelectionModel<PeriodicElement>(true, []);
     this.dataSource = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");
     
     this.ref.detach();
     setInterval(() => {
       this.ref.detectChanges();
     }, 500);
 }
}
