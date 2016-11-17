import { ModuleWithProviders }      from '@angular/core';
import { Routes, RouterModule }     from '@angular/router';

import { LoginComponent } 				from './login.component';
import { KakaoCallbackComponent } 		from './kakao/kakao-callback.component';
import { NaverCallbackComponent } 		from './naver/naver-callback.component';
import { FacebookCallbackComponent } 	from './facebook/facebook-callback.component';

export const loginRoutes: Routes = 
[
	{ path: 'login', component: LoginComponent },
	{ path: 'login/kakao', component: KakaoCallbackComponent },
	{ path: 'login/naver', component: NaverCallbackComponent },
	{ path: 'login/facebook', component: FacebookCallbackComponent }
];

export const loginRouting: ModuleWithProviders = RouterModule.forChild(loginRoutes);