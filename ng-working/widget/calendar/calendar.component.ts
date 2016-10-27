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
	monthBegin:string;
	@Input() dayBegin:string;
	@Input() dateBegin:string;
	@Input() weekMin:number;
	@Input() weekMax:number;
	@Input() calWidth:number=150;

	ngOnInit(): void {
		// Do something
		console.log("XX / dayBegin : ",this.dayBegin);

		if(null != this.calendarTable && 0 < this.calendarTable.length){
			for (var i = 0; i < this.calendarTable.length; ++i) {
				let row = this.calendarTable[i];
				for (var j = 0; j < row.length; ++j) {
					let field:Calendar = row[j];

					if(null != field) {
						this.monthBegin = field.month;
						break;
					}
				}
			}
		}

		
	}
}