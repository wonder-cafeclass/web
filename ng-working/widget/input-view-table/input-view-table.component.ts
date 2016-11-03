import { Component, OnInit, Input }   from '@angular/core';
import { CheckBoxOption } from '../checkbox/model/checkbox-option';

@Component({
  moduleId: module.id,
  selector: 'input-view-table',
  templateUrl: 'input-view-table.component.html',
  styleUrls: [ 'input-view-table.component.css' ]
})
export class InputViewTableComponent implements OnInit {

  @Input() tableTitle:string;
  @Input() fontSizeTitle:number=12;
  @Input() paddingTopTitle:number=10;
  @Input() cageWidth:number=150;
  @Input() topLeftImageUrl:string;
  @Input() color:string;

  @Input() chekcboxOptionList:CheckBoxOption[];

  constructor() {}

  ngOnInit(): void {
    // Do something...
  }

}