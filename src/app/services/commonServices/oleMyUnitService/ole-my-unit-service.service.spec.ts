import { TestBed } from '@angular/core/testing';
import { OleMyUnitServiceService } from './ole-my-unit-service.service';

describe('OleMyUnitServiceService', () => {
  let service: OleMyUnitServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OleMyUnitServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
