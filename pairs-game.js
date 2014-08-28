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
  },
  shuffle: function(array) {
    for (var i = 0; i < array.length; i++) {
      var n = Math.random() * array.length | 0;
      var t = array[i];
      array[i] = array[n];
      array[n] = t;
    }
  }
}

var pairsGame = {
  init: function(canvasId) {
    console.log("initializing game.");

    var scale = 1;
    var iconScale = 2;
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
      bg: 'bg.png',
      sheet: 'midora_icons_by_jiang_at_pixeljoint.png'
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
        //drawIcon(icons[49], 40, 80);
        //drawIcon(icons[0], 40, 80+2+24);
        //drawIcon(icons[loadingCounter++ % icons.length], 40, 80+2+2+24*2);
        //setTimeout(animateLoadingScreen, 300);

        // load the icons we want to use
        while (map.length  < 10) {
          var n = Math.random() * icons.length | 0;

          if (n == 49) continue;
          var skip = false;
          for (var i = 0; i < map.length; i++) {
            if (map[i] == n)
              skip = true;
          }

          if (!skip)
            map.push(n);
        }

        // double the array and shuffle it
        map = map.concat(map);
        utils.shuffle(map);
        console.log(map);

        // initialize board
        rows = Math.sqrt(map.length) | 0;
        cols = (map.length / rows) | 0;
        for (var i = 0; i < map.length; i++) {
          board[i] = {
            icon: map[i],
            faceup: false,
            x: (i % cols) * 26,
            y: ((i / cols) | 0) * 26
          }
        }
        
        // draw board
        drawBoard();
      }
    })();

    var xoff = width / 8.5;
    var yoff = height / 16;
    //xoff = 0;
    //yoff = 0;

    var map = [];
    var rows;
    var cols;
    var board = [];

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
      ctx.drawImage(sheet, icon.x, icon.y, icon.w, icon.h, x * iconScale, y * iconScale, icon.w * iconScale, icon.h * iconScale);
    }

    function drawImage(image, x, y) {
      ctx.drawImage(assets['bg'], 0, 0, image.width, image.height, x * scale, y * scale, image.width * scale, image.height * scale);
    }

    var first = null;
    var second = null;

    var canClick = true;

    canvas.onclick = function(evt) {
      if (!canClick)
        return;

      // game logic lives here
      console.log("click");

      // target the clicked card
      var i = ((evt.layerX - xoff * iconScale) / (26 * iconScale)) | 0;
      var j = ((evt.layerY - yoff * iconScale) / (26 * iconScale)) | 0;

      console.log( i + ", " + j );

      var b = board[i + j * cols];

      if (b && !b.faceup) {
        if (!first) {
          first = b;
          b.faceup = !b.faceup;
          drawBoard();
        } else if (first && !second && b !== first) {
          second = b;
          b.faceup = !b.faceup;
          drawBoard();
          // time to show and calculate if twin cards were chosen.
          canClick = false;
          var sleep = 1500;
          if (first.icon === second.icon) {
            // twin cards
            console.log("Correct! 10 points!");
            sleep = 200;
          } else {
            // wrong cards were chosen
            console.log("Wrong, try again!");
            first.faceup = false;
            second.faceup = false;
          }

          setTimeout(function() {
            first = null;
            second = null;
            canClick = true;
            drawBoard();
          }, sleep);
        }
        
      }

      //drawBoard();


      // check if game is finished
      var finished = true;
      for (var i = 0; i < board.length; i++) {
        if (!board[i].faceup) {
          finished = false;
          break;
        }
      }

      if (finished) {
        console.log("Game Finsihed - you won!");
      }
    }

    function drawBoard() {
      drawImage(assets['bg'], 0, 0);

      for (var i = 0; i < board.length; i++) {
        var b = board[i];
        if (b.faceup)
          drawIcon( icons[b.icon], b.x + xoff, b.y + yoff);
        else
          drawIcon( icons[49], b.x + xoff, b.y + yoff);
      }
    }

  }
};