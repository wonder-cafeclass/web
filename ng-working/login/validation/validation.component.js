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
var ValidationComponent = (function () {
    function ValidationComponent(loginService, userService, myLoggerService, myCheckerService, myEventService, route, router) {
        var _this = this;
        this.loginService = loginService;
        this.userService = userService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.route = route;
        this.router = router;
        this.msgTop = "";
        this.msgBottom = "";
        this.msgGuide = "등록하신 메일 주소로 보내드린 회원인증링크를 클릭해주세요.";
        this.msgWarning = "경고! 정상적이지 않은 접근입니다.";
        this.msgConfirmed = "축하합니다! 정상적으로 회원 등록이 완료되었습니다.";
        this.msgRedirect = "잠시 뒤에 홈화면으로 이동합니다.";
        // 서버에서 파라미터를 검증할 check 데이터를 받아옵니다.
        // 데이터를 받아온 이후에 처리를 진행합니다.
        this.myCheckerService.getReady().then(function () {
            _this.getUserValidation();
            return Promise.resolve();
        });
    }
    ValidationComponent.prototype.getUserValidation = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("validation / getUserValidation / init");
        // 외부 쿼리 스트링 파라미터를 가져옵니다.
        this.route.queryParams.switchMap(function (params) {
            if (isDebug)
                console.log("validation / getUserValidation / switchMap / params : ", params);
            var key = "";
            if (null != params['key']) {
                // 받은 파라미터로 async 데이터를 가져온다.
                key = params['key'];
            }
            if (isDebug)
                console.log("validation / getUserValidation / switchMap / key : ", key);
            if (null != key && "" != key) {
                return _this.userService.confirmUserValidation(_this.myCheckerService.getAPIKey(), key);
            }
            // @ Referer : http://stackoverflow.com/questions/35758209/typeerror-cannot-read-property-then-of-undefined
            return Promise.resolve();
        }).subscribe(function (result) {
            // async 데이터 결과를 여기서 처리.
            if (isDebug)
                console.log("validation / getUserValidation / subscribe / result : ", result);
            // 등록이 완료되었는지 확인.
            if (null == result) {
                console.log("1. 회원 정보를 등록하고 바로 이동한 경우.");
                _this.msgTop = _this.msgGuide;
            }
            else if (null != result && null != result.is_confirmed) {
                if (result.is_confirmed) {
                    console.log("2. 인증 변경 완료후에는 사용자에게 완료 팝업을 노출.");
                    _this.msgTop = _this.msgConfirmed;
                    _this.msgBottom = _this.msgRedirect;
                    // 3초 뒤에 홈으로 이동.
                    var _self = _this;
                    setTimeout(function () {
                        // 메시지를 3초 뒤에 화면에서 지웁니다.
                        _self.router.navigate(['/class-center']);
                    }, 3000);
                }
                else if (result.is_attack) {
                    console.log("3. 정상적이지 않은 접근.");
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
                    // TODO - 3. 인증 변경 실패에는 사용자에게 실패 팝업 및 문의 할수 있는 이메일/전화번호등을 노출함.
                    console.log("3. 인증 변경 실패에는 사용자에게 실패 팝업 및 문의 할수 있는 이메일/전화번호등을 노출함.");
                    _this.msgTop = _this.msgGuide;
                } // end if
            } // end if
            return Promise.resolve();
        }); // end subscribe
    }; // end method
    ValidationComponent.prototype.ngOnInit = function () { };
    ValidationComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'validation',
            templateUrl: 'validation.component.html',
            styleUrls: ['validation.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, user_service_1.UserService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService, router_1.ActivatedRoute, router_1.Router])
    ], ValidationComponent);
    return ValidationComponent;
}());
exports.ValidationComponent = ValidationComponent;
//# sourceMappingURL=validation.component.js.map