<?php
// Cafeclass custom
// include_once("thumb_maker.php");

// http://devcafeclass.co.uk/assets/plugin/smart-editor/sample/photo_uploader/test.php

echo "TEST - 1<br/>";

$json_str = '{"access_token":"EAAXvZBHVXolIBAGpoCzTkIFSTRdZBHLEiScZBAMhCKmbZBErKrDRulcHN2rsmvz2pxlfqAcImN0k6wx1wxZCeMTTqBn6xMupErCutECvWACOIHn0cXXvqXqXHgf6tDC2aBTpFjV7HrzEWvxgtnLiPdb8iVZBnBjVwZD","token_type":"bearer","expires_in":5180116}';

$json_obj = json_decode($json_str);

if(isset($json_obj->access_token)) {
	echo "TEST - 2<br/>";	
}
echo "TEST - 3<br/>";	
// $result = ThumbMaker::get_thumb_service_path();
// echo "\$result : $result<br/>";

// $mobile_width_iphone5 = 300;
// $result = ThumbMaker::make_thumbnail("/Library/WebServer/Documents/cafeclass/assets/plugin/smart-editor/upload/test.jpg",$mobile_width_iphone5);
// print_r($result);
// echo "<br/>";

?>