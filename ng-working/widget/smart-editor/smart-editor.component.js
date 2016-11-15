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
var my_event_service_1 = require('../../util/my-event.service');
var my_asset_service_1 = require('../../util/my-asset.service');
/*
*
*	@ Desc     : Naver smart editor를 사용하도록 도와주는 컴포넌트.
* @ Version  : 2.3.10
*	@ Author   : Wonder Jung
*/
var SmartEditorComponent = (function () {
    function SmartEditorComponent(myAssetService, myEventService, zone) {
        var _this = this;
        this.myAssetService = myAssetService;
        this.myEventService = myEventService;
        this.zone = zone;
        this.cageHeight = -1;
        this.cageWidth = -1;
        this.cageWidthMin = 695;
        this.html = "";
        this.key = "";
        this.emitter = new core_1.EventEmitter();
        // set function reference out of app. ( ex)iframe )
        window["angularMySE"] = {
            zone: this.zone,
            componentFn: function (value) { return _this.callFromOutside(value); },
            component: this
        };
    }
    SmartEditorComponent.prototype.ngOnInit = function () {
        if (0 < this.cageWidth) {
            if (this.cageWidth < this.cageWidthMin) {
                this.cageWidth = this.cageWidthMin;
            }
            var borderWidth = 2;
            this.cageWidthStr = (this.cageWidth + borderWidth) + "px";
        }
        else {
            this.cageWidthStr = "100%";
        }
        if (0 < this.cageHeight) {
            this.cageHeightStr = this.cageHeight + "px";
        }
        else {
            this.cageHeightStr = "100%";
        }
        // Javascript, ifarme 통신 
        // https://plnkr.co/edit/e77JkHmO7n5FYoKSXnIL?p=preview
        this.childContentWindow = this.iframe.nativeElement.contentWindow;
    }; // end method
    // 사용자가 내용을 변경한 뒤에 부모에게 내용이 변경되었다고 이벤트 발송.
    // iframe에서 호출하는 함수.
    SmartEditorComponent.prototype.callFromOutside = function (myEvent) {
        if (null == myEvent || null == myEvent.key) {
            return;
        }
        if ("se_ready_to_init" === myEvent.key) {
            // 에디터의 너비, 높이를 변경합니다.
            this.setSESize(this.cageWidth, this.cageHeight);
            // 에디터를 시작합니다.
            this.initSE();
        }
        else if ("se_ready_to_fecth" === myEvent.key) {
            // 전달받은 html 문자열을 iframe - smart editor에게 전달.
            this.updateHTML(this.html);
            // 에디터가 준비된 것을 부모 객체에게 알린다.
            var myEventReturn = this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_READY, 
            // public key:string
            this.myEventService.KEY_SMART_EDITOR, 
            // public value:string
            "", 
            // public metaObj:any
            null, 
            // public myChecker:MyChecker
            null);
            this.emitter.emit(myEventReturn);
        }
        else if ("se_update" === myEvent.key) {
            // 사용자가 내용을 변경한 뒤에 부모에게 내용이 변경되었다고 이벤트 발송.
            var myEventReturn = this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_SMART_EDITOR, 
            // public value:string
            myEvent.value, 
            // public metaObj:any
            null, 
            // public myChecker:MyChecker
            null);
            this.emitter.emit(myEventReturn);
        }
    };
    SmartEditorComponent.prototype.updateHTML = function (html) {
        if (null == this.childContentWindow) {
            return;
        }
        if (null == this.childContentWindow.initHTML) {
            return;
        }
        this.childContentWindow.initHTML(html);
    };
    SmartEditorComponent.prototype.clearHTML = function () {
        if (null == this.childContentWindow) {
            return;
        }
        if (null == this.childContentWindow.clearHTML) {
            return;
        }
        this.childContentWindow.clearHTML();
    };
    SmartEditorComponent.prototype.setSESize = function (width, height) {
        if (!(0 < width)) {
            return;
        }
        if (!(0 < height)) {
            return;
        }
        if (null == this.childContentWindow) {
            return;
        }
        if (null == this.childContentWindow.setSize) {
            return;
        }
        this.childContentWindow.setSize(width, height);
    };
    SmartEditorComponent.prototype.initSE = function () {
        this.childContentWindow.initSE();
    };
    SmartEditorComponent.prototype.hasChanged = function () {
        if (null == this.childContentWindow) {
            return;
        }
        if (null == this.childContentWindow.hasChanged) {
            return;
        }
        return this.childContentWindow.hasChanged();
    };
    SmartEditorComponent.prototype.saveNReturn = function () {
        if (null == this.childContentWindow) {
            return;
        }
        if (null == this.childContentWindow.saveNReturn) {
            return;
        }
        // 현재 작업중인 HTML 태그를 가져와 변수에 저장합니다.
        var workingHTML = this.childContentWindow.saveNReturn();
        if (null === workingHTML) {
            return;
        }
        this.html = workingHTML;
        // 작업중인 HTML 태그를 부모 컴포넌트에게 전달합니다.
        return this.html;
    };
    SmartEditorComponent.prototype.getHTMLPrev = function () {
        if (null == this.childContentWindow) {
            return;
        }
        if (null == this.childContentWindow.getHTMLPrev) {
            return;
        }
        return this.childContentWindow.getHTMLPrev();
    };
    __decorate([
        core_1.ViewChild('iframe'), 
        __metadata('design:type', core_1.ElementRef)
    ], SmartEditorComponent.prototype, "iframe", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SmartEditorComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SmartEditorComponent.prototype, "titleFontSize", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SmartEditorComponent.prototype, "cageHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SmartEditorComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SmartEditorComponent.prototype, "topLeftImageUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SmartEditorComponent.prototype, "html", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SmartEditorComponent.prototype, "key", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SmartEditorComponent.prototype, "emitter", void 0);
    SmartEditorComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'smart-editor',
            templateUrl: 'smart-editor.component.html',
            styleUrls: ['smart-editor.component.css']
        }), 
        __metadata('design:paramtypes', [my_asset_service_1.MyAssetService, my_event_service_1.MyEventService, core_1.NgZone])
    ], SmartEditorComponent);
    return SmartEditorComponent;
}());
exports.SmartEditorComponent = SmartEditorComponent;
//# sourceMappingURL=smart-editor.component.js.map