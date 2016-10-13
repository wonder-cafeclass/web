import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { UserListComponent }    from './user-list.component';
import { UserDetailComponent }  from './user-detail.component';

import { UserService } from './user.service';
import { usersRouting } from './users.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    usersRouting
  ],
  declarations: [
    UserListComponent,
    UserDetailComponent
  ],
  providers: [
    UserService
  ]
})
export class UsersModule {}
