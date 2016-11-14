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
var comment_service_1 = require('../../widget/comment/service/comment.service');
var KlassCommentService = (function () {
    // 카페 클래스에서 댓글 객체를 만들기 위한 로직을 관리하는 클래스.
    function KlassCommentService(commentService) {
        this.commentService = commentService;
    }
    KlassCommentService.prototype.getReviewCommentList = function (klassReviewList) {
        var reviewCommentList = [];
        for (var i = 0; i < klassReviewList.length; ++i) {
            var review = klassReviewList[i];
            var reviewComment = this.commentService.getNewComment(
            // public comment:string
            review.comment, 
            // public writer:string
            review.nickname, 
            // public thumbnail_url:string
            review.thumbnail_url, 
            // public dateUpdated:string
            review.date_updated, 
            // public dateUpdatedHumanReadable:string
            review.date_updated_human_readable, 
            // public metaObj:any
            review);
            var child_comment_list = review.child_review_list;
            var childReviewCommentList = [];
            if (null != child_comment_list && 0 < child_comment_list.length) {
                for (var j = 0; j < child_comment_list.length; ++j) {
                    var childReview = child_comment_list[j];
                    var childReviewComment = this.commentService.getNewComment(
                    // public comment:string
                    childReview.comment, 
                    // public writer:string
                    childReview.nickname, 
                    // public thumbnail_url:string
                    childReview.thumbnail_url, 
                    // public dateUpdated:string
                    childReview.date_updated, 
                    // public dateUpdatedHumanReadable:string
                    childReview.date_updated_human_readable, 
                    // public metaObj:any
                    childReview);
                    childReviewCommentList.push(childReviewComment);
                } // end inner for
                reviewComment.childCommentList = childReviewCommentList;
            } // end if
            reviewCommentList.push(reviewComment);
        } // end outer for        
        return reviewCommentList;
    };
    KlassCommentService.prototype.getQuestionCommentList = function (klassQuestionList) {
        var questionCommentList = [];
        for (var i = 0; i < klassQuestionList.length; ++i) {
            var question = klassQuestionList[i];
            var questionComment = this.commentService.getNewComment(
            // public comment:string
            question.comment, 
            // public writer:string
            question.nickname, 
            // public thumbnail_url:string
            question.thumbnail_url, 
            // public dateUpdated:string
            question.date_updated, 
            // public dateUpdatedHumanReadable:string
            question.date_updated_human_readable, 
            // public metaObj:any
            question);
            var child_comment_list = question.child_question_list;
            var childReviewCommentList = [];
            if (null != child_comment_list && 0 < child_comment_list.length) {
                for (var j = 0; j < child_comment_list.length; ++j) {
                    var childReview = child_comment_list[j];
                    var childReviewComment = this.commentService.getNewComment(
                    // public comment:string
                    childReview.comment, 
                    // public writer:string
                    childReview.nickname, 
                    // public thumbnail_url:string
                    childReview.thumbnail_url, 
                    // public dateUpdated:string
                    childReview.date_updated, 
                    // public dateUpdatedHumanReadable:string
                    childReview.date_updated_human_readable, 
                    // public metaObj:any
                    childReview);
                    childReviewCommentList.push(childReviewComment);
                } // end inner for
                questionComment.childCommentList = childReviewCommentList;
            } // end if
            questionCommentList.push(questionComment);
        } // end outer for        
        return questionCommentList;
    };
    KlassCommentService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [comment_service_1.CommentService])
    ], KlassCommentService);
    return KlassCommentService;
}());
exports.KlassCommentService = KlassCommentService;
//# sourceMappingURL=klass-comment.service.js.map