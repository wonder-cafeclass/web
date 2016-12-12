import {  Component, 
          Input, 
          Output,
          ViewChild,
          ViewChildren,
          QueryList,
          OnInit, 
          AfterViewInit }             from '@angular/core';
import {  Router }                    from '@angular/router';

import { LoginService }               from '../login/service/login.service';

import { UserService }                from '../users/service/user.service';
import { User }                       from '../users/model/user';

import { TeacherService }             from './service/teacher.service';
import { Teacher }                    from './model/teacher';

import { UrlService }                 from "../util/url.service";
import { MyLoggerService }            from '../util/service/my-logger.service';
import { MyEventWatchTowerService }   from '../util/service/my-event-watchtower.service';
import { MyEventService }             from '../util/service/my-event.service';
import { MyEvent }                    from '../util/model/my-event';
import { MyCheckerService }           from '../util/service/my-checker.service';
import { MyChecker }                  from '../util/model/my-checker';
import { MyResponse }                 from '../util/model/my-response';

import { ProfileImgUploadComponent }  from '../widget/input/profile-img-upload/profile-img-upload.component';
import { MobileComponent }            from '../widget/input/mobile/mobile.component';
import { GenderComponent }            from '../widget/input/gender/gender.component';
import { BirthdayComponent }          from '../widget/input/birthday/birthday.component';
import { DefaultComponent }           from '../widget/input/default/default.component';
import { DefaultMeta }                from '../widget/input/default/model/default-meta';
import { DefaultService }             from '../widget/input/default/service/default.service';


@Component({
  moduleId: module.id,
  selector: 'apply-teacher',
  templateUrl: 'apply-teacher.component.html',
  styleUrls: [ 'apply-teacher.component.css' ]
})
export class ApplyTeacherComponent implements OnInit, AfterViewInit {

  private code:string;
  private redirectUrl:string="/class-center";

  private apiKey:string;
  isAdmin:boolean=false;

  private loginUser:User;
  private newTeacher:Teacher;

  // @ immutable - key
  // @ mutables - init
  private email:string;
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

  @ViewChildren(DefaultComponent) inputComponentList: QueryList<DefaultComponent>;
  defaultMetaList:DefaultMeta[];

  private emailComponent: DefaultComponent;
  private nameComponent: DefaultComponent;
  private nicknameComponent: DefaultComponent;

  @ViewChild(MobileComponent)
  private mobileComponent: MobileComponent;

  @ViewChild(GenderComponent)
  private genderComponent: GenderComponent;  

  @ViewChild(BirthdayComponent)
  private birthdayComponent: BirthdayComponent;  

  @ViewChild(ProfileImgUploadComponent)
  private profileImgUploadComponent: ProfileImgUploadComponent;  

  // @ Desc : 사용자가 자신의 선생님 정보를 변경했는지 확인하는 플래그
  hasChanged:boolean=false;

  constructor(  private loginService:LoginService,
                private myEventService:MyEventService,
                private watchTower:MyEventWatchTowerService,
                private userService:UserService,
                private teacherService:TeacherService,
                private myLoggerService:MyLoggerService,
                private myCheckerService:MyCheckerService,
                private urlService:UrlService,
                private defaultService:DefaultService,
                public router:Router) {

    // Default Input 셋을 가져옵니다. 이름/닉네임/이메일에 사용됩니다.
    this.defaultMetaList = this.myEventService.getDefaultMetaListApplyTeacher();

  } // end function

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / ngOnInit / 시작");

