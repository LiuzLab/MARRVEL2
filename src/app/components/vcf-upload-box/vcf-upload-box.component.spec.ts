import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VcfUploadBoxComponent } from './vcf-upload-box.component';

describe('VcfUploadBoxComponent', () => {
  let component: VcfUploadBoxComponent;
  let fixture: ComponentFixture<VcfUploadBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VcfUploadBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VcfUploadBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
