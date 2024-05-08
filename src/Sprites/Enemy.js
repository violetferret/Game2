class Enemy extends Phaser.GameObjects.Sprite {
    // Class variable definitions -- these are all "undefined" to start
    graphics;
    curve;
    path;

    constructor(scene, x, y, texture, frame, enemySpeed) {
        super("pathMaker");
        super(scene, x, y, texture, frame);

        // this.enemyX = Math.floor(Math.random() * 500);
        // this.enemyY = Math.floor(Math.random() * 700);
        this.x = x;
        this.y = y;

        this.visible = false;
        this.active = false;

        this.path = new Path([x], [y]);

        scene.add.existing(this);

        return this;
    }

    update() {
        if (this.active) {
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