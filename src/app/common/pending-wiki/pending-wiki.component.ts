import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { WikiList } from '../../model';
import { WikiService } from '../../services/commonServices/wikiService/wiki.service';
import { CommentsDialogBoxComponent } from '../comments-dialog-box/comments-dialog-box.component';

@Component({
  selector: 'app-pending-wiki',
  templateUrl: './pending-wiki.component.html',
  styleUrls: ['./pending-wiki.component.scss']
})
export class PendingWikiComponent implements OnInit {

  @Input() wikisList: WikiList[];
  @Input() isWikiAdmin: boolean;

  step = 0;
  newWikiSubscribe: Subscription;

  editable:boolean = false;


  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  wikiTilesList: WikiList[] = [];
  constructor(private wikiService: WikiService, public wikiDialog: MatDialog) { }
  locationData
  clientData
  contractData
  workCenterData

  disableEdit:boolean = true;

  ngOnInit(): void {
    this.wikiService.pendingMyWikiEditBtn.subscribe(edit=> this.disableEdit = edit);


    this.wikiService.getUserData().subscribe((data: any) => {
       this.locationData = data.data.LocationDetails;
       this.clientData = data.data.ClientDetails;
       this.contractData = data.data.ContractDetails;
       this.workCenterData = data.data.WorkCenterDetails;
    });

    this.wikiService.pendingMyWiki.subscribe(data=>{
      if(this.wikiService.pendingWiki.length){
        this.wikiService.pendingWiki.splice(0,this.wikiService.pendingWiki.length)
      }
      this.wikiService.pendingWiki.push(data);
      // this.setDetails(this.wikiService.pendingWiki)
    this.wikiTilesList = this.wikiService.pendingWiki;
    this.setWikiList(this.wikiTilesList)
    })
    
  }

  ngAfterViewInit(){
    this.wikiTilesList = this.wikiService.pendingWiki;
  }

  renderCancelWiki(e:any){
    this.editable = e;
  }

  setWikiList(list: WikiList[]) {
    this.wikiService.getUserData().subscribe((data: any) => {
      console.log("data",data);
      const locationData = data.data.LocationDetails;
      const clientData = data.data.ClientDetails;
      const contractData = data.data.ContractDetails;
      const workCenterData = data.data.WorkCenterDetails;
      list.forEach(wiki => {
        wiki.display = {};
        const wikiLication = locationData.find(item => item.LOCATION_ID === wiki.locationId);
        wiki.display.location = wikiLication ? wikiLication.LOCATION_NAME : '';
        
        const wikiClient = clientData.find(item => item.CLIENT_ID === wiki.clientId);
        wiki.display.client = wikiClient ? wikiClient.CLIENT_NAME : '';

        const wikiContract = contractData.find(item => item.CONTRACT_ID === wiki.contractId);
        wiki.display.contract = wikiContract ? wikiContract.CONTRACT_NAME : '';

        const wikiWorkCenter = workCenterData.find(item => item.WORKCENTER_ID === wiki.workCenterId);
        wiki.display.workCenter = wikiWorkCenter ? wikiWorkCenter.WORKCENTER_NAME : '';

        wiki.display.family = wiki.family ? wiki.family : '';
        wiki.display.platform = wiki.platform ? wiki.platform : '';
        wiki.display.modelNo = wiki.modelPart ? wiki.modelPart : '';
        // wiki.display.commodity = wiki.commodity ? wiki.commodity : '';
      });
      this.wikiTilesList = list;
    });
  }

  ngOnDestroy() {
    this.newWikiSubscribe && this.newWikiSubscribe.unsubscribe();
  }

  showCreateWiki() {
    this.wikiService.showAddWiki.next(true);
  }

  setWikiFormData(data, index: number) {
    this.editable = true;
    console.log("data",data);
    
    this.wikiService.editWikiData.next({ data: data, editId: data.id });
    this.showCreateWiki();
  }

  openDialog(wikiData, type) {
    const dialogRef = this.wikiDialog.open(CommentsDialogBoxComponent, {
      height: '650px',
      width: '850px',
      data: {...wikiData, tabType: type}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        wikiData['commentsCount'] = result;
      }
    });
  }

}
