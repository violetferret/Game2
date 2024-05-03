// Elliot Ahlstroem

class Path extends Phaser.Scene {
    // Class variable definitions -- these are all "undefined" to start
    graphics;
    curve;
    path;

    constructor(){
        super("pathMaker");
    }

    preload() {
        // this.load.setPath("./assets/");   
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
        
        
        
    }

    update() {

    }

}