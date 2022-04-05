import { ContextService } from '../../services/commonServices/contextService/context.service';
import { UtilityService } from './../../utilities/utility.service';
import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';

declare var getBaseURL;
declare var gatherData;

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.scss']
})
export class ImageGridComponent implements OnInit {
  @ViewChild('myPinchZoom', { static: false }) myPinchZoom;
  @ViewChild('testPinchZoom', { static: false }) testPinchZoom;
  @Input() imglist: any;
  @Input() imgUrlParam: any;
  @Input() uuid: string;
  @Input() name: string;
  @Input() text: string;
  @Input() class: string;
  @Input() modelTitle: any;

  selectedImage: string;
  selectedImageIndex: any;

  constructor(
    private utilityService: UtilityService,
    private contextService: ContextService
  ) {
  }

  ngOnInit(): void {
  }

  click(event) {
    if (this.imgUrlParam && this.imgUrlParam.startsWith('#')) {
      this.imgUrlParam = this.contextService.getDataByString(this.imgUrlParam);
      if(this.imgUrlParam !== null){
        this.imgUrlParam = this.imgUrlParam.trim();
      }
    }

    if (this.modelTitle && this.modelTitle.startsWith('#')) {
      this.modelTitle = this.contextService.getDataByString(this.modelTitle);
      this.modelTitle = this.modelTitle.trim();
    }

    gatherData(this.imgUrlParam, this.modelTitle);
  }

  ngAfterViewInit() {
  }
}