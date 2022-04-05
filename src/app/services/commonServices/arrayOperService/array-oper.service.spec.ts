import { TestBed } from '@angular/core/testing';

import { ArrayOperService } from './array-oper.service';

describe('ArrayOperService', () => {
  let service: ArrayOperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArrayOperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
