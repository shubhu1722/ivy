import { Component, Output, EventEmitter, Input, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { MetadataService } from 'src/app/services/commonServices/metadataService/metadata.service';
import { FormGroup } from '@angular/forms';
import { ContextActionService } from 'src/app/services/commonServices/contextActionService/context-action.service';
import { ComponentService } from 'src/app/services/commonServices/componentService/component.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { ActionService } from 'src/app/services/action/action.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ButtonComponent implements OnInit, AfterViewInit {
  eventMap = ['click'];
  hookMap = ['beforeInit', 'afterInit', 'beforeAction', 'afterAction'];

  footerenable: any;
  footerenableonchanges: any;
  //nothiddenfooterbuttons: any = [];
  @Input() disableRipple: boolean;
  @Input() color: string;
  @Input() isIconButton: boolean;
  @Input() isRoundButton: boolean;
  @Input() ripple: string;
  @Input() type: string;
  @Input() name: string;
  @Input() disabled: boolean;
  @Input() submitable: boolean;
  @Input() visibility: boolean;
  @Input() uuid: any;
  @Input() show: boolean;
  @Input() hooks: string[] = [];
  @Input() actions: string[];
  @Input() validations: string[];
  @Input() labelstyles: string;
  @Input() inputStyles: string;
  @Input() text: string;
  @Input() class: string;
  @Input() group: FormGroup = new FormGroup({});
  @Input() hidden: boolean;
  @Input() tooltip: string;
  @Input() ctype: string;
  @Input() toolTipPosition: string;
  @Input() buttonClass: string;
  @Input() dialogButton: boolean;
  @Input() closeType: string;
  @Input() disableClose: boolean;
  @Input() checkGroupValidity: boolean;
  @Input() nestedFormGroup: string;
  @Input() inputClass;
  @Input() setDisabled: any;
  @Input() isIcon: boolean;
  @Input() icon: any;
  @Input() iconClass: string;
  @Input() iconPosition: 'before' | 'after' = 'after';
  @Input() iconcss: string;
  @Input() isDisableNotReq: boolean;
  @Input() parentuuid: string;
  @Input() dialogBoxHoldBinErrorMessage: boolean;
  @Input() enableIfDirty: any;
  @Input() clickInterceptor!: (event) => void;
  @Input() footerEnableHappen: boolean = true;
  @Input() bgColor:string;
  visiblepageitems: any = [];
  beforeInitHooks: any[];
  afterInitHooks: any[];
  beforeActionHooks: any[];
  afterActionHooks: any[];

  constructor(
    private eventprocessor: EventServiceService,
    private _changeDetectionRef: ChangeDetectorRef,
    private hookService: HookService,
    private contextService: ContextService,
    private contextActionSevice: ContextActionService,
    private actionService: ActionService,
    private translate: TranslateService,
    private componentService: ComponentService,
    private utiliyService: UtilityService
  ) {
    let language = localStorage.getItem('language');
    translate.setDefaultLang(language);
    translate.use(language)
  }

  ngOnInit(): void {
    if(this.text && this.text.startsWith('#')){
      this.text = this.contextService.getDataByString(this.text);
    }
    if(this.bgColor && this.bgColor.startsWith('#')){
      this.bgColor = this.contextService.getDataByString(this.bgColor);
    }
    
    let ScreenMenuObj = this.contextService.getDataByKey("ScreenMenuObj");
    this.visibility = this.visibility !== undefined ? this.visibility : true;
    this.isIcon = this.isIcon !== undefined ? this.isIcon : false;
    /// Default tooltip position
    this.toolTipPosition = this.toolTipPosition === undefined ? 'above' : this.toolTipPosition;
    this.beforeInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[0]);
    this.afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[1]);
    this.beforeActionHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[2]);
    this.afterActionHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[3]);
    this.hookService.handleHook(this.beforeInitHooks, this);

    this.checkGroupValidity = this.checkGroupValidity === undefined ? true : this.checkGroupValidity;
    this.visibility = this.visibility !== undefined ? this.visibility : true;

    if (this.setDisabled) {
      const setDisabled = this.setDisabled;
      let data: any = this.actionService.getContextorNormalData(setDisabled.lhs, "");
      let isConditionValid = this.actionService.isConditionValid({ lhs: data, rhs: setDisabled.rhs, operation: setDisabled.operation }, this);

      if (isConditionValid) {
        this.disabled = true;
        this.checkGroupValidity = false;
      }
    }
    // if (ScreenMenuObj && ScreenMenuObj.completed) {
    //   this.disabled = true;
    // }
    if (this.checkGroupValidity !== undefined && this.checkGroupValidity) {
      this.group.valueChanges.subscribe((x) => {
        if (!this.nestedFormGroup || this.nestedFormGroup === undefined) {
          let parentuuid = this.contextService.getDataByKey(this.parentuuid + "ref"); //current taskpanel uuid
          if (this.enableIfDirty !== undefined && this.enableIfDirty) {
            if (parentuuid) {
              if ((parentuuid.instance.header.title).includes("Accessories")) {
                this.handleAccessoriesCondition(parentuuid);
              } else {
                this.disabled = this.group.valid && this.group.dirty ? false : true;
              }
            } else {
              this.disabled = this.group.valid && this.group.dirty ? false : true;
            }
          } else {
            this.disabled = this.group.status === 'VALID' ? false : true;
          }


          this._changeDetectionRef.detectChanges();
          //Edit Functionality
          // For Disabling the Page Footer Buttons on Value changes

          if (parentuuid != undefined) {
            let MendatoryFlag = parentuuid.instance.isMandatory; // for isMandatory Task only we need to disable
            if (MendatoryFlag === true) {
              let refData = this.contextService.getDataByKey("pageUUIDref"); // pageInstance
              let currentScreen = this.contextService.getDataByKey("currentWC");
              let validatetaskpanelstatus = this.contextService.getDataByKey(currentScreen+"validatetaskpanelstatus"); // used some flag so that after completing all the task panels this flag will be true
              if (validatetaskpanelstatus == true) {

                if (refData !== undefined && refData.instance && refData.instance.footer[0] && refData.instance.footer[0].items) {
                  let pagefooteritems = refData.instance.footer[0].items; //Page footer buttons
                  this.footerenableonchanges = pagefooteritems.filter(({ ctype }) => ctype == "nativeDropdown" || ctype == "button");
                  if (this.footerenableonchanges.length != 0) {
                    let pageitems = refData.instance.items; // Page Items like taskpanels,toolbars etc
                    let taskpanels = pageitems.filter(({ ctype }) => ctype == "taskPanel");
                    let visiblepageitems = [];
                    for (let i = 0; i < taskpanels.length; i++) {
                      let pageitemsstatus = this.contextService.getDataByKey(taskpanels[i].uuid + "ref");
                      if (pageitemsstatus && pageitemsstatus.instance && pageitemsstatus.instance.hidden !== true) { // filtering page items that are not hidden
                        if (pageitemsstatus.instance.isMandatory === true) { // checking isMandatory taskpanel only
                          visiblepageitems.push(taskpanels[i]);
                        }
                      }
                    }

                    if (visiblepageitems.length != 0) {
                      if (this.footerenableonchanges.length != 0) {
                        // Loop for Disabling the Page Footer Buttons Like Resultcodes,Time Out etc
                        for (let i = 0; i < this.footerenableonchanges.length; i++) {
                          let TOButton = {
                            "type": "updateComponent",
                            "config": {
                              "key": this.footerenableonchanges[i].uuid,
                              "properties": {
                                "disabled": true
                              }
                            },
                            "eventSource": "click"
                          }
                          this.componentService.handleUpdateComponent(TOButton, null, null, this.utiliyService);
                        }
                      }
                    }
                  }
                  //this.footerbuttoncheck(); // Calling this method
                }
              }
            }
          }
        }
      });
    }
  }

  handleAccessoriesCondition(parentuuid) {
    //First we need to see accesoryMatchCount , it will tell us how many accessories matched
    //Case1 : If All accessories are filled and still task is not in Completed status = Save exit happen 
    //after filling the details and before clicking on the complete button.
    //Case2: if all accessories are not filled button should be disabled.
    //Case3: if all accessories are filled and task is completed status = button disable
    let isAllAccessoriesFilled = false;
    let accesoryMatchCount = this.contextService.getDataByKey("accesoryMatchCount");
    if (accesoryMatchCount) {
      for (let i = 0; i < accesoryMatchCount; i++) {
        let accessoryValueObj = this.contextService.getDataByKey(i + "newNoUUID");
        if (accessoryValueObj) {
          if (accessoryValueObj.value != undefined && accessoryValueObj.value != "") {
            isAllAccessoriesFilled = true;
          } else {
            isAllAccessoriesFilled = false;
            break;
          }
        } else {
          break;
        }
      }
    }

    if (isAllAccessoriesFilled) {
      if (parentuuid.instance.header.statusClass == 'complete-status') {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    } else {
      this.disabled = true;
    }
  }

  ngAfterViewInit() {
    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      this.afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[1]);
      this.hookService.handleHook(this.afterInitHooks, this);
    }
  }

  onClickButton(event) {
    if (this.clickInterceptor) {
      return this.clickInterceptor(event);
    }
    //client and screen validation for saving data only save and exit else it will execute prodution code
    let isClientAndScreenValid = this.contextService.handleClientAndScreenValidation();
    let WC = this.contextService.getDataByKey("currentWC");
    if (isClientAndScreenValid) {
      this.hookService.handleHook(this.beforeActionHooks, this);
      this.eventMap.forEach((ele) => {
        if (ele === event.type) {
          this.eventprocessor.handleEvent(this, event);
          this.actions.forEach((data) => {
            let uuid = {};
             if (data["config"] && (data["config"].data == "formData"||data["config"].data == "rawFormData")) {
              Object.keys(this.group.controls).forEach((key) => {
                let text = {};
                if (key !== "undefined") {
                  let data = this.contextService.getDataByKey(key);
                  if (data && data.ctype == "radioButtonGroup") {
                    text = {
                      "name": key,
                      "ctype": data.ctype,
                      "uuid": data.uuid,
                      "isTaskDone": this.isDisableNotReq ? false : true,
                      "value": data.value,
                      "disabled": this.group.controls[key].disabled
                    }
                  }
                  else if (data) {
                    text = {
                      "name": key,
                      "ctype": data.ctype,
                      "uuid": data.uuid,
                      "isTaskDone": this.isDisableNotReq ? false : true,
                      "value": this.group.controls[key].value,
                      "disabled": this.group.controls[key].disabled 
                      }
                  }
                  let getHiddenState;
                  if(data && data.uuid && data.uuid != undefined && (data.ctype == "nativeDropdown" || data.ctype == "textField")){
                    getHiddenState = this.contextService.getDataByKey(data.uuid + "ref")
                  }
                  if (getHiddenState && getHiddenState.instance && getHiddenState.instance.hasOwnProperty('hidden')) {
                    text['hidden'] = getHiddenState.instance.hidden;
                  }
                  if(text && text.hasOwnProperty('value')){
                    this.contextService.addToContext(data.uuid, text);
                  }
                }
              })
            } else if (data["config"] && this.uuid == data["config"].key) {
              uuid = {
                "ctype": "button",
                "disabled": data["config"].properties.disabled
              }
              this.contextService.addToContext(this.uuid, uuid);
            }
          })
          if (this.text == "Next") {
            if (WC !== "HPReceiving") {
              this.contextActionSevice.clearScreenData(this.actionService, this.text);
            }
          }
        }
      });
    } else {
      this.hookService.handleHook(this.beforeActionHooks, this);
      this.eventMap.forEach((ele) => {
        if (ele === event.type) {
          this.eventprocessor.handleEvent(this, event);
        }
      });
    }
    // Checking for Edit Functionality Sub Process Button Enable
    if (this.text == "Complete" || this.text == "Done") {
      let nothiddenfooterbuttons = this.footerbuttoncheck();
      this.footerbuttonenable(nothiddenfooterbuttons);
    }
  }

  ngOnChanges() {
    if (this.name === "rupiSubmit" && !this.disabled) {
    }
  }

  footerbuttonenable(nothiddenfooterbuttons) {
    let refData = this.contextService.getDataByKey("pageUUIDref"); // pageinstance
    let currentScreenName = this.contextService.getDataByKey("currentWC");
    if (this.footerEnableHappen != false) // ResultCodes have to enable if not equal to false after Edit Functionality
    {
    if (refData !== undefined) {

      let valid = this.contextService.getDataByKey(currentScreenName+"validatetaskpanelstatus"); // based on flag
      if (valid == true) {
        let pageitems = refData.instance.items; // page items like taskpanels,toolbars,etc
        let visiblepageitems = [];

        let taskpanels = pageitems.filter(({ ctype }) => ctype == "taskPanel");
        for (let i = 0; i < taskpanels.length; i++) {
          let pageitemsstatus = this.contextService.getDataByKey(taskpanels[i].uuid + "ref");
          if (pageitemsstatus && pageitemsstatus.instance && pageitemsstatus.instance.hidden !== true) { // filtering taskpanels that are not in hidden state
            if (pageitemsstatus.instance.isMandatory === true) {// checking isMandatory TaskPanels only
              visiblepageitems.push(taskpanels[i]);
            }
          }
        }
        if (visiblepageitems.length != 0) {
          if (nothiddenfooterbuttons.length != 0) {
            let isProcessCompleted = false;
            for (let i = 0; i < visiblepageitems.length; i++) {
              let taskpanelStatus = this.contextService.getDataByKey(visiblepageitems[i].uuid + "ref");
              //if(statusref.instance.isMandatory === true){
              if (taskpanelStatus.instance.header.statusClass === "complete-status") { // based on complete status of task panels we are enabling the footer buttons
                isProcessCompleted = true;
              } else { // if complete status fails then disabling the button
                isProcessCompleted = false;
                break;
              }
            }
            if (isProcessCompleted) {
              for (let j = 0; j < nothiddenfooterbuttons.length; j++) {
                // checking if Result Codes has some value or not based on that enabling of footer button will happen
                if (nothiddenfooterbuttons[j].ctype == "nativeDropdown") {
                  let rcref = this.contextService.getDataByKey(nothiddenfooterbuttons[j].uuid + "ref");
                  rcref.instance.group.controls[nothiddenfooterbuttons[j].name].enable();//For result codes dropdown enabling
                  // if and else are for enabling and disabling of button on basis of result codes value
                  let ResultCodevalue = rcref.instance.group.value
                  let resultcodewithValue =  rcref.instance.enableWithValue; // this flag is for enabling or disabling Timeout button based on Result Code Value
                  if (ResultCodevalue[Object.keys(ResultCodevalue)[0]] !== null && resultcodewithValue != false) {
                    let TOButton = {
                      "type": "updateComponent",
                      "config": {
                        "key": nothiddenfooterbuttons[nothiddenfooterbuttons.length - 1].uuid,
                        "properties": {
                          "disabled": false
                        }
                      },
                      "eventSource": "click"
                    }
                    this.componentService.handleUpdateComponent(TOButton, null, null, this.utiliyService);
                  } else {
                    let TOButton = {
                      "type": "updateComponent",
                      "config": {
                        "key": nothiddenfooterbuttons[nothiddenfooterbuttons.length - 1].uuid,
                        "properties": {
                          "disabled": true
                        }
                      },
                      "eventSource": "click"
                    }
                    this.componentService.handleUpdateComponent(TOButton, null, null, this.utiliyService);
                    break;
                  }
                } else { // for button enable
                  let TOButton = {
                    "type": "updateComponent",
                    "config": {
                      "key": nothiddenfooterbuttons[nothiddenfooterbuttons.length - 1].uuid,
                      "properties": {
                        "disabled": false
                      }
                    },
                    "eventSource": "click"
                  }
                  this.componentService.handleUpdateComponent(TOButton, null, null, this.utiliyService);
                }
              }
            } else {
              for (let j = 0; j < nothiddenfooterbuttons.length; j++) {
                let TOButton = {
                  "type": "updateComponent",
                  "config": {
                    "key": nothiddenfooterbuttons[j].uuid,
                    "properties": {
                      "disabled": true
                    }
                  },
                  "eventSource": "click"
                }
                this.componentService.handleUpdateComponent(TOButton, null, null, this.utiliyService);

              }
            }
          }
        }
      }
    }
  }
  }

  footerbuttoncheck() {
    let refData = this.contextService.getDataByKey("pageUUIDref");
    let currentScreenName = this.contextService.getDataByKey("currentWC");
    let nothiddenfooterbuttons = []; // pageinstance
    if (refData !== undefined) {

      //console.log(this.visiblepageitems);
      let pagefooteritems = refData.instance.footer.length > 0 ? refData.instance.footer[0].items : []; // Page Footer buttons like ResultCodes, Timeout etc
      this.footerenable = pagefooteritems.filter(({ ctype }) => ctype == "nativeDropdown" || ctype == "button");
      // Looping Footer Buttons
      for (let c = 0; c < this.footerenable.length; c++) {
        let footerref = this.contextService.getDataByKey(this.footerenable[c].uuid + "ref");
        if (footerref.instance.ctype == "nativeDropdown") {
          if (footerref.instance.visibility == true) { // checking if visibility of that dropdown is true
            nothiddenfooterbuttons.push(this.footerenable[c]);
            //console.log(this.nothiddenfooterbuttons);
            if (footerref.instance.disabled == false) {
              this.contextService.addToContext(currentScreenName+'validatetaskpanelstatus', true); // flag which we are using to disable footer buttons on ngonit value changes
            }
          }
        } else {
          if (footerref.instance.hidden !== true) { // checking if hidden property of that button is not true
            nothiddenfooterbuttons.push(this.footerenable[c]);
            //console.log(this.nothiddenfooterbuttons);
            if (footerref.instance.disabled == false) {
              this.contextService.addToContext(currentScreenName+'validatetaskpanelstatus', true); // same flag as above
            }
          }

        }
        //console.log(footerref);
      }
    }
    return nothiddenfooterbuttons;
  }

  checkForValidateBin(event) {
    let holdResponseDependentsData: any;
    this.actions.forEach((element: any) => {
      holdResponseDependentsData = element.responseDependents;
    });

    if (holdResponseDependentsData.onSuccess !== undefined) {
      let onSuccessActions = holdResponseDependentsData.onSuccess.actions;
      onSuccessActions.forEach((element) => {
        this.actionService.handleAction(element, this);
      });
    }
    if (holdResponseDependentsData.onFailure !== undefined) {
      let onFailureActions = holdResponseDependentsData.onFailure.actions;
        onFailureActions&&onFailureActions.length&&onFailureActions.forEach((element) => {
        this.actionService.handleAction(element, this);
      });
    }
  }

}
