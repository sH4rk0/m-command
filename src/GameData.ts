export let GameData: any = {
  levels: [
    {
      level: "SWARM 1",
      title: "Destoy the asteroids!",
      type: 0,
      rockets:{s:5,p:0,sw:0},
      asteroids: {
        quantity: 2,
        speed: { min: 70, max: 60 },
        spawn: { min: 3000, max: 4000 }
      },
      sequence:[{t:0,d:1000},{t:1,d:5000},{t:0}]
    },
    {
      level: "SWARM 2",
      title: "Destoy all the asteroids!",
      type: 0,
      rockets:{s:3,p:0,sw:0},
      asteroids: {
        quantity: 5,
        speed: { min: 70, max: 80 },
        spawn: { min: 1000, max: 2000 }
      },
      sequence:[{t:0,d:0},{t:0,d:0},{t:0,d:0},{t:0,d:0},{t:0,d:0}]
    },
    {
      level: "SWARM 3",
      title: "Destoy all the asteroids!",
      type: 0,
      rockets:{s:5,p:0,sw:1},
      asteroids: {
        quantity: 7,
        speed: { min: 80, max: 90 },
        spawn: { min: 1000, max: 2000 }
      }
    },

    {
      level: "SWARM 4",
      title: "Destoy all the asteroids!",
      type: 0,
      rockets:{s:5,p:1,sw:0},
      asteroids: {
        quantity: 7,
        speed: { min: 80, max: 90 },
        spawn: { min: 1000, max: 2000 }
      }
    }
  ],
  tilemaps: [],

  spritesheets: [
    {
      name: "explosion-2",
      path: "assets/images/game/explosion2.png",
      width: 64,
      height: 64,
      spacing: 25
    },
    {
      name: "ufo",
      path: "assets/images/game/ufo.png",
      width: 28,
      height: 29,
      frames: 16
    },
    {
      name: "asteroid-0",
      path: "assets/images/game/asteroid-0.png",
      width: 80,
      height: 80,
      frames: 12
    },
    {
      name: "asteroid-1",
      path: "assets/images/game/asteroid-1.png",
      width: 80,
      height: 80,
      frames: 12
    },
    {
      name: "asteroid-2",
      path: "assets/images/game/asteroid-2.png",
      width: 100,
      height: 100,
      frames: 15
    },
    {
      name: "asteroid-3",
      path: "assets/images/game/asteroid-3.png",
      width: 70,
      height: 70,
      frames: 13
    },
    {
      name: "shockwave",
      path: "assets/images/game/shockwave.png",
      width: 192,
      height: 192,
      frames: 25
    },
    {
      name: "asteroid-emitter",
      path: "assets/images/game/asteroids-emitter.png",
      width: 128,
      height: 128,
      frames: 6
    },
    {
      name: "ufo-emitter",
      path: "assets/images/game/ufo-emitter.png",
      width: 128,
      height: 128,
      frames: 6
    },
    {
      name: "missile",
      path: "assets/images/game/missile.png",
      width: 30,
      height: 30,
      frames: 3
    }
  ],

  atlas: [],

  images: [
    {
      name: "bg",
      path: "assets/images/game/bg.jpg"
    },

    {
      name: "earth",
      path: "assets/images/game/earth.png"
    },
    {
      name: "defence",
      path: "assets/images/intro/defence.png"
    },

    {
      name: "intro-bg",
      path: "assets/images/intro/intro-bg.png"
    },
    {
      name: "missile-command",
      path: "assets/images/intro/missile-command.png"
    },
    {
      name: "scanlines",
      path: "assets/images/scanlines.png"
    },
    {
      name: "rub",
      path: "assets/images/gameover/rub.png"
    },
    {
      name: "end",
      path: "assets/images/gameover/end.png"
    },
    {
      name: "block",
      path: "assets/images/gameover/block.png"
    }
  ],

  sounds: [
    {
      name: "explosion",
      paths: ["assets/sounds/explosion.ogg", "assets/sounds/explosion.m4a"],
      volume: 1,
      loop: false
    },
    {
      name: "launch",
      paths: ["assets/sounds/launch.ogg", "assets/sounds/launch.m4a"],
      volume: 1,
      loop: false
    },
    {
      name: "seismic",
      paths: ["assets/sounds/seismic.ogg", "assets/sounds/seismic.m4a"],
      volume: 1,
      loop: false
    }
  ],

  audio: [
    /*{
      name: "sfx",
      jsonpath: "assets/sounds/sfx.json",
      paths: ["assets/sounds/sfx.ogg", "assets/sounds/sfx.mp3"],
      instances: 4
    }*/
  ],

  script: [
    {
      key: "webfont",
      path: "assets/js/webfonts.js"
    }
  ],

  bitmapfont: [
    {
      name: "carrier",
      imgpath: "assets/fonts/carrier_command.png",
      xmlpath: "assets/fonts/carrier_command.xml"
    },
    {
      name: "arcade",
      imgpath: "assets/fonts/arcade.png",
      xmlpath: "assets/fonts/arcade.xml"
    }
  ]
};
