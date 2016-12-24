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

import { User }                        from '../../users/model/user';

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
  @Input() isInputDisabled:boolean=false;
  @Input() hasEvaluation:boolean=false; // @ 유저평가 - 별점여부
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / setLoginUser / init");

    if(isDebug) console.log("comment-list / setLoginUser / loginUser : ",loginUser);

    this.loginUser = loginUser;

    this.checkMine(+this.loginUser.id);

  } // end method

  // @ Desc : 작성한 글이 자신의 것인지 확인한다.
  checkMine(writerId:number):void {

    if(!(0 < writerId)) {
      return;
    }

    let commentMap = this.getCommentMap();
    for(var key in commentMap) {
      let comment:Comment = commentMap[key];
      comment.checkMine(writerId);
    }

  }

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
    if(isDebug) console.log("comment-list / emitEventOnReady / init");

    if(!this.watchTower.getIsEventPackReady()) {
      if(isDebug) console.log("comment-list / emitEventOnReady / 중단 / EventPack is not valid!");    
      return;
    }

    let myEventOnReady:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );

    if(isDebug) console.log("comment-list / emitEventOnReady / myEventOnReady : ",myEventOnReady);

    this.emitter.emit(myEventOnReady);

    if(isDebug) console.log("comment-list / emitEventOnReady / Done!");

  } 

  private emitEventOnRemove(commentId:number) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / emitEventOnRemove / init");

    if(!this.watchTower.getIsEventPackReady()) {
      if(isDebug) console.log("comment-list / emitEventOnRemove / 중단 / EventPack is not valid!");    
      return;
    }

    let myEvent:MyEvent = 
    this.watchTower.getEventOnRemove(
      // eventKey:string, 
      this.eventKey,
      // value:string, 
      "" + commentId,
      // myChecker:MyChecker, 
      this.myEvent.myChecker
    );

    if(isDebug) console.log("comment-list / emitEventOnRemove / myEvent : ",myEvent);

    this.emitter.emit(myEvent);

    if(isDebug) console.log("comment-list / emitEventOnRemove / Done!");    

  } // end method

  private emitEventOnAddCommentMeta(comment:Comment) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / emitEventOnChangeMeta / init");

    if(!this.watchTower.getIsEventPackReady()) {
      if(isDebug) console.log("comment-list / emitEventOnChangeMeta / 중단 / EventPack is not valid!");    
      return;
    }

    let myEventOnAddComment:MyEvent = 
    this.watchTower.getEventOnAddCommentMeta(
      // eventKey:string, 
      this.eventKey,
      // value:string, 
      comment.comment,
      // myChecker:MyChecker, 
      this.myEvent.myChecker,
      // meta:any
      comment
    );

    if(isDebug) console.log("comment-list / emitEventOnAddCommentMeta / myEventOnAddComment : ",myEventOnAddComment);

    this.emitter.emit(myEventOnAddComment);

    if(isDebug) console.log("comment-list / emitEventOnAddCommentMeta / Done!");

  } 

  private emitEventOnAddCommentReplyMeta(comment:Comment) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / emitEventOnAddCommentReplyMeta / init");

    if(!this.watchTower.getIsEventPackReady()) {
      if(isDebug) console.log("comment-list / emitEventOnAddCommentReplyMeta / 중단 / EventPack is not valid!");    
      return;
    }

    let myEventOnAddCommentReply:MyEvent = 
    this.watchTower.getEventOnAddCommentReplyMeta(
      // eventKey:string, 
      this.eventKey,
      // value:string, 
      comment.comment,
      // myChecker:MyChecker, 
      this.myEvent.myChecker,
      // meta:any
      comment
    );

    if(isDebug) console.log("comment-list / emitEventOnAddCommentReplyMeta / myEventOnAddCommentReply : ",myEventOnAddCommentReply);

    this.emitter.emit(myEventOnAddCommentReply);

  }     

  private isLogin():boolean {
    if(null != this.loginUser) {
      return true;
    }
    this.emitEventOnLoginRequired();
    return false;
  }
  private emitEventOnLoginRequired() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / emitEventOnLoginRequired / init");

    if(!this.watchTower.getIsEventPackReady()) {
      if(isDebug) console.log("comment-list / emitEventOnLoginRequired / 중단 / EventPack is not valid!");    
      return;
    }

    let myEventOnReady:MyEvent = 
    this.watchTower.getEventOnLoginRequired(
      // eventKey:string, 
      this.eventKey
    );

    if(isDebug) console.log("comment-list / emitEventOnLoginRequired / myEventOnReady : ",myEventOnReady);

    this.emitter.emit(myEventOnReady);

    if(isDebug) console.log("comment-list / emitEventOnLoginRequired / Done!");

  }     

  onClickAddComment(event, replyContainer, replyBtn) :void {

    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / onClickAddComment / init");

    if(!this.isLogin()) {
      return;
    }

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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / onFocusTextarea / init");

    if(!this.isLogin()) {
      return;
    }

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

  private getNewComment(parentId:number, text:string, star:number, metaObj):Comment {

    if(null == text || "" === text) {
      return null;
    }
    if(null == this.loginUser) {
      return null;
    }

    let newComment:Comment = new Comment().setNew(
      // id:number, 
      -1,
      // parentId:number, 
      parentId,
      // comment:string, 
      text,
      // writerId:number
      this.loginUser.id,
      // writer:string, 
      this.loginUser.nickname,
      // thumbnail:string
      this.loginUser.thumbnail,
      // writerId:number
      star
    );

    return newComment;
  }

  onClickPostNewComment(event, textarea) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / onClickPostNewComment / init");

    if(!this.isLogin()) {
      return;
    }

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

    if(isDebug) console.log("comment-list / onClickPostNewComment / text : ",text);

    // 뷰의 화면에 새로운 댓글을 추가합니다.
    // 로그인한 유저의 섬네일, 이름을 표시합니다.

    let newComment:Comment = this.getNewComment(-1, text, this.starScore, null);

    if(isDebug) console.log("comment-list / onClickPostNewComment / newComment : ",newComment);

    if(null == this.commentList) {
      this.commentList = [];
    }
    this.commentList.push(newComment);

    // 부모에게 새로운 댓글이 추가된 것을 전달합니다.
    this.emitEventOnAddCommentMeta(newComment);

    // 답글쓰기 창의 내용을 초기화합니다.
    textarea.value = this.placeholderReply;
    this.starScore = 0;

    // 별점 초기화
    this.offStars();

  } 

  onClickPostReply(event, textarea, replyContainer, replyBtn, parentComment:Comment) :void {

    // 댓글의 답글쓰기를 완료했을 때, 호출됩니다.

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / onClickPostReply / init");

    event.stopPropagation();
    event.preventDefault();

    if(!this.isLogin()) {
      return;
    }

    if(null == textarea) {
      if(isDebug) console.log("comment-list / onClickPostReply / 중단 / textarea is not valid!");
      return;
    }
    if(null == replyContainer) {
      if(isDebug) console.log("comment-list / onClickPostReply / 중단 / replyContainer is not valid!");
      return;
    }
    if(null == replyBtn) {
      if(isDebug) console.log("comment-list / onClickPostReply / 중단 / replyBtn is not valid!");
      return;
    }
    if(null == parentComment) {
      if(isDebug) console.log("comment-list / onClickPostReply / 중단 / parentComment is not valid!");
      return;
    }
    if(null == this.myEvent || null == this.myEvent.myChecker) {
      if(isDebug) console.log("comment-list / onClickPostReply / 중단 / this.myEvent is not valid!");
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

    let newComment:Comment = this.getNewComment(parentComment.id, text, this.starScore, parentComment);

    if(isDebug) console.log("comment-list / onClickPostReply / newComment : ",newComment);

    if(null == parentComment.childCommentList) {
      parentComment.childCommentList = [];
    }
    parentComment.childCommentList.push(newComment);

    // 부모에게 새로운 댓글이 추가된 것을 전달합니다. commentList
    this.emitEventOnAddCommentReplyMeta(newComment);

    // 답글쓰기 창의 내용을 초기화합니다.
    textarea.value = this.placeholderReply;
    this.starScore = 0;

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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / onFocusReply / init");

    if(!this.isLogin()) {
      return;
    }
  }

  onClickReply(event, taNewReply, replyContainer) :void {

    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / onClickReply / init");

    if(!this.isLogin()) {
      return;
    }

    let text = taNewReply.value;

    if(null != text && this.placeholderReply === text) {
      taNewReply.value = "";
    }

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

  private starScore:number=0;
  private starList:any[];
  private evaluationList:string[] = ["별로에요","나쁘지않아요","들을만해요","괜찮아요","최고에요!"];
  private evaluationDefault:string="별점을 매겨주세요";
  evaluation:string="별점을 매겨주세요";
  onOverStar(event, star1, star2, star3, star4, star5, score:number) :void {

    event.stopPropagation();
    event.preventDefault();    

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / onOverStar / init");

    if(null == this.starList) {
      this.starList = [star1, star2, star3, star4, star5];
    }
    for (var i = 0; i < this.starList.length; ++i) {
      if(i< score) {
        this.starList[i].className="glyphicon glyphicon-star";
      } else {
        this.starList[i].className="glyphicon glyphicon-star-empty";
      } // end if

    } // end for

    // 별점 등록!
    this.starScore=score;
    this.evaluation=this.evaluationList[(score - 1)];
  }

  // @ Desc : 모든 별점을 끕니다.
  offStars():void {

    if(null == this.starList || 0 === this.starList.length) {
      return;
    } // end if

    for (var i = 0; i < this.starList.length; ++i) {
      this.starList[i].className="glyphicon glyphicon-star-empty";
    } // end for

    // 별점 메시지 초기화
    this.evaluation = this.evaluationDefault;

  }
  
  onOutStar(event, star1, star2, star3, star4, star5) :void {

    event.stopPropagation();
    event.preventDefault();    

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / onOutStar / init");

    if(null == this.starList) {
      this.starList = [star1, star2, star3, star4, star5];
    }
    for (var i = 0; i < this.starList.length; ++i) {
      this.starList[i].className="glyphicon glyphicon-star-empty";
    } // end for

    // 별점 등록!
    this.starScore=0;
    this.evaluation="별점을 매겨주세요";

  } // end method

  // @ Desc : uniqueId를 키로 하는 comment 맵을 만듭니다.
  getCommentMap() :any {

    let map:any = {};

    if(null == this.commentList || 0 ===  this.commentList.length) {
      return map;
    }

    for (var i = 0; i < this.commentList.length; ++i) {
      let comment:Comment = this.commentList[i];
      map[comment.uniqueId] = comment;

      let childCommentList = comment.childCommentList;
      if(null != childCommentList && 0 < childCommentList.length) {

        for (var j = 0; j < childCommentList.length; ++j) {
          let childComment:Comment = childCommentList[j];
          map[childComment.uniqueId] = childComment;          
        } // end for

      } // end if

    } // end for

    return map;

  }

  // @ Desc : DB 업데이트 완료! 해당 comment를 업데이트해줍니다.
  updateComment(comment:Comment) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / updateComment / init");
    if(isDebug) console.log("comment-list / updateComment / comment : ",comment);

    // 1. 받은 comment를 리스트에서 검색합니다.
    let commentMap:any = this.getCommentMap();
    let commentFromMap:Comment = commentMap[comment.uniqueId];

    if(isDebug) console.log("comment-list / updateComment / commentMap : ",commentMap);
    if(isDebug) console.log("comment-list / updateComment / commentFromMap : ",commentFromMap);

    if(null != commentFromMap) {
      commentFromMap.id = comment.id;
    } // end if

  }

  private removeCommentFromCommentList(uniqueId:number):void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / removeCommentFromCommentList / init");
    if(isDebug) console.log("comment-list / removeCommentFromCommentList / uniqueId : ",uniqueId);


    if(null == this.commentList || 0 === this.commentList.length) {
      return;
    }
    if(null == uniqueId || !(0 < uniqueId)) {
      return;
    }

    let commentListNext:Comment[] = [];
    for (var i = 0; i < this.commentList.length; ++i) {
      let comment:Comment = this.commentList[i];
      comment.childCommentList;

      if(+comment.uniqueId === uniqueId){
        // 삭제함
        continue;
      } // end if

      let childCommentListNext:Comment[] = [];
      if( null != comment.childCommentList && 
          0 < comment.childCommentList.length) {

        for (var j = 0; j < comment.childCommentList.length; ++j) {
          let childComment:Comment = comment.childCommentList[j];

          if(+childComment.uniqueId === uniqueId){
            // 삭제함
            continue;
          } // end if

          childCommentListNext.push(childComment);

        } // end for

      } // end if

      comment.childCommentList = childCommentListNext;
      commentListNext.push(comment);

    } // end for

    if(isDebug) console.log("comment-list / removeCommentFromCommentList / commentListNext : ",commentListNext);

    this.commentList = commentListNext;

  } // end method

  onClickRemoveComment(event, commentToRemove:Comment):void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("comment-list / onClickRemoveComment / init");
    if(isDebug) console.log("comment-list / onClickRemoveComment / commentToRemove : ",commentToRemove);

    // 1. 화면에 표시된 리스트에서 삭제 대상 comment를 제외한 배열을 만듭니다.
    this.removeCommentFromCommentList(commentToRemove.uniqueId);
    this.emitEventOnRemove(commentToRemove.id);

  }

}