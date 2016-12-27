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
var my_event_service_1 = require('../../../util/service/my-event.service');
var password_single_component_1 = require('./password-single.component');
var PasswordsTripletComponent = (function () {
    function PasswordsTripletComponent(myEventService) {
        this.myEventService = myEventService;
        this.eventKeyHead = "";
        this.eventKeyBody = "";
        this.eventKeyTail = "";
        this.emitter = new core_1.EventEmitter();
    }
    PasswordsTripletComponent.prototype.ngOnInit = function () { };
    PasswordsTripletComponent.prototype.ngAfterViewInit = function () { };
    PasswordsTripletComponent.prototype.onChangedFromChild = function (myEvent) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("passwords-triplet / onChangedFromChild / init");
        if (isDebug)
            console.log("passwords-triplet / onChangedFromChild / myEvent : ", myEvent);
        this.emitEvent(myEvent);
    }; // end method
    PasswordsTripletComponent.prototype.emitEvent = function (myEvnet) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("passwords-triplet / emitEvent / init");
        this.emitter.emit(myEvnet);
    };
    PasswordsTripletComponent.prototype.showTooltipWarning = function (eventKey, msg) {
        // childrenPW
        // http://blog.mgechev.com/2016/01/23/angular2-viewchildren-contentchildren-difference-viewproviders/
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("passwords-triplet / showTooltipWarning / init");
        var childPW = this.getChild(eventKey);
        if (isDebug)
            console.log("passwords-triplet / showTooltipWarning / childPW : ", childPW);
        if (null == childPW) {
            if (isDebug)
                console.log("passwords-triplet / showTooltipWarning / 중단 / childPW is not valid!");
            return;
        }
        childPW.showTooltipFailWarning(
        // warningMsg:string
        msg, 
        // isTimeout:boolean
        false);
    };
    PasswordsTripletComponent.prototype.showTooltipSuccess = function (eventKey, msg) {
        // childrenPW
        // http://blog.mgechev.com/2016/01/23/angular2-viewchildren-contentchildren-difference-viewproviders/
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("passwords-triplet / showTooltipSuccess / init");
        var childPW = this.getChild(eventKey);
        if (isDebug)
            console.log("passwords-triplet / showTooltipSuccess / childPW : ", childPW);
        if (null == childPW) {
            if (isDebug)
                console.log("passwords-triplet / showTooltipSuccess / 중단 / childPW is not valid!");
            return;
        }
        childPW.showTooltipSuccess(msg);
    };
    PasswordsTripletComponent.prototype.getChild = function (eventKey) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("passwords-triplet / getChild / init");
        var target = null;
        this.childrenPW.forEach(function (childPW) {
            if (isDebug)
                console.log("passwords-triplet / getChild / eventKey : ", eventKey);
            if (isDebug)
                console.log("passwords-triplet / getChild / childPW.eventKey : ", childPW.eventKey);
            if (eventKey === childPW.eventKey) {
                if (isDebug)
                    console.log("passwords-triplet / getChild / childPW : ", childPW);
                target = childPW;
                return;
            }
        }); // end for-each
        return target;
    };
    PasswordsTripletComponent.prototype.isOK = function (password) {
        var childPW = this.getChild(this.eventKeyHead);
        return childPW.isOK(password);
    };
    PasswordsTripletComponent.prototype.cleanPasswords = function () {
        // 모든 비밀번호 란을 초기화합니다.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("passwords-triplet / cleanPasswords / init");
        this.childrenPW.forEach(function (childPW) {
            if (isDebug)
                console.log("passwords-triplet / cleanPasswords / childPW.eventKey : ", childPW.eventKey);
            childPW.initPassword();
        }); // end for-each		
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PasswordsTripletComponent.prototype, "eventKeyHead", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PasswordsTripletComponent.prototype, "eventKeyBody", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PasswordsTripletComponent.prototype, "eventKeyTail", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], PasswordsTripletComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.ViewChildren(password_single_component_1.PasswordSingleComponent), 
        __metadata('design:type', core_1.QueryList)
    ], PasswordsTripletComponent.prototype, "childrenPW", void 0);
    PasswordsTripletComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'passwords-triplet',
            templateUrl: 'passwords-triplet.component.html',
            styleUrls: ['passwords-triplet.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService])
    ], PasswordsTripletComponent);
    return PasswordsTripletComponent;
}());
exports.PasswordsTripletComponent = PasswordsTripletComponent;
//# sourceMappingURL=passwords-triplet.component.js.map