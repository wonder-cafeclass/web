import { ModuleWithProviders }      	from '@angular/core';
import { Routes, RouterModule }     	from '@angular/router';

import { LoginComponent } 				from './login.component';
import { KakaoCallbackComponent } 		from './kakao/kakao-callback.component';
import { NaverCallbackComponent } 		from './naver/naver-callback.component';
import { FacebookCallbackComponent } 	from './facebook/facebook-callback.component';
import { SignupComponent } 				from './signup/signup.component';

export const loginRoutes: Routes = 
[
	{ path: 'login', component: LoginComponent },
	{ path: 'login/kakao', component: KakaoCallbackComponent },
	{ path: 'login/naver', component: NaverCallbackComponent },
	{ path: 'login/facebook', component: FacebookCallbackComponent },
	{ path: 'login/signup', component: SignupComponent },
	{ path: 'login/signup/facebook/:facebookId', component: SignupComponent },
	{ path: 'login/signup/kakao/:kakaoId', component: SignupComponent },
	{ path: 'login/signup/naver/:naverId', component: SignupComponent }
];

export const loginRouting: ModuleWithProviders = RouterModule.forChild(loginRoutes);