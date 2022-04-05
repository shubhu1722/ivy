import { Injectable } from '@angular/core';
import { DialogboxComponent } from '../../../common/dialogbox/dialogbox.component';
import { DialogboxwithmessageComponent } from '../../../common/dialogboxwithmessage/dialogboxwithmessage.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    public dialog: MatDialog
  ) { }
  toCloseAlltheDialog() {
    this.dialog.closeAll()
  }
  handleDialogbox(action, instance,actionService) {
    let onSuccessActions = [];
    let onFailureActions = [];
    
    let matDialogConfig: MatDialogConfig = {
      backdropClass: action.config.backdropClass,
      position: action.config.position,
      height: action.config.height,
      width: action.config.width,
      data: action.config
    }

    if(action.config.maxHeight !== undefined){
      matDialogConfig.maxHeight = action.config.maxHeight;
    }

    if(action.config.autoFocus !== undefined){
      matDialogConfig.autoFocus = action.config.autoFocus;
    }

    const dialogRef = this.dialog.open(DialogboxComponent, matDialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        // response for success.
        if (action.responseDependents.onSuccess !== undefined) {
          onSuccessActions = action.responseDependents.onSuccess.actions;
          onSuccessActions.forEach((element) => {
            actionService.handleAction(element, action.config);
          });
        }
      } else {
        // response for failure.
        if (action.responseDependents.onFailure != undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          if (onFailureActions) {
            onFailureActions.forEach((element) => {
              actionService.handleAction(element, action.config);
            });
          }
        }
      }
    });
  }

  handleDialogboxWithMessage(action, instance,actionService) {
    const dialogRef = this.dialog.open(DialogboxwithmessageComponent, {
      backdropClass: action.config.backdropClass,
      position: action.config.position,
      height: action.config.height,
      width: action.config.width,
      data: action.config,
    });
  }
}
