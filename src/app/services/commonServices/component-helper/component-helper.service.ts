import { ImageGridComponent } from '../../../common/image-grid/image-grid.component';
import { RecordUnitPartInfoComponent } from 'src/app/common/record-unit-part-info/record-unit-part-info.component';
import { ComponentListComponent } from 'src/app/common/component-list/component-list.component';
import { Injectable } from '@angular/core';
import { TextFieldComponent } from 'src/app/common/text-field/text-field.component';
import { PasswordComponent } from 'src/app/common/password/password.component';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { FormPanelComponent } from 'src/app/common/form-panel/form-panel.component';
import { ImageComponent } from 'src/app/common/image/image.component';
import { DividerComponent } from 'src/app/common/divider/divider.component';
import { MenuListItemComponent } from 'src/app/common/menu-list-item/menu-list-item.component';
import { IconTextComponent } from 'src/app/common/icon-text/icon-text.component';
import { SideNavComponent } from 'src/app/common/side-nav/side-nav.component';
import { TitleComponent } from 'src/app/common/title/title.component';
import { ToolbarComponent } from 'src/app/common/toolbar/toolbar.component';
import { ExpansionPanelComponent } from 'src/app/common/expansion-panel/expansion-panel.component';
import { IconbuttonComponent } from 'src/app/common/iconbutton/iconbutton.component';
import { CheckboxComponent } from 'src/app/common/checkbox/checkbox.component';
import { DropDownComponent } from 'src/app/common/drop-down/drop-down.component';
import { DropdownComponent } from 'src/app/common/dropdown/dropdown.component';
import { PageComponent } from 'src/app/common/page/page.component';
import { ButtonToggleComponent } from 'src/app/common/button-toggle/button-toggle.component';
import { TaskPanelComponent } from 'src/app/common/task-panel/task-panel.component';
import { GridComponent } from 'src/app/common/grid/grid.component';
import { LabelComponent } from 'src/app/common/label/label.component';
import { FlexFieldsComponent } from '../../../common/flex-fields/flex-fields.component';
import { MenuTreeComponent } from 'src/app/common/menu-tree/menu-tree.component';
import { LinkComponent } from 'src/app/common/link/link.component';
import { BreadcrumbComponent } from 'src/app/common/breadcrumb/breadcrumb.component';
import { MatGridComponent } from 'src/app/common/mat-grid/mat-grid.component';
import { TextareaComponent } from 'src/app/common/textarea/textarea.component';
import { RadioboxGroupComponent } from 'src/app/common/radiobox-group/radiobox-group.component';
import { DisabledComponent } from 'src/app/common/disabled/disabled.component';
import { TableComponent } from 'src/app/common/table/table.component';
import { RadioboxComponent } from 'src/app/common/radiobox/radiobox.component';
import { DropdownWithSearchComponent } from 'src/app/common/dropdown-with-search/dropdown-with-search.component';
import { BlockTextComponent } from 'src/app/common/block-text/block-text.component';
import { InlineTextComponent } from 'src/app/common/inline-text/inline-text.component';
import { ToggleActionsComponentComponent } from 'src/app/common/toggle-actions-component/toggle-actions-component.component';
import { SpacerComponent } from 'src/app/common/spacer/spacer.component';
import { ShowmoreTextComponent } from 'src/app/common/showmore-text/showmore-text.component';
import { DropdownWithSearchTwoComponent } from 'src/app/common/dropdown-with-search-two/dropdown-with-search-two.component';
import { ContentRendererComponent } from 'src/app/common/content-renderer/content-renderer.component';
import { PassiveLinkComponent } from 'src/app/common/passive-link/passive-link.component';
import { VideoCamComponent } from 'src/app/common/video-cam/video-cam.component';

