import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { VideoCamComponent } from './video-cam.component';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { TransactionService } from 'src/app/services/commonServices/transaction/transaction.service';
import { formatDate } from '@angular/common';
import { contextKeysEnum } from 'src/app/utilities/constants';


declare var MediaRecorder: any;
@Injectable({
  providedIn: 'root',
})

export class MediaService {
  [x: string]: any;
  video: any;
  mediaRecorder: any;
  chunks = [];
  combinedChunks = [];
  recordedStream: any;
  shippingVideoRecording: boolean;
  private clientName: string;
  clickedStopRecording: boolean;

  videoConfig: any = {
    audio: false,
    video: {
      facingMode: "user"
      // width: { min: 640, ideal: 1280, max: 1920 },
      // height: { min: 480, ideal: 720, max: 1080 }
    }
  };

  //Subscription events
  onRecordingModeChanged = new Subject<boolean>();
  onVideoUploaded = new Subject<object>();

  // // mediaServiceBaseUrl: string = 'http://10.8.140.108:9666/copy-file/copyFile';//environment.mediaServiceBaseUrl;

  constructor(private httpClient: HttpClient, private contextService: ContextService, private transactionService: TransactionService) {

  }

  init(video: any, component: VideoCamComponent) {
    this.clickedStopRecording = false;
        //@clearing media related vars
    this.clearMediaService();

    this.video = video;
    if (component.autoRecord) {
      this.initRecording();
    }
  }
  triggerRecording(recordingMode) {
    if (!recordingMode) {
      this.initRecording();
    }
    else {
      this.stopRecording()
    }
  }
  playbackRecording() {
    const recordedStream = new Blob(this.chunks, { type: 'video/avi' });
    this.video.src = null;
    this.video.srcObject = null;
    this.video.src = window.URL.createObjectURL(recordedStream);
    this.video.controls = false;
    this.video.play();
  }
  stopPlaybackRecording() {
    this.video.pause();
  }

  upload(shippingVideoRecording) {
    this.clientName = this.contextService.getDataByKey(contextKeysEnum.userSelectedClientName);
    if (this.chunks.length && this.clientName) {
      var blob = new Blob(this.chunks, { 'type': 'video/avi;' });
      var trainingNumber = this.contextService.getDataByString('#userSearchCriteria.scan') ||
        this.contextService.getDataByString('#shippingTrackingNumber') || this.contextService.getDataByString('#dellReceivingTrackingFormData.dellReceivingScanTrackingNumber') || this.contextService.getDataByString('#userSearchCriteria.unitIdentificationValue');
      var scanNumber = this.contextService.getDataByString('#receivingSerialNumber') ||
        this.contextService.getDataByString('#discrepancyUnitInfo.SERIAL_NO') || this.contextService.getDataByString('#dellCarSearchTagNumber.dellCarSearchScanServiceTag') || this.contextService.getDataByString('#userSearchCriteria.unitIdentificationValue') || "";
      var userName = this.contextService.getDataByString('#userAccountInfo.PersonalDetails.USERID');
      let shippingFromDashboard = this.contextService.getDataByKey('shippingFromDashboard');
      if (shippingFromDashboard !== undefined && shippingFromDashboard) {
        scanNumber = this.contextService.getDataByKey('shippingSerialNo');
      }
      var file = "";
      var todayDate = new Date();
      this.todayDate = formatDate(todayDate, 'dd-MM-yyyy', 'en-US');
      if (scanNumber) {
        file = trainingNumber + "_" + scanNumber + "_" + userName + "_" + this.todayDate;
      } else {
        file = trainingNumber + "_" + userName + "_" + this.todayDate;
      }
      var fileName;
      this.contractName = this.contextService.getDataByKey(contextKeysEnum.userSelectedContractName);
      let contractId = this.contextService.getDataByString("#userSelectedContract")

      var formData = new FormData();
      let recordingPath = "videoPostApi";
      if (shippingVideoRecording != undefined && shippingVideoRecording) {
        fileName = file + ".avi";
        formData.append('mediaBlob', blob);
        formData.append('workCenterName', 'shipping');
        formData.append('fileName', fileName);
        recordingPath = "shippingPostApi";
      }
      //condition for uploading video only for DEll_Receiving
      else if (!shippingVideoRecording && this.clientName === 'DELL' && this.contractName === "DELL AIO") {
        let dellReceivingOrderDetails = this.contextService.getDataByString("#dellReceivingOrderDetails");
        fileName = file + ".avi";
        formData.append('mediaBlob', blob);
        formData.append('fileName', fileName);
        formData.append('ClientName', this.clientName);
        formData.append('locationId', dellReceivingOrderDetails.LOCATION_ID);
        formData.append('contractId', dellReceivingOrderDetails.CONTRACT_ID);
        if (dellReceivingOrderDetails && dellReceivingOrderDetails.CONTRACT_NAME && dellReceivingOrderDetails.CONTRACT_NAME === "DELL AIO") {
          formData.append('contractName', dellReceivingOrderDetails.CONTRACT_NAME);
        }
        recordingPath = "videoPostApi";
      }
      else if (this.clientName && this.clientName.toLocaleLowerCase() === 'dell' && this.contractName && this.contractName.toLocaleLowerCase() === 'car') {
        if(this.clickedStopRecording){
        scanNumber = this.contextService.getDataByString('#dellCarRecScanNumber');
        let currentWC = this.contextService.getDataByKey("currentWC");
        this.todayDate = formatDate(todayDate, 'yyyy-MM-dd', 'en-US');
        let time = formatDate(todayDate, 'hh-mm-ss', 'en-US');
        if (currentWC == "SHIPPING" || currentWC == "PACKING") {
          if (this.combinedChunks.length <= 1) {
            return;
          }
          file = "packing" + "_" + scanNumber + "_" + scanNumber + "_" + this.todayDate + "_" + time + "_" + userName;
          fileName = file + ".mp4";
          for (let i = 0; i < this.combinedChunks.length; i++) {
            let arr = []
            arr.push(this.combinedChunks[i])
            let blob = new Blob(arr, { 'type': 'video/mp4;' });
            formData.append('mediaBlob', blob);
          }
          // formData.append('mediaBlob', JSON.stringify(this.combinedChunks));
          formData.append('fileName', fileName);
          formData.append('ClientName', this.clientName);
          formData.append('contractId', contractId);
          formData.append('workCenterName', "DELL_CAR_PACKOUT");
          recordingPath = "dellcarPackoutUpload";
        }
        else {
          file = "receiving" + "_" + scanNumber + "_" + trainingNumber + "_" + this.todayDate + "_" + time + "_" + userName;
          fileName = file + ".avi";
          formData.append('mediaBlob', blob);
          formData.append('fileName', fileName);
          formData.append('ClientName', this.clientName);
          formData.append('contractId', contractId);
        }
      }
      else {
        return;
      }
      }
      else {
        fileName = file + ".avi";
        formData.append('mediaBlob', blob);
        formData.append('fileName', fileName);
      }
     this.contextService.deleteDataByKey('VideoUploaded');
      this.transactionService
        .post(recordingPath, formData)
        .subscribe(
          (resp: HttpResponse<any>) => {
            this.combinedChunks = [];
            this.onVideoUploaded.next(resp);
          }, error => {

            this.onVideoUploaded.next(error);
          });
    }
    {
      return;
    }
  }


