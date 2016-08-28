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
        this.bb.setHeight(1);
        this.type = "floating";
    }
    else if (i == 7) {
        //Grass float left
        anim.addFrame(192,0,32,17);
        this.bb.setPos(x,y+1);
        this.bb.setWidth(32);
        this.bb.setHeight(1);
        this.type = "floating";
    }
    else if (i == 8) {
        //Grass float right
        anim.addFrame(224,0,32,17);
        this.bb.setPos(x,y+1);
        this.bb.setWidth(32);
        this.bb.setHeight(1);
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
    }
    else {

    }
    this.setAnimation(anim);
}