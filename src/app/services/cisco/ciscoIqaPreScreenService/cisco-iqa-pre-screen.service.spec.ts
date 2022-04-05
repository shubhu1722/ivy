import { TestBed } from '@angular/core/testing';

import { CiscoIqaPreScreenService } from './cisco-iqa-pre-screen.service';

describe('CiscoIqaPreScreenService', () => {
  let service: CiscoIqaPreScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiscoIqaPreScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
