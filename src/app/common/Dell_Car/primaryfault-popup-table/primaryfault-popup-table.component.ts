import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActionService } from '../../../services/action/action.service';
import { ContextService } from '../../../services/commonServices/contextService/context.service';

@Component({
  selector: 'app-primaryfault-popup-table',
  templateUrl: './primaryfault-popup-table.component.html',
  styleUrls: ['./primaryfault-popup-table.component.scss']
})
export class PrimaryfaultPopupTableComponent implements OnInit {
  dataItemArray: any[];
  isVisible : boolean = false;
  finalvaluefordate: string;
  primaryData:any=[];
  defaultMultiRo: any;
  checkIndex : any;
  constructor(private contextService : ContextService, private actionService : ActionService,private http:HttpClient) {
  this.http.get('assets/Responses/pimaryFaultMockdata.json').subscribe((res:any)=>{
      console.log(res.data);
      this.primaryData=res.data;
      
    })
  }

  ngOnInit(): void {
    // this.radioData();
   
  }
  ngAfterViewInit() {
  //  this.radioData();
  }
  // radioData(){
  //   let multiRoResponse = this.contextService.getDataByString("#dellCarReceivingOrderDetails");
  //   console.log(multiRoResponse)
  //   this.dataItemArray = multiRoResponse;
  //   multiRoResponse.forEach(element => {
  //     let datevalue = element.RO_CREATED_TIMESTAMP;
  //     let day = new Date(datevalue).getDate();
  //     let monthIndex = new Date(datevalue).getMonth();
  //     let year = new Date(datevalue).getFullYear();
  //     let month = [
  //       'Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  //     ];
  //     this.finalvaluefordate = month[monthIndex] + ' ' + day + ',' + year;
  //   });
  // }
  editMultiRoTable(multiRoResponse: any, i: any) {
    let multiRoRefOrderId = multiRoResponse.REFERENCE_ORDER_ID;
    this.defaultMultiRo = multiRoRefOrderId;
    this.checkIndex = i;
    this.contextService.addToContext('dcReceivingOrderDetails', multiRoResponse);
    let multiRoDoneButtonEnabled = {
      "type": "updateComponent",
      "config": {
        "key": "donePrimaryFaultUUID",
        "properties": {
          "disabled": false
        }
      }
    }
    this.actionService.handleAction(multiRoDoneButtonEnabled, this);
  }
}
