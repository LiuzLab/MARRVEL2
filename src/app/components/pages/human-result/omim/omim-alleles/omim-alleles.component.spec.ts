import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmimAllelesComponent } from './omim-alleles.component';

describe('OmimAllelesComponent', () => {
  let component: OmimAllelesComponent;
  let fixture: ComponentFixture<OmimAllelesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmimAllelesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmimAllelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
