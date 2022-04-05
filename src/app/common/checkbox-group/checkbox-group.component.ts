import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class CheckboxGroupComponent implements OnInit {

  eventMap = ['change'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  // @Input() checked = false;
  //  @Input() color = '';
  //  @Input() disableRipple = false;
  //  @Input() disabled = false;
  //  @Input() id = 'string';
  //  @Input() indeterminate = false;
  //  @Input() labelPosition: 'before' | 'after' = 'after';
  //  @Input() name = 'ChechBox';
  //  @Input() required = true;
  // @Input() value = '';
   @Input() items = [
    {  name: 'order 1' },
    {  name: 'order 2' },
    {  name: 'order 3' },
    {  name: 'order 4' }
   ];
   @Input() direction: 'horizantal' | 'vertical' = 'horizantal';
   @Input() rows = '';

   form:FormGroup;

   constructor(private fb: FormBuilder,
    translate: TranslateService
  ) { 
      let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  
    this.form = this.fb.group({
      checkArray: this.fb.array([], [Validators.required])
    })


  }

  ngOnInit(): void {
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;

    if (e.target) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }

    // console.log(this.form.value)
  }


  // submitForm() {
  //   console.log(this.form.value)
  // }


}
