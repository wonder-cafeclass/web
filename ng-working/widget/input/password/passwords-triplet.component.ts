import {  Component, 
          ViewChild,
          OnInit, 
          AfterViewInit,
          Output, 
          EventEmitter,
          Input }                     from '@angular/core';

import { MyEventService }             from '../../../util/service/my-event.service';
import { MyEvent }                    from '../../../util/model/my-event';          

@Component({
  moduleId: module.id,
  selector: 'passwords-triplet',
  templateUrl: 'passwords-triplet.component.html',
  styleUrls: [ 'passwords-triplet.component.css' ]
})
export class PasswordsTripletComponent implements OnInit, AfterViewInit {

	@Input() eventKeyHead:string="";
	@Input() eventKeyBody:string="";
	@Input() eventKeyTail:string="";

	@Output() emitter = new EventEmitter<any>();

	private curPassword:string;
	private newPassword:string;
	private rePassword:string;

	constructor(private myEventService:MyEventService) {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {}

  	onChangedFromChild(myEvent:MyEvent) {

		let isDebug:boolean = true;
		// let isDebug:boolean = false;
		if(isDebug) console.log("passwords-triplet / onChangedFromChild / init");
		if(isDebug) console.log("passwords-triplet / onChangedFromChild / myEvent : ",myEvent);

		this.emitEvent(myEvent);

	} // end method

	private emitEvent(myEvnet:MyEvent) :void {

		let isDebug:boolean = true;
		// let isDebug:boolean = false;
		if(isDebug) console.log("passwords-triplet / emitEvent / init");

		this.emitter.emit(myEvnet);
	}

}