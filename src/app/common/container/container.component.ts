import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ContainerComponent implements OnInit {

@Input() header = {name:'hearder'};
@Input() items = {name:'content'};
@Input() footer = {name:'LIKE'};
@Input() css ='width: 500px; height:550px;';

 eventMap = [];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  constructor(translate: TranslateService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {
      // check for beforeinit hook if exists call
    // componentspecific logic
    // check for afterinit hook if exists call
  }

  eventHandler(event){
      // any custome logic
    // this.eventprocessor.handleEvent(event)
  }


}
