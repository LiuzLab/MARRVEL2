import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultipleGeneBoxComponent } from './multiple-gene-box.component';

describe('MultipleGeneBoxComponent', () => {
  let component: MultipleGeneBoxComponent;
  let fixture: ComponentFixture<MultipleGeneBoxComponent>;

  beforeEach(waitForAsync(() => {
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
