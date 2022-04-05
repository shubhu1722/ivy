import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionService } from '../../../services/action/action.service';
import { ContextService } from '../../../services/commonServices/contextService/context.service';
import { EventServiceService } from '../../../services/commonServices/eventService/event-service.service';
import { HookService } from '../../../services/commonServices/hook-service/hook.service';
import { DellPredictiveService } from '../../../services/dell/dellPredictive/dell-predictive.service';
import { UtilityService } from '../../../utilities/utility.service';

@Component({
  selector: 'app-dell-packout-issue-box',
  templateUrl: './dell-packout-issue-box.component.html',
  styleUrls: ['./dell-packout-issue-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DellPackoutIssueBoxComponent implements OnInit {
  @Input() uuid: any;
  @Input() group: FormGroup;
  @Input() parentUuid: any;
  @Input() completeBtnUuid: any;

  /// Box Condition
  boxConditionLabel = "Box Condition";
  boxConditionOptions = [];
  boxCondName = "dellPackoutBoxCondition";

  /// Box part number
  boxPartNumOptions: any = ["0GD6R"];
  boxPartNumLabel = "Box Part Number";
  boxPartNumName = "dellPackoutBoxPartNumber";
  disablePart: boolean = true;

  /// Error message
  error: any = "";
  showError: boolean = false;

  @ViewChild('dellPackoutBoxConditionRef', { static: true, read: ElementRef }) dellPackoutBoxConditionRef: ElementRef;
  @ViewChild('dellPackoutBoxPartNumberRef', { static: true, read: ElementRef }) dellPackoutBoxPartNumberRef: ElementRef;
  constructor(
    private eventProcessor: EventServiceService,
    private contextService: ContextService,
    private hookService: HookService,
    private oElementRef: ElementRef,
    private utilityService: UtilityService,
    private actionService: ActionService,
    private _changeDetectionRef: ChangeDetectorRef,
    private dellPredictiveService: DellPredictiveService) { }

  ngOnInit(): void {
    let parentRef = this.contextService.getDataByKey(this.parentUuid);
    let dellPackoutBoxCondValue = this.contextService.getDataByKey("dellPackoutBoxCondValue");
    let dellPackoutBoxPartNumValue = this.contextService.getDataByKey("dellPackoutBoxPartNumValue");
    let dellPackoutBoxCondOptions = this.contextService.getDataByKey("dellPackoutBoxCondOptions");
    let dellPackoutBoxPartNumOptions = this.contextService.getDataByKey("dellPackoutBoxPartNumOptions");
    if (!!parentRef && parentRef.instance?.group) {
      this.group = parentRef.instance.group;
    }
    if (this.group === undefined) {
      this.group = new FormGroup({});
    }

    this.group.addControl("dellPackoutBoxCondition", new FormControl(!!dellPackoutBoxCondValue ? dellPackoutBoxCondValue : null, [Validators.required]));
    this.group.addControl("dellPackoutBoxPartNumber", new FormControl(!!dellPackoutBoxPartNumValue ? dellPackoutBoxPartNumValue : null, [Validators.required]));
    this.boxConditionOptions = !!dellPackoutBoxCondOptions ? dellPackoutBoxCondOptions : [];
    this.boxPartNumOptions = !!dellPackoutBoxPartNumOptions ? dellPackoutBoxPartNumOptions : ["0GD6R"];
    if (!!dellPackoutBoxCondValue && dellPackoutBoxCondValue != "") {
      this.group.controls["dellPackoutBoxPartNumber"].enable();
    } else {
      this.group.controls["dellPackoutBoxPartNumber"].disable();
    }
    this.handleStateOfCompleteBtn();
  }

  /// Box Condition
  async onBoxCondChange(event) {
    this.group.controls["dellPackoutBoxPartNumber"].enable();
    this.group.controls['dellPackoutBoxPartNumber'].reset();
    this.boxPartNumOptions = ["0GD6R"];
    this.contextService.addToContext("dellPackoutBoxCondValue", event.target.value);
    await this.utilityService._getPackagingPartNum({
      "config": {
        "uuid": this.uuid
      }
    }, this.actionService);
    this.contextService.addToContext("dellPackoutBoxPartNumOptions", this.boxPartNumOptions);
    this.utilityService.handleErrorMessage("", this.actionService);
  }

  onBoxCondOpenedChange($event) {
  }

  /// Box Part number
  onBoxPartNumChanged(event) {
    this.handleStateOfCompleteBtn(true);
    this.contextService.addToContext("dellPackoutBoxPartNumValue", event.target.value);
    this.utilityService.handleErrorMessage("", this.actionService);
    this._getConditionIdFromConditionName(event.target.value);
    //this._getQtyOfSelectedPart(event.target.value);
  }

  onBoxPartNumChange($event) {
  }

  ngAfterViewInit() {
    let topLeftHeaderData = this.contextService.getDataByKey('topLeftHeaderData');
    let discrepancyUnitInfo = this.contextService.getDataByString("#discrepancyUnitInfo");
    let dpsArr = [];
    if (!!discrepancyUnitInfo && discrepancyUnitInfo.GEONAME.toLowerCase() === "louisville") {
      dpsArr = ["PAD", "PDC", "CCT", "RTS"];
    } else {
      dpsArr = ["CRP", "CRC"];
    }
    topLeftHeaderData && topLeftHeaderData.map((x) => {
      if (x.ffName.toLowerCase() === "dps type" && dpsArr.includes(x.ffValue)) {
        this.showError = true;
        this.error = "Use White Box";
      }
    });

  }


  handleStateOfCompleteBtn(disable?: any) {
    let completeBtnRef = this.contextService.getDataByKey(this.completeBtnUuid + 'ref');
    if (!!completeBtnRef && completeBtnRef.instance?.group) {
      let controls = completeBtnRef.instance.group.controls;
      let flag = !!disable ? disable : false;
      if (!flag) {
        Object.keys(controls).map((x) => {
          if (x === "dellPackoutBoxCondition" || x === "dellPackoutBoxPartNumber") {
            if (controls[x].value === null || controls[x].value === "") {
              flag = true;
            }
          }
        })
      }
      completeBtnRef.instance.disabled = flag;
      completeBtnRef.instance._changeDetectionRef.detectChanges();
    }
  }

  /// This is the API call to get condition id based on Box Condition
  private async _getConditionIdFromConditionName(partValue) {
    let body = {
      "conditionName": "#dellPackoutBoxCondValue",
      "userName": "#userAccountInfo.PersonalDetails.USERID"
    };
    let res = await this.utilityService.getApiCallUsingPromise(body, "getConditionId");
    if (res && res['status']) {
      let data = res['data'];
      await this._getQtyOfSelectedPart(partValue,data);
    } else {
      this.utilityService.handleErrorMessage(res['message'], this.actionService, true);
    }
  }

  /// This method is to get the part details based on selected part
  private async _getQtyOfSelectedPart(value: any,conditionID : any) {
    let body = {
      "partNo": value,
      "locationId": "#userSelectedLocation",
      "clientId": "#userSelectedClient",
      "contractId": "#userSelectedContract",
      "conditionId": conditionID,
      "warehouseId": "#discrepancyUnitInfo.WAREHOUSE_ID",
      "ownerId": "#discrepancyUnitInfo.OWNER_ID",
      "userName": "#loginUUID.username"
    };
    let res = await this.utilityService.getApiCallUsingPromise(body, "getAvailablePartQuantity");
    if (res && res['status']) {
      let data = res['data'];
      if (!!data?.sumQuantity && data?.sumQuantity <= 0) {
        this.utilityService.handleErrorMessage("Not enough Quantity for Box in Source Bin", this.actionService, true);
      } else {
        this.handleStateOfCompleteBtn(false);
        this.utilityService.handleErrorMessage("", this.actionService);
      }
    } else {
      this.utilityService.handleErrorMessage(res['message'], this.actionService, true);
    }
  }

}
