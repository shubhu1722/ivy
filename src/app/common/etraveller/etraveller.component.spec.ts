import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ETravellerComponent } from './etraveller.component';

describe('ETravellerComponent', () => {
  let component: ETravellerComponent;
  let fixture: ComponentFixture<ETravellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ETravellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ETravellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
