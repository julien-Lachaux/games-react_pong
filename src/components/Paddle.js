import React from "react";

export default function(props) {
  const { x, y, width, height } = props;

  const styles = {
    width: width + "px",
    height: height + "px",
    left: x + "px",
    top: y + "px"
  };
  return <div className="paddle" style={styles} />;
}
