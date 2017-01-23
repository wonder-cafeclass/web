"use strict";
var router_1 = require('@angular/router');
var login_component_1 = require('./login.component');
var logout_component_1 = require('./logout/logout.component');
var kakao_callback_component_1 = require('./kakao/kakao-callback.component');
var naver_callback_component_1 = require('./naver/naver-callback.component');
var facebook_callback_component_1 = require('./facebook/facebook-callback.component');
var signup_component_1 = require('./signup/signup.component');
var signup_select_component_1 = require('./signup/signup-select.component');
var validation_component_1 = require('./validation/validation.component');
exports.loginRoutes = [
    { path: '', component: login_component_1.LoginComponent },
    { path: 'logout', component: logout_component_1.LogoutComponent },
    { path: 'kakao', component: kakao_callback_component_1.KakaoCallbackComponent },
    { path: 'naver', component: naver_callback_component_1.NaverCallbackComponent },
    { path: 'facebook', component: facebook_callback_component_1.FacebookCallbackComponent },
    { path: 'signup', component: signup_component_1.SignupComponent },
    { path: 'signup/select', component: signup_select_component_1.SignupSelectComponent },
    { path: 'signup/facebook/:facebookId', component: signup_component_1.SignupComponent },
    { path: 'signup/kakao/:kakaoId', component: signup_component_1.SignupComponent },
    { path: 'signup/naver/:naverId', component: signup_component_1.SignupComponent },
    { path: 'signup/validation', component: validation_component_1.ValidationComponent }
];
exports.loginRouting = router_1.RouterModule.forChild(exports.loginRoutes);
//# sourceMappingURL=login.routing.js.map