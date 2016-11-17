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
var login_service_1 = require('../service/login.service');
var my_logger_service_1 = require('../../util/service/my-logger.service');
var FacebookCallbackComponent = (function () {
    function FacebookCallbackComponent(loginService, myLoggerService, router) {
        this.loginService = loginService;
        this.myLoggerService = myLoggerService;
        this.router = router;
        this.isValidState = false;
        // Do something...
    } // end function
    FacebookCallbackComponent.prototype.ngOnInit = function () {
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(this.myLoggerService.pageKeyLoginFacebook);
        if (null != this.router &&
            null != this.router.currentUrlTree &&
            null != this.router.currentUrlTree.queryParams &&
            null != this.router.currentUrlTree.queryParams.code &&
            null != this.router.currentUrlTree.queryParams.state) {
            this.code = this.router.currentUrlTree.queryParams.code;
            this.state = this.router.currentUrlTree.queryParams.state;
        }
        this.getState(this.state, this.code);
    }; // end function
    FacebookCallbackComponent.prototype.getState = function (state, code) {
        var _this = this;
        if (null == state || "" == state) {
            return;
        }
        if (null == code || "" == code) {
            return;
        }
        this.loginService
            .getFacebookState(state)
            .then(function (result) {
            if (null != result &&
                null != result.is_valid_state) {
                _this.isValidState = result.is_valid_state;
            }
            // Session에 저장된 state와 비교합니다.
            if (_this.isValidState) {
                // 1. state가 정상적일 경우, 다음 단계를 진행
                console.log("login.component / getFacebookState / result : ", result);
                _this.getAccessToken(code);
            }
            else {
            }
        });
    }; // end function
    FacebookCallbackComponent.prototype.getAccessToken = function (code) {
        var _this = this;
        this.loginService
            .getFacebookAccess(code)
            .then(function (result) {
            console.log("login.component / getFacebookAccess / result : ", result);
            if (null != result && null != result.access_token) {
                _this.getMe();
            }
        });
    };
    FacebookCallbackComponent.prototype.getMe = function () {
        this.loginService
            .getFacebookMe()
            .then(function (result) {
            console.log("login.component / getFacebookMe / result : ", result);
        });
    };
    FacebookCallbackComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'facebook-callback',
            templateUrl: 'facebook-callback.component.html',
            styleUrls: ['facebook-callback.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, my_logger_service_1.MyLoggerService, router_1.Router])
    ], FacebookCallbackComponent);
    return FacebookCallbackComponent;
}());
exports.FacebookCallbackComponent = FacebookCallbackComponent; // end class
//# sourceMappingURL=facebook-callback.component.js.map