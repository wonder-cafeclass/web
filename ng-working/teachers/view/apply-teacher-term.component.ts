import {  Component, 
          Input, 
          Output,
          OnInit, 
          AfterViewInit }             from '@angular/core';
import {  Router }                    from '@angular/router';

import { UrlService }                 from "../../util/url.service";
import { MyLoggerService }            from '../../util/service/my-logger.service';
import { MyEventWatchTowerService }   from '../../util/service/my-event-watchtower.service';
import { MyEventService }             from '../../util/service/my-event.service';
import { MyEvent }                    from '../../util/model/my-event';
import { MyCheckerService }           from '../../util/service/my-checker.service';
import { MyChecker }                  from '../../util/model/my-checker';
import { MyResponse }                 from '../../util/model/my-response';

import { User }                 from '../../users/model/user';


@Component({
  moduleId: module.id,
  selector: 'apply-teacher-term',
  templateUrl: 'apply-teacher-term.component.html',
  styleUrls: [ 'apply-teacher-term.component.css' ]
})
export class ApplyTeacherTermComponent implements OnInit, AfterViewInit {

  private isAdmin:boolean = false;
  private loginUser:User;
  private hasAgreedWithTerms:boolean = false;
  public isShowTooltip:boolean=false;
  public tooltipMsgTerms:string=null;
  private tooltipMsgTermsWarning:string="약관 동의가 필요합니다.";

  constructor(  private watchTower:MyEventWatchTowerService,
                private myEventService:MyEventService,
                private myLoggerService:MyLoggerService,
                private myCheckerService:MyCheckerService,
                private urlService:UrlService,
                public router:Router) {

  } // end function

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher-term / ngOnInit / 시작");

    // 선생님 등록화면에서는 상,하단 메뉴를 가립니다.
    this.watchTower.announceToggleTopMenu(false);

  } // end function

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher-term / ngAfterViewInit");

    this.asyncViewPack();
  }  

  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher-term / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다.
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("apply-teacher-term / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("apply-teacher-term / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      
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

  private init(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher-term / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();

    // 페이지 진입을 기록으로 남깁니다.
    this.logActionPage();

    // 로그인한 유저 정보를 가져옵니다.
    this.setLoginUser();

  } // end init

  private logActionPage() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher-term / logActionPage / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.watchTower.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeApplyTeacherTerm
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(isDebug) console.log("apply-teacher-term / logActionPage / myResponse : ",myResponse);
    })
  }

  private logError(errorType:string, errMsg:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher-term / logError / 시작");

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

      if(isDebug) console.log("apply-teacher-term / logError / myResponse : ",myResponse);

    }); // end logError

  }  

  private setLoginUser() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher-term / setLoginUser / 시작");

    // 로그인 데이터를 가져옵니다.
    let loginUser:User = this.watchTower.getLoginUser();
    if(null != loginUser) {

      this.loginUser = loginUser;
      if(isDebug) console.log("apply-teacher-term / setLoginUser / this.loginUser : ",this.loginUser);

    } else {

      // 로그인이 되어 있지 않다면, 로그인 페이지로 이동합니다.
      if(isDebug) console.log("apply-teacher-term / setLoginUser / 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.");

      let req_url = this.urlService.get('#/login?redirect=/applyteacherterm');
      if(isDebug) console.log("apply-teacher-term / setLoginUser / req_url : ",req_url);

      window.location.href = req_url;

    } // end if

  }

  onChangeCheckTerms(event, checkboxTerms): void {

    event.preventDefault();
    event.stopPropagation();

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("signup / onChangeCheckTerms / 시작");

    if(null != checkboxTerms) {
      this.hasAgreedWithTerms = checkboxTerms.checked;
    }
    if(this.hasAgreedWithTerms) {
      this.isShowTooltip = false;
      this.tooltipMsgTerms = null;
    } else {
      // 동의 하지 않았으므로 경고 문구를 보여줍니다.
      this.isShowTooltip = true;
      this.tooltipMsgTerms = this.tooltipMsgTermsWarning;
    }

  }  

  onClickSignup(event): void {

    event.preventDefault();
    event.stopPropagation();

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("signup / onClickSignup / 시작");    

    // 약관 동의 확인. 
    if(!this.hasAgreedWithTerms) {

      if(isDebug) console.log("signup / onClickSignup / this.hasAgreedWithTerms : ",this.hasAgreedWithTerms);
      if(isDebug) console.log("signup / onClickSignup / 약관 동의가 필요하다는 경고 메시지를 띄웁니다.");

      // 약관 동의가 필요하다는 경고 메시지를 띄웁니다.
      this.isShowTooltip = true;
      this.tooltipMsgTerms = this.tooltipMsgTermsWarning;

    } else {

      // 문제 없음. 선샌님 등록 페이지로 이동.
      this.isShowTooltip = false;
      if(isDebug) console.log("signup / onClickSignup / 문제 없음. 선샌님 등록 페이지로 이동.");
      this.router.navigate(['/applyteacher']);

    } // end if



  } // end method  

} // end class