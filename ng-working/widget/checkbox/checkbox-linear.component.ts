import { Component, OnInit, Input }   from '@angular/core';
import { CheckboxOption }             from './model/checkbox-option';

@Component({
  moduleId: module.id,
  selector: 'checkbox-linear',
  templateUrl: 'checkbox-linear.component.html',
  styleUrls: [ 'checkbox-linear.component.css' ]
})
export class CheckboxLinearComponent implements OnInit {

  @Input() optionList:CheckboxOption[];

  constructor() {}

  ngOnInit(): void {
    // Do nothing.
  }

  // TODO - even dispatch!

}