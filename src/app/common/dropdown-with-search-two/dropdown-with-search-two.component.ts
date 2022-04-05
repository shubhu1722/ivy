import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { ActionService } from 'src/app/services/action/action.service';

@Component({
  selector: 'app-dropdown-with-search-two',
  templateUrl: './dropdown-with-search-two.component.html',
  styleUrls: ['./dropdown-with-search-two.component.scss']
})
export class DropdownWithSearchTwoComponent implements OnInit {
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
  @Input() isSearchToAddContext: boolean;
  @Input() inputConfig: any;
  @Input() uuid: string;
  @Input() disableSort: boolean = false;
  @Input() focus: boolean;
  selectedDropdownName: string;
  dropDownOptions: any;
  splitArray: string[];
  contextKey: string;
  eventMap = ['change', 'openedChange', 'searchChange', 'keydown'];
  hookMap = ['beforeInit', 'afterInit', 'beforeAction', 'afterAction'];
  beforeInitHooks: any[];
  afterInitHooks: any[];
  beforeActionHooks: any[];
  afterActionHooks: any[];
  @Input() dropdownClass: string;
  config = {
    displayKey: "displayValue", // if objects array passed which key to be displayed defaults to description
    search: true,
    height: 'auto',
  };

  constructor(private contextService: ContextService, private _changeDetectionRef: ChangeDetectorRef,
    private actionService: ActionService,
    private utilityService: UtilityService, private hookService: HookService, private eventprocessor: EventServiceService) { }

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
            responseArray = responseArray.map(s => ({
              code: s[this.code],
              displayValue: s[this.displayValue]
            }));
          } else {
            responseArray = responseArray.map(s => ({
              code: s,
              displayValue: s
            }));
          }
          responseArray = responseArray.filter((x) => x.displayValue !== undefined && x.displayValue);

          if(!this.disableSort){
            responseArray.sort((a, b) => a.displayValue.localeCompare(b.displayValue));
          }
          
          this.options = responseArray;
        }
      } else {
        this.options = this.dataSource;
      }
    }

    if(this.inputConfig) {
      this.config = this.inputConfig;
    }

    if (this.hooks !== undefined) {
      this.beforeInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[0]);
      if (this.beforeInitHooks !== undefined && this.beforeInitHooks.length > 0) {
        this.hookService.handleHook(this.beforeInitHooks, this);
      }
    }
  }



  changeValue($event: any) {
    // console.log(this.selectForm.getRawValue());
  }

  searchChange(event) {
    if(this.isSearchToAddContext) {
      this.actions && this.actions.forEach((val) => {
        if((val.type === "searchToAddContext") && val.config  && (val.config.length > 0)) {
          val.config.forEach((r) => {
            if(r.event === true) {
              this.contextService.addToContext(r.key, event);
            } else {
              this.actionService.handleAction(r, this);
            }
          });
          
        }
      });
    }
    // this.eventMap.forEach((ele) => {
    //   if (ele === eventType.type) {
    //     this.eventprocessor.handleEvent(this, eventType, event);
    //   }
    // });
  }

  onKeyDown(event) {
    if(this.isSearchToAddContext) {
      if(event.keyCode === 13) {
        this.eventMap.forEach((ele) => {
          if (ele === event.type) {
            this.eventprocessor.handleEvent(this, event);
          }
        });
      }
    }    
  }

  changeDropdown(event: any) {
    const eventType = { type: 'change' };
    this.selectedDropdownName = event.value["displayValue"];
    //this.group.controls[this.name].setValue(event.value["code"]);
    this.eventMap.forEach((ele) => {
      if (ele === eventType.type) {
        this.eventprocessor.handleEvent(this, eventType);
      }
    });
  }


  reset() {
  }
}
