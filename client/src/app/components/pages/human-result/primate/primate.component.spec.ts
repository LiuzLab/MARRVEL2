import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimateComponent } from './primate.component';

describe('PrimateComponent', () => {
  let component: PrimateComponent;
  let fixture: ComponentFixture<PrimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
