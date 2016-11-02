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
var CheckBoxHListComponent = (function () {
    function CheckBoxHListComponent() {
        this.cageWidth = 100;
        this.emitter = new core_1.EventEmitter();
    }
    CheckBoxHListComponent.prototype.ngOnInit = function () {
        // Do nothing.
    };
    CheckBoxHListComponent.prototype.onChange = function (event, myEvent) {
        event.stopPropagation();
        this.emitter.emit(myEvent);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], CheckBoxHListComponent.prototype, "optionList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CheckBoxHListComponent.prototype, "listTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], CheckBoxHListComponent.prototype, "listTitleFontSize", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], CheckBoxHListComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CheckBoxHListComponent.prototype, "topLeftImageUrl", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CheckBoxHListComponent.prototype, "emitter", void 0);
    CheckBoxHListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'checkbox-h-list',
            templateUrl: 'checkbox-h-list.component.html',
            styleUrls: ['checkbox-h-list.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], CheckBoxHListComponent);
    return CheckBoxHListComponent;
}());
exports.CheckBoxHListComponent = CheckBoxHListComponent;
//# sourceMappingURL=checkbox-h-list.component.js.map