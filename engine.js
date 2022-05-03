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

    var Y=0, X=0, B=0, A=0;
    buttons[0].ontouchstart = function (e) {
        // ctx.clearRect(0,0,500,500);
        // print ('Y clicked', 190, 250)
        console.log (`[ Y ] : ${++Y}`);
        input.Y = 1;
    }

    buttons[0].ontouchend = function () {
        // ctx.clearRect(0,0,500,500);
        // print ('Y released', 180, 250)
        input.Y = 0;
    };

    buttons[1].ontouchstart = function (e) {
        // ctx.clearRect(0,0,500,500);
        // print ('X clicked', 190, 250)
        console.log (`[ X ] : ${++X}`);
        input.X = 1;
    }

    buttons[1].ontouchend = function () {
        // ctx.clearRect(0,0,500,500);
        // print ('X released', 180, 250)
        input.X = 0;
    };

    buttons[2].ontouchstart = function (e) {
        // ctx.clearRect(0,0,500,500);
        // print ('B clicked', 190, 250)
        console.log (`[ B ] : ${++B}`);
        input.B = 1;
    }

    buttons[2].ontouchend = function () {
        // ctx.clearRect(0,0,500,500);
        // print ('B released', 180, 250)
        input.B = 0;
    };

    buttons[3].ontouchstart = function (e) {
        // ctx.clearRect(0,0,500,500);
        // print ('A clicked', 190, 250)
        console.log (`[ A ] : ${++A}`);
        input.A = 1;
    }

    buttons[3].ontouchend = function () {
        // ctx.clearRect(0,0,500,500);
        // print ('A released', 180, 250)
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
        x=0;
        y=0;
        joy.style.transform='translate3d('+x+'px,'+y+'px,0)';
        input.joyX = x;
        input.joyY = y;
    }

    function main () {
        ctx.clearRect (0,0, WIDTH, HEIGHT);
        var h = 40;
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

        requestAnimationFrame (main);
    }


    main ();
}, false)
