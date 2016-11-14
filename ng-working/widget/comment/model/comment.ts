import { MyEvent } from '../../../util/model/my-event';

export class Comment {
	public childCommentList:Comment[];
	constructor(
		public id:number,
		public comment:string,
	    public writer:string,
	    public thumbnail_url:string,
	    public dateUpdated:string,
	    public dateUpdatedHumanReadable:string,
	    public metaObj:any
	) {}
}