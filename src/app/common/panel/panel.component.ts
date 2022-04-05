import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PanelComponent implements OnInit {
  @Input() header: {};
  @Input() footer: {};
  @Input() Items: [];
  constructor() {}

  ngOnInit(): void {}
}
