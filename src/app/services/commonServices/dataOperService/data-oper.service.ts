import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/utilities/utility.service';
import { ContextService } from '../contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class DataOperService {

  constructor(
    private contextService: ContextService,
    private utilityService: UtilityService
  ) { }
  handleFilterData(action, instance) {
    //this.showHideSpinner(0.5);
    let data = [];
    let filteredValue;
    let keyName;
    let keyDataValue;
    if (action.config.data.startsWith('#')) {
      data = this.contextService.getDataByString(action.config.data);
    }

    let refData = this.contextService.getDataByKey(
      action.config.targetId + 'ref'
    );

    let filterData = data;
    if (action.config.filterKeys !== undefined) {
      let filterKeyObj = Object.assign({}, action.config.filterKeys);
      filterKeyObj = this.contextService.getParsedObject(filterKeyObj,this.utilityService);
      Object.keys(filterKeyObj).forEach((key) => {
        filterData = this.utilityService.getFilteredCodes(
          filterData,
          key,
          filterKeyObj[key]
        );
      });
    }

    if (action.config.isEnabled !== undefined && action.config.isEnabled) {
      refData.instance.group.controls[refData.instance.name].enable();
    }

    filterData = filterData.map((s) => ({
      code: s[refData.instance.code],
      displayValue: s[refData.instance.displayValue],
    }));

    filterData = filterData.filter(
      (x) => x.displayValue !== undefined && x.displayValue
    );
    filterData = filterData.sort((a, b) =>
      a.displayValue.localeCompare(b.displayValue)
    );

    if (filterData && filterData !== undefined && filterData.length > 0) {
      refData.instance.dataSource = filterData;
      if (
        action.config.filterValue !== undefined &&
        action.config.filterValue !== ''
      ) {
        filteredValue = this.contextService.getDataByString(
          action.config.filterValue
        );
      } else {
        filteredValue = filterData[0]['code'];
        keyName = "userSelected"+refData.instance.name+"Name";
        keyDataValue = filterData[0]['displayValue'];
        let userNameData = this.contextService.getDataByString("#userAccountInfo.PersonalDetails.USERID");
        if(userNameData){
          localStorage.setItem(userNameData+keyName, keyDataValue);
        }
      }

      /// If the user have greater then 1 operation type, then default it
      if (
        action.config.afterFilterValue !== undefined &&
        filterData.length > 1
      ) {
        filterData.forEach((x) => {
          if (
            x.displayValue.toLowerCase() ===
            action.config.afterFilterValue.toLowerCase()
            ) {
            filteredValue = action.config.afterFilterValue;
          }
        });
        
        /// We are reversing the array as a work around
         filterData = filterData.reverse();
      }

      refData.instance.options = filterData;
      refData.instance.group.controls[refData.instance.name].setValue(
        filteredValue
      );
      // refData.instance.defaultValue = filteredValue;
      // refData.instance.dataSource = filterData;
      refData.instance.group.controls[
        refData.instance.name
      ].updateValueAndValidity();
    } else {
      refData.instance.options = [];
      refData.instance.group.controls[refData.instance.name].setValue(null);
      refData.instance.group.controls[
        refData.instance.name
      ].updateValueAndValidity();
    }

    this.contextService.addToContext(
      "userSelected"+refData.instance.name,
      filteredValue
    );
    let userNameData = this.contextService.getDataByString("#userAccountInfo.PersonalDetails.USERID");
    if(userNameData){
      let localStrID = userNameData+"userSelected"+refData.instance.name;
      localStorage.setItem(localStrID, filteredValue);
    }
    refData.instance._changeDetectionRef.detectChanges();
  }
}
