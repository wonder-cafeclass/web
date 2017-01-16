import '../rxjs-extensions';

import { NgModule }                       from '@angular/core';
import { FormsModule }                    from '@angular/forms';
import { CommonModule }                   from '@angular/common';

import { WidgetModule }                   from '../widget/widget.module';

import { teachersRouting }                from './teachers.routing';

import { ApplyTeacherComponent }          from './apply-teacher.component';
import { ApplyTeacherTermComponent }      from './view/apply-teacher-term.component';

import { TeacherMyNavListComponent }      from './view/teacher-my-nav-list.component';
import { TeacherInfoComponent }           from './view/teacher-my-nav-list/teacher-info.component';
import { TeacherInfoV2Component }         from './view/teacher-my-nav-list/teacher-info-v2.component';
import { TeacherInfoDashboardComponent }  from './view/teacher-my-nav-list/teacher-info-dashboard.component';
import { TeacherInfoFeedbackComponent }   from './view/teacher-my-nav-list/teacher-info-feedback.component';
import { TeacherInfoIncomeComponent }     from './view/teacher-my-nav-list/teacher-info-income.component';
import { TeacherInfoKlassAttendanceComponent }     from './view/teacher-my-nav-list/teacher-info-klass-attendance.component';
import { TeacherInfoKlassComponent }      from './view/teacher-my-nav-list/teacher-info-klass.component';

import { LoginService }                   from '../login/service/login.service';
import { UserService }                    from '../users/service/user.service';
import { TeacherService }                 from './service/teacher.service';

import { MyCheckerService }               from '../util/service/my-checker.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WidgetModule,
    teachersRouting
  ],
  declarations: [
    ApplyTeacherComponent,
    ApplyTeacherTermComponent,
    TeacherMyNavListComponent,
    TeacherInfoComponent,
    TeacherInfoV2Component,
    TeacherInfoDashboardComponent,
    TeacherInfoFeedbackComponent,
    TeacherInfoIncomeComponent,
    TeacherInfoKlassComponent,
    TeacherInfoKlassAttendanceComponent
  ],
  providers: [
  	LoginService,
    UserService,
    TeacherService,
    MyCheckerService
  ]
})
export class TeachersModule {}