/**
 * Created by rzsavilla on 27/08/2016.
 */

function setMap(t,map) {
    map.width = t["width"];
    map.height = t["height"];
    map.tilewidth = t["tilewidth"];
    map.tileheight = t["tileheight"];

    //Load Layers
    for (var i = 0; i < t["layers"].length; i++) {
        var l = t["layers"][i];
        console.log(i);
        //console.log("tilelayer");
        var layer = new Layer();
        layer.type = l["type"];
        layer.offset.x = l["x"];
        layer.offset.x = l["y"];
        var counter = 0;
        var pos = new Vector2D(0, 0);
        var d = l["data"];
        for (var j = 1; j < t["height"] + 1; j++) {
            for (var i = 1; i < t["width"] + 1; i++) {
                var data = d[counter]
                if (l["type"] == "tilelayer") {
                    if (data != 0) {
                        layer.tiles.push(new Platform(data, pos.x, pos.y));
                    }
                }
                else if (l["type"] == "objectgroup") {

                }
                else if (l["type"] == "imagelayer") {

                }
                pos.x += t["tilewidth"];
                counter++;
            }
            pos.x = 0;
            pos.y += t["tileheight"];
        }
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
            this.tiles[i].draw(c)
        }
    }
}

function Map() {
    this.width;
    this.height;
    this.tilewidth;
    this.tileheight;
    this.layers = [];

    this.draw = function(c) {
        for (var i = 0;i <this.layers.length ; i++) {
            this.layers[i].draw(c);
        }
    }
}