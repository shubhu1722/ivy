import { TestBed } from '@angular/core/testing';

import { CiscoECObookingService } from './cisco-ecobooking.service';

describe('CiscoECObookingService', () => {
  let service: CiscoECObookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiscoECObookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
