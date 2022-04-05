import { Injectable } from '@angular/core';
import { UtilityService } from '../../../utilities/utility.service';
import { ContextService } from '../contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationalService {

  constructor(
    private contextService: ContextService,
    private utilityService : UtilityService
  ) { }
  handleConditionalFilter(action, instance,actionService) {
    let onSuccessActions = [];
    let onFailureActions = [];
    let lhs = action.config.lhs;
    let rhs = action.config.rhs;
    if (action.config.incriment === 1) {
      lhs = instance.parentuuid + 1;
    }
    if (lhs !== undefined) {
      if (this.utilityService.isString(lhs) && lhs.startsWith('#')) {
        lhs = this.contextService.getDataByString(lhs);

        if (lhs instanceof Array && action.config.lhsKeyName !== undefined) {
          lhs = this.utilityService.getElementBykeyName(
            lhs,
            action.config.lhsKeyName,
            action.config.lhsKeyValue,
            action.config.lhsSecondKeyName
          );
          if(action.config.lhsKeyValueToUpperCase !== undefined && 
            action.config.lhsKeyValueToUpperCase && lhs) {
              lhs = lhs.toUpperCase();
          }
          this.contextService.addToContext('lhsValue', lhs);
        }
      }
    }

    if (rhs !== undefined) {
      if (this.utilityService.isString(rhs) && rhs.startsWith('#')) {
        rhs = this.contextService.getDataByString(rhs);
      }
    }

    if (action.config.operation == 'isEqualTo') {
      if (lhs == rhs) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((element) => {
          actionService.handleAction(element, instance);
        });
      } else {
        if (action.responseDependents.onFailure != undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          if (onFailureActions !== undefined) {
            onFailureActions.forEach((element) => {
              actionService.handleAction(element, instance);
            });
          }
        }
      }
    }

    if (action.config.operation == 'isNotEqualTo') {
      if (lhs !== rhs) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((element) => {
          actionService.handleAction(element, instance);
        });
      } else {
        if (action.responseDependents.onFailure != undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          if (onFailureActions !== undefined) {
            onFailureActions.forEach((element) => {
              actionService.handleAction(element, instance);
            });
          }
        }
      }
    }

    if (action.config.operation === 'isEqualcompareArr') {
      let flag = false;
      rhs && rhs.forEach(element => {
        let rhsvalue = element.resultCode;
        if (lhs === rhsvalue) {
          flag = true;
        }
      });
      if (flag && flag === true) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((element) => {
          actionService.handleAction(element, instance);
        });
      } else {
        if (action.responseDependents.onFailure !== undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((element) => {
            actionService.handleAction(element, instance);
          });
        }
      }

    }
    if (action.config.operation == 'isEqualToIgnoreCase') {
      if (lhs.toLowerCase() == rhs.toLowerCase()) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((element) => {
          actionService.handleAction(element, instance);
        });
      } else {
        if (action.responseDependents.onFailure != undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((element) => {
            actionService.handleAction(element, instance);
          });
        }
      }
    } else if (action.config.operation == 'isValid') {
      if (lhs) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((element) => {
          actionService.handleAction(element, instance);
        });
      } else {
        if (action.responseDependents.onFailure != undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((element) => {
            actionService.handleAction(element, instance);
          });
        }
      }
    }
    else if (action.config.operation == 'compareLastChars') {
      if (rhs.endsWith('R') || rhs.endsWith('AV')) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((element) => {
          actionService.handleAction(element, instance);
        });
      }
      else {
        if (action.responseDependents.onFailure != undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((element) => {
            actionService.handleAction(element, instance);
          });
        }
      }
    }
    else if (action.config.operation == 'isLessThanEqualTo') {
      /// convert to integers
      lhs = parseInt(lhs);
      rhs = parseInt(rhs);
      if (lhs <= rhs) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((element) => {
          actionService.handleAction(element, instance);
        });
      } else {
        if (action.responseDependents.onFailure != undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((element) => {
            actionService.handleAction(element, instance);
          });
        }
      }
    } else if (action.config.operation == 'isNotUndefined') {
      if (lhs <= rhs) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((element) => {
          actionService.handleAction(element, instance);
        });
      } else {
        if (action.responseDependents.onFailure != undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((element) => {
            actionService.handleAction(element, instance);
          });
        }
      }
    } else if (action.config.operation == 'indexOf') {
      // 1.array we want to check,
      // lhs must be array.
      // 2.value need to check,
      // rhs must be value we need to find in array;
      if (lhs instanceof Array) {
        if (lhs.indexOf(rhs) > -1) {
          onSuccessActions = action.responseDependents.onSuccess.actions;
          onSuccessActions.forEach((element) => {
            actionService.handleAction(element, instance);
          });
        } else {
          if (action.responseDependents.onFailure != undefined) {
            onFailureActions = action.responseDependents.onFailure.actions;
            onFailureActions.forEach((element) => {
              actionService.handleAction(element, instance);
            });
          }
        }
      }
    } else if (action.config.operation === 'isGreaterThan') {
      // convert to integers
      lhs = parseInt(lhs);
      rhs = parseInt(rhs);
      if (lhs > rhs) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((success) => {
          actionService.handleAction(success, instance);
        });
      } else {
        if (action.responseDependents.onFailure !== undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((failure) => {
            actionService.handleAction(failure, instance);
          });
        }
      }
    } else if (lhs !== undefined && rhs !== undefined && action.config.operation === 'isContains') {
      if ((this.utilityService.isString(lhs) && lhs.toLowerCase().includes(rhs)) || (lhs.includes(rhs))) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((success) => {
          actionService.handleAction(success, instance);
        });
      } else {
        if (action.responseDependents.onFailure !== undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((failure) => {
            actionService.handleAction(failure, instance);
          });
        }
      }
    }else if (lhs !== undefined && rhs !== undefined && action.config.operation === 'isMatched') {
      if ( rhs.some(substring=>lhs.includes(substring))) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((success) => {
          actionService.handleAction(success, instance);
        });
      } else {
        if (action.responseDependents.onFailure !== undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((failure) => {
            actionService.handleAction(failure, instance);
          });
        }
      }
    }
    else if (action.config.operation === 'isNotEmptyArray') {
      if (lhs !== undefined && lhs && Array.isArray(lhs) && lhs.length) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((success) => {
          actionService.handleAction(success, instance);
        });
      } else {
        if (action.responseDependents.onFailure !== undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((failure) => {
            actionService.handleAction(failure, instance);
          });
        }
      }
    } else if (action.config.operation === 'isLengthEqualTo') {
      if (lhs !== undefined && lhs.length == rhs) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((success) => {
          actionService.handleAction(success, instance);
        });
      } else {
        if (action.responseDependents.onFailure !== undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((failure) => {
            actionService.handleAction(failure, instance);
          });
        }
      }
    } else if (action.config.operation === 'isValidList') {
      let validateList = action.config.validList;
      let isValid = true;
      if (validateList != undefined && validateList != null && validateList.length > 0) {
        let validFailCount = 0;
        for (let index = 0; index < validateList.length; index++) {
          let currentvalue = validateList[index];
          if (this.utilityService.isString(currentvalue) && currentvalue.startsWith('#')) {
            currentvalue = this.contextService.getDataByString(currentvalue);
          }
          if (currentvalue == null || currentvalue == undefined) {
            validFailCount = validFailCount + 1;
          }
        }

        if (validFailCount == validateList.length) {
          isValid = false;
        }
      }
      if (isValid) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((element) => {
          actionService.handleAction(element, instance);
        });
      } else {
        if (action.responseDependents.onFailure != undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((element) => {
            actionService.handleAction(element, instance);
          });
        }
      }
    }

    else if (action.config.operation == 'instanceGroupValidity') {
      if (instance.group.valid) {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((element) => {
          actionService.handleAction(element, instance);
        });
      } else {
        if (action.responseDependents.onFailure != undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((element) => {
            actionService.handleAction(element, instance);
          });
        }
      }
    }

    else if (action.config.operation == 'notEmpty') {
      if (lhs !== "") {
        onSuccessActions = action.responseDependents.onSuccess.actions;
        onSuccessActions.forEach((element) => {
          actionService.handleAction(element, instance);
        });
      } else {
        if (action.responseDependents.onFailure != undefined) {
          onFailureActions = action.responseDependents.onFailure.actions;
          onFailureActions.forEach((element) => {
            actionService.handleAction(element, instance);
          });
        }
      }
    }
  }
}
