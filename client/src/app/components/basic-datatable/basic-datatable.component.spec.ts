import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BasicDatatableComponent } from './basic-datatable.component';

describe('BasicDatatableComponent', () => {
  let component: BasicDatatableComponent;
  let fixture: ComponentFixture<BasicDatatableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
