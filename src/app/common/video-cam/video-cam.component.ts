import { MediaService } from './media-service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, TemplateRef, Input, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
// import StopIcon from '@material-ui/icons/Stop';
@Component({
  selector: 'app-video-cam',
  templateUrl: './video-cam.component.html',
  styleUrls: ['./video-cam.component.css']
})
export class VideoCamComponent implements OnInit, OnDestroy {

  @ViewChild('video', { static: true }) videoElement: ElementRef<HTMLVideoElement>;
  @ViewChild('videoDialog') videoDialog: TemplateRef<any>;
  @ViewChild('videoDlgContentCnt', { read: ElementRef }) videoDlgContCnt: ElementRef<HTMLElement>;
  @ViewChild('videoroot', { read: ElementRef }) videoRoot: ElementRef<HTMLElement>;
  recordingMode: boolean = true;
  recordingModeChanged: Subscription;
  videoUploadFinished: Subscription;
  dialogRef: any;
  isCollapsed = true;
  isCamActivated = false;
  serviceResponse: object;
  shippingVideoRecording: false;
  @Input() disabled: boolean;
  @Input()
  autoRecord: boolean = true;
  @Input()
  recordingTitle: string;
  @Input()
  dialogWidth: string = "30%";
  @Input() emptyCombinedChunks;
  @Input() style: string;
  @Input() visibility: boolean = true;
  @Input() hidden: boolean;
  @Input() isShownPlayback: boolean = true;

  constructor(private mediaService: MediaService, private contextService: ContextService, public dialog: MatDialog, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.shippingVideoRecording != undefined) {
      this.mediaService.shippingVideoRecording = this.shippingVideoRecording;
    }
    if (this.emptyCombinedChunks) {
      this.mediaService.combinedChunks = [];
    }
    this.recordingModeChanged = this.mediaService.onRecordingModeChanged.subscribe(

      (currentMode: boolean) => {

        this.recordingMode = currentMode;
        this.isCamActivated = true;
        this.ref.markForCheck();
      }
    );
    if (this.recordingTitle !== undefined) {
      if (this.recordingTitle.startsWith('#')) {
        this.recordingTitle = this.contextService.getDataByString(this.recordingTitle);
      }
    }
    this.contextService.contextSubjectData('VideoUploaded', true);
    this.videoUploadFinished = this.mediaService.onVideoUploaded.subscribe(
      (serviceMessage) => {
        this.serviceResponse = serviceMessage;
      }
    );
  }


  ngAfterViewInit() {
    this.mediaService.init(this.videoElement.nativeElement, this);
  }
  manageRecording(recordingMode) {

    this.mediaService.triggerRecording(recordingMode);
  }
  stopRecording() {
    if (this.isShownPlayback === false) {
      this.disabled = true;
    }
    this.mediaService.stopRecording();
    // this.manageRecording(true);
    // this.mediaService.upload(null);
  }

  playback() {
    this.mediaService.playbackRecording();
  }
  stopPlayback() {
    this.mediaService.stopPlaybackRecording();
  }
  upload() {
    this.mediaService.upload(null);
  }

  ngOnDestroy(): void {
    this.videoElement.nativeElement.removeAttribute('src');
    this.videoElement.nativeElement.load();
    this.recordingModeChanged.unsubscribe();
  }
  showHide() {
    this.isCollapsed = !this.isCollapsed;


    if (this.isCollapsed) {
      this.dialogRef.close();
    } else {

      this.dialogRef = this.dialog.open(this.videoDialog, {
        disableClose: true,
        position: {
          right: "0px",
          top: "100px"
        },
        hasBackdrop: false,
        width: this.dialogWidth
      });
    }

    this.dialogRef.afterOpened().subscribe(result => {
      this.videoElement.nativeElement.style.display = "block";
      this.videoDlgContCnt.nativeElement.appendChild(this.videoElement.nativeElement);
    });
    this.dialogRef.beforeClosed().subscribe(result => {
      this.videoElement.nativeElement.style.display = "none";
      this.videoRoot.nativeElement.appendChild(this.videoElement.nativeElement);
    });
    this.dialogRef.afterClosed().subscribe(result => {
      this.isCollapsed = true;
    });
  }
}