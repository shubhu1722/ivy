import { TestBed } from '@angular/core/testing';

import { DellShippingService } from './dell-shipping.service';

describe('DellShippingService', () => {
  let service: DellShippingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DellShippingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
