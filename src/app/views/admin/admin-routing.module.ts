import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OcComponent } from './oc/oc.component';
import { UserComponent } from './user/user.component';
import { OcUserComponent } from './oc-user/oc-user.component';
import { RoleComponent } from './role/role.component';
import { OcResolver } from 'src/app/_core/_resolvers/oc.resolvers';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from 'src/app/_core/_guards/auth.guard';
import { UserResolver } from 'src/app/_core/_resolvers/user.resolvers';
import { RoleResolver } from 'src/app/_core/_resolvers/role.resolvers';

const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard],
    data: {
      title: 'Admin',
      preload: true
    },
    children: [
      {
        path: 'dash',
        component: DashboardComponent,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'oc',
        resolve: { ocs: OcResolver },
        component: OcComponent,
        data: {
          title: 'Oc'
        }
      },
      {
        path: 'user',
        data: {
          title: 'User'
        },
        resolve: { users: UserResolver },
        component: UserComponent
      },

      {
        path: 'oc-user',
        component: OcUserComponent,
        resolve: { ocs: OcResolver },
        data: {
          title: 'OC User'
        }
      },
      {
        path: 'role',
        resolve: { roles: RoleResolver },
        component: RoleComponent,
        data: {
          title: 'Role'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {} // trong dđayây laà mayáy caái component conôn, khi naào maà theêm oơở trong dđaây nayày
