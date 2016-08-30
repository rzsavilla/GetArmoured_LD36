/**
 * Created by rzsavilla on 28/08/2016.
 */

PickUp.prototype = new AnimatedSprite();
PickUp.prototype.constructor=PickUp;
function PickUp() {
    AnimatedSprite.call(this);
    this.collected = false;
    this.collidable = true;
}

ShieldPickUp.prototype = new PickUp();
ShieldPickUp.prototype.constructor=ShieldPickUp;
function ShieldPickUp(x,y) {
    PickUp.call(this);
    this.setPos(x,y);
    this.bb.setSize(32,32);
    this.bb.setPos(x,y);
    this.setAnimation(shieldAnim);
    this.update = function() {

    }
}

Portal.prototype = new AnimatedSprite();
Portal.prototype.constructor=Portal;
function Portal(x,y) {
    AnimatedSprite.call(this);
    this.collidable = true;
    this.setPos(x,y);
    this.bb.setSize(32,61)
    this.bb.setPos(x,y);
    this.setAnimation(portalInactive);
    this.activated = false;
    this.update = function () {
        if (this.activated) {
            if (this.getAnimation() != portalActive) {
                this.setAnimation(portalActive);
            }
        }
    }
}