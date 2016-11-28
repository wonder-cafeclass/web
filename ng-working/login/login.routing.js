"use strict";
var router_1 = require('@angular/router');
var login_component_1 = require('./login.component');
var kakao_callback_component_1 = require('./kakao/kakao-callback.component');
var naver_callback_component_1 = require('./naver/naver-callback.component');
var facebook_callback_component_1 = require('./facebook/facebook-callback.component');
var signup_component_1 = require('./signup/signup.component');
exports.loginRoutes = [
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'login/kakao', component: kakao_callback_component_1.KakaoCallbackComponent },
    { path: 'login/naver', component: naver_callback_component_1.NaverCallbackComponent },
    { path: 'login/facebook', component: facebook_callback_component_1.FacebookCallbackComponent },
    { path: 'login/signup', component: signup_component_1.SignupComponent },
    { path: 'login/signup/facebook/:facebookId', component: signup_component_1.SignupComponent },
    { path: 'login/signup/kakao/:kakaoId', component: signup_component_1.SignupComponent },
    { path: 'login/signup/naver/:naverId', component: signup_component_1.SignupComponent }
];
exports.loginRouting = router_1.RouterModule.forChild(exports.loginRoutes);
//# sourceMappingURL=login.routing.js.map