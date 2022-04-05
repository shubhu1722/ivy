//@angular components
import { Injectable } from '@angular/core';

//@external components
import { cloneDeep } from 'lodash';

//@custom services
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
	providedIn: 'root'
})

//@class component
export class VFTService {
	constructor(
		private contextService: ContextService
	) { }

	handleVFTServices(action, instance, scope, responseData) {
		//clones into new const variable
		const config = cloneDeep(action.config);

		switch (config.type) {
			case 'clearVFTExit':
				this.clearVFTExit(scope, instance);
				break;

			case 'vftOccuranceFilter':
				this.vftOccuranceFilter(scope, instance);
				break;

			case 'commonRTVPrintService':
				this.commonRTVPrintService(scope, instance);
				break;

			case 'checkDamageCompleteFurtherAction':
				this.onCheckDamageCompleteFurtherAction(scope, instance);
				break;

			case 'vftResultCodePrefill':
				this.vftResultCodePrefill(config, scope, instance);
				break;
			case 'activateNextTask':
				this.activateNextTask(config, scope, instance);
				break;
			case 'removedDynamicTaskPanelsLength' :
			     this.checkRemovedDynamicTaskPanelsLength(config,scope);
				 break;

			default:
				break;
		}
	}

	clearVFTExit(scope, instance) {
		const templates = [{
			"type": "clearAllContext",
			"config": {
				"clearType": "delete",
				"contexts": [
					"vftParts",
					"errorMsg",
					"rtvStatus",
					"viewImages",
					"removePrtTxt",
					"timeoutNotes",
					"getFFbyWCResp",
					"hpVFTHoldNext",
					"holdDialogData",
					"occurenceList",
					"defectCodeList",
					"removeCondition",
					"assemblyCodeList",
					"CDDFormSavedData",
					"nonFilterVftParts",
					"allVftPartsRemoved",
					"viewImageUrlObject",
					"noRemoveOperation",
					"removedPartNoValues",
					"SelectedVFTResultCode",
					"dynamicTaskPanellength",
					"initiateOBAImageLoadReq",
					"PreSelectedVFTResultCode",
					"resultCodesForDiscrepancy",
					"additionalUnitDamageValues",
					"timeinError",
					"quoteMessageTriggerHold",
					"moveinventoryForDiscrepancy",
					"holdCodesForDiscrepancy",
					"storageHoldSubCode",
					"tempVftParts",
					"finalNotes",
					"vftData",
					"performTimeoutData",
					"dynamicComponentlength",

					"holdTypeUUIDref",
					"hpVFTUUIDref",
					"doneUUIDref",
					"hpVFTSaveUUIDref",
					"holdNodeUUIDref",
					"hpVFTResultCodesUUIDref",
					"doneHoldUUIDref",
					"hpVFTTimeoutUUIDref",
					"timeoutAddNoteUUIDref",
					"cancelTimeOutUUIDref",
					"doneTimeOutUUIDref",
					"hpVFTAddNoteUUIDref",
					"addNoteDialogUUIDref",
					"addNoteUUIDref",

					"hpVFTPageUUIDref",
					"cancelHoldUUIDref",
					"doneaddnoteUUIDref",
					"hpVFTResumeUUIDref",
					"emptySpaceUUIDref",
					"hpVFTPauseUUIDref",
					"pauseDialogUUIDref",
					"pageopenUUIDref",
					"viewImageUUIDref",
					"damageDescUUIDref",
					"errorTitleUUIDref",
					"closeButtonUUIDref",
					"dynamicTaskUUIDref",
					"successTitleUUIDref",
					"subProcessTitleUUIDref",
					"checkDamagePanelUUIDref",
					"confirmationTitleUUIDref",
					"confirmationDialogUUIDref",
					"additionalUnitDamageUUIDref",
					"checkDamageCompleteBtnUUIDref"
				],
				"clearDataLength": "#vftParts.length",
				"dynamicContexts": [
					"IQTicks#@",
					"ctPartNo#@",
					"receiptId#@",
					"actionData#@",
					"removePartNo#@",
					"headerStatus#@",
					"productClass#@",
					"statusDropdown#@",
					"ctPartAssemblyNo#@",
					"tempRemovePartNo#@",
					"isPartPresentResp#@",
					"tempStatusDropdown#@",

					"removeNumberArray#@",
					"receiptIdUUID#@ref",
					"newPartTxtUUID#@ref",
					"removeresetUUID#@ref",
					"serailNumTxtUUID#@ref",
					"dynamicPanelUUID#@ref",
					"removedPartDDUUID#@ref",
					"ctGenerateBtnUUID#@ref",
					"removedPartTxtUUID#@ref",
					"statusDropdownUUID#@ref",
					"removeCompleteBtnUUID#@ref",
					"removeDummyCompleteBtnUUID#@ref"
				]
			}
		},
		{
			"type": "clearScreenData"
		},
		{
			"type": "renderTemplate",
			"config": {
				"templateId": "dashboard.json",
				"mode": "local"
			}
		}];

		templates.forEach((element) => {
			scope.handleAction(element, instance);
		});
	}

