import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OmimComponent } from './omim.component';

describe('OmimComponent', () => {
  let component: OmimComponent;
  let fixture: ComponentFixture<OmimComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OmimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
