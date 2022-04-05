import { ActionService } from 'src/app/services/action/action.service';
import { CustomeService } from 'src/app/services/commonServices/customeService/custome.service';
import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, ViewContainerRef, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { CiscoECObookingService } from 'src/app/services/cisco/ciscoEcobookingService/cisco-ecobooking.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-toggle-actions-component',
  templateUrl: './toggle-actions-component.component.html',
  styleUrls: ['./toggle-actions-component.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ToggleActionsComponentComponent implements OnInit ,AfterViewInit{

  constructor(private eventprocessor: EventServiceService, private contextService: ContextService,
    private _changeDetectionRef: ChangeDetectorRef, private customService: CustomeService, 
    private actionService: ActionService,
    private ciscoECObookingService : CiscoECObookingService,private translate: TranslateService
    ) { 
      let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
    }

  eventMap = ['change'];
  hookMap = ['beforeInit', 'afterInit', 'beforeAction', 'afterAction'];

  @Input() disabled: boolean;
  @Input() name: string;
  @Input() selectedVal: any;
  @Input() value: any;
  @Input() text: any;
  @Input() color: string;
  @Input() vertical: boolean;
  @Input() hidden: boolean;
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
  @Input() subProcess: any;
  @Input() sublabel :any;
  sublabelVal = '';
  activeItemBGColor;
  activeItemColor;

  @ViewChild('afterButtonToggle', { static: true, read: ViewContainerRef }) afterButtonToggle: ViewContainerRef;

  ngOnInit(): void {

    if(this.selectedVal != null && this.selectedVal != undefined && this.selectedVal.startsWith('#')){
      this.selectedVal = this.contextService.getDataByString(this.selectedVal);
    } 

    if (this.options != null && this.options != undefined && !(this.options instanceof Array) && this.options.startsWith('#')) {
      this.options = this.contextService.getDataByString(this.options);
      this.options = this.customService.getDataForActionToggle(this.options, this.text, this.value)
    }
    this.activeItemColor = "";
    this.activeItemBGColor = "";
    if (this.required !== undefined && this.required) {
      this.group.controls[this.name].setValidators(Validators.required);
    }
    this.contextService.addToContext('afterButtonToggle', this.afterButtonToggle);

    if(this.sublabel) {
      this.sublabelVal = this.contextService.getDataByString(this.sublabel) ? this.contextService.getDataByString(this.sublabel) : this.sublabel;
    }
  }

  toggle(event) {
    this.group.controls[this.name].setValue(event.value);

    if (this.options != null && this.options != undefined) {
      this.options.forEach(optionItem => {
        if (optionItem.value == event.value) {
          this.activeItemBGColor = optionItem.bgcolor;
          this.activeItemColor = optionItem.color;
        }
      });
    }

    this.eventMap.forEach((ele) => {
      /// Since button toggle event does not have type
      this.eventprocessor.handleEvent(this, { "type": ele });
    });

    // changes related CISCO ECo booking.
    let unitInfo = this.contextService.getDataByString("#UnitInfo");
    if (unitInfo !== undefined && unitInfo !== null) {
      if (unitInfo.WORKCENTER === "CONFIG" && unitInfo.WAREHOUSE_NAME === "CISCO" && this.subProcess == undefined) {
        let action = {
          group: this.group,
          operation: "pushAction",
          selectedValue: event.value
        }
        this.ciscoECObookingService.changeResultCode(action,this,this.actionService);
      }
    }
  }

  ngAfterViewInit(){
    if(this.selectedVal != null && this.selectedVal != undefined && this.selectedVal.startsWith('#')){
      this.selectedVal = this.contextService.getDataByString(this.selectedVal);
    } 
  }
}
