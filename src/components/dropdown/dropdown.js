import React, { useState } from "react";
import "./dropdown.scss";
import Scrollbars from "react-custom-scrollbars";

function Dropdown({
  dropdownItems,
  selectedItem,
  onSelect,
  closedText,
  locked,
  attributeName,
}) {
  let container;

  const [isOpen, setOpen] = useState(false);

  const closeOnBlur = (e) => {
    const newTarget = e.relatedTarget;
    if (
      (newTarget && newTarget.id === "dropdown-search-input") ||
      (container && container.contains(newTarget))
    ) {
      return;
    }
    setOpen(false);
  };

  const doSelectItem = (item, e) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect(item);
    setOpen(false);
  };

  const minContentsHeight = 36 * Math.max(dropdownItems.length, 1);

  return (
    <div
      tabIndex="0"
      onBlur={(e) => closeOnBlur(e)}
      onClick={() => (locked ? void 0 : setOpen(true))}
      className={"dropdown-container" + (locked ? " locked" : "")}
      ref={(div) => (container = div)}
    >
      <div className={"dropdown-closed"}>
        {selectedItem ? (
          attributeName ? (
            selectedItem[attributeName]
          ) : (
            selectedItem
          )
        ) : (
          <span className={"closed-text"}>{closedText}</span>
        )}
      </div>
      {isOpen ? (
        <div
          style={{ minHeight: minContentsHeight }}
          className={"dropdown-inner"}
        >
          <Scrollbars
            hideTracksWhenNotNeeded={true}
            style={{
              width: 165,
              height: Math.min(300, minContentsHeight),
            }}
          >
            <div className={"dropdown-contents"}>
              {dropdownItems.map((item) => (
                <div
                  onClick={(e) => doSelectItem(item, e)}
                  key={
                    "dropdown-item-" +
                    (attributeName ? item[attributeName] : item)
                  }
                  className={"dropdown-item"}
                >
                  <div className={"item-text"}>
                    {attributeName ? item[attributeName] : item}
                  </div>
                </div>
              ))}
            </div>
          </Scrollbars>
        </div>
      ) : null}
    </div>
  );
}
export default Dropdown;
