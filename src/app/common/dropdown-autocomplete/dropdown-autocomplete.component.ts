import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/services/commonServices/validation/validation.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { ActionService } from 'src/app/services/action/action.service';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
	selector: 'app-dropdown-autocomplete',
	templateUrl: './dropdown-autocomplete.component.html',
	styleUrls: ['./dropdown-autocomplete.component.scss']
})

export class DropdownAutocompleteComponent implements OnInit {
	@ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
	autoComplete: MatAutocompleteTrigger;
	@Input() options: any[];
	@Input() inputStyles: string;
	@Input() name: string;
	@Input() dataSource: any;
	@Input() displayValue: string;
	@Input() defaultValue: string;
	@Input() code: string;
	@Input() label: string;
	@Input() group: FormGroup;
	@Input() hooks: any[];
	@Input() labelClass: string;
	@Input() formGroupClass: string;
	@Input() formGroupStyles: string;
	@Input() hidden: boolean;
	@Input() defaultFilterValue: string;
	@Input() defaultFilterKey: string;
	@Input() required: boolean;
	@Input() isTrimRequired: boolean;
	@Input() actions: any[] = [];
	@Input() disabled: boolean;
	@Input() isSearchToAddContext: boolean;
	@Input() isUpperCase: boolean;
	@Input() placeholder: string;
	@Input() validations: any[];
	selectedDropdownName: string;
	dropDownOptions: any;
	splitArray: string[];
	contextKey: string;
	eventMap = ['input', 'keydown', 'selectionChanged', 'onFocusOut'];
	validators: Validators;
	hookMap = ['beforeInit', 'afterInit', 'beforeAction', 'afterAction'];
	beforeInitHooks: any[];
	afterInitHooks: any[];
	beforeActionHooks: any[];
	afterActionHooks: any[];
	inputText:any;
	@Input() minLength: string;
	@Input() maxLength: string;
	@Input() dropdownClass: string;
	@Input() autocompleteClass: string;
	@Input() validateGroup: boolean;
	config = {
		displayKey: "displayValue", // if objects array passed which key to be displayed defaults to description
		search: true,
		height: 'auto',
	};

	scrollEvent = (event: any): void => {
		if (this.autoComplete.panelOpen)
			// this.autoComplete.closePanel();
			this.autoComplete.updatePosition();
	};

	constructor(private contextService: ContextService, private _changeDetectionRef: ChangeDetectorRef,
		private actionService: ActionService,
		private utilityService: UtilityService, private hookService: HookService, private eventprocessor: EventServiceService, private validation: ValidationService,) { }

	ngOnInit() {
		console.log(this.validations);
		this.validateGroup = this.validateGroup === undefined ? false : this.validateGroup;
		window.addEventListener('scroll', this.scrollEvent, true);
		this.autocompleteClass = this.autocompleteClass != undefined ? this.autocompleteClass : "autocomplete-form-field-cls";
		this.placeholder = this.placeholder === undefined ? "Scan #" : this.placeholder;
		if (this.defaultValue && this.defaultValue !== undefined && this.defaultValue.startsWith('#')) {
			let defaultResultVal = this.contextService.getDataByString(this.defaultValue);
			if (defaultResultVal == undefined || defaultResultVal == null || defaultResultVal == "") {
				if (this.options && this.options.length > 0) {
					this.options.forEach(optionVal => {
						if (optionVal.isDefault == "true" || optionVal.isDefault == true) {
							defaultResultVal = optionVal.code;
						}
					});
				}
			}

			this.defaultValue = defaultResultVal;
		}
		if (this.defaultFilterValue && this.defaultFilterValue !== undefined && this.defaultFilterValue.startsWith('#')) {
			this.defaultFilterValue = this.contextService.getDataByString(this.defaultFilterValue);
		}
		if (this.group === undefined) {
			this.group = new FormGroup({});
			if (this.defaultValue && this.defaultValue !== undefined) {
				this.group.addControl(this.name, new FormControl(this.defaultValue));
			} else {
				this.group.addControl(this.name, new FormControl());
			}
		} else {
			if (this.defaultValue && this.defaultValue !== undefined) {
				this.group.controls[this.name].setValue(this.defaultValue);
			}
		}
		if (this.required !== undefined && this.required) {
			this.group.controls[this.name].setValidators(Validators.required);
		}
		if (this.disabled !== undefined && this.disabled) {
			this.group.controls[this.name].disable();
		}
		// TODO: Remove hard coded string 'userSelected'
		this.contextService.addToContext('userSelected' + this.name, this.group.controls[this.name].value);
		if (this.dataSource && this.dataSource !== undefined) {
			if (this.dataSource instanceof Array) {
				this.dataSource = this.dataSource.map(s => ({
					code: s,
					displayValue: s
				}));
				this.dataSource.sort((a, b) => a.displayValue.localeCompare(b.displayValue));
				this.options = this.dataSource;
			}
			else if (this.dataSource.startsWith('#')) {
				let responseArray = [];
				responseArray = this.contextService.getDataByString(this.dataSource);
				if (responseArray !== undefined && responseArray) {
					/// if there is a default filter value, use it to filter
					if (this.defaultFilterValue !== undefined) {
						responseArray = this.utilityService.getFilteredCodes(
							responseArray,
							this.defaultFilterKey,
							this.defaultFilterValue
						);
					}
					/// check if code and value are present
					if (this.code && this.code !== undefined) {
						responseArray = responseArray.map(s => ({
							code: s[this.code],
							displayValue: s[this.displayValue]
						}));
					} else {
						responseArray = responseArray.map(s => ({
							code: s,
							displayValue: s
						}));
					}
					responseArray = responseArray.filter((x) => x.displayValue !== undefined && x.displayValue);
					responseArray.sort((a, b) => a.displayValue.localeCompare(b.displayValue));
					this.options = responseArray;
				}
			} else {
				this.options = this.dataSource;
			}
		}

		this.isUpperCase = this.isUpperCase === undefined ? false : this.isUpperCase;

		if (this.hooks !== undefined) {
			this.beforeInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[0]);
			if (this.beforeInitHooks !== undefined && this.beforeInitHooks.length > 0) {
				this.hookService.handleHook(this.beforeInitHooks, this);
			}
		}

