class ClassBullet extends Phaser.Scene {
    constructor() {
        super("classBullet");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 5;

        this.bulletCooldown = 3;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;
        
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

         // Create key objects
         this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
         this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
         this.nextScene = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RETURN);
         this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 40, "player", null,
                                        this.left, this.right, 5);
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
            repeat: my.sprite.bulletGroup.maxSize-1
        });
        my.sprite.bulletGroup.propertyValueSet("speed", this.bulletSpeed);

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Class Bullet.js</h2><br>A: left // D: right // Space: fire/emit // S: Next Scene'

    }

    update() {
        let my = this.my;
        this.bulletCooldownCounter--;

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
                    bullet.y = my.sprite.player.y - (my.sprite.player.displayHeight/2);
                }
            }
        }

        // update the player avatar by by calling the player's update()
        my.sprite.player.update();

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("singleBullet");
        }

    }
}
         