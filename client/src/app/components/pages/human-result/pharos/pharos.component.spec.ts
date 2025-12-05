import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PharosComponent } from './pharos.component';

describe('PharosComponent', () => {
  let component: PharosComponent;
  let fixture: ComponentFixture<PharosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PharosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
