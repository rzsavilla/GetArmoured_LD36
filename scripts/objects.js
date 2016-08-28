/**
 * Created by rzsavilla on 28/08/2016.
 */

PickUp.prototype = new AnimatedSprite();
PickUp.prototype.constructor=PickUp;
function PickUp() {
    AnimatedSprite.call(this);
}

ShieldPickUp.prototype = new PickUp();
ShieldPickUp.prototype.constructor=ShieldPickUp;
function ShieldPickUp(x,y) {
    PickUp.call(this);
    this.setPos(x,y);
    this.setAnimation(shieldAnim);
}