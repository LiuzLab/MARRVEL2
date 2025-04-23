import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GnomADGeneComponent } from './gnom-ad-gene.component';

describe('GnomADGeneComponent', () => {
  let component: GnomADGeneComponent;
  let fixture: ComponentFixture<GnomADGeneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GnomADGeneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GnomADGeneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
