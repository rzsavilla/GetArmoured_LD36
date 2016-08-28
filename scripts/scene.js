/**
 * Created by rzsavilla on 27/08/2016.
 */

function platformCollision(entity,platform) {
    if (entity.bbBot.collision(platform.bb)) {
        //entity.setPos(entity.getPos().x,entity.getPos().y-0.01);
        entity.applyForce(0, -entity.getVelocity().y * entity.getMass() -1);
        //entity.setPos(entity.getPos().x,platform[i].getPos().y - entity.getOrigin().y + 3);
        if (!entity.isJumping()) {
            entity.onGround = true;
        }
    }
    if (entity.bbTop.collision(platform.bb)) {
        entity.setPos(entity.getPos().x,entity.getPos().y+1);
        entity.applyForce(0,Math.abs(entity.getVelocity().y));
    }
    if (platform.type != "floating") {
        if (entity.bbLeft.collision(platform.bb)) {
            entity.setPos(entity.getPos().x + 1, entity.getPos().y);
            entity.applyForce(Math.abs(entity.getVelocity().x) * entity.getMass(), 0);
        }
        else if (entity.bbRight.collision(platform.bb)) {
            entity.setPos(entity.getPos().x - 1, entity.getPos().y);
            entity.applyForce(-(Math.abs(entity.getVelocity().x) * entity.getMass()), 0);
        }
    }
}

/**
 * Scene
 * @constructor
 */
function Scene() {
    var player = new Player(0,0);
    var map = new Map();
    view = new View();
    view.bounds.x = canvas.width / 2;
    view.bounds.y = canvas.height / 2;
    //---------------test------------------

    //-----------------------------------

    this.initialize = function() {
        loadLevel("../levels/test.json",map);
    }
    /**
     * Update scene
     * @param {number} dt Delta time (h)
     */
    this.update = function(dt) {
        map.update(dt);
    }
    /**
     * Render Scene
     * @param c
     */
    this.draw = function(c) {
        c.save();
        view.x = map.player.getPos().x - view.bounds.x;
        view.y = map.player.getPos().y - view.bounds.y;
        if (view.x < 0) {
            view.x = 0;
        } else if (view.x + view.bounds.x - 96 > map.size.x - view.bounds.x) {
            view.x = map.size.x - view.bounds.x * 2 + 96;
        }
        if (view.y < 0) {
            view.y = 0;
        } else if (view.y + view.bounds.y > map.size.y - view.bounds.y) {
            view.y = map.size.y - view.bounds.y * 2;
        }
        c.translate(-view.x,-view.y)

        if (map.layers.length > 0) {
            map.draw(c);
        }
        player.draw(c);
        c.restore();
    }
}