import {  Component, 
          ViewChild,
          ElementRef,
          Renderer,  
          Input, 
          Output,
          EventEmitter,
          AfterViewInit }             from '@angular/core';
import { Router }                     from '@angular/router';

import { UploadService }              from '../../../util/service/upload.service';
import { UrlService }                 from "../../../util/url.service";

import { MyCheckerService }           from '../../../util/service/my-checker.service';
import { MyChecker }                  from '../../../util/model/my-checker';
import { MyEventService }             from '../../../util/service/my-event.service';
import { MyEvent }                    from '../../../util/model/my-event';

import { MyLoggerService }            from '../../../util/service/my-logger.service';
import { MyEventWatchTowerService }   from '../../../util/service/my-event-watchtower.service';
import { MyResponse }                 from '../../../util/model/my-response';
import { TooltipComponent }           from '../tooltip/tooltip.component';


@Component({
  moduleId: module.id,
  selector: 'hidden-uploader',
  templateUrl: 'hidden-uploader.component.html',
  styleUrls: [ 'hidden-uploader.component.css' ]
})
export class HiddenUploaderComponent implements AfterViewInit {

  /*
  * Samples *
  public uploadAPIUrl:string = '/CI/index.php/api/upload/userprofile';
  public imagePath:string = "/assets/images/class/banner";
  public imageUrl:string = "/assets/images/class/banner/banner_default.svg";
  */

  @Input() uploadAPIUrl:string = "";
  @Input() imagePath:string = "";
  @Input() imageUrl:string = "";
  @Input() eventKey:string = "";
  @Input() fileSizeKBMax:number = 200; // 100000bytes --> 100kb
  @Input() fileWidth:number = 400; // px
  @Input() fileHeight:number = -1; // px / 음수일 경우는 너비의 비율에 맞춰 계산됨.
  @Input() fileMinWidth:number = 100; // px
  @Input() fileMinHeight:number = 100; // px
  @Input() fileMaxWidth:number = 800; // px
  @Input() fileMaxHeight:number = 800; // px

  @Output() emitter = new EventEmitter<MyEvent>();

  @ViewChild('fileInput') fileInput:ElementRef;
  @ViewChild(TooltipComponent)
  private tooltipComponent: TooltipComponent;

  private myChecker:MyChecker;

  isAdmin:boolean=false;

  constructor(  private uploadService: UploadService,
                private myEventService:MyEventService,
                private myLoggerService:MyLoggerService,
                private watchTower:MyEventWatchTowerService, 
                private myCheckerService:MyCheckerService,
                private renderer:Renderer,
                private urlService:UrlService  ) {}

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  private isNotValidParams() :boolean {
    return !this.isValidParams();
  }
  private isValidParams() :boolean {

    if(!this.isValidUploadAPIUrl()) {
      return false;
    }
    if(!this.isValidImagePath()) {
      return false;
    }
    if(!this.isValidImageUrl()) {
      return false;
    }
    if(!this.isValidEventKey()) {
      return false;
    }

    return true;
  }
  private isValidUploadAPIUrl() :boolean {
    if(null == this.uploadAPIUrl || "" == this.uploadAPIUrl) {
      return false;
    }
    return true;
  }
  private isValidImagePath() :boolean {
    if(null == this.imagePath || "" == this.imagePath) {
      return false;
    }
    return true;
  }
  private isValidImageUrl() :boolean {
    if(null == this.imageUrl || "" == this.imageUrl) {
      return false;
    }
    return true;
  }
  private isValidEventKey() :boolean {
    if(null == this.eventKey || "" == this.eventKey) {
      return false;
    }
    return true;
  }

  ngAfterViewInit(): void {

    if(this.isDebug()) console.log("hidden-uploader / ngAfterViewInit");

    this.asyncViewPack();

  } 
  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("hidden-uploader / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("hidden-uploader / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("hidden-uploader / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }
  private setViewPack() :void {
    this.isAdmin = this.watchTower.getIsAdminServer();
    this.myCheckerService.setReady(
      // checkerMap:any
      this.watchTower.getCheckerMap(),
      // constMap:any
      this.watchTower.getConstMap(),
      // dirtyWordList:any
      this.watchTower.getDirtyWordList(),
      // apiKey:string
      this.watchTower.getApiKey()
    ); // end setReady
  }   

  private setMyChecker() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("hidden-uploader / setMyChecker / 시작");

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_thumbnail");
    }
  }

  private init() :void {
    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    
    this.setMyChecker();
  }  

