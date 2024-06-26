class Levels extends Phaser.Scene {
    constructor() {
        super("levels");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = { sprite: {} };

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 8;
        this.enemyBulletSpeed = 5;
        this.redEnemySpeed = 1.25;
        this.greenEnemySpeed = 1;

        this.my.sprite.bullet = [];
        this.bulletCooldown = 3;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;
        this.maxBullets = 10;
        this.lives = [];


        this.my.sprite.redEnemy = [];
        this.redEnemyCooldown = 50;
        this.redEnemyCooldownCounter = 0;

        this.my.sprite.greenEnemy = [];
        this.my.sprite.greenEnemyBullet = [];
        this.greenEnemyCooldown = 100;
        this.greenEnemyCooldownCounter = 0;

        this.crash;

        this.level = 1;
        this.wave = 1;
        this.waveCounter = 0;
        this.crashCounter = 0;
    }

    preload() {
        this.load.image("player", "assets/kenney_alien-ufo-pack/PNG/shipBlue_manned.png");
        this.load.image("heart", "assets/kenney_platformer-art-extended-enemies/Alien sprites/alienBlue_badge1.png");
        this.load.image("playerLaser", "assets/kenney_space-shooter-redux/PNG/Lasers/laserBlue06.png");
        this.load.image("playerImpact", "assets/kenney_alien-ufo-pack/PNG/laserBlue_burst.png");

        this.load.image("background", "assets/kenney_space-shooter-redux/Backgrounds/black.png");

        this.load.image("greenShip", "assets/kenney_space-shooter-redux/PNG/playerShip2_green.png");
        this.load.image("greenLaser", "assets/kenney_space-shooter-redux/PNG/Lasers/laserGreen12.png");
        this.load.image("greenImpact", "assets/kenney_alien-ufo-pack/PNG/laserGreen_burst.png");

        this.load.image("redShip", "assets/kenney_space-shooter-redux/PNG/playerShip2_red.png");
        this.load.image("redLaser", "assets/kenney_space-shooter-redux/PNG/Lasers/laserRed06.png");
        this.load.image("redImpact", "assets/kenney_alien-ufo-pack/PNG/laserPink_burst.png");

        this.load.audio("enemyDeath", "assets/kenney_sci-fi-sounds/Audio/laserLarge_002.ogg");
        this.load.audio("playerHurt", "assets/kenney_space-shooter-redux/Bonus/sfx_twoTone.ogg");

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
        this.my.score = this.add.bitmapText(240, 12, "rocketSquare", "Score " + my.sprite.player.score);
        this.my.wave = this.add.bitmapText(150, 330, "rocketSquare", "Wave " + this.wave);
        this.my.wave.setScale(1.5);
        this.my.wave.visible = false;
        this.my.level = this.add.bitmapText(130, 330, "rocketSquare", "Level " + this.level);
        this.my.level.setScale(1.5);
        this.my.level.visible = false;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Shoot the enemy ships!</h2>Left Arrow Key: Left // Right Arrow Key: Right // Space: Fire/Emit'
    }

    update() {
        let my = this.my;

        // check for losing state
        if (my.sprite.player.health == 0) {
            this.scene.start("gameOver");
        } 

        this.bulletCooldownCounter--;
        this.redEnemyCooldownCounter--;
        this.greenEnemyCooldownCounter--;

        this.waveCounter++;

        

        for (let heart = 0; heart < 5; heart++) {
            //console.log(this.lives[heart])
            //console.log(heart)
            if (heart < my.sprite.player.health) {
                this.lives[heart].visible = true;
            } else {
                this.lives[heart].visible = false;
            }
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
                        this.sound.play("enemyDeath", {
                            volume: .5   // Can adjust volume using this, goes from 0 to 1
                        });

                        this.crashCounter = this.waveCounter;

                        // start animation
                        if (this.crash) {
                            this.crash.destroy();
                        }

                        this.crash = this.add.sprite(redShip.x, redShip.y, "redImpact").setScale(0.5);

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
                        this.sound.play("enemyDeath", {
                            volume: .5  // Can adjust volume using this, goes from 0 to 1
                        });
                        this.crashCounter = this.waveCounter;
                        // start animation
                        if (this.crash) {
                            this.crash.destroy();
                        }
                        this.crash = this.add.sprite(greenShip.x, greenShip.y, "greenImpact").setScale(0.5);

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
            if ((my.sprite.greenEnemy[greenShip].y > 0) && (my.sprite.greenEnemy[greenShip].y < 700)) {
                if ((this.waveCounter + (greenShip * 15)) % 70 == 0 && (my.sprite.greenEnemy[greenShip].y < 600)) {
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
        if ((this.waveCounter == this.crashCounter + 20) && this.crash) {
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
                    this.sound.play("playerHurt", {
                        volume: 1   // Can adjust volume using this, goes from 0 to 1
                    });
                }
            }
        }

        // }
        // update the player avatar by by calling the player's update()
        my.sprite.player.update();

        // Wave 1 -- red ships only

        if (this.waveCounter < 150 && this) {
            this.updateLevel(this.level);
            my.level.visible = true;
        } else if (this.waveCounter >= 150 && this.waveCounter < 250) {
            my.level.visible = false;
            this.updateWave(this.wave);
            my.wave.visible = true;
        } else if (this.waveCounter >= 250 && this.waveCounter < 1250) {
            my.wave.visible = false;
            // Red ships 
            if (this.redEnemyCooldownCounter < 0) {
                my.sprite.redEnemy.push(new Enemy(this, (20 + (Math.floor(Math.random() * 460))), 60, "redShip", null, this.redEnemySpeed, "red"));
                this.redEnemyCooldownCounter = this.redEnemyCooldown;
            }

            for (let redShip of my.sprite.redEnemy) {
                redShip.flipY = true;
                redShip.setScale(0.5);
                redShip.makeActive();
                redShip.update();
            }

            // Wave 2 -- green ships only 
        } else if (this.waveCounter >= 1250 && this.waveCounter < 1500) {
            // Show text
            this.wave = 2;
            this.updateWave(this.wave);
            my.wave.visible = true;
            // Reset wave 1 ships
            for (let redShip of my.sprite.redEnemy) {
                redShip.y = -100;
            }
        } else if (this.waveCounter >= 1500 && this.waveCounter < 2500) {
            my.wave.visible = false;
            // Green ships
            if (this.greenEnemyCooldownCounter < 0) {
                my.sprite.greenEnemy.push(new Enemy(this, (20 + (Math.floor(Math.random() * 460))), 60, "greenShip", null, this.greenEnemySpeed, "green"));
                this.greenEnemyCooldownCounter = this.greenEnemyCooldown;
            }

            for (let greenShip of my.sprite.greenEnemy) {
                greenShip.flipY = true;
                greenShip.setScale(0.5);
                greenShip.makeActive();
                greenShip.update();
            }

        } else if (this.waveCounter >= 2500 && this.waveCounter < 2750) {
            // Reset wave 2 ships
            // Show text
            this.wave = 3;
            this.updateWave(this.wave);
            my.wave.visible = true;

            for (let greenShip of my.sprite.greenEnemy) {
                greenShip.y = -100;
                greenShip.makeInactive()
            }

            // Wave 3 -- red and green ships
        } else if (this.waveCounter >= 2750 && this.waveCounter < 3750) {
            my.wave.visible = false;

            // Red ships 
            if ((this.redEnemyCooldownCounter + 50) < 0) {
                // x (Math.floor(Math.random() * 500))
                my.sprite.redEnemy.push(new Enemy(this, (20 + (Math.floor(Math.random() * 460))), 60, "redShip", null, this.redEnemySpeed, "red"));
                this.redEnemyCooldownCounter = this.redEnemyCooldown;
            }

            for (let redShip of my.sprite.redEnemy) {
                redShip.flipY = true;
                redShip.setScale(0.5);
                redShip.makeActive();
                redShip.update();
            }

            // Green ships
            if ((this.greenEnemyCooldownCounter + 50) < 0) {
                // x (Math.floor(Math.random() * 500))
                my.sprite.greenEnemy.push(new Enemy(this, (20 + (Math.floor(Math.random() * 460))), 60, "greenShip", null, this.greenEnemySpeed, "green"));
                this.greenEnemyCooldownCounter = this.greenEnemyCooldown;
            }

            for (let greenShip of my.sprite.greenEnemy) {
                greenShip.flipY = true;
                greenShip.setScale(0.5);
                greenShip.makeActive();
                greenShip.update();
            }

        } else if (this.waveCounter == 3750) {

            // Reset wave 3 ships
            for (let redShip of my.sprite.redEnemy) {
                redShip.y = -10000;
            }
            for (let greenShip of my.sprite.greenEnemy) {
                greenShip.y = -10000;
                greenShip.makeInactive();
            }
            this.waveCounter = 0;
            this.level++;
            this.wave = 1;
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

    updateWave(wave) {
        this.my.wave.setText("Wave " + wave);
    }

    updateLevel(level) {
        this.my.level.setText("Level " + level);
    }
}
