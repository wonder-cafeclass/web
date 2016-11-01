import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                     from '@angular/core';
import { CheckboxOption }            from './model/checkbox-option';
import { MyEvent }                   from '../../util/model/my-event';

@Component({
  moduleId: module.id,
  selector: 'checkbox-linear',
  templateUrl: 'checkbox-linear.component.html',
  styleUrls: [ 'checkbox-linear.component.css' ]
})
export class CheckboxLinearComponent implements OnInit {

  @Input() optionList:CheckboxOption[];
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