<?php

require APPPATH . '/models/KlassTeacher.php';

class KlassCourse {

        // 수업 id
        public $id=-1;

        // 선생님 obj / class KlassTeacher
        public $teacher=null; 

        // 선생님 id
        public $teacher_id=-1;
        // 수업 담당 선생님의 이력
        public $teacher_resume="";
        // 수업 담당 선생님의 인사말
        public $teacher_greeting="";

        // 수업 리뷰
        public $review_list=[];
        // 수업 문의
        public $question_list=[];

        // 수업 리뷰 숫자
        public $review_cnt=-1;
        // 수업 문의 숫자
        public $question_cnt=-1;

        // 수업이름
        public $title="";
        // 수업설명
        public $desc="";
        // 수업타입
        public $type="";
        // 수업특징
        public $feature="";
        // 수업대상
        public $target="";
        // 수업일정
        public $schedule="";
        // 시작날짜
        public $date_begin="";
        // 시작시간
        public $time_begin="";
        // 시작시간 이름
        public $time_begin_name="";
        // 시작시간 이름 - 영어
        public $time_begin_name_eng="";
        // 시작시간 이름 - 한국어
        public $time_begin_name_kor="";
        // 시작시간 이미지
        public $time_begin_img_url="";
        // 수업시간
        public $time_duration_minutes=-1;
        // 종료시간
        public $time_end="";
        // 난이도
        public $level="";
        // 난이도 - ENG
        public $level_eng="";
        // 난이도 - KOR
        public $level_kor="";
        // 난이도 이미지
        public $level_img_url="";
        // 수업 주 단위
        public $week=-1;
        // 수업요일
        public $days="";
        // 수업요일 리스트
        public $days_list=[];
        // 수업요일 - ENG
        public $days_eng="";
        // 수업요일 - KOR
        public $days_kor="";
        // 수업요일 이미지
        public $days_img_url="";

        // 수업장소 - 지하철 노선
        public $subway_line="";
        // 수업장소 - 지하철 역
        public $subway_station="";
        // 수업장소 - 지하철 역 이미지
        public $subway_station_img="";

        // 수업장소 - 이름
        public $venue_title="";
        // 수업장소 - 전화번호
        public $venue_telephone="";
        // 수업장소 - 주소
        public $venue_address="";
        // 수업장소 - 도로명 주소
        public $venue_road_address="";
        // 수업장소 - 경도
        public $venue_latitude="";
        // 수업장소 - 위도
        public $venue_longitude="";

        // 4주당 수업 가격
        public $price=-1;
        // 가격 - 포맷적용
        public $price_with_format="";

        // 수업에 참여할 수 있는 학생수
        public $student_cnt=-1;

        // 수업운영상태
        public $status="";

        // 이미지 링크
        public $class_poster_url="";
        // 이미지 링크
        public $class_poster_url_loadable="";
        // 배너 이미지 링크
        public $class_banner_url="";
        // 이미지 에러 링크    
        public $class_img_err_url="";
        // 클래스 캘린더 리스트 (Linear) - Calendar[][]
        public $calendar_table_linear=null;
        // 클래스 캘린더 리스트 (Monthly) - Calendar[][][]
        public $calendar_table_monthly=null;

        // 수업 참여 학생 통계 리스트 
        public $klass_n_student_list;

        // 수업 출석 테이블 / 날짜순 정렬 
        public $klass_attendance_table;

        public $delimiter="|||";

        // REFACTOR ME - 몇 군데에서 사용중.
        // @ Deprecated
        // @ Desc : 수업 요일 검색을 위한 맵 객체를 만들어 반환합니다.
        public function get_days_map()
        {
                $days_list = [];
                if(empty($this->days_list)) 
                {
                        $days_list = $this->days_list = explode($this->delimiter, $this->days);
                }
                $days_map = [];
                for ($i=0; $i < count($days_list); $i++) 
                {
                        $day = $days_list[$i];
                        $day = strtolower($day);
                        $days_map[$day] = $day;
                } // end for

                return $days_map;
        }

        public function is_class_day($day="")
        {
                if(empty($day)) 
                {
                        return false;
                }

                $days_list = $this->get_days_list();
                if(empty($days_list))
                {
                        return false;
                }

                for ($i=0; $i < count($days_list); $i++) 
                {
                        $day_from_list = $days_list[$i];
                        $day_from_list = strtolower($day_from_list);

                        $strpos = strpos(strtolower($day), $day_from_list);
                        if(-1 < $strpos) 
                        {
                                return true;
                        } // end if
                } // end for

                return false;
        }

        private function get_days_list()
        {
                if(!empty($this->days_list)) 
                {
                        return $this->days_list;
                }

                if(!empty($this->days))
                {
                        $this->days_list = explode($this->delimiter, $this->days);
                }

                return $this->days_list;
        }


 

  









}