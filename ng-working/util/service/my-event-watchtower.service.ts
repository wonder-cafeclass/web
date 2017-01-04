import { Injectable }           from '@angular/core';
import { Subject }    			from 'rxjs/Subject';

import { User }    				from '../../users/model/user';
import { Teacher }    			from '../../teachers/model/teacher';

import { HelperMyConst }		from '../../util/helper/my-const';

import { DefaultOption }        from '../../widget/input/default/model/default-option';

import { MyLoggerService }		from './my-logger.service';
import { MyEventService }		from './my-event.service';
import { MyCheckerService }		from './my-checker.service';
import { MyEvent }				from '../model/my-event';
import { MyChecker }			from '../model/my-checker';

/*
*	@ Desc : 부모와 자식 객체 간의 - 모듈 단위로 부모, 자식 관계라도 상관없음. - 이벤트를 주고 받을수 있는 shared service 객체
*/
@Injectable()
export class MyEventWatchTowerService {

    // private isDebug:boolean = true;
    private _isDebug:boolean = false;

	// @ Required for view
	private isAdminServer:boolean = false;
    private checkerMap;
    private constMap;
    private dirtyWordList;
	private apiKey:string = "";
	private isViewPackReady:boolean = false;
	// @ Optional for view
	private isDebugging:boolean = false;
	private loginUser:User;
	private loginTeacher:Teacher;
	private errorMsgArr:string[];
	private contentHeight:number;
	private isLockedBottomFooterFlexible:boolean = false;
	private myLoggerService:MyLoggerService;
	private myEventService:MyEventService;
	private myCheckerService:MyCheckerService;
	private isEventPackReady:boolean = false;

	// Observable sources
	// @ Required for view
	private isAdminServerSource = new Subject<boolean>();
	private myCheckerServicePackReadySource = new Subject<boolean>();
	private isViewPackReadySource = new Subject<boolean>();
	// @ Optional for view
	private isDebuggingSource = new Subject<boolean>();
	private loginAnnouncedSource = new Subject<User>();
	private loginTeacherAnnouncedSource = new Subject<Teacher>();
	private toggleTopMenuAnnouncedSource = new Subject<boolean>();
	private errorMsgArrSource = new Subject<string[]>();
	private contentHeightSource = new Subject<number>();
	private isLockedBottomFooterFlexibleSource = new Subject<boolean>();
	private myLoggerServiceSource = new Subject<MyLoggerService>();
	private myEventServiceSource = new Subject<MyEventService>();
	private myCheckerServiceSource = new Subject<MyCheckerService>();
	private isEventPackReadySource = new Subject<boolean>();

	// Observable streams
	// @ Required for view
	isAdminServer$ = this.isAdminServerSource.asObservable();
	myCheckerServicePackReady$ = this.myCheckerServicePackReadySource.asObservable();
	isViewPackReady$ = this.isViewPackReadySource.asObservable();
	// @ Optional for view
	isDebugging$ = this.isDebuggingSource.asObservable();
	loginAnnounced$ = this.loginAnnouncedSource.asObservable();
	loginTeacherAnnounced$ = this.loginTeacherAnnouncedSource.asObservable();
	toggleTopMenuAnnounced$ = this.toggleTopMenuAnnouncedSource.asObservable();
	errorMsgArr$ = this.errorMsgArrSource.asObservable();
	contentHeight$ = this.contentHeightSource.asObservable();
	isLockedBottomFooterFlexible$ = this.isLockedBottomFooterFlexibleSource.asObservable();
	myLoggerService$ = this.myLoggerServiceSource.asObservable();
	myEventService$ = this.myEventServiceSource.asObservable();
	myCheckerService$ = this.myCheckerServiceSource.asObservable();
	isEventPackReady$ = this.isEventPackReadySource.asObservable();

	private myConst:HelperMyConst;

	constructor() {
		this.myConst = new HelperMyConst();
	}


