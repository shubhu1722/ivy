import { Component, OnInit, ChangeDetectorRef, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActionService } from 'src/app/services/action/action.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';

@Component({
  selector: 'app-drop-down-with-multi-select',
  templateUrl: './drop-down-with-multi-select.component.html',
  styleUrls: ['./drop-down-with-multi-select.component.scss']
})
export class DropDownWithMultiSelectComponent implements OnInit {


  @Input() options: any[];
  @Input() inputStyles: string;
  @Input() searchIconStyles: string;
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
  @Input() chipClasses: string;
  @Input() chipCancelClasses: string;
  @Input() optGrpFormFieldClass: string;
  @Input() formGroupStyles: string;
  @Input() hidden: boolean;
  @Input() defaultFilterValue: string;
  @Input() defaultFilterKey: string;
  @Input() required: boolean;
  @Input() actions: any[] = [];
  @Input() disabled: boolean;
  @Input() isSearchToAddContext: boolean;
  @Input() inputConfig: any;
  @Input() selectedList: any[] = [];
  selectedDropdownName: string;
  dropDownOptions: any;
  splitArray: string[];
  contextKey: string;
  eventMap = ['change', 'openedChange', 'searchChange', 'keydown','click'];
  hookMap = ['beforeInit', 'afterInit', 'beforeAction', 'afterAction'];
  beforeInitHooks: any[];
  afterInitHooks: any[];
  beforeActionHooks: any[];
  afterActionHooks: any[];
  @Input() dropdownClass: string;
  @Input() parentClass: string;
  @Input() inputClass: string;
  config = {
    displayKey: "displayValue", // if objects array passed which key to be displayed defaults to description
    search: true,
    height: 'auto',
  };

  @ViewChild('search') searchTextBox: ElementRef;

  constructor(private contextService: ContextService, private _changeDetectionRef: ChangeDetectorRef,
    private actionService: ActionService,
    private utilityService: UtilityService, private hookService: HookService, private eventprocessor: EventServiceService) { }

  toppingsControl = new FormControl([]);
  toppingList: any[];
  filteredList: string[];
  searchTextboxControl = new FormControl();

  ngOnInit() {  
    if (this.defaultValue && this.defaultValue !== undefined && this.defaultValue.startsWith('#')) {
      let defaultResultVal = this.contextService.getDataByString(this.defaultValue);
      if (defaultResultVal == undefined || defaultResultVal == null || defaultResultVal == "") {
        if (this.options && this.options.length > 0) {
          this.options.forEach(optionVal => {
            if (optionVal.isDefault == "true" || optionVal.isDefault == true) {
              defaultResultVal = optionVal.code;
            }
          });
        }
      }

      this.defaultValue = defaultResultVal;
    }
    if (this.defaultFilterValue && this.defaultFilterValue !== undefined && this.defaultFilterValue.startsWith('#')) {
      this.defaultFilterValue = this.contextService.getDataByString(this.defaultFilterValue);
    }
    if (this.group === undefined) {
      this.group = new FormGroup({});
      if (this.defaultValue && this.defaultValue !== undefined) {
        this.group.addControl(this.name, new FormControl(this.defaultValue));
      } else {
        this.group.addControl(this.name, new FormControl());
      }
    } else {
      if (this.defaultValue && this.defaultValue !== undefined) {
        this.group.controls[this.name].setValue(this.defaultValue);
      }
    }
    if(this.required !== undefined && this.required){
      this.group.controls[this.name].setValidators(Validators.required);
    }
    if (this.disabled !== undefined && this.disabled) {
      this.group.controls[this.name].disable();
    }
    // TODO: Remove hard coded string 'userSelected'
    this.contextService.addToContext('userSelected' + this.name, this.group.controls[this.name].value);
    if (this.dataSource && this.dataSource !== undefined) {
      if (this.dataSource instanceof Array) {
        this.dataSource = this.dataSource.map(s => ({
          code: s,
          displayValue: s
        }));
        this.dataSource.sort((a, b) => a.displayValue.localeCompare(b.displayValue));
        this.options = this.dataSource;
      }
      else if (this.dataSource.startsWith('#')) {
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
          if (this.code && this.code !== undefined) {
            responseArray = responseArray?.map(s => ({
              code: s[this.code]?.trim(),
              displayValue: s[this.displayValue]?.trim()
            }));
          } else {
            responseArray = responseArray?.map(s => ({
              code: s?.trim(),
              displayValue: s?.trim()
            }));
          }
          responseArray = responseArray?.filter((x) => x.displayValue !== undefined && x.displayValue);
          responseArray?.sort((a, b) => a.displayValue.localeCompare(b.displayValue));
          this.options = responseArray;
        }
      } else {
        this.options = this.dataSource;
      }
      this.toppingList = this.options;
    }

    if (this.inputConfig) {
      this.config = this.inputConfig;
    }

    if (this.hooks !== undefined) {
      this.beforeInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[0]);
      if (this.beforeInitHooks !== undefined && this.beforeInitHooks.length > 0) {
        this.hookService.handleHook(this.beforeInitHooks, this);
      }
    }

    this.selectedList = this.selectedList !== undefined ? this.selectedList : [];
    //Multiselect drop down
    if(this.parentClass && this.parentClass !== undefined){
      this.parentClass; 
    } else {
      this.parentClass = "drop-down-with-multi-select form-group-margin"
    }
    if(this.inputClass && this.inputClass !== undefined){
      this.inputClass; 
    } else {
      this.inputClass = "drop-down-input-field"
    }
  }

  onToppingRemoved(topping: string) {
    const toppings = this.toppingsControl.value as string[];
    this.removeFirst(toppings, topping);
    this.toppingsControl.setValue(toppings); // To trigger change detection
    this.selectedList = toppings;
    this.actions.forEach((eachAction) => {
      this.actionService.handleAction(eachAction, this);
    });
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  keyDown(event) {
    this.options = [];
    console.log(event.target.value);
    this.toppingList.forEach((current) => {
      if (current.displayValue.toLowerCase().includes(event.target.value.toLowerCase())) {
        this.options.push(current);
      }
    });
  }

  selectionChange(event){
    this.group.controls[this.name].setValue(event.value);
    this.selectedList = event.value;
    this.actions.forEach((ele) => {
        this.actionService.handleAction(ele, this);
    });
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox 
    this.searchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }

  /**
   * Clearing search textbox value 
   */
  clearSearch(event) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }
  clickevent(event){
    // Set search textbox value as empty while opening selectbox
    this.searchTextboxControl.patchValue('');
    this.options = this.toppingList;
        // Focus to search textbox while clicking on selectbox
    if (event == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }

}