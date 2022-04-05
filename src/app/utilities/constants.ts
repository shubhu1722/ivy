export enum contextKeysEnum {
  // 2 keys below are used to save/restore data during `Save & Exit`
  // ContextActionService:[prepareDataForSaving,restoreSavedData,populateMBRScreenWithStoredData]
  currentScreenData = 'currentScreenData',
  currentUIState = 'currentUIState',
  // 2 keys below are used for Time-out inside `DellWcOperationsTimeOutFooterComponent`
  mbrTimeoutNotes = 'mbrTimeoutNotes',
  timeoutResultCode = 'timeoutResultCode',
  dellMBRPageUUID = 'dellMBRPageUUID',
  repairUnitInfo = 'repairUnitInfo',
  userAccountInfo = 'userAccountInfo',
  loginUUID = 'loginUUID',
  currentWC = 'currentWC',
  getFFByWc = 'getFFByWc',
  trackingNumber = 'trackingNo',
  getJsonResponse = 'getJsonReponse',
  userSelectedClientName = 'userSelectedClientName',
  userSelectedContractName = 'userSelectedContractName'
}
export let dropdownData = [
  {
    label: "Defect Group",

  },
  {
    label: "Defect",

  }
]

export let buttonData = [
  {
    text: "Reject",

  },
  {
    text: "Accept",

  }
]

export let predictionData = [{
  "predidcted_class": "Slow Performance",
  "possible_defect_child": [
      {
          "defectCode": "PER01",
          "description": "Bios Issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER02",
          "description": "Thermal issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER03",
          "description": "BIOS issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER04",
          "description": "Fan Issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER05",
          "description": "Fan Clog Issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER06",
          "description": "CPU HW Issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER07",
          "description": "CPU SW Issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER08",
          "description": "Driver Issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER09",
          "description": "Graphics HW Issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER10",
          "description": "Graphics SW Issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER11",
          "description": "Graphics vBIOS issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER12",
          "description": "HDD HW Issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER13",
          "description": "Virus|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER14",
          "description": "Yellow Bang|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER15",
          "description": "OS control panel|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER16",
          "description": "HDD/SSD/M.2 overheat|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER17",
          "description": "ESPA Error|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER18",
          "description": "HDD FW Issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER19",
          "description": "Memory HW Issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER20",
          "description": "Memory not detected|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER21",
          "description": "Motherboard error|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER22",
          "description": "Memory SW Issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER23",
          "description": "Operating System Setting|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER24",
          "description": "USB HW Issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER25",
          "description": "USB SW Issue|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER26",
          "description": "Virus Found|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER27",
          "description": "Operating System Overloaded with Software|VFF|Slow Performance Issue Resolved|VFF|"
      },
      {
          "defectCode": "PER28",
          "description": "Other|OTH|Slow Performance Issue Resolved|CID|"
      }
  ]
},
{
  "predidcted_class": "Fan",
  "possible_defect_child": [
      {
          "defectCode": "FAN01",
          "description": "FAN|VFF|Fan Issue Resolved|VFF|"
      },
      {
          "defectCode": "FAN02",
          "description": "FAN FAILS SPEED TEST|VFF|Fan Issue Resolved|VFF|"
      },
      {
          "defectCode": "FAN03",
          "description": "FAN IS NOISY|VFF|Fan Issue Resolved|VFF|"
      },
      {
          "defectCode": "FAN04",
          "description": "Fan/vent clog issue|VFF|Fan Issue Resolved|VFF|"
      },
      {
          "defectCode": "FAN05",
          "description": "FAN WON'T SPIN|VFF|Fan Issue Resolved|VFF|"
      },
      {
          "defectCode": "FAN06",
          "description": "HEATSINK DEFECTIVE|VFF|Fan Issue Resolved|VFF|"
      },
      {
          "defectCode": "FAN07",
          "description": "Other|OTH|Fan Issue Resolved|CID|"
      }
  ]
}];



export let defectGroup = [
  {
    "Id": "No Power",
    "decription": "No Power"
  },
  {
    "Id": "Software",
    "decription": "Software"
  }
]

