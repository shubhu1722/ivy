import { TestBed } from '@angular/core/testing';

import { CiscoTCPrepService } from './cisco-tcprep.service';

describe('CiscoTCPrepService', () => {
  let service: CiscoTCPrepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiscoTCPrepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
