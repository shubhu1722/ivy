import { TestBed } from '@angular/core/testing';

import { CiscoReworkService } from './cisco-rework.service';

describe('CiscoReworkService', () => {
  let service: CiscoReworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiscoReworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
