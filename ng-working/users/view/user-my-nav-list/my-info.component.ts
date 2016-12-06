import {  Component, 
          ViewChild,
          OnInit, 
          AfterViewChecked,
          Output, 
          EventEmitter,
          Input }                     from '@angular/core';

import { EmailComponent }             from '../../../widget/input/email/email.component';
import { ProfileImgUploadComponent }  from '../../../widget/input/profile-img-upload/profile-img-upload.component';
import { PasswordComponent }          from '../../../widget/input/password/password.component';
import { MobileComponent }            from '../../../widget/input/mobile/mobile.component';
import { NameComponent }              from '../../../widget/input/name/name.component';
import { GenderComponent }            from '../../../widget/input/gender/gender.component';
import { BirthdayComponent }          from '../../../widget/input/birthday/birthday.component';
import { NicknameComponent }          from '../../../widget/input/nickname/nickname.component';

import { MyEventWatchTowerService }   from '../../../util/service/my-event-watchtower.service';          

import { MyLoggerService }            from '../../../util/service/my-logger.service';
import { MyEventService }             from '../../../util/service/my-event.service';
import { MyEvent }                    from '../../../util/model/my-event';

import { MyCheckerService }           from '../../../util/service/my-checker.service';
import { MyChecker }                  from '../../../util/model/my-checker';

import { User }                       from '../../../users/model/user';

@Component({
  moduleId: module.id,
  selector: 'my-info',
  templateUrl: 'my-info.component.html',
  styleUrls: [ 'my-info.component.css' ]
})
export class MyInfoComponent implements OnInit, AfterViewChecked {

  @Output() emitter = new EventEmitter<any>();

  loginUser:User;

  private email:string;
  private password:string;
  private name:string;
  private nickname:string;
  private thumbnail:string;
  private mobileNumHead:string;
  private mobileNumBody:string;
  private mobileNumTail:string;
  gender:string="";

  private birthYear:string;
  private birthMonth:string;
  private birthDay:string;

  private facebookId:string;
  private kakaoId:string;
  private naverId:string;  

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

  isAdmin:boolean=false;

  constructor(public myEventService:MyEventService,
              private myLoggerService:MyLoggerService,
              public myCheckerService:MyCheckerService,
              private myEventWatchTowerService:MyEventWatchTowerService) {}

  ngOnInit(): void {

  }

  ngAfterViewChecked(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / ngAfterViewChecked");

    this.setIsAdmin();
    this.setMyCheckerReady();

  }

  private setIsAdmin(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("signup / setIsAdmin / 시작");

    // 사전에 등록된 값을 가져옴. 페이지 이동시에는 직접 값을 가져와야 함.
    this.isAdmin = this.myEventWatchTowerService.getIsAdmin();
    if(isDebug) console.log("signup / setIsAdmin / 시작 / this.isAdmin : ",this.isAdmin);

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.myEventWatchTowerService.isAdmin$.subscribe(
      (isAdmin:boolean) => {

      if(isDebug) console.log("signup / setIsAdmin / isAdmin : ",isAdmin);
      this.isAdmin = isAdmin;
    });
  }  

  private setMyCheckerReady() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("signup / setMyCheckerReady / 시작");

    // 페이지 이동으로 진입한 경우, watch tower에 저장된 변수 값을 가져온다.
    if(this.myEventWatchTowerService.getIsMyCheckerReady()) {
      this.init();
    }

