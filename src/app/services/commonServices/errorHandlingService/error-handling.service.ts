import { Injectable } from '@angular/core';
import { ContextService } from '../contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(
    private contextService: ContextService
  ) { }
  handleErrorPrepareAndRender(action, instance) {
    const messageProp = action.config.properties;
    var titleValue = '';
    if (messageProp != undefined && messageProp != null) {
      titleValue = messageProp['titleValue'];
      var valueArray = action.config.valueArray;
      if (valueArray != null && valueArray != undefined) {
        if (valueArray.length > 0) {
          valueArray.forEach((valueIdentifier) => {
            if (typeof valueIdentifier === 'string' && valueIdentifier.startsWith('#')) {
              let identiferVal = this.contextService.getDataByString(
                valueIdentifier
              );
              if (identiferVal == null || identiferVal == undefined) {
                identiferVal = "";
              }
              titleValue = titleValue.replace(
                titleValue.substring(
                  titleValue.indexOf('{'),
                  titleValue.indexOf('}') + 1
                ),
                identiferVal
              );
            }
          });
        }
        let refData;
        let key;
        const properties = {};

        key = action.config.key;

        if (key !== undefined) {
          refData = this.contextService.getDataByKey(key + 'ref');
        } else {
          refData = this.contextService.getDataByKey(instance.uuid + 'ref');
        }

        properties['titleClass'] = messageProp['titleClass'];
        properties['titleValue'] = titleValue;
        properties['isShown'] = messageProp['isShown'];
        properties['text'] = titleValue;
        properties['secondaryFooterText'] = titleValue;
        if(refData && refData != undefined){
          Object.assign(refData.instance, properties);
          if (refData.instance._changeDetectionRef !== undefined) {
            refData.instance._changeDetectionRef.detectChanges();
          }
        }
      
      }
    }
  }
}
