import React from "react";
import Field from "./Field";
import Ticker from "../utility/Ticker";
import Game from "../store/Game";
import { observer } from "mobx-react";

const ticker = new Ticker();

export default observer(() => {
  return (
    <div className="App">
      <div className="hud">
        <div className="score">{Game.scoreP1}</div>
        <div className="controls">
          <button onClick={() => ticker.toggle()}>
            {ticker.isPaused ? "resume" : "pause"}
          </button>
          <button onClick={() => ticker.tick(0.03)}>Tick</button>
        </div>
        <div className="score">{Game.scoreP2}</div>
      </div>
      <Field width="500" height="300" ticker={ticker} />
    </div>
  );
});
