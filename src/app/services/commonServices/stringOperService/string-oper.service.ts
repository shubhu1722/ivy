import { Injectable } from '@angular/core';
import { ContextService } from '../contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class StringOperService {

  constructor(
    private contextService: ContextService,
  ) { }
  handleSplitWord(action, instance) {
    let actionObj = action.config;
    let splitText = this.contextService.getDataByString(actionObj.source);
    if(actionObj.source && !actionObj.source.startsWith('#')){
       splitText = actionObj.source;
    }
    var splitArr = splitText.split(actionObj.splitWord);
    if(actionObj.operation == undefined){
      splitArr = splitArr[0].trim();
    }
    else if(actionObj.operation ){
      splitArr = {
        oldVal: splitArr[splitArr.length - 2],
        newVal: splitArr[splitArr.length - 1]
      };
    }
    this.contextService.addToContext(actionObj.key, splitArr);
  }
  handleStringOperation(action, instance) {
    let lstr;
    let rstr;
    let concatSymbol;
    // for concatinating two strings
    if (action.config.operation === 'concat') {
      if (action.config.lstr && action.config.rstr !== undefined) {
        lstr = action.config.lstr;
        if (lstr.startsWith('#')) {
          lstr = this.contextService.getDataByString(lstr);
        }
      }
      if (action.config.rstr && action.config.rstr !== undefined) {
        rstr = action.config.rstr;
        if (rstr.startsWith('#')) {
          rstr = this.contextService.getDataByString(rstr);
        }
      }
      if (lstr !== undefined && rstr !== undefined && action.config.key !== undefined) {
        concatSymbol = action.config.concatSymbol;
        concatSymbol = concatSymbol ? concatSymbol : "_";
        const concatStr = lstr + concatSymbol + rstr;
        this.contextService.addToContext(action.config.key, concatStr);
      }
    }
  }
  performOperation(action,actionService) {
    if (action && action.config) {
      const config = action.config;

      if (config.type === "slice") {
        this.contextService.addToContext(config.contextKey, actionService.getContextorNormalData(config.lhs, "").slice(1, 5));
      }
    }
  }

  partStringExtract(action){
  let data = this.contextService.getDataByString(action.config.data);
    if (data !== undefined)  { // this is for Dell ASSEMBLY BER - Hard Drive Removal task, HDD PPID
      let HDDPart = data.substring(3, 8);
      this.contextService.addToContext("removedHDDPart", HDDPart);
    }    
  }


  combineStringsInArray(action){
    let data = this.contextService.getDataByString(action.config.data);
    data.map((x) => {
      if(x.Name == action.config.targetKey){
        let arr = x.Value
        if (arr && arr.length) {
          let str = "";
          for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if(index == 0){
              str = element;
            }
            else{
              str = str + "," 
              str = str + element
            }
          }
          console.log(str);
          x.Value = str;
        }
      }
    })
    console.log(data)
  }

  stringOperationWithoutUnderscore(action, instance) {
    let concatedString = '';
    if (action.config.operation === 'concat') {
      if (action.config.stringArr && action.config.stringArr.length > 0) {
        for (let i=0; i< action.config.stringArr.length; i++) {
          if (action.config.stringArr[i] && action.config.stringArr[i].startsWith('#')) {
            concatedString = concatedString + " " +this.contextService.getDataByString(action.config.stringArr[i]);
          } else {
            concatedString = concatedString + " " +action.config.stringArr[i];
          }
        }
        this.contextService.addToContext(action.config.key, concatedString);
      }
    }
  }
}