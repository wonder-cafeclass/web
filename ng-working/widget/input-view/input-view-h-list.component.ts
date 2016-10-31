import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                   from '@angular/core';
import { InputViewUpdown }         from './model/input-view-updown';

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

  onChangedFromChild(data) :void{

    console.log("InputViewHListComponent / onChangedFromChild / data : ",data);

    this.emitter.emit(data);
  }

}