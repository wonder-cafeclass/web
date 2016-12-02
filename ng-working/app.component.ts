import { Component, 
		 OnInit }					from '@angular/core';

import { Router,
         ActivatedRoute,
         Params }               	from '@angular/router';

import { UrlService }          		from './util/url.service';
import { AuthService }          	from './auth.service';
import { ImageService }         	from './util/image.service';
import { UserService }         		from './users/service/user.service';
import { MyEventWatchTowerService } from './util/service/my-event-watchtower.service';
import { MyCheckerService }     	from './util/service/my-checker.service';

import { User } 					from './users/model/user';

@Component({
	moduleId: module.id,
	selector: 'my-app',
	styleUrls: ['app.component.css'],
	templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

	// admin server 여부를 판별합니다.
	constructor(	private authService:AuthService,
					private urlService:UrlService,
					private userService:UserService,
					public imageService:ImageService,
					private myEventWatchTowerService:MyEventWatchTowerService,
					private myCheckerService:MyCheckerService,
					private route:ActivatedRoute,
					public router:Router) {

		// Do something...

	}

	isAdmin:boolean=false;
	loginUser:User;
	toggleTopMenu:boolean=true;
	ngOnInit(): void {

		// 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
		this.authService.getAdminAuth().then(
			result => {
				if(null != result.is_admin) {
					this.isAdmin = result.is_admin;
				}
			}
		);

		// Subscribe login user
		this.myEventWatchTowerService.loginAnnounced$.subscribe(
			(loginUser:User) => {

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
		});	

		// Subscribe toggle top menu
		// 최상단 메뉴를 보이거나 감춥니다.
		this.myEventWatchTowerService.toggleTopMenuAnnounced$.subscribe(
			(toggleTopMenu:boolean) => {
			this.toggleTopMenu = toggleTopMenu;
		});				

		// 회원 로그인 쿠키를 가져옵니다.
		// 로그인 이후 만들어진 쿠키와 유저 정보가 있다면 DB를 통해 가져옵니다.
		this.myCheckerService.getReady().then(() => {
			this.userService.getUserCookie(this.myCheckerService.getAPIKey()).then(result => {
				if(null != result && null != result.user) {
					this.loginUser = result.user;

					// 회원 로그인 정보를 가져왔다면, 가져온 로그인 정보를 다른 컴포넌트들에게도 알려줍니다.
					this.myEventWatchTowerService.announceLogin(this.loginUser);
				}
			});
		}); // end Promise
	}

	onErrorThumbnail(event, thumbnail) :void{
		event.stopPropagation();
		event.preventDefault();

		// TODO - 이미지 없을 경우의 예비 이미지 로딩.

		console.log("onErrorThumbnail / thumbnail : ",thumbnail);
	}


	onClickSignupBtn(event) :void{
		event.stopPropagation();
		event.preventDefault();

		// 가입하기 페이지로 이동!
		this.router.navigate(['/login/signup/select']);
	}

	onClickThumbnail(event) :void {
		event.stopPropagation();
		event.preventDefault();
		
		// 내정보로 이동합니다.
	}

}