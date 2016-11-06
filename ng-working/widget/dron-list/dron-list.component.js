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
var smart_editor_component_1 = require('../smart-editor/smart-editor.component');
var checkbox_h_list_component_1 = require('../checkbox/checkbox-h-list.component');
var mini_calendar_component_1 = require('../calendar/mini-calendar.component');
var input_view_h_list_component_1 = require('../input-view/input-view-h-list.component');
var input_view_updown_component_1 = require('../input-view/input-view-updown.component');
var radiobtn_h_list_component_1 = require('../radiobtn/radiobtn-h-list.component');
var radiobtn_linear_component_1 = require('../radiobtn/radiobtn-linear.component');
var klass_color_service_1 = require('../../klass/service/klass-color.service');
var my_ruler_service_1 = require('../../util/service/my-ruler.service');
var my_event_service_1 = require('../../util/my-event.service');
/*
* @ Desc   : 외부의 호출로 현재 필요한 1개의 Editor만 노출해줍니다. 화면의 상단/하단/우측/좌측으로 노출됩니다. (추후구현)사용자의 드래깅으로 창의 위치 이동이 가능합니다.
* @ Author : Wonder Jung
*/
var DronListComponent = (function () {
    function DronListComponent(klassColorService, myEventService, myRulerService) {
        this.klassColorService = klassColorService;
        this.myEventService = myEventService;
        this.myRulerService = myRulerService;
        this.key = "";
        this.title = "";
        this.cageWidth = -1;
        this.cageHeight = -1;
        this.headerHeight = -1;
        this.contentHeight = -1;
        this.offsetTop = 10;
        this.color = "";
        this.textColor = "";
        this.bgColor = "";
        this.isTopLeft = false;
        this.isTopRight = false;
        this.isBottomLeft = false;
        this.isBottomRight = true;
    }
    DronListComponent.prototype.ngOnInit = function () {
        // Do something...
        if ("" === this.color) {
            this.color = this.klassColorService.orange;
        }
        if ("" === this.textColor) {
            this.textColor = this.klassColorService.white;
        }
        if ("" === this.bgColor) {
            this.bgColor = this.klassColorService.orange;
        }
        if ("" === this.title) {
            this.title = "No title";
        }
        /*
        if(null != this.smartEditorComponent) {
          // 스마트 에디터를 보여줘야 하는 경우.
          let dronHeader = document.getElementById("dron-header");
          // this.cageHeight;
    
        }
        */
        console.log("DronListComponent / TEST / 001 / this.SEinnerHTML : ", this.SEinnerHTML);
    };
    DronListComponent.prototype.onChangedFromChild = function (myEvent) {
        if (null == myEvent) {
            return;
        }
        console.log("dron-list / onChangedFromChild / myEvent : ", myEvent);
        if (this.myEventService.ON_READY_SMART_EDITOR === myEvent.eventName) {
            // 에디터가 준비되었습니다. 에디터의 높이를 구해서, 화면에 최대한 노출하도록 이동합니다.
            this.headerHeight = this.myRulerService.getHeight("dron-header");
            this.contentHeight = this.myRulerService.getHeight("dron-content");
            this.offsetTop = -1 * (this.headerHeight + this.contentHeight - 8);
            console.log("this.headerHeight : ", this.headerHeight);
            console.log("this.contentHeight : ", this.contentHeight);
            console.log("this.offsetTop : ", this.offsetTop);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DronListComponent.prototype, "key", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DronListComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], DronListComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], DronListComponent.prototype, "cageHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DronListComponent.prototype, "color", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DronListComponent.prototype, "textColor", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DronListComponent.prototype, "bgColor", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DronListComponent.prototype, "topLeftImgUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], DronListComponent.prototype, "isTopLeft", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], DronListComponent.prototype, "isTopRight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], DronListComponent.prototype, "isBottomLeft", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], DronListComponent.prototype, "isBottomRight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', smart_editor_component_1.SmartEditorComponent)
    ], DronListComponent.prototype, "smartEditorComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', checkbox_h_list_component_1.CheckBoxHListComponent)
    ], DronListComponent.prototype, "checkBoxHListComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', mini_calendar_component_1.MiniCalendarComponent)
    ], DronListComponent.prototype, "miniCalendarComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', input_view_h_list_component_1.InputViewHListComponent)
    ], DronListComponent.prototype, "inputViewHListComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', input_view_updown_component_1.InputViewUpdownComponent)
    ], DronListComponent.prototype, "inputViewUpdownComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', radiobtn_h_list_component_1.RadioBtnHListComponent)
    ], DronListComponent.prototype, "radioBtnHListComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', radiobtn_linear_component_1.RadioBtnLinearComponent)
    ], DronListComponent.prototype, "radioBtnLinearComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DronListComponent.prototype, "SEinnerHTML", void 0);
    DronListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'dron-list',
            templateUrl: 'dron-list.component.html',
            styleUrls: ['dron-list.component.css']
        }), 
        __metadata('design:paramtypes', [klass_color_service_1.KlassColorService, my_event_service_1.MyEventService, my_ruler_service_1.MyRulerService])
    ], DronListComponent);
    return DronListComponent;
}());
exports.DronListComponent = DronListComponent;
//# sourceMappingURL=dron-list.component.js.map