import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgrExpressionComponent } from './agr-expression.component';

describe('AgrExpressionComponent', () => {
  let component: AgrExpressionComponent;
  let fixture: ComponentFixture<AgrExpressionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgrExpressionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgrExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
