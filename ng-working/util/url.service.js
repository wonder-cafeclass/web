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
var common_1 = require('@angular/common');
var UrlService = (function () {
    function UrlService(pl) {
        this.pl = pl;
        this.baseHref = pl.getBaseHrefFromDOM();
        this.hostname = window.location.hostname;
        this.appBaseUrl = "http://" + this.hostname + this.baseHref;
    }
    UrlService.prototype.get = function (urlFragment) {
        // url segment를 보낸 경우, 자신의 app base href를 확인, full request url을 만들어 준다.
        if (0 < urlFragment.length && 0 === urlFragment.indexOf("/")) {
            // "/subtree/subtree/A.php" --> "subtree/subtree/A"
            urlFragment = urlFragment.replace("/", "");
        }
        return "" + this.appBaseUrl + urlFragment;
    };
    UrlService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [common_1.PlatformLocation])
    ], UrlService);
    return UrlService;
}());
exports.UrlService = UrlService;
//# sourceMappingURL=url.service.js.map