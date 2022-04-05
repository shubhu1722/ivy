import { Component, OnInit, ViewChild, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { MetadataService } from '../services/commonServices/metadataService/metadata.service';
import { Url } from '../config/url';
import { ComponentLoaderService } from '../services/commonServices/component-loader/component-loader.service';
import { ContextService } from '../services/commonServices/contextService/context.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.sass']
})
export class BaseComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  constructor(private metadataService: MetadataService,
    private componentLoaderService: ComponentLoaderService,
    private contextService: ContextService, private _changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.metadataService.getLocal(Url.login).subscribe((data) => {
      this.componentLoaderService.parseData(data, this.container);
      this.contextService.addToContext('baseContainerRef', this.container);
    }, (error) => {
      console.log(error);
    });

    // Subscribe here, this will automatically update
    this.contextService.isDataRefreshed.subscribe(value => {
      if (value) {
        this._changeDetectionRef.detectChanges();
      }
    });
  }
}
