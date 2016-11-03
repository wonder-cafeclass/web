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
var NavTabsComponent = (function () {
    function NavTabsComponent(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.fontSizeTitle = 12;
        this.paddingTopTitle = 10;
        this.cageWidth = -1;
        this.emitter = new core_1.EventEmitter();
        this.navHeight = 50;
        this.isScrollOver = false;
    }
    NavTabsComponent.prototype.ngOnInit = function () {
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        } // end if
    };
    NavTabsComponent.prototype.onScroll = function (event) {
        var offsetTopParent = this.el.nativeElement.offsetParent.offsetTop;
        var scrollTop = document.body.scrollTop;
        if (!this.isScrollOver && offsetTopParent <= (scrollTop + this.navHeight)) {
            var clientWidthParent = this.el.nativeElement.offsetParent.clientWidth;
            var screenWidth = screen.width;
            var marginLeft = Math.round((screenWidth - clientWidthParent) / 2);
            this.shimWidthStr = marginLeft + "px";
            this.isScrollOver = true;
        }
        else if (this.isScrollOver && (scrollTop + this.navHeight) < offsetTopParent) {
            this.isScrollOver = false;
            this.shimWidthStr = null;
        }
    };
    NavTabsComponent.prototype.clickNav = function (event, radiobtnClicked) {
        event.stopPropagation();
        event.preventDefault();
        for (var i = 0; i < this.radiobtnList.length; ++i) {
            var radiobtn = this.radiobtnList[i];
            if (radiobtnClicked.myEvent.key === radiobtn.myEvent.key) {
                radiobtn.isFocus = true;
            }
            else {
                radiobtn.isFocus = false;
            }
        }
        // 부모 객체로 이벤트를 전파합니다.
        this.emitter.emit(radiobtnClicked.myEvent);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], NavTabsComponent.prototype, "radiobtnList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NavTabsComponent.prototype, "fontSizeTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NavTabsComponent.prototype, "paddingTopTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NavTabsComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NavTabsComponent.prototype, "topLeftImageUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NavTabsComponent.prototype, "colorTitleFocus", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NavTabsComponent.prototype, "colorTitleBlur", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NavTabsComponent.prototype, "colorBGFocus", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NavTabsComponent.prototype, "colorBGBlur", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NavTabsComponent.prototype, "colorBorder", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], NavTabsComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.HostListener('window:scroll', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], NavTabsComponent.prototype, "onScroll", null);
    NavTabsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'nav-tabs',
            templateUrl: 'nav-tabs.component.html',
            styleUrls: ['nav-tabs.component.css']
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], NavTabsComponent);
    return NavTabsComponent;
}());
exports.NavTabsComponent = NavTabsComponent;
//# sourceMappingURL=nav-tabs.component.js.map