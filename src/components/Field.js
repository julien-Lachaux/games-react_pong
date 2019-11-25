import React from "react";
import Wall from "./Wall";
import Ball from "./Ball";
import Paddle from "./Paddle";
import { TYPE_KEYBOARD, TYPE_AI } from "../utility/PaddleController";
import PaddleController from "../utility/PaddleController";
import BallController from "../utility/BallController";

const ballController = new BallController();
// FUNNY THING: make p1 AI as well and see what happens, be amazed
const controller1 = new PaddleController(TYPE_KEYBOARD);
const controller2 = new PaddleController(TYPE_AI);

export default class Field extends React.Component {
  constructor(props) {
    super(props);
    const ticker = props.ticker;

    ticker.add(delta => {
      this.setState({
        ball: ballController.moveBall(delta, this.state.ball, this.props, [
          this.state.leftPaddle,
          this.state.rightPaddle
        ])
      });
    });
    ticker.add(delta => {
      let result = controller1.movePaddle(
        delta,
        this.state.leftPaddle,
        this.props
      );
      if (result) {
        this.setState({
          leftPaddle: result
        });
      }
    });
    ticker.add(delta => {
      let result = controller2.movePaddle(
        delta,
        this.state.rightPaddle,
        this.props,
        // send the ball for "AI" to predict it's path
        this.state.ball
      );
      if (result) {
        this.setState({
          rightPaddle: result
        });
      }
    });

    this.state = {
      leftPaddle: {
        x: 0,
        y: props.height * 0.5 - 25,
        width: 10,
        height: 50
      },
      rightPaddle: {
        x: props.width - 10,
        y: props.height * 0.5 - 25,
        width: 10,
        height: 50
      },
      ball: {
        x: props.width * 0.5,
        y: props.height * 0.5,
        speedX: 100,
        speedY: 100,
        size: 10
      }
    };
  }

  render() {
    const props = this.props;
    const width = props.width;
    const height = props.height;
    const style = {
      width: props.width + "px",
      height: props.height + "px"
    };
    const ball = this.state.ball;
    const p1 = this.state.leftPaddle;
    const p2 = this.state.rightPaddle;

    return (
      <div className="field" style={style}>
        <Wall x="0" y="-10" width={width} height="10" />
        <Wall x="0" y={height} width={width} height="10" />
        <Paddle x={p1.x} y={p1.y} width={p1.width} height={p1.height} />
        <Paddle x={p2.x} y={p2.y} width={p2.width} height={p2.height} />
        <Ball
          size={ball.size}
          x={ball.x}
          y={ball.y}
          overlapping={ball.overlapping}
        />
      </div>
    );
  }
}