export var PredictionResponseDate = [
  {
    "title": "keypad",
    "probability": 0.01,
    "threshold": 0.969,
    "data": [
      {
        "PART_NUMBER": "K260C",
        "PART_DESCRIPTION": "CORD, PWR, 125V, 2.5A, 1M, C5, US"
      },
      {
        "PART_NUMBER": "H718C",
        "PART_DESCRIPTION": "CORD, PWR, 250V, 2.5A, 1M, C5, EUR"
      },
      {
        "PART_NUMBER": "X6M18",
        "PART_DESCRIPTION": "ASSY, CBL, FPRDR, FFC, 5482"
      },
      {
        "PART_NUMBER": "15YHC",
        "PART_DESCRIPTION": "ASSY, CBL, I/O, FFC, 5482"
      },
      {
        "PART_NUMBER": "J663C",
        "PART_DESCRIPTION": "CORD, PWR, 250V, 2.5V, 1M, C5, UK"
      },
      {
        "PART_NUMBER": "WJXD9",
        "PART_DESCRIPTION": "ASSY, CBL, HDD, CON, 5482"
      }
    ]
  },
  {
    "title": "cable",
    "probability": 0.009,
    "threshold": 0.925,
    "data": [
      {
        "PART_NUMBER": "K260C",
        "PART_DESCRIPTION": "CORD, PWR, 125V, 2.5A, 1M, C5, US"
      },
      {
        "PART_NUMBER": "H718C",
        "PART_DESCRIPTION": "CORD, PWR, 250V, 2.5A, 1M, C5, EUR"
      },
      {
        "PART_NUMBER": "X6M18",
        "PART_DESCRIPTION": "ASSY, CBL, FPRDR, FFC, 5482"
      },
      {
        "PART_NUMBER": "15YHC",
        "PART_DESCRIPTION": "ASSY, CBL, I/O, FFC, 5482"
      },
      {
        "PART_NUMBER": "J663C",
        "PART_DESCRIPTION": "CORD, PWR, 250V, 2.5V, 1M, C5, UK"
      },
      {
        "PART_NUMBER": "WJXD9",
        "PART_DESCRIPTION": "ASSY, CBL, HDD, CON, 5482"
      }
    ]
  },
  {
    "title": "display",
    "probability": 0.014,
    "threshold": 0.929,
    "data": [
      {
        "PART_NUMBER": "K260C",
        "PART_DESCRIPTION": "CORD, PWR, 125V, 2.5A, 1M, C5, US"
      },
      {
        "PART_NUMBER": "H718C",
        "PART_DESCRIPTION": "CORD, PWR, 250V, 2.5A, 1M, C5, EUR"
      },
      {
        "PART_NUMBER": "X6M18",
        "PART_DESCRIPTION": "ASSY, CBL, FPRDR, FFC, 5482"
      },
      {
        "PART_NUMBER": "15YHC",
        "PART_DESCRIPTION": "ASSY, CBL, I/O, FFC, 5482"
      },
      {
        "PART_NUMBER": "J663C",
        "PART_DESCRIPTION": "CORD, PWR, 250V, 2.5V, 1M, C5, UK"
      },
      {
        "PART_NUMBER": "WJXD9",
        "PART_DESCRIPTION": "ASSY, CBL, HDD, CON, 5482"
      }
    ]
  },
  {
    "title": "keypad",
    "probability": 0.01,
    "threshold": 0.969,
    "data": [
      {
        "PART_NUMBER": "K260C",
        "PART_DESCRIPTION": "CORD, PWR, 125V, 2.5A, 1M, C5, US"
      },
      {
        "PART_NUMBER": "H718C",
        "PART_DESCRIPTION": "CORD, PWR, 250V, 2.5A, 1M, C5, EUR"
      },
      {
        "PART_NUMBER": "X6M18",
        "PART_DESCRIPTION": "ASSY, CBL, FPRDR, FFC, 5482"
      },
      {
        "PART_NUMBER": "15YHC",
        "PART_DESCRIPTION": "ASSY, CBL, I/O, FFC, 5482"
      },
      {
        "PART_NUMBER": "J663C",
        "PART_DESCRIPTION": "CORD, PWR, 250V, 2.5V, 1M, C5, UK"
      },
      {
        "PART_NUMBER": "WJXD9",
        "PART_DESCRIPTION": "ASSY, CBL, HDD, CON, 5482"
      }
    ]
  },
  {
    "title": "cable",
    "probability": 0.009,
    "threshold": 0.925,
    "data": [
      {
        "PART_NUMBER": "K260C",
        "PART_DESCRIPTION": "CORD, PWR, 125V, 2.5A, 1M, C5, US"
      },
      {
        "PART_NUMBER": "H718C",
        "PART_DESCRIPTION": "CORD, PWR, 250V, 2.5A, 1M, C5, EUR"
      },
      {
        "PART_NUMBER": "X6M18",
        "PART_DESCRIPTION": "ASSY, CBL, FPRDR, FFC, 5482"
      },
      {
        "PART_NUMBER": "15YHC",
        "PART_DESCRIPTION": "ASSY, CBL, I/O, FFC, 5482"
      },
      {
        "PART_NUMBER": "J663C",
        "PART_DESCRIPTION": "CORD, PWR, 250V, 2.5V, 1M, C5, UK"
      },
      {
        "PART_NUMBER": "WJXD9",
        "PART_DESCRIPTION": "ASSY, CBL, HDD, CON, 5482"
      }
    ]
  },
  {
    "title": "display",
    "probability": 0.014,
    "threshold": 0.929,
    "data": [
      {
        "PART_NUMBER": "K260C",
        "PART_DESCRIPTION": "CORD, PWR, 125V, 2.5A, 1M, C5, US"
      },
      {
        "PART_NUMBER": "H718C",
        "PART_DESCRIPTION": "CORD, PWR, 250V, 2.5A, 1M, C5, EUR"
      },
      {
        "PART_NUMBER": "X6M18",
        "PART_DESCRIPTION": "ASSY, CBL, FPRDR, FFC, 5482"
      },
      {
        "PART_NUMBER": "15YHC",
        "PART_DESCRIPTION": "ASSY, CBL, I/O, FFC, 5482"
      },
      {
        "PART_NUMBER": "J663C",
        "PART_DESCRIPTION": "CORD, PWR, 250V, 2.5V, 1M, C5, UK"
      },
      {
        "PART_NUMBER": "WJXD9",
        "PART_DESCRIPTION": "ASSY, CBL, HDD, CON, 5482"
      }
    ]
  }
]

