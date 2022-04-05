import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-inline-text',
  templateUrl: './inline-text.component.html',
  styleUrls: ['./inline-text.component.scss']
})
export class InlineTextComponent implements OnInit {
  @Input() text: string;
  @Input() class: string;
  @Input() hidden: boolean;
  constructor(translate: TranslateService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {
    this.hidden = this.hidden !== undefined ? this.hidden : false;
  }

}
