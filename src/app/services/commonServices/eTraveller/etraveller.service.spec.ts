import { TestBed } from '@angular/core/testing';

import { ETravellerService } from './etraveller.service';

describe('ETravellerService', () => {
  let service: ETravellerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ETravellerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
