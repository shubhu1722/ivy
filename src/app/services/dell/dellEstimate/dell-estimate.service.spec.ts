import { TestBed } from '@angular/core/testing';

import { DellEstimateService } from './dell-estimate.service';

describe('DellEstimateService', () => {
  let service: DellEstimateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DellEstimateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
