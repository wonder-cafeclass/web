import {  Component, 
          OnInit, 
          OnChanges,
          SimpleChanges,
          ViewChild,
          EventEmitter,
          Output,
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
import { MyEvent }                     from '../../util/model/my-event';

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
export class DronListComponent implements OnInit, OnChanges {

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

  @ViewChild(SmartEditorComponent)
  private smartEditorComponent: SmartEditorComponent;

  @Input() checkBoxHListComponent:CheckBoxHListComponent;
  @Input() miniCalendarComponent:MiniCalendarComponent;
  @Input() inputViewHListComponent:InputViewHListComponent;
  @Input() inputViewUpdownComponent:InputViewUpdownComponent;
  @Input() radioBtnHListComponent:RadioBtnHListComponent;
  @Input() radioBtnLinearComponent:RadioBtnLinearComponent;

  // smart-editor params
  @Input() SEinnerHTML:string;

  isDisabledSave:boolean=true;


  @Output() emitter = new EventEmitter<any>();

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
  ngOnChanges(changes: SimpleChanges) :void {
    console.log("ngOnChanges / changes : ",changes);

    if(null != changes) {
      if(null != changes['title']) {
        // 타이틀이 변경된 경우.
        // Do nothing...
      }
      if(  null != changes['SEinnerHTML'] && 
           null != changes['SEinnerHTML']['currentValue']) {
        // Smart Editor의 내용이 변경된 경우.
        let html = changes['SEinnerHTML']['currentValue'];

        if(null != this.smartEditorComponent) {
          this.smartEditorComponent.clearHTML();
          this.smartEditorComponent.updateHTML(html);
        } // end inner if
      } // end inner if 
    } // end outer if
  }

  onChangedFromChild(myEvent) :void {

    console.log(">>> onChangedFromChild / myEvent : ",myEvent);

    if(null == myEvent) {
      return;
    }

    if(this.myEventService.ON_READY_SMART_EDITOR === myEvent.eventName) {

      // 에디터가 준비되었습니다. 에디터의 높이를 구해서, 화면에 최대한 노출하도록 이동합니다.
      this.headerHeight = this.myRulerService.getHeight("dron-header");
      this.contentHeight = this.myRulerService.getHeight("dron-content");
      this.tailHeight = this.myRulerService.getHeight("dron-tail");
      this.offsetTop = -1 * (this.headerHeight + this.contentHeight + this.tailHeight - 4);

      // 에디터에 넣을 내용을 설정합니다.
      this.smartEditorComponent.updateHTML(this.SEinnerHTML);

    } else if(this.myEventService.ON_CHANGE_SMART_EDITOR === myEvent.eventName) {
      // 내용이 수정되었습니다.
      console.log(">>> 내용이 수정되었습니다.");
      this.isDisabledSave = false;

      // 부모 컴포넌트에게 MyEvent 객체 - 사용자가 수정창을 닫음 - 를 전달.
      let myEventReturn:MyEvent = 
      new MyEvent(
          // public eventName:string
          this.myEventService.ON_CHANGE_DRON_LIST,
          // public title:string
          "dron-list",
          // public key:string
          myEvent.key,
          // public value:string
          myEvent.value,
          // public metaObj:any
          null
      );

      this.emitter.emit(myEventReturn);

    }
  }

  dismiss() :void {

    let hasChanged:boolean = false;
    if(null !== this.smartEditorComponent) {
      hasChanged = this.smartEditorComponent.hasChanged();
    }

    // 사용자에게 변경된 사항이 있다면 저장할 것인지 물어봅니다.
    let wannaSave:boolean = false;
    if(hasChanged && confirm("변경된 사항이 있습니다. 저장하시겠습니까?")) {
      wannaSave = true;
    }

    let myEventReturn:MyEvent = null;
    if(wannaSave) {
      this.save();

      myEventReturn = 
      new MyEvent(
          // public eventName:string
          this.myEventService.ON_SHUTDOWN_DRON_LIST,
          // public title:string
          "dron-list",
          // public key:string
          this.key,
          // public value:string
          "",
          // public metaObj:any
          null
      );

    } else {
      // 저장하지 않습니다. 이전 값으로 돌려놓습니다.
      let HTMLPrev:string = this.smartEditorComponent.getHTMLPrev();

      myEventReturn = 
      new MyEvent(
          // public eventName:string
          this.myEventService.ON_SHUTDOWN_N_ROLLBACK_DRON_LIST,
          // public title:string
          "dron-list",
          // public key:string
          this.key,
          // public value:string
          HTMLPrev,
          // public metaObj:any
          null
      );
    }

    this.emitter.emit(myEventReturn);
  }

  onClickSave(event) :void {
    event.stopPropagation();
    event.preventDefault();
    this.save();
  }

  save() :void {

    if(this.isDisabledSave) {
      return;
    }

    let result = null;
    if(null !== this.smartEditorComponent) {
      result = this.smartEditorComponent.saveNReturn();
    }
    console.log(">>> save / result : ",result);

    // 부모 컴포넌트에게 MyEvent 객체를 전달, 사용자가 수정 및 입력을 완료했음을 알립니다.
    let myEventReturn:MyEvent = 
    new MyEvent(
        // public eventName:string
        this.myEventService.ON_SAVE_DRON_LIST,
        // public title:string
        "dron-list",
        // public key:string
        this.key,
        // public value:string
        result,
        // public metaObj:any
        null
    );

    this.emitter.emit(myEventReturn);      
  }
}