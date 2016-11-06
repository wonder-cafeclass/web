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
var MyRulerService = (function () {
    function MyRulerService() {
    }
    // HTML Element의 수치를 확인하는 서비스 객체
    MyRulerService.prototype.getHeight = function (id) {
        var element = document.getElementById(id);
        if (null == element) {
            return -1;
        }
        var style = window.getComputedStyle(element);
        var height = element.offsetHeight;
        var margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        var border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
        var actualHeight = height + margin + border;
        return actualHeight;
    };
    MyRulerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyRulerService);
    return MyRulerService;
}());
exports.MyRulerService = MyRulerService;
//# sourceMappingURL=my-ruler.service.js.map