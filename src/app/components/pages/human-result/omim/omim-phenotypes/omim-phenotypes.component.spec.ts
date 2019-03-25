import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmimPhenotypesComponent } from './omim-phenotypes.component';

describe('OmimPhenotypesComponent', () => {
  let component: OmimPhenotypesComponent;
  let fixture: ComponentFixture<OmimPhenotypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmimPhenotypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmimPhenotypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
