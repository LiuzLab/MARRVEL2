import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GnomADGeneVisualComponent } from './gnom-ad-gene-visual.component';

describe('GnomADGeneVisualComponent', () => {
  let component: GnomADGeneVisualComponent;
  let fixture: ComponentFixture<GnomADGeneVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GnomADGeneVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GnomADGeneVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
