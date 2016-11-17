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
var NaverCallbackComponent = (function () {
    function NaverCallbackComponent(loginService, myLoggerService, activatedRoute, router) {
        this.loginService = loginService;
        this.myLoggerService = myLoggerService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.isValidState = false;
        // Do something...
    } // end function
    NaverCallbackComponent.prototype.ngOnInit = function () {
        var _this = this;
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(this.myLoggerService.pageKeyLoginNaver);
        // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
        this.subscription = this.activatedRoute.queryParams.subscribe(function (param) {
            _this.code = param['code'];
            _this.state = param['state'];
            if (null != _this.code &&
                "" != _this.code &&
                null != _this.state &&
                "" != _this.state) {
                _this.getNaverState(_this.state, _this.code);
            } // end if
        }); // end subscribe
    }; // end function
    NaverCallbackComponent.prototype.ngOnDestroy = function () {
        // prevent memory leak by unsubscribing
        this.subscription.unsubscribe();
    };
    NaverCallbackComponent.prototype.getNaverState = function (state, code) {
        var _this = this;
        if (null == state || "" == state) {
            return;
        }
        if (null == code || "" == code) {
            return;
        }
        this.loginService
            .getNaverState(state)
            .then(function (result) {
            if (null != result &&
                null != result.is_valid_state) {
                _this.isValidState = result.is_valid_state;
            }
            // Session에 저장된 state와 비교합니다.
            if (_this.isValidState) {
                // 1. state가 정상적일 경우, 다음 단계를 진행
                _this.getNaverAccess(code);
            }
            else {
            }
        });
    };
    // @ Desc : Naver REST API에 접근하기 위한 접근 토큰(Access Token)을 받아옵니다. 
    NaverCallbackComponent.prototype.getNaverAccess = function (code) {
        var _this = this;
        if (null == code || "" == code) {
            return;
        }
        this.loginService
            .getNaverAccess(code)
            .then(function (result) {
            if (null != result &&
                null != result.access_token &&
                null != result.token_type) {
                _this.getNaverMe();
            } // end if
        }); // end method
    }; // end method
    // @ Desc : Naver REST API로 회원정보를 가져옵니다.
    NaverCallbackComponent.prototype.getNaverMe = function () {
        this.loginService
            .getNaverMe()
            .then(function (result) {
            console.log("naver-callback / getNaverMe / result : ", result);
            /*
            if( null != result.data &&
                null != result.data.access_token &&
                null != result.data.token_type ) {
      
              this.getNaverMe(result.data.token_type, result.data.access_token);
      
            } // end if
            */
        }); // end method    
    };
    NaverCallbackComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'naver-callback',
            templateUrl: 'naver-callback.component.html',
            styleUrls: ['naver-callback.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, my_logger_service_1.MyLoggerService, router_1.ActivatedRoute, router_1.Router])
    ], NaverCallbackComponent);
    return NaverCallbackComponent;
}());
exports.NaverCallbackComponent = NaverCallbackComponent; // end class
//# sourceMappingURL=naver-callback.component.js.map