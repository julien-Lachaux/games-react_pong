import { observable, decorate } from "mobx";

class Game {
  scoreP1 = 0;
  scoreP2 = 0;
}

decorate(Game, {
  scoreP1: observable,
  scoreP2: observable
});

export default new Game();
