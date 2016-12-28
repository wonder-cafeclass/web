import { Component,
		 AfterViewChecked,
		 OnInit }					from '@angular/core';

import { Router,
         ActivatedRoute,
         Params }               	from '@angular/router';

import { UrlService }          		from './util/url.service';
import { AuthService }          	from './auth.service';
import { ImageService }         	from './util/image.service';
import { UserService }         		from './users/service/user.service';
import { TeacherService }         	from './teachers/service/teacher.service';
import { MyEventWatchTowerService } from './util/service/my-event-watchtower.service';
import { MyCheckerService }     	from './util/service/my-checker.service';
import { MyEventService }     		from './util/service/my-event.service';
import { MyLoggerService }          from './util/service/my-logger.service';

import { MyResponse }               from './util/model/my-response';

import { User } 					from './users/model/user';
import { Teacher } 					from './teachers/model/teacher';

@Component({
	moduleId: module.id,
	selector: 'my-app',
	styleUrls: ['app.component.css'],
	templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, AfterViewChecked {

	// admin server 여부를 판별합니다.
	constructor(	private authService:AuthService,
					private urlService:UrlService,
					private userService:UserService,
					private teacherService:TeacherService,
					public imageService:ImageService,
					private watchTower:MyEventWatchTowerService,
					private myEventService:MyEventService,
					private myCheckerService:MyCheckerService,
					private myLoggerService:MyLoggerService,
					private route:ActivatedRoute,
					public router:Router) {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("app-root / constructor / 시작");

		this.watchTower.announceMyEventService(this.myEventService);
		this.watchTower.announceMyCheckerService(this.myCheckerService);

	}

	isAdmin:boolean=false;
	loginUser:User;
	loginTeacher:Teacher;
	toggleTopMenu:boolean=true;

	errorMsgArr: string[]=[];

	ngOnInit(): void {

		this.subscribeAllErrors();
		this.subscribeLoginUser();
		this.subscribeLoginTeacher();
		this.subscribeToggleTopMenu();

		this.setIsAdmin();
		this.setMyChecker();

	}

	ngAfterViewChecked() {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("app-root / ngAfterViewChecked / 시작");

		this.watchTower.announceContentHeight();
		
	}


	private subscribeLoginUser() :void {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("app-root / subscribeLoginUser / 시작");

		// 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
		// Subscribe login user
		this.watchTower.loginAnnounced$.subscribe(
			(loginUser:User) => {

			if(isDebug) console.log("app-root / subscribeLoginUser / loginUser : ",loginUser);

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
	}
	private subscribeLoginTeacher() :void {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("app-root / subscribeLoginTeacher / 시작");

		// 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
		// Subscribe login user
		this.watchTower.loginTeacherAnnounced$.subscribe(
			(loginTeacher:Teacher) => {

			if(isDebug) console.log("app-root / subscribeLoginTeacher / loginTeacher : ",loginTeacher);
		
			// 로그인한 선생님 정보가 들어왔습니다.
			this.loginTeacher = this.teacherService.getTeacherFromJSON(loginTeacher);
		});
	}	
	private subscribeToggleTopMenu() :void {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log(`app-root / subscribeToggleTopMenu / 시작`);

		// 최상단 메뉴를 보이거나 감춥니다.
		this.watchTower.toggleTopMenuAnnounced$.subscribe(
			(toggleTopMenu:boolean) => {

			if(isDebug) console.log(`app-root / subscribeToggleTopMenu / toggleTopMenu : ${toggleTopMenu}`);

			this.toggleTopMenu = toggleTopMenu;
		});
	}
	private subscribeAllErrors() :void {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log(`app-root / subscribeAllErrors / 시작`);

		// 화면에 표시할수 있는 발생한 모든 에러에 대해 표시합니다.
		this.watchTower.errorMsgArr$.subscribe(
			(errorMsgArr:string[]) => {

			if(isDebug) console.log(`app-root / subscribeAllErrors / errorMsgArr : `,errorMsgArr);				
			this.errorMsgArr = errorMsgArr;
		});

	}
	private setIsAdmin() :void {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log(`app-root / setIsAdmin / 시작`);

		// 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
		this.authService
		.getAdminAuth()
		.then((myResponse:MyResponse) => {

				if(isDebug) console.log(`app-root / setIsAdmin / myResponse : `,myResponse);

				if(myResponse.isSuccess()) {
					this.isAdmin = myResponse.getDataProp("is_admin");
					this.watchTower.announceIsAdmin(this.isAdmin);
				} else {
			        // 에러 로그 등록
			        this.myLoggerService.logError(
			          // apiKey:string
			          this.watchTower.getApiKey(),
			          // errorType:string
			          this.myLoggerService.errorAPIFailed,
			          // errorMsg:string
			          `app-root / setIsAdmin / Failed!`
			        );
				}
			}
		);		
	}
	private setMyChecker() :void {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log(`app-root / setMyChecker / 시작`);

		// 회원 로그인 쿠키를 가져옵니다.
		// 로그인 이후 만들어진 쿠키와 유저 정보가 있다면 DB를 통해 가져옵니다.
		this.myCheckerService
		.getChecker()
		.then((myResponse:MyResponse) => {

			if(isDebug) console.log(`app-root / setMyChecker / myResponse : `,myResponse);

			// 가져온 체커 정보들을 event-watchtower를 통해 전달합니다.
			this.watchTower.announceMyCheckerServiceReady(
				// checkerMap: any
				myResponse.getDataProp("checker_map"),
				// constMap: any
				myResponse.getDataProp("const_map"),
				// dirtyWordList: any
				myResponse.getDataProp("dirty_word_list"),
				// apiKey: string
				myResponse.getDataProp("api_key")
			);

			this.getLoginUserFromCookie();

		});
	}
	private getLoginUserFromCookie() :void {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log(`app-root / getLoginUserFromCookie / 시작`);

		this.userService
		.getUserCookie(this.watchTower.getApiKey())
		.then((myResponse:MyResponse) => {

			if(isDebug) console.log(`app-root / getLoginUserFromCookie / myResponse : `,myResponse);

			let userFromDB = myResponse.getDataProp("user");
			if(myResponse.isSuccess() && null != userFromDB) {

				let user:User = new User().setJSON(userFromDB);
				if(isDebug) console.log(`app-root / getLoginUserFromCookie / user : `,user);
				this.loginUser = user;

				// 회원 로그인 정보를 가져왔다면, 가져온 로그인 정보를 다른 컴포넌트들에게도 알려줍니다.
				this.watchTower.announceLogin(this.loginUser);

				// 회원이 선생님이라면 선생님 정보를 가져온다.
				this.getTeacherFromUser(+this.loginUser.id);

			} else if(myResponse.isFailed() && null != myResponse.error) {  

				this.watchTower.announceErrorMsgArr([myResponse.error]);
				
	        }			
		});
	}
	private getTeacherFromUser(userId:number) :void {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log(`app-root / getTeacherFromUser / 시작`);
	    if(isDebug) console.log(`app-root / getTeacherFromUser / userId : ${userId}`);

	    this.teacherService
	    .getTeacher(this.watchTower.getApiKey(), userId)
		.then((myResponse:MyResponse) => {

			if(isDebug) console.log(`app-root / getTeacherFromUser / myResponse : `,myResponse);

			let teacherFromDB = myResponse.getDataProp("teacher");
			// 선생님 로그인 여부를 확인, 전파한다.
			this.watchTower.announceLoginTeacher(teacherFromDB);

			this.loginTeacher = this.teacherService.getTeacherFromUser(teacherFromDB);

		}); // end service

	}

	onErrorThumbnail(event, thumbnail) :void{
		event.stopPropagation();
		event.preventDefault();

		// TODO - 이미지 없을 경우의 예비 이미지 로딩.
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

	// 디버깅 모드로 전환하는 방법은 2가지
	// 1. 주소에 파라미터로 ?hawkeye=true 로 작동 
	isDebugging:boolean=false;
	onClickToggleDebugging(event) :void {
		event.stopPropagation();
		event.preventDefault();

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log(`app-root / onClickToggleDebugging / 시작`);

	    this.isDebugging = !this.watchTower.getIsDebugging();

	    if(isDebug) console.log(`app-root / onClickToggleDebugging / this.isDebugging : ${this.isDebugging}`);

	    this.watchTower.announceIsDebugging(this.isDebugging);
	}

}