import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneOntologyComponent } from './gene-ontology.component';

describe('GeneOntologyComponent', () => {
  let component: GeneOntologyComponent;
  let fixture: ComponentFixture<GeneOntologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneOntologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneOntologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
