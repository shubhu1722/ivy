import { TestBed } from '@angular/core/testing';

import { VerifoneSeachServiceService } from './verifone-seach-service.service';

describe('VerifoneSeachServiceService', () => {
  let service: VerifoneSeachServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifoneSeachServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
