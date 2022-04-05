import { environment } from './environment';

export const serviceUrls = {
  // HP urls
  // validateLogin: 'http://10.8.140.108:10009/security/validateLogin',

  //encrypted login
  getWorkInstDellEducateURLLink: 'http://10.8.140.108:10001/glb-common/getDellEducateUrl',
  validateLogin: 'http://10.8.140.108:10009/security/validateLoginEncrypt',

  getHomeMenu: 'http://10.8.140.108:10009/security/getHomeMenu',
  getSubProcessMenu: 'http://10.8.140.108:10009/security/getSubProcessMenu',
  getSearchCriteria: 'http://10.8.140.108:10009/security/getSearchCriteria',
  getOrders: 'http://10.8.140.108:10022/receipt-wpr/getOrders',
  receiptV2: 'http://10.8.140.108:10022/receipt-wpr/receiptV2',
  createROReceiptV2:
    'http://10.8.140.108:10022/receipt-wpr/createROReceiptV2',
  validateSerialScan:
    'http://10.8.140.108:10021/glb-hp-rcv-trigger/validateSerialScan',
  getDiscrepancyCode:
    'http://10.8.140.108:10021/glb-hp-rcv-trigger/getDiscrepancyCode',
  getBlindReceiptCustomerPO:
    'http://10.8.140.108:10021/glb-hp-rcv-trigger/getBlindReceiptCustomerPO',
  getProcess: 'http://10.8.140.108:10020/metadataprocessor/getProcess',
  validateSerialScanQACode:
    'http://10.8.140.108:10021/glb-hp-rcv-trigger/validateSerialScanQACode',
  getPartModelAndWarrentyDetails:
    'http://10.8.140.108:10021/glb-hp-rcv-trigger/getPartModelAndWarrentyDetails',
  isPartPresentReceiptTrigger:
    'http://10.8.140.108:10021/glb-hp-rcv-trigger/isPartPresent',
  onePrint: 'http://10.8.140.108:10014/print-wpr/onePrint',
  validatePartNumberScanQACode: 'http://10.8.140.108:10021/glb-hp-rcv-trigger/validatePartNumberScanQACode',
  getSerialNumberDifferences: 'http://10.8.140.108:10021/glb-hp-rcv-trigger/getSerialNumberDifferences',
  getHPTMOCOMMDebug: 'http://10.8.140.108:10005/glb-hp-tmo/bydHPTMOCOMMDebug',
  getHPRLSCommonDebugTrigger: 'http://10.8.140.108:10011/glb-hold-release-trigger/getHPRLSCommonDebugTrigger',

  // cisco urls
  getConditionFlexFields: 'http://10.8.140.108:10026/cisco-iqa/getConditionFlexFields',
  getPCBByMainPart: 'http://10.8.140.108:10042/cisco-config/getPCBByMainPart',
  getResultCodes: 'http://10.8.140.108:10024/resultcode/getResultCodeByValidateResult',
  isPartPresent: 'http://10.8.140.108:10038/cisco-common/isPartPresent',
  isPartValid: 'http://10.8.140.108:10038/cisco-common/isPartValid',
  getBomsByMainPartNo: 'http://10.8.140.108:10042/cisco-config/getBomsByMainPartNo',
  getUnitInfo: 'http://10.8.140.108:10015/unitinfo/getUnitInfo',
  getBomCount: 'http://10.8.140.108:10026/cisco-iqa/getBomCount',
  getDefectCodesList: 'http://10.8.140.108:10042/cisco-config/getDefectCodesList',
  getactionbydefect: 'http://10.8.140.108:10038/cisco-common/getactionbydefect',
  getPreWorkcenterResultCode: 'http://10.8.140.108:10041/cisco-stop/getPreWorkcenterResultCode',
  getCiscoTestStations: "http://10.8.140.108:10034/ciscopretest/getCiscoTestStations",
  getFADefectAndAction: "http://10.8.140.108:10026/cisco-iqa/getFADefectAndAction",
  getEcoActCodeOccurrence: "http://10.8.140.108:10038/cisco-common/getEcoActCodeOccurrence",
  getRepairActCodeOccurrence: "http://10.8.140.108:10038/cisco-common/getRepairActCodeOccurrence",

  // RepairHome & Assesment urls
  getHoldReleaseDetailService: 'http://10.8.140.108:10010/holdrelease/getHoldReleaseDetailService',
  getFFRamValue: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getFFQualityValue: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getFFCTValue: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getFFPRValue: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getFFValue: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getFFValueBeforeRepair: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getFFValueAfterRepair: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getBiosAlertDetailsAssessment: 'http://10.8.140.108:10007/custominstructions/getAssessmentCustomInstruction',
  getSoftwareAlertDetailsAssessment: 'http://10.8.140.108:10007/custominstructions/getAssessmentCustomInstruction',
  getInitialDetailsAssessment: 'http://10.8.140.108:10002/hp-common/getCustomerDesc',
  getFaInitialDetailsAssessment: 'http://10.8.140.108:10002/hp-common/getCustomerDesc',

  validateTanFlexField: 'http://10.8.140.108:10038/cisco-common/validateTanFlexField',
  getFailMRBCodesList: 'http://10.8.140.108:10038/cisco-common/getFailMRBCodesList',
  getADVISORYLOGAlertDetailsAssessment: 'http://10.8.140.108:10007/custominstructions/getAssessmentCustomInstruction',
  getAlertDetailsAssessment: 'http://10.8.140.108:10007/custominstructions/getAssessmentCustomInstruction',
  getDellEcoDetails: 'http://10.8.140.108:10007/custominstructions/getAssessmentCustomInstruction',
  getFFUDValue: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getFFTMValue: 'http://10.8.140.108:10004/flexfield/getffvalue',

  //HP BSOD
  getBSODTestCode: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getSwReloadCode: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getBSODCode: 'http://10.8.140.108:10004/flexfield/getffvalue',

  getRolFFValueByRo: "http://10.8.140.108:10004/flexfield/getRolFFValueByRo",

  /// Dell Wur packout issue box related APIs
  getAlternetPart: environment.api_url + "glb-req-trigger/getAlternetPart",
  getAltPartIdFromAltPackagingNum: environment.api_url + "glb-hp-rcv-trigger/getPartDetailsByNumber",
  getBoxConditionFFValues: environment.api_url + 'flexfield/getffvalue',
  getAvailablePartQuantity: environment.api_url + "dell-mbr/stock-qty",
  getConditionId: environment.api_url + "glb-search/getConditionIdByName",

  // dicrepancy
  getResultCodeForDiscrepancy: 'http://10.8.140.108:10024/resultcode/getResultCodeByValidateResult',
  getstorageholdsubcode: 'http://10.8.140.108:10010/holdrelease/getstorageholdsubcode',
  moveinventory: 'http://10.8.140.108:10019/wprinventory/moveinventory',
  receiptDate: 'http://10.8.140.108:10001/glb-common/receiptDate',
  getStopShipProcess: 'http://10.8.140.108:10025/glb-tmo-trigger/getStopShipProcess',
  getROByBCN: 'http://10.8.140.108:10001/glb-common/getROByBCN',

  // FA and time out;
  performFA: 'http://10.8.140.108:10013/failureanalysis/performFA',
  performTimeOut: 'http://10.8.140.108:10040/timeout/performTimeOut',
  getPreviousAssemblyFADetails: 'http://10.8.140.108:10013/failureanalysis/getPreviousAssemblyFADetails',

  // triggers for cisco
  getprocessffbycountry: 'http://10.8.140.108:10039/cisco-validation/getprocessffbycountry',
  getEcoFailureAnalysis: 'http://10.8.140.108:10039/cisco-validation/getEcoFailureAnalysis',
  getforceecoupgradetofa: 'http://10.8.140.108:10039/cisco-validation/getforceecoupgradetofa',
  getCheckRevisionWithAutoScrap: 'http://10.8.140.108:10039/cisco-validation/getCheckRevisionWithAutoScrap',
  getProcessFlexFieldValue: 'http://10.8.140.108:10039/cisco-validation/getProcessFlexFieldValue',
  getMrbEcoCodeCheck: 'http://10.8.140.108:10039/cisco-validation/getMrbEcoCodeCheck',
  getAllEcoCodeScrap: 'http://10.8.140.108:10039/cisco-validation/getAllEcoCodeScrap',
  validatePcbOutRevision: 'http://10.8.140.108:10039/cisco-validation/validatePcbOutRevision',
  getForceDetectCodeToFa: 'http://10.8.140.108:10039/cisco-validation/getForceDetectCodeToFa',
  incomingRevisionCheck: 'http://10.8.140.108:10039/cisco-validation/incomingRevisionCheck',

  // ECO booking.
  getCustomInstruction: "http://10.8.140.108:10007/custominstructions/getCustomInstruction",

  performTimeIn: "http://10.8.140.108:10027/time-in/performTimeIn",
  getTimeInDetails: "http://10.8.140.108:10001/glb-common/getTimeInDetails",
  getsnbypid: "http://10.8.140.108:10016/ecobooking/getsnbypid",

  // repair debug
  getActionCode: "http://10.8.140.108:10003/fa-code/getActionCode",
  getReplaceActionCode: "http://10.8.140.108:10003/fa-code/getActionCode",
  getManualActionCode: "http://10.8.140.108:10003/fa-code/getActionCode",
  getSoftwareActionCode: "http://10.8.140.108:10003/fa-code/getActionCode",
  getassemblybyproduct: "http://10.8.140.108:10003/fa-code/getAssemblyByProduct",
  getcommoditybyassembly: "http://10.8.140.108:10003/fa-code/getCommodityByAssembly",
  getCommodity: "http://10.8.140.108:10003/fa-code/getSoftwareCommodity",
  getactionCode1Commodity: "http://10.8.140.108:10003/fa-code/getSoftwareCommodity",
  getactionCode2Commodity: "http://10.8.140.108:10003/fa-code/getSoftwareCommodity",
  getactionCode3Commodity: "http://10.8.140.108:10003/fa-code/getSoftwareCommodity",
  getPartByBOMId: "http://10.8.140.108:10001/glb-common/getPartByBOMId",
  getDefectByActionAndCommodity: "http://10.8.140.108:10003/fa-code/getDefectByActionAndCommodity",
  getReqListByPN: "http://10.8.140.108:10001/glb-common/getRequisitionListByPN",
  createReqOrder: "http://10.8.140.108:10023/requisition-order/createreqorder",
  cancelReqOrder: "http://10.8.140.108:10023/requisition-order/cancelreqorder",
  cancelFA: "http://10.8.140.108:10013/failureanalysis/performFA",
  getCabCodesAndCustomerMessages: "http://10.8.140.108:10002/hp-common/getCabCodesAndCustomerMessages",
  averagepartvalueservice: "http://10.8.140.108:10002/hp-common/getAvgPartValue",
  getFAFFValues: "http://10.8.140.108:10002/hp-common/getFAFFValues",
  stockqtyservice: "http://10.8.140.108:10001/glb-common/getStockQty",
  getHPAccessory: "http://10.8.140.108:10006/byd-hp-tmo-trigger/getHPAccessory",
  getMacAddress: "http://10.8.140.108:10042/cisco-config/getMacAddress",
  checkPremiumDone: "http://10.8.140.108:10006/byd-hp-tmo-trigger/BYDHPTMOCheckPremiumDone",
  getKitPartByProductPlatform: 'http://10.8.140.108:10001/glb-common/getKitPartByProductPlatform',
  getCorePartByBomName: 'http://10.8.140.108:10001/glb-common/getCorePartByBomName',
  getCorePartQtyByPN: 'http://10.8.140.108:10001/glb-common/getCorePartQtyByPN',
  getKitPartQtyByPN: 'http://10.8.140.108:10001/glb-common/getKitPartQtyByPN',
  getKitPartId: "https://apinlbqa.corp.ivytech.net/glb-hp-rcv-trigger/getPartDetailsByNumber",


  getHptirtstrigger: "http://10.8.140.108:10005/glb-hp-tmo/glbHptirtstrigger",
  getHPTMODebug: "http://10.8.140.108:10005/glb-hp-tmo/glbHPTMODebug",
  glbhptmocommdebug: "http://10.8.140.108:10005/glb-hp-tmo/glbhpcommtmodebug",
  gethpcommtmodebug: "http://10.8.140.108:10006/byd-hp-tmo-trigger/gethpcommtmodebug",
  getGlbKardex: "http://10.8.140.108:10005/glb-hp-tmo/getGlbKardex",
  getHPTMOMBTrigger: "http://10.8.140.108:10006/byd-hp-tmo-trigger/getHPTMOMBTrigger",
  hpcommtmooctopus: " http://10.8.140.108:10006/byd-hp-tmo-trigger/hpcommtmooctopus",
  getHpCommTmoHddCheck: "http://10.8.140.108:10017/byd-tmo-trigger/bydHpCommTmoHddCheck",

  getaccessfffromrec: "http://10.8.140.108:10002/hp-common/getAccessoriesFFFromRec",
  missingaccessMail: "http://10.8.140.108:10002/hp-common/missingAccess",
  getResultCodeByValidateResult: "http://10.8.140.108:10024/resultcode/getResultCodeByValidateResult",
  getHPFAHistory: "http://10.8.140.108:10037/fahistory/getHPFAHistory",
  getHPFAHistoryQuoteResp: "http://10.8.140.108:10037/fahistory/getHPFAHistory",
  kitHPFAHistory: "http://10.8.140.108:10037/fahistory/getHPFAHistory",

  getRequisitionByBCN: "http://10.8.140.108:10001/glb-common/getRequisitionByBcn",
  releaseFromHold: "http://10.8.140.108:10019/wprinventory/releasefromhold",
  hpfadebugtrigger: "http://10.8.140.108:10012/glb-hp-fa-trigger/hpfadebugtrigger",
  getKardexReqDebug: "http://10.8.140.108:10018/glb-req-trigger/getKardexReqDebug",
  getFFByWc: "http://10.8.140.108:10004/flexfield/getFFByWc",
  getFFVMIByWc: "http://10.8.140.108:10004/flexfield/getFFByWc",
  getFFByWcRepairRespData: "http://10.8.140.108:10004/flexfield/getFFByWc",
  getFFBydebugwcIDWc: "http://10.8.140.108:10004/flexfield/getFFByWc",
  getFFByobawcIDWc: "http://10.8.140.108:10004/flexfield/getFFByWc",
  getFFByreworkwcIDWc: "http://10.8.140.108:10004/flexfield/getFFByWc",
  getPNForLastCompReq: "http://10.8.140.108:10001/glb-common/getPNForLastCompReq",
  getAlertInitialFFByWc: "http://10.8.140.108:10004/flexfield/getFFByWc",



  videoPostApi: 'http://10.8.140.108:10029/media-service/uploadMedia',
  shippingPostApi: 'http://10.8.140.108:10029/media-service/uploadMediawithworkcentername',
  quoteMessageFormat: "http://10.8.140.108:10036/glb-utility/quotemessageformat",
  getCustomerResponse: "http://10.8.140.108:10001/glb-common/getCustomerResponse",

  // fa assessment
  getPreviousWCFADetails: "http://10.8.140.108:10002/hp-common/getPrevWCName",
  performHpf: 'http://10.8.140.108:10005/glb-hp-tmo/hptmofa',
  getInactiveBCN: "http://10.8.140.108:10001/glb-common/getBcnBySn",
  getPreviousHistory: "http://10.8.140.108:10005/glb-hp-tmo/getItemWCHistory",


  getRoffDetails: "http://10.8.140.108:10004/flexfield/getRoffDetails",
  getRcvsffValueByItem: "http://10.8.140.108:10004/flexfield/getRcvsffValueByItem",




  getFfPreviousHistory: "http://10.8.140.108:10005/glb-hp-tmo/getItemWCHistory",
  getInitialFFByWc: "http://10.8.140.108:10004/flexfield/getFFByWc",
  getPrFFValue: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getCcFFValue: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getInactiveInitialDetailsAssessment: 'http://10.8.140.108:10002/hp-common/getCustomerDesc',
  getInactiveFFByWc: "http://10.8.140.108:10004/flexfield/getFFByWc",

  ///repairreworkapis
  getValuesforFaff: "http://10.8.140.108:10004/flexfield/getfaffvalue",
  performIssueParts: "http://10.8.140.108:10013/failureanalysis/performIssueParts",
  SerialNumberLogic: "http://10.8.140.108:10030/glb-search/serialnumber",
  glbhptmorework: "http://10.8.140.108:10005/glb-hp-tmo/glbhptmorework",
  partsreturntostock: "http://10.8.140.108:10005/glb-hp-tmo/partsreturntostock",
  GlbHPFATriggerWrapper: "http://10.8.140.108:10012/glb-hp-fa-trigger/glbhpfarework",
  performUnissueParts: "http://10.8.140.108:10013/failureanalysis/performUnissueParts",
  getCompByAction: "http://10.8.140.108:10003/fa-code/getCompByAction",
  glbhppartreqcheck: "http://10.8.140.108:10005/glb-hp-tmo/glbhppartreqcheck",
  //hp_MB_Repair urls
  getDefectCodeByDefect: "http://10.8.140.108:10003/fa-code/defectcodesnonasm",
  getActionCodeByDefect: "http://10.8.140.108:10003/fa-code/getActionCodeByDefect",

  ///hp packout
  samplingOBA: "http://10.8.140.108:10006/byd-hp-tmo-trigger/getBYDHPTMOSamplingOBA",
  packoutTimeOut: "http://10.8.140.108:10006/byd-hp-tmo-trigger/getBydHpCommTmoPackout",

  // cisco FQA
  getFlexFieldsWithValues: "http://10.8.140.108:10043/cisco-fqa/getFlexFieldsWithValues",
  getLoopingFlexFieldValues: "http://10.8.140.108:10043/cisco-fqa/getLoopingFlexFieldValues",
  //hp VFT
  getIssuedPartsDetailsRequest: "http://10.8.140.108:10001/glb-common/getIssuedPartsDetailsRequest",

  //cisco packout
  getPackOutDetailsByPid: "http://10.8.140.108:10044/cisco-packout/getPackOutDetailsByPid",

  //OBA viewImage.
  getOBAMedia: "http://10.8.140.108:10029/media-service/getOBAMedia",

  //hp VFT
  getMBPartNo: "http://10.8.140.108:10001/glb-common/getMBPartNo",
  glbHpTmoRtv: "http://10.8.140.108:10005/glb-hp-tmo/glbHpTmoRtv",
  getCTDecoderCode: "http://10.8.140.108:10001/glb-common/getCtCode",
  getGlbHpTmoVft: "http://10.8.140.108:10005/glb-hp-tmo/getGlbHpTmoVft",
  glbHpRemCommRtv: "http://10.8.140.108:10012/glb-hp-fa-trigger/glbHpRemCommRtv",
  glbhpvfttestuserrtv: "http://10.8.140.108:10005/glb-hp-tmo/glbhpvfttestuserrtv",
  performRemoveParts: "http://10.8.140.108:10013/failureanalysis/performRemoveParts",
  getProductClassandSubClass: "http://10.8.140.108:10012/glb-hp-fa-trigger/getproductclassandsubclass",

  //hp burnin
  getHpTmoBi: "http://10.8.140.108:10005/glb-hp-tmo/getHpTmoBi",
  getSubProcessPageBody: 'http://10.8.140.108:10020/metadataprocessor/getSubProcess',
  //hp receiving video
  getQuarantineedContract: "http://10.8.140.108:10001/glb-common/checkquarantinecontracrt",

  // getHPTMOMBTriggerPN
  getHPTMOMBTriggerPN: "http://10.8.140.108:10006/byd-hp-tmo-trigger/hptmombrepairablepntrigger",

  // Cisco debug
  getCiscoDebugFailCodeTask: "http://10.8.140.108:10045/ciscodebug/getFailCodeTask",
  getCiscoDebugAvailQty: "http://10.8.140.108:10045/ciscodebug/getAvailableQuantities",
  getCiscoDebugWishlistItems: "http://10.8.140.108:10045/ciscodebug/getWishlistItems",
  getCiscoDebugEcoTasks: "http://10.8.140.108:10045/ciscodebug/getEcoTasks",
  getCiscoDebugSubAssemblies: "http://10.8.140.108:10045/ciscodebug/getSubAssemblies",
  getCompLocationsAndParts: "http://10.8.140.108:10045/ciscodebug/getCompLocationsAndParts",
  getCiscoDebugFaFlexFields: "http://10.8.140.108:10045/ciscodebug/getFaFlexFields",
  getDebugTaskDetails: "http://10.8.140.108:10045/ciscodebug/getDebugTaskDetails",
  getCiscoDebugRecAssem: "http://10.8.140.108:10045/ciscodebug/getRecordedAssemblies",
  getCiscoDebugDefectCodes: "http://10.8.140.108:10038/cisco-common/getDefectsByAction",
  getCiscoDebugPartOrOutComes: "http://10.8.140.108:10045/ciscodebug/getOutComeCodes",
  getCiscoDebugLCValues: "http://10.8.140.108:10045/ciscodebug/getLooperControlsValues",
  getCiscoDebugInvStockSources: "http://10.8.140.108:10045/ciscodebug/getInventoryStockSources",
  getCiscoDebugIsWCLooping: "http://10.8.140.108:10045/ciscodebug/isWorkCenterLooping",
  getCiscoDebugValidateTasks: "http://10.8.140.108:10045/ciscodebug/getDebugValidateTasks",

  getHostName: "http://10.8.140.108:10047/winapiservices/getHostName",

  addInfoCodes: "http://10.8.140.108:10013/failureanalysis/addInfoCodes",

  //hp Shipping
  performShipment: "http://10.8.140.108:10050/shipment/performshipment",
  performManifest: "http://10.8.140.108:10050/shipment/performmanifest",
  getShipmentDetails: "http://10.8.140.108:10050/shipment/getshipmentdetails",
  getStAbbrevCode: "http://10.8.140.108:10050/shipment/getStAbbrevCode",
  getShippingTermsDetails: " http://10.8.140.108:10050/shipment/getShippingTermsDetails",
  getManifestFfValues: "http://10.8.140.108:10004/flexfield/getManifestFfValue",
  manifestTrax: "http://10.8.140.108:10051/trax-wrp/manifestTrax",
  getDestinationPallet: "http://10.8.140.108:10050/shipment/getDestinationPalletByOOID",
  hpgntrigger: "http://10.8.140.108:10051/trax-wrp/hpGnManifestTrigger",
  getRecipientCountryCode: "http://10.8.140.108:10050/shipment/getRecipientCountryCode",
  getPrinterNameByHostName: "http://10.8.140.108:10001/glb-common/getPrinterNameByHostName",
  getShipManifestStatus: " http://10.8.140.108:10050/shipment/getShipManifestStatus",
  getUnitInfoShipping: "http://10.8.140.108:10015/unitinfo/getUnitInfoShipping",
  getPrintTemplate: "http://10.8.140.108:10050/shipment/getPrintTemplate",
  //cisco-rework
  getReworkTaskDetails: "http://10.8.140.108:10052/ciscorework/getReworkTaskDetails",
  getReworkMasterList: "http://10.8.140.108:10052/ciscorework/getReworkMasterList",

  //cisco Config rework service
  getConfigReworkTaskDetails: "http://10.8.140.108:10042/cisco-config/getConfigReworkTaskDetails",
  getConfigReworkMasterList: "http://10.8.140.108:10042/cisco-config/getConfigReworkMasterList",
  getValidateEco: "http://10.8.140.108:10042/cisco-config/validateEco",

  //hp Shipping_Home
  getRoOoDetails: "http://10.8.140.108:10050/shipment/getRoOoDetails",
  getTradingPartnerId: "http://10.8.140.108:10050/shipment/getTradingPartnerId",
  getRoOoDetailsLc: "http://10.8.140.108:10050/shipment/getRoOoDetailsLc",

  //save&Exit apis
  saveJsonResponse: "http://10.8.140.108:10020/metadataprocessor/saveJsonResponse",
  getJsonReponse: "http://10.8.140.108:10020/metadataprocessor/getJsonReponse",

  //cisco-bga-rework
  getBGAReworkTaskDetails: "http://10.8.140.108:10053/ciscobgarework/getBgaReworkTaskDetails",
  getBGAReworkMasterList: "http://10.8.140.108:10053/ciscobgarework/getBgaReworkMasterList",

  //common apin for all BU
  getAllItemHistory: "http://10.8.140.108:10082/item-history/getAllItemHistory",
  //specific for CISCO.
  getAllItemHistoryCISCO: "http://10.8.140.108:10038/cisco-common/getAllItemHistory",

  //cisco-t&c-rework
  getReadOnlyTasks: "http://10.8.140.108:10055/cisco-tcrework/getReadOnlyTasks",
  getTCReworkMasterList: "http://10.8.140.108:10055/cisco-tcrework/getReworkMasterList",
  getTCReworkWishlistItems: "http://10.8.140.108:10055/cisco-tcrework/getWishListItems",
  getTCReworkRecordedDefects: "http://10.8.140.108:10038/cisco-common/getRecordedDefects",

  //cisco T&C apis
  getWhistlistItems: "http://10.8.140.108:10054/ciscotc/getWishListItems",
  getAvailableQuantities: "http://10.8.140.108:10054/ciscotc/getAvailableQuantities",
  getCompCategories: "http://10.8.140.108:10054/ciscotc/getCompCategories",
  getAccessoryTasks: "http://10.8.140.108:10054/ciscotc/getAccessoryTasks",
  getSubAssemblies: "http://10.8.140.108:10054/ciscotc/getSubAssemblies",
  getCompParts: "http://10.8.140.108:10054/ciscotc/getCompParts",
  getFAFlexFields: "http://10.8.140.108:10054/ciscotc/getFAFlexFields",
  getDefectCodes4Wc: "http://10.8.140.108:10038/cisco-common/getDefectsByAction",
  getEcoTasks: "http://10.8.140.108:10045/ciscodebug/getEcoTasks",

  getRecordedDefects: "http://10.8.140.108:10038/cisco-common/getRecordedDefects",

  // dell initial assessment
  getFFEPSACodeValue: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getFFTestStepValue: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getFFBeepCodeValue: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getFFPCDRCodeValue: 'http://10.8.140.108:10004/flexfield/getffvalue',
  getRamValue: 'http://10.8.140.108:10004/flexfield/getffvalue',


  //dell Receiving

  dellReceivingreceipt: "http://10.8.140.108:10022/receipt-wpr/receiptV2",
  getSNPNByRefOrder: "http://10.8.140.108:10021/glb-hp-rcv-trigger/getSNPNByRefOrder",
  getRoffByRo: "http://10.8.140.108:10001/glb-common/getRoffByRo",
  dellCanadaReceiving: "http://10.8.140.108:10057/glb_dell_rcv/dellCanadaReceiving",

  //dell PA
  getOOStatus: "https://apinlbqa.corp.ivytech.net/glb-common/getOOStatusBySN",


  //DELL Blind Receiving
  getNextItemBCN: "http://10.8.140.108:10001/glb-common/getNextItemBCN",
  //DELL trigger
  stopProcessClientReceiving: "http://10.8.140.108:10057/glb-dell-rcv-trigger/stopProcessClientReceiving",
  getCurrPrevRODetailsBySN: "http://10.8.140.108:10001/glb-common/getCurrPrevRODetailsBySN",

  // Dell Debug
  getDellDebugStockQty: "http://10.8.140.108:10001/glb-common/getAvailableQuantity",
  getDellDebugActionCode: "http://10.8.140.108:10003/fa-code/getActionCode",
  getDellDebugDefect: "http://10.8.140.108:10001/glb-common/getDefectCodesByActionCode",
  getDellDebugHPFAHistory: "http://10.8.140.108:10037/fahistory/getLoopingFFHistory",
  getDellDebugRepairActions: "http://10.8.140.108:10004/flexfield/getfaffvalue",
  getDellDebugReqListByPN: "http://10.8.140.108:10001/glb-common/getRequisitionListByPN",
  dellDebugUpdateOutBoundOrder: "http://10.8.140.108:10067/outbound-order/updateOutboundOrder",
  getDellDebugReqStatusByCR1: "http://10.8.140.108:10001/glb-common/getRequisitionStatusByCR1",
  getDellDebugDefectByDefectGroup: "http://10.8.140.108:10028/dell-common/getDefectCodeByDefectGroup",
  getDellDebugDefectGroup: "http://10.8.140.108:10028/dell-common/getDefectCodeGroup",
  getdellDebugCommodities: environment.api_url + "flexfield/getfaffvalue",

  //DELL WC API
  dellReceiptDate: "http://10.8.140.108:10001/glb-common/dellReceiptDate",

  //DELL VMI Trigger
  pwcPerformTimeOutTrigger: "http://10.8.140.108:10079/glb-dell-tmo/dellAIOTimeOut",

  //DELL Packout Trigger
  hddReturnPerformTimeOutTrigger: "http://10.8.140.108:10079/glb-dell-tmo/hddReturn",
  obaCalculationPerformTimeOut: "http://10.8.140.108:10079/glb-dell-tmo/obaCalculation",

  //Dell LOU Receiving Trigger
  dellAIOLouisvilleReceiving: "http://10.8.140.108:10057/glb-dell-rcv-trigger/dellAIOLouisvilleReceiving",



  //is PartNumber

  isPartNumberPresent: "http://10.8.140.108:10021/glb-hp-rcv-trigger/isPartPresent",

  //DELL AIO CanadaReceivingTrigger
  dellAIOCanadaReceivingTrigger: "http://10.8.140.108:10057/glb-dell-rcv-trigger/dellAIOCanadaReceiving",
  dellAIOPATrigger: "http://10.8.140.108:10079/glb-dell-tmo/dellaiodepotbfbacklogtimeoutunit",

  //dell packout screen API
  getDefectCodeDetails: "http://10.8.140.108:10001/glb-common/getDefectCodeDetails",
  getPreviousWCFAHistory: "http://10.8.140.108:10037/fahistory/getPreviousWCFAHistory",
  getWorkCenterIdByName: "http://10.8.140.108:10001/glb-common/getWorkCenterIdByName",
  getAccessoriesFfFromRcv: "http://10.8.140.108:10001/glb-common/getAccessoriesFfFromRcv",

  serialisedOut: "http://10.8.140.108:10033/adjustment/performserializedadjustout",
  validateBin: "http://10.8.140.108:10010/holdrelease/validateBin",
  getPart: "http://10.8.140.108:10022/receipt-wpr/getPartDetailsByNumber",
  getIssueRemovePartDetails: "http://10.8.140.108:10001/glb-common/getIssueRemovePartsDetails",

  //Dell Rework 

  getFFBydellreworkwcIDWc: "http://10.8.140.108:10004/flexfield/getFFByWc",
  getPreviousWCFAHistoryRework: "http://10.8.140.108:10037/fahistory/getPreviousWCFAHistory",
  //getDellReworkDefect: "http://10.8.140.108:10001/glb-common/getDefectCodesByActionCode",
  getmoveinventoryconfig: "http://10.8.140.108:10010/holdrelease/getMoveInventoryConfig",
  performFARework: "http://10.8.140.108:10013/failureanalysis/performFA",
  performIssuePart: "http://10.8.140.108:10013/failureanalysis/performIssueParts",
  getRequisitionStatus: "http://10.8.140.108:10001/glb-common/getRequisitionStatusByCR1",
  getSLRXConfigForIssue: "http://10.8.140.108:10001/glb-common/getSLRXConfig",
  getSLRXConfigForRemove: "http://10.8.140.108:10001/glb-common/getSLRXConfig",
  undoFA: "http://10.8.140.108:10013/failureanalysis/performFA",
  performRemovePartsRework: "http://10.8.140.108:10013/failureanalysis/performRemoveParts",
  getBCNinfo: "http://10.8.140.108:10001/glb-common/getSnBcnInfo",
  dellAIORemove: "http://10.8.140.108:10079/glb-dell-tmo/dellAIORemovePart",
  dellGlobalTrigger: "http://10.8.140.108:10091/glb-dell-fa/rtvRemovePartChkFFConfigIrisCall",
  performUnIssuePartLou: "http://10.8.140.108:10013/failureanalysis/performUnissueParts",
  performUnIssuePartAN: "http://10.8.140.108:10013/failureanalysis/performIssueParts",
  getNextItemBCNforRework: "http://10.8.140.108:10001/glb-common/getNextItemBCN",
  onePrintDellRework: " http://10.8.140.108:10014/print-wpr/onePrint",

  // Dell Burn In
  getLastNote: "http://10.8.140.108:20069/dell-mbr/items/:itemId/last-note",
  getPartGroupAttributes: "http://10.8.140.108:20069/dell-mbr/flex-fields/part-group-attributes",
  getSLRXConfig: "http://10.8.140.108:10001/glb-common/getSLRXConfig",
  //removePartTrigger : "http://10.8.140.108:10091/glb-dell-fa/rtvRemovePartChkFFConfigIrisCall"
  removePartTrigger: "http://10.8.140.108:10080/glb-dell-fa/rtvRemovePartChkFFConfigIrisCall",
  getCheckAcdcCodes: "http://10.8.140.108:10001/glb-common/checkAcdcCodes",

  //DEll Final Test Doctor Trigger

  getPCDoctorTrigger: "http://10.8.140.108:10079/glb-dell-tmo/glbDellAIOValidatePcDoctorLogFileTmo",

  // Cisco-Houston
  getRouteException: "http://10.8.140.108:10042/cisco-config/getRouteException",
  disposition: "http://10.8.140.108:10042/cisco-config/disposition",
  performChangePart: "http://10.8.140.108:10081/change-part/performChangePart",
  validateDataWipe: "http://10.8.140.108:10042/cisco-config/validateDataWipe",
  getRouteExceptionResultCode: "http://10.8.140.108:10038/cisco-common/getRouteExceptionResultCode",
  validateResultCode: "http://10.8.140.108:10039/cisco-validation/validateResultCode",
  //QR Code api For Cisco
  getQRCodeDetail: "http://10.8.140.108:10034/ciscopretest/getQRCodeDetail",

  //houston FQA
  getNewPartNo: "http://10.8.140.108:10043/cisco-fqa/getNewPartNo",
  validatedECO: "http://10.8.140.108:10042/cisco-config/validatedECO",

  //houtson RMA Startup urls
  getprocessFlexFields: "http://10.8.140.108:10038/cisco-common/processFlexFields",

  //dell shipping
  getCarrierCode: "http://10.8.140.108:10050/shipment/getCarrierCode",
  getCarrierType: "http://10.8.140.108:10050/shipment/getCarrierType",
  getCarrierServiceType: "http://10.8.140.108:10050/shipment/getCarrierServiceType",

  /// Dell Estimate
  getdellEstimateStockQty: "http://10.8.140.108:10001/glb-common/getAvailableQuantity",
  getdellEstimateActionCode: "http://10.8.140.108:10003/fa-code/getActionCode",
  getdellEstimateDefect: "http://10.8.140.108:10001/glb-common/getDefectCodesByActionCode",
  getdellEstimateHPFAHistory: "http://10.8.140.108:10037/fahistory/getLoopingFFHistory",
  getdellEstimateRepairActions: "http://10.8.140.108:10004/flexfield/getfaffvalue",
  getdellEstimateDamageTypes: "http://10.8.140.108:10004/flexfield/getfaffvalue",
  getdellEstimateROHFFValueByRO: "http://10.8.140.108:10004/flexfield/getROHFFValueByRO",
  getDellEstimateHPFAHistory: "http://10.8.140.108:10037/fahistory/getLoopingFFHistory",
  getDellEstimategetROByBCN: "http://10.8.140.108:10001/glb-common/getROByBCN",
  getDellEstimategetROByRo: "http://10.8.140.108:10001/glb-common/getRoffByRo",
  getDellEstimateDefectGroup: "http://10.8.140.108:10028/dell-common/getDefectCodeGroup",
  getDellEstimateDefectByDefectGroup: "http://10.8.140.108:10028/dell-common/getDefectCodeByDefectGroup",

  /// Work instructions API
  getWorkInstructions: "https://apinlbqa.corp.ivytech.net/glbworkinstructions/getworkinstruction",

  /// Work center related flex field API in page component
  getFFByWcPageComponent: "http://10.8.140.108:10004/flexfield/getFFByWc",
  performRemovePartsPageComp: "http://10.8.140.108:10081/change-part/performChangePart",
  dellCarFlaggedUnitReceiving: "http://10.8.140.108:10057/glb-dell-rcv-trigger/dellCARFlaggedUnitReceiving",
  dellCarStopProcessReceiving: "http://10.8.140.108:10057/glb-dell-rcv-trigger/dellCarStopProcessReceiving",
  predictiveTrigger: "http://10.8.140.108:10057/glb-dell-rcv-trigger/predictiveTrigger",

  // Verifone API 
  getBatchWC: "http://10.8.140.108:10090/batch-common/getBatchWC",
  getDueDate: "https://apinlbdev.corp.ivytech.net/verifone-common/getDueDate",

  //Verifone LoadStation(H5000)
  getPreviousWCNote: "http://10.8.140.108:10001/glb-common/getPreviousWCNote",
  validateBatchItem: "http://10.8.140.108:10090/batch-common/validateBatchItem",
  getBatchItemDetails: "http://10.8.140.108:10090/batch-common/getBatchItemDetails",
  getWcFlexFieldsLov: "http://10.8.140.108:10001/glb-common/getWcFlexFieldsLov",
  getActiveBatchIds: "http://10.8.140.108:10090/batch-common/getActiveBatchIds",
  getActiveBatch: "http://10.8.140.108:10090/batch-common/getActiveBatch",
  getVerifoneUnitHeader: "http://10.8.140.108:10093/verifone-common/getUnitHeader",
  holdBCN: "http://10.8.140.108:10010/holdrelease/holdBCN",

  //dell Receiving

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

  // Dell FTEST
  ftestCmpRevisionFF: environment.api_url + 'dell-mbr-f-test/cmp-revision-ffs',
  ftestWipeLogs: environment.api_url + 'dell-mbr-f-test/logs/wipe-logs',
  ftestDpkLog: environment.api_url + 'dell-mbr-f-test/logs/dpk-logs',
  ftestValidatePgaWc: environment.api_url + 'dell-mbr-f-test/validate-pga-wc',
  ftestPCDoctorLogs: environment.api_url + 'dell-mbr-f-test/logs/pc-doctor-logs',
  ftestPartCatalogueDetails: environment.api_url + 'dell-mbr-f-test/part-catalogue-details',

  //Dell Rework
  getReferenceOrderFF: environment.api_url + "dell-mbr/reference-order/flex-fields",


  // Dell Packout
  performObaCheck: environment.api_url + 'dell-timeout-mbr/oba/check',
  timeoutCheck: environment.api_url + 'dell-timeout-mbr/timeout/check',


  // Dell QVT
  getECOcounters: environment.api_url + "dell-eco/reports/hw-sw-counts",

  // Dell ECO
  getDellMBREcoTasks: environment.api_url + "dell-eco/eco-tasks",
  getFailCodes: environment.api_url + "dell-mbr/fail-codes",

  // Debug
  getDebugStockQty: environment.api_url + 'dell-mbr/stock-qty',
  getDebugRevision: environment.api_url + 'dell-mbr/flex-fields/failure-analysis-fields',
  getFlexFields: environment.api_url + 'dell-mbr/flex-fields/failure-analysis-fields',
  getDebugDefectCodes: environment.api_url + 'dell-mbr/defect-codes',

  // PA
  repair: environment.api_url + "dell-mbr/failure-analysis",
  binLocation: environment.api_url + "dell-mbr/unit-bins",

  // ECO triggers (DellGlobalMBRepairTimeOutCmpNEWOLDRevisionFFs)
  timeOutRevision: environment.api_url + "dell-mbr-f-test/time-out-revision",

  // dell receipt due date
  dellReceiptDueDate: environment.api_url + "dell-mbr/receipt-date",

  // Debug L2
  getQVTFFinfo: environment.api_url + "dell-mbr/error-qvt",


  //WC History
  getWCHistory: environment.api_url + 'dell-mbr/items/:itemId/work-center-history',

  // webui_dev.DELL_MBR_COMMON.Get_Part_Issue_Details
  getPartIssueDetails: environment.api_url + 'dell-mbr/part-issue/details',

  getFF: environment.api_url + "dell-mbr/flex-fields",
  partOrderAttribute: environment.api_url + "dell-mbr/part-group-attribute/info",

  // SZO/OLE
  getMyUnits: "http://10.8.140.108:10001/glb-common/getMyUnits",
  holdSelectedAndCurrentUnit: "http://10.8.140.108:10001/glb-common/holdSelectedAndCurrentUnit",
  getHandsOffHoldCode: "http://10.8.140.108:10001/glb-common/getHandsOffHoldCode",
  releaseBCN: "http://10.8.140.108:10010/holdrelease/releaseBCN",
  getUnitHandsOnDetails: "http://10.8.140.108:10001/glb-common/getUnitHandsOnDetails",
  getHandsOnTakeOverCode: "http://10.8.140.108:10001/glb-common/getHandsOnTakeOverCode",
  holdAllActiveUnits: "http://10.8.140.108:10001/glb-common/holdAllActiveUnits",
  // BGA Rework
  retrieveFACompCodes: environment.api_url + 'rest/failureAnalysis/retrieveFACompCodes',
  componentCodes: environment.api_url + 'component-code/component-codes',

  // Bydgoszcz Receiving
  BYDreceivingTriggerDetails: environment.api_url + 'dell-mbr/bydgoszcz/trigger-details/receiving-trigger-details',

  /// Dell WUR kardex desktop API details
  getDellKDTrolleyBinItems: "http://10.8.140.108:10001/glb-common/getTrolleyBinItems",
  getEmptykardexBins: "http://10.8.140.108:10001/glb-common/getEmptyKardexBins",
  getGLBDellKardexDetails: "http://10.8.140.108:10092/dellwur-kardex/getGLBDellKardexDetails",
  getPutAwayLocation: environment.api_url + "glb-kardex/getPutAwayLocation",
  setKardexBin: environment.api_url + "glb-kardex/setKardexBin",

  //Verifone Receiving
  getRMAList: "http://10.8.140.108:10093/verifone-common/getRMAList",
  getReceivingLPanelDetails: "https://apinlbqa.corp.ivytech.net/verifone-common/getLPanelDetails",
  verifoneReceivingTrigger: "http://10.8.140.108:10093/verifone-rcv-trigger/receivingTrigger",

  // Dell Car Packout URLs
  getDellCarResultCodes: 'http://10.8.140.108:10024/resultcode/getResultCodeByValidateResult',
  dellCARTimeOut: "http://10.8.140.108:10079/glb-dell-tmo/dellCARTimeOut",
  dellCARHoldBCN: "http://10.8.140.108:10010/holdrelease/holdBCN",
  dellCARReleaseBCN: "http://10.8.140.108:10010/holdrelease/releaseBCN",
  dellCarAdjustOut: "http://10.8.140.108:10033/adjustment/performbulkadjustout",
  getRcvFfValueByCrc: "http://10.8.140.108:10004/flexfield/getRcvFfValueByCrc",
  lastNote: "http://10.8.140.108:20069/dell-mbr/items/295347212/last-note",
  getBoxNumber: "http://10.8.140.108:10001/glb-common/getBoxNumber",
  dellCarStopProcessTimeOut: "http://10.8.140.108:10079/glb-dell-tmo/dellCarStopProcessTimeOut",


  //Dell Car Shipping URLs
  dellCarManifest: "http://10.8.140.108:10051/trax-wrp/dellCarManifest",
  getPalletDispositionAndColourCode: "http://10.8.140.108:10050/shipment/getPalletDispositionAndColourCode",
  getShippingFfValueByFfName: "http://10.8.140.108:10050/shipment/getShippingFfValueByFfName",
  getCarBSOOrders: "http://10.8.140.108:10050/shipment/getBoxShipOrders",

  //Prediction Task
  defectParentPredictionData: "https://apinlbuat.corp.ivytech.net/prlaptopdell/parent_defect",
  commonClassPredictionData: "https://apinlbuat.corp.ivytech.net/prlaptopdell/com_class",
  getDefectGroupList: "https://apinlbuat.corp.ivytech.net/prlaptopdell/infomation",
  getSLUserRole: "https://apinlbqa.corp.ivytech.net/security/getSLUserRole",

  //E-Traveller API details
  getkeyDataCustomerResponse: "http://10.8.140.108:10001/glb-common/getCustomerResponse",
  getRERepairCSOIDByRODetails: "https://apinlbqa.corp.ivytech.net/flexfield/getROHFFValueByRODetails",
  getRRERepairDaysByRODetails: "https://apinlbqa.corp.ivytech.net/flexfield/getROHFFValueByRODetails",
  getServiceTypeCodeByRODetails: "https://apinlbqa.corp.ivytech.net/flexfield/getROHFFValueByRODetails",
  getFFDetailsByItemId: "https://apinlbqa.corp.ivytech.net/flexfield/getFFDetailsByItemId",
  getRepairTypeCodeByRODetails: "https://apinlbqa.corp.ivytech.net/flexfield/getROLFFValueByItem",
  getInboundAWBByRODetails: "https://apinlbqa.corp.ivytech.net/flexfield/getROHFFValueByRODetails",
  getReceiptIdByItem: "https://apinlbqa.corp.ivytech.net/flexfield/getReceiptIdByItem",
  getkeyDataShippingTermsDetails: "https://apinlbqa.corp.ivytech.net/shipment/getShippingTermsDetails",
  getETravellerCurrPrevRODetailsBySN: "https://apinlbqa.corp.ivytech.net/flexfield/getCurrPrevRODetailsBySN",
  getETravellerShipmentDetails: "https://apinlbqa.corp.ivytech.net/shipment/getshipmentdetails",
  getEtravellerHoldReleaseDetailService: "https://apinlbqa.corp.ivytech.net/holdrelease/getHoldReleaseDetailService",
  getETravellerIssuedPartsDetailsRequest: "https://apinlbqa.corp.ivytech.net/glb-common/getIssuedPartsDetailsRequest",
  getETravellerAllRequisitionHistory: "https://apinlbqa.corp.ivytech.net/item-history/getAllRequisitionHistory",
  getETravellerPartsReturnedToStock: "https://apinlbqa.corp.ivytech.net/glbetraveller/getPartsReturnedToStock",
  getETravellerAllUndoissueHistory: "https://apinlbqa.corp.ivytech.net/glbetraveller/getAllUndoissueHistory",
  getPrintTemplateDetails: "https://apinlbqa.corp.ivytech.net/glbetraveller/getPrintTemplateDetails",


  // Cisco
  releasefromhold: "https://apinlbqa.corp.ivytech.net/wprinventory/releasefromhold",

  // Verifone WC

  getOrder4WC: "https://apinlbqa.corp.ivytech.net/orders-wrapper/getOrders4WC",
  getROFF: "https://apinlbqa.corp.ivytech.net/verifone-common/getROFF",

  //Verifone VMI
  checkInputNeeded: "https://apinlbqa.corp.ivytech.net/thingworxphoto/checkInputNeeded",
  getAdditionalInfo: "https://apinlbqa.corp.ivytech.net/thingworxphoto/getAdditionalInfo",
  getRules4Product: "https://apinlbqa.corp.ivytech.net/thingworxphoto/getRules4Product",
  getUnitRMADetails: "https://apinlbqa.corp.ivytech.net/verifonewrapper/getUnitRMADetails",
  getAccBom: "https://apinlbqa.corp.ivytech.net/verifone-common/getAccBom",
  getAlertsBySerialNumberFE: "https://apinlbqa.corp.ivytech.net/thingworxcommon/getAlertsBySerialNumberFE",

  // Dell Car WC Operation
  getROHFFValueByRODetails: "https://apinlbqa.corp.ivytech.net/flexfield/getROHFFValueByRODetails",
  getdellSupportBridge: "https://apinlbqa.corp.ivytech.net/dell-car-tmo/dellSupportBridge",
  getDellCARCustomDetails: "https://apinlbqa.corp.ivytech.net/dell-car-common/getDellCARCustomDetails",
  getPartsFromDellBoms: "https://apinlbqa.corp.ivytech.net/dell-car-common/getPartsFromDellBoms",
  dellCarStopProcessRCVTrigger: "https://apinlbqa.corp.ivytech.net/glb-dell-rcv-trigger/dellCarStopProcessTrigger",
  getPreviouseWc: "https://apinlbqa.corp.ivytech.net/dell-car-tmo/getPreviouseWc",

  //HP902
  retrieveHpFACompCodes: "https://apinlbqa.corp.ivytech.net/failureanalysis/retrieveFACompCodes",
  updateComponentCode: "https://apinlbqa.corp.ivytech.net/failureanalysis/updateComponentCode",

  //dell debug PA popup api
  getDellCarPartQuantity: "https://apinlbqa.corp.ivytech.net/dell-car-common/getDellCarPartQuantity",

  rcSurTimeOutTrigger: "https://apinlbqa.corp.ivytech.net/dell-car-tmo/rcSurTimeOutTrigger",
  bcnTrigger: "https://apinlbqa.corp.ivytech.net/dell-car-tmo/bcnTrigger",
  nffTimeOutTrigger: "https://apinlbqa.corp.ivytech.net/dell-car-tmo/nffTimeOutTrigger",
  rpidtrigger: "https://apinlbqa.corp.ivytech.net/dell-car-tmo/rpidTimeOutTrigger",

  //Dell Car Debug Triggers
  predictiveDebugTrigger: environment.api_url + 'glb-dell-rcv-trigger/predictiveDebugTrigger',
  gradeTimeOutTrigger: environment.api_url + "dell-car-tmo/gradeTimeOutTrigger",
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
  doaTrigger: environment.api_url + "dell-car-tmo/doaTrigger",
  getPartsDetailsBomsMatrix: environment.api_url + "dell-car-common/getPartsDetailsBomsMatrix",
  updatePartQtyInDellCarDebug: "https://apinlbqa.corp.ivytech.net/dell-car-common/updatePartQtyLDC",
  getAlternatePartsDellCarDebug: environment.api_url + "dell-car-debug/getAlternateParts",

  surUniversalTimeOut: environment.api_url + "dell-car-tmo/surUniversalTimeOut",
  raidTrigger: "https://apinlbqa.corp.ivytech.net/dell-car-tmo/raidTrigger",
  rcSurTrigger: environment.api_url + "https://apinlbqa.corp.ivytech.net/dell-car-tmo/rcSurTrigger",
  trigger4thSeq: environment.api_url + "dellcar-tmi-trigger/dellCar4thSeq",
  //Wiki API Details
  getUserAccountInfo: "https://apinlbqa.corp.ivytech.net/security/getUserAccountInfo",
  getWikiDefectCodeByDefectGroup: "https://apinlbqa.corp.ivytech.net/dell-common/getDefectCodeByDefectGroup",
  getWiki: "https://apinlbqa.corp.ivytech.net/wiki-admin/getWiki",
  addWiki: "https://apinlbqa.corp.ivytech.net/wiki-common/addWiki",
  updateWiki: "https://apinlbqa.corp.ivytech.net/wiki-common/updateWiki",
  getWikiUserDetails: "https://apinlbqa.corp.ivytech.net/security/getWikiUserDetails",
  getWikiContext: "https://apinlbqa.corp.ivytech.net/wiki-common/getWikiContext",
  getUnitDetails: "https://apinlbqa.corp.ivytech.net/wiki-common/getUnitDetails",
  addChangeRequest: "https://apinlbqa.corp.ivytech.net/wiki-common/addChangeRequest",
  getComments: "https://apinlbqa.corp.ivytech.net/wiki-admin/getComments",
  saveWikiJsonResponse: "http://10.8.140.108:10020/metadataprocessor/saveJsonResponse",
  getWikiJsonReponse: "http://10.8.140.108:10020/metadataprocessor/getJsonReponse",
  getWikiCrDetails: "https://apinlbqa.corp.ivytech.net/wiki-admin/getWikiCrDetails",

  // wiki admin api details 
  getAllWikiItems: "https://apinlbqa.corp.ivytech.net/wiki-admin/getAllWiki",
  getWikiItems: "https://apinlbqa.corp.ivytech.net/wiki-admin/getWiki",
  updateWikiStatus: "https://apinlbqa.corp.ivytech.net/wiki-common/updateWikiStatus",
  getWikiStatus: "https://apinlbqa.corp.ivytech.net/wiki-admin/getWikiCrDetails",
  updateWikiCr: "https://apinlbqa.corp.ivytech.net/wiki-common/updateWikiCrChangeRequest",
  getMyDraftJsonReponse: "https://apinlbqa.corp.ivytech.net/metadataprocessor/getMyJsonReponse",
  deleteJsonResponseData: "https://apinlbqa.corp.ivytech.net/metadataprocessor/deleteJsonResponseData",

  getSysOutComeCode: environment.api_url+ "unitwrapper/getSysOutComeCode",
  getTimeOutResultCodes: environment.api_url+ "thingworxcommon/getTimeOutResultCodes"
};