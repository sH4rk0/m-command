import Game from "../scenes/Game";
import { GameData } from "../GameData";

export default class HUD extends Phaser.Scene {
  private livesGroup: Phaser.GameObjects.Group;
  private _isPaused: boolean = false;
  private _levels: Array<level>;
  private _currentLevel: level;
  private _currentLevelIndex: number;
  private _gamePlay: Game;

  private _levelCompleted: boolean;
  private _levelStarted: boolean;
  private _scoreText: Phaser.GameObjects.BitmapText;
  private _scoreValue: number;
  private _spawn: number;
  private _hits: number;
  private _totalHits: number;
  
  private _asteroids: number;
  private _asteroidsMax: number;
  private _rockets: number;

  private _missileSimpleQuantity:number;
  private _missileShockwaveQuantity:number;
  private _missilePerforantQuantity:number;

  private _missileSimpleQuantityText:Phaser.GameObjects.BitmapText;
  private _missileShockwaveQuantityText:Phaser.GameObjects.BitmapText;
  private _missilePerforantQuantityText:Phaser.GameObjects.BitmapText;

  private _energy:number;

  private _spawnMin: number;
  private _spawnMax: number;
  private _speedMin: number;
  private _speedMax: number;

  private _rocketSelector: number;

  private _levelStatusStore: levelStatusStore;

  private _updateScore: Phaser.Events.EventEmitter;

  private _wave: Phaser.GameObjects.BitmapText;
  private _waveTitle: Phaser.GameObjects.BitmapText;
  private _completedText: Phaser.GameObjects.BitmapText;
  private _completedSummary: Phaser.GameObjects.BitmapText;

  private _levelContainer: Phaser.GameObjects.Container;

  private _continue: Phaser.GameObjects.BitmapText;
  private _retry: Phaser.GameObjects.BitmapText;

  private _cursor: Phaser.GameObjects.Image;
  private _launchers: Array<boolean>;
  private _stopNext:boolean=false;
  private _currentSequence:number=0;

  constructor() {
    super({
      key: "Hud"
    });

    this._levels = GameData.levels;
  }

