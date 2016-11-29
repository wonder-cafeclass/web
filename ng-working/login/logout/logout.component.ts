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
  }
}