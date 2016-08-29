/**
 * Created by rzsavilla on 27/08/2016.
 */

Sprite.prototype= new Movable(); //Sprite Inherits Movable
Sprite.prototype.constructor=Sprite;
/** Sprite */
function Sprite() {
    Movable.call(this); //Super
    /**
     * Sprite Image/SpriteSheet
     */
    var image = new Image();
    /**
     * Size of sprite
     * @type {Vector2D}
     */
    var size = new Vector2D(0,0);

    /**
     * Set the size of the sprite
     * @param newWidth Sprite width.
     * @param newHeight Sprite height.
     */
    this.setSize = function(newWidth,newHeight) { size.x = newWidth; size.y = newHeight; }
    this.setImage = function(newImage) {
        image = newImage;
        this.setSize(newImage.width,newImage.height);
    }

    this.getSize = function() { return size; }
    this.getImage = function() { return image; }

    /**
     * Draw sprite image
     * @param c Canvas to draw on.
     * @param interpolate {number} Interpolate position of the drawn image
     */
    this.draw = function (c) {
        c.drawImage(image,
            (this.getPos().x) - this.getOrigin().x,
            (this.getPos().y) - this.getOrigin().y
        )
    }
}

/**
 * Single animation frame top left and top right
 * @param {Vector2D} newTop
 * @param {Vector2D} newSize
 * @constructor
 */
function Frame(newTop,newSize) {
    this.top = newTop;
    this.size = newSize;
}

/**
 * Stores animation information for a sprite.
 * @param {number} fps Animation frames per second.
 * @param {image} spriteSheet Sprite sheet
 */
function Animation(speed,spriteSheet) {
    this.frames = [];
    this.spriteSheet = spriteSheet;

    this.speed = speed;       //speed in seconds
    this.spriteSheet = spriteSheet;

    /**
     * Set animation spritesheet
     * @param {Image}newImage
     */
    this.setSpriteSheet = function (newImage) {
        this.spriteSheet = newImage;
    }

    /**
     * Set Animation (auto generates frames)
     * @param {number} numFrames
     * @param {number} startX
     * @param {number} startY
     * @param {number} frameWidth
     * @param {number} frameHeight
     * @param {number} fps
     * @param {Image} newSpriteSheet
     */
    this.set = function(numFrames,startX,startY,frameWidth,frameHeight) {
        var pos = new Vector2D(startX,startY);
        for (var i = 0; i < numFrames; i++) {
            if (pos.x >= this.spriteSheet.width) {
                pos.x = 0;
                pos.y += frameHeight;
            }
            var top = new Vector2D(pos.x, pos.y);
            this.frames.push(new Frame(top, new Vector2D(frameWidth, frameHeight)));
            //next frame
            pos.x += frameWidth;
        }
    }

    this.addFrame = function(x,y,width,height) {
        var top = new Vector2D(x,y);
        var size = new Vector2D(width,height);
        this.frames.push(new Frame(top,size));
    }
}

var uniq = 0;

AnimatedSprite.prototype = new Movable();                //Animated Sprite Inherits Sprite
AnimatedSprite.prototype.constructor=AnimatedSprite;
/** Animated sprite */
function AnimatedSprite() {
    Movable.call(this);
    /** Frame Position */
    var framePos = new Vector2D(0.0,0.0);
    /** Size of each frame */
    var frameSize = new Vector2D(0.0,0.0);
    /** Total number of animation frames */
    var frameCount = 0;
    /** Current animation frame */
    var currFrame = 0;
    /** Animation Speed (milliseconds) */
    var framesSpeed = 0.2;
    /** Frame Timer */
    var timer = new Timer();

    /** Current animation */
    var anim = new Animation();

    var playAnimation = true;

    this.bbLeft = new AABB();
    this.bbRight = new AABB();
    this.bbTop = new AABB();
    this.bbBot = new AABB();

    this.bb = new AABB();
    this.bb.setColour("white");
    this.collidable = false;

    this._roId = uniq++;

    this.topHit = false;

    /**
     *
     * @param {Animation} newAnimation
     */
    this.setAnimation = function(newAnimation) {
        anim = newAnimation; this.setAnimSpeed(anim.speed); currFrame = 0;
    }
    /** Return animation */
    this.getAnimation = function() { return anim; }
    /** Return current frame number */
    this.getCurrFrame = function() { return currFrame; }
    /**
     * Return size of the current animation frame
     * @returns {Vector2D}
     */
    this.getFrameSize = function() {
        if (anim.frames.length > 0) {
            return anim.frames[currFrame].size;
        }
        else {
            return new Vector2D(0,0);
        }
    }
    /**
     * Play or pause animation.
     * @param {boolean} play Play or pause stop animation
     */
    this.play = function(play) { playAnimation = play; }

    /** Reset animation */
    this.reset = function() { currFrame = 0; }

    /** Change animation frame. */
    this.nextFrame = function() {
        if (timer.getElapsed() / 1000 >= anim.speed) {
            if (currFrame < anim.frames.length -1) {
                //Next Frame
                currFrame += 1;
            } else {
                //Reset animation
                currFrame = 0;
            }
            timer.reset();
        }
    }
    /** Compute milliseconds to achieve animation frame speed */
    this.setAnimSpeed = function(seconds) { framesSpeed = seconds; }

    /**
     * Draw and animate sprite, overrides
     * @param c Canvas to draw on
     */
    this.draw = function (c) {
        this.nextFrame(); //Update frame
        var frame = this.getAnimation().frames[this.getCurrFrame()];
        //Draw frame
        c.save();
        c.translate(this.getPos().x,this.getPos().y);
        c.scale(this.getScale().x,this.getScale().y);
        c.rotate(this.getRot() * (Math.PI / 180));      //Apply rotation
        c.translate(-this.getPos().x,-this.getPos().y);
        c.drawImage(
            this.getAnimation().spriteSheet,
            frame.top.x,frame.top.y,
            frame.size.x,frame.size.y,
            this.getPos().x - this.getOrigin().x,
            this.getPos().y - this.getOrigin().y,
            frame.size.x,frame.size.y
        )
        if (true) {
            //this.bb.draw(c);        //Draw box
            this.bbLeft.draw(c);
            this.bbRight.draw(c);
            this.bbTop.draw(c);
            this.bbBot.draw(c);
        }
        c.restore();
    }
}