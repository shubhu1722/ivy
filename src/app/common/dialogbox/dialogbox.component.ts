import { Component, OnInit, Inject, ViewChild, ViewContainerRef, HostListener, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.scss']
})
export class DialogboxComponent implements OnInit {


  success = 'success';
  close = 'close';
  minimumWidth: boolean;
  private dialogOpened: boolean;
  @Input() isImage: boolean = false;
  isheader: boolean;
  @ViewChild('dialogcontent', { static: true, read: ViewContainerRef }) dialogcontent: ViewContainerRef;
  @ViewChild('footercontent', { static: true, read: ViewContainerRef }) footercontent: ViewContainerRef;

  constructor(
    private componentLoaderService: ComponentLoaderService,
    public dialogRef: MatDialogRef<DialogboxComponent>,
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
    let discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
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

    if (this.data.title == undefined || this.data.title == "") {
      setTimeout(() => {
        this.dialogRef.close()
      }, 3000)
    }
    if (this.data.isheader !== undefined || this.data.isheader) {
      this.isheader = false;
    } else {
      this.isheader = true;
    }
    if(this.data.title && (this.data.title.toUpperCase() === "HOLD")) {
      this.data.disableClose = true;
      if (discrepancyUnitInfo && (discrepancyUnitInfo.CLIENTNAME == "HP")) {
        let refData = this.contextService.getDataByKey(this.data.items[0].uuid + 'ref');
        refData.instance["isHoldDropdown"] = true
      }
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