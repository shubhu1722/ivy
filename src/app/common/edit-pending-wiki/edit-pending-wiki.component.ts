import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { forkJoin, Subscription } from 'rxjs';
import { ActionService } from '../../services/action/action.service';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { WikiAdminService } from '../../services/commonServices/wikiService/wiki-admin.service';
import { WikiService } from '../../services/commonServices/wikiService/wiki.service';
import { UtilityService } from '../../utilities/utility.service';
import { WikiRichtextComponent } from '../wiki-richtext/wiki-richtext.component';

@Component({
  selector: 'app-edit-pending-wiki',
  templateUrl: './edit-pending-wiki.component.html',
  styleUrls: ['./edit-pending-wiki.component.scss']
})
export class EditPendingWikiComponent implements OnInit {


  @Input() labelClass: string;
  @Input() label: string;
  @Input() hidden: boolean;
  @Input() editPendingWiki: any;
  @Input() isWikiDraft:any;
  @Input() isWikiAdmin:boolean;
  @Output() cancelWiki:any = new EventEmitter<any>();
  // @Input() isWikiAdmin:boolean;
  @ViewChild('tinyEditorData') myChild: WikiRichtextComponent;

  htmlContent:any;
  locationData = [];
  clientData = [];
  contractData = [];
  workCenterData = [];
  selectedLocation = [];
  selectedClient = [];
  selectedContract = [];
  selectedWorkCenter = [];
  selectedFamily = [];
  selectedPlatform = [];
  selectedModel = [];
  selectedCommodity = [];
  selectedDefect1 = [];
  selectedDefect2 = [];
  selectedDefect3 = [];
  selectedExp = [];
  selectedTypeInstr = [];
  selectedInstrLang = [];
  UnitDetails:any
  selectedTitle;
  editRichTextData
  spData: any;
  wcData = [];
  familyData = [];
  platformData = [];
  modelNumberData = [];
  commodityData = [];
  timeInData = [];
  wikidata: any;
  defectCodeByGruopData: [];
  defectCodeData = [];
  defectLevelData = [];
  defectCodeData2 = [];
  defectLevelData2 = [];
  defectCodeData3 = [];
  defectLevelData3 = [];
  wikiUserData = [];
  expLevel = [];
  wikiContextData = [];
  wikiUnitDetailsData = [];
  context = true;
  matchingInstructions = false;
  isWikiDraftAdmin=false;
  similarInstrLabel=false;
  textEditor = false;
  loadFromData = [
    { value: "Manual", viewValue: 'Manual' },
    { value: "API", viewValue: 'API' }
  ];
  typeOfInstData = [
    { value: "Repair Tip", viewValue: 'Repair Tip' },
    { value: "Work Instruction", viewValue: 'Work Instruction' },
    { value: "ECO", viewValue: 'ECO' }
  ];
  instrLangData = [
    { value: "English - EN", viewValue: 'English - EN' },
    { value: "Hungarian - HU", viewValue: 'Hungarian - HU' },
    { value: "Ukrainian - UK", viewValue: 'Ukrainian - UK' },
    { value: "Polish - PL", viewValue: 'Polish - PL' },
    { value: "Russian - RU", viewValue: 'Russian - RU' },
    { value: "Malay - MS", viewValue: 'Malay - MS' },
    { value: "Chinese - ZH", viewValue: 'Chinese - ZH' },
    { value: "French - FR", viewValue: 'French - FR' },
    { value: "German - DE", viewValue: 'German - DE' }
  ];
  adminHtmlContent:any;
  isEditWiki: boolean;
  editingWikiId: any;
  wikiSubscribe: Subscription;
  wikiUserSubscribe: Subscription;
  editWikiSubscribe: Subscription;
  wikiContextSubscribe: Subscription;
  loginUserName: any;
  workCenterDisplayKey: string;
  userloginLocationId: any;
  DraftDetails:any;
  discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
  currentUserName = this.contextService.getDataByKey("userAccountInfo")
  instrSelected: boolean;
  langSelected: boolean;
  breadCrumbData: { 
    location: string; 
    client: string; 
    contract: string; 
    workCenter: string; 
    family: string; 
    platform: string; 
    modelPart: string; 
    commodity: string; 
    defect: string; 
  }

