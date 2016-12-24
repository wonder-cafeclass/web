import { Injectable }             from '@angular/core';
import { MyEvent }                from '../model/my-event';
import { MyChecker }              from '../model/my-checker';
import { MyRegEx }                from '../model/my-regex';

import { DefaultComponent }       from '../../widget/input/default/default.component';
import { DefaultMeta }            from '../../widget/input/default/model/default-meta';
import { DefaultType }            from '../../widget/input/default/model/default-type';

@Injectable()
export class MyEventService {

    // 부모 자식간의 컴포넌트 통신시 어떤 이벤트가 발생했는지 정의하는 서비스 객체.

    // GENERAL PURPOSE
    ANY:string="ANY"; // 어떤 형태의 이벤트로도 변경 가능한 타입. 복제해서 사용하는 것을 권장.
    ON_READY:string="ON_READY";
    ON_CHANGE:string="ON_CHANGE";
    ON_CHANGE_NOT_VALID:string="ON_CHANGE_NOT_VALID";
    ON_SUBMIT:string="ON_SUBMIT";
    ON_KEYUP_ENTER:string="ON_KEYUP_ENTER";
    ON_SHUTDOWN:string="ON_SHUTDOWN";
    ON_SHUTDOWN_N_ROLLBACK:string="ON_SHUTDOWN_N_ROLLBACK";
    ON_SAVE:string="ON_SAVE";
    ON_ADD_ROW:string="ON_ADD_ROW";
    ON_ADD_COMMENT:string="ON_ADD_COMMENT";
    ON_ADD_COMMENT_REPLY:string="ON_ADD_COMMENT_REPLY";
    ON_REMOVE_ROW:string="ON_REMOVE_ROW";
    ON_MOUSE_LEAVE:string="ON_MOUSE_LEAVE";
    ON_MOUSE_ENTER:string="ON_MOUSE_ENTER";
    ON_PREVIEW:string="ON_PREVIEW";
    ON_UNPREVIEW:string="ON_UNPREVIEW";
    ON_DONE:string="ON_DONE";
    ON_LOGIN_REQUIRED:string="ON_LOGIN_REQUIRED";

    // SPECIFIC ATTR
    KLASS_WEEK_MAX:string="KLASS_WEEK_MAX";
    KLASS_ENROLMENT_INTERVAL:string="KLASS_ENROLMENT_INTERVAL";

    KLASS_DAYS:string="KLASS_DAYS";             // 수업요일
    KLASS_DAYS_SUNDAY:string="sun";             // 수업요일 - 일요일
    KLASS_DAYS_MONDAY:string="mon";             // 수업요일 - 월요일
    KLASS_DAYS_TUESDAY:string="tue";            // 수업요일 - 화요일
    KLASS_DAYS_WEDNESDAY:string="wed";          // 수업요일 - 수요일
    KLASS_DAYS_THURSDAY:string="thu";           // 수업요일 - 목요일
    KLASS_DAYS_FRIDAY:string="fri";             // 수업요일 - 금요일
    KLASS_DAYS_SATURDAY:string="sat";           // 수업요일 - 토요일

    KLASS_SCHEDULE:string="KLASS_SCHEDULE";     // 수업일정
    KLASS_TITLE:string="KLASS_TITLE";           // 수업이름
    KLASS_FEATURE:string="KLASS_FEATURE";       // 수업특징
    KLASS_TARGET:string="KLASS_TARGET";         // 수업대상
    KLASS_DESC:string="KLASS_DESC";             // 수업소개
    KLASS_VENUE:string="KLASS_VENUE";           // 장소
    KLASS_TIME_BEGIN:string="KLASS_TIME_BEGIN"; // 수업시작시간
    KLASS_TIME_END:string="KLASS_TIME_END";     // 수업종료시간

    TEACHER_DESC:string="TEACHER_DESC";         // 강사소개
    TEACHER_RESUME:string="TEACHER_RESUME";     // 강사이력소개
    TEACHER_GREETING:string="TEACHER_GREETING"; // 강사인사말
    
    STUDENT_REVIEW:string="STUDENT_REVIEW";     // 리뷰
    STUDENT_QUESTION:string="STUDENT_QUESTION"; // 문의
    CAUTION:string="CAUTION";                   // 유의사항

