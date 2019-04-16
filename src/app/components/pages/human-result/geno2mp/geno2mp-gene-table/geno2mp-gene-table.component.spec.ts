import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Geno2mpGeneTableComponent } from './geno2mp-gene-table.component';

describe('Geno2mpGeneTableComponent', () => {
  let component: Geno2mpGeneTableComponent;
  let fixture: ComponentFixture<Geno2mpGeneTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Geno2mpGeneTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Geno2mpGeneTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
