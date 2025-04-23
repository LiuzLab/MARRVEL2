import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelGeneHumanOrthologsComponent } from './model-gene-human-orthologs.component';

describe('ModelGeneHumanOrthologsComponent', () => {
  let component: ModelGeneHumanOrthologsComponent;
  let fixture: ComponentFixture<ModelGeneHumanOrthologsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelGeneHumanOrthologsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelGeneHumanOrthologsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
