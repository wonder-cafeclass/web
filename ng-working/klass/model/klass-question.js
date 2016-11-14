"use strict";
var KlassQuestion = (function () {
    function KlassQuestion(id, klass_id, user_id, first_name, last_name, nickname, thumbnail, thumbnail_url, parent_id, comment, date_created, date_updated, date_updated_human_readable) {
        this.id = id;
        this.klass_id = klass_id;
        this.user_id = user_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.nickname = nickname;
        this.thumbnail = thumbnail;
        this.thumbnail_url = thumbnail_url;
        this.parent_id = parent_id;
        this.comment = comment;
        this.date_created = date_created;
        this.date_updated = date_updated;
        this.date_updated_human_readable = date_updated_human_readable;
    }
    return KlassQuestion;
}());
exports.KlassQuestion = KlassQuestion;
//# sourceMappingURL=klass-question.js.map