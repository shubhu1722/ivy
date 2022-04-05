import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, HostBinding, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActionService } from '../../services/action/action.service';
import { UtilityService } from '../../utilities/utility.service';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { EventServiceService } from '../../services/commonServices/eventService/event-service.service';
import { HookService } from '../../services/commonServices/hook-service/hook.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-icon-text',
  templateUrl: './icon-text.component.html',
  styleUrls: ['./icon-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class IconTextComponent implements OnInit {
  //   @HostBinding('class') classes = 'addNote';
  eventMap = ['click'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  @Input() icon: string;
  @Input() iconcss: string;
  @Input() text: string;
  @Input() textCSS: string;
  @Input() css: string;
  @Input() iconPosition: 'before' | 'after' = 'after';
  @Input() iconTextClass: string;
  @Input() textClass: string;
  @Input() hidden: boolean;
  @Input() inLine: boolean;
  @Input() svgIcon: string;
  @Input() hoverClass: string;
  @Input() iconClass: string;
  @Input() isNotFooter: boolean;
  @Input() disabled: boolean;
  @Input() visibility: boolean;
  @Input() setHidden: any;
  @Input() isAccessoryFlexFiled: boolean;
  @Input() imageSrc: any;
  @Input() hooks: any[];
  @Input() imgtext: string;
  @Input() pClass: string = "";
  @Input() actions!: any;
  constructor(
    private contextService: ContextService,
    private utilityService: UtilityService,
    private eventprocessor: EventServiceService,
    private hookService: HookService,
    private _changeDetectionRef: ChangeDetectorRef,
    private actionService: ActionService,
    private translate: TranslateService
  ) {
    let language = localStorage.getItem('language');
    translate.setDefaultLang(language);
    translate.use(language)
  }

  ngOnInit(): void {
    if (this.imageSrc == undefined || this.imageSrc == "") {
      this.imageSrc == false;
    }
    this.visibility = this.visibility !== undefined ? this.visibility : true;
    this.inLine = this.inLine !== undefined ? this.inLine : false;
    if (this.text && this.text !== undefined) {
      if (this.text.startsWith('#')) {
        this.text = this.contextService.getDataByString(this.text);
      }
    }

    if (this.setHidden) {
      const setHidden = this.setHidden;
      let data: any = this.actionService.getContextorNormalData(setHidden.lhs, "");
      let isConditionValid = this.actionService.isConditionValid({ lhs: data, rhs: setHidden.rhs, operation: setHidden.operation }, this);

      if (isConditionValid) {
        this.visibility = false;
      }
    }
  }

  ngAfterViewInit() {

    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      const afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[3]);
      if (afterInitHooks !== undefined && afterInitHooks.length > 0) {
        this.hookService.handleHook(afterInitHooks, this);
      }
    }
  }

  onTextClick(event) {
    this.eventMap.forEach((ele) => {
      if (ele === event.type) {
        this.eventprocessor.handleEvent(this, event);
      }
    });
  }
}
