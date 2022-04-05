import { TestBed } from '@angular/core/testing';

import { DellCarDebugService } from './dell-car-debug.service';

describe('DellCarDebugService', () => {
  let service: DellCarDebugService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DellCarDebugService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
