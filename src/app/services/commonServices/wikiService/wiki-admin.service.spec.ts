import { TestBed } from '@angular/core/testing';

import { WikiAdminService } from './wiki-admin.service';

describe('WikiAdminService', () => {
  let service: WikiAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WikiAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
