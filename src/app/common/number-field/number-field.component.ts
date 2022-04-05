import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { LoggerService } from 'src/app/services/commonServices/loggerService/logger.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class NumberFieldComponent implements OnInit {
  @Input() submitable: boolean;
  @Input() disabled: boolean;
  @Input() visibility: boolean;
  @Input() validations: [];
  @Input() labelstyles: string;
  @Input() inputStyles: string;
  @Input() hooks: [];
  @Input() actions: [];
  @Input() name: string;
  @Input() label: string;
  @Input() labelPosition: string;
  @Input() tooltip: string;
  @Input() TooltipPosition: string;
  @Input() defaultvalue: string;
  @Input() readonly: boolean;
  @Input() type: string;
  @Input() required: boolean;
  @Input() placeholder: string;
  @Input() value: string;
  @Input() errorStateMatcher: string;

  eventMap = ['keyup', 'focus', 'blur', 'onfocusout', 'keydown', 'onchange'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];
  // inject event processor service
  constructor(private logger: LoggerService,
    translate: TranslateService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {
    // check for beforeinit hook if exists call
    // componentspecific logic
    // check for afterinit hook if exists call
  }

  onlocalfocus(event) {
    // this.logger.log();
    // any custome logic
    // this.eventprocessor.handleEvent(event)
  }

  onlocalChange(event) {
  }

  onKeyup(event) {
  }

  onlocalBlur(event) {
  }

  onlocalFocusOut(event) {
  }

  onKeyDown(event) {
  }
}
