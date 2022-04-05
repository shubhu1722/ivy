import { Component, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef, ComponentRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Subject, Subscription } from 'rxjs';
import { take, takeUntil, delay, distinctUntilChanged, map } from 'rxjs/operators';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActionService } from 'src/app/services/action/action.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { TransactionService } from 'src/app/services/commonServices/transaction/transaction.service';
import { contextKeysEnum, DellMBRFlexFields, errorTitleAction } from '../../../utilities/constants';
import { defaultHeaderConfig, completedHeaderConfig } from './msgReadActions';

interface PanelHeader {
  title: string;
  svgIcon: string;
  icon?: string;
  statusIcon: string;
  iconClass?: string;
  statusClass: string;
  class: string;
}

interface FlexFieldValue {
  value: string;
}

@Component({
  selector: 'app-dell-wc-operations-message-read-panel',
  templateUrl: './dell-wc-operations-message-read-panel.component.html',
  styleUrls: ['./dell-wc-operations-message-read-panel.component.scss'],
})
export class DellWcOperationsMessageReadPanelComponent implements AfterViewInit, OnDestroy {
  @ViewChild('matPanel') matPanel: MatExpansionPanel;
  public form: FormGroup;
  public header: PanelHeader = { ...defaultHeaderConfig };
  public moreInfoMessage: string;
  public completeBtnDisabled = false;
  public panelUUID = 'repairInformationUUID';
  public controlUUID = 'repairInformationMessageReadCheckboxUUID';
  public btnUUID = 'repairInformationCompleteButtonUUID';
  private flexFieldName = DellMBRFlexFields.msgRead;
  private flexFieldValue: string;
  private currentScreenDataKey = contextKeysEnum.currentScreenData;
  private currentUIDataKey = contextKeysEnum.currentUIState;
  private panelSubscription: Subscription;
  private formSubscription: Subscription;
  private taskPanelsSubscription: Subscription;
  private taskPanels: ComponentRef<any>[] = [];
  private savedData$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private actionService: ActionService,
    private contextService: ContextService,
    private transactionService: TransactionService,
    private _changeDetectionRef: ChangeDetectorRef
  ) {}

  get screenData(): Record<string, any> {
    return this.contextService.getDataByKey(this.currentScreenDataKey) ?? {};
  }

  get fC(): FormControl {
    return this.form?.controls?.[this.controlUUID] as FormControl;
  }

  ngAfterViewInit(): void {
    const flexField = this.contextService
      .getDataByKey(contextKeysEnum.getFFByWc)
      ?.find((ff) => ff?.ffName === this.flexFieldName);

    if (!flexField) {
      console.error('Please provide proper flex field name!');
    } else {
      const workCenterName = this.contextService.getDataByKey(contextKeysEnum.currentWC);
      const screenData: Record<string, any> = this.contextService.getDataByKey(workCenterName) || {};
      screenData.forEach((item) => {
        if (item?.instance?.ctype === 'taskPanel') {
          this.taskPanels.push(item);
        }
      });
      this.panelSubscription = this.matPanel.expandedChange.subscribe((panelState) => {
        if (panelState) {
          this.taskPanels.forEach((panel) => {
            panel.instance.matPanel?.close();
            panel.instance.expanded = false;
          });
        }
        this.setUIContextKeys(this.panelUUID, { expanded: panelState, header: this.header });
      });
      this.moreInfoMessage = this.contextService.getDataByString('#specialMessageData.moreInfo') ?? 'No content';
      this.contextService.contextObservable
        .pipe(
          delay(300),
          map((ctx: Map<string, any>) => ctx.get(workCenterName)?.get(this.currentUIDataKey)),
          distinctUntilChanged(),
          takeUntil(this.savedData$)
        )
        .subscribe((data: Record<string, any> | undefined) => {
          if (data) {
            if (!this.form) {
              this.setInitialValues(data);
              this.createPanelsSubscription();
            }
            this.savedData$.next(true);
            this.savedData$.unsubscribe();
          }
        });

      const { username: userName } = this.contextService.getDataByKey(contextKeysEnum.loginUUID);
      this.transactionService
        .get('getFFValue', {
          ffId: flexField.ffId,
          userName,
        })
        .pipe(
          take(1),
          map((res) => res.data as FlexFieldValue[])
        )
        .subscribe(
          (data) => {
            this.flexFieldValue = data.find((i) => i.value === flexField.ffValue)?.value || data?.[0].value;
          },
          (e) => this.handleError(e?.message || e)
        );
    }
  }

  ngOnDestroy(): void {
    this.panelSubscription?.unsubscribe();
    this.formSubscription?.unsubscribe();
    this.taskPanelsSubscription?.unsubscribe();
  }

  createPanelsSubscription() {
    const observables = this.taskPanels.map((panel) => panel?.instance?.matPanel?.expandedChange);
    this.taskPanelsSubscription = merge(...observables).subscribe((expanded: boolean) => {
      if (this.matPanel?.expanded && expanded) {
        this.matPanel?.close();
      }
    });
  }

  setInitialValues(data) {
    // Init header state
    this.header = data[this.panelUUID]?.header ? data[this.panelUUID]?.header : { ...defaultHeaderConfig };
    if (data[this.panelUUID]?.expanded) {
      this.matPanel?.open();
    }
    if (!data[this.panelUUID]) {
      this.setUIContextKeys(this.panelUUID, { expanded: this.matPanel?.expanded, header: this.header });
    }
    // Init checkbox and button state
    this.initFormAndButton(data[this.controlUUID]);
  }

  resetPanelState() {
    this.deleteScreenContextKey();
    this.header = { ...defaultHeaderConfig };
    this.setUIContextKeys(this.panelUUID, { expanded: this.matPanel?.expanded, header: this.header });
  }

  evaluateButtonState(checkboxValue) {
    const flexField = this.screenData?.[this.flexFieldName];
    const messageWasRead = flexField ? flexField === this.flexFieldValue : false;
    if (checkboxValue) {
      this.completeBtnDisabled = messageWasRead;
    } else if (!checkboxValue) {
      this.completeBtnDisabled = true;
      this.resetPanelState();
    }
  }

  initFormAndButton(controlValue) {
    const value =
      typeof controlValue === 'object' && controlValue.hasOwnProperty('checked')
        ? controlValue.checked
        : Boolean(controlValue);
    // Init form and watch for checkbox changes
    this.form = new FormGroup({
      [this.controlUUID]: new FormControl(value, Validators.required),
    });
    this.formSubscription = this.form.valueChanges
      .pipe(map((f) => f?.[this.controlUUID]))
      .subscribe((checkboxValue) => {
        this.evaluateButtonState(checkboxValue);
        this.setUIContextKeys(this.btnUUID, { disabled: this.completeBtnDisabled });
        this.setUIContextKeys(this.controlUUID, { checked: checkboxValue });
        this._changeDetectionRef.detectChanges();
      });
  }

  handleMessageReadComplete = (ev: Event) => {
    ev?.stopPropagation();
    const formValue = this.fC.value;
    if (formValue) {
      this.completeBtnDisabled = formValue;
      this.setScreenContextKey(this.flexFieldName, this.flexFieldValue);
      this.setUIContextKeys(this.btnUUID, { disabled: this.completeBtnDisabled });
      this.header = { ...completedHeaderConfig };
      this.setUIContextKeys(this.panelUUID, { expanded: this.matPanel?.expanded, header: this.header });
      this.matPanel.close();
    }
  }

  handleError(error) {
    if (typeof error === 'string') {
      this.actionService.handleAction(errorTitleAction(error), this.actionService);
    }
  }

  setScreenContextKey(nestedKey, value) {
    this.contextService.addToContext(this.currentScreenDataKey, {
      nestedKey,
      value,
    });
  }

  setUIContextKeys(nestedKey, value) {
    this.contextService.addToContext(this.currentUIDataKey, {
      nestedKey,
      value,
    });
  }

  deleteScreenContextKey() {
    this.contextService.deleteNestedScreenData(this.currentScreenDataKey, this.flexFieldName);
  }
}
