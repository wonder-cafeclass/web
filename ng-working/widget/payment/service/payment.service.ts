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

  addImportHistory (  apiKey:string, 
                      paymentImpUid:string): Promise<MyResponse> {

    if(this.isDebug()) console.log("payment.service / test / 시작");
    if(this.isDebug()) console.log("payment.service / test / apiKey : ",apiKey);
    if(this.isDebug()) console.log("payment.service / test / paymentImpUid : ",paymentImpUid);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.addImportHistoryUrl);

    let params = {
      payment_imp_uid:paymentImpUid
    };

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }  
}
