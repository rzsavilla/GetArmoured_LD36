/**
 * Created by rzsavilla on 27/08/2016.
 */

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
                        layer.tiles.push(new Platform(data, pos.x, pos.y));
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
            for (var j = 0; j < o.length; j++) {
                type = o[j]["type"];
                if (type == "Player") {
                    map.player = new Player(o[j]["x"],o[j]["y"]);
                } else if (type == "ShieldPickUp") {
                    map.pickups.push(new ShieldPickUp(o[j]["x"],o[j]["y"]));
                }
            }
        }
        /*-------------------------------------------------------------*/
        map.layers.push(layer);
    }
}

function loadLevel(file, map) {
    var obj = new XMLHttpRequest();
    obj.open('GET',file,true);
    obj.onreadystatechange = function() {
        if (obj.readyState == 4 && obj.status == "200") {
            var textFile = (obj.responseText);
            setMap(JSON.parse(textFile),map);
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

function Map() {
    this.width;
    this.height;
    this.tilewidth;
    this.tileheight;
    this.layers = [];
    this.size = new Vector2D(0,0);
    this.player = new Player();
    this.pickups = [];
    var platforms = [];

    this.update = function(dt) {
        var gravity = 20.0;
        this.player.applyForce(0,gravity * this.player.getMass())

        if (this.layers.length > 0) {
            if (platforms.length <= 0) {
                platforms = this.layers[0].tiles;
            }
            for (var i = 0; i < platforms.length; i++) {
                platformCollision(this.player, platforms[i]);
            }
        }

        this.player.update(dt);
    }

    this.draw = function(c) {

        for (var i = 0;i <this.layers.length ; i++) {
            this.layers[i].draw(c);
        }

        for (var i = 0; i < this.pickups.length; i++) {
            this.pickups[i].draw(c);
        }
        this.player.draw(c);
    }
}