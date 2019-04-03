import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbnsfpScoreCellComponent } from './dbnsfp-score-cell.component';

describe('DbnsfpScoreCellComponent', () => {
  let component: DbnsfpScoreCellComponent;
  let fixture: ComponentFixture<DbnsfpScoreCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbnsfpScoreCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbnsfpScoreCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
