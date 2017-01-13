<?php

class KlassPrice {
// REMOVE ME
/*
        public $weeks;
        public $price_per_week;
        public $price;
        public $price_with_format;
        public $discount;
        public $discount_with_format;
        public $discounted_price;
        public $discounted_price_with_format;
        public $percentage;

        function __construct($weeks=-1, $price_per_week=-1, $discount=-1) 
        {
                if($weeks < 0) 
                {
                        return;
                }
                if(0 != $weeks%4) 
                {
                        // 4주 단위만 허용합니다.
                        return;
                }
                if($price_per_week < 0) 
                {
                        return;
                }

                $this->weeks=$weeks; 
                $this->price_per_week=$price_per_week;

                $this->price=$this->weeks * $this->price_per_week; 
                $this->price_with_format = number_format($this->price);

                $this->discount=$discount; 
                $this->discount_with_format = number_format($this->discount);

                $this->discounted_price=$this->price - $this->discount;
                $this->discounted_price_with_format = number_format($this->discounted_price);

                $this->percentage = 0;

                if(0 < $this->discounted_price && 0 < $this->price)
                {
                        $this->percentage = floor(($this->discounted_price/$this->price)*100)/10;
                }
        }
*/
}