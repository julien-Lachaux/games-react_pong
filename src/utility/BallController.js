import Game from "../store/Game";

const COLLISION_SIDE = "x";
const COLLISION_TOP_BOTTOM = "y";
const COLLISION_CORNER = "c";

export default class BallController {
  moveBall(delta, ball, field, paddles) {
    // TODO put this in a separate controller, make it cleaner here
    let { x, y, speedX, speedY, size } = ball;
    const deltaX = speedX * delta;
    const deltaY = speedY * delta;
    const { width, height } = field;
    const radius = size * 0.5;

    // "predict" the new ball position
    x = x + deltaX;
    y = y + deltaY;

    ball.overlapping = false;
    // check collision with paddles
    for (let paddle of paddles) {
      let collision = this.isOverlappingPaddle({ x, y, radius }, paddle);
      if (collision === false) {
        continue;
      }
      ball.overlapping = true;

      // simply invert the overlap and speed to deflect the ball
      // TODO deflect directionally, m8 (in a different angle for a different place on the paddle)
      // deflect along the X-axis
      if (collision === COLLISION_SIDE || collision === COLLISION_CORNER) {
        if (speedX > 0) {
          x -= (x + radius - paddle.x) * 2;
        } else {
          x += (paddle.x + paddle.width - (x - radius)) * 2;
        }
        speedX = -speedX;
      }
      // deflect along the Y-axis
      if (
        collision === COLLISION_TOP_BOTTOM ||
        collision === COLLISION_CORNER
      ) {
        if (speedY > 0) {
          y -= (y + radius - paddle.y) * 2;
        } else {
          y += (paddle.y + paddle.height - (y - radius)) * 2;
        }
        speedY = -speedY;
      }
      // else should be impossible

      // in this case there can only be one paddle overlapping at the same time
      break;
    }

    // check playing field
    // use the ball size (radius) to make sure the ball does not go through the edges
    // TODO die on x collisions
    if (x < radius) {
      x = -x + size;
      speedX = -speedX;
      Game.scoreP2++;
    } else if (x > width - radius) {
      x = width - (x - width) - size;
      speedX = -speedX;
      Game.scoreP1++;
    }

    if (y < radius) {
      y = -y + size;
      speedY = -speedY;
    } else if (y > height - radius) {
      y = height - (y - height) - size;
      speedY = -speedY;
    }

    return {
      ...ball,
      x,
      y,
      speedX,
      speedY
    };
  }

  // based on https://stackoverflow.com/a/402010/1629723
  /**
   * @param ball object where the ball should end up
   * @param paddle object the paddle to check collisions with
   * @return false¦string false if not colliding, 'y' if top/bottom collision, 'x' if side collision, 'c' if corner
   */
  isOverlappingPaddle(ball, paddle) {
    // NOTE: it would be more efficient to store all these calculated values (like paddle.center.x)
    // but they should still be determined by the size as well, but those are just optimisations
    let halfWidth = paddle.width * 0.5;
    let halfHeight = paddle.height * 0.5;
    let distanceX = Math.abs(ball.x - (paddle.x + halfWidth));
    let distanceY = Math.abs(ball.y - (paddle.y + halfHeight));
    let radius = ball.radius;

    // the circle is completely out of bounds in one direction
    if (distanceX > halfWidth + radius) {
      return false;
    }
    if (distanceY > halfHeight + radius) {
      return false;
    }

    // the circle center is INSIDE the paddle
    if (distanceX <= halfWidth) {
      return COLLISION_TOP_BOTTOM;
    }
    if (distanceY <= halfHeight) {
      return COLLISION_SIDE;
    }

    // calculate the distance to the corner(s), this is done in a sort of local coordinate system
    // so there is no need to check which corner is the closest (also because using squared values)
    let cornerDistance =
      Math.pow(distanceX - halfWidth) + Math.pow(distanceY - halfHeight);

    return cornerDistance <= radius ? COLLISION_CORNER : false;
  }
}