export let HPDependentScreen = {
  "ASSESSMENT": "ASSESSMENT",
  "DEBUG": "DEBUG",
  "QUOTE MESSAGE": "QUOTE MESSAGE"
}
// export const HP
export enum holdCodesEnum {
  holdSubCodeData = 'holdSubCodeData',
  holdBin = 'holdBin',
}

export enum dialogResultsEnum {
  success = 'success',
  close = 'close',
}

export const RETURN_TO_HOME_ACTIONS = (workCenterName) => [
  // Only for TimeOut operations to clear previously save data
  {
    type: 'clearAllContext',
    config: {
      clearType: 'delete',
      contexts: [workCenterName],
    },
  },
  { type: 'clearScreenData' },
  { type: 'renderTemplate', config: { templateId: 'dashboard.json', mode: 'local' } },
];

export const errorTitleAction = (errorMessage = 'Error occurred', titleUUID = 'errorTitleUUID') => ({
  type: 'updateComponent',
  config: {
    key: titleUUID,
    properties: {
      titleValue: errorMessage,
      isShown: true,
    },
  },
});

//Screens Which need save and exit use this object
export let Screens = {
  "DELL": {
    //slot1
      "ASSESSMENT":"ASSESSMENT",
      "ECN":"ECN",
      "DEBUG": "DEBUG",
      "DEBUG_ARC":"DEBUG_ARC",
      "L2_DEBUG":"L2_DEBUG",
      //slot2
      "QR (IMAGING)":"QR (IMAGING)",
      "OBA":"OBA",
      "FINAL TEST":"FINAL TEST",
      "REWORK": "REWORK",
      //slot3
      "PACKOUT":"PACKOUT",
      "ASSEMBLY":"ASSEMBLY",
      //slot4
      "VALIDATION": "VALIDATION",
      "VMI": "VMI",
      "PA": "PA",
      "ESTIMATE": "ESTIMATE",
      "EXT_TEST-(BURN IN)":"EXT_TEST-(BURN IN)",
      "GRIEF": "GRIEF",

      //dellcar screens
      "PACKING": "PACKING"
  },
  "DELLCAR":{
    "DEBUG": "DEBUG",
  },
  "HP": {
    //slot1
    "DISCREPANCY": "DISCREPANCY",
    "BURN_IN": "BURN_IN",
    "OBA": "OBA",
    "QUICK_RESTORE": "QUICK_RESTORE",
    //slot2
    "MB REPAIR": "MB REPAIR",
    "PACKING": "PACKING",
    "SHIPPING": "SHIPPING",
    //slot3
    "VFT": "VFT",
    "REWORK": "REWORK",
    "FA-ASSESSMENT": "FA-ASSESSMENT",
    //slot4
    "ASSESSMENT": "ASSESSMENT",
    "DEBUG": "DEBUG",
    "QUOTE MESSAGE": "QUOTE MESSAGE",
    "QUOTE RESPONSE": "QUOTE RESPONSE"

  }
}

//Clients Which need save and exit use this object
export let CLIENTNAMES = {
  "DELL": "DELL",
  "HP": "HP"
}

export const stopRequest: Array<string> = ['stopProcessClientReceiving'];

