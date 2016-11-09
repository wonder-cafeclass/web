import { Component, OnInit, Input }   from '@angular/core';
import { ImageService }               from '../../util/image.service';
import { ClockTime }                  from './model/clock-time';

@Component({
  moduleId: module.id,
  selector: 'simple-clock',
  templateUrl: 'clock.component.html',
  styleUrls: [ 'clock.component.css' ]
})
export class ClockComponent implements OnInit {

  @Input() clockTimeBegin:ClockTime;
  @Input() clockTimeEnd:ClockTime;
  @Input() clockHeight:number=80;

  private clock1hr00m00mUrl:string;
  private clock1hr00m30mUrl:string;
  private clock1hr30m00mUrl:string;
  private clock1hr30m30mUrl:string;
  private clock1hrNoticeAMUrl:string;
  private clock1hrNoticePMUrl:string;
  private clock1hr30mNoticeAMUrl:string;
  private clock1hr30mNoticePMUrl:string;

  private clock2hr00m00mUrl:string;
  private clock2hr00m30mUrl:string;
  private clock2hr30m00mUrl:string;
  private clock2hr30m30mUrl:string;
  private clock2hrNoticeAMUrl:string;
  private clock2hrNoticePMUrl:string;
  private clock2hr30mNoticeAMUrl:string;
  private clock2hr30mNoticePMUrl:string;

  private clock3hr00m00mUrl:string;
  private clock3hr00m30mUrl:string;
  private clock3hr30m00mUrl:string;
  private clock3hr30m30mUrl:string;
  private clock3hrNoticeAMUrl:string;
  private clock3hrNoticePMUrl:string;
  private clock3hr30mNoticeAMUrl:string;
  private clock3hr30mNoticePMUrl:string;

  clockBGUrl:string;

  clockHoursUrl:string;
  clockNoticeUrl:string;

  rotate:number;

  constructor(
    public imageService: ImageService
  ) {}

  ngOnInit(): void {

    // Do something
    this.clock1hr00m00mUrl = this.imageService.get(this.imageService.clock1hr00m00mUrl);
    this.clock1hr00m30mUrl = this.imageService.get(this.imageService.clock1hr00m30mUrl);
    this.clock1hr30m00mUrl = this.imageService.get(this.imageService.clock1hr30m00mUrl);
    this.clock1hr30m30mUrl = this.imageService.get(this.imageService.clock1hr30m30mUrl);
    this.clock1hrNoticeAMUrl = this.imageService.get(this.imageService.clock1hrNoticeAMUrl);
    this.clock1hrNoticePMUrl = this.imageService.get(this.imageService.clock1hrNoticePMUrl);
    this.clock1hr30mNoticeAMUrl = this.imageService.get(this.imageService.clock1hr30mNoticeAMUrl);
    this.clock1hr30mNoticePMUrl = this.imageService.get(this.imageService.clock1hr30mNoticePMUrl);

    this.clock2hr00m00mUrl = this.imageService.get(this.imageService.clock2hr00m00mUrl);
    this.clock2hr00m30mUrl = this.imageService.get(this.imageService.clock2hr00m30mUrl);
    this.clock2hr30m00mUrl = this.imageService.get(this.imageService.clock2hr30m00mUrl);
    this.clock2hr30m30mUrl = this.imageService.get(this.imageService.clock2hr30m30mUrl);
    this.clock2hrNoticeAMUrl = this.imageService.get(this.imageService.clock2hrNoticeAMUrl);
    this.clock2hrNoticePMUrl = this.imageService.get(this.imageService.clock2hrNoticePMUrl);
    this.clock2hr30mNoticeAMUrl = this.imageService.get(this.imageService.clock2hr30mNoticeAMUrl);
    this.clock2hr30mNoticePMUrl = this.imageService.get(this.imageService.clock2hr30mNoticePMUrl);

    this.clock3hr00m00mUrl = this.imageService.get(this.imageService.clock3hr00m00mUrl);
    this.clock3hr00m30mUrl = this.imageService.get(this.imageService.clock3hr00m30mUrl);
    this.clock3hr30m00mUrl = this.imageService.get(this.imageService.clock3hr30m00mUrl);
    this.clock3hr30m30mUrl = this.imageService.get(this.imageService.clock3hr30m30mUrl);
    this.clock3hrNoticeAMUrl = this.imageService.get(this.imageService.clock3hrNoticeAMUrl);
    this.clock3hrNoticePMUrl = this.imageService.get(this.imageService.clock3hrNoticePMUrl);
    this.clock3hr30mNoticeAMUrl = this.imageService.get(this.imageService.clock3hr30mNoticeAMUrl);
    this.clock3hr30mNoticePMUrl = this.imageService.get(this.imageService.clock3hr30mNoticePMUrl);

    this.clockBGUrl = this.imageService.get(this.imageService.clockBGUrl);

    this.show(this.clockTimeBegin, this.clockTimeEnd);
  }

