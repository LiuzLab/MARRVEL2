import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClinvarVariantsTableComponent } from './clinvar-variants-table.component';

describe('ClinvarVariantsTableComponent', () => {
  let component: ClinvarVariantsTableComponent;
  let fixture: ComponentFixture<ClinvarVariantsTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinvarVariantsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinvarVariantsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
