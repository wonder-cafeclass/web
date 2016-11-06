import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                      from '@angular/core';
import { ImageService }               from '../../util/image.service';
import { MyEventService }             from '../../util/my-event.service';
import { MyEvent }               	  from '../../util/model/my-event';
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

	@Output() emitter = new EventEmitter<MyEvent>();

	constructor(
		public imageService: ImageService,
		private myEventService: MyEventService
	) {}

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

// (mouseenter)="onMouseEnterKlassDate($event, field)"
// (mouseleave)="onMouseLeaveKlassDate($event, field)"

	onMouseLeaveKlassDate(event, date:Calendar): void {
		event.stopPropagation();

		let myEvent:MyEvent = 
		new MyEvent(
		    // public eventName:string
		    this.myEventService.ON_MOUSELEAVE_KLASS_CALENDAR_DATE,
		    // public title:string
		    "mini-calendar",
		    // public key:string
		    "date",
		    // public value:string
		    date.date,
		    // public metaObj:any
		    date
		);

		this.emitter.emit(myEvent);
	}

	onMouseEnterKlassDate(event, date:Calendar): void {
		event.stopPropagation();

		let myEvent:MyEvent = 
		new MyEvent(
		    // public eventName:string
		    this.myEventService.ON_MOUSEENTER_KLASS_CALENDAR_DATE,
		    // public title:string
		    "mini-calendar",
		    // public key:string
		    "date",
		    // public value:string
		    date.date,
		    // public metaObj:any
		    date
		);

		this.emitter.emit(myEvent);
	}
}