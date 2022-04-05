import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { data } from '../../../data';
import { ActionService } from '../../../services/action/action.service';
import { ContextService } from '../../../services/commonServices/contextService/context.service';
import { DellCarDebugService } from '../../../services/dellCar/dellCarDebug/dell-car-debug.service';
import { UtilityService } from '../../../utilities/utility.service';
import { PrimaryFaultService } from "../../../services/commonServices/primaryFault-table-service/primary-fault-service.service"

export interface PeriodicElement {
  defect: string;
  commodity: any;
  partNumber: any;
}

/**
 * @title Table with selection
 */
@Component({
  selector: 'app-primary-fault-table-with-check-box',
  templateUrl: './primary-fault-table-with-check-box.component.html',
  styleUrls: ['./primary-fault-table-with-check-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PrimaryFaultTableWithCheckBoxComponent implements OnInit {
  selected = -1;
  index;
  @Input() checked: boolean = false;
  @Input() datasource: any;
  @Input() uuid: any;

  displayedColumns: string[] = ['select', 'defect', 'commodity', 'partNumber'];
  // datasource = new MatTabledatasource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  matTabledatasource = new MatTableDataSource<any>();

  constructor(private action: ActionService,
    private utilityService: UtilityService,
    private contextService: ContextService,
    private actionService: ActionService,
    private ref: ChangeDetectorRef,
    private _changeDetectionRef: ChangeDetectorRef,
    private primaryFaultService: PrimaryFaultService
  ) { }


  ngOnInit(): void {
    this.dellCarDebugService();
    this.primaryFaultService.activeUnitTableDataUpdate.subscribe((data: any) => {
      this.updatedellCarDebugservice();
    });
    this._changeDetectionRef.detectChanges();
    this.datasource && this.datasource.map((item) => {
      if (item.glownaUsterka?.toLowerCase() == "yes") {
        item["primaryFault"] = true;
        this.index = this.datasource.indexOf(item);
        this.contextService.addToContext("existingFA", item)
      }
      else {
        item["primaryFault"] = false;
      }
    })
  }
  selectionRow(row: any, check: any) {
    // this.datasource = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");
    this.datasource && this.datasource.map((item) => {
    item.primaryFault = false;
    })
    this.selection.selected.forEach(row => this.selection.toggle(row))
    let dellCarPrimaryButtonAction;
    if (check.checked) {
     this.selection.toggle(row);
      dellCarPrimaryButtonAction = {
        "type": "updateComponent",
        "config": {
          "key": "dellCarPrimaryFaultCompleteUUID",
          "properties": {
            "disabled": false
          }
        }
      };
    }
    else {
      dellCarPrimaryButtonAction = {
        "type": "updateComponent",
        "config": {
          "key": "dellCarPrimaryFaultCompleteUUID",
          "properties": {
            "disabled": true
          }
        }
      }
    }
    // this.checked=true;
    if (row.primaryFault === false) {
      row.primaryFault = true;
    }

    this.actionService.handleAction(dellCarPrimaryButtonAction, this);
    this.contextService.addToContext("currentPrimaryDetails", row);
  }
  dellCarDebugService() {
    let unitData = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");
    this.datasource = unitData;
    this.datasource && this.datasource.map((item) => {
      if (item.glownaUsterka?.toLowerCase() == "yes") {
        item["primaryFault"] = true;
      }
      else {
        item["primaryFault"] = false;
      }
    })
  }
  updatedellCarDebugservice() {
    this.selection = new SelectionModel<PeriodicElement>(true, []);
    this.datasource = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");
    if (Array.isArray(this.datasource)) {
      this.datasource && this.datasource.map((item) => {
        if (item.glownaUsterka && item.glownaUsterka.toLowerCase() == "yes") {
          item["primaryFault"] = true;
        }
        else {
          item["primaryFault"] = false;
        }
      })
    }
    else {
      this.datasource = []
    }
    this.ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 500);
  }
}