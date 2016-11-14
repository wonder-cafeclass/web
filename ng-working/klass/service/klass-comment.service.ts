import { Injectable }        from '@angular/core';
import { Klass }             from '../model/klass';
import { CommentService }    from '../../widget/comment/service/comment.service';
import { Comment }           from '../../widget/comment/model/comment';
import { KlassReview }       from '../model/klass-review';
import { KlassQuestion }     from '../model/klass-question';

@Injectable()
export class KlassCommentService {

    // 카페 클래스에서 댓글 객체를 만들기 위한 로직을 관리하는 클래스.
    constructor(private commentService:CommentService) {}

    getReviewCommentList(klassReviewList:KlassReview[]) :Comment[] {

        let reviewCommentList:Comment[] = [];
        for (var i = 0; i < klassReviewList.length; ++i) {
            let review = klassReviewList[i];
            let reviewComment =
            this.commentService.getNewComment(
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
                review
            ); 


            let child_comment_list = review.child_review_list;
            let childReviewCommentList:Comment[] = [];
            if(null != child_comment_list && 0 < child_comment_list.length) {

                for (var j = 0; j < child_comment_list.length; ++j) {
                    let childReview = child_comment_list[j];
                    let childReviewComment = 
                    this.commentService.getNewComment(
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
                        childReview
                    );

                    childReviewCommentList.push(childReviewComment);
                } // end inner for

                reviewComment.childCommentList = childReviewCommentList;
            } // end if

            reviewCommentList.push(reviewComment);
        } // end outer for        

        return reviewCommentList;
    }

    getQuestionCommentList(klassQuestionList:KlassQuestion[]) :Comment[] {

        let questionCommentList:Comment[] = [];
        for (var i = 0; i < klassQuestionList.length; ++i) {
            let question = klassQuestionList[i];
            let questionComment =
            this.commentService.getNewComment(
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
                question
            ); 


            let child_comment_list = question.child_question_list;
            let childReviewCommentList:Comment[] = [];
            if(null != child_comment_list && 0 < child_comment_list.length) {

                for (var j = 0; j < child_comment_list.length; ++j) {
                    let childReview = child_comment_list[j];
                    let childReviewComment = 
                    this.commentService.getNewComment(
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
                        childReview
                    );

                    childReviewCommentList.push(childReviewComment);
                } // end inner for

                questionComment.childCommentList = childReviewCommentList;
            } // end if

            questionCommentList.push(questionComment);
        } // end outer for        

        return questionCommentList;
    }    


}
