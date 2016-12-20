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
var upload_service_1 = require('../../../util/service/upload.service');
var url_service_1 = require("../../../util/url.service");
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var my_event_service_1 = require('../../../util/service/my-event.service');
var my_logger_service_1 = require('../../../util/service/my-logger.service');
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var tooltip_component_1 = require('../tooltip/tooltip.component');
var ImgUploaderComponent = (function () {
    // isShowTooltip:boolean=false;
    // isValidInput:boolean=false;
    // tooltipMsg:string="";
    function ImgUploaderComponent(uploadService, myEventService, myLoggerService, watchTower, myCheckerService, renderer, urlService) {
        this.uploadService = uploadService;
        this.myEventService = myEventService;
        this.myLoggerService = myLoggerService;
        this.watchTower = watchTower;
        this.myCheckerService = myCheckerService;
        this.renderer = renderer;
        this.urlService = urlService;
        /*
        * Samples *
        public uploadAPIUrl:string = '/CI/index.php/api/upload/userprofile';
        public imagePath:string = "/assets/images/class/banner";
        public imageUrl:string = "/assets/images/class/banner/banner_default.svg";
        */
        this.uploadAPIUrl = "";
        this.imagePath = "";
        this.imageUrl = "";
        this.eventKey = "";
        this.btnName = "올리기";
        this.fileSizeKBMax = 200; // 100000bytes --> 100kb
        this.fileWidth = 400; // px
        this.fileHeight = -1; // px / 음수일 경우는 너비의 비율에 맞춰 계산됨.
        this.fileMinWidth = 100; // px
        this.fileMinHeight = 100; // px
        this.fileMaxWidth = 800; // px
        this.fileMaxHeight = 800; // px
        this.emitter = new core_1.EventEmitter();
        this.isAdmin = false;
    }
    ImgUploaderComponent.prototype.isNotValidParams = function () {
        return !this.isValidParams();
    };
    ImgUploaderComponent.prototype.isValidParams = function () {
        if (!this.isValidUploadAPIUrl()) {
            return false;
        }
        if (!this.isValidImagePath()) {
            return false;
        }
        if (!this.isValidImageUrl()) {
            return false;
        }
        if (!this.isValidEventKey()) {
            return false;
        }
        return true;
    };
    ImgUploaderComponent.prototype.isValidUploadAPIUrl = function () {
        if (null == this.uploadAPIUrl || "" == this.uploadAPIUrl) {
            return false;
        }
        return true;
    };
    ImgUploaderComponent.prototype.isValidImagePath = function () {
        if (null == this.imagePath || "" == this.imagePath) {
            return false;
        }
        return true;
    };
    ImgUploaderComponent.prototype.isValidImageUrl = function () {
        if (null == this.imageUrl || "" == this.imageUrl) {
            return false;
        }
        return true;
    };
    ImgUploaderComponent.prototype.isValidEventKey = function () {
        if (null == this.eventKey || "" == this.eventKey) {
            return false;
        }
        return true;
    };
    ImgUploaderComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("img-uploader / ngOnInit / init");
    };
    ImgUploaderComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("img-uploader / ngAfterViewInit");
        this.asyncViewPack();
    };
    ImgUploaderComponent.prototype.asyncViewPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("img-uploader / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("img-uploader / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("img-uploader / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    ImgUploaderComponent.prototype.setViewPack = function () {
        this.isAdmin = this.watchTower.getIsAdmin();
        this.myCheckerService.setReady(
        // checkerMap:any
        this.watchTower.getCheckerMap(), 
        // constMap:any
        this.watchTower.getConstMap(), 
        // dirtyWordList:any
        this.watchTower.getDirtyWordList(), 
        // apiKey:string
        this.watchTower.getApiKey()); // end setReady
    };
    ImgUploaderComponent.prototype.setMyChecker = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("img-uploader / setMyChecker / 시작");
        if (null == this.myChecker) {
            this.myChecker = this.myCheckerService.getMyChecker("user_thumbnail");
        }
    };
    ImgUploaderComponent.prototype.init = function () {
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        this.setMyChecker();
    };
    ImgUploaderComponent.prototype.isNotOK = function (input) {
        return !this.isOK(input);
    };
    ImgUploaderComponent.prototype.isOK = function (input) {
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myChecker, input);
    };
    ImgUploaderComponent.prototype.setProfileImg = function (thumbnail) {
        if (this.isNotValidParams()) {
            return;
        }
        if (this.isOK(thumbnail)) {
            this.imageUrl = thumbnail;
        }
    };
    // @ Desc : 프로필 이미지가 제대로 입력되었는지 확인합니다.
    ImgUploaderComponent.prototype.hasNotDone = function () {
        return !this.hasDone();
    };
    ImgUploaderComponent.prototype.hasDone = function () {
        if (this.isNotValidParams()) {
            return false;
        }
        var isOK = this.isOK(this.imageUrl);
        if (!isOK) {
            var history_1 = this.myCheckerService.getLastHistory();
            console.log("img-uploader / hasDone / history : ", history_1);
        }
        return isOK;
    };
    ImgUploaderComponent.prototype.getProfileImgUrl = function () {
        return this.imageUrl;
    };
    ImgUploaderComponent.prototype.isValidEventkey = function () {
        if (null == this.eventKey || "" == this.eventKey) {
            return false;
        }
        return true;
    };
    ImgUploaderComponent.prototype.onFocusFileUpload = function (event) {
        event.stopPropagation();
        event.preventDefault();
    };
    ImgUploaderComponent.prototype.onClickFileUpload = function (event) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("img-uploader / onClickFileUpload / init");
        // from http://stackoverflow.com/a/32010791/217408
        var eventClick = new MouseEvent('click', { bubbles: true });
        this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [eventClick]);
    };
    ImgUploaderComponent.prototype.onChangeFile = function (event) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("img-uploader / onChangeFile / init");
        if (this.isNotValidParams()) {
            if (isDebug)
                console.log("img-uploader / onChangeFile / Params is not valid!");
            return;
        }
        // 툴팁을 노출되었다면 가립니다.
        this.tooltipComponent.hideTooltip();
        var files = event.srcElement.files;
        if (null == files || 1 != files.length) {
            // 1개의 파일만 업로드할 수 있습니다.
            return;
        }
        if (isDebug)
            console.log("img-uploader / onChangeFile / files : ", files);
        var file = files[0];
        var isValidFileType = false;
        if (file.type === "image/jpeg" ||
            file.type === "image/jpg" ||
            file.type === "image/png" ||
            file.type === "image/gif") {
            isValidFileType = true;
        }
        if (!isValidFileType) {
            this.tooltipComponent.showTooltipFailWarning("업로드할 수 없는 이미지 타입입니다", false);
            return;
        }
        var fileSizeBytesMax = this.fileSizeKBMax * 1000;
        if (fileSizeBytesMax < file.size) {
            if (isDebug)
                console.log("img-uploader / onChangeFile / size : ", file.size);
            this.tooltipComponent.showTooltipFailWarning(this.fileSizeKBMax + "kb \uC774\uD558 \uC774\uBBF8\uC9C0\uB85C \uC62C\uB824\uC8FC\uC138\uC694", false);
            return;
        }
        // max size / 100kb
        // wonder.jung
        var req_url = this.urlService.get(this.uploadAPIUrl);
        var paramsObj = {
            image_file_size: this.fileSizeKBMax,
            image_dir_dest: this.imagePath,
            desired_width: this.fileWidth,
            desired_height: this.fileHeight,
            min_width: this.fileMinWidth,
            max_width: this.fileMaxWidth,
            min_height: this.fileMinHeight,
            max_height: this.fileMaxHeight
        };
        this.uploadService.makeFileRequest(req_url, paramsObj, files).subscribe(function (myResponse) {
            // 섬네일 주소를 받아와서 화면에 표시해야 한다.
            if (isDebug)
                console.log("img-uploader / onChangeFile / myResponse : ", myResponse);
            if (null != myResponse &&
                null != myResponse.data &&
                null != myResponse.data.thumbnail) {
                // this.imageUrl = this.imagePath + myResponse.data.thumbnail;
                _this.imageUrl = myResponse.data.thumbnail;
                if (isDebug)
                    console.log("img-uploader / onChangeFile / this.imageUrl : ", _this.imageUrl);
                var isOK = _this.isOK(_this.imageUrl);
                if (isDebug)
                    console.log("img-uploader / onChangeFile / isOK : ", isOK);
                if (isDebug)
                    console.log("img-uploader / onChangeFile / this.myChecker : ", _this.myChecker);
                if (isOK && _this.isValidEventkey()) {
                    // 부모 객체에게 Change Event 발송 
                    _this.emitEventOnAddRow(
                    // eventKey:string
                    _this.eventKey, 
                    // value:string
                    _this.imageUrl);
                } // end if
            }
        });
    }; // end method
    ImgUploaderComponent.prototype.emitEventOnAddRow = function (eventKey, value) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("img-uploader / emitEventOnAddRow / 시작");
        if (null == eventKey) {
            if (isDebug)
                console.log("img-uploader / emitEventOnAddRow / 중단 / eventKey is not valid!");
            return;
        }
        if (null == value) {
            if (isDebug)
                console.log("img-uploader / emitEventOnAddRow / 중단 / value is not valid!");
            return;
        }
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_ADD_ROW, 
        // public key:string
        eventKey, 
        // public value:string
        value, 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        this.myChecker);
        this.emitter.emit(myEventOnChange);
        if (isDebug)
            console.log("img-uploader / emitEventOnAddRow / Done!");
    }; // end method
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ImgUploaderComponent.prototype, "uploadAPIUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ImgUploaderComponent.prototype, "imagePath", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ImgUploaderComponent.prototype, "imageUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ImgUploaderComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ImgUploaderComponent.prototype, "btnName", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImgUploaderComponent.prototype, "fileSizeKBMax", void 0);
    __decorate([
        // 100000bytes --> 100kb
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImgUploaderComponent.prototype, "fileWidth", void 0);
    __decorate([
        // px
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImgUploaderComponent.prototype, "fileHeight", void 0);
    __decorate([
        // px / 음수일 경우는 너비의 비율에 맞춰 계산됨.
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImgUploaderComponent.prototype, "fileMinWidth", void 0);
    __decorate([
        // px
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImgUploaderComponent.prototype, "fileMinHeight", void 0);
    __decorate([
        // px
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImgUploaderComponent.prototype, "fileMaxWidth", void 0);
    __decorate([
        // px
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImgUploaderComponent.prototype, "fileMaxHeight", void 0);
    __decorate([
        // px
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ImgUploaderComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.ViewChild('fileInput'), 
        __metadata('design:type', core_1.ElementRef)
    ], ImgUploaderComponent.prototype, "fileInput", void 0);
    __decorate([
        core_1.ViewChild(tooltip_component_1.TooltipComponent), 
        __metadata('design:type', tooltip_component_1.TooltipComponent)
    ], ImgUploaderComponent.prototype, "tooltipComponent", void 0);
    ImgUploaderComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'img-uploader',
            templateUrl: 'img-uploader.component.html',
            styleUrls: ['img-uploader.component.css']
        }), 
        __metadata('design:paramtypes', [upload_service_1.UploadService, my_event_service_1.MyEventService, my_logger_service_1.MyLoggerService, my_event_watchtower_service_1.MyEventWatchTowerService, my_checker_service_1.MyCheckerService, core_1.Renderer, url_service_1.UrlService])
    ], ImgUploaderComponent);
    return ImgUploaderComponent;
}());
exports.ImgUploaderComponent = ImgUploaderComponent;
//# sourceMappingURL=img-uploader.component.js.map