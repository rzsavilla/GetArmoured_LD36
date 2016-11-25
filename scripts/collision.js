/**
 * Created by rzsavilla on 27/08/2016.
 */
//Collision Bounding
AABB.prototype = new Rectangle();
AABB.prototype.constructor=AABB;
/**
 * Axis Aligned Bounding Box
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @constructor
 */
function AABB(x,y,width,height) {
    Rectangle.call(this);
    this._roId = uniq++;
    this.setPos(x,y);
    this.setSize(width,height);
    this.getExtents = function () {
        return new Vector2D(this.getWidth() / 2, this.getHeight() /2);
    }
    /**
     * Check for collision
     * @param other
     */
    this.collision = function(other) {
        //Collision with Axis Aligned Bounding Box
        var pos1 = this.getPos().subtract(this.getOrigin().x,this.getOrigin().y);
        var pos2 = other.getPos().subtract(other.getOrigin().x,other.getOrigin().y);
        var size1 = new Vector2D(this.getWidth() * this.getScale().x, this.getHeight() * this.getScale().y)
        var size2 = new Vector2D(other.getWidth() * other.getScale().x, other.getHeight() * other.getScale().y)
        if (
            pos1.x < pos2.x + other.getWidth() * other.getScale().x &&
            pos1.x + this.getWidth() * this.getScale().x > pos2.x &&
            pos1.y < pos2.y + other.getHeight() * other.getScale().y &&
            pos1.y + this.getHeight() * this.getScale().x > pos2.y
        ) {
            return true;    //Collision
        } else {
            return false;   //No Collision
        }
    }
}

BC.prototype = new Circle();
BC.prototype.constructor=BC;
/**
 * Bounding Circle
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @constructor
 */
function BC(x,y,radius) {
    Circle.call(this);
    this.setPos(x,y);
    this.setRadius(radius);
    /**
     * Check for collision
     * @param other
     */
    this.collision = function(other) {
        if (other instanceof BC) {
            //Bounding circle - bounding circle collision.
            var x = this.getPos().x - other.getPos().x;
            var y = this.getPos().y - other.getPos().y;
            var dist = Math.sqrt(x * x + y * y);
            if (dist < this.getRadius() + other.getRadius()) {
                return true; //Collision
            } else {
                return false // No Collision
            }
        }
        else if (other instanceof AABB) {
            //Bounding circle - axis aligned bounding box collision.
            var dist = new Vector2D(other.getPos().x - this.getPos().x, other.getPos().y - this.getPos().y);
            var clamp = new Vector2D(0,0);
            if (dist.x >= 0) { clamp.x = Math.min(dist.x,other.getWidth()/2); }
            else if (dist.x < 0) { clamp.x = Math.max(dist.x,-(other.getWidth()/2)); }
            if (dist.y >= 0) { clamp.y = Math.min(dist.y,other.getHeight()/2); }
            else if (dist.y < 0) { clamp.y = Math.max(dist.y,-(other.getHeight()/2)); }
            //Compute distance fromt AABB edge and circle centre
            var diff = dist.vSubtract(clamp);
            //Compute distance between edges
            var distance = diff.magnitude() - this.getRadius();
            //Collision if distance is negative
            if (distance <= 0) { return true; }     //Collision has occurred
            else { return false;}      //No collision
        }
        else {
            //Unknown
            return false;
        }
    }
}

OBB.prototype = new Rectangle();
OBB.prototype.constructor=OBB;
/**
 * Oriented Bounding Box
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @constructor
 */
