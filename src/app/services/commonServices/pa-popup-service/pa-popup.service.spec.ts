import { TestBed } from '@angular/core/testing';

import { PaPopupService } from './pa-popup.service';

describe('PaPopupService', () => {
  let service: PaPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
