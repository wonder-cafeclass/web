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
var InputViewComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function InputViewComponent() {
        this.titleImageUrl = "";
        this.title = -1;
        this.titleWidth = 150;
        // 이벤트를 부모에게 전달
        this.emitter = new core_1.EventEmitter();
    }
    InputViewComponent.prototype.ngOnInit = function () {
        // Do nothing.
        // this.onVoted.emit(agreed);
    };
    InputViewComponent.prototype.onChangedFromChild = function (data) {
        console.log("InputViewComponent / onChangedFromChild / data : ", data);
        this.emitter.emit(data);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputViewComponent.prototype, "titleImageUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputViewComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputViewComponent.prototype, "titleWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], InputViewComponent.prototype, "checkboxOptionList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], InputViewComponent.prototype, "updownList", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], InputViewComponent.prototype, "emitter", void 0);
    InputViewComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'input-view',
            templateUrl: 'input-view.component.html',
            styleUrls: ['input-view.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], InputViewComponent);
    return InputViewComponent;
}());
exports.InputViewComponent = InputViewComponent;
//# sourceMappingURL=input-view.component.js.map