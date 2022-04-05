import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-spacer',
  templateUrl: './spacer.component.html',
  styleUrls: ['./spacer.component.scss']
})
export class SpacerComponent implements OnInit {
  @HostBinding('class') classes = 'empty-space';
  constructor() { }

  ngOnInit(): void {
  }
}

