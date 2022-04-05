import { Component, Input, OnInit,ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { ActionService } from '../../services/action/action.service';
import { VerifoneReceivingServiceService } from '../../services/verifone/verifoneReceiving/verifone-receiving-service.service';
@Component({
  selector: 'app-verifone-quick-receiving-table',
  templateUrl: './verifone-quick-receiving-table.component.html',
  styleUrls: ['./verifone-quick-receiving-table.component.scss']
})
export class VerifoneQuickReceivingTableComponent implements OnInit {
  @Input() visibility: false;
  sortOrder=false;
  quickReceivingListData:any[] = [];
  constructor(
    private contextService: ContextService,
    private verifoneReceivingService: VerifoneReceivingServiceService,
    private ref: ChangeDetectorRef,
    private actionService: ActionService,
    private renderer: Renderer2
  ) { 

    this.renderer.listen('window', 'click',(e:Event)=>{
      console.log("window click--");
      let pJson = {
        "type": "context",
        "config": {
            "requestMethod": "add",
            "key": "quickReceivingSerialFormData",
            "data": "formData"
        },
        "eventSource": "keydown"
      };
      this.actionService.handleAction(pJson,this);
      let actionData = {type: 'renderQuickReceivingTableData'};
      this.actionService.handleAction(actionData, '','');
    });

  }

  ngOnInit(): void {
    //console.log("in");
    this.verifoneReceivingService.quickReceivingSubject.subscribe((data: any) => {
      //console.log("quick receiving  list data", data);
      let receiptData = this.contextService.getDataByKey("verifoneReceivingOrderDetails");
      let dataObj = {};
      if (data && data.success) {
        //console.log("receiptData", receiptData);
        dataObj["serialNo"] = receiptData["CLIENT_REFERENCE_NO2"] 
        dataObj["rmaNo"] = receiptData["CLIENT_REFERENCE_NO1"];
        dataObj["status"] = "Received";
        dataObj['error'] = false;
        this.quickReceivingListData.splice(0,0,dataObj);
        this.clearText();
        
        //console.log("context",this.contextService.getDataByKey("quickReceivingSerialFormData"));
      } else {        
        console.log("data--", data);
        console.log("in--", this.contextService.getDataByKey("quickReceivingSerialFormData"));
        let errorMessage = this.contextService.getDataByKey("errorResp");
        dataObj["serialNo"] = this.contextService.getDataByKey("quickReceivingSerialFormData")["quickReceivingserialNumberTextUUID"];
        dataObj["rmaNo"] = "RMA won't be generated";
        dataObj["status"] = errorMessage ? errorMessage : 'Failed';
        dataObj['error'] = true;
        if (this.contextService.getDataByKey("quickReceivingSerialFormData")["packingListNumberCheckbox"]) {
          this.quickReceivingListData.splice(0,0,dataObj);
        }
        this.clearText();
        
      }
      //console.log(" this.quickReceivingListData==",  this.quickReceivingListData);
      //this.quickReceivingListData.reverse();
      
      //this.quickReceivingListData.reverse();
      this.ref.detach();
      this.ref.detectChanges();
    });
  }

  clearText() {
    let clearJson = {
      "type": "setDefaultValue",
      "config": {
        "key": "serialNumberScanUUID",
        "defaultValue": ""
      },
      "eventSource": "click"                                                                                                                           
    };
    this.actionService.handleAction(clearJson,this);
  }

}
