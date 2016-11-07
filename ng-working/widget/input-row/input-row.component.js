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
var InputRowComponent = (function () {
    function InputRowComponent(klassColorService, myEventService, myRulerService) {
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
        this.isDisabledSave = true;
        this.emitter = new core_1.EventEmitter();
    }
    InputRowComponent.prototype.ngOnInit = function () {
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
        if (null != this.myEventSingleInput &&
            "" != this.myEventSingleInput.title) {
            this.title = this.myEventSingleInput.title;
        }
        else if ("" === this.title) {
            this.title = "No title";
        }
    };
    InputRowComponent.prototype.ngOnChanges = function (changes) {
        console.log("ngOnChanges / changes : ", changes);
        if (null != changes) {
            if (null != changes['title']) {
            }
            if (null != changes['SEinnerHTML'] &&
                null != changes['SEinnerHTML']['currentValue']) {
                // Smart Editor의 내용이 변경된 경우.
                var html = changes['SEinnerHTML']['currentValue'];
                if (null != this.smartEditorComponent) {
                    this.smartEditorComponent.clearHTML();
                    this.smartEditorComponent.updateHTML(html);
                } // end inner if
            } // end inner if 
        } // end outer if
    };
    InputRowComponent.prototype.onChangedFromChild = function (myEvent) {
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
            this.myEventService.ON_CHANGE_INPUT_ROW, 
            // public title:string
            "input-row", 
            // public key:string
            myEvent.key, 
            // public value:string
            myEvent.value, 
            // public metaObj:any
            null);
            this.emitter.emit(myEventReturn);
        }
    };
    InputRowComponent.prototype.setOffset = function () {
        // this.headerHeight = this.myRulerService.getHeight("dron-header");
        this.headerHeight = 42;
        this.contentHeight = this.myRulerService.getHeight("dron-content");
        // this.tailHeight = this.myRulerService.getHeight("dron-tail");
        this.tailHeight = 42;
        this.offsetTop = -1 * (this.headerHeight + this.contentHeight + this.tailHeight - 2);
    };
    InputRowComponent.prototype.dismiss = function (event) {
        event.stopPropagation();
        event.preventDefault();
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
                this.myEventService.ON_SHUTDOWN_INPUT_ROW, 
                // public title:string
                "input-row", 
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
                    this.myEventService.ON_SHUTDOWN_N_ROLLBACK_INPUT_ROW, 
                    // public title:string
                    "input-row", 
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
                    this.myEventService.ON_SHUTDOWN_N_ROLLBACK_INPUT_ROW, 
                    // public title:string
                    "input-row", 
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
    InputRowComponent.prototype.onClickSave = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.save();
    };
    InputRowComponent.prototype.save = function () {
        if (this.isDisabledSave) {
            return;
        }
        var result = null;
        if (null != this.smartEditorComponent) {
            result = this.smartEditorComponent.saveNReturn();
        }
        console.log(">>> save / result : ", result);
        // 부모 컴포넌트에게 MyEvent 객체를 전달, 사용자가 수정 및 입력을 완료했음을 알립니다.
        var myEventReturn = new my_event_1.MyEvent(
        // public eventName:string
        this.myEventService.ON_SAVE_INPUT_ROW, 
        // public title:string
        "input-row", 
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
    ], InputRowComponent.prototype, "key", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputRowComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputRowComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputRowComponent.prototype, "cageHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputRowComponent.prototype, "color", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputRowComponent.prototype, "textColor", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputRowComponent.prototype, "bgColor", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputRowComponent.prototype, "topLeftImgUrl", void 0);
    __decorate([
        core_1.ViewChild(smart_editor_component_1.SmartEditorComponent), 
        __metadata('design:type', smart_editor_component_1.SmartEditorComponent)
    ], InputRowComponent.prototype, "smartEditorComponent", void 0);
    __decorate([
        core_1.ViewChild(single_input_view_component_1.SingleInputViewComponent), 
        __metadata('design:type', single_input_view_component_1.SingleInputViewComponent)
    ], InputRowComponent.prototype, "singleInputViewComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', checkbox_h_list_component_1.CheckBoxHListComponent)
    ], InputRowComponent.prototype, "checkBoxHListComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', mini_calendar_component_1.MiniCalendarComponent)
    ], InputRowComponent.prototype, "miniCalendarComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', input_view_h_list_component_1.InputViewHListComponent)
    ], InputRowComponent.prototype, "inputViewHListComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', input_view_updown_component_1.InputViewUpdownComponent)
    ], InputRowComponent.prototype, "inputViewUpdownComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', radiobtn_h_list_component_1.RadioBtnHListComponent)
    ], InputRowComponent.prototype, "radioBtnHListComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', radiobtn_linear_component_1.RadioBtnLinearComponent)
    ], InputRowComponent.prototype, "radioBtnLinearComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputRowComponent.prototype, "SEinnerHTML", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_event_1.MyEvent)
    ], InputRowComponent.prototype, "myEventSingleInput", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], InputRowComponent.prototype, "emitter", void 0);
    InputRowComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'input-row',
            templateUrl: 'input-row.component.html',
            styleUrls: ['input-row.component.css']
        }), 
        __metadata('design:paramtypes', [klass_color_service_1.KlassColorService, my_event_service_1.MyEventService, my_ruler_service_1.MyRulerService])
    ], InputRowComponent);
    return InputRowComponent;
}());
exports.InputRowComponent = InputRowComponent;
//# sourceMappingURL=input-row.component.js.map