import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnChanges, DoCheck } from '@angular/core';
import { LoggerService } from 'src/app/services/commonServices/loggerService/logger.service';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { ValidationService } from 'src/app/services/commonServices/validation/validation.service';
import { ActionService } from 'src/app/services/action/action.service';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class TextFieldComponent implements OnInit {
  @Input() submitable: boolean;
  @Input() disabled: boolean;
  @Input() visibility: boolean;
  @Input() validations: any[];
  @Input() labelstyles: string;
  @Input() inputStyles: string;
  @Input() dellReceiving: any;
  @Input() hooks: any[];
  @Input() actions: any[];
  @Input() footerActions: any[];
  @Input() name: string;
  @Input() label: string;
  @Input() labelPosition: string;
  @Input() tooltip: string;
  @Input() TooltipPosition: string;
  @Input() defaultValue: string;
  @Input() readonly: boolean;
  @Input() type: string;
  @Input() required: any;
  @Input() placeholder: string;
  @Input() value: string;
  @Input() prefix: boolean;
  @Input() prefixIcon: string;
  @Input() suffix: boolean;
  @Input() suffixIcon: string;
  @Input() labelIcon:any = false;
  @Input() formGroupStyles: string;
  @Input() parentuuid: string;
  @Input() css: string;
  @Input() labelClass: string;
  @Input() group: FormGroup;
  @Input() formGroupClass: string;
  @Input() targetuuid: string;
  @Input() rightLabel: string;
  @Input() textfieldClass: string;
  @Input() rightLabelClass: string;
  @Input() isUpperCase: boolean;
  @Input() customRegEx;
  @Input() isAutoComplete;
  @Input() validateGroup: boolean;
  @Input() onlyEnterKeyPress: boolean;
  @Input() focusOut: boolean;
  @Input() hidden: boolean;
  @Input() autoFocus: boolean;
  @Input() focus: boolean;
  @Input() setDisabled: any;
  @Input() disableCompleteButtonEnterActions: boolean;
  @Input() isAccessoryFlexFiled:boolean;
  @Input() isConvertValueToUpperCase: boolean;
  @Input() stopBlurEvent: boolean;
  @Input() minLength: string;
	@Input() maxLength: string;
  processedCustomRegEx: [];
  currentTextFieldValue: any;
  eventMap = ['keyup', 'focus', 'blur', 'onfocusout', 'keydown', 'change', 'click', 'input'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];
  validators: Validators;
  @ViewChild('textFieldRef') textFieldRef: ElementRef;
  // inject event processor service
  constructor(private log: LoggerService,
    private _changeDetectionRef: ChangeDetectorRef,
    private contextService: ContextService,
    private route: ActivatedRoute,
    private router: Router,
    private actionService: ActionService,
    private eventService: EventServiceService,
    private validation: ValidationService, translate: TranslateService,
    private hookService: HookService
  ) {
    let language = localStorage.getItem('language');
    translate.setDefaultLang(language);
    translate.use(language)
  }
  ngOnInit(): void {
    
    this.isAutoComplete = this.isAutoComplete === undefined ? "on" : this.isAutoComplete;   
    
    if (this.customRegEx) {
      this.validators = Validators;
    } else {
      if (this.validations) {
        if (this.validations.length > 0) {
          this.validators = Validators;
        }
      }
    }

    if (this.customRegEx != null && this.customRegEx != undefined) {
      let validationPattern = "";
      if (this.customRegEx.startsWith('#')) {
        validationPattern = this.contextService.getDataByString(this.customRegEx);
      }

      if (validationPattern != "" && validationPattern != undefined) {
        if (typeof validationPattern == "object") {
          let validPattern: [] = validationPattern;
          for (let i = 0; i < validPattern.length; i++) {
            let sourceObject = validPattern[i];
            if (this.processedCustomRegEx == undefined || this.processedCustomRegEx == null) {
              this.processedCustomRegEx = [];
            }
            this.processedCustomRegEx.push(sourceObject['compRegexp']);
          }
        }
      }
    }

    function customRegExValidate(scriptList: []): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {

        let isValid = false;
        if (scriptList != undefined && scriptList != null) {
          for (let j = 0; j < scriptList.length; j++) {
            let regExStr = scriptList[j];
            let regEx = new RegExp(regExStr);
            if (regEx.test(control.value)) {
              isValid = true;
              break;
            }
          }
        }

        return isValid ? null : {
          validateInput: {
            valid: false
          }
        };
      }
    }

    if (this.group === undefined) {
      this.group = new FormGroup({});
      if (this.processedCustomRegEx != null && this.processedCustomRegEx != undefined
        && this.processedCustomRegEx.length > 0) {
        this.group.addControl(this.name, new FormControl(this.defaultValue, customRegExValidate(this.processedCustomRegEx)));
      } else {
        this.group.addControl(this.name, new FormControl(this.defaultValue));
      }
    } else {
      if (this.processedCustomRegEx != null && this.processedCustomRegEx != undefined
        && this.processedCustomRegEx.length > 0) {
        this.group.controls[this.name].setValidators(customRegExValidate(this.processedCustomRegEx));
      } else {
        // if(this.defaultValue){
          this.group.controls[this.name].setValue(this.defaultValue);
        // }
      }
    }

    this.visibility = this.visibility === undefined ? true : this.visibility;
    this.isUpperCase = this.isUpperCase === undefined ? false : this.isUpperCase;
    this.disableCompleteButtonEnterActions = this.disableCompleteButtonEnterActions === undefined ? false : this.disableCompleteButtonEnterActions;

    if (this.disabled !== undefined && this.disabled) {
      this.group.controls[this.name].disable();
    }

    if (this.setDisabled) {
      const setDisabled = this.setDisabled;
      let data: any = this.actionService.getContextorNormalData(setDisabled.lhs, "");
      let isConditionValid = this.actionService.isConditionValid({ lhs: data, rhs: setDisabled.rhs, operation: setDisabled.operation }, this);

      if (isConditionValid) {
        this.group.controls[this.name].disable();
      }
    }

    if (this.customRegEx != null && this.customRegEx != undefined) {
      // console.log("Custom Validator");
    } else {
      if (this.validations) {
        if (this.validations.length > 0) {
          this.validation.validateMethod(this);
        }
      }
    }

    if (this.placeholder && this.placeholder.startsWith('#')) {
      let obj = this.contextService.getDataByString(this.placeholder);
      if (obj) {
        let result = obj.map(a => a.compRegexp.split('-')[0] + "-" + a.compRegexp.split('-')[1]);
        this.placeholder = result.toString();
      }
    }

    if (this.defaultValue ) {
      if(this.defaultValue.startsWith('#')){
        this.defaultValue = this.contextService.getDataByString(this.defaultValue);
      }else{
        this.defaultValue = this.defaultValue;
      }
      this.group.controls[this.name].setValue(this.defaultValue);
      if (this.defaultValue && this.defaultValue !== undefined) {
        var event = { 'type': 'onLoad' };
        this.onKeyDown(event);
      }
    } else {
      this.group.controls[this.name].setValue(this.defaultValue);
      if (this.defaultValue && this.defaultValue !== undefined) {
        var event = { 'type': 'onLoad' };
        this.onKeyDown(event);
      }
    }
  }

  onlocalfocus(event) {
  }

  onlocalChange(event) {
    if (this.isUpperCase !== undefined && this.isUpperCase && event && event.target) {
      this.group.controls[this.name].setValue(event.target.value.toUpperCase());
    }
  }

  onKeyup(event) {
  }

  onlocalBlur(event) {
    if (this.stopBlurEvent !== undefined && this.stopBlurEvent) {
      this.actions && this.actions.forEach((eachAction) => {
        if(eachAction.eventSource === event.type){
          this.actionService.handleAction(eachAction, this);
        }
      })
    } else {
      const eventType = { type: event.type };
      if (this.group.status === 'VALID') {
        /// Treat enter key as click
        if (event.keyCode === 13) {
          eventType.type = 'click';

          if (this.footerActions && this.footerActions.length > 0) {
            this.eventMap.forEach((ele) => {
              if (ele === eventType.type) {
                this.eventService.handleEvent(this, eventType, true);
              }
            });
          }
        }
        else {
          this.eventMap.forEach((ele) => {
            if (ele === event.type) {
              this.eventService.handleEvent(this, eventType);
            }
          });
        }
      } else if (this.validateGroup === false) {
        this.eventMap.forEach((ele) => {
          if (ele === event.type) {
            this.eventService.handleEvent(this, event);
          }
        });
      } else {
        //do nothing
      }
    }
  }

  onlocalFocusOut(event) {
  }

  onInput(event) {
    if (this.isUpperCase !== undefined && this.isUpperCase) {
      // this.group.controls[this.name].setValue(event.target.value.toUpperCase());
      this.currentTextFieldValue = event.target.value.toUpperCase();
      if(this.isConvertValueToUpperCase != undefined && this.isConvertValueToUpperCase){
        this.group.controls[this.name].setValue(event.target.value.toUpperCase());
      }
    } else {
      this.currentTextFieldValue = event.target.value;
    }
    if (this.group.status === 'VALID') {
      this.eventMap.forEach((ele) => {
        if (ele === event.type) {
          this.eventService.handleEvent(this, event);
        }
      });
    } else if (this.validateGroup === false) {
      this.eventMap.forEach((ele) => {
        if (ele === event.type) {
          this.eventService.handleEvent(this, event);
        }
      });
    }
    
    if(this.name == "shippingOrderIdValue"){
      if(this.group.controls && this.group.controls != undefined){
        if(this.group.controls[this.name] && this.group.controls[this.name] != undefined){
          let value = this.group.controls[this.name].value;
          if(value && value != undefined && value.length > 9){
            value = value.trim();
            this.group.controls[this.name].setValue(value);
            this._changeDetectionRef.detectChanges();
          }
        }
      }
    }
  }

  onKeyDown(event) {
    if ((this.group.status === 'VALID') && (this.validateGroup !== false) && !this.onlyEnterKeyPress) {
      this.eventMap.forEach((ele) => {
        if (ele === event.type) {
          this.eventService.handleEvent(this, event);
        }
      });
    } else if (this.onlyEnterKeyPress) {
      if (event.keyCode === 13) {
        if(this.focusOut){
          this.textFieldRef.nativeElement.blur();
        }
        this.eventMap.forEach((ele) => {
          if (ele === event.type) {
            this.eventService.handleEvent(this, event);
          }
        });
      }
    } else if (this.validateGroup === false) {
      if ((event.keyCode === 9) || (event.keyCode === 13)) {
        this.eventMap.forEach((ele) => {
          if (ele === event.type) {
            this.eventService.handleEvent(this, event);
          }
        });
        if (this.dellReceiving) {
          event.prevenDefault();
        }
      }
    } else {
      //do nothing
    }
  }

  clickevent(event) {
    const eventType = { type: event.type };
    if (this.group.status === 'VALID') {
      /// Treat enter key as click
      // if (event.type === 'click' && event.keyCode === undefined)  {
      // this.router.navigate(['subprocess'], {relativeTo: this.route});
      // }
      if (event.keyCode === 13) {
        eventType.type = 'click';
        if (this.disableCompleteButtonEnterActions !== undefined && !this.disableCompleteButtonEnterActions) {
          if (this.footerActions && this.footerActions.length > 0) {
            this.eventMap.forEach((ele) => {
              if (ele === eventType.type) {
                this.eventService.handleEvent(this, eventType, true);
              }
            });
          }
        }
      } else {
        this.eventMap.forEach((ele) => {
          if (ele === event.type) {
            this.eventService.handleEvent(this, eventType);
          }
        });
      }
    }
  }

  ngAfterViewInit() {
     if(this.required != undefined && typeof(this.required) == "string" && this.required.startsWith('#')) {
      let isMandatory = this.required.slice(1);
      this.required = this.contextService.getDataByKey(isMandatory);
       if (this.required) {
         this.textFieldRef.nativeElement.focus();
       }
    }
    if (this.textFieldRef && this.required && this.focus == undefined) {
      // this.textFieldRef.nativeElement.focus();
      this.textFieldRef.nativeElement.autofocus = true;
    }

    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      const afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[3]);
      if (afterInitHooks !== undefined && afterInitHooks.length > 0) {
        this.hookService.handleHook(afterInitHooks, this);
      }
    }
  }

  onCLickOfEnter($event){
    this.actions && this.actions.map((action) => {
      if(action.eventSource === "enter"){
        this.actionService.handleAction(action, this);
      }
    })
  }
}
