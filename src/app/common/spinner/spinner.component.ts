import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class SpinnerComponent implements OnInit {

  eventMap = [];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  @Input() color = 'primary';
  @Input() diameter = '100';
  @Input() mode : 'determinate' | 'indeterminate' = 'indeterminate';
  @Input() strokeWidth = '10';
  @Input() value = '50';

  constructor() { }

  ngOnInit(): void {
  }

}
