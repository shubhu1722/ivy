
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Bank, BANKS } from 'src/app/demo-data';

@Component({
  selector: 'app-dropdown-with-search',
  templateUrl: './dropdown-with-search.component.html',
  styleUrls: ['./dropdown-with-search.component.scss']
})
export class DropdownWithSearchComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() options: any[];
  @Input() inputStyles: string;
  @Input() name: string;
  @Input() dataSource: any;
  @Input() displayValue: string;
  @Input() defaultValue: string;
  @Input() code: string;
  @Input() label: string;
  @Input() group: FormGroup;
  @Input() hooks: any[];
  @Input() labelClass: string;
  @Input() formGroupClass: string;
  @Input() formGroupStyles: string;
  @Input() hidden: boolean;
  @Input() defaultFilterValue: string;
  @Input() defaultFilterKey: string;
  @Input() required: boolean;
  @Input() actions: any[] = [];
  @Input() disabled: boolean;
  @Input() dropdownClass: string;
  selectedDropdownName: string;
  dropDownOptions: any;
  /** list of banks */
  protected banks: Bank[] = BANKS;

  /** control for the selected bank */
  public bankCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public bankFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  bank: { name: string; };
 
  constructor(translate: TranslateService) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {
    // set initial selection
    this.bankCtrl.setValue(this.banks[10]);

    // load the initial bank list
    this.filteredBanks.next(this.banks.slice());

    // listen for search field value changes
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
     * Sets the initial value after the filteredBanks are loaded initially
     */
  protected setInitialValue() {
    this.filteredBanks
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: Bank, b: Bank) => a && b && a.id === b.id;
      });
  }

  protected filterBanks() {
    if (!this.banks) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.banks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }
}
