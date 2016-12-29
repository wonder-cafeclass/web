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
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var PolicyComponent = (function () {
    function PolicyComponent(router, myEventWatchTowerService, myLoggerService) {
        this.router = router;
        this.myEventWatchTowerService = myEventWatchTowerService;
        this.myLoggerService = myLoggerService;
    }
    PolicyComponent.prototype.ngOnInit = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("policy / ngOnInit / 시작");
        // my-checker.service의 apikey 가져옴. 
        this.myEventWatchTowerService.myCheckerServicePackReady$.subscribe(function (isReady) {
            if (isDebug)
                console.log("policy / ngOnInit / isReady : ", isReady);
            if (!isReady) {
                return;
            }
            _this.logActionPage();
        });
    };
    PolicyComponent.prototype.logActionPage = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("policy / logActionPage / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.myEventWatchTowerService.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypePolicy).then(function (result) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("policy / logActionPage / result : ", result);
        });
    };
    PolicyComponent.prototype.onClickLogo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        // 홈으로 이동
        this.router.navigate(["/"]);
    };
    PolicyComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'policy',
            templateUrl: 'policy.component.html',
            styleUrls: ['policy.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, my_event_watchtower_service_1.MyEventWatchTowerService, my_logger_service_1.MyLoggerService])
    ], PolicyComponent);
    return PolicyComponent;
}());
exports.PolicyComponent = PolicyComponent;
//# sourceMappingURL=policy.component.js.map