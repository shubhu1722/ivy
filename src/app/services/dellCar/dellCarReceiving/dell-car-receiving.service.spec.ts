import { TestBed } from '@angular/core/testing';

import { DellCarReceivingService } from './dell-car-receiving.service';

describe('DellCarReceivingService', () => {
  let service: DellCarReceivingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DellCarReceivingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
