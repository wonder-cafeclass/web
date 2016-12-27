import {  Component, 
          ViewChild,
          OnInit, 
          AfterViewInit,
          ViewChildren,
          QueryList,
          Output, 
          EventEmitter,
          Input }                     from '@angular/core';

import { MyEventService }             from '../../../util/service/my-event.service';
import { MyEvent }                    from '../../../util/model/my-event';          

import { PasswordSingleComponent }	  from './password-single.component';

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

	@ViewChildren(PasswordSingleComponent) childrenPW: QueryList<PasswordSingleComponent>;

	constructor(private myEventService:MyEventService) {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {}

  	onChangedFromChild(myEvent:MyEvent) {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("passwords-triplet / onChangedFromChild / init");
		if(isDebug) console.log("passwords-triplet / onChangedFromChild / myEvent : ",myEvent);

		this.emitEvent(myEvent);

	} // end method

	private emitEvent(myEvnet:MyEvent) :void {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("passwords-triplet / emitEvent / init");

		this.emitter.emit(myEvnet);
	}

	public showTooltipWarning(eventKey:string, msg:string) :void {

		// childrenPW
		// http://blog.mgechev.com/2016/01/23/angular2-viewchildren-contentchildren-difference-viewproviders/

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("passwords-triplet / showTooltipWarning / init");

		let childPW:PasswordSingleComponent = this.getChild(eventKey);
		if(isDebug) console.log("passwords-triplet / showTooltipWarning / childPW : ",childPW);

		if(null == childPW) {
			if(isDebug) console.log("passwords-triplet / showTooltipWarning / 중단 / childPW is not valid!");
			return;
		}
		childPW.showTooltipFailWarning(
			// warningMsg:string
			msg,
			// isTimeout:boolean
			false
		);

	}
	public showTooltipSuccess(eventKey:string, msg:string) :void {

		// childrenPW
		// http://blog.mgechev.com/2016/01/23/angular2-viewchildren-contentchildren-difference-viewproviders/

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("passwords-triplet / showTooltipSuccess / init");

		let childPW:PasswordSingleComponent = this.getChild(eventKey);
		if(isDebug) console.log("passwords-triplet / showTooltipSuccess / childPW : ",childPW);

		if(null == childPW) {
			if(isDebug) console.log("passwords-triplet / showTooltipSuccess / 중단 / childPW is not valid!");
			return;
		}
		childPW.showTooltipSuccess(msg);
	}	


	private getChild(eventKey:string) :any {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("passwords-triplet / getChild / init");

		let target:PasswordSingleComponent = null;

		this.childrenPW.forEach(function(childPW) {

		    if(isDebug) console.log("passwords-triplet / getChild / eventKey : ",eventKey);
		    if(isDebug) console.log("passwords-triplet / getChild / childPW.eventKey : ",childPW.eventKey);

		    if(eventKey === childPW.eventKey) {
		    	if(isDebug) console.log("passwords-triplet / getChild / childPW : ",childPW);
		    	target = childPW;
		    	return;
		    }
		}); // end for-each

		return target;
	}

	public isOK(password:string) :boolean {
		let childPW:PasswordSingleComponent = this.getChild(this.eventKeyHead);
		return childPW.isOK(password);
	}

	public cleanPasswords() :void {
		// 모든 비밀번호 란을 초기화합니다.

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("passwords-triplet / cleanPasswords / init");

		this.childrenPW.forEach(function(childPW) {

		    if(isDebug) console.log("passwords-triplet / cleanPasswords / childPW.eventKey : ",childPW.eventKey);
		    childPW.initPassword();

		}); // end for-each		

	}

}