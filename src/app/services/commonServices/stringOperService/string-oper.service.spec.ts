import { TestBed } from '@angular/core/testing';

import { StringOperService } from './string-oper.service';

describe('StringOperService', () => {
  let service: StringOperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StringOperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
