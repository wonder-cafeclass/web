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
/*
*
*	@ Desc : input view 컴포넌트들을 가로로 길게 보여주는 컨테이너 리스트
*	@ Author : Wonder Jung
*/
var InputViewHListComponent = (function () {
    function InputViewHListComponent() {
        this.cageWidth = 100;
    }
    InputViewHListComponent.prototype.ngOnInit = function () {
        // Do nothing.
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], InputViewHListComponent.prototype, "updownList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputViewHListComponent.prototype, "cageWidth", void 0);
    InputViewHListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'input-view-h-list',
            templateUrl: 'input-view-h-list.component.html',
            styleUrls: ['input-view-h-list.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], InputViewHListComponent);
    return InputViewHListComponent;
}());
exports.InputViewHListComponent = InputViewHListComponent;
//# sourceMappingURL=input-view-h-list.component.js.map