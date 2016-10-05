import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { AdminComponent }           from './admin.component';
import { AdminDashboardComponent }  from './admin-dashboard.component';
import { ManageClassesComponent }    from './manage-classes.component';
import { ManageUsersComponent }    from './manage-users.component';
import { adminRouting } from './admin.routing';
@NgModule({
  imports: [
    CommonModule,
    adminRouting
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    ManageClassesComponent,
    ManageUsersComponent
  ]
})
export class AdminModule {}
