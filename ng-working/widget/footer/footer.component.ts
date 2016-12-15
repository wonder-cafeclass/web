import {  Component, 
          ViewChild,
          OnInit, 
          AfterViewInit,
          OnChanges,
          SimpleChanges,
          ElementRef,
          Output, 
          EventEmitter,
          Input }                     from '@angular/core';

import { Router }                     from '@angular/router';

import { MyEventWatchTowerService }   from '../../util/service/my-event-watchtower.service';


@Component({
  moduleId: module.id,
  selector: 'my-footer',
  templateUrl: 'footer.component.html',
  styleUrls: [ 'footer.component.css' ]
})
export class FooterComponent implements OnInit, AfterViewInit, OnChanges {

  isFixedBottom:boolean=false;
  isLoginTeacher:boolean=false;

  constructor(  private watchTower:MyEventWatchTowerService,
                private elementRef:ElementRef,
                public router:Router) {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("footer / constructor / 시작");
    if(isDebug) console.log("footer / constructor / 1 / this.isLoginTeacher : ",this.isLoginTeacher);

  }

  getHeight(): number {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("footer / getHeight / 시작");


    let nativeElement = this.elementRef.nativeElement;
    if(isDebug) console.log("footer / getHeight / this.elementRef : ",this.elementRef);

    let children = nativeElement.children;
    if(isDebug) console.log("footer / getHeight / children : ",children);

    let childNav = null;
    let childNavHeight:number = 0;
    if(null != children && 0 < children.length) {
      childNav = children[0];
      if(isDebug) console.log("footer / getHeight / childNav : ",childNav);

      childNavHeight = childNav.offsetHeight;
      if(isDebug) console.log("footer / getHeight / childNavHeight : ",childNavHeight);
    }

    return childNavHeight;

  }

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("footer / ngOnInit / 시작");

    this.watchTower.contentHeight$.subscribe(
      (contentHeight:number) => {

      let windowHeight:number = window.innerHeight;

      // 푸터의 높이를 가져옵니다.
      let footerHeight:number = this.getHeight();

      if(isDebug) console.log("footer / contentHeight$.subscribe / windowHeight : ",windowHeight);
      if(isDebug) console.log("footer / contentHeight$.subscribe / contentHeight : ",contentHeight);
      if(isDebug) console.log("footer / contentHeight$.subscribe / footerHeight : ",footerHeight);

      if(windowHeight < (contentHeight + footerHeight)) {

        // 1. 컨텐츠 높이가 화면 높이보다 깁니다.
        // 스크롤이 가능하므로, footer를 하단 고정을 해제합니다.
        if(isDebug) console.log("footer / contentHeight$.subscribe / footer를 하단 고정을 해제");
        this.isFixedBottom = false;

      } else {

        // 2. 컨텐츠 높이가 화면 높이보다 짧습니다.
        // 스크롤이 안됩니다. footer를 하단 고정합니다.
        if(isDebug) console.log("footer / contentHeight$.subscribe / footer를 하단 고정");
        this.isFixedBottom = true;

      } // end if

    }); // end subscribe

    // 선생님 로그인 여부를 관찰합니다.
    this.watchTower.loginTeacherAnnounced$.subscribe(
      (loginTeacher:Teacher) => {
      this.isLoginTeacher = (null != loginTeacher)?true:false;
      if(isDebug) console.log("footer / loginTeacherAnnounced$.subscribe / 2 / this.isLoginTeacher : ",this.isLoginTeacher);
    });
  }

  ngAfterViewInit(): void {

    // this.updatePosition();

  }

  ngOnChanges(changes: SimpleChanges) {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("footer / ngOnChanges / 시작");

    this.updatePosition();

  }

  updatePosition(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("footer / updatePosition / 시작");

    // 1. 화면안의 내용이 screen보다 작다면 bottom fixed.

    // 2. 화면안의 내용이 screen보다 크다면 bottom fixed 해제, 맨밑에 붙이기.

  }

  onClickInfo(event) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("footer / onClickInfo / 시작");

    event.stopPropagation();
    event.preventDefault();

    this.router.navigate(['/']);

  }

  onClickContact(event) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("footer / onClickContact / 시작");

    event.stopPropagation();
    event.preventDefault();

    this.router.navigate(['/']);

  }

  onClickPolicy(event) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("footer / onClickPolicy / 시작");

    event.stopPropagation();
    event.preventDefault();

    this.router.navigate(['/policy']);

  }

  onClickPrivateInfo(event) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("footer / onClickPrivateInfo / 시작");

    event.stopPropagation();
    event.preventDefault();

    this.router.navigate(['/private-info']);

  } 

  onClickApplyTeacher(event) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("footer / onClickApplyTeacher / 시작");

    if(this.isLoginTeacher) {
      if(isDebug) console.log("footer / onClickApplyTeacher / 중단 / 로그인한 선생님 유저라면 선생님 등록을 다시 할 수 없다.");
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    this.router.navigate(['/applyteacherterm']);
    
  } 

}