function OBB(x,y,width,height) {
    Rectangle.call(this);
    this.setPos(x,y);
    this.setSize(width,height);
    /**
     * Check for collision
     * @param other
     */
    this.collision = function(other) {
        if (other instanceof AABB) {
            //OBB - AABB collision
            //Move AABB into OBB orientation
            var rot = new RotationMatrix(-this.getRot());

            var ext1 = new Vector2D(
                (this.getWidth() * this.getScale().x) / 2,
                (this.getHeight() * this.getScale().y) / 2
            ); //OBB half extent
            var ext2 = new Vector2D(
                (other.getWidth() * other.getScale().x) / 2,
                (other.getHeight() * other.getScale().y) / 2
            ); //AABB half extent

            //OBB vertices
            var v1 = [
                new Vector2D(-ext1.x,-ext1.y),
                new Vector2D(+ext1.x,-ext1.y),
                new Vector2D(+ext1.x,+ext1.y),
                new Vector2D(-ext1.x,+ext1.y)
            ];
            //AABB vertices
            var v2 = [
                new Vector2D(-ext2.x,-ext2.y),
                new Vector2D(+ext2.x,-ext2.y),
                new Vector2D(+ext2.x,+ext2.y),
                new Vector2D(-ext2.x,+ext2.y)
            ];

            var rot1 = new RotationMatrix(this.getRot());
            var rot2 = new RotationMatrix(other.getRot());

            for (var i = 0; i < v1.length; i++) {
                v1[i] = v1[i].vSubtract(this.getOrigin().vSubtract(ext1));
                v1[i] = rot1.apply(v1[i]);
                v1[i] = v1[i].add(this.getPos().x,this.getPos().y);

                v2[i] = v2[i].vSubtract(other.getOrigin().vSubtract(ext2));
                v2[i] = rot2.apply(v2[i]);
                v2[i] = v2[i].add(other.getPos().x,other.getPos().y);
            }
            /*---------Compute unit normals/axis to check for intersection------------- */
            //(********Separating Axis Theorem**********)
            var normals = [
                (RotationMatrix(this.getRot()).apply(new Vector2D(1,0))).normalize(),
                (RotationMatrix(this.getRot()).apply(new Vector2D(0,1))).normalize(),
                (RotationMatrix(other.getRot()).apply(new Vector2D(1,0))).normalize(),
                (RotationMatrix(other.getRot()).apply(new Vector2D(0,1))).normalize()
            ];
            /*------Project Points onto axis------------------------------------------- */
            for (var i = 0; i < normals.length; i++) { //Loop through axis
                var box1Min = 99999999;
                var box1Max = -99999999;
                var box2Min = 99999999;
                var box2Max = -99999999;
                //----------------Box1----------------
                for (var j = 0; j < 4; j++)  { //Loop through box points
                    var proj = normals[i].dot(v1[j]);  //compute point projection on axis
                    if (proj < box1Min) { box1Min = proj; }
                    if (proj > box1Max) { box1Max = proj; }

                    //----------------Box2----------------
                    var proj = normals[i].dot(v2[j]);
                    if (proj < box2Min) { box2Min = proj; }
                    if (proj > box2Max) { box2Max = proj; }
                }
                if (!(box2Min <= box1Max && box2Max >= box1Min)) {
                    //Axis separation found, ignore remaining axis checks
                    return false; //No collision
                }
            }
            return true; //All axis intersect, collision has occurred
        }
        else if (other instanceof BC) {
            //OBB - BC collision
            /*Move circle into OBB orientation*/
            var rot = new RotationMatrix(-this.getRot());
            var pos = other.getPos().vSubtract(this.getPos());  //Translate
            pos = rot.apply(pos);                              //Rotate

            //OBB half extents
            var ext = new Vector2D(this.getWidth() / 2, this.getHeight() / 2);
            //OBB vertices
            var v = [
                new Vector2D(-ext.x,-ext.y),
                new Vector2D(+ext.x,-ext.y),
                new Vector2D(+ext.x,+ext.y),
                new Vector2D(-ext.x,+ext.y)
            ];
            //Distance between centres (Box pos - Circle pos)
            var dist = pos;
            //Compute clamp
            var clamp = new Vector2D(0,0);
            if (dist.x >= 0) { clamp.x = Math.min(dist.x,ext.x); }
            else if (dist.x < 0) { clamp.x = Math.max(dist.x,-ext.x); }
            if (dist.y >= 0) { clamp.y = Math.min(dist.y,ext.y); }
            else if (dist.y < 0) { clamp.y = Math.max(dist.y,-ext.y); }
            //Distance between box edge to circle center (dist - clamp)
            var diff = new Vector2D(dist.x - clamp.x,dist.y - clamp.y);
            //Compute distance between edges
            var distance = Math.sqrt((diff.x * diff.x) + (diff.y * diff.y)) - other.getRadius();
            if (distance <=0) { return true; } //Collision has occurred
            else { return false; }              //No Collision
        }
        else if (other instanceof OBB) {
            //OBB - OBB collision
            /*--------Get the 4 points of each box------------------------------------ */
            var ext1 = new Vector2D(this.getWidth() / 2, this.getHeight() / 2);     //Box 1 half extents
            var ext2 = new Vector2D(other.getWidth() / 2, other.getWidth() / 2);    //Box 2 half extents
            //Box1 vertices
            var v1 = [
                new Vector2D(-ext1.x,-ext1.y),
                new Vector2D(+ext1.x,-ext1.y),
                new Vector2D(+ext1.x,+ext1.y),
                new Vector2D(-ext1.x,+ext1.y)
            ];
            //Box2 vertices
            var v2 = [
                new Vector2D(-ext2.x,-ext2.y),
                new Vector2D(+ext2.x,-ext2.y),
                new Vector2D(+ext2.x,+ext2.y),
                new Vector2D(-ext2.x,+ext2.y)
            ];

            //------Apply rotation to points-----------------
            var rot1 = new RotationMatrix(this.getRot());
            var rot2 = new RotationMatrix(other.getRot());
            for (var i = 0; i < v1.length; i++) {
                v1[i] = v1[i].vSubtract(this.getOrigin().vSubtract(ext1));
                v1[i] = rot1.apply(v1[i]);
                v1[i] = v1[i].add(this.getPos().x,this.getPos().y);

                v2[i] = v2[i].vSubtract(other.getOrigin().vSubtract(ext2));
                v2[i] = rot2.apply(v2[i]);
                v2[i] = v2[i].add(other.getPos().x,other.getPos().y);
            }
            /*------------------------------------------------------------------------- */

            /*---------Compute unit normals/axis to check for intersection------------- */
            //(********Separating Axis Theorem**********)
            var normals = [
                (RotationMatrix(this.getRot()).apply(new Vector2D(1,0))).normalize(),
                (RotationMatrix(this.getRot()).apply(new Vector2D(0,1))).normalize(),
                (RotationMatrix(other.getRot()).apply(new Vector2D(1,0))).normalize(),
                (RotationMatrix(other.getRot()).apply(new Vector2D(0,1))).normalize()
            ];
            /*------Project Points onto axis------------------------------------------- */
            for (var i = 0; i < 4; i++) { //Loop through axis
                var box1Min = 99999999;
                var box1Max = -99999999;
                var box2Min = 99999999;
                var box2Max = -99999999;

                //----------------Box1----------------
                for (var j = 0; j < 4; j++)  { //Loop through box points
                    var proj = normals[i].dot(v1[j]);  //compute point projection on axis
                    if (proj < box1Min) { box1Min = proj; }
                    if (proj > box1Max) { box1Max = proj; }

                    //----------------Box2----------------
                    var proj = normals[i].dot(v2[j]);
                    if (proj < box2Min) { box2Min = proj; }
                    if (proj > box2Max) { box2Max = proj; }
                }
                if (!(box2Min <= box1Max && box2Max >= box1Min)) {
                    //Axis separation found, ignore remaining axis checks
                    return false; //No collision
                }
            }
            return true; //All axis intersect, collision has occurred
        }
    }
}
