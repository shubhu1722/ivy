import { TestBed } from '@angular/core/testing';

import { BatchprocessService } from './batchprocess.service';

describe('BatchprocessService', () => {
  let service: BatchprocessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchprocessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
