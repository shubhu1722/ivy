import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class TableComponent implements OnInit {
  eventMap = ['columnClick', 'itemclick', 'rowDelete'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];
  @Input() displayedColumns: any[];
  @Input() datasource: any;
  @Input() tableClass: any;
  @Input() tableHeaderClass: any;
  @Input() tableDataClass: any;
  @Input() tableRowClass: any;
  @Input() isDelete: boolean;
  @Input() isShowFooter: boolean;
  @Input() tableContainerClass: string;
  @Input() actions: any;
  @Input() primaryFooterText: any;
  @Input() secondaryFooterText: any;
  @Input() group: FormGroup;
  @Input() tooltip: String;
  parentuuid: any;
  isDisable:any;
  matTableDataSource = new MatTableDataSource<any>();
  columnsToDisplay: string[];
  constructor(private contextService: ContextService, private utilityService: UtilityService,
              private eventService: EventServiceService, private _changeDetectionRef: ChangeDetectorRef,
              translate: TranslateService
            ) { 
              let language = localStorage.getItem('language');
              translate.setDefaultLang(language);
              translate.use(language)
            }

  ngOnInit(): void {
    let ScreenMenuObj = this.contextService.getDataByKey("ScreenMenuObj");
    this.isDelete = this.isDelete !== undefined ? this.isDelete : false;
    this.columnsToDisplay = this.displayedColumns.slice();
    if (this.isDelete) {
      this.columnsToDisplay.push('actions');
      if(this.tooltip === undefined){
        this.tooltip = "Delete"
      }else {
        this.tooltip = this.tooltip;
      }
      
    }
    if (this.datasource && this.datasource !== undefined) {
      if (this.utilityService.isString(this.datasource) && this.datasource.startsWith('#')){
        this.datasource = this.contextService.getDataByString(this.datasource);
      }
      this.matTableDataSource.data = this.datasource;
    }
    if (ScreenMenuObj && ScreenMenuObj.completed) {
      this.isDisable = true;
    }
  }

  deleteRow(event, index: number) {
    const eventType = { type: event.type };
    eventType.type = 'rowDelete';
    const rowData = this.datasource[index];
   // this.datasource.splice(index, 1);
    this.parentuuid = rowData.parentUUID;
    // this.matTableDataSource.data.splice(index, 1);
    // this.matTableDataSource._updateChangeSubscription();
    // this._changeDetectionRef.detectChanges();
    this.eventMap.forEach((ele) => {
      if (ele === eventType.type) {
        this.eventService.handleEvent(this, eventType);
      }
    });
  }
}
