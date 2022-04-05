import { TestBed } from '@angular/core/testing';

import { DellCarAssessmentService } from './dell-car-assessment.service';

describe('DellCarAssessmentService', () => {
  let service: DellCarAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DellCarAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