	commonRTVPrintService(scope, instance) {
		scope.handleAction({
			"type": "handleCommonServices",
			"config": {
				"type": "onePrintService",
				"eventName": "BYD_GN_COMM_RTV",
				"onSuccessActions": [
					{
						"type": "handleVFTServices",
						"config": {
							"type": "clearVFTExit"
						}
					}
				],
				"onFailureActions": [

					{
						"type": "handleCommonServices",
						"config": {
							"type": "errorRenderTemplate",
							"contextKey": "errorMsg",
							"updateKey": "errorTitleUUID"
						}
					},
					{
						"type": "context",
						"config": {
							"requestMethod": "addToGlobalContext",
							"key": "isOnePrintAPIFailed",
							"data": true
						}
					}
				]
			}
		}, instance);
	}

	uniquePartNostxtType(action, actionService) {
		if (action && action.config) {
			const config = action.config;
			let data: any = actionService.getContextorNormalData(config.data, []);

			if (data && data.length > 0) {
				const obj = {};
				let isRemoved = false, tempContextData = [], contextData = [], isAllRemoved = true, isIssuedExpanded = false;

				data.forEach((r) => {
					if (!obj[r.actionId]) {
						let filterData = data.filter(val => ((val.transactionType === "Removed") && (val.actionId === r.actionId)));

						if (filterData && filterData.length > 0) {
							isRemoved = true;
							obj[r.actionId] = filterData[0];
						} else {
							obj[r.actionId] = r;
						}
					} else {
						//do nothing
					}
				});

				Object.keys(obj).forEach((key) => {
					tempContextData.push(obj[key]);

					if (obj[key].partStatus !== "NO RTV PART") {
						if (obj[key].transactionType === "Issued") {
							isAllRemoved = false;
						}

						contextData.push(obj[key]);
					}
				});

				if (!isRemoved) {
					this.contextService.addToContext(config.removeKey, false);
				} else if (isAllRemoved && config.removeKey) {
					this.contextService.addToContext(config.removeKey, true);
				} else {
					//do nothing
				}

				contextData = contextData.map((r) => {
					let dataObj = { ...r };

					if (isRemoved && (r.transactionType === "Issued") && !isIssuedExpanded) {
						dataObj.isIssuedExpanded = true;
						isIssuedExpanded = true;
					}

					return dataObj;
				});

				if (!isRemoved) {
					this.contextService.addToContext("noRemoveOperation", true);
				} else {
					this.contextService.deleteDataByKey("noRemoveOperation");
				}

				this.contextService.addToContext(config.tempKey, tempContextData);
				this.contextService.addToContext(config.key, contextData);
			}
		}
	}

	/*
     Checks the removed dynamic taskpanel length 
	*/
	checkRemovedDynamicTaskPanelsLength(action, actionService) {
		if (action && action.config) {
			const config = action.config;
			let data: any = this.contextService.getDataByKey(config.data);
			let filterData;

			if (data && data.length > 0) {

				filterData = data.filter(val => ((val.transactionType === "Removed") || (val.actionId === config.actionId)));
				this.contextService.addToContext(config.key, filterData.length);
			}
		}
	}
	onVftDefectTextFieldAction(action,actionService) {
		if (action.config != undefined &&
			action.config.updateCheckDamangeBtn != undefined &&
			action.config.updateCheckDamangeBtn) {
			let damageDescRef = this.contextService.getDataByKey(action.config.key +"ref");
			if (damageDescRef.instance.group.controls.damageDesc.status == "VALID") {
				this.contextService.addToContext(action.config.keyToBeUpdated,false)
			} else if(damageDescRef.instance.group.controls.damageDesc.status == "INVALID"){
				this.contextService.addToContext(action.config.keyToBeUpdated, true)
			}
		}
		else {
			let isButtonDisable = this.contextService.getDataByKey("isCheckDamangeBtnStatus");
			if (isButtonDisable !== undefined) {
				let buttonHandle = {
					"type": "updateComponent",
					"config": {
						"key": "checkDamageCompleteBtnUUID",
						"properties": {
							"disabled": isButtonDisable
						}
					}
				}
				actionService.handleAction(buttonHandle, this);
			}
		}
		

	}

