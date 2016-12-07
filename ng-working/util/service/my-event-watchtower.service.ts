import { Injectable }           from '@angular/core';
import { Subject }    			from 'rxjs/Subject';

import { User }    				from '../../users/model/user';
/*
*	@ Desc : 부모와 자식 객체 간의 - 모듈 단위로 부모, 자식 관계라도 상관없음. - 이벤트를 주고 받을수 있는 shared service 객체
*/
@Injectable()
export class MyEventWatchTowerService {

	// @ Required for view
	private isAdmin:boolean = null;
    private checkerMap;
    private constMap;
    private dirtyWordList;
	private apiKey:string = "";
	private isViewPackReady:boolean = false;
	// @ Optional for view
	private loginUser:User;
	private errorMsgArr:string[];


	// Observable sources
	// @ Required for view
	private isAdminSource = new Subject<boolean>();
	private myCheckerServicePackReadySource = new Subject<boolean>();
	private isViewPackReadySource = new Subject<boolean>();
	// @ Optional for view
	private loginAnnouncedSource = new Subject<User>();
	private toggleTopMenuAnnouncedSource = new Subject<boolean>();
	private errorMsgArrSource = new Subject<string[]>();



	// Observable streams
	// @ Required for view
	isAdmin$ = this.isAdminSource.asObservable();
	myCheckerServicePackReady$ = this.myCheckerServicePackReadySource.asObservable();
	isViewPackReady$ = this.isViewPackReadySource.asObservable();
	// @ Optional for view
	loginAnnounced$ = this.loginAnnouncedSource.asObservable();
	toggleTopMenuAnnounced$ = this.toggleTopMenuAnnouncedSource.asObservable();
	errorMsgArr$ = this.errorMsgArrSource.asObservable();



	// Service message commands
	// @ Required for view
	announceIsAdmin(isAdmin: boolean) {
		this.isAdmin = isAdmin;
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

		this.myCheckerServicePackReadySource.next(true);

		if(isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / done.`);

		if(isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / apiKey : ${apiKey}`);

		this.announceIsViewPackReady();

	}
	// @ Desc : 뷰에 필요한 정보들이 모두 도착했는지 검사해서 알려줍니다.
	announceIsViewPackReady() {

	    let isDebug:boolean = true;
	    // let isDebug:boolean = false;
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
		this.loginUser = loginUser;
		this.loginAnnouncedSource.next(loginUser);
	}
	announceToggleTopMenu(toggleTopMenu: boolean) {
		this.toggleTopMenuAnnouncedSource.next(toggleTopMenu);
	}
	// @ Desc : 화면에 출력해야 하는 Error message를 app.component에게 공유함.
	announceErrorMsgArr(errorMsgArr: string[]) {
		this.errorMsgArr = errorMsgArr;
		this.errorMsgArrSource.next(errorMsgArr);
	}



	getLoginUser() :User {
		return this.loginUser;
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
	getCheckerMap() :string {
		return this.checkerMap;
	}	
	getConstMap() :string {
		return this.constMap;
	}	
	getDirtyWordList() :string {
		return this.dirtyWordList;
	}	
	getApiKey() :string {
		return this.apiKey;
	}
}