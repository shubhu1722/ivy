import { Component, OnInit, Input } from '@angular/core';
import { AdComponent } from 'src/app/model';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.sass']
})
export class TextInputComponent implements OnInit, AdComponent {
  @Input('data') data;
  constructor() { }

  ngOnInit(): void {
  }

}
