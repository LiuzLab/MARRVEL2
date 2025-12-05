import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModelmatcherComponent } from './modelmatcher.component';

describe('ModelmatcherComponent', () => {
  let component: ModelmatcherComponent;
  let fixture: ComponentFixture<ModelmatcherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelmatcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelmatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
