import { TestBed } from '@angular/core/testing';

import { DellCarPackoutshippingService } from './dell-car-packoutshipping.service';

describe('DellCarPackoutshippingService', () => {
  let service: DellCarPackoutshippingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DellCarPackoutshippingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
