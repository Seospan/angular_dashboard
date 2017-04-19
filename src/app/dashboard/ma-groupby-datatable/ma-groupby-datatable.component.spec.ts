import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaGroupbyDatatableComponent } from './ma-groupby-datatable.component';

describe('MaGroupbyDatatableComponent', () => {
  let component: MaGroupbyDatatableComponent;
  let fixture: ComponentFixture<MaGroupbyDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaGroupbyDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaGroupbyDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
