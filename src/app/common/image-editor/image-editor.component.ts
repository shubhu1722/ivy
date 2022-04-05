import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ContextService } from '../../services/commonServices/contextService/context.service';
// import *  as $ from 'jquery';
@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit {
  @Input() imageData: any;
  @ViewChild('myPinch') myPinch;
  scale:number=1;
  imageArray:any[] = [];
  @ViewChild('imageEditorModel') imageEditorModel: ElementRef;
  @ViewChild('imageDrawing') imageDrawing: any;
  imageChangedEvent: any = ''
  showImageEditing = false;
  public config = {
    ImageName: 'Some image',
    AspectRatios: ["4:3", "16:9"],
    ImageUrl: 'https://static.pexels.com/photos/248797/pexels-photo-248797.jpeg',
    ImageType: 'image/jpeg'
  }
  constructor(private contextService: ContextService) { }

  ngOnInit(): void {
    this.imageArray = this.contextService.getDataByString(this.imageData) ? this.contextService.getDataByString(this.imageData) : [];

  }

  showImageEditor() {
    this.imageEditorModel.nativeElement.style.display= 'block';
  }

  completePopup() {
    this.imageEditorModel.nativeElement.style.display= 'none';
  }

  closePopup() {
    this.imageEditorModel.nativeElement.style.display= 'none';
  }

  getPopupStyle() {

  }


  zoomIn() {
    //this.imageDrawing.nativeElement.style.transform = 'scale(' + this.scale + ')';
    
    // var canvas = document.querySelector(".canvas-container");
    // var canvas1 = document.querySelector(".lower-canvas");
    // var canvas2 = document.querySelector(".upper-canvas");
    // canvas.setAttribute("height", '730');
    // canvas.setAttribute("width",'730');
    // $(canvas).attr("style",'height:730px !important,width:730px !important');
    // $(canvas1).attr("style",'height:730px !important,width:730px !important');
    // $(canvas2).attr("style",'height:730px !important,width:730px !important');


  //   var canvas = document.querySelector(".upper-canvas");
  // canvas.setAttribute("width", "710");
  // canvas.setAttribute("height", "710");

  // var canvas1 = document.querySelector(".lower-canvas");
  // canvas1.setAttribute("width", "710");
  // canvas1.setAttribute("height", "710");
    this.scale=this.scale+.1
  }

  zoomOut() {
    this.scale=this.scale-.1
  }

  showMainImage() {
  }

  save(event) {

  }
  cancel() {

  }

  showEditor() {
    this.showImageEditing = true;
  }
}