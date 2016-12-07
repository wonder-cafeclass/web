import {  Component, 
          ViewChild,
          OnInit, 
          AfterViewInit,
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
export class MyInfoComponent implements OnInit, AfterViewInit {

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
              private watchTower:MyEventWatchTowerService) {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / ngAfterViewInit");

    this.asyncViewPack();

  }

  private asyncViewPack(): void {
    
    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("my-info / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("my-info / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }
  private setViewPack() :void {
    this.isAdmin = this.watchTower.getIsAdmin();
    this.myCheckerService.setReady(
      // checkerMap:any
      this.watchTower.getCheckerMap(),
      // constMap:any
      this.watchTower.getConstMap(),
      // dirtyWordList:any
      this.watchTower.getDirtyWordList(),
      // apiKey:string
      this.watchTower.getApiKey()
    ); // end setReady
  }


  private setLoginUser() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / setLoginUser / 시작");

    // 페이지 이동으로 로그인 알림을 받지 못할 경우는 직접 가져옵니다.
    let loginUser:User = this.watchTower.getLoginUser();
    if(null != loginUser) {
      this.loginUser = loginUser;
      this.fillViewUserInfo();
    }

    // Subscribe login user
    this.watchTower.loginAnnounced$.subscribe(
      (loginUser:User) => {

      if(isDebug) console.log("my-info / setLoginUser : ",loginUser);

      // 로그인한 유저 정보가 들어왔습니다.
      this.loginUser = loginUser;
      this.fillViewUserInfo();
    });  
  }

  private init() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    // 로그인한 유저 정보를 가져옵니다.
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