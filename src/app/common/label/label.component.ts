import { ContextService } from '../../services/commonServices/contextService/context.service';
import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class LabelComponent implements OnInit {
  @Input() text: string;
  @Input() css: string;
  @Input() labelClass: string;
  @Input() hidden: boolean;
  constructor(public contextService: ContextService,
    private _changeDetectionRef: ChangeDetectorRef,
    translate: TranslateService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {
    if (this.text && this.text != undefined) {
      if(Array.isArray(this.text)){
        this.text = this.text.join(',');
      }else{
        if (this.text.startsWith('#')) {
          if (this.text === "#BomsByMainPartNo.TAN_IN") {
            let data = this.contextService.getDataByString(this.text);
            let result = data.map(a => a.compRegexp.split('-')[0] + "-" + a.compRegexp.split('-')[1]);
            this.text = result.toString();
          } else {
            this.text = this.contextService.getDataByString(this.text);
          }
        }
      }
    }
    if (this.labelClass !== undefined) {
      if (this.labelClass.startsWith('#')) {
        this.labelClass = this.contextService.getDataByString(this.labelClass);
      }
    }
    if(this.hidden == undefined){
      this.hidden = false
    }
  }
}

