import {  Component, 
          Input, 
          Output,
          ViewChild,
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';

import { LoginService }         from '../service/login.service';
import { UserService }          from '../../users/service/user.service';

import { EmailComponent }                 from './email/email.component';
import { PasswordComponent }              from './password/password.component';
import { NameComponent }                  from './name/name.component';
import { NicknameComponent }              from './nickname/nickname.component';
import { MobileComponent }                from './mobile/mobile.component';
import { ProfileImgUploadComponent }      from './profile-img-upload/profile-img-upload.component';
import { GenderComponent }                from './gender/gender.component';
import { BirthdayComponent }              from './birthday/birthday.component';

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
  public gender:string="";

  private birthYear:string;
  private birthMonth:string;
  private birthDay:string;

  @ViewChild(EmailComponent)
  private emailComponent: EmailComponent;

  @ViewChild(PasswordComponent)
  private passwordComponent: PasswordComponent;

  @ViewChild(NameComponent)
  private nameComponent: NameComponent;

  @ViewChild(NicknameComponent)
  private nicknameComponent: NicknameComponent;

  @ViewChild(MobileComponent)
  private mobileComponent: MobileComponent;  

  @ViewChild(GenderComponent)
  private genderComponent: GenderComponent;  

  @ViewChild(BirthdayComponent)
  private birthdayComponent: BirthdayComponent;  

  @ViewChild(ProfileImgUploadComponent)
  private profileImgUploadComponent: ProfileImgUploadComponent;  


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

    event.preventDefault();
    event.stopPropagation();

    let isAllOK:boolean = true;

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("signup / onClickSave / 시작");

    // 회원 가입을 하는데 필요한 모든 필드를 검사합니다.
    // 문제가 있다면 해당 필드에 경고를 보여줍니다.
    let hasNotDoneEmail:boolean = this.emailComponent.hasNotDone();
    if(hasNotDoneEmail) {
      this.emailComponent.showWarning();
      if(isDebug) console.log("signup / onClickSave / hasNotDoneEmail : ",hasNotDoneEmail);
      isAllOK = false;
    }

    let hasNotDonePassword:boolean = this.passwordComponent.hasNotDoneP();
    let hasNotDoneRepassword:boolean = false;
    if(hasNotDonePassword) {
      this.passwordComponent.showWarningP();
      if(isDebug) console.log("signup / onClickSave / hasNotDonePassword : ",hasNotDonePassword);
      isAllOK = false;
    } else {
      // 비밀번호 입력이 확인되었다면, 비밀번호 재입력을 다시 확인합니다.
      hasNotDoneRepassword = this.passwordComponent.hasNotDoneRP();
    }
    if(hasNotDoneRepassword) {
      // 비밀번호 재입력에 문제가 있습니다. 화면에 표시해줍니다.
      this.passwordComponent.showWarningRP();
      if(isDebug) console.log("signup / onClickSave / hasNotDoneRepassword : ",hasNotDoneRepassword);
      isAllOK = false;
    }

    let hasNotDoneName:boolean = this.nameComponent.hasNotDone();
    if(hasNotDoneName) {
      this.nameComponent.showWarning();
      if(isDebug) console.log("signup / onClickSave / hasNotDoneName : ",hasNotDoneName);
      isAllOK = false;
    }

    let hasNotDoneNickname:boolean = this.nicknameComponent.hasNotDone();
    if(hasNotDoneNickname) {
      this.nicknameComponent.showWarning();
      if(isDebug) console.log("signup / onClickSave / hasNotDoneNickname : ",hasNotDoneNickname);
      isAllOK = false;
    }

    let hasNotDoneMobileHead:boolean = this.mobileComponent.hasNotDoneMobileHead();
    let hasNotDoneMobileBody:boolean = false;
    let hasNotDoneMobileTail:boolean = false;

    if(hasNotDoneMobileHead) {
      this.mobileComponent.showWarningMobileHead();
      if(isDebug) console.log("signup / onClickSave / hasNotDoneMobileHead : ",hasNotDoneMobileHead);
      isAllOK = false;
    } else {
      // 휴대전화 첫번째 3자리가 문제가 없다면 휴대전화 두번째 4자리를 검사합니다.
      hasNotDoneMobileBody = this.mobileComponent.hasNotDoneMobileBody();
    }
    if(null == this.mobileNumHead || "" === this.mobileNumHead) {
      // 전화번호 첫 3자리가 기본값 '010'일 경우, 컴포넌트에서 기본값을 가져온다.
      this.mobileNumHead = this.mobileComponent.getMobileHead();
    }
    if(!hasNotDoneMobileHead && hasNotDoneMobileBody) {
      this.mobileComponent.showWarningMobileBody();
      if(isDebug) console.log("signup / onClickSave / hasNotDoneMobileBody : ",hasNotDoneMobileBody);
      isAllOK = false;
    } else if(!hasNotDoneMobileHead) {
      // 휴대전화 두번째 4자리가 문제가 없다면 휴대전화 세번째 4자리를 검사합니다.
      hasNotDoneMobileTail = this.mobileComponent.hasNotDoneMobileTail();
    }
    if(!hasNotDoneMobileHead && !hasNotDoneMobileBody && hasNotDoneMobileTail) {
      if(isDebug) console.log("signup / onClickSave / hasNotDoneMobileTail : ",hasNotDoneMobileTail);
      this.mobileComponent.showWarningMobileTail();
      isAllOK = false;
    } 

    let hasNotDoneGender:boolean = this.genderComponent.hasNotDone();   
    if(hasNotDoneGender) {
      this.genderComponent.showWarning();
      if(isDebug) console.log("signup / onClickSave / hasNotDoneGender : ",hasNotDoneGender);
      isAllOK = false;
    }

    // 생년월일 검사
    let hasNotDoneBirthYear:boolean = this.birthdayComponent.hasNotDoneBirthYear();
    if(hasNotDoneBirthYear) {
      this.birthdayComponent.showWarningBirthYear();
      if(isDebug) console.log("signup / onClickSave / hasNotDoneBirthYear : ",hasNotDoneBirthYear);
      isAllOK = false;
    }
    if(null == this.birthYear || "" === this.birthYear) {
      this.birthYear = this.birthdayComponent.getBirthYear();
    }

    let hasNotDoneBirthMonth:boolean = this.birthdayComponent.hasNotDoneBirthMonth();
    if(hasNotDoneBirthMonth) {
      this.birthdayComponent.showWarningBirthMonth();
      if(isDebug) console.log("signup / onClickSave / hasNotDoneBirthMonth : ",hasNotDoneBirthMonth);
      isAllOK = false;
    }
    if(null == this.birthMonth || "" === this.birthMonth) {
      this.birthMonth = this.birthdayComponent.getBirthMonth();
    }

    let hasNotDoneBirthDay:boolean = this.birthdayComponent.hasNotDoneBirthDay();
    if(hasNotDoneBirthDay) {
      this.birthdayComponent.showWarningBirthDay();
      if(isDebug) console.log("signup / onClickSave / hasNotDoneBirthDay : ",hasNotDoneBirthDay);
      isAllOK = false;
    }
    if(null == this.birthDay || "" === this.birthDay) {
      this.birthDay = this.birthdayComponent.getBirthDay();
    }

    // 프로필 이미지 검사
    let hasNotDoneProfileImg:boolean = this.profileImgUploadComponent.hasNotDone();
    if(hasNotDoneProfileImg) {
      this.profileImgUploadComponent.showWarning();
      if(isDebug) console.log("signup / onClickSave / hasNotDoneProfileImg : ",hasNotDoneProfileImg);
      isAllOK = false;
    }
    if(null == this.thumbnail || "" === this.thumbnail) {
      this.thumbnail = this.profileImgUploadComponent.getProfileImgUrl();
    }

    // 전화번호 검사




    if(isDebug) console.log("signup / onClickSave / isAllOK : ",isAllOK);

    // 등록되지 않은 필드가 있다면 표시해줘야 합니다.
    if(isAllOK) {
      if(isDebug) console.log("signup / onClickSave / 모든 필드가 문제가 없다면 유저 데이터를 전송!");

      this.userService
      .addUser(
        // apiKey:string
        this.myCheckerService.getAPIKey(),
        // email:string
        this.email,
        // password:string
        this.password,
        // name:string
        this.name, 
        // nickname:string
        this.nickname,
        // gender:string
        this.gender,
        // birthYear:string
        this.birthYear,
        // birthMonth:string
        this.birthMonth,
        // birthDay:string  
        this.birthDay,
        // thumbnail:string
        this.thumbnail,
        // mobileHead:string
        this.mobileNumHead,
        // mobileBody:string
        this.mobileNumBody,
        // mobileTail:string
        this.mobileNumTail
      ).then(result => {

        if(isDebug) console.log("signup / onClickSave / result : ",result);

        /*
        if( null != result &&
            null == result.user ) {

          // Do something...

        } // end if
        */
      }); // end service      
    }

  }

  onClickTerms(event): void {

    event.preventDefault();
    event.stopPropagation();

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("signup / onClickTerms / 시작");

    // 이용약관 페이지로 이동.
    window.open("/#/policy");

  }

  onClickPrivatePolicy(event): void {

    event.preventDefault();
    event.stopPropagation();

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("signup / onClickPrivatePolicy / 시작");

    // 개인정보 취급방침 페이지로 이동.
    window.open("/#/private-info");

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

        // 휴대전화 번호가 모두 확인되었습니다. 
        // TODO - 이미 등록된 번호는 아닌지 확인.

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
