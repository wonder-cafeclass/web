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
var teacher_1 = require('../../teacher/model/teacher');
var my_event_service_1 = require('../../util/service/my-event.service');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var my_event_1 = require('../../util/model/my-event');
var my_is_1 = require('../../util/helper/my-is');
var my_array_1 = require('../../util/helper/my-array');
// import { KlassTeacher }                from '../model/klass-teacher'; // REMOVE ME
var KlassTeacherComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function KlassTeacherComponent(watchTower, myEventService, myCheckerService) {
        this.watchTower = watchTower;
        this.myEventService = myEventService;
        this.myCheckerService = myCheckerService;
        this.cageWidth = -1;
        this.cageHeight = -1;
        this.isShowResume = false;
        this.isShowGreeting = false;
        // 이벤트를 부모에게 전달
        this.emitter = new core_1.EventEmitter();
        this.myIs = new my_is_1.HelperMyIs();
        this.myArray = new my_array_1.HelperMyArray();
    }
    KlassTeacherComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    KlassTeacherComponent.prototype.ngOnInit = function () {
        if (this.isDebug())
            console.log("klass-teacher / ngOnInit / init");
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        }
        if (0 < this.cageHeight) {
            this.cageHeightStr = this.cageHeight + "px";
        }
        else {
            this.cageHeightStr = "100%";
        }
        this.subscribeEventPack();
        this.init();
    };
    KlassTeacherComponent.prototype.subscribeEventPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("klass-teacher / subscribeEventPack / init");
        var isEventPackReady = this.watchTower.getIsEventPackReady();
        if (this.isDebug())
            console.log("klass-teacher / subscribeEventPack / isEventPackReady : ", isEventPackReady);
        if (this.watchTower.getIsEventPackReady()) {
            // 1. 이미 EventPack 로딩이 완료된 경우
            // 부모 객체에게 component가 준비된 것을 알립니다.
            this.emitEventOnReady();
        }
        else {
            // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
            this.watchTower.isEventPackReady$.subscribe(function (isEventPackReady) {
                if (_this.isDebug())
                    console.log("klass-teacher / subscribeEventPack / isEventPackReady : ", isEventPackReady);
                // 이벤트 관련 정보가 준비되었습니다.
                // 부모 객체에게 component가 준비된 것을 알립니다.
                _this.emitEventOnReady();
            }); // end subscribe
        } // end if
    }; // end method 
    KlassTeacherComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("klass-teacher / emitEventOnReady / 시작");
        if (!this.watchTower.getIsEventPackReady()) {
            if (this.isDebug())
                console.log("klass-teacher / emitEventOnReady / 중단 / EventPack is not valid!");
            return;
        }
        var myEventOnReady = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.watchTower.getMyEventService().KEY_KLASS_TEACHER_LIST, 
        // component
        this);
        if (this.isDebug())
            console.log("klass-teacher / emitEventOnReady / myEventOnReady : ", myEventOnReady);
        this.emitter.emit(myEventOnReady);
        if (this.isDebug())
            console.log("klass-teacher / emitEventOnReady / Done!");
    };
    KlassTeacherComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("klass-teacher / init / 시작");
        if (this.isDebug())
            console.log("klass-teacher / init / this.teacher : ", this.teacher);
        this.setResume();
        this.setGreeting();
    };
    KlassTeacherComponent.prototype.setTeacher = function (teacher) {
        if (this.isDebug())
            console.log("klass-teacher / setTeacher / 시작");
        if (this.isDebug())
            console.log("klass-teacher / setTeacher / teacher : ", teacher);
        this.teacher = teacher;
    };
    KlassTeacherComponent.prototype.setResume = function () {
        if (this.isDebug())
            console.log("klass-teacher / setResume / 시작");
        if (null == this.teacher) {
            if (this.isDebug())
                console.log("klass-teacher / setResume / 중단 / null == this.teacher");
            return;
        }
        // Resume를 변경하기 위한 이벤트 리스트를 만듭니다.
        var resumeArr = this.teacher.getResumeArr();
        var myEventList = [];
        for (var i = 0; i < resumeArr.length; ++i) {
            var resume = resumeArr[i];
            var myEventResume = new my_event_1.MyEvent(
            // public id:string
            this.myEventService.getUniqueIdx(), 
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST, 
            // public value:string
            resume, 
            // public metaObj:any
            { klassId: +this.klassId }, 
            // public myChecker:MyChecker
            this.myCheckerService.getTitleChecker());
            myEventList.push(myEventResume);
        } // end for
        this.myEventListForTeacherResume = myEventList;
    }; // end method
    KlassTeacherComponent.prototype.setGreeting = function () {
        if (this.isDebug())
            console.log("klass-teacher / setGreeting / 시작");
        if (null == this.teacher) {
            if (this.isDebug())
                console.log("klass-teacher / setGreeting / 중단 / null == this.teacher");
            return;
        }
        // Greeting을 변경하기 위한 이벤트 리스트를 만듭니다.
        var greetingArr = this.teacher.getGreetingArr();
        var myEventList = [];
        for (var i = 0; i < greetingArr.length; ++i) {
            var greeting = greetingArr[i];
            var myEventGreeting = new my_event_1.MyEvent(
            // public id:string
            this.myEventService.getUniqueIdx(), 
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST, 
            // public value:string
            greeting, 
            // public metaObj:any
            { klassId: +this.klassId }, 
            // public myChecker:MyChecker
            this.myCheckerService.getTitleChecker());
            myEventList.push(myEventGreeting);
        }
        this.myEventListForTeacherGreeting = myEventList;
    }; // end method  
    KlassTeacherComponent.prototype.onClickResume = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.isShowResume = !this.isShowResume;
        console.log("klass-teacher / onClickResume / this.isShowResume : ", this.isShowResume);
    };
    KlassTeacherComponent.prototype.onClickGreeting = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.isShowGreeting = !this.isShowGreeting;
        console.log("klass-teacher / onClickResume / this.isShowGreeting : ", this.isShowGreeting);
    };
    KlassTeacherComponent.prototype.onChangedFromChild = function (myEvent) {
        console.log("klass-teacher / onChangedFromChild / myEvent : ", myEvent);
        if (null == myEvent) {
            return;
        }
        if (myEvent.hasEventName(this.myEventService.ON_READY)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_ADD_ROW)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {
                // 추가되었습니다. 부모 객체에게 전달합니다.
                this.emitter.emit(myEvent);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {
                // 추가되었습니다. 부모 객체에게 전달합니다.
                this.emitter.emit(myEvent);
            } // end if      
        }
        else if (myEvent.hasEventName(this.myEventService.ON_REMOVE_ROW)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {
                // 삭제되었습니다. 부모 객체에게 전달합니다.
                this.emitter.emit(myEvent);
                // 삭제된 데이터로 업데이트.
                if (null != myEvent.parentEventList) {
                    this.myEventListForTeacherResume = myEvent.parentEventList;
                } // end if
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {
                // 삭제되었습니다. 부모 객체에게 전달합니다.
                this.emitter.emit(myEvent);
                // 삭제된 데이터로 업데이트.
                if (null != myEvent.parentEventList) {
                    this.myEventListForTeacherGreeting = myEvent.parentEventList;
                } // end if
            } // end if       
        }
        else if (myEvent.hasEventName(this.myEventService.ON_SAVE)) {
        }
        else if (myEvent.hasEventName(this.myEventService.ON_SHUTDOWN)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {
                // 사용자가 저장 이후, 창을 닫았습니다.
                this.isShowResume = false;
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {
                // 사용자가 저장 이후, 창을 닫았습니다.
                this.isShowGreeting = false;
            } // end if      
        }
        else if (myEvent.hasEventName(this.myEventService.ON_SHUTDOWN_N_ROLLBACK)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {
                // 사용자가 저장하지 않고, 창을 닫았습니다.
                this.isShowResume = false;
                // 이전 데이터롤 롤백.
                if (null != myEvent.parentEventList) {
                    this.myEventListForTeacherResume = myEvent.parentEventList;
                } // end if
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {
                // 사용자가 저장하지 않고, 창을 닫았습니다.
                this.isShowGreeting = false;
                // 이전 데이터롤 롤백.
                if (null != myEvent.parentEventList) {
                    this.myEventListForTeacherGreeting = myEvent.parentEventList;
                } // end if
            } // end if      
        } // end if
    }; // end method
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], KlassTeacherComponent.prototype, "isAdmin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassTeacherComponent.prototype, "key", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_event_1.MyEvent)
    ], KlassTeacherComponent.prototype, "myEvent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], KlassTeacherComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], KlassTeacherComponent.prototype, "cageHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', (typeof (_a = typeof teacher_1.Teacher !== 'undefined' && teacher_1.Teacher) === 'function' && _a) || Object)
    ], KlassTeacherComponent.prototype, "teacher", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], KlassTeacherComponent.prototype, "klassId", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassTeacherComponent.prototype, "emitter", void 0);
    KlassTeacherComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-teacher',
            templateUrl: 'klass-teacher.component.html',
            styleUrls: ['klass-teacher.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_watchtower_service_1.MyEventWatchTowerService, my_event_service_1.MyEventService, my_checker_service_1.MyCheckerService])
    ], KlassTeacherComponent);
    return KlassTeacherComponent;
    var _a;
}());
exports.KlassTeacherComponent = KlassTeacherComponent; // end class
//# sourceMappingURL=klass-teacher.component.js.map