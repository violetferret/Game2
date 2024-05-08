class ArrayBullet extends Phaser.Scene {
    constructor() {
        super("arrayBullet");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.maxBullets = 10;           // Don't create more than this many bullets

        this.my.sprite.enemy = [];
        this.maxEnemies = 10;
        
    }

    preload() {
        this.load.image("player", "assets/kenney_alien-ufo-pack/PNG/shipBlue_manned.png");            
        this.load.image("heart", "assets/kenney_platformer-art-extended-enemies/Alien sprites/alienBlue_badge1.png");  
        this.load.image("background", "assets/kenney_space-shooter-redux/Backgrounds/blue.png");
        this.load.image("greenShip", "assets/kenney_space-shooter-redux/PNG/playerShip2_green.png");
        this.load.image("redShip", "assets/kenney_space-shooter-redux/PNG/playerShip2_red.png");
        this.load.image("playerLaser", "assets/kenney_space-shooter-redux/PNG/Lasers/laserBlue06.png");
        this.load.image("playerImpact", "assets/kenney_space-shooter-redux/PNG/Lasers/laserBlue10.png");
        this.load.image("greenLaser", "assets/kenney_space-shooter-redux/PNG/Lasers/laserGreen12.png");
        this.load.image("greenImpact", "assets/kenney_space-shooter-redux/PNG/Lasers/laserGreen16.png");
        this.load.image("redLaser", "assets/kenney_space-shooter-redux/PNG/Lasers/laserRed06.png");
        this.load.image("redImpact", "assets/kenney_space-shooter-redux/PNG/Lasers/laserRed10.png");
    }

    create() {
        // Create background
        for (let w = 0; w < 768; w += 256) {
            for (let h = 0; h < 1024; h += 256) {
                this.add.image(w, h, "background");
            }
        }

        let my = this.my;

        // Notice that in this approach, we don't create any bullet sprites in create(),
        // and instead wait until we need them, based on the number of space bar presses

        // Create key objects
         // Create key objects
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.nextScene = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 5;
        this.enemySpeed = 2;

        // my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "player");
        // my.sprite.player.setScale(0.5);
        my.sprite.player = new Player(this.left, this.right, this.playerSpeed);

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Game Object Group Bullet.js</h2>Left Arrow Key: Left // Right Arrow Key: Right // Space: Fire/Emit // N: Next Scene'

    }

    update() {
        let my = this.my;

        // Moving left
        // if (this.left.isDown) {
        //     // Check to make sure the sprite can actually move left
        //     if (my.sprite.player.x > (my.sprite.player.displayWidth/2)) {
        //         my.sprite.player.x -= this.playerSpeed;

        //     }
        // }

        // Moving right
        // if (this.right.isDown) {
        //     // Check to make sure the sprite can actually move right
        //     if (my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))) {
        //         my.sprite.player.x += this.playerSpeed;
        //     }
        // }

        my.sprite.player.update();

        // Check for bullet being fired
        // if (Phaser.Input.Keyboard.JustDown(this.space)) {
        //     // Are we under our bullet quota?
        //     if (my.sprite.bullet.length < this.maxBullets) {
        //         my.sprite.bullet.push(this.add.sprite(
        //             my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "playerLaser")
        //         );
        //     }
        // }

        for (let bullet of my.sprite.bullet) {
            bullet.update();
        }

        // Make all of the bullets move
        // for (let bullet of my.sprite.bullet) {
        //     bullet.y -= this.bulletSpeed;
        // }

        // Remove all of the bullets which are offscreen
        // filter() goes through all of the elements of the array, and
        // only returns those which **pass** the provided test (conditional)
        // In this case, the condition is, is the y value of the bullet
        // greater than zero minus half the display height of the bullet? 
        // (i.e., is the bullet fully offscreen to the top?)
        // We store the array returned from filter() back into the bullet
        // array, overwriting it. 
        // This does have the impact of re-creating the bullet array on every 
        // update() call. 
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("fixedArrayBullet");
        }

    }
}
         