  unitFamilyData: any[];
  unitPlatformData: any[];
  unitModelNameData: any[];
  unitCommodityData: any[];
  step = 0;
  duplicateWikisList: any[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  isWikiSaveDraftDisplay:boolean
  confirm: boolean = true;
  changeCheck(event){
    this.confirm = !event.checked;
  }

  constructor(
    private wikiService: WikiService, 
    private contextService: ContextService, 
    private _changeDetectionRef: ChangeDetectorRef,
    private wikiadminService:WikiAdminService,
    private actionService:ActionService, 
    private utilityService: UtilityService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.wikiUserSubscribe = this.wikiService.getWikiUserDetailsData().subscribe((data: any) => {
      this.expLevel = [data.data];
    });
    if (this.editPendingWiki && this.editPendingWiki[0]) {
      this.adminHtmlContent = this.editPendingWiki[0].wikiData;
      this.selectedTitle = this.editPendingWiki[0].Title;
      this.selectedLocation.push(this.editPendingWiki[0].locationId)
      this.selectedClient.push(this.editPendingWiki[0].clientId)
      this.selectedContract.push(this.editPendingWiki[0].contractId)
      this.selectedWorkCenter.push(this.editPendingWiki[0].workCenterId)
      this.selectedFamily.push(this.editPendingWiki[0].Family)
      this.selectedPlatform.push(this.editPendingWiki[0].Platform)
      this.selectedModel.push(this.editPendingWiki[0].modelPart)
      this.selectedCommodity.push(this.editPendingWiki[0].commodity)
      this.selectedExp.push(this.editPendingWiki[0].EXP)
      this.selectedTypeInstr.push(this.editPendingWiki[0].instructionType)
      this.selectedInstrLang.push(this.editPendingWiki[0].Language)
      let defectList = this.editPendingWiki[0].defect.split('|');
      if (defectList) {
        this.selectedDefect1.push(defectList[0]);
        this.selectedDefect2.push(defectList[1]);
        this.selectedDefect3.push(defectList[2]);
      }
      const loginDetails = this.contextService.getDataByString("#userAccountInfo");
      this.workCenterData = loginDetails.WorkCenterDetails.filter(item => loginDetails.PersonalDetails.DEFAULT_LOCATION_ID === item.LOCATION_ID);
    } 
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    this.loginUserName = userName;
  }

  ngAfterViewInit(){
    if(this.isWikiDraft){
      let index = this.contextService.getDataByKey("clickedRowIndex");  
      this.DraftDetails = this.contextService.getDataByKey("dellCarWikiDraftClickedRecord");    
      let saveDraftData=[];
      this.wikiService.getMyDraftJsonReponseData().subscribe((saveDraftdata: any) => {
        saveDraftData=saveDraftdata.data[index].jsonResponseData;
        saveDraftdata.data[index] && saveDraftdata.data[index].jsonResponseData.length && saveDraftdata.data[index].jsonResponseData.map((data) => {
          
          
          if (data.UnitInfo) {
            this.contextService.addToContext("repairUnitInfo",data.UnitInfo);
            this.UnitDetails=data.UnitInfo
          }
          if(data.workCenterData){
            this.workCenterData=data.workCenterData;
          } 
          
          if (this.wikiContextForm.controls[data.name]) {
            this.wikiContextForm.controls[data.name].patchValue(data.value)
            if(data.name=="wikiWorkCenter" && data.value.length!==0 ){
              if(data.value[0].WORKCENTER){
                this.wikiContextForm.controls[data.name].patchValue([data.value[0].WORKCENTER])
              }else{
                this.wikiContextForm.controls[data.name].patchValue(data.value)
              }
              
            }
          } else if (this.wikiTextEditorForm.controls[data.name] && data.value) {
            if(data.name=="typeOfInstData"){
              this.instrSelected=data.name=="typeOfInstData" ? true : false;
            }
            if(data.name=="instrLangData"){
            this.langSelected=data.name=="instrLangData" ? true : false;
            }
            this.wikiTextEditorForm.controls[data.name].patchValue(data.value);
          }else{
          if(data.name=="saveDraftState" && data.value=="textEditor"){
            this.textEditor=true;
            this.wikiDateTime=this.DraftDetails.Date;
            this.context=false;
          }
          }
          if(data.name=="isWikiDraftAdmin" &&  data.value){
            this.isWikiDraftAdmin=true
          }
           if(data.name=="wikiTinymce"){
            this.htmlContent=data.value
           }
        })       
        this.workCenterSelect()
        this.handleBreadCrumbDataFormation();
      })
     
    }
  }

  typeInstrSelect() {
    this.instrSelected = true;
  }

  typeInstrDeSelect() {
    this.instrSelected = false;
  }

  matchingNext() {
    this.matchingInstructions = false;
    this.textEditor = true;
  }

  langSelect() {
    this.langSelected = true;
  }

  langDeSelect() {
    this.langSelected = false;
  }

  getSettings(label = 'viewValue', id = 'value') {
    return {
      singleSelection: false,
      idField: id,
      textField: label,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      allowSearchFilter: true
    }
  }

  wcSettings(label = 'viewValue', id = 'value') {
    return {
      singleSelection: true,
      idField: id,
      textField: label,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      allowSearchFilter: true
    }
  }
  
  setUnitDetails() {
    forkJoin([this.wikiService.getWikiContextData(), this.wikiService.getUnitDetailsData()]).subscribe((responseList: any) => {
      const ContextData = responseList[0]['data'];
      const UnitDetailsData = responseList[1]['data'];
      let locationName="";
      let clientName =this.wikiContextForm.value.wikiClient[0].CLIENT_NAME ?this.wikiContextForm.value.wikiClient[0].CLIENT_NAME : this.wikiContextForm.value.wikiClient[0];
      let contractName=this.wikiContextForm.value.wikiContract[0].CONTRACT_NAME ?this.wikiContextForm.value.wikiClient[0].CONTRACT_NAME : this.wikiContextForm.value.wikiContract[0];
      if(this.wikiContextForm.value.wikiLocation[0].LOCATION_NAME === "Bydgoszcz" || this.wikiContextForm.value.wikiLocation[0]==="Bydgoszcz") {
        locationName = "BYD";
      }
      ContextData.O_FAMILY_CURSOR = ContextData.O_FAMILY_CURSOR.filter(item => (item.locationCode === locationName && item.clientCode === clientName && item.contractCode === contractName));
      ContextData.O_PLATFORM_CURSOR = ContextData.O_PLATFORM_CURSOR.filter(item => (item.locationCode === locationName && clientName && item.contractCode === contractName));
      ContextData.O_MODEL_CURSOR = ContextData.O_MODEL_CURSOR.filter(item => (item.locationCode === locationName && item.clientCode === clientName && item.contractCode === contractName));
      ContextData.O_COMMODITY_CURSOR = ContextData.O_COMMODITY_CURSOR.filter(item => (item.locationCode === locationName && item.clientCode === clientName && item.contractCode === contractName));
      let familyList = [];
      let platformList = [];
      let modelNameList = [];
      let commodityList = [];
      ContextData.O_FAMILY_CURSOR.map(item => {
        const findData = UnitDetailsData.O_FAMILY_CURSOR.filter(item2 => item.componentName === item2.partNo);
        familyList = findData.map((subItem: any) => {
          return { ...subItem, name: subItem.platformName };
        });
      });
      this.unitFamilyData = familyList;
      ContextData.O_PLATFORM_CURSOR.map(item => {
        const findData = UnitDetailsData.O_PLATFORM_CURSOR.filter(item2 => item.componentName === item2.partNo);
        platformList = findData.map((subItem) => {
          return { ...subItem, name: subItem.platformName }
        });
      });
      this.unitPlatformData = platformList;
      ContextData.O_MODEL_CURSOR.map(item => {
        const findData = UnitDetailsData.O_MODEL_CURSOR.filter(item2 => item.componentName === item2.partNo);
        modelNameList = findData.map((subItem) => {
          return { ...subItem, name: subItem.platformName }
        });
      });
      this.unitModelNameData = modelNameList;
      ContextData.O_COMMODITY_CURSOR.map(item => {
        const findData = UnitDetailsData.O_COMMODITY_CURSOR.filter(item2 => item.componentName === item2.partNo);
        commodityList = findData.map((subItem) => {
          return { ...subItem, name: subItem.platformName }
        });
      });
      this.unitCommodityData = commodityList;
    });
  }

  workCenterSelect() {
    this.setUnitDetails();

    let detailsWC = {
      LOCATION_ID: this.wikiContextForm.value.wikiLocation[0].LOCATION_ID,
      CLIENT_ID: this.wikiContextForm.value.wikiClient[0].CLIENT_ID,
      CONTRACT_ID : this.wikiContextForm.value.wikiContract[0].CONTRACT_ID
    }
    this.wikiService.getAdminDefectCodeData(detailsWC).subscribe((data: any) => {
      this.defectCodeData = data.data;
      this.defectCodeData2 = data.data;
      this.defectCodeData3 = data.data;
    });
  }

  aboutGetSettings(label = 'viewValue', id = 'value') {
    return {
      singleSelection: false,
      idField: id,
      textField: label,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      allowSearchFilter: false
    }
  }

  ngOnDestroy() {
  }

  renderTinyMce(event){
    this.editRichTextData = event.value;
    this.htmlContent = event.value;
  }

  
unitDeailsMandatoryCheck() {
    return !(this.wikiContextForm.value.wikiFamily.length || this.wikiContextForm.value.wikiPlatform.length || this.wikiContextForm.value.wikiModelNumber.length || this.wikiContextForm.value.wikiCommodity.length);
  }

  defectMandatoryCheck() {
    return !(this.wikiContextForm.value.defectLevelData.length || this.wikiContextForm.value.defectLevelData2.length || this.wikiContextForm.value.defectLevelData.length);
  }

  updateEditWiki(){
    this.wikiService.getPendingWikiStatus(this.editPendingWiki[0],this.editRichTextData).subscribe((wikiResult: any) => {
      this._snackBar.open('Wiki Updated Successfully', 'OK', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000,
        panelClass: ['custom-success']
      });
      this.cancelWiki.emit(false);
    })
  }
 


