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
var url_service_1 = require('./util/url.service');
var auth_service_1 = require('./auth.service');
var image_service_1 = require('./util/image.service');
var AppComponent = (function () {
    // admin server 여부를 판별합니다.
    function AppComponent(authService, urlService, imageService) {
        this.authService = authService;
        this.urlService = urlService;
        this.imageService = imageService;
        this.isAdmin = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
        this.authService.getAdminAuth().then(function (result) {
            if (null != result.is_admin) {
                _this.isAdmin = result.is_admin;
            }
        });
        // 회원 로그인 쿠키를 가져옵니다.
        console.log("회원 로그인 쿠키를 가져옵니다.");
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-app',
            styleUrls: ['app.component.css'],
            templateUrl: 'app.component.html'
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, url_service_1.UrlService, image_service_1.ImageService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map