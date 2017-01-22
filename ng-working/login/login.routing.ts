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

export const loginRoutes: Routes = 
[
	{ path: '', component: LoginComponent },
	{ path: 'logout', component: LogoutComponent },
	{ path: 'kakao', component: KakaoCallbackComponent },
	{ path: 'naver', component: NaverCallbackComponent },
	{ path: 'facebook', component: FacebookCallbackComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'signup/select', component: SignupSelectComponent },
	{ path: 'signup/facebook/:facebookId', component: SignupComponent },
	{ path: 'signup/kakao/:kakaoId', component: SignupComponent },
	{ path: 'signup/naver/:naverId', component: SignupComponent },
	{ path: 'signup/validation', component: ValidationComponent }	
];

export const loginRouting: ModuleWithProviders = RouterModule.forChild(loginRoutes);