    // Widget
    KEY_IMAGE_GRID:string="KEY_IMAGE_GRID";               // Widget - image grid
    KEY_IMAGE_ENTRY:string="KEY_IMAGE_ENTRY";             // Widget - image entry

    KEY_SEARCH_LIST:string="KEY_SEARCH_LIST";             // 검색시, 결과가 리스트에 노출됨.
    KEY_SMART_EDITOR:string="KEY_SMART_EDITOR";           // 네이버 스마트에디터
    KEY_INPUTS_BTNS_ROWS:string="KEY_INPUTS_BTNS_ROWS";   // 여러개의 열이 있는 입력창
    KEY_INPUT_BTNS_ROW:string="KEY_INPUT_BTNS_ROW";       // 여러개 버튼과 1개의 INPUT이 있는 입력창
    KEY_INPUT_ROW:string="KEY_INPUT_ROW";                 // 입력창만 있는 열
    KEY_SINGLE_INPUT_VIEW:string="KEY_SINGLE_INPUT_VIEW"; // ?
    KEY_MINI_CALENDAR:string="KEY_MINI_CALENDAR";         // 날짜를 한눈에 확인하는 미니 캘린더
    KEY_DRON_LIST:string="KEY_DRON_LIST";                 // 화면 구석에 노출, 스크롤에도 움직이지 않아요.
    KEY_COMMENT:string="KEY_COMMENT";                     // 댓글 리스트
    KEY_COMMENT_REVIEW:string="KEY_COMMENT_REVIEW";       // 댓글 - 수업 리뷰 리스트
    KEY_COMMENT_QUESTION:string="KEY_COMMENT_QUESTION";   // 댓글 - 수업 문의 리스트

    KEY_USER_EMAIL:string="KEY_USER_EMAIL";               // 유저 - 이메일주소
    KEY_USER_CUR_PASSWORD:string="KEY_USER_CUR_PASSWORD"; // 유저 - 현재 유저의 비밀번호
    KEY_USER_PASSWORD:string="KEY_USER_PASSWORD";         // 유저 - 비밀번호
    KEY_USER_RE_PASSWORD:string="KEY_USER_RE_PASSWORD";   // 유저 - 확인을 위해 다시 입력한 비밀번호
    KEY_USER_NEW_PASSWORD:string="KEY_USER_NEW_PASSWORD"; // 유저 - 새로운 비밀번호
    
    KEY_USER_NAME:string="KEY_USER_NAME";                 // 유저 - 이름
    KEY_USER_NICKNAME:string="KEY_USER_NICKNAME";         // 유저 - 닉네임
    KEY_USER_THUMBNAIL:string="KEY_USER_THUMBNAIL";       // 유저 - 150x150 섬네일

    KEY_USER_MOBILE_NUM_HEAD:string="KEY_USER_MOBILE_NUM_HEAD"; // 유저 - 휴대전화 앞 3자리 010,011,019...
    KEY_USER_MOBILE_NUM_BODY:string="KEY_USER_MOBILE_NUM_BODY"; // 유저 - 휴대전화 두번째 3~4자리 
    KEY_USER_MOBILE_NUM_TAIL:string="KEY_USER_MOBILE_NUM_TAIL"; // 유저 - 휴대전화 마지막 4자리 

    KEY_USER_GENDER:string="KEY_USER_GENDER";             // 유저 - 성별

    KEY_USER_BIRTH_YEAR:string="KEY_USER_BIRTH_YEAR";     // 유저 - 생년
    KEY_USER_BIRTH_MONTH:string="KEY_USER_BIRTH_MONTH";   // 유저 - 생월
    KEY_USER_BIRTH_DAY:string="KEY_USER_BIRTH_DAY";       // 유저 - 생일

    KEY_USER_MY_INFO:string="KEY_USER_MY_INFO";           // 유저 - 내정보 수정.
    KEY_USER_MY_HISTORY:string="KEY_USER_MY_HISTORY";     // 유저 - 내 수강이력.
    KEY_USER_MY_PAYMENT:string="KEY_USER_MY_PAYMENT";     // 유저 - 내 결재정보.
    KEY_USER_MY_FAVORITE:string="KEY_USER_MY_FAVORITE";   // 유저 - 내 관심강의(찜).

