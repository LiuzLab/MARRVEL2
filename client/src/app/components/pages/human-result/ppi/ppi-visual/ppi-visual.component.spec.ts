import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpiVisualComponent } from './ppi-visual.component';

describe('PpiVisualComponent', () => {
  let component: PpiVisualComponent;
  let fixture: ComponentFixture<PpiVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpiVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpiVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
