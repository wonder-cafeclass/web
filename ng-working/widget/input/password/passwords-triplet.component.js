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
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("passwords-triplet / onChangedFromChild / init");
        if (isDebug)
            console.log("passwords-triplet / onChangedFromChild / myEvent : ", myEvent);
        this.emitEvent(myEvent);
    }; // end method
    PasswordsTripletComponent.prototype.emitEvent = function (myEvnet) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("passwords-triplet / emitEvent / init");
        this.emitter.emit(myEvnet);
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