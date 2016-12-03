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
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var LogoutComponent = (function () {
    function LogoutComponent(userService, myEventWatchTowerService, router) {
        this.userService = userService;
        this.myEventWatchTowerService = myEventWatchTowerService;
        this.router = router;
    }
    LogoutComponent.prototype.ngOnInit = function () {
        // TODO 페이지 진입을 기록으로 남깁니다.
        var _this = this;
        // 로그아웃시 해야할 일
        // 1. 로그인 쿠키를 지웁니다.
        this.userService
            .deleteUserCookie()
            .then(function (result) {
            console.log("logout / result : ", result);
            // 1-1. 플랫폼 로그아웃 처리도 해줍니다.(나중에...)
            // 2. event-watch-tower를 통해서 로그아웃을 전파합니다. 
            // 해당 이벤트 스트림을 받는 엘리먼트들은 로그아웃 처리를 해줍니다.
            _this.myEventWatchTowerService.announceLogin(null);
            // 3. 홈화면으로 돌아갑니다. 
            // TODO 3-1. 로그아웃시 액세스가 가능하다면 해당 화면에 머무릅니다.
            // TODO 3-2. 로그아웃시 머물수 없는 화면이라면 홈화면으로 돌아갑니다.
            _this.router.navigate(['/class-center']);
        });
    };
    LogoutComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'logout',
            templateUrl: 'logout.component.html',
            styleUrls: ['logout.component.css']
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], LogoutComponent);
    return LogoutComponent;
}());
exports.LogoutComponent = LogoutComponent;
//# sourceMappingURL=logout.component.js.map