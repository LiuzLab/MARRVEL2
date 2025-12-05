import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DbnsfpComponent } from './dbnsfp.component';

describe('DbnsfpComponent', () => {
  let component: DbnsfpComponent;
  let fixture: ComponentFixture<DbnsfpComponent>;

  beforeEach(waitForAsync(() => {
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
