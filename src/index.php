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
  <link rel="stylesheet" href="css/all.css">

<!-- CSS only -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

<style type="text/css">
  #sidebar{
    border-radius:0;
    -webkit-box-shadow: -2px 0px 9px -2px rgba(0,0,0,0.75);
-moz-box-shadow: -2px 0px 9px -2px rgba(0,0,0,0.75);
box-shadow: -2px 0px 9px -2px rgba(0,0,0,0.75);
  }


.card-body{
    border-bottom: 1px solid rgba(0,0,0,.125);

}

.circle-color{

      height: 15px;
    width: 15px;
    border-radius: 15px;
    display: inline-block;
  
}

</style>

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


<!--PAGE START-->

  <main id="main">
    
    <div id="viz_container">
      <canvas id="canvas" style="height: 100vh; width: calc(100vw - 350px)"></canvas>
      <section style="width:350px; max-height:100%; position:absolute; top:0;right:0;">
        <div class="card" id="sidebar" style="height:100vh;">
          <div class="card-header">
            <i class="fas fa-file color-primary"></i> Select file
          </div>
          <div class="card-body">
            <div class="form-group row">
              <div class="custom-file">
                <input type="file" id="file-selector" accept=".json" class="custom-file-input">
                <label class="custom-file-label" for="customFile">Choose file</label>
              </div>
            </div>
            
            <button type="button" id="read" class="btn btn-primary btn-block">Load file</button>
          </div>
          <div class="card-body">
            <h5>Info about file</h5>
            Nodes: <span id="nodes-count" class="text-right">X</span>
            <br>
            Edges: <span id="edges-count" class="text-right">X</span>
          </div>

          <div class="card-header">
            <i class="fas fa-filter color-primary"></i> Choose Filter
          </div>


          <div class="card-body">
            <div class="input-group">
            <input type="text" class="form-control" placeholder="Node">
              <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" id="button-search">Search</button>
              </div>
            </div>


            </div>
          <div class="card-header">
            <i class="fas fa-type color-primary"></i> Node types
          </div>
          <div class="card-body">
            <div id="node-types">
            </div>


            <input type="checkbox">Draw everything
            <input type="checkbox" id="node_labels">Show node labels
            <input type="checkbox" id="edge_labels">Show edge labels
          </div>

        </div>
      </section>

      <div style="width:30px;  position:absolute; top:10px;right:370px;">
        <button class="btn btn-outline-primary" style="margin-bottom: 5px;" id="zoom-up"><i class="fas fa-plus"></i></button>
        <br>
        <button class="btn btn-outline-primary" id="zoom-down"><i class="fas fa-minus"></i></button>
      </div>

    </div>
  </main>

  <!-- END OF APP; SCRIPT LOADING-->
<!-- JS, Popper.js, and jQuery -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>


  <script src="js/viz-sem.min.js?ver=<?php echo SEM_VIZ_VER; ?>"></script>
  <link href="https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto:400,700&amp;subset=latin-ext" rel="stylesheet">
</body>

</html>