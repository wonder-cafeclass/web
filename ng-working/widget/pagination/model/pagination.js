"use strict";
/*
*	@ Desc : 페이지네이션 모델
*/
var Pagination = (function () {
    function Pagination() {
        this.pageNum = 1; // 사용자가 선택한 페이지 번호
        this.rowCnt = -1;
        this.pageRowCnt = 5; // 페이지 안에 표시되는 row의 갯수
        this.totalRowCnt = -1;
        this.cursorPageNum = -1;
        this.rowCntPerPage = -1;
        this.pageCntOnPagination = -1;
        this.totalPageCnt = -1;
        this.pageNumBeginOnView = -1;
        this.pageNumEndOnView = -1;
        this.pageNumJumpToPrev = -1;
        this.pageNumJumpToNext = -1;
        this.pageNumLast = -1;
        this.pageNumList = [];
    }
    Pagination.prototype.setJSON = function (json) {
        if (null == json) {
            return;
        }
        this.pageNum = +json["PAGE_NUM"];
        this.rowCnt = +json["ROW_CNT"];
        this.pageRowCnt = +json["PAGE_ROW_CNT"];
        this.totalRowCnt = +json["TOTAL_ROW_CNT"];
        this.cursorPageNum = +json["CURSOR_PAGE_NUM"];
        this.rowCntPerPage = +json["ROW_CNT_PER_PAGE"];
        this.pageCntOnPagination = +json["PAGE_CNT_ON_PAGINATION"];
        this.totalPageCnt = +json["TOTAL_PAGE_CNT"];
        this.pageNumBeginOnView = +json["PAGE_NUM_BEGIN_ON_VIEW"];
        this.pageNumEndOnView = +json["PAGE_NUM_END_ON_VIEW"];
        this.pageNumJumpToPrev = +json["PAGE_NUM_JUMP_TO_PREV"];
        this.pageNumJumpToNext = +json["PAGE_NUM_JUMP_TO_NEXT"];
        this.pageNumLast = +json["PAGE_NUM_LAST"];
        if (!(0 < this.pageNumBeginOnView)) {
            return;
        } // end if
        if (!(0 < this.pageNumEndOnView)) {
            return;
        } // end if
        this.pageNumList = [];
        for (var i = this.pageNumBeginOnView; i < this.pageNumEndOnView; ++i) {
            this.pageNumList.push(i);
        } // end for
        return this;
    }; // end method
    return Pagination;
}());
exports.Pagination = Pagination;
//# sourceMappingURL=pagination.js.map