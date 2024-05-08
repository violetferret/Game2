class Enemy extends Phaser.GameObjects.Sprite {
    // Class variable definitions -- these are all "undefined" to start
    graphics;
    curve;
    path;

    constructor(x, y) {
        super("pathMaker");
        // super(scene, x, y, texture, frame);

        this.enemyX = Math.floor(Math.random() * 500);
        this.enemyY = Math.floor(Math.random() * 700);
        this.visible = false;
        this.active = false;

        this.path = new Path([x], [y]);

        scene.add.existing(this);

        return this;
    }

    update() {
        if (this.X >= 500 || this.Y >= 700) {
            this.destroy();
        }
    }

    follow() {
        // this.path = ;
    }

}