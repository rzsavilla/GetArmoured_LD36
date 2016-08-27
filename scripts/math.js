/**
 * Created by rzsavilla on 27/08/2016.
 */

function Vector2D(x,y) {
    this.x = x;
    this.y = y;

    /**
     * Add seperate x and y elements
     * @param {number} x
     * @param {number} y
     * @returns {Vector2D}
     */
    this.add = function(x,y) {
        return new Vector2D(this.x + x,this.y + y);
    }
    /**
     * Subtract seperate x and y elements
     * @param {number} x
     * @param {number} y
     * @returns {Vector2D}
     */
    this.subtract = function(x,y) {
        return new Vector2D(this.x - x,this.y - y);
    }
    /**
     * Multiply seperate x and y elements
     * @param {number} x
     * @param {number} y
     * @returns {Vector2D}
     */
    this.multiply = function(x,y) {
        return new Vector2D(this.x * x,this.y * y);
    }
    /**
     * Divide seperate x and y elements
     * @param {number} x
     * @param {number} y
     * @returns {Vector2D}
     */
    this.divide = function(x,y) {
        if (x == 0) {x = 1;}
        if (y == 0) {y = 1;}
        return new Vector2D(this.x / x,this.y / y);
    }
    /**
     * Scalar addition
     * @param {number} num
     */
    this.sAdd = function(num) {
        return new Vector2D(this.x + num, this.y + num);
    }
    /**
     * Scalar subtraction
     * @param {number} num
     */
    this.sSubtract = function(num) {
        return new Vector2D(this.x + num, this.y + num);
    }
    /**
     * Scalar multiplication
     * @param {number} num
     */
    this.sMultiply  = function(num) {
        return new Vector2D(this.x + num, this.y + num);
    }
    /**
     * Scalar division
     * @param {number} num
     */
    this.sDivide = function(num) {
        if(num == 0) { num = 1; } //Prevent Divide by zero error
        return new Vector2D(this.x + num, this.y + num);
    }

    /**
     * Addition with another vector
     * @param {Vector2D} other
     * @returns {Vector2D}
     */
    this.vAdd = function(other) {
        return new Vector2D(this.x + other.x,this.y + other.y);
    }
    /**
     * Subtraction with another vector
     * @param {Vector2D} other
     * @returns {Vector2D}
     */
    this.vSubtract = function(other) {
        return new Vector2D(this.x - other.x,this.y - other.y);
    }
    /**
     * Multiplication with another vector
     * @param {Vector2D} other
     * @returns {Vector2D}
     */
    this.vMultiply = function(other) {
        return new Vector2D(this.x * other.x,this.y * other.y);
    }

    /**
     * Return vector magnitude
     * @returns {number}
     */
    this.magnitude = function() {
        // |v| = sqrt(x^2 + y^2)
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * Returns normalized vector
     * @returns {Vector2D}
     */
    this.normalize = function() {
        var mag = this.magnitude();
        return new Vector2D(this.x / mag, this.y / mag);
    }

    /**
     * Return dot product
     * @param {Vector2D} vector
     * @returns {number}
     */
    this.dot = function(vector) {
        return ((this.x * vector.x) + (this.y * vector.y));
    }
}

/**
 * 2D Transformation Matrix
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @constructor
 */
function Transform(x1,y1,tx,x2,y2,ty) {
    var i = [
        x1,y1,tx,
        x2, y2,ty,
    ];

    /**
     * Apply transformation and return transformed vector
     * @param {Vector2D} vector
     */
    this.apply = function(vector) {
        return new Vector2D(
            (i[0] * vector.x) + (i[1] * vector.y) + i[2],
            (i[3] * vector.x) + (i[4] * vector.y) + i[5]
        )
    }
}

/**
 * Return RotationMatrix matrix
 * @param {number} degrees
 * @returns {Transform}
 * @constructor
 */
function RotationMatrix(degrees) {
    var rad = (degrees * (Math.PI / 180));
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    return new Transform(
        cos,-sin,0,
        sin,cos,0
    )
}

/**
 * Returns Translation matrix
 * @param {number} x
 * @param {number} y
 * @returns {Transform}
 * @constructor
 */
function TranslationMatrix(x,y) {
    return new Transform(1,0,x,0,1,y);
}

function Timer() {
    var start = new Date().getTime();

    this.reset = function() {
        start = new Date().getTime();
    }

    this.getElapsed = function() {
        return (new Date().getTime() - start);
    }
}