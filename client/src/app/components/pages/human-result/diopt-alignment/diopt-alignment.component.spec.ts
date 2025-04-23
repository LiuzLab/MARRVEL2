import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DioptAlignmentComponent } from './diopt-alignment.component';

describe('DioptAlignmentComponent', () => {
  let component: DioptAlignmentComponent;
  let fixture: ComponentFixture<DioptAlignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DioptAlignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DioptAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