//@custom components
import { DynamicItemRender } from 'src/app/common/dynamic-item/dynamic-item.component';
import { DynamicTaskComponent } from 'src/app/common/dynamic-task/dynamic-task.component';
import { SubProcessComponent } from 'src/app/sub-process/sub-process.component';
import { DropdownAutocompleteComponent } from 'src/app/common/dropdown-autocomplete/dropdown-autocomplete.component';
import { DropDownWithMultiSelectComponent } from 'src/app/common/dropdown_with_multi_select/drop-down-with-multi-select/drop-down-with-multi-select.component';
import { DellRepairInfoLastNoteTaskPanelsComponent } from 'src/app/common/Dell/dell-repair-info-last-note-task-panels/dell-repair-info-last-note-task-panels.component';
import { DellWcOperationsTimeOutFooterComponent } from 'src/app/common/Dell/dell-wc-operations-time-out-footer/dell-wc-operations-time-out-footer.component';
import { DellWcOperationsMessageReadPanelComponent } from 'src/app/common/Dell/dell-wc-operations-message-read-panel/dell-wc-operations-message-read-panel.component';
import { ReqListButtonComponent } from 'src/app/common/req-list-button/req-list-button/req-list-button.component';
import { PdfSearchComponent } from '../../../common/pdf-search/pdf-search.component';
import { ObaChecklistComponent } from '../../../common/Dell/oba-checklist/oba-checklist.component';
import { MultipleROTableComponent } from '../../../common/Dell_Car/multiple-rotable/multiple-rotable.component';
import { MultiSelectDropdownWithChipsComponent } from '../../../common/multi-select-dropdown-with-chips/multi-select-dropdown-with-chips.component';
import { BatchTableComponent } from '../../../common/batch-table/batch-table.component';
import { PredictiveTaskpanelComponent } from '../../../common/predictive-taskpanel/predictive-taskpanel.component';
import { AcceptPopupComponent } from '../../../common/accept-popup/accept-popup.component';
import { OleTableComponent } from '../../../common/ole-table/ole-table.component';
import { TableWithSearchAndSortComponent } from '../../../common/table-with-search-and-sort/table-with-search-and-sort.component';
import { VerifoneQuickReceivingTableComponent } from '../../../common/verifone-quick-receiving-table/verifone-quick-receiving-table.component';
import { VerifoneRmaReceivingTableComponent } from '../../../common/verifone-rma-receiving-table/verifone-rma-receiving-table.component';
import { ImageEditorComponent } from '../../../common/image-editor/image-editor.component';
import { WikiComponent } from '../../../common/wiki/wiki.component';
import { AddWikiComponent } from '../../../common/add-wiki/add-wiki.component';
import { AddDefectTaskpanelComponent } from '../../../common/add-defect-taskpanel/add-defect-taskpanel.component';
import { PrimaryfaultPopupTableComponent } from '../../../common/Dell_Car/primaryfault-popup-table/primaryfault-popup-table.component';
import { PrimaryFaultTableWithCheckBoxComponent } from '../../../common/Dell_Car/primary-fault-table-with-check-box/primary-fault-table-with-check-box.component';
import { ValidationChecklistComponent } from '../../../common/Dell/validation-checklist/validation-checklist.component';
import { KeyDataComponent } from '../../../common/key-data/key-data.component';
import { DuplicatePartnumberComponent } from '../../../common/Dell_Car/duplicate-partnumber/duplicate-partnumber.component';
import { DynamicControlsComponent } from '../../../common/Dell_Car/dynamic-controls/dynamic-controls.component';
import { WikiTableSearchAndSortComponent } from '../../../common/wiki-table-search-and-sort/wiki-table-search-and-sort.component';
import { WikiRichtextComponent } from '../../../common/wiki-richtext/wiki-richtext.component';
import { WikiListComponent } from '../../../common/wiki-list/wiki-list.component';
import { PaPopupTableComponent } from '../../../common/Dell_Car/pa-popup-table/pa-popup-table.component';
import { WikiAdminComponent } from '../../../common/wiki-admin/wiki-admin.component';
import { AdminWikiPanelComponent } from '../../../common/admin-wiki-panel/admin-wiki-panel.component';
import { DellPackoutIssueBoxComponent } from '../../../common/Dell/dell-packout-issue-box/dell-packout-issue-box.component';

@Injectable({
  providedIn: 'root'
})
export class ComponentHelperService {

  constructor() { }

