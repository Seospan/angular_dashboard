import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdGroupbyDatatableComponent } from './fd-groupby-datatable.component';

describe('FdGroupbyDatatableComponent', () => {
  let component: FdGroupbyDatatableComponent;
  let fixture: ComponentFixture<FdGroupbyDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdGroupbyDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdGroupbyDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
