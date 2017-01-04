import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';

import { AdminComponent }           from './admin.component';
import { AdminDashboardComponent }  from './admin-dashboard.component';
import { ManageAdminUsersComponent }from './manage-admin-users.component';
import { ManageTeachersComponent }  from './manage-teachers.component';
import { ManageUsersComponent }     from './manage-users.component';
import { ManageKlassesComponent }   from './manage-klasses.component';

import { AdminService }             from './service/admin.service';
import { adminRouting }             from './admin.routing';

import { WidgetModule }              from '../widget/widget.module';

@NgModule({
  imports: [
    CommonModule,
    adminRouting,
    WidgetModule
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    ManageAdminUsersComponent,
    ManageTeachersComponent,
    ManageUsersComponent,
    ManageKlassesComponent
  ],
  providers: [
    AdminService
  ]  
})
export class AdminModule {}