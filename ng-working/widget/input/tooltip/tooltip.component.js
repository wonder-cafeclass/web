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
var TooltipComponent = (function () {
    function TooltipComponent() {
        this.marginTop = -73;
        this.marginLeft = 0;
        this.isShowTooltip = false;
        this.isFocus = false;
        this.isValid = false;
        this.tooltipMsg = "";
    }
    TooltipComponent.prototype.ngOnInit = function () { };
    TooltipComponent.prototype.ngAfterViewInit = function () { };
    // @ Desc : 실패 툴팁을 보여줍니다.
    TooltipComponent.prototype.showTooltipFailWarning = function (msg, isTimeout) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("tooltip / showTooltipFailWarning / init");
        if (isDebug)
            console.log("tooltip / showTooltipFailWarning / msg : ", msg);
        this.isShowTooltip = true;
        this.isFocus = true;
        this.isValid = false;
        this.tooltipMsg = msg;
        if (isDebug)
            console.log("tooltip / showTooltipFailWarning / this.isShowTooltip : ", this.isShowTooltip);
        if (null != isTimeout && isTimeout) {
            if (isDebug)
                console.log("tooltip / showTooltipFailWarning / this.hideTooltipHead(2)");
            this.hideTooltipInterval(2);
        } // end if
    };
    TooltipComponent.prototype.hideTooltipInterval = function (sec) {
        if (null == sec || !(0 < sec)) {
            sec = 3;
        }
        var _self = this;
        setTimeout(function () {
            // 메시지를 지정된 시간 뒤에 화면에서 지웁니다.
            _self.hideTooltip();
        }, 1000 * sec);
    };
    TooltipComponent.prototype.hideTooltip = function () {
        this.tooltipMsg = null;
        this.isValid = true;
        this.isFocus = false;
        this.isShowTooltip = false;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], TooltipComponent.prototype, "marginTop", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], TooltipComponent.prototype, "marginLeft", void 0);
    TooltipComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'tooltip',
            templateUrl: 'tooltip.component.html',
            styleUrls: ['tooltip.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], TooltipComponent);
    return TooltipComponent;
}());
exports.TooltipComponent = TooltipComponent;
//# sourceMappingURL=tooltip.component.js.map