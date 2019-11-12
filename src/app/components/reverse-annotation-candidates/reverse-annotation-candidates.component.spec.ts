import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverseAnnotationCandidatesComponent } from './reverse-annotation-candidates.component';

describe('ReverseAnnotationCandidatesComponent', () => {
  let component: ReverseAnnotationCandidatesComponent;
  let fixture: ComponentFixture<ReverseAnnotationCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReverseAnnotationCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReverseAnnotationCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
