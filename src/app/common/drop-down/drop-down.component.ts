import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from 'src/app/utilities/utility.service';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DropDownComponent implements OnInit {
  @Input() disableRipple: boolean;
  @Input() disabled: boolean;
  @Input() id: string;
  @Input() panelClass: string;
  @Input() value: string;
  @Input() options: {};
  @Input() empty: boolean;
  @Input() focused: boolean;
  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() dataSource: string;
  @Input() code: string;
  @Input() displayValue: string;
  @Input() defaultValue: string;
  @Input() css: string;
 
  // @Output() selectItem: EventEmitter<string> = new EventEmitter<string>();

  eventMap = ['selectionChange', 'openedChange'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  constructor(private contextService: ContextService, private utilityService: UtilityService,
    translate: TranslateService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {
    if (this.dataSource && this.dataSource != undefined) {
      if (this.dataSource.startsWith('#')) {
        var responseArray = [];
        var splitArray = this.dataSource.split('.');
        var contextKey = splitArray.shift().split('#')[1];
        var resultByKey = this.contextService.getDataByKey(contextKey);
        
        /// for traversing further
        var searchString = splitArray.join('.');

        responseArray = this.contextService.getObjectFromString(resultByKey, searchString);
        
        /// check if code and value are present
        if(this.code && this.code != undefined){
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
        
        this.options = responseArray; 
        
        if(this.defaultValue && this.defaultValue != undefined && this.defaultValue.startsWith('#')){
        }
        // console.log(this.options);
      }
    }
  }

  selectedItem(value) {
    // console.log('selectionChange: ', value);
    //this.selectItem.emit(value)
  }

  openedChangedHandler(event){
  }
}
