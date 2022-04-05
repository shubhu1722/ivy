import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { UtilityService } from '../../utilities/utility.service';
import { EventServiceService } from '../../services/commonServices/eventService/event-service.service';
import { HookService } from '../../services/commonServices/hook-service/hook.service';

@Component({
  selector: 'app-multi-select-dropdown-with-chips',
  templateUrl: './multi-select-dropdown-with-chips.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class MultiSelectDropdownWithChipsComponent implements OnInit {

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
  @Input() disabled: boolean;
  @Input() dropdownClass: string;
  afterInitHooks: any[];
  selectedDropdownName: string;
  dropDownOptions: any;
  dropdownSettings = {};
  eventMap = ['change', 'openedChange', 'input','click'];
  hookMap = ['beforeInit', 'afterInit', 'beforeAction', 'afterAction'];
  constructor(private contextService: ContextService, private eventprocessor: EventServiceService,
              private utilityService: UtilityService,private hookService: HookService,private _changeDetectionRef: ChangeDetectorRef) { }
   ngOnInit() {

    this.dropdownSettings = {
      singleSelection: false,
      idField: this.code,
      textField: this.displayValue,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      allowSearchFilter: true
    };
    this.options = this.contextService.getDataByString(this.dataSource);

    if (this.group === undefined) {
      this.group = new FormGroup({});
      if (this.defaultValue && this.defaultValue !== undefined) {
        this.group.addControl(this.name, new FormControl(this.defaultValue));
      } else {
        this.group.addControl(this.name, new FormControl());
      }
    } else {
      if (this.defaultValue && this.defaultValue !== undefined && this.defaultValue != '') {
        this.defaultValue = this.defaultValue.startsWith('#')? this.contextService.getDataByString(this.defaultValue):this.defaultValue;
        if(this.defaultValue && this.defaultValue != ''){
          this.group.controls[this.name].setValue(this.defaultValue);
        }
      }
    }

    if (this.required !== undefined && this.required){
      this.group.controls[this.name].setValidators(Validators.required);
    }
    if (this.disabled !== undefined && this.disabled) {
      this.group.controls[this.name].disable();
    }
  }

  ngAfterViewInit() {
    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      this.afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[1]);
      this.hookService.handleHook(this.afterInitHooks, this);
    }
  }

  onItemSelect(item: any) {
    const eventType = { type: 'change' };
    this.eventMap.forEach((ele) => {
      if (ele === eventType.type) {
        this.eventprocessor.handleEvent(this, eventType);
      }
    });
  }
  onSelectAll(items: any) {
  }
}
