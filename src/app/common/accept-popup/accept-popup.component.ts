import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { DellPredictiveService } from '../../services/dell/dellPredictive/dell-predictive.service';
import { EventServiceService } from '../../services/commonServices/eventService/event-service.service';
@Component({
  selector: 'app-accept-popup',
  templateUrl: './accept-popup.component.html',
  styleUrls: ['./accept-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class AcceptPopupComponent implements OnInit {
  selectedDropdownName: any;
  eventMap = ['change', 'openedChange', 'input'];
  isPrimaryFaultDisabled = false;
  
  constructor(
    private http: HttpClient,
    private contextService: ContextService,
    private dellpridictiveService: DellPredictiveService,
    private _changeDetectionRef: ChangeDetectorRef,
    private eventprocessor: EventServiceService,
   
  ) { }

  selection = new SelectionModel<any>(true, []);
  panelOpenState=false;
  @Input() tableClass: string;
  @Input() dropdownClass: string;
  @Input() checkBoxClass: string;
  @Input() icon: string;
  @Input() iconcss: string;
  @Input() iconClass: string;
  @Input() svgIcon: string;
  @Input() uuid: string;
  @Input() index:any;
  @Input() data:any;
  displayedColumns: string[] = ['checkbox', 'title', 'PART_NUMBER', 'PART_DESCRIPTION', 'main_Issue', 'qty'];
  datasource: any = [];
  options: any = [];
  @Input() targetData: any;
  @Input() inputStyles: string;
  @Input() name: string;
  @Input() group: FormGroup;
  @Input() labelClass: string;
  @Input() formGroupClass: string;
  @Input() formGroupStyles: string;
  @Input() defaultValue: any;
  @Input() overallData: any;

  ngOnInit(): void {
    this.options = [{
      "code": "Yes",
      "displayValue": "Yes"
    }, {
      "code": "No",
      "displayValue": "No"
    }];
    if(this.overallData.startsWith('#')){
      this.overallData = this.contextService.getDataByString(this.overallData);
    }
    this.group = new FormGroup({});
    this.targetData["qty"]=1;
    this.datasource = this.targetData.data;
    this.datasource && this.datasource.map((x, index) => {
      x["name"] = this.uuid + this.name + index;
      x["primaryFaultStatus"] = false;
      this.group.addControl(x.name, new FormControl("No"));
    });
    let primayFault = this.contextService.getDataByString("#isPrimaryFaultExists");
    if(!!primayFault && primayFault){
      this.isPrimaryFaultDisabled = true;
    }
    this.targetData.title=this.toCamelCase(this.targetData.title);
    // this.selection.select(...this.datasource);
  }

  toCamelCase(title) {
    let lengthArr = title.split(" ");
    let e = "";
    lengthArr && lengthArr.map((x) => {
      e = e + x.substring(0, 1).toUpperCase() + x.substring(1) + " ";
    })
    return e;
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.length;
    return numSelected === numRows;
  }

  /**selected dropdown value */
  getValue(e: any, i: any) {
    // this.collectDataSource.data[i].ffValue = e.target.value;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.datasource);
  }

  /** table checkBox selected */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    this.contextService.addToContext('AcceptedPredictionTaskPanels' + this.index, this.selection.selected);
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${'nakjfdnsakdf'}`;
  }

  openedChangedHandler(event) {}

  changeDropdown(event: any, item) {
    !!this.overallData && this.overallData.map((x, index) => {
      let compRef = this.contextService.getDataByKey("addpredictionPopupTableUUID" + index + 'ref');
      let currentSelectedValue = "";
      if (compRef?.instance?.group?.controls) {
        let controls = compRef?.instance?.group?.controls;
        Object.keys(controls).map((key) => {
          if (item.name === key) {
            currentSelectedValue = controls[key].value;
          }
          controls[key].setValue('No');
        })
        if(currentSelectedValue !== ""){
          controls[item.name].setValue(currentSelectedValue);
        }
        compRef.instance.datasource && compRef.instance.datasource.map((eachItem) => {
          eachItem.primaryFaultStatus = false;
          if (eachItem.name === item.name && currentSelectedValue === "Yes") {
            eachItem.primaryFaultStatus = true;
          }
          this.contextService.addToContext("isPrimaryFaultExists", currentSelectedValue === "Yes" ? true : false);
        })
      }
    })
    this.eventMap.forEach((ele) => {
      if (ele === event.type) {
        this.eventprocessor.handleEvent(this, event);
      }
    });
  }
}
