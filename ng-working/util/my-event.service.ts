import { Injectable }             from '@angular/core';
import { MyEvent }             from './model/my-event';

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
    ON_REMOVE_ROW:string="ON_REMOVE_ROW";

    // SPECIFIC CASES
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

    constructor() {
    }

    // @ Deprecated
    has_it(event_name:string) :boolean {

        if (    this.ON_CHANGE_KLASS_DISCOUNT === event_name ||
                this.ON_CHANGE_KLASS_PRICE === event_name ||
                this.ON_CHANGE_KLASS_TIME === event_name ||
                this.ON_CHANGE_KLASS_DATE === event_name ||
                this.ON_CHANGE_KLASS_LEVEL === event_name ||
                this.ON_CHANGE_KLASS_ENROLMENT_INTERVAL === event_name ||
                this.ON_CHANGE_KLASS_WEEKS_MIN === event_name ||
                this.ON_CHANGE_KLASS_WEEKS_MAX === event_name ||
                this.ON_CHANGE_KLASS_DATE_BEGIN === event_name ) {

            return true;
        }
        return false;
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


}
