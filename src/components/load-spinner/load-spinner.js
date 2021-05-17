import React from "react";
import "./load-spinner.scss";

import SpinnerIcon from "../../assets/spinner.svg";

function LoadSpinner() {
  return (
    <div className={"load-spinner"}>
      <img alt="loader" className={"spinning-icon"} src={SpinnerIcon} />
    </div>
  );
}
export default LoadSpinner;
