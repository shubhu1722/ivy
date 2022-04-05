import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class MultiSelectDropdownComponent implements OnInit {
  @Input() multiple = 'true';
  @Input() disableRipple = 'false';
  @Input() id = 'string';
  @Input() panelClass = '';
  @Input() value = [];
  @Input() options = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  @Input() empty = 'false';
  @Input() focused = 'false';
  @Input() placeholder = 'Select Options';
  @Input() required = 'true';
  @Input() datasoucre = {
    msid: '',
    code: 'id',
    text: 'name',
    root: 'data',
    params: [],
  };

  //@Output() selectItem: EventEmitter<string> = new EventEmitter<string>();

  eventMap = ['selectionChange', 'openedChange'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  constructor(translate: TranslateService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {}

  selectedItem(value) {

    //this.selectItem.emit(value)
  }
}
