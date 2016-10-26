import { Component, OnInit, Input }   from '@angular/core';
import { ImageService }               from '../../util/image.service';

@Component({
  moduleId: module.id,
  selector: 'simple-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: [ 'calendar.component.css' ]
})
export class CalendarComponent implements OnInit {

	@Input() dateBegin:string;
	@Input() weekMin:number;
	@Input() weekMax:number;
	@Input() calWidth:number=150;

	ngOnInit(): void {

		// Do something
		console.log("TEST / CalendarComponent / dateBegin : ",this.dateBegin);
		console.log("TEST / CalendarComponent / weekMin : ",this.weekMin);
		console.log("TEST / CalendarComponent / weekMax : ",this.weekMax);
	}
}