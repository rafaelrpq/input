var dpad, joy, buttons, start;

var player;

var run, gameloop, paused;

function audioLoop (bgSound) {
    var audio = new Audio (bgSound);
    audio.addEventListener ('timeupdate', function () {
        var buffer = .5;
        if (this.currentTime > this.duration - buffer) {
            this.currentTime = 0;
            this.play ();
        }
    });
    audio.play ();
}

document.addEventListener ('DOMContentLoaded', function (){
    console.log ('content loaded');

    if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))){
      document.write("not mobile device");
    }

    WIDTH  = 500;
    HEIGHT = 500;

    canvas = document.querySelector('canvas');
    ctx    = canvas.getContext ('2d');
    ctx.imageSmoothingEnabled = false;

    print = function (txt, x, y, color='#aaa') {
        ctx.save();
        ctx.fillStyle = color
        ctx.font = '16px bescii';
        ctx.fillText (txt, x, y);
        ctx.restore();
    }


    input = {
        joyX  : 0,
        joyY  : 0,
        START : document.querySelector ('start button'),
        Y     : document.querySelectorAll ('buttons button')[0],
        X     : document.querySelectorAll ('buttons button')[1],
        B     : document.querySelectorAll ('buttons button')[2],
        A     : document.querySelectorAll ('buttons button')[3],
    }

    start = document.querySelector('start button');

    buttons = document.querySelectorAll ('buttons button');

    input.Y.ontouchstart = function () {
        navigator.vibrate(10)
        player.w = (player.w < 128) ? player.w * 1.25 : player.w;
        player.h = (player.h < 128) ? player.h * 1.25 : player.h;
    }

    input.X.ontouchstart = function (e) {
        navigator.vibrate(10)
    }

    input.B.ontouchstart = function (e) {
        navigator.vibrate(10)
        player.w = (player.w > 32) ? player.w / 1.25 : player.w;
        player.h = (player.h > 32) ? player.h / 1.25 : player.h;
    }

    input.A.ontouchstart = function (e) {
        navigator.vibrate(10)
    }

    buttons.forEach (function (){
        this.oncontextmenu = function (e) {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation();
            return false;
        }
    })

    input.START.ontouchstart = function (e) {
        navigator.vibrate(10)
        if (run) {
            if (paused) {
                gameloop = setInterval (main, 1000/60);
                paused = false;
            } else {
                let msg = "[ PAUSE ]";
                let len = msg.length;
                print (msg, (WIDTH /2) - ((len / 2) * 16)+1  , (HEIGHT/2)+1, '#000');
                print (msg, (WIDTH /2) - ((len / 2) * 16)  , (HEIGHT/2), '#fa0');
                clearInterval (gameloop);
                paused = true;
            }
        } else {
            audioLoop ('assets/ghosthouse.ogg');
            gameloop = setInterval (main, 1000/60);
            paused = false;
            run = true;
        }
    }

    input.START.oncontextmenu = function (e) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation();
        return false;
    }

    dpad = document.querySelector ('controls dpad');
    joy  = document.querySelector ('controls dpad joy');

    var x=0, y=0;

    joy.ontouchstart = function (e) {
        initialX = Math.round (e.targetTouches[0].pageX);
        initialY = Math.round (e.targetTouches[0].pageY);
        joy.ontouchmove = function (e) {
            x = Math.round (e.targetTouches[0].pageX) - initialX;
            y = Math.round (e.targetTouches[0].pageY) - initialY;
            x = (x < -32) ? -32 : x;
            x = (x >  32) ?  32 : x;
            y = (y < -32) ? -32 : y;
            y = (y >  32) ?  32 : y;
            joy.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            input.joyX = x/8;
            input.joyY = y/8;
        }
    }

    joy.ontouchend = function () {
        joy.style.transform='translate3d(0px, 0px, 0)';
        input.joyX = 0;
        input.joyY = 0;
    }

    Type = {
        COLOR : 0,
        IMAGE : 1,
    }

    Direction = {
        UP    : 0,
        RIGHT : 1,
        DOWN  : 2,
        LEFT  : 3,
    }

    class Obj {
        x         = 0;
        y         = 0;
        w         = 0;
        h         = 0
        bg        = '';
        type      = '';
        direction = '';

        constructor (x, y, w, h, bg, type=Type.COLOR) {
            this.x    = x;
            this.y    = y;
            this.w    = w;
            this.h    = h;
            this.bg   = bg;
            this.type = type;
        }

        draw (bg=this.bg) {
            ctx.save ();
            switch (this.type) {
                case Type.COLOR :
                    ctx.fillStyle = bg;
                    ctx.fillRect (this.x, this.y, this.w, this.h);
                break;
                case Type.IMAGE :
                    let img = new Image ();
                    img.src = bg;
                    ctx.drawImage (img, this.x, this.y, this.w, this.h);
                break;
                default :
                    console.log('error');
            }
            ctx.restore ();
        }
    }

    class Player extends Obj {
        direction = '';
        draw (bg=this.bg) {
            ctx.save ();
            switch (this.type) {
                case Type.COLOR :
                    ctx.fillStyle = bg;
                    ctx.fillRect (this.x, this.y, this.w, this.h);
                break;

                case Type.IMAGE :
                    let img = new Image ();
                    img.src = bg;

                    switch (this.direction) {
                        case Direction.RIGHT :
                            // ctx.translate(0, 0);
                            ctx.scale(1, 1);
                            ctx.drawImage (img, this.x, this.y, this.w, this.h);
                        break;
                        case Direction.LEFT :
                            ctx.scale(-1, 1);
                            ctx.drawImage (img, -this.x-this.w, this.y, this.w, this.h);
                            ctx.scale(-1, 1);
                        break;

                        default:
                            ctx.drawImage (img, this.x, this.y, this.w, this.h);
                    }

                break;

                default :
                    console.log('error');
            }
            ctx.restore ();
        }

        move () {
            this.direction = (input.joyX < 0) ? Direction.LEFT : (input.joyX > 0) ? Direction.RIGHT : this.direction ;

            player.x += input.joyX;
            player.y += input.joyY;
            // player.x += (input.joyX == -32) ? -1 : (input.joyX == 32) ? 1 : 0;
            // player.y += (input.joyY == -32) ? -1 : (input.joyY == 32) ? 1 : 0;
        }
    }

    function borderDetect (obj) {
            obj.x = (obj.x < 0) ? 0 : obj.x;
            obj.y = (obj.y < 0) ? 0 : obj.y;
            obj.x = (obj.x > WIDTH  - obj.w) ? WIDTH  - obj.w : obj.x;
            obj.y = (obj.y > HEIGHT - obj.h) ? HEIGHT - obj.h : obj.y;

    }

    player = new Player (WIDTH/2, HEIGHT/2, 32, 32, 'assets/boo.png', Type.IMAGE);

    function updatePlayer () {
        player.move ();
        borderDetect (player);
        player.draw ();
    }

    var bg = new Image ();
    bg.src = 'assets/Ghost House.png';

   drawBG = () => {
        ctx.save ();
        ctx.drawImage (bg, 0, 0, WIDTH, HEIGHT);
        ctx.restore ();
   }

    function main () {
        ctx.clearRect (0,0, WIDTH, HEIGHT);
        drawBG ();
        updatePlayer ();
        print (`vel x  : ${(input.joyX).toFixed(1).toString().padStart(4,' ')}`,17, 17, '#a00');
        print (`vel x  : ${(input.joyX).toFixed(1).toString().padStart(4,' ')}`,16, 16);
        print (`vel y  : ${(input.joyY).toFixed(1).toString().padStart(4,' ')}`,17, 37, '#a00');
        print (`vel y  : ${(input.joyY).toFixed(1).toString().padStart(4,' ')}`,16, 36);
        // requestAnimationFrame (main);
    }

    function teste () {
        console.log ('teste');
    }



    // main ();

}, false)
