import { MyEvent } from '../../../util/model/my-event';

export class CheckBoxOption {
	constructor(
		public title:string,
	    public isFocus:boolean,
	    public myEvent:MyEvent
	) {}
}