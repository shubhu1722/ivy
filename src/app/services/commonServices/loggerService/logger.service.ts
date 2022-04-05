import { Injectable } from '@angular/core';
import { LogType } from '../../../utilities/enum';

@Injectable({
  providedIn: 'root'
})


export class LoggerService {
  constructor() { }

  log(type: LogType, message: string, data: string, methodReturnData: any) {
    console.log("Log type is" + type + " Log message is" + message + " Method return data is" + methodReturnData);
  }
}
