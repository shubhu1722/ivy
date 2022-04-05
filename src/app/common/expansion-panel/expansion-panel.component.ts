import { Component, OnInit, ViewChild, Input, ChangeDetectionStrategy, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ExpansionPanelComponent implements OnInit {
  @Input() header: any = {};
  @Input() footer: any = [];
  @Input() Items: any[] = [];
  @Input() disabled: any;
  @Input() expanded: any;
  @Input() hideToggle: boolean;
  @Input() togglePosition: string;
  @Input() collapsedHeight: string;
  @Input() expandedHeight: string;
  @Input() displayMode: string;
  @Input() multi: boolean;
  @Input() titleClass:string;

  @ViewChild('expansionpanelcontent', { static: true, read: ViewContainerRef }) expansionpanelcontent: ViewContainerRef;
  @ViewChild('expansionpanelfooter', { static: true, read: ViewContainerRef }) expansionpanelfooter: ViewContainerRef;

  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];
  eventMap = [
    'beforePanelOpened',
    'beforePanelClosed',
    'afterPanelClosed',
    'afterPanelOpened',
  ];
  constructor(private componentLoaderService: ComponentLoaderService, translate: TranslateService
    ) { 
      let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
    }

  ngOnInit() {
    this.Items.forEach((item) => {
      this.componentLoaderService.parseData(item, this.expansionpanelcontent);
    });
    this.footer.forEach((item) => {
      this.componentLoaderService.parseData(item, this.expansionpanelfooter);
    });
  }
}
