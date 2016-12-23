import { Injectable }           from '@angular/core';
import { Subject }    			from 'rxjs/Subject';

import { User }    				from '../../users/model/user';
import { Teacher }    			from '../../teachers/model/teacher';

import { HelperMyConst }		from '../../util/helper/my-const';

import { MyEventService }		from './my-event.service';
import { MyCheckerService }		from './my-checker.service';
import { MyEvent }				from '../model/my-event';
import { MyChecker }			from '../model/my-checker';
/*
*	@ Desc : 부모와 자식 객체 간의 - 모듈 단위로 부모, 자식 관계라도 상관없음. - 이벤트를 주고 받을수 있는 shared service 객체
*/
@Injectable()
export class MyEventWatchTowerService {

	// @ Required for view
	private isAdmin:boolean = false;
    private checkerMap;
    private constMap;
    private dirtyWordList;
	private apiKey:string = "";
	private isViewPackReady:boolean = false;
	// @ Optional for view
	private loginUser:User;
	private loginTeacher:Teacher;
	private errorMsgArr:string[];
	private contentHeight:number;
	private isLockedBottomFooterFlexible:boolean = false;
	private myEventService:MyEventService;
	private myCheckerService:MyCheckerService;
	private isEventPackReady:boolean = false;

	// Observable sources
	// @ Required for view
	private isAdminSource = new Subject<boolean>();
	private myCheckerServicePackReadySource = new Subject<boolean>();
	private isViewPackReadySource = new Subject<boolean>();
	// @ Optional for view
	private loginAnnouncedSource = new Subject<User>();
	private loginTeacherAnnouncedSource = new Subject<Teacher>();
	private toggleTopMenuAnnouncedSource = new Subject<boolean>();
	private errorMsgArrSource = new Subject<string[]>();
	private contentHeightSource = new Subject<number>();
	private isLockedBottomFooterFlexibleSource = new Subject<boolean>();
	private myEventServiceSource = new Subject<MyEventService>();
	private myCheckerServiceSource = new Subject<MyCheckerService>();
	private isEventPackReadySource = new Subject<boolean>();

	// Observable streams
	// @ Required for view
	isAdmin$ = this.isAdminSource.asObservable();
	myCheckerServicePackReady$ = this.myCheckerServicePackReadySource.asObservable();
	isViewPackReady$ = this.isViewPackReadySource.asObservable();
	// @ Optional for view
	loginAnnounced$ = this.loginAnnouncedSource.asObservable();
	loginTeacherAnnounced$ = this.loginTeacherAnnouncedSource.asObservable();
	toggleTopMenuAnnounced$ = this.toggleTopMenuAnnouncedSource.asObservable();
	errorMsgArr$ = this.errorMsgArrSource.asObservable();
	contentHeight$ = this.contentHeightSource.asObservable();
	isLockedBottomFooterFlexible$ = this.isLockedBottomFooterFlexibleSource.asObservable();
	myEventService$ = this.myEventServiceSource.asObservable();
	myCheckerService$ = this.myCheckerServiceSource.asObservable();
	isEventPackReady$ = this.isEventPackReadySource.asObservable();

	private myConst:HelperMyConst;

	constructor() {
		this.myConst = new HelperMyConst();
	}


