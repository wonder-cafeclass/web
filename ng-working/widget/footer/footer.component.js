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
        this.isFixedBottom = false;
    }
    FooterComponent.prototype.getHeight = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("footer / getHeight / 시작");
        var nativeElement = this.elementRef.nativeElement;
        if (isDebug)
            console.log("footer / getHeight / this.elementRef : ", this.elementRef);
        var children = nativeElement.children;
        if (isDebug)
            console.log("footer / getHeight / children : ", children);
        var childNav = null;
        var childNavHeight = 0;
        if (null != children && 0 < children.length) {
            childNav = children[0];
            if (isDebug)
                console.log("footer / getHeight / childNav : ", childNav);
            childNavHeight = childNav.offsetHeight;
            if (isDebug)
                console.log("footer / getHeight / childNavHeight : ", childNavHeight);
        }
        return childNavHeight;
    };
    FooterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.watchTower.contentHeight$.subscribe(function (contentHeight) {
            var windowHeight = window.innerHeight;
            // let isDebug:boolean = true;
            var isDebug = false;
            if (isDebug)
                console.log("footer / contentHeight$.subscribe / 시작");
            if (isDebug)
                console.log("footer / contentHeight$.subscribe / contentHeight : ", contentHeight);
            if (isDebug)
                console.log("footer / contentHeight$.subscribe / windowHeight : ", windowHeight);
            // 푸터의 높이를 가져옵니다.
            var footerHeight = _this.getHeight();
            if (windowHeight < (contentHeight + footerHeight)) {
                // 1. 컨텐츠 높이가 화면 높이보다 깁니다.
                // 스크롤이 가능하므로, footer를 하단 고정을 해제합니다.
                if (isDebug)
                    console.log("footer / contentHeight$.subscribe / footer를 하단 고정을 해제");
                _this.isFixedBottom = false;
            }
            else {
                // 2. 컨텐츠 높이가 화면 높이보다 짧습니다.
                // 스크롤이 안됩니다. footer를 하단 고정합니다.
                if (isDebug)
                    console.log("footer / contentHeight$.subscribe / footer를 하단 고정");
                _this.isFixedBottom = true;
            } // end if
        }); // end subscribe
    };
    FooterComponent.prototype.ngAfterViewInit = function () {
        // this.updatePosition();
    };
    FooterComponent.prototype.ngOnChanges = function (changes) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("footer / ngOnChanges / 시작");
        this.updatePosition();
    };
    FooterComponent.prototype.updatePosition = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("footer / updatePosition / 시작");
        // 1. 화면안의 내용이 screen보다 작다면 bottom fixed.
        // 2. 화면안의 내용이 screen보다 크다면 bottom fixed 해제, 맨밑에 붙이기.
    };
    FooterComponent.prototype.onClickInfo = function (event) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("footer / onClickInfo / 시작");
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/']);
    };
    FooterComponent.prototype.onClickContact = function (event) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("footer / onClickContact / 시작");
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/']);
    };
    FooterComponent.prototype.onClickPolicy = function (event) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("footer / onClickPolicy / 시작");
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/policy']);
    };
    FooterComponent.prototype.onClickPrivateInfo = function (event) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("footer / onClickPrivateInfo / 시작");
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/private-info']);
    };
    FooterComponent.prototype.onClickApplyTeacher = function (event) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("footer / onClickApplyTeacher / 시작");
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/applyteacher']);
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