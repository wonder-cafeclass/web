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
import { Teacher }                    from '../../teachers/model/teacher';


@Component({
  moduleId: module.id,
  selector: 'my-footer',
  templateUrl: 'footer.component.html',
  styleUrls: [ 'footer.component.css' ]
})
export class FooterComponent implements OnInit, OnChanges {

  // isLocked:boolean = false;
  isFixedBottom:boolean=false;
  isLoginTeacher:boolean=false;

  constructor(  private watchTower:MyEventWatchTowerService,
                private elementRef:ElementRef,
                public router:Router) {

    if(this.isDebug()) console.log("footer / constructor / 시작");

    /*
    this.watchTower.isLockedBottomFooterFlexible$.subscribe(
      (isLockedBottomFooterFlexible:boolean) => {

      if(this.isDebug()) console.log("footer / constructor / isLockedBottomFooterFlexible : ",isLockedBottomFooterFlexible);
      this.isLocked = isLockedBottomFooterFlexible;
      this.isFixedBottom = isLockedBottomFooterFlexible;

    }); // end if
    */

  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  private getFooterElement():any {
    let nativeElement = this.elementRef.nativeElement;
    let children = nativeElement.children;
    let childNav = null;
    let childNavHeight:number = 0;
    if(null != children && 0 < children.length) {
      childNav = children[0];
      return childNav;
    }

    return null;
  } // end method

  getHeight(): number {

    let footerElement:any = this.getFooterElement();
    if(null != footerElement) {
      return footerElement.offsetHeight;
    }

    return -1;
  }

  getYPos(): number {

    let footerElement:any = this.getFooterElement();
    if(null != footerElement) {
      return footerElement.offsetTop;
    }

    // return this.elementRef.nativeElement.offsetTop;

    return -1;

  }


  ngOnInit(): void {

    if(this.isDebug()) console.log("footer / ngOnInit / 시작");
    console.log("footer / ngOnInit / TEST / 시작");

    this.subscribeContentHeight();
    this.subscribeLoginTeacher();

  }

  private subscribeContentHeight() {
    this.watchTower.footerUpdate$.subscribe(
      (contentHeight:number) => {

      // if(this.isLocked) {
      //   if(this.isDebug()) console.log("footer / contentHeight$.subscribe / 중단 / this.isLocked : ",this.isLocked);
      //   return;
      // }

      this.updateBottomFixed();
    }); // end subscribe
  }

  private scrollHeightPrev:number = -1;
  updateBottomFixed():void {

    let windowHeight:number = window.innerHeight;

    // 푸터의 높이를 가져옵니다.
    let footerHeight:number = this.getHeight();
    // wonder.jung
    // 푸터의 Y 좌표를 가져옵니다.
    let footerYPos:number = this.getYPos();

    if(this.isDebug()) console.log("footer / updateBottomFixed / windowHeight : ",windowHeight);
    if(this.isDebug()) console.log("footer / updateBottomFixed / footerHeight : ",footerHeight);
    if(this.isDebug()) console.log("footer / updateBottomFixed / footerYPos : ",footerYPos);

    let body = document.body;
    let scrollHeight:number = body.scrollHeight;
    let offsetHeight:number = body.offsetHeight;

    if(this.scrollHeightPrev < 0) {
      this.scrollHeightPrev = scrollHeight;
    } else if(this.scrollHeightPrev == scrollHeight) {
      return;
    }
    this.scrollHeightPrev = scrollHeight;

    // console.log("footer / updateBottomFixed / windowHeight : ",windowHeight);
    // console.log("footer / updateBottomFixed / scrollHeight : ",scrollHeight);
    // console.log("footer / updateBottomFixed / offsetHeight : ",offsetHeight);
    // console.log("footer / updateBottomFixed / footerHeight : ",footerHeight);
    // console.log("footer / updateBottomFixed / footerYPos : ",footerYPos);
    // console.log("footer / updateBottomFixed / body : ",body);

    if(windowHeight < scrollHeight) {
      // 푸터가 화면 아래쪽
      // 하단 고정 해제
      console.log("footer / updateBottomFixed / 하단 고정 해제");
      this.isFixedBottom = false;
    } else if((footerYPos + footerHeight) <= windowHeight) {
      // 푸터가 화면 안쪽에 위치, 아래쪽에 영역이 남음
      // 하단 고정
      console.log("footer / updateBottomFixed / 하단 고정");
      this.isFixedBottom = true;
    } else {
      // 푸터가 화면 아래쪽
      // 하단 고정 해제
      console.log("footer / updateBottomFixed / 하단 고정 해제");
      this.isFixedBottom = false;
    }

  }

  subscribeLoginTeacher():void {

    if(this.isDebug()) console.log("footer / subscribeLoginTeacher / 시작");

    // 선생님 로그인 여부를 직접 받아옵니다. 미리 받아온 선생님 데이터가 있다면 사용합니다.
    let loginTeacher:Teacher = this.watchTower.getLoginTeacher();
    this.isLoginTeacher = (null != loginTeacher)?true:false;

    if(this.isDebug()) console.log("footer / subscribeLoginTeacher / 1 / this.isLoginTeacher : ",this.isLoginTeacher);

    // 선생님 로그인 여부를 관찰합니다.
    this.watchTower.loginTeacherAnnounced$.subscribe(
      (loginTeacher:Teacher) => {

      this.isLoginTeacher = (null != loginTeacher)?true:false;
      if(this.isDebug()) console.log("footer / subscribeLoginTeacher / 2 / this.isLoginTeacher : ",this.isLoginTeacher);
    });
  } // end method

  ngOnChanges(changes: SimpleChanges) {

    if(this.isDebug()) console.log("footer / ngOnChanges / 시작");

    this.updatePosition();

  }

  updatePosition(): void {

    if(this.isDebug()) console.log("footer / updatePosition / 시작");

    // 1. 화면안의 내용이 screen보다 작다면 bottom fixed.

    // 2. 화면안의 내용이 screen보다 크다면 bottom fixed 해제, 맨밑에 붙이기.

  }

  onClickInfo(event) :void {

    if(this.isDebug()) console.log("footer / onClickInfo / 시작");

    event.stopPropagation();
    event.preventDefault();

    this.router.navigate(['/']);

  }

  onClickContact(event) :void {

    if(this.isDebug()) console.log("footer / onClickContact / 시작");

    event.stopPropagation();
    event.preventDefault();

    this.router.navigate(['/']);

  }

  onClickPolicy(event) :void {

    if(this.isDebug()) console.log("footer / onClickPolicy / 시작");

    event.stopPropagation();
    event.preventDefault();

    this.router.navigate(['/policy']);

  }

  onClickPrivateInfo(event) :void {

    if(this.isDebug()) console.log("footer / onClickPrivateInfo / 시작");

    event.stopPropagation();
    event.preventDefault();

    this.router.navigate(['/policy/private-info']);

  } 

  onClickApplyTeacher(event) :void {

    if(this.isDebug()) console.log("footer / onClickApplyTeacher / 시작");

    if(this.isLoginTeacher) {
      if(this.isDebug()) console.log("footer / onClickApplyTeacher / 중단 / 로그인한 선생님 유저라면 선생님 등록을 다시 할 수 없다.");
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    this.router.navigate(['/teacher/applyteacherterm']);
    
  } 

}