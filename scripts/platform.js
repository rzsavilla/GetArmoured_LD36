/**
 * Created by rzsavilla on 27/08/2016.
 */

var tileSheet = new Image();
tileSheet.src= "../assets/tiles.png";

var anim = new Animation(0,tileSheet);
Platform.prototype = new AnimatedSprite();
Platform.prototype.constructor=Platform;
function Platform(i,x,y) {
    AnimatedSprite.call(this);
    this.setPos(x,y);

    if (i == 0) {
        //Grass tile
        anim.addFrame(0,0,32,32);
        this.bb.setPos(x,y+2);
        this.bb.setWidth(32);
        this.bb.setHeight(30);
    }
    else if (i == 1) {
        //Dirt tile
        anim.addFrame(32,0,32,32);
        this.bb.setPos(x,y);
        this.bb.setWidth(32);
        this.bb.setHeight(32);

    }
    else if (i == 2) {
        //Floating Dirt Left
    }
    else if (i == 3) {
        //Floating Dirt Center
    }
    else if (i == 4) {
        //Floating Dirt Right
    }
    else if (i == 5) {
        //Tree
    }
    else {}

    this.setAnimation(anim);
}