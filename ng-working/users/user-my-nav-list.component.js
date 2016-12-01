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
var my_event_service_1 = require('../util/service/my-event.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var klass_color_service_1 = require('../klass/service/klass-color.service');
var klass_radiobtn_service_1 = require('../klass/service/klass-radiobtn.service');
var UserMyNavListComponent = (function () {
    function UserMyNavListComponent(klassColorService, myEventService, radiobtnService, myCheckerService) {
        this.klassColorService = klassColorService;
        this.myEventService = myEventService;
        this.radiobtnService = radiobtnService;
        this.myCheckerService = myCheckerService;
        this.showMyInfo = false;
        this.showMyHistory = false;
        this.showMyPayment = false;
        this.showMyFavorite = false;
        this.emitter = new core_1.EventEmitter();
    }
    UserMyNavListComponent.prototype.ngOnInit = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user-my-nav-list / ngOnInit");
        // COLOR
        this.colorWhite = this.klassColorService.white;
        this.colorOrange = this.klassColorService.orange;
        this.colorGray = this.klassColorService.gray;
        if (isDebug)
            console.log("user-my-nav-list / this.colorWhite : ", this.colorWhite);
        if (isDebug)
            console.log("user-my-nav-list / this.colorOrange : ", this.colorOrange);
        if (isDebug)
            console.log("user-my-nav-list / this.colorGray : ", this.colorGray);
        this.navTabsOptions =
            this.radiobtnService.getNavTabsUserMyInfo(
            // user:User
            null, this.myEventService.KEY_USER_MY_INFO);
        this.showMyInfo = true;
        if (isDebug)
            console.log("user-my-nav-list / this.navTabsOptions : ", this.navTabsOptions);
    };
    UserMyNavListComponent.prototype.onChangedFromChild = function (myEvent, myinfo, myhistory, mypayment, myfavorite) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user-my-nav-list / onChangedFromChild / init");
        if (isDebug)
            console.log("user-my-nav-list / onChangedFromChild / myEvent : ", myEvent);
        if (isDebug)
            console.log("user-my-nav-list / onChangedFromChild / myEvent.key : ", myEvent.key);
        // 모든 플래그값을 초기화
        this.showMyInfo = false;
        this.showMyHistory = false;
        this.showMyPayment = false;
        this.showMyFavorite = false;
        if (this.myEventService.KEY_USER_MY_INFO === myEvent.key) {
            this.showMyInfo = true;
        }
        else if (this.myEventService.KEY_USER_MY_HISTORY === myEvent.key) {
            this.showMyHistory = true;
        }
        else if (this.myEventService.KEY_USER_MY_PAYMENT === myEvent.key) {
            this.showMyPayment = true;
        }
        else if (this.myEventService.KEY_USER_MY_FAVORITE === myEvent.key) {
            this.showMyFavorite = true;
        }
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], UserMyNavListComponent.prototype, "emitter", void 0);
    UserMyNavListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'user-my-nav-list',
            templateUrl: 'user-my-nav-list.component.html',
            styleUrls: ['user-my-nav-list.component.css']
        }), 
        __metadata('design:paramtypes', [klass_color_service_1.KlassColorService, my_event_service_1.MyEventService, klass_radiobtn_service_1.KlassRadioBtnService, my_checker_service_1.MyCheckerService])
    ], UserMyNavListComponent);
    return UserMyNavListComponent;
}());
exports.UserMyNavListComponent = UserMyNavListComponent;
//# sourceMappingURL=user-my-nav-list.component.js.map