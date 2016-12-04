import {  Component, 
          ViewChild,
          OnInit, 
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
export class MyInfoComponent implements OnInit {

  @Input() myCheckerService:MyCheckerService;

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

  constructor(public myEventService:MyEventService,
              private myEventWatchTowerService:MyEventWatchTowerService) {}

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / ngOnInit");

    // Subscribe login user
    this.myEventWatchTowerService.loginAnnounced$.subscribe(
      (loginUser:User) => {

      if(isDebug) console.log("my-info / loginUser : ",loginUser);

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

  fillViewUserInfo() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / fillViewUserInfo");
    if(isDebug) console.log("my-info / fillViewUserInfo / this.loginUser : ",this.loginUser);

    if(null == this.loginUser) {
      return;
    }

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