  isNotOK(input:string) :boolean {
    return !this.isOK(input);
  }
  isOK(input:string) :boolean {

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myChecker, input);
  }
  public setImageUrl(imageUrl:string) :void {

    if(this.isNotValidParams()) {
      return;
    }

    if(this.isOK(imageUrl)) {
      this.imageUrl = imageUrl;
    }
  }

  // @ Desc : 프로필 이미지가 제대로 입력되었는지 확인합니다.
  public hasNotDone() :boolean {
    return !this.hasDone();
  }
  public hasDone() :boolean {

    if(this.isNotValidParams()) {
      return false;
    }

    let isOK:boolean = this.isOK(this.imageUrl);

    if(!isOK) {
      let history = this.myCheckerService.getLastHistory();
      console.log("hidden-uploader / hasDone / history : ",history);
    }

    return isOK;
  } 
  public getImageUrl() :string {
    return this.imageUrl;
  }

  private isValidEventkey():boolean {
    if(null == this.eventKey || "" == this.eventKey) {
      return false;
    }
    return true;
  }

  initFileUpload():void {

    if(this.isDebug()) console.log("hidden-uploader / initFileUpload / init");
    
    // from http://stackoverflow.com/a/32010791/217408
    let eventClick = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [eventClick]);

  }

  onChangeFile(event) :void {

    if(this.isDebug()) console.log("hidden-uploader / onChangeFile / init");

    if(this.isNotValidParams()) {
      if(this.isDebug()) console.log("hidden-uploader / onChangeFile / Params is not valid!");
      return;
    }

    // 툴팁을 노출되었다면 가립니다.
    this.tooltipComponent.hideTooltip();
    
    var files = event.srcElement.files;
    if(null == files || 1 != files.length) {
      // 1개의 파일만 업로드할 수 있습니다.
      return;
    }
    if(this.isDebug()) console.log("hidden-uploader / onChangeFile / files : ",files);

    let file = files[0];
    let isValidFileType:boolean = false;
    if( file.type === "image/jpeg" || 
        file.type === "image/jpg" || 
        file.type === "image/png" || 
        file.type === "image/gif") {

      isValidFileType = true;
    }
    if(!isValidFileType) {
      this.tooltipComponent.showTooltipFailWarning("업로드할 수 없는 이미지 타입입니다", false);
      return;
    }

    let fileSizeBytesMax:number = this.fileSizeKBMax*1000;
    if(fileSizeBytesMax < file.size) {
      if(this.isDebug()) console.log("hidden-uploader / onChangeFile / size : ",file.size);
      this.tooltipComponent.showTooltipFailWarning(`${ this.fileSizeKBMax }kb 이하 이미지로 올려주세요`, false);
      return;
    }

    // max size / 100kb
    // wonder.jung
    let req_url = this.urlService.get(this.uploadAPIUrl);
    let paramsObj = 
    {
      image_file_size:this.fileSizeKBMax,
      image_dir_dest:this.imagePath,
      desired_width:this.fileWidth,
      desired_height:this.fileHeight,
      min_width:this.fileMinWidth,
      max_width:this.fileMaxWidth,
      min_height:this.fileMinHeight,
      max_height:this.fileMaxHeight
    };    

    this.uploadService.makeFileRequest(req_url, paramsObj, files).subscribe((myResponse:MyResponse) => {
      
      // 섬네일 주소를 받아와서 화면에 표시해야 한다.
      if(this.isDebug()) console.log("hidden-uploader / onChangeFile / myResponse : ",myResponse);

      if( myResponse.isSuccess() &&
          null != myResponse && 
          null != myResponse.data && 
          null != myResponse.data.thumbnail) {

        // this.imageUrl = this.imagePath + myResponse.data.thumbnail;
        this.imageUrl = myResponse.data.thumbnail;

        if(this.isDebug()) console.log("hidden-uploader / onChangeFile / this.imageUrl : ",this.imageUrl);

        let isOK:boolean = this.isOK(this.imageUrl);

        if(this.isDebug()) console.log("hidden-uploader / onChangeFile / isOK : ",isOK);
        if(this.isDebug()) console.log("hidden-uploader / onChangeFile / this.myChecker : ",this.myChecker);

        if(isOK && this.isValidEventkey()) {
          // 부모 객체에게 Change Event 발송 
          this.emitEventOnDone(
            // eventKey:string
            this.eventKey,
            // value:string
            this.imageUrl
          );
        } // end if

      } else if( myResponse.isFailed() ) {

        // 업로드가 실패했습니다.
        // 원인이 전달되었다면, 이유를 사용자에게 툴팁으로 보여줍니다.
        if(null != myResponse && null != myResponse["error"] && "" != myResponse["error"]) {

          let error:string = myResponse["error"];
          if(this.isDebug()) console.log("hidden-uploader / onChangeFile / error : ",error);

          this.tooltipComponent.showTooltipFailWarning(error, false);
        }

      } else {
        // 그 이외의 에러 상황
        // TODO - Error Report

      }
    });

  } // end method

  private emitEventOnDone(eventKey:string, value:string) :void {

    if(this.isDebug()) console.log("hidden-uploader / emitEventOnDone / 시작");

    if(null == eventKey) {
      if(this.isDebug()) console.log("hidden-uploader / emitEventOnDone / 중단 / eventKey is not valid!");
      return;
    }
    if(null == value) {
      if(this.isDebug()) console.log("hidden-uploader / emitEventOnDone / 중단 / value is not valid!");
      return;
    }

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_DONE,
      // public key:string
      eventKey,
      // public value:string
      value,
      // public metaObj:any
      null,
      // public myChecker:MyChecker
      this.myChecker
    );
    this.emitter.emit(myEventOnChange);

    if(this.isDebug()) console.log("hidden-uploader / emitEventOnDone / Done!");

  } // end method

}
