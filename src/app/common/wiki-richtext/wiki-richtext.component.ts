import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionService } from '../../services/action/action.service';
import { WikiService } from '../../services/commonServices/wikiService/wiki.service';
import { HttpClient } from '@angular/common/http';
import { ContextService } from '../../services/commonServices/contextService/context.service';

@Component({
  selector: 'app-wiki-richtext',
  templateUrl: './wiki-richtext.component.html',
  styleUrls: ['./wiki-richtext.component.scss']
})
export class WikiRichtextComponent implements OnInit {

  @Input() richtextClass: string;
  @Input() richtextContent: string;
  @Input() editRichtext: any;
  // @Output() wikiTinyMce = new EventEmitter<any>();
  @Output() editWikiTinyMce = new EventEmitter<any>();

  // wikiTinymce: any;
  richForm: any = FormGroup;
  richHTML: any;
  @Output() wikiTinyMce = new EventEmitter<any>(); 
  @Input() htmlContent: string;

  // wikiTinymce:any;


  editorConfig = {
    plugins: 'print preview powerpaste casechange importcss searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap quickbars emoticons advtable export',
    menubar: 'file edit view insert format tools table tc help',
    toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen preview save print | insertfile image media pageembed template link anchor codesample | ltr rtl ',
    height: 600,
    file_picker_callback:  (a,b,c) => {
      this.filesSelection(a,b,c)
    }
  }



  constructor(
    private actionService: ActionService, 
    private fb: FormBuilder,
    private wikiService : WikiService,
    public http: HttpClient,
    public contextService: ContextService) {
  }

  ngOnInit(): void {
    this.wikiTinyMce.emit(this.wikiTinyEditorForm.controls.wikiTinymce);
    if( this.editRichtext){
    this.editRichtext.forEach(ele => {
      if(ele.wikiData){
        this.wikiTinyEditorForm = new FormGroup({
          wikiTinymce: new FormControl(ele.wikiData, Validators.required)
        })
      }
      
    });
  }
  this.setWikiFormData();
  }

 
  tinyChangeEvent(eve){
    this.editWikiTinyMce.emit(this.wikiTinyEditorForm.controls.wikiTinymce);
    if(this.htmlContent){
    this.htmlContent = this.htmlContent;
    }
  }

  wikiTinyEditorForm = new FormGroup({
    wikiTinymce: new FormControl('', Validators.required)
  })

  setWikiFormData() {
    if (this.richtextContent) {
      this.htmlContent = this.richtextContent;
      this.wikiTinyEditorForm = new FormGroup({
        wikiTinymce: new FormControl(this.richtextContent, Validators.required)
      })
    }
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
        "key": "pageopenUUID",
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

  filesSelection(cb, value, meta) {
    const inputFileElem = document.createElement('input');
    inputFileElem.setAttribute('type', 'file');
    inputFileElem.setAttribute('accept', 'image/*');

    inputFileElem.onchange =  (event: any) => {
      const file = inputFileElem.files[0];

      const reader = new FileReader();
      reader.onload =  () => {
        const id = 'blobid' + (new Date()).getTime();
      };
      reader.readAsDataURL(file);
      reader.onload = (res: any) => {
        const userName = this.contextService.getDataByString("#userAccountInfo").PersonalDetails.USERID;
        let todayDate = new Date().getTime();
        let fileName = todayDate + "_" + userName + ".jpg";
        //const path = res.target.result;
        const blb = new Blob([reader.result], {type: 'image/jpg'});
        var formData = new FormData();
        formData.append('mediaBlob', blb);
        formData.append('fileName', fileName);
        this.http.post("https://apinlbqa.corp.ivytech.net/media-service/uploadWikiMedia", formData).subscribe((wikiResult) => {
          console.log('wikiResult', wikiResult);
          cb("http://moxiecode.cachefly.net/tinymce/v9/images/logo.png", { title: fileName });
        });
        
        //const base64 = path.split(',')[1];
        //cb("http://moxiecode.cachefly.net/tinymce/v9/images/logo.png", { title: file.name });

      };
    };

    inputFileElem.click();
  }

}
