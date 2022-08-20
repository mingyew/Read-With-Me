import React, { useState, useEffect, useRef } from "react";

import { Button } from "react-bootstrap";

const HighlightPop = (props) => {
  const [showPopover, setshowPopover] = useState(false);
  const [text, setText] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const highlight = useRef();
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
    const selectedText = selection.toString().trim();
    setText(selectedText);

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

  const texttoSpeech = (targetedLang) => {
    const arr = null;
    fetch("http://localhost:3001/api/text-to-speech", {
      method: "POST",
      body: JSON.stringify({ text: text, language: targetedLang }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        const arr = Uint8Array.from(response.data.data);
        playAudioStream(arr);
      });
  };

  const playAudioStream = async (array) => {
    const audioContext = new AudioContext();
    const audio = await audioContext.decodeAudioData(array.buffer);
    const source = audioContext.createBufferSource();

    source.buffer = audio;
    source.connect(audioContext.destination);
    source.start(0);
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
              <Button
                variant="warning"
                size="sm"
                className="me-2 align-items-center"
                onClick={() => texttoSpeech(props.lang)}
              >
                <img
                  src="/images/volumeblack.png"
                  style={{
                    height: 20,
                  }}
                />
              </Button>
              {text}
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
