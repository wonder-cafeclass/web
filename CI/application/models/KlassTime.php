<?php

class KlassTime {
        public $key;
        public $name_eng;
        public $name_kor;
        public $img_url;
        public $hh_mm;

        function __construct($key="", $name_eng="", $name_kor="", $img_url="", $hh_mm="") {
                $this->key=$key; 
                $this->name_eng=$name_eng; 
                $this->name_kor=$name_kor; 
                $this->img_url=$img_url;
                $this->hh_mm=$hh_mm;
        }
}