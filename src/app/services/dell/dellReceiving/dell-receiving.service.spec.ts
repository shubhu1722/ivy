import { TestBed } from '@angular/core/testing';

import { DellReceivingService } from './dell-receiving.service';

describe('DellReceivingService', () => {
  let service: DellReceivingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DellReceivingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
