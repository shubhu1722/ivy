import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';

@Component({
  selector: 'app-content-renderer',
  templateUrl: './content-renderer.component.html',
  styleUrls: ['./content-renderer.component.scss']
})
export class ContentRendererComponent implements OnInit {

  @Input() css: string;
  @Input() visibility: true;
  @Input() hooks: any;
  @Input() validations: any;
  @Input() action: any;
  @Input() header: any = [];
  @Input() items: any = [];
  @Input() itemsData: any;
  @Input() footer: any = [];
  @Input() rightsidenav: any;
  @Input() contentClass: any;
  @Input() errorTitle: any;
  @Input() staticItem: any;
  @ViewChild('compTemplate', { static: true, read: ViewContainerRef }) compTemplate: ViewContainerRef;
  
  eventMap = [];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  constructor(private contextService: ContextService,
    private _changeDetectionRef: ChangeDetectorRef,
    private hookService: HookService) { }

  ngOnInit(): void {
    this.contextService.addToContext('compTemplate', this.compTemplate);
  }
  ngAfterViewInit() {
    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      const afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[3]);
      if (afterInitHooks !== undefined && afterInitHooks.length > 0) {
        this.hookService.handleHook(afterInitHooks, this);
      }
    }
  }
}
