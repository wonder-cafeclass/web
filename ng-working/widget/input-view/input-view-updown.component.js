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
var input_view_updown_1 = require('./model/input-view-updown');
var InputViewUpdownComponent = (function () {
    function InputViewUpdownComponent() {
        this.cageWidth = -1;
        this.emitter = new core_1.EventEmitter();
    }
    InputViewUpdownComponent.prototype.ngOnInit = function () {
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        }
        console.log("this.data : ", this.data);
    };
    InputViewUpdownComponent.prototype.onChange = function (event, value, myEvent) {
        event.stopPropagation();
        myEvent.valueNext = value;
        this.emitter.emit(myEvent);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', input_view_updown_1.InputViewUpdown)
    ], InputViewUpdownComponent.prototype, "data", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputViewUpdownComponent.prototype, "topLeftImageUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputViewUpdownComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], InputViewUpdownComponent.prototype, "emitter", void 0);
    InputViewUpdownComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'input-view-updown',
            templateUrl: 'input-view-updown.component.html',
            styleUrls: ['input-view-updown.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], InputViewUpdownComponent);
    return InputViewUpdownComponent;
}());
exports.InputViewUpdownComponent = InputViewUpdownComponent;
//# sourceMappingURL=input-view-updown.component.js.map