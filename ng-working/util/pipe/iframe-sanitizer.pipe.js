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
var platform_browser_1 = require('@angular/platform-browser');
/*
 *
 * iframe으로 페이지를 로딩시, security risk를 우회합니다.
 * (주의) 내부 페이지 주소만 사용해주세요. 보안의 위험성이 있는 페이지 로딩은 자제해주세요.
 * Usage:
 *   value | IframeSanitizerPipe
 * Example:
 *   {{ 2 |  IframeSanitizerPipe }}
*/
var IframeSanitizerPipe = (function () {
    function IframeSanitizerPipe(sanitizer) {
        this.sanitizer = sanitizer;
    }
    IframeSanitizerPipe.prototype.transform = function (url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    };
    IframeSanitizerPipe = __decorate([
        core_1.Pipe({ name: 'safe' }), 
        __metadata('design:paramtypes', [platform_browser_1.DomSanitizer])
    ], IframeSanitizerPipe);
    return IframeSanitizerPipe;
}());
exports.IframeSanitizerPipe = IframeSanitizerPipe;
//# sourceMappingURL=iframe-sanitizer.pipe.js.map