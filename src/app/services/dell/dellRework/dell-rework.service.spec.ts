import { TestBed } from '@angular/core/testing';

import { DellReworkService } from './dell-rework.service';

describe('DellReworkService', () => {
  let service: DellReworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DellReworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
