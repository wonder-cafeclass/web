import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                    from '@angular/core';
import { CheckBoxOption }           from './model/checkbox-option';
import { MyEvent }                  from '../../util/model/my-event';

/*
*
*	@ Desc : input view 컴포넌트들을 가로로 길게 보여주는 컨테이너 리스트
*	@ Author : Wonder Jung
*/

@Component({
  moduleId: module.id,
  selector: 'checkbox-h-list',
  templateUrl: 'checkbox-h-list.component.html',
  styleUrls: [ 'checkbox-h-list.component.css' ]
})
export class CheckBoxHListComponent implements OnInit {

  @Input() optionList:CheckBoxOption[];
  @Input() listTitle:string;
  @Input() listTitleFontSize:number;
  @Input() cageWidth:number=-1;
  cageWidthStr:string="";
  @Input() topLeftImageUrl:string;
  
  @Output() emitter = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }
  }

  onChange(event, myEvent:MyEvent) :void{
    event.stopPropagation();
    this.emitter.emit(myEvent);
  }

}