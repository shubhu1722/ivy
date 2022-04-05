import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Subject } from 'rxjs';
import { serviceUrls } from '../../../../environments/serviceUrls';
import { ContextService } from '../contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class WikiService {
  newWiki = new Subject<any>();
  showAddWiki = new Subject<any>();
  pendingMyWiki = new Subject<any>();
  pendingMyWikiEditBtn = new Subject<any>();
  editWikiData = new BehaviorSubject<any>(null);
  getUserDetails = serviceUrls.getUserAccountInfo;
  getDefectCodeDetails = serviceUrls.getWikiDefectCodeByDefectGroup;
  commentsUrl = 'http://localhost:3000/comments';
  postsUrl = 'http://localhost:3000/comments';
  addWikiUrl = serviceUrls.addWiki;
  // addWikiUrl = "http://localhost:3000/wikis";
  // getWikiUrl = "../assets/Responses/getWikiMockData.json"
  getWikiUrl = serviceUrls.getWiki;
  getWikiUserDetailsUrl = serviceUrls.getWikiUserDetails;
  getWikiContextUrl = serviceUrls.getWikiContext;
  getUnitDetails = serviceUrls.getUnitDetails;
  getPendingWiki = serviceUrls.getAllWikiItems;
  getWikiStatus = serviceUrls.getWikiStatus;
  updateWikiCr = serviceUrls.updateWikiCr;

  pendingWiki:any = [];
  addChangeRequest = serviceUrls.addChangeRequest;
  getCommentsUrl = serviceUrls.getComments;
  getWikiSaveDraftUrl = serviceUrls.getWikiJsonReponse;
  getMyDraftJsonReponseUrl = serviceUrls.getMyDraftJsonReponse;
  saveWikiDraftUrl = serviceUrls.saveWikiJsonResponse;
  deleteWikiDraftUrl = serviceUrls.deleteJsonResponseData;
  getWikiCrDetailsUrl = serviceUrls.getWikiStatus;

  constructor(private http: HttpClient, private contextService: ContextService) { }

  getUserData() {
    const uName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    return this.http.get(this.getUserDetails + "?username=" + uName)
  }
  getWikiContextData() {
    const uName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    return this.http.get(this.getWikiContextUrl + "?userName=" + uName)
  }
  getUnitDetailsData() {
    const uName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    return this.http.get(this.getUnitDetails + "?userName=" + uName)
  }
  getWikiUserDetailsData() {
    const uName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    return this.http.get(this.getWikiUserDetailsUrl + "?userName=" + uName)
  }
  getMyDraftJsonReponseData() {
    const uName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    return this.http.get(this.getMyDraftJsonReponseUrl + "?userName=" + uName)
    
  }
  deleteMyDraftJsonReponse(jsonResponseId) {
    const uName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    return this.http.get(this.deleteWikiDraftUrl + "?userName="+uName+"&jsonResponseId="+jsonResponseId )
  }
  getAdminWikiData(searchBody?: any) {
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    const body = {
      "locationId": searchBody.location,
      "clientId": searchBody.client,
      "contractId": searchBody.contract,
      "workCenterId": searchBody.workCenter,
      "userName": userName,
      "family": searchBody.family,
      "platform": searchBody.platform,
      "modelPart": searchBody.modelPart,
      "commodity": searchBody.commodity,
      "defect": searchBody.defect,
      "wikiStatus": "APPROVED"
    }
    return this.http.post(this.getWikiUrl, body)
  }
  getAdminFilterWikiData(searchBody?: any) {
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    let selectedWorkCenterValue = this.contextService.getDataByKey("dellCarWikiWorkCenterMultiSelectDropdownVal");
    let selectedFamilyValue = this.contextService.getDataByKey("dellCarWikiFamilyMultiSelectDropdownVal");
    let selectedPlatformValue = this.contextService.getDataByKey("dellCarWikiPlatformMultiSelectDropdownVal");
    let selectedCommodityValue = this.contextService.getDataByKey("dellCarWikiCommodityMultiSelectDropdownVal");
    let defectStr = this.contextService.getDataByKey("dellCarWikiDefect1MultiSelectDropdownVal");
    let defect2Str = this.contextService.getDataByKey("dellCarWikiDefect2MultiSelectDropdownVal");
    let defect3Str = this.contextService.getDataByKey("dellCarWikiDefect3MultiSelectDropdownVal");
    let selectedInstLangValue = this.contextService.getDataByKey("dellCarWikiInstLangMultiSelectDropdownVal");
    let selectedStatusValue = this.contextService.getDataByKey("dellCarWikiStatusMultiSelectDropdownVal");
    let combineDefectStr = defectStr;
    if (defect2Str) {
      combineDefectStr = combineDefectStr + "|" + defect2Str
    }
    if (defect3Str) {
      combineDefectStr = combineDefectStr + "|" + defect3Str
    }debugger
    const body = {
      "locationId": null,
      "clientId": null,
      "contractId": null,
      "workCenterId": selectedWorkCenterValue ? selectedWorkCenterValue[0] : null,
      "userName": userName,
      "family": selectedFamilyValue ? selectedFamilyValue[0] :null,
      "platform": selectedPlatformValue ? selectedPlatformValue[0] :null,
      "modelPart": null,
      "commodity": selectedCommodityValue ? selectedCommodityValue[0] :null,
      "defect": null,
      "wikiStatus": selectedStatusValue ? selectedStatusValue[0] : null
    }
    return this.http.post(this.getWikiUrl, body)
  }
  getWikiData(searchBody?: any) {
    const unitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    let  body = {
      "locationId":null,
      "clientId": null,
      "contractId": null,
      "workCenterId": null,
      "userName": userName,
      "family": null,
      "platform": null,
      "modelPart": null,
      "commodity": null,
      "defect": null,
      "wikiStatus": "APPROVED"
    }
    if (searchBody) {
      if(searchBody.location) {
        body.locationId = searchBody.location;
        body.clientId = searchBody.client;
        body.contractId = searchBody.contract;
        body.workCenterId = searchBody.workCenter;
      }
      body.family = searchBody.family;
      body.platform = searchBody.platform;
      body.modelPart = searchBody.modelPart;
      body.commodity = searchBody.commodity;
      body.defect = searchBody.defect;
    }else{
       body ={
        "locationId": unitInfo.GEONAME,
        "clientId": unitInfo.CLIENTNAME,
        "contractId": unitInfo.CONTRACTNAME,
        "workCenterId": unitInfo.WORKCENTER,
        "userName": userName,
        "family": null,
        "platform": null,
        "modelPart": null,
        "commodity": null,
        "defect": null,
        "wikiStatus": "APPROVED"
      }
    }
    return this.http.post(this.getWikiUrl, body)
  }
  getDraftWikiData(searchBody?: any,unitDetails? :any ) {
    const unitInfo = unitDetails;
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    const body = {
      "locationId": unitInfo.LOCATION_ID,
      "clientId": unitInfo.CLIENT_ID,
      "contractId": unitInfo.CONTRACT_ID,
      "workCenterId": unitInfo.WORKCENTER_ID,
      "userName": userName,
      "family": null,
      "platform": null,
      "modelPart": null,
      "commodity": null,
      "defect": null,
      "wikiStatus": "APPROVED"
    }
    if (searchBody) {
      body.family = searchBody.family;
      body.platform = searchBody.platform;
      body.modelPart = searchBody.modelPart;
      body.commodity = searchBody.commodity;
      body.defect = searchBody.defect;
    }
    return this.http.post(this.getWikiUrl, body)
  }

  getPendingWikiData(st:any){
    const status = st.status;
    console.log(status);
    
    return this.http.get(this.getPendingWiki + "?status="+status);
  }

  getUpdatedPendingList(){
    const status = "PROCESS,PENDING FOR APPROVAL"
    console.log(status);
    
    return this.http.get(this.getPendingWiki + "?status="+status);
  }
  getPendingWikiStatus(wiki,wikiCRData){
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    const body = {
      "wikiDocId": wiki.wikiDocId,
      "wikiDocCrId": wiki.wikiDocCRId,
      "wikiCRData": wikiCRData,
      "wikiCRStatus": wiki.status,
      "userName": userName,
      "imageSource": "imageSource",
      "imageAlternateText": "imageAlternateText",
      "imageWidth": "imageWidth",
      "imageHeight": "imageHeight",
      "attachmentUrl": "attachmentUrl",
      "attachmentTitle": "attachmentTitle",
      "attachmentDisplayText": "attachmentDisplayText",
      "attachmentOpen": "attachmentOpen",
      "commentText":"commen change change text",
      "experience": wiki.experience,
      "instructionType": wiki.instructionType,
      "instructionLanguage": wiki.instructionLanguage
    }
    return this.http.post(this.updateWikiCr, body);
  }
  updatePendingWikiData(wikiDocCRId){
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;

    const body = {
      "wikiCrId":wikiDocCRId,
      "userName":userName
     }
    return this.http.post(this.getWikiStatus, body);
  }
  getAdminDefectCodeData(defectData) {
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    const body = {
      "locationId": defectData.LOCATION_ID,
      "clientId": defectData.CLIENT_ID,
      "contractId": defectData.CONTRACT_ID,
      "orderProcessType": null,
      "path": null,
      "userName": userName
    }
    return this.http.post(this.getDefectCodeDetails, body);
  }
  getDefectCodeData() {
    const unitInfo = this.contextService.getDataByKey("discrepancyUnitInfo") ;
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    const body = {
      "locationId": unitInfo.LOCATION_NAME,
      "clientId": unitInfo.CLIENT_NAME,
      "contractId": unitInfo.CONTRACT_NAME,
      "orderProcessType": null,
      "path": null,
      "userName": userName
    }
    return this.http.post(this.getDefectCodeDetails, body);
  }

  getAdminWikiDefectCodeData() {
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    const body = {
      "userName": userName
    }
    return this.http.post(this.getDefectCodeDetails, body);
  }
  getDefectCodeDataDetails(unitDetails) {
    const unitInfo = unitDetails  ;
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    const body = {
      "locationId": unitInfo.LOCATION_ID,
      "clientId": unitInfo.CLIENT_ID,
      "contractId": unitInfo.CONTRACT_ID,
      "orderProcessType": unitInfo.ROUTE,
      "path": null,
      "userName": userName
    }
    return this.http.post(this.getDefectCodeDetails, body);
  }
  getCommentsData(body) {
    return this.http.post(this.getCommentsUrl, body);
  }
  saveWikiData(data: any) {
    return this.http.post(this.addWikiUrl, data);
  }
  updateWikiData(body: any) {
    return this.http.post(this.addChangeRequest, body);
  }
  saveCommentsData(data: any) {
    return this.http.post(this.commentsUrl, data);
  }

  getWikiSaveDraftData() {
    const partNO = this.contextService.getDataByString("#repairUnitInfo.PART_NO");
    return this.http.get(this.getWikiSaveDraftUrl + "?partNo=" + partNO)
  }
  saveWikiSaveDraft(saveDraftData) {
    const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
    const partNO = this.contextService.getDataByString("#repairUnitInfo.PART_NO");
    const body = {
      partNo: partNO,
      userName: userName,
      pagePayload: saveDraftData,
    }
    return this.http.post(this.saveWikiDraftUrl, body);
  }
  getWikiCrDetails(body) {
    return this.http.post(this.getWikiCrDetailsUrl, body);
  }
}
