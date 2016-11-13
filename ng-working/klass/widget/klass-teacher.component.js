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
var my_event_service_1 = require('../../util/my-event.service');
var my_event_1 = require('../../util/model/my-event');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var klass_teacher_1 = require('../model/klass-teacher');
var KlassTeacherComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function KlassTeacherComponent(myEventService, myCheckerService) {
        this.myEventService = myEventService;
        this.myCheckerService = myCheckerService;
        this.cageWidth = -1;
        this.cageHeight = -1;
        this.isShowResume = false;
        this.isShowGreeting = false;
        // 이벤트를 부모에게 전달
        this.emitter = new core_1.EventEmitter();
    }
    KlassTeacherComponent.prototype.ngOnInit = function () {
        // TEST
        console.log("klass-teacher / ngOnInit / klassId : ", this.klassId);
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
        // Resume를 변경하기 위한 이벤트 리스트를 만듭니다.
        this.myEventListForTeacherResume = [];
        for (var i = 0; i < this.klassTeacher.resume_arr.length; ++i) {
            var resume = this.klassTeacher.resume_arr[i];
            var myEventResume = new my_event_1.MyEvent(
            // public id:string
            this.myEventService.getUniqueIdx(), 
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.TEACHER_RESUME, 
            // public value:string
            resume, 
            // public metaObj:any
            { klassId: +this.klassId }, 
            // public myChecker:MyChecker
            this.myCheckerService.getTitleChecker());
            this.myEventListForTeacherResume.push(myEventResume);
        } // end for
        // Greeting을 변경하기 위한 이벤트 리스트를 만듭니다.
        this.myEventListForTeacherGreeting = [];
        for (var i = 0; i < this.klassTeacher.greeting_arr.length; ++i) {
            var greeting = this.klassTeacher.greeting_arr[i];
            var myEventResume = new my_event_1.MyEvent(
            // public id:string
            this.myEventService.getUniqueIdx(), 
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.TEACHER_GREETING, 
            // public value:string
            greeting, 
            // public metaObj:any
            { klassId: +this.klassId }, 
            // public myChecker:MyChecker
            this.myCheckerService.getTitleChecker());
            this.myEventListForTeacherGreeting.push(myEventResume);
        } // end for    
    };
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
        if (this.myEventService.TEACHER_RESUME === myEvent.key) {
            if (this.myEventService.ON_CHANGE === myEvent.eventName) {
            }
            else if (this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {
                if (null != myEvent.parentEventList) {
                    this.myEventListForTeacherResume = myEvent.parentEventList;
                }
            }
            else if (this.myEventService.ON_SAVE === myEvent.eventName) {
                // DB UPDATE!
                console.log("klass-teacher / onChangedFromChild / DB UPDATE!");
            }
            else if (this.myEventService.ON_SHUTDOWN === myEvent.eventName) {
                this.isShowResume = false;
            }
            else if (this.myEventService.ON_SHUTDOWN_N_ROLLBACK === myEvent.eventName) {
                if (null != myEvent.parentEventList) {
                    this.myEventListForTeacherResume = myEvent.parentEventList;
                }
                this.isShowResume = false;
            }
        }
        else if (this.myEventService.TEACHER_GREETING === myEvent.key) {
            if (this.myEventService.ON_CHANGE === myEvent.eventName) {
            }
            else if (this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {
                if (null != myEvent.parentEventList) {
                    this.myEventListForTeacherGreeting = myEvent.parentEventList;
                }
            }
            else if (this.myEventService.ON_SAVE === myEvent.eventName) {
                // DB UPDATE!
                console.log("klass-teacher / onChangedFromChild / DB UPDATE!");
            }
            else if (this.myEventService.ON_SHUTDOWN === myEvent.eventName) {
                this.isShowGreeting = false;
            }
            else if (this.myEventService.ON_SHUTDOWN_N_ROLLBACK === myEvent.eventName) {
                if (null != myEvent.parentEventList) {
                    this.myEventListForTeacherGreeting = myEvent.parentEventList;
                }
                this.isShowGreeting = false;
            }
        }
    };
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
        __metadata('design:type', klass_teacher_1.KlassTeacher)
    ], KlassTeacherComponent.prototype, "klassTeacher", void 0);
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
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, my_checker_service_1.MyCheckerService])
    ], KlassTeacherComponent);
    return KlassTeacherComponent;
}());
exports.KlassTeacherComponent = KlassTeacherComponent;
//# sourceMappingURL=klass-teacher.component.js.map