import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-accordition-panel',
  templateUrl: './accordition-panel.component.html',
  styleUrls: ['./accordition-panel.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class AccorditionPanelComponent implements OnInit {
  @Input() header: {};
  @Input() footer: {};
  @Input() Items: [];
  @Input() disabled: boolean;
  @Input() expanded: boolean;
  @Input() hideToggle: boolean;
  @Input() togglePosition: string;
  @Input() collapsedHeight: string;
  @Input() expandedHeight: string;
  @Input() displayMode: string;
  @Input() multi: boolean;

  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];
  eventMap = [
    'beforePanelOpened',
    'beforePanelClosed',
    'afterPanelClosed',
    'afterPanelOpened',
  ];
  constructor() {}

  ngOnInit(): void {}
}
