class Enemy extends Phaser.GameObjects.Sprite {
    // Class variable definitions -- these are all "undefined" to start
    graphics;
    curve;
    path;
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

    constructor(scene, x, y, texture, frame, enemySpeed, enemyColor, playerX, playerY) {
        // super("pathMaker");
        super(scene, x, y, texture, frame);

        // this.enemyX = Math.floor(Math.random() * 500);
        // this.enemyY = Math.floor(Math.random() * 700);
        this.x = x;
        this.y = y;

        this.visible = false;
        this.active = false;

        this.speed = enemySpeed;
        this.color = enemyColor;

        this.path = new Phaser.Curves.Path(x, y);
        this.path.lineTo(playerX, playerY);

        scene.add.existing(this);

        return this;
    }

    update() {
        if (this.active) {
            this.startFollow(this.path);
            this.y -= this.speed;
            if (this.y < -(this.displayHeight/2)) {
                this.makeInactive();
            }
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
    }

}