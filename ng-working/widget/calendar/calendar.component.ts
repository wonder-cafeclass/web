import { Component, OnInit, Input }   from '@angular/core';
import { ImageService }               from '../../util/image.service';
import { Calendar }                   from './model/calendar';

@Component({
  moduleId: module.id,
  selector: 'simple-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: [ 'calendar.component.css' ]
})
export class CalendarComponent implements OnInit {

	@Input() calendarTable:Calendar[][];
	@Input() dayBegin:string;
	@Input() dateBegin:string;
	@Input() weekMin:number;
	@Input() weekMax:number;
	@Input() calWidth:number=150;
	monthBegin:string;

	ngOnInit(): void {
		// Do nothing.
	}
}