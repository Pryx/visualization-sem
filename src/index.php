<?php
/*This constant is replaced by build system*/
define('SEM_VIZ_VER', '1.0.0');
?>
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Visualization semestral work</title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="manifest" href="site.webmanifest">
  <link rel="apple-touch-icon" href="icon.png">

  <link rel="stylesheet" href="css/normalize.css">
  <link rel="stylesheet" href="css/main.css">
</head>

<body>
  <!--
    Nobody should be using IE on mobile... :)
  -->
  <!--[if IE]>
    <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience and security.</p>
  <![endif]-->

  <noscript>
    <!--
      We do not work without JS, so warn anyone with it disabled
    -->
    <section id="nojs" class="wizard">
      <div class="wizard-wrapper">
        <div class="slide slide-nr0">
          <div class="padded-wrap">
            <h2>Javascript disabled!</h2>
            <p>This app needs javascript to work properly. Please enable it and try again.</p>
            <a class="btn btn-next error" href="./">Reload</a>
          </div>
        </div>
      </div>
    </section>
  </noscript>

  <main id="main">
    <header><h1>Test</h1> <input type="file" id="file-selector" accept=".json"><button type="button" id="read">Load file</button></header>
    <div id="viz_container">
      <canvas id="canvas" style="height: 100%; width: 100%"></canvas>
    </div>
  </main>

  <!-- END OF APP; SCRIPT LOADING-->
  <script src="js/viz-sem.min.js?ver=<?php echo SEM_VIZ_VER; ?>"></script>
  <link href="https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto:400,700&amp;subset=latin-ext" rel="stylesheet">
</body>

</html>