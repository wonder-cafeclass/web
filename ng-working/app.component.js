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
var teacher_service_1 = require('./teachers/service/teacher.service');
var my_event_watchtower_service_1 = require('./util/service/my-event-watchtower.service');
var my_checker_service_1 = require('./util/service/my-checker.service');
var my_logger_service_1 = require('./util/service/my-logger.service');
var AppComponent = (function () {
    // admin server 여부를 판별합니다.
    function AppComponent(authService, urlService, userService, teacherService, imageService, watchTower, myCheckerService, myLoggerService, route, router) {
        // Do something...
        this.authService = authService;
        this.urlService = urlService;
        this.userService = userService;
        this.teacherService = teacherService;
        this.imageService = imageService;
        this.watchTower = watchTower;
        this.myCheckerService = myCheckerService;
        this.myLoggerService = myLoggerService;
        this.route = route;
        this.router = router;
        this.isAdmin = false;
        this.toggleTopMenu = true;
        this.errorMsgArr = [];
    }
    AppComponent.prototype.ngOnInit = function () {
        this.subscribeAllErrors();
        this.subscribeLoginUser();
        this.subscribeLoginTeacher();
        this.subscribeToggleTopMenu();
        this.setIsAdmin();
        this.setMyChecker();
    };
    AppComponent.prototype.ngAfterViewChecked = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("app-root / ngAfterViewChecked / 시작");
        this.watchTower.announceContentHeight();
    };
    AppComponent.prototype.subscribeLoginUser = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("app-root / subscribeLoginUser / 시작");
        // 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
        // Subscribe login user
        this.watchTower.loginAnnounced$.subscribe(function (loginUser) {
            if (isDebug)
                console.log("app-root / subscribeLoginUser / loginUser : ", loginUser);
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
            // 로그인한 유저 정보가 들어왔습니다.
            _this.loginUser = loginUser;
        });
    };
    AppComponent.prototype.subscribeLoginTeacher = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("app-root / subscribeLoginTeacher / 시작");
        // 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
        // Subscribe login user
        this.watchTower.loginTeacherAnnounced$.subscribe(function (loginTeacher) {
            if (isDebug)
                console.log("app-root / subscribeLoginTeacher / loginTeacher : ", loginTeacher);
            // 로그인한 선생님 정보가 들어왔습니다.
            _this.loginTeacher = _this.teacherService.getTeacherFromJSON(loginTeacher);
        });
    };
    AppComponent.prototype.subscribeToggleTopMenu = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("app-root / subscribeToggleTopMenu / \uC2DC\uC791");
        // 최상단 메뉴를 보이거나 감춥니다.
        this.watchTower.toggleTopMenuAnnounced$.subscribe(function (toggleTopMenu) {
            if (isDebug)
                console.log("app-root / subscribeToggleTopMenu / toggleTopMenu : " + toggleTopMenu);
            _this.toggleTopMenu = toggleTopMenu;
        });
    };
    AppComponent.prototype.subscribeAllErrors = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("app-root / subscribeAllErrors / \uC2DC\uC791");
        // 화면에 표시할수 있는 발생한 모든 에러에 대해 표시합니다.
        this.watchTower.errorMsgArr$.subscribe(function (errorMsgArr) {
            if (isDebug)
                console.log("app-root / subscribeAllErrors / errorMsgArr : ", errorMsgArr);
            _this.errorMsgArr = errorMsgArr;
        });
    };
    AppComponent.prototype.setIsAdmin = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("app-root / setIsAdmin / \uC2DC\uC791");
        // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
        this.authService
            .getAdminAuth()
            .then(function (myResponse) {
            if (isDebug)
                console.log("app-root / setIsAdmin / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                _this.isAdmin = myResponse.getDataProp("is_admin");
                _this.watchTower.announceIsAdmin(_this.isAdmin);
            }
            else {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "app-root / setIsAdmin / Failed!");
            }
        });
    };
    AppComponent.prototype.setMyChecker = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("app-root / setMyChecker / \uC2DC\uC791");
        // 회원 로그인 쿠키를 가져옵니다.
        // 로그인 이후 만들어진 쿠키와 유저 정보가 있다면 DB를 통해 가져옵니다.
        this.myCheckerService
            .getChecker()
            .then(function (myResponse) {
            if (isDebug)
                console.log("app-root / setMyChecker / myResponse : ", myResponse);
            // 가져온 체커 정보들을 event-watchtower를 통해 전달합니다.
            _this.watchTower.announceMyCheckerServiceReady(
            // checkerMap: any
            myResponse.getDataProp("checker_map"), 
            // constMap: any
            myResponse.getDataProp("const_map"), 
            // dirtyWordList: any
            myResponse.getDataProp("dirty_word_list"), 
            // apiKey: string
            myResponse.getDataProp("api_key"));
            _this.getLoginUserFromCookie();
        });
    };
    AppComponent.prototype.getLoginUserFromCookie = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("app-root / getLoginUserFromCookie / \uC2DC\uC791");
        this.userService
            .getUserCookie(this.watchTower.getApiKey())
            .then(function (myResponse) {
            if (isDebug)
                console.log("app-root / getLoginUserFromCookie / myResponse : ", myResponse);
            var userFromDB = myResponse.getDataProp("user");
            if (myResponse.isSuccess() && null != userFromDB) {
                var user = _this.userService.getUserFromJSON(userFromDB);
                if (isDebug)
                    console.log("app-root / getLoginUserFromCookie / user : ", user);
                _this.loginUser = user;
                // 회원 로그인 정보를 가져왔다면, 가져온 로그인 정보를 다른 컴포넌트들에게도 알려줍니다.
                _this.watchTower.announceLogin(_this.loginUser);
                // 회원이 선생님이라면 선생님 정보를 가져온다.
                _this.getTeacherFromUser(+_this.loginUser.id);
            }
        });
    };
    AppComponent.prototype.getTeacherFromUser = function (userId) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("app-root / getTeacherFromUser / \uC2DC\uC791");
        if (isDebug)
            console.log("app-root / getTeacherFromUser / userId : " + userId);
        this.teacherService
            .getTeacher(this.watchTower.getApiKey(), userId)
            .then(function (myResponse) {
            if (isDebug)
                console.log("app-root / getTeacherFromUser / myResponse : ", myResponse);
            var teacherFromDB = myResponse.getDataProp("teacher");
            // 선생님 로그인 여부를 확인, 전파한다.
            _this.watchTower.announceLoginTeacher(teacherFromDB);
            _this.loginTeacher = _this.teacherService.getTeacherFromUser(teacherFromDB);
        }); // end service
    };
    AppComponent.prototype.onErrorThumbnail = function (event, thumbnail) {
        event.stopPropagation();
        event.preventDefault();
        // TODO - 이미지 없을 경우의 예비 이미지 로딩.
    };
    AppComponent.prototype.onClickSignupBtn = function (event) {
        event.stopPropagation();
        event.preventDefault();
        // 가입하기 페이지로 이동!
        this.router.navigate(['/login/signup/select']);
    };
    AppComponent.prototype.onClickThumbnail = function (event) {
        event.stopPropagation();
        event.preventDefault();
        // 내정보로 이동합니다.
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-app',
            styleUrls: ['app.component.css'],
            templateUrl: 'app.component.html'
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, url_service_1.UrlService, user_service_1.UserService, teacher_service_1.TeacherService, image_service_1.ImageService, my_event_watchtower_service_1.MyEventWatchTowerService, my_checker_service_1.MyCheckerService, my_logger_service_1.MyLoggerService, router_1.ActivatedRoute, router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map