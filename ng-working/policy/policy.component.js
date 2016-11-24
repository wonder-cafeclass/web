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
var my_logger_service_1 = require('../util/service/my-logger.service');
var PolicyComponent = (function () {
    function PolicyComponent(router, myLoggerService) {
        this.router = router;
        this.myLoggerService = myLoggerService;
    }
    PolicyComponent.prototype.ngOnInit = function () {
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(this.myLoggerService.pageKeyPolicy);
    };
    PolicyComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'policy',
            templateUrl: 'policy.component.html',
            styleUrls: ['policy.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, my_logger_service_1.MyLoggerService])
    ], PolicyComponent);
    return PolicyComponent;
}());
exports.PolicyComponent = PolicyComponent;
//# sourceMappingURL=policy.component.js.map