  determineComponent(componentType: string) {
    switch (componentType) {
      case 'formPanel':
        return FormPanelComponent;
      case 'textField':
        return TextFieldComponent;
      case 'passwordField':
        return PasswordComponent;
      case 'button':
        return ButtonComponent;
      case 'image':
        return ImageComponent;
      case 'divider':
        return DividerComponent;
      case 'menuListItem':
        return MenuListItemComponent;
      case 'iconText':
        return IconTextComponent;
      case 'sidenav':
        return SideNavComponent;
      case 'dropDown':
        return DropDownComponent;
      case 'title':
        return TitleComponent;
      case 'toolbar':
        return ToolbarComponent;
      case 'ExpansionPanel':
        return ExpansionPanelComponent;
      case 'iconbutton':
        return IconbuttonComponent;
      case 'reqlistbutton':
        return ReqListButtonComponent;
      case 'checkbox':
        return CheckboxComponent;
      case 'nativeDropdown':
        return DropdownComponent;
      case 'page':
        return PageComponent;
      case 'buttonToggle':
        return ButtonToggleComponent;
      case 'taskPanel':
        return TaskPanelComponent;
      case 'grid':
        return MatGridComponent;
      case 'label':
        return LabelComponent;
      case 'compoList':
        return ComponentListComponent;
      case 'flexFields':
        return FlexFieldsComponent;
      case 'menutree':
        return MenuTreeComponent;
      case 'link':
        return LinkComponent;
      case 'breadcrumb':
        return BreadcrumbComponent;
      case 'textarea':
        return TextareaComponent;
      case 'radioButtonGroup':
        return RadioboxGroupComponent;
      case 'disabled':
        return DisabledComponent;
      case 'table':
        return TableComponent;
      case 'radioButton':
        return RadioboxComponent;
      case 'dropdownWithSearch':
        return DropdownWithSearchTwoComponent;
      case 'block-text':
        return BlockTextComponent;
      case 'inline-text':
        return InlineTextComponent;
      case 'actionToggle':
        return ToggleActionsComponentComponent;
      case 'actionToggleFQA':
        return ToggleActionsComponentComponent;
      case 'recordUnitPartInfo':
        return RecordUnitPartInfoComponent;
      case 'spacer':
        return SpacerComponent;
      case 'showMore':
        return ShowmoreTextComponent;
      case 'contentRenderer':
        return ContentRendererComponent;
      case 'passiveLink':
        return PassiveLinkComponent;
      case 'videoCam':
        return VideoCamComponent;
      case 'dynamicItemRender':
        return DynamicItemRender;
      case 'dynamicTaskRender':
        return DynamicTaskComponent;
      case 'imageGrid':
        return ImageGridComponent;
      case 'subProcess':
        return SubProcessComponent;
      case 'autoComplete':
        return DropdownAutocompleteComponent;
      case 'dropdownWithMultiSelect':
        return DropDownWithMultiSelectComponent;
      case 'dellLastNoteRepairInfoTaskPanels':
        return DellRepairInfoLastNoteTaskPanelsComponent;
      case 'dellWcOperationsTimeOutFooter':
        return DellWcOperationsTimeOutFooterComponent;
      case 'dellWcOperationsMessageReadPanel':
        return DellWcOperationsMessageReadPanelComponent;
      case 'pdfSearch':
        return PdfSearchComponent;
      case 'obaChecklist':
        return ObaChecklistComponent;
      case 'multipleRoTable':
        return MultipleROTableComponent;
      case 'multiDropdownWithChips':
        return MultiSelectDropdownWithChipsComponent;
      case 'batchProcessTable':
        return BatchTableComponent;
      case 'PredictionTaskPanel':
        return PredictiveTaskpanelComponent;
      case 'acceptPopUpTaskPanel':
        return AcceptPopupComponent;
      case 'oleTable':
        return OleTableComponent;
      case 'tableWithSearchAndSort':
        return TableWithSearchAndSortComponent;
        case 'wikiTableWithSearchAndSort':
        return WikiTableSearchAndSortComponent;
      case 'verifoneQuickReceivingTable':
        return VerifoneQuickReceivingTableComponent;
      case 'verifoneRmaReceivingTable':
        return VerifoneRmaReceivingTableComponent;
      case 'imageEditorGrid':
        return ImageEditorComponent;
      case 'wikiTasks':
        return WikiComponent;
      case 'addWikis':
        return AddWikiComponent;
      case 'validationChecklist':
        return ValidationChecklistComponent;
      case 'addDefectTaskPanel':
        return AddDefectTaskpanelComponent ;
      case 'primaryFaultPopUpTable':
        return PrimaryfaultPopupTableComponent;
      case 'primaryFaultTableWithCheckBox':
        return PrimaryFaultTableWithCheckBoxComponent;
      case 'validationChecklist':
      return ValidationChecklistComponent;
      case 'keyData' :
        return KeyDataComponent;
      case 'dynamicControls':
        return DynamicControlsComponent;
      case 'richText' :
        return WikiRichtextComponent;
      case 'wikiList':
        return WikiListComponent;
      case 'wikiAdmin':
        return WikiAdminComponent;
      case 'duplicatePartNumberSelected':
        return DuplicatePartnumberComponent;
      case 'dellCarPATable':
        return PaPopupTableComponent;
        case 'adminWikiPanel':
        return AdminWikiPanelComponent;

      case 'dellPackoutIssueBoxComp':
        return DellPackoutIssueBoxComponent;
    }
  }
}
