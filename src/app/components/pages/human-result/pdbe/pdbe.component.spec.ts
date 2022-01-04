import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdbeComponent } from './pdbe.component';

describe('PdbeComponent', () => {
  let component: PdbeComponent;
  let fixture: ComponentFixture<PdbeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdbeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
