/**
 * Created by rzsavilla on 27/08/2016.
 */

var loaded = false;

function platformCollision(entity,platform) {
    if (entity.bbBot.collision(platform.bb)) {
        //entity.setPos(entity.getPos().x,entity.getPos().y);
        entity.applyForce(0, -Math.abs(entity.getVelocity().y) * entity.getMass());
        entity.onGround = true;
    } else {
        //entity.onGround = false;
        if (entity.bbTop.collision(platform.bb)) {
            entity.setPos(entity.getPos().x,entity.getPos().y+5);
            entity.applyForce(0,Math.abs(entity.getVelocity().y));
            entity.topHit = true;
        } else {
            entity.topHit = false;
        }
    }
    if (platform.type != "floating") {
        if (entity.bbLeft.collision(platform.bb)) {
            if (entity instanceof Enemy) { entity.setFacing("right"); }
            entity.setPos(entity.getPos().x + 1, entity.getPos().y);
            entity.applyForce(Math.abs(entity.getVelocity().x) * entity.getMass(), 0);
        }
        else if (entity.bbRight.collision(platform.bb)) {
            if (entity instanceof Enemy) { entity.setFacing("left"); }
            entity.setPos(entity.getPos().x - 1, entity.getPos().y);
            entity.applyForce(-(Math.abs(entity.getVelocity().x) * entity.getMass()), 0);
        }
    }


}

function setMap(t,map) {
    map.width = t["width"];
    map.height = t["height"];
    map.tilewidth = t["tilewidth"];
    map.tileheight = t["tileheight"];
    map.size = new Vector2D(map.width * map.tilewidth,map.height * map.tileheight);

    //Load Layers
    for (var k = 0; k < t["layers"].length; k++) {
        var l = t["layers"][k];
        var layer = new Layer();
        layer.type = l["type"];
        layer.offset.x = l["x"];
        layer.offset.x = l["y"];
        var counter = 0;
        var pos = new Vector2D(0, 0);
        if (l["type"] == "tilelayer") {
            var d = l["data"];
            for (var j = 1; j < t["height"] + 1; j++) {
                for (var i = 1; i < t["width"] + 1; i++) {
                    var data = d[counter]
                    if (data != 0) {
                        var tile = new Platform(data, pos.x, pos.y);
                        if (tile.collidable) {
                            map.collidables.push(tile);
                        }
                        layer.tiles.push(tile);
                    }
                    pos.x += t["tilewidth"];
                    counter++;
                }
                pos.x = 0;
                pos.y += t["tileheight"];
            }
        }
        /*--------------------LOAD OBJECTS-----------------------------*/
        else if (l["type"] == "objectgroup") {
            var o = l["objects"];
            var type;
            var obj;
            for (var j = 0; j < o.length; j++) {
                type = o[j]["type"];
                if (type == "Player") {
                    map.player = new Player(o[j]["x"],o[j]["y"]);
                    map.collidables.push(map.player);
                    console.log("player loaded");
                } else if (type == "ShieldPickUp") {
                    obj = (new ShieldPickUp(o[j]["x"],o[j]["y"]));
                    map.pickups.push(obj);
                    if (obj.collidable) {
                        map.collidables.push(obj);
                    }
                } else if (type == "Blob") {
                    obj = (new Blob(o[j]["x"],o[j]["y"]))
                    map.enemies.push(obj);
                    if (obj.collidable) {
                        map.collidables.push(obj);
                    }
                } else if (type == "Portal") {
                    obj = (new Portal(o[j]["x"],o[j]["y"]))
                    map.portal = (obj);
                    if (obj.collidable) {
                        map.collidables.push(obj);
                    }
                }
            }
        }
        /*-------------------------------------------------------------*/
        map.layers.push(layer);
    }
    //console.log(map.collidables);
    //console.log(map.collidables.length);
    console.log("Loading Complete");
    loaded = true;
}

function loadLevel(file, map) {
    var obj = new XMLHttpRequest();
    obj.open('GET',file,true);
    obj.onreadystatechange = function() {
        if (obj.readyState == 4 && obj.status == "200") {
            var textFile = (obj.responseText);
            setMap(JSON.parse(textFile),map);
        } else {
            console.log("loading Level")
            loaded = false;
        }
    };
    obj.send(null);
}

