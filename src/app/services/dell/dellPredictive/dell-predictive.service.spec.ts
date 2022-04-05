import { TestBed } from '@angular/core/testing';

import { DellPredictiveService } from './dell-predictive.service';

describe('DellPredictiveService', () => {
  let service: DellPredictiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DellPredictiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
