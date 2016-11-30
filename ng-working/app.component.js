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
var url_service_1 = require('./util/url.service');
var auth_service_1 = require('./auth.service');
var image_service_1 = require('./util/image.service');
var user_service_1 = require('./users/service/user.service');
var my_event_watchtower_service_1 = require('./util/service/my-event-watchtower.service');
var my_checker_service_1 = require('./util/service/my-checker.service');
var AppComponent = (function () {
    // admin server 여부를 판별합니다.
    function AppComponent(authService, urlService, userService, imageService, myEventWatchTowerService, myCheckerService, route, router) {
        // Do something...
        this.authService = authService;
        this.urlService = urlService;
        this.userService = userService;
        this.imageService = imageService;
        this.myEventWatchTowerService = myEventWatchTowerService;
        this.myCheckerService = myCheckerService;
        this.route = route;
        this.router = router;
        this.isAdmin = false;
        this.toggleTopMenu = true;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
        this.authService.getAdminAuth().then(function (result) {
            if (null != result.is_admin) {
                _this.isAdmin = result.is_admin;
            }
        });
        // Subscribe login user
        this.myEventWatchTowerService.loginAnnounced$.subscribe(function (loginUser) {
            // Example
            /*
            {
                birthday: "1981-07-17"
                date_created: "2016-11-29 23:11:53"
                date_updated: "2016-11-29 23:12:53"
                email: "wonder13662@gmail.com"
                facebook_id: ""
                gender: "M"
                google_id: null
                id: "1"
                kakao_id: "311947172"
                mobile: "010-1234-5678"
                name: "정원덕"
                naver_id: ""
                nickname: "정원덕"
                permission: "U"
                status: "A"
                thumbnail: "assets/images/user/2016-11-29|23|11|53|640151.jpg"
            }
            */
            if (null != loginUser) {
                // 로그인한 유저 정보가 들어왔습니다.
                _this.loginUser = loginUser;
            } // end if
        });
        // Subscribe toggle top menu
        // 최상단 메뉴를 보이거나 감춥니다.
        this.myEventWatchTowerService.toggleTopMenuAnnounced$.subscribe(function (toggleTopMenu) {
            _this.toggleTopMenu = toggleTopMenu;
        });
        // 회원 로그인 쿠키를 가져옵니다.
        // 로그인 이후 만들어진 쿠키와 유저 정보가 있다면 DB를 통해 가져옵니다.
        this.myCheckerService.getReady().then(function () {
            _this.userService.getUserCookie(_this.myCheckerService.getAPIKey()).then(function (result) {
                if (null != result && null != result.user) {
                    _this.loginUser = result.user;
                }
            });
        }); // end Promise
    };
    AppComponent.prototype.onErrorThumbnail = function (event, thumbnail) {
        event.stopPropagation();
        event.preventDefault();
        // TODO - 이미지 없을 경우의 예비 이미지 로딩.
        console.log("onErrorThumbnail / thumbnail : ", thumbnail);
    };
    AppComponent.prototype.onClickSignupBtn = function (event) {
        event.stopPropagation();
        event.preventDefault();
        // 가입하기 페이지로 이동!
        this.router.navigate(['/login/signup/select']);
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-app',
            styleUrls: ['app.component.css'],
            templateUrl: 'app.component.html'
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, url_service_1.UrlService, user_service_1.UserService, image_service_1.ImageService, my_event_watchtower_service_1.MyEventWatchTowerService, my_checker_service_1.MyCheckerService, router_1.ActivatedRoute, router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map