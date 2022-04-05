import { TestBed } from '@angular/core/testing';

import { CiscoWcoperationsService } from './cisco-wcoperations.service';

describe('CiscoWcoperationsService', () => {
  let service: CiscoWcoperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiscoWcoperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
