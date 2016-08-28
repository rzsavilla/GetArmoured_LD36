/**
 * Created by rzsavilla on 28/08/2016.
 */

Player.prototype= new Entity();
Player.prototype.constructor=Player;
function Player(x,y) {
    Entity.call(this);
    this.armourLevel = 3;

    this.setPos(x,y);
    this.setSpeed(2000);
    this.setMass(50);
    this.setFrictionX(15);
    this.setJumpTick(10);
    this.setJumpForce(1100);

    this.bbLeft = new AABB();
    this.bbRight = new AABB();
    this.bbTop = new AABB();
    this.bbBot = new AABB();

    this.setAnimation(animRight); //Starting animation

    this.updateBB = function() {
        var extent = this.getFrameSize().divide(2,2);
        var pos = this.getPos();
        this.bbTop.setSize(extent.x / 1.2,2);
        this.bbBot.setSize(extent.x / 1.2,5);
        this.bbLeft.setSize(2,extent.y);
        this.bbRight.setSize(2,extent.y);
        this.bbTop.setPos(pos.x, this.getPos().y - extent.y * 2);
        this.bbBot.setPos(pos.x,this.getPos().y)
        this.bbLeft.setPos(pos.x - extent.x - 1,this.getPos().y - extent.y);
        this.bbRight.setPos(pos.x + extent.x, this.getPos().y - extent.y);
        this.bbTop.setOrigin(this.bbTop.getWidth() / 2,this.bbTop.getHeight() / 2);
        this.bbBot.setOrigin(this.bbBot.getWidth() / 2,this.bbBot.getHeight() /  2);
        this.bbLeft.setOrigin(0,this.bbLeft.getHeight() / 2);
        this.bbRight.setOrigin(0,this.bbRight.getHeight() / 2);
    }

    this.update = function(dt) {
        //Update bounding boxes
        var frame = this.getAnimation().frames[this.getCurrFrame()]
        this.setOrigin(frame.size.x / 2, frame.size.y); //Update origin based on frame size (center,bottom)
        this.updateBB();

        this.updateEntity(dt);
        //------------Key Press Movement and Animation change -------------------------
        var j = 0;
        if (this.armourLevel == 1) { j = 6; }
        else if (this.armourLevel == 2) { j = 12; }
        else if (this.armourLevel == 3) { j = 18; }

        if (spaceKey) {
            this.jump();
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
        console.log(j);
    }
}