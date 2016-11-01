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
  @Output() emitter = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    // Do nothing.
  }

  onChange(event, value:string, myEvent:MyEvent) :void {
    event.stopPropagation();

    myEvent.valueNext = value;

    this.emitter.emit(myEvent);
  }

}