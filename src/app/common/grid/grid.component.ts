import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, ViewContainerRef, AfterViewInit, Output } from '@angular/core';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { EventEmitter } from 'events';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class GridComponent implements OnInit {
  @Input() cols: string;
  @Input() rowHeight: string;
  @Input() gutterSize: string;
  @Input() colspan: number;
  @Input() rowspan: number;
  @Input() tiles: any;
  @Input() hooks: string[] = [];
  @Input() actions: any;
  @Input() validations: string[];
  @Input() FlexFieldName: string;
  selectedvalue: any;
  count: number = 1;
  eventMap = ['click'];
  hookMap = ['beforeInit', 'afterInit', 'beforeAction', 'afterAction'];

  constructor(
    private componentLoaderService: ComponentLoaderService,
    private eventprocessor: EventServiceService,
    private contextService: ContextService,
    translate: TranslateService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void { }
  clickEvent(tile, event) {
    var isComponentThere = this.contextService.getDataByKey(tile.targetuuid + 'ref');
    if (isComponentThere === undefined) {
      //TODO: need to change this implementation
      var flexarray: any[] = this.contextService.getDataByKey(this.FlexFieldName);
      //this if block checks the flexFields array to see is there any flex field with NONE as value ,
      // if it is there then we will allow to add the component so the accessory will be added
      var isAllow: Boolean = false;
      if(flexarray != undefined && flexarray != null) {
        var tileValue = tile.tileValue;
        if(tileValue != null && tileValue != undefined){
          //first check accessory exists in array
          var isAccesoryExists: Boolean = false;
          for(var j=0;j< flexarray.length;j++){
            var accessoryName = flexarray[j].Name;
            if(accessoryName.includes('Accessory')){
              isAccesoryExists = true;
              break;
            }
          }
          if(isAccesoryExists){
            for(var i=0;i< flexarray.length;i++){   
              var accessoryVal = flexarray[i].Value;
              if(accessoryVal == 'NONE'){
                isAllow = true;
                break;
              }
            }
          }else{
            isAllow = true;
          }
        }else{
          isAllow = true;
        }
      }else{
        isAllow = true;
      }
      if(isAllow){
        var countnum = this.count++;
        this.actions.forEach((ele) => {
          if (ele.config.data !== undefined) {
            if (this.FlexFieldName.includes(tile.uuid)) {
              ele.config.data.uuid = tile.targetuuid;
              ele.config.data.parentuuid = ele.config.data.uuid;
              ele.config.data.accessoryName = '';
              ele.config.data.targetuuid = tile.uuid + countnum;

            } else {
              ele.config.data.uuid = tile.uuid;
              ele.config.data.parentuuid = tile.uuid;
              ele.config.data.targetuuid = tile.targetuuid;
              ele.config.data.accessoryName = tile.accessoryName;
            }
          } else {
            if (this.FlexFieldName.includes(tile.uuid)) {
              ele.config.key = tile.name + countnum;
              ele.config.value = tile.tileValue;
              ele.config.accessoryName = '';

            } else {
              ele.config.key = tile.name;
              ele.config.value = "";

              ele.config.accessoryName = tile.accessoryName;
            }
          }
        });
        this.eventMap.forEach((ele) => {
          if (ele === event.type) {
            this.eventprocessor.handleEvent(this, event);
          }
        });
      }
    }
  }
}
