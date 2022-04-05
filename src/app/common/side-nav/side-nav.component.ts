import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { Url } from '../../config/url';
import { MetadataService } from 'src/app/services/commonServices/metadataService/metadata.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { MatDrawer } from '@angular/material/sidenav';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class SideNavComponent implements OnInit {
  @ViewChild('leftnavheader', { static: true, read: ViewContainerRef }) leftnavheader: ViewContainerRef;
  @ViewChild('leftnavbody', { static: true, read: ViewContainerRef }) leftnavbody: ViewContainerRef;
  @ViewChild('leftnavfooter', { static: true, read: ViewContainerRef }) leftnavfooter: ViewContainerRef;
  @ViewChild('rightnavheader', { static: true, read: ViewContainerRef }) rightnavheader: ViewContainerRef;
  @ViewChild('rightnavbody', { static: true, read: ViewContainerRef }) rightnavbody: ViewContainerRef;
  @ViewChild('rightnavfooter', { static: true, read: ViewContainerRef }) rightnavfooter: ViewContainerRef;
  @ViewChild('pageContent', { static: true, read: ViewContainerRef }) pageContent: ViewContainerRef;
  @ViewChild('header', { static: true, read: ViewContainerRef }) header: ViewContainerRef;
  @ViewChild('footer', { static: true, read: ViewContainerRef }) footer: ViewContainerRef;
  @ViewChild('drawerright', { static: true }) public drawerright: MatDrawer;

  @Input() color: string;
  @Input() mode: string; // side
  @Input() opened: boolean; // true
  @Input() position: string; // start
  @Input() fixedInViewport: boolean;
  @Input() pageContentBody: any[] = [];
  @Input() leftsideNav: any = { sideNavHeader: [], sideNavBody: [], sideNavFooter: [] };
  // @Input() leftsideNav: any = {};
  @Input() rightsidenav: any = {};
  @Input() pageContentHeader: any = {};
  @Input() pagecontentFooter: any = {};
  @Input() sidenavContainerClass: string;
  @Input() pcBodyClass: string;
  @Input() hooks: any[];
  hookMap = ['beforeInit', 'afterInit', 'beforeAction', 'afterAction'];
  beforeInitHooks: any[];
  afterInitHooks: any[];
  beforeActionHooks: any[];
  afterActionHooks: any[];
  Isrightsidenav: boolean = false;
  screenWidth: number;
  eventMap = [
    'closedStart',
    'onPositionChanged',
    'openedChange',
    'openedStart',
  ];
  navItems = [
    {
      displayName: 'Home',
      iconName: 'home',
    },
    {
      displayName: 'Requisition Orders',
      iconName: 'assignment_returned',
    },
    {
      displayName: 'Release from Hold',
      iconName: 'unarchive',
    },
    {
      displayName: 'Parts Receiving',
      iconName: 'assignment_returned',
    },
    {
      displayName: 'RTV',
      iconName: 'unarchive',
    },
  ];

  constructor(private _changeDetectionRef: ChangeDetectorRef, private metadataService: MetadataService,
    private contextService: ContextService, private hookService: HookService,
    private componentLoaderService: ComponentLoaderService) {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    };
  }

  ngOnInit(): void {

    this.contextService.addToContext('mainPageContentBody', this.pageContent);
    this.contextService.addToContext('mainPageRightContent', this.rightnavbody);
    this.leftsideNav.sideNavHeader.forEach((item) => {
      this.componentLoaderService.parseData(item, this.leftnavheader);
    });
    this.leftsideNav.sideNavBody.forEach((item) => {
      item.rightsidenav = this.drawerright;
      this.componentLoaderService.parseData(item, this.leftnavbody);
    });

    this.leftsideNav.sideNavFooter.forEach((item) => {
      this.componentLoaderService.parseData(item, this.leftnavfooter);
    });

    if (this.pageContentBody && this.pageContentBody.length > 0) {
      this.pageContentBody.forEach((item) => {
        item.rightsidenav = this.drawerright;
        this.componentLoaderService.parseData(item, this.pageContent);
      });
    }
    if (this.pagecontentFooter && this.pagecontentFooter != undefined && this.pagecontentFooter.hasOwnProperty('ctype')) {
      this.componentLoaderService.parseData(this.pagecontentFooter, this.footer);
    }
    if (this.pageContentHeader && this.pageContentHeader != undefined && this.pageContentHeader.hasOwnProperty('ctype')) {
      this.componentLoaderService.parseData(this.pageContentHeader, this.header);
    }
    if (this.rightsidenav && this.rightsidenav != undefined && this.rightsidenav.hasOwnProperty('position')) {
      if (this.rightsidenav.sideNavHeader != undefined) {
        this.rightsidenav.sideNavHeader.forEach((item) => {
          item.rightsidenav = this.drawerright;
          this.componentLoaderService.parseData(item, this.rightnavheader);
        });
      }
      if (this.rightsidenav.sideNavBody != undefined) {
        this.rightsidenav.sideNavBody.forEach((item) => {
          this.componentLoaderService.parseData(item, this.rightnavbody);
        });
      }
    }

    if(this.hooks !== undefined) {
      this.beforeInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[0]);
      if (this.beforeInitHooks !== undefined && this.beforeInitHooks.length > 0) {
        this.hookService.handleHook(this.beforeInitHooks, this);
      }
    }
  }

  ngAfterViewInit() {
    // this.hookService.handleHook(this.afterInitHooks, this);
    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      const afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[1]);
      if (afterInitHooks !== undefined && afterInitHooks.length > 0) {
        this.hookService.handleHook(afterInitHooks, this);
      }
    }
  }
}
