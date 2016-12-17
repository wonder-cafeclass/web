<?php

require APPPATH . '/models/KlassPrice.php';
require APPPATH . '/models/KlassTeacher.php';

class KlassCourse {

        // 수업 id
        public $id;

        // 선생님 obj / class KlassTeacher
        public $teacher; 

        // 선생님 id
        public $teacher_id;
        // 수업 담당 선생님의 이력
        public $teacher_resume;
        // 수업 담당 선생님의 인사말
        public $teacher_greeting;

        // 수업 리뷰
        public $review_list;
        // 수업 문의
        public $question_list;

        // 수업이름
        public $title;
        // 수업설명
        public $desc;
        // 수업특징
        public $feature;
        // 수업대상
        public $target;
        // 수업일정
        public $schedule;
        // 시작날짜
        public $date_begin;
        // 시작시간
        public $time_begin;
        // 시작시간 이름
        public $time_begin_name;
        // 시작시간 이름 - 영어
        public $time_begin_name_eng;
        // 시작시간 이름 - 한국어
        public $time_begin_name_kor;
        // 시작시간 이미지
        public $time_begin_img_url;
        // 수업시간
        public $time_duration_minutes;
        // 종료시간
        public $time_end;
        // 난이도
        public $level;
        // 난이도 - ENG
        public $level_eng;
        // 난이도 - KOR
        public $level_kor;
        // 난이도 이미지
        public $level_img_url;
        // 수업최소 주 단위
        public $week_min;
        // 수업최장 주 단위
        public $week_max;
        // 4주당 수업 주 단위 리스트
        public $week_list;
        // 수업최소 월 단위
        public $month_min;
        // 수업최장 월 단위
        public $month_max;
        // 수업요일
        public $days;
        // 수업요일 리스트
        public $days_list;
        // 수업요일 - ENG
        public $days_eng;
        // 수업요일 - KOR
        public $days_kor;
        // 수업요일 이미지
        public $days_img_url;
        // 주당수업횟수
        public $class_day_per_week;

        // 수업장소 - 화면에 표시될 이름 / @ Deprecated
        public $venue;
        // 수업장소 - 지하철 역 / @ Deprecated
        public $venue_subway_station;
        // 수업장소 이미지 - 지하철 역 / @ Deprecated
        public $venue_subway_station_img_url;
        // 수업장소 - 카페 / @ Deprecated
        public $venue_cafe;
        // 수업장소 이미지 - 카페 / @ Deprecated
        public $venue_cafe_logo_img_url;
        // 수업장소링크 / @ Deprecated
        public $venue_map_link;

        // 수업장소 - 이름
        public $venue_title;
        // 수업장소 - 전화번호
        public $venue_telephone;
        // 수업장소 - 주소
        public $venue_address;
        // 수업장소 - 도로명 주소
        public $venue_road_address;
        // 수업장소 - 경도
        public $venue_latitude;
        // 수업장소 - 위도
        public $venue_longitude;

        // 검색태그
        public $search_tag;
        // 가격
        public $price;
        // 가격 관련 KlassPrice List
        public $klass_price_list;
        // 할인된 가격의 배열
        public $price_list_width_discount;
        // 가격 할인 문자열
        public $discount;
        // 가격 할인 배열
        public $discount_arr;
        // 4주당 가격리스트 
        public $price_list;
        // 4주당 가격과 타이틀 리스트
        public $weekly_price_list;
        // 가격 - 포맷적용
        public $price_with_format;
        // 수업운영상태
        public $class_status;
        // 수업 신청 타입
        public $enrollment_interval_week;
        // 이미지 링크
        public $class_poster_url;
        // 이미지 링크
        public $class_poster_url_loadable;
        // 배너 이미지 링크
        public $class_banner_url;
        // 이미지 에러 링크    
        public $class_img_err_url;
        // 클래스 캘린더 리스트 (Linear) - Calendar[][]
        public $calendar_table_linear;
        // 클래스 캘린더 리스트 (Monthly) - Calendar[][][]
        public $calendar_table_monthly;

