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
var klass_teacher_1 = require('../model/klass-teacher');
var KlassTeacherComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function KlassTeacherComponent(myEventService) {
        this.myEventService = myEventService;
        this.cageWidth = -1;
        this.cageHeight = -1;
        // 이벤트를 부모에게 전달
        this.emitter = new core_1.EventEmitter();
    }
    KlassTeacherComponent.prototype.ngOnInit = function () {
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
        console.log("klass-teacher / this.klassTeacher : ", this.klassTeacher);
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
        __metadata('design:paramtypes', [my_event_service_1.MyEventService])
    ], KlassTeacherComponent);
    return KlassTeacherComponent;
}());
exports.KlassTeacherComponent = KlassTeacherComponent;
//# sourceMappingURL=klass-teacher.component.js.map