import '../rxjs-extensions';

import { NgModule }                       from '@angular/core';
import { FormsModule }                    from '@angular/forms';
import { CommonModule }                   from '@angular/common';
import { loginRouting }        		        from './login.routing';

import { LoginComponent }      		        from './login.component';
import { FacebookCallbackComponent }      from './facebook/facebook-callback.component';
import { KakaoCallbackComponent } 	      from './kakao/kakao-callback.component';
import { NaverCallbackComponent } 	      from './naver/naver-callback.component';
import { SignupComponent } 	 		          from './signup/signup.component';
import { EmailComponent }                 from './signup/email/email.component';
import { PasswordComponent }              from './signup/password/password.component';
import { NameComponent }                  from './signup/name/name.component';
import { MobileComponent }                from './signup/mobile/mobile.component';
import { ProfileImgUploadComponent }      from './signup/profile-img-upload/profile-img-upload.component';
import { NicknameComponent }              from './signup/nickname/nickname.component';
import { GenderComponent }                from './signup/gender/gender.component';
import { BirthdayComponent }              from './signup/birthday/birthday.component';

import { LoginService }                   from './service/login.service';
import { MyBirthdayService }              from '../util/service/my-birthday.service';
import { MyCheckerService }               from '../util/service/my-checker.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    loginRouting
  ],
  declarations: [
    LoginComponent,
    FacebookCallbackComponent,
    KakaoCallbackComponent,
    NaverCallbackComponent,
    SignupComponent,
    EmailComponent,
    PasswordComponent,
    NameComponent,
    MobileComponent,
    ProfileImgUploadComponent,
    NicknameComponent,
    GenderComponent,
    BirthdayComponent
  ],
  providers: [
  	LoginService,
    MyBirthdayService,
    MyCheckerService
  ]
})
export class LoginModule {}