	// Service message commands
	// @ Required for view
	announceIsAdmin(isAdmin: boolean) {
		this.isAdmin = isAdmin;
		if(null != this.loginUser) {
			this.loginUser.setIsAdmin(this.isAdmin);
		}

		this.isAdminSource.next(isAdmin);

		this.announceIsViewPackReady();
	}
	announceMyCheckerServiceReady(checkerMap: any, constMap: any, dirtyWordList: any, apiKey: string) {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / 시작`);

        if(null == checkerMap) {
        	if(isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / checkerMap is not valid!`);
            return;
        }
        if(null == constMap) {
        	if(isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / constMap is not valid!`);
            return;
        }
        if(null == dirtyWordList) {
        	if(isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / dirtyWordList is not valid!`);
            return;
        }
        if(null == apiKey || "" == apiKey) {
        	if(isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / apiKey is not valid!`);
            return;
        }		

		this.checkerMap = checkerMap;
		this.constMap = constMap;
		this.dirtyWordList = dirtyWordList;
		this.apiKey = apiKey;

		this.myConst.setConstJSON(this.constMap);

		this.myCheckerServicePackReadySource.next(true);

		if(isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / done.`);

		if(isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / apiKey : ${apiKey}`);

		this.announceIsViewPackReady();

	}
	// @ Desc : 뷰에 필요한 정보들이 모두 도착했는지 검사해서 알려줍니다.
	announceIsViewPackReady() {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log(`my-event-watchtower / announceIsViewPackReady / 시작`);

		if(null == this.isAdmin || !this.getIsMyCheckerReady()) {
			return;
		}

		if(isDebug) console.log(`my-event-watchtower / announceIsViewPackReady / 준비완료!`);

		this.isViewPackReady = true;
		this.isViewPackReadySource.next(true);
	}
	// @ Optional for view
	announceLogin(loginUser: User) {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log(`my-event-watchtower / announceLogin / 시작`);

		this.loginUser = loginUser;
		if(null != this.loginUser) {
			if(isDebug) console.log(`my-event-watchtower / announceLogin / setTeacher`);
			this.loginUser.setTeacher(this.loginTeacher);
			this.loginUser.setIsAdmin(this.isAdmin);
		}
		this.loginAnnouncedSource.next(loginUser);

		if(isDebug) console.log(`my-event-watchtower / announceLogin / 끝`);
	}
	announceLoginTeacher(loginTeacher: Teacher) {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log(`my-event-watchtower / announceLoginTeacher / 시작`);

		this.loginTeacher = loginTeacher;
		if(null != this.loginTeacher) {
			if(isDebug) console.log(`my-event-watchtower / announceLoginTeacher / setTeacher`);
			this.loginUser.setTeacher(this.loginTeacher);
		}

		this.loginTeacherAnnouncedSource.next(loginTeacher);

		if(isDebug) console.log(`my-event-watchtower / announceLoginTeacher / 끝`);
	}

	announceToggleTopMenu(toggleTopMenu: boolean) {
		this.toggleTopMenuAnnouncedSource.next(toggleTopMenu);
	}
	// @ Desc : 콘텐츠 추가 등으로 화면의 높이가 변경되었을 경우, 호출됩니다.
	announceContentHeight() {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-event-watchtower / announceContentHeight / 시작");

		let body = document.body;
		let clientHeight:number = body.clientHeight;

		if(this.contentHeight === clientHeight) {
			if(isDebug) console.log("my-event-watchtower / announceContentHeight / 중단 / 같은 높이라면 업데이트하지 않습니다");
			return;
		}

		// @ Alternatives
		// let offsetHeight:number = body.offsetHeight;
		// let html = document.documentElement;
		// let scrollHeight:number = body.scrollHeight;

		this.contentHeight = clientHeight;
		this.contentHeightSource.next(clientHeight);

		/*
	    // 실제 보여지는 브라우저 내의 화면 높이를 의미합니다.
	    let contentHeight:number = window.innerHeight;
	    if(isDebug) console.log("footer / announceContentHeight / contentHeight : ",contentHeight);

	    // 위와 같습니다.
	    let clientHeight:number = document.documentElement.clientHeight;
	    if(isDebug) console.log("footer / announceContentHeight / clientHeight : ",clientHeight);

	    // 물리적인 디스플레이의 높이를 의미합니다.
	    let screenHeight:number = screen.height;
	    if(isDebug) console.log("footer / announceContentHeight / screenHeight : ",screenHeight);
	    */
		
	}
	// @ Desc : 화면에 출력해야 하는 Error message를 app.component에게 공유함.
	announceErrorMsgArr(errorMsgArr: string[]) {
		this.errorMsgArr = errorMsgArr;
		this.errorMsgArrSource.next(errorMsgArr);
	}
	announceIsLockedBottomFooterFlexible(isLockedBottomFooterFlexible: boolean) {
		this.isLockedBottomFooterFlexible = isLockedBottomFooterFlexible;
		this.isLockedBottomFooterFlexibleSource.next(isLockedBottomFooterFlexible);
	}	

	announceMyEventService(myEventService: MyEventService) {

	    let isDebug:boolean = true;
	    // let isDebug:boolean = false;
	    if(isDebug) console.log("m-e-w / announceMyEventService / init");

		this.myEventService = myEventService;
		this.myEventServiceSource.next(myEventService);

		if(null != this.myCheckerService) {
			if(isDebug) console.log("m-e-w / announceMyEventService / next");
			this.isEventPackReady = true;
			this.isEventPackReadySource.next(true);
		} // end if
	}
	announceMyCheckerService(myCheckerService: MyCheckerService) {

	    let isDebug:boolean = true;
	    // let isDebug:boolean = false;
	    if(isDebug) console.log("m-e-w / announceMyCheckerService / init");

		this.myCheckerService = myCheckerService;
		this.myCheckerServiceSource.next(myCheckerService);

		if(null != this.myEventService) {
			if(isDebug) console.log("m-e-w / announceMyCheckerService / next");
			this.isEventPackReady = true;
			this.isEventPackReadySource.next(true);
		} // end if
	}




	getLoginUser() :User {
		return this.loginUser;
	}
	getLoginTeacher() :Teacher {
		return this.loginTeacher;
	}
	getIsAdmin() :boolean {
		return this.isAdmin;
	}
	getIsMyCheckerReady() :boolean {

		if(null == this.getCheckerMap()) {
			return false;
		}
		if(null == this.getConstMap()) {
			return false;
		}
		if(null == this.getDirtyWordList()) {
			return false;
		}
		if(null == this.getApiKey()) {
			return false;
		}

		return true;
	}
	getIsViewPackReady() :boolean {
		return this.isViewPackReady;
	}
	getIsEventPackReady() :boolean {
		return this.isEventPackReady;
	}	
	getCheckerMap() :string {
		return this.checkerMap;
	}	
	getConstMap() :string {
		return this.constMap;
	}	
	getMyConst():HelperMyConst {
		return this.myConst;
	}
	getDirtyWordList() :string {
		return this.dirtyWordList;
	}	
	getApiKey() :string {
		return this.apiKey;
	}
	getMyEventService() :MyEventService {
		return this.myEventService;
	}
	getMyCheckerService() :MyCheckerService {
		return this.myCheckerService;
	}

	// EVENT SECTION
	getEventOnReady(eventKey:string, component) :MyEvent {

		if(null == this.myEventService) {
			return null;
		}
		if(null == this.myCheckerService) {
			return null;
		}

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("m-e-w / getEventOnReady / 시작");

	    let myEventOnReady:MyEvent =
	    this.myEventService.getMyEvent(
	      // public eventName:string
	      this.myEventService.ON_READY,
	      // public key:string
	      eventKey,
	      // public value:string
	      "",
	      // public metaObj:any
	      component,
	      // public myChecker:MyChecker
	      this.myCheckerService.getFreePassChecker()
	    );

	    if(isDebug) console.log("m-e-w / getEventOnReady / myEventOnReady : ",myEventOnReady);

		return myEventOnReady;
	}
	getEventOnChange(eventKey:string, value:string, myChecker:MyChecker) :MyEvent {

		if(null == this.myEventService) {
			return null;
		}
		if(null == this.myCheckerService) {
			return null;
		}
		if(null == myChecker) {
			return null;
		}

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-event-watchtower / getEventOnChange / 시작");

	    let myEventOnChange:MyEvent =
	    this.myEventService.getMyEvent(
	      // public eventName:string
	      this.myEventService.ON_READY,
	      // public key:string
	      eventKey,
	      // public value:string
	      value,
	      // public metaObj:any
	      null,
	      // public myChecker:MyChecker
	      myChecker
	    );

		return myEventOnChange;
	}
	getEventWithMeta(eventName:string, eventKey:string, value:string, myChecker:MyChecker, meta:any):MyEvent {

		if(null == this.myEventService) {
			return null;
		}
		if(null == this.myCheckerService) {
			return null;
		}
		if(null == myChecker) {
			return null;
		}

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-event-watchtower / getEventWithMeta / 시작");

	    let myEvent:MyEvent =
	    this.myEventService.getMyEvent(
	      // public eventName:string
	      eventName,
	      // public key:string
	      eventKey,
	      // public value:string
	      value,
	      // public metaObj:any
	      meta,
	      // public myChecker:MyChecker
	      myChecker
	    );

		return myEvent;		

	}
	getEventOnChangeMeta(eventKey:string, value:string, myChecker:MyChecker, meta:any) :MyEvent {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-event-watchtower / getEventOnChangeMeta / 시작");

		return this.getEventWithMeta(
			// eventName:string, 
			this.myEventService.ON_CHANGE,
			// eventKey:string, 
			eventKey,
			// value:string, 
			value,
			// myChecker:MyChecker, 
			myChecker,
			// meta:any
			meta
		);
	}
	getEventOnAddCommentMeta(eventKey:string, value:string, myChecker:MyChecker, meta:any) :MyEvent {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-event-watchtower / getEventOnAddCommentMeta / 시작");

		return this.getEventWithMeta(
			// eventName:string, 
			this.myEventService.ON_ADD_COMMENT,
			// eventKey:string, 
			eventKey,
			// value:string, 
			value,
			// myChecker:MyChecker, 
			myChecker,
			// meta:any
			meta
		);
	}
	getEventOnAddCommentReplyMeta(eventKey:string, value:string, myChecker:MyChecker, meta:any) :MyEvent {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-event-watchtower / getEventOnAddCommentReplyMeta / 시작");

		return this.getEventWithMeta(
			// eventName:string, 
			this.myEventService.ON_ADD_COMMENT_REPLY,
			// eventKey:string, 
			eventKey,
			// value:string, 
			value,
			// myChecker:MyChecker, 
			myChecker,
			// meta:any
			meta
		);
	}		
	getEventOnLoginRequired(eventKey:string) :MyEvent {

		if(null == this.myEventService) {
			return null;
		}
		if(null == this.myCheckerService) {
			return null;
		}

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("m-e-w / getEventOnLoginRequired / 시작");

	    let myEventOnReady:MyEvent =
	    this.myEventService.getMyEvent(
	      // public eventName:string
	      this.myEventService.ON_LOGIN_REQUIRED,
	      // public key:string
	      eventKey,
	      // public value:string
	      "",
	      // public metaObj:any
	      null,
	      // public myChecker:MyChecker
	      this.myCheckerService.getFreePassChecker()
	    );

	    if(isDebug) console.log("m-e-w / getEventOnLoginRequired / myEventOnReady : ",myEventOnReady);

		return myEventOnReady;
	}	

}