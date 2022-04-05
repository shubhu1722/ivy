import { TestBed } from '@angular/core/testing';
import { DellDebugPrService } from './dell-debug-pr.service';


describe('DellDebugPrService', () => {
  let service: DellDebugPrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DellDebugPrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});