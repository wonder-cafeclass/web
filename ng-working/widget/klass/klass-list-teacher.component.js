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
var KlassListTeacherComponent = (function () {
    function KlassListTeacherComponent(watchTower) {
        this.watchTower = watchTower;
        // @ Common Props
        this.emitter = new core_1.EventEmitter();
        // Do something...
        this.myArray = new my_array_1.HelperMyArray();
    } // end constructor
    KlassListTeacherComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    }; // end method
    KlassListTeacherComponent.prototype.ngOnInit = function () {
        if (this.isDebug())
            console.log("klass-list-teacher / ngOnInit / init");
        this.asyncViewPack();
    };
    KlassListTeacherComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("klass-list-teacher / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("klass-list-teacher / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("klass-list-teacher / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    KlassListTeacherComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("klass-list-teacher / init / 시작");
        // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
        this.emitEventOnReady();
    }; // end method
    KlassListTeacherComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("klass-list-teacher / emitEventOnReady / 시작");
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
        if (this.isDebug())
            console.log("klass-list-teacher / emitEventOnReady / Done!");
    };
    // @ Desc : 현재 클래스 상태를 우리말로 표시합니다.
    KlassListTeacherComponent.prototype.getKlassStatusDesc = function (klass) {
        if (this.isDebug())
            console.log("klass-list-teacher / getKlassStatusDesc / 시작");
        if (null == klass) {
            if (this.isDebug())
                console.log("klass-list-teacher / getKlassStatusDesc / 중단 / null == klass");
            return;
        }
        var klassStatusKor = this.watchTower
            .getMyConst()
            .getValue(
        // srcKey:string, 
        "class_status_list", 
        // srcValue:string, 
        klass.status, 
        // targetKey:string
        "class_status_kor_list");
        return klassStatusKor;
    };
    KlassListTeacherComponent.prototype.onClickKlass = function (event, klass) {
        if (this.isDebug())
            console.log("klass-list-teacher / onClickKlass / 시작");
        event.preventDefault();
        event.stopPropagation();
        // 부모 객체로 클래스를 선택한 것을 전달. 해당 수업 상세 페이지로 이동!
        if (null == klass) {
            if (this.isDebug())
                console.log("klass-list-teacher / onClickKlass / 중단 / null == klass");
            return;
        } // end if
        this.emitOnClickMeta("" + klass.id, klass);
    }; // end method
    KlassListTeacherComponent.prototype.emitOnClickMeta = function (value, meta) {
        var myEvent = this.watchTower.getEventOnClickMetaFreePass(
        // eventKey:string, 
        this.eventKey, 
        // value:string, 
        value, 
        // meta:any
        meta);
        this.emitter.emit(myEvent);
    }; // end method
    KlassListTeacherComponent.prototype.onClickCancelKlass = function (event) {
        if (this.isDebug())
            console.log("klass-list-teacher / onClickCancelKlass / 시작");
        event.preventDefault();
        event.stopPropagation();
    }; // end method
    KlassListTeacherComponent.prototype.onClickRequestCancelKlass = function (event) {
        if (this.isDebug())
            console.log("klass-list-teacher / onClickRequestCancelKlass / 시작");
        event.preventDefault();
        event.stopPropagation();
    }; // end method  
    KlassListTeacherComponent.prototype.onClickTeacher = function (event) {
        if (this.isDebug())
            console.log("klass-list-teacher / onClickTeacher / 시작");
        event.preventDefault();
        event.stopPropagation();
    }; // end method
    KlassListTeacherComponent.prototype.onClickStatus = function (event) {
        if (this.isDebug())
            console.log("klass-list-teacher / onClickStatus / 시작");
        event.preventDefault();
        event.stopPropagation();
    };
    KlassListTeacherComponent.prototype.onClickPrintReceipt = function (event, klassNStudent) {
        if (this.isDebug())
            console.log("klass-list-teacher / onClickPrintReceipt / 시작");
        event.preventDefault();
        event.stopPropagation();
        // 새로운 윈도우를 열어서 영수증 링크 열기.
        if (null != klassNStudent &&
            null != klassNStudent.receipt_url &&
            "" != klassNStudent.receipt_url) {
            window.open(klassNStudent.receipt_url);
        } // end if
    }; // end method
    KlassListTeacherComponent.prototype.onClickPrintCertipicate = function (event) {
        if (this.isDebug())
            console.log("klass-list-teacher / onClickPrintCertipicate / 시작");
        event.preventDefault();
        event.stopPropagation();
    };
    KlassListTeacherComponent.prototype.onClickSupplement = function (event) {
        if (this.isDebug())
            console.log("klass-list-teacher / onClickSupplement / 시작");
        event.preventDefault();
        event.stopPropagation();
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassListTeacherComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassListTeacherComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], KlassListTeacherComponent.prototype, "klassList", void 0);
    KlassListTeacherComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-list-teacher',
            templateUrl: 'klass-list-teacher.component.html',
            styleUrls: ['klass-list-teacher.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_watchtower_service_1.MyEventWatchTowerService])
    ], KlassListTeacherComponent);
    return KlassListTeacherComponent;
}());
exports.KlassListTeacherComponent = KlassListTeacherComponent; // end class
//# sourceMappingURL=klass-list-teacher.component.js.map