import { ModuleWithProviders }      	from '@angular/core';
import { Routes, RouterModule }     	from '@angular/router';

import { LoginComponent } 				from './login.component';
import { LogoutComponent }              from './logout/logout.component';
import { KakaoCallbackComponent } 		from './kakao/kakao-callback.component';
import { NaverCallbackComponent } 		from './naver/naver-callback.component';
import { FacebookCallbackComponent } 	from './facebook/facebook-callback.component';
import { SignupComponent } 				from './signup/signup.component';
import { SignupSelectComponent } 		from './signup/signup-select.component';
import { ValidationComponent } 			from './validation/validation.component';
import { HawkeyeComponent }             from './validation/hawkeye.component';

export const loginRoutes: Routes = 
[
	{ path: 'login', component: LoginComponent },
	{ path: 'logout', component: LogoutComponent },
	{ path: 'login/hawkeye', component: HawkeyeComponent },
	{ path: 'login/kakao', component: KakaoCallbackComponent },
	{ path: 'login/naver', component: NaverCallbackComponent },
	{ path: 'login/facebook', component: FacebookCallbackComponent },
	{ path: 'login/signup', component: SignupComponent },
	{ path: 'login/signup/select', component: SignupSelectComponent },
	{ path: 'login/signup/facebook/:facebookId', component: SignupComponent },
	{ path: 'login/signup/kakao/:kakaoId', component: SignupComponent },
	{ path: 'login/signup/naver/:naverId', component: SignupComponent },
	{ path: 'login/signup/validation', component: ValidationComponent }
];

export const loginRouting: ModuleWithProviders = RouterModule.forChild(loginRoutes);