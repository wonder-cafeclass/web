import { Component, OnInit, Input }   from '@angular/core';
import { ImageService }               from '../../util/image.service';
import { Calendar }                   from './model/calendar';

@Component({
  moduleId: module.id,
  selector: 'mini-calendar',
  templateUrl: 'mini-calendar.component.html',
  styleUrls: [ 'mini-calendar.component.css' ]
})
export class MiniCalendarComponent implements OnInit {

	@Input() calendarTable:Calendar[][];
	@Input() dayBegin:string;
	@Input() dateBegin:string;
	@Input() weekMin:number;
	@Input() weekMax:number;
	@Input() calWidth:number=145;
	calWidthMin:number=145;
	monthBegin:number;

	ngOnInit(): void {
		// set column width
		if(this.calWidth < this.calWidthMin) {
			this.calWidth = this.calWidthMin;
		}

		// 몇 월인지 가져오기.
		let ct:Calendar = this.calendarTable[(this.calendarTable.length - 1)][0];
		if(null != ct && (0 < ct.month)){
			this.monthBegin = +ct.month;
		}
	}

	onMouseOverKlassDate(event, field:Calendar): void {
		event.stopPropagation();

		if(!field.isEnrollment) {
			return;
		}

		console.log("onMouseOverKlassDate / 001 / field : ",field);
		console.log("onMouseOverKlassDate / 001 / calendarTable : ",this.calendarTable);

		// 수강신청을 할 경우, 
	}
}