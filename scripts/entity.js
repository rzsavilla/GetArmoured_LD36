/**
 * Created by rzsavilla on 27/08/2016.
 */

Entity.prototype = new AnimatedSprite();
Entity.prototype.constructor=Entity;
function Entity() {
    AnimatedSprite.call(this); //Super
    var restitution = 0;
    var jumpForce = 1200;
    var bJumping = false;
    var jumpTick = 20;
    var jumpCount = 0;
    var facing = "right";
    var moving = false;
    var onGround = true;
    this.onGround = false;
    this.isJumping = function() { return bJumping;}
    this.isMoving = function() { return moving; }
    this.onGround = function() { return onGround; }
    this.isFacing = function() { return facing; }

    this.moveLeft = function() {
        facing = "left";
        this.applyForce(-this.getSpeed(),0);
    }
    this.moveRight = function() {
        facing = "right";
        this.applyForce(this.getSpeed(),0);
    }
    this.moveUp = function() { this.applyForce(0,-this.getSpeed()); moving = true; }
    this.moveDown = function () { this.applyForce(0,this.getSpeed()); moving = true; }
    this.jump = function() {
        if (!bJumping) {
            if (this.onGround) {
                bJumping = true;
                jumpCount = 0;
                this.onGround = false;
            }
        }
    }

    /**
     * Resolve collision between two moving objects
     * @param other
     */
    this.impulseCollision = function(other) {
        if (this.bb.collision(other.bb)) {
            //var restitution = 2;
            var diff = this.getPos().vSubtract(other.getPos());
            var normal = diff.normalize();
            //Move away from collision
            this.setPos(this.getPos().x + normal.x,this.getPos().y + normal.y);
            other.setPos(other.getPos().x - normal.x,other.getPos().y - normal.y);
            var velDiff = this.getVelocity().vSubtract(other.getVelocity());
            var scalar = velDiff.dot(normal) * restitution;
            scalar = scalar / ((1 / this.getMass()) + (1 / other.getMass()));
            var vel1 = (this.getVelocity().vAdd(normal.sMultiply(scalar))).sDivide(this.getMass());
            var vel2 = (other.getVelocity().vSubtract(normal.sMultiply(scalar))).sDivide(other.getMass());
            vel1 = vel1.vSubtract(this.getVelocity());
            vel2 = vel2.vSubtract(other.getVelocity());
            this.applyForce(vel1.x, vel1.y);
            other.applyForce(vel2.x, vel2.y);
        }
    }

    /**
     * Resolve collision between moving and immovable object
     * @param immovable
     */
    this.impulseImmovable = function (other) {
        if (this.bb.collision(other.bb)) {
            var diff = this.getPos().vSubtract(other.getPos());
            var normal = diff.normalize();      //unit normal
            var dot = this.getVelocity().dot(normal);
            var v = (this.getVelocity().vSubtract((normal.sMultiply(dot)).sMultiply(restitution)));
            this.setVelocity(v.x, v.y);
            return true;
        }
        return false;
    }

    this.updateEntity = function (dt) {
        var frame = this.getAnimation().frames[this.getCurrFrame()]
        this.setOrigin(frame.size.x / 2, frame.size.y / 2); //Update origin based on frame size (center,bottom)
        if (bJumping){
            this.applyForce(0,-jumpForce);
            jumpCount++;
            if (jumpCount >= jumpTick) {
                bJumping = false;
            }
        }
        this.bb.setSize(frame.size.x,frame.size.y);
        this.bb.setPos(this.getPos().x,this.getPos().y);
        this.bb.setOrigin(this.getOrigin().x,this.getOrigin().y);
        this.bb.setRot(this.getRot());
        this.bb.setScale(this.getScale().x,this.getScale().y);
        this.updateMove(dt);
    }
}

var playerSheet = new Image();
playerSheet.width = 450;
playerSheet.height = 162;
playerSheet.src= "../assets/spriteSheet.png"

var animIdleRight = new Animation(0,playerSheet);
animIdleRight.addFrame(0,0,45,54);
var animIdleLeft = new Animation(0,playerSheet);
animIdleLeft.addFrame(45,0,45,54);
var animRight = new Animation(0.08,playerSheet);
animRight.set(10,0,55,45,54);
var animLeft = new Animation(0.08,playerSheet);
animLeft.set(10,0,108,45,54);

Player.prototype= new Entity();
Player.prototype.constructor=Player;
function Player() {
    Entity.call(this);

    /*-------------------Animation----------------*/
    //var animIdleRight = new Animation(0,playerSheet);
    //animIdleRight.addFrame(0,0,45,54);
    //var animIdleLeft = new Animation(0,playerSheet);
    //animIdleLeft.addFrame(45,0,45,54);
    //var animRight = new Animation(0.1,playerSheet);
    //animRight.set(10,0,55,45,54);
    //var animLeft = new Animation(0.1,playerSheet);
    //animLeft.set(10,0,108,45,54);
    this.setAnimation(animRight); //Starting animation

    this.updateBB = function() {
        var extent = this.getFrameSize().divide(2,2);
        var pos = this.getPos();
        this.bbTop.setSize(extent.x / 1.2,2);
        this.bbBot.setSize(extent.x / 1.2,2);
        this.bbLeft.setSize(2,extent.y);
        this.bbRight.setSize(2,extent.y);
        this.bbTop.setPos(pos.x, this.getPos().y - extent.y);
        this.bbBot.setPos(pos.x,this.getPos().y + extent.y)
        this.bbLeft.setPos(pos.x - extent.x - 1,this.getPos().y);
        this.bbRight.setPos(pos.x + extent.x, this.getPos().y);
        this.bbTop.setOrigin(this.bbTop.getWidth() / 2,this.bbTop.getHeight() / 2);
        this.bbBot.setOrigin(this.bbBot.getWidth() / 2,this.bbBot.getHeight() /  2);
        this.bbLeft.setOrigin(0,this.bbLeft.getHeight() / 2);
        this.bbRight.setOrigin(0,this.bbRight.getHeight() / 2);
    }

    this.update = function(dt) {
        //Update bounding boxes
        this.updateBB();

        this.updateEntity(dt);
        //------------Key Press Movement and Animation change -------------------------
        if (aKey) {
            if (this.getAnimation() != animLeft) { this.setAnimation(animLeft); }
            this.moveLeft();
        }
        else if (dKey) {
            if (this.getAnimation() != animRight) { this.setAnimation(animRight); }
            this.moveRight();
        }
        if (spaceKey) {
            this.jump();
        }
        //Idle
        if (this.getVelocity().x < 1 && this.getVelocity().x > -1) {
            //Set Idle animation
            if (this.isFacing() == "left") {
                if (this.getAnimation() != animIdleLeft) {
                    this.setAnimation(animIdleLeft);
                }
            }
            else if (this.isFacing() == "right") {
                if (this.getAnimation() != animIdleRight) {
                    this.setAnimation(animIdleRight);
                }
            }
        }
    }
}