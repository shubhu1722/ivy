import { Input, OnInit, Component, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';

//@custom components
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';

//@utilty
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';

@Component({
	selector: 'app-dynamic-item',
	templateUrl: './dynamic-item.component.html',
	styleUrls: ['./dynamic-item.component.scss']
})

//@class component
export class DynamicItemRender implements OnInit, AfterViewInit {
	//@property decorator
	@ViewChild('dynamicpage', { static: true, read: ViewContainerRef }) dynamicpage: ViewContainerRef;

	//@inputs
	@Input() data: any;
	@Input() hooks: any;
	@Input() contentTitle: any;
	@Input() contentTextLabel: any;
	@Input() contentServerLabel: any;

	hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

	constructor(
		private hookService: HookService,
		private contextService: ContextService,
		private utilityService: UtilityService,
		private componentLoaderService: ComponentLoaderService
	) { }

	//@OnInit
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

		//@If all satisfies
		if (data && data.length > 0) {
			//@loop through each item to create the given component
			data.forEach((rec, i) => {
				let config: any = {
					"ctype": "taskPanel",
					"header": {
						"title": this.contentTitle,
						"icon": "description",
						"status": rec.testResult
					},
					"expanded": ((i === 0) ? "true" : "false"),
					"isblueBorder": true,
					"hideToggle": "true",
					"visibility": false,
					"hooks": [],
					"validations": [],
					"actions": [],
					"uuid": `preTestTaskUUID${i}`,
					"items": [
						{
							"ctype": "label",
							"text": this.contentTextLabel
						},
						{
							"ctype": "label",
							"text": rec.testArea
						},
						{
							"ctype": "label",
							"text": this.contentServerLabel
						},
						{
							"ctype": "label",
							"text": rec.testServer
						}
					],
					"footer": [{
						"ctype": "button",
						"color": "primary",
						"text": "Complete",
						"uuid": `PreTestComplteBtnUUID${i}`,
						"type": "submit",
						"hooks": [],
						"validations": [],
						"actions": [
							{
								"type": "updateComponent",
								"config": {
									"key": `preTestTaskUUID${i}`,
									"properties": {
										"expanded": false,
										"header": {
											"title": this.contentTitle,
											"icon": "description",
											"status": rec.testResult,
											"statusIcon": "check_circle",
											"statusClass": "complete-status",
											"class": "complete-task",
											"iconClass": "complete-task"
										}
									}
								},
								"eventSource": "click"
							},
							{
								"type": "updateComponent",
								"config": {
									"key": `PreTestComplteBtnUUID${i}`,
									"properties": {
										"disabled": true
									}
								},
								"eventSource": "click"
							}
						]
					}]
				};

				if (i < (data.length - 1)) {
					config.footer[0].actions.push({
						"type": "updateComponent",
						"config": {
							"key": `preTestTaskUUID${i + 1}`,
							"properties": {
								"expanded": true
							}
						},
						"eventSource": "click"
					});
				}

				//@component loader on the property decorator
				this.componentLoaderService.parseData(config, this.dynamicpage);
			});
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