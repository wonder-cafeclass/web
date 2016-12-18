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
var image_entry_component_1 = require('./image-entry.component');
var ImageGridV2Component = (function () {
    function ImageGridV2Component(myCheckerService, myEventService) {
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
        this.eventKey = "";
        this.gridWidth = 100;
        this.isDisabled = false;
    }
    ImageGridV2Component.prototype.ngOnInit = function () {
        this.init();
        this.emitEventOnReady();
    };
    ImageGridV2Component.prototype.ngAfterViewInit = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-grid-v2 / ngAfterViewInit / 시작");
        if (isDebug)
            console.log("image-grid-v2 / ngAfterViewInit / imageEntryList : ", this.imageEntryList);
    };
    ImageGridV2Component.prototype.init = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-grid-v2 / init / 시작");
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
    ImageGridV2Component.prototype.addImageSingleColumn = function (imageUrl) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("image-grid-v2 / addImageSingleColumn / 시작");
        if (null == imageUrl || "" === imageUrl) {
            return;
        }
        // 이미지를 추가합니다. 
        if (null == this.imageTable || 0 == this.imageTable.length) {
            if (isDebug)
                console.log("image-grid-v2 / addImageSingleColumn / 첫번째 배너 추가");
            this.imageTable = [[imageUrl]];
        }
        else {
            if (isDebug)
                console.log("image-grid-v2 / addImageSingleColumn / 첫번째 배너 이후 추가");
            this.imageTable.push([imageUrl]);
        } // end if
    }; // end method
    ImageGridV2Component.prototype.addImageListSingleColumn = function (imageUrlList) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-grid-v2 / addImageListSingleColumn / 시작");
        if (null == imageUrlList || 0 == imageUrlList.length) {
            return;
        }
        // 이미지를 추가합니다.
        for (var i = 0; i < imageUrlList.length; ++i) {
            var imageUrl = imageUrlList[i];
            this.addImageSingleColumn(imageUrl);
        } // end for
    }; // end method
    // @ Desc : image-grid와 사용자가 전달한 이미지 주소 리스트를 대조, 사용자가 가지고 있지 않은 이미지들은 비활성 처리합니다.
    ImageGridV2Component.prototype.compareUserImages = function (imageUrlList) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-grid-v2 / compareUserImages / 시작");
        if (null == imageUrlList || 0 == imageUrlList.length) {
            if (isDebug)
                console.log("image-grid-v2 / compareUserImages / 중단 / imageUrlList is not valid!");
            return;
        }
        if (isDebug)
            console.log("image-grid-v2 / compareUserImages / imageUrlList : ", imageUrlList);
        this.imageListFromUser = imageUrlList;
        // wonder.jung
        if (null != this.imageEntryList) {
            this.imageEntryList.forEach(function (imageEntry) {
                // imageEntry
                if (isDebug)
                    console.log("image-grid-v2 / compareUserImages / imageEntry : ", imageEntry);
            }); // end for-each
        }
    };
    // @ Desc : image-entry 객체가 유효한 이미지 주소를 가지고 있는지 확인합니다.
    ImageGridV2Component.prototype.compareImage = function (imageEntry) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-grid-v2 / compareImage / 시작");
        if (isDebug)
            console.log("image-grid-v2 / compareImage / imageEntry : ", imageEntry);
        if (null == this.imageListFromUser || 0 == this.imageListFromUser.length) {
            // 유저가 설정한 이미지가 없으므로 모두 비활성화 처리
            imageEntry.setDisabled(true);
            return;
        }
        var hasImage = false;
        for (var i = 0; i < this.imageListFromUser.length; ++i) {
            var imageFromUser = this.imageListFromUser[i];
            if (null == imageFromUser || "" === imageFromUser) {
                continue;
            }
            if (imageEntry.hasImage(imageFromUser)) {
                // 활성 처리
                if (isDebug)
                    console.log("image-grid-v2 / compareImage / 활성 처리");
                imageEntry.setDisabled(false);
                return;
            }
        } // end for
        if (!hasImage) {
            // 비활성 처리
            if (isDebug)
                console.log("image-grid-v2 / compareImage / 비활성 처리");
            imageEntry.setDisabled(true);
        } // end if
    }; // end method
    ImageGridV2Component.prototype.removeImage = function (imageUrl) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("image-grid-v2 / removeImage / 시작");
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
    ImageGridV2Component.prototype.onChangeCheck = function (event, checkboxToggle, targetImg) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-grid-v2 / onChangeCheck / 시작");
        event.stopPropagation();
        event.preventDefault();
        if (null == checkboxToggle) {
            return;
        }
        var checked = checkboxToggle.checked;
        if (isDebug)
            console.log("image-grid-v2 / onChangeCheck / checked : ", checked);
        this.isDisabled = !checked;
        if (isDebug)
            console.log("image-grid-v2 / onChangeCheck / targetImg : ", targetImg);
    };
    ImageGridV2Component.prototype.onChangedFromChild = function (myEvent) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-grid-v2 / onChangedFromChild / 시작");
        if (isDebug)
            console.log("image-grid-v2 / onChangedFromChild / myEvent : ", myEvent);
        var eventName = myEvent.eventName;
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if (!isOK) {
            if (isDebug)
                console.log("image-grid-v2 / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
            return;
        } // end if
        if (myEvent.hasEventName(this.myEventService.ON_READY)) {
            if (myEvent.hasKey(this.myEventService.KEY_IMAGE_ENTRY)) {
                // this.updateKlassTitle(myEvent.value, false);
                // TODO - image-entry가 모두 준비가 된다면, image-grid-v2도 부모에게 Ready 이벤트를 전달해줍니다.
                // 사용자가 전달한 유효한 이미지 리스트가 있다면 여기에서 비교, 활성/비활성화 처리를 합니다.
                this.compareImage(myEvent.metaObj);
            }
        }
        else if (myEvent.hasEventName(this.myEventService.ON_ADD_ROW)) {
            if (myEvent.hasKey(this.myEventService.KEY_IMAGE_ENTRY)) {
                this.emitEventOnAdd(myEvent);
            }
        }
        else if (myEvent.hasEventName(this.myEventService.ON_REMOVE_ROW)) {
            if (myEvent.hasKey(this.myEventService.KEY_IMAGE_ENTRY)) {
                this.emitEventOnDelete(myEvent);
            }
        } // end if
    }; // end method 
    ImageGridV2Component.prototype.emitEventOnAdd = function (myEvent) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-grid-v2 / emitEventOnAdd / 시작");
        if (null == myEvent) {
            return;
        }
        // image-entry의 이벤트 객체를 그대로 전달.
        // 이벤트 키만 변경합니다.
        myEvent.key = this.eventKey;
        this.emitter.emit(myEvent);
        if (isDebug)
            console.log("image-grid-v2 / emitEventOnAdd / Done!");
    };
    ImageGridV2Component.prototype.emitEventOnDelete = function (myEvent) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("image-grid-v2 / emitEventOnDelete / 시작");
        if (null == myEvent) {
            return;
        }
        // image-entry의 이벤트 객체를 그대로 전달.
        // 이벤트 키만 변경합니다.
        myEvent.key = this.eventKey;
        this.emitter.emit(myEvent);
        if (isDebug)
            console.log("image-grid-v2 / emitEventOnDelete / Done!");
    };
    ImageGridV2Component.prototype.emitEventOnReady = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("image-grid-v2 / emitEventOnReady / 시작");
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public key:string
        this.eventKey, 
        // public value:string
        "", 
        // public metaObj:any
        this, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        this.emitter.emit(myEventOnChange);
        if (isDebug)
            console.log("image-grid-v2 / emitEventOnReady / Done!");
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ImageGridV2Component.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], ImageGridV2Component.prototype, "imageTable", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImageGridV2Component.prototype, "imageHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImageGridV2Component.prototype, "imageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImageGridV2Component.prototype, "tableWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ImageGridV2Component.prototype, "hasTableBorder", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ImageGridV2Component.prototype, "isAdmin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ImageGridV2Component.prototype, "handleType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ImageGridV2Component.prototype, "eventKey", void 0);
    __decorate([
        core_1.ViewChildren(image_entry_component_1.ImageEntryComponent), 
        __metadata('design:type', core_1.QueryList)
    ], ImageGridV2Component.prototype, "imageEntryList", void 0);
    ImageGridV2Component = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'image-grid-v2',
            templateUrl: 'image-grid-v2.component.html',
            styleUrls: ['image-grid-v2.component.css']
        }), 
        __metadata('design:paramtypes', [my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService])
    ], ImageGridV2Component);
    return ImageGridV2Component;
}());
exports.ImageGridV2Component = ImageGridV2Component;
//# sourceMappingURL=image-grid-v2.component.js.map