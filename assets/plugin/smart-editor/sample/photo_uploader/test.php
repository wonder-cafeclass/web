<?php
// Cafeclass custom
include_once("thumb_maker.php");

// $result = ThumbMaker::get_thumb_service_path();
// echo "\$result : $result<br/>";

$mobile_width_iphone5 = 300;
$result = ThumbMaker::make_thumbnail("/Library/WebServer/Documents/cafeclass/assets/plugin/smart-editor/upload/test.jpg",$mobile_width_iphone5);
print_r($result);
echo "<br/>";

?>