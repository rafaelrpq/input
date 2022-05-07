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
        this.direction = (input.joyX < 0) ? Direction.LEFT : (input.joyX > 0) ? Direction.RIGHT : (input.joyY < 0) ? Direction.UP : (input.joyY > 0) ? Direction.DOWN : this.direction ;

        this.x += input.joyX;
        this.y += input.joyY;
        // player.x += (input.joyX == -32) ? -1 : (input.joyX == 32) ? 1 : 0;
        // player.y += (input.joyY == -32) ? -1 : (input.joyY == 32) ? 1 : 0;
    }

    update () {
        this.move ();
        this.draw ();
    }
}
