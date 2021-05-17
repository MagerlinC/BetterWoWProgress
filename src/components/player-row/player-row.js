import React from "react";
import "./player-row.scss";
function PlayerRow({ player, bgColor, textColor }) {
  return (
    <div style={{ backgroundColor: bgColor }} className={"player-row"}>
      <a className={"clickable"} href={player.url}>
        <div style={{ color: textColor }} className={"player-name"}>
          {player.name}
        </div>
        <div className={"player-server"}>{player.server}</div>
      </a>
    </div>
  );
}
export default PlayerRow;
