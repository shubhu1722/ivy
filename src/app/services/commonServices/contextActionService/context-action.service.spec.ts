import { TestBed } from '@angular/core/testing';

import { ContextActionService } from './context-action.service';

describe('ContextActionService', () => {
  let service: ContextActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
