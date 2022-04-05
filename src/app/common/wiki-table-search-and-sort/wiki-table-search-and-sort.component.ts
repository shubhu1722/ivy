import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { ActionService } from '../../services/action/action.service';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { UtilityService } from '../../utilities/utility.service';
import { EventServiceService } from '../../services/commonServices/eventService/event-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentHelperService } from '../../services/commonServices/component-helper/component-helper.service';
import { WikiService } from '../../services/commonServices/wikiService/wiki.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { SmeAlertDialogComponent } from '../sme-alert-dialog/sme-alert-dialog.component';
import { Router } from '@angular/router';
import { PendingWikiComponent } from '../pending-wiki/pending-wiki.component';
import { MatPaginator } from '@angular/material/paginator';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-wiki-table-search-and-sort',
  templateUrl: './wiki-table-search-and-sort.component.html',
  styleUrls: ['./wiki-table-search-and-sort.component.scss']
})
export class WikiTableSearchAndSortComponent implements OnInit {

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
  @Input() tableSearchClass: any;
  @Input() isDelete: boolean;
  @Input() isShowFooter: boolean;
  @Input() tableContainerClass: string;
  @Input() tableDivCalss: string;
  @Input() actions: any;
  @Input() primaryFooterText: any;
  @Input() secondaryFooterText: any;
  @Input() group: FormGroup;
  @Input() serachVariable: any;
  @Input() searchBox: boolean;
  @Input() tableType: string;
  @Input() apiCall:true;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  matTableDataSource = new MatTableDataSource<any>();
  dataForFiltering;
  selectedValue: any;
  aa: boolean = false;
  search_icon: any = { width: "auto", height: "auto" }
  search_input: any = { border: "none", outline: "none", color: "black" }

  wikiPendingData:any = [];
  isProcessStatus:any;
  isAvailableStatus:any;

  isGlassIcon:any = [];
  isCommentIcon:any = [];
  isLockIcon:any = [];
  isProcessIcon:any = [];
  isRejectIcon:any = [];
  isApproveIcon:any = [];
  

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private contextService: ContextService,
    private utilityService: UtilityService,
    private actionService: ActionService,
    private eventService: EventServiceService,
    private componentHelper: ComponentHelperService,
    private wikiService: WikiService,
    public dialog: MatDialog,
    private router: Router
  ) {}

   orgData:any;
   locationData
  clientData
  contractData
  workCenterData
  ngOnInit(): void {  
    console.log("wiki-table-ng");
if(this.apiCall){
  this.wikiService.getUserData().subscribe((data: any) => {
    console.log("data",data);
     this.locationData = data.data.LocationDetails;
     this.clientData = data.data.ClientDetails;
     this.contractData = data.data.ContractDetails;
     this.workCenterData = data.data.WorkCenterDetails;
  });
}
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
    this.datasource.paginator = this.paginator;
  }
 
  // search filter on perticular column
  datasouCopy: any;
  applyFilter(event: any, column: any) {
    
    if (!this.datasouCopy) this.datasouCopy = [...this.datasource.data];
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = '';
    const data = [...this.datasouCopy].filter((obj: any) => {
      return (obj[column] + "").toLowerCase().includes(filterValue.trim().toLowerCase())
    });
    this.isApproveIcon.splice(0,this.isApproveIcon.length);
    this.isProcessIcon.splice(0,this.isProcessIcon.length);
    this.isGlassIcon.splice(0,this.isGlassIcon.length);
    this.isCommentIcon.splice(0,this.isCommentIcon.length);
    this.isLockIcon.splice(0,this.isLockIcon.length);
    this.isRejectIcon.splice(0,this.isRejectIcon.length);
    this.datasource.data = data;
   
  }

  dropdownDatasouCopy: any;
  applyPendingDropdownFilter(event: any, column: any) {
    if (!this.dropdownDatasouCopy) this.dropdownDatasouCopy = [...this.datasource.data];
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = '';
    let data =this.dropdownDatasouCopy;
    if (filterValue !== "-Select-") {
      data = [...this.dropdownDatasouCopy].filter((obj: any) => {
        if (obj.wikiVersion == '1.1') {
          if (filterValue == 'Instruction') return obj;
        } else if (obj.wikiVersion !== '1.1') {
          if (filterValue == 'Comment') return obj;
        }
      });
    }
     
    this.isApproveIcon.splice(0,this.isApproveIcon.length);
    this.isProcessIcon.splice(0,this.isProcessIcon.length);
    this.isGlassIcon.splice(0,this.isGlassIcon.length);
    this.isCommentIcon.splice(0,this.isCommentIcon.length);
    this.isLockIcon.splice(0,this.isLockIcon.length);
    this.isRejectIcon.splice(0,this.isRejectIcon.length);
    this.datasource.data = data;
  }

  submitDatasouCopy: any;

  applySubmitDropdownFilter(event: any, column: any) {
    if (!this.submitDatasouCopy) this.submitDatasouCopy = [...this.datasource.data];
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = '';
    const data = [...this.submitDatasouCopy].filter((obj: any) => {
      if (obj.status == 'PENDING FOR APPROVAL') {
        if (filterValue == 'Pending') return obj;
      } else if (obj.status == 'APPROVED') {
        if (filterValue == 'Accepted') return obj;
      } else if (obj.status == 'REJECT') {
        if (filterValue == 'Notification') return obj;
      }
    });
    this.isApproveIcon.splice(0, this.isApproveIcon.length);
    this.isProcessIcon.splice(0, this.isProcessIcon.length);
    this.isGlassIcon.splice(0, this.isGlassIcon.length);
    this.isCommentIcon.splice(0, this.isCommentIcon.length);
    this.isLockIcon.splice(0, this.isLockIcon.length);
    this.isRejectIcon.splice(0, this.isRejectIcon.length);
    this.datasource.data = data;
  }

  /// On click of row
  onClickOfRow(rowData, ind) {
    this.actions && this.actions.map((action) => {
      if (action.eventSource === "rowClick") {
        if (action.type === "addRowData") {
          if (rowData.wikiDocCRId) {
            this.contextService.addToContext(action.keyToSave, rowData);
            this.contextService.addToContext("clickedRowIndex", ind);
            this.wikiService.updatePendingWikiData(rowData.wikiDocCRId).subscribe((data: any) => {
              rowData["wikiData"] = data.data[0].wikiCrData;
            });
          } else {
            this.contextService.addToContext(action.keyToSave, rowData);
            this.contextService.addToContext("clickedRowIndex", ind);
          }
        }
        else {
          this.actionService.handleAction(action, this);
          this.eventService.handleEvent(this, action.eventSource);
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
    this.isApproveIcon.splice(0, this.isApproveIcon.length);
    this.isProcessIcon.splice(0, this.isProcessIcon.length);
    this.isGlassIcon.splice(0, this.isGlassIcon.length);
    this.isCommentIcon.splice(0, this.isCommentIcon.length);
    this.isLockIcon.splice(0, this.isLockIcon.length);
    this.isRejectIcon.splice(0, this.isRejectIcon.length);
    this.datasource = new MatTableDataSource(data);
    this._changeDetectionRef.detectChanges();
  }

}