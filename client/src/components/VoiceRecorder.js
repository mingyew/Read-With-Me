import { useState, useEffect } from "react";

export const VoiceRecorder = () => {
  const [mediastatus, setMediastatus] = useState("Acquiring media");
  const [audioBlobURL, setAudioBlobURL] = useState("");
  const [chunks, setChunks] = useState();
  const [mediarecorder, setMediarecorder] = useState(null);

  useEffect(() => {
    // Lazily obtain recorder first time we're recording.
    if (!mediarecorder) {
      enableStream().then(setMediarecorder, console.error);
    }
    return;
  }, [mediarecorder]);

  const saveChunks = (e) => {
    setChunks(e.data);
    setAudioBlobURL(URL.createObjectURL(e.data));
  };

  const voiceRecorderStart = () => {
    try {
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
    setChunks();
    mediarecorder.removeEventListener("dataavailable", saveChunks);
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

async function enableStream() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  return new MediaRecorder(stream);
}
