import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Geno2mpPhenotypePictogramComponent } from './geno2mp-phenotype-pictogram.component';

describe('Geno2mpPhenotypePictogramComponent', () => {
  let component: Geno2mpPhenotypePictogramComponent;
  let fixture: ComponentFixture<Geno2mpPhenotypePictogramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Geno2mpPhenotypePictogramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Geno2mpPhenotypePictogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
