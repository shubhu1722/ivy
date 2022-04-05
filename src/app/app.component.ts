import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from './utilities/utility.service';
import { IdleTimeoutService } from './services/commonServices/idleTimeoutServices/idle-timeout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'myApp';

  constructor(translate: TranslateService, private utilityService: UtilityService, private idletimout : IdleTimeoutService) {
    localStorage.setItem('language', 'english');
  }

  // useLanguage(language: string) {
  //    this.translate.use(language);
  //   }

  ngOnInit(): void {
    /// register the svg icons
    this.utilityService.registerSvgIcons();
    this.idletimout.timer();
  }
}


