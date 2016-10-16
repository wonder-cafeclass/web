<?php

class CClass {

        public $id;
        // 수업이름
        public $title;
        // 수업설명
        public $desc;
        // 시작날짜
        public $date_begin;
        // 시작시간
        public $time_begin;
        // 시작시간 이미지
        public $time_begin_name;
        // 시작시간 이미지
        public $time_begin_img_url;
        // 수업시간
        public $time_duration;
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
        // 수업최소 월 단위
        public $month_min;
        // 수업최장 월 단위
        public $month_max;
        // 수업요일
        public $days;
        // 수업요일 - ENG
        public $days_eng;
        // 수업요일 - KOR
        public $days_kor;
        // 수업요일 이미지
        public $days_img_url;
        // 주당수업횟수
        public $class_day_per_week;
        // 수업장소 - 화면에 표시될 이름
        public $venue;
        // 수업장소 - 지하철 역
        public $venue_subway_station;
        // 수업장소 이미지 - 지하철 역
        public $venue_subway_station_img_url;
        // 수업장소 - 카페
        public $venue_cafe;
        // 수업장소 이미지 - 카페
        public $venue_cafe_logo_img_url;
        // 수업장소링크
        public $venue_link;
        // 검색태그
        public $search_tag;
        // 가격
        public $price;
        // 가격 - 포맷적용
        public $price_with_format;
        // 수업운영상태
        public $class_status;
        // 이미지 링크    
        public $class_img_url;

        /*
        public function get_time_begin_name($const_map=null, $time_begin="")
        {
                if(!isset($const_map)) 
                {
                        return;
                }
                if(!isset($this->time_begin)) 
                {
                        return;
                }

                $military_hours = date("H", strtotime($time_begin));
                $time_begin_name = "";
                if(6 <= $military_hours && $military_hours < 12) 
                {
                        // 오전
                        $this->time_begin_name = $class_time_list[0];
                } 
                else if(12 <= $military_hours && $military_hours < 14) 
                {
                        // 점심
                        $this->time_begin_name = $class_time_list[1];
                }
                else if(14 <= $military_hours && $military_hours < 18) 
                {
                        // 오후
                        $this->time_begin_name = $class_time_list[2];
                }
                else if(18 <= $military_hours && $military_hours < 20) 
                {
                        // 저녁
                        $this->time_begin_name = $class_time_list[3];
                }
        }
        */

        public function time_begin_img_url($const_map=null)
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
                $time_begin = $this->time_begin;

                $military_hours = date("H", strtotime($time_begin));
                $class_times_list = $const_map->{"class_times_list"};
                $class_times_img_url_list = $const_map->{"class_times_img_url_list"};

                if(6 <= $military_hours && $military_hours < 12) 
                {
                        // 오전
                        $this->time_begin_name = $class_times_list[1];
                        $this->time_begin_img_url = $class_times_img_url_list[1];
                } 
                else if(12 <= $military_hours && $military_hours < 14) 
                {
                        // 점심
                        $this->time_begin_name = $class_times_list[2];
                        $this->time_begin_img_url = $class_times_img_url_list[2];
                }
                else if(14 <= $military_hours && $military_hours < 18) 
                {
                        // 오후
                        $this->time_begin_name = $class_times_list[3];
                        $this->time_begin_img_url = $class_times_img_url_list[3];
                }
                else if(18 <= $military_hours && $military_hours < 20) 
                {
                        // 저녁
                        $this->time_begin_name = $class_times_list[4];
                        $this->time_begin_img_url = $class_times_img_url_list[4];
                }
                else 
                {
                        // TODO - Show Error - 지정된 시간이 없음.
                        $this->time_begin_name = $class_times_list[0];
                        $this->time_begin_img_url = $class_times_img_url_list[0];
                }
        }

        public function level_img_url($const_map=null)
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
        } 

        public function days_img_url($const_map=null)
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
        }  

        public function venue_subway_station_img_url($const_map=null)
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
                        $this->venue_subway_station_img_url = $class_venue_subway_station_img_url_list[0];
                }
                else
                {
                        // 선택한 항목이 없다. 기본 이미지를 돌려준다.
                        $this->venue_subway_station_img_url = $class_venue_subway_station_img_url_list[$idx_selected];
                }
        }   

        public function venue_cafe_logo_img_url($const_map=null)
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
        } 

        public function price_with_format()
        {
                if(!isset($this->price)) 
                {
                        return;
                }
                $this->price_with_format = number_format($this->price);
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