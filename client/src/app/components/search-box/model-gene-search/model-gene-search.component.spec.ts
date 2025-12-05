import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModelGeneSearchComponent } from './model-gene-search.component';

describe('ModelGeneSearchComponent', () => {
  let component: ModelGeneSearchComponent;
  let fixture: ComponentFixture<ModelGeneSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelGeneSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelGeneSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
