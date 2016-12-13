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
var url_service_1 = require("../../util/url.service");
var my_logger_service_1 = require('../../util/service/my-logger.service');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var my_event_service_1 = require('../../util/service/my-event.service');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var ApplyTeacherTermComponent = (function () {
    function ApplyTeacherTermComponent(watchTower, myEventService, myLoggerService, myCheckerService, urlService, router) {
        this.watchTower = watchTower;
        this.myEventService = myEventService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.urlService = urlService;
        this.router = router;
        this.isAdmin = false;
        this.hasAgreedWithTerms = false;
        this.isShowTooltip = false;
        this.tooltipMsgTerms = null;
        this.tooltipMsgTermsWarning = "약관 동의가 필요합니다.";
    } // end function
    ApplyTeacherTermComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("apply-teacher-term / ngOnInit / 시작");
        // 선생님 등록화면에서는 상,하단 메뉴를 가립니다.
        this.watchTower.announceToggleTopMenu(false);
    }; // end function
    ApplyTeacherTermComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("apply-teacher-term / ngAfterViewInit");
        this.asyncViewPack();
    };
    ApplyTeacherTermComponent.prototype.asyncViewPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("apply-teacher-term / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다.
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("apply-teacher-term / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("apply-teacher-term / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe    
    };
    ApplyTeacherTermComponent.prototype.setViewPack = function () {
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
    ApplyTeacherTermComponent.prototype.init = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("apply-teacher-term / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // 페이지 진입을 기록으로 남깁니다.
        this.logActionPage();
        // 로그인한 유저 정보를 가져옵니다.
        this.setLoginUser();
    }; // end init
    ApplyTeacherTermComponent.prototype.logActionPage = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("apply-teacher-term / logActionPage / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeApplyTeacherTerm).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("apply-teacher-term / logActionPage / myResponse : ", myResponse);
        });
    };
    ApplyTeacherTermComponent.prototype.logError = function (errorType, errMsg) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("apply-teacher-term / logError / 시작");
        if (null == errorType) {
            return;
        }
        if (null == errMsg) {
            return;
        }
        // 에러 로그 등록
        this.myLoggerService.logError(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // errorType:string
        errorType, 
        // errorMsg:string
        errMsg).then(function (myResponse) {
            if (isDebug)
                console.log("apply-teacher-term / logError / myResponse : ", myResponse);
        }); // end logError
    };
    ApplyTeacherTermComponent.prototype.setLoginUser = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("apply-teacher-term / setLoginUser / 시작");
        // 로그인 데이터를 가져옵니다.
        var loginUser = this.watchTower.getLoginUser();
        if (null != loginUser) {
            this.loginUser = loginUser;
            if (isDebug)
                console.log("apply-teacher-term / setLoginUser / this.loginUser : ", this.loginUser);
        }
        else {
            // 로그인이 되어 있지 않다면, 로그인 페이지로 이동합니다.
            if (isDebug)
                console.log("apply-teacher-term / setLoginUser / 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.");
            var req_url = this.urlService.get('#/login?redirect=/applyteacherterm');
            if (isDebug)
                console.log("apply-teacher-term / setLoginUser / req_url : ", req_url);
            window.location.href = req_url;
        } // end if
    };
    ApplyTeacherTermComponent.prototype.onChangeCheckTerms = function (event, checkboxTerms) {
        event.preventDefault();
        event.stopPropagation();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / onChangeCheckTerms / 시작");
        if (null != checkboxTerms) {
            this.hasAgreedWithTerms = checkboxTerms.checked;
        }
        if (this.hasAgreedWithTerms) {
            this.isShowTooltip = false;
            this.tooltipMsgTerms = null;
        }
        else {
            // 동의 하지 않았으므로 경고 문구를 보여줍니다.
            this.isShowTooltip = true;
            this.tooltipMsgTerms = this.tooltipMsgTermsWarning;
        }
    };
    ApplyTeacherTermComponent.prototype.onClickSignup = function (event) {
        event.preventDefault();
        event.stopPropagation();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / onClickSignup / 시작");
        // 약관 동의 확인. 
        if (!this.hasAgreedWithTerms) {
            if (isDebug)
                console.log("signup / onClickSignup / this.hasAgreedWithTerms : ", this.hasAgreedWithTerms);
            if (isDebug)
                console.log("signup / onClickSignup / 약관 동의가 필요하다는 경고 메시지를 띄웁니다.");
            // 약관 동의가 필요하다는 경고 메시지를 띄웁니다.
            this.isShowTooltip = true;
            this.tooltipMsgTerms = this.tooltipMsgTermsWarning;
        }
        else {
            // 문제 없음. 선샌님 등록 페이지로 이동.
            this.isShowTooltip = false;
            if (isDebug)
                console.log("signup / onClickSignup / 문제 없음. 선샌님 등록 페이지로 이동.");
            this.router.navigate(['/applyteacher']);
        } // end if
    }; // end method  
    ApplyTeacherTermComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'apply-teacher-term',
            templateUrl: 'apply-teacher-term.component.html',
            styleUrls: ['apply-teacher-term.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_watchtower_service_1.MyEventWatchTowerService, my_event_service_1.MyEventService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, url_service_1.UrlService, router_1.Router])
    ], ApplyTeacherTermComponent);
    return ApplyTeacherTermComponent;
}());
exports.ApplyTeacherTermComponent = ApplyTeacherTermComponent; // end class
//# sourceMappingURL=apply-teacher-term.component.js.map