import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModelGeneHumanOrthologsComponent } from './model-gene-human-orthologs.component';

describe('ModelGeneHumanOrthologsComponent', () => {
  let component: ModelGeneHumanOrthologsComponent;
  let fixture: ComponentFixture<ModelGeneHumanOrthologsComponent>;

  beforeEach(waitForAsync(() => {
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
