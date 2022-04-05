import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation ,OnChanges} from '@angular/core';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { ActionService } from '../../services/action/action.service';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { serviceUrls } from '../../../environments/serviceUrls';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { UtilityService } from '../../utilities/utility.service';
import { WikiService } from '../../services/commonServices/wikiService/wiki.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-pdf-search',
  templateUrl: './pdf-search.component.html',
  styleUrls: ['./pdf-search.component.scss']
})
export class PdfSearchComponent implements OnInit, OnDestroy {
  @Input() css: string;
  @Input() titleValue: any;
  @Input() titleValueClass: any;
  @Input() title: any;
  @Input() titleClass: any;
  @Input() errorMsg: boolean = false;
  @Input() noDataFound: boolean = false;
  @Input() isWikiDraft :boolean=false
  @Input() isWikiAdmin :boolean
  @Input() isAdminAddWikiButtonDisplay:boolean
  @Input() isApprovedWikiListDisplay:boolean
  @Input() isAdmin :boolean =false;
  originalSize = false;
  fitToPage = false;
  zoom = 1.2;
  zoomScale = 'page-width';
  pdfQuery = '';
  data: any = [];
  urlData: any = '';
  urlData1: any = '';
  name = "";
  isDellWIPdf:boolean;
  display: string = "";
  currentClient: string;
 


  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;
  addWikiSubscription: Subscription;
  wikiResetSubscription: Subscription;
  isShowCreateWiki: boolean;

  constructor(private contextService: ContextService, private actionService: ActionService, private http: HttpClient, private utilityService: UtilityService, private wikiService: WikiService ,  private _changeDetectionRef: ChangeDetectorRef) { }
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  pageRendered(e: CustomEvent) {
    console.log('(page-rendered)', e);
  }
  ngOnInit(): void {
    let wikiRolesMockData = this.contextService.getDataByKey("wikiRolesMockData");
    this.isAdminAddWikiButtonDisplay = this.utilityService.decidingMethodTodisplay(wikiRolesMockData.wikiFeature.adminAddWiki);
    this.isApprovedWikiListDisplay = this.utilityService.decidingMethodTodisplay(wikiRolesMockData.wikiFeature.approvedWikiList);
    console.log(this.isAdminAddWikiButtonDisplay,this.isApprovedWikiListDisplay ,this.isAdmin)
    //Setting default value for everytime component initiallized
    this.contextService.addToContext("isSearchAtLoadTimeDone", false,);
    this.addWikiSubscription = this.wikiService.showAddWiki.subscribe(() => {
      // this.showCreateWiki('createWiki');
      this.isShowCreateWiki = true;
    })
    this.wikiResetSubscription = this.wikiService.newWiki.subscribe(data => {
      // this.display = null;
      this.isShowCreateWiki = false;
    })
    this.createWiki();
    this.getPDFData();
    this.getDataLinks();
    this.getWIPdfStyle();

  }

  ngOnDestroy() {
    this.addWikiSubscription && this.addWikiSubscription.unsubscribe();
    this.wikiResetSubscription && this.wikiResetSubscription.unsubscribe();
  }

  getWIPdfStyle(){
    let discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
    if (discrepancyUnitInfo  && discrepancyUnitInfo.CLIENTNAME === "DELL" && discrepancyUnitInfo.CONTRACTNAME === "DELL AIO") {
        this.isDellWIPdf = true;
    }
  }
  showAdminAddWiki() {
    this.isShowCreateWiki = true;
  }
  createWiki(){
    let discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo"); 
    if (discrepancyUnitInfo && discrepancyUnitInfo.CLIENTNAME === "DELL") {
      this.currentClient = "dellclient";
    }else{
      this.showCreateWiki('pdfSearch');
    }
  }
  ngAfterViewChecked() {
    var isSearchAtLoadTimeDone;
    var isWorkInstructionOpen;

    isSearchAtLoadTimeDone = this.contextService.getDataByKey("isSearchAtLoadTimeDone");
    isSearchAtLoadTimeDone = isSearchAtLoadTimeDone ? isSearchAtLoadTimeDone : false;

    isWorkInstructionOpen = this.contextService.getDataByKey("isWorkInstructionOpen");
    isWorkInstructionOpen = isWorkInstructionOpen ? isWorkInstructionOpen : false;

    if (isWorkInstructionOpen) {
      if (!isSearchAtLoadTimeDone) {
        var aTags = document.querySelectorAll("pdf-viewer .textLayer span");

        const searchText = "";
        var found;
        for (var i = 0; i < aTags.length; i++) {
          if (aTags[i].textContent.includes(searchText)) {
            if (aTags[i + 1].textContent.includes("")) {
              if (aTags[i + 2].textContent.includes("")) {
                found = aTags[i];
                break;
              }
            }
          }
        }
        if (found) {
          this.contextService.addToContext("isSearchAtLoadTimeDone", true);
          found && found.scrollIntoView();
        }
      }
    }

  }
  showCreateWiki(showData: string) {
    if(this.display === showData) {
      this.display = '';
    }else {
    this.display = showData;
    }
  }

