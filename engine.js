var dpad, joy, buttons, start;

var player;

var run, paused;

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
        start : 0,
        A     : 0,
        B     : 0,
        X     : 0,
        Y     : 0,
    }

    start = document.querySelector('start button');

    buttons = document.querySelectorAll ('buttons button');

    buttons[0].ontouchstart = function () {
        input.Y = 1;
    }

    buttons[0].ontouchend = function () {
        input.Y = 0;
    };

    buttons[1].ontouchstart = function (e) {
        input.X = 1;
    }

    buttons[1].ontouchend = function () {
        input.X = 0;
    };

    buttons[2].ontouchstart = function (e) {
        input.B = 1;
    }

    buttons[2].ontouchend = function () {
        input.B = 0;
    };

    buttons[3].ontouchstart = function (e) {
        input.A = 1;
    }

    buttons[3].ontouchend = function () {
        input.A = 0;
    };

    buttons.forEach (function (){
        this.oncontextmenu = function (e) {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation();
            return false;
        }
    })

    start.ontouchstart = function (e) {
        input.start = 1;
    }

    start.ontouchend = function () {
        input.start = 0
    }

    start.oncontextmenu = function (e) {
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
            input.joyX = x;
            input.joyY = y;
        }
    }

    joy.ontouchend = function () {
        joy.style.transform='translate3d(0px, 0px, 0)';
        input.joyX = 0;
        input.joyY = 0;
    }

    function inputTest () {
        var h = 18;
        print (`+========[ Controles ]========+`, 0, h);
        print (`|+=JOYSTICK                   |`, 0, h*2);
        print (`|+---X: ${input.joyX.toString().padStart(3,' ')}                   |`, 0, h*3);
        print (`|+---Y: ${input.joyY.toString().padStart(3,' ')}                   |`, 0, h*4);
        print (`|                             |`, 0, h*5);
        print (`|    Y:   ${input.Y}                   |`, 0, h*6);
        print (`|    X:   ${input.X}                   |`, 0, h*7);
        print (`|    B:   ${input.B}                   |`, 0, h*8);
        print (`|    A:   ${input.A}                   |`, 0, h*9);
        print (`|                             |`, 0, h*10);
        print (`|START:   ${input.start}                   |`, 0, h*11);
        print (`+-----------------------------+`, 0, h*12);
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

            player.x += input.joyX/4;
            player.y += input.joyY/4;
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

    if (input.Y) {
        player.w = (player.w < 128) ? player.w * 2 : player.w;
        player.h = (player.h < 128) ? player.h * 2 : player.h;
    }

    if (input.B) {
        player.w = (player.w > 32) ? player.w / 2 : player.w;
        player.h = (player.h > 32) ? player.h / 2 : player.h;
    }

    if (input.start) {

        if (paused) {
            navigator.vibrate(10,10,10);
            run = setInterval (main, 1000/60);
            paused = false;
            console.log ('running');
        } else {
            navigator.vibrate(10)
            let msg = "[ PAUSE ]";
            let len = msg.length;
            print (msg, (WIDTH /2) - ((len / 2) * 16)  , (HEIGHT/2), '#fa0');
            clearInterval (run);
            paused = true;
            console.log ('paused');
        }
    }

    function updatePlayer () {
        player.move ();
        borderDetect (player);
        player.draw ();
    }



    function main () {
        ctx.clearRect (0,0, WIDTH, HEIGHT);
        updatePlayer ();
        print (`vel x  : ${(input.joyX/4).toString().padStart(4,' ')}`,17, 17, '#a00');
        print (`vel x  : ${(input.joyX/4).toString().padStart(4,' ')}`,16, 16);
        print (`vel y  : ${(input.joyY/4).toString().padStart(4,' ')}`,17, 37, '#a00');
        print (`vel y  : ${(input.joyY/4).toString().padStart(4,' ')}`,16, 36);
        // requestAnimationFrame (main);
    }

    function teste () {
        console.log ('teste');
    }

    // main ();
    run = setInterval (main, 1000/60);
    paused = false;

}, false)
