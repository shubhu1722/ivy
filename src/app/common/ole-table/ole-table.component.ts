import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { ActionService } from '../../services/action/action.service';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { OleMyUnitServiceService } from '../../services/commonServices/oleMyUnitService/ole-my-unit-service.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-ole-table',
  templateUrl: './ole-table.component.html',
  styleUrls: ['./ole-table.component.scss']
})
export class OleTableComponent implements OnInit {
  @Input() afterAction: any;
  dataSource: any;

  constructor(private actionService: ActionService, private contextService: ContextService,
    private oleMyUnitService: OleMyUnitServiceService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getMyunitData();
    this.oleMyUnitService.activeUnitTableDataUpdate.subscribe((data: any) => {
      this.updateMyunitData();
    });
  }

  displayedColumns: string[] = ['select', 'serialNo', 'bcn', 'partNo', 'workCenterName'];
  selection = new SelectionModel<PeriodicElement>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    let numSelected;
    let rowSelected;
    if (this.selection.selected != undefined && this.selection.selected.length > 0) {
      numSelected = this.selection.selected.length;
      let lableText = numSelected + " items are moved on hold successfully";
      this.contextService.addToContext("holdPopupText", lableText);
      //Adding selected table row in Context
      rowSelected = this.selection.selected;
      this.contextService.addToContext("rowSelectedData", rowSelected);
    }

    if (this.dataSource && this.dataSource != undefined) {
      const numRows = this.dataSource.length;

      if (numSelected && numSelected != undefined && numSelected > 0) {
        let holdTypeValue = {
          "type": "updateComponent",
          "config": {
            "key": "holdTypeUnitUUID",
            "properties": {
              "disabled": false
            }
          },
          "eventSource": "click"
        }
        this.actionService.handleAction(holdTypeValue, this);
  
        let unitTypeValue = {
          "type": "updateComponent",
          "config": {
            "key": "unitsonHoldReleaseUUID",
            "properties": {
              "disabled": false
            }
          },
          "eventSource": "click"
        }
        this.actionService.handleAction(unitTypeValue, this);
      } else {
        let holdTypeVale = [
          {
            "type": "disableComponent",
            "config": {
              "key": "holdTypeUnitUUID",
              "property": "holdtypeunit"
            }
          },
          {
            "type": "updateComponent",
            "config": {
              "key": "holdCompleteUUID",
              "properties": {
                "disabled": true
              }
            },
            "eventSource": "click"
          }
        ]
        holdTypeVale && holdTypeVale.forEach(element => {
          this.actionService.handleAction(element, this);
        });
        let unitTypeValue = {
          "type": "updateComponent",
          "config": {
            "key": "unitsonHoldReleaseUUID",
            "properties": {
              "disabled": true
            }
          },
          "eventSource": "click"
        }
        this.actionService.handleAction(unitTypeValue, this);
      }
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  getMyunitData() {
    let unitData = this.contextService.getDataByString("#getMyUnitsData");
    this.dataSource = unitData;
    let unitLength = this.dataSource.length;
    let titleText = "Active Units: " + unitLength + " pcs";
    this.contextService.addToContext("activeUnitText", titleText);
    if (this.afterAction && this.afterAction.length > 0) {
      let actions = this.afterAction;
      actions && actions.forEach(element => {
        this.actionService.handleAction(element, this);
      });
    }
  }

  updateMyunitData() {
    this.selection = new SelectionModel<PeriodicElement>(true, []);
    this.dataSource = this.contextService.getDataByString("#getMyUnitsData");
    let unitLength = this.dataSource.length;
    let titleText = "Active Units: " + unitLength + " pcs";
    this.contextService.addToContext("activeUnitText", titleText);

    this.ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 500);
  }
}
