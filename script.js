
var currentScene = {};
document.addEventListener ("DOMContentLoaded", ()=>{

    function changeScene (scene) {
        if (currentScene.sound) currentScene.sound.pause ();
        currentScene = scene;
        if (currentScene.sound) currentScene.sound.play ();
    }

    titleScreen = {
        sound : playAudio (),
        logo : new Image (),
        draw () {
            this.logo.src = 'assets/boo.png';
            ctx.save ();
            ctx.fillStyle = '#323';
            ctx.fillRect (0,0,WIDTH,HEIGHT);
            ctx.restore ();
            let msg = "Aperte START";
            let len = msg.length;
            ctx.drawImage (this.logo, (WIDTH/2) - 128, (HEIGHT/2) -128, 256, 256);
            print (msg, (WIDTH /2) - ((len / 2) * 16)+1  , (HEIGHT/1.1)+1, '#000');
            print (msg, (WIDTH /2) - ((len / 2) * 16)  , (HEIGHT/1.1), '#fa0');
        },

        update () {
            this.readInput();
        },

        readInput () {
            input.START.ontouchstart = () => {
                if (run) {
                    changeScene (game);
                } else {
                    gameloop = setInterval (main, 1000/60);
                    run = true;
                }
            }
        },
    }

    game = {
        bg : new Image(),
        player : new Player (WIDTH/2 - 16, HEIGHT/2 - 16, 32, 32, 'assets/boo.png', Type.IMAGE),
        sound : playAudio ('assets/ghosthouse.mp3', 0.5, true),

        draw () {
            this.bg.src = 'assets/ghosthouse.png';
            ctx.drawImage (this.bg, 0, 0, WIDTH, HEIGHT);
            this.player.draw () ;
        },

        update () {
            this.readInput();
            this.player.update ();
            borderDetect (this.player);
        },

        readInput () {
            let player = this.player;
            input.Y.ontouchstart = function () {
                navigator.vibrate(10)
                if (!paused && run) {
                    player.w = (player.w < 96) ? player.w * 1.2 : player.w;
                    player.h = (player.h < 96) ? player.h * 1.2 : player.h;
                }
            }

            input.X.ontouchstart = function (e) {
                navigator.vibrate(10)
            }

            input.B.ontouchstart = function (e) {
                navigator.vibrate(10)
                if (!paused && run) {
                    player.w = (player.w > 32) ? player.w / 1.2 : player.w;
                    player.h = (player.h > 32) ? player.h / 1.2 : player.h;
                }
            }

            input.A.ontouchstart = function (e) {
                navigator.vibrate(10)
                if (!paused && run) {
                    let coin  = playAudio ('assets/coin.mp3');
                    coin.play();
                }
            }

            input.START.ontouchstart = function (e) {
                navigator.vibrate(10)
                if (run) {
                    pause ();
                } else {
                    run = true;
                    gameloop = setInterval (main, 1000/60);
                    currentScene.sound.play()
                }
            }
        }
    }

    currentScene = titleScreen;

});
function main(){
  ctx.clearRect (0,0,WIDTH,HEIGHT);
  currentScene.update ();
  currentScene.draw ();
}

gameloop = setInterval (main, 1000/60);
