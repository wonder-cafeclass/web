import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                    from '@angular/core';
import { RadioBtnOption }           from './model/radiobtn-option';
import { MyEvent }                  from '../../util/model/my-event';

/*
*
*	@ Desc : input view 컴포넌트들을 가로로 길게 보여주는 컨테이너 리스트
*	@ Author : Wonder Jung
*/

@Component({
  moduleId: module.id,
  selector: 'radiobtn-h-list',
  templateUrl: 'radiobtn-h-list.component.html',
  styleUrls: [ 'radiobtn-h-list.component.css' ]
})
export class RadioBtnHListComponent implements OnInit {

  @Input() optionList:RadioBtnOption[];
  @Input() listTitle:string;
  @Input() listId:string;
  @Input() listTitleFontSize:number;
  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  @Input() topLeftImageUrl:string;
  
  @Output() emitter = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    this.listId = "dummy_" + (Math.round(Math.random() * 10000000) + (this.listTitle.length * this.listTitleFontSize));

    console.log("optionList : ",this.optionList);
  }

  onChange(event, myEvent:MyEvent) :void{
    event.stopPropagation();
    this.emitter.emit(myEvent);
  }

}