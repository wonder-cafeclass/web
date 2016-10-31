import { Component, OnInit, Input }    from '@angular/core';
import { CheckboxLinearComponent }     from './../checkbox/checkbox-linear.component';
import { CheckboxOption }              from './../checkbox/model/checkbox-option';
import { InputViewUpdown }              from './model/input-view-updown';

@Component({
  moduleId: module.id,
  selector: 'input-view',
  templateUrl: 'input-view.component.html',
  styleUrls: [ 'input-view.component.css' ]
})
export class InputViewComponent implements OnInit {

  @Input() titleImageUrl:string="";
  @Input() title:number=-1;
  @Input() titleWidth:number=150;

  // 사용자가 선택할 수 있는 서브 컴포넌트들.
  @Input() checkboxOptionList:CheckboxOption[];  
  @Input() updownList:InputViewUpdown[];  

  constructor() {}

  ngOnInit(): void {
    // Do nothing.
  }

}