/**
 * Created by rzsavilla on 28/08/2016.
 */
Enemy.prototype = new Entity();
Enemy.prototype.constructor=Enemy;
function Enemy() {
    Entity.call(this);
    this.setMass(50);
    this.setSpeed(200);
    this.setFrictionX(15);
    this.range = 150;
    this.collidable = true;
    this.bbSet = false;

    this.spot = function(player) {
        var diff = player.getPos().vSubtract(this.getPos());
        var dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
        if (Math.abs(dist) < this.range) {
            return true;
        }
        return false;
    }

    this.updateEnemy = function(dt) {
        if (this.isFacing() == "right") {
            this.moveRight();
        } else if (this.isFacing() == "left") {
            this.moveLeft();}
        this.updateEntity(dt);
        this.updateMove(dt);
    }
}

Blob.prototype = new Enemy();
Blob.prototype.constructor=Blob;
function Blob(x,y) {
    Enemy.call(this);
    this.setAnimation(blobAnim[0]);
    this.setPos(x,y);
    this.setSpeed(500);
    this.setJumpForce(500);
    this.setMass(20);
    var x = 7.5;
    var y = 7.5;
    this.bb.setSize(15,18);
    this.bb.setOrigin(7.5,9);
    this.bbTop.setSize(x, 2);
    this.bbBot.setSize(x, 2);
    this.bbLeft.setSize(3,2);
    this.bbRight.setSize(3,2);
    this.bbTop.setOrigin(x / 2,y / 2);
    this.bbBot.setOrigin(x / 2, y / 2);
    this.bbLeft.setOrigin(x,y);
    this.bbRight.setOrigin(x,y);
    this.setOrigin(x, 9);
    
    this.updateBB = function () {
        this.bbBot.setPos(this.getPos().x,this.getPos().y + 5)
        this.bbTop.setPos(this.getPos().x , this.getPos().y - 5);
        this.bbLeft.setPos(this.getPos().x,this.getPos().y + 2);
        this.bbRight.setPos(this.getPos().x + this.getOrigin().x * 2 - 2,this.getPos().y + 2 );
        this.bb.setPos(this.getPos().x, this.getPos().y);
    }

    this.update = function(dt) {

        if (this.isFacing() == "right") {
            if (this.isJumping()) {
                if (this.getAnimation() != blobAnim[2]) {
                    this.setAnimation(blobAnim[2]);
                }
            }
            else if (this.getAnimation() != blobAnim[0]) {
                this.setAnimation(blobAnim[0]);
            }

        } else if (this.isFacing() == "left") {
            if (!this.isJumping()) {
                if (this.getAnimation() != blobAnim[3]) {
                    this.setAnimation(blobAnim[3]);
                }
            }
            if (this.getAnimation() != blobAnim[1]) {
                this.setAnimation(blobAnim[1]);
            }
        }
        this.updateEnemy(dt);
        this.updateFrameBB()
    }
}

Goblin.prototype = new Enemy();
Goblin.prototype.constructor=Goblin;
function Goblin(x,y) {
    Enemy.call(this);

}