    // 직접 주소를 입력하여 이동한 경우.
    this.myEventWatchTowerService.myCheckerServiceReady$.subscribe(
      (isReady:boolean) => {

      if(isDebug) console.log("signup / setMyCheckerReady / isReady : ",isReady);

      if(!isReady) {
      // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // errorType:string
          this.myLoggerService.errorTypeNotValidValue,
          // errorMsg:string
          `signup / setMyCheckerReady / Failed! / isReady : ${isReady}`
        );        
        return;
      }

      this.init();

    });    
  }

  private setMyChecker() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / setMyChecker / 시작");

    if(this.myEventWatchTowerService.getIsMyCheckerReady()) {

      this.myCheckerService.setReady(
        // checkerMap:any
        this.myEventWatchTowerService.getCheckerMap(),
        // constMap:any
        this.myEventWatchTowerService.getConstMap(),
        // dirtyWordList:any
        this.myEventWatchTowerService.getDirtyWordList(),
        // apiKey:string
        this.myEventWatchTowerService.getApiKey()
      ); // end setReady

      if(isDebug) console.log("my-info / setMyChecker / done!");
    } // end if

  }

  private setLoginUser() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / setLoginUser / 시작");

    // 페이지 이동으로 로그인 알림을 받지 못할 경우는 직접 가져옵니다.
    let loginUser:User = this.myEventWatchTowerService.getLoginUser();
    if(null != loginUser) {
      this.loginUser = loginUser;
      this.fillViewUserInfo();
    }

    // Subscribe login user
    this.myEventWatchTowerService.loginAnnounced$.subscribe(
      (loginUser:User) => {

      if(isDebug) console.log("my-info / setLoginUser : ",loginUser);

      // Example
      /*
      {
        birthday: "1981-07-17"
        date_created: "2016-11-29 23:11:53"
        date_updated: "2016-11-29 23:12:53"
        email: "wonder13662@gmail.com"
        facebook_id: ""
        gender: "M"
        google_id: null
        id: "1"
        kakao_id: "311947172"
        mobile: "010-1234-5678"
        name: "정원덕"
        naver_id: ""
        nickname: "정원덕"
        permission: "U"
        status: "A"
        thumbnail: "assets/images/user/2016-11-29|23|11|53|640151.jpg"
      }
      */

      // 로그인한 유저 정보가 들어왔습니다.
      this.loginUser = loginUser;
      this.fillViewUserInfo();
    });  
  }

  private init() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / init / 시작");

    this.setMyChecker();
    this.setLoginUser();

  }  

  fillViewUserInfo() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / fillViewUserInfo");
    if(isDebug) console.log("my-info / fillViewUserInfo / this.loginUser : ",this.loginUser);

    if(null == this.loginUser) {
      return;
    }

    // email
    this.emailComponent.setEmail(this.loginUser.email);
    this.email = this.loginUser.email;

    // name
    this.nameComponent.setName(this.loginUser.name);
    this.name = this.loginUser.name;

        /*
    // nickname
    this.nicknameComponent.setNickname(this.loginUser.nickname);
    this.nickname = this.loginUser.nickname;
    // thumbnail
    this.profileImgUploadComponent.setProfileImg(this.loginUser.thumbnail);
    this.thumbnail = this.loginUser.thumbnail;
    // mobile
    let mobile:string = this.loginUser.mobile;
    let mobileArr:string[] = mobile.split("-");
    if(isDebug) console.log("my-info / fillViewUserInfo / mobileArr : ",mobileArr);
    if(null != mobileArr && 3 === mobileArr.length) {
      this.mobileComponent.setMobileHead(mobileArr[0]);
      this.mobileComponent.setMobileBody(mobileArr[1]);
      this.mobileComponent.setMobileTail(mobileArr[2]);
    }
    // gender
    this.genderComponent.setGender(this.loginUser.gender);
    // birthday
    let birthday:string = this.loginUser.birthday;
    let birthdayArr:string[] = birthday.split("-");
    if(isDebug) console.log("my-info / fillViewUserInfo / birthdayArr : ",birthdayArr);
    if(null != birthdayArr && 3 === birthdayArr.length) {
      this.birthdayComponent.setBirthYear(birthdayArr[0]);
      this.birthdayComponent.setBirthMonth(birthdayArr[1]);
      this.birthdayComponent.setBirthDay(birthdayArr[2]);
    }
    */

  }

  onChangedFromChild(myEvent:MyEvent, myinfo, myhistory, mypayment, myfavorite) {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / onChangedFromChild / init");
    if(isDebug) console.log("my-info / onChangedFromChild / myEvent : ",myEvent);
    if(isDebug) console.log("my-info / onChangedFromChild / myEvent.key : ",myEvent.key);

  }

  onClickSave(event) :void{
    // TODO - 
    // 1. this.loginUser 객체와 비교, 값이 달라졌다면 save 버튼 활성화.
    // 2. 업데이트 뒤에는 다시 유저 객체도 업데이트.
  }

}