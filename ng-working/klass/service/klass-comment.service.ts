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
            new Comment().set(
                // id:number, 
                review.id,
                // comment:string, 
                review.comment,
                // writerId:number, 
                review.user_id,
                // writer:string, 
                review.name,
                // thumbnail:string, 
                review.thumbnail,
                // dateUpdated:string
                review.date_updated
            );

            let child_comment_list = review.child_review_list;
            let childReviewCommentList:Comment[] = [];
            if(null != child_comment_list && 0 < child_comment_list.length) {

                for (var j = 0; j < child_comment_list.length; ++j) {
                    let childReview = child_comment_list[j];
                    let childReviewComment = 
                    new Comment().set(
                        // id:number, 
                        childReview.id,
                        // comment:string, 
                        childReview.comment,
                        // writerId:number, 
                        childReview.user_id,
                        // writer:string, 
                        childReview.name,
                        // thumbnail:string, 
                        childReview.thumbnail,
                        // dateUpdated:string
                        childReview.date_updated
                    );

                    childReviewCommentList.push(childReviewComment);
                } // end inner for

                reviewComment.childCommentList = childReviewCommentList;
            } // end if

            reviewCommentList.push(reviewComment);
        } // end outer for        

        return reviewCommentList;
    } // end method  

    getQuestionCommentList(klassQuestionList:KlassQuestion[]) :Comment[] {

        let questionCommentList:Comment[] = [];
        for (var i = 0; i < klassQuestionList.length; ++i) {
            let question = klassQuestionList[i];
            let questionComment =
            new Comment().set(
                // id:number, 
                question.id,
                // comment:string, 
                question.comment,
                // writerId:number, 
                question.user_id,
                // writer:string, 
                question.name,
                // thumbnail:string, 
                question.thumbnail,
                // dateUpdated:string
                question.date_updated
            );

            let child_comment_list = question.child_question_list;
            let childQuestionCommentList:Comment[] = [];
            if(null != child_comment_list && 0 < child_comment_list.length) {

                for (var j = 0; j < child_comment_list.length; ++j) {
                    let childQuestion = child_comment_list[j];
                    let childQuestionComment = 
                    new Comment().set(
                        // id:number, 
                        childQuestion.id,
                        // comment:string, 
                        childQuestion.comment,
                        // writerId:number, 
                        childQuestion.user_id,
                        // writer:string, 
                        childQuestion.name,
                        // thumbnail:string, 
                        childQuestion.thumbnail,
                        // dateUpdated:string
                        childQuestion.date_updated
                    );

                    childQuestionCommentList.push(childQuestionComment);
                } // end inner for

                questionComment.childCommentList = childQuestionCommentList;
            } // end if

            questionCommentList.push(questionComment);
        } // end outer for        

        return questionCommentList;

    } // end method

}
