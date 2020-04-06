/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WatchTutorialVideoComponent } from './watch-tutorial-video.component';

describe('WatchTutorialVideoComponent', () => {
  let component: WatchTutorialVideoComponent;
  let fixture: ComponentFixture<WatchTutorialVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchTutorialVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchTutorialVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
