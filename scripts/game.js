/**
 * Created by rzsavilla on 27/08/2016.
 */

//Canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

var timer = new Timer();
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
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    scene.draw(ctx);
    ctx.restore();
}

/**
 * The Game Loop
 */
function loop(){
    var dt = timer.getElapsed() / 1000.0;   //delta time in seconds (variable)
    dt = 1/60;
    update(dt);
    render();
    window.requestAnimationFrame(loop);
    timer.reset();
}

/**
 * Start Game Loop
 */
window.requestAnimationFrame(loop);