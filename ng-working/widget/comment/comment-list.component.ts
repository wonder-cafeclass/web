import {  Component, 
          OnInit,
          Output,
          EventEmitter,
          Input }                      from '@angular/core';

import { MyEventService }              from '../../util/my-event.service';
import { MyEvent }                     from '../../util/model/my-event';
import { MyCheckerService }            from '../../util/service/my-checker.service';
import { MyChecker }                   from '../../util/model/my-checker';
import { ImageService }                from '../../util/image.service';
import { MyButton }                    from '../../util/model/my-button';
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
  @Input() myEvent:MyEvent;
  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  @Input() cageHeight:number=-1;
  cageHeightStr:string;

  @Input() placeholderInput:string;
  @Input() placeholderReply:string;

  isShowNewCommentInput:boolean=true;

  @Output() emitter = new EventEmitter<any>();

  constructor(  private myEventService:MyEventService, 
                private myCheckerService:MyCheckerService,
                private commentService:CommentService,
                private imageService:ImageService) {}

  ngOnInit(): void {

    console.log("comment.component / ngOnInit / commentList : ",this.commentList);

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

  onClickPostNewComment(event, textarea) :void {

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

    console.log("comment-list / onClickPostNewComment / text : ",text);

    // 뷰의 화면에 새로운 댓글을 추가합니다.
    let dummyNickname = "Dummy";
    let dummyThumbnail = this.imageService.get(this.imageService.userDummy);
    let dummyDateUpdated = "201-11-14 13:40:32";
    let dummyDateUpdatedHumanReadable = "2016년 11월 14일 오후 1:40:32";
    let newComment = 
    this.commentService.getNewComment(
        // public comment:string
        text,
        // public writer:string
        dummyNickname,
        // public thumbnail_url:string
        dummyThumbnail,
        // public dateUpdated:string
        dummyDateUpdated,
        // public dateUpdatedHumanReadable:string
        dummyDateUpdatedHumanReadable,
        // public metaObj:any
        this.myEvent.metaObj
    );

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

    // 답글쓰기 창의 내용을 초기화합니다.
    textarea.value = this.placeholderReply;

  } 

  onClickPostReply(event, textarea, replyContainer, replyBtn, parentComment:Comment) :void {

    // 댓글의 답글쓰기를 완료했을 때, 호출됩니다.

    event.stopPropagation();
    event.preventDefault();

    if(null == textarea) {
      return;
    }
    if(null == replyContainer) {
      return;
    }
    if(null == replyBtn) {
      return;
    }
    if(null == parentComment || null == parentComment.metaObj) {
      return;
    }
    if(null == this.myEvent || null == this.myEvent.myChecker) {
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

    // 뷰의 화면에 새로운 댓글을 추가합니다.
    let dummyNickname = "Dummy";
    let dummyThumbnail = this.imageService.get(this.imageService.userDummy);
    let dummyDateUpdated = "201-11-14 13:40:32";
    let dummyDateUpdatedHumanReadable = "2016년 11월 14일 오후 1:40:32";
    let newComment = 
    this.commentService.getNewComment(
        // public comment:string
        text,
        // public writer:string
        dummyNickname,
        // public thumbnail_url:string
        dummyThumbnail,
        // public dateUpdated:string
        dummyDateUpdated,
        // public dateUpdatedHumanReadable:string
        dummyDateUpdatedHumanReadable,
        // public metaObj:any
        parentComment
    ); 

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