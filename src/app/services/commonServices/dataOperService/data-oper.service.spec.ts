import { TestBed } from '@angular/core/testing';

import { DataOperService } from './data-oper.service';

describe('DataOperService', () => {
  let service: DataOperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataOperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
