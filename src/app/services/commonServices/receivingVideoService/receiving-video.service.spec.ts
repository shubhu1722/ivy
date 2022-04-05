import { TestBed } from '@angular/core/testing';

import { ReceivingVideoService } from './receiving-video.service';

describe('ReceivingVideoService', () => {
  let service: ReceivingVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceivingVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
