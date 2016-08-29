/**
 * Created by rzsavilla on 27/08/2016.
 */

/**
 * Allows object to be transformed
 * @constructor
 */

function Transformable() {
    var pos = new Vector2D(0, 0);
    var origin = new Vector2D(0,0);
    var scale = new Vector2D(1,1);
    var rot = 0;
    this.objectType = "";
    /**
     * Set objects current position
     * @param {number} x
     * @param {number} y
     */
    this.setPos = function(x,y) { pos = new Vector2D(x,y); };
    this.setPosV = function(vector) { pos = vector; }
    /**
     * Set objects origin
     * @param x
     * @param y
     */
    this.setOrigin = function(x,y) { origin.x = x, origin.y = y; };
    /**
     * Set objects current rotation in degrees
     * @param {number} deg
     */
    this.setRot = function(deg) { rot = deg; };
    /**
     * Set objects scale
     * @param {number} x
     * @param {number} y
     */
    this.setScale = function(x,y) { scale.x = x, scale.y = y; }

    /**
     * Return objects current position
     * @returns {Vector2D}
     */
    this.getPos = function() { return pos; };
    this.getOrigin = function() { return origin; }
    /**
     * Return objects current rotation
     * @returns {number}
     */
    this.getRot = function() { return rot; };
    /**
     * Return objects scale
     * @returns {Vector2D}
     */
    this.getScale = function() { return scale; }
}

Movable.prototype = new Transformable();
Movable.prototype.constructor=Movable;
function Movable() {
    Transformable.call(this);

    var velocity = new Vector2D(0,0);
    var force = 0;                      //Force being applied to the object
    var speed = 0;

    var mass = 1;
    var friction = new Vector2D(0.1,0.1);
    var fA = new Vector2D(0,0);         //Applied Force
    var fNet = new Vector2D(0,0);       //Net Force

    this.setVelocity = function(x,y) {
        velocity.x = x;
        velocity.y = y;
    }
    this.setHeading = function(x,y) {
        if (x instanceof Vector2D) {
            heading = x;
        } else {
            heading.x = x;
            heading.y = y;
        }
        heading = heading.normalize();      //Unit Vector
    }
    this.setfriction = function(newFriction) {
        friction = newFriction;
    }
    this.setFrictionX = function(x) { friction.x = x; }
    this.setFrictionY = function(y) { friction.y = y; }
    this.setMass = function(newMass) {
        mass = newMass;
    }
    this.setSpeed = function(newSpeed) {
        speed = newSpeed;
    }

    this.getVelocity = function() {
        return fNet;
    }
    this.getFriction = function() {
        return friction;
    }
    this.getMass = function() {
        return mass;
    }
    this.getAcceleration = function () {
        //A = F/M
        return (force / mass);
    }
    this.getSpeed = function() {
        return speed;
    }

    this.move = function(x,y) {
        this.setPos(this.getPos().x + x, this.getPos().y + y);
    }

    //this.setForce = function(newForce) { force = newForce; }

    /**
     * Apply force (fA)
     * @param {Vector2D}addForce
     */
    this.applyForce = function(x,y) {
        fA.x += x / this.getMass();
        fA.y += y / this.getMass();
    }

    this.updateMove = function(dt) {
        var fF = new Vector2D(-fA.x * (friction.x), -fA.y * (friction.y)); //Friction force
        fF.x = fF.x * dt;
        fA = fA.vAdd(fF);       //Apply friction to applied force
        fNet = fA;          //Sum of all force


        if (fNet.x > -0.1 && fNet.x < 0.1) { fNet.x=0; }
        if (fNet.y > -0.1 && fNet.y < 0.1) { fNet.y=0; }
        this.move(fNet.x * dt,fNet.y * dt);
    }
}