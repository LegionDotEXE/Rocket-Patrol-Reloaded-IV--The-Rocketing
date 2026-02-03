class FastShip extends Phaser.GameObjects.Sprite{
    constructor (scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.exisiting(this);
        this.pointValue = pointValue;

        // ShipSpeed
        this.moveSpeed = game.settings.shipSpeed + 2;       // for faster movement
    }

    update () {
        this.x -= this.moveSpeed;
        if (this.x <= 0 - this.width){
            this.x = game.config.width;
        }
    }

}