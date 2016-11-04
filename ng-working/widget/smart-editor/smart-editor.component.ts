import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                    from '@angular/core';
import { MyEvent }                  from '../../util/model/my-event';
import { MyAssetService }           from '../../util/my-asset.service';

/*
*
*	@ Desc     : Naver smart editor를 사용하도록 도와주는 컴포넌트.
* @ Version  : 2.3.10
*	@ Author   : Wonder Jung
*/

@Component({
  moduleId: module.id,
  selector: 'smart-editor',
  templateUrl: 'smart-editor.component.html',
  styleUrls: [ 'smart-editor.component.css' ]
})
export class SmartEditorComponent implements OnInit {

  @Input() title:string;
  @Input() titleFontSize:number;
  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  @Input() topLeftImageUrl:string;
  
  @Output() emitter = new EventEmitter<any>();

  innerUrl:string;

  constructor(public myAssetService:MyAssetService) {}

  ngOnInit(): void {
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    this.innerUrl = this.myAssetService.getInner(this.myAssetService.smartEditor);
    

    console.log("innerUrl : ",this.innerUrl);
  }

  onChange(event, myEvent:MyEvent) :void{
    event.stopPropagation();
    this.emitter.emit(myEvent);
  }

}