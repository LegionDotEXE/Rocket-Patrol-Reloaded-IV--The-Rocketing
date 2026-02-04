// Saurav Shah
// 02/02/2026

// Project 02 -- ROCKET PATROL RELOADED IV: THE ROCKETING

// Approximate Time to Complete: Idk maybe 22 hours?

// Implemented Mods:
//   - New enemy Spaceship type (smaller and comparitively faster) 
//   - Alternating two-player mode 
//   - Timing and scoring: +time on hit, -time on miss 
//   - Mouse control for movement, and Left Click to fire
//   - Particle emitter explosion on hit 

/*

Rocket Patrol (1978), a rudimentary sci-fi gallery shooter included as a pack-in game for the obscure APF MP-1000 console. 
If you’re not familiar with the game,you can check out a short demonstration on YouTube. The object of the game is to destroy as 
many spaceships as you can in one minute. The APF version has an asynchronous two-player mode and a player-versus-computer mode


NOTE: THIS IS A MODDED VERSION OF THE EXISITING BUILD 
*/


// Main.js 

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play]
};

let game = new Phaser.Game(config);

// UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let mousePointer;

let currentPlayer = 1; // 1 or 2

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT;