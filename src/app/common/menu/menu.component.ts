import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class MenuComponent implements OnInit {

  eventMap = ['click', 'keydown', 'tab', 'closed'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  @Input() backdropClass = 'string';
  @Input() hasBackdrop = false;
  @Input() overlapTrigger = false;
  @Input() panelClass = 'string';
  @Input() xPosition: 'after'|'before'='after';
  @Input() yPosition: 'above'|'below'='below';
  @Input() direction= 'Direction';
  @Input() panelId = `mat-menu-panel-${'menuPanelUid++'}`;
  @Input() parentMenu = 'MatMenuPanel | undefined';
  @Input() disableRipple = false;
  @Input() disabled = false;
  @Input() role: 'menuitem' | 'menuitemradio' | 'menuitemcheckbox' = 'menuitem';
  @Input() items=['Item 1', 'Item 2', 'Item 3', 'Item 4'];

 //@Output() closed: EventEmitter<void | 'click' | 'keydown' | 'tab'>


  constructor(translate: TranslateService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {
  }

}
