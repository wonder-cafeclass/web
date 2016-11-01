import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                   from '@angular/core';
import { InputViewUpdown }         from './model/input-view-updown';
import { MyEvent }                  from '../../util/model/my-event';

/*
*
*	@ Desc : input view 컴포넌트들을 가로로 길게 보여주는 컨테이너 리스트
*	@ Author : Wonder Jung
*/

@Component({
  moduleId: module.id,
  selector: 'input-view-h-list',
  templateUrl: 'input-view-h-list.component.html',
  styleUrls: [ 'input-view-h-list.component.css' ]
})
export class InputViewHListComponent implements OnInit {

  @Input() updownList:InputViewUpdown[];
  @Input() cageWidth:number=100;
  @Output() emitter = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    // Do nothing.
  }

  onChangedFromChild(myEvent:MyEvent) :void{
    this.emitter.emit(myEvent);
  }

}