  private initRecording() {
    var browser = <any>navigator;
    browser.getUserMedia = (
      browser.webkitGetUserMedia);
    browser.mediaDevices.getUserMedia(this.videoConfig).then(stream => {

      if ("srcObject" in this.video) {
        this.video.srcObject = stream;
      }
      else {
        //old version
        this.video.src = window.URL.createObjectURL(stream);
      }

      //this.startRecording(stream);
      this.startRecording(stream);
      this.recordedStream = stream;
    });
  }

  startRecording(stream: any) {
    var options;
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      options = { mimeType: 'video/webm; codecs=vp9' };
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      options = { mimeType: 'video/webm; codecs=vp8' };
    } else {
      // ...
    }
    this.mediaRecorder = new MediaRecorder(stream, options);
    this.mediaRecorder.start();

    this.chunks = [];
    let currentWC = this.contextService.getDataByKey("currentWC");

    this.chunks = [];
    this.mediaRecorder.ondataavailable = (e) => {

      this.chunks.push(e.data);
      this.combinedChunks.push(e.data);
      if (this.chunks.length <= 1) {
        this.upload(this.shippingVideoRecording);
      }
    };

    this.mediaRecorder.onstop = e => {
      this.stopCamera();
    };

    this.onRecordingModeChanged.next(true);
  }

  stopRecording() {
    var self = this;
    this.clickedStopRecording = true;
    self.myVar = setInterval(myTimer, 2000);
    function myTimer() {
      if (self.mediaRecorder) {
        self.mediaRecorder.stop();
        self.onRecordingModeChanged.next(false);
        clearInterval(self.myVar);
      }
    }
  }

  stopRecordingforDELL(recordingMode) {
    if (!recordingMode) {
      this.initRecording();
    }
    else {
      var self = this;
      self.myVar = setInterval(myTimer, 2000);
      function myTimer() {
        if (self?.mediaRecorder?.state === 'inactive') {
          self.mediaRecorder.onstop();
          self.onRecordingModeChanged.next(false);
          clearInterval(self.myVar);
        }
        else {
          self?.mediaRecorder?.onstop();
        }
      }
     // this.chunks.push(1);
    }
  }

  private stopCamera() {
    this.video.pause();
    this.recordedStream.getTracks().forEach(function (track) {
      if (track.readyState == 'live') {
        track.stop();
      }
    });
  }

  clearMediaService() {
    this.chunks = [];

    if (this.recordedStream) {
      this.recordedStream.getTracks().forEach(function (track) {
        if (track.readyState == 'live') {
          track.stop();
        }
      });

      this.recordedStream = "";
    }

    if (this.mediaRecorder) {
      if ((this.mediaRecorder.state === "recording") || (this.mediaRecorder.state === "paused")) {
        this.mediaRecorder.stop();
      }

      this.mediaRecorder = "";
    }

    if (this.video) {
      this.video = "";
    }
  }
}