export enum DellMBRFlexFields {
  msgRead = 'msgRead',
}
/// Dell AIO workcenters.
/// Being used in handleGetLocationSpecificFFID method
export let DELLAIOWORKCENTERS = {
  "CONTRACTNAMES": {
    "DELL AIO": "DELL AIO",
  },
  "ROUTES": {
    "WRP": "WRP",
    "WRP3": "WRP3"
  }
};

/// The things that should be executed only in debug mode.
export let DELL_DEBUG_WC_NAMES = ["DEBUG", "DEBUG_ARC", "L2_DEBUG"];


/// Dell VMI bin related wc
/// This constants will have those clients which should the bin button
/// in the page level footer and work centers which should not have the button
export let DELL_BIN_BTN_CONFIGS = {
  "CONTRACTNAMES": {
    "DELL AIO": "DELL AIO",
    "GRIEF": "GRIEF",
  },
  "CLIENTNAME": {
    "DELL": "DELL"
  },
  "WC_NAMES": {
    "Grief": "Grief",
    "SHIPPING": "SHIPPING",
    "RECEIVING": "RECEIVING",
    "DELL_AIO_VMI": "DELL_AIO_VMI",
  },
  "ALLOW_EXIT_BTN": {
    "SHIPPING": "SHIPPING",
    "RECEIVING": "RECEIVING",
  },
  "SEARCH_TYPES": {
    "WC OPERATION": "WC OPERATION"
  }
};

/// It decides the container id of check accessory task panel 
export let CHECK_ACC_PANEL_CONTAINERS = {
  "DELL_AIO_FTEST": "prebodysectionone",
  "DELL_AIO_OBA": "prebodysectionone"
}

