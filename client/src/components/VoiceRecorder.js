import { useState } from "react";

export const VoiceRecorder = () => {
  const [mediastatus, setMediastatus] = useState("Idle");
  const [audioBlobURL, setAudioBlobURL] = useState(null);
  const [chunks, setChunks] = useState();
  const [mediarecorder, setMediarecorder] = useState(null);

  const Record = () => {
    if (!mediarecorder) {
      enableStream().then(setMediarecorder, console.error);
    }
    return;
  };

  const voiceRecorderStart = () => {
    try {
      setChunks();
      mediarecorder.start();
      mediarecorder.addEventListener("dataavailable", saveChunks);
      setMediastatus("Recording");
    } catch (err) {
      setMediastatus(`${err}`);
    }
  };

  const voiceRecorderStop = () => {
    mediarecorder.stop();
    setMediastatus("Stopped");
    mediarecorder.removeEventListener("dataavailable", saveChunks);
  };

  const saveFile = () => {
    setMediastatus("Saving");
  };

  const saveChunks = (e) => {
    setChunks(e.data);
    setAudioBlobURL(URL.createObjectURL(e.data));
  };

  return {
    Record,
    mediastatus,
    audioBlobURL,
    voiceRecorderStart,
    voiceRecorderStop,
  };
};

async function enableStream() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  return new MediaRecorder(stream);
}
