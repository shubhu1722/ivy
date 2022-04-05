import { TestBed } from '@angular/core/testing';

import { VerifoneService } from './verifone.service';

describe('VerifoneService', () => {
  let service: VerifoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
