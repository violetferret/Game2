class LevelOne extends Phaser.Scene {
    constructor() {
        super("levelOne");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = { sprite: {} };

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 5;
        this.redEnemySpeed = 1.5;
        this.greenEnemySpeed = 1;

        this.bulletCooldown = 3;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;

        this.my.sprite.redEnemy = [];
        this.redEnemyCooldown = 100;
        this.redEnemyCooldownCounter = 0;

        this.my.sprite.greenEnemy = [];
        this.greenEnemyCooldown = 200;
        this.greenEnemyCooldownCounter = 0;

        this.waveCounter = 0;
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

        // my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "player");
        my.sprite.player = new Player(this, game.config.width / 2, game.config.height - 40, "player", null, this.left, this.right, 5);
        my.sprite.player.setScale(0.5);

        // In this approach, we create a single "group" game object which then holds up
        // to 10 bullet sprites
        // See more configuration options here: 
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.bulletGroup = this.add.group({
            active: true,
            defaultKey: "playerLaser",
            maxSize: 10,
            runChildUpdate: true
        }
        )

        // Create all of the bullets at once, and set them to inactive
        // See more configuration options here:
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.bulletGroup.createMultiple({
            classType: Bullet,
            active: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize - 1
        });
        my.sprite.bulletGroup.propertyValueSet("speed", this.bulletSpeed);
        // my.sprite.bulletGroup.propertyValueSet("playerX", -30);

        // console.log(my.sprite.bulletGroup)

        // my.sprite.bulletGroup.getChildren().forEach(function (bullet) {
        //     console.log(bullet.x);
        //     bullet.setX(-30);
        // })

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Level 1</h2>Left Arrow Key: Left // Right Arrow Key: Right // Space: Fire/Emit // N: Next Scene'
    }

    update() {
        let my = this.my;
        this.bulletCooldownCounter--;
        this.redEnemyCooldownCounter--;
        this.greenEnemyCooldownCounter--;

        this.waveCounter++;
        console.log(this.waveCounter);
        // console.log(this.redEnemyCooldownCounter)

        // my.sprite.bulletGroup.setX(-30);

        // Check for bullet being fired
        if (this.space.isDown) {
            if (this.bulletCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                let bullet = my.sprite.bulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (bullet != null) {
                    this.bulletCooldownCounter = this.bulletCooldown;
                    bullet.makeActive();
                    bullet.x = my.sprite.player.x;
                    bullet.y = my.sprite.player.y - (my.sprite.player.displayHeight / 2);
                }
            }
        }

        // update the player avatar by by calling the player's update()
        my.sprite.player.update();

        // Wave 1 -- red ships only
        if (this.waveCounter < 2000) {
            // Red ships 
            if (this.redEnemyCooldownCounter < 0) {
                // x (Math.floor(Math.random() * 500))
                my.sprite.redEnemy.push(new Enemy(this, (Math.floor(Math.random() * 500)), 20, "redShip", null, this.redEnemySpeed, "red"));
                //console.log(my.sprite.redEnemy);
                this.redEnemyCooldownCounter = this.redEnemyCooldown;
                //console.log(this.redEnemyCooldownCounter)
            }

            for (let redShip of my.sprite.redEnemy) {
                redShip.flipY = true;
                redShip.setScale(0.5);
                redShip.makeActive();
                redShip.update();
            }

            // Wave 2 -- green ships only 
        } else if (this.waveCounter >= 2000 && this.waveCounter < 4000) {
            // Reset wave 1 ships
            for (let redShip of my.sprite.redEnemy) {
                redShip.makeInactive();
            }

            // Green ships
            if (this.greenEnemyCooldownCounter < 0) {
                // x (Math.floor(Math.random() * 500))
                my.sprite.greenEnemy.push(new Enemy(this, (Math.floor(Math.random() * 500)), 20, "greenShip", null, this.greenEnemySpeed, "green"));
                //console.log(my.sprite.redEnemy);
                this.greenEnemyCooldownCounter = this.greenEnemyCooldown;
                //console.log(this.redEnemyCooldownCounter)
            }

            for (let greenShip of my.sprite.greenEnemy) {
                greenShip.flipY = true;
                greenShip.setScale(0.5);
                greenShip.makeActive();
                greenShip.update();
            }

            // Wave 3 -- red and green ships
        } else if (this.waveCounter >= 4000 && this.waveCounter < 6000) {
            // Reset wave 2 ships
            for (let greenShip of my.sprite.greenEnemy) {
                greenShip.makeInactive();
            }

            // Red ships 
            if (this.redEnemyCooldownCounter < 0) {
                // x (Math.floor(Math.random() * 500))
                my.sprite.redEnemy.push(new Enemy(this, (Math.floor(Math.random() * 500)), 20, "redShip", null, this.redEnemySpeed, "red"));
                //console.log(my.sprite.redEnemy);
                this.redEnemyCooldownCounter = this.redEnemyCooldown;
                //console.log(this.redEnemyCooldownCounter)
            }

            for (let redShip of my.sprite.redEnemy) {
                redShip.flipY = true;
                redShip.setScale(0.5);
                redShip.makeActive();
                redShip.update();
            }

            // Green ships
            if (this.greenEnemyCooldownCounter < 0) {
                // x (Math.floor(Math.random() * 500))
                my.sprite.greenEnemy.push(new Enemy(this, (Math.floor(Math.random() * 500)), 20, "greenShip", null, this.greenEnemySpeed, "green"));
                //console.log(my.sprite.redEnemy);
                this.greenEnemyCooldownCounter = this.greenEnemyCooldown;
                //console.log(this.redEnemyCooldownCounter)
            }

            for (let greenShip of my.sprite.greenEnemy) {
                greenShip.flipY = true;
                greenShip.setScale(0.5);
                greenShip.makeActive();
                greenShip.update();
            }

        } else if (this.waveCounter >= 6000) {
            // Reset wave 2 ships
            for (let redShip of my.sprite.redEnemy) {
                redShip.makeInactive();
            }
            for (let greenShip of my.sprite.greenEnemy) {
                greenShip.makeInactive();
            }

            // RESET
            console.log("yay");
        }
    }
}
