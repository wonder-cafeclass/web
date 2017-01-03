"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var auth_service_1 = require('./auth.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var AuthGuard = (function () {
    function AuthGuard(authService, watchTower, router) {
        this.authService = authService;
        this.watchTower = watchTower;
        this.router = router;
        this.subscribeLoginUser();
    }
    AuthGuard.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    AuthGuard.prototype.subscribeLoginUser = function () {
        var _this = this;
        // 1. 이미 로그인 유저 정보가 들어왔다면 watchTower로부터 가져옵니다.
        this.loginUser = this.watchTower.getLoginUser();
        if (null == this.loginUser) {
            // 2. 유저 정보가 들어오지 않았다면 watchTower로부터 유저 정보가 들어올때까지 기다립니다.
            this.watchTower.loginAnnounced$.subscribe(function (user) {
                // 로그인한 유저 정보가 들어왔습니다.
                _this.loginUser = user;
            }); // end subscribe
        } // end if
    }; // end method
    AuthGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.canActivateChild = function (route, state) {
        return this.canActivate(route, state);
    };
    AuthGuard.prototype.canLoad = function (route) {
        var url = "/" + route.path;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.checkLogin = function (url) {
        if (this.isDebug())
            console.log("auth-guard / checkLogin / 시작");
        if (null == this.loginUser) {
            if (this.isDebug())
                console.log("auth-guard / checkLogin / 로그인되어 있지 않으면 로그인 창으로 이동");
            this.router.navigate(['/login']);
            return false;
        }
        else if (null != this.loginUser && !this.loginUser.isAdminUser()) {
            if (this.isDebug())
                console.log("auth-guard / checkLogin / 로그인 되어 있지만 운영자가 아니면 홈으로 이동");
            this.router.navigate(['/']);
            return false;
        }
        return true;
        // navigate으로 이동시 데이터를 전달하는 방법. 아래 방법으로 수업 정보를 상세 페이지에서 불러오는 방식이 적절할 듯.
        /*
        if (this.authService.isLoggedIn) { return true; }
    
        // Store the attempted URL for redirecting
        this.authService.redirectUrl = url;
    
        // Create a dummy session id
        let sessionId = 123456789;
    
        // Set our navigation extras object
        // that contains our global query params and fragment
        let navigationExtras: NavigationExtras = {
          queryParams: { 'session_id': sessionId },
          fragment: 'anchor'
        };
    
        // Navigate to the login page with extras
        this.router.navigate(['/login'], navigationExtras);
    
        return false;
        */
    }; // end method
    AuthGuard = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard; // end class
//# sourceMappingURL=auth-guard.service.js.map