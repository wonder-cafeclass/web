"use strict";
var router_1 = require('@angular/router');
var login_component_1 = require('./login.component');
var kakao_callback_component_1 = require('./kakao/kakao-callback.component');
var naver_callback_component_1 = require('./naver/naver-callback.component');
var facebook_callback_component_1 = require('./facebook/facebook-callback.component');
exports.loginRoutes = [
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'login/kakao', component: kakao_callback_component_1.KakaoCallbackComponent },
    { path: 'login/naver', component: naver_callback_component_1.NaverCallbackComponent },
    { path: 'login/facebook', component: facebook_callback_component_1.FacebookCallbackComponent }
];
exports.loginRouting = router_1.RouterModule.forChild(exports.loginRoutes);
//# sourceMappingURL=login.routing.js.map