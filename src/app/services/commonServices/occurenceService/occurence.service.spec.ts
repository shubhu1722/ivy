import { TestBed } from '@angular/core/testing';

import { OccurenceService } from './occurence.service';

describe('OccurenceService', () => {
  let service: OccurenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OccurenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
