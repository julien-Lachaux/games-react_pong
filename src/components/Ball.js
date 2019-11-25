import React from "react";

export default function(props) {
  const style = {
    transform: "translateX(" + props.x + "px) translateY(" + props.y + "px)",
    width: props.size + "px",
    height: props.size + "px",
    margin: props.size * -0.5 + "px",
    background: props.overlapping ? "red" : null
  };
  return <div className="ball" style={style} />;
}
