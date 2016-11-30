import {  Component, 
          Input, 
          Output,
          OnInit }              from '@angular/core';
import { Router,
         NavigationExtras }     from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'logout',
  templateUrl: 'logout.component.html',
  styleUrls: [ 'logout.component.css' ]
})
export class LogoutComponent implements OnInit {

  constructor(public router: Router) {}

  ngOnInit(): void {

    // TODO 페이지 진입을 기록으로 남깁니다.

    // 로그아웃시 해야할 일
    // 1. 로그인 쿠키를 지웁니다. 
    // 1-1. 플랫폼 로그아웃 처리도 해줍니다.(나중에...)
    // 2. event-watch-tower를 통해서 로그아웃을 전파합니다. 
    // 해당 이벤트 스트림을 받는 엘리먼트들은 로그아웃 처리를 해줍니다.
    // 3. 홈화면으로 돌아갑니다. 
    // 3-1. 로그아웃시 액세스가 가능하다면 해당 화면에 머무릅니다.
    // 3-2. 로그아웃시 머물수 없는 화면이라면 홈화면으로 돌아갑니다.

  }
}