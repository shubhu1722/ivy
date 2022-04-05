import { TestBed } from '@angular/core/testing';

import { ValidationalService } from './validational.service';

describe('ValidationalService', () => {
  let service: ValidationalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
