import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DropdownComponent } from './common/dropdown/dropdown.component';
import { TextInputComponent } from './common/text-input/text-input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextFieldComponent } from './common/text-field/text-field.component';
import { TitleComponent } from './common/title/title.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropDownComponent } from './common/drop-down/drop-down.component';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from './common/button/button.component';
import { MatButtonModule } from '@angular/material/button';
import { ContainerComponent } from './common/container/container.component';
import { MatCardModule } from '@angular/material/card';
import { ExpansionPanelComponent } from './common/expansion-panel/expansion-panel.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MultiSelectDropdownComponent } from './common/multi-select-dropdown/multi-select-dropdown.component';
import { DividerComponent } from './common/divider/divider.component';
import { ImageComponent } from './common/image/image.component';
import { MatDividerModule } from '@angular/material/divider';
import { ListComponent } from './common/list/list.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NumberFieldComponent } from './common/number-field/number-field.component';
import { FormPanelComponent } from './common/form-panel/form-panel.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PasswordComponent } from './common/password/password.component';
import { TextareaComponent } from './common/textarea/textarea.component';
import { SideNavComponent } from './common/side-nav/side-nav.component';
import { AccorditionPanelComponent } from './common/accordition-panel/accordition-panel.component';
import { LabelComponent } from './common/label/label.component';
import { TabPanelComponent } from './common/tab-panel/tab-panel.component';
import { ToolbarComponent } from './common/toolbar/toolbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { BaseComponent } from './base/base.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { PanelComponent } from './common/panel/panel.component';
import { TaskPanelComponent } from './common/task-panel/task-panel.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, DatePipe } from '@angular/common';
import { MenuListItemComponent } from './common/menu-list-item/menu-list-item.component';
import { IconTextComponent } from './common/icon-text/icon-text.component';
import { IconbuttonComponent } from './common/iconbutton/iconbutton.component';
import { BreadcrumbComponent } from './common/breadcrumb/breadcrumb.component';
import { CheckboxComponent } from './common/checkbox/checkbox.component';

import { ComponentListComponent } from './common/component-list/component-list.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxLoadingSpinnerModule } from '@k-adam/ngx-loading-spinner';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { RequestCancelInterceptor } from './interceptors/request-cancel.interceptors';
import { PageComponent } from './common/page/page.component';
import { ActionService } from './services/action/action.service';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// transalation service code
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ButtonToggleComponent } from './common/button-toggle/button-toggle.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { GridComponent } from './common/grid/grid.component';
import { FlexFieldsComponent } from './common/flex-fields/flex-fields.component';
import { MenuTreeComponent } from './common/menu-tree/menu-tree.component';
import { DialogboxComponent } from './common/dialogbox/dialogbox.component';
import { DialogboxwithmessageComponent } from './common/dialogboxwithmessage/dialogboxwithmessage.component';
import { LinkComponent } from './common/link/link.component';
import { RadioboxGroupComponent } from './common/radiobox-group/radiobox-group.component';
import { MatGridComponent } from './common/mat-grid/mat-grid.component';
import { DisabledComponent } from './common/disabled/disabled.component';
import { TrimDirectiveDirective } from './utilities/directives/trim-directive.directive';
import { TableRowComponent } from './common/table-row/table-row.component';
import { TableComponent } from './common/table/table.component';
import { RadioboxComponent } from './common/radiobox/radiobox.component';
import { SplitHeaderComponent } from './common/split-header/split-header.component';
import { HoverClassDirective } from './utilities/directives/hover.directive';
import { DropdownWithSearchComponent } from './common/dropdown-with-search/dropdown-with-search.component';
import { BlockTextComponent } from './common/block-text/block-text.component';
import { InlineTextComponent } from './common/inline-text/inline-text.component';
import { ToggleActionsComponentComponent } from './common/toggle-actions-component/toggle-actions-component.component';
import { RecordUnitPartInfoComponent } from './common/record-unit-part-info/record-unit-part-info.component';
import { SpacerComponent } from './common/spacer/spacer.component';
import { ShowmoreTextComponent } from './common/showmore-text/showmore-text.component';
import { SubProcessComponent } from './sub-process/sub-process.component';
import { DropdownWithSearchTwoComponent } from './common/dropdown-with-search-two/dropdown-with-search-two.component';

import { ContentRendererComponent } from './common/content-renderer/content-renderer.component';
import { PassiveLinkComponent } from './common/passive-link/passive-link.component';
import { VideoCamComponent } from './common/video-cam/video-cam.component';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatChipsModule } from '@angular/material/chips';

