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
