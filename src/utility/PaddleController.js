export const TYPE_KEYBOARD = "keyboard";
export const TYPE_AI = "AI";

const KEY_UP = 38;
const KEY_DOWN = 40;

export default class PaddleController {
  constructor(type) {
    this.speed = 150;
    this.moveUp = false;
    this.moveDown = false;
    this.boundHandlers = {
      keyup: this.keyupHandler.bind(this),
      keydown: this.keydownHandler.bind(this)
    };

    // everything is done, set controller type
    this.setType(type);
  }

  movePaddle(delta, paddle, field, ball) {
    let y = paddle.y,
      min = 0,
      max = field.height - paddle.height;

    // check AI for movement
    if (this.type === TYPE_AI) {
      let resultY = this.predictBallPosition(field, ball) - paddle.height * 0.5;
      if (resultY > paddle.y) {
        this.moveUp = false;
        this.moveDown = true;
        max = Math.min(resultY, max);
      } else if (resultY < paddle.y) {
        this.moveUp = true;
        this.moveDown = false;
        min = Math.max(resultY, min);
      } else {
        this.moveUp = false;
        this.moveDown = false;
      }
    }

    // actually move the paddle
    if (this.moveUp) {
      y -= delta * this.speed;
    }
    if (this.moveDown) {
      y += delta * this.speed;
    }

    // clamp between min and max values
    y = this.clamp(y, min, max);

    // if something changed return it
    if (y !== paddle.y) {
      return {
        ...paddle,
        y
      };
    }
  }

  predictBallPosition(field, ball) {
    // NOTE this only takes care of paddles on the right, it is a dumb little AI
    const fieldHeight = field.height - ball.size;
    const fieldWidth = field.width - ball.size;
    const radius = ball.size * 0.5;
    const distance =
      ball.speedX > 0
        ? fieldWidth - ball.x - ball.size
        : -(fieldWidth + ball.x + ball.size);
    const timeUntillCollision = distance / ball.speedX;
    const deltaY = timeUntillCollision * ball.speedY;

    let resultY = ball.y + deltaY - radius;
    // check if it is an even number of bounces
    let bounceCount = 0;
    let remainder = resultY;
    if (resultY < 0) {
      bounceCount = Math.round(-resultY / fieldHeight);
      remainder = -resultY % fieldHeight;
    } else if (resultY > fieldHeight) {
      bounceCount = Math.round(resultY / fieldHeight);
      remainder = resultY % fieldHeight;
    }

    if (bounceCount % 2 === 1) {
      // it's an odd number of bounces
      resultY = fieldHeight - remainder;
    } else {
      // it's an even number of bounces
      resultY = remainder;
    }

    // TODO every now and again this is rather off, I could keep it as "mistakes",
    // but I would rather make this correct and make custom mistakes. Later

    // console.log("predicting position", {
    //   timeUntillCollision,
    //   remainder,
    //   bounceCount
    // });

    return resultY + radius;
  }

  clamp(number, min, max) {
    if (min > max) {
      [min, max] = [max, min];
    }

    if (number < min) {
      return min;
    }

    if (number > max) {
      return max;
    }

    return number;
  }

  clearType() {
    switch (this.type) {
      case TYPE_KEYBOARD:
        window.removeEventListener("keydown", this.boundHandlers.keydown);
        window.removeEventListener("keyup", this.boundHandlers.keyup);
        break;
      default:
        break;
    }
  }
  setType(type) {
    this.clearType();
    this.type = type;

    switch (type) {
      case TYPE_KEYBOARD:
        window.addEventListener("keydown", this.boundHandlers.keydown);
        window.addEventListener("keyup", this.boundHandlers.keyup);
        break;
      default:
        break;
    }
  }

  keydownHandler(event) {
    switch (event.keyCode) {
      case KEY_DOWN:
        this.moveDown = true;
        break;
      case KEY_UP:
        this.moveUp = true;
        break;
    }
  }
  keyupHandler(event) {
    switch (event.keyCode) {
      case KEY_DOWN:
        this.moveDown = false;
        break;
      case KEY_UP:
        this.moveUp = false;
        break;
    }
  }
}
