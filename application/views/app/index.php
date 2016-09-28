<?php

// angular 앱이 최상위 디렉토리가 아닌 경우의 상대 경로 파악.
function get_service_root_path($depth=0){
        
    $path = substr( __FILE__, strlen( $_SERVER[ 'DOCUMENT_ROOT' ] ) );
    $cur_file_name = __FILE__;
    $path_matches_group = array();
    preg_match_all('/[\.a-zA-Z0-9_-]+/', $path, $path_matches_group);
    $path_matches = $path_matches_group[0];

    $service_root_path = "";

    for($idx=0; $idx < (count($path_matches) - $depth); $idx++) {
        // 현재 파일의 위치(/${service_root}/util/xogames.param.manager.inc)를 반영하므로 
        // 2 depth 위쪽(/util/xogames.preprocessor.inc)의 위치를 
        // service_root_path로 지정합니다.
        $path_match = $path_matches[$idx];
        $service_root_path .= "/$path_match";
    }

    return $service_root_path;
}
$service_root_path = get_service_root_path(4);
?>
<html>
<head>

    <base href="/">

    <title>CafeClass</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="favicon.ico" rel="icon" type="image/x-icon"/>


    <?php
    if(!empty($service_root_path)) {
        // Polyfill(s) for older browsers
        echo "<script src=\"$service_root_path/node_modules/core-js/client/shim.min.js\"></script>";
        echo "<script src=\"$service_root_path/node_modules/zone.js/dist/zone.js\"></script>";
        echo "<script src=\"$service_root_path/node_modules/reflect-metadata/Reflect.js\"></script>";
        echo "<script src=\"$service_root_path/node_modules/systemjs/dist/system.src.js\"></script>";

        echo "<script src=\"$service_root_path/systemjs.config.js\"></script>";

        echo "<link rel=\"$service_root_path/stylesheet\" href=\"$service_root_path/styles.css\">";
    } else {
        // Polyfill(s) for older browsers
        echo "<script src=\"node_modules/core-js/client/shim.min.js\"></script>";
        echo "<script src=\"node_modules/zone.js/dist/zone.js\"></script>";
        echo "<script src=\"node_modules/reflect-metadata/Reflect.js\"></script>";
        echo "<script src=\"node_modules/systemjs/dist/system.src.js\"></script>";

        echo "<script src=\"systemjs.config.js\"></script>";

        echo "<link rel=\"stylesheet\" href=\"styles.css\">";
    }
    ?>
    <script>
      System.import('app').catch(function(err){ console.log(err);console.error(err); });
    </script>

</head>

<body>
    <my-app>Loading...</my-app>
</body>

</html>