	onCheckDamageCompleteFurtherAction(scope, instance) {
		const templates = [

			{
				"type": "updateComponent",
				"config": {
					"key": "damageDescUUID",
					"properties": {
						"required": false
					}
				}
			},
			{
				"type": "updateComponent",
				"eventSource": "click",
				"config": {
					"key": "checkDamageCompleteBtnUUID",
					"properties": {
						"disabled": true
					}
				}
			},
			{
				"type": "context",
				"config": {
					"requestMethod": "add",
					"key": "isCheckDamageCompleted",
					"data": true
				},
				"eventSource": "click"
			},
			{
				"type": "multipleCondition",
				"config": {
					"multi": true,
					"operator": "OR",
					"conditions": [
						{
							"operation": "isNotValid",
							"lhs": "#vftParts"
						},
						{
							"operation": "isEqualTo",
							"lhs": "#vftParts.length",
							"rhs": 0
						},
						{
							"operation": "isEqualTo",
							"lhs": "Yes",
							"rhs": "#additionalUnitDamageVal"
						}
					]
				},
				"eventSource": "click",
				"responseDependents": {
					"onSuccess": {
						"actions": [
							{
								"type": "updateComponent",
								"eventSource": "click",
								"config": {
									"key": "checkDamagePanelUUID",
									"properties": {
										"expanded": false,
										"header": {
											"title": "Check Damage",
											"icon": "description",
											"statusIcon": "check_circle",
											"statusClass": "complete-status"
										}
									}
								}
							},
							{
								"type": "updateDynamicAllPanels",
								"eventSource": "click",
								"config": {
									"data": "#vftParts",
									"actions": {
										"type": "updateComponent",
										"config": {
											"key": "dynamicPanelUUID#@",
											"properties": {
												"disabled": true,
												"expanded": false
											}
										}
									}
								}
							},
							{
								"type": "enableComponent",
								"eventSource": "click",
								"config": {
									"key": "hpVFTResultCodesUUID",
									"property": "ResultCodes",
									"isNotReset": true
								}
							},
							{
								"type": "handleVFTServices",
								"config": {
									"type": "vftResultCodePrefill",
									"actionCode": 34
								}
							},
							{
								"type": "multipleCondition",
								"config": {
									"operation": "isValid",
									"lhs": "#SelectedVFTResultCode"
								},
								"eventSource": "click",
								"responseDependents": {
									"onSuccess": {
										"actions": [
											{
												"type": "updateComponent",
												"config": {
													"key": "hpVFTTimeoutUUID",
													"properties": {
														"disabled": false
													}
												},
												"eventSource": "click"
											}
										]
									},
									"onFailure": {
										"actions": [
											{
												"type": "updateComponent",
												"config": {
													"key": "hpVFTTimeoutUUID",
													"properties": {
														"disabled": true
													}
												},
												"eventSource": "click"
											}
										]
									}
								}
							}
						]
					},
					"onFailure": {
						"actions": [
							{
								"type": "updateComponent",
								"eventSource": "click",
								"config": {
									"key": "checkDamagePanelUUID",
									"properties": {
										"expanded": true
									}
								}
							},
							{
								"type": "multipleCondition",
								"config": {
									"operation": "isValid",
									"lhs": "#allVftPartsRemoved"
								},
								"responseDependents": {
									"onSuccess": {
										"actions": [
											{
												"type": "enableComponent",
												"config": {
													"key": "hpVFTResultCodesUUID",
													"property": "ResultCodes",
													"isNotReset": true
												}
											},
											{
												"type": "handleVFTServices",
												"config": {
													"type": "vftResultCodePrefill",
													"actionCode": 34
												}
											},
											{
												"type": "multipleCondition",
												"config": {
													"operation": "isValid",
													"lhs": "#SelectedVFTResultCode"
												},
												"eventSource": "click",
												"responseDependents": {
													"onSuccess": {
														"actions": [
															{
																"type": "updateComponent",
																"config": {
																	"key": "hpVFTTimeoutUUID",
																	"properties": {
																		"disabled": false
																	}
																}
															}
														]
													},
													"onFailure": {
														"actions": [
															{
																"type": "updateComponent",
																"config": {
																	"key": "hpVFTTimeoutUUID",
																	"properties": {
																		"disabled": true
																	}
																}
															}
														]
													}
												}
											}
										]
									},
									"onFailure": {
										"actions": [

											{
												"type": "updateComponent",
												"config": {
													"key": "hpVFTResultCodesUUID",
													"properties": {
														"disabled": true
													}
												}
											},
											{
												"type": "updateComponent",
												"config": {
													"key": "hpVFTTimeoutUUID",
													"properties": {
														"disabled": true
													}
												}
											}
										]
									}
								}
							},
							{
								"type": "updateComponent",
								"eventSource": "click",
								"config": {
									"key": "checkDamagePanelUUID",
									"properties": {
										"expanded": false,
										"header": {
											"title": "Check Damage",
											"icon": "description",
											"statusIcon": "check_circle",
											"statusClass": "complete-status"
										}
									}
								}
							},
							{
								"type": "multipleCondition",
								"eventSource": "click",
								"config": {
									"operation": "isValid",
									"lhs": "#noRemoveOperation"
								},
								"responseDependents": {
									"onSuccess": {
										"actions": [
											{
												"type": "updateComponent",
												"eventSource": "click",
												"config": {
													"key": "dynamicPanelUUID0",
													"properties": {
														"expanded": true,
														"disabled": false
													}
												}
											}
										]
									},
									"onFailure": {
										"actions": [
											{
												"type": "updateDynamicAllPanels",
												"eventSource": "click",
												"config": {
													"data": "#vftParts",
													"actions": {
														"type": "multipleCondition",
														"config": {
															"operation": "isEqualTo",
															"lhs": "#_transactionType",
															"rhs": "Removed"
														},
														"responseDependents": {
															"onSuccess": {
																"actions": [
																	{
																		"type": "updateComponent",
																		"config": {
																			"key": "dynamicPanelUUID#@",
																			"properties": {
																				"expanded": true
																			}
																		}
																	},
																	{
																		"type": "updateComponent",
																		"config": {
																			"key": "dynamicPanelUUID#@",
																			"properties": {
																				"expanded": false,
																				"disabled": false,
																				"header": {
																					"title": "Remove - #_assemblyCodeName",
																					"icon": "description",
																					"status": "#headerStatus#@",
																					"statusIcon": "check_circle",
																					"statusClass": "complete-status"
																				}
																			}
																		}
																	}
																]
															},
															"onFailure": {
																"actions": [
																	{
																		"type": "updateComponent",
																		"config": {
																			"key": "dynamicPanelUUID#@",
																			"properties": {
																				"disabled": true
																			}
																		}
																	},
																	{
																		"type": "multipleCondition",
																		"config": {
																			"operation": "isValid",
																			"lhs": "#_isIssuedExpanded"
																		},
																		"responseDependents": {
																			"onSuccess": {
																				"actions": [
																					{
																						"type": "updateComponent",
																						"config": {
																							"key": "dynamicPanelUUID#@",
																							"properties": {
																								"expanded": true,
																								"disabled": false
																							}
																						}
																					}
																				]
																			},
																			"onFailure": {
																				"actions": []
																			}
																		}
																	}
																]
															}
														}
													}
												}
											}
										]
									}
								}
							}
						]
					}
				}
			}
		];

		templates.forEach((element) => {
			scope.handleAction(element, instance);
		});
	}

