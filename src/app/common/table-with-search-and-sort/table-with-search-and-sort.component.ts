import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActionService } from '../../services/action/action.service';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { EventServiceService } from '../../services/commonServices/eventService/event-service.service';
import { UtilityService } from '../../utilities/utility.service';

@Component({
  selector: 'app-table-with-search-and-sort',
  templateUrl: './table-with-search-and-sort.component.html',
  styleUrls: ['./table-with-search-and-sort.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableWithSearchAndSortComponent implements OnInit {

  eventMap = ['columnClick', 'itemclick', 'rowDelete'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];
  @Input() displayedColumns: any[];
  @Input() displayValues: any;
  @Input() iconList: any;
  @Input() datasource: any;
  @Input() tableClass: any;
  @Input() tableHeaderClass: any;
  @Input() tableDataClass: any;
  @Input() tableRowClass: any;
  @Input() isDelete: boolean;
  @Input() isShowFooter: boolean;
  @Input() tableContainerClass: string;
  @Input() tableDivCalss: string;
  @Input() actions: any;
  @Input() primaryFooterText: any;
  @Input() secondaryFooterText: any;
  @Input() group: FormGroup;
  @Input() serachVariable: any;
  @Input() paging:boolean;
  @ViewChild(MatSort) sort: MatSort;
  matTableDataSource = new MatTableDataSource<any>();
  dataForFiltering;

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private contextService: ContextService,
    private utilityService: UtilityService,
    private actionService: ActionService
  ) { }


  ngOnInit(): void {
    if (this.datasource && this.datasource !== undefined) {
      let data = [];
      if (this.utilityService.isString(this.datasource) && this.datasource.startsWith('#')) {
        this.datasource = this.contextService.getDataByString(this.datasource);
      }
      this.datasource !== "" && this.datasource.map((item) => {
        let obj = {};
        item && Object.keys(item).map((key) => {
          obj[this.displayValues[key]] = item[key];
        })
        data.push(obj);
      });
      this.datasource = data;
      this.dataForFiltering = data;
      let obj = {};
      if (this.iconList === undefined) {
        this.displayedColumns && this.displayedColumns.map((column) => {
          obj[column] = {
            "iconBeforeText": false,
            "iconAfterText": false,
            "showText": true,
            "enableSort": false
          }
        });
        this.iconList = obj;
      }
      this.datasource = new MatTableDataSource(this.datasource);
    }
  }

  ngAfterViewInit(): void {
    this.datasource.sort = this.sort;
  }

  doFilter(value) {
    this.datasource.filter = value.trim().toLocaleLowerCase();
    this._changeDetectionRef.detectChanges();
  }

  /// On click of row
  onClickOfRow(rowData) {
    this.actions && this.actions.map((action) => {
      if (action.eventSource === "rowClick") {
        if (action.type === "addRowData") {
          this.contextService.addToContext(action.keyToSave, rowData);
        } else {
          this.actionService.handleAction(action, this);
        }
      }
    })
  }

  onSort(order, headerName) {
    // this.datasource.sort = this.sort;
    let data = this.datasource.data;
    if (order === 'asc') {
      data.sort((a, b) => {
        if (a[headerName] < b[headerName])
          return -1;
        if (a[headerName] > b[headerName])
          return 1;
        return 0;
      });
    } else if (order === 'desc') {
      data.sort((a, b) => {
        if (b[headerName] < a[headerName])
          return -1;
        if (b[headerName] > a[headerName])
          return 1;
        return 0;
      });
    }
    this.datasource = new MatTableDataSource(data);
    this._changeDetectionRef.detectChanges();
  }
}