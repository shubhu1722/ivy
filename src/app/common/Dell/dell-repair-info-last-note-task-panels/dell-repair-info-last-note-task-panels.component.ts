import { Component, OnInit, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { ActionService } from 'src/app/services/action/action.service';

@Component({
  selector: 'app-dell-repair-info-last-note-task-panels',
  templateUrl: './dell-repair-info-last-note-task-panels.component.html',
  styleUrls: ['./dell-repair-info-last-note-task-panels.component.scss']
})
export class DellRepairInfoLastNoteTaskPanelsComponent implements OnInit {
  @ViewChild('lastNoteContainer', { static: true, read: ViewContainerRef }) lastNoteContainer: ViewContainerRef;
  @ViewChild('repairInformationContainer', { static: true, read: ViewContainerRef }) repairInformationContainer: ViewContainerRef;
  taskPanelItems: any[];
  defaultRepairInfoTaskCompleteButtonActions: any[];
  @Input() isRepairInfoTaskCompleteButton: boolean;
  @Input() repairInfoTaskCompleteButtonActions: any[];
  constructor(private componentLoaderService: ComponentLoaderService, private actionService: ActionService) { }

  ngOnInit(): void {
    this.taskPanelItems = [];
    this.defaultRepairInfoTaskCompleteButtonActions = [];

    this.isRepairInfoTaskCompleteButton = this.isRepairInfoTaskCompleteButton !== undefined ? this.isRepairInfoTaskCompleteButton : true;
    this.repairInfoTaskCompleteButtonActions = this.repairInfoTaskCompleteButtonActions !== undefined ? this.repairInfoTaskCompleteButtonActions : [];

    // Last Note task panel 
    this.taskPanelItems.push({
      "ctype": "taskPanel",
      "isblueBorder": true,
      "uuid": "dellCommonlastNoteTaskUUID",
      "containerId": "lastNoteContainer",
      "title": "",
      "header": {
        "title": "Last note",
        "icon": "description",
        "iconClass": "active-header",
        "class": "greyish-black subtitle1 font-weight-700",
      },
      "expanded": true,
      "disabled": false,
      "hideToggle": true,
      "panelClass": "margin-top-10",
      "hidden": true,
      "hooks": [],
      "validations": [],
      "actions": [],
      "items": [{
        "ctype": "title",
        "uuid": "lastNoteTextUUID",
        "titleClass": "greyish-black body-italic assessment-alert",
        "title": "",
      }],
      "footer": []
    });

    // Check If there is repair Info complete button required, push task panel accordingly
    if (!this.isRepairInfoTaskCompleteButton) {
      this.taskPanelItems.push(
        {
          "ctype": "taskPanel",
          "isblueBorder": true,
          "uuid": "dellCommonRepairInformationTaskUUID",
          "containerId": "repairInformationContainer",
          "title": "",
          "header": {
            "title": "Repair Information",
            "icon": "description",
            "iconClass": "active-header",
            "class": "greyish-black subtitle1 font-weight-700",
          },
          "expanded": false,
          "disabled": false,
          "hideToggle": true,
          "panelClass": "margin-top-10",
          "hidden": false,
          "hooks": [],
          "validations": [],
          "actions": [],
          "items": [
            {
              "ctype": "title",
              "uuid": "repairInformationTextUUID",
              "titleClass": "greyish-black body-italic assessment-alert",
              "title": "",
            }
          ],
          "footer": []
        });
    } else {

      // Default repairInfoTask complete button actions
      this.defaultRepairInfoTaskCompleteButtonActions.push(
        {
          "type": "updateComponent",
          "config": {
            "key": "repairInformationMessageReadCheckboxUUID",
            "properties": {
              "disabled": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCommonRepairInformationTaskCompleteButtonUUID",
            "properties": {
              "disabled": true
            }
          },
          "eventSource": "click"
        },
        {
          "type": "updateComponent",
          "config": {
            "key": "dellCommonRepairInformationTaskUUID",
            "properties": {
              "expanded": false,
              "disabled": false,
              "header": {
                "title": "Repair Information",
                "icon": "description",
                "statusIcon": "check_circle",
                "statusClass": "complete-status",
                "class": "complete-task ",
                "iconClass": "complete-task"
              }
            }
          },
          "eventSource": "click"
        }
      );

      // Add any screen specific actions if present
      if (this.repairInfoTaskCompleteButtonActions.length > 0) {
        this.defaultRepairInfoTaskCompleteButtonActions = this.defaultRepairInfoTaskCompleteButtonActions.concat(this.repairInfoTaskCompleteButtonActions);
      }

      this.taskPanelItems.push(
        {
          "ctype": "taskPanel",
          "isblueBorder": true,
          "uuid": "dellCommonRepairInformationTaskUUID",
          "containerId": "repairInformationContainer",
          "title": "",
          "header": {
            "title": "Repair Information",
            "icon": "description",
            "iconClass": "active-header",
            "class": "greyish-black subtitle1 font-weight-700",
          },
          "expanded": false,
          "disabled": false,
          "hideToggle": true,
          "panelClass": "margin-top-10",
          "hidden": false,
          "hooks": [],
          "validations": [],
          "actions": [],
          "items": [
            {
              "ctype": "title",
              "uuid": "repairInformationTextUUID",
              "titleClass": "greyish-black body-italic assessment-alert",
              "title": "",
            },
            {
              "ctype": "checkbox",
              "name": "repairInformationMessageReadCheckbox",
              "uuid": "repairInformationMessageReadCheckboxUUID",
              "hooks": [],
              "validations": [],
              "required": true,
              "disabled": false,
              "label": "I have read this message",
              "labelPosition": "after",
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "repairInformationMessageReadCheckboxValue",
                    "data": "elementControlValue"
                  },
                  "eventSource": "click"
                },
                {
                  "type": "condition",
                  "config": {
                    "operation": "isEqualTo",
                    "lhs": "#repairInformationMessageReadCheckboxValue",
                    "rhs": true
                  },
                  "eventSource": "click",
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "dellCommonRepairInformationTaskCompleteButtonUUID",
                            "properties": {
                              "disabled": false
                            }
                          }
                        }
                      ]
                    },
                    "onFailure": {
                      "actions": [
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "dellCommonRepairInformationTaskCompleteButtonUUID",
                            "properties": {
                              "disabled": true
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          ],
          "footer": [
            {
              "ctype": "button",
              "color": "primary",
              "text": "Complete",
              "uuid": "dellCommonRepairInformationTaskCompleteButtonUUID",
              "class": "primary-btn",
              "visibility": true,
              "disabled": true,
              "type": "submit",
              "hooks": [],
              "validations": [],
              "actions": this.defaultRepairInfoTaskCompleteButtonActions
            }
          ]
        });
    }


    this.taskPanelItems.forEach((item) => {
      if (item.containerId !== undefined) {
        this.componentLoaderService.parseData(item, this[item.containerId]);
      }
    });

    let repairInfoAPICallAction = {
      "type": "microservice",
      "config": {
        "microserviceId": "getCurrPrevRODetailsBySN",
        "requestMethod": "get",
        "params": {
          "serialNo": "#repairUnitInfo.SERIAL_NO",
          "locationId": "#userSelectedLocation",
          "clientId": "#userSelectedClient",
          "contractId": "#userSelectedContract",
          "userName": "#loginUUID.username"
        }
      },
      "eventSource": "click",
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "condition",
              "eventSource": "click",
              "config": {
                "operation": "isValid",
                "lhs": "#getCurrPrevRODetailsBySN.lastNote"
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "dellCommonlastNoteTaskUUID",
                        "properties": {
                          "expanded": true,
                          "hidden": false
                        }
                      }
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "lastNoteTextUUID",
                        "properties": {
                          "title": "#getCurrPrevRODetailsBySN.lastNote"
                        }
                      }
                    }
                  ]
                },
                "onFailure": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "dellCommonlastNoteTaskUUID",
                        "properties": {
                          "hidden": true
                        }
                      }
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "dellCommonRepairInformationTaskUUID",
                        "properties": {
                          "expanded": true
                        }
                      }
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "lastNoteTextUUID",
                        "properties": {
                          "title": ""
                        }
                      }
                    }
                  ]
                }
              }
            },
            {
              "type": "updateComponent",
              "config": {
                "key": "repairInformationTextUUID",
                "properties": {
                  "title": "#getCurrPrevRODetailsBySN.repairInformation"
                }
              }
            }
          ]
        },
        "onFailure": {
          "actions": [
            {
              "type": "handleCommonServices",
              "config": {
                "type": "errorRenderTemplate",
                "contextKey": "errorMsg",
                "updateKey": "errorTitleUUID"
              }
            }
          ]
        }
      }
    }

    this.actionService.handleAction(repairInfoAPICallAction, this);
  }
}
