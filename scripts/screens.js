/**
 * Created by rzsavilla on 28/08/2016.
 */

Text.prototype = new Transformable();
Text.prototype.constructor=Text;
function Text(x,y,setString,setFont) {
    Transformable.call(this);   //Super
    var string = setString;
    var font = setFont;
    this.colour = "red";

    this.setString = function(newString) {
        string = newString;
    }
    this.setFont = function(newFont) {
        font = newFont;
    }

    this.draw = function(c) {
        c.font = font;
        c.fillStyle = this.colour;
        ctx.textAlign = "center";
        c.fillText(string,x,y);
    }
}

function LoadingScreen() {
    var text = new Text(canvas.width / 2, canvas.height / 2,"LOADING","100px Arial");
    text.colour = ("white");
    this.draw = function(c) {
        c.fillStyle = "black"
        c.fillRect(0,0,canvas.width,canvas.height);
        text.draw(c);
    }
}

function PauseScreen() {
    var text = new Text(canvas.width / 2, canvas.height / 2,"PAUSED","100px Arial");
    text.colour = "white";
    this.draw = function(c) {
        c.fillStyle = "black"
        c.fillRect(0,0,canvas.width,canvas.height);
        text.draw(c);
    }
}


function EndScreen() {
    var text = new Text(canvas.width / 2, canvas.height / 2,"Thanks for Playing","50px Arial");
    text.colour = "white";
    this.draw = function(c) {
        c.fillStyle = "black"
        c.fillRect(0,0,canvas.width,canvas.height);
        text.draw(c);
    }
}