	vftOccuranceFilter(scope, instance) {
		let getHPFAHistoryData = this.contextService.getDataByKey("getHPFAHistoryResp") || [];
		let occuranceData;
		let indexValue = 0;

		let clearDefAndAssemLists = [
			{
				"type": "context",
				"config": {
					"requestMethod": "add",
					"key": "occurenceList",
					"data": []
				},
				"eventSource": "click"
			},
			{
				"type": "context",
				"config": {
					"requestMethod": "add",
					"key": "defectCodeList",
					"data": []
				},
				"eventSource": "click"
			},
			{
				"type": "context",
				"config": {
					"requestMethod": "add",
					"key": "assemblyCodeList",
					"data": []
				},
				"eventSource": "click"
			}];

		clearDefAndAssemLists.forEach((currentItem) => {
			scope.handleAction(currentItem, instance);
		});

		getHPFAHistoryData && getHPFAHistoryData.length && getHPFAHistoryData.sort((a, b) => a.ACTIONID.localeCompare(b.ACTIONID));
		getHPFAHistoryData.length && getHPFAHistoryData.sort((a, b) => a.ACTIONID.localeCompare(b.ACTIONID)).map((item) => {
			let bool = false;

			let conditionalData = this.contextService.getDataByKey("nonFilterVftParts");

			if (conditionalData && conditionalData.length > 0) {
				let record = conditionalData.find((value) => (value["actionId"] === item["ACTIONID"]));

				if (record && record["partStatus"] && (record["partStatus"] === "NO RTV PART")) {
					bool = true;
				}
			}

			occuranceData = [{
				"type": "context",
				"config": {
					"requestMethod": "addToExistingContext",
					"target": "defectCodeList",
					"sourceData": {
						"defectCode": item.DEFECT_CODE_NAME
					}
				}
			},
			{
				"type": "context",
				"config": {
					"requestMethod": "addToExistingContext",
					"target": "assemblyCodeList",
					"sourceData": {
						"assemblyCode": item.ASSEMBLY_CODE_NAME
					}
				}
			},

			]

			if (!bool && (item.ACTION_CODE_NAME == "29" || item.ACTION_CODE_NAME == "77")) {
				let occ = {
					"type": "addOccurenceToContext",
					"hookType": "afterInit",
					"config": {
						"target": "occurenceList",
						"taskUuid": "dynamicPanelUUID" + indexValue,
						"currentDefectCode": item.DEFECT_CODE_NAME,
						"currentAssemblyCode": item.ASSEMBLY_CODE_NAME
					}
				}
				indexValue++
				occuranceData.push(occ)
			} else {
				let occ = {
					"type": "addOccurenceToContext",
					"hookType": "afterInit",
					"config": {
						"target": "occurenceList",
						"taskUuid": "",
						"currentDefectCode": item.DEFECT_CODE_NAME,
						"currentAssemblyCode": item.ASSEMBLY_CODE_NAME
					}
				}
				occuranceData.push(occ)
			}
			occuranceData.forEach((ele) => {
				scope.handleAction(ele, instance);
			});
		});
	}

