import { Component, OnInit, Input } from '@angular/core';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
@Component({
  selector: 'app-disabled',
  templateUrl: './disabled.component.html',
  styleUrls: ['./disabled.component.scss']
})
export class DisabledComponent implements OnInit {

  @Input() disabledClass: string;
  @Input() uuid: string;

  constructor(
    private contextService: ContextService
  ) { }

  ngOnInit(): void {
  }

}
