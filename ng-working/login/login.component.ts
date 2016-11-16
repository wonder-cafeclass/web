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

  // @ViewChild('iframe') iframe:ElementRef;
  private childContentWindow;

  kakaoAuthUrl: string;

  naverAuthUrl: string;

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

  }

  ngOnInit(): void {

    // 각 플랫폼 별로 로그인 할 수 있는 주소들을 가져옵니다.

    // 1. kakao
    this.loginService
    .getKakaoAuthUrl()
    .then(kakaoAuthUrl => {
      this.kakaoAuthUrl = kakaoAuthUrl;      
    });

    // 2. naver
    this.loginService
    .getNaverAuthUrl()
    .then(naverAuthUrl => {
      this.naverAuthUrl = naverAuthUrl;
    });

    // REMOVE ME
    /*
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
    */
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
   
}
