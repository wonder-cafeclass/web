import {  Component, 
          Input, 
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';

import { MyBirthdayService }    from "../../../util/service/my-birthday.service";

@Component({
  moduleId: module.id,
  selector: 'birthday',
  templateUrl: 'birthday.component.html',
  styleUrls: [ 'birthday.component.css' ]
})
export class BirthdayComponent implements OnInit {

  @Input() top:number=-1;
  @Input() left:number=-1;

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  birthYearArr:number[];
  selectedYear:number=-1;
  birthMonthArr:number[];
  selectedMonth:number=-1;
  birthDayArr:number[];
  selectedDay:number=-1;  

  constructor(private myBirthdayService: MyBirthdayService) {}

  ngOnInit(): void {

    this.birthYearArr = this.myBirthdayService.getYear();
    this.selectedYear = this.birthYearArr[Math.round(this.birthYearArr.length*2/3)];
    this.birthMonthArr = this.myBirthdayService.getMonth();
    this.selectedMonth = this.birthMonthArr[Math.round(this.birthMonthArr.length/2)];
    this.birthDayArr = this.myBirthdayService.getDay(this.selectedMonth);
    this.selectedDay = this.birthDayArr[Math.round(this.birthDayArr.length/2)];
    
  }

  onClick(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if
  }

  onBlur(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocus) {
      this.isFocus = false;
    } // end if
  }  

  onMouseOverInfo(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusInfo) {
      this.isFocusInfo = true;      
    } // end if
  }

  onMouseOutInfo(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusInfo) {
      this.isFocusInfo = false;
    } // end if
  }

  onChangeBirthYear(selectBirthYear) :void {
    this.selectedYear = selectBirthYear;
  }

  onChangeBirthMonth(selectBirthMonth) :void {
    this.selectedMonth = selectBirthMonth;

    // 월이 바뀌었습니다. 월별 날짜도 연동되어 바꿉니다.
    this.birthDayArr = this.myBirthdayService.getDay(this.selectedMonth);
    this.selectedDay = this.birthDayArr[Math.round(this.birthDayArr.length/2)];    
  }  

  onChangeBirthDay(selectBirthDay) :void {
    this.selectedDay = selectBirthDay;
  }  

}
