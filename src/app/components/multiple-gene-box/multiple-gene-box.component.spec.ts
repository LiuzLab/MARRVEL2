import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleGeneBoxComponent } from './multiple-gene-box.component';

describe('MultipleGeneBoxComponent', () => {
  let component: MultipleGeneBoxComponent;
  let fixture: ComponentFixture<MultipleGeneBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleGeneBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleGeneBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