		if (this.validations) {
			if (this.validations.length > 0) {
				this.validators = Validators;
			}
		}
		if (this.validations) {
			if (this.validations.length > 0) {
				this.validation.validateMethod(this);
			}
		}

	}

	onInput(event) {
		if (this.isUpperCase !== undefined && this.isUpperCase) {
			this.group.controls[this.name].setValue(event.target.value.toUpperCase());
			event.target.value = event.target.value.toUpperCase();
		}

		if (this.validateGroup === true && this.group.status === 'VALID') {
			this.eventMap.forEach((ele) => {
				if (ele === event.type) {
					if (this.isSearchToAddContext) {
						this.actions && this.actions.forEach((val) => {
							if ((val.eventSource === "input") && (val.type === "searchToAddContext") && val.config && (val.config.length > 0)) {
								val.config.forEach((r) => {
									if (r.event === true) {
										this.contextService.addToContext(r.key, event.target.value);
									} else {
										this.actionService.handleAction(r, this);
									}
								});
							}
						});
					}
				}
			});
		} else if (this.validateGroup === false) {
			this.eventMap.forEach((ele) => {
				if (ele === event.type) {
					if (this.isSearchToAddContext) {
						this.actions && this.actions.forEach((val) => {
							if ((val.eventSource === "input") && (val.type === "searchToAddContext") && val.config && (val.config.length > 0)) {
								val.config.forEach((r) => {
									if (r.event === true) {
										this.contextService.addToContext(r.key, event.target.value);
									} else {
										this.actionService.handleAction(r, this);
									}
								});
							}
						});
					}
				}
			});
		}
	}

	onKeyDown(event) {
		if (event.keyCode === 13) {
			this.eventMap.forEach((ele) => {
				if (ele === event.type) {
					if (this.isSearchToAddContext) {
						this.actions && this.actions.forEach((val) => {
							if ((val.eventSource === "keydown") && (val.type === "searchToAddContext") && val.config && (val.config.length > 0)) {
								val.config.forEach((r) => {
									if (r.event === true) {
										this.contextService.addToContext(r.key, event.target.value);
									} else {
										this.actionService.handleAction(r, this);
									}
								});
							}
						});
					}
				}
			});
		}
	}

	onSelectionChanged(event: MatAutocompleteSelectedEvent) {
		this.eventMap.forEach((ele) => {
			if (ele === "selectionChanged") {
				if (this.isSearchToAddContext) {
					this.actions && this.actions.forEach((val) => {
						if ((val.eventSource === "selectionChanged") && (val.type === "searchToAddContext") && val.config && (val.config.length > 0)) {
							val.config.forEach((r) => {
								if (r.event === true) {
									let contextVal = event.option.value;
									const data = this.contextService.getDataByString(this.dataSource);

									if (data && data.length > 0) {
										contextVal = data.find((rec: any) => (rec[this.displayValue] === event.option.value));

										contextVal = (contextVal) ? contextVal[this.code] : event.option.value;
									}

									this.contextService.addToContext(r.key, contextVal);
								} else {
									this.actionService.handleAction(r, this);
								}
							});
						}
					});
				}
			}
		});
	}

	onFocusOut() {
		this.eventMap.forEach((ele) => {
			if (ele === "onFocusOut") {
				this.actions && this.actions.forEach((val) => {
					if ((val.eventSource === "onFocusOut") && val.config && (val.config.length > 0)) {
						val.config.forEach((r) => {
							this.actionService.handleAction(r, this);
						});
					}
				});
			}
		});
	}

	ngAfterViewInit() {
		if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
			this.afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[1]);
			this.hookService.handleHook(this.afterInitHooks, this);
		}
	}

	getOptions(options,inputText) {
		let optSorted = [];
		// console.log(options);
		// console.log(inputText);
		if (options && inputText) {
			optSorted = options.filter(e => typeof e == "string" && e.includes(inputText));;
		} else if(options){
			optSorted = options;
		}
		return optSorted;
	}
}
