<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Pagenation을 위한 helper 클래스
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_Pagination
{

	public function get_limit($page_num=-1, $page_row_cnt=-1) 
	{
		if(!(0 < $page_num))
		{
			return -1;
		}
		if(!(0 < $page_row_cnt))
		{
			return -1;
		}

		return $page_row_cnt;
	}

	public function get_offset($page_num=-1, $page_row_cnt=-1) 
	{
		if(!(0 < $page_num))
		{
			return -1;
		}
		if(!(0 < $page_row_cnt))
		{
			return -1;
		}

		return ($page_num - 1) * $page_row_cnt;
	}


	private $cursor_page_num_default = 1;
	public function get_cursor_page_num_default()
	{
		return $this->cursor_page_num_default;
	}
	private $row_cnt_default = 5;
	public function get_row_cnt_default()
	{
		return $this->row_cnt_default;
	}

	private $page_range_default = 5;
	public function get_page_range_default()
	{
		return $this->page_range_default;
	}
	
	// @ Usage : PageManager::get($total_row_cnt, $cursor_page_num);
	public function get($total_row_cnt=-1, $cursor_page_num=-1, $row_cnt_per_page=-1, $page_row_cnt_on_pagination=-1) 
	{
		if(!(0 < $total_row_cnt)) 
		{
			return;
		}
		if(!(0 < $cursor_page_num)) 
		{
			$cursor_page_num = $this->get_cursor_page_num_default();
		}
		if(!(0 < $row_cnt_per_page)) 
		{
			$row_cnt_per_page = $this->get_row_cnt_default();
		}
		if(!(0 < $page_row_cnt_on_pagination)) 
		{
			$page_row_cnt_on_pagination = $this->get_page_range_default();
		}

		// 전체 row는 100개
		// $total_row_cnt=100;
		// 페이지당 10개의 row를 보여줌
		// $row_cnt_per_page=10;
		// 전체 페이지는 10 페이지
		// $total_page_cnt=10;

		// 페이지네이션에서 보여주는 페이지 갯수는 10개
		// $page_row_cnt_on_pagination=10;
		// 현재 보여주는 페이지의 번호
		// $cursor_page_num=7;

		// 화면에서 보여주는 시작 페이지 번호
		// $page_num_begin_on_view = 1;
		// 화면에서 보여주는 끝 페이지 번호
		// $page_num_end_on_view = 10;

		// 이전 페이지네이션을 보여주는 페이지 번호 / 여기서는 최초 1페이지이므로 이전 페이지네이션이 없습니다.
		// $page_num_jump_to_prev=0;
		// 다음 페이지네이션을 보여주는 페이지 번호
		// $page_num_jump_to_next=11;
		// 마지막 페이지 번호 - 마지막 페이지네이션이 아닌 경우는 화면에 표시되지 않습니다.
		// $page_num_last=10;

		// 화면에서 보여주는 형태
		// <<(0)prev | 1 | 2 | 3 | 4 | 5 | 6 | You're here - (7) | 8 | 9 | 10 | next(11)>>

		$page_num_begin_on_view = $page_row_cnt_on_pagination * floor(($cursor_page_num - 1) / $page_row_cnt_on_pagination) + 1;
		$page_num_end_on_view = $page_num_begin_on_view + $page_row_cnt_on_pagination;

		$total_page_cnt = ceil($total_row_cnt/$row_cnt_per_page);
		$page_num_jump_to_prev = $page_num_begin_on_view - 1;
		if($total_page_cnt < $page_num_end_on_view) {
			$page_num_jump_to_next = -1;
			$page_num_end_on_view = $total_page_cnt + 1;
		} else {
			$page_num_jump_to_next = $page_num_end_on_view;									
		}
		$page_num_last = $total_page_cnt;		

		$pagenation = 
		[
			"PAGE_NUM"=>$cursor_page_num,
			"ROW_CNT"=>$row_cnt_per_page,
			"PAGE_ROW_CNT"=>$page_row_cnt_on_pagination,
			"TOTAL_ROW_CNT"=>$total_row_cnt,
			"CURSOR_PAGE_NUM"=>$cursor_page_num,
			"ROW_CNT_PER_PAGE"=>$row_cnt_per_page,
			"PAGE_CNT_ON_PAGINATION"=>$page_row_cnt_on_pagination,
			"TOTAL_PAGE_CNT"=>$total_page_cnt,
			"PAGE_NUM_BEGIN_ON_VIEW"=>$page_num_begin_on_view,
			"PAGE_NUM_END_ON_VIEW"=>$page_num_end_on_view,
			"PAGE_NUM_JUMP_TO_PREV"=>$page_num_jump_to_prev,
			"PAGE_NUM_JUMP_TO_NEXT"=>$page_num_jump_to_next,
			"PAGE_NUM_LAST"=>$page_num_last
		];

		return $pagenation;
	}		

}