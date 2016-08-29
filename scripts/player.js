/**
 * Created by rzsavilla on 28/08/2016.
 */

Player.prototype= new Entity();
Player.prototype.constructor=Player;
function Player(x,y) {
    Entity.call(this);
    this.armourLevel = 0;
    this.collidable = true;
    this.objectType = "player";

    this.setPos(x,y);
    this.setSpeed(2000);
    this.setMass(50);
    this.setFrictionX(15);
    //this.setJumpTick(10);
    this.setJumpForce(1000);

    var x = 14;
    var y = 46
    this.bb.setSize(x,y);
    this.bb.setOrigin(x / 2,y );
    this.bb.setRot(this.getRot());
    this.bb.setScale(this.getScale().x,this.getScale().y);

    this.bbSet = false;

    this.setAnimation(playerAnim[0]); //Starting animation

    this.updateBB = function() {
        var pos = this.getPos();
        this.bbTop.setPos(pos.x, this.getPos().y - 50);
        this.bbBot.setPos(pos.x,this.getPos().y - 2)
        this.bbLeft.setPos(pos.x - 2 - 5,this.getPos().y - 25);
        this.bbRight.setPos(pos.x + 5, this.getPos().y - 25);

        this.bbLeft.setOrigin(0,this.bbLeft.getHeight() / 2);
        this.bbRight.setOrigin(0,this.bbRight.getHeight() / 2);
    }

    this.update = function(dt) {
        this.bb.setPos(this.getPos().x,this.getPos().y);
        if (!this.bbSet) {
            this.bbTop.setSize(5,2);
            this.bbBot.setSize(5,2);
            this.bbLeft.setSize(2,35);
            this.bbRight.setSize(2,35);
            this.bbTop.setOrigin(this.bbTop.getWidth() / 2,this.bbTop.getHeight() / 2);
            this.bbBot.setOrigin(this.bbBot.getWidth() / 2,this.bbBot.getHeight() /  2);
            this.bbSet = true;
        }
        //Update bounding boxes
        var frame = this.getAnimation().frames[this.getCurrFrame()]
        this.setOrigin(frame.size.x / 2, frame.size.y); //Update origin based on frame size (center,bottom)
        this.updateEntity(dt);
        this.updateBB();
        //------------Key Press Movement and Animation change -------------------------
        var j = 0;
        if (this.armourLevel == 1) { j = 6; }
        else if (this.armourLevel == 2) { j = 12; }
        else if (this.armourLevel == 3) { j = 18; }

        if (spaceKey) {
            this.jump();
            spaceKey = false;
        }
        if (aKey) {
            if (!this.isJumping()) { //Set Animation
                if (this.getAnimation() != playerAnim[j + 4]) { this.setAnimation(playerAnim[j + 4]); }
            }
            this.moveLeft();
        }
        else if (dKey) {
            if (!this.isJumping()) {
                if (this.getAnimation() != playerAnim[j + 1]) {
                    this.setAnimation(playerAnim[j + 1]);
                }
            }
            this.moveRight();
        }

        //Idle
        if (!this.onFloor()) {
            if (this.isFacing() == "left") {
                if (this.getAnimation() != playerAnim[j + 5]) {
                    this.setAnimation(playerAnim[j + 5]);
                }
            } else {
                if (this.getAnimation() != playerAnim[j + 2]) {
                    this.setAnimation(playerAnim[j + 2]);
                }
            }
        }
        else if (this.getVelocity().x < 1 && this.getVelocity().x > -1) {
            //Set Idle animation
            if (this.isFacing() == "left") {
                if (this.getAnimation() != playerAnim[j + 3]) {
                    this.setAnimation(playerAnim[j + 3]);
                }
            }
            else if (this.isFacing() == "right") {
                if (this.getAnimation() != playerAnim[j]) {
                    this.setAnimation(playerAnim[j]);
                }
            }
        }
    }
}