import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tab-panel',
  templateUrl: './tab-panel.component.html',
  styleUrls: ['./tab-panel.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class TabPanelComponent implements OnInit {
  @Input() animationDuration: string;
  @Input() backgroundColor: string;
  @Input() color: string;
  @Input() disablePagination: boolean;
  @Input() disableRipple: boolean;
  @Input() dynamicHeight: boolean;
  @Input() headerPosition: string;
  @Input() selectedIndex: number;
  @Input() disabled: boolean;
  @Input() position: number;
  @Input() tabstyle: string;
  @Input() tabcss: string;
  @Input() tabactive: string;
  @Input() label: string;
  eventMap = [
    'animationDone',
    'focusChange',
    'selectedIndexChange',
    'selectedTabChange',
  ];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];
  constructor() {}

  ngOnInit(): void {}
}
