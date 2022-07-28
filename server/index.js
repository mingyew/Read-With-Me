const express = require("express");
const cors = require("cors");
const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({
  projectId: "project_id=read-with-me-354921",
  keyFilename: "read-with-me-354921-a36e6788bf36.json",
});

const PORT = process.env.PORT || 3001;

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(express.json());
app.use(cors(corsOptions));

const translateText = async (text, targetedLang) => {
  try {
    const translation = await translate.translate(text, targetedLang);
    return translation;
  } catch (err) {
    return "Sorry! Translation did not work";
  }
};

const translateStory = async (story, targetedLang) => {
  var translatedStory = {};
  translatedStory.title = await translateText(story.text.title, targetedLang);
  translatedStory.body = await translateText(story.text.body, targetedLang);
  translatedStory.author = await translateText(story.text.author, targetedLang);
  return translatedStory;
};

app.post("/api/translate-text", async (req, res) => {
  const translation = await translateStory(req.body, req.body.language);
  res.json({ translated: translation });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
