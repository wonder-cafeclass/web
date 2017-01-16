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
var my_event_service_1 = require('../../util/service/my-event.service');
var radiobtn_option_1 = require('../../widget/radiobtn/model/radiobtn-option');
var KlassRadioBtnService = (function () {
    // 카페 클래스에서 사용하는 대표적인 체크박스 설정값 - week_min,week_max,...
    function KlassRadioBtnService(myEventService) {
        this.myEventService = myEventService;
    }
    KlassRadioBtnService.prototype.setWatchTower = function (watchTower) {
        this.watchTower = watchTower;
    };
    // @ Desc : 검사하지 않는 checker를 가져옵니다.
    KlassRadioBtnService.prototype.getFreePassChecker = function () {
        if (null == this.watchTower) {
            return null;
        }
        return this.watchTower.getMyCheckerService().getFreePassChecker();
    };
    /*
    *    @ Desc : 유저가 몇주(weeks) 수강하려는 결정을 도와주는 체크박스 데이터
    */
    KlassRadioBtnService.prototype.getKlassEnrolmentWeeks = function (klass) {
        var optionList = [
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "4주", 
            // public key:string,
            "4", 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KLASS_WEEK_MAX, 
            // public value:string
            "4", 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            this.getFreePassChecker())),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "8주", 
            // public key:string,
            "8", 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KLASS_WEEK_MAX, 
            // public value:string
            "8", 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            this.getFreePassChecker())),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "12주", 
            // public key:string,
            "12", 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KLASS_WEEK_MAX, 
            // public value:string
            "12", 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            this.getFreePassChecker()))
        ];
        for (var i = 0; i < optionList.length; ++i) {
            var option = optionList[i];
            if (+klass.week_min == +option.myEvent.value) {
                option.isFocus = true;
                optionList[i] = option;
                break;
            }
        }
        return optionList;
    };
    /*
    *    @ Desc : 유저가 다음 수업에 참여할 수 있는 주(weeks) 간격에 대한 체크박스 데이터.
    */
    KlassRadioBtnService.prototype.getKlassEnrolmentInterval = function (klass, valueFocus) {
        var optionList = [
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "4주", 
            // public key:string,
            "4", 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KLASS_ENROLMENT_INTERVAL, 
            // public value:string
            "4", 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            this.getFreePassChecker())),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "2주", 
            // public key:string,
            "2", 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KLASS_ENROLMENT_INTERVAL, 
            // public value:string
            "2", 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            ),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "1주", 
            // public key:string,
            "1", 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KLASS_ENROLMENT_INTERVAL, 
            // public value:string
            "1", 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            )
        ];
        if (null != valueFocus && "" != valueFocus) {
            for (var i = 0; i < optionList.length; ++i) {
                var option = optionList[i];
                if (option.myEvent.value === valueFocus) {
                    option.isFocus = true;
                    optionList[i] = option;
                }
            }
        }
        return optionList;
    };
    /*
    *    @ Desc : 수업 상세 정보에 대한 Nav tabs에 들어갈 radiobtn 정보들
    */
    KlassRadioBtnService.prototype.getNavTabsKlassInfo = function (klass, keyFocus) {
        if (null == klass) {
            return null;
        }
        // klass_desc / getNavTabsKlassInfo(this.klass, "klass_desc");
        var optionList = [
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "수업소개", 
            // public key:string,
            this.myEventService.KLASS_DESC, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KLASS_DESC, 
            // public value:string
            klass.desc, 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            ),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "장소", 
            // public key:string,
            this.myEventService.KLASS_VENUE, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KLASS_VENUE, 
            // public value:string
            klass.venue_title, 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            ),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "강사소개", 
            // public key:string,
            this.myEventService.TEACHER_DESC, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.TEACHER_DESC, 
            // public value:string
            "Need to implement!", 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            ),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "리뷰", 
            // public key:string,
            this.myEventService.STUDENT_REVIEW, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.STUDENT_REVIEW, 
            // public value:string
            "Need to implement!", 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            ),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "문의", 
            // public key:string,
            this.myEventService.STUDENT_QUESTION, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.STUDENT_QUESTION, 
            // public value:string
            "Need to implement!", 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            ),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "유의사항", 
            // public key:string,
            this.myEventService.STUDENT_QUESTION, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.CAUTION, 
            // public value:string
            "Need to implement!", 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            )
        ]; // end array
        if (null != keyFocus && "" != keyFocus) {
            for (var i = 0; i < optionList.length; ++i) {
                var option = optionList[i];
                if (option.key === keyFocus) {
                    option.isFocus = true;
                    optionList[i] = option;
                }
            }
        } // end if
        return optionList;
    };
    /*
    *    @ Desc : 유저의 내정보 페이지에 대한 Nav tabs에 들어갈 radiobtn 정보들
    */
    KlassRadioBtnService.prototype.getNavTabsUserMyInfo = function (user, keyFocus) {
        // klass_desc / getNavTabsKlassInfo(this.klass, "klass_desc");
        var optionList = [
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "대시보드", 
            // public key:string,
            this.myEventService.KEY_USER_MY_INFO_DASHBOARD, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_USER_MY_INFO_DASHBOARD, 
            // public value:string
            "", 
            // public metaObj:any
            user, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            ),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "나의 정보 수정", 
            // public key:string,
            this.myEventService.KEY_USER_MY_INFO, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_USER_MY_INFO, 
            // public value:string
            "", 
            // public metaObj:any
            user, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            ),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "수강 이력", 
            // public key:string,
            this.myEventService.KEY_USER_MY_KLASS, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_USER_MY_KLASS, 
            // public value:string
            "", 
            // public metaObj:any
            user, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            ),
            /* REMOVE ME
                      new RadioBtnOption(
                        // public title:string,
                        "결재정보",
                        // public key:string,
                        this.myEventService.KEY_USER_MY_PAYMENT,
                        // public isFocus:boolean
                        false,
                        // public myEvent:MyEvent
                        this.myEventService.getMyEvent(
                          // public eventName:string
                          this.myEventService.ON_CHANGE,
                          // public key:string
                          this.myEventService.KEY_USER_MY_PAYMENT,
                          // public value:string
                          "",
                          // public metaObj:any
                          user,
                          // public myChecker:MyChecker
                          this.getFreePassChecker()
                        ) // end MyEvent
                      ),
            */
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "찜한수업", 
            // public key:string,
            this.myEventService.KEY_USER_MY_FAVORITE, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_USER_MY_FAVORITE, 
            // public value:string
            "", 
            // public metaObj:any
            user, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            )
        ]; // end array
        if (null != keyFocus && "" != keyFocus) {
            for (var i = 0; i < optionList.length; ++i) {
                var option = optionList[i];
                if (option.key === keyFocus) {
                    option.isFocus = true;
                    optionList[i] = option;
                }
            }
        } // end if
        return optionList;
    };
    /*
    *    @ Desc : 선생님의 내정보 페이지에 대한 Nav tabs에 들어갈 radiobtn 정보들
    */
    KlassRadioBtnService.prototype.getNavTabsTeacherMyInfo = function (teacher, keyFocus) {
        // klass_desc / getNavTabsKlassInfo(this.klass, "klass_desc");
        var optionList = [
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "대시보드", 
            // public key:string,
            this.myEventService.KEY_TEACHER_MY_INFO_DASHBOARD, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_TEACHER_MY_INFO_DASHBOARD, 
            // public value:string
            "", 
            // public metaObj:any
            teacher, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            ),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "선생님정보", 
            // public key:string,
            this.myEventService.KEY_TEACHER_MY_INFO, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_TEACHER_MY_INFO, 
            // public value:string
            "", 
            // public metaObj:any
            teacher, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            ),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "수업리스트", 
            // public key:string,
            this.myEventService.KEY_TEACHER_MY_KLASS, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_TEACHER_MY_KLASS, 
            // public value:string
            "", 
            // public metaObj:any
            teacher, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            ),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "정산", 
            // public key:string,
            this.myEventService.KEY_TEACHER_MY_INCOME, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_TEACHER_MY_INCOME, 
            // public value:string
            "", 
            // public metaObj:any
            teacher, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            ),
            new radiobtn_option_1.RadioBtnOption(
            // public title:string,
            "피드백", 
            // public key:string,
            this.myEventService.KEY_TEACHER_MY_FEEDBACK, 
            // public isFocus:boolean
            false, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_TEACHER_MY_FEEDBACK, 
            // public value:string
            "", 
            // public metaObj:any
            teacher, 
            // public myChecker:MyChecker
            this.getFreePassChecker()) // end MyEvent
            )
        ]; // end array
        if (null != keyFocus && "" != keyFocus) {
            for (var i = 0; i < optionList.length; ++i) {
                var option = optionList[i];
                if (option.key === keyFocus) {
                    option.isFocus = true;
                    optionList[i] = option;
                }
            }
        } // end if
        return optionList;
    };
    KlassRadioBtnService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService])
    ], KlassRadioBtnService);
    return KlassRadioBtnService;
}());
exports.KlassRadioBtnService = KlassRadioBtnService;
//# sourceMappingURL=klass-radiobtn.service.js.map