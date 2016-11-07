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
        var style = window.getComputedStyle(element, null);
        // let Height = element.offsetHeight;
        // let Height = element.clientHeight;
        // let Height = element.scrollHeight;
        // console.log("MyRulerService / getHeight / style : ",style);
        var Height = +style.getPropertyValue("Height").replace("px", "");
        var webkitLogicalHeight = +style["webkitLogicalHeight"].replace("px", "");
        // console.log("MyRulerService / getHeight / element.offsetHeight : ",element.offsetHeight);
        // console.log("MyRulerService / getHeight / element.clientHeight : ",element.clientHeight);
        // console.log("MyRulerService / getHeight / element.scrollHeight : ",element.scrollHeight);
        var margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        var padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        var border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
        // console.log("MyRulerService / getHeight / Height : ",Height);
        // console.log("MyRulerService / getHeight / webkitLogicalHeight : ",webkitLogicalHeight);
        // console.log("MyRulerService / getHeight / margin : ",margin);
        // console.log("MyRulerService / getHeight / padding : ",padding);
        // console.log("MyRulerService / getHeight / border : ",border);
        var actualHeight = Height + padding + margin + border;
        return actualHeight;
    };
    MyRulerService.prototype.getWidth = function (id) {
        var element = document.getElementById(id);
        if (null == element) {
            return -1;
        }
        var style = window.getComputedStyle(element, null);
        // let Width = element.offsetWidth;
        // let Width = element.clientWidth;
        // let Width = element.scrollWidth;
        // console.log("MyRulerService / getWidth / style : ",style);
        var width = +style.getPropertyValue("width").replace("px", "");
        // console.log("MyRulerService / getWidth / element.offsetWidth : ",element.offsetWidth);
        // console.log("MyRulerService / getWidth / element.clientWidth : ",element.clientWidth);
        // console.log("MyRulerService / getWidth / element.scrollWidth : ",element.scrollWidth);
        var margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        var padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        var border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
        // console.log("MyRulerService / getWidth / Width : ",Width);
        // console.log("MyRulerService / getWidth / webkitLogicalWidth : ",webkitLogicalWidth);
        // console.log("MyRulerService / getWidth / margin : ",margin);
        // console.log("MyRulerService / getWidth / padding : ",padding);
        // console.log("MyRulerService / getWidth / border : ",border);
        var actualWidth = width + padding + margin + border;
        return actualWidth;
    };
    MyRulerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyRulerService);
    return MyRulerService;
}());
exports.MyRulerService = MyRulerService;
//# sourceMappingURL=my-ruler.service.js.map