import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DECIPHERComponent } from './decipher.component';

describe('DECIPHERComponent', () => {
  let component: DECIPHERComponent;
  let fixture: ComponentFixture<DECIPHERComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DECIPHERComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DECIPHERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
