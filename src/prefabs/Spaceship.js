// Spaceship prefab

class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);                   // add to existing scene
        this.points = pointValue;                  // store PointValue
    this.moveSpeed = game.settings.spaceshipSpeed       // spaceship speed in pixels/frame
    }
    
    update() {

        this.x -= this.moveSpeed;

        if (this.x <= 0 - this.width) {
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width + Phaser.Math.Between(0, 200);
    }
}