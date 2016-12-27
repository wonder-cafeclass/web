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
var DefaultService = (function () {
    function DefaultService() {
    }
    // @ Desc : DefaultComponent로 부터 원하는 input component를 가져옵니다.
    DefaultService.prototype.getInput = function (inputComponentList, eventKey) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("default.service / getInput / init");
        var target = null;
        inputComponentList.forEach(function (inputComponent) {
            if (isDebug)
                console.log("default.service / getInput / eventKey : ", eventKey);
            if (isDebug)
                console.log("default.service / getInput / inputComponent.getEventKey() : ", inputComponent.getEventKey());
            if (inputComponent.hasEventKey(eventKey)) {
                if (isDebug)
                    console.log("default.service / getInput / inputComponent : ", inputComponent);
                target = inputComponent;
                return;
            }
        }); // end for-each
        return target;
    };
    DefaultService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DefaultService);
    return DefaultService;
}());
exports.DefaultService = DefaultService;
//# sourceMappingURL=default.service.js.map