  wikiContextForm = new FormGroup({
    wikiTitle: new FormControl('', Validators.required),
    wikiLocation: new FormControl('', Validators.required),
    wikiClient: new FormControl('', Validators.required),
    wikiContract: new FormControl('', Validators.required),
    wikiWorkCenter: new FormControl(''),
    wikiAdminWorkCenter: new FormControl(''),
    wikiFamily: new FormControl(''),
    wikiPlatform: new FormControl(''),
    wikiModelNumber: new FormControl(''),
    wikiCommodity: new FormControl(''),
    defectLevelData: new FormControl(''),
    defectLevelData2: new FormControl(''),
    defectLevelData3: new FormControl(''),
    
  })
  
  wikiTextEditorForm = new FormGroup({
    loadFromData: new FormControl(''),
    levelOfExpData: new FormControl(''),
    typeOfInstData: new FormControl('', Validators.required),
    instrLangData: new FormControl('', Validators.required)
  })
  
  addWikiFormData: any;

  saveData() {
    let locationStr = "";
    let clientStr = "";
    let contractStr = "";
    let workCenterStr = "";
    let platformStr = "";
    let familyStr = "";
    let modelNameStr = "";
    let commodityStr = "";
    let defectStr = "";
    let defect2Str = "";
    let defect3Str = "";
    let experienceStr = "";
    let instrLangStr = "";
    let instructTypeStr = "";
    if(this.wikiContextForm.value.wikiLocation && this.wikiContextForm.value.wikiLocation.length) {
      this.wikiContextForm.value.wikiLocation.map(item => {
        locationStr =  item.LOCATION_NAME;
        return locationStr;
      })
    }
    if(this.wikiContextForm.value.wikiClient && this.wikiContextForm.value.wikiClient.length) {
      this.wikiContextForm.value.wikiClient.map(item => {
        clientStr =  item.CLIENT_NAME;
        return clientStr;
      })
    }
    if(this.wikiContextForm.value.wikiContract && this.wikiContextForm.value.wikiContract.length) {
      this.wikiContextForm.value.wikiContract.map(item => {
        contractStr =  item.CONTRACT_NAME;
        return contractStr;
      })
    }
    if(this.wikiContextForm.value.wikiAdminWorkCenter && this.wikiContextForm.value.wikiAdminWorkCenter.length) {
      this.wikiContextForm.value.wikiAdminWorkCenter.map(item => {
        workCenterStr = (workCenterStr == "") ? item.WORKCENTER_NAME : workCenterStr + "|" + item.WORKCENTER_NAME;
        return workCenterStr;
      })
    }
    if(this.wikiContextForm.value.wikiPlatform && this.wikiContextForm.value.wikiPlatform.length) {
      this.wikiContextForm.value.wikiPlatform.map(item => {
        platformStr = (platformStr == "") ? item.name : platformStr + "|" + item.name;
        return platformStr;
      })
    }
    if(this.wikiContextForm.value.wikiFamily && this.wikiContextForm.value.wikiFamily.length) {
      this.wikiContextForm.value.wikiFamily.map(item => {
        familyStr = (familyStr == "") ? item.name : familyStr + "|" + item.name;
        return familyStr;
      })
    }
    if(this.wikiContextForm.value.wikiModelNumber && this.wikiContextForm.value.wikiModelNumber.length) {
      this.wikiContextForm.value.wikiModelNumber.map(item => {
        modelNameStr = (modelNameStr == "") ? item.name : modelNameStr + "|" + item.name;
        return modelNameStr;
      })
    }
    if(this.wikiContextForm.value.wikiCommodity && this.wikiContextForm.value.wikiCommodity.length) {
      this.wikiContextForm.value.wikiCommodity.map(item => {
        commodityStr = (commodityStr == "") ? item.name : commodityStr + "|" + item.name;
        return commodityStr;
      })
    }
    if(this.wikiContextForm.value.defectLevelData && this.wikiContextForm.value.defectLevelData.length) {
      this.wikiContextForm.value.defectLevelData.map(item => {
        defectStr = (defectStr == "") ? "L1-" + item.description : defectStr + ";" + item.description;
        return defectStr;
      })
    };
    if(this.wikiContextForm.value.defectLevelData2 && this.wikiContextForm.value.defectLevelData2.length) {
      this.wikiContextForm.value.defectLevelData2.map(item => {
        defect2Str = (defect2Str == "") ? "L2-" + item.description : defect2Str + ";" + item.description;
        return defect2Str;
      })
    };
    if(this.wikiContextForm.value.defectLevelData3 && this.wikiContextForm.value.defectLevelData3.length) {
      this.wikiContextForm.value.defectLevelData3.map(item => {
        defect3Str = (defect3Str == "") ? "L3-" + item.description : defect3Str + ";" + item.description;
        return defect3Str;
      })
    }
    if(this.wikiTextEditorForm.value.levelOfExpData && this.wikiTextEditorForm.value.levelOfExpData.length) {
    this.wikiTextEditorForm.value.levelOfExpData.map(item => {
      experienceStr = item.employee_level;
      return experienceStr;
    })
  }
  if(this.wikiTextEditorForm.value.instrLangData && this.wikiTextEditorForm.value.instrLangData.length) {
    this.wikiTextEditorForm.value.instrLangData.map(item => {
      instrLangStr = item.value;
      return instrLangStr;
    })
  }
  if(this.wikiTextEditorForm.value.typeOfInstData && this.wikiTextEditorForm.value.typeOfInstData.length) {
    this.wikiTextEditorForm.value.typeOfInstData.map(item => {
      instructTypeStr = item.value;
      return instructTypeStr;
    })
  }
    
    let combineDefectStr = defectStr;
    if (defect2Str) {
      combineDefectStr = combineDefectStr + "|" + defect2Str
    }
    if (defect3Str) {
      combineDefectStr = combineDefectStr + "|" + defect3Str
    }

    let customInstruction = Object.keys(this.wikiContextForm.value).reduce((object, key) => {
      if (key !== "wikiTinymce") {
        object[key] = this.wikiContextForm.value[key]
      }
      return object
    }, {})
    let customInstruction2 = Object.keys(this.wikiTextEditorForm.value).reduce((object, key) => {
      if (key !== "wikiTinymce") {
        object[key] = this.wikiTextEditorForm.value[key]
      }
      return object
    }, {})
    customInstruction = {...customInstruction, ...customInstruction2}
    const customInstObjStr = JSON.stringify(customInstruction);

    if (this.isEditWiki) {
      const body = {
        data: this.wikiContextForm.value,
        editId: this.editingWikiId,
        isEditing: true
      }
      this.wikiService.updateWikiData(this.wikiContextForm.value).subscribe((wikiResult) => {

      })
      this.wikiService.newWiki.next(body);
    } else {
      const addwiki = {
        "wikiTitle": this.wikiContextForm.value.wikiTitle,
        "wikiData": this.myChild.wikiTinyEditorForm.controls.wikiTinymce.value,
        "locationId": locationStr,
        "clientId": clientStr,
        "contractId": contractStr,
        "workCenterId": workCenterStr,
        "family": familyStr,
        "platform": platformStr,
        "modelPart": modelNameStr,
        "commodity": commodityStr,
        "defect": combineDefectStr,
        "experience": experienceStr,
        "instructionType": instructTypeStr,
        "instructionLanguage": instrLangStr,
        "userName": this.currentUserName.PersonalDetails.USERID,
        "customInstruction": customInstObjStr,
        "imageSource": "imageSource",
        "imageAlternateText": "imageAlternateText",
        "imageWidth": "imageWidth",
        "imageHeight": "imageHeight",
        "attachmentUrl": "attachmentUrl",
        "attachmentTitle": "attachmentTitle",
        "attachmentDisplayText": "attachmentDisplayText",
        "attachmentOpen": "attachmentOpen",
        "wikiVersion": "1.1"
      }
      this.wikiService.saveWikiData(addwiki).subscribe((wikiResult: any) => {
        this.wikiadminService.deleteRowFromDraftList(this);
        if (wikiResult && wikiResult.status) {
          this._snackBar.open('Wiki Created Successfully', 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 3000,
            panelClass: ['custom-success']
          });
          this.cancel();
        }
      })
    }
  }

  cancel() {
    if(this.isWikiDraft){
      this.wikiadminService.handleDraftActions(this)
    }else{
    this.wikiService.newWiki.next(null);
    }

  }

  cancelAdmin(){
    this.cancelWiki.emit(false);
  }

  saveDraft() {
    var arr = [];
    Object.keys(this.wikiContextForm.controls).forEach((key) => {
      let obj = { "name": key, "value": this.wikiContextForm.controls[key].value }
      arr.push(obj)
    })
    Object.keys(this.wikiTextEditorForm.controls).forEach((key) => {
      let obj = { "name": key, "value": this.wikiTextEditorForm.controls[key].value }
      arr.push(obj)
    })

    if(this?.myChild?.wikiTinyEditorForm?.controls?.wikiTinymce?.value !=""){
      let obj = { "name": "wikiTinymce", "value": this?.myChild?.wikiTinyEditorForm?.controls?.wikiTinymce?.value }
      arr.push(obj)
    }

    let partNo = this.contextService.getDataByString("#repairUnitInfo.PART_NO");
    const UNitInfo = this.contextService.getDataByString("#repairUnitInfo");
    const workCenterData = this.workCenterData;
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    let saveDraftState = "";
    if (this.textEditor) {
      saveDraftState = "textEditor"
    } else if (this.matchingInstructions) {
      saveDraftState = "matchingInstructions"
    } else if (this.context) {
      saveDraftState = "context"
    }
    if(partNo==undefined){
      let modelNameStr="";
      partNo = this.wikiContextForm.value.wikiModelNumber && this.wikiContextForm.value.wikiModelNumber.length && this.wikiContextForm.value.wikiModelNumber.map(item => {
        modelNameStr = (modelNameStr == "") ? item.name : modelNameStr + "|" + item.name;
        return modelNameStr;
      })
    }
    
    arr.push({ "partNo": partNo},{ "name": "partNo", "value":partNo},{ "name": "saveDraftState", "value":saveDraftState},{"saveDraftState": saveDraftState },{ "name": "wikiDateTime", "value":this.wikiDateTime},{ "name": "userName", "value":userName},{"UnitInfo":UNitInfo},{"workCenterData":this.workCenterData},{ "name": "isWikiDraftAdmin", "value": this.isWikiDraftAdmin })

    this.wikiService.saveWikiSaveDraft(arr).subscribe((response: any) => {
      if(response && response.status) {
        this.wikiadminService.handleDraftActions(this);
        this._snackBar.open('Wiki Drafted Successfully', 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 1000,
          panelClass: ['custom-success']
        });
      } 
    })
    
  }

  getTimeInDetails() {
    let today = new Date();
    let date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes();
    let dateTime = date + ' - ' + time;
    return dateTime;
  }

  wikiDateTime = this.getTimeInDetails();

  handleBreadCrumbDataFormation(){
    let locationStr = "";
    let clientStr = "";
    let contractStr = "";
    let workCenterStr = "";
    let platformStr = "";
    let familyStr = "";
    let modelNameStr = "";
    let commodityStr = "";
    let defectStr = "";
    let defect2Str = "";
    let defect3Str = "";
    const locationData = this.wikiContextForm.value.wikiLocation&&this.wikiContextForm.value.wikiLocation.map(item => {
      if(item.LOCATION_NAME==undefined){
        locationStr=item
      }else{
        locationStr =  item.LOCATION_NAME;
      }
      return locationStr;
    })
    const clienttData = this.wikiContextForm.value.wikiClient&&this.wikiContextForm.value.wikiClient.map(item => {
      if(item.CLIENT_NAME==undefined){
        clientStr=item
      }else{
        clientStr =  item.CLIENT_NAME;
      }
      return clientStr;
    })
    const contractData = this.wikiContextForm.value.wikiContract&&this.wikiContextForm.value.wikiContract.map(item => {
      if(item.CONTRACT_NAME==undefined){
        contractStr=item
      }else{
        contractStr =  item.CONTRACT_NAME;
      }
      // contractStr =  item.CONTRACT_NAME;
      return contractStr;
    })
    let adminWCenterData = this.wikiContextForm.value.wikiAdminWorkCenter&&this.wikiContextForm.value.wikiAdminWorkCenter.map(item => {
      if(item.WORKCENTER_NAME==undefined){
        workCenterStr=item
      }else{
        workCenterStr = (workCenterStr == "") ? item.WORKCENTER_NAME : workCenterStr + "|" + item.WORKCENTER_NAME;
      }
     
      return workCenterStr;
    })
    let wCenterData = this.wikiContextForm.value.wikiWorkCenter&&this.wikiContextForm.value.wikiWorkCenter.map(item => {
      if(item.WORKCENTER_NAME==undefined){
        workCenterStr=item
      }else{
        workCenterStr = (workCenterStr == "") ? item.WORKCENTER_NAME : workCenterStr + "|" + item.WORKCENTER_NAME;
      }
    })
    if(this.wikiContextForm.value.wikiPlatform && this.wikiContextForm.value.wikiPlatform.length) {
      this.wikiContextForm.value.wikiPlatform.map(item => {
        platformStr = (platformStr == "") ? item.name : platformStr + "|" + item.name;
        return platformStr;
      })
    }
    if(this.wikiContextForm.value.wikiFamily && this.wikiContextForm.value.wikiFamily.length) {
      this.wikiContextForm.value.wikiFamily.map(item => {
        familyStr = (familyStr == "") ? item.name : familyStr + "|" + item.name;
        return familyStr;
      })
    }    
    if(this.wikiContextForm.value.wikiModelNumber && this.wikiContextForm.value.wikiModelNumber.length) {
      this.wikiContextForm.value.wikiModelNumber.map(item => {
        modelNameStr = (modelNameStr == "") ? item.name : modelNameStr + "|" + item.name;
          return modelNameStr;
      })
    }
    if(this.wikiContextForm.value.wikiCommodity && this.wikiContextForm.value.wikiCommodity.length) {
      this.wikiContextForm.value.wikiCommodity.map(item => {
        commodityStr = (commodityStr == "") ? item.name : commodityStr + "|" + item.name;
        return commodityStr;
      })
    }
    if(this.wikiContextForm.value.defectLevelData && this.wikiContextForm.value.defectLevelData.length) {
      this.wikiContextForm.value.defectLevelData.map(item => {
        defectStr = (defectStr == "") ? "L1-" + item.name : defectStr + ";" + item.name;
        return defectStr;
      });
    }
    if(this.wikiContextForm.value.defectLevelData2 && this.wikiContextForm.value.defectLevelData2.length) {
      this.wikiContextForm.value.defectLevelData2.map(item => {
        defect2Str = (defect2Str == "") ? "L2-" + item.name : defect2Str + ";" + item.name;
        return defect2Str;
      });
    }
    if(this.wikiContextForm.value.defectLevelData3 && this.wikiContextForm.value.defectLevelData3.length) {
      this.wikiContextForm.value.defectLevelData3.map(item => {
        defect3Str = (defect3Str == "") ? "L3-" + item.name : defect3Str + ";" + item.name;
        return defect3Str;
      })
    }
    let combineDefectStr = defectStr;
    if (defect2Str) {
      combineDefectStr = combineDefectStr + "|" + defect2Str
    }
    if (defect3Str) {
      combineDefectStr = combineDefectStr + "|" + defect3Str
    }
    const addwiki = {
      "location": locationStr,
      "client": clientStr,
      "contract": contractStr,
      "workCenter": workCenterStr,
      "family": familyStr,
      "platform": platformStr,
      "modelPart": modelNameStr,
      "commodity": commodityStr,
      "defect": combineDefectStr
    }
    this.breadCrumbData = addwiki;
   
  }

  contextNext() {
    this.context = false;
    let platformStr = "";
    let familyStr = "";
    let modelNameStr = "";
    let commodityStr = "";
    let defectStr = "";
    let defect2Str = "";
    let defect3Str = "";
    let locationStr = "";
    let clientStr = "";
    let contractStr = "";
    let workCenterStr = "";
    const locationData = this.wikiContextForm.value.wikiLocation&&this.wikiContextForm.value.wikiLocation.map(item => {
      if(item.LOCATION_NAME==undefined){
        locationStr=item
      }else{
        locationStr =  item.LOCATION_NAME;
      }
      return locationStr;
    })
    const clienttData = this.wikiContextForm.value.wikiClient&&this.wikiContextForm.value.wikiClient.map(item => {
      if(item.CLIENT_NAME==undefined){
        clientStr=item
      }else{
        clientStr =  item.CLIENT_NAME;
      }
      return clientStr;
    })
    const contractData = this.wikiContextForm.value.wikiContract&&this.wikiContextForm.value.wikiContract.map(item => {
      if(item.CONTRACT_NAME==undefined){
        contractStr=item
      }else{
        contractStr =  item.CONTRACT_NAME;
      }
      // contractStr =  item.CONTRACT_NAME;
      return contractStr;
    })
    let adminWCenterData = this.wikiContextForm.value.wikiAdminWorkCenter&&this.wikiContextForm.value.wikiAdminWorkCenter.map(item => {
      if(item.WORKCENTER_NAME==undefined){
        workCenterStr=item
      }else{
        workCenterStr = (workCenterStr == "") ? item.WORKCENTER_NAME : workCenterStr + "|" + item.WORKCENTER_NAME;
      }
     
      return workCenterStr;
    })
    let wCenterData = this.wikiContextForm.value.wikiWorkCenter&&this.wikiContextForm.value.wikiWorkCenter.map(item => {
      if(item.WORKCENTER_NAME==undefined){
        workCenterStr=item
      }else{
        workCenterStr = (workCenterStr == "") ? item.WORKCENTER_NAME : workCenterStr + "|" + item.WORKCENTER_NAME;
      }
    })
    if(this.wikiContextForm.value.wikiPlatform && this.wikiContextForm.value.wikiPlatform.length) {
      this.wikiContextForm.value.wikiPlatform.map(item => {
        platformStr = (platformStr == "") ? item.name : platformStr + "|" + item.name;
        return platformStr;
      })
    }
    if(this.wikiContextForm.value.wikiFamily && this.wikiContextForm.value.wikiFamily.length) {
      this.wikiContextForm.value.wikiFamily.map(item => {
        familyStr = (familyStr == "") ? item.name : familyStr + "|" + item.name;
        return familyStr;
      })
    }    
    if(this.wikiContextForm.value.wikiModelNumber && this.wikiContextForm.value.wikiModelNumber.length) {
      this.wikiContextForm.value.wikiModelNumber.map(item => {
        modelNameStr = (modelNameStr == "") ? item.name : modelNameStr + "|" + item.name;
          return modelNameStr;
      })
    }
    if(this.wikiContextForm.value.wikiCommodity && this.wikiContextForm.value.wikiCommodity.length) {
      this.wikiContextForm.value.wikiCommodity.map(item => {
        commodityStr = (commodityStr == "") ? item.name : commodityStr + "|" + item.name;
        return commodityStr;
      })
    }
    if(this.wikiContextForm.value.defectLevelData && this.wikiContextForm.value.defectLevelData.length) {
      this.wikiContextForm.value.defectLevelData.map(item => {
        defectStr = (defectStr == "") ? "L1-" + item.name : defectStr + ";" + item.name;
        return defectStr;
      });
    }
    if(this.wikiContextForm.value.defectLevelData2 && this.wikiContextForm.value.defectLevelData2.length) {
      this.wikiContextForm.value.defectLevelData2.map(item => {
        defect2Str = (defect2Str == "") ? "L2-" + item.name : defect2Str + ";" + item.name;
        return defect2Str;
      });
    }
    if(this.wikiContextForm.value.defectLevelData3 && this.wikiContextForm.value.defectLevelData3.length) {
      this.wikiContextForm.value.defectLevelData3.map(item => {
        defect3Str = (defect3Str == "") ? "L3-" + item.name : defect3Str + ";" + item.name;
        return defect3Str;
      })
    }
    let combineDefectStr = defectStr;
    if (defect2Str) {
      combineDefectStr = combineDefectStr + "|" + defect2Str
    }
    if (defect3Str) {
      combineDefectStr = combineDefectStr + "|" + defect3Str
    }
    const addwiki = {
      "location": locationStr,
      "client": clientStr,
      "contract": contractStr,
      "workCenter": workCenterStr,
      "family": familyStr,
      "platform": platformStr,
      "modelPart": modelNameStr,
      "commodity": commodityStr,
      "defect": combineDefectStr
    }
    this.breadCrumbData = addwiki;
    this.wikiService.getAdminWikiData(addwiki).subscribe((res: any) => {
      if (res && res.status && res.data) {
        if (res && res.status && res.data.length === 0) {
          this.matchingInstructions = false;
          this.similarInstrLabel = false;
          this.textEditor = true;
        } else {
          this.duplicateWikisList = res.data;
          this.matchingInstructions = true;
          this.similarInstrLabel=true;
        }
      }
    });

  }

  matchingInstructLink() {
    this.textEditor = false;
    this.matchingInstructions = true;
  }

  contextLink() {
    this.textEditor = false;
    this.matchingInstructions = false;
    this.context = true;
  }

}