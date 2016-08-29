/**
 * Created by rzsavilla on 27/08/2016.
 */

var uniq = 0;

Entity.prototype = new AnimatedSprite();
Entity.prototype.constructor=Entity;
function Entity() {
    AnimatedSprite.call(this); //Super
    var restitution = 0;
    var jumpForce = 500;
    var bJumping = false;
    var jumpTick = 10;
    var jumpCount = 0;
    var facing = "right";
    var moving = false;
    this.onGround = false;
    this._roId = uniq++;

    this.setJumpForce = function(newForce) {
        jumpForce = newForce;
    }
    this.setJumpTick = function(tick) {
        jumpTick = tick;
    }
    this.setFacing = function(newDirection) {
        facing = newDirection;
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
            this.topHit = false;
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

    this.updateFrameBB = function() {
        var extent = this.getFrameSize().divide(2,2);
        var pos = this.getPos();
        this.bbTop.setSize(extent.x / 1.2,2);
        this.bbBot.setSize(extent.x / 1.2,2);
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
        this.bb.setPos(this.getPos().x,this.getPos().y);
    }

    this.updateEntity = function (dt) {
        var frame = this.getAnimation().frames[this.getCurrFrame()]
        if (this.topHit) {
            bJumping = false;
        }
        if (bJumping){
            this.applyForce(0,-(jumpForce / jumpTick) * this.getMass());
            jumpCount++;
            if (jumpCount >= jumpTick) {
                bJumping = false;
            }
        }
        this.updateMove(dt);
    }
}