  show(clockTimeBegin:ClockTime, clockTimeEnd:ClockTime) :void {

    if(null === clockTimeBegin) {
      return;
    }

    if(null === clockTimeEnd) {
      return;
    }

    let diffMinutes = clockTimeEnd.totalMinutes - clockTimeBegin.totalMinutes;
    if(0 < (diffMinutes%10)) {
      console.log("Error / 10분 단위로 파라미터가 변경되어야 합니다.");
      return;
    }
    let diffHours = Math.floor(diffMinutes/60);

    if(!(1 <= diffHours) || !(diffHours <= 3)) {
      console.log("Error / 최소 시간 범위는 1시간, 최대 시간 범위는 3시간입니다. / diffHours : ",diffHours);
      return;
    }

    // 시작 시간으로부터 15분 미만까지는 동일 시간으로 표현합니다.
    if(1 === diffHours) {

      if(60 === diffMinutes) {
        if(0 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 15) {
          this.clockHoursUrl = this.clock1hr00m00mUrl;  
        } else if(30 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 45) {
          this.clockHoursUrl = this.clock1hr00m30mUrl;
        }
      } else if(90 === diffMinutes) {
        if(0 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 15) {
          this.clockHoursUrl = this.clock1hr30m00mUrl;  
        } else if(30 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 45) {
          this.clockHoursUrl = this.clock1hr30m30mUrl;
        }
      }

      if(60 === diffMinutes) {
        // 1 hour 00 minutes / ex) 13:30 ~ 14:30
        if(clockTimeBegin.isAM) {
          this.clockNoticeUrl = this.clock1hrNoticeAMUrl;
        } else {
          this.clockNoticeUrl = this.clock1hrNoticePMUrl;
        }
      } else if(90 === diffMinutes) {
        // 1 hour 30 minutes / ex) 13:30 ~ 15:00
        if(clockTimeBegin.isAM) {
          this.clockNoticeUrl = this.clock1hr30mNoticeAMUrl;
        } else {
          this.clockNoticeUrl = this.clock1hr30mNoticePMUrl;
        }
      }

    } else if(2 === diffHours) {

      if(120 === diffMinutes) {
        if(0 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 15) {
          this.clockHoursUrl = this.clock2hr00m00mUrl;  
        } else if(30 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 45) {
          this.clockHoursUrl = this.clock2hr00m30mUrl;
        }
      } else if(150 === diffMinutes) {
        if(0 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 15) {
          this.clockHoursUrl = this.clock2hr30m00mUrl;  
        } else if(30 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 45) {
          this.clockHoursUrl = this.clock2hr30m30mUrl;
        }
      }

      if(120 === diffMinutes) {
        // 2 hour 00 minutes / ex) 13:30 ~ 15:30
        if(clockTimeBegin.isAM) {
          this.clockNoticeUrl = this.clock2hrNoticeAMUrl;
        } else {
          this.clockNoticeUrl = this.clock2hrNoticePMUrl;
        }
      } else if(150 === diffMinutes) {
        // 2 hour 30 minutes / ex) 13:30 ~ 16:00
        if(clockTimeBegin.isAM) {
          this.clockNoticeUrl = this.clock2hr30mNoticeAMUrl;
        } else {
          this.clockNoticeUrl = this.clock2hr30mNoticePMUrl;
        }
      }

    } else if(3 === diffHours) {

      if(180 === diffMinutes) {
        if(0 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 15) {
          this.clockHoursUrl = this.clock3hr00m00mUrl;  
        } else if(30 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 45) {
          this.clockHoursUrl = this.clock3hr00m30mUrl;
        }
      } else if(210 === diffMinutes) {
        if(0 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 15) {
          this.clockHoursUrl = this.clock3hr30m00mUrl;  
        } else if(30 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 45) {
          this.clockHoursUrl = this.clock3hr30m30mUrl;
        }
      }      
      
      if(180 === diffMinutes) {
        // 3 hour 00 minutes / ex) 13:30 ~ 16:30
        if(clockTimeBegin.isAM) {
          this.clockNoticeUrl = this.clock3hrNoticeAMUrl;
        } else {
          this.clockNoticeUrl = this.clock3hrNoticePMUrl;
        }
      } else if(210 === diffMinutes) {
        // 3 hour 30 minutes / ex) 13:30 ~ 17:00
        if(clockTimeBegin.isAM) {
          this.clockNoticeUrl = this.clock3hr30mNoticeAMUrl;
        } else {
          this.clockNoticeUrl = this.clock3hr30mNoticePMUrl;
        }
      }

    }

    if(null == this.clockHoursUrl) {
      console.log("!Error! / null == this.clockHoursUrl");
    }
    if(null == this.clockNoticeUrl) {
      console.log("!Error! / null == this.clockNoticeUrl");
    }

    this.rotate = clockTimeBegin.hoursForRotate * 30;
  }