function Layer() {
    this.type;
    this.offset = new Vector2D(0,0);
    this.tiles = [];         //Tiles
    this.objects = [];

    this.draw = function(c) {
        for (var i = 0; i < this.tiles.length; i++) {
            var pos = this.tiles[i].getPos();
            if (pos.x >= view.getBX().x && pos.x <= view.getBX().y) {
                this.tiles[i].draw(c);
            }
        }
    }
}

function collisionCheck(pairs) {
    //console.log(pairs);
    var b1,b2;
    for (var i = 0; i < pairs.length; i++) {
        b1 = pairs[i][0];
        b2 = pairs[i][1];
        if (b1 instanceof Entity) {
            if (b2 instanceof  Platform) {
                if (b2.type == "death") {
                    console.log("DEATH");
                    if (b1 instanceof Player) {
                        b1.death = true;
                    }
                }
                platformCollision(b1,b2);
            } else if (b2 instanceof Enemy) {
                if (b1 instanceof  Player) {
                    b1.takeDamage();
                }
            } else if (b2 instanceof ShieldPickUp) {
                if (b1 instanceof  Player) {
                    if (!b2.collected) {
                        b1.armourUp();
                        b2.collected = true;
                        b2.destroy = true;
                    }
                }
            } else if (b2 instanceof Portal) {
                if (b1 instanceof Player) {
                    if (b2.activated) {
                        nextLevel = true;
                    }
                }
            }
        } else if (b2 instanceof Entity) {
            if (b1 instanceof  Platform) {
                if (b1.type == "death") {
                    console.log("DEATH");
                    if (b2 instanceof Player) {
                        b2.death = true;
                    }
                }
                platformCollision(b2,b1);
            }  else if (b1 instanceof Enemy) {
                if (b2 instanceof  Player) {
                    b2.takeDamage();
                }
            }
            else if (b1 instanceof ShieldPickUp) {
                if (b2 instanceof Player) {
                    if (!b1.collected) {
                        b2.armourUp();
                        b1.collected = true;
                        b1.destroy = true;
                    }
                }
            }
            else if (b1 instanceof Portal) {
                if (b2 instanceof Player) {
                    if (b1.activated) {
                        nextLevel = true;
                    }
                }
            }
        }
    }
}

function Map() {
    this.width;
    this.height;
    this.tilewidth;
    this.tileheight;
    this.layers = [];
    this.size = new Vector2D(0,0);
    this.player = new Player();
    this.pickups = [];
    this.enemies = [];
    this.platforms = [];
    this.collidables = [];
    this.portal = new Portal();

    this.detector = new BroadPhase.HashGrid(1024,640,32,32);
    //this.detector = new BroadPhase.HashGrid(1024,640,32,32);

    this.update = function(dt) {
        //console.log(a);
        var gravity = 20.0;
        this.player.applyForce(0,gravity * this.player.getMass());
        for (var j = 0; j < this.enemies.length; j++) {
            this.enemies[j].applyForce(0,gravity * this.enemies[j].getMass())
        }

        if (this.layers.length > 0) {
            if (this.platforms.length <= 0) {
                this.platforms = this.layers[0].tiles;
            }
        }
        //Enemy spots player
        for (var i = 0; i < this.enemies.length;i++) {
            if (this.enemies[i].spot(this.player)) {
                if (!this.enemies[i].isJumping()) {
                    this.enemies[i].jump();
                }
                if (this.enemies[i].getPos().x < this.player.getPos().x) {
                    this.enemies[i].setFacing("right");
                } else { this.enemies[i].setFacing("left"); }
            }
        }

        collisionCheck(this.collisions = this.detector.check(this.collidables));

        for (var i = 0; i < this.enemies.length;i++) {
            this.enemies[i].update(dt);
        }
        if (this.player.shoot) {
            this.player.shoot = false;
            console.log("Shoot");
        }
        this.player.update(dt);

        if (this.player.armourLevel == 3) {
            this.portal.activated = true;
        }

        for (var i = 0; i < this.pickups.length; i++) {

        }
        this.portal.update();
    }

    this.draw = function(c) {
        for (var i = 0;i <this.layers.length ; i++) {
            this.layers[i].draw(c);
        }
        for (var i = 0; i < this.pickups.length; i++) {
            if (!this.pickups[i].collected) {
                this.pickups[i].draw(c);
            }
        }
        for (var i = 0; i < this.enemies.length;i++) {
            this.enemies[i].draw(c);
        }
        this.portal.draw(c);
        this.player.draw(c);
    }
}