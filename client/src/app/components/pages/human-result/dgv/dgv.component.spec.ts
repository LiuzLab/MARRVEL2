import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DgvComponent } from './dgv.component';

describe('DgvComponent', () => {
  let component: DgvComponent;
  let fixture: ComponentFixture<DgvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DgvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DgvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
