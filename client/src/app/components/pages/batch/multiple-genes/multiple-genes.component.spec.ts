import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultipleGenesComponent } from './multiple-genes.component';

describe('MultipleGenesComponent', () => {
  let component: MultipleGenesComponent;
  let fixture: ComponentFixture<MultipleGenesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleGenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleGenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
