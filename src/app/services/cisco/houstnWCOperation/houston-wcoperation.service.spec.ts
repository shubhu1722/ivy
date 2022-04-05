import { TestBed } from '@angular/core/testing';

import { HoustonWCOperationService } from './houston-wcoperation.service';

describe('HoustonWCOperationService', () => {
  let service: HoustonWCOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoustonWCOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
