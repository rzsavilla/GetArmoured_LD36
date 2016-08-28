/**
 * Created by rzsavilla on 28/08/2016.
 */

/*---------------Load IMAGES-------------------*/
var spriteSheet = new Image();
spriteSheet.width = 124;
spriteSheet.height = 94;
spriteSheet.src = "../assets/spritesheet.png";

var blobImage = new Image();
blobImage.src = "../assets/blob.png";

/*--------------------------------------------*/

/*--------------Player Animations----------------------*/
var playerAnim = [];
function loadPlayerAnimations() {
    var anim;
    //Right - Plain
    anim = new Animation(0,spriteSheet);   //idle
    anim.addFrame(0,0,14,46);
    playerAnim.push(anim);
    anim = new Animation(0.08,spriteSheet); //Move
    anim.addFrame(32,0,14,46);
    anim.addFrame(47,0,20,46);
    anim.addFrame(67,0,16,46);
    anim.addFrame(83,0,14,46);
    anim.addFrame(97,0,14,46);
    anim.addFrame(111,0,14,46);
    playerAnim.push(anim);
    anim = new Animation(0,spriteSheet);   //Jump
    anim.addFrame(14,0,16,46);
    playerAnim.push(anim);
    //Left - Plain
    anim = new Animation(0,spriteSheet);   //idle
    anim.addFrame(0,46,14,46);
    playerAnim.push(anim);
    anim = new Animation(0.08,spriteSheet); //move
    anim.addFrame(32,46,14,46);
    anim.addFrame(47,46,20,46);
    anim.addFrame(67,46,16,46);
    anim.addFrame(83,46,14,46);
    anim.addFrame(97,46,14,46);
    anim.addFrame(111,46,14,46);
    playerAnim.push(anim);
    anim = new Animation(0,spriteSheet);  //jump
    anim.addFrame(14,46,18,46);
    playerAnim.push(anim);

    //Right - A1 (Armoured 1)
    anim = new Animation(0,spriteSheet);    //Idle
    anim.addFrame(0,92,15,46);
    playerAnim.push(anim);
    anim = new Animation(0.08,spriteSheet); //Move
    anim.addFrame(33,92,15,46);
    anim.addFrame(48,92,20,46);
    anim.addFrame(68,92,16,46);
    anim.addFrame(84,92,15,46);
    anim.addFrame(99,92,15,46);
    anim.addFrame(114,92,15,46);
    playerAnim.push(anim);
    anim = new Animation(0,spriteSheet);   //Jump
    anim.addFrame(15,92,18,46);
    playerAnim.push(anim);

    //Left - A1 (Armoured 1)
    anim = new Animation(0,spriteSheet);    //Idle
    anim.addFrame(0,138,15,46);
    playerAnim.push(anim);
    anim = new Animation(0.08,spriteSheet); //Move
    anim.addFrame(33,138,15,46);
    anim.addFrame(48,138,20,46);
    anim.addFrame(68,138,16,46);
    anim.addFrame(84,138,15,46);
    anim.addFrame(99,138,15,46);
    anim.addFrame(114,138,15,46);
    playerAnim.push(anim);
    anim = new Animation(0,spriteSheet);   //Jump
    anim.addFrame(15,138,18,46);
    playerAnim.push(anim);

    //Right - A2 (Armoured 2)
    anim = new Animation(0,spriteSheet);    //Idle
    anim.addFrame(0,184,15,46);
    playerAnim.push(anim);
    anim = new Animation(0.08,spriteSheet); //Move
    anim.addFrame(33,184,15,46);
    anim.addFrame(48,184,20,46);
    anim.addFrame(68,184,16,46);
    anim.addFrame(85,184,15,46);
    anim.addFrame(100,184,15,46);
    anim.addFrame(115,184,15,46);
    playerAnim.push(anim);
    anim = new Animation(0,spriteSheet);   //Jump
    anim.addFrame(15,184,18,46);
    playerAnim.push(anim);

    //Left - A2 (Armoured 2)
    anim = new Animation(0,spriteSheet);    //Idle
    anim.addFrame(0,230,15,46);
    playerAnim.push(anim);
    anim = new Animation(0.08,spriteSheet); //Move
    anim.addFrame(33,230,15,46);
    anim.addFrame(48,230,20,46);
    anim.addFrame(68,230,16,46);
    anim.addFrame(85,230,15,46);
    anim.addFrame(100,230,15,46);
    anim.addFrame(115,230,15,46);
    playerAnim.push(anim);
    anim = new Animation(0,spriteSheet);   //Jump
    anim.addFrame(15,230,18,46);
    playerAnim.push(anim);

    //Right - A3 (Armoured 3)
    anim = new Animation(0,spriteSheet);    //Idle
    anim.addFrame(0,276,16,45);
    playerAnim.push(anim);
    anim = new Animation(0.08,spriteSheet); //Move
    anim.addFrame(38,276,16,45);
    anim.addFrame(54,276,20,45);
    anim.addFrame(74,276,17,45);
    anim.addFrame(91,276,16,45);
    anim.addFrame(107,276,16,45);
    anim.addFrame(123,276,16,45);
    playerAnim.push(anim);
    anim = new Animation(0,spriteSheet);   //Jump
    anim.addFrame(16,276,22,45);
    playerAnim.push(anim);

    //Left - A3 (Armoured 3)
    anim = new Animation(0,spriteSheet);    //Idle
    anim.addFrame(0,321,16,45);
    playerAnim.push(anim);
    anim = new Animation(0.08,spriteSheet); //Move
    anim.addFrame(38,321,16,45);
    anim.addFrame(54,321,20,45);
    anim.addFrame(74,321,17,45);
    anim.addFrame(91,321,16,45);
    anim.addFrame(107,321,16,45);
    anim.addFrame(123,321,16,45);
    playerAnim.push(anim);
    anim = new Animation(0,spriteSheet);   //Jump
    anim.addFrame(16,321,22,45);
    playerAnim.push(anim);
}
loadPlayerAnimations();
/*-----------------------------------------------------*/

var enemyAnim = [];
function loadEnemyAnim() {

}

/*--------------------Object Animations----------------*/
/////////Shield Pick UP/////////
var shieldImage = new Image;
shieldImage.src = "../assets/shield.png"
var shieldAnim = new Animation(0.18,shieldImage);
shieldAnim.set(4,0,0,30,30);
/*-----------------------------------------------------*/