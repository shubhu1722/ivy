import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Address } from 'cluster';
import { hpEtravellerRepository } from "../../utilities/constants";
import { cloneDeep } from 'lodash';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { ETravellerService } from '../../services/commonServices/eTraveller/etraveller.service';
import { ActionService } from '../../services/action/action.service';

/**
 * @title Table with expandable rows
 */

@Component({
  selector: 'app-etraveller-repository',
  templateUrl: './etraveller-repository.component.html',
  styleUrls: ['./etraveller-repository.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EtravellerRepositoryComponent implements OnInit {
  
  repositoryDetails: any;
  expandedElement: [] | null;
  constructor(
    private contextService:ContextService,private eTravellerService: ETravellerService, public actionService:ActionService
  ) { }

  //expandedElement: [] | null;
  //displayedColumns: string[] = ['TimeDate', 'SubProcess', 'PrintTemplate', 'Details', 'Action','UserId'];
  ngOnInit(): void {
    //this.dataSource = ELEMENT_DATA
    this.repositoryDetails = cloneDeep(hpEtravellerRepository);;
    this.repositoryDetails.map((data) => { 
      let Data = this.contextService.getDataByKey(data.dataSource) || [];

      console.log(Data);
      if (Data) {
        data.dataSource = Data;
        this.expandedElement = Data;
        console.log(Data);
      } else {
        data.dataSource = Data;
        console.log(Data);
      }
    });
  }
  onClickAccordion(event, accordionicon) {
    accordionicon.classList.toggle("active");
  }
  
  performAction(element,Partlabel ){
    let slectedItemData=[];
    let clickedData={};
    clickedData['data']=element;
    clickedData['PartLabel']=Partlabel;
    slectedItemData.push(clickedData);
    this.eTravellerService.handleHPRepositoryserviceAPI(slectedItemData,this,this.actionService);
  }
}
