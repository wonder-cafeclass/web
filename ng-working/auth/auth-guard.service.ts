import { Injectable }               from '@angular/core';
import { CanActivate, 
         Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot,
         CanActivateChild,
         NavigationExtras,
         CanLoad, 
         Route }                    from '@angular/router';

import { AuthService }              from './auth.service';

import { User }                     from '../users/model/user';
import { MyEventWatchTowerService } from '../util/service/my-event-watchtower.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  private loginUser:User;

  constructor(  private authService:AuthService, 
                private watchTower:MyEventWatchTowerService,
                private router:Router) {

    this.subscribeLoginUser();
  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  subscribeLoginUser() :void {

    // 1. 이미 로그인 유저 정보가 들어왔다면 watchTower로부터 가져옵니다.
    this.loginUser = this.watchTower.getLoginUser();

    if(null == this.loginUser) {
      // 2. 유저 정보가 들어오지 않았다면 watchTower로부터 유저 정보가 들어올때까지 기다립니다.
      this.watchTower.loginAnnounced$.subscribe(
        (user:User) => {

        // 로그인한 유저 정보가 들어왔습니다.
        this.loginUser = user;        

      }); // end subscribe
    } // end if
  } // end method

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {

    if(this.isDebug()) console.log("auth-guard / checkLogin / 시작");

    if(null == this.loginUser) {

      if(this.isDebug()) console.log("auth-guard / checkLogin / 로그인되어 있지 않으면 로그인 창으로 이동");
      this.router.navigate(['/login']);
      return false;

    } else if(null != this.loginUser && !this.loginUser.isAdminUser()) {

      if(this.isDebug()) console.log("auth-guard / checkLogin / 로그인 되어 있지만 운영자가 아니면 홈으로 이동");
      this.router.navigate(['/']);
      return false;

    }
    return true;

    // navigate으로 이동시 데이터를 전달하는 방법. 아래 방법으로 수업 정보를 상세 페이지에서 불러오는 방식이 적절할 듯.
    /*
    if (this.authService.isLoggedIn) { return true; }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Create a dummy session id
    let sessionId = 123456789;

    // Set our navigation extras object
    // that contains our global query params and fragment
    let navigationExtras: NavigationExtras = {
      queryParams: { 'session_id': sessionId },
      fragment: 'anchor'
    };

    // Navigate to the login page with extras
    this.router.navigate(['/login'], navigationExtras);

    return false;
    */
  } // end method

} // end class

