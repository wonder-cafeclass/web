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
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_event_service_1 = require('../../util/service/my-event.service');
var ImageEntryComponent = (function () {
    function ImageEntryComponent(myCheckerService, myEventService) {
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        // @ Common Props
        this.emitter = new core_1.EventEmitter();
        this.imageUrl = "";
        this.imageHeight = -1;
        this.imageWidth = -1;
        this.isAdmin = false;
        this.handleType = "";
        this.isDisabled = false;
        this.isChecked = false;
    }
    ImageEntryComponent.prototype.ngOnInit = function () {
        this.init();
        this.emitEventOnReady();
    };
    ImageEntryComponent.prototype.ngAfterViewInit = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-entry / ngAfterViewInit / 시작");
    };
    ImageEntryComponent.prototype.init = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-entry / init / 시작");
    };
    ImageEntryComponent.prototype.hasNotImage = function (imageUrl) {
        return !this.hasImage(imageUrl);
    };
    ImageEntryComponent.prototype.hasImage = function (imageUrl) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-entry / hasImage / 시작");
        if (null == imageUrl || "" === imageUrl) {
            if (isDebug)
                console.log("image-entry / hasImage / 중단 / imageUrl is not valid!");
            return;
        }
        if (isDebug)
            console.log("image-entry / hasImage / this.imageUrl : ", this.imageUrl);
        if (isDebug)
            console.log("image-entry / hasImage / imageUrl : ", imageUrl);
        // 이미지 이름이 주소에 포함되어 있다면 같은 이미지라고 판단한다.
        if (-1 < this.imageUrl.indexOf(imageUrl)) {
            return true;
        }
        return false;
    };
    ImageEntryComponent.prototype.onChangeCheck = function (event, checkboxToggle, targetImg) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-entry / onChangeCheck / 시작");
        event.stopPropagation();
        event.preventDefault();
        if (null == checkboxToggle) {
            return;
        }
        var checked = checkboxToggle.checked;
        if (isDebug)
            console.log("image-entry / onChangeCheck / checked : ", checked);
        this.isDisabled = !checked;
        if (isDebug)
            console.log("image-entry / onChangeCheck / targetImg : ", targetImg);
        if (checked) {
            // 1. add image
            this.emitEventOnAdd(targetImg);
        }
        else {
            // 2. remove image
            this.emitEventOnDelete(targetImg);
        } // end if
    };
    ImageEntryComponent.prototype.setDisabled = function (isDisabled) {
        this.isDisabled = isDisabled;
        this.isChecked = !isDisabled;
    };
    ImageEntryComponent.prototype.onClickDelete = function (event, imgUrlToDelete) {
        event.stopPropagation();
        event.preventDefault();
        if (null == imgUrlToDelete || "" === imgUrlToDelete) {
            return;
        }
        this.emitEventOnDelete(imgUrlToDelete);
    };
    ImageEntryComponent.prototype.emitEventOnAdd = function (imgUrlToDelete) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-entry / emitEventOnDelete / 시작");
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_ADD_ROW, 
        // public key:string
        this.myEventService.KEY_IMAGE_ENTRY, 
        // public value:string
        imgUrlToDelete, 
        // public metaObj:any
        this, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        this.emitter.emit(myEventOnChange);
        if (isDebug)
            console.log("image-entry / emitEventOnChange / Done!");
    };
    ImageEntryComponent.prototype.emitEventOnDelete = function (imgUrlToDelete) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-entry / emitEventOnDelete / 시작");
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_REMOVE_ROW, 
        // public key:string
        this.myEventService.KEY_IMAGE_ENTRY, 
        // public value:string
        imgUrlToDelete, 
        // public metaObj:any
        this, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        this.emitter.emit(myEventOnChange);
        if (isDebug)
            console.log("image-entry / emitEventOnChange / Done!");
    };
    ImageEntryComponent.prototype.emitEventOnReady = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("image-entry / emitEventOnChange / 시작");
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public key:string
        this.myEventService.KEY_IMAGE_ENTRY, 
        // public value:string
        "", 
        // public metaObj:any
        this, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        this.emitter.emit(myEventOnChange);
        if (isDebug)
            console.log("image-entry / emitEventOnChange / Done!");
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ImageEntryComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ImageEntryComponent.prototype, "imageUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImageEntryComponent.prototype, "imageHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImageEntryComponent.prototype, "imageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ImageEntryComponent.prototype, "isAdmin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ImageEntryComponent.prototype, "handleType", void 0);
    ImageEntryComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'image-entry',
            templateUrl: 'image-entry.component.html',
            styleUrls: ['image-entry.component.css']
        }), 
        __metadata('design:paramtypes', [my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService])
    ], ImageEntryComponent);
    return ImageEntryComponent;
}());
exports.ImageEntryComponent = ImageEntryComponent;
//# sourceMappingURL=image-entry.component.js.map