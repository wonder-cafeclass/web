import { Injectable }               from '@angular/core';
import { Headers, 
         Http, 
         Response, 
         RequestOptions }           from '@angular/http';
import { UrlService }               from "../../../util/url.service";
import { MyExtractor }              from '../../../util/http/my-extractor';
import { MyRequest }                from '../../../util/http/my-request';
import { MyResponse }               from '../../../util/model/my-response';
import { MyEventWatchTowerService } from '../../../util/service/my-event-watchtower.service';

@Injectable()
export class PaymentService {

  private fetchImportHistoryUrl = '/CI/index.php/api/payment/fetchimporthistory';
  private addImportHistoryUrl = '/CI/index.php/api/payment/addimporthistory';

  private myExtractor:MyExtractor;
  private myRequest:MyRequest;

  private watchTower:MyEventWatchTowerService;

  constructor(  private urlService:UrlService,
                private http:Http  ) {

    this.myExtractor = new MyExtractor();
    this.myRequest = new MyRequest();
  }

  setWatchTower(watchTower:MyEventWatchTowerService):void {
    this.watchTower = watchTower;
  }
  private isDebug():boolean {
    if(null == this.watchTower) {
      return false;
    }

    return this.watchTower.isDebug();
  } // end method  

  fetchImportHistory (  apiKey:string, 
                        pageNum:number,
                        pageRowCnt:number,
                        paymentImpUid:string,
                        klassId:number,
                        userId:number,
                        loginUserId:number): Promise<MyResponse> {

    if(this.isDebug()) console.log("payment.service / fetchImportHistory / 시작");
    if(this.isDebug()) console.log("payment.service / fetchImportHistory / apiKey : ",apiKey);
    if(this.isDebug()) console.log("payment.service / fetchImportHistory / pageNum : ",pageNum);
    if(this.isDebug()) console.log("payment.service / fetchImportHistory / pageRowCnt : ",pageRowCnt);
    if(this.isDebug()) console.log("payment.service / fetchImportHistory / paymentImpUid : ",paymentImpUid);
    if(this.isDebug()) console.log("payment.service / fetchImportHistory / klassId : ",klassId);
    if(this.isDebug()) console.log("payment.service / fetchImportHistory / userId : ",userId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.fetchImportHistoryUrl);

    let params = {
      payment_imp_uid:paymentImpUid,
      page_num:pageNum,
      pageRowCnt:pageRowCnt,
      klass_id:klassId,
      user_id:userId,
      login_user_id:loginUserId,
    };

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }    

  addImportHistory (  apiKey:string, 
                      paymentImpUid:string,
                      klassId:number,
                      userId:number,
                      loginUserId:number): Promise<MyResponse> {

    if(this.isDebug()) console.log("payment.service / addImportHistory / 시작");
    if(this.isDebug()) console.log("payment.service / addImportHistory / apiKey : ",apiKey);
    if(this.isDebug()) console.log("payment.service / addImportHistory / paymentImpUid : ",paymentImpUid);
    if(this.isDebug()) console.log("payment.service / addImportHistory / klassId : ",klassId);
    if(this.isDebug()) console.log("payment.service / addImportHistory / userId : ",userId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.addImportHistoryUrl);

    let params = {
      payment_imp_uid:paymentImpUid,
      klass_id:klassId,
      user_id:userId,
      login_user_id:loginUserId,
    };

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }  
}
