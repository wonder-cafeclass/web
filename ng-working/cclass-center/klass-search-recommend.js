"use strict";
var KlassSearchRecommend = (function () {
    function KlassSearchRecommend(keywords, searchResult) {
        this.keywords = keywords;
        this.searchResult = searchResult;
    }
    KlassSearchRecommend.prototype.getHtmlTag = function () {
        // 사용자가 선택한 키워드를 Highlight 처리해서 html 태그로 보여줍니다.
        return this.searchResult;
    };
    return KlassSearchRecommend;
}());
exports.KlassSearchRecommend = KlassSearchRecommend;
//# sourceMappingURL=klass-search-recommend.js.map