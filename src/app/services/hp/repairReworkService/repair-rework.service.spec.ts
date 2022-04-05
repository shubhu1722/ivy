import { TestBed } from '@angular/core/testing';

import { RepairReworkService } from './repair-rework.service';

describe('RepairReworkService', () => {
  let service: RepairReworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepairReworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
