import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpiComponent } from './ppi.component';

describe('PpiComponent', () => {
  let component: PpiComponent;
  let fixture: ComponentFixture<PpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