	vftAutoCompletefocusDetails(title) {
		let unitinfo = this.contextService.getDataByString("#discrepancyUnitInfo")
		if (unitinfo && unitinfo.WORKCENTER == "HP_VISUAL_FINAL_TEST_RTV" && unitinfo.CLIENTNAME == "HP") {
			let assemblyCodeName = this.contextService.getDataByString("#_assemblyCodeName");
			let titleArray = ["Battery", "Keyboard", "Memory", "RAW Panel", "SSD", "HDD"];
			let titleStr = title.replace("Remove - ", "");
			if (titleStr) {
				if (titleArray.includes(titleStr)) {
					console.log(title);
					return false;
				} else {
					return true;
				}
			}
		} else {
			return true;
		}
	}

	vftResultCodePrefill(config, scope, instance) {
		let prefillActions = [];
		let hpfaHistoryData = this.contextService.getDataByKey("getHPFAHistoryResp") || [];
		let checkDamageValue = this.contextService.getDataByKey("additionalUnitDamageVal") || "";
		let actionCode = config.actionCode;

		if (actionCode) {
			let ResultCodeValue = "";

			if (checkDamageValue == "Yes") {
				ResultCodeValue = "FAIL";
			} else {
				ResultCodeValue = "PASS";
			}


			hpfaHistoryData.forEach(ele => {
				if (ele.ACTION_CODE_NAME == actionCode) {
					ResultCodeValue = "RWR";
				}
			});

			prefillActions = [
				{
					"type": "updateComponent",
					"config": {
						"key": "hpVFTResultCodesUUID",
						"fieldProperties": {
							"ResultCodes": ResultCodeValue
						}
					}
				},
				{
					"type": "context",
					"config": {
						"requestMethod": "add",
						"key": "SelectedVFTResultCode",
						"data": ResultCodeValue
					}
				}
			];
		}

		//Executing Actions
		prefillActions.forEach((element) => {
			scope.handleAction(element, instance);
		});
	}
	activateNextTask(config, scope, instance) {
		if(config && config.config) {
			let keyIndex;

			const vftParts = this.contextService.getDataByKey("vftParts");

			vftParts.forEach((rec, index) => {
				if ((keyIndex === undefined) && (rec.transactionType === "Issued")) {
					keyIndex = index;
				}
			});

			const templates = [
				{
					"type": "updateComponent",
					"config": {
						"key": `dynamicPanelUUID${keyIndex || config.config.nextIndex}`,
						"properties": {
							"expanded": true,
							"disabled": false
						}
					}
				}
			];

			templates.forEach((element) => {
				scope.handleAction(element, instance);
			});
		}
	}

}