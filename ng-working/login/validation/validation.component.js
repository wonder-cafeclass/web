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
require('rxjs/add/operator/switchMap');
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var login_service_1 = require('../service/login.service');
var user_service_1 = require('../../users/service/user.service');
var my_logger_service_1 = require('../../util/service/my-logger.service');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_event_service_1 = require('../../util/service/my-event.service');
var user_1 = require('../../users/model/user');
var my_response_1 = require('../../util/model/my-response');
var my_cookie_1 = require('../../util/http/my-cookie');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var ValidationComponent = (function () {
    function ValidationComponent(loginService, userService, myLoggerService, myCheckerService, myEventService, watchTower, route, router) {
        this.loginService = loginService;
        this.userService = userService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.route = route;
        this.router = router;
        this.msgTop = "";
        this.msgBottom = "";
        this.msgGuide = "등록하신 메일 주소로 보내드린 회원인증링크를 클릭해주세요.";
        this.msgWarning = "경고! 정상적이지 않은 접근입니다.";
        this.msgConfirmed = "축하합니다! 정상적으로 회원 등록이 완료되었습니다.";
        this.msgRedirect = "잠시 뒤에 홈화면으로 이동합니다.";
        this.isAdmin = false;
        this.myCookie = new my_cookie_1.MyCookie();
        this.userService.setWatchTower(watchTower);
    }
    ValidationComponent.prototype.isDebug = function () {
        // return true;
        return this.watchTower.isDebug();
    };
    ValidationComponent.prototype.ngAfterViewInit = function () {
        if (this.isDebug())
            console.log("my-info / ngAfterViewInit");
        this.asyncViewPack();
    };
    ValidationComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("my-info / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("my-info / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("my-info / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    ValidationComponent.prototype.setViewPack = function () {
        this.isAdmin = this.watchTower.getIsAdminServer();
        this.myCheckerService.setReady(
        // checkerMap:any
        this.watchTower.getCheckerMap(), 
        // constMap:any
        this.watchTower.getConstMap(), 
        // dirtyWordList:any
        this.watchTower.getDirtyWordList(), 
        // apiKey:string
        this.watchTower.getApiKey()); // end setReady
    };
    ValidationComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("validation / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        this.getUserValidation();
        // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
        this.watchTower.announceToggleTopMenu(false);
        this.watchTower.announceToggleFooter(false);
    };
    ValidationComponent.prototype.getUserValidation = function () {
        var _this = this;
        if (this.isDebug())
            console.log("validation / getUserValidation / init");
        // 외부 쿼리 스트링 파라미터를 가져옵니다.
        this.route.queryParams.switchMap(function (params) {
            if (_this.isDebug())
                console.log("validation / getUserValidation / switchMap / params : ", params);
            var key = "";
            if (null != params['key']) {
                // 받은 파라미터로 async 데이터를 가져온다.
                key = params['key'];
            }
            if (_this.isDebug())
                console.log("validation / getUserValidation / switchMap / key : ", key);
            if (null != key && "" != key) {
                // 1. 메일로 전달된 링크로 진입, 인증키로 회원 정보 확인.
                return _this.userService.confirmUserValidation(_this.myCheckerService.getAPIKey(), key);
            }
            else {
                // 2. 회원 등록 직후, 메일 확인을 요청하는 메시지를 회원에게 표시
                var myResponse = new my_response_1.MyResponse(
                // public success:boolean
                false, 
                // public message:string
                "", 
                // public query:string
                "", 
                // public error:string
                "", 
                // public data:any
                null, 
                // public extra:any         
                null);
                // @ Referer : http://stackoverflow.com/questions/35758209/typeerror-cannot-read-property-then-of-undefined
                return Promise.resolve(myResponse);
            }
        }).subscribe(function (myResponse) {
            // async 데이터 결과를 여기서 처리.
            if (_this.isDebug())
                console.log("validation / getUserValidation / subscribe / myResponse : ", myResponse);
            // 등록이 완료되었는지 확인.
            if (myResponse.isFailed()) {
                // 1. 회원 등록 직후, 메일 확인을 요청.
                if (_this.isDebug())
                    console.log("validation / getUserValidation / subscribe / 1. 회원 정보를 등록하고 바로 이동한 경우");
                _this.msgTop = _this.msgGuide;
            }
            else if (myResponse.isSuccess() && myResponse.hasDataProp("is_confirmed")) {
                // 2. 메일로 전달된 확인 링크로 들어온 경우.
                var is_confirmed = myResponse.hasDataProp("is_confirmed");
                var is_attack = myResponse.hasDataProp("is_attack");
                if (is_confirmed) {
                    if (_this.isDebug())
                        console.log("validation / getUserValidation / subscribe / 2. 인증 변경 완료후에는 사용자에게 완료 팝업을 노출.");
                    _this.msgTop = _this.msgConfirmed;
                    _this.msgBottom = _this.msgRedirect;
                    // 3초 뒤에 홈으로 이동.
                    var _self = _this;
                    setTimeout(function () {
                        // 로그인 직전 페이지로 리다이렉트. 
                        // 돌아갈 주소가 없다면, 홈으로 이동.
                        var redirectUrl = _self.myCookie.getCookie("redirectUrl");
                        if (null == redirectUrl || "" == redirectUrl) {
                            redirectUrl = '/class-center';
                        }
                        if (_self.isDebug())
                            console.log("validation / getUserValidation / subscribe / 3. 리다이렉트 : ", redirectUrl);
                        // 메시지를 3초 뒤에 화면에서 지웁니다.
                        _self.router.navigate([redirectUrl]);
                    }, 3000);
                    // event-watchtower에게 로그인 정보를 전달. 로그인 관련 내용을 화면에 표시합니다.
                    var userJSON = myResponse.getDataProp("user");
                    var user = new user_1.User().setJSON(userJSON);
                    if (null != user) {
                        _this.watchTower.announceLogin(user);
                    }
                }
                else if (is_attack) {
                    if (_this.isDebug())
                        console.log("validation / getUserValidation / subscribe / 3. 정상적이지 않은 접근.");
                    _this.msgTop = _this.msgWarning;
                    _this.msgBottom = _this.msgRedirect;
                    // 3초 뒤에 홈으로 이동.
                    var _self = _this;
                    setTimeout(function () {
                        // 메시지를 3초 뒤에 화면에서 지웁니다.
                        _self.router.navigate(['/class-center']);
                    }, 3000);
                }
                else {
                    if (_this.isDebug())
                        console.log("validation / getUserValidation / subscribe / 4. 인증 변경 실패에는 사용자에게 실패 팝업 및 문의 할수 있는 이메일/전화번호등을 노출함.");
                    _this.msgTop = _this.msgGuide;
                } // end if
            } // end if
        }); // end subscribe
    }; // end method
    ValidationComponent.prototype.onClickLogo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        // 홈으로 이동
        this.router.navigate(["/"]);
    }; // end method  
    ValidationComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'validation',
            templateUrl: 'validation.component.html',
            styleUrls: ['validation.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, user_service_1.UserService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.ActivatedRoute, router_1.Router])
    ], ValidationComponent);
    return ValidationComponent;
}());
exports.ValidationComponent = ValidationComponent; // end class
//# sourceMappingURL=validation.component.js.map