import { TestBed } from '@angular/core/testing';

import { ButtonActionsService } from './button-actions.service';

describe('ButtonActionsService', () => {
  let service: ButtonActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ButtonActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
