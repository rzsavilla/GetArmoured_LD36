/**
 * Created by rzsavilla on 28/08/2016.
 */

function View(x,y,width,height,originX,originY,boundX,boundY) {
    this.pos = new Vector2D(x,y);
    this.size = new Vector2D(width,height);
    this.origin = new Vector2D(originX,originY);
    this.bounds = new Vector2D(boundX,boundY);
    this.bX = new Vector2D(
        (this.pos.x + this.bounds),
        (this.pos.x + this.bounds)
    );
    /**
     * Get global bounds X
     */
    this.getBX = function() {
        return new Vector2D(this.x - 32,this.x + this.bounds.x * 2);
    }
    this.getBY = function() {
        return new Vector2D(this.y,this.y + this.bounds.y * 2);
    }

}

var view = new View();