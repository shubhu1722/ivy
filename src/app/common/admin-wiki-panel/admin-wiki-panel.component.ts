import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActionService } from '../../services/action/action.service';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { WikiService } from '../../services/commonServices/wikiService/wiki.service';
import { UtilityService } from '../../utilities/utility.service';

@Component({
  selector: 'app-admin-wiki-panel',
  templateUrl: './admin-wiki-panel.component.html',
  styleUrls: ['./admin-wiki-panel.component.scss']
})
export class AdminWikiPanelComponent implements OnInit {
  @Input() isWikiDraft :boolean=false
  @Input() isWikiAdmin :boolean
  @Input() isAdminAddWikiButtonDisplay:boolean
  @Input() isApprovedWikiListDisplay:boolean
  @Input() isAdmin :boolean =false;
  addWikiSubscription: Subscription;
  wikiResetSubscription: Subscription;
  isShowCreateWiki: boolean;
  constructor(private contextService: ContextService, private actionService: ActionService, private http: HttpClient, private utilityService: UtilityService, private wikiService: WikiService ,  private _changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    let wikiRolesMockData = this.contextService.getDataByKey("wikiRolesMockData");
    this.isAdminAddWikiButtonDisplay = this.utilityService.decidingMethodTodisplay(wikiRolesMockData.wikiFeature.adminAddWiki);
    this.isApprovedWikiListDisplay = this.utilityService.decidingMethodTodisplay(wikiRolesMockData.wikiFeature.approvedWikiList);
    console.log(this.isAdminAddWikiButtonDisplay,this.isApprovedWikiListDisplay ,this.isAdmin)
    //Setting default value for everytime component initiallized
    this.contextService.addToContext("isSearchAtLoadTimeDone", false,);
    this.addWikiSubscription = this.wikiService.showAddWiki.subscribe(() => {
      // this.showCreateWiki('createWiki');
      this.isShowCreateWiki = true;
    })
    this.wikiResetSubscription = this.wikiService.newWiki.subscribe(data => {
      // this.display = null;
      this.isShowCreateWiki = false;
    })
  }
  onClick(event) {
    let toggleAction = [{
      "type": "toggle",
      "eventSource": "click",
      "name": "subProcessRightNavref"
    },
    {
      "type": "updateComponent",
      "config": {
        "key": "pageopenWikiUUID",
        "properties": {
          "hidden": false
        }
      },
      "eventSource": "click"
    }];
    toggleAction.forEach((eachAction) => {
      this.actionService.handleAction(eachAction, this);
    });
  }

  showAdminAddWiki() {
    this.isShowCreateWiki = true;
  }

}
