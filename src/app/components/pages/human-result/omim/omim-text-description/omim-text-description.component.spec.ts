import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmimTextDescriptionComponent } from './omim-text-description.component';

describe('OmimTextDescriptionComponent', () => {
  let component: OmimTextDescriptionComponent;
  let fixture: ComponentFixture<OmimTextDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmimTextDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmimTextDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
