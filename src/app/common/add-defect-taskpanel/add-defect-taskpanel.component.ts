// import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, ViewChild, ViewContainerRef, Input, ChangeDetectorRef, AfterViewInit, ViewEncapsulation, ChangeDetectionStrategy, AfterContentInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ComponentLoaderService } from '../../services/commonServices/component-loader/component-loader.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ContextService } from '../../services/commonServices/contextService/context.service';

//  --- Check ----
// import { predictionData, dropdownData, buttonData } from '../../utilities/constants';
   
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { TaskPanelComponent } from '../task-panel/task-panel.component';
import { ButtonComponent } from '../button/button.component';
import { HookService } from '../../services/commonServices/hook-service/hook.service';

@Component({
  selector: 'app-add-defect-taskpanel',
  templateUrl: './add-defect-taskpanel.component.html',
  styleUrls: ['./add-defect-taskpanel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class AddDefectTaskpanelComponent implements OnInit {
  panelOpenState;
  // flag: boolean;
  UUID: any;
  // @ViewChild('expansionpredictivepanel', { static: true, read: ViewContainerRef }) expansionpanelcontent: ViewContainerRef;
  @Input() dataSource: any = [];
  @Input() uuid: any = "";
  @Input() selectDisabled: any;
  @Input() footer: any = [];
  @Input() toolBarItems: any = [];
  @Input() hooks: any;
  @Input() name: any;
  @Input() predictiveClass: any;
  @Input() items: any;
  @Input() inputStyles: string;
  @Input() group: FormGroup;
  @Input() disabled: any;
  @Input() expanded: any;
  @Input() hideToggle: boolean;
  @Input() togglePosition: string;
  @Input() collapsedHeight: string;
  @Input() expandedHeight: string;
  @Input() displayMode: string;
  @Input() multi: boolean;
  @Input() isEditable: boolean = false;
  @Input() isMandatory: boolean = false;
  @Input() hidden: any;
  @Input() hideexpansion: any;
  @Input() bodyCss: string;
  @Input() errorMessage: string;
  @Input() iconClass: string;
  @Input() leftDivclass: string;
  @Input() rightDivclass: string;
  @Input() columnWiseTitle: any;
  @Input() splitView: any;
  @Input() verticalsplitView: any;
  @Input() spaceView: any;
  @Input() rightItems: any[];
  @Input() topItems: any[];
  @Input() headerTitleLabels: string[];
  @Input() headerTitleValues: string[];
  @Input() inputClasses: string[];
  @Input() isblueBorder: boolean;
  @Input() isyellowBorder: boolean;
  @Input() taskPanelHeaderClass: string;
  @Input() bodyClass;
  @Input() intialTaskpanel: boolean;
  @Input() contentSecondHalfClass: string;
  nestedFormGroup: FormGroup;
  @Input() headerClasses: string[];
  @Input() panelClass: string;
  @Input() headerStatusClass;
  @Input() ignoreFocus: boolean = false;
  @Input() setDisabled: any;
  @Input() isKeepExpanded: any;
  @Input() reworkClass: string;
  @Input() isReworkClass: boolean;
  @Input() actions: any;
  @Input() header: any = {};
  @Input() toggleExpanded: any = {};
  @Input() Togglehidden: any;
  @ViewChild('expansionpanelcontent', { static: true, read: ViewContainerRef }) expansionpanelcontent: ViewContainerRef;
  @ViewChild('expansionpanelfooter', { static: true, read: ViewContainerRef }) expansionpanelfooter: ViewContainerRef;
  @ViewChild('expansionPanelContenttaskpanel', { static: true, read: ViewContainerRef }) expansionPanelContenttaskpanel: ViewContainerRef;
  @ViewChild('expansionPanelContenttoolbar', { static: true, read: ViewContainerRef }) expansionPanelContenttoolbar: ViewContainerRef;

  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  constructor(private contextService: ContextService,
    private _changeDetectionRef: ChangeDetectorRef,
    private componentLoaderService: ComponentLoaderService,
    private hookService: HookService) { }

  ngOnInit(): void {
    // this.dataSource = predictionData;      --- Check ----
    this.UUID = this.uuid;
    this.uuid = new FormGroup({});
    if (this.header.title && this.header.title.startsWith('#')) {
      this.header.title = this.contextService.getDataByString(this.header.title);
    }
    if (!this.splitView) {
      this.bodyClass = 'padding-top-15 content-padding';
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.items.length; i++) {
      this.uuid.addControl(this.items[i].name, new FormControl(this.items[i].value));
    }
    this.contextService.addToContext('expansionpanelcontent', this.expansionpanelcontent);
    this.contextService.addToContext('expansionpanelfooter', this.expansionpanelfooter);
    this.contextService.addToContext('expansionPanelContenttaskpanel', this.expansionPanelContenttaskpanel);
    this.contextService.addToContext('expansionPanelContenttoolbar', this.expansionPanelContenttoolbar);

    this.items.forEach((item) => {
      item.group = this.uuid;
      this.componentLoaderService.parseData(item, this.expansionpanelcontent);
    });

    this.footer.forEach((item) => {
      item.group = this.uuid;
      if (item.ctype === "button") {
        item.parentuuid = this.UUID;
      }
      if (item.ctype === "iconbutton") {
        item.parentuuid = this.UUID;
      }
      this.componentLoaderService.parseData(item, this.expansionpanelfooter);
      if (item.name) {
        item.group.addControl(
          item.name,
          new FormControl(null)
        );
      }
    });

    this.toolBarItems.map((eachItem, index) => {
      this.componentLoaderService.parseData(eachItem, this.expansionPanelContenttoolbar);
    })
    this.panelOpenState = false;

  }
  dele(id: any) {
    id.target.closest('mat-accordion').remove();

  }

  ngAfterViewInit() {
    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      const afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[3]);
      if (afterInitHooks !== undefined && afterInitHooks.length > 0) {
        this.hookService.handleHook(afterInitHooks, this);
      }
    }
  }
  addControls(currentRightSideItem) {
    let ScreenMenuObj = this.contextService.getDataByKey("ScreenMenuObj");
    currentRightSideItem.items.forEach((item) => {
      if (item.name !== undefined) {
        this.uuid.addControl(
          item.name,
          new FormControl(item.value)
        );
      }
      if (ScreenMenuObj && ScreenMenuObj.completed) {
        item["disabled"] = true;
      }
      if (item.items != undefined && item.items.length > 0) {
        this.addControls(item);
      }
    })
  }

}