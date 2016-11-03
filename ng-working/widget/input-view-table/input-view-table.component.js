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
var InputViewTableComponent = (function () {
    function InputViewTableComponent() {
        this.fontSizeTitle = 12;
        this.paddingTopTitle = 10;
        this.cageWidth = 150;
    }
    InputViewTableComponent.prototype.ngOnInit = function () {
        // Do something...
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputViewTableComponent.prototype, "tableTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputViewTableComponent.prototype, "fontSizeTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputViewTableComponent.prototype, "paddingTopTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputViewTableComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputViewTableComponent.prototype, "topLeftImageUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputViewTableComponent.prototype, "color", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], InputViewTableComponent.prototype, "chekcboxOptionList", void 0);
    InputViewTableComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'input-view-table',
            templateUrl: 'input-view-table.component.html',
            styleUrls: ['input-view-table.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], InputViewTableComponent);
    return InputViewTableComponent;
}());
exports.InputViewTableComponent = InputViewTableComponent;
//# sourceMappingURL=input-view-table.component.js.map