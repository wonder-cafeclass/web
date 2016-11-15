import {  Component, 
          ElementRef,
          ViewChild,
          NgZone, 
          Input, 
          Output,
          OnInit }    from '@angular/core';
import { Router,
         NavigationExtras }     from '@angular/router';
import { AuthService }          from '../auth/auth.service';
import { LoginService }         from './service/login.service';

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ]
})
export class LoginComponent implements OnInit {

  @ViewChild('iframe') iframe:ElementRef;
  private childContentWindow;

  kakaoAuthUrl: string;
  kakaoCode: string;
  kakaoAccessToken: string;
  kakaoTokenType: string;
  kakaoSignupCodeAlreadyRegisterd: number=-102;

  angularKey: string="angularMyML";

  @Input() cageHeight:number=-1;
  cageHeightStr:string;
  @Input() cageWidth:number=-1;
  cageWidthStr:string;

  isIframeReady:boolean=false;

  constructor(  public authService: AuthService, 
                public loginService: LoginService, 
                private zone:NgZone,
                public router: Router) {

    // set function reference out of app. ( ex)iframe )
    window[this.angularKey] = {
      zone: this.zone, 
      componentFn: (value) => this.callFromOutside(value), 
      component: this
    };

  }

  ngOnInit(): void {

    // 각 플랫폼 별로 로그인 할 수 있는 주소들을 가져옵니다.
    this.loginService
    .getKakaoAuthUrl()
    .then(kakaoAuthUrl => {
       this.kakaoAuthUrl = kakaoAuthUrl;
       if(this.isIframeReady) {
         this.childContentWindow.setKakaoAuthUrl(kakaoAuthUrl); 
       }
    });

    if(0 < this.cageWidth) {
      let borderWidth:number = 2;
      this.cageWidthStr=`${this.cageWidth + borderWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    if(0 < this.cageHeight) {
      this.cageHeightStr=`${this.cageHeight}px`;
    } else {
      this.cageHeightStr="100%";
    }

    // Javascript, ifarme 통신 
    // https://plnkr.co/edit/e77JkHmO7n5FYoKSXnIL?p=preview
    this.childContentWindow = this.iframe.nativeElement.contentWindow;

  }

  // iframe에서 호출하는 함수.
  callFromOutside(myEvent) {

    if(null == myEvent || null == myEvent.key) {
      return;
    }

    console.log("login.component / callFromOutside / myEvent : ",myEvent);

    if("ready_to_init" === myEvent.key) {

      // 에디터의 너비, 높이를 변경합니다.
      // this.setSize(this.cageWidth, this.cageHeight);
      // iframe을 시작합니다.

      this.isIframeReady = true;
      if(null != this.kakaoAuthUrl && "" != this.kakaoAuthUrl) {
        this.childContentWindow.setKakaoAuthUrl(this.kakaoAuthUrl); 
      }

    } else if("authorized_kakao" === myEvent.key) {
      let kakaoCode:string = myEvent.value;

      // 1. kakaoCode를 받아왔습니다. 
      // 2. kakao 사용자 토큰을 받아옵니다.
      // this.getKakaoToken(kakaoCode);
      this.getKakaoToken(kakaoCode);

    }
  } 

  public initIframe(kakao_auth_url:string, naver_auth_url:string, facebook_auth_url:string):void {
    if(null != this.childContentWindow) {
      this.childContentWindow.init(kakao_auth_url, naver_auth_url, facebook_auth_url); 
    }
  }

  // @ Deprecated
  login() {

    this.authService.login().subscribe(() => {
      if (this.authService.isLoggedIn) {

        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/admin';

        // Set our navigation extras object
        // that passes on our global query params and fragment
        let navigationExtras: NavigationExtras = {
          preserveQueryParams: true,
          preserveFragment: true
        };

        // Redirect the user
        this.router.navigate([redirect], navigationExtras);
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  // KAKAO
  // 카카오 로그인 토큰을 가져옵니다.
  private getKakaoToken(kakaoCode:string) :void{

    if(null == kakaoCode || "" == kakaoCode) {
      console.log("!Error! / login.compoenet / ");
      return;
    }

    this.loginService
    .getKakaoToken(kakaoCode)
    .then(result => {
      // this.kakaoToken = kakaoToken;

      console.log("login.component / getKakaoToken / result : ",result);

      if( null != result && 
          null != result.access_token && 
          null != result.token_type) {

        this.kakaoAccessToken = result.access_token;
        this.kakaoTokenType = result.token_type;

        // 유저 앱등록을 진행합니다.
        this.getKakaoSignUp(result.token_type, result.access_token);
      }
    });
  }

  // 유저를 카카오 앱 - cafeclass에 등록합니다. 이미 등록되어 있다면 재등록되지 않습니다.
  private getKakaoSignUp(kakaoTokenType:string, kakaoAccessToken:string) :void {

    this.loginService
    .getKakaoSignUp(kakaoTokenType, kakaoAccessToken)
    .then(result => {
      // this.kakaoToken = kakaoToken;

      console.log("login.component / getKakaoSignUp / result : ",result);

      if( null != result && 
          null != result.code && 
          null != result.msg) {

        let code:number = result.code;
        let msg:string = result.msg;

        if(this.kakaoSignupCodeAlreadyRegisterd === code) {
          // 유저 정보를 가져옵니다.
          this.getKakaoMe(kakaoTokenType, kakaoAccessToken);
        }
      }
    });
  } 

  private getKakaoMe(kakaoTokenType:string, kakaoAccessToken:string) :void {

    this.loginService
    .getKakaoMe(kakaoTokenType, kakaoAccessToken)
    .then(result => {
      // this.kakaoToken = kakaoToken;

      console.log("login.component / getKakaoMe / result : ",result);

      if( null != result && 
          null != result.id) {

        // 로그인이 성공하였습니다. 이전 로그인을 진행했던 페이지로 리다이렉트 합니다.

      }

    });
  }    
}
