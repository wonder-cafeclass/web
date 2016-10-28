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

		// TEST
		console.log("XXX / 1 / this.calendarTable : ",this.calendarTable);

		if(null != this.calendarTable && 0 < this.calendarTable.length){
			for (var i = 0; i < this.calendarTable.length; ++i) {
				
				let row = this.calendarTable[i];

				// "월"을 나타내기위한 element를 각 열의 제일 앞에 추가한다.
				let firstEle:Calendar = row[0];
				let lastEle:Calendar = row[(row.length - 1)];

				let month = -1;
				if(null != firstEle) {
					month = +firstEle.month;
				} else if(null != lastEle) {
					month = +lastEle.month;
				}

				if(!(-1 < month)) {
					// error report!
					console.log("!Error! / CalendarComponent / !(-1 < month)");
					return;
				}

				let calForMonth = new Calendar();
				calForMonth.month = month;

				row.unshift(calForMonth);

				for (var j = 0; j < row.length; ++j) {
					let field:Calendar = row[j];

					if(null != field && null == this.monthBegin) {
						this.monthBegin = field.month;
					} // end inner if
				} // end inner for
			} //end outer for
		} // end if

		// TEST
		console.log("XXX / 2 / this.calendarTable : ",this.calendarTable);

	}
}