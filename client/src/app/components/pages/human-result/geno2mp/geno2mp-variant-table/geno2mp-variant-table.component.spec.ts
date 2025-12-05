import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Geno2mpVariantTableComponent } from './geno2mp-variant-table.component';

describe('Geno2mpVariantTableComponent', () => {
  let component: Geno2mpVariantTableComponent;
  let fixture: ComponentFixture<Geno2mpVariantTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Geno2mpVariantTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Geno2mpVariantTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
