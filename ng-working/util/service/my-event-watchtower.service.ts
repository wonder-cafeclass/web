import { Injectable }           from '@angular/core';
import { Subject }    			from 'rxjs/Subject';

import { User }    				from '../../users/model/user';
/*
*	@ Desc : 부모와 자식 객체 간의 - 모듈 단위로 부모, 자식 관계라도 상관없음. - 이벤트를 주고 받을수 있는 shared service 객체
*/
@Injectable()
export class MyEventWatchTowerService {

	// Observable string sources
	private loginAnnouncedSource = new Subject<User>();
	private toggleTopMenuAnnouncedSource = new Subject<boolean>();

	// Observable string streams
	loginAnnounced$ = this.loginAnnouncedSource.asObservable();
	toggleTopMenuAnnounced$ = this.toggleTopMenuAnnouncedSource.asObservable();

	// Service message commands
	announceLogin(loginUser: User) {
		this.loginAnnouncedSource.next(loginUser);
	}
	announceToggleTopMenu(toggleTopMenu: boolean) {
		this.toggleTopMenuAnnouncedSource.next(toggleTopMenu);
	}	
}