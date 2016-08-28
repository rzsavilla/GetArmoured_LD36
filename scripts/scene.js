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
    var platforms;
    var map = new Map();
    view = new View();
    view.bounds.x = canvas.width / 2;
    view.bounds.y = canvas.height / 2;
    //---------------test------------------
    var shieldSprite = new Image();
    shieldSprite.src = "../assets/shield.png";
    shieldSprite.width = 120;
    shieldSprite.height = 30;
    var shield = new Entity();
    animShield = new Animation(0.1,shieldSprite);
    animShield.set(4,0,0,30,30);
    shield.setAnimation(animShield);
    shield.setPos(100,80);
    //-----------------------------------

    this.initialize = function() {
        loadLevel("../levels/test.json",map);

        player = new Player(100,600);
        platforms = [];
        if (map.layers.length > 0) {
            platforms = map.layers[0].tiles;
        }
    }
    /**
     * Update scene
     * @param {number} dt Delta time (h)
     */
    this.update = function(dt) {
        if (map.layers.length > 0) {
            platforms = map.layers[0].tiles;
        }

        var gravity = 20.0;
        player.applyForce(0,gravity * player.getMass())

        for (var i = 0; i < platforms.length; i++) {
            platformCollision(player,platforms[i]);
        }

        //------------Collision------------------//

        /*---------------Key Press-----------*/
        player.update(dt);

        //view.setPos(-player.getPos().x + view.bounds.x / 2,-player.getPos().y + view.getBounds().y /2);
    }
    /**
     * Render Scene
     * @param c
     */
    this.draw = function(c) {
        c.save();
        view.x = player.getPos().x - view.bounds.x;
        view.y = player.getPos().y - view.bounds.y;

        console.log(view.bounds.x);
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

        //console.log(view.x);

        for (var i = 0; i < platforms.length; i++) {
            //platforms[i].draw(c);
        }

        if (map.layers.length > 0) {
            map.draw(c);
        }
        player.draw(c);
        shield.draw(c);
        c.restore();
    }
}