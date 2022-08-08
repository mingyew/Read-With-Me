import { useState, useEffect } from "react";

export const VoiceRecorder = () => {
  const [mediastatus, setMediastatus] = useState("Acquiring media");
  const [audioBlobURL, setAudioBlobURL] = useState("");
  const [chunks, setChunks] = useState("");
  const [mediarecorder, setMediarecorder] = useState("");

  async function enableStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      return new MediaRecorder(stream);
    } catch (err) {
      setMediastatus(`${err}`);
    }
    setMediastatus("Idle");
  }

  useEffect(() => {
    // Lazily obtain recorder first time we're recording.
    if (mediarecorder === null) {
      if (mediastatus === "Recording") {
        enableStream().then(setMediarecorder, console.error);
      }
      return;
    }
  }, [mediarecorder]);

  const voiceRecorderStart = () => {
    try {
      console.log("test");
      mediarecorder.start();
      setMediastatus("Recording");
      mediarecorder.ondataavailable = (e) => {
        setChunks(e.data);
      };
      mediarecorder.onstop = voiceRecorderStop;
    } catch (err) {
      setMediastatus(`${err}`);
    }
  };

  const voiceRecorderStop = () => {
    const audioBlob = new Blob(chunks, { type: "audio/wav" });
    const audioURL = URL.createObjectURL(audioBlob);
    setAudioBlobURL(audioURL);
    setMediastatus("Stopped");

    chunks = [];
  };

  const saveFile = async () => {
    setMediastatus("Saving");
    const audioBlob = await fetch(audioBlobURL).then((r) => r.blob());
    return new File([audioBlob], "voice.wav", { type: "audio/wav" });
  };

  return {
    mediastatus,
    audioBlobURL,
    voiceRecorderStart,
    voiceRecorderStop,
    saveFile,
  };
};
