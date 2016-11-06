import {  Component, 
          OnInit, 
          Input }                       from '@angular/core';
import { SmartEditorComponent }        from '../smart-editor/smart-editor.component';
import { CheckBoxHListComponent }      from '../checkbox/checkbox-h-list.component';
import { MiniCalendarComponent }       from '../calendar/mini-calendar.component';
import { InputViewHListComponent }     from '../input-view/input-view-h-list.component';
import { InputViewUpdownComponent }    from '../input-view/input-view-updown.component';
import { RadioBtnHListComponent }      from '../radiobtn/radiobtn-h-list.component';
import { RadioBtnLinearComponent }     from '../radiobtn/radiobtn-linear.component';

import { KlassColorService }           from '../../klass/service/klass-color.service';
import { MyRulerService }              from '../../util/service/my-ruler.service';
import { MyEventService }              from '../../util/my-event.service';

/*
* @ Desc   : 외부의 호출로 현재 필요한 1개의 Editor만 노출해줍니다. 화면의 상단/하단/우측/좌측으로 노출됩니다. (추후구현)사용자의 드래깅으로 창의 위치 이동이 가능합니다.
* @ Author : Wonder Jung
*/

@Component({
  moduleId: module.id,
  selector: 'dron-list',
  templateUrl: 'dron-list.component.html',
  styleUrls: [ 'dron-list.component.css' ]
})
export class DronListComponent implements OnInit {

  @Input() key:string="";
  @Input() title:string="";
  @Input() cageWidth:number=-1;
  @Input() cageHeight:number=-1;
  headerHeight:number=-1;
  contentHeight:number=-1;
  tailHeight:number=-1;
  offsetTop:number=10;

  @Input() color:string="";
  @Input() textColor:string="";
  @Input() bgColor:string="";

  @Input() topLeftImgUrl:string;

  @Input() isTopLeft:boolean=false;
  @Input() isTopRight:boolean=false;
  @Input() isBottomLeft:boolean=false;
  @Input() isBottomRight:boolean=true;

  // @ Deprecated
  @Input() smartEditorComponent:SmartEditorComponent;
  @Input() checkBoxHListComponent:CheckBoxHListComponent;
  @Input() miniCalendarComponent:MiniCalendarComponent;
  @Input() inputViewHListComponent:InputViewHListComponent;
  @Input() inputViewUpdownComponent:InputViewUpdownComponent;
  @Input() radioBtnHListComponent:RadioBtnHListComponent;
  @Input() radioBtnLinearComponent:RadioBtnLinearComponent;

  // smart-editor params
  @Input() SEinnerHTML:string;  


  constructor(  private klassColorService:KlassColorService, 
                private myEventService:MyEventService,
                private myRulerService:MyRulerService) {}

  ngOnInit(): void {
    // Do something...
    if("" === this.color) {
      this.color = this.klassColorService.orange;
    }
    if("" === this.textColor) {
      this.textColor = this.klassColorService.white;
    }
    if("" === this.bgColor) {
      this.bgColor = this.klassColorService.orange;
    }
    //bgColorBottom
    if("" === this.title) {
      this.title = "No title";
    }
  }

  onChangedFromChild(myEvent) :void {

    if(null == myEvent) {
      return;
    }

    if(this.myEventService.ON_READY_SMART_EDITOR === myEvent.eventName) {

      // 에디터가 준비되었습니다. 에디터의 높이를 구해서, 화면에 최대한 노출하도록 이동합니다.
      this.headerHeight = this.myRulerService.getHeight("dron-header");
      this.contentHeight = this.myRulerService.getHeight("dron-content");
      this.tailHeight = this.myRulerService.getHeight("dron-tail");
      // this.offsetTop = -1 * (this.headerHeight + this.contentHeight + this.tailHeight - 8);
      this.offsetTop = -1 * (this.headerHeight + this.contentHeight + this.tailHeight - 4);
    }
  }
}