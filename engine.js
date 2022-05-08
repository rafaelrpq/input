var dpad, joy, buttons, start;

var player;

var run=true, gameloop, paused=false;

var bgSound;

var canvas, ctx;

var WIDTH;
var HEIGHT;
function playAudio (sound, volume=1, loop = false) {
    var audio = new Audio (sound);
    if (loop) {
        audio.addEventListener ('timeupdate', function () {
            var buffer = .5;
            if (this.currentTime > this.duration - buffer) {
                this.currentTime = 0;
                this.play ();
            }
        });
    }
    audio.volume = volume;
    // audio.play ();
    return audio;
}

function borderDetect (obj) {
    obj.x = (obj.x < 0) ? 0 : obj.x;
    obj.y = (obj.y < 0) ? 0 : obj.y;
    obj.x = (obj.x > WIDTH  - obj.w) ? WIDTH  - obj.w : obj.x;
    obj.y = (obj.y > HEIGHT - obj.h) ? HEIGHT - obj.h : obj.y;
}

function pause () {
    if (paused) {
        gameloop = setInterval (main, 1000/60);
        paused = false;
    } else {
        clearInterval (gameloop);
        let msg = "= EM PAUSA =";
        let len = msg.length;
        print (msg, (WIDTH/2 - len/2 * 16) + 1, (HEIGHT/2) + 1, '#000');
        print (msg, WIDTH/2 - len/2 * 16, HEIGHT/2, '#fa0');
        paused = true;
    }
}

function suspend () {
    run = false;
    paused = false;
    clearInterval (gameloop);
    currentScene.sound.pause();
    ctx.clearRect (0,0,WIDTH,HEIGHT);
    let msg = "= EM ESPERA =";
    let len = msg.length;
    print (msg, (WIDTH/2 - len/2 * 16) + 1, (HEIGHT/2) + 1, '#000');
    print (msg, WIDTH/2 - len/2 * 16, HEIGHT/2, '#fa0');
    msg = "Aperte START para continuar";
    len = msg.length;
    print (msg, (WIDTH/2 - len/2 * 16) + 1, (HEIGHT/1.1) + 1, '#000');
    print (msg, WIDTH/2 - len/2 * 16, HEIGHT/1.1, '#fa0');
}

window.onblur = function () {
    suspend ();
}

document.addEventListener ('DOMContentLoaded', function (){
    console.log ('content loaded');

    if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))){
      document.write("not mobile device");
    }


    canvas = document.querySelector('canvas');
    HEIGHT = canvas.height;
    WIDTH  = canvas.width;
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

    buttons.forEach (function (){
        this.oncontextmenu = function (e) {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation();
            return false;
        }
    })

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

}, false)
