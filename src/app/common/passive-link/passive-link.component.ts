import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';

@Component({
  selector: 'app-passive-link',
  templateUrl: './passive-link.component.html',
  styleUrls: ['./passive-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PassiveLinkComponent implements OnInit {

  @Input() linkClass;
  @Input() actions: any[] = [];
  @Input() name;
  @Input() visibility;
  eventMap = ['click'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];
  constructor(private eventprocessor: EventServiceService, private _changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  onLinkClick(event) {
    const eventType = { type: 'click' };
    this.eventMap.forEach((ele) => {
      if (ele === eventType.type) {
        this.eventprocessor.handleEvent(this, eventType);
      }
    });
  }
}
