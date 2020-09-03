import * as firebase from "firebase";

export default class Leaderboard {
  private firebaseConfig = {
    apiKey: "AIzaSyDFfKlU0hWLYI9G5roUrBlWsw_5yatCPHk",
    authDomain: "m-command.firebaseapp.com",
    databaseURL: "https://m-command.firebaseio.com",
    projectId: "m-command",
    storageBucket: "m-command.appspot.com",
    messagingSenderId: "1065181379206",
    appId: "1:1065181379206:web:51a05238a15c4ad72e2f07",
    measurementId: "G-M7EJZL1DFT"
  };
  private fireBaseApp: firebase.app.App;
  private fireBaseDb: firebase.database.Database;
  private scores: firebase.database.Reference;
  private highscores: Array<any>;
  private allscores: Array<any>;

  constructor() {
    this.fireBaseApp = firebase.initializeApp(this.firebaseConfig);
    this.fireBaseDb = this.fireBaseApp.database();
    this.scores = this.fireBaseDb.ref("scores");
    this.highscores = [];
    this.allscores = [];
    this.getData();
  }

  insertScore(score: ScoreConfig) {
    this.scores.push(score);
  }

  getHighscores() {
    return this.highscores;
  }

  getData() {
    this.scores.on("value", data => {
      //console.log(data.val());
      this.allscores = [];
      Object.entries(data.val()).forEach(entry => {
        let key = entry[0];
        let value = entry[1];
        this.allscores.push(value);
      });

      this.allscores.sort((a: any, b: any) => {
        const valueA = a.score;
        const valueB = b.score;

        let comparison = 0;
        if (valueA < valueB) {
          comparison = 1;
        } else if (valueA > valueB) {
          comparison = -1;
        }
        return comparison;
      });

      this.highscores = [];
      for (let i = 0; i < 5; i++) {
        this.highscores.push(this.allscores[i]);
      }

      //console.log(this.highscores);
    });
  }
}