  onClick(event) {
    let toggleAction = [{
      "type": "toggle",
      "eventSource": "click",
      "name": "subProcessRightNavref"
    },
    {
      "type": "updateComponent",
      "config": {
        "key": "pageopenUUID",
        "properties": {
          "hidden": false
        }
      },
      "eventSource": "click"
    }];
    toggleAction.forEach((eachAction) => {
      this.actionService.handleAction(eachAction, this);
    });
  }
  searchQueryChanged(newQuery: string) {
    if (newQuery !== this.pdfQuery) {
      this.pdfQuery = newQuery;
      this.pdfComponent.pdfFindController.executeCommand('find', {
        query: this.pdfQuery,
        highlightAll: true
      });
    } else {
      this.pdfComponent.pdfFindController.executeCommand('findagain', {
        query: this.pdfQuery,
        highlightAll: true
      });
    }
  }
  getPDFData() {
    this.urlData = '';
    let discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
    let body = {
      "clientId": "#userSelectedClient",
      "contractId": "#userSelectedContract",
      "loaderName": "DELL_CAR_DIFFICULTY",
      "modelNumber": "#discrepancyPartAndWarrantyDetails.MODEL_NUMBER",
      "userName": "#userAccountInfo.PersonalDetails.USERID"
    };
    let bodyObj = this.contextService.getParsedObject(body, this.utilityService);
    bodyObj = JSON.stringify(bodyObj);
    if (discrepancyUnitInfo && discrepancyUnitInfo.CLIENTNAME === "DELL" && discrepancyUnitInfo.CONTRACTNAME === "DELL AIO") {
      this.http.post(serviceUrls['getWorkInstDellEducateURLLink'], bodyObj, { headers: this.headers, observe: 'response' })
        .subscribe((resp: HttpResponse<any>) => {
          if (resp.body['status']) {
            let data = resp.body['data'];
            if (data != undefined) {
              if (data.notes4 != null && data.note4 != undefined && data.note4 != "") {
                this.urlData = data.notes4;
              }
            }
          }
        });
    } else {
      this.urlData = '';
    }
  }
  getDataLinks() {
    let linkData = '';
    let discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
    let linksInfo = this.contextService.getDataByString("#getProcess.workInstructionsLinksInfo");
    let userSelectedClientName = this.contextService.getDataByKey("userSelectedClientName");
    let userSelectedSubProcessTypeName = this.contextService.getDataByString("#userSelectedSubProcessType");
    const WC = this.contextService.getDataByKey("currentWC");
    if (discrepancyUnitInfo && discrepancyUnitInfo.CLIENTNAME === "DELL" &&  discrepancyUnitInfo.CONTRACTNAME === "DELL AIO" && linksInfo[WC]) {
      linkData = this.contextService.getDataByString("#getProcessWCData.dellWorKInstructionsLinks");
      this.urlData1 = linkData ? (linkData + discrepancyUnitInfo.SERIAL_NO + "/configuration") : '';
      this.name = "Dell Support";
    }else if(userSelectedClientName && userSelectedClientName === "HP" && linksInfo[WC]){
      linkData = this.contextService.getDataByString("#getReferenceDataKeys.hpWorKInstructionsLinks");
      if(userSelectedSubProcessTypeName && userSelectedSubProcessTypeName === "WC OPERATION"){
      this.urlData1= linkData ? (linkData + discrepancyUnitInfo.SERIAL_NO) : '';
      this.name = "Part Surfer";
      }
     }
    else {
      this.urlData1 = linkData  ? linkData : '';
    }
  }
}