	// Service message commands
	// @ Required for view
	announceIsAdminServer(isAdminServer: boolean) {
		this.isAdminServer = isAdminServer;
		this.isAdminServerSource.next(isAdminServer);

		this.announceIsViewPackReady();
	}	
	announceMyCheckerServiceReady(checkerMap: any, constMap: any, dirtyWordList: any, apiKey: string) {

	    if(this._isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / 시작`);

        if(null == checkerMap) {
        	if(this._isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / checkerMap is not valid!`);
            return;
        }
        if(null == constMap) {
        	if(this._isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / constMap is not valid!`);
            return;
        }
        if(null == dirtyWordList) {
        	if(this._isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / dirtyWordList is not valid!`);
            return;
        }
        if(null == apiKey || "" == apiKey) {
        	if(this._isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / apiKey is not valid!`);
            return;
        }		

		this.checkerMap = checkerMap;
		this.constMap = constMap;
		this.dirtyWordList = dirtyWordList;
		this.apiKey = apiKey;

		this.myConst.setConstJSON(this.constMap);

		this.myCheckerServicePackReadySource.next(true);

		if(this._isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / done.`);

		if(this._isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / apiKey : ${apiKey}`);

		this.announceIsViewPackReady();

	}
	// @ Desc : 뷰에 필요한 정보들이 모두 도착했는지 검사해서 알려줍니다.
	announceIsViewPackReady() {

	    if(this._isDebug) console.log(`my-event-watchtower / announceIsViewPackReady / 시작`);

		if(null == this.isAdminServer || !this.getIsMyCheckerReady()) {
			return;
		}

		if(this._isDebug) console.log(`my-event-watchtower / announceIsViewPackReady / 준비완료!`);

		this.isViewPackReady = true;
		this.isViewPackReadySource.next(true);
	}
	// @ Optional for view
	announceIsDebugging(isDebugging: boolean) {
		this.isDebugging = isDebugging;
		this.isDebuggingSource.next(isDebugging);
	}
	announceLogin(loginUser: User) {

	    if(this._isDebug) console.log(`my-event-watchtower / announceLogin / 시작`);

		this.loginUser = loginUser;
		if(null != this.loginUser) {
			if(this._isDebug) console.log(`my-event-watchtower / announceLogin / setTeacher`);
			if(null != this.loginTeacher) {
				this.loginUser.setTeacher(this.loginTeacher);
			} // end if
		}
		this.loginAnnouncedSource.next(loginUser);

		if(this._isDebug) console.log(`my-event-watchtower / announceLogin / 끝`);
	}
	announceLoginTeacher(loginTeacher: Teacher) {

	    if(this._isDebug) console.log(`my-event-watchtower / announceLoginTeacher / 시작`);

	    if(null != loginTeacher) {
			this.loginTeacher = new Teacher().setJSON(loginTeacher);
	    } else {
	    	this.loginTeacher = null;
	    }

		if(null != this.loginUser && null != this.loginTeacher) {
			if(this._isDebug) console.log(`my-event-watchtower / announceLoginTeacher / setTeacher`);
			this.loginUser.setTeacher(this.loginTeacher);
		}

		this.loginTeacherAnnouncedSource.next(loginTeacher);

		if(this._isDebug) console.log(`my-event-watchtower / announceLoginTeacher / 끝`);
	}

	announceToggleTopMenu(toggleTopMenu: boolean) {
		this.toggleTopMenuAnnouncedSource.next(toggleTopMenu);
	}
	// @ Desc : 콘텐츠 추가 등으로 화면의 높이가 변경되었을 경우, 호출됩니다.
	announceContentHeight() {

	    if(this._isDebug) console.log("my-event-watchtower / announceContentHeight / 시작");

		let body = document.body;
		let clientHeight:number = body.clientHeight;

		if(this.contentHeight === clientHeight) {
			if(this._isDebug) console.log("my-event-watchtower / announceContentHeight / 중단 / 같은 높이라면 업데이트하지 않습니다");
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
	    if(this._isDebug) console.log("footer / announceContentHeight / contentHeight : ",contentHeight);

	    // 위와 같습니다.
	    let clientHeight:number = document.documentElement.clientHeight;
	    if(this._isDebug) console.log("footer / announceContentHeight / clientHeight : ",clientHeight);

	    // 물리적인 디스플레이의 높이를 의미합니다.
	    let screenHeight:number = screen.height;
	    if(this._isDebug) console.log("footer / announceContentHeight / screenHeight : ",screenHeight);
	    */
		
	}
	// @ Desc : 강제로 푸터를 하단 고정 해제 합니다.
	announceFooterRelease() {
		if(this._isDebug) console.log("my-event-watchtower / announceFooterRelease / 시작");
		this.contentHeightSource.next(3000);
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

	announceMyLoggerService(myLoggerService: MyLoggerService) {

	    if(this._isDebug) console.log("m-e-w / announceMyLoggerService / init");

		this.myLoggerService = myLoggerService;
		this.myLoggerServiceSource.next(myLoggerService);

		this.announceEventPackReady();
	}
	announceMyEventService(myEventService: MyEventService) {

	    if(this._isDebug) console.log("m-e-w / announceMyEventService / init");

		this.myEventService = myEventService;
		this.myEventServiceSource.next(myEventService);

		this.announceEventPackReady();
	}
	announceMyCheckerService(myCheckerService: MyCheckerService) {

	    if(this._isDebug) console.log("m-e-w / announceMyCheckerService / init");

		this.myCheckerService = myCheckerService;
		this.myCheckerServiceSource.next(myCheckerService);

		this.announceEventPackReady();
	}
	private announceEventPackReady():void {

		if(null != this.myEventService && null != this.myCheckerService && null != this.myLoggerService) {
			if(this._isDebug) console.log("m-e-w / announceEventPackReady / next");
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
	getIsAdminServer() :boolean {
		return this.isAdminServer;
	}
	getIsDebugging() :boolean {
		return this.isDebugging;
	}
	isDebug() :boolean {
		return this.isDebugging;
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
	getMyLoggerService() :MyLoggerService {
		return this.myLoggerService;
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

	    if(this._isDebug) console.log("m-e-w / getEventOnReady / 시작");

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

	    if(this._isDebug) console.log("m-e-w / getEventOnReady / myEventOnReady : ",myEventOnReady);

		return myEventOnReady;
	}
	getEventOnRemove(eventKey:string, value:string, myChecker:MyChecker) :MyEvent {

		if(null == this.myEventService) {
			return null;
		}
		if(null == this.myCheckerService) {
			return null;
		}
		if(null == myChecker) {
			return null;
		}

	    if(this._isDebug) console.log("my-event-watchtower / getEventOnChange / 시작");

	    let myEventOnChange:MyEvent =
	    this.myEventService.getMyEvent(
	      // public eventName:string
	      this.myEventService.ON_REMOVE_ROW,
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

	    if(this._isDebug) console.log("my-event-watchtower / getEventOnChange / 시작");

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

	    if(this._isDebug) console.log("my-event-watchtower / getEventWithMeta / 시작");

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

	    if(this._isDebug) console.log("my-event-watchtower / getEventOnChangeMeta / 시작");

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

	    if(this._isDebug) console.log("my-event-watchtower / getEventOnAddCommentMeta / 시작");

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

	    if(this._isDebug) console.log("my-event-watchtower / getEventOnAddCommentReplyMeta / 시작");

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

	    if(this._isDebug) console.log("m-e-w / getEventOnLoginRequired / 시작");

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

	    if(this._isDebug) console.log("m-e-w / getEventOnLoginRequired / myEventOnReady : ",myEventOnReady);

		return myEventOnReady;
	}

	getDefaultOptionList(keyList:string[],valueList:string[],valueFocus:string) :DefaultOption[] {

		if(null == this.getMyConst()) {
			return [];
		}

		let defaultOptionList:DefaultOption[] = 
		this.getMyConst().getDefaultOptionList(
			// keyList:string[], 
			keyList,
			// valueList:string[],
			valueList,
			// valueFocus:string
			valueFocus
		);

		return defaultOptionList;
	} // end method 

	getDefaultOptionListWithMeta(keyList:string[],valueList:string[],valueFocus:string,metaObj:any) :DefaultOption[] {

		if(null == this.getMyConst()) {
			return [];
		}

		/*
		let defaultOptionList:DefaultOption[] = 
		this.getMyConst().getDefaultOptionList(
			// keyList:string[], 
			keyList,
			// valueList:string[],
			valueList,
			// valueFocus:string
			valueFocus
		);
		*/
		
		let defaultOptionList:DefaultOption[] = 
		this.getDefaultOptionList(keyList,valueList,valueFocus);

		for (var i = 0; i < defaultOptionList.length; ++i) {
			let defaultOption:DefaultOption = defaultOptionList[i];
			defaultOption.metaObj = metaObj;
		}

		return defaultOptionList;
	} // end method 	 	

	logAPIError(msg:string) :void	{

		if(this._isDebug) console.log("m-e-w / logAPIError / 시작");

		if(!this.getIsMyCheckerReady()) {
			if(this._isDebug) console.log("m-e-w / logAPIError / 중단 / !this.getIsMyCheckerReady()");
			return;
		} // end if
		if(!this.getIsEventPackReady()) {
			if(this._isDebug) console.log("m-e-w / logAPIError / 중단 / !this.getIsEventPackReady()");
			return;
		} // end if
		if(null == msg || "" === msg) {
			if(this._isDebug) console.log("m-e-w / logAPIError / 중단 / msg is not valid!");
			return;
		} // end if

		this.myLoggerService.logError(
			// apiKey:string
			this.getApiKey(),
			// errorType:string
			this.myLoggerService.errorAPIFailed,
			// errorMsg:string
			msg
		); // end logger
	}

}