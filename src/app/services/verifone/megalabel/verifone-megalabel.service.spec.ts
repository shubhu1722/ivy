import { TestBed } from '@angular/core/testing';

import { VerifoneMegalabelService } from './verifone-megalabel.service';

describe('VerifoneMegalabelService', () => {
  let service: VerifoneMegalabelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifoneMegalabelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
