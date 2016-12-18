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
var ImageGridComponent = (function () {
    function ImageGridComponent(myCheckerService, myEventService) {
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        // @ Common Props
        this.emitter = new core_1.EventEmitter();
        this.imageHeight = -1;
        this.imageWidth = -1;
        this.tableWidth = -1;
        this.hasTableBorder = false;
        this.isAdmin = false;
        this.handleType = "";
        this.gridWidth = 100;
        this.isDisabled = false;
    }
    ImageGridComponent.prototype.ngOnInit = function () {
        this.init();
        this.emitEventOnReady();
    };
    ImageGridComponent.prototype.ngAfterViewInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("image-grid / ngAfterViewInit / 시작");
    };
    ImageGridComponent.prototype.init = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("image-grid / init / 시작");
        if (null == this.imageTable || 0 == this.imageTable.length) {
            return;
        }
        // 첫번째 열의 컬럼 갯수를 기준으로 전체 열의 엘리먼트 갯수가 같은지 확인합니다.
        // 컬럼 갯수가 많다면 마지막 엘리먼트를 제거. - Not implemented!
        // 컬럼 갯수가 적다면 공백 문자열을 추가합니다.
        var rowCnt = this.imageTable.length;
        var colCnt = this.imageTable[0].length;
        for (var rowIdx = 0; rowIdx < this.imageTable.length; ++rowIdx) {
            var row = this.imageTable[rowIdx];
            if (row.length === colCnt) {
                continue;
            }
            else if (row.length < colCnt) {
                // 엘리먼트가 부족할 경우의 처리.
                var colCntNeeded = colCnt - row.length;
                for (var k = 0; k < colCntNeeded; ++k) {
                    row.push(null);
                } // end inner for
            } // end if
        } // end outer for
        this.gridWidth = this.imageWidth * colCnt;
        if (0 < this.tableWidth) {
            this.tableWidthStr = this.tableWidth + "px";
        }
        else {
            this.tableWidthStr = "100%";
        }
    };
    ImageGridComponent.prototype.addImageSingleColumn = function (imageUrl) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("image-grid / addImageSingleColumn / 시작");
        if (null == imageUrl || "" === imageUrl) {
            return;
        }
        // 이미지를 추가합니다. 
        if (null == this.imageTable || 0 == this.imageTable.length) {
            if (isDebug)
                console.log("image-grid / addImageSingleColumn / 첫번째 배너 추가");
            this.imageTable = [[imageUrl]];
        }
        else {
            if (isDebug)
                console.log("image-grid / addImageSingleColumn / 첫번째 배너 이후 추가");
            this.imageTable.push([imageUrl]);
        } // end if
    }; // end method
    ImageGridComponent.prototype.addImageListSingleColumn = function (imageUrlList) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("image-grid / addImageListSingleColumn / 시작");
        if (null == imageUrlList || 0 == imageUrlList.length) {
            return;
        }
        // 이미지를 추가합니다.
        for (var i = 0; i < imageUrlList.length; ++i) {
            var imageUrl = imageUrlList[i];
            this.addImageSingleColumn(imageUrl);
        } // end for
    }; // end method
    ImageGridComponent.prototype.removeImage = function (imageUrl) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("image-grid / removeImage / 시작");
        if (null == imageUrl || "" === imageUrl) {
            return;
        }
        var imageTableNext = [];
        for (var i = 0; i < this.imageTable.length; ++i) {
            var columnList = this.imageTable[i];
            var columnListNext = [];
            for (var j = 0; j < columnList.length; ++j) {
                var banner = columnList[j];
                if (null != banner &&
                    "" != banner &&
                    banner !== imageUrl) {
                    // 유효한 배너 이미지입니다.
                    columnListNext.push(banner);
                }
            } // end for
            if (0 < columnListNext.length) {
                imageTableNext.push(columnListNext);
            } // end if
        }
        this.imageTable = imageTableNext;
    };
    ImageGridComponent.prototype.onChangeCheck = function (event, checkboxToggle, targetImg) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("image-grid / onChangeCheck / 시작");
        event.stopPropagation();
        event.preventDefault();
        if (null == checkboxToggle) {
            return;
        }
        var checked = checkboxToggle.checked;
        if (isDebug)
            console.log("image-grid / onChangeCheck / checked : ", checked);
        this.isDisabled = !checked;
        if (isDebug)
            console.log("image-grid / onChangeCheck / targetImg : ", targetImg);
    };
    ImageGridComponent.prototype.onClickDelete = function (event, imgUrlToDelete) {
        event.stopPropagation();
        event.preventDefault();
        if (null == imgUrlToDelete || "" === imgUrlToDelete) {
            return;
        }
        this.removeImage(imgUrlToDelete);
        this.emitEventOnDelete(imgUrlToDelete);
    };
    ImageGridComponent.prototype.emitEventOnDelete = function (imgUrlToDelete) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("image-grid / emitEventOnDelete / 시작");
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_REMOVE_ROW, 
        // public key:string
        this.myEventService.KEY_IMAGE_GRID, 
        // public value:string
        imgUrlToDelete, 
        // public metaObj:any
        this, 
        // public myChecker:MyChecker
        null);
        this.emitter.emit(myEventOnChange);
        if (isDebug)
            console.log("image-grid / emitEventOnChange / Done!");
    };
    ImageGridComponent.prototype.emitEventOnReady = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("image-grid / emitEventOnChange / 시작");
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public key:string
        this.myEventService.KEY_IMAGE_GRID, 
        // public value:string
        "", 
        // public metaObj:any
        this, 
        // public myChecker:MyChecker
        null);
        this.emitter.emit(myEventOnChange);
        if (isDebug)
            console.log("image-grid / emitEventOnChange / Done!");
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ImageGridComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], ImageGridComponent.prototype, "imageTable", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImageGridComponent.prototype, "imageHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImageGridComponent.prototype, "imageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImageGridComponent.prototype, "tableWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ImageGridComponent.prototype, "hasTableBorder", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ImageGridComponent.prototype, "isAdmin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ImageGridComponent.prototype, "handleType", void 0);
    ImageGridComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'image-grid',
            templateUrl: 'image-grid.component.html',
            styleUrls: ['image-grid.component.css']
        }), 
        __metadata('design:paramtypes', [my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService])
    ], ImageGridComponent);
    return ImageGridComponent;
}());
exports.ImageGridComponent = ImageGridComponent;
//# sourceMappingURL=image-grid.component.js.map