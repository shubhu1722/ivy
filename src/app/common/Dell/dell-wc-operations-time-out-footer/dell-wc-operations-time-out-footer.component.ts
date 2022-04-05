import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { delay, distinctUntilChanged, map } from 'rxjs/operators';
import { ActionService } from 'src/app/services/action/action.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { TransactionService } from 'src/app/services/commonServices/transaction/transaction.service';
import { DialogboxComponent } from '../../dialogbox/dialogbox.component';
import {
  contextKeysEnum,
  holdCodesEnum,
  dialogResultsEnum,
  RETURN_TO_HOME_ACTIONS,
  errorTitleAction,
} from '../../../utilities/constants';
import { addNoteActionsPopupConfig, openHoldPopupConfig } from './timeOutActions';

interface FlexField {
  name: string;
  value: string;
}

interface Response {
  data: any;
  status: boolean;
  message: string | null;
}

@Component({
  selector: 'app-dell-wc-operations-time-out-footer',
  templateUrl: './dell-wc-operations-time-out-footer.component.html',
  styleUrls: ['./dell-wc-operations-time-out-footer.component.scss'],
})
export class DellWcOperationsTimeOutFooterComponent implements OnInit, OnDestroy {
  @Input() optionsContextKey = '#resultCodesForDiscrepancy';
  public dropdownDisabled = true;
  public dropdownDefaultValue!: string;
  private currentScreenDataKey = contextKeysEnum.currentScreenData;
  private timeoutNotesDataKey = contextKeysEnum.mbrTimeoutNotes;
  private timeoutResultCodeDataKey = contextKeysEnum.timeoutResultCode;
  private workCenterName!: string;
  private operationResultCode!: string;
  private flexFieldKeys!: string[];
  private subscription: Subscription;

  constructor(
    private actionService: ActionService,
    private contextService: ContextService,
    private transactionService: TransactionService,
    public dialog: MatDialog
  ) {}

  get timeoutDisabled() {
    return !(this.operationResultCode && !this.dropdownDisabled);
  }

  get screenData() {
    return this.contextService.getDataByKey(this.currentScreenDataKey) ?? {};
  }

