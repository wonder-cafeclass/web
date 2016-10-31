import { MyEvent } from '../../../util/model/my-event';

export class CheckboxOption {
	constructor(
	    public myEvent:MyEvent,
	    public isFocus:boolean
	) {}
}