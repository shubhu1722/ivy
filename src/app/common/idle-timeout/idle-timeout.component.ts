import { Component, Inject, Input, OnInit } from '@angular/core';
import { IdleTimeoutService } from '../../services/commonServices/idleTimeoutServices/idle-timeout.service';


@Component({
  selector: 'app-idle-timeout',
  templateUrl: './idle-timeout.component.html',
  styleUrls: ['./idle-timeout.component.scss']
})
export class IdleTimeoutComponent implements OnInit {
  constructor(public idletimeout: IdleTimeoutService) { }

  ngOnInit(): void {}
  
  

}
