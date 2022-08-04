import React, { useState } from "react";
import DropdownTranslate from "./Dropdownbutton";
import { useReactMediaRecorder } from "react-media-recorder";
import { storage } from "../firebase";

import { Button, Popover, OverlayTrigger } from "react-bootstrap";
import { ref, uploadBytesResumable } from "firebase/storage";

const Translatebar = (props) => {
  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder(
    {}
  );

  const [progress, setProgress] = useState("0");

  const uploadAudio = (blob) => {
    if (!blob) return;
    const storageRef = ref(storage, `/files/`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on("state_changed", (snapshot) => {
      const prog =
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      setProgress(prog);
    });
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header>
        <div className="d-flex">
          <Button
            variant="success"
            size="sm"
            className="me-2"
            onClick={startRecording}
          >
            Start
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="me-2"
            onClick={stopRecording}
          >
            Stop
          </Button>
          <Button size="sm">Save</Button>
        </div>
        <div className="me-auto">
          <h5>{progress}% uploaded</h5>
        </div>
      </Popover.Header>
      <Popover.Body>
        <audio
          src={mediaBlobUrl}
          width={250}
          controls
          autoPlay
          loop
          style={{ width: 250 }}
        />
      </Popover.Body>
    </Popover>
  );

  return (
    <div
      className="px-3 py-2 border-bottom mb-3"
      style={{
        backgroundColor: "#D3D3D3",
      }}
    >
      <div className="container d-flex justify-content-end">
        <DropdownTranslate translateStory={props.translateStory} />
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
          <Button className="btn btn-light text-dark ms-2">Record</Button>
        </OverlayTrigger>
        <div className="ms-auto">
          <Button className="btn btn-light text-dark ms-2">Publish</Button>
        </div>
      </div>
    </div>
  );
};

export default Translatebar;
