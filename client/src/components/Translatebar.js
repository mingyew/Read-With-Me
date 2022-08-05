import React, { useState } from "react";
import DropdownTranslate from "./Dropdownbutton";
import { useReactMediaRecorder } from "react-media-recorder";
import { storage } from "../firebase";

import { Button, Popover, OverlayTrigger, ProgressBar } from "react-bootstrap";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Translatebar = (props) => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({});

  const [progress, setProgress] = useState(0);

  const uploadAudio = async () => {
    const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
    const mediaFile = new File([audioBlob], "voice.wav", { type: "audio/wav" });

    if (!mediaFile) return;
    const storageRef = ref(storage, `/${props.uid}/`);
    const uploadTask = uploadBytesResumable(storageRef, mediaFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => console.log(url));
      }
    );
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
          <Button size="sm" onClick={() => uploadAudio(mediaBlobUrl)}>
            Save
          </Button>
          <div className="row ms-auto align-items-center">
            <h2 style={{ fontSize: 12 }}>{status}</h2>
            <ProgressBar
              striped
              now={progress}
              label={`${progress}% uploaded`}
            />
          </div>
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
      <div className="container d-flex">
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
