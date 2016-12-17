import { Component, 
         OnInit, 
         AfterViewInit, 
         Output,
         EventEmitter,
         Input }                from '@angular/core';

import { MyCheckerService }     from '../../util/service/my-checker.service';
import { MyChecker }            from '../../util/model/my-checker';
import { MyEventService }       from '../../util/service/my-event.service';
import { MyEvent }              from '../../util/model/my-event';

@Component({
  moduleId: module.id,
  selector: 'image-entry',
  templateUrl: 'image-entry.component.html',
  styleUrls: [ 'image-entry.component.css' ]
})
export class ImageEntryComponent implements OnInit, AfterViewInit {

  // @ Common Props
  @Output() emitter = new EventEmitter<MyEvent>();

  @Input() imageUrl:string="";
  @Input() imageHeight:number=-1;
  @Input() imageWidth:number=-1;
  @Input() isAdmin:boolean=false;
  @Input() handleType:string="";

  isDisabled:boolean=false;

  constructor(  private myCheckerService:MyCheckerService,
                private myEventService:MyEventService ) {}

  ngOnInit(): void {

    this.init();
    this.emitEventOnReady();

  }

  ngAfterViewInit():void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("image-entry / ngAfterViewInit / 시작");

  }


  private init():void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("image-entry / init / 시작");

  }

  onChangeCheck(event, checkboxToggle, targetImg) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("image-entry / onChangeCheck / 시작");

    event.stopPropagation();
    event.preventDefault();

    if(null == checkboxToggle) {
      return;
    }

    let checked:boolean = checkboxToggle.checked;
    if(isDebug) console.log("image-entry / onChangeCheck / checked : ",checked);

    this.isDisabled = !checked;

    if(isDebug) console.log("image-entry / onChangeCheck / targetImg : ",targetImg);

  }

  onClickDelete(event, imgUrlToDelete:string) :void {

    event.stopPropagation();
    event.preventDefault();

    if(null == imgUrlToDelete || "" === imgUrlToDelete) {
      return;
    }

    this.emitEventOnDelete(imgUrlToDelete);

  }

  private emitEventOnDelete(imgUrlToDelete:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("image-entry / emitEventOnDelete / 시작");

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_REMOVE_ROW,
      // public key:string
      this.myEventService.KEY_IMAGE_GRID,
      // public value:string
      imgUrlToDelete,
      // public metaObj:any
      this,
      // public myChecker:MyChecker
      null
    );
    this.emitter.emit(myEventOnChange);

    if(isDebug) console.log("image-entry / emitEventOnChange / Done!");    
  }

  private emitEventOnReady() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("image-entry / emitEventOnChange / 시작");

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_READY,
      // public key:string
      this.myEventService.KEY_IMAGE_GRID,
      // public value:string
      "",
      // public metaObj:any
      this,
      // public myChecker:MyChecker
      null
    );
    this.emitter.emit(myEventOnChange);

    if(isDebug) console.log("image-entry / emitEventOnChange / Done!");

  }  

}