import React, { useState } from "react";
import DropdownTranslate from "./Dropdownbutton";
import { storage, colRef } from "../firebase";
import { addDoc } from "firebase/firestore";
import { VoiceRecorder } from "./VoiceRecorder";
import { useNavigate } from "react-router-dom";

import { ButtonGroup, ToggleButton, ToggleButtonGroup } from "react-bootstrap";

const Listenbar = (props) => {
  return (
    <div
      className="px-3 py-2 border-bottom mb-3"
      style={{
        backgroundColor: "#F57C00 ",
      }}
    >
      <div className="container d-flex">
        <div className="ms-auto">
          <audio src={props.audioURL} id="audio"></audio>
        </div>
      </div>
    </div>
  );
};

export default Listenbar;
