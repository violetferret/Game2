class LevelOne extends Phaser.Scene {
    constructor() {
        super("levelOne");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = { sprite: {} };

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 8;
        this.enemyBulletSpeed = 6;
        this.redEnemySpeed = 1.25;
        this.greenEnemySpeed = 1;

        this.my.sprite.bullet = [];
        this.bulletCooldown = 3;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;
        this.maxBullets = 10;
        this.lives = [];


        this.my.sprite.redEnemy = [];
        this.redEnemyCooldown = 120;
        this.redEnemyCooldownCounter = 0;

        this.my.sprite.greenEnemy = [];
        this.my.sprite.greenEnemyBullet = [];
        this.greenEnemyCooldown = 200;
        this.greenEnemyCooldownCounter = 0;

        this.crash;

        this.waveCounter = 1250;
        this.crashCounter = 0;
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


        for (let heart = 0; heart < my.sprite.player.health; heart++) {
            let image = this.add.image(30 + (heart * 40), 30, "heart");
            image.setScale(0.75);
            image.visible = false;
            this.lives.push(image);
        }

        // Create text
        this.my.score = this.add.bitmapText(320, 0, "rocketSquare", "Score " + my.sprite.player.score);

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Level 1</h2>Left Arrow Key: Left // Right Arrow Key: Right // Space: Fire/Emit // N: Next Scene'
    }

    update() {
        let my = this.my;
        this.bulletCooldownCounter--;
        this.redEnemyCooldownCounter--;
        this.greenEnemyCooldownCounter--;

        this.waveCounter++;

        for (let heart = 0; heart < my.sprite.player.health; heart++) {
            //console.log(this.lives[heart])
            this.lives[heart].visible = true;
        }


        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {

            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y - (my.sprite.player.displayHeight / 2), "playerLaser")
                );
                this.sound.play("playerShoot", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
            }
        }

        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight / 2));

        // Check for collision with the enemy ships
        for (let bullet of my.sprite.bullet) {
            for (let redShip of my.sprite.redEnemy) {
                if (bullet.active && redShip.active) {
                    if (this.collides(redShip, bullet)) {
                        this.crashCounter = this.waveCounter;

                        // start animation
                        if (this.crash) {
                            this.crash.destroy();
                        }

                        this.crash = this.add.sprite(redShip.x, redShip.y, "redImpact").setScale(0.5);

                        this.sound.play("enemyDeath", {
                            volume: .5   // Can adjust volume using this, goes from 0 to 1
                        });
                        my.sprite.player.score += redShip.scorePoints;

                        redShip.x = -100;
                        redShip.y = -100;
                        bullet.y = -100;

                        this.updateScore(my.sprite.player.score);
                    }
                }
            }



            for (let greenShip of my.sprite.greenEnemy) {

                if (bullet.active && greenShip.active) {

                    if (this.collides(greenShip, bullet)) {
                        this.crashCounter = this.waveCounter;
                        // start animation
                        if (this.crash) {
                            this.crash.destroy();
                        }
                        this.crash = this.add.sprite(greenShip.x, greenShip.y, "greenImpact").setScale(0.5);
                        this.sound.play("enemyDeath", {
                            volume: .5  // Can adjust volume using this, goes from 0 to 1
                        });
                        my.sprite.player.score += greenShip.scorePoints;
                        greenShip.x = -100;
                        greenShip.y = 700;
                        bullet.y = -100;

                        // Update score
                        this.updateScore(my.sprite.player.score);
                    }

                }
            }
        }

        for (let greenShip in my.sprite.greenEnemy) {
            if (my.sprite.greenEnemy[greenShip].active) {
                if ((this.waveCounter + (greenShip * 15)) % 50 == 0 && (my.sprite.greenEnemy[greenShip].y < 600)) {
                    my.sprite.greenEnemyBullet.push(this.add.sprite(
                        my.sprite.greenEnemy[greenShip].x, my.sprite.greenEnemy[greenShip].y - (my.sprite.greenEnemy[greenShip].displayHeight / 2), "greenLaser")
                    );
                    this.sound.play("enemyShoot", {
                        volume: .25   // Can adjust volume using this, goes from 0 to 1
                    });
                }
            }
        }

        // Make all of the bullets move
        for (let bullet of my.sprite.greenEnemyBullet) {
            bullet.visible = true;
            bullet.y += this.enemyBulletSpeed;

        }

        my.sprite.greenEnemyBullet = my.sprite.greenEnemyBullet.filter((bullet) => bullet.y > -(bullet.displayHeight / 2));

        // destroy crash image 
        if (this.waveCounter == this.crashCounter + 20) {
            this.crash.visible = false;
        }

        // check for enemy bullet collisions
        for (let bullet of my.sprite.greenEnemyBullet) {
            if (bullet.active) {
                if (this.collides(bullet, my.sprite.player)) {
                    // repeating too many times
                    // console.log(my.sprite.player.health)
                    my.sprite.player.score -= 100;
                    bullet.y = -100;
                    my.sprite.player.health--;
                }
            }
        }

        // }
        // update the player avatar by by calling the player's update()
        my.sprite.player.update();

        // Wave 1 -- red ships only
        if (this.waveCounter < 1000) {
            // Red ships 
            if (this.redEnemyCooldownCounter < 0) {
                my.sprite.redEnemy.push(new Enemy(this, (Math.floor(Math.random() * 500)), 20, "redShip", null, this.redEnemySpeed, "red"));
                this.redEnemyCooldownCounter = this.redEnemyCooldown;
            }

            for (let redShip of my.sprite.redEnemy) {
                redShip.flipY = true;
                redShip.setScale(0.5);
                redShip.makeActive();
                redShip.update();
            }

            // Wave 2 -- green ships only 
        } else if (this.waveCounter >= 1000 && this.waveCounter < 1250) {
            // Reset wave 1 ships
            for (let redShip of my.sprite.redEnemy) {
                redShip.makeInactive();
            }
        } else if (this.waveCounter >= 1250 && this.waveCounter < 5000) {

            // Green ships
            if (this.greenEnemyCooldownCounter < 0) {
                my.sprite.greenEnemy.push(new Enemy(this, (Math.floor(Math.random() * 500)), 20, "greenShip", null, this.greenEnemySpeed, "green"));
                this.greenEnemyCooldownCounter = this.greenEnemyCooldown;
            }

            for (let greenShip of my.sprite.greenEnemy) {
                greenShip.flipY = true;
                greenShip.setScale(0.5);
                greenShip.makeActive();
                greenShip.update();
            }

        } else if (this.waveCounter >= 5000 && this.waveCounter < 6000) {
            // Reset wave 2 ships
            for (let greenShip of my.sprite.greenEnemy) {
                greenShip.makeInactive();
            }

            // Wave 3 -- red and green ships
        } else if (this.waveCounter >= 6000 && this.waveCounter < 8000) {

            // Red ships 
            if (this.redEnemyCooldownCounter < 0) {
                // x (Math.floor(Math.random() * 500))
                my.sprite.redEnemy.push(new Enemy(this, (Math.floor(Math.random() * 500)), 20, "redShip", null, this.redEnemySpeed, "red"));
                this.redEnemyCooldownCounter = this.redEnemyCooldown;
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
                this.greenEnemyCooldownCounter = this.greenEnemyCooldown;
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
        }
    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) {

            return false;
        }
        if (Math.abs(a.y - b.y) > (a.displayHeight / 2 + b.displayHeight / 2)) {
            return false;
        }
        return true;
    }

    updateScore(score) {
        this.my.score.setText("Score " + score);
    }
}
