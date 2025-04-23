import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GnomADComponent } from './gnom-ad.component';

describe('GnomADComponent', () => {
  let component: GnomADComponent;
  let fixture: ComponentFixture<GnomADComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GnomADComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GnomADComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