    KEY_TEACHER_MY_INFO:string="KEY_TEACHER_MY_INFO";           // 선생님 - 내정보 수정.
    KEY_TEACHER_MY_HISTORY:string="KEY_TEACHER_MY_HISTORY";     // 선생님 - 내 수강이력.
    KEY_TEACHER_MY_PAYMENT:string="KEY_TEACHER_MY_PAYMENT";     // 선생님 - 내 결재정보.
    KEY_TEACHER_MY_FEEDBACK:string="KEY_TEACHER_MY_FEEDBACK";   // 선생님 - 학생에게준 피드백.

    KEY_TEACHER_RESUME:string="KEY_TEACHER_RESUME";             // 선생님 - 경력
    KEY_TEACHER_GREETING:string="KEY_TEACHER_GREETING";         // 선생님 - 인사말

    KEY_KLASS_TITLE:string="KEY_KLASS_TITLE";                   // 수업 - 수업 이름
    KEY_KLASS_PRICE:string="KEY_KLASS_PRICE";                   // 수업 - 수업 가격
    KEY_KLASS_PRICE_VIEW:string="KEY_KLASS_PRICE_VIEW";         // 수업 - 수업 가격 뷰
    KEY_KLASS_TIME_BEGIN:string="KEY_KLASS_TIME_BEGIN";         // 수업 - 수업 시작 시간
    KEY_KLASS_TIME_END:string="KEY_KLASS_TIME_END";             // 수업 - 수업 종료 시간
    KEY_KLASS_WEEKS:string="KEY_KLASS_WEEKS";                   // 수업 - 수업 기간 (몇주?)
    KEY_KLASS_DATE_ENROLLMENT:string="KEY_KLASS_DATE_ENROLLMENT";              // 수업 - 등록 가능한 수업 시작일
    KEY_KLASS_DATE_ENROLLMENT_VIEW:string="KEY_KLASS_DATE_ENROLLMENT_VIEW";    // 수업 - 등록 가능한 수업 시작일
    KEY_KLASS_DATE_ENROLLMENT_INPUT:string="KEY_KLASS_DATE_ENROLLMENT_INPUT";  // 수업 - 등록 가능한 수업 시작일
    KEY_KLASS_DAYS:string="KEY_KLASS_DAYS";                     // 수업 - 수업이 있는 요일
    KEY_KLASS_POSTER:string="KEY_KLASS_POSTER";                 // 수업 - 포스터 이미지
    KEY_KLASS_BANNER_VIEW:string="KEY_KLASS_BANNER_VIEW";                 // 수업 - 배너 이미지
    // 수업 - 배너 이미지
    KEY_KLASS_BANNER:string="KEY_KLASS_BANNER";
    // 수업 - 레벨 이미지
    KEY_KLASS_LEVEL:string="KEY_KLASS_LEVEL";
    // 수업 - 지하철 노선
    KEY_KLASS_VENUE_SUBWAY_LINE:string="KEY_KLASS_VENUE_SUBWAY_LINE";
    // 수업 - 지하철 노선
    KEY_KLASS_VENUE_SUBWAY_STATION:string="KEY_KLASS_VENUE_SUBWAY_STATION";
    // 수업 - 장소, 레벨, 요일, 시간
    KEY_KLASS_SELECTILE_VIEW:string="KEY_KLASS_SELECTILE_VIEW";
    // 수업 - 장소, 레벨, 요일, 시간
    KEY_KLASS_SELECTILE:string="KEY_KLASS_SELECTILE";
    // 수업 - 수업 상세 내용 리스트
    KEY_KLASS_DETAIL_NAV_LIST:string="KEY_KLASS_DETAIL_NAV_LIST";
    // 수업 - 수업 상세 내용 - 지도(네이버)
    KEY_KLASS_DETAIL_NAV_VENUE_MAP:string="KEY_KLASS_DETAIL_NAV_VENUE_MAP";
    // 수업 - 수업 선생님 리스트
    KEY_KLASS_TEACHER_LIST:string="KEY_KLASS_TEACHER_LIST";
    // 수업 - 수업 관련 질문 리스트
    KEY_KLASS_QUESTION_LIST:string="KEY_KLASS_QUESTION_LIST";
    // 수업 - 수업 관련 리뷰 리스트
    KEY_KLASS_REVIEW_LIST:string="KEY_KLASS_REVIEW_LIST";
    // 수업 - 선생님 - 경력 리스트
    KEY_KLASS_TEACHER_RESUME_LIST:string="KEY_KLASS_TEACHER_RESUME_LIST";
    // 수업 - 선생님 - 인사말 리스트
    KEY_KLASS_TEACHER_GREETING_LIST:string="KEY_KLASS_TEACHER_GREETING_LIST";
    // 수업 - 수업 특징 리스트
    KEY_KLASS_FEATURE_LIST:string="KEY_KLASS_FEATURE_LIST";
    // 수업 - 수업 대상 리스트
    KEY_KLASS_TARGET_LIST:string="KEY_KLASS_TARGET_LIST";
    // 수업 - 수업 일정
    KEY_KLASS_SCHEDULE:string="KEY_KLASS_SCHEDULE";



