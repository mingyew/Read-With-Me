import React, { useState, useEffect, createRef } from "react";

const HighlightPop = (props) => {
  const [showPopover, setshowPopover] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [selectedText, setselectedText] = useState("");
  const highlight = createRef();
  const { children, popoverItems } = props;
  const itemClass = "h-popover-item";

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const hidePopover = () => {
    setshowPopover(false);
  };

  const onMouseUp = () => {
    const selection = window.getSelection();
    if (selection) {
      setselectedText(selection.toString());
    } else if (document.selection && document.selection.type !== "Control") {
      setselectedText(document.selection.createRange().text);
    }

    if (!selectedText || !selectedText.length) {
      hidePopover();
      return;
    }

    const selectionRange = selection.getRangeAt(0);

    const startNode = selectionRange.startContainer.parentNode;
    const endNode = selectionRange.endContainer.parentNode;

    const highlightable = highlight.current;
    const highlightableRegion = highlightable.querySelector(".h-popable");

    if (highlightableRegion) {
      if (
        !highlightableRegion.contains(startNode) ||
        !highlightableRegion.contains(endNode)
      ) {
        hidePopover();
        return;
      }
    } else if (
      !highlightable.contains(startNode) ||
      !highlightable.contains(endNode)
    ) {
      hidePopover();
      return;
    }

    if (!startNode.isSameNode(endNode)) {
      hidePopover();
      return;
    }

    const { x, y, width } = selectionRange.getBoundingClientRect();
    if (!width) {
      hidePopover();
      return;
    }

    setX(x + width / 2);
    setY(y + window.scrollY - 10);
    setshowPopover(true);

    const { onHighlightPop = () => {} } = props;
    onHighlightPop(selectedText);
  };

  return (
    <div ref={highlight}>
      {showPopover && (
        <div
          className="h-popover"
          style={{ left: `${x}px`, top: `${y}px` }}
          role="presentation"
          onMouseDown={(e) => e.preventDefault()}
        >
          {popoverItems ? (
            popoverItems(itemClass)
          ) : (
            <span role="button" className={itemClass}>
              Add yours
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

HighlightPop.defaultProps = {
  onHighlightComment: null,
  onExitHighlight: null,
  popoverItems: null,
  children: null,
};

export default HighlightPop;
