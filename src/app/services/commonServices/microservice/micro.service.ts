import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/utilities/utility.service';
import { ContextService } from '../contextService/context.service';
import { messages } from 'src/app/utilities/messages';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { TransactionService } from '../transaction/transaction.service';
import { serviceUrls } from 'src/environments/serviceUrls';

@Injectable({
  providedIn: 'root'
})
export class MicroService {

  constructor(
    private contextService: ContextService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private utilityService: UtilityService
  ) { }
  async handleMicroservice(action, instance, actionService) {
    /// call the microservice
    switch (action.config.requestMethod) {
      case 'get':
        await this.getMicroservice(action, instance, actionService);
        break;
      case 'post':
        await this.postMicroservice(action, instance, actionService);
        break;
    }
  }
  async getMicroservice(action, instance, actionService) {
    const paramsObj = Object.assign({}, action.config.params);
    let bodyObj = this.contextService.getParsedObject(paramsObj, this.utilityService);

    let onFailureActions = [];
    onFailureActions = action.responseDependents?.onFailure?.actions || [];
    let respData: any;
    let url: string;
    let isLocalService = false;
    // if(action.config.microserviceId=="getSubProcessPageBody" ){
    //   action.config.isLocal=true;
    // }
    if (
      action.config.isLocal !== undefined &&
      action.config.isLocal &&
      action.config.LocalService !== undefined &&
      action.config.LocalService !== ''
    ) {
      url = action.config.LocalService;
      isLocalService = true;
      bodyObj = {};
    } else {
      url = action.config.microserviceId;
    }
    let response = await this.transactionService
      .get(url, bodyObj, isLocalService)
      .subscribe(
        (data) => {
          if (
            (data &&
              data != null &&
              (data instanceof Array || data instanceof Object) &&
              (data[0] != null || data.Result != null)) ||
            Object.keys(data).length !== 0
          ) {
            let isSuccess = false;
            let serverMessage;
            if (
              data.Result != undefined ||
              (data instanceof Array && data[0].Result != undefined)
            ) {
              if (
                data.Result == 'SUCCESS' ||
                (data instanceof Array && data[0].Result == 'SUCCESS')
              ) {
                isSuccess = true;
              }
            } else {
              if (data.status == true || data.status == 'true') {
                isSuccess = true;
              }
              //Below condition will excute only for HP - E-traveller keyData 
              //Setting the API as success even though statusand data is null
              if ((action.config.statusNullIgnore != undefined &&
                action.config.statusNullIgnore && data.status == null) || 
                (action.config.ifDataNullIgnore != undefined &&
                  action.config.ifDataNullIgnore && data.data == null)) {
                isSuccess = true;
              }
            }
            if (isSuccess) {
              //  var respData = data instanceof Array ? data[0].ResultData : data.ResultData;
              if (data instanceof Array && data[0].ResultData != undefined) {
                respData = data[0].ResultData;
              } else {
                if (data.ResultData != null) {
                  respData = data.ResultData;
                } else if ((data.data != undefined) || (data.data == null)) {
                  if (action.config.parseJson) {
                    respData = JSON.parse(data?.data);
                  } else {
                    respData = data.data;
                  }
                } else {
                  respData = data;
                }
              }
              // ************//code use for storing api data in context//*********

              let serviceId = action.config.microserviceId;
              // var currentWC = this.contextService.getDataByKey("currentWC");
              // let screenData = this.contextService.getDataByKey(currentWC);
              // if (screenData) {
              //   let i = 0;
              //   for (let key of screenData.keys()) {
              //     if (key.includes(serviceId)) {
              //       i=i+1
              //       serviceId = serviceId + "" + i;
              //     };
              //   }
              // }
              if (serviceId && serviceId == "validateLogin") {
                if (data && data.message) {
                  this.contextService.addToContext("loginExpiryMessage", data.message);
                }
              }
              this.contextService.addToContext(serviceId, respData);

              const onSuccessActions = action.responseDependents?.onSuccess?.actions || [];
              onSuccessActions.forEach((element) => {
                if (element?.config?.responseKey) {
                  try {
                    respData = element?.config?.responseKey.split('.').reduce((p, c) => p?.[c], respData);
                  } catch (e) {
                    console.log('cannot get nested property from response', e?.message);
                  }
                }
                actionService.handleAction(element, instance, respData);
              });
            } else {
              if (data.ResultData !== undefined) {
                serverMessage = data.ResultData;
              } else if (
                data instanceof Array &&
                data[0].ResultData !== undefined
              ) {
                serverMessage = data[0].ResultData;
              } else {
                serverMessage = data.message;
              }
              onFailureActions.forEach((element) => {
                actionService.handleAction(element, instance, serverMessage);
              });
            }
          } else {
            onFailureActions.forEach((element) => {
              actionService.handleAction(
                element,
                instance,
                messages.genericErrorMessage
              );
            });
          }
        },
        (error) => {
          let serviceId = action.config.microserviceId;
          this.contextService.addToContext(serviceId, messages.genericErrorMessage);
          onFailureActions.forEach((element) => {
            actionService.handleAction(element, instance, messages.genericErrorMessage);
          });
        }
      );
  }

