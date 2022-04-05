import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyDataComponent } from './key-data.component';

describe('KeyDataComponent', () => {
  let component: KeyDataComponent;
  let fixture: ComponentFixture<KeyDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
