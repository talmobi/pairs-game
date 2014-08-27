var utils = {
  getElementPosition: function (element) {
    var xPos = 0;
    var yPos = 0;

    while (element) {
      xPos += element.offsetLeft - element.scrollLeft + element.clientLeft;
      yPos += element.offsetTop - element.scrollTop + element.clientTop;
      element = element.offsetParent;
    }

    return { x: xPos, y: yPos };
  }
}

var pairsGame = {
  init: function(canvasId) {
    console.log("initializing game.");

    var scale = 1;
    var size = 480 * scale;
    var width = size;
    var height = width * 9 / 16;
    var canvas = document.getElementById(canvasId);

    if (!canvas) {
      return console.log("No canvas specified.");
    }

    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    //ctx.scale(2,2); (bad blurry scaling)

    function cls() {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'white';
      ctx.rect(0, 0, width, height);
      ctx.stroke();
    }
    cls();

    // load assets
    var assets = {
      sheet: 'midora_icons_by_jiang_at_pixeljoint.png',
      bg: 'bg.png'
    }

    var assetsLength = 0;
    for (var k in assets) {
      assetsLength++;
    }

    var loading = true;
    var assetsCounter = 0;

    var loadingCounter = 0;
    var loadingStrings = ['Loading', 'Loading.', 'Loading..', 'Loading...'];

    (function animateLoadingScreen() {
      if (loading) {
        cls();
        ctx.fillStyle = 'white';
        var pos = utils.getElementPosition(canvas);
        ctx.fillText( loadingStrings[loadingCounter++ % loadingStrings.length], pos.x + 10, pos.y + 10);
        setTimeout(animateLoadingScreen, 300);
      } else {
        cls();
        var pos = utils.getElementPosition(canvas);
        ctx.fillText( 'Loading Complete!', pos.x + 10, pos.y + 10);

        drawImage(assets['bg'], 0, 0);

        //ctx.drawImage(sheet,0,0,sheet.width*2, sheet.height*2);
        //drawIcon(icons[loadingCounter++ % icons.length], 40, 80);
        drawIcon(icons[49], 40, 80);
        drawIcon(icons[0], 40, 80+2+24);
        drawIcon(icons[loadingCounter++ % icons.length], 40, 80+2+2+24*2);
        setTimeout(animateLoadingScreen, 300);
      }
    })();

    var sheet = null;
    var icons = [];

    for (var p in assets) {
      var img = new Image();
      img.src = assets[p];
      img.prop = p;
      img.onload = function() {
        assetsCounter++;
        //console.log(this.src);
        //console.log(this.prop);
        assets[this.prop] = this;
        console.log(assets[this.prop]);

        if (assetsCounter === assetsLength) {
          sheet = assets.sheet;

          loadIcons();

          loading = false;
        }
      }
    }

    function loadIcons() {
      var s = 24; // size of icon (24x24)

      var w = (sheet.width / s) | 0;
      var h = (sheet.height / s) | 0;

      for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
          icons[i + j * 10] = { x: s * i, y: s * j, w: s, h: s };
        }
      }
    }

    function drawIcon(icon, x, y) {
      ctx.drawImage(sheet, icon.x, icon.y, icon.w, icon.h, x * scale, y * scale, icon.w * scale, icon.h * scale);
    }

    function drawImage(image, x, y) {
      ctx.drawImage(assets['bg'], 0, 0, image.width, image.height, x * scale, y * scale, image.width * scale, image.height * scale);
    }

  }
};