/**
 * Created by rzsavilla on 27/08/2016.
 */

var tileSheet = new Image();
tileSheet.src= "../assets/tileset.png";
tileSheet.width = 352;
tileSheet.height = 32;


Platform.prototype = new AnimatedSprite();
Platform.prototype.constructor=Platform;
function Platform(i,x,y) {
    AnimatedSprite.call(this);
    this.setPos(x,y);
    var anim = new Animation(0,tileSheet);
    this.bb.setPos(x,y); //Default bb size fills entire tile
    this.bb.setWidth(32);
    this.bb.setHeight(32);
    this.type = "solid";
    this.collidable = true;

    if (i == 1) {
        //Dirt right corner
        anim.addFrame(0,0,32,32);
    }
    else if (i == 2) {
        //Dirt left corner
        anim.addFrame(32,0,32,32);
    }
    else if (i == 3) {
        //Grass left
        anim.addFrame(64,0,32,32);
    }
    else if (i == 4) {
        //Grass right
        anim.addFrame(96,0,32,32);
    }
    else if (i == 5) {
        //Grass tile
        anim.addFrame(128,0,32,32);
    }
    else if (i == 6) {
        //Grass float center
        anim.addFrame(160,0,32,17);
        this.bb.setPos(x,y+2);
        this.bb.setWidth(32);
        this.bb.setHeight(3);
        this.type = "floating";
    }
    else if (i == 7) {
        //Grass float left
        anim.addFrame(192,0,32,17);
        this.bb.setPos(x,y+1);
        this.bb.setWidth(32);
        this.bb.setHeight(3);
        this.type = "floating";
    }
    else if (i == 8) {
        //Grass float right
        anim.addFrame(224,0,32,17);
        this.bb.setPos(x,y+1);
        this.bb.setWidth(32);
        this.bb.setHeight(3);
        this.type = "floating";
    }
    else if (i == 9) {
        //Grass wall left
        anim.addFrame(256,0,32,32);
    }
    else if (i == 10) {
        //Grass wall right
        anim.addFrame(288,0,32,32);
    }
    else if (i == 11) {
        //Dirt
        anim.addFrame(320,0,32,32);
        this.collidable = false;
    }
    else if (i == 12) {
        //Stone Wall1
        anim.addFrame(0,32,32,32);
        this.type = "background"
        this.collidable = false;
    }
    else if (i == 13) {
        //Stone Wall2
        anim.addFrame(32,32,32,32);
        this.type = "background"
        this.collidable = false;
    }
    else if (i == 14) {
        //Stone Floor Left
        anim.addFrame(64,32,32,32);
    }
    else if (i == 15) {
        anim.addFrame(96,32,32,32);
    }
    else if (i == 16) {
        //Stone Floor Right
        anim.addFrame(128,32,32,32);
    }
    else if (i == 17) {
        //StoneWindow
        anim.addFrame(160,32,32,32);
        this.type = "background"
        this.collidable = false;
    }
    else if (i == 18) {
        anim.addFrame(192,32,32,32);
    }
    else if (i == 19) {
        anim.addFrame(224,32,32,32);
    }
    else if (i == 20) {
        anim.addFrame(256,32,32,32);
    }
    else if (i == 21) {
        anim.addFrame(288,32,32,32);
    }
    else if (i == 23 || i == 24 || i == 25) {
        //Water
        anim.speed = (0.2);
        anim.addFrame(0,64,32,32)
        anim.addFrame(32,64,32,32)
        anim.addFrame(64,64,32,32)
        this.type = "background"
        this.collidable = false;
    }
    else if (i == 26) {
        //Death Box
        this.type = "death";
        anim.addFrame(0,0,0,0);
    }
    else if (i == 27) {
        //Invisible box
        anim.addFrame(0,0,0,0);
    }
    else if (i == 34) {
        //wooden bridge
        anim.addFrame(0,96,32,32);
        this.bb.setHeight(7);
    }

    else if (i == 45) {
        anim.addFrame(0,128,32,32);
        this.type = "background";
        this.collidable = false;
    }
    else if (i == 46) {
        anim.addFrame(32,128,32,32);
        this.type = "background";
        this.collidable = false;
    }
    else if (i == 56) {
        anim.addFrame(0,160,32,32);
        this.type = "background";
        this.collidable = false;
    }
    else if (i == 57) {
        anim.addFrame(32,160,32,32);
        this.type = "background";
        this.collidable = false;
    }
    else if (i == 67) {
        anim.addFrame(0,192,32,32);
        this.type = "background";
        this.collidable = false;
    }
    else if (i == 68) {
        anim.addFrame(32,192,32,32);
        this.type = "background";
        this.collidable = false;
    }

    else if (i == 47) {
        anim.addFrame(64,128,32,32);
        this.type = "background";
        this.collidable = false;
    }
    else if (i == 48) {
        anim.addFrame(96,128,32,32);
        this.type = "background";
        this.collidable = false;
    }
    else if (i == 58) {
        anim.addFrame(64,160,32,32);
        this.type = "background";
        this.collidable = false;
    }
    else if (i == 59) {
        anim.addFrame(96,160,32,32);
        this.type = "background";
        this.collidable = false;
    }
    else if (i == 69) {
        anim.addFrame(64,192,32,32);
        this.type = "background";
        this.collidable = false;
    }
    else if (i == 70) {
        anim.addFrame(96,192,32,32);
        this.type = "background";
        this.collidable = false;
    }
    else {
        anim.addFrame(0,0,0,0);
        this.type = "background";
        this.collidable = false;
    }
    this.setAnimation(anim);
}