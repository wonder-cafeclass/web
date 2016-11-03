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
    function NavTabsComponent() {
        this.fontSizeTitle = 12;
        this.paddingTopTitle = 10;
        this.cageWidth = -1;
    }
    NavTabsComponent.prototype.ngOnInit = function () {
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        } // end if
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
    NavTabsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'nav-tabs',
            templateUrl: 'nav-tabs.component.html',
            styleUrls: ['nav-tabs.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], NavTabsComponent);
    return NavTabsComponent;
}());
exports.NavTabsComponent = NavTabsComponent;
//# sourceMappingURL=nav-tabs.component.js.map