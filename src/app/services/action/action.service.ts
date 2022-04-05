import { DialogboxComponent } from './../../common/dialogbox/dialogbox.component';
import { ApplicationRef, Injectable } from '@angular/core';
import * as forge from 'node-forge';
import { ContextService } from '../commonServices/contextService/context.service';
import { TransactionService } from '../commonServices/transaction/transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MetadataService } from '../commonServices/metadataService/metadata.service';
import { ComponentLoaderService } from '../commonServices/component-loader/component-loader.service';
import { UtilityService } from '../../utilities/utility.service';
import { HttpResponse } from '@angular/common/http';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog, } from '@angular/material/dialog';
import { CustomeService } from '../commonServices/customeService/custome.service';
import { FormControl, Validators } from '@angular/forms';
import { NgxLoadingSpinnerService } from '@k-adam/ngx-loading-spinner';
import { cloneDeep } from 'lodash';
import { DatePipe } from '@angular/common';
import { MediaService } from '../../common/video-cam/media-service';
import { HpWCOperationsService } from '../hp/hpWCOperations/hp-wcoperations.service';
import { DellWCOperationsService } from '../dell/dellWCOperations/dell-wcoperations.service';
import { DellMBRService } from '../dell/dellWCOperations/dell-MBR.service';
import { ArrayOperService } from '../commonServices/arrayOperService/array-oper.service';
import { TemplateService } from '../commonServices/templateService/template.service';
import { ComponentService } from '../commonServices/componentService/component.service';
import { FormOperService } from '../commonServices/formOperService/formOper.service';
import { DataOperService } from '../commonServices/dataOperService/data-oper.service';
import { ContextActionService } from '../commonServices/contextActionService/context-action.service';
import { StringOperService } from '../commonServices/stringOperService/string-oper.service';
import { DialogService } from '../commonServices/dialogService/dialog.service';
import { CiscoIqaPreScreenService } from '../cisco/ciscoIqaPreScreenService/cisco-iqa-pre-screen.service';
import { CiscoECObookingService } from '../cisco/ciscoEcobookingService/cisco-ecobooking.service';
import { DebugService } from '../hp/debugServices/debug.service';
import { OccurenceService } from '../commonServices/occurenceService/occurence.service';
import { ReceivingVideoService } from '../commonServices/receivingVideoService/receiving-video.service';
import { QuoteResponseService } from '../hp/quoteResponseService/quote-response.service';
import { RepairReworkService } from '../hp/repairReworkService/repair-rework.service';
import { ComponentViewService } from '../commonServices/componentViewService/component-view.service';
import { ButtonActionsService } from '../commonServices/buttonActionsService/button-actions.service';
import { ErrorHandlingService } from '../commonServices/errorHandlingService/error-handling.service';
import { ValidationalService } from '../commonServices/validationalService/validational.service';
import { MicroService } from '../commonServices/microservice/micro.service';
import { VFTService } from '../hp/VFTService/vft.service';
import { CiscoDebugService } from '../cisco/ciscoDebugService/cisco-debug.service';
import { ConfigDebugService } from '../cisco/configDebugService/config-debug.service';
import { CiscoWcoperationsService } from '../cisco/ciscoWCOperations/cisco-wcoperations.service';
import { CiscoTCPrepService } from '../cisco/ciscoTCPrepService/cisco-tcprep.service';
import { PackingService } from '../hp/packingService/packing.service';
import { CiscoReworkService } from '../cisco/ciscoReworkService/cisco-rework.service';
import { ETravellerService } from '../commonServices/eTraveller/etraveller.service';
import { DellDebugService } from '../dell/dell-debug.service';
import { DellReceivingService } from '../dell/dellReceiving/dell-receiving.service';
import { HoustonWCOperationService } from '../cisco/houstnWCOperation/houston-wcoperation.service';
import { DellReworkService } from '../dell/dellRework/dell-rework.service';
import { DellShippingService } from '../dell/dellShipping/dell-shipping.service';
import { DellEstimateService } from '../dell/dellEstimate/dell-estimate.service';
import { DellCarReceivingService } from '../dellCar/dellCarReceiving/dell-car-receiving.service';
import { VerifoneSeachServiceService } from '../verifone/verifoneSearch/verifone-seach-service.service';
import { BatchprocessService } from '../verifone/batchProcess/batchprocess.service';
import { CheckAccessoriesService } from '../dell/checkAccessories/check-accessories.service';
import { DellPredictiveService } from '../dell/dellPredictive/dell-predictive.service';
import { VerifoneMegalabelService } from '../verifone/megalabel/verifone-megalabel.service';

import { DellCarWCOperationsService } from '../dellCar/dellCarWCOperations/dellcar-wcoperations.service';
import { DellCarPackoutService } from "../dellCar/dellCarPackout/dell-car-packout.service"
import { DellCarPackoutshippingService } from '../dellCar/dellCarReceiving/dell-car-packoutshipping.service';
import { OleMyUnitServiceService } from '../commonServices/oleMyUnitService/ole-my-unit-service.service';
import { VerifoneReceivingServiceService } from '../verifone/verifoneReceiving/verifone-receiving-service.service';
import {DellCarPredictiveService} from "../dellCar/dellCarPredictive/dell-car-predictive.service";
import {DellCarDebugService} from "../dellCar/dellCarDebug/dell-car-debug.service";
import { VerifoneService } from '../verifone/verifone-WC/verifone.service';
import { DellDebugPrService } from '../dell/dellPredictive/dell-debug-pr.service';
import { DellCarAssessmentService } from '../dellCar/dellCarAssessment/dell-car-assessment.service';
import { WikiAdminService } from '../commonServices/wikiService/wiki-admin.service';
import { PrimaryFaultService } from '../commonServices/primaryFault-table-service/primary-fault-service.service'
import { PaPopupService } from '../commonServices/pa-popup-service/pa-popup.service';
import { DuplicatePartPopupService } from '../commonServices/duplicatePopupService/duplicate-part-popup.service';
@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private matsidenav: MatDrawer;
  private customTempArray = [];

  constructor(
    private contextService: ContextService,
    private transactionService: TransactionService,
    private _snackBar: MatSnackBar,
    private metadataService: MetadataService,
    private componentLoaderService: ComponentLoaderService,
    private utilityService: UtilityService,
    private ref: ApplicationRef,
    public dialog: MatDialog,
    private custome: CustomeService,
    private spinner: NgxLoadingSpinnerService,
    private datePipe: DatePipe,
    private mediaService: MediaService,
    private hpWcOperationsService: HpWCOperationsService,
    private dellWcOperationsService: DellWCOperationsService,
    private dellMBRService: DellMBRService,
    private arrayOperService: ArrayOperService,
    private templateService: TemplateService,
    private componentService: ComponentService,
    private formOperService: FormOperService,
    private dataOperservice: DataOperService,
    private contextActionSevice: ContextActionService,
    private stringOperService: StringOperService,
    private dialogService: DialogService,
    private ciscoIqaPreScreenService: CiscoIqaPreScreenService,
    private ciscoECObookingService: CiscoECObookingService,
    private debugService: DebugService,
    private occurenceService: OccurenceService,
    private receivingVideoService: ReceivingVideoService,
    private quoteResponseService: QuoteResponseService,
    private repairReworkService: RepairReworkService,
    private componentViewService: ComponentViewService,
    private buttonActionsService: ButtonActionsService,
    private errorHandlingService: ErrorHandlingService,
    private validationalService: ValidationalService,
    private microService: MicroService,
    private vFTService: VFTService,
    private ciscoDebugService: CiscoDebugService,
    private configDebugService: ConfigDebugService,
    private ciscoWcOperationsService: CiscoWcoperationsService,
    private packingService: PackingService,
    private dellShippingService: DellShippingService,
    private ciscoReworkService: CiscoReworkService,
    private eTraveller: ETravellerService,
    private ciscoTCPrepService: CiscoTCPrepService,
    private dellDebugService: DellDebugService,
    private dellReceivingService: DellReceivingService,
    private houWcOperationService: HoustonWCOperationService,
    private dellReworkService: DellReworkService,
    private dellEstimateService: DellEstimateService,
    private dellCarReceivingService: DellCarReceivingService,
    private verifoneSeachService: VerifoneSeachServiceService,
    private dellCarWcOperationsService: DellCarWCOperationsService,
    private dellCarPackoutService: DellCarPackoutService,
    private batchProcess: BatchprocessService,
    private checkAccService: CheckAccessoriesService,
    private DellPredictiveService: DellPredictiveService,
    private dellCarPackoutshippingService: DellCarPackoutshippingService,
    private oleMyUnitService: OleMyUnitServiceService,
    private verifoneReceivingService: VerifoneReceivingServiceService,
    private dellCarPredictiveService: DellCarPredictiveService,
    private dellCarDebugService : DellCarDebugService,
    private verifoneMegalabelService: VerifoneMegalabelService,
    private verifoneService: VerifoneService,
    private dellDebugPrService: DellDebugPrService,
    private DellCarAssessmentService: DellCarAssessmentService,
    private wikiadminService:WikiAdminService,
    private primarFaultService: PrimaryFaultService,
    private paPopupService: PaPopupService,
    private DuplicatePartPopupService :DuplicatePartPopupService
  ) { }

  handleAction(actionData, instance, responseData?: any) {
    /// Deep cloning so that old values are cleared
    const action = cloneDeep(actionData);
    switch (action.type) {
      //TemplateService : All the template related action
      //will be handled in the template service
      case 'renderTemplate':
        // metadata service
        this.templateService.handleRenderTemplate(action, this);
        break;
      case 'removeTemplate':
        this.templateService.removeTemplate(action);
        break;
      case 'reroutingReceivingPage':
        this.templateService.handleReroutingReceivingPage(action, instance, this);
        break;
      case 'receivingVideoCount':
        this.templateService.handleReceivingVideoCount(action, instance, this);
        break;

      case 'microservice':
        // call transaction service
        this.microService.handleMicroservice(action, instance, this);
        break;


      //ComponentService : All the component related action
      //will be handled in the component service
      case 'displayComp':
        this.componentService.handledisplayComponent(action, instance);
        break;
      case 'disableComponent':
        this.componentService.handleDisableComponent(action, instance);
        break;
      case 'enableComponent':
        this.componentService.handleEnabledComponent(action, instance);
        break;
      case 'toggle':
        this.componentService.performToggel(action, instance, this)
        break;
      case 'updateComponent':
        this.componentService.handleUpdateComponent(action, instance, responseData, this.utilityService);
        break;
      case 'deleteComponent':
        this.componentService.handleDeleteComponent(action, instance);
        break;
      case 'createComponent':
        this.componentService.handleCreateComponent(action, instance);
        break;
      case 'updateStage':
        this.componentService.handleUpdateStage(action, instance);
        break;
      case 'isCurrentComponentSelected':
        this.componentService.isCurrentComponentSelected(action, instance);
        break;
      //contextSevice : All the context related action
      //will be handled in the context service
      case 'context':
        /// trigger the context service
        this.contextActionSevice.handleContextService(action, instance, responseData, this);
        break;
      case 'createArrayFromContext':
        this.contextActionSevice.handlecreateArrayFromContext(action, instance);
        break;
      case 'findMatchingElement':
        this.contextActionSevice.handlefindMatchingElement(action, instance);
        break;
      case 'clearAllContext':
        this.contextActionSevice.clearAllContext(action, this);
        break;
      case 'getDataFromSaveAndExit':
        this.contextActionSevice.getDataFromSaveAndExit(action, this);
        break;
      case 'clearScreenData':
        this.contextActionSevice.clearScreenData(this, "Timeout");
        break;
      case 'pauseScreenData':
        this.contextActionSevice.pauseScreenData(this);
        break;
      case 'sessionStorageOperation':
        this.utilityService.handleSessionStorageOperation(action);
        break;
      case 'checkForReceivingBatch':
        this.utilityService.checkForReceivingBatch(action, instance, this);
        break;
      case 'saveAndExitApiCall':
        this.utilityService._saveAndExitApiCall(this);
        break;
        case 'handleDataFormationForDraft':
        this.utilityService.handleDataFormationForDraft(action,this,instance );
        break;
      case 'concatContexts':
        this.contextActionSevice.concatContexts(action);
        break;
      // case 'menuListData':
      //   this.contextActionSevice.menuListData(this);
      //   break;
      case 'screenMenu':
        this.contextActionSevice.screenMenus();
        break;
      //utilityService :  All the commonly used   action
      //will be handled in the utility service
      case 'toast':
        this.utilityService.handleToastMessage(action, instance, this);
        break;
      case 'dateFormat':
        this.utilityService.handledateFormat(action, instance);
        break;
      case 'clearFlexFieldAccessories':
        this.utilityService.clearFlexFieldAccessories(action, instance, this.contextService);
        break;
      case 'populateEmailSubject':
        this.utilityService.populateEmailSubject(action);
        break;
      case 'populateMissingAccessoriesNamesInTextFields':
        this.utilityService.populateMissingAccessoriesNamesInTextFields();
        break;
      case 'multipleCondition':
        this.utilityService.handleMultipleConditionalFilter(action, instance, this);
        break;
      case 'addValuesToRadioGroup':
        this.utilityService.addValuesToRadioGroup(action, instance);
        break;
      case 'updateSearchValues':
        this.utilityService.updateSearchValues(action);
        break;
      case 'updateMenuList':
        this.utilityService.updateMenuList(action, instance, this);
        break;


      //sub type usage services
      case 'handleCommonServices':
        this.utilityService.handleCommonServices(action, instance, responseData, this);
        break;

      //stringOperService : All the string related action
      //will be handled in the string service
      case 'splitWord':
        this.stringOperService.handleSplitWord(action, instance);
        break;
      case 'performOperation':
        this.stringOperService.performOperation(action, this);
        break;
      case 'stringOperation':
        this.stringOperService.handleStringOperation(action, instance);
        break;
      // case "getStringLength":
      //   this.stringOperService.getStringLength(action,instance);
      //   break; 

      //dialogService : All the dialog related action
      //will be handled in the dialog service
      case 'dialog':
        this.dialogService.handleDialogbox(action, instance, this);
        break;
      case 'closeAllDialogs':
        this.dialogService.toCloseAlltheDialog();
        break;

      //ciscoIqaPreScreenService : All the ciscoIqaPreScreen related action
      //will be handled in the ciscoIqaPreScreen service
      case 'enableByParant':
        this.ciscoIqaPreScreenService.handleEnabledByParent(action, instance);
        break;
      case 'getCheckRevisionWithAutoScrap':
        this.ciscoIqaPreScreenService.handleInLoop(action, instance, this);
        break;
      case 'truncket':
        this.ciscoIqaPreScreenService.handleTruncket(action, instance);
        break;

      //ArrayOperService : All the arrayOper related action
      //will be handled in the arrayOper service
      case 'handleArray':
        this.arrayOperService.handlePushDataToArray(action, instance);
        break;
      case 'filterAndGetIndex':
        this.arrayOperService.handlefilterAndGetIndex(action, instance, this);
        break;
      case 'convertArray':
        this.arrayOperService.handleArrayData(action, instance);
        break;
      case 'GetValueFromArray':
        this.arrayOperService.handleGetValueFromArray(action, instance);
        break;
      case 'checkAndPush':
        this.arrayOperService.handlecheckAndPush(action, instance, this);
        break;
      case 'checkAndApply':
        this.arrayOperService.handlecheckAndApply(action, instance);
        break;
      case 'getArrayRecordByIndex':
        this.arrayOperService.getArrayRecordByIndex(action, this);
        break;

      case 'reorderAccessories':
        this.arrayOperService.reorderAccessories(action, this);
        break;
      case 'recordUnitPartInfo':
        this.custome.handelRupiFunction(action, instance);
        break;
      case 'collectData':
        this.custome.manageData(action, instance);
        break;
      case 'prepareConfirmRevisedLabelFAData':
        this.custome.handleRevisedLabelsFAData(action, instance);
        break;
      case 'setPrintResultCode':
        this.custome.setPrintResultCode(action, instance);
        break;
      case 'flexaction':
        this.custome.handleflexarray(action, instance);
        break;
      case 'combineArray':
        this.custome.handlecombineArray(action);
        break;
      case 'handleString':
        this.custome.handleStringData(action, instance);
        break;
      case 'customInOutBound':
        this.custome.getSplitStringForInOutBound(action, instance);
        break;
      case 'filterActionCode':
        this.custome.getFilterActionCode(action, instance);
        break;
      case 'fqaFlexFields':
        this.custome.getFqaFlexFields(action, instance);
        break;
      case 'populateFqaText':
        this.custome.populateFqaText(action, instance);
        break;
      //formOperService : All the formOper related action
      //will be handled in the formOper service
      case 'setDefaultValue':
        this.formOperService.setDefaultValue(action, instance, this.utilityService);
        break;
      case 'setDefaultValueBasedOnName':
        this.formOperService.setDefaultValueBasedOnName(action, instance, this.utilityService);
        break;
      case 'resetData':
        this.formOperService.handleReset(action, instance);
        break;
      case 'setFocus':
        this.formOperService.handleSetFocus(action);
        break;
      case 'resetControl':
        this.formOperService.resetControl(action, instance);
        break;
      case 'resetForm':
        this.formOperService.resetForm(action, instance, this);
        break;
      case 'resetCurrentControl':
        this.formOperService.resetCurrentControl(action, instance);
        break;
      case 'selectedCurrentControl':
        this.formOperService.selectedCurrentControl(action, instance);
        break;
      //debugService : All the debug related action
      //will be handled in the debug service
      case 'resetQuoteDebugScreen':
        this.debugService.resetQuoteDebugScreen(action, instance, this);
        break;
      case 'identifierForDebugRecentRecord':
        this.debugService.identifierForDebugRecentRecord(action, instance);
        break;
      case 'checkForPremiumTask':
        this.debugService.checkForPremiumTask(action, instance, this);
        break;
      case 'processPremiumContextValue':
        this.debugService.handlePremiumValueProcess(action, instance, this);
        break;
      case 'premiumNextTimeoutAvailibity':
        this.debugService.premiumNextTimeoutAvailibity(action, instance, this);
        break;
      case 'verifyKardexLineList':
        this.debugService.verifyKardexLineList(action, instance, this);
        break;
      case 'looperControlService':
        this.debugService.handleLooperControlService(action, instance, this);
        break;
      case 'setInitialDefault':
        this.debugService.setInitialDefault(action, instance, this);
        break;
      case 'replaceCommodityActions':
        this.debugService.replaceCommodityActions(action, instance, this);
        break;
      case 'replaceKitPartActions':
        this.debugService.replaceKitPartActions(action, instance, this);
        break;
      case 'partsPriceStockActions':
        this.debugService.partsPriceStockActions(action, instance, this);
        break;
      case 'updateStockQuantityState':
        this.debugService.updateStockQuantityState(action, instance, this);
        break;
      case 'partTypeAvailablity':
        this.debugService.partTypeAvailablity(action, instance, this);
        break;
      case 'defectNoteFormat':
        this.debugService.defectNoteFormat(action, instance, this);
        break;
      case 'hpfaHistoryUpdate':
        this.debugService.hpfaHistoryUpdate(action, instance, this);
        break;
      case 'bsodTestValueFormat':
        this.debugService.bsodTestValueFormat(action, instance, this);
        break;
      case 'openSoftwareTaskPanel':
        this.debugService.openSoftwareTaskPanel(action, instance, this);
        break;
      case 'openManualTaskPanel':
        this.debugService.openManualTaskPanel(action, instance, this);
        break;
      // case 'checkForAlternatePart':
      //   this.debugService.checkForAlternatePart(action, instance, this);
      //   break;

      //occurenceService : All the ocScurence related action
      //will be handled in the occurence service
      case 'addOccurenceToContext':
        this.occurenceService.addOccurenceToContext(action, instance, this);
        break;
      case 'getFilteredFromContext':
        this.occurenceService.getFilteredFromContext(action, instance);
        break;
      case 'deleteAndUpdateOccurence':
        this.occurenceService.deleteAndUpdateOccurence(action, instance, this);
        break;

      //quoteResponseService : All the quoteResponse related action
      //will be handled in the quoteResponse service
      case 'quoteResponseControlService':
        this.quoteResponseService.handleQuoteResponseControlService(action, instance, this);
        break;
      case 'quoteResponseOccuranceFilter':
        this.quoteResponseService.quoteResponseOccuranceFilter(action, instance, this);
        break;
      case 'cancelFALooper':
        this.quoteResponseService.cancelFALooperOperation(action, instance, this);
        break;

      //dataOperservice : All the dataOper related action
      //will be handled in the dataOper service
      case 'filterData':
        this.dataOperservice.handleFilterData(action, instance);
        break;

      case 'conditionalFilterData':
        this.arrayOperService.handlearrayFilter(action, instance, this);
        break;

      case 'arraySetMethod':
        this.arrayOperService.setData(action);
        break;

      case 'filterArrayData':
        this.arrayOperService.handleFilterArrayData(action, instance, this);
        break;
      //errorHandlingService : All the errorHandling related action
      //will be handled in the errorHandling service
      case 'errorPrepareAndRender':
        this.errorHandlingService.handleErrorPrepareAndRender(action, instance);
        break;

      //componentViewService : All the componentView related action
      //will be handled in the componentView service
      case 'updateTaskPanelRightSide':
        this.componentViewService.handleUpdateTaskPanelRightSide(action, instance);
        break;

      //buttonActionsService : All the buttonAction related action
      //will be handled in the buttonAction service
      case 'triggerClick':
        this.buttonActionsService.triggerClick(action, instance);
        break;
      case 'triggerreqclick':
        this.buttonActionsService.triggerReqClick(action, instance, this);
        break;

      //receivingVideoService : All the receivingVideo related action
      //will be handled in the receivingVideo service
      case 'receivingVideo':
        this.receivingVideoService.onReceivingVedioScanClose();
        break;
      //receivingVideoService : Action for Exititing video on Exit click in Receiving for LOU
      case 'receivingVideoExit':
        this.receivingVideoService.onExitVideoRecClose();
        break;

      //ciscoECObookingService : All the ciscoECObooking related action
      //will be handled in the ciscoECObooking service
      case 'changeResultCode':
        this.ciscoECObookingService.changeResultCode(action, instance, this);
        break;

      //repairReworkService : All the repairRewor related action
      //will be handled in the repairRework service
      case 'countDetetection':
        this.repairReworkService.handleCountAction(action, instance);
        break;
      case 'reworkOccuranceFilter':
        this.repairReworkService.reworkOccuranceFilter(action, instance, this);
        break;
      case 'validateIssuepart':
        this.repairReworkService.validateIssuepart(action, instance, this);
        break;
      case 'checkValidreworkPartoenable':
        this.repairReworkService.checkValidreworkPartoenable(action, instance, this);
        break;
      case 'enableTMOifAllpanlesValid':
        this.repairReworkService.enableTMOifAllpanlesValid(action, instance, this);
        break;
      case 'tocheckValidIssuePartsandcompletedIssuePartslenght':
        this.repairReworkService.tocheckValidIssuePartsandcompletedIssuePartslenght(action, instance, this);
        break;
      case 'checkIssuedPartStatustoUpdateRTV':
        this.repairReworkService.checkIssuedPartStatustoUpdateRTV(action, instance, this);
        break;
      case 'todecreaseRemovedpanelLength':
        this.repairReworkService.todecreaseRemovedpanelLength(action, instance, this);
        break;  
      case 'getOwnerAndCondition':
        this.repairReworkService.getOwnerAndCondition(action, instance, this);
        break;
      //validationalService : All the validation related action
      //will be handled in the validational service
      case 'condition':
        this.validationalService.handleConditionalFilter(action, instance, this);
        break;

      //Cisco-T&CPrepService : All the Cisco-T&CPrep related action
      //will be handled in the Cisco-T&CPrep service
      case 'TnCunBookEcoPanels':
        this.ciscoTCPrepService.TnCcreateECOpanels(action, instance, this);
        break;
      case 'createECOTaskpanels':
        this.ciscoTCPrepService.createECOpanels(action, instance, this);
        break;
      case 'createDaignosisTaskpanels':
        this.ciscoTCPrepService.createDaignosispanels(action, instance, this);
        break;
      case 'createFRUTaskpanels':
        this.ciscoTCPrepService.createFRUpanels(action, instance, this);
        break;
      case 'getStringConcatbyArrayitem':
        this.ciscoTCPrepService.dataConcatination(action, instance, this);
        break;
      case 'getTCFAFlexImagesbyapi':
        this.ciscoTCPrepService.getFAFlexfieldimages(action, instance, this);
        break;
      case 'whislistItemUpdateTC':
        this.ciscoTCPrepService.getCiscoTCWishList(action, instance, this);
        break;
      case 'addPartQunatityAddby1':
        this.ciscoTCPrepService.addQuantitybyValue();
        break;
      case 'subPartQunatityAddby1':
        this.ciscoTCPrepService.subQuantityVlaue();
        break;
      case 'executetcDefectOperation':
        this.custome.executetcDefectOperations(action, instance, this);
        break;
      case 'loadData':
        // call transaction service
        break;
      case 'editable':
        break;
      case 'popupAction':
        break;
      case 'valdiateForm':
        break;
      case 'CustomeActionAccessories':
        break;
      case 'showSpinner':
        this.showSpinner();
        break;
      case 'hideSpinner':
        this.hideSpinner();
        break;

      //the below types are not using from any JSON data
      case 'prepareOnePrint':
        this.handlePrepareOnePrint(action, instance);
        break;
      case 'conditionalDefautValue':
        this.handleConditionalDefaultValue(action, instance);
        break;
      case 'widowsPopupForViewImage':
        this.handleWidowsPopupForViewImage(action, instance);


      case 'uniquePartNostxtType':
        this.vFTService.uniquePartNostxtType(action, this);
        break;
      case 'onVftDefectTextFieldAction':
        this.vFTService.onVftDefectTextFieldAction(action, this);
        break;
      case 'lengthValidation':
        this.formOperService.validateLength(action, instance);
        break;
      ///Dell WC Operations Services
      case 'dellTimeInMicroServices':
        this.dellWcOperationsService.handleDellTimeInActions(action, instance, this, responseData);
        break;
      case 'dellReleaseActions':
        this.dellWcOperationsService.releaseActions(action, instance, this);
        break;
      case 'commonDellWCOperations':
        this.dellWcOperationsService.commonActions(action, instance, this);
        break;
      case 'getLocationSpecificFFID':
        this.dellWcOperationsService.handleGetLocationSpecificFFID(action, instance, this);
        break;
      case 'screenLevelOperation':
        this.dellWcOperationsService.handleScreenLevelOperation(action, instance, this);
        break;
      case 'wcRenderAction':
        this.dellWcOperationsService.handleWcRenderActions(action, instance, this);
        break;
      case 'holdReleaseActions':
        this.dellWcOperationsService.holdReleaseActions(action, instance, this);
        break;
      // dell car
      case 'commonScreenLevelOperations':
        this.dellCarWcOperationsService.handleScreenLevelOperation(action, instance, this);
        break;
      case 'dellCarWCRenderAction':
        this.dellCarWcOperationsService.handleWcRenderActions(action, instance, this);
        break;
      case 'dellCarTimeInMicroServices':
        this.dellCarWcOperationsService.handleDellTimeInActions(action, instance, this, responseData);
        break;
      case 'dellCarholdReleaseActions':
        this.dellCarWcOperationsService.holdReleaseActions(action, instance, this);
        break;
      case 'handleDellCarTimeInCalls':
        this.dellCarWcOperationsService.timeInMicroServices(action,instance,this);
        break;      
        /// DELL MBR operation
      case 'openHoldPopup':
        this.dellMBRService.handleHoldPopup(instance, this);
        break;
      case 'getTestPlatformValue':
        this.dellMBRService.handleGetTestPlatformValue(action);
        break;
      case 'getPlatformNameValue':
        this.dellMBRService.handleGetPlatformNameValue(action);
        break;
      case 'dellMBRTimeInMicroServices':
        this.dellMBRService.handleDellMBRTimeInActions(action, instance, this);
        break;
      case 'dellMBRScreenOperation':
        this.dellMBRService.dellMBRScreenOperation(action, instance, this);
        break;
      case 'dellMBRcommonAction':
        this.dellMBRService.dellMBRcommonAction(action, instance, this);
        break;
      case 'dellMBRReleaseActions':
        this.dellMBRService.dellMBRReleaseActions(action, instance, this);
        break;
      case 'wcMBRRenderAction':
        this.dellMBRService.handleWcMBRRenderActions(action, instance, this);
        break;

      /// HpWCOperationsService
      case 'findIdentificatorType':
        this.utilityService.handleFindIdentificatorType(action, instance, this);
        break;
      case 'timeInMicroServices':
        this.hpWcOperationsService.handleHPTimeInActions(action, instance, this, responseData);
        break;
      case 'renderCurrentScreenMenu':
        this.hpWcOperationsService.renderCurrentScreenMenu(action, instance, this);
        break;
      case 'commonHPWCOperations':
        this.hpWcOperationsService.commonActions(action, instance, this);
        break;
      case 'releaseActions':
        this.hpWcOperationsService.releaseActions(action, instance, this);
        break;
      case 'handleAllHpReleaseCommonWCOperations':
        this.hpWcOperationsService.handleAllHpReleaseCommonWCOperations(action, instance, this);
        break;
      case 'handleAllHpCommonWCOperations':
        this.hpWcOperationsService.handleAllHpCommonWCOperations(action, instance, this);
        break;
      case 'updateDynamicAllPanels':
        this.utilityService.updateDynamicAllPanels(action, instance, this);
        break;
      /// This method is for getting the values issue box part number dropdown
      /// Dell Wur Packout
      case 'getDellPackoutPackagingPartNum':
        this.utilityService._getPackagingPartNum(action, this);
        break;

      case 'handleReplaceCompleteActions':
        this.debugService.handleReplaceCompleteActions(action, instance, this);
        break;
      case 'handleTimeOutActions':
        this.debugService.handleTimeOutAction(action, instance, this);
        break;
      case 'handleDebugTimeOut':
        this.debugService.handleDebugTimeOut(action, instance, this);
        break;
      case 'handleReworkTimeOutActions':
        this.repairReworkService.handleTimeOutAction(action, instance, this);
        break;
      case 'handleReworkTimeOut':
        this.repairReworkService.handleReworkTimeOut(action, instance, this);
        break;
      case 'removePartTaskOperation':
        this.repairReworkService.handleRemovePartTaskOperation(action, instance, this);
        break;
      case 'specificIssuePartDetails':
        this.repairReworkService.specificIssuePartDetails(action, instance, this);
        break;
      case 'prefillComponentSN_PN':
        this.repairReworkService.prefillComponentSN_PN(action, instance, this);
        break;
      case 'dynamicRemovePartTaskOrder':
        this.repairReworkService.dynamicRemovePartTaskOrder(action, instance, this);
        break;
      case 'checkforSameAssemblyCode':
        this.repairReworkService.checkforSameAssemblyCode(action, instance, this);
        break;
      case 'getCountdefectCodeOccurance':
        this.repairReworkService.getCountdefectCodeOccurance(action, instance, this);
      break;
      //sub type usage services

      /// Cisco Debug service related actions
      case 'handleProcessActions':
        this.ciscoDebugService.handleProcessActions(action, instance, this);
        break;
      case 'disableOrEnableAllIcons':
        this.ciscoDebugService.disableOrEnableAllIcons(action, instance, this);
        break;
      case 'onClickOfCompleteButton':
        this.ciscoDebugService.onClickOfCompleteButton(action, instance, this);
        break;
      // case 'removeValueFromTable':
      //   this.ciscoDebugService.removeValueFromTable(action, instance, this);
      //   break;
      case 'filterPartsBasedOnLocations':
        this.ciscoDebugService.filterPartsBasedOnLocations(action, instance, this);
        break;
      case 'selectedPartActions':
        this.ciscoDebugService.selectedPartActions(action, instance, this);
        break;
      case 'checkLength':
        this.ciscoDebugService.checkLength(action);
        break;
      case 'ciscoDebugCreateFailCode':
        this.ciscoDebugService.ciscoDebugCreateFailCode(action, instance, this);
        break;
      case 'ciscoDebugWishListPanels':
        this.ciscoDebugService.ciscoDebugWishListPanels(action, instance, this);
        break;
      case 'ciscoDebugValidateTaskPanels':
        this.ciscoDebugService.ciscoDebugValidateTaskPanels(action, instance, this);
        break;
      case 'checkIsWCLooping':
        this.ciscoDebugService.checkIsWCLooping(action, instance, this);
        break;
      case 'addOrRemoveItemFromWL':
        this.ciscoDebugService.addOrRemoveItemFromWL(action, instance, this);
        break;
      case 'ciscoDebugCompleteButton':
        this.ciscoDebugService.createdTaskCompleteButtonActions(action, instance, this);
        break;
      case 'filterMasterName':
        this.ciscoDebugService.filterMasterName(action, instance, this);
        break;
      ////////////////////////////////////////////////////////////
      // cisco   Config Debug related actions
      ////////////////////////////////////////////////////////////
      case 'handleConfigProcessActions':
        this.configDebugService.handleConfigProcessActions(action, instance, this);
        break;
      case 'configdisableOrEnableAllIcons':
        this.configDebugService.configdisableOrEnableAllIcons(action, instance, this);
        break;
      case 'onClickOfConfigCompleteButton':
        this.configDebugService.onClickOfConfigCompleteButton(action, instance, this);
        break;
      case 'disabeAllEcopanles':
        this.custome.disabeAllEcopanles(action, instance, this);
        break;
      // case 'removeValueFromConfigTable':
      //   this.configDebugService.removeValueFromConfigTable(action, instance, this);
      //   break;
      case "configAddOrRemoveItemFromWL":
        this.configDebugService.configAddOrRemoveItemFromWL(action, instance, this);
        break;
      case 'configSelectedPartActions':
        this.configDebugService.configSelectedPartActions(action, instance, this);
        break;
      // case 'ciscoDebugLooperControl':
      //   this.ciscoDebugService.ciscoDebugLooperControl(action, instance, this);
      //   break;
      case 'configFilterPartsBasedOnLocations':
        this.configDebugService.configFilterPartsBasedOnLocations(action, instance, this);
        break;
      case 'configCheckLength':
        this.configDebugService.configCheckLength(action);
        break;
      case 'concatinateString':
        this.configDebugService.concatinateString(action);
        break;
      case 'configDebugCreateFailCode':
        this.configDebugService.configDebugCreateFailCode(action, instance, this);
        break;
      case 'configDebugWishListPanels':
        this.configDebugService.configDebugWishListPanels(action, instance, this);
        break;
      case 'configDebugCreateEcoPanels':
        this.configDebugService.configDebugCreateEcoPanels(action, instance, this);
        break;
      case 'configDebugCompleteButton':
        this.configDebugService.createdTaskCompleteButtonActions(action, instance, this);
        break;
      ///////////////////////////////////////
      //////////////////////////////////////
      case 'handleVFTServices':
        this.vFTService.handleVFTServices(action, instance, this, responseData);
        break;

      /// CiscoWCOperationsService
      case 'timeInCiscoMicroServices':
        this.ciscoWcOperationsService.handleCiscoTimeInActions(action, instance, this, responseData);
        break;
      case 'secondtimeInCiscoMicroServices':
        this.ciscoWcOperationsService.secondtimeInMicroServices(action, instance, this);
        break;
      case 'commonCiscoWCOperations':
        this.ciscoWcOperationsService.CommonCiscoActions(action, instance, this);
        break;
      case 'reduceCiscoWCOperations':
        this.ciscoWcOperationsService.reduceCiscoCode(action, instance, this);
        break;
      case 'secondReduceCiscoWCOperations':
        this.ciscoWcOperationsService.secondReduceCiscoCode(action, instance, this);
        break;
      case 'afterhandsOncallfunctiomality':
        this.ciscoWcOperationsService.afterhandsOncallfunctiomality(action, instance, this);
        break;
      //calling reusable api integration onetime for all cisco test screens by this method
      case 'qrCodeApicallforAllCiscoTestScreen':
        this.custome.qrCodeApicallforAllCiscoTestScreen(action, instance, this);
        break;

      //houston
      case 'hou-timeInCiscoMicroServices':
        this.houWcOperationService.handleCiscoTimeInActions(action, instance, this, responseData);
        break;
      case 'hou-secondtimeInCiscoMicroServices':
        this.houWcOperationService.secondtimeInMicroServices(action, instance, this);
        break;
      case 'hou-commonCiscoWCOperations':
        this.houWcOperationService.CommonCiscoActions(action, instance, this);
        break;

      //Hp_packoutPackaging Screen
      case 'handlePackingTimoutWithAccessories':
        this.packingService.handlePackingTimoutWithAccessories(instance, action, this);
        break;
      case 'handlePackingTimoutWithOutAccessories':
        this.packingService.handlePackingTimoutWithOutAccessories(instance, action, this);
        break;
      case 'reRoutingthePacking':
        this.packingService.reRoutingthePacking(instance, action, this);
        break;
      case 'routingToShippingPage':
        this.packingService.routingToShippingPage(action, instance, this);
        break;
      case 'routingToDellShippingPage':
        this.dellShippingService.routingToDellShippingPage(action, instance, this);
        break;
      case 'updateShippingTermDetailsContext':
        this.packingService.updateShippingTermDetailsContext(action, instance, this);
        break

      //Cisco-Rework
      case 'ciscoReworkParameter':
        this.custome.getReworkConcatString(action, instance)
        break;
      case 'reworkFlexFields':
        this.custome.getreworkFlexField(action, instance)
        break;
      case 'ciscoReworkWishList':
        this.ciscoReworkService.getCiscoReworkWishList(action, instance, this, responseData)
        break;
      case 'ciscoReworkDeleteEco':
        this.ciscoReworkService.deleteEcoFromUI(action, instance, this)
        break;
      case 'filterConfigReworkTandCEco':
        this.ciscoReworkService.filterTandCEco(action, instance, this);
        break;
      case 'getSerialNoFromAssemblyCode':
        this.ciscoReworkService.getSerialNoFromAssemblyCode(action, instance, this);
        break;
      case 'unissueDefectiveNewComponent':
        this.ciscoReworkService.unissueDefectiveNewComponent(action, instance, this);
        break;
      case 'unissueEcoDefectiveNewComponent':
        this.ciscoReworkService.unissueEcoDefectiveNewComponent(action, instance, this);
        break;
      case 'unissueTCFruandEco':
        this.ciscoReworkService.unissueTCFruandEco(action, instance, this);
        break;
      case 'executeTnCDefectOperations':
        this.custome.executeTnCDefectOperations(action, instance, this);
        break;
      //Dell Receiving Screen
      case 'disableAccessoriesComplete':
        this.dellReceivingService.disableAccessoriesComplete(action, instance, this)
        break;
      case "handleAccessoriesActionValues":
        this.dellReceivingService.handleAccessoriesActionValues(action, instance, this);
        break;
      case "dellReceivingAccessoriesPresent":
        this.dellReceivingService.dellReceivingAccessoriesPresent(action, instance, this);
        break;
      case 'reOrderdellReceivingAccessories':
        this.dellReceivingService.reOrderdellReceivingAccessories(action, instance, this);
        break;
      case 'duplicateAccessoriesCheck':
        this.dellReceivingService.duplicateAccessoriesCheck(action, instance, this);
        break;
      case 'addingResultCodeDataToAccessories':
        this.dellReceivingService.addingResultCodeDataToAccessories(action, instance, this);
        break;
      case 'fixedAssetTagSlaCondition':
        this.dellReceivingService.fixedAssetTagSlaCondition(action,instance,this);
        break;  
      case 'toteMessageColor':
        this.dellReceivingService.toteMessageColor(action,instance,this);
        break;  
      case 'openEtraveller':
        this.eTraveller.openEtraveller(action, instance, this);
        break;
      case 'handlEtravellerServices':
        this.eTraveller.handlEtravellerServices(action, instance, this);
        break;
      case 'handleHPRepositoryserviceAPI':
        this.eTraveller.handleHPRepositoryserviceAPI(action,instance,this);
        break;  
      case 'splitEcoAndFru':
        this.ciscoReworkService.splitEcoFru(action, instance);
        break;

      //Dell Packout service 
      case 'dellPackoutAccessoryDisable':
        this.utilityService.dellPackoutAccessoryDisable(action, instance, this);
        break;
      case 'dellPackoutAccessoryEnable':
        this.utilityService.dellPackoutAccessoryEnable(action, instance, this);
        break;
      case 'toDisplaycheckAccesoriespanel':
        this.utilityService.toDisplaycheckAccesoriespanel(action, instance, this);
        break;
      case 'tocheckReturnHDDPPIDofpackout':
        this.utilityService.tocheckReturnHDDPPIDofpackout(action, instance, this);
        break;
      case 'viewAllCheckAccesories':
        this.utilityService.viewAllCheckAccesories(action, instance, this);
        break;
      case 'qrCodeScancheck':
        this.utilityService.checkIfValidAccessory(action, instance, this);
        break;
      case 'checkForIssuedParts':
        this.utilityService.checkForIssuedParts(action, instance, this);
        break;
      case 'toviewReturnDefectHddpanel':
        this.utilityService.toviewReturnDefectHddpanel(action, instance, this);
        break;
      case 'modifyTheDellBinNotes':
        this.utilityService.modifyTheDellBinNotes(action, this, instance);
        break;
      case 'updateBinNotes':
        this.utilityService.updateValues(action);
        break;
      case 'handleKardexPageRendering':
        this.utilityService.handleKardexPageRendering(action, this, instance);
        break;
      case 'handleWikiPageRendering':
        this.utilityService.handleWikiPageRendering(action, this, instance);
        break;

        case 'getLogedinUseRoles':
          this.utilityService.getLogedinUseRoles(action, this, instance);
          break;
        

      /// Dell Debug service
      case 'handleDellDebugActions':
        this.dellDebugService.handleDellDebugActions(action, instance, this);
        break;
      /// Dell Debug PR service
      case 'handleDellDebugPRActions':
        this.dellDebugPrService.handleDellDebugPRActions(action, instance, this);
        break;

      case 'handleDellDebugPredictionActions':
        this.DellPredictiveService.handleDellDebugPredictionActions(action, instance, this);
        break;
      
      /// Dell rework service
      case 'handleDellReworkActions':
        this.dellReworkService.handleDellReworkActions(action, instance, this);
        break;
      case 'handleDellReworkHDDfieldComparitives':
        this.dellReworkService.handleDellReworkHDDfieldComparitives(action, instance, this);
        break;
      case 'focusFirstControl':
        this.focusFirstControl(action, instance, this);
        break;
      case 'conditionalDestinationLocationData':
        this.arrayOperService.getConditionalDestinationLocationData(action, instance, this);
        break;
      case 'dialogwithmessage':
        this.dialogService.handleDialogboxWithMessage(action, instance, this);
        break;
      case 'handleWorkInstructionData':
        this.componentService.handleWorkInstructionData(action, instance, this.utilityService);
        break;
      case 'filterDellDebugSubmenuData':
        this.dellWcOperationsService.filterDellDebugSubmenuData(action, instance, this);
        break;
      case 'checkDebugScreenRender':
        this.dellWcOperationsService.checkDebugScreenRender(action, instance, this);
        break;
      case 'generatetoogleArray':
        this.arrayOperService.generatetoogleArray(action, instance, this);
        break;
      case 'findObjectInArray':
        this.arrayOperService.findObjectInArray(action, instance, this);
        break;
      case 'partStringExtract':
        this.stringOperService.partStringExtract(action);
        break;
      case 'extractValueBasedOnIndex':
        this.arrayOperService.extractValueBasedOnIndex(action);
        break;
      case 'extractValueBasedOnKey':
        this.arrayOperService.extractValueBasedOnKey(action);
        break;
      case 'ciscoUnissueAndUndoFAForEcoTask':
        this.custome.ciscoUnissueAndUndoFAForEcoTask(action, instance, this);
        break;
      case 'getidBasedOnName':
        this.dellShippingService.getidBasedOnName(action, instance, this);
        break;
      // Dell Estimate Service
      case 'handleDellEstimateActions':
        this.dellEstimateService.handleDellEstimateActions(action, instance, this);
        break;
      // Dell Car Receiving Actions
      case 'handleDellCarReceivingActions':
        this.dellCarReceivingService.handleDellCarReceivingActions(action, instance, this);
        break;
      case 'combineStringsInArray':
        this.stringOperService.combineStringsInArray(action);
        break;
      // Verifone Search Service
      case 'handleVerifoneSearchPageRendering':
        this.verifoneSeachService.handleVerifoneSearchPageRendering(action, instance, this);
        break;
      case 'resetVerifoneSearchPageRendering':
        this.verifoneSeachService.resetVerifoneSearchPageRendering(action, instance, this);
        break;

      case 'verifonRenderSubprocess':
        this.verifoneSeachService.verifonRenderSubprocess(action, instance, this);
        break;
      case 'commonVerifoneActions':
        this.verifoneSeachService.commonVerifoneActions(action, instance, this);
        break;
      case 'verifoneOlehandsOnapiprocess':
        this.verifoneSeachService.olehandsOnapiprocess(action, instance, this);
        break;
      //Verifone actions.
      case 'handleBatchProcessActions':
        this.batchProcess.handleBatchProcessActions(action, instance, this);
        break;
      case 'addUnitToBatch':
        this.batchProcess.addUnitToBatch(action, instance, this);
        break;
      case 'getBatchUnitDetail':
        this.batchProcess.getBatchUnitDetail(action, instance, this);
        break;
      case 'setVerifoneFailureFlexFieldForDropdown':
        this.batchProcess.setVerifoneFailureFlexFieldForDropdown(action, instance, this);
        break;
      case 'verifoneWorkInstructionOpen':
        this.batchProcess.workInstructionOpenStatus();
        break;
      case 'getVerifoneCurrentWCName':
        this.batchProcess.getCurrentBatch();
        break;
      case 'handleDellCarPackoutActions':
        this.dellCarPackoutService.handleDellCarPackoutActions(action, instance, this);
        break;
      case 'getActiveBatchProcess':
        this.batchProcess.getActiveBatchProcess(action, instance, this);
        break;
      case 'loadStationUnitFlexFields':
        this.batchProcess.getloadStationUnitFlexField(action, instance)
        break;
      case 'updateBatchArray':
        this.batchProcess.updateBatchArray(action, instance, this)
        break;
      case 'updateMyUnitsData':
        this.oleMyUnitService.updateMyUnitsData(action, instance)
        break;
      case 'handleTakeoverBatchData':
        this.batchProcess.handleTakeoverBatchData(action, instance, this);
        break;
      case 'handleDellCarShippingActions':
        this.dellCarPackoutshippingService.handleDellCarShippingActions(action, instance, this);
        break;
      case 'handelDellCarAssessmentAction':
        this.DellCarAssessmentService.handelDellCarAssessmentAction(action, instance, this);
        break;
      case 'clearContextOfLoadBatch':
        this.batchProcess.clearContextOfLoadBatch(action, instance, this);
        break;
      //Cisco SZO/OLE  
      case 'oleFlexFields':
        this.custome.getOleFlexFields(action, instance);
        break;

      /// This action is used for dell wur check accessories
      case 'handleCheckAccActions':
        this.checkAccService.handleCheckAccActions(action, instance, this)
        break;

      case 'olehandsOnapiprocess':
        this.custome.olehandsOnapiprocess(action, instance, this);
        break;
      case 'showOLEPausebuttonInScreen':
        this.custome.showOLEPausebuttonInScreen(action, instance, this);
        break;
      case 'addinfoCodesFF':
        this.custome.addinfoCodesFF(action, instance, this);
        break;
      case 'getCurrentDateForVerifonePackingList':
        this.verifoneReceivingService.getCurrentDateForVerifonePackingList(action, instance, this)
        break;
      case 'renderVerifoneReceivingRMAData':
        this.verifoneReceivingService.getVerifoneReceivingRMAData(action, instance, this);
        break;
      case 'rmaToVerifoneReceiving':
        this.verifoneReceivingService.goToReceivingScreen(action, instance, this);
        break;
      case 'setVerifoneReceivingSearchOptions':
        this.verifoneReceivingService.setVerifoneReceivingSearchOptions(action, instance, this);
        break;
      case 'getVerifoneBlindReceivingFlexField':
        this.verifoneReceivingService.getVerifoneBlindReceivingFlexField(action, instance, this);
        break;
      case 'handleDellCarDebugPredictionActions':
        this.dellCarPredictiveService.handleCarDellDebugPredictionActions(action, instance, this);
        break;
      case 'checkDellCarDebugScreenRender':
        this.dellCarWcOperationsService.checkDellCarDebugScreenRender(action, instance, this);
        break;
      case 'filterDellCarDebugSubmenuData':
        this.dellCarWcOperationsService.filterDellCarDebugSubmenuData(action, instance, this);
        break;
      case 'dellCarDebugService':
        this.dellCarDebugService.handleDellDebugActions(action, instance, this);
        break;
      case 'getStockQuantity':
        this.dellCarDebugService.getStockQuantity(action, instance, this);
        break;
      case 'quickReceivingSuccessData':
        this.verifoneReceivingService.quickReceivingSuccessData(action, instance, this);
        break;
      case 'quickReceivingErrorData':
        this.verifoneReceivingService.quickReceivingErrorData(action, instance, this);
        break;
      case 'EditFuncDrawbackSol':
        this.utilityService.EditFuncDrawbackSol(action, instance, this);
        break;

      case 'renderQuickReceivingTableData':
        this.verifoneReceivingService.renderQuickReceivingTableData(action, instance, this);
        break;
      //verifone mega table.
      case 'verifone-handleProcessActions':
        this.verifoneMegalabelService.vfhandleProcessActions(action, instance, this);
        break;
      case 'verifone-disableOrEnableAllIcons':
        this.verifoneMegalabelService.vfdisableOrEnableAllIcons(action, instance, this);
        break;
      case 'verifone-onClickOfCompleteButton':
        this.verifoneMegalabelService.vfonClickOfCompleteButton(action, instance, this);
        break;
      case 'verifone-filterPartsBasedOnLocations':
        this.verifoneMegalabelService.vfFilterPartsBasedOnLocations(action, instance, this);
        break;
      case 'verifone-selectedPartActions':
        this.verifoneMegalabelService.vfselectedPartActions(action, instance, this);
        break;
      case 'verifone-checkLength':
        this.verifoneMegalabelService.vfcheckLength(action);
        break;
      case 'verifone-ciscoDebugCreateFailCode':
        this.verifoneMegalabelService.vfCreateFailCode(action, instance, this);
        break;
      case 'verifone-ciscoDebugWishListPanels':
        this.verifoneMegalabelService.vfWishListPanels(action, instance, this);
        break;
      case 'verifone-ciscoDebugValidateTaskPanels':
        this.verifoneMegalabelService.vfValidateTaskPanels(action, instance, this);
        break;
      case 'verifone-checkIsWCLooping':
        this.verifoneMegalabelService.vfcheckIsWCLooping(action, instance, this);
        break;
      case 'verifone-addOrRemoveItemFromWL':
        this.verifoneMegalabelService.vfaddOrRemoveItemFromWL(action, instance, this);
        break;
      case 'verifone-verifoneMegaLabelCompleteButton':
        this.verifoneMegalabelService.vfcreatedTaskCompleteButtonActions(action, instance, this);
        break;
      case 'verifone-filterMasterName':
        this.verifoneMegalabelService.vffilterMasterName(action, instance, this);
        break;
      case 'verifone-displayTextOnSelect':
        this.verifoneMegalabelService.displayTextOnSelect(action, instance, this);
        break;
      case 'enablingKittingTile':
        this.verifoneService.enablingKittingTile(action, instance, this);
        break;
      case 'getRecievingPanelDetail':
        this.verifoneService.getRecievingPanelDetail(action, instance, this);
        break;
      case 'loadVerifoneWCScreen':
        this.verifoneSeachService.loadVerifoneWCScreen(action, instance, this);
        break;
      case 'getVerifoneRmaNumber':
        this.verifoneSeachService.getVerifoneRmaNumber(action, instance, this);
        break;
      case 'showVerifoneOLEPausebuttonInScreen':
        this.verifoneService.showVerifoneOLEPausebuttonInScreen(action, instance, this);
        break;
      case 'vmiValiadtion':
        this.custome.vmiValiadtion(action, instance, this);
        break;
      case 'getStringyfiedJsonData':
        this.verifoneService.getStringyfiedJsonData(action, instance, this);
      case 'enablingdisablingtextfield':
        this.verifoneService.enablingdisablingtextfield(action, instance, this);
        break;
      case 'getVerifoneWCFlexField':
        this.verifoneService.getVerifoneWCFlexField(action, instance);
        break;
      case 'splitString':
        this.utilityService.splitString(action, instance, this);
        break;
      case 'hideLastNoteInDashboard':
        this.utilityService.hideLastNoteInDashboard(action, instance, this);
        break;  
      case 'updatePrimaryFault':
        this.primarFaultService.updatePrimaryFault(action,instance);
        break;
        case 'updatePaPopup':
        this.paPopupService.updatePaPopup(action,instance);
        break;
        case 'updateDuplicatePartPopup':
        this.DuplicatePartPopupService.updateDuplicatePartPopup(action,instance);
        break;
      case 'stringOperationWithoutUnderscore':
        this.stringOperService.stringOperationWithoutUnderscore(action, instance);
        break;
      case 'renderVerifoneHoldRequiredParts':
        this.verifoneService.renderVerifoneHoldRequiredParts(action, instance, this);
        break;
      case 'getVerifoneHoldResultCode':
        this.verifoneService.getVerifoneHoldResultCode(action, instance, this);
        break;
      case 'renderVerifoneWCHeaderData':
        this.verifoneSeachService.renderVerifoneWCHeaderData(action, instance, this);
        break;
      case 'vmiFlexFields':
        this.verifoneService.getVerifoneVMIFlexField(action, instance);
        break;
      //regarding HP Assesment BSOD panel 
      case 'setTestNameDefaultDataHP':
        this.custome.setTestNameDefaultDataHP(action, instance, this);
        break;
      case 'deleteAllComponent':
        this.verifoneService.deleteAllComponent(action, instance, this);
        break;
      case 'deleteNoneTile':
        this.verifoneService.deleteNoneTile(action, instance, this);
        break;
        case 'handleAllAdminWikiActions':
        this.wikiadminService.handleAllAdminWikiActions(action, instance, this);
        break;
      case 'getAccTestDefectandActionCode':
        this.verifoneService.getAccTestDefectandActionCode(action, instance, this);
        break;
      case 'getAllFormApiData':
        this.verifoneService.getAllFormApiData(action, instance, this);
        break;
      case 'issuepartloop':
        this.verifoneService.performIssuepartloop(action, instance, this);
        break;
      case 'enableSubmitFA':
        this.verifoneService.enableSubmitFA(action, instance, this);
        break;
      case 'setDefaultMenuToHome':
        this.utilityService.setDefaultMenuToHome(action, instance, this);
        break;
      case 'updateEtravellerDiscrepancyUnitInfo':
        this.utilityService.updateEtravellerDiscrepancyUnitInfo(action, instance, this);
        break;
      case 'openEtravellerFromDashboard':
        this.eTraveller.openEtravellerFromDashboard(action, instance, this);
        break;
      case 'renderKeyDataTwice':
        this.eTraveller.renderKeyDataTwice(action, instance, this);
        break;
      case 'keyingRenderTemplate':
        this.batchProcess.keyingRenderTemplate(action, instance, this);
        break;
      case 'setVerifoneHoldTimeout':
        this.verifoneService.setVerifoneHoldTimeout(action, instance, this);
        break;
      default:
        break;
    }
  }

  // toCloseAlltheDialog() {
  //   this.dialog.closeAll()
  // }
  // handleCountAction(action, instance) {
  //   let inc = this.contextService.getDataByString(action.config.source);
  //   inc = parseInt(inc);
  //   if (action.config.type === "inc") {

  //     this.contextService.addToContext(action.config.key, inc + 1);

  //   } else if (action.config.type === "dec") {

  //     this.contextService.addToContext(action.config.key, inc - 1);
  //   }

  // }

  // onReceivingVedioScanClose() {
  //   this.mediaService.triggerRecording(true);
  //   this.fmediaService.upload();
  // }

  // setDefaultValue(action: any, instance: any) {
  //   //Template should have ctypes so check for that if no fail and if there success.
  //   let defaultValue = action.config.defaultValue;
  //   if (this.utilityService.isString(defaultValue) && defaultValue.startsWith('#')) {
  //     defaultValue = this.contextService.getDataByString(defaultValue);
  //   }

  //   var key = action.config.key;
  //   var refData;
  //   if (key !== undefined) {
  //     refData = this.contextService.getDataByKey(key + 'ref');
  //   } else {
  //     refData = this.contextService.getDataByKey(instance.uuid + 'ref');
  //   }
  //   if (refData) {
  //     refData.instance.group.controls[refData.instance.name].setValue(defaultValue);
  //     refData.instance._changeDetectionRef.detectChanges();
  //   } else {
  //     instance.group.controls[instance.name].setValue(defaultValue);
  //     instance._changeDetectionRef.detectChanges();
  //   }

  // }

  handleConditionalDefaultValue(action: any, instance: any) {
    if (action.config.operation != undefined && action.config.operation != null) {
      if (action.config.operation == "checkTemplateExists") {
        let sourceVal = action.config.source;
        if (action.config.source.startsWith('#')) {
          sourceVal = this.contextService.getDataByString(action.config.source);
        }

        let onSuccessActions = [];
        let onFailureActions = [];
        if (sourceVal.hasOwnProperty(action.config.condition)) {
          if (action.responseDependents !== undefined &&
            action.responseDependents.onSuccess !== undefined) {
            onSuccessActions = action.responseDependents.onSuccess.actions;
            onSuccessActions.forEach((element) => {
              this.handleAction(element, instance);
            });
          }
        } else {
          if (action.responseDependents !== undefined &&
            action.responseDependents.onFailure != undefined) {
            onFailureActions = action.responseDependents.onFailure.actions;
            onFailureActions.forEach((element) => {
              this.handleAction(element, instance);
            });
          }
        }
      }
    }
  }

  // handleGetValueFromArray(action, instance) {
  //   let getvaluefromArray;
  //   let indexOfArray;
  //   let parentuuidName;

  //   if (instance.parentuuid !== undefined && instance.parentuuid != null && instance.parentuuid.startsWith('#')) {
  //     parentuuidName = this.contextService.getDataByString(
  //       instance.parentuuid
  //     );
  //   } else {
  //     parentuuidName = instance.parentuuid;
  //   }

  //   if (action.config.arrayData.startsWith('#')) {
  //     let contextArray = this.contextService.getDataByString(
  //       action.config.arrayData
  //     );

  //     if (action.config.key !== undefined) {
  //       getvaluefromArray = contextArray.find((x) => x[action.config.key] === parentuuidName)[action.config.property][0];

  //       if (action.config.splice !== undefined && action.config.splice) {
  //         indexOfArray = contextArray.findIndex((x) => x[action.config.key] == parentuuidName);
  //         // getvaluefromArray = contextArray.splice(indexOfArray, 1);
  //         /// To Do : make this generic
  //         /// Delete from linelist context too
  //         contextArray.splice(indexOfArray, 1);
  //         this.contextService.addToContext(action.config.arrayData, contextArray);

  //         /// Delete from requistionList context
  //         let requisitionList = [];
  //         requisitionList = this.contextService.getDataByKey('requisitionList');
  //         const reqListIndex = requisitionList.findIndex((x) => x[action.config.key] === parentuuidName);
  //         requisitionList.splice(reqListIndex, 1);
  //         this.contextService.addToContext('requisitionList', requisitionList);

  //         /// splice the same index as above from linelist too
  //         let lineList = [];
  //         lineList = this.contextService.getDataByKey('lineList');
  //         lineList.splice(reqListIndex, 1);
  //         this.contextService.addToContext('lineList', lineList);

  //         /// splice the same index as above from linelist too
  //         let kardexLineList = [];
  //         kardexLineList = this.contextService.getDataByKey('kardexLineList');
  //         kardexLineList.splice(reqListIndex, 1);
  //         this.contextService.addToContext('kardexLineList', kardexLineList);

  //         let averageAmountList = [];
  //         averageAmountList = this.contextService.getDataByKey('averageAmountList');
  //         averageAmountList.splice(reqListIndex, 1);
  //         this.contextService.addToContext('averageAmountList', averageAmountList);

  //         let requisitionLength;
  //         requisitionLength = requisitionList.length;
  //         this.contextService.addToContext('requisitionListLength', requisitionLength);

  //         if (action.config.deleteTableData !== undefined) {
  //           /// Update mat table -- This will be moved to seperate action later
  //           const matTableRef = this.contextService.getDataByKey('ReplacerequisitiontasktableUUID' + 'ref');
  //           matTableRef.instance.matTableDataSource.data = requisitionList;
  //           matTableRef.instance.matTableDataSource._updateChangeSubscription();
  //           matTableRef.instance._changeDetectionRef.detectChanges();
  //         }
  //       }
  //     }
  //     else {
  //       contextArray.forEach((ele) => {
  //         if (
  //           ele.storageHoldSubCode == instance.group.controls[instance.name].value
  //         ) {
  //           getvaluefromArray = ele[action.config.PullValue];
  //           return;
  //         }
  //       });
  //     }
  //   }
  //   this.contextService.addToContext(
  //     action.config.PullValue,
  //     getvaluefromArray
  //   );
  // }

  // handleSplitWord(action, instance) {
  //   let actionObj = action.config;
  //   let splitText = this.contextService.getDataByString(actionObj.source);
  //   var splitArr = splitText.split(actionObj.splitWord);
  //   splitArr = splitArr[0].trim();
  //   this.contextService.addToContext(actionObj.key, splitArr);
  // }

  handleCustomecode(action, instance, methodName) {
    if (methodName == 'CustomeActionAccessories')
      if (instance.dellCarReceiving) {
        return this.dellCarReceivingService.handleAccessoriesAction(action, instance);
      } else {
        return this.custome.handleAccessoriesAction(action, instance);
      }
    else if (methodName == 'checkDisabled')
      if (instance.disabled) {
        // console.log(instance);
        return false
      }
      else {
        return true
      }
    else if (methodName == 'verifoneCustomeActionAccessories')
      return true;
  }

  // handlecheckAndApply(action, instance) {
  //   var flexarray: any[] = this.contextService.getDataByString(
  //     action.config.source
  //   );
  //   for (var i = 0, len = flexarray.length; i < len; i++) {
  //     if (flexarray[i].Name === instance.name) {
  //       flexarray[i].Value = instance.currentTextFieldValue.trim();
  //     }
  //   }
  // }

  // handlecheckAndPush(action, instance) {
  //   var config = action.config;
  //   var refData = this.contextService.getDataByString(config.source);
  //   config.flag = instance.uuid;
  //   let onSuccessActions = [];
  //   let onFailureActions = [];
  //   var hasMatch: boolean = false;
  //   var compRegexp;

  //   if (config.requestMethod === "add") {
  //     if (config.compRegexp != undefined) {
  //       compRegexp = this.contextService.getDataByString(config.compRegexp);
  //     }
  //     if (refData === '' || refData.length === 0) {
  //       var splitArray = config.source.split('.');
  //       var contextKey = splitArray.shift().split('#')[1];
  //       this.contextService.addToContext(contextKey, []);
  //       var flexarray: any[] = this.contextService.getDataByString(config.source);
  //       config.key =
  //         config.accessoryName !== undefined && config.accessoryName !== ''
  //           ? config.accessoryName
  //           : config.key;
  //       var obj = new Object();

  //       if (config.value === undefined) {
  //         obj = {
  //           name: config.key,
  //           value: instance.group.controls[instance.name].value,
  //           flag: config.flag,
  //           compRegexp: compRegexp !== undefined ? compRegexp.compRegexp : '',
  //           pcb: compRegexp !== undefined ? compRegexp.compPartNo : '',
  //         };
  //       } else {
  //         obj = { name: config.key, value: config.value };
  //       }

  //       if (flexarray[instance.parentuuid] !== undefined) {
  //         flexarray.splice(instance.parentuuid, 1, obj);
  //       } else {
  //         flexarray.push(obj);
  //       }
  //     } else {
  //       config.key =
  //         config.accessoryName !== undefined && config.accessoryName !== ''
  //           ? config.accessoryName
  //           : config.key;
  //       var flexarray: any[] = this.contextService.getDataByString(config.source);
  //       // this.insertIntoAccessoryObjKey(flexarray, action, instance);

  //       for (var i = 0, len = flexarray.length; i < len; i++) {
  //         if (flexarray[i].Value == 'NONE') {
  //           flexarray[i].Value = config.value;
  //           break;
  //         }
  //         if (flexarray[i].flag) {
  //           if (flexarray[i].flag === config.flag) {
  //             flexarray[i].Value = instance.group.controls[instance.name].value;
  //           } else if (flexarray[i].compRegexp === compRegexp.compRegexp) {
  //             if (flexarray[i].pcb === compRegexp.compPartNo) {
  //               // instance.group.controls[instance.name].value = '';
  //               instance.group.reset();
  //               hasMatch = true;
  //             }
  //           } else if (
  //             flexarray[i].Value === instance.group.controls[instance.name].value
  //           ) {
  //             instance.group.controls[instance.name].value = '';
  //             hasMatch = true;
  //           }
  //         }
  //       }
  //       if (config.value === undefined) {
  //         var obj = new Object();
  //         if (!hasMatch) {
  //           obj = {
  //             name: config.key,
  //             value: instance.group.controls[instance.name].value,
  //             flag: config.flag,
  //             compRegexp: compRegexp !== undefined ? compRegexp.compRegexp : '',
  //             pcb: compRegexp !== undefined ? compRegexp.compPartNo : '',
  //           };
  //           if (flexarray[instance.parentuuid] !== undefined) {
  //             flexarray.splice(instance.parentuuid, 1, obj);
  //           } else {
  //             flexarray.push(obj);
  //           }
  //         }
  //       }
  //     }
  //   }

  //   if (config.requestMethod === "addTan") {
  //     var flexarray: any[] = [];
  //     var tanValue = this.contextService.getDataByString("#tanValue");
  //     var tan = this.contextService.getDataByString("#tan");
  //     config.key =
  //       config.accessoryName !== undefined && config.accessoryName !== ''
  //         ? config.accessoryName
  //         : config.key;
  //     var obj = new Object();

  //     if (config.value === undefined) {
  //       obj = {
  //         name: config.key,
  //         value: tan,
  //         // flag: config.flag,
  //         compRegexp: tanValue !== undefined ? tanValue.compRegexp : '',
  //         pcb: tanValue.compPartNo !== null ? compRegexp.compPartNo : '',
  //       };
  //     } else {
  //       obj = { name: config.key, value: config.value };
  //     }

  //     if (flexarray[instance.parentuuid] !== undefined) {
  //       flexarray.splice(instance.parentuuid, 1, obj);
  //     } else {
  //       flexarray.push(obj);
  //     }
  //     this.contextService.addToContext(config.source, flexarray);
  //   }

  //   // console.log(this.contextService.getDataByString(config.source));
  //   // handle the response dependents
  //   if (
  //     !hasMatch &&
  //     action.responseDependents !== undefined &&
  //     action.responseDependents.onSuccess !== undefined
  //   ) {
  //     onSuccessActions = action.responseDependents.onSuccess.actions;
  //     onSuccessActions.forEach((element) => {
  //       this.handleAction(element, instance);
  //     });
  //   } else {
  //     if (
  //       hasMatch &&
  //       action.responseDependents !== undefined &&
  //       action.responseDependents.onFailure != undefined
  //     ) {
  //       onFailureActions = action.responseDependents.onFailure.actions;
  //       onFailureActions.forEach((element) => {
  //         this.handleAction(element, instance);
  //       });
  //     }
  //   }
  // }

  deleteobjKey(flexarray, instance) {
    var indicator = instance.indicator;
    for (var i = 0, len = flexarray.length; i < len; i++) {
      if (indicator != null && indicator != undefined && indicator != '') {
        if (flexarray[i].Value == indicator || flexarray[i].Name == indicator) {
          flexarray[i].Value = 'NONE';
          break;
        }
      }
    }
    // console.log('accessories', flexarray);
  }

  // removeTemplate(action, instance) {
  //   const refData = this.contextService.getDataByKey(action.config.targetId);
  //   /// clear the existing container ref
  //   refData.clear();
  // }

  // handleReset(action, instance) {
  //   instance.group.reset();
  // }

  // handleFilterData(action, instance) {
  //   //this.showHideSpinner(0.5);

  //   let data = [];
  //   let filteredValue;
  //   if (action.config.data.startsWith('#')) {
  //     data = this.contextService.getDataByString(action.config.data);
  //   }

  //   let refData = this.contextService.getDataByKey(
  //     action.config.targetId + 'ref'
  //   );

  //   let filterData = data;
  //   if (action.config.filterKeys !== undefined) {
  //     let filterKeyObj = Object.assign({}, action.config.filterKeys);
  //     filterKeyObj = this.contextService.getParsedObject(filterKeyObj);
  //     Object.keys(filterKeyObj).forEach((key) => {
  //       filterData = this.utilityService.getFilteredCodes(
  //         filterData,
  //         key,
  //         filterKeyObj[key]
  //       );
  //     });
  //   }

  //   if (action.config.isEnabled !== undefined && action.config.isEnabled) {
  //     refData.instance.group.controls[refData.instance.name].enable();
  //   }

  //   filterData = filterData.map((s) => ({
  //     code: s[refData.instance.code],
  //     displayValue: s[refData.instance.displayValue],
  //   }));

  //   filterData = filterData.filter(
  //     (x) => x.displayValue !== undefined && x.displayValue
  //   );
  //   filterData = filterData.sort((a, b) =>
  //     a.displayValue.localeCompare(b.displayValue)
  //   );

  //   if (filterData && filterData !== undefined && filterData.length > 0) {
  //     refData.instance.dataSource = filterData;

  //     if (
  //       action.config.filterValue !== undefined &&
  //       action.config.filterValue !== ''
  //     ) {
  //       filteredValue = this.contextService.getDataByString(
  //         action.config.filterValue
  //       );
  //     } else {
  //       filteredValue = filterData[0]['code'];
  //     }

  //     if (
  //       action.config.afterFilterValue !== undefined &&
  //       filterData.length >= 3
  //     ) {
  //       filterData.forEach((x) => {
  //         if (
  //           x.displayValue.toLowerCase() ===
  //           action.config.afterFilterValue.toLowerCase()
  //         ) {
  //           filteredValue = action.config.afterFilterValue;
  //         }
  //       });

  //       /// We are reversing the array as a work around
  //       filterData = filterData.reverse();
  //     }

  //     refData.instance.options = filterData;
  //     refData.instance.group.controls[refData.instance.name].setValue(
  //       filteredValue
  //     );
  //     // refData.instance.defaultValue = filteredValue;
  //     // refData.instance.dataSource = filterData;
  //     refData.instance.group.controls[
  //       refData.instance.name
  //     ].updateValueAndValidity();
  //   } else {
  //     refData.instance.options = [];
  //     refData.instance.group.controls[refData.instance.name].setValue(null);
  //     refData.instance.group.controls[
  //       refData.instance.name
  //     ].updateValueAndValidity();
  //   }

  //   this.contextService.addToContext(
  //     'userSelected' + refData.instance.name,
  //     filteredValue
  //   );
  //   refData.instance._changeDetectionRef.detectChanges();
  // }

  handleToggle(action, instance) {
    let refData;
    if (action.config.key !== undefined) {
      refData = this.contextService.getDataByKey(action.config.key + 'ref');
    } else {
      refData = this.contextService.getDataByKey(instance.uuid + 'ref');
    }

    refData.instance.expanded = false;
    refData.instance._changeDetectionRef.detectChanges();
  }

  // handledisplayComponent(action, instance) {
  //   let refData;
  //   if (action.config.key !== undefined) {
  //     refData = this.contextService.getDataByKey(action.config.key + 'ref');
  //   } else {
  //     refData = this.contextService.getDataByKey(instance.uuid + 'ref');
  //   }

  //   refData.instance.hidden = false;
  //   refData.instance._changeDetectionRef.detectChanges();
  // }

  // handleUpdateComponent(action, instance, respData) {
  //   let refData;
  //   let key;
  //   const properties = {};

  //   //Added this condition as from Java side ECO json preparation we have added this as Caps (K)
  //   if (action.config.key == undefined || action.config.key == null) {
  //     key = action.config.Key;
  //   } else {
  //     key = action.config.key;
  //   }

  //   if (key !== undefined && key.startsWith('#')) {
  //     key = this.contextService.getDataByString(key);
  //   }

  //   if (action.config.incriment !== undefined) {
  //     key = instance.parentuuid + key;
  //   }

  //   if (key !== undefined) {
  //     refData = this.contextService.getDataByKey(key + 'ref');
  //   } else {
  //     refData = this.contextService.getDataByKey(instance.uuid + 'ref');
  //   }

  //   // to get data from context.
  //   if (action.config.properties !== undefined) {
  //     // properties = action.config.properties;
  //     for (const property in action.config.properties) {

  //       if (
  //         typeof action.config.properties[property] === 'string' &&
  //         action.config.properties[property].startsWith('#')
  //       ) {
  //         properties[property] = this.contextService.getDataByString(
  //           action.config.properties[property]
  //         );
  //       } else {
  //         let objectTypeUpdateSource = action.config.properties[property];
  //         Object.keys(objectTypeUpdateSource).forEach((key) => {
  //           let objValue = objectTypeUpdateSource[key];
  //           if (typeof objValue === 'string' && objValue.includes('#')) {
  //             if (objValue.includes('{')) {
  //               let contextValue = objValue.substring(objValue.indexOf("{") + 1, objValue.indexOf("}"));
  //               let resultValue = this.contextService.getDataByString(contextValue);
  //               objValue = objValue.replace("{" + contextValue + "}", resultValue);
  //             } else {
  //               objValue = this.contextService.getDataByString(objValue);
  //             }
  //             objectTypeUpdateSource[key] = objValue;
  //           }
  //         });

  //         properties[property] = objectTypeUpdateSource;
  //       }
  //     }
  //   }

  //   if (
  //     refData &&
  //     refData != undefined &&
  //     refData.instance &&
  //     refData.instance != undefined
  //   ) {
  //     Object.assign(refData.instance, properties);

  //     if (action.config.updateParent !== undefined && action.config.updateParent) {
  //       const parentRefData = this.contextService.getDataByKey(refData.instance.parentUUID + 'ref');
  //       parentRefData.instance._changeDetectionRef.detectChanges();
  //     }
  //     if (action.config.fieldProperties != undefined) {
  //       var fieldProperties = this.contextService.getParsedObject(
  //         action.config.fieldProperties
  //       );
  //       if (fieldProperties !== undefined) {
  //         Object.keys(fieldProperties).forEach((key) => {
  //           const fieldValue = fieldProperties[key];
  //           /// check if field value of type array
  //           if (fieldValue instanceof Array) {
  //             let responseArray = [];
  //             if (
  //               refData.instance.code &&
  //               refData.instance.code !== undefined
  //             ) {
  //               responseArray = responseArray.map((s) => ({
  //                 code: s[0],
  //                 displayValue: s[1],
  //               }));
  //             } else {
  //               responseArray = responseArray.map((s) => ({
  //                 code: s,
  //                 displayValue: s,
  //               }));
  //             }
  //           }
  //           if (refData.instance.uuid.controls && refData.instance.uuid.controls[key] !== undefined) {
  //             refData.instance.uuid.controls[key].patchValue(fieldValue);
  //           }
  //           else if (refData.instance.group.controls[key] !== undefined) {
  //             refData.instance.group.controls[key].patchValue(fieldValue);
  //             // refData.instance._changeDetectionRef.detectChanges();
  //           }
  //         });
  //       }
  //     }
  //   }

  //   if (refData !== undefined && action.config.clearValidators !== undefined) {
  //     const fieldProperties = action.config.clearValidators;
  //     if (fieldProperties !== undefined) {
  //       Object.keys(fieldProperties).forEach((key) => {
  //         if (refData.instance.group.controls[key] !== undefined) {
  //           refData.instance.group.controls[key].clearValidators();
  //           refData.instance.group.controls[key].updateValueAndValidity();
  //         }
  //       });
  //     }
  //   }

  //   if (action.config.setRequiredValidators !== undefined) {
  //     const fieldProperties = action.config.setRequiredValidators;
  //     if (fieldProperties !== undefined) {
  //       Object.keys(fieldProperties).forEach((key) => {
  //         if (refData.instance.uuid.controls[key] !== undefined) {
  //           refData.instance.uuid.controls[key].setValidators(
  //             Validators.required
  //           );
  //           refData.instance.uuid.controls[key].updateValueAndValidity();
  //         }
  //       });
  //     }
  //   }

  //   if (action.config.setPatternValidators !== undefined) {
  //     const fieldProperties = action.config.setPatternValidators;
  //     if (fieldProperties !== undefined) {
  //       Object.keys(fieldProperties).forEach((key) => {
  //         if (refData.instance.uuid.controls[key] !== undefined) {
  //           refData.instance.uuid.controls[key].setValidators([
  //             Validators.required,
  //             Validators.pattern(fieldProperties[key]),
  //           ]);
  //           refData.instance.uuid.controls[key].updateValueAndValidity();
  //         }
  //       });
  //     }
  //   }

  //   if (action.config.disableForm !== undefined) {
  //     if (action.config.disableForm) {
  //       refData.instance.uuid.disable();
  //     } else {
  //       refData.instance.uuid.enable();
  //     }
  //   }

  //   if (action.config.dropDownProperties !== undefined) {
  //     let dropDownProperties = action.config.dropDownProperties;
  //     let inputDropdownDisplayValue;
  //     let inputDropdownCode;
  //     dropDownProperties = this.contextService.getParsedObject(
  //       dropDownProperties
  //     );
  //     if (dropDownProperties !== undefined) {
  //       Object.keys(dropDownProperties).forEach((key) => {
  //         const dropDownInstance = refData.instance;

  //         /// if we are getting displayValue and code from config, use that
  //         if (action.config.displayValue !== undefined) {
  //           inputDropdownDisplayValue = action.config.displayValue;
  //           inputDropdownCode = action.config.code;
  //         } else {
  //           inputDropdownDisplayValue = dropDownInstance.displayValue;
  //           inputDropdownCode = dropDownInstance.code;
  //         }
  //         let fieldValue = dropDownProperties[key];
  //         if (dropDownProperties[key] !== undefined) {
  //           if (dropDownInstance !== undefined && dropDownInstance) {
  //             if (
  //               inputDropdownCode &&
  //               inputDropdownCode !== undefined
  //             ) {
  //               if (fieldValue !== undefined && fieldValue !== "") {
  //                 fieldValue = fieldValue.map((s) => ({
  //                   code: s[inputDropdownCode],
  //                   displayValue: s[inputDropdownDisplayValue],
  //                 }));
  //               }
  //             }
  //             else {
  //               if (fieldValue !== undefined && fieldValue !== "") {
  //                 fieldValue = fieldValue.map((s) => ({
  //                   code: s,
  //                   displayValue: s,
  //                 }));
  //               }
  //             }

  //             if (!dropDownInstance.isDropdownNotSelected) {
  //               if (fieldValue !== undefined && fieldValue !== "") {
  //                 fieldValue.sort((a, b) =>
  //                   a.displayValue.localeCompare(b.displayValue)
  //                 );
  //               }
  //             }

  //             if (action.config.isAutoComplete !== undefined) {
  //               fieldValue = fieldValue.map((r) => r.displayValue);
  //             }

  //             refData.instance.options = fieldValue;
  //             refData.instance.group.controls[refData.instance.name].setValue(
  //               null
  //             );
  //           }
  //         }
  //       });
  //     }
  //   }

  //   if (action.config.isDropDownWithSearch !== undefined && action.config.isDropDownWithSearch) {
  //     let defaultValue = action.config.properties.defaultValue;
  //     if (defaultValue !== undefined && defaultValue.startsWith('#')) {
  //       defaultValue = this.contextService.getDataByString(defaultValue);
  //     }
  //     refData.instance.group.controls[action.config.name].setValue(
  //       defaultValue
  //     );
  //   }

  //   if (refData && refData.instance._changeDetectionRef !== undefined) {
  //     if (action.config.isTaskPanel !== undefined && action.config.isTaskPanel) {
  //       refData.instance.matPanel.close();
  //     }
  //   }

  //   if (refData && refData.instance._changeDetectionRef !== undefined) {
  //     try {
  //       if (action.isFromHook == undefined || action.isFromHook == null) {
  //         refData.instance._changeDetectionRef.detectChanges();
  //       }
  //     } catch (e) {
  //       // console.log("Component Change Detection Failed:" + refData.instance.uuid + " Because of Hidden Property Configurations");
  //     }
  //   }

  //   if (action.config.properties) {
  //     if (action.config.properties.expanded) {
  //       setTimeout(() => {
  //         if (action.config.properties.expanded && refData.instance.items !== undefined) {
  //           let textFieldItem = refData.instance.items.find((x) => x.ctype === 'textField');
  //           if (textFieldItem && textFieldItem !== undefined) {
  //             let textFieldItemRefData = this.contextService.getDataByKey(textFieldItem.uuid + 'ref');
  //             textFieldItemRefData.instance.textFieldRef.nativeElement.focus();
  //             textFieldItemRefData.instance.textFieldRef.nativeElement.autofocus = true;
  //             textFieldItemRefData.instance._changeDetectionRef.detectChanges();
  //           }
  //         }
  //       }, 500)
  //     }
  //   }

  //   if (action.config.methodCall !== undefined) {

  //     if (action.config.methodCall && refData.instance[action.config.methodCall]) {
  //       refData.instance[action.config.methodCall]();
  //     }
  //   }
  //   //scrolling the screen whenever the errortitle occured
  //   if (Object.keys(properties) &&
  //     Object.keys(properties).length &&
  //     Object.keys(properties).includes("isShown") && properties["isShown"] &&
  //     action.config.key == "errorTitleUUID") {
  //     if (refData &&
  //       refData != undefined && refData.instance &&
  //       refData.instance != undefined && refData.instance.oElementRef != undefined) {
  //       refData.instance.oElementRef.nativeElement.scrollIntoView();
  //     }
  //   }
  // }


  // handleContextService(action, instance, responseData) {
  //   /// call the context service
  //   switch (action.config.requestMethod) {
  //     case 'add':
  //       this.addContext(action, instance, responseData);
  //       break;
  //     case 'get':
  //       break;
  //     case 'delete':
  //       this.contextService.deleteDataByKey(action.config.key);
  //       break;
  //     case 'addToExistingContext':
  //       this.contextService.addToExistingContext(
  //         action,
  //         instance,
  //         responseData
  //       );
  //       break;
  //     case 'updateToExistingContext':
  //       this.contextService.updateToExistingContext(
  //         action,
  //         instance,
  //         responseData
  //       );
  //       break;
  //     case 'popContext':
  //       this.contextService.popContext(action.config.key);
  //     case 'addRivision':
  //       this.addRivision(action, instance, responseData);
  //       break;
  //   }
  // }

  // handleToastMessage(action) {
  //   this._snackBar.open(action.message, '', {
  //     duration: 1000,
  //   });
  // }

  // handleRenderTemplate(action, instance) {
  //   if (action.config.mode === 'local') {
  //     const baseContainerRef = this.contextService.getDataByKey(
  //       'baseContainerRef'
  //     );
  //     /// clear the existing container ref
  //     baseContainerRef.clear();
  //     if (
  //       action.config.clearContext !== undefined &&
  //       action.config.clearContext
  //     ) {
  //       /// clearing the context;
  //       this.contextService.deleteContext();
  //       /// Adding back baseContainerRef to context, as base component is not called again
  //       this.contextService.addToContext('baseContainerRef', baseContainerRef);
  //     }
  //     this.metadataService
  //       .getLocal('./assets/' + action.config.templateId)
  //       .subscribe(
  //         (data) => {
  //           this.componentLoaderService.parseData(data, baseContainerRef);
  //           this.contextService.isDataRefreshed.next(true);
  //         },
  //         (error) => {
  //           console.log(error);
  //         }
  //       );
  //   } else if (action.config.mode === 'remote') {
  //     const refData = this.contextService.getDataByKey(action.config.targetId);
  //     /// clear the existing container ref
  //     refData.clear();
  //     let templateData = this.contextService.getDataByKey(
  //       action.config.templateId
  //     );
  //     if (!templateData.hasOwnProperty('ctype')) {
  //       templateData = JSON.parse(templateData);
  //     }
  //     this.componentLoaderService.parseData(templateData, refData);
  //     const sideNavRefData = this.contextService.getDataByKey(
  //       'dashboardUUIDref'
  //     );
  //     if (sideNavRefData) {
  //       sideNavRefData.instance._changeDetectionRef.detectChanges();
  //     }

  //     if (refData) {
  //       if (refData.instance) {
  //         refData.instance._changeDetectionRef.detectChanges();
  //       } else {
  //         if (action.config.targetUUID != undefined && action.config.targetUUID != null) {
  //           let referenceComp = this.contextService.getDataByKey(action.config.targetUUID + 'ref');
  //           referenceComp.instance._changeDetectionRef.detectChanges();
  //         }
  //         //this.contextService.isDataRefreshed.next(true);
  //       }
  //     }
  //     // this.ref.tick();
  //   }
  //   // need for IQA prescreen(flexfields).
  //   this.customTempArray = [];
  // }

  // async handleMicroservice(action, instance) {
  //   /// call the microservice
  //   switch (action.config.requestMethod) {
  //     case 'get':
  //       await this.getMicroservice(action, instance);
  //       break;
  //     case 'post':
  //       await this.postMicroservice(action, instance);
  //       break;
  //   }
  // }

  addContext(action, instance, responseData) {
    const { nestedKey } = action.config;
    if (
      instance && instance !== undefined &&
      instance.group !== undefined &&
      instance.group.controls !== undefined
    ) {
      /// trim the form && convert to uppercase
      if (instance.ctype !== 'actionToggle' && instance.ctype !== 'actionToggleFQA' && instance.ctype !== 'nativeDropdown') {
        Object.keys(instance.group.controls).forEach((key) => {
          if (
            instance.group.get(key).value &&
            instance.group.get(key).value !== undefined &&
            instance.group.get(key).value !== null
          ) {
            /// check if it is a string
            if (typeof instance.group.get(key).value === 'string') {
              if (
                instance.isTrimRequired != null &&
                instance.isTrimRequired === false
              ) {
                instance.group.get(key).setValue(instance.group.get(key).value, { emitEvent: false });
              } else {
                instance.group.get(key).setValue(instance.group.get(key).value.trim(), { emitEvent: false });
              }
            }
          }
        });
      }
    }

    if (action.config.data === 'formData') {
      /**
       * Encrypting the password
       */
      if (
        instance.group !== undefined &&
        instance.group.controls &&
        instance.group.controls.password &&
        instance.group.value &&
        instance.group.value.password
      ) {
        const pwd = instance.group.value.password;
        const publicKey =
          '-----BEGIN RSA PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApPGqNv0Wb+azIj0JCwv+aRB3pjEVbHtHT+HouQLqY0EUMXq5x+08brylKCqhUqJOtZ/vCzB3EHMwUfTqvubJxzzZypjL765nWuBTWmtVcI2tqPXmNEwt6OwDjW9vI+fqHq7TpDS5u7TLMp0JMG5JzJ+AEZsjXJWY3CRt7f8XWW9ESbk0BLg7bEfRmBQgQe3T+/2/95gqoDtrRjPwsM5scBro2Eg1z1hjb5rYMD378QodTwUOcHdnqj/mwBRoKYXK1vHjoTX3p1AJD7HhvuVHfUbbrEV4UtXNGYsgL69BZlj41z9FYF5QMyTHvcm3VFkySiDmdqbpgP2KaTqid0jeUwIDAQAB-----END RSA PUBLIC KEY-----';
        const pk = forge.pki.publicKeyFromPem(publicKey);
        const encryptedbase = window.btoa(pk.encrypt(pwd));
        const uriEnc = encodeURIComponent(encryptedbase);
        instance.group.value.password = uriEnc;
        // let enc = forge.util.encode64(pk.encrypt(forge.util.hexToBytes(pwd)));
        // let encryptedbase = window.btoa(encrypted);
      }
      if (instance && instance.group !== undefined && instance.group.value) {
        this.contextService.addToContext(action.config.key, instance.group.value);
      }
    } else if (action.config.data === 'rawFormData') {
      this.contextService.addToContext(action.config.key, instance.group.getRawValue());
    } else if (action.config.data === 'responseData') {
      this.contextService.addToContext(action.config.key, responseData);
    } else if (action.config.data === 'splitData') {
      const config = action.config;
      const data = {};
      const splitData = responseData && responseData.split(config.splitKey);

      data[config.lKey] = splitData && splitData.length > 0 ? splitData[0] : '';
      data[config.rKey] = splitData && splitData.length > 0 ? splitData[1] : '';

      this.contextService.addToContext(action.config.key, data);
    } else if (action.config.data === 'elementControlValue') {
      let valueData = '';

      if (
        instance &&
        instance?.group?.controls[instance.name].value !== undefined &&
        instance?.group?.controls[instance.name].value !== null &&
        instance?.group?.controls[instance.name].value.code !== undefined
      ) {
        const value = instance?.group.controls[instance.name].value.code;
        valueData = nestedKey ? { nestedKey, value } : value;
        this.contextService.addToContext(action.config.key, valueData);
      } else {
        const value = instance?.group.controls[instance?.name]?.value;
        valueData = nestedKey ? { nestedKey, value } : value;
        this.contextService.addToContext(action.config.key, valueData);
      }
      if (
        action.config.key === 'userSelectedClient' ||
        action.config.key === 'userSelectedContract' ||
        action.config.key === 'userSelectedSubProcessType' ||
        action.config.key === 'userSelectedLocation'
      ) {
        const userNameData = this.contextService.getDataByString('#userAccountInfo.PersonalDetails.USERID');
        if (userNameData) {
          localStorage.setItem(userNameData + action.config.key, valueData);
        }
      }
    } else if (action.config.data === 'responseArray') {
      this.contextService.addToContext(action.config.key, responseData[0]);
    } else if (action.config.data === 'dateTimeIQ') {
      const yourDate = new Date();
      const repdata = 'IQ' + (621355968000000000 + yourDate.getTime() * 10000);
      this.contextService.addToContext(action.config.key, repdata);
    } else if (action.config.data === 'contextLength') {
      const conLen = this.contextService.getDataByKey(action.config.sourceContext);
      if (conLen) {
        this.contextService.addToContext(action.config.key, conLen.length);
      }
    } else if (action.config.data === 'elementControlName') {
      this.contextService.addToContext(action.config.key, instance.selectedDropdownName);
      if (
        action.config.key === 'userSelectedClientName' ||
        action.config.key === 'userSelectedContractName' ||
        action.config.key === 'userSelectedLocationName'
      ) {
        const userNameData = this.contextService.getDataByString('#userAccountInfo.PersonalDetails.USERID');
        if (userNameData) {
          localStorage.setItem(userNameData + action.config.key, instance.selectedDropdownName);
        }
      }
    } else {
      if (action.config.readDataAsString) {
        this.contextService.addToContext(action.config.key, action.config.data);
      } else {
        if (this.utilityService.isString(action.config.data) && action.config.data.startsWith('#')) {
          const value = this.contextService.getDataByString(action.config.data);
          const valueData = nestedKey ? { nestedKey, value } : value;
          this.contextService.addToContext(action.config.key, valueData);
        } else {
          const value = action.config.data;
          const valueData = nestedKey ? { nestedKey, value } : value;
          this.contextService.addToContext(action.config.key, valueData);
        }
      }

    }
    if (action.config.key === 'conditionOptions' && action.config.data === 'responseData') {
      this.custome.handleMissing('#conditionOptions');
    }
  }


  // async getMicroservice(action, instance) {
  //   const paramsObj = Object.assign({}, action.config.params);
  //   let bodyObj = this.contextService.getParsedObject(paramsObj);

  //   let onFailureActions = [];
  //   onFailureActions = action.responseDependents.onFailure.actions;
  //   let respData: any;
  //   let url: string;
  //   let isLocalService = false;
  //   if (
  //     action.config.isLocal !== undefined &&
  //     action.config.isLocal &&
  //     action.config.LocalService !== undefined &&
  //     action.config.LocalService !== ''
  //   ) {
  //     url = action.config.LocalService;
  //     isLocalService = true;
  //     bodyObj = {};
  //   } else {
  //     url = action.config.microserviceId;
  //   }
  //   let response = await this.transactionService
  //     .get(url, bodyObj, isLocalService)
  //     .subscribe(
  //       (data) => {
  //         if (
  //           (data &&
  //             data != null &&
  //             (data instanceof Array || data instanceof Object) &&
  //             (data[0] != null || data.Result != null)) ||
  //           Object.keys(data).length !== 0
  //         ) {
  //           let isSuccess = false;
  //           let serverMessage;
  //           if (
  //             data.Result != undefined ||
  //             (data instanceof Array && data[0].Result != undefined)
  //           ) {
  //             if (
  //               data.Result == 'SUCCESS' ||
  //               (data instanceof Array && data[0].Result == 'SUCCESS')
  //             ) {
  //               isSuccess = true;
  //             }
  //           } else {
  //             if (data.status == true || data.status == 'true') {
  //               isSuccess = true;
  //             }
  //           }
  //           if (isSuccess) {
  //             //  var respData = data instanceof Array ? data[0].ResultData : data.ResultData;
  //             if (data instanceof Array && data[0].ResultData != undefined) {
  //               respData = data[0].ResultData;
  //             } else {
  //               if (data.ResultData != undefined) {
  //                 respData = data.ResultData;
  //               } else if ((data.data != undefined) || (data.data == null)) {
  //                 respData = data.data;
  //               } else {
  //                 respData = data;
  //               }
  //             }
  //             let onSuccessActions = [];
  //             onSuccessActions = action.responseDependents.onSuccess.actions;
  //             onSuccessActions.forEach((element) => {
  //               this.handleAction(element, instance, respData);
  //             });
  //           } else {
  //             if (data.ResultData !== undefined) {
  //               serverMessage = data.ResultData;
  //             } else if (
  //               data instanceof Array &&
  //               data[0].ResultData !== undefined
  //             ) {
  //               serverMessage = data[0].ResultData;
  //             } else {
  //               serverMessage = data.message;
  //             }
  //             onFailureActions.forEach((element) => {
  //               this.handleAction(element, instance, serverMessage);
  //             });
  //           }
  //         } else {
  //           onFailureActions.forEach((element) => {
  //             this.handleAction(
  //               element,
  //               instance,
  //               messages.genericErrorMessage
  //             );
  //           });
  //         }
  //       },
  //       (error) => {
  //         onFailureActions.forEach((element) => {
  //           this.handleAction(element, instance, messages.genericErrorMessage);
  //         });
  //       }
  //     );
  // }

  // async postMicroservice(action, instance) {
  //   const paramsObj = Object.assign({}, action.config.body);
  //   const bodyObj = this.contextService.getParsedObject(paramsObj);

  //   if (action.config.removeUndefinedFields !== undefined) {
  //     let sourceList = action.config.removeUndefinedFields;
  //     sourceList.forEach(fieldObj => {
  //       let fieldName = fieldObj.KeyName;
  //       let fieldValue = fieldObj.KeyValue;
  //       if (fieldValue.startsWith('#')) {
  //         fieldValue = this.contextService.getDataByString(fieldValue);
  //         if (fieldValue === undefined || fieldValue === '') {
  //           this.utilityService.removeKeys(
  //             bodyObj,
  //             fieldName
  //           );
  //         }
  //       }
  //     });
  //   }

  //   if (action.config.spliceIfEmptyValueObject !== undefined) {
  //     let sourceList = action.config.spliceIfEmptyValueObject;
  //     sourceList.forEach(fieldObj => {
  //       let identifier = fieldObj.identifier;
  //       let valueField = fieldObj.valueField;
  //       let keyToBeRemoved = fieldObj.keyToBeRemoved !== undefined ? fieldObj.keyToBeRemoved : null;
  //       //Now look for identifier array on Body Object
  //       this.utilityService.removeEmptyArrayObjects(bodyObj, identifier, valueField, bodyObj, keyToBeRemoved);
  //     });
  //   }

  //   let onFailureActions = [];
  //   if (action.responseDependents.onFailure != undefined && action.responseDependents.onFailure.actions.length > 0) {
  //     onFailureActions = action.responseDependents.onFailure.actions;
  //   }
  //   const response = await this.transactionService
  //     .post(action.config.microserviceId, bodyObj)
  //     .subscribe(
  //       (resp: HttpResponse<any>) => {
  //         let serverMessage;
  //         if (
  //           resp &&
  //           resp != null &&
  //           (resp.body.Result === 'SUCCESS' ||
  //             resp.body.status === 'true' ||
  //             resp.body.status === true)
  //         ) {
  //           let onSuccessActions = [];
  //           let respData = resp.body.ResultData;
  //           if (
  //             resp.body.data !== undefined &&
  //             resp.body.data != null &&
  //             resp.body.data !== '' &&
  //             resp.body.data !== '{}'
  //           ) {
  //             respData = resp.body.data;
  //           }
  //           onSuccessActions = action.responseDependents.onSuccess.actions;
  //           if (respData !== undefined) {
  //             if (action.config.toBeStringified) {
  //               respData = JSON.stringify(respData);
  //               respData = JSON.parse(respData);
  //             } else {
  //               respData = JSON.parse(respData);
  //             }
  //           }
  //           onSuccessActions.forEach((element) => {
  //             this.handleAction(element, instance, respData);
  //           });
  //         } else {
  //           onFailureActions.forEach((element) => {
  //             if (resp && resp.body.ResultData !== undefined) {
  //               serverMessage = resp.body.ResultData;
  //             } else {
  //               serverMessage = resp.body.message;
  //             }
  //             this.handleAction(element, instance, serverMessage);
  //           });
  //         }
  //       },
  //       (error) => {
  //         onFailureActions.forEach((element) => {
  //           this.handleAction(element, instance, messages.genericErrorMessage);
  //         });
  //       }
  //     );
  // }


  // handleConditionalFilter(action, instance) {
  //   let onSuccessActions = [];
  //   let onFailureActions = [];
  //   let lhs = action.config.lhs;
  //   let rhs = action.config.rhs;
  //   if (action.config.incriment === 1) {
  //     lhs = instance.parentuuid + 1;
  //   }
  //   if (lhs !== undefined) {
  //     if (this.utilityService.isString(lhs) && lhs.startsWith('#')) {
  //       lhs = this.contextService.getDataByString(lhs);

  //       if (lhs instanceof Array && action.config.lhsKeyName !== undefined) {
  //         lhs = this.utilityService.getElementBykeyName(
  //           lhs,
  //           action.config.lhsKeyName,
  //           action.config.lhsKeyValue,
  //           action.config.lhsSecondKeyName
  //         );
  //         this.contextService.addToContext('lhsValue', lhs);
  //       }
  //     }
  //   }

  //   if (rhs !== undefined) {
  //     if (this.utilityService.isString(rhs) && rhs.startsWith('#')) {
  //       rhs = this.contextService.getDataByString(rhs);
  //     }
  //   }

  //   if (action.config.operation == 'isEqualTo') {
  //     if (lhs == rhs) {
  //       onSuccessActions = action.responseDependents.onSuccess.actions;
  //       onSuccessActions.forEach((element) => {
  //         this.handleAction(element, instance);
  //       });
  //     } else {
  //       if (action.responseDependents.onFailure != undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         if (onFailureActions !== undefined) {
  //           onFailureActions.forEach((element) => {
  //             this.handleAction(element, instance);
  //           });
  //         }
  //       }
  //     }
  //   }
  //   if (action.config.operation === 'isEqualcompareArr') {
  //     let flag = false;
  //     rhs && rhs.forEach(element => {
  //       let rhsvalue = element.resultCode;
  //       if (lhs === rhsvalue) {
  //         flag = true;
  //       }
  //     });
  //     if (flag && flag === true) {
  //       onSuccessActions = action.responseDependents.onSuccess.actions;
  //       onSuccessActions.forEach((element) => {
  //         this.handleAction(element, instance);
  //       });
  //     } else {
  //       if (action.responseDependents.onFailure !== undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         onFailureActions.forEach((element) => {
  //           this.handleAction(element, instance);
  //         });
  //       }
  //     }

  //   }
  //   if (action.config.operation == 'isEqualToIgnoreCase') {
  //     if (lhs.toLowerCase() == rhs.toLowerCase()) {
  //       onSuccessActions = action.responseDependents.onSuccess.actions;
  //       onSuccessActions.forEach((element) => {
  //         this.handleAction(element, instance);
  //       });
  //     } else {
  //       if (action.responseDependents.onFailure != undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         onFailureActions.forEach((element) => {
  //           this.handleAction(element, instance);
  //         });
  //       }
  //     }
  //   } else if (action.config.operation == 'isValid') {
  //     if (lhs) {
  //       onSuccessActions = action.responseDependents.onSuccess.actions;
  //       onSuccessActions.forEach((element) => {
  //         this.handleAction(element, instance);
  //       });
  //     } else {
  //       if (action.responseDependents.onFailure != undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         onFailureActions.forEach((element) => {
  //           this.handleAction(element, instance);
  //         });
  //       }
  //     }
  //   }
  //   else if (action.config.operation == 'compareLastChars') {
  //     if (rhs.endsWith('R') || rhs.endsWith('AV')) {
  //       onSuccessActions = action.responseDependents.onSuccess.actions;
  //       onSuccessActions.forEach((element) => {
  //         this.handleAction(element, instance);
  //       });
  //     }
  //     else {
  //       if (action.responseDependents.onFailure != undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         onFailureActions.forEach((element) => {
  //           this.handleAction(element, instance);
  //         });
  //       }
  //     }
  //   } else if (action.config.operation == 'isLessThanEqualTo') {
  //     /// convert to integers
  //     lhs = parseInt(lhs);
  //     rhs = parseInt(rhs);
  //     if (lhs <= rhs) {
  //       onSuccessActions = action.responseDependents.onSuccess.actions;
  //       onSuccessActions.forEach((element) => {
  //         this.handleAction(element, instance);
  //       });
  //     } else {
  //       if (action.responseDependents.onFailure != undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         onFailureActions.forEach((element) => {
  //           this.handleAction(element, instance);
  //         });
  //       }
  //     }
  //   } else if (action.config.operation == 'isNotUndefined') {
  //     if (lhs <= rhs) {
  //       onSuccessActions = action.responseDependents.onSuccess.actions;
  //       onSuccessActions.forEach((element) => {
  //         this.handleAction(element, instance);
  //       });
  //     } else {
  //       if (action.responseDependents.onFailure != undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         onFailureActions.forEach((element) => {
  //           this.handleAction(element, instance);
  //         });
  //       }
  //     }
  //   } else if (action.config.operation == 'indexOf') {
  //     // 1.array we want to check,
  //     // lhs must be array.
  //     // 2.value need to check,
  //     // rhs must be value we need to find in array;
  //     if (lhs instanceof Array) {
  //       if (lhs.indexOf(rhs) > -1) {
  //         onSuccessActions = action.responseDependents.onSuccess.actions;
  //         onSuccessActions.forEach((element) => {
  //           this.handleAction(element, instance);
  //         });
  //       } else {
  //         if (action.responseDependents.onFailure != undefined) {
  //           onFailureActions = action.responseDependents.onFailure.actions;
  //           onFailureActions.forEach((element) => {
  //             this.handleAction(element, instance);
  //           });
  //         }
  //       }
  //     }
  //   } else if (action.config.operation === 'isGreaterThan') {
  //     // convert to integers
  //     lhs = parseInt(lhs);
  //     rhs = parseInt(rhs);
  //     if (lhs > rhs) {
  //       onSuccessActions = action.responseDependents.onSuccess.actions;
  //       onSuccessActions.forEach((success) => {
  //         this.handleAction(success, instance);
  //       });
  //     } else {
  //       if (action.responseDependents.onFailure !== undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         onFailureActions.forEach((failure) => {
  //           this.handleAction(failure, instance);
  //         });
  //       }
  //     }
  //   } else if (lhs !== undefined && rhs !== undefined && action.config.operation === 'isContains') {
  //     if ((this.utilityService.isString(lhs) && lhs.toLowerCase().includes(rhs)) || (lhs.includes(rhs))) {
  //       onSuccessActions = action.responseDependents.onSuccess.actions;
  //       onSuccessActions.forEach((success) => {
  //         this.handleAction(success, instance);
  //       });
  //     } else {
  //       if (action.responseDependents.onFailure !== undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         onFailureActions.forEach((failure) => {
  //           this.handleAction(failure, instance);
  //         });
  //       }
  //     }
  //   }
  //   else if (action.config.operation === 'isNotEmptyArray') {
  //     if (lhs !== undefined && lhs && Array.isArray(lhs) && lhs.length) {
  //       onSuccessActions = action.responseDependents.onSuccess.actions;
  //       onSuccessActions.forEach((success) => {
  //         this.handleAction(success, instance);
  //       });
  //     } else {
  //       if (action.responseDependents.onFailure !== undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         onFailureActions.forEach((failure) => {
  //           this.handleAction(failure, instance);
  //         });
  //       }
  //     }
  //   }

  //   else if (action.config.operation === 'isValidList') {
  //     let validateList = action.config.validList;
  //     let isValid = true;
  //     if (validateList != undefined && validateList != null && validateList.length > 0) {
  //       let validFailCount = 0;
  //       for (let index = 0; index < validateList.length; index++) {
  //         let currentvalue = validateList[index];
  //         if (this.utilityService.isString(currentvalue) && currentvalue.startsWith('#')) {
  //           currentvalue = this.contextService.getDataByString(currentvalue);
  //         }
  //         if (currentvalue == null || currentvalue == undefined) {
  //           validFailCount = validFailCount + 1;
  //         }
  //       }

  //       if (validFailCount == validateList.length) {
  //         isValid = false;
  //       }
  //     }
  //     if (isValid) {
  //       onSuccessActions = action.responseDependents.onSuccess.actions;
  //       onSuccessActions.forEach((element) => {
  //         this.handleAction(element, instance);
  //       });
  //     } else {
  //       if (action.responseDependents.onFailure != undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         onFailureActions.forEach((element) => {
  //           this.handleAction(element, instance);
  //         });
  //       }
  //     }
  //   }

  //   else if (action.config.operation == 'instanceGroupValidity') {
  //     if (instance.group.valid) {
  //       onSuccessActions = action.responseDependents.onSuccess.actions;
  //       onSuccessActions.forEach((element) => {
  //         this.handleAction(element, instance);
  //       });
  //     } else {
  //       if (action.responseDependents.onFailure != undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         onFailureActions.forEach((element) => {
  //           this.handleAction(element, instance);
  //         });
  //       }
  //     }
  //   }

  //   else if (action.config.operation == 'notEmpty') {
  //     if (lhs !== "") {
  //       onSuccessActions = action.responseDependents.onSuccess.actions;
  //       onSuccessActions.forEach((element) => {
  //         this.handleAction(element, instance);
  //       });
  //     } else {
  //       if (action.responseDependents.onFailure != undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         onFailureActions.forEach((element) => {
  //           this.handleAction(element, instance);
  //         });
  //       }
  //     }
  //   }
  // }

  // handleDisableComponent(action, instance) {
  //   var refData;
  //   var key;

  //   if (action.config.incriment == 0) {
  //     key = instance.parentuuid + action.config.key;
  //   } else {
  //     key = action.config.key;
  //   }

  //   if (key != undefined) {
  //     refData = this.contextService.getDataByKey(key + 'ref');
  //   } else {
  //     refData = this.contextService.getDataByKey(instance.uuid + 'ref');
  //   }
  //   if (action.config.property != undefined) {
  //     if (action.config.isNotReset !== undefined && action.config.isNotReset) {
  //     } else {
  //       refData.instance.group.controls[action.config.property].reset();
  //     }
  //     refData.instance.group.controls[action.config.property].disable();
  //     refData.instance._changeDetectionRef.detectChanges();
  //   }
  // }

  // handleEnabledComponent(action, instance) {
  //   let refData;
  //   let key;

  //   if (action.config.incriment === 0) {
  //     key = instance.parentuuid + action.config.key;
  //   } else {
  //     key = action.config.key;
  //   }

  //   if (key !== undefined) {
  //     refData = this.contextService.getDataByKey(key + 'ref');
  //   } else {
  //     refData = this.contextService.getDataByKey(instance.uuid + 'ref');
  //   }
  //   if (action.config.property !== undefined) {
  //     refData.instance.group.controls[action.config.property].enable();
  //     refData.instance._changeDetectionRef.detectChanges();
  //   }
  // }

  // handleDialogbox(action, instance) {
  //   let onSuccessActions = [];
  //   let onFailureActions = [];

  //   const dialogRef = this.dialog.open(DialogboxComponent, {
  //     backdropClass: action.config.backdropClass,
  //     position: action.config.position,
  //     height: action.config.height,
  //     width: action.config.width,
  //     data: action.config,
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result === 'success') {
  //       // response for success.
  //       if (action.responseDependents.onSuccess !== undefined) {
  //         onSuccessActions = action.responseDependents.onSuccess.actions;
  //         onSuccessActions.forEach((element) => {
  //           this.handleAction(element, action.config);
  //         });
  //       }
  //     } else {
  //       // response for failure.
  //       if (action.responseDependents.onFailure != undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         if (onFailureActions) {
  //           onFailureActions.forEach((element) => {
  //             this.handleAction(element, instance);
  //           });
  //         }
  //       }
  //     }
  //   });
  // }

  // handleEnabledByParent(action, instance) {
  //   var refData;
  //   var key;

  //   if (action.config.incriment === 0) {
  //     key = instance.parentuuid + action.config.key;
  //   } else {
  //     let count = instance.parentuuid + action.config.incriment;
  //     key = count + action.config.key;
  //   }
  //   if (action.config.action == undefined) {
  //     if (key != undefined) {
  //       refData = this.contextService.getDataByKey(key + 'ref');
  //     }
  //     if (action.config.property != undefined && refData != undefined) {
  //       refData.instance.group.controls[action.config.property].enable();
  //       refData.instance._changeDetectionRef.detectChanges();
  //     }
  //   } else if (action.config.action === 'enableAllDropdown') {
  //     // 1.current index.
  //     // 2.added data.
  //     // 3.complete array.

  //     // 1.enable all dropdown.
  //     // 2.disabled all part no with data.
  //     // 3.add pcb values for each part no.

  //     var allBomsArray = this.contextService.getDataByString(
  //       action.config.bomList
  //     );
  //     var addedBoms = this.contextService.getDataByString(
  //       action.config.selectedBomList
  //     );
  //     var currentIndex = instance.parentuuid;
  //     var notSelectedBomArray = [];
  //     var keyList = action.config.keyList;
  //     var propertyList = action.config.propertyList;
  //     var trueConfig;

  //     // check data is added or not.
  //     allBomsArray.forEach((element) => {
  //       let flag = false;
  //       addedBoms.forEach((ele) => {
  //         if (ele.assemblyCode === element.assemblyCode) {
  //           // console.log(ele);
  //           // added part no to display in the field
  //           notSelectedBomArray.unshift(element);
  //           flag = true;
  //         }
  //       });
  //       if (!flag) {
  //         notSelectedBomArray.push(element);
  //       }
  //     });

  //     for (let index = currentIndex; index < allBomsArray.length; index++) {
  //       for (let i = 0; i < keyList.length; i++) {
  //         // To enable the fields.
  //         refData = this.contextService.getDataByKey(
  //           index + keyList[i] + 'ref'
  //         );
  //         if (keyList[i] === 'PCB_INUUID' || keyList[i] === 'serialNoUUID') {
  //           refData.instance.group.controls[propertyList[i]].disable();
  //           refData.instance._changeDetectionRef.detectChanges();
  //         } else {
  //           refData.instance.group.controls[propertyList[i]].enable();
  //           refData.instance._changeDetectionRef.detectChanges();
  //         }
  //         // to update condition dropdown and show proper values
  //         if (keyList[i] === 'allConditionUUID') {
  //           trueConfig = {
  //             config: {
  //               key: index + keyList[i],
  //               properties: {
  //                 hidden: false,
  //                 defaultValue: 'Missing',
  //               },
  //             },
  //           };

  //           refData.instance.group.controls[refData.instance.name].setValue(
  //             'Missing'
  //           );
  //           refData.instance._changeDetectionRef.detectChanges();
  //         } else if (
  //           keyList[i] === 'missingConditionUUID' ||
  //           keyList[i] === 'normalConditionUUID'
  //         ) {
  //           trueConfig = {
  //             config: {
  //               key: index + keyList[i],
  //               properties: {
  //                 hidden: true,
  //               },
  //             },
  //           };
  //         } else if (keyList[i] === 'PCB_INUUID') {
  //           trueConfig = {
  //             config: {
  //               key: index + keyList[i],
  //               properties: {
  //                 value: notSelectedBomArray[index].pcbPartNo,
  //               },
  //             },
  //           };
  //         } else if (keyList[i] === 'pcbUUID') {
  //           trueConfig = {
  //             config: {
  //               key: index + keyList[i],
  //               properties: {
  //                 text: notSelectedBomArray[index].compPartNo,
  //               },
  //             },
  //           };
  //         } else if (keyList[i] === 'serialNoUUID') {
  //           trueConfig = {
  //             config: {
  //               key: index + keyList[i],
  //               properties: {
  //                 placeholder: 'xxxxxxxxxxxx',
  //               },
  //             },
  //           };
  //         }
  //         this.handleUpdateComponent(trueConfig, instance, '');
  //       }
  //     }
  //   }
  // }

  // handlefilterAndGetIndex(action, instance) {
  //   let onSuccessActions = [];
  //   let onFailureActions = [];
  //   let contextData = [];
  //   let filterDuplicate: any[];
  //   let result = null;
  //   let filterKey;
  //   if (instance.group) {
  //     filterKey = instance.group.controls[instance.name].value;
  //   }
  //   // get the array from context
  //   if (action.config.data.startsWith('#')) {
  //     contextData = this.contextService.getDataByString(action.config.data);
  //   }

  //   if (action.config.operation === undefined) {
  //     // updated
  //     filterDuplicate = contextData.filter(
  //       (item) => item.pcbPartNo === filterKey
  //     );

  //     if (this.customTempArray.length <= 0) {
  //       contextData.forEach((element) => {
  //         this.customTempArray.push(element);
  //       });
  //     }

  //     if (filterDuplicate.length <= 1) {
  //       // for check the data by source key
  //       contextData.forEach((element) => {
  //         if (action.config.sourceKey === 'compRegexp') {
  //           let re = new RegExp(element[action.config.sourceKey]);
  //           if (re.test(filterKey)) {
  //             result = element;
  //           } else if (element[action.config.sourceKey] == filterKey) {
  //             result = element;
  //           }
  //         }
  //       });
  //     } else {
  //       this.customTempArray.forEach((element) => {
  //         if (action.config.sourceKey === 'compRegexp') {
  //           let re = new RegExp(element[action.config.sourceKey]);
  //           if (re.test(filterKey)) {
  //             result = element;
  //           } else if (element[action.config.sourceKey] == filterKey) {
  //             result = element;
  //           }
  //         }
  //       });
  //       let index = this.customTempArray.findIndex(
  //         (item) => item.compPartNo === result.compPartNo
  //       );
  //       this.customTempArray.splice(index, 1);
  //       this.customTempArray.unshift(result);
  //     }

  //   } else if (action.config.operation === "getIndex") {
  //     let getValueBy

  //     if (action.config.getValueBy.startsWith('#')) {
  //       getValueBy = this.contextService.getDataByString(action.config.getValueBy);
  //     } else {
  //       getValueBy = action.config.getValueBy;
  //     }
  //     if (contextData !== undefined && contextData.length > 0) {
  //       let test = contextData.filter(a => a[action.config.objectKey] == getValueBy);
  //       result = test[0];
  //     } else {
  //       result = {};
  //     }
  //   }


  //   this.contextService.addToContext(action.config.contextKey, result);
  //   // console.log('data from action per index=' + result);

  //   if (action.responseDependents && action.responseDependents.onSuccess != undefined) {
  //     if (result != undefined && result != null) {
  //       onSuccessActions = action.responseDependents.onSuccess.actions;
  //       onSuccessActions.forEach((element) => {
  //         this.handleAction(element, instance);
  //       });
  //     } else {
  //       if (action.responseDependents.onFailure != undefined) {
  //         onFailureActions = action.responseDependents.onFailure.actions;
  //         onFailureActions.forEach((element) => {
  //           this.handleAction(element, instance);
  //         });
  //       }
  //     }
  //   }
  // }

  // handlePushDataToArray(action, instance) {
  //   // 1.data for add into to array
  //   // 2.Array where we have to add the data.
  //   // 3.push data on index.
  //   // 4.unique key.
  //   let data = {};
  //   let filterKey;
  //   let contaxtArray;
  //   let objectKeys = action.config.objectKeys;
  //   let objectValues = action.config.objectValues;
  //   if (instance.group != undefined) {
  //     filterKey = instance.group.controls[instance.name].value;
  //   }

  //   if (objectKeys.length === objectValues.length) {
  //     for (let index = 0; index < objectKeys.length; index++) {
  //       let value = objectValues[index];
  //       if (value.startsWith('#')) {
  //         value = this.contextService.getDataByString(value);
  //       }
  //       data[objectKeys[index]] = value;
  //       if (action.config.arrayName === '#pcbByMainPartParams' && value) {
  //         data = '';
  //         data = filterKey;
  //       }
  //     }
  //   }
  //   // console.log('data from arr handle=' + data);

  //   if (action.config.arrayName.startsWith('#')) {
  //     contaxtArray = this.contextService.getDataByString(
  //       action.config.arrayName
  //     );
  //   }

  //   if (contaxtArray != undefined && contaxtArray instanceof Array) {
  //     if (action.config.action == 'pushIndex') {
  //       if (action.config.uniqueKey != undefined && contaxtArray.length > 0) {
  //         // check for unique object value
  //         let availabel = false;
  //         contaxtArray.forEach((element) => {
  //           if (data instanceof Object) {
  //             if (
  //               element[action.config.uniqueKey] ==
  //               data[action.config.uniqueKey]
  //             ) {
  //               availabel = true;
  //             }
  //           } else {
  //             if (element == data) {
  //               availabel = true;
  //             }
  //           }
  //         });
  //         if (!availabel) {
  //           contaxtArray.push(data);
  //         }
  //       } else {
  //         // push directly.
  //         contaxtArray.push(data);
  //       }
  //     }
  //     else if (action.config.action == 'filterByProperty') {
  //       // data array
  //       // filter by index name
  //       // push data into context (key)
  //       // condition value
  //       if (contaxtArray != undefined && contaxtArray.length > 0) {
  //         // contaxtArray
  //         let resultData = contaxtArray.filter(el => el[objectKeys] === objectValues);
  //         this.contextService.addToContext(action.config.contextKey, resultData);

  //       }

  //     }
  //   } else if (action.config.action == 'updateIndex') {
  //     // function to update the index
  //   } else if (action.config.action == 'addIndexByCount') {
  //     // function to update the index
  //   }

  // }

  // handleArrayData(action, instance) {
  //   let contextData = this.contextService.getDataByString(action.config.value);
  //   if (contextData instanceof Array && action.config.type == 'join') {
  //     contextData = contextData.join();
  //     this.contextService.addToContext(action.config.contextKey, contextData);
  //   }
  // }

  showSpinner() {
    // this.spinner.show('taskSpinner');
  }

  hideSpinner() {
    // this.spinner.hide('taskSpinner');
  }

  showHideSpinner(milliSecond: number) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, milliSecond * 1000);
  }

  // handleInLoop(action, instance) {
  //   //have to change the part no.
  //   // and loop the service.
  //   let parnoArray: string[] = [];
  //   let contaxtArray: any[];
  //   let customAction;

  //   if (action.config.arrayName.startsWith('#')) {
  //     contaxtArray = this.contextService.getDataByString(
  //       action.config.arrayName
  //     );
  //   }

  //   contaxtArray.forEach((element) => {
  //     if (element.partNo != '') {
  //       let str = element.partNo.PCB_IN.split('-');
  //       let str1 = str[0] + '-' + str[1];
  //       parnoArray.push(str1);
  //     }
  //   });

  //   for (let i = 0; i < parnoArray.length; i++) {
  //     customAction = {
  //       type: 'microservice',
  //       config: {
  //         microserviceId: 'getCheckRevisionWithAutoScrap',
  //         requestMethod: 'get',
  //         params: {
  //           revision: parnoArray[i],
  //           workCenter: '#UnitInfo.WORKCENTER',
  //           resultCode: '#SelectedResultcode',
  //         },
  //       },
  //       responseDependents: {
  //         onSuccess: {
  //           actions: [
  //             {
  //               type: 'condition',
  //               config: {
  //                 operation: 'isGreaterThan',
  //                 lhs: '#BomCount',
  //                 rhs: '0',
  //               },
  //               eventSource: 'change',
  //               responseDependents: {
  //                 onSuccess: {
  //                   actions: [
  //                     {
  //                       type: 'updateComponent',
  //                       config: {
  //                         key: 'IQATimeoutUUID',
  //                         properties: {
  //                           disabled: false,
  //                         },
  //                       },
  //                     },
  //                   ],
  //                 },
  //               },
  //             },
  //           ],
  //         },
  //         onFailure: {
  //           actions: [
  //             {
  //               type: 'context',
  //               config: {
  //                 requestMethod: 'add',
  //                 key: 'CheckRevisionWithAutoScrap',
  //                 data: 'responseData',
  //               },
  //             },
  //             {
  //               type: 'updateComponent',
  //               config: {
  //                 key: 'errorTitleUUID',
  //                 properties: {
  //                   titleValue: '#CheckRevisionWithAutoScrap',
  //                   isShown: true,
  //                 },
  //               },
  //             }
  //           ],
  //         },
  //       },
  //     };
  //     this.handleAction(customAction, instance);
  //   }
  // }

  /**
   * Method to set subprocess stage
   * @param action: what type of action we need to perform
   * @param instance: instance of particular component to which we perform action.
   */
  // handleUpdateStage(action, instance) {
  //   // to mark current stage as completed and next stage as active.
  //   let subprocessMenuData: any[] = [];
  //   if (action.config.processId.startsWith('#')) {
  //     subprocessMenuData = this.contextService.getDataByString(
  //       action.config.processId
  //     );
  //   }
  //   if (subprocessMenuData && subprocessMenuData.length > 0) {
  //     subprocessMenuData.forEach((parent) => {
  //       if (
  //         parent.name.toLowerCase() ===
  //         action.config.currentSubProcess.toLowerCase()
  //       ) {
  //         parent.children.forEach((child) => {
  //           if (
  //             child.name.toLowerCase() ===
  //             action.config.currentStage.toLowerCase()
  //           ) {
  //             child['isCompleted'] = true;
  //           }
  //           if (
  //             child.name.toLowerCase() === action.config.nextStage.toLowerCase()
  //           ) {
  //             child.isActive = true;
  //           } else {
  //             child.isActive = false;
  //           }
  //         });
  //       }
  //     });
  //   }

  //   // for performing change detection on menu tree.
  //   const refData = this.contextService.getDataByKey(
  //     action.config.targetId + 'ref'
  //   );
  //   if (refData != undefined) {
  //     refData.instance.dataSource.data = subprocessMenuData;
  //     refData.instance._changeDetectionRef.detectChanges();
  //   }
  // }
  /**
   * Method to handle date formats
   * @param action: what type of action we need to perform.
   * @param instance: instance of particular component to which we perform action.
   */
  // handledateFormat(action, instance) {
  //   let contextData;
  //   if (action.config.source.startsWith('#')) {
  //     contextData = this.contextService.getDataByString(action.config.source);
  //   }

  //   if (contextData) {
  //     if (contextData[action.config.dateKey]) {
  //       contextData[action.config.dateKey] = this.datePipe.transform(
  //         contextData[action.config.dateKey],
  //         action.config.format
  //       );
  //     }

  //     if (contextData[action.config.targetKey]) {
  //       let text = '';
  //       if (+contextData[action.config.targetKey] === 0) {
  //         text = 'day';
  //         this.contextService.addToContext(
  //           'receiptDateTitle',
  //           'sidenav-due body2 date-green'
  //         );
  //         this.contextService.addToContext(
  //           'receiptDateborder',
  //           'sidenav-header heading1 border-green'
  //         );
  //       } else if (+contextData[action.config.targetKey] === 1) {
  //         text = 'day';
  //         this.contextService.addToContext(
  //           'receiptDateTitle',
  //           'sidenav-due body2 date-yellow'
  //         );
  //         this.contextService.addToContext(
  //           'receiptDateborder',
  //           'sidenav-header heading1 border-yellow'
  //         );
  //       } else if (+contextData[action.config.targetKey] >= 2) {
  //         this.contextService.addToContext(
  //           'receiptDateTitle',
  //           'sidenav-due body2 date-red'
  //         );
  //         this.contextService.addToContext(
  //           'receiptDateborder',
  //           'sidenav-header heading1 border-red'
  //         );
  //         text = 'days';
  //       }
  //       contextData[action.config.dateKey] = `${contextData[action.config.dateKey]
  //         } (${contextData[action.config.targetKey]}${text})`;
  //     }
  //   }
  // }

  // handleTruncket(action, instance) {
  //   // "position": "end",
  //   // "count": 4,
  //   // "key": "pcbOutBoundValue",
  //   // "data": "#partno.PCB_IN"
  //   let contextData: string;

  //   if (action.config !== undefined) {
  //     if (action.config.position === 'end') {
  //       if (
  //         action.config.data != undefined &&
  //         action.config.data.startsWith('#')
  //       ) {
  //         contextData = this.contextService.getDataByString(action.config.data);
  //       }
  //       // Sushnat
  //       let substr = contextData.substring(
  //         contextData.length - action.config.count,
  //         contextData.length
  //       );
  //       this.contextService.addToContext(action.config.key, substr);
  //     }
  //   }
  // }

  handlePrepareOnePrint(action, instance) {
    const data = action.config.paramsInputsValues;
    let unitInfo;
    let tanPartNumber;
    let mainPart;
    let bomsList = [];
    const printParamsObj = {};
    let keys = [];
    let gridRecords = [];
    let startIndex;
    let dataKey = [];
    if (data instanceof Array || data instanceof Object) {
      unitInfo = this.contextService.getDataByString(data[0]);
      tanPartNumber = this.contextService.getDataByString(data[1]);
      mainPart = this.contextService.getDataByString(data[2]);
      bomsList = this.contextService.getDataByString(data[3]);
      gridRecords = this.contextService.getDataByString(data[4]);
    }

    keys = action.config.paramsInputsKeys;

    /// Remove the starting two and ending two elements
    const macAccAddressKey = keys.shift();
    const tanPartNumberKey = keys.shift();
    const unitBcnKey = keys.pop();
    const outcomeCodeKey = keys.pop();
    printParamsObj[macAccAddressKey] =
      gridRecords &&
        gridRecords.length > 0 &&
        gridRecords[0].MAC_IN !== undefined
        ? gridRecords[0].MAC_IN
        : '';
    printParamsObj[tanPartNumberKey] = tanPartNumber;
    dataKey = keys;
    for (let i = 0; i < bomsList.length; i++) {
      dataKey = dataKey.concat(keys);
      startIndex = i * 4;
      printParamsObj[dataKey[startIndex]] =
        bomsList[i] !== undefined ? bomsList[i].pcbPartNo : '';
      printParamsObj[dataKey[startIndex + 1]] =
        gridRecords[i] !== undefined ? gridRecords[i].SN_IN : '';
      printParamsObj[dataKey[startIndex + 2]] =
        mainPart[i] !== undefined ? mainPart[i].pcnIn : '';
      printParamsObj[dataKey[startIndex + 3]] =
        mainPart[i] !== undefined ? mainPart[i].pcbOut : '';
    }
    printParamsObj[outcomeCodeKey] = '';
    printParamsObj[unitBcnKey] =
      unitInfo !== undefined ? unitInfo.ITEM_BCN : '';

    /// Store in to the context
    this.contextService.addToContext(action.config.key, printParamsObj);
  }

  // handleErrorPrepareAndRender(action, instance) {
  //   const messageProp = action.config.properties;
  //   var titleValue = '';
  //   if (messageProp != undefined && messageProp != null) {
  //     titleValue = messageProp['titleValue'];
  //     var valueArray = action.config.valueArray;
  //     if (valueArray != null && valueArray != undefined) {
  //       if (valueArray.length > 0) {
  //         valueArray.forEach((valueIdentifier) => {
  //           if (typeof valueIdentifier === 'string' && valueIdentifier.startsWith('#')) {
  //             let identiferVal = this.contextService.getDataByString(
  //               valueIdentifier
  //             );
  //             if (identiferVal == null || identiferVal == undefined) {
  //               identiferVal = "";
  //             }
  //             titleValue = titleValue.replace(
  //               titleValue.substring(
  //                 titleValue.indexOf('{'),
  //                 titleValue.indexOf('}') + 1
  //               ),
  //               identiferVal
  //             );
  //           }
  //         });
  //       }
  //       let refData;
  //       let key;
  //       const properties = {};

  //       key = action.config.key;

  //       if (key !== undefined) {
  //         refData = this.contextService.getDataByKey(key + 'ref');
  //       } else {
  //         refData = this.contextService.getDataByKey(instance.uuid + 'ref');
  //       }

  //       properties['titleClass'] = messageProp['titleClass'];
  //       properties['titleValue'] = titleValue;
  //       properties['isShown'] = messageProp['isShown'];
  //       properties['text'] = titleValue;
  //       properties['secondaryFooterText'] = titleValue;
  //       Object.assign(refData.instance, properties);

  //       if (refData.instance._changeDetectionRef !== undefined) {
  //         refData.instance._changeDetectionRef.detectChanges();
  //       }
  //     }
  //   }
  // }

  // handlecreateArrayFromContext(action, instance) {
  //   let sourceContextData = [];
  //   let targetContextData = [];
  //   if (action.config.sourceContext.startsWith('#')) {
  //     sourceContextData = this.contextService.getDataByString(action.config.sourceContext);
  //   }
  //   if (action.config.targetContext.startsWith('#')) {
  //     targetContextData = this.contextService.getDataByString(action.config.targetContext);
  //     if (Array.isArray(targetContextData) && targetContextData.length) {
  //       /// No need to do anything!
  //     } else {
  //       targetContextData = [];
  //     }
  //   }
  //   sourceContextData.forEach((x) => targetContextData.push(x[action.config.arrayKey]));
  //   this.contextService.addToContext(action.config.targetContext, targetContextData);
  // }


  // handleDeleteComponent(action, instance) {
  //   if (instance.parentuuid !== undefined) {
  //     const refData = this.contextService.getDataByKey(instance.parentuuid + 'ref');
  //     if (refData !== undefined) {
  //       refData.destroy();
  //     }
  //     this.contextService.deleteDataByKey(instance.parentuuid + 'ref');
  //   }

  //   if (action.config !== undefined && action.config.source !== undefined) {
  //     var flexarray: any[] = this.contextService.getDataByString(
  //       action.config.source
  //     );
  //     this.deleteobjKey(flexarray, instance);
  //   }

  //   if (action.config !== undefined && action.config.key !== undefined && action.config.key) {
  //     if (action.config.key.startsWith('#')) {
  //       action.config.key = this.contextService.getDataByString(action.config.key);
  //     }
  //     const refData = this.contextService.getDataByKey(action.config.key + 'ref');
  //     if (refData !== undefined) {
  //       refData.destroy();
  //       this.contextService.deleteDataByKey(action.config.key + 'ref');
  //     }
  //   }
  // }

  changeUUIDOfComponent(items: any, dynamicUUID: any) {
    items.forEach((currentItem) => {
      if (currentItem.uuid !== undefined) {
        currentItem.uuid = currentItem.uuid + dynamicUUID;
      }

      /// Updating the key for actions
      if (currentItem.actions !== undefined && currentItem.actions.length > 0) {
        this.updateKeysForDynamicComponent(currentItem.actions, dynamicUUID);
      }

      /// Updating the key for hooks
      if (currentItem.hooks !== undefined && currentItem.hooks.length > 0) {
        this.updateKeysForDynamicComponent(currentItem.hooks, dynamicUUID);
      }
      if (currentItem.items !== undefined && currentItem.items.length > 0) {
        this.changeUUIDOfComponent(currentItem.items, dynamicUUID);
      }
    });
  }

  updateKeysForDynamicComponent(actions, dynamicUUID) {
    if (actions !== undefined && actions.length > 0) {
      actions.forEach((currentHook) => {
        if (currentHook.type !== undefined && currentHook.type === "updateComponent") {
          currentHook.config.key = currentHook.config.key + dynamicUUID;
        }

        if (currentHook.type !== undefined && currentHook.type === "condition") {
          let onSuccess = currentHook.responseDependents.onSuccess;
          let onFailure = currentHook.responseDependents.onFailure;
          this.updateKeysForDynamicComponent(onSuccess.actions, dynamicUUID);
          this.updateKeysForDynamicComponent(onFailure.actions, dynamicUUID);
        }
      });
    }
  }

  // handleCreateComponent(action, instance) {
  //   let viewContainerRef;
  //   if (action.config.data.uniqueUUID !== undefined && action.config.data.uniqueUUID) {
  //     action.config.data.uuid = action.config.data.uuid + Math.floor(Math.random() * (999 - 100 + 1) + 100);
  //     this.contextService.addToContext('createdComponentUUID', action.config.data.uuid);
  //   }
  //   if (action.config.data.updateUUID !== undefined && action.config.data.updateUUID) {
  //     let config: any = action.config;
  //     //@obj -> string convertion
  //     config = JSON.stringify(config);
  //     config = config.replace(/#@/g, (action.config.data.uuid));
  //     config = JSON.parse(config);
  //     action.config = config;

  //     /// Adding unique ids for all the uuids and
  //     /// updateComponent actions in hooks and actions
  //     // if (action.config.data.items !== undefined && action.config.data.items.length > 0) {
  //     //   this.changeUUIDOfComponent(action.config.data.items, action.config.data.uuid);
  //     // }
  //     // if (action.config.data.footer !== undefined && action.config.data.footer.length > 0) {
  //     //   this.changeUUIDOfComponent(action.config.data.footer, action.config.data.uuid);
  //     // }
  //   }
  //   const refData = this.contextService.getDataByKey(
  //     action.config.targetId + 'ref'
  //   );
  //   const isComponentThere = this.contextService.getDataByKey(
  //     action.config.data.uuid + 'ref'
  //   );

  //   if (action.config.containerId !== undefined) {
  //     viewContainerRef = refData.instance[action.config.containerId];
  //   } else {
  //     viewContainerRef = refData.instance.expansionpanelcontent;
  //   }
  //   if (isComponentThere === undefined) {
  //     if (action.config.index !== undefined) {
  //       this.componentLoaderService.parseData(action.config.data, viewContainerRef, action.config.index);
  //     } else {
  //       this.componentLoaderService.parseData(action.config.data, viewContainerRef);
  //       if (refData.instance._changeDetectionRef !== undefined) {
  //         refData.instance._changeDetectionRef.detectChanges();
  //       }
  //     }
  //   }
  // }

  // handleUpdateTaskPanelRightSide(action, instance) {
  //   const rightItems = action.config.properties.rightItems;
  //   const refData = this.contextService.getDataByKey(action.config.key + 'ref');
  //   Object.assign(refData.instance, action.config.properties);
  //   const rightSideContainerRef = this.contextService.getDataByKey(
  //     'expansionPanelContentFirstHalf'
  //   );
  //   /// clear the existing container ref
  //   rightSideContainerRef.clear();

  //   for (let i = 0; i < rightItems.length; i++) {
  //     refData.instance.uuid.addControl(
  //       rightItems[i].name,
  //       new FormControl(rightItems[i].value)
  //     );

  //     if (rightItems[i].ctype === 'table') {
  //       // console.log(rightItems[i].datasource[1].Qty[0].name);
  //       rightItems[i].datasource.forEach((x) => {
  //         Object.keys(x).forEach((key) => {
  //           // console.log(x[key]);
  //           if (Array.isArray(x[key])) {
  //             x[key].forEach((y) => {
  //               if (y.name !== undefined) {
  //                 refData.instance.uuid.addControl(
  //                   y.name,
  //                   new FormControl(y.value)
  //                 );
  //               }
  //             })
  //           } else {
  //             refData.instance.uuid.addControl(
  //               x[key].name,
  //               new FormControl(x[key].value)
  //             );
  //           }
  //         });
  //       });
  //     }
  //   }

  //   if (rightItems !== undefined) {
  //     /// clear the existing
  //     rightItems.forEach((item) => {
  //       item.group = refData.instance.uuid;
  //       this.componentLoaderService.parseData(
  //         item, refData.instance[item.containerId]
  //       );
  //       refData.instance._changeDetectionRef.detectChanges();
  //     });

  //     // const buttonRefData = this.contextService.getDataByKey(
  //     //   'replaceCompleteButtonUUIDref'
  //     // );
  //     // /// clear the existing container ref
  //     // buttonRefData.instance.group = refData.instance.uuid;
  //     // buttonRefData.instance._changeDetectionRef.detectChanges();
  //   }
  // }

  addRivision(action, instance, responseData) {
    let data, key, rivisionData;

    // keep some time then remove if not required.
    if (action.config.key && action.config.key !== '') {
      key = action.config.key
    }

    if (action.config.data && action.config.data.startsWith('#')) {
      data = this.contextService.getDataByString(action.config.data);
      if (data) {
        rivisionData = data.split('-')[0] + '-' + data.split('-')[1] + '-';
        this.contextService.addToContext(key, rivisionData);
      }
    }
  }

  // triggerClick(action, instance) {
  //   const refData = this.contextService.getDataByKey(action.config.key + 'ref');
  //   refData.instance[refData.instance.ctype].nativeElement.click();
  // }

  // handlefindMatchingElement(action, instance) {
  //   if (this.utilityService.isString(action.config.data) && action.config.data.startsWith('#')) {
  //     let contextArray = this.contextService.getDataByString(action.config.data);
  //     let compareWith;
  //     if (action.config.compareWith !== undefined) {
  //       compareWith = this.contextService.getDataByString(action.config.compareWith);
  //     } else {
  //       /// default it
  //       compareWith = instance.group.controls[instance.name].value;
  //     }
  //     const foundElement = contextArray.find((x) => x[action.config.searchProperty] ===
  //       compareWith)[action.config.returnProperty];
  //     this.contextService.addToContext(action.config.key, foundElement);
  //   }
  // }

  // handleStringOperation(action, instance) {
  //   let lstr;
  //   let rstr;
  //   let concatSymbol;
  //   // for concatinating two strings
  //   if (action.config.operation === 'concat') {
  //     if (action.config.lstr && action.config.rstr !== undefined) {
  //       lstr = action.config.lstr;
  //       if (lstr.startsWith('#')) {
  //         lstr = this.contextService.getDataByString(lstr);
  //       }
  //     }
  //     if (action.config.rstr && action.config.rstr !== undefined) {
  //       rstr = action.config.rstr;
  //       if (rstr.startsWith('#')) {
  //         rstr = this.contextService.getDataByString(rstr);
  //       }
  //     }
  //     if (lstr !== undefined && rstr !== undefined && action.config.key !== undefined) {
  //       concatSymbol = action.config.concatSymbol;
  //       concatSymbol = concatSymbol ? concatSymbol : "_";
  //       const concatStr = lstr + concatSymbol + rstr;
  //       this.contextService.addToContext(action.config.key, concatStr);
  //     }
  //   }
  // }

  // handleLooperControlService(action, instance) {
  //   let looperData = [];
  //   let replaceTaskActions = [];
  //   let softwareTaskActions = [];
  //   let manualTaskActions = [];
  //   let commonTaskActions = [];

  //   let clearDefAndAssemLists = [{
  //     "type": "context",
  //     "config": {
  //       "requestMethod": "add",
  //       "key": "defectCodeList",
  //       "data": []
  //     },
  //     "eventSource": "click"
  //   },
  //   {
  //     "type": "context",
  //     "config": {
  //       "requestMethod": "add",
  //       "key": "assemblyCodeList",
  //       "data": []
  //     },
  //     "eventSource": "click"
  //   }];

  //   clearDefAndAssemLists.forEach((currentItem) => {
  //     this.handleAction(currentItem, instance);
  //   });

  //   commonTaskActions = [
  //     {
  //       "type": "microservice",
  //       "config": {
  //         "microserviceId": "getResultCodeByValidateResult",
  //         "requestMethod": "get",
  //         "params": {
  //           "bcn": "#repairUnitInfo.ITEM_BCN",
  //           "validateResult": 0
  //         }
  //       },
  //       "responseDependents": {
  //         "onSuccess": {
  //           "actions": [
  //             {
  //               "type": "context",
  //               "config": {
  //                 "requestMethod": "add",
  //                 "key": "resultCodesForDiscrepancy",
  //                 "data": "responseData"
  //               }
  //             },
  //             {
  //               "type": "updateComponent",
  //               "config": {
  //                 "key": "debugTimeoutUUID",
  //                 "properties": {
  //                   "disabled": true
  //                 }
  //               },
  //               "eventSource": "change"
  //             },
  //             {
  //               "type": "updateComponent",
  //               "config": {
  //                 "key": "debugResultCodesUUID",
  //                 "dropDownProperties": {
  //                   "options": "#resultCodesForDiscrepancy"
  //                 }
  //               }
  //             }
  //           ]
  //         },
  //         "onFailure": {
  //           "actions": [
  //             {
  //               "type": "context",
  //               "config": {
  //                 "requestMethod": "add",
  //                 "key": "errorDisp",
  //                 "data": "responseData"
  //               }
  //             },
  //             {
  //               "type": "updateComponent",
  //               "config": {
  //                 "key": "errorTitleUUID",
  //                 "properties": {
  //                   "titleValue": "#errorDisp",
  //                   "isShown": true
  //                 }
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     },
  //   ]

  //   looperData = this.contextService.getDataByKey(action.config.data);
  //   looperData.sort((a, b) => a.ACTIONID.localeCompare(b.ACTIONID));
  //   if (looperData !== undefined && looperData.length > 0) {
  //     looperData.sort((a, b) => a.ACTIONID.localeCompare(b.ACTIONID));
  //     looperData.forEach((item, index) => {

  //       item.ACTION_CODE_NAME = Number(item.ACTION_CODE_NAME);

  //       if (item.ACTION_CODE_NAME == 32 || item.ACTION_CODE_NAME == 34) {
  //         let disSoftAndRepTask = [
  //           {
  //             "type": "updateComponent",
  //             "eventSource": "click",
  //             "config": {
  //               "key": "replaceIconUUID",
  //               "properties": {
  //                 "disabled": true
  //               }
  //             }
  //           },
  //           {
  //             "type": "updateComponent",
  //             "eventSource": "click",
  //             "config": {
  //               "key": "softwareIconUUID",
  //               "properties": {
  //                 "disabled": true
  //               }
  //             }
  //           },
  //           {
  //             "type": "updateComponent",
  //             "eventSource": "click",
  //             "config": {
  //               "key": "manualIconUUID",
  //               "properties": {
  //                 "disabled": true
  //               }
  //             }
  //           }
  //         ];

  //         console.log(this.contextService);

  //         disSoftAndRepTask.forEach((currentItem) => {
  //           this.handleAction(currentItem, instance);
  //         });
  //       }

  //       let cabDropDownUUID = "createdCabDropDown" + index;
  //       let createdTaskQty = "createdTaskQty" + index;
  //       let averageValueForExistingTaskUUID = "averageValueForExistingTaskUUID" + index;
  //       let replaceDeleteButtonUUID = "replaceDeleteButtonUUID" + index;
  //       let createdReplaceCompleteButtonUUID = "createdReplaceCompleteButtonUUID" + index;
  //       let createdTaskUserSelectedMessageName = "createdTaskUserSelectedMessageName" + index;
  //       let createdTaskCabMessage = "createdTaskUserSelectedMessage" + index;
  //       let createdTaskCabMessageName = "createdTaskCabMessageName" + index;
  //       let partRepType = "partRepType" + index;
  //       let averagePartValueResp = "averagePartValueResp" + index;
  //       let currentTaskPanelId = "currentTaskPanelId" + index;
  //       let currentOccurenceData = "currentOccurenceData" + index;
  //       let finalPartNumber = "finalPartNumber" + index;
  //       let isPartIssued = "isPartIssued" + index;
  //       let itemActionID = "itemActionID" + index;
  //       let userSelectedPartNumber = "userSelectedPartNumber" + index;

  //       let cabMessagesResp = this.contextService.getDataByKey("cabMessagesResp");
  //       let defaultCab;
  //       if (cabMessagesResp && (item.ACTION_NOTE !== null)) {
  //         defaultCab = cabMessagesResp.filter((currentCab) => {
  //           return currentCab.cab === item.ACTION_NOTE;
  //         });
  //       } else {
  //         defaultCab = [{
  //           "message": "Select"
  //         }];
  //       }

  //       // replaceAssemblyCodesList.push(item.ASSEMBLY_CODE_NAME);
  //       // replaceDefectCodesList.push(item.DEFECT_CODE_NAME);
  //       const completeDefectName = item.DEFECT_CODE_NAME + '-' + item.DEFECT_CODE_DESC;
  //       replaceTaskActions = [
  //         {
  //           "type": "condition",
  //           "config": {
  //             "operation": "isEqualTo",
  //             "lhs": "#userSelectedClient",
  //             "rhs": "1030"
  //           },
  //           "eventSource": "change",
  //           "responseDependents": {
  //             "onSuccess": {
  //               "actions": [
  //                 {
  //                   "type": "condition",
  //                   "config": {
  //                     "operation": "isEqualTo",
  //                     "lhs": "#userSelectedContract",
  //                     "rhs": "14856"
  //                   },
  //                   "eventSource": "change",
  //                   "responseDependents": {
  //                     "onSuccess": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "ownerId",
  //                             "data": "1835"
  //                           },
  //                           "eventSource": "change"
  //                         }
  //                       ]
  //                     },
  //                     "onFailure": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "ownerId",
  //                             "data": "#repairUnitInfo.OWNER_ID"
  //                           },
  //                           "eventSource": "change"
  //                         }
  //                       ]
  //                     }
  //                   }
  //                 }
  //               ]
  //             },
  //             "onFailure": {
  //               "actions": [
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": "ownerId",
  //                     "data": "#repairUnitInfo.OWNER_ID"
  //                   },
  //                   "eventSource": "change"
  //                 }
  //               ]
  //             }
  //           }
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": userSelectedPartNumber,
  //             "data": item.DEFECT_NOTE
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": isPartIssued,
  //             "data": "false"
  //           }
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": itemActionID,
  //             "data": item.ACTIONID
  //           }
  //         },
  //         {
  //           "type": "microservice",
  //           "config": {
  //             "microserviceId": "getCompByAction",
  //             "isLocal": false,
  //             "LocalService": "assets/Responses/performFA.json",
  //             "requestMethod": "get",
  //             "params": {
  //               "actionId": "#" + itemActionID,
  //               "userName": "#userAccountInfo.PersonalDetails.USERID"
  //             }
  //           },
  //           "responseDependents": {
  //             "onSuccess": {
  //               "actions": [
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": "getCompByActionResp",
  //                     "data": "responseData"
  //                   }
  //                 },
  //                 {
  //                   "type": "condition",
  //                   "config": {
  //                     "operation": "isNotEmptyArray",
  //                     "lhs": "#getCompByActionResp"
  //                   },
  //                   "responseDependents": {
  //                     "onSuccess": {
  //                       "actions": [
  //                         {
  //                           "type": "condition",
  //                           "config": {
  //                             "operation": "isValid",
  //                             "lhs": "#getCompByActionResp",
  //                             "lhsKeyName": "TRX_TYPE",
  //                             "lhsKeyValue": "Issued",
  //                             "lhsSecondKeyName": "TRX_TYPE"
  //                           },
  //                           "responseDependents": {
  //                             "onSuccess": {
  //                               "actions": [
  //                                 {
  //                                   "type": "condition",
  //                                   "config": {
  //                                     "operation": "isEqualTo",
  //                                     "lhs": "#lhsValue",
  //                                     "rhs": "Issued"
  //                                   },
  //                                   "eventSource": "click",
  //                                   "responseDependents": {
  //                                     "onSuccess": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "context",
  //                                           "config": {
  //                                             "requestMethod": "add",
  //                                             "key": isPartIssued,
  //                                             "data": "true"
  //                                           }
  //                                         }
  //                                       ]
  //                                     },
  //                                     "onFailure": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "context",
  //                                           "config": {
  //                                             "requestMethod": "add",
  //                                             "key": isPartIssued,
  //                                             "data": "false"
  //                                           }
  //                                         }
  //                                       ]
  //                                     }
  //                                   }
  //                                 }
  //                               ]
  //                             },
  //                             "onFailure": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": isPartIssued,
  //                                     "data": "false"
  //                                   }
  //                                 }
  //                               ]
  //                             }
  //                           }
  //                         }

  //                       ]
  //                     },
  //                     "onFailure": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": isPartIssued,
  //                             "data": "false"
  //                           }
  //                         }
  //                       ]
  //                     }
  //                   }
  //                 },
  //                 {
  //                   "type": "microservice",
  //                   "eventSource": "click",
  //                   "config": {
  //                     "microserviceId": "getReqListByPN",
  //                     "requestMethod": "post",
  //                     "body": {
  //                       "partNo": "#" + userSelectedPartNumber,
  //                       "locationId": "#repairUnitInfo.LOCATION_ID",
  //                       "clientId": "#repairUnitInfo.CLIENT_ID",
  //                       "contractId": "#repairUnitInfo.CONTRACT_ID",
  //                       "ownerId": "#ownerId",
  //                       "username": "#loginUUID.username"
  //                     },
  //                     "toBeStringified": true
  //                   },
  //                   "responseDependents": {
  //                     "onSuccess": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "userSelectedPartDescription",
  //                             "data": item.PART_DESC
  //                           },
  //                           "eventSource": "change"
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "userSelectedCommodityName",
  //                             "data": item.ASSEMBLY_CODE_NAME
  //                           },
  //                           "eventSource": "change"
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "userSelectedDefect",
  //                             "data": item.DEFECT_CODE_NAME
  //                           },
  //                           "eventSource": "change"
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "userSelectedReplaceAction",
  //                             "data": item.ACTION_CODE_NAME
  //                           },
  //                           "eventSource": "change"
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "userSelectedDefectName",
  //                             "data": completeDefectName
  //                           },
  //                           "eventSource": "change"
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "getReqListByPNResp",
  //                             "data": "responseData"
  //                           }
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "getReqListByPNRespArrayData",
  //                             "data": "responseArray"
  //                           }
  //                         },
  //                         {
  //                           "type": "condition",
  //                           "config": {
  //                             "operation": "isNotEmptyArray",
  //                             "lhs": "#getReqListByPNResp"
  //                           },
  //                           "eventSource": "input",
  //                           "responseDependents": {
  //                             "onSuccess": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "userSelectedPartNumberId",
  //                                     "data": "#getReqListByPNRespArrayData.partId"
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "finalPartStockQuantity",
  //                                     "data": "#getReqListByPNRespArrayData.quantity"
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "condition",
  //                                   "config": {
  //                                     "operation": "isValid",
  //                                     "lhs": item.ACTION_NOTE
  //                                   },
  //                                   "eventSource": "change",
  //                                   "responseDependents": {
  //                                     "onSuccess": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "context",
  //                                           "config": {
  //                                             "requestMethod": "add",
  //                                             "key": finalPartNumber,
  //                                             "data": item.DEFECT_NOTE
  //                                           }
  //                                         }
  //                                       ]
  //                                     },
  //                                     "onFailure": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "context",
  //                                           "config": {
  //                                             "requestMethod": "add",
  //                                             "key": finalPartNumber,
  //                                             "data": "#getReqListByPNRespArrayData.partNo"
  //                                           }
  //                                         }
  //                                       ]
  //                                     }
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "userSelectedPartNumberName",
  //                                     "data": "#getReqListByPNRespArrayData.completePart"
  //                                   },
  //                                   "eventSource": "change"
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "userSelectedPartDescription",
  //                                     "data": "#getReqListByPNRespArrayData.partDesc"
  //                                   },
  //                                   "eventSource": "change"
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "quantity",
  //                                     "data": "Qty 1"
  //                                   },
  //                                   "eventSource": "click"
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "headerClass",
  //                                     "data": "body2"
  //                                   },
  //                                   "eventSource": "click"
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "displayQuantity",
  //                                     "data": ""
  //                                   },
  //                                   "eventSource": "click"
  //                                 }
  //                               ]
  //                             },
  //                             "onFailure": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "userSelectedPartNumberId",
  //                                     "data": item.PART_ID
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "finalPartStockQuantity",
  //                                     "data": 0
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": finalPartNumber,
  //                                     "data": "#" + userSelectedPartNumber
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "templateName",
  //                                     "data": "BYD_COM_HOLD_3"
  //                                   },
  //                                   "eventSource": "click"
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "financialCode",
  //                                     "data": "003"
  //                                   },
  //                                   "eventSource": "change"
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "quantity",
  //                                     "data": "Out of stock"
  //                                   },
  //                                   "eventSource": "click"
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "headerClass",
  //                                     "data": "light-red heading-eco-normal"
  //                                   },
  //                                   "eventSource": "click"
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "displayQuantity",
  //                                     "data": "Out of stock"
  //                                   },
  //                                   "eventSource": "click"
  //                                 }
  //                               ]
  //                             }
  //                           }
  //                         },
  //                         {
  //                           "type": "condition",
  //                           "config": {
  //                             "operation": "isValid",
  //                             "lhs": "#getRequisitionByBCNResp.requisitionId"
  //                           },
  //                           "responseDependents": {
  //                             "onSuccess": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "requisitionId",
  //                                     "data": "#getRequisitionByBCNResp.requisitionId"
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "config": {
  //                                     "key": "requisitionListButtonUUID",
  //                                     "properties": {
  //                                       "textValue": "- Saved",
  //                                       "textValueClass": "saved-green"
  //                                     }
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "requisitionListStatus",
  //                                     "data": "saved"
  //                                   }
  //                                 }
  //                               ]
  //                             },
  //                             "onFailure": {
  //                               "actions": [
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "config": {
  //                                     "key": "requisitionListButtonUUID",
  //                                     "properties": {
  //                                       "textValue": "- Unsaved",
  //                                       "textValueClass": "light-red body"
  //                                     }
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "requisitionListStatus",
  //                                     "data": "Unsaved"
  //                                   }
  //                                 }
  //                               ]
  //                             }
  //                           }
  //                         },
  //                         {
  //                           "type": "condition",
  //                           "config": {
  //                             "operation": "isValid",
  //                             "lhs": item.ACTION_NOTE
  //                           },
  //                           "eventSource": "click",
  //                           "responseDependents": {
  //                             "onSuccess": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "financialCode",
  //                                     "data": "003"
  //                                   },
  //                                   "eventSource": "click"
  //                                 }
  //                               ]
  //                             },
  //                             "onFailure": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "financialCode",
  //                                     "data": "001"
  //                                   },
  //                                   "eventSource": "click"
  //                                 }
  //                               ]
  //                             }
  //                           }
  //                         },
  //                         {
  //                           "type": "condition",
  //                           "config": {
  //                             "operation": "isEqualTo",
  //                             "lhs": "#" + isPartIssued,
  //                             "rhs": "true"
  //                           },
  //                           "responseDependents": {
  //                             "onSuccess": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "checkStatusPart",
  //                                     "data": "lineList and kardex fail"
  //                                   }
  //                                 }
  //                               ]
  //                             },
  //                             "onFailure": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "addToExistingContext",
  //                                     "target": "lineList",
  //                                     "sourceData": {
  //                                       "compLocation": "#repairUnitInfo.GEONAME",
  //                                       "partNumber": "#" + finalPartNumber,
  //                                       "defectName": "#userSelectedDefect",
  //                                       "itemBCN": "#repairUnitInfo.ITEM_BCN",
  //                                       "quantity": "1",
  //                                       "owner": "JGS BYDGOSZCZ",
  //                                       "condition": "Workable",
  //                                       "financialCode": "#financialCode",
  //                                       "priority": "Medium"
  //                                     }
  //                                   },
  //                                   "eventSource": "click"
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "addToExistingContext",
  //                                     "target": "kardexLineList",
  //                                     "sourceData": {
  //                                       "partId": "#userSelectedPartNumberId",
  //                                       "partNumber": "#" + finalPartNumber,
  //                                       "quantity": 1,
  //                                       "availQuantity": "#finalPartStockQuantity",
  //                                       "srcWarehouse": "HP LAPTOP WUR",
  //                                       "srcLocation": "TOWERS",
  //                                       "srcOwner": "JGS BYDGOSZCZ",
  //                                       "isSubstituted": "NO"
  //                                     }
  //                                   },
  //                                   "eventSource": "click"
  //                                 }
  //                               ]
  //                             }
  //                           }
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "previousWC",
  //                             "data": "Exit"
  //                           },
  //                           "eventSource": "click"
  //                         },
  //                         {
  //                           "type": "condition",
  //                           "config": {
  //                             "operation": "isEqualTo",
  //                             "lhs": "#previousWC",
  //                             "rhs": "Exit"
  //                           },
  //                           "eventSource": "click",
  //                           "responseDependents": {
  //                             "onSuccess": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "isFirstReplaceTaskCreated",
  //                                     "data": true
  //                                   },
  //                                   "eventSource": "click"
  //                                 },
  //                               ]
  //                             },
  //                             "onFailure": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "isFirstReplaceTaskCreated",
  //                                     "data": false
  //                                   },
  //                                   "eventSource": "click"
  //                                 }
  //                               ]
  //                             }
  //                           }
  //                         },
  //                         {
  //                           "type": "condition",
  //                           "config": {
  //                             "operation": "isValid",
  //                             "lhs": item.ACTION_NOTE
  //                           },
  //                           "eventSource": "click",
  //                           "responseDependents": {
  //                             "onSuccess": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "repairProcessType",
  //                                     "data": "Quote"
  //                                   },
  //                                   "eventSource": "change"
  //                                 },
  //                                 {
  //                                   "type": "condition",
  //                                   "config": {
  //                                     "operation": "isEqualTo",
  //                                     "lhs": "#" + isPartIssued,
  //                                     "rhs": "true"
  //                                   },
  //                                   "responseDependents": {
  //                                     "onSuccess": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "context",
  //                                           "config": {
  //                                             "requestMethod": "add",
  //                                             "key": "checkStatusPart",
  //                                             "data": "create component valid fail"
  //                                           }
  //                                         },
  //                                         {
  //                                           "type": "createComponent",
  //                                           "config": {
  //                                             "targetId": "pageUUID",
  //                                             "containerId": "prebodysectionone",
  //                                             "data": {
  //                                               "ctype": "taskPanel",
  //                                               "uuid": "replaceProcessTaskUUID",
  //                                               "uniqueUUID": true,
  //                                               "isblueBorder": true,
  //                                               "title": "",
  //                                               "columnWiseTitle": true,
  //                                               "header": {
  //                                                 "svgIcon": "replace",
  //                                                 "headerclass": "replaceheaderclass",
  //                                                 "statusIcon": "check_circle",
  //                                                 "statusClass": "complete-status",
  //                                                 "class": "complete-task"
  //                                               },
  //                                               "headerTitleLabels": [
  //                                                 "#userSelectedCommodityName",
  //                                                 "PN",
  //                                                 "Defect",
  //                                                 "Replace"
  //                                               ],
  //                                               "headerTitleValues": [
  //                                                 "",
  //                                                 item.DEFECT_NOTE,
  //                                                 "#userSelectedDefectName",
  //                                                 "part",
  //                                                 "Qty 1"
  //                                               ],
  //                                               "inputClasses": [
  //                                                 "parent1",
  //                                                 "parent2"
  //                                               ],
  //                                               "headerClasses": [
  //                                                 "#headerClass"
  //                                               ],
  //                                               "expanded": false,
  //                                               "hideToggle": true,
  //                                               "collapsedHeight": "40px",
  //                                               "expandedHeight": "40px",
  //                                               "bodyclass": "splitView",
  //                                               "taskpanelfooterclass": "d-flex justify-content-between",
  //                                               "leftDivclass": "width:50%",
  //                                               "rightDivclass": "width:50%",
  //                                               "visibility": true,
  //                                               "disabled": true,
  //                                               "hooks": [],
  //                                               "validations": [],
  //                                               "actions": [],
  //                                               "items": [],
  //                                               "footer": []
  //                                             }
  //                                           },
  //                                           "eventSource": "click"
  //                                         }
  //                                       ]
  //                                     },
  //                                     "onFailure": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "createComponent",
  //                                           "config": {
  //                                             "targetId": "pageUUID",
  //                                             "containerId": "prebodysectionone",
  //                                             "data": {
  //                                               "ctype": "taskPanel",
  //                                               "uuid": "replaceProcessTaskUUID",
  //                                               "uniqueUUID": true,
  //                                               "isblueBorder": true,
  //                                               "title": "",
  //                                               "columnWiseTitle": true,
  //                                               "header": {
  //                                                 "svgIcon": "replace",
  //                                                 "headerclass": "replaceheaderclass",
  //                                                 "statusIcon": "attach_money",
  //                                                 "statusClass": "incomplete-status margin-top-10 header-icon"
  //                                               },
  //                                               "headerTitleLabels": [
  //                                                 "#userSelectedCommodityName",
  //                                                 "PN",
  //                                                 "Defect",
  //                                                 "Replace"
  //                                               ],
  //                                               "headerTitleValues": [
  //                                                 "",
  //                                                 "#" + finalPartNumber,
  //                                                 "#userSelectedDefectName",
  //                                                 "part",
  //                                                 "#quantity"
  //                                               ],
  //                                               "inputClasses": [
  //                                                 "parent1",
  //                                                 "parent2"
  //                                               ],
  //                                               "headerClasses": [
  //                                                 "#headerClass"
  //                                               ],
  //                                               "expanded": false,
  //                                               "hideToggle": true,
  //                                               "collapsedHeight": "40px",
  //                                               "expandedHeight": "40px",
  //                                               "bodyclass": "splitView",
  //                                               "taskpanelfooterclass": "d-flex justify-content-between",
  //                                               "leftDivclass": "width:50%",
  //                                               "rightDivclass": "width:50%",
  //                                               "visibility": false,
  //                                               "hooks": [
  //                                                 {
  //                                                   "type": "context",
  //                                                   "config": {
  //                                                     "requestMethod": "addToExistingContext",
  //                                                     "target": "defectCodeList",
  //                                                     "sourceData": {
  //                                                       "defectCode": item.DEFECT_CODE_NAME
  //                                                     }
  //                                                   },
  //                                                   "hookType": "afterInit"
  //                                                 }, {
  //                                                   "type": "context",
  //                                                   "config": {
  //                                                     "requestMethod": "addToExistingContext",
  //                                                     "target": "assemblyCodeList",
  //                                                     "sourceData": {
  //                                                       "assemblyCode": item.ASSEMBLY_CODE_NAME
  //                                                     }
  //                                                   },
  //                                                   "hookType": "afterInit"
  //                                                 },
  //                                                 {
  //                                                   "type": "context",
  //                                                   "config": {
  //                                                     "requestMethod": "add",
  //                                                     "key": currentTaskPanelId,
  //                                                     "data": "#createdComponentUUID"
  //                                                   },
  //                                                   "hookType": "afterInit"
  //                                                 },
  //                                                 {
  //                                                   "type": "addOccurenceToContext",
  //                                                   "hookType": "afterInit",
  //                                                   "config": {
  //                                                     "target": "occurenceList",
  //                                                     "taskUuid": "#" + currentTaskPanelId,
  //                                                     "currentDefectCode": item.DEFECT_CODE_NAME,
  //                                                     "currentAssemblyCode": item.ASSEMBLY_CODE_NAME
  //                                                   },
  //                                                   "eventSource": "click"
  //                                                 },
  //                                                 {
  //                                                   "type": "microservice",
  //                                                   "eventSource": "click",
  //                                                   "hookType": "afterInit",
  //                                                   "config": {
  //                                                     "microserviceId": "averagepartvalueservice",
  //                                                     "requestMethod": "get",
  //                                                     "params": {
  //                                                       "pPartNo": item.DEFECT_NOTE,
  //                                                       "pLocationId": "#repairUnitInfo.LOCATION_ID",
  //                                                       "pClientId": "#repairUnitInfo.CLIENT_ID",
  //                                                       "pContractId": "#repairUnitInfo.CONTRACT_ID",
  //                                                       "pOwnerId": "#ownerId",
  //                                                       "pUserName": "#userAccountInfo.PersonalDetails.USERID"
  //                                                     }
  //                                                   },
  //                                                   "responseDependents": {
  //                                                     "onSuccess": {
  //                                                       "actions": [
  //                                                         {
  //                                                           "type": "context",
  //                                                           "config": {
  //                                                             "requestMethod": "add",
  //                                                             "key": averagePartValueResp,
  //                                                             "data": "responseArray"
  //                                                           }
  //                                                         },
  //                                                         {
  //                                                           "type": "updateComponent",
  //                                                           "eventSource": "click",
  //                                                           "config": {
  //                                                             "key": averageValueForExistingTaskUUID,
  //                                                             "properties": {
  //                                                               "titleValue": "#" + averagePartValueResp + ".averageAmount"
  //                                                             }
  //                                                           }
  //                                                         },
  //                                                         {
  //                                                           "type": "condition",
  //                                                           "config": {
  //                                                             "operation": "isValid",
  //                                                             "lhs": item.ACTION_NOTE
  //                                                           },
  //                                                           "eventSource": "click",
  //                                                           "responseDependents": {
  //                                                             "onSuccess": {
  //                                                               "actions": [
  //                                                                 {
  //                                                                   "type": "context",
  //                                                                   "config": {
  //                                                                     "requestMethod": "addToExistingContext",
  //                                                                     "target": "averageAmountList",
  //                                                                     "sourceData": {
  //                                                                       "averageAmount": "#" + averagePartValueResp + ".averageAmount",
  //                                                                       "partNo": "#" + averagePartValueResp + ".partNo",
  //                                                                       "actionNote": item.ACTION_NOTE
  //                                                                     }
  //                                                                   },
  //                                                                   "eventSource": "click"
  //                                                                 }
  //                                                               ]
  //                                                             },
  //                                                             "onFailure": {
  //                                                               "actions": [
  //                                                               ]
  //                                                             }
  //                                                           }
  //                                                         },
  //                                                         {
  //                                                           "type": "condition",
  //                                                           "hookType": "afterInit",
  //                                                           "config": {
  //                                                             "operation": "isEqualTo",
  //                                                             "lhs": item.ACTION_NOTE,
  //                                                             "rhs": "IW Part"
  //                                                           },
  //                                                           "eventSource": "click",
  //                                                           "responseDependents": {
  //                                                             "onSuccess": {
  //                                                               "actions": [
  //                                                                 {
  //                                                                   "type": "updateComponent",
  //                                                                   "eventSource": "click",
  //                                                                   "config": {
  //                                                                     "key": averageValueForExistingTaskUUID,
  //                                                                     "properties": {
  //                                                                       "titleValue": "0.00"
  //                                                                     }
  //                                                                   }
  //                                                                 }
  //                                                               ]
  //                                                             },
  //                                                             "onFailure": {
  //                                                               "actions": [
  //                                                               ]
  //                                                             }
  //                                                           }
  //                                                         }
  //                                                       ]
  //                                                     },
  //                                                     "onFailure": {
  //                                                       "actions": [
  //                                                         {
  //                                                           "type": "updateComponent",
  //                                                           "eventSource": "click",
  //                                                           "config": {
  //                                                             "key": averageValueForExistingTaskUUID,
  //                                                             "properties": {
  //                                                               "titleValue": "0.00"
  //                                                             }
  //                                                           }
  //                                                         }
  //                                                       ]
  //                                                     }
  //                                                   }
  //                                                 }
  //                                               ],
  //                                               "validations": [],
  //                                               "actions": [],
  //                                               "items": [
  //                                                 {
  //                                                   "ctype": "flexFields",
  //                                                   "uuid": "listTitleUUID",
  //                                                   "flexClass": "flex-display-space-between",
  //                                                   "items": [
  //                                                     {
  //                                                       "ctype": "flexFields",
  //                                                       "uuid": "listTitleUUID",
  //                                                       "flexClass": "",
  //                                                       "items": [
  //                                                         {
  //                                                           "ctype": "title",
  //                                                           "title": "CAB Code",
  //                                                           "titleClass": "greyish-black subtitle1 text-underline"
  //                                                         },
  //                                                         {
  //                                                           "ctype": "nativeDropdown",
  //                                                           "uuid": cabDropDownUUID,
  //                                                           "hooks": [],
  //                                                           "submitable": true,
  //                                                           "visibility": true,
  //                                                           "required": true,
  //                                                           "name": createdTaskQty,
  //                                                           "formGroupClass": "",
  //                                                           "dropdownClass": "dropdown-container textfield-container",
  //                                                           "labelClass": "body2",
  //                                                           "code": "message",
  //                                                           "displayValue": "cab",
  //                                                           "defaultValue": defaultCab[0].message.trim(),
  //                                                           "dataSource": "#cabMessagesResp",
  //                                                           "actions": [
  //                                                             {
  //                                                               "type": "context",
  //                                                               "config": {
  //                                                                 "requestMethod": "add",
  //                                                                 "key": createdTaskCabMessage,
  //                                                                 "data": "elementControlValue"
  //                                                               },
  //                                                               "eventSource": "change"
  //                                                             },
  //                                                             {
  //                                                               "type": "context",
  //                                                               "config": {
  //                                                                 "requestMethod": "add",
  //                                                                 "key": createdTaskCabMessageName,
  //                                                                 "data": "elementControlName"
  //                                                               },
  //                                                               "eventSource": "change"
  //                                                             },
  //                                                             {
  //                                                               "type": "updateComponent",
  //                                                               "eventSource": "change",
  //                                                               "config": {
  //                                                                 "key": createdTaskUserSelectedMessageName,
  //                                                                 "properties": {
  //                                                                   "titleValue": "#" + createdTaskCabMessage
  //                                                                 }
  //                                                               }
  //                                                             },
  //                                                             {
  //                                                               "type": "condition",
  //                                                               "eventSource": "change",
  //                                                               "config": {
  //                                                                 "operation": "isEqualTo",
  //                                                                 "lhs": "#" + createdTaskCabMessageName,
  //                                                                 "rhs": "IW Part"
  //                                                               },
  //                                                               "responseDependents": {
  //                                                                 "onSuccess": {
  //                                                                   "actions": [
  //                                                                     {
  //                                                                       "type": "updateComponent",
  //                                                                       "eventSource": "change",
  //                                                                       "config": {
  //                                                                         "key": averageValueForExistingTaskUUID,
  //                                                                         "properties": {
  //                                                                           "titleValue": "0.00"
  //                                                                         }
  //                                                                       }
  //                                                                     }, {
  //                                                                       "type": "context",
  //                                                                       "config": {
  //                                                                         "requestMethod": "add",
  //                                                                         "key": partRepType,
  //                                                                         "data": "IW"
  //                                                                       },
  //                                                                       "eventSource": "change"
  //                                                                     }
  //                                                                   ]
  //                                                                 },
  //                                                                 "onFailure": {
  //                                                                   "actions": [
  //                                                                     {
  //                                                                       "type": "condition",
  //                                                                       "config": {
  //                                                                         "operation": "isValid",
  //                                                                         "lhs": "#" + averagePartValueResp + ".averageAmount"
  //                                                                       },
  //                                                                       "eventSource": "change",
  //                                                                       "responseDependents": {
  //                                                                         "onSuccess": {
  //                                                                           "actions": [
  //                                                                             {
  //                                                                               "type": "updateComponent",
  //                                                                               "eventSource": "change",
  //                                                                               "config": {
  //                                                                                 "key": averageValueForExistingTaskUUID,
  //                                                                                 "properties": {
  //                                                                                   "titleValue": "#" + averagePartValueResp + ".averageAmount"
  //                                                                                 }
  //                                                                               }
  //                                                                             }
  //                                                                           ]
  //                                                                         },
  //                                                                         "onFailure": {
  //                                                                           "actions": [
  //                                                                             {
  //                                                                               "type": "updateComponent",
  //                                                                               "eventSource": "change",
  //                                                                               "config": {
  //                                                                                 "key": averageValueForExistingTaskUUID,
  //                                                                                 "properties": {
  //                                                                                   "titleValue": "0.00"
  //                                                                                 }
  //                                                                               }
  //                                                                             }
  //                                                                           ]
  //                                                                         }
  //                                                                       }
  //                                                                     },
  //                                                                     {
  //                                                                       "type": "context",
  //                                                                       "config": {
  //                                                                         "requestMethod": "add",
  //                                                                         "key": partRepType,
  //                                                                         "data": "CID"
  //                                                                       },
  //                                                                       "eventSource": "change"
  //                                                                     }
  //                                                                   ]
  //                                                                 }
  //                                                               }
  //                                                             },
  //                                                             {
  //                                                               "type": "condition",
  //                                                               "config": {
  //                                                                 "operation": "isEqualTo",
  //                                                                 "lhs": "#" + createdTaskCabMessage,
  //                                                                 "rhs": item.ACTION_NOTE
  //                                                               },
  //                                                               "eventSource": "change",
  //                                                               "responseDependents": {
  //                                                                 "onSuccess": {
  //                                                                   "actions": [
  //                                                                     {
  //                                                                       "type": "updateComponent",
  //                                                                       "eventSource": "change",
  //                                                                       "config": {
  //                                                                         "key": createdReplaceCompleteButtonUUID,
  //                                                                         "properties": {
  //                                                                           "disabled": true
  //                                                                         }
  //                                                                       }
  //                                                                     }
  //                                                                   ]
  //                                                                 },
  //                                                                 "onFailure": {
  //                                                                   "actions": [
  //                                                                     {
  //                                                                       "type": "updateComponent",
  //                                                                       "eventSource": "change",
  //                                                                       "config": {
  //                                                                         "key": createdReplaceCompleteButtonUUID,
  //                                                                         "properties": {
  //                                                                           "disabled": false
  //                                                                         }
  //                                                                       }
  //                                                                     }
  //                                                                   ]
  //                                                                 }
  //                                                               }
  //                                                             }
  //                                                           ]
  //                                                         }
  //                                                       ]
  //                                                     },
  //                                                     {
  //                                                       "ctype": "flexFields",
  //                                                       "uuid": "listTitleUUID",
  //                                                       "flexClass": "",
  //                                                       "items": [
  //                                                         {
  //                                                           "ctype": "title",
  //                                                           "title": "Message to Customer",
  //                                                           "titleClass": "greyish-black subtitle1 text-underline"
  //                                                         },
  //                                                         {
  //                                                           "ctype": "title",
  //                                                           "titleValue": defaultCab[0].message.trim(),
  //                                                           "titleClass": "greyish-black body",
  //                                                           "uuid": createdTaskUserSelectedMessageName
  //                                                         }
  //                                                       ]
  //                                                     },
  //                                                     {
  //                                                       "ctype": "flexFields",
  //                                                       "uuid": "listTitleUUID",
  //                                                       "flexClass": "",
  //                                                       "items": [
  //                                                         {
  //                                                           "ctype": "title",
  //                                                           "title": "Average Part Value $",
  //                                                           "titleClass": "title-color-white"
  //                                                         },
  //                                                         {
  //                                                           "ctype": "flexFields",
  //                                                           "uuid": "listTitleUUID",
  //                                                           "flexClass": "flex-display-flex-start",
  //                                                           "items": [
  //                                                             {
  //                                                               "ctype": "title",
  //                                                               "title": "Average Part Value: $",
  //                                                               "titleClass": "greyish-black body"
  //                                                             },
  //                                                             {
  //                                                               "ctype": "title",
  //                                                               "titleValue": "#" + averagePartValueResp + ".averageAmount",
  //                                                               "titleClass": "greyish-black body",
  //                                                               "uuid": averageValueForExistingTaskUUID
  //                                                             }
  //                                                           ]
  //                                                         }
  //                                                       ]
  //                                                     }
  //                                                   ]
  //                                                 }
  //                                               ],
  //                                               "footer": [
  //                                                 {
  //                                                   "ctype": "iconbutton",
  //                                                   "text": "Delete Failure Analysis",
  //                                                   "parentuuid": "#createdComponentUUID",
  //                                                   "uuid": replaceDeleteButtonUUID,
  //                                                   "visibility": true,
  //                                                   "disabled": false,
  //                                                   "type": "submit",
  //                                                   "hooks": [],
  //                                                   "validations": [],
  //                                                   "icon": "delete",
  //                                                   "iconButtonClass": "light-red",
  //                                                   "iconClass": "light-red",
  //                                                   "actions": [
  //                                                     {
  //                                                       "type": "getFilteredFromContext",
  //                                                       "config": {
  //                                                         "target": "#occurenceList",
  //                                                         "key": currentOccurenceData,
  //                                                         "properties": {
  //                                                           "key": "#" + currentTaskPanelId
  //                                                         }
  //                                                       },
  //                                                       "eventSource": "click"
  //                                                     },
  //                                                     {
  //                                                       "type": "condition",
  //                                                       "config": {
  //                                                         "operation": "isEqualTo",
  //                                                         "lhs": "#requisitionListStatus",
  //                                                         "rhs": "saved"
  //                                                       },
  //                                                       "eventSource": "click",
  //                                                       "responseDependents": {
  //                                                         "onSuccess": {
  //                                                           "actions": [
  //                                                             {
  //                                                               "type": "microservice",
  //                                                               "config": {
  //                                                                 "microserviceId": "cancelReqOrder",
  //                                                                 "requestMethod": "post",
  //                                                                 "body": {
  //                                                                   "reqOrderId": "#requisitionId",
  //                                                                   "canceledBy": "#loginUUID.username",
  //                                                                   "notes": "Cancel Requisition Order"
  //                                                                 },
  //                                                                 "toBeStringified": true
  //                                                               },
  //                                                               "responseDependents": {
  //                                                                 "onSuccess": {
  //                                                                   "actions": [
  //                                                                     {
  //                                                                       "type": "context",
  //                                                                       "config": {
  //                                                                         "requestMethod": "add",
  //                                                                         "key": "cancelReqOrderResp",
  //                                                                         "data": "responseData"
  //                                                                       }
  //                                                                     },
  //                                                                     {
  //                                                                       "type": "microservice",
  //                                                                       "eventSource": "click",
  //                                                                       "config": {
  //                                                                         "microserviceId": "cancelFA",
  //                                                                         "requestMethod": "post",
  //                                                                         "isLocal": false,
  //                                                                         "LocalService": "assets/Responses/performFA.json",
  //                                                                         "body": {
  //                                                                           "updateFailureAnalysisRequest": {
  //                                                                             "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                                             "assemblyCodeChangeList": {
  //                                                                               "assemblyCodeChange": [
  //                                                                                 {
  //                                                                                   "assemblyCode": item.ASSEMBLY_CODE_NAME,
  //                                                                                   "operation": "Delete",
  //                                                                                   "occurrence": "#" + currentOccurenceData + ".assemblycodeOccurence"
  //                                                                                 }
  //                                                                               ]
  //                                                                             }
  //                                                                           },
  //                                                                           "userPwd": {
  //                                                                             "password": "#loginUUID.password",
  //                                                                             "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                                                           },
  //                                                                           "operationTypes": "ProcessImmediate",
  //                                                                           "ip": "::1",
  //                                                                           "callSource": "FrontEnd",
  //                                                                           "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                                                           "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                                                                         },
  //                                                                         "toBeStringified": true
  //                                                                       },
  //                                                                       "responseDependents": {
  //                                                                         "onSuccess": {
  //                                                                           "actions": [
  //                                                                             {
  //                                                                               "type": "microservice",
  //                                                                               "eventSource": "click",
  //                                                                               "config": {
  //                                                                                 "microserviceId": "cancelFA",
  //                                                                                 "requestMethod": "post",
  //                                                                                 "isLocal": false,
  //                                                                                 "LocalService": "assets/Responses/performFA.json",
  //                                                                                 "body": {
  //                                                                                   "updateFailureAnalysisRequest": {
  //                                                                                     "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                                                     "defectCodeChangeList": {
  //                                                                                       "defectCodeChange": [
  //                                                                                         {
  //                                                                                           "defectCode": item.DEFECT_CODE_NAME,
  //                                                                                           "operation": "Delete",
  //                                                                                           "occurrence": "#" + currentOccurenceData + ".defectCodeOccurence"
  //                                                                                         }
  //                                                                                       ]
  //                                                                                     }
  //                                                                                   },
  //                                                                                   "userPwd": {
  //                                                                                     "password": "#loginUUID.password",
  //                                                                                     "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                                                                   },
  //                                                                                   "operationTypes": "ProcessImmediate",
  //                                                                                   "ip": "::1",
  //                                                                                   "callSource": "FrontEnd",
  //                                                                                   "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                                                                   "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                                                                                 },
  //                                                                                 "toBeStringified": true
  //                                                                               },
  //                                                                               "responseDependents": {
  //                                                                                 "onSuccess": {
  //                                                                                   "actions": [
  //                                                                                     {
  //                                                                                       "type": "deleteAndUpdateOccurence",
  //                                                                                       "config": {
  //                                                                                         "target": "#occurenceList",
  //                                                                                         "key": "#" + currentTaskPanelId,
  //                                                                                         "currentTaskData": "#" + currentOccurenceData
  //                                                                                       },
  //                                                                                       "eventSource": "click"
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "context",
  //                                                                                       "config": {
  //                                                                                         "requestMethod": "add",
  //                                                                                         "key": "requisitionListStatus",
  //                                                                                         "data": "Unsaved"
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "GetValueFromArray",
  //                                                                                       "config": {
  //                                                                                         "arrayData": "#debugFlexFieldData",
  //                                                                                         "PullValue": "currentTaskPanelData",
  //                                                                                         "key": "parentUUID",
  //                                                                                         "property": "flexFields",
  //                                                                                         "splice": true
  //                                                                                       },
  //                                                                                       "eventSource": "click"
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "errorPrepareAndRender",
  //                                                                                       "config": {
  //                                                                                         "key": "requisitionListButtonUUID",
  //                                                                                         "properties": {
  //                                                                                           "titleValue": "Requisition List ({0})",
  //                                                                                           "isShown": true
  //                                                                                         },
  //                                                                                         "valueArray": [
  //                                                                                           "#requisitionListLength"
  //                                                                                         ]
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "condition",
  //                                                                                       "config": {
  //                                                                                         "operation": "isValid",
  //                                                                                         "lhs": "#requisitionListLength"
  //                                                                                       },
  //                                                                                       "responseDependents": {
  //                                                                                         "onSuccess": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "config": {
  //                                                                                                 "key": "requisitionListButtonUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "textValue": "- Unsaved",
  //                                                                                                   "textValueClass": "light-red body"
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         },
  //                                                                                         "onFailure": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "config": {
  //                                                                                                 "key": "requisitionListButtonUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "textValue": ""
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "condition",
  //                                                                                               "config": {
  //                                                                                                 "operation": "isValid",
  //                                                                                                 "lhs": item.ACTION_NOTE
  //                                                                                               },
  //                                                                                               "eventSource": "click",
  //                                                                                               "responseDependents": {
  //                                                                                                 "onSuccess": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "templateName",
  //                                                                                                         "data": "BYD_COM_HOLD_3"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "financialCode",
  //                                                                                                         "data": "003"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 },
  //                                                                                                 "onFailure": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "templateName",
  //                                                                                                         "data": "BYD_COM_TOWERS_3"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "financialCode",
  //                                                                                                         "data": "001"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             }, {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "click",
  //                                                                                               "config": {
  //                                                                                                 "key": "debugTimeoutUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "visibility": true,
  //                                                                                                   "disabled": true
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "click",
  //                                                                                               "config": {
  //                                                                                                 "key": "debugNextUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "visibility": false,
  //                                                                                                   "disabled": true
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "click",
  //                                                                                               "config": {
  //                                                                                                 "key": "debugResultCodesUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "visibility": true,
  //                                                                                                   "disabled": true
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "isFirstReplaceTaskCreated",
  //                                                                                                 "data": false
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "condition",
  //                                                                                               "config": {
  //                                                                                                 "operation": "isEqualTo",
  //                                                                                                 "lhs": "#faultCheckboxSerial",
  //                                                                                                 "rhs": true
  //                                                                                               },
  //                                                                                               "eventSource": "click",
  //                                                                                               "responseDependents": {
  //                                                                                                 "onSuccess": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "templateName",
  //                                                                                                         "data": "BYD_COM_HOLD_3"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "financialCode",
  //                                                                                                         "data": "003"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "kardexRadioButtonUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "disabled": false,
  //                                                                                                           "checked": false
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "quoteRadioButtonUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "disabled": false,
  //                                                                                                           "checked": true
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "condition",
  //                                                                                                       "config": {
  //                                                                                                         "operation": "isValid",
  //                                                                                                         "lhs": "#userSelectedPartNumber"
  //                                                                                                       },
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "responseDependents": {
  //                                                                                                         "onSuccess": {
  //                                                                                                           "actions": [
  //                                                                                                             {
  //                                                                                                               "type": "condition",
  //                                                                                                               "eventSource": "change",
  //                                                                                                               "config": {
  //                                                                                                                 "operation": "isEqualTo",
  //                                                                                                                 "lhs": "#userSelectedCabMessageName",
  //                                                                                                                 "rhs": "IW Part"
  //                                                                                                               },
  //                                                                                                               "responseDependents": {
  //                                                                                                                 "onSuccess": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "errorPrepareAndRender",
  //                                                                                                                       "eventSource": "change",
  //                                                                                                                       "config": {
  //                                                                                                                         "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                                         "properties": {
  //                                                                                                                           "titleValue": "Average Part Value: $0.00",
  //                                                                                                                           "isShown": true
  //                                                                                                                         },
  //                                                                                                                         "valueArray": [
  //                                                                                                                           ""
  //                                                                                                                         ]
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 },
  //                                                                                                                 "onFailure": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "condition",
  //                                                                                                                       "eventSource": "change",
  //                                                                                                                       "config": {
  //                                                                                                                         "operation": "isValid",
  //                                                                                                                         "lhs": "#averagePartValueResp.averageAmount"
  //                                                                                                                       },
  //                                                                                                                       "responseDependents": {
  //                                                                                                                         "onSuccess": {
  //                                                                                                                           "actions": [
  //                                                                                                                             {
  //                                                                                                                               "type": "errorPrepareAndRender",
  //                                                                                                                               "eventSource": "change",
  //                                                                                                                               "config": {
  //                                                                                                                                 "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                                                 "properties": {
  //                                                                                                                                   "titleValue": "Average Part Value: ${0}",
  //                                                                                                                                   "isShown": true
  //                                                                                                                                 },
  //                                                                                                                                 "valueArray": [
  //                                                                                                                                   "#averagePartValueResp.averageAmount"
  //                                                                                                                                 ]
  //                                                                                                                               }
  //                                                                                                                             }
  //                                                                                                                           ]
  //                                                                                                                         },
  //                                                                                                                         "onFailure": {
  //                                                                                                                           "actions": [
  //                                                                                                                             {
  //                                                                                                                               "type": "errorPrepareAndRender",
  //                                                                                                                               "eventSource": "change",
  //                                                                                                                               "config": {
  //                                                                                                                                 "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                                                 "properties": {
  //                                                                                                                                   "titleValue": "Average Part Value: $0.00",
  //                                                                                                                                   "isShown": true
  //                                                                                                                                 },
  //                                                                                                                                 "valueArray": [
  //                                                                                                                                   ""
  //                                                                                                                                 ]
  //                                                                                                                               }
  //                                                                                                                             }
  //                                                                                                                           ]
  //                                                                                                                         }
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 }
  //                                                                                                               }
  //                                                                                                             }
  //                                                                                                           ]
  //                                                                                                         },
  //                                                                                                         "onFailure": {
  //                                                                                                           "actions": []
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "errorPrepareAndRender",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "stockQuantityUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "titleValue": ""
  //                                                                                                         },
  //                                                                                                         "valueArray": [
  //                                                                                                           ""
  //                                                                                                         ]
  //                                                                                                       }
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 },
  //                                                                                                 "onFailure": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "templateName",
  //                                                                                                         "data": "BYD_COM_TOWERS_3"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "financialCode",
  //                                                                                                         "data": "001"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "kardexRadioButtonUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "disabled": false,
  //                                                                                                           "checked": true
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "quoteRadioButtonUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "disabled": false,
  //                                                                                                           "checked": false
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "errorPrepareAndRender",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "titleValue": "",
  //                                                                                                           "isShown": true
  //                                                                                                         },
  //                                                                                                         "valueArray": [
  //                                                                                                           "0.00"
  //                                                                                                         ]
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "condition",
  //                                                                                                       "config": {
  //                                                                                                         "operation": "isValid",
  //                                                                                                         "lhs": "#userSelectedPartNumber"
  //                                                                                                       },
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "responseDependents": {
  //                                                                                                         "onSuccess": {
  //                                                                                                           "actions": [
  //                                                                                                             {
  //                                                                                                               "type": "microservice",
  //                                                                                                               "eventSource": "change",
  //                                                                                                               "config": {
  //                                                                                                                 "microserviceId": "stockqtyservice",
  //                                                                                                                 "requestMethod": "get",
  //                                                                                                                 "params": {
  //                                                                                                                   "partNo": "#userSelectedPartNumber",
  //                                                                                                                   "locationId": "#discrepancyUnitInfo.LOCATION_ID",
  //                                                                                                                   "clientId": "#discrepancyUnitInfo.CLIENT_ID",
  //                                                                                                                   "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
  //                                                                                                                   "ownerId": "#ownerId",
  //                                                                                                                   "username": "#loginUUID.username"
  //                                                                                                                 }
  //                                                                                                               },
  //                                                                                                               "responseDependents": {
  //                                                                                                                 "onSuccess": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "context",
  //                                                                                                                       "config": {
  //                                                                                                                         "requestMethod": "add",
  //                                                                                                                         "key": "stockQuantity",
  //                                                                                                                         "data": "responseArray"
  //                                                                                                                       }
  //                                                                                                                     },
  //                                                                                                                     {
  //                                                                                                                       "type": "context",
  //                                                                                                                       "config": {
  //                                                                                                                         "requestMethod": "add",
  //                                                                                                                         "key": "finalPartStockQuantity",
  //                                                                                                                         "data": "#stockQuantity.quantity"
  //                                                                                                                       }
  //                                                                                                                     },
  //                                                                                                                     {
  //                                                                                                                       "type": "errorPrepareAndRender",
  //                                                                                                                       "eventSource": "change",
  //                                                                                                                       "config": {
  //                                                                                                                         "key": "stockQuantityUUID",
  //                                                                                                                         "properties": {
  //                                                                                                                           "titleValue": "{0} Available"
  //                                                                                                                         },
  //                                                                                                                         "valueArray": [
  //                                                                                                                           "#stockQuantity.quantity"
  //                                                                                                                         ]
  //                                                                                                                       }
  //                                                                                                                     },
  //                                                                                                                     {
  //                                                                                                                       "type": "condition",
  //                                                                                                                       "eventSource": "change",
  //                                                                                                                       "config": {
  //                                                                                                                         "operation": "isEqualTo",
  //                                                                                                                         "lhs": "#stockQuantity.quantity",
  //                                                                                                                         "rhs": 0
  //                                                                                                                       },
  //                                                                                                                       "responseDependents": {
  //                                                                                                                         "onSuccess": {
  //                                                                                                                           "actions": [
  //                                                                                                                             {
  //                                                                                                                               "type": "updateComponent",
  //                                                                                                                               "config": {
  //                                                                                                                                 "key": "stockQuantityUUID",
  //                                                                                                                                 "updateParent": true,
  //                                                                                                                                 "properties": {
  //                                                                                                                                   "hidden": false,
  //                                                                                                                                   "labelClass": "light-red heading1 padding-left-10",
  //                                                                                                                                   "text": "0"
  //                                                                                                                                 }
  //                                                                                                                               }
  //                                                                                                                             }
  //                                                                                                                           ]
  //                                                                                                                         },
  //                                                                                                                         "onFailure": {
  //                                                                                                                           "actions": [
  //                                                                                                                             {
  //                                                                                                                               "type": "updateComponent",
  //                                                                                                                               "config": {
  //                                                                                                                                 "key": "stockQuantityUUID",
  //                                                                                                                                 "updateParent": true,
  //                                                                                                                                 "properties": {
  //                                                                                                                                   "hidden": false,
  //                                                                                                                                   "labelClass": "saved-green body"
  //                                                                                                                                 }
  //                                                                                                                               }
  //                                                                                                                             }
  //                                                                                                                           ]
  //                                                                                                                         }
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 },
  //                                                                                                                 "onFailure": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "context",
  //                                                                                                                       "config": {
  //                                                                                                                         "requestMethod": "add",
  //                                                                                                                         "key": "errorDisp",
  //                                                                                                                         "data": "responseData"
  //                                                                                                                       }
  //                                                                                                                     },
  //                                                                                                                     {
  //                                                                                                                       "type": "updateComponent",
  //                                                                                                                       "config": {
  //                                                                                                                         "key": "errorTitleUUID",
  //                                                                                                                         "properties": {
  //                                                                                                                           "titleValue": "#errorDisp",
  //                                                                                                                           "isShown": true
  //                                                                                                                         }
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 }
  //                                                                                                               }
  //                                                                                                             }
  //                                                                                                           ]
  //                                                                                                         },
  //                                                                                                         "onFailure": {
  //                                                                                                           "actions": [
  //                                                                                                             {
  //                                                                                                               "type": "errorPrepareAndRender",
  //                                                                                                               "eventSource": "change",
  //                                                                                                               "config": {
  //                                                                                                                 "key": "stockQuantityUUID",
  //                                                                                                                 "properties": {
  //                                                                                                                   "titleValue": ""
  //                                                                                                                 },
  //                                                                                                                 "valueArray": [
  //                                                                                                                   ""
  //                                                                                                                 ]
  //                                                                                                               }
  //                                                                                                             }
  //                                                                                                           ]
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "primaryFooterText": ""
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "microservice",
  //                                                                                               "config": {
  //                                                                                                 "microserviceId": "getResultCodeByValidateResult",
  //                                                                                                 "requestMethod": "get",
  //                                                                                                 "params": {
  //                                                                                                   "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                                                                   "validateResult": 0
  //                                                                                                 }
  //                                                                                               },
  //                                                                                               "responseDependents": {
  //                                                                                                 "onSuccess": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "resultCodesForDiscrepancy",
  //                                                                                                         "data": "responseData"
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "config": {
  //                                                                                                         "key": "debugTimeoutUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "disabled": true
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "config": {
  //                                                                                                         "key": "debugResultCodesUUID",
  //                                                                                                         "dropDownProperties": {
  //                                                                                                           "options": "#resultCodesForDiscrepancy"
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 },
  //                                                                                                 "onFailure": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "errorDisp",
  //                                                                                                         "data": "responseData"
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "config": {
  //                                                                                                         "key": "errorTitleUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "titleValue": "#errorDisp",
  //                                                                                                           "isShown": true
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         }
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "deleteComponent",
  //                                                                                       "eventSource": "click"
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "eventSource": "click",
  //                                                                                       "config": {
  //                                                                                         "key": "debugNextUUID",
  //                                                                                         "properties": {
  //                                                                                           "disabled": true
  //                                                                                         }
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "config": {
  //                                                                                         "key": "errorTitleUUID",
  //                                                                                         "properties": {
  //                                                                                           "titleValue": "",
  //                                                                                           "isShown": true
  //                                                                                         }
  //                                                                                       }
  //                                                                                     }
  //                                                                                   ]
  //                                                                                 },
  //                                                                                 "onFailure": {
  //                                                                                   "actions": [
  //                                                                                     {
  //                                                                                       "type": "context",
  //                                                                                       "config": {
  //                                                                                         "requestMethod": "add",
  //                                                                                         "key": "performFAError",
  //                                                                                         "data": "responseData"
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "config": {
  //                                                                                         "key": "errorTitleUUID",
  //                                                                                         "properties": {
  //                                                                                           "titleValue": "#performFAError",
  //                                                                                           "isShown": true
  //                                                                                         }
  //                                                                                       }
  //                                                                                     }
  //                                                                                   ]
  //                                                                                 }
  //                                                                               }
  //                                                                             }
  //                                                                           ]
  //                                                                         },
  //                                                                         "onFailure": {
  //                                                                           "actions": [
  //                                                                             {
  //                                                                               "type": "context",
  //                                                                               "config": {
  //                                                                                 "requestMethod": "add",
  //                                                                                 "key": "performFAError",
  //                                                                                 "data": "responseData"
  //                                                                               }
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "updateComponent",
  //                                                                               "config": {
  //                                                                                 "key": "errorTitleUUID",
  //                                                                                 "properties": {
  //                                                                                   "titleValue": "#performFAError",
  //                                                                                   "isShown": true
  //                                                                                 }
  //                                                                               }
  //                                                                             }
  //                                                                           ]
  //                                                                         }
  //                                                                       }
  //                                                                     }
  //                                                                   ]
  //                                                                 },
  //                                                                 "onFailure": {
  //                                                                   "actions": [
  //                                                                     {
  //                                                                       "type": "context",
  //                                                                       "config": {
  //                                                                         "requestMethod": "add",
  //                                                                         "key": "cancelReqOrderResp",
  //                                                                         "data": "responseData"
  //                                                                       }
  //                                                                     },
  //                                                                     {
  //                                                                       "type": "updateComponent",
  //                                                                       "config": {
  //                                                                         "key": "errorTitleUUID",
  //                                                                         "properties": {
  //                                                                           "titleValue": "#cancelReqOrderResp",
  //                                                                           "isShown": true
  //                                                                         }
  //                                                                       }
  //                                                                     }
  //                                                                   ]
  //                                                                 }
  //                                                               }
  //                                                             }
  //                                                           ]
  //                                                         },
  //                                                         "onFailure": {
  //                                                           "actions": [
  //                                                             {
  //                                                               "type": "microservice",
  //                                                               "eventSource": "click",
  //                                                               "config": {
  //                                                                 "microserviceId": "cancelFA",
  //                                                                 "requestMethod": "post",
  //                                                                 "isLocal": false,
  //                                                                 "LocalService": "assets/Responses/performFA.json",
  //                                                                 "body": {
  //                                                                   "updateFailureAnalysisRequest": {
  //                                                                     "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                                     "assemblyCodeChangeList": {
  //                                                                       "assemblyCodeChange": [
  //                                                                         {
  //                                                                           "assemblyCode": item.ASSEMBLY_CODE_NAME,
  //                                                                           "operation": "Delete",
  //                                                                           "occurrence": "#" + currentOccurenceData + ".assemblycodeOccurence"
  //                                                                         }
  //                                                                       ]
  //                                                                     }
  //                                                                   },
  //                                                                   "userPwd": {
  //                                                                     "password": "#loginUUID.password",
  //                                                                     "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                                                   },
  //                                                                   "operationTypes": "ProcessImmediate",
  //                                                                   "ip": "::1",
  //                                                                   "callSource": "FrontEnd",
  //                                                                   "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                                                   "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                                                                 },
  //                                                                 "toBeStringified": true
  //                                                               },
  //                                                               "responseDependents": {
  //                                                                 "onSuccess": {
  //                                                                   "actions": [
  //                                                                     {
  //                                                                       "type": "microservice",
  //                                                                       "eventSource": "click",
  //                                                                       "config": {
  //                                                                         "microserviceId": "cancelFA",
  //                                                                         "requestMethod": "post",
  //                                                                         "isLocal": false,
  //                                                                         "LocalService": "assets/Responses/performFA.json",
  //                                                                         "body": {
  //                                                                           "updateFailureAnalysisRequest": {
  //                                                                             "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                                             "defectCodeChangeList": {
  //                                                                               "defectCodeChange": [
  //                                                                                 {
  //                                                                                   "defectCode": item.DEFECT_CODE_NAME,
  //                                                                                   "operation": "Delete",
  //                                                                                   "occurrence": "#" + currentOccurenceData + ".defectCodeOccurence"
  //                                                                                 }
  //                                                                               ]
  //                                                                             }
  //                                                                           },
  //                                                                           "userPwd": {
  //                                                                             "password": "#loginUUID.password",
  //                                                                             "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                                                           },
  //                                                                           "operationTypes": "ProcessImmediate",
  //                                                                           "ip": "::1",
  //                                                                           "callSource": "FrontEnd",
  //                                                                           "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                                                           "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                                                                         },
  //                                                                         "toBeStringified": true
  //                                                                       },
  //                                                                       "responseDependents": {
  //                                                                         "onSuccess": {
  //                                                                           "actions": [
  //                                                                             {
  //                                                                               "type": "deleteAndUpdateOccurence",
  //                                                                               "config": {
  //                                                                                 "target": "#occurenceList",
  //                                                                                 "key": "#" + currentTaskPanelId,
  //                                                                                 "currentTaskData": "#" + currentOccurenceData
  //                                                                               },
  //                                                                               "eventSource": "click"
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "context",
  //                                                                               "config": {
  //                                                                                 "requestMethod": "add",
  //                                                                                 "key": "requisitionListStatus",
  //                                                                                 "data": "Unsaved"
  //                                                                               }
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "GetValueFromArray",
  //                                                                               "config": {
  //                                                                                 "arrayData": "#debugFlexFieldData",
  //                                                                                 "PullValue": "currentTaskPanelData",
  //                                                                                 "key": "parentUUID",
  //                                                                                 "property": "flexFields",
  //                                                                                 "splice": true
  //                                                                               },
  //                                                                               "eventSource": "click"
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "errorPrepareAndRender",
  //                                                                               "config": {
  //                                                                                 "key": "requisitionListButtonUUID",
  //                                                                                 "properties": {
  //                                                                                   "titleValue": "Requisition List ({0})",
  //                                                                                   "isShown": true
  //                                                                                 },
  //                                                                                 "valueArray": [
  //                                                                                   "#requisitionListLength"
  //                                                                                 ]
  //                                                                               }
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "condition",
  //                                                                               "config": {
  //                                                                                 "operation": "isValid",
  //                                                                                 "lhs": "#requisitionListLength"
  //                                                                               },
  //                                                                               "responseDependents": {
  //                                                                                 "onSuccess": {
  //                                                                                   "actions": [
  //                                                                                     {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "config": {
  //                                                                                         "key": "requisitionListButtonUUID",
  //                                                                                         "properties": {
  //                                                                                           "textValue": "- Unsaved",
  //                                                                                           "textValueClass": "light-red body"
  //                                                                                         }
  //                                                                                       }
  //                                                                                     }
  //                                                                                   ]
  //                                                                                 },
  //                                                                                 "onFailure": {
  //                                                                                   "actions": [
  //                                                                                     {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "config": {
  //                                                                                         "key": "requisitionListButtonUUID",
  //                                                                                         "properties": {
  //                                                                                           "textValue": ""
  //                                                                                         }
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "condition",
  //                                                                                       "config": {
  //                                                                                         "operation": "isValid",
  //                                                                                         "lhs": item.ACTION_NOTE
  //                                                                                       },
  //                                                                                       "eventSource": "click",
  //                                                                                       "responseDependents": {
  //                                                                                         "onSuccess": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "templateName",
  //                                                                                                 "data": "BYD_COM_HOLD_3"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "financialCode",
  //                                                                                                 "data": "003"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         },
  //                                                                                         "onFailure": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "templateName",
  //                                                                                                 "data": "BYD_COM_TOWERS_3"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "financialCode",
  //                                                                                                 "data": "001"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         }
  //                                                                                       }
  //                                                                                     }, {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "eventSource": "click",
  //                                                                                       "config": {
  //                                                                                         "key": "debugTimeoutUUID",
  //                                                                                         "properties": {
  //                                                                                           "visibility": true,
  //                                                                                           "disabled": true
  //                                                                                         }
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "eventSource": "click",
  //                                                                                       "config": {
  //                                                                                         "key": "debugNextUUID",
  //                                                                                         "properties": {
  //                                                                                           "visibility": false,
  //                                                                                           "disabled": true
  //                                                                                         }
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "eventSource": "click",
  //                                                                                       "config": {
  //                                                                                         "key": "debugResultCodesUUID",
  //                                                                                         "properties": {
  //                                                                                           "visibility": true,
  //                                                                                           "disabled": true
  //                                                                                         }
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "context",
  //                                                                                       "config": {
  //                                                                                         "requestMethod": "add",
  //                                                                                         "key": "isFirstReplaceTaskCreated",
  //                                                                                         "data": false
  //                                                                                       },
  //                                                                                       "eventSource": "click"
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "condition",
  //                                                                                       "config": {
  //                                                                                         "operation": "isEqualTo",
  //                                                                                         "lhs": "#faultCheckboxSerial",
  //                                                                                         "rhs": true
  //                                                                                       },
  //                                                                                       "eventSource": "click",
  //                                                                                       "responseDependents": {
  //                                                                                         "onSuccess": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "templateName",
  //                                                                                                 "data": "BYD_COM_HOLD_3"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "financialCode",
  //                                                                                                 "data": "003"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "change",
  //                                                                                               "config": {
  //                                                                                                 "key": "kardexRadioButtonUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "disabled": false,
  //                                                                                                   "checked": false
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "change",
  //                                                                                               "config": {
  //                                                                                                 "key": "quoteRadioButtonUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "disabled": false,
  //                                                                                                   "checked": true
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "condition",
  //                                                                                               "config": {
  //                                                                                                 "operation": "isValid",
  //                                                                                                 "lhs": "#userSelectedPartNumber"
  //                                                                                               },
  //                                                                                               "eventSource": "change",
  //                                                                                               "responseDependents": {
  //                                                                                                 "onSuccess": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "condition",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "operation": "isEqualTo",
  //                                                                                                         "lhs": "#userSelectedCabMessageName",
  //                                                                                                         "rhs": "IW Part"
  //                                                                                                       },
  //                                                                                                       "responseDependents": {
  //                                                                                                         "onSuccess": {
  //                                                                                                           "actions": [
  //                                                                                                             {
  //                                                                                                               "type": "errorPrepareAndRender",
  //                                                                                                               "eventSource": "change",
  //                                                                                                               "config": {
  //                                                                                                                 "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                                 "properties": {
  //                                                                                                                   "titleValue": "Average Part Value: $0.00",
  //                                                                                                                   "isShown": true
  //                                                                                                                 },
  //                                                                                                                 "valueArray": [
  //                                                                                                                   ""
  //                                                                                                                 ]
  //                                                                                                               }
  //                                                                                                             }
  //                                                                                                           ]
  //                                                                                                         },
  //                                                                                                         "onFailure": {
  //                                                                                                           "actions": [
  //                                                                                                             {
  //                                                                                                               "type": "condition",
  //                                                                                                               "eventSource": "change",
  //                                                                                                               "config": {
  //                                                                                                                 "operation": "isValid",
  //                                                                                                                 "lhs": "#averagePartValueResp.averageAmount"
  //                                                                                                               },
  //                                                                                                               "responseDependents": {
  //                                                                                                                 "onSuccess": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "errorPrepareAndRender",
  //                                                                                                                       "eventSource": "change",
  //                                                                                                                       "config": {
  //                                                                                                                         "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                                         "properties": {
  //                                                                                                                           "titleValue": "Average Part Value: ${0}",
  //                                                                                                                           "isShown": true
  //                                                                                                                         },
  //                                                                                                                         "valueArray": [
  //                                                                                                                           "#averagePartValueResp.averageAmount"
  //                                                                                                                         ]
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 },
  //                                                                                                                 "onFailure": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "errorPrepareAndRender",
  //                                                                                                                       "eventSource": "change",
  //                                                                                                                       "config": {
  //                                                                                                                         "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                                         "properties": {
  //                                                                                                                           "titleValue": "Average Part Value: $0.00",
  //                                                                                                                           "isShown": true
  //                                                                                                                         },
  //                                                                                                                         "valueArray": [
  //                                                                                                                           ""
  //                                                                                                                         ]
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 }
  //                                                                                                               }
  //                                                                                                             }
  //                                                                                                           ]
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 },
  //                                                                                                 "onFailure": {
  //                                                                                                   "actions": []
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "errorPrepareAndRender",
  //                                                                                               "eventSource": "change",
  //                                                                                               "config": {
  //                                                                                                 "key": "stockQuantityUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "titleValue": ""
  //                                                                                                 },
  //                                                                                                 "valueArray": [
  //                                                                                                   ""
  //                                                                                                 ]
  //                                                                                               }
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         },
  //                                                                                         "onFailure": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "templateName",
  //                                                                                                 "data": "BYD_COM_TOWERS_3"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "financialCode",
  //                                                                                                 "data": "001"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "change",
  //                                                                                               "config": {
  //                                                                                                 "key": "kardexRadioButtonUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "disabled": false,
  //                                                                                                   "checked": true
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "change",
  //                                                                                               "config": {
  //                                                                                                 "key": "quoteRadioButtonUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "disabled": false,
  //                                                                                                   "checked": false
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "errorPrepareAndRender",
  //                                                                                               "eventSource": "change",
  //                                                                                               "config": {
  //                                                                                                 "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "titleValue": "",
  //                                                                                                   "isShown": true
  //                                                                                                 },
  //                                                                                                 "valueArray": [
  //                                                                                                   "0.00"
  //                                                                                                 ]
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "condition",
  //                                                                                               "config": {
  //                                                                                                 "operation": "isValid",
  //                                                                                                 "lhs": "#userSelectedPartNumber"
  //                                                                                               },
  //                                                                                               "eventSource": "change",
  //                                                                                               "responseDependents": {
  //                                                                                                 "onSuccess": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "microservice",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "microserviceId": "stockqtyservice",
  //                                                                                                         "requestMethod": "get",
  //                                                                                                         "params": {
  //                                                                                                           "partNo": "#userSelectedPartNumber",
  //                                                                                                           "locationId": "#discrepancyUnitInfo.LOCATION_ID",
  //                                                                                                           "clientId": "#discrepancyUnitInfo.CLIENT_ID",
  //                                                                                                           "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
  //                                                                                                           "ownerId": "#ownerId",
  //                                                                                                           "username": "#loginUUID.username"
  //                                                                                                         }
  //                                                                                                       },
  //                                                                                                       "responseDependents": {
  //                                                                                                         "onSuccess": {
  //                                                                                                           "actions": [
  //                                                                                                             {
  //                                                                                                               "type": "context",
  //                                                                                                               "config": {
  //                                                                                                                 "requestMethod": "add",
  //                                                                                                                 "key": "stockQuantity",
  //                                                                                                                 "data": "responseArray"
  //                                                                                                               }
  //                                                                                                             },
  //                                                                                                             {
  //                                                                                                               "type": "context",
  //                                                                                                               "config": {
  //                                                                                                                 "requestMethod": "add",
  //                                                                                                                 "key": "finalPartStockQuantity",
  //                                                                                                                 "data": "#stockQuantity.quantity"
  //                                                                                                               }
  //                                                                                                             },
  //                                                                                                             {
  //                                                                                                               "type": "errorPrepareAndRender",
  //                                                                                                               "eventSource": "change",
  //                                                                                                               "config": {
  //                                                                                                                 "key": "stockQuantityUUID",
  //                                                                                                                 "properties": {
  //                                                                                                                   "titleValue": "{0} Available"
  //                                                                                                                 },
  //                                                                                                                 "valueArray": [
  //                                                                                                                   "#stockQuantity.quantity"
  //                                                                                                                 ]
  //                                                                                                               }
  //                                                                                                             },
  //                                                                                                             {
  //                                                                                                               "type": "condition",
  //                                                                                                               "eventSource": "change",
  //                                                                                                               "config": {
  //                                                                                                                 "operation": "isEqualTo",
  //                                                                                                                 "lhs": "#stockQuantity.quantity",
  //                                                                                                                 "rhs": 0
  //                                                                                                               },
  //                                                                                                               "responseDependents": {
  //                                                                                                                 "onSuccess": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "updateComponent",
  //                                                                                                                       "config": {
  //                                                                                                                         "key": "stockQuantityUUID",
  //                                                                                                                         "updateParent": true,
  //                                                                                                                         "properties": {
  //                                                                                                                           "hidden": false,
  //                                                                                                                           "labelClass": "light-red heading1 padding-left-10",
  //                                                                                                                           "text": "0"
  //                                                                                                                         }
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 },
  //                                                                                                                 "onFailure": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "updateComponent",
  //                                                                                                                       "config": {
  //                                                                                                                         "key": "stockQuantityUUID",
  //                                                                                                                         "updateParent": true,
  //                                                                                                                         "properties": {
  //                                                                                                                           "hidden": false,
  //                                                                                                                           "labelClass": "saved-green body"
  //                                                                                                                         }
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 }
  //                                                                                                               }
  //                                                                                                             }
  //                                                                                                           ]
  //                                                                                                         },
  //                                                                                                         "onFailure": {
  //                                                                                                           "actions": [
  //                                                                                                             {
  //                                                                                                               "type": "context",
  //                                                                                                               "config": {
  //                                                                                                                 "requestMethod": "add",
  //                                                                                                                 "key": "errorDisp",
  //                                                                                                                 "data": "responseData"
  //                                                                                                               }
  //                                                                                                             },
  //                                                                                                             {
  //                                                                                                               "type": "updateComponent",
  //                                                                                                               "config": {
  //                                                                                                                 "key": "errorTitleUUID",
  //                                                                                                                 "properties": {
  //                                                                                                                   "titleValue": "#errorDisp",
  //                                                                                                                   "isShown": true
  //                                                                                                                 }
  //                                                                                                               }
  //                                                                                                             }
  //                                                                                                           ]
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 },
  //                                                                                                 "onFailure": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "errorPrepareAndRender",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "stockQuantityUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "titleValue": ""
  //                                                                                                         },
  //                                                                                                         "valueArray": [
  //                                                                                                           ""
  //                                                                                                         ]
  //                                                                                                       }
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "change",
  //                                                                                               "config": {
  //                                                                                                 "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "primaryFooterText": ""
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         }
  //                                                                                       }
  //                                                                                     }, {
  //                                                                                       "type": "microservice",
  //                                                                                       "config": {
  //                                                                                         "microserviceId": "getResultCodeByValidateResult",
  //                                                                                         "requestMethod": "get",
  //                                                                                         "params": {
  //                                                                                           "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                                                           "validateResult": 0
  //                                                                                         }
  //                                                                                       },
  //                                                                                       "responseDependents": {
  //                                                                                         "onSuccess": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "resultCodesForDiscrepancy",
  //                                                                                                 "data": "responseData"
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "config": {
  //                                                                                                 "key": "debugTimeoutUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "disabled": true
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "config": {
  //                                                                                                 "key": "debugResultCodesUUID",
  //                                                                                                 "dropDownProperties": {
  //                                                                                                   "options": "#resultCodesForDiscrepancy"
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         },
  //                                                                                         "onFailure": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "errorDisp",
  //                                                                                                 "data": "responseData"
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "config": {
  //                                                                                                 "key": "errorTitleUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "titleValue": "#errorDisp",
  //                                                                                                   "isShown": true
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         }
  //                                                                                       }
  //                                                                                     }
  //                                                                                   ]
  //                                                                                 }
  //                                                                               }
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "deleteComponent",
  //                                                                               "eventSource": "click"
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "updateComponent",
  //                                                                               "config": {
  //                                                                                 "key": "errorTitleUUID",
  //                                                                                 "properties": {
  //                                                                                   "titleValue": "",
  //                                                                                   "isShown": true
  //                                                                                 }
  //                                                                               }
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "updateComponent",
  //                                                                               "eventSource": "click",
  //                                                                               "config": {
  //                                                                                 "key": "debugNextUUID",
  //                                                                                 "properties": {
  //                                                                                   "disabled": true
  //                                                                                 }
  //                                                                               }
  //                                                                             }
  //                                                                           ]
  //                                                                         },
  //                                                                         "onFailure": {
  //                                                                           "actions": [
  //                                                                             {
  //                                                                               "type": "context",
  //                                                                               "config": {
  //                                                                                 "requestMethod": "add",
  //                                                                                 "key": "performFAError",
  //                                                                                 "data": "responseData"
  //                                                                               }
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "updateComponent",
  //                                                                               "config": {
  //                                                                                 "key": "errorTitleUUID",
  //                                                                                 "properties": {
  //                                                                                   "titleValue": "#performFAError",
  //                                                                                   "isShown": true
  //                                                                                 }
  //                                                                               }
  //                                                                             }
  //                                                                           ]
  //                                                                         }
  //                                                                       }
  //                                                                     }
  //                                                                   ]
  //                                                                 },
  //                                                                 "onFailure": {
  //                                                                   "actions": [
  //                                                                     {
  //                                                                       "type": "context",
  //                                                                       "config": {
  //                                                                         "requestMethod": "add",
  //                                                                         "key": "performFAError",
  //                                                                         "data": "responseData"
  //                                                                       }
  //                                                                     },
  //                                                                     {
  //                                                                       "type": "updateComponent",
  //                                                                       "config": {
  //                                                                         "key": "errorTitleUUID",
  //                                                                         "properties": {
  //                                                                           "titleValue": "#performFAError",
  //                                                                           "isShown": true
  //                                                                         }
  //                                                                       }
  //                                                                     }
  //                                                                   ]
  //                                                                 }
  //                                                               }
  //                                                             }
  //                                                           ]
  //                                                         }
  //                                                       }
  //                                                     }
  //                                                   ]
  //                                                 },
  //                                                 {
  //                                                   "ctype": "button",
  //                                                   "color": "primary",
  //                                                   "text": "Complete",
  //                                                   "class": "primary-btn",
  //                                                   "checkGroupValidity": false,
  //                                                   "uuid": createdReplaceCompleteButtonUUID,
  //                                                   "parentuuid": "#createdComponentUUID",
  //                                                   "visibility": true,
  //                                                   "disabled": true,
  //                                                   "type": "submit",
  //                                                   "tooltip": "",
  //                                                   "hooks": [],
  //                                                   "validations": [],
  //                                                   "actions": [
  //                                                     {
  //                                                       "type": "microservice",
  //                                                       "eventSource": "click",
  //                                                       "config": {
  //                                                         "microserviceId": "performFA",
  //                                                         "requestMethod": "post",
  //                                                         "isLocal": false,
  //                                                         "LocalService": "assets/Responses/performFA.json",
  //                                                         "body": {
  //                                                           "updateFailureAnalysisRequest": {
  //                                                             "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                             "actionCodeChangeList": {
  //                                                               "actionCodeChange": [
  //                                                                 {
  //                                                                   "assemblyCode": {
  //                                                                     "occurrence": 1,
  //                                                                     "value": item.ASSEMBLY_CODE_NAME
  //                                                                   },
  //                                                                   "defectCode": {
  //                                                                     "occurrence": 1,
  //                                                                     "value": item.DEFECT_CODE_NAME
  //                                                                   },
  //                                                                   "notes": "#" + createdTaskCabMessageName,
  //                                                                   "actionCode": item.ACTION_CODE_NAME,
  //                                                                   "operation": "Update",
  //                                                                   "flexFieldList": {
  //                                                                     "flexField": [
  //                                                                       {
  //                                                                         "name": "Part rep. Type",
  //                                                                         "value": "#" + partRepType
  //                                                                       }
  //                                                                     ]
  //                                                                   }
  //                                                                 }
  //                                                               ]
  //                                                             }
  //                                                           },
  //                                                           "userPwd": {
  //                                                             "password": "#loginUUID.password",
  //                                                             "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                                           },
  //                                                           "operationTypes": "ProcessImmediate",
  //                                                           "ip": "::1",
  //                                                           "callSource": "FrontEnd",
  //                                                           "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                                           "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                                                         },
  //                                                         "toBeStringified": true
  //                                                       },
  //                                                       "responseDependents": {
  //                                                         "onSuccess": {
  //                                                           "actions": [
  //                                                             {
  //                                                               "type": "updateComponent",
  //                                                               "eventSource": "click",
  //                                                               "config": {
  //                                                                 "key": "#" + currentTaskPanelId,
  //                                                                 "isTaskPanel": true,
  //                                                                 "properties": {
  //                                                                   "expanded": false
  //                                                                 }
  //                                                               }
  //                                                             },
  //                                                             {
  //                                                               "type": "updateComponent",
  //                                                               "eventSource": "click",
  //                                                               "config": {
  //                                                                 "key": createdReplaceCompleteButtonUUID,
  //                                                                 "properties": {
  //                                                                   "disabled": true
  //                                                                 }
  //                                                               }
  //                                                             }
  //                                                           ]
  //                                                         },
  //                                                         "onFailure": {
  //                                                           "actions": [
  //                                                             {
  //                                                               "type": "context",
  //                                                               "config": {
  //                                                                 "requestMethod": "add",
  //                                                                 "key": "performFAError",
  //                                                                 "data": "responseData"
  //                                                               }
  //                                                             },
  //                                                             {
  //                                                               "type": "updateComponent",
  //                                                               "config": {
  //                                                                 "key": "errorTitleUUID",
  //                                                                 "properties": {
  //                                                                   "titleValue": "#performFAError",
  //                                                                   "isShown": true
  //                                                                 }
  //                                                               }
  //                                                             }
  //                                                           ]
  //                                                         }
  //                                                       }
  //                                                     },
  //                                                     {
  //                                                       "type": "updateComponent",
  //                                                       "eventSource": "click",
  //                                                       "config": {
  //                                                         "key": "#" + currentTaskPanelId,
  //                                                         "isTaskPanel": true,
  //                                                         "properties": {
  //                                                           "expanded": false
  //                                                         }
  //                                                       }
  //                                                     }
  //                                                   ]
  //                                                 }
  //                                               ]
  //                                             }
  //                                           },
  //                                           "eventSource": "click"
  //                                         }
  //                                       ]
  //                                     }
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "condition",
  //                                   "config": {
  //                                     "operation": "isEqualTo",
  //                                     "lhs": "#previousWC",
  //                                     "rhs": "Exit"
  //                                   },
  //                                   "eventSource": "click",
  //                                   "responseDependents": {
  //                                     "onSuccess": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "enableComponent",
  //                                           "config": {
  //                                             "key": cabDropDownUUID,
  //                                             "property": createdTaskQty,
  //                                             "isNotReset": true
  //                                           },
  //                                           "eventSource": "click"
  //                                         }
  //                                       ]
  //                                     },
  //                                     "onFailure": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "disableComponent",
  //                                           "config": {
  //                                             "key": cabDropDownUUID,
  //                                             "property": createdTaskQty,
  //                                             "isNotReset": true
  //                                           },
  //                                           "eventSource": "click"
  //                                         }
  //                                       ]
  //                                     }
  //                                   }
  //                                 }
  //                               ]
  //                             },
  //                             "onFailure": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "repairProcessType",
  //                                     "data": "Kardex"
  //                                   },
  //                                   "eventSource": "change"
  //                                 },
  //                                 {
  //                                   "type": "condition",
  //                                   "config": {
  //                                     "operation": "isEqualTo",
  //                                     "lhs": "#" + isPartIssued,
  //                                     "rhs": "true"
  //                                   },
  //                                   "responseDependents": {
  //                                     "onSuccess": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "context",
  //                                           "config": {
  //                                             "requestMethod": "add",
  //                                             "key": "checkStatusPart",
  //                                             "data": "cc non valid fail"
  //                                           }
  //                                         },
  //                                         {
  //                                           "type": "createComponent",
  //                                           "config": {
  //                                             "targetId": "pageUUID",
  //                                             "containerId": "prebodysectionone",
  //                                             "data": {
  //                                               "ctype": "taskPanel",
  //                                               "uuid": "replaceProcessTaskUUID",
  //                                               "uniqueUUID": true,
  //                                               "updateUUID": false,
  //                                               "isblueBorder": true,
  //                                               "title": "",
  //                                               "columnWiseTitle": true,
  //                                               "header": {
  //                                                 "svgIcon": "replace",
  //                                                 "headerclass": "replaceheaderclass",
  //                                                 "statusIcon": "check_circle",
  //                                                 "statusClass": "complete-status",
  //                                                 "class": "complete-task"
  //                                               },
  //                                               "headerTitleLabels": [
  //                                                 "#userSelectedCommodityName",
  //                                                 "PN",
  //                                                 "Defect",
  //                                                 "Replace"
  //                                               ],
  //                                               "headerTitleValues": [
  //                                                 "",
  //                                                 item.DEFECT_NOTE,
  //                                                 "#userSelectedDefectName",
  //                                                 "part",
  //                                                 "Qty 1"
  //                                               ],
  //                                               "inputClasses": [
  //                                                 "parent1",
  //                                                 "parent2"
  //                                               ],
  //                                               "headerClasses": [
  //                                                 "#headerClass"
  //                                               ],
  //                                               "expanded": false,
  //                                               "disabled": true,
  //                                               "hideToggle": true,
  //                                               "collapsedHeight": "40px",
  //                                               "expandedHeight": "40px",
  //                                               "bodyclass": "splitView",
  //                                               "taskpanelfooterclass": "d-flex justify-content-between",
  //                                               "leftDivclass": "width:50%",
  //                                               "rightDivclass": "width:50%",
  //                                               "visibility": true,
  //                                               "hooks": [],
  //                                               "validations": [],
  //                                               "actions": [],
  //                                               "items": [],
  //                                               "footer": []
  //                                             }
  //                                           },
  //                                           "eventSource": "click"
  //                                         }
  //                                       ]
  //                                     },
  //                                     "onFailure": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "createComponent",
  //                                           "config": {
  //                                             "targetId": "pageUUID",
  //                                             "containerId": "prebodysectionone",
  //                                             "data": {
  //                                               "ctype": "taskPanel",
  //                                               "uuid": "replaceProcessTaskUUID",
  //                                               "uniqueUUID": true,
  //                                               "updateUUID": false,
  //                                               "isblueBorder": true,
  //                                               "title": "",
  //                                               "columnWiseTitle": true,
  //                                               "header": {
  //                                                 "svgIcon": "replace",
  //                                                 "headerclass": "replaceheaderclass",
  //                                                 "statusIcon": "shopping_cart",
  //                                                 "statusClass": "incomplete-status margin-top-10 header-icon"
  //                                               },
  //                                               "headerTitleLabels": [
  //                                                 "#userSelectedCommodityName",
  //                                                 "PN",
  //                                                 "Defect",
  //                                                 "Replace"
  //                                               ],
  //                                               "headerTitleValues": [
  //                                                 "",
  //                                                 "#" + finalPartNumber,
  //                                                 "#userSelectedDefectName",
  //                                                 "part",
  //                                                 "#quantity"
  //                                               ],
  //                                               "inputClasses": [
  //                                                 "parent1",
  //                                                 "parent2"
  //                                               ],
  //                                               "headerClasses": [
  //                                                 "#headerClass"
  //                                               ],
  //                                               "expanded": false,
  //                                               "hideToggle": true,
  //                                               "collapsedHeight": "40px",
  //                                               "expandedHeight": "40px",
  //                                               "bodyclass": "splitView",
  //                                               "taskpanelfooterclass": "d-flex justify-content-between",
  //                                               "leftDivclass": "width:50%",
  //                                               "rightDivclass": "width:50%",
  //                                               "visibility": false,
  //                                               "hooks": [
  //                                                 {
  //                                                   "type": "context",
  //                                                   "config": {
  //                                                     "requestMethod": "addToExistingContext",
  //                                                     "target": "defectCodeList",
  //                                                     "sourceData": {
  //                                                       "defectCode": item.DEFECT_CODE_NAME
  //                                                     }
  //                                                   },
  //                                                   "hookType": "afterInit"
  //                                                 }, {
  //                                                   "type": "context",
  //                                                   "config": {
  //                                                     "requestMethod": "addToExistingContext",
  //                                                     "target": "assemblyCodeList",
  //                                                     "sourceData": {
  //                                                       "assemblyCode": item.ASSEMBLY_CODE_NAME
  //                                                     }
  //                                                   },
  //                                                   "hookType": "afterInit"
  //                                                 },
  //                                                 {
  //                                                   "type": "context",
  //                                                   "config": {
  //                                                     "requestMethod": "add",
  //                                                     "key": currentTaskPanelId,
  //                                                     "data": "#createdComponentUUID"
  //                                                   },
  //                                                   "hookType": "afterInit"
  //                                                 },
  //                                                 {
  //                                                   "type": "addOccurenceToContext",
  //                                                   "hookType": "afterInit",
  //                                                   "config": {
  //                                                     "target": "occurenceList",
  //                                                     "taskUuid": "#" + currentTaskPanelId,
  //                                                     "currentDefectCode": item.DEFECT_CODE_NAME,
  //                                                     "currentAssemblyCode": item.ASSEMBLY_CODE_NAME
  //                                                   },
  //                                                   "eventSource": "click"
  //                                                 }
  //                                               ],
  //                                               "validations": [],
  //                                               "actions": [],
  //                                               "items": [
  //                                                 {
  //                                                   "ctype": "title",
  //                                                   "title": "Defective Part",
  //                                                   "titleClass": "greyish-black subtitle1 text-underline"
  //                                                 },
  //                                                 {
  //                                                   "ctype": "title",
  //                                                   "titleValue": "#" + userSelectedPartNumber,
  //                                                   "titleClass": "greyish-black body"
  //                                                 },
  //                                                 {
  //                                                   "ctype": "title",
  //                                                   "title": "New Part",
  //                                                   "titleClass": "greyish-black subtitle1 text-underline"
  //                                                 },
  //                                                 {
  //                                                   "ctype": "title",
  //                                                   "titleValue": "#" + finalPartNumber,
  //                                                   "titleClass": "greyish-black body"
  //                                                 }
  //                                               ],
  //                                               "footer": [
  //                                                 {
  //                                                   "ctype": "iconbutton",
  //                                                   "text": "Delete Failure Analysis",
  //                                                   "parentuuid": "#createdComponentUUID",
  //                                                   "uuid": replaceDeleteButtonUUID,
  //                                                   "visibility": true,
  //                                                   "disabled": false,
  //                                                   "type": "submit",
  //                                                   "hooks": [],
  //                                                   "validations": [],
  //                                                   "icon": "delete",
  //                                                   "iconButtonClass": "light-red",
  //                                                   "iconClass": "light-red",
  //                                                   "actions": [
  //                                                     {
  //                                                       "type": "getFilteredFromContext",
  //                                                       "config": {
  //                                                         "target": "#occurenceList",
  //                                                         "key": currentOccurenceData,
  //                                                         "properties": {
  //                                                           "key": "#" + currentTaskPanelId
  //                                                         }
  //                                                       },
  //                                                       "eventSource": "click"
  //                                                     },
  //                                                     {
  //                                                       "type": "condition",
  //                                                       "config": {
  //                                                         "operation": "isEqualTo",
  //                                                         "lhs": "#requisitionListStatus",
  //                                                         "rhs": "saved"
  //                                                       },
  //                                                       "eventSource": "click",
  //                                                       "responseDependents": {
  //                                                         "onSuccess": {
  //                                                           "actions": [
  //                                                             {
  //                                                               "type": "microservice",
  //                                                               "config": {
  //                                                                 "microserviceId": "cancelReqOrder",
  //                                                                 "requestMethod": "post",
  //                                                                 "body": {
  //                                                                   "reqOrderId": "#requisitionId",
  //                                                                   "canceledBy": "#loginUUID.username",
  //                                                                   "notes": "Cancel Requisition Order"
  //                                                                 },
  //                                                                 "toBeStringified": true
  //                                                               },
  //                                                               "responseDependents": {
  //                                                                 "onSuccess": {
  //                                                                   "actions": [
  //                                                                     {
  //                                                                       "type": "context",
  //                                                                       "config": {
  //                                                                         "requestMethod": "add",
  //                                                                         "key": "cancelReqOrderResp",
  //                                                                         "data": "responseData"
  //                                                                       }
  //                                                                     },
  //                                                                     {
  //                                                                       "type": "microservice",
  //                                                                       "eventSource": "click",
  //                                                                       "config": {
  //                                                                         "microserviceId": "cancelFA",
  //                                                                         "requestMethod": "post",
  //                                                                         "isLocal": false,
  //                                                                         "LocalService": "assets/Responses/performFA.json",
  //                                                                         "body": {
  //                                                                           "updateFailureAnalysisRequest": {
  //                                                                             "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                                             "assemblyCodeChangeList": {
  //                                                                               "assemblyCodeChange": [
  //                                                                                 {
  //                                                                                   "assemblyCode": item.ASSEMBLY_CODE_NAME,
  //                                                                                   "operation": "Delete",
  //                                                                                   "occurrence": "#" + currentOccurenceData + ".assemblycodeOccurence"
  //                                                                                 }
  //                                                                               ]
  //                                                                             }
  //                                                                           },
  //                                                                           "userPwd": {
  //                                                                             "password": "#loginUUID.password",
  //                                                                             "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                                                           },
  //                                                                           "operationTypes": "ProcessImmediate",
  //                                                                           "ip": "::1",
  //                                                                           "callSource": "FrontEnd",
  //                                                                           "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                                                           "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                                                                         },
  //                                                                         "toBeStringified": true
  //                                                                       },
  //                                                                       "responseDependents": {
  //                                                                         "onSuccess": {
  //                                                                           "actions": [
  //                                                                             {
  //                                                                               "type": "microservice",
  //                                                                               "eventSource": "click",
  //                                                                               "config": {
  //                                                                                 "microserviceId": "cancelFA",
  //                                                                                 "requestMethod": "post",
  //                                                                                 "isLocal": false,
  //                                                                                 "LocalService": "assets/Responses/performFA.json",
  //                                                                                 "body": {
  //                                                                                   "updateFailureAnalysisRequest": {
  //                                                                                     "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                                                     "defectCodeChangeList": {
  //                                                                                       "defectCodeChange": [
  //                                                                                         {
  //                                                                                           "defectCode": item.DEFECT_CODE_NAME,
  //                                                                                           "operation": "Delete",
  //                                                                                           "occurrence": "#" + currentOccurenceData + ".defectCodeOccurence"
  //                                                                                         }
  //                                                                                       ]
  //                                                                                     }
  //                                                                                   },
  //                                                                                   "userPwd": {
  //                                                                                     "password": "#loginUUID.password",
  //                                                                                     "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                                                                   },
  //                                                                                   "operationTypes": "ProcessImmediate",
  //                                                                                   "ip": "::1",
  //                                                                                   "callSource": "FrontEnd",
  //                                                                                   "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                                                                   "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                                                                                 },
  //                                                                                 "toBeStringified": true
  //                                                                               },
  //                                                                               "responseDependents": {
  //                                                                                 "onSuccess": {
  //                                                                                   "actions": [
  //                                                                                     {
  //                                                                                       "type": "deleteAndUpdateOccurence",
  //                                                                                       "config": {
  //                                                                                         "target": "#occurenceList",
  //                                                                                         "key": "#" + currentTaskPanelId,
  //                                                                                         "currentTaskData": "#" + currentOccurenceData
  //                                                                                       },
  //                                                                                       "eventSource": "click"
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "context",
  //                                                                                       "config": {
  //                                                                                         "requestMethod": "add",
  //                                                                                         "key": "requisitionListStatus",
  //                                                                                         "data": "Unsaved"
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "GetValueFromArray",
  //                                                                                       "config": {
  //                                                                                         "arrayData": "#debugFlexFieldData",
  //                                                                                         "PullValue": "currentTaskPanelData",
  //                                                                                         "key": "parentUUID",
  //                                                                                         "property": "flexFields",
  //                                                                                         "splice": true
  //                                                                                       },
  //                                                                                       "eventSource": "click"
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "errorPrepareAndRender",
  //                                                                                       "config": {
  //                                                                                         "key": "requisitionListButtonUUID",
  //                                                                                         "properties": {
  //                                                                                           "titleValue": "Requisition List ({0})",
  //                                                                                           "isShown": true
  //                                                                                         },
  //                                                                                         "valueArray": [
  //                                                                                           "#requisitionListLength"
  //                                                                                         ]
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "condition",
  //                                                                                       "config": {
  //                                                                                         "operation": "isValid",
  //                                                                                         "lhs": "#requisitionListLength"
  //                                                                                       },
  //                                                                                       "responseDependents": {
  //                                                                                         "onSuccess": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "config": {
  //                                                                                                 "key": "requisitionListButtonUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "textValue": "- Unsaved",
  //                                                                                                   "textValueClass": "light-red body"
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         },
  //                                                                                         "onFailure": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "config": {
  //                                                                                                 "key": "requisitionListButtonUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "textValue": ""
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "condition",
  //                                                                                               "config": {
  //                                                                                                 "operation": "isValid",
  //                                                                                                 "lhs": item.ACTION_NOTE
  //                                                                                               },
  //                                                                                               "eventSource": "click",
  //                                                                                               "responseDependents": {
  //                                                                                                 "onSuccess": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "templateName",
  //                                                                                                         "data": "BYD_COM_HOLD_3"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "financialCode",
  //                                                                                                         "data": "003"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 },
  //                                                                                                 "onFailure": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "templateName",
  //                                                                                                         "data": "BYD_COM_TOWERS_3"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "financialCode",
  //                                                                                                         "data": "001"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             }, {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "click",
  //                                                                                               "config": {
  //                                                                                                 "key": "debugTimeoutUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "visibility": true,
  //                                                                                                   "disabled": true
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "click",
  //                                                                                               "config": {
  //                                                                                                 "key": "debugNextUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "visibility": false,
  //                                                                                                   "disabled": true
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "click",
  //                                                                                               "config": {
  //                                                                                                 "key": "debugResultCodesUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "visibility": true,
  //                                                                                                   "disabled": true
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "isFirstReplaceTaskCreated",
  //                                                                                                 "data": false
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "condition",
  //                                                                                               "config": {
  //                                                                                                 "operation": "isEqualTo",
  //                                                                                                 "lhs": "#faultCheckboxSerial",
  //                                                                                                 "rhs": true
  //                                                                                               },
  //                                                                                               "eventSource": "click",
  //                                                                                               "responseDependents": {
  //                                                                                                 "onSuccess": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "templateName",
  //                                                                                                         "data": "BYD_COM_HOLD_3"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "financialCode",
  //                                                                                                         "data": "003"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "kardexRadioButtonUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "disabled": false,
  //                                                                                                           "checked": false
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "quoteRadioButtonUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "disabled": false,
  //                                                                                                           "checked": true
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "condition",
  //                                                                                                       "config": {
  //                                                                                                         "operation": "isValid",
  //                                                                                                         "lhs": "#userSelectedPartNumber"
  //                                                                                                       },
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "responseDependents": {
  //                                                                                                         "onSuccess": {
  //                                                                                                           "actions": [
  //                                                                                                             {
  //                                                                                                               "type": "condition",
  //                                                                                                               "eventSource": "change",
  //                                                                                                               "config": {
  //                                                                                                                 "operation": "isEqualTo",
  //                                                                                                                 "lhs": "#userSelectedCabMessageName",
  //                                                                                                                 "rhs": "IW Part"
  //                                                                                                               },
  //                                                                                                               "responseDependents": {
  //                                                                                                                 "onSuccess": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "errorPrepareAndRender",
  //                                                                                                                       "eventSource": "change",
  //                                                                                                                       "config": {
  //                                                                                                                         "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                                         "properties": {
  //                                                                                                                           "titleValue": "Average Part Value: $0.00",
  //                                                                                                                           "isShown": true
  //                                                                                                                         },
  //                                                                                                                         "valueArray": [
  //                                                                                                                           ""
  //                                                                                                                         ]
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 },
  //                                                                                                                 "onFailure": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "condition",
  //                                                                                                                       "eventSource": "change",
  //                                                                                                                       "config": {
  //                                                                                                                         "operation": "isValid",
  //                                                                                                                         "lhs": "#averagePartValueResp.averageAmount"
  //                                                                                                                       },
  //                                                                                                                       "responseDependents": {
  //                                                                                                                         "onSuccess": {
  //                                                                                                                           "actions": [
  //                                                                                                                             {
  //                                                                                                                               "type": "errorPrepareAndRender",
  //                                                                                                                               "eventSource": "change",
  //                                                                                                                               "config": {
  //                                                                                                                                 "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                                                 "properties": {
  //                                                                                                                                   "titleValue": "Average Part Value: ${0}",
  //                                                                                                                                   "isShown": true
  //                                                                                                                                 },
  //                                                                                                                                 "valueArray": [
  //                                                                                                                                   "#averagePartValueResp.averageAmount"
  //                                                                                                                                 ]
  //                                                                                                                               }
  //                                                                                                                             }
  //                                                                                                                           ]
  //                                                                                                                         },
  //                                                                                                                         "onFailure": {
  //                                                                                                                           "actions": [
  //                                                                                                                             {
  //                                                                                                                               "type": "errorPrepareAndRender",
  //                                                                                                                               "eventSource": "change",
  //                                                                                                                               "config": {
  //                                                                                                                                 "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                                                 "properties": {
  //                                                                                                                                   "titleValue": "Average Part Value: $0.00",
  //                                                                                                                                   "isShown": true
  //                                                                                                                                 },
  //                                                                                                                                 "valueArray": [
  //                                                                                                                                   ""
  //                                                                                                                                 ]
  //                                                                                                                               }
  //                                                                                                                             }
  //                                                                                                                           ]
  //                                                                                                                         }
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 }
  //                                                                                                               }
  //                                                                                                             }
  //                                                                                                           ]
  //                                                                                                         },
  //                                                                                                         "onFailure": {
  //                                                                                                           "actions": []
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "errorPrepareAndRender",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "stockQuantityUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "titleValue": ""
  //                                                                                                         },
  //                                                                                                         "valueArray": [
  //                                                                                                           ""
  //                                                                                                         ]
  //                                                                                                       }
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 },
  //                                                                                                 "onFailure": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "templateName",
  //                                                                                                         "data": "BYD_COM_TOWERS_3"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "financialCode",
  //                                                                                                         "data": "001"
  //                                                                                                       },
  //                                                                                                       "eventSource": "click"
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "kardexRadioButtonUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "disabled": false,
  //                                                                                                           "checked": true
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "quoteRadioButtonUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "disabled": false,
  //                                                                                                           "checked": false
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "errorPrepareAndRender",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "titleValue": "",
  //                                                                                                           "isShown": true
  //                                                                                                         },
  //                                                                                                         "valueArray": [
  //                                                                                                           "0.00"
  //                                                                                                         ]
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "condition",
  //                                                                                                       "config": {
  //                                                                                                         "operation": "isValid",
  //                                                                                                         "lhs": "#userSelectedPartNumber"
  //                                                                                                       },
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "responseDependents": {
  //                                                                                                         "onSuccess": {
  //                                                                                                           "actions": [
  //                                                                                                             {
  //                                                                                                               "type": "microservice",
  //                                                                                                               "eventSource": "change",
  //                                                                                                               "config": {
  //                                                                                                                 "microserviceId": "stockqtyservice",
  //                                                                                                                 "requestMethod": "get",
  //                                                                                                                 "params": {
  //                                                                                                                   "partNo": "#userSelectedPartNumber",
  //                                                                                                                   "locationId": "#discrepancyUnitInfo.LOCATION_ID",
  //                                                                                                                   "clientId": "#discrepancyUnitInfo.CLIENT_ID",
  //                                                                                                                   "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
  //                                                                                                                   "ownerId": "#ownerId",
  //                                                                                                                   "username": "#loginUUID.username"
  //                                                                                                                 }
  //                                                                                                               },
  //                                                                                                               "responseDependents": {
  //                                                                                                                 "onSuccess": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "context",
  //                                                                                                                       "config": {
  //                                                                                                                         "requestMethod": "add",
  //                                                                                                                         "key": "stockQuantity",
  //                                                                                                                         "data": "responseArray"
  //                                                                                                                       }
  //                                                                                                                     },
  //                                                                                                                     {
  //                                                                                                                       "type": "context",
  //                                                                                                                       "config": {
  //                                                                                                                         "requestMethod": "add",
  //                                                                                                                         "key": "finalPartStockQuantity",
  //                                                                                                                         "data": "#stockQuantity.quantity"
  //                                                                                                                       }
  //                                                                                                                     },
  //                                                                                                                     {
  //                                                                                                                       "type": "errorPrepareAndRender",
  //                                                                                                                       "eventSource": "change",
  //                                                                                                                       "config": {
  //                                                                                                                         "key": "stockQuantityUUID",
  //                                                                                                                         "properties": {
  //                                                                                                                           "titleValue": "{0} Available"
  //                                                                                                                         },
  //                                                                                                                         "valueArray": [
  //                                                                                                                           "#stockQuantity.quantity"
  //                                                                                                                         ]
  //                                                                                                                       }
  //                                                                                                                     },
  //                                                                                                                     {
  //                                                                                                                       "type": "condition",
  //                                                                                                                       "eventSource": "change",
  //                                                                                                                       "config": {
  //                                                                                                                         "operation": "isEqualTo",
  //                                                                                                                         "lhs": "#stockQuantity.quantity",
  //                                                                                                                         "rhs": 0
  //                                                                                                                       },
  //                                                                                                                       "responseDependents": {
  //                                                                                                                         "onSuccess": {
  //                                                                                                                           "actions": [
  //                                                                                                                             {
  //                                                                                                                               "type": "updateComponent",
  //                                                                                                                               "config": {
  //                                                                                                                                 "key": "stockQuantityUUID",
  //                                                                                                                                 "updateParent": true,
  //                                                                                                                                 "properties": {
  //                                                                                                                                   "hidden": false,
  //                                                                                                                                   "labelClass": "light-red heading1 padding-left-10",
  //                                                                                                                                   "text": "0"
  //                                                                                                                                 }
  //                                                                                                                               }
  //                                                                                                                             }
  //                                                                                                                           ]
  //                                                                                                                         },
  //                                                                                                                         "onFailure": {
  //                                                                                                                           "actions": [
  //                                                                                                                             {
  //                                                                                                                               "type": "updateComponent",
  //                                                                                                                               "config": {
  //                                                                                                                                 "key": "stockQuantityUUID",
  //                                                                                                                                 "updateParent": true,
  //                                                                                                                                 "properties": {
  //                                                                                                                                   "hidden": false,
  //                                                                                                                                   "labelClass": "saved-green body"
  //                                                                                                                                 }
  //                                                                                                                               }
  //                                                                                                                             }
  //                                                                                                                           ]
  //                                                                                                                         }
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 },
  //                                                                                                                 "onFailure": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "context",
  //                                                                                                                       "config": {
  //                                                                                                                         "requestMethod": "add",
  //                                                                                                                         "key": "errorDisp",
  //                                                                                                                         "data": "responseData"
  //                                                                                                                       }
  //                                                                                                                     },
  //                                                                                                                     {
  //                                                                                                                       "type": "updateComponent",
  //                                                                                                                       "config": {
  //                                                                                                                         "key": "errorTitleUUID",
  //                                                                                                                         "properties": {
  //                                                                                                                           "titleValue": "#errorDisp",
  //                                                                                                                           "isShown": true
  //                                                                                                                         }
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 }
  //                                                                                                               }
  //                                                                                                             }
  //                                                                                                           ]
  //                                                                                                         },
  //                                                                                                         "onFailure": {
  //                                                                                                           "actions": [
  //                                                                                                             {
  //                                                                                                               "type": "errorPrepareAndRender",
  //                                                                                                               "eventSource": "change",
  //                                                                                                               "config": {
  //                                                                                                                 "key": "stockQuantityUUID",
  //                                                                                                                 "properties": {
  //                                                                                                                   "titleValue": ""
  //                                                                                                                 },
  //                                                                                                                 "valueArray": [
  //                                                                                                                   ""
  //                                                                                                                 ]
  //                                                                                                               }
  //                                                                                                             }
  //                                                                                                           ]
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "primaryFooterText": ""
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             }, {
  //                                                                                               "type": "microservice",
  //                                                                                               "config": {
  //                                                                                                 "microserviceId": "getResultCodeByValidateResult",
  //                                                                                                 "requestMethod": "get",
  //                                                                                                 "params": {
  //                                                                                                   "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                                                                   "validateResult": 0
  //                                                                                                 }
  //                                                                                               },
  //                                                                                               "responseDependents": {
  //                                                                                                 "onSuccess": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "resultCodesForDiscrepancy",
  //                                                                                                         "data": "responseData"
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "config": {
  //                                                                                                         "key": "debugTimeoutUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "disabled": true
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "config": {
  //                                                                                                         "key": "debugResultCodesUUID",
  //                                                                                                         "dropDownProperties": {
  //                                                                                                           "options": "#resultCodesForDiscrepancy"
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 },
  //                                                                                                 "onFailure": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "context",
  //                                                                                                       "config": {
  //                                                                                                         "requestMethod": "add",
  //                                                                                                         "key": "errorDisp",
  //                                                                                                         "data": "responseData"
  //                                                                                                       }
  //                                                                                                     },
  //                                                                                                     {
  //                                                                                                       "type": "updateComponent",
  //                                                                                                       "config": {
  //                                                                                                         "key": "errorTitleUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "titleValue": "#errorDisp",
  //                                                                                                           "isShown": true
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         }
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "deleteComponent",
  //                                                                                       "eventSource": "click"
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "config": {
  //                                                                                         "key": "errorTitleUUID",
  //                                                                                         "properties": {
  //                                                                                           "titleValue": "",
  //                                                                                           "isShown": true
  //                                                                                         }
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "eventSource": "click",
  //                                                                                       "config": {
  //                                                                                         "key": "debugNextUUID",
  //                                                                                         "properties": {
  //                                                                                           "disabled": true
  //                                                                                         }
  //                                                                                       }
  //                                                                                     }
  //                                                                                   ]
  //                                                                                 },
  //                                                                                 "onFailure": {
  //                                                                                   "actions": [
  //                                                                                     {
  //                                                                                       "type": "context",
  //                                                                                       "config": {
  //                                                                                         "requestMethod": "add",
  //                                                                                         "key": "performFAError",
  //                                                                                         "data": "responseData"
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "config": {
  //                                                                                         "key": "errorTitleUUID",
  //                                                                                         "properties": {
  //                                                                                           "titleValue": "#performFAError",
  //                                                                                           "isShown": true
  //                                                                                         }
  //                                                                                       }
  //                                                                                     }
  //                                                                                   ]
  //                                                                                 }
  //                                                                               }
  //                                                                             }
  //                                                                           ]
  //                                                                         },
  //                                                                         "onFailure": {
  //                                                                           "actions": [
  //                                                                             {
  //                                                                               "type": "context",
  //                                                                               "config": {
  //                                                                                 "requestMethod": "add",
  //                                                                                 "key": "performFAError",
  //                                                                                 "data": "responseData"
  //                                                                               }
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "updateComponent",
  //                                                                               "config": {
  //                                                                                 "key": "errorTitleUUID",
  //                                                                                 "properties": {
  //                                                                                   "titleValue": "#performFAError",
  //                                                                                   "isShown": true
  //                                                                                 }
  //                                                                               }
  //                                                                             }
  //                                                                           ]
  //                                                                         }
  //                                                                       }
  //                                                                     }
  //                                                                   ]
  //                                                                 },
  //                                                                 "onFailure": {
  //                                                                   "actions": [
  //                                                                     {
  //                                                                       "type": "context",
  //                                                                       "config": {
  //                                                                         "requestMethod": "add",
  //                                                                         "key": "cancelReqOrderResp",
  //                                                                         "data": "responseData"
  //                                                                       }
  //                                                                     },
  //                                                                     {
  //                                                                       "type": "updateComponent",
  //                                                                       "config": {
  //                                                                         "key": "errorTitleUUID",
  //                                                                         "properties": {
  //                                                                           "titleValue": "#cancelReqOrderResp",
  //                                                                           "isShown": true
  //                                                                         }
  //                                                                       }
  //                                                                     }
  //                                                                   ]
  //                                                                 }
  //                                                               }
  //                                                             }
  //                                                           ]
  //                                                         },
  //                                                         "onFailure": {
  //                                                           "actions": [
  //                                                             {
  //                                                               "type": "microservice",
  //                                                               "eventSource": "click",
  //                                                               "config": {
  //                                                                 "microserviceId": "cancelFA",
  //                                                                 "requestMethod": "post",
  //                                                                 "isLocal": false,
  //                                                                 "LocalService": "assets/Responses/performFA.json",
  //                                                                 "body": {
  //                                                                   "updateFailureAnalysisRequest": {
  //                                                                     "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                                     "assemblyCodeChangeList": {
  //                                                                       "assemblyCodeChange": [
  //                                                                         {
  //                                                                           "assemblyCode": item.ASSEMBLY_CODE_NAME,
  //                                                                           "operation": "Delete",
  //                                                                           "occurrence": "#" + currentOccurenceData + ".assemblycodeOccurence"
  //                                                                         }
  //                                                                       ]
  //                                                                     }
  //                                                                   },
  //                                                                   "userPwd": {
  //                                                                     "password": "#loginUUID.password",
  //                                                                     "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                                                   },
  //                                                                   "operationTypes": "ProcessImmediate",
  //                                                                   "ip": "::1",
  //                                                                   "callSource": "FrontEnd",
  //                                                                   "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                                                   "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                                                                 },
  //                                                                 "toBeStringified": true
  //                                                               },
  //                                                               "responseDependents": {
  //                                                                 "onSuccess": {
  //                                                                   "actions": [
  //                                                                     {
  //                                                                       "type": "microservice",
  //                                                                       "eventSource": "click",
  //                                                                       "config": {
  //                                                                         "microserviceId": "cancelFA",
  //                                                                         "requestMethod": "post",
  //                                                                         "isLocal": false,
  //                                                                         "LocalService": "assets/Responses/performFA.json",
  //                                                                         "body": {
  //                                                                           "updateFailureAnalysisRequest": {
  //                                                                             "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                                             "defectCodeChangeList": {
  //                                                                               "defectCodeChange": [
  //                                                                                 {
  //                                                                                   "defectCode": item.DEFECT_CODE_NAME,
  //                                                                                   "operation": "Delete",
  //                                                                                   "occurrence": "#" + currentOccurenceData + ".defectCodeOccurence"
  //                                                                                 }
  //                                                                               ]
  //                                                                             }
  //                                                                           },
  //                                                                           "userPwd": {
  //                                                                             "password": "#loginUUID.password",
  //                                                                             "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                                                           },
  //                                                                           "operationTypes": "ProcessImmediate",
  //                                                                           "ip": "::1",
  //                                                                           "callSource": "FrontEnd",
  //                                                                           "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                                                           "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                                                                         },
  //                                                                         "toBeStringified": true
  //                                                                       },
  //                                                                       "responseDependents": {
  //                                                                         "onSuccess": {
  //                                                                           "actions": [
  //                                                                             {
  //                                                                               "type": "deleteAndUpdateOccurence",
  //                                                                               "config": {
  //                                                                                 "target": "#occurenceList",
  //                                                                                 "key": "#" + currentTaskPanelId,
  //                                                                                 "currentTaskData": "#" + currentOccurenceData
  //                                                                               },
  //                                                                               "eventSource": "click"
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "context",
  //                                                                               "config": {
  //                                                                                 "requestMethod": "add",
  //                                                                                 "key": "requisitionListStatus",
  //                                                                                 "data": "Unsaved"
  //                                                                               }
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "GetValueFromArray",
  //                                                                               "config": {
  //                                                                                 "arrayData": "#debugFlexFieldData",
  //                                                                                 "PullValue": "currentTaskPanelData",
  //                                                                                 "key": "parentUUID",
  //                                                                                 "property": "flexFields",
  //                                                                                 "splice": true
  //                                                                               },
  //                                                                               "eventSource": "click"
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "errorPrepareAndRender",
  //                                                                               "config": {
  //                                                                                 "key": "requisitionListButtonUUID",
  //                                                                                 "properties": {
  //                                                                                   "titleValue": "Requisition List ({0})",
  //                                                                                   "isShown": true
  //                                                                                 },
  //                                                                                 "valueArray": [
  //                                                                                   "#requisitionListLength"
  //                                                                                 ]
  //                                                                               }
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "condition",
  //                                                                               "config": {
  //                                                                                 "operation": "isValid",
  //                                                                                 "lhs": "#requisitionListLength"
  //                                                                               },
  //                                                                               "responseDependents": {
  //                                                                                 "onSuccess": {
  //                                                                                   "actions": [
  //                                                                                     {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "config": {
  //                                                                                         "key": "requisitionListButtonUUID",
  //                                                                                         "properties": {
  //                                                                                           "textValue": "- Unsaved",
  //                                                                                           "textValueClass": "light-red body"
  //                                                                                         }
  //                                                                                       }
  //                                                                                     }
  //                                                                                   ]
  //                                                                                 },
  //                                                                                 "onFailure": {
  //                                                                                   "actions": [
  //                                                                                     {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "config": {
  //                                                                                         "key": "requisitionListButtonUUID",
  //                                                                                         "properties": {
  //                                                                                           "textValue": ""
  //                                                                                         }
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "condition",
  //                                                                                       "config": {
  //                                                                                         "operation": "isValid",
  //                                                                                         "lhs": item.ACTION_NOTE
  //                                                                                       },
  //                                                                                       "eventSource": "click",
  //                                                                                       "responseDependents": {
  //                                                                                         "onSuccess": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "templateName",
  //                                                                                                 "data": "BYD_COM_HOLD_3"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "financialCode",
  //                                                                                                 "data": "003"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         },
  //                                                                                         "onFailure": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "templateName",
  //                                                                                                 "data": "BYD_COM_TOWERS_3"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "financialCode",
  //                                                                                                 "data": "001"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         }
  //                                                                                       }
  //                                                                                     }, {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "eventSource": "click",
  //                                                                                       "config": {
  //                                                                                         "key": "debugTimeoutUUID",
  //                                                                                         "properties": {
  //                                                                                           "visibility": true,
  //                                                                                           "disabled": true
  //                                                                                         }
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "eventSource": "click",
  //                                                                                       "config": {
  //                                                                                         "key": "debugNextUUID",
  //                                                                                         "properties": {
  //                                                                                           "visibility": false,
  //                                                                                           "disabled": true
  //                                                                                         }
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "updateComponent",
  //                                                                                       "eventSource": "click",
  //                                                                                       "config": {
  //                                                                                         "key": "debugResultCodesUUID",
  //                                                                                         "properties": {
  //                                                                                           "visibility": true,
  //                                                                                           "disabled": true
  //                                                                                         }
  //                                                                                       }
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "context",
  //                                                                                       "config": {
  //                                                                                         "requestMethod": "add",
  //                                                                                         "key": "isFirstReplaceTaskCreated",
  //                                                                                         "data": false
  //                                                                                       },
  //                                                                                       "eventSource": "click"
  //                                                                                     },
  //                                                                                     {
  //                                                                                       "type": "condition",
  //                                                                                       "config": {
  //                                                                                         "operation": "isEqualTo",
  //                                                                                         "lhs": "#faultCheckboxSerial",
  //                                                                                         "rhs": true
  //                                                                                       },
  //                                                                                       "eventSource": "click",
  //                                                                                       "responseDependents": {
  //                                                                                         "onSuccess": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "templateName",
  //                                                                                                 "data": "BYD_COM_HOLD_3"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "financialCode",
  //                                                                                                 "data": "003"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "change",
  //                                                                                               "config": {
  //                                                                                                 "key": "kardexRadioButtonUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "disabled": false,
  //                                                                                                   "checked": false
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "change",
  //                                                                                               "config": {
  //                                                                                                 "key": "quoteRadioButtonUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "disabled": false,
  //                                                                                                   "checked": true
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "condition",
  //                                                                                               "config": {
  //                                                                                                 "operation": "isValid",
  //                                                                                                 "lhs": "#userSelectedPartNumber"
  //                                                                                               },
  //                                                                                               "eventSource": "change",
  //                                                                                               "responseDependents": {
  //                                                                                                 "onSuccess": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "condition",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "operation": "isEqualTo",
  //                                                                                                         "lhs": "#userSelectedCabMessageName",
  //                                                                                                         "rhs": "IW Part"
  //                                                                                                       },
  //                                                                                                       "responseDependents": {
  //                                                                                                         "onSuccess": {
  //                                                                                                           "actions": [
  //                                                                                                             {
  //                                                                                                               "type": "errorPrepareAndRender",
  //                                                                                                               "eventSource": "change",
  //                                                                                                               "config": {
  //                                                                                                                 "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                                 "properties": {
  //                                                                                                                   "titleValue": "Average Part Value: $0.00",
  //                                                                                                                   "isShown": true
  //                                                                                                                 },
  //                                                                                                                 "valueArray": [
  //                                                                                                                   ""
  //                                                                                                                 ]
  //                                                                                                               }
  //                                                                                                             }
  //                                                                                                           ]
  //                                                                                                         },
  //                                                                                                         "onFailure": {
  //                                                                                                           "actions": [
  //                                                                                                             {
  //                                                                                                               "type": "condition",
  //                                                                                                               "eventSource": "change",
  //                                                                                                               "config": {
  //                                                                                                                 "operation": "isValid",
  //                                                                                                                 "lhs": "#averagePartValueResp.averageAmount"
  //                                                                                                               },
  //                                                                                                               "responseDependents": {
  //                                                                                                                 "onSuccess": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "errorPrepareAndRender",
  //                                                                                                                       "eventSource": "change",
  //                                                                                                                       "config": {
  //                                                                                                                         "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                                         "properties": {
  //                                                                                                                           "titleValue": "Average Part Value: ${0}",
  //                                                                                                                           "isShown": true
  //                                                                                                                         },
  //                                                                                                                         "valueArray": [
  //                                                                                                                           "#averagePartValueResp.averageAmount"
  //                                                                                                                         ]
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 },
  //                                                                                                                 "onFailure": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "errorPrepareAndRender",
  //                                                                                                                       "eventSource": "change",
  //                                                                                                                       "config": {
  //                                                                                                                         "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                                         "properties": {
  //                                                                                                                           "titleValue": "Average Part Value: $0.00",
  //                                                                                                                           "isShown": true
  //                                                                                                                         },
  //                                                                                                                         "valueArray": [
  //                                                                                                                           ""
  //                                                                                                                         ]
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 }
  //                                                                                                               }
  //                                                                                                             }
  //                                                                                                           ]
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 },
  //                                                                                                 "onFailure": {
  //                                                                                                   "actions": []
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "errorPrepareAndRender",
  //                                                                                               "eventSource": "change",
  //                                                                                               "config": {
  //                                                                                                 "key": "stockQuantityUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "titleValue": ""
  //                                                                                                 },
  //                                                                                                 "valueArray": [
  //                                                                                                   ""
  //                                                                                                 ]
  //                                                                                               }
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         },
  //                                                                                         "onFailure": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "templateName",
  //                                                                                                 "data": "BYD_COM_TOWERS_3"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "financialCode",
  //                                                                                                 "data": "001"
  //                                                                                               },
  //                                                                                               "eventSource": "click"
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "change",
  //                                                                                               "config": {
  //                                                                                                 "key": "kardexRadioButtonUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "disabled": false,
  //                                                                                                   "checked": true
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "change",
  //                                                                                               "config": {
  //                                                                                                 "key": "quoteRadioButtonUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "disabled": false,
  //                                                                                                   "checked": false
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "errorPrepareAndRender",
  //                                                                                               "eventSource": "change",
  //                                                                                               "config": {
  //                                                                                                 "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "titleValue": "",
  //                                                                                                   "isShown": true
  //                                                                                                 },
  //                                                                                                 "valueArray": [
  //                                                                                                   "0.00"
  //                                                                                                 ]
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "condition",
  //                                                                                               "config": {
  //                                                                                                 "operation": "isValid",
  //                                                                                                 "lhs": "#userSelectedPartNumber"
  //                                                                                               },
  //                                                                                               "eventSource": "change",
  //                                                                                               "responseDependents": {
  //                                                                                                 "onSuccess": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "microservice",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "microserviceId": "stockqtyservice",
  //                                                                                                         "requestMethod": "get",
  //                                                                                                         "params": {
  //                                                                                                           "partNo": "#userSelectedPartNumber",
  //                                                                                                           "locationId": "#discrepancyUnitInfo.LOCATION_ID",
  //                                                                                                           "clientId": "#discrepancyUnitInfo.CLIENT_ID",
  //                                                                                                           "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
  //                                                                                                           "ownerId": "#ownerId",
  //                                                                                                           "username": "#loginUUID.username"
  //                                                                                                         }
  //                                                                                                       },
  //                                                                                                       "responseDependents": {
  //                                                                                                         "onSuccess": {
  //                                                                                                           "actions": [
  //                                                                                                             {
  //                                                                                                               "type": "context",
  //                                                                                                               "config": {
  //                                                                                                                 "requestMethod": "add",
  //                                                                                                                 "key": "stockQuantity",
  //                                                                                                                 "data": "responseArray"
  //                                                                                                               }
  //                                                                                                             },
  //                                                                                                             {
  //                                                                                                               "type": "context",
  //                                                                                                               "config": {
  //                                                                                                                 "requestMethod": "add",
  //                                                                                                                 "key": "finalPartStockQuantity",
  //                                                                                                                 "data": "#stockQuantity.quantity"
  //                                                                                                               }
  //                                                                                                             },
  //                                                                                                             {
  //                                                                                                               "type": "errorPrepareAndRender",
  //                                                                                                               "eventSource": "change",
  //                                                                                                               "config": {
  //                                                                                                                 "key": "stockQuantityUUID",
  //                                                                                                                 "properties": {
  //                                                                                                                   "titleValue": "{0} Available"
  //                                                                                                                 },
  //                                                                                                                 "valueArray": [
  //                                                                                                                   "#stockQuantity.quantity"
  //                                                                                                                 ]
  //                                                                                                               }
  //                                                                                                             },
  //                                                                                                             {
  //                                                                                                               "type": "condition",
  //                                                                                                               "eventSource": "change",
  //                                                                                                               "config": {
  //                                                                                                                 "operation": "isEqualTo",
  //                                                                                                                 "lhs": "#stockQuantity.quantity",
  //                                                                                                                 "rhs": 0
  //                                                                                                               },
  //                                                                                                               "responseDependents": {
  //                                                                                                                 "onSuccess": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "updateComponent",
  //                                                                                                                       "config": {
  //                                                                                                                         "key": "stockQuantityUUID",
  //                                                                                                                         "updateParent": true,
  //                                                                                                                         "properties": {
  //                                                                                                                           "hidden": false,
  //                                                                                                                           "labelClass": "light-red heading1 padding-left-10",
  //                                                                                                                           "text": "0"
  //                                                                                                                         }
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 },
  //                                                                                                                 "onFailure": {
  //                                                                                                                   "actions": [
  //                                                                                                                     {
  //                                                                                                                       "type": "updateComponent",
  //                                                                                                                       "config": {
  //                                                                                                                         "key": "stockQuantityUUID",
  //                                                                                                                         "updateParent": true,
  //                                                                                                                         "properties": {
  //                                                                                                                           "hidden": false,
  //                                                                                                                           "labelClass": "saved-green body"
  //                                                                                                                         }
  //                                                                                                                       }
  //                                                                                                                     }
  //                                                                                                                   ]
  //                                                                                                                 }
  //                                                                                                               }
  //                                                                                                             }
  //                                                                                                           ]
  //                                                                                                         },
  //                                                                                                         "onFailure": {
  //                                                                                                           "actions": [
  //                                                                                                             {
  //                                                                                                               "type": "context",
  //                                                                                                               "config": {
  //                                                                                                                 "requestMethod": "add",
  //                                                                                                                 "key": "errorDisp",
  //                                                                                                                 "data": "responseData"
  //                                                                                                               }
  //                                                                                                             },
  //                                                                                                             {
  //                                                                                                               "type": "updateComponent",
  //                                                                                                               "config": {
  //                                                                                                                 "key": "errorTitleUUID",
  //                                                                                                                 "properties": {
  //                                                                                                                   "titleValue": "#errorDisp",
  //                                                                                                                   "isShown": true
  //                                                                                                                 }
  //                                                                                                               }
  //                                                                                                             }
  //                                                                                                           ]
  //                                                                                                         }
  //                                                                                                       }
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 },
  //                                                                                                 "onFailure": {
  //                                                                                                   "actions": [
  //                                                                                                     {
  //                                                                                                       "type": "errorPrepareAndRender",
  //                                                                                                       "eventSource": "change",
  //                                                                                                       "config": {
  //                                                                                                         "key": "stockQuantityUUID",
  //                                                                                                         "properties": {
  //                                                                                                           "titleValue": ""
  //                                                                                                         },
  //                                                                                                         "valueArray": [
  //                                                                                                           ""
  //                                                                                                         ]
  //                                                                                                       }
  //                                                                                                     }
  //                                                                                                   ]
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "eventSource": "change",
  //                                                                                               "config": {
  //                                                                                                 "key": "replaceFaultIdentifiedtableUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "primaryFooterText": ""
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         }
  //                                                                                       }
  //                                                                                     }, {
  //                                                                                       "type": "microservice",
  //                                                                                       "config": {
  //                                                                                         "microserviceId": "getResultCodeByValidateResult",
  //                                                                                         "requestMethod": "get",
  //                                                                                         "params": {
  //                                                                                           "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                                                           "validateResult": 0
  //                                                                                         }
  //                                                                                       },
  //                                                                                       "responseDependents": {
  //                                                                                         "onSuccess": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "resultCodesForDiscrepancy",
  //                                                                                                 "data": "responseData"
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "config": {
  //                                                                                                 "key": "debugTimeoutUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "disabled": true
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "config": {
  //                                                                                                 "key": "debugResultCodesUUID",
  //                                                                                                 "dropDownProperties": {
  //                                                                                                   "options": "#resultCodesForDiscrepancy"
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         },
  //                                                                                         "onFailure": {
  //                                                                                           "actions": [
  //                                                                                             {
  //                                                                                               "type": "context",
  //                                                                                               "config": {
  //                                                                                                 "requestMethod": "add",
  //                                                                                                 "key": "errorDisp",
  //                                                                                                 "data": "responseData"
  //                                                                                               }
  //                                                                                             },
  //                                                                                             {
  //                                                                                               "type": "updateComponent",
  //                                                                                               "config": {
  //                                                                                                 "key": "errorTitleUUID",
  //                                                                                                 "properties": {
  //                                                                                                   "titleValue": "#errorDisp",
  //                                                                                                   "isShown": true
  //                                                                                                 }
  //                                                                                               }
  //                                                                                             }
  //                                                                                           ]
  //                                                                                         }
  //                                                                                       }
  //                                                                                     }
  //                                                                                   ]
  //                                                                                 }
  //                                                                               }
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "deleteComponent",
  //                                                                               "eventSource": "click"
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "updateComponent",
  //                                                                               "config": {
  //                                                                                 "key": "errorTitleUUID",
  //                                                                                 "properties": {
  //                                                                                   "titleValue": "",
  //                                                                                   "isShown": true
  //                                                                                 }
  //                                                                               }
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "updateComponent",
  //                                                                               "eventSource": "click",
  //                                                                               "config": {
  //                                                                                 "key": "debugNextUUID",
  //                                                                                 "properties": {
  //                                                                                   "disabled": true
  //                                                                                 }
  //                                                                               }
  //                                                                             }
  //                                                                           ]
  //                                                                         },
  //                                                                         "onFailure": {
  //                                                                           "actions": [
  //                                                                             {
  //                                                                               "type": "context",
  //                                                                               "config": {
  //                                                                                 "requestMethod": "add",
  //                                                                                 "key": "performFAError",
  //                                                                                 "data": "responseData"
  //                                                                               }
  //                                                                             },
  //                                                                             {
  //                                                                               "type": "updateComponent",
  //                                                                               "config": {
  //                                                                                 "key": "errorTitleUUID",
  //                                                                                 "properties": {
  //                                                                                   "titleValue": "#performFAError",
  //                                                                                   "isShown": true
  //                                                                                 }
  //                                                                               }
  //                                                                             }
  //                                                                           ]
  //                                                                         }
  //                                                                       }
  //                                                                     }
  //                                                                   ]
  //                                                                 },
  //                                                                 "onFailure": {
  //                                                                   "actions": [
  //                                                                     {
  //                                                                       "type": "context",
  //                                                                       "config": {
  //                                                                         "requestMethod": "add",
  //                                                                         "key": "performFAError",
  //                                                                         "data": "responseData"
  //                                                                       }
  //                                                                     },
  //                                                                     {
  //                                                                       "type": "updateComponent",
  //                                                                       "config": {
  //                                                                         "key": "errorTitleUUID",
  //                                                                         "properties": {
  //                                                                           "titleValue": "#performFAError",
  //                                                                           "isShown": true
  //                                                                         }
  //                                                                       }
  //                                                                     }
  //                                                                   ]
  //                                                                 }
  //                                                               }
  //                                                             }
  //                                                           ]
  //                                                         }
  //                                                       }
  //                                                     }
  //                                                   ]
  //                                                 }
  //                                               ]
  //                                             }
  //                                           },
  //                                           "eventSource": "click"
  //                                         }
  //                                       ]
  //                                     }
  //                                   }
  //                                 }
  //                               ]
  //                             }
  //                           }
  //                         },
  //                         {
  //                           "type": "condition",
  //                           "config": {
  //                             "operation": "isEqualTo",
  //                             "lhs": "#requisitionListStatus",
  //                             "rhs": "saved"
  //                           },
  //                           "eventSource": "click",
  //                           "responseDependents": {
  //                             "onSuccess": {
  //                               "actions": [
  //                                 {
  //                                   "type": "condition",
  //                                   "config": {
  //                                     "operation": "isValid",
  //                                     "lhs": item.ACTION_NOTE
  //                                   },
  //                                   "eventSource": "click",
  //                                   "responseDependents": {
  //                                     "onSuccess": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "updateComponent",
  //                                           "eventSource": "click",
  //                                           "config": {
  //                                             "key": "debugTimeoutUUID",
  //                                             "properties": {
  //                                               "visibility": false,
  //                                               "disabled": true
  //                                             }
  //                                           }
  //                                         },
  //                                         {
  //                                           "type": "updateComponent",
  //                                           "eventSource": "click",
  //                                           "config": {
  //                                             "key": "debugNextUUID",
  //                                             "properties": {
  //                                               "visibility": true,
  //                                               "disabled": false
  //                                             }
  //                                           }
  //                                         },
  //                                         {
  //                                           "type": "updateComponent",
  //                                           "eventSource": "click",
  //                                           "config": {
  //                                             "key": "debugResultCodesUUID",
  //                                             "properties": {
  //                                               "visibility": false
  //                                             }
  //                                           }
  //                                         }
  //                                       ]
  //                                     },
  //                                     "onFailure": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "updateComponent",
  //                                           "eventSource": "click",
  //                                           "config": {
  //                                             "key": "debugTimeoutUUID",
  //                                             "properties": {
  //                                               "visibility": true,
  //                                               "disabled": true
  //                                             }
  //                                           }
  //                                         },
  //                                         {
  //                                           "type": "updateComponent",
  //                                           "eventSource": "click",
  //                                           "config": {
  //                                             "key": "debugNextUUID",
  //                                             "properties": {
  //                                               "visibility": false,
  //                                               "disabled": true
  //                                             }
  //                                           }
  //                                         },
  //                                         {
  //                                           "type": "updateComponent",
  //                                           "eventSource": "click",
  //                                           "config": {
  //                                             "key": "debugResultCodesUUID",
  //                                             "properties": {
  //                                               "visibility": true
  //                                             }
  //                                           }
  //                                         }
  //                                       ]
  //                                     }
  //                                   }
  //                                 }
  //                               ]
  //                             },
  //                             "onFailure": {
  //                               "actions": [
  //                                 {
  //                                   "type": "condition",
  //                                   "config": {
  //                                     "operation": "isValid",
  //                                     "lhs": item.ACTION_NOTE
  //                                   },
  //                                   "eventSource": "click",
  //                                   "responseDependents": {
  //                                     "onSuccess": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "updateComponent",
  //                                           "eventSource": "click",
  //                                           "config": {
  //                                             "key": "debugTimeoutUUID",
  //                                             "properties": {
  //                                               "visibility": false,
  //                                               "disabled": true
  //                                             }
  //                                           }
  //                                         },
  //                                         {
  //                                           "type": "updateComponent",
  //                                           "eventSource": "click",
  //                                           "config": {
  //                                             "key": "debugNextUUID",
  //                                             "properties": {
  //                                               "visibility": true,
  //                                               "disabled": true
  //                                             }
  //                                           }
  //                                         },
  //                                         {
  //                                           "type": "updateComponent",
  //                                           "eventSource": "click",
  //                                           "config": {
  //                                             "key": "debugResultCodesUUID",
  //                                             "properties": {
  //                                               "visibility": false
  //                                             }
  //                                           }
  //                                         }
  //                                       ]
  //                                     },
  //                                     "onFailure": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "updateComponent",
  //                                           "eventSource": "click",
  //                                           "config": {
  //                                             "key": "debugTimeoutUUID",
  //                                             "properties": {
  //                                               "visibility": true,
  //                                               "disabled": true
  //                                             }
  //                                           }
  //                                         },
  //                                         {
  //                                           "type": "updateComponent",
  //                                           "eventSource": "click",
  //                                           "config": {
  //                                             "key": "debugNextUUID",
  //                                             "properties": {
  //                                               "visibility": false,
  //                                               "disabled": true
  //                                             }
  //                                           }
  //                                         },
  //                                         {
  //                                           "type": "updateComponent",
  //                                           "eventSource": "click",
  //                                           "config": {
  //                                             "key": "debugResultCodesUUID",
  //                                             "properties": {
  //                                               "visibility": true,
  //                                               "disabled": true
  //                                             }
  //                                           }
  //                                         }
  //                                       ]
  //                                     }
  //                                   }
  //                                 }
  //                               ]
  //                             }
  //                           }
  //                         },
  //                         {
  //                           "type": "condition",
  //                           "config": {
  //                             "operation": "isEqualTo",
  //                             "lhs": "#" + isPartIssued,
  //                             "rhs": "true"
  //                           },
  //                           "responseDependents": {
  //                             "onSuccess": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "checkStatusPart",
  //                                     "data": "requisitionList fail"
  //                                   }
  //                                 }
  //                               ]
  //                             },
  //                             "onFailure": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "addToExistingContext",
  //                                     "target": "requisitionList",
  //                                     "sourceData": {
  //                                       "Part Details": [
  //                                         {
  //                                           "ctype": "block-text",
  //                                           "uuid": "StockUUID",
  //                                           "text": "Part:",
  //                                           "textValue": "#" + finalPartNumber,
  //                                           "class": "subtitle1 greyish-black overflow-ellipsis width-200"
  //                                         },
  //                                         {
  //                                           "ctype": "block-text",
  //                                           "uuid": "StockUUID",
  //                                           "textValue": "#userSelectedPartDescription",
  //                                           "class": "subtitle1 greyish-black overflow-wrap width-200"
  //                                         }
  //                                       ],
  //                                       "Qty": [
  //                                         {
  //                                           "ctype": "block-text",
  //                                           "uuid": "StockUUID",
  //                                           "text": "1"
  //                                         },
  //                                         {
  //                                           "ctype": "block-text",
  //                                           "uuid": "displayQuantityUUID",
  //                                           "class": "light-red body margin-top-10",
  //                                           "text": "#displayQuantity"
  //                                         }
  //                                       ],
  //                                       "parentUUID": "#createdComponentUUID"
  //                                     }
  //                                   },
  //                                   "eventSource": "click"
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "addToExistingContext",
  //                                     "target": "debugFlexFieldData",
  //                                     "sourceData": {
  //                                       "parentUUID": "#createdComponentUUID",
  //                                       "flexFields": [
  //                                         {
  //                                           "userSelectedCommodityName": "#userSelectedCommodityName",
  //                                           "userSelectedDefect": "#userSelectedDefect",
  //                                           "userSelectedAction": "#userSelectedReplaceAction"
  //                                         }
  //                                       ]
  //                                     }
  //                                   },
  //                                   "eventSource": "click"
  //                                 }
  //                               ]
  //                             }
  //                           }
  //                         },
  //                         {
  //                           "type": "context",
  //                           "eventSource": "click",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "requisitionListLength",
  //                             "data": "contextLength",
  //                             "sourceContext": "requisitionList"
  //                           }
  //                         },
  //                         {
  //                           "type": "errorPrepareAndRender",
  //                           "eventSource": "click",
  //                           "config": {
  //                             "key": "requisitionListButtonUUID",
  //                             "properties": {
  //                               "titleValue": "Requisition List ({0})",
  //                               "isShown": true
  //                             },
  //                             "valueArray": [
  //                               "#requisitionListLength"
  //                             ]
  //                           }
  //                         }
  //                       ]
  //                     },
  //                     "onFailure": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "errorResp",
  //                             "data": "responseData"
  //                           }
  //                         },
  //                         {
  //                           "type": "updateComponent",
  //                           "config": {
  //                             "key": "errorTitleUUID",
  //                             "properties": {
  //                               "titleValue": "#errorResp",
  //                               "isShown": true
  //                             }
  //                           }
  //                         }
  //                       ]
  //                     }
  //                   }
  //                 }
  //               ]
  //             },
  //             "onFailure": {
  //               "actions": [
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": isPartIssued,
  //                     "data": "false"
  //                   }
  //                 },
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": "errorResp",
  //                     "data": "responseData"
  //                   }
  //                 },
  //                 {
  //                   "type": "updateComponent",
  //                   "config": {
  //                     "key": "errorTitleUUID",
  //                     "properties": {
  //                       "titleValue": "#errorResp",
  //                       "isShown": true
  //                     }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       ];

  //       softwareTaskActions = [
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": "userSelectedSoftwareAssembly",
  //             "data": item.ASSEMBLY_CODE_NAME
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": "userSelectedSoftwareDefect",
  //             "data": item.DEFECT_CODE_NAME
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": "userSelectedSoftwareAction",
  //             "data": item.ACTION_CODE_NAME
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": "userSelectedSoftwareFaultIdentifiedBy",
  //             "data": "Part rep. reason"
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": "userSelectedSoftwareFaultIdentifiedByName",
  //             "data": "Operator"
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": "userSelectedSoftwareDefectName",
  //             "data": completeDefectName
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "createComponent",
  //           "config": {
  //             "targetId": "pageUUID",
  //             "containerId": "prebodysectionone",
  //             "data": {
  //               "ctype": "taskPanel",
  //               "uuid": "softwareProcessUUID",
  //               "isblueBorder": true,
  //               "uniqueUUID": true,
  //               "columnWiseTitle": true,
  //               "header": {
  //                 "svgIcon": "software",
  //                 "statusIcon": "check_circle",
  //                 "statusClass": "complete-status",
  //                 "class": "complete-task"
  //               },
  //               "headerTitleLabels": [
  //                 "#userSelectedSoftwareAssembly",
  //                 "",
  //                 "Defect",
  //                 "Upload"
  //               ],
  //               "headerTitleValues": [
  //                 "#userSelectedSoftwareCommodityName",
  //                 "",
  //                 "#userSelectedSoftwareDefectName",
  //                 "software"
  //               ],
  //               "inputClasses": [
  //                 "parent1",
  //                 "parent2"
  //               ],
  //               "expanded": false,
  //               "hideToggle": true,
  //               "collapsedHeight": "40px",
  //               "expandedHeight": "40px",
  //               "bodyclass": "splitView",
  //               "taskpanelfooterclass": "d-flex justify-content-between",
  //               "leftDivclass": "width:50%",
  //               "rightDivclass": "width:50%",
  //               "visibility": false,
  //               "hooks": [
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "addToExistingContext",
  //                     "target": "defectCodeList",
  //                     "sourceData": {
  //                       "defectCode": item.DEFECT_CODE_NAME
  //                     }
  //                   },
  //                   "hookType": "afterInit"
  //                 }, {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "addToExistingContext",
  //                     "target": "assemblyCodeList",
  //                     "sourceData": {
  //                       "assemblyCode": item.ASSEMBLY_CODE_NAME
  //                     }
  //                   },
  //                   "hookType": "afterInit"
  //                 },
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": currentTaskPanelId,
  //                     "data": "#createdComponentUUID"
  //                   },
  //                   "hookType": "afterInit"
  //                 },
  //                 {
  //                   "type": "addOccurenceToContext",
  //                   "hookType": "afterInit",
  //                   "config": {
  //                     "target": "occurenceList",
  //                     "taskUuid": "#" + currentTaskPanelId,
  //                     "currentDefectCode": item.DEFECT_CODE_NAME,
  //                     "currentAssemblyCode": item.ASSEMBLY_CODE_NAME
  //                   },
  //                   "eventSource": "click"
  //                 }
  //               ],
  //               "validations": [],
  //               "actions": [],
  //               "items": [
  //                 {
  //                   "ctype": "title",
  //                   "titleValue": "",
  //                   "titleClass": "greyish-black body-italic"
  //                 }
  //               ],
  //               "footer": [
  //                 {
  //                   "ctype": "iconbutton",
  //                   "parentuuid": "#createdComponentUUID",
  //                   "text": "Delete",
  //                   "uuid": "softwareDeleteButtonUUID",
  //                   "visibility": true,
  //                   "disabled": false,
  //                   "type": "submit",
  //                   "hooks": [],
  //                   "validations": [],
  //                   "icon": "delete",
  //                   "iconButtonClass": "light-red",
  //                   "iconClass": "light-red",
  //                   "actions": [
  //                     {
  //                       "type": "getFilteredFromContext",
  //                       "config": {
  //                         "target": "#occurenceList",
  //                         "key": currentOccurenceData,
  //                         "properties": {
  //                           "key": "#" + currentTaskPanelId
  //                         }
  //                       },
  //                       "eventSource": "click"
  //                     },
  //                     {
  //                       "type": "microservice",
  //                       "eventSource": "click",
  //                       "config": {
  //                         "microserviceId": "cancelFA",
  //                         "requestMethod": "post",
  //                         "isLocal": false,
  //                         "LocalService": "assets/Responses/performFA.json",
  //                         "body": {
  //                           "updateFailureAnalysisRequest": {
  //                             "bcn": "#repairUnitInfo.ITEM_BCN",
  //                             "assemblyCodeChangeList": {
  //                               "assemblyCodeChange": [
  //                                 {
  //                                   "assemblyCode": item.ASSEMBLY_CODE_NAME,
  //                                   "operation": "Delete",
  //                                   "occurrence": "#" + currentOccurenceData + ".assemblycodeOccurence"
  //                                 }
  //                               ]
  //                             }
  //                           },
  //                           "userPwd": {
  //                             "password": "#loginUUID.password",
  //                             "username": "#userAccountInfo.PersonalDetails.USERID"
  //                           },
  //                           "operationTypes": "ProcessImmediate",
  //                           "ip": "::1",
  //                           "callSource": "FrontEnd",
  //                           "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                           "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                         },
  //                         "toBeStringified": true
  //                       },
  //                       "responseDependents": {
  //                         "onSuccess": {
  //                           "actions": [
  //                             {
  //                               "type": "microservice",
  //                               "eventSource": "click",
  //                               "config": {
  //                                 "microserviceId": "cancelFA",
  //                                 "requestMethod": "post",
  //                                 "isLocal": false,
  //                                 "LocalService": "assets/Responses/performFA.json",
  //                                 "body": {
  //                                   "updateFailureAnalysisRequest": {
  //                                     "bcn": "#repairUnitInfo.ITEM_BCN",

  //                                     "defectCodeChangeList": {
  //                                       "defectCodeChange": [
  //                                         {
  //                                           "defectCode": item.DEFECT_CODE_NAME,
  //                                           "operation": "Delete",
  //                                           "occurrence": "#" + currentOccurenceData + ".defectCodeOccurence"
  //                                         }
  //                                       ]
  //                                     }
  //                                   },
  //                                   "userPwd": {
  //                                     "password": "#loginUUID.password",
  //                                     "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                   },
  //                                   "operationTypes": "ProcessImmediate",
  //                                   "ip": "::1",
  //                                   "callSource": "FrontEnd",
  //                                   "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                   "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                                 },
  //                                 "toBeStringified": true
  //                               },
  //                               "responseDependents": {
  //                                 "onSuccess": {
  //                                   "actions": [
  //                                     {
  //                                       "type": "deleteAndUpdateOccurence",
  //                                       "config": {
  //                                         "target": "#occurenceList",
  //                                         "key": "#" + currentTaskPanelId,
  //                                         "currentTaskData": "#" + currentOccurenceData
  //                                       },
  //                                       "eventSource": "click"
  //                                     },
  //                                     {
  //                                       "type": "deleteComponent",
  //                                       "eventSource": "click"
  //                                     }, {
  //                                       "type": "updateComponent",
  //                                       "config": {
  //                                         "key": "errorTitleUUID",
  //                                         "properties": {
  //                                           "titleValue": "",
  //                                           "isShown": false
  //                                         }
  //                                       }
  //                                     }
  //                                   ]
  //                                 },
  //                                 "onFailure": {
  //                                   "actions": [
  //                                     {
  //                                       "type": "context",
  //                                       "config": {
  //                                         "requestMethod": "add",
  //                                         "key": "performFAError",
  //                                         "data": "responseData"
  //                                       }
  //                                     },
  //                                     {
  //                                       "type": "updateComponent",
  //                                       "config": {
  //                                         "key": "errorTitleUUID",
  //                                         "properties": {
  //                                           "titleValue": "#performFAError",
  //                                           "isShown": true
  //                                         }
  //                                       }
  //                                     }
  //                                   ]
  //                                 }
  //                               }
  //                             }
  //                           ]
  //                         },
  //                         "onFailure": {
  //                           "actions": [
  //                             {
  //                               "type": "context",
  //                               "config": {
  //                                 "requestMethod": "add",
  //                                 "key": "performFAError",
  //                                 "data": "responseData"
  //                               }
  //                             },
  //                             {
  //                               "type": "updateComponent",
  //                               "config": {
  //                                 "key": "errorTitleUUID",
  //                                 "properties": {
  //                                   "titleValue": "#performFAError",
  //                                   "isShown": true
  //                                 }
  //                               }
  //                             }
  //                           ]
  //                         }
  //                       }
  //                     }
  //                   ]
  //                 }
  //               ]
  //             }
  //           },
  //           "eventSource": "click"
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "addToExistingContext",
  //             "target": "debugFlexFieldData",
  //             "sourceData": {
  //               "parentUUID": "#createdComponentUUID",
  //               "flexFields": [
  //                 {
  //                   "userSelectedCommodityName": "#userSelectedSoftwareAssembly",
  //                   "userSelectedDefect": "#userSelectedSoftwareDefect",
  //                   "userSelectedAction": "#userSelectedSoftwareAction"
  //                 }
  //               ]
  //             }
  //           },
  //           "eventSource": "click"
  //         },
  //       ];

  //       manualTaskActions = [
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": "userSelectedManualCommodityName",
  //             "data": item.ASSEMBLY_CODE_NAME
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": "userSelectedManualAssembly",
  //             "data": item.ASSEMBLY_CODE_NAME
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": "userSelectedManualDefect",
  //             "data": item.DEFECT_CODE_NAME
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": "userSelectedManualAction",
  //             "data": item.ACTION_CODE_NAME
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": "userSelectedManualFaultIdentifiedBy",
  //             "data": "Part rep. reason"
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": "userSelectedManualFaultIdentifiedByName",
  //             "data": "Operator"
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": "userSelectedManualDefectName",
  //             "data": completeDefectName
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "createComponent",
  //           "config": {
  //             "targetId": "pageUUID",
  //             "containerId": "prebodysectionone",
  //             "data": {
  //               "ctype": "taskPanel",
  //               "uuid": "manualProcessUUID",
  //               "isblueBorder": true,
  //               "uniqueUUID": true,
  //               "columnWiseTitle": true,
  //               "header": {
  //                 "svgIcon": "manual",
  //                 "statusIcon": "hourglass_empty",
  //                 "statusClass": "incomplete-status margin-top-10 header-icon"
  //               },
  //               "headerTitleLabels": [
  //                 "",
  //                 "",
  //                 "Defect",
  //                 "Manual"
  //               ],
  //               "headerTitleValues": [
  //                 "#userSelectedManualCommodityName",
  //                 "",
  //                 "#userSelectedManualDefectName",
  //                 "Task"
  //               ],
  //               "inputClasses": [
  //                 "parent1",
  //                 "parent2"
  //               ],
  //               "expanded": false,
  //               "hideToggle": true,
  //               "collapsedHeight": "40px",
  //               "expandedHeight": "40px",
  //               "bodyclass": "splitView",
  //               "taskpanelfooterclass": "d-flex justify-content-between",
  //               "leftDivclass": "width:50%",
  //               "rightDivclass": "width:50%",
  //               "visibility": false,
  //               "hooks": [
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "addToExistingContext",
  //                     "target": "defectCodeList",
  //                     "sourceData": {
  //                       "defectCode": item.DEFECT_CODE_NAME
  //                     }
  //                   },
  //                   "hookType": "afterInit"
  //                 }, {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "addToExistingContext",
  //                     "target": "assemblyCodeList",
  //                     "sourceData": {
  //                       "assemblyCode": item.ASSEMBLY_CODE_NAME
  //                     }
  //                   },
  //                   "hookType": "afterInit"
  //                 },
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": currentTaskPanelId,
  //                     "data": "#createdComponentUUID"
  //                   },
  //                   "hookType": "afterInit"
  //                 },
  //                 {
  //                   "type": "addOccurenceToContext",
  //                   "hookType": "afterInit",
  //                   "config": {
  //                     "target": "occurenceList",
  //                     "taskUuid": "#" + currentTaskPanelId,
  //                     "currentDefectCode": item.DEFECT_CODE_NAME,
  //                     "currentAssemblyCode": item.ASSEMBLY_CODE_NAME
  //                   },
  //                   "eventSource": "click"
  //                 }
  //               ],
  //               "validations": [],
  //               "actions": [],
  //               "items": [
  //                 {
  //                   "ctype": "title",
  //                   "titleValue": "",
  //                   "titleClass": "greyish-black body-italic"
  //                 }
  //               ],
  //               "footer": [
  //                 {
  //                   "ctype": "iconbutton",
  //                   "text": "Delete",
  //                   "uuid": "manualDeleteButtonUUID",
  //                   "parentuuid": "#createdComponentUUID",
  //                   "visibility": true,
  //                   "disabled": false,
  //                   "type": "submit",
  //                   "hooks": [

  //                   ],
  //                   "validations": [],
  //                   "icon": "delete",
  //                   "iconButtonClass": "light-red",
  //                   "iconClass": "light-red",
  //                   "actions": [
  //                     {
  //                       "type": "getFilteredFromContext",
  //                       "config": {
  //                         "target": "#occurenceList",
  //                         "key": currentOccurenceData,
  //                         "properties": {
  //                           "key": "#" + currentTaskPanelId
  //                         }
  //                       },
  //                       "eventSource": "click"
  //                     },
  //                     {
  //                       "type": "microservice",
  //                       "eventSource": "click",
  //                       "config": {
  //                         "microserviceId": "cancelFA",
  //                         "requestMethod": "post",
  //                         "isLocal": false,
  //                         "LocalService": "assets/Responses/performFA.json",
  //                         "body": {
  //                           "updateFailureAnalysisRequest": {
  //                             "bcn": "#repairUnitInfo.ITEM_BCN",
  //                             "assemblyCodeChangeList": {
  //                               "assemblyCodeChange": [
  //                                 {
  //                                   "assemblyCode": item.ASSEMBLY_CODE_NAME,
  //                                   "operation": "Delete",
  //                                   "occurrence": "#" + currentOccurenceData + ".assemblycodeOccurence"
  //                                 }
  //                               ]
  //                             }
  //                           },
  //                           "userPwd": {
  //                             "password": "#loginUUID.password",
  //                             "username": "#userAccountInfo.PersonalDetails.USERID"
  //                           },
  //                           "operationTypes": "ProcessImmediate",
  //                           "ip": "::1",
  //                           "callSource": "FrontEnd",
  //                           "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                           "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                         },
  //                         "toBeStringified": true
  //                       },
  //                       "responseDependents": {
  //                         "onSuccess": {
  //                           "actions": [
  //                             {
  //                               "type": "microservice",
  //                               "eventSource": "click",
  //                               "config": {
  //                                 "microserviceId": "cancelFA",
  //                                 "requestMethod": "post",
  //                                 "isLocal": false,
  //                                 "LocalService": "assets/Responses/performFA.json",
  //                                 "body": {
  //                                   "updateFailureAnalysisRequest": {
  //                                     "bcn": "#repairUnitInfo.ITEM_BCN",

  //                                     "defectCodeChangeList": {
  //                                       "defectCodeChange": [
  //                                         {
  //                                           "defectCode": item.DEFECT_CODE_NAME,
  //                                           "operation": "Delete",
  //                                           "occurrence": "#" + currentOccurenceData + ".defectCodeOccurence"
  //                                         }
  //                                       ]
  //                                     }
  //                                   },
  //                                   "userPwd": {
  //                                     "password": "#loginUUID.password",
  //                                     "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                   },
  //                                   "operationTypes": "ProcessImmediate",
  //                                   "ip": "::1",
  //                                   "callSource": "FrontEnd",
  //                                   "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                   "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                                 },
  //                                 "toBeStringified": true
  //                               },
  //                               "responseDependents": {
  //                                 "onSuccess": {
  //                                   "actions": [
  //                                     {
  //                                       "type": "deleteAndUpdateOccurence",
  //                                       "config": {
  //                                         "target": "#occurenceList",
  //                                         "key": "#" + currentTaskPanelId,
  //                                         "currentTaskData": "#" + currentOccurenceData
  //                                       },
  //                                       "eventSource": "click"
  //                                     },
  //                                     {
  //                                       "type": "deleteComponent",
  //                                       "eventSource": "click"
  //                                     },
  //                                     {
  //                                       "type": "condition",
  //                                       "config": {
  //                                         "operation": "isContains",
  //                                         "lhs": [
  //                                           32,
  //                                           34
  //                                         ],
  //                                         "rhs": item.ACTION_CODE_NAME
  //                                       },
  //                                       "eventSource": "click",
  //                                       "responseDependents": {
  //                                         "onSuccess": {
  //                                           "actions": [
  //                                             {
  //                                               "type": "updateComponent",
  //                                               "eventSource": "click",
  //                                               "config": {
  //                                                 "key": "replaceIconUUID",
  //                                                 "properties": {
  //                                                   "disabled": false
  //                                                 }
  //                                               }
  //                                             },
  //                                             {
  //                                               "type": "updateComponent",
  //                                               "eventSource": "click",
  //                                               "config": {
  //                                                 "key": "softwareIconUUID",
  //                                                 "properties": {
  //                                                   "disabled": false
  //                                                 }
  //                                               }
  //                                             },
  //                                             {
  //                                               "type": "updateComponent",
  //                                               "eventSource": "click",
  //                                               "config": {
  //                                                 "key": "manualIconUUID",
  //                                                 "properties": {
  //                                                   "disabled": false
  //                                                 }
  //                                               }
  //                                             }
  //                                           ]
  //                                         },
  //                                         "onFailure": {
  //                                           "actions": []
  //                                         }
  //                                       }
  //                                     },
  //                                     {
  //                                       "type": "updateComponent",
  //                                       "config": {
  //                                         "key": "errorTitleUUID",
  //                                         "properties": {
  //                                           "titleValue": "",
  //                                           "isShown": false
  //                                         }
  //                                       }
  //                                     }
  //                                   ]
  //                                 },
  //                                 "onFailure": {
  //                                   "actions": [
  //                                     {
  //                                       "type": "context",
  //                                       "config": {
  //                                         "requestMethod": "add",
  //                                         "key": "performFAError",
  //                                         "data": "responseData"
  //                                       }
  //                                     },
  //                                     {
  //                                       "type": "updateComponent",
  //                                       "config": {
  //                                         "key": "errorTitleUUID",
  //                                         "properties": {
  //                                           "titleValue": "#performFAError",
  //                                           "isShown": true
  //                                         }
  //                                       }
  //                                     }
  //                                   ]
  //                                 }
  //                               }
  //                             }
  //                           ]
  //                         },
  //                         "onFailure": {
  //                           "actions": [
  //                             {
  //                               "type": "context",
  //                               "config": {
  //                                 "requestMethod": "add",
  //                                 "key": "performFAError",
  //                                 "data": "responseData"
  //                               }
  //                             },
  //                             {
  //                               "type": "updateComponent",
  //                               "config": {
  //                                 "key": "errorTitleUUID",
  //                                 "properties": {
  //                                   "titleValue": "#performFAError",
  //                                   "isShown": true
  //                                 }
  //                               }
  //                             }
  //                           ]
  //                         }
  //                       }
  //                     }
  //                   ]
  //                 }
  //               ]
  //             }
  //           },
  //           "eventSource": "click"
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "addToExistingContext",
  //             "target": "debugFlexFieldData",
  //             "sourceData": {
  //               "parentUUID": "#createdComponentUUID",
  //               "flexFields": [
  //                 {
  //                   "userSelectedCommodityName": "#userSelectedManualCommodityName",
  //                   "userSelectedDefect": "#userSelectedManualDefect",
  //                   "userSelectedAction": "#userSelectedManualAction"
  //                 }
  //               ]
  //             }
  //           },
  //           "eventSource": "click"
  //         }
  //       ]

  //       if (item.ACTION_CODE_NAME == 29 || item.ACTION_CODE_NAME == 77) {
  //         replaceTaskActions.forEach((ele) => {
  //           this.handleAction(ele, instance);
  //         });
  //       }

  //       else if (item.ACTION_CODE_NAME == 33 || item.ACTION_CODE_NAME == 35 ||
  //         item.ACTION_CODE_NAME == 36 || item.ACTION_CODE_NAME == 37) {
  //         softwareTaskActions.forEach((ele) => {
  //           this.handleAction(ele, instance);
  //         });
  //       } else if (item.ACTION_CODE_NAME == 30 || item.ACTION_CODE_NAME == 31 ||
  //         item.ACTION_CODE_NAME == 32 || item.ACTION_CODE_NAME == 34) {
  //         manualTaskActions.forEach((ele) => {
  //           this.handleAction(ele, instance);
  //         });
  //       } else {
  //       }
  //     });

  //     commonTaskActions.forEach((ele) => {
  //       this.handleAction(ele, instance);
  //     });
  //   }
  // }

  // handleQuoteResponseControlService(action, instance) {
  //   let looperData = [];
  //   let replaceTaskActions = [];
  //   let filterIWData = false;

  //   filterIWData = action.config.filterIWData ? action.config.filterIWData : false;

  //   looperData = this.contextService.getDataByKey(action.config.data);
  //   if (looperData !== undefined && looperData.length > 0) {
  //     looperData.sort((a, b) => a.ACTIONID.localeCompare(b.ACTIONID));
  //     looperData.forEach((item, index) => {
  //       let dialogBox = {};

  //       if ((index + 1) === looperData.length) {
  //         dialogBox = {
  //           "type": "dialog",
  //           "uuid": "requistionreplacetaskUUID",
  //           "config": {
  //             "title": "Requisition List",
  //             "minimumWidth": false,
  //             "disableClose": false,
  //             "hasBackdrop": true,
  //             "backdropClass": "cdk-overlay-transparent-backdrop",
  //             "width": "380px",
  //             "height": "400px",
  //             "footerclass": "float-right",
  //             "position": {
  //               "bottom": "0",
  //               "left": "70%",
  //               "right": "0",
  //               "top": "1%"
  //             },
  //             "items": [
  //               {
  //                 "ctype": "table",
  //                 "isDelete": true,
  //                 "uuid": "ReplacerequisitiontasktableUUID",
  //                 "tableClass": "replaceTaskTableclass",
  //                 "tableHeaderClass": "requisitionList-table-header subtitle1",
  //                 "tableContainerClass": "requisitionList-table",
  //                 "hooks": [],
  //                 "displayedColumns": [
  //                   "Part Details",
  //                   "Qty"
  //                 ],
  //                 "datasource": "#requisitionList",
  //                 "actions": [
  //                   {
  //                     "type": "updateComponent",
  //                     "eventSource": "rowDelete",
  //                     "config": {
  //                       "key": "errorTitleUUID",
  //                       "properties": {
  //                         "titleValue": "",
  //                         "isShown": false
  //                       }
  //                     }
  //                   },
  //                   {
  //                     "type": "GetValueFromArray",
  //                     "config": {
  //                       "arrayData": "#debugFlexFieldData",
  //                       "PullValue": "currentTaskPanelData",
  //                       "key": "parentUUID",
  //                       "property": "flexFields"
  //                     },
  //                     "eventSource": "rowDelete"
  //                   },
  //                   {
  //                     "type": "condition",
  //                     "config": {
  //                       "operation": "isEqualTo",
  //                       "lhs": "#requisitionListStatus",
  //                       "rhs": "saved"
  //                     },
  //                     "eventSource": "rowDelete",
  //                     "responseDependents": {
  //                       "onSuccess": {
  //                         "actions": [
  //                           {
  //                             "type": "microservice",
  //                             "config": {
  //                               "microserviceId": "cancelReqOrder",
  //                               "requestMethod": "post",
  //                               "body": {
  //                                 "reqOrderId": "#requisitionId",
  //                                 "canceledBy": "#loginUUID.username",
  //                                 "notes": "Cancel Requisition Order"
  //                               },
  //                               "toBeStringified": true
  //                             },
  //                             "responseDependents": {
  //                               "onSuccess": {
  //                                 "actions": [
  //                                   {
  //                                     "type": "context",
  //                                     "config": {
  //                                       "requestMethod": "add",
  //                                       "key": "cancelReqOrderResp",
  //                                       "data": "responseData"
  //                                     }
  //                                   },
  //                                   {
  //                                     "type": "microservice",
  //                                     "eventSource": "rowDelete",
  //                                     "config": {
  //                                       "microserviceId": "cancelFA",
  //                                       "requestMethod": "post",
  //                                       "isLocal": false,
  //                                       "LocalService": "assets/Responses/performFA.json",
  //                                       "body": {
  //                                         "updateFailureAnalysisRequest": {
  //                                           "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                           "assemblyCodeChangeList": {
  //                                             "assemblyCodeChange": [
  //                                               {
  //                                                 "assemblyCode": "#currentTaskPanelData.userSelectedCommodityName",
  //                                                 "operation": "Delete"
  //                                               }
  //                                             ]
  //                                           }
  //                                         },
  //                                         "userPwd": {
  //                                           "password": "#loginUUID.password",
  //                                           "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                         },
  //                                         "operationTypes": "ProcessImmediate",
  //                                         "ip": "::1",
  //                                         "callSource": "FrontEnd",
  //                                         "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                         "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                                       },
  //                                       "toBeStringified": true
  //                                     },
  //                                     "responseDependents": {
  //                                       "onSuccess": {
  //                                         "actions": [
  //                                           {
  //                                             "type": "microservice",
  //                                             "eventSource": "rowDelete",
  //                                             "config": {
  //                                               "microserviceId": "cancelFA",
  //                                               "requestMethod": "post",
  //                                               "isLocal": false,
  //                                               "LocalService": "assets/Responses/performFA.json",
  //                                               "body": {
  //                                                 "updateFailureAnalysisRequest": {
  //                                                   "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                   "defectCodeChangeList": {
  //                                                     "defectCodeChange": [
  //                                                       {
  //                                                         "defectCode": "#currentTaskPanelData.userSelectedDefect",
  //                                                         "operation": "Delete"
  //                                                       }
  //                                                     ]
  //                                                   }
  //                                                 },
  //                                                 "userPwd": {
  //                                                   "password": "#loginUUID.password",
  //                                                   "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                                 },
  //                                                 "operationTypes": "ProcessImmediate",
  //                                                 "ip": "::1",
  //                                                 "callSource": "FrontEnd",
  //                                                 "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                                 "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                                               },
  //                                               "toBeStringified": true
  //                                             },
  //                                             "responseDependents": {
  //                                               "onSuccess": {
  //                                                 "actions": [
  //                                                   {
  //                                                     "type": "context",
  //                                                     "config": {
  //                                                       "requestMethod": "add",
  //                                                       "key": "requisitionListStatus",
  //                                                       "data": "Unsaved"
  //                                                     }
  //                                                   },
  //                                                   {
  //                                                     "type": "GetValueFromArray",
  //                                                     "config": {
  //                                                       "arrayData": "#debugFlexFieldData",
  //                                                       "PullValue": "currentTaskPanelData",
  //                                                       "key": "parentUUID",
  //                                                       "property": "flexFields",
  //                                                       "splice": true,
  //                                                       "deleteTableData": true
  //                                                     },
  //                                                     "eventSource": "rowDelete"
  //                                                   },
  //                                                   {
  //                                                     "type": "errorPrepareAndRender",
  //                                                     "config": {
  //                                                       "key": "requisitionListButtonUUID",
  //                                                       "properties": {
  //                                                         "titleValue": "Requisition List ({0})",
  //                                                         "isShown": true
  //                                                       },
  //                                                       "valueArray": [
  //                                                         "#requisitionListLength"
  //                                                       ]
  //                                                     }
  //                                                   },
  //                                                   {
  //                                                     "type": "condition",
  //                                                     "config": {
  //                                                       "operation": "isValid",
  //                                                       "lhs": "#requisitionListLength"
  //                                                     },
  //                                                     "eventSource": "rowDelete",
  //                                                     "responseDependents": {
  //                                                       "onSuccess": {
  //                                                         "actions": [
  //                                                           {
  //                                                             "type": "updateComponent",
  //                                                             "config": {
  //                                                               "key": "requisitionListButtonUUID",
  //                                                               "properties": {
  //                                                                 "textValue": "- Unsaved",
  //                                                                 "textValueClass": "light-red body"
  //                                                               }
  //                                                             }
  //                                                           },
  //                                                           {
  //                                                             "type": "condition",
  //                                                             "config": {
  //                                                               "operation": "isEqualTo",
  //                                                               "lhs": "#requisitionListStatus",
  //                                                               "rhs": "saved"
  //                                                             },
  //                                                             "eventSource": "change",
  //                                                             "responseDependents": {
  //                                                               "onSuccess": {
  //                                                                 "actions": [
  //                                                                   {
  //                                                                     "type": "updateComponent",
  //                                                                     "config": {
  //                                                                       "key": "requisitionSaveButtonUUID",
  //                                                                       "properties": {
  //                                                                         "disabled": true
  //                                                                       }
  //                                                                     },
  //                                                                     "eventSource": "click"
  //                                                                   }
  //                                                                 ]
  //                                                               },
  //                                                               "onFailure": {
  //                                                                 "actions": [
  //                                                                   {
  //                                                                     "type": "updateComponent",
  //                                                                     "config": {
  //                                                                       "key": "requisitionSaveButtonUUID",
  //                                                                       "properties": {
  //                                                                         "disabled": false
  //                                                                       }
  //                                                                     },
  //                                                                     "eventSource": "click"
  //                                                                   }
  //                                                                 ]
  //                                                               }
  //                                                             }
  //                                                           }
  //                                                         ]
  //                                                       },
  //                                                       "onFailure": {
  //                                                         "actions": [
  //                                                           {
  //                                                             "type": "updateComponent",
  //                                                             "config": {
  //                                                               "key": "requisitionListButtonUUID",
  //                                                               "properties": {
  //                                                                 "textValue": ""
  //                                                               }
  //                                                             }
  //                                                           },
  //                                                           {
  //                                                             "type": "updateComponent",
  //                                                             "config": {
  //                                                               "key": "softwareIconUUID",
  //                                                               "properties": {
  //                                                                 "disabled": false
  //                                                               }
  //                                                             }
  //                                                           },
  //                                                           {
  //                                                             "type": "updateComponent",
  //                                                             "config": {
  //                                                               "key": "manualIconUUID",
  //                                                               "properties": {
  //                                                                 "disabled": false
  //                                                               }
  //                                                             }
  //                                                           },
  //                                                           {
  //                                                             "type": "updateComponent",
  //                                                             "config": {
  //                                                               "key": "manualIconUUID",
  //                                                               "properties": {
  //                                                                 "disabled": false
  //                                                               }
  //                                                             }
  //                                                           },
  //                                                           {
  //                                                             "type": "updateComponent",
  //                                                             "config": {
  //                                                               "key": "requisitionSaveButtonUUID",
  //                                                               "properties": {
  //                                                                 "disabled": true
  //                                                               }
  //                                                             },
  //                                                             "eventSource": "click"
  //                                                           },
  //                                                           {
  //                                                             "type": "context",
  //                                                             "config": {
  //                                                               "requestMethod": "add",
  //                                                               "key": "templateName",
  //                                                               "data": "BYD_COM_TOWERS_3"
  //                                                             },
  //                                                             "eventSource": "change"
  //                                                           },
  //                                                           {
  //                                                             "type": "microservice",
  //                                                             "config": {
  //                                                               "microserviceId": "getResultCodeByValidateResult",
  //                                                               "requestMethod": "get",
  //                                                               "params": {
  //                                                                 "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                                 "validateResult": 1
  //                                                               }
  //                                                             },
  //                                                             "responseDependents": {
  //                                                               "onSuccess": {
  //                                                                 "actions": [
  //                                                                   {
  //                                                                     "type": "context",
  //                                                                     "config": {
  //                                                                       "requestMethod": "add",
  //                                                                       "key": "resultCodesForDiscrepancy",
  //                                                                       "data": "responseData"
  //                                                                     }
  //                                                                   },
  //                                                                   {
  //                                                                     "type": "updateComponent",
  //                                                                     "config": {
  //                                                                       "key": "quoteResponseTimeoutUUID",
  //                                                                       "properties": {
  //                                                                         "disabled": true
  //                                                                       }
  //                                                                     }
  //                                                                   },
  //                                                                   {
  //                                                                     "type": "updateComponent",
  //                                                                     "config": {
  //                                                                       "key": "quoteResponseResultCodesUUID",
  //                                                                       "dropDownProperties": {
  //                                                                         "options": "#resultCodesForDiscrepancy"
  //                                                                       }
  //                                                                     }
  //                                                                   }
  //                                                                 ]
  //                                                               },
  //                                                               "onFailure": {
  //                                                                 "actions": [
  //                                                                   {
  //                                                                     "type": "context",
  //                                                                     "config": {
  //                                                                       "requestMethod": "add",
  //                                                                       "key": "errorDisp",
  //                                                                       "data": "responseData"
  //                                                                     }
  //                                                                   },
  //                                                                   {
  //                                                                     "type": "updateComponent",
  //                                                                     "config": {
  //                                                                       "key": "errorTitleUUID",
  //                                                                       "properties": {
  //                                                                         "titleValue": "#errorDisp",
  //                                                                         "isShown": true
  //                                                                       }
  //                                                                     }
  //                                                                   }
  //                                                                 ]
  //                                                               }
  //                                                             }
  //                                                           }
  //                                                         ]
  //                                                       }
  //                                                     }
  //                                                   },
  //                                                   {
  //                                                     "type": "deleteComponent",
  //                                                     "eventSource": "click"
  //                                                   }
  //                                                 ]
  //                                               },
  //                                               "onFailure": {
  //                                                 "actions": [
  //                                                   {
  //                                                     "type": "context",
  //                                                     "config": {
  //                                                       "requestMethod": "add",
  //                                                       "key": "performFAError",
  //                                                       "data": "responseData"
  //                                                     }
  //                                                   },
  //                                                   {
  //                                                     "type": "updateComponent",
  //                                                     "config": {
  //                                                       "key": "errorTitleUUID",
  //                                                       "properties": {
  //                                                         "titleValue": "#performFAError",
  //                                                         "isShown": true
  //                                                       }
  //                                                     }
  //                                                   }
  //                                                 ]
  //                                               }
  //                                             }
  //                                           }
  //                                         ]
  //                                       },
  //                                       "onFailure": {
  //                                         "actions": [
  //                                           {
  //                                             "type": "context",
  //                                             "config": {
  //                                               "requestMethod": "add",
  //                                               "key": "performFAError",
  //                                               "data": "responseData"
  //                                             }
  //                                           },
  //                                           {
  //                                             "type": "updateComponent",
  //                                             "config": {
  //                                               "key": "errorTitleUUID",
  //                                               "properties": {
  //                                                 "titleValue": "#performFAError",
  //                                                 "isShown": true
  //                                               }
  //                                             }
  //                                           }
  //                                         ]
  //                                       }
  //                                     }
  //                                   }
  //                                 ]
  //                               },
  //                               "onFailure": {
  //                                 "actions": [
  //                                   {
  //                                     "type": "context",
  //                                     "config": {
  //                                       "requestMethod": "add",
  //                                       "key": "cancelReqOrderResp",
  //                                       "data": "responseData"
  //                                     }
  //                                   },
  //                                   {
  //                                     "type": "updateComponent",
  //                                     "config": {
  //                                       "key": "errorTitleUUID",
  //                                       "properties": {
  //                                         "titleValue": "#cancelReqOrderResp",
  //                                         "isShown": true
  //                                       }
  //                                     }
  //                                   }
  //                                 ]
  //                               }
  //                             }
  //                           }
  //                         ]
  //                       },
  //                       "onFailure": {
  //                         "actions": [
  //                           {
  //                             "type": "microservice",
  //                             "eventSource": "click",
  //                             "config": {
  //                               "microserviceId": "cancelFA",
  //                               "requestMethod": "post",
  //                               "isLocal": false,
  //                               "LocalService": "assets/Responses/performFA.json",
  //                               "body": {
  //                                 "updateFailureAnalysisRequest": {
  //                                   "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                   "assemblyCodeChangeList": {
  //                                     "assemblyCodeChange": [
  //                                       {
  //                                         "assemblyCode": "#currentTaskPanelData.userSelectedCommodityName",
  //                                         "operation": "Delete"
  //                                       }
  //                                     ]
  //                                   }
  //                                 },
  //                                 "userPwd": {
  //                                   "password": "#loginUUID.password",
  //                                   "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                 },
  //                                 "operationTypes": "ProcessImmediate",
  //                                 "ip": "::1",
  //                                 "callSource": "FrontEnd",
  //                                 "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                 "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                               },
  //                               "toBeStringified": true
  //                             },
  //                             "responseDependents": {
  //                               "onSuccess": {
  //                                 "actions": [
  //                                   {
  //                                     "type": "microservice",
  //                                     "eventSource": "click",
  //                                     "config": {
  //                                       "microserviceId": "cancelFA",
  //                                       "requestMethod": "post",
  //                                       "isLocal": false,
  //                                       "LocalService": "assets/Responses/performFA.json",
  //                                       "body": {
  //                                         "updateFailureAnalysisRequest": {
  //                                           "bcn": "#repairUnitInfo.ITEM_BCN",

  //                                           "defectCodeChangeList": {
  //                                             "defectCodeChange": [
  //                                               {
  //                                                 "defectCode": "#currentTaskPanelData.userSelectedDefect",
  //                                                 "operation": "Delete"
  //                                               }
  //                                             ]
  //                                           }
  //                                         },
  //                                         "userPwd": {
  //                                           "password": "#loginUUID.password",
  //                                           "username": "#userAccountInfo.PersonalDetails.USERID"
  //                                         },
  //                                         "operationTypes": "ProcessImmediate",
  //                                         "ip": "::1",
  //                                         "callSource": "FrontEnd",
  //                                         "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                                         "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                                       },
  //                                       "toBeStringified": true
  //                                     },
  //                                     "responseDependents": {
  //                                       "onSuccess": {
  //                                         "actions": [
  //                                           {
  //                                             "type": "GetValueFromArray",
  //                                             "config": {
  //                                               "arrayData": "#debugFlexFieldData",
  //                                               "PullValue": "currentTaskPanelData",
  //                                               "key": "parentUUID",
  //                                               "property": "flexFields",
  //                                               "splice": true,
  //                                               "deleteTableData": true
  //                                             },
  //                                             "eventSource": "click"
  //                                           },
  //                                           {
  //                                             "type": "context",
  //                                             "config": {
  //                                               "requestMethod": "add",
  //                                               "key": "requisitionListStatus",
  //                                               "data": "Unsaved"
  //                                             }
  //                                           },
  //                                           {
  //                                             "type": "errorPrepareAndRender",
  //                                             "config": {
  //                                               "key": "requisitionListButtonUUID",
  //                                               "properties": {
  //                                                 "titleValue": "Requisition List ({0})",
  //                                                 "isShown": true
  //                                               },
  //                                               "valueArray": [
  //                                                 "#requisitionListLength"
  //                                               ]
  //                                             }
  //                                           },
  //                                           {
  //                                             "type": "condition",
  //                                             "config": {
  //                                               "operation": "isValid",
  //                                               "lhs": "#requisitionListLength"
  //                                             },
  //                                             "eventSource": "rowDelete",
  //                                             "responseDependents": {
  //                                               "onSuccess": {
  //                                                 "actions": [
  //                                                   {
  //                                                     "type": "updateComponent",
  //                                                     "config": {
  //                                                       "key": "requisitionListButtonUUID",
  //                                                       "properties": {
  //                                                         "textValue": "- Unsaved",
  //                                                         "textValueClass": "light-red body"
  //                                                       }
  //                                                     }
  //                                                   },
  //                                                   {
  //                                                     "type": "condition",
  //                                                     "config": {
  //                                                       "operation": "isEqualTo",
  //                                                       "lhs": "#requisitionListStatus",
  //                                                       "rhs": "saved"
  //                                                     },
  //                                                     "eventSource": "change",
  //                                                     "responseDependents": {
  //                                                       "onSuccess": {
  //                                                         "actions": [
  //                                                           {
  //                                                             "type": "updateComponent",
  //                                                             "config": {
  //                                                               "key": "requisitionSaveButtonUUID",
  //                                                               "properties": {
  //                                                                 "disabled": true
  //                                                               }
  //                                                             },
  //                                                             "eventSource": "click"
  //                                                           }
  //                                                         ]
  //                                                       },
  //                                                       "onFailure": {
  //                                                         "actions": [
  //                                                           {
  //                                                             "type": "updateComponent",
  //                                                             "config": {
  //                                                               "key": "requisitionSaveButtonUUID",
  //                                                               "properties": {
  //                                                                 "disabled": false
  //                                                               }
  //                                                             },
  //                                                             "eventSource": "click"
  //                                                           }
  //                                                         ]
  //                                                       }
  //                                                     }
  //                                                   }
  //                                                 ]
  //                                               },
  //                                               "onFailure": {
  //                                                 "actions": [
  //                                                   {
  //                                                     "type": "updateComponent",
  //                                                     "config": {
  //                                                       "key": "requisitionListButtonUUID",
  //                                                       "properties": {
  //                                                         "textValue": ""
  //                                                       }
  //                                                     }
  //                                                   },
  //                                                   {
  //                                                     "type": "updateComponent",
  //                                                     "config": {
  //                                                       "key": "softwareIconUUID",
  //                                                       "properties": {
  //                                                         "disabled": false
  //                                                       }
  //                                                     }
  //                                                   },
  //                                                   {
  //                                                     "type": "updateComponent",
  //                                                     "config": {
  //                                                       "key": "manualIconUUID",
  //                                                       "properties": {
  //                                                         "disabled": false
  //                                                       }
  //                                                     }
  //                                                   },
  //                                                   {
  //                                                     "type": "updateComponent",
  //                                                     "config": {
  //                                                       "key": "requisitionSaveButtonUUID",
  //                                                       "properties": {
  //                                                         "disabled": true
  //                                                       }
  //                                                     },
  //                                                     "eventSource": "click"
  //                                                   },
  //                                                   {
  //                                                     "type": "context",
  //                                                     "config": {
  //                                                       "requestMethod": "add",
  //                                                       "key": "templateName",
  //                                                       "data": "BYD_COM_TOWERS_3"
  //                                                     },
  //                                                     "eventSource": "change"
  //                                                   },
  //                                                   {
  //                                                     "type": "microservice",
  //                                                     "config": {
  //                                                       "microserviceId": "getResultCodeByValidateResult",
  //                                                       "requestMethod": "get",
  //                                                       "params": {
  //                                                         "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                                         "validateResult": 1
  //                                                       }
  //                                                     },
  //                                                     "responseDependents": {
  //                                                       "onSuccess": {
  //                                                         "actions": [
  //                                                           {
  //                                                             "type": "context",
  //                                                             "config": {
  //                                                               "requestMethod": "add",
  //                                                               "key": "resultCodesForDiscrepancy",
  //                                                               "data": "responseData"
  //                                                             }
  //                                                           },
  //                                                           {
  //                                                             "type": "updateComponent",
  //                                                             "config": {
  //                                                               "key": "quoteResponseTimeoutUUID",
  //                                                               "properties": {
  //                                                                 "disabled": true
  //                                                               }
  //                                                             }
  //                                                           },
  //                                                           {
  //                                                             "type": "updateComponent",
  //                                                             "config": {
  //                                                               "key": "quoteResponseResultCodesUUID",
  //                                                               "dropDownProperties": {
  //                                                                 "options": "#resultCodesForDiscrepancy"
  //                                                               }
  //                                                             }
  //                                                           }
  //                                                         ]
  //                                                       },
  //                                                       "onFailure": {
  //                                                         "actions": [
  //                                                           {
  //                                                             "type": "context",
  //                                                             "config": {
  //                                                               "requestMethod": "add",
  //                                                               "key": "errorDisp",
  //                                                               "data": "responseData"
  //                                                             }
  //                                                           },
  //                                                           {
  //                                                             "type": "updateComponent",
  //                                                             "config": {
  //                                                               "key": "errorTitleUUID",
  //                                                               "properties": {
  //                                                                 "titleValue": "#errorDisp",
  //                                                                 "isShown": true
  //                                                               }
  //                                                             }
  //                                                           }
  //                                                         ]
  //                                                       }
  //                                                     }
  //                                                   }
  //                                                 ]
  //                                               }
  //                                             }
  //                                           },
  //                                           {
  //                                             "type": "deleteComponent",
  //                                             "eventSource": "click"
  //                                           }
  //                                         ]
  //                                       },
  //                                       "onFailure": {
  //                                         "actions": [
  //                                           {
  //                                             "type": "context",
  //                                             "config": {
  //                                               "requestMethod": "add",
  //                                               "key": "performFAError",
  //                                               "data": "responseData"
  //                                             }
  //                                           },
  //                                           {
  //                                             "type": "updateComponent",
  //                                             "config": {
  //                                               "key": "errorTitleUUID",
  //                                               "properties": {
  //                                                 "titleValue": "#performFAError",
  //                                                 "isShown": true
  //                                               }
  //                                             }
  //                                           }
  //                                         ]
  //                                       }
  //                                     }
  //                                   }
  //                                 ]
  //                               },
  //                               "onFailure": {
  //                                 "actions": [
  //                                   {
  //                                     "type": "context",
  //                                     "config": {
  //                                       "requestMethod": "add",
  //                                       "key": "performFAError",
  //                                       "data": "responseData"
  //                                     }
  //                                   },
  //                                   {
  //                                     "type": "updateComponent",
  //                                     "config": {
  //                                       "key": "errorTitleUUID",
  //                                       "properties": {
  //                                         "titleValue": "#performFAError",
  //                                         "isShown": true
  //                                       }
  //                                     }
  //                                   }
  //                                 ]
  //                               }
  //                             }
  //                           }
  //                         ]
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             ],
  //             "footer": [
  //               {
  //                 "ctype": "button",
  //                 "color": "primary",
  //                 "name": "requisitionSaveButton",
  //                 "text": "Requisition Part(s)",
  //                 "uuid": "requisitionSaveButtonUUID",
  //                 "inputClass": "requis-save-btn-cls",
  //                 "dialogButton": true,
  //                 "visibility": true,
  //                 "type": "submit",
  //                 "closeType": "success",
  //                 "hooks": [
  //                   {
  //                     "type": "condition",
  //                     "hookType": "afterInit",
  //                     "config": {
  //                       "operation": "isValid",
  //                       "lhs": "#requisitionListLength"
  //                     },
  //                     "eventSource": "change",
  //                     "responseDependents": {
  //                       "onSuccess": {
  //                         "actions": [
  //                           {
  //                             "type": "condition",
  //                             "config": {
  //                               "operation": "isEqualTo",
  //                               "lhs": "#requisitionListStatus",
  //                               "rhs": "saved"
  //                             },
  //                             "eventSource": "change",
  //                             "responseDependents": {
  //                               "onSuccess": {
  //                                 "actions": []
  //                               },
  //                               "onFailure": {
  //                                 "actions": [
  //                                   {
  //                                     "type": "updateComponent",
  //                                     "config": {
  //                                       "key": "requisitionSaveButtonUUID",
  //                                       "properties": {
  //                                         "disabled": false
  //                                       }
  //                                     },
  //                                     "eventSource": "click"
  //                                   }
  //                                 ]
  //                               }
  //                             }
  //                           }
  //                         ]
  //                       },
  //                       "onFailure": {
  //                         "actions": [
  //                           {
  //                             "type": "updateComponent",
  //                             "config": {
  //                               "key": "requisitionSaveButtonUUID",
  //                               "properties": {
  //                                 "disabled": true
  //                               }
  //                             },
  //                             "eventSource": "click"
  //                           }
  //                         ]
  //                       }
  //                     }
  //                   }
  //                 ],
  //                 "validations": [],
  //                 "actions": []
  //               }
  //             ]
  //           },
  //           "eventSource": "click",
  //           "responseDependents": {
  //             "onSuccess": {
  //               "actions": [
  //                 {
  //                   "type": "updateComponent",
  //                   "eventSource": "click",
  //                   "config": {
  //                     "key": "errorTitleUUID",
  //                     "properties": {
  //                       "titleValue": "",
  //                       "isShown": false
  //                     }
  //                   }
  //                 },
  //                 {
  //                   "type": "microservice",
  //                   "config": {
  //                     "microserviceId": "getKardexReqDebug",
  //                     "isLocal": false,
  //                     "LocalService": "assets/Responses/performFA.json",
  //                     "requestMethod": "post",
  //                     "body": {
  //                       "locationId": "#repairUnitInfo.LOCATION_ID",
  //                       "clientId": "#repairUnitInfo.CLIENT_ID",
  //                       "contractId": "#repairUnitInfo.CONTRACT_ID",
  //                       "workCenterId": "#repairUnitInfo.WORKCENTER_ID",
  //                       "userName": "#userAccountInfo.PersonalDetails.USERID",
  //                       "owner": "JGS BYDGOSZCZ",
  //                       "orderProcessType": "#repairUnitInfo.ROUTE",
  //                       "conditionName": "Workable",
  //                       "line": "#kardexLineList"
  //                     },
  //                     "toBeStringified": true
  //                   },
  //                   "responseDependents": {
  //                     "onSuccess": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": `getKardexReqDebugResp${index}`,
  //                             "data": "responseData"
  //                           }
  //                         },
  //                         {
  //                           "type": "microservice",
  //                           "config": {
  //                             "microserviceId": "createReqOrder",
  //                             "isLocal": false,
  //                             "LocalService": "assets/Responses/performFA.json",
  //                             "requestMethod": "post",
  //                             "body": {
  //                               "apiUsageClientName": "#repairUnitInfo.CLIENTNAME",
  //                               "callSource": "FrontEnd",
  //                               "clientRefNo1": "#repairUnitInfo.ITEM_BCN",
  //                               "clientRefNo2": "#repairUnitInfo.SERIAL_NO",
  //                               "orderStatus": "Released",
  //                               "lines": "#lineList",
  //                               "templateName": "#templateName",
  //                               "kardexLineList": `#getKardexReqDebugResp${index}.line`,
  //                               "usrPw": {
  //                                 "username": "#loginUUID.username",
  //                                 "password": "#loginUUID.password"
  //                               }
  //                             },
  //                             "toBeStringified": true
  //                           },
  //                           "responseDependents": {
  //                             "onSuccess": {
  //                               "actions": [
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "config": {
  //                                     "key": "requisitionSaveButtonUUID",
  //                                     "properties": {
  //                                       "disabled": false
  //                                     }
  //                                   },
  //                                   "eventSource": "click"
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "createReqResp",
  //                                     "data": "responseData"
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "requisitionId",
  //                                     "data": "#createReqResp.requisitionId"
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "config": {
  //                                     "key": "requisitionListButtonUUID",
  //                                     "properties": {
  //                                       "textValue": "- Saved",
  //                                       "textValueClass": "saved-green"
  //                                     }
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "requisitionListStatus",
  //                                     "data": "saved"
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "enableComponent",
  //                                   "config": {
  //                                     "key": "quoteResponseResultCodesUUID",
  //                                     "property": "ResultCodes"
  //                                   },
  //                                   "eventSource": "click"
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "config": {
  //                                     "key": "quoteResponseTimeoutUUID",
  //                                     "properties": {
  //                                       "disabled": false
  //                                     }
  //                                   },
  //                                   "eventSource": "click"
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "config": {
  //                                     "key": "quoteResponseResultCodesUUID",
  //                                     "fieldProperties": {
  //                                       "ResultCodes": "PASS_REW"
  //                                     }
  //                                   },
  //                                   "eventSource": "click"
  //                                 },
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "SelectedDescripencyResultcode",
  //                                     "data": "PASS_REW"
  //                                   },
  //                                   "eventSource": "click"
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "config": {
  //                                     "key": "softwareIconUUID",
  //                                     "properties": {
  //                                       "disabled": false
  //                                     }
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "config": {
  //                                     "key": "manualIconUUID",
  //                                     "properties": {
  //                                       "disabled": false
  //                                     }
  //                                   }
  //                                 }
  //                               ]
  //                             },
  //                             "onFailure": {
  //                               "actions": [
  //                                 {
  //                                   "type": "context",
  //                                   "config": {
  //                                     "requestMethod": "add",
  //                                     "key": "errorCreateReq",
  //                                     "data": "responseData"
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "config": {
  //                                     "key": "errorTitleUUID",
  //                                     "properties": {
  //                                       "titleValue": "#errorCreateReq",
  //                                       "isShown": true
  //                                     }
  //                                   }
  //                                 }
  //                               ]
  //                             }
  //                           },
  //                           "eventSource": "click"
  //                         }
  //                       ]
  //                     },
  //                     "onFailure": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "errorhpFa",
  //                             "data": "responseData"
  //                           }
  //                         },
  //                         {
  //                           "type": "updateComponent",
  //                           "config": {
  //                             "key": "errorTitleUUID",
  //                             "properties": {
  //                               "titleValue": "#errorhpFa",
  //                               "isShown": true
  //                             }
  //                           }
  //                         }
  //                       ]
  //                     }
  //                   }
  //                 }
  //               ]
  //             },
  //             "onFailure": {}
  //           }
  //         };
  //       }

  //       let cabDropDownUUID = "createdCabDropDown" + index;
  //       let createdTaskQty = "createdTaskQty" + index;
  //       let averageValueForExistingTaskUUID = "averageValueForExistingTaskUUID" + index;
  //       let replaceDeleteButtonUUID = "replaceDeleteButtonUUID" + index;
  //       let createdReplaceCompleteButtonUUID = "createdReplaceCompleteButtonUUID" + index;
  //       let createdTaskUserSelectedMessageName = "createdTaskUserSelectedMessageName" + index;
  //       let createdTaskCabMessage = "createdTaskUserSelectedMessage" + index;
  //       let createdTaskCabMessageName = "createdTaskCabMessageName" + index;
  //       let partRepType = "partRepType" + index;
  //       let averagePartValueResp = "averagePartValueResp" + index;
  //       let currentTaskPanelId = "currentTaskPanelId" + index;
  //       let finalPartNumber = "finalPartNumber" + index;
  //       let userSelectedPartNumber = "userSelectedPartNumber" + index;

  //       let cabMessagesResp = this.contextService.getDataByKey("cabMessagesResp");
  //       let defaultCab;
  //       if (cabMessagesResp && (item.ACTION_NOTE !== null)) {
  //         defaultCab = cabMessagesResp.filter((currentCab) => {
  //           return currentCab.cab === item.ACTION_NOTE;
  //         });
  //       } else {
  //         defaultCab = [{
  //           "message": "Select"
  //         }];
  //       }

  //       const completeDefectName = item.DEFECT_CODE_NAME + '-' + item.DEFECT_CODE_DESC;
  //       replaceTaskActions = [
  //         {
  //           "type": "condition",
  //           "config": {
  //             "operation": "isEqualTo",
  //             "lhs": "#userSelectedClient",
  //             "rhs": "1030"
  //           },
  //           "eventSource": "change",
  //           "responseDependents": {
  //             "onSuccess": {
  //               "actions": [
  //                 {
  //                   "type": "condition",
  //                   "config": {
  //                     "operation": "isEqualTo",
  //                     "lhs": "#userSelectedContract",
  //                     "rhs": "14856"
  //                   },
  //                   "eventSource": "change",
  //                   "responseDependents": {
  //                     "onSuccess": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "ownerId",
  //                             "data": "1835"
  //                           },
  //                           "eventSource": "change"
  //                         }
  //                       ]
  //                     },
  //                     "onFailure": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "ownerId",
  //                             "data": "#repairUnitInfo.OWNER_ID"
  //                           },
  //                           "eventSource": "change"
  //                         }
  //                       ]
  //                     }
  //                   }
  //                 }
  //               ]
  //             },
  //             "onFailure": {
  //               "actions": [
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": "ownerId",
  //                     "data": "#repairUnitInfo.OWNER_ID"
  //                   },
  //                   "eventSource": "change"
  //                 }
  //               ]
  //             }
  //           }
  //         },
  //         {
  //           "type": "context",
  //           "config": {
  //             "requestMethod": "add",
  //             "key": userSelectedPartNumber,
  //             "data": item.DEFECT_NOTE
  //           },
  //           "eventSource": "change"
  //         },
  //         {
  //           "type": "microservice",
  //           "eventSource": "click",
  //           "config": {
  //             "microserviceId": "getReqListByPN",
  //             "requestMethod": "post",
  //             "body": {
  //               "partNo": "#" + userSelectedPartNumber,
  //               "locationId": "#repairUnitInfo.LOCATION_ID",
  //               "clientId": "#repairUnitInfo.CLIENT_ID",
  //               "contractId": "#repairUnitInfo.CONTRACT_ID",
  //               "ownerId": "#ownerId",
  //               "username": "#loginUUID.username"
  //             },
  //             "toBeStringified": true
  //           },
  //           "responseDependents": {
  //             "onSuccess": {
  //               "actions": [
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": "userSelectedPartDescription",
  //                     "data": item.PART_DESC
  //                   },
  //                   "eventSource": "change"
  //                 },
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": "userSelectedCommodityName",
  //                     "data": item.ASSEMBLY_CODE_NAME
  //                   },
  //                   "eventSource": "change"
  //                 },
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": "userSelectedDefect",
  //                     "data": item.DEFECT_CODE_NAME
  //                   },
  //                   "eventSource": "change"
  //                 },
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": "userSelectedReplaceAction",
  //                     "data": item.ACTION_CODE_NAME
  //                   },
  //                   "eventSource": "change"
  //                 },
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": "userSelectedDefectName",
  //                     "data": completeDefectName
  //                   },
  //                   "eventSource": "change"
  //                 },
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": "getReqListByPNResp",
  //                     "data": "responseData"
  //                   }
  //                 },
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": "getReqListByPNRespArrayData",
  //                     "data": "responseArray"
  //                   }
  //                 },
  //                 {
  //                   "type": "condition",
  //                   "config": {
  //                     "operation": "isNotEmptyArray",
  //                     "lhs": "#getReqListByPNResp"
  //                   },
  //                   "eventSource": "input",
  //                   "responseDependents": {
  //                     "onSuccess": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "userSelectedPartNumberId",
  //                             "data": "#getReqListByPNRespArrayData.partId"
  //                           }
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "finalPartStockQuantity",
  //                             "data": "#getReqListByPNRespArrayData.quantity"
  //                           }
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": finalPartNumber,
  //                             "data": "#getReqListByPNRespArrayData.partNo"
  //                           }
  //                         },
  //                         {
  //                           "type": "condition",
  //                           "config": {
  //                             "operation": "isEqualTo",
  //                             "lhs": item.DEFECT_NOTE,
  //                             "rhs": "#getReqListByPNRespArrayData.partNo"
  //                           },
  //                           "eventSource": "change",
  //                           "responseDependents": {
  //                             "onSuccess": {
  //                               "actions": []
  //                             },
  //                             "onFailure": {
  //                               "actions": [
  //                                 {
  //                                   "type": "microservice",
  //                                   "eventSource": "click",
  //                                   "config": {
  //                                     "microserviceId": "performFA",
  //                                     "requestMethod": "post",
  //                                     "isLocal": false,
  //                                     "LocalService": "assets/Responses/performFA.json",
  //                                     "body": {
  //                                       "updateFailureAnalysisRequest": {
  //                                         "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                         "actionCodeChangeList": {
  //                                           "actionCodeChange": [
  //                                             {
  //                                               "assemblyCode": {
  //                                                 "value": item.ASSEMBLY_CODE_NAME
  //                                               },
  //                                               "defectCode": {
  //                                                 "value": item.DEFECT_CODE_NAME
  //                                               },
  //                                               "notes": item.ACTION_NOTE,
  //                                               "actionCode": item.ACTION_CODE_NAME,
  //                                               "operation": "Update"
  //                                             }
  //                                           ]
  //                                         },
  //                                         "assemblyCodeChangeList": {
  //                                           "assemblyCodeChange": [
  //                                             {
  //                                               "assemblyCode": item.ASSEMBLY_CODE_NAME,
  //                                               "operation": "Update"
  //                                             }
  //                                           ]
  //                                         },
  //                                         "defectCodeChangeList": {
  //                                           "defectCodeChange": [
  //                                             {
  //                                               "defectCode": item.DEFECT_CODE_NAME,
  //                                               "operation": "Update",
  //                                               "notes": "#getReqListByPNRespArrayData.partNo"
  //                                             }
  //                                           ]
  //                                         }
  //                                       },
  //                                       "userPwd": {
  //                                         "username": "#loginUUID.username",
  //                                         "password": "#loginUUID.password"
  //                                       },
  //                                       "operationTypes": "ProcessImmediate",
  //                                       "ip": "::1",
  //                                       "callSource": "FrontEnd",
  //                                       "apiUsage_LocationName": "#UnitInfo.GEONAME",
  //                                       "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
  //                                     },
  //                                     "toBeStringified": true,
  //                                     "spliceIfEmptyValueObject": [
  //                                       {
  //                                         "identifier": "actionCodeChange",
  //                                         "valueField": "notes"
  //                                       }
  //                                     ]
  //                                   },
  //                                   "responseDependents": {
  //                                     "onSuccess": {
  //                                       "actions": []
  //                                     },
  //                                     "onFailure": {
  //                                       "actions": [
  //                                         {
  //                                           "type": "context",
  //                                           "config": {
  //                                             "requestMethod": "add",
  //                                             "key": "performFAError",
  //                                             "data": "responseData"
  //                                           }
  //                                         },
  //                                         {
  //                                           "type": "updateComponent",
  //                                           "config": {
  //                                             "key": "errorTitleUUID",
  //                                             "properties": {
  //                                               "titleValue": "#performFAError",
  //                                               "isShown": true
  //                                             }
  //                                           }
  //                                         }
  //                                       ]
  //                                     }
  //                                   }
  //                                 }
  //                               ]
  //                             }
  //                           }
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "userSelectedPartNumberName",
  //                             "data": "#getReqListByPNRespArrayData.completePart"
  //                           },
  //                           "eventSource": "change"
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "userSelectedPartDescription",
  //                             "data": "#getReqListByPNRespArrayData.partDesc"
  //                           },
  //                           "eventSource": "change"
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "quantity",
  //                             "data": "Qty 1"
  //                           },
  //                           "eventSource": "click"
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "headerClass",
  //                             "data": "body2"
  //                           },
  //                           "eventSource": "click"
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "displayQuantity",
  //                             "data": ""
  //                           },
  //                           "eventSource": "click"
  //                         }
  //                       ]
  //                     },
  //                     "onFailure": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "userSelectedPartNumberId",
  //                             "data": item.PART_ID
  //                           }
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "finalPartStockQuantity",
  //                             "data": 0
  //                           }
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": finalPartNumber,
  //                             "data": "#" + userSelectedPartNumber
  //                           }
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "templateName",
  //                             "data": "BYD_COM_HOLD_3"
  //                           },
  //                           "eventSource": "click"
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "financialCode",
  //                             "data": "003"
  //                           },
  //                           "eventSource": "change"
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "quantity",
  //                             "data": "Out of stock"
  //                           },
  //                           "eventSource": "click"
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "headerClass",
  //                             "data": "light-red heading-eco-normal"
  //                           },
  //                           "eventSource": "click"
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "displayQuantity",
  //                             "data": "Out of stock"
  //                           },
  //                           "eventSource": "click"
  //                         }
  //                       ]
  //                     }
  //                   }
  //                 },
  //                 {
  //                   "type": "condition",
  //                   "config": {
  //                     "operation": "isValid",
  //                     "lhs": "#getRequisitionByBCNResp.requisitionId"
  //                   },
  //                   "responseDependents": {
  //                     "onSuccess": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "requisitionId",
  //                             "data": "#getRequisitionByBCNResp.requisitionId"
  //                           }
  //                         },
  //                         {
  //                           "type": "updateComponent",
  //                           "config": {
  //                             "key": "requisitionListButtonUUID",
  //                             "properties": {
  //                               "textValue": "- Saved",
  //                               "textValueClass": "saved-green"
  //                             }
  //                           }
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "requisitionListStatus",
  //                             "data": "saved"
  //                           }
  //                         }
  //                       ]
  //                     },
  //                     "onFailure": {
  //                       "actions": [
  //                         {
  //                           "type": "updateComponent",
  //                           "config": {
  //                             "key": "requisitionListButtonUUID",
  //                             "properties": {
  //                               "textValue": "- Unsaved",
  //                               "textValueClass": "light-red body"
  //                             }
  //                           }
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "requisitionListStatus",
  //                             "data": "Unsaved"
  //                           }
  //                         }
  //                       ]
  //                     }
  //                   }
  //                 },
  //                 {
  //                   "type": "condition",
  //                   "config": {
  //                     "operation": "isValid",
  //                     "lhs": item.ACTION_NOTE
  //                   },
  //                   "eventSource": "click",
  //                   "responseDependents": {
  //                     "onSuccess": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "financialCode",
  //                             "data": "003"
  //                           },
  //                           "eventSource": "click"
  //                         }
  //                       ]
  //                     },
  //                     "onFailure": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "financialCode",
  //                             "data": "001"
  //                           },
  //                           "eventSource": "click"
  //                         }
  //                       ]
  //                     }
  //                   }
  //                 },
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "addToExistingContext",
  //                     "target": "lineList",
  //                     "sourceData": {
  //                       "compLocation": "#repairUnitInfo.GEONAME",
  //                       "partNumber": "#" + finalPartNumber,
  //                       "defectName": "#userSelectedDefect",
  //                       "itemBCN": "#repairUnitInfo.ITEM_BCN",
  //                       "quantity": "1",
  //                       "owner": "JGS BYDGOSZCZ",
  //                       "condition": "Workable",
  //                       "financialCode": "#financialCode",
  //                       "priority": "Medium"
  //                     }
  //                   },
  //                   "eventSource": "click"
  //                 },
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "addToExistingContext",
  //                     "target": "kardexLineList",
  //                     "sourceData": {
  //                       "partId": "#userSelectedPartNumberId",
  //                       "partNumber": "#" + finalPartNumber,
  //                       "quantity": 1,
  //                       "availQuantity": "#finalPartStockQuantity",
  //                       "srcWarehouse": "HP LAPTOP WUR",
  //                       "srcLocation": "TOWERS",
  //                       "srcOwner": "JGS BYDGOSZCZ",
  //                       "isSubstituted": "NO"
  //                     }
  //                   },
  //                   "eventSource": "click"
  //                 },
  //                 {
  //                   "type": "condition",
  //                   "config": {
  //                     "operation": "isValid",
  //                     "lhs": item.ACTION_NOTE
  //                   },
  //                   "eventSource": "click",
  //                   "responseDependents": {
  //                     "onSuccess": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "repairProcessType",
  //                             "data": "Quote"
  //                           },
  //                           "eventSource": "change"
  //                         },
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": currentTaskPanelId,
  //                             "data": "#createdComponentUUID"
  //                           },
  //                           "eventSource": "click"
  //                         }
  //                       ]
  //                     },
  //                     "onFailure": {
  //                       "actions": [
  //                         {
  //                           "type": "context",
  //                           "config": {
  //                             "requestMethod": "add",
  //                             "key": "repairProcessType",
  //                             "data": "Kardex"
  //                           },
  //                           "eventSource": "change"
  //                         }
  //                       ]
  //                     }
  //                   }
  //                 },
  //                 {
  //                   "type": "condition",
  //                   "config": {
  //                     "operation": "isEqualTo",
  //                     "lhs": "#requisitionListStatus",
  //                     "rhs": "saved"
  //                   },
  //                   "eventSource": "click",
  //                   "responseDependents": {
  //                     "onSuccess": {
  //                       "actions": [
  //                         {
  //                           "type": "condition",
  //                           "config": {
  //                             "operation": "isValid",
  //                             "lhs": item.ACTION_NOTE
  //                           },
  //                           "eventSource": "click",
  //                           "responseDependents": {
  //                             "onSuccess": {
  //                               "actions": [
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "eventSource": "click",
  //                                   "config": {
  //                                     "key": "debugTimeoutUUID",
  //                                     "properties": {
  //                                       "visibility": false,
  //                                       "disabled": true
  //                                     }
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "eventSource": "click",
  //                                   "config": {
  //                                     "key": "debugNextUUID",
  //                                     "properties": {
  //                                       "visibility": true,
  //                                       "disabled": false
  //                                     }
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "eventSource": "click",
  //                                   "config": {
  //                                     "key": "debugResultCodesUUID",
  //                                     "properties": {
  //                                       "visibility": false
  //                                     }
  //                                   }
  //                                 }
  //                               ]
  //                             },
  //                             "onFailure": {
  //                               "actions": [
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "eventSource": "click",
  //                                   "config": {
  //                                     "key": "debugTimeoutUUID",
  //                                     "properties": {
  //                                       "visibility": true,
  //                                       "disabled": true
  //                                     }
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "eventSource": "click",
  //                                   "config": {
  //                                     "key": "debugNextUUID",
  //                                     "properties": {
  //                                       "visibility": false,
  //                                       "disabled": true
  //                                     }
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "eventSource": "click",
  //                                   "config": {
  //                                     "key": "debugResultCodesUUID",
  //                                     "properties": {
  //                                       "visibility": true
  //                                     }
  //                                   }
  //                                 }
  //                               ]
  //                             }
  //                           }
  //                         }
  //                       ]
  //                     },
  //                     "onFailure": {
  //                       "actions": [
  //                         {
  //                           "type": "condition",
  //                           "config": {
  //                             "operation": "isValid",
  //                             "lhs": item.ACTION_NOTE
  //                           },
  //                           "eventSource": "click",
  //                           "responseDependents": {
  //                             "onSuccess": {
  //                               "actions": [
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "eventSource": "click",
  //                                   "config": {
  //                                     "key": "debugTimeoutUUID",
  //                                     "properties": {
  //                                       "visibility": false,
  //                                       "disabled": true
  //                                     }
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "eventSource": "click",
  //                                   "config": {
  //                                     "key": "debugNextUUID",
  //                                     "properties": {
  //                                       "visibility": true,
  //                                       "disabled": true
  //                                     }
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "eventSource": "click",
  //                                   "config": {
  //                                     "key": "debugResultCodesUUID",
  //                                     "properties": {
  //                                       "visibility": false
  //                                     }
  //                                   }
  //                                 }
  //                               ]
  //                             },
  //                             "onFailure": {
  //                               "actions": [
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "eventSource": "click",
  //                                   "config": {
  //                                     "key": "debugTimeoutUUID",
  //                                     "properties": {
  //                                       "visibility": true,
  //                                       "disabled": true
  //                                     }
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "eventSource": "click",
  //                                   "config": {
  //                                     "key": "debugNextUUID",
  //                                     "properties": {
  //                                       "visibility": false,
  //                                       "disabled": true
  //                                     }
  //                                   }
  //                                 },
  //                                 {
  //                                   "type": "updateComponent",
  //                                   "eventSource": "click",
  //                                   "config": {
  //                                     "key": "debugResultCodesUUID",
  //                                     "properties": {
  //                                       "visibility": true,
  //                                       "disabled": true
  //                                     }
  //                                   }
  //                                 }
  //                               ]
  //                             }
  //                           }
  //                         }
  //                       ]
  //                     }
  //                   }
  //                 },
  //                 dialogBox,
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "addToExistingContext",
  //                     "target": "requisitionList",
  //                     "sourceData": {
  //                       "Part Details": [
  //                         {
  //                           "ctype": "block-text",
  //                           "uuid": "StockUUID",
  //                           "text": "Part:",
  //                           "textValue": "#" + finalPartNumber,
  //                           "class": "subtitle1 greyish-black overflow-ellipsis width-200"
  //                         },
  //                         {
  //                           "ctype": "block-text",
  //                           "uuid": "StockUUID",
  //                           "textValue": "#userSelectedPartDescription",
  //                           "class": "subtitle1 greyish-black overflow-wrap width-200"
  //                         }
  //                       ],
  //                       "Qty": [
  //                         {
  //                           "ctype": "block-text",
  //                           "uuid": "StockUUID",
  //                           "text": "1"
  //                         },
  //                         {
  //                           "ctype": "block-text",
  //                           "uuid": "displayQuantityUUID",
  //                           "class": "light-red body margin-top-10",
  //                           "text": "#displayQuantity"
  //                         }
  //                       ],
  //                       "parentUUID": "#createdComponentUUID"
  //                     }
  //                   },
  //                   "eventSource": "click"
  //                 },
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "addToExistingContext",
  //                     "target": "debugFlexFieldData",
  //                     "sourceData": {
  //                       "parentUUID": "#createdComponentUUID",
  //                       "flexFields": [
  //                         {
  //                           "userSelectedCommodityName": "#userSelectedCommodityName",
  //                           "userSelectedDefect": "#userSelectedDefect",
  //                           "userSelectedAction": "#userSelectedReplaceAction"
  //                         }
  //                       ]
  //                     }
  //                   },
  //                   "eventSource": "click"
  //                 },
  //                 {
  //                   "type": "context",
  //                   "eventSource": "click",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": "requisitionListLength",
  //                     "data": "contextLength",
  //                     "sourceContext": "requisitionList"
  //                   }
  //                 },
  //                 {
  //                   "type": "errorPrepareAndRender",
  //                   "eventSource": "click",
  //                   "config": {
  //                     "key": "requisitionListButtonUUID",
  //                     "properties": {
  //                       "titleValue": "Requisition List ({0})",
  //                       "isShown": true
  //                     },
  //                     "valueArray": [
  //                       "#requisitionListLength"
  //                     ]
  //                   }
  //                 }
  //               ]
  //             },
  //             "onFailure": {
  //               "actions": [
  //                 {
  //                   "type": "context",
  //                   "config": {
  //                     "requestMethod": "add",
  //                     "key": "errorResp",
  //                     "data": "responseData"
  //                   }
  //                 },
  //                 {
  //                   "type": "updateComponent",
  //                   "config": {
  //                     "key": "errorTitleUUID",
  //                     "properties": {
  //                       "titleValue": "#errorResp",
  //                       "isShown": true
  //                     }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       ];

  //       if (item.ACTION_CODE_NAME == 29 || item.ACTION_CODE_NAME == 77) {
  //         if (filterIWData) {
  //           if (item.FA_FF_VALUE == "IW") {
  //             replaceTaskActions.forEach((ele) => {
  //               this.handleAction(ele, instance);
  //             });
  //           }
  //         } else {
  //           replaceTaskActions.forEach((ele) => {
  //             this.handleAction(ele, instance);
  //           });
  //         }
  //       } else {
  //         //do nothing
  //       }
  //     });

  //     //@quote response -> for fetching result codes and to update it
  //     this.quoteResponseResultListFetchActs().forEach((ele) => {
  //       this.handleAction(ele, instance);
  //     });
  //   }
  // }

  // quoteResponseResultListFetchActs() {
  //   return [{
  //     "type": "microservice",
  //     "config": {
  //       "microserviceId": "getResultCodeByValidateResult",
  //       "requestMethod": "get",
  //       "params": {
  //         "bcn": "#repairUnitInfo.ITEM_BCN",
  //         "validateResult": 0
  //       }
  //     },
  //     "responseDependents": {
  //       "onSuccess": {
  //         "actions": [
  //           {
  //             "type": "context",
  //             "config": {
  //               "requestMethod": "add",
  //               "key": "resultCodesForDiscrepancy",
  //               "data": "responseData"
  //             }
  //           },
  //           {
  //             "type": "updateComponent",
  //             "config": {
  //               "key": "quoteResponseTimeoutUUID",
  //               "properties": {
  //                 "disabled": true
  //               }
  //             }
  //           },
  //           {
  //             "type": "updateComponent",
  //             "config": {
  //               "key": "quoteResponseResultCodesUUID",
  //               "dropDownProperties": {
  //                 "options": "#resultCodesForDiscrepancy"
  //               }
  //             }
  //           }
  //         ]
  //       },
  //       "onFailure": {
  //         "actions": [
  //           {
  //             "type": "context",
  //             "config": {
  //               "requestMethod": "add",
  //               "key": "errorDisp",
  //               "data": "responseData"
  //             }
  //           },
  //           {
  //             "type": "updateComponent",
  //             "config": {
  //               "key": "errorTitleUUID",
  //               "properties": {
  //                 "titleValue": "#errorDisp",
  //                 "isShown": true
  //               }
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   }];
  // }

  // cancelFALooperOperation(action, instance) {
  //   if ((action && action.type) === "cancelFALooper") {
  //     let looperData = [];
  //     let cancelFaActions = [];
  //     let addFaActions = [];
  //     let onlyCID = false;
  //     let addFA = false;

  //     onlyCID = action.config.onlyCID ? action.config.onlyCID : false;
  //     addFA = action.config.addFA ? action.config.addFA : false;

  //     let defaultResultCode = (action.config.defaultResultCode || null);

  //     addFaActions = [
  //       {
  //         "type": "microservice",
  //         "eventSource": "click",
  //         "config": {
  //           "microserviceId": "performFA",
  //           "requestMethod": "post",
  //           "isLocal": false,
  //           "LocalService": "assets/Responses/performFA.json",
  //           "body": {
  //             "updateFailureAnalysisRequest": {
  //               "bcn": "#repairUnitInfo.ITEM_BCN",
  //               "actionCodeChangeList": {
  //                 "actionCodeChange": [
  //                   {
  //                     "assemblyCode": {
  //                       "value": "WK"
  //                     },
  //                     "defectCode": {
  //                       "value": "NTF"
  //                     },
  //                     "actionCode": "34",
  //                     "operation": "Add"
  //                   }
  //                 ]
  //               },
  //               "assemblyCodeChangeList": {
  //                 "assemblyCodeChange": [
  //                   {
  //                     "assemblyCode": "WK",
  //                     "operation": "Add"
  //                   }
  //                 ]
  //               },
  //               "defectCodeChangeList": {
  //                 "defectCodeChange": [
  //                   {
  //                     "defectCode": "NTF",
  //                     "operation": "Add",
  //                   }
  //                 ]
  //               }
  //             },
  //             "userPwd": {
  //               "username": "#loginUUID.username",
  //               "password": "#loginUUID.password"
  //             },
  //             "operationTypes": "ProcessImmediate",
  //             "ip": "::1",
  //             "callSource": "FrontEnd",
  //             "apiUsage_LocationName": "#UnitInfo.GEONAME",
  //             "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
  //           },
  //           "toBeStringified": true
  //         },
  //         "responseDependents": {
  //           "onSuccess": {
  //             "actions": [
  //               {
  //                 "type": "microservice",
  //                 "config": {
  //                   "microserviceId": "getResultCodeByValidateResult",
  //                   "requestMethod": "get",
  //                   "params": {
  //                     "bcn": "#repairUnitInfo.ITEM_BCN",
  //                     "validateResult": 0
  //                   }
  //                 },
  //                 "responseDependents": {
  //                   "onSuccess": {
  //                     "actions": [
  //                       {
  //                         "type": "context",
  //                         "config": {
  //                           "requestMethod": "add",
  //                           "key": "resultCodesForDiscrepancy",
  //                           "data": "responseData"
  //                         }
  //                       },
  //                       {
  //                         "type": "updateComponent",
  //                         "config": {
  //                           "key": "quoteResponseTimeoutUUID",
  //                           "properties": {
  //                             "disabled": (defaultResultCode ? false : true)
  //                           }
  //                         },
  //                         "eventSource": "change"
  //                       },
  //                       {
  //                         "type": "enableComponent",
  //                         "config": {
  //                           "key": "quoteResponseResultCodesUUID",
  //                           "property": "ResultCodes"
  //                         },
  //                         "eventSource": "click"
  //                       },
  //                       {
  //                         "type": "updateComponent",
  //                         "config": {
  //                           "key": "quoteResponseResultCodesUUID",
  //                           "dropDownProperties": {
  //                             "options": "#resultCodesForDiscrepancy"
  //                           }
  //                         }
  //                       },
  //                       {
  //                         "type": "updateComponent",
  //                         "config": {
  //                           "key": "quoteResponseResultCodesUUID",
  //                           "fieldProperties": {
  //                             "ResultCodes": defaultResultCode
  //                           }
  //                         }
  //                       },
  //                       {
  //                         "type": "context",
  //                         "config": {
  //                           "requestMethod": "add",
  //                           "key": "SelectedDescripencyResultcode",
  //                           "data": defaultResultCode
  //                         }
  //                       }
  //                     ]
  //                   },
  //                   "onFailure": {
  //                     "actions": [
  //                       {
  //                         "type": "context",
  //                         "config": {
  //                           "requestMethod": "add",
  //                           "key": "errorDisp",
  //                           "data": "responseData"
  //                         }
  //                       },
  //                       {
  //                         "type": "updateComponent",
  //                         "config": {
  //                           "key": "errorTitleUUID",
  //                           "properties": {
  //                             "titleValue": "#errorDisp",
  //                             "isShown": true
  //                           }
  //                         }
  //                       }
  //                     ]
  //                   }
  //                 }
  //               }
  //             ]
  //           },
  //           "onFailure": {
  //             "actions": [
  //               {
  //                 "type": "context",
  //                 "config": {
  //                   "requestMethod": "add",
  //                   "key": "performFAError",
  //                   "data": "responseData"
  //                 }
  //               },
  //               {
  //                 "type": "updateComponent",
  //                 "config": {
  //                   "key": "errorTitleUUID",
  //                   "properties": {
  //                     "titleValue": "#performFAError",
  //                     "isShown": true
  //                   }
  //                 }
  //               }
  //             ]
  //           }
  //         }
  //       }
  //     ];

  //     looperData = this.contextService.getDataByKey(action.config.data);
  //     if (looperData !== undefined && looperData.length > 0) {
  //       looperData.forEach((item, index) => {
  //         cancelFaActions = [
  //           {
  //             "type": "microservice",
  //             "eventSource": "click",
  //             "config": {
  //               "microserviceId": "cancelFA",
  //               "requestMethod": "post",
  //               "isLocal": false,
  //               "LocalService": "assets/Responses/performFA.json",
  //               "body": {
  //                 "updateFailureAnalysisRequest": {
  //                   "bcn": "#repairUnitInfo.ITEM_BCN",
  //                   "assemblyCodeChangeList": {
  //                     "assemblyCodeChange": [
  //                       {
  //                         "assemblyCode": item.ASSEMBLY_CODE_NAME,
  //                         "operation": "Delete"
  //                       }
  //                     ]
  //                   }
  //                 },
  //                 "userPwd": {
  //                   "password": "#loginUUID.password",
  //                   "username": "#userAccountInfo.PersonalDetails.USERID"
  //                 },
  //                 "operationTypes": "ProcessImmediate",
  //                 "ip": "::1",
  //                 "callSource": "FrontEnd",
  //                 "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                 "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //               },
  //               "toBeStringified": true
  //             },
  //             "responseDependents": {
  //               "onSuccess": {
  //                 "actions": [
  //                   {
  //                     "type": "microservice",
  //                     "eventSource": "click",
  //                     "config": {
  //                       "microserviceId": "cancelFA",
  //                       "requestMethod": "post",
  //                       "isLocal": false,
  //                       "LocalService": "assets/Responses/performFA.json",
  //                       "body": {
  //                         "updateFailureAnalysisRequest": {
  //                           "bcn": "#repairUnitInfo.ITEM_BCN",

  //                           "defectCodeChangeList": {
  //                             "defectCodeChange": [
  //                               {
  //                                 "defectCode": item.DEFECT_CODE_NAME,
  //                                 "operation": "Delete"
  //                               }
  //                             ]
  //                           }
  //                         },
  //                         "userPwd": {
  //                           "password": "#loginUUID.password",
  //                           "username": "#userAccountInfo.PersonalDetails.USERID"
  //                         },
  //                         "operationTypes": "ProcessImmediate",
  //                         "ip": "::1",
  //                         "callSource": "FrontEnd",
  //                         "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
  //                         "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
  //                       },
  //                       "toBeStringified": true
  //                     },
  //                     "responseDependents": {
  //                       "onSuccess": {
  //                         "actions": [
  //                           {
  //                             "type": "context",
  //                             "config": {
  //                               "requestMethod": "add",
  //                               "key": "requisitionListStatus",
  //                               "data": "Unsaved"
  //                             }
  //                           },
  //                           {
  //                             "type": "errorPrepareAndRender",
  //                             "config": {
  //                               "key": "requisitionListButtonUUID",
  //                               "properties": {
  //                                 "titleValue": "Requisition List ({0})",
  //                                 "isShown": true
  //                               },
  //                               "valueArray": [
  //                                 "#requisitionListLength"
  //                               ]
  //                             }
  //                           },
  //                           {
  //                             "type": "condition",
  //                             "config": {
  //                               "operation": "isValid",
  //                               "lhs": "#requisitionListLength"
  //                             },
  //                             "responseDependents": {
  //                               "onSuccess": {
  //                                 "actions": [
  //                                   {
  //                                     "type": "updateComponent",
  //                                     "config": {
  //                                       "key": "requisitionListButtonUUID",
  //                                       "properties": {
  //                                         "textValue": "- Unsaved",
  //                                         "textValueClass": "light-red body"
  //                                       }
  //                                     }
  //                                   }
  //                                 ]
  //                               },
  //                               "onFailure": {
  //                                 "actions": [
  //                                   {
  //                                     "type": "updateComponent",
  //                                     "config": {
  //                                       "key": "requisitionListButtonUUID",
  //                                       "properties": {
  //                                         "textValue": ""
  //                                       }
  //                                     }
  //                                   },
  //                                   {
  //                                     "type": "microservice",
  //                                     "config": {
  //                                       "microserviceId": "getResultCodeByValidateResult",
  //                                       "requestMethod": "get",
  //                                       "params": {
  //                                         "bcn": "#repairUnitInfo.ITEM_BCN",
  //                                         "validateResult": 0
  //                                       }
  //                                     },
  //                                     "responseDependents": {
  //                                       "onSuccess": {
  //                                         "actions": [
  //                                           {
  //                                             "type": "context",
  //                                             "config": {
  //                                               "requestMethod": "add",
  //                                               "key": "resultCodesForDiscrepancy",
  //                                               "data": "responseData"
  //                                             }
  //                                           },
  //                                           {
  //                                             "type": "updateComponent",
  //                                             "config": {
  //                                               "key": "quoteResponseTimeoutUUID",
  //                                               "properties": {
  //                                                 "disabled": (defaultResultCode ? false : true)
  //                                               }
  //                                             }
  //                                           },
  //                                           {
  //                                             "type": "enableComponent",
  //                                             "config": {
  //                                               "key": "quoteResponseResultCodesUUID",
  //                                               "property": "ResultCodes"
  //                                             },
  //                                             "eventSource": "click"
  //                                           },
  //                                           {
  //                                             "type": "updateComponent",
  //                                             "config": {
  //                                               "key": "quoteResponseResultCodesUUID",
  //                                               "dropDownProperties": {
  //                                                 "options": "#resultCodesForDiscrepancy"
  //                                               }
  //                                             }
  //                                           },
  //                                           {
  //                                             "type": "updateComponent",
  //                                             "config": {
  //                                               "key": "quoteResponseResultCodesUUID",
  //                                               "fieldProperties": {
  //                                                 "ResultCodes": defaultResultCode
  //                                               }
  //                                             }
  //                                           },
  //                                           {
  //                                             "type": "context",
  //                                             "config": {
  //                                               "requestMethod": "add",
  //                                               "key": "SelectedDescripencyResultcode",
  //                                               "data": defaultResultCode
  //                                             }
  //                                           }
  //                                         ]
  //                                       },
  //                                       "onFailure": {
  //                                         "actions": [
  //                                           {
  //                                             "type": "context",
  //                                             "config": {
  //                                               "requestMethod": "add",
  //                                               "key": "errorDisp",
  //                                               "data": "responseData"
  //                                             }
  //                                           },
  //                                           {
  //                                             "type": "updateComponent",
  //                                             "config": {
  //                                               "key": "errorTitleUUID",
  //                                               "properties": {
  //                                                 "titleValue": "#errorDisp",
  //                                                 "isShown": true
  //                                               }
  //                                             }
  //                                           }
  //                                         ]
  //                                       }
  //                                     }
  //                                   }
  //                                 ]
  //                               }
  //                             }
  //                           }
  //                         ]
  //                       },
  //                       "onFailure": {
  //                         "actions": [
  //                           {
  //                             "type": "context",
  //                             "config": {
  //                               "requestMethod": "add",
  //                               "key": "performFAError",
  //                               "data": "responseData"
  //                             }
  //                           },
  //                           {
  //                             "type": "updateComponent",
  //                             "config": {
  //                               "key": "errorTitleUUID",
  //                               "properties": {
  //                                 "titleValue": "#performFAError",
  //                                 "isShown": true
  //                               }
  //                             }
  //                           }
  //                         ]
  //                       }
  //                     }
  //                   }
  //                 ]
  //               },
  //               "onFailure": {
  //                 "actions": [
  //                   {
  //                     "type": "context",
  //                     "config": {
  //                       "requestMethod": "add",
  //                       "key": "performFAError",
  //                       "data": "responseData"
  //                     }
  //                   },
  //                   {
  //                     "type": "updateComponent",
  //                     "config": {
  //                       "key": "errorTitleUUID",
  //                       "properties": {
  //                         "titleValue": "#performFAError",
  //                         "isShown": true
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             }
  //           }
  //         ];

  //         if (item.ACTION_CODE_NAME == 29 || item.ACTION_CODE_NAME == 77) {
  //           if (onlyCID) {
  //             if (item.FA_FF_VALUE == "CID") {
  //               cancelFaActions.forEach((ele) => {
  //                 this.handleAction(ele, instance);
  //               });
  //             }
  //           } else {
  //             cancelFaActions.forEach((ele) => {
  //               this.handleAction(ele, instance);
  //             });
  //           }
  //         }

  //       });

  //       if (addFA) {
  //         addFaActions.forEach((ele) => {
  //           this.handleAction(ele, instance);
  //         });
  //       }

  //     }
  //   }
  // }

  // clearFlexFieldAccessories(action, instance) {
  //   const accessoriesFlexFieldRef = this.contextService.getDataByKey('confirmAccessoriesListUUID' + 'ref');
  //   if (accessoriesFlexFieldRef !== undefined) {
  //     const accessoriesFlexCount = accessoriesFlexFieldRef.instance.flexCount.length;
  //     if (accessoriesFlexCount !== undefined && accessoriesFlexCount > 0) {
  //       for (let i = 0; i < accessoriesFlexCount; i++) {
  //         const clearFlexFieldAction = {
  //           ///
  //           type: 'updateComponent',
  //           config: {
  //             key: i + "newNoUUID",
  //             properties: {
  //               readonly: false,
  //               value: '',
  //               rightLabel: '',
  //               placeholder: "Scan Value"
  //             }
  //           }
  //         };

  //         this.handleUpdateComponent(clearFlexFieldAction, null, null);

  //         const clearGroup = {
  //           type: "resetData",
  //           config: {
  //             key: i + "newNoUUID"
  //           }
  //         }

  //         this.handleReset(clearGroup, this.contextService.getDataByKey(i + "newNoUUID" + 'ref').instance);

  //         const resetMissingAccessory = {
  //           type: 'updateComponent',
  //           config: {
  //             key: i + "missingAccessoryUUID",
  //             properties: {
  //               hidden: false
  //             }
  //           }
  //         };
  //         this.handleUpdateComponent(resetMissingAccessory, null, null);
  //       }
  //     }
  //   }
  // }

  // getProperAccessoryName(accessoryObject: any) {
  //   if (accessoryObject.FF_NAME === "AC Adapter SN" || accessoryObject.FF_NAME === "Battery SN")
  //     return accessoryObject.FF_NAME;
  //   else
  //     return accessoryObject.FF_VALUE;
  // }

  // populateEmailSubject(action: any) {
  //   let accessoriesListString = '';
  //   if (action.config.isNotaccessories) {
  //     accessoriesListString = action.config.accessory;
  //     const repairUnitInfoObj = this.contextService.getDataByKey(action.config.bcnValue);
  //     const bodyvalue = this.contextService.getDataByString(action.config.personDetails)

  //     const emailSubjectString = " Problem z wymieniana czescia <" + accessoriesListString + "> w <" + repairUnitInfoObj.ITEM_BCN + ">";
  //     const bodyString = "Czesc, znalazlem problem z czescia z tematu: " + bodyvalue;
  //     console.log(bodyString, "bodyvalue");
  //     this.contextService.addToContext(action.config.key, emailSubjectString);
  //     this.contextService.addToContext(action.config.bodyKey, bodyString);

  //   } else {
  //     let missingAccessoriesList = this.contextService.getDataByKey('missingAccessoriesList');
  //     if (!missingAccessoriesList) {
  //       missingAccessoriesList = [...this.contextService.getDataByKey('confirmAccessoriesFlexFieldsData')];
  //       this.contextService.addToContext('missingAccessoriesList', missingAccessoriesList);
  //     }
  //     for (let i = 0; i < missingAccessoriesList.length; i++) {

  //       let accessoryName = this.getProperAccessoryName(missingAccessoriesList[i]);
  //       if (accessoriesListString === '') {
  //         accessoriesListString = accessoryName;
  //       } else {
  //         accessoriesListString = accessoriesListString + ", " + accessoryName;

  //       }
  //     }
  //     const repairUnitInfoObj = this.contextService.getDataByKey('repairUnitInfo');
  //     const emailSubjectString = "Problem z akcesorium <" + accessoriesListString + "> w <" + repairUnitInfoObj.ITEM_BCN + ">";
  //     this.contextService.addToContext('emailSubjectString', emailSubjectString);
  //   }

  // }

  // populateMissingAccessoriesNamesInTextFields() {
  //   const missingAccessoriesList = this.contextService.getDataByKey('missingAccessoriesList');
  //   let accessoriesListString = '';
  //   let noOfValidatedAccessories = this.contextService.getDataByKey('numOfValidatedFieldsInCA');
  //   noOfValidatedAccessories = noOfValidatedAccessories === undefined || noOfValidatedAccessories === "" ? 0 : noOfValidatedAccessories;
  //   for (let i = 0; i < missingAccessoriesList.length; i++) {

  //     let accessoryName = this.getProperAccessoryName(missingAccessoriesList[i]);

  //     let enableAccessoryNameAction = {
  //       type: 'updateComponent',
  //       config: {
  //         key: (noOfValidatedAccessories + i) + "newNoUUID",
  //         properties: {
  //           placeholder: accessoryName
  //         }
  //       }
  //     };
  //     this.handleUpdateComponent(enableAccessoryNameAction, null, null);

  //   }
  // }

  // performToggel(action, instance) {
  //   // console.log(action);
  //   if (action.name === undefined) {
  //     instance.rightsidenav.toggle();
  //   } else {
  //     let name = this.contextService.getDataByKey(action.name);
  //     name.instance.rightsidenav.toggle();
  //   }
  // }

  // // function to handle the data in resultcode
  // changeResultCode(action, instance) {
  //   let data: any;
  //   let sortedValue = [];
  //   // console.log("DATA!!!!!!");
  //   if (!action.operation && action.operation === undefined) {
  //     if (action.config.data && action.config.data.startsWith("#")) {
  //       data = this.contextService.getDataByString(action.config.data);
  //     }
  //     if (data && data instanceof Object && data.items.length > 0) {
  //       data.items.forEach(element => {
  //         if (element.ctype == "taskPanel") {
  //           element.items.forEach(item => {
  //             if (item.ctype == "actionToggle") {
  //               let obj;
  //               let type;
  //               type = element.header.title.split(" ")[0];
  //               obj = {
  //                 title: element.header.title,
  //                 actionToggelUUID: item.uuid,
  //                 type: type,
  //                 selection: "",
  //               };
  //               sortedValue.push(obj);
  //             }
  //           })
  //         }
  //       });
  //     }
  //     this.contextService.addToContext("ecoSortedData", sortedValue);
  //   } else if (action.operation && action.operation === "pushAction") {
  //     let data = this.contextService.getDataByString("#ecoSortedData");
  //     let resultCode = "";
  //     let rework = 0;
  //     let bga = 0;
  //     let tAndC = 0;
  //     let test = 0;
  //     let debug = 0;
  //     let config = 0;
  //     let rClist;
  //     let temp;

  //     if (data instanceof Array && data.length > 0) {
  //       data.forEach(element => {
  //         if (instance.uuid === element.actionToggelUUID) {
  //           element.selection = action.selectedValue;
  //         }
  //       })
  //     }

  //     data.forEach(element => {
  //       if (element.type === "Rework" && element.selection === "OPEN") {
  //         rework = rework + 1
  //       } else if (element.type === "BGA" && element.selection === "OPEN") {
  //         bga = bga + 1
  //       } else if (element.type === "T&C" && element.selection === "OPEN") {
  //         tAndC = tAndC + 1
  //       } else if (element.type === "Test" && element.selection === "OPEN") {
  //         test = test + 1
  //       } else if (element.type === "DEBUG" && element.selection === "OPEN") {
  //         debug = debug + 1
  //       } else if (element.type === "Config" && element.selection === "OPEN") {
  //         config = config + 1
  //       }
  //     });

  //     rClist = this.contextService.getDataByString("#ResultCodes");
  //     let minValue = rClist[0];
  //     rClist.forEach(element => {
  //       if (element.priority < minValue.priority) {
  //         minValue = element;
  //       }
  //     });

  //     if (rework > 0 && bga === 0) {
  //       temp = rClist.filter(el => el.resultCode.includes("REW"));
  //       if (temp.length > 0) {
  //         resultCode = temp[0].resultCode;
  //       }
  //     } else if (rework === 0 && bga > 0) {
  //       temp = rClist.filter(el => el.resultCode.includes("BGA"));
  //       if (temp.length > 0) {
  //         resultCode = temp[0].resultCode;
  //       } else {
  //         temp = rClist.filter(el => el.resultCode.includes("REW"));
  //         if (temp.length > 0) {
  //           resultCode = temp[0].resultCode;
  //         }
  //       }
  //     } else if (rework > 0 && bga > 0) {
  //       temp = rClist.filter(el => el.resultCode.includes("BGA"));
  //       if (temp.length > 0) {
  //         resultCode = temp[0].resultCode;
  //       } else {
  //         temp = rClist.filter(el => el.resultCode.includes("REW"));
  //         if (temp.length > 0) {
  //           resultCode = temp[0].resultCode;
  //         }
  //       }
  //     } else if (rework === 0 && bga === 0 && tAndC > 0) {
  //       temp = rClist.filter(el => el.priority == minValue.priority);
  //       resultCode = temp[0].resultCode;

  //     } else if (rework === 0 && bga === 0 && test > 0) {
  //       temp = rClist.filter(el => el.priority == minValue.priority);
  //       resultCode = temp[0].resultCode;

  //     } else if (rework === 0 && bga === 0 && debug > 0) {
  //       temp = rClist.filter(el => el.priority == minValue.priority);
  //       resultCode = temp[0].resultCode;

  //     } else if (rework === 0 && bga === 0 && config > 0) {
  //       temp = rClist.filter(el => el.priority == minValue.priority);
  //       resultCode = temp[0].resultCode;
  //     }

  //     let enableComponent = [
  //       {
  //         "type": "enableComponent",
  //         "config": {
  //           "key": "ResultCodes",
  //           "property": "ResultCodes"
  //         }
  //       },
  //       {
  //         "type": "updateComponent",
  //         "config": {
  //           "key": "ResultCodes",
  //           "fieldProperties": {
  //             "ResultCodes": resultCode
  //           }
  //         }
  //       },
  //       {
  //         "type": "context",
  //         "config": {
  //           "requestMethod": "add",
  //           "key": "SelectedResultcode",
  //           "data": resultCode
  //         }
  //       }
  //     ]

  //     let disabledComponent = [
  //       {
  //         "type": "context",
  //         "config": {
  //           "requestMethod": "add",
  //           "key": "SelectedResultcode",
  //           "data": ""
  //         }
  //       }
  //     ]

  //     if (resultCode && resultCode !== "") {
  //       enableComponent.forEach((ele) => {
  //         this.handleAction(ele, instance);
  //       });
  //     } else {
  //       disabledComponent.forEach((ele) => {
  //         this.handleAction(ele, instance);
  //       });
  //       let resCode = this.contextService.getDataByKey('ResultCodesref');
  //       resCode.instance.group.reset()
  //     }
  //   }
  // }

  // resetQuoteDebugScreen(action: any, instance: any) {
  //   let resetActions = [
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "occurenceList",
  //         "data": []
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "defectCodeList",
  //         "data": []
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "assemblyCodeList",
  //         "data": []
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "missingAccessoriesList",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "numOfValidatedFieldsInCA",
  //         "data": 0
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "requisitionListStatus",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "faultCheckboxSerial",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "isFirstReplaceTaskCreated",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "repairProcessType",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "requisitionListLength",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "lineList",
  //         "data": []
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "kardexLineList",
  //         "data": []
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "mb_pnFieldValue",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "requisitionList",
  //         "data": []
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "debugFlexFieldData",
  //         "data": []
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "deleteComponent",
  //       "eventSource": "click",
  //       "config": {
  //         "key": "#currentTaskUUID"
  //       }
  //     },
  //     {
  //       "type": "context",
  //       "eventSource": "click",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "currentTaskUUID",
  //         "data": ""
  //       }
  //     },
  //     {
  //       "type": "condition",
  //       "config": {
  //         "operation": "isValid",
  //         "lhs": action.config.loadDashboard
  //       },
  //       "eventSource": "click",
  //       "responseDependents": {
  //         "onSuccess": {
  //           "actions": [
  //             {
  //               "type": "renderTemplate",
  //               "config": {
  //                 "templateId": "dashboard.json",
  //                 "mode": "local"
  //               },
  //               "eventSource": "click"
  //             }
  //           ]
  //         },
  //         "onFailure": {
  //           "actions": []
  //         }
  //       }
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedAssemblyName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedReplaceAction",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedReplaceFaultIdentifiedBy",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedReplaceFaultIdentifiedByName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     }, {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedCommodity",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedCommodityName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedPartNumberName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "averagePartValueResp",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "stockQuantity",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedPartNumber",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedPartNumberId",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedDefectName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedExactPartNumberName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedDefect",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "firstTaskReplaceAction",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedCabMessage",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedCabMessageName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedReplaceActionName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "user",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "firstTaskReplaceAssembly",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     }, {
  //       "type": "condition",
  //       "config": {
  //         "operation": "isValid",
  //         "lhs": action.config.loadDashboard
  //       },
  //       "eventSource": "click",
  //       "responseDependents": {
  //         "onSuccess": {
  //           "actions": [{
  //             "type": "context",
  //             "config": {
  //               "requestMethod": "add",
  //               "key": "timeoutNotes",
  //               "data": ""
  //             },
  //             "eventSource": "click"
  //           }]
  //         },
  //         "onFailure": {
  //           "actions": []
  //         }
  //       }
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "holdDialogData",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "averagePartValueResp",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "stockQuantity",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedSoftwareActionName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedSoftwareFaultIdentifiedBy",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedSoftwareFaultIdentifiedByName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedSoftwareActionName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     }, {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedSoftwareDefect",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedSoftwareDefectName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedExactSoftwareDefectName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     }, {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedSoftwareAssembly",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedManualAction",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedManualActionName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     }, {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedManualFaultIdentifiedBy",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     }, {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedManualAssembly",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     }, {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedManualDefect",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedManualDefectName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedExactManualDefectName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     }, {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedManualCommodity",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedManualCommodityName",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     }, {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "userSelectedManualAssembly",
  //         "data": ""
  //       },
  //       "eventSource": "click"
  //     },
  //     {
  //       "type": "condition",
  //       "config": {
  //         "operation": "isValid",
  //         "lhs": action.config.loadDashboard
  //       },
  //       "eventSource": "click",
  //       "responseDependents": {
  //         "onSuccess": {
  //           "actions": [
  //             {
  //               "type": "microservice",
  //               "config": {
  //                 "microserviceId": "getSearchCriteria",
  //                 "isLocal": false,
  //                 "LocalService": "assets/Responses/getSearchCriteria.json",
  //                 "requestMethod": "get",
  //                 "params": {
  //                   "locationId": "#userSelectedLocation",
  //                   "clientId": "#userSelectedClient",
  //                   "contractId": "#userSelectedContract",
  //                   "searchType": "#userSelectedSubProcessType",
  //                   "userName": "#userAccountInfo.PersonalDetails.USERID"
  //                 }
  //               },
  //               "eventSource": "click",
  //               "responseDependents": {
  //                 "onSuccess": {
  //                   "actions": [
  //                     {
  //                       "type": "context",
  //                       "config": {
  //                         "requestMethod": "add",
  //                         "key": "getSearchCriteriaData",
  //                         "data": "responseData"
  //                       }
  //                     },
  //                     {
  //                       "type": "renderTemplate",
  //                       "config": {
  //                         "mode": "remote",
  //                         "targetId": "mainPageContentBody",
  //                         "templateId": "getSearchCriteriaData"
  //                       }
  //                     }
  //                   ]
  //                 },
  //                 "onFailure": {
  //                   "actions": [
  //                     {
  //                       "type": "updateComponent",
  //                       "config": {
  //                         "key": "errorTitleUUID",
  //                         "properties": {
  //                           "titleValue": "Search Criteria is not Configured",
  //                           "isShown": true
  //                         }
  //                       }
  //                     }
  //                   ]
  //                 }
  //               }
  //             }
  //           ]
  //         },
  //         "onFailure": {
  //           "actions": []
  //         }
  //       }
  //     }


  //   ];

  //   if (resetActions) {
  //     resetActions.forEach((ele) => {
  //       this.handleAction(ele, instance);
  //     });
  //   }
  // }

  // identifierForDebugRecentRecord(action: any, instance: any) {
  //   let hpfaHistoryResponse = [];
  //   let matchingRecords = [];
  //   let additionalData = action.config.additionalData;

  //   if (action.config.data !== undefined) {
  //     hpfaHistoryResponse = this.contextService.getDataByKey(action.config.data);
  //   }

  //   if (hpfaHistoryResponse.length > 0) {
  //     if (additionalData.softwareActionCodes !== undefined && additionalData.softwareActionCodes.length > 0) {
  //       hpfaHistoryResponse.forEach((currentItem) => {
  //         additionalData.softwareActionCodes.forEach((currentActionCode) => {
  //           if (currentItem.ACTION_CODE_NAME == currentActionCode) {
  //             matchingRecords.push(currentItem);
  //           }
  //         });
  //       });


  //     }

  //     if (additionalData.manualActionCodes !== undefined && additionalData.manualActionCodes.length > 0) {
  //       hpfaHistoryResponse.forEach((currentItem) => {
  //         additionalData.manualActionCodes.forEach((currentActionCode) => {
  //           if (currentItem.ACTION_CODE_NAME == currentActionCode) {
  //             matchingRecords.push(currentItem);
  //           }
  //         });
  //       });
  //     }

  //     if (additionalData.replaceActionCodes !== undefined && additionalData.replaceActionCodes.length > 0) {
  //       hpfaHistoryResponse.forEach((currentItem) => {
  //         additionalData.replaceActionCodes.forEach((currentActionCode) => {
  //           if (currentItem.ACTION_CODE_NAME == currentActionCode) {
  //             matchingRecords.push(currentItem);
  //           }
  //         });
  //       });

  //       let replaceActionCodes = this.contextService.getDataByKey('#getActionCodeReplaceResp');
  //       replaceActionCodes = replaceActionCodes.data.filter((actionCode) => {
  //         return actionCode.id == matchingRecords[0].ACTION_CODE_NAME;
  //       });

  //       if (matchingRecords.length > 0) {
  //         this.contextService.addToContext('userSelectedReplaceActionName', replaceActionCodes[0].actionCode);
  //       }
  //     }
  //   }
  // }

  // addValuesToRadioGroup(action, instance) {
  //   let key = action.config.key;
  //   let radioButtonOption = [];
  //   let dataSource;
  //   if (action.config.properties.dataSource !== undefined && action.config.properties.dataSource.startsWith('#')) {
  //     dataSource = this.contextService.getDataByString(action.config.properties.dataSource);
  //   }
  //   else {
  //     dataSource = action.config.properties.dataSource;
  //   }
  //   if (dataSource && dataSource.length > 0) {

  //     dataSource.forEach(optionVal => {
  //       // console.log(optionVal.value);
  //       radioButtonOption.push(optionVal.value);
  //       // console.log(radioButtonOption);
  //     })

  //   }
  //   if (key !== undefined && key.startsWith('#')) {
  //     key = this.contextService.getDataByString(key);
  //   }
  //   this.contextService.addToContext(key, radioButtonOption);
  // }

  handleWidowsPopupForViewImage(action, instance) {
    let url;
    let styles;
    let name;

    if (action.config.url && action.config.url.startsWith('#')) {
      url = this.contextService.getDataByString(action.config.url);
      styles = action.config.styles;
      name = action.config.name;
    } else {
      url = action.config.url;
      styles = action.config.styles;
      name = action.config.name;
    }

    // let params = `width=1000px,height=600px,left=300%,top=20%`;
    var win = window.open(url, name, styles);
    win.focus();
  }

  //@for type: condtion
  //single or multiple conditions
  // handleMultipleConditionalFilter(action, instance) {
  //   if (action && action.config) {
  //     let condition;

  //     if (action.config.multi === true) {
  //       let bools = [];

  //       const triggerConditionFn = (conds, operator, index) => {
  //         conds && conds.forEach((rec, ind) => {
  //           let cond, boolIndex = ((index === 0) || index) ? index : ind;
  //           bools[boolIndex] = (bools[boolIndex] || []);

  //           const applyCondition = (bool) => {
  //             let subCond;

  //             if ((rec.operator === "OR") && (rec.subconditions)) {
  //               subCond = triggerConditionFn(rec.subconditions, rec.operator, ind);
  //             } else if ((rec.operator === "AND") && (rec.subconditions)) {
  //               subCond = triggerConditionFn(rec.subconditions, rec.operator, ind);
  //             } else if (bools[boolIndex] !== bool) {
  //               subCond = this.isConditionValid(rec, instance);
  //             } else {
  //               //do nothing
  //             }

  //             return subCond;
  //           };

  //           if (operator === "OR") {
  //             cond = applyCondition(true);
  //           } else {
  //             cond = applyCondition(false);
  //           }

  //           if (cond !== undefined) {
  //             bools[boolIndex].push(cond);
  //           }
  //         });
  //       };

  //       triggerConditionFn(action.config.conditions, action.config.operator, undefined);

  //       const isBoolCond = (operator, rec) => {
  //         let subCond;

  //         if (operator === "OR") {
  //           rec.forEach((v) => {
  //             if (v) { subCond = "true"; }
  //           });
  //         } else {
  //           rec.forEach((v) => {
  //             if (v === false) { subCond = "false"; }
  //           });

  //           if (subCond !== "false") {
  //             subCond = "true";
  //           }
  //         }

  //         return subCond;
  //       };

  //       bools && bools.forEach((r, i) => {
  //         if (action.config.conditions && action.config.conditions[i]) {
  //           bools[i] = (isBoolCond(action.config.conditions[i].operator, r) === "true") ? true : false;
  //         }
  //       });

  //       condition = (isBoolCond(action.config.operator, bools) === "true" ? true : false);
  //     } else {
  //       condition = this.isConditionValid(action.config, instance);
  //     }

  //     if (condition) {
  //       action.responseDependents.onSuccess.actions.forEach((ele) => {
  //         this.handleAction(ele, instance);
  //       });
  //     } else if (action.responseDependents.onFailure != undefined) {
  //       action.responseDependents.onFailure.actions.forEach((ele) => {
  //         this.handleAction(ele, instance);
  //       });
  //     } else {
  //       //do nothing
  //     }
  //   }
  // }

  //@for type: condition -> if isValid or not
  //checks if condition is true or false based on operation provided
  //for both single or multiple conditions
  isConditionValid(config, instance) {
    let lhs = config.lhs, rhs = config.rhs, condition;

    if (config.incriment === 1) {
      lhs = instance.parentuuid + 1;
    }

    if ((lhs !== undefined) && (this.utilityService.isString(lhs) && lhs.startsWith('#'))) {
      lhs = this.contextService.getDataByString(lhs);

      if (lhs instanceof Array && config.lhsKeyName !== undefined) {
        lhs = this.utilityService.getElementBykeyName(
          lhs, config.lhsKeyName,
          config.lhsKeyValue, config.lhsSecondKeyName
        );

        this.contextService.addToContext('lhsValue', lhs);
      }
    }

    if ((rhs !== undefined) && (this.utilityService.isString(rhs) && rhs.startsWith('#'))) {
      rhs = this.contextService.getDataByString(rhs);
    }

    if (config.operation == 'isEqualTo') {
      condition = (lhs == rhs);
    } else if (config.operation == 'isNotEqualTo') {
      condition = (lhs !== rhs);
    }
    else if (config.operation === 'isEqualcompareArr') {
      rhs && rhs.forEach(ele => {
        if (lhs === ele.resultCode) {
          condition = true;
        }
      });
    } else if (config.operation == 'isEqualToIgnoreCase') {
      condition = ((lhs && lhs.toLowerCase()) == (rhs && rhs.toLowerCase()));
    } else if (config.operation === 'isEqualCompareArrToIgnoreCase') {
      rhs && rhs.forEach((r) => {
        if ((lhs && lhs.toLowerCase()) === (r && r.toLowerCase())) {
          condition = true;
        }
      });
    } else if (config.operation == 'isValid') {
      condition = lhs;
    } else if (config.operation == 'isNotValid') {
      condition = !lhs;
    } else if (config.operation == 'compareLastChars') {
      condition = (rhs.endsWith('R') || rhs.endsWith('AV'));
    } else if (config.operation == 'isLessThan') {
      condition = (parseInt(lhs) < parseInt(rhs));
    } else if (config.operation == 'isLessThanEqualTo') {
      condition = (parseInt(lhs) <= parseInt(rhs));
    } else if (config.operation == 'isNotUndefined') {
      condition = (lhs <= rhs);
    } else if (config.operation == 'indexOf') {
      // 1.array we want to check, lhs must be array.
      // 2.value need to check, rhs must be value we need to find in array;
      if (lhs instanceof Array) {
        condition = (lhs.indexOf(rhs) > -1);
      }
    } else if (config.operation === 'isGreaterThan') {
      condition = (parseInt(lhs) > parseInt(rhs));
    } else if (lhs !== undefined && rhs !== undefined && config.operation === 'isContains') {
      condition = ((this.utilityService.isString(lhs) && lhs.toLowerCase().includes(rhs)) || (lhs.includes(rhs)));
    }else if (lhs !== undefined && rhs !== undefined && config.operation === 'isMatched') {
      condition = (rhs.some(substring=>lhs.includes(substring)));
    } else if (config.operation === 'isNotEmptyArray') {
      condition = (lhs !== undefined && lhs && Array.isArray(lhs) && lhs.length);
    } else if (config.operation === 'isValidList') {
      let validateList = config.validList;
      condition = true;

      if (validateList != undefined && validateList != null && validateList.length > 0) {
        let validFailCount = 0;

        for (let index = 0; index < validateList.length; index++) {
          let currentvalue = validateList[index];

          if (this.utilityService.isString(currentvalue) && currentvalue.startsWith('#')) {
            currentvalue = this.contextService.getDataByString(currentvalue);
          }

          if (currentvalue == null || currentvalue == undefined) {
            validFailCount = validFailCount + 1;
          }
        }

        if (validFailCount == validateList.length) {
          condition = false;
        }
      }
    } else if (config.operation == 'instanceGroupValidity') {
      condition = instance.group.valid;
    } else {
      //do nothing
    }

    return (condition || false);
  }

  // addOccurenceToContext(action: any, instance: any) {
  //   let taskUuid;
  //   let currentDefectCode = action.config.currentDefectCode;
  //   let currentAssemblyCode = action.config.currentAssemblyCode;
  //   let replaceDefectCodesList = this.contextService.getDataByString("#defectCodeList");
  //   let replaceAssemblyCodesList = this.contextService.getDataByString("#assemblyCodeList");


  //   if (action.config.taskUuid !== undefined) {
  //     taskUuid = action.config.taskUuid;
  //     if (taskUuid.startsWith('#')) {
  //       taskUuid = this.contextService.getDataByString(taskUuid);
  //     } else {
  //       taskUuid = action.config.taskUuid;
  //     }
  //   } else {
  //     if (instance.parentuuid !== undefined) {
  //       if (instance.parentuuid != null && instance.parentuuid.startsWith('#')) {
  //         taskUuid = this.contextService.getDataByString(
  //           instance.parentuuid
  //         );
  //       } else {
  //         taskUuid = instance.parentuuid;
  //       }
  //     }
  //   }

  //   if (currentDefectCode !== undefined && currentDefectCode.startsWith('#')) {
  //     currentDefectCode = this.contextService.getDataByString(currentDefectCode);
  //   }
  //   if (currentAssemblyCode !== undefined && currentAssemblyCode.startsWith('#')) {
  //     currentAssemblyCode = this.contextService.getDataByString(currentAssemblyCode);
  //   }
  //   let occurenceList = {
  //     "type": "context",
  //     "config": {
  //       "requestMethod": "addToExistingContext",
  //       "target": "occurenceList",
  //       "sourceData": {
  //         "taskUuid": taskUuid,
  //         "defectCodeOccurence": replaceDefectCodesList.filter((element) => {
  //           return element.defectCode === currentDefectCode;
  //         }).length,
  //         "assemblycodeOccurence": replaceAssemblyCodesList.filter((element) => {
  //           return element.assemblyCode === currentAssemblyCode;
  //         }).length,
  //         "currentDefectCode": currentDefectCode,
  //         "currentAssemblyCode": currentAssemblyCode
  //       }
  //     },
  //     "eventSource": "click"
  //   }

  //   this.handleAction(occurenceList, instance);

  //   // let currentItemOccurence = {
  //   //   "type": "getFilteredFromContext",
  //   //   "config": {
  //   //     "target": "#occurenceList",
  //   //     "key": "currentOccurenceData",
  //   //     "properties": {
  //   //       "key": taskUuid
  //   //     }
  //   //   },
  //   //   "eventSource": "click"
  //   // };

  //   // this.handleAction(currentItemOccurence, instance);

  //   // let currentOccurenceData = this.contextService.getDataByString("#currentOccurenceData");

  //   // console.log(this.contextService);
  // }


  // getFilteredFromContext(action: any, instance: any) {
  //   let targetData = action.config.target;
  //   let key = action.config.properties.key;
  //   let dataToBeSavedIn = [];
  //   if (targetData !== undefined && targetData.startsWith('#')) {
  //     targetData = this.contextService.getDataByString(targetData);
  //   }
  //   if (key !== undefined && key.startsWith('#')) {
  //     key = this.contextService.getDataByString(key);
  //   } else {
  //     if (key === "parentUUID" && instance.parentuuid !== undefined) {
  //       if (instance.parentuuid != null && instance.parentuuid.startsWith('#')) {
  //         key = this.contextService.getDataByString(
  //           instance.parentuuid
  //         );
  //       } else {
  //         key = instance.parentuuid;
  //       }
  //     }
  //   }
  //   dataToBeSavedIn = targetData.filter((element) => {
  //     return element.taskUuid === key;
  //   });
  //   if (dataToBeSavedIn != undefined && dataToBeSavedIn.length > 0) {
  //     this.contextService.addToContext(action.config.key, dataToBeSavedIn[0]);
  //   }
  // }


  // deleteAndUpdateOccurence(action: any, instance: any) {
  //   let targetData = action.config.target;
  //   let key = action.config.key;
  //   let currentTaskData = action.config.currentTaskData;
  //   let replaceDefectCodesList = this.contextService.getDataByString("#defectCodeList");
  //   let replaceAssemblyCodesList = this.contextService.getDataByString("#assemblyCodeList");
  //   if (targetData !== undefined && targetData.startsWith('#')) {
  //     targetData = this.contextService.getDataByString(targetData);
  //   }
  //   if (key !== undefined && key.startsWith('#')) {
  //     key = this.contextService.getDataByString(key);
  //   }
  //   if (currentTaskData !== undefined && currentTaskData.startsWith('#')) {
  //     currentTaskData = this.contextService.getDataByString(currentTaskData);
  //   }
  //   // console.log("occureneclist before delete", targetData)
  //   if (currentTaskData != undefined && currentTaskData !== null && currentTaskData.taskUuid === key) {
  //     let index = targetData.indexOf(currentTaskData);
  //     targetData.splice(index, 1);
  //     replaceDefectCodesList.splice(index, 1);
  //     replaceAssemblyCodesList.splice(index, 1);
  //   }

  //   let clearArrays = [{
  //     "type": "context",
  //     "config": {
  //       "requestMethod": "add",
  //       "key": "occurenceList",
  //       "data": []
  //     },
  //     "eventSource": "click"
  //   }];

  //   clearArrays.forEach((element) => {
  //     this.handleAction(element, instance);
  //   });
  //   replaceDefectCodesList = [];
  //   replaceAssemblyCodesList = [];
  //   targetData.forEach((currentTargetItem) => {
  //     replaceDefectCodesList.push({
  //       "defectCode": currentTargetItem.currentDefectCode
  //     });
  //     replaceAssemblyCodesList.push({
  //       "assemblyCode": currentTargetItem.currentAssemblyCode
  //     });
  //     let addDefAndAssToList = [{
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "defectCodeList",
  //         "data": replaceDefectCodesList
  //       },
  //       "eventSource": "click"
  //     }, {
  //       "type": "context",
  //       "config": {
  //         "requestMethod": "add",
  //         "key": "assemblyCodeList",
  //         "data": replaceAssemblyCodesList
  //       },
  //       "eventSource": "click"
  //     }, {
  //       "type": "addOccurenceToContext",
  //       "config": {
  //         "target": "occurenceList",
  //         "taskUuid": currentTargetItem.taskUuid,
  //         "currentDefectCode": currentTargetItem.currentDefectCode,
  //         "currentAssemblyCode": currentTargetItem.currentAssemblyCode
  //       },
  //       "eventSource": "click"
  //     }];

  //     addDefAndAssToList.forEach((item) => {
  //       this.handleAction(item, instance);
  //     });

  //   });

  //   let occurenceData = this.contextService.getDataByString("#occurenceList");
  //   // console.log("occureneclist after delete", occurenceData)
  // }

  // clearAllContext(action: any) {
  //   if (action && action.config) {
  //     const config = action.config;
  //     const clearContextFn = (data) => {
  //       data.forEach((r) => {
  //         if (r) {
  //           if (config.clearType === "delete") {
  //             this.contextService.deleteDataByKey(r);
  //           } else {
  //             this.contextService.addToContext(r, "");
  //           }
  //         }
  //       });
  //     };

  //     if (config && config.dynamicContexts && (config.dynamicContexts.length > 0)) {
  //       const dynContxs = [];
  //       let length: any = this.getContextorNormalData(config.clearDataLength, 0);

  //       config.dynamicContexts.forEach((r) => {
  //         for (let i = 0; i < length; i++) {
  //           if (r) {
  //             dynContxs.push(r.replace(/#@/g, i));
  //           }
  //         }
  //       });

  //       if (dynContxs.length > 0) {
  //         clearContextFn(dynContxs);
  //       }
  //     }

  //     if (config && config.contexts && (config.contexts.length > 0)) {
  //       clearContextFn(config.contexts);
  //     }
  //   }
  // }

  // getArrayRecordByIndex(action: any) {
  //   if (action && action.config) {
  //     const config = action.config;
  //     let data: any = this.getContextorNormalData(config.data, []);

  //     this.contextService.addToContext(config.contextKey, data[config.index]);
  //   }
  // }

  // setInitialDefault(action: any, instance: any) {
  //   let refData;
  //   let key;
  //   const properties = {};

  //   //Added this condition as from Java side ECO json preparation we have added this as Caps (K)
  //   if (action.config.key == undefined || action.config.key == null) {
  //     key = action.config.Key;
  //   } else {
  //     key = action.config.key;
  //   }

  //   if (key !== undefined && key.startsWith('#')) {
  //     key = this.contextService.getDataByString(key);
  //   }

  //   if (action.config.incriment !== undefined) {
  //     key = instance.parentuuid + key;
  //   }

  //   if (key !== undefined) {
  //     refData = this.contextService.getDataByKey(key + 'ref');
  //   } else {
  //     refData = this.contextService.getDataByKey(instance.uuid + 'ref');
  //   }

  //   if (action.config.dropDownProperties !== undefined) {
  //     let dropDownProperties = action.config.dropDownProperties;
  //     let inputDropdownDisplayValue;
  //     let inputDropdownCode;
  //     dropDownProperties = this.contextService.getParsedObject(
  //       dropDownProperties
  //     );
  //     if (dropDownProperties !== undefined) {
  //       Object.keys(dropDownProperties).forEach((key) => {
  //         const dropDownInstance = refData.instance;

  //         /// if we are getting displayValue and code from config, use that
  //         if (action.config.displayValue !== undefined) {
  //           inputDropdownDisplayValue = action.config.displayValue;
  //           inputDropdownCode = action.config.code;
  //         } else {
  //           inputDropdownDisplayValue = dropDownInstance.displayValue;
  //           inputDropdownCode = dropDownInstance.code;
  //         }
  //         let fieldValue = dropDownProperties[key];
  //         if (dropDownProperties[key] !== undefined) {
  //           if (dropDownInstance !== undefined && dropDownInstance) {
  //             if (
  //               inputDropdownCode &&
  //               inputDropdownCode !== undefined
  //             ) {
  //               if (fieldValue !== undefined && fieldValue !== "") {
  //                 fieldValue = fieldValue.map((s) => ({
  //                   code: s[inputDropdownCode],
  //                   displayValue: s[inputDropdownDisplayValue],
  //                 }));
  //               }
  //             }
  //             else {
  //               if (fieldValue !== undefined && fieldValue !== "") {
  //                 fieldValue = fieldValue.map((s) => ({
  //                   code: s,
  //                   displayValue: s,
  //                 }));
  //               }
  //             }

  //             if (!dropDownInstance.isDropdownNotSelected) {
  //               if (fieldValue !== undefined && fieldValue !== "") {
  //                 fieldValue.sort((a, b) =>
  //                   a.displayValue.localeCompare(b.displayValue)
  //                 );
  //               }
  //             }
  //             refData.instance.options = fieldValue;
  //             if (action.config.setInitialDefault !== undefined && action.config.setInitialDefault) {
  //               if (refData.instance.options !== undefined && refData.instance.options.length === 1) {
  //                 refData.instance.group.controls[refData.instance.name].setValue(
  //                   refData.instance.options[0]
  //                 );
  //                 if (action.config.actions !== undefined && action.config.actions.length > 0) {
  //                   if (action.config.elementControlValue != undefined) {
  //                     this.handleAction({
  //                       "type": "context",
  //                       "config": {
  //                         "requestMethod": "add",
  //                         "key": action.config.elementControlValue,
  //                         "data": fieldValue[0].code
  //                       },
  //                       "eventSource": "change"
  //                     }, instance);
  //                   }
  //                   if (action.config.elementControlName != undefined) {
  //                     this.handleAction({
  //                       "type": "context",
  //                       "config": {
  //                         "requestMethod": "add",
  //                         "key": action.config.elementControlName,
  //                         "data": fieldValue[0].displayValue
  //                       },
  //                       "eventSource": "change"
  //                     }, instance);
  //                   }
  //                   action.config.actions.forEach((currentAction) => {
  //                     this.handleAction(currentAction, instance);
  //                   });
  //                 }
  //               } else {
  //                 refData.instance.group.controls[refData.instance.name].setValue(
  //                   null
  //                 );
  //               }
  //             } else {
  //               refData.instance.group.controls[refData.instance.name].setValue(
  //                 null
  //               );
  //             }
  //           }
  //         }
  //       });
  //     }
  //   }

  //   if (refData && refData.instance._changeDetectionRef !== undefined) {
  //     try {
  //       if (action.isFromHook == undefined || action.isFromHook == null) {
  //         refData.instance._changeDetectionRef.detectChanges();
  //       }
  //     } catch (e) {
  //       // console.log("Component Change Detection Failed:" + refData.instance.uuid + " Because of Hidden Property Configurations");
  //     }
  //   }
  // }

  // replaceCommodityActions(action, instance) {
  //   let commodityActions = [
  //     {
  //       "type": "updateComponent",
  //       "eventSource": "change",
  //       "config": {
  //         "key": "errorTitleUUID",
  //         "properties": {
  //           "titleValue": "",
  //           "isShown": false
  //         }
  //       }
  //     },
  //     {
  //       "type": "updateComponent",
  //       "eventSource": "change",
  //       "config": {
  //         "key": "stockQuantityUUID",
  //         "updateParent": true,
  //         "properties": {
  //           "hidden": true,
  //           "text": ""
  //         }
  //       }
  //     },
  //     {
  //       "type": "microservice",
  //       "eventSource": "change",
  //       "config": {
  //         "microserviceId": "getPartByBOMId",
  //         "requestMethod": "get",
  //         "params": {
  //           "bomId": "#userSelectedCommodity",
  //           "userName": "#userAccountInfo.PersonalDetails.USERID"
  //         }
  //       },
  //       "responseDependents": {
  //         "onSuccess": {
  //           "actions": [
  //             {
  //               "type": "context",
  //               "config": {
  //                 "requestMethod": "add",
  //                 "key": "getPartByBOMIdResp",
  //                 "data": "responseData"
  //               }
  //             },
  //             {
  //               "type": "updateComponent",
  //               "config": {
  //                 "key": "replacePartUUID",
  //                 "dropDownProperties": {
  //                   "options": "#getPartByBOMIdResp"
  //                 }
  //               }
  //             }
  //           ]
  //         },
  //         "onFailure": {
  //           "actions": [
  //             {
  //               "type": "context",
  //               "config": {
  //                 "requestMethod": "add",
  //                 "key": "errorResp",
  //                 "data": "responseData"
  //               }
  //             },
  //             {
  //               "type": "updateComponent",
  //               "config": {
  //                 "key": "errorTitleUUID",
  //                 "properties": {
  //                   "titleValue": "#errorResp",
  //                   "isShown": true
  //                 }
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     },
  //     {
  //       "type": "microservice",
  //       "eventSource": "change",
  //       "config": {
  //         "microserviceId": "getDefectByActionAndCommodity",
  //         "requestMethod": "get",
  //         "params": {
  //           "locationId": "#repairUnitInfo.LOCATION_ID",
  //           "clientId": "#repairUnitInfo.CLIENT_ID",
  //           "contractId": "#repairUnitInfo.CONTRACT_ID",
  //           "route": "#repairUnitInfo.ROUTE",
  //           "workcenterId": "#repairUnitInfo.WORKCENTER_ID",
  //           "actionCode": "#userSelectedReplaceAction",
  //           "commodityName": "#userSelectedCommodityName",
  //           "userName": "#userAccountInfo.PersonalDetails.USERID"
  //         }
  //       },
  //       "responseDependents": {
  //         "onSuccess": {
  //           "actions": [
  //             {
  //               "type": "context",
  //               "config": {
  //                 "requestMethod": "add",
  //                 "key": "getDefectByActionAndCommodityResp",
  //                 "data": "responseData"
  //               }
  //             },
  //             {
  //               "type": "updateComponent",
  //               "config": {
  //                 "key": "replaceDefectUUID",
  //                 "dropDownProperties": {
  //                   "options": "#getDefectByActionAndCommodityResp"
  //                 }
  //               }
  //             }
  //           ]
  //         },
  //         "onFailure": {
  //           "actions": [
  //             {
  //               "type": "context",
  //               "config": {
  //                 "requestMethod": "add",
  //                 "key": "errorResp",
  //                 "data": "responseData"
  //               }
  //             },
  //             {
  //               "type": "updateComponent",
  //               "config": {
  //                 "key": "errorTitleUUID",
  //                 "properties": {
  //                   "titleValue": "#errorResp",
  //                   "isShown": true
  //                 }
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   ];

  //   commodityActions.forEach((element) => {
  //     this.handleAction(element, instance);
  //   })
  // }

  // concatContexts(action) {
  //   if (action && action.config) {
  //     const config = action.config;
  //     let concatText = [];

  //     config.contexts && config.contexts.forEach((r) => {
  //       if (this.utilityService.isString(r) && (r.startsWith('#'))) {
  //         concatText.push(this.contextService.getDataByString(r));
  //       } else {
  //         concatText.push(r);
  //       }
  //     });

  //     this.contextService.addToContext(config.contextKey, concatText.join(" "));
  //   }
  // }

  getContextorNormalData(data, emptyValue: any = "") {
    if (this.utilityService.isString(data) && (data.startsWith('#'))) {
      return this.contextService.getDataByString(data);
    } else {
      return (data || emptyValue);
    }
  }


  // performOperation(action) {
  //   if (action && action.config) {
  //     const config = action.config;

  //     if (config.type === "slice") {
  //       this.contextService.addToContext(config.contextKey, this.getContextorNormalData(config.lhs, "").slice(1, 5));
  //     }
  //   }
  // }

  // uniquePartNostxtType(action) {
  //   if (action && action.config) {
  //     const config = action.config;
  //     let data: any = this.utilityService.getContextorNormalData(config.data, []);

  //     if (data && data.length > 0) {
  //       const obj = {};
  //       let isRemoved = false, contextData = [], isAllRemoved = true, isIssuedExpanded = false;

  //       data.forEach((r) => {
  //         if (!obj[r.actionId]) {
  //           let filterData = data.filter(val => ((val.transactionType === "Removed") && (val.actionId === r.actionId)));

  //           if (filterData && filterData.length > 0) {
  //             isRemoved = true;
  //             obj[r.actionId] = filterData[0];
  //           } else {
  //             obj[r.actionId] = r;
  //           }
  //         } else {
  //           //do nothing
  //         }
  //       });

  //       Object.keys(obj).forEach((key) => {
  //         if (obj[key].transactionType === "Issued") {
  //           isAllRemoved = false;
  //         }

  //         contextData.push(obj[key]);
  //       });

  //       if (isAllRemoved && config.removeKey) {
  //         this.contextService.addToContext(config.removeKey, true);
  //       }

  //       contextData = contextData.map((r) => {
  //         let dataObj = { ...r };

  //         if (isRemoved && (r.transactionType === "Issued") && !isIssuedExpanded) {
  //           dataObj.isIssuedExpanded = true;
  //           isIssuedExpanded = true;
  //         }

  //         return dataObj;
  //       });

  //       if (!isRemoved) {
  //         this.contextService.addToContext("noRemoveOperation", true);
  //       }

  //       this.contextService.addToContext(config.key, contextData);
  //     }
  //   }
  // }

  // validateLength(action, instance) {
  //   if (action && action.config) {
  //     if (action.config.type === "min") {
  //       if (action.config && action.config.value && action.config.length) {
  //         if (instance.group.controls[instance.name].value.length <= action.config.length) {
  //           if (instance.group.controls[instance.name].invalid == false) {
  //             instance.group.controls[instance.name].setErrors(null);
  //           }
  //         }
  //         else {
  //           instance.group.controls[instance.name].setErrors({ 'incorrect': true });
  //           if (action.config.buttonUUID && action.config.buttonUUID != undefined) {
  //             let refData = this.contextService.getDataByKey(action.config.buttonUUID + 'ref');
  //             if (refData) {
  //               refData.instance.disabled = true;
  //               refData.instance._changeDetectionRef.detectChanges();
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  // updateDynamicAllPanels(action, instance) {
  //   if (action && action.config) {
  //     const actionConfig = action.config;
  //     const data = this.getContextorNormalData(actionConfig.data, []);

  //     //@loop through each item to create the given component
  //     data.length && data.forEach((rec, i) => {
  //       let config: any = actionConfig.actions;

  //       //@obj -> string convertion
  //       config = JSON.stringify(config);

  //       for (let k = 0; k <= data.length; k++) {
  //         let regex = `#@${k}`;

  //         config = config.replace(new RegExp(regex, "g"), (i + k));
  //       }

  //       //@index automation
  //       config = config.replace(/#@/g, i);

  //       rec && Object.keys(rec).forEach((key) => {
  //         const regex: any = `#_${key}`;

  //         config = config.replace(new RegExp(regex, "g"), (rec[key] || ""));
  //       });

  //       config = JSON.parse(config);

  //       this.handleAction(config, instance);
  //     });
  //   }
  // }

  focusFirstControl(action, instance, actionService) {
    let txtfield = this.contextService.getDataByKey(action.data + "ref")
    // console.log(txtfield);
    if (txtfield.instance.textFieldRef) {
      txtfield.instance.textFieldRef.nativeElement.focus();
      txtfield.instance.textFieldRef.nativeElement.autofocus = true;
    }
  }

}