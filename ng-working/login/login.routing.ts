import { Routes }         				from '@angular/router';
import { AuthGuard }      				from '../auth/auth-guard.service';
import { AuthService }    				from '../auth/auth.service';

import { LoginComponent } 				from './login.component';
import { KakaoCallbackComponent } 		from './kakao/kakao-callback.component';
import { NaverCallbackComponent } 		from './naver/naver-callback.component';
import { FacebookCallbackComponent } 	from './facebook/facebook-callback.component';

export const loginRoutes: Routes = 
[
	{ 
		path: 'login', 
		component: LoginComponent,
		children: 
		[
			{
				path: 'kakao',
				component: KakaoCallbackComponent
			},
			{
				path: 'naver',
				component: NaverCallbackComponent
			},
			{
				path: 'facebook',
				component: FacebookCallbackComponent
			}
		]
	}
];

export const authProviders = [
  AuthGuard,
  AuthService
];


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/