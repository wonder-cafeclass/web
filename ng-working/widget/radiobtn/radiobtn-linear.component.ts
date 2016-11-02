import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                     from '@angular/core';
import { RadioBtnOption }            from './model/radiobtn-option';
import { MyEvent }                   from '../../util/model/my-event';

@Component({
  moduleId: module.id,
  selector: 'radiobtn-linear',
  templateUrl: 'radiobtn-linear.component.html',
  styleUrls: [ 'radiobtn-linear.component.css' ]
})
export class RadioBtnLinearComponent implements OnInit {

  @Input() optionList:RadioBtnOption[];
  @Output() emitter = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    // Do nothing.
  }

  // TODO - even dispatch!
  onChange(event, myEvent:MyEvent) :void {

    event.stopPropagation();
    this.emitter.emit(myEvent);

  }

}