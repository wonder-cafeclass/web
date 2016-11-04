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
var my_asset_service_1 = require('../../util/my-asset.service');
/*
*
*	@ Desc     : Naver smart editor를 사용하도록 도와주는 컴포넌트.
* @ Version  : 2.3.10
*	@ Author   : Wonder Jung
*/
var SmartEditorComponent = (function () {
    function SmartEditorComponent(myAssetService, zone) {
        var _this = this;
        this.myAssetService = myAssetService;
        this.zone = zone;
        this.cageHeight = -1;
        this.cageWidth = -1;
        this.html = "";
        this.emitter = new core_1.EventEmitter();
        // set function reference out of app. ( ex)iframe )
        window["angularMySE"] = {
            zone: this.zone,
            componentFn: function (value) { return _this.callFromOutside(value); },
            component: this
        };
    }
    SmartEditorComponent.prototype.callFromOutside = function (myEvent) {
        if (null == myEvent || null == myEvent.key) {
            return;
        }
        if ("se_ready_to_fecth" === myEvent.key) {
            // 전달받은 html 문자열을 iframe - smart editor에게 전달.
            this.updateHTML(this.html);
        }
    };
    SmartEditorComponent.prototype.ngOnInit = function () {
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        }
        // Javascript, ifarme 통신 
        // https://plnkr.co/edit/e77JkHmO7n5FYoKSXnIL?p=preview
        this.childContentWindow = this.iframe.nativeElement.contentWindow;
    }; // end method
    SmartEditorComponent.prototype.updateHTML = function (html) {
        if (null == this.childContentWindow) {
            return;
        }
        if (null == this.childContentWindow.pasteHTML) {
            return;
        }
        this.childContentWindow.pasteHTML(html);
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
        __metadata('design:paramtypes', [my_asset_service_1.MyAssetService, core_1.NgZone])
    ], SmartEditorComponent);
    return SmartEditorComponent;
}());
exports.SmartEditorComponent = SmartEditorComponent;
//# sourceMappingURL=smart-editor.component.js.map