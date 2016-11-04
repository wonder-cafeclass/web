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
    function SmartEditorComponent(myAssetService) {
        this.myAssetService = myAssetService;
        this.cageWidth = -1;
        this.emitter = new core_1.EventEmitter();
    }
    SmartEditorComponent.prototype.ngOnInit = function () {
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        }
        this.innerUrl = this.myAssetService.getInner(this.myAssetService.smartEditor);
        console.log("innerUrl : ", this.innerUrl);
    };
    SmartEditorComponent.prototype.onChange = function (event, myEvent) {
        event.stopPropagation();
        this.emitter.emit(myEvent);
    };
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
    ], SmartEditorComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SmartEditorComponent.prototype, "topLeftImageUrl", void 0);
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
        __metadata('design:paramtypes', [my_asset_service_1.MyAssetService])
    ], SmartEditorComponent);
    return SmartEditorComponent;
}());
exports.SmartEditorComponent = SmartEditorComponent;
//# sourceMappingURL=smart-editor.component.js.map