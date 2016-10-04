<?php
class Tests extends CI_Controller {

        public function __construct()
        {
                parent::__construct();

                // init database
                $this->load->database();

                // init unit test
                $this->load->library('unit_test');

                // init param checker
                $this->load->library('paramChecker');
        }

        public function index()
        {
                $data['news'] = $this->news_model->get_news();
        }

        public function paramcheck()
        {
                $report_list = array();

                // user
                // user.id
                $this->unit->run($this->paramchecker->is_ok("user_id", 0), false);
                array_push($report_list, $this->unit->report());

                // $this->unit->run($this->paramchecker->is_ok("user_id", 1), true);
                // $this->unit->run($this->paramchecker->is_ok("user_id", 2), true);
                // $this->unit->run($this->paramchecker->is_ok("user_id", 3), true);
                // $this->unit->run($this->paramchecker->is_ok("user_id", 4), true);

                // $this->unit->run($this->paramchecker->is_ok("user_id", (PHP_INT_MAX - 4)), true);
                // $this->unit->run($this->paramchecker->is_ok("user_id", (PHP_INT_MAX - 3)), true);
                // $this->unit->run($this->paramchecker->is_ok("user_id", (PHP_INT_MAX - 2)), true);
                // $this->unit->run($this->paramchecker->is_ok("user_id", (PHP_INT_MAX - 1)), true);
                // $this->unit->run($this->paramchecker->is_ok("user_id", PHP_INT_MAX), false);

        }
}