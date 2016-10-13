<?php

class KlassKeyword {
        public $id;
        // 검색 키워드
        public $name;
        // 검색 키워드 이미지
        public $img_url;

        function __construct($id=-1, $name="", $img_url="") {
                $this->id = $id;
                $this->name = $name;
                $this->img_url = $img_url;
        }        

}