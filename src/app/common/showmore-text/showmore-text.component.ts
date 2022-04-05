import {Component, OnInit, Input } from '@angular/core';
import {ContextService} from '../../services/commonServices/contextService/context.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-showmore-text',
  templateUrl: './showmore-text.component.html',
  styleUrls: ['./showmore-text.component.scss']
})
export class ShowmoreTextComponent implements OnInit {
 @Input() showMore: boolean;
 @Input() text: string;
@Input() isShown : boolean;

 constructor(private contextService: ContextService,
  translate: TranslateService
) { 
  let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
}

  ngOnInit(): void {
    if (this.text !== undefined) {
      if (this.text.startsWith('#')) {
        this.text = this.contextService.getDataByString(this.text);
      }
    }
    this.isShown = this.isShown !== undefined ? this.isShown : true;
  }
}
