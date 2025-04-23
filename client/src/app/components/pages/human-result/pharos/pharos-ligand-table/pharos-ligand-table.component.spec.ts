import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharosLigandTableComponent } from './pharos-ligand-table.component';

describe('PharosLigandTableComponent', () => {
  let component: PharosLigandTableComponent;
  let fixture: ComponentFixture<PharosLigandTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharosLigandTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharosLigandTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
