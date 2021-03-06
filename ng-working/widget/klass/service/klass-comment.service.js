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
var comment_service_1 = require('../../../widget/comment/service/comment.service');
var KlassCommentService = (function () {
    // 카페 클래스에서 댓글 객체를 만들기 위한 로직을 관리하는 클래스.
    function KlassCommentService(commentService) {
        this.commentService = commentService;
    }
    KlassCommentService.prototype.getReviewCommentList = function (klassReviewList, loginUserId) {
        var reviewCommentList = [];
        for (var i = 0; i < klassReviewList.length; ++i) {
            var review = klassReviewList[i];
            var reviewComment = review.getComment();
            reviewComment.checkMine(loginUserId);
            var child_comment_list = review.child_review_list;
            var childReviewCommentList = [];
            if (null != child_comment_list && 0 < child_comment_list.length) {
                for (var j = 0; j < child_comment_list.length; ++j) {
                    var childReview = child_comment_list[j];
                    var childReviewComment = childReview.getComment();
                    childReviewComment.checkMine(loginUserId);
                    childReviewCommentList.push(childReviewComment);
                } // end inner for
                reviewComment.childCommentList = childReviewCommentList;
            } // end if
            reviewCommentList.push(reviewComment);
        } // end outer for        
        return reviewCommentList;
    }; // end method  
    KlassCommentService.prototype.getQuestionCommentList = function (klassQuestionList, loginUserId) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-comment.service / getQuestionCommentList / init");
        var questionCommentList = [];
        for (var i = 0; i < klassQuestionList.length; ++i) {
            var question = klassQuestionList[i];
            var questionComment = question.getComment();
            questionComment.checkMine(loginUserId);
            if (isDebug)
                console.log("klass-comment.service / getQuestionCommentList / question : ", question);
            if (isDebug)
                console.log("klass-comment.service / getQuestionCommentList / questionComment : ", questionComment);
            var child_comment_list = question.child_question_list;
            if (isDebug)
                console.log("klass-comment.service / getQuestionCommentList / child_comment_list : ", child_comment_list);
            var childQuestionCommentList = [];
            if (null != child_comment_list && 0 < child_comment_list.length) {
                for (var j = 0; j < child_comment_list.length; ++j) {
                    var childQuestion = child_comment_list[j];
                    if (isDebug)
                        console.log("klass-comment.service / getQuestionCommentList / childQuestion : ", childQuestion);
                    var childQuestionComment = childQuestion.getComment();
                    childQuestionComment.checkMine(loginUserId);
                    if (isDebug)
                        console.log("klass-comment.service / getQuestionCommentList / childQuestionComment : ", childQuestionComment);
                    childQuestionCommentList.push(childQuestionComment);
                } // end inner for
                if (isDebug)
                    console.log("klass-comment.service / getQuestionCommentList / childQuestionCommentList : ", childQuestionCommentList);
                questionComment.childCommentList = childQuestionCommentList;
            } // end if
            questionCommentList.push(questionComment);
        } // end outer for        
        return questionCommentList;
    }; // end method
    KlassCommentService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [comment_service_1.CommentService])
    ], KlassCommentService);
    return KlassCommentService;
}());
exports.KlassCommentService = KlassCommentService;
//# sourceMappingURL=klass-comment.service.js.map