import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { WikiService } from '../../services/commonServices/wikiService/wiki.service';
import { WikiRichtextComponent } from '../wiki-richtext/wiki-richtext.component';

@Component({
  selector: 'app-comments-dialog-box',
  templateUrl: './comments-dialog-box.component.html',
  styleUrls: ['./comments-dialog-box.component.scss']
})
export class CommentsDialogBoxComponent implements OnInit, AfterViewInit {
  commentsList: any[] = [];
  WikiCrDetailsList: any[] = [];
  changeRequestTab = true;
  commentsTab = true;
  labelName=""
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  @ViewChild('tinyEditorData') myChild: WikiRichtextComponent;
  @ViewChild('tabGroup') tabGroup: any;

  constructor(
    private wikiService: WikiService, 
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<CommentsDialogBoxComponent>,
    private cdr: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
    
    this.getCommentsData();
    this.getVersionHistory();
  }

  addWikiComment = new FormGroup({
    addComment: new FormControl('', Validators.required)
  })

  saveAddComment() {
    
    const commentObj = {
      "wikiDocId": this.data.wikiDocId,
      "wikiCRData": this.myChild.wikiTinyEditorForm.value.wikiTinymce,
      "commentText": this.addWikiComment.value.addComment,
      "wikiCRVersion": this.data.wikiVersion,
      "wikiCRStatus": this.data.status,
      "userName": this.data.author,
      "imageSource": this.data.imageSource,
      "imageAlternateText": this.data.imageAlternateText,
      "imageWidth": this.data.imageWidth,
      "imageHeight": this.data.imageHeight,
      "attachmentUrl": this.data.attachmentUrl,
      "attachmentTitle": this.data.attachmentTitle,
      "attachmentDisplayText": this.data.attachmentDisplayText,
      "attachmentOpen": this.data.attachmentOpen
    }
    
    const commments = this.data.comments ? JSON.parse(JSON.stringify(this.data.comments)) : [];
    commments.push(commentObj);
    const body = JSON.parse(JSON.stringify(this.data));
    body['comments'] = commments;
    this.wikiService.updateWikiData(commentObj).subscribe((wikiCommentResult) => {
      this.getCommentsData();
      this.getVersionHistory();
      this._snackBar.open('Change Request Created Successfully', 'OK', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000,
        panelClass: ['custom-success']
      });
    });
    this.changeReq();
  }
  backToComments() {
    this.commentsTab = true;
  }
  changeReq() {
    this.commentsTab = !this.commentsTab;
    this.labelName="Change Request";
  }
  selectedTabValue(event){
    console.log(event);
    this.labelName = event.tab.textLabel;
  }
  getCommentsData() {
    const body = {
      "wikiDocId": this.data.wikiDocId,
      "wikiDocCRId": null,
      "wikiStatus": "PENDING FOR APPROVAL",
      "userName": this.data.author
    }
    this.wikiService.getCommentsData(body).subscribe((commentsResult: any) => {
      this.commentsList = commentsResult.data;
    });
  }
  getVersionHistory() {
    const crDetails = {
      "wikiDocId": this.data.wikiDocId,
      "userName": this.data.author
    }
    this.wikiService.getWikiCrDetails(crDetails).subscribe((CrResult: any) => {
      this.WikiCrDetailsList = CrResult.data;
    });
  }
  commentsCancel() {
    this.dialogRef.close(this.commentsList.length);
  }

  goToVersion(comment) {
    setTimeout(() => {
      const scrollEle = document.querySelector('.comments-dialog .mat-tab-body-wrapper .mat-tab-body:nth-child(2) .mat-tab-body-content');
      const ele = <HTMLElement>document.querySelector(`.id-${comment.wikiDocCrId}`);
      if (scrollEle && ele) {
        scrollEle.scrollTop = ele.offsetTop;
      }
    }, 100);
  }
  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }
  
  ngAfterViewInit() {
    if (this.data.tabType == 'vHistory') {
      this.tabGroup.selectedIndex = 1
      this.cdr.detectChanges();
    }
  }
}
