import { 
  Component, 
  OnInit,
  NgZone, 
  Input, 
  Output, 
  ElementRef,
  ViewChild,
  EventEmitter }                    from '@angular/core';
import { MyEvent }                  from '../../util/model/my-event';
import { MyEventService }           from '../../util/my-event.service';
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

  @ViewChild('iframe') iframe:ElementRef;
  private childContentWindow;

  @Input() title:string;
  @Input() titleFontSize:number;
  @Input() cageHeight:number=-1;
  cageHeightStr:string;
  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  cageWidthMin:number=695;
  @Input() topLeftImageUrl:string;

  @Input() html:string="";
  @Input() key:string="";
  
  @Output() emitter = new EventEmitter<any>();



  constructor(  public myAssetService:MyAssetService, 
                public myEventService:MyEventService, 
                private zone:NgZone  ) {

    // set function reference out of app. ( ex)iframe )
    window["angularMySE"] = {
      zone: this.zone, 
      componentFn: (value) => this.callFromOutside(value), 
      component: this
    };
  }

  ngOnInit(): void {

    if(0 < this.cageWidth) {

      if(this.cageWidth < this.cageWidthMin) {
        this.cageWidth = this.cageWidthMin;
      }
      let borderWidth:number = 2;
      this.cageWidthStr=`${this.cageWidth + borderWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    if(0 < this.cageHeight) {
      this.cageHeightStr=`${this.cageHeight}px`;
    } else {
      this.cageHeightStr="100%";
    }

    // Javascript, ifarme 통신 
    // https://plnkr.co/edit/e77JkHmO7n5FYoKSXnIL?p=preview
    this.childContentWindow = this.iframe.nativeElement.contentWindow;

  } // end method

  // 사용자가 내용을 변경한 뒤에 부모에게 내용이 변경되었다고 이벤트 발송.

  // iframe에서 호출하는 함수.
  callFromOutside(myEvent) {

    if(null == myEvent || null == myEvent.key) {
      return;
    }

    if("se_ready_to_init" === myEvent.key) {

      // 에디터의 너비, 높이를 변경합니다.
      this.setSESize(this.cageWidth, this.cageHeight);
      // 에디터를 시작합니다.
      this.initSE();

    } else if("se_ready_to_fecth" === myEvent.key) {

      // 전달받은 html 문자열을 iframe - smart editor에게 전달.
      this.updateHTML(this.html);

      // 에디터가 준비된 것을 부모 객체에게 알린다.
      let myEventReturn:MyEvent = 
      this.myEventService.getMyEvent(
          // public eventName:string
          this.myEventService.ON_READY,
          // public key:string
          this.myEventService.KEY_SMART_EDITOR,
          // public value:string
          "",
          // public metaObj:any
          null,
          // public myChecker:MyChecker
          null    
      )
      this.emitter.emit(myEventReturn);      

    } else if("se_update" === myEvent.key) {

      // 사용자가 내용을 변경한 뒤에 부모에게 내용이 변경되었다고 이벤트 발송.
      let myEventReturn:MyEvent = 
      this.myEventService.getMyEvent(
          // public eventName:string
          this.myEventService.ON_CHANGE,
          // public key:string
          this.myEventService.KEY_SMART_EDITOR,
          // public value:string
          myEvent.value,
          // public metaObj:any
          null,
          // public myChecker:MyChecker
          null    
      )

      this.emitter.emit(myEventReturn);
      
    }

  }  

  private updateHTML(html:string) :void {

    if(null == this.childContentWindow) {
      return;
    }
    if(null == this.childContentWindow.initHTML) {
      return;
    }

    this.childContentWindow.initHTML(html);

  }

  public clearHTML() :void {

    if(null == this.childContentWindow) {
      return;
    }
    if(null == this.childContentWindow.clearHTML) {
      return;
    }
    this.childContentWindow.clearHTML();

  }

  public setSESize(width:number, height:number) :void {
    if(!(0 < width)) {
      return;
    }
    if(!(0 < height)) {
      return;
    }
    if(null == this.childContentWindow) {
      return;
    }
    if(null == this.childContentWindow.setSize) {
      return;
    }

    this.childContentWindow.setSize(width, height);
  }
  public initSE():void {
    this.childContentWindow.initSE(); 
  }
  public hasChanged() :boolean {

    if(null == this.childContentWindow) {
      return;
    }
    if(null == this.childContentWindow.hasChanged) {
      return;
    }

    return this.childContentWindow.hasChanged();
  }
  public saveNReturn():string {

    if(null == this.childContentWindow) {
      return;
    }
    if(null == this.childContentWindow.saveNReturn) {
      return;
    }

    // 현재 작업중인 HTML 태그를 가져와 변수에 저장합니다.
    let workingHTML = this.childContentWindow.saveNReturn();
    if(null === workingHTML) {
      return;
    }
    this.html = workingHTML;

    // 작업중인 HTML 태그를 부모 컴포넌트에게 전달합니다.
    return this.html;
  }
  public getHTMLPrev():string {

    if(null == this.childContentWindow) {
      return;
    }
    if(null == this.childContentWindow.getHTMLPrev) {
      return;
    }
    
    return this.childContentWindow.getHTMLPrev();
  }
}