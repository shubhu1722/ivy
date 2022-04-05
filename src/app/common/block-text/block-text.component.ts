import { Component, OnInit, Input } from '@angular/core';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from 'src/app/utilities/utility.service';

@Component({
  selector: 'app-block-text',
  templateUrl: './block-text.component.html',
  styleUrls: ['./block-text.component.scss']
})
export class BlockTextComponent implements OnInit {
  @Input() text: string;
  @Input() class: string;
  @Input() textValue: string;
  constructor(private contextService: ContextService, private utilityService: UtilityService, translate: TranslateService
    ) {
      let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
    }

  ngOnInit(): void {
    if (this.text !== undefined) {
      if (this.utilityService.isString(this.text) && this.text.startsWith('#')) {
        this.text = this.contextService.getDataByString(this.text);
      }
    }

    if (this.textValue !== undefined) {
      if (this.utilityService.isString(this.textValue) && this.textValue.startsWith('#')) {
        this.textValue = this.contextService.getDataByString(this.textValue);
      }
    }
  }

}
