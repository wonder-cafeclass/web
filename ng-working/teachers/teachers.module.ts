import '../rxjs-extensions';

import { NgModule }                       from '@angular/core';
import { FormsModule }                    from '@angular/forms';
import { CommonModule }                   from '@angular/common';

import { WidgetModule }                   from '../widget/widget.module';

import { teachersRouting }                from './teachers.routing';

import { ApplyTeacherComponent }          from './apply-teacher.component';
import { ApplyTeacherTermComponent }      from './view/apply-teacher-term.component';

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
    ApplyTeacherTermComponent
  ],
  providers: [
  	LoginService,
    UserService,
    TeacherService,
    MyCheckerService
  ]
})
export class TeachersModule {}