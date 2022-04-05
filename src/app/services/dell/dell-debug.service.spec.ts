import { TestBed } from '@angular/core/testing';

import { DellDebugService } from './dell-debug.service';

describe('DellDebugService', () => {
  let service: DellDebugService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DellDebugService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
