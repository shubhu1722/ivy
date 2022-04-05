import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentLoaderService } from '../../services/commonServices/component-loader/component-loader.service';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { ETravellerService } from '../../services/commonServices/eTraveller/etraveller.service';
@Component({
  selector: 'app-key-data',
  templateUrl: './key-data.component.html',
  styleUrls: ['./../etraveller/etraveller.component.scss']
})
export class KeyDataComponent implements OnInit {
  @ViewChild('keyDataCustomerComplaint', {read: ViewContainerRef }) keyDataCustomerComplaint: ViewContainerRef;
  keyDataItemObjects = {};
  keyDataLabels = {};
  items: any;
  leftColumnData :any;
  rightColumnData :any;
  orderDetailsData :any;
  keyDataItemKeys = ['unitDetailItems','customerComplainItems','orderDetailsItems'];
  keyDataLabelKeys = ["unitDetailTitle","customerComplainTitle","orderDetailsTitle"]

  constructor(
    private contextService: ContextService,
    private componentLoaderService: ComponentLoaderService,
    private eTravellerService: ETravellerService
  ) { }

  ngOnInit(): void {
     this.eTravellerService.keyData.subscribe((data)=> {
      this.items = data;
      this.items.length > 0 ? this.parseKeyDataItems(this.items)  : false;
     })
     this.items = this.items !== undefined ? this.items : null;
  }

  ngAfterViewInit():void {
    this.items.length > 0 ? this.parseKeyDataItems(this.items)  : false;
   }

  parseKeyDataItems(keyDataItems) {
    //filtering the keyData items and labels
    keyDataItems.forEach((item, index) => {
      Object.keys(item).forEach((key) => {
        if (key == this.keyDataItemKeys[index]) {
          this.keyDataItemObjects[key] = item[key]
        }
        if (key == this.keyDataLabelKeys[index]) {
          this.keyDataLabels[key] = item[key]
        }
      });

    });
    this.keyDataItemObjects['unitDetailItems'] != undefined &&
    this.keyDataItemObjects['unitDetailItems'].forEach(element => {
      let columnData = element.leftColumnData || element.rightColumnData;
      columnData.forEach((item) => {
        if (item.value && item.value.startsWith('#')) {
          item.value = this.contextService.getDataByString(item.value);
        }
       // this.componentLoaderService.parseData(item, this.keyDataCustomerComplaint);
      });
      element.leftColumnData ? this.leftColumnData = element.leftColumnData :
        element.rightColumnData ? this.rightColumnData = element.rightColumnData : false
    });
    this.keyDataItemObjects['customerComplainItems'] != undefined &&
    this.keyDataItemObjects['customerComplainItems'].forEach((item) => {
      this.componentLoaderService.parseData(item, this.keyDataCustomerComplaint);
    });
    this.keyDataItemObjects['orderDetailsItems'] != undefined &&
     this.keyDataItemObjects['orderDetailsItems'].forEach((item) => {
      if (item.value && item.value.startsWith('#')) {
        item.value = this.contextService.getDataByString(item.value);
      }
    });
   this.orderDetailsData = this.keyDataItemObjects['orderDetailsItems'] != undefined &&
                           this.keyDataItemObjects['orderDetailsItems'] 
  }

}