  create(): void {
    console.log("create hud");


    


    this._missilePerforantQuantity=0;
    this._missileShockwaveQuantity=0;
    this._missileSimpleQuantity=0;
    this._energy=0;
    this._scoreValue=0;

    this._launchers = [true, true, true];

    let _rocket1: Phaser.GameObjects.Image = this.add
      .sprite(1040, 45, "missile")
      .setFrame(0)
      .setOrigin(0.5)
      .setScale(2)
      .setInteractive();
    _rocket1.on(
      "pointerdown",
      (
        pointer: Phaser.Input.Pointer,
        localX: number,
        localY: number,
        e: Phaser.Types.Input.EventData
      ) => {
        this.setRocket(0);
        e.stopPropagation();
      }
    );

    let _rocket2: Phaser.GameObjects.Image = this.add
      .sprite(1120, 45, "missile")
      .setFrame(2)
      .setOrigin(0.5)
      .setScale(2)
      .setInteractive()
      .on(
        "pointerdown",
        (
          pointer: Phaser.Input.Pointer,
          localX: number,
          localY: number,
          e: Phaser.Types.Input.EventData
        ) => {
          this.setRocket(1);
          e.stopPropagation();
        }
      );

    let _rocket3: Phaser.GameObjects.Image = this.add
      .sprite(1200, 45, "missile")
      .setFrame(1)
      .setOrigin(0.5)
      .setScale(2)
      .setInteractive();
    _rocket3.on(
      "pointerdown",
      (
        pointer: Phaser.Input.Pointer,
        localX: number,
        localY: number,
        e: Phaser.Types.Input.EventData
      ) => {
        this.setRocket(2);
        e.stopPropagation();
      }
    );

    this._cursor = this.add
      .image(1040, 45, "block")
      .setOrigin(0.5)
      .setScale(2);

    this.tweens.add({
      targets: this._cursor,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 350
    });

    this._gamePlay = <Game>this.scene.get("Game");
    this._currentLevelIndex = 0;
    this._scoreText = this.add
      .bitmapText(10, 10, "arcade", "0")
      .setFontSize(30);


      this._missilePerforantQuantityText = this.add
      .bitmapText(1120, 10, "arcade", this._missilePerforantQuantity+"")
      .setFontSize(10).setOrigin(.5);
      this._missileShockwaveQuantityText = this.add
      .bitmapText(1200, 10, "arcade", this._missileShockwaveQuantity+"")
      .setFontSize(10).setOrigin(.5);
      this._missileSimpleQuantityText = this.add
      .bitmapText(1040, 10, "arcade", this._missileSimpleQuantity+"")
      .setFontSize(10).setOrigin(.5);
    
    this._hits = 0;
    this._totalHits=0;
    this._rocketSelector = 0;
    this._levelStarted = false;
    this._levelCompleted = false;
    this._asteroids = 0;
    this._asteroidsMax = 0;
    this._rockets = 0;

    this._gamePlay.events.off("updateScore", this.updateScore, this);
    this._updateScore = this._gamePlay.events.on(
      "updateScore",
      this.updateScore,
      this
    );

    this.scale.on("orientationchange", (orientation: any) => {
      if (orientation === Phaser.Scale.PORTRAIT) {
        this.pauseGame();
      } else if (orientation === Phaser.Scale.LANDSCAPE) {
        this.resumeGame();
      }
    });

    this.input.keyboard.on("keydown-A", (event: Event) => {
      this.setRocket(0);
    });
    this.input.keyboard.on("keydown-S", (event: Event) => {
      if(this._missilePerforantQuantity==0) return;
      this.setRocket(1);
    });
    this.input.keyboard.on("keydown-D", (event: Event) => {
      if(this._missileShockwaveQuantity==0) return;
      this.setRocket(2);
    });

    this.input.keyboard.on("keydown-O", (event: Event) => {
      this.game.renderer.snapshot((image: any) => {
        let mimeType = "image/png";
        var imgURL = image.src;
        var dlLink = document.createElement("a");
        dlLink.download = "snapshot";
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [
          mimeType,
          dlLink.download,
          dlLink.href
        ].join(":");
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
      });
    });

    this.input.keyboard.on("keydown-P", (event: Event) => {
      if (this._isPaused) {
        this.resumeGame();
      } else {
        this.pauseGame();
      }
    });
    

    this._continue = this.add
    .bitmapText(440, 600, "carrier", "Continue")
    .setTint(0x02af02)
    .setOrigin(0.5)
    .setAlpha(0)
    .setFontSize(30)
    .setInteractive()
    
    .on("pointerover", () => {
      this._continue.setTint(0x00ff00);
      //this.sound.add("charge").play({ volume: 1 });
    })
    .on("pointerout", () => {
      this._continue.setTint(0x02af02);
    })
    .on(
      "pointerdown",
      (
        pointer: Phaser.Input.Pointer,
        localX: number,
        localY: number,
        e: Phaser.Types.Input.EventData
      ) => {
        //this._currentLevelIndex += 1;
        //console.log("continue", this._currentLevelIndex);
        this.tweens.add({targets:this._levelContainer,alpha:0,duration:500,onComplete:()=>{
          this.setUpLevel();
        }})
      
        e.stopPropagation();
      }
    );

  this._retry = this.add
    .bitmapText(840, 600, "carrier", "Retry")
    .setTint(0xcb6902)
    .setOrigin(0.5)
    .setAlpha(0)
    .setFontSize(30)
    .setInteractive()
    
    .on("pointerover", () => {
      this._retry.setTint(0xff8200);
     // this.sound.add("charge").play({ volume: 1 });
    })
    .on("pointerout", () => {
      this._retry.setTint(0xcb6902);
    })
    .on(
      "pointerdown",
      (
        pointer: Phaser.Input.Pointer,
        localX: number,
        localY: number,
        e: Phaser.Types.Input.EventData
      ) => {
     

       this.tweens.add({targets:this._levelContainer,alpha:0,duration:500,onComplete:()=>{
         this.restartLevelValues();
        this.setUpLevel();
      }})
       
        e.stopPropagation();
      }
    );


    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this._levelStarted && !this._levelCompleted) {
        this._rockets += 1;
        switch (this._rocketSelector) {
          case 0:
            if (this.isLaucherReady(0) && this._missileSimpleQuantity>0) {
              this._missileSimpleQuantity-=1;
              this._missileSimpleQuantityText.setText( this._missileSimpleQuantity+"");
             
              this.disableLauncher(0);
              this._gamePlay.launchMissile(pointer);
            }
            break;

          case 1:
            if (this.isLaucherReady(1) && this._missilePerforantQuantity>0) {
              this._missilePerforantQuantity-=1;
              this._missilePerforantQuantityText.setText( this._missilePerforantQuantity+"");

              this.disableLauncher(1);
              this._gamePlay.launchPerforant(pointer);
            }
            break;

          case 2:
            if (this.isLaucherReady(2) && this._missileShockwaveQuantity>0) {
              this._missileShockwaveQuantity-=1;
              this._missileShockwaveQuantityText.setText( this._missileShockwaveQuantity+"");
              this.disableLauncher(2);
              this._gamePlay.launchShockwave(pointer);
            }

            break;
        }
      }
    });

    this._wave = this.add
      .bitmapText(640, 200, "arcade", "")
      .setTint(0xff8200)
      .setOrigin(0.5)
      .setAlpha(0)
      .setFontSize(60);

    this._waveTitle = this.add
      .bitmapText(640, 260, "carrier", "")
      .setTint(0x00ff00)
      .setOrigin(0.5)
      .setAlpha(0)
      .setFontSize(20);

    this._completedText = this.add
      .bitmapText(640, 200, "arcade", "LEVEL COMPLETED")
      .setTint(0x00ff00)
      .setOrigin(0.5)
      .setAlpha(0)
      .setFontSize(60);

    this._completedSummary = this.add
      .bitmapText(640, 400, "carrier", "")
      .setTint(0xffffff)
      .setOrigin(0.5)
      .setAlpha(0)
      .setFontSize(30);



      this._levelContainer=this.add.container(0,0)

      this._levelContainer.add([this._completedText,this._completedSummary,this._continue,this._retry])

    
    this.setUpLevel();

  }

  disableLauncher(index: number): void {
    this._launchers[index] = false;
    let _delay: number = 1000;
    this.time.addEvent({
      delay: _delay,
      callback: () => {
        this.enableLauncher(index);
      },
      callbackScope: this
    });
  }
  enableLauncher(index: number): void {
    this._launchers[index] = true;
  }
  isLaucherReady(index: number): boolean {
    return this._launchers[index];
  }

  storeStartLevelValues():void{

    this._levelStatusStore={level:this._currentLevelIndex,missilePerforant:this._missilePerforantQuantity,missileShockwave:this._missileShockwaveQuantity,missileSimple:this._missileSimpleQuantity,energy:0,score:this._scoreValue}
    localStorage.setItem("m-command-game-status",JSON.stringify(this._levelStatusStore));

   // console.log(_levelValues)

  }

  restartLevelValues():void{

    this._currentLevelIndex=this._levelStatusStore.level;
    this._missilePerforantQuantity=this._levelStatusStore.missilePerforant;
    this._missileShockwaveQuantity=this._levelStatusStore.missileShockwave;
    this._missileSimpleQuantity=this._levelStatusStore.missileSimple;
    this.updateRocketsValues();
    this._scoreValue=this._levelStatusStore.score;
    this._scoreText.setText(this._scoreValue+"");
    this._energy=this._levelStatusStore.energy;

  }

  

  setRocket(index: number): void {
    switch (index) {
      case 0:
        this._rocketSelector = 0;
        this._cursor.setX(1040);
        break;

      case 1:
        this._rocketSelector = 1;
        this._cursor.setX(1120);
        break;

      case 2:
        this._rocketSelector = 2;
        this._cursor.setX(1200);
        break;
    }
  }

  update(time: number, delta: number) {
    if (this._levelStarted) {

      if (this._hits == this._asteroidsMax) {
        this._levelCompleted = true;
        this._levelStarted = false;
        this._currentLevelIndex += 1;
        this.levelCompleted();
      } 

      /*
     
      switch (this._currentLevel.type) {
        case 0: //destry asteroids
         
          if (this._hits == this._asteroidsMax) {
            this._levelCompleted = true;
            this._levelStarted = false;
            this._currentLevelIndex += 1;
            this.levelCompleted();
          } else {
            if (
              this._spawn < this.time.now &&
              !this._levelCompleted &&
              this._asteroids <= this._asteroidsMax
            ) {
              this._spawn =
                this.time.now +
                (Phaser.Math.RND.integerInRange(
                  this._spawnMin,
                  this._spawnMax
                ) -
                  100);

              this._asteroids += 1;
              //console.log(this._asteroids, this._asteroidsMax);
              if (this._asteroids <= this._asteroidsMax)
                this._gamePlay.createAsteroid({
                  speed: Phaser.Math.RND.integerInRange(
                    this._speedMin,
                    this._speedMax
                  )
                });
            }
          }

          break;

        case 1: //resist time
          break;
      }*/
    }
    
  }

  nextSequence(_delay:number){

    if(this._stopNext) return;
    this.time.addEvent({delay:_delay,callback:this.getSequence,callbackScope:this})

  }

  getSequence(){
    if(this._stopNext) return;
    let _nextitem:itemData = this._levels[this._currentLevelIndex].sequence[this._currentSequence];
   
    if(_nextitem!=undefined){
      this._currentSequence++;

      if(this._levels[this._currentLevelIndex].sequence[this._currentSequence]==undefined){
       // console.log("last")
        this.addItem(true,_nextitem);
      }else{
       // console.log("not last")
        this.addItem(false,_nextitem);
        this.nextSequence(_nextitem.d)
      }

    }
  
  }

  addItem(_isLast:boolean,_itemData:itemData) {

    let _type:number=_itemData.t;

    switch(_type){

      case 0:
        this._gamePlay.createAsteroid({
          speed: Phaser.Math.RND.integerInRange(
            this._speedMin,
            this._speedMax
          )
        });
        break;

        case 1:
        this._gamePlay.createUfo({
          speed: Phaser.Math.RND.integerInRange(
            this._speedMin,
            this._speedMax
          )
        });
        break;


    }
   


  } 

  private updateRocketsValues():void{

    this._missileSimpleQuantityText.setText( this._missileSimpleQuantity+"");
    this._missileShockwaveQuantityText.setText( this._missileShockwaveQuantity+"");
    this._missilePerforantQuantityText.setText( this._missilePerforantQuantity+"");
  }

  private setUpLevel():void {

    //console.log("setUpLevel", this._currentLevelIndex);

    this.storeStartLevelValues();
    this._retry.removeInteractive();
    this._continue.removeInteractive();
    this._currentLevel = this._levels[this._currentLevelIndex];
    this._missileShockwaveQuantity+=this._currentLevel.rockets.sw;
    this._missilePerforantQuantity+=this._currentLevel.rockets.p;
    this._missileSimpleQuantity+=this._currentLevel.rockets.s;
    this._currentSequence=0;
    this.updateRocketsValues();

    this._hits = 0;
    this._asteroids = 0;
    this._levelCompleted = false;
    this._rockets = 0;
    this._spawn = this.time.now;

    this._wave.setText(this._currentLevel.level);
    this._waveTitle.setText(this._currentLevel.title);

    switch (this._currentLevel.type) {
      case 0: //destroy asteroids
        if (
          this._currentLevel.asteroids != undefined &&
          this._currentLevel.asteroids.spawn != undefined
        ) {
          this._spawnMin = this._currentLevel.asteroids.spawn.min;
          this._spawnMax = this._currentLevel.asteroids.spawn.max;
        }

        if (
          this._currentLevel.asteroids != undefined &&
          this._currentLevel.asteroids.speed != undefined
        ) {
          this._speedMin = this._currentLevel.asteroids.speed.min;
          this._speedMax = this._currentLevel.asteroids.speed.max;
        }

        if (
          this._currentLevel.asteroids != undefined &&
          this._currentLevel.asteroids.quantity != undefined
        ) {
          this._asteroidsMax = this._currentLevel.asteroids.quantity;
        }

        break;

      case 1: //resist time
        break;
    }

    this._gamePlay.tweens.add({
      targets: this._wave,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        this._gamePlay.tweens.add({
          targets: this._waveTitle,
          alpha: 1,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            this._gamePlay.tweens.add({
              targets: this._wave,
              alpha: 0,
              duration: 500,
              completeDelay: 1000,
              onComplete: () => {
               // console.log("start level");
                this._levelStarted = true;
                this.nextSequence(0)
                  
              }
            });
          }
        });
      }
    });
  }

  levelCompleted() {

    this._levelContainer.setAlpha(1);
    this._gamePlay._asteroidGroup.clear(false,true);
    this._retry.setInteractive().setAlpha(1);
    this._continue.setInteractive().setAlpha(1);
    this._completedText.setAlpha(0);
    this._completedSummary
      .setText(
        "Missile launched: " +
          this._rockets +
          "\n\nTargets hit: " +
          this._totalHits +
          "\n\nHit ratio: " +
          ((100 * this._totalHits) / this._rockets).toFixed(1) +
          "%"
      )
      .setAlpha(0);

    this._gamePlay.tweens.add({
      targets: this._completedText,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        this._gamePlay.tweens.add({
          targets: this._completedSummary,
          alpha: 1,
          completeDelay: 3000,
          onComplete: () => {
           
           /* this._gamePlay.tweens.add({
              targets: [this._completedText, this._completedSummary],
              alpha: 0,
              duration: 500,
              onComplete: () => {
                this.setUpLevel();
              }
            });*/


          }
        });
      }
    });
  }

  private pauseGame() {
    this.game.scene.pause("Game");
    this._isPaused = true;
  }
  private resumeGame() {
    this.game.scene.resume("Game");
    this._isPaused = false;
  }

  private updateScore(parameters: Array<any>): void {
    //console.log("updateScore");
   if( parameters[1]) this._hits += 1;
   this._totalHits+=1;
    this._scoreValue += parameters[0];
    this._scoreText.setText(this._scoreValue + "");
    this.registry.set("score", this._scoreValue);
  }
}
