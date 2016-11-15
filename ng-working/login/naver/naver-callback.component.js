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
var NaverCallbackComponent = (function () {
    function NaverCallbackComponent(loginService, router) {
        this.loginService = loginService;
        this.router = router;
        // Do something...
    } // end function
    NaverCallbackComponent.prototype.ngOnInit = function () {
        // Do something...
    }; // end function
    NaverCallbackComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'naver-callback',
            templateUrl: 'naver-callback.component.html',
            styleUrls: ['naver-callback.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, router_1.Router])
    ], NaverCallbackComponent);
    return NaverCallbackComponent;
}());
exports.NaverCallbackComponent = NaverCallbackComponent; // end class
//# sourceMappingURL=naver-callback.component.js.map