    // 선생님 등록화면에서는 상,하단 메뉴를 가립니다.
    this.watchTower.announceToggleTopMenu(false);

  } // end function

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / ngAfterViewInit");

    this.setDefaultComponents();

    this.asyncViewPack();

  }  

  private setDefaultComponents() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / setDefaultComponents / 시작");

    // DefaultComponent들을 세팅
    this.emailComponent = this.getInput(this.myEventService.KEY_USER_EMAIL);
    this.nameComponent = this.getInput(this.myEventService.KEY_USER_NAME);
    this.nicknameComponent = this.getInput(this.myEventService.KEY_USER_NICKNAME);

    if(isDebug) console.log("apply-teacher / setDefaultComponents / this.emailComponent : ",this.emailComponent);
    if(isDebug) console.log("apply-teacher / setDefaultComponents / this.nameComponent : ",this.emailComponent);
    if(isDebug) console.log("apply-teacher / setDefaultComponents / this.nicknameComponent : ",this.nicknameComponent);
  }  

  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다.
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("apply-teacher / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("apply-teacher / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      
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

  private copyUser() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / copyUser / 시작");

    if(null == this.loginUser) {
      // 유저가 없는 경우는 복사를 중단합니다.
      if(isDebug) console.log("apply-teacher / copyUser / 중단 / 유저가 없는 경우는 복사를 중단합니다.");
      return;
    }

    this.newTeacher = this.teacherService.getTeacherFromUser(this.loginUser);
    if(isDebug) console.log("apply-teacher / copyUser / this.newTeacher : ",this.newTeacher);

  }  

  private init(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();

    // 로그인한 유저 정보를 가져옵니다.
    this.setLoginUser();

    // 페이지 진입을 기록으로 남깁니다.
    this.logActionPage();

  } // end init

  private fillViewTeacherInfo() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / fillViewTeacherInfo");
    if(isDebug) console.log("apply-teacher / fillViewTeacherInfo / this.loginUser : ",this.loginUser);

    if(null == this.newTeacher) {
      if(isDebug) console.log("apply-teacher / fillViewTeacherInfo / 중단 / this.newTeacher is not valid!");
      return;
    }

    // email
    if(null != this.emailComponent) {
      if(isDebug) console.log("apply-teacher / fillViewTeacherInfo / this.newTeacher.email : ",this.newTeacher.email);
      this.emailComponent.setInput(this.newTeacher.email);
    }
    this.email = this.newTeacher.email;

    // name
    if(null != this.nameComponent) {
      if(isDebug) console.log("apply-teacher / fillViewTeacherInfo / this.newTeacher.name : ",this.newTeacher.name);
      this.nameComponent.setInput(this.newTeacher.name);
    }
    this.name = this.newTeacher.name;
  
    // nickname
    if(null != this.nicknameComponent) {
      if(isDebug) console.log("apply-teacher / fillViewTeacherInfo / this.newTeacher.nickname : ",this.newTeacher.nickname);
      this.nicknameComponent.setInput(this.newTeacher.nickname);
    }
    this.nickname = this.newTeacher.nickname;

    // thumbnail
    this.profileImgUploadComponent.setProfileImg(this.newTeacher.thumbnail);
    this.thumbnail = this.newTeacher.thumbnail;

    // mobile
    let mobile:string = this.newTeacher.mobile;
    let mobileArr:string[] = mobile.split("-");
    if(isDebug) console.log("apply-teacher / fillViewTeacherInfo / mobileArr : ",mobileArr);
    if(null != mobileArr && 3 === mobileArr.length) {
      this.mobileComponent.setMobileHead(mobileArr[0]);
      this.mobileComponent.setMobileBody(mobileArr[1]);
      this.mobileComponent.setMobileTail(mobileArr[2]);
    }

    // gender
    this.genderComponent.setGender(this.newTeacher.gender);

    // birthday
    let birthday:string = this.newTeacher.birthday;
    let birthdayArr:string[] = birthday.split("-");
    if(isDebug) console.log("apply-teacher / fillViewTeacherInfo / birthdayArr : ",birthdayArr);
    if(null != birthdayArr && 3 === birthdayArr.length) {
      this.birthdayComponent.setBirthYear(birthdayArr[0]);
      this.birthdayComponent.setBirthMonth(birthdayArr[1]);
      this.birthdayComponent.setBirthDay(birthdayArr[1], birthdayArr[2]);
    }

  }  

  private logActionPage() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / logActionPage / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.watchTower.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeSignupTeacher
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(isDebug) console.log("apply-teacher / logActionPage / myResponse : ",myResponse);
    })
  }

  private logError(errorType:string, errMsg:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / logError / 시작");

    if(null == errorType) {
      return;
    }
    if(null == errMsg) {
      return;
    }

    // 에러 로그 등록
    this.myLoggerService.logError(
      // apiKey:string
      this.watchTower.getApiKey(),
      // errorType:string
      errorType,
      // errorMsg:string
      errMsg
    ).then((myResponse:MyResponse) => {

      if(isDebug) console.log("apply-teacher / logError / myResponse : ",myResponse);

    }); // end logError

  }  

  private setLoginUser() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / setLoginUser / 시작");

    // 로그인 데이터를 가져옵니다.
    let loginUser:User = this.watchTower.getLoginUser();
    if(null != loginUser) {

      this.loginUser = loginUser;
      if(isDebug) console.log("apply-teacher / setLoginUser / this.loginUser : ",this.loginUser);

      // 가져온 유저 정보로 선생님 객체를 만듭니다.
      this.copyUser();

      // 가져온 유저 정보로 선생님 입력란을 채웁니다.
      this.fillViewTeacherInfo();

    } else {

      // 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.
      // 로그인 이후, 선생님 등록 페이지로 리다이렉트 데이터를 전달해야 합니다.

      if(isDebug) console.log("apply-teacher / setLoginUser / 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.");

      let req_url = this.urlService.get('#/login?redirect=/applyteacher');
      if(isDebug) console.log("apply-teacher / setLoginUser / req_url : ",req_url);

      window.location.href = req_url;

    } // end if

  }

  // @ Desc : DefaultComponent로 부터 원하는 input component를 가져옵니다.
  private getInput(eventKey:string) :any {

    return this.defaultService.getInput(this.inputComponentList, eventKey);

  }  

  onChangedFromChild(myEvent:MyEvent, myinfo, myhistory, mypayment, myfavorite) {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / onChangedFromChild / init");
    if(isDebug) console.log("apply-teacher / onChangedFromChild / myEvent : ",myEvent);
    if(isDebug) console.log("apply-teacher / onChangedFromChild / myEvent.key : ",myEvent.key);

    if(myEvent.isNotValid()) {
      if(isDebug) console.log("apply-teacher / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
      // TODO - Error Logger
      return;
    }

    if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_USER_NAME)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_NAME");

        let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if(!isOK) {
          if(isDebug) console.log("apply-teacher / onChangedFromChild / 중단 / 이름이 유효하지 않습니다.");
          return;
        }

        // 1. loginUser객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("name", myEvent.value);
        // end if - ON CHANGE - KEY_USER_NAME

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_NICKNAME)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_NICKNAME");

        let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if(!isOK) {
          if(isDebug) console.log("apply-teacher / onChangedFromChild / 중단 / 이름이 유효하지 않습니다.");
          return;
        }

        // 1. loginUser객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("nickname", myEvent.value);
        // end if - ON CHANGE - KEY_USER_NICKNAME

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_THUMBNAIL)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_THUMBNAIL");

        let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if(!isOK) {
          if(isDebug) console.log("apply-teacher / onChangedFromChild / 중단 / 이름이 유효하지 않습니다.");
          return;
        }

        // 1. loginUser객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("thumbnail", myEvent.value);
        // end if - ON CHANGE - KEY_USER_THUMBNAIL

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_HEAD)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_MOBILE_NUM_HEAD");

        let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if(!isOK) {
          if(isDebug) console.log("apply-teacher / onChangedFromChild / 중단 / 전화번호 첫번째 3자리가 유효하지 않습니다.");
          return;
        }

        // 1. loginUser객체와 비교, 변경된 전화번호 첫 3자리 인지 확인합니다.
        // 새로운 전화번호라면 변수에 저장합니다.
        this.updateNewMobileHead(myEvent.value);
        // end if - ON CHANGE - KEY_USER_MOBILE_NUM_HEAD

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_BODY)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_MOBILE_NUM_BODY");

        let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if(!isOK) {
          if(isDebug) console.log("apply-teacher / onChangedFromChild / 중단 / 전화번호 두번째 4자리가 유효하지 않습니다.");
          return;
        }

        // 1. loginUser객체와 비교, 변경된 전화번호 첫 3자리 인지 확인합니다.
        // 새로운 전화번호라면 변수에 저장합니다.
        this.updateNewMobileBody(myEvent.value);
        // end if - ON CHANGE - KEY_USER_MOBILE_NUM_BODY

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_TAIL)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_MOBILE_NUM_TAIL");

        let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if(!isOK) {
          if(isDebug) console.log("apply-teacher / onChangedFromChild / 중단 / 전화번호 마지막 4자리가 유효하지 않습니다.");
          return;
        }

        // 1. loginUser객체와 비교, 변경된 전화번호 마지막 4자리 인지 확인합니다.
        // 새로운 전화번호라면 변수에 저장합니다.
        this.updateNewMobileTail(myEvent.value);
        // end if - ON CHANGE - KEY_USER_MOBILE_NUM_TAIL

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_YEAR)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_BIRTH_YEAR");

        let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if(!isOK) {
          if(isDebug) console.log("apply-teacher / onChangedFromChild / 중단 / 생일-연도가 유효하지 않습니다.");
          return;
        }

        this.updateNewBirthYear(myEvent.value);
        // end if - ON CHANGE - KEY_USER_BIRTH_YEAR

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_MONTH)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_BIRTH_MONTH");

        let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if(!isOK) {
          if(isDebug) console.log("apply-teacher / onChangedFromChild / 중단 / 생일-월이 유효하지 않습니다.");
          return;
        }        

        this.updateNewBirthMonth(myEvent.value);
        // end if - ON CHANGE - KEY_USER_BIRTH_MONTH

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_DAY)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_BIRTH_DAY");

        let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if(!isOK) {
          if(isDebug) console.log("apply-teacher / onChangedFromChild / 중단 / 생일-날짜 유효하지 않습니다.");
          return;
        }   

        this.updateNewBirthDay(myEvent.value);
        // end if - ON CHANGE - KEY_USER_BIRTH_DAY

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_GENDER)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_BIRTH_DAY");

        let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if(!isOK) {
          if(isDebug) console.log("apply-teacher / onChangedFromChild / 중단 / 생일-날짜 유효하지 않습니다.");
          return;
        }   

        this.updateNewProp("gender", myEvent.value);
        // end if - ON CHANGE - KEY_USER_GENDER

      } // end if - ON CHANGE
    
    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE_NOT_VALID)) {

      this.myEventService.onChangeNotValid(myEvent);

    } // end if


  } // end method

  private isOKBirthday(birthYear:string, birthMonth:string, birthDay:string):boolean {

    if(!this.birthdayComponent.isOKBirthYear(birthYear)) {
      return false;
    }
    if(!this.birthdayComponent.isOKBirthMonth(birthMonth)) {
      return false;
    }
    if(!this.birthdayComponent.isOKBirthDay(birthDay)) {
      return false;
    }
    return true;
  }
  private updateNewMobileHead(newMobileHead:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / updateNewMobileHead / init");

    if(!this.mobileComponent.isOKHead(newMobileHead)) {
      if(isDebug) console.log("apply-teacher / updateNewMobileHead / 중단 / newMobileHead is not valid!");
      return;
    }

    if(this.newTeacher.isSameMobileHead(newMobileHead)) {
      if(isDebug) console.log("apply-teacher / updateNewMobileHead / 중단 / newMobileHead is not changed!");
      return;
    }

    // let mobileHead:string = this.mobileNumHead = this.newTeacher.getMobileHead();
    let mobileHead:string = this.mobileNumHead = newMobileHead;
    let mobileBody:string = this.mobileNumBody = this.newTeacher.getMobileBody();
    let mobileTail:string = this.mobileNumTail = this.newTeacher.getMobileTail();

    let newMobile:string = `${mobileHead}-${mobileBody}-${mobileTail}`;

    if(isDebug) console.log("apply-teacher / updateNewMobileHead / newMobile : ",newMobile);

    this.newTeacher.mobile = newMobile;

    // 저장 버튼 노출
    this.hasChanged=true;
  }
  private updateNewMobileBody(newMobileBody:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / updateNewMobileBody / init");

    if(!this.mobileComponent.isOKBody(newMobileBody)) {
      if(isDebug) console.log("apply-teacher / updateNewMobileBody / 중단 / newMobileBody is not valid!");
      return;
    }

    if(this.newTeacher.isSameMobileBody(newMobileBody)) {
      if(isDebug) console.log("apply-teacher / updateNewMobileBody / 중단 / newMobileBody is not changed!");
      return;
    }

    let mobileHead:string = this.mobileNumHead = this.newTeacher.getMobileHead();
    // let mobileBody:string = this.mobileNumBody = this.newTeacher.getMobileBody();
    let mobileBody:string = this.mobileNumBody = newMobileBody;
    let mobileTail:string = this.mobileNumTail = this.newTeacher.getMobileTail();

    let newMobile:string = `${mobileHead}-${mobileBody}-${mobileTail}`;

    if(isDebug) console.log("apply-teacher / updateNewMobileBody / newMobile : ",newMobile);

    this.newTeacher.mobile = newMobile;

    // 저장 버튼 노출
    this.hasChanged=true;
  }
  private updateNewMobileTail(newMobileTail:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / updateNewMobileTail / init");

    if(!this.mobileComponent.isOKTail(newMobileTail)) {
      if(isDebug) console.log("apply-teacher / updateNewMobileTail / 중단 / newMobileTail is not valid!");
      return;
    }

    if(this.newTeacher.isSameMobileTail(newMobileTail)) {
      if(isDebug) console.log("apply-teacher / updateNewMobileTail / 중단 / newMobileTail is not changed!");
      return;
    }

    let mobileHead:string = this.mobileNumHead = this.newTeacher.getMobileHead();
    let mobileBody:string = this.mobileNumBody = this.newTeacher.getMobileBody();
    // let mobileTail:string = this.mobileNumTail = this.newTeacher.getMobileTail();
    let mobileTail:string = this.mobileNumTail = newMobileTail;

    let newMobile:string = `${mobileHead}-${mobileBody}-${mobileTail}`;

    if(isDebug) console.log("apply-teacher / updateNewMobileTail / newMobile : ",newMobile);

    this.newTeacher.mobile = newMobile;    

    // 저장 버튼 노출
    this.hasChanged=true;
  }

  private updateNewBirthYear(newBirthYear:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / updateNewBirthYear / init");

    if(!this.birthdayComponent.isOKBirthYear(newBirthYear)) {
      if(isDebug) console.log("apply-teacher / updateNewBirthYear / 중단 / newBirthYear is not valid!");
      return;
    }

    if(this.newTeacher.isSameBirthYear(newBirthYear)) {
      if(isDebug) console.log("apply-teacher / updateNewBirthYear / 중단 / newBirthYear is not changed!");
      return;
    }

    // let birthYear:string = this.mobileNumHead = this.newTeacher.getBirthYear();
    let birthYear:string = this.birthYear = newBirthYear;
    let birthMonth:string = this.birthMonth = this.newTeacher.getBirthMonth();
    let birthDay:string = this.birthDay = this.newTeacher.getBirthDay();

    let newBirthday:string = `${birthYear}-${birthMonth}-${birthDay}`;

    if(isDebug) console.log("apply-teacher / updateNewBirthYear / newBirthday : ",newBirthday);

    this.newTeacher.birthday = newBirthday;

    // 저장 버튼 노출
    if(this.isOKBirthday(birthYear, birthMonth, birthDay)) {
      this.hasChanged=true;
    }
  }
  private updateNewBirthMonth(newBirthMonth:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / updateNewBirthMonth / init");

    if(!this.birthdayComponent.isOKBirthMonth(newBirthMonth)) {
      if(isDebug) console.log("apply-teacher / updateNewBirthMonth / 중단 / newBirthMonth is not valid!");
      return;
    }

    if(this.newTeacher.isSameBirthMonth(newBirthMonth)) {
      if(isDebug) console.log("apply-teacher / updateNewBirthMonth / 중단 / newBirthMonth is not changed!");
      return;
    }

    let birthYear:string = this.mobileNumHead = this.newTeacher.getBirthYear();
    // let birthMonth:string = this.birthMonth = this.newTeacher.getBirthMonth();
    let birthMonth:string = this.birthMonth = newBirthMonth;
    let birthDay:string = this.birthDay = this.newTeacher.getBirthDay();

    let newBirthday:string = `${birthYear}-${birthMonth}-${birthDay}`;

    if(isDebug) console.log("apply-teacher / updateNewBirthMonth / newBirthday : ",newBirthday);

    this.newTeacher.birthday = newBirthday;

    // 저장 버튼 노출
    if(this.isOKBirthday(birthYear, birthMonth, birthDay)) {
      this.hasChanged=true;
    }
  }
  private updateNewBirthDay(newBirthDay:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / updateNewBirthDay / init");

    if(!this.birthdayComponent.isOKBirthDay(newBirthDay)) {
      if(isDebug) console.log("apply-teacher / updateNewBirthDay / 중단 / newBirthDay is not valid!");
      return;
    }

    if(this.newTeacher.isSameBirthDay(newBirthDay)) {
      if(isDebug) console.log("apply-teacher / updateNewBirthDay / 중단 / newBirthDay is not changed!");
      return;
    }

    let birthYear:string = this.mobileNumHead = this.newTeacher.getBirthYear();
    let birthMonth:string = this.birthMonth = this.newTeacher.getBirthMonth();
    // let birthDay:string = this.birthDay = this.newTeacher.getBirthDay();
    let birthDay:string = this.birthDay = newBirthDay;

    let newBirthday:string = `${birthYear}-${birthMonth}-${birthDay}`;

    if(isDebug) console.log("apply-teacher / updateNewBirthDay / newBirthday : ",newBirthday);

    this.newTeacher.birthday = newBirthday;

    // 저장 버튼 노출
    if(this.isOKBirthday(birthYear, birthMonth, birthDay)) {
      this.hasChanged=true;
    }
  }    


  private updateNewProp(key:string, newValue:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / updateNewProp / init");

    if(null == key || "" == key) {
      if(isDebug) console.log("apply-teacher / updateNewProp / 중단 / key is not valid!");
      return;
    }
    if(null == this.newTeacher) {
      if(isDebug) console.log("apply-teacher / updateNewProp / 중단 / this.newTeacher is not valid!");
      return;
    }

    let valueFromDB:string = this.loginUser[key];
    if(valueFromDB !== newValue) {
      // 1-1. 변경된 값이라면 업데이트.
      if(null != this[key]) {
        this[key] = newValue;
      }
      // 변경된 이름을 복사해둔 loginUserCopy에 저장합니다.
      if(null != this.newTeacher && null != this.newTeacher[key]) {
        this.newTeacher[key] = newValue;
        if(isDebug) console.log("apply-teacher / updateNewProp / 변경된 이름을 복사해둔 loginUserCopy에 저장합니다.");
        if(isDebug) console.log("apply-teacher / updateNewProp / this.newTeacher : ",this.newTeacher);
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
    if(isDebug) console.log("apply-teacher / onClickSave / init");

    let hasChanged:boolean = this.checkUserInfoChanged();
    if(isDebug) console.log("apply-teacher / onClickSave / hasChanged : ",hasChanged);
    if(isDebug) console.log("apply-teacher / onClickSave / this.newTeacher : ",this.newTeacher);
    if(hasChanged) {

      // 변경되었다면 저장합니다.
      if(isDebug) console.log("apply-teacher / onClickSave / 변경되었다면 저장합니다.");

      /*
      this.userService.updateUserByUser(
        this.watchTower.getApiKey(),
        this.newTeacher
      ).then((myResponse:MyResponse) => {

        if(isDebug) console.log("apply-teacher / onClickSave / 유저정보 업데이트 / myResponse : ",myResponse);

        let userUpdated = myResponse.digDataProp(["user"]);
        if(myResponse.isSuccess && null != userUpdated) {
          // 저장된 유저 정보를 다시 받아옵니다.
          // 받아온 유저 정보로 업데이트 합니다.
          this.loginUser.updateWithJSON(userUpdated);
          this.newTeacher.updateWithJSON(userUpdated);

          if(isDebug) console.log("apply-teacher / onClickSave / 받아온 유저 정보로 업데이트 합니다.");
          if(isDebug) console.log("apply-teacher / onClickSave / this.loginUser : ",this.loginUser);
          if(isDebug) console.log("apply-teacher / onClickSave / this.newTeacher : ",this.newTeacher);

        } else {
          // Error Report
          
        } // end if
      }); // end service
      */
    }

    // 저장 버튼 비활성화.
    this.hasChanged=false;

  }

  private checkUserInfoChanged() :boolean {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / checkUserInfoChanged / init");
    if(isDebug) console.log("apply-teacher / checkUserInfoChanged / this.loginUser : ",this.loginUser);

    let mobileHead:string = this.loginUser.getMobileHead();
    let mobileBody:string = this.loginUser.getMobileBody();
    let mobileTail:string = this.loginUser.getMobileTail();

    // 생일은 선택 입력이므로 없을 수도 있습니다.
    let birthYear:string = this.loginUser.getBirthYear();
    let birthMonth:string = this.loginUser.getBirthMonth();
    let birthDay:string = this.loginUser.getBirthDay();

    // 검사 시작!
    let hasChanged:boolean = false;

    if( this.nameComponent.isOK(this.name) && 
        this.name !== this.loginUser.name) {
      // 1. name
    if(isDebug) console.log("apply-teacher / checkUserInfoChanged / 이름이 변경됨");
      hasChanged = true;
    } else if(  this.nicknameComponent.isOK(this.nickname) && 
                this.nickname !== this.loginUser.nickname) {
      // 2. nickname
      if(isDebug) console.log("apply-teacher / checkUserInfoChanged / 닉네임이 변경됨");
      hasChanged = true;
    } else if(  this.profileImgUploadComponent.isOK(this.thumbnail) && 
                this.thumbnail !== this.loginUser.thumbnail) {
      // 3. profile-img
      if(isDebug) console.log("apply-teacher / checkUserInfoChanged / 섬네일이 변경됨");
      hasChanged = true;
    } else if( this.mobileComponent.isOKHead(this.mobileNumHead) && 
        mobileHead !== this.mobileNumHead) {
      // 4-1. mobile head
      if(isDebug) console.log("apply-teacher / checkUserInfoChanged / 휴대전화 첫 3자리 변경됨");
      hasChanged = true;
    } else if( this.mobileComponent.isOKBody(this.mobileNumBody) && 
        mobileBody !== this.mobileNumBody) {
      // 4-2. mobile body
      if(isDebug) console.log("apply-teacher / checkUserInfoChanged / 휴대전화 두번째 4자리 변경됨");
      hasChanged = true;
    } else if( this.mobileComponent.isOKTail(this.mobileNumTail) && 
        mobileTail !== this.mobileNumTail) {
      // 4-3. mobile tail
      if(isDebug) console.log("apply-teacher / checkUserInfoChanged / 휴대전화 세번째 4자리 변경됨");
      hasChanged = true;
    } else if(  this.genderComponent.isOK(this.gender) && 
                this.gender !== this.loginUser.gender) {
      // 5. gender
      if(isDebug) console.log("apply-teacher / checkUserInfoChanged / 성별 변경됨");
      hasChanged = true;
    } else if( this.birthdayComponent.isOKBirthYear(this.birthYear) && 
        birthYear !== this.birthYear) {
      // 6-1. birthYear
      if(isDebug) console.log("apply-teacher / checkUserInfoChanged / 생일 - 연도 변경됨");
      hasChanged = true;
    } else if( this.birthdayComponent.isOKBirthMonth(this.birthMonth) && 
        birthMonth !== this.birthMonth) {
      // 6-2. birthMonth
      if(isDebug) console.log("apply-teacher / checkUserInfoChanged / 생일 - 월 변경됨");
      hasChanged = true;
    } else if( this.birthdayComponent.isOKBirthDay(this.birthDay) && 
        birthDay !== this.birthDay) {
      // 6-3. birthDay
      if(isDebug) console.log("apply-teacher / checkUserInfoChanged / 생일 - 일 변경됨");
      hasChanged = true;

    } // end if

    return hasChanged;
  }  

} // end class