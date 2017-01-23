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
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var FooterComponent = (function () {
    function FooterComponent(watchTower, elementRef, router) {
        this.watchTower = watchTower;
        this.elementRef = elementRef;
        this.router = router;
        // isLocked:boolean = false;
        this.isFixedBottom = false;
        this.isLoginTeacher = false;
        this.scrollHeightPrev = -1;
        if (this.isDebug())
            console.log("footer / constructor / 시작");
        /*
        this.watchTower.isLockedBottomFooterFlexible$.subscribe(
          (isLockedBottomFooterFlexible:boolean) => {
    
          if(this.isDebug()) console.log("footer / constructor / isLockedBottomFooterFlexible : ",isLockedBottomFooterFlexible);
          this.isLocked = isLockedBottomFooterFlexible;
          this.isFixedBottom = isLockedBottomFooterFlexible;
    
        }); // end if
        */
    }
    FooterComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    FooterComponent.prototype.getFooterElement = function () {
        var nativeElement = this.elementRef.nativeElement;
        var children = nativeElement.children;
        var childNav = null;
        var childNavHeight = 0;
        if (null != children && 0 < children.length) {
            childNav = children[0];
            return childNav;
        }
        return null;
    }; // end method
    FooterComponent.prototype.getHeight = function () {
        var footerElement = this.getFooterElement();
        if (null != footerElement) {
            return footerElement.offsetHeight;
        }
        return -1;
    };
    FooterComponent.prototype.getYPos = function () {
        var footerElement = this.getFooterElement();
        if (null != footerElement) {
            return footerElement.offsetTop;
        }
        // return this.elementRef.nativeElement.offsetTop;
        return -1;
    };
    FooterComponent.prototype.ngOnInit = function () {
        if (this.isDebug())
            console.log("footer / ngOnInit / 시작");
        console.log("footer / ngOnInit / TEST / 시작");
        this.subscribeContentHeight();
        this.subscribeLoginTeacher();
    };
    FooterComponent.prototype.subscribeContentHeight = function () {
        var _this = this;
        this.watchTower.footerUpdate$.subscribe(function (contentHeight) {
            // if(this.isLocked) {
            //   if(this.isDebug()) console.log("footer / contentHeight$.subscribe / 중단 / this.isLocked : ",this.isLocked);
            //   return;
            // }
            _this.updateBottomFixed();
        }); // end subscribe
    };
    FooterComponent.prototype.updateBottomFixed = function () {
        var windowHeight = window.innerHeight;
        // 푸터의 높이를 가져옵니다.
        var footerHeight = this.getHeight();
        // wonder.jung
        // 푸터의 Y 좌표를 가져옵니다.
        var footerYPos = this.getYPos();
        if (this.isDebug())
            console.log("footer / updateBottomFixed / windowHeight : ", windowHeight);
        if (this.isDebug())
            console.log("footer / updateBottomFixed / footerHeight : ", footerHeight);
        if (this.isDebug())
            console.log("footer / updateBottomFixed / footerYPos : ", footerYPos);
        var body = document.body;
        var scrollHeight = body.scrollHeight;
        var offsetHeight = body.offsetHeight;
        if (this.scrollHeightPrev < 0) {
            this.scrollHeightPrev = scrollHeight;
        }
        else if (this.scrollHeightPrev == scrollHeight) {
            return;
        }
        this.scrollHeightPrev = scrollHeight;
        // console.log("footer / updateBottomFixed / windowHeight : ",windowHeight);
        // console.log("footer / updateBottomFixed / scrollHeight : ",scrollHeight);
        // console.log("footer / updateBottomFixed / offsetHeight : ",offsetHeight);
        // console.log("footer / updateBottomFixed / footerHeight : ",footerHeight);
        // console.log("footer / updateBottomFixed / footerYPos : ",footerYPos);
        // console.log("footer / updateBottomFixed / body : ",body);
        if (windowHeight < scrollHeight) {
            // 푸터가 화면 아래쪽
            // 하단 고정 해제
            console.log("footer / updateBottomFixed / 하단 고정 해제");
            this.isFixedBottom = false;
        }
        else if ((footerYPos + footerHeight) <= windowHeight) {
            // 푸터가 화면 안쪽에 위치, 아래쪽에 영역이 남음
            // 하단 고정
            console.log("footer / updateBottomFixed / 하단 고정");
            this.isFixedBottom = true;
        }
        else {
            // 푸터가 화면 아래쪽
            // 하단 고정 해제
            console.log("footer / updateBottomFixed / 하단 고정 해제");
            this.isFixedBottom = false;
        }
    };
    FooterComponent.prototype.subscribeLoginTeacher = function () {
        var _this = this;
        if (this.isDebug())
            console.log("footer / subscribeLoginTeacher / 시작");
        // 선생님 로그인 여부를 직접 받아옵니다. 미리 받아온 선생님 데이터가 있다면 사용합니다.
        var loginTeacher = this.watchTower.getLoginTeacher();
        this.isLoginTeacher = (null != loginTeacher) ? true : false;
        if (this.isDebug())
            console.log("footer / subscribeLoginTeacher / 1 / this.isLoginTeacher : ", this.isLoginTeacher);
        // 선생님 로그인 여부를 관찰합니다.
        this.watchTower.loginTeacherAnnounced$.subscribe(function (loginTeacher) {
            _this.isLoginTeacher = (null != loginTeacher) ? true : false;
            if (_this.isDebug())
                console.log("footer / subscribeLoginTeacher / 2 / this.isLoginTeacher : ", _this.isLoginTeacher);
        });
    }; // end method
    FooterComponent.prototype.ngOnChanges = function (changes) {
        if (this.isDebug())
            console.log("footer / ngOnChanges / 시작");
        this.updatePosition();
    };
    FooterComponent.prototype.updatePosition = function () {
        if (this.isDebug())
            console.log("footer / updatePosition / 시작");
        // 1. 화면안의 내용이 screen보다 작다면 bottom fixed.
        // 2. 화면안의 내용이 screen보다 크다면 bottom fixed 해제, 맨밑에 붙이기.
    };
    FooterComponent.prototype.onClickInfo = function (event) {
        if (this.isDebug())
            console.log("footer / onClickInfo / 시작");
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/']);
    };
    FooterComponent.prototype.onClickContact = function (event) {
        if (this.isDebug())
            console.log("footer / onClickContact / 시작");
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/']);
    };
    FooterComponent.prototype.onClickPolicy = function (event) {
        if (this.isDebug())
            console.log("footer / onClickPolicy / 시작");
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/policy']);
    };
    FooterComponent.prototype.onClickPrivateInfo = function (event) {
        if (this.isDebug())
            console.log("footer / onClickPrivateInfo / 시작");
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/policy/private-info']);
    };
    FooterComponent.prototype.onClickApplyTeacher = function (event) {
        if (this.isDebug())
            console.log("footer / onClickApplyTeacher / 시작");
        if (this.isLoginTeacher) {
            if (this.isDebug())
                console.log("footer / onClickApplyTeacher / 중단 / 로그인한 선생님 유저라면 선생님 등록을 다시 할 수 없다.");
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/teacher/applyteacherterm']);
    };
    FooterComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-footer',
            templateUrl: 'footer.component.html',
            styleUrls: ['footer.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_watchtower_service_1.MyEventWatchTowerService, core_1.ElementRef, router_1.Router])
    ], FooterComponent);
    return FooterComponent;
}());
exports.FooterComponent = FooterComponent;
//# sourceMappingURL=footer.component.js.map