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
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var my_array_1 = require('../../util/helper/my-array');
var KlassNStudentListComponent = (function () {
    function KlassNStudentListComponent(watchTower) {
        this.watchTower = watchTower;
        // @ Common Props
        this.emitter = new core_1.EventEmitter();
        this.isShowCancle = false;
        this.katStatus = "";
        this.isValidPayment = false;
        this.isShowCertificate = false;
        // Do something...
        this.myArray = new my_array_1.HelperMyArray();
    } // end constructor
    KlassNStudentListComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    }; // end method
    KlassNStudentListComponent.prototype.ngOnInit = function () {
        if (this.isDebug())
            console.log("klass-n-student-list / ngOnInit / init");
        this.asyncViewPack();
    };
    KlassNStudentListComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("klass-n-student-list / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("klass-n-student-list / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("klass-n-student-list / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    KlassNStudentListComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("klass-n-student-list / init / 시작");
        // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
        this.emitEventOnReady();
    }; // end method
    KlassNStudentListComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("klass-n-student-list / emitEventOnReady / 시작");
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
        if (this.isDebug())
            console.log("klass-n-student-list / emitEventOnReady / Done!");
    };
    KlassNStudentListComponent.prototype.onClickKlass = function (event, klass) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickKlass / 시작");
        event.preventDefault();
        event.stopPropagation();
        // 부모 객체로 클래스를 선택한 것을 전달. 해당 수업 상세 페이지로 이동!
        if (null == klass) {
            if (this.isDebug())
                console.log("klass-n-student-list / onClickKlass / 중단 / null == klass");
            return;
        } // end if
        this.emitOnClickMeta("" + klass.id, klass);
    }; // end method
    KlassNStudentListComponent.prototype.emitOnClickMeta = function (value, meta) {
        var myEvent = this.watchTower.getEventOnClickMetaFreePass(
        // eventKey:string, 
        this.eventKey, 
        // value:string, 
        value, 
        // meta:any
        meta);
        this.emitter.emit(myEvent);
    }; // end method
    KlassNStudentListComponent.prototype.onClickCancelKlass = function (event) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickCancelKlass / 시작");
        event.preventDefault();
        event.stopPropagation();
    }; // end method
    KlassNStudentListComponent.prototype.onClickRequestCancelKlass = function (event) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickRequestCancelKlass / 시작");
        event.preventDefault();
        event.stopPropagation();
    }; // end method  
    KlassNStudentListComponent.prototype.onClickTeacher = function (event) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickTeacher / 시작");
        event.preventDefault();
        event.stopPropagation();
    }; // end method
    KlassNStudentListComponent.prototype.onClickStatus = function (event) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickStatus / 시작");
        event.preventDefault();
        event.stopPropagation();
    };
    KlassNStudentListComponent.prototype.onClickPrintReceipt = function (event, klassNStudent) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickPrintReceipt / 시작");
        event.preventDefault();
        event.stopPropagation();
        // 새로운 윈도우를 열어서 영수증 링크 열기.
        if (null != klassNStudent &&
            null != klassNStudent.receipt_url &&
            "" != klassNStudent.receipt_url) {
            window.open(klassNStudent.receipt_url);
        } // end if
    }; // end method
    KlassNStudentListComponent.prototype.onClickPrintCertipicate = function (event) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickPrintCertipicate / 시작");
        event.preventDefault();
        event.stopPropagation();
    };
    KlassNStudentListComponent.prototype.onClickSupplement = function (event) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickSupplement / 시작");
        event.preventDefault();
        event.stopPropagation();
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassNStudentListComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassNStudentListComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], KlassNStudentListComponent.prototype, "klassNStudentList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], KlassNStudentListComponent.prototype, "isShowCancle", void 0);
    KlassNStudentListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-n-student-list',
            templateUrl: 'klass-n-student-list.component.html',
            styleUrls: ['klass-n-student-list.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_watchtower_service_1.MyEventWatchTowerService])
    ], KlassNStudentListComponent);
    return KlassNStudentListComponent;
}());
exports.KlassNStudentListComponent = KlassNStudentListComponent; // end class
//# sourceMappingURL=klass-n-student-list.component.js.map