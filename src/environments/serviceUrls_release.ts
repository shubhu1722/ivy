import { environment } from './environment';

export const serviceUrls = {
  /// Login
  // validateLogin: environment.api_url + 'security/validateLogin',

  //encrypted login
  validateLogin: environment.api_url + 'security/validateLoginEncrypt',
  getWorkInstructions: environment.api_url + 'glbworkinstructions/getworkinstruction',
  getWorkInstDellEducateURLLink: environment.api_url + 'glb-common/getDellEducateUrl',

  /// Home Menu
  getHomeMenu: environment.api_url + 'security/getHomeMenu',
  getSubProcessMenu: environment.api_url + 'security/getSubProcessMenu',
  getSearchCriteria: environment.api_url + 'security/getSearchCriteria',

  /// Receipt
  getOrders: environment.api_url + 'receipt-wpr/getOrders',
  receiptV2: environment.api_url + 'receipt-wpr/receiptV2',
  receiptV2InternalTransfer: environment.api_url + 'receipt-wpr/internal-transfer',
  createROReceiptV2: environment.api_url + 'receipt-wpr/createROReceiptV2',
  validateSerialScan:
    environment.api_url + 'glb-hp-rcv-trigger/validateSerialScan',
  getDiscrepancyCode:
    environment.api_url + 'glb-hp-rcv-trigger/getDiscrepancyCode',
  getBlindReceiptCustomerPO:
    environment.api_url + 'glb-hp-rcv-trigger/getBlindReceiptCustomerPO',
  validateSerialScanQACode:
    environment.api_url + 'glb-hp-rcv-trigger/validateSerialScanQACode',
  getPartModelAndWarrentyDetails:
    environment.api_url + 'glb-hp-rcv-trigger/getPartModelAndWarrentyDetails',
  onePrint: environment.api_url + 'print-wpr/onePrint',
  isPartPresentReceiptTrigger:
    environment.api_url + 'glb-hp-rcv-trigger/isPartPresent',
  getProcess: environment.api_url + 'metadataprocessor/getProcess',
  validatePartNumberScanQACode:
    environment.api_url + 'glb-hp-rcv-trigger/validatePartNumberScanQACode',
  getSerialNumberDifferences:
    environment.api_url + 'glb-hp-rcv-trigger/getSerialNumberDifferences',
  getHPTMOCOMMDebug: environment.api_url + 'glb-hp-tmo/bydHPTMOCOMMDebug',
  getHPRLSCommonDebugTrigger: environment.api_url + 'glb-hold-release-trigger/getHPRLSCommonDebugTrigger',

  // cisco urls
  getConditionFlexFields: environment.api_url + 'cisco-iqa/getConditionFlexFields',
  getDefectCodesList: environment.api_url + 'cisco-config/getDefectCodesList',
  getPCBByMainPart: environment.api_url + 'cisco-config/getPCBByMainPart',
  getBomsByMainPartNo: environment.api_url + 'cisco-config/getBomsByMainPartNo',
  isPartPresent: environment.api_url + 'cisco-common/isPartPresent',
  isPartValid: environment.api_url + 'cisco-common/isPartValid',
  validateTanFlexField: environment.api_url + 'cisco-common/validateTanFlexField',
  getFailMRBCodesList: environment.api_url + 'cisco-common/getFailMRBCodesList',
  getactionbydefect: environment.api_url + 'cisco-common/getactionbydefect',
  getPreWorkcenterResultCode: environment.api_url + 'cisco-stop/getPreWorkcenterResultCode',
  getBomCount: environment.api_url + 'cisco-iqa/getBomCount',
  getFADefectAndAction: environment.api_url + 'cisco-iqa/getFADefectAndAction',
  getCiscoTestStations: environment.api_url + 'ciscopretest/getCiscoTestStations',
  getUnitInfo: environment.api_url + 'unitinfo/getUnitInfo',
  getResultCodes: environment.api_url + 'resultcode/getResultCodeByValidateResult',
  getEcoActCodeOccurrence: environment.api_url + 'cisco-common/getEcoActCodeOccurrence',
  getRepairActCodeOccurrence: environment.api_url + 'cisco-common/getRepairActCodeOccurrence',
  //QR Code api For Cisco
  getQRCodeDetail: environment.api_url + 'ciscopretest/getQRCodeDetail',

  // dicrepancy
  getResultCodeForDiscrepancy:
    environment.api_url + 'resultcode/getResultCodeByValidateResult',
  getstorageholdsubcode:
    environment.api_url + 'holdrelease/getstorageholdsubcode',
  moveinventory: environment.api_url + 'wprinventory/moveinventory',
  receiptDate: environment.api_url + 'glb-common/receiptDate',
  getStopShipProcess: environment.api_url + 'glb-tmo-trigger/getStopShipProcess',
  getROByBCN: environment.api_url + 'glb-common/getROByBCN',

  // FA and time out;
  performFA: environment.api_url + 'failureanalysis/performFA',
  performTimeOut: environment.api_url + 'timeout/performTimeOut',
  getPreviousAssemblyFADetails: environment.api_url + 'failureanalysis/getPreviousAssemblyFADetails',

  // triggers for cisco
  getprocessffbycountry: environment.api_url + 'cisco-validation/getprocessffbycountry',
  getEcoFailureAnalysis: environment.api_url + 'cisco-validation/getEcoFailureAnalysis',
  getforceecoupgradetofa: environment.api_url + 'cisco-validation/getforceecoupgradetofa',
  getCheckRevisionWithAutoScrap: environment.api_url + 'cisco-validation/getCheckRevisionWithAutoScrap',
  getProcessFlexFieldValue: environment.api_url + 'cisco-validation/getProcessFlexFieldValue',
  getMrbEcoCodeCheck: environment.api_url + 'cisco-validation/getMrbEcoCodeCheck',
  getAllEcoCodeScrap: environment.api_url + 'cisco-validation/getAllEcoCodeScrap',
  validatePcbOutRevision: environment.api_url + 'cisco-validation/validatePcbOutRevision',
  getForceDetectCodeToFa: environment.api_url + 'cisco-validation/getForceDetectCodeToFa',
  incomingRevisionCheck: environment.api_url + 'cisco-validation/incomingRevisionCheck',

  // ECO booking.
  getCustomInstruction:
    environment.api_url + 'custominstructions/getCustomInstruction',
  performTimeIn: environment.api_url + 'time-in/performTimeIn',
  getTimeInDetails: environment.api_url + 'glb-common/getTimeInDetails',
  getsnbypid: environment.api_url + 'ecobooking/getsnbypid',

  // repair debug
  getActionCode: environment.api_url + 'fa-code/getActionCode',
  getassemblybyproduct: environment.api_url + 'fa-code/getAssemblyByProduct',
  getcommoditybyassembly: environment.api_url + 'fa-code/getCommodityByAssembly',
  getCommodity: environment.api_url + 'fa-code/getSoftwareCommodity',
  getPartByBOMId: environment.api_url + 'glb-common/getPartByBOMId',
  getDefectByActionAndCommodity: environment.api_url + 'fa-code/getDefectByActionAndCommodity',
  getReqListByPN: environment.api_url + 'glb-common/getRequisitionListByPN',
  createReqOrder: environment.api_url + 'requisition-order/createreqorder',
  cancelReqOrder: environment.api_url + 'requisition-order/cancelreqorder',
  cancelFA: environment.api_url + 'failureanalysis/performFA',
  getCabCodesAndCustomerMessages: environment.api_url + 'hp-common/getCabCodesAndCustomerMessages',
  averagepartvalueservice: environment.api_url + 'hp-common/getAvgPartValue',
  getFAFFValues: environment.api_url + 'hp-common/getFAFFValues',
  stockqtyservice: environment.api_url + 'glb-common/getStockQty',
  getMacAddress: environment.api_url + 'cisco-config/getMacAddress',
  checkPremiumDone: environment.api_url + 'byd-hp-tmo-trigger/BYDHPTMOCheckPremiumDone',
  getKitPartByProductPlatform: environment.api_url + 'glb-common/getKitPartByProductPlatform',
  getCorePartByBomName: environment.api_url + 'glb-common/getCorePartByBomName',
  getCorePartQtyByPN: environment.api_url + 'glb-common/getCorePartQtyByPN',
  getKitPartQtyByPN: environment.api_url + 'glb-common/getKitPartQtyByPN',
  getKitPartId: environment.api_url + 'glb-hp-rcv-trigger/getPartDetailsByNumber',

  getHptirtstrigger: environment.api_url + 'glb-hp-tmo/glbHptirtstrigger',
  getHPTMODebug: environment.api_url + 'glb-hp-tmo/glbHPTMODebug',
  glbhptmocommdebug: environment.api_url + 'glb-hp-tmo/glbhpcommtmodebug',
  gethpcommtmodebug: environment.api_url + 'byd-hp-tmo-trigger/gethpcommtmodebug',
  getGlbKardex: environment.api_url + 'glb-hp-tmo/getGlbKardex',
  getHPTMOMBTrigger: environment.api_url + 'byd-hp-tmo-trigger/getHPTMOMBTrigger',
  getHPAccessory: environment.api_url + 'byd-hp-tmo-trigger/getHPAccessory',
  hpcommtmooctopus: environment.api_url + 'byd-hp-tmo-trigger/hpcommtmooctopus',
  getHpCommTmoHddCheck: environment.api_url + 'byd-tmo-trigger/bydHpCommTmoHddCheck',

  // RepairHome & Assesment urls
  getHoldReleaseDetailService: environment.api_url + 'holdrelease/getHoldReleaseDetailService',
  getFFValue: environment.api_url + 'flexfield/getffvalue',
  getAlertDetailsAssessment: environment.api_url + 'custominstructions/getAssessmentCustomInstruction',
  getInitialDetailsAssessment: environment.api_url + 'hp-common/getCustomerDesc',

  getaccessfffromrec: environment.api_url + 'hp-common/getAccessoriesFFFromRec',
  missingaccessMail: environment.api_url + 'hp-common/missingAccess',
  getResultCodeByValidateResult: environment.api_url + 'resultcode/getResultCodeByValidateResult',
  getHPFAHistory: environment.api_url + 'fahistory/getHPFAHistory',
  getHPFAHistoryQuoteResp: environment.api_url + 'fahistory/getHPFAHistory',
  kitHPFAHistory: environment.api_url + 'fahistory/getHPFAHistory',

  getRequisitionByBCN: environment.api_url + 'glb-common/getRequisitionByBcn',
  releaseFromHold: environment.api_url + 'wprinventory/releasefromhold',
  hpfadebugtrigger: environment.api_url + 'glb-hp-fa-trigger/hpfadebugtrigger',
  getKardexReqDebug: environment.api_url + 'glb-req-trigger/getKardexReqDebug',
  getFFByWc: environment.api_url + 'flexfield/getFFByWc',
  shippingPostApi: environment.api_url + 'media-service/uploadMediawithworkcentername',
  videoPostApi: environment.api_url + 'media-service/uploadMedia',
  getCustomerResponse: environment.api_url + 'glb-common/getCustomerResponse',
  quoteMessageFormat: environment.api_url + 'glb-utility/quotemessageformat',

  getPreviousWCFADetails: environment.api_url + "hp-common/getPrevWCName",
  performHpf: environment.api_url + 'glb-hp-tmo/hptmofa',
  getInactiveBCN: environment.api_url + "glb-common/getBcnBySn",
  getPreviousHistory: environment.api_url + "glb-hp-tmo/getItemWCHistory",

  //reworkApis
  getValuesforFaff: environment.api_url + "flexfield/getfaffvalue",
  performIssueParts: environment.api_url + "failureanalysis/performIssueParts",
  SerialNumberLogic: environment.api_url + "glb-search/serialnumber",
  glbhptmorework: environment.api_url + "glb-hp-tmo/glbhptmorework",
  GlbHPFATriggerWrapper: environment.api_url + "glb-hp-fa-trigger/glbhpfarework",
  performUnissueParts: environment.api_url + "failureanalysis/performUnissueParts",
  getCompByAction: environment.api_url + "fa-code/getCompByAction",
  glbhppartreqcheck: environment.api_url + "glb-hp-tmo/glbhppartreqcheck",
  partsreturntostock: environment.api_url + "glb-hp-tmo/partsreturntostock",
  getPNForLastCompReq: environment.api_url + "glb-common/getPNForLastCompReq",

  //hp_MB_Repair urls
  getDefectCodeByDefect: environment.api_url + "fa-code/defectcodesnonasm",
  getActionCodeByDefect: environment.api_url + "fa-code/getActionCodeByDefect",

  ///hp packout
  samplingOBA: environment.api_url + "byd-hp-tmo-trigger/getBYDHPTMOSamplingOBA",
  packoutTimeOut: environment.api_url + "byd-hp-tmo-trigger/getBydHpCommTmoPackout",

  //HP OBA
  getOBAMedia: environment.api_url + "media-service/getOBAMedia",

  //hp VFT
  getMBPartNo: environment.api_url + "glb-common/getMBPartNo",
  glbHpTmoRtv: environment.api_url + "glb-hp-tmo/glbHpTmoRtv",
  getCTDecoderCode: environment.api_url + "glb-common/getCtCode",
  getGlbHpTmoVft: environment.api_url + "glb-hp-tmo/getGlbHpTmoVft",
  glbHpRemCommRtv: environment.api_url + "glb-hp-fa-trigger/glbHpRemCommRtv",
  glbhpvfttestuserrtv: environment.api_url + "glb-hp-tmo/glbhpvfttestuserrtv",
  performRemoveParts: environment.api_url + "failureanalysis/performRemoveParts",
  getIssuedPartsDetailsRequest: environment.api_url + "glb-common/getIssuedPartsDetailsRequest",
  getProductClassandSubClass: environment.api_url + "glb-hp-fa-trigger/getproductclassandsubclass",

  //cisco packout
  getPackOutDetailsByPid: environment.api_url + "cisco-packout/getPackOutDetailsByPid",

  //hp burnin
  getHpTmoBi: environment.api_url + "glb-hp-tmo/getHpTmoBi",

  // cisco FQA
  getFlexFieldsWithValues: environment.api_url + "cisco-fqa/getFlexFieldsWithValues",
  getLoopingFlexFieldValues: environment.api_url + "cisco-fqa/getLoopingFlexFieldValues",

  //hp receiving video
  getQuarantineedContract: environment.api_url + "glb-common/checkquarantinecontracrt",

  // getHPTMOMBTriggerPN
  getHPTMOMBTriggerPN: environment.api_url + "byd-hp-tmo-trigger/hptmombrepairablepntrigger",

  //Sub Process Service
  getSubProcessPageBody: environment.api_url + "metadataprocessor/getSubProcess",

  getHostName: environment.hostNameUrl,

  addInfoCodes: environment.api_url + "failureanalysis/addInfoCodes",

  //hp Shipping
  performShipment: environment.api_url + "shipment/performshipment",
  performManifest: environment.api_url + "shipment/performmanifest",
  getShipmentDetails: environment.api_url + "shipment/getshipmentdetails",
  getStAbbrevCode: environment.api_url + "shipment/getStAbbrevCode",
  getShippingTermsDetails: environment.api_url + "shipment/getShippingTermsDetails",
  getManifestFfValues: environment.api_url + "flexfield/getManifestFfValue",
  manifestTrax: environment.api_url + "trax-wrp/manifestTrax",
  getDestinationPallet: environment.api_url + "shipment/getDestinationPalletByOOID",
  hpgntrigger: environment.api_url + "trax-wrp/hpGnManifestTrigger",
  getRecipientCountryCode: environment.api_url + "shipment/getRecipientCountryCode",
  getPrinterNameByHostName: environment.api_url + "glb-common/getPrinterNameByHostName",
  getRoOoDetails: environment.api_url + "shipment/getRoOoDetails",
  getShipManifestStatus: environment.api_url + "shipment/getShipManifestStatus",
  getUnitInfoShipping: environment.api_url + "unitinfo/getUnitInfoShipping",
  getTradingPartnerId: environment.api_url + "shipment/getTradingPartnerId",
  getRoOoDetailsLc: environment.api_url + "shipment/getRoOoDetailsLc",
  getPrintTemplate: environment.api_url + "shipment/getPrintTemplate",

  //cisco-rework
  getReworkTaskDetails: environment.api_url + "ciscorework/getReworkTaskDetails",
  getReworkMasterList: environment.api_url + "ciscorework/getReworkMasterList",

  //cisco-bga-rework
  getBGAReworkTaskDetails: environment.api_url + "ciscobgarework/getBgaReworkTaskDetails",
  getBGAReworkMasterList: environment.api_url + "ciscobgarework/getBgaReworkMasterList",

  //cisco Config rework service
  getConfigReworkTaskDetails: environment.api_url + "cisco-config/getConfigReworkTaskDetails",
  getConfigReworkMasterList: environment.api_url + "cisco-config/getConfigReworkMasterList",
  getValidateEco: environment.api_url + "cisco-config/validateEco",


  // Cisco debug
  getCiscoDebugFailCodeTask: environment.api_url + "ciscodebug/getFailCodeTask",
  getCiscoDebugAvailQty: environment.api_url + "ciscodebug/getAvailableQuantities",
  getCiscoDebugWishlistItems: environment.api_url + "ciscodebug/getWishlistItems",
  getCiscoDebugEcoTasks: environment.api_url + "ciscodebug/getEcoTasks",
  getCiscoDebugSubAssemblies: environment.api_url + "ciscodebug/getSubAssemblies",
  getCompLocationsAndParts: environment.api_url + "ciscodebug/getCompLocationsAndParts",
  getCiscoDebugFaFlexFields: environment.api_url + "ciscodebug/getFaFlexFields",
  getDebugTaskDetails: environment.api_url + "ciscodebug/getDebugTaskDetails",
  getCiscoDebugRecAssem: environment.api_url + "ciscodebug/getRecordedAssemblies",
  getCiscoDebugDefectCodes: environment.api_url + "cisco-common/getDefectsByAction",
  getCiscoDebugPartOrOutComes: environment.api_url + "ciscodebug/getOutComeCodes",
  getCiscoDebugLCValues: environment.api_url + "ciscodebug/getLooperControlsValues",
  getCiscoDebugInvStockSources: environment.api_url + "ciscodebug/getInventoryStockSources",
  getCiscoDebugIsWCLooping: environment.api_url + "ciscodebug/isWorkCenterLooping",
  getCiscoDebugValidateTasks: environment.api_url + "ciscodebug/getDebugValidateTasks",

  getAllItemHistory: environment.api_url + "item-history/getAllItemHistory",
  //specific for CISCO.  
  getAllItemHistoryCISCO: environment.api_url + "cisco-common/getAllItemHistory",

  //dell PA 

  getOOStatus: environment.api_url + "glb-common/getOOStatusBySN",

  //dell Receiving

  dellReceivingreceipt: environment.api_url + "receipt-wpr/receiptV2",
  getSNPNByRefOrder: environment.api_url + "glb-hp-rcv-trigger/getSNPNByRefOrder",
  getRoffByRo: environment.api_url + "glb-common/getRoffByRo",
  dellCanadaReceiving: environment.api_url + "glb_dell_rcv/dellCanadaReceiving",

  getUnitHistory: environment.api_url + "dell-mbr/unit-history",
  getReceivingFF: environment.api_url + "dell-mbr/receiving-flex-fields",
  statusApprovedNPI: environment.api_url + "dellmbr-rcv-trg/flex-field/mandatory-check",
  oldRevisionFormatCheck: environment.api_url + "dellmbr-rcv-trg/flex-field/format-check",
  enrichedByIris: environment.api_url + "dellmbr-rcv-trg/flex-field/enriched-by-iris",
  lagCheck: environment.api_url + "dellmbr-rcv-trg/flex-field/lag-check",
  strikeCheck: environment.api_url + "dellmbr-rcv-trg/receipt/strike-check",
  universalFlexFields: environment.api_url + "dell-mbr/universal-flex-fields",
  bydgoszczEscalationPNCheck: environment.api_url + "dell-mbr/bydgoszcz/escalation/part-number-check",
  bydgoszczStrike: environment.api_url + "dellmbr-rcv-trg/bydgoszcz/strike",
  getDefectGroups: environment.api_url + "dell-mbr/defect-groups",
  getDefectCodesByDefectGroup: environment.api_url + "dell-mbr/defect-codes/by-defect-group",

  //DELL Blind Receiving
  getNextItemBCN: environment.api_url + "glb-common/getNextItemBCN",
  getCurrPrevRODetailsBySN: environment.api_url + "glb-common/getCurrPrevRODetailsBySN",
  //DELL trigger
  stopProcessClientReceiving: environment.api_url + "glb-dell-rcv-trigger/stopProcessClientReceiving",


  //cisco-t&c-rework
  getReadOnlyTasks: environment.api_url + "cisco-tcrework/getReadOnlyTasks",
  getTCReworkMasterList: environment.api_url + "cisco-tcrework/getReworkMasterList",
  getTCReworkWishlistItems: environment.api_url + "cisco-tcrework/getWishListItems",
  getTCReworkRecordedDefects: environment.api_url + "cisco-common/getRecordedDefects",

  //cicso T&C urls
  getWhistlistItems: environment.api_url + "ciscotc/getWishListItems",
  getAvailableQuantities: environment.api_url + "ciscotc/getAvailableQuantities",
  getCompCategories: environment.api_url + "ciscotc/getCompCategories",
  getAccessoryTasks: environment.api_url + "ciscotc/getAccessoryTasks",
  getSubAssemblies: environment.api_url + "ciscotc/getSubAssemblies",
  getCompParts: environment.api_url + "ciscotc/getCompParts",
  getFAFlexFields: environment.api_url + "ciscotc/getFAFlexFields",
  getDefectCodes4Wc: environment.api_url + "cisco-common/getDefectsByAction",
  getEcoTasks: environment.api_url + "ciscodebug/getEcoTasks",
  getRecordedDefects: environment.api_url + "cisco-common/getRecordedDefects",

  //DELL Last note and Repair INFO
  // getCurrPrevRODetailsBySN: environment.api_url + "glb-common/getCurrPrevRODetailsBySN",

  //DELL WC API
  dellReceiptDate: environment.api_url + "glb-common/dellReceiptDate",

  //DELL VMI Trigger
  pwcPerformTimeOutTrigger: environment.api_url + "glb-dell-tmo/dellAIOTimeOut",

  //is PartNumber

  isPartNumberPresent: environment.api_url + "glb-hp-rcv-trigger/isPartPresent",

  //DELL Packout Trigger and Service URL
  hddReturnPerformTimeOutTrigger: environment.api_url + "glb-dell-tmo/hddReturn",
  obaCalculationPerformTimeOut: environment.api_url + "glb-dell-tmo/obaCalculation",
  getDefectCodeDetails: environment.api_url + "glb-common/getDefectCodeDetails",
  getPreviousWCFAHistory: environment.api_url + "fahistory/getPreviousWCFAHistory",
  getWorkCenterIdByName: environment.api_url + "glb-common/getWorkCenterIdByName",
  getAccessoriesFfFromRcv: environment.api_url + "glb-common/getAccessoriesFfFromRcv",

  //Dell LOU Receiving Trigger
  dellAIOLouisvilleReceiving: environment.api_url + "glb-dell-rcv-trigger/dellAIOLouisvilleReceiving",

  //DELL AIO CanadaReceivingTrigger
  dellAIOCanadaReceivingTrigger: environment.api_url + "glb-dell-rcv-trigger/dellAIOCanadaReceiving",
  dellAIOPATrigger: environment.api_url + "glb-dell-tmo/dellaiodepotbfbacklogtimeoutunit",

  //Save&Exit Additional microservices
  getFFRamValue: environment.api_url + 'flexfield/getffvalue',
  getFFQualityValue: environment.api_url + 'flexfield/getffvalue',
  getFFCTValue: environment.api_url + 'flexfield/getffvalue',
  getFFPRValue: environment.api_url + 'flexfield/getffvalue',

  getFFValueBeforeRepair: environment.api_url + 'flexfield/getffvalue',
  getFFValueAfterRepair: environment.api_url + 'flexfield/getffvalue',
  getBiosAlertDetailsAssessment: environment.api_url + 'custominstructions/getAssessmentCustomInstruction',
  getSoftwareAlertDetailsAssessment: environment.api_url + 'custominstructions/getAssessmentCustomInstruction',

  getFaInitialDetailsAssessment: environment.api_url + 'hp-common/getCustomerDesc',

  getADVISORYLOGAlertDetailsAssessment: environment.api_url + 'custominstructions/getAssessmentCustomInstruction',
  getFFUDValue: environment.api_url + 'flexfield/getffvalue',
  getFFTMValue: environment.api_url + 'flexfield/getffvalue',

  getReplaceActionCode: environment.api_url + "fa-code/getActionCode",
  getManualActionCode: environment.api_url + "fa-code/getActionCode",
  getSoftwareActionCode: environment.api_url + "fa-code/getActionCode",

  getactionCode1Commodity: environment.api_url + "fa-code/getSoftwareCommodity",
  getactionCode2Commodity: environment.api_url + "fa-code/getSoftwareCommodity",
  getactionCode3Commodity: environment.api_url + "fa-code/getSoftwareCommodity",

  getFFVMIByWc: environment.api_url + "flexfield/getFFByWc",
  getFFByWcRepairRespData: environment.api_url + "flexfield/getFFByWc",
  getFFBydebugwcIDWc: environment.api_url + "flexfield/getFFByWc",
  getFFByobawcIDWc: environment.api_url + "flexfield/getFFByWc",
  getFFByreworkwcIDWc: environment.api_url + "flexfield/getFFByWc",

  getAlertInitialFFByWc: environment.api_url + "flexfield/getFFByWc",

  getFfPreviousHistory: environment.api_url + "glb-hp-tmo/getItemWCHistory",
  getInitialFFByWc: environment.api_url + "flexfield/getFFByWc",
  getPrFFValue: environment.api_url + 'flexfield/getffvalue',
  getCcFFValue: environment.api_url + 'flexfield/getffvalue',
  getInactiveInitialDetailsAssessment: environment.api_url + 'hp-common/getCustomerDesc',
  getInactiveFFByWc: environment.api_url + "flexfield/getFFByWc",

  saveJsonResponse: environment.api_url + "metadataprocessor/saveJsonResponse",
  getJsonReponse: environment.api_url + "metadataprocessor/getJsonReponse",

  // dell initial assessment
  getFFEPSACodeValue: environment.api_url + 'flexfield/getffvalue',
  getFFTestStepValue: environment.api_url + 'flexfield/getffvalue',
  getFFBeepCodeValue: environment.api_url + 'flexfield/getffvalue',
  getFFPCDRCodeValue: environment.api_url + 'flexfield/getffvalue',
  getRamValue: environment.api_url + 'flexfield/getffvalue',

  //dell ECN

  getDellEcoDetails: environment.api_url + 'custominstructions/getAssessmentCustomInstruction',


  // Dell Debug
  getDellDebugStockQty: environment.api_url + "glb-common/getAvailableQuantity",
  getDellDebugActionCode: environment.api_url + "fa-code/getActionCode",
  getDellDebugDefect: environment.api_url + "glb-common/getDefectCodesByActionCode",
  getDellDebugHPFAHistory: environment.api_url + "fahistory/getLoopingFFHistory",
  getDellDebugRepairActions: environment.api_url + "flexfield/getfaffvalue",
  getDellDebugReqListByPN: environment.api_url + "glb-common/getRequisitionListByPN",
  dellDebugUpdateOutBoundOrder: environment.api_url + "outbound-order/updateOutboundOrder",
  getDellDebugReqStatusByCR1: environment.api_url + "glb-common/getRequisitionStatusByCR1",
  getDellDebugDefectByDefectGroup: environment.api_url + "dell-common/getDefectCodeByDefectGroup",
  getDellDebugDefectGroup: environment.api_url + "dell-common/getDefectCodeGroup",
  getdellDebugCommodities: environment.api_url + "flexfield/getfaffvalue",

  serialisedOut: environment.api_url + "adjustment/performserializedadjustout",
  validateBin: environment.api_url + "holdrelease/validateBin",

  // Dell FTEST
  ftestCmpRevisionFF: environment.api_url + 'dell-mbr-f-test/cmp-revision-ffs',
  ftestWipeLogs: environment.api_url + 'dell-mbr-f-test/logs/wipe-logs',
  ftestDpkLog: environment.api_url + 'dell-mbr-f-test/logs/dpk-logs',
  ftestValidatePgaWc: environment.api_url + 'dell-mbr-f-test/validate-pga-wc',
  ftestPCDoctorLogs: environment.api_url + 'dell-mbr-f-test/logs/pc-doctor-logs',
  ftestPartCatalogueDetails: environment.api_url + 'dell-mbr-f-test/part-catalogue-details',

  //HP Receiving
  getRoffDetails: environment.api_url + "flexfield/getRoffDetails",

  //Dell Assembly
  getSLRXConfig: environment.api_url + "glb-common/getSLRXConfig",

  getRcvsffValueByItem: environment.api_url + "flexfield/getRcvsffValueByItem",
  //Before Timeout Trigger
  getCheckAcdcCodes: environment.api_url + "glb-common/checkAcdcCodes",

  //Dell Rework
  getReferenceOrderFF: environment.api_url + "dell-mbr/reference-order/flex-fields",

  getFFBydellreworkwcIDWc: environment.api_url + "flexfield/getFFByWc",
  getPreviousWCFAHistoryRework: environment.api_url + "fahistory/getPreviousWCFAHistory",
  //getDellReworkDefect: environment.api_url + "glb-common/getDefectCodesByActionCode",
  getmoveinventoryconfig: environment.api_url + "holdrelease/getMoveInventoryConfig",
  performFARework: environment.api_url + "failureanalysis/performFA",
  performIssuePart: environment.api_url + "failureanalysis/performIssueParts",
  getRequisitionStatus: environment.api_url + "glb-common/getRequisitionStatusByCR1",
  getSLRXConfigForIssue: environment.api_url + "glb-common/getSLRXConfig",
  getSLRXConfigForRemove: environment.api_url + "glb-common/getSLRXConfig",
  undoFA: environment.api_url + "failureanalysis/performFA",
  performRemovePartsRework: environment.api_url + "failureanalysis/performRemoveParts",
  getBCNinfo: environment.api_url + "glb-common/getSnBcnInfo",
  dellAIORemove: environment.api_url + "glb-dell-tmo/dellAIORemovePart",
  dellGlobalTrigger: environment.api_url + "glb-dell-fa/rtvRemovePartChkFFConfigIrisCall",
  performUnIssuePartLou: environment.api_url + "failureanalysis/performUnissueParts",
  performUnIssuePartAN: environment.api_url + "failureanalysis/performIssueParts",
  getNextItemBCNforRework: environment.api_url + "glb-common/getNextItemBCN",
  onePrintDellRework: environment.api_url + "print-wpr/onePrint",

  // Dell Burn In
  getLastNote: environment.api_url + "dell-mbr/items/:itemId/last-note",
  getPartGroupAttributes: environment.api_url + "dell-mbr/flex-fields/part-group-attributes",

  // Dell Packout
  performObaCheck: environment.api_url + 'dell-timeout-mbr/oba/check',
  timeoutCheck: environment.api_url + 'dell-timeout-mbr/timeout/check',
  getPart: environment.api_url + "receipt-wpr/getPartDetailsByNumber",
  getIssueRemovePartDetails: environment.api_url + "glb-common/getIssueRemovePartsDetails",

  // Dell QVT
  getECOcounters: environment.api_url + "dell-eco/reports/hw-sw-counts",

  // Dell ECO
  getDellMBREcoTasks: environment.api_url + "dell-eco/eco-tasks",
  getFailCodes: environment.api_url + "dell-mbr/fail-codes",

  //Houston FQA
  getNewPartNo: environment.api_url + "cisco-fqa/getNewPartNo",
  validatedECO: environment.api_url + "cisco-config/validatedECO",

  // Cisco-Houston
  getRouteException: environment.api_url + "cisco-config/getRouteException",
  disposition: environment.api_url + "cisco-config/disposition",
  performChangePart: environment.api_url + "change-part/performChangePart",
  validateDataWipe: environment.api_url + "cisco-config/validateDataWipe",
  validateResultCode: environment.api_url + "cisco-validation/validateResultCode",
  getRouteExceptionResultCode: environment.api_url + "cisco-common/getRouteExceptionResultCode",
  getprocessFlexFields: environment.api_url + "cisco-common/processFlexFields",

  //Dell Final Test Trigger

  getPCDoctorTrigger: environment.api_url + "glb-dell-tmo/glbDellAIOValidatePcDoctorLogFileTmo",

  // Debug
  getDebugStockQty: environment.api_url + 'dell-mbr/stock-qty',
  getDebugRevision: environment.api_url + 'dell-mbr/flex-fields/failure-analysis-fields',
  getFlexFields: environment.api_url + 'dell-mbr/flex-fields/failure-analysis-fields',
  getDebugDefectCodes: environment.api_url + 'dell-mbr/defect-codes',

  //dell shipping
  getCarrierCode: environment.api_url + "shipment/getCarrierCode",
  getCarrierType: environment.api_url + "shipment/getCarrierType",
  getCarrierServiceType: environment.api_url + "shipment/getCarrierServiceType",

  // PA
  repair: environment.api_url + "dell-mbr/failure-analysis",
  binLocation: environment.api_url + "dell-mbr/unit-bins",

  // ECO triggers (DellGlobalMBRepairTimeOutCmpNEWOLDRevisionFFs)
  timeOutRevision: environment.api_url + "dell-mbr-f-test/time-out-revision",

  // dell receipt due date
  dellReceiptDueDate: environment.api_url + "dell-mbr/receipt-date",

  // Debug L2
  getQVTFFinfo: environment.api_url + "dell-mbr/error-qvt",

  /// Dell Estimate
  getdellEstimateStockQty: environment.api_url + "glb-common/getAvailableQuantity",
  getdellEstimateActionCode: environment.api_url + "fa-code/getActionCode",
  getdellEstimateDefect: environment.api_url + "glb-common/getDefectCodesByActionCode",
  getdellEstimateHPFAHistory: environment.api_url + "fahistory/getLoopingFFHistory",
  getdellEstimateRepairActions: environment.api_url + "flexfield/getfaffvalue",
  getdellEstimateDamageTypes: environment.api_url + "flexfield/getfaffvalue",
  getdellEstimateROHFFValueByRO: environment.api_url + "flexfield/getROHFFValueByRO",
  getDellEstimateHPFAHistory: environment.api_url + "fahistory/getLoopingFFHistory",
  getDellEstimategetROByBCN: environment.api_url + "glb-common/getROByBCN",
  getDellEstimategetROByRo: environment.api_url + "glb-common/getRoffByRo",
  getDellEstimateDefectGroup: environment.api_url + "dell-common/getDefectCodeGroup",
  getDellEstimateDefectByDefectGroup: environment.api_url + "dell-common/getDefectCodeByDefectGroup",

  //WC History
  getWCHistory: environment.api_url + 'dell-mbr/items/:itemId/work-center-history',

  /// Work center related flex field API in page component
  getFFByWcPageComponent: environment.api_url + "flexfield/getFFByWc",
  performRemovePartsPageComp: environment.api_url + "change-part/performChangePart",

  //dell car receiving
  dellCarFlaggedUnitReceiving: environment.api_url + "glb-dell-rcv-trigger/dellCARFlaggedUnitReceiving",
  dellCarStopProcessReceiving: environment.api_url + "glb-dell-rcv-trigger/dellCarStopProcessReceiving",
  predictiveTrigger: environment.api_url + "glb-dell-rcv-trigger/predictiveTrigger",

  // webui_dev.DELL_MBR_COMMON.Get_Part_Issue_Details
  getPartIssueDetails: environment.api_url + 'dell-mbr/part-issue/details',

  getFF: environment.api_url + "dell-mbr/flex-fields",
  partOrderAttribute: environment.api_url + "dell-mbr/part-group-attribute/info",

  // BGA Rework
  retrieveFACompCodes: environment.api_url + 'rest/failureAnalysis/retrieveFACompCodes',
  componentCodes: environment.api_url + 'component-code/component-codes',

  // Bydgoszcz Receiving
  BYDreceivingTriggerDetails: environment.api_url + 'dell-mbr/bydgoszcz/trigger-details/receiving-trigger-details',

  // SZO/OLE
  getMyUnits: environment.api_url + "glb-common/getMyUnits",
  holdSelectedAndCurrentUnit: environment.api_url + "glb-common/holdSelectedAndCurrentUnit",
  getHandsOffHoldCode: environment.api_url + "glb-common/getHandsOffHoldCode",
  releaseBCN: environment.api_url + "holdrelease/releaseBCN",
  getUnitHandsOnDetails: environment.api_url + "glb-common/getUnitHandsOnDetails",
  getHandsOnTakeOverCode: environment.api_url + "glb-common/getHandsOnTakeOverCode",
  holdAllActiveUnits: environment.api_url + "glb-common/holdAllActiveUnits",

  /// Dell WUR kardex desktop API details
  getDellKDTrolleyBinItems: environment.api_url + "glb-common/getTrolleyBinItems",
  getEmptykardexBins: environment.api_url + "glb-common/getEmptyKardexBins",
  getGLBDellKardexDetails: environment.api_url + "dellwur-kardex/getGLBDellKardexDetails",
  getPutAwayLocation: environment.api_url + "glb-kardex/getPutAwayLocation",
  setKardexBin: environment.api_url + "glb-kardex/setKardexBin",

  //Verifone Receiving
  getRMAList: environment.api_url + "verifone-common/getRMAList",
  getReceivingLPanelDetails: environment.api_url + "verifone-common/getLPanelDetails",
  verifoneReceivingTrigger: environment.api_url + "verifone-rcv-trigger/receivingTrigger",

  // Verifone API
  getBatchWC: environment.api_url + "batch-common/getBatchWC",

  //Verifone LoadStation(H5000)
  getPreviousWCNote: environment.api_url + "glb-common/getPreviousWCNote",
  validateBatchItem: environment.api_url + "batch-common/validateBatchItem",
  getBatchItemDetails: environment.api_url + "batch-common/getBatchItemDetails",
  getWcFlexFieldsLov: environment.api_url + "glb-common/getWcFlexFieldsLov",
  getActiveBatchIds: environment.api_url + "batch-common/getActiveBatchIds",
  getActiveBatch: environment.api_url + "batch-common/getActiveBatch",
  getVerifoneUnitHeader: environment.api_url + "verifone-common/getUnitHeader",
  holdBCN: environment.api_url + "holdrelease/holdBCN",

  // Dell Car Packout URLs
  getDellCarResultCodes: environment.api_url + "resultcode/getResultCodeByValidateResult",
  dellCARTimeOut: environment.api_url + "glb-dell-tmo/dellCARTimeOut",
  dellCARHoldBCN: environment.api_url + "holdrelease/holdBCN",
  dellCARReleaseBCN: environment.api_url + "holdrelease/releaseBCN",
  dellCarAdjustOut: environment.api_url + "adjustment/performbulkadjustout",
  getRcvFfValueByCrc: environment.api_url + "flexfield/getRcvFfValueByCrc",
  lastNote: environment.api_url + "dell-mbr/items/295347212/last-note",
  getBoxNumber: environment.api_url + "glb-common/getBoxNumber",
  dellCarStopProcessTimeOut: environment.api_url + "glb-dell-tmo/dellCarStopProcessTimeOut",

  //Dell Car Shipping URLs
  dellCarManifest: environment.api_url + "trax-wrp/dellCarManifest",
  getPalletDispositionAndColourCode: environment.api_url + "shipment/getPalletDispositionAndColourCode",
  getShippingFfValueByFfName: environment.api_url + "shipment/getShippingFfValueByFfName",
  getCarBSOOrders: environment.api_url + "shipment/getBoxShipOrders",

  //Prediction Task
  defectParentPredictionData: environment.api_url + "prlaptopdell/parent_defect",
  commonClassPredictionData: environment.api_url + "prlaptopdell/com_class",
  getDefectGroupList: environment.api_url + "prlaptopdell/infomation",
  getSLUserRole: environment.api_url + "security/getSLUserRole",

  //E-Traveller API details
  getkeyDataCustomerResponse: environment.api_url + "glb-common/getCustomerResponse",
  getRERepairCSOIDByRODetails: environment.api_url + "flexfield/getROHFFValueByRODetails",
  getRRERepairDaysByRODetails: environment.api_url + "flexfield/getROHFFValueByRODetails",
  getServiceTypeCodeByRODetails: environment.api_url + "flexfield/getROHFFValueByRODetails",
  getFFDetailsByItemId: environment.api_url + "flexfield/getFFDetailsByItemId",
  getRepairTypeCodeByRODetails: environment.api_url + "flexfield/getROLFFValueByItem",
  getInboundAWBByRODetails: environment.api_url + "flexfield/getROHFFValueByRODetails",
  getReceiptIdByItem: environment.api_url + "flexfield/getReceiptIdByItem",
  getkeyDataShippingTermsDetails: environment.api_url + "shipment/getShippingTermsDetails",
  getETravellerCurrPrevRODetailsBySN: environment.api_url + "flexfield/getCurrPrevRODetailsBySN",
  getETravellerShipmentDetails: environment.api_url + "shipment/getshipmentdetails",
  getEtravellerHoldReleaseDetailService: environment.api_url + 'holdrelease/getHoldReleaseDetailService',
  getETravellerIssuedPartsDetailsRequest: environment.api_url + "glb-common/getIssuedPartsDetailsRequest",
  getETravellerAllRequisitionHistory: environment.api_url + "item-history/getAllRequisitionHistory",
  getETravellerPartsReturnedToStock: environment.api_url + "glbetraveller/getPartsReturnedToStock",
  getETravellerAllUndoissueHistory: environment.api_url + "glbetraveller/getAllUndoissueHistory",
  getPrintTemplateDetails: environment.api_url + "glbetraveller/getPrintTemplateDetails",

  // Cisco
  releasefromhold: environment.api_url + "wprinventory/releasefromhold",

  // Verifone WC
  getDueDate: environment.api_url + "verifone-common/getDueDate",
  getOrder4WC: environment.api_url + "orders-wrapper/getOrders4WC",
  getROFF: environment.api_url + "verifone-common/getROFF",

  //Verifone VMI
  checkInputNeeded: environment.api_url + "thingworxphoto/checkInputNeeded",
  getAdditionalInfo: environment.api_url + "thingworxphoto/getAdditionalInfo",
  getRules4Product: environment.api_url + "thingworxphoto/getRules4Product",
  getUnitRMADetails: environment.api_url + "verifonewrapper/getUnitRMADetails",
  getAccBom: environment.api_url + "verifone-common/getAccBom",
  getAlertsBySerialNumberFE: environment.api_url + "thingworxcommon/getAlertsBySerialNumberFE",

  // Dell Car WC Operation
  getROHFFValueByRODetails: environment.api_url + "flexfield/getROHFFValueByRODetails",
  getdellSupportBridge: environment.api_url + "dell-car-tmo/dellSupportBridge",
  predictiveDebugTrigger: environment.api_url + 'glb-dell-rcv-trigger/predictiveDebugTrigger',
  getDellCARCustomDetails: environment.api_url + "dell-car-common/getDellCARCustomDetails",
  getPartsFromDellBoms: environment.api_url + "dell-car-common/getPartsFromDellBoms",
  dellCarStopProcessRCVTrigger: environment.api_url + "glb-dell-rcv-trigger/dellCarStopProcessTrigger",
  getPreviouseWc: environment.api_url + "dell-car-tmo/getPreviouseWc",


  //HP902
  retrieveHpFACompCodes: environment.api_url + "failureanalysis/retrieveFACompCodes",
  updateComponentCode: environment.api_url + "failureanalysis/updateComponentCode",

  //dell debug PA popup api
  getDellCarPartQuantity: environment.api_url + "dell-car-common/getDellCarPartQuantity",
  rcSurTimeOutTrigger: environment.api_url + "dell-car-tmo/rcSurTimeOutTrigger",
  bcnTrigger: environment.api_url + "dell-car-tmo/bcnTrigger",
  getDellCarDebugHPFAHistory: environment.api_url + "dell-car-tmo/getDellCarFaHistory",
  getDellCarRplActionCode: environment.api_url + "fa-code/getActionCode",
  ugTimeOutTrigger: environment.api_url + "dell-car-tmo/ugTimeOutTrigger",
  dellCARCNLTimeOut: environment.api_url + "dell-car-tmo/dellCARCNLTimeOut",
  dellCARTrigger3Seq: environment.api_url + "dell-car-tmo/dellCARTrigger3Seq",
  blankDcTrigger: environment.api_url + "dell-car-tmo/blankDcTrigger",
  mandatoryDcTrigger: environment.api_url + "dell-car-tmo/mandatoryDcTrigger",
  forceQRTrigger: environment.api_url + "dell-car-tmo/forceQRTrigger",
  partsTrigger: environment.api_url + "dell-car-tmo/partsTrigger",
  getfaffvalue: environment.api_url + "flexfield/getfaffvalue",
  getRPLmoveinventoryconfig: environment.api_url + "holdrelease/getMoveInventoryConfig",
  gradeTimeOutTrigger: environment.api_url + "dell-car-tmo/gradeTimeOutTrigger",
  rcSurTrigger: environment.api_url + 'dell-car-tmo/rcSurTrigger',

  //Dell Car Debug Triggers
  raidTrigger: environment.api_url + "dell-car-tmo/raidTrigger",
  doaTrigger: environment.api_url + "dell-car-tmo/doaTrigger",
  surUniversalTimeOut: environment.api_url + "dell-car-tmo/surUniversalTimeOut",
  globalBomMatrix: environment.api_url + 'dell-car-tmo/globalBomMatrix',
  trigger4thSeq: environment.api_url + "dellcar-tmi-trigger/dellCar4thSeq",
  rpidtrigger: environment.api_url + 'dell-car-tmo/rpidTimeOutTrigger',
  nffTimeOutTrigger: environment.api_url + 'dell-car-tmo/nffTimeOutTrigger',
  updatePartQtyInDellCarDebug: environment.api_url + "dell-car-common/updatePartQtyLDC",
  getAlternatePartsDellCarDebug: environment.api_url + "dell-car-debug/getAlternateParts",

  //Wiki API Details
  getUserAccountInfo: environment.api_url + "security/getUserAccountInfo",
  getWikiDefectCodeByDefectGroup: environment.api_url + "dell-common/getDefectCodeByDefectGroup",
  getWiki: environment.api_url + "wiki-admin/getWiki",
  addWiki: environment.api_url + "wiki-common/addWiki",
  updateWiki: environment.api_url + "wiki-common/updateWiki",
  getWikiUserDetails: environment.api_url + "security/getWikiUserDetails",
  getWikiContext: environment.api_url + "wiki-common/getWikiContext",
  getUnitDetails: environment.api_url + "wiki-common/getUnitDetails",
  addChangeRequest: environment.api_url + "wiki-common/addChangeRequest",
  getComments: environment.api_url + "wiki-admin/getComments",
  saveWikiJsonResponse: environment.api_url + "metadataprocessor/saveJsonResponse",
  getWikiJsonReponse: environment.api_url + "metadataprocessor/getJsonReponse",
  getWikiCrDetails: environment.api_url + "wiki-admin/getWikiCrDetails",

  //HP BSOD
  getBSODTestCode: environment.api_url + 'flexfield/getffvalue',
  getSwReloadCode: environment.api_url + 'flexfield/getffvalue',
  getBSODCode: environment.api_url + 'flexfield/getffvalue',

  getRolFFValueByRo: environment.api_url + "flexfield/getRolFFValueByRo",
  // wiki admin api details 
  getAllWikiItems: environment.api_url + "wiki-admin/getAllWiki",
  getWikiItems: environment.api_url + "wiki-admin/getWiki",
  updateWikiStatus: environment.api_url + "wiki-common/updateWikiStatus",
  getWikiStatus: environment.api_url + "wiki-admin/getWikiCrDetails",
  updateWikiCr: environment.api_url + "wiki-common/updateWikiCrChangeRequest",
  getMyDraftJsonReponse: environment.api_url + "metadataprocessor/getMyJsonReponse",
  deleteJsonResponseData: environment.api_url + "metadataprocessor/deleteJsonResponseData",

  /// Dell Wur packout issue box related APIs
  getAlternetPart: environment.api_url + "glb-req-trigger/getAlternetPart",
  getAltPartIdFromAltPackagingNum: environment.api_url + "glb-hp-rcv-trigger/getPartDetailsByNumber",
  getBoxConditionFFValues: environment.api_url + 'flexfield/getffvalue',
  getAvailablePartQuantity: environment.api_url + "dell-mbr/stock-qty",
  getConditionId: environment.api_url + "glb-search/getConditionIdByName",

  getSysOutComeCode: environment.api_url+ "unitwrapper/getSysOutComeCode",
  getTimeOutResultCodes: environment.api_url+ "thingworxcommon/getTimeOutResultCodes"
};
