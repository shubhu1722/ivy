import { TestBed } from '@angular/core/testing';

import { HpWCOperationsService } from './hp-wcoperations.service';

describe('HpWCOperationsService', () => {
  let service: HpWCOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HpWCOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
