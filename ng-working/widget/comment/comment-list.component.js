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
var image_service_1 = require('../../util/image.service');
var my_event_1 = require('../../util/model/my-event');
var my_event_service_1 = require('../../util/service/my-event.service');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var my_is_1 = require('../../util/helper/my-is');
var my_time_1 = require('../../util/helper/my-time');
var my_array_1 = require('../../util/helper/my-array');
var comment_1 = require('./model/comment');
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
    function CommentListComponent(myEventService, myCheckerService, watchTower, commentService, imageService) {
        this.myEventService = myEventService;
        this.myCheckerService = myCheckerService;
        this.watchTower = watchTower;
        this.commentService = commentService;
        this.imageService = imageService;
        this.isAdmin = false;
        this.isInputDisabled = false;
        this.hasEvaluation = false; // @ 유저평가 - 별점여부
        this.cageWidth = -1;
        this.cageHeight = -1;
        this.isShowNewCommentInput = true;
        this.loginUser = null;
        this.emitter = new core_1.EventEmitter();
        this.starScore = 0;
        this.evaluationList = ["별로에요", "나쁘지않아요", "들을만해요", "괜찮아요", "최고에요!"];
        this.evaluationDefault = "별점을 매겨주세요";
        this.evaluation = "별점을 매겨주세요";
    }
    CommentListComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / ngOnInit / init");
        this.myIs = new my_is_1.HelperMyIs();
        this.myTime = new my_time_1.HelperMyTime();
        this.myArray = new my_array_1.HelperMyArray();
        this.subscribeEventPack();
    };
    CommentListComponent.prototype.setLoginUser = function (loginUser) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / setLoginUser / init");
        if (isDebug)
            console.log("comment-list / setLoginUser / loginUser : ", loginUser);
        this.loginUser = loginUser;
        this.checkMine(+this.loginUser.id);
    }; // end method
    // @ Desc : 작성한 글이 자신의 것인지 확인한다.
    CommentListComponent.prototype.checkMine = function (writerId) {
        if (!(0 < writerId)) {
            return;
        }
        var commentMap = this.getCommentMap();
        for (var key in commentMap) {
            var comment = commentMap[key];
            comment.checkMine(writerId);
        }
    };
    CommentListComponent.prototype.subscribeEventPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / subscribeEventPack / init");
        var isEventPackReady = this.watchTower.getIsEventPackReady();
        if (isDebug)
            console.log("comment-list / subscribeEventPack / isEventPackReady : ", isEventPackReady);
        if (this.watchTower.getIsEventPackReady()) {
            // 1. 이미 EventPack 로딩이 완료된 경우
            // 부모 객체에게 component가 준비된 것을 알립니다.
            this.emitEventOnReady();
        }
        else {
            // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
            this.watchTower.isEventPackReady$.subscribe(function (isEventPackReady) {
                if (isDebug)
                    console.log("comment-list / subscribeEventPack / isEventPackReady : ", isEventPackReady);
                // 이벤트 관련 정보가 준비되었습니다.
                // 부모 객체에게 component가 준비된 것을 알립니다.
                _this.emitEventOnReady();
            }); // end subscribe
        } // end if
    }; // end method 
    CommentListComponent.prototype.emitEventOnReady = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / emitEventOnReady / init");
        if (!this.watchTower.getIsEventPackReady()) {
            if (isDebug)
                console.log("comment-list / emitEventOnReady / 중단 / EventPack is not valid!");
            return;
        }
        var myEventOnReady = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        if (isDebug)
            console.log("comment-list / emitEventOnReady / myEventOnReady : ", myEventOnReady);
        this.emitter.emit(myEventOnReady);
        if (isDebug)
            console.log("comment-list / emitEventOnReady / Done!");
    };
    CommentListComponent.prototype.emitEventOnRemove = function (commentId) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / emitEventOnRemove / init");
        if (!this.watchTower.getIsEventPackReady()) {
            if (isDebug)
                console.log("comment-list / emitEventOnRemove / 중단 / EventPack is not valid!");
            return;
        }
        var myEvent = this.watchTower.getEventOnRemove(
        // eventKey:string, 
        this.eventKey, 
        // value:string, 
        "" + commentId, 
        // myChecker:MyChecker, 
        this.myEvent.myChecker);
        if (isDebug)
            console.log("comment-list / emitEventOnRemove / myEvent : ", myEvent);
        this.emitter.emit(myEvent);
        if (isDebug)
            console.log("comment-list / emitEventOnRemove / Done!");
    }; // end method
    CommentListComponent.prototype.emitEventOnAddCommentMeta = function (comment) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / emitEventOnChangeMeta / init");
        if (!this.watchTower.getIsEventPackReady()) {
            if (isDebug)
                console.log("comment-list / emitEventOnChangeMeta / 중단 / EventPack is not valid!");
            return;
        }
        var myEventOnAddComment = this.watchTower.getEventOnAddCommentMeta(
        // eventKey:string, 
        this.eventKey, 
        // value:string, 
        comment.comment, 
        // myChecker:MyChecker, 
        this.myEvent.myChecker, 
        // meta:any
        comment);
        if (isDebug)
            console.log("comment-list / emitEventOnAddCommentMeta / myEventOnAddComment : ", myEventOnAddComment);
        this.emitter.emit(myEventOnAddComment);
        if (isDebug)
            console.log("comment-list / emitEventOnAddCommentMeta / Done!");
    };
    CommentListComponent.prototype.emitEventOnAddCommentReplyMeta = function (comment) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / emitEventOnAddCommentReplyMeta / init");
        if (!this.watchTower.getIsEventPackReady()) {
            if (isDebug)
                console.log("comment-list / emitEventOnAddCommentReplyMeta / 중단 / EventPack is not valid!");
            return;
        }
        var myEventOnAddCommentReply = this.watchTower.getEventOnAddCommentReplyMeta(
        // eventKey:string, 
        this.eventKey, 
        // value:string, 
        comment.comment, 
        // myChecker:MyChecker, 
        this.myEvent.myChecker, 
        // meta:any
        comment);
        if (isDebug)
            console.log("comment-list / emitEventOnAddCommentReplyMeta / myEventOnAddCommentReply : ", myEventOnAddCommentReply);
        this.emitter.emit(myEventOnAddCommentReply);
    };
    CommentListComponent.prototype.isLogin = function () {
        if (null != this.loginUser) {
            return true;
        }
        this.emitEventOnLoginRequired();
        return false;
    };
    CommentListComponent.prototype.emitEventOnLoginRequired = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / emitEventOnLoginRequired / init");
        if (!this.watchTower.getIsEventPackReady()) {
            if (isDebug)
                console.log("comment-list / emitEventOnLoginRequired / 중단 / EventPack is not valid!");
            return;
        }
        var myEventOnReady = this.watchTower.getEventOnLoginRequired(
        // eventKey:string, 
        this.eventKey);
        if (isDebug)
            console.log("comment-list / emitEventOnLoginRequired / myEventOnReady : ", myEventOnReady);
        this.emitter.emit(myEventOnReady);
        if (isDebug)
            console.log("comment-list / emitEventOnLoginRequired / Done!");
    };
    CommentListComponent.prototype.onClickAddComment = function (event, replyContainer, replyBtn) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / onClickAddComment / init");
        if (!this.isLogin()) {
            return;
        }
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
    CommentListComponent.prototype.onFocusTextarea = function (event, taNewComment) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / onFocusTextarea / init");
        if (!this.isLogin()) {
            return;
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
    CommentListComponent.prototype.getNewComment = function (parentId, text, star, metaObj) {
        if (null == text || "" === text) {
            return null;
        }
        if (null == this.loginUser) {
            return null;
        }
        var newComment = new comment_1.Comment().setNew(
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
        star);
        return newComment;
    };
    CommentListComponent.prototype.onClickPostNewComment = function (event, textarea) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / onClickPostNewComment / init");
        if (!this.isLogin()) {
            return;
        }
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
        if (isDebug)
            console.log("comment-list / onClickPostNewComment / text : ", text);
        // 뷰의 화면에 새로운 댓글을 추가합니다.
        // 로그인한 유저의 섬네일, 이름을 표시합니다.
        var newComment = this.getNewComment(-1, text, this.starScore, null);
        if (isDebug)
            console.log("comment-list / onClickPostNewComment / newComment : ", newComment);
        if (null == this.commentList) {
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
    };
    CommentListComponent.prototype.onClickPostReply = function (event, textarea, replyContainer, replyBtn, parentComment) {
        // 댓글의 답글쓰기를 완료했을 때, 호출됩니다.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / onClickPostReply / init");
        event.stopPropagation();
        event.preventDefault();
        if (!this.isLogin()) {
            return;
        }
        if (null == textarea) {
            if (isDebug)
                console.log("comment-list / onClickPostReply / 중단 / textarea is not valid!");
            return;
        }
        if (null == replyContainer) {
            if (isDebug)
                console.log("comment-list / onClickPostReply / 중단 / replyContainer is not valid!");
            return;
        }
        if (null == replyBtn) {
            if (isDebug)
                console.log("comment-list / onClickPostReply / 중단 / replyBtn is not valid!");
            return;
        }
        if (null == parentComment) {
            if (isDebug)
                console.log("comment-list / onClickPostReply / 중단 / parentComment is not valid!");
            return;
        }
        if (null == this.myEvent || null == this.myEvent.myChecker) {
            if (isDebug)
                console.log("comment-list / onClickPostReply / 중단 / this.myEvent is not valid!");
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
        var newComment = this.getNewComment(parentComment.id, text, this.starScore, parentComment);
        if (isDebug)
            console.log("comment-list / onClickPostReply / newComment : ", newComment);
        if (null == parentComment.childCommentList) {
            parentComment.childCommentList = [];
        }
        parentComment.childCommentList.push(newComment);
        // 부모에게 새로운 댓글이 추가된 것을 전달합니다. commentList
        this.emitEventOnAddCommentReplyMeta(newComment);
        // 답글쓰기 창의 내용을 초기화합니다.
        textarea.value = this.placeholderReply;
        this.starScore = 0;
        // 답글쓰기 창을 닫습니다.
        if (null != replyContainer) {
            replyContainer.style.display = "none";
        }
        // 새로운 댓글 쓰기 창을 활성화합니다.
        this.isShowNewCommentInput = true;
    };
    CommentListComponent.prototype.onFocusReply = function (event, taNewReply, replyContainer) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / onFocusReply / init");
        if (!this.isLogin()) {
            return;
        }
    };
    CommentListComponent.prototype.onClickReply = function (event, taNewReply, replyContainer) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / onClickReply / init");
        if (!this.isLogin()) {
            return;
        }
        var text = taNewReply.value;
        if (null != text && this.placeholderReply === text) {
            taNewReply.value = "";
        }
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
    CommentListComponent.prototype.onOverStar = function (event, star1, star2, star3, star4, star5, score) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / onOverStar / init");
        if (null == this.starList) {
            this.starList = [star1, star2, star3, star4, star5];
        }
        for (var i = 0; i < this.starList.length; ++i) {
            if (i < score) {
                this.starList[i].className = "glyphicon glyphicon-star";
            }
            else {
                this.starList[i].className = "glyphicon glyphicon-star-empty";
            } // end if
        } // end for
        // 별점 등록!
        this.starScore = score;
        this.evaluation = this.evaluationList[(score - 1)];
    };
    // @ Desc : 모든 별점을 끕니다.
    CommentListComponent.prototype.offStars = function () {
        if (null == this.starList || 0 === this.starList.length) {
            return;
        } // end if
        for (var i = 0; i < this.starList.length; ++i) {
            this.starList[i].className = "glyphicon glyphicon-star-empty";
        } // end for
        // 별점 메시지 초기화
        this.evaluation = this.evaluationDefault;
    };
    CommentListComponent.prototype.onOutStar = function (event, star1, star2, star3, star4, star5) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / onOutStar / init");
        if (null == this.starList) {
            this.starList = [star1, star2, star3, star4, star5];
        }
        for (var i = 0; i < this.starList.length; ++i) {
            this.starList[i].className = "glyphicon glyphicon-star-empty";
        } // end for
        // 별점 등록!
        this.starScore = 0;
        this.evaluation = "별점을 매겨주세요";
    }; // end method
    // @ Desc : uniqueId를 키로 하는 comment 맵을 만듭니다.
    CommentListComponent.prototype.getCommentMap = function () {
        var map = {};
        if (null == this.commentList || 0 === this.commentList.length) {
            return map;
        }
        for (var i = 0; i < this.commentList.length; ++i) {
            var comment = this.commentList[i];
            map[comment.uniqueId] = comment;
            var childCommentList = comment.childCommentList;
            if (null != childCommentList && 0 < childCommentList.length) {
                for (var j = 0; j < childCommentList.length; ++j) {
                    var childComment = childCommentList[j];
                    map[childComment.uniqueId] = childComment;
                } // end for
            } // end if
        } // end for
        return map;
    };
    // @ Desc : DB 업데이트 완료! 해당 comment를 업데이트해줍니다.
    CommentListComponent.prototype.updateComment = function (comment) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / updateComment / init");
        if (isDebug)
            console.log("comment-list / updateComment / comment : ", comment);
        // 1. 받은 comment를 리스트에서 검색합니다.
        var commentMap = this.getCommentMap();
        var commentFromMap = commentMap[comment.uniqueId];
        if (isDebug)
            console.log("comment-list / updateComment / commentMap : ", commentMap);
        if (isDebug)
            console.log("comment-list / updateComment / commentFromMap : ", commentFromMap);
        if (null != commentFromMap) {
            commentFromMap.id = comment.id;
        } // end if
    };
    CommentListComponent.prototype.removeCommentFromCommentList = function (uniqueId) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / removeCommentFromCommentList / init");
        if (isDebug)
            console.log("comment-list / removeCommentFromCommentList / uniqueId : ", uniqueId);
        if (null == this.commentList || 0 === this.commentList.length) {
            return;
        }
        if (null == uniqueId || !(0 < uniqueId)) {
            return;
        }
        var commentListNext = [];
        for (var i = 0; i < this.commentList.length; ++i) {
            var comment = this.commentList[i];
            comment.childCommentList;
            if (+comment.uniqueId === uniqueId) {
                // 삭제함
                continue;
            } // end if
            var childCommentListNext = [];
            if (null != comment.childCommentList &&
                0 < comment.childCommentList.length) {
                for (var j = 0; j < comment.childCommentList.length; ++j) {
                    var childComment = comment.childCommentList[j];
                    if (+childComment.uniqueId === uniqueId) {
                        // 삭제함
                        continue;
                    } // end if
                    childCommentListNext.push(childComment);
                } // end for
            } // end if
            comment.childCommentList = childCommentListNext;
            commentListNext.push(comment);
        } // end for
        if (isDebug)
            console.log("comment-list / removeCommentFromCommentList / commentListNext : ", commentListNext);
        this.commentList = commentListNext;
    }; // end method
    CommentListComponent.prototype.onClickRemoveComment = function (event, commentToRemove) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment-list / onClickRemoveComment / init");
        if (isDebug)
            console.log("comment-list / onClickRemoveComment / commentToRemove : ", commentToRemove);
        // 1. 화면에 표시된 리스트에서 삭제 대상 comment를 제외한 배열을 만듭니다.
        this.removeCommentFromCommentList(commentToRemove.uniqueId);
        this.emitEventOnRemove(commentToRemove.id);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], CommentListComponent.prototype, "isAdmin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], CommentListComponent.prototype, "isInputDisabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], CommentListComponent.prototype, "hasEvaluation", void 0);
    __decorate([
        // @ 유저평가 - 별점여부
        core_1.Input(), 
        __metadata('design:type', Array)
    ], CommentListComponent.prototype, "commentList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CommentListComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_event_1.MyEvent)
    ], CommentListComponent.prototype, "myEvent", void 0);
    __decorate([
        // @ Deprecated
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
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, my_checker_service_1.MyCheckerService, my_event_watchtower_service_1.MyEventWatchTowerService, comment_service_1.CommentService, image_service_1.ImageService])
    ], CommentListComponent);
    return CommentListComponent;
}());
exports.CommentListComponent = CommentListComponent;
//# sourceMappingURL=comment-list.component.js.map