    private uniqueIdx:number=0;
    private myRegEx:MyRegEx;
    private defaultType:DefaultType;

    constructor() {
        this.myRegEx = new MyRegEx();
        this.defaultType = new DefaultType();
    }

    // @ Deprecated
    has_it(event_name:string) :boolean {
        return true;
    }

    // @ Deprecated
    is_it(target_event_name:string, event_name:string) :boolean{

        if(!this.has_it(target_event_name)) {
            return false;            
        }
        if(!this.has_it(event_name)) {
            return false;            
        }
        if(target_event_name === event_name) {
            return true;
        }

        return false;
    }

    public getCopyEventList(myEventList:MyEvent[]) :MyEvent[] {

        let copyList:MyEvent[] = [];
        for (var i = 0; i < myEventList.length; ++i) {
          let myEvent = myEventList[i];
          let myEventCopy = myEvent.copy();

          copyList.push(myEventCopy);
        }

        return copyList;
    }

    public isSameEventLists(firstList:MyEvent[],secondList:MyEvent[]) :boolean {

        if(null == firstList || 0 === firstList.length) {
          return false;
        }
        if(null == secondList || 0 === secondList.length) {
          return false;
        }
        if(firstList.length !== secondList.length) {
          return false;
        }

        for (var i = 0; i < firstList.length; ++i) {
          let firstMyEvent:MyEvent = firstList[i];
          let secondMyEvent:MyEvent = secondList[i];

          let isSame = firstMyEvent.isSame(secondMyEvent);
          if(!isSame) {
            return false;
          }
        }

        return true;
    } 

    public getChangedFromList(firstList:MyEvent[],secondList:MyEvent[]) :MyEvent[] {

        if(null == firstList || 0 === firstList.length) {
            return null;
        }
        if(null == secondList || 0 === secondList.length) {
            return null;
        }
        if(firstList.length !== secondList.length) {
            return null;
        }

        for (var i = 0; i < firstList.length; ++i) {
            let firstMyEvent:MyEvent = firstList[i];
            let secondMyEvent:MyEvent = secondList[i];

            let isSameValue = firstMyEvent.isSameValue(secondMyEvent);
            if(!isSameValue) {
                return [firstMyEvent, secondMyEvent];
            }
        }

        return null;
    }

    public hasChangedList(firstList:MyEvent[],secondList:MyEvent[]) :boolean {
        return this.isNotSameValueEventLists(firstList, secondList);        
    }

    public isNotSameValueEventLists(firstList:MyEvent[],secondList:MyEvent[]) :boolean {
        return !this.isSameValueEventLists(firstList, secondList);
    }
    public isSameValueEventLists(firstList:MyEvent[],secondList:MyEvent[]) :boolean {

        if(null == firstList || 0 === firstList.length) {
          return false;
        }
        if(null == secondList || 0 === secondList.length) {
          return false;
        }
        if(firstList.length !== secondList.length) {
          return false;
        }

        for (var i = 0; i < firstList.length; ++i) {
          let firstMyEvent:MyEvent = firstList[i];
          let secondMyEvent:MyEvent = secondList[i];

          let isSameValue = firstMyEvent.isSameValue(secondMyEvent);
          if(!isSameValue) {
            return false;
          }
        }

        return true;
    }      

