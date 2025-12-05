import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClinvarComponent } from './clinvar.component';

describe('ClinvarComponent', () => {
  let component: ClinvarComponent;
  let fixture: ComponentFixture<ClinvarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinvarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinvarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