  private test() :void {

    // 1 hour

    // this.show("00:00", "01:00");
    // this.show("01:00", "02:00");
    // this.show("02:00", "03:00");
    // this.show("03:00", "04:00");
    // this.show("04:00", "05:00");
    // this.show("05:00", "06:00");
    // this.show("06:00", "07:00");
    // this.show("07:00", "08:00");
    // this.show("08:00", "09:00");
    // this.show("09:00", "10:00");
    // this.show("10:00", "11:00");
    // this.show("11:00", "12:00");
    // this.show("12:00", "13:00");
    // this.show("13:00", "14:00");
    // this.show("14:00", "15:00");
    // this.show("15:00", "16:00");
    // this.show("16:00", "17:00");
    // this.show("17:00", "18:00");
    // this.show("18:00", "19:00");
    // this.show("19:00", "20:00");
    // this.show("20:00", "21:00");
    // this.show("21:00", "22:00");
    // this.show("22:00", "23:00");
    // this.show("23:00", "24:00");

    // this.show("00:30", "01:30");
    // this.show("01:30", "02:30");
    // this.show("02:30", "03:30");
    // this.show("03:30", "04:30");
    // this.show("04:30", "05:30");
    // this.show("05:30", "06:30");
    // this.show("06:30", "07:30");
    // this.show("07:30", "08:30");
    // this.show("08:30", "09:30");
    // this.show("09:30", "10:30");
    // this.show("10:30", "11:30");
    // this.show("11:30", "12:30");
    // this.show("12:30", "13:30");
    // this.show("13:30", "14:30");
    // this.show("14:30", "15:30");
    // this.show("15:30", "16:30");
    // this.show("16:30", "17:30");
    // this.show("17:30", "18:30");
    // this.show("18:30", "19:30");
    // this.show("19:30", "20:30");
    // this.show("20:30", "21:30");
    // this.show("21:30", "22:30");
    // this.show("22:30", "23:30");
    // this.show("23:30", "24:30");

    // 2 hours

    // this.show("00:00", "02:00");
    // this.show("01:00", "03:00");
    // this.show("02:00", "04:00");
    // this.show("03:00", "05:00");
    // this.show("04:00", "06:00");
    // this.show("05:00", "07:00");
    // this.show("06:00", "08:00");
    // this.show("07:00", "09:00");
    // this.show("08:00", "10:00");
    // this.show("09:00", "11:00");
    // this.show("10:00", "12:00");
    // this.show("11:00", "13:00");
    // this.show("12:00", "14:00");
    // this.show("13:00", "15:00");
    // this.show("14:00", "16:00");
    // this.show("15:00", "17:00");
    // this.show("16:00", "18:00");
    // this.show("17:00", "19:00");
    // this.show("18:00", "20:00");
    // this.show("19:00", "21:00");
    // this.show("20:00", "22:00");
    // this.show("21:00", "23:00");
    // this.show("22:00", "24:00");
    // this.show("23:00", "25:00");

    // this.show("00:30", "02:30");
    // this.show("01:30", "03:30");
    // this.show("02:30", "04:30");
    // this.show("03:30", "05:30");
    // this.show("04:30", "06:30");
    // this.show("05:30", "07:30");
    // this.show("06:30", "08:30");
    // this.show("07:30", "09:30");
    // this.show("08:30", "10:30");
    // this.show("09:30", "11:30");
    // this.show("10:30", "12:30");
    // this.show("11:30", "13:30");
    // this.show("12:30", "14:30");
    // this.show("13:30", "15:30");
    // this.show("14:30", "16:30");
    // this.show("15:30", "17:30");
    // this.show("16:30", "18:30");
    // this.show("17:30", "19:30");
    // this.show("18:30", "20:30");
    // this.show("19:30", "21:30");
    // this.show("20:30", "22:30");
    // this.show("21:30", "23:30");
    // this.show("22:30", "24:30");
    // this.show("23:30", "25:30");    

    // 3 hours

    // this.show("00:00", "03:00");
    // this.show("01:00", "04:00");
    // this.show("02:00", "05:00");
    // this.show("03:00", "06:00");
    // this.show("04:00", "07:00");
    // this.show("05:00", "08:00");
    // this.show("06:00", "09:00");
    // this.show("07:00", "10:00");
    // this.show("08:00", "11:00");
    // this.show("09:00", "12:00");
    // this.show("10:00", "13:00");
    // this.show("11:00", "14:00");
    // this.show("12:00", "15:00");
    // this.show("13:00", "16:00");
    // this.show("14:00", "17:00");
    // this.show("15:00", "18:00");
    // this.show("16:00", "19:00");
    // this.show("17:00", "20:00");
    // this.show("18:00", "21:00");
    // this.show("19:00", "22:00");
    // this.show("20:00", "23:00");
    // this.show("21:00", "24:00");
    // this.show("22:00", "25:00");
    // this.show("23:00", "26:00");

    // this.show("00:30", "03:30");
    // this.show("01:30", "04:30");
    // this.show("02:30", "05:30");
    // this.show("03:30", "06:30");
    // this.show("04:30", "07:30");
    // this.show("05:30", "08:30");
    // this.show("06:30", "09:30");
    // this.show("07:30", "10:30");
    // this.show("08:30", "11:30");
    // this.show("09:30", "12:30");
    // this.show("10:30", "13:30");
    // this.show("11:30", "14:30");
    // this.show("12:30", "15:30");
    // this.show("13:30", "16:30");
    // this.show("14:30", "17:30");
    // this.show("15:30", "18:30");
    // this.show("16:30", "19:30");
    // this.show("17:30", "20:30");
    // this.show("18:30", "21:30");
    // this.show("19:30", "22:30");
    // this.show("20:30", "23:30");
    // this.show("21:30", "24:30");
    // this.show("22:30", "25:30");
    // this.show("23:30", "26:30");    

  }
}