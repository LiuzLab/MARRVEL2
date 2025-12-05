import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProteinViewerComponent } from './protein-viewer.component';

describe('ProteinViewerComponent', () => {
  let component: ProteinViewerComponent;
  let fixture: ComponentFixture<ProteinViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProteinViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteinViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
