import React, { useState } from "react";
import DropdownTranslate from "./Dropdownbutton";
import { storage, storiesRef } from "../firebase";
import { addDoc, Timestamp } from "firebase/firestore";
import { VoiceRecorder } from "./VoiceRecorder";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Popover,
  OverlayTrigger,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Translatebar = (props) => {
  const [progress, setProgress] = useState(0);
  const [teacheraudio, setTeaacheraudio] = useState(null);
  const [arr, setArr] = useState(null);
  const navigate = useNavigate();

  const {
    mediastatus,
    audioBlobURL,
    Record,
    voiceRecorderStart,
    voiceRecorderStop,
  } = VoiceRecorder();

  const uploadAudio = async () => {
    const audioBlob = await fetch(audioBlobURL).then((r) => r.blob());
    const mediaFile = new File([audioBlob], { type: "audio/mp3" });

    if (!mediaFile) return;

    const storageRef = ref(
      storage,
      `/${props.uid}/${props.translatedStory.title}`
    );
    const uploadTask = uploadBytesResumable(storageRef, mediaFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => Alert(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) =>
          setTeaacheraudio(url)
        );
      }
    );
  };

  const addtoDB = (event) => {
    event.currentTarget.disabled = true;

    const docFields = {
      uid: props.uid,
      title: props.translatedStory.title,
      story: props.translatedStory.body,
      author: props.translatedStory.author,
      lang: props.translatedStory.lang,
      audioURL: teacheraudio,
      commentsURL: null,
      dateCreated: Timestamp.now(),
    };

    addDoc(storiesRef, docFields).then(() => {
      navigate("/");
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
            onClick={voiceRecorderStart}
          >
            Start
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="me-2"
            onClick={voiceRecorderStop}
          >
            Stop
          </Button>
          <Button size="sm" onClick={() => uploadAudio()}>
            Save
          </Button>
          <div className="row ms-auto align-items-center">
            <h2 style={{ fontSize: 12 }}>{mediastatus}</h2>
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
          src={audioBlobURL}
          width={250}
          controls
          autoPlay
          loop
          style={{ width: 250 }}
        />
      </Popover.Body>
    </Popover>
  );

  const texttoSpeech = (targetedLang) => {
    const arr = null;
    fetch("http://localhost:3001/api/text-to-speech", {
      method: "POST",
      body: JSON.stringify({
        text: props.translatedStory.body,
        language: targetedLang,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        const arr = Uint8Array.from(response.data.data);
        playAudioStream(arr);
        setArr(arr);
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

  const popovergenerate = (
    <Popover id="popover-basic">
      <Popover.Header>
        <div className="d-flex">
          <Button size="sm" onClick={() => uploadAudio()}>
            Save
          </Button>
          <div className="row ms-auto align-items-center">
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
          src={arr}
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
          <Button className="btn btn-light text-dark ms-2" onClick={Record}>
            Record Reading
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={popovergenerate}
        >
          <Button
            className="btn btn-light text-dark ms-2"
            onClick={texttoSpeech(props.translatedStory.lang)}
          >
            Generate Reading
          </Button>
        </OverlayTrigger>
        <div className="ms-auto">
          <Button className="btn btn-light text-dark ms-2" onClick={addtoDB}>
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Translatebar;
