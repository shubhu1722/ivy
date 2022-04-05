import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ToolbarComponent implements OnInit {
  @Input() color: string;
  @Input() css: string;
  @Input() items: any = [];
  @Input() rightsidenav: any;
  @Input() toolbarClass: string;
  @Input() togglePosition: any;
  @Input() hoverClass: string;
  @Input() isHeader: any;
  @ViewChild('toolbarElement', { static: true, read: ViewContainerRef })
  toolbarElement: ViewContainerRef;
  constructor(private componentLoaderService: ComponentLoaderService,private contextService: ContextService) {}

  ngOnInit(): void {
    this.items.forEach((item) => {
      item.rightsidenav = this.rightsidenav;
      let ScreenMenuObj = this.contextService.getDataByKey("ScreenMenuObj");
      this.componentLoaderService.parseData(item, this.toolbarElement);
    });
  }
}
