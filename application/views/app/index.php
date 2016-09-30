<html>
<head>

    <base href="/">

    <title>CafeClass</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="favicon.ico" rel="icon" type="image/x-icon"/>

    <script src="node_modules/core-js/client/shim.min.js"></script>
    <script src="node_modules/zone.js/dist/zone.js"></script>
    <script src="node_modules/reflect-metadata/Reflect.js"></script>
    <script src="node_modules/systemjs/dist/system.src.js"></script>

    <script src="systemjs.config.js"></script>

    <link rel="stylesheet" href="style.css">

    <script>
      System.import('app').catch(function(err){ console.log(err);console.error(err); });
    </script>

</head>

<body>
    <my-app>Loading...</my-app>
</body>

</html>