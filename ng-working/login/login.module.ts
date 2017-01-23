import '../rxjs-extensions';

import { NgModule }                       from '@angular/core';
import { FormsModule }                    from '@angular/forms';
import { CommonModule }                   from '@angular/common';

import { WidgetModule }                   from '../widget/widget.module';

import { loginRouting }        		        from './login.routing';

import { LoginComponent }      		        from './login.component';
import { LogoutComponent }                from './logout/logout.component';
import { FacebookCallbackComponent }      from './facebook/facebook-callback.component';
import { KakaoCallbackComponent } 	      from './kakao/kakao-callback.component';
import { NaverCallbackComponent } 	      from './naver/naver-callback.component';
import { SignupComponent } 	 		          from './signup/signup.component';
import { SignupSelectComponent }          from './signup/signup-select.component';
import { ValidationComponent }            from './validation/validation.component';

import { LoginService }                   from './service/login.service';
import { UserService }                    from '../users/service/user.service';
import { TeacherService }                 from '../teachers/service/teacher.service';

import { MyBirthdayService }              from '../util/service/my-birthday.service';
import { MyCheckerService }               from '../util/service/my-checker.service';
import { UploadService }                  from '../util/service/upload.service';

import { SharedModule }                   from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WidgetModule,
    SharedModule,
    loginRouting
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    FacebookCallbackComponent,
    KakaoCallbackComponent,
    NaverCallbackComponent,
    SignupComponent,
    SignupSelectComponent,
    ValidationComponent
  ],
  providers: [
  	LoginService,
    UserService,
    TeacherService,
    MyBirthdayService,
    MyCheckerService,
    UploadService
  ]
})
export class LoginModule {}