import { TestBed } from '@angular/core/testing';

import { ConfigDebugService } from './config-debug.service';

describe('ConfigDebugService', () => {
  let service: ConfigDebugService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigDebugService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
