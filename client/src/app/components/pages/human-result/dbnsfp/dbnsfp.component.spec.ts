import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbnsfpComponent } from './dbnsfp.component';

describe('DbnsfpComponent', () => {
  let component: DbnsfpComponent;
  let fixture: ComponentFixture<DbnsfpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbnsfpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbnsfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
