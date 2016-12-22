import {  Component, 
          OnInit,
          Output,
          EventEmitter,
          Input }                      from '@angular/core';

import { ImageService }                from '../../util/image.service';

import { MyEvent }                     from '../../util/model/my-event';
import { MyButton }                    from '../../util/model/my-button';
import { MyChecker }                   from '../../util/model/my-checker';

import { MyEventService }              from '../../util/service/my-event.service';
import { MyCheckerService }            from '../../util/service/my-checker.service';
import { MyEventWatchTowerService }    from '../../util/service/my-event-watchtower.service';

import { HelperMyIs }                  from '../../util/helper/my-is';
import { HelperMyTime }                from '../../util/helper/my-time';
import { HelperMyArray }               from '../../util/helper/my-array';

import { User }                        from '../../user/model/user';

import { Comment }                     from './model/comment';
import { CommentService }              from './service/comment.service';

/*
*
* @ Desc   : 
* 댓글 노출 및 입력,수정,삭제가 가능한 컴포넌트입니다.
* 
* @ Author : Wonder Jung
*
*/

@Component({
  moduleId: module.id,
  selector: 'comment-list',
  templateUrl: 'comment-list.component.html',
  styleUrls: [ 'comment-list.component.css' ]
})
export class CommentListComponent implements OnInit {

  @Input() isAdmin:boolean=false;
  @Input() commentList:Comment[];
  @Input() eventKey:string;
  @Input() myEvent:MyEvent; // @ Deprecated
  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  @Input() cageHeight:number=-1;
  cageHeightStr:string;

  @Input() placeholderInput:string;
  @Input() placeholderReply:string;

  isShowNewCommentInput:boolean=true;
  loginUser:User=null;

  @Output() emitter = new EventEmitter<any>();

  private myIs:HelperMyIs;
  private myTime:HelperMyTime;
  private myArray:HelperMyArray;  

  constructor(  private myEventService:MyEventService, 
                private myCheckerService:MyCheckerService,
                private watchTower:MyEventWatchTowerService,
                private commentService:CommentService,
                private imageService:ImageService) {}

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / ngOnInit / init");

    this.myIs = new HelperMyIs();
    this.myTime = new HelperMyTime();
    this.myArray = new HelperMyArray();

