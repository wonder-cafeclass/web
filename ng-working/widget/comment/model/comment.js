"use strict";
var Comment = (function () {
    function Comment(id, comment, writer, thumbnail_url, dateUpdated, dateUpdatedHumanReadable, metaObj) {
        this.id = id;
        this.comment = comment;
        this.writer = writer;
        this.thumbnail_url = thumbnail_url;
        this.dateUpdated = dateUpdated;
        this.dateUpdatedHumanReadable = dateUpdatedHumanReadable;
        this.metaObj = metaObj;
    }
    return Comment;
}());
exports.Comment = Comment;
//# sourceMappingURL=comment.js.map