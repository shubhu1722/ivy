import { Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { IdleTimeoutComponent } from '../../../common/idle-timeout/idle-timeout.component';
import { ActionService } from '../../action/action.service';
import { ContextService } from '../contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService implements OnInit {
  private userLoggedIn = new Subject<boolean>();
  idleState = "Not started.";
  timedOut = false;
  dialogRef:any;
  ngOnInit(): void {
  }
  
  constructor(translate: TranslateService, private idle: Idle, public dialog : MatDialog, private actionService : ActionService, private contextService : ContextService) {
    this.userLoggedIn.next(false);
   }
  
  timer(){
       
  // sets an idle timeout of 5 seconds, for testing purposes.
  this.idle.setIdle(Number(120));
  // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
  this.idle.setTimeout(Number(5));
  // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
  this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
  
  this.idle.onIdleEnd.subscribe(() => {
    this.idleState = "No longer idle."
  });
  this.idle.onTimeout.subscribe(() => {
    this.idleState = "Timed out!";
    this.dialogRef.close(IdleTimeoutComponent);
    this.timedOut = true;
    this.logout();
  });
  this.idle.onIdleStart.subscribe(
    () => {
      this.idleState = "You've gone idle!";
      this.dialogRef = this.dialog.open(IdleTimeoutComponent, {disableClose:true});
    }
  );
  this.idle.onTimeoutWarning.subscribe(
    countdown =>{
      this.idleState = "You will time out in " + countdown + " seconds!"
     }
      
  );
  this.getUserLoggedIn().subscribe(userLoggedIn => {
    if (userLoggedIn) {
      this.idle.watch()
      this.timedOut = false;
    } else {
      this.idle.stop();
    }
  })
  }
  logout(){
    this.actionService.handleAction(
      {
        "type": "renderTemplate",
        "config": {
          "templateId": "login.json",
          "mode": "local",
          "clearContext": true
        },
        "hookType": "afterInit"
      }, '')
      this.idle.stop();
      this.dialog.closeAll();
   }
   reset() {
    this.idle.watch();
    this.idleState = "Started.";
    this.timedOut = false;
   }
   setUserLoggedIn(userLoggedIn: boolean) {
    this.userLoggedIn.next(userLoggedIn);
  }
  closeDialog(){
    this.dialogRef.close(IdleTimeoutComponent);
  }
  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }
}
