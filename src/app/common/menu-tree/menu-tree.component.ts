
import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { ActionService } from 'src/app/services/action/action.service';

import { TranslateService } from '@ngx-translate/core';
import { HpWCOperationsService } from 'src/app/services/hp/hpWCOperations/hp-wcoperations.service';
import { AssertionError } from 'assert';


@Component({
  selector: 'app-menu-tree',
  templateUrl: './menu-tree.component.html',
  styleUrls: ['./menu-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})

export class MenuTreeComponent implements OnInit, AfterViewInit {

  eventMap = ['menuClosed', 'menuOpened', 'menuClick'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  @Input() menu = 'MatMenuPanel<any>';
  @Input() restoreFocus = false;
  @Input() dir = 'Direction';
  @Input() menuOpen = false;
  @Input() id = 'string';
  @Input() datasource: any;
  @Input() subProcessType: any;
  @Input() uuid: string;
  @Input() menuData: any;
  @Input() childIndex: number;

  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();

  constructor(
    private contextService: ContextService,
    private hpWcOperationsService: HpWCOperationsService,
    private actionService: ActionService,


    private _changeDetectionRef: ChangeDetectorRef,
    translate: TranslateService
  ) {
    let language = localStorage.getItem('language');
    translate.setDefaultLang(language);
    translate.use(language)
  }

  hasChild = (_: number, node: any) => !!node;

  ngOnInit(): void {
    this.childIndex = this.childIndex ? this.childIndex : 0;
    if (this.menuData && this.menuData !== undefined && this.menuData.startsWith('#')) {
      this.menuData = this.contextService.getDataByString(this.menuData);
      if (this.menuData && this.menuData.length > 0) {

        // for sorting parent
        this.menuData.sort((a, b) => {
          return Number(a.displayOrder) - Number(b.displayOrder);
        });

        // for sorting children
        this.menuData.forEach((parent) => {
          if (parent && parent.children && parent.children.length > 0) {
            parent.children.sort((a, b) => {
              return Number(a.displayOrder) - Number(b.displayOrder);
            });
          }
        });

        // for making isActive true or false
        if (!this.subProcessType) {
          this.menuData.forEach((parent, index) => {
            if (index === 0) {
              parent.isActive = true;
              if (parent && parent.children && parent.children.length > 0) {
                parent.children.forEach((child, i) => {
                  if (i === this.childIndex) {
                    child.isActive = true;
                  } else {
                    child.isActive = false;
                  }
                });
              }
            } else {
              parent.isActive = false;
              if (parent && parent.children && parent.children.length > 0) {
                parent.children.forEach((child, i) => {
                  child.isActive = false;
                });
              }
            }
          });
        }


        //for striking off inactive menu items ---- DONT REMOVE
        let isClientAndScreenValid = this.contextService.handleClientAndScreenValidation();
        if(isClientAndScreenValid){
        let flag = true;
        let arr = this.contextService.getDataByKey("menuItems");
        let req = {}
        if (this.menuData && this.menuData.length > 0) {
          this.menuData.forEach((parent, index) => {
            if (parent && parent.children && parent.children.length > 0) {
              parent.children.forEach((child) => {
                let currentMenuData = arr && arr.find(o => o.name === child.name);
                if (currentMenuData && currentMenuData.hasOwnProperty("completed")) {
                  child.isCompleted = currentMenuData.completed;
                } else {
                  child.isCompleted = false;
                }
              });
            }
          });
        }
      }
    }

    }
    let parentChildrenMenuitems = this.contextService.getDataByKey("parentChildrenMenuitems");
    let userSelectedClientName = this.contextService.getDataByKey("userSelectedClientName");
    if(userSelectedClientName == "HP" && parentChildrenMenuitems && parentChildrenMenuitems.length > 0) {
      this.dataSource.data = parentChildrenMenuitems; 
    }
    else if (this.menuData && this.menuData.length > 0) {
      this.dataSource.data = this.menuData; 
    }
    if (userSelectedClientName != "HP" && this.dataSource.data && this.dataSource.data.length > 0) {
      this.treeControl.expand(this.dataSource.data[0]);
    }
  }

  onMenuClick(event) {
    // let discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
    // if (discrepancyUnitInfo.CLIENTNAME !== "DELL") {
    //   let currentWC = this.contextService.getDataByKey("currentWC");
    //   let routeWC = this.contextService.getDataByKey("routeWC");
    //   let menu_list = this.contextService.getDataByKey("getSubProcessMenu")
    //   let arr = this.contextService.getDataByKey("menuItems");
    //   let currentMenu = arr && arr.find(x => x.name == event.name)
    //   if (currentWC !== event.name || currentWC !== routeWC) {
    //     for (let i = 0; i < menu_list.length; i++) {
    //       if (menu_list[i].children && menu_list[i].children.length > 1) {
    //         for (let i = 0; i < arr.length; i++) {
    //           if (arr[i].name === event.name && arr[i].hasOwnProperty('completed')) {
    //             this.contextService.contextSubjectData("routeWC", event.name);
    //             this.contextService.contextSubjectData("ScreenMenuObj", currentMenu);
    //             this.hpWcOperationsService.menuItemAction(this, event, this.actionService)
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  }

  ngAfterViewInit() { }


}