  ngOnInit(): void {
    this.flexFieldKeys = this.contextService.getDataByKey(contextKeysEnum.getFFByWc)?.map((ff) => ff.ffName);
    this.workCenterName = this.contextService.getDataByKey(contextKeysEnum.currentWC);
    // We need to have a delay here since we need to wait till context service finishes pending operations
    this.subscription = this.contextService.contextObservable
      .pipe(
        delay(400),
        map((ctx: Map<string, any>) => ctx.get(this.workCenterName)?.get(this.currentScreenDataKey)),
        distinctUntilChanged()
      )
      .subscribe((data: Record<string, any> | undefined) => {
        if (data) {
          let count = 0;
          if (data[this.timeoutResultCodeDataKey]) {
            // Handle dropdown initial value
            if (!this.operationResultCode) {
              this.dropdownDefaultValue = data[this.timeoutResultCodeDataKey] || '-';
            }
            this.operationResultCode = data[this.timeoutResultCodeDataKey];
          }
          this.flexFieldKeys.forEach((ff) => data[ff] && count++);
          // If we have all flex fields keys inside context - enable dropdown
          this.dropdownDisabled = !(count === this.flexFieldKeys?.length);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      this.contextService.addToContext(this.currentScreenDataKey, {
        nestedKey: this.timeoutResultCodeDataKey,
        value: select.value,
      });
    }
  }

  handleError(error) {
    if (typeof error === 'string') {
      this.actionService.handleAction(errorTitleAction(error), this.actionService);
    }
  }

  handleNotePopup(callback = null) {
    const noteValue = this.screenData?.[this.timeoutNotesDataKey];
    const dialogRef = this.dialog.open(DialogboxComponent, {
      data: addNoteActionsPopupConfig(noteValue),
    });
    dialogRef.beforeClosed().subscribe((result) => {
      const data = dialogRef?.componentInstance?.data;
      if (result === dialogResultsEnum.success && data?.group?.value) {
        // Save Note value to context
        this.contextService.addToContext(this.currentScreenDataKey, {
          nestedKey: this.timeoutNotesDataKey,
          value: data.group.value.addNote,
        });
        if (callback) {
          callback();
        }
      }
    });
  }

  performHold = () => {
    this.contextService.addToContext(holdCodesEnum.holdSubCodeData, '');
    this.contextService.addToContext(holdCodesEnum.holdBin, '');
    this.actionService.handleAction(openHoldPopupConfig, this.actionService);
  }

  parseFFValue(value) {
    // Handle previously saved objects (.eg dropdown values)
    if (typeof value === 'object') {
      return value.value;
    }
    return value;
  }

  performTimeOut = async () => {
    const noteValue = this.screenData?.[this.timeoutNotesDataKey];
    if (!noteValue) {
      this.handleNotePopup(this.performTimeOut);
    } else {
      const flexField: FlexField[] = this.flexFieldKeys.map((ff) => ({
        name: ff,
        value: this.parseFFValue(this.screenData[ff]),
      }));
      try {
        const {
          LOCATION_ID,
          CLIENT_ID,
          CLIENTNAME,
          CONTRACT_ID,
          CONTRACTNAME,
          ITEM_BCN,
          SERIAL_NO,
          FAT,
          PART_NO,
          ROUTE,
          WORKCENTER,
          WORKCENTER_ID,
          GEONAME,
        } = this.contextService.getDataByKey(contextKeysEnum.repairUnitInfo);
        const {
          PersonalDetails: { USERID },
        } = this.contextService.getDataByKey(contextKeysEnum.userAccountInfo);
        const { username, password } = this.contextService.getDataByKey(contextKeysEnum.loginUUID);
        // Check if we can perform timeout
        const stopShipResponse = await this.transactionService
          .get('getStopShipProcess', {
            locationId: LOCATION_ID,
            clientId: CLIENT_ID,
            contract: CONTRACT_ID,
            bcn: ITEM_BCN,
            serial: SERIAL_NO,
            fat: FAT,
            partNo: PART_NO,
            opt: ROUTE,
            wcid: WORKCENTER_ID,
            userName: USERID,
          })
          .toPromise();
        if (!stopShipResponse?.status) {
          throw new Error(stopShipResponse);
        }
        const timeOutResponse = await this.transactionService
          .post('performTimeOut', {
            timeOutRequest: {
              location: GEONAME,
              bcn: ITEM_BCN,
              workCenter: WORKCENTER,
              password,
              warrantyInd: 'false',
              notes: noteValue,
              resultCode: this.operationResultCode,
              workCenterFlexFieldList: {
                flexField,
              },
            },
            modifyWarranty: 0,
            timeOutType: 'ProcessImmediate',
            clientName: CLIENTNAME,
            contractName: CONTRACTNAME,
            userName: username,
            userPass: password,
            ip: '::1',
            callSource: 'FrontEnd',
            apiUsage_LocationName: GEONAME,
            apiUsage_ClientName: CLIENTNAME,
          })
          .pipe(map((res) => res.body as Response))
          .toPromise();
        if (!timeOutResponse?.status) {
          throw new Error(timeOutResponse.message);
        }
        return this.goToInitialScreen(true);
      } catch (e) {
        console.error(e);
        this.handleError(e?.message);
      }
    }
  }

  goToInitialScreen = (ev: Event | boolean) => {
    const actions: any = RETURN_TO_HOME_ACTIONS(this.workCenterName);
    if (ev instanceof Event) {
      // If You need to force data reset on `Save & Exit` button click - comment it out
      actions.shift();
    }
    actions.forEach((action) => this.actionService.handleAction(action, this.actionService));
  }
}
