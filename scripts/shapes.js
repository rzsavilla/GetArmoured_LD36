/**
 * Created by rzsavilla on 27/08/2016.
 */


Shape.prototype = new Movable();
Shape.prototype.constructor=Shape;
function Shape() {
    Movable.call(this);
    var colour = "Red";
    this.setColour = function(newColour) {
        colour = newColour;
    }
    this.getColour = function() { return colour; }
}

Rectangle.prototype = new Shape();
Rectangle.prototype.constructor=Rectangle;
function Rectangle(x,y,width,height) {
    Shape.call(this);
    this.setPos(x,y);
    this.balls = [new Circle(0,0,5),new Circle(0,0,5),new Circle(0,0,5),new Circle(0,0,5)];
    var size = new Vector2D(width,height);

    /***
     * Set Rectangle Width and Height
     * @param newWidth
     * @param newHeight
     */
    this.setSize = function(newWidth, newHeight) {
        size.x = newWidth;
        size.y = newHeight;
    }
    /**
     * Set rectangle Width
     * @param {number} newWidth
     */
    this.setWidth = function(newWidth) { size.x = newWidth }
    /**
     * Set Rectangle Height
     * @param {number} newHeight
     */
    this.setHeight = function(newHeight) { size.y = newHeight; }

    this.getSize = function () {
        return size;
    }
    /**
     * Return rectangle width
     * @returns {number}
     */
    this.getWidth = function() { return size.x; }
    /**
     * Return rectangle height
     * @returns {number}
     */
    this.getHeight = function() { return size.y; }

    this.draw = function(c) {
        c.save();
        c.translate(this.getPos().x,this.getPos().y);
        c.rotate(this.getRot() * (Math.PI / 180));      //Apply rotation
        //Draw Rect
        c.fillStyle = this.getColour();
        c.fillRect(
            -this.getOrigin().x * this.getScale().x,
            -this.getOrigin().y * this.getScale().y,
            this.getWidth() * this.getScale().x, this.getHeight() * this.getScale().y
        );
        c.restore();
        for (var i = 0; i < this.balls.length; i++) {
            this.balls[i].draw(c);
        }
    }
}

Circle.prototype = new Shape();
Circle.prototype.constructor=Circle;
function Circle(x,y,radius) {
    Shape.call(this);
    this.setPos(x,y);
    this.setColour("Blue");
    var radius = radius;

    /**
     * Set radius of the circle
     * @param {number} newRadius
     */
    this.setRadius = function(newRadius) { radius = newRadius; }

    /**
     * Return radius of the circle
     * @returns {number}
     */
    this.getRadius = function() { return radius; }

    this.draw = function(c) {
        c.fillStyle = this.getColour();
        c.beginPath();
        c.arc(this.getPos().x,this.getPos().y,radius,0,2*Math.PI);
        c.fill();
    }
}