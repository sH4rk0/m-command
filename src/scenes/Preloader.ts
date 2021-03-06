/**
 * @author       Francesco Raimondo <francesco.raimondo@gmail.com>
 * @copyright    2019 zero89
 * @description  Run4Mayor
 * @license      zero89
 */
import { leaderboard } from "../InitGame";
import { GameData } from "../GameData";

export default class Preloader extends Phaser.Scene {
  private _body: HTMLElement;
  private _loading: Phaser.GameObjects.Text;
  private _text: Phaser.GameObjects.Text;
  private _progress: Phaser.GameObjects.Graphics;
  private _bg: Phaser.GameObjects.TileSprite;
  private _leaderboardIsActive: boolean;

  constructor() {
    super({
      key: "Preloader"
    });
  }

  preload() {
    //console.log('Preloader:preload')
    this._progress = this.add.graphics();
    this.loadAssets();
  }

  update(time: number, delta: number) {
    this._bg.tilePositionX += 0.05 * delta;
  }

  init() {
    this._body = document.getElementsByTagName("body")[0];
    this._bg = this.add.tileSprite(0, 0, 1280, 800, "loading-bg").setOrigin(0);

    /*let particles = this.add.particles("spark");

    let emitter = particles.createEmitter({
      x: 680,
      y: 400,
      scale: { start: 2, end: 1 },
      angle: { min: 170, max: 190 },
      frequency: 20,
      gravityY: 0,
      lifespan: { min: 1000, max: 2000 },
      speedX: { min: -100, max: -400, steps: 12 },
      speedY: { min: -20, max: 20 },
      tint: [0x666666, 0x777777, 0x555555, 0x888888],
      blendMode: "ADD"
    });*/
    /*
  let _missile: Phaser.GameObjects.Sprite = this.add.sprite(
      640,
      400,
      "loading-missile"
    );
    _missile.setScale(4);

    var animConfig = {
      key: "loading",
      frames: this.anims.generateFrameNumbers("loading-missile", {
        frames: [0, 1, 2, 4, 5, 6, 7, 8, 9]
      }),
      frameRate: 10,
      repeat: -1
    };
     this.anims.create(animConfig);
 _missile.play("loading");
 */

    let offscreen = new Phaser.Geom.Rectangle(1280, 0, 50, 800);
    let leave = new Phaser.Geom.Rectangle(-40, 0, 40, 800);

    this.add.particles("stars", [
      {
        emitZone: { source: offscreen },
        deathZone: { type: "onEnter", source: leave },
        frame: [0],
        frequency: 1000,
        speedX: { min: -100, max: -120 },
        lifespan: 30000,
        scale: 2
      },
      {
        emitZone: { source: offscreen },
        deathZone: { type: "onEnter", source: leave },
        frame: [1],

        frequency: 2000,
        speedX: { min: -80, max: -100 },
        lifespan: 30000,
        scale: 2
      },

      {
        emitZone: { source: offscreen },
        deathZone: { type: "onEnter", source: leave },
        frame: [2],
        frequency: 2000,
        speedX: { min: -60, max: -80 },
        lifespan: 30000,
        scale: 2
      }
    ]);

    let _asteroid: Phaser.GameObjects.Sprite = this.add.sprite(
      -200,
      400,
      "asteroid"
    );
    _asteroid.setScale(2);

    this.tweens.add({ targets: _asteroid, x: 640, duration: 10000 });

    let _arr: Array<number> = [];
    for (let i = 0; i < 60; i++) {
      _arr.push(i);
    }

    let animConfig = {
      key: "rotating",
      frames: this.anims.generateFrameNumbers("asteroid", {
        frames: _arr
      }),
      frameRate: 12,
      repeat: -1
    };
    this.anims.create(animConfig);
    _asteroid.play("rotating");

    const _config = {
      font: "35px",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
      wordWrap: true,
      wordWrapWidth: 1000
    };

    this._loading = this.add
      .text(this.game.canvas.width / 2, 720, "", _config)
      .setStroke("#000000", 10)
      .setAlpha(1)
      .setOrigin(0)
      .setFontFamily('"Press Start 2P"')
      .setDepth(1001)
      .setOrigin(0.5);
  }

  
 checkLeaderboard(){


  if (leaderboard != undefined && leaderboard.getHighscores().length>0 && !this._leaderboardIsActive){

    this._leaderboardIsActive=true;


    this.tweens.add({
      targets: [this._text],
      alpha: 1,
      x: 20,
      duration: 250,
      ease: "Sine.easeOut",
      delay: 200
    });
    this._loading.setText("Tap/click to start");
    this._body.className = "";
    this._progress.clear();

    this.input.once("pointerdown", () => {
      this.registry.set("m-command-game-status", null);

      let _dataStorage=localStorage.getItem("m-command-game-status");
      if(_dataStorage!=null){
        this.registry.set("m-command-game-status", _dataStorage);
      }

      this.scene.start("Intro");
      //this.scene.start("ScoreInput");
      //this.scene.start("GameOver");
    });
    
  
  }

  


 }


  loadAssets(): void {
    this._body.className = "loading";

    this.load.on("start", () => {});

    this.load.on("fileprogress", (file: any, value: any) => {
      //console.log(file, value)
    });

    this.load.on("progress", (value: any) => {
      this._progress.clear();
      this._progress.fillStyle(0xffffff, 1);
      this._progress.fillRect(0, 700, 1280 * value, 40);
      this._loading.setText("Loading..." + Math.round(value * 100) + "%");
    });

    this.load.on("complete", () => {

      this.time.addEvent({delay:500,callback:this.checkLeaderboard,callbackScope:this,repeat:-1})
    
    });

    //Assets Load
    //--------------------------

    //SCRIPT
    GameData.script.forEach((element: ScriptAsset) => {
      this.load.script(element.key, element.path);
      //@ts-ignore
    });

    // IMAGES
    GameData.images.forEach((element: ImageAsset) => {
      this.load.image(element.name, element.path);
    });

    // TILEMAPS
    GameData.tilemaps.forEach((element: TileMapsAsset) => {
      this.load.tilemapTiledJSON(element.key, element.path);
    });

    // ATLAS
    GameData.atlas.forEach((element: AtlasAsset) => {
      this.load.atlas(element.key, element.imagepath, element.jsonpath);
    });

    // SPRITESHEETS
    GameData.spritesheets.forEach((element: SpritesheetsAsset) => {
      this.load.spritesheet(element.name, element.path, {
        frameWidth: element.width,
        frameHeight: element.height,
        endFrame: element.frames
      });
    });

    //bitmap fonts
    GameData.bitmapfont.forEach((element: BitmapfontAsset) => {
      this.load.bitmapFont(element.name, element.imgpath, element.xmlpath);
    });

    // SOUNDS
    GameData.sounds.forEach((element: SoundAsset) => {
      this.load.audio(element.name, element.paths);
    });

    // Audio
    GameData.audio.forEach((element: AudioSpriteAsset) => {
      this.load.audioSprite(
        element.name,
        element.jsonpath,
        element.paths,
        element.instance
      );
    });
  }
}
