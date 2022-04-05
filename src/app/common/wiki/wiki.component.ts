import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { data } from '../../data';
import { WikiList } from '../../model';
import { WikiService } from '../../services/commonServices/wikiService/wiki.service';
import { CommentsDialogBoxComponent } from '../comments-dialog-box/comments-dialog-box.component';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.scss']
})
export class WikiComponent implements OnInit, OnDestroy {

  @Input() selected: boolean;
  @Output() selectedChange = new EventEmitter<boolean>();
  isLoading = true;

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
  constructor(private wikiService: WikiService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.wikiService.getWikiData().subscribe((res: any) => {
      this.wikiTilesList = res.data ? res.data : [];
      this.isLoading = false;
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

  openDialog(wikiData) {
    const dialogRef = this.dialog.open(CommentsDialogBoxComponent, {
      data: wikiData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (wikiData['comments']) {
          wikiData['comments'].push(result);
        } else {
          wikiData['comments'] = [result];
        }
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

}