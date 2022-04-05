import { TestBed } from '@angular/core/testing';

import { CiscoDebugService } from './cisco-debug.service';

describe('CiscoDebugService', () => {
  let service: CiscoDebugService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiscoDebugService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
