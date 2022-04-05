import { TestBed } from '@angular/core/testing';

import { DuplicatePartPopupService } from './duplicate-part-popup.service';

describe('DuplicatePartPopupService', () => {
  let service: DuplicatePartPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DuplicatePartPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