    this.subscribeEventPack();

  }

  setLoginUser(loginUser:User) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / setLoginUser / init");

    if(isDebug) console.log("comment-list / setLoginUser / loginUser : ",loginUser);

    this.loginUser = loginUser;

  } // end method

  private subscribeEventPack() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(isDebug) console.log("comment-list / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      // 1. 이미 EventPack 로딩이 완료된 경우

      // 부모 객체에게 component가 준비된 것을 알립니다.
      this.emitEventOnReady();

    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(isDebug) console.log("comment-list / subscribeEventPack / isEventPackReady : ",isEventPackReady);

        // 이벤트 관련 정보가 준비되었습니다.

        // 부모 객체에게 component가 준비된 것을 알립니다.
        this.emitEventOnReady();

      }); // end subscribe

    } // end if

  } // end method 
  
  private emitEventOnReady() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / emitEventOnReady / init");

    if(!this.watchTower.getIsEventPackReady()) {
      if(isDebug) console.log("k-d-n-l / emitEventOnReady / 중단 / EventPack is not valid!");    
      return;
    }

    let myEventOnReady:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );

    if(isDebug) console.log("k-d-n-l / emitEventOnReady / myEventOnReady : ",myEventOnReady);

    this.emitter.emit(myEventOnReady);

    if(isDebug) console.log("k-d-n-l / emitEventOnReady / Done!");

  } 

  private emitEventOnLoginRequired() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / emitEventOnLoginRequired / init");

    if(!this.watchTower.getIsEventPackReady()) {
      if(isDebug) console.log("k-d-n-l / emitEventOnLoginRequired / 중단 / EventPack is not valid!");    
      return;
    }

    let myEventOnReady:MyEvent = 
    this.watchTower.getEventOnLoginRequired(
      // eventKey:string, 
      this.eventKey
    );

    if(isDebug) console.log("k-d-n-l / emitEventOnLoginRequired / myEventOnReady : ",myEventOnReady);

    this.emitter.emit(myEventOnReady);

    if(isDebug) console.log("k-d-n-l / emitEventOnLoginRequired / Done!");

  }     

  onClickAddComment(event, replyContainer, replyBtn) :void {
    event.stopPropagation();
    event.preventDefault();

    // Toggle input
    if("none" === replyContainer.style.display) {
      replyContainer.style.display = "block";
      this.isShowNewCommentInput = false;
    } else {
      replyContainer.style.display = "none";
      this.isShowNewCommentInput = true;
    }

    // Toggle btn name
    if("답글달기" === replyBtn.innerHTML) {
      replyBtn.innerHTML = "닫기";
    } else {
      replyBtn.innerHTML = "답글달기";
    }
  }

  onFocusTextarea(event, taNewComment) :void {

    event.stopPropagation();
    event.preventDefault();

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / onFocusTextarea / init");

    if(null == this.loginUser) {
      if(isDebug) console.log("comment-list / onFocusTextarea / 로그인을 하지 않은 경우라면, 로그인 창으로 보냅니다.");

      // 로그인 유저 정보가 없습니다. 로그인 필요 이벤트 발송!
      this.emitEventOnLoginRequired();

      return;
    } // end if

  }

  onClickTextarea(event, taNewComment) :void {

    event.stopPropagation();
    event.preventDefault();

    let text = taNewComment.value;

    if(null != text && this.placeholderInput === text) {
      taNewComment.value = "";
    }

    console.log("comment.component / onClickTextarea / text : ",text);
  }

  onBlurTextarea(event, taNewComment) :void {
    event.stopPropagation();
    event.preventDefault();

    let text = taNewComment.value;

    if(null == text || "" === text) {
      taNewComment.value = this.placeholderInput;
    }

    console.log("comment.component / onBlurTextarea / text : ",text);
  }

  private getNewComment(text:string, metaObj):Comment {

    if(null == text || "" === text) {
      return null;
    }
    if(null == this.loginUser) {
      return null;
    }

    let dateUpdated:string = 
    this.myTime.getNow_YYYY_MM_DD_HH_MM_SS();
    let dateUpdatedHumanReadable:string = 
    this.myTime.getNow_H_YYYY_MM_DD_HH_MM_SS();

    let newComment = 
    this.commentService.getNewComment(
        // public comment:string
        text,
        // public writer:string
        this.loginUser.nickname,
        // public thumbnail_url:string
        this.loginUser.thumbnail,
        // public dateUpdated:string
        dateUpdated,
        // public dateUpdatedHumanReadable:string
        dateUpdatedHumanReadable,
        // public metaObj:any
        metaObj
    );    

    return newComment;
  }

  onClickPostNewComment(event, textarea) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / onClickPostNewComment / init");

    // 새로운 댓글 쓰기가 완료되었을 때, 호출됩니다.

    event.stopPropagation();
    event.preventDefault();

    if(null == textarea) {
      return;
    }

    let text:string = textarea.value;
    if(this.placeholderReply === text || "" === text) {
      return;
    }

    // 입력한 내용이 유효한지 검증
    let myChecker:MyChecker = this.myEvent.myChecker;
    if(!this.myCheckerService.isOK(myChecker, text)) {
      // 실패했다면 실패한 원인을 확인합니다.
      let history = this.myCheckerService.getLastHistory();

      // 유저에게 알림
      if(null != history && null != history.msg) {
        alert(history.msg);
      }

      // 입력창에 다시 포커싱하여 수정하도록 유도.
      textarea.focus();

      return;
    }    

    if(isDebug) console.log("k-d-n-l / onClickPostNewComment / text : ",text);

    // 뷰의 화면에 새로운 댓글을 추가합니다.
    // 로그인한 유저의 섬네일, 이름을 표시합니다.

    let newComment:Comment = this.getNewComment(text, null);

    if(null == this.commentList) {
      this.commentList = [];
    }
    this.commentList.push(newComment);

    // 부모에게 새로운 댓글이 추가된 것을 전달합니다. commentList
    let newMyEvent:MyEvent = this.myEvent.copy();
    newMyEvent.eventName = this.myEventService.ON_ADD_COMMENT;
    newMyEvent.value = text;
    newMyEvent.metaObj = this.myEvent.metaObj;
    this.emitter.emit(newMyEvent);

    if(isDebug) console.log("k-d-n-l / onClickPostNewComment / emit");

    // 답글쓰기 창의 내용을 초기화합니다.
    textarea.value = this.placeholderReply;

  } 

  onClickPostReply(event, textarea, replyContainer, replyBtn, parentComment:Comment) :void {

    // 댓글의 답글쓰기를 완료했을 때, 호출됩니다.

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / onClickPostReply / init");

    event.stopPropagation();
    event.preventDefault();

    if(null == textarea) {
      if(isDebug) console.log("k-d-n-l / onClickPostReply / 중단 / textarea is not valid!");
      return;
    }
    if(null == replyContainer) {
      if(isDebug) console.log("k-d-n-l / onClickPostReply / 중단 / replyContainer is not valid!");
      return;
    }
    if(null == replyBtn) {
      if(isDebug) console.log("k-d-n-l / onClickPostReply / 중단 / replyBtn is not valid!");
      return;
    }
    if(null == parentComment) {
      if(isDebug) console.log("k-d-n-l / onClickPostReply / 중단 / parentComment is not valid!");
      return;
    }
    if(null == this.myEvent || null == this.myEvent.myChecker) {
      if(isDebug) console.log("k-d-n-l / onClickPostReply / 중단 / this.myEvent is not valid!");
      return;
    }

    // 입력한 내용이 없거나 플레이스홀더와 같다면 중단합니다.
    let text = textarea.value;
    if(this.placeholderReply === text || "" === text) {
      return;
    }

    // 입력한 내용이 유효한지 검증
    let myChecker:MyChecker = this.myEvent.myChecker;
    if(!this.myCheckerService.isOK(myChecker, text)) {
      // 실패했다면 실패한 원인을 확인합니다.
      let history = this.myCheckerService.getLastHistory();

      // 유저에게 알림
      if(null != history && null != history.msg) {
        alert(history.msg);
      }

      // 입력창에 다시 포커싱하여 수정하도록 유도.
      textarea.focus();

      return;
    }

    // 답글달기 버튼 갱신
    replyBtn.innerHTML = "답글달기";

    let newComment:Comment = this.getNewComment(text, parentComment);

    if(isDebug) console.log("k-d-n-l / onClickPostReply / newComment : ",newComment);

    if(null == parentComment.childCommentList) {
      parentComment.childCommentList = [];
    }
    parentComment.childCommentList.push(newComment);

    // 부모에게 새로운 댓글이 추가된 것을 전달합니다. commentList
    let newMyEvent:MyEvent = this.myEvent.copy();
    newMyEvent.eventName = this.myEventService.ON_ADD_COMMENT_REPLY;
    newMyEvent.value = text;
    newMyEvent.metaObj = newComment;
    this.emitter.emit(newMyEvent);

    // 답글쓰기 창의 내용을 초기화합니다.
    textarea.value = this.placeholderReply;

    // 답글쓰기 창을 닫습니다.
    if(null != replyContainer) {
      replyContainer.style.display = "none";
    }
    // 새로운 댓글 쓰기 창을 활성화합니다.
    this.isShowNewCommentInput = true;
  }

  onFocusReply(event, taNewReply, replyContainer) :void {

    event.stopPropagation();
    event.preventDefault();

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / onFocusReply / init");

    if(null == this.loginUser) {
      if(isDebug) console.log("comment-list / onFocusReply / 로그인을 하지 않은 경우라면, 로그인 창으로 보냅니다.");

      // 로그인 유저 정보가 없습니다. 로그인 필요 이벤트 발송!
      this.emitEventOnLoginRequired();

      return;
    } // end if

  }

  onClickReply(event, taNewReply, replyContainer) :void {

    event.stopPropagation();
    event.preventDefault();

    let text = taNewReply.value;

    if(null != text && this.placeholderReply === text) {
      taNewReply.value = "";
    }

    console.log("comment.component / onClickReply / text : ",text);
  }

  onBlurReply(event, taNewReply, replyContainer) :void {
    event.stopPropagation();
    event.preventDefault();

    let text = taNewReply.value;

    if(null == text || "" === text) {
      taNewReply.value = this.placeholderReply;
    }

    console.log("comment.component / onBlurReply / text : ",text);
  }    

}