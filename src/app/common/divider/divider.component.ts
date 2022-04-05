import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DividerComponent implements OnInit {

  eventMap = [];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  @Input() inset: boolean;
  @Input() vertical: boolean;
  @Input() css: string;
  @Input() dividerClass: string;
  constructor() { }

  ngOnInit(): void {
  }




}
