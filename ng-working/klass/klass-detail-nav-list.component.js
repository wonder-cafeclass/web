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
var image_service_1 = require('../util/image.service');
var klass_color_service_1 = require('./service/klass-color.service');
var smart_editor_component_1 = require('../widget/smart-editor/smart-editor.component');
var KlassDetailNavListComponent = (function () {
    function KlassDetailNavListComponent(klassColorService, imageService) {
        this.klassColorService = klassColorService;
        this.imageService = imageService;
        this.cageWidth = -1;
        this.isFocusKlassDesc = true;
        this.isFocusKlassVenue = false;
        this.isFocusTutorDesc = false;
        this.isFocusStudentReview = false;
        this.isFocusStudentQuestion = false;
        this.isFocusCaution = false;
        this.navHeight = 50;
        this.borderTopBottomWidth = 2;
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
        // TEST
        // iframe이 로딩이 완료된 시점을 알아야 합니다.
        /*
        setTimeout(() => {
          console.log("TEST / setTimeout");
          this.seComponent.updateHTML("TEST");
        }, 300);
        */
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
        __metadata('design:type', Number)
    ], KlassDetailNavListComponent.prototype, "cageWidth", void 0);
    KlassDetailNavListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-detail-nav-list',
            templateUrl: 'klass-detail-nav-list.component.html',
            styleUrls: ['klass-detail-nav-list.component.css']
        }), 
        __metadata('design:paramtypes', [klass_color_service_1.KlassColorService, image_service_1.ImageService])
    ], KlassDetailNavListComponent);
    return KlassDetailNavListComponent;
}());
exports.KlassDetailNavListComponent = KlassDetailNavListComponent;
//# sourceMappingURL=klass-detail-nav-list.component.js.map