        public function time_begin_img_url($const_map=null, $my_path=null)
        {
                if(!isset($const_map)) 
                {
                        return;
                }
                if(!isset($const_map->{"class_times_list"})) 
                {
                        return;
                }
                if(!isset($const_map->{"class_times_img_url_list"})) 
                {
                        return;
                }
                if(!isset($this->time_begin)) 
                {
                        return;
                }
                if(!isset($my_path)) 
                {
                        return;
                }

                $time_begin = $this->time_begin;

                $military_hours = date("H", strtotime($time_begin));
                $class_times_list = $const_map->{"class_times_list"};
                $class_times_eng_list = $const_map->{"class_times_eng_list"};
                $class_times_kor_list = $const_map->{"class_times_kor_list"};
                $class_times_img_url_list = $const_map->{"class_times_img_url_list"};

                if(6 <= $military_hours && $military_hours < 12) 
                {       
                        // 오전
                        $target_idx = 1;
                } 
                else if(12 <= $military_hours && $military_hours < 14) 
                {
                        // 점심
                        $target_idx = 2;
                }
                else if(14 <= $military_hours && $military_hours < 18) 
                {
                        // 오후
                        $target_idx = 3;
                }
                else if(18 <= $military_hours && $military_hours < 20) 
                {
                        // 저녁
                        $target_idx = 4;
                }
                else 
                {
                        // TODO - Show Error - 지정된 시간이 없음.
                        $target_idx = 0;
                }

                $this->time_begin_name = $class_times_list[$target_idx];
                $this->time_begin_name_eng = $class_times_eng_list[$target_idx];
                $this->time_begin_name_kor = $class_times_kor_list[$target_idx];
                $this->time_begin_img_url = $class_times_img_url_list[$target_idx];

                if(!empty($this->time_begin_img_url))
                {
                        $this->time_begin_img_url = $my_path->get($this->time_begin_img_url);
                }
        }

        public function level_img_url($const_map=null, $my_path=null)
        {
                if(!isset($const_map)) 
                {
                        return;
                }
                if(!isset($const_map->{"class_level_list"})) 
                {
                        return;
                }
                if(!isset($const_map->{"class_level_eng_list"})) 
                {
                        return;
                }
                if(!isset($const_map->{"class_level_kor_list"})) 
                {
                        return;
                }
                if(!isset($const_map->{"class_level_img_url_list"})) 
                {
                        return;
                }
                if(!isset($this->level)) 
                {
                        return;
                }
                if(!isset($my_path)) 
                {
                        return;
                }

                $class_level = $this->level;

                $class_level_list = $const_map->{"class_level_list"};

                $idx_selected = -1;
                for ($i=0; $i < count($class_level_list); $i++) 
                {
                        $cur_class_level = $class_level_list[$i];
                        if(!empty($cur_class_level) && $cur_class_level === $class_level) 
                        {
                                $idx_selected = $i;
                                break;
                        }
                }
                $class_level_eng_list = $const_map->{"class_level_eng_list"};
                $class_level_kor_list = $const_map->{"class_level_kor_list"};
                $class_level_img_url_list = $const_map->{"class_level_img_url_list"};

                if(!(0 < $idx_selected)) 
                {
                        // 선택한 항목이 없다. 기본 이미지를 돌려준다.
                        $this->level_eng = $class_level_eng_list[0];
                        $this->level_kor = $class_level_kor_list[0];
                        $this->level_img_url = $class_level_img_url_list[0];
                }
                else
                {
                        // 선택한 항목이 없다. 기본 이미지를 돌려준다.
                        $this->level_eng = $class_level_eng_list[$idx_selected];
                        $this->level_kor = $class_level_kor_list[$idx_selected];
                        $this->level_img_url = $class_level_img_url_list[$idx_selected];
                }

                if(!empty($this->level_img_url))
                {
                        $this->level_img_url = $my_path->get($this->level_img_url);
                }
        } 

