import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { Router } from '@angular/router'
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class BreadcrumbComponent implements OnInit {
  eventMap = [];
  hookMap = [];
  @Input() class: string;
  @Input() style: string;
  @Input() breadcrumbs: any[];

  constructor(private router: Router, private contextService: ContextService,
    private utilityService: UtilityService,translate: TranslateService
    ) { 
      let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
    }

  ngOnInit(): void {
    this.breadcrumbs = this.contextService.getParsedObject(this.breadcrumbs, this.utilityService);
  }
}
