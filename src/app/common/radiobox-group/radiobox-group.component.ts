import { Component, OnInit, Input, AfterViewInit, Output, ChangeDetectionStrategy, ViewEncapsulation, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MatRadioChange, MatRadioButton } from '@angular/material/radio';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ActionService } from 'src/app/services/action/action.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-radiobox-group',
  templateUrl: './radiobox-group.component.html',
  styleUrls: ['./radiobox-group.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})

export class RadioboxGroupComponent implements OnInit, AfterViewInit {
  eventMap = ['change'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  @Input() radioButtonOptions: string[] = [];
  @Input() color = 'primary';
  @Input() disabled = false;
  @Input() labelPosition: 'before' | 'after' = 'after';
  @Input() name = 'option';
  @Input() required = true;
  @Input() ctype : any;
  @Input() uuid : any;
  @Input() selected = 'MatRadioButton';
  @Input() value: 'radioGroup';
  @Input() code: string;
  @Input() submitable = false;
  @Input() validations = [];
  @Input() dataSource: any;
  @Input() labelstyles = 'margin-left:3px';
  @Input() inputStyles;
  @Input() group: FormGroup;
  @Input() hooks = [];
  @Input() actions = [];
  @Input() tooltip = '';
  @Input() tooltipPosition = 'right';
  @Input() inputClass;
  @Input() labelClass;
  @Input() label;
  @Input() groupClass;
  @Input() checked;
  // @Output() change: EventEmitter<MatRadioChange>
  private arraydata = [];
  constructor(private actionService: ActionService, private contextService: ContextService, private _changeDetectionRef: ChangeDetectorRef,
    private utilityService: UtilityService, private hookService: HookService, private eventService: EventServiceService, private translate: TranslateService
    ) { 
      let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
    }

  ngOnInit(): void {

    // if (this.group === undefined) {
    this.group = new FormGroup({});
    this.group.addControl(this.name, new FormControl(''));
    // } 
    if(this.radioButtonOptions && this.radioButtonOptions != undefined){
      let obj;
      let tempArr = [];
      this.radioButtonOptions.forEach((ele) => {
        obj = {};
        if(typeof ele === "string"){
          obj["value"] = ele;
          obj["checked"] = false;
        } else if(typeof ele === "object"){
          obj = ele;
          obj["checked"] = false;
        }
        tempArr.push(obj);
      });
      this.radioButtonOptions = tempArr;
      // radioButtonOptions
      this.contextService.addToContext("radioButtonOptions", this.radioButtonOptions);
    }

    if (this.dataSource && this.dataSource !== undefined && this.dataSource.startsWith('#')) {
      this.arraydata = this.contextService.getDataByString(this.dataSource);
      if (this.arraydata && this.arraydata.length > 0) {
        let arr = [];
        let obj;
        let dataSourceName = this.dataSource;
        this.arraydata.forEach(optionVal => {
          obj = {};
          if(typeof optionVal === "string"){
            obj["value"] = optionVal;
            obj["checked"] = false;
          } else if(typeof optionVal === "object"){
            obj = optionVal;
            obj["checked"] = false;
          }
          arr.push(optionVal);
        });
        this.radioButtonOptions = arr;
        dataSourceName = dataSourceName.replace(/#/gi, "");
        this.contextService.addToContext("radioButtonOptions", arr);
      }
    }

    this.checked = this.checked !== undefined ? this.checked : false
  }

  onChange(mrChange: MatRadioChange) {
    // console.log(mrChange.value);
    // let mrButton: MatRadioButton = mrChange.source;
    // console.log(mrButton.name);
    // console.log(mrButton.checked);
    // console.log(mrButton.inputId);
    // console.log(mrButton.radioGroup.name);
    let index = this.radioButtonOptions.indexOf(mrChange.value);
    this.group.controls[this.name].setValue(mrChange.value);
    // this.eventMap.forEach((ele) => {
    //   // if (ele === eventType.type) {
    //     this.eventService.handleEvent(this, 'change', true);
    // //   }
    //  });
    //  if (data["config"] && data["config"].data == "formData") {
    //   Object.keys(this.group.controls).forEach((key) => {
    //     let text = {};
    //     if (key != "undefined") {
    //       let data = this.contextService.getDataByKey(key)
          // if (data) {
            let text = {
              "name": this.name,
              "ctype": this.ctype,
              "uuid": this.uuid,
              "value": mrChange.value
            }
            this.contextService.addToContext(this.name, text);
            
    //         this.contextService.deleteDataByKey(key)
    //       }
    //     }

    //   })
    // }
    if (this.actions !== undefined && this.actions.length > 0) {
      this.actions.forEach((currentAction) => {
        this.actionService.handleAction(currentAction, this)
      })
    }
  }

  ngAfterViewInit() {
    // this.hookService.handleHook(this.afterInitHooks, this);
    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      const afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[3]);
      if (afterInitHooks !== undefined && afterInitHooks.length > 0) {
        this.hookService.handleHook(afterInitHooks, this);
      }
    }
  }
}




