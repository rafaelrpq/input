var dpad, joy, buttons, start;

document.addEventListener ('DOMContentLoaded', function (){
    console.log ('content loaded');

    if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))){
      document.write("not mobile device");
    }

    WIDTH  = 500;
    HEIGHT = 500;

    canvas = document.querySelector('canvas');
    ctx    = canvas.getContext ('2d');

    print = function (txt, x, y) {
        ctx.save();
        ctx.fillStyle = '#333'
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

    buttons[0].ontouchstart = function (e) {
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

    player = {
        x : WIDTH / 2,
        y : HEIGHT / 2,
        w : 8,
        h : 8,
        color : '#00f',
    }

    function movePlayer () {
        player.x += input.joyX/2;
        player.y += input.joyY/2;
        // player.x += (input.joyX == -32) ? -1 : (input.joyX == 32) ? 1 : 0;
        // player.y += (input.joyY == -32) ? -1 : (input.joyY == 32) ? 1 : 0;
    }

    function borderDetect (obj) {
            obj.x = (obj.x < 0) ? 0 : obj.x;
            obj.y = (obj.y < 0) ? 0 : obj.y;
            obj.x = (obj.x > WIDTH  - obj.w) ? WIDTH  - obj.w : obj.x;
            obj.y = (obj.y > HEIGHT - obj.h) ? HEIGHT - obj.h : obj.y;
    }

    function updatePlayer () {
        movePlayer ();
        borderDetect (player);
        ctx.save ();

        if (input.Y == 1) {
            navigator.vibrate (100);
        }

        ctx.fillStyle = player.color;
        ctx.fillRect (player.x, player.y, player.w, player.h);
        ctx.restore ();
    }



    function main () {
        ctx.clearRect (0,0, WIDTH, HEIGHT);
        print (`vel x: ${input.joyX.toString().padStart(3,' ')}`,16, 16);
        print (`vel y: ${input.joyY.toString().padStart(3,' ')}`,16, 36);
        updatePlayer ();
        requestAnimationFrame (main);
    }

    main ();
}, false)
