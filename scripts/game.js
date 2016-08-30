/**
 * Created by rzsavilla on 27/08/2016.
 */
//Canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

var timer = new Timer();
var updateTimer = new Timer();
var scene = new Scene();
scene.initialize();

/**
 * Updates game logic
 * @param {number} delta
 */
function update(delta) {
    if (timer.getElapsed() > 1000) { timer.reset(); }
    scene.update(delta);
}

/**
 * Draw Game
 */
function render() {
    //Clear Canvas
    ctx.save();
    ctx.fillStyle = "#ccf3ff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    scene.draw(ctx);
    ctx.restore();
}

/**
 * The Game Loop
 */
function loop(){
    var dt;
    //dt = timer.getElapsed() / 1000.0;   //delta time in seconds (variable)
    dt = 1/60; //Fixed
    update(dt);
    updateTimer.reset();
    render();
    window.requestAnimationFrame(loop);
    timer.reset();
}

/**
 * Start Game Loop
 */
var i = 0;
window.onload = function () {
    if(!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }
}

window.requestAnimationFrame(loop);