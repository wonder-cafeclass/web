<?php

class KlassNStudent {

        public $id=-1;
        public $klass_id=-1;
        public $user_id=-1;
        public $status="";
        public $date_created="";
        public $date_updated="";

        public $klass=null;
        public $user=null;
        public $teacher=null;

        public $attendance_total_cnt=-1;
        public $attendance_presence_cnt=-1;
        public $attendance_ready_cnt=-1;
        public $attendance_absence_cnt=-1;

        public $payment_import_cnt=-1;

        public $receipt_url="";

}