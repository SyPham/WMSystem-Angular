import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTaskProjectComponent } from './list-task-project.component';

describe('ListTaskProjectComponent', () => {
  let component: ListTaskProjectComponent;
  let fixture: ComponentFixture<ListTaskProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTaskProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTaskProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
