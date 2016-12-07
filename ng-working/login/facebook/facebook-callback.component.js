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
var user_service_1 = require('../../users/service/user.service');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_logger_service_1 = require('../../util/service/my-logger.service');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var FacebookCallbackComponent = (function () {
    function FacebookCallbackComponent(loginService, myLoggerService, myCheckerService, watchTower, userService, activatedRoute, router) {
        this.loginService = loginService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.watchTower = watchTower;
        this.userService = userService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.redirectUrl = "/class-center";
        this.isValidState = false;
        this.isAdmin = false;
        this.errorMsgArr = [];
        // Do something...
    } // end function
    FacebookCallbackComponent.prototype.ngOnInit = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("facebook-callback / ngOnInit / init");
        // REMOVE ME
        // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
        // this.setIsAdmin();
        // my-checker.service의 apikey 가져옴. 
        // this.setMyCheckerReady();
    }; // end function
    FacebookCallbackComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("facebook-callback / ngAfterViewInit");
        this.asyncViewPack();
    };
    FacebookCallbackComponent.prototype.ngOnDestroy = function () {
        // prevent memory leak by unsubscribing
        this.subscription.unsubscribe();
    };
    FacebookCallbackComponent.prototype.asyncViewPack = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-info / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("my-info / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("my-info / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe    
    };
    FacebookCallbackComponent.prototype.setViewPack = function () {
        this.isAdmin = this.watchTower.getIsAdmin();
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
    /*
    private setIsAdmin() :void {
  
      let isDebug:boolean = true;
      // let isDebug:boolean = false;
      if(isDebug) console.log("facebook-callback / setIsAdmin / 시작");
  
      // 사전에 등록된 값을 가져옴. 페이지 이동시에는 직접 값을 가져와야 함.
      this.isAdmin = this.watchTower.getIsAdmin();
      if(isDebug) console.log("signup-select / setIsAdmin / 시작 / this.isAdmin : ",this.isAdmin);
  
      // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
      this.watchTower.isViewPackReady$.subscribe(
        (isAdmin:boolean) => {
  
        if(isDebug) console.log("facebook-callback / setIsAdmin / isAdmin : ",isAdmin);
        this.isAdmin = isAdmin;
      });
    }
  
    private setMyCheckerReady() :void {
  
      let isDebug:boolean = true;
      // let isDebug:boolean = false;
      if(isDebug) console.log("facebook-callback / setMyCheckerReady / 시작");
  
      // 페이지 이동으로 진입한 경우, watch tower에 저장된 변수 값을 가져온다.
      if(this.watchTower.getIsMyCheckerReady()) {
        this.init();
      }
  
      // 주소 입력으로 바로 도착한 경우, app-component에서 checker의 값을 가져온다.
      this.watchTower.myCheckerServicePackReady$.subscribe(
        (isReady:boolean) => {
  
        if(isDebug) console.log("facebook-callback / setMyCheckerReady / isReady : ",isReady);
  
        if(!isReady) {
          return;
        }
  
        // 축하합니다! API 통신을 위한 준비가 완료되었습니다.
        this.init();
      });
    }
    private setMyChecker() :void {
  
      // let isDebug:boolean = true;
      let isDebug:boolean = false;
      if(isDebug) console.log("facebook-callback / setMyChecker / 시작");
  
      if(this.watchTower.getIsMyCheckerReady()) {
  
        this.myCheckerService.setReady(
          // checkerMap:any
          this.watchTower.getCheckerMap(),
          // constMap:any
          this.watchTower.getConstMap(),
          // dirtyWordList:any
          this.watchTower.getDirtyWordList(),
          // apiKey:string
          this.watchTower.getApiKey()
        ); // end setReady
  
        if(isDebug) console.log("signup-select / setMyChecker / done!");
      } // end if
  
    }
    */
    FacebookCallbackComponent.prototype.init = function () {
        // REMOVE ME
        // this.setMyChecker();
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // 페이지 진입을 기록합니다.
        this.logActionPage();
        // 쿼리 스트링으로 전달받을 parameter들을 가져옵니다.
        this.getQueryString();
    };
    FacebookCallbackComponent.prototype.logActionPage = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("facebook-callback / getQueryString / init");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeLoginFacebook).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("facebook-callback / getQueryString / myResponse : ", myResponse);
        });
    };
    FacebookCallbackComponent.prototype.getQueryString = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("facebook-callback / getQueryString / init");
        // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
        this.subscription = this.activatedRoute.queryParams.subscribe(function (param) {
            if (isDebug)
                console.log("facebook-callback / getQueryString / param : ", param);
            _this.code = param['code'];
            _this.state = param['state'];
            if (isDebug)
                console.log("facebook-callback / getQueryString / this.code : ", _this.code);
            if (isDebug)
                console.log("facebook-callback / getQueryString / this.state : ", _this.state);
            if (null != _this.code &&
                "" != _this.code &&
                null != _this.state &&
                "" != _this.state) {
                _this.getState(_this.state, _this.code);
            } // end if
        }); // end subscribe
    };
    FacebookCallbackComponent.prototype.getState = function (state, code) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("facebook-callback / getState / init");
        if (null == state || "" == state) {
            return;
        }
        if (null == code || "" == code) {
            return;
        }
        if (isDebug)
            console.log("facebook-callback / getState / state : ", state);
        if (isDebug)
            console.log("facebook-callback / getState / code : ", code);
        this.loginService
            .getFacebookState(state)
            .then(function (myResponse) {
            if (isDebug)
                console.log("facebook-callback / getState / getFacebookState / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                _this.isValidState = myResponse.getDataProp("is_valid_state");
            }
            if (isDebug)
                console.log("facebook-callback / getState / getFacebookState / this.isValidState : ", _this.isValidState);
            // Session에 저장된 state와 비교합니다.
            if (_this.isValidState) {
                // 1. state가 정상적일 경우, 다음 단계를 진행
                if (isDebug)
                    console.log("facebook-callback / getFacebookState / state가 정상적일 경우, 다음 단계를 진행");
                _this.getAccessToken(code);
            }
            else {
                // 2. state가 다를 경우, 사용자에게 메시지 노출. '비정상적인 접근입니다.'. 메시지 확인 뒤, 로그인 홈으로 이동.
                // - 상황 정보를 로그로 남김. ex) '비정상 로그인 접근'
                if (isDebug)
                    console.log("facebook-callback / getFacebookState / state가 다를 경우, 사용자에게 메시지 노출. 메시지 확인 뒤, 로그인 홈으로 이동");
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "facebook-callback / getFacebookState / Failed! / state : " + state);
            } // end if
        }); // end getFacebookState
    }; // end function
    FacebookCallbackComponent.prototype.getAccessToken = function (code) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("facebook-callback / getAccessToken / init");
        this.loginService
            .getFacebookAccess(code)
            .then(function (myResponse) {
            if (isDebug)
                console.log("facebook-callback / getAccessToken / myResponse : ", myResponse);
            if (myResponse.isSuccess() && null != myResponse.getDataProp("access_token")) {
                _this.getMe();
            }
            else {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "facebook-callback / getAccessToken / Failed! / code : " + code);
            }
        });
    };
    FacebookCallbackComponent.prototype.getMe = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("facebook-callback / getMe / init");
        this.loginService
            .getFacebookMe()
            .then(function (myResponse) {
            if (isDebug)
                console.log("facebook-callback / getMe / myResponse : ", myResponse);
            if (myResponse.isFailed() || myResponse.hasNotDataProp("facebook_id")) {
                // TODO - 페이스북에서 유저 정보를 가져오는데 실패했습니다. 로그를 기록, 홈으로 이동합니다.
                if (isDebug)
                    console.log("facebook-callback / 페이스북에서 유저 정보를 가져오는데 실패했습니다.");
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "facebook-callback / getMe / Failed!");
                return;
            }
            // 페이스북 로그인 성공!
            // 로그인한 유저 정보를 가져오는데 성공했습니다!
            var facebookId = myResponse.getDataProp("facebook_id");
            var user = myResponse.getDataProp("user");
            if (myResponse.isSuccess() &&
                null != user &&
                null != user["gender"] &&
                null != user["mobile"]) {
                // 페이스북 로그인은 성공. 페이스북 유저 프로필에서 가져온 정보로 유저 등록됨. 
                // 하지만 추가 정보 필요. 
                // 회원 가입창으로 이동.
                if (isDebug)
                    console.log("facebook-callback / 페이스북 로그인은 성공. 페이스북 유저 프로필에서 가져온 정보로 유저 등록됨.회원 가입창으로 이동.");
                _this.router.navigate(['/login/signup/facebook', facebookId]);
            }
            else {
                // 2. mobile, gender가 있다면 정상 등록된 유저. 로그인 창으로 리다이렉트.
                // this.router.navigate([this.redirectUrl]);
                // 페이스북 로그인 성공. 등록된 유저 정보가 문제 없음. 
                // 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.
                if (isDebug)
                    console.log("facebook-callback / 페이스북 로그인은 성공. 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.");
                _this.confirmUserFacebook(facebookId);
            } // end if
        }); // end service
    };
    FacebookCallbackComponent.prototype.confirmUserFacebook = function (facebookId) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("facebook-callback / confirmUserFacebook / init");
        if (isDebug)
            console.log("facebook-callback / confirmUserFacebook / facebookId : " + facebookId);
        this.userService
            .confirmUserFacebook(this.myCheckerService.getAPIKey(), facebookId)
            .then(function (myResponse) {
            if (isDebug)
                console.log("facebook-callback / confirmUserFacebook / myResponse : ", myResponse);
            if (myResponse.isFailed()) {
                // facebook id로 쿠키 인증 실패. 홈으로 이동.
                if (isDebug)
                    console.log("facebook-callback / confirmUserFacebook / facebook id로 쿠키 인증 실패. 홈으로 이동.");
                _this.router.navigate([_this.redirectUrl]);
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "facebook-callback / getMe / confirmUserFacebook / Failed!");
                return;
            }
            // 쿠키 인증 성공!
            // 로그인 직전 페이지로 리다이렉트. 
            // 돌아갈 주소가 없다면, 홈으로 이동.
            if (isDebug)
                console.log("facebook-callback / confirmUserFacebook / facebook id로 쿠키 인증 성공!. 로그인 직전 페이지로 리다이렉트.");
            _this.router.navigate([_this.redirectUrl]);
        }); // end userService    
    };
    FacebookCallbackComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'facebook-callback',
            templateUrl: 'facebook-callback.component.html',
            styleUrls: ['facebook-callback.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, my_event_watchtower_service_1.MyEventWatchTowerService, user_service_1.UserService, router_1.ActivatedRoute, router_1.Router])
    ], FacebookCallbackComponent);
    return FacebookCallbackComponent;
}());
exports.FacebookCallbackComponent = FacebookCallbackComponent; // end class
//# sourceMappingURL=facebook-callback.component.js.map