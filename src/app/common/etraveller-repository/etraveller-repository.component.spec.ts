import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtravellerRepositoryComponent } from './etraveller-repository.component';

describe('EtravellerRepositoryComponent', () => {
  let component: EtravellerRepositoryComponent;
  let fixture: ComponentFixture<EtravellerRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtravellerRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtravellerRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
