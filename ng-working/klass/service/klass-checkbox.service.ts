import { Injectable }        from '@angular/core';
import { MyEventService }    from '../../util/my-event.service';
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
                // public myEvent:MyEvent
                new MyEvent(
                    // public eventName:string
                    this.myEventService.ON_CHANGE_KLASS_DAYS,
                    // public title:string
                    "일요일",
                    // public key:string
                    "days",
                    // public value:string
                    "sun",
                    // public metaObj:any
                    klass
                ),
                // public isFocus:boolean
                false
            ),

            new CheckBoxOption(
                // public myEvent:MyEvent
                new MyEvent(
                    // public eventName:string
                    this.myEventService.ON_CHANGE_KLASS_DAYS,
                    // public title:string
                    "월요일",
                    // public key:string
                    "days",
                    // public value:string
                    "mon",
                    // public metaObj:any
                    klass
                ),
                // public isFocus:boolean
                false
            ),

            new CheckBoxOption(
                // public myEvent:MyEvent
                new MyEvent(
                    // public eventName:string
                    this.myEventService.ON_CHANGE_KLASS_DAYS,
                    // public title:string
                    "화요일",
                    // public key:string
                    "days",
                    // public value:string
                    "tue",
                    // public metaObj:any
                    klass
                ),
                // public isFocus:boolean
                false
            ),

            new CheckBoxOption(
                // public myEvent:MyEvent
                new MyEvent(
                    // public eventName:string
                    this.myEventService.ON_CHANGE_KLASS_DAYS,
                    // public title:string
                    "수요일",
                    // public key:string
                    "days",
                    // public value:string
                    "tue",
                    // public metaObj:any
                    klass
                ),
                // public isFocus:boolean
                false
            ),

            new CheckBoxOption(
                // public myEvent:MyEvent
                new MyEvent(
                    // public eventName:string
                    this.myEventService.ON_CHANGE_KLASS_DAYS,
                    // public title:string
                    "목요일",
                    // public key:string
                    "days",
                    // public value:string
                    "thu",
                    // public metaObj:any
                    klass
                ),
                // public isFocus:boolean
                false
            ),  

            new CheckBoxOption(
                // public myEvent:MyEvent
                new MyEvent(
                    // public eventName:string
                    this.myEventService.ON_CHANGE_KLASS_DAYS,
                    // public title:string
                    "금요일",
                    // public key:string
                    "days",
                    // public value:string
                    "fri",
                    // public metaObj:any
                    klass
                ),
                // public isFocus:boolean
                false
            ),

            new CheckBoxOption(
                // public myEvent:MyEvent
                new MyEvent(
                    // public eventName:string
                    this.myEventService.ON_CHANGE_KLASS_DAYS,
                    // public title:string
                    "토요일",
                    // public key:string
                    "days",
                    // public value:string
                    "sat",
                    // public metaObj:any
                    klass
                ),
                // public isFocus:boolean
                false
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
