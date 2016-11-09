import { MyEvent } from '../../../util/model/my-event';

export class InputViewUpdown {
	constructor(
		public title:string,
		public fontSizeTitle:number,
	    public fontSizeText:number,
	    public type:string,
	    public color:string,
		public myEvent:MyEvent
	) {}
}