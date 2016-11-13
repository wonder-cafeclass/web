import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                       from '@angular/core';

import { MyEventService }              from '../../util/my-event.service';
import { MyEvent }                     from '../../util/model/my-event';
import { KlassTeacher }                from '../model/klass-teacher';
import { CheckBoxOption }              from '../../widget/checkbox/model/checkbox-option';

@Component({
  moduleId: module.id,
  selector: 'klass-teacher',
  templateUrl: 'klass-teacher.component.html',
  styleUrls: [ 'klass-teacher.component.css' ]
})
export class KlassTeacherComponent implements OnInit {

  @Input() isAdmin:Boolean;
  @Input() key:string;
  @Input() myEvent:MyEvent;

  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  @Input() cageHeight:number=-1;
  cageHeightStr:string;

  myEventCallback:MyEvent;
  @Input() klassTeacher:KlassTeacher;

  // 이벤트를 부모에게 전달
  @Output() emitter = new EventEmitter<any>(); 

  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor( private myEventService:MyEventService ) {}

  ngOnInit(): void {

    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    if(0 < this.cageHeight) {
      this.cageHeightStr=`${this.cageHeight}px`;
    } else {
      this.cageHeightStr="100%";
    }

    console.log("klass-teacher / this.klassTeacher : ", this.klassTeacher);

  }

}