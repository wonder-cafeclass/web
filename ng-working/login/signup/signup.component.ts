import {  Component, 
          Input, 
          Output,
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';

import { LoginService }         from '../service/login.service';
import { UserService }          from '../../users/service/user.service';

import { MyLoggerService }      from '../../util/service/my-logger.service';
import { MyCheckerService }     from '../../util/service/my-checker.service';
import { MyEventService }       from '../../util/service/my-event.service';
import { MyEvent }              from '../../util/model/my-event';

@Component({
  moduleId: module.id,
  selector: 'signup',
  templateUrl: 'signup.component.html',
  styleUrls: [ 'signup.component.css' ]
})
export class SignupComponent implements OnInit {

  private email:string;
  private password:string;
  private name:string;
  private nickname:string;
  private thumbnail:string;
  private mobileNumHead:string;
  private mobileNumBody:string;
  private mobileNumTail:string;
  gender:string="F";

  private birthYear:string;
  private birthMonth:string;
  private birthDay:string;


  constructor(  private loginService: LoginService, 
                private userService:UserService,
                private myLoggerService: MyLoggerService,
                public myCheckerService:MyCheckerService,
                private myEventService:MyEventService,
                public router: Router) {

    // 서버에서 파라미터를 검증할 check 데이터를 받아옵니다.
    this.myCheckerService.getReady();

  }

  ngOnInit(): void {

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(this.myLoggerService.pageKeySignup);    

  }

  onClickSave(event): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("signup / onClickSave / 시작");

    // 회원 가입을 하는데 필요한 모든 필드를 검사합니다.

    // 등록되지 않은 필드가 있다면 표시해줘야 합니다.

  }

  onChangedFromChild(myEvent:MyEvent) :void {
    // 자식 엘리먼트들의 이벤트 처리

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("signup / onChangedFromChild / 시작");

    if(isDebug) console.log("signup / onChangedFromChild / myEvent : ",myEvent);

    if(null == myEvent) {
      if(isDebug) console.log("signup / onChangedFromChild / 중단 / null == myEven");
      return;
    }
    if(null == myEvent.myChecker) {
      if(isDebug) console.log("signup / onChangedFromChild / 중단 / null == myEvent.myChecker");
      return;
    }
    if(null == myEvent.value) {
      if(isDebug) console.log("signup / onChangedFromChild / 중단 / null == myEvent.value");
      return;
    }

    // 모든 myEvent는 myChecker를 가지고 들어와야 합니다.
    // myChecker로 다시 한번 더 검사, 통과해야만 사용할 수 있습니다.
    let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
    if(!isOK) {
      if(isDebug) console.log("signup / onChangedFromChild / 중단 / !isOK");
      return;
    }

    // 정상적인 값을 가진 이벤트입니다.
    if(this.myEventService.ON_CHANGE === myEvent.eventName) {

      if(this.myEventService.KEY_USER_EMAIL === myEvent.key) {

        let email:string = myEvent.value;

        // DB Unique test
        this.userService
        .getUserByEmail(email)
        .then(result => {

          if( null != result &&
              null == result.user ) {

            // 해당 이메일로 등록된 유저는 없습니다. 
            // email 등록이 가능합니다.
            this.email = email;

            if(isDebug) console.log("signup / onChangedFromChild / email 등록이 가능합니다.");
          } // end if
        }); // end service

      } else if(this.myEventService.KEY_USER_PASSWORD === myEvent.key) {

        this.password = myEvent.value;
        if(isDebug) console.log("signup / onChangedFromChild / this.password : ",this.password);

      } else if(this.myEventService.KEY_USER_NAME === myEvent.key) {

        this.name = myEvent.value;
        if(isDebug) console.log("signup / onChangedFromChild / this.name : ",this.name);

      } else if(this.myEventService.KEY_USER_NICKNAME === myEvent.key) {

        this.nickname = myEvent.value;
        if(isDebug) console.log("signup / onChangedFromChild / this.nickname : ",this.nickname);

      } else if(this.myEventService.KEY_USER_THUMBNAIL === myEvent.key) {

        this.thumbnail = myEvent.value;
        if(isDebug) console.log("signup / onChangedFromChild / this.thumbnail : ",this.thumbnail);

      } else if(this.myEventService.KEY_USER_MOBILE_NUM_HEAD === myEvent.key) {

        this.mobileNumHead = myEvent.value;
        if(isDebug) console.log("signup / onChangedFromChild / this.mobileNumHead : ",this.mobileNumHead);

      } else if(this.myEventService.KEY_USER_MOBILE_NUM_BODY === myEvent.key) {

        this.mobileNumBody = myEvent.value;
        if(isDebug) console.log("signup / onChangedFromChild / this.mobileNumBody : ",this.mobileNumBody);

      } else if(this.myEventService.KEY_USER_MOBILE_NUM_TAIL === myEvent.key) {

        this.mobileNumTail = myEvent.value;
        if(isDebug) console.log("signup / onChangedFromChild / this.mobileNumTail : ",this.mobileNumTail);

      } else if(this.myEventService.KEY_USER_GENDER === myEvent.key) {

        this.gender = myEvent.value;
        if(isDebug) console.log("signup / onChangedFromChild / this.gender : ",this.gender);

      } else if(this.myEventService.KEY_USER_BIRTH_YEAR === myEvent.key) {

        this.birthYear = myEvent.value;
        if(isDebug) console.log("signup / onChangedFromChild / this.birthYear : ",this.birthYear);

      } else if(this.myEventService.KEY_USER_BIRTH_MONTH === myEvent.key) {

        this.birthMonth = myEvent.value;
        if(isDebug) console.log("signup / onChangedFromChild / this.birthMonth : ",this.birthMonth);

      } else if(this.myEventService.KEY_USER_BIRTH_DAY === myEvent.key) {

        this.birthDay = myEvent.value;
        if(isDebug) console.log("signup / onChangedFromChild / this.birthDay : ",this.birthDay);

      } // end if

    } // end if

    if(isDebug) console.log("signup / onChangedFromChild / done");
  }
  
}
