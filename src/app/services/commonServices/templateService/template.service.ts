import { Injectable } from '@angular/core';

//@services
import { ContextService } from '../contextService/context.service';
import { MetadataService } from '../metadataService/metadata.service';
import { ComponentLoaderService } from '../component-loader/component-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
	providedIn: 'root'
})

//@class component
export class TemplateService {
	constructor(
		private contextService: ContextService,
		private metadataService: MetadataService,
		private componentLoaderService: ComponentLoaderService,
		private _snackBar: MatSnackBar,
	) { }

	handleRenderTemplate(action, actionService) {
		if (action && action.config) {
			if (action.config.mode === 'local') {
				const baseContainerRef = this.contextService.getDataByKey('baseContainerRef');

				/// clear the existing container ref
				baseContainerRef.clear();

				if (action.config.clearContext !== undefined && action.config.clearContext) {
					/// clearing the context;
					this.contextService.deleteContext();

					/// clear the snackbar
					this._snackBar.dismiss();

					/// Adding back baseContainerRef to context, as base component is not called again
					this.contextService.addToContext('baseContainerRef', baseContainerRef);
				}

				this.metadataService
					.getLocal('./assets/' + action.config.templateId)
					.subscribe(
						(data) => {
							this.componentLoaderService.parseData(data, baseContainerRef);
							this.contextService.isDataRefreshed.next(true);
						},
						(error) => { console.log(error); }
					);
			} else if (action.config.mode === 'remote') {
				const refData = this.contextService.getDataByKey(action.config.targetId);

				/// clear the existing container ref
				refData.clear();

				let templateData = this.contextService.getDataByKey(action.config.templateId);

				if (!templateData.hasOwnProperty('ctype')) {
					templateData = JSON.parse(templateData);
				}
				if (action.config.targetUUID == "contentRenderer1") {
					let saveddata = this.contextService.getDataByKey("getJsonReponse");
					let WC = this.contextService.getDataByKey("currentWC");
					let ScreenMenuObj = this.contextService.getDataByKey("ScreenMenuObj");
					let discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
					if (saveddata && saveddata.length) {
						saveddata.map((currentData) => {
							let keys = Object.keys(currentData);
							keys.map((key) => {
								//condtion used to update ECO'S based on S&E data which is using in HP so added as HP , now providing slot wise S&E so Provided WC condition 
								if ((discrepancyUnitInfo && discrepancyUnitInfo.CLIENTNAME == "HP") || (discrepancyUnitInfo && discrepancyUnitInfo.CLIENTNAME == "DELL" && WC == "ECN")) {
									if (ScreenMenuObj && ScreenMenuObj.name && ScreenMenuObj.name.toLowerCase() === key.toLowerCase() && ScreenMenuObj.isVisited == false) {
										let currentWcDataList = currentData[key];
										currentWcDataList = JSON.parse(currentWcDataList)
										currentWcDataList.map((data) => {
											templateData.items.map((eachItem) => {
												if (data.key == eachItem.uuid) {
													eachItem.disabled = data.value.disabled
													eachItem.expanded = data.value.expanded
													if (data && data.value && data.value.header != undefined && data.value.header != null) {
														eachItem.header = data.value.header
													}
													eachItem.footer.map((eachItem1) => {
														eachItem1.disabled = !data.value.expanded
													})
												}

											})

										})
									}
								}
							})
						})
					}
					this.componentLoaderService.parseData(templateData, refData);

				} else {
					this.componentLoaderService.parseData(templateData, refData);

				}

				const dashboardRefScope = this.contextService.getDataByKey('dashboardPageUUIDref');

				if (dashboardRefScope) {
					dashboardRefScope.instance._changeDetectionRef.detectChanges();
				}

				if (refData || (refData !== undefined)) {
					if (refData.instance) {
						refData.instance._changeDetectionRef.detectChanges();
					} else if (action.config.targetUUID != undefined && action.config.targetUUID != null) {
						this.contextService.getDataByKey(`${action.config.targetUUID}ref`).instance._changeDetectionRef.detectChanges();
					} else {
						//do nothing
					}
				}
			}

			// need for IQA prescreen(flexfields).
			if (actionService) {
				actionService.customTempArray = [];
			}
		}
	}

	//@ clear the existing container ref
	removeTemplate(action) {
		this.contextService.getDataByKey(action.config.targetId).clear();
	}
		//incrementing the no of the receiving video count
	//If the maximum number of receiving video count reaches then receivingVideoCount resetted as zero
	handleReceivingVideoCount(action, instance, actionService) {
		let recvVideoCount = parseInt(sessionStorage.getItem(action.config.recevingVideoSuccessCnt)) || 0;
		if (recvVideoCount &&  recvVideoCount >= action.config.recevingVideoMaxCnt) {
		  sessionStorage.setItem(action.config.recevingVideoSuccessCnt, "1");
		}
		else if (recvVideoCount != undefined) {
			recvVideoCount = recvVideoCount + 1;
			let recvVideoCountString = (recvVideoCount).toString();
			sessionStorage.setItem(action.config.recevingVideoSuccessCnt, recvVideoCountString);
		  }
	}

	//checking the maximum number of receiving video count
	//if the receiving video count reaches the maximum then reloading the browser
	handleReroutingReceivingPage(action, instance, actionService) {
		let  receivingVideoCount = parseInt(sessionStorage.getItem(action.config.recevingVideoSuccessCnt));
		if (receivingVideoCount &&  receivingVideoCount >= action.config.recevingVideoMaxCnt) {
			// will Refresh the browser
			window.location.reload();
		}
		else {
          let renderTemplate = {
		  "type": "renderTemplate",
		  "config": {
			"templateId": "dashboard.json",
			"mode": 'local',
		  },
		  "eventSource": "click"
		}
		actionService.handleAction(renderTemplate, this);
		}
	}
}
