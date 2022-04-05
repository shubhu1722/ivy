import { TestBed } from '@angular/core/testing';

import { CheckAccessoriesService } from './check-accessories.service';

describe('CheckAccessoriesService', () => {
  let service: CheckAccessoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckAccessoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
