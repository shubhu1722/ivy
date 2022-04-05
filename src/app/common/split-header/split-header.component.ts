import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-split-header',
  templateUrl: './split-header.component.html',
  styleUrls: ['./split-header.component.scss']
})
export class SplitHeaderComponent implements OnInit {
  @Input() headerTitleLabels: string[];
  @Input() headerTitleValues: string[];
  @Input() inputClasses: string[];
  @Input() headerClasses: string[];
  @Input() reworkClass: string;
  @Input() isReworkClass: boolean;
  constructor(private contextService: ContextService,
   private utilityService : UtilityService, translate: TranslateService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {
    /// Deserialize the values
    // const paramsObj = Object.assign({}, this.headerTitleLabels);
    // const bodyObj = this.contextService.getParsedObject(paramsObj);
    this.headerTitleLabels = this.contextService.getParsedObject(this.headerTitleLabels,this.utilityService);
    this.headerTitleValues = this.contextService.getParsedObject(this.headerTitleValues,this.utilityService);
    this.headerClasses = this.contextService.getParsedObject(this.headerClasses,this.utilityService);
    if(this.isReworkClass == undefined){
      this.isReworkClass = false
    }
    if(this.reworkClass != undefined){
      this.reworkClass = "body " + this.reworkClass;
    }
    else{
      this.reworkClass = "body greyish-black"
    }
  }
}
