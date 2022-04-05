import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { hpEtravellerParts } from "../../utilities/constants";
import { cloneDeep } from 'lodash';


@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['parts.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class PartsComponent implements OnInit {

  constructor(
    private contextService: ContextService) {
  }

  partsDetails: any;
  expandedElement: [] | null;

  ngOnInit(): void {

    this.partsDetails = cloneDeep(hpEtravellerParts);;
    this.partsDetails.map((data) => {
      let Data = this.contextService.getDataByKey(data.dataSource) || [];
      if (Data) {
        data.dataSource = Data;
        this.expandedElement = Data;
      } else {
        data.dataSource = Data
      }
    });

  }

  onClickAccordion(event, accordionicon) {
    accordionicon.classList.toggle("active");
  }

  onclickinnerAccordion(event, element) {
    this.expandedElement = this.expandedElement === element ? null : element;
    if (element) {
      this.partsDetails.forEach(item => {
        if (item) {
          if (item['subTable'] == "getPartDetailsByRequsition") {
            let requistionsList = this.contextService.getDataByKey(item.getAllRequsitionDataSource)
            let partsList = requistionsList.filter((ele) => ele.requisitionId == element.requisitionId);
            element.subTable = partsList
          }
        }
      });
      ;
    }
  }

}



