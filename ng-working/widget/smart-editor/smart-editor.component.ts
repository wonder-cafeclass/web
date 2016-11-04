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

  @Input() title:string;
  @Input() titleFontSize:number;
  @Input() cageHeight:number=-1;
  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  @Input() topLeftImageUrl:string;

  @Input() html:string="";
  
  @Output() emitter = new EventEmitter<any>();

  childContentWindow;

  constructor(public myAssetService:MyAssetService, private zone:NgZone) {

    // set function reference out of app. ( ex)iframe )
    window["angularMySE"] = {
      zone: this.zone, 
      componentFn: (value) => this.callFromOutside(value), 
      component: this
    };
  }

  callFromOutside(myEvent) {
    if(null == myEvent || null == myEvent.key) {
      return;
    }

    if("se_ready_to_fecth" === myEvent.key) {
      // 전달받은 html 문자열을 iframe - smart editor에게 전달.
      this.updateHTML(this.html);
    }
  }  

  ngOnInit(): void {
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    // Javascript, ifarme 통신 
    // https://plnkr.co/edit/e77JkHmO7n5FYoKSXnIL?p=preview
    this.childContentWindow = this.iframe.nativeElement.contentWindow;

  } // end method

  public updateHTML(html:string) :void {

    if(null == this.childContentWindow) {
      return;
    }
    if(null == this.childContentWindow.pasteHTML) {
      return;
    }
    this.childContentWindow.pasteHTML(html);

  }

}