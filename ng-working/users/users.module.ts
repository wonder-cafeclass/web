import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

// REMOVE ME

// Legacy - No use
// import { UserListComponent }    from './user-list.component';
// import { UserDetailComponent }  from './user-detail.component';

// Service view

import { WidgetModule }              from '../widget/widget.module';

import { KlassRadioBtnService }      from '../klass/service/klass-radiobtn.service';

import { UserMyComponent }           from './user-my.component';
import { UserMyNavListComponent }    from './user-my-nav-list.component';

import { UserService }               from './user.service';
import { KlassRadioBtnService }      from '../klass/service/klass-radiobtn.service';

import { usersRouting }              from './users.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WidgetModule,
    usersRouting
  ],
  declarations: [
    UserMyComponent,
    UserMyNavListComponent
  ],
  providers: [
    UserService,
    KlassRadioBtnService
  ]
})
export class UsersModule {}