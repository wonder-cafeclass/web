import { Injectable }        from '@angular/core';
import { MyEventService }    from '../../util/service/my-event.service';
import { MyEvent }           from '../../util/model/my-event';
import { CheckBoxOption }    from '../../widget/checkbox/model/checkbox-option';
import { Klass }             from '../model/klass';

@Injectable()
export class KlassCheckBoxService {

    // 카페 클래스에서 사용하는 대표적인 체크박스 설정값 - week_min,week_max,...
    constructor(private myEventService:MyEventService) {}

    /*
    *    @ Desc : 유저가 수강할 수 있는 요일을 선택하는 체크박스 데이터
    */
    getKlassDays(klass:Klass) :CheckBoxOption[] {

        let optionList:CheckBoxOption[] = [
            new CheckBoxOption(
                // public title:string,
                "일요일"
                // public isFocus:boolean
                ,false
                // public myEvent:MyEvent
                ,this.myEventService.getMyEvent(
                    // public eventName:string
                    this.myEventService.ANY,
                    // public key:string
                    this.myEventService.KLASS_DAYS,
                    // public value:string
                    this.myEventService.KLASS_DAYS_SUNDAY,
                    // public metaObj:any
                    klass,
                    // public myChecker:MyChecker
                    null    
                )
            ),

            new CheckBoxOption(
                // public title:string,
                "월요일"
                // public isFocus:boolean
                ,false
                // public myEvent:MyEvent
                ,this.myEventService.getMyEvent(
                    // public eventName:string
                    this.myEventService.ANY,
                    // public key:string
                    this.myEventService.KLASS_DAYS,
                    // public value:string
                    this.myEventService.KLASS_DAYS_MONDAY,
                    // public metaObj:any
                    klass,
                    // public myChecker:MyChecker
                    null    
                )
            ),

            new CheckBoxOption(
                // public title:string,
                "화요일"
                // public isFocus:boolean
                ,false
                // public myEvent:MyEvent
                ,this.myEventService.getMyEvent(
                    // public eventName:string
                    this.myEventService.ANY,
                    // public key:string
                    this.myEventService.KLASS_DAYS,
                    // public value:string
                    this.myEventService.KLASS_DAYS_TUESDAY,
                    // public metaObj:any
                    klass,
                    // public myChecker:MyChecker
                    null    
                )
            ),

            new CheckBoxOption(
                // public title:string,
                "수요일"
                // public isFocus:boolean
                ,false
                // public myEvent:MyEvent
                ,this.myEventService.getMyEvent(
                    // public eventName:string
                    this.myEventService.ANY,
                    // public key:string
                    this.myEventService.KLASS_DAYS,
                    // public value:string
                    this.myEventService.KLASS_DAYS_WEDNESDAY,
                    // public metaObj:any
                    klass,
                    // public myChecker:MyChecker
                    null    
                )
            ),

            new CheckBoxOption(
                // public title:string,
                "목요일"
                // public isFocus:boolean
                ,false
                // public myEvent:MyEvent
                ,this.myEventService.getMyEvent(
                    // public eventName:string
                    this.myEventService.ANY,
                    // public key:string
                    this.myEventService.KLASS_DAYS,
                    // public value:string
                    this.myEventService.KLASS_DAYS_THURSDAY,
                    // public metaObj:any
                    klass,
                    // public myChecker:MyChecker
                    null    
                )
            ),

            new CheckBoxOption(
                // public title:string,
                "금요일"
                // public isFocus:boolean
                ,false
                // public myEvent:MyEvent
                ,this.myEventService.getMyEvent(
                    // public eventName:string
                    this.myEventService.ANY,
                    // public key:string
                    this.myEventService.KLASS_DAYS,
                    // public value:string
                    this.myEventService.KLASS_DAYS_FRIDAY,
                    // public metaObj:any
                    klass,
                    // public myChecker:MyChecker
                    null    
                )
            ),

            new CheckBoxOption(
                // public title:string,
                "토요일"
                // public isFocus:boolean
                ,false
                // public myEvent:MyEvent
                ,this.myEventService.getMyEvent(
                    // public eventName:string
                    this.myEventService.ANY,
                    // public key:string
                    this.myEventService.KLASS_DAYS,
                    // public value:string
                    this.myEventService.KLASS_DAYS_SATURDAY,
                    // public metaObj:any
                    klass,
                    // public myChecker:MyChecker
                    null    
                )
            )                                 
        ]; 

        // set focus
        let daysMap = {}; 
        let daysList = klass.days_list;
        if(null != daysList && 0 < daysList.length) {
            for (var i = 0; i < daysList.length; ++i) {
                let day = daysList[i];
                daysMap[day] = day;
            }
        }

        for (var i = 0; i < optionList.length; ++i) {
            let option:CheckBoxOption = optionList[i];

            if(null != daysMap[option.myEvent.value]) {
                option.isFocus = true;    
                optionList[i] = option;
            }
        }

        return optionList;
    }


}
