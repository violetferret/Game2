class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver")
    }

    preload() {
        this.load.image("background", "assets/kenney_space-shooter-redux/Backgrounds/black.png");
        this.load.bitmapFont("rocketSquare", "assets/KennyRocketSquare_0.png", "assets/KennyRocketSquare.fnt");
    }

    create() {
        // Create background
        for (let w = 0; w < 768; w += 256) {
            for (let h = 0; h < 1024; h += 256) {
                this.add.image(w, h, "background");
            }
        }

        this.gameOver = this.add.bitmapText(80, 320, "rocketSquare", "Game Over!");
        this.gameOver.setScale(1.5)
    }

    update() {

    }
}