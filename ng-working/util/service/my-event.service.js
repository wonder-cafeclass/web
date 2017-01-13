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
var my_event_1 = require('../model/my-event');
var my_regex_1 = require('../model/my-regex');
var default_meta_1 = require('../../widget/input/default/model/default-meta');
var default_type_1 = require('../../widget/input/default/model/default-type');
var MyEventService = (function () {
    function MyEventService() {
        // 부모 자식간의 컴포넌트 통신시 어떤 이벤트가 발생했는지 정의하는 서비스 객체.
        // GENERAL PURPOSE
        this.ANY = "ANY"; // 어떤 형태의 이벤트로도 변경 가능한 타입. 복제해서 사용하는 것을 권장.
        this.ON_READY = "ON_READY";
        this.ON_CLICK = "ON_CLICK";
        this.ON_CHANGE = "ON_CHANGE";
        this.ON_CHANGE_NOT_VALID = "ON_CHANGE_NOT_VALID";
        this.ON_SUBMIT = "ON_SUBMIT";
        this.ON_KEYUP_ENTER = "ON_KEYUP_ENTER";
        this.ON_SHUTDOWN = "ON_SHUTDOWN";
        this.ON_SHUTDOWN_N_ROLLBACK = "ON_SHUTDOWN_N_ROLLBACK";
        this.ON_SAVE = "ON_SAVE";
        this.ON_ADD_ROW = "ON_ADD_ROW";
        this.ON_ADD_COMMENT = "ON_ADD_COMMENT";
        this.ON_ADD_COMMENT_REPLY = "ON_ADD_COMMENT_REPLY";
        this.ON_REMOVE_ROW = "ON_REMOVE_ROW";
        this.ON_MOUSE_LEAVE = "ON_MOUSE_LEAVE";
        this.ON_MOUSE_ENTER = "ON_MOUSE_ENTER";
        this.ON_PREVIEW = "ON_PREVIEW";
        this.ON_UNPREVIEW = "ON_UNPREVIEW";
        this.ON_DONE = "ON_DONE";
        this.ON_LOGIN_REQUIRED = "ON_LOGIN_REQUIRED";
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
        this.TEACHER_DESC = "TEACHER_DESC"; // 강사소개
        this.TEACHER_RESUME = "TEACHER_RESUME"; // 강사이력소개
        this.TEACHER_GREETING = "TEACHER_GREETING"; // 강사인사말
        this.STUDENT_REVIEW = "STUDENT_REVIEW"; // 리뷰
        this.STUDENT_QUESTION = "STUDENT_QUESTION"; // 문의
        this.CAUTION = "CAUTION"; // 유의사항
        // Widget
        this.KEY_IMAGE_GRID = "KEY_IMAGE_GRID"; // Widget - image grid
        this.KEY_IMAGE_ENTRY = "KEY_IMAGE_ENTRY"; // Widget - image entry
        this.KEY_SEARCH_LIST = "KEY_SEARCH_LIST"; // 검색시, 결과가 리스트에 노출됨.
        this.KEY_SMART_EDITOR = "KEY_SMART_EDITOR"; // 네이버 스마트에디터
        this.KEY_INPUTS_BTNS_ROWS = "KEY_INPUTS_BTNS_ROWS"; // 여러개의 열이 있는 입력창
        this.KEY_INPUT_BTNS_ROW = "KEY_INPUT_BTNS_ROW"; // 여러개 버튼과 1개의 INPUT이 있는 입력창
        this.KEY_INPUT_ROW = "KEY_INPUT_ROW"; // 입력창만 있는 열
        this.KEY_SINGLE_INPUT_VIEW = "KEY_SINGLE_INPUT_VIEW"; // ?
        this.KEY_MINI_CALENDAR = "KEY_MINI_CALENDAR"; // 날짜를 한눈에 확인하는 미니 캘린더
        this.KEY_DRON_LIST = "KEY_DRON_LIST"; // 화면 구석에 노출, 스크롤에도 움직이지 않아요.
        this.KEY_COMMENT = "KEY_COMMENT"; // 댓글 리스트
        this.KEY_COMMENT_REVIEW = "KEY_COMMENT_REVIEW"; // 댓글 - 수업 리뷰 리스트
        this.KEY_COMMENT_QUESTION = "KEY_COMMENT_QUESTION"; // 댓글 - 수업 문의 리스트
        this.KEY_USER_SELECT = "KEY_USER_SELECT"; // 유저 - 유저 선택 SELECT BOX
        this.KEY_USER_STATUS = "KEY_USER_STATUS"; // 유저 - 상태
        this.KEY_USER_STATUS_FOR_SEARCH = "KEY_USER_STATUS_FOR_SEARCH"; // 유저 - 유저 검색을 위한 상태 조건 값
        this.KEY_USER_PERMISSION = "KEY_USER_PERMISSION"; // 유저 - 권한
        this.KEY_USER_PERMISSION_FOR_SEARCH = "KEY_USER_PERMISSION_FOR_SEARCH"; // 유저 - 권한
        this.KEY_USER_EMAIL = "KEY_USER_EMAIL"; // 유저 - 이메일주소
        this.KEY_USER_CUR_PASSWORD = "KEY_USER_CUR_PASSWORD"; // 유저 - 현재 유저의 비밀번호
        this.KEY_USER_PASSWORD = "KEY_USER_PASSWORD"; // 유저 - 비밀번호
        this.KEY_USER_RE_PASSWORD = "KEY_USER_RE_PASSWORD"; // 유저 - 확인을 위해 다시 입력한 비밀번호
        this.KEY_USER_NEW_PASSWORD = "KEY_USER_NEW_PASSWORD"; // 유저 - 새로운 비밀번호
        this.KEY_USER_NAME = "KEY_USER_NAME"; // 유저 - 이름
        this.KEY_USER_NICKNAME = "KEY_USER_NICKNAME"; // 유저 - 닉네임
        this.KEY_USER_THUMBNAIL = "KEY_USER_THUMBNAIL"; // 유저 - 150x150 섬네일
        this.KEY_USER_MOBILE_NUM_HEAD = "KEY_USER_MOBILE_NUM_HEAD"; // 유저 - 휴대전화 앞 3자리 010,011,019...
        this.KEY_USER_MOBILE_NUM_BODY = "KEY_USER_MOBILE_NUM_BODY"; // 유저 - 휴대전화 두번째 3~4자리 
        this.KEY_USER_MOBILE_NUM_TAIL = "KEY_USER_MOBILE_NUM_TAIL"; // 유저 - 휴대전화 마지막 4자리 
        this.KEY_USER_GENDER = "KEY_USER_GENDER"; // 유저 - 성별
        this.KEY_USER_BIRTH = "KEY_USER_BIRTH"; // 유저 - 생년월일
        this.KEY_USER_BIRTH_YEAR = "KEY_USER_BIRTH_YEAR"; // 유저 - 생년
        this.KEY_USER_BIRTH_MONTH = "KEY_USER_BIRTH_MONTH"; // 유저 - 생월
        this.KEY_USER_BIRTH_DAY = "KEY_USER_BIRTH_DAY"; // 유저 - 생일
        this.KEY_USER_MY_INFO_DASHBOARD = "KEY_USER_MY_INFO_DASHBOARD"; // 유저 - 내정보 대시보드.
        this.KEY_USER_MY_INFO = "KEY_USER_MY_INFO"; // 유저 - 내정보 수정.
        this.KEY_USER_MY_HISTORY = "KEY_USER_MY_HISTORY"; // 유저 - 내 수강이력.
        this.KEY_USER_MY_PAYMENT = "KEY_USER_MY_PAYMENT"; // 유저 - 내 결재정보.
        this.KEY_USER_MY_FAVORITE = "KEY_USER_MY_FAVORITE"; // 유저 - 내 관심강의(찜).
        this.KEY_TEACHER_MY_INFO = "KEY_TEACHER_MY_INFO"; // 선생님 - 내정보 수정.
        this.KEY_TEACHER_MY_HISTORY = "KEY_TEACHER_MY_HISTORY"; // 선생님 - 내 수강이력.
        this.KEY_TEACHER_MY_PAYMENT = "KEY_TEACHER_MY_PAYMENT"; // 선생님 - 내 결재정보.
        this.KEY_TEACHER_MY_FEEDBACK = "KEY_TEACHER_MY_FEEDBACK"; // 선생님 - 학생에게준 피드백.
        this.KEY_TEACHER_RESUME = "KEY_TEACHER_RESUME"; // 선생님 - 경력
        this.KEY_TEACHER_GREETING = "KEY_TEACHER_GREETING"; // 선생님 - 인사말
        this.KEY_TEACHER_STATUS = "KEY_TEACHER_STATUS"; // 선생님 - 상태
        this.KEY_TEACHER_STATUS_FOR_SEARCH = "KEY_TEACHER_STATUS_FOR_SEARCH"; // 선생님 - 상태 (검색)
        this.KEY_KLASS_TITLE = "KEY_KLASS_TITLE"; // 수업 - 수업 이름
        this.KEY_KLASS_PRICE = "KEY_KLASS_PRICE"; // 수업 - 수업 가격
        this.KEY_KLASS_PRICE_VIEW = "KEY_KLASS_PRICE_VIEW"; // 수업 - 수업 가격 뷰
        this.KEY_KLASS_TIME_BEGIN = "KEY_KLASS_TIME_BEGIN"; // 수업 - 수업 시작 시간
        this.KEY_KLASS_TIME_END = "KEY_KLASS_TIME_END"; // 수업 - 수업 종료 시간
        this.KEY_KLASS_WEEKS = "KEY_KLASS_WEEKS"; // 수업 - 수업 기간 (몇주?)
        this.KEY_KLASS_DATE_ENROLLMENT = "KEY_KLASS_DATE_ENROLLMENT"; // 수업 - 등록 가능한 수업 시작일
        this.KEY_KLASS_DATE_ENROLLMENT_VIEW = "KEY_KLASS_DATE_ENROLLMENT_VIEW"; // 수업 - 등록 가능한 수업 시작일
        this.KEY_KLASS_DATE_ENROLLMENT_INPUT = "KEY_KLASS_DATE_ENROLLMENT_INPUT"; // 수업 - 등록 가능한 수업 시작일
        this.KEY_KLASS_DAYS = "KEY_KLASS_DAYS"; // 수업 - 수업이 있는 요일
        this.KEY_KLASS_POSTER = "KEY_KLASS_POSTER"; // 수업 - 포스터 이미지
        this.KEY_KLASS_BANNER_VIEW = "KEY_KLASS_BANNER_VIEW"; // 수업 - 배너 이미지
        // 수업 - 배너 이미지
        this.KEY_KLASS_BANNER = "KEY_KLASS_BANNER";
        // 수업 - 레벨 이미지
        this.KEY_KLASS_LEVEL = "KEY_KLASS_LEVEL";
        // 수업 - 지하철 노선
        this.KEY_KLASS_VENUE_SUBWAY_LINE = "KEY_KLASS_VENUE_SUBWAY_LINE";
        // 수업 - 지하철 노선
        this.KEY_KLASS_VENUE_SUBWAY_STATION = "KEY_KLASS_VENUE_SUBWAY_STATION";
        // 수업 - 장소, 레벨, 요일, 시간
        this.KEY_KLASS_SELECTILE_VIEW = "KEY_KLASS_SELECTILE_VIEW";
        // 수업 - 장소, 레벨, 요일, 시간
        this.KEY_KLASS_SELECTILE = "KEY_KLASS_SELECTILE";
        // 수업 - 수업 상세 내용 리스트
        this.KEY_KLASS_DETAIL_NAV_LIST = "KEY_KLASS_DETAIL_NAV_LIST";
        // 수업 - 수업 상세 내용 - 지도(네이버)
        this.KEY_KLASS_DETAIL_NAV_VENUE_MAP = "KEY_KLASS_DETAIL_NAV_VENUE_MAP";
        // 수업 - 수업 선생님 리스트
        this.KEY_KLASS_TEACHER_LIST = "KEY_KLASS_TEACHER_LIST";
        // 수업 - 수업 관련 질문 리스트
        this.KEY_KLASS_QUESTION_LIST = "KEY_KLASS_QUESTION_LIST";
        // 수업 - 수업 관련 리뷰 리스트
        this.KEY_KLASS_REVIEW_LIST = "KEY_KLASS_REVIEW_LIST";
        // 수업 - 선생님 - 경력 리스트
        this.KEY_KLASS_TEACHER_RESUME_LIST = "KEY_KLASS_TEACHER_RESUME_LIST";
        // 수업 - 선생님 - 인사말 리스트
        this.KEY_KLASS_TEACHER_GREETING_LIST = "KEY_KLASS_TEACHER_GREETING_LIST";
        // 수업 - 수업 특징 리스트
        this.KEY_KLASS_FEATURE_LIST = "KEY_KLASS_FEATURE_LIST";
        // 수업 - 수업 대상 리스트
        this.KEY_KLASS_TARGET_LIST = "KEY_KLASS_TARGET_LIST";
        // 수업 - 수업 일정
        this.KEY_KLASS_SCHEDULE = "KEY_KLASS_SCHEDULE";
        // 수업료 계산기 - 1인당 강의료
        this.KEY_KLASS_PRICE_CALC = "KEY_KLASS_PRICE_CALC";
        // 수업료 계산기 - 1인당 강의료
        this.KEY_KLASS_PRICE_CALC_PRICE_FOR_STUDENT = "KEY_KLASS_PRICE_CALC_PRICE_FOR_STUDENT";
        // 수업료 계산기 - 수수료
        this.KEY_KLASS_PRICE_CALC_COMMISSION = "KEY_KLASS_PRICE_CALC_COMMISSION";
        // 수업료 계산기 - 1인당 강사 지급액
        this.KEY_KLASS_PRICE_CALC_PAYMENT_FOR_TEACHER = "KEY_KLASS_PRICE_CALC_PAYMENT_FOR_TEACHER";
        // 수업료 계산기 - 수업 학생수
        this.KEY_KLASS_PRICE_CALC_STUDENT_NUMBER = "KEY_KLASS_PRICE_CALC_STUDENT_NUMBER";
        // 수업료 계산기 - 합계
        this.KEY_KLASS_PRICE_CALC_TOTAL = "KEY_KLASS_PRICE_CALC_TOTAL";
        // 수업료 계산기 - 수업 주수
        this.KEY_KLASS_PRICE_CALC_WEEK = "KEY_KLASS_PRICE_CALC_WEEK";
        // 수업시간 뷰
        this.KEY_KLASS_CLOCK_VIEW = "KEY_KLASS_CLOCK_VIEW";
        // 수업 상태
        this.KEY_KLASS_STATUS = "KEY_KLASS_STATUS";
        // 수업 상태 - 검색
        this.KEY_KLASS_STATUS_FOR_SEARCH = "KEY_KLASS_STATUS_FOR_SEARCH";
        // 수업 레벨 - 검색
        this.KEY_KLASS_LEVEL_FOR_SEARCH = "KEY_KLASS_LEVEL_FOR_SEARCH";
        // 지하철 노선 - 검색
        this.KEY_KLASS_SUBWAY_LINE_FOR_SEARCH = "KEY_KLASS_SUBWAY_LINE_FOR_SEARCH";
        // 지하철 역 - 검색
        this.KEY_KLASS_SUBWAY_STATION_FOR_SEARCH = "KEY_KLASS_SUBWAY_STATION_FOR_SEARCH";
        // 수업 요일 - 검색
        this.KEY_KLASS_DAYS_FOR_SEARCH = "KEY_KLASS_DAYS_FOR_SEARCH";
        // 수업 시간 - 검색
        this.KEY_KLASS_TIME_FOR_SEARCH = "KEY_KLASS_TIME_FOR_SEARCH";
        // 수업 카드 위젯 - 낱개의 수업을 표시하는 카드 형태의 위젯. 홈화면과 개인수업 신청 화면등에서 쓰임.
        this.KEY_WIDGET_KLASS_CARD = "KEY_WIDGET_KLASS_CARD";
        this.KEY_CHECKBOX_ALL = "KEY_CHECKBOX_ALL";
        this.KEY_CHECKBOX = "KEY_CHECKBOX";
        this.KEY_PAGE_NUM = "KEY_PAGE_NUM";
        this.KEY_SEARCH_QUERY = "KEY_SEARCH_QUERY";
        // 수업료 내기
        this.KEY_PAYMENT_KLASS_ENROLLMENT = "KEY_PAYMENT_KLASS_ENROLLMENT";
        this.uniqueIdx = 0;
        this.myRegEx = new my_regex_1.MyRegEx();
        this.defaultType = new default_type_1.DefaultType();
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
    // 변경된 내용이 문제가 있을 경우의 처리의 모음. 
    // 여러 컴포넌트에서 공통적으로 사용.
    MyEventService.prototype.onChangeNotValid = function (myEvent) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / onChangedFromChild / init");
        // 입력 내용이 변했습니다. 
        // 하지만 문제가 있는 경우의 처리입니다.
        if (isDebug)
            console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID");
        if (myEvent.hasNotMetaObj()) {
            if (isDebug)
                console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.hasNotMetaObj()");
            // TODO - Error Logger
            return;
        }
        var history = myEvent.searchMetaProp(["history"]);
        if (isDebug)
            console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / history : ", history);
        if (null == history) {
            if (isDebug)
                console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / history is not valid!");
            // TODO - Error Logger
            return;
        }
        var key = myEvent.searchMetaProp(["history", "key"]);
        if (isDebug)
            console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / key : ", key);
        if (null == key || "" == key) {
            if (isDebug)
                console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / key is not valid!");
            // TODO - Error Logger
            return;
        }
        var value = myEvent.searchMetaProp(["history", "value"]);
        if (isDebug)
            console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / value : ", value);
        if (null == key || "" == key) {
            if (isDebug)
                console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / value is not valid!");
            // TODO - Error Logger
            return;
        }
        var view = myEvent.searchMetaProp(["view"]);
        if (isDebug)
            console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / view : ", view);
        if (null == view) {
            if (isDebug)
                console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / view is not valid!");
            // TODO - Error Logger
            return;
        }
        // history 객체로 분석, 처리합니다.
        if (myEvent.hasKey(this.KEY_USER_NAME)) {
            if (isDebug)
                console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NAME");
            if ("regexInclude" === key) {
                if (isDebug)
                    console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NAME / regexInclude");
                if (myEvent.isSameRegExp(/^[ㄱ-ㅎㅏ-ㅣ가-힣 ]+$/g, value)) {
                    if (isDebug)
                        console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NAME / /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]+/g");
                    view.showTooltipFailWarning(
                    // msg:string
                    "한글만 입력 가능합니다", 
                    // isTimeout:Boolean
                    false); // end if
                } // end if
            }
            else if ("regexExclude" === key) {
                if (isDebug)
                    console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NAME / regexExclude");
                if (myEvent.isSameRegExp(/^ /g, value)) {
                    if (isDebug)
                        console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NAME / /^ /g");
                    view.showTooltipFailWarning(
                    // msg:string
                    "첫글자로 빈칸을 입력하실 수 없습니다", 
                    // isTimeout:Boolean
                    false); // end if
                }
                else if (myEvent.isSameRegExp(/[ ]{2,10}/g, value)) {
                    if (isDebug)
                        console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NAME / /[ ]{2,10}/g");
                    view.showTooltipFailWarning(
                    // msg:string
                    "빈칸을 연속으로 입력하실 수 없습니다.", 
                    // isTimeout:Boolean
                    false); // end if
                } // end if          
            } // end if
        }
        else if (myEvent.hasKey(this.KEY_USER_NICKNAME)) {
            if ("regexInclude" === key) {
                if (isDebug)
                    console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NICKNAME / regexInclude");
                if (myEvent.isSameRegExp(/^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9 ]+$/g, value)) {
                    if (isDebug)
                        console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NICKNAME / /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]+/g");
                    view.showTooltipFailWarning(
                    // msg:string
                    "한글,영문,숫자만 입력 가능합니다", 
                    // isTimeout:Boolean
                    false); // end if
                } // end if
            }
            else if ("regexExclude" === key) {
                if (isDebug)
                    console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NICKNAME / regexExclude");
                if (myEvent.isSameRegExp(/^ /g, value)) {
                    if (isDebug)
                        console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NICKNAME / /^ /g");
                    view.showTooltipFailWarning(
                    // msg:string
                    "첫글자로 빈칸을 입력하실 수 없습니다", 
                    // isTimeout:Boolean
                    false); // end if
                }
                else if (myEvent.isSameRegExp(/[ ]{2,10}/g, value)) {
                    if (isDebug)
                        console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NICKNAME / /[ ]{2,10}/g");
                    view.showTooltipFailWarning(
                    // msg:string
                    "빈칸을 연속으로 입력하실 수 없습니다", 
                    // isTimeout:Boolean
                    false); // end if
                } // end if          
            } // end if
        }
        else if (myEvent.hasKey(this.KEY_USER_EMAIL)) {
            if ("regexInclude" === key) {
                if (myEvent.isSameRegExp(this.myRegEx.EMAIL_REGEX, value)) {
                    if (isDebug)
                        console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NICKNAME / /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]+/g");
                    view.showTooltipFailWarning(
                    // msg:string
                    "정상적인 이메일 주소를 입력해주세요", 
                    // isTimeout:Boolean
                    false); // end if
                } // end if
            } // end if
        } // end if        
    }; // end method
    /*
    public getEventOnReady(eventKey:string, component) :void {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("default / emitEventOnReady / 시작");

        let myEventOnChange:MyEvent =
        this.myEventService.getMyEvent(
          // public eventName:string
          this.myEventService.ON_READY,
          // public key:string
          this.meta.eventKey,
          // public value:string
          "",
          // public metaObj:any
          component,
          // public myChecker:MyChecker
          this.myCheckerService.getFreePassChecker()
        );

        if(isDebug) console.log("default / emitEventOnReady / Done!");

    }
    */
    MyEventService.prototype.getDefaultMetaListMyInfo = function () {
        var defaultMetaList = [
            new default_meta_1.DefaultMeta(
            // public title:string
            "이메일", 
            // public placeholder:string
            "이메일을 입력해주세요", 
            // public eventKey:string
            this.KEY_USER_EMAIL, 
            // public checkerKey:string
            "user_email", 
            // public type:string
            this.defaultType.TYPE_INPUT),
            new default_meta_1.DefaultMeta(
            // public title:string
            "이름", 
            // public placeholder:string
            "이름을 입력해주세요", 
            // public eventKey:string
            this.KEY_USER_NAME, 
            // public checkerKey:string
            "user_name", 
            // public type:string
            this.defaultType.TYPE_INPUT),
            new default_meta_1.DefaultMeta(
            // public title:string
            "닉네임", 
            // public placeholder:string
            "닉네임을 입력해주세요", 
            // public eventKey:string
            this.KEY_USER_NICKNAME, 
            // public checkerKey:string
            "user_nickname", 
            // public type:string
            this.defaultType.TYPE_INPUT)
        ];
        return defaultMetaList;
    };
    MyEventService.prototype.getDefaultMetaListTeacherInfo = function () {
        var defaultMetaList = [
            new default_meta_1.DefaultMeta(
            // public title:string
            "이메일", 
            // public placeholder:string
            "이메일을 입력해주세요", 
            // public eventKey:string
            this.KEY_USER_EMAIL, 
            // public checkerKey:string
            "user_email", 
            // public type:string
            this.defaultType.TYPE_INPUT),
            new default_meta_1.DefaultMeta(
            // public title:string
            "이름", 
            // public placeholder:string
            "이름을 입력해주세요", 
            // public eventKey:string
            this.KEY_USER_NAME, 
            // public checkerKey:string
            "user_name", 
            // public type:string
            this.defaultType.TYPE_INPUT),
            new default_meta_1.DefaultMeta(
            // public title:string
            "닉네임", 
            // public placeholder:string
            "닉네임을 입력해주세요", 
            // public eventKey:string
            this.KEY_USER_NICKNAME, 
            // public checkerKey:string
            "user_nickname", 
            // public type:string
            this.defaultType.TYPE_INPUT),
            new default_meta_1.DefaultMeta(
            // public title:string
            "경력", 
            // public placeholder:string
            "경력을 입력해주세요", 
            // public eventKey:string
            this.KEY_TEACHER_RESUME, 
            // public checkerKey:string
            "teacher_resume", 
            // public type:string
            this.defaultType.TYPE_TEXTAREA),
            new default_meta_1.DefaultMeta(
            // public title:string
            "인사말", 
            // public placeholder:string
            "인사말을 입력해주세요", 
            // public eventKey:string
            this.KEY_TEACHER_GREETING, 
            // public checkerKey:string
            "teacher_greeting", 
            // public type:string
            this.defaultType.TYPE_TEXTAREA)
        ];
        return defaultMetaList;
    };
    MyEventService.prototype.getDefaultMetaListKlassDetail = function () {
        var defaultMetaList = [
            new default_meta_1.DefaultMeta(// 0
            // public title:string
            "수업 제목", 
            // public placeholder:string
            "수업 제목을 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_TITLE, 
            // public checkerKey:string
            "klass_title", 
            // public type:string
            this.defaultType.TYPE_INPUT),
            new default_meta_1.DefaultMeta(// 1
            // public title:string
            "수업 가격", 
            // public placeholder:string
            "수업 가격을 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_PRICE, 
            // public checkerKey:string
            "klass_price", 
            // public type:string
            this.defaultType.TYPE_NUMBER),
            new default_meta_1.DefaultMeta(// 2
            // public title:string
            "수업 시작 시간", 
            // public placeholder:string
            "수업 시작 시간을 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_TIME_BEGIN, 
            // public checkerKey:string
            "klass_time_hhmm", 
            // public type:string
            this.defaultType.TYPE_HHMM),
            new default_meta_1.DefaultMeta(// 3
            // public title:string
            "수업 종료 시간", 
            // public placeholder:string
            "수업 종료 시간을 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_TIME_END, 
            // public checkerKey:string
            "klass_time_hhmm", 
            // public type:string
            this.defaultType.TYPE_HHMM),
            new default_meta_1.DefaultMeta(// 4
            // public title:string
            "수업 시작 날짜", 
            // public placeholder:string
            "수업 시작 날짜를 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_DATE_ENROLLMENT_INPUT, 
            // public checkerKey:string
            "klass_date_begin", 
            // public type:string
            this.defaultType.TYPE_SELECT),
            new default_meta_1.DefaultMeta(// 5
            // public title:string
            "수업 레벨", 
            // public placeholder:string
            "수업 레벨을 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_LEVEL, 
            // public checkerKey:string
            "klass_level", 
            // public type:string
            this.defaultType.TYPE_SELECT),
            new default_meta_1.DefaultMeta(// 6
            // public title:string
            "수업 장소 - 지하철 노선", 
            // public placeholder:string
            "수업 장소 - 지하철 노선을 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_VENUE_SUBWAY_LINE, 
            // public checkerKey:string
            "klass_day", 
            // public type:string
            this.defaultType.TYPE_SELECT),
            new default_meta_1.DefaultMeta(// 7
            // public title:string
            "수업 장소 - 지하철 역", 
            // public placeholder:string
            "수업 장소 - 지하철 역을 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_VENUE_SUBWAY_STATION, 
            // public checkerKey:string
            "klass_day", 
            // public type:string
            this.defaultType.TYPE_SELECT),
            new default_meta_1.DefaultMeta(// 8
            // public title:string
            "수업 요일", 
            // public placeholder:string
            "수업 요일을 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_DAYS, 
            // public checkerKey:string
            "klass_day", 
            // public type:string
            this.defaultType.TYPE_CHECKBOX),
            new default_meta_1.DefaultMeta(// 9
            // public title:string
            "수업 기간", 
            // public placeholder:string
            "수업 기간 - 2주/4주/8주/10주/12주", 
            // public eventKey:string
            this.KEY_KLASS_WEEKS, 
            // public checkerKey:string
            "klass_week", 
            // public type:string
            this.defaultType.TYPE_SELECT),
        ];
        return defaultMetaList;
    };
    MyEventService.prototype.getDefaultMetaListKlassPriceCalculator = function () {
        var defaultMetaList = [
            new default_meta_1.DefaultMeta(// 0
            // public title:string
            "강의료는 얼마인가요?", 
            // public placeholder:string
            "4주당 1인당 강의료를 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_PRICE_CALC_PRICE_FOR_STUDENT, 
            // public checkerKey:string
            "klass_price", 
            // public type:string
            this.defaultType.TYPE_NUMBER),
            new default_meta_1.DefaultMeta(// 1
            // public title:string
            "수수료", 
            // public placeholder:string
            "수수료를 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_PRICE_CALC_COMMISSION, 
            // public checkerKey:string
            "klass_price_calc_commission_str", 
            // public type:string
            this.defaultType.TYPE_INPUT),
            new default_meta_1.DefaultMeta(// 2
            // public title:string
            "1인당 최종 전달 금액", 
            // public placeholder:string
            "1인당 최종 전달 금액을 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_PRICE_CALC_PAYMENT_FOR_TEACHER, 
            // public checkerKey:string
            "klass_price_calc_payment_str", 
            // public type:string
            this.defaultType.TYPE_INPUT),
            new default_meta_1.DefaultMeta(// 3
            // public title:string
            "몇 명까지 참석 가능한가요?", 
            // public placeholder:string
            "수업 학생수를 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_PRICE_CALC_STUDENT_NUMBER, 
            // public checkerKey:string
            "klass_student_cnt", 
            // public type:string
            this.defaultType.TYPE_NUMBER),
            new default_meta_1.DefaultMeta(// 4
            // public title:string
            "최대 인원시 전달 금액", 
            // public placeholder:string
            "최대 인원시 전달 금액을 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_PRICE_CALC_TOTAL, 
            // public checkerKey:string
            "klass_price_calc_payment_str", 
            // public type:string
            this.defaultType.TYPE_INPUT),
            new default_meta_1.DefaultMeta(// 5
            // public title:string
            "수업은 몇 주간 진행되나요?", 
            // public placeholder:string
            "수업 주수를 입력해주세요", 
            // public eventKey:string
            this.KEY_KLASS_PRICE_CALC_WEEK, 
            // public checkerKey:string
            "klass_week", 
            // public type:string
            this.defaultType.TYPE_SELECT),
        ];
        return defaultMetaList;
    };
    MyEventService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyEventService);
    return MyEventService;
}());
exports.MyEventService = MyEventService;
//# sourceMappingURL=my-event.service.js.map