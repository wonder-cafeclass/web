import { MyEvent } from '../../../util/model/my-event';

export class InputViewUpdown {
	constructor(
		public myEvent:MyEvent,
		public fontSizeTitle:number,
	    public fontSizeText:number,
	    public type:string,
	    public color:string
	) {}
}