import { TestBed } from '@angular/core/testing';

import { VerifoneReceivingServiceService } from './verifone-receiving-service.service';

describe('VerifoneReceivingServiceService', () => {
  let service: VerifoneReceivingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifoneReceivingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
