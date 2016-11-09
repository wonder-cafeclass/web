import { MyEvent } from '../../../util/model/my-event';

export class RadioBtnOption {
	constructor(
	    public title:string,
	    public key:string,
	    public isFocus:boolean,
	    public myEvent:MyEvent
	) {}
}