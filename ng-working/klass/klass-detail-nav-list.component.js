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
var my_event_service_1 = require('../util/my-event.service');
var my_event_1 = require('../util/model/my-event');
var image_service_1 = require('../util/image.service');
var klass_color_service_1 = require('./service/klass-color.service');
var smart_editor_component_1 = require('../widget/smart-editor/smart-editor.component');
var klass_1 = require('./model/klass');
var KlassDetailNavListComponent = (function () {
    function KlassDetailNavListComponent(klassColorService, myEventService, imageService) {
        this.klassColorService = klassColorService;
        this.myEventService = myEventService;
        this.imageService = imageService;
        this.isAdmin = false;
        this.cageWidth = -1;
        // Nav Focus
        this.isFocusKlassDesc = true;
        this.isFocusKlassVenue = false;
        this.isFocusTutorDesc = false;
        this.isFocusStudentReview = false;
        this.isFocusStudentQuestion = false;
        this.isFocusCaution = false;
        this.navHeight = 50;
        this.borderTopBottomWidth = 2;
        // Admin Show
        this.isShowKlassFeature = false;
        this.isShowKlassTarget = false;
        this.isShowKlassSchedule = false;
        this.emitter = new core_1.EventEmitter();
    }
    KlassDetailNavListComponent.prototype.ngOnInit = function () {
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        } // end if
        this.colorWhite = this.klassColorService.white;
        this.colorOrange = this.klassColorService.orange;
        this.colorGray = this.klassColorService.gray;
        console.log("klass-detail-nav-list / ");
        // Sanitize safe html
        // http://stackoverflow.com/questions/39628007/angular2-innerhtml-binding-remove-style-attribute
        if (null == this.klassFeature || "" == this.klassFeature) {
            this.klassFeature = '수업의 특징을 입력해주세요.';
        }
        this.myEventSIKlassFeature =
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_FEATURE, 
            // public title:string
            "수업 특징", 
            // public key:string
            "feature", 
            // public value:string
            this.klassFeature, 
            // public metaObj:any
            this.klass);
        console.log("TEST / this.myEventSIKlassFeature : ", this.myEventSIKlassFeature);
        if (null == this.klassTarget || "" == this.klassTarget) {
            this.klassTarget = '수업 추천 대상을 입력해주세요.';
        }
        this.myEventSIKlassTarget =
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_TARGET, 
            // public title:string
            "수업 대상", 
            // public key:string
            "target", 
            // public value:string
            this.klassTarget, 
            // public metaObj:any
            this.klass);
        console.log("TEST / this.myEventSIKlassTarget : ", this.myEventSIKlassTarget);
        if (null === this.klassSchedule || "" === this.klassSchedule) {
            this.klassSchedule = '<p style="color:#f00;">일일 수업 스케쥴을 입력해주세요.</p>';
        }
        this.watchTowerImgUrl = this.imageService.get(this.imageService.watchTowerUrl);
        this.watchTowerWhiteImgUrl = this.imageService.get(this.imageService.watchTowerWhiteUrl);
        this.klassPointsImgUrl = this.imageService.get(this.imageService.classFeatureUrl);
    };
    KlassDetailNavListComponent.prototype.ngOnChanges = function (changes) {
        console.log("klass-detail-nav-list / ngOnChanges / changes : ", changes);
        if (null != changes) {
            if (null != changes['title']) {
            }
        } // end outer if
    };
    KlassDetailNavListComponent.prototype.onChangedFromInputRow = function (myEvent) {
        // Smart Editor를 사용하는 Element에서 발생한 callback 처리.
        if (null == myEvent || null == myEvent.key || "" == myEvent.key) {
            return;
        }
        console.log("klass-detail-nav-list / onChangedFromInputRow / myEvent : ", myEvent);
        if (this.myEventService.ON_SHUTDOWN_N_ROLLBACK_INPUT_ROW === myEvent.eventName) {
            if ("feature" === myEvent.key || "target" === myEvent.key || "schedule" === myEvent.key) {
                this.shutdownKlassInfos();
            }
        }
        else if (this.myEventService.ON_CHANGE_INPUT_ROW === myEvent.eventName) {
            if ("feature" === myEvent.key) {
                this.klassFeature = this.klass.feature = myEvent.value;
            }
            else if ("target" === myEvent.key) {
                this.klassTarget = this.klass.target = myEvent.value;
            }
            else if ("schedule" === myEvent.key) {
                this.klassSchedule = this.klass.schedule = myEvent.value;
            }
        }
        else if (this.myEventService.ON_SAVE_INPUT_ROW === myEvent.eventName) {
            // DB로 변경된 데이터를 저장합니다.
            console.log("DB로 변경된 데이터를 저장합니다.");
            if ("feature" === myEvent.key) {
            }
            else if ("target" === myEvent.key) {
            }
            else if ("schedule" === myEvent.key) {
            }
        }
        else if (this.myEventService.ON_SHUTDOWN_INPUT_ROW === myEvent.eventName) {
        }
    };
    KlassDetailNavListComponent.prototype.onChangedFromChild = function (myEvent, klassDesc, klassVenue, tutorDesc, studentReview, studentQuestion, caution) {
        this.isFocusKlassDesc = false;
        this.isFocusKlassVenue = false;
        this.isFocusTutorDesc = false;
        this.isFocusStudentReview = false;
        this.isFocusStudentQuestion = false;
        this.isFocusCaution = false;
        var nextYPos = 0;
        var box = null;
        var firstBox = klassDesc.getBoundingClientRect();
        var scrollY = window.scrollY;
        if ("klass_desc" === myEvent.key) {
            this.isFocusKlassDesc = true;
            box = klassDesc.getBoundingClientRect();
        }
        else if ("klass_venue" === myEvent.key) {
            this.isFocusKlassVenue = true;
            box = klassVenue.getBoundingClientRect();
        }
        else if ("tutor_desc" === myEvent.key) {
            this.isFocusTutorDesc = true;
            box = tutorDesc.getBoundingClientRect();
        }
        else if ("student_review" === myEvent.key) {
            this.isFocusStudentReview = true;
            box = studentReview.getBoundingClientRect();
        }
        else if ("student_question" === myEvent.key) {
            this.isFocusStudentQuestion = true;
            box = studentQuestion.getBoundingClientRect();
        }
        else if ("caution" === myEvent.key) {
            this.isFocusCaution = true;
            box = caution.getBoundingClientRect();
        }
        if (0 < (firstBox.top - this.navHeight)) {
            nextYPos = scrollY + box.top - (this.navHeight * 2 + this.borderTopBottomWidth);
        }
        else {
            nextYPos = scrollY + box.top - this.navHeight;
        }
        if (0 < nextYPos) {
            window.scrollTo(0, nextYPos);
        }
    };
    KlassDetailNavListComponent.prototype.onClickKlassFeature = function () {
        this.isShowKlassFeature = !this.isShowKlassFeature;
        if (!this.isShowKlassFeature) {
            this.shutdownKlassInfos();
        }
    };
    KlassDetailNavListComponent.prototype.onClickKlassTarget = function () {
        this.isShowKlassTarget = !this.isShowKlassTarget;
        if (!this.isShowKlassTarget) {
            this.shutdownKlassInfos();
        }
    };
    KlassDetailNavListComponent.prototype.onClickKlassSchedule = function () {
        this.isShowKlassSchedule = !this.isShowKlassSchedule;
        if (!this.isShowKlassSchedule) {
            this.shutdownKlassInfos();
        }
    };
    KlassDetailNavListComponent.prototype.shutdownKlassInfos = function () {
        this.isShowKlassFeature = false;
        this.isShowKlassTarget = false;
        this.isShowKlassSchedule = false;
    };
    __decorate([
        core_1.ViewChild(smart_editor_component_1.SmartEditorComponent), 
        __metadata('design:type', smart_editor_component_1.SmartEditorComponent)
    ], KlassDetailNavListComponent.prototype, "seComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], KlassDetailNavListComponent.prototype, "radiobtnOptionListNavTabs", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', klass_1.Klass)
    ], KlassDetailNavListComponent.prototype, "klass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassDetailNavListComponent.prototype, "klassFeature", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassDetailNavListComponent.prototype, "klassTarget", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassDetailNavListComponent.prototype, "klassSchedule", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], KlassDetailNavListComponent.prototype, "isAdmin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], KlassDetailNavListComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassDetailNavListComponent.prototype, "emitter", void 0);
    KlassDetailNavListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-detail-nav-list',
            templateUrl: 'klass-detail-nav-list.component.html',
            styleUrls: ['klass-detail-nav-list.component.css']
        }), 
        __metadata('design:paramtypes', [klass_color_service_1.KlassColorService, my_event_service_1.MyEventService, image_service_1.ImageService])
    ], KlassDetailNavListComponent);
    return KlassDetailNavListComponent;
}());
exports.KlassDetailNavListComponent = KlassDetailNavListComponent;
//# sourceMappingURL=klass-detail-nav-list.component.js.map