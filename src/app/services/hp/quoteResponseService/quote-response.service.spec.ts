import { TestBed } from '@angular/core/testing';

import { QuoteResponseService } from './quote-response.service';

describe('QuoteResponseService', () => {
  let service: QuoteResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuoteResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
