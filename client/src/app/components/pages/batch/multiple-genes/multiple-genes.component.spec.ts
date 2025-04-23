import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleGenesComponent } from './multiple-genes.component';

describe('MultipleGenesComponent', () => {
  let component: MultipleGenesComponent;
  let fixture: ComponentFixture<MultipleGenesComponent>;

  beforeEach(async(() => {
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
