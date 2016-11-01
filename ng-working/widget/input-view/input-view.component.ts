import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                       from '@angular/core';
import { CheckboxLinearComponent }     from './../checkbox/checkbox-linear.component';
import { CheckboxOption }              from './../checkbox/model/checkbox-option';
import { InputViewUpdown }             from './model/input-view-updown';
import { MyEvent }                     from '../../util/model/my-event';

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

  // 이벤트를 부모에게 전달
  @Output() emitter = new EventEmitter<any>(); 

  // 자신의 자식 객체에서 이벤트를 받는다.

  constructor() {}

  ngOnInit(): void {
    // Do nothing.
  }

  onChangedFromChild(myEvent:MyEvent) :void{
    console.log("InputViewComponent / onChangedFromChild / myEvent : ",myEvent);
    this.emitter.emit(myEvent);
  }
}