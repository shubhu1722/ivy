import { Injectable } from '@angular/core';
import { MediaService } from 'src/app/common/video-cam/media-service';

@Injectable({
  providedIn: 'root'
})
export class ReceivingVideoService {

  constructor(
    private mediaService: MediaService,
  ) { }
  onReceivingVedioScanClose() {
    this.mediaService.triggerRecording(true);
   // this.mediaService.upload(null);
  }

  // This is used to Stop recording only on DELL Receiving
  onExitVideoRecClose() {
    this.mediaService.stopRecordingforDELL(true);
  }
}
