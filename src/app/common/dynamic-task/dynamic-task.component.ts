//@ ***** Usage ****
// Creation of the dynamic component (automation)
//@ index -> indicates -> "#@"
//@ rec of key -> indicates -> for mapping => "#_"
import { Input, OnInit, Component, ViewChild, AfterViewInit,ChangeDetectorRef, ViewContainerRef,ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

//@custom components
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';

//@utilty
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { ActionService } from 'src/app/services/action/action.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
@Component({
	selector: 'app-dynamic-task',
	templateUrl: './dynamic-task.component.html',
	styleUrls: ['./dynamic-task.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.Emulated,
})

//@class component
export class DynamicTaskComponent implements OnInit, AfterViewInit {
	//@property decorator
	@ViewChild('dynamictask', { static: true, read: ViewContainerRef }) dynamictask: ViewContainerRef;

	//@inputs
	@Input() data: any;
	@Input() hooks: any;
	@Input() config: any;
	@Input() firstPanelExpand: any = true;

	hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

	constructor(
		private hookService: HookService,
		private contextService: ContextService,
		private utilityService: UtilityService,
		private actionService: ActionService,
		private _changeDetectionRef: ChangeDetectorRef,
		private componentLoaderService: ComponentLoaderService
	) { }

	ngOnInit(): void {
		let data: any;

		//@initializing the data
		if (Array.isArray(this.data)) {
			data = this.data || [];
		} else if (this.utilityService.isString(this.data) && (this.data.startsWith('#'))) {
			data = (this.contextService.getDataByString(this.data) || []);
		} else {
			data = [];
		}

		if (this.config.filterValue && this.config.filterValue.length) {
			let arr = [];

			data && data.length && data.forEach((item) => {
				this.config.filterValue.forEach((ele) => {
					if (ele == item.ACTION_CODE_NAME) {
						arr.push(item);
					}

				})
				arr.sort((a, b) => a.ACTIONID.localeCompare(b.ACTIONID));
				data = arr;
			});
		}
		if (this.config && this.config.thresholdValue) {
			let arr = [];
			data && data.length && data.forEach((item) => {
					if (item.threshold >=  this.config.thresholdValue ) {
						arr.push(item);
					}
			});
			if(arr.length == 0){
				this.actionService.handleAction(
				{
					"type": "updateComponent",
					"config": {
					  "key": "dailogTableTitleUUID",
					  "properties": {
						"titleValue": "No Parts Returned By Predictive Repair",
						"isShown": true
					  }
					}
				  }, this)
			}
			arr.sort((a, b) => {
				if (b.probability < a.probability)
					return -1;
				if (b.probability > a.probability)
					return 1;
				return 0;
			});
			data = arr;
			this.contextService.addToContext("tableCompleteData",data)
		}

		// let firstTaskExpand = this.firstTaskExpand == false ? this.firstTaskExpand : true;
		this.contextService.addToContext('dynamicTaskPanellength', data.length);

		//@If all satisfies
		if (data && data.length > 0) {
			this.contextService.addToContext('dynamicComponentlength', true);

			//@loop through each item to create the given component
			data.length && data.forEach((rec, i) => {
				let config: any = this.config;

				//@If task panel component
				//@Index 0 -> should expand | Index 1 to 1+ -> should collapse
				if ((config["ctype"] && config["ctype"].toLowerCase()) === "taskpanel") {
					if (config.disableTaskPanel) {
						config.disabled = ((i === 0) ? false : true);
					} 
					
					config.expanded = ((this.firstPanelExpand && (i === 0)) ? true : false);
				}

				//@obj -> string convertion
				config = JSON.stringify(config);

				for (let k = 0; k <= data.length; k++) {
					let regex = `#@${k}`;

					config = config.replace(new RegExp(regex, "g"), (i + k));
				}

				//@index automation
				config = config.replace(/#@/g, i);

				rec && Object.keys(rec).forEach((key) => {
					const regex: any = `#_${key}`;
					config = config.replace(new RegExp(regex, "g"), (rec[key] || ""));
				});

				config = JSON.parse(config);
				config["targetData"]=rec;
				//@component loader on the property decorator
				this.componentLoaderService.parseData(config, this.dynamictask);
			});
		} else {
			this.contextService.addToContext('dynamicComponentlength', false)

		}
	}

	//@AfterViewInit
	ngAfterViewInit() {
		if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
			const afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[3]);
			if (afterInitHooks !== undefined && afterInitHooks.length > 0) {
				this.hookService.handleHook(afterInitHooks, this);
			}
		}
	}
}