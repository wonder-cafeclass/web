import { Component, OnInit, Input }    from '@angular/core';
import { InputViewUpdown } from './model/input-view-updown';

@Component({
  moduleId: module.id,
  selector: 'input-view-updown',
  templateUrl: 'input-view-updown.component.html',
  styleUrls: [ 'input-view-updown.component.css' ]
})
export class InputViewUpdownComponent implements OnInit {

  @Input() data:InputViewUpdown;

  constructor() {}

  ngOnInit(): void {
    // Do nothing.
  }

}