import { Injectable }        from '@angular/core';
import { Comment }           from '../model/comment';
import { MyEventService }    from '../../../util/my-event.service';

@Injectable()
export class CommentService {

    // 카페 클래스에서 댓글 객체를 만들기 위한 로직을 관리하는 클래스.
    constructor(private myEventService:MyEventService) {}

    getNewComment(  comment:string, 
                    writer:string, 
                    thumbnail_url:string, 
                    dateUpdated:string, 
                    dateUpdatedHumanReadable:string, 
                    metaObj:any) :Comment {

        let newComment = 
        new Comment(
            // public id:number
            this.myEventService.getUniqueIdx(),
            // public comment:string
            comment,
            // public writer:string
            writer,
            // public thumbnail_url:string
            thumbnail_url,
            // public dateUpdated:string
            dateUpdated,
            // public dateUpdatedHumanReadable:string
            dateUpdatedHumanReadable,
            // public metaObj:any
            metaObj
        );        

        return newComment;
    }

}
