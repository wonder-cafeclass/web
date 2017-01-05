/*
*	@ Desc : 페이지네이션 모델
*/
export class Pagination {

	pageNum:number=-1; // 사용자가 선택한 페이지 번호
	rowCnt:number=-1;
	pageRange:number=-1;
	totalRowCnt:number=-1;
	cursorPageNum:number=-1;
	rowCntPerPage:number=-1;
	pageCntOnPagination:number=-1;
	totalPageCnt:number=-1;
	pageNumBeginOnView:number=-1;
	pageNumEndOnView:number=-1;
	pageNumJumpToPrev:number=-1;
	pageNumJumpToNext:number=-1;
	pageNumLast:number=-1;

	pageNumList:number[]=[];

	setJSON(json):Pagination {

		if(null == json) {
			return;
		}

		this.pageNum = +json["PAGE_NUM"];
		this.rowCnt = +json["ROW_CNT"];
		this.pageRange = +json["PAGE_RANGE"];
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

		if(!(0 < this.pageNumBeginOnView)) {
			return;
		} // end if
		if(!(0 < this.pageNumEndOnView)) {
			return;
		} // end if
		this.pageNumList = [];
		for (var i = this.pageNumBeginOnView; i < this.pageNumEndOnView; ++i) {
			this.pageNumList.push(i);
		} // end for

		return this;

	} // end method

}
