import {  Component, 
          ViewChild,
          ElementRef,
          Renderer,  
          Input, 
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';

import { LoginService }         from '../../service/login.service';
import { UploadService }        from '../../../util/service/upload.service';
import { UrlService }           from "../../../util/url.service";


@Component({
  moduleId: module.id,
  selector: 'profile-img-upload',
  templateUrl: 'profile-img-upload.component.html',
  styleUrls: [ 'profile-img-upload.component.css' ]
})
export class ProfileImgUploadComponent implements OnInit {

  private uploadUserProfileUrl:string = '/CI/index.php/api/upload/userprofile';
  public userProfilePath:string = "/assets/images/user/";
  public userProfileUrl:string = "/assets/images/user/user_anonymous_150x150_orange.png";

  @Input() top:number=-1;
  @Input() left:number=-1;

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  @ViewChild('fileInput') fileInput:ElementRef;

  isShowPopover:boolean=false;

  constructor(  private loginService: LoginService, 
                private uploadService: UploadService, 
                private renderer:Renderer,
                private urlService:UrlService  ) {}

  ngOnInit(): void {}

  onClick(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if
  } 

  onBlur(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocus) {
      this.isFocus = false;
    } // end if
  }  

  onMouseOverInfo(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusInfo) {
      this.isFocusInfo = true;      
    } // end if
  }

  onMouseOutInfo(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusInfo) {
      this.isFocusInfo = false;
    } // end if
  }

  onClickFileUpload(event) :void {
    event.stopPropagation();
    event.preventDefault();

    // from http://stackoverflow.com/a/32010791/217408
    let eventClick = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [eventClick]);    

    return;
  }
  onChangeFile(event) :void {

    console.log('onChange');
    var files = event.srcElement.files;
    if(null == files || 1 != files.length) {
      // 1개의 파일만 업로드할 수 있습니다.
      return;
    }
    console.log(files);

    let req_url = this.urlService.get(this.uploadUserProfileUrl);

    this.uploadService.makeFileRequest(req_url, [], files).subscribe((response:any) => {
      // 섬네일 주소를 받아와서 화면에 표시해야 한다.
      console.log('sent / response : ',response);
      if( null != response && 
          null != response.data && 
          null != response.data.thumbnail) {

          this.userProfileUrl = this.userProfilePath + response.data.thumbnail;
      }
    });

  }  

}
