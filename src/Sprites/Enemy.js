class Enemy extends Phaser.GameObjects.Sprite {
// Class variable definitions -- these are all "undefined" to start
graphics;
curve;
path;
    
    constructor(){
        super("pathMaker");
        
        scene.add.existing(this);

        return this;
    }

    create() {
        

    }

    update() {
        this.startFollow()
    }

}