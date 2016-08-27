/**
 * Created by rzsavilla on 27/08/2016.
 */

/**
 * Scene
 * @constructor
 */
function Scene() {
    var player = new Player();
    var platforms = [];

    this.initialize = function() {
        player = new Player();
        platforms = [];

        player.setPos(50,150);
        player.setSpeed(500);
        player.setMass(20);
        player.setFrictionX(15);

        for (var i = 0; i < 20; i++) {
            platforms.push(new Platform(0,i*32,200));
        }
        platforms.push(new Platform(0,200,100));
        platforms.push(new Platform(0,100,150));
        platforms.push(new Platform(0,0,150));
        platforms.push(new Platform(0,0,100));

        platforms.push(new Platform(0,450,100));
        platforms.push(new Platform(0,450,150));

    }
    /**
     * Update scene
     * @param {number} dt Delta time (h)
     */
    this.update = function(dt) {
        var gravity = 20.0;
        player.applyForce(0,gravity * player.getMass())


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
                player.applyForce(0,Math.abs(player.getVelocity().y) * player.getMass());
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

        if (player.getPos().y > 300) {
            player.applyForce(0, -player.getVelocity().y);
            player.setPos(player.getPos().x,300);
        }
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

        player.draw(c);
    }
}