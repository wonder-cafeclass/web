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
var single_input_view_component_1 = require('../input-view/single-input-view.component');
var radiobtn_h_list_component_1 = require('../radiobtn/radiobtn-h-list.component');
var radiobtn_linear_component_1 = require('../radiobtn/radiobtn-linear.component');
var klass_color_service_1 = require('../../klass/service/klass-color.service');
var my_ruler_service_1 = require('../../util/service/my-ruler.service');
var my_event_service_1 = require('../../util/my-event.service');
var my_event_1 = require('../../util/model/my-event');
/*
*
* @ Desc   :
* 외부의 호출로 현재 필요한 1개의 Editor만 노출해줍니다.
* 화면의 상단/하단/우측/좌측으로 노출됩니다. (추후구현)사용자의 드래깅으로 창의 위치 이동이 가능합니다.
*
* @ Author : Wonder Jung
*
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
        this.tailHeight = -1;
        this.offsetTop = 10;
        this.color = "";
        this.textColor = "";
        this.bgColor = "";
        this.isTopLeft = false;
        this.isTopRight = false;
        this.isBottomLeft = false;
        this.isBottomRight = true;
        this.isDisabledSave = true;
        this.emitter = new core_1.EventEmitter();
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
        //bgColorBottom
        if ("" === this.title) {
            this.title = "No title";
        }
    };
    DronListComponent.prototype.onChangedFromChild = function (myEvent) {
        console.log(">>> onChangedFromChild / myEvent : ", myEvent);
        if (null == myEvent) {
            return;
        }
        if (this.myEventService.ON_READY_SMART_EDITOR === myEvent.eventName) {
            // 에디터가 준비되었습니다. 에디터의 높이를 구해서, 화면에 최대한 노출하도록 이동합니다.
            this.setOffset();
            // 에디터에 넣을 내용을 설정합니다.
            this.smartEditorComponent.updateHTML(this.SEinnerHTML);
        }
        else if (this.myEventService.ON_READY_SINGLE_INPUT_VIEW === myEvent.eventName) {
            this.setOffset();
        }
        else if (this.myEventService.ON_CHANGE_SMART_EDITOR === myEvent.eventName ||
            this.myEventService.ON_CHANGE_SINGLE_INPUT_VIEW === myEvent.eventName) {
            // 내용이 수정되었습니다.
            this.isDisabledSave = false;
            // 부모 컴포넌트에게 MyEvent 객체 - 사용자가 수정창을 닫음 - 를 전달.
            var myEventReturn = new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_DRON_LIST, 
            // public title:string
            "dron-list", 
            // public key:string
            myEvent.key, 
            // public value:string
            myEvent.value, 
            // public metaObj:any
            null);
            this.emitter.emit(myEventReturn);
        }
    };
    DronListComponent.prototype.setOffset = function () {
        // this.headerHeight = this.myRulerService.getHeight("dron-header");
        this.headerHeight = 42;
        this.contentHeight = this.myRulerService.getHeight("dron-content");
        // this.tailHeight = this.myRulerService.getHeight("dron-tail");
        this.tailHeight = 42;
        this.offsetTop = -1 * (this.headerHeight + this.contentHeight + this.tailHeight - 2);
    };
    DronListComponent.prototype.dismiss = function () {
        var hasChanged = false;
        if (null != this.smartEditorComponent) {
            hasChanged = this.smartEditorComponent.hasChanged();
        }
        // 사용자에게 변경된 사항이 있다면 저장할 것인지 물어봅니다.
        var wannaSave = false;
        if (hasChanged && confirm("변경된 사항이 있습니다. 저장하시겠습니까?")) {
            wannaSave = true;
        }
        var myEventReturn = null;
        if (wannaSave) {
            this.save();
            myEventReturn =
                new my_event_1.MyEvent(
                // public eventName:string
                this.myEventService.ON_SHUTDOWN_DRON_LIST, 
                // public title:string
                "dron-list", 
                // public key:string
                this.key, 
                // public value:string
                "", 
                // public metaObj:any
                null);
        }
        else {
            // 저장하지 않습니다. 이전 값으로 돌려놓습니다.
            if (null != this.smartEditorComponent) {
                var HTMLPrev = this.smartEditorComponent.getHTMLPrev();
                myEventReturn =
                    new my_event_1.MyEvent(
                    // public eventName:string
                    this.myEventService.ON_SHUTDOWN_N_ROLLBACK_DRON_LIST, 
                    // public title:string
                    "dron-list", 
                    // public key:string
                    this.key, 
                    // public value:string
                    HTMLPrev, 
                    // public metaObj:any
                    null);
            }
            else if (null != this.singleInputViewComponent) {
                var myEventFromSI = this.singleInputViewComponent.getMyEvent();
                myEventReturn =
                    new my_event_1.MyEvent(
                    // public eventName:string
                    this.myEventService.ON_SHUTDOWN_N_ROLLBACK_DRON_LIST, 
                    // public title:string
                    "dron-list", 
                    // public key:string
                    myEventFromSI.key, 
                    // public value:string
                    myEventFromSI.value, 
                    // public metaObj:any
                    null);
            }
        }
        this.emitter.emit(myEventReturn);
    };
    DronListComponent.prototype.onClickSave = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.save();
    };
    DronListComponent.prototype.save = function () {
        if (this.isDisabledSave) {
            return;
        }
        var result = null;
        if (null !== this.smartEditorComponent) {
            result = this.smartEditorComponent.saveNReturn();
        }
        console.log(">>> save / result : ", result);
        // 부모 컴포넌트에게 MyEvent 객체를 전달, 사용자가 수정 및 입력을 완료했음을 알립니다.
        var myEventReturn = new my_event_1.MyEvent(
        // public eventName:string
        this.myEventService.ON_SAVE_DRON_LIST, 
        // public title:string
        "dron-list", 
        // public key:string
        this.key, 
        // public value:string
        result, 
        // public metaObj:any
        null);
        this.emitter.emit(myEventReturn);
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
        core_1.ViewChild(smart_editor_component_1.SmartEditorComponent), 
        __metadata('design:type', smart_editor_component_1.SmartEditorComponent)
    ], DronListComponent.prototype, "smartEditorComponent", void 0);
    __decorate([
        core_1.ViewChild(single_input_view_component_1.SingleInputViewComponent), 
        __metadata('design:type', single_input_view_component_1.SingleInputViewComponent)
    ], DronListComponent.prototype, "singleInputViewComponent", void 0);
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
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_event_1.MyEvent)
    ], DronListComponent.prototype, "myEventSingleInput", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DronListComponent.prototype, "emitter", void 0);
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