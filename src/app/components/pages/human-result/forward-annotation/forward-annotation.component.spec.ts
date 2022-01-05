import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardAnnotationComponent } from './forward-annotation.component';

describe('ForwardAnnotationComponent', () => {
  let component: ForwardAnnotationComponent;
  let fixture: ComponentFixture<ForwardAnnotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForwardAnnotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
