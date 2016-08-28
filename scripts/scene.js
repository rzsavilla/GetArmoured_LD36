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
    var player = new Player();
    var platforms;
    var map = new Map();

    //---------------------------------
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

        player = new Player();
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

        /*
        for (var i = 0; i < platforms.length; i++) {
            if (player.bbBot.collision(platforms[i].bb)) {
                //player.setPos(player.getPos().x,player.getPos().y-0.01);
                player.applyForce(0, -player.getVelocity().y * player.getMass() -1);
                //player.setPos(player.getPos().x,platforms[i].getPos().y - player.getOrigin().y + 3);
                if (!player.isJumping()) {
                    player.onGround = true;
                }
            }
            if (player.bbTop.collision(platforms[i].bb)) {
                player.setPos(player.getPos().x,player.getPos().y+1);
                player.applyForce(0,Math.abs(player.getVelocity().y));
            }
            if (player.bbLeft.collision(platforms[i].bb)) {
                player.setPos(player.getPos().x + 1,player.getPos().y);
                player.applyForce(Math.abs(player.getVelocity().x) * player.getMass(),0);
            }
            else if (player.bbRight.collision(platforms[i].bb)) {
                player.setPos(player.getPos().x - 1,player.getPos().y);
                player.applyForce(-(Math.abs(player.getVelocity().x) * player.getMass()),0);
            }
        }
        */
        //------------Collision------------------//

        /*---------------Key Press-----------*/
        player.update(dt);
    }
    /**
     * Render Scene
     * @param c
     */
    this.draw = function(c) {
        for (var i = 0; i < platforms.length; i++) {
            platforms[i].draw(c);
        }
        map.draw(c);
        player.draw(c);
        shield.draw(c);
    }
}