  async postMicroservice(action, instance, actionService) {
    const paramsObj = Object.assign({}, action.config.body);
    const bodyObj = this.contextService.getParsedObject(paramsObj, this.utilityService);

    if (action.config.removeUndefinedFields !== undefined) {
      let sourceList = action.config.removeUndefinedFields;
      sourceList.forEach(fieldObj => {
        let fieldName = fieldObj.KeyName;
        let fieldValue = fieldObj.KeyValue;
        if (fieldValue.startsWith('#')) {
          fieldValue = this.contextService.getDataByString(fieldValue);
          if (fieldValue === undefined || fieldValue === '' || fieldValue === ' ' ||fieldValue === null ) {
            this.utilityService.removeKeys(
              bodyObj,
              fieldName
            );
          }
        }
      });
    }

    // For kardex Unload Screens For releaseFromHold API 
    if (action.config.isFromKardex){
      bodyObj.userPwd.userName = bodyObj.userPwd.userName.toUpperCase();
    }

    if (action.config.spliceIfEmptyValueObject !== undefined) {
      let sourceList = action.config.spliceIfEmptyValueObject;
      sourceList.forEach(fieldObj => {
        let identifier = fieldObj.identifier;
        let valueField = fieldObj.valueField;
        let keyToBeRemoved = fieldObj.keyToBeRemoved !== undefined ? fieldObj.keyToBeRemoved : null;
        //Now look for identifier array on Body Object
        this.utilityService.removeEmptyArrayObjects(bodyObj, identifier, valueField, bodyObj, keyToBeRemoved);
      });
    }

    let onFailureActions = [];
    if (action.responseDependents.onFailure != undefined && action.responseDependents.onFailure.actions.length > 0) {
      onFailureActions = action.responseDependents.onFailure.actions;
    }
    const response = await this.transactionService
      .post(action.config.microserviceId, bodyObj)
      .subscribe(
        (resp: HttpResponse<any>) => {
          let serverMessage;
          if (
            resp &&
            resp != null &&
            (resp.body.Result === 'SUCCESS' ||
              resp.body.status === 'true' ||
              resp.body.status === true)
          ) {
            let onSuccessActions = [];
            let respData = resp.body.ResultData;
            if (
              resp.body.data !== undefined &&
              resp.body.data != null &&
              resp.body.data !== '' &&
              resp.body.data !== '{}'
            ) {
              respData = resp.body.data;
            }
            onSuccessActions = action.responseDependents.onSuccess.actions;


            let userSelectedClientName = this.contextService.getDataByKey("userSelectedClientName");
            let userSelectedSubProcessTypeName = this.contextService.getDataByString("#userSelectedSubProcessType");
            let userSelectedContractName = this.contextService.getDataByString("#userSelectedContractName");
            if (action.config.microserviceId == "performTimeOut" && userSelectedSubProcessTypeName == "WC OPERATION") {
              if (userSelectedClientName == "HP") {
                // "microserviceId": "performTimeOut"
                onSuccessActions.push({
                  "type": "context",
                  "config": {
                    "requestMethod": "addToGlobalContext",
                    "key": "isTimeOutFromHpWC",
                    "data": true
                  }
                });
              }
              else if(userSelectedClientName == "DELL" && userSelectedContractName == "CAR"){
                onSuccessActions.push({
                  "type": "context",
                  "config": {
                    "requestMethod": "addToGlobalContext",
                    "key": "isTimeOutFromDellCarWC",
                    "data": true
                  }
                });
              }
            }
            if (action.config.microserviceId == "performTimeOut" &&
              (userSelectedSubProcessTypeName == "WC OPERATION") &&
              userSelectedClientName == "CISCO") {
              // "microserviceId": "performTimeOut"
              onSuccessActions.push({
                "type": "context",
                "config": {
                  "requestMethod": "addToGlobalContext",
                  "key": "isTimeOutFromCiscoWC",
                  "data": true
                }
              });
            }
            if (respData !== undefined) {
              if (action.config.toBeStringified) {
                respData = JSON.stringify(respData);
                respData = JSON.parse(respData);
              } else {
                respData = JSON.parse(respData);
              }
            }
            let serviceId = action.config.microserviceId;
              this.contextService.addToContext(serviceId,respData);
            onSuccessActions.forEach((element) => {
              actionService.handleAction(element, instance, respData);
            });
          } else {
            onFailureActions.forEach((element) => {
              if (resp && resp.body.ResultData !== undefined) {
                serverMessage = resp.body.ResultData;
              } else {
                serverMessage = resp.body.message;
              }
              actionService.handleAction(element, instance, serverMessage);
            });
          }
        },
        (error) => {
          onFailureActions.forEach((element) => {
            actionService.handleAction(element, instance, messages.genericErrorMessage);
          });
        }
      );
  }
}
