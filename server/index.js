const express = require("express");
const cors = require("cors");
const { Translate } = require("@google-cloud/translate").v2;
const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");

const translate = new Translate({
  projectId: "project_id=read-with-me-354921",
  keyFilename: "read-with-me-354921-a36e6788bf36.json",
});

const PORT = process.env.PORT || 3001;
const path = require("path");

const app = express();

var distDir = __dirname + "/public/";

app.use(express.static(distDir));

app.get("*", function (req, res) {
  res.sendFile(path.join(distDir, "index.html"));
});

app.use(express.json());
app.use("*", cors());
var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
app.use(allowCrossDomain);

//TRANSLATE
const translateText = async (text, targetedLang) => {
  const translation = await translate.translate(text, targetedLang);
  // this returns an array with 1 object:
  return translation[0];
};

const translateStory = async (story, targetedLang) => {
  var translatedStory = {};
  try {
    translatedStory.lang = targetedLang;
    translatedStory.title = await translateText(story.text.title, targetedLang);
    translatedStory.body = await translateText(story.text.body, targetedLang);
    translatedStory.author = await translateText(
      story.text.author,
      targetedLang
    );
    return translatedStory;
  } catch (err) {
    console.log("Sorry! Translation did not work: " + err);
    return null;
  }
};

//TEXT-TO-SPEECH
const client = new textToSpeech.TextToSpeechClient();

const texttoSpeech = async (text, targetedLang) => {
  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: targetedLang, ssmlGender: "NEUTRAL" },
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" },
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  return response.audioContent;
};

//HTTP REQUESTS

app.post("/api/text-to-speech", async (req, res) => {
  const audio = await texttoSpeech(req.body.text, req.body.language);
  res.json({ data: audio });
});

app.post("/api/translate-text", async (req, res) => {
  const translation = await translateStory(req.body, req.body.language);
  res.json({ translated: translation });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
