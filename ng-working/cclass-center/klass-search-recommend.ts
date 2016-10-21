export class KlassSearchRecommend {
	constructor(
		public keywords: string[],
		public searchResult: string
	) {}

	public getHtmlTag() {
		// 사용자가 선택한 키워드를 Highlight 처리해서 html 태그로 보여줍니다.
		return this.searchResult;
	}
}