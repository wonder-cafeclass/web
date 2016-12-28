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
import { HawkeyeComponent }               from './validation/hawkeye.component';

import { LoginService }                   from './service/login.service';
import { UserService }                    from '../users/service/user.service';

import { MyBirthdayService }              from '../util/service/my-birthday.service';
import { MyCheckerService }               from '../util/service/my-checker.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WidgetModule,
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
    ValidationComponent,
    HawkeyeComponent
  ],
  providers: [
  	LoginService,
    UserService,
    MyBirthdayService,
    MyCheckerService
  ]
})
export class LoginModule {}