    public setEventValue(myEvent:MyEvent, myEventList:MyEvent[]) :MyEvent[] {
        for (var i = 0; i < myEventList.length; ++i) {
            let myEventNext = myEventList[i];
            if(myEvent.isSame(myEventNext)) {
                myEventNext.value = myEvent.value;
            }
        }

        return myEventList;
    }

    public getUniqueIdx() {
        return this.uniqueIdx++;
    }

    // 각 MyEvent 객체가 자신만의 id를 가져야 하는 경우 사용합니다.
    // 추가/삭제가 가능한 MyEventList를 제어해야 할 경우 사용합니다.
    public getMyEvent(eventName:string, key:string, value:string, metaObj:any, myChecker:MyChecker) :MyEvent{

        let uniqueId:number = this.getUniqueIdx();
        let myEvent:MyEvent = 
        new MyEvent(uniqueId,eventName,key,value,metaObj,myChecker);

        return myEvent;
    }

    // 변경된 내용이 문제가 있을 경우의 처리의 모음. 
    // 여러 컴포넌트에서 공통적으로 사용.
    public onChangeNotValid(myEvent:MyEvent) :void {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("my-info / onChangedFromChild / init");


        // 입력 내용이 변했습니다. 
        // 하지만 문제가 있는 경우의 처리입니다.

        if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID");

        if(myEvent.hasNotMetaObj()) {
            if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.hasNotMetaObj()");
            // TODO - Error Logger
            return;
        }

        let history = myEvent.searchMetaProp(["history"]);
        if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / history : ",history);
        if(null == history) {
            if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / history is not valid!");
            // TODO - Error Logger
            return;
        }

        let key:string = myEvent.searchMetaProp(["history","key"]);
        if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / key : ",key);
        if(null == key || "" == key) {
            if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / key is not valid!");
            // TODO - Error Logger
            return;
        }

        let value:string = myEvent.searchMetaProp(["history","value"]);
        if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / value : ",value);
        if(null == key || "" == key) {
            if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / value is not valid!");
            // TODO - Error Logger
            return;
        }

        let view:DefaultComponent = myEvent.searchMetaProp(["view"]);
        if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / view : ",view);
        if(null == view) {
            if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / view is not valid!");
            // TODO - Error Logger
            return;
        }

        // history 객체로 분석, 처리합니다.
        if(myEvent.hasKey(this.KEY_USER_NAME)) {

            if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NAME");

            if("regexInclude" === key) {

                if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NAME / regexInclude");

                if(myEvent.isSameRegExp(/^[ㄱ-ㅎㅏ-ㅣ가-힣 ]+$/g, value)) {
                    if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NAME / /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]+/g");
                        view.showTooltipFailWarning(
                        // msg:string
                        "한글만 입력 가능합니다",
                        // isTimeout:Boolean
                        false
                    ); // end if
                } // end if
              
            } else if("regexExclude" === key) {

                if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NAME / regexExclude");

                if(myEvent.isSameRegExp(/^ /g, value)) {

                    if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NAME / /^ /g");
                    view.showTooltipFailWarning(
                        // msg:string
                        "첫글자로 빈칸을 입력하실 수 없습니다",
                        // isTimeout:Boolean
                        false
                    ); // end if

                } else if(myEvent.isSameRegExp(/[ ]{2,10}/g, value)) {

                    if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NAME / /[ ]{2,10}/g");
                    view.showTooltipFailWarning(
                        // msg:string
                        "빈칸을 연속으로 입력하실 수 없습니다.",
                        // isTimeout:Boolean
                        false
                    ); // end if

                } // end if          

            } // end if

        } else if(myEvent.hasKey(this.KEY_USER_NICKNAME)) {

            if("regexInclude" === key) {

                if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NICKNAME / regexInclude");

                if(myEvent.isSameRegExp(/^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9 ]+$/g, value)) {
                    if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NICKNAME / /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]+/g");
                        view.showTooltipFailWarning(
                        // msg:string
                        "한글,영문,숫자만 입력 가능합니다",
                        // isTimeout:Boolean
                        false
                    ); // end if
                } // end if
              
            } else if("regexExclude" === key) {

                if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NICKNAME / regexExclude");

                if(myEvent.isSameRegExp(/^ /g, value)) {

                    if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NICKNAME / /^ /g");
                    view.showTooltipFailWarning(
                        // msg:string
                        "첫글자로 빈칸을 입력하실 수 없습니다",
                        // isTimeout:Boolean
                        false
                    ); // end if

                } else if(myEvent.isSameRegExp(/[ ]{2,10}/g, value)) {

                    if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NICKNAME / /[ ]{2,10}/g");
                    view.showTooltipFailWarning(
                        // msg:string
                        "빈칸을 연속으로 입력하실 수 없습니다",
                        // isTimeout:Boolean
                        false
                    ); // end if

                } // end if          

            } // end if

        } else if(myEvent.hasKey(this.KEY_USER_EMAIL)) {

            if("regexInclude" === key) {

                if(myEvent.isSameRegExp(this.myRegEx.EMAIL_REGEX, value)) {
                    if(isDebug) console.log("my-event.service / onChangedFromChild / ON_CHANGE_NOT_VALID / KEY_USER_NICKNAME / /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]+/g");
                        view.showTooltipFailWarning(
                        // msg:string
                        "정상적인 이메일 주소를 입력해주세요",
                        // isTimeout:Boolean
                        false
                    ); // end if
                } // end if

            } // end if

        } // end if        

    } // end method

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

    public getDefaultMetaListMyInfo() :DefaultMeta[] {

        let defaultMetaList:DefaultMeta[] = 
        [
          new DefaultMeta(
            // public title:string
            "이메일",
            // public placeholder:string
            "이메일을 입력해주세요",
            // public eventKey:string
            this.KEY_USER_EMAIL,
            // public checkerKey:string
            "user_email",
            // public type:string
            this.defaultType.TYPE_INPUT
          ),
          new DefaultMeta(
            // public title:string
            "이름",
            // public placeholder:string
            "이름을 입력해주세요",
            // public eventKey:string
            this.KEY_USER_NAME,
            // public checkerKey:string
            "user_name",
            // public type:string
            this.defaultType.TYPE_INPUT
          ),
          new DefaultMeta(
            // public title:string
            "닉네임",
            // public placeholder:string
            "닉네임을 입력해주세요",
            // public eventKey:string
            this.KEY_USER_NICKNAME,
            // public checkerKey:string
            "user_nickname",
            // public type:string
            this.defaultType.TYPE_INPUT
          )
        ];        

        return defaultMetaList;
    }

    public getDefaultMetaListApplyTeacher() :DefaultMeta[] {

        let defaultMetaList:DefaultMeta[] = 
        [
          new DefaultMeta(
            // public title:string
            "이메일",
            // public placeholder:string
            "이메일을 입력해주세요",
            // public eventKey:string
            this.KEY_USER_EMAIL,
            // public checkerKey:string
            "user_email",
            // public type:string
            this.defaultType.TYPE_INPUT
          ),
          new DefaultMeta(
            // public title:string
            "이름",
            // public placeholder:string
            "이름을 입력해주세요",
            // public eventKey:string
            this.KEY_USER_NAME,
            // public checkerKey:string
            "user_name",
            // public type:string
            this.defaultType.TYPE_INPUT
          ),
          new DefaultMeta(
            // public title:string
            "닉네임",
            // public placeholder:string
            "닉네임을 입력해주세요",
            // public eventKey:string
            this.KEY_USER_NICKNAME,
            // public checkerKey:string
            "user_nickname",
            // public type:string
            this.defaultType.TYPE_INPUT
          ),
          new DefaultMeta(
            // public title:string
            "경력",
            // public placeholder:string
            "경력을 입력해주세요",
            // public eventKey:string
            this.KEY_TEACHER_RESUME,
            // public checkerKey:string
            "teacher_resume",
            // public type:string
            this.defaultType.TYPE_TEXTAREA
          ),
          new DefaultMeta(
            // public title:string
            "인사말",
            // public placeholder:string
            "인사말을 입력해주세요",
            // public eventKey:string
            this.KEY_TEACHER_GREETING,
            // public checkerKey:string
            "teacher_greeting",
            // public type:string
            this.defaultType.TYPE_TEXTAREA
          )
        ];        

        return defaultMetaList;
    }

    public getDefaultMetaListKlassDetail() :DefaultMeta[] {

        let defaultMetaList:DefaultMeta[] = 
        [
            new DefaultMeta( // 0
            // public title:string
            "수업 제목",
            // public placeholder:string
            "수업 제목을 입력해주세요",
            // public eventKey:string
            this.KEY_KLASS_TITLE,
            // public checkerKey:string
            "klass_title",
            // public type:string
            this.defaultType.TYPE_INPUT
            ),
            new DefaultMeta( // 1
            // public title:string
            "수업 가격",
            // public placeholder:string
            "수업 가격을 입력해주세요",
            // public eventKey:string
            this.KEY_KLASS_PRICE,
            // public checkerKey:string
            "klass_price",
            // public type:string
            this.defaultType.TYPE_NUMBER
            ),
            new DefaultMeta( // 2
            // public title:string
            "수업 시작 시간",
            // public placeholder:string
            "수업 시작 시간을 입력해주세요",
            // public eventKey:string
            this.KEY_KLASS_TIME_BEGIN,
            // public checkerKey:string
            "klass_time_hhmm",
            // public type:string
            this.defaultType.TYPE_HHMM
            ),
            new DefaultMeta( // 3
            // public title:string
            "수업 종료 시간",
            // public placeholder:string
            "수업 종료 시간을 입력해주세요",
            // public eventKey:string
            this.KEY_KLASS_TIME_END,
            // public checkerKey:string
            "klass_time_hhmm",
            // public type:string
            this.defaultType.TYPE_HHMM
            ),
            new DefaultMeta( // 4
            // public title:string
            "수업 시작 날짜",
            // public placeholder:string
            "수업 시작 날짜를 입력해주세요",
            // public eventKey:string
            this.KEY_KLASS_DATE_ENROLLMENT_INPUT,
            // public checkerKey:string
            "klass_date_begin",
            // public type:string
            this.defaultType.TYPE_SELECT
            ),
            new DefaultMeta( // 5
            // public title:string
            "수업 레벨",
            // public placeholder:string
            "수업 레벨을 입력해주세요",
            // public eventKey:string
            this.KEY_KLASS_LEVEL,
            // public checkerKey:string
            "klass_level",
            // public type:string
            this.defaultType.TYPE_SELECT
            ),
            new DefaultMeta( // 6
            // public title:string
            "수업 장소 - 지하철 노선",
            // public placeholder:string
            "수업 장소 - 지하철 노선을 입력해주세요",
            // public eventKey:string
            this.KEY_KLASS_VENUE_SUBWAY_LINE,
            // public checkerKey:string
            "klass_day",
            // public type:string
            this.defaultType.TYPE_SELECT
            ),            
            new DefaultMeta( // 7
            // public title:string
            "수업 장소 - 지하철 역",
            // public placeholder:string
            "수업 장소 - 지하철 역을 입력해주세요",
            // public eventKey:string
            this.KEY_KLASS_VENUE_SUBWAY_STATION,
            // public checkerKey:string
            "klass_day",
            // public type:string
            this.defaultType.TYPE_SELECT
            ),
            new DefaultMeta( // 8
            // public title:string
            "수업 요일",
            // public placeholder:string
            "수업 요일을 입력해주세요",
            // public eventKey:string
            this.KEY_KLASS_DAYS,
            // public checkerKey:string
            "klass_day",
            // public type:string
            this.defaultType.TYPE_CHECKBOX
            ),
            new DefaultMeta( // 9
            // public title:string
            "수업 기간",
            // public placeholder:string
            "수업 기간 - 2주/4주/8주/10주/12주",
            // public eventKey:string
            this.KEY_KLASS_WEEKS,
            // public checkerKey:string
            "klass_week",
            // public type:string
            this.defaultType.TYPE_SELECT
            ),

        ];
        
        return defaultMetaList;
    }        


}