        public function set_days_list($const_map=null)
        {
                if(empty($this->days))
                {
                        return;
                }
                if(!isset($const_map)) 
                {
                        return;
                }
                if(!isset($const_map->{"class_days_list"})) 
                {
                        return;
                }

                $class_days = $this->days;
                $class_days_list = $const_map->{"class_days_list"};

                // "|"로 구분된 요일 정보를 분리해서 전달한다.
                $days_list = explode("|", $class_days);

                // 요일들의 유효성을 검사한다.
                $class_day_map = array();
                for ($i=0; $i < count($class_days_list); $i++) { 
                        $class_day = $class_days_list[$i];
                        $class_day_map[$class_day] = $class_day;
                }
                $is_valid = true;
                for ($i=0; $i < count($class_days_list); $i++) {
                        $class_day = $class_days_list[$i];
                        if(!isset($class_day_map[$class_day]))
                        {
                                $is_valid = false;
                        }
                }
                if(!$is_valid)
                {
                        return;
                }

                // 유효성 검증 완료! 데이터를 저장합니다.
                $this->days_list = $days_list;

        }

        public function days_img_url($const_map=null, $my_path=null)
        {
                if(!isset($const_map)) 
                {
                        return;
                }
                if(!isset($const_map->{"class_days_list"})) 
                {
                        return;
                }
                if(!isset($const_map->{"class_days_eng_list"})) 
                {
                        return;
                }
                if(!isset($const_map->{"class_days_kor_list"})) 
                {
                        return;
                }
                if(!isset($const_map->{"class_days_img_url_list"})) 
                {
                        return;
                }
                if(!isset($my_path)) 
                {
                        return;
                }
                if(!isset($this->days)) 
                {
                        return;
                }
                $class_days = $this->days;

                $class_days_list = $const_map->{"class_days_list"};
                
                $selected_idx_arr = array();
                for ($i=0; $i < count($class_days_list); $i++) 
                {
                        $cur_class_days = $class_days_list[$i];
                        if (strpos($class_days, $cur_class_days) !== false) 
                        {
                                array_push($selected_idx_arr, $i);
                        }
                }
                $class_days_eng_list = $const_map->{"class_days_eng_list"};
                $class_days_kor_list = $const_map->{"class_days_kor_list"};
                $class_days_img_url_list = $const_map->{"class_days_img_url_list"};

                // 수업 요일이 주당 2일 이상으로 변경될 가능성을 고려, 설계한다.
                for ($i=0; $i < count($selected_idx_arr); $i++) 
                {
                        $selected_idx = $selected_idx_arr[$i];

                        if(empty($this->days_eng)) {
                                $this->days_eng = $class_days_eng_list[$selected_idx];
                        } else {
                                $this->days_eng .= "|".$class_days_eng_list[$selected_idx];
                        }
                        if(empty($this->days_kor)) {
                                $this->days_kor = $class_days_kor_list[$selected_idx];
                        } else {
                                $this->days_kor .= "|".$class_days_kor_list[$selected_idx];
                        }
                        if(empty($this->days_img_url)) {
                                $this->days_img_url = $class_days_img_url_list[$selected_idx];
                        } else {
                                $this->days_img_url .= "|".$class_days_img_url_list[$selected_idx];
                        }
                }

                // 이미지가 여러개일 경우의 문제있음.
                if(!empty($this->days_img_url))
                {
                        $this->days_img_url = $my_path->get($this->days_img_url);
                }
        }  

        public function venue_subway_station_img_url($const_map=null, $my_path=null)
        {
                if(!isset($const_map)) 
                {
                        return;
                }
                if(!isset($const_map->{"class_venue_subway_station_list"})) 
                {
                        return;
                }
                if(!isset($const_map->{"class_venue_subway_station_img_url_list"})) 
                {
                        return;
                }
                if(!isset($my_path)) 
                {
                        return;
                }
                if(!isset($this->venue_subway_station)) 
                {
                        return;
                }
                $venue_subway_station = $this->venue_subway_station;

                $class_venue_subway_station_list = $const_map->{"class_venue_subway_station_list"};
                
                $idx_selected = -1;
                for ($i=0; $i < count($class_venue_subway_station_list); $i++) 
                {
                        $cur_class_venue_station = $class_venue_subway_station_list[$i];
                        if(!empty($cur_class_venue_station) && $cur_class_venue_station === $venue_subway_station) 
                        {
                                $idx_selected = $i;
                                break;
                        }
                }
                $class_venue_subway_station_img_url_list = $const_map->{"class_venue_subway_station_img_url_list"};

                if(!(0 < $idx_selected)) 
                {
                        // 선택한 항목이 없다. 기본 이미지를 돌려준다.
                        $this->venue_subway_station_img_url = 
                        $class_venue_subway_station_img_url_list[0];
                }
                else
                {
                        // 선택한 항목이 없다. 기본 이미지를 돌려준다.
                        $this->venue_subway_station_img_url = 
                        $class_venue_subway_station_img_url_list[$idx_selected];
                }

                if(!empty($this->venue_subway_station_img_url))
                {
                        $this->venue_subway_station_img_url = $my_path->get($this->venue_subway_station_img_url);
                }
        }   

