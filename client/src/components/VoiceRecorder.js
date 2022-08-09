import { useState, useEffect } from "react";

export const VoiceRecorder = () => {
  const [mediastatus, setMediastatus] = useState("Acquiring media");
  const [audioBlobURL, setAudioBlobURL] = useState("");
  const [chunks, setChunks] = useState(null);
  const [mediarecorder, setMediarecorder] = useState(null);

  useEffect(() => {
    // Lazily obtain recorder first time we're recording.
    if (!mediarecorder) {
      if (mediastatus === "Recording") {
        console.log("test");
        enableStream().then(setMediarecorder, console.error);
      }
      return;
    }
  }, [mediarecorder, mediastatus]);

  const voiceRecorderStart = () => {
    try {
      setMediastatus("Recording");
      mediarecorder.start();
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

    setChunks("");
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
