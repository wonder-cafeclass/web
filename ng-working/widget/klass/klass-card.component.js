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
var klass_1 = require('../../widget/klass/model/klass');
var klass_n_student_1 = require('../../widget/klass/model/klass-n-student');
var KlassCardComponent = (function () {
    function KlassCardComponent(watchTower) {
        this.watchTower = watchTower;
        // @ Common Props
        this.emitter = new core_1.EventEmitter();
        this.isSmall = false;
        this.width = -1;
        this.widthStr = "";
        this.katStatus = "";
        this.isValidPayment = false;
        this.isShowCertificate = false;
        // @ Deprecated
        this.size = "default";
        // Do something...
        this.myArray = new my_array_1.HelperMyArray();
    } // end constructor
    KlassCardComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    }; // end method
    KlassCardComponent.prototype.ngOnInit = function () {
        if (this.isDebug())
            console.log("klass-card / ngOnInit / init");
        if (this.isDebug())
            console.log("klass-card / ngOnInit / this.width : ", this.width);
        if (0 < this.width) {
            this.widthStr = this.width + "px";
        }
        else {
            this.widthStr = "100%";
        }
        this.asyncViewPack();
    };
    KlassCardComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("klass-card / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("klass-card / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("klass-card / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    KlassCardComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("klass-card / init / 시작");
        // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
        this.emitEventOnReady();
        // 전달받은 katList 데이터로 '남은 수업 일수/전체 수업 일수'를 표시합니다.
        this.updateKatProgressView();
        // 영수증 및 수강증등 결제 관련 버튼 노출 여부 업데이트.
        this.updatePaymentView();
    }; // end method
    KlassCardComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("klass-card / emitEventOnReady / 시작");
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
        if (this.isDebug())
            console.log("klass-card / emitEventOnReady / Done!");
    };
    KlassCardComponent.prototype.updateKatProgressView = function () {
        if (this.isDebug())
            console.log("klass-card / updateKatProgressView / 시작");
        if (null == this.klassNStudent) {
            if (this.isDebug())
                console.log("klass-card / updateKatProgressView / 중단 / null == this.klassNStudent");
            return;
        }
        var progress = this.klassNStudent.getProgress();
        if (null != progress && "" != progress) {
            this.katStatus = "\uC9C4\uD589\uC0C1\uD669 " + progress + "\uD68C";
        }
    }; // end method
    KlassCardComponent.prototype.updatePaymentView = function () {
        if (this.isDebug())
            console.log("klass-card / updatePaymentView / 시작");
        if (null == this.klassNStudent) {
            if (this.isDebug())
                console.log("klass-card / updatePaymentView / 중단 / null == this.klassNStudent");
            return;
        }
        // 영수증 및 자료실 버튼 노출 여부
        this.isValidPayment = (0 < this.klassNStudent.payment_import_cnt) ? true : false;
        // 수강증 노출 여부
        this.isShowCertificate = this.klassNStudent.isFinished();
    }; // end method
    KlassCardComponent.prototype.onClickKlass = function (event) {
        if (this.isDebug())
            console.log("klass-card / onClickKlass / 시작");
        event.preventDefault();
        event.stopPropagation();
        // 부모 객체로 클래스를 선택한 것을 전달. 해당 수업 상세 페이지로 이동!
        if (null == this.klass) {
            if (this.isDebug())
                console.log("klass-card / onClickKlass / 중단 / null == this.klass");
            return;
        } // end if
        this.emitOnClickMeta("" + this.klass.id, this.klass);
    }; // end method
    KlassCardComponent.prototype.emitOnClickMeta = function (value, meta) {
        var myEvent = this.watchTower.getEventOnClickMetaFreePass(
        // eventKey:string, 
        this.eventKey, 
        // value:string, 
        value, 
        // meta:any
        meta);
        this.emitter.emit(myEvent);
    }; // end method
    KlassCardComponent.prototype.onClickTeacher = function (event) {
        if (this.isDebug())
            console.log("klass-card / onClickTeacher / 시작");
        event.preventDefault();
        event.stopPropagation();
    }; // end method
    KlassCardComponent.prototype.onClickStatus = function (event) {
        if (this.isDebug())
            console.log("klass-card / onClickStatus / 시작");
        event.preventDefault();
        event.stopPropagation();
    };
    KlassCardComponent.prototype.onClickReceipt = function (event) {
        if (this.isDebug())
            console.log("klass-card / onClickReceipt / 시작");
        event.preventDefault();
        event.stopPropagation();
    };
    KlassCardComponent.prototype.onClickCertificate = function (event) {
        if (this.isDebug())
            console.log("klass-card / onClickCertificate / 시작");
        event.preventDefault();
        event.stopPropagation();
    };
    KlassCardComponent.prototype.onClickSupplement = function (event) {
        if (this.isDebug())
            console.log("klass-card / onClickSupplement / 시작");
        event.preventDefault();
        event.stopPropagation();
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassCardComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassCardComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', klass_1.Klass)
    ], KlassCardComponent.prototype, "klass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', klass_n_student_1.KlassNStudent)
    ], KlassCardComponent.prototype, "klassNStudent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], KlassCardComponent.prototype, "isSmall", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], KlassCardComponent.prototype, "width", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassCardComponent.prototype, "size", void 0);
    KlassCardComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-card',
            templateUrl: 'klass-card.component.html',
            styleUrls: ['klass-card.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_watchtower_service_1.MyEventWatchTowerService])
    ], KlassCardComponent);
    return KlassCardComponent;
}());
exports.KlassCardComponent = KlassCardComponent; // end class
//# sourceMappingURL=klass-card.component.js.map