import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ETravellerComponent } from 'src/app/common/etraveller/etraveller.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ContextService } from '../../services/commonServices/contextService/context.service';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class LinkComponent implements OnInit {

  eventMap = ['click'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  @Input() href;
  @Input() name;
  @Input() linkstyle;
  @Input() linkcss;
  @Input() actions = [];
  @Input() visibility;

  constructor(private http: HttpClient,
              private translate: TranslateService,
              private _changeDetectionRef: ChangeDetectorRef,
              public dialog: MatDialog,
              private contextService: ContextService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {
    this.visibility = !!this.visibility ? this.visibility : true;
    let discrepancyUnitInfo = this.contextService.getDataByString("#discrepancyUnitInfo");
    if (!!discrepancyUnitInfo.CONTRACTNAME && discrepancyUnitInfo.CONTRACTNAME.toLowerCase() === "dell aio" && this.href === undefined) {
      this.visibility = false;
    }
  }

  onLinkClick(event){
    // Firefox 1.0+
    var userAgent = window.navigator.userAgent;
    var index = userAgent.indexOf("Firefox");
    if(index > 0){
      //window.open(this.href,'_blank');
    }
    //window.open(this.href,'_blank','',true);
    //this.downloadPDF(this.href);

    if(this.actions.length >0){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.hasBackdrop = false;
      dialogConfig.data = this.actions;
      const dialogRef = this.dialog.open(ETravellerComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if(result == 'success'){
          //this.getBeneficiaryDate();
          debugger;
        }
      });
      return false; 
    }
  }

  downloadPDF(url): any {
    //'Authorization': 'Basic ' + encodedAuth,
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/pdf',
      }),
      responseType: 'text' as 'text'
    };
    return this.http.get(url, options).pipe(map(data => {
      return data;
    })).subscribe(result => {


      window. open("data:application/pdf," + result,'_blank');
      // base64 string
      var base64str = result;

      // decode base64 string, remove space for IE compatibility
      var binary = atob(base64str.replace(/\s/g, ''));
      var len = binary.length;
      var buffer = new ArrayBuffer(len);
      var view = new Uint8Array(buffer);
      for (var i = 0; i < len; i++) {
          view[i] = binary.charCodeAt(i);
      }

      // create the blob object with content-type "application/pdf"               
      var blob = new Blob( [view], { type: "application/pdf" });
      var url = URL.createObjectURL(blob);
      //const fileURL = URL.createObjectURL(res);
      //window.open(fileURL, '_blank');
    });
    // .map(
    //     (res) => {
    //         return new Blob([res.blob()], { type: 'application/pdf' });
    //   });
  }

}
