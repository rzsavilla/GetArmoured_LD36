/**
 * Created by rzsavilla on 27/08/2016.
 */

Entity.prototype = new AnimatedSprite();
Entity.prototype.constructor=Entity;
function Entity() {
    AnimatedSprite.call(this); //Super
    var restitution = 0;
    var jumpForce = 700;
    var bJumping = false;
    var jumpTick = 20;
    var jumpCount = 0;
    var facing = "right";
    var moving = false;
    this.onGround = false;

    this.setJumpForce = function(newForce) {
        jumpForce = newForce;
    }
    this.setJumpTick = function(tick) {
        jumpTick = tick;
    }

    this.isJumping = function() { return bJumping;}
    this.isMoving = function() { return moving; }
    this.isFacing = function() { return facing; }
    this.onFloor = function() { return this.onGround; }

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
        if (bJumping){
            this.applyForce(0,-(jumpForce / jumpTick) * this.getMass());
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

var spriteSheet = new Image();
spriteSheet.width = 124;
spriteSheet.height = 94;
spriteSheet.src = "../assets/spritesheet.png";

/*--------------Player Animations----------------------*/
var animIdleRight = new Animation(0,spriteSheet);
animIdleRight.addFrame(0,0,14,46);
var animRight = new Animation(0.08,spriteSheet);
animRight.addFrame(32,0,14,46);
animRight.addFrame(46,0,20,46);
animRight.addFrame(66,0,16,46);
animRight.addFrame(82,0,14,46);
animRight.addFrame(96,0,14,46);
animRight.addFrame(110,0,14,46);
var animJumpR = new Animation(0,spriteSheet);
animJumpR.addFrame(14,0,16,46);
var animIdleLeft = new Animation(0,spriteSheet);
animIdleLeft.addFrame(0,46,14,46);
var animLeft = new Animation(0.08,spriteSheet);
animLeft.addFrame(32,46,14,46);
animLeft.addFrame(46,46,20,46);
animLeft.addFrame(66,46,16,46);
animLeft.addFrame(82,46,14,46);
animLeft.addFrame(96,46,14,46);
animLeft.addFrame(110,46,14,46);
var animJumpL = new Animation(0,spriteSheet);
animJumpL.addFrame(14,46,18,46);
var armourImage = new Image();
armourImage.src = "../assets/armour.png";
var animRightIdleFull = new Animation(0,armourImage);
animRightIdleFull.addFrame(0,0,16,45);

var animRightFullJump = new Animation(0,armourImage);
animRightFullJump.addFrame(16,0,22,45);

var animRightFull = new Animation(0.08,armourImage);
animRightFull.addFrame(38,0,16,45);
animRightFull.addFrame(54,0,20,45);
animRightFull.addFrame(74,0,17,45);
animRightFull.addFrame(91,0,16,45);
animRightFull.addFrame(107,0,16,45);
animRightFull.addFrame(123,0,16,45);

/*------------------------------------------------------*/

Player.prototype= new Entity();
Player.prototype.constructor=Player;
function Player(x,y) {
    Entity.call(this);

    this.setPos(x,y);
    this.setSpeed(2000);
    this.setMass(50);
    this.setFrictionX(15);
    this.setJumpTick(10);
    this.setJumpForce(1100);

    this.setAnimation(animRight); //Starting animation

    this.updateBB = function() {
        var extent = this.getFrameSize().divide(2,2);
        var pos = this.getPos();
        this.bbTop.setSize(extent.x / 1.2,2);
        this.bbBot.setSize(extent.x / 1.2,5);
        this.bbLeft.setSize(2,extent.y);
        this.bbRight.setSize(2,extent.y);
        this.bbTop.setPos(pos.x, this.getPos().y - extent.y * 2);
        this.bbBot.setPos(pos.x,this.getPos().y)
        this.bbLeft.setPos(pos.x - extent.x - 1,this.getPos().y - extent.y);
        this.bbRight.setPos(pos.x + extent.x, this.getPos().y - extent.y);
        this.bbTop.setOrigin(this.bbTop.getWidth() / 2,this.bbTop.getHeight() / 2);
        this.bbBot.setOrigin(this.bbBot.getWidth() / 2,this.bbBot.getHeight() /  2);
        this.bbLeft.setOrigin(0,this.bbLeft.getHeight() / 2);
        this.bbRight.setOrigin(0,this.bbRight.getHeight() / 2);
    }

    this.update = function(dt) {
        //Update bounding boxes
        var frame = this.getAnimation().frames[this.getCurrFrame()]
        this.setOrigin(frame.size.x / 2, frame.size.y); //Update origin based on frame size (center,bottom)
        this.updateBB();

        this.updateEntity(dt);
        //------------Key Press Movement and Animation change -------------------------

        if (spaceKey) {
            this.jump();
        }
        if (aKey) {
            if (!this.isJumping()) {
                if (this.getAnimation() != animLeft) { this.setAnimation(animLeft); }
            }
            this.moveLeft();
        }
        else if (dKey) {
            if (!this.isJumping()) {
                if (this.getAnimation() != animRightFull) {
                    this.setAnimation(animRightFull);
                }
            }
            this.moveRight();
        }

        //Idle
        //console.log(this.onFloor());
        if (!this.onFloor()) {
            if (this.isFacing() == "left") {
                if (this.getAnimation() != animJumpL) {
                    this.setAnimation(animJumpL);
                }
            } else {
                if (this.getAnimation() != animRightFullJump) {
                    this.setAnimation(animRightFullJump);
                }
            }
        }
        else if (this.getVelocity().x < 1 && this.getVelocity().x > -1) {
            //Set Idle animation
            if (this.isFacing() == "left") {
                if (this.getAnimation() != animIdleLeft) {
                    this.setAnimation(animIdleLeft);
                }
            }
            else if (this.isFacing() == "right") {
                if (this.getAnimation() != animRightIdleFull) {
                    this.setAnimation(animRightIdleFull);
                }
            }
        }
    }
}