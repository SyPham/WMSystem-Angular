import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDetailComponent } from './project-detail.component';
import { ListTaskProjectComponent } from './list-task-project/list-task-project.component';
import { AddSubTaskComponent } from './list-task-project/add-sub-task/add-sub-task.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ProjectDetailComponent, ListTaskProjectComponent, AddSubTaskComponent]
})
export class ProjectDetailModule { }
