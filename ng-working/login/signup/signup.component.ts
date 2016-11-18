import {  Component, 
          ViewChild,
          ElementRef,
          Renderer,
          Input, 
          Output,
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { LoginService }         from '../service/login.service';
import { MyLoggerService }      from '../../util/service/my-logger.service';
import { UploadService }        from '../../util/service/upload.service';
import { UrlService }           from "../../util/url.service";

@Component({
  moduleId: module.id,
  selector: 'signup',
  templateUrl: 'signup.component.html',
  styleUrls: [ 'signup.component.css' ]
})
export class SignupComponent implements OnInit {

  private uploadUserProfileUrl:string = '/CI/index.php/api/upload/userprofile';
  public userProfilePath:string = "/assets/images/user/";
  public userProfileUrl:string = "/assets/images/user/user_anonymous_150x150.png";

  // TODO - 서버에서 anonymous 이미지 받아와야 함.

  isFemale:boolean=false;

  isFocusEmail:boolean=false;
  isFocusPassword:boolean=false;
  isFocusName:boolean=false;
  isFocusPhoneNumHead:boolean=false;
  isFocusPhoneNumBody:boolean=false;
  isFocusPhoneNumTail:boolean=false;

  @ViewChild('fileInput') fileInput:ElementRef;

  constructor(  private loginService: LoginService, 
                private myLoggerService: MyLoggerService, 
                private uploadService: UploadService, 
                private urlService:UrlService,
                private renderer:Renderer,
                public router: Router) {

  }

  ngOnInit(): void {

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(this.myLoggerService.pageKeySignup);    

    // Do something...

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

  onClickGenderFemale(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFemale) {
      this.isFemale = true;
    } // end if    
  }

  onClickGenderMale(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFemale) {
      this.isFemale = false;      
    } // end if
  }  

  onClickEmail(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusEmail) {
      this.isFocusEmail = true;      
    } // end if
  } 

  onBlurEmail(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusEmail) {
      this.isFocusEmail = false;
    } // end if
  }

  onClickPassword(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusPassword) {
      this.isFocusPassword = true;      
    } // end if
  } 

  onBlurPassword(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusPassword) {
      this.isFocusPassword = false;
    } // end if
  } 

  onClickName(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusName) {
      this.isFocusName = true;      
    } // end if
  } 

  onBlurName(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusName) {
      this.isFocusName = false;
    } // end if
  }

  onClickPhoneNumHead(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusPhoneNumHead) {
      this.isFocusPhoneNumHead = true;      
    } // end if
  } 

  onBlurPhoneNumHead(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusPhoneNumHead) {
      this.isFocusPhoneNumHead = false;
    } // end if
  } 

  onClickPhoneNumBody(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusPhoneNumBody) {
      this.isFocusPhoneNumBody = true;      
    } // end if
  } 

  onBlurPhoneNumBody(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusPhoneNumBody) {
      this.isFocusPhoneNumBody = false;
    } // end if
  }  

  onClickPhoneNumTail(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusPhoneNumTail) {
      this.isFocusPhoneNumTail = true;      
    } // end if
  } 

  onBlurPhoneNumTail(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusPhoneNumTail) {
      this.isFocusPhoneNumTail = false;
    } // end if
  }          

}
