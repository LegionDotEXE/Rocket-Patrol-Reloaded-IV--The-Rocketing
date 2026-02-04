//Rocket Prefab

class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);       // add to existing, displayList, updateList
        this.isFiring = false;          // track rocket's firing status
        this.moveSpeed = 2;             // rcoket speed in pixels/frame

        this.sfxShot = scene.sound.add('sfx-shot');         // Added this line here


    }

    update() {

        // Mouse Controls

        if (!this.isFiring && this.scene.input.mousePointer.isDown === false) {
            this.x = this.scene.input.mousePointer.x;
            // limits within border
            if (this.x < borderUISize + borderPadding) {
                this.x = borderUISize + borderPadding;
            } else if (this.x > game.config.width - borderUISize - borderPadding) {
                this.x = game.config.width - borderUISize - borderPadding;
            }
        }


        /*
        if (!this.isFiring) {
            if (keyLEFT.isDown && this.x > borderUISize + borderPadding) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x < game.config.width - borderUISize - borderPadding) {
                this.x += this.moveSpeed;
            }
        }
        
        */

        // fire button -- left click
        if (this.scene.input.mousePointer.justDown && !this.isFiring) {       
            this.isFiring = true;
            this.sfxShot.play();
        }

        // Movements, if fired
        if (this.isFiring && this.y > borderUISize + borderPadding * 3) {           
            this.y -= this.moveSpeed * 2;
        }

        // reset on miss
        if (this.isFiring && this.y <= borderUISize + borderPadding * 3) {
            this.scene.timeMissed(); // Notify scene of miss
            this.reset();
        }
    }
}