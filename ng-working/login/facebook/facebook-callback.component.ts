import {  Component, 
          Input, 
          Output,
          OnInit, 
          OnDestroy}            from '@angular/core';
import {  Subscription }        from 'rxjs';          
import {  Router,
          ActivatedRoute }      from '@angular/router';
import { LoginService }         from '../service/login.service';
import { UserService }          from '../../users/service/user.service';
import { MyLoggerService }      from '../../util/service/my-logger.service';


@Component({
  moduleId: module.id,
  selector: 'facebook-callback',
  templateUrl: 'facebook-callback.component.html',
  styleUrls: [ 'facebook-callback.component.css' ]
})
export class FacebookCallbackComponent implements OnInit, OnDestroy {

  private code:string;
  private state:string;

  private redirectUrl:string="/class-center";

  private isValidState:boolean=false;

  private subscription: Subscription;

  constructor(  public loginService: LoginService,
                public myLoggerService:MyLoggerService,
                private userService:UserService,
                private activatedRoute: ActivatedRoute,
                public router: Router) {

    // Do something...
  } // end function

  ngOnInit(): void {

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(this.myLoggerService.pageKeyLoginFacebook);

    // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {

        this.code = param['code'];
        this.state = param['state'];

        if(  null != this.code && 
             "" != this.code && 
             null != this.state && 
             "" != this.state) {

          this.getState(this.state, this.code);
        } // end if
      }
    ); // end subscribe


  } // end function

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }  


  private getState(state:string, code:string) :void {

    if(null == state || "" == state) {
      return;
    }
    if(null == code || "" == code) {
      return;
    }

    this.loginService
    .getFacebookState(state)
    .then(result => {

      if( null != result &&
          null != result.is_valid_state ) {

        this.isValidState = result.is_valid_state;
      }

      // Session에 저장된 state와 비교합니다.
      if(this.isValidState) {

        // 1. state가 정상적일 경우, 다음 단계를 진행
        console.log("facebook-callback / getFacebookState / result : ",result);

        this.getAccessToken(code);

      } else {

        // 2. state가 다를 경우, 사용자에게 메시지 노출. '비정상적인 접근입니다.'. 메시지 확인 뒤, 로그인 홈으로 이동.
        // - 상황 정보를 로그로 남김. ex) '비정상 로그인 접근'
      }
    }); 

  } // end function

  private getAccessToken(code:string) :void {

    this.loginService
    .getFacebookAccess(code)
    .then(result => {

      console.log("facebook-callback / getAccessToken / result : ",result);

      if( null != result && null != result.access_token ) {
        this.getMe();
      }

    });     

  }

  private getMe() :void {

    let isDebug:boolean = true;
    if(isDebug) console.log("facebook-callback / getMe / init");

    this.loginService
    .getFacebookMe()
    .then(result => {

      if(isDebug) console.log("facebook-callback / getMe / result : ",result);

      if(null == result || null == result.facebook_id) {
        // TODO - 페이스북에서 유저 정보를 가져오는데 실패했습니다. 로그를 기록, 홈으로 이동합니다.
        return;
      }

      // 페이스북 로그인 성공!
      // 로그인한 유저 정보를 가져오는데 성공했습니다!
      if( null == result.gender ||
          "" === result.gender ||
          null == result.mobile ||
          "" === result.mobile ) {

        // 1. mobile, gender가 없다면 정상 등록된 유저가 아님. 회원 가입 창으로 이동.
        this.router.navigate(['/login/signup/facebook', result.facebook_id]);
          
      } else {

        // 2. mobile, gender가 있다면 정상 등록된 유저. 로그인 창으로 리다이렉트.
        this.router.navigate([this.redirectUrl]);
        
      } // end if

    }); // end service

  }

} // end class