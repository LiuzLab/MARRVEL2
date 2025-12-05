import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PpiComponent } from './ppi.component';

describe('PpiComponent', () => {
  let component: PpiComponent;
  let fixture: ComponentFixture<PpiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
