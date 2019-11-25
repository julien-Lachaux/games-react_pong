import React from "react";

// walls are purely visual elements, they do not affact the game (maybe later?)
export default function(props) {
  const { x, y, width, height } = props;
  const style = {
    top: y + "px",
    left: x + "px",
    width: width + "px",
    height: height + "px"
  };
  return <div className="wall" style={style} />;
}
