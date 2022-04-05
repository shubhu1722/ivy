import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { ContextService } from '../../services/commonServices/contextService/context.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ImageComponent implements OnInit {

  eventMap = [];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  @Input() css: string;
  @Input() imageSrc: string;
  @Input() imageClass: string;


  constructor(private contextService:ContextService) { }

  ngOnInit(): void {
    if(this.imageSrc && this.imageSrc !== undefined){
      if(this.imageSrc.startsWith('#')){
        this.imageSrc = this.contextService.getDataByString(this.imageSrc);
      }
    }
  }

}
