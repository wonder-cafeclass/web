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
var my_event_1 = require('./model/my-event');
var MyEventService = (function () {
    function MyEventService() {
        // 부모 자식간의 컴포넌트 통신시 어떤 이벤트가 발생했는지 정의하는 서비스 객체.
        // GENERAL PURPOSE
        this.ANY = "ANY"; // 어떤 형태의 이벤트로도 변경 가능한 타입. 복제해서 사용하는 것을 권장.
        this.ON_READY = "ON_READY";
        this.ON_CHANGE = "ON_CHANGE";
        this.ON_SHUTDOWN = "ON_SHUTDOWN";
        this.ON_SHUTDOWN_N_ROLLBACK = "ON_SHUTDOWN_N_ROLLBACK";
        this.ON_SAVE = "ON_SAVE";
        this.ON_ADD_ROW = "ON_ADD_ROW";
        this.ON_REMOVE_ROW = "ON_REMOVE_ROW";
        this.ON_MOUSE_LEAVE = "ON_MOUSE_LEAVE";
        this.ON_MOUSE_ENTER = "ON_MOUSE_ENTER";
        this.ON_PREVIEW = "ON_PREVIEW";
        this.ON_UNPREVIEW = "ON_UNPREVIEW";
        // SPECIFIC ATTR
        this.KLASS_WEEK_MAX = "KLASS_WEEK_MAX";
        this.KLASS_ENROLMENT_INTERVAL = "KLASS_ENROLMENT_INTERVAL";
        this.KLASS_DAYS = "KLASS_DAYS"; // 수업요일
        this.KLASS_DAYS_SUNDAY = "sun"; // 수업요일 - 일요일
        this.KLASS_DAYS_MONDAY = "mon"; // 수업요일 - 월요일
        this.KLASS_DAYS_TUESDAY = "tue"; // 수업요일 - 화요일
        this.KLASS_DAYS_WEDNESDAY = "wed"; // 수업요일 - 수요일
        this.KLASS_DAYS_THURSDAY = "thu"; // 수업요일 - 목요일
        this.KLASS_DAYS_FRIDAY = "fri"; // 수업요일 - 금요일
        this.KLASS_DAYS_SATURDAY = "sat"; // 수업요일 - 토요일
        this.KLASS_SCHEDULE = "KLASS_SCHEDULE"; // 수업일정
        this.KLASS_TITLE = "KLASS_TITLE"; // 수업이름
        this.KLASS_FEATURE = "KLASS_FEATURE"; // 수업특징
        this.KLASS_TARGET = "KLASS_TARGET"; // 수업대상
        this.KLASS_DESC = "KLASS_DESC"; // 수업소개
        this.KLASS_VENUE = "KLASS_VENUE"; // 장소
        this.KLASS_TIME_BEGIN = "KLASS_TIME_BEGIN"; // 수업시작시간
        this.KLASS_TIME_END = "KLASS_TIME_END"; // 수업종료시간
        this.TUTOR_DESC = "TUTOR_DESC"; // 강사소개
        this.STUDENT_REVIEW = "STUDENT_REVIEW"; // 리뷰
        this.STUDENT_QUESTION = "STUDENT_QUESTION"; // 문의
        this.CAUTION = "CAUTION"; // 유의사항
        this.KEY_SEARCH_LIST = "KEY_SEARCH_LIST"; // 검색시, 결과가 리스트에 노출됨.
        this.KEY_SMART_EDITOR = "KEY_SMART_EDITOR"; // 네이버 스마트에디터
        this.KEY_INPUTS_BTNS_ROWS = "KEY_INPUTS_BTNS_ROWS"; // 여러개의 열이 있는 입력창
        this.KEY_INPUT_BTNS_ROW = "KEY_INPUT_BTNS_ROW"; // 여러개 버튼과 1개의 INPUT이 있는 입력창
        this.KEY_INPUT_ROW = "KEY_INPUT_ROW"; // 입력창만 있는 열
        this.KEY_SINGLE_INPUT_VIEW = "KEY_SINGLE_INPUT_VIEW"; // ?
        this.KEY_MINI_CALENDAR = "KEY_MINI_CALENDAR"; // 날짜를 한눈에 확인하는 미니 캘린더
        this.KEY_DRON_LIST = "KEY_DRON_LIST"; // 화면 구석에 노출, 스크롤에도 움직이지 않아요.
        // SPECIFIC CASES - @ Deprecated
        /*
        ON_CHANGE_KLASS_DISCOUNT:string="ON_CHANGE_KLASS_DISCOUNT";
        ON_CHANGE_KLASS_TITLE:string="ON_CHANGE_KLASS_TITLE";
        ON_CHANGE_KLASS_PRICE:string="ON_CHANGE_KLASS_PRICE";
        ON_CHANGE_KLASS_TIME:string="ON_CHANGE_KLASS_TIME";
        ON_CHANGE_KLASS_DATE:string="ON_CHANGE_KLASS_DATE";
        ON_CHANGE_KLASS_DAYS:string="ON_CHANGE_KLASS_DAYS";
        ON_CHANGE_KLASS_LEVEL:string="ON_CHANGE_KLASS_LEVEL";
        ON_CHANGE_KLASS_ENROLMENT_INTERVAL:string="ON_CHANGE_KLASS_ENROLMENT_INTERVAL";
        ON_CHANGE_KLASS_WEEKS_MIN:string="ON_CHANGE_KLASS_WEEKS_MIN";
        ON_CHANGE_KLASS_WEEKS_MAX:string="ON_CHANGE_KLASS_WEEKS_MAX";
        ON_CHANGE_KLASS_DATE_BEGIN:string="ON_CHANGE_KLASS_DATE_BEGIN";
        ON_CHANGE_KLASS_ENROLMENT_WEEKS:string="ON_CHANGE_KLASS_ENROLMENT_WEEKS";
        ON_CHANGE_KLASS_FEATURE:string="ON_CHANGE_KLASS_FEATURE";
        ON_CHANGE_KLASS_TARGET:string="ON_CHANGE_KLASS_TARGET";
        ON_CHANGE_KLASS_SCHEDULE:string="ON_CHANGE_KLASS_SCHEDULE";
    
        ON_CHANGE_NAV_TABS_KLASS_INFO:string="ON_CHANGE_NAV_TABS_KLASS_INFO";
        ON_READY_SMART_EDITOR:string="ON_READY_SMART_EDITOR";
        ON_CHANGE_SMART_EDITOR:string="ON_CHANGE_SMART_EDITOR";
    
        ON_READY_SINGLE_INPUT_VIEW:string="ON_READY_SINGLE_INPUT_VIEW";
        ON_CHANGE_SINGLE_INPUT_VIEW:string="ON_CHANGE_SINGLE_INPUT_VIEW";
    
        ON_CHANGE_DRON_LIST:string="ON_CHANGE_DRON_LIST";
        ON_SAVE_DRON_LIST:string="ON_SAVE_DRON_LIST";
        ON_SHUTDOWN_DRON_LIST:string="ON_SHUTDOWN_DRON_LIST";
        ON_SHUTDOWN_N_ROLLBACK_DRON_LIST:string="ON_SHUTDOWN_N_ROLLBACK_DRON_LIST";
    
        ON_CHANGE_INPUT_ROW:string="ON_CHANGE_INPUT_ROW";
        ON_SAVE_INPUT_ROW:string="ON_SAVE_INPUT_ROW";
        ON_SHUTDOWN_INPUT_ROW:string="ON_SHUTDOWN_INPUT_ROW";
        ON_SHUTDOWN_N_ROLLBACK_INPUT_ROW:string="ON_SHUTDOWN_N_ROLLBACK_INPUT_ROW";
    
        ON_READY_INPUT_BTNS_ROW:string="ON_READY_INPUT_BTNS_ROW";
        ON_CHANGE_INPUT_BTNS_ROW:string="ON_CHANGE_INPUT_BTNS_ROW";
        ON_SAVE_INPUT_BTNS_ROW:string="ON_SAVE_INPUT_BTNS_ROW";
        ON_SHUTDOWN_INPUT_BTNS_ROW:string="ON_SHUTDOWN_INPUT_BTNS_ROW";
        ON_SHUTDOWN_N_ROLLBACK_INPUT_BTNS_ROW:string="ON_SHUTDOWN_N_ROLLBACK_INPUT_BTNS_ROW";
    
        ON_CLICK_KLASS_FEATURE:string="ON_CLICK_KLASS_FEATURE";
        ON_CLICK_KLASS_TARGET:string="ON_CLICK_KLASS_TARGET";
        ON_CLICK_KLASS_SCHEDULE:string="ON_CLICK_KLASS_SCHEDULE";
    
        ON_MOUSEENTER_KLASS_CALENDAR_DATE:string="ON_MOUSEENTER_KLASS_CALENDAR_DATE";
        ON_MOUSELEAVE_KLASS_CALENDAR_DATE:string="ON_MOUSELEAVE_KLASS_CALENDAR_DATE";
        */
        this.uniqueIdx = 0;
    }
    // @ Deprecated
    MyEventService.prototype.has_it = function (event_name) {
        return true;
    };
    // @ Deprecated
    MyEventService.prototype.is_it = function (target_event_name, event_name) {
        if (!this.has_it(target_event_name)) {
            return false;
        }
        if (!this.has_it(event_name)) {
            return false;
        }
        if (target_event_name === event_name) {
            return true;
        }
        return false;
    };
    MyEventService.prototype.getCopyEventList = function (myEventList) {
        var copyList = [];
        for (var i = 0; i < myEventList.length; ++i) {
            var myEvent = myEventList[i];
            var myEventCopy = myEvent.copy();
            copyList.push(myEventCopy);
        }
        return copyList;
    };
    MyEventService.prototype.isSameEventLists = function (firstList, secondList) {
        if (null == firstList || 0 === firstList.length) {
            return false;
        }
        if (null == secondList || 0 === secondList.length) {
            return false;
        }
        if (firstList.length !== secondList.length) {
            return false;
        }
        for (var i = 0; i < firstList.length; ++i) {
            var firstMyEvent = firstList[i];
            var secondMyEvent = secondList[i];
            var isSame = firstMyEvent.isSame(secondMyEvent);
            if (!isSame) {
                return false;
            }
        }
        return true;
    };
    MyEventService.prototype.getChangedFromList = function (firstList, secondList) {
        if (null == firstList || 0 === firstList.length) {
            return null;
        }
        if (null == secondList || 0 === secondList.length) {
            return null;
        }
        if (firstList.length !== secondList.length) {
            return null;
        }
        for (var i = 0; i < firstList.length; ++i) {
            var firstMyEvent = firstList[i];
            var secondMyEvent = secondList[i];
            var isSameValue = firstMyEvent.isSameValue(secondMyEvent);
            if (!isSameValue) {
                return [firstMyEvent, secondMyEvent];
            }
        }
        return null;
    };
    MyEventService.prototype.hasChangedList = function (firstList, secondList) {
        return this.isNotSameValueEventLists(firstList, secondList);
    };
    MyEventService.prototype.isNotSameValueEventLists = function (firstList, secondList) {
        return !this.isSameValueEventLists(firstList, secondList);
    };
    MyEventService.prototype.isSameValueEventLists = function (firstList, secondList) {
        if (null == firstList || 0 === firstList.length) {
            return false;
        }
        if (null == secondList || 0 === secondList.length) {
            return false;
        }
        if (firstList.length !== secondList.length) {
            return false;
        }
        for (var i = 0; i < firstList.length; ++i) {
            var firstMyEvent = firstList[i];
            var secondMyEvent = secondList[i];
            var isSameValue = firstMyEvent.isSameValue(secondMyEvent);
            if (!isSameValue) {
                return false;
            }
        }
        return true;
    };
    MyEventService.prototype.setEventValue = function (myEvent, myEventList) {
        for (var i = 0; i < myEventList.length; ++i) {
            var myEventNext = myEventList[i];
            if (myEvent.isSame(myEventNext)) {
                myEventNext.value = myEvent.value;
            }
        }
        return myEventList;
    };
    MyEventService.prototype.getUniqueIdx = function () {
        return this.uniqueIdx++;
    };
    // 각 MyEvent 객체가 자신만의 id를 가져야 하는 경우 사용합니다.
    // 추가/삭제가 가능한 MyEventList를 제어해야 할 경우 사용합니다.
    MyEventService.prototype.getMyEvent = function (eventName, key, value, metaObj, myChecker) {
        var uniqueId = this.getUniqueIdx();
        var myEvent = new my_event_1.MyEvent(uniqueId, eventName, key, value, metaObj, myChecker);
        return myEvent;
    };
    MyEventService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyEventService);
    return MyEventService;
}());
exports.MyEventService = MyEventService;
//# sourceMappingURL=my-event.service.js.map