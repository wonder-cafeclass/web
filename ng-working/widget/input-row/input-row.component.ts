import {  Component, 
          OnInit,
          SimpleChanges,
          ViewChild,
          EventEmitter,
          Output,
          Input }                       from '@angular/core';
import { SmartEditorComponent }        from '../smart-editor/smart-editor.component';
import { SingleInputViewComponent }    from '../input-view/single-input-view.component';

import { KlassColorService }           from '../../widget/klass/service/klass-color.service';

import { MyRulerService }              from '../../util/service/my-ruler.service';
import { MyEventService }              from '../../util/service/my-event.service';
import { MyCheckerService }            from '../../util/service/my-checker.service';
import { MyEvent }                     from '../../util/model/my-event';
import { MyChecker }                   from '../../util/model/my-checker';

// import { CheckBoxHListComponent }      from '../checkbox/checkbox-h-list.component';
// import { MiniCalendarComponent }       from '../calendar/mini-calendar.component';
// import { InputViewHListComponent }     from '../input-view/input-view-h-list.component';
// import { InputViewUpdownComponent }    from '../input-view/input-view-updown.component';
// import { RadioBtnHListComponent }      from '../radiobtn/radiobtn-h-list.component';
// import { RadioBtnLinearComponent }     from '../radiobtn/radiobtn-linear.component';


/*
*
* @ Desc   : 
* 외부의 호출로 현재 필요한 1개의 Editor만 노출해줍니다.
* 화면의 상단/하단/우측/좌측으로 노출됩니다. (추후구현)사용자의 드래깅으로 창의 위치 이동이 가능합니다.
* 
* @ Author : Wonder Jung
*
*/

@Component({
  moduleId: module.id,
  selector: 'input-row',
  templateUrl: 'input-row.component.html',
  styleUrls: [ 'input-row.component.css' ]
})
export class InputRowComponent implements OnInit {

  @Input() key:string="";
  @Input() title:string="";
  @Input() cageWidth:number=-1;
  @Input() cageHeight:number=-1;
  headerHeight:number=-1;
  contentHeight:number=-1;
  tailHeight:number=-1;
  offsetTop:number=10;
  isPreview:boolean=false;

  @Input() color:string="";
  @Input() textColor:string="";
  @Input() bgColor:string="";

  @Input() topLeftImgUrl:string;

  @ViewChild(SmartEditorComponent)
  private smartEditorComponent: SmartEditorComponent;
  @ViewChild(SingleInputViewComponent)
  private singleInputViewComponent: SingleInputViewComponent;

  // @Input() checkBoxHListComponent:CheckBoxHListComponent;
  // @Input() miniCalendarComponent:MiniCalendarComponent;
  // @Input() inputViewHListComponent:InputViewHListComponent;
  // @Input() inputViewUpdownComponent:InputViewUpdownComponent;
  // @Input() radioBtnHListComponent:RadioBtnHListComponent;
  // @Input() radioBtnLinearComponent:RadioBtnLinearComponent;

  // smart-editor params
  @Input() SEinnerHTML:string;
  SEinnerHTMLCopy:string;
  @Input() myEventSingleInput:MyEvent;

  isDisabledSave:boolean=true;


  @Output() emitter = new EventEmitter<any>();

  constructor(  private klassColorService:KlassColorService, 
                private myEventService:MyEventService,
                private myCheckerService:MyCheckerService,
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
  }

  onChangedFromChild(myEvent) :void {

    if(null == myEvent) {
      return;
    }

    if(this.myEventService.ON_READY === myEvent.eventName) {

      if(this.myEventService.KEY_SMART_EDITOR === myEvent.key) {

        // 에디터가 준비되었습니다. 에디터의 높이를 구해서, 화면에 최대한 노출하도록 이동합니다.
        this.setOffset();
        // 에디터에 넣을 내용을 설정합니다.
        // this.smartEditorComponent.updateHTML(this.SEinnerHTML);

      } else if(this.myEventService.KEY_SINGLE_INPUT_VIEW === myEvent.key) {

        this.setOffset();

      }

    } else if(  this.myEventService.ON_CHANGE === myEvent.eventName ) {

      // 내용이 수정되었습니다.
      this.isDisabledSave = false;

      let hasChanged:boolean = false;
      if(this.myEventService.KEY_SMART_EDITOR === myEvent.key) {
        this.updateSEinnerHTML(myEvent.value);
        hasChanged = this.hasChangedSEinnerHTML();
      }

      if(hasChanged) {
        // 부모 컴포넌트에게 MyEvent 객체 - 사용자가 수정창을 닫음 - 를 전달.
        let myEventReturn:MyEvent = 
        this.myEventService.getMyEvent(
          // public eventName:string
          this.myEventService.ON_CHANGE,
          // public key:string
          this.key,
          // public value:string
          myEvent.value,
          // public metaObj:any
          null,
          // public myChecker:MyChecker
          this.myCheckerService.getFreePassChecker()
        );

        this.emitter.emit(myEventReturn);
      } // end if
    } // end if
  } // end if