        public function venue_cafe_logo_img_url($const_map=null, $my_path=null)
        {
                if(!isset($const_map)) 
                {
                        return;
                }
                if(!isset($const_map->{"class_venue_cafe_list"})) 
                {
                        return;
                }
                if(!isset($const_map->{"class_venue_cafe_img_url_list"})) 
                {
                        return;
                }
                if(!isset($my_path)) 
                {
                        return;
                }
                if(!isset($this->venue_cafe)) 
                {
                        return;
                }
                $venue_cafe = $this->venue_cafe; 
                
                $class_venue_cafe_list = $const_map->{"class_venue_cafe_list"};
                
                $idx_selected = -1;
                for ($i=0; $i < count($class_venue_cafe_list); $i++) 
                {
                        $cur_class_venue_cafe = $class_venue_cafe_list[$i];
                        if(!empty($cur_class_venue_cafe) && $cur_class_venue_cafe === $venue_cafe) 
                        {
                                $idx_selected = $i;
                                break;
                        }
                }
                $class_venue_cafe_img_url_list = $const_map->{"class_venue_cafe_img_url_list"};

                if(!(0 < $idx_selected)) 
                {
                        // 선택한 항목이 없다. 기본 이미지를 돌려준다.
                        $this->venue_cafe_logo_img_url = $class_venue_cafe_img_url_list[0];
                }
                else
                {
                        // 선택한 항목이 없다. 기본 이미지를 돌려준다.
                        $this->venue_cafe_logo_img_url = $class_venue_cafe_img_url_list[$idx_selected];
                }

                if(!empty($this->venue_cafe_logo_img_url))
                {
                        $this->venue_cafe_logo_img_url = $my_path->get($this->venue_cafe_logo_img_url);
                }
        } 

        public function price_with_format()
        {
                if(!isset($this->price)) 
                {
                        return;
                }
                $this->price_with_format = number_format($this->price);
        }              

        public function set_klass_price_list()
        {
                if(!isset($this->price)) 
                {
                        return;
                }
                if(!isset($this->discount)) 
                {
                        return;
                }

                $discounts = explode("|",$this->discount);
                if(empty($discounts))
                {
                        return;
                }
                $basic_weeks = 4;

                $price_per_4week = floor(intval($this->price) / $basic_weeks);
                $week_min = intval($this->week_min);
                $week_max = intval($this->week_max);
                $week_diff = $week_max - $week_min;
                $week_diff = floor($week_diff/$basic_weeks);

                $klass_price_list = array();
                for ($i=0; $i <= $week_diff; $i++) { 

                        $weeks = $basic_weeks * ($i + 1);
                        // 할인 가격 배열에 할인 가격 정보가 없다면 할인이 없는 것으로 처리.
                        $discount = 0;
                        if($i < (count($discounts))) {
                                $discount = intval($discounts[$i]);
                        }

                        $klassPrice = new KlassPrice($weeks, $price_per_4week, $discount);
                        array_push($klass_price_list, $klassPrice);
                }
                $this->klass_price_list = $klass_price_list;
        }

        public function weeks_to_months()
        {
                if(!isset($this->week_min)) 
                {
                        return;
                }
                if(!isset($this->week_max)) 
                {
                        return;
                }

                $this->month_min = round($this->week_min/4, 1);
                $this->month_max = round($this->week_max/4, 1);
        }              


        public function __set($name, $value)
        {
                // Do nothing...
        }

        public function __get($name)
        {
                if (isset($this->$name))
                {
                        return $this->$name;
                }
        }
}