export let hpEtravellerFlexFieldData = [
  {
    "displayValue": 'Unit Details',
    "fileterValue": 'Unit Details',
   // "keysList": ["BCN", "Serial Number"],
  },
  {
    "displayValue": 'Receiving Flex Fields',
    "fileterValue": 'RECEIVING',
    //"keysList": ["AC Adapter SN", "Battery SN", "Other", "REC_HDD SERIAL", "REC_HDD SERIAL 2", "Accessory1", "Accessory2", "Accessory3", "Accessory4", "Accessory5", "BOX", "REC_RAM", "SN Mismatch", "DT", "REC_Customer Failure"],
  },
  {
    "displayValue": 'OPT: - "WRP" , Workcenter: - HP_VMI ',
    "fileterValue": 'HP_VMI',
    //"keysList": ["ARCToolPicture", "PREMIUM", "REREPAIR"],
  },
  {
    "displayValue": 'OPT: - "WRP" , Workcenter: - HP_DEBUG ',
    "fileterValue": 'HP_DEBUG',
   // "keysList": ["BSOD", "CT_DEB", "Customer Failure", "Customer Induced Damage", "Description Quality", "HDD SERIAL", "HDD SERIAL 2", "HDD SERIAL 3", "HDD SERIAL 4", "HOLD", "IDS_OF_ACCESSORIES", "MB_PN", "NTF information useful", "PREMIUM DONE", "RAM"],
  },
  {
    "displayValue": 'OPT: - "WRP" , Workcenter: - HP_REWORK ',
    "fileterValue": 'HP_REWORK',
   // "keysList": ["CT_REW", "Description Quality", "HDD SERIAL", "HDD SERIAL 2", "HDD SERIAL 3", "HDD SERIAL 4", "IDS_OF_ACCESSORIES", "MB_PN", "MODEL NR", "New IMEI", "Print label", "Product Nr", "RAM", "Serial Nr", "UNUSED_PARTS", "WRONG_PARTS"],
  },
  {
    "displayValue": 'OPT: - "WRP" , Workcenter: - HP_QUICK_RESTORE ',
    "fileterValue": 'HP_QUICK_RESTORE',
   // "keysList": ["IDS_OF_ACCESSORIES", "QR_REASON"],
  },
  {
    "displayValue": 'OPT: - "WRP" , Workcenter: - HP_BURN_IN ',
    "fileterValue": 'HP_BURN_IN',
   // "keysList": ["IDS_OF_ACCESSORIES"],
  },
  {
    "displayValue": 'OPT: - "WRP" , Workcenter: - HP_VISUAL_FINAL_TEST_RTV ',
    "fileterValue": 'HP_VISUAL_FINAL_TEST_RTV',
    //"keysList": ["Unit Damage"]
  },
  {
    "displayValue": 'OPT: - "WRP" , Workcenter: - HP_PACKOUT ',
    "fileterValue": 'HP_PACKOUT',
  //  "keysList": ["IDs_of_accessories"],
  },
  {
    "displayValue": 'OPT: - "WRP" , Workcenter: - HP_OBA ',
    "fileterValue": 'HP_OBA',
   // "keysList": ["FAULT_TYPE", "IDs_of_accessories", "Testing method", "Unit Damage", "Unit from"],
  },
  {
    "displayValue": 'OPT: - "WRP" , Workcenter: - HP_MB_REPAIR ',
    "fileterValue": 'HP_MB_REPAIR',
 //   "keysList": ["MB CT number", "MB PN", "REPAIR MARKS ON MB BEFORE RL REPAIR", "Repair marks on MB"],
  },
  {
    "displayValue": 'OPT: - "WRP" , Workcenter: - HP_FAILURE_ANALYSIS ',
    "fileterValue": 'HP_FAILURE_ANALYSIS',
  //  "keysList": ["BSOD", "CT_DEB", "CUSTOMER FAILURE", "Customer Induced Damage", "FAULT_TYPE", "HDD SERIAL", "HDD SERIAL 2", "HDD SERIAL 3", "HDD SERIAL 4", "Part_approve", "RAM", "RER_CODE"]
  }
]
export let hpEtravellerParts = [
  {
    "label": "Requsition",
    "dataSource": "getETravellerUniqueRequisitionHistory",
    "columnsToDisplay": ["action", "requisitionId", "orderStatusName", "createdDate", "userId" ],
    "columnHeader": [" ", "Requisition ID", "Order Status", "Created Date", "User ID"],
    "subTable": "getPartDetailsByRequsition",
    "getAllRequsitionDataSource": "getETravellerAllRequisitionHistory",
    "innercolumnHeader": ["Line No", "Part Number", "Description", "Order qty","Status"],
    "innerDisplayedColumns": ["outboundOrderLineId", "partNo", "partDesc", "qty","orderStatusName"]
  },
  {
    "label": "Issued",
    "dataSource": "getETravellerIssuedPartsDetailsRequest",
    "columnHeader": [ "No.","Part Number", "Serial Number","Part Status", "Date/Time", "Defect", "Action","Part rep Reason"],
    "columnsToDisplay": ["No", "partNo","serialNumber", "partStatus", "createdTimeStapm", "defectCodeName", "actionCodeName", "partRepReason"]
  },
  {
    "label": "UnIssued",
    "dataSource": "getETravellerAllUndoissueHistory",
    "columnHeader": ["No.","Part Number", "Serial Number","Date/Time"],
    "columnsToDisplay": ["No","issuedRemovedPartno", "itemSerialNo", "timestamp"]
  },
  {
    "label": "Return To Stock",
    "dataSource": "getETravellerPartsReturnedToStock",
    "columnHeader": ["No.","Part Number","Date/Time"],
    "columnsToDisplay": ["No","partNo","createdTimeStamp"],
  },
  {
    "label": "Removed",
    "dataSource": "getETravellerRemovedPartsDetails",
    "columnHeader": ["No.", "Part Number","Serial Number", "Part Status","Date/Time", "Defect", "Action"],
    "columnsToDisplay": ["No","partNo","serialNumber", "partStatus","createdTimeStapm", "defectCodeName", "actionCodeName"]
  }
]
export let hpEtravellerRepository = [
  {
    "label": "Prints",
    "dataSource": "getetravellerRepositaryPrintsdata", 
    "columnsToDisplay": ['printReportName', 'parameterDefaultValue', 'Action'],
    "columnHeader": ['Print Template', 'Details','Action'],
  },
  // { "label": "Images",
  //  "dataSource": "getetravellerRepositaryImagesdata" ,
  // "columnsToDisplay": ['TimeDate', 'SubProcess', 'Details', 'URL','Action'],
  // "columnHeader": ['Time & Date', 'Sub Process', 'Details', 'URL','Action'],
  // },
  // { "label": "Videos",
  // "dataSource": "getetravellerRepositaryVideosdata" ,
  // "columnsToDisplay": ['TimeDate', 'SubProcess', 'Details', 'URL','Action'],
  // "columnHeader": ['Time & Date', 'Sub Process', 'Details', 'URL','Action'],
  // }
  // { "label": "Barcodes",
  //   "dataSource": "" 
  // },
  // { "label": "External Links",
  //   "dataSource": "" 
  // }
]

export let dellReceivingToteColorMessage = {
  "DRRMessage" : "Place unit in Orange Tote",
  "LOBMessage" : "Place unit in Blue Tote",
  "SLAMessageSBD" : "Place unit in Red Tote",
  "SLAMessageNBD" : "Place unit in Yellow Tote",
  "SLAMessage2BD" : "Place unit in White Tote"
}