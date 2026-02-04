class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // starfield
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // add players/rockets

        this.p1 = new Rocket(this, game.config.width / 3, game.config.height - borderUISize - borderPadding, 'rocket');
        this.p2 = new Rocket(this, (game.config.width / 3) * 2, game.config.height - borderUISize - borderPadding, 'fastship');

        this.currentPlayer = 1;                     // Player 1 by default


        // add spaceships (x3)

        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);


        // NEW additon of fastship here

        this.fastShip = new FastShip(this, game.config.width + 100, borderUISize * 3, 'fastship', 0, 50);       // Review Here


        // define keys

        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);


        // initialize score

        this.p1Score = 0;
        this.p2Score = 0;           // NEW LINE for Player II


        // display score

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        };

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, 'P1: 0', scoreConfig);
        this.scoreRight = this.add.text(game.config.width - borderUISize - borderPadding - 120, borderUISize + borderPadding * 2, 'P2: 0', scoreConfig);


        // timer

        this.initialTime = game.settings.gameTimer;
        this.timeLeft = this.initialTime;

        this.timerText = this.add.text(game.config.width / 2, borderUISize + borderPadding * 2, '', scoreConfig).setOrigin(0.5);

        this.updateTimerDisplay();


        // GAME OVER flag

        this.gameOver = false;


        // Clock Module

        this.clock = this.time.addEvent({
            delay: 1000,                        // 1 sec
            callback: this.updateClock,
            callbackScope: this,
            loop: true
        });


        // particle emitter (for explosions)

        // Particle emitter for explosions (Phaser 3.60+ compatible)

        this.emitter = this.add.particles(0, 0, 'particle', {
            quantity: 8,
            lifespan: 300,
            speed: { min: 50, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 }
        });

    }

    update() {

        // check key input for restart

        if (this.gameOver) {

            if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
                this.scene.restart()
            }

            if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.scene.start("menuScene");
            }

            return;
        }

        this.starfield.tilePositionX -= 4;


        // Update current player's rocket

        if (this.currentPlayer === 1) {

            this.p1.active = true;
            this.p2.active = false;

            this.p1.update();

        } else {

            this.p1.active = false;
            this.p2.active = true;

            this.p2.update();
        }


        // update ships

        this.ship01.update();
        this.ship02.update();
        this.ship03.update();
        this.fastShip.update();


        // check collisions

        let rockets = [this.p1, this.p2];
        let ships = [this.ship01, this.ship02, this.ship03, this.fastShip];


        for (let rocket of rockets) {

            if (!rocket.active) continue;

            for (let ship of ships) {

                if (this.checkCollision(rocket, ship) && rocket.isFiring) {

                    rocket.reset();

                    this.shipExplode(ship);


                    // switch player after hit

                    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;


                    // add time on hit

                    this.addTime(3000); // +3 seconds


                    // update score

                    if (rocket === this.p1) {

                        this.p1Score += ship.points;
                        this.scoreLeft.text = `P1: ${this.p1Score}`;

                    } else {

                        this.p2Score += ship.points;
                        this.scoreRight.text = `P2: ${this.p2Score}`;
                    }
                }
            }
        }
    }


    checkCollision(rocket, ship) {

        // simple AABB checking

        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {

            return true;

        } else {

            return false;
        }
    }


    shipExplode(ship) {

        ship.alpha = 0;

        // play sound

        this.sound.play('sfx-explosion');


        // particle explosion

        this.emitter.explode(8, ship.x, ship.y);


        // reset after short delay

        this.time.delayedCall(200, () => {

            ship.reset();
            ship.alpha = 1;
        });
    }


    timeMissed() {

        // subtract time on miss

        this.subtractTime(2000); // -2 seconds

        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;                          // switch player on miss
    }


    addTime(ms) {

        this.timeLeft += ms;
        this.updateTimerDisplay();
    }


    subtractTime(ms) {

        this.timeLeft -= ms;

        if (this.timeLeft <= 0) {

            this.timeLeft = 0;
            this.endGame();
        }

        this.updateTimerDisplay();
    }


    updateClock() {

        this.subtractTime(1000);                // tick -tock every second
    }


    updateTimerDisplay() {

        let seconds = Math.ceil(this.timeLeft / 1000);

        this.timerText.text = `${seconds}s`;

        if (this.timeLeft <= 0) {

            this.endGame();
        }
    }


    endGame() {

        this.gameOver = true;

        let finalScore = this.p1Score + this.p2Score;

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: { top: 5, bottom: 5 },
            fixedWidth: 0
        };

        this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 64, `Final Score: ${finalScore}`, scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 128, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
    }
}
