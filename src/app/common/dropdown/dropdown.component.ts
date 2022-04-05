import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ChangeDetectorRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { ActionService } from 'src/app/services/action/action.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DropdownComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() options: any[];
  @Input() inputStyles: string;
  @Input() name: string;
  @Input() dataSource: any;
  @Input() displayValue: string;
  @Input() defaultValue: string;
  @Input() code: string;
  @Input() label: string;
  @Input() group: FormGroup;
  @Input() hooks: any[];
  @Input() labelClass: string;
  @Input() formGroupClass: string;
  @Input() formGroupStyles: string;
  @Input() hidden: boolean;
  @Input() defaultFilterValue: string;
  @Input() defaultFilterKey: string;
  @Input() required: boolean;
  @Input() actions: any[] = [];
  @Input() selectDisabled : boolean;
  @Input() disabled: boolean;
  @Input() visibility: boolean;
  @Input() hideDisabledSelect: boolean;
  @Input() setDisabled: any;
  @Input() enableWithValue: boolean = true;
  @Input() dropdownWithText: boolean;
  @Input() uuid: string;
  @Input() minLength: string;
  @Input() maxLength: string;
  @Input() visibilityMod: boolean;
  selectedDropdownName: string;
  dropDownOptions: any;
  removeSelect: boolean;
  splitArray: string[];
  contextKey: string;
  eventMap = ['change', 'openedChange', 'input'];
  hookMap = ['beforeInit', 'afterInit', 'beforeAction', 'afterAction'];
  flag : boolean;
  beforeInitHooks: any[];
  afterInitHooks: any[];
  beforeActionHooks: any[];
  afterActionHooks: any[];
  @Input() dropdownClass: string;
  isHoldDropdown: any;
  constructor(
    private contextService: ContextService,
    private _changeDetectionRef: ChangeDetectorRef,
    private actionService: ActionService,
    private utilityService: UtilityService,
    private hookService: HookService,
    private eventprocessor: EventServiceService,
    private translate: TranslateService
  ) {
    const language = localStorage.getItem('language');
    translate.setDefaultLang(language);
    translate.use(language);
  }
  

  ngOnInit(): void {
    if (this.maxLength == "none") {
      this.maxLength = "";
    } else if (this.maxLength && this.maxLength !== undefined) {
      this.maxLength;
    } else {
      // hard coding for cisco
      this.maxLength = "4"
    }
    this.visibility = this.visibility !== undefined ? this.visibility : true;
    this.visibilityMod = this.visibilityMod !== undefined ? this.visibilityMod : true;
    this.dropdownWithText = this.dropdownWithText !== undefined ? this.dropdownWithText : false;
    this.removeSelect = this.hideDisabledSelect;

    if (this.defaultValue && this.defaultValue.startsWith('#')) {
      let defaultResultVal = this.contextService.getDataByString(this.defaultValue);
      if (defaultResultVal) {
        if (this.options && this.options.length > 0) {
          this.options.forEach((optionVal) => {
            if (optionVal.isDefault === 'true' || optionVal.isDefault) {
              defaultResultVal = optionVal.code;
            }
          });
        }
      }

      this.defaultValue = defaultResultVal;
    }
    if (this.defaultFilterValue && this.defaultFilterValue.startsWith('#')) {
      this.defaultFilterValue = this.contextService.getDataByString(this.defaultFilterValue);
    }
    if (this.group === undefined) {
      this.group = new FormGroup({});
      if (this.defaultValue) {
        this.group.addControl(this.name, new FormControl(this.defaultValue));
      } else {
        this.group.addControl(this.name, new FormControl());
      }
    } else {
      if (this.defaultValue) {
        this.group.controls[this.name].setValue(this.defaultValue);
      }
    }
    if (this.disabled !== undefined && this.disabled !== null && this.disabled) {
      this.group.controls[this.name].disable();
    } else {
      this.disabled = false;
    }

    if (this.setDisabled) {
      const setDisabled = this.setDisabled;
      const data: any = this.actionService.getContextorNormalData(setDisabled.lhs, '');
      const isConditionValid = this.actionService.isConditionValid(
        { lhs: data, rhs: setDisabled.rhs, operation: setDisabled.operation },
        this
      );

      if (isConditionValid) {
        this.group.controls[this.name].disable();
      }
    }

    // TODO: Remove hard coded string 'userSelected'
    this.contextService.addToContext('userSelected' + this.name, this.group.controls[this.name].value);
    if (this.dataSource) {
      if (this.dataSource instanceof Array) {
        this.dataSource = this.dataSource.map((s) => ({
          code: s,
          displayValue: s,
        }));
        this.dataSource.sort((a, b) => a.displayValue.localeCompare(b.displayValue));
        this.options = this.dataSource;
      } else if (this.dataSource.startsWith('#')) {
        let responseArray = [];
        responseArray = this.contextService.getDataByString(this.dataSource);
        if (responseArray !== undefined && responseArray) {
          /// if there is a default filter value, use it to filter
          if (this.defaultFilterValue !== undefined) {
            responseArray = this.utilityService.getFilteredCodes(
              responseArray,
              this.defaultFilterKey,
              this.defaultFilterValue
            );
          }
          /// check if code and value are present
          if (this.code) {
            responseArray = responseArray.map((s) => ({
              code: s[this.code].trim(),
              displayValue: s[this.displayValue],
            }));
          } else {
            responseArray = responseArray.map((s) => ({
              code: s.trim(),
              displayValue: s,
            }));
          }
          responseArray = responseArray.filter((x) => x.displayValue !== undefined && x.displayValue);
          responseArray.sort((a, b) => a.displayValue.localeCompare(b.displayValue));
          this.options = responseArray;
        }
      } else {
        this.options = this.dataSource;
      }
    }

    if (this.hooks !== undefined) {
      this.beforeInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[0]);
      if (this.beforeInitHooks !== undefined && this.beforeInitHooks.length > 0) {
        this.hookService.handleHook(this.beforeInitHooks, this);
      }
    }

    if (this.selectDisabled == undefined && this.selectDisabled == null) {
      this.selectDisabled = true;
      this.flag = this.removeSelect;
    }
    else {
      this.flag = true
    }
  }

  changeDropdown(event: any) {
    this.selectedDropdownName = event.target.options[event.target.options.selectedIndex].text;
    this.eventMap.forEach((ele) => {
      if (ele === event.type) {
        this.eventprocessor.handleEvent(this, event);
      }
    });
  }

  openedChangedHandler(event) {}

  ngAfterViewInit() {
    // this.hookService.handleHook(this.afterInitHooks, this);
    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      const afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[1]);
      if (afterInitHooks !== undefined && afterInitHooks.length > 0) {
        this.hookService.handleHook(afterInitHooks, this);
      }
    }
    if (this.isHoldDropdown) {
      let disableCurrentTextFieldAction = {
        type: 'resetData',
        config: {
          key: this.uuid,
        }
      };
      this.actionService.handleAction(disableCurrentTextFieldAction, this);
    }

    //TODO: Patch Code to solve 88750 , Actually after default value got set the change event 
    //is not getting triggered, so Actions related to the change event of that drop down are 
    //not executing. If we change the drop-down manually then working fine.
    //Issue is only if we do with default value.
    //After investigating this code needs to remove
    // if (this.defaultValue) {
    //   this.actions.forEach((actionItem) => {
    //     if(actionItem && actionItem.type && actionItem.eventSource == "change"){
    //       if(actionItem.type == "context" || actionItem.type == "condition"){
    //         this.actionService.handleAction(actionItem, this);
    //       }
    //     }
    //   });
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.disabled && changes.disabled.currentValue !== changes.disabled.previousValue) {
      const method = changes.disabled.currentValue ? 'disable' : 'enable';
      this.group?.controls[this.name]?.[method]();
    }
    if (changes.defaultValue && changes.defaultValue.currentValue !== changes.defaultValue.previousValue) {
      this.group.controls[this.name].setValue(changes.defaultValue.currentValue);
    }
  }

  changeText(event: any) {
    this.selectedDropdownName = event.target.value;
    this.eventMap.forEach((ele) => {
      if (ele === event.type) {
        this.eventprocessor.handleEvent(this, event);
      }
    });
  }
}
