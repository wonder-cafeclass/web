export class KlassQuestion {

        public child_question_list:KlassQuestion[];

        constructor(
                public id:number,
                public klass_id:number,
                public user_id:number,
                public name:string,
                public nickname:string,
                public thumbnail:string,
                public thumbnail_url:string,
                public parent_id:number,
                public comment:string,
                public date_created:string,
                public date_updated:string,
                public date_updated_human_readable:string
        ) {}
}