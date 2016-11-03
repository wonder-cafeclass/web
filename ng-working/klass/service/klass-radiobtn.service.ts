import { Injectable }        from '@angular/core';
import { MyEventService }    from '../../util/my-event.service';
import { MyEvent }           from '../../util/model/my-event';
import { RadioBtnOption }    from '../../widget/radiobtn/model/radiobtn-option';
import { Klass }             from '../model/klass';

@Injectable()
export class KlassRadioBtnService {

    // 카페 클래스에서 사용하는 대표적인 체크박스 설정값 - week_min,week_max,...
    constructor(private myEventService:MyEventService) {}

    /*
    *    @ Desc : 유저가 몇주(weeks) 수강하려는 결정을 도와주는 체크박스 데이터
    */
    getKlassEnrolmentWeeks(klass:Klass) :RadioBtnOption[] {

        let optionList:RadioBtnOption[] = [
            new RadioBtnOption(
                // public myEvent:MyEvent
                new MyEvent(
                    // public eventName:string
                    this.myEventService.ON_CHANGE_KLASS_ENROLMENT_WEEKS,
                    // public title:string
                    "4주",
                    // public key:string
                    "week_max",
                    // public value:string
                    "4",
                    // public metaObj:any
                    klass
                ),
                // public isFocus:boolean
                false
            ),

            new RadioBtnOption(
                // public myEvent:MyEvent
                new MyEvent(
                    // public eventName:string
                    this.myEventService.ON_CHANGE_KLASS_ENROLMENT_WEEKS,
                    // public title:string
                    "8주",
                    // public key:string
                    "week_max",
                    // public value:string
                    "8",
                    // public metaObj:any
                    klass
                ),
                // public isFocus:boolean
                false
            ),

            new RadioBtnOption(
                // public myEvent:MyEvent
                new MyEvent(
                    // public eventName:string
                    this.myEventService.ON_CHANGE_KLASS_ENROLMENT_WEEKS,
                    // public title:string
                    "12주",
                    // public key:string
                    "week_max",
                    // public value:string
                    "12",
                    // public metaObj:any
                    klass
                ),
                // public isFocus:boolean
                false
            )
        ];

        for (var i = 0; i < optionList.length; ++i) {
          let option:RadioBtnOption = optionList[i];

          if(+klass.week_min == +option.myEvent.value) {
            option.isFocus = true;    
            optionList[i] = option;
            break;
          }
        }

        return optionList;
    }

    /*
    *    @ Desc : 유저가 다음 수업에 참여할 수 있는 주(weeks) 간격에 대한 체크박스 데이터.
    */
    getKlassEnrolmentInterval(klass:Klass, valueFocus:string) :RadioBtnOption[] {

        let optionList:RadioBtnOption[] = [
          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL,
              // public title:string
              "4주마다",
              // public key:string
              "enrollment_interval_week",
              // public value:string
              "4",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          ),

          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL,
              // public title:string
              "2주마다",
              // public key:string
              "enrollment_interval_week",
              // public value:string
              "2",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          ),

          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL,
              // public title:string
              "매주마다",
              // public key:string
              "enrollment_interval_week",
              // public value:string
              "1",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          )      
        ];   

        if(null != valueFocus && "" != valueFocus) {
            for (var i = 0; i < optionList.length; ++i) {
                let option:RadioBtnOption = optionList[i];

                if(option.myEvent.value === valueFocus) {
                    option.isFocus = true;    
                    optionList[i] = option;
                }
            }
        }

        return optionList;

    }

    /*
    *    @ Desc : 가장 짧은 수강 기간에 대한 체크박스 데이터.
    */
    getKlassWeeksMin(klass:Klass, valueFocus:string) :RadioBtnOption[] {

        let optionList:RadioBtnOption[] = [
          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_KLASS_WEEKS_MIN,
              // public title:string
              "4주",
              // public key:string
              "week_min",
              // public value:string
              "4",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          ),

          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_KLASS_WEEKS_MIN,
              // public title:string
              "8주",
              // public key:string
              "week_min",
              // public value:string
              "8",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          ),

          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_KLASS_WEEKS_MIN,
              // public title:string
              "12주",
              // public key:string
              "week_min",
              // public value:string
              "12",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          )       
        ]; 

        if(null != valueFocus && "" != valueFocus) {
            for (var i = 0; i < optionList.length; ++i) {
                let option:RadioBtnOption = optionList[i];

                if(option.myEvent.value === valueFocus) {
                    option.isFocus = true;    
                    optionList[i] = option;
                }
            }
        }

        return optionList;
    }

    /*
    *    @ Desc : 가장 긴 수강 기간에 대한 체크박스 데이터.
    */
    getKlassWeeksMax(klass:Klass, valueFocus:string) :RadioBtnOption[] {

        let optionList:RadioBtnOption[] = [
          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_KLASS_WEEKS_MIN,
              // public title:string
              "4주",
              // public key:string
              "week_min",
              // public value:string
              "4",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          ),

          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_KLASS_WEEKS_MIN,
              // public title:string
              "8주",
              // public key:string
              "week_min",
              // public value:string
              "8",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          ),

          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_KLASS_WEEKS_MIN,
              // public title:string
              "12주",
              // public key:string
              "week_min",
              // public value:string
              "12",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          )       
        ]; 

        if(null != valueFocus && "" != valueFocus) {
            for (var i = 0; i < optionList.length; ++i) {
                let option:RadioBtnOption = optionList[i];

                if(option.myEvent.value === valueFocus) {
                    option.isFocus = true;    
                    optionList[i] = option;
                }
            }
        }

        return optionList;
    }

    /*
    *    @ Desc : 수업 상세 정보에 대한 Nav tabs에 들어갈 radiobtn 정보들
    */
    getNavTabsKlassInfo(klass:Klass, valueFocus:string) :RadioBtnOption[] {

        // klass_desc / getNavTabsKlassInfo(this.klass, "klass_desc");
        let optionList:RadioBtnOption[] = [

          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_NAV_TABS_KLASS_INFO,
              // public title:string
              "수업소개",
              // public key:string
              "klass_desc",
              // public value:string
              "klass_desc",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          ),

          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_NAV_TABS_KLASS_INFO,
              // public title:string
              "장소",
              // public key:string
              "klass_venue",
              // public value:string
              "klass_venue",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          ),

          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_NAV_TABS_KLASS_INFO,
              // public title:string
              "강사소개",
              // public key:string
              "tutor_desc",
              // public value:string
              "tutor_desc",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          ),

          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_NAV_TABS_KLASS_INFO,
              // public title:string
              "리뷰",
              // public key:string
              "student_review",
              // public value:string
              "student_review",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          ),

          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_NAV_TABS_KLASS_INFO,
              // public title:string
              "문의",
              // public key:string
              "student_question",
              // public value:string
              "student_question",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          ),

          new RadioBtnOption(
            // public myEvent:MyEvent
            new MyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE_NAV_TABS_KLASS_INFO,
              // public title:string
              "유의사항",
              // public key:string
              "caution",
              // public value:string
              "caution",
              // public metaObj:any
              klass
            ),
            // public isFocus:boolean
            false
          )        
     
        ]; 

        if(null != valueFocus && "" != valueFocus) {
            for (var i = 0; i < optionList.length; ++i) {
                let option:RadioBtnOption = optionList[i];

                if(option.myEvent.value === valueFocus) {
                    option.isFocus = true;    
                    optionList[i] = option;
                }
            }
        }

        return optionList;
    }


}
