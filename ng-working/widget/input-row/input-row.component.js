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
var single_input_view_component_1 = require('../input-view/single-input-view.component');
var klass_color_service_1 = require('../../widget/klass/service/klass-color.service');
var my_ruler_service_1 = require('../../util/service/my-ruler.service');
var my_event_service_1 = require('../../util/service/my-event.service');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_event_1 = require('../../util/model/my-event');
// import { CheckBoxHListComponent }      from '../checkbox/checkbox-h-list.component';
// import { MiniCalendarComponent }       from '../calendar/mini-calendar.component';
// import { InputViewHListComponent }     from '../input-view/input-view-h-list.component';
// import { InputViewUpdownComponent }    from '../input-view/input-view-updown.component';
// import { RadioBtnHListComponent }      from '../radiobtn/radiobtn-h-list.component';
// import { RadioBtnLinearComponent }     from '../radiobtn/radiobtn-linear.component';
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
    function InputRowComponent(klassColorService, myEventService, myCheckerService, myRulerService) {
        this.klassColorService = klassColorService;
        this.myEventService = myEventService;
        this.myCheckerService = myCheckerService;
        this.myRulerService = myRulerService;
        this.key = "";
        this.title = "";
        this.cageWidth = -1;
        this.cageHeight = -1;
        this.headerHeight = -1;
        this.contentHeight = -1;
        this.tailHeight = -1;
        this.offsetTop = 10;
        this.isPreview = false;
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
    };
    InputRowComponent.prototype.onChangedFromChild = function (myEvent) {
        if (null == myEvent) {
            return;
        }
        if (this.myEventService.ON_READY === myEvent.eventName) {
            if (this.myEventService.KEY_SMART_EDITOR === myEvent.key) {
                // 에디터가 준비되었습니다. 에디터의 높이를 구해서, 화면에 최대한 노출하도록 이동합니다.
                this.setOffset();
            }
            else if (this.myEventService.KEY_SINGLE_INPUT_VIEW === myEvent.key) {
                this.setOffset();
            }
        }
        else if (this.myEventService.ON_CHANGE === myEvent.eventName) {
            // 내용이 수정되었습니다.
            this.isDisabledSave = false;
            var hasChanged = false;
            if (this.myEventService.KEY_SMART_EDITOR === myEvent.key) {
                this.updateSEinnerHTML(myEvent.value);
                hasChanged = this.hasChangedSEinnerHTML();
            }
            if (hasChanged) {
                // 부모 컴포넌트에게 MyEvent 객체 - 사용자가 수정창을 닫음 - 를 전달.
                var myEventReturn = this.myEventService.getMyEvent(
                // public eventName:string
                this.myEventService.ON_CHANGE, 
                // public key:string
                this.key, 
                // public value:string
                myEvent.value, 
                // public metaObj:any
                null, 
                // public myChecker:MyChecker
                this.myCheckerService.getFreePassChecker());
                this.emitter.emit(myEventReturn);
            } // end if
        } // end if
    }; // end if
    InputRowComponent.prototype.setOffset = function () {
        this.headerHeight = 42;
        this.contentHeight = this.myRulerService.getHeight("dron-content");
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
                this.myEventService.getMyEvent(
                // public eventName:string
                this.myEventService.ON_SHUTDOWN, 
                // public key:string
                this.key, 
                // public value:string
                this.SEinnerHTMLCopy, 
                // public metaObj:any
                null, 
                // public myChecker:MyChecker
                this.myCheckerService.getFreePassChecker());
        }
        else {
            // 저장하지 않습니다. 이전 값으로 돌려놓습니다.
            if (null != this.smartEditorComponent) {
                var HTMLPrev = this.smartEditorComponent.getHTMLPrev();
                myEventReturn =
                    this.myEventService.getMyEvent(
                    // public eventName:string
                    this.myEventService.ON_SHUTDOWN_N_ROLLBACK, 
                    // public key:string
                    this.key, 
                    // public value:string
                    HTMLPrev, 
                    // public metaObj:any
                    null, 
                    // public myChecker:MyChecker
                    this.myCheckerService.getFreePassChecker());
            }
            else if (null != this.singleInputViewComponent) {
                var myEventFromSI = this.singleInputViewComponent.getMyEvent();
                myEventReturn =
                    this.myEventService.getMyEvent(
                    // public eventName:string
                    this.myEventService.ON_SHUTDOWN_N_ROLLBACK, 
                    // public key:string
                    this.key, 
                    // public value:string
                    myEventFromSI.value, 
                    // public metaObj:any
                    null, 
                    // public myChecker:MyChecker
                    this.myCheckerService.getFreePassChecker());
            }
        }
        this.emitter.emit(myEventReturn);
    };
    InputRowComponent.prototype.hasChangedSEinnerHTML = function () {
        if (this.SEinnerHTMLCopy != this.SEinnerHTML) {
            return true;
        }
        return false;
    };
    InputRowComponent.prototype.updateSEinnerHTML = function (newSEinnerHTML) {
        this.SEinnerHTML = newSEinnerHTML;
    };
    InputRowComponent.prototype.overwriteSEinnerHTML = function () {
        this.SEinnerHTMLCopy = this.SEinnerHTML;
    };
    InputRowComponent.prototype.onClickSave = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.save();
    };
    InputRowComponent.prototype.onClickUnpreview = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.isPreview = false;
        var myEventReturn = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_UNPREVIEW, 
        // public key:string
        this.key, 
        // public value:string
        "", 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        this.emitter.emit(myEventReturn);
    };
    InputRowComponent.prototype.onClickPreview = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.isPreview = true;
        var myEventReturn = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_PREVIEW, 
        // public key:string
        this.key, 
        // public value:string
        "", 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        this.emitter.emit(myEventReturn);
    };
    InputRowComponent.prototype.save = function () {
        if (this.isDisabledSave) {
            return;
        }
        var result = null;
        if (null != this.smartEditorComponent) {
            result = this.smartEditorComponent.saveNReturn();
        }
        // 부모 컴포넌트에게 MyEvent 객체를 전달, 사용자가 수정 및 입력을 완료했음을 알립니다.
        var myEventReturn = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_SAVE, 
        // public key:string
        this.key, 
        // public value:string
        this.SEinnerHTML, 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        this.emitter.emit(myEventReturn);
        this.overwriteSEinnerHTML();
        this.isDisabledSave = true;
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
        __metadata('design:paramtypes', [klass_color_service_1.KlassColorService, my_event_service_1.MyEventService, my_checker_service_1.MyCheckerService, my_ruler_service_1.MyRulerService])
    ], InputRowComponent);
    return InputRowComponent;
}());
exports.InputRowComponent = InputRowComponent;
//# sourceMappingURL=input-row.component.js.map