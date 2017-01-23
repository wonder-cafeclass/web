import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { WidgetModule }              from '../widget/widget.module';

import { UserMyComponent }           from './user-my.component';
import { UserMyNavListComponent }    from './user-my-nav-list.component';
import { MyInfoComponent }           from './view/user-my-nav-list/my-info.component';
import { MyInfoDashboardComponent }  from './view/user-my-nav-list/my-info-dashboard.component';
import { MyInfoKlassComponent }      from './view/user-my-nav-list/my-info-klass.component';
import { MyInfoPaymentComponent }    from './view/user-my-nav-list/my-info-payment.component';

import { KlassRadioBtnService }      from '../widget/klass/service/klass-radiobtn.service';
import { KlassColorService }         from '../widget/klass/service/klass-color.service';

import { UploadService }             from '../util/service/upload.service';
import { MyBirthdayService }         from '../util/service/my-birthday.service';

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
    UserMyNavListComponent,
    MyInfoComponent,
    MyInfoDashboardComponent,
    MyInfoKlassComponent,
    MyInfoPaymentComponent
  ],
  providers: [
    KlassRadioBtnService,
    KlassColorService,
    UploadService,
    MyBirthdayService
  ]
})
export class UsersModule {}