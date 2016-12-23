"use strict";
var my_array_1 = require('../../../util/helper/my-array');
var my_is_1 = require('../../../util/helper/my-is');
var my_time_1 = require('../../../util/helper/my-time');
var Comment = (function () {
    function Comment() {
        this.id = -1;
        this.parentId = -1;
        this.comment = "";
        this.writer = "";
        this.writerId = -1;
        this.thumbnail = "";
        this.dateUpdated = "";
        this.dateUpdatedHumanReadable = "";
        this.star = -1;
        this.childCommentList = null;
        this.uniqueId = -1; // DB 업데이트 이후에 저장된 데이터를 덮어쓰기 대상을 찾기 위해 쓰임.
        this.myArray = new my_array_1.HelperMyArray();
        this.myIs = new my_is_1.HelperMyIs();
        this.myTime = new my_time_1.HelperMyTime();
        this.uniqueId = this.myTime.getUniqueId();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("comment / setJSON / init");
        if (isDebug)
            console.log("comment / setJSON / this.uniqueId : ", this.uniqueId);
    }
    Comment.prototype.setNew = function (id, parentId, comment, writerId, writer, thumbnail, star) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("comment / setNew / init");
        this.id = id;
        this.parentId = parentId;
        this.comment = comment;
        this.writerId = writerId;
        this.writer = writer;
        this.thumbnail = thumbnail;
        this.star = star;
        this.dateUpdated =
            this.myTime.getNow_YYYY_MM_DD_HH_MM_SS();
        this.dateUpdatedHumanReadable =
            this.myTime.convert(
            // date_str:string, 
            this.dateUpdated, 
            // input_date_format_type:number, 
            this.myTime.DATE_TYPE_YYYY_MM_DD_HH_MM_SS, 
            // output_date_format_type:number
            this.myTime.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS);
        return this;
    };
    Comment.prototype.set = function (id, parentId, comment, writerId, writer, thumbnail, dateUpdated, star) {
        this.id = id;
        this.parentId = parentId;
        this.comment = comment;
        this.writerId = writerId;
        this.writer = writer;
        this.thumbnail = thumbnail;
        this.star = star;
        this.dateUpdated = dateUpdated;
        this.dateUpdatedHumanReadable =
            this.myTime.convert(
            // date_str:string, 
            this.dateUpdated, 
            // input_date_format_type:number, 
            this.myTime.DATE_TYPE_YYYY_MM_DD_HH_MM_SS, 
            // output_date_format_type:number
            this.myTime.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS);
        return this;
    };
    Comment.prototype.copy = function () {
        return this.myIs.copy(
        // src:any
        this, 
        // copy:any
        new Comment());
    }; // end method
    Comment.prototype.setJSON = function (json) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("comment / setJSON / init");
        var comment = this._setJSON(json);
        if (isDebug)
            console.log("comment / setJSON / comment : ", comment);
        // 추가 작업이 필요한 데이터들을 여기서 다룹니다.
        return comment;
    }; // end method
    Comment.prototype._setJSON = function (json) {
        return this.myIs.copyFromJSON(
        // target:any,
        this, 
        // json
        json);
    }; // end method	
    return Comment;
}());
exports.Comment = Comment;
//# sourceMappingURL=comment.js.map