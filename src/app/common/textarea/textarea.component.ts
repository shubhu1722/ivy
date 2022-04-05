import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { LoggerService } from 'src/app/services/commonServices/loggerService/logger.service';
import { FormGroup } from '@angular/forms';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { TranslateService } from '@ngx-translate/core';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class TextareaComponent implements OnInit {
  @Input() submitable: boolean;
  @Input() disabled: boolean;
  @Input() visibility: boolean;
  @Input() validations: any[];
  @Input() labelstyles: string;
  @Input() inputStyles: string;
  @Input() hooks: any[];
  @Input() actions: any[];
  @Input() name: string;
  @Input() label: string;
  @Input() labelPosition: string;
  @Input() tooltip: string;
  @Input() TooltipPosition: string;
  @Input() defaultvalue: string;
  @Input() readonly: boolean;
  @Input() type: string;
  @Input() hidden: any;
  @Input() required: boolean;
  @Input() placeholder: string;
  @Input() value: string;
  @Input() errorStateMatcher: string;
  @Input() textareaClass: string;
  @Input() group: FormGroup;
  @Input() textareaContainer: string;
  eventMap = ['keyup', 'focus', 'blur', 'onfocusout', 'keydown', 'change', 'onLoad'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];
  afterInitHooks: any[];
  constructor(
    private logger: LoggerService,
    private _changeDetectionRef: ChangeDetectorRef,
    private hookService: HookService,
    private contextService: ContextService,
    private eventService: EventServiceService,
    translate: TranslateService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {
    if (this.value && this.value !== undefined && this.value.startsWith('#')) {
      this.value = this.contextService.getDataByString(this.value);
      this.group.controls[this.name].setValue(this.value);
      if (this.value && this.value !== undefined) {
        var event = { 'type': 'onLoad' };
        this.onlocalChange(event);
      }
    }
  }

  onlocalChange(event) {
    if(event && event.target) {
      if(event.target.value.trim() == ""){
        this.group.controls[this.name].setValue(event.target.value.trim());
      }
      else{
        this.group.controls[this.name].setValue(event.target.value);
      }
    }
    
    if (this.group.status === 'VALID') {
      this.eventMap.forEach((ele) => {
        if (ele === event.type) {
          this.eventService.handleEvent(this, event);
        }
      });
    }
  }

  ngAfterViewInit() {
    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      this.afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[3]);
      this.hookService.handleHook(this.afterInitHooks, this);
    }
  }
}
