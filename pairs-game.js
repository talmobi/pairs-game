var pairsGame = {
  init: function(canvasId) {
    console.log("initializing game.");

    var size = 480;
    var width = size;
    var height = width * 9 / 16;
    var canvas = document.getElementById(canvasId);

    if (!canvas) {
      return console.log("No canvas specified.");
    }

    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext('2d');
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

    var sheet = new Image();
    sheet.src = 'midora_icons_by_jiang_at_pixeljoint.png';

    var loading = true;
    var 

    function getElementPosition(element) {
      var xPos = 0;
      var yPos = 0;

      while (element) {
        xPos += element.offsetLeft - element.scrollLeft + element.clientLeft;
        yPos += element.offsetTop - element.scrollTop + element.clientTop;
        element = element.offsetParent;
      }

      return { x: xPos, y: yPos };
    }

    var loadingCounter = 0;
    var loadingStrings = ['Loading', 'Loading.', 'Loading..', 'Loading...'];

    (function animateLoadingScreen() {
      if (loading) {
        cls();
        ctx.fillStyle = 'white';
        var pos = getElementPosition(canvas);
        ctx.fillText( loadingStrings[loadingCounter++ % loadingStrings.length], pos.x + 10, pos.y + 10);
        setTimeout(animateLoadingScreen, 300);
      } else {
        cls();
        var pos = getElementPosition(canvas);
        ctx.fillText( 'Loading Complete!', pos.x + 10, pos.y + 10);

        //ctx.drawImage(sheet,0,0,sheet.width*2, sheet.height*2);
        drawIcon(icons[loadingCounter++ % icons.length], 40, 80);
        setTimeout(animateLoadingScreen, 300);
      }
    })();

    var icons = [];

    sheet.onload = function() {
      // loading finished
      setTimeout(function() {
        loading = false;

        var s = 24; // size of icon (24x24)

        var w = (sheet.width / s) | 0;
        var h = (sheet.height / s) | 0;

        for (var i = 0; i < w; i++) {
          for (var j = 0; j < h; j++) {
            icons[i + j * 10] = { x: s * i, y: s * j, w: s, h: s };
          }
        }
      }, 1000)
    }

    function drawIcon(icon, x, y) {
      ctx.drawImage(sheet, icon.x, icon.y, icon.w, icon.h, x, y, icon.w, icon.h);
    }

  }
};