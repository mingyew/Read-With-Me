import React, { useState, useEffect } from "react";
import DropdownTranslate from "./Dropdownbutton";
import { storage, colRef } from "../firebase";
import { addDoc } from "firebase/firestore";
import { VoiceRecorder } from "./VoiceRecorder";
import { useNavigate } from "react-router-dom";

import { ButtonGroup, ToggleButton, ToggleButtonGroup } from "react-bootstrap";

const Listenbar = (props) => {
  const [loading, setLoading] = useState(false);
  const [teacheraudio, setTeacheraudio] = useState(null);

  useEffect(() => {
    if (props.audioURL) {
      setLoading(true);
      setTeacheraudio(new Audio(props.audioURL));
    }
    setLoading(false);
  }, [props]);

  const audioStop = () => {
    if (teacheraudio) {
      teacheraudio.pause();
      teacheraudio.currentTime = 0;
    }
    return;
  };

  const audioPlay = () => {
    if (teacheraudio) {
      teacheraudio.addEventListener("canplaythrough", (event) => {
        teacheraudio.play();
      });
    }
    return;
  };

  return (
    <div
      className="px-3 py-2 border-bottom mb-3"
      style={{
        backgroundColor: "#F57C00 ",
      }}
    >
      {console.log(props.audioURL)}
      <div className="container d-flex">
        <div className="ms-auto">
          {/* <audio id="player" src={props.audioURL}></audio> */}
          {loading ? (
            <h4>Loading...</h4>
          ) : (
            <ButtonGroup>
              <ToggleButtonGroup
                type="radio"
                name="options"
                defaultValue="stop"
              >
                <ToggleButton
                  id="Listen"
                  variant="outline-success"
                  value="play"
                  onClick={audioPlay()}
                >
                  Listen
                </ToggleButton>
                <ToggleButton
                  id="pause"
                  variant="outline-secondary"
                  value="pause"
                  onClick={teacheraudio && teacheraudio.pause()}
                >
                  Pause
                </ToggleButton>
                <ToggleButton
                  id="srop"
                  variant="outline-danger"
                  value="stop"
                  onClick={() => audioStop()}
                >
                  Stop
                </ToggleButton>
              </ToggleButtonGroup>
            </ButtonGroup>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listenbar;
