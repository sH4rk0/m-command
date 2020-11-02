import { leaderboard } from "../InitGame";
export default class Intro extends Phaser.Scene {
  private _logo: Phaser.GameObjects.Image;
  private _bg: Phaser.GameObjects.Image;
  private _introText: Phaser.GameObjects.BitmapText;
  private _defence: Phaser.GameObjects.Image;
  private _bg2: Phaser.GameObjects.TileSprite;
  private _earth: Phaser.GameObjects.Image;
  private _status: number;
  private _highscores: Array<any>;
  private _highscoresText: Array<Phaser.GameObjects.BitmapText>;
  private _highscoresColors: Array<number> = [
    0xff0000,
    0xffff00,
    0x00ff00,
    0x00bfff,
    0xff8200
  ];
  constructor() {
    super({
      key: "Intro"
    });
  }

  create() {
   
    if (leaderboard != undefined)
    this._highscores = leaderboard.getHighscores();
    this._status = 0;
    this._bg2 = this.add.tileSprite(0, 0, 1280, 800, "bg").setOrigin(0);
    console.log("create intro");
    this._highscoresText = [];

    let offscreen = new Phaser.Geom.Rectangle(970, 150, 50, 300);
    let leave = new Phaser.Geom.Rectangle(250, 150, 50, 300);
    this.add.particles("stars", [
      {
        emitZone: { source: offscreen },
        deathZone: { type: "onEnter", source: leave },
        frame: [0],
        frequency: 5000,
        speedX: { min: -30, max: -40 },
        lifespan: 60000,
        scale: 2
      },
      {
        emitZone: { source: offscreen },
        deathZone: { type: "onEnter", source: leave },
        frame: [1],
        frequency: 5000,
        speedX: { min: -20, max: -30 },
        lifespan: 60000,
        scale: 2
      },

      {
        emitZone: { source: offscreen },
        deathZone: { type: "onEnter", source: leave },
        frame: [2],
        frequency: 1000,
        speedX: { min: -10, max: -20 },
        lifespan: 60000,
        scale: 2
      }
    ]);

    for (let i = 0; i < 5; i++) {
      this._highscoresText[i] = this.add
        .bitmapText(
          340,
          280 + i * 70,
          "arcade",
          i +
            1 +
            "ND " +
            this.fixScore(this._highscores[i].score) +
            "  " +
            this._highscores[i].name
        )
        .setTint(this._highscoresColors[i])
        .setOrigin(0)
        .setAlpha(0);
    }

    this._earth = this.add
      .sprite(640, 1200, "earth")
      .setOrigin(0.5)
      .setScale(2);

    this._logo = this.add
      .image(640, 800, "missile-command")
      .setOrigin(0.5)
      .setAlpha(0);

    this._introText = this.add
      .bitmapText(640, 280, "carrier", "Start Game")
      .setTint(0xff8200)
      .setOrigin(0.5)
      .setAlpha(0)
      .setFontSize(30);


    this.checkLevel();

    this._bg = this.add
      .image(0, 0, "intro-bg")
      .setOrigin(0)
      .setDepth(1);

    this._defence = this.add
      .sprite(640, 620, "defence")
      .setOrigin(0.5)
      .setScale(4)
      .setAlpha(0)
      .setDepth(2);

    this.input.once("pointerdown", () => {
      this.scene.stop("Intro");
      this.scene.start("Game");
      this.scene.start("Hud");
      this.scene.bringToTop("Game");
      this.scene.bringToTop("Hud");
    });


    
    this.introAnimStart();
  }

  fixScore(score: number) {
    if ((score + "").length == 1) return score + "    ";
    if ((score + "").length == 2) return score + "   ";
    if ((score + "").length == 3) return score + "  ";
    if ((score + "").length == 4) return score + " ";
    if ((score + "").length == 5) return score + "";
    if ((score + "").length == 6) return score + "";
  }

  checkLevel(){

    if(this.registry.get("m-command-game-status")!=null){
      this._introText.setText("Continue game");
    }else{
      this._introText.setText("Start game");
    }

  }

  startChange() {
    this.time.addEvent({
      delay: 10000,
      callback: () => {
        if (this._status == 2) this._status = 0;
        switch (this._status) {
          case 0:
            this.introAnimOut();
            this._status += 1;
            break;
          case 1:
            this.highscoresOut();
            this._status += 1;
            break;
        }
        console.log("change status");
      },
      callbackScope: this,
      loop: true
    });
  }

  introAnimStart() {
    this.tweens.add({
      targets: this._earth,
      y: 700,
      duration: 1500,
      ease: "Sine.easeOut"
    });

    this.tweens.add({
      targets: this._logo,
      y: 530,
      alpha: 1,
      delay: 1000,
      duration: 500,
      ease: "Sine.easeOut"
    });

    this.tweens.add({
      targets: this._defence,
      scale: 0.8,
      alpha: 1,
      delay: 1000,
      duration: 1000,
      ease: "Sine.easeIn",
      onComplete: () => {
        this.startChange();

        this.tweens.add({
          targets: this._introText,
          alpha: 1,
          yoyo: true,
          repeat: -1,
          onComplete: () => {}
        });

        this.cameras.main.flash(
          1000,
          255,
          255,
          255,
          true,
          (cam: any, progress: number) => {}
        );
      }
    });
  }

  introAnimIn() {
    this.tweens.add({
      targets: this._earth,
      y: 700,
      duration: 1500,
      ease: "Sine.easeOut"
    });
    this.tweens.add({
      targets: this._logo,
      delay: 500,
      y: 530,

      ease: "Sine.easeOut"
    });
    this.tweens.add({
      targets: this._defence,
      y: 620,
      delay: 700,
      ease: "Sine.easeOut",
      onComplete: () => {
        this._introText.setY(280);
      }
    });
  }

  introAnimOut() {
    this._defence.setDepth(0);
    this.tweens.add({
      targets: this._earth,
      y: 1200,
      delay: 500,
      ease: "Sine.easeIn",
      onComplete: () => {
        this.highscoresIn();
      }
    });
    this.tweens.add({
      targets: this._logo,
      delay: 300,
      y: 1200,
      ease: "Sine.easeIn"
    });
    this.tweens.add({
      targets: this._defence,
      y: 1200,
      ease: "Sine.easeIn"
    });
    this.tweens.add({
      targets: this._introText,
      y: 0,
      ease: "Sine.easeIn"
    });
  }

  highscoresIn() {
    this.tweens.add({
      targets: this._highscoresText,
      duration: 500,
      alpha: 1,

      delay: (
        target: any,
        targetKey: any,
        value: any,
        targetIndex: any,
        totalTargets: any,
        tween: any
      ) => {
        return targetIndex * 100;
      }
    });
  }

  highscoresOut() {
    this.tweens.add({
      targets: this._highscoresText,
      duration: 500,
      alpha: 0,

      onComplete: () => {
        this.introAnimIn();
      }
    });
  }

  update(time: number, delta: number) {
    this._bg2.tilePositionX += 0.01 * delta;
    this._bg2.tilePositionY += 0.005 * delta;
  }
}