  setOffset() :void {
    this.headerHeight = 42;
    this.contentHeight = this.myRulerService.getHeight("dron-content");
    this.tailHeight = 42;
    this.offsetTop = -1 * (this.headerHeight + this.contentHeight + this.tailHeight - 2);
  }

  dismiss(event) :void {

    event.stopPropagation();
    event.preventDefault();

    let hasChanged:boolean = false;
    if(null != this.smartEditorComponent) {
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
      this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_SHUTDOWN,
        // public key:string
        this.key,
        // public value:string
        this.SEinnerHTMLCopy,
        // public metaObj:any
        null,
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker()
      );

    } else {
      // 저장하지 않습니다. 이전 값으로 돌려놓습니다.
      if(null != this.smartEditorComponent) {
        let HTMLPrev:string = this.smartEditorComponent.getHTMLPrev();

        myEventReturn = 
        this.myEventService.getMyEvent(
          // public eventName:string
          this.myEventService.ON_SHUTDOWN_N_ROLLBACK,
          // public key:string
          this.key,
          // public value:string
          HTMLPrev,
          // public metaObj:any
          null,
          // public myChecker:MyChecker
          this.myCheckerService.getFreePassChecker()
        );        

      } else if(null != this.singleInputViewComponent) {

        let myEventFromSI = 
        this.singleInputViewComponent.getMyEvent();

        myEventReturn = 
        this.myEventService.getMyEvent(
          // public eventName:string
          this.myEventService.ON_SHUTDOWN_N_ROLLBACK,
          // public key:string
          this.key,
          // public value:string
          myEventFromSI.value,
          // public metaObj:any
          null,
          // public myChecker:MyChecker
          this.myCheckerService.getFreePassChecker()
        );

      }
    }

    this.emitter.emit(myEventReturn);
  }

  hasChangedSEinnerHTML() :boolean {

    if(this.SEinnerHTMLCopy != this.SEinnerHTML) {
      return true;
    }

    return false;
  }

  updateSEinnerHTML(newSEinnerHTML:string) :void {
    this.SEinnerHTML = newSEinnerHTML;
  }

  overwriteSEinnerHTML() :void{
    this.SEinnerHTMLCopy = this.SEinnerHTML;
  }

  onClickSave(event) :void {
    event.stopPropagation();
    event.preventDefault();
    this.save();
  }
  onClickUnpreview(event) :void {
    event.stopPropagation();
    event.preventDefault();    
    this.isPreview=false;

    let myEventReturn:MyEvent = 
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_UNPREVIEW,
      // public key:string
      this.key,
      // public value:string
      "",
      // public metaObj:any
      null,
      // public myChecker:MyChecker
      this.myCheckerService.getFreePassChecker()
    );

    this.emitter.emit(myEventReturn);      
  }
  onClickPreview(event) :void {
    event.stopPropagation();
    event.preventDefault();
    this.isPreview=true;

    let myEventReturn:MyEvent = 
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_PREVIEW,
      // public key:string
      this.key,
      // public value:string
      "",
      // public metaObj:any
      null,
      // public myChecker:MyChecker
      this.myCheckerService.getFreePassChecker()
    );

    this.emitter.emit(myEventReturn);    
  }

  save() :void {

    if(this.isDisabledSave) {
      return;
    }

    let result = null;
    if(null != this.smartEditorComponent) {
      result = this.smartEditorComponent.saveNReturn();
    }
    // 부모 컴포넌트에게 MyEvent 객체를 전달, 사용자가 수정 및 입력을 완료했음을 알립니다.
    let myEventReturn:MyEvent = 
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_SAVE,
      // public key:string
      this.key,
      // public value:string
      this.SEinnerHTML,
      // public metaObj:any
      null,
      // public myChecker:MyChecker
      this.myCheckerService.getFreePassChecker()
    );

    this.emitter.emit(myEventReturn);
    this.overwriteSEinnerHTML();

    this.isDisabledSave = true;
  }
}