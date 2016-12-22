import { HelperMyArray }            from '../../util/helper/my-array';
import { HelperMyIs }               from '../../util/helper/my-is';
import { HelperMyTime }             from '../../util/helper/my-time';

export class KlassReview {

        public id:number=-1;
        public klass_id:number=-1;
        public user_id:number=-1;
        public name:string="";
        public nickname:string="";
        public thumbnail:string="";
        public thumbnail_url:string=""; // @ Deprecated
        public parent_id:number=-1;
        public comment:string="";
        public date_created:string="";
        public date_updated:string="";
        public date_updated_human_readable:string="";

        public child_review_list:KlassReview[];

        private delimiter:string="|||";
        private myArray:HelperMyArray;
        private myIs:HelperMyIs;
        private myTime:HelperMyTime;

        constructor() {
                this.myArray = new HelperMyArray();
                this.myIs = new HelperMyIs();
                this.myTime = new HelperMyTime();
        }

        copy():KlassReview {

                return this.myIs.copy(
                        // src:any
                        this, 
                        // copy:any
                        new KlassReview()
                );

        } // end method

        setJSON(json):KlassReview {

                let isDebug:boolean = true;
                // let isDebug:boolean = false;
                if(isDebug) console.log("klass-review / setJSON / init");

                let klassReview:KlassReview = this._setJSON(json);

                if(isDebug) console.log("klass-review / setJSON / klassReview : ",klassReview);

                // 추가 작업이 필요한 데이터들을 여기서 다룹니다.

                return klassReview;

        } // end method

        private _setJSON(json):KlassReview {

                return this.myIs.copyFromJSON(
                        // target:any,
                        this,
                        // json
                        json
                );

        } // end method


}