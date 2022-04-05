import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-radiobox',
  templateUrl: './radiobox.component.html',
  styleUrls: ['./radiobox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class RadioboxComponent implements OnInit {

  eventMap = ['change'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  @Input() color = 'primary';
  @Input() checked: boolean;
  @Input() disableRipple: boolean;
  @Input() disabled: boolean;
  @Input() id = 'string';
  @Input() labelPosition: 'before' | 'after' = 'after';
  @Input() name: string;
  @Input() required: boolean;
  @Input() value: string;
  @Input() radioGroup = '';
  @Input() submitable: boolean;
  @Input() validations = [];
  @Input() labelstyles = '';
  @Input() inputStyles: any;
  @Input() hooks = [];
  @Input() action = [];
  @Input() tooltip: string;
  @Input() tooltipPosition = 'right';
  @Input() group;

  constructor(private eventProcessor: EventServiceService, private hookService: HookService,
    private _changeDetectionRef: ChangeDetectorRef,
    translate: TranslateService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {
    if (this.group === undefined) {
      this.group = new FormGroup({});
      this.group.addControl(this.name, new FormControl());
    }
  }

  onChangeClick(event) {
    this.group.controls[this.name].setValue(event.value);
    this.eventMap.forEach((ele) => {
      if (ele === 'change') {
        this.eventProcessor.handleEvent(this, { "type": ele });
      }
    });
  }

  ngAfterViewInit() {
    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      const afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[3]);
      if (afterInitHooks !== undefined && afterInitHooks.length > 0) {
        this.hookService.handleHook(afterInitHooks, this);
      }
    }
  }
}
