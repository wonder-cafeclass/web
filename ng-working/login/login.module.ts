import '../rxjs-extensions';

import { NgModule }                  from '@angular/core';
import { FormsModule }               from '@angular/forms';
import { CommonModule }              from '@angular/common';
// import { loginRouting }        		 from './login.routing';

import { LoginComponent }      		 from './login.component';
import { FacebookCallbackComponent } from './facebook/facebook-callback.component';
import { KakaoCallbackComponent } 	 from './kakao/kakao-callback.component';
import { NaverCallbackComponent } 	 from './naver/naver-callback.component';
import { SignupComponent } 	 		 from './signup/signup.component';

import { LoginService }              from './service/login.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // loginRouting
  ],
  declarations: [
    LoginComponent,
    FacebookCallbackComponent,
    KakaoCallbackComponent,
    NaverCallbackComponent,
    SignupComponent
  ],
  providers: [
  	LoginService
  ]
})
export class LoginModule {}