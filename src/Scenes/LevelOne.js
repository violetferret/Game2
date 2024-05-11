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
        this.redEnemySpeed = 1.25;
        this.greenEnemySpeed = 1;

        this.my.sprite.bullets = [];
        this.bulletCooldown = 3;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;

        this.my.sprite.redEnemy = [];
        this.redEnemyCooldown = 120;
        this.redEnemyCooldownCounter = 0;

        this.my.sprite.greenEnemy = [];
        this.greenEnemyCooldown = 200;
        this.greenEnemyCooldownCounter = 0;

        this.waveCounter = 0;

        this.myScore = 0;
    }

    preload() {
        this.load.image("player", "assets/kenney_alien-ufo-pack/PNG/shipBlue_manned.png");
        this.load.image("heart", "assets/kenney_platformer-art-extended-enemies/Alien sprites/alienBlue_badge1.png");
        this.load.image("playerLaser", "assets/kenney_space-shooter-redux/PNG/Lasers/laserBlue06.png");
        this.load.image("playerImpact", "assets/kenney_alien-ufo-pack/PNG/laserBlue_burst.png");

        this.load.image("background", "assets/kenney_space-shooter-redux/Backgrounds/blue.png");

        this.load.image("greenShip", "assets/kenney_space-shooter-redux/PNG/playerShip2_green.png");
        this.load.image("greenLaser", "assets/kenney_space-shooter-redux/PNG/Lasers/laserGreen12.png");
        this.load.image("greenImpact", "assets/kenney_alien-ufo-pack/PNG/laserGreen_burst.png");

        this.load.image("redShip", "assets/kenney_space-shooter-redux/PNG/playerShip2_red.png");
        this.load.image("redLaser", "assets/kenney_space-shooter-redux/PNG/Lasers/laserRed06.png");
        this.load.image("redImpact", "assets/kenney_alien-ufo-pack/PNG/laserPink_burst.png");

        this.load.audio("enemyDeath", "assets/kenney_sci-fi-sounds/Audio/laserLarge_002.ogg");

        this.load.audio("playerShoot", "assets/kenney_space-shooter-redux/Bonus/sfx_laser1.ogg");
        this.load.audio("enemyShoot", "assets/kenney_space-shooter-redux/Bonus/sfx_laser2.ogg");
        this.load.audio("playerLoseHealth", "assets/kenney_sci-fi-sounds/Audio/laserRetro_001.ogg");

        this.load.bitmapFont("rocketSquare", "assets/KennyRocketSquare_0.png", "assets/KennyRocketSquare.fnt");
    }

    create() {
        let my = this.my;

        // Create background
        for (let w = 0; w < 768; w += 256) {
            for (let h = 0; h < 1024; h += 256) {
                this.add.image(w, h, "background");
            }
        }

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

        // Create text
        this.my.score = this.add.bitmapText(20, 0, "rocketSquare", "Score " + my.sprite.player.score);

        // In this approach, we create a single "group" game object which then holds up
        // to 10 bullet sprites
        // See more configuration options here: 
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        // my.sprite.bulletGroup = this.add.group({
        //     active: true,
        //     defaultKey: "playerLaser",
        //     maxSize: 10,
        //     runChildUpdate: true
        // }
        // )

        // Create all of the bullets at once, and set them to inactive
        // See more configuration options here:
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        // my.sprite.bulletGroup.createMultiple({
        //     classType: Bullet,
        //     active: false,
        //     key: my.sprite.bulletGroup.defaultKey,
        //     repeat: my.sprite.bulletGroup.maxSize - 1
        // });
        // my.sprite.bulletGroup.propertyValueSet("speed", this.bulletSpeed);
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
        // console.log(this.waveCounter);
        // console.log(this.redEnemyCooldownCounter)

        // my.sprite.bulletGroup.setX(-30);

        // Check for bullet being fired
        if (this.space.isDown) {
            if (this.bulletCooldownCounter < 0) {
                // console.log("hello")
                // Get the first inactive bullet, and make it active
                // let bullet = my.sprite.bulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                // if (bullet != null) {
                //     this.bulletCooldownCounter = this.bulletCooldown;
                //     bullet.makeActive();
                //     // Play sound
                //     this.sound.play("playerShoot", {
                //         volume: 1   // Can adjust volume using this, goes from 0 to 1
                //     });

                //     // Move bullet
                //     bullet.x = my.sprite.player.x;
                //     bullet.y = my.sprite.player.y - (my.sprite.player.displayHeight / 2);
                // }

                my.sprite.bullets.push(new Bullet(this, my.sprite.player.x, my.sprite.player.y, "playerLaser"));

                console.log(my.sprite.bullets)
                //this.bulletCooldownCounter = this.bulletCooldown;

            }
        }

        for (let bullet of my.sprite.bullets) {
            // console.log("HIII")
            bullet.makeActive();
            bullet.update();

            if (bullet.y < 1) {
                bullet.makeInactive();
                bullet.destroy();
            }
        }

        // Check for collision with the enemy ships
        for (let bullet of my.sprite.bullets) {
            for (let redShip of my.sprite.redEnemy) {
                // console.log(redShip)
                // let = bullet = my.sprite.bulletGroup.getFirst();
                // console.log(bullet)
                if (bullet != null) {
                    // console.log("heyo")
                    if (this.collides(redShip, bullet)) {
                        // start animation
                        this.crash = this.add.sprite(my.sprite.redEnemy.x, my.sprite.redEnemy.y, "redImpact").setScale(0.25);
                        // clear out bullet -- put y offscreen, will get reaped next update
                        bullet.makeInactive();
                        redShip.makeInactive();
                        // redShip.x = -100;
                        // Update score
                        my.sprite.player.score += redShip.scorePoints;
                        // this.updateScore(my.sprite.player);
                    }

                }
            }
        }
        // }
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
        } else if (this.waveCounter >= 3000 && this.waveCounter < 5000) {
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
        } else if (this.waveCounter >= 6000 && this.waveCounter < 8000) {
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

        } else if (this.waveCounter >= 8000) {
            // Reset wave 2 ships
            for (let redShip of my.sprite.redEnemy) {
                redShip.makeInactive();
            }
            for (let greenShip of my.sprite.greenEnemy) {
                greenShip.makeInactive();
            }

            // RESET
            //console.log("yay");
        }
    }

    // A center-radius AABB collision check
    collides(a, b) {
        //console.log(a.x, a.y, b.x, b.y)
        //console.log(a.displayWidth)
        if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) {
            return false;
        }
        if (Math.abs(a.y - b.y) > (a.displayHeight / 2 + b.displayHeight / 2)) {
            return false;
        }
        return true;
    }

    updateScore(player) {
        this.my.text.score.setText("Score " + player.score);
    }
}
