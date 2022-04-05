import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { data } from '../../data';
import { WikiList } from '../../model';
import { WikiService } from '../../services/commonServices/wikiService/wiki.service';
import { CommentsDialogBoxComponent } from '../comments-dialog-box/comments-dialog-box.component';

@Component({
  selector: 'app-wiki-list',
  templateUrl: './wiki-list.component.html',
  styleUrls: ['./wiki-list.component.scss']
})
export class WikiListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() wikisList: WikiList[];
  @Input() isHideAddWiki: Boolean;

  step = 0;
  newWikiSubscribe: Subscription;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  wikiTilesList: WikiList[] = [];
  constructor(private wikiService: WikiService, public wikiDialog: MatDialog) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.setWikiList(this.wikisList);
  }

  setWikiList(list: WikiList[]) {
    console.log("list", list);
    
    this.wikiService.getUserData().subscribe((data: any) => {
      console.log("data",data);
      list.forEach(wiki => {
        wiki.display = {};
        wiki.display.location = wiki.locationId ? wiki.locationId : '';
        wiki.display.client = wiki.clientId ? wiki.clientId : '';
        wiki.display.contract = wiki.contractId ? wiki.contractId : '';
        wiki.display.workCenter = wiki.workCenterId ? wiki.workCenterId : '';
        wiki.display.family = wiki.family ? wiki.family : '';
        wiki.display.platform = wiki.platform ? wiki.platform : '';
        wiki.display.modelNo = wiki.modelPart ? wiki.modelPart : '';
        wiki.display.commodity = wiki.commodity ? wiki.commodity : '';
        wiki.display.defect = wiki.defect ? wiki.defect : '';
      });
      this.wikiTilesList = list;
    });
  }

  ngOnDestroy() {
    this.newWikiSubscribe && this.newWikiSubscribe.unsubscribe();
  }

  showCreateWiki() {
    this.wikiService.showAddWiki.next(true);
  }

  setWikiFormData(data, index: number) {
    this.wikiService.editWikiData.next({ data: data, editId: data.id });
    this.showCreateWiki();
  }

  openDialog(wikiData, type) {
    const dialogRef = this.wikiDialog.open(CommentsDialogBoxComponent, {
      height: '650px',
      width: '850px',
      data: {...wikiData, tabType: type}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        wikiData['commentsCount'] = result;
      }
    });
  }

  toggleReaction(data: any, type: string) {
    if (type === 'like') {
      data['isDisliked'] = false;
      data['isLiked'] = !data['isLiked'];
    } else if (type === 'dislike') {
      data['isLiked'] = false;
      data['isDisliked'] = !data['isDisliked'];

    }
  }

  wikiExpand(wikiData) {
    const body = {
      "wikiDocId": wikiData.wikiDocId,
      "wikiDocCRId": null,
      "wikiStatus": "PENDING FOR APPROVAL",
      "userName": wikiData.author
    }
    this.wikiService.getCommentsData(body).subscribe((commentsResult: any) => {
      wikiData['commentsCount'] = commentsResult.data.length;
    });
  }

}
