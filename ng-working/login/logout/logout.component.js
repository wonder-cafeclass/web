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
var user_service_1 = require('../../users/service/user.service');
var my_logger_service_1 = require('../../util/service/my-logger.service');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var LogoutComponent = (function () {
    function LogoutComponent(userService, myCheckerService, myLoggerService, watchTower, router) {
        this.userService = userService;
        this.myCheckerService = myCheckerService;
        this.myLoggerService = myLoggerService;
        this.watchTower = watchTower;
        this.router = router;
    }
    LogoutComponent.prototype.ngOnInit = function () {
        this.setMyCheckerReady();
    };
    LogoutComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    LogoutComponent.prototype.setMyCheckerReady = function () {
        var _this = this;
        if (this.isDebug())
            console.log("logout / setMyCheckerReady / 시작");
        // 페이지 이동으로 진입한 경우, watch tower에 저장된 변수 값을 가져온다.
        if (this.watchTower.getIsMyCheckerReady()) {
            this.setMyChecker();
            this.init();
        }
        // 직접 주소를 입력하여 이동한 경우.
        this.watchTower.myCheckerServicePackReady$.subscribe(function (isReady) {
            if (_this.isDebug())
                console.log("logout / setMyCheckerReady / isReady : ", isReady);
            if (!isReady) {
                return;
            }
            _this.init();
        });
    };
    LogoutComponent.prototype.init = function () {
        this.setMyChecker();
        this.logActionPage();
        this.deleteLoginCookie();
    };
    LogoutComponent.prototype.setMyChecker = function () {
        if (this.isDebug())
            console.log("logout / setMyChecker / 시작");
        if (this.watchTower.getIsMyCheckerReady()) {
            this.myCheckerService.setReady(
            // checkerMap:any
            this.watchTower.getCheckerMap(), 
            // constMap:any
            this.watchTower.getConstMap(), 
            // dirtyWordList:any
            this.watchTower.getDirtyWordList(), 
            // apiKey:string
            this.watchTower.getApiKey()); // end setReady
            if (this.isDebug())
                console.log("logout / setMyChecker / done!");
        } // end if
    };
    LogoutComponent.prototype.logActionPage = function () {
        var _this = this;
        if (this.isDebug())
            console.log("logout / logActionPage / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeLogout).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (_this.isDebug())
                console.log("logout / logActionPage / myResponse : ", myResponse);
        });
    };
    LogoutComponent.prototype.deleteLoginCookie = function () {
        var _this = this;
        if (this.isDebug())
            console.log("logout / deleteLoginCookie / 시작");
        // 로그아웃시 해야할 일
        // 1. 로그인 쿠키를 지웁니다.
        this.userService
            .deleteUserCookie()
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("logout / deleteLoginCookie / myResponse : ", myResponse);
            // 1-1. 플랫폼 로그아웃 처리도 해줍니다.(나중에...)
            // 2. event-watch-tower를 통해서 로그아웃을 전파합니다. 
            // 해당 이벤트 스트림을 받는 엘리먼트들은 로그아웃 처리를 해줍니다.
            _this.emitNoUser();
            _this.goHome();
        });
    };
    LogoutComponent.prototype.emitNoUser = function () {
        this.watchTower.announceLoginTeacher(null);
        this.watchTower.announceLogin(null);
    }; // end
    LogoutComponent.prototype.goHome = function () {
        // 1. 홈화면으로 돌아갑니다. 
        // TODO 3-1. 로그아웃시 액세스가 가능하다면 해당 화면에 머무릅니다.
        // TODO 3-2. 로그아웃시 머물수 없는 화면이라면 홈화면으로 돌아갑니다.
        this.router.navigate(['/class-center']);
    };
    LogoutComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'logout',
            templateUrl: 'logout.component.html',
            styleUrls: ['logout.component.css']
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, my_checker_service_1.MyCheckerService, my_logger_service_1.MyLoggerService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], LogoutComponent);
    return LogoutComponent;
}());
exports.LogoutComponent = LogoutComponent;
//# sourceMappingURL=logout.component.js.map