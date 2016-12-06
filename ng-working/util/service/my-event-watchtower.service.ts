import { Injectable }           from '@angular/core';
import { Subject }    			from 'rxjs/Subject';

import { User }    				from '../../users/model/user';
/*
*	@ Desc : 부모와 자식 객체 간의 - 모듈 단위로 부모, 자식 관계라도 상관없음. - 이벤트를 주고 받을수 있는 shared service 객체
*/
@Injectable()
export class MyEventWatchTowerService {

	private loginUser:User;
	private isAdmin:boolean = false;

    private checkerMap;
    private constMap;
    private dirtyWordList;
	private apiKey:string = "";

	private errorMsgArr:string[];

	// Observable string sources
	private loginAnnouncedSource = new Subject<User>();
	private toggleTopMenuAnnouncedSource = new Subject<boolean>();
	private isAdminSource = new Subject<boolean>();

	private checkerMapSource = new Subject<any>();
	private constMapSource = new Subject<any>();
	private dirtyWordListSource = new Subject<any>();
	private apiKeySource = new Subject<string>();
	private myCheckerServiceReadySource = new Subject<boolean>();

	private errorMsgArrSource = new Subject<string[]>();

	// Observable string streams
	loginAnnounced$ = this.loginAnnouncedSource.asObservable();
	toggleTopMenuAnnounced$ = this.toggleTopMenuAnnouncedSource.asObservable();
	isAdmin$ = this.isAdminSource.asObservable();

	checkerMap$ = this.checkerMapSource.asObservable();
	constMap$ = this.constMapSource.asObservable();
	dirtyWordList$ = this.dirtyWordListSource.asObservable();
	apiKey$ = this.apiKeySource.asObservable();
	myCheckerServiceReady$ = this.myCheckerServiceReadySource.asObservable();

	errorMsgArr$ = this.errorMsgArrSource.asObservable();

	// Service message commands
	announceLogin(loginUser: User) {
		this.loginUser = loginUser;
		this.loginAnnouncedSource.next(loginUser);
	}
	announceToggleTopMenu(toggleTopMenu: boolean) {
		this.toggleTopMenuAnnouncedSource.next(toggleTopMenu);
	}
	announceIsAdmin(isAdmin: boolean) {
		this.isAdmin = isAdmin;
		this.isAdminSource.next(isAdmin);
	}
	// @ Desc : 화면에 출력해야 하는 Error message를 app.component에게 공유함.
	announceErrorMsgArr(errorMsgArr: string[]) {
		this.errorMsgArr = errorMsgArr;
		this.errorMsgArrSource.next(errorMsgArr);
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
		this.checkerMapSource.next(checkerMap);

		this.constMap = constMap;
		this.constMapSource.next(constMap);

		this.dirtyWordList = dirtyWordList;
		this.dirtyWordListSource.next(dirtyWordList);

		this.apiKey = apiKey;
		this.apiKeySource.next(apiKey);

		this.myCheckerServiceReadySource.next(true);

		if(isDebug) console.log(`my-event-watchtower / announceMyCheckerServiceReady / done.`);

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