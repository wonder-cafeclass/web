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
	@Input() calWidth:number=150;
	calWidthMin:number=150;
	monthBegin:number;

	ngOnInit(): void {
		// set column width
		if(this.calWidth < this.calWidthMin) {
			this.calWidth = this.calWidthMin;
		}

		for (var i = 0; i < this.calendarTable.length; ++i) {
			let row = this.calendarTable[i];
			for (var j = 0; j < row.length; ++j) {
				let ct:Calendar = row[j];

				if(null != ct && (0 < ct.month)){
					this.monthBegin = +ct.month;
					break;
				}
			}
		}



	}
}