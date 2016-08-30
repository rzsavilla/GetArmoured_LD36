/**
 * Created by rzsavilla on 27/08/2016.
 */


/**
 * Scene
 * @constructor
 */

var nextLevel = false;
function Scene() {
    var map = new Map();
    var loadingScreen = new LoadingScreen();
    var pauseScreen = new PauseScreen();
    var endScreen = new EndScreen();
    var level = 1;
    var paused = false;
    var gridLoaded = false;
    var timer = new Timer();

    view = new View();
    view.bounds.x = canvas.width / 2;
    view.bounds.y = canvas.height / 2;
    //---------------test------------------

    //-----------------------------------

    this.initialize = function() {
        nextLevel = false;
        timer.reset();
        loaded = false;
        gridLoaded = false;
        map = new Map();
        if (level == 1) {
            loadLevel("../levels/level1.json",map);
        }
        else if (level == 2) {
            loadLevel("../levels/level2.json", map);
        }
        else if (level == 3) {
            loadLevel("../levels/level3.json", map);
        }
        else if (level == 4) {
            loadLevel("../levels/level4.json", map);
        }
        else if (level == 5) {

        }

    }
    /**
     * Update scene
     * @param {number} dt Delta time (h)
     */
    this.update = function(dt) {
        if (loaded && timer.getElapsed() / 1000 > 3.0) {
            if (escKey) {
                if (paused) {
                    paused = false;
                } //Pause
                else {
                    paused = true;
                }         //UnPause
                escKey = false;
            }

            if (!paused) {
                if (key1) {
                    if (level != 1) {
                        level = 1;
                        this.initialize();
                    }
                } else if (key2) {
                    if (level != 2) {
                        level = 2;
                        this.initialize();
                    }
                }
                map.update(dt);
            }
            if (!gridLoaded) {
                map.detector = new BroadPhase.HashGrid(map.width,map.height,32,32);
                gridLoaded = true;
            }
            if (nextLevel == true || jKey) {
                level++;
                this.initialize();
            }
            if (map.player.death) {
                this.initialize();
            }
        }
    }
    /**
     * Render Scene
     * @param c
     */
    this.draw = function(c) {
        if (loaded && timer.getElapsed() / 1000 > 3.0) {
            if (!paused) {
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
                c.translate(-view.x, -view.y)

                if (map.layers.length > 0) {
                    map.draw(c);
                }
                c.restore();
            }
        }
        if (!loaded || timer.getElapsed() / 1000 < 2.0) {
            loadingScreen.draw(c);
        }

        if (paused) {
            pauseScreen.draw(c);
        }
        if (level == 5) {
            endScreen.draw(c);
        }
    }
}