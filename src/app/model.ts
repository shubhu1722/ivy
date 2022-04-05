import { Type } from "@angular/core";

export class ProcessModel {
  processName: String;
  subProcess: SubProcessModel[];
}

export class SubProcessModel {
  subProcessId: String;
  subProcessName: String;
  subProcessLocation: String;
  subProcessTasks: TaskModel[];
}

export class TaskModel {
  taskType: String;
  taskStatus: String;
  taskDetails: InputModel[];
}

export class InputModel {
  id: String;
  label: String;
  required: boolean;
  type: String;
}

export class ComponentDetails {

}

export interface AdComponent {
  data: any;
}


export interface WikiList {
    id?: any;
    wikiTitle: any;
    wikiData: any;
    locationId: any;
    clientId: any;
    contractId: any;
    workCenterId: any;
    family: any;
    platform: any;
    modelPart: any;
    commodity: any;
    defect: any;
    experience: any;
    instructionType: any;
    instructionLanguage: any;
    userName: any;
    customInstruction :any;
    imageSource :any;
    imageAlternateText :any;
    imageWidth :any;
    imageHeight :any;
    attachmentUrl :any;
    attachmentTitle :any;
    attachmentDisplayText :any;
    attachmentOpen :any;

    display?: {
      location?: string;
      client?: string;
      contract?: string;
      workCenter?: string;
      family?: string;
      platform?: string;
      modelNo?: string;
      commodity?: string;
      defect?: string;
    }

}