import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodolistComponent } from './todolist/todolist.component';
import { ProjectComponent } from './project/project.component';
import { ProjectResolver } from 'src/app/_core/_resolvers/project.resolvers';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { RoutineComponent } from './routine/routine.component';
import { AbnormalComponent } from './abnormal/abnormal.component';
import { HistoryComponent } from './history/history.component';
import { FollowComponent } from './follow/follow.component';
import { ChatGroupComponent } from './chat-group/chat-group.component';
import { ProjectDetailResolver } from 'src/app/_core/_resolvers/projectDetail.resolvers';
import { RoutineResolver } from 'src/app/_core/_resolvers/routine.resolvers';
import { TutorialComponent } from './tutorial/tutorial.component';
import { TodolistResolver } from 'src/app/_core/_resolvers/todolist.resolvers';
import { HistoryResolver } from 'src/app/_core/_resolvers/history.resolvers';
import { FollowResolver } from 'src/app/_core/_resolvers/follow.resolvers';
import { AuthGuard } from 'src/app/_core/_guards/auth.guard';

const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard],
    data: {
      title: 'Client',
      preload: true
    },
    children: [
      {
        path: 'todolist/:code/:state',
        resolve: { todolist: TodolistResolver },
        component: TodolistComponent,
        data: {
          title: 'To Do List'
        }
      },
      {
        path: 'todolist',
        resolve: { todolist: TodolistResolver },
        component: TodolistComponent,
        data: {
          title: 'To Do List'
        }
      },
      {
        path: 'todolist/:taskname',
        resolve: { todolist: TodolistResolver },
        component: TodolistComponent,
        data: {
          title: 'To Do List 2'
        }
      },
      {
        path: 'todolist-comment/:id/:taskname',
        resolve: { todolist: TodolistResolver },
        component: TodolistComponent,
        data: {
          title: 'To Do List 3'
        }
      },
      {
        path: 'project',
        data: {
          title: 'Project'
        },
        component: ProjectComponent,
        resolve: { projects: ProjectResolver }
      },
      {
        path: 'project/detail/:id',
        component: ProjectDetailComponent,
        resolve: { details: ProjectDetailResolver },
        data: {
          title: 'Project Detail'
        }
      },
      {
        path: 'routine',
        component: RoutineComponent,
        resolve: { ocs: RoutineResolver },
        data: {
          title: 'Rotine'
        }
      },
      {
        path: 'routine/:taskname',
        component: RoutineComponent,
        resolve: { ocs: RoutineResolver },
        data: {
          title: 'Rotine'
        }
      },
      {
        path: 'abnormal',
        resolve: { ocs: RoutineResolver },
        component: AbnormalComponent,
        data: {
          title: 'Abnormal'
        }
      },
      {
        path: 'abnormal/:taskname',
        resolve: { ocs: RoutineResolver },
        component: AbnormalComponent,
        data: {
          title: 'Abnormal'
        }
      },
      {
        path: 'history',
        resolve: { histories: HistoryResolver },
        component: HistoryComponent,
        data: {
          title: 'History'
        }
      },
      {
        path: 'history/:taskname',
        resolve: { histories: HistoryResolver },
        component: HistoryComponent,
        data: {
          title: 'History'
        }
      },
      {
        path: 'history-comment/:id/:taskname',
        resolve: { histories: HistoryResolver },
        component: HistoryComponent,
        data: {
          title: 'History'
        }
      },
      {
        path: 'follow',
        resolve: { follows: FollowResolver },
        component: FollowComponent,
        data: {
          title: 'Follow'
        }
      },
      {
        path: 'follow/:taskname',
        resolve: { follows: FollowResolver },
        component: FollowComponent,
        data: {
          title: 'Follow'
        }
      },
      {
        path: 'chat-group',
        component: ChatGroupComponent,
        data: {
          title: 'Chat Group'
        }
      },
      {
        path: 'tutorial/:projectid',
        component: TutorialComponent,
        data: {
          title: 'Tutorial Video'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule {} // trong dđayây laà mayáy caái component conôn, khi naào maà theêm oơở trong dđaây nayày
