import { TestBed } from '@angular/core/testing';

import { FormOperService } from './formOper.service';

describe('FormOperService', () => {
  let service: FormOperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormOperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
