import { Injectable }        from '@angular/core';
import { MyEventService }    from '../../util/service/my-event.service';
import { MyEvent }           from '../../util/model/my-event';
import { MyChecker }         from '../../util/model/my-checker';
import { RadioBtnOption }    from '../../widget/radiobtn/model/radiobtn-option';
import { Klass }             from '../model/klass';
import { User }              from '../../users/model/user';
import { Teacher }           from '../../teachers/model/teacher';
import { MyEventWatchTowerService }   from '../../util/service/my-event-watchtower.service';

@Injectable()
export class KlassRadioBtnService {

  private watchTower:MyEventWatchTowerService;

  // 카페 클래스에서 사용하는 대표적인 체크박스 설정값 - week_min,week_max,...
  constructor(private myEventService:MyEventService) {}

  public setWatchTower(watchTower:MyEventWatchTowerService):void {
    this.watchTower = watchTower;
  }

  // @ Desc : 검사하지 않는 checker를 가져옵니다.
  private getFreePassChecker():MyChecker {
    if(null == this.watchTower) {
      return null;
    }

    return this.watchTower.getMyCheckerService().getFreePassChecker();
  }

    /*
    *    @ Desc : 유저가 몇주(weeks) 수강하려는 결정을 도와주는 체크박스 데이터
    */
    getKlassEnrolmentWeeks(klass:Klass) :RadioBtnOption[] {

        let optionList:RadioBtnOption[] = [
            new RadioBtnOption(
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
                this.getFreePassChecker()
              )
            ),

            new RadioBtnOption(
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
                  this.getFreePassChecker()
                )
            ),

            new RadioBtnOption(
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
                  this.getFreePassChecker()
                )
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
              this.getFreePassChecker()
            )
          ),

          new RadioBtnOption(
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
              this.getFreePassChecker()
            ) // end MyEvent
          ),

          new RadioBtnOption(
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
              this.getFreePassChecker()
            ) // end MyEvent
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
    getNavTabsKlassInfo(klass:Klass, keyFocus:string) :RadioBtnOption[] { 

      if(null == klass) {
        return null;
      }

        // klass_desc / getNavTabsKlassInfo(this.klass, "klass_desc");
        let optionList:RadioBtnOption[] = [

          new RadioBtnOption(
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
              this.getFreePassChecker()
            ) // end MyEvent
          ),

          new RadioBtnOption(
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
              this.getFreePassChecker()
            ) // end MyEvent
          ),

          new RadioBtnOption(
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
              this.getFreePassChecker()
            ) // end MyEvent
          ),

          new RadioBtnOption(
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
              this.getFreePassChecker()
            ) // end MyEvent
          ),

          new RadioBtnOption(
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
              this.getFreePassChecker()
            ) // end MyEvent
          ),

          new RadioBtnOption(
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
              this.getFreePassChecker()
            ) // end MyEvent
          )
        ]; // end array


        if(null != keyFocus && "" != keyFocus) {
            for (var i = 0; i < optionList.length; ++i) {
                let option:RadioBtnOption = optionList[i];

                if(option.key === keyFocus) {
                    option.isFocus = true;    
                    optionList[i] = option;
                }
            }
        } // end if


        return optionList;
    }



    /*
    *    @ Desc : 유저의 내정보 페이지에 대한 Nav tabs에 들어갈 radiobtn 정보들
    */
    getNavTabsUserMyInfo(user:User, keyFocus:string) :RadioBtnOption[] {

        // klass_desc / getNavTabsKlassInfo(this.klass, "klass_desc");
        let optionList:RadioBtnOption[] = [

          new RadioBtnOption(
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
              this.getFreePassChecker()
            ) // end MyEvent
          ),        

          new RadioBtnOption(
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
              this.getFreePassChecker()
            ) // end MyEvent
          ),

          new RadioBtnOption(
            // public title:string,
            "수강 이력",
            // public key:string,
            this.myEventService.KEY_USER_MY_HISTORY,
            // public isFocus:boolean
            false,
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
              // public eventName:string
              this.myEventService.ON_CHANGE,
              // public key:string
              this.myEventService.KEY_USER_MY_HISTORY,
              // public value:string
              "",
              // public metaObj:any
              user,
              // public myChecker:MyChecker
              this.getFreePassChecker()
            ) // end MyEvent
          ), 

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

          new RadioBtnOption(
            // public title:string,
            "관심강의",
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
              this.getFreePassChecker()
            ) // end MyEvent
          )

        ]; // end array


        if(null != keyFocus && "" != keyFocus) {
            for (var i = 0; i < optionList.length; ++i) {
                let option:RadioBtnOption = optionList[i];

                if(option.key === keyFocus) {
                    option.isFocus = true;    
                    optionList[i] = option;
                }
            }
        } // end if


        return optionList;
    }    

  /*
  *    @ Desc : 선생님의 내정보 페이지에 대한 Nav tabs에 들어갈 radiobtn 정보들
  */
  getNavTabsTeacherMyInfo(teacher:Teacher, keyFocus:string) :RadioBtnOption[] {

    // klass_desc / getNavTabsKlassInfo(this.klass, "klass_desc");
    let optionList:RadioBtnOption[] = [

      new RadioBtnOption(
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
          this.getFreePassChecker()
        ) // end MyEvent
      ),

      new RadioBtnOption(
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
          this.getFreePassChecker()
        ) // end MyEvent
      ),

      new RadioBtnOption(
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
          this.getFreePassChecker()
        ) // end MyEvent
      ),

      new RadioBtnOption(
        // public title:string,
        "출석리스트",
        // public key:string,
        this.myEventService.KEY_TEACHER_MY_KLASS_ATTENDANCE,
        // public isFocus:boolean
        false,
        // public myEvent:MyEvent
        this.myEventService.getMyEvent(
          // public eventName:string
          this.myEventService.ON_CHANGE,
          // public key:string
          this.myEventService.KEY_TEACHER_MY_KLASS_ATTENDANCE,
          // public value:string
          "",
          // public metaObj:any
          teacher,
          // public myChecker:MyChecker
          this.getFreePassChecker()
        ) // end MyEvent
      ),       

      new RadioBtnOption(
        // public title:string,
        "결재정보",
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
          this.getFreePassChecker()
        ) // end MyEvent
      ), 

      new RadioBtnOption(
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
          this.getFreePassChecker()
        ) // end MyEvent
      )

    ]; // end array


    if(null != keyFocus && "" != keyFocus) {
        for (var i = 0; i < optionList.length; ++i) {
            let option:RadioBtnOption = optionList[i];

            if(option.key === keyFocus) {
                option.isFocus = true;    
                optionList[i] = option;
            }
        }
    } // end if


    return optionList;
  }    

}
