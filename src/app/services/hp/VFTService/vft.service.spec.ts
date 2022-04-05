import { TestBed } from '@angular/core/testing';

import { VFTService } from './vft.service';

describe('VFTService', () => {
  let service: VFTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VFTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