// @Imported idle external package
import { BnNgIdleService } from 'bn-ng-idle';

// @custom components
import { DynamicItemRender } from './common/dynamic-item/dynamic-item.component';
import { DynamicTaskComponent } from './common/dynamic-task/dynamic-task.component';
import { PreventMultipleClickDirective } from './utilities/directives/prevent-multiple-click.directive';
import { ImageGridComponent } from './common/image-grid/image-grid.component';
import { DropdownAutocompleteComponent } from './common/dropdown-autocomplete/dropdown-autocomplete.component';
import { DropDownWithMultiSelectComponent } from './common/dropdown_with_multi_select/drop-down-with-multi-select/drop-down-with-multi-select.component';
import { ETravellerComponent } from './common/etraveller/etraveller.component';
import { DellRepairInfoLastNoteTaskPanelsComponent } from './common/Dell/dell-repair-info-last-note-task-panels/dell-repair-info-last-note-task-panels.component';


import { ReqListButtonComponent } from './common/req-list-button/req-list-button/req-list-button.component';
import { DellWcOperationsTimeOutFooterComponent } from './common/Dell/dell-wc-operations-time-out-footer/dell-wc-operations-time-out-footer.component';
import { SelectDropDownModule } from '../../external_modules';
import { PdfSearchComponent } from './common/pdf-search/pdf-search.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { DellWcOperationsMessageReadPanelComponent } from './common/Dell/dell-wc-operations-message-read-panel/dell-wc-operations-message-read-panel.component';
import { ObaChecklistComponent } from './common/Dell/oba-checklist/oba-checklist.component';
import { MultipleROTableComponent } from './common/Dell_Car/multiple-rotable/multiple-rotable.component';
import { MultiSelectDropdownWithChipsComponent } from './common/multi-select-dropdown-with-chips/multi-select-dropdown-with-chips.component';
import { NgMultiSelectDropDownModule } from 'external_modules/ng-multiselect-dropdown/ng-multiselect-dropdown.module';
import { BatchTableComponent } from './common/batch-table/batch-table.component';
import { PredictiveTaskpanelComponent } from './common/predictive-taskpanel/predictive-taskpanel.component';
import { AcceptPopupComponent } from './common/accept-popup/accept-popup.component';
import { OleTableComponent } from './common/ole-table/ole-table.component';
import { MatSortModule } from '@angular/material/sort';
import { TableWithSearchAndSortComponent } from './common/table-with-search-and-sort/table-with-search-and-sort.component';
import { VerifoneQuickReceivingTableComponent } from './common/verifone-quick-receiving-table/verifone-quick-receiving-table.component';
import { VerifoneRmaReceivingTableComponent } from './common/verifone-rma-receiving-table/verifone-rma-receiving-table.component';
import { ImageEditorComponent } from './common/image-editor/image-editor.component';
import { WikiComponent } from './common/wiki/wiki.component';
import { AddWikiComponent } from './common/add-wiki/add-wiki.component';
import { CommentsDialogBoxComponent } from './common/comments-dialog-box/comments-dialog-box.component';
import { ValidationChecklistComponent } from './common/Dell/validation-checklist/validation-checklist.component';
import { KeyDataComponent } from './common/key-data/key-data.component';
import { DynamicControlsComponent } from './common/Dell_Car/dynamic-controls/dynamic-controls.component';
import { WikiTableSearchAndSortComponent } from './common/wiki-table-search-and-sort/wiki-table-search-and-sort.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { WikiRichtextComponent } from './common/wiki-richtext/wiki-richtext.component';
import { EditorModule } from "@tinymce/tinymce-angular";
import { WikiListComponent } from './common/wiki-list/wiki-list.component';
import { PendingWikiComponent } from './common/pending-wiki/pending-wiki.component';
import { EditPendingWikiComponent } from './common/edit-pending-wiki/edit-pending-wiki.component';
import { SmeAlertDialogComponent } from './common/sme-alert-dialog/sme-alert-dialog.component';
import { AddDefectTaskpanelComponent } from './common/add-defect-taskpanel/add-defect-taskpanel.component';
import { PrimaryfaultPopupTableComponent } from './common/Dell_Car/primaryfault-popup-table/primaryfault-popup-table.component';
import { PrimaryFaultTableWithCheckBoxComponent } from './common/Dell_Car/primary-fault-table-with-check-box/primary-fault-table-with-check-box.component';
import { EtravellerRepositoryComponent } from './common/etraveller-repository/etraveller-repository.component';
import { DuplicatePartnumberComponent } from './common/Dell_Car/duplicate-partnumber/duplicate-partnumber.component';
import { PaPopupTableComponent } from './common/Dell_Car/pa-popup-table/pa-popup-table.component';
import { WikiAdminComponent } from './common/wiki-admin/wiki-admin.component';
import { DellPackoutIssueBoxComponent } from './common/Dell/dell-packout-issue-box/dell-packout-issue-box.component';
import { PartsComponent } from './common/parts/parts.component';
import { AdminWikiPanelComponent } from './common/admin-wiki-panel/admin-wiki-panel.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
// loader module
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    DropdownComponent,
    TextInputComponent,
    TextFieldComponent,
    DropDownComponent,
    ButtonComponent,
    ContainerComponent,
    ExpansionPanelComponent,
    MultiSelectDropdownComponent,
    DividerComponent,
    ImageComponent,
    ListComponent,
    NumberFieldComponent,
    FormPanelComponent,
    PasswordComponent,
    TextareaComponent,
    SideNavComponent,
    AccorditionPanelComponent,
    LabelComponent,
    TabPanelComponent,
    ToolbarComponent,
    BaseComponent,
    PanelComponent,
    TaskPanelComponent,
    MenuListItemComponent,
    IconTextComponent,
    IconbuttonComponent,
    BreadcrumbComponent,
    CheckboxComponent,
    PageComponent,
    ButtonToggleComponent,
    GridComponent,
    ComponentListComponent,
    FlexFieldsComponent,
    MenuTreeComponent,
    DialogboxComponent,
    DialogboxwithmessageComponent,
    LinkComponent,
    RadioboxGroupComponent,
    MatGridComponent,
    DisabledComponent,
    TrimDirectiveDirective,
    TableRowComponent,
    TableComponent,
    RadioboxComponent,
    SplitHeaderComponent,
    HoverClassDirective,
    DropdownWithSearchComponent,
    BlockTextComponent,
    InlineTextComponent,
    ToggleActionsComponentComponent,
    RecordUnitPartInfoComponent,
    SpacerComponent,
    ShowmoreTextComponent,
    DropdownWithSearchTwoComponent,
    SubProcessComponent,
    ContentRendererComponent,
    PassiveLinkComponent,
    VideoCamComponent,
    DynamicItemRender,
    DynamicTaskComponent,
    PreventMultipleClickDirective,
    ImageGridComponent,
    DropdownAutocompleteComponent,
    DropDownWithMultiSelectComponent,
    ETravellerComponent,
    DellRepairInfoLastNoteTaskPanelsComponent,
    DividerComponent,
    PdfSearchComponent,
    ReqListButtonComponent,
    DellWcOperationsTimeOutFooterComponent,
    DellWcOperationsMessageReadPanelComponent,
    ObaChecklistComponent,
    MultipleROTableComponent,
    MultiSelectDropdownWithChipsComponent,
    BatchTableComponent,
    PredictiveTaskpanelComponent,
    AcceptPopupComponent,
    OleTableComponent,
    TableWithSearchAndSortComponent,
    VerifoneQuickReceivingTableComponent,
    VerifoneRmaReceivingTableComponent,
    ImageEditorComponent,
    WikiComponent,
    AddWikiComponent,
    CommentsDialogBoxComponent,
    ValidationChecklistComponent,
    KeyDataComponent,
    DynamicControlsComponent,
    WikiTableSearchAndSortComponent,
    WikiRichtextComponent,
    WikiListComponent,
    PendingWikiComponent,
    EditPendingWikiComponent,
    SmeAlertDialogComponent,
    AddDefectTaskpanelComponent,
    PrimaryfaultPopupTableComponent,
    PrimaryFaultTableWithCheckBoxComponent,
    DuplicatePartnumberComponent,
    PaPopupTableComponent,
    WikiAdminComponent,
    PartsComponent,
    AdminWikiPanelComponent,
    DellPackoutIssueBoxComponent,
    PartsComponent,
    EtravellerRepositoryComponent
  ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    NgxLoadingSpinnerModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),    
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    MatButtonToggleModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatDividerModule,
    MatListModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTabsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    MatMenuModule,
    MatTreeModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    SelectDropDownModule,
    PinchZoomModule,
    MatAutocompleteModule,
    MatChipsModule,
    MDBBootstrapModule.forRoot(),
    PdfViewerModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    EditorModule
    
    // Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RequestCancelInterceptor, multi: true },
    ActionService,
    TranslateService,
    DatePipe,
    BnNgIdleService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
