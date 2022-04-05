import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { TranslateService } from '@ngx-translate/core';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class CheckboxComponent implements OnInit, AfterViewInit {
  eventMap = ['change', 'click'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  @Input() checked: boolean;
  @Input() color: string;
  @Input() disableRipple: boolean;
  @Input() disabled: boolean;
  @Input() id: string;
  @Input() indeterminate: boolean;
  @Input() labelPosition: string;
  @Input() name: string;
  @Input() required: boolean;
  @Input() value: string;
  @Input() submitable: boolean;
  @Input() validations: any;
  @Input() labelstyles: string;
  @Input() inputStyles: string;
  @Input() hooks: any;
  @Input() checkVisibility = true;
  @Input() action: any;
  @Input() tooltip: string;
  @Input() TooltipPosition: string;
  @Input() label: string;
  @Input() group: FormGroup;
  afterInitHooks: any[];
  @Input() checkboxContainer: string;
  @Input() isIcon: boolean;
  @Input() icon: any;
  @Input() iconClass: string;
  @Input() iconPosition: 'before' | 'after' = 'after';
  @Input() hidden: boolean;
  // @Input() inLine: boolean = false;
  @Input() checkdifferent: boolean;
  @Input() labelClass: string;
  constructor(
    private eventprocessor: EventServiceService,
    private _changeDetectionRef: ChangeDetectorRef,
    private hookService: HookService,
    translate: TranslateService
  ) {
    const language = localStorage.getItem('language');
    translate.setDefaultLang(language);
    translate.use(language);
  }

  ngOnInit(): void {
    this.isIcon = this.isIcon ? this.isIcon : false;
    // this.inLine = this.inLine ? this.inLine : false;
    if (this.group === undefined) {
      this.group = new FormGroup({});
      this.group.addControl(this.name, new FormControl());
      // this.group.controls[this.name].setValue(false);
    } else {
      this.group.addControl(this.name, new FormControl());
      // this.group.controls[this.name].setValue(false);
    }
    if (this.required !== undefined && this.required) {
      this.group.controls[this.name].setValidators(Validators.required);
    }
  }

  CheckFunction(event) {
    const eventType = { type: 'click' };
    this.group.controls[this.name].markAsDirty();
    this.group.controls[this.name].setValue(event.checked);
    this._changeDetectionRef.detectChanges();
    this.eventMap.forEach((ele) => {
      if (ele === eventType.type) {
        this.eventprocessor.handleEvent(this, eventType);
      }
    });
  }

  ngAfterViewInit() {
    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      this.afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[1]);
      this.hookService.handleHook(this.afterInitHooks, this);
    }
  }

  onClickCheckbox(): void {}
}
