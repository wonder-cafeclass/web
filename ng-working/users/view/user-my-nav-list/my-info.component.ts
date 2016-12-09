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
import { PasswordsTripletComponent }          from '../../../widget/input/password/passwords-triplet.component';
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

import { MyResponse }                 from '../../../util/model/my-response';

import { UserService }                from '../../../users/service/user.service';

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
  loginUserCopy:User;

  // @ immutable - key
  private email:string;
  private facebookId:string;
  private kakaoId:string;
  private naverId:string;
  // @ mutables - init
  private passwordCur:string;
  private passwordNew:string;
  private passwordRe:string;
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
  // @ mutables - done

  // password event keys
  eventKeyPWHead:string;
  eventKeyPWBody:string;
  eventKeyPWTail:string;

  @ViewChild(EmailComponent)
  private emailComponent: EmailComponent;

  @ViewChild(PasswordsTripletComponent)
  private passwordsComponent: PasswordsTripletComponent;

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

  // @ Desc : 사용자가 자신의 유저 정보를 변경했는지 확인하는 플래그
  hasChanged:boolean=false;

  constructor(public myEventService:MyEventService,
              private myLoggerService:MyLoggerService,
              public myCheckerService:MyCheckerService,
              private userService:UserService,
              private watchTower:MyEventWatchTowerService) {

    this.eventKeyPWHead = this.myEventService.KEY_USER_CUR_PASSWORD;
    this.eventKeyPWBody = this.myEventService.KEY_USER_NEW_PASSWORD;
    this.eventKeyPWTail = this.myEventService.KEY_USER_RE_PASSWORD;

  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("my-info / ngAfterViewInit");

    this.asyncViewPack();

  }

  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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
      this.copyUser();
      this.fillViewUserInfo();
    }

    // Subscribe login user
    this.watchTower.loginAnnounced$.subscribe(
      (loginUser:User) => {

      if(isDebug) console.log("my-info / setLoginUser : ",loginUser);

      // 로그인한 유저 정보가 들어왔습니다.
      this.loginUser = loginUser;
      this.copyUser();
      this.fillViewUserInfo();
    });  
  }

  private copyUser() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("my-info / copyUser / 시작");

    if(null == this.loginUser) {
      // 유저가 없는 경우는 복사를 중단합니다.
      if(isDebug) console.log("my-info / copyUser / 중단 / 유저가 없는 경우는 복사를 중단합니다.");
      return;
    }

    // 사용자 정보를 변경할 경우, 변경된 값을 저장할 User 객체의 복사본을 만듭니다.
    this.loginUserCopy = this.userService.copyUser(this.loginUser);
    if(isDebug) console.log("my-info / copyUser / this.loginUserCopy : ",this.loginUserCopy);

    // TEST
    let isSame:boolean = this.userService.isSameUser(this.loginUser, this.loginUserCopy);
    if(isDebug) console.log("my-info / copyUser / isSame : ",isSame);

  }

  private init() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("my-info / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    // 로그인한 유저 정보를 가져옵니다.
    this.setLoginUser();

  }  

  fillViewUserInfo() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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
      this.birthdayComponent.setBirthDay(birthdayArr[1], birthdayArr[2]);
    }

  }

  onChangedFromChild(myEvent:MyEvent, myinfo, myhistory, mypayment, myfavorite) {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / onChangedFromChild / init");
    if(isDebug) console.log("my-info / onChangedFromChild / myEvent : ",myEvent);
    if(isDebug) console.log("my-info / onChangedFromChild / myEvent.key : ",myEvent.key);

    if(this.myEventService.ON_CHANGE === myEvent.eventName) {

      if(this.myEventService.KEY_USER_CUR_PASSWORD === myEvent.key) {

        if(isDebug) console.log("my-info / onChangedFromChild / KEY_USER_CUR_PASSWORD");
        if(isDebug) console.log("my-info / onChangedFromChild / myEvent.value : ",myEvent.value);

        // 현재 유저의 비밀번호와 동일한지 비교합니다.
        this.userService.confirmUserEmailPassword(
          // apiKey:string
          this.watchTower.getApiKey(),
          // email:string
          this.email,
          // password:string
          myEvent.value
        ).then((myResponse:MyResponse) => {

          if(isDebug) console.log("my-info / onChangedFromChild / myResponse : ",myResponse);

          let user:User = null;
          if(myResponse.isSuccess()) {
            user = myResponse.digDataProp(["user","mobile"]);
          } // end if
          if(null != user) {
            if(isDebug) console.log("my-info / onChangedFromChild / 패스워드가 확인되었습니다.");
            if(isDebug) console.log("my-info / onChangedFromChild / user : ",user);

            // wonder.jung
            // 사용자가 입력한 패스워드를 변수 - cur_pw에 등록.
            this.passwordCur=myEvent.value;
            // 사용자에게 성공 메시지 노출
            this.passwordsComponent.showTooltipSuccess(
              // eventKey:string
              this.passwordsComponent.eventKeyHead,
              // msg:string
              "성공! 현재 비밀번호가 확인되었습니다."
            );

          } else {

            // 사용자가 입력한 암호와 다를 경우는 경고 메시지를 노출
            if(isDebug) console.log("my-info / onChangedFromChild / 사용자가 입력한 암호와 다를 경우는 경고 메시지를 노출.");
            this.passwordsComponent.showTooltipWarning(
              // eventKey:string
              this.passwordsComponent.eventKeyHead,
              // msg:string
              "비밀번호를 다시 확인해주세요."
            );

          }// end if
        }); 

      } else if(this.myEventService.KEY_USER_NEW_PASSWORD === myEvent.key) {

        if(isDebug) console.log("my-info / onChangedFromChild / KEY_USER_NEW_PASSWORD");

        // 유효한 새로운 패스워드를 받았습니다.

        // 1. 새로운 패스워드는 이전의 패스워드와 달라야 합니다.
        if(this.passwordCur === myEvent.value) {
          if(isDebug) console.log("my-info / onChangedFromChild / 중단 / 이전 비밀번화와 새로운 비밀번호가 같음.");
          this.passwordsComponent.showTooltipWarning(
            // eventKey:string
            this.passwordsComponent.eventKeyBody,
            // msg:string
            "새로운 비밀번호가 이전과 같습니다!"
          );
        } else {
          if(isDebug) console.log("my-info / onChangedFromChild / 유효한 새로운 패스워드를 받았습니다.");
          // 변수에 저장합니다.
          this.passwordNew = myEvent.value;
          // 사용자에게 성공 메시지 노출
          this.passwordsComponent.showTooltipSuccess(
            // eventKey:string
            this.passwordsComponent.eventKeyBody,
            // msg:string
            "성공! 새로운 비밀번호가 완벽합니다."
          );
        } // end if
        // end KEY_USER_NEW_PASSWORD

      } else if(this.myEventService.KEY_USER_RE_PASSWORD === myEvent.key) {

        if(isDebug) console.log("my-info / onChangedFromChild / KEY_USER_RE_PASSWORD");

        if(this.passwordNew !== myEvent.value) {
          // 새로운 비밀번호 재확인이 새로운 비밀번호와 다릅니다. 
          // 경고 메시지 노출 
          this.passwordsComponent.showTooltipWarning(
            // eventKey:string
            this.passwordsComponent.eventKeyTail,
            // msg:string
            "새로운 비밀번호와 다릅니다!"
          );
        } else {
          // 변수에 저장합니다.
          this.passwordRe = myEvent.value;
          // 사용자에게 성공 메시지 노출
          this.passwordsComponent.showTooltipSuccess(
            // eventKey:string
            this.passwordsComponent.eventKeyTail,
            // msg:string
            "성공! 새로운 비밀번호가 완벽합니다."
          );
          // 저장 버튼 활성화.
          this.hasChanged=true;
        } // end if
        // end KEY_USER_RE_PASSWORD

      } else if(this.myEventService.KEY_USER_NAME === myEvent.key) {

        if(isDebug) console.log("my-info / onChangedFromChild / KEY_USER_NAME");

        let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if(!isOK) {
          if(isDebug) console.log("my-info / onChangedFromChild / 중단 / 이름이 유효하지 않습니다.");
          return;
        }

        // 1. loginUser객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("name", myEvent.value);
        // end if - ON CHANGE - KEY_USER_NAME

      } else if(this.myEventService.KEY_USER_NICKNAME === myEvent.key) {

        if(isDebug) console.log("my-info / onChangedFromChild / KEY_USER_NICKNAME");

        let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if(!isOK) {
          if(isDebug) console.log("my-info / onChangedFromChild / 중단 / 이름이 유효하지 않습니다.");
          return;
        }

        // 1. loginUser객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("nickname", myEvent.value);
        // end if - ON CHANGE - KEY_USER_NICKNAME

      } else if(this.myEventService.KEY_USER_THUMBNAIL === myEvent.key) {

        if(isDebug) console.log("my-info / onChangedFromChild / KEY_USER_THUMBNAIL");

        let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if(!isOK) {
          if(isDebug) console.log("my-info / onChangedFromChild / 중단 / 이름이 유효하지 않습니다.");
          return;
        }

        // 1. loginUser객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("thumbnail", myEvent.value);
        // end if - ON CHANGE - KEY_USER_THUMBNAIL

      } // end if - ON CHANGE

    } // end if


  } // end method

  private updateNewProp(key:string, newValue:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("my-info / updateNewProp / init");

    if(null == key || "" == key) {
      if(isDebug) console.log("my-info / updateNewProp / 중단 / key is not valid!");
      return;
    }
    if(null == this.loginUserCopy) {
      if(isDebug) console.log("my-info / updateNewProp / 중단 / this.loginUserCopy is not valid!");
      return;
    }

    let valueFromDB:string = this.loginUser.thumbnail;
    if(valueFromDB !== newValue) {
      // 1-1. 변경된 이름이라면 this.thumbnail에 업데이트.
      if(null != this[key]) {
        this[key] = newValue;
      }
      // 변경된 이름을 복사해둔 loginUserCopy에 저장합니다.
      if(null != this.loginUserCopy && null != this.loginUserCopy[key]) {
        this.loginUserCopy[key] = newValue;
        if(isDebug) console.log("my-info / updateNewProp / 변경된 이름을 복사해둔 loginUserCopy에 저장합니다.");
        if(isDebug) console.log("my-info / updateNewProp / this.loginUserCopy : ",this.loginUserCopy);
      }
      // 저장 버튼을 노출합니다.
      this.hasChanged=true;
    } else {
      // 변경되지 않았습니다.
      if(this.checkUserInfoChanged()) {
        // 모든 다른 항목중에 변경된 것이 없다면, 
        // 저장 버튼을 비활성화 합니다.
        this.hasChanged=false;
      } // end if

    } // end if

  } // end method

  onClickSave(event) :void{

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / onClickSave / init");

    let hasChanged:boolean = this.checkUserInfoChanged();
    if(isDebug) console.log("my-info / onClickSave / hasChanged : ",hasChanged);
    if(hasChanged) {
      // 변경되었다면 저장합니다.
      this.userService.updateUserByUser(
        this.watchTower.getApiKey(),
        this.loginUserCopy
      ).then((myResponse:MyResponse) => {

        if(isDebug) console.log("my-info / onClickSave / 유저정보 업데이트 / myResponse : ",myResponse);

        let userUpdated = myResponse.digDataProp(["user"]);
        if(myResponse.isSuccess && null != userUpdated) {
          // 저장된 유저 정보를 다시 받아옵니다.
          // 받아온 유저 정보로 업데이트 합니다.
          this.loginUser.updateWithJSON(userUpdated);
          this.loginUserCopy.updateWithJSON(userUpdated);

          if(isDebug) console.log("my-info / onClickSave / 받아온 유저 정보로 업데이트 합니다.");
          if(isDebug) console.log("my-info / onClickSave / this.loginUser : ",this.loginUser);
          if(isDebug) console.log("my-info / onClickSave / this.loginUserCopy : ",this.loginUserCopy);

        } else {
          // Error Report
          
        } // end if
      }); // end service

    }
    // wonder.jung

    // 비밀번호 변경 여부 확인
    let hasChangedPassword:boolean = this.checkUserPasswordChanged();
    if(isDebug) console.log("my-info / onClickSave / hasChangedPassword : ",hasChangedPassword);

    if(hasChangedPassword) {
      // 변경되었다면 업데이트!
      
      // 3. DB Update!
      this.userService.updatePassword(
        // apiKey:string
        this.watchTower.getApiKey(),
        // email:string 
        this.email,
        // password:string
        this.passwordNew
      ).then((myResponse:MyResponse) => {

        if(isDebug) console.log("my-info / onClickSave / 비밀번호 업데이트 / myResponse : ",myResponse);
        let is_valid_password:boolean = myResponse.getDataProp("is_valid_password");
        if(myResponse.isSuccess && is_valid_password) {
          // 비밀번호 업데이트 성공!
          if(isDebug) console.log("my-info / onClickSave / 비밀번호 업데이트 성공!");
        }

        // 입력한 모든 비밀번호를 초기화합니다.
        this.passwordsComponent.cleanPasswords();

      });
    }


    // 저장 버튼 비활성화.
    this.hasChanged=false;

  }

  private checkUserInfoChanged() :boolean {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / checkUserInfoChanged / init");
    if(isDebug) console.log("my-info / checkUserInfoChanged / this.loginUser : ",this.loginUser);

    let mobileArr:string[] = this.loginUser.getMobileArr();
    let mobileHead:string = mobileArr[0];
    let mobileBody:string = mobileArr[1];
    let mobileTail:string = mobileArr[2];

    // 생일은 선택 입력이므로 없을 수도 있습니다.
    let birthdayArr:string[] = this.loginUser.getBirthdayArr();
    let birthYear:string = birthdayArr[0];
    let birthMonth:string = birthdayArr[1];
    let birthDay:string = birthdayArr[2];

    // 검사 시작!
    let hasChanged:boolean = false;

    if( this.nameComponent.isOK(this.name) && 
        this.name !== this.loginUser.name) {
      // 1. name
    if(isDebug) console.log("my-info / checkUserInfoChanged / 이름이 변경됨");
      hasChanged = true;
    } else if(  this.nicknameComponent.isOK(this.nickname) && 
                this.nickname !== this.loginUser.nickname) {
      // 2. nickname
      if(isDebug) console.log("my-info / checkUserInfoChanged / 닉네임이 변경됨");
      hasChanged = true;
    } else if(  this.profileImgUploadComponent.isOK(this.thumbnail) && 
                this.thumbnail !== this.loginUser.thumbnail) {
      // 3. profile-img
      if(isDebug) console.log("my-info / checkUserInfoChanged / 섬네일이 변경됨");
      hasChanged = true;
    } else if( this.mobileComponent.isOKHead(this.mobileNumHead) && 
        mobileHead !== this.mobileNumHead) {
      // 4-1. mobile head
      if(isDebug) console.log("my-info / checkUserInfoChanged / 휴대전화 첫 3자리 변경됨");
      hasChanged = true;
    } else if( this.mobileComponent.isOKBody(this.mobileNumBody) && 
        mobileBody !== this.mobileNumBody) {
      // 4-2. mobile body
      if(isDebug) console.log("my-info / checkUserInfoChanged / 휴대전화 두번째 4자리 변경됨");
      hasChanged = true;
    } else if( this.mobileComponent.isOKTail(this.mobileNumTail) && 
        mobileTail !== this.mobileNumTail) {
      // 4-3. mobile tail
      if(isDebug) console.log("my-info / checkUserInfoChanged / 휴대전화 세번째 4자리 변경됨");
      hasChanged = true;
    } else if(  this.genderComponent.isOK(this.gender) && 
                this.gender !== this.loginUser.gender) {
      // 5. gender
      if(isDebug) console.log("my-info / checkUserInfoChanged / 성별 변경됨");
      hasChanged = true;
    } else if( this.birthdayComponent.isOKBirthYear(this.birthYear) && 
        birthYear !== this.birthYear) {
      // 6-1. birthYear
      if(isDebug) console.log("my-info / checkUserInfoChanged / 생일 - 연도 변경됨");
      hasChanged = true;
    } else if( this.birthdayComponent.isOKBirthMonth(this.birthMonth) && 
        birthMonth !== this.birthMonth) {
      // 6-2. birthMonth
      if(isDebug) console.log("my-info / checkUserInfoChanged / 생일 - 월 변경됨");
      hasChanged = true;
    } else if( this.birthdayComponent.isOKBirthDay(this.birthDay) && 
        birthDay !== this.birthDay) {
      // 6-3. birthDay
      if(isDebug) console.log("my-info / checkUserInfoChanged / 생일 - 일 변경됨");
      hasChanged = true;

    } else if( this.passwordsComponent.isOK(this.passwordNew) && 
        this.passwordCur !== this.passwordNew && 
        this.passwordNew === this.passwordRe) {

      // 7. password
      if(isDebug) console.log("my-info / checkUserInfoChanged / 생일 - 일 변경됨");
      hasChanged = true;

    } // end if

    return hasChanged;
  }

  private checkUserPasswordChanged() :boolean {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / checkUserPasswordChanged / init");

    let hasChanged:boolean = false;

    if( this.passwordsComponent.isOK(this.passwordNew) && 
        this.passwordCur !== this.passwordNew && 
        this.passwordNew === this.passwordRe) {

      // 7. password
      if(isDebug) console.log("my-info / checkUserPasswordChanged / 비밀번호 변경됨.");
      hasChanged = true;

    } // end if

    return hasChanged;    
  }

}