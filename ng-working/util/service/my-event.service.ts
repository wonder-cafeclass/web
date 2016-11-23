import { Injectable }             from '@angular/core';
import { MyEvent }                from '../model/my-event';
import { MyChecker }              from '../model/my-checker';

@Injectable()
export class MyEventService {

    // 부모 자식간의 컴포넌트 통신시 어떤 이벤트가 발생했는지 정의하는 서비스 객체.

    // GENERAL PURPOSE
    ANY:string="ANY"; // 어떤 형태의 이벤트로도 변경 가능한 타입. 복제해서 사용하는 것을 권장.
    ON_READY:string="ON_READY";
    ON_CHANGE:string="ON_CHANGE";
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

    KEY_USER_EMAIL:string="KEY_USER_EMAIL";   // 유저 - 이메일주소

    private uniqueIdx:number=0;

    constructor() {
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


}
