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
var auth_service_1 = require('../auth/auth.service');
var login_service_1 = require('./service/login.service');
var user_service_1 = require('../users/service/user.service');
var email_component_1 = require('../widget/input/email/email.component');
var password_component_1 = require('../widget/input/password/password.component');
var my_logger_service_1 = require('../util/service/my-logger.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var my_event_service_1 = require('../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var LoginComponent = (function () {
    function LoginComponent(authService, loginService, userService, myLoggerService, myCheckerService, myEventService, watchTower, router) {
        this.authService = authService;
        this.loginService = loginService;
        this.userService = userService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.router = router;
        this.cafeclassAuthUrl = "http://google.co.kr";
        this.redirectUrl = "/class-center";
        this.isAdmin = false;
        this.errorMsgArr = [];
    }
    LoginComponent.prototype.ngOnInit = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("login / ngOnInit / init");
        // REMOVE ME
        // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
        // this.setIsAdmin();
        // my-checker.service의 apikey 가져옴. 
        // this.setMyCheckerReady();
    };
    LoginComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("login / ngAfterViewInit");
        this.asyncViewPack();
    };
    LoginComponent.prototype.asyncViewPack = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("login / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("login / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("login / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe    
    };
    LoginComponent.prototype.setViewPack = function () {
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
      if(isDebug) console.log("login / setIsAdmin / 시작");
  
      // 사전에 등록된 값을 가져옴. 페이지 이동시에는 직접 값을 가져와야 함.
      this.isAdmin = this.watchTower.getIsAdmin();
      if(isDebug) console.log("signup / setIsAdmin / 시작 / this.isAdmin : ",this.isAdmin);
  
      // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
      this.watchTower.isViewPackReady$.subscribe(
        (isAdmin:boolean) => {
  
        if(isDebug) console.log("login / setIsAdmin / isAdmin : ",isAdmin);
        this.isAdmin = isAdmin;
      });
    }
  
    private setMyCheckerReady() :void {
  
      let isDebug:boolean = true;
      // let isDebug:boolean = false;
      if(isDebug) console.log("login / setMyCheckerReady / 시작");
  
      // 페이지 이동으로 진입한 경우, watch tower에 저장된 변수 값을 가져온다.
      if(this.watchTower.getIsMyCheckerReady()) {
        this.setMyChecker();
        this.checkLoginUser();
      }
  
      this.watchTower.myCheckerServicePackReady$.subscribe(
        (isReady:boolean) => {
  
        if(isDebug) console.log("login / setMyCheckerReady / isReady : ",isReady);
  
        if(!isReady) {
          // 에러 로그 등록
          this.myLoggerService.logError(
            // apiKey:string
            this.watchTower.getApiKey(),
            // errorType:string
            this.myLoggerService.errorTypeNotValidValue,
            // errorMsg:string
            `login / setMyCheckerReady / Failed! / isReady : ${isReady}`
          );
          return;
        }
  
        this.setMyChecker();
        this.checkLoginUser();
  
      });
    }
  
    private setMyChecker() :void {
  
      let isDebug:boolean = true;
      // let isDebug:boolean = false;
      if(isDebug) console.log("login / setMyChecker / 시작");
  
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
  
        if(isDebug) console.log("login / setMyChecker / done!");
      } // end if
  
    }
    */
    LoginComponent.prototype.checkLoginUser = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("login / checkLoginUser / 시작");
        this.userService.getUserCookie(this.myCheckerService.getAPIKey()).then(function (myResponse) {
            if (isDebug)
                console.log("login / checkLoginUser / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("user")) {
                if (isDebug)
                    console.log("login / checkLoginUser / 쿠키에 등록된 유저 정보가 있습니다. 홈으로 이동합니다.");
                _this.router.navigate([_this.redirectUrl]);
            }
            else {
                if (isDebug)
                    console.log("login / checkLoginUser / 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.");
                _this.init();
            }
        });
    };
    LoginComponent.prototype.init = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("login / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // REMOVE ME
        // 로그인한 유저 정보를 가져옵니다.
        // this.setLoginUser();
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeLogin);
        // 각 플랫폼 별로 로그인 할 수 있는 주소들을 가져옵니다.
        // 1. kakao
        this.loginService
            .getKakaoAuthUrl()
            .then(function (myResponse) {
            if (isDebug)
                console.log("login / getKakaoAuthUrl / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("auth_url")) {
                _this.kakaoAuthUrl = myResponse.getDataProp("auth_url");
            }
        });
        // 2. naver
        this.loginService
            .getNaverAuthUrl()
            .then(function (myResponse) {
            if (isDebug)
                console.log("login / getNaverAuthUrl / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("auth_url")) {
                _this.naverAuthUrl = myResponse.getDataProp("auth_url");
            }
        });
        // 3. facebook
        this.loginService
            .getFacebookAuthUrl()
            .then(function (myResponse) {
            if (isDebug)
                console.log("login / getFacebookAuthUrl / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("auth_url")) {
                _this.facebookAuthUrl = myResponse.getDataProp("auth_url");
            }
        });
        // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
        this.watchTower.announceToggleTopMenu(false);
    };
    LoginComponent.prototype.onChangedFromChild = function (myEvent) {
        // 자식 엘리먼트들의 이벤트 처리
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("login / onChangedFromChild / 시작");
        if (isDebug)
            console.log("login / onChangedFromChild / myEvent : ", myEvent);
        if (null == myEvent) {
            if (isDebug)
                console.log("login / onChangedFromChild / 중단 / null == myEvent");
            return;
        }
        if (null == myEvent.myChecker) {
            if (isDebug)
                console.log("login / onChangedFromChild / 중단 / null == myEvent.myChecker");
            return;
        }
        if (null == myEvent.value) {
            if (isDebug)
                console.log("login / onChangedFromChild / 중단 / null == myEvent.value");
            return;
        }
        // 모든 myEvent는 myChecker를 가지고 들어와야 합니다.
        // myChecker로 다시 한번 더 검사, 통과해야만 사용할 수 있습니다.
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if (!isOK) {
            if (isDebug)
                console.log("login / onChangedFromChild / 중단 / !isOK");
            return;
        }
        // 정상적인 값을 가진 이벤트입니다.
        if (this.myEventService.ON_CHANGE === myEvent.eventName) {
            if (this.myEventService.KEY_USER_EMAIL === myEvent.key) {
                this.email = myEvent.value;
                if (isDebug)
                    console.log("login / onChangedFromChild / this.email : ", this.email);
            }
            else if (this.myEventService.KEY_USER_PASSWORD === myEvent.key) {
                this.password = myEvent.value;
                if (isDebug)
                    console.log("login / onChangedFromChild / this.password : ", this.password);
            } // end if
        }
        else if (this.myEventService.ON_KEYUP_ENTER === myEvent.eventName) {
            if (this.myEventService.KEY_USER_EMAIL === myEvent.key) {
                this.email = myEvent.value;
                if (isDebug)
                    console.log("login / onChangedFromChild / ON_KEYUP_ENTER / KEY_USER_EMAIL ", this.email);
                // 이메일 입력 칸에서 엔터키를 눌렀습니다. 
                // 1. 이메일과 패스워드가 유효하다면 유저 확인 프로세스를 진행합니다.
                // 2. 그렇지 않다면 안내 메시지를 유저에게 보여줍니다.
                this.verifyEmailNPassword();
            }
            else if (this.myEventService.KEY_USER_PASSWORD === myEvent.key) {
                this.password = myEvent.value;
                if (isDebug)
                    console.log("login / onChangedFromChild / ON_KEYUP_ENTER / KEY_USER_PASSWORD ", this.password);
                // 패스워드 입력 칸에서 엔터키를 눌렀습니다. 
                // 1. 이메일과 패스워드가 유효하다면 유저 확인 프로세스를 진행합니다.
                // 2. 그렇지 않다면 안내 메시지를 유저에게 보여줍니다.
                this.verifyEmailNPassword();
            }
        } // end if
        if (isDebug)
            console.log("login / onChangedFromChild / done");
    };
    LoginComponent.prototype.verifyEmailNPassword = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("login / verifyEmailNPassword / 시작");
        var warningMsgHead = "아이디 또는 비밀번호를 다시 확인하세요.";
        var warningMsgTail = "카페클래스에 등록되지 않은 아이디거나, 아이디 또는 비밀번호를 잘못 입력하셨습니다.";
        this.warningMsgHead = null;
        this.warningMsgTail = null;
        if (null == this.email || "" == this.email) {
            if (isDebug)
                console.log("login / verifyEmailNPassword / 중단 / 이메일 주소에 문제가 있습니다.", this.email);
            this.warningMsgHead = warningMsgHead;
            this.warningMsgTail = warningMsgTail;
            return;
        }
        if (null == this.password || "" == this.password) {
            if (isDebug)
                console.log("login / verifyEmailNPassword / 중단 / 암호에 문제가 있습니다.", this.password);
            this.warningMsgHead = warningMsgHead;
            this.warningMsgTail = warningMsgTail;
            return;
        }
        // DB에 이메일 주소와 암호를 조회합니다.
        var apiKey = this.myCheckerService.getAPIKey();
        if (null != apiKey && "" != apiKey) {
            this.userService
                .confirmUserEmailPassword(apiKey, this.email, this.password)
                .then(function (result) {
                if (isDebug)
                    console.log("login / confirmUserEmailPassword / result : ", result);
                if (null == result || null == result.success || !result.success) {
                    if (isDebug)
                        console.log("login / confirmUserEmailPassword / 중단 / 회원 인증에 실패했습니다. 메시지를 화면에 노출합니다.");
                    _this.warningMsgHead = warningMsgHead;
                    _this.warningMsgTail = warningMsgTail;
                    return;
                }
                if (isDebug)
                    console.log("login / confirmUserEmailPassword / 중단 / 회원 인증에 성공했습니다. 홈화면으로 이동합니다.");
                _this.router.navigate(['/class-center']);
            });
        } // end service    
    };
    LoginComponent.prototype.onClickLogin = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.verifyEmailNPassword();
    };
    __decorate([
        core_1.ViewChild(email_component_1.EmailComponent), 
        __metadata('design:type', email_component_1.EmailComponent)
    ], LoginComponent.prototype, "emailComponent", void 0);
    __decorate([
        core_1.ViewChild(password_component_1.PasswordComponent), 
        __metadata('design:type', password_component_1.PasswordComponent)
    ], LoginComponent.prototype, "passwordComponent", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'login',
            templateUrl: 'login.component.html',
            styleUrls: ['login.component.css']
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, login_service_1.LoginService, user_service_1.UserService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map