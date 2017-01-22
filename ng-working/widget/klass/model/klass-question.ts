import { HelperMyArray }            from '../../../util/helper/my-array';
import { HelperMyIs }               from '../../../util/helper/my-is';
import { HelperMyTime }             from '../../../util/helper/my-time';
import { Comment }                  from '../../../widget/comment/model/comment';

export class KlassQuestion {

        public id:number=-1;
        public klass_id:number=-1;
        public user_id:number=-1;
        public name:string="";
        public nickname:string="";
        public thumbnail:string="";
        public thumbnail_url:string="";
        public parent_id:number=-1;
        public comment:string="";
        public date_created:string="";
        public date_updated:string="";
        public date_updated_human_readable:string="";

        public child_question_list:KlassQuestion[];

        private delimiter:string="|||";
        private myArray:HelperMyArray;
        private myIs:HelperMyIs;
        private myTime:HelperMyTime;

        constructor() {
                this.myArray = new HelperMyArray();
                this.myIs = new HelperMyIs();
                this.myTime = new HelperMyTime();
        }

        getComment():Comment {
            return new Comment().set(
                // id:number, 
                this.id,
                // parentId:number, 
                this.parent_id,
                // comment:string, 
                this.comment,
                // writerId:number, 
                this.user_id,
                // writer:string, 
                this.name,
                // thumbnail:string, 
                this.thumbnail,
                // dateUpdated:string
                this.date_updated,
                // star:number, 
                -1
            );                
        }

        copy():KlassQuestion {

                return this.myIs.copy(
                        // src:any
                        this, 
                        // copy:any
                        new KlassQuestion()
                );

        } // end method

        setJSON(json):KlassQuestion {

                // let isDebug:boolean = true;
                let isDebug:boolean = false;

                if(isDebug) console.log("klass-question / setJSON / init");
                if(isDebug) console.log("klass-question / setJSON / json : ",json);

                let klassQuestion:KlassQuestion = this._setJSON(json);

                if(isDebug) console.log("klass-question / setJSON / klassQuestion : ",klassQuestion);
                
                // 추가 작업이 필요한 데이터들을 여기서 다룹니다.
                if(null != json.child_question_list && 0 < json.child_question_list.length) {
                        let child_question_list:KlassQuestion[]=[];
                        for (var i = 0; i < json.child_question_list.length; ++i) {
                                let child_question_json = json.child_question_list[i];
                                let childKlassQuestion:KlassQuestion = new KlassQuestion().setJSON(child_question_json);
                                child_question_list.push(childKlassQuestion);
                        }

                        klassQuestion.child_question_list = child_question_list;
                }

                return klassQuestion;

        } // end method

        private _setJSON(json):KlassQuestion {

                return this.myIs.copyFromJSON(
                        // target:any,
                        this,
                        // json
                        json
                );

        } // end method        

}