import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdTimeserieNgxComponent } from './fd-timeserie-ngx.component';

describe('FdTimeserieNgxComponent', () => {
  let component: FdTimeserieNgxComponent;
  let fixture: ComponentFixture<FdTimeserieNgxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdTimeserieNgxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdTimeserieNgxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
