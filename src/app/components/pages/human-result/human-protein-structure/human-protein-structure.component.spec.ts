import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanProteinStructureComponent } from './human-protein-structure.component';

describe('HumanProteinStructureComponent', () => {
  let component: HumanProteinStructureComponent;
  let fixture: ComponentFixture<HumanProteinStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumanProteinStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanProteinStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
