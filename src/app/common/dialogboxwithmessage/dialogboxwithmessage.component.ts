import { Component, OnInit, Inject, ViewChild, ViewContainerRef, HostListener, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dialogboxwithmessage',
  templateUrl: './dialogboxwithmessage.component.html',
  styleUrls: ['./dialogboxwithmessage.component.scss']
})
export class DialogboxwithmessageComponent implements OnInit {


  success = 'success';
  close = 'close';
  minimumWidth: boolean;
  private dialogOpened: boolean;
  @Input() isImage: boolean = false;
  @Input() showErrorMessage:any;
  @ViewChild('dialogcontent', { static: true, read: ViewContainerRef }) dialogcontent: ViewContainerRef;
  @ViewChild('footercontent', { static: true, read: ViewContainerRef }) footercontent: ViewContainerRef;
  @ViewChild('holdErrorMessage', { static: true, read: ViewContainerRef }) holdErrorMessage: ViewContainerRef;
  constructor(
    private componentLoaderService: ComponentLoaderService,
    public dialogRef: MatDialogRef<DialogboxwithmessageComponent>,
    private contextService: ContextService,
    @Inject(MAT_DIALOG_DATA) public data,
    private translate: TranslateService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {
    this.minimumWidth = this.data.minimumWidth !== undefined ? this.data.minimumWidth : true,
      this.dialogOpened = false;
    this.data.group = new FormGroup({});
    this.data.items.forEach((item) => {
      this.data.group.addControl(item.name, new FormControl(item.value));
    });

    if (this.data && this.data.isImage) {
      this.isImage = this.data.isImage;
    }

    if (this.data && this.data.items && this.data.items.length > 0) {
      this.data.items.forEach((item) => {
        item.group = this.data.group;
        this.componentLoaderService.parseData(item, this.dialogcontent);
      });
    }
    if (this.data && this.data.footer && this.data.footer.length > 0) {
      this.data.footer.forEach((item) => {
        item.group = this.data.group;
        this.componentLoaderService.parseData(item, this.footercontent);
      });
    }
    this.dialogRef.afterOpened().subscribe(() => {
      this.dialogOpened = true;
    });

    if (this.data.title !== undefined) {
      if (this.data.title.startsWith('#')) {
        this.data.title = this.contextService.getDataByString(this.data.title);
      }
    }

    if(this.data.title && (this.data.title.toUpperCase() === "HOLD")) {
      this.data.disableClose = true;
    }
    
    if ((this.data.disableClose !== undefined && this.data.disableClose)) {
      this.dialogRef.disableClose = this.data.disableClose;
    }
  }

  @HostListener('window:click')
  onNoClick(): void {
    // if (this.dialogOpened){
    //   this.dialogRef.close();
    // }
  }
}