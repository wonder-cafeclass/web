import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                    from '@angular/core';
import { InputViewUpdown } 			    from './model/input-view-updown';
import { MyEvent }                  from '../../util/model/my-event';

@Component({
  moduleId: module.id,
  selector: 'input-view-updown',
  templateUrl: 'input-view-updown.component.html',
  styleUrls: [ 'input-view-updown.component.css' ]
})
export class InputViewUpdownComponent implements OnInit {

  @Input() data:InputViewUpdown;
  @Input() topLeftImageUrl:string;
  @Input() cageWidth:number=-1;
  cageWidthStr:string;

  @Output() emitter = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    console.log("this.data : ",this.data);
  }

  onChange(event, value:string, myEvent:MyEvent) :void {
    event.stopPropagation();

    myEvent.valueNext = value;

    this.emitter.emit(myEvent);
  }

}