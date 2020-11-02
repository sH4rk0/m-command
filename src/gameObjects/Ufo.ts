import Game from "../scenes/Game";
export default class Ufo extends Phaser.Physics.Arcade.Sprite {
  private _config: UfoConfig;
  private _gameplay: Game;
  private _score: number;

  constructor(params: UfoConfig) {
    super(params.scene, params.x, params.y, params.key);
    this._config = params;
    this.create();
  }

  create() {
    this._config.scene.physics.world.enable(this);
    this.setTexture("ufo").setDepth(10).setName("ufo").setScale(2)

    this._gameplay = <Game>this._config.scene;
    
   
    var animConfig = {
      key: "rotate-ufo",
      frames: this._gameplay.anims.generateFrameNumbers(
        "ufo" ,
        {
          frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
        }
      ),
      frameRate: 10,
      repeat: -1
    };

    this._gameplay.anims.create(animConfig);

    this.play("rotate-ufo");

    let _startX: number = -40;
    let _startY: number = -40;

    let _direction:number=7;//Phaser.Math.RND.integerInRange(0, 7);
    switch (_direction) {
      case 0:
        
        _startX=0;
        _startY=100;
        this._score=1000
        this.setVelocityX(50);
        break;

      case 1:
        _startX=1280;
        _startY=100;
        this._score=1000;
        this.setVelocityX(-50);
        break;

      case 2:
        _startX=100;
        _startY=0;
        this._score=2000;
        this.setVelocityY(50);
        break;

      case 3:
        _startX=100;
        _startY=800;
        this._score=2000;
        this.setVelocityY(-50);
        break;

        case 4:
          _startX=1180;
          _startY=0;
          this._score=2000;
          this.setVelocityY(50);
          break;
          
        case 5:
          _startX=1180;
          _startY=800;
          this._score=2000;
          this.setVelocityY(-50);
          break;

          case 6:
        
            _startX=0;
            _startY=700;
            this._score=1000;
            this.setVelocityX(50);
            break;
    
          case 7:
            _startX=1280;
            _startY=700;
            this._score=1000;
            this.setVelocityX(-50);
            break;
    }

  
    this.x = _startX;
    this.y = _startY;

    
    this._gameplay._asteroidGroup.add(this);

    this._gameplay.add.existing(this);
  }

  update(): void {
    
  }

  getScore(): number {
    return this._score;
  }
}
