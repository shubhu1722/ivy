import { Injectable } from '@angular/core';
import { ContextService } from '../contextService/context.service';
import { FormControl, Validators } from '@angular/forms';
import { ComponentLoaderService } from '../component-loader/component-loader.service';

@Injectable({
  providedIn: 'root'
})
export class ComponentViewService {

  constructor(
    private contextService: ContextService,
    private componentLoaderService: ComponentLoaderService,
  ) { }
  handleUpdateTaskPanelRightSide(action, instance) {
    const rightItems = action.config.properties.rightItems;
    const refData = this.contextService.getDataByKey(action.config.key + 'ref');
    Object.assign(refData.instance, action.config.properties);
    const rightSideContainerRef = this.contextService.getDataByKey(
      'expansionPanelContentFirstHalf'
    );
    /// clear the existing container ref
    rightSideContainerRef.clear();

    for (let i = 0; i < rightItems.length; i++) {
      refData.instance.uuid.addControl(
        rightItems[i].name,
        new FormControl(rightItems[i].value)
      );

      if (rightItems[i].ctype === 'table') {
        // console.log(rightItems[i].datasource[1].Qty[0].name);
        rightItems[i].datasource.forEach((x) => {
          Object.keys(x).forEach((key) => {
            // console.log(x[key]);
            if (Array.isArray(x[key])) {
              x[key].forEach((y) => {
                if (y.name !== undefined) {
                  refData.instance.uuid.addControl(
                    y.name,
                    new FormControl(y.value)
                  );
                }
              })
            } else {
              refData.instance.uuid.addControl(
                x[key].name,
                new FormControl(x[key].value)
              );
            }
          });
        });
      }
    }

    if (rightItems !== undefined) {
      /// clear the existing
      rightItems.forEach((item) => {
        item.group = refData.instance.uuid;
        this.componentLoaderService.parseData(
          item, refData.instance[item.containerId]
        );
        refData.instance._changeDetectionRef.detectChanges();
      });

      // const buttonRefData = this.contextService.getDataByKey(
      //   'replaceCompleteButtonUUIDref'
      // );
      // /// clear the existing container ref
      // buttonRefData.instance.group = refData.instance.uuid;
      // buttonRefData.instance._changeDetectionRef.detectChanges();
    }
  }
}
