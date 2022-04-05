import { Component, OnInit, Input, ViewContainerRef, ViewChild } from '@angular/core';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';

@Component({
  selector: 'app-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.scss']
})
export class TableRowComponent implements OnInit {
  @Input() rows: any;
  @Input() group: any;
  @ViewChild('tablerow', { static: true, read: ViewContainerRef })
  tablerow: ViewContainerRef;
  constructor(private componentLoaderService: ComponentLoaderService) { }

  ngOnInit(): void {
    if (this.rows instanceof Array){
      this.rows.forEach((ele) => {
        ele.group = this.group;
        this.componentLoaderService.parseData(ele, this.tablerow);
      });
    } else {
      this.componentLoaderService.parseData(this.rows, this.tablerow);
    }
  }
}
