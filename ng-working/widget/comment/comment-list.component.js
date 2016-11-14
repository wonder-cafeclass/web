"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var my_event_service_1 = require('../../util/my-event.service');
var my_event_1 = require('../../util/model/my-event');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var image_service_1 = require('../../util/image.service');
var comment_service_1 = require('./service/comment.service');
/*
*
* @ Desc   :
* 댓글 노출 및 입력,수정,삭제가 가능한 컴포넌트입니다.
*
* @ Author : Wonder Jung
*
*/
var CommentListComponent = (function () {
    function CommentListComponent(myEventService, myCheckerService, commentService, imageService) {
        this.myEventService = myEventService;
        this.myCheckerService = myCheckerService;
        this.commentService = commentService;
        this.imageService = imageService;
        this.isAdmin = false;
        this.cageWidth = -1;
        this.cageHeight = -1;
        this.isShowNewCommentInput = true;
        this.emitter = new core_1.EventEmitter();
    }
    CommentListComponent.prototype.ngOnInit = function () {
        console.log("comment.component / ngOnInit / commentList : ", this.commentList);
    };
    CommentListComponent.prototype.onClickAddComment = function (event, replyContainer, replyBtn) {
        event.stopPropagation();
        event.preventDefault();
        // Toggle input
        if ("none" === replyContainer.style.display) {
            replyContainer.style.display = "block";
            this.isShowNewCommentInput = false;
        }
        else {
            replyContainer.style.display = "none";
            this.isShowNewCommentInput = true;
        }
        // Toggle btn name
        if ("답글달기" === replyBtn.innerHTML) {
            replyBtn.innerHTML = "닫기";
        }
        else {
            replyBtn.innerHTML = "답글달기";
        }
    };
    CommentListComponent.prototype.onClickTextarea = function (event, taNewComment) {
        event.stopPropagation();
        event.preventDefault();
        var text = taNewComment.value;
        if (null != text && this.placeholderInput === text) {
            taNewComment.value = "";
        }
        console.log("comment.component / onClickTextarea / text : ", text);
    };
    CommentListComponent.prototype.onBlurTextarea = function (event, taNewComment) {
        event.stopPropagation();
        event.preventDefault();
        var text = taNewComment.value;
        if (null == text || "" === text) {
            taNewComment.value = this.placeholderInput;
        }
        console.log("comment.component / onBlurTextarea / text : ", text);
    };
    CommentListComponent.prototype.onClickPostNewComment = function (event, textarea) {
        // 새로운 댓글 쓰기가 완료되었을 때, 호출됩니다.
        event.stopPropagation();
        event.preventDefault();
        if (null == textarea) {
            return;
        }
        var text = textarea.value;
        if (this.placeholderReply === text || "" === text) {
            return;
        }
        // 입력한 내용이 유효한지 검증
        var myChecker = this.myEvent.myChecker;
        if (!this.myCheckerService.isOK(myChecker, text)) {
            // 실패했다면 실패한 원인을 확인합니다.
            var history_1 = this.myCheckerService.getLastHistory();
            // 유저에게 알림
            if (null != history_1 && null != history_1.msg) {
                alert(history_1.msg);
            }
            // 입력창에 다시 포커싱하여 수정하도록 유도.
            textarea.focus();
            return;
        }
        console.log("comment-list / onClickPostNewComment / text : ", text);
        // 뷰의 화면에 새로운 댓글을 추가합니다.
        var dummyNickname = "Dummy";
        var dummyThumbnail = this.imageService.get(this.imageService.userDummy);
        var dummyDateUpdated = "201-11-14 13:40:32";
        var dummyDateUpdatedHumanReadable = "2016년 11월 14일 오후 1:40:32";
        var newComment = this.commentService.getNewComment(
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
        this.myEvent.metaObj);
        if (null == this.commentList) {
            this.commentList = [];
        }
        this.commentList.push(newComment);
        // 부모에게 새로운 댓글이 추가된 것을 전달합니다. commentList
        var newMyEvent = this.myEvent.copy();
        newMyEvent.eventName = this.myEventService.ON_ADD_COMMENT;
        newMyEvent.value = text;
        newMyEvent.metaObj = this.myEvent.metaObj;
        this.emitter.emit(newMyEvent);
        // 답글쓰기 창의 내용을 초기화합니다.
        textarea.value = this.placeholderReply;
    };
    CommentListComponent.prototype.onClickPostReply = function (event, textarea, replyContainer, replyBtn, parentComment) {
        // 댓글의 답글쓰기를 완료했을 때, 호출됩니다.
        event.stopPropagation();
        event.preventDefault();
        if (null == textarea) {
            return;
        }
        if (null == replyContainer) {
            return;
        }
        if (null == replyBtn) {
            return;
        }
        if (null == parentComment || null == parentComment.metaObj) {
            return;
        }
        if (null == this.myEvent || null == this.myEvent.myChecker) {
            return;
        }
        // 입력한 내용이 없거나 플레이스홀더와 같다면 중단합니다.
        var text = textarea.value;
        if (this.placeholderReply === text || "" === text) {
            return;
        }
        // 입력한 내용이 유효한지 검증
        var myChecker = this.myEvent.myChecker;
        if (!this.myCheckerService.isOK(myChecker, text)) {
            // 실패했다면 실패한 원인을 확인합니다.
            var history_2 = this.myCheckerService.getLastHistory();
            // 유저에게 알림
            if (null != history_2 && null != history_2.msg) {
                alert(history_2.msg);
            }
            // 입력창에 다시 포커싱하여 수정하도록 유도.
            textarea.focus();
            return;
        }
        // 답글달기 버튼 갱신
        replyBtn.innerHTML = "답글달기";
        // 뷰의 화면에 새로운 댓글을 추가합니다.
        var dummyNickname = "Dummy";
        var dummyThumbnail = this.imageService.get(this.imageService.userDummy);
        var dummyDateUpdated = "201-11-14 13:40:32";
        var dummyDateUpdatedHumanReadable = "2016년 11월 14일 오후 1:40:32";
        var newComment = this.commentService.getNewComment(
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
        parentComment);
        if (null == parentComment.childCommentList) {
            parentComment.childCommentList = [];
        }
        parentComment.childCommentList.push(newComment);
        // 부모에게 새로운 댓글이 추가된 것을 전달합니다. commentList
        var newMyEvent = this.myEvent.copy();
        newMyEvent.eventName = this.myEventService.ON_ADD_COMMENT_REPLY;
        newMyEvent.value = text;
        newMyEvent.metaObj = newComment;
        this.emitter.emit(newMyEvent);
        // 답글쓰기 창의 내용을 초기화합니다.
        textarea.value = this.placeholderReply;
        // 답글쓰기 창을 닫습니다.
        if (null != replyContainer) {
            replyContainer.style.display = "none";
        }
        // 새로운 댓글 쓰기 창을 활성화합니다.
        this.isShowNewCommentInput = true;
    };
    CommentListComponent.prototype.onClickReply = function (event, taNewReply, replyContainer) {
        event.stopPropagation();
        event.preventDefault();
        var text = taNewReply.value;
        if (null != text && this.placeholderReply === text) {
            taNewReply.value = "";
        }
        console.log("comment.component / onClickReply / text : ", text);
    };
    CommentListComponent.prototype.onBlurReply = function (event, taNewReply, replyContainer) {
        event.stopPropagation();
        event.preventDefault();
        var text = taNewReply.value;
        if (null == text || "" === text) {
            taNewReply.value = this.placeholderReply;
        }
        console.log("comment.component / onBlurReply / text : ", text);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], CommentListComponent.prototype, "isAdmin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], CommentListComponent.prototype, "commentList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_event_1.MyEvent)
    ], CommentListComponent.prototype, "myEvent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], CommentListComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], CommentListComponent.prototype, "cageHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CommentListComponent.prototype, "placeholderInput", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CommentListComponent.prototype, "placeholderReply", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CommentListComponent.prototype, "emitter", void 0);
    CommentListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'comment-list',
            templateUrl: 'comment-list.component.html',
            styleUrls: ['comment-list.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, my_checker_service_1.MyCheckerService, comment_service_1.CommentService, image_service_1.ImageService])
    ], CommentListComponent);
    return CommentListComponent;
}());
exports.CommentListComponent = CommentListComponent;
//# sourceMappingURL=comment-list.component.js.map