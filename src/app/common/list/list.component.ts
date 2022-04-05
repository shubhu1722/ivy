import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ListComponent implements OnInit {
  eventMap = ['selectionChange', 'itemclick'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  @Input() color = 'primary';
  @Input() disableRiple = 'false';
  @Input() disabled = 'false';
  @Input() multiple = 'false';
  @Input() datasource = {};
  @Input() items = [
    {
      'type' : 'icon',
      'title' : 'HOME',
      'icon' : 'home',
      'imgUrl' : ''
    },
    {
      'type' : 'avatar',
      'title' : 'IMGAGE',
      'icon' : '',
      'imgUrl' : 'https://placeimg.com/640/480/nature'
    },
    {
      'type' : 'icon',
      'title' : 'CANCEL',
      'icon' : 'cancel',
      'imgUrl' : ''
    }
  ];



  constructor(translate: TranslateService
    ) { 
      let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
    }

  ngOnInit(): void {
  }

}
