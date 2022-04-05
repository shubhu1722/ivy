import { Component, Input, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { FormGroup, Validators } from '@angular/forms';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';

@Component({
  selector: 'app-button-toggle',
  templateUrl: './button-toggle.component.html',
  styleUrls: ['./button-toggle.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ButtonToggleComponent implements OnInit {
  eventMap = ['change'];
  hookMap = ['beforeInit', 'afterInit', 'beforeAction', 'afterAction'];

  @Input() disabled: boolean;
  @Input() name: string;
  @Input() value: any;
  @Input() color: string;
  @Input() vertical: boolean;
  @Input() checked: boolean;
  @Input() id: string;
  @Input() visibilty: boolean;
  @Input() hooks: string[] = [];
  @Input() actions: string[];
  @Input() validations: string[];
  @Input() labelstyles: string;
  @Input() inputStyles: string;
  @Input() label: string;
  @Input() labelPosition: string;
  @Input() css: string;
  @Input() group: FormGroup;
  @Input() labelClass: string;
  @Input() formGroupClass: string;
  @Input() toggleClass: string;
  @Input() formGroupStyles: string;
  @Input() required: boolean;
  @Input() options: any;
  yesColor;
  noColor;
  @ViewChild('afterButtonToggle', { static: true, read: ViewContainerRef }) afterButtonToggle: ViewContainerRef;
  constructor(private eventprocessor: EventServiceService, private contextService: ContextService,
    private _changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.yesColor = '';
    this.noColor = '';
    if (this.required !== undefined && this.required) {
      this.group.controls[this.name].setValidators(Validators.required);
    }
    this.contextService.addToContext('afterButtonToggle', this.afterButtonToggle);
  }

  toggle(event) {
    this.group.controls[this.name].setValue(event.value);
    if (event.value === 'YES') {
      this.yesColor = 'rgb(112, 182, 3)';
      this.noColor = '';
    } else {
      this.yesColor = '';
      this.noColor = 'rgb(220, 68, 68)';
    }
    this.eventMap.forEach((ele) => {
      /// Since button toggle event does not have type
      this.eventprocessor.handleEvent(this, { "type": ele });
    });
  }

  changeColor(value) {
    // console.log(value);
  }
}
