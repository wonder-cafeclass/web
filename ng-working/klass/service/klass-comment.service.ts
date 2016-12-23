import { Injectable }        from '@angular/core';

import { Klass }             from '../model/klass';
import { KlassReview }       from '../model/klass-review';
import { KlassQuestion }     from '../model/klass-question';

import { CommentService }    from '../../widget/comment/service/comment.service';
import { Comment }           from '../../widget/comment/model/comment';

@Injectable()
export class KlassCommentService {

    // 카페 클래스에서 댓글 객체를 만들기 위한 로직을 관리하는 클래스.
    constructor(private commentService:CommentService) {}

    getReviewCommentList(klassReviewList:KlassReview[], loginUserId:number) :Comment[] {

        let reviewCommentList:Comment[] = [];
        for (var i = 0; i < klassReviewList.length; ++i) {
            let review:KlassReview = klassReviewList[i];
            let reviewComment = review.getComment();

            reviewComment.checkMine(loginUserId);

            let child_comment_list = review.child_review_list;
            let childReviewCommentList:Comment[] = [];
            if(null != child_comment_list && 0 < child_comment_list.length) {

                for (var j = 0; j < child_comment_list.length; ++j) {
                    let childReview:KlassReview = child_comment_list[j];
                    let childReviewComment = childReview.getComment();

                    childReviewComment.checkMine(loginUserId);

                    childReviewCommentList.push(childReviewComment);
                } // end inner for

                reviewComment.childCommentList = childReviewCommentList;
            } // end if

            reviewCommentList.push(reviewComment);
        } // end outer for        

        return reviewCommentList;
    } // end method  

    getQuestionCommentList(klassQuestionList:KlassQuestion[], loginUserId:number) :Comment[] {

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("klass-comment.service / getQuestionCommentList / init");

        let questionCommentList:Comment[] = [];
        for (var i = 0; i < klassQuestionList.length; ++i) {
            let question:KlassQuestion = klassQuestionList[i];
            let questionComment = question.getComment();

            questionComment.checkMine(loginUserId);

            if(isDebug) console.log("klass-comment.service / getQuestionCommentList / question : ",question);
            if(isDebug) console.log("klass-comment.service / getQuestionCommentList / questionComment : ",questionComment);

            let child_comment_list = question.child_question_list;
            if(isDebug) console.log("klass-comment.service / getQuestionCommentList / child_comment_list : ",child_comment_list);

            let childQuestionCommentList:Comment[] = [];
            if(null != child_comment_list && 0 < child_comment_list.length) {

                for (var j = 0; j < child_comment_list.length; ++j) {
                    let childQuestion:KlassQuestion = child_comment_list[j];

                    if(isDebug) console.log("klass-comment.service / getQuestionCommentList / childQuestion : ",childQuestion);

                    let childQuestionComment = childQuestion.getComment();

                    childQuestionComment.checkMine(loginUserId);

                    if(isDebug) console.log("klass-comment.service / getQuestionCommentList / childQuestionComment : ",childQuestionComment);

                    childQuestionCommentList.push(childQuestionComment);
                } // end inner for

                if(isDebug) console.log("klass-comment.service / getQuestionCommentList / childQuestionCommentList : ",childQuestionCommentList);

                questionComment.childCommentList = childQuestionCommentList;
            } // end if

            questionCommentList.push(questionComment);
        } // end outer for        